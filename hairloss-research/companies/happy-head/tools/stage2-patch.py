# Stage 2: adds experiments, observed evidence, rules, recommendations and summary to company.json.
# Usage: python3 -I tools/stage2-patch.py     (run ONCE, straight after tools/build-company.py; a second run appends notes twice)
import json, os
base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fn = os.path.join(base, 'company.json')
d = json.load(open(fn))
Q = {q['id']: q for f in d['flows'] for q in f['questions']}
P = {p['id']: p for p in d['products']}

def opt(qid, start):
    for o in Q[qid]['options']:
        if o['label'].startswith(start): return o
    raise KeyError((qid, start))

def obs(qid, start, run, effect=None, etype=None, affects=None):
    o = opt(qid, start)
    if effect: o['effect'] = effect
    if etype: o['effectType'] = etype
    if affects is not None: o['affects'] = affects
    if '(runs/' not in o['effect']: o['effect'] += ' Seen live: %s.' % run
    o['evidence'] = 'observed'
    Q[qid]['evidence'] = 'observed'

# ---------- experiments ----------
E = [
 ('baseline-men', 'none: baseline man replayed (pinned start URL)', 'Still works. Ends on the email + mobile page (account wall). Offer: Dual Treatment (p3) pre-selected + Topical (p1); recommendation call returned p1, p2 and the bundle; $89 + $89 list. 0 consultation posts.', 'runs/s2/baseline-men'),
 ('base-women', 'none: baseline woman replayed', 'Still works. Ends on the email page. Offer: Dual Treatment (p6: minoxidil 6% topical + spironolactone 25 mg capsule) + Topical (p4); $59 + $89 list.', 'runs/s2/base-women'),
 ('m-method-oral', 'm-method: Not sure -> Oral', 'Same products returned (call sends only "Oral"); second card becomes CHOOSE SUPERCAPSULE (p2) instead of Topical; capsule group listed first.', 'runs/s2/m-method-oral'),
 ('m-method-topical', 'm-method: Not sure -> Topical', 'No visible change against baseline: Dual + Topical cards; call sends only "Topical".', 'runs/s2/m-method-topical'),
 ('w-method-oral', 'm-method (woman): Not sure -> Oral', 'Second card becomes CHOOSE SUPERCAPSULE (spironolactone p5). Same products returned.', 'runs/s2/w-method-oral'),
 ('w-method-topical', 'm-method (woman): Not sure -> Topical', 'No visible change: Dual (p6) + Topical (p4).', 'runs/s2/w-method-topical'),
 ('w-50plus', 'm-sexage: Female under 50 -> Female 50 or older', 'Product family switches to the men\'s set: heading "Dutasteride + Minoxidil", Dual (dutasteride topical + dutasteride capsule) + Topical dutasteride 0.3%/minoxidil 8%. The call sends gender Female with a birth date 51 years ago.', 'runs/s2/w-50plus'),
 ('w-50plus-full', 'm-sexage: Female 50 or older, birth year 1970 to match, rest as baseline', 'Full walk to the email page. Still asked "able to become pregnant?" and birth control. Plan stays dutasteride (product_ids 116443, 274216). No warning about dutasteride and pregnancy for a woman who says she can become pregnant.', 'runs/s2/w-50plus-full'),
 ('m-goal-prevent', 'm-goals: regrow hairline -> I want to prevent future hair loss', 'No change: same call, same Dual dutasteride offer.', 'runs/s2/m-goal-prevent'),
 ('m-family-no', 'm-family: Yes -> No', 'No change: same call, same offer.', 'runs/s2/m-family-no'),
 ('m-pattern-patches', 'm-pattern-male: + Bald patches', 'No change and no warning (patchy loss is a possible alopecia areata sign): same Dual dutasteride offer.', 'runs/s2/m-pattern-patches'),
 ('m-pattern-other', 'm-pattern-male: + Another pattern of hair loss', 'One extra page "Please provide more details about your hair loss" (free text, answered neutrally). Offer unchanged.', 'runs/s2/m-pattern-other'),
 ('m-choose-topical', 'm-reco: Dual Treatment -> Topical (two clicks)', 'Check-up, blood pressure and weight pages disappear (3 fewer questions). Plan = topical dutasteride only (product_ids 116443, $89).', 'runs/s2/m-choose-topical'),
 ('m-oral-choose-capsule', 'm-method Oral, then m-reco: SuperCapsule only', 'Plan = dutasteride/minoxidil SuperCapsule only (product_ids 274216, $89). Check-up, blood pressure and weight still asked.', 'runs/s2/m-oral-choose-capsule'),
 ('m-household-yes-decline', 'm-household-preg: No -> Yes, then "No, I do not accept these risks"', 'Partner-pregnancy safety screen shown. After declining finasteride/dutasteride the quiz carries on and the plan still holds the dutasteride topical and capsule (product_ids unchanged). No warning, no switch.', 'runs/s2/m-household-yes-decline'),
 ('m-dob-under18', 'm-dob: 1994 -> 2010 (age 16)', 'Hard stop: "You must be over 18" appears and the NEXT button is removed. The product had already been recommended earlier in the quiz.', 'runs/s2/m-dob-under18'),
 ('m-dob-70', 'm-dob: 1994 -> 1956 (age 70)', 'No change and no message: no upper age limit, oral minoxidil and dutasteride stay in the plan.', 'runs/s2/m-dob-70'),
 ('w-dob-mismatch', 'm-dob (woman under 50): 1988 -> 1970 (age 56)', 'Sent back to the "Which option best describes you?" page with "There is a discrepancy between your date of birth and the selected age range. Please review it and try again."', 'runs/s2/w-dob-mismatch'),
 ('m-symptoms-itch', 'm-symptoms: None -> Severe itching, burning, or rash on my scalp', 'One extra free-text page "Please provide more details about your symptoms." No warning or stop although the question says these "may disqualify you". Plan unchanged.', 'runs/s2/m-symptoms-itch'),
 ('m-cond-heart', 'm-conditions: None -> Heart condition', 'One extra free-text page "Please provide additional details on your diagnoses and treatments". Oral minoxidil capsule stays in the plan; no warning.', 'runs/s2/m-cond-heart'),
 ('w-preg-no-postmeno', 'm-preg-ability: Yes -> No, then "I am post menopausal"', 'Birth-control page replaced by the "why can you not become pregnant" page. Plan unchanged (still spironolactone + minoxidil, not dutasteride, although she is post-menopausal and under 50).', 'runs/s2/w-preg-no-postmeno'),
 ('m-prior-oralfin-reaction', 'm-prior: None -> Oral Finasteride, then m-reactions: Yes (free text)', 'Reactions page and a text box appear. Plan unchanged: dutasteride (same drug class as finasteride) stays.', 'runs/s2/m-prior-oralfin-reaction'),
 ('m-custom-yes', 'm-custom: No -> Yes (text asks for finasteride instead of dutasteride)', 'Text box plus one extra page "Is there anything else you would like to share with your doctor". Plan unchanged; the request is only passed to the doctor.', 'runs/s2/m-custom-yes'),
]
d['experiments'] = [{'id': i, 'flow': 'main', 'changed': c, 'result': r, 'run': run} for i, c, r, run in E]

# ---------- option evidence ----------
obs('m-sexage', 'Male', 'runs/s2/baseline-men')
obs('m-sexage', 'Female under 50', 'runs/s2/base-women')
obs('m-sexage', 'Female 50 or older', 'runs/s2/w-50plus', 'Switches the product family to the men\'s dutasteride set (topical dutasteride 0.3%/minoxidil 8% and the dutasteride capsule), heading "Dutasteride + Minoxidil".', 'product-switched', ['p1', 'p2', 'p3'])
obs('m-method', 'Topical', 'runs/s2/m-method-topical', 'Second card is Topical; no visible difference from "not sure".', 'none')
obs('m-method', 'Oral', 'runs/s2/m-method-oral', 'Second card becomes SuperCapsule instead of Topical; same products returned.', 'product-switched', ['p2', 'p5', 'p1', 'p4'])
obs('m-method', 'I’m not sure', 'runs/s2/baseline-men')
obs('m-goals', 'I want to prevent', 'runs/s2/m-goal-prevent', 'No effect on the questions or the offer.', 'none')
obs('m-goals', 'I want to regrow', 'runs/s2/baseline-men')
obs('m-family', 'No', 'runs/s2/m-family-no', 'No effect on the questions or the offer.', 'none')
obs('m-family', 'Yes', 'runs/s2/baseline-men')
obs('m-pattern-male', 'Bald patches', 'runs/s2/m-pattern-patches', 'No effect on screen: no warning, same offer.', 'none')
obs('m-pattern-male', 'Another pattern', 'runs/s2/m-pattern-other', 'Adds a free-text page asking for more details. Offer unchanged.', 'extra-questions')
obs('m-reco', 'CHOOSE DUAL', 'runs/s2/baseline-men')
obs('m-reco', 'CHOOSE TOPICAL', 'runs/s2/m-choose-topical', 'Plan becomes the topical alone and the check-up, blood-pressure and weight questions are skipped.', 'skip-questions')
obs('m-reco', 'CHOOSE SUPERCAPSULE', 'runs/s2/m-oral-choose-capsule', 'Plan becomes the capsule alone; check-up, blood-pressure and weight questions are still asked.', 'product-switched')
obs('m-prior', 'Oral Finasteride', 'runs/s2/m-prior-oralfin-reaction', 'Adds the "Did you have any reactions?" question. Offer unchanged.', 'extra-questions')
obs('m-reactions', 'Yes', 'runs/s2/m-prior-oralfin-reaction', 'Opens a text box for details; flagged for the clinician (code). Dutasteride stays in the plan.', 'flag-for-clinician')
obs('m-symptoms', 'Severe itching', 'runs/s2/m-symptoms-itch', 'Adds a free-text details page; no warning or stop. Flagged for the clinician (code).', 'extra-questions')
obs('m-preg-ability', 'No', 'runs/s2/w-preg-no-postmeno', 'Shows "Please specify why you cannot become pregnant" instead of the birth-control question. Offer unchanged.', 'extra-questions')
obs('m-preg-ability', 'Yes', 'runs/s2/base-women')
obs('m-not-pregnant-why', 'I am post menopausal', 'runs/s2/w-preg-no-postmeno', 'Recorded only; offer unchanged (still spironolactone set for a woman who chose "under 50").', 'flag-for-clinician')
obs('m-household-preg', 'Yes', 'runs/s2/m-household-yes-decline', 'Adds the partner-pregnancy safety screen (finasteride/dutasteride risk). Flagged critical for the clinician (code).', 'extra-questions')
obs('m-preg-disclosure', 'No, I do not accept', 'runs/s2/m-household-yes-decline', 'Recorded only. The quiz carries on and the dutasteride topical and capsule stay in the plan; any change is left to the dermatologist.', 'flag-for-clinician')
obs('m-conditions', 'Heart condition', 'runs/s2/m-cond-heart', 'Adds a free-text page for details. Oral minoxidil stays in the plan; flagged for the clinician (code).', 'extra-questions')
obs('m-conditions', 'None', 'runs/s2/baseline-men')
obs('m-dob', 'Under 18', 'runs/s2/m-dob-under18', '"You must be over 18" and no NEXT button: the only hard stop.', 'hard-stop')
obs('m-dob', 'Woman whose age', 'runs/s2/w-dob-mismatch', 'Sent back to the sex/age-band page with a discrepancy message.', 'soft-warning')
obs('m-dob', 'Age 18 or over', 'runs/s2/m-dob-70', 'Carries on. No upper age limit (a 70-year-old man is treated like the baseline).', 'next-question')
obs('m-custom', 'Yes', 'runs/s2/m-custom-yes', 'Opens a text box and adds "Is there anything else you would like to share with your doctor". Offer unchanged; text goes to the doctor.', 'extra-questions')
obs('m-custom', 'No', 'runs/s2/baseline-men')
for qid in ['m-pattern-other', 'm-symptoms-detail', 'm-conditions-detail', 'm-not-pregnant-why', 'm-anything-else', 'm-preg-disclosure', 'm-reactions']:
    Q[qid]['evidence'] = 'observed'
for qid in ['m-last-doctor', 'm-bp', 'm-weight']:
    Q[qid]['evidence'] = 'observed'
    Q[qid]['branchDetail'] = (Q[qid].get('branchDetail') or '') + ' Seen live: shown for Dual and SuperCapsule plans, skipped for Topical only (runs/s2/m-choose-topical).'

# ---------- rules ----------
for r in d['rules']:
    if r['id'] == 'R3':
        r.update(evidence='observed', proof='runs/s2/w-50plus, runs/s2/w-50plus-full vs runs/s2/base-women', confidence='high',
                 then='Switched to the men\'s dutasteride set: Dual (dutasteride 0.3%/minoxidil 8% topical + dutasteride 0.5 mg/minoxidil 1.25 mg capsule) and Topical dutasteride. The recommendation call is sent with a birth date 51 years ago.')
    if r['id'] == 'R4':
        r.update(evidence='observed', proof='runs/s2/m-method-oral, m-method-topical, w-method-oral, w-method-topical', confidence='high')
    if r['id'] == 'R5':
        r.update(evidence='observed', proof='runs/s2/m-goal-prevent, m-family-no, m-pattern-patches, m-pattern-other vs runs/s2/baseline-men', confidence='high')
    if r['id'] == 'R6':
        r.update(evidence='observed', proof='runs/s2/m-choose-topical (skipped) and runs/s2/m-oral-choose-capsule (asked) vs runs/s2/baseline-men', confidence='high')
    if r['id'] == 'R7':
        r.update(evidence='observed', proof='runs/s2/m-dob-under18 (31.txt)', confidence='high')
    if r['id'] == 'R8':
        r.update(evidence='observed', proof='runs/s2/w-dob-mismatch (36.txt)', confidence='high',
                 then='She is sent back to the "Which option best describes you?" page with "There is a discrepancy between your date of birth and the selected age range. Please review it and try again." Choosing the other band switches the product family.')
    if r['id'] == 'R10':
        r.update(evidence='observed', confidence='high', proof='runs/s2/m-symptoms-itch, m-cond-heart, m-prior-oralfin-reaction, m-household-yes-decline, w-preg-no-postmeno, m-custom-yes, m-dob-70 (all product_ids unchanged against baseline)')
new = [
 ('R11', "m-household-preg = 'Yes'", 'The partner-pregnancy safety screen for finasteride/dutasteride is added. Choosing "No, I do not accept these risks" does not remove dutasteride: the plan is unchanged and the quiz carries on.', 'flag-for-clinician', ['p1', 'p2', 'p3'], 'observed', 'runs/s2/m-household-yes-decline', 'high'),
 ('R12', "m-reco = 'CHOOSE TOPICAL' (second click)", 'Plan = the topical alone; the check-up, blood-pressure and weight questions are skipped.', 'skip-questions', ['p1'], 'observed', 'runs/s2/m-choose-topical', 'high'),
 ('R13', "m-reco = 'CHOOSE SUPERCAPSULE' (only offered when method = Oral)", 'Plan = the capsule alone; check-up, blood-pressure and weight questions are still asked.', 'product-switched', ['p2'], 'observed', 'runs/s2/m-oral-choose-capsule', 'high'),
 ('R14', "m-symptoms = any unusual symptom (itch/burning/rash, pain/pus/sores, loss of brows/lashes/body hair)", 'One free-text details page is added. No warning or stop, even though the question says these "may disqualify you". Plan unchanged.', 'extra-questions', [], 'observed', 'runs/s2/m-symptoms-itch (other two options from code: raw/flow-dump.txt page 39)', 'high'),
 ('R15', "m-conditions = any condition (e.g. Heart condition)", 'One free-text details page is added. Oral minoxidil stays in the plan; nothing is removed.', 'extra-questions', [], 'observed', 'runs/s2/m-cond-heart', 'high'),
 ('R16', "m-prior = any treatment (e.g. Oral Finasteride)", 'Adds "Did you have any reactions?"; "Yes" opens a text box. A reaction to finasteride does not remove dutasteride.', 'extra-questions', [], 'observed', 'runs/s2/m-prior-oralfin-reaction', 'high'),
 ('R17', "Woman: m-preg-ability = 'No'", 'Asks why (post-menopausal, surgery, partner vasectomy, other) instead of birth control. The product family does not change: a post-menopausal woman who chose "under 50" keeps the spironolactone set.', 'extra-questions', [], 'observed', 'runs/s2/w-preg-no-postmeno', 'high'),
 ('R18', "m-custom = 'Yes'", 'A text box and an extra "anything else for your doctor?" page are added. A request such as "finasteride instead of dutasteride" does not change the plan in the quiz.', 'extra-questions', [], 'observed', 'runs/s2/m-custom-yes', 'high'),
 ('R19', "m-dob gives age 70 (man)", 'No upper age limit and no message: oral minoxidil and dutasteride stay in the plan.', 'none', [], 'observed', 'runs/s2/m-dob-70', 'high'),
 ('R20', "Woman 50 or older who says she can become pregnant", 'She is still offered dutasteride (topical and capsule) with no on-screen warning; the answer only goes to the dermatologist.', 'flag-for-clinician', ['p1', 'p2', 'p3'], 'observed', 'runs/s2/w-50plus-full', 'medium'),
 ('R21', "Real date of birth (asked near the end)", 'Not used for the product. The recommendation call is made before it with a birth date the page makes up from the age band (51 years ago for men and women 50+, 19 years ago for women under 50).', 'none', [], 'observed', 'POST body in runs/s2/*/network.jsonl, e.g. runs/s2/m-dob-70', 'high'),
]
have = {r['id'] for r in d['rules']}
for i, w, t, et, af, ev, pr, c in new:
    if i not in have:
        d['rules'].append({'id': i, 'flow': 'main', 'when': w, 'then': t, 'effectType': et, 'affects': af, 'evidence': ev, 'proof': pr, 'confidence': c})

# ---------- recommendations ----------
R = d['recommendations'][:2]
R[0]['note'] += ' Replayed 23 Nov 2026 (runs/s2/baseline-men): same result; list price $89 + $89 = $178 per 25 days, only in the API data, not on screen.'
R[1]['note'] += ' Replayed (runs/s2/base-women): same result; $59 + $89 = $148 per 25 days list.'
R += [
 {'profile': 'Man, baseline, method = Oral', 'offered': ['p3', 'p2'], 'default': 'p3', 'note': 'Dual pre-selected; second card SuperCapsule (dutasteride 0.5 mg, minoxidil 1.25 mg, D3). runs/s2/m-method-oral', 'evidence': 'observed'},
 {'profile': 'Man, baseline, method = Topical', 'offered': ['p3', 'p1'], 'default': 'p3', 'note': 'Same as baseline. runs/s2/m-method-topical', 'evidence': 'observed'},
 {'profile': 'Woman under 50, method = Oral', 'offered': ['p6', 'p5'], 'default': 'p6', 'note': 'Second card spironolactone SuperCapsule. runs/s2/w-method-oral', 'evidence': 'observed'},
 {'profile': 'Woman under 50, method = Topical', 'offered': ['p6', 'p4'], 'default': 'p6', 'note': 'Same as baseline woman. runs/s2/w-method-topical', 'evidence': 'observed'},
 {'profile': 'Woman 50 or older (any method answer tested: not sure)', 'offered': ['p3', 'p1'], 'default': 'p3', 'note': 'Gets the men\'s dutasteride set, even when she says she can become pregnant. runs/s2/w-50plus, w-50plus-full', 'evidence': 'observed'},
 {'profile': 'Man who picks the Topical card', 'offered': ['p1'], 'default': 'p1', 'note': '$89 per 25 days; three blood-pressure/check-up/weight questions skipped. runs/s2/m-choose-topical', 'evidence': 'observed'},
 {'profile': 'Man (method Oral) who picks the SuperCapsule card', 'offered': ['p2'], 'default': 'p2', 'note': '$89 per 25 days. runs/s2/m-oral-choose-capsule', 'evidence': 'observed'},
 {'profile': 'Anyone with a date of birth under 18', 'offered': [], 'default': None, 'note': 'Stopped on the date-of-birth page ("You must be over 18"). runs/s2/m-dob-under18', 'evidence': 'observed'},
 {'profile': 'Man with red flags (bald patches, scalp symptoms, heart condition, reaction to finasteride, pregnant partner who declines the risk, age 70)', 'offered': ['p3', 'p1'], 'default': 'p3', 'note': 'Identical to the baseline man in every case tested; flags go only to the dermatologist after checkout.', 'evidence': 'observed'},
]
d['recommendations'] = R

# ---------- products ----------
P['p1']['recommendedWhen'] = 'Man, or woman who picks "Female 50 or older", with method Topical or not sure: shown as the CHOOSE TOPICAL card; also inside the Dual bundle. Seen live (runs/s2/m-method-topical, w-50plus, m-choose-topical).'
P['p2']['recommendedWhen'] = 'Man or woman 50+: always inside the Dual bundle; its own CHOOSE SUPERCAPSULE card only when the method answer is Oral (runs/s2/m-method-oral, m-oral-choose-capsule).'
P['p3']['recommendedWhen'] = 'Default, pre-selected first card for every man and every woman who picks "50 or older", whatever the goal, pattern, medical answers or age (runs/s2/baseline-men, w-50plus and all one-change runs).'
P['p4']['recommendedWhen'] = 'Woman who picks "Female under 50" with method Topical or not sure: CHOOSE TOPICAL card (runs/s2/base-women, w-method-topical).'
P['p5']['recommendedWhen'] = 'Woman under 50: inside her Dual bundle; its own card only when the method answer is Oral (runs/s2/w-method-oral).'
P['p6']['recommendedWhen'] = 'Default, pre-selected first card for every woman who picks "Female under 50", including one who says she is post-menopausal (runs/s2/base-women, w-preg-no-postmeno).'
for p in d['products']:
    if p.get('recommendedWhen', '').strip().lower() in ('unknown', ''):
        p['recommendedWhen'] = 'Never offered by the anonymous assessment in any answer combination tested (inferred: sold from its own product page, which was not opened, or chosen by the dermatologist after checkout).'

# ---------- summary ----------
d['engineSummary'] = ('A three-input engine. Only sex, the woman\'s age band (under 50 or 50+) and the topical/oral preference reach the '
  'recommendation call, which runs before any medical question. Men and women 50+ get dutasteride + minoxidil; women under 50 get '
  'minoxidil topical + a spironolactone/minoxidil capsule. The topical + capsule "Dual" bundle is always first and pre-selected; '
  'the second card is Topical (or SuperCapsule if the person said Oral). After the choice, about 12 to 16 medical questions follow. '
  'They add follow-up pages (free text, reactions, partner-pregnancy consent, three blood-pressure questions for capsule plans) but '
  'never remove, switch or block a product: 21 live one-change tests changed the offer only through sex/age band and method. '
  'Answers are tagged important or critical for a dermatologist who reviews after checkout. The only hard stop is age under 18, and '
  'a woman whose birth date does not fit her band is sent back to choose again.')
d['strengths'] = [
 'Very short path to a named plan: six profile questions, then a clear two-card choice with a "best for" line on each.',
 'Leads with dutasteride and 8% minoxidil, stronger than most rivals\' first offer, and explains each ingredient.',
 'A clear age rule for women: no finasteride or dutasteride for women who say they are under 50, and a date-of-birth check that sends a mismatched woman back.',
 'Branching follow-ups capture detail where it matters (free text for symptoms, conditions, other patterns, reactions; a written partner-pregnancy consent).',
 'Asks blood pressure, weight and last check-up only when an oral capsule is chosen, keeping the topical path short.',
 'A customisation box lets the patient ask the doctor to change the formula.',
]
d['weaknesses'] = [
 'The product is chosen before any safety question, and the most intensive plan (dutasteride + oral minoxidil) is pre-selected for every man, even "just exploring" or "prevention only".',
 'Red flags do nothing on screen: bald patches, severe scalp symptoms ("may disqualify you"), heart disease with oral minoxidil, a reaction to finasteride, all leave the plan unchanged.',
 'A pregnant partner who declines finasteride/dutasteride still has dutasteride in the plan; a woman 50+ who can become pregnant is offered dutasteride with no warning.',
 'Goal, duration, family history and hair-loss pattern are asked "to personalise" but change nothing.',
 'Age comes from a self-chosen band; the real birth date is asked only at the end and does not change the product. No upper age limit.',
 'No price on the recommendation screen; price appears only after email and mobile number.',
 'Finasteride, the usual first-line drug, is never offered by the assessment.',
]
d['opportunities'] = [
 'Ask safety questions first and let them shape the offer: remove oral minoxidil for heart disease or low blood pressure, drop 5-alpha-reductase inhibitors when the patient declines them, refer patchy loss or scarring signs.',
 'Use goal, pattern and duration to offer a gentler start (topical only, finasteride) to "prevention" or "exploring" patients.',
 'Offer finasteride as first line with a plain comparison against dutasteride.',
 'Show the price on the recommendation screen before asking for contact details.',
 'Use the actual date of birth (not a band) and handle older adults and post-menopausal women under 50 explicitly.',
 'Ask about women\'s specific causes (iron, thyroid, PCOS, recent childbirth or illness), which this quiz does not ask.',
]
d['limitations'] = [l for l in d['limitations'] if not l.startswith('Only two patient profiles')] + [
 '21 one-change experiments plus the two baselines were run live (runs/s2/). Not tested live: goal "exploring", durations other than 1-3 years, family history "not sure", the other scalp symptoms and health conditions one by one, low/high blood pressure, weight bands, medicines and allergies "Yes", other birth-control answers, "accept" on the partner-pregnancy screen, the women\'s pattern options other than baseline, and all URL variants (problends, ot, s_p, upgrade, coupon, consult). Their effects come from the served quiz code, which shows none of them change the product.',
 'The recommendation service is on the server: only its inputs and outputs were seen. A woman 50+ with method Oral was not walked.',
 'Nothing after the email page (account wall) was seen: what the dermatologist changes, checkout prices and discounts are not observed.',
]
d['access']['coverageNote'] = (d['access'].get('coverageNote', '') + ' Stage 2: 21 one-change experiments and both baselines replayed live on 23 Nov 2026, all stopping at the email page with no consultation posted.').strip()
json.dump(d, open(fn, 'w'), indent=2, ensure_ascii=False)
print('ok', len(d['experiments']), 'experiments', len(d['rules']), 'rules', len(d['recommendations']), 'recommendations')
