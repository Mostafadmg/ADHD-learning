# Builds company.json for Keeps (stage 1, MAP). Run: python3 -I build-company.py
# Every fact below comes from a named run folder, a served code file or a public page. Nothing is invented.
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
W = "https://www.keeps.com"
CH4186 = "quiz-definition.js (= served chunk 4186-023f24e4c45a5ed8.js)"

def opt(label, effect, effectType="none", affects=None, evidence="code"):
    return {"label": label, "effect": effect, "effectType": effectType, "affects": affects or [], "evidence": evidence}

def q(id, order, text, type, options, purpose, role, stage="anonymous", branches=False, branchDetail="", shownWhen="always", evidence="observed"):
    return {"id": id, "order": order, "stage": stage, "text": text, "type": type, "options": options, "purpose": purpose,
            "engineRole": role, "branches": branches, "branchDetail": branchDetail, "shownWhen": shownWhen, "evidence": evidence}

# ---------------------------------------------------------------- products
products = [
 {"id": "p1", "name": "Chew 3-In-1: Finasteride & Minoxidil", "category": "rx-oral-compounded",
  "actives": [{"name": "finasteride", "strength": "1 mg"}, {"name": "minoxidil (oral)", "strength": "2.5 mg"}, {"name": "vitamin D3", "strength": "2000 IU"}],
  "form": "citrus chewable tablet, one a day", "audience": "men",
  "legalStatus": "US compounded prescription medicine (the site says: 'This compounded medication is not FDA-approved but may be prescribed by a licensed provider')",
  "price": "$94.96 for the first 3 months (shown as $31.65 a month), list price $154.99 per 3 months",
  "priceDetail": "Monthly plan: $50.00 first month, list $69.99. Product ids 18639 (30 days) and 18640 (90 days); 28/84-day variants 19095/19096 at the same prices. An older listing (ids 18349/18350) shows $48.99 / $108.49 first order.",
  "url": W + "/our-products/chew-3-in-1-finasteride-and-minoxidil",
  "recommendedWhen": "Main quiz: form answer is 'Daily Chew' or 'not sure', and top priority is 'Keeping treatment simple & affordable' (read in code). It is also always shown as the second card beside Chew+ on the oral plan page (seen in runs/baseline-men).",
  "evidence": "observed"},
 {"id": "p2", "name": "Chew+ 5-In-1: Dutasteride & Minoxidil", "category": "rx-oral-compounded",
  "actives": [{"name": "dutasteride", "strength": "0.5 mg ('Higher Dose'; a 0.2 mg version also exists in the price data)"}, {"name": "minoxidil (oral)", "strength": "2.5 mg"}, {"name": "biotin", "strength": "10 mg"}, {"name": "vitamin C", "strength": "120 mg"}, {"name": "zinc", "strength": "10 mg"}],
  "form": "citrus chewable tablet, one a day", "audience": "men",
  "legalStatus": "US compounded prescription medicine, not FDA-approved (site wording). Dutasteride is not FDA-approved for hair loss in any form.",
  "price": "$100.00 for the first 3 months (shown as $33.33 a month), list price $199.99 per 3 months",
  "priceDetail": "Monthly plan: $59.99 first month, list $84.99. The checkout page says renewals are $204.99 per 3 months, first refill billed 75 days after purchase. Ids 19276 (30 days) / 19277 (90 days) = 'Chew+ Higher Dose' (dutasteride 0.5 mg). Ids 18637/18638 and 19097/19098 = same name with dutasteride 0.2 mg, same prices (named CHEW_PLUS_*_LOWER_DOSE in code).",
  "url": W + "/our-products/chew-plus-5-in-1-dutasteride-and-minoxidil",
  "recommendedWhen": "Main quiz default: form answer is 'Daily Chew' or 'not sure' and top priority is anything except 'simple & affordable' (code; seen for the baseline man in runs/baseline-men).",
  "evidence": "observed"},
 {"id": "p3", "name": "Drop 4-In-1: Finasteride & Minoxidil", "category": "rx-topical-compounded",
  "actives": [{"name": "finasteride", "strength": "0.3%"}, {"name": "minoxidil", "strength": "5%"}, {"name": "tretinoin", "strength": "0.01%"}, {"name": "hydrocortisone", "strength": "1%"}],
  "form": "scalp drops (solution), 1 mL once a day", "audience": "men",
  "legalStatus": "US compounded prescription medicine, not FDA-approved (site wording)",
  "price": "$140.02 for the first 3 months, list price $189.99 per 3 months",
  "priceDetail": "Monthly plan: $79.96 first month, list $109.99. Ids 18150 (30 days) / 18635 (90 days); 30 mL / 90 mL bottles in the 28/84-day variants 19091/19092.",
  "url": W + "/our-products/drop-4-in-1-finasteride-and-minoxidil",
  "recommendedWhen": "Main quiz: form answer is 'Topical Drop (Rx Serum)' and top priority is 'Keeping treatment simple & affordable' (code, not yet replayed). Also reachable from any plan page through 'Want to switch to topical solutions?'.",
  "evidence": "code"},
 {"id": "p4", "name": "Drop+ 11-In-1: Dutasteride & Minoxidil", "category": "rx-topical-compounded",
  "actives": [{"name": "dutasteride", "strength": "0.25%"}, {"name": "minoxidil", "strength": "5%"}, {"name": "latanoprost", "strength": "0.005%"}, {"name": "tretinoin", "strength": "0.01%"}, {"name": "cetirizine", "strength": "1%"}, {"name": "melatonin", "strength": "0.1%"}, {"name": "hydrocortisone", "strength": "1%"}, {"name": "caffeine", "strength": "0.2%"}, {"name": "biotin", "strength": "0.2%"}, {"name": "rosemary oil", "strength": "0.1%"}, {"name": "vitamin D3", "strength": "1000 (unit not stated in the data)"}],
  "form": "scalp drops (solution), 1 mL once a day", "audience": "men",
  "legalStatus": "US compounded prescription medicine, not FDA-approved (site wording)",
  "price": "$149.93 for the first 3 months, list price $209.99 per 3 months",
  "priceDetail": "Monthly plan: $84.95 first month, list $119.99. Ids 18153 (30 days) / 18636 (90 days); 28/84-day variants 19093/19094.",
  "url": W + "/our-products/drop-plus-11-in-1-dutasteride-and-minoxidil",
  "recommendedWhen": "Main quiz: form answer is 'Topical Drop (Rx Serum)' and top priority is anything except 'simple & affordable' (code, not yet replayed).",
  "evidence": "code"},
 {"id": "p5", "name": "Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil", "category": "rx-topical-compounded",
  "actives": [{"name": "minoxidil", "strength": "8%"}, {"name": "dutasteride", "strength": "0.25%"}, {"name": "finasteride", "strength": "0.01%"}, {"name": "latanoprost", "strength": "0.005%"}, {"name": "tretinoin", "strength": "0.001%"}, {"name": "cetirizine", "strength": "1%"}, {"name": "melatonin", "strength": "0.1%"}, {"name": "caffeine", "strength": "0.2%"}, {"name": "biotin", "strength": "0.2%"}, {"name": "vitamin D3", "strength": "1000 (unit not stated in the data)"}],
  "form": "scalp gel, 5 pumps (1.1 g) once a day; 33 mL per month", "audience": "men",
  "legalStatus": "US compounded prescription medicine. Product page: 'Gel+ is a compounded medication that is not FDA-approved.'",
  "price": "$139.99 for the first 3 months (shown as $46.66 a month), list price $239.99 per 3 months",
  "priceDetail": "Monthly plan: $74.99 first month, list $99.99. Ids 19266 (33 mL, 30 days) / 19267 (99 mL, 90 days).",
  "url": W + "/our-products/gel-plus-10-in-1-dutasteride-finasteride-and-minoxidil",
  "recommendedWhen": "Always, in the Gel funnel: the gel quiz sends every patient to Gel+ whatever they answer (code; seen in runs/baseline-men-gel).",
  "evidence": "observed"},
 {"id": "p6", "name": "Topical Finasteride and Minoxidil Gel", "category": "rx-topical-compounded",
  "actives": [{"name": "finasteride", "strength": "0.25%"}, {"name": "minoxidil", "strength": "5%"}],
  "form": "scalp gel, once a day", "audience": "men",
  "legalStatus": "US compounded prescription medicine (line item is named 'Compounded: Finasteride 0.25% / Minoxidil 5% Gel (FMG)')",
  "price": "$126 for the first 3 months (93 g), list price $180 per 3 months",
  "priceDetail": "1-month size (30 g): $56 first order, list $80. Ids 1154 (90 days) / 665 (30 days).",
  "url": W + "/our-products/topical-finasteride-and-minoxidil",
  "recommendedWhen": "Not picked by either quiz in the code read so far. Self-selected on /plan-selection ('Best for Overall Thinning Hair', 'New') and /our-products.",
  "evidence": "observed"},
 {"id": "p7", "name": "Topical Finasteride and Minoxidil Foam", "category": "rx-topical-compounded",
  "actives": [{"name": "finasteride", "strength": "0.25%"}, {"name": "minoxidil", "strength": "5%"}],
  "form": "scalp foam", "audience": "men",
  "legalStatus": "US compounded prescription medicine",
  "price": "$105 for the first 3 months (117 g), list price $150 per 3 months",
  "priceDetail": "30-day size (39 g): $56 first order, list $80. Ids 1000 / 19063. Found only in the price data the products page loads (runs/catalogue/net); it has no product page or card of its own.",
  "url": W + "/our-products",
  "recommendedWhen": "unknown (not shown in any walked flow)",
  "evidence": "code"},
 {"id": "p8", "name": "Finasteride 1 mg tablets", "category": "rx-oral",
  "actives": [{"name": "finasteride", "strength": "1 mg"}],
  "form": "tablet, one a day", "audience": "men",
  "legalStatus": "US Rx, FDA-approved generic",
  "price": "$56 for the first 3 months (90 tablets), list price $80 per 3 months",
  "priceDetail": "6 months: $94.50 first order, list $135. 12 months: $168 first order, list $240. A 30-tablet pack (id 19064) is in the price data at $40 list / $28. Ids 211 / 406 / 405. The Keeps 2.0 code also carries 'KEEPS2_FINASTERIDE' ids 18616 (1 month), 18547, 18548 and 18549 with fallback prices $30 a month / $80 per 3 months.",
  "url": W + "/our-products/finasteride",
  "recommendedWhen": "Legacy mini quiz: any hair-loss location except 'Nowhere yet' (code; seen for the baseline man: /quiz/lead?products=211,239). /plan-selection labels it 'Best for Receding Hairline'.",
  "evidence": "observed"},
 {"id": "p9", "name": "Minoxidil Foam, 5%", "category": "otc-medicine",
  "actives": [{"name": "minoxidil", "strength": "5%"}],
  "form": "scalp foam, half a capful twice a day", "audience": "men",
  "legalStatus": "US OTC (FDA-approved, no prescription)",
  "price": "$35 for the first 3 months (180 g), list price $50 per 3 months",
  "priceDetail": "6 months: $58.80 first order, list $84. 12 months: $107.10 first order, list $153. Ids 239 / 604 / 605.",
  "url": W + "/our-products/minoxidil-foam",
  "recommendedWhen": "Legacy mini quiz: location is crown, 'a bit of both' or 'nowhere yet', the patient did not choose pills, and showed no interest in tretinoin or vitamins (code; seen for the baseline man). /plan-selection labels minoxidil 'Best for Thinning At The Crown'.",
  "evidence": "observed"},
 {"id": "p10", "name": "Minoxidil Solution, 5%", "category": "otc-medicine",
  "actives": [{"name": "minoxidil", "strength": "5%"}],
  "form": "scalp solution, 1 mL twice a day", "audience": "men",
  "legalStatus": "US OTC (FDA-approved, no prescription)",
  "price": "$23.10 for the first 3 months (180 mL), list price $33 per 3 months",
  "priceDetail": "6 months: $39.20 first order, list $56. 12 months: $71.40 first order, list $102. Ids 188 / 602 / 603.",
  "url": W + "/our-products/minoxidil-solution",
  "recommendedWhen": "Not picked by the quiz directly (the quiz picks foam). Offered as the other 'minoxidil type' on /plan-selection and /our-products; the legacy code swaps foam for solution only if solution is already in the cart.",
  "evidence": "observed"},
 {"id": "p11", "name": "Oral Minoxidil 2.5 mg tablets", "category": "rx-oral",
  "actives": [{"name": "minoxidil (oral)", "strength": "2.5 mg tablets; packs of 45, 90, 135 or 180 tablets per 90 days (about 1.25 mg to 5 mg a day)"}],
  "form": "tablet", "audience": "men",
  "legalStatus": "US Rx, prescribed off-label for hair loss (site wording: 'prescribed off-label')",
  "price": "$63 for the first 3 months, list price $90 per 3 months (same price for every pack size)",
  "priceDetail": "Ids 921 (45 tablets), 989 (90), 15162 (135), 15163 (180). The site's menu link goes to a separate landing page on buy.keeps.com.",
  "url": "https://buy.keeps.com/low-dose-oral-minoxidil",
  "recommendedWhen": "Legacy mini quiz (code, not yet replayed): the patient prefers pills and the loss is at the crown or both; or the loss is at the hairline and the patient prefers pills or has no preference.",
  "evidence": "code"},
 {"id": "p12", "name": "Minoxidil+ Spray", "category": "rx-topical-compounded",
  "actives": [{"name": "minoxidil", "strength": "5%"}, {"name": "caffeine", "strength": "0.2%"}, {"name": "melatonin", "strength": "0.1%"}, {"name": "tretinoin", "strength": "0.01%"}],
  "form": "scalp spray, once a day (81 g per 3 months)", "audience": "men",
  "legalStatus": "US compounded prescription medicine. Product page: 'Minoxidil+ Hair Regrowth Spray is not FDA approved'.",
  "price": "$94.50 for the first 3 months, list price $135 per 3 months",
  "priceDetail": "30-day size (27 g, id 19048): $45.50 first order, list $65. 3-month id 11840.",
  "url": W + "/our-products/minoxidil-spray",
  "recommendedWhen": "Legacy mini quiz (code): replaces minoxidil foam when the patient ticks 'Products with tretinoin' or 'Vitamins and supplements'.",
  "evidence": "code"},
 {"id": "p13", "name": "Ketoconazole Shampoo, 2%", "category": "rx-topical-licensed",
  "actives": [{"name": "ketoconazole", "strength": "2%"}],
  "form": "shampoo, 2-3 times a week (120 mL per 3 months)", "audience": "men",
  "legalStatus": "US Rx (FDA-approved for dandruff; sold here as a hair-loss add-on)",
  "price": "$23.10 for the first 3 months, list price $33 per 3 months",
  "priceDetail": "12 months (480 mL, id 19082): $75.60 first order, list $108. 3-month id 240.",
  "url": W + "/our-products/ketoconazole",
  "recommendedWhen": "Legacy mini quiz (code): dandruff answer is 'Yes', or the patient ticks 'Products with ketoconazole'.",
  "evidence": "code"},
 {"id": "p14", "name": "Keeps Thickening Shampoo", "category": "cosmetic",
  "actives": [{"name": "cosmetic thickening formula (ingredients not checked)"}],
  "form": "shampoo, 8 oz (236 mL)", "audience": "men", "legalStatus": "cosmetic",
  "price": "$15.40 first order on a 3-month subscription, list price $22",
  "priceDetail": "One-off purchase id 927: $24 list ($16.80 with the first-order discount). Subscription id 499.",
  "url": W + "/our-products/thickening-shampoo",
  "recommendedWhen": "Legacy mini quiz (code): location is 'Nowhere yet', or the patient ticks 'Hair care products (shampoo and conditioner)'.",
  "evidence": "code"},
 {"id": "p15", "name": "Keeps Thickening Conditioner", "category": "cosmetic",
  "actives": [{"name": "cosmetic thickening formula (ingredients not checked)"}],
  "form": "conditioner, 8 oz (236 mL)", "audience": "men", "legalStatus": "cosmetic",
  "price": "$15.40 first order on a 3-month subscription, list price $22",
  "priceDetail": "One-off purchase id 928: $24 list. Subscription id 500.",
  "url": W + "/our-products/thickening-conditioner",
  "recommendedWhen": "Same rule as the thickening shampoo (code).",
  "evidence": "code"},
 {"id": "p16", "name": "Thickening Pomade", "category": "cosmetic",
  "actives": [{"name": "styling product (ingredients not checked)"}],
  "form": "pomade, 3 oz (85 g)", "audience": "men", "legalStatus": "cosmetic",
  "price": "$17.50 first order on a 3-month subscription, list price $25",
  "priceDetail": "One-off purchase id 926: $27 list. Subscription id 682.",
  "url": W + "/our-products/thickening-pomade",
  "recommendedWhen": "Legacy mini quiz (code): the patient ticks 'Hair styling products (pomade)'.",
  "evidence": "code"},
 {"id": "p17", "name": "Daily Hair Defense Supplement", "category": "supplement",
  "actives": [{"name": "saw palmetto plus vitamins and minerals (amounts not checked)"}],
  "form": "tablets, 180 per 3 months", "audience": "men", "legalStatus": "US dietary supplement",
  "price": "$56.70 first order on a 3-month subscription, list price $81",
  "priceDetail": "One-off purchase id 2875: $90 list ($63 with the first-order discount). Subscription id 2874.",
  "url": W + "/our-products/daily-hair-defense-supplement",
  "recommendedWhen": "Legacy mini quiz (code): the patient ticks 'Products with saw palmetto' or 'Vitamins and supplements'.",
  "evidence": "code"},
 {"id": "p18", "name": "Finasteride & Minoxidil plan", "category": "bundle",
  "actives": [{"name": "finasteride", "strength": "1 mg tablets"}, {"name": "minoxidil", "strength": "5% foam or solution"}],
  "form": "tablet plus topical", "audience": "men", "legalStatus": "US Rx (finasteride) + US OTC (minoxidil)",
  "price": "$79.10 for the first 3 months with solution (list $113); $91 with foam (list $130)",
  "priceDetail": "Sold as a plan on /plan-selection ('Best for Overall Thinning Hair', 'Most Popular'; 3 or 6 months) and /our-products ('Overall Thinning').",
  "url": W + "/plan-selection",
  "recommendedWhen": "Self-selected for 'Overall Thinning Hair'. The legacy mini quiz reaches the same pair for crown or 'a bit of both' with no pill preference (baseline: products 211 + 239).",
  "evidence": "observed"},
 {"id": "p19", "name": "Chew (older formula): Dutasteride 0.5 mg + Minoxidil 1.25 mg + Vitamin D3", "category": "rx-oral-compounded",
  "actives": [{"name": "dutasteride", "strength": "0.5 mg"}, {"name": "minoxidil (oral)", "strength": "1.25 mg"}, {"name": "vitamin D3", "strength": "2000 IU"}],
  "form": "chewable tablet, one a day", "audience": "men", "legalStatus": "US compounded prescription medicine",
  "price": "$160.99 for the first 3 months, list price $229.99 per 3 months",
  "priceDetail": "30 days: $62.99 first order, list $89.99. Ids 18156 / 18157. Present in the plan page's price data (raw/hair-treatment-plan.pageprops.json) but not shown on any screen walked; the 'Chew' card now shows the finasteride version (p1).",
  "url": W + "/hair-treatment-plan",
  "recommendedWhen": "unknown (in price data only; looks like a retired or back-up formula)",
  "evidence": "code"},
 {"id": "p20", "name": "Online clinician visit and messaging", "category": "service",
  "actives": [], "form": "asynchronous online review by a licensed provider (KMG Medical Group), photos and ID required",
  "audience": "men", "legalStatus": "US telehealth service",
  "price": "Free with a plan (checkout shows 'Online Clinician Visit $49.99 FREE')",
  "priceDetail": "An older FAQ says the annual consultation costs $5 with the first year included, and shipping is $5; the Keeps 2.0 checkout shows free expedited shipping.",
  "url": W + "/faq/how-much-is-a-visit-with-a-keeps-medical-provider",
  "recommendedWhen": "Every prescription order: the provider reviews after checkout, usually within 24-48 hours (FAQ).",
  "evidence": "docs"},
]

# ---------------------------------------------------------------- main flow (Keeps 2.0)
states = json.load(open(os.path.join(HERE, "raw", "states.json")))
EXCLUDED = ["AA", "AE", "AP", "DC", "DE", "ID", "KS", "MS", "NM", "PR", "RI", "WV"]
NOEFF = "Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it."

def main_questions(prefix, gel=False):
    P = prefix
    always_gel = "This funnel sends every patient to Gel+ whatever is chosen (code)."
    qs = []
    n = [0]
    def add(suffix, *a, **k):
        n[0] += 1
        qs.append(q(f"{P}-{suffix}", n[0], *a, **k))
    add("goal", "What's your hair goal?", "single", [
        opt("Regrow lost hair - Regrow", NOEFF), opt("Keep my hair - Preserve", NOEFF), opt("Both - Regrow & Preserve", NOEFF)],
        "Opens the quiz and sets the tone; subtitle says 'This helps determine your treatment match.'", "marketing")
    add("stage", "How would you describe your hair loss stage right now?", "single", [
        opt("Early signs of hair loss (Starting to notice thinning)", NOEFF),
        opt("Visible hair loss (Noticeable thinning or shedding)", NOEFF),
        opt("Receding hairline or crown thinning (Patterned hair loss)", NOEFF),
        opt("Advanced hair loss (Extensive thinning or balding)", NOEFF),
        opt("I'm not sure - help me choose", "Stored as 'Not Sure'; goes on to the picture question like every other answer.")],
        "Self-reported severity. Shown back as 'Hair Loss Stage' on the plan page.", "personalisation")
    add("picture", "Which best matches you?", "single", [
        opt("Just Starting", NOEFF + " Picks the before/after picture pair on the plan page."),
        opt("Mild", NOEFF + " Picks the before/after picture pair on the plan page."),
        opt("Moderate", NOEFF + " Picks the before/after picture pair on the plan page.", evidence="observed"),
        opt("Advanced", NOEFF + " Picks the before/after picture pair on the plan page."),
        opt("Not seeing a match? View more options", "Stored as 'Not Sure' and opens a second picture screen with four more patterns.", "extra-questions")],
        "Picture-based pattern check ('Choose the option that looks closest today.').", "diagnosis",
        branches=True, branchDetail="The 'view more options' link shows a second set of four pictures; any picture answer skips it.")
    add("picture2", "Which best matches you? (second set of pictures)", "single", [
        opt("Receding Hairline", NOEFF), opt("Diffuse Thinning", NOEFF),
        opt("Patchy Loss", NOEFF + " Note: patchy loss is not stopped here, although the older quiz sends it to a clinician request."),
        opt("Mostly Scalp", "Stops the quiz with the screen 'This treatment may not be a good fit right now.' The only button goes back to the home page.", "hard-stop", ["p1", "p2", "p3", "p4", "p5"]),
        opt("← Back to main options", "Goes back to the first picture screen.")],
        "Catches patterns the first four pictures miss, and screens out near-total baldness.", "eligibility-gate",
        branches=True, branchDetail="'Mostly Scalp' ends the quiz. This is the only clinical stop before payment.",
        shownWhen="Only when the first picture answer was 'Not seeing a match? View more options'", evidence="code")
    add("kickout", "This treatment may not be a good fit right now. Based on your answers, prescription hair loss treatments are unlikely to be effective at this stage. (Tip: Many people at this stage explore options like hair restoration or cosmetic solutions.) [Back to homepage]", "info", [],
        "Stop screen for very advanced loss.", "eligibility-gate", shownWhen="Only when the second picture answer was 'Mostly Scalp'", evidence="code")
    add("duration", "How long has this been happening?", "single", [
        opt("Less than 6 months", NOEFF + " Sudden or recent loss is not flagged."), opt("6-12 months", NOEFF),
        opt("1-3 years", NOEFF, evidence="observed"), opt("3+ years", NOEFF), opt("I'm not sure", NOEFF)],
        "History. Shown back as 'Duration' on the plan page.", "personalisation")
    add("comments", "Has anyone noticed or commented on your hair loss?", "single", [
        opt("Yes", NOEFF), opt("No", NOEFF, evidence="observed"), opt("I'm not sure", NOEFF)],
        "Emotional hook; subtitle says it 'helps us understand progression'. Not shown back anywhere.", "marketing")
    add("treated", "Have you treated hair loss before?", "single", [
        opt("Yes", "Adds the follow-up question 'How did it go?'.", "extra-questions"),
        opt("No", "Skips the follow-up question.", "skip-questions", evidence="observed")],
        "Treatment history; subtitle says 'This helps us avoid what didn't work.'", "data-capture",
        branches=True, branchDetail="Yes shows one extra question. Neither answer changes the product.")
    add("results", "How did it go?", "single", [
        opt("Saw some results", NOEFF), opt("Didn't see results", NOEFF), opt("Stopped too early", NOEFF),
        opt("Had side effects", NOEFF + " A history of side effects does not change or remove any product before payment.")],
        "Outcome of earlier treatment.", "data-capture", shownWhen="Only when 'Have you treated hair loss before?' = Yes", evidence="code")
    add("info-progress", "Our members see results in as little as 3 months. (carousel of before/after photos and customer quotes) [Continue]", "info", [],
        "Social proof half-way through.", "marketing")
    if not gel:
        add("form", "How would you like to treat your hair loss?", "single", [
            opt("Daily Chew (Oral Rx) - Easy, once-daily • Oral tablet", "Keeps the oral family: Chew+ or, with the 'simple & affordable' priority, Chew.", "product-switched", ["p1", "p2"]),
            opt("Topical Drop (Rx Serum) - Applied directly to the scalp", "Switches to the topical family: Drop+ or, with the 'simple & affordable' priority, Drop.", "product-switched", ["p3", "p4"]),
            opt("I'm not sure - help me choose", "Treated the same as the chew: the oral family is recommended.", "none", ["p1", "p2"], "observed")],
            "Chooses tablet or scalp treatment. One of only two answers the recommendation reads.", "product-selector",
            branches=True, branchDetail="Sets oral (Chew/Chew+) or topical (Drop/Drop+). The plan page still lets the patient switch family.",
            shownWhen="Main funnel only (hidden in the Gel funnel and for 'Valpak' coupon traffic)")
    add("priority", "What's your top priority?", "single", [
        opt("Seeing results as soon as possible - Stronger regrowth support", always_gel if gel else "Recommends the stronger dutasteride product: Chew+ (oral) or Drop+ (topical).", "none" if gel else "product-switched", ["p5"] if gel else ["p2", "p4"]),
        opt("Balanced results & long-term care - Effective everyday treatment", always_gel if gel else "Same as above: Chew+ or Drop+.", "none" if gel else "product-switched", ["p5"] if gel else ["p2", "p4"], "observed"),
        opt("Keeping treatment simple & affordable - Proven prevention-focused option", always_gel if gel else "Recommends the cheaper finasteride product: Chew (oral) or Drop (topical).", "none" if gel else "product-switched", ["p5"] if gel else ["p1", "p3"]),
        opt("I'm not sure - help me choose", always_gel if gel else "Treated like the first two: Chew+ or Drop+.", "none", ["p5"] if gel else ["p2", "p4"])],
        "Chooses between the 'plus' dutasteride formula and the cheaper finasteride formula." if not gel else "Asked, but not used: the Gel funnel has one product.",
        "marketing" if gel else "product-selector", branches=not gel,
        branchDetail="" if gel else "Only 'simple & affordable' gives the finasteride product; every other answer gives the dutasteride 'plus' product.")
    add("info-goodhands", "You're in good hands. Matched using clinician-guided treatment protocols & targeting combination meds. 98% experience hair stabilization within the first 3 months / 86% experience visible regrowth by month 3 / 94% overall member satisfaction [Continue]", "info", [],
        "Reassurance with headline statistics (two link to PubMed papers).", "expectation-setting")
    add("info-analysis", "Your analysis is complete. Your custom prescription treatment plan is being tailored to your profile now... Your Profile: Goal, Hair Loss Stage, Duration, Treatment Type, Expected Results 3 months. You're a strong candidate / 86% of similar profiles see results / Multi-pathway approach recommended [Continue]", "info", [],
        "Plays the answers back. The three ticked lines are fixed text: every patient is 'a strong candidate'.", "marketing")
    add("info-loader1", "Matching your prescription treatment. (progress bar: Analyzing hair loss pattern / Selecting prescription compounds / Adjusting strength for your stage / Finalizing clinician match)", "info", [],
        "A timed 5-second animation. No request is sent; nothing is analysed.", "marketing")
    add("phone", "How can we reach you if necessary? Our medical teams and pharmacy use text for patient communication. [phone number field, marketing-text tick box, Continue]", "contact", [],
        "Phone capture for text marketing and follow-up.", "data-capture",
        shownWhen="Only when the feature flag 'enable-quiz-phone-collection' has the value 'interstitial_enabled'. It was 'control' (off) in every run on 2026-11-23, so this screen was not seen.", evidence="code")
    st_opts = []
    for label, code in states:
        if code in EXCLUDED:
            st_opts.append(opt(label, "Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue.", "hard-stop", ["p1", "p2", "p3", "p4", "p5"]))
        else:
            st_opts.append(opt(label, "Accepted; goes on to the plan page." + (" Used in the baseline runs." if code == "TX" else ""), "next-question", [], "observed" if code == "TX" else "code"))
    add("state", "Last step to see if you qualify. We need your state and a few details to match you with an available provider. [Select state]", "single", st_opts,
        "Checks the service is licensed in the patient's state.", "eligibility-gate", branches=True,
        branchDetail="Twelve entries are refused in code: AA, AE, AP (military mail), DC, Delaware, Idaho, Kansas, Mississippi, New Mexico, Puerto Rico, Rhode Island, West Virginia.")
    add("confirm", "I confirm I am 18+ and assigned male at birth", "consent", [
        opt("Ticked", "Enables the 'Show my plan' button.", "next-question", [], "observed"),
        opt("Not ticked (the default)", "The 'Show my plan' button stays disabled.", "hard-stop", [], "observed")],
        "The only age and sex check before payment: one tick box, no date of birth.", "eligibility-gate", branches=True,
        branchDetail="Cannot continue without the tick. No age is asked until checkout (date of birth).")
    add("info-loader2", "Finalizing your approval. (progress bar: Confirming clinical eligibility / Locking in recommended plan / Preparing results summary / Completing approval)", "info", [],
        "A second timed animation, then the plan page opens.", "marketing")
    if gel:
        add("plan", "Good news - you're approved. ... Recommended for you: Gel+ (plan page)", "single", [
            opt("Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil", "The only card on the gel plan page.", "none", ["p5"], "observed"),
            opt("Want to switch to oral solutions?", "Shows the Chew and Chew+ cards instead (their prices are in the page data).", "product-switched", ["p1", "p2"], "code")],
            "Shows the 'approved' message and the product before any medical question.", "product-selector", branches=True,
            branchDetail="The patient can swap to the oral products on the same page.")
    else:
        add("plan", "Good news - you're approved. ... Recommended for you: Chew+ (plan page; the name changes with the recommendation)", "single", [
            opt("Chew: 3-In-1: Finasteride & Minoxidil (Most Affordable)", "Selects the finasteride chew for checkout.", "product-switched", ["p1"], "observed"),
            opt("Chew+: 5-In-1: Dutasteride & Minoxidil (Most Effective)", "Selects the dutasteride chew for checkout (pre-selected for the baseline man).", "none", ["p2"], "observed"),
            opt("Want to switch to topical solutions?", "Shows the Drop and Drop+ cards instead. On a desktop screen the first card (Drop) becomes the selected one.", "product-switched", ["p3", "p4"], "code")],
            "Shows the 'approved' message and lets the patient pick any of the four products, whatever the quiz said.", "product-selector", branches=True,
            branchDetail="The quiz only sets which card is pre-selected and named as 'clinically recommended'. Every product stays one click away.")
    add("cadence", "Choose your plan cadence", "single", [
        opt("3-month plan (Most Popular)", "Default. Bigger first-order discount; billed every 3 months.", "none", [], "observed"),
        opt("Monthly plan", "Billed monthly at a higher price per month.", "none", [], "observed")],
        "Plan length and price.", "product-selector")
    add("checkout", "1. Shipping Information (First Name, Last Name, Address line 1, Address line 2, City, State, ZIP code, Phone Number, Date of birth, Email, Confirm Email) 2. Payment Method [Complete Purchase]", "contact", [],
        "ACCOUNT WALL. Identity, address and card details are taken before any medical question. The small print says the order 'will be reviewed by a licensed healthcare provider, who may require additional personal or medical information, and is not prescribed until approved' and fees are refundable if not approved.",
        "identity", stage="checkout")
    add("register", "Finish setting up your account. Required before a provider can review your information and prescribe treatment. (Email, First name, Last name, Date of Birth, Phone number, State, Create Password, Confirm Password)", "contact", [],
        "Account creation, shown as step 2 of 'Checkout / Account / Medical Intake'. Seen by opening /register directly; not filled in.",
        "identity", stage="after-account")
    add("intake", "Medical Intake (the real medical questionnaire; wording not public)", "info", [],
        "The clinical screening happens here, after payment. The site loads it from a back-end quiz schema called 'keeps/intake-consultation' that an anonymous browser never requests, so the questions were not seen.",
        "safety-screen", stage="after-account", evidence="code")
    add("intake-bp", "Blood pressure: Top (systolic) / Bottom (diastolic), and heart rate", "text", [],
        "Hard-coded screens in the consultation code: 'We will need a recent blood pressure reading to prescribe you with an appropriate treatment...' and 'Are you sure? We won't be able to prescribe until we confirm your blood pressure / heart rate.'",
        "safety-screen", stage="after-account",
        shownWhen="Only when the server sets 'showBloodPressureAndPulse' for the order (probably plans with oral minoxidil: inferred, not confirmed)", evidence="code")
    add("intake-photos", "Photos. A picture is worth a thousand words. We're going to ask you to take 3 photos of your hair (we'll guide you through how to do it). Your provider needs these photos to make a diagnosis and recommend specific treatment. We also need a photo of your government-issued photo ID card to verify your identity.", "photo", [],
        "Scalp photos for diagnosis and an ID photo for identity. Read in the served consultation code; not done.",
        "identity", stage="after-account", evidence="code")
    return qs

# ---------------------------------------------------------------- legacy mini quiz
def legacy_questions():
    P = "leg"
    qs = []
    qs.append(q(f"{P}-where", 1, "Where on your head are you losing your hair or experiencing thinning?", "single", [
        opt("Hairline", "Finasteride is recommended. Topical minoxidil is not. Oral minoxidil is added if the patient prefers pills or has no preference.", "product-switched", ["p8", "p11"]),
        opt("Crown", "Finasteride plus topical minoxidil (foam) are recommended; with a pill preference, oral minoxidil replaces the foam.", "product-added", ["p8", "p9", "p11"]),
        opt("A bit of both", "Same as Crown. Baseline run ended on /quiz/lead?products=211,239 (finasteride + minoxidil foam).", "product-added", ["p8", "p9"], "observed"),
        opt("Patchy (coin-sized bald spots)", "No products are recommended. The browser is sent to the 'request a consultation' flow (/request/lead), where a provider decides.", "flag-for-clinician", ["p8", "p9"]),
        opt("Nowhere yet, but I'd like to prevent future hair loss", "Finasteride is left out. Minoxidil foam plus thickening shampoo and conditioner are recommended. The next question becomes family history, the pills/topical question is skipped and the finasteride ingredient option is hidden.", "product-removed", ["p8", "p9", "p14", "p15"])],
        "The main selector: loss location decides which medicines are in the plan.", "product-selector", branches=True,
        branchDetail="Changes the next question (family history vs expected results), hides the pills/topical question for 'Nowhere yet', and 'Patchy' leaves the quiz for the clinician-request flow."))
    qs.append(q(f"{P}-family", 2, "Has anyone in your family experienced hair loss? Select all that apply.", "multi", [
        opt(x, "No effect on the recommendation in the served code (the answer is not read by the rule set).") for x in
        ["Parent(s)", "Sibling(s)", "Father’s side of the family", "Mother’s side of the family", "No one in my family", "I’m not sure"]],
        "Family history for people with no loss yet.", "data-capture",
        shownWhen="Only when location = 'Nowhere yet, but I'd like to prevent future hair loss'", evidence="code"))
    qs.append(q(f"{P}-expect", 2, "What results are you expecting from your treatment?", "multi", [
        opt("I want to prevent hair loss", "No effect on the recommendation."),
        opt("I want to regrow my hair", "No effect on the recommendation.", evidence="observed"),
        opt("I want thicker hair", "Adds thickening shampoo and conditioner only in one advertising-campaign variant of the rules; no effect in the default variant.", "product-added", ["p14", "p15"])],
        "Goals ('Choose as many as you like.').", "personalisation",
        shownWhen="Only when location is not 'Nowhere yet'"))
    qs.append(q(f"{P}-form", 3, "Do you prefer taking pills or using topical treatments (foams/solutions/gels)?", "single", [
        opt("Topicals (applied directly to head)", "No oral minoxidil. Topical minoxidil stays in the plan for crown or both.", "product-removed", ["p11"]),
        opt("Pills (taken orally)", "Topical minoxidil (foam or spray) is left out; oral minoxidil is added for hairline, crown or both.", "product-switched", ["p9", "p11", "p12"]),
        opt("I'm not sure / I don't have a preference", "Topical minoxidil stays for crown or both; for hairline only, oral minoxidil is added.", "none", ["p11"], "observed")],
        "Tablet or topical preference. Tip text: 'we’ll always recommend the most effective treatment for you, regardless of format.'", "product-selector",
        branches=True, branchDetail="Switches minoxidil between topical and oral.", shownWhen="Only when location is not 'Nowhere yet'"))
    qs.append(q(f"{P}-ingredients", 4, "Are you interested in any specific active ingredients?", "multi", [
        opt("Products with finasteride (e.g., Propecia®)", "No effect on the recommendation (finasteride is included or not by location alone). Hidden when location = 'Nowhere yet'."),
        opt("Products with minoxidil (e.g., Rogaine®)", "No effect on the recommendation."),
        opt("Products with tretinoin", "Swaps minoxidil foam for the compounded Minoxidil+ Spray (when topical minoxidil is in the plan).", "product-switched", ["p9", "p12"]),
        opt("Products with saw palmetto", "Adds the Daily Hair Defense Supplement.", "product-added", ["p17"]),
        opt("Products with ketoconazole", "Adds ketoconazole 2% shampoo.", "product-added", ["p13"]),
        opt("I'm not sure / I'm interested in any effective ingredients!", "No effect on the recommendation.", evidence="observed")],
        "Lets the patient ask for ingredients by name; used to add or swap products.", "product-selector", branches=True,
        branchDetail="Three of the six options change the basket."))
    qs.append(q(f"{P}-otc", 5, "Are you interested in any specific types of over-the-counter products?", "multi", [
        opt("Vitamins and supplements", "Adds the Daily Hair Defense Supplement and also swaps minoxidil foam for Minoxidil+ Spray.", "product-added", ["p17", "p12", "p9"]),
        opt("Hair care products (shampoo and conditioner)", "Adds thickening shampoo and conditioner.", "product-added", ["p14", "p15"]),
        opt("Hair styling products (pomade)", "Adds the thickening pomade.", "product-added", ["p16"]),
        opt("I'm not interested in any specific over-the-counter products", "Nothing added.", evidence="observed")],
        "Cross-sell of non-prescription products.", "marketing", branches=True, branchDetail="Each ticked box adds products to the plan."))
    qs.append(q(f"{P}-dandruff", 6, "Do you experience dandruff symptoms on your scalp? Flaking, itching, redness, or burning.", "single", [
        opt("Yes", "Adds ketoconazole 2% shampoo. Redness or burning does not stop the quiz or flag anything.", "product-added", ["p13"]),
        opt("No", "Nothing added.", evidence="observed")],
        "The only scalp-symptom question; it is used to sell the shampoo, not to rule out scalp disease.", "product-selector", branches=True,
        branchDetail="Yes adds one product."))
    qs.append(q(f"{P}-lead", 7, "Better hair is one step away. Create your account to unlock your personalized plan (FIRST NAME*, LAST NAME*, EMAIL*, PHONE NUMBER, 'KEEP ME UPDATED' text-marketing tick box) [CONTINUE] [SIGN IN WITH GOOGLE]", "contact", [],
        "ACCOUNT WALL of the legacy quiz. The recommended product ids are already in the address (/quiz/lead?products=...), but the plan is not shown until an account exists. /quiz/results redirects back to /quiz without one.",
        "identity"))
    qs.append(q(f"{P}-results", 8, "Quiz results / plan page (/quiz/results), then account, checkout and the medical consultation", "info", [],
        "Not seen: needs an account. The medical questionnaire, photos and ID come after it.", "product-selector", stage="after-account", evidence="code"))
    return qs

flows = [
 {"id": "men", "name": "Keeps 2.0 hair assessment quiz (main funnel)", "audience": "men",
  "entryUrl": W + "/hair-assessment-quiz",
  "stagesSummary": "Landing page /hair-treatment (every button goes to the quiz) → about 10 anonymous questions and 6 info screens → state + '18+ and assigned male at birth' tick box → plan page that says 'you're approved' and names a product with prices → ACCOUNT WALL at /express/checkout (name, address, phone, date of birth, email and card on one page) → account set-up (/register) → medical intake, photos and ID (not seen) → provider review.",
  "questions": main_questions("men")},
 {"id": "men-gel", "name": "Gel+ funnel quiz", "audience": "men",
  "entryUrl": W + "/hair-assessment-quiz-gel",
  "stagesSummary": "Landing page /hair-treatment-gel → the same quiz without the chew-or-drop question → plan page /hair-treatment-plan-gel that always recommends Gel+ → the same express checkout wall.",
  "questions": main_questions("gel", gel=True)},
 {"id": "men-legacy", "name": "Legacy mini quiz (older finasteride / minoxidil range)", "audience": "men",
  "entryUrl": W + "/quiz",
  "stagesSummary": "Intro screen ('get started') → 6 anonymous questions → ACCOUNT WALL at /quiz/lead (first name, last name, email, phone) with the recommended product ids already in the address → results page, account, checkout and medical consultation (not seen). The same quiz is served at /find-my-plan.",
  "questions": legacy_questions()},
 {"id": "men-plan-selection", "name": "Choose your plan (no quiz)", "audience": "men",
  "entryUrl": W + "/plan-selection",
  "stagesSummary": "One screen of plan cards labelled by hair-loss pattern ('YOUR PLAN → ACCOUNT → CHECKOUT'). Picking a plan leads to account creation (wall, not entered) and checkout; the medical consultation follows. /our-products has the same picker ('Select the care you're looking for').",
  "questions": [
    q("plan-choose", 1, "Choose your plan", "single", [
        opt("Finasteride and Minoxidil - Best For Overall Thinning Hair (Most Popular)", "Puts finasteride 1 mg plus minoxidil 5% (solution or foam; 3 or 6 months) in the basket.", "product-added", ["p18", "p8", "p9", "p10"], "observed"),
        opt("Topical Finasteride and Minoxidil - Best For Overall Thinning Hair (New)", "Puts the compounded 0.25% / 5% gel in the basket (3 months).", "product-added", ["p6"], "observed"),
        opt("Finasteride - Best For Receding Hairline", "Puts finasteride 1 mg in the basket (3, 6 or 12 months).", "product-added", ["p8"], "observed"),
        opt("Minoxidil - Best For Thinning At The Crown", "Puts minoxidil 5% foam or solution in the basket.", "product-added", ["p9", "p10"], "observed"),
        opt("GET A RECOMMENDATION", "Button under the cards; where it leads was not followed (the code sends undecided patients to the quiz or to /request/lead).", "unknown", [], "unknown"),
        opt("BUY TREATMENT", "Button under the cards; not followed.", "unknown", [], "unknown")],
        "Self-selection by pattern: the patient diagnoses himself and picks the plan.", "product-selector", branches=True,
        branchDetail="Each card adds different products; the provider confirms or changes them after checkout.")]},
 {"id": "men-request", "name": "Request a consultation ('let the provider decide')", "audience": "men",
  "entryUrl": W + "/request/lead",
  "stagesSummary": "ACCOUNT WALL on the first screen ('Start your consultation': first name, last name, email) → account → consultation questionnaire (/request/consultation, not seen: it errors without an account) → submit → checkout. The legacy quiz sends 'Patchy' answers here.",
  "questions": [
    q("req-lead", 1, "Start your consultation. Enter your name and email to access personalized support and secure your treatment recommendation. (FIRST NAME*, LAST NAME*, EMAIL*; 'The name provided here must be the legal name of the person signing up for treatment.') [CONTINUE] [GOOGLE]", "contact", [],
      "Account wall before anything else. Steps shown: YOUR PLAN → ACCOUNT → CONSULTATION.", "identity"),
    q("req-consult", 2, "Consultation questionnaire (wording not public)", "info", [],
      "Medical questions answered before a product is chosen; the provider then recommends a plan. Loaded from a back-end quiz schema after sign-in.", "safety-screen", stage="after-account", evidence="code")]},
]

rules = [
 {"id": "R1", "flow": "men", "when": "men-form = 'Topical Drop (Rx Serum)'", "then": "The topical family is recommended (Drop+ by default, Drop with the affordable priority); any other answer, including 'not sure', gives the oral family.",
  "effectType": "product-switched", "affects": ["p1", "p2", "p3", "p4"], "evidence": "code", "proof": CH4186 + " (function after the question list: reads only 'treatmentType' and 'priority'); oral default seen in runs/baseline-men", "confidence": "high"},
 {"id": "R2", "flow": "men", "when": "men-priority = 'Keeping treatment simple & affordable'", "then": "The cheaper finasteride product is recommended (Chew or Drop); every other answer gives the dutasteride 'plus' product (Chew+ or Drop+).",
  "effectType": "product-switched", "affects": ["p1", "p2", "p3", "p4"], "evidence": "code", "proof": CH4186 + "; Chew+ for 'Balanced results' seen in runs/baseline-men (productId=19277)", "confidence": "high"},
 {"id": "R3", "flow": "men", "when": "second picture answer = 'Mostly Scalp'", "then": "The quiz stops with 'This treatment may not be a good fit right now.'",
  "effectType": "hard-stop", "affects": ["p1", "p2", "p3", "p4"], "evidence": "code", "proof": CH4186 + " (isKickout step with hideIf) and raw/chunks/6717-3380f3d5983e996c.js (screen text)", "confidence": "high"},
 {"id": "R4", "flow": "men", "when": "men-state is one of AA, AE, AP, DC, DE, ID, KS, MS, NM, PR, RI, WV", "then": "The page shows 'We currently don't serve in your state. Please check back soon.' and will not continue.",
  "effectType": "hard-stop", "affects": ["p1", "p2", "p3", "p4", "p5"], "evidence": "code", "proof": "raw/chunks/7039-8a2b3254b033213a.js module 60587 and raw/chunks/6717-3380f3d5983e996c.js module 53238", "confidence": "high"},
 {"id": "R5", "flow": "men", "when": "the '18+ and assigned male at birth' box is not ticked", "then": "The 'Show my plan' button stays disabled.",
  "effectType": "hard-stop", "affects": [], "evidence": "observed", "proof": "runs/baseline-men/14.txt (button disabled) vs runs/baseline-men/15.txt (enabled after the tick)", "confidence": "high"},
 {"id": "R6", "flow": "men", "when": "any other anonymous answer (goal, stage, picture, duration, comments, treated before, how it went)", "then": "No change to the recommended product or price; the answers are only stored in the browser and repeated on screen.",
  "effectType": "none", "affects": [], "evidence": "code", "proof": CH4186 + " (recommendation function) - stage 2 should confirm with replays", "confidence": "medium"},
 {"id": "R7", "flow": "men-gel", "when": "any answers", "then": "Gel+ (product id 19267) is always recommended.",
  "effectType": "none", "affects": ["p5"], "evidence": "observed", "proof": "runs/baseline-men-gel (ends on /hair-treatment-plan-gel?productId=19267); raw/chunks/pages__hair-assessment-quiz-gel-ba1be2bfffa241ea.js fixes the product id", "confidence": "high"},
 {"id": "R8", "flow": "men-legacy", "when": "leg-where = 'Patchy (coin-sized bald spots)'", "then": "No recommendation; the browser is sent to the clinician-request flow.",
  "effectType": "flag-for-clinician", "affects": [], "evidence": "code", "proof": "quiz-definition.legacy-mini-quiz.js part 2 (askDr; from raw/chunks/5819-36a4482c1f1a725d.js module 5737) - not yet replayed", "confidence": "medium"},
 {"id": "R9", "flow": "men-legacy", "when": "leg-where = 'Nowhere yet...'", "then": "Finasteride is left out; minoxidil foam plus thickening shampoo and conditioner are recommended.",
  "effectType": "product-removed", "affects": ["p8", "p9", "p14", "p15"], "evidence": "code", "proof": "quiz-definition.legacy-mini-quiz.js part 2 (from raw/chunks/5819-36a4482c1f1a725d.js module 5737) - not yet replayed", "confidence": "medium"},
 {"id": "R10", "flow": "men-legacy", "when": "leg-form = 'Pills (taken orally)' and location is hairline, crown or both; or location = hairline with no preference", "then": "Oral minoxidil 2.5 mg is added (and topical minoxidil is dropped when pills are preferred).",
  "effectType": "product-switched", "affects": ["p9", "p11", "p12"], "evidence": "code", "proof": "quiz-definition.legacy-mini-quiz.js part 2 (from raw/chunks/5819-36a4482c1f1a725d.js module 5737) - not yet replayed", "confidence": "medium"},
 {"id": "R11", "flow": "men-legacy", "when": "leg-dandruff = 'Yes' or 'Products with ketoconazole' ticked", "then": "Ketoconazole 2% shampoo is added.",
  "effectType": "product-added", "affects": ["p13"], "evidence": "code", "proof": "quiz-definition.legacy-mini-quiz.js part 2 (from raw/chunks/5819-36a4482c1f1a725d.js module 5737) - not yet replayed", "confidence": "medium"},
 {"id": "R12", "flow": "men-legacy", "when": "location = crown or 'a bit of both', no pill preference, no ingredient or OTC interest, no dandruff", "then": "Finasteride 1 mg (id 211) plus minoxidil 5% foam (id 239), both 3-month.",
  "effectType": "product-added", "affects": ["p8", "p9"], "evidence": "observed", "proof": "runs/baseline-men-legacy-quiz/10.txt (URL /quiz/lead?products=211%2C239)", "confidence": "high"},
]

recommendations = [
 {"profile": "Man, 32, receding hairline + crown ('Patterned', picture 'Moderate'), 1-3 years, never treated, wants regrowth, no preference on form, priority 'Balanced results', Texas (main funnel)",
  "offered": ["p2", "p1", "p3", "p4"], "default": "p2",
  "note": "Plan page says 'Good news - you're approved' and 'Chew+ is clinically recommended'. Chew is the second card; Drop and Drop+ are behind 'Want to switch to topical solutions?'. Proof: runs/baseline-men/17.txt.", "evidence": "observed"},
 {"profile": "Same man in the Gel funnel", "offered": ["p5", "p1", "p2"], "default": "p5",
  "note": "Only Gel+ is shown; 'Want to switch to oral solutions?' reveals Chew and Chew+. Proof: runs/baseline-men-gel/16.txt.", "evidence": "observed"},
 {"profile": "Same man in the legacy mini quiz ('A bit of both', regrow, no preference, no dandruff)", "offered": ["p8", "p9"], "default": "p8",
  "note": "Product ids 211 and 239 appear in the address of the account-wall page; the plan itself is not shown without an account. Proof: runs/baseline-men-legacy-quiz/10.txt.", "evidence": "observed"},
]

company = {
 "slug": "keeps", "company": "Keeps", "market": "US", "website": W + "/", "parent": "Thirty Madison (sister brands Cove, Facet, Nurx; care by KMG Medical Group)",
 "audiences": ["men"],
 "model": "US men's telehealth subscription for male pattern hair loss: a short marketing quiz names a compounded prescription product, the patient pays, and a licensed provider reviews a medical intake afterwards.",
 "checkedOn": "2026-11-23",
 "access": {
   "howTested": ["live-walk", "site-code", "public-docs"],
   "accountWall": "Main and Gel funnels: /express/checkout, reached from the plan page button 'Continue to checkout' (one page asking name, address, phone, date of birth, email and card). Legacy quiz: /quiz/lead (name, email, phone) straight after the last question. Request flow: /request/lead (name, email) on the first screen. The medical intake (/consultation/intake) redirects to sign-in.",
   "blockers": ["The medical questionnaire is behind payment and sign-in; its schema (keeps/intake-consultation) is only requested by signed-in pages, so it was not read. No bot protection was met."],
   "coverageNote": "Walked three flows with the baseline man to their account walls (main quiz to the plan page and checkout form, Gel quiz to its plan page, legacy quiz to its lead form). Read the full question sets, skip rules and recommendation rules for all three in the site's public JavaScript. Catalogue and prices came from the page data the site serves. Not tested: any one-change experiment, anything after an account wall, the clinician's real decision rules. Keeps does not treat women (it points them to Nurx), so there is no women's flow.",
 },
 "products": products,
 "flows": flows,
 "rules": rules,
 "experiments": [],
 "recommendations": recommendations,
 "engineSummary": "Before payment the 'engine' is a two-answer lookup. In the main quiz only 'How would you like to treat your hair loss?' (chew or drop) and 'What's your top priority?' (affordable or not) decide which of four compounded products is named; everything else is stored in the browser and played back. The Gel funnel always names Gel+. The only stops are a 'Mostly Scalp' picture, twelve refused states and an unticked '18+ and assigned male at birth' box. Every patient who gets through sees 'Good news - you're approved' before any medical question. The older quiz is a real rule table (location, pill preference, ingredient and OTC interests, dandruff) that builds a basket of finasteride, minoxidil, ketoconazole and add-ons. In every flow the medical screening (history, medicines, photos, ID, sometimes blood pressure and pulse) happens after the account wall, and a provider can still refuse or change the plan.",
 "strengths": [
   "Very short path: about ten taps and no typing to reach a named product and a price.",
   "Clear price ladder with a large first-order discount and a 180-day money-back guarantee on the new compounded range.",
   "Wide range: licensed generics (finasteride, minoxidil, ketoconazole), compounded combinations (oral and topical, finasteride or dutasteride) and cosmetic add-ons.",
   "Honest legal labelling on product pages: compounded products are marked 'not FDA-approved'.",
 ],
 "weaknesses": [
   "'You're approved' and 'clinically recommended' are shown before any medical question; the loaders ('Confirming clinical eligibility') are timed animations.",
   "Payment is taken before the medical intake; a product page says 'You won't be charged until your prescription is approved' while the checkout says the card is charged and refunded if not approved.",
   "Safety-relevant answers (sudden onset, patchy loss in the new quiz, earlier side effects, scalp redness or burning) do not change anything before payment.",
   "Age and sex are checked with one tick box; no women's service at all (referred to Nurx).",
   "Renewal price ($204.99 per 3 months for Chew+) is far above the first order ($100) and appears only in the checkout small print.",
 ],
 "opportunities": [
   "Ask the real safety questions before payment and show an honest 'likely suitable, a clinician will confirm' message instead of 'approved'.",
   "Let answers such as earlier side effects, heart history or fertility plans visibly steer the offer (for example topical instead of oral) before checkout.",
   "Serve women and people with patchy or sudden loss with a proper triage path instead of a referral or a silent pass.",
   "Show the renewal price next to the first-order price.",
 ],
 "sources": [
   {"title": "Keeps home page", "url": W + "/"},
   {"title": "Main quiz", "url": W + "/hair-assessment-quiz"},
   {"title": "Main landing page", "url": W + "/hair-treatment"},
   {"title": "Gel landing page and quiz", "url": W + "/hair-treatment-gel"},
   {"title": "Legacy quiz", "url": W + "/quiz"},
   {"title": "Choose your plan", "url": W + "/plan-selection"},
   {"title": "All products", "url": W + "/our-products"},
   {"title": "Quiz definition (served JavaScript)", "url": W + "/_next/static/chunks/4186-023f24e4c45a5ed8.js"},
   {"title": "Quiz screens and state gate (served JavaScript)", "url": W + "/_next/static/chunks/6717-3380f3d5983e996c.js"},
   {"title": "Legacy quiz rules (served JavaScript)", "url": W + "/_next/static/chunks/5819-36a4482c1f1a725d.js"},
   {"title": "FAQ: Am I eligible to use Keeps?", "url": W + "/faq/am-i-eligible-to-use-keeps"},
   {"title": "FAQ: Can women use Keeps?", "url": W + "/faq/can-women-use-keeps"},
   {"title": "FAQ: How old do I have to be to use Keeps?", "url": W + "/faq/how-old-do-i-have-to-be-to-use-keeps"},
   {"title": "FAQ: Is Keeps available in my state?", "url": W + "/faq/is-keeps-available-in-my-state"},
   {"title": "FAQ: What type of hair loss is Keeps for?", "url": W + "/faq/what-type-of-hair-loss-is-keeps-for"},
   {"title": "FAQ: Do Keeps hair loss treatments have side effects?", "url": W + "/faq/do-keeps-hair-loss-treatments-have-side-effects"},
   {"title": "FAQ: How long does provider review take?", "url": W + "/faq/how-long-does-it-take-for-my-medical-provider-to-review-my-hair-loss"},
   {"title": "FAQ: Why do I have to submit a photo of my government-issued ID?", "url": W + "/faq/why-do-i-have-to-submit-a-photo-of-my-government-issued-id"},
   {"title": "FAQ: Can I take the Keeps products with other prescriptions?", "url": W + "/faq/can-i-take-the-keeps-products-with-other-prescriptions"},
   {"title": "FAQ: Does finasteride affect fertility?", "url": W + "/faq/does-finasteride-affect-fertility"},
   {"title": "FAQ: Can women be exposed to finasteride?", "url": W + "/faq/can-women-be-exposed-to-finasteride"},
   {"title": "FAQ: Should I use Keeps for hair loss due to chemotherapy?", "url": W + "/faq/should-i-use-keeps-for-hair-loss-due-to-chemotherapy"},
   {"title": "FAQ: How much does Keeps cost?", "url": W + "/faq/how-much-does-keeps-cost"},
   {"title": "FAQ: How much is a visit with a Keeps medical provider?", "url": W + "/faq/how-much-is-a-visit-with-a-keeps-medical-provider"},
   {"title": "FAQ: Why is Keeps a subscription service?", "url": W + "/faq/why-is-keeps-a-subscription-service"},
   {"title": "FAQ: How do I cancel my Keeps subscription?", "url": W + "/faq/how-do-i-cancel-my-keeps-subscription"},
   {"title": "FAQ: Automatic refill policy", "url": W + "/faq/what-is-your-automatic-refill-policy"},
   {"title": "FAQ: Refund and return policy", "url": W + "/faq/what-is-the-keeps-refund-and-return-policy"},
   {"title": "FAQ: What does off-label mean?", "url": W + "/faq/what-does-off-label-mean"},
   {"title": "Gel+ medication overview (contraindications)", "url": W + "/product-info/gel-plus-10-in-1-dutasteride-and-minoxidil"},
   {"title": "Chew+ medication overview", "url": W + "/product-info/chew-plus-5-in-1-dutasteride-and-minoxidil"},
   {"title": "Drug facts: finasteride", "url": W + "/drug-facts/finasteride"},
   {"title": "Drug facts: oral minoxidil", "url": W + "/drug-facts/oral-minoxidil"},
   {"title": "Not eligible (sex): referral to Nurx", "url": W + "/not-eligible-user/sex"},
   {"title": "Not eligible (state)", "url": W + "/not-eligible-user/state"},
   {"title": "Terms and conditions (Thirty Madison)", "url": "https://patient.thirtymadison.com/dashboard/legals/terms-and-conditions"},
   {"title": "Informed consent for telehealth (Thirty Madison)", "url": "https://patient.thirtymadison.com/dashboard/legals/informed-consent"},
 ],
 "limitations": [
   "The medical questionnaire, photo step and provider decision sit behind payment and sign-in; none of it was seen. Its question wording is unknown.",
   "Most option effects are read from the site's code, not yet proved by replay: only the three baseline paths were walked. Stage 2 should replay the code-derived rules.",
   "Prices are first-order promotional prices seen on 2026-11-23 during a 'Black Friday / up to 50% off' offer (offer id 1040); they will change.",
   "Feature flags change what a visitor sees (for example the phone-number screen was off). Another visitor may get a different variant.",
   "The 'unit' of vitamin D3 in the topical formulas is not stated in the data; the figure is copied as shown.",
   "The /product-info and /drug-facts pages were linked from product pages but not read in full in this stage.",
 ],
}

with open(os.path.join(HERE, "company.json"), "w", encoding="utf8") as f:
    json.dump(company, f, indent=1, ensure_ascii=False)
print("written", sum(len(fl["questions"]) for fl in flows), "questions,", len(products), "products")
