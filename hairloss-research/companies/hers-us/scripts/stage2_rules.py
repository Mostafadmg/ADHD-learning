#!/usr/bin/env python3
"""Stage 2 (EXPERIMENT) update for hers-us/company.json.

The Hers site stayed behind a Cloudflare checkpoint, so no live one-change experiment could be run.
This script adds what public documents support: effects per option, rules, recommendations, summary.
Every claim is labelled docs or inferred. Nothing here is 'observed' on Hers.

Run AFTER scripts/build_company.py (stage 1). It sets fields, it does not append, so it is safe to re-run.
"""
import json, os
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'company.json')
d = json.load(open(P, encoding='utf-8'))

HC = 'https://support.hims.com/hc/en-us'
U_SPIRO_HC = HC + '/articles/38945518659227-Spironolactone-Generic-for-Aldactone'
U_MINOX_HC = HC + '/articles/38944589097883-Minoxidil'
U_MINSUP_HC = HC + '/articles/38838928667419-Minoxidil-Supplements'
U_TOPICAL_HC = HC + '/articles/38844763548059-Compounded-Topical-Combination'
U_HOW_HC = HC + '/articles/360032844051-How-does-this-work'
U_RX_HC = HC + '/articles/115002248531-Do-I-need-a-prescription'
VIA = 'read through a web search index on 2026-11-23; the page itself is blocked to this machine'

# ---------------------------------------------------------------- access
d['access']['howTested'] = ['public-docs']
d['access']['accountWall'] = ("Not observed (site blocked). Reported: you must create a Hers account to see your quiz results, "
    "before any recommendation is shown (Innerbody, Dec 2023). A Nov 2026 review adds that a government-issued ID and a payment card "
    "are needed to complete the consultation (Healthline). No step behind this wall was tested.")
blk = d['access']['blockers']
extra = [
    "Stage 2 re-test (2026-11-23): www.forhers.com still shows the Cloudflare checkpoint after a 10 second wait. Not defeated. Proof: runs/s2-retest-home. So no one-change experiment could be run.",
    "The shared Hims & Hers help centre (support.hims.com) opens in the research browser and was read (runs/s2-help-centre); plain curl requests to it get 403."
]
for e in extra:
    if e not in blk: blk.append(e)
d['access']['coverageNote'] = ("No live walk of the Hers consultation was possible at stage 1 or stage 2: the site stays behind a security "
    "checkpoint. No answer was changed and replayed, so no rule is 'observed'. The rules in this file come from Hers's own public "
    "safety and eligibility statements (product pages and treatment pages as returned by a search index, and patient drug information "
    "in the shared Hims & Hers help centre, which was opened directly) and from reviewers' descriptions of the quiz (2023 to Nov 2026). "
    "They describe who Hers says can have each product. Whether the quiz enforces a rule itself (stop screen, product hidden) or leaves "
    "it to the provider is not known. Question wording is not verbatim. Hers is women only; men are served by the sister brand Hims.")

# ---------------------------------------------------------------- products
rw = {
 'p1': "Not observed. From Hers's documents: for an adult woman with female pattern hair loss (gradual thinning) who is not pregnant, not breastfeeding and not planning a pregnancy, has no pheochromocytoma, and has no heart, kidney, liver or blood pressure problem that the provider judges unsafe. Hers says it does not offer oral minoxidil for other hair disorders such as telogen effluvium or alopecia areata. Not used together with topical minoxidil. Probably the pick when she does not ask for added vitamins (inferred). Provider sets the dose: 1.25 mg to start, 2.5 mg possible.",
 'p2': "Not observed. Same safety rules as plain oral minoxidil (p1). Probably offered when the patient says she wants vitamins with her treatment and prefers a chew (inferred from a 2023 review that names a 'vitamins with your treatment' question).",
 'p3': "Not observed. Same safety rules as plain oral minoxidil (p1). Probably an alternative format to the chew for patients who want vitamins (inferred).",
 'p4': "Not observed. Same safety rules as plain oral minoxidil (p1). Probably offered when the patient wants vitamins with her treatment (inferred). The patient information adds: do not take it with other medicines or supplements that contain zinc.",
 'p5': "Not observed. The topical prescription route for women who are not past menopause: likely offered to women who prefer not to take a tablet, or for whom oral minoxidil is unsuitable (inferred). Hers says topical and oral minoxidil should not be used together, so it is an alternative to p1 to p4, not an add-on.",
 'p6': "Postmenopausal women only (Hers: finasteride is only recommended for women who have gone through menopause; the patient information says finasteride is contraindicated in women who could become pregnant). Never for women who are pregnant, planning a pregnancy or breastfeeding. How the quiz establishes menopause (a reported 'pre- or post-menopausal' question, possibly with the hysterectomy question) was not tested.",
 'p7': "Same rule as the Postmeno Serum (p6): postmenopausal women only, never in pregnancy, when planning one or when breastfeeding. It is unclear whether the spray is still sold alongside the serum.",
 'p8': "Not observed. From Hers's documents: an option for women before menopause with hormonal (female pattern) hair loss; Hers says it will not help non-hormonal causes such as stress or traction. Not for women who are pregnant or trying to conceive. Hers's treatment page says you are not a candidate if you take eplerenone, cholestyramine, aspirin, potassium supplements, ACE inhibitors, angiotensin receptor blockers, heparin, lithium or digoxin (a list of conditions follows on that page but could not be read). The help centre adds: not with high potassium, Addison's disease or a spironolactone allergy.",
 'p9': "Bought directly, no consultation. The quiz is reported to recommend prescription products only (2023 review). The fallback for anyone who is not eligible for, or does not want, a prescription (inferred).",
 'p10': "Bought directly, no consultation. Same position as the 5% foam (p9).",
}
for p in d['products']:
    if p['id'] in rw: p['recommendedWhen'] = rw[p['id']]
    elif p['id'] in ('p11', 'p12', 'p13', 'p14', 'p15'):
        p['recommendedWhen'] = "Bought directly, no consultation. Not part of the quiz result as far as reviewers describe it. The help centre says non-prescription products can be sold in a kit with a prescription product after a consultation."
    if p['id'] == 'p5':
        p['url'] = 'https://www.forhers.com/hair-loss/blends-solutions'
        p['note'] = "Product page title in the search index: 'Hair Blends Serum with Ingredients for Hair Regrowth' (/hair-loss/blends-solutions). Range page: https://www.forhers.com/hair-blends. Patient information (shared help centre, 'Compounded Topical Combination'): the serum may hold minoxidil, ketoconazole, biotin and dexpanthenol."
    if p['id'] == 'p6':
        p['name'] = 'Hair Blends Postmenopause Serum (Postmeno Serum)'
    if p['id'] == 'p8':
        p['actives'] = [{'name': 'spironolactone', 'strength': "not published on the pages found; the help centre says common doses are 50 mg up to 200 mg a day, taken once or twice daily (one third-party review says 100 mg)"}]
        p['form'] = 'tablet, once or twice a day as prescribed'

# ---------------------------------------------------------------- questions
def opt(label, effect, et, affects, ev):
    return {'label': label, 'effect': effect, 'effectType': et, 'affects': affects, 'evidence': ev}
NT = 'Not tested (site blocked). '
ORAL = ['p1', 'p2', 'p3', 'p4']; FIN = ['p6', 'p7']
Q = {q['id']: q for q in d['flows'][0]['questions']}

q = Q['women-q1']
goal_eff = NT + "Probably changes only the wording of the result: every Hers prescription product for women who are not past menopause is built on minoxidil, so a goal has no different active ingredient to switch to (inferred from the range)."
for o in q['options']: o.update(effect=goal_eff, effectType='marketing-only', affects=[], evidence='inferred')
q.update(purpose="Finds out what the patient wants so the result can be framed around it. Also a soft first step that gets the visitor clicking.",
         engineRole='personalisation', branches=False,
         branchDetail="Not tested. No public source describes a goal changing the product. On the sister site the first quiz address is /c/hl/goals, so goals is probably step one on Hers too (inferred).",
         shownWhen="Probably always, as the first step (inferred)")

q = Q['women-q2']
q['options'] = [
    opt("Reviewer's category, not the site's wording: general thinning", NT + "This is the pattern Hers treats (female pattern hair loss), so it should lead to the standard minoxidil-based offer (inferred).", 'none', [], 'inferred'),
    opt("Reviewer's category, not the site's wording: a widening parting", NT + "As for general thinning: the classic female pattern, so the standard offer (inferred).", 'none', [], 'inferred'),
    opt("Reviewer's category, not the site's wording: shedding", NT + "Unknown. Hers's oral minoxidil page says it does not offer oral minoxidil for telogen effluvium (shedding), but no source says how the quiz treats this answer.", 'unknown', [], 'unknown'),
    opt("Reviewer's category, not the site's wording: hormonal thinning related to menopause", NT + "Unknown. A natural route to the menopause question and the postmenopausal finasteride products, but no source confirms it.", 'unknown', [], 'unknown'),
]
q.update(purpose="Sorts the patient into a kind of hair loss. Hers only prescribes for female pattern hair loss, so this is where other kinds should be picked up.",
         engineRole='diagnosis', branches=False,
         branchDetail="Not tested. Hers's own page says oral minoxidil is not offered for other hair disorders (telogen effluvium, alopecia areata); whether this question enforces that, or the provider does, is unknown.",
         shownWhen='Unknown (reported as part of the opening hair questions)')

q = Q['women-q3']
q.update(purpose="Grades how advanced the hair loss is, from pictures.", engineRole='diagnosis', branches=False,
         branchDetail="Not tested. No public source describes severity changing the product or the dose: reviews say oral minoxidil starts at 1.25 mg for everyone and the provider may raise it later. Probably used for the provider's record and the result page (inferred).",
         shownWhen='Unknown')

q = Q['women-q4']
q['options'] = [
    opt('Gradual (paraphrase)', NT + "The expected answer for female pattern hair loss, so no change to the standard offer (inferred).", 'none', [], 'inferred'),
    opt('Sudden (paraphrase)', NT + "Hers says it does not offer oral minoxidil for telogen effluvium or alopecia areata, the usual causes of sudden loss, so this answer should at least be flagged to the provider and may remove the oral products. Whether the quiz shows a warning or stop screen is unknown (inferred from Hers's stated policy).", 'flag-for-clinician', ORAL, 'inferred'),
]
q.update(purpose="Sudden loss points away from female pattern hair loss and towards causes that need a different work-up.", engineRole='diagnosis', branches=True,
         branchDetail="Not tested. Policy on record: no oral minoxidil for telogen effluvium or alopecia areata (Hers oral minoxidil page). A 2026 review also says women with sudden, patchy or severe loss should see a healthcare provider.",
         shownWhen='Unknown')

q = Q['women-q5']
for o in q['options']: o.update(effect=NT + "Unknown. No public source links hair type to a product.", effectType='unknown', affects=[], evidence='unknown')
q.update(purpose="Hair-care routine detail; probably only used to personalise the wording.", engineRole='personalisation', branches=False, branchDetail='Not tested. No documented effect.', shownWhen='Unknown')

q = Q['women-q6']
q.update(purpose="Hair-care routine detail. It could steer between a daily topical and a tablet, but nothing public says so.", engineRole='personalisation', branches=False, branchDetail='Not tested. No documented effect.', shownWhen='Unknown')

q = Q['women-q7']
q['options'] = [
    opt("Yes, wants vitamins (implied by the reviewer's description; wording not captured)", NT + "Probably switches the suggestion from plain Oral Minoxidil to a minoxidil plus vitamin product: Hair Vitamins + Minoxidil, or the biotin chew or gummy (inferred: these products differ from p1 only by the added vitamins).", 'product-switched', ['p1', 'p2', 'p3', 'p4'], 'inferred'),
    opt("No (implied by the reviewer's description; wording not captured)", NT + "Probably keeps the suggestion on plain Oral Minoxidil or the topical serum (inferred).", 'product-switched', ['p1', 'p5'], 'inferred'),
]
q.update(purpose="A preference question that chooses between plain minoxidil and the minoxidil plus vitamin blends. The blends cost more ($35 against $29 a month), so it is also an upsell.",
         engineRole='product-selector', branches=True,
         branchDetail="Not tested. The only reported question whose sole purpose is product choice. Expected effect: p1 against p2, p3, p4.",
         shownWhen="Reported in 2023 among the health questions, before the account step; may have changed")

q = Q['women-q8']
q.update(purpose="Captures the lead and ties the answers to a person before any result is shown.", engineRole='identity', branches=False,
         branchDetail="The account wall. Anonymous research stops here. Everything after it in this file comes from documents, not from testing.",
         shownWhen="Reported position: after the quiz, before the result. Not observed.")

q = Q['women-q9']
preg = "Hers's own safety text rules out the oral minoxidil products (pregnant or planning a pregnancy: should not take; do not breastfeed), spironolactone (not when pregnant or trying to conceive) and finasteride (contraindicated in women who could become pregnant). What the quiz shows on this answer (stop screen, topical-only offer, or nothing until the provider reads it) was not tested."
q['options'] = [
    opt("Pregnant (implied by the reviewer's description; wording not captured)", preg, 'product-removed', ORAL + ['p8'] + FIN, 'docs'),
    opt("Breastfeeding (implied by the reviewer's description; wording not captured)", "Oral minoxidil products are ruled out (patient information: do not breastfeed while taking minoxidil tablets); finasteride too. Hers's FAQ says most oral treatments are not intended for women who are pregnant or breastfeeding and that some topical solutions are possible while breastfeeding. Quiz behaviour not tested.", 'product-removed', ORAL + FIN, 'docs'),
    opt("Neither (implied; wording not captured)", NT + "No restriction; the standard offer (inferred).", 'none', [], 'inferred'),
]
q.update(purpose="The main safety screen for women: oral minoxidil, spironolactone and finasteride are all unsuitable in pregnancy.", engineRole='safety-screen', branches=True,
         branchDetail="Documented exclusions, enforcement untested. 'Planning a pregnancy' is excluded for oral minoxidil in the patient information but no reviewer reports it as a separate quiz option. Contraception and period regularity are not reported as questions at all.",
         shownWhen="Uncertain. A 2023 review lists it inside the quiz before the account step; a June 2026 article says the quiz is not the medical evaluation and puts medical history in a later intake.")

q = Q['women-q10']
q['options'] = [
    opt("Yes (implied; wording not captured)", NT + "Unknown. After a hysterectomy pregnancy is not possible, so this may be how the engine allows finasteride-containing products, or skips pregnancy questions (inferred from the reason finasteride is restricted; no source confirms).", 'unknown', FIN, 'unknown'),
    opt("No (implied; wording not captured)", NT + "No change expected (inferred).", 'none', [], 'inferred'),
]
q.update(purpose="Helps decide whether pregnancy is possible, which is the reason finasteride is restricted in women.", engineRole='safety-screen', branches=True,
         branchDetail="Not tested. Probably feeds the finasteride decision together with menopause status (inferred).", shownWhen="Uncertain (see women-q9)")

q = Q['women-q11']
q['options'] = [
    opt("Pre-menopausal (reviewer's wording: 'pre- or post-menopausal')", "Finasteride products are not offered: Hers says finasteride is only recommended for postmenopausal women, and the patient information calls it contraindicated in women of childbearing potential. The offer stays with minoxidil-based products and possibly spironolactone. Quiz behaviour not tested.", 'product-removed', FIN, 'docs'),
    opt("Post-menopausal (reviewer's wording: 'pre- or post-menopausal')", "The finasteride plus minoxidil topical (Postmeno Serum, earlier sold as a spray) becomes available 'for those who qualify'. Quiz behaviour not tested.", 'product-added', FIN, 'docs'),
]
q.update(purpose="Decides whether finasteride products can be offered. The single clearest product gate in the women's range.", engineRole='product-selector', branches=True,
         branchDetail="Documented rule (Hers pages and patient information); enforcement untested. Perimenopause is not reported as a separate answer; Hers's perimenopause page says finasteride is only recommended after menopause.",
         shownWhen="Uncertain (see women-q9)")

q = Q['women-q12']
q.update(purpose="Safety screen for the tablets. Hers's documents name the conditions that matter: for oral minoxidil, heart disease or a past heart attack, kidney disease, liver disease, blood pressure problems and pheochromocytoma; for spironolactone, high potassium and Addison's disease.",
         engineRole='safety-screen', branches=True,
         branchDetail="Option list not captured, so no options are listed here. Documented effects: pheochromocytoma is a contraindication to oral minoxidil; heart, kidney, liver and blood pressure problems 'may not be appropriate' (provider decides); high potassium or Addison's disease rules out spironolactone. See rules R6 to R9. Not reported as asked: thyroid disease, anaemia or iron, PCOS, depression, breast cancer history, scalp symptoms.",
         shownWhen="Uncertain (see women-q9)")

q = Q['women-q13']
q.update(purpose="Interaction check. Hers's spironolactone page lists medicines that make a patient 'not a candidate': eplerenone, cholestyramine, aspirin, potassium supplements, ACE inhibitors, angiotensin receptor blockers, heparin, lithium and digoxin.",
         engineRole='safety-screen', branches=True,
         branchDetail="Not tested. Documented effect: any of the listed medicines removes spironolactone and the patient is told to see a provider in person. For Hair Vitamins + Minoxidil: not with other zinc-containing supplements. Blood pressure medicines are a caution for oral minoxidil (review, 2026). See rules R8, R10.",
         shownWhen="Uncertain (see women-q9)")

q = Q['women-q14']
q.update(purpose="Shows the engine's pick and lets the patient change it before a provider sees it.", engineRole='product-selector', branches=True,
         branchDetail="Reported: one or two products, which the patient can keep or swap. Prescription products only. Which answers produce which pick was not tested; the documented gates are menopause (finasteride), pregnancy and breastfeeding (tablets), and the vitamins preference.",
         shownWhen="After the account is created (reported)")

q = Q['women-q15']
q.update(purpose="Identity check and evidence for the provider.", engineRole='identity', branches=False,
         branchDetail="Reported: photos of the hair and a valid ID 'for certain prescription-strength treatments' (June 2026); a government-issued ID and a payment card for any consultation (Healthline, Nov 2026). Which hair products need photos is not known.",
         shownWhen="After the account step; for prescription treatments (reported)")

q = Q['women-q16']
q.update(purpose="The legal prescribing step. Completing the assessment does not guarantee a prescription.", engineRole='eligibility-gate', branches=True,
         branchDetail="The provider can approve, change or decline, and sets the oral minoxidil dose (1.25 mg, later 2.5 mg). Usually by secure message with no live visit; the help centre says some states require a video visit, booked after the intake form is sent. Review is reported to take about 24 hours.",
         shownWhen="Always for prescription products")

q = Q['women-q17']
q.update(branchDetail="Plan lengths and prices on this screen were not seen. Reported: prescription products are subscription only; one reviewer gives 'from $50 a month billed every 3 months' for the postmenopausal spray; a $5 processing fee was reported in 2023.")

d['flows'][0]['stagesSummary'] = ("Reported, not observed: free hair quiz, mostly visual (goals, type of thinning, density photos, gradual or sudden, routine; about 10 minutes) "
    "-> health questions (pregnancy and breastfeeding, hysterectomy, pre- or post-menopausal, conditions, medicines, 'vitamins with your treatment'); a 2023 review "
    "puts these before the account step, a 2026 article puts medical history in a later intake -> create an account to see results -> one or two recommended "
    "prescription products, which can be swapped -> ID, payment card and, for some treatments, hair photos -> provider review by message (video visit in some states) "
    "-> subscription. Stage 2 could not test any step: the site is behind a security checkpoint.")

# ---------------------------------------------------------------- rules
def rule(i, when, then, et, affects, ev, proof, conf):
    return {'id': i, 'flow': 'women', 'when': when, 'then': then, 'effectType': et, 'affects': affects, 'evidence': ev, 'proof': proof, 'confidence': conf}
SIDX = "Hers page " + VIA
d['rules'] = [
 rule('R1', "women-q11 = pre-menopausal (any woman who has not gone through menopause)",
      "Finasteride products are not offered. The offer stays with minoxidil-based products, with spironolactone as a possible alternative.",
      'product-removed', FIN, 'docs',
      "Hers perimenopause page, as returned by the search index: finasteride is only recommended for postmenopausal women (https://www.forhers.com/conditions/perimenopause-hair-loss, " + VIA + "). Help centre patient information 'Compounded Topical Combination': finasteride 'is contraindicated in females of childbearing potential' (" + U_TOPICAL_HC + ", opened directly, runs/s2-help-centre and raw/help/compounded-topical-combination.txt). Policy is documented; the quiz step that enforces it was not tested.", 'high'),
 rule('R2', "women-q11 = post-menopausal",
      "The finasteride plus minoxidil topical (Hair Blends Postmenopause Serum; earlier a spray) is added to what can be offered, 'for those who qualify'.",
      'product-added', FIN, 'docs',
      "Hers blog 'Best hair loss treatments for women': finasteride offered 'to eligible women who've gone through menopause'; product page title 'Hair Blends Postmenopause Serum' (https://www.forhers.com/hair-loss/blends-postmeno-serum). Both " + VIA + ". Not tested.", 'high'),
 rule('R3', "women-q9 = pregnant (or planning a pregnancy)",
      "All tablets and finasteride are ruled out: oral minoxidil and the minoxidil plus vitamin blends, spironolactone, and the postmenopausal finasteride products. Whether the quiz shows a stop screen or leaves the refusal to the provider is not known.",
      'product-removed', ORAL + ['p8'] + FIN, 'docs',
      "Help centre 'Minoxidil' (oral tablets): 'Patients who are pregnant or are planning to become pregnant should not take minoxidil' (" + U_MINOX_HC + ", raw/help/oral-minoxidil-patient-information.txt). Help centre 'Minoxidil + Supplements': 'Do not take Minoxidil if you are pregnant or breastfeeding' (" + U_MINSUP_HC + "). Hers blog on spironolactone: not if pregnant or trying to get pregnant (https://www.forhers.com/blog/spironolactone-hair-loss, " + VIA + "). Not tested.", 'high'),
 rule('R4', "women-q9 = breastfeeding",
      "Oral minoxidil products and finasteride are ruled out. Hers says some topical solutions are possible while breastfeeding, so a topical is the likely remaining offer (which one is not stated).",
      'product-removed', ORAL + FIN, 'docs',
      "Help centre 'Minoxidil': 'Do not breastfeed while taking minoxidil tablets' (" + U_MINOX_HC + "). Hers hair-loss page FAQ, as summarised by the search index (not word for word): most oral treatments are not intended for women who are pregnant or breastfeeding, and some topical solutions are possible to use while breastfeeding (https://www.forhers.com/hair-loss, " + VIA + "). Not tested.", 'medium'),
 rule('R5', "age under 18",
      "Not eligible for the prescription minoxidil products. (Where the quiz asks age is not known.)",
      'hard-stop', ORAL, 'docs',
      "Hers 'Hair Vitamins + Minoxidil' page safety text lists under 18, allergic to minoxidil, pregnant or breastfeeding as people who should not use it (https://www.forhers.com/hair-loss/minoxidil-hair-vitamin, " + VIA + "; wording not verified word for word). Not tested.", 'medium'),
 rule('R6', "women-q12 includes pheochromocytoma (an adrenal tumour), or an allergy to minoxidil",
      "Oral minoxidil in any form is contraindicated.",
      'product-removed', ORAL, 'docs',
      "Help centre 'Minoxidil' and 'Minoxidil + Supplements': 'Minoxidil is contraindicated for patients diagnosed with an adrenal tumor called pheochromocytoma'; 'Do not take minoxidil if you have an allergy' (" + U_MINOX_HC + "; raw/help/). Whether the quiz lists pheochromocytoma as an option was not seen.", 'medium'),
 rule('R7', "women-q12 includes heart disease or a past heart attack, kidney disease, liver disease or a blood pressure problem (or the patient takes blood pressure medicine)",
      "Oral minoxidil 'may not be appropriate': the case goes to the provider, who may refuse the tablets. A topical is the likely alternative (inferred).",
      'flag-for-clinician', ORAL, 'docs',
      "Hers oral minoxidil and Hair Vitamins + Minoxidil pages: may not suit people with heart, kidney or liver disease, pheochromocytoma or blood pressure problems (" + SIDX + "). Help centre 'Minoxidil': 'Tell your provider if you have had a recent heart attack or history of heart conditions' and a warning of life-threatening heart-related side effects (" + U_MINOX_HC + "). Fortune review (Aug 2026): women with heart disease or on blood pressure medicine should consult a provider. Not tested.", 'medium'),
 rule('R8', "women-q13 (medicines) includes eplerenone, cholestyramine, aspirin, potassium supplements, an ACE inhibitor, an angiotensin receptor blocker, heparin, lithium or digoxin",
      "Not a candidate for spironolactone through Hers; told to see a healthcare provider in person. Other products are not affected by this rule.",
      'product-removed', ['p8'], 'docs',
      "Hers treatment page: 'You are not a candidate for treatment with spironolactone through the Hers platform if any of the following apply to you' followed by a medicines list and a conditions list (https://www.forhers.com/treatment/hair-loss/spironolactone, " + VIA + "; the conditions list did not come through). Help centre 'Spironolactone' lists overlapping interactions (" + U_SPIRO_HC + ", runs/s2-help-centre/00.txt). Not tested.", 'medium'),
 rule('R9', "women-q12 includes high potassium, Addison's disease, or a past allergic reaction to spironolactone",
      "Spironolactone must not be used.",
      'product-removed', ['p8'], 'docs',
      "Help centre 'Spironolactone (Generic for Aldactone)': 'Do not use it if you have had an allergic reaction to spironolactone, if you have high potassium levels, or if you have Addison's disease' (" + U_SPIRO_HC + ", runs/s2-help-centre/00.txt, raw/help/spironolactone-patient-information.txt). Whether the quiz asks about these was not seen.", 'medium'),
 rule('R10', "women-q13 includes another medicine or supplement that contains zinc",
      "The Hair Vitamins + Minoxidil tablet (which may contain zinc sulfate) should not be taken; plain oral minoxidil or the biotin chew is the natural substitute (inferred).",
      'product-switched', ['p4', 'p1'], 'docs',
      "Help centre 'Minoxidil + Supplements': 'Do not take this compounded tablet if you are taking other medications or supplements that include Zinc' (" + U_MINSUP_HC + ", raw/help/minoxidil-supplements-chew-gummy.txt). Whether the intake asks about zinc is unknown.", 'low'),
 rule('R11', "women-q2 or women-q4 points to a hair disorder other than female pattern hair loss (sudden shedding = telogen effluvium; patches = alopecia areata)",
      "Oral minoxidil is not offered. A 2026 review says women with sudden, patchy or severe loss should see a healthcare provider. Whether the quiz shows a stop screen is not known.",
      'product-removed', ORAL, 'docs',
      "Hers oral minoxidil page: 'We do not offer oral minoxidil treatment for other hair disorders (eg, telogen effluvium or alopecia areata)' (https://www.forhers.com/hair-loss/oral-minoxidil, " + VIA + "). Fortune review, updated 1 Aug 2026. Not tested.", 'medium'),
 rule('R12', "women-q7 = yes, wants vitamins with treatment",
      "The suggestion probably moves from plain Oral Minoxidil ($29 a month) to a minoxidil plus vitamin product ($35 a month): Hair Vitamins + Minoxidil, or the biotin chew or gummy.",
      'product-switched', ['p1', 'p2', 'p3', 'p4'], 'inferred',
      "The question is reported by Innerbody (Dec 2023): 'Whether or not you want vitamins with your potential treatment'. The effect is inferred: the blends differ from plain oral minoxidil only by the added vitamins. Not tested.", 'low'),
 rule('R13', "the patient is offered or chooses an oral minoxidil product",
      "Topical minoxidil is not given with it: Hers says using both at once is not recommended. So the engine offers a tablet route or a topical route, not both.",
      'product-switched', ORAL + ['p5', 'p9', 'p10'], 'docs',
      "Hers oral minoxidil page: it is not recommended to use both topical and oral minoxidil at the same time (" + SIDX + "). Not tested.", 'medium'),
 rule('R14', "any prescription product is chosen",
      "A licensed provider reviews the answers and can approve, change or decline; completing the assessment does not guarantee a prescription. The provider sets the oral minoxidil dose: 1.25 mg to start, 2.5 mg possible later.",
      'flag-for-clinician', ORAL + ['p5', 'p8'] + FIN, 'docs',
      "Help centre 'How does this work?' (updated 18 Jun 2026) and 'Do I need a prescription?' (" + U_HOW_HC + "; " + U_RX_HC + "; raw/help/). Dose: Innerbody (Dec 2023), finvsfin (Aug 2026). Not tested.", 'high'),
 rule('R15', "the patient lives in a state that requires a live visit",
      "After the intake form is sent she is asked to book a video visit with a provider; elsewhere the review is by secure message only.",
      'extra-questions', [], 'docs',
      "Help centre 'How does this work?': 'In some states, a video visit with a healthcare provider is required... you will be prompted to schedule a video visit after submitting your online intake form' (" + U_HOW_HC + ", raw/help/how-does-this-work.txt). The states are not named.", 'medium'),
 rule('R16', "the patient wants a product without a prescription (5% foam, 2% drops, biotin gummies, shampoo and conditioner)",
      "No quiz and no provider: these are bought directly from their product pages. The quiz itself is reported to recommend prescription products only.",
      'skip-questions', ['p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15'], 'docs',
      "Help centre 'Do I need a prescription?': non-prescription products 'do not necessitate a medical consultation' (" + U_RX_HC + "). Innerbody (Dec 2023): the quiz no longer recommends over-the-counter products. Not tested.", 'medium'),
 rule('R17', "a prescription treatment is selected (after the account step)",
      "The patient must show a government-issued ID and give a payment card; for some prescription-strength treatments she must also upload clear photos of her hair.",
      'extra-questions', [], 'docs',
      "Healthline Hers review (updated 19 Nov 2026), about the platform in general (its tester used birth control, not hair care): 'You'll also need to provide a government-issued ID and a credit card'. AOL / New York Post (7 Jun 2026): photos of your hair and a valid ID for certain prescription-strength treatments. Not tested and never to be tested (behind the account wall).", 'medium'),
 rule('R18', "the visitor is a man",
      "Hers does not serve him: its hair range and safety text are written for women only. Men's hair-loss treatment is on the sister site Hims (www.hims.com/hair-loss).",
      'hard-stop', [], 'inferred',
      "Inferred from the range: every Hers hair page found is titled for women, and the parent runs a separate men's site whose hair page opens live (runs/probe-hims). Whether the Hers quiz asks sex or redirects was not seen.", 'low'),
]

# ---------------------------------------------------------------- experiments
d['experiments'] = [
 {'id': 's2-retest-home', 'flow': 'women', 'changed': "Nothing changed: access re-test of the women's baseline (10 second wait) at the start of stage 2",
  'result': "Still the Cloudflare security checkpoint (HTTP 403, 'Performing security verification'). No quiz screen was reached, so no baseline end state exists and no one-change experiment could be run. The checkpoint was not defeated.",
  'run': 'runs/s2-retest-home'},
 {'id': 's2-help-centre', 'flow': 'women', 'changed': "Not a quiz replay: read-only visit to the shared Hims & Hers help centre (4 pages, no clicks, no forms)",
  'result': "Opened. Patient drug information for spironolactone and for the compounded minoxidil plus supplements tablet was read; two help-centre searches found no article describing the hair quiz. With four articles saved earlier by the Hims US investigator (oral minoxidil, minoxidil + supplements chew and gummy, compounded topical combination, 'How does this work?'), these are the proof for rules R1, R3, R4, R6, R7, R9, R10, R14, R15, R16.",
  'run': 'runs/s2-help-centre'},
]

# ---------------------------------------------------------------- recommendations
d['recommendations'] = [
 {'profile': "Baseline woman: 38, widening parting, gradual over 2 years, not pregnant, not breastfeeding, not planning a pregnancy, periods regular, no conditions, no medicines",
  'offered': ['p1', 'p2', 'p3', 'p4', 'p5', 'p8'], 'default': 'unknown',
  'note': "Not observed (site blocked). Expected from Hers's documents: one or two minoxidil-based prescription products (a 2026 reviewer: 'one or two products will be recommended'), most likely Oral Minoxidil or a Hair Blends product, swappable; spironolactone is an alternative she is eligible for. Finasteride products are excluded because she is not past menopause. Which single product is shown first is not known.",
  'evidence': 'inferred'},
 {'profile': "Woman past menopause with gradual thinning, no conditions, no medicines",
  'offered': ['p6', 'p7', 'p1', 'p2', 'p3', 'p4', 'p5'], 'default': 'unknown',
  'note': "Hers says finasteride is offered to eligible women who have gone through menopause, as a finasteride plus minoxidil topical (Postmeno Serum; earlier a spray). The minoxidil-only products remain possible. Not observed.",
  'evidence': 'docs'},
 {'profile': "Woman who is pregnant or planning a pregnancy",
  'offered': [], 'default': 'none',
  'note': "Hers's safety text rules out every tablet and finasteride. No source says what, if anything, the quiz then offers; over-the-counter products can still be bought directly but Hers does not recommend them for pregnancy in any text found. Not observed.",
  'evidence': 'docs'},
 {'profile': "Woman who is breastfeeding",
  'offered': ['p5', 'p9', 'p10'], 'default': 'unknown',
  'note': "Tablets are ruled out. Hers's FAQ is summarised by the search index as saying some topical solutions are possible while breastfeeding, without naming them, so the three topicals listed here are the candidates, not a confirmed offer. Not observed.",
  'evidence': 'inferred'},
 {'profile': "Woman with heart disease, a blood pressure problem, or kidney or liver disease",
  'offered': ['p5', 'p9', 'p10'], 'default': 'unknown',
  'note': "Oral minoxidil 'may not be appropriate'; the provider decides. A topical is the likely alternative. Spironolactone is itself a heart and blood pressure medicine with its own exclusions, so it is unlikely here. Inferred from Hers's safety text; not observed.",
  'evidence': 'inferred'},
 {'profile': "Woman with sudden shedding or patchy loss (not female pattern hair loss)",
  'offered': [], 'default': 'none',
  'note': "Hers says it does not offer oral minoxidil for telogen effluvium or alopecia areata, and that spironolactone does not help non-hormonal causes. A 2026 review says such women should see a healthcare provider. Whether the quiz stops her or still shows a product was not observed.",
  'evidence': 'docs'},
 {'profile': "Woman who does not want a prescription",
  'offered': ['p9', 'p10', 'p11', 'p12', 'p13'], 'default': 'p9',
  'note': "Bought directly from product pages with no quiz: minoxidil 5% foam (the usual first choice for women, once a day) or 2% drops, with supplements and hair care as extras. Default is our reading, not a Hers statement.",
  'evidence': 'docs'},
 {'profile': "Baseline man: 32, receding hairline and thinning crown",
  'offered': [], 'default': 'none',
  'note': "Not served. Hers is the women's brand; men are served by the sister site Hims. No Hers men's flow exists to test.",
  'evidence': 'inferred'},
]

# ---------------------------------------------------------------- summary
d['engineSummary'] = ("Untested: the site was blocked, so this is how the engine should work according to Hers's own public statements and reviewers, not how it was seen to work. "
    "Hers treats one diagnosis, female pattern hair loss, with one main drug, minoxidil, sold in several formats. The decision has four parts. "
    "(1) A visual quiz collects goals, the kind and speed of thinning and routine; nothing public shows these changing the product, except that sudden or patchy loss falls outside what Hers treats with oral minoxidil. "
    "(2) Three gates then shape the offer. Menopause: finasteride (the Postmeno Serum or spray) is only for women past menopause. Pregnancy, planning a pregnancy or breastfeeding: tablets (oral minoxidil, the vitamin blends, spironolactone) and finasteride are ruled out, leaving at most a topical. Health and medicines: heart, kidney, liver or blood pressure problems make oral minoxidil doubtful, pheochromocytoma rules it out, and a list of potassium-raising and other medicines, high potassium or Addison's disease rules out spironolactone. "
    "(3) A preference question (vitamins with your treatment?) probably picks between plain oral minoxidil at $29 a month and the vitamin blends at $35. "
    "(4) After an account is made, one or two prescription products are shown and can be swapped; a licensed provider then approves, changes or declines and sets the dose, by message in most states and by video in some. "
    "Over-the-counter minoxidil, supplements and hair care sit outside the quiz and are bought directly.")

d['strengths'] = [
    "Many formats of one proven drug: plain oral minoxidil, three minoxidil plus vitamin formats (pill, chew, gummy) and a topical serum, so almost any preference can be met without changing the active ingredient.",
    "A clear, defensible finasteride rule (after menopause only), with a dedicated postmenopausal product.",
    "Low entry price: $29 a month for oral minoxidil and over-the-counter minoxidil from $12.67 a month on a long plan.",
    "The patient can swap the suggested treatment before the provider sees it (reported), and pays nothing until a treatment is selected.",
    "Written patient information for every prescription product is public in the help centre, and compounded products are clearly labelled as not FDA-approved.",
    "Narrow scope stated openly: no oral minoxidil for telogen effluvium or alopecia areata.",
]
d['weaknesses'] = [
    "The quiz result sits behind an account (reported), so a visitor cannot see a recommendation or a final price without giving contact details.",
    "The consultation is reported as thin on cause-finding: no reviewer mentions questions on thyroid disease, iron or anaemia, PCOS or signs of high androgens, recent illness or weight loss, scalp symptoms, family history, contraception or period regularity. No blood tests and no blood pressure reading are described, although the main drug is a blood pressure medicine.",
    "Most prescription products are compounded and not FDA-approved, and the strengths of the oral blends are not published on the pages found.",
    "Eligibility rules are scattered: the spironolactone exclusion list is on a separate treatment page, and safety text sits low on product pages.",
    "Dutasteride, oral finasteride for women, tretinoin add-ons and iron or vitamin D testing are not offered; a reviewer notes other brands offer more options.",
    "Prices are hard to pin down: sources give $35 and $39 for the blends, and plan-length prices are only shown at checkout.",
    "Reviewers report complaints about subscription charges, refunds and reaching a clinician; some users felt the provider did not ask enough questions.",
]
d['opportunities'] = [
    "Show the recommendation, strength and full price before asking for an email or an account.",
    "Ask the cause-finding questions Hers is not reported to ask (thyroid, iron, PCOS signs, recent illness, scalp symptoms, medicines that cause shedding) and explain how each answer changed the plan.",
    "Offer a route for the women Hers turns away: sudden shedding, patchy loss, pregnancy and breastfeeding (advice, safe topicals, blood tests, referral).",
    "Ask for a home blood pressure and pulse reading before oral minoxidil, and a potassium check plan for spironolactone, and say so up front.",
    "Publish who cannot have each treatment on the product page itself, and state exact strengths for combination products.",
    "Give perimenopausal women a clear answer: Hers's finasteride rule is 'after menopause only', with nothing specific in between.",
    "Sell fewer, simpler options with fixed, visible plan prices; Hers's many near-identical minoxidil formats are hard to compare.",
]

# ---------------------------------------------------------------- sources
src = d['sources']; have = {s['url'] for s in src}
for t, u in [
    ("Help centre (shared Hims & Hers): Spironolactone patient drug information (opened directly, updated 14 Jul 2025)", U_SPIRO_HC),
    ("Help centre: Minoxidil oral tablets patient drug information (updated 14 Jul 2025)", U_MINOX_HC),
    ("Help centre: Minoxidil + Supplements (chew, gummy, tablet) patient drug information", U_MINSUP_HC),
    ("Help centre: Minoxidil + Supplements Compounded Tablet", HC + '/articles/38834273003547-Minoxidil-Supplements-Compounded-Tablet'),
    ("Help centre: Compounded Topical Combination (minoxidil, finasteride, ketoconazole, biotin, dexpanthenol)", U_TOPICAL_HC),
    ("Help centre: How does this work? (video visit in some states; updated 18 Jun 2026)", U_HOW_HC),
    ("Help centre: Do I need a prescription?", U_RX_HC),
    ("Hers Hair Blends Serum product page (via search index)", 'https://www.forhers.com/hair-loss/blends-solutions'),
    ("Hers: perimenopause hair loss (finasteride only after menopause; via search index)", 'https://www.forhers.com/conditions/perimenopause-hair-loss'),
    ("Hers blog: Best hair loss treatments for women (via search index)", 'https://www.forhers.com/blog/best-hair-loss-treatment-for-women'),
    ("Hers: finasteride drug information (via search index)", 'https://www.forhers.com/drugs/info/finasteride'),
    ("Healthline: Hers review (updated 19 Nov 2026; ID and card needed; tester used birth control, not hair)", 'https://www.healthline.com/health/womens-health/hers-review'),
    ("healthrx.com: Hers prescription process (undated summary, not first-hand)", 'https://healthrx.com/brands-hers/prescription-process'),
    ("Business Wire: Hers introduces new prescription dermatology offerings (13 Jan 2022; page not readable, title and summary only)", 'https://www.businesswire.com/news/home/20220113005023/en/'),
]:
    if u not in have: src.append({'title': t, 'url': u}); have.add(u)

d['limitations'] = [
    "Nothing was observed live on Hers at either stage: the site is behind a security checkpoint that was not, and must not be, defeated. No answer was changed and replayed, so there are no tested rules.",
    "Every rule is Hers's stated eligibility or safety policy (docs) or reasoning from it (inferred). The documents say who should not have a product; they do not say whether the quiz blocks the patient, hides the product, shows a warning or leaves it to the provider.",
    "Question wording is not verbatim and most answer options are unknown. Options shown as 'implied' or 'reviewer's category' are not the site's wording.",
    "Not tested, because the quiz could not be reached: age bands, each hair pattern, speed and duration, scalp symptoms, family history, each medical condition, each medicine, allergies, previous treatments and side effects, treatment preference, goals, lifestyle questions, and entry from product pages against the main page.",
    "Whether the health questions come before or after the account step is unresolved (a 2023 review says before; a 2026 article implies after).",
    "The conditions half of the spironolactone 'not a candidate' list, and the exact safety wording on product pages, were read only as search-index summaries and may be incomplete or out of date.",
    "Prices come from a search index and from reviews of different dates and disagree in places; plan-length prices for prescription products were not found.",
    "The default product for any profile is unknown; the 'offered' lists in recommendations are the products the patient is eligible for on paper, not a seen result.",
    "The quiz definition (probably a code chunk named hers.us.modern.domains-consultation-hair-loss.<hash>.js) was not read; reading it would settle most of the above.",
]
d['checkedOn'] = '2026-11-23'
json.dump(d, open(P, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
print('written', P)
