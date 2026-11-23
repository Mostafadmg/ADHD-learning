#!/usr/bin/env python3
"""s3_make.py — stage 3 (VERIFY): write one answers file per verification replay into runs/verify-*.json.

Same format and helpers as s2_make.py. Three kinds of run:
  RETEST  an independent replay of a change stage 2 already made (does the rule still hold?)
  GAP     a one-change replay stage 2 did not make (another route, an untested option, another value)
  GROUP   a group test: several medical tick-boxes that were only seen in stage 1 multi-change scouts, ticked together.
          A group test that shows no visible change means none of its answers has a visible effect by itself
          (unless two effects cancel, which is unlikely). It is weaker than a one-change replay and is labelled so.
Step 'yd' (legal name) never gets an answer: the walk stops at the account wall.

Usage: python3 tools/s3_make.py            # writes every runs/verify-*.json below, prints the ids
       python3 tools/s3_make.py <id> ...   # only those
"""
import json, os, sys, copy
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import s2_make as M
base = M.base
dob, sex, resolve, CONSENT, STOPTICK, NEUTRAL = M.dob, M.sex, M.resolve, M.CONSENT, M.STOPTICK, M.NEUTRAL
PROMO_DROPS = "https://www.hairandme.com/c/suh/new?promocode=HGSHOPDROPS"

# id, flow, changed step, new answer, description, kind, rule(s) it tests
EXPS = [
 # ---- re-tests of the rules with the biggest consequences
 ('verify-m-age-17', 'men', 'el', dob('15122008'), "men-el-dob: 15/06/1994 (32) → 15/12/2008 (17 years 11 months). Independent re-test of runs/s2-m-age-17", 'retest'),
 ('verify-w-pg-yes', 'women', 'pg', ["Yes"], "women-pg: No → Yes (pregnant, breastfeeding or likely to conceive); the 'Pregnancy safety information' screen was ticked to carry on. Independent re-test of runs/s2-w-pg-yes", 'retest'),
 ('verify-m-mcm-heart', 'men', 'mcm', ["Any heart or cardiovascular condition"], "men-mcm: None of the above → Any heart or cardiovascular condition. Independent re-test of runs/s2-m-mcm-heart", 'retest'),
 ('verify-m-pp-decline', 'men', 'pp', ["I do not wish to be considered"], "men-pp: agree → I do not wish to be considered for dutasteride or finasteride. Independent re-test of runs/s2-m-pp-decline", 'retest'),
 ('verify-m-al-minoxidil', 'men', 'al', ["Minoxidil"], "men-al: No known allergies → Minoxidil (capsules still preferred). Independent re-test of runs/s2-m-al-minoxidil", 'retest'),
 ('verify-m-gender-nonbinary', 'men', 'pds', sex('Male', 'Non-Binary/Genderqueer/Agender/Gender Fluid'), "men-pds-gender: gender identity left blank → Non-Binary/Genderqueer/Agender/Gender Fluid (sex at birth still Male). Re-test of the 'You're not alone' rule with a second value as a single change", 'retest'),
 ('verify-m-bp-elevated-reading', 'men', 'mcm', ["High blood pressure"], "men-mcm: None of the above → High blood pressure or low blood pressure; follow-up answered 'Often elevated' with a typed reading of 180/110. Re-test of runs/s2-m-mcm-bp-elevated, plus the reading box", 'retest'),
 # ---- gaps: the same rules on the women's route as single changes (stage 2 had only multi-change scouts)
 ('verify-w-age-17', 'women', 'el', dob('15122008'), "women-el-dob: 15/06/1988 (38) → 15/12/2008 (17 years 11 months)", 'gap'),
 ('verify-w-mcf-bp', 'women', 'mcf', ["High blood pressure"], "women-mcf: None of the above → High blood pressure or low blood pressure; the follow-up screen was answered 'Well-controlled', no reading typed", 'gap'),
 ('verify-w-pt-yes', 'women', 'pt', ["Yes"], "women-pt: No → Yes (lives with pets)", 'gap'),
 ('verify-w-htaf-none', 'women', 'htaf', ["I have no hair loss or thinning"], "women-htaf: My middle parting is getting wider → I have no hair loss or thinning", 'gap'),
 ('verify-w-yhg-two', 'women', 'yhg', ["Prevent, stop or reverse hair loss", "Grow thicker and fuller hair", CONSENT], "women-yhg: one goal → two goals (added 'Grow thicker and fuller hair'); the top-goal screen was answered with the baseline goal", 'gap'),
 ('verify-w-entry-promo-drops', 'women', 'ct', None, "entry URL: /c/suh/new → /c/suh/new?promocode=HGSHOPDROPS (the button on The Drops product page), women's baseline answers", 'gap'),
 # ---- gaps: options never chosen, or chosen only in a multi-change scout
 ('verify-w-htaf-receding', 'women', 'htaf', ["I've noticed my hairline is going further back"], "women-htaf: My middle parting is getting wider → I've noticed my hairline is going further back / receding", 'gap'),
 ('verify-w-htaf-dontknow', 'women', 'htaf', ["I don't know what kind of hair loss I have"], "women-htaf: My middle parting is getting wider → I don't know what kind of hair loss I have", 'gap'),
 ('verify-m-htam-complete', 'men', 'htam', ["Complete hair loss"], "men-htam: Across the hairline → Complete hair loss", 'gap'),
 ('verify-m-gender-woman', 'men', 'pds', sex('Male', 'Woman/Girl'), "men-pds-gender: gender identity left blank → Woman/Girl (sex at birth still Male)", 'gap'),
 ('verify-w-gender-man', 'women', 'pds', sex('Female', 'Man/Boy'), "women-pds-gender: gender identity left blank → Man/Boy (sex at birth still Female)", 'gap'),
 ('verify-m-mdm-bph', 'men', 'mdm', ["Medication to treat benign prostate hyperplasia"], "men-mdm: No medicines → Medication to treat benign prostate hyperplasia (BPH)", 'gap'),
 ('verify-m-al-other', 'men', 'al', ["Other", {"fill": "textarea", "value": "Penicillin"}], "men-al: No known allergies → Other, with 'Penicillin' typed in the free-text box that opens", 'gap'),
 ('verify-w-htp-spiro', 'women', 'htp', ["Spironolactone tablets", STOPTICK], "women-htp: None of the above → Spironolactone tablets (+ the must-tick that appears)", 'gap'),
 ('verify-m-age-106', 'men', 'el', dob('15061920'), "men-el-dob: 15/06/1994 (32) → 15/06/1920 (106)", 'gap'),
]
EXTRA = {'verify-m-bp-elevated-reading': {'bp': ["Often elevated", {"fill": "input[name=\"4421\"]", "value": "180/110"}]}}
START = {'verify-w-entry-promo-drops': PROMO_DROPS}

# ---- group tests of medical tick-boxes that stage 1 only saw inside multi-change scouts (never contact details, never free text here)
GROUPS = [
 ('verify-w-group-medical', 'women', {
   'scc': ["Diagnosed eczema", "A diagnosed active infection", "Pain and/or burning sensation"],
   'mdf': ["Steroids or other medications"],
   'mcf': ["Pheochromocytoma", "Hypertrichosis", "PoTS syndrome"],
   'al': ["Minoxidil", "Finasteride", "Dutasteride", "Melatonin", "Urea", "Niacinamide", "Tretinoin", "Vitamin B6"]},
  "GROUP TEST (women, 4 medical screens changed together): scalp eczema / psoriasis + active infection + pain; scalp steroids; phaeochromocytoma + hypertrichosis + PoTS; allergic to all eight actives"),
 ('verify-m-group-medical', 'men', {
   'htp': ["Minoxidil tablets", "Spironolactone tablets", "Minoxidil spray", "Finasteride spray", "Dutasteride capsules", STOPTICK],
   'scc': ["Flaking or dandruff", "Redness and crusting", "Highly sensitive and irritable areas", "Pustules/lumps/cysts", "Pain and/or burning sensation"],
   'mdm': ["Steroids or other medications"],
   'mcm': ["Hypertrichosis", "PoTS syndrome"],
   'al': ["Dutasteride", "Melatonin", "Urea", "Niacinamide", "Tretinoin", "Vitamin B6"]},
  "GROUP TEST (men, 5 medical screens changed together): five previous products; five scalp symptoms; scalp steroids; hypertrichosis + PoTS; allergic to dutasteride, melatonin, urea, niacinamide, tretinoin and vitamin B6"),
]

if __name__ == '__main__':
    want = set(sys.argv[1:])
    for eid, flow, step, ans, desc, kind in EXPS:
        if want and eid not in want: continue
        b = json.load(open(os.path.join(base, f'baseline-{flow}.json')))
        a = copy.deepcopy(b)
        a['_about'] = f'Stage 3 (verify) one-change replay {eid} ({flow} baseline). Change: {desc}'
        a['_changed'] = {'flow': flow, 'step': step, 'desc': desc, 'stage': 3, 'kind': kind}
        a.pop('_patient', None)
        for k, v in NEUTRAL.items(): a['answers'].setdefault(k, v)
        if ans is not None: a['answers'][step] = [resolve(step, x) for x in ans] if isinstance(ans, list) else ans
        for k, v in EXTRA.get(eid, {}).items(): a['answers'][k] = [resolve(k, x) for x in v]
        if eid in START: a['start'] = START[eid]
        json.dump(a, open(os.path.join(base, 'runs', eid + '.json'), 'w'), indent=1, ensure_ascii=False)
        print(eid)
    for eid, flow, changes, desc in GROUPS:
        if want and eid not in want: continue
        b = json.load(open(os.path.join(base, f'baseline-{flow}.json')))
        a = copy.deepcopy(b)
        a['_about'] = f'Stage 3 (verify) GROUP TEST {eid} ({flow} baseline): several medical tick-boxes changed at once. {desc}'
        a['_changed'] = {'flow': flow, 'steps': list(changes), 'sweep': True, 'desc': desc, 'stage': 3, 'kind': 'group'}
        a.pop('_patient', None)
        for k, v in NEUTRAL.items(): a['answers'].setdefault(k, v)
        for k, v in changes.items(): a['answers'][k] = [resolve(k, x) for x in v]
        json.dump(a, open(os.path.join(base, 'runs', eid + '.json'), 'w'), indent=1, ensure_ascii=False)
        print(eid)
