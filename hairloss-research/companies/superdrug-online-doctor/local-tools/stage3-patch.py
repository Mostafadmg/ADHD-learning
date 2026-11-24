#!/usr/bin/env python3
"""Stage 3 (VERIFY) patch: edits company.json in place with the verification results.
Safe to run once on the stage-2 file (it checks for the verification block and stops if it is already there)."""
import json, os, sys
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(HERE, 'company.json')
c = json.load(open(P))
if 'verification' in c:
    sys.exit('verification block already present: not patching twice')

FLAG_NOTE = " (That the doctor sees and weighs this answer after payment is inferred; nothing on screen changes.)"

def q(flow, qid):
    f = next(f for f in c['flows'] if f['id'] == flow)
    return next(x for x in f['questions'] if x['id'] == qid)
def opt(flow, qid, label_start):
    return next(o for o in q(flow, qid)['options'] if o['label'].startswith(label_start))

# 1. 'flag-for-clinician' was labelled observed, but only "no change on screen" was observed.
downgraded = []
for f in c['flows']:
    for x in f['questions']:
        for o in x.get('options', []):
            if o['effectType'] == 'flag-for-clinician':
                o['effectType'] = 'none'
                if o['evidence'] == 'observed': o['effect'] += FLAG_NOTE
                downgraded.append(f"{x['id']} '{o['label'][:30]}'")

# 2. options never replayed in stage 2, now replayed
o = opt('men', 'men-q1', 'Yes, by a specialist')
o.update(effect="Questionnaire accepted; 'Your request' shows the same 9 options as baseline, no message (runs/verify-m-specialist)." + FLAG_NOTE,
         effectType='none', evidence='observed')
o = opt('men', 'men-q2', 'B')
o.update(effect="No photo item and no warning. Questionnaire accepted; 'Your request' shows the same 9 options as baseline (runs/verify-m-patB).",
         effectType='none', evidence='observed')
o = opt('men', 'men-q8', 'Any type of skin')
o.update(effect="Opens the required 'Please provide more details.' box (filled with 'Mild eczema on the arms'). Questionnaire accepted; same 9 options as baseline, no message (runs/verify-m-skin).",
         effectType='extra-questions', evidence='observed')
o = opt('men', 'men-q11a', 'Peanuts or Soya')
o.update(effect="Opens a required tick box saying some makers' tablets are unsuitable for peanut or soya allergy and asking the patient to check the leaflet. After ticking, the questionnaire is accepted and the same 9 options are shown (runs/verify-m-peanut).",
         effectType='soft-warning', evidence='observed')
o = opt('men', 'men-q11a', 'Other substances')
o.update(effect="Opens the required free-text box (filled with 'Latex'). Questionnaire accepted; same 9 options as baseline (runs/verify-m-othersub).",
         effectType='extra-questions', evidence='observed')
o = opt('men', 'men-q11a', 'Finasteride')
o['effect'] += ' Re-tested in stage 3: same result (runs/verify-m-finallergy).'
for qid in ('men-q11b',):
    for oo in q('men', qid)['options']:
        oo.update(evidence='observed', effect=oo['effect'] + ' Seen and ticked in runs/verify-m-peanut.')
    q('men', qid)['evidence'] = 'observed'
for oo in q('men', 'men-q2b')['options']:
    oo.update(evidence='observed', effect=oo['effect'] + ' Seen and ticked in runs/exp-m01 and runs/verify-m-patE (the photo item still blocked Next).')
q('men', 'men-q8a')['evidence'] = 'observed'
q('men', 'men-q11d')['evidence'] = 'observed'

# 3. rules
R = {r['id']: r for r in c['rules']}
def addproof(rid, s): R[rid]['proof'] += '; stage 3 re-test: ' + s
addproof('R1', 'runs/verify-m-patA (A) and runs/verify-m-patE (E, warning ticked): Next blocked, red "Please upload photos", no save call. Confirmed.')
addproof('R2', 'runs/verify-m-patE. Confirmed.')
R['R3']['proof'] = 'runs/s2-baseline-men and runs/verify-base-men (C), runs/exp-m15 (D), runs/verify-m-patB (B, stage 3)'
R['R3']['then'] = 'No photo and no warning; the full list is shown.'
R['R9']['when'] = ("Any single answer change on the men's questionnaire other than hair pattern A, E or 'No pattern fits well' (R1): "
                   "including prostate cancer, breast cancer, skin condition, finasteride, peanut or other allergies, lactose intolerance, "
                   "diagnosis by a specialist, pattern B or D, and past side effects such as low mood")
R['R9']['effectType'] = 'none'
R['R9']['then'] = ('The product list never changes: 4 generic finasteride packs, 4 Propecia packs and the phone consultation, at the same prices. '
                   'No product-rules call is made (fhir_product_filter_enabled = 0). The help pages say a doctor reviews the order after account '
                   'creation and payment; that the doctor acts on these answers is inferred, not seen.')
addproof('R9', 'runs/verify-m-prostate, verify-m-finallergy, verify-m-patB, verify-m-specialist, verify-m-skin, verify-m-peanut, verify-m-othersub: list unchanged in all 7. Confirmed.')
addproof('R10', 'runs/verify-m-finallergy: no warning, no follow-up, 9 options. Confirmed.')
addproof('R11', 'runs/verify-w-patchy and runs/verify-w-shaved: suggestions:[9895328], Regaine for Women gone. Confirmed.')
addproof('R12', 'runs/verify-w-bp: suggestions:[9895328]. Confirmed.')
addproof('R14', 'runs/verify-w-minox: suggestions:[9895328]. Confirmed.')
addproof('R15', 'runs/verify-w-fish: suggestions:[9895329]. Confirmed. The Nourkrin page says it contains Marilex, a fish extract (docs).')
R['R15']['then'] = 'Nourkrin is removed. Reason (docs): the Nourkrin page says it contains Marilex, a fish extract.'
addproof('R16', 'runs/verify-w-caffeine: suggestions:[9895330,9895331]. Confirmed.')
addproof('R17', 'runs/verify-w-pregnant: product-rules reply empty, all 5 options. Confirmed.')
addproof('R19', 'runs/verify-base-wnour: same 5 options, Nourkrin first. Confirmed.')
R['R20']['then'] = ('No answer ends the consultation with a stop screen before the account wall; the phone consultation is always offered, even when '
                    'every product has been removed (runs/verify-w-combo3). The engine only shows warnings (men), blocks for photos (men patterns A, E, '
                    'none fits), or silently removes products (women).')
addproof('R20', 'runs/verify-w-combo3 (three allergies: only the phone consultation left, no message, no stop).')
c['rules'].append({
    'id': 'R21', 'flow': 'women',
    'when': 'Several removal answers together (combinations), e.g. high blood pressure + fish allergy, or minoxidil + fish + caffeine allergy',
    'then': ("The removals add up: the product-rules reply carries one suggestions entry per triggered rule and every listed product goes. "
             "High blood pressure + fish allergy leaves only the two Alpecin shampoos and the phone consultation. Minoxidil + fish + caffeine allergy "
             "leaves only the £25 phone consultation, with no message explaining why and no stop screen."),
    'effectType': 'product-removed', 'affects': ['p7', 'p8', 'p5', 'p6'], 'evidence': 'observed',
    'proof': 'runs/verify-w-combo-heart-fish (data:[{suggestions:[9895328]},{suggestions:[9895329]}]); runs/verify-w-combo3 (three entries, only 9894989 left) vs runs/verify-base-wreg',
    'confidence': 'high'})
c['rules'].append({
    'id': 'R22', 'flow': 'men',
    'when': "men-q11a includes 'Peanuts or Soya'",
    'then': "A required tick box warns that some makers' tablets are unsuitable for peanut or soya allergy and asks the patient to check the leaflet; after the tick the full list is shown.",
    'effectType': 'soft-warning', 'affects': ['p1', 'p2'], 'evidence': 'observed',
    'proof': 'runs/verify-m-peanut vs runs/verify-base-men', 'confidence': 'high'})

# 4. experiments
V = [
 ('verify-base-men', 'men', 'none (stage 3 baseline replay, exp.js)', "Same 9 options and prices as recorded (finasteride £27/£54/£79/£137, Propecia £60/£110/£140/£265, phone £25). Save reply data:[]. No product-rules call. Matches."),
 ('verify-base-wreg', 'women', 'none (stage 3 baseline replay, Regaine entry)', 'Same 5 options and prices (Regaine for Women £25, Nourkrin £51, Alpecin £7.50, Double Effect £9.99, phone £25). Product-rules data:[]. Matches.'),
 ('verify-base-wnour', 'women', 'none (stage 3 baseline replay, Nourkrin entry)', 'Same 5 options, Nourkrin first. Product-rules data:[]. Matches.'),
 ('verify-m-patA', 'men', 'men-q2: C -> A', "Photo item; Next does nothing; red 'Please upload photos'; no save call. Matches R1."),
 ('verify-m-patE', 'men', 'men-q2: C -> E (warning ticked)', "Photo item and warning tick; Next blocked by 'Please upload photos'. Matches R1/R2."),
 ('verify-m-prostate', 'men', 'men-q8: None -> Prostate cancer', 'Same 9 options, no message, no product-rules call. Matches R9.'),
 ('verify-m-finallergy', 'men', 'men-q11: No -> Yes, Finasteride', 'Same 9 options, no warning or follow-up. Matches R10.'),
 ('verify-w-bp', 'women', 'women-q2: No -> Yes', 'suggestions:[9895328]; Regaine for Women gone, 4 left. Matches R12.'),
 ('verify-w-patchy', 'women', 'women-q1: none -> sudden or patchy', 'suggestions:[9895328]; Regaine for Women gone. Matches R11.'),
 ('verify-w-shaved', 'women', 'women-q1: none -> a shaved scalp', 'suggestions:[9895328]; Regaine for Women gone. Matches R11.'),
 ('verify-w-minox', 'women', 'women-q7a: Minoxidil', 'suggestions:[9895328]. Matches R14.'),
 ('verify-w-fish', 'women', 'women-q7a: Fish', 'suggestions:[9895329]; Nourkrin gone. Matches R15.'),
 ('verify-w-caffeine', 'women', 'women-q7a: Caffeine', 'suggestions:[9895330,9895331]; both Alpecin shampoos gone. Matches R16.'),
 ('verify-w-pregnant', 'women', "women-q4: No -> I'm pregnant", 'Product-rules data:[]; all 5 options; no warning. Matches R17.'),
 ('verify-w-combo-heart-fish', 'women', 'COMBINATION women-q2 Yes + women-q7a Fish', 'Two suggestions entries; Regaine for Women and Nourkrin gone; Alpecin x2 + phone left. New rule R21.'),
 ('verify-w-combo3', 'women', 'COMBINATION women-q7a Minoxidil + Fish + Caffeine', 'Three suggestions entries; only the £25 phone consultation left; no message, no stop. New rule R21.'),
 ('verify-m-patB', 'men', 'men-q2: C -> B', 'No photo, no warning; same 9 options. First live replay of B.'),
 ('verify-m-specialist', 'men', "men-q1: self-diagnosis -> Yes, by a specialist", 'Same 9 options. First live replay.'),
 ('verify-m-skin', 'men', "men-q8: None -> Any type of skin conditions (details 'Mild eczema on the arms')", 'Required details box; same 9 options. First live replay.'),
 ('verify-m-peanut', 'men', 'men-q11a: Peanuts or Soya (warning ticked)', 'Required leaflet-check tick appears; same 9 options. New rule R22.'),
 ('verify-m-othersub', 'men', "men-q11a: Other substances (details 'Latex')", 'Required free-text box; same 9 options. First live replay.'),
]
for i, fl, ch, res in V:
    c['experiments'].append({'id': i, 'flow': fl, 'changed': ch, 'result': res, 'run': 'runs/' + i})

# 5. recommendations
for r in c['recommendations']:
    if r['profile'].startswith('Baseline man'): r['note'] += ' Re-confirmed in runs/verify-base-men.'
    if r['profile'].startswith('Any man with any single change'):
        r['profile'] = ("Any man with any single change tested other than pattern A, E or none fits (prostate or breast cancer, liver or skin condition, "
                        "finasteride, peanut, lactose or other allergy, ED, scalp symptoms, sudden or recent loss, past side effects, specialist diagnosis, pattern B or D)")
        r['note'] += ' Stage 3 added runs/verify-m-prostate, verify-m-finallergy, verify-m-patB, verify-m-specialist, verify-m-skin, verify-m-peanut, verify-m-othersub; peanut adds a warning tick.'
    if r['profile'].startswith('Baseline woman'): r['note'] += ' Re-confirmed in runs/verify-base-wreg and verify-base-wnour.'
c['recommendations'].append({'profile': 'Woman with high blood pressure and a fish allergy', 'offered': ['p5', 'p6', 'p9'], 'default': None,
    'note': 'Regaine for Women and Nourkrin both removed; only the two Alpecin shampoos and the phone consultation. (runs/verify-w-combo-heart-fish)', 'evidence': 'observed'})
c['recommendations'].append({'profile': 'Woman allergic to minoxidil, fish and caffeine', 'offered': ['p9'], 'default': None,
    'note': 'Every product removed; only the £25 phone consultation is left, with no explanation. (runs/verify-w-combo3)', 'evidence': 'observed'})

# 6. text fields
c['limitations'] = [l for l in c['limitations'] if not l.startswith('Not replayed') and not l.startswith('Only one change at a time')]
c['limitations'].insert(3, "Not replayed: delivery options other than free standard (men) and all delivery options in the women's flow; women-q4 'breastfeeding' was replayed only in stage 2; men 'Other medications' allergy (same box as 'Other substances', which was replayed).")
c['limitations'].insert(4, 'Only two combinations of answers were tried (both women). Other combinations, and any combination in the men\'s flow, are covered only by the code (men\'s filter off).')
c['access']['coverageNote'] = ("Stage 1 mapped all three entry points and both full questionnaire definitions. Stage 2 replayed the three baselines and ran 40 one-change "
    "experiments (22 women, 18 men). Stage 3 (independent check) replayed the baselines again, re-tested 11 key rules live, added the last untested men's options "
    "(specialist diagnosis, pattern B, skin condition, peanut and other-substance allergy) and two women's combinations. Every question option except delivery choices "
    "and the men's 'Other medications' allergy has now been replayed. Age, sex and the doctor's decision sit behind the account wall and were not tested.")
c['engineSummary'] = c['engineSummary'].replace('Pregnancy changes nothing.',
    'Removals add up: a woman allergic to minoxidil, fish and caffeine is left with only the phone consultation, with no message. Pregnancy changes nothing.')
c['weaknesses'] = [w.replace('with no warning; everything waits', 'with no answer-specific warning (only the general consent text); everything waits') for w in c['weaknesses']]
c['weaknesses'].append('A woman with several allergies can be left with only the £25 phone consultation and no explanation (runs/verify-w-combo3).')
for p in c['products']:
    if p['id'] in ('p3', 'p4', 'p5', 'p6'):
        p['priceDetail'] = p['priceDetail'].replace('Hair-loss page', "Men's hair-loss treatment page (/hair-loss-treatment.html)")

c['verification'] = {
 'checked': [
  'Baselines replayed fresh (runs/verify-base-men, verify-base-wreg, verify-base-wnour): same products, order, prices and empty server replies as recorded.',
  'R1 photo block (patterns A and E) re-tested live: confirmed (runs/verify-m-patA, verify-m-patE).',
  'R2 pattern E warning tick: confirmed (runs/verify-m-patE).',
  'R9 men list never changes: confirmed in 7 more replays (prostate cancer, finasteride allergy, pattern B, specialist, skin condition, peanut, other substance).',
  'R10 finasteride allergy does nothing: confirmed (runs/verify-m-finallergy).',
  'R11 non-pattern presentations remove Regaine for Women: confirmed for sudden or patchy and shaved scalp (runs/verify-w-patchy, verify-w-shaved).',
  'R12 high blood pressure removes Regaine for Women: confirmed (runs/verify-w-bp).',
  'R14 minoxidil allergy removes Regaine for Women: confirmed (runs/verify-w-minox).',
  'R15 fish allergy removes Nourkrin: confirmed (runs/verify-w-fish).',
  'R16 caffeine allergy removes both Alpecin shampoos: confirmed (runs/verify-w-caffeine).',
  'R17 pregnancy changes nothing: confirmed (runs/verify-w-pregnant).',
  'R20 no stop screen: confirmed, even when every product is removed (runs/verify-w-combo3).',
  'Product facts checked on live pages (runs/verify-pages): finasteride 1mg £27/£54/£79/£137 and HL40 prices; Propecia 1mg £60/£110/£140/£265 (Organon); Regaine for Men 50mg/g foam 3x73ml £65.99 and 5% w/w solution 3x60ml £70.00 (HL30 on its page, HL40 £39.59/£42.00 on /hair-loss-treatment.html); Alpecin 250ml £7.50 and Double Effect 200ml £9.99 (caffeine); Regaine for Women 2% w/w 60ml £25.00; Nourkrin Woman 60 tablets £51.00 with Marilex fish extract; express delivery £3.99. All match.',
  "Product links: Regaine for Men and Alpecin pages send to the men's service 147929, which (verify-base-men) offers neither: confirmed. Regaine for Women and Nourkrin pages send to 147757 and 147778: confirmed.",
  'Every run folder cited in company.json exists; spot-checked stage-2 runs exp-m07 (ED warning text), exp-m08 (see your GP text), exp-m11, exp-m16, exp-w04, w08, w14, w15, m03, m04, m17 summaries: they show what is claimed.'],
 'corrected': [
  "Options and rule R9 labelled 'flag-for-clinician' with evidence 'observed' were changed to effectType 'none': the replays only show that nothing changes; that the doctor acts on the answer is inferred. Affected: " + '; '.join(downgraded) + '.',
  "R9 said 'any single answer change' but patterns A, E and 'none fits' block the form (R1); its condition now excludes them.",
  "R15's reason for removing Nourkrin is now cited to the product page (Marilex fish extract) instead of being called inferred.",
  "Untested options now replayed and relabelled observed: men-q1 'by a specialist', men-q2 B, men-q8 skin condition, men-q11a peanuts or soya (warning tick, new R22) and other substances.",
  'Combinations were listed as untested; two were run and they show removals add up and can leave only the phone consultation (new R21, two new recommendation profiles).',
  "Product price notes said 'hair-loss page' for the HL40 Regaine/Alpecin prices; the page is /hair-loss-treatment.html (the consultation page shows no price table)."],
 'stillUnverified': [
  'Anything after the account wall: age and sex checks, ID check, what the doctor declines or changes, address and payment.',
  "What happens after a photo upload for men's patterns A, E and 'none fits' (we never upload).",
  'Whether the server-side questionnaire evaluator (zava.questionnaire_evaluator.cds tag) flags answers for the doctor: inferred from its name only.',
  "Women's product rules for answers never sent: the rules live on the server and are known only from replies.",
  "Delivery options other than men's free standard delivery; women's 'breastfeeding' (stage 2 only); men's 'Other medications' allergy.",
  'Regaine legal class (P or GSL) is not stated by the site.'],
 'verdict': ("This report can be trusted for what it says about the anonymous part of the journey. Every baseline and all 11 high-consequence rules I re-tested "
             "came out the same as recorded, the product names, strengths and prices match the live pages, and every run folder cited exists. The main "
             "faults were labelling, not facts: 'flag-for-clinician' was claimed as observed when only 'no change' was seen, and a few options were filled "
             "in from the definition; these are now corrected or replayed. The report says nothing reliable about what the doctor does after payment, about "
             "age or sex handling, or about men who need to upload photos, and it is honest about that.")}

json.dump(c, open(P, 'w'), indent=1, ensure_ascii=False)
print('patched; downgraded:', len(downgraded))
