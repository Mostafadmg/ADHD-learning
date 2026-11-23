#!/usr/bin/env python3
"""stage2_patch.py: apply the stage 2 (EXPERIMENT) findings to company.json in place. Safe to run again (it replaces
entries by id). Run from the company folder:  python3 scripts/stage2_patch.py
Stage 1 built company.json with scripts/build_company.py; do NOT re-run that script afterwards, it would wipe this."""
import json

P = 'company.json'
d = json.load(open(P, encoding='utf8'))

RUNS5 = 'runs/s2-baseline-lp-prequiz, runs/exp-lp-01-q1-stop, runs/exp-lp-02-q1-regrow, runs/exp-lp-03-q2-no, runs/exp-lp-04-q3-notsure'
SAME = ('Same visible text (identical checksum), same scroll position after each click (823, 1628, 2433 px) and same end links '
        '(all to /c/hl or /c/hl/goals) as every other answer.')

# ---------------------------------------------------------------- access
d['checkedOn'] = '2026-11-23'
d['access']['howTested'] = ['live-walk', 'site-code', 'public-docs']
d['access']['accountWall'] = ('Not located. The men\'s consultation at hims.com/c/hl would not load on two more tries in stage 2 '
    '(22:17 and 22:30 UTC, 23 Nov 2026), so where sign-in is forced in the US flow is still unknown. The landing-page pre-quiz '
    'has no wall: it ends on a product pitch whose buttons link to /c/hl. Weak hints only: the page state has a "registration" '
    'field and an "initialQuestionnaire" field (a first set of questions kept apart from the medical "intakeFormUpfront"), which '
    'fits the UK sister site where a marketing quiz comes first and the email wall comes before any medical question; that is an '
    'inference, not something seen on hims.com.')
blk = d['access']['blockers']
for b in [
    'Stage 2 re-test (23 Nov 2026, 22:17 and 22:30 UTC): still blocked. On the second try 37 of the page\'s own script files (/hims.us.modern.*.js, including the hair consultation chunk) were answered with HTTP 403. Proof: runs/s2-baseline-men, runs/s2-diag-hl-retry/requests.log. Not bypassed.',
    'Cached copies: web.archive.org resets the connection from this machine and the fetch tool refuses the host. archive.org\'s availability service says copies of /c/hl (11 Nov 2026) and /c/hl/goals (28 Oct 2026) exist, but they could not be opened.',
    'Web search stopped working after one query in stage 2 (shared search budget used up), so no new third-party walkthroughs could be searched for. Known pages were fetched directly instead.',
]:
    if b not in blk:
        blk.append(b)
d['access']['coverageNote'] = (
    'Stage 1 (map): every hair product page on hims.com was read, entry links mapped, one landing-page pre-quiz walked, safety '
    'pages and help-centre drug sheets read. Stage 2 (experiment): the men\'s consultation was re-tested twice and is still '
    'blocked, so NO one-change experiment could be run on the real questionnaire. What was tested live: the three-question '
    'landing-page pre-quiz, with one baseline replay and four one-change replays that cover every non-baseline option (5 '
    'replays; every request the page made was logged). Result: no answer changes anything the visitor sees. Stage 2 also read '
    'two more hair landing pages (no pre-quiz on them), six more Hims blog posts and five more help-centre articles for '
    'published descriptions of the intake, review and plans, and re-read the page state served with /c/hl for feature-flag '
    'settings. Everything said about the real consultation is therefore "docs" (Hims says so in public), "code" (field and '
    'flag names in the page hims.com serves; names only, no question text) or "inferred". NOT done: any question, branch, '
    'stop screen, recommendation, plan price or account wall of the men\'s consultation; anything on Hers (women).')

# ---------------------------------------------------------------- landing-page pre-quiz (all observed)
lp = next(f for f in d['flows'] if f['id'] == 'lp-prequiz')
lp['stagesSummary'] = ('3 anonymous marketing questions on the landing page itself → the page scrolls to a pitch for the '
    'prescription spray with buttons to the real consultation at /c/hl. No account, no medical question, no eligibility check, '
    'no price, no plan. Stage 2 clicked every option: the end is the same for all of them. Found on /lp/hair-start-top-fin-fa '
    '(and /hair-start-top-fin-lp, which redirects to it); not on /lp/hair-start-preventmaint, /lp/hair-start-comparison-dlp or /hair-loss.')
q = {x['id']: x for x in lp['questions']}

def opt(label, effect, affects=None, etype='marketing-only'):
    return {'label': label, 'effect': effect, 'effectType': etype, 'affects': affects or [], 'evidence': 'observed'}

q['lp-q1']['options'] = [
    opt('Stop hair loss', 'Moves to question 2 and nothing else. ' + SAME + ' The click is logged as a tracking event (…hair-goals_stop-hair-loss…). Proof: runs/exp-lp-01-q1-stop.'),
    opt('Regrow hair', 'Moves to question 2 and nothing else. ' + SAME + ' The click is logged as a tracking event (…hair-goals_regrow-hair…). Proof: runs/exp-lp-02-q1-regrow.'),
    opt('Both', 'Baseline answer. Moves to question 2. No page change, no product change; the click is logged as a tracking event (…hair-goals_both…). Proof: runs/s2-baseline-lp-prequiz.'),
]
q['lp-q1'].update({
    'purpose': 'Engagement: gets the visitor clicking before the sales pitch, and records a stated goal against the visitor\'s device id for marketing. The page itself says the answers are not a medical assessment and are not shared with a provider.',
    'engineRole': 'marketing', 'branches': False,
    'branchDetail': 'None. All three options were clicked live (stage 2): same next question, same end pitch, same links. The served definition gives the options no target.',
    'shownWhen': 'always (first of 3, in the hero of the landing page /lp/hair-start-top-fin-fa)',
    'evidence': 'observed', 'proof': RUNS5 + '; quiz-definition.lp-prequiz.json'})
q['lp-q2']['options'] = [
    opt('Yes', 'Baseline answer. Moves to question 3. Nothing else changes. Proof: runs/s2-baseline-lp-prequiz.'),
    opt('No', 'Moves to question 3 exactly as "Yes" does: saying you are NOT looking for a simple solution changes nothing. ' + SAME + ' Proof: runs/exp-lp-03-q2-no.'),
]
q['lp-q2'].update({
    'purpose': 'Engagement and framing: "simple solution" sets up the once-a-day spray pitch. Not used to choose anything.',
    'engineRole': 'marketing', 'branches': False,
    'branchDetail': 'None. Both options clicked live: same next question and same end.',
    'shownWhen': 'after lp-q1 is answered (any answer)', 'evidence': 'observed',
    'proof': 'runs/s2-baseline-lp-prequiz, runs/exp-lp-03-q2-no'})
q['lp-q3']['options'] = [
    opt('Yes', 'Baseline answer. The page scrolls to the block "Prescription-strength ingredients for real results" (once-daily spray; "4-in-1 formula available with ketoconazole and biotin") with the buttons "Get the spray" and "See if treatment is right for me", both linking to /c/hl. Proof: runs/s2-baseline-lp-prequiz.', ['p3', 'p4']),
    opt('Not sure yet', 'Exactly the same as "Yes": the same prescription spray pitch and the same two buttons to /c/hl. No non-prescription product (foam, solution, shampoo) is offered to someone who is unsure about prescription treatment. ' + SAME + ' Proof: runs/exp-lp-04-q3-notsure.', ['p3', 'p4']),
]
q['lp-q3'].update({
    'purpose': 'A lead-in to the spray pitch whatever the answer. It looks like a prescription / non-prescription fork but is not one.',
    'engineRole': 'marketing', 'branches': False,
    'branchDetail': 'None. Both options clicked live and both land on the same block (the served definition gives both the same target entry, 7iFPgDm1VFwqfOML5ug6Pv).',
    'shownWhen': 'after lp-q2 is answered (any answer)', 'evidence': 'observed',
    'proof': 'runs/s2-baseline-lp-prequiz, runs/exp-lp-04-q3-notsure; quiz-definition.lp-prequiz.json'})

# ---------------------------------------------------------------- men's consultation: topics only (docs / code / inferred)
men = next(f for f in d['flows'] if f['id'] == 'men')
men['stagesSummary'] = (
    'NOT WALKED (blocked in stage 1 and twice more in stage 2). From public documents and field names only, the likely shape is: '
    'hair questions (goals, where, how long, family history, stress, styling) → account → state and date of birth → medical '
    'intake form with follow-up questions → photos (in most cases) → a recommended product that the customer may change, with '
    'strength, quantity and plan length → optional non-prescription add-ons → payment → provider review (allow at least 48 '
    'hours; video visit in some states) → shipment. The order of these steps and the position of the account wall were NOT seen. '
    'The entries below are topics, not real screens.')
NOT_SEEN = 'Position in the flow, and whether it comes before or after the account wall, are NOT known; the "stage" value is a best guess.'
mq = {x['id']: x for x in men['questions']}

def upd(i, **kw):
    mq[i].update(kw)

upd('men-t1',
    purpose='Docs: Hims says its form asks about "your hair goals". Inferred: used for personalisation and sales copy, not for eligibility (on the UK sister site the same kind of question changes nothing; on the US landing-page pre-quiz the goals question changes nothing either).',
    engineRole='personalisation', branches=False,
    branchDetail='Unknown for the real consultation. The only goals question that could be tested (the landing-page pre-quiz, lp-q1) has no branch.',
    shownWhen='Entry at /c/hl/goals (the "Get started" buttons). ' + NOT_SEEN)
upd('men-t2',
    text='[Exact wording not seen: the consultation would not load] Where you are experiencing hair loss (Hims: its intake form asks "where you\'re experiencing hair loss").',
    purpose='Docs: named by Hims as an intake question. Inferred: tells male pattern loss (hairline, crown) from patterns that need an in-person check; Hims\' own FAQ says men "suddenly noticing bald patches with no apparent cause or pattern" should "seek medical attention".',
    engineRole='diagnosis', branches=False,
    branchDetail='Unknown. No public document says an answer here stops the visit or changes the product.',
    shownWhen=NOT_SEEN, evidence='docs', source='https://www.hims.com/blog/hims-vs-happy-head ; https://www.hims.com/lp/hair-start-comparison-dlp (FAQ)')
upd('men-t3',
    purpose='Docs (third-party review, seen through a search summary only): asks what other products you have tried. Inferred: matters because the safety pages rule out using two finasteride products, or the pill with another finasteride or minoxidil product, at the same time.',
    engineRole='product-selector', branches=False,
    branchDetail='Unknown. Published rule that this answer would feed: no topical finasteride together with oral finasteride or dutasteride (see rules R3, R5).',
    shownWhen=NOT_SEEN)
upd('men-t4',
    purpose='Docs: Hims lists family history among the things its form asks, with a short "Why We Ask" note. Inferred: supports the working diagnosis of hereditary (male pattern) hair loss; not a gate.',
    engineRole='diagnosis', branches=False, branchDetail='Unknown; no published effect on the offer.', shownWhen=NOT_SEEN,
    source='https://www.hims.com/blog/hims-vs-keeps ; https://www.hims.com/blog/hims-vs-rogaine')
upd('men-t5',
    purpose='Docs: "lifestyle" is named by Hims as a topic of its form. No detail is published. Inferred: background for the provider and for marketing, not a gate.',
    engineRole='personalisation', branches=False, branchDetail='Unknown; no published effect on the offer.', shownWhen=NOT_SEEN)
upd('men-t6',
    text='[Exact wording not seen: the consultation would not load] Stress levels ("mental health (like stress levels)").',
    purpose='Docs: Hims names "mental health (like stress levels)" and "stress levels" as intake topics. Inferred: stress is asked as a cause of shedding; a separate mood question for finasteride safety (the finasteride safety page warns about depression) may sit in the medical form, but none was seen.',
    engineRole='diagnosis', branches=False, branchDetail='Unknown; no published effect on the offer.', shownWhen=NOT_SEEN,
    source='https://www.hims.com/blog/hims-vs-keeps ; https://www.hims.com/blog/hims-vs-rogaine')
upd('men-t7',
    purpose='Docs: Hims asks about "styling habits, and how you prefer to wear your hair" and says compounded products come in several forms "so that a provider can choose the product that fits your unique needs". Inferred: steers the format (spray or serum on the scalp against pill or chew).',
    engineRole='personalisation', branches=False,
    branchDetail='Unknown. Inferred only: may change which format is shown as the recommendation.', shownWhen=NOT_SEEN)
upd('men-t8',
    purpose='Code (names only): the consultation state stores "prescriptionPreference" and the flag "hairLossPrescriptionPreference" is on for all visitors. Inferred: the visitor is asked whether he wants prescription treatment or non-prescription products, and the answer chooses between the provider route and the add-to-cart products. Not seen.',
    engineRole='product-selector', branches=True,
    branchDetail='Inferred from the field name only: prescription route (provider review) against non-prescription products (minoxidil foam or solution, shampoo, gummies). The landing-page pre-quiz asks a similar question (lp-q3) and there it changes nothing.',
    shownWhen=NOT_SEEN)
upd('men-t9',
    purpose='The account wall. Code: the /c/hl page loads Google sign-in and Auth0 settings, and the consultation state has a "registration" field. Where it sits was not seen. One third-party review (weak, seen through a search summary) says the profile comes before the questions; the UK sister site puts it after a marketing quiz and before any medical question.',
    engineRole='identity', branches=False, branchDetail='', shownWhen=NOT_SEEN)
upd('men-t10',
    purpose='Docs: decides whether the visit is by secure message or needs a video visit ("In some states, a video visit with a healthcare provider is required"), and whether Hims serves the address at all (not Puerto Rico). Code: the state has an "invalidInitialShippingState" flag and two flags for compounded products in Massachusetts and Washington.',
    engineRole='eligibility-gate', branches=True,
    branchDetail='Docs: some states → the customer is "prompted to schedule a video visit after submitting your online intake form"; elsewhere the provider replies by message. Inferred from flag names: compounded products may be handled differently in Massachusetts and Washington.',
    shownWhen=NOT_SEEN)
upd('men-t11',
    purpose='Docs: age gate. Every prescription hair product\'s safety page excludes anyone under 18.',
    engineRole='eligibility-gate', branches=True,
    branchDetail='Docs: under 18 → no prescription product. The screen and its wording were not seen. No upper age limit is published.',
    shownWhen=NOT_SEEN)
upd('men-t12',
    text='[Exact wording not seen: the consultation would not load] Medical intake form: medical conditions, medicines and supplements, allergies (Hims says its form covers "allergies, medication use" as competitors\' forms do).',
    purpose='The clinical screen the provider reads. Docs: Hims says its intake includes allergies and medication use. The published "who should not use" lists show which answers matter: heart, liver, kidney and prostate problems, breast or prostate cancer, blood thinners and antifungals, current finasteride, dutasteride or minoxidil use, allergies to finasteride or minoxidil.',
    engineRole='safety-screen', branches=True,
    branchDetail='Code (names only): the visit state has "rootQuestions" and "triggers", so some answers open follow-up questions. Which answers remove which product is not public; rules R3 to R5 give the published exclusions and are labelled docs.',
    shownWhen=NOT_SEEN,
    source='raw/props-c-hl.json: visit.questions, visit.rootQuestions, visit.triggers, visit.isIntakeFormCompleted; https://www.hims.com/blog/hims-vs-happy-head ; https://support.hims.com/hc/en-us/articles/360032844051-How-does-this-work')
upd('men-t13',
    purpose='Docs: for the provider\'s evaluation. Hims: "In most cases, Hims will also have you submit photos of your hair"; "may ask you to upload photos of your hairline". Help centre: an order can wait on an action item such as "upload another photo". Code (name only): a flag called himsHairSkipPhotos is on for all visitors, so photos may be optional or skipped for some.',
    engineRole='diagnosis', branches=False,
    branchDetail='Unknown. "In most cases" (docs) means some visitors are not asked; the condition is not published.',
    shownWhen='In most cases (docs). ' + NOT_SEEN)
upd('men-t14',
    purpose='Docs: identity check when the provider or pharmacy needs it: "If further verification is required, they may ask for additional documentation, like your photo ID."',
    engineRole='identity', branches=False, branchDetail='Only asked when more verification is needed (docs); the trigger is not published.')
upd('men-t15',
    purpose='Code (field names in the page hims.com serves): the product and plan picker. The site marks one product as recommended ("recommendedBrand": true by default) and a recommended dose the customer may override ("overrideRecommendedDosage": true), and stores product, strength, quantity, days of supply and packaging. Docs: plans of 3, 6 or 12 months, some products 5 months, and a 10-month plan paid upfront behind the headline price.',
    engineRole='product-selector', branches=True,
    branchDetail='Code: fields brandId, strength, quantity, daysSupply, packagingSelection, recommendedBrand, overrideRecommendedDosage, originalRecommendedTreatment, showRecommendationModal, hideDosageSelection. Which product is recommended for which answers was not seen. A flag named himsHairTopFinRecco is on for all visitors, which hints that the topical finasteride + minoxidil spray is the default recommendation (inferred from the name, low confidence).',
    shownWhen=NOT_SEEN)
upd('men-t16',
    purpose='Code (names only): a cross-sell step for non-prescription products before payment. The flag himsHairOTCAddOnV1 is on for all visitors and himsHairHideOtcStep is off; the state has "additionalItems" and "otcChargedAmount". Docs: prescription products ship free, non-prescription products carry a $5 shipping fee.',
    engineRole='marketing', branches=False, branchDetail='Add-ons only; no effect on eligibility (inferred).', shownWhen=NOT_SEEN)

new_topics = [
    {'id': 'men-t17', 'order': 17, 'stage': 'anonymous',
     'text': '[Exact wording not seen: the consultation would not load] How long you have been experiencing hair loss.',
     'type': 'single', 'options': [],
     'purpose': 'Docs: Hims says its intake form asks "how long you\'ve been experiencing hair loss". Inferred: gradual loss over years fits male pattern hair loss; sudden loss points elsewhere (Hims\' FAQ tells men with sudden bald patches to seek medical attention).',
     'engineRole': 'diagnosis', 'branches': False, 'branchDetail': 'Unknown; no published effect on the offer.',
     'shownWhen': NOT_SEEN, 'evidence': 'docs', 'source': 'https://www.hims.com/blog/hims-vs-happy-head'},
    {'id': 'men-t18', 'order': 18, 'stage': 'after-account',
     'text': '[Exact wording not seen: the consultation would not load] Sex assigned at birth.',
     'type': 'single', 'options': [],
     'purpose': 'Docs: Hims says its intake form asks "your sex assigned at birth". The finasteride products are "intended for use by individuals assigned male at birth ... who are not pregnant, breastfeeding, or able to become pregnant".',
     'engineRole': 'eligibility-gate', 'branches': True,
     'branchDetail': 'Docs: finasteride products are not for anyone who is or may become pregnant; Hims sends women to Hers. What the software does with the answer (stop, redirect to Hers, or remove finasteride products) was not seen.',
     'shownWhen': NOT_SEEN, 'evidence': 'docs', 'source': 'https://www.hims.com/blog/hims-vs-happy-head ; https://www.hims.com/important-safety/rx-hair-loss-serum'},
    {'id': 'men-t19', 'order': 19, 'stage': 'after-account',
     'text': '[Exact wording not seen: the consultation would not load] Whether anyone in your household is pregnant.',
     'type': 'single', 'options': [],
     'purpose': 'Docs: Hims writes that a competitor\'s form covers "allergies, medication use, and household members\' pregnancy status (... pregnant individuals are advised against handling finasteride ...)" and that "Hims includes these questions". The risk is contact with finasteride by someone pregnant.',
     'engineRole': 'safety-screen', 'branches': False,
     'branchDetail': 'Unknown. Inferred: a handling warning or a note for the provider rather than a refusal; the serum\'s safety page says pregnant people should not handle it.',
     'shownWhen': NOT_SEEN, 'evidence': 'docs', 'source': 'https://www.hims.com/blog/hims-vs-happy-head'},
]
keep = [x for x in men['questions'] if x['id'] not in {t['id'] for t in new_topics}]
men['questions'] = keep + new_topics

# ---------------------------------------------------------------- rules
ALL_RX = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p9']
COMPOUNDED = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']
new_rules = [
    {'id': 'R7', 'flow': 'lp-prequiz', 'when': 'any one of the three landing-page answers is changed (lp-q1 Both → Stop hair loss or Regrow hair; lp-q2 Yes → No; lp-q3 Yes → Not sure yet)',
     'then': 'Nothing the visitor can see changes: the same next question, the same end pitch for the prescription spray, the same buttons to /c/hl. No stop, no warning, no product, no price. The served definition has no branch either, and the page says the answers are not a medical assessment and are not shared with a provider.',
     'effectType': 'marketing-only', 'affects': [], 'evidence': 'observed', 'proof': RUNS5 + '; quiz-definition.lp-prequiz.json', 'confidence': 'high'},
    {'id': 'R8', 'flow': 'lp-prequiz', 'when': 'a landing-page answer is clicked',
     'then': 'The browser sends one click event that names the question and the answer (for example "atf_q1-what-are-your-hair-goals_stop-hair-loss_secondary-cta"), with a device id, to Hims\' own event collector (api.forhims.com/dpe/producer/unauth) and to Amplitude. Nothing is saved in the browser for the consultation and the links to /c/hl carry no answer. So the answers are kept as marketing data only.',
     'effectType': 'marketing-only', 'affects': [], 'evidence': 'observed', 'proof': 'runs/s2-baseline-lp-prequiz/requests.jsonl and the same file in runs/exp-lp-01 to exp-lp-04', 'confidence': 'high'},
    {'id': 'R9', 'flow': 'lp-prequiz', 'when': 'lp-q3 = "Not sure yet" (not sure about prescription treatment)',
     'then': 'The visitor is still shown the prescription spray pitch ("Get the spray"); no non-prescription product is offered as an alternative.',
     'effectType': 'marketing-only', 'affects': ['p3', 'p4'], 'evidence': 'observed', 'proof': 'runs/exp-lp-04-q3-notsure vs runs/s2-baseline-lp-prequiz', 'confidence': 'high'},
    {'id': 'R10', 'flow': 'men', 'when': 'the visitor starts from any hair page: /hair-loss, a product page, /lp/hair-start-top-fin-fa, /lp/hair-start-preventmaint, /lp/hair-start-comparison-dlp or a vanity link such as hims.com/baes',
     'then': 'Every prescription button leads to the same consultation (/c/hl or /c/hl/goals). There is no product-specific entry and no link carries a product code, so the page a man starts from does not pre-select a product as far as the links show. Only the top-fin landing page has the pre-quiz.',
     'effectType': 'none', 'affects': [], 'evidence': 'code', 'proof': 'raw/pages/www_hims_com_lp_hair_start_preventmaint.txt, raw/pages/www_hims_com_baes.txt, raw/pages/www_hims_com_hair_start_top_fin_lp.txt (link lists); runs/landing', 'confidence': 'medium'},
    {'id': 'R11', 'flow': 'men', 'when': 'the consultation reaches the treatment step',
     'then': 'The site holds one product as "recommended" and a recommended dose, and lets the customer override both: product, strength, quantity, days of supply and packaging are stored as his selections. (Read from the empty state hims.com serves with /c/hl; the screen itself was not seen.)',
     'effectType': 'product-switched', 'affects': ALL_RX, 'evidence': 'code', 'proof': 'raw/props-c-hl.json: consultation.treatmentPreferences (recommendedBrand, overrideRecommendedDosage, originalRecommendedTreatment, selections)', 'confidence': 'medium'},
    {'id': 'R12', 'flow': 'men', 'when': 'a man with no exclusions reaches the recommendation (baseline man)',
     'then': 'The topical finasteride + minoxidil spray is probably the default recommendation. This rests only on a flag NAME: "himsHairTopFinRecco" is switched on for 100% of visitors in the page hims.com serves, and the landing-page pre-quiz pitches the same spray. The recommendation screen was not seen.',
     'effectType': 'product-added', 'affects': ['p3'], 'evidence': 'inferred', 'proof': 'raw/props-c-hl.json: experiments.rules.himsHairTopFinRecco (treatment = 100%); runs/s2-baseline-lp-prequiz', 'confidence': 'low'},
    {'id': 'R13', 'flow': 'men', 'when': 'the visitor states a prescription preference, and later reaches checkout',
     'then': 'Inferred from names only: the consultation stores a "prescriptionPreference" (flag on for all visitors), which most likely splits the provider route from the non-prescription products; and a non-prescription add-on step is shown before payment (flag "himsHairOTCAddOnV1" on, "himsHairHideOtcStep" off).',
     'effectType': 'product-added', 'affects': ['p10', 'p11', 'p13', 'p15'], 'evidence': 'inferred', 'proof': 'raw/props-c-hl.json: consultation.prescriptionPreference, additionalItems, otcChargedAmount; experiments.rules.hairLossPrescriptionPreference, himsHairOTCAddOnV1, himsHairHideOtcStep', 'confidence': 'low'},
    {'id': 'R14', 'flow': 'men', 'when': 'the intake form is submitted',
     'then': 'Nothing is prescribed by the software. A licensed provider reviews it: "Please allow a minimum of 48 hours after you complete your assessment for this review". The provider may message for more information, and the order waits on any "action item" (for example finishing the assessment or uploading another photo). "If prescribed" the treatment ships.',
     'effectType': 'flag-for-clinician', 'affects': ALL_RX, 'evidence': 'docs', 'proof': 'https://support.hims.com/hc/en-us/articles/360001339866-What-does-Outstanding-Medical-Visit-mean ; https://support.hims.com/hc/en-us/articles/13660161613083-What-is-the-Action-Item-in-my-account ; https://www.hims.com/lp/hair-start-comparison-dlp ("Hims makes it simple")', 'confidence': 'high'},
    {'id': 'R15', 'flow': 'men', 'when': 'the provider needs to see the hair, or needs to confirm identity',
     'then': '"In most cases, Hims will also have you submit photos of your hair"; "If further verification is required, they may ask for additional documentation, like your photo ID." The condition that triggers either request is not published.',
     'effectType': 'extra-questions', 'affects': [], 'evidence': 'docs', 'proof': 'https://www.hims.com/blog/hims-vs-keeps ; https://www.hims.com/blog/hims-vs-happy-head', 'confidence': 'medium'},
    {'id': 'R16', 'flow': 'men', 'when': 'the customer picks a longer plan',
     'then': 'The monthly price falls. Published examples: spray or serum "$35 a month (when you opt for a five-month plan) or $50 for a three-month plan"; headline "$29 per month" needs "a 10-month plan, paid upfront in full"; finasteride tablets $22 a month on a three-month supply; a reviewer paid $150 for three months of the spray. Plans named in public: 3, 5, 6, 10 and 12 months. The full plan table is shown only inside the consultation.',
     'effectType': 'none', 'affects': ALL_RX, 'evidence': 'docs', 'proof': 'https://www.hims.com/blog/hims-vs-keeps ; https://www.hims.com/blog/hims-vs-rogaine ; https://www.hims.com/blog/finasteride-costs-pricing-guide ; https://www.hims.com/lp/hair-start-preventmaint (footnote) ; https://fortune.com/article/hims-hair-loss-review/', 'confidence': 'medium'},
    {'id': 'R17', 'flow': 'men', 'when': 'hair loss is sudden or in patches with no clear pattern',
     'then': 'Hims\' own FAQ says such men should "seek medical attention to determine the cause". Whether the consultation stops, warns or simply leaves it to the provider was not seen (on the UK sister site the anonymous quiz does nothing with such answers).',
     'effectType': 'flag-for-clinician', 'affects': ALL_RX, 'evidence': 'docs', 'proof': 'https://www.hims.com/lp/hair-start-comparison-dlp (FAQ "How do I know what type of hair loss I have?"); raw/pages/www_hims_com_baes.txt', 'confidence': 'low'},
    {'id': 'R18', 'flow': 'men', 'when': 'someone in the household is pregnant',
     'then': 'Hims says its intake asks about this because pregnant people "are advised against handling finasteride". Expected result: a handling warning or a note for the provider. The software\'s action was not seen.',
     'effectType': 'flag-for-clinician', 'affects': ['p1', 'p2', 'p3', 'p4', 'p5', 'p7', 'p9'], 'evidence': 'docs', 'proof': 'https://www.hims.com/blog/hims-vs-happy-head ; https://www.hims.com/important-safety/rx-hair-loss-serum', 'confidence': 'low'},
    {'id': 'R19', 'flow': 'men', 'when': 'a hair customer wants a different dose or product after starting',
     'then': 'He has to message his provider: "any potential adjustment to your prescription will be at the discretion of your medical provider". The self-service "Adjust Rx" request in the account covers weight-loss and sexual-health subscriptions only, not hair.',
     'effectType': 'flag-for-clinician', 'affects': ALL_RX, 'evidence': 'docs', 'proof': 'https://support.hims.com/hc/en-us/articles/32102621754651-Can-I-adjust-my-medications ; help-centre search result for "Can I change the dosage on my medication?" (raw/help/support_hims_com_hc_en_us_search_query_not_approved_prescription.txt)', 'confidence': 'medium'},
    {'id': 'R20', 'flow': 'men', 'when': 'the shipping state is Massachusetts or Washington',
     'then': 'Compounded products are probably handled differently (restricted, replaced or flagged). This rests only on two field names in the page state, "maCompoundDeprecation" and "waCompoundDeprecation"; no public document explains them.',
     'effectType': 'product-removed', 'affects': COMPOUNDED, 'evidence': 'inferred', 'proof': 'raw/props-c-hl.json: consultation.treatmentPreferences.maCompoundDeprecation, waCompoundDeprecation', 'confidence': 'low'},
]
ids = {r['id'] for r in new_rules}
d['rules'] = [r for r in d['rules'] if r['id'] not in ids] + new_rules
order = {f'R{i}': i for i in range(1, 60)}
d['rules'].sort(key=lambda r: order.get(r['id'], 99))

# ---------------------------------------------------------------- experiments
ex = json.load(open('scripts/stage2_experiments.json', encoding='utf8'))
ex += [
    {'id': 's2-diag-hl-retry', 'flow': 'men', 'changed': 'Nothing (second and last re-test of https://www.hims.com/c/hl/goals, 23 Nov 2026 22:30 UTC, with every request logged)',
     'result': 'Still blocked: 37 of the site\'s own script files, including hims.us.modern.domains-consultation-hair-loss.*.js, were answered with HTTP 403; the page stayed blank. No question could be answered, so no one-change experiment exists for the real consultation.',
     'run': 'runs/s2-diag-hl-retry'},
    {'id': 's2-entry-preventmaint', 'flow': 'men', 'changed': 'Entry page: /lp/hair-start-top-fin-fa → /lp/hair-start-preventmaint (page document read, no clicks)',
     'result': 'No pre-quiz on this page. Same four product cards (chew, pill, spray, serum: "Less than $1 a day" with the 10-month upfront footnote). Every button links to /c/hl or /c/hl/goals; no product code in any link.',
     'run': 'raw/pages/www_hims_com_lp_hair_start_preventmaint.txt'},
    {'id': 's2-entry-vanity-baes', 'flow': 'men', 'changed': 'Entry page: /lp/hair-start-top-fin-fa → vanity link hims.com/baes (redirects to /lp/hair-start-comparison-dlp with podcast tracking tags; page document read, no clicks)',
     'result': 'No pre-quiz. "Hims makes it simple" steps: free consultation ("Answer a few questions about your hair and health"), a provider "reviews your info and recommends the right treatment for you", free delivery "if prescribed", ongoing support. Every button links to /c/hl or /c/hl/goals.',
     'run': 'raw/pages/www_hims_com_baes.txt'},
    {'id': 's2-entry-top-fin-lp', 'flow': 'lp-prequiz', 'changed': 'Entry page: /lp/hair-start-top-fin-fa → /hair-start-top-fin-lp (page document read, no clicks)',
     'result': 'Redirects to /lp/hair-start-top-fin-fa with tracking tags. Same three pre-quiz questions in the page data (q1_what-are-your-hair-goals, q2_are-you-looking-for-a, q3_are-you-interested-in-prescription-strength).',
     'run': 'raw/pages/www_hims_com_hair_start_top_fin_lp.txt'},
]
ids = {e['id'] for e in ex}
d['experiments'] = [e for e in d.get('experiments', []) if e['id'] not in ids] + ex

# ---------------------------------------------------------------- recommendations
d['recommendations'] = [
    {'profile': 'Any visitor who finishes the landing-page pre-quiz (baseline: goals Both, simple solution Yes, prescription Yes; and each one-change variant)',
     'offered': ['p3', 'p4'], 'default': 'p3',
     'note': 'A sales pitch, not a recommendation: "Quick-drying, once-daily spray", "4-in-1 formula available with ketoconazole and biotin", buttons "Get the spray" and "See if treatment is right for me" → /c/hl. Identical for all five answer sets tested. No strength, plan or price is shown at this point.',
     'evidence': 'observed'},
    {'profile': 'Visitor who answers "Not sure yet" to prescription treatment in the pre-quiz',
     'offered': ['p3', 'p4'], 'default': 'p3',
     'note': 'Same prescription spray pitch as everyone else; no non-prescription option is put forward (runs/exp-lp-04-q3-notsure).',
     'evidence': 'observed'},
    {'profile': 'Baseline man in the real consultation: 32, hairline and crown, gradual, family history, no medical issues (NOT SEEN: consultation blocked)',
     'offered': ALL_RX, 'default': 'p3',
     'note': 'Not observed. Docs: a provider "recommends the right treatment for you" from the prescription range (pill, two chews, two sprays, serum, finasteride tablets, kit). Code: the site pre-selects one recommended product and dose that he may change. The default shown here (the spray) is inferred from a flag name only (himsHairTopFinRecco on for all visitors) and is low confidence. Strength: the spray exists in one published strength (finasteride 0.3% + minoxidil 6%). Plan and price: not seen; published anchors are $29 a month on a 10-month plan paid upfront, $35 on 5 months, $50 on 3 months.',
     'evidence': 'inferred'},
    {'profile': 'Man who wants no prescription, or only wants to buy a product',
     'offered': ['p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19'], 'default': 'p10',
     'note': 'Docs: these are sold by add to cart with no consultation (minoxidil foam and solution, non-prescription kit, shampoos, conditioner, gummies). No default is stated by Hims; foam is listed first here only for convenience.',
     'evidence': 'docs'},
    {'profile': 'Man with a published exclusion for oral minoxidil + finasteride (for example certain heart disease, chronic kidney disease stage 3 to 5, blood thinners, liver disease)',
     'offered': ['p3', 'p4', 'p5', 'p7'], 'default': 'p3',
     'note': 'Inferred from the published "who should not take" list for the combination pill: the pill (and probably the chews, which also contain oral minoxidil) would be ruled out, leaving topical products or plain finasteride at the provider\'s discretion. Chronic liver disease or a history of breast or prostate cancer rules out the topical finasteride + minoxidil products as well. How the software shows this was not seen.',
     'evidence': 'inferred'},
    {'profile': 'Man already taking oral finasteride or dutasteride',
     'offered': ['p6', 'p10', 'p11'], 'default': 'p6',
     'note': 'Inferred from the safety pages: topical finasteride + minoxidil and the combination pill "cannot be used at the same time" as oral finasteride or another 5-alpha reductase inhibitor, which leaves minoxidil-only options. Not seen.',
     'evidence': 'inferred'},
    {'profile': 'Anyone under 18',
     'offered': [], 'default': '',
     'note': 'Docs: every prescription hair product excludes people younger than 18. The stop screen was not seen.',
     'evidence': 'docs'},
    {'profile': 'Baseline woman: 38, widening parting, not pregnant, no conditions',
     'offered': ['w1', 'w2', 'w3', 'w4'], 'default': '',
     'note': 'Hims US treats men only and sends women to Hers (forhers.com), which showed a security check on every page, so nothing was served or tested. The four Hers products are stubs from search snippets; which one Hers recommends is unknown here (see the separate hers-us report).',
     'evidence': 'docs'},
]

# ---------------------------------------------------------------- products: recommendedWhen
RW = {
 'p1': 'Not seen (consultation blocked). Docs: prescribed through the /c/hl consultation when the provider judges a once-daily pill with oral finasteride and oral minoxidil suitable. Published exclusions: under 18; not assigned male at birth, pregnant or able to become pregnant; certain heart disease; chronic kidney disease stage 3 to 5; liver disease; pheochromocytoma; blood thinners, antiplatelet drugs or antifungals; bleeding disorder; prostate or male breast cancer in the last 5 years; recent chemotherapy; high-dose zinc; grape or wine allergy; already using a finasteride or minoxidil product.',
 'p2': 'Not seen. Docs: the site tags it "most popular" among the oral options; prescribed through /c/hl for men who prefer a chew. Inferred: same exclusions as the pill, because it also contains oral finasteride and oral minoxidil.',
 'p3': 'Observed: the only product the landing-page pre-quiz pitches, whatever the three answers ("Get the spray"). In the real consultation: not seen; probably the default recommendation for a man with no exclusions (inferred from the flag name himsHairTopFinRecco, on for all visitors; low confidence). Docs: not with oral finasteride or dutasteride, chronic liver disease, a history of breast or prostate cancer, under 18, or for women.',
 'p4': 'Observed: named in the pre-quiz end pitch as the "4-in-1 formula available with ketoconazole and biotin". In the real consultation: not seen; inferred to be the step-up version of the spray (higher minoxidil, plus ketoconazole and biotin) offered next to it at a higher price. Same published exclusions as the spray.',
 'p5': 'Not seen. Docs: the same two actives as the spray in a dropper serum ("Direct application"); Hims says formats exist "to fit your routine" and asks about styling habits, so it is probably offered to men who prefer a serum to a spray (inferred). Same published exclusions as the spray.',
 'p6': 'Not seen. Inferred: the oral option without finasteride, for men who cannot or do not want to take finasteride (for example worried about sexual side effects, or already on a 5-alpha reductase inhibitor) but can take oral minoxidil. Oral minoxidil cautions (heart, kidney, blood pressure) would apply.',
 'p7': 'Not seen. Docs: the FDA-approved generic tablet, "starts at $22 a month"; prescribed after the consultation "if a provider decides you\'re a good match" (Hims: with male pattern hair loss "you most likely are"). Not for women or anyone under 18; tell the provider about prostate or liver problems.',
 'p8': 'Not offered at present: the product page showed "Out of stock" on 23 Nov 2026. When sold, a four-product bundle (finasteride tablets, minoxidil solution, shampoo, gummies) for men who want everything together (docs).',
 'p9': 'Not seen. Docs: Hims calls its finasteride tablet + minoxidil solution bundle the "Hair Loss Duo" (from $32 a month); bought through the same consultation. Inferred: for men who want the two licensed generics rather than a compounded product.',
 'p10': 'No consultation: add to cart. Docs: Hims says minoxidil suits "new hair loss or ... mild to moderate balding". Inferred from flag names: may also be shown as an add-on at the consultation checkout.',
 'p11': 'No consultation: add to cart. Docs: the page says it "works best to regrow hair in the vertex or crown area". Part of the Duo kit and the Power Pack. Inferred: may also be shown as an add-on at the consultation checkout.',
 'p12': 'No consultation: add to cart. For men who want to start without a prescription (docs: sold as a monthly kit).',
 'p13': 'No consultation: add to cart. Inferred from flag names (himsHairOTCAddOnV1, himsHairFreeShampoo): also pushed as an add-on at the consultation checkout.',
 'p14': 'No consultation: add to cart. Cosmetic add-on; no rule.',
 'p15': 'No consultation: add to cart. The page itself says biotin gummies "are not a hair loss treatment". Cosmetic or supplement add-on; no rule.',
 'p16': 'No consultation: add to cart. For dandruff (pyrithione zinc 1%); not part of the hair-loss consultation as far as public pages show.',
 'p17': 'No consultation: add to cart. Cosmetic; no rule.',
 'p18': 'No consultation: add to cart. Cosmetic; no rule.',
 'p19': 'No consultation: add to cart. Cosmetic bundle; no rule.',
 'p20': 'Unknown. Known only from a help-centre drug sheet. Inferred: offered to men treated for erectile dysfunction and hair loss together (Hims writes of "2-in-1 and 3-in-1 compounded medications" for men "interested in treating multiple health conditions at once" if "a provider determines that you are eligible"; the consultation state has a hair bundling flag). No hair product page sells it.',
 'p21': 'Unknown. Known only from a help-centre drug sheet shared by Hims and Hers; no Hims hair page sells plain oral minoxidil tablets. Possibly prescribed at a provider\'s discretion (inferred).',
 'w1': 'Unknown here (Hers site not reachable from this machine). See the separate hers-us report.',
 'w2': 'Unknown here (Hers site not reachable from this machine). See the separate hers-us report.',
 'w3': 'Unknown here (Hers site not reachable from this machine). See the separate hers-us report.',
 'w4': 'Unknown here (Hers site not reachable from this machine). See the separate hers-us report.',
}
for p in d['products']:
    if p['id'] in RW:
        p['recommendedWhen'] = RW[p['id']]

# ---------------------------------------------------------------- summary sections
d['engineSummary'] = (
    'What could be tested: only the three-question quiz on one advertising landing page. Stage 2 clicked every option, one change at a '
    'time, and logged every request. It is not an engine at all: every answer leads to the same next question and the same pitch for the '
    'prescription spray, and the only thing an answer does is send a tracking event (question, answer, device id) to Hims and to its '
    'analytics supplier. Even "Not sure yet" about prescription treatment ends on "Get the spray". '
    'What could not be tested: the real consultation at /c/hl, which stayed blocked. From Hims\' own public pages and the page state it '
    'serves, the engine most likely works in three layers. First, a hair quiz (goals, where, how long, family history, stress, styling) '
    'that personalises and sells; nothing public says any of these answers changes eligibility. Second, a medical intake form built as a '
    'tree (root questions plus follow-ups triggered by answers) covering sex assigned at birth, age, state, conditions, medicines, '
    'allergies and pregnancy in the household, usually with photos. Third, a treatment step where the site pre-selects one recommended '
    'product and dose (probably the topical finasteride + minoxidil spray) and lets the customer change product, strength, quantity and '
    'plan length before paying; the monthly price falls as the plan gets longer. The software does not prescribe: a licensed provider '
    'reviews the form within about 48 hours, by message or by video where the state requires it, and can ask for more information, '
    'photos or ID. The medical rules are published only as "who should not use" lists on each product\'s safety page; how the software '
    'turns an answer into a removed product or a stop screen was not seen.')
d['strengths'] = [
    'Very wide format range for the same two actives (pill, two chews, two sprays, serum, plain finasteride tablets, kits, foam, solution), so there is nearly always a format to offer.',
    'Low headline price ("less than $1 a day", from $29 a month) tied to a 10-month plan paid upfront, which also locks the customer in.',
    'A recommended product and dose are pre-selected, but the customer can change product, strength and plan (page state); choice without a blank page.',
    'Free consultation, free shipping on prescriptions and unlimited provider messaging; providers in all 50 states with video visits where the law requires them.',
    'Over-the-counter products can be bought with no consultation, and prescriptions can be sent to a local pharmacy on request.',
    'Published safety information for each prescription product, with clear exclusion lists, and "Why We Ask" notes on intake questions.',
    'Heavy measurement: about 1,000 named experiments in the page, around 200 of them for hair, and every landing-page click is logged.',
]
d['weaknesses'] = [
    'The landing-page quiz is theatre: no answer changes the outcome, and a visitor who is "Not sure yet" about prescriptions is still pushed to the prescription spray. Yet the answers are logged against a device id.',
    'Headline prices differ between pages on the same day ($35 on /hair-loss, $29 on product and landing pages), and the low price needs a 10-month upfront payment. Plan prices are shown only inside the consultation.',
    'Most prescription products are compounded and not FDA-approved; the vitamin amounts in the chews are not published.',
    'Nothing public says which answers lead to which product: the customer cannot see why a product is recommended.',
    'Sudden or patchy hair loss is handled by a line in an FAQ ("seek medical attention"), not by anything visible before sign-up.',
    'After starting, hair customers cannot request a dose or product change through the self-service tool (weight-loss and sexual-health only); they must message the provider.',
    'Provider review can take 48 hours or more, and an order can sit on an unseen "action item".',
    'Women are sent to a separate site; the Hair Power Pack was out of stock.',
    'The site is hard to open from some networks: the consultation\'s own script files were refused by the security layer on every try.',
]
d['opportunities'] = [
    'Make the quiz real and show it: tell the visitor which answer led to which product and strength, and what would change it.',
    'Publish one plain price table for every plan length before the quiz, with no upfront-payment footnote.',
    'Offer a true fork for people unsure about prescriptions: a non-prescription path (minoxidil 5%, ketoconazole shampoo) with a clear step-up later.',
    'Screen warning signs in the open before sign-up (sudden, patchy, scarring, scalp symptoms) and route them to in-person care; Hims does this only in an FAQ.',
    'Ask and act on things Hims does not appear to publish: finasteride side-effect worries and a low-dose or topical-only route, partner pregnancy plans, blood pressure for oral minoxidil.',
    'Offer licensed products and strength choice (for example dutasteride, or lower and higher topical strengths) that Hims does not sell; Hims has one topical strength pair plus the 4-in-1.',
    'Give short commitments (monthly, cancel any time) against Hims\' 3 to 12 month plans.',
    'Let existing customers change dose or product themselves with a quick safety check, which Hims does not allow for hair.',
    'Take data only when needed: Hims logs marketing-quiz answers against a device id although it tells visitors the answers are not a medical assessment.',
]
d['limitations'] = [
    'The men\'s consultation was not seen at all, in stage 1 or stage 2 (three attempts in stage 2 terms: one replay and one logged re-test, both blocked). No real question wording, option, branch, stop screen, recommendation or plan price from it is in this file.',
    'No one-change experiment exists for the real questionnaire. The only live experiments are on the three-question landing-page pre-quiz (5 replays, every non-baseline option). Nothing from the protocol\'s priority list (sex, age, pregnancy, pattern, medical conditions, medicines, preference) could be tested.',
    'The 19 men\'s entries are topics from Hims\' own articles and from field names, not screens. Their order, wording, options and "stage" (before or after the account wall) are guesses and are marked as such.',
    'Rules R1 to R6 and R14 to R19 are from published documents. They show what the provider must rule out and how review works, not what the software does with an answer. Rules R12, R13 and R20 rest on flag or field NAMES only and are low confidence.',
    'The default recommendation (the spray) is inferred, not seen.',
    'Plan-length prices are known only from footnotes, three Hims blog posts and one press review; two Hims blog posts contradict each other on the Duo kit. Hims runs price tests.',
    'The Hers (women) site was not seen at all; the four Hers products are stubs. See the separate hers-us report.',
    'Cached copies of the consultation script exist at the Internet Archive (per its availability service) but could not be opened from this machine; they would probably give the real hair-quiz questions.',
    'Web search stopped after one query in stage 2 (shared budget used up), so third-party walkthroughs, forum posts and videos were not searched again. One review that was fetched directly (Healthline) turned out to describe the erectile-dysfunction sign-up, not hair.',
    'The pre-quiz experiments used one landing page and a desktop browser; phone layout was not tested.',
]

# ---------------------------------------------------------------- sources
add_sources = [
    ('Landing page without a pre-quiz ("prevent and maintain")', 'https://www.hims.com/lp/hair-start-preventmaint'),
    ('Hims blog: Hims vs. Rogaine (intake form topics, plans, prices)', 'https://www.hims.com/blog/hims-vs-rogaine'),
    ('Hims blog: Finasteride cost guide ($22 a month on a three-month supply)', 'https://www.hims.com/blog/finasteride-costs-pricing-guide'),
    ('Hims blog: How to get finasteride (questions a provider might ask)', 'https://www.hims.com/blog/is-finasteride-over-the-counter'),
    ('Hims blog: Hims vs. Roman (plan lengths, multi-condition compounded products)', 'https://www.hims.com/blog/hims-vs-roman'),
    ('Help centre: What does "Outstanding Medical Visit" mean? (48-hour review)', 'https://support.hims.com/hc/en-us/articles/360001339866-What-does-Outstanding-Medical-Visit-mean'),
    ('Help centre: What is the "Action Item" in my account?', 'https://support.hims.com/hc/en-us/articles/13660161613083-What-is-the-Action-Item-in-my-account'),
    ('Help centre: Can I adjust my medications? (self-service covers weight loss and sexual health only)', 'https://support.hims.com/hc/en-us/articles/32102621754651-Can-I-adjust-my-medications'),
    ('Internet Archive availability check for the consultation page (copies exist; not openable from this machine)', 'https://archive.org/wayback/available?url=hims.com/c/hl'),
]
have = {s['url'] for s in d['sources']}
for t, u in add_sources:
    if u not in have:
        d['sources'].append({'title': t, 'url': u})
for s in d['sources']:
    if s['url'] == 'https://www.healthline.com/health/hims-hair-review':
        s['title'] = 'Healthline: Hims review (fetched in stage 2: its step-by-step sign-up describes erectile dysfunction, not hair; updated 30 Oct 2026)'

json.dump(d, open(P, 'w', encoding='utf8'), indent=1, ensure_ascii=False)
print('patched:', len(d['products']), 'products,', sum(len(f['questions']) for f in d['flows']), 'questions,', len(d['rules']), 'rules,', len(d['experiments']), 'experiments,', len(d['recommendations']), 'recommendations')
