# -*- coding: utf-8 -*-
"""Stage 3 (VERIFY): the reviewer's hand-written text, applied to company.json by scripts/stage3_verify.py.

Everything here was checked by the stage 3 reviewer on 23 November 2026:
  - live replays in runs/verify-* (own run folders, fresh browser each time),
  - the served code in raw/app and raw/www-js re-read by hand,
  - leaflet and help-centre lines re-read in raw/,
  - public product pages re-opened in runs/verify-pages.
Edit here, then run:  python3 -I scripts/stage3_verify.py   (from companies/hims-uk)
"""

VB = "runs/verify-00-baseline-full"

# --------------------------------------------------------------------------------------------------
# 1. Proof pointers for every question labelled "observed"
# --------------------------------------------------------------------------------------------------
_SCREEN = {  # question id -> screen file in the baseline runs
    'men-q1': '00', 'men-q2': '01', 'men-q3': '02', 'men-q4': '03', 'men-q5': '04', 'men-q6': '06', 'men-q7': '07',
    'men-i1': '08', 'men-i2': '09', 'men-q8': '10', 'men-q9': '11', 'men-i3': '12', 'men-i4': '13', 'men-q10': '14',
    'men-q11': '15', 'men-i5': '16', 'men-i6': '17', 'men-i7': '18', 'men-i8': '19', 'men-i9': '20', 'men-i10': '21',
    'men-a1': '22',
}
QUESTION_PROOF = {
    q: "Seen live: runs/exp-00-baseline-full/%s.txt (stage 2) and runs/verify-00-baseline-full/%s.txt (reviewer, stage 3): identical wording." % (n, n)
    for q, n in _SCREEN.items()
}
QUESTION_PROOF['gen-q1'] = "Seen live: runs/misc1/02.txt (stage 1) and runs/verify-pages/hims-chooser.txt (reviewer, stage 3)."
QUESTION_PROOF['women-a1'] = ("Seen live: runs/baseline-women (stage 1), runs/exp-35-hers-replay (stage 2), runs/verify-baseline-women and "
                              "runs/verify-17-hers-anon-route (reviewer, stage 3): the same name screen every time.")

# --------------------------------------------------------------------------------------------------
# 2. Rules: what the reviewer re-tested, and corrections
# --------------------------------------------------------------------------------------------------
_LEAFLET_NOTE = ("This is what the product's own leaflet says. What the consultation does with such an answer was not seen: "
                 "that the product is greyed out for him is the investigator's inference.")

RULE_CHANGES = {
    'R1': {
        'verified': "confirmed live. The reviewer repeated six of the 31 one-change runs from fresh browsers (hair type 'I don’t have hair', onset 'In the past few months', location 'All over', intent 'None of the above', amount 'A lot', styling 'Protective styles') and compared them with a fresh baseline using a separately written comparison script: same 21 screens, same server-named next step after every answer, same wall. The reviewer also checked every one of the 31 stage 2 run folders: each exists, ends at the email wall and posted exactly the answer it claims; all 42 options were posted at least once.",
        'proof_add': "Reviewer replays (stage 3): runs/verify-01-no-hair, runs/verify-02-past-few-months, runs/verify-03-all-over, runs/verify-04-none-of-above, runs/verify-05-a-lot, runs/verify-06-protective-styles against runs/verify-00-baseline-full.",
    },
    'R20': {
        'verified': "confirmed live in the reviewer's runs: the 'Noticed:' line (runs/verify-02-past-few-months), the 'Hair changes' line (runs/verify-03-all-over, runs/verify-11-back-change), the styling line (runs/verify-06-protective-styles) and the family-history and stress lines (runs/verify-10-contradictory) changed; nothing else did.",
        'proof_add': "Reviewer (stage 3): summary screen 17.txt in runs/verify-02-past-few-months, runs/verify-03-all-over, runs/verify-06-protective-styles, runs/verify-10-contradictory.",
    },
    'R21': {
        'verified': "confirmed live in the reviewer's runs for hair type, intent and amount lost (runs/verify-01-no-hair, runs/verify-04-none-of-above, runs/verify-05-a-lot): every screen identical to the baseline.",
        'proof_add': "Reviewer (stage 3): runs/verify-01-no-hair, runs/verify-04-none-of-above, runs/verify-05-a-lot.",
    },
    'R23': {
        'verified': "confirmed live and extended by the reviewer (runs/verify-07-all-above-clears, runs/verify-13-multi-edge, runs/verify-14-multi-all-four).",
        'then_add': "Reviewer's extra checks (stage 3): unticking the only ticked box greys Continue out again; ticking an ordinary box after 'All of the above' clears 'All of the above'; all four ordinary boxes ticked by hand are sent as a list of four values, not as ALL, and the 'All of the above' box stays unticked. The next screen and everything after it are the same in each case.",
        'proof_add': "Reviewer (stage 3): runs/verify-07-all-above-clears (ALL sent alone after an earlier tick), runs/verify-13-multi-edge (screens 05 to 09; SCALP_COVERAGE + STOP_LOSS sent), runs/verify-14-multi-all-four (four values sent).",
    },
    'R24': {
        'verified': "confirmed live: runs/verify-00-baseline-full holds 21 'submit step' posts and one 'submit flow' post; the last reply is a record id and nothing else. The same in every reviewer run that reached the wall.",
        'proof_add': "Reviewer (stage 3): runs/verify-00-baseline-full/network.jsonl and net/.",
    },
    'R25': {
        'verified': "confirmed live (runs/verify-08-skip-quiz): the sign-up address opened in a fresh browser shows the same email screen.",
        'proof_add': "Reviewer (stage 3): runs/verify-08-skip-quiz.",
    },
    'R28': {
        'verified': "code re-read and confirmed (the claim mutation reads the two guest-token keys, both present in runs/verify-00-baseline-full/storage.json). Not seen live: it only runs after sign-up.",
    },
    'R29': {
        'then': "He gets the same quiz version as every other visitor tested. The site asks its feature-flag service for settings under one shared visitor name ('anonymous'), so those settings cannot differ between anonymous visitors at any one moment. No sign of a per-visitor test was found: the same quiz version came back in every fresh browser, and the settings were the same for everyone (one of the 949 changed for all visitors during the evening of the check). A test run some other way, for example by the old site before the redirect, cannot be ruled out; none was seen.",
        'verified': "confirmed live in the reviewer's runs: the flag request carries the visitor name 'anonymous' (runs/verify-03-all-over/network.jsonl), and one quiz version was served in every run. Across 22 more fresh Hims browsers 948 of the 949 settings were identical. The one that differed changed for everyone at about 22:00 UTC, part-way through the reviewer's runs (hair, erectile and premature consultations gained the type 'reactivation review consultation'): a site-wide change over time, not a per-visitor test. It shows the platform was still being changed on the day. The wording 'cannot show different versions' was softened: it is true of this flag service, not proof that no other test exists.",
        'proof_add': "Reviewer (stage 3): the saved flag replies in runs/verify-00-baseline-full to runs/verify-21-safety-modal (net/ folder of each run; quiz version a9a88e4a-… in all; the setting cfg_supported_triage_event_types differs before and after about 22:00 UTC).",
    },
    'R2': {
        'verified': "code re-read and confirmed: raw/app/index.js uses this message for the brands juniper-uk, hers-uk and hims-uk. Not seen live (the date-of-birth step is behind the wall).",
    },
    'R3': {
        'verified': "help-centre wording re-read in raw/help/hims (saved page of the article): 'offered to men aged 18 to 80 (up to and including age 75 for new customers)'. A company statement; the screen that enforces it was not seen.",
    },
    'R4': {
        'verified': "leaflet lines re-read and correct (4-in-1 spray, serum and both chews: 'younger than 18 years or older than 65 years'; minoxidil serum 'most men aged 18-65'; Regaine 'under the age of 18 or over the age of 65'; 2-in-1 spray only 'younger than 18'). The engine's action is still inferred: no run or served code shows it.",
    },
    'R5': {
        'verified': "help-centre wording re-read in raw/help/hims: 'they are only available for male patients'. A company statement. Note that the anonymous quiz never asks sex.",
    },
    'R6': {
        'then_add': "Detail found on re-reading: a product whose only denials are of the 'missing' kind is not greyed out (the app treats its eligibility as unknown); the greying-out is only applied once every questionnaire has been scored. The options page opens with: 'Based on the medical information you provided, you may not be suitable for some treatments. If you believe this assessment is inaccurate, kindly review your responses to the medical questionnaire.'",
        'verified': "code re-read and confirmed (raw/app/chunks/use-hims-uk-hair-purchase-options-RTx4GHla.js, hims-uk-treatment-options-CgqlFS7X.js, gb-BqsLMX4z.js). Not seen live.",
    },
    'R7': {
        'verified': "code re-read and confirmed (triage-complete-BpNWh0fs.js sends any 'isNotEligible' result to the rejected route; rejected-screen-COWSDWyl.js has the quoted text, one 'Back home' button and a contact link). Not seen live.",
    },
    'R30': {
        'verified': "code re-read and confirmed: hero = product holding the server's recommendedPreset, else the one holding defaultPreset, else the first in the list. Not seen live.",
    },
    'R31': {
        'then_add': "Correction on re-reading: with no product chosen, a patient who has finished every questionnaire but still has an unmet 'gate' (for example GP details) is sent to that gate first; otherwise he gets the recommendation page.",
        'verified': "code re-read (skip-cp-next-step-DLh4EqTF.js): confirmed, with the correction added above. Not seen live, and whether Hims UK hair uses this 'pay after all questionnaires' set-up is still unknown.",
    },
    'R32': {
        'verified': "code re-read and confirmed in all ten product files (raw/app/chunks/fixture-*.js): the chips are constants and every chip has matchesPreference: false. 'No served code reads that field' holds for the 126 files that were downloaded; the other files were not read. Not seen live.",
    },
    'R33': {
        'verified': "code re-read and confirmed (treatment-consent-Cks2UHMm.js: the hair wording with 'plan to conceive in the next 3 months' and 'may be compounded and prescribed off-label'). Not seen live.",
    },
    'R16': {
        'verified': "code re-read and confirmed (async-consult-confirmed-L1iBZB3Q.js: 'You'll be notified by email and your order will be refunded immediately'). Not seen live.",
    },
    'R8': {
        'then_add': "The old code also shows a second kind of mark on answer options, 'rejectsAll'.",
        'verified': "code re-read and confirmed (hims.modern.2392…js collects 'excludesTags' from the chosen options; the old consultation component also reads them). This is the old platform: the old question set is no longer served and nothing shows the new platform uses the same tags.",
    },
    'R9': {
        'confidence': 'low',
        'then_add': _LEAFLET_NOTE,
        'verified': "leaflet lines re-read and correct for all four products (raw/hair-products-contentful.txt). Confidence lowered from medium to low because the engine's action was never seen.",
    },
    'R10': {
        'confidence': 'low',
        'then_add': _LEAFLET_NOTE,
        'verified': "leaflet lines re-read and correct for both chews ('already taking Minoxidil for hypertension or any other condition', 'have adrenal gland tumour'). Confidence lowered from medium to low because the engine's action was never seen.",
    },
    'R11': {
        'evidence': 'inferred',
        'verified': "leaflet and returning-customer wording re-read and correct, but the rule itself (a clinician flag or the loss of minoxidil products) is a prediction, so the label was changed from 'docs' to 'inferred'.",
    },
    'R12': {
        'evidence': 'inferred', 'confidence': 'low',
        'then': "Hims says its treatments 'are prescribed for male pattern hair loss (androgenetic alopecia) and are not effective for other causes', and: 'If your hair loss is sudden, patchy, or accompanied by scalp pain, redness or itching, please see your GP.' Leaflets exclude 'hair loss caused by drug treatment, or hair loss that is sudden and unexpected' and 'total baldness'. So a stop or rejection after sign-up is likely for these men (inferred). It was not seen, and the anonymous quiz does not react to 'In the past few months' or 'All over' (observed, rule R22).",
        'verified': "help-centre and leaflet wording re-read and correct. The help page gives advice ('please see your GP'); it does not say the consultation stops these men. Label changed from 'docs' to 'inferred' and confidence from medium to low.",
    },
    'R13': {
        'then_add': _LEAFLET_NOTE,
        'verified': "leaflet lines re-read and correct ('have a shaved scalp' in the 4-in-1 spray, serum and Regaine leaflets). Engine action not seen.",
    },
    'R14': {
        'confidence': 'low',
        'then_add': _LEAFLET_NOTE,
        'verified': "leaflet lines re-read and correct ('have chronic liver disease', 'have a history of breast cancer', 'have a history of prostate cancer'). Confidence lowered from medium to low because the engine's action was never seen.",
    },
    'R15': {
        'evidence': 'inferred',
        'verified': "product text, returning-customer check and consent wording re-read and correct, but the rule itself (finasteride products removed or flagged) is a prediction, so the label was changed from 'docs' to 'inferred'.",
    },
    'R34': {
        'then_add': _LEAFLET_NOTE,
        'verified': "Regaine leaflet line re-read and correct. Engine action not seen.",
    },
    'R35': {
        'then_add': _LEAFLET_NOTE,
        'verified': "leaflet 'do not use' lines re-read and correct. Engine action not seen. The one allergy question key visible in code (hairlossAllergiesDetailed) shows an allergy question exists; its wording and effect are unknown.",
    },
    'R36': {
        'verified': "product tags re-read and correct. Still inferred: no lactose question was seen on either platform.",
    },
    'R37': {
        'evidence': 'inferred',
        'verified': "leaflet lines re-read and correct, but the rule itself (a flag or a move to tablets) is a prediction, so the label was changed from 'docs' to 'inferred'.",
    },
    'R17': {
        'confidence': 'low',
        'then': "Hers says: 'No, hair treatments should not be used during pregnancy or breastfeeding' (FAQ on the hair page), and tells existing patients who are 'pregnant, breastfeeding, or planning on trying for a baby in the next month' to stop and talk to their clinician (help centre). So a refusal for a new patient who gives one of these answers is very likely (inferred). The question and the engine's action were not seen.",
        'verified': "both quotes re-read (raw/hers/hair.txt and the saved help page). They are company statements about use, not a description of what the questionnaire does; confidence lowered from medium to low for the engine action.",
    },
    'R18': {
        'then_add': "Detail found on re-reading: the recommended treatment is the eligible one the server names; if it names none, the server's default; if none, the first eligible one. If no treatment is eligible the list is marked 'empty' (the screen shown then was not read).",
        'verified': "code re-read and confirmed (hair-treatments-from-options-Bb9ASKmz.js lists exactly five treatments and sorts eligible ones first; router-CSFr2DF0.js has the greyed-out card text). Not seen live.",
    },
    'R19': {
        'verified': "help-centre wording re-read and correct: 'If you are found to be ineligible, a full refund will be issued.'",
    },
}

# status given to any rule the reviewer did not single out above
DEFAULT_VERIFIED = {
    'observed': 'run folders checked: they exist and show what the rule says',
    'code': 'not re-read line by line in stage 3',
    'docs': 'source wording not re-read in stage 3',
    'inferred': 'still inferred: nothing new supports or contradicts it',
}

# --------------------------------------------------------------------------------------------------
# 3. New rules found in stage 3
# --------------------------------------------------------------------------------------------------
NEW_RULES = [
    {
        'id': 'R39', 'flow': 'men',
        'when': "the visitor taps the back arrow and changes an earlier answer",
        'then': "It works and nothing else changes. The earlier screen comes back with his first answer marked; the new answer is posted for the same step and replaces the old one; the summary screen shows the new answer; the path and the wall are the same. (On the very first question the back arrow simply leaves the quiz: it is the browser's 'back'.)",
        'effectType': 'none', 'affects': [], 'evidence': 'observed',
        'proof': "runs/verify-11-back-change (men-q2 'Along the hairline', back arrow, then 'At the top': screens 02 to 04, summary on screen 19, two posts for the same step in network.jsonl); runs/verify-15-back-from-first",
        'confidence': 'high',
        'verified': "new in stage 3: observed by the reviewer",
    },
    {
        'id': 'R40', 'flow': 'men',
        'when': "the visitor leaves part-way and opens the quiz address again in the same browser",
        'then': "The quiz resumes at the question he had reached; his earlier answers are kept (the first screen says answers are saved for 7 days). He is not asked the earlier questions again.",
        'effectType': 'skip-questions', 'affects': [], 'evidence': 'observed',
        'proof': "runs/verify-12-delete-answers (four answers given, the delete box opened but not confirmed, then /c/hl opened again: screens 08 and 09 show question 5, and storage.json holds the four finished steps)",
        'confidence': 'high',
        'verified': "new in stage 3: observed by the reviewer",
    },
    {
        'id': 'R43', 'flow': 'women',
        'when': "date of birth gives an age under 18",
        'then': "Blocked with the same message as on Hims: 'Sorry, our service is only available to those 18 and over'.",
        'effectType': 'hard-stop', 'affects': ['h1', 'h2', 'h3', 'h4', 'h5'], 'evidence': 'code',
        'proof': "raw/app/index.js (the date check applies this message to the brands juniper-uk, hers-uk and hims-uk)",
        'confidence': 'medium',
        'verified': "new in stage 3: read in served code, not seen live",
    },
    {
        'id': 'R44', 'flow': 'women',
        'when': "she ticked hair goals in the Hers quiz",
        'then': "The recommendation page shows 'Matched for you based on your goals:' with one chip for each goal she ticked ('Reduce shedding', 'Regrow hair', 'More scalp coverage', 'More volume', 'Stronger hair'). Unlike Hims, where the chips are fixed text for each product, the Hers chips are built from her own answers. They do not change which treatment is shown: that comes from the server.",
        'effectType': 'marketing-only', 'affects': [], 'evidence': 'code',
        'proof': "raw/app/chunks/router-CSFr2DF0.js (the page reads her stored 'hairGoals' answers and shows only the matching chips)",
        'confidence': 'high',
        'verified': "new in stage 3: read in served code, not seen live",
    },
]

# rules whose text depended on the last reviewer runs
RULE_CHANGES.update({
    'R22': {
        'verified': "confirmed live by the reviewer, one answer at a time (runs/verify-01-no-hair, runs/verify-02-past-few-months, runs/verify-03-all-over, runs/verify-04-none-of-above) and all eight warning-sign answers together (runs/verify-19-all-warning-signs): still 'Great news—we have options that may work for you' and the email wall, with no warning and no extra question.",
        'then_add': "The reviewer also gave every warning-sign answer in one run, and a set of answers that contradict each other ('No hair loss yet' with 'A lot' of hair lost; 'I don’t have hair' with hair length 'Long'): same result, so the quiz has no check that the answers fit together.",
        'proof_add': "Reviewer (stage 3): runs/verify-01-no-hair, runs/verify-02-past-few-months, runs/verify-03-all-over, runs/verify-04-none-of-above, runs/verify-10-contradictory, runs/verify-19-all-warning-signs.",
    },
    'R26': {
        'then': "He is sent straight back to the sign-up email screen; the quiz does not start again. That screen has no 'Your answers' menu (the menu with 'Delete my answers' is only on the quiz screens, rule R41), and its back arrow leads to the Hims home page, not back into the quiz. So once he has finished, no way to retake the quiz or to delete his answers was found in that browser.",
        'verified': "confirmed live (runs/verify-09-return). The bracket about 'Delete my answers' was corrected after the reviewer tested that button (runs/verify-18-delete-confirm) and the back arrow on the sign-up screen (runs/verify-22-back-from-wall).",
        'proof_add': "Reviewer (stage 3): runs/verify-09-return (screens 24 and 25); runs/verify-22-back-from-wall (screen 24: the back arrow opens www.forhims.co.uk/).",
    },
    'R27': {
        'verified': "confirmed live: the phone layout again, with one answer changed (runs/verify-16-mobile-all-over: same 21 screens, same server path, only the summary line differs); and the combo-kit product code followed all the way to the wall for the first time (runs/verify-20-gst-combo-kit: same quiz version, same screens, same email screen; only the address differs, because it still carries the code).",
        'then_add': "Followed to the end by the reviewer, the combo-kit code (gst=s2hF6Mdn) is carried along in the address, including the sign-up address at the wall (/start/signup?gst=s2hF6Mdn&t=hair&anon_flow_key=hair). It changes nothing on screen: same quiz, no product and no price. It is not stored in the browser, none of the quiz's recorded requests carries it, and no reference to it was found in the app code that was read, so whether it pre-selects the product after sign-up is unknown.",
        'proof_add': "Reviewer (stage 3): runs/verify-16-mobile-all-over, runs/verify-20-gst-combo-kit; button links re-read in runs/verify-pages/hims-combo-kit-shopping.txt and hims-serum-shopping.txt.",
    },
    'R38': {
        'verified': "confirmed live twice by the reviewer: the Hers entry (runs/verify-baseline-women) and the app's anonymous-quiz address on the Hers site, app.forhers.co.uk/anon-flow/hair, which lands on the same name screen (runs/verify-17-hers-anon-route). Every 'Get started' and 'Get my treatment plan' button on forhers.co.uk/hair and /hair-blends points to that sign-up address (runs/verify-pages/hers-hair.txt, hers-hair-blends.txt).",
        'proof_add': "Reviewer (stage 3): runs/verify-baseline-women, runs/verify-17-hers-anon-route, runs/verify-pages/hers-hair.txt.",
    },
})

NEW_RULES += [
    {
        'id': 'R41', 'flow': 'men',
        'when': "the visitor opens the 'Your answers' menu on a quiz screen and chooses 'Delete my answers'",
        'then': "A box asks: 'Delete your answers? We’ll delete everything you’ve told us straight away and take you back to the start. This can’t be undone.' On confirming, the browser tells the server to delete the stored answers (the server replies 'ok'), a new guest token is issued and the quiz restarts at question 1 with nothing selected. Opening the quiz address again also shows question 1. Leaving the box unconfirmed changes nothing (the 'Cancel' button itself was not pressed).",
        'effectType': 'none', 'affects': [], 'evidence': 'observed',
        'proof': "runs/verify-18-delete-confirm (screens 06 to 10; network.jsonl holds the DeleteAnonymousFlowResponses post answered 'ok: true'; storage.json shows an empty step history); runs/verify-12-delete-answers (box opened, not confirmed: answers kept)",
        'confidence': 'high',
        'verified': "new in stage 3: observed by the reviewer",
    },
    {
        'id': 'R42', 'flow': 'men',
        'when': "the answers contradict each other, or every warning-sign answer is given together",
        'then': "Nothing: no consistency check, no warning, no stop. 'No hair loss yet' with 'A lot' of hair lost, 'I don’t have hair' with hair length 'Long', and the full set of warning signs in one run all end at the same 'Great news' message and email wall.",
        'effectType': 'none', 'affects': [], 'evidence': 'observed',
        'proof': "runs/verify-10-contradictory, runs/verify-19-all-warning-signs; also runs/map-opposite-path (stage 1)",
        'confidence': 'high',
        'verified': "new in stage 3: observed by the reviewer",
    },
]

# --------------------------------------------------------------------------------------------------
# 4. Products (facts re-checked against live pages, the app's served product files and the price table)
# --------------------------------------------------------------------------------------------------
_TABLE = "Prices re-worked from the price table the site embeds in its pages: correct, and the saved copy (raw/store-product-details.json) matches the table embedded in the live page on 23 November 2026 for all 33 active hair plans (runs/verify-pages-html)."
_NO_PUBLIC_PRICE = "No public page shows a price for this product; the price comes from that table only (old shop system) and the new checkout price was not seen."
PRODUCT_CHANGES = {
    'p1': {
        'verified': "Name and strengths (finasteride 0.3%, minoxidil 6%) re-read in the app's product file (raw/app/chunks/fixture-topical-fin-min-spray-Dq3EkIUv.js) and the leaflet text. " + _TABLE + " " + _NO_PUBLIC_PRICE + " Its safety-information address now redirects to /hair-loss (runs/verify-pages/hims-safety-spray.txt); the leaflet text was read from the product data embedded in public pages.",
        'priceEvidence': 'code',
    },
    'p2': {
        'verified': "Name and strengths (finasteride 0.3%, minoxidil 7%) re-read in the app's product file (fixture-topical-fin-min-spray-keto-biotin-DYM4O9_f.js); ketoconazole 2.2% and biotin 0.2% in the leaflet text ('The spray contains 0.3% Finasteride, 7% Minoxidil, 2.2% Ketoconazole and 0.2% Biotin'). " + _TABLE + " " + _NO_PUBLIC_PRICE,
        'priceEvidence': 'code',
    },
    'p3': {
        'verified': "Live page re-read (runs/verify-pages/hims-serum-shopping.txt): 'The Combination Hair Loss Serum', 'Once-daily topical serum with precision applicator', 'Get started from £16.50/mo', 'Minimum 3 months treatment'. Strengths re-read on the live page's safety panel ('The serum contains 0.3% Finasteride and 6% Minoxidil', runs/verify-21-safety-modal/01.jpg) and in the app's product file. " + _TABLE,
        'priceEvidence': 'docs',
    },
    'p4': {
        'priceDetail': "3-month plan £75 (£25 a month); monthly plan £60. Source: the store price table the site embeds in its own pages (api.forhims.co.uk/store/v2/products/product_details, copy in raw/store-product-details.json). The table lists one strength only.",
        'verified': "Name and strengths (finasteride 1.1 mg, minoxidil 3 mg) re-read in the app's product file (fixture-fin-min-supplement-blend-tablet-xQVw5LlZ.js). The vitamin strengths come only from the older help centre. " + _TABLE + " " + _NO_PUBLIC_PRICE + " Stage 2's remark that 'other strengths may be prescribable' was removed: the app's strength picker is shared code used for other products, and nothing shows more than one strength of this chew.",
        'priceEvidence': 'code',
    },
    'p5': {
        'verified': "Minoxidil 3 mg re-read in the product data ('3mg Minoxidil'). 'From £16.50/month' re-read under 'The Hair Regrowth Treatment + Supplement Blend' in the product list inside the serum shopping page's source (runs/verify-pages-html/serum-shopping.txt). " + _TABLE,
        'priceEvidence': 'docs',
    },
    'p6': {
        'verified': "Name re-read in the app's product file ('Supplement Blend'). Strengths come only from the older help centre. " + _TABLE + " " + _NO_PUBLIC_PRICE,
        'priceEvidence': 'code',
    },
    'p7': {
        'verified': "Live page re-read (runs/verify-pages/hims-finasteride.txt): 'Finasteride', 'This once-daily tablet is clinically proven to stop hair loss'. The public safety page says 'the dosage we prescribe for hair loss (1mg)' (hims-safety-finasteride.txt). The product page itself shows no price; 'From £23/month' is under 'The Hair Saving Tablets' in the product list inside the serum shopping page's source (runs/verify-pages-html/serum-shopping.txt). " + _TABLE,
        'priceEvidence': 'docs',
    },
    'p8': {
        'verified': "Live page re-read (runs/verify-pages/hims-minoxidil.txt): 'Alcohol-free Minoxidil Serum', 'Twice-daily topical serum'. The same page's how-to text says 'Once a day drop 1 ml', which contradicts it: an inconsistency on Hims's own page. Strength 5% re-read in the app's product file (fixture-alcohol-free-minoxidil-serum-TR6ciEW4.js) and the older help centre; one field of the product data says 6%. " + _TABLE + " " + _NO_PUBLIC_PRICE,
        'priceEvidence': 'code',
    },
    'p9': {
        'verified': "Live pages re-read (runs/verify-pages/hims-combo-kit.txt and hims-combo-kit-shopping.txt): 'The Finasteride + Minoxidil Combo Kit', 'Once-daily tablet', 'Twice-daily alcohol-free topical serum', 'Get started from £30/mo'; 'From £30/month' also in the product list (runs/verify-pages-html/serum-shopping.txt). " + _TABLE,
        'priceEvidence': 'docs',
    },
    'p10': {
        'verified': "Name re-read in the app's product file ('Regaine® Liquid Solution'); 5% w/v from the leaflet text in the product data. " + _TABLE + " " + _NO_PUBLIC_PRICE + " It is not shown on any public page the reviewer opened.",
        'priceEvidence': 'code',
    },
    'p11': {
        'verified': "Price table re-read: Hims Shampoo, Regaine for Men (foam) and Hair Power Pack are marked 'out_of_stock', Complete Hair Kit 'archived'. None appears on a public page the reviewer opened or in the site's product feed.",
    },
    'p12': {
        'verified': "Terms re-read (clause 7.2: payment for the full order is collected on submitting). The live how-it-works page says 'Get quick access to a licensed provider' and 'shipped to you directly' (runs/verify-pages/hims-how-it-works.txt). The refund line is in the app's code (rule R16). Not seen live as a customer.",
    },
    'h1': {
        'verified': "Live page re-read (runs/verify-pages/hers-hair.txt): 'Most Popular · Oral tablet · Hair treatment with vitamins · Starting at £13/month'. Strengths re-read in the app's code (raw/app/chunks/router-CSFr2DF0.js): minoxidil 1.5mg, biotin 2.5mg, vitamin C 100mg, vitamin B5 11mg, vitamin B6 2.5mg, zinc sulfate 50mg. Not on a public page.",
        'priceEvidence': 'docs',
    },
    'h2': {
        'verified': "Live page re-read: 'Lemon flavour · Oral chew · Biotin hair treatment chews · Starting at £13/month'. Strengths re-read in the app's code: minoxidil 1.5mg, biotin 2.5mg.",
        'priceEvidence': 'docs',
    },
    'h3': {
        'active_strength': {'biotin': "listed on the public page and in the app's ingredient list; strength not stated (the app would show the tablet figure, 2.5mg, which cannot be right for a serum)"},
        'verified': "Live page re-read: 'Scalp friendly · Topical serum · Hair blends serum · Starting at £13/mo · Formulated for a healthy scalp with biotin, ketoconazole, and vitamin B'. Strengths re-read in the app's code: minoxidil 7%, ketoconazole 2.2%, dexpanthenol 5%. Stage 2's 'biotin not confirmed' was corrected: biotin is named on the public page.",
        'priceEvidence': 'docs',
    },
    'h4': {
        'verified': "Live page re-read: 'Dual action · Oral capsule · Hormonal hair loss capsule · Starting at £20/month'. Strengths re-read in the app's code: minoxidil 1.5mg, spironolactone 44mg, biotin 2.5mg, vitamin B5 11mg, vitamin B6 2.44mg, vitamin C 100mg, zinc sulfate 50mg.",
        'priceEvidence': 'docs',
    },
    'h5': {
        'verified': "Not on any public page; listed only in the app's code (one of five treatment keys). Strengths re-read there: biotin 2.5mg, vitamin C 100mg, vitamin B5 11mg, vitamin B6 2.5mg, zinc sulfate 50mg. Price unknown.",
        'priceEvidence': 'unknown',
    },
    'h6': {
        'active_strength': {'minoxidil': "not stated by Hers (this brand's once-a-day women's foam is sold elsewhere as 5%: outside knowledge, not from Hers)"},
        'verified': "Live pages re-read (hers-hair.txt, hers-hair-blends.txt): 'Topical foam · Regaine · Regaine® for Women ONCE A DAY Scalp Foam', with no price. Still not among the five treatments in the app's code.",
        'priceEvidence': 'unknown',
    },
}

# --------------------------------------------------------------------------------------------------
# 5. Questions, options, flows
# --------------------------------------------------------------------------------------------------
NEW_QUESTIONS = {
    'men': [{
        'id': 'men-menu', 'order': 0.5, 'stage': 'anonymous',
        'text': "'Your answers' menu (the three dots at the top right of every quiz screen): Log in · Privacy notice · Delete my answers",
        'type': 'single',
        'options': [
            {'label': 'Log in', 'effect': "A link to the sign-in page (/login). Not followed: signing in is outside the research rules.",
             'effectType': 'none', 'affects': [], 'evidence': 'observed'},
            {'label': 'Privacy notice', 'effect': "A link to https://www.forhims.co.uk/privacy-policy. No effect on the quiz.",
             'effectType': 'none', 'affects': [], 'evidence': 'observed'},
            {'label': 'Delete my answers', 'effect': "Opens the box 'Delete your answers? We’ll delete everything you’ve told us straight away and take you back to the start. This can’t be undone.' with 'Delete my answers' and 'Cancel'. Confirming deletes the stored answers on the server and restarts the quiz at question 1 (runs/verify-18-delete-confirm). Not confirming keeps them (runs/verify-12-delete-answers).",
             'effectType': 'none', 'affects': [], 'evidence': 'observed'},
        ],
        'purpose': "Not a question: a privacy control. It is the only control seen that starts the quiz again, and it is only reachable before the quiz is finished: a part-finished quiz resumes where he left off (rule R40), and a finished one sends a returning visitor straight to the sign-up screen, which has no such menu (rule R26).",
        'engineRole': 'consent', 'branches': False, 'branchDetail': '',
        'shownWhen': 'on every quiz screen (not on the sign-up screen)',
        'evidence': 'observed',
        'proof': "runs/misc1 (stage 1: menu opened), runs/verify-12-delete-answers and runs/verify-18-delete-confirm (reviewer, stage 3)",
    }],
}
QUESTION_CHANGES = {
    'men-q5': {'branchDetail_add': "Reviewer (stage 3): unticking the last box disables Continue again; an ordinary tick clears 'All of the above'; four boxes ticked by hand are sent as four values (runs/verify-13-multi-edge, runs/verify-14-multi-all-four)."},
    'men-a1': {'purpose_add': "Reviewer (stage 3): the same screen again in runs/verify-00-baseline-full, runs/verify-08-skip-quiz and runs/verify-09-return; a product code in the entry address (gst=s2hF6Mdn) stays in the address but does not change the screen (runs/verify-20-gst-combo-kit)."},
    'men-m3': {'shownWhen_add': "Reviewer (stage 3): the wording was re-read in the old site's code (raw/www-js/hims.modern.151…js). Nothing in the new app's code that was read contains this question."},
    'women-q2': {'purpose_add': "Reviewer (stage 3): confirmed in code that the Hers recommendation page shows only the chips for the goals she ticked (rule R44)."},
    'women-q7': {'purpose_add': "Reviewer (stage 3): the first quote is from the FAQ on forhers.co.uk/hair (re-read live); the help page's own words are 'Hair treatments shouldn't be used during pregnancy or breastfeeding'."},
}
FLOW_CHANGES = {
    'men': {'stagesSummary_add': "Stage 3 re-check: baseline replayed twice more with the same end; going back, leaving and returning, deleting answers and contradictory answers all tested, none changes the outcome."},
    'men-product-link': {'stagesSummary_add': "Stage 3: the combo-kit code (gst=s2hF6Mdn) was followed to the wall (runs/verify-20-gst-combo-kit): same quiz and same email screen; the code is still in the sign-up address, but nothing on screen changes and none of the quiz's recorded requests carries it."},
    'men-reactivation': {'stagesSummary_add': "Stage 3: at about 22:00 UTC on 23 November 2026 a site-wide setting changed so that hair consultations also support a 'reactivation review consultation' (cfg_supported_triage_event_types in the feature flags). This suggests that restarting a cancelled hair plan may now go to a clinician review instead of, or as well as, this one-screen check (inferred). Not seen live."},
    'women': {'stagesSummary_add': "Stage 3 re-check: still the name wall on the first screen, also when the app's anonymous-quiz address is tried on the Hers site (runs/verify-17-hers-anon-route). Nothing about the women's route was seen live."},
}

# --------------------------------------------------------------------------------------------------
# 6. Experiments run by the reviewer
# --------------------------------------------------------------------------------------------------
def _x(i, flow, changed, result):
    return {'id': i, 'flow': flow, 'changed': changed, 'result': result, 'run': 'runs/' + i, 'stage': 'verify'}

_SAME = "Same 21 quiz screens in the same order, the same server-named next step after every answer, the same 'Great news' message and the same email wall."
NEW_EXPERIMENTS = [
    _x('verify-baseline-men', 'men', "nothing: baseline-men.json replayed by the reviewer with tools/walk.js",
       "End state matches what is recorded: 21 quiz screens, then 'Ready to see if you’re eligible?' with an empty email field at /start/signup?t=hair&anon_flow_key=hair. The text of all 24 saved screens is identical to runs/baseline-men (stage 1) and runs/exp-00-baseline-full (stage 2)."),
    _x('verify-baseline-women', 'women', "nothing: baseline-women.json replayed by the reviewer",
       "End state matches what is recorded: the first Hers screen asks for first and last name. No question can be answered."),
    _x('verify-00-baseline-full', 'men', "nothing: the baseline again, keeping every server reply (scripts/walk-full.js)",
       "Same screens and same end. 21 'submit step' posts, each answered with the next step, then one 'submit flow' post answered with a record id only. Used as the reviewer's own baseline."),
    _x('verify-01-no-hair', 'men', "men-q6: 'Straight or wavy' → 'I don’t have hair'", "No change on any screen. " + _SAME),
    _x('verify-02-past-few-months', 'men', "men-q4: 'Over a year ago' → 'In the past few months'", "One summary line changed ('Noticed: In the past few months'). No warning. " + _SAME),
    _x('verify-03-all-over', 'men', "men-q2: 'Along the hairline' → 'All over'", "One summary line changed ('All over'). No warning. " + _SAME),
    _x('verify-04-none-of-above', 'men', "men-q1: 'Experiencing hair loss, ready to start treatment' → 'None of the above'", "No change on any screen. " + _SAME),
    _x('verify-05-a-lot', 'men', "men-q3: 'Some' → 'A lot'", "No change on any screen. " + _SAME),
    _x('verify-06-protective-styles', 'men', "men-q10: 'No styling' → 'Protective styles'", "One summary line changed ('Protective styles, braids, locs, etc.'). " + _SAME),
    _x('verify-07-all-above-clears', 'men', "men-q5: 'Visibly thicker, fuller hair' ticked, then 'All of the above'",
       "The first tick was cleared and only the value ALL was sent. " + _SAME),
    _x('verify-08-skip-quiz', 'men', "entry: the sign-up address opened directly, no quiz", "The same email screen ('Ready to see if you’re eligible?'). The quiz is optional."),
    _x('verify-09-return', 'men', "after finishing the baseline quiz, /c/hl is opened again in the same browser", "Sent straight back to the email screen; the quiz does not restart."),
    _x('verify-10-contradictory', 'men', "six answers that contradict each other: men-q1 'No hair loss yet…', men-q3 'A lot', men-q6 'I don’t have hair', men-q7 'Long', men-q8 'Not sure', men-q9 'Not sure'",
       "No consistency check. Two summary lines changed (family history and stress: 'Not sure'). " + _SAME),
    _x('verify-11-back-change', 'men', "men-q2 answered 'Along the hairline', back arrow, then changed to 'At the top'",
       "Going back works: the earlier screen shows the first answer as chosen, the new answer is posted for the same step and the summary shows 'At the top'. " + _SAME),
    _x('verify-12-delete-answers', 'men', "four answers given, 'Your answers' → 'Delete my answers' (box opened, not confirmed), then /c/hl opened again",
       "The menu shows Log in, Privacy notice and Delete my answers. The delete button opens a confirmation box. With the box left unconfirmed, the answers were kept and reopening /c/hl resumed the quiz at question 5."),
    _x('verify-13-multi-edge', 'men', "men-q5: tick then untick one box; 'All of the above'; then 'More scalp coverage' and 'Keep the hair I have'",
       "Unticking the only box greys Continue out again. An ordinary tick clears 'All of the above'. Two values were sent (SCALP_COVERAGE, STOP_LOSS). " + _SAME),
    _x('verify-14-multi-all-four', 'men', "men-q5: all four ordinary goals ticked by hand",
       "Sent as a list of four values, not as ALL; the 'All of the above' box stays unticked. " + _SAME),
    _x('verify-15-back-from-first', 'men', "the back arrow on question 1, before any answer",
       "It is the browser's 'back': from a fresh browser it leaves the quiz (blank page). Nothing is posted."),
    _x('verify-16-mobile-all-over', 'men', "device: phone layout (walk --mobile), and men-q2: 'Along the hairline' → 'All over'",
       "Same quiz on a phone-sized screen. Only the summary line changed. " + _SAME),
    _x('verify-17-hers-anon-route', 'women', "entry: the app's anonymous-quiz address tried on the Hers site (app.forhers.co.uk/anon-flow/hair?t=hair)",
       "Lands on the same name screen at /start/signup?t=hair. Hers has no anonymous hair quiz, as the feature flags say."),
    _x('verify-18-delete-confirm', 'men', "four answers given, 'Your answers' → 'Delete my answers' → 'Delete my answers' again in the confirmation box, then /c/hl opened again",
       "The browser posts a delete request, the server replies 'ok', a new guest token is issued and the quiz is back at question 1 with nothing selected. Reopening /c/hl also shows question 1."),
    _x('verify-19-all-warning-signs', 'men', "eight warning-sign answers together: men-q1 'None of the above', men-q2 'All over', men-q3 'A lot', men-q4 'In the past few months', men-q6 'I don’t have hair', men-q7 'Buzzed, shaved, or bald', men-q8 'No', men-q9 'All the time'",
       "No warning, no extra question, no stop. Four summary lines follow the answers. " + _SAME),
    _x('verify-20-gst-combo-kit', 'men-product-link', "entry: /c/hl?gst=s2hF6Mdn (the combo-kit page's 'Get started from £30/mo' link), baseline answers",
       "Same quiz version and same screens. The code stays in the address all the way to the sign-up screen (/start/signup?gst=s2hF6Mdn&t=hair&anon_flow_key=hair). No product or price is shown; the code is not stored in the browser and none of the quiz's recorded requests carries it."),
    _x('verify-21-safety-modal', 'men', "nothing answered: 'Important Safety Information' opened on the serum shopping page, then two safety-information pages",
       "The link opens a panel headed 'Important Safety Information' with the serum's patient information ('The serum contains 0.3% Finasteride and 6% Minoxidil … men aged 18-65'): see the picture 01.jpg (the text capture missed the panel). So the leaflet wording behind the document-based rules is shown to the public on product pages. The finasteride and combo-kit safety pages open at their own addresses."),
    _x('verify-22-back-from-wall', 'men', "after the baseline quiz, the back arrow on the sign-up screen is tapped (email field left empty), then the 'Your answers' menu is looked for",
       "The back arrow opens the Hims home page (www.forhims.co.uk/), not the quiz. There is no 'Your answers' menu on the sign-up screen or the home page, so the run stops there (the walker reports the missing menu as a failed step: that is the finding)."),
    _x('verify-pages', 'men', "nothing answered: 16 public pages opened one after another (Hims hair pages, safety pages, chooser, how-it-works; Hers home, hair and Hair Blends)",
       "Product names, forms and 'from' prices match the catalogue (details in each product's 'verified' field). Three compounded-product safety addresses now redirect to /hair-loss. Every Hims button leads to /c/hl and every Hers button to the sign-up address. The source of one page was also fetched once (runs/verify-pages-html): its product list has the 'From £…/month' lines, and its embedded price table matches the saved copy."),
]

# --------------------------------------------------------------------------------------------------
# 7. Recommendations, lists, summaries
# --------------------------------------------------------------------------------------------------
RECOMMENDATION_NOTE_ADD = {
    0: "Reviewer (stage 3): replayed twice from fresh browsers (runs/verify-baseline-men, runs/verify-00-baseline-full); same end state.",
    1: "Reviewer (stage 3): 15 more men's quiz replays ended the same way (runs/verify-01-no-hair to runs/verify-20-gst-combo-kit), including contradictory answers and every warning-sign answer together.",
    3: "Reviewer (stage 3): still inferred. No run and no served code shows which products are left.",
    4: "Reviewer (stage 3): still inferred. No run and no served code shows which products are left.",
    5: "Reviewer (stage 3): still inferred; the leaflet age lines were re-read and are quoted correctly.",
    6: "Reviewer (stage 3): the screen wording is confirmed in code. The 'likely causes' sentence is the investigators' inference from help pages and leaflets, not something the code shows.",
    7: "Reviewer (stage 3): replayed (runs/verify-baseline-women); the app's anonymous-quiz address on the Hers site lands on the same name screen (runs/verify-17-hers-anon-route).",
    8: "Reviewer (stage 3): code re-read and confirmed; the recommended treatment is the eligible one the server names, else the server's default, else the first eligible one.",
}

LIST_REPLACE = {
    'limitations': [
        ("The one-change tests cover each of the 42 anonymous options on its own",
         "The one-change tests cover each of the 42 anonymous options on its own, one run with every answer changed, and two multi-select combinations (stage 2). Stage 3 repeated six of them and added contradictory answers, every warning-sign answer together, three more multi-select patterns, going back to change an answer, leaving and returning, and deleting answers. Other combinations were not tested; the served definition has no conditions, so none is expected to matter."),
        ("Not tested: going back and changing an answer part-way",
         "Still not tested: coming back after several days (the first screen says answers are saved for 7 days), and anything that needs a sign-in. The phone layout was run twice."),
        ("Review quotes come from Trustpilot through a page-summary tool",
         "Review quotes come from Trustpilot through a page-summary tool (read twice in stage 2 and twice more in stage 3, with the same score and the same quotes) and from the review panel on Hims's own pages; they are a small sample, not a survey. The tool gave the date of the 'Auto renewed at 43% more' review as 19 November 2025 in one reading and '2 days ago' in another, so its year is uncertain."),
    ],
    'weaknesses': [
        ("Prices are hidden until late and the cheap figure needs 6 or 12 months",
         "Prices are hidden until late and the cheap figure needs 6 or 12 months paid up front (for example £99 or £276); the monthly chew plan is £60. Only four of the ten products have a 'from' price on a public page (serum, minoxidil chew, finasteride tablets, combo kit). One Trustpilot reviewer ('Si', dated 19 November; the year is unclear) reports being 'Auto renewed at 43% more with no advance notice'"),
    ],
}
LIST_ADD = {
    'limitations': [
        "Stage 3 checked product names, forms and 'from' prices on the live public pages, and strengths in the app's served product files and leaflet text. The full plan prices for Hims still rest on one source, the old shop's price table; six of the ten Hims products have no price on any public page.",
        "The leaflets of three compounded products (2-in-1 spray, both chews) no longer open at their own addresses: those addresses now redirect to the hair landing page. Their wording was read from the product data the site embeds in public pages, so it may be the old platform's text.",
        "Rules about what happens after the wall that rest on a leaflet's 'do not use' line say what Hims tells patients, not what the consultation does. The reviewer lowered their confidence to 'low' and relabelled the ones that only predict an engine action as 'inferred'.",
    ],
    'weaknesses': [
        "The quiz has no check that the answers fit together: 'No hair loss yet' with 'A lot' of hair lost, or 'I don’t have hair' with hair length 'Long', pass without comment (stage 3)",
        "A visitor who has finished the quiz cannot retake it or delete his answers from where he lands: reopening the quiz sends him to the sign-up screen, which has no 'Delete my answers' control, and its back arrow goes to the home page (stage 3)",
        "Small inconsistencies on public pages: the minoxidil serum page says 'Twice-daily topical serum' and, lower down, 'Once a day drop 1 ml'; three safety-information addresses for compounded products redirect to the landing page",
    ],
    'strengths': [
        "Sensible data handling in the quiz: answers are kept for 7 days so a visitor can resume where he left off, he can go back and change an answer, and 'Delete my answers' removes them from the server at once (all seen in stage 3)",
        "Hers UK shows real personalisation that Hims lacks: its 'Matched for you based on your goals' chips are built from the goals the woman ticked (read in code, not seen live)",
    ],
}
NEW_SOURCES = [
    {'title': "Reviewer's live re-read of 16 public Hims and Hers pages on 23 November 2026 (text and links saved in runs/verify-pages)", 'url': "https://www.forhims.co.uk/hair-loss/combo-kit-shopping"},
]
SOURCE_RETITLE = {
    "https://www.forhims.co.uk/safety-information/topical-finasteride-and-minoxidil-spray": "Hims UK safety information: topical finasteride and minoxidil spray (on 23 November 2026 this address redirected to /hair-loss; the text was read from the product data embedded in public pages, saved in raw/hair-products-contentful.txt)",
    "https://www.forhims.co.uk/safety-information/minoxidil-hair-hybrid": "Hims UK safety information: minoxidil Hair Hybrid chew (on 23 November 2026 this address redirected to /hair-loss; the text was read from the product data embedded in public pages, saved in raw/hair-products-contentful.txt)",
    "https://www.forhims.co.uk/safety-information/finasteride-and-minoxidil-hair-hybrid": "Hims UK safety information: finasteride and minoxidil Hair Hybrid tablet (on 23 November 2026 this address redirected to /hair-loss; the text was read from the product data embedded in public pages, saved in raw/hair-products-contentful.txt)",
}
CODE_CONFIRMED_ADD = [
    {
        'codeRule': "The summary and option lists of the anonymous quiz are fixed by the served definition; the 'Your answers' menu and the 7-day consent line are part of the quiz shell.",
        'source': "quiz-definition.json; first quiz screen",
        'confirmedLive': "Reviewer: answers are kept and the quiz resumes after leaving; 'Delete my answers' posts a delete request and restarts at question 1.",
        'runs': "runs/verify-12-delete-answers, runs/verify-18-delete-confirm",
        'rule': "R40, R41",
    },
    {
        'codeRule': "Hers has no hair entry in the list of anonymous quizzes (same finding as stage 2, tested a second way).",
        'source': "raw/app/launchdarkly-flags-hers-uk-anon.json",
        'confirmedLive': "Reviewer: the anonymous-quiz address on the Hers site falls through to the name screen.",
        'runs': "runs/verify-17-hers-anon-route",
        'rule': "R38",
    },
]

ENGINE_SUMMARY_ADD = ("Stage 3 (independent check): the reviewer replayed the baseline from fresh browsers and got the recorded end state, repeated six one-change runs with the same result, "
                      "and tried what stage 2 had not: contradictory answers, every warning-sign answer together, going back, leaving and returning, deleting answers, a product code followed to the wall. "
                      "None of it moves the engine before the wall. Everything said about the engine after the wall is still read from code, leaflets and help pages, or reasoned, and none of it was seen happening.")
COVERAGE_ADD = ("Stage 3 (verify) added 25 reviewer replays in runs/verify-* (two baselines, a full-trace baseline, six repeated one-change runs, and 16 runs on behaviour stage 2 had not tested or had tested once), "
                "re-read 16 public pages, re-read the served code behind every code-based rule, and re-read the leaflet and help-centre lines behind every document-based rule. "
                "The wall is where stage 1 and stage 2 said it is, and nothing behind it could be tested.")
BLOCKERS_ADD = [
    "Stage 3: web.archive.org was still refused by the fetch tool, so the archived old consultation remains unread",
    "Stage 3: three safety-information addresses for compounded Hims products (2-in-1 spray, both chews) redirect to /hair-loss; their text was read from the product data embedded in public pages (the serum's leaflet is also shown in a panel on its own page; the panels for the other products were not opened)",
]
VERIFICATION = {
    'reviewedOn': "2026-11-23",
    'method': "Independent re-check by a reviewer who did not do stages 1 and 2. 25 fresh-browser replays in runs/verify-* (walked with tools/walk.js or the full-trace copy scripts/walk-full.js), compared with a separately written script (scripts/verify_compare.py); 16 public pages re-opened (runs/verify-pages) and one page source fetched (runs/verify-pages-html); served code, leaflet text and help pages re-read by hand in raw/. No account, no sign-in, nothing typed into any field.",
    'checked': [
        "Men's baseline replayed fresh twice (runs/verify-baseline-men, runs/verify-00-baseline-full): MATCHES the record. 21 quiz screens, then 'Ready to see if you’re eligible?' with an empty email field at app.forhims.co.uk/start/signup?t=hair&anon_flow_key=hair. The text of all 24 saved screens is identical to the stage 1 and stage 2 baselines.",
        "Women's baseline replayed fresh (runs/verify-baseline-women): MATCHES. The first Hers screen asks for first and last name. The app's anonymous-quiz address tried on the Hers site lands on the same screen (runs/verify-17-hers-anon-route).",
        "All 43 stage 2 experiments audited against their run folders: every folder exists, every quiz run ends at the email wall, each one-change run posted exactly the answer it claims, and all 42 anonymous options were posted at least once. No mismatch found.",
        "Rule R1 (no answer changes the path): CONFIRMED. Six one-change runs repeated (runs/verify-01-no-hair to runs/verify-06-protective-styles): same 21 screens, same server-named next step after every answer, same wall.",
        "Rule R22 (warning-sign answers cause no stop or warning): CONFIRMED, one at a time (four runs) and all eight together (runs/verify-19-all-warning-signs). Contradictory answers also pass (runs/verify-10-contradictory).",
        "Rules R20 and R21 (six answers are played back on one summary screen, five are never shown): CONFIRMED in the reviewer's runs (summary line changed in seven of them, no change in three).",
        "Rule R23 (multi-select: Continue disabled until a tick, 'All of the above' stands alone): CONFIRMED and extended (runs/verify-07-all-above-clears, runs/verify-13-multi-edge, runs/verify-14-multi-all-four).",
        "Rule R24 (the server returns no result at the end): CONFIRMED in the reviewer's own server trace (21 step posts, one flow post answered with a record id only).",
        "Rule R25 (quiz optional), R26 (returning visitor sent to the wall), R27 (same quiz on a phone and from product links), R29 (same quiz version for every anonymous visitor) and R38 (Hers asks for a name first): all CONFIRMED (runs/verify-08-skip-quiz, verify-09-return, verify-16-mobile-all-over, verify-20-gst-combo-kit, verify-17-hers-anon-route; the feature-flag settings were the same for every visitor in 22 more fresh browsers, apart from one setting that changed for everyone at about 22:00 UTC).",
        "Code-based rules re-read in the named files: R2 (under 18 refused), R6 (ineligible product greyed out), R7 (rejection screen), R8 (old tag system), R16 (refund), R18 (Hers ineligible card), R28 (quiz answers attached at sign-up), R30 (hero product), R31 (skip logic), R32 (fixed goal chips), R33 (consent wording): all MATCH the code; R31 needed one correction. None was seen live.",
        "Document-based rules re-read against the saved leaflet text and help pages: R3, R4, R5, R9, R10, R12, R13, R14, R17, R19, R34, R35, R36, R37. Every quoted line is there, and 21 of the leaflet lines were found again in the product data embedded in the live page on the day (runs/verify-pages-html). The leaflet panel is shown to the public on product pages (runs/verify-21-safety-modal/01.jpg).",
        "Product facts checked against live pages: (1) combination serum: name, once daily, 'Get started from £16.50/mo', 0.3% + 6% on its safety panel; (2) finasteride tablets: name, once-daily tablet, 1mg on the public safety page, 'From £23/month'; (3) minoxidil serum: name, twice daily; (4) combo kit: name, contents, 'Get started from £30/mo'; (5) minoxidil chew: 'From £16.50/month'; (6) Hers pill: 'Most Popular', oral tablet, 'Starting at £13/month'; (7) Hers chew: lemon, 'Starting at £13/month'; (8) Hers serum: 'Starting at £13/mo', biotin, ketoconazole and vitamin B; (9) Hers capsule: 'Starting at £20/month'; (10) Regaine for Women foam: shown, no price. All MATCH the catalogue, apart from the corrections listed below.",
        "Product strengths checked in the app's served product files: 2-in-1 spray 0.3% + 6%, 4-in-1 spray 0.3% + 7%, serum 0.3% + 6%, chew 1.1mg + 3mg, minoxidil serum 5%, combo kit 5%, and the five Hers treatments. All MATCH.",
        "Hims prices re-worked from the price table: all MATCH, and the table embedded in the live page on 23 November 2026 has the same price for all 33 active hair plans as the saved copy.",
        "Catalogue completeness: the site's product feed and price table list the same ten live Hims hair products as the catalogue; the Hers hair pages show five cards (four prescription treatments and Regaine foam), all in the catalogue, plus one treatment found only in code. Nothing missing.",
        "Reachable but untested controls: the back arrow (on a question, on question 1 and on the sign-up screen), the 'Your answers' menu and 'Delete my answers' were tested for the first time (runs/verify-11-back-change, verify-12-delete-answers, verify-15-back-from-first, verify-18-delete-confirm, verify-22-back-from-wall). Not pressed: 'Log in' (sign-in is not allowed) and 'Cancel' in the delete box.",
        "Trustpilot read twice more through the page-summary tool: 4.1 from 123 reviews, and the three quotes used ('thorough with questions', 'easy to follow', 'Auto renewed at 43% more with no advance notice') were returned again.",
    ],
    'corrected': [
        "Rules R11, R15 and R37: label changed from 'docs' to 'inferred'. The leaflets only say 'talk to your doctor'; the stated outcome (a clinician flag, or products removed) is a prediction.",
        "Rule R12 (sudden, patchy or medicine-caused hair loss): label changed from 'docs' to 'inferred', confidence from medium to low, and the text rewritten. The help page gives advice ('please see your GP'); it does not say the consultation stops these men, and the anonymous quiz does not react to such answers.",
        "Rules R9, R10, R14 and R17: confidence lowered from medium to low, and R9, R10, R13, R14, R34 and R35 now say plainly that a leaflet's 'do not use' line is what Hims tells patients, not an observed action of the consultation.",
        "Rule R17: the quote was fixed to the exact wording and its two sources separated (FAQ on the hair page; help centre).",
        "Rule R29: 'cannot show different visitors different versions' softened to what was seen (same version and same settings in every fresh browser; other kinds of test cannot be ruled out).",
        "Rule R31: corrected after re-reading the code (with no product chosen, an unmet gate such as GP details comes before the recommendation page).",
        "Rule R26: the note about 'Delete my answers' corrected after testing it (the menu is on quiz screens only, not on the sign-up screen a returning visitor is sent to).",
        "Rule R27 and the product-link flow: a product code was followed to the wall for the first time; it stays in the sign-up address but changes nothing on screen.",
        "Rules R6, R8 and R18: details added from the code (which denials grey a card out; the old 'rejectsAll' mark; how the Hers recommendation is picked).",
        "New rules added: R39 (going back and changing an answer), R40 (the quiz resumes where he left off), R41 ('Delete my answers'), R42 (no consistency check), R43 (Hers refuses under-18s, from code), R44 (Hers goal chips follow her own answers, from code).",
        "New question entry 'men-menu' (the 'Your answers' menu, three options) and 26 reviewer experiments added (25 replays and one set of page reads).",
        "Product p4 (chew): the remark that 'other strengths may be prescribable' removed. It rested on shared app code, not on anything about this product.",
        "Product h3 (Hers serum): 'biotin not confirmed' corrected. The public page names biotin; its strength is not stated.",
        "Product h6 (Regaine for Women): the 5% strength is now marked as outside knowledge, since Hers does not state it.",
        "Every product now has a 'verified' note and a 'priceEvidence' label. Six of the ten Hims products (both sprays, the finasteride + minoxidil chew, the supplement chew, the minoxidil serum, Regaine) have no price on any public page: their prices rest on the old shop's price table alone.",
        "Three sources retitled: the safety-information addresses of the 2-in-1 spray and both chews now redirect to /hair-loss; their text came from product data embedded in public pages.",
        "Every question labelled 'observed' now names the run folders that prove it. No 'observed' claim was found without a run folder, so none had to be downgraded.",
        "Limitations, strengths and weaknesses updated for what stage 3 tested (going back, resuming, deleting answers, contradictory answers) and for the uncertain date of one Trustpilot review.",
    ],
    'stillUnverified': [
        "Everything after the account wall. The medical questions, their wording and order, and every rule of the form 'answer X removes product Y' were not seen. Rules R2 to R19, R30 to R37, R43 and R44 come from served code, leaflets, help pages or reasoning.",
        "Which product Hims recommends first for which patient, and whether the 11 anonymous answers influence it. No recommendation was seen for anyone.",
        "Whether the new platform still uses the old platform's tag system or its oral-or-topical preference question (rule R8, question men-m3).",
        "The order of the screens after the wall, and whether Hims UK hair is set up the way the shared platform code allows (rule R31).",
        "The prices charged at the new checkout. Hims plan prices come from the old shop's price table; Hers plan prices beyond 'from £13' and 'from £20' a month are unknown; the Hers vitamins-only product and Regaine foam have no public price.",
        "The Hers questionnaire. Six stored answers are known from the code that plays them back; the question wording, the full option lists and all medical questions are unknown.",
        "Vitamin strengths in the Hims chews (older help centre only), the strength of the Hims minoxidil serum (5% in most places, 6% in one field), and the biotin strength in the Hers serum.",
        "Whether a product code in the entry address (gst=…) pre-selects that product after sign-up.",
        "The old site's 5% experiment 'exp-2026-previous-hl-treatment': one more fresh visit was in the control group; the test arm was never seen.",
        "About 327 of the app's 453 code files were not read. The 126 that were read include nearly every file whose name points to hair, quizzes, treatment, consent or rejection.",
        "The archived copy of the old consultation (10 June 2026) is still unread: the archive site is unreachable from here.",
        "Review quotes were read through a page-summary tool, not from raw page text.",
        "What happens to stored quiz answers after the 7 days stated on the first screen.",
    ],
    'verdict': "The part of this report that can be watched from outside is solid. The anonymous Hims quiz was mapped completely, every option was tested by stage 2, and an independent reviewer got the same result from fresh browsers: 11 questions, one fixed path, no stop, no warning, no product, no price, then an email wall; Hers has no anonymous step at all. Those findings carry the label 'observed' and each one names its run folder. The product catalogue is also reliable for names, forms and strengths (checked on live pages and in the app's served files), and reasonably reliable for prices, with the caveat that most Hims prices come from one embedded price table of the old shop. The part a competitor most wants, how medical answers decide which product is offered, could not be observed within the research rules. What the report says about it is honestly labelled: the mechanics (the server marks each product eligible or not, names one as the recommendation, greys out the rest, or rejects outright) are read from served code and are trustworthy as a description of the code; the content of the rules (which answer removes which product) rests on leaflets, help pages and reasoning, and should be treated as informed expectation, not fact. Read with those labels in mind, the report can be trusted. It is rated 'partial' only because the engine behind the wall remains unseen.",
}
