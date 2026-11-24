#!/usr/bin/env python3
# Stage 2 patch b: experiments, rules, recommendations, products, summaries.
import json, os
D = os.path.join(os.path.dirname(__file__), '..')
P = os.path.join(D, 'company.json')
c = json.load(open(P))
FIN = ['p-fin', 'p-propecia', 'p-dual-tab-spray', 'p-dual-tabs']
OMX = ['p-minox-tab', 'p-dual-tabs']
TMX = ['p-minox-spray', 'p-dual-tab-spray']
ALLMX = ['p-minox-tab', 'p-minox-spray', 'p-dual-tabs', 'p-dual-tab-spray']
ALL6 = ['p-dual-tab-spray', 'p-dual-tabs', 'p-fin', 'p-minox-tab', 'p-minox-spray', 'p-propecia']

X = [
 ('base-full', 'none (baseline replay, full)', 'Same as stage 1: 6 cards (Dual Action Tablet + Spray and Dual Action Tablets first, both out of stock; then Finasteride, Minoxidil tablets, Sons spray, Propecia). "You\'re new to hair loss treatment... we\'d recommend starting with a licensed treatment, such as Finasteride tablets and Minoxidil spray." Pack size for finasteride: subscription £28 / £80 / £138, one-off £34 / £95 / £163. Finasteride safety screen, then final consent (not pressed). No sign-in asked up to there.'),
 ('e01-heart-yes', '107973 heart/BP: No → Yes', 'No extra screen. Only Finasteride and Propecia offered: oral AND topical minoxidil and both Dual packs removed. Pets and "Clinically proven results" screens skipped.'),
 ('e02-trying-baby', '108003: None → trying for a baby', 'Warning 108004, then only Minoxidil tablets and Sons spray: all finasteride removed.'),
 ('e03-partner-pregnant', '108003: None → My partner is pregnant', 'No change at all.'),
 ('e04-dep-nofin', '103270: None → Depression, then 103268 "I don\'t want to use finasteride tablets"', 'Only Minoxidil tablets and spray; baby question skipped.'),
 ('e05-dep-continue', '103270: None → Depression, then continue', '4 mental-health questions (answered: past low mood, resolved). Same 6 products; "licensed first" line dropped.'),
 ('e06-scalp-yes', '105935 scalp changes: No → Yes', '"See your GP" warning; Sons spray and Dual Tablet + Spray removed; pets question skipped. Licensed-first line now names Finasteride tablets only.'),
 ('e07-prev-topminox', '108014: No → Yes; 108015 = Topical minoxidil (helped, no side effects)', 'Adds 108016 and 107959. Same 6 products; text "You\'ve previously used hair loss treatment"; licensed-first line dropped.'),
 ('e07b-prev-topminox-peek', '108014 Yes, topical minoxidil, peek at 108016 options', 'Every 108016 answer leads to side effects 107959; Yes adds a describe box 107981. (Peek run: not a full replay.)'),
 ('e08-prev-fin', '108014: No → Yes; 108015 = Finasteride (helped, no side effects)', 'Adds 108022 and 107959. Same 6 products; previously-used wording.'),
 ('e09-prev-topminox-nobenefit', 'as e07 but 108016 = No benefit (12 months+, regular)', 'Adds 108017 + 108018. Same 6 products; text adds "Previously, treatment with Minoxidil spray didn\'t achieve the results you were hoping for." Spray still offered.'),
 ('e10-prev-fin-sidefx', 'as e08 but side effects Yes, 108051 = No', 'Adds 107981 and 108051. All finasteride removed; "You reported side effects to hair loss treatments".'),
 ('e11-allergy-minox', '102624: No → Yes; 100038 = Minoxidil', 'Ingredients warning; all minoxidil removed (only Finasteride, Propecia); pets skipped.'),
 ('e12-allergy-fin', '102624: No → Yes; 100038 = Finasteride', 'Ingredients warning; all finasteride removed (only Minoxidil tablets and spray); baby question skipped.'),
 ('e13-prev-fin-sidefx-again', 'as e10 but 108051 = Yes', 'All 6 products back; "...but would like to be recommended options containing Finasteride tablets".'),
 ('e14-pets-yes', '108001 pets: No → Yes', 'Pets warning 108002 (I confirm); no change to offer or text.'),
 ('e15-ckd-egfr-over30', '101561 CKD: No → Yes; eGFR more than 30', 'Minoxidil tablets and Dual Action Tablets removed; licensed-first line dropped.'),
 ('e16-ckd-egfr-unknown', '101561 CKD: Yes; eGFR I don\'t know', 'Same as e15.'),
 ('e17-age-17', '100014 date of birth: 1994 → 2009 (age 17)', 'Questions end at once; redirected to "We do not treat under 18s" page.'),
 ('e18-age-70', '100014: age 32 → 70', 'Minoxidil tablets and Dual Action Tablets removed; licensed-first line dropped.'),
 ('e19-age-65', '100014: age 32 → 65', 'Same as e18 (oral minoxidil removed).'),
 ('e20-age-19', '100014: age 32 → 19', 'No change.'),
 ('e21-age-64', '100014: age 32 → 64', 'No change (so the oral minoxidil cut-off is 65).'),
 ('e22-pattern-temples', '103257: Temples and Crown → Temples only', 'Expectation screen 108138; no change to offer or text.'),
 ('e23-pattern-extensive', '103257: Temples and Crown → Extensive', 'Expectation screen 108376; no change to offer or text.'),
 ('e24-skip-learn', '107977: Tell me more → Skip, I already know', '3 education screens skipped; no change.'),
 ('e25-breast-cancer', '103270: None → Breast cancer', 'No extra screen; all finasteride removed; baby question skipped.'),
 ('e26-prostate-cancer', '103270: None → Prostate cancer', 'No extra screen; all finasteride removed.'),
 ('e27-bp-meds', '102632: No → Yes; 103769 = blood pressure medicines', 'All minoxidil removed (only Finasteride, Propecia); pets skipped.'),
 ('e28-antidepressants', '102632: No → Yes; 103769 = antidepressants', 'Adds medication-list text 101599; no change to offer.'),
 ('e29-5ari-prostate', '102632: No → Yes; 103769 = finasteride/dutasteride for prostate', 'All finasteride removed.'),
 ('e30-ed-tablets', '102632: No → Yes; 103769 = ED tablets', 'Finasteride products and Minoxidil tablets removed: only Sons Minoxidil spray offered.'),
 ('e31-gynaecomastia', '103270: None → Breast tissue enlargement', 'No extra screen; all finasteride removed.'),
 ('e32-sex-problems', '103270: None → Problems with my sex life', 'No extra screen; all finasteride removed.'),
 ('e33-other-condition', '107800: No → Yes', 'Adds details text 107160; no change to offer.'),
]
c['experiments'] = [{'id': i, 'flow': 'men', 'changed': ch, 'result': r, 'run': 'runs/' + i} for i, ch, r in X]

R = []
def rule(when, then, et, aff, proof, conf='high', ev='observed'):
    R.append({'id': 'R%d' % (len(R) + 1), 'flow': 'men', 'when': when, 'then': then, 'effectType': et, 'affects': aff, 'evidence': ev, 'proof': proof, 'confidence': conf})
rule('men-100013 = Female', 'Questions end at once; no recommendation (men-only service).', 'hard-stop', [], 'runs/female-01 (stage 1)')
rule('age (from men-100014) under 18', 'Questions end at once; redirect to "We do not treat under 18s".', 'hard-stop', [], 'runs/e17-age-17')
rule('age 65 or over', 'Minoxidil tablets and Dual Action Tablets removed (no screen tells the patient why).', 'product-removed', OMX, 'runs/e19-age-65, runs/e18-age-70 vs runs/e21-age-64')
rule('men-103257 = Complete or Random patches; men-107954 = Suddenly; men-103261 = Yes; men-103270 includes Alopecia', 'Questions end at once; no recommendation (not male pattern hair loss).', 'hard-stop', [], 'stage 1 peeks runs/peek-02, runs/peek-07, runs/peek-08')
rule('men-103257 = Temples only or Extensive', 'Expectation screen that must be ticked; offer unchanged.', 'soft-warning', [], 'runs/e22-pattern-temples, runs/e23-pattern-extensive')
rule('men-105935 = Yes (scalp changes)', 'Topical minoxidil removed (Sons spray, Dual Tablet + Spray); "see your GP" screen; pets question skipped.', 'product-removed', TMX, 'runs/e06-scalp-yes')
rule('men-107973 = Yes (heart or blood pressure condition)', 'Every minoxidil product removed, oral AND topical; only Finasteride and Propecia offered.', 'product-removed', ALLMX, 'runs/e01-heart-yes')
rule('men-103769 includes blood pressure medicines', 'Every minoxidil product removed, oral and topical.', 'product-removed', ALLMX, 'runs/e27-bp-meds')
rule('men-100038 includes Minoxidil (allergy)', 'Every minoxidil product removed, after an ingredients warning.', 'product-removed', ALLMX, 'runs/e11-allergy-minox')
rule('men-101561 = Yes and men-101564 = Less than 30', 'Questions end at once; no recommendation.', 'hard-stop', [], 'stage 1 runs/peek-12')
rule('men-101561 = Yes and men-101564 = More than 30 or I don\'t know', 'Minoxidil tablets and Dual Action Tablets removed; topical kept.', 'product-removed', OMX, 'runs/e15-ckd-egfr-over30, runs/e16-ckd-egfr-unknown')
rule('men-103769 includes erectile dysfunction tablets', 'Finasteride products and Minoxidil tablets removed; only Sons Minoxidil spray offered.', 'product-removed', FIN + ['p-minox-tab'], 'runs/e30-ed-tablets')
rule('men-108003 = planning or trying for a baby', 'Warning screen; every finasteride product removed.', 'product-removed', FIN, 'runs/e02-trying-baby')
rule('men-108003 = My partner is pregnant', 'No change (only the standard card note that pregnant women must not handle finasteride).', 'none', [], 'runs/e03-partner-pregnant')
rule('men-103270 includes Breast cancer, Breast tissue enlargement, Prostate cancer or Problems with my sex life', 'Every finasteride product removed silently (no screen).', 'product-removed', FIN, 'runs/e25-breast-cancer, runs/e31-gynaecomastia, runs/e26-prostate-cancer, runs/e32-sex-problems')
rule('men-103769 includes finasteride or dutasteride for prostate problems', 'Every finasteride product removed.', 'product-removed', FIN, 'runs/e29-5ari-prostate')
rule('men-100038 includes Finasteride (allergy)', 'Every finasteride product removed.', 'product-removed', FIN, 'runs/e12-allergy-fin')
rule('men-103270 includes Depression and men-103268 = I don\'t want to use finasteride tablets', 'Every finasteride product removed.', 'product-removed', FIN, 'runs/e04-dep-nofin')
rule('men-103270 includes Depression and men-103268 = continue', 'Four mental-health questions; offer unchanged (with neutral answers); licensed-first line dropped.', 'extra-questions', [], 'runs/e05-dep-continue', 'medium')
rule('men-107959 = Yes for finasteride and men-108051 = No', 'Every finasteride product removed; result notes reported side effects.', 'product-removed', FIN, 'runs/e10-prev-fin-sidefx vs runs/e13-prev-fin-sidefx-again')
rule('men-108014 = Yes (any previous treatment)', 'Result says "You\'ve previously used hair loss treatment" and drops "start with a licensed treatment"; products unchanged.', 'none', [], 'runs/e07-prev-topminox, runs/e08-prev-fin')
rule('previous product "No benefit" (12 months+, regular use)', 'Result adds "treatment with <product> didn\'t achieve the results you were hoping for"; the product is still offered (no switch).', 'none', [], 'runs/e09-prev-topminox-nobenefit')
rule('any answer that removes finasteride', 'The partner-pregnancy question (108003) is skipped, because it only matters for finasteride.', 'skip-questions', [], 'runs/e04, e10, e12, e25, e26, e29, e30, e31, e32 (all skip 108003)')
rule('any answer that removes topical minoxidil', 'The pets question (108001) is skipped, because it only matters for topical minoxidil.', 'skip-questions', [], 'runs/e01, e06, e11, e27 (all skip 108001)')
rule('either drug removed', 'The "Clinically proven results" screen (108360) and the combination packs are dropped; remaining single products become the main cards.', 'skip-questions', [], 'runs/e01-heart-yes, runs/e02-trying-baby, runs/e12-allergy-fin')
rule('new to treatment, no mental-health history, and finasteride, oral minoxidil and spray (or the scalp-limited set) all on offer', 'The result adds "As you\'re new to hair loss treatment, we\'d recommend starting with a licensed treatment" (naming finasteride and/or the spray). Dropped after previous treatment, depression, age 65+, CKD or any finasteride removal.', 'none', [], 'runs/exp-base vs runs/e05, e07, e15, e18, e06', 'medium', 'observed')
rule('men-108001 = Yes, men-107800 = Yes, men-103769 includes antidepressants, men-107977 = Skip', 'Warning or free-text screen only; offer unchanged.', 'none', [], 'runs/e14-pets-yes, runs/e33-other-condition, runs/e28-antidepressants, runs/e24-skip-learn')
c['rules'] = R

recs = [
 ('Baseline man: 32, temples and crown, gradual, no conditions, no medicines, no allergies, new to treatment', ALL6, 'p-dual-tab-spray', 'Two combination packs first (both out of stock), then Finasteride, Minoxidil tablets, Sons spray, Propecia. Advises starting with a licensed treatment (finasteride and the spray). Finasteride 6-month pack £138 on subscription or £163 one-off.', 'runs/exp-base'),
 ('Baseline woman', [], '', 'Not served: men only. Female at question 1 ends the questions with no product.', 'runs/female-01'),
 ('Man under 18', [], '', 'Stopped after date of birth: "We do not treat under 18s".', 'runs/e17-age-17'),
 ('Man 65 or over, or with kidney disease (eGFR over 30 or unknown)', ['p-dual-tab-spray', 'p-fin', 'p-minox-spray', 'p-propecia'], 'p-dual-tab-spray', 'Oral minoxidil (and Dual Action Tablets) removed; "licensed first" line dropped.', 'runs/e19-age-65, runs/e15-ckd-egfr-over30'),
 ('Man with heart/BP condition, on BP medicines, or allergic to minoxidil', ['p-fin', 'p-propecia'], 'p-fin', 'Finasteride only (generic or Propecia).', 'runs/e01-heart-yes, runs/e27-bp-meds, runs/e11-allergy-minox'),
 ('Man with a finasteride exclusion (trying for a baby, breast or prostate cancer, breast tissue enlargement, sex-life problems, 5-ARI for prostate, finasteride allergy, depression opt-out, past finasteride side effects and declines it)', ['p-minox-tab', 'p-minox-spray'], 'p-minox-tab', 'Minoxidil tablets and Sons spray as the two main cards.', 'runs/e02, e04, e10, e12, e25, e26, e29, e31, e32'),
 ('Man with scalp changes', ['p-dual-tabs', 'p-fin', 'p-minox-tab', 'p-propecia'], 'p-dual-tabs', 'Topicals removed; Dual Action Tablets first; licensed-first advice names finasteride only.', 'runs/e06-scalp-yes'),
 ('Man taking erectile dysfunction tablets', ['p-minox-spray'], 'p-minox-spray', 'Only Sons Minoxidil spray.', 'runs/e30-ed-tablets'),
 ('Man who used treatment before (helped or not, no side effects)', ALL6, 'p-dual-tab-spray', 'Same products; wording says previously treated, and (if no benefit) that the product did not achieve the hoped-for results. No switch or strength change.', 'runs/e07, e08, e09'),
]
c['recommendations'] = [{'profile': p, 'offered': off, 'default': d, 'note': n, 'evidence': 'observed', 'proof': pr} for p, off, d, n, pr in recs]

W = {
 'p-fin': 'Offered unless any finasteride exclusion is given: trying for a baby, breast cancer, breast tissue enlargement, prostate cancer, problems with sex life, 5-ARI for prostate, ED tablets, finasteride allergy, depression opt-out, or past finasteride side effects with "No" to trying again. The only drug left for heart/BP, BP medicines or minoxidil allergy. Named in the "licensed first" advice for new patients (observed).',
 'p-propecia': 'Same rules as generic finasteride; always listed under "Other suitable treatments" next to it (observed).',
 'p-minox-spray': 'Offered unless scalp changes, heart/BP condition, BP medicines or minoxidil allergy. The only product left for men on ED tablets. Named in the "licensed first" advice (observed).',
 'p-minox-tab': 'Offered unless age 65 or over, kidney disease (eGFR over 30 or unknown), heart/BP condition, BP medicines, ED tablets or minoxidil allergy (observed).',
 'p-dual-tab-spray': 'Shown first whenever both finasteride and topical minoxidil are allowed (no exclusion for either); flagged out of stock on 24 Nov 2026 (observed).',
 'p-dual-tabs': 'Shown whenever both finasteride and oral minoxidil are allowed; first card when topicals are excluded (scalp changes); out of stock on 24 Nov 2026 (observed).',
 'p-minox-solution': 'Never offered in any consultation route tested; sold on the shop pages only (observed: absent from every recommendation screen).',
}
for p in c['products']:
    p['recommendedWhen'] = W[p['id']]

c['engineSummary'] = ('A server-side rules engine (one screen per answer) works as a subtraction filter. It starts from six cards for every eligible man '
 '(two combination packs, generic finasteride, oral minoxidil, Sons minoxidil spray, Propecia) and removes whole drug families: any finasteride '
 'exclusion (baby plans, breast or prostate cancer, breast tissue enlargement, sex-life problems, 5-ARI or ED medicines, allergy, mood opt-out, '
 'past side effects declined) drops every finasteride product; heart/BP disease, BP medicines or minoxidil allergy drop every minoxidil product, '
 'even the spray; age 65+, kidney disease or ED tablets drop oral minoxidil; scalp changes drop topicals. Hard stops end the questions for women, '
 'under-18s, non-pattern loss and severe kidney or liver disease. Answers never change strength, dose, plan or price, and never add a product: '
 'history and efficacy answers only change the result wording. Follow-up questions are skipped once the drug they protect is gone.')
c['strengths'] = [
 'Free, anonymous route to a named-clinician recommendation with prices before any account.',
 'Clear, consistent safety logic: removes whole drug families for real contraindications (heart/BP, ED tablets with oral minoxidil, age 65+, kidney disease, 5-ARI use).',
 'Smart skipping: pets and pregnancy questions disappear once the drug they relate to is off the table, so the patient is not asked irrelevant questions.',
 'Takes a proper treatment history: benefit, duration, adherence and side effects for each previous product, and lets the patient choose to retry finasteride after side effects.',
 'Mental-health screen with a finasteride opt-out and crisis signposting; expectation-setting for temple-only and extensive loss.',
]
c['weaknesses'] = [
 'Men only: women are stopped after one question.',
 'Several removals are silent: breast or prostate cancer, sex-life problems, heart/BP, age 65+ and kidney disease change the offer with no screen explaining why.',
 'Blunt rules: a heart or BP condition (even treated, mild hypertension) removes the minoxidil spray as well as tablets; "problems with my sex life" removes finasteride outright instead of discussing it.',
 'No personalisation of strength, dose or plan: one 1 mg finasteride, one minoxidil tablet strength, one 5% spray. A failed product is still offered with only a wording change; no stronger or alternative option (e.g. compounded or dutasteride) exists.',
 'Combination packs lead the result screen while flagged out of stock.',
 'No questions on goals, how far the loss has progressed over time, family history, diet, stress, thyroid or iron, or photos before the recommendation.',
]
c['opportunities'] = [
 'A women\'s hair-loss service (none here).',
 'Products for men excluded from both drugs (e.g. heart/BP plus finasteride exclusion) currently get nothing: offer non-drug or cosmetic routes and GP signposting.',
 'Strength and format choice: low-dose oral minoxidil titration, foam for sensitive scalps, topical finasteride, or a step-up for non-responders.',
 'Explain every removal on the result screen and give a next step, which Lloyds does not do for its silent exclusions.',
 'In-stock combination packs: Lloyds leads with combinations it cannot supply.',
]
c['limitations'] = [
 'Only the anonymous part of the flow was tested; the final consent (100467) was not pressed, so the exact sign-in point and the clinician review step are unseen.',
 'About 40 replays: untested options are marked unknown or inferred (Phaeochromocytoma, Porphyria, SLE, medicated scalp creams, two liver sub-options, previous oral minoxidil / other medication, "too early to tell", 108419 Yes, the minor medicines in 108158, Guanethidine and obstructive uropathy to the end).',
 'Each change was tested alone; combinations (e.g. heart/BP plus a finasteride exclusion, which should leave no product) were not replayed.',
 'Pack size and safety screens were only walked for finasteride; plan prices for other products come from the product data, not a walk.',
 'Free-text answers were neutral; a clinician may act on them after submission, which cannot be seen.',
 'FAQ, help-centre and subscription-terms pages were not read. Legal status of the minoxidil sprays is inferred.',
]
a = c['access']
a['coverageNote'] = ('Stage 1 walked every question on the baseline path and every option one level deep. Stage 2 (24 Nov 2026) replayed the baseline and '
 'ran 33 one-change experiments to the recommendation screen, comparing cards and wording (runs/e01 to runs/e33). Options not replayed are marked unknown or inferred.')
fl = c['flows'][0]
fl['stagesSummary'] = fl['stagesSummary'].replace('previous treatment →', 'previous treatment (per product: helped? duration, adherence, side effects, retry finasteride?) →')
c['checkedOn'] = '2026-11-24'
json.dump(c, open(P, 'w'), indent=1, ensure_ascii=False)
print('ok', len(c['experiments']), 'experiments', len(R), 'rules')
