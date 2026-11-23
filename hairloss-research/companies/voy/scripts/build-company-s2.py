#!/usr/bin/env python3
# build-company-s2.py — stage 2 (EXPERIMENT) for Voy. Run: python3 -I scripts/build-company-s2.py
# Starts from the frozen stage-1 map (src/company-stage1.json, made by scripts/build-company.py) and adds what
# stage 2 found. Everything is hand-entered from the evidence files named in notes.md. Nothing is guessed:
# where a fact could not be found the text says "unknown" or "not seen".
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, '..', 'src', 'company-stage1.json')
OUT = os.path.join(HERE, '..', 'company.json')
c = json.load(open(BASE, encoding='utf8'))

WWW = 'https://www.joinvoy.com'
PUB = 'https://hairloss1.joinvoy.com'
FPUB = 'https://femalehairloss1.joinvoy.com'
HC = 'https://joinvoy.zendesk.com/hc/en-gb/articles/'
ARQ = 'src/arquivo/'
LEG = "older Manual app code (shared bundle of www.manual.co, 29 Dec 2025 copy in the Portuguese Web Archive; src/arquivo/engine-excerpts.txt)"
LEGNOTE = " This is the engine as it was under the Manual name 11 months ago; it could not be re-checked on today's Voy app."
HELP2 = ("Voy help centre 'Can everyone use Voy Hair Loss treatments?' and 'Cautions - who should not use our Hair Loss treatment?' "
         "(both need sign-in now; read through two separate search-engine summaries on 2026-11-23, which agree on the headings)")
AIO_PAGE = "older Manual treatment-plan page for the All-in-One Capsule, 'Who should not take it?' (7 Jan 2025 copy, " + ARQ + "manual-aio-capsule-plan-20250107.txt)"
FIN_PAGE = "older Manual treatment-plan page for finasteride, 'Who should not take it?' (7 Jan 2025 copy, " + ARQ + "manual-finasteride-plan-20250107.txt)"

# ---------------------------------------------------------------- access
c['access'] = {
 "howTested": ["live-walk", "site-code", "public-docs"],
 "accountWall": ("The real consultation was never reached (security checkpoint before the first question), so the exact place of the sign-in step is "
                 "not seen. Older app code puts it after the anonymous quiz, the recommendation, the format and plan-length choice and the add-ons, at "
                 "/checkout/email ('Create an account': first name, last name, email, phone number, date of birth, password), followed by a medical-history "
                 "questionnaire, hair photos and the order review. On both landing-page pop-ups (men and women) the wall is an email box straight after one "
                 "picture question: the 'eligible / not eligible' verdict is only shown after an email is given. Voy's help-centre articles also need sign-in."),
 "blockers": [
  "www.joinvoy.com and manual.co: Vercel security checkpoint, HTTP 429 'Failed to verify your browser, Code 21'. Re-tested once in stage 2 on /n/hair-loss/quiz, /n/hair-loss/quiz/gateway and /n/female-hair-loss/quiz (runs/s2-retest-men, runs/s2-retest-gateway, runs/s2-probe-female-quiz) and through the web-fetch tool (HTTP 429). Not worked around.",
  "Voy help centre (joinvoy.zendesk.com) and old Manual help centre: hair-loss articles redirect to a sign-in page; web fetch gets HTTP 403. Not signed in.",
  "Wayback Machine: a copy of /n/hair-loss/quiz from 17 Aug 2026 exists, but web.archive.org cannot be reached from this machine (the outbound connection is closed) and the web-fetch tool refuses that site. archive.ph: same. Common Crawl index: time-outs (HTTP 504) and closed connections on every query.",
  "The quiz questions are not in any file that could be read: older app code shows they are downloaded at run time from an address under /shop-api/ on the blocked host. That address was not called (only addresses an anonymous page called by itself are allowed)."
 ],
 "coverageNote": ("No real quiz screen was seen, in stage 1 or stage 2. Live replays (20 in stage 2, 3 of them blocked access checks) cover only what Voy serves without the checkpoint: the men's "
                  "landing-page pop-up (6 options), the women's landing-page pop-up (4 options and Skip) and the men's pattern picker (6 options), each option "
                  "on its own. Site code covers (a) the scripts of those landing pages, which hold the pop-ups' eligibility rule, and (b) a copy of the older "
                  "Manual web app's shared script (29 Dec 2025, from a public web archive), which holds the quiz ENGINE (how answers remove products or reject "
                  "the patient, how follow-up questions are shown, the order of the funnel pages) but not the questions. Public documents cover Voy's own "
                  "landing pages for men and women (read live on Voy's public hosts hairloss1.joinvoy.com and femalehairloss1.joinvoy.com), older Manual "
                  "treatment-plan pages with full 'who should not take it' lists (archive copies), terms of sale, GPhC reports and Manual's published service "
                  "evaluation. Help-centre and www.joinvoy.com product pages were read only through search-engine summaries. Every quiz-related entry says "
                  "which of these it rests on.")
}

# ---------------------------------------------------------------- products
P = {p['id']: p for p in c['products']}
P['p1']['priceDetail'] += (" Older full prices (www.manual.co/hair-loss page data, 12 Aug 2024): monthly £34 (first month £18), 3-month £84 (first £45), "
                           "6-month £143 to £149 (first £96 to £99).")
P['p1']['recommendedWhen'] = ("Tablet-only DHT-blocker plan for men with male pattern hair loss. Offered as long as DHT blockers are not ruled out (see rules R7 to "
                              "R10 and R28). Likely what is left for men who cannot have minoxidil (low or uncontrolled blood pressure, over 65). Voy's stated "
                              "preference is to combine it with minoxidil. Exact quiz rule not seen.")
P['p2']['actives'] = [{"name": "minoxidil", "strength": "10% (Voy help-centre guide; product slug 'topical-minoxidil-10' in older app code)"}]
P['p2']['recommendedWhen'] = ("The spray form of the minoxidil plan, alone or with a DHT blocker. Likely what is left, with oral minoxidil, when DHT blockers are ruled "
                              "out (trying to conceive, prostate treatment, breast or prostate cancer, severe depression). Voy's published cautions: not for "
                              "under-18s, over-65s, sore or red scalp, or low blood pressure. Exact quiz rule not seen.")
P['p3']['actives'] = [{"name": "minoxidil", "strength": "2.5 mg (older Manual page data, Aug 2024: '30 x 2.5mg capsules'; product slug 'oral-minoxidil-2-5mg' in older app code; not re-checked on a live Voy page)"}]
P['p3']['priceDetail'] += " Older full prices (www.manual.co/hair-loss page data, 12 Aug 2024): monthly £42 (first month £29), 3-month £84 (first £57), 6-month £143 to £149 (first £96 to £99)."
P['p3']['legalStatus'] = "Prescription-only; oral minoxidil has no UK licence for hair loss (Voy's blog says so). Supplied as a 2.5 mg capsule, which is not a licensed UK product (licensed tablets are 2.5 mg, 5 mg and 10 mg for blood pressure), so it is most likely an unlicensed special: inferred, not stated by Voy."
P['p3']['recommendedWhen'] = ("The tablet form of the minoxidil plan. Voy's landing FAQ says oral minoxidil is 'more effective' than topical for men who lack the "
                              "scalp enzyme that activates topical minoxidil; the older Manual page adds men 'who hate applying hair solutions' or have irritated, "
                              "dry scalps from them. Ruled out by 'uncontrolled, dangerously low or high blood pressure' (rule R6). Exact quiz rule not seen.")
P['p4']['priceDetail'] += " Page data of 12 Aug 2024 confirms the dosage line 'Finasteride 1mg + Minoxidil 2.5mg + Biotin 10mg' and older full prices: monthly £44 (first £28), 3-month £114 (first £60), 6-month £194 to £199 (first £138 to £149)."
P['p4']['legalStatus'] = "POM, unlicensed special (compounded). Older Manual page: 'classed as an unlicensed special treatment … produced by our licensed MHRA specials manufacturer'. Voy help centre: 'this specific combination is not yet licensed in the UK for treating hair loss'."
P['p4']['recommendedWhen'] = ("The one-capsule option for men who can take both a DHT blocker and oral minoxidil. Removed by anything that rules out either part "
                              "(rules R6 to R10, R28). The older Manual page says it also suits men for whom scalp solutions 'don’t work' or irritate. Exact quiz rule not seen.")
P['p5']['priceDetail'] += (" Also named on Voy's blog ('dutasteride available as a combined capsule with minoxidil', via search summary) and in older app code "
                           "(product slug 'dutasteride-minoxidil-all-in-one-capsule'; experiment names 'dutasterideProductChoiceLogic' and 'hlDutasterideSoloTest'). "
                           "A customer video review exists ('I Tried VOY Dutasteride & Minoxidil For 90 Days'); its content could not be read.")
P['p5']['recommendedWhen'] = ("unknown. Older app code names a 'dutasteride product choice logic' experiment and a dutasteride-only test, so a rule chooses between "
                              "the finasteride and the dutasteride capsule, but what triggers it (a quiz answer, a previous finasteride user, a random test group) is not public.")
P['p6']['actives'] = [{"name": "finasteride", "strength": "1 mg tablet"}, {"name": "minoxidil", "strength": "10% or 5% spray (older app code has two bundles: '…topical-minoxidil-10-combo' and '…topical-minoxidil-5-combo')"}]
P['p6']['priceDetail'] += " Older app code names a 6-month bundle 'bundle_finasteride_oral_180tabs_minoxidil_topical_10_2x90ml_…_6M_SUB_199GBP': 180 tablets + 2 × 90 ml of 10% spray for £199, which matches £33.17 a month."
P['p7']['actives'] = [{"name": "finasteride (topical)", "strength": "0.1% (from the product slug 'topical-minoxidil-10-finasteride-01' in older app code; not stated on a page that could be opened)"}, {"name": "minoxidil", "strength": "10%"}, {"name": "azelaic acid", "strength": "5%"}]
P['p7']['priceDetail'] += " Older app code (Dec 2025) still lists the page /hair-loss/topical-finasteride-minoxidil-spray and a 6-month variant 'finasteride_topical_minoxidil_topical_10_2x90ml_6M_SUB'."
P['p9']['priceDetail'] += " Older Manual page data (Aug 2024): offered as an add-on before checkout at £10 a month (shown against £14), £20 per 3 months (against £24) or £30 per 6 months (against £60)."
P['p10']['priceDetail'] += " Older Manual page data (Aug 2024): add-on before checkout at £5 a month (against £12), £15 per 3 months (against £36) or £30 per 6 months (against £60)."
P['p11']['recommendedWhen'] = "Add-on next to minoxidil. Voy's clinician-led women's ad page lists 'capsules and hair vitamins' as the options to explore; Voy says vitamins alone are unlikely to treat the cause."
P['p12'].update({
 "name": "Women's topical minoxidil plan ('Minoxidil Serum' / 'Topical Hair Treatments')",
 "actives": [{"name": "minoxidil", "strength": "unknown: 'Your clinician sets the strength based on your answers and medical history' (Voy women's ad page). Other actives, if any: unknown; the same page says 'we’ll remove any active you have allergies to'."}],
 "form": "'Water-based serums or foams', applied to the scalp once a day",
 "legalStatus": "unknown. Sold as a clinician-prescribed plan. Voy calls these 'Formulations you won’t find in any other UK pharmacy', with a strength set per patient and actives that can be removed, which points to a made-to-order unlicensed special: inferred, not stated.",
 "price": "From £24.00 a month (women's main page); ad pages show 'From £39 £14.99 per month — Save 60%'",
 "priceDetail": "Read live on Voy's public host femalehairloss1.joinvoy.com on 2026-11-23: main page 'Topical Hair Treatments … From £24.00 per month'; /sem and /shopping-serum 'From £39 £14.99 per month', 'Save 60%'; /meta 'From £14.99 /month' and '50% off plans, and a free shampoo supply worth up to £45' (Black Friday, 16 to 30 Nov). 'We recommend at least 4–6 months treatment'. Plan lengths and full prices per length: unknown.",
 "url": WWW + "/female-hair-loss/treatments/minoxidil-plans",
 "recommendedWhen": "Voy's first choice for women ('Evidence supports minoxidil as the preferred treatment for female hair loss'; card tagged 'Most studied hair loss active'). The landing pop-up turns away 'Patchy hair loss'. Voy says minoxidil is not recommended in pregnancy or while breastfeeding. Exact quiz rule not seen.",
 "evidence": "docs"})
P['p13'].update({
 "name": "Women's oral minoxidil plan ('Hair Oral Treatment' / 'Oral Hair Treatments')",
 "price": "From £15 a month (shown with £25 struck through, 'Save 40%')",
 "priceDetail": "Read live on Voy's public host femalehairloss1.joinvoy.com on 2026-11-23: main page 'Oral Hair Treatments — Once daily tablets or capsules … From £15.00 per month'; /sem and /shopping-oral-tablets 'From £25 £15 per month', 'Save 40%'. Strength: unknown ('Your clinician sets the strength based on your answers and medical history').",
 "recommendedWhen": "Alternative to the serum for women who prefer a tablet (a Voy testimonial: 'I have a dog so using capsules was absolutely necessary', because minoxidil on the skin is toxic to pets). Voy's blog: not appropriate if pregnant, trying to conceive or breastfeeding, or with certain heart or blood pressure conditions. Exact quiz rule not seen.",
 "evidence": "docs"})
c['products'].append({
 "id": "p15", "name": "Minoxidil 5% spray (seen only in older app code)", "category": "otc-medicine",
 "actives": [{"name": "minoxidil", "strength": "5%"}],
 "form": "scalp spray; Voy's how-to blog describes a 5% spray used twice a day", "audience": "men",
 "legalStatus": "unknown. 5% minoxidil is a licensed UK strength that pharmacies sell without a prescription; whether Voy supplies a licensed product or its own made-up spray is not known.",
 "price": "unknown",
 "priceDetail": "Known only from two product slugs in older app code (Dec 2025): 'topical-minoxidil-5' and 'oral-finasteride-1mg-topical-minoxidil-5-combo', and from Voy's blog, which describes a 5% spray applied twice a day (via search summary). No Voy product page or price found.",
 "url": WWW + "/blog/how-to-use-minoxidil",
 "recommendedWhen": "unknown. A lower-strength alternative to the 10% spray, alone or in the tablet + spray bundle; what makes the quiz or the clinician choose it (scalp irritation on 10%? a wish for a licensed strength?) is not public.",
 "evidence": "code"})

# ---------------------------------------------------------------- flows
def opt(label, effect, etype, affects, ev):
    return {"label": label, "effect": effect, "effectType": etype, "affects": affects, "evidence": ev}
def q(id, order, stage, text, type_, purpose, role, branches, detail, shown, ev, options=None):
    return {"id": id, "order": order, "stage": stage, "text": text, "type": type_, "options": options or [], "purpose": purpose,
            "engineRole": role, "branches": branches, "branchDetail": detail, "shownWhen": shown, "evidence": ev}

MEN_RX = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p15"]
DHT = ["p1", "p4", "p5", "p6", "p7", "p8"]
WOMEN_RX = ["p12", "p13"]
F = {f['id']: f for f in c['flows']}

# -- men's landing pop-up (stage 1 entry, now with the stage 2 replays)
pm = F['landing-popup']
pm['stagesSummary'] = ("Opens by itself 20 seconds after a men's landing page loads → 1 picture question → email address (contact wall, not passed) → 'eligible' "
                       "screen with a link to the real quiz, or 'not eligible' stop screen. Stage 2 replayed every option on its own (runs/s2-popup-men-base and "
                       "runs/s2-exp-m01 to m05): the only visible change before the wall is that the email box unlocks; the verdict is held back until an email "
                       "is entered, so the verdict comes from the page's own script (quiz-definition.json), not from a replay.")
for o in pm['questions'][0]['options']:
    if o['effectType'] == 'hard-stop':
        o['affects'] = MEN_RX
pm['questions'][0]['branchDetail'] += (" Replays: with nothing ticked the email box reads 'Please select an option above first' and is locked; ticking any of the six "
                                       "pictures unlocks it ('*Email address'). No other text, price or link on the page changes.")

# -- women's landing pop-up (new in stage 2)
W_ELIG = ("After an email is given, the pop-up shows 'We’ve helped thousands of women regrow thicker, healthier hair' and a button 'Take the next step to "
          "treatment' that opens /n/female-hair-loss/quiz ('Answer a few more questions to get your personalised plan and your discount will apply at "
          "checkout'). No product is chosen at this point. Seen live: ticking it unlocks the email box; the verdict itself is read from the page script.")
W_INELIG = ("After an email is given, the pop-up shows 'You aren't eligible — Based on your answers there is no treatment suitable for you' with only a "
            "'Return to homepage' button. Seen live: ticking it unlocks the email box exactly like the other options, with no warning; the verdict is read from the page script.")
popup_women = {
 "id": "landing-popup-women", "name": "Women's landing-page eligibility pop-up (a one-question pre-quiz)", "audience": "women",
 "entryUrl": WWW + "/female-hair-loss",
 "stagesSummary": ("Opens by itself 7 seconds after a women's landing page loads (read on the public host femalehairloss1.joinvoy.com: main page, /sem, /meta, "
                   "/meta-hcp, /shopping-oral-tablets, /shopping-serum) → 1 question → email address (contact wall, not passed) or 'Skip' → 'eligible' screen "
                   "with a link to the women's quiz, or 'not eligible' stop screen. Replayed option by option in runs/s2-popup-women-base and runs/s2-exp-w01 to w04; "
                   "the rule is in the page's own script (quiz-definition.json → womenPreQuizPopup)."),
 "questions": [
  q("wpopup-q1", 1, "anonymous", "Tell us what you're noticing and check if you could qualify.", "single",
    "Checks in one tap whether the thinning looks like female pattern hair loss, which minoxidil can help. Patchy loss suggests another cause (for example alopecia areata) that Voy does not treat. It also collects an email address and attaches a discount code (STARTHAIR38).",
    "eligibility-gate", True,
    "'Patchy hair loss' → 'You aren't eligible' stop screen. The other three → 'Take the next step to treatment' link to /n/female-hair-loss/quiz. Unlike the men's pop-up there is no 'complete loss' option. The answer is sent to marketing with the email (hidden fields promotion='Female hair', campaign=webflow_pop_entry_manual_hl, coupon=STARTHAIR38).",
    "always, 7 seconds after page load (heading on the day: '50% off your hair loss plan + FREE shampoo supply. Exclusively for Black Friday.')", "observed",
    [opt("Widening part", W_ELIG, "next-question", [], "code"),
     opt("Thinning temples", W_ELIG, "next-question", [], "code"),
     opt("Patchy hair loss", W_INELIG, "hard-stop", WOMEN_RX, "code"),
     opt("General thinning", W_ELIG, "next-question", [], "code"),
     opt("Skip", "Closes the pop-up and leaves the visitor on the landing page; every 'Get started' button there still opens the women's quiz. Nothing is recorded as an answer.", "none", [], "observed")]),
  q("wpopup-q2", 2, "anonymous", "*Email address (button: 'Check if I qualify'). Small print: 'Your details help us recommend the right treatment for you — based on how your body works. By entering I agree to the Terms and Conditions'", "contact",
    "Lead capture. The verdict is only shown after an email is entered. The box is locked ('Please select an option above first') until an option is ticked.",
    "data-capture", False, "", "always; unlocks once an option is ticked. This is the contact wall for this mini-flow: not passed.", "observed"),
  q("wpopup-q3", 3, "after-account", "We’ve helped thousands of women regrow thicker, healthier hair. [Take the next step to treatment] [Continue exploring]", "info",
    "Hands the visitor on to the women's consultation with the discount attached.", "marketing", False, "",
    "after the email is submitted, when the answer was Widening part, Thinning temples or General thinning", "code"),
  q("wpopup-q4", 4, "after-account", "You aren't eligible. Based on your answers there is no treatment suitable for you. [Return to homepage]", "info",
    "Stops women whose hair-loss pattern minoxidil is not meant for. No advice or referral is offered.", "eligibility-gate", False, "",
    "after the email is submitted, when the answer was Patchy hair loss", "code")]}

# -- pattern picker: all six options now seen live
pw = F['landing-pattern-widget']
pw['stagesSummary'] = ("A marketing widget on a social landing page, not part of the consultation: tap one of six head pictures and the page shows a success statistic "
                       "for that stage, then a button into the quiz gateway. No data entry. Stage 2 replayed each picture on its own (runs/s2-widget-base, "
                       "runs/s2-exp-p01 to p05): only the statistic and its sentence change; the button always opens /n/hair-loss/quiz/gateway.")
for o in pw['questions'][0]['options']:
    o['evidence'] = 'observed'

# -- men's consultation
men = {
 "id": "men", "name": "Men's hair-loss consultation ('the hair quiz')", "audience": "men", "entryUrl": WWW + "/n/hair-loss/quiz",
 "stagesSummary": ("NOT WALKED: www.joinvoy.com answered every request with a security checkpoint (HTTP 429, 'Failed to verify your browser, Code 21'), again in "
                   "stage 2 (runs/s2-retest-men). No real question was seen, so no question wording or answer option is listed here. What is listed: (1) the order of "
                   "the funnel pages, from older app code: quiz (one question per page) → loading animation → recommendation → choose format → choose plan length → "
                   "add-ons → account → medical-history questionnaire → hair photos → order review → clinician review; (2) the screening TOPICS the questionnaire must "
                   "cover, from Voy's published 'who should not use it' lists, each with the effect Voy states; (3) the engine's reject, review and swap behaviour from "
                   "older app code. Entries marked 'topic' are not screens."),
 "questions": [
  q("men-s1", 1, "anonymous", "[Step described by Voy, screen not seen] Take our quick assessment: 'We’ll ask you a few questions about your hair loss and medical history. You’ll be done in under 2 minutes.' / 'We'll ask some questions to assess your eligibility and find the best treatment plan for you'", "info",
    "Collects the hair-loss pattern, a medical history and a format preference so the engine can rule treatments in or out and suggest a plan. Voy's sample plan card shows the three things the quiz must produce: 'Diagnosis: Receding hairline', 'Preferences: Spray (fits morning routine)', 'Treatment type: Minoxidil & Finasteride'.",
    "diagnosis", True,
    "Older app code: one question per page (/n/hair-loss/quiz/[question]); question types are single choice, multiple choice, tick box, picture choice, free text, date, height and weight, and a 'product choice' type; a question can carry an information panel, an interstitial screen, a picture or chart screen and a progress screen. Answers are kept in the browser (local storage 'quiz') and each change of an earlier answer is recorded.",
    "start of the flow (not verified live)", "docs"),
  q("men-t1", 2, "anonymous", "[Topic, wording not seen] Hair-loss pattern (picture choice). Voy's own pre-quiz pop-up uses: Temples · Temples & Crown · Moderate · Extensive · Patchy · Complete", "info",
    "Decides whether this is male pattern hair loss that the medicines treat, and how advanced it is. Voy's cautions: 'Not suitable for men who do not have male pattern baldness or who are completely bald'; older Manual pages: 'the treatments have not been shown to be effective in men who have complete hair loss'.",
    "eligibility-gate", True,
    "Patchy loss or complete baldness → not eligible (shown by the pop-up's script; assumed to be the same inside the quiz). Whether an early pattern (temples only) and an extensive one get different default plans is unknown: Voy's marketing recommends the combined plan for every stage.",
    "early in the quiz (position not verified)", "docs"),
  q("men-t2", 3, "anonymous", "[Topic, wording not seen] Sex at birth and age", "info",
    "Keeps the men's medicines to adult men. Voy: 'Our Hair treatment plans are NOT suitable for women and male patients under 18 years of age' (older Manual page); minoxidil 'not suitable for women, men under 18, or men over 65' (help centre). The account form also asks for a date of birth.",
    "eligibility-gate", True,
    "Under 18 → not treated. Female → men's medicines not offered (women are sent to the women's plans). Over 65 → minoxidil listed as unsuitable; whether the quiz removes only minoxidil or stops the patient is unknown.",
    "position not verified (age may only be taken as a date of birth at account creation)", "docs"),
  q("men-t3", 4, "anonymous", "[Topic, wording not seen] Scalp condition: soreness, redness, irritation", "info",
    "Minoxidil on the skin can irritate, and a broken or inflamed scalp absorbs more of it. Voy: minoxidil 'should not be used if you have scalp soreness, redness'; the older all-in-one spray page excludes scalp conditions or inflammation.",
    "safety-screen", True, "Likely removes the sprays and leaves tablets and capsules. Not seen.", "position not verified", "docs"),
  q("men-t4", 5, "anonymous", "[Topic, wording not seen] Blood pressure and heart", "info",
    "Minoxidil was first a blood-pressure medicine; tablets can lower blood pressure, speed the heart and cause fluid retention. Voy: 'should not be used if you have … low blood pressure' (help centre); 'Minoxidil should not be used in patients [who] suffer from uncontrolled, dangerously low or high blood pressure' (older Manual capsule page); Manual's own study excluded 'uncontrolled cardiovascular conditions'. The older terms of sale list 'blood pressure information' among the medical details reviewed.",
    "safety-screen", True, "Removes minoxidil-containing products, at least the oral ones (oral minoxidil, both all-in-one capsules). Finasteride tablets would remain. Whether the patient is asked for an actual blood-pressure reading is unknown.", "position not verified", "docs"),
  q("men-t5", 6, "anonymous", "[Topic, wording not seen] Prostate: enlarged prostate being treated with a 5-alpha-reductase inhibitor (finasteride 5 mg, dutasteride); and other current medicines", "info",
    "Avoids doubling up on the same class of medicine, and keeps prostate care with the patient's own doctor (finasteride lowers the PSA blood test). Voy: 'Not suitable for men with benign prostate enlargement or those currently using a 5-alpha reductase inhibitor'.",
    "safety-screen", True, "Removes the DHT-blocker products (finasteride, dutasteride, both capsules, the tablet + spray bundle, the all-in-one spray). Minoxidil-only plans remain.", "position not verified", "docs"),
  q("men-t6", 7, "anonymous", "[Topic, wording not seen] History of male breast cancer, prostate cancer or gynaecomastia", "info",
    "DHT blockers change hormone levels and carry breast-change warnings. Voy: 'If you are or have suffered from male breast cancer or prostate cancer' finasteride is not suitable; help centre adds gynaecomastia.",
    "safety-screen", True, "Removes the DHT-blocker products. Minoxidil-only plans remain.", "position not verified", "docs"),
  q("men-t7", 8, "anonymous", "[Topic, wording not seen] Trying for a baby, partner pregnant, fertility treatment or low sperm count", "info",
    "Finasteride passes into semen in traces and has been linked to reports of poor semen quality. Voy landing FAQ: 'This medication isn't suitable if you are trying to conceive or when your partner is pregnant'. The older Manual pages are softer: an informed decision if trying to conceive, 'we advise you not to take Finasteride-containing treatments' if undergoing fertility treatment or with a known low sperm count, and a condom if the partner is pregnant.",
    "safety-screen", True, "Removes the DHT-blocker products or, in the softer version, warns and lets the man decide. Which of the two the quiz does today is not seen.", "position not verified", "docs"),
  q("men-t8", 9, "anonymous", "[Topic, wording not seen] Mental health: depression, suicidal thoughts", "info",
    "Finasteride carries a warning about low mood, depression and suicidal thoughts. Voy help centre lists 'severe depression or suicidal thoughts' under finasteride and dutasteride; the older Manual page says men 'with a history of depression should consider the potential risks and benefits' and should tell friends and family they are taking it.",
    "safety-screen", True, "Severe depression or suicidal thoughts → DHT blockers removed. A past history → likely a warning and a flag for the clinician rather than removal. Not seen.", "position not verified", "docs"),
  q("men-t9", 10, "anonymous", "[Topic, wording not seen] Allergies and intolerances (minoxidil, finasteride, capsule ingredients; lactose or galactose intolerance)", "info",
    "Older Manual pages: 'You should not take our treatments if you are allergic to minoxidil, finasteride, or excipients'; finasteride tablets are not suitable 'if you have galactose intolerance, Lapp lactase deficiency or glucose-galactose malabsorption' (the tablets contain lactose).",
    "safety-screen", True, "Removes the product that contains the allergen. Not seen.", "position not verified", "docs"),
  q("men-t10", 11, "anonymous", "[Topic, wording not seen] Hair treatments used before or now, and side effects from them", "info",
    "Not confirmed for men. Voy's women's page says 'I’m already using a hair loss treatment — Tell us in your consultation', Manual's study excluded 'ongoing conflicting therapies', and Voy's FAQ says side effects on tablets can lead to 'switching to a topical treatment'. A question of this kind is the most likely trigger for the dutasteride capsule and for the topical finasteride spray.",
    "product-selector", True, "Unknown. Possible effects: dutasteride instead of finasteride for a man who has already tried finasteride; the topical spray for a man worried about tablet side effects. Both are inferences.", "unknown", "inferred"),
  q("men-t11", 12, "anonymous", "[Topic, wording not seen] Format preference: tablet, spray or both", "info",
    "Picks the form the man will keep using. Voy's sample plan card shows 'Preferences: Spray (fits morning routine)'; plan cards say 'Format: Tablet, spray or combination' and Voy advertises '30+ treatment combinations'. Older app code has a 'product choice' question type, a /choose-format page and a stored 'userPreferredProduct'.",
    "product-selector", True, "Chooses between oral and topical versions of the same medicines (finasteride tablet or capsule against the topical spray; minoxidil capsule against 10% or 5% spray) among the products still eligible.", "position not verified", "docs"),
  q("men-s2", 13, "anonymous", "[Legacy app code, screen not seen] Not-eligible screen: 'You aren't eligible. Based on your answers there is no treatment suitable for you. If you think you have made an error in your responses, please click below to review your answers.' Tick box: 'I agree only to provide accurate responses'. Warning: 'Giving inaccurate information in a clinical consultation, could put your health at risk.' Buttons: 'Review your answers', 'Back to homepage'", "info",
    "The stop screen. It appears when an answer is on a question's reject list, which empties the list of eligible products. It lets the patient go back and change answers after ticking a promise to answer accurately; changed answers are recorded and shown to the prescriber.",
    "eligibility-gate", True, "Reject answer → this screen. 'Review your answers' → back into the quiz. Same title and first sentence as the landing-page pop-ups.", "when no product is left eligible", "code"),
  q("men-s3", 14, "anonymous", "[Legacy app code and current site flag, screen not seen] Loading animation, then the recommendation page (/n/hair-loss/recommendations)", "info",
    "Shows the recommended plan. Voy: 'shows the full plan before you pay'. A survey that Voy's own page downloads targets this page and asks 'What’s the main thing holding you back from moving to the next step?', so this is where Voy sees people drop out. A current experiment flag adds an animation before it.",
    "product-selector", True, "Voy's stated default for men is finasteride plus minoxidil together ('Most effective', 'Best for maximum results'). Products removed by earlier answers are not offered. Older app code also has a second page, /n/hair-loss/your-recommendations, reached from an 'unsure' route.", "after the last quiz question", "code"),
  q("men-s4", 15, "anonymous", "[Legacy app code, screens not seen] Choose format (/choose-format), then choose plan length (/choose-frequency): monthly, 3 months or 6 months", "info",
    "Turns the recommendation into a product and a subscription. The plan length changes only the price and the size of the parcel: every headline price on Voy's pages is the 6-month plan with a first-order discount.",
    "product-selector", True, "Format picks the product; length picks the variant (30, 90 or 180 days). Older experiments tested pushing the 6-month plan as the recommended length and a 3/6/9-month set.", "after the recommendation", "code"),
  q("men-s5", 16, "anonymous", "[Legacy app code, screen not seen] Add-ons page (/n/hair-loss/extra): Power Shampoo and Hair Vitamins at a reduced add-on price", "info",
    "Upsell of non-prescription extras before checkout. They do not depend on the medical answers.", "marketing", False, "", "after the plan is chosen, for products that have add-ons attached", "code"),
  q("men-s6", 17, "after-account", "[Legacy app code, screen not seen] Create an account / sign in: First name, Last name, Email, Phone number, Date of birth, Create password; 'Keep me informed of new products & promotions'; 'I agree to the terms and conditions, terms of sale and privacy policy'", "contact",
    "Account wall. Ties the answers to a named adult so a clinician can prescribe and the pharmacy can post the order. A current flag ('acq-1366-exp-otp-login-quiz') points to a sign-in by one-time passcode inside the quiz.",
    "identity", False, "", "after the plan and add-ons are chosen (older code: /checkout/email); exact place on today's site not seen", "code"),
  q("men-s7", 18, "after-account", "[Legacy app code, not seen, not tested by rule] Medical-history questionnaire (/checkout/quiz/questions), tied to the product in the basket", "info",
    "The fuller clinical questionnaire the prescriber reads. Older code shows each prescription product can carry its own medical-history questionnaire, answered once the account exists; the quiz answers and any changed answers travel with the basket item.",
    "safety-screen", True, "Unknown in detail. The same engine applies: reject answers stop the order, exclude answers remove the product, and a pre-chosen product can be swapped.", "after account creation", "code"),
  q("men-s8", 19, "after-account", "[Legacy app code and Voy's texts, not seen, not tested by rule] Hair photos (/checkout/photos/intro and /take): front, top, crown and back of the head", "photo",
    "Baseline for the Hair Progress Tracker and for the Money Back Promise (photos 'before starting the treatments' and every 30 days). Voy's help centre describes photos as something customers 'can upload … for clinical feedback' after approval, so they do not look like a condition of the first prescription.",
    "personalisation", False, "", "around order placement (older code can ask before or after the order)", "code"),
  q("men-s9", 20, "checkout", "[Voy's terms and the pharmacy regulator, not seen, not tested by rule] Order review, payment details, then clinician review", "info",
    "A prescriber (mostly pharmacist independent prescribers) reads the questionnaire. The system highlights answers that suggest treatment may not be appropriate and shows changed answers. Older terms of sale: 'We will not take payment for prescription only medicines until we have accepted your recommended treatment plan'; if the clinician asks for more information and gets no reply within 10 days, the order is declined without charge. Identity is checked from the bank card.",
    "safety-screen", True, "Approve → electronic prescription to Voy Pharmacy, usually within 24 hours. Query → message to the patient. Decline → order cancelled.", "after payment details", "docs")]}

gateway = {
 "id": "gateway", "name": "Generic quiz gateway (men and women)", "audience": "both", "entryUrl": WWW + "/n/hair-loss/quiz/gateway",
 "stagesSummary": ("NOT WALKED (same security checkpoint; re-tested in runs/s2-retest-gateway). This is the link most men's landing pages use, the page aimed at both "
                   "men and women, and the men's pop-up's 'eligible' button; the women's pages also carry it on a secondary button. A live experiment named "
                   "'SEM-Questionnaire-Generic-vs-Male' swaps buttons between this link and /n/hair-loss/quiz, so this is read as a questionnaire that first sorts the "
                   "visitor. The only sorting question found in app code is the one below."),
 "questions": [
  q("gateway-q1", 1, "anonymous", "What was your sex at birth?", "single",
    "Probably the sorting question: men's questions and products for men, the women's quiz for women. Found in older app code as the app's built-in 'personal question' (introduced by 'We will ask some questions around your health and goals to provide personalised treatments and tips'). That the hair gateway shows this exact question is not verified.",
    "eligibility-gate", True, "Inferred split: Male → men's consultation; Female → women's consultation at /n/female-hair-loss/quiz.", "first screen of the generic flow (not verified live)", "code",
    [opt("Female", "Not seen. Inferred: sent to the women's questions and the women's minoxidil plans, because Voy states its men's hair-loss medicines are 'NOT suitable for women'.", "product-switched", MEN_RX + WOMEN_RX, "inferred"),
     opt("Male", "Not seen. Inferred: continues to the men's questions and products.", "next-question", [], "inferred")])]}

women = {
 "id": "women", "name": "Women's hair-loss consultation", "audience": "women", "entryUrl": WWW + "/n/female-hair-loss/quiz",
 "stagesSummary": ("NOT WALKED (same security checkpoint, runs/s2-probe-female-quiz). The entry link was found in stage 2 on Voy's public women's host: every button "
                   "there opens /n/female-hair-loss/quiz (with ?coupon=50OFFBF on ad pages). Voy's published steps: '1 Answer questions about your hair and health. "
                   "Takes 2 minutes. 2 A UK-registered clinician reviews your answers. They recommend a treatment at a strength suited to you. 3 See the full details "
                   "before paying anything. What it is, strength, ingredients, how to use it and possible side effects. 4 Adjust or change as you go.' Only minoxidil "
                   "(serum or foam, or tablets) and vitamins are sold to women; no finasteride, dutasteride or spironolactone was found. Entries marked 'topic' are not screens."),
 "questions": [
  q("women-s1", 1, "anonymous", "[Step described by Voy, screen not seen] 'Complete a short online assessment about your hair, your health and your goals' / 'Take our quick hair questionnaire to find a personalised hair treatment that fits your lifestyle and hair goals'", "info",
    "Collects the type of hair loss, goals and a medical history.", "diagnosis", True, "Unknown in detail; see the topics below.", "start of the flow (not verified live)", "docs"),
  q("women-t1", 2, "anonymous", "[Topic, wording not seen] Type of hair loss. Voy's own pre-quiz pop-up uses: Widening part · Thinning temples · Patchy hair loss · General thinning", "info",
    "Separates female pattern hair loss (widening part, thinning on top) from patchy loss, which points to another condition. Voy's pages also name hormonal change, menopause, the months after giving birth and stress or illness as causes it has 'treatments built for'.",
    "eligibility-gate", True, "Patchy hair loss → not eligible (pop-up script; assumed to be the same in the quiz). The other three continue. Whether the quiz asks about the cause (menopause, postpartum, stress) and what it does with the answer is unknown: the only medicine on offer is minoxidil in every case.", "early in the quiz (position not verified)", "docs"),
  q("women-t2", 3, "anonymous", "[Topic, wording not seen] Pregnant, breastfeeding or trying for a baby", "info",
    "Voy's blog: 'we don't have enough evidence to confirm that minoxidil is safe when pregnant or breastfeeding. That's why it's not recommended for women in either of those groups'; minoxidil tablets are 'not appropriate for women who are pregnant, trying to conceive, or breastfeeding'.",
    "safety-screen", True, "Pregnant or breastfeeding → likely a stop, because minoxidil is the only medicine sold to women. Trying to conceive → tablets not appropriate; whether the serum stays on offer is unknown.", "position not verified", "docs"),
  q("women-t3", 4, "anonymous", "[Topic, wording not seen] Blood pressure and heart", "info",
    "Voy's blog lists 'You have uncontrolled high blood pressure' among reasons not to use minoxidil, and says the tablets are not appropriate 'for those with certain heart or blood pressure conditions'.",
    "safety-screen", True, "Likely removes the tablets and leaves the serum; uncontrolled high blood pressure may stop both. Not seen.", "position not verified", "docs"),
  q("women-t4", 5, "anonymous", "[Topic, wording not seen] Allergies", "info",
    "Voy's women's page: 'What’s in it? I have allergies. — You’ll see the full ingredient list before you pay, and we’ll remove any active you have allergies to.'",
    "personalisation", True, "Changes the formulation (an active is left out) instead of rejecting the patient.", "position not verified", "docs"),
  q("women-t5", 6, "anonymous", "[Topic, wording not seen] Hair treatments already in use", "info",
    "Voy's women's page: 'I’m already using a hair loss treatment. — Tell us in your consultation. Your clinician will take it into account and explain how your plan compares.'",
    "personalisation", True, "Taken into account by the clinician; no automatic rule is described.", "position not verified", "docs"),
  q("women-s2", 7, "anonymous", "[Step described by Voy, screen not seen] Recommendation: 'Our experts will recommend the ideal formulation to help you achieve thicker, fuller hair' — Oral Hair Treatment (once-daily tablet or capsule) or Topical Hair Treatment (water-based serum or foam); 'You’ll see [the strength] before you confirm, and it can be changed later'", "info",
    "Product choice between oral and topical minoxidil, with the strength set for the patient, plus the vitamins add-on.", "product-selector", True,
    "Serum is the lead product ('Most studied hair loss active'); tablets are the alternative (for example for pet owners, since minoxidil on the skin is toxic to cats and dogs). 'How strong is the treatment? Your clinician sets the strength based on your answers and medical history.'", "after the quiz questions (not verified live)", "docs")]}

atc = {
 "id": "atc", "name": "Product-first route ('add to cart' flow)", "audience": "men", "entryUrl": WWW + "/n/hair-loss/quiz?flowType=atc",
 "stagesSummary": ("NOT WALKED (same security checkpoint). Seen as the button target on the minoxidil social landing page. Older app code has the same route as "
                   "/n/hair-loss/quiz?atc=true and three flow types: 'quiz' (recommendation first), 'atc' (product first) and 'categoryPage'. In the product-first "
                   "route the visitor arrives with a product already in the basket and answers the questionnaire afterwards; if the stored preferred product is "
                   "flagged 'shouldSwap', the app adds &swap=true and the product is exchanged for one the answers allow."),
 "questions": [
  q("atc-s1", 1, "anonymous", "[Not seen] Quiz opened with flowType=atc: the product has already been chosen on the landing page, so the questions confirm that it is safe.", "info",
    "Lets ad traffic that already wants one product (for example minoxidil only) skip the recommendation step. 'Final treatment plans are shared decisions determined with your clinician after this online assessment' (older Manual landing page).",
    "product-selector", True, "Older app code: chosen product still eligible → straight on to plan length and add-ons; chosen product ruled out by an answer → swapped (swap=true) for an eligible one; nothing eligible → the 'You aren't eligible' screen.", "when the quiz is opened from a product-specific landing page", "code")]}

c['flows'] = [pm, popup_women, pw, men, gateway, women, atc]

# ---------------------------------------------------------------- rules
def rule(id, flow, when, then, etype, affects, ev, proof, conf):
    return {"id": id, "flow": flow, "when": when, "then": then, "effectType": etype, "affects": affects, "evidence": ev, "proof": proof, "confidence": conf}

c['rules'] = [
 rule("R1", "landing-popup", "popup-q1 = 'Patchy' or 'Complete' (and an email is then submitted)",
      "Stop: 'You aren't eligible. Based on your answers there is no treatment suitable for you.' Only a 'Return to homepage' button; no link to the quiz, no advice.",
      "hard-stop", MEN_RX, "code",
      "quiz-definition.json → preQuizPopup.eligibilityScriptVerbatim (inline script in src/hairloss1-home.html and nine landing pages). Options ticked live in runs/s2-exp-m04 and runs/s2-exp-m05; the verdict screen needs an email, so it was not triggered.", "high"),
 rule("R2", "landing-popup", "popup-q1 = 'Temples', 'Temples & Crown', 'Moderate' or 'Extensive' (and an email is then submitted)",
      "Shows 'Take the next step to treatment' → /n/hair-loss/quiz/gateway and carries any ?coupon= code into that link. Nothing is recommended yet; all four are treated the same.",
      "next-question", [], "code", "quiz-definition.json → preQuizPopup.popupScriptVerbatim; options ticked live in runs/s2-popup-men-base and runs/s2-exp-m01 to m03", "high"),
 rule("R3", "men", "Age under 18 (question wording not seen)",
      "Not treated. 'Our Hair treatment plans are NOT suitable for women and male patients under 18 years of age.' The account form asks for a date of birth.",
      "hard-stop", MEN_RX, "docs", FIN_PAGE + "; GPhC inspection report 13/11/2023 ('customers were aged 18 years and over'); " + HELP2, "medium"),
 rule("R4", "men", "Age over 65 (question wording not seen)",
      "Minoxidil is listed as 'not suitable for … men over 65'. Whether the quiz removes only the minoxidil products (leaving finasteride) or stops the patient is unknown.",
      "product-removed", ["p2", "p3", "p4", "p5", "p6", "p7", "p8", "p15"], "docs", HELP2, "low"),
 rule("R5", "men", "Sore, red or irritated scalp (question wording not seen)",
      "Minoxidil 'should not be used if you have scalp soreness, redness'. Read as removing the sprays; the older all-in-one spray page also excludes scalp conditions or inflammation. Tablets and capsules would remain.",
      "product-removed", ["p2", "p6", "p7", "p8", "p15"], "docs", HELP2 + "; older Manual all-in-one spray page (search summary)", "low"),
 rule("R6", "men", "Low blood pressure, or uncontrolled high blood pressure (question wording not seen)",
      "Minoxidil should not be used: 'Suffer from uncontrolled, dangerously low or high blood pressure' (capsule page); 'low blood pressure' (help centre). Removes the oral minoxidil products; the help-centre list reads as written for the spray too (it also names scalp soreness), so the sprays and the bundles that contain them probably go as well. Finasteride tablets remain.",
      "product-removed", ["p2", "p3", "p4", "p5", "p6", "p7", "p8", "p15"], "docs", AIO_PAGE + "; " + HELP2 + "; Manual's own study excluded 'uncontrolled cardiovascular conditions' (PMC11829753)", "medium"),
 rule("R7", "men", "Enlarged prostate being treated with a 5-alpha-reductase inhibitor (finasteride 5 mg or dutasteride), or already taking one (question wording not seen)",
      "Finasteride 'is not suitable'. DHT-blocker products are removed; minoxidil-only plans remain.",
      "product-removed", DHT, "docs", AIO_PAGE + " and " + FIN_PAGE + " (word for word); " + HELP2, "medium"),
 rule("R8", "men", "Trying to conceive, partner pregnant, fertility treatment or known low sperm count (question wording not seen)",
      "Voy today: 'This medication isn't suitable if you are trying to conceive or when your partner is pregnant' → DHT blockers removed, minoxidil-only left. Older Manual wording was softer: an informed choice when trying to conceive; advised not to take finasteride-containing treatments during fertility treatment or with a low sperm count; a condom if the partner is pregnant.",
      "product-removed", DHT, "docs", "Landing-page FAQ 'What are the side effects of the treatments?', src/hairloss1-home.txt (" + PUB + "/); " + AIO_PAGE + ", section 'Fertility or your partner is pregnant'; " + HELP2, "medium"),
 rule("R9", "men", "History of male breast cancer, prostate cancer or gynaecomastia (question wording not seen)",
      "Finasteride is not suitable 'if you are or have suffered from male breast cancer or prostate cancer'; the help centre adds gynaecomastia. DHT-blocker products removed; minoxidil-only plans remain.",
      "product-removed", DHT, "docs", AIO_PAGE + " and " + FIN_PAGE + "; " + HELP2, "medium"),
 rule("R10", "men", "Severe depression or suicidal thoughts (question wording not seen)",
      "Listed as not suitable under the finasteride and dutasteride heading → DHT blockers removed. A past history of depression is treated more softly in the older Manual page ('should consider the potential risks and benefits'), so that is more likely a warning and a flag than a removal.",
      "product-removed", DHT, "docs", HELP2 + "; " + AIO_PAGE + ", section 'Mental Health'; landing FAQ in src/hairloss1-home.txt", "low"),
 rule("R11", "men", "Hair loss is not male pattern baldness, or the man is completely bald (question wording not seen)",
      "Not suitable for treatment: 'the treatments have not been shown to be effective in men who have complete hair loss'. Matches the pop-up rule R1.",
      "hard-stop", MEN_RX, "docs", HELP2 + "; " + FIN_PAGE + "; quiz-definition.json (pop-up script)", "medium"),
 rule("R12", "gateway", "The person is a woman (gateway-q1 = 'Female', or a woman in the men's quiz)",
      "The men's medicines are 'NOT suitable for women' ('for those assigned the gender female at birth'); she is sent to the women's minoxidil plans instead. The switch itself was not seen.",
      "product-switched", MEN_RX + WOMEN_RX, "docs", FIN_PAGE + "; " + AIO_PAGE + "; " + HELP2 + "; women's quiz link on " + FPUB + "/", "medium"),
 rule("R13", "women", "Pregnant or breastfeeding (question wording not seen)",
      "Minoxidil is 'not recommended for women in either of those groups'. Read as a stop, because minoxidil is the only medicine sold to women. The screen was not seen.",
      "hard-stop", WOMEN_RX, "docs", WWW + "/blog/minoxidil-for-women-does-it-work and " + WWW + "/female-hair-loss/treatments/minoxidil-plans (both read through search-engine summaries)", "medium"),
 rule("R14", "women", "Trying to conceive, or 'certain heart or blood pressure conditions' (question wording not seen)",
      "Minoxidil tablets are 'not appropriate'. Whether the serum stays on offer is unknown.",
      "product-removed", ["p13"], "docs", WWW + "/blog/minoxidil-tablets-for-women (read through a search-engine summary)", "low"),
 rule("R15", "men", "Any answer that suggests treatment may not be clinically appropriate, or an answer that was changed after first being given",
      "The answer is highlighted for the prescriber, who must do a risk assessment before approving; the prescriber can message the patient or cancel the order. Older app code agrees: the basket item is sent with 'consultationAnswers' and 'changedAnswers'.",
      "flag-for-clinician", [], "docs", "GPhC inspection report 13/11/2023, src/gphc/9012134-2023-11-13-22425.txt lines 533–539; " + LEG + " excerpts E and F", "medium"),
 rule("R16", "men", "Side effects on an oral treatment after starting",
      "A clinician 'may suggest adjusting your medication, continuing treatment as some side effects improve over time, or switching to a topical treatment, which may have fewer side effects'.",
      "product-switched", ["p1", "p4", "p7", "p2"], "docs", "Landing-page FAQ 'What happens if I experience side effects?', src/pages/a_all-in-one-treatment.txt (" + PUB + "/a/all-in-one-treatment)", "medium"),
 rule("R17", "landing-popup-women", "wpopup-q1 = 'Patchy hair loss' (and an email is then submitted)",
      "Stop: 'You aren't eligible. Based on your answers there is no treatment suitable for you.' Only a 'Return to homepage' button.",
      "hard-stop", WOMEN_RX, "code", "quiz-definition.json → womenPreQuizPopup.popupScriptVerbatim (inline script in src/women/fhl-home.html: isIneligible = patchyRadio.checked). Option ticked live in runs/s2-exp-w03; the verdict screen needs an email, so it was not triggered.", "high"),
 rule("R18", "landing-popup-women", "wpopup-q1 = 'Widening part', 'Thinning temples' or 'General thinning' (and an email is then submitted)",
      "Shows 'We’ve helped thousands of women regrow thicker, healthier hair' and 'Take the next step to treatment' → /n/female-hair-loss/quiz. All three are treated the same; no product is chosen.",
      "next-question", [], "code", "quiz-definition.json → womenPreQuizPopup; options ticked live in runs/s2-popup-women-base, runs/s2-exp-w01, runs/s2-exp-w02", "high"),
 rule("R19", "landing-pattern-widget", "widget-q1 = any of the six patterns",
      "Only the headline statistic changes (At the temples 87%, Across the hairline 90%, Hairline & crown 94%, Most of the top 95%, Thinning 63%, Top and sides 50%). The button under it always opens /n/hair-loss/quiz/gateway. The answer is not passed to the quiz.",
      "marketing-only", [], "observed", "runs/s2-widget-base and runs/s2-exp-p01 to runs/s2-exp-p05 (one pattern each), against page code in quiz-definition.json → patternResultsWidget", "high"),
 rule("R20", "landing-popup", "Either pop-up: no option ticked, then any option ticked",
      "With nothing ticked the email box is locked and reads 'Please select an option above first'. Ticking any option, including the ones that will be refused, unlocks it ('*Email address') and changes nothing else. The refusal is only revealed after the email is handed over. 'Skip' (women's pop-up) just closes it.",
      "next-question", [], "observed", "runs/s2-popup-men-base (steps 01 and 02), runs/s2-exp-m01 to m05, runs/s2-popup-women-base (steps 01 and 02), runs/s2-exp-w01 to w04", "high"),
 rule("R21", "men", "Engine: the chosen answer is on a question's reject list ('rejectCondition')",
      "The list of eligible products is emptied and the 'You aren't eligible' screen is shown, with 'Review your answers' behind a tick box 'I agree only to provide accurate responses'. One such answer is enough, whatever else was answered." + LEGNOTE,
      "hard-stop", MEN_RX + WOMEN_RX, "code", LEG + " excerpts A and J; same screen title and sentence as the live pop-ups (quiz-definition.json)", "medium"),
 rule("R22", "men", "Engine: the chosen answer has products listed against it ('productExcludeCondition')",
      "Exactly those product codes are taken off the eligible list; the quiz carries on and recommends from what is left. This is how one answer removes, say, the oral minoxidil products while leaving finasteride." + LEGNOTE,
      "product-removed", [], "code", LEG + " excerpt A (which answers remove which products is in the quiz definition, which could not be read)", "medium"),
 rule("R23", "men", "Engine: a question names a parent question and a parent answer ('parentQuestion', 'parentQuestionCondition')",
      "The question is shown only when the parent was answered that way: this is how a 'Yes' opens follow-up questions and a 'No' skips them." + LEGNOTE,
      "extra-questions", [], "code", LEG + " excerpts B and C", "medium"),
 rule("R24", "men", "Engine: a question has a show condition, a hide condition or 'conditionals' written as JSON Logic over all earlier answers",
      "The question is shown, hidden or replaced by a different wording or option list when the condition is true. The current site still serves a flag named 'json-logic-draft-evaluation'." + LEGNOTE,
      "skip-questions", [], "code", LEG + " excerpts C and C2; src/posthog-flags-2026-11-23.json", "medium"),
 rule("R25", "atc", "Product-first route: the product picked on the landing page is ruled out by an answer",
      "The stored preferred product is flagged 'shouldSwap' and the quiz is reopened with swap=true: the product is exchanged for an eligible one instead of the order being refused." + LEGNOTE,
      "product-switched", [], "code", LEG + " excerpt G", "low"),
 rule("R26", "men", "Any prescription plan chosen",
      "Power Shampoo and Hair Vitamins are offered as add-ons before checkout at a reduced add-on price (older page data: tags 'pre_checkout_upsell', 'cart_upsell'). During Black Friday 2026 the shampoo was free with every plan.",
      "product-added", ["p9", "p10", "p11"], "code", "quiz-definition.json → legacyManualProductData2024 (page data of www.manual.co/hair-loss, 12 Aug 2024); banner on " + PUB + "/ and " + FPUB + "/ on 2026-11-23", "medium"),
 rule("R27", "men", "After checkout: the clinician needs more information",
      "The patient gets a message and the order waits. No reply within 10 days → the order is declined and nothing is charged. Payment for prescription medicines is only taken once the plan is accepted.",
      "flag-for-clinician", [], "docs", "Older Manual terms of sale, clauses 4.3 and 4.5 (7 Jan 2025 copy, " + ARQ + "manual-terms-of-sale-20250107.txt)", "medium"),
 rule("R28", "men", "Allergy to minoxidil, finasteride or a capsule ingredient; galactose intolerance, Lapp lactase deficiency or glucose-galactose malabsorption (question wording not seen)",
      "'You should not take our treatments if you are allergic to minoxidil, finasteride, or excipients'; finasteride tablets are not suitable with the three lactose-related conditions. The product containing the problem ingredient is removed.",
      "product-removed", ["p1", "p4", "p6"], "docs", AIO_PAGE + " and " + FIN_PAGE, "medium"),
 rule("R29", "women", "A woman reports an allergy to an ingredient",
      "'We’ll remove any active you have allergies to': the formulation is changed for her instead of the order being refused. She sees the full ingredient list before paying.",
      "strength-changed", ["p12"], "docs", "Voy women's ad page, FAQ 'What’s in it? I have allergies.' (" + FPUB + "/meta, read live 2026-11-23, src/hosts/fhl-meta.txt)", "medium"),
 rule("R30", "women", "Any woman who qualifies",
      "'Your clinician sets the strength based on your answers and medical history. You’ll see it before you confirm, and it can be changed later.' Which answers raise or lower the strength is not public.",
      "strength-changed", ["p12", "p13"], "docs", "Voy women's ad page, FAQ 'How strong is the treatment?' (" + FPUB + "/meta, src/hosts/fhl-meta.txt)", "medium"),
 rule("R31", "men", "Unknown trigger (a 'dutasteride product choice logic')",
      "The dutasteride + minoxidil capsule is offered instead of, or next to, the finasteride + minoxidil capsule. Older app code names the experiment and a dutasteride-only test; what answer or group triggers it is not public.",
      "product-switched", ["p4", "p5"], "code", LEG + " excerpt I (names only)", "low"),
 rule("R32", "men", "Plan length chosen: 1, 3 or 6 months",
      "Only the price and parcel size change, not the medicine. Every headline price ('from £13', 'from £19') is the 6-month plan with a first-order discount; older experiments pushed the 6-month plan as the recommended length.",
      "marketing-only", [], "docs", "Landing pages (src/hairloss1-home.txt); older price grids in quiz-definition.json; experiment names in " + LEG + " excerpt I", "medium"),
 rule("R33", "women", "Uncontrolled high blood pressure (question wording not seen)",
      "Voy's blog lists it among the reasons not to use minoxidil. Read as removing at least the tablets. Not seen.",
      "product-removed", ["p13", "p12"], "docs", WWW + "/blog/minoxidil-for-women-does-it-work (read through a search-engine summary)", "low")
]

# ---------------------------------------------------------------- experiments
BLK = "Stopped at step 0: HTTP 429, Vercel Security Checkpoint, 'Failed to verify your browser, Code 21'. No question shown. Not worked around."
MP = "Email box unlocked ('*Email address'), option shown as checked. No other change on the page against the baseline: same text, prices and links. No verdict before the email wall"
c['experiments'] = [
 {"id": "base-men-quiz", "flow": "men", "changed": "nothing (baseline replay of /n/hair-loss/quiz)", "result": BLK, "run": "runs/s2-retest-men"},
 {"id": "base-gateway-quiz", "flow": "gateway", "changed": "nothing (baseline replay of /n/hair-loss/quiz/gateway)", "result": BLK, "run": "runs/s2-retest-gateway"},
 {"id": "base-women-quiz", "flow": "women", "changed": "nothing (first access check of /n/female-hair-loss/quiz, the link found on the women's public pages)", "result": BLK, "run": "runs/s2-probe-female-quiz"},
 {"id": "base-popup-men", "flow": "landing-popup", "changed": "nothing (baseline man: 'Temples & Crown')",
  "result": "Pop-up opened by itself. Before the tick: six pictures, email box locked with 'Please select an option above first'. After: email box unlocked, 'Check if I qualify' active. End state: email wall; no verdict, no product, no price.", "run": "runs/s2-popup-men-base"},
 {"id": "exp-m01", "flow": "landing-popup", "changed": "popup-q1: Temples & Crown → Temples", "result": MP + " (script says: eligible).", "run": "runs/s2-exp-m01"},
 {"id": "exp-m02", "flow": "landing-popup", "changed": "popup-q1: Temples & Crown → Moderate", "result": MP + " (script says: eligible).", "run": "runs/s2-exp-m02"},
 {"id": "exp-m03", "flow": "landing-popup", "changed": "popup-q1: Temples & Crown → Extensive", "result": MP + " (script says: eligible).", "run": "runs/s2-exp-m03"},
 {"id": "exp-m04", "flow": "landing-popup", "changed": "popup-q1: Temples & Crown → Patchy", "result": MP + " (script says: NOT eligible once the email is given). The pop-up gives no hint of the refusal before taking the email.", "run": "runs/s2-exp-m04"},
 {"id": "exp-m05", "flow": "landing-popup", "changed": "popup-q1: Temples & Crown → Complete", "result": MP + " (script says: NOT eligible once the email is given).", "run": "runs/s2-exp-m05"},
 {"id": "base-popup-women", "flow": "landing-popup-women", "changed": "nothing (baseline woman: 'Widening part')",
  "result": "Pop-up opened by itself after about 7 seconds. Before the tick: four options, email box locked with 'Please select an option above first', 'Skip' link. After: email box unlocked. End state: email wall; no verdict, no product, no price.", "run": "runs/s2-popup-women-base"},
 {"id": "exp-w01", "flow": "landing-popup-women", "changed": "wpopup-q1: Widening part → Thinning temples", "result": MP + " (script says: eligible).", "run": "runs/s2-exp-w01"},
 {"id": "exp-w02", "flow": "landing-popup-women", "changed": "wpopup-q1: Widening part → General thinning", "result": MP + " (script says: eligible).", "run": "runs/s2-exp-w02"},
 {"id": "exp-w03", "flow": "landing-popup-women", "changed": "wpopup-q1: Widening part → Patchy hair loss", "result": MP + " (script says: NOT eligible once the email is given).", "run": "runs/s2-exp-w03"},
 {"id": "exp-w04", "flow": "landing-popup-women", "changed": "wpopup-q1: Widening part → Skip", "result": "Pop-up closed; the landing page is shown as before, with every button still pointing to /n/female-hair-loss/quiz. No email asked.", "run": "runs/s2-exp-w04"},
 {"id": "base-widget", "flow": "landing-pattern-widget", "changed": "nothing (baseline man: 'Hairline & crown')", "result": "Shows '94% saw their hair loss halt or improve'. Button 'Find the right treatment for me' → /n/hair-loss/quiz/gateway.", "run": "runs/s2-widget-base"},
 {"id": "exp-p01", "flow": "landing-pattern-widget", "changed": "widget-q1: Hairline & crown → At the temples", "result": "Statistic changes to '87% of men stopped losing hair & saw regrowth — Strongest long-term response'. Same button and link.", "run": "runs/s2-exp-p01"},
 {"id": "exp-p02", "flow": "landing-pattern-widget", "changed": "widget-q1: Hairline & crown → Across the hairline", "result": "Statistic changes to '90% of men saw results'. Same button and link.", "run": "runs/s2-exp-p02"},
 {"id": "exp-p03", "flow": "landing-pattern-widget", "changed": "widget-q1: Hairline & crown → Most of the top", "result": "Statistic changes to '95% responded to treatment'. Same button and link.", "run": "runs/s2-exp-p03"},
 {"id": "exp-p04", "flow": "landing-pattern-widget", "changed": "widget-q1: Hairline & crown → Thinning", "result": "Statistic changes to '63% Men saw regrowth'. Same button and link.", "run": "runs/s2-exp-p04"},
 {"id": "exp-p05", "flow": "landing-pattern-widget", "changed": "widget-q1: Hairline & crown → Top and sides", "result": "Statistic changes to '50% men saw regrowth'. Same button and link: the most advanced stage is still sent to the quiz, while the pop-up refuses 'Complete' loss.", "run": "runs/s2-exp-p05"}
]

# ---------------------------------------------------------------- recommendations
c['recommendations'] = [
 {"profile": "Baseline man: 32, receding hairline and thinning crown, no medical issues, no preference",
  "offered": ["p6", "p8", "p4", "p1", "p2", "p3"], "default": "p6",
  "note": "NOT a quiz result: the quiz could not be opened. The pop-up passes him ('Temples & Crown' → eligible, page script). Voy's stated default for men: 'We recommend that men use both of these treatments together'; the combined plan is tagged 'Most effective' and 'Best for maximum results', as tablet + spray or as the one-a-day capsule. Headline price from £19 a month on a 6-month plan (first order); full price about £33 to £44 a month.",
  "evidence": "docs"},
 {"profile": "Baseline woman: 38, widening parting, not pregnant or breastfeeding, no medical issues",
  "offered": ["p12", "p13", "p11"], "default": "p12",
  "note": "NOT a quiz result. The pop-up passes her ('Widening part' → eligible, page script). Voy: 'Evidence supports minoxidil as the preferred treatment for female hair loss'; the serum is the lead product, tablets the alternative, strength set by the clinician. From £14.99 to £24 a month (serum) or £15 a month (tablets).",
  "evidence": "docs"},
 {"profile": "Man who ticks 'Patchy' or 'Complete' in the landing pop-up", "offered": [], "default": None,
  "note": "'You aren't eligible. Based on your answers there is no treatment suitable for you.' Shown only after he has given an email. No referral or advice.", "evidence": "code"},
 {"profile": "Woman who ticks 'Patchy hair loss' in the landing pop-up", "offered": [], "default": None,
  "note": "Same 'You aren't eligible' screen, also only after the email.", "evidence": "code"},
 {"profile": "Anyone whose answer is on a question's reject list inside the quiz (older engine)", "offered": [], "default": None,
  "note": "'You aren't eligible' with a 'Review your answers' button behind the tick box 'I agree only to provide accurate responses'. Changed answers are recorded for the prescriber.", "evidence": "code"},
 {"profile": "Man for whom DHT blockers are ruled out (trying to conceive or partner pregnant, prostate treatment with a 5-alpha-reductase inhibitor, past breast or prostate cancer, severe depression)",
  "offered": ["p2", "p3"], "default": "p2",
  "note": "Worked out from Voy's published cautions, not seen: finasteride and dutasteride products go, minoxidil-only plans (spray or tablets) remain.", "evidence": "inferred"},
 {"profile": "Man for whom minoxidil is ruled out (low or uncontrolled blood pressure; over 65)", "offered": ["p1"], "default": "p1",
  "note": "Worked out from Voy's published cautions, not seen: finasteride tablets alone remain. For over-65s it is not known whether the quiz stops the patient instead.", "evidence": "inferred"},
 {"profile": "Man with a sore, red or irritated scalp", "offered": ["p4", "p1", "p3"], "default": "p4",
  "note": "Worked out, not seen: sprays go, tablets and capsules remain. The older Manual page pitches the capsule at men with 'irritated dry scalps' from solutions.", "evidence": "inferred"},
 {"profile": "Man under 18, or a completely bald man", "offered": [], "default": None, "note": "Not treated (Voy's published cautions). The screen was not seen.", "evidence": "docs"},
 {"profile": "Woman who is pregnant or breastfeeding", "offered": [], "default": None,
  "note": "Voy says minoxidil is not recommended for either group and sells women nothing else, so this is read as a stop. Not seen.", "evidence": "inferred"},
 {"profile": "Woman trying to conceive, or with a heart or blood-pressure condition", "offered": ["p12"], "default": "p12",
  "note": "Voy says the tablets are not appropriate; whether the serum is still offered is unknown.", "evidence": "inferred"},
 {"profile": "Visitor on the product-first route whose chosen product is ruled out by an answer (older engine)", "offered": [], "default": None,
  "note": "The product is swapped for an eligible one (swap=true) rather than refused. Which product replaces which is in the quiz definition, which could not be read.", "evidence": "code"}
]

# ---------------------------------------------------------------- summary texts
c['engineSummary'] = (
 "Voy's real quiz could not be opened, so this is the engine as far as public evidence shows it. "
 "Step 1 is a pattern gate. The landing pages for men and women each open a one-question pop-up; its own script refuses 'Patchy' and 'Complete' (men) and "
 "'Patchy hair loss' (women) with 'You aren't eligible', and sends everyone else to the quiz with a discount code. The refusal is only shown after an email is "
 "given: ticking a refused option looks exactly like ticking an accepted one (replays). A separate pattern picker is pure marketing: every pattern leads to the same quiz link. "
 "Step 2 is the quiz, one question per page. Older code of the same web app (Manual, December 2025) shows how it decides. The quiz starts with a list of products. "
 "Each question can carry three things: a reject list (if your answer is on it, no product is left and you get the 'You aren't eligible' screen, with a "
 "'Review your answers' button), an exclude list (your answer removes named products and the quiz carries on), and a parent rule or a JSON Logic condition "
 "(your answer opens, hides or rewords later questions). So one answer either stops you, or removes a medicine, or opens follow-up questions; in that code an answer never adds a medicine. "
 "Voy's published 'who should not use it' lists say which answers do what: DHT blockers (finasteride, dutasteride) go if the man is trying for a baby, is treated for "
 "an enlarged prostate, has had breast or prostate cancer, or has severe depression; minoxidil goes with low or uncontrolled blood pressure, a sore scalp (sprays) or "
 "age over 65; under-18s, women in the men's flow, non-pattern loss and complete baldness are refused. "
 "Step 3 is the recommendation: from what is left, Voy leads with finasteride plus minoxidil together (tablet + spray, or one capsule), then asks for the format and the "
 "plan length (1, 3 or 6 months, which changes only the price), then offers shampoo and vitamins. Women are only ever offered minoxidil (serum or tablets), at a strength "
 "the clinician sets. Step 4 is the account, a medical-history questionnaire, optional photos and payment details; a prescriber then reviews everything, sees flagged and "
 "changed answers, and approves, asks questions or cancels. Payment is taken only on approval. "
 "Which exact question and option triggers each removal is not known: the question list is downloaded by the app at run time and the app sits behind a security checkpoint.")

c['strengths'] = [
 "Widest men's range of the UK players: licensed finasteride, 10% (and 5%) minoxidil spray, 2.5 mg oral minoxidil, two one-a-day combined capsules (finasteride or dutasteride with minoxidil) and a topical finasteride + minoxidil spray — '30+ treatment combinations'.",
 "An engine built to keep the customer: an answer usually removes one medicine and leaves the rest on offer, and on the product-first route an unsuitable product is swapped rather than refused. As far as the public rules show, hard refusals are kept for the pattern gate, age and sex.",
 "Low entry prices in adverts (from £13 to £19 a month for men, £14.99 to £15 for women on first order), payment only after clinician approval, a 180-day Money Back Promise, free clinician calls and a photo progress tracker.",
 "One-pill-a-day and once-a-day-spray formats that are easy to stick to; its own published 502-patient evaluation of the combined capsule; full written treatment plans with clear 'who should not take it' and fertility sections.",
 "A women's service under the same roof with its own dermatologist lead, a strength set per patient and an offer to remove an active a woman is allergic to.",
 "Own pharmacy and in-house prescribers, next-day delivery, pause / switch / cancel in the account, and heavy conversion testing (about 70 live experiment flags on the day)."
]
c['weaknesses'] = [
 "The eligibility pop-up takes the email first and gives the verdict second: someone with patchy or complete loss hands over contact details only to be told 'You aren't eligible', with no explanation, advice or referral.",
 "Marketing contradicts the gate: the pattern picker promises results for the most advanced stage (50% to 63% 'saw regrowth') while the pop-up refuses complete loss.",
 "Thin diagnosis: public material points to a picture choice and yes/no medical screens. Nothing public shows questions on shedding speed, scalp symptoms beyond soreness, diet, iron, thyroid, hormones or medicines that cause hair loss; photos are for tracking, not for diagnosis before the first prescription.",
 "Thin women's range: minoxidil only (serum or tablets) plus vitamins, for every cause Voy itself lists (hormonal, menopause, postpartum, stress). No blood tests in the hair pathway, although the company sells them for other services.",
 "Regulatory record of the pharmacy: GPhC found standards not all met in March and August 2026 (answers not independently verified; clinical checks on only a sample; unlawful advertising of prescription-only medicines), with enforcement, before a clean re-inspection in October 2026. The 'review your answers' button on the refusal screen is the kind of answer-changing the regulator worries about, even though changes are logged.",
 "Opaque: medicine names are hidden on ad pages ('Hair Oral Treatment', 'DHT blockers'), several products are unlicensed specials without that being said up front, strengths for women are not published, and the help centre is locked behind sign-in.",
 "Headline prices are first-order promotions on a 6-month plan; standing prices are roughly double to triple, and pages contradict each other (women's serum: £14.99, £24 and £39)."
]
c['opportunities'] = [
 "Give the verdict before asking for contact details, and never dead-end: for patchy, sudden or complete loss explain the likely causes and route to a clinician review, a GP letter or a dermatology referral.",
 "Diagnose properly where Voy only screens: ask about speed of loss, shedding, scalp symptoms, periods and menopause, recent illness, diet and medicines; use baseline photos reviewed by a clinician before the first prescription; offer ferritin, thyroid and hormone tests when the answers point that way.",
 "Build a real women's pathway (cause work-up, topical and oral minoxidil at stated strengths, spironolactone and other anti-androgens where appropriate, menopause link, postpartum advice) instead of one medicine for every cause.",
 "Be transparent where Voy is not: every active and strength, licensed or unlicensed status, the standing price for each plan length and the full eligibility rules, all visible before any email is asked for.",
 "Make safety a feature: verify key answers (GP summary or NHS App record, blood-pressure reading before oral minoxidil), run structured mood and sexual side-effect check-ins on DHT blockers (Voy's own study admits it had none), and explain refusals instead of offering a 'review your answers' button.",
 "Offer what Voy does not: lower-dose and stepwise oral minoxidil, topical-only DHT-blocker routes with clear strengths for men who fear tablets, options for men trying to conceive, and care for over-65s rather than a blanket exclusion."
]

c['sources'] += [
 {"title": "Voy women's hair-loss page (public host, same page as www.joinvoy.com/female-hair-loss) — opened 2026-11-23", "url": FPUB + "/"},
 {"title": "Voy women's ad pages: search, social ('What to expect, honestly'), clinician-led, oral tablets, serum — opened 2026-11-23", "url": FPUB + "/meta"},
 {"title": "Voy women's ad page: Minoxidil Serum", "url": FPUB + "/shopping-serum"},
 {"title": "Voy women's ad page: Hair Oral Treatment", "url": FPUB + "/shopping-oral-tablets"},
 {"title": "Voy blog: Minoxidil for Women: Does It Work & Is It Safe? (blocked; read via search summary)", "url": WWW + "/blog/minoxidil-for-women-does-it-work"},
 {"title": "Voy blog: Dutasteride vs Finasteride (blocked; read via search summary)", "url": WWW + "/blog/dutasteride-vs-finasteride"},
 {"title": "Portuguese Web Archive (arquivo.pt): index of archived www.manual.co pages", "url": "https://arquivo.pt/wayback/cdx?url=manual.co*&output=json"},
 {"title": "Archived Manual web app shared script, 29 Dec 2025 (quiz engine code)", "url": "https://arquivo.pt/noFrame/replay/20251229132709id_/https://www.manual.co/_next/static/chunks/pages/_app-3d7f064791016865.js"},
 {"title": "Archived Manual web app route list, 29 Dec 2025", "url": "https://arquivo.pt/noFrame/replay/20251229132721id_/https://www.manual.co/_next/static/7kjluk5Um9FUSvhQJnmEA/_buildManifest.js"},
 {"title": "Archived Manual treatment plan: All-in-One Capsule, 7 Jan 2025 ('Who should not take it?')", "url": "https://arquivo.pt/noFrame/replay/20250107081132id_/https://www.manual.co/treatments/all-in-one-capsule-treatment-plan"},
 {"title": "Archived Manual treatment plan: Finasteride, 7 Jan 2025", "url": "https://arquivo.pt/noFrame/replay/20250107081139id_/https://www.manual.co/treatments/finasteride-treatment-plan"},
 {"title": "Archived Manual hair-loss page with product data and prices, 12 Aug 2024", "url": "https://arquivo.pt/noFrame/replay/20240812115531id_/https://www.manual.co/hair-loss"},
 {"title": "Archived Manual terms of sale, 7 Jan 2025 (online consultation process)", "url": "https://arquivo.pt/noFrame/replay/20250107081105id_/https://www.manual.co/pages/terms-of-sale"},
 {"title": "Certificate transparency log used to find Voy's public hosts", "url": "https://crt.sh/?q=%25.joinvoy.com"},
 {"title": "Customer video review (title only; content not readable): I Tried VOY Dutasteride & Minoxidil For 90 Days", "url": "https://www.youtube.com/watch?v=UtYPffSp-hc"}
]

c['limitations'] = [
 "No real consultation question was seen, in either stage. /n/hair-loss/quiz, /n/hair-loss/quiz/gateway, ?flowType=atc and /n/female-hair-loss/quiz all sit behind a security checkpoint that blocked the browser, curl and the web-fetch tool; it was not worked around. So there is no list of quiz questions and options in this file, and no rule of the form 'question N, option M' for the quiz itself.",
 "The only one-change experiments that could be run are on the three public mini-flows (men's pop-up, women's pop-up, pattern picker): 17 replays (3 baselines and 14 one-change runs) plus 3 blocked access checks. Every rule about the quiz proper is 'code' (older app or landing-page script) or 'docs', never 'observed'.",
 "The engine rules R21 to R25 and R31 come from the shared script of the Manual web app as archived on 29 Dec 2025. Manual became Voy and the code base is the same (the script already carries Voy wording), but 11 months have passed: today's engine may differ. The script holds the mechanism, not the content: which answers reject or remove which products is in a quiz definition that the app downloads at run time and that could not be read.",
 "Rules R3 to R14, R28 and R33 map Voy's published 'who should not use it' lists onto products. The lists are solid (two are word-for-word copies of older Manual treatment-plan pages; the current help-centre lists were confirmed by two separate search summaries), but whether the quiz removes a product, warns, or leaves it to the clinician was not seen. The older wording on trying to conceive and on past depression is softer than the current FAQ.",
 "Not tested, because no quiz screen was reachable: sex, age bands, pregnancy and breastfeeding, menopause, speed and duration of loss, scalp symptoms, family history, each medical condition, medicines, allergies, previous treatments and side effects, format preference, goals and lifestyle. Of the protocol's priority list only the hair-pattern item could be tested, and only on the pop-ups.",
 "Unknown and not guessed: what makes the dutasteride capsule or the 5% spray appear; whether pattern severity changes the default plan; the strengths of the women's serum and tablets and what else is in the serum; the dutasteride capsule's strengths and price; whether the all-in-one spray and the 5% spray are still sold; where exactly today's flow asks for sign-in.",
 "Prices are a moving target: Black Friday promotions were running (16 to 30 Nov 2026); landing pages show first-order 'from' prices on a 6-month plan; full price grids are from older Manual page data (Aug 2024) or search summaries.",
 "Leads not followed, on purpose: the app's own server address named in a 2024 page, the quiz page scripts listed in the archived route list (they exist only on the blocked hosts), any /shop-api/ address named in code, and the help-centre programming interface. Leads that failed: Wayback Machine, archive.ph and Common Crawl (unreachable from this machine)."
]

json.dump(c, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('wrote', os.path.normpath(OUT), '|', len(c['products']), 'products', len(c['flows']), 'flows', len(c['rules']), 'rules', len(c['experiments']), 'experiments')
