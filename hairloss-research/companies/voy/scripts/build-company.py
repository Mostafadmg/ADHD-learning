#!/usr/bin/env python3
# build-company.py — writes ../company.json for Voy (stage 1, MAP). Run: python3 -I scripts/build-company.py
# Everything here is hand-entered from the evidence files named in notes.md. Nothing is generated or guessed:
# where a fact could not be found the text says "unknown".
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'company.json')

WWW = 'https://www.joinvoy.com'
PUB = 'https://hairloss1.joinvoy.com'          # public official host, same Webflow pages as www.joinvoy.com/hair-loss
HC = 'https://joinvoy.zendesk.com/hc/en-gb/articles/'
VIA = ' (read through a search-engine summary on 2026-11-23; the page itself could not be opened)'

# ---------------------------------------------------------------- products
products = [
 {
  "id": "p1", "name": "Finasteride Plan (finasteride 1 mg tablets)", "category": "rx-oral",
  "actives": [{"name": "finasteride", "strength": "1 mg"}],
  "form": "tablet, one a day", "audience": "men",
  "legalStatus": "POM, licensed medicine (Voy's product page labels it 'UK Licensed medication', as read through a search-engine summary). In 2023 the pharmacy, then called Manual, took finasteride 1 mg tablets out of the maker's blister packs and repacked them in its own branded packaging (GPhC inspection report, 13 Nov 2023); whether it still does is unknown.",
  "price": "From £13 a month on a 6-month plan (promotional first-order price; shown with £33 struck through)",
  "priceDetail": "Public landing pages on 2026-11-23 show 'From £33 £13 per month' and a Black Friday banner '50% off hair loss plans. Free shampoo with every plan. 16/11 to 30/11'. Voy's product page" + VIA + " says monthly, 3-month and 6-month plans exist and shows '£44.00 for month 1 of your plan' for monthly billing. Older Manual page: 'Get started from £15'. Full (non-promotional) price per plan length: unknown.",
  "url": WWW + "/hair-loss/treatments/finasteride",
  "recommendedWhen": "Sold as 'Finasteride hair loss plans — Shields against hair loss' for men with male pattern hair loss. Voy says it recommends combining it with minoxidil. The exact quiz rule that offers it alone is unknown (quiz blocked).",
  "evidence": "docs"
 },
 {
  "id": "p2", "name": "Minoxidil Spray, extra strength 10% (label: 'Hair Treatment Spray')", "category": "rx-topical-compounded",
  "actives": [{"name": "minoxidil", "strength": "10% (from Voy's help-centre guide and the older Manual product code minoxidil_topical_10)"}],
  "form": "scalp spray, 90 ml bottle; 1 ml (7 sprays) once a day", "audience": "men",
  "legalStatus": "Prescription-only as supplied; 10% is above the licensed UK strengths (2% and 5%), so it is an unlicensed special. Voy's own blog calls the 10% strength 'off-label'. Who makes it: unknown.",
  "price": "From £14 a month on a 6-month plan (promotional first-order price; shown with £33 struck through)",
  "priceDetail": "Public landing pages on 2026-11-23: 'From £33 £14 per month'. Older Manual page code (still live): full price £29.67 a month on a 3-month plan (1 × 90 ml) and £25 a month on a 6-month plan (2 × 90 ml); first-order promo £14–16 and £13–14. Voy's product page" + VIA + ": 'From £14 per month based on a 6-month plan'. Voy's how-to blog also describes a 5% spray used twice a day; whether 5% is a current Voy product is unknown.",
  "url": WWW + "/hair-loss/treatments/minoxidil",
  "recommendedWhen": "Sold as 'Minoxidil hair loss plans — Stimulates hair growth' (format 'Tablet or spray'). Offered alone or with a DHT blocker. Voy's published cautions say minoxidil is not for under-18s, over-65s, sore or red scalp, or low blood pressure. Exact quiz rule unknown.",
  "evidence": "docs"
 },
 {
  "id": "p3", "name": "Oral minoxidil for men (label: 'Hair Oral Treatment' / 'Oral Hair Treatments')", "category": "rx-oral",
  "actives": [{"name": "minoxidil", "strength": "unknown for the stand-alone product (Voy's combined capsule uses 2.5 mg)"}],
  "form": "tablet or capsule, one a day (older Manual code: 90 capsules per 3 months)", "audience": "men",
  "legalStatus": "Prescription-only; oral minoxidil has no UK licence for hair loss (Voy's blog says so), so it is off-label, and if supplied as a made-up capsule it is an unlicensed special. Which of the two applies: unknown.",
  "price": "From £14 a month (promotional; shown with £33 struck through)",
  "priceDetail": "Landing page 'Minoxidil Treatment' (2026-11-23): 'Oral Hair Treatments — Once daily tablets or capsules to promote fuller, thicker hair — From £33 £14 per month'. Older Manual page code: full £29.67 a month (3-month plan, 90 capsules) and £25 a month (6-month plan, 180 capsules).",
  "url": WWW + "/hair-loss/a/hair-loss-tablets",
  "recommendedWhen": "The tablet form of the minoxidil plan. Voy's landing FAQ says oral minoxidil is 'more effective' than topical for men who lack the scalp enzyme that activates topical minoxidil. Exact quiz rule unknown.",
  "evidence": "docs"
 },
 {
  "id": "p4", "name": "All-in-One Hair Capsule: finasteride + minoxidil (+ biotin)", "category": "rx-oral-compounded",
  "actives": [{"name": "finasteride", "strength": "1 mg"}, {"name": "minoxidil", "strength": "2.5 mg"}, {"name": "biotin", "strength": "10 mg"}],
  "form": "capsule (also called a tablet in Voy's own texts), one a day", "audience": "men",
  "legalStatus": "POM, unlicensed special (compounded). Voy's help centre: 'this specific combination is not yet licensed in the UK for treating hair loss'.",
  "price": "From £19 a month on a 6-month plan (promotional; shown with £33 struck through)",
  "priceDetail": "Strengths come from the older Manual listing ('90 x 1mg Finasteride, 2.5mg Minoxidil, 10mg Biotin'), the Manual product code finasteride_oral_minoxidil_oral_biotin and Manual/Menwell's own published service evaluation (finasteride 1 mg + minoxidil 2.5 mg a day); not re-checked on a live Voy page. Older Manual page code (still live): full £39.67 a month on a 3-month plan (90 capsules, £119 per 3 months) and £33.17 a month on a 6-month plan (180 capsules); first-order promo £21–24 and £18–19 a month.",
  "url": WWW + "/hair-loss/a/all-in-one-treatment",
  "recommendedWhen": "Voy's 'Hair Oral Plans — Capsules' and the oral half of 'All-in-One Plans'. Marketed as the one-pill option for men who want both a DHT blocker and minoxidil. Exact quiz rule unknown.",
  "evidence": "docs"
 },
 {
  "id": "p5", "name": "All-in-One Capsule: dutasteride + minoxidil", "category": "rx-oral-compounded",
  "actives": [{"name": "dutasteride", "strength": "unknown"}, {"name": "minoxidil", "strength": "unknown"}],
  "form": "capsule, one a day", "audience": "men",
  "legalStatus": "POM, unlicensed special (compounded). Dutasteride has no UK licence for hair loss.",
  "price": "unknown",
  "priceDetail": "Only known from the title and opening lines of a Voy help-centre guide" + VIA + ". No price or strength found.",
  "url": HC + "48437360723604-A-guide-to-our-Dutasteride-Minoxidil-All-in-One-Capsule",
  "recommendedWhen": "unknown. Voy's pages talk about 'DHT Blockers like Dutasteride and Finasteride', so dutasteride is a second DHT-blocker choice; when the quiz or clinician picks it is not public.",
  "evidence": "docs"
 },
 {
  "id": "p6", "name": "Complete Hair Loss Plan (finasteride tablet + minoxidil spray)", "category": "bundle",
  "actives": [{"name": "finasteride", "strength": "1 mg tablet"}, {"name": "minoxidil", "strength": "spray, strength not stated on the plan page (see p2)"}],
  "form": "1 tablet a day + 1–2 spray applications a day", "audience": "men",
  "legalStatus": "Bundle of a licensed POM tablet and a prescription spray (unlicensed if the 10% spray is used).",
  "price": "From £19 a month on a 6-month plan (promotional; shown with £33 struck through)",
  "priceDetail": "Voy's plan page" + VIA + ": monthly billing £44.00 a month; 3-month plan £39.67 a month ('£119.00 for the first 3 months'); 6-month plan £33.17 a month; 'From £19 per month based on a 6-month plan'. Public landing page card: 'Complete hair loss plan — Most effective — Format: Tablet, spray or combination — From £33 £19 per month'.",
  "url": WWW + "/hair-loss/treatments/complete-hair-loss-plan",
  "recommendedWhen": "Voy's default for men: 'We recommend that men use both of these treatments together' and the card is tagged 'Most effective / Best for maximum results'.",
  "evidence": "docs"
 },
 {
  "id": "p7", "name": "All-in-One Spray: topical finasteride + minoxidil 10% + azelaic acid", "category": "rx-topical-compounded",
  "actives": [{"name": "finasteride (topical)", "strength": "unknown"}, {"name": "minoxidil", "strength": "10%"}, {"name": "azelaic acid", "strength": "5%"}],
  "form": "scalp spray, once a day", "audience": "men",
  "legalStatus": "POM, unlicensed special (compounded). Topical finasteride has no UK licence.",
  "price": "unknown",
  "priceDetail": "Described on older Manual product pages (manual.co/treatments/All-in-one-spray and /minoxidil-finasteride-spray-treatment-plan)" + VIA + ". Signs it is still sold by Voy: Voy's blog lists 'an all-in-one topical spray combining finasteride and minoxidil', and a live experiment flag is named 'exp-sem-aiospray-quiz-test'. Not confirmed on a live Voy product page.",
  "url": "https://www.manual.co/treatments/All-in-one-spray",
  "recommendedWhen": "unknown. Voy's FAQ says that for side effects a clinician may suggest 'switching to a topical treatment, which may have fewer side effects', so a topical DHT-blocker route exists. Older Manual text: not for women, not for scalp conditions or inflammation, not with a 5-alpha-reductase inhibitor for prostate enlargement, not with allergy to its ingredients.",
  "evidence": "docs"
 },
 {
  "id": "p8", "name": "All-in-One Plan / Combined Oral and Spray Plan (oral capsule + minoxidil spray)", "category": "bundle",
  "actives": [{"name": "DHT blocker (finasteride, or dutasteride)", "strength": "see p4 / p5"}, {"name": "minoxidil", "strength": "oral in the capsule and/or 10% spray, exact make-up not stated"}],
  "form": "'Spray & Capsules'", "audience": "men",
  "legalStatus": "Bundle of prescription items; includes unlicensed specials.",
  "price": "From £19 a month (promotional; shown with £33 struck through)",
  "priceDetail": "Landing-page cards (2026-11-23): 'All-in-One Plans — Spray & Capsules — Topical and oral plan to prevent further loss while stimulating hair growth — Best for maximum results — From £33 £19 per month'; also named 'Combined Oral and Spray Plans' and 'Oral & Topical Complete Plan'. Voy generic-names the items on these pages ('Hair Oral Plans', 'Hair Spray Plans', 'DHT Blockers'), so the exact contents are not shown. It may be the same thing as p6 with a capsule instead of a tablet.",
  "url": WWW + "/hair-loss/a/all-in-one-treatment",
  "recommendedWhen": "Shown first on the paid-search and social landing pages as 'Best for maximum results'.",
  "evidence": "docs"
 },
 {
  "id": "p9", "name": "Power Shampoo", "category": "cosmetic",
  "actives": [{"name": "caffeine", "strength": "not stated"}, {"name": "biotin", "strength": "not stated"}, {"name": "saw palmetto", "strength": "not stated"}],
  "form": "sulfate-free shampoo (older Manual retail listing: 200 ml)", "audience": "men",
  "legalStatus": "cosmetic",
  "price": "£10.00 a month on a '3 every 6 months' option",
  "priceDetail": "Price from Voy's product page" + VIA + "; as an add-on to a plan it was shown at '£11.90 for the first 2 months'. Black Friday 2026 banner: 'Free shampoo with every plan' (16–30 Nov). Other listed ingredients: niacinamide, wheat protein, ginger root extract.",
  "url": WWW + "/hair-loss/treatments/power-shampoo",
  "recommendedWhen": "Add-on / upsell, not a treatment. Voy's own FAQ: 'Finasteride and Minoxidil are the only proven treatments.'",
  "evidence": "docs"
 },
 {
  "id": "p10", "name": "Hair Vitamins for men", "category": "supplement",
  "actives": [{"name": "biotin", "strength": "1800 mcg per capsule"}, {"name": "selenium", "strength": "55 mcg per capsule"}, {"name": "zinc", "strength": "not stated"}, {"name": "collagen, L-lysine, L-methionine", "strength": "not stated"}],
  "form": "capsule", "audience": "men",
  "legalStatus": "food supplement",
  "price": "£18 (older Manual page: 'Get started from £18', one-off)",
  "priceDetail": "Ingredient amounts from Voy's men's vitamins page" + VIA + ". Voy's help guide describes a newer men's formula (fish collagen, horsetail extract, CoQ10, zinc bisglycinate, selenium yeast). Current Voy price per plan: unknown (the women's version is £18 a month).",
  "url": WWW + "/hair-loss/treatments/hair-vitamins",
  "recommendedWhen": "Add-on. Voy's help centre says vitamins 'won't treat male-pattern hair loss on their own'.",
  "evidence": "docs"
 },
 {
  "id": "p11", "name": "Hair Vitamins for women", "category": "supplement",
  "actives": [{"name": "biotin, collagen, zinc, selenium, amino acids", "strength": "not stated"}],
  "form": "capsule", "audience": "women",
  "legalStatus": "food supplement",
  "price": "£18 a month",
  "priceDetail": "Voy's women's vitamins page" + VIA + ": '£18 for month 1 of your plan', then £18 a month.",
  "url": WWW + "/female-hair-loss/treatments/hair-vitamins",
  "recommendedWhen": "Add-on next to minoxidil; Voy says vitamins alone are unlikely to treat the cause.",
  "evidence": "docs"
 },
 {
  "id": "p12", "name": "Women's topical minoxidil plan ('Minoxidil Serum' / 'Topical Sprays & Serums')", "category": "rx-topical-compounded",
  "actives": [{"name": "minoxidil", "strength": "unknown (Voy's page only says 2% and 5% both work for women)"}],
  "form": "scalp serum or spray, applied daily", "audience": "women",
  "legalStatus": "unknown. Sold as a clinician-prescribed plan; a 'serum' is not a standard licensed UK format, so it is probably a compounded special, but that is an inference.",
  "price": "From £24 a month",
  "priceDetail": "Voy's women's pages" + VIA + " disagree with each other: 'topical treatments from £24.00 per month', 'from £39 £14.99 per month', structured-data price 39 GBP, and '60% off your first Minoxidil Serum'. Plan lengths: unknown.",
  "url": WWW + "/female-hair-loss/treatments/minoxidil-plans",
  "recommendedWhen": "Voy's first choice for women ('Evidence supports minoxidil as the preferred treatment for female hair loss'). Voy says minoxidil is not recommended in pregnancy or while breastfeeding. Exact quiz rule unknown.",
  "evidence": "docs"
 },
 {
  "id": "p13", "name": "Women's oral minoxidil plan ('Oral Hair Treatment')", "category": "rx-oral",
  "actives": [{"name": "minoxidil", "strength": "unknown"}],
  "form": "tablet or capsule, one a day", "audience": "women",
  "legalStatus": "Prescription-only, off-label (Voy's blog: minoxidil tablets 'are not currently licensed in the UK specifically for hair loss'). If supplied as a made-up low-dose capsule it is an unlicensed special: unknown.",
  "price": "From £15 a month (shown with £25 struck through)",
  "priceDetail": "Voy's women's pages" + VIA + ". A shopping landing page exists at /female-hair-loss/shopping-oral-tablets.",
  "url": WWW + "/female-hair-loss/shopping-oral-tablets",
  "recommendedWhen": "Alternative to the topical plan. Voy's blog: not appropriate if pregnant, trying to conceive or breastfeeding, or with certain heart or blood pressure conditions. Exact quiz rule unknown.",
  "evidence": "docs"
 },
 {
  "id": "p14", "name": "Included service: clinician support, hair progress photo tracker and 180-day Money Back Promise", "category": "service",
  "actives": [],
  "form": "online account, phone, email, WhatsApp, video call", "audience": "both",
  "legalStatus": "service (prescribing service regulated by the CQC; medicines dispensed by Voy Pharmacy, GPhC premises 9012909)",
  "price": "Included in every plan",
  "priceDetail": "Money Back Promise: use the treatment for 180 days, attend 2 free online consultations, take monthly progress photos, then ask for a refund between day 180 and day 210 after the first delivery; only the treatment subscription is refunded, not shampoo or vitamins (older Manual help page" + VIA + "). Voy's terms are said to need at least 5 sets of progress photos.",
  "url": WWW + "/hair-loss/guarantee",
  "recommendedWhen": "Always included ('Flexible delivery options, Cancel any-time subscription, Ongoing expert medical advice, Money back promise').",
  "evidence": "docs"
 },
]

# ---------------------------------------------------------------- flows
def opt(label, effect, etype, affects, ev):
    return {"label": label, "effect": effect, "effectType": etype, "affects": affects, "evidence": ev}

ALL_MEN_RX = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"]
ELIG = "After the email is given, the pop-up shows 'We’ve helped thousands of men regrow thicker, healthier hair' and a button 'Take the next step to treatment' that opens /n/hair-loss/quiz/gateway (the coupon in the page address is carried over). No product is chosen at this point."
INELIG = "After the email is given, the pop-up shows 'You aren't eligible — Based on your answers there is no treatment suitable for you' with only a 'Return to homepage' button. The route to the quiz is not offered."

flows = [
 {
  "id": "landing-popup", "name": "Landing-page eligibility pop-up (a one-question pre-quiz)", "audience": "men",
  "entryUrl": WWW + "/hair-loss",
  "stagesSummary": "Opens by itself 20 seconds after a hair-loss landing page loads → 1 picture question → email address (contact wall, not passed) → 'eligible' screen with a link to the real quiz, or 'not eligible' stop screen. Question and options seen live on the public host hairloss1.joinvoy.com; what happens after the email was read from the page's own script, not run. Proof: runs/landing-popup (live), quiz-definition.json (script).",
  "questions": [
   {
    "id": "popup-q1", "order": 1, "stage": "anonymous",
    "text": "Which image best matches your hair loss?",
    "type": "single",
    "options": [
      opt("Temples", ELIG, "next-question", [], "code"),
      opt("Temples & Crown", ELIG, "next-question", [], "code"),
      opt("Moderate", ELIG, "next-question", [], "code"),
      opt("Extensive", ELIG, "next-question", [], "code"),
      opt("Patchy", INELIG, "hard-stop", ALL_MEN_RX, "code"),
      opt("Complete", INELIG, "hard-stop", ALL_MEN_RX, "code"),
    ],
    "purpose": "Checks in one tap whether the hair loss looks like male pattern baldness that medicines can help. Patchy loss suggests another cause (for example alopecia areata); complete baldness means there is nothing left to regrow. It also collects an email address and attaches a discount code.",
    "engineRole": "eligibility-gate",
    "branches": True,
    "branchDetail": "Patchy or Complete → 'You aren't eligible' stop screen. The other four → 'Take the next step to treatment' link to the quiz gateway. The answer is also sent to marketing with the email (hidden fields promotion=hairlosstype, campaign=webflow_pop_entry_manual_hl).",
    "shownWhen": "always, 20 seconds after page load (intro line: 'Let us know which image best matches your hair loss and check if you’re eligible for treatment')",
    "evidence": "observed"
   },
   {
    "id": "popup-q2", "order": 2, "stage": "anonymous",
    "text": "*Email address (button: 'Check if I qualify'). Small print: 'Your details help us recommend the right treatment for you — based on how your body works. By entering I agree to the Terms and Conditions'",
    "type": "contact", "options": [],
    "purpose": "Lead capture. The verdict is only shown after an email is entered. The box is locked ('Please select an option above first') until a picture is chosen.",
    "engineRole": "data-capture", "branches": False, "branchDetail": "",
    "shownWhen": "always; unlocks once a picture is ticked. This is the contact wall for this mini-flow: not passed.",
    "evidence": "observed"
   },
   {
    "id": "popup-q3", "order": 3, "stage": "after-account",
    "text": "We’ve helped thousands of men regrow thicker, healthier hair. [Take the next step to treatment — Answer a few more questions to get your personalised plan and your discount will apply at checkout]",
    "type": "info", "options": [],
    "purpose": "Hands the visitor on to the real consultation with the discount code attached.",
    "engineRole": "marketing", "branches": False, "branchDetail": "",
    "shownWhen": "after the email is submitted, when the picture was Temples, Temples & Crown, Moderate or Extensive",
    "evidence": "code"
   },
   {
    "id": "popup-q4", "order": 4, "stage": "after-account",
    "text": "You aren't eligible. Based on your answers there is no treatment suitable for you. [Return to homepage]",
    "type": "info", "options": [],
    "purpose": "Stops people whose hair-loss pattern the medicines do not treat.",
    "engineRole": "eligibility-gate", "branches": False, "branchDetail": "",
    "shownWhen": "after the email is submitted, when the picture was Patchy or Complete",
    "evidence": "code"
   },
  ]
 },
 {
  "id": "landing-pattern-widget", "name": "Landing-page 'See what results are possible for you' pattern picker", "audience": "men",
  "entryUrl": WWW + "/hair-loss/a/hair-loss-tt-v3",
  "stagesSummary": "A marketing widget on a social landing page, not part of the consultation: tap one of six head pictures and the page shows a success statistic for that stage, then a button into the quiz gateway. No data entry. Proof: runs/pattern-widget and runs/shots-public (live), quiz-definition.json (page code).",
  "questions": [
   {
    "id": "widget-q1", "order": 1, "stage": "anonymous",
    "text": "Select the pattern closest to yours",
    "type": "single",
    "options": [
      opt("At the temples", "Shows '87% of men stopped losing hair & saw regrowth — Strongest long-term response', then a 'Find the right treatment for me' button to the quiz gateway.", "marketing-only", [], "code"),
      opt("Across the hairline", "Shows '90% of men saw results — Studies show 9/10 men respond to treatment', then the same button.", "marketing-only", [], "code"),
      opt("Hairline & crown", "Shows '94% saw their hair loss halt or improve', then the same button.", "marketing-only", [], "observed"),
      opt("Most of the top", "Shows '95% responded to treatment', then the same button.", "marketing-only", [], "code"),
      opt("Thinning", "Shows '63% Men saw regrowth' (text speaks of advanced or extensive hair loss), then the same button.", "marketing-only", [], "code"),
      opt("Top and sides", "Shows '50% men saw regrowth' (text: 'hair loss is most advanced at this stage'), then the same button.", "marketing-only", [], "code"),
    ],
    "purpose": "Sets expectations and persuades: every stage, even the most advanced, is told treatment can help, and every answer leads to the quiz. Note the clash with the pop-up, which turns away 'Complete' loss.",
    "engineRole": "expectation-setting", "branches": False,
    "branchDetail": "Only the headline statistic and photo change; all six lead to the same quiz link.",
    "shownWhen": "always, on the /hair-loss/a/hair-loss-tt-v3 landing page",
    "evidence": "observed"
   }
  ]
 },
 {
  "id": "men", "name": "Men's hair-loss consultation ('the hair quiz')", "audience": "men",
  "entryUrl": WWW + "/n/hair-loss/quiz",
  "stagesSummary": "NOT WALKED: www.joinvoy.com answered every request with a security checkpoint (HTTP 429, 'Failed to verify your browser, Code 21'), so not one real question was seen. From Voy's own public texts the order is: short quiz about hair loss and medical history ('under 2 minutes') → recommendation / choose a treatment and plan length ('shows the full plan before you pay') → sign-in and checkout → a clinician reviews the health questionnaire (usually within 24 hours) → delivery → optional progress photos and free consultations. The entries below are those published steps, not quiz screens.",
  "questions": [
   {
    "id": "men-s1", "order": 1, "stage": "anonymous",
    "text": "[Step described by Voy, quiz screen not seen] Take our quick assessment: 'We’ll ask you a few questions about your hair loss and medical history. You’ll be done in under 2 minutes.' / 'We'll ask some questions to assess your eligibility and find the best treatment plan for you'",
    "type": "info", "options": [],
    "purpose": "Collects the hair-loss pattern and a medical history so the engine can rule treatments in or out and suggest a plan. Voy's published cautions (see rules R3–R12) show what the medical questions must cover: age, sex, scalp soreness or redness, low blood pressure, prostate enlargement or current 5-alpha-reductase inhibitor, trying to conceive, breast or prostate cancer or gynaecomastia, severe depression or suicidal thoughts, and whether the loss is male pattern at all.",
    "engineRole": "diagnosis", "branches": True,
    "branchDetail": "Unknown in detail. Voy's sample plan card shows three outputs the quiz must produce: 'Diagnosis: Receding hairline', 'Preferences: Spray (fits morning routine)', 'Treatment type: Minoxidil & Finasteride'.",
    "shownWhen": "start of the flow (not verified live)",
    "evidence": "docs"
   },
   {
    "id": "men-s2", "order": 2, "stage": "anonymous",
    "text": "[Step described by Voy, screen not seen] Select a treatment: 'Create your personalised hair regrowth plan including Minoxidil.' Plan cards: Complete hair loss plan (tablet, spray or combination), Finasteride plans (tablet), Minoxidil plans (tablet or spray); plan lengths monthly, 3 months, 6 months.",
    "type": "info", "options": [],
    "purpose": "The recommendation and product-choice step. Voy's stated default for men is finasteride plus minoxidil together. A live experiment flag ('exp-950-exp-add-animation-to-recommendation') confirms there is a recommendation screen.",
    "engineRole": "product-selector", "branches": True,
    "branchDetail": "Unknown: which answers remove which plan could not be tested. Whether this screen comes before or after the sign-in step is also unknown.",
    "shownWhen": "after the quiz questions (not verified live)",
    "evidence": "docs"
   },
   {
    "id": "men-s3", "order": 3, "stage": "after-account",
    "text": "[Step inferred from site code, screen not seen] Sign in or create an account inside the quiz (experiment flag 'acq-1366-exp-otp-login-quiz' points to a one-time passcode sent to the visitor)",
    "type": "contact", "options": [],
    "purpose": "Account wall. Ties the answers to a person so a clinician can prescribe and the pharmacy can post the order.",
    "engineRole": "identity", "branches": False, "branchDetail": "",
    "shownWhen": "position in the flow unknown",
    "evidence": "inferred"
   },
   {
    "id": "men-s4", "order": 4, "stage": "checkout",
    "text": "[Step described by Voy and by the pharmacy regulator, not seen] Checkout, then clinician review: 'clinicians review the answers to confirm the treatment is safe'; orders are 'typically approved within 24 hours'; identity is checked from the bank card by a third party; duplicate accounts are flagged.",
    "type": "info", "options": [],
    "purpose": "A prescriber (mostly pharmacist independent prescribers) reads the questionnaire. The system highlights answers that suggest treatment may not be appropriate and shows when an answer was changed. The clinician then approves, messages the patient for more detail, or cancels the order.",
    "engineRole": "safety-screen", "branches": True,
    "branchDetail": "Approve → electronic prescription to Voy Pharmacy. Not approved → order cancelled with an explanation. In the 2023 inspection report hair-loss medicines were graded 'low risk' and photo ID was described only for medium and high-risk medicines, so photo ID is probably not asked for hair loss (an inference; a site flag for an Onfido ID check exists but was switched off on 2026-11-23).",
    "shownWhen": "after payment details (not tested, by rule)",
    "evidence": "docs"
   },
   {
    "id": "men-s5", "order": 5, "stage": "after-account",
    "text": "[Step described by Voy, not seen] After approval: upload progress photos with the Hair Progress Tracking Tool and attend free online consultations",
    "type": "photo", "options": [],
    "purpose": "Follow-up and proof for the Money Back Promise (monthly photos and two consultations are conditions of the refund). Photos are not described as needed before the first prescription.",
    "engineRole": "personalisation", "branches": False, "branchDetail": "",
    "shownWhen": "after the first order is approved",
    "evidence": "docs"
   },
  ]
 },
 {
  "id": "gateway", "name": "Generic quiz gateway (men and women)", "audience": "both",
  "entryUrl": WWW + "/n/hair-loss/quiz/gateway",
  "stagesSummary": "NOT WALKED (same security checkpoint). This is the link most landing pages use, including the page aimed at both men and women, and the pop-up's 'eligible' button. A live experiment is named 'SEM-Questionnaire-Generic-vs-Male' and swaps buttons between this link and /n/hair-loss/quiz, so this is read as the generic questionnaire that first sorts the visitor (for example by sex) before the men's or women's questions. That reading is an inference from the names.",
  "questions": [
   {
    "id": "gateway-s1", "order": 1, "stage": "anonymous",
    "text": "[Not seen] First screen of the generic questionnaire. Wording and options unknown.",
    "type": "info", "options": [],
    "purpose": "Probably routes men and women to their own question sets and products (men: DHT blockers and minoxidil; women: minoxidil only).",
    "engineRole": "eligibility-gate", "branches": True,
    "branchDetail": "Unknown. Inferred split: men → flow 'men'; women → flow 'women'.",
    "shownWhen": "start of the generic flow (not verified live)",
    "evidence": "inferred"
   }
  ]
 },
 {
  "id": "women", "name": "Women's hair-loss consultation", "audience": "women",
  "entryUrl": WWW + "/female-hair-loss",
  "stagesSummary": "NOT WALKED (same security checkpoint; the women's pages are only on www.joinvoy.com). The 'Take the hair quiz' button's target could not be read; the mixed men-and-women landing page sends everyone to /n/hair-loss/quiz/gateway. Voy's texts: quick hair questionnaire → recommendation of an oral or topical minoxidil plan → clinician review. Only minoxidil (topical or oral) and vitamins are sold to women; no finasteride, dutasteride or spironolactone was found.",
  "questions": [
   {
    "id": "women-s1", "order": 1, "stage": "anonymous",
    "text": "[Step described by Voy, quiz screen not seen] 'Take our quick hair questionnaire to find a personalised hair treatment that fits your lifestyle and hair goals' / 'Tell us about your hair loss and get a treatment recommendation tailored to your needs'",
    "type": "info", "options": [],
    "purpose": "Collects hair-loss type, goals and medical history for women. A search-engine summary of the women's page says it uses the same picture prompt as the men's page with areas described as widening part, thinning temples, patchy hair loss and general thinning; those labels are a paraphrase, not verified wording.",
    "engineRole": "diagnosis", "branches": True,
    "branchDetail": "Unknown. Voy's published cautions for women: minoxidil is not recommended when pregnant or breastfeeding; oral minoxidil is also not for women trying to conceive or with certain heart or blood pressure conditions.",
    "shownWhen": "start of the flow (not verified live)",
    "evidence": "docs"
   },
   {
    "id": "women-s2", "order": 2, "stage": "anonymous",
    "text": "[Step described by Voy, screen not seen] Recommendation: 'Our experts will recommend the ideal formulation to help you achieve thicker, fuller hair' — Oral Hair Treatment (taken once daily) or Topical Sprays & Serums (applied to the scalp daily)",
    "type": "info", "options": [],
    "purpose": "Product choice between oral and topical minoxidil, plus the vitamins add-on.",
    "engineRole": "product-selector", "branches": True, "branchDetail": "Unknown.",
    "shownWhen": "after the quiz questions (not verified live)",
    "evidence": "docs"
   }
  ]
 },
 {
  "id": "atc", "name": "Product-first route ('add to cart' flow)", "audience": "men",
  "entryUrl": WWW + "/n/hair-loss/quiz?flowType=atc",
  "stagesSummary": "NOT WALKED (same security checkpoint). Seen as the button target on the minoxidil social landing page. On the older Manual site the same idea was a direct link, manual.co/add-to-cart?productCode=…&variantCode=…&coupon=…, where the visitor picks the product and plan length first and answers the assessment afterwards ('Final treatment plans are shared decisions determined with your clinician after this online assessment').",
  "questions": [
   {
    "id": "atc-s1", "order": 1, "stage": "anonymous",
    "text": "[Not seen] Quiz opened with flowType=atc: the product has already been chosen on the landing page, so the questions should only confirm that it is safe.",
    "type": "info", "options": [],
    "purpose": "Lets ad traffic that already wants one product (for example minoxidil only) skip the recommendation step.",
    "engineRole": "product-selector", "branches": True,
    "branchDetail": "Unknown: whether the engine swaps the chosen product when an answer rules it out could not be tested.",
    "shownWhen": "when the quiz is opened from a product-specific landing page",
    "evidence": "code"
   }
  ]
 },
]

# ---------------------------------------------------------------- rules
HELP_ELIG = HC + "45450650751636-Can-everyone-use-Voy-Hair-Loss-treatments and " + HC + "48487912012436-Cautions-who-should-not-use-our-Hair-Loss-treatment (both now need sign-in; read through search-engine summaries on 2026-11-23)"
rules = [
 {"id": "R1", "flow": "landing-popup", "when": "popup-q1 = 'Patchy' or 'Complete' (and an email is then submitted)",
  "then": "Stop: 'You aren't eligible. Based on your answers there is no treatment suitable for you.' No link to the quiz is offered.",
  "effectType": "hard-stop", "affects": ALL_MEN_RX, "evidence": "code",
  "proof": "quiz-definition.json → preQuizPopup.eligibilityScriptVerbatim (inline script in src/hairloss1-home.html and nine landing pages in src/pages/); options seen live in runs/landing-popup", "confidence": "high"},
 {"id": "R2", "flow": "landing-popup", "when": "popup-q1 = 'Temples', 'Temples & Crown', 'Moderate' or 'Extensive' (and an email is then submitted)",
  "then": "Shows the 'Take the next step to treatment' button to /n/hair-loss/quiz/gateway and carries any ?coupon= code into that link. Nothing is recommended yet.",
  "effectType": "next-question", "affects": [], "evidence": "code",
  "proof": "quiz-definition.json → preQuizPopup.popupScriptVerbatim; options seen live in runs/landing-popup", "confidence": "high"},
 {"id": "R3", "flow": "men", "when": "Age under 18 (question wording not seen)",
  "then": "Not treated. The service is for adults only and Voy's cautions say minoxidil is not suitable for men under 18.",
  "effectType": "hard-stop", "affects": ALL_MEN_RX, "evidence": "docs",
  "proof": "GPhC inspection report 13/11/2023 ('customers were aged 18 years and over'), src/gphc/9012134-2023-11-13-22425.txt; " + HELP_ELIG, "confidence": "medium"},
 {"id": "R4", "flow": "men", "when": "Age over 65 (question wording not seen)",
  "then": "Minoxidil is listed as not suitable for men over 65. Whether the quiz removes only minoxidil or stops the patient is unknown.",
  "effectType": "product-removed", "affects": ["p2", "p3", "p4", "p5", "p6", "p7", "p8"], "evidence": "docs", "proof": HELP_ELIG, "confidence": "low"},
 {"id": "R5", "flow": "men", "when": "Sore or red scalp (question wording not seen)",
  "then": "Minoxidil 'should not be used if you have scalp soreness, redness'. Likely removes the sprays; the older Manual page for the all-in-one spray also excludes scalp conditions or inflammation.",
  "effectType": "product-removed", "affects": ["p2", "p6", "p7", "p8"], "evidence": "docs", "proof": HELP_ELIG, "confidence": "low"},
 {"id": "R6", "flow": "men", "when": "Low blood pressure (question wording not seen)",
  "then": "Minoxidil is listed as not to be used with low blood pressure. Whether this removes oral minoxidil only or the sprays as well is unknown.",
  "effectType": "product-removed", "affects": ["p2", "p3", "p4", "p5"], "evidence": "docs", "proof": HELP_ELIG, "confidence": "low"},
 {"id": "R7", "flow": "men", "when": "Enlarged prostate (BPH) or already taking a 5-alpha-reductase inhibitor such as finasteride or dutasteride (question wording not seen)",
  "then": "Listed as not suitable. Read here as applying to the DHT-blocker products (the search summary did not show which medicine the line sits under); minoxidil-only plans would remain.",
  "effectType": "product-removed", "affects": ["p1", "p4", "p5", "p6", "p7", "p8"], "evidence": "docs", "proof": HELP_ELIG, "confidence": "low"},
 {"id": "R8", "flow": "men", "when": "Trying to conceive, or partner is pregnant (question wording not seen)",
  "then": "DHT blockers are not suitable: 'This medication isn't suitable if you are trying to conceive or when your partner is pregnant.' Minoxidil-only plans would remain.",
  "effectType": "product-removed", "affects": ["p1", "p4", "p5", "p6", "p7", "p8"], "evidence": "docs",
  "proof": "Landing-page FAQ 'What are the side effects of the treatments?', src/hairloss1-home.txt (" + PUB + "/ = " + WWW + "/hair-loss); also " + HELP_ELIG, "confidence": "medium"},
 {"id": "R9", "flow": "men", "when": "History of gynaecomastia, male breast cancer or prostate cancer (question wording not seen)",
  "then": "Listed as not suitable. Read here as applying to DHT blockers.",
  "effectType": "product-removed", "affects": ["p1", "p4", "p5", "p6", "p7", "p8"], "evidence": "docs", "proof": HELP_ELIG, "confidence": "low"},
 {"id": "R10", "flow": "men", "when": "Severe depression or suicidal thoughts (question wording not seen)",
  "then": "Listed as not suitable. Read here as applying to DHT blockers (Voy's landing FAQ links them with 'low mood, depression, suicidal thoughts').",
  "effectType": "product-removed", "affects": ["p1", "p4", "p5", "p6", "p7", "p8"], "evidence": "docs", "proof": HELP_ELIG + "; src/hairloss1-home.txt", "confidence": "low"},
 {"id": "R11", "flow": "men", "when": "Hair loss is not male pattern baldness, or the man is completely bald (question wording not seen)",
  "then": "Not suitable for treatment. Matches the pop-up rule R1 (Patchy / Complete → not eligible).",
  "effectType": "hard-stop", "affects": ALL_MEN_RX, "evidence": "docs", "proof": HELP_ELIG + "; quiz-definition.json", "confidence": "medium"},
 {"id": "R12", "flow": "men", "when": "The person is a woman",
  "then": "The men's medicines are 'not suitable for women'; women are sent to the women's minoxidil plans instead.",
  "effectType": "product-switched", "affects": ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p12", "p13"], "evidence": "docs",
  "proof": HELP_ELIG + "; " + WWW + "/female-hair-loss", "confidence": "low"},
 {"id": "R13", "flow": "women", "when": "Pregnant or breastfeeding (question wording not seen)",
  "then": "Minoxidil 'is not recommended for women that are pregnant or breastfeeding'. Likely a stop, because minoxidil is the only medicine sold to women.",
  "effectType": "hard-stop", "affects": ["p12", "p13"], "evidence": "docs",
  "proof": WWW + "/female-hair-loss/treatments/minoxidil-plans (read through a search-engine summary)", "confidence": "low"},
 {"id": "R14", "flow": "women", "when": "Trying to conceive, or 'certain heart or blood pressure conditions' (question wording not seen)",
  "then": "Oral minoxidil is 'not appropriate'. Whether topical minoxidil stays on offer is unknown.",
  "effectType": "product-removed", "affects": ["p13"], "evidence": "docs",
  "proof": WWW + "/blog/minoxidil-tablets-for-women (read through a search-engine summary)", "confidence": "low"},
 {"id": "R15", "flow": "men", "when": "Any answer that suggests treatment may not be clinically appropriate, or an answer that was changed after first being given",
  "then": "The answer is highlighted for the prescriber, who must do a risk assessment before approving; the prescriber can message the patient or cancel the order.",
  "effectType": "flag-for-clinician", "affects": [], "evidence": "docs",
  "proof": "GPhC inspection report 13/11/2023, src/gphc/9012134-2023-11-13-22425.txt lines 533–539 (Manual Pharmacy, same owner; written about the questionnaires in general)", "confidence": "medium"},
 {"id": "R16", "flow": "men", "when": "Side effects on an oral treatment after starting",
  "then": "A clinician 'may suggest adjusting your medication, continuing treatment as some side effects improve over time, or switching to a topical treatment, which may have fewer side effects'.",
  "effectType": "product-switched", "affects": ["p1", "p4", "p7", "p2"], "evidence": "docs",
  "proof": "Landing-page FAQ 'What happens if I experience side effects?', src/pages/a_all-in-one-treatment.txt (" + PUB + "/a/all-in-one-treatment)", "confidence": "medium"},
]

recommendations = [
 {"profile": "Man with typical male pattern hair loss (receding hairline, thinning crown or both), no medical issues — Voy's stated default, not a quiz result",
  "offered": ["p6", "p8", "p1", "p2", "p3", "p4"], "default": "p6",
  "note": "From Voy's public pages: 'We recommend that men use both of these treatments together' and the Complete plan card is tagged 'Most effective'. The real recommendation screen was not seen.", "evidence": "docs"},
 {"profile": "Man who picks 'Patchy' or 'Complete' in the landing-page pop-up", "offered": [], "default": None,
  "note": "'You aren't eligible. Based on your answers there is no treatment suitable for you.'", "evidence": "code"},
 {"profile": "Woman with hair thinning, not pregnant or breastfeeding — Voy's stated default, not a quiz result",
  "offered": ["p12", "p13", "p11"], "default": "p12",
  "note": "'Evidence supports minoxidil as the preferred treatment for female hair loss'; oral or topical plan chosen with the clinician. Real recommendation screen not seen.", "evidence": "docs"},
]

company = {
 "slug": "voy", "company": "Voy (formerly Manual)", "market": "UK", "website": WWW + "/hair-loss",
 "parent": "Menwell Limited (its hair-loss service traded as Manual before moving to the Voy brand; exact date of the move not checked)",
 "audiences": ["men", "women"],
 "model": "UK subscription telehealth: online quiz, remote prescriber review, own distance-selling pharmacy; sells licensed finasteride plus own-brand unlicensed specials (10% minoxidil spray, combined finasteride or dutasteride + minoxidil capsules, topical combination spray) and add-on shampoo and vitamins.",
 "checkedOn": "2026-11-23",
 "access": {
  "howTested": ["live-walk", "site-code", "public-docs"],
  "accountWall": "The real consultation was never reached: www.joinvoy.com returned a security checkpoint before the first question, so where it asks for sign-in is unknown (a site flag suggests a one-time passcode inside the quiz). On the landing-page pop-up the wall is an email box straight after the single hair-pattern question ('Check if I qualify'). Voy's help-centre articles also now need sign-in.",
  "blockers": [
   "www.joinvoy.com and manual.co: Vercel security checkpoint, HTTP 429 'Failed to verify your browser, Code 21', for the walk tool, for curl and for the web-fetch tool (runs/probe-hairloss, runs/baseline-men, runs/baseline-women). Not worked around.",
   "Voy help centre (joinvoy.zendesk.com) and the old Manual help centre (help.manual.co): hair-loss articles redirect to a sign-in page (src/help/). Not signed in.",
   "Wayback Machine holds copies of /n/hair-loss/quiz (17 Aug 2026), /hair-loss (25 Aug 2026) and /female-hair-loss (17 Aug 2026), but web.archive.org could not be reached from this machine (connection reset / 502). Common Crawl index also unreachable."
  ],
  "coverageNote": "Live walk covers only public landing pages on Voy's official host hairloss1.joinvoy.com (the same Webflow pages as www.joinvoy.com/hair-loss and /hair-loss/a/…): the one-question eligibility pop-up and a pattern picker. Site code covers those pages' scripts, the feature-flag list the page downloads, and older Manual landing pages with product codes and price tables. Everything about the real quiz, the product pages on www.joinvoy.com, the women's pages and the help centre comes from Voy's public wording read on those landing pages or through search-engine summaries, from GPhC inspection reports and from Manual/Menwell's own published service evaluation. No real quiz question, no recommendation screen and no checkout was seen."
 },
 "products": products,
 "flows": flows,
 "rules": rules,
 "experiments": [],
 "recommendations": recommendations,
 "engineSummary": "What can be shown: Voy filters on hair-loss pattern first. Its landing-page pop-up asks one picture question and turns away 'Patchy' and 'Complete' loss; every other pattern is passed to the quiz with a discount code. Voy's published cautions then describe a medical screen that removes medicines one by one rather than rejecting the person: DHT blockers (finasteride, dutasteride) go if the man is trying for a baby, has prostate enlargement or already takes a 5-alpha-reductase inhibitor, has had breast or prostate cancer or gynaecomastia, or has severe depression; minoxidil goes for under-18s, over-65s, a sore or red scalp or low blood pressure. What is left is offered as tablet, spray or both, in plan lengths of 1, 3 or 6 months, with 'finasteride plus minoxidil' pushed as the default. A prescriber reviews every order afterwards; the system highlights risky answers and changed answers. Site flags suggest the rules are written as JSON Logic and that many versions of the quiz are being A/B tested (generic versus male questionnaire, product-first route, recommendation animation). What cannot be shown: the actual questions, their order, and which answer changes which product, because the quiz is behind a security checkpoint.",
 "strengths": [
  "Widest men's range of the UK players seen so far: licensed finasteride, 10% minoxidil spray, oral minoxidil, two one-a-day combined capsules (finasteride or dutasteride with minoxidil) and a topical combination spray — '30+ treatment combinations'.",
  "One-pill-a-day and once-a-day-spray formats that are easy to stick to; own published 502-patient service evaluation of the combined capsule.",
  "Low entry prices in adverts (from £13–19 a month on a 6-month plan), 180-day Money Back Promise, free clinician calls and a photo progress tracker.",
  "Own pharmacy and in-house prescribers; next-day or 48-hour discreet delivery; pause, switch or cancel in the account.",
  "Heavy conversion testing (dozens of live experiments) and strong brand reach (500,000+ customers claimed, 4.7/5 Trustpilot quoted)."
 ],
 "weaknesses": [
  "Regulatory record of the pharmacy that also dispenses the hair-loss medicines: the GPhC found standards not all met in March 2026 (the prescribing service did not independently verify what people told it; no independent clinical check on most prescriptions) and in August 2026 (verification for weight-loss treatments, owners 'continue to unlawfully advertise prescription only medicines', a first-month discount on a weight-loss medicine; detailed clinical checks on only a sample of prescriptions), leading to statutory enforcement; standards were met at re-inspection on 13 October 2026. The findings centre on weight loss, but the advertising and clinical-check points cover the whole pharmacy. A third-party review counts seven ASA rulings against the owner for advertising prescription-only medicines.",
  "Headline prices are first-order promotions on a 6-month plan; the standing prices are far higher (about £33–44 a month for the combined plan) and pages contradict each other.",
  "Products are generic-named on landing pages ('Hair Oral Treatment', 'Hair Treatment Spray', 'DHT blockers'), so the buyer cannot easily see strengths or that several are unlicensed specials.",
  "Marketing contradicts the eligibility gate: one widget promises results even for the most advanced stage while the pop-up turns away complete baldness.",
  "Help-centre articles are locked behind sign-in, so safety and eligibility information is not open before purchase.",
  "Thin women's range: minoxidil only (topical or oral) plus vitamins."
 ],
 "opportunities": [
  "Be openly transparent where Voy is opaque: show every active and strength, licensed or unlicensed status, the full non-promotional price per plan length, and the complete eligibility rules before any email is asked for.",
  "Offer a real women's pathway (causes work-up, ferritin and thyroid checks, menopause link, spironolactone where appropriate) instead of minoxidil only.",
  "Build verification in (GP summary or NHS App record check, photo review before the first prescription) and say so: unverified patient answers are what the regulator criticised at this pharmacy in 2026.",
  "Do not hard-stop patchy or complete loss with a dead end: route to a clinician or dermatology referral, which is safer and builds trust.",
  "Honest side-effect follow-up (structured check-ins for mood and sexual side effects on DHT blockers), which Voy's own published evaluation admits it did not collect in a structured way."
 ],
 "sources": [
  {"title": "Voy men's hair-loss landing page (public host, same page as www.joinvoy.com/hair-loss) — opened 2026-11-23", "url": PUB + "/"},
  {"title": "Voy landing page: All-In-One Hair Loss Plans", "url": PUB + "/a/all-in-one-treatment"},
  {"title": "Voy landing page: Minoxidil Spray", "url": PUB + "/a/hair-treatment-spray"},
  {"title": "Voy landing page: Oral Hair Treatment", "url": PUB + "/a/hair-loss-oral-treatment"},
  {"title": "Voy landing page: Minoxidil Treatment (tablets)", "url": PUB + "/a/hair-loss-tablets"},
  {"title": "Voy landing page with pattern picker", "url": PUB + "/a/hair-loss-tt-v3"},
  {"title": "Voy landing page for men and women", "url": PUB + "/sem-mf"},
  {"title": "Voy landing pages (social): DHT, minoxidil, Ross Edgley", "url": PUB + "/a/social/hair-loss-dht"},
  {"title": "Voy product page: Finasteride (blocked; read via search summary)", "url": WWW + "/hair-loss/treatments/finasteride"},
  {"title": "Voy product page: Complete Hair Loss Plan (blocked; read via search summary)", "url": WWW + "/hair-loss/treatments/complete-hair-loss-plan"},
  {"title": "Voy product page: Minoxidil (blocked; read via search summary)", "url": WWW + "/hair-loss/treatments/minoxidil"},
  {"title": "Voy product page: Power Shampoo (blocked; read via search summary)", "url": WWW + "/hair-loss/treatments/power-shampoo"},
  {"title": "Voy product page: Hair Vitamins for men (blocked; read via search summary)", "url": WWW + "/hair-loss/treatments/hair-vitamins"},
  {"title": "Voy women's hair-loss page (blocked; read via search summary)", "url": WWW + "/female-hair-loss"},
  {"title": "Voy women's Minoxidil Plans page (blocked; read via search summary)", "url": WWW + "/female-hair-loss/treatments/minoxidil-plans"},
  {"title": "Voy women's Hair Vitamins page (blocked; read via search summary)", "url": WWW + "/female-hair-loss/treatments/hair-vitamins"},
  {"title": "Voy blog: Minoxidil tablets for women (blocked; read via search summary)", "url": WWW + "/blog/minoxidil-tablets-for-women"},
  {"title": "Voy blog: How to use minoxidil (blocked; read via search summary)", "url": WWW + "/blog/how-to-use-minoxidil"},
  {"title": "Voy Money Back Promise, hair loss (blocked; read via search summary)", "url": WWW + "/hair-loss/guarantee"},
  {"title": "Voy help: Can everyone use Voy Hair Loss treatments? (sign-in wall; read via search summary)", "url": HC + "45450650751636-Can-everyone-use-Voy-Hair-Loss-treatments"},
  {"title": "Voy help: Cautions - who should not use our Hair Loss treatment? (sign-in wall; read via search summary)", "url": HC + "48487912012436-Cautions-who-should-not-use-our-Hair-Loss-treatment"},
  {"title": "Voy help: How Voy helps prevent Hair Loss - How does the service work? (sign-in wall; read via search summary)", "url": HC + "45450021171732-How-Voy-helps-prevent-Hair-Loss-How-does-the-service-work"},
  {"title": "Voy help: How Hair Loss subscriptions work at Voy (sign-in wall; read via search summary)", "url": HC + "45449655837716-How-Hair-Loss-subscriptions-work-at-Voy"},
  {"title": "Voy help: A guide to our Finasteride and Minoxidil All-in-One Capsule (sign-in wall; read via search summary)", "url": HC + "45381451752468-A-guide-to-our-Finasteride-and-Minoxidil-All-in-One-Capsule"},
  {"title": "Voy help: A guide to our Dutasteride & Minoxidil All-in-One Capsule (sign-in wall; read via search summary)", "url": HC + "48437360723604-A-guide-to-our-Dutasteride-Minoxidil-All-in-One-Capsule"},
  {"title": "Voy help: A guide to Minoxidil (sign-in wall; read via search summary)", "url": HC + "45381827347988-Minoxidil-How-it-works-what-to-expect"},
  {"title": "Voy help: A guide to Hair Vitamins (sign-in wall; read via search summary)", "url": HC + "48169362878484-A-guide-to-Hair-Vitamins"},
  {"title": "Voy help: Power Shampoo - All you need to know (sign-in wall; read via search summary)", "url": HC + "45382197626132-Power-Shampoo-All-you-need-to-know"},
  {"title": "Older Manual landing page: Complete Hair Loss Plan (product codes and price table in page code) — opened 2026-11-23", "url": "https://hello.manual.co/a/complete-hair-loss-plan"},
  {"title": "Older Manual landing page: Hair Loss minoxidil plans (product codes and price table) — opened 2026-11-23", "url": "https://hello.manual.co/a/hl-hair-loss-minox-plans"},
  {"title": "Older Manual landing page: Hair Loss Plan (social) — opened 2026-11-23", "url": "https://hello.manual.co/a/social/hl-hair-loss-plan"},
  {"title": "Older Manual product pages: Minoxidil 10% Spray, All-in-One Spray (blocked; read via search summary)", "url": "https://www.manual.co/treatments/manual-minoxidil-10-spray-treatment-plan"},
  {"title": "Old Manual help: How does the Hair Loss Money Back Promise work? (sign-in wall; read via search summary)", "url": "https://help.manual.co/hc/en-us/articles/42668352921620-How-does-the-Hair-Loss-Money-Back-Promise-work"},
  {"title": "Johnson et al., Effectiveness of Combined Oral Minoxidil and Finasteride in Male Androgenetic Alopecia: A Retrospective Service Evaluation (authors employed by Menwell/Manual)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11829753/"},
  {"title": "GPhC inspection record, Voy Pharmacy 9012909", "url": "https://inspections.pharmacyregulation.org/pharmacy/detail/menwell-pharmacy-9012909"},
  {"title": "GPhC inspection report, Voy Pharmacy, 13 Oct 2026 (standards met)", "url": "https://inspections.pharmacyregulation.org/pharmacy/download/9012909-2026-10-13-26718.pdf"},
  {"title": "GPhC inspection report, Voy Pharmacy, 11 Aug 2026 (standards not all met)", "url": "https://inspections.pharmacyregulation.org/pharmacy/download/9012909-2026-08-11-26590.pdf"},
  {"title": "GPhC inspection report, Menwell Pharmacy, 24 Mar 2026 (standards not all met)", "url": "https://inspections.pharmacyregulation.org/pharmacy/download/9012909-2026-03-24-25983.pdf"},
  {"title": "GPhC inspection report, Manual Pharmacy 9012134, 13 Nov 2023 (describes questionnaires, repacking of finasteride, unlicensed medicines)", "url": "https://inspections.pharmacyregulation.org/pharmacy/download/9012134-2023-11-13-22425.pdf"},
  {"title": "CQC provider record, Menwell Limited", "url": "https://www.cqc.org.uk/provider/1-7337623585"},
  {"title": "Healthcount: Voy Review 2026 (third party; GPhC timeline and ASA rulings)", "url": "https://www.healthcount.app/pharmacy/voy"},
  {"title": "Fin vs Fin: Manual Hair Loss Review (third party, updated 2026-04-12)", "url": "https://finvsfin.com/manual-hair-loss-review/"},
  {"title": "TreatCompare: Manual vs Sons vs Numan (third party)", "url": "https://www.treatcompare.com/articles/manual-vs-sons-vs-numan"},
  {"title": "What People Actually Buy: Voy Review 2026 (third party)", "url": "https://whatpeopleactuallybuy.com/articles/voy-review-2026/"},
  {"title": "Wayback Machine copy of the quiz page, 17 Aug 2026 (exists; could not be opened from this machine)", "url": "http://web.archive.org/web/20260817172554/https://www.joinvoy.com/n/hair-loss/quiz"}
 ],
 "limitations": [
  "No real consultation question was seen. The quiz at /n/hair-loss/quiz (and /quiz/gateway, ?flowType=atc) sits behind a security checkpoint that blocked the browser, curl and the web-fetch tool; it was not worked around. The men's, women's, gateway and product-first flows in this file therefore list published steps and inferences, clearly marked, not quiz screens.",
  "No one-change experiment could be run on the consultation, so no rule about the quiz is 'observed'. The only code-proven branch is the landing-page pop-up (Patchy / Complete → not eligible).",
  "Rules R3–R14 come from Voy help-centre articles and www pages that could not be opened directly (sign-in wall or checkpoint); they were read through search-engine summaries, which can mis-attribute a line to the wrong medicine. Treat them as low confidence until someone reads the articles.",
  "Strengths of several products are not confirmed on a live Voy page: stand-alone oral minoxidil, the dutasteride + minoxidil capsule, topical finasteride in the all-in-one spray, and the women's serum and tablets. The all-in-one capsule strengths (finasteride 1 mg, minoxidil 2.5 mg, biotin 10 mg) come from the older Manual listing and Manual's own published evaluation.",
  "Prices are a moving target: Black Friday promotions were running on the day (16–30 Nov 2026), landing pages show only first-order 'from' prices on a 6-month plan, and full prices come partly from older Manual page code. The women's prices seen in search summaries contradict each other.",
  "The women's pages exist only on www.joinvoy.com, so the women's map is the thinnest part of this file.",
  "Whether the all-in-one spray and the 5% spray are still sold under the Voy name is not confirmed."
 ]
}

with open(OUT, 'w', encoding='utf8') as f:
    json.dump(company, f, ensure_ascii=False, indent=1)
print('wrote', os.path.normpath(OUT))
