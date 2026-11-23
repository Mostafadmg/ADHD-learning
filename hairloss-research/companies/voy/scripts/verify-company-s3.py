#!/usr/bin/env python3
"""Stage 3 (VERIFY) for Voy: applies the independent reviewer's corrections.

Input : src/company-stage2.json  (frozen copy of company.json as stage 2 left it)
Output: company.json             (corrected, with a "verification" block)

Run:  python3 -I scripts/verify-company-s3.py
Then: node ../../tools/validate.js voy --stage final

Do NOT re-run build-company.py or build-company-s2.py afterwards: they would write the older maps over this file.
Every change below is listed in plain words in verification.corrected.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src", "company-stage2.json")
OUT = os.path.join(ROOT, "company.json")

with open(SRC, encoding="utf-8") as fh:
    d = json.load(fh)

P = {p["id"]: p for p in d["products"]}
F = {f["id"]: f for f in d["flows"]}
Q = {q["id"]: q for f in d["flows"] for q in f["questions"]}
R = {r["id"]: r for r in d["rules"]}


def sub(obj, key, old, new):
    """Replace text and fail loudly if the old text is not there (so a silent no-op cannot happen)."""
    if old not in obj[key]:
        raise SystemExit("text to replace not found in %s.%s: %r" % (obj.get("id"), key, old))
    obj[key] = obj[key].replace(old, new)


def add(obj, key, more):
    obj[key] = (obj[key].rstrip() + " " + more).strip()


HIDDEN33 = ("The page code also holds a struck-through '£33' beside each men's price, inside an element named as a test "
            "('text-strikethrough_test'); it was hidden in every stage 3 replay and in stage 1's own screenshot, so £33 "
            "is not a price a visitor was shown.")

# ---------------------------------------------------------------------------------------------------------------
# 1. PRODUCTS
# ---------------------------------------------------------------------------------------------------------------
for pid in ("p1", "p2", "p3", "p4", "p6", "p8"):
    p = P[pid]
    p["price"] = re.sub(r";? ?shown with £33 struck through", "", p["price"]).replace("(promotional)", "(promotional first-order price)").replace("( ", "(")
    p["priceDetail"] = p["priceDetail"].replace("From £33 £", "From £")

assert "£33" not in P["p1"]["price"] and "£33" not in P["p6"]["price"]

add(P["p1"], "priceDetail", HIDDEN33)
P["p1"]["checkS3"] = ("Confirmed live 2026-11-23 on hairloss1.joinvoy.com: card 'Finasteride hair loss plans', format 'Tablet', "
                      "'From £13 per month' (runs/verify-popup-men-base). The 1 mg strength is in the product page title "
                      "'Buy Finasteride 1mg tablets for hair loss' (search listing; the page itself is blocked). "
                      "Corrected: the £33 reference price is hidden test code, not a shown price.")

add(P["p2"], "priceDetail",
    "Stage 3, live on 2026-11-23: the minoxidil landing page card reads 'Minoxidil spray — This extra-strength formula only "
    "needs to be applied once a day for the best results — From £14 per month' (runs/verify-gap-atc-page), while the FAQ on "
    "the men's main page still says 'Use the spray twice daily'. On the older Manual plan picker, which is still online, "
    "choosing 'Spray' puts product code minoxidil_topical_10 in the Continue link, as 1 × 90 ml for 3 months (£29.67 struck "
    "through, £14 a month) or 2 × 90 ml for 6 months (£25 struck through, £13 a month) (runs/verify-gap-legacy-minox-spray, "
    "-spray-3m). That page says both 'Just two spray applications a day' and 'Spray once a day on your scalp', and the bottle "
    "in its low-resolution picture appears to read '50mg/ml' (which would be 5%; it could not be read with certainty), so the "
    "older page is not consistent about strength or frequency. " + HIDDEN33)
P["p2"]["checkS3"] = ("Price and 'extra-strength, once a day' wording confirmed live. '10%' rests on the product code seen in a "
                      "stage 3 replay of the older Manual page and on two separate search summaries of Voy's how-to guide "
                      "(10% once a day, described as off-label); it is not printed on any Voy page that could be opened.")

add(P["p3"], "priceDetail",
    "Stage 3: the live minoxidil landing page shows 'Tablets — Oral Hair Treatment — Once daily tablets or capsules to promote "
    "fuller, thicker hair — From £14 per month' (runs/verify-gap-atc-page). On the older Manual plan picker 'Tablets' is "
    "pre-selected and tagged 'Most effective'; the Continue link carries product code minoxidil_oral, as 90 capsules for 3 months "
    "(£29.67 struck through, £14 a month) or 180 capsules for 6 months (£25 struck through, £13 a month) "
    "(runs/verify-gap-legacy-minox-base, -3m). " + HIDDEN33)
P["p3"]["checkS3"] = ("Price and wording confirmed live. Pack sizes and product code observed on the older Manual page. The 2.5 mg "
                      "strength is from archived 2024 page data and older code only.")

add(P["p4"], "priceDetail",
    "Stage 3: the archived patient plan (7 Jan 2025) opens 'our exclusive All-in-One capsule (Oral Finasteride 1mg and Minoxidil "
    "2.5mg)' and lists biotin; the company's own study (PMC11829753, 502 men) also gives finasteride 1 mg and minoxidil 2.5 mg a "
    "day. The older Manual page 'Complete Hair Loss Plan' (still online; its page code points at this capsule's product code) "
    "showed, in stage 3 replays, £33.17 struck through and '£18 per month' for 6 months, and £39.67 struck through and '£21 per "
    "month' for 3 months (runs/verify-gap-legacy-complete-base, -3m). Note the name clash: on older Manual pages 'Complete Hair "
    "Loss Plan' meant this capsule; on Voy today it means tablet plus spray (p6). " + HIDDEN33)
P["p4"]["checkS3"] = ("Strengths confirmed in two archived Manual sources and the published study; not confirmed on a current Voy "
                      "page. 'From £19 per month' confirmed live for the 'All-in-One Plans' card.")

add(P["p5"], "priceDetail",
    "Stage 3: a further search summary added only that the help guide says to 'take ONE tablet daily', and that Voy's "
    "dutasteride blog gives 0.5 mg a day as the usual dutasteride dose in general. Neither states what is in this capsule. The "
    "help article itself returns HTTP 403 to web fetch (sign-in wall).")
P["p5"]["checkS3"] = "Existence supported by three indirect sources; strengths and price still unknown."

add(P["p6"], "priceDetail",
    "Stage 3: card confirmed live ('Complete hair loss plan — Combines Finasteride & Minoxidil — Format: Tablet, spray or "
    "combination — From £19 per month'); an independent search summary of the plan page gave the same billing grid (monthly "
    "£44.00, 3-month £39.67, 6-month £33.17 'most popular', '£119.00 for the first 3 months') and '1 tablet + 1–2x sprays "
    "daily'. An ad page adds 'From £4.75/week on a 6-month plan, paid upfront'. " + HIDDEN33)
P["p6"]["checkS3"] = "Headline price and card wording confirmed live; the billing grid confirmed by a second search summary, not on the page itself."

add(P["p8"], "priceDetail", "Stage 3: card confirmed live on /a/all-in-one-treatment (runs/verify-page-aio). " + HIDDEN33)
P["p8"]["checkS3"] = "Card name, 'Spray & Capsules', 'Best for maximum results' and 'From £19 per month' confirmed live. Exact contents still not shown by Voy."

add(P["p9"], "priceDetail",
    "Stage 3: a second search summary of the product page lists one bottle every 2 months at £11.90 a bottle (£5.95 for the "
    "first), 3 bottles every 6 months at £10.00 a month, or a single bottle at £14.00. Caffeine, biotin and saw palmetto are "
    "named in the FAQ on the live men's page ('But Finasteride and Minoxidil are the only proven treatments'). The women's "
    "pages promise 'a free shampoo supply worth up to £45' during the same promotion; that shampoo is not named.")
P["p9"]["checkS3"] = "Ingredients confirmed live; prices from two search summaries of the blocked product page."

add(P["p10"], "priceDetail",
    "Stage 3: a second search summary found Hair Vitamins listed on Voy's finasteride and minoxidil pages at '£18 one-time "
    "purchase', and on one page at '£150' for 6 months; the two do not agree, so the current price is uncertain.")
P["p10"]["checkS3"] = "Biotin 1800 mcg and selenium 55 mcg repeated by a second search summary; not seen on the page itself."

P["p11"]["checkS3"] = "Not re-checked on a page that could be opened (search summary only)."

add(P["p12"], "priceDetail",
    "Stage 3, confirmed live: main page 'Topical Hair Treatments — Dermatologist prescribed treatments for hair regrowth — "
    "Format: Water-based serums or foams — From £24.00 per month'; /sem 'Serum … From £39 £14.99 per month' (here the £39 is "
    "visibly struck through); /meta 'Topical hair treatment — Minoxidil solution that absorbs in seconds, with no greasy roots "
    "and no rewashing — From £14.99 /month' and 'Your first order starts from £14.99' (runs/verify-popup-women-base, "
    "verify-page-fhl-sem, verify-page-fhl-meta). So £14.99 is a first-order price.")
add(P["p12"], "legalStatus", "The category given here (compounded) is therefore a best guess.")
P["p12"]["checkS3"] = "All three prices and the wording confirmed live. Strength and any other actives still unknown."

add(P["p13"], "priceDetail",
    "Stage 3, confirmed live: main page 'From £15.00 per month'; /sem 'Capsules — Oral Hair Treatments … From £25 £15 per "
    "month'; /meta 'Oral hair treatment — Once-daily tablet that works from the inside, across your whole scalp — From £15 "
    "/month'.")
P["p13"]["checkS3"] = "Prices and wording confirmed live. Strength still unknown."

P["p14"]["checkS3"] = ("'Follow your treatment plan and if you're not satisfied after 180 days, we'll give you your money back' and "
                       "'Unlimited clinician support' confirmed live. The detailed refund conditions come from a search summary only.")

add(P["p15"], "priceDetail",
    "Stage 3: two separate search summaries of Voy's how-to guide give directions for both strengths (5% twice a day, 10% once "
    "a day, 7 sprays for 1 ml each time), which supports 5% being a current option. Still no Voy product page or price for it.")
P["p15"]["checkS3"] = "Still known only from older code and a blog summary."

P["p7"]["checkS3"] = ("Not confirmed as a current Voy product. Evidence unchanged: older Manual pages (search summary), a page "
                      "/hair-loss/topical-finasteride-minoxidil-spray in the December 2025 route list, and a live flag name.")

d["products"].append({
    "id": "p16",
    "name": "Hair transplant consultation and surgery (older Manual service; not found on Voy today)",
    "category": "service",
    "actives": [],
    "form": "clinic consultation and surgery (older pages named London, Leeds and Manchester)",
    "audience": "men",
    "legalStatus": "surgical service; the clinics' registration was not checked",
    "price": "unknown today (an older Manual page quoted £4,000 to £7,000, read through a search-engine summary)",
    "priceDetail": "Added in stage 3. Manual advertised 'Transplants from the UK's largest hair loss clinic' on "
                   "hair-transplant.manual.co. The Manual site menu of 7 Jan 2025 linked to it ('Hair transplants overview', "
                   "'Pricing'; src/arquivo/manual-terms-of-sale-20250107.txt) and the app code of December 2025 still lists a page "
                   "/hair-loss/hair-transplant-consultation. On 2026-11-23 the landing page answered 'Page not found' "
                   "(runs/verify-page-transplant), Voy's men's menu has no transplant link, and Voy's own FAQ argues against "
                   "transplants ('Why wouldn’t I have a hair transplant?'). Read as discontinued or no longer marketed; not "
                   "confirmed either way.",
    "url": "https://hair-transplant.manual.co/ht/landing-page",
    "recommendedWhen": "Not part of the consultation as far as can be seen. Older Manual pages sold it as a separate service with its own free consultation.",
    "evidence": "code",
    "checkS3": "New entry. Listed so the catalogue is complete; do not count it as a current Voy product."
})

# ---------------------------------------------------------------------------------------------------------------
# 2. FLOWS AND QUESTIONS
# ---------------------------------------------------------------------------------------------------------------
add(F["landing-popup"], "stagesSummary",
    "Stage 3 replayed the baseline and both refused options again (runs/verify-popup-men-base, runs/verify-exp-m04, "
    "runs/verify-exp-m05) with the same result, re-read the script on the live page (src/verify/hairloss1-home.html), and read "
    "the hidden next-step link with and without a published coupon code (runs/verify-gap-coupon-men-none, -code).")
add(Q["popup-q1"], "branchDetail",
    "Stage 3: with ?coupon=SPOOKY50 (a code Voy's own pages use) in the page address, the hidden next-step link becomes "
    "…/n/hair-loss/quiz/gateway?coupon=SPOOKY50 and the hidden coupon field is filled with the code; without it both are empty.")
add(F["landing-popup-women"], "stagesSummary",
    "Stage 3 replayed the baseline, 'Patchy hair loss' and 'Skip' again (runs/verify-popup-women-base, runs/verify-exp-w03, "
    "runs/verify-exp-w04), ticked 'Patchy hair loss' on the /meta ad page as well (runs/verify-gap-wmeta-popup-patchy: same four "
    "options, same behaviour) and re-read the script on the live page (src/verify/femalehairloss1-home.html).")
add(F["landing-pattern-widget"], "stagesSummary",
    "Stage 3 replayed the baseline and two patterns again (runs/verify-widget-base, runs/verify-exp-p01, runs/verify-exp-p05): same result.")

# --- men's and women's 'topic' entries: the exclusion is published, but that the QUIZ asks about it is an inference -----
TOPIC_NOTE = ("Label: Voy publishes this exclusion, but that the quiz asks about it, and what the quiz then does, was not seen: "
              "'inferred'.")
for qid in ("men-t2", "men-t3", "men-t4", "men-t5", "men-t6", "men-t7", "men-t8", "men-t9", "women-t2", "women-t3"):
    Q[qid]["evidence"] = "inferred"
    add(Q[qid], "purpose", TOPIC_NOTE)

add(F["men"], "stagesSummary",
    "Stage 3 re-tested access once more (runs/verify-base-men: same checkpoint). Topic entries t2 to t9 are now labelled "
    "'inferred': the exclusions are published, the quiz questions are not.")
add(F["women"], "stagesSummary",
    "Stage 3 re-tested access (runs/verify-base-women: same checkpoint). Caution: the December 2025 app code that the engine "
    "rules come from contains no women's hair-loss flow at all (the name 'female-hair-loss' does not appear in it), so applying "
    "those engine rules to women assumes the newer women's quiz runs on the same engine.")

# --- gateway: the sex-at-birth question was mis-attributed --------------------------------------------------------------
g = F["gateway"]
g["stagesSummary"] = (
    "NOT WALKED (same security checkpoint; runs/s2-retest-gateway). This is the link most men's landing pages use, the page "
    "aimed at both men and women, and the men's pop-up's 'eligible' button. A live experiment named "
    "'SEM-Questionnaire-Generic-vs-Male' swaps buttons between this link and /n/hair-loss/quiz, so it is read as a questionnaire "
    "that first sorts the visitor. Stage 3 correction: no gateway question is known. Stage 2 had listed 'What was your sex at "
    "birth?' here; in the older app code that question belongs to a different, general 'Personal Questions' quiz (the one for "
    "wellness and blood tests), so it has been removed. In the December 2025 route list there is no separate gateway page: the "
    "address fits the pattern /n/[taxon]/quiz/[question], which makes 'gateway' the name of one quiz screen; the word 'gateway' "
    "itself does not appear in that older code, so the screen is newer than the code that could be read.")
g["questions"] = [{
    "id": "gateway-q1",
    "order": 1,
    "stage": "anonymous",
    "text": "[Not seen, wording unknown] First screen of the gateway, read as a sorting step between the men's and the women's consultation",
    "type": "info",
    "options": [],
    "purpose": "Unknown in detail. It is read as a sorter because the page aimed at both sexes sends everyone here and because of "
               "the experiment name 'SEM-Questionnaire-Generic-vs-Male'. No wording and no option is known, so none is listed.",
    "engineRole": "eligibility-gate",
    "branches": True,
    "branchDetail": "Inferred, not seen: men continue to the men's questions and products; women are passed to the women's consultation at /n/female-hair-loss/quiz.",
    "shownWhen": "first screen of the generic flow (not verified live)",
    "evidence": "inferred"
}]

# --- product-first route: the swap itself is not in the code that could be read ------------------------------------------
a = F["atc"]
sub(a, "stagesSummary", "the app adds &swap=true and the product is exchanged for one the answers allow.",
    "the app adds &swap=true. What the quiz does with swap=true is in a quiz-page script that could not be read; 'the product "
    "is exchanged for one the answers allow' is a reading of the names, not something seen in code. Stage 3 confirmed live that "
    "the 'Get started' and 'Take the hair quiz' buttons on the minoxidil social page point to ?flowType=atc "
    "(runs/verify-gap-atc-page).")
Q["atc-s1"]["branchDetail"] = (
    "What older app code shows: the route /n/hair-loss/quiz?atc=true, and that the app adds &swap=true when the stored preferred "
    "product carries the flag 'shouldSwap'. What it does not show: what swap=true then does. Inferred from the names: a chosen "
    "product that an answer rules out is exchanged for an eligible one. The general engine still applies: nothing eligible → the "
    "'You aren't eligible' screen.")

sub(Q["men-s7"], "branchDetail", "and a pre-chosen product can be swapped.",
    "and a swap flag exists for a pre-chosen product (what it does is inferred, see R25).")
sub(F["men"], "stagesSummary", "the engine's reject, review and swap behaviour from older app code",
    "the engine's reject and review behaviour, and its swap flag, from older app code")

# --- new flow: the page aimed at both sexes --------------------------------------------------------------------------------
d["flows"].append({
    "id": "landing-mixed-page",
    "name": "Landing page for men and women (/hair-loss/sem-mf): Men / Women switch and pop-up",
    "audience": "both",
    "entryUrl": "https://www.joinvoy.com/hair-loss/sem-mf",
    "stagesSummary": "Added in stage 3 (runs/verify-gap-semmf-base, runs/verify-gap-semmf-women-tab, runs/verify-gap-semmf-popup; "
                     "read on the public host hairloss1.joinvoy.com/sem-mf). A marketing page, not part of the consultation: one "
                     "Men / Women switch in the 'science' section, then the usual pop-up after about 20 seconds. Every button "
                     "opens /n/hair-loss/quiz/gateway whichever tab is showing.",
    "questions": [
        {
            "id": "mixed-q1", "order": 1, "stage": "anonymous",
            "text": "Men / Women (switch above 'The science behind how hair loss treatments work')",
            "type": "single",
            "options": [
                {"label": "Men",
                 "effect": "Default. Shows Dr Earim Chaudry and three cards: 'Why we lose hair' (DHT), 'DHT blockers' and 'Minoxidil'.",
                 "effectType": "marketing-only", "affects": [], "evidence": "observed"},
                {"label": "Women",
                 "effect": "Shows Dr Sarah Bechstein and four minoxidil benefit cards (scalp circulation, growth phase, shedding, "
                           "stronger strands); DHT blockers are no longer mentioned. No price, button or link changes: "
                           "'View treatments' still opens /n/hair-loss/quiz/gateway.",
                 "effectType": "marketing-only", "affects": [], "evidence": "observed"}
            ],
            "purpose": "Explains the medicines to each sex. The choice is not passed on to the quiz.",
            "engineRole": "marketing", "branches": False, "branchDetail": "",
            "shownWhen": "always on this page", "evidence": "observed"
        },
        {
            "id": "mixed-q2", "order": 2, "stage": "anonymous",
            "text": "Pop-up: 'Which image best matches your hair loss?' (Temples · Temples & Crown · Moderate · Extensive · Patchy · Complete), then the email box",
            "type": "info", "options": [],
            "purpose": "The page is aimed at men and women, but the pop-up it opens is the men's one: six pictures of male pattern "
                       "loss, and (in the page code) the line 'We’ve helped thousands of men regrow thicker, healthier hair'. A "
                       "woman on this page is asked to pick a male pattern. The pop-up also shows a 'Continue exploring' link (not pressed).",
            "engineRole": "eligibility-gate", "branches": True,
            "branchDetail": "Same script as the men's pop-up (rules R1 and R2).",
            "shownWhen": "about 20 seconds after page load", "evidence": "observed"
        }
    ]
})

# --- new flow: the older Manual plan picker, the only product chooser that works without the blocked app -------------------
d["flows"].append({
    "id": "legacy-plan-picker",
    "name": "Older Manual plan picker (still online at hello.manual.co): format and plan length",
    "audience": "men",
    "entryUrl": "https://hello.manual.co/a/hl-hair-loss-minox-plans",
    "stagesSummary": "Added in stage 3. Two older Manual landing pages are still online (banner: 'Manual is now Voy - discover our "
                     "new site') and carry the only product chooser that works without the blocked app: 'Choose your plan' with a "
                     "format tab (Tablets / Spray) and a length tab (3 Months / 6 Months), then a 'Continue' button, which was "
                     "never pressed. Replayed one change at a time (runs/verify-gap-legacy-minox-base, -spray, -3m, -spray-3m; "
                     "runs/verify-gap-legacy-complete-base, -3m). It shows how format and plan length map onto product codes, pack "
                     "sizes and prices. It is the old brand's page: today's Voy prices and codes may differ.",
    "questions": [
        {
            "id": "lpp-q1", "order": 1, "stage": "anonymous",
            "text": "Choose your plan (format): Tablets / Spray",
            "type": "single",
            "options": [
                {"label": "Tablets",
                 "effect": "Pre-selected and tagged 'Most effective'. Heading 'Hair Loss Tablets' ('The most effective oral treatment "
                           "for receding hairlines and balding crowns. Just one pill a day.'). The Continue link carries product "
                           "code minoxidil_oral.",
                 "effectType": "none", "affects": ["p3"], "evidence": "observed"},
                {"label": "Spray",
                 "effect": "Heading and text change to 'Hair Loss Spray - Minoxidil' ('The most powerful spray for direct treatment "
                           "to the scalp … Just two spray applications a day'). The Continue link now carries product code "
                           "minoxidil_topical_10. The price shown does not change.",
                 "effectType": "product-switched", "affects": ["p2", "p3"], "evidence": "observed"}
            ],
            "purpose": "Lets a visitor who already knows what he wants pick the form of minoxidil before any medical question. Small "
                       "print on the page: 'Final treatment plans are shared decisions determined with your clinician after this "
                       "online assessment.'",
            "engineRole": "product-selector", "branches": True,
            "branchDetail": "Tablets → minoxidil_oral. Spray → minoxidil_topical_10. Same price for both forms.",
            "shownWhen": "always, on hello.manual.co/a/hl-hair-loss-minox-plans", "evidence": "observed"
        },
        {
            "id": "lpp-q2", "order": 2, "stage": "anonymous",
            "text": "Choose your plan (length): 3 Months / 6 Months (minoxidil page)",
            "type": "single",
            "options": [
                {"label": "6 Months",
                 "effect": "Pre-selected, tagged 'Save 48%'. Price: £25 struck through, '£13 per month'. Pack in the Continue link: "
                           "180 capsules (oral_minoxidil_180caps_6M_LPT_SUB) or 2 × 90 ml of spray "
                           "(minoxidil_topical_10_2x90ml_6M_LPT_SUB).",
                 "effectType": "none", "affects": ["p2", "p3"], "evidence": "observed"},
                {"label": "3 Months",
                 "effect": "Price: £29.67 struck through, '£14 per month'. Pack in the Continue link: 90 capsules "
                           "(minoxidil_oral_90caps_3M_LPT_5inc_SUB) or 1 × 90 ml of spray (minoxidil_topical_10_1x90ml_3M_5inc_SUB). "
                           "The product code, and so the medicine, stays the same.",
                 "effectType": "marketing-only", "affects": ["p2", "p3"], "evidence": "observed"}
            ],
            "purpose": "Sells the longer commitment: the 6-month plan is the default and the cheaper one per month.",
            "engineRole": "marketing", "branches": False, "branchDetail": "",
            "shownWhen": "always, on the same page", "evidence": "observed"
        },
        {
            "id": "lpp-q3", "order": 3, "stage": "anonymous",
            "text": "Choose your plan (length): 3 Months / 6 Months ('Complete Hair Loss Plan' page, hello.manual.co/a/complete-hair-loss-plan)",
            "type": "single",
            "options": [
                {"label": "6 Months",
                 "effect": "Pre-selected, tagged 'Save 46%'. Price: £33.17 struck through, '£18 per month'. Line under the price: "
                           "'Minimum 6 month treatment, as results take time'. Continue opens the quiz (www.manual.co/n/hair-loss/quiz).",
                 "effectType": "none", "affects": ["p4"], "evidence": "observed"},
                {"label": "3 Months",
                 "effect": "Price: £39.67 struck through, '£21 per month'. The line becomes 'Minimum 3 month treatment, as results "
                           "take time'. Continue still opens the quiz.",
                 "effectType": "marketing-only", "affects": ["p4"], "evidence": "observed"}
            ],
            "purpose": "Same idea for the combined plan. In the page's stored code the Continue button is an add-to-basket link for "
                       "the all-in-one capsule (product code finasteride_oral_minoxidil_oral_biotin); the running page replaces it "
                       "with the quiz link, so here the plan length is only a price display before the quiz.",
            "engineRole": "marketing", "branches": False, "branchDetail": "",
            "shownWhen": "always, on that page", "evidence": "observed"
        }
    ]
})

# ---------------------------------------------------------------------------------------------------------------
# 3. RULES
# ---------------------------------------------------------------------------------------------------------------
add(R["R1"], "proof", "Stage 3: script re-read on the live page (src/verify/hairloss1-home.html) and both options ticked again (runs/verify-exp-m04, runs/verify-exp-m05): confirmed.")
add(R["R2"], "proof", "Stage 3: the coupon being carried into the link was seen directly (runs/verify-gap-coupon-men-code against runs/verify-gap-coupon-men-none): confirmed.")
add(R["R17"], "proof", "Stage 3: script re-read on the live page (src/verify/femalehairloss1-home.html); option ticked again on the main page and on /meta (runs/verify-exp-w03, runs/verify-gap-wmeta-popup-patchy): confirmed.")
add(R["R18"], "proof", "Stage 3: link target re-read in the live page code: confirmed.")
add(R["R19"], "proof", "Stage 3 re-test: runs/verify-widget-base (94%), runs/verify-exp-p01 (87%), runs/verify-exp-p05 (50%), same link each time: confirmed.")
add(R["R20"], "proof", "Stage 3 re-test: runs/verify-popup-men-base, runs/verify-exp-m04, runs/verify-exp-m05, runs/verify-popup-women-base, runs/verify-exp-w03, runs/verify-exp-w04: confirmed.")

add(R["R3"], "proof", "Stage 3: quote re-read word for word in the archive copy: confirmed as a published rule. The stop screen itself was not seen.")
add(R["R4"], "proof", "Stage 3: a third, independent search summary gave the same list (women, men under 18, men over 65). Still not read on the page.")

R["R5"]["evidence"] = "inferred"
add(R["R5"], "then", "Label changed to 'inferred' in stage 3: Voy publishes the caution about minoxidil in general; reading it as 'the sprays are removed and tablets stay' is the investigator's reasoning.")

R["R6"]["affects"] = ["p3", "p4", "p5", "p8"]
R["R6"]["then"] = ("Published: 'Minoxidil should not be used in patients in the following categories: Suffer from uncontrolled, "
                   "dangerously low or high blood pressure' (patient plan for the capsule, so it is about minoxidil taken by "
                   "mouth); the help centre lists 'low blood pressure' under minoxidil. So the oral minoxidil products are ruled "
                   "out and finasteride tablets remain. Whether the sprays (p2, p6, p7, p15) are removed as well is not stated "
                   "and not seen; stage 3 took them out of the 'affects' list.")
add(R["R6"], "proof", "Stage 3: capsule-page quote re-read word for word: confirmed for oral minoxidil.")

add(R["R7"], "proof", "Stage 3: quote re-read word for word in both archive copies: confirmed as a published rule.")
add(R["R8"], "proof", "Stage 3: the FAQ sentence was re-read on the live page on 2026-11-23 (src/verify/hairloss1-home.html): confirmed as a published rule.")
add(R["R9"], "proof", "Stage 3: quote re-read word for word: confirmed as a published rule.")
add(R["R10"], "proof", "Stage 3: a third search summary repeated 'severe depression or suicidal thoughts'; still not read on the page. The company's own study excluded 'psychiatric histories that complicate finasteride use'.")
add(R["R11"], "proof", "Stage 3: archive quote re-read: confirmed as a published rule.")

R["R12"]["evidence"] = "inferred"
R["R12"]["confidence"] = "low"
R["R12"]["when"] = "The person is a woman who arrives through a men's link (for example the gateway)"
add(R["R12"], "then", "Label changed to 'inferred' in stage 3: that the men's medicines are not for women is published; the hand-over to the women's quiz was never seen, and no gateway question is known.")

R["R13"]["evidence"] = "inferred"
R["R13"]["confidence"] = "low"
add(R["R13"], "then", "Label changed to 'inferred' in stage 3: 'not recommended' is published (read through search summaries); the stop is the investigator's reasoning.")

R["R33"]["evidence"] = "inferred"
add(R["R33"], "then", "Label changed to 'inferred' in stage 3 for the same reason as R13.")

add(R["R16"], "proof", "Stage 3: sentence re-read on the saved page text: confirmed.")
add(R["R21"], "proof", "Stage 3: re-read in the archived file itself (function p in the module that exports it): confirmed. As written, the test compares one answer value, so it works on single-answer questions; how a multiple-choice answer rejects is not visible in this function.")
add(R["R22"], "proof", "Stage 3: re-read in the archived file: confirmed. The exclude list is a set of entries keyed by answer value, each naming product codes; the same function always drops a product coded 'hair-consultation' from the result.")
add(R["R23"], "proof", "Stage 3: re-read in the archived file: confirmed.")
add(R["R24"], "proof", "Stage 3: re-read in the archived file (attributes questionHideCondition and questionShowCondition, and 'conditionals'): confirmed.")

R["R25"]["evidence"] = "inferred"
R["R25"]["then"] = ("Older app code shows only that, when the stored preferred product carries the flag 'shouldSwap', the quiz is "
                    "reopened as /n/hair-loss/quiz?atc=true&swap=true. What happens next is in a quiz-page script that could not "
                    "be read. The reading 'the product is exchanged for an eligible one instead of the order being refused' is "
                    "inferred from the names. Label changed from 'code' to 'inferred' in stage 3.")

R["R26"]["affects"] = ["p9", "p10"]
add(R["R26"], "proof", "Stage 3: tags re-read in the archived page data (Power Shampoo and Hair Vitamins both carry 'cart_upsell' and 'pre_checkout_upsell'): confirmed for men; the women's vitamins were taken out of the 'affects' list because that data is the men's page.")
add(R["R27"], "proof", "Stage 3: clauses 4.3 and 4.5 re-read: confirmed (terms dated before the move to the Voy name).")
add(R["R28"], "proof", "Stage 3: both quotes re-read word for word: confirmed as published rules.")
add(R["R29"], "proof", "Stage 3: re-read live (runs/verify-page-fhl-meta): confirmed.")
add(R["R30"], "proof", "Stage 3: re-read live (runs/verify-page-fhl-meta): confirmed.")

R["R31"]["evidence"] = "inferred"
R["R31"]["then"] = ("Only two experiment names are in the older code: 'dutasterideProductChoiceLogic' and 'hlDutasterideSoloTest', "
                    "plus the product page name 'dutasteride-minoxidil-all-in-one-capsule'. They show that a rule choosing "
                    "between the finasteride and the dutasteride capsule was being tested; what triggers it and what it does are "
                    "not in the code. Label changed from 'code' to 'inferred' in stage 3.")

add(R["R32"], "then", "Seen directly on the older Manual plan picker in stage 3: see R35 and R36.")

d["rules"] += [
    {"id": "R34", "flow": "legacy-plan-picker",
     "when": "lpp-q1: 'Tablets' → 'Spray' (older Manual minoxidil page)",
     "then": "The product in the Continue link switches from minoxidil_oral (capsules) to minoxidil_topical_10 (10% spray); the "
             "heading and description change; the price shown stays the same (£13 a month on 6 months, £14 on 3 months).",
     "effectType": "product-switched", "affects": ["p2", "p3"], "evidence": "observed",
     "proof": "runs/verify-gap-legacy-minox-spray against runs/verify-gap-legacy-minox-base (and runs/verify-gap-legacy-minox-spray-3m against runs/verify-gap-legacy-minox-3m)",
     "confidence": "high"},
    {"id": "R35", "flow": "legacy-plan-picker",
     "when": "lpp-q2: '6 Months' → '3 Months' (older Manual minoxidil page)",
     "then": "Only price and pack size change: £25 struck through and £13 a month becomes £29.67 struck through and £14 a month; "
             "180 capsules becomes 90, or 2 × 90 ml becomes 1 × 90 ml. The product code is unchanged.",
     "effectType": "marketing-only", "affects": ["p2", "p3"], "evidence": "observed",
     "proof": "runs/verify-gap-legacy-minox-3m against runs/verify-gap-legacy-minox-base",
     "confidence": "high"},
    {"id": "R36", "flow": "legacy-plan-picker",
     "when": "lpp-q3: '6 Months' → '3 Months' (older Manual 'Complete Hair Loss Plan' page)",
     "then": "Only the price display changes: £33.17 struck through and £18 a month becomes £39.67 struck through and £21 a month, "
             "and 'Minimum 6 month treatment' becomes 'Minimum 3 month treatment'. The Continue button opens the quiz in both cases.",
     "effectType": "marketing-only", "affects": ["p4"], "evidence": "observed",
     "proof": "runs/verify-gap-legacy-complete-3m against runs/verify-gap-legacy-complete-base",
     "confidence": "high"},
    {"id": "R37", "flow": "landing-popup",
     "when": "The landing page is opened with ?coupon=CODE in its address (tested with SPOOKY50, a code Voy's own pages use)",
     "then": "The pop-up's hidden next-step link becomes /n/hair-loss/quiz/gateway?coupon=CODE and the hidden coupon field of the "
             "email form takes the same code. Nothing visible changes. The discount is attached to the visitor before any question is answered.",
     "effectType": "marketing-only", "affects": [], "evidence": "observed",
     "proof": "runs/verify-gap-coupon-men-code against runs/verify-gap-coupon-men-none (read from the page's own code in the browser; nothing typed or submitted)",
     "confidence": "high"},
    {"id": "R38", "flow": "landing-mixed-page",
     "when": "mixed-q1: 'Men' → 'Women' on the page aimed at both sexes",
     "then": "Only the explanatory cards change (DHT blockers and minoxidil for men; four minoxidil benefits for women). Prices, "
             "buttons and links stay the same and all still open the men's gateway link. The pop-up on this page is the men's "
             "picture question whichever tab is showing.",
     "effectType": "marketing-only", "affects": [], "evidence": "observed",
     "proof": "runs/verify-gap-semmf-women-tab against runs/verify-gap-semmf-base; runs/verify-gap-semmf-popup",
     "confidence": "high"},
]

# ---------------------------------------------------------------------------------------------------------------
# 4. EXPERIMENTS (stage 3 runs)
# ---------------------------------------------------------------------------------------------------------------
d["experiments"] += [
    {"id": "v-base-men-quiz", "flow": "men", "changed": "nothing (stage 3 access re-test of /n/hair-loss/quiz)",
     "result": "Stopped at step 0: 'Failed to verify your browser, Code 21'. No question shown. Web fetch: HTTP 429. Not worked around.", "run": "runs/verify-base-men"},
    {"id": "v-base-women-quiz", "flow": "women", "changed": "nothing (stage 3 access re-test of /n/female-hair-loss/quiz)",
     "result": "Stopped at step 0: 'Failed to verify your browser, Code 21'. No question shown. Not worked around.", "run": "runs/verify-base-women"},
    {"id": "v-base-popup-men", "flow": "landing-popup", "changed": "nothing (fresh replay of the baseline: 'Temples & Crown')",
     "result": "Matches the record: six pictures, email box locked until one is ticked, then '*Email address'. End state: email wall.", "run": "runs/verify-popup-men-base"},
    {"id": "v-base-popup-women", "flow": "landing-popup-women", "changed": "nothing (fresh replay of the baseline: 'Widening part')",
     "result": "Matches the record: four options, email box locked until one is ticked. End state: email wall.", "run": "runs/verify-popup-women-base"},
    {"id": "v-base-widget", "flow": "landing-pattern-widget", "changed": "nothing (fresh replay of the baseline: 'Hairline & crown')",
     "result": "Matches the record: '94% saw their hair loss halt or improve'; button → /n/hair-loss/quiz/gateway.", "run": "runs/verify-widget-base"},
    {"id": "v-exp-m04", "flow": "landing-popup", "changed": "popup-q1: Temples & Crown → Patchy (re-test)",
     "result": "Same as stage 2: option shown as checked, email box unlocked, nothing else changes, no warning before the email wall.", "run": "runs/verify-exp-m04"},
    {"id": "v-exp-m05", "flow": "landing-popup", "changed": "popup-q1: Temples & Crown → Complete (re-test)",
     "result": "Same as stage 2.", "run": "runs/verify-exp-m05"},
    {"id": "v-exp-w03", "flow": "landing-popup-women", "changed": "wpopup-q1: Widening part → Patchy hair loss (re-test)",
     "result": "Same as stage 2: checked, email box unlocked, no warning.", "run": "runs/verify-exp-w03"},
    {"id": "v-exp-w04", "flow": "landing-popup-women", "changed": "wpopup-q1: Widening part → Skip (re-test)",
     "result": "Same as stage 2: pop-up closes, page unchanged, buttons still open /n/female-hair-loss/quiz.", "run": "runs/verify-exp-w04"},
    {"id": "v-exp-p01", "flow": "landing-pattern-widget", "changed": "widget-q1: Hairline & crown → At the temples (re-test)",
     "result": "Same as stage 2: '87% of men stopped losing hair & saw regrowth'; same link.", "run": "runs/verify-exp-p01"},
    {"id": "v-exp-p05", "flow": "landing-pattern-widget", "changed": "widget-q1: Hairline & crown → Top and sides (re-test)",
     "result": "Same as stage 2: '50% men saw regrowth'; same link.", "run": "runs/verify-exp-p05"},
    {"id": "v-gap-coupon-none", "flow": "landing-popup", "changed": "nothing (baseline for the coupon test: page address without a code)",
     "result": "Hidden next-step link: https://joinvoy.com/n/hair-loss/quiz/gateway; hidden coupon field empty.", "run": "runs/verify-gap-coupon-men-none"},
    {"id": "v-gap-coupon-code", "flow": "landing-popup", "changed": "page address: no code → ?coupon=SPOOKY50",
     "result": "Hidden next-step link becomes …/quiz/gateway?coupon=SPOOKY50; hidden coupon field = SPOOKY50; the page's other quiz links gain the code too. Nothing visible changes.", "run": "runs/verify-gap-coupon-men-code"},
    {"id": "v-gap-wmeta-patchy", "flow": "landing-popup-women", "changed": "page: main women's page → /meta ad page, 'Patchy hair loss' ticked",
     "result": "Same pop-up with the same four options and 'Skip'; same behaviour. Page links carry ?coupon=50OFFBF.", "run": "runs/verify-gap-wmeta-popup-patchy"},
    {"id": "v-gap-semmf-base", "flow": "landing-mixed-page", "changed": "nothing (baseline: Men tab)",
     "result": "Science section shows Dr Earim Chaudry with 'Why we lose hair', 'DHT blockers', 'Minoxidil'. Cards 'From £13 per month' and 'From £14 per month'; buttons → /n/hair-loss/quiz/gateway.", "run": "runs/verify-gap-semmf-base"},
    {"id": "v-gap-semmf-women", "flow": "landing-mixed-page", "changed": "mixed-q1: Men → Women",
     "result": "Only the science cards and the doctor's name change (four minoxidil benefits, Dr Sarah Bechstein). No price or link changes.", "run": "runs/verify-gap-semmf-women-tab"},
    {"id": "v-gap-semmf-popup", "flow": "landing-mixed-page", "changed": "nothing (wait for the pop-up on the men-and-women page)",
     "result": "The pop-up that opens is the men's: six male-pattern pictures including Patchy and Complete, email box locked, 'Continue exploring' link.", "run": "runs/verify-gap-semmf-popup"},
    {"id": "v-gap-atc-page", "flow": "atc", "changed": "nothing (page load of the minoxidil social landing page)",
     "result": "'Get started' and 'Take the hair quiz' point to /n/hair-loss/quiz?flowType=atc. Cards: 'Tablets — Oral Hair Treatment — From £14 per month' and 'Spray — Minoxidil spray — extra-strength, once a day — From £14 per month'.", "run": "runs/verify-gap-atc-page"},
    {"id": "v-gap-legacy-minox-base", "flow": "legacy-plan-picker", "changed": "nothing (baseline: page default = Tablets, 6 Months)",
     "result": "'Hair Loss Tablets'; 'Save 48%'; £25 struck through, '£13 per month'; Continue → productCode=minoxidil_oral, variantCode=oral_minoxidil_180caps_6M_LPT_SUB.", "run": "runs/verify-gap-legacy-minox-base"},
    {"id": "v-gap-legacy-minox-spray", "flow": "legacy-plan-picker", "changed": "lpp-q1: Tablets → Spray",
     "result": "'Hair Loss Spray - Minoxidil'; same price; Continue → productCode=minoxidil_topical_10, variantCode=minoxidil_topical_10_2x90ml_6M_LPT_SUB.", "run": "runs/verify-gap-legacy-minox-spray"},
    {"id": "v-gap-legacy-minox-3m", "flow": "legacy-plan-picker", "changed": "lpp-q2: 6 Months → 3 Months",
     "result": "£29.67 struck through, '£14 per month'; Continue → productCode=minoxidil_oral, variantCode=minoxidil_oral_90caps_3M_LPT_5inc_SUB.", "run": "runs/verify-gap-legacy-minox-3m"},
    {"id": "v-gap-legacy-minox-spray-3m", "flow": "legacy-plan-picker", "changed": "lpp-q1 and lpp-q2 together: Spray and 3 Months (two changes, to fill the 2 × 2 grid)",
     "result": "£29.67 struck through, '£14 per month'; Continue → productCode=minoxidil_topical_10, variantCode=minoxidil_topical_10_1x90ml_3M_5inc_SUB.", "run": "runs/verify-gap-legacy-minox-spray-3m"},
    {"id": "v-gap-legacy-complete-base", "flow": "legacy-plan-picker", "changed": "nothing (baseline: 'Complete Hair Loss Plan' page default = 6 Months)",
     "result": "'Save 46%'; £33.17 struck through, '£18 per month'; 'Minimum 6 month treatment, as results take time'; Continue → www.manual.co/n/hair-loss/quiz.", "run": "runs/verify-gap-legacy-complete-base"},
    {"id": "v-gap-legacy-complete-3m", "flow": "legacy-plan-picker", "changed": "lpp-q3: 6 Months → 3 Months",
     "result": "£39.67 struck through, '£21 per month'; 'Minimum 3 month treatment, as results take time'; Continue still → the quiz.", "run": "runs/verify-gap-legacy-complete-3m"},
    {"id": "v-page-aio", "flow": "men", "changed": "nothing (product-fact check: all-in-one ad page)",
     "result": "'From £19 per month', 'From £4.75/week on a 6-month plan, paid upfront'; cards 'All-in-One Plans — Spray & Capsules', 'Hair Oral Plans — From £13', 'Hair Spray Plans — From £14'. No struck-through £33 visible.", "run": "runs/verify-page-aio"},
    {"id": "v-page-fhl-sem", "flow": "women", "changed": "nothing (product-fact check: women's search ad page)",
     "result": "'Capsules — Oral Hair Treatments — From £25 £15 per month'; 'Serum — Topical Hair Treatments — From £39 £14.99 per month'.", "run": "runs/verify-page-fhl-sem"},
    {"id": "v-page-fhl-meta", "flow": "women", "changed": "nothing (product-fact check: women's social ad page)",
     "result": "'From £15 /month', 'From £14.99 /month', 'Your first order starts from £14.99'; FAQ on strength, existing treatments and allergies read word for word; four 'How it works' steps.", "run": "runs/verify-page-fhl-meta"},
    {"id": "v-page-transplant", "flow": "men", "changed": "nothing (completeness check: older Manual hair-transplant page)",
     "result": "'404 - Page not found'.", "run": "runs/verify-page-transplant"},
]

# ---------------------------------------------------------------------------------------------------------------
# 5. RECOMMENDATIONS
# ---------------------------------------------------------------------------------------------------------------
for rec in d["recommendations"]:
    if rec["profile"].startswith("Visitor on the product-first route"):
        rec["evidence"] = "inferred"
        rec["note"] = ("Older code shows only a 'shouldSwap' flag and a swap=true address; that the product is then exchanged for an "
                       "eligible one is inferred from the names (label changed from 'code' in stage 3).")
    if rec["profile"].startswith("Baseline man"):
        add(rec, "note", "Stage 3: the recommendation sentence and the 'Most effective' card were re-read on the live page.")
    if rec["profile"].startswith("Baseline woman"):
        add(rec, "note", "Stage 3: prices and the 'Most studied hair loss active' tag were re-read on the live pages.")
d["recommendations"].append({
    "profile": "Visitor on the older Manual minoxidil plan picker, before any medical question (older brand, page still online)",
    "offered": ["p3", "p2"], "default": "p3",
    "note": "Seen in stage 3 replays: 'Tablets' is pre-selected and tagged 'Most effective', '6 Months' is pre-selected and tagged "
            "'Save 48%'. This is a shop-window default, not a consultation result.",
    "evidence": "observed"
})

# ---------------------------------------------------------------------------------------------------------------
# 6. ACCESS, SUMMARY, STRENGTHS / WEAKNESSES / OPPORTUNITIES, LIMITATIONS, SOURCES
# ---------------------------------------------------------------------------------------------------------------
d["access"]["blockers"][0] += (" Stage 3 re-tested once more: /n/hair-loss/quiz and /n/female-hair-loss/quiz gave the same checkpoint in the "
                               "browser (runs/verify-base-men, runs/verify-base-women), and web fetch got HTTP 429 on the quiz and on a product page.")
d["access"]["blockers"][1] += " Stage 3: two help-centre articles again answered HTTP 403 to web fetch."
d["access"]["coverageNote"] += (
    " Stage 3 (verification) replayed every baseline and six stage 2 experiments again with the same results, re-read the page "
    "scripts and the archived app code, and added 13 gap replays: the older Manual plan picker that is still online (format and "
    "plan length, the only product chooser that works without the blocked app), the page aimed at both sexes, the women's /meta "
    "pop-up, the product-first landing page and the coupon hand-over. None of these is the consultation itself.")

d["engineSummary"] = (
    "Voy's real quiz could not be opened in any of the three stages, so this is the engine only as far as public evidence shows "
    "it. What was seen: (1) A pattern gate before the quiz. The men's and women's landing pages open a one-question pop-up. Its "
    "own script refuses 'Patchy' and 'Complete' (men) and 'Patchy hair loss' (women) with 'You aren't eligible', and sends "
    "everyone else to the quiz with a discount code attached. The verdict only appears after an email is given; ticking a "
    "refused option looks exactly like ticking an accepted one. The page aimed at both sexes shows the men's picture question "
    "to everyone. A separate pattern picker is pure marketing: every pattern leads to the same quiz link. (2) On an older "
    "Manual page that is still online, choosing 'Spray' instead of 'Tablets' switches the product (minoxidil capsules to 10% "
    "spray) at the same price, and choosing 3 months instead of 6 changes only the price and pack size. What was read in code, "
    "not seen running: an 11-month-old copy of the same web app (Manual, December 2025). There the quiz starts with a list of "
    "products, and each question can carry a reject list (one matching answer leaves no product and shows 'You aren't "
    "eligible', with a 'Review your answers' button), an exclude list (the answer removes named products and the quiz carries "
    "on) and parent or JSON Logic conditions (the answer opens, hides or rewords later questions). In that function an answer "
    "can only remove products, never add one. Which answers sit on which list is in a definition the app downloads at run time; "
    "it could not be read, and that code has no women's hair flow in it. What Voy publishes: lists of who should not have which "
    "medicine. DHT blockers (finasteride, dutasteride) are 'not suitable' for men trying for a baby or with a pregnant partner, "
    "men treated for an enlarged prostate, men who have had breast or prostate cancer, and men with severe depression; "
    "minoxidil 'should not be used' with low or uncontrolled blood pressure or a sore scalp, or over 65; under-18s, women (in "
    "the men's service) and men who are completely bald or do not have pattern hair loss are not treated. Whether the quiz "
    "applies each of these by removing a product, by warning, or by leaving it to the clinician was not seen. After the quiz, "
    "older code and Voy's pages point to: a recommendation (Voy leads with finasteride plus minoxidil together for men; women "
    "are offered minoxidil only, as serum or tablets, at a strength the clinician sets), a format and plan-length choice, "
    "add-ons (shampoo, vitamins), then the account, a medical-history questionnaire, photos and payment details, and a "
    "prescriber's review that sees flagged and changed answers. Older terms say payment is taken only on approval.")

d["strengths"][0] = ("A wide men's range: licensed finasteride, 10% (and probably 5%) minoxidil spray, 2.5 mg oral minoxidil, "
                     "one-a-day combined capsules (finasteride with minoxidil; a dutasteride version is described in the help "
                     "centre) and, on older pages, a topical finasteride + minoxidil spray. Voy advertises '30+ treatment "
                     "combinations'. No comparison with other companies was made in this file.")
d["strengths"][1] = ("An engine that can keep the customer: in the older code an answer can remove one medicine and leave the rest on "
                     "offer, and a swap flag exists on the product-first route (what it does is inferred). How often Voy uses "
                     "removal rather than refusal is not known; the only refusals seen are the pattern gate in the pop-ups.")
d["strengths"][2] = ("Low entry prices in adverts (from £13 to £19 a month for men, £14.99 to £15 for women on first order), payment "
                     "only after clinician approval (older terms of sale), a 180-day Money Back Promise, 'unlimited clinician "
                     "support' and a photo progress tracker.")
d["strengths"][5] = ("Own pharmacy and in-house prescribers, delivery advertised in under 48 hours, pause / switch / cancel in the "
                     "account, and heavy conversion testing (70 experiment and feature flags downloaded by the landing page on the day).")
d["weaknesses"][2] = ("Diagnosis looks thin, as far as public material shows (the quiz itself was not seen): a picture choice and a "
                      "medical history taking 'under 2 minutes'. Nothing public mentions questions on shedding speed, diet, iron, "
                      "thyroid, hormones or medicines that cause hair loss; photos are described as for tracking, not for diagnosis "
                      "before the first prescription.")
d["weaknesses"][3] = ("Thin women's range: minoxidil only (serum or tablets) plus vitamins, for every cause Voy itself lists (hormonal, "
                      "menopause, postpartum, stress). No blood test is mentioned on the hair-loss pages, although the company sells "
                      "them for other services. The page aimed at both sexes shows women the men's picture question.")
d["weaknesses"][6] = ("Headline prices are first-order promotions on a 6-month plan: the complete plan is advertised 'from £19' but "
                      "bills at £33.17 a month on 6-month billing and £44 on monthly billing (search summary of the plan page). Pages "
                      "contradict each other (women's serum: £14.99, £24 and £39; spray 'once a day' on one page and 'twice daily' on "
                      "another), and the page code holds a hidden test that would show '£33' struck through beside every men's price.")
d["opportunities"][1] = ("Diagnose properly where Voy appears only to screen (its quiz could not be seen): ask about speed of loss, "
                         "shedding, scalp symptoms, periods and menopause, recent illness, diet and medicines; use baseline photos "
                         "reviewed by a clinician before the first prescription; offer ferritin, thyroid and hormone tests when the "
                         "answers point that way.")

d["limitations"][1] = ("The one-change experiments cover only what is public: the men's pop-up, the women's pop-up and the pattern "
                       "picker (stage 2: 17 replays plus 3 blocked access checks; stage 3: 11 fresh re-plays) and, added in stage 3, "
                       "the older Manual plan picker, the page aimed at both sexes, the product-first landing page and the coupon "
                       "hand-over (13 gap replays plus 4 page checks). Every rule about the quiz proper is 'code' (older app), 'docs' "
                       "(a published exclusion) or 'inferred', never 'observed'.")
sub_l2_old = "The engine rules R21 to R25 and R31 come from the shared script of the Manual web app as archived on 29 Dec 2025."
if sub_l2_old not in d["limitations"][2]:
    raise SystemExit("limitations[2] is not the text expected")
d["limitations"][2] = d["limitations"][2].replace(
    sub_l2_old,
    "The engine rules R21 to R24 come from the shared script of the Manual web app as archived on 29 Dec 2025 (re-read in stage 3); "
    "R25 and R31 rest only on names found in that script and are labelled 'inferred'.")
d["limitations"][3] = ("Rules R3 to R14, R28 and R33 come from Voy's published 'who should not use it' lists. 'docs' on these rules means "
                       "only that the exclusion is published (two lists are word-for-word archive copies of older Manual patient plans, "
                       "one sentence is on the live page, and the help-centre lists were given the same way by three separate search "
                       "summaries but never read on the page). It does not mean the quiz was seen applying it. Where the stated effect "
                       "goes beyond the published words (R5, R12, R13, R33) the rule is 'inferred'. The older wording on trying to "
                       "conceive and on past depression is softer than the current FAQ.")
d["limitations"] += [
    "The older Manual plan picker (rules R34 to R36) is the old brand's page. It is still online and links to manual.co, but its product codes, pack sizes and prices may not match what Voy sells today.",
    "The engine code is from December 2025 and contains neither the word 'gateway' nor any women's hair-loss flow, so both are newer than anything that could be read. Stage 2's gateway question ('What was your sex at birth?') was removed in stage 3 because that wording belongs to a different quiz in the old code.",
    "company.json is now written by scripts/verify-company-s3.py on top of the frozen stage 2 file (src/company-stage2.json). Re-running either earlier build script would overwrite the corrections.",
]

d["sources"] += [
    {"title": "Older Manual hair-transplant landing page (found through a web search; 'Page not found' on 2026-11-23)", "url": "https://hair-transplant.manual.co/ht/landing-page"},
    {"title": "Voy landing page: Minoxidil Treatments, social (buttons open the product-first route) — opened 2026-11-23 in stage 3", "url": "https://hairloss1.joinvoy.com/a/social/hair-loss-minoxidil"},
    {"title": "Voy women's search ad page — opened 2026-11-23 in stage 3", "url": "https://femalehairloss1.joinvoy.com/sem"},
    {"title": "Old Manual help: Cautions - who should not use our Hair Loss treatment (HTTP 403 to web fetch; listed by a search engine)", "url": "https://help.manual.co/hc/en-us/articles/4404977114900-Cautions-who-should-not-use-our-Hair-Loss-treatment"},
    {"title": "Old Manual help: A guide to our Dutasteride Minoxidil All in One Capsule (HTTP 403 to web fetch; listed by a search engine)", "url": "https://help.manual.co/hc/en-us/articles/48437486482068-A-guide-to-our-Dutasteride-Minoxidil-All-in-One-Capsule"},
]

# ---------------------------------------------------------------------------------------------------------------
# 7. VERIFICATION BLOCK
# ---------------------------------------------------------------------------------------------------------------
d["verification"] = {
    "checkedOn": "2026-11-23",
    "checked": [
        "Access: /n/hair-loss/quiz and /n/female-hair-loss/quiz re-tested once each in the browser: same security checkpoint ('Failed to verify your browser, Code 21'; runs/verify-base-men, runs/verify-base-women). Web fetch: HTTP 429 on the quiz and on the finasteride product page; HTTP 403 on two help-centre articles. Not worked around. Result: the recorded blockers are real and still in place.",
        "Baselines replayed fresh: men's pop-up ('Temples & Crown'), women's pop-up ('Widening part'), pattern picker ('Hairline & crown'). End states match the record (runs/verify-popup-men-base, runs/verify-popup-women-base, runs/verify-widget-base).",
        "R1 (men's pop-up refuses Patchy and Complete): CONFIRMED. Script re-read on the live page; both options ticked again (runs/verify-exp-m04, runs/verify-exp-m05). The refusal screen itself was not triggered because it needs an email.",
        "R17 (women's pop-up refuses Patchy hair loss): CONFIRMED the same way (runs/verify-exp-w03; also on the /meta page, runs/verify-gap-wmeta-popup-patchy).",
        "R2 and R18 (everyone else is sent to the quiz with the coupon): CONFIRMED in page code; the coupon hand-over was also seen directly (runs/verify-gap-coupon-men-code against -none).",
        "R19 (pattern picker is marketing only): CONFIRMED (runs/verify-exp-p01: 87%; runs/verify-exp-p05: 50%; same quiz link).",
        "R20 (a refused option looks the same as an accepted one until the email is given; Skip just closes): CONFIRMED (six re-test runs).",
        "R21 (reject list empties the product list) and R22 (exclude list removes named products): CONFIRMED by re-reading the function in the archived December 2025 app script itself, not the excerpt file.",
        "R23 (follow-up questions by parent answer) and R24 (show / hide / reword by JSON Logic): CONFIRMED in the same file.",
        "R25 (product swap on the product-first route): PARTLY CONTRADICTED. The code shows only a 'shouldSwap' flag and a swap=true address; the exchange itself is not in it. Downgraded to 'inferred'.",
        "R31 (dutasteride choice): only experiment names exist in the code. Downgraded to 'inferred'.",
        "Gateway question 'What was your sex at birth?': CONTRADICTED. In the old code it belongs to a general wellness and blood-test quiz, not to hair loss. Removed.",
        "R3, R7, R9, R11, R28 and the oral part of R6: quotes CONFIRMED word for word in the archived Manual patient plans. R8: sentence CONFIRMED on the live men's page. R26 and R27: CONFIRMED in archived page data and terms of sale. R29 and R30: CONFIRMED on the live women's /meta page.",
        "R4, R5, R10 (help-centre cautions): a third, independent search summary gave the same lists (minoxidil not for women, under 18, over 65, sore scalp, low blood pressure; DHT blockers not with prostate treatment, trying to conceive, breast or prostate cancer, gynaecomastia, severe depression). The articles themselves stay behind sign-in.",
        "Product facts checked against pages that open (13): men's banner '50% off hair loss plans. Free shampoo with every plan. 16/11 to 30/11'; finasteride 'From £13 per month', format Tablet; minoxidil 'From £14 per month', 'Tablet or spray'; spray 'extra-strength … once a day'; complete plan 'From £19 per month', 'Tablet, spray or combination'; 'All-in-One Plans — Spray & Capsules — From £19'; 'From £4.75/week on a 6-month plan, paid upfront'; Power Shampoo ingredients (caffeine, biotin, saw palmetto); 180-day money back wording; women's oral 'From £15.00' and 'From £25 £15'; women's topical 'From £24.00' and 'From £39 £14.99'; 'Minoxidil solution' and 'first order starts from £14.99'; women's FAQ on strength and allergies. All matched, except the '£33 struck through' (see corrected).",
        "Product facts checked against other sources: capsule strengths (finasteride 1 mg + minoxidil 2.5 mg, biotin) in the archived patient plan and the published 502-patient study; complete-plan billing grid (£44 / £39.67 / £33.17) and Power Shampoo prices by a second search summary; 10% spray product code and pack sizes by replay of the older Manual page.",
        "Regulator and study facts: GPhC outcomes of March, August and October 2026 and the 2023 report re-read in the saved texts; the study's size, doses and lack of a structured side-effect questionnaire re-read on PubMed Central. Confirmed.",
        "Completeness: Voy's live men's menu lists five hair products (Complete Hair Loss Plan, Finasteride Plan, Minoxidil, Power Shampoo, Hair Vitamins) and the women's menu two (minoxidil plans, hair vitamins); all are in the catalogue. The women's route is covered as far as public pages allow (pop-up, prices, FAQ)."
    ],
    "corrected": [
        "Prices: 'shown with £33 struck through' removed from six men's products. The £33 sits in a hidden test element in the page code and was not visible in any replay or in stage 1's own screenshot.",
        "Gateway flow: the question 'What was your sex at birth?' and its two options were removed (wrong quiz); the entry is now 'wording unknown', labelled 'inferred'. Rule R12 reworded and relabelled 'inferred'.",
        "Evidence labels downgraded to 'inferred': question topics men-t2 to men-t9 and women-t2, women-t3 (the exclusion is published, the quiz question is not); rules R5, R12, R13, R33 (the stated effect goes beyond the published words); rules R25 and R31 and the product-first recommendation profile (names in code only).",
        "R6: sprays taken out of the 'affects' list (the published sentence is about minoxidil by mouth). R26: women's vitamins taken out of 'affects' (the data is the men's page).",
        "Product-first flow: wording changed so that the swap is described as inferred, not read in code.",
        "Added from stage 3 replays: two flows (older Manual plan picker; page aimed at both sexes) with 5 questions and 8 options, rules R34 to R38 (all observed), 28 experiment entries, one recommendation profile, product p16 (older hair-transplant service, page now gone).",
        "Products: stage 3 notes added (field 'checkS3') saying what was and was not confirmed; Power Shampoo and Hair Vitamins prices extended from a second search summary; inconsistency on spray frequency and strength recorded.",
        "Strengths and weaknesses: removed 'widest range of the UK players' (no comparison was made), 'next-day delivery' (the page says under 48 hours) and 'double to triple' prices (replaced with the actual figures); softened claims about what the unseen quiz does not ask.",
        "Engine summary rewritten to separate what was seen, what was read in old code and what Voy publishes.",
        "Screenshot 08 replaced: the help-centre sign-in wall (still in src/help/) made way for the older Manual plan picker with 'Spray' and '3 Months' chosen."
    ],
    "stillUnverified": [
        "Every question, option and rule of the real men's, gateway, product-first and women's quiz. None was seen.",
        "Whether today's Voy app still uses the December 2025 engine (reject list, exclude list, parent and JSON Logic conditions), and whether the women's quiz runs on it.",
        "Whether each published exclusion is applied by the quiz (removal or stop), by a warning, or only by the clinician; and which products each one removes.",
        "The help-centre caution lists (R4, R5, R10 and parts of R7 to R11): three search summaries agree, but the articles were never read directly.",
        "What triggers the dutasteride capsule or the 5% spray; whether pattern severity changes the default plan; what the swap on the product-first route does.",
        "Strengths: women's serum and tablets (and any other active in the serum), the dutasteride capsule, topical finasteride 0.1% (from a page name only), oral minoxidil 2.5 mg and biotin 10 mg on a current Voy page. The 10% spray strength is not printed on any Voy page that could be opened.",
        "Standing prices per plan length for every product except the complete plan (and that one only through search summaries); Power Shampoo and Hair Vitamins prices (summaries disagree for vitamins); the dutasteride capsule and all-in-one spray prices.",
        "Whether the all-in-one spray, the 5% spray and hair transplants are still sold.",
        "Where today's flow asks for sign-in, and whether the recommendation and price are shown before it.",
        "Whether the older terms (payment only on approval, 10 days to answer a clinician) still apply under the Voy name."
    ],
    "verdict": "Trust this report for three things: (1) what Voy shows in public before the quiz (the pop-up gates and their rules, the "
               "pattern picker, landing prices and product names, the women's offer), which was replayed again in stage 3 with the "
               "same results; (2) how the older Manual app's engine worked in December 2025, which was read in the "
               "code twice; and (3) which exclusions Voy publishes. Do not read it as a map of Voy's consultation. No quiz screen "
               "was reached in any stage because of a security checkpoint that was deliberately not worked around, so there is no "
               "question list, no option-by-option rule and no observed recommendation for the real quiz. The rules that tie a "
               "medical answer to a product are published cautions or reasoning from them, now labelled as such, and several "
               "strengths and prices rest on search-engine summaries of pages that would not open. After the corrections above "
               "the labels are honest: 'observed' always has a run folder behind it, 'code' has been re-read in the file, 'docs' "
               "means 'Voy publishes this', and everything else is 'inferred' or 'unknown'."
}

with open(OUT, "w", encoding="utf-8") as fh:
    json.dump(d, fh, indent=1, ensure_ascii=False)
    fh.write("\n")
print("written", OUT)
