#!/usr/bin/env python3
"""s2_make.py — stage 2 (EXPERIMENT): write one answers file per one-change experiment.

Each experiment = a baseline file + ONE changed answer. Labels may be given as a unique prefix of the
option label (resolved against quiz-definition.json, so no label is typed by hand in full).
Neutral answers for screens that only appear after some answers are added to every file
(hgp top goal, bp blood-pressure follow-up, pgc pregnancy information tick): they are used only if the
server serves that step. Step 'yd' (legal name) never gets an answer: the walk stops at the account wall.

Usage: python3 tools/s2_make.py            # writes runs/<id>.json for every experiment below, prints the ids
       python3 tools/s2_make.py <id> ...   # only those
"""
import json, os, sys, copy
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
QD = json.load(open(os.path.join(base, 'quiz-definition.json')))['steps']
CONSENT = "Please tick here to confirm that you agree to us holding (and looking after) the health data you share with us."
UK = "Yes, I live in the UK (excluding Channel Islands)."
STOPTICK = "Yes, I understand this."
PGTICK = "Yes, I've read and understood the information and would like to carry on."

def labels(step):
    out = []
    for v in QD.get(step, {}).get('variants', []):
        for q in v['definition'].get('questions', []):
            ic = q.get('inputConfig') or {}
            for o in ic.get('options') or []:
                if o.get('label') not in out: out.append(o.get('label'))
            if ic.get('option') and ic['option'].get('label') not in out: out.append(ic['option']['label'])
    return out

def resolve(step, a):
    if not isinstance(a, str): return a
    ls = labels(step)
    if a in ls: return a
    m = [l for l in ls if l and l.startswith(a)]
    if len(m) != 1: raise SystemExit(f'cannot resolve "{a}" on step {step}: {m or ls}')
    return m[0]

def dob(ddmmyyyy):
    d, m, y = ddmmyyyy[:2], ddmmyyyy[2:4], ddmmyyyy[4:]
    return {"byType": {"date_masked": [{"type": "input[name=\"3053\"]", "value": ddmmyyyy}, UK],
                       "date_split": [{"fill": "Day", "value": d}, {"fill": "Month", "value": m}, {"fill": "Year", "value": y}, UK]}}

# id, flow, changed step, new answer, plain description of the one change
EXPS = [
 ('s2-m-tile-women', 'men', 'tp', ["Treatment for women"], "men-tp: 'Treatment for men' → 'Treatment for women' (sex at birth still Male)"),
 ('s2-m-age-17', 'men', 'el', dob('15122008'), "men-el-dob: 15/06/1994 (32) → 15/12/2008 (17 years 11 months)"),
 ('s2-m-age-18', 'men', 'el', dob('15112008'), "men-el-dob: 15/06/1994 (32) → 15/11/2008 (18 years and 8 days)"),
 ('s2-m-age-85', 'men', 'el', dob('15061941'), "men-el-dob: 15/06/1994 (32) → 15/06/1941 (85)"),
 ('s2-w-pg-yes', 'women', 'pg', ["Yes"], "women-pg: No → Yes (pregnant, breastfeeding or likely to conceive); the new 'Pregnancy safety information' screen was ticked to carry on"),
 ('s2-m-htam-patches', 'men', 'htam', ["One or more patches"], "men-htam: Across the hairline → One or more patches of complete hair loss"),
 ('s2-m-htam-crown', 'men', 'htam', ["At the crown"], "men-htam: Across the hairline → At the crown"),
 ('s2-m-htam-allover-ext', 'men', 'htam', ["All over – extensive"], "men-htam: Across the hairline → All over – extensive"),
 ('s2-w-htaf-patches', 'women', 'htaf', ["One or more patches"], "women-htaf: My middle parting is getting wider → One or more patches of complete hair loss"),
 ('s2-w-htaf-eyebrows', 'women', 'htaf', ["I've lost hair from my eyebrows"], "women-htaf: My middle parting is getting wider → I've lost hair from my eyebrows, sideburns and hairline"),
 ('s2-w-htaf-allover', 'women', 'htaf', ["I've noticed thinning and volume loss all over"], "women-htaf: My middle parting is getting wider → I've noticed thinning and volume loss all over"),
 ('s2-m-htc-recent', 'men', 'htc', ["Recently, in the past few weeks"], "men-htc: Over a year ago → Recently, in the past few weeks"),
 ('s2-m-scc-infection', 'men', 'scc', ["A diagnosed active infection"], "men-scc: None of the above → A diagnosed active infection (e.g. folliculitis, candida, ringworm)"),
 ('s2-m-scc-eczema', 'men', 'scc', ["Diagnosed eczema"], "men-scc: None of the above → Diagnosed eczema, psoriasis or seborrheic dermatitis"),
 ('s2-m-mcm-bp', 'men', 'mcm', ["High blood pressure"], "men-mcm: None of the above → High blood pressure or low blood pressure; the new follow-up screen was answered 'Well-controlled', no reading typed"),
 ('s2-m-mcm-bp-elevated', 'men', 'mcm', ["High blood pressure"], "as s2-m-mcm-bp, then men-bp: Well-controlled → Often elevated (no reading typed)"),
 ('s2-m-mcm-heart', 'men', 'mcm', ["Any heart or cardiovascular condition"], "men-mcm: None of the above → Any heart or cardiovascular condition"),
 ('s2-m-mcm-pheo', 'men', 'mcm', ["Pheochromocytoma"], "men-mcm: None of the above → Pheochromocytoma"),
 ('s2-m-mcm-liver', 'men', 'mcm', ["Liver disease"], "men-mcm: None of the above → Liver disease"),
 ('s2-m-mcm-depression', 'men', 'mcm', ["Current or history of depression"], "men-mcm: None of the above → Current or history of depression, anxiety or mental health concerns"),
 ('s2-m-mcm-sexdys', 'men', 'mcm', ["Sexual dysfunction"], "men-mcm: None of the above → Sexual dysfunction (e.g. erectile dysfunction)"),
 ('s2-m-mcm-psa', 'men', 'mcm', ["Undergoing prostate-specific antigen"], "men-mcm: None of the above → PSA monitoring or personal / family history of prostate or testicular cancer"),
 ('s2-m-mcm-bph', 'men', 'mcm', ["Benign prostatic hyperplasia"], "men-mcm: None of the above → Benign prostatic hyperplasia (BPH) or any other disease of the prostate"),
 ('s2-m-mcm-breast', 'men', 'mcm', ["Personal or family history of male breast cancer"], "men-mcm: None of the above → Personal or family history of male breast cancer"),
 ('s2-w-mcf-pcos', 'women', 'mcf', ["Polyendocrine Metabolic Ovarian Syndrome"], "women-mcf: None of the above → Polyendocrine Metabolic Ovarian Syndrome (PMOS, formerly PCOS)"),
 ('s2-w-mcf-heart', 'women', 'mcf', ["Any heart or cardiovascular condition"], "women-mcf: None of the above → Any heart or cardiovascular condition"),
 ('s2-w-mp-postpartum', 'women', 'mp', ["I'm postpartum"], "women-mp: None of the above → I'm postpartum (given birth in the last 6 months)"),
 ('s2-w-mp-facial', 'women', 'mp', ["I have unwanted hair on my face"], "women-mp: None of the above → I have unwanted hair on my face"),
 ('s2-m-mdm-antidep', 'men', 'mdm', ["Antidepressants"], "men-mdm: No medicines → Antidepressants, anti-anxiety or medication for mental health reasons"),
 ('s2-m-mdm-bph', 'men', 'mdm', ["Medication to treat benign prostate hyperplasia"], "men-mdm: No medicines → Medication to treat benign prostate hyperplasia (BPH)"),
 ('s2-m-mdm-other', 'men', 'mdm', ["Other", {"fill": "textarea", "value": "Vitamin D"}], "men-mdm: No medicines → Other, with 'Vitamin D' typed in the free-text box that opens"),
 ('s2-m-al-minoxidil', 'men', 'al', ["Minoxidil"], "men-al: No known allergies → Minoxidil"),
 ('s2-m-al-finasteride', 'men', 'al', ["Finasteride"], "men-al: No known allergies → Finasteride"),
 ('s2-m-htp-fintabs', 'men', 'htp', ["Finasteride tablets", STOPTICK], "men-htp: None of the above → Finasteride tablets (+ the must-tick 'Yes, I understand this.' that appears)"),
 ('s2-w-htp-spiro', 'women', 'htp', ["Spironolactone tablets", STOPTICK], "women-htp: None of the above → Spironolactone tablets (+ the must-tick that appears)"),
 ('s2-m-tt-drops', 'men', 'tt', ["The Drops"], "men-tt: The Capsules → The Drops"),
 ('s2-m-pp-decline', 'men', 'pp', ["I do not wish to be considered"], "men-pp: agree → I do not wish to be considered for dutasteride or finasteride"),
 ('s2-w-tt-drops', 'women', 'tt', ["The Drops"], "women-tt: The Capsules → The Drops"),
 ('s2-m-pt-yes', 'men', 'pt', ["Yes"], "men-pt: No → Yes (lives with pets)"),
 ('s2-m-yhg-two', 'men', 'yhg', ["Prevent, stop or reverse hair loss", "Grow thicker and fuller hair", CONSENT], "men-yhg: one goal → two goals (added 'Grow thicker and fuller hair'); the new top-goal screen was answered with the baseline goal"),
 ('s2-m-di-trial', 'men', 'di', ["I want the discounted trial"], "men-di: long-term treatment → I want the discounted trial"),
 # spare / lower priority
 ('s2-m-al-other', 'men', 'al', ["Other", {"fill": "textarea", "value": "Penicillin"}], "men-al: No known allergies → Other, with 'Penicillin' typed in the free-text box that opens"),
 ('s2-m-age-106', 'men', 'el', dob('15061920'), "men-el-dob: 15/06/1994 (32) → 15/06/1920 (106)"),
 ('s2-w-htc-recent', 'women', 'htc', ["Recently, in the past few weeks"], "women-htc: Over a year ago → Recently, in the past few weeks"),
 ('s2-m-htam-complete', 'men', 'htam', ["Complete hair loss"], "men-htam: Across the hairline → Complete hair loss"),
 ('s2-m-yhg-health', 'men', 'yhg', ["Boost overall hair health", CONSENT], "men-yhg: 'Prevent, stop or reverse hair loss' → 'Boost overall hair health' (still one goal)"),
 ('s2-w-age-17', 'women', 'el', dob('15122008'), "women-el-dob: 15/06/1988 (38) → 15/12/2008 (17 years 11 months)"),
]
EXTRA = {'s2-m-mcm-bp-elevated': {'bp': ["Often elevated"]}}
NEUTRAL = {'hgp': ["Prevent, stop or reverse hair loss"], 'bp': ["Well-controlled"], 'pgc': [PGTICK]}


# ---------------------------------------------------------------- sweeps (group tests)
# A sweep changes SEVERAL low-priority answers at once (hair type, styling, skin tone, six-month wish, gender identity...).
# If a sweep shows no difference from the baseline pool, none of its changes has a visible effect by itself.
# If it does show one, follow up with one-change runs. Medical answers are never put in a sweep.
def sex(s, gender): return [{"select": "select[name='3039']", "value": {"label": s}}, {"select": "select[name='3054']", "value": {"label": gender}}]
def tone(label_value, pos): return {"byQuestion": {"9346": [label_value], "9348": [{"range": "input[type=range]", "value": pos}]}}
SWEEPS = [
 ('s2-m-sweep-1', 'men', {
   'yhg': ["Reverse hair thinning", "Improve my hairline, parting or crown", CONSENT], 'hgp': ["Reverse hair thinning"],
   'js': ["Still exploring my options"], 'pds': sex('Male', 'Man/Boy'), 'ht': ["Wavy"],
   'hs': ["Air dry", "Colour treatments", "Product-based styling", "Heat-based styling tools"],
   'ls': ["I rarely get more than 7 hours", "I've recently been through a major life event"],
   'htam': ["At the temples"], 'htc': ["Around three to six months ago"], 'st': tone("Pale. It always burns, never tans", 8),
   'smt': ["Hair that feels healthy from root to tip", "Hair that feels stronger and has less breakage", "Noticeably less hair falling out"]},
  "SWEEP (men, 11 non-medical answers changed together): goals 'Reverse hair thinning' + 'Improve my hairline, parting or crown' (top goal: Reverse hair thinning); Still exploring; gender identity Man/Boy; Wavy; four styling habits; little sleep + major life event; At the temples; three to six months ago; skin Pale; three other six-month wishes"),
 ('s2-m-sweep-2', 'men', {
   'yhg': ["Improve my hairline, parting or crown", "Boost overall hair health", CONSENT], 'hgp': ["Improve my hairline, parting or crown"],
   'pds': sex('Male', 'Transwoman/Transgirl'), 'ht': ["Curly"],
   'hs': ["Heatless styling", "Protective styles", "Chemical processing"],
   'htam': ["All over – moderate"], 'htc': ["Unsure"], 'st': tone("Darker shade of pale. It sometimes burns, tans evenly", 41)},
  "SWEEP (men, 8 non-medical answers changed together): goals 'Improve my hairline, parting or crown' + 'Boost overall hair health' (top goal: Improve my hairline...); gender identity Transwoman/Transgirl; Curly; three styling habits; All over – moderate; timing Unsure; skin Darker shade of pale"),
 ('s2-m-sweep-3', 'men', {
   'pds': sex('Male', 'Prefer not to say'), 'htam': ["Other/unsure"], 'st': tone("Light brown. It burns minimally, tans easily", 58),
   'sc': ["Oily"], 'di': ["I want the discounted trial"]},
  "SWEEP (men, 5 non-medical answers changed together): gender identity Prefer not to say; Other/unsure; skin Light brown; scalp Oily; influenced by the discounted trial"),
 ('s2-w-sweep-1', 'women', {
   'pds': sex('Female', 'Woman/Girl'), 'ht': ["Wavy"], 'hw': ["Twice a week"],
   'hht': ["Using hairstyles to hide thin areas", "Shaving my head", "Wearing a wig, hairpiece or extensions"], 'hdw': ["Unsure"],
   'htaf': ["The front of my parting is getting wider"], 'htc': ["Around three to six months ago"], 'st': tone("Brown. It very rarely burns, tans darkly easily", 75),
   'smt': ["Hair that feels healthy from root to tip", "Hair that feels stronger and has less breakage", "Noticeably less hair falling out"]},
  "SWEEP (women, 9 non-medical answers changed together): gender identity Woman/Girl; Wavy; washes twice a week; three ways of hiding hair loss; hard water Unsure; front of parting wider; three to six months ago; skin Brown; three other six-month wishes"),
 ('s2-w-sweep-2', 'women', {
   'pds': sex('Female', 'Transman/Transboy'), 'ht': ["Curly"], 'hw': ["Once a week or less"],
   'hs': ["Air dry", "Colour treatments", "Product-based styling", "Heat-based styling tools"],
   'htaf': ["I'm losing hair or thinning at my temples"], 'htc': ["Unsure"], 'st': tone("Dark brown or black. It always tans darkly", 92)},
  "SWEEP (women, 7 non-medical answers changed together): gender identity Transman/Transboy; Curly; four styling habits; washes once a week or less; thinning at the temples; timing Unsure; skin Dark brown or black"),
 ('s2-w-sweep-3', 'women', {
   'pds': sex('Female', 'Don’t know'), 'js': ["Still exploring my options"], 'ht': ["Coily"],
   'hs': ["Heatless styling", "Protective styles", "Chemical processing"], 'sc': ["Dry"],
   'htaf': ["I'm losing hair or thinning at my crown"], 'htc': ["Recently, in the past few weeks"], 'di': ["I want the discounted trial"]},
  "SWEEP (women, 8 non-medical answers changed together): gender identity Don't know; Still exploring; Coily; three styling habits; scalp Dry; thinning at the crown; noticed recently, in the past few weeks; influenced by the discounted trial"),
]
EXPS += [
 ('s2-w-htaf-receding', 'women', 'htaf', ["I've noticed my hairline is going further back"], "women-htaf: My middle parting is getting wider → I've noticed my hairline is going further back / receding"),
 ('s2-w-htaf-dontknow', 'women', 'htaf', ["I don't know what kind of hair loss I have"], "women-htaf: My middle parting is getting wider → I don't know what kind of hair loss I have"),
 # follow-up to the group test s2-m-sweep-2, where the men's 'You're not alone' screen went missing
 ('s2-m-gender-transwoman', 'men', 'pds', sex('Male', 'Transwoman/Transgirl'), "men-pds-gender: gender identity left blank → Transwoman/Transgirl (sex at birth still Male)"),
]
def res(step, v):
    if isinstance(v, list): return [resolve(step, x) for x in v]
    if isinstance(v, dict) and 'byQuestion' in v: return v
    return v

if __name__ == '__main__':
    want = set(sys.argv[1:])
    for eid, flow, step, ans, desc in EXPS:
        if want and eid not in want: continue
        b = json.load(open(os.path.join(base, f'baseline-{flow}.json')))
        a = copy.deepcopy(b)
        a['_about'] = f'Stage 2 one-change experiment {eid} ({flow} baseline). Change: {desc}'
        a['_changed'] = {'flow': flow, 'step': step, 'desc': desc}
        a.pop('_patient', None)
        for k, v in NEUTRAL.items(): a['answers'].setdefault(k, v)
        a['answers'][step] = [resolve(step, x) for x in ans] if isinstance(ans, list) else ans
        for k, v in EXTRA.get(eid, {}).items(): a['answers'][k] = [resolve(k, x) for x in v]
        json.dump(a, open(os.path.join(base, 'runs', eid + '.json'), 'w'), indent=1, ensure_ascii=False)
        print(eid)

    for eid, flow, changes, desc in SWEEPS:
        if want and eid not in want: continue
        b = json.load(open(os.path.join(base, f'baseline-{flow}.json')))
        a = copy.deepcopy(b)
        a['_about'] = f'Stage 2 SWEEP {eid} ({flow} baseline): several low-priority answers changed at once as a group test. {desc}'
        a['_changed'] = {'flow': flow, 'steps': list(changes), 'sweep': True, 'desc': desc}
        a.pop('_patient', None)
        for k, v in NEUTRAL.items(): a['answers'].setdefault(k, v)
        for k, v in changes.items(): a['answers'][k] = res(k, v)
        json.dump(a, open(os.path.join(base, 'runs', eid + '.json'), 'w'), indent=1, ensure_ascii=False)
        print(eid)
