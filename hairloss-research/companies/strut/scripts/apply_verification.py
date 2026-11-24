#!/usr/bin/env python3
"""Stage 3 (VERIFY), 23 Nov 2026: patch company.json in place with the results of the independent re-check.

Run AFTER scripts/build_company.py (which regenerates company.json from scratch):
    python3 -I scripts/build_company.py && python3 -I scripts/apply_verification.py
It is safe to run twice (it checks before adding).
"""
import json, os
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(here)
path = os.path.join(root, 'company.json')
c = json.load(open(path, encoding='utf-8'))

def rule(rid): return next(r for r in c['rules'] if r['id'] == rid)
def flow(fid): return next(f for f in c['flows'] if f['id'] == fid)
def q(fid, qid): return next(x for x in flow(fid)['questions'] if x['id'] == qid)
def opt(fid, qid, label): return next(o for o in q(fid, qid)['options'] if o['label'] == label)
def prod(pid): return next(p for p in c['products'] if p['id'] == pid)

OM = 'oral-minoxidil'
# ---------- experiments (stage 3 runs) ----------
NEW_EXP = [
 ('verify-baseline-min', 'none: stage 3 fresh replay of the oral minoxidil baseline with the standard tools/walk.js (en-US, America/Chicago)',
  'Matches the recorded baseline exactly: 18 distinct screens, same wording and progress values, cart "90 Day Supply - 2.5 mg", $65.00, ends at "Create account" (75%).'),
 ('verify-wall-men-finasteride-oral', 'none: stage 3 page load of the oral finasteride form',
  'First screen is still the account card ("See your treatment options": e-mail, phone, consent tick box, Google). Wall confirmed.'),
 ('verify-wall-men-finasteride-topical', 'none: stage 3 page load of the topical finasteride form', 'First screen is still the account card. Wall confirmed.'),
 ('verify-wall-men-dutasteride', 'none: stage 3 page load of the dutasteride form', 'First screen is still the account card. Wall confirmed.'),
 ('verify-wall-women-strut-hair-formula', "none: stage 3 page load of the women's formula (old checkout)",
  'Redirects straight to checkout.struthealth.com/auth/sign-up. Wall confirmed.'),
 ('verify-exp-01-age-under18', 'age: 31-45 -> Under 18 (re-test of R1)', '"Age Verification" stop screen straight after the age question; no dose picker, no cart. R1 confirmed.'),
 ('verify-exp-05-selfharm-yes', 'thoughts of hurting yourself: No -> Yes, then "Go back and update my answer" (re-test of R4)',
  '"Safety Alert" screen (988, 911); "Go back" returns to the question. R4 confirmed.'),
 ('verify-v-selfharm-continue', 'thoughts of hurting yourself: No -> Yes, then press "Continue" on the Safety Alert screen without choosing',
  'The form stays on the Safety Alert screen and shows "An answer is required". The alert cannot be passed with "Continue"; the account card is never reached. Confirms R4.'),
 ('verify-exp-04-dose-1-25', 'dose: 2.5 mg -> 1.25 mg (re-test of R3)', 'Cart "90 Day Supply - 2.5 mg (1.25mg)", $55.00; questions identical. R3 confirmed.'),
 ('verify-exp-09-cond-heart-failure', 'medical conditions: None -> Heart failure or heart disease (re-test of R8)', 'No change; same 18 screens, $65 cart, "Create account". R8 confirmed.'),
 ('verify-exp-12-allergy-minoxidil', 'allergies: None -> Minoxidil (re-test of R9)', 'No change; same 18 screens, $65 cart, "Create account". R9 confirmed.'),
 ('verify-exp-06-surgery-yes', 'surgeries: No -> Yes (re-test of R5)', 'One extra free-text screen "Please describe your surgical history:"; progress values shift by 1-2 points; cart and end unchanged. R5 confirmed.'),
 ('verify-exp-25-age-under18-end', 'age: Under 18, then "End questionnaire" (re-test of R13)', 'Lands on start.struthealth.com/flow/www.struthealth.co: "Oops, you seem lost". R13 confirmed.'),
 ('verify-v-cond-liver', 'medical conditions: None -> Liver problems (gap test)', 'No change; same 18 screens, $65 cart, "Create account".'),
 ('verify-v-cond-stroke', 'medical conditions: None -> Stroke, on its own (gap test; before only in the combined run)', 'No change; same 18 screens, $65 cart, "Create account".'),
 ('verify-v-cond-cancer', 'medical conditions: None -> Breast or prostate cancer (gap test)', 'No change; same 18 screens, $65 cart, "Create account".'),
 ('verify-v-scalp-bleeding', 'scalp symptoms: None -> Bleeding, on its own (gap test; before only in the combined run)', 'No change; same 18 screens, $65 cart, "Create account".'),
 ('verify-v-age-46-60', 'age: 31-45 -> 46-60 (gap test; before from code only)', 'No change; same 18 screens, $65 cart, "Create account".'),
 ('verify-v-woman-baseline-min', 'baseline woman (31-45, over 1 year, diffuse thinning + thinning on top, no conditions, no medicines) walked through the oral minoxidil form',
  'Identical to the man: same 18 screens, no sex, pregnancy, breastfeeding or contraception question anywhere, oral minoxidil 2.5 mg $65 in the cart, ends at "Create account".'),
]
have = {e['id'] for e in c['experiments']}
for i, ch, res in NEW_EXP:
    if i not in have:
        c['experiments'].append({'id': i, 'flow': OM if 'wall' not in i else {
            'verify-wall-men-finasteride-oral': 'men-finasteride-oral', 'verify-wall-men-finasteride-topical': 'finasteride-topical',
            'verify-wall-men-dutasteride': 'dutasteride', 'verify-wall-women-strut-hair-formula': 'old-checkout'}[i],
            'changed': ch, 'result': res, 'run': 'runs/' + i})

# ---------- options now observed on their own ----------
for qid, label, run in [('oral-minoxidil-q02', '46-60', 'verify-v-age-46-60'),
                        ('oral-minoxidil-q11', 'Liver problems', 'verify-v-cond-liver'),
                        ('oral-minoxidil-q11', 'Breast or prostate cancer', 'verify-v-cond-cancer'),
                        ('oral-minoxidil-q11', 'Stroke', 'verify-v-cond-stroke'),
                        ('oral-minoxidil-q07', 'Bleeding', 'verify-v-scalp-bleeding')]:
    o = opt(OM, qid, label); o['evidence'] = 'observed'
    if 'runs/' + run not in o['effect']:
        o['effect'] = 'No effect inside the form: same screens, same $65 cart, account card reached (observed on its own in runs/%s).' % run
qs = q(OM, 'oral-minoxidil-q19')
if 'An answer is required' not in qs.get('branchDetail', ''):
    qs['branchDetail'] = (qs.get('branchDetail', '') + ' Stage 3: pressing "Continue" without choosing keeps the patient on the alert with "An answer is required" (runs/verify-v-selfharm-continue). The alert text says "A physician will still review your questionnaire", yet the form cannot go on with "Yes".').strip()

# ---------- rules ----------
r = rule('R2'); r['proof'] = 'runs/exp-02-age-18-30, runs/exp-03-age-61plus and runs/verify-v-age-46-60 against runs/baseline-us'
r = rule('R4')
if 'verify' not in r['proof']:
    r['proof'] += '; re-tested in runs/verify-exp-05-selfharm-yes and runs/verify-v-selfharm-continue ("Continue" gives "An answer is required")'
for rid, run in [('R1', 'verify-exp-01-age-under18'), ('R3', 'verify-exp-04-dose-1-25'), ('R5', 'verify-exp-06-surgery-yes'),
                 ('R8', 'verify-exp-09-cond-heart-failure'), ('R9', 'verify-exp-12-allergy-minoxidil'), ('R13', 'verify-exp-25-age-under18-end')]:
    r = rule(rid)
    if run not in r['proof']: r['proof'] += '; re-tested in stage 3: runs/' + run
r = rule('R10')
if 'Bleeding' not in r['when']:
    r['when'] += '; scalp symptoms = "Bleeding" on its own (stage 3)'
    r['proof'] += '; runs/verify-v-scalp-bleeding'
r = rule('R14')
r['when'] = ('any option still not replayed on its own (durations "Less than 6 months", "6-12 months", "Over 2 years"; symptoms '
             '"Thinning at the front hairline", "Thinning at the temples", "Increased shedding"; scalp "Dry skin or dandruff", "Rash"; '
             'treatments tried other than "Minoxidil oral tablets"; allergies other than "Minoxidil"; conditions thyroid, BPH, HIV, '
             'autoimmune, glaucoma; "Other" on treatments and allergies)')
if not any(x['id'] == 'R25' for x in c['rules']):
    c['rules'].append({'id': 'R25', 'flow': OM,
        'when': 'age = "46-60"; condition "Liver problems", "Stroke" or "Breast or prostate cancer"; scalp symptom "Bleeding" (each on its own)',
        'then': 'Nothing: no stop, no warning, no extra question; oral minoxidil 2.5 mg, $65, stays in the cart and the account card is reached. Stage 3 gap tests; stroke and bleeding had only been seen in the combined worst-case run.',
        'effectType': 'none', 'affects': ['p8'], 'evidence': 'observed',
        'proof': 'runs/verify-v-age-46-60, runs/verify-v-cond-liver, runs/verify-v-cond-stroke, runs/verify-v-cond-cancer, runs/verify-v-scalp-bleeding against runs/verify-baseline-min',
        'confidence': 'high'})
    c['rules'].append({'id': 'R26', 'flow': OM,
        'when': 'the patient is a woman (baseline woman: diffuse thinning on top, no conditions)',
        'then': 'The form cannot tell: it asks no sex, pregnancy, breastfeeding or contraception question, so a woman gets exactly the same screens and the same oral minoxidil 2.5 mg ($65) cart as the man, up to the account card.',
        'effectType': 'none', 'affects': ['p8'], 'evidence': 'observed',
        'proof': 'runs/verify-v-woman-baseline-min against runs/verify-baseline-min', 'confidence': 'high'})

# ---------- products ----------
p = prod('p8')
if 'Stage 3' not in p['priceDetail']:
    p['priceDetail'] += (' Stage 3 check of the live product page (23 Nov 2026): the page shows $55 for a 90-day supply next to both '
                         '"1.25mg daily dose" and "Oral Minoxidil Tablets, 2.5mg"; the form charges $65 for 2.5 mg (observed). The page '
                         'calls the tablets "Retail"; the form card says "compounded". Audience "both" is inferred: neither the page nor '
                         'the form names an audience or asks sex. Strut FAQ: a $40 provider consultation fee is charged only if the '
                         'prescription is transferred to a non-preferred pharmacy.')

# ---------- recommendations ----------
if not any('verify-v-woman-baseline-min' in x['note'] for x in c['recommendations']):
    c['recommendations'].append({'profile': 'Baseline woman, 38, diffuse thinning on top, no conditions, who starts from the oral minoxidil page',
        'offered': ['p8'], 'default': 'p8',
        'note': 'Same as the man: no sex or pregnancy question, oral minoxidil 2.5 mg ($65 for 90 days) pre-selected, account card at 75%. Proof: runs/verify-v-woman-baseline-min.',
        'evidence': 'observed'})

# ---------- limitations / coverage ----------
L = c['limitations']
for i, x in enumerate(L):
    if x.startswith('Not replayed on their own in the oral minoxidil form'):
        L[i] = ('Not replayed on their own in the oral minoxidil form (the definition shows no branch on any of them): durations "Less than 6 months", '
                '"6-12 months", "Over 2 years"; symptoms "Thinning at the front hairline", "Thinning at the temples", "Increased shedding"; '
                'scalp "Dry skin or dandruff", "Rash"; every "treatments tried" option except "Minoxidil oral tablets"; every allergy except '
                '"Minoxidil"; conditions thyroid, BPH, HIV, autoimmune, glaucoma; "Other" on treatments and allergies. Twenty-one single options '
                'from the same screens were replayed with no effect, matching the code, so these keep the label "code" with high confidence.')
a = c['access']
if 'Stage 3' not in a['coverageNote']:
    a['coverageNote'] += (' Stage 3 (independent verification, 23 Nov 2026) replayed the baseline fresh (identical), re-loaded the four walls '
                          '(unchanged), re-tested 8 rules live (all confirmed), ran 6 gap tests (no effect, including a baseline woman on the '
                          'oral minoxidil form), re-fetched the four live form definitions (same version IDs as the saved files) and re-read '
                          '15 product pages.')

# ---------- verification block ----------
c['verification'] = {
 'checked': [
  'Oral minoxidil baseline replayed fresh with the standard walk tool (runs/verify-baseline-min): identical to runs/baseline-us (18 screens, same wording and progress, 2.5 mg $65, "Create account" at 75%).',
  'All four account walls re-loaded (runs/verify-wall-*): oral finasteride, topical finasteride and dutasteride forms still open on the account card; the old checkout still redirects to /auth/sign-up.',
  'R1 under-18 stop: confirmed live (runs/verify-exp-01-age-under18).',
  'R4 self-harm stop: confirmed live, and "Continue" on the alert gives "An answer is required", so it truly cannot be passed (runs/verify-exp-05-selfharm-yes, runs/verify-v-selfharm-continue).',
  'R3 dose 1.25 mg -> $55: confirmed live (runs/verify-exp-04-dose-1-25).',
  'R5 surgeries "Yes" -> one free-text screen: confirmed live (runs/verify-exp-06-surgery-yes).',
  'R8 heart failure -> no effect: confirmed live (runs/verify-exp-09-cond-heart-failure).',
  'R9 minoxidil allergy -> no effect: confirmed live (runs/verify-exp-12-allergy-minoxidil).',
  'R13 "End questionnaire" -> broken "Oops, you seem lost" page: confirmed live (runs/verify-exp-25-age-under18-end).',
  'R15 (oral finasteride "Female" stop), R16 (topical finasteride "Female" -> women\'s card) and R17 (dutasteride oral/topical switch): re-read in the saved definitions; the four live form pages were re-fetched on 23 Nov 2026 and carry the same version IDs (…597, …8e6, …5b5, …c87) and the same stop and product-card names, so the code reading still applies.',
  'Gap tests, each with no effect: age 46-60, liver problems, stroke alone, breast or prostate cancer, bleeding scalp alone (runs/verify-v-*). New rule R25.',
  "Women's route: a baseline woman walked the oral minoxidil form (runs/verify-v-woman-baseline-min): identical to the man, no sex or pregnancy question. New rule R26 and a new recommendation profile.",
  'Product facts checked against the live pages (23 Nov 2026): oral finasteride 1 mg $25 for 30 tablets; topical finasteride formula $59 (30 ml); oral dutasteride $39 (0.1 mg compounded or 0.5 mg retail; collection page says 0.1-0.6 mg); topical dutasteride $69; HairfectRx capsules $69 (finasteride 1 mg or dutasteride 0.4 mg, each with minoxidil 5 mg); women\'s formula $59 (spironolactone 1%, finasteride 0.25%, minoxidil 0-7.5%, tretinoin 0-0.025%, fluocinolone 0.01%); Hair Booster $49 / $99 (latanoprost 0.03% / 0.1%, unisex); ketoconazole 2% shampoo $25 (120 ml); Hairfect combo $33 a month (90 tablets + 180 StrutVite); gel combo $55 a month; dutasteride combo $40 / $60 a month; StrutVite $24.99. All match company.json.',
  'Catalogue completeness: the live hair-loss collection links exactly the 13 product pages in the catalogue; with the women\'s topical finasteride card (form only) and StrutVite that makes the 15 products. Nothing missing.',
  'Evidence labels: every "observed" rule, experiment and recommendation names a run folder that exists.'
 ],
 'corrected': [
  'Options "46-60", "Liver problems", "Breast or prostate cancer" upgraded from "code" to "observed"; "Stroke" and "Bleeding" were "observed" only through the combined worst-case run and now have their own one-change runs.',
  'R2 proof no longer says 46-60 is "from code only"; R14 (untested options) narrowed to what is still untested; R10 extended to "Bleeding" alone.',
  'Added rules R25 (stage 3 gap tests, no effect) and R26 (a woman gets the same oral minoxidil route as a man), 19 stage 3 experiment entries and a women\'s recommendation profile.',
  'p8 oral minoxidil: priceDetail now records that the live page shows $55 next to the 2.5 mg tablets too (the form charges $65), that page and form disagree on retail against compounded, that the audience "both" is inferred, and the $40 fee charged only when a prescription is transferred to another pharmacy.',
  'Safety Alert question: recorded that its text promises "A physician will still review your questionnaire" although the form cannot continue with "Yes".',
  'Limitations and coverage note updated with the stage 3 work.'
 ],
 'stillUnverified': [
  'Everything behind the account wall: the oral finasteride, topical finasteride and dutasteride forms (incl. the "Female" stop and the women\'s topical card, R15-R21), and every screen after "Create account" in the oral minoxidil form. These rest on the served definition only ("code").',
  "The old-checkout questionnaires, including the only dedicated women's product (Strut Women's Hair Growth Formula), Hair Booster, ketoconazole, HairfectRx capsules and the combos: never seen.",
  'What the reviewing provider does with any answer (decline, dose change, removing an active); R22 and R23 rest only on Strut\'s own page wording.',
  'About 25 single options of the oral minoxidil form (listed under limitations) have still not been replayed on their own; the code shows no branch on them.',
  'Whether particular free-text wording triggers anything (the definition has no rule on text).',
  'The help centre (security checkpoint) and third-party accounts of declines were not read.'
 ],
 'verdict': ('For the one form that can be walked anonymously (oral minoxidil), this report is solid: the baseline replayed identically, every '
             'consequential rule re-tested live behaved exactly as recorded (two stops, the dose price, the free-text follow-up, and the '
             '"no effect" of heart failure and minoxidil allergy), the safety stop cannot be bypassed, and six new gap tests (including a woman) '
             'found nothing new. Product names, strengths and prices match the live pages, and the page-versus-form inconsistencies the report '
             'flags are real. The conclusion that the forms themselves make no clinical decision is well supported. The weaker parts are '
             'labelled honestly: the three walled forms and all old-checkout products (including the women\'s formula) are known from served '
             'code or marketing text only, and nothing about how the provider decides after checkout can be seen. Trust the "observed" and '
             '"code" items; treat the "docs" items about provider decisions as Strut\'s claims, not tested behaviour.')
}
json.dump(c, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('patched', path, len(c['rules']), 'rules', len(c['experiments']), 'experiments')
