# -*- coding: utf-8 -*-
"""Hand-written text for stage 2 (EXPERIMENT) of the Hims UK report.
Imported by scripts/stage2_update.py. Every claim carries its evidence label:
observed (a run folder), code (a served file), docs (a public page) or inferred.
"""

# --------------------------------------------------------------------------------------
# Anonymous questions: purpose, role, and the summary line the baseline answer produces
# --------------------------------------------------------------------------------------
ANON = {
    'men-q1': dict(role='marketing', baseLine=None,
        purpose="Sorts the visitor by intent: has he noticed hair loss yet, and is he browsing or ready to buy. It works like lead scoring for marketing. Stored as 'intentHairlossGoals' and never shown back. The screen also carries the consent line: 'By starting the assessment, you agree we can save your answers for 7 days, including health information.'",
        branchExtra="'No hair loss yet' and 'None of the above' are not stops."),
    'men-q2': dict(role='diagnosis', baseLine='Along the hairline',
        purpose="Rough pattern of loss, with a picture for each choice: hairline, top, all over. There is no choice for patchy loss or for loss elsewhere (beard, eyebrows, body). Stored as 'intentHairlossNoticing' and shown back as the first line of the summary screen.",
        branchExtra="Only the summary line changes."),
    'men-q3': dict(role='diagnosis', baseLine=None,
        purpose="Rough severity: a lot, some or a little. Stored as 'intentHairlossAmount'. Never shown back, and it changes nothing before the wall."),
    'men-q4': dict(role='diagnosis', baseLine='Noticed: Over a year ago',
        purpose="How long ago the loss started: a clue to slow pattern loss versus recent shedding. Stored as 'intentHairlossNoticedChanges' and shown back as 'Noticed: …'. A recent start ('In the past few months') does not bring a warning or an extra question.",
        branchExtra="Only the summary line changes."),
    'men-q5': dict(role='personalisation', baseLine=None,
        purpose="The results he hopes for. Several boxes can be ticked and at least one is required (the Continue button stays greyed out until a box is ticked). Stored as a list under 'intentHairlossDesiredResults'. Never shown back before the wall. Behind the wall each product page has a line 'Selected based on your goals:' followed by chips, but in the served code those chips are fixed text for each product, not built from this answer.",
        branchExtra="'All of the above' is sent as the single value ALL and leaves the other boxes unticked; two ticks are sent as a list of two. Neither changes a later screen."),
    'men-q6': dict(role='data-capture', baseLine=None,
        purpose="Hair type. Stored as 'intentHairlossHairType'. Never shown back. It reads as routine and marketing data. 'I don’t have hair' is the only choice with a possible clinical meaning (the leaflets exclude total baldness) and it changes nothing."),
    'men-q7': dict(role='personalisation', baseLine=None,
        purpose="Hair length. Stored as 'intentHairlossLength'. Never shown back. It could help choose between spray, serum and tablets (three leaflets say not to use the product on a shaved scalp), but no such effect is visible before the wall."),
    'men-q8': dict(role='diagnosis', baseLine='Family history: Yes',
        purpose="Family history supports a diagnosis of hereditary (pattern) hair loss; a 'Why we ask' note on the screen says so. Stored as 'hairLossFamilyHistory': the only anonymous answer without the 'intent' prefix, and the same key the Hers quiz uses, so it is the answer most likely to be reused in the medical record. Shown back as 'Family history: …'.",
        branchExtra="Only the summary line changes."),
    'men-q9': dict(role='diagnosis', baseLine='Stress: Sometimes',
        purpose="Stress as a cause of temporary shedding (telogen effluvium), explained in a 'Why we ask' note. Stored as 'intentHairlossStress' and shown back as 'Stress: …'. Even 'All the time' leads to the same 'Great news' message.",
        branchExtra="Only the summary line changes."),
    'men-q10': dict(role='personalisation', baseLine='No styling I let my hair do its thing',
        purpose="Styling habits. The screen before it says the answers 'help determine which treatment types best fit into your day-to-day'. Stored as 'intentHairlossStyling' and shown back under 'Hair routine'. No treatment type is shown or changed before the wall.",
        branchExtra="Only the summary line changes."),
    'men-q11': dict(role='personalisation', baseLine='Less than 5 minutes routine',
        purpose="Time spent on hair each day. It sets up the line 'We offer treatments that are quick, simple, and work with your routine.' Stored as 'intentHairlossTimeCaring' and shown back as '… routine'.",
        branchExtra="Only the summary line changes."),
}

# Extra context for single options (kept short; the leaflet wording is quoted from Hims's own safety information)
OPTION_NOTES = {
    ('men-q1', 'No hair loss yet, want to get ahead of it'): "Not a stop and no warning: a man who says he has no hair loss yet is still told 'Great news'.",
    ('men-q1', 'None of the above'): "Not a stop and no warning.",
    ('men-q2', 'All over'): "No warning and no extra question (for example about how quickly it happened).",
    ('men-q4', 'In the past few months'): "No warning and no extra question, although Hims's compounded product leaflets say not to use them for 'hair loss that is sudden and unexpected'.",
    ('men-q6', 'I don’t have hair'): "No warning, although the leaflets say not to use the products with 'total baldness'.",
    ('men-q7', 'Buzzed, shaved, or bald'): "No warning, although the leaflets for the 4-in-1 spray, the combination serum and Regaine say not to use them on 'a shaved scalp'.",
    ('men-q8', 'No'): "No warning. (The Regaine leaflet says not to use it if 'you are not sure if your hair loss is hereditary'.)",
    ('men-q8', 'Not sure'): "No warning. (The Regaine leaflet says not to use it if 'you are not sure if your hair loss is hereditary'.)",
    ('men-q9', 'All the time'): "No warning, although the screen's own 'Why we ask' note says stress can cause temporary hair loss.",
    ('men-q5', 'All of the above'): "It has to stand alone: ticking it clears any other tick (runs/exp-33).",
    ('men-q10', 'Hat'): "The topical leaflets say to let the product dry for 5 to 10 minutes before wearing a hat, so this answer could sensibly point towards tablets or chews; no such effect is visible (an inferred link, not seen).",
    ('men-q10', 'Products'): "The topical leaflets say styling products can be used once the treatment has soaked in; no effect is visible.",
}

# --------------------------------------------------------------------------------------
# Products: when the consultation offers each one
# --------------------------------------------------------------------------------------
_PRE = "Not offered or priced before the account wall, whatever is answered (observed in every run). "
_HERO = " Which answers make it the first-shown product is unknown."
RECOMMENDED_WHEN = {
    'p1': _PRE + "After sign-up it is a card in 'Topical Treatments' and can be chosen by any man the server marks eligible for it (code). Its own leaflet rules it out if he is under 18, already takes oral finasteride or dutasteride, has chronic liver disease, has had breast or prostate cancer, or is allergic to an ingredient; it gives no upper age limit (docs)." + _HERO,
    'p2': _PRE + "After sign-up it is the first card in 'Topical Treatments' (code). The old consultation gave it its own screen before the recommendation and the site flag 'show-premium-spray-in-hl' is switched on, so it is the topical Hims pushes hardest (code). Its leaflet rules it out if he is under 18 or over 65, already takes finasteride or dutasteride, has sudden, medicine-caused or total hair loss, has a shaved scalp or a scalp condition such as psoriasis or sunburn, or is allergic to finasteride, minoxidil, ketoconazole or biotin (docs)." + _HERO,
    'p3': _PRE + "After sign-up it is the third card in 'Topical Treatments' (code). Leaflet exclusions are the same as the 4-in-1 spray without the ketoconazole and biotin allergy line: under 18 or over 65, already on finasteride or dutasteride, sudden, medicine-caused or total hair loss, shaved scalp, scalp condition, allergy (docs). Its link code (gst=KgktFDR2) made no difference to the quiz when tested (observed, runs/gst0)." + _HERO,
    'p4': _PRE + "After sign-up it is the first card in 'Oral Treatments' (code); the old consultation gave it its own screen ('Fuel regrowth with a nutrient boost'). Its leaflet rules it out if he is under 18 or over 65, already takes minoxidil (for blood pressure or anything else), already takes finasteride or dutasteride, has sudden, medicine-caused or total hair loss, has an adrenal gland tumour, or is allergic to an ingredient. It says to talk to a clinician first with heart disease, blood-pressure medicines that widen blood vessels, or a planned PSA blood test (docs)." + _HERO,
    'p5': _PRE + "After sign-up it is the second card in 'Oral Treatments' (code). Leaflet exclusions: under 18 or over 65, already taking minoxidil, sudden, medicine-caused or total hair loss, adrenal gland tumour, allergy; talk to a clinician first with heart disease or blood-pressure medicines that widen blood vessels (docs). As the tablet without finasteride it is the natural fallback when finasteride is ruled out (inferred, not seen).",
    'p6': _PRE + "After sign-up it is the third card in 'Oral Treatments' (code). It contains no medicine, so it is the natural last fallback when both finasteride and minoxidil are ruled out (inferred, not seen). The old platform gave it no exclusion tags at all (code).",
    'p7': _PRE + "After sign-up it is the fourth card in 'Oral Treatments', badge 'Generic Treatment' (code). Its leaflet has no upper age limit and no heart or blood-pressure warnings, so it is the likely option for men who cannot have minoxidil or are aged 66 to 75 (inferred). Leaflet: do not take if allergic; tell the clinician about prostate or liver problems (docs). It contains lactose and the old platform tagged it 'lactose-tablet', so an answer about lactose could remove it (the tag is in code; the question was not seen).",
    'p8': _PRE + "After sign-up it is the fourth card in 'Topical Treatments', badge 'Generic Treatment' (code). Leaflet: for men aged 18 to 65; not with an allergy to minoxidil (docs). It is the topical without finasteride, and it is free of alcohol and propylene glycol, so it is the natural fallback when finasteride is ruled out (inferred, not seen).",
    'p9': _PRE + "After sign-up it is the only card in 'Combo Treatments' (code). It needs both finasteride tablets and the minoxidil serum to be suitable, so a rule against either removes it: the old platform gave it the tags finasteride, minoxidil, topical, lactose-tablet and finasteride-oral (code).",
    'p10': _PRE + "After sign-up it is the last card in 'Topical Treatments' (code). Its leaflet has the longest exclusion list of the range: under 18 or over 65; high blood pressure, even if untreated; not sure the hair loss is hereditary; sudden, medicine-caused or total hair loss; shaved scalp; scalp conditions; scalp creams such as dithranol, tretinoin, corticosteroids or petrolatum; a past reaction to minoxidil, ethanol or propylene glycol (docs). At £44 to £51 a month it is the dearest product, so it is unlikely to be the one shown first (inferred).",
    'h1': "Nothing is shown before sign-in: the first Hers screen asks for a name (observed, runs/exp-35-hers-replay). After the quiz the server recommends one of five treatments; this pill carries the 'Most popular' badge and the clinical director's quote calls oral treatment 'our most popular option' (code). Which answers make it the recommended one is unknown. Not for use in pregnancy, while breastfeeding or when planning to try for a baby in the next month (docs).",
    'h2': "Nothing is shown before sign-in (observed). One of the five treatments the server can recommend; positioned for women who would rather not swallow a pill (quote in app code). Rules unknown. Not for pregnancy, breastfeeding or trying to conceive (docs).",
    'h3': "Nothing is shown before sign-in (observed). One of the five treatments the server can recommend; positioned for women who prefer to treat only the affected area (code). It is the only prescription option that is not taken by mouth, so it is the likely choice when oral minoxidil is unsuitable (inferred). Rules unknown.",
    'h4': "Nothing is shown before sign-in (observed). One of the five treatments the server can recommend; positioned for hormone-driven loss ('female pattern hair loss, menopause, PCOS, and postpartum shedding' in the app quote). Spironolactone must not be taken in pregnancy, so the pregnancy and contraception answers matter most for this one (inferred). Rules unknown.",
    'h5': "Nothing is shown before sign-in (observed). One of the five treatments in the app's list. It contains no medicine, so it is plausibly what is left when minoxidil is not suitable (inferred).",
    'h6': "unknown. Shown on the public Hers hair pages, but it is not among the five treatments in the app's recommendation code, so it may not be offered through the consultation at all.",
}

PRODUCT_PATCHES = {}

EXTRA_BLOCKERS = [
    "archive.ph and the Common Crawl index were also unreachable from this environment (stage 2), so no archived copy of the old consultation could be read",
    "The old Hims UK help centre (himsuk.zendesk.com) shows a bot check to plain downloads",
]

EXTRA_SOURCES = [
    {"title": "Hims UK reviews on Trustpilot (TrustScore 4.1 from 123 reviews on 23 November 2026; read through a page-summary tool)", "url": "https://uk.trustpilot.com/review/www.forhims.co.uk"},
    {"title": "Hims UK safety information: topical finasteride and minoxidil spray", "url": "https://www.forhims.co.uk/safety-information/topical-finasteride-and-minoxidil-spray"},
    {"title": "Hims UK safety information: minoxidil Hair Hybrid chew", "url": "https://www.forhims.co.uk/safety-information/minoxidil-hair-hybrid"},
    {"title": "Hims UK safety information: finasteride and minoxidil Hair Hybrid tablet", "url": "https://www.forhims.co.uk/safety-information/finasteride-and-minoxidil-hair-hybrid"},
    {"title": "Third-party review of Hims UK (older prices; last updated 3 February 2025)", "url": "https://finvsfin.com/hims-uk-review-is-it-legit/"},
    {"title": "Press: Hers launches personalised hair loss treatment service for women (UK)", "url": "https://www.yorkshirepost.co.uk/must-read/hers-launches-personalised-hair-loss-treatment-service-for-women-9287470"},
]

# --------------------------------------------------------------------------------------
# Rules
# --------------------------------------------------------------------------------------
ALL_MEN = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10']

def build_rules(old, ctx):
    R = []
    def add(id, flow, when, then, effectType, affects, evidence, proof, confidence):
        R.append(dict(id=id, flow=flow, when=when, then=then, effectType=effectType, affects=affects, evidence=evidence, proof=proof, confidence=confidence))
    def keep(id, **patch):
        r = dict(old[id]); r.update(patch); R.append(r)

    # ---- what was watched live (anonymous quiz) ----
    add('R1', 'men', "any one anonymous answer is changed (each of the 31 non-baseline options of men-q1 to men-q11, one at a time)",
        "Nothing in the engine changes before the wall: the same 21 screens in the same order, the same server-chosen next step after every answer, the same 'Great news—we have options that may work for you', and the same email wall. No answer stops the visitor, adds or removes a question, shows a warning, or shows or hides a product, strength, plan or price.",
        'none', [], 'observed',
        "runs/exp-01 to runs/exp-31 against runs/exp-00-baseline-full (%d of %d one-change runs were identical apart from at most one summary line); also runs/map-opposite-path (all 11 answers changed at once). Agrees with the served definition: 21 steps, 20 branches with no conditions (quiz-definition.json)." % (ctx['n_clean'], ctx['n_index']),
        'high')
    add('R20', 'men', "men-q2 (where), men-q4 (when), men-q8 (family history), men-q9 (stress), men-q10 (styling) or men-q11 (time) is changed",
        "One line of the screen 'Here’s what we know about your hair so far' repeats the new answer. That is the only visible use of any answer in the anonymous quiz.",
        'marketing-only', [], 'observed', "Summary screen (step 17) in: " + ctx['playback_runs'] + ". Code: the summary step lists exactly these six answers (answerSummaryBlocks in quiz-definition.raw.json).", 'high')
    add('R21', 'men', "men-q1 (intent), men-q3 (how much hair lost), men-q5 (results hoped for), men-q6 (hair type) or men-q7 (hair length) is changed",
        "No visible difference on any screen. The answer is posted to the server and never shown back to the visitor.",
        'none', [], 'observed', "Identical wording on every screen in: " + ctx['silent_runs'] + ".", 'high')
    add('R22', 'men', "a 'warning sign' answer is given: 'No hair loss yet', 'None of the above', loss 'All over', started 'In the past few months', 'I don’t have hair', 'Buzzed, shaved, or bald', family history 'No' or 'Not sure', stress 'All the time'",
        "No warning, no extra question and no stop: the visitor still sees 'Great news—we have options that may work for you' and the sign-up screen. Hims's own leaflets exclude sudden hair loss and total baldness, and three topical leaflets exclude a shaved scalp, so any screening for these can only happen after sign-up.",
        'none', [], 'observed', "runs/exp-03, runs/exp-04, runs/exp-06, runs/exp-10, runs/exp-18, runs/exp-19, runs/exp-22, runs/exp-23, runs/exp-25; leaflet wording in raw/hair-products-contentful.txt", 'high')
    R.extend(MULTI_RULES)
    add('R24', 'men', "the last anonymous screen is reached",
        "After 5 seconds the browser tells the server the quiz is finished. The server's reply holds only a record id: no eligibility result, no product and no price. The browser then opens the sign-up page, which asks for an email address.",
        'none', [], 'observed', "runs/exp-00-baseline-full/network.jsonl and net/ (21 'submit step' posts, each answered with the next step; the last answered 'no next step'; then one 'submit flow' post answered with an id only). Same in every one-change run.", 'high')
    R.extend(EXTRA_OBSERVED_RULES)
    add('R28', 'men', "a visitor who took the quiz then signs up",
        "The app sends the quiz's guest token to the server ('claim flow response'), which attaches the stored answers to the new account. So the server's rules and the clinician can see them. Nothing in the public code shows them changing a product, and the product pages do not use them.",
        'unknown', [], 'code', "raw/app/chunks/start-confirm-C2IJvpqe.js (mutation ClaimFlowResponse; storage keys anonymous_flow_completed_guest_token and anonymous_flow_guest_token, both seen in runs/exp-00-baseline-full/storage.json)", 'medium')
    add('R29', 'men', "any anonymous visitor opens the quiz",
        "He gets the same quiz version as everyone else. The site asks its feature-flag service for settings under one shared visitor name ('anonymous'), so it cannot show different visitors different versions of the quiz before sign-in.",
        'none', [], 'observed', "The feature-flag request in every run, for example runs/exp-00-baseline-full/network.jsonl (visitor context: key 'anonymous', brand 'hims-uk'); scripts/flag_diff.py found all 949 settings identical in 41 fresh browsers and the same quiz version (a9a88e4a-…) in all 40 quiz runs", 'high')

    # ---- behind the wall: age and sex ----
    keep('R2'); keep('R3')
    keep('R4', then="Most of the range is labelled for ages 18 to 65: the 4-in-1 spray, the combination serum, both chews, the minoxidil serum (so also the combo kit) and Regaine. The 2-in-1 spray and finasteride tablets give no upper age in their leaflets, so those are what is most likely left. Not seen.",
         affects=['p2', 'p3', 'p4', 'p5', 'p8', 'p9', 'p10'],
         proof="Leaflet wording 'Do not use … if you are younger than 18 years or older than 65 years' (4-in-1 spray, serum, both chews), 'suitable for most men aged 18-65' (minoxidil serum) and 'under the age of 18 or over the age of 65' (Regaine) in raw/hair-products-contentful.txt; the 2-in-1 spray leaflet only says 'younger than 18' and the finasteride tablet leaflet gives no age")
    keep('R5')

    # ---- behind the wall: how the server's result is used ----
    keep('R6', proof=old['R6']['proof'] + "; the query is in use-hims-uk-hair-purchase-options-RTx4GHla.js: a product is greyed out when its default plan comes back with eligible = false")
    keep('R7', when="the server's evaluation of the medical questionnaire comes back 'not eligible'",
         then="The patient is sent to the rejection screen: 'This treatment may not be suitable … we’re unable to offer a Hims treatment that’s clinically appropriate under our prescribing guidelines'. This screen has no 'try again' button, only 'Back home' and a link to contact the care team. Which answers cause it is not public.",
         proof="raw/app/chunks/triage-complete-BpNWh0fs.js (any questionnaire with triageEvaluation.isNotEligible sends the browser to /triage/…/rejected); raw/app/chunks/rejected-screen-COWSDWyl.js", confidence='medium')
    add('R30', 'men', "the medical questionnaire has been scored and the patient passed",
        "He is shown one 'hero' product: the one the server names as recommended; if it names none, the server's default; if none, the first in the list. The other products are one tap away ('Explore other treatment options').",
        'product-added', ALL_MEN, 'code', "raw/app/chunks/use-hims-uk-hair-purchase-options-RTx4GHla.js (hero = product holding recommendedPreset, else defaultPreset, else first)", 'high')
    R.extend(PRESELECT_RULES)
    add('R32', 'men', "a product page is shown after sign-up",
        "The line 'Selected based on your goals:' and its chips are fixed text for each product (for example the spray always shows 'Stop hair loss' and 'Regrow hair'). They are not built from the goals the visitor ticked in the quiz.",
        'marketing-only', ALL_MEN, 'code', "raw/app/chunks/fixture-*.js (chipsLabel and chips are constants; every chip has matchesPreference: false and no served code reads that field)", 'high')
    add('R33', 'men', "the patient reaches the consent screen of a hair consultation",
        "He must tick one box ('I confirm I have read and understand the information provided and consent to this treatment') under five statements: his answers are accurate; he will be the only user; he will stop and tell the clinicians 'if I become pregnant, plan to conceive in the next 3 months, or experience any changes to my medical or medication history'; he understands the medicine 'may be compounded and prescribed off-label when clinically appropriate'; and he has read the treatment plan and patient guide. The wording is shared with the women's service.",
        'soft-warning', ALL_MEN, 'code', "raw/app/chunks/treatment-consent-Cks2UHMm.js (hair-specific wording; shared platform screen at /treatment-consent, not seen live)", 'medium')
    keep('R16')

    # ---- behind the wall: what the leaflets say must be screened (the engine's action was not seen) ----
    keep('R8'); keep('R9'); keep('R10'); keep('R11')
    keep('R12', proof=old['R12']['proof'] + "; the older help centre adds that people with 'alopecia areata, telogen effluvium, hair loss as a result of illness/chemotherapy or other scalp conditions such as psoriasis - are not suitable for these treatments' (https://himsuk.zendesk.com/hc/en-us/articles/16593840790555-can-i-use-these-products-to-treat-other-types-of-hair-loss)")
    keep('R13', then="Topical products must not be used, according to the leaflets for the 4-in-1 spray, the combination serum and Regaine. (The anonymous quiz asks hair length, including 'Buzzed, shaved, or bald', but shows no reaction to it: runs/exp-19.)")
    keep('R14')
    keep('R15', proof=old['R15']['proof'] + "; the 2-in-1 spray's product text says 'If your partner is currently pregnant, trying to become pregnant, or breastfeeding, Finasteride should be avoided'; consent wording in raw/app/chunks/treatment-consent-Cks2UHMm.js ('plan to conceive in the next 3 months')")
    add('R34', 'men', "high blood pressure, even if untreated",
        "Regaine's leaflet says do not use. The other minoxidil products only say to talk to a clinician about heart disease and blood-pressure medicines that widen blood vessels. Expect Regaine to be removed and oral minoxidil to be flagged. The engine's action was not seen.",
        'product-removed', ['p10'], 'docs', "Regaine safety information in raw/hair-products-contentful.txt ('You have high blood pressure, even if it is not being treated')", 'low')
    add('R35', 'men', "allergy or past bad reaction to an ingredient",
        "That product is excluded by its own leaflet: minoxidil allergy rules out every minoxidil product; finasteride allergy every finasteride product; ketoconazole or biotin allergy the 4-in-1 spray; ethanol or propylene glycol reaction Regaine (the Hims minoxidil serum contains neither). The engine's action was not seen.",
        'product-removed', ['p1', 'p2', 'p3', 'p4', 'p5', 'p7', 'p8', 'p9', 'p10'], 'docs', "'Do not use' lists in raw/hair-products-contentful.txt", 'low')
    add('R36', 'men', "lactose intolerance (question not seen)",
        "The old platform tagged finasteride tablets and the combo kit 'lactose-tablet'. A tag like that only has a use if some answer could exclude it, so a lactose question probably removed those two products and left the compounded range. Not confirmed on the new platform.",
        'product-removed', ['p7', 'p9'], 'inferred', "Product tags in raw/contentful-products.slim.json and the tag engine in raw/www-js/hims.modern.818.*.js; the finasteride leaflet says the tablets contain lactose", 'low')
    add('R37', 'men', "using scalp creams or ointments (corticosteroids, tretinoin, dithranol, petrolatum)",
        "Regaine's leaflet says do not use; the 4-in-1 spray and serum leaflets say talk to a clinician first because these can speed up absorption. Expect a flag or a move to tablets. The engine's action was not seen.",
        'flag-for-clinician', ['p2', 'p3', 'p10'], 'docs', "raw/hair-products-contentful.txt", 'low')

    # ---- women (Hers UK) ----
    add('R38', 'women', "any woman opens the Hers UK hair consultation",
        "The first screen asks for her first and last name. No question can be answered without giving personal details, so no answer could be varied.",
        'none', [], 'observed', "runs/exp-35-hers-replay and runs/baseline-women; code: the site's list of anonymous quizzes has no hair entry for the Hers brand", 'high')
    keep('R17'); keep('R18'); keep('R19')
    return R

# --------------------------------------------------------------------------------------
# Summaries
# --------------------------------------------------------------------------------------
ENGINE_SUMMARY = (
    "Hims UK's engine has two parts, and only the first can be watched from outside. "
    "Part one is a marketing quiz anyone can take: 11 questions (intent, where, how much, when, goals, hair type, hair length, family history, stress, styling, time) with 10 selling screens between them. "
    "Stage 2 changed every answer one at a time (31 replays covering all 42 options) and the engine did not move: same screens, same order, same 'Great news—we have options that may work for you', same email wall. "
    "Six answers are repeated on one summary screen; the other five are never shown again. No answer stops anyone, warns anyone, or shows a product, strength or price. "
    "The server traffic agrees: after each answer the server names the next step, and at the end it returns a record id and nothing else. If the visitor signs up, his stored answers are attached to the new account. "
    "Part two sits behind the account: date of birth, a medical questionnaire, then a server-side rules step that marks each of ten products eligible or not and names one as the recommendation. "
    "A patient the server calls 'not eligible' sees a rejection screen. Everyone else sees one recommended product, with the other nine a tap away and the ruled-out ones greyed out as 'Not available based on your medical history'. "
    "The 'Selected based on your goals' chips on each product page are fixed text, not built from his answers. He then picks a plan length, ticks a consent box, gives GP details and pays up front; a clinician reviews the answers without a call and approves or refunds. "
    "The wording of the medical questions and the answer-to-product rules are not public. The best guides to them are Hims's own leaflets (who must not use each product) and the old platform's tag system, in which an answer could exclude every product tagged 'finasteride', 'minoxidil-oral', 'topical' and so on. "
    "Hers UK runs on the same platform with five minoxidil-based treatments for women, but asks for a name on the first screen, so nothing there can be tested without an account."
)

STRENGTHS = [
    "A wide compounded range: two finasteride + minoxidil sprays (one with ketoconazole and biotin), a serum, and once-daily chews that combine oral finasteride 1.1 mg, oral minoxidil 3 mg and vitamins",
    "A fallback for almost every exclusion: without finasteride (minoxidil chew, minoxidil serum, Regaine), without minoxidil (finasteride tablets), without any medicine (supplement chew), so few paying customers leave with nothing",
    "A quiz with no friction and no dead ends: one tap per question, pictures, 'Why we ask' notes, and every one of the 42 answers leads to the sign-up screen, so no lead is lost before the email is captured",
    "It feels personal at low cost: one summary screen repeats six answers back, and the saved answers are attached to his account if he signs up",
    "Low headline price on long plans (£16.50 a month for spray, serum or chew on a 6-month plan), free delivery, full refund if the clinician does not approve",
    "No clinician call needed for hair: the whole thing is a form, reviewed afterwards",
    "The regulated set-up is clearly stated: CQC-registered provider, named GPhC pharmacies, a specialist compounding pharmacy, and a consent step that says in plain words the medicine may be compounded and off-label",
    "Good public reviews overall: Trustpilot 4.1 from 123 reviews on the day of the check (all Hims UK services), with recent reviewers calling the questions 'easy to follow' and the company 'thorough with questions'; 4.4 from 1,913 reviews on Hims's own hair pages",
]

WEAKNESSES = [
    "The 'free hair quiz' is not a consultation. All 42 answers were tested and none changes anything: a man with no hair loss yet, no hair at all, or loss 'all over' that began 'in the past few months' gets the same 'Great news—we have options that may work for you' as a textbook case. Hims itself says 'The quiz is not a medical assessment'",
    "It gives nothing back: 21 screens, then an email wall, with no result, no product, no strength and no price shown first",
    "What it never asks before the wall: age, sex, medical conditions, medicines, allergies, blood pressure, mood, sexual function, plans for children, earlier treatments and their side effects, scalp symptoms (itch, pain, scale, redness), patchy loss, how fast the loss came on. There is no photo step in the quiz",
    "The personal touch is thin: five of the eleven answers are never shown again, and the 'Selected based on your goals' line on each product page is fixed text, not the visitor's own goals",
    "No early warning: answers that Hims's own leaflets treat as reasons not to use a product (sudden loss, total baldness, shaved scalp) pass without comment, so those men can only find out after giving their details",
    "Prices are hidden until late and the cheap figure needs 6 or 12 months paid up front (for example £99 or £276); the monthly chew plan is £60. One Trustpilot reviewer (November 2025) reports being 'Auto renewed at 43% more with no advance notice'",
    "Its flagship products are unlicensed compounded medicines in one fixed strength each (topical finasteride 0.3% with minoxidil 6% or 7%; a chew with finasteride 1.1 mg and minoxidil 3 mg), so one ingredient cannot be lowered or stopped without changing the whole product",
    "Gaps in the range: no dutasteride, no lower-strength topical finasteride, no oral minoxidil in adjustable doses, no shampoo or scalp care (its own shampoo is withdrawn), no devices, and no blood tests for causes of hair loss in the men's hair range",
    "The public pages do not say a photo is needed for hair (the terms only say 'You may be asked to upload photographs for assessment'), so the diagnosis seems to rest mainly on tick-boxes",
    "Cancelling is by message to support with a cut-off before the next order (the help centre says 48 hours, the terms say three days). Self-service cancelling is switched off in the app's settings for this brand, and changing a hair treatment plan also goes through support",
    "Men only on Hims; women are sent to a separate brand with a separate account and no anonymous quiz at all. Men over 65 are outside the labelled age range of seven of the ten products, and new customers over 75 are not treated",
    "The platform move (to Fill Function / Eucalyptus) leaves loose ends: product links whose code appears to do nothing, a dead hair subdomain, and card badges such as 'Generic Treatment' on Regaine",
    "Product quality complaints: three of the five newest reviews on Hims's own combo-kit page (10 to 20 November 2026) report spray pumps that stopped working",
]

OPPORTUNITIES = [
    "Give a real answer before asking for contact details: likely pattern, which treatments fit, which are ruled out and why, and the price. Hims asks 11 questions and returns nothing",
    "Make the quiz respond. Not one of Hims's 42 options changes anything on screen. React at once: sudden or patchy loss → 'see a GP first'; shaved head or a hat every day → suggest tablets; heavy stress with no family history → explain shedding and offer a blood test",
    "Ask the safety questions early (blood pressure, heart, mood, fertility plans, current medicines) and say in plain words when and why a product is ruled out, instead of a greyed-out card after sign-up",
    "Use photos and a clinician's eye to tell pattern loss from shedding, patchy or scarring loss, which a tick-box quiz cannot do",
    "Offer adjustable strengths and separate ingredients (for example a lower-strength topical finasteride, oral minoxidil in steps), so a side effect means changing one thing rather than the whole product",
    "Fill the gaps in Hims's range: dutasteride for men who do not respond to finasteride, medicated shampoo and scalp care, blood tests for common causes (iron, thyroid, vitamin D), and a clear option for men over 65",
    "Show real personalisation: let the patient see his own answers driving the plan, where Hims shows fixed 'Selected based on your goals' chips",
    "Price honestly: the monthly price up front, a true monthly plan, a reminder before any renewal price change, and self-service pause and cancel",
    "Treat men and women in one service with one account, and give women the same try-before-you-sign-up quiz that Hers UK lacks",
    "Build the plan around measured progress (standard photos at 0, 3 and 6 months) with a money-back promise for men too; Hers has a 180-day guarantee, Hims has none for hair",
]

# --------------------------------------------------------------------------------------
# Recommendations: what is offered at the end
# --------------------------------------------------------------------------------------
RECOMMENDATIONS = [
    {"profile": "Baseline man: 32, receding hairline, some loss, began over a year ago, family history yes, wants thicker hair, no medical issues (anonymous quiz, watched live)",
     "offered": [], "default": None,
     "note": "Nothing is offered. End state in runs/exp-00-baseline-replay and runs/exp-00-baseline-full: the fixed message 'Great news—we have options that may work for you', a summary of six of his answers, four general marketing screens about finasteride and minoxidil, then 'Ready to see if you’re eligible?' with an email field (the account wall). No product is recommended and no strength, plan or price is shown. The quiz never asks his age, sex or medical history.",
     "evidence": "observed"},
    {"profile": "Every other man tested in the anonymous quiz: each of the 31 other answers one at a time, all 11 changed at once, two goals ticked, 'All of the above', and the phone layout",
     "offered": [], "default": None,
     "note": "Exactly the same end state as the baseline man in every run (runs/exp-01 to runs/exp-34-mobile, runs/map-opposite-path). Before the wall there is only one outcome.",
     "evidence": "observed"},
    {"profile": "Man who signs up and passes the medical questionnaire (from served code, not seen live)",
     "offered": ALL_MEN, "default": None,
     "note": "The server marks each of the ten products eligible or not and names one as the recommendation. The page shows that one first with 'Continue with this plan', and the other nine under 'Explore other treatment options', grouped Oral, Topical and Combo. Which product is named for which answers was not seen. Plan lengths in the price table: 3 or 6 months for the sprays, serum and chews (the chews also monthly); 3, 6 or 12 months for finasteride tablets, minoxidil serum, combo kit and Regaine. Prices run from £16.50 a month (spray, serum or chew on 6 months) to £44 a month (Regaine on 12 months).",
     "evidence": "code"},
    {"profile": "Man who cannot have finasteride, for example already taking finasteride or dutasteride, or with a partner who is pregnant or trying (from leaflets; the engine's action was not seen)",
     "offered": ["p5", "p8", "p10", "p6"], "default": None,
     "note": "Inferred from the leaflets and the old tag system: every product containing finasteride would be greyed out, leaving the minoxidil chew, the minoxidil serum, Regaine and the supplement chew.",
     "evidence": "inferred"},
    {"profile": "Man who cannot have minoxidil, for example already taking minoxidil for blood pressure or allergic to it (from leaflets; not seen)",
     "offered": ["p7", "p6"], "default": None,
     "note": "Inferred: every product containing minoxidil would be greyed out, leaving finasteride tablets and the supplement chew.",
     "evidence": "inferred"},
    {"profile": "Man aged 66 to 75 (from leaflets; not seen)",
     "offered": ["p1", "p7", "p6"], "default": None,
     "note": "Inferred: seven of the ten products are labelled for ages 18 to 65. The 2-in-1 spray and finasteride tablets give no upper age, and the supplement chew has no medicine in it. New customers over 75 are not treated at all (help centre).",
     "evidence": "inferred"},
    {"profile": "Man the server rules out completely (from served code; which answers cause it is not public)",
     "offered": [], "default": None,
     "note": "Rejection screen: 'This treatment may not be suitable … we’re unable to offer a Hims treatment that’s clinically appropriate under our prescribing guidelines', with 'Back home' and a contact link. Likely causes, from Hims's help centre and leaflets: under 18, over 75, sudden or patchy hair loss, total baldness, hair loss caused by a medicine.",
     "evidence": "code"},
    {"profile": "Baseline woman: 38, widening parting, gradual over about 2 years, not pregnant, no conditions (Hers UK, watched live)",
     "offered": [], "default": None,
     "note": "Nothing can be answered: the first screen asks for her first and last name (runs/exp-35-hers-replay, runs/baseline-women). No product or price is shown before sign-in, beyond 'from £13 a month' on the public pages.",
     "evidence": "observed"},
    {"profile": "Woman who signs up and passes the medical questions (from served code, not seen live)",
     "offered": ["h1", "h2", "h3", "h4", "h5"], "default": None,
     "note": "The server recommends one of five treatments under the line 'Your clinician may consider this as the most suitable treatment for your hair loss'; the pill carries the 'Most popular' badge. The others are listed under 'Select other treatment', with unsuitable ones greyed out as 'Treatment is not suitable based on your answers'. Which answers lead to which treatment was not seen.",
     "evidence": "code"},
]

# --------------------------------------------------------------------------------------
# Experiments written by hand (the 31 one-change runs are written by stage2_update.py)
# --------------------------------------------------------------------------------------
EXPERIMENTS_HEAD = [
    {"id": "exp-00-baseline-replay", "flow": "men", "changed": "nothing: the stage 1 baseline replayed with walk.js",
     "result": "The baseline still works: 21 anonymous screens, then the email wall at /start/signup?t=hair&anon_flow_key=hair. Every screen has the same wording as stage 1's runs/baseline-men. End state: no product, strength, plan or price; the fixed message 'Great news—we have options that may work for you'; a summary of six answers; then 'Ready to see if you’re eligible?' with an email field.",
     "run": "runs/exp-00-baseline-replay"},
    {"id": "exp-00-baseline-full", "flow": "men", "changed": "nothing: the baseline again, keeping every server reply (scripts/walk-full.js, a copy of walk.js that also saves small replies)",
     "result": "Same screens and same end. The full trace shows how the quiz talks to the server: 21 posts, one per screen, each answered with the id of the next step, which always matched the served branch table; the last was answered 'no next step'; a final 'submit flow' post was answered with a record id only. The server sent no eligibility result, product or price. This run is the comparison point for every one-change run.",
     "run": "runs/exp-00-baseline-full"},
]
MANUAL_RESULTS = {}

# --------------------------------------------------------------------------------------
# Rules that depend on the extra runs and the extra code files
# --------------------------------------------------------------------------------------
MULTI_RULES = [dict(id='R23', flow='men',
    when="men-q5 (results hoped for): no box ticked, 'All of the above', or several boxes",
    then="Continue stays greyed out until one box is ticked. 'All of the above' must stand alone: ticking it clears any other tick, and it is sent as the single value ALL. Two ordinary ticks are sent as a list of two. None of these changes any later screen.",
    effectType='none', affects=[], evidence='observed',
    proof="runs/exp-00-baseline-full/04.txt (Continue disabled), runs/exp-15 (ALL on its own), runs/exp-32 (two ticks sent as THICKER_HAIR + STOP_LOSS), runs/exp-33 (first tick cleared by 'All of the above'). Code: the brand setting flowExclusiveOptionValues lists ALL, NONE, NONE_OF_THE_ABOVE and UPDATED_NULL (raw/app/chunks/get-config-ChQNMk7O.js)",
    confidence='high')]

EXTRA_OBSERVED_RULES = [
    dict(id='R25', flow='men', when="the sign-up address is opened directly, without taking the quiz",
         then="The same 'Ready to see if you’re eligible?' email screen appears. The 21-screen quiz is optional: it is not needed to reach the wall, so it cannot be a gate for eligibility.",
         effectType='none', affects=[], evidence='observed', proof="runs/exp-36-skip-quiz", confidence='high'),
    dict(id='R26', flow='men', when="a visitor who has finished the quiz opens the quiz address again in the same browser",
         then="He is sent straight back to the sign-up email screen; the quiz does not start again. (To change his answers he would have to use 'Delete my answers' in the quiz's 'Your answers' menu, seen in stage 1.)",
         effectType='skip-questions', affects=[], evidence='observed', proof="runs/exp-38-return; menu seen in runs/misc1", confidence='high'),
    dict(id='R27', flow='men', when="the quiz is taken on a phone-sized screen, or started from another landing page or a product page",
         then="Same quiz. The phone layout shows the same 21 screens with the same wording and the same wall. Every 'Get started' button on the paid-search landing page and on the combo-kit shopping page points to /c/hl (the combo-kit button adds a product code, gst=s2hF6Mdn; the serum's code made no difference when followed in stage 1).",
         effectType='none', affects=[], evidence='observed', proof="runs/exp-34-mobile, runs/exp-37-entries (links read), runs/gst0", confidence='high'),
]

PRESELECT_RULES = [dict(id='R31', flow='men',
    when="a product was chosen before the questionnaire (the web address carries an 'offeringSelections' value, or one is saved in the browser)",
    then="Once the questionnaires are scored: if the chosen product is eligible, he skips the recommendation page and goes on to the remaining steps (GP details, then checkout); if it is not eligible, he is sent to 'Other treatment options'. With no product chosen he gets the recommendation page. This is the platform's logic for services that take payment after all questionnaires; whether Hims UK hair is set up that way was not seen.",
    effectType='product-switched', affects=ALL_MEN, evidence='code',
    proof="raw/app/chunks/skip-cp-next-step-DLh4EqTF.js, triage-complete-BpNWh0fs.js, preselection-utils-CS7YGF9o.js, use-hims-uk-hair-purchase-options-RTx4GHla.js",
    confidence='medium')]

# --------------------------------------------------------------------------------------
# Question patches and new questions (screens after the wall, read in code)
# --------------------------------------------------------------------------------------
_CONSENT_TEXT = ("Lastly, do you agree and consent to the following: 'If considered suitable, I will be prescribed and dispensed: {product}, {months} month plan' · "
    "'All information I have provided is accurate and truthful.' · 'I will be the sole user of the medication.' · "
    "'I will stop the medication and notify my clinicians if I become pregnant, plan to conceive in the next 3 months, or experience any changes to my medical or medication history.' · "
    "'I understand medication may be compounded and prescribed off-label when clinically appropriate.' · "
    "'I have read the information about the medication, safety, side effects, and alternatives provided in my treatment plan and patient guide.' "
    "[Tick box: 'I confirm I have read and understand the information provided and consent to this treatment'] [Button: Continue]")
_CONSENT_OPTION = {"label": "I confirm I have read and understand the information provided and consent to this treatment",
    "effect": "Records consent against the chosen product and plan, then returns to the questionnaire. Without the tick the patient cannot go on.",
    "effectType": "next-question", "affects": [], "evidence": "code"}

QUESTION_PATCHES = {
    'men-i5': dict(purpose="A staged 'Reviewing your responses now...' pause of about 2.5 seconds, then 'Great news—we have options that may work for you.' Both lines are fixed: they appeared word for word in every run, whatever was answered (31 one-change runs and the run with every answer changed).",
                   branchDetail="None: the same text for every answer (runs/exp-01 to runs/exp-31)."),
    'men-i6': dict(purpose="Plays six answers back (where, when noticed, family history, stress, styling, time) so the quiz feels personal. It is the only screen that any answer changes. The other five answers (intent, amount lost, goals, hair type, hair length) are not shown.",
                   branchDetail="The six lines follow the answers given (runs/exp-05, exp-06, exp-09 to exp-11 and exp-22 to exp-31). Nothing else on the screen changes."),
    'men-a1': dict(purpose="THE ACCOUNT WALL. An email address is required before any medical question, eligibility result, product or price is shown. It also gives Hims a lead to follow up (the platform's shared quiz-start text speaks of 'sending quiz complete reminders'). The same screen opens if the sign-up address is visited directly with no quiz answers (runs/exp-36-skip-quiz), and a visitor who has finished the quiz is brought back here if he opens the quiz again (runs/exp-38-return)."),
    'men-a2': dict(purpose="Legal name for the prescription and the identity check. The brand setting 'verifyIdentity' is switched on in the app's code, so identity is checked at some point; how and when was not seen."),
    'men-m2': dict(purpose="The safety screen that decides which products a man may have. Its questions are sent to the browser only after sign-in, so the wording could not be read. From served code: it is one or more questionnaires inside a 'triage session'; each is scored on the server, which sends back only 'evaluated' and 'not eligible' flags plus an eligible / not eligible mark for every product. One question key is visible in the app's settings: 'hairlossAllergiesDetailed', a tick-list about allergies whose choice 'NEITHER' must be ticked on its own. That points to a question naming two ingredients, most likely finasteride and minoxidil (inferred). Hims's leaflets show what else it must cover: sex and age; already taking finasteride, dutasteride or minoxidil; sudden, patchy, total or medicine-caused hair loss; scalp disease or shaved scalp; heart disease, blood pressure and blood-pressure medicines; liver disease; breast or prostate cancer history; a partner who is or may become pregnant; a planned PSA test; low mood."),
    'men-m4': dict(branchDetail="The hero is the product the server names as recommended; if it names none, the server's default; if none, the first in the list. Which answers lead to which hero was not seen. The chips after 'Selected based on your goals:' are fixed text for each product, not the visitor's own goals. A product chosen earlier (web-address value 'offeringSelections', or one saved in the browser) is honoured; if it is not eligible the patient is sent to 'Other treatment options'."),
}

NEW_QUESTIONS = {
    'men': [{
        "id": "men-m11", "order": 30.5, "stage": "after-account", "text": _CONSENT_TEXT, "type": "consent", "options": [_CONSENT_OPTION],
        "purpose": "Informed consent for an unlicensed, compounded medicine: the patient confirms his answers are true, that only he will use it, that he knows it may be compounded and prescribed off-label, and that he will stop and tell the clinicians if things change. The wording is shared by the men's and women's hair services, which is why it mentions becoming pregnant.",
        "engineRole": "consent", "branches": False, "branchDetail": "",
        "shownWhen": "after a product and plan have been chosen (the screen names them and is skipped when none is chosen). Shared platform screen at /treatment-consent, read in code, not seen live; its exact place in the Hims UK order is inferred",
        "evidence": "code"}],
    'women': [{
        "id": "women-q12", "order": 13.5, "stage": "after-account", "text": _CONSENT_TEXT, "type": "consent", "options": [_CONSENT_OPTION],
        "purpose": "The same consent screen as the men's service. For women the key line is the promise to stop and tell the clinicians 'if I become pregnant, plan to conceive in the next 3 months', which is stricter than the one month in the Hers help centre.",
        "engineRole": "consent", "branches": False, "branchDetail": "",
        "shownWhen": "after a treatment and plan have been chosen. Shared platform screen for hair consultations, read in code, not seen live; its exact place in the Hers order is inferred",
        "evidence": "code"}],
}

STAGES_SUMMARY = {
    'men': "21 anonymous screens (11 questions + 10 information screens; one fixed path, confirmed by replaying every option one at a time) → account wall (email, then name and password) → date of birth and medical questionnaire (not seen) → the server scores the answers → rejection screen, or one recommended product with the other nine on request and ineligible ones greyed out → plan length → consent tick-box → GP details, address, payment up front → clinician review → dispatch or refund",
}

EXPERIMENTS_TAIL = [
    {"id": "exp-32", "flow": "men", "changed": "men-q5: 'Visibly thicker, fuller hair' → 'Visibly thicker, fuller hair' and 'Keep the hair I have' (two boxes ticked)",
     "result": "Both boxes stay ticked and are sent as a list of two (THICKER_HAIR, STOP_LOSS). Every later screen has the same wording as the baseline, the server's next-step replies are the same, and the end is the same email wall.", "run": "runs/exp-32"},
    {"id": "exp-33", "flow": "men", "changed": "men-q5: 'Visibly thicker, fuller hair' → the same box, then 'All of the above'",
     "result": "Ticking 'All of the above' cleared the first tick; only ALL was sent. No other difference from the baseline.", "run": "runs/exp-33"},
    {"id": "exp-34-mobile", "flow": "men", "changed": "device: desktop → phone layout (walk --mobile), same answers as the baseline",
     "result": "Same 21 screens with the same wording, same server replies, same email wall.", "run": "runs/exp-34-mobile"},
    {"id": "exp-36-skip-quiz", "flow": "men", "changed": "entry: the 21-screen quiz → the sign-up address opened directly (https://app.forhims.co.uk/start/signup?t=hair), with no quiz answers",
     "result": "The same 'Ready to see if you’re eligible?' email screen appears. The quiz is optional.", "run": "runs/exp-36-skip-quiz"},
    {"id": "exp-38-return", "flow": "men", "changed": "returning visitor: after finishing the baseline quiz, /c/hl is opened again in the same browser",
     "result": "Sent straight to the sign-up email screen. The quiz does not start again.", "run": "runs/exp-38-return"},
    {"id": "exp-37-entries", "flow": "men-product-link", "changed": "entry page: the hair landing page → a paid-search landing page (try.forhims.co.uk/hl/pmax/gen) and the combo-kit shopping page (links read, not followed)",
     "result": "Every 'Get started' button on both pages points to /c/hl, the same quiz; the combo-kit button adds the product code gst=s2hF6Mdn. The combo-kit page shows 'Get started from £30/mo', 'Minimum 3 months treatment' and 1,913 reviews averaging 4.4; three of its five newest reviews (10 to 20 November 2026) report broken spray pumps.", "run": "runs/exp-37-entries"},
    {"id": "exp-35-hers-replay", "flow": "women", "changed": "nothing: the Hers UK hair entry opened again",
     "result": "Still the name screen: 'Good hair starts with great hair loss care. Welcome to Hers. To get started, tell us your name.' with First Name and Last Name fields. Nothing can be answered without personal details, so no one-change run was possible for women.", "run": "runs/exp-35-hers-replay"},
    {"id": "obs-flag-check", "flow": "men", "changed": "visitor: 41 fresh anonymous browsers compared (one per Hims run)",
     "result": "Every browser asked the feature-flag service for its settings under the same shared visitor name ('anonymous') and received the same 949 settings; all 40 quiz runs were given the same quiz version (a9a88e4a-…). So the anonymous quiz is not being A/B tested per visitor.", "run": "runs/exp-00-baseline-full"},
]

PRODUCT_PATCHES = {
    'p4': {"actives": [{"name": "finasteride", "strength": "1.1 mg"}, {"name": "minoxidil (oral)", "strength": "3 mg"}, {"name": "biotin", "strength": "2.5 mg"}, {"name": "vitamin C", "strength": "100 mg"}, {"name": "vitamin B5", "strength": "10 mg"}, {"name": "vitamin B6", "strength": "2 mg"}],
           "activesSource": "Vitamin strengths from the older Hims UK help centre (himsuk.zendesk.com, 'what’s inside the finasteride + minoxidil + supplements tablets'); the current site does not state them"},
    'p5': {"actives": [{"name": "minoxidil (oral)", "strength": "3 mg"}, {"name": "biotin", "strength": "2.5 mg"}, {"name": "vitamin C", "strength": "100 mg"}, {"name": "vitamin B5", "strength": "10 mg"}, {"name": "vitamin B6", "strength": "2 mg"}],
           "activesSource": "Vitamin strengths from the older Hims UK help centre (himsuk.zendesk.com, 'what’s inside the minoxidil + supplements tablets'); the current site does not state them"},
    'p6': {"actives": [{"name": "biotin", "strength": "2.5 mg"}, {"name": "vitamin C", "strength": "100 mg"}, {"name": "vitamin B5", "strength": "10 mg"}, {"name": "vitamin B6", "strength": "2 mg"}],
           "activesSource": "Strengths from the older Hims UK help centre (himsuk.zendesk.com, 'what’s inside the vitamin chewables', published 6 March 2025); the current site does not state them"},
    'p8': {"actives": [{"name": "minoxidil", "strength": "5% (the older help centre and most site fields say 5%; one site field says 6%)"}, {"name": "essential oil blend", "strength": "not stated"}]},
}

EXTRA_SOURCES += [
    {"title": "Older Hims UK help centre: hair-loss section (product contents, FAQs)", "url": "https://himsuk.zendesk.com/hc/en-us/sections/16566134581275-hair-loss"},
    {"title": "Older Hims UK help centre: what’s inside the vitamin chewables", "url": "https://himsuk.zendesk.com/hc/en-us/articles/34666007769499-what-s-inside-the-vitamin-chewables-and-how-do-they-work"},
    {"title": "Older Hims UK help centre: other types of hair loss", "url": "https://himsuk.zendesk.com/hc/en-us/articles/16593840790555-can-i-use-these-products-to-treat-other-types-of-hair-loss"},
    {"title": "Hims UK paid-search landing page (all buttons lead to /c/hl)", "url": "https://try.forhims.co.uk/hl/pmax/gen"},
    {"title": "Hims UK combo-kit shopping page (price 'from £30/mo', reviews)", "url": "https://www.forhims.co.uk/hair-loss/combo-kit-shopping"},
]
EXTRA_BLOCKERS = [
    "archive.ph and the Common Crawl index were also unreachable from this environment (stage 2), so no archived copy of the old consultation could be read",
]

LIMITATIONS = [
    "The medical questions were not seen. Their wording and the answer-to-product rules live on the server and are sent only after sign-in, which the research rules forbid. Every rule about what happens after the wall comes from served code, Hims's own leaflets and help pages, or reasoning, and is labelled as such. None was watched happening.",
    "No recommendation was observed for any patient. It is not known which product Hims shows first for which answers, or whether the anonymous quiz answers influence it. They are attached to the account on sign-up, so they could.",
    "The one-change tests cover each of the 42 anonymous options on its own, one run with every answer changed, and two multi-select combinations. Other combinations of answers were not tested; the served definition has no conditions, so none is expected to matter.",
    "Not tested: going back and changing an answer part-way, 'Delete my answers', coming back after several days, and anything that needs a sign-in. The phone layout was run once.",
    "The old site's own experiment list names a 5% test called 'exp-2026-previous-hl-treatment'. Its bucket is set by the old site and was not sampled; nothing in the 41 browsers checked showed a different quiz.",
    "Nothing could be tested for women: Hers UK asks for a name on the first screen. Its questions are known only from the wording the app uses to play answers back, and the list of options is incomplete.",
    "Prices for Hims come from the price table the site embeds in its public pages and from 'from £…' marketing lines. That table belongs to the old shop system; the price at the new checkout is fetched after sign-in and could differ. Hers plan prices beyond 'from £13' and 'from £20' a month were not seen.",
    "Hims UK was part-way through moving platform on the day of the check (banner: 'We're moving to a new platform'). Findings about the old platform (the oral or topical preference question, the tag-based exclusions) are labelled as such and are not confirmed on the new one.",
    "Screens described from code (name, password, recommendation, options, plans, consent, GP details, rejection) were read as text in the app's files, not seen on a live page. Their order is partly inferred, and the code is shared with other brands and services on the same platform.",
    "Only part of the app's code was read (about 126 of 453 files). No archived copy of the old consultation could be reached (Wayback Machine, archive.ph and Common Crawl were all blocked from here); it may hold the old question set with a product exclusion on every option.",
    "Review quotes come from Trustpilot through a page-summary tool and from the review panel on a Hims product page; they are a small sample, not a survey.",
]

COVERAGE_NOTE = (
    "Stage 1 (map) walked the whole anonymous men's quiz and read the served quiz definition, product and price tables, app code and public documents. "
    "Stage 2 (experiment) replayed the baseline twice and then changed one answer at a time: 31 runs covering every non-baseline option of all 11 anonymous questions, so all 42 options have now been clicked live. "
    "Seven further runs checked two multi-select combinations, the phone layout, a returning visitor, skipping the quiz, two other landing pages and the Hers entry: 40 replays in all. "
    "Every run kept the full server traffic, which showed the server choosing the next step after each answer and returning no result at the end. "
    "Stage 2 also read ten more of the app's code files (how the server's eligibility result is used, the consent screen, brand settings) and the older Hims UK help centre (vitamin strengths in the chews). "
    "Not obtained, and not obtainable without an account: the wording of the medical questions, the rules that map answers to products, any live recommendation, and the checkout prices. Nothing at all could be tested on Hers UK, which asks for a name first."
)

NEW_QUESTIONS['men'].append({
    "id": "men-m2a", "order": 26.5, "stage": "after-account",
    "text": "[Wording not seen] Allergy question with a tick-list (stored as 'hairlossAllergiesDetailed')",
    "type": "multi",
    "options": [{"label": "[Wording not seen] the choice stored as NEITHER",
                 "effect": "Has to be ticked on its own: the app refuses it together with another choice ('This answer must be selected on its own. Please review your selection.'). It reads as 'allergic to neither', which would leave every product available (inferred). The other choices could not be read; by Hims's leaflets an allergy to an ingredient rules out every product containing it.",
                 "effectType": "none", "affects": [], "evidence": "code"}],
    "purpose": "The one medical question whose storage key is visible in the app's public settings. It shows the medical questionnaire asks about allergies in detail and offers a 'neither' choice, which fits a question about allergy to the two medicines Hims sells for hair, finasteride and minoxidil (inferred).",
    "engineRole": "safety-screen", "branches": False,
    "branchDetail": "Not known. Expected from the leaflets: an allergy removes the products that contain that ingredient.",
    "shownWhen": "inside the medical questionnaire after sign-up (position not known)",
    "evidence": "code"})

# --------------------------------------------------------------------------------------
# Rules first read in served code, then confirmed live (task step 3)
# --------------------------------------------------------------------------------------
CODE_CONFIRMED = [
    {"codeRule": "The served quiz definition has 21 steps and 20 branches with no conditions, so there is one path.", "source": "quiz-definition.raw.json",
     "confirmedLive": "In all 31 one-change runs the server named the same next step after every answer and the same 21 screens appeared in the same order.", "runs": "runs/exp-01 to runs/exp-31", "rule": "R1"},
    {"codeRule": "The summary step lists six answers to play back: location, onset, family history, stress, styling, routine time.", "source": "quiz-definition.raw.json (answerSummaryBlocks)",
     "confirmedLive": "Changing any of those six changed exactly one summary line; changing any of the other five changed nothing on screen.", "runs": "15 playback runs and 16 silent runs listed in rules R20 and R21", "rule": "R20, R21"},
    {"codeRule": "The 'Reviewing responses' step has fixed text: 'Great news—we have options that may work for you.'", "source": "quiz-definition.json step 16",
     "confirmedLive": "The same sentence appeared in every run, including 'No hair loss yet', 'None of the above' and 'I don’t have hair'.", "runs": "runs/exp-03, runs/exp-04, runs/exp-18 and all others", "rule": "R22"},
    {"codeRule": "Each option has a stored value (for example 'All of the above' = ALL, 'In the past few months' = HAIRLOSS_LAST_MONTHS).", "source": "quiz-definition.json",
     "confirmedLive": "The value posted to the server matched the definition in 31 of 31 one-change runs.", "runs": "runs/exp-01 to runs/exp-31 (network.jsonl)", "rule": "R1"},
    {"codeRule": "The brand setting flowExclusiveOptionValues makes ALL, NONE and NONE_OF_THE_ABOVE stand-alone choices in tick-lists.", "source": "raw/app/chunks/get-config-ChQNMk7O.js",
     "confirmedLive": "Ticking 'All of the above' cleared an earlier tick and only ALL was sent.", "runs": "runs/exp-33", "rule": "R23"},
    {"codeRule": "The goals step is marked required.", "source": "quiz-definition.json step 5",
     "confirmedLive": "The Continue button is greyed out until a box is ticked.", "runs": "runs/exp-00-baseline-full/04.txt", "rule": "R23"},
    {"codeRule": "The last step moves on by itself after 5 seconds (autoAdvanceMs 5000) and the quiz is then submitted.", "source": "quiz-definition.json step 21; raw/app/chunks/flow-DOdG2Gaf.js",
     "confirmedLive": "With no click, the browser posted 'submit flow' and opened the sign-up page; the server's reply held only a record id.", "runs": "runs/exp-00-baseline-full and every other run", "rule": "R24"},
    {"codeRule": "The list of anonymous quizzes has no hair entry for the Hers brand.", "source": "raw/app/launchdarkly-flags-hers-uk-anon.json",
     "confirmedLive": "The Hers hair entry opens on the name screen.", "runs": "runs/exp-35-hers-replay", "rule": "R38"},
]
