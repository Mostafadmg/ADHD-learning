# Keeps: consultation and product report

**Market:** US · **Website:** https://www.keeps.com/ · **Checked:** 2026-11-23 · **Owner:** Thirty Madison (sister brands Cove, Facet, Nurx; care by KMG Medical Group)

> US men's telehealth subscription for male pattern hair loss: a short marketing quiz names a compounded prescription product, the patient pays, and a licensed provider reviews a medical intake afterwards.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** Main and Gel funnels: /express/checkout, reached from the plan page button 'Continue to checkout' (one page asking name, address, phone, date of birth, email and card). Legacy quiz: /quiz/lead (name, email, phone) straight after the last question. Request flow: /request/lead (name, email) on the first screen. The medical intake (/consultation/intake) redirects to sign-in.
- **Blocker:** The medical questionnaire is behind payment and sign-in; its schema (keeps/intake-consultation) is only requested by signed-in pages, so it was not read. No bot protection was met.

Walked three flows with the baseline man to their account walls (main quiz to the plan page and checkout form, Gel quiz to its plan page, legacy quiz to its lead form). Read the full question sets, skip rules and recommendation rules for all three in the site's public JavaScript. Catalogue and prices came from the page data the site serves. Not tested: any one-change experiment, anything after an account wall, the clinician's real decision rules. Keeps does not treat women (it points them to Nurx), so there is no women's flow.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

Before payment the 'engine' is a two-answer lookup. In the main quiz only 'How would you like to treat your hair loss?' (chew or drop) and 'What's your top priority?' (affordable or not) decide which of four compounded products is named; everything else is stored in the browser and played back. The Gel funnel always names Gel+. The only stops are a 'Mostly Scalp' picture, twelve refused states and an unticked '18+ and assigned male at birth' box. Every patient who gets through sees 'Good news - you're approved' before any medical question. The older quiz is a real rule table (location, pill preference, ingredient and OTC interests, dandruff) that builds a basket of finasteride, minoxidil, ketoconazole and add-ons. In every flow the medical screening (history, medicines, photos, ID, sometimes blood pressure and pulse) happens after the account wall, and a provider can still refuse or change the plan.

## 3. Engine rules (12)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men | men-form = 'Topical Drop (Rx Serum)' | The topical family is recommended (Drop+ by default, Drop with the affordable priority); any other answer, including 'not sure', gives the oral family. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil)_ | Switches product | code | high |
| R2 | men | men-priority = 'Keeping treatment simple & affordable' | The cheaper finasteride product is recommended (Chew or Drop); every other answer gives the dutasteride 'plus' product (Chew+ or Drop+). _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil)_ | Switches product | code | high |
| R3 | men | second picture answer = 'Mostly Scalp' | The quiz stops with 'This treatment may not be a good fit right now.' _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil)_ | Stops the patient | code | high |
| R4 | men | men-state is one of AA, AE, AP, DC, DE, ID, KS, MS, NM, PR, RI, WV | The page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ | Stops the patient | code | high |
| R5 | men | the '18+ and assigned male at birth' box is not ticked | The 'Show my plan' button stays disabled. | Stops the patient | observed | high |
| R6 | men | any other anonymous answer (goal, stage, picture, duration, comments, treated before, how it went) | No change to the recommended product or price; the answers are only stored in the browser and repeated on screen. | No effect | code | medium |
| R7 | men-gel | any answers | Gel+ (product id 19267) is always recommended. _(affects: Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ | No effect | observed | high |
| R8 | men-legacy | leg-where = 'Patchy (coin-sized bald spots)' | No recommendation; the browser is sent to the clinician-request flow. | Flags for the clinician | code | medium |
| R9 | men-legacy | leg-where = 'Nowhere yet...' | Finasteride is left out; minoxidil foam plus thickening shampoo and conditioner are recommended. _(affects: Finasteride 1 mg tablets, Minoxidil Foam, 5%, Keeps Thickening Shampoo, Keeps Thickening Conditioner)_ | Removes a product | code | medium |
| R10 | men-legacy | leg-form = 'Pills (taken orally)' and location is hairline, crown or both; or location = hairline with no preference | Oral minoxidil 2.5 mg is added (and topical minoxidil is dropped when pills are preferred). _(affects: Minoxidil Foam, 5%, Oral Minoxidil 2.5 mg tablets, Minoxidil+ Spray)_ | Switches product | code | medium |
| R11 | men-legacy | leg-dandruff = 'Yes' or 'Products with ketoconazole' ticked | Ketoconazole 2% shampoo is added. _(affects: Ketoconazole Shampoo, 2%)_ | Adds a product | code | medium |
| R12 | men-legacy | location = crown or 'a bit of both', no pill preference, no ingredient or OTC interest, no dandruff | Finasteride 1 mg (id 211) plus minoxidil 5% foam (id 239), both 3-month. _(affects: Finasteride 1 mg tablets, Minoxidil Foam, 5%)_ | Adds a product | observed | high |

## 4. Products (19)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Chew 3-In-1: Finasteride & Minoxidil](https://www.keeps.com/our-products/chew-3-in-1-finasteride-and-minoxidil) | rx-oral-compounded | finasteride 1 mg; minoxidil (oral) 2.5 mg; vitamin D3 2000 IU | citrus chewable tablet, one a day | men | US compounded prescription medicine (the site says: 'This compounded medication is not FDA-approved but may be prescribed by a licensed provider') | $94.96 for the first 3 months (shown as $31.65 a month), list price $154.99 per 3 months (Monthly plan: $50.00 first month, list $69.99. Product ids 18639 (30 days) and 18640 (90 days); 28/84-day variants 19095/19096 at the same prices. An older listing (ids 18349/18350) shows $48.99 / $108.49 first order.) | Main quiz: form answer is 'Daily Chew' or 'not sure', and top priority is 'Keeping treatment simple & affordable' (read in code). It is also always shown as the second card beside Chew+ on the oral plan page (seen in runs/baseline-men). | observed |
| [Chew+ 5-In-1: Dutasteride & Minoxidil](https://www.keeps.com/our-products/chew-plus-5-in-1-dutasteride-and-minoxidil) | rx-oral-compounded | dutasteride 0.5 mg ('Higher Dose'; a 0.2 mg version also exists in the price data); minoxidil (oral) 2.5 mg; biotin 10 mg; vitamin C 120 mg; zinc 10 mg | citrus chewable tablet, one a day | men | US compounded prescription medicine, not FDA-approved (site wording). Dutasteride is not FDA-approved for hair loss in any form. | $100.00 for the first 3 months (shown as $33.33 a month), list price $199.99 per 3 months (Monthly plan: $59.99 first month, list $84.99. The checkout page says renewals are $204.99 per 3 months, first refill billed 75 days after purchase. Ids 19276 (30 days) / 19277 (90 days) = 'Chew+ Higher Dose' (dutasteri…) | Main quiz default: form answer is 'Daily Chew' or 'not sure' and top priority is anything except 'simple & affordable' (code; seen for the baseline man in runs/baseline-men). | observed |
| [Drop 4-In-1: Finasteride & Minoxidil](https://www.keeps.com/our-products/drop-4-in-1-finasteride-and-minoxidil) | rx-topical-compounded | finasteride 0.3%; minoxidil 5%; tretinoin 0.01%; hydrocortisone 1% | scalp drops (solution), 1 mL once a day | men | US compounded prescription medicine, not FDA-approved (site wording) | $140.02 for the first 3 months, list price $189.99 per 3 months (Monthly plan: $79.96 first month, list $109.99. Ids 18150 (30 days) / 18635 (90 days); 30 mL / 90 mL bottles in the 28/84-day variants 19091/19092.) | Main quiz: form answer is 'Topical Drop (Rx Serum)' and top priority is 'Keeping treatment simple & affordable' (code, not yet replayed). Also reachable from any plan page through 'Want to switch to topical solutions?'. | code |
| [Drop+ 11-In-1: Dutasteride & Minoxidil](https://www.keeps.com/our-products/drop-plus-11-in-1-dutasteride-and-minoxidil) | rx-topical-compounded | dutasteride 0.25%; minoxidil 5%; latanoprost 0.005%; tretinoin 0.01%; cetirizine 1%; melatonin 0.1%; hydrocortisone 1%; caffeine 0.2%; biotin 0.2%; rosemary oil 0.1%; vitamin D3 1000 (unit not stated in the data) | scalp drops (solution), 1 mL once a day | men | US compounded prescription medicine, not FDA-approved (site wording) | $149.93 for the first 3 months, list price $209.99 per 3 months (Monthly plan: $84.95 first month, list $119.99. Ids 18153 (30 days) / 18636 (90 days); 28/84-day variants 19093/19094.) | Main quiz: form answer is 'Topical Drop (Rx Serum)' and top priority is anything except 'simple & affordable' (code, not yet replayed). | code |
| [Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil](https://www.keeps.com/our-products/gel-plus-10-in-1-dutasteride-finasteride-and-minoxidil) | rx-topical-compounded | minoxidil 8%; dutasteride 0.25%; finasteride 0.01%; latanoprost 0.005%; tretinoin 0.001%; cetirizine 1%; melatonin 0.1%; caffeine 0.2%; biotin 0.2%; vitamin D3 1000 (unit not stated in the data) | scalp gel, 5 pumps (1.1 g) once a day; 33 mL per month | men | US compounded prescription medicine. Product page: 'Gel+ is a compounded medication that is not FDA-approved.' | $139.99 for the first 3 months (shown as $46.66 a month), list price $239.99 per 3 months (Monthly plan: $74.99 first month, list $99.99. Ids 19266 (33 mL, 30 days) / 19267 (99 mL, 90 days).) | Always, in the Gel funnel: the gel quiz sends every patient to Gel+ whatever they answer (code; seen in runs/baseline-men-gel). | observed |
| [Topical Finasteride and Minoxidil Gel](https://www.keeps.com/our-products/topical-finasteride-and-minoxidil) | rx-topical-compounded | finasteride 0.25%; minoxidil 5% | scalp gel, once a day | men | US compounded prescription medicine (line item is named 'Compounded: Finasteride 0.25% / Minoxidil 5% Gel (FMG)') | $126 for the first 3 months (93 g), list price $180 per 3 months (1-month size (30 g): $56 first order, list $80. Ids 1154 (90 days) / 665 (30 days).) | Not picked by either quiz in the code read so far. Self-selected on /plan-selection ('Best for Overall Thinning Hair', 'New') and /our-products. | observed |
| [Topical Finasteride and Minoxidil Foam](https://www.keeps.com/our-products) | rx-topical-compounded | finasteride 0.25%; minoxidil 5% | scalp foam | men | US compounded prescription medicine | $105 for the first 3 months (117 g), list price $150 per 3 months (30-day size (39 g): $56 first order, list $80. Ids 1000 / 19063. Found only in the price data the products page loads (runs/catalogue/net); it has no product page or card of its own.) | unknown (not shown in any walked flow) | code |
| [Finasteride 1 mg tablets](https://www.keeps.com/our-products/finasteride) | rx-oral | finasteride 1 mg | tablet, one a day | men | US Rx, FDA-approved generic | $56 for the first 3 months (90 tablets), list price $80 per 3 months (6 months: $94.50 first order, list $135. 12 months: $168 first order, list $240. A 30-tablet pack (id 19064) is in the price data at $40 list / $28. Ids 211 / 406 / 405. The Keeps 2.0 code also carries 'KEEPS2_FINASTERI…) | Legacy mini quiz: any hair-loss location except 'Nowhere yet' (code; seen for the baseline man: /quiz/lead?products=211,239). /plan-selection labels it 'Best for Receding Hairline'. | observed |
| [Minoxidil Foam, 5%](https://www.keeps.com/our-products/minoxidil-foam) | otc-medicine | minoxidil 5% | scalp foam, half a capful twice a day | men | US OTC (FDA-approved, no prescription) | $35 for the first 3 months (180 g), list price $50 per 3 months (6 months: $58.80 first order, list $84. 12 months: $107.10 first order, list $153. Ids 239 / 604 / 605.) | Legacy mini quiz: location is crown, 'a bit of both' or 'nowhere yet', the patient did not choose pills, and showed no interest in tretinoin or vitamins (code; seen for the baseline man). /plan-selection labels minoxidil 'Best for Thinning At The Crown'. | observed |
| [Minoxidil Solution, 5%](https://www.keeps.com/our-products/minoxidil-solution) | otc-medicine | minoxidil 5% | scalp solution, 1 mL twice a day | men | US OTC (FDA-approved, no prescription) | $23.10 for the first 3 months (180 mL), list price $33 per 3 months (6 months: $39.20 first order, list $56. 12 months: $71.40 first order, list $102. Ids 188 / 602 / 603.) | Not picked by the quiz directly (the quiz picks foam). Offered as the other 'minoxidil type' on /plan-selection and /our-products; the legacy code swaps foam for solution only if solution is already in the cart. | observed |
| [Oral Minoxidil 2.5 mg tablets](https://buy.keeps.com/low-dose-oral-minoxidil) | rx-oral | minoxidil (oral) 2.5 mg tablets; packs of 45, 90, 135 or 180 tablets per 90 days (about 1.25 mg to 5 mg a day) | tablet | men | US Rx, prescribed off-label for hair loss (site wording: 'prescribed off-label') | $63 for the first 3 months, list price $90 per 3 months (same price for every pack size) (Ids 921 (45 tablets), 989 (90), 15162 (135), 15163 (180). The site's menu link goes to a separate landing page on buy.keeps.com.) | Legacy mini quiz (code, not yet replayed): the patient prefers pills and the loss is at the crown or both; or the loss is at the hairline and the patient prefers pills or has no preference. | code |
| [Minoxidil+ Spray](https://www.keeps.com/our-products/minoxidil-spray) | rx-topical-compounded | minoxidil 5%; caffeine 0.2%; melatonin 0.1%; tretinoin 0.01% | scalp spray, once a day (81 g per 3 months) | men | US compounded prescription medicine. Product page: 'Minoxidil+ Hair Regrowth Spray is not FDA approved'. | $94.50 for the first 3 months, list price $135 per 3 months (30-day size (27 g, id 19048): $45.50 first order, list $65. 3-month id 11840.) | Legacy mini quiz (code): replaces minoxidil foam when the patient ticks 'Products with tretinoin' or 'Vitamins and supplements'. | code |
| [Ketoconazole Shampoo, 2%](https://www.keeps.com/our-products/ketoconazole) | rx-topical-licensed | ketoconazole 2% | shampoo, 2-3 times a week (120 mL per 3 months) | men | US Rx (FDA-approved for dandruff; sold here as a hair-loss add-on) | $23.10 for the first 3 months, list price $33 per 3 months (12 months (480 mL, id 19082): $75.60 first order, list $108. 3-month id 240.) | Legacy mini quiz (code): dandruff answer is 'Yes', or the patient ticks 'Products with ketoconazole'. | code |
| [Keeps Thickening Shampoo](https://www.keeps.com/our-products/thickening-shampoo) | cosmetic | cosmetic thickening formula (ingredients not checked) | shampoo, 8 oz (236 mL) | men | cosmetic | $15.40 first order on a 3-month subscription, list price $22 (One-off purchase id 927: $24 list ($16.80 with the first-order discount). Subscription id 499.) | Legacy mini quiz (code): location is 'Nowhere yet', or the patient ticks 'Hair care products (shampoo and conditioner)'. | code |
| [Keeps Thickening Conditioner](https://www.keeps.com/our-products/thickening-conditioner) | cosmetic | cosmetic thickening formula (ingredients not checked) | conditioner, 8 oz (236 mL) | men | cosmetic | $15.40 first order on a 3-month subscription, list price $22 (One-off purchase id 928: $24 list. Subscription id 500.) | Same rule as the thickening shampoo (code). | code |
| [Thickening Pomade](https://www.keeps.com/our-products/thickening-pomade) | cosmetic | styling product (ingredients not checked) | pomade, 3 oz (85 g) | men | cosmetic | $17.50 first order on a 3-month subscription, list price $25 (One-off purchase id 926: $27 list. Subscription id 682.) | Legacy mini quiz (code): the patient ticks 'Hair styling products (pomade)'. | code |
| [Daily Hair Defense Supplement](https://www.keeps.com/our-products/daily-hair-defense-supplement) | supplement | saw palmetto plus vitamins and minerals (amounts not checked) | tablets, 180 per 3 months | men | US dietary supplement | $56.70 first order on a 3-month subscription, list price $81 (One-off purchase id 2875: $90 list ($63 with the first-order discount). Subscription id 2874.) | Legacy mini quiz (code): the patient ticks 'Products with saw palmetto' or 'Vitamins and supplements'. | code |
| [Finasteride & Minoxidil plan](https://www.keeps.com/plan-selection) | bundle | finasteride 1 mg tablets; minoxidil 5% foam or solution | tablet plus topical | men | US Rx (finasteride) + US OTC (minoxidil) | $79.10 for the first 3 months with solution (list $113); $91 with foam (list $130) (Sold as a plan on /plan-selection ('Best for Overall Thinning Hair', 'Most Popular'; 3 or 6 months) and /our-products ('Overall Thinning').) | Self-selected for 'Overall Thinning Hair'. The legacy mini quiz reaches the same pair for crown or 'a bit of both' with no pill preference (baseline: products 211 + 239). | observed |
| [Chew (older formula): Dutasteride 0.5 mg + Minoxidil 1.25 mg + Vitamin D3](https://www.keeps.com/hair-treatment-plan) | rx-oral-compounded | dutasteride 0.5 mg; minoxidil (oral) 1.25 mg; vitamin D3 2000 IU | chewable tablet, one a day | men | US compounded prescription medicine | $160.99 for the first 3 months, list price $229.99 per 3 months (30 days: $62.99 first order, list $89.99. Ids 18156 / 18157. Present in the plan page's price data (raw/hair-treatment-plan.pageprops.json) but not shown on any screen walked; the 'Chew' card now shows the finasteride v…) | unknown (in price data only; looks like a retired or back-up formula) | code |
| [Online clinician visit and messaging](https://www.keeps.com/faq/how-much-is-a-visit-with-a-keeps-medical-provider) | service | n/a | asynchronous online review by a licensed provider (KMG Medical Group), photos and ID required | men | US telehealth service | Free with a plan (checkout shows 'Online Clinician Visit $49.99 FREE') (An older FAQ says the annual consultation costs $5 with the first year included, and shipping is $5; the Keeps 2.0 checkout shows free expedited shipping.) | Every prescription order: the provider reviews after checkout, usually within 24-48 hours (FAQ). | docs |

## 5. Who gets what (3 patient profiles)

- **Man, 32, receding hairline + crown ('Patterned', picture 'Moderate'), 1-3 years, never treated, wants regrowth, no preference on form, priority 'Balanced results', Texas (main funnel)** → Chew+ 5-In-1: Dutasteride & Minoxidil, Chew 3-In-1: Finasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil (default: Chew+ 5-In-1: Dutasteride & Minoxidil). Plan page says 'Good news - you're approved' and 'Chew+ is clinically recommended'. Chew is the second card; Drop and Drop+ are behind 'Want to switch to topical solutions?'. Proof: runs/baseline-men/17.txt. _[observed]_
- **Same man in the Gel funnel** → Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil, Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil (default: Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil). Only Gel+ is shown; 'Want to switch to oral solutions?' reveals Chew and Chew+. Proof: runs/baseline-men-gel/16.txt. _[observed]_
- **Same man in the legacy mini quiz ('A bit of both', regrow, no preference, no dandruff)** → Finasteride 1 mg tablets, Minoxidil Foam, 5% (default: Finasteride 1 mg tablets). Product ids 211 and 239 appear in the address of the account-wall page; the plan itself is not shown without an account. Proof: runs/baseline-men-legacy-quiz/10.txt. _[observed]_

## 6. The consultation, question by question

### Keeps 2.0 hair assessment quiz (main funnel)

Entry: https://www.keeps.com/hair-assessment-quiz

Landing page /hair-treatment (every button goes to the quiz) → about 10 anonymous questions and 6 info screens → state + '18+ and assigned male at birth' tick box → plan page that says 'you're approved' and names a product with prices → ACCOUNT WALL at /express/checkout (name, address, phone, date of birth, email and card on one page) → account set-up (/register) → medical intake, photos and ID (not seen) → provider review.

**1. What's your hair goal?**  
_single · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Opens the quiz and sets the tone; subtitle says 'This helps determine your treatment match.'

- `Regrow lost hair - Regrow` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Keep my hair - Preserve` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Both - Regrow & Preserve` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_

**2. How would you describe your hair loss stage right now?**  
_single · anonymous · role: personalisation · shown: always · no branch · observed_  
Why they ask: Self-reported severity. Shown back as 'Hair Loss Stage' on the plan page.

- `Early signs of hair loss (Starting to notice thinning)` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Visible hair loss (Noticeable thinning or shedding)` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Receding hairline or crown thinning (Patterned hair loss)` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Advanced hair loss (Extensive thinning or balding)` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `I'm not sure - help me choose` → **No effect**: Stored as 'Not Sure'; goes on to the picture question like every other answer. _[code]_

**3. Which best matches you?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Picture-based pattern check ('Choose the option that looks closest today.').  
Downstream: The 'view more options' link shows a second set of four pictures; any picture answer skips it.

- `Just Starting` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Picks the before/after picture pair on the plan page. _[code]_
- `Mild` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Picks the before/after picture pair on the plan page. _[code]_
- `Moderate` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Picks the before/after picture pair on the plan page. _[observed]_
- `Advanced` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Picks the before/after picture pair on the plan page. _[code]_
- `Not seeing a match? View more options` → **Adds questions**: Stored as 'Not Sure' and opens a second picture screen with four more patterns. _[code]_

**4. Which best matches you? (second set of pictures)**  
_single · anonymous · role: eligibility-gate · shown: Only when the first picture answer was 'Not seeing a match? View more options' · BRANCHES · code_  
Why they ask: Catches patterns the first four pictures miss, and screens out near-total baldness.  
Downstream: 'Mostly Scalp' ends the quiz. This is the only clinical stop before payment.

- `Receding Hairline` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Diffuse Thinning` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Patchy Loss` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Note: patchy loss is not stopped here, although the older quiz sends it to a clinician request. _[code]_
- `Mostly Scalp` → **Stops the patient**: Stops the quiz with the screen 'This treatment may not be a good fit right now.' The only button goes back to the home page. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `← Back to main options` → **No effect**: Goes back to the first picture screen. _[code]_

**5. This treatment may not be a good fit right now. Based on your answers, prescription hair loss treatments are unlikely to be effective at this stage. (Tip: Many people at this stage explore options like hair restoration or cosmetic solutions.) [Back to homepage]**  
_info · anonymous · role: eligibility-gate · shown: Only when the second picture answer was 'Mostly Scalp' · no branch · code_  
Why they ask: Stop screen for very advanced loss.


**6. How long has this been happening?**  
_single · anonymous · role: personalisation · shown: always · no branch · observed_  
Why they ask: History. Shown back as 'Duration' on the plan page.

- `Less than 6 months` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Sudden or recent loss is not flagged. _[code]_
- `6-12 months` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `1-3 years` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[observed]_
- `3+ years` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `I'm not sure` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_

**7. Has anyone noticed or commented on your hair loss?**  
_single · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Emotional hook; subtitle says it 'helps us understand progression'. Not shown back anywhere.

- `Yes` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `No` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[observed]_
- `I'm not sure` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_

**8. Have you treated hair loss before?**  
_single · anonymous · role: data-capture · shown: always · BRANCHES · observed_  
Why they ask: Treatment history; subtitle says 'This helps us avoid what didn't work.'  
Downstream: Yes shows one extra question. Neither answer changes the product.

- `Yes` → **Adds questions**: Adds the follow-up question 'How did it go?'. _[code]_
- `No` → **Skips questions**: Skips the follow-up question. _[observed]_

**9. How did it go?**  
_single · anonymous · role: data-capture · shown: Only when 'Have you treated hair loss before?' = Yes · no branch · code_  
Why they ask: Outcome of earlier treatment.

- `Saw some results` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Didn't see results` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Stopped too early` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Had side effects` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. A history of side effects does not change or remove any product before payment. _[code]_

**10. Our members see results in as little as 3 months. (carousel of before/after photos and customer quotes) [Continue]**  
_info · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Social proof half-way through.


**11. How would you like to treat your hair loss?**  
_single · anonymous · role: product-selector · shown: Main funnel only (hidden in the Gel funnel and for 'Valpak' coupon traffic) · BRANCHES · observed_  
Why they ask: Chooses tablet or scalp treatment. One of only two answers the recommendation reads.  
Downstream: Sets oral (Chew/Chew+) or topical (Drop/Drop+). The plan page still lets the patient switch family.

- `Daily Chew (Oral Rx) - Easy, once-daily • Oral tablet` → **Switches product**: Keeps the oral family: Chew+ or, with the 'simple & affordable' priority, Chew. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil)_ _[code]_
- `Topical Drop (Rx Serum) - Applied directly to the scalp` → **Switches product**: Switches to the topical family: Drop+ or, with the 'simple & affordable' priority, Drop. _(affects: Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil)_ _[code]_
- `I'm not sure - help me choose` → **No effect**: Treated the same as the chew: the oral family is recommended. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil)_ _[observed]_

**12. What's your top priority?**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Chooses between the 'plus' dutasteride formula and the cheaper finasteride formula.  
Downstream: Only 'simple & affordable' gives the finasteride product; every other answer gives the dutasteride 'plus' product.

- `Seeing results as soon as possible - Stronger regrowth support` → **Switches product**: Recommends the stronger dutasteride product: Chew+ (oral) or Drop+ (topical). _(affects: Chew+ 5-In-1: Dutasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil)_ _[code]_
- `Balanced results & long-term care - Effective everyday treatment` → **Switches product**: Same as above: Chew+ or Drop+. _(affects: Chew+ 5-In-1: Dutasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil)_ _[observed]_
- `Keeping treatment simple & affordable - Proven prevention-focused option` → **Switches product**: Recommends the cheaper finasteride product: Chew (oral) or Drop (topical). _(affects: Chew 3-In-1: Finasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil)_ _[code]_
- `I'm not sure - help me choose` → **No effect**: Treated like the first two: Chew+ or Drop+. _(affects: Chew+ 5-In-1: Dutasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil)_ _[code]_

**13. You're in good hands. Matched using clinician-guided treatment protocols & targeting combination meds. 98% experience hair stabilization within the first 3 months / 86% experience visible regrowth by month 3 / 94% overall member satisfaction [Continue]**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Reassurance with headline statistics (two link to PubMed papers).


**14. Your analysis is complete. Your custom prescription treatment plan is being tailored to your profile now... Your Profile: Goal, Hair Loss Stage, Duration, Treatment Type, Expected Results 3 months. You're a strong candidate / 86% of similar profiles see results / Multi-pathway approach recommended [Continue]**  
_info · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Plays the answers back. The three ticked lines are fixed text: every patient is 'a strong candidate'.


**15. Matching your prescription treatment. (progress bar: Analyzing hair loss pattern / Selecting prescription compounds / Adjusting strength for your stage / Finalizing clinician match)**  
_info · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: A timed 5-second animation. No request is sent; nothing is analysed.


**16. How can we reach you if necessary? Our medical teams and pharmacy use text for patient communication. [phone number field, marketing-text tick box, Continue]**  
_contact · anonymous · role: data-capture · shown: Only when the feature flag 'enable-quiz-phone-collection' has the value 'interstitial_enabled'. It was 'control' (off) in every run on 2026-11-23, so this screen was not seen. · no branch · code_  
Why they ask: Phone capture for text marketing and follow-up.


**17. Last step to see if you qualify. We need your state and a few details to match you with an available provider. [Select state]**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Checks the service is licensed in the patient's state.  
Downstream: Twelve entries are refused in code: AA, AE, AP (military mail), DC, Delaware, Idaho, Kansas, Mississippi, New Mexico, Puerto Rico, Rhode Island, West Virginia.

- `Alabama` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Alaska` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Arizona` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Arkansas` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `California` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Colorado` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Connecticut` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Delaware` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `District of Columbia` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Florida` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Georgia` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Hawaii` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Idaho` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Illinois` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Indiana` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Iowa` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Kansas` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Kentucky` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Louisiana` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Maine` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Maryland` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Massachusetts` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Michigan` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Minnesota` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Mississippi` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Missouri` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Montana` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Nebraska` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Nevada` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `New Hampshire` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `New Jersey` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `New Mexico` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `New York` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `North Carolina` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `North Dakota` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Ohio` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Oklahoma` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Oregon` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Pennsylvania` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Puerto Rico` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Rhode Island` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `South Carolina` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `South Dakota` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Tennessee` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Texas` → **Next question**: Accepted; goes on to the plan page. Used in the baseline runs. _[observed]_
- `Utah` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Vermont` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Virginia` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Washington` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `West Virginia` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Wisconsin` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Wyoming` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `AA` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `AE` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `AP` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_

**18. I confirm I am 18+ and assigned male at birth**  
_consent · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: The only age and sex check before payment: one tick box, no date of birth.  
Downstream: Cannot continue without the tick. No age is asked until checkout (date of birth).

- `Ticked` → **Next question**: Enables the 'Show my plan' button. _[observed]_
- `Not ticked (the default)` → **Stops the patient**: The 'Show my plan' button stays disabled. _[observed]_

**19. Finalizing your approval. (progress bar: Confirming clinical eligibility / Locking in recommended plan / Preparing results summary / Completing approval)**  
_info · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: A second timed animation, then the plan page opens.


**20. Good news - you're approved. ... Recommended for you: Chew+ (plan page; the name changes with the recommendation)**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Shows the 'approved' message and lets the patient pick any of the four products, whatever the quiz said.  
Downstream: The quiz only sets which card is pre-selected and named as 'clinically recommended'. Every product stays one click away.

- `Chew: 3-In-1: Finasteride & Minoxidil (Most Affordable)` → **Switches product**: Selects the finasteride chew for checkout. _(affects: Chew 3-In-1: Finasteride & Minoxidil)_ _[observed]_
- `Chew+: 5-In-1: Dutasteride & Minoxidil (Most Effective)` → **No effect**: Selects the dutasteride chew for checkout (pre-selected for the baseline man). _(affects: Chew+ 5-In-1: Dutasteride & Minoxidil)_ _[observed]_
- `Want to switch to topical solutions?` → **Switches product**: Shows the Drop and Drop+ cards instead. On a desktop screen the first card (Drop) becomes the selected one. _(affects: Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil)_ _[code]_

**21. Choose your plan cadence**  
_single · anonymous · role: product-selector · shown: always · no branch · observed_  
Why they ask: Plan length and price.

- `3-month plan (Most Popular)` → **No effect**: Default. Bigger first-order discount; billed every 3 months. _[observed]_
- `Monthly plan` → **No effect**: Billed monthly at a higher price per month. _[observed]_

**22. 1. Shipping Information (First Name, Last Name, Address line 1, Address line 2, City, State, ZIP code, Phone Number, Date of birth, Email, Confirm Email) 2. Payment Method [Complete Purchase]**  
_contact · checkout · role: identity · shown: always · no branch · observed_  
Why they ask: ACCOUNT WALL. Identity, address and card details are taken before any medical question. The small print says the order 'will be reviewed by a licensed healthcare provider, who may require additional personal or medical information, and is not prescribed until approved' and fees are refundable if not approved.


**23. Finish setting up your account. Required before a provider can review your information and prescribe treatment. (Email, First name, Last name, Date of Birth, Phone number, State, Create Password, Confirm Password)**  
_contact · after-account · role: identity · shown: always · no branch · observed_  
Why they ask: Account creation, shown as step 2 of 'Checkout / Account / Medical Intake'. Seen by opening /register directly; not filled in.


**24. Medical Intake (the real medical questionnaire; wording not public)**  
_info · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: The clinical screening happens here, after payment. The site loads it from a back-end quiz schema called 'keeps/intake-consultation' that an anonymous browser never requests, so the questions were not seen.


**25. Blood pressure: Top (systolic) / Bottom (diastolic), and heart rate**  
_text · after-account · role: safety-screen · shown: Only when the server sets 'showBloodPressureAndPulse' for the order (probably plans with oral minoxidil: inferred, not confirmed) · no branch · code_  
Why they ask: Hard-coded screens in the consultation code: 'We will need a recent blood pressure reading to prescribe you with an appropriate treatment...' and 'Are you sure? We won't be able to prescribe until we confirm your blood pressure / heart rate.'


**26. Photos. A picture is worth a thousand words. We're going to ask you to take 3 photos of your hair (we'll guide you through how to do it). Your provider needs these photos to make a diagnosis and recommend specific treatment. We also need a photo of your government-issued photo ID card to verify your identity.**  
_photo · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Scalp photos for diagnosis and an ID photo for identity. Read in the served consultation code; not done.


### Gel+ funnel quiz

Entry: https://www.keeps.com/hair-assessment-quiz-gel

Landing page /hair-treatment-gel → the same quiz without the chew-or-drop question → plan page /hair-treatment-plan-gel that always recommends Gel+ → the same express checkout wall.

**1. What's your hair goal?**  
_single · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Opens the quiz and sets the tone; subtitle says 'This helps determine your treatment match.'

- `Regrow lost hair - Regrow` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Keep my hair - Preserve` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Both - Regrow & Preserve` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_

**2. How would you describe your hair loss stage right now?**  
_single · anonymous · role: personalisation · shown: always · no branch · observed_  
Why they ask: Self-reported severity. Shown back as 'Hair Loss Stage' on the plan page.

- `Early signs of hair loss (Starting to notice thinning)` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Visible hair loss (Noticeable thinning or shedding)` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Receding hairline or crown thinning (Patterned hair loss)` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Advanced hair loss (Extensive thinning or balding)` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `I'm not sure - help me choose` → **No effect**: Stored as 'Not Sure'; goes on to the picture question like every other answer. _[code]_

**3. Which best matches you?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Picture-based pattern check ('Choose the option that looks closest today.').  
Downstream: The 'view more options' link shows a second set of four pictures; any picture answer skips it.

- `Just Starting` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Picks the before/after picture pair on the plan page. _[code]_
- `Mild` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Picks the before/after picture pair on the plan page. _[code]_
- `Moderate` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Picks the before/after picture pair on the plan page. _[observed]_
- `Advanced` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Picks the before/after picture pair on the plan page. _[code]_
- `Not seeing a match? View more options` → **Adds questions**: Stored as 'Not Sure' and opens a second picture screen with four more patterns. _[code]_

**4. Which best matches you? (second set of pictures)**  
_single · anonymous · role: eligibility-gate · shown: Only when the first picture answer was 'Not seeing a match? View more options' · BRANCHES · code_  
Why they ask: Catches patterns the first four pictures miss, and screens out near-total baldness.  
Downstream: 'Mostly Scalp' ends the quiz. This is the only clinical stop before payment.

- `Receding Hairline` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Diffuse Thinning` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Patchy Loss` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Note: patchy loss is not stopped here, although the older quiz sends it to a clinician request. _[code]_
- `Mostly Scalp` → **Stops the patient**: Stops the quiz with the screen 'This treatment may not be a good fit right now.' The only button goes back to the home page. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `← Back to main options` → **No effect**: Goes back to the first picture screen. _[code]_

**5. This treatment may not be a good fit right now. Based on your answers, prescription hair loss treatments are unlikely to be effective at this stage. (Tip: Many people at this stage explore options like hair restoration or cosmetic solutions.) [Back to homepage]**  
_info · anonymous · role: eligibility-gate · shown: Only when the second picture answer was 'Mostly Scalp' · no branch · code_  
Why they ask: Stop screen for very advanced loss.


**6. How long has this been happening?**  
_single · anonymous · role: personalisation · shown: always · no branch · observed_  
Why they ask: History. Shown back as 'Duration' on the plan page.

- `Less than 6 months` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. Sudden or recent loss is not flagged. _[code]_
- `6-12 months` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `1-3 years` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[observed]_
- `3+ years` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `I'm not sure` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_

**7. Has anyone noticed or commented on your hair loss?**  
_single · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Emotional hook; subtitle says it 'helps us understand progression'. Not shown back anywhere.

- `Yes` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `No` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[observed]_
- `I'm not sure` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_

**8. Have you treated hair loss before?**  
_single · anonymous · role: data-capture · shown: always · BRANCHES · observed_  
Why they ask: Treatment history; subtitle says 'This helps us avoid what didn't work.'  
Downstream: Yes shows one extra question. Neither answer changes the product.

- `Yes` → **Adds questions**: Adds the follow-up question 'How did it go?'. _[code]_
- `No` → **Skips questions**: Skips the follow-up question. _[observed]_

**9. How did it go?**  
_single · anonymous · role: data-capture · shown: Only when 'Have you treated hair loss before?' = Yes · no branch · code_  
Why they ask: Outcome of earlier treatment.

- `Saw some results` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Didn't see results` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Stopped too early` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. _[code]_
- `Had side effects` → **No effect**: Saved in the browser and repeated back on the 'analysis' and plan screens. The recommendation function in the served code does not read it. A history of side effects does not change or remove any product before payment. _[code]_

**10. Our members see results in as little as 3 months. (carousel of before/after photos and customer quotes) [Continue]**  
_info · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Social proof half-way through.


**11. What's your top priority?**  
_single · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Asked, but not used: the Gel funnel has one product.

- `Seeing results as soon as possible - Stronger regrowth support` → **No effect**: This funnel sends every patient to Gel+ whatever is chosen (code). _(affects: Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Balanced results & long-term care - Effective everyday treatment` → **No effect**: This funnel sends every patient to Gel+ whatever is chosen (code). _(affects: Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[observed]_
- `Keeping treatment simple & affordable - Proven prevention-focused option` → **No effect**: This funnel sends every patient to Gel+ whatever is chosen (code). _(affects: Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `I'm not sure - help me choose` → **No effect**: This funnel sends every patient to Gel+ whatever is chosen (code). _(affects: Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_

**12. You're in good hands. Matched using clinician-guided treatment protocols & targeting combination meds. 98% experience hair stabilization within the first 3 months / 86% experience visible regrowth by month 3 / 94% overall member satisfaction [Continue]**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Reassurance with headline statistics (two link to PubMed papers).


**13. Your analysis is complete. Your custom prescription treatment plan is being tailored to your profile now... Your Profile: Goal, Hair Loss Stage, Duration, Treatment Type, Expected Results 3 months. You're a strong candidate / 86% of similar profiles see results / Multi-pathway approach recommended [Continue]**  
_info · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Plays the answers back. The three ticked lines are fixed text: every patient is 'a strong candidate'.


**14. Matching your prescription treatment. (progress bar: Analyzing hair loss pattern / Selecting prescription compounds / Adjusting strength for your stage / Finalizing clinician match)**  
_info · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: A timed 5-second animation. No request is sent; nothing is analysed.


**15. How can we reach you if necessary? Our medical teams and pharmacy use text for patient communication. [phone number field, marketing-text tick box, Continue]**  
_contact · anonymous · role: data-capture · shown: Only when the feature flag 'enable-quiz-phone-collection' has the value 'interstitial_enabled'. It was 'control' (off) in every run on 2026-11-23, so this screen was not seen. · no branch · code_  
Why they ask: Phone capture for text marketing and follow-up.


**16. Last step to see if you qualify. We need your state and a few details to match you with an available provider. [Select state]**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Checks the service is licensed in the patient's state.  
Downstream: Twelve entries are refused in code: AA, AE, AP (military mail), DC, Delaware, Idaho, Kansas, Mississippi, New Mexico, Puerto Rico, Rhode Island, West Virginia.

- `Alabama` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Alaska` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Arizona` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Arkansas` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `California` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Colorado` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Connecticut` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Delaware` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `District of Columbia` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Florida` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Georgia` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Hawaii` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Idaho` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Illinois` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Indiana` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Iowa` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Kansas` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Kentucky` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Louisiana` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Maine` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Maryland` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Massachusetts` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Michigan` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Minnesota` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Mississippi` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Missouri` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Montana` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Nebraska` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Nevada` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `New Hampshire` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `New Jersey` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `New Mexico` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `New York` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `North Carolina` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `North Dakota` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Ohio` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Oklahoma` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Oregon` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Pennsylvania` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Puerto Rico` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Rhode Island` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `South Carolina` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `South Dakota` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Tennessee` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Texas` → **Next question**: Accepted; goes on to the plan page. Used in the baseline runs. _[observed]_
- `Utah` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Vermont` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Virginia` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Washington` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `West Virginia` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `Wisconsin` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `Wyoming` → **Next question**: Accepted; goes on to the plan page. _[code]_
- `AA` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `AE` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_
- `AP` → **Stops the patient**: Refused: the page shows 'We currently don't serve in your state. Please check back soon.' and will not continue. _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil, Drop 4-In-1: Finasteride & Minoxidil, Drop+ 11-In-1: Dutasteride & Minoxidil, Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[code]_

**17. I confirm I am 18+ and assigned male at birth**  
_consent · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: The only age and sex check before payment: one tick box, no date of birth.  
Downstream: Cannot continue without the tick. No age is asked until checkout (date of birth).

- `Ticked` → **Next question**: Enables the 'Show my plan' button. _[observed]_
- `Not ticked (the default)` → **Stops the patient**: The 'Show my plan' button stays disabled. _[observed]_

**18. Finalizing your approval. (progress bar: Confirming clinical eligibility / Locking in recommended plan / Preparing results summary / Completing approval)**  
_info · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: A second timed animation, then the plan page opens.


**19. Good news - you're approved. ... Recommended for you: Gel+ (plan page)**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Shows the 'approved' message and the product before any medical question.  
Downstream: The patient can swap to the oral products on the same page.

- `Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil` → **No effect**: The only card on the gel plan page. _(affects: Gel+ 10-In-1: Dutasteride, Finasteride & Minoxidil)_ _[observed]_
- `Want to switch to oral solutions?` → **Switches product**: Shows the Chew and Chew+ cards instead (their prices are in the page data). _(affects: Chew 3-In-1: Finasteride & Minoxidil, Chew+ 5-In-1: Dutasteride & Minoxidil)_ _[code]_

**20. Choose your plan cadence**  
_single · anonymous · role: product-selector · shown: always · no branch · observed_  
Why they ask: Plan length and price.

- `3-month plan (Most Popular)` → **No effect**: Default. Bigger first-order discount; billed every 3 months. _[observed]_
- `Monthly plan` → **No effect**: Billed monthly at a higher price per month. _[observed]_

**21. 1. Shipping Information (First Name, Last Name, Address line 1, Address line 2, City, State, ZIP code, Phone Number, Date of birth, Email, Confirm Email) 2. Payment Method [Complete Purchase]**  
_contact · checkout · role: identity · shown: always · no branch · observed_  
Why they ask: ACCOUNT WALL. Identity, address and card details are taken before any medical question. The small print says the order 'will be reviewed by a licensed healthcare provider, who may require additional personal or medical information, and is not prescribed until approved' and fees are refundable if not approved.


**22. Finish setting up your account. Required before a provider can review your information and prescribe treatment. (Email, First name, Last name, Date of Birth, Phone number, State, Create Password, Confirm Password)**  
_contact · after-account · role: identity · shown: always · no branch · observed_  
Why they ask: Account creation, shown as step 2 of 'Checkout / Account / Medical Intake'. Seen by opening /register directly; not filled in.


**23. Medical Intake (the real medical questionnaire; wording not public)**  
_info · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: The clinical screening happens here, after payment. The site loads it from a back-end quiz schema called 'keeps/intake-consultation' that an anonymous browser never requests, so the questions were not seen.


**24. Blood pressure: Top (systolic) / Bottom (diastolic), and heart rate**  
_text · after-account · role: safety-screen · shown: Only when the server sets 'showBloodPressureAndPulse' for the order (probably plans with oral minoxidil: inferred, not confirmed) · no branch · code_  
Why they ask: Hard-coded screens in the consultation code: 'We will need a recent blood pressure reading to prescribe you with an appropriate treatment...' and 'Are you sure? We won't be able to prescribe until we confirm your blood pressure / heart rate.'


**25. Photos. A picture is worth a thousand words. We're going to ask you to take 3 photos of your hair (we'll guide you through how to do it). Your provider needs these photos to make a diagnosis and recommend specific treatment. We also need a photo of your government-issued photo ID card to verify your identity.**  
_photo · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Scalp photos for diagnosis and an ID photo for identity. Read in the served consultation code; not done.


### Legacy mini quiz (older finasteride / minoxidil range)

Entry: https://www.keeps.com/quiz

Intro screen ('get started') → 6 anonymous questions → ACCOUNT WALL at /quiz/lead (first name, last name, email, phone) with the recommended product ids already in the address → results page, account, checkout and medical consultation (not seen). The same quiz is served at /find-my-plan.

**1. Where on your head are you losing your hair or experiencing thinning?**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The main selector: loss location decides which medicines are in the plan.  
Downstream: Changes the next question (family history vs expected results), hides the pills/topical question for 'Nowhere yet', and 'Patchy' leaves the quiz for the clinician-request flow.

- `Hairline` → **Switches product**: Finasteride is recommended. Topical minoxidil is not. Oral minoxidil is added if the patient prefers pills or has no preference. _(affects: Finasteride 1 mg tablets, Oral Minoxidil 2.5 mg tablets)_ _[code]_
- `Crown` → **Adds a product**: Finasteride plus topical minoxidil (foam) are recommended; with a pill preference, oral minoxidil replaces the foam. _(affects: Finasteride 1 mg tablets, Minoxidil Foam, 5%, Oral Minoxidil 2.5 mg tablets)_ _[code]_
- `A bit of both` → **Adds a product**: Same as Crown. Baseline run ended on /quiz/lead?products=211,239 (finasteride + minoxidil foam). _(affects: Finasteride 1 mg tablets, Minoxidil Foam, 5%)_ _[observed]_
- `Patchy (coin-sized bald spots)` → **Flags for the clinician**: No products are recommended. The browser is sent to the 'request a consultation' flow (/request/lead), where a provider decides. _(affects: Finasteride 1 mg tablets, Minoxidil Foam, 5%)_ _[code]_
- `Nowhere yet, but I'd like to prevent future hair loss` → **Removes a product**: Finasteride is left out. Minoxidil foam plus thickening shampoo and conditioner are recommended. The next question becomes family history, the pills/topical question is skipped and the finasteride ingredient option is hidden. _(affects: Finasteride 1 mg tablets, Minoxidil Foam, 5%, Keeps Thickening Shampoo, Keeps Thickening Conditioner)_ _[code]_

**2. Has anyone in your family experienced hair loss? Select all that apply.**  
_multi · anonymous · role: data-capture · shown: Only when location = 'Nowhere yet, but I'd like to prevent future hair loss' · no branch · code_  
Why they ask: Family history for people with no loss yet.

- `Parent(s)` → **No effect**: No effect on the recommendation in the served code (the answer is not read by the rule set). _[code]_
- `Sibling(s)` → **No effect**: No effect on the recommendation in the served code (the answer is not read by the rule set). _[code]_
- `Father’s side of the family` → **No effect**: No effect on the recommendation in the served code (the answer is not read by the rule set). _[code]_
- `Mother’s side of the family` → **No effect**: No effect on the recommendation in the served code (the answer is not read by the rule set). _[code]_
- `No one in my family` → **No effect**: No effect on the recommendation in the served code (the answer is not read by the rule set). _[code]_
- `I’m not sure` → **No effect**: No effect on the recommendation in the served code (the answer is not read by the rule set). _[code]_

**2. What results are you expecting from your treatment?**  
_multi · anonymous · role: personalisation · shown: Only when location is not 'Nowhere yet' · no branch · observed_  
Why they ask: Goals ('Choose as many as you like.').

- `I want to prevent hair loss` → **No effect**: No effect on the recommendation. _[code]_
- `I want to regrow my hair` → **No effect**: No effect on the recommendation. _[observed]_
- `I want thicker hair` → **Adds a product**: Adds thickening shampoo and conditioner only in one advertising-campaign variant of the rules; no effect in the default variant. _(affects: Keeps Thickening Shampoo, Keeps Thickening Conditioner)_ _[code]_

**3. Do you prefer taking pills or using topical treatments (foams/solutions/gels)?**  
_single · anonymous · role: product-selector · shown: Only when location is not 'Nowhere yet' · BRANCHES · observed_  
Why they ask: Tablet or topical preference. Tip text: 'we’ll always recommend the most effective treatment for you, regardless of format.'  
Downstream: Switches minoxidil between topical and oral.

- `Topicals (applied directly to head)` → **Removes a product**: No oral minoxidil. Topical minoxidil stays in the plan for crown or both. _(affects: Oral Minoxidil 2.5 mg tablets)_ _[code]_
- `Pills (taken orally)` → **Switches product**: Topical minoxidil (foam or spray) is left out; oral minoxidil is added for hairline, crown or both. _(affects: Minoxidil Foam, 5%, Oral Minoxidil 2.5 mg tablets, Minoxidil+ Spray)_ _[code]_
- `I'm not sure / I don't have a preference` → **No effect**: Topical minoxidil stays for crown or both; for hairline only, oral minoxidil is added. _(affects: Oral Minoxidil 2.5 mg tablets)_ _[observed]_

**4. Are you interested in any specific active ingredients?**  
_multi · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Lets the patient ask for ingredients by name; used to add or swap products.  
Downstream: Three of the six options change the basket.

- `Products with finasteride (e.g., Propecia®)` → **No effect**: No effect on the recommendation (finasteride is included or not by location alone). Hidden when location = 'Nowhere yet'. _[code]_
- `Products with minoxidil (e.g., Rogaine®)` → **No effect**: No effect on the recommendation. _[code]_
- `Products with tretinoin` → **Switches product**: Swaps minoxidil foam for the compounded Minoxidil+ Spray (when topical minoxidil is in the plan). _(affects: Minoxidil Foam, 5%, Minoxidil+ Spray)_ _[code]_
- `Products with saw palmetto` → **Adds a product**: Adds the Daily Hair Defense Supplement. _(affects: Daily Hair Defense Supplement)_ _[code]_
- `Products with ketoconazole` → **Adds a product**: Adds ketoconazole 2% shampoo. _(affects: Ketoconazole Shampoo, 2%)_ _[code]_
- `I'm not sure / I'm interested in any effective ingredients!` → **No effect**: No effect on the recommendation. _[observed]_

**5. Are you interested in any specific types of over-the-counter products?**  
_multi · anonymous · role: marketing · shown: always · BRANCHES · observed_  
Why they ask: Cross-sell of non-prescription products.  
Downstream: Each ticked box adds products to the plan.

- `Vitamins and supplements` → **Adds a product**: Adds the Daily Hair Defense Supplement and also swaps minoxidil foam for Minoxidil+ Spray. _(affects: Daily Hair Defense Supplement, Minoxidil+ Spray, Minoxidil Foam, 5%)_ _[code]_
- `Hair care products (shampoo and conditioner)` → **Adds a product**: Adds thickening shampoo and conditioner. _(affects: Keeps Thickening Shampoo, Keeps Thickening Conditioner)_ _[code]_
- `Hair styling products (pomade)` → **Adds a product**: Adds the thickening pomade. _(affects: Thickening Pomade)_ _[code]_
- `I'm not interested in any specific over-the-counter products` → **No effect**: Nothing added. _[observed]_

**6. Do you experience dandruff symptoms on your scalp? Flaking, itching, redness, or burning.**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The only scalp-symptom question; it is used to sell the shampoo, not to rule out scalp disease.  
Downstream: Yes adds one product.

- `Yes` → **Adds a product**: Adds ketoconazole 2% shampoo. Redness or burning does not stop the quiz or flag anything. _(affects: Ketoconazole Shampoo, 2%)_ _[code]_
- `No` → **No effect**: Nothing added. _[observed]_

**7. Better hair is one step away. Create your account to unlock your personalized plan (FIRST NAME*, LAST NAME*, EMAIL*, PHONE NUMBER, 'KEEP ME UPDATED' text-marketing tick box) [CONTINUE] [SIGN IN WITH GOOGLE]**  
_contact · anonymous · role: identity · shown: always · no branch · observed_  
Why they ask: ACCOUNT WALL of the legacy quiz. The recommended product ids are already in the address (/quiz/lead?products=...), but the plan is not shown until an account exists. /quiz/results redirects back to /quiz without one.


**8. Quiz results / plan page (/quiz/results), then account, checkout and the medical consultation**  
_info · after-account · role: product-selector · shown: always · no branch · code_  
Why they ask: Not seen: needs an account. The medical questionnaire, photos and ID come after it.


### Choose your plan (no quiz)

Entry: https://www.keeps.com/plan-selection

One screen of plan cards labelled by hair-loss pattern ('YOUR PLAN → ACCOUNT → CHECKOUT'). Picking a plan leads to account creation (wall, not entered) and checkout; the medical consultation follows. /our-products has the same picker ('Select the care you're looking for').

**1. Choose your plan**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Self-selection by pattern: the patient diagnoses himself and picks the plan.  
Downstream: Each card adds different products; the provider confirms or changes them after checkout.

- `Finasteride and Minoxidil - Best For Overall Thinning Hair (Most Popular)` → **Adds a product**: Puts finasteride 1 mg plus minoxidil 5% (solution or foam; 3 or 6 months) in the basket. _(affects: Finasteride & Minoxidil plan, Finasteride 1 mg tablets, Minoxidil Foam, 5%, Minoxidil Solution, 5%)_ _[observed]_
- `Topical Finasteride and Minoxidil - Best For Overall Thinning Hair (New)` → **Adds a product**: Puts the compounded 0.25% / 5% gel in the basket (3 months). _(affects: Topical Finasteride and Minoxidil Gel)_ _[observed]_
- `Finasteride - Best For Receding Hairline` → **Adds a product**: Puts finasteride 1 mg in the basket (3, 6 or 12 months). _(affects: Finasteride 1 mg tablets)_ _[observed]_
- `Minoxidil - Best For Thinning At The Crown` → **Adds a product**: Puts minoxidil 5% foam or solution in the basket. _(affects: Minoxidil Foam, 5%, Minoxidil Solution, 5%)_ _[observed]_
- `GET A RECOMMENDATION` → **Unknown**: Button under the cards; where it leads was not followed (the code sends undecided patients to the quiz or to /request/lead). _[unknown]_
- `BUY TREATMENT` → **Unknown**: Button under the cards; not followed. _[unknown]_

### Request a consultation ('let the provider decide')

Entry: https://www.keeps.com/request/lead

ACCOUNT WALL on the first screen ('Start your consultation': first name, last name, email) → account → consultation questionnaire (/request/consultation, not seen: it errors without an account) → submit → checkout. The legacy quiz sends 'Patchy' answers here.

**1. Start your consultation. Enter your name and email to access personalized support and secure your treatment recommendation. (FIRST NAME*, LAST NAME*, EMAIL*; 'The name provided here must be the legal name of the person signing up for treatment.') [CONTINUE] [GOOGLE]**  
_contact · anonymous · role: identity · shown: always · no branch · observed_  
Why they ask: Account wall before anything else. Steps shown: YOUR PLAN → ACCOUNT → CONSULTATION.


**2. Consultation questionnaire (wording not public)**  
_info · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Medical questions answered before a product is chosen; the provider then recommends a plan. Loaded from a back-end quiz schema after sign-in.


## 7. Competitive read

**Strengths**

- Very short path: about ten taps and no typing to reach a named product and a price.
- Clear price ladder with a large first-order discount and a 180-day money-back guarantee on the new compounded range.
- Wide range: licensed generics (finasteride, minoxidil, ketoconazole), compounded combinations (oral and topical, finasteride or dutasteride) and cosmetic add-ons.
- Honest legal labelling on product pages: compounded products are marked 'not FDA-approved'.

**Weaknesses**

- 'You're approved' and 'clinically recommended' are shown before any medical question; the loaders ('Confirming clinical eligibility') are timed animations.
- Payment is taken before the medical intake; a product page says 'You won't be charged until your prescription is approved' while the checkout says the card is charged and refunded if not approved.
- Safety-relevant answers (sudden onset, patchy loss in the new quiz, earlier side effects, scalp redness or burning) do not change anything before payment.
- Age and sex are checked with one tick box; no women's service at all (referred to Nurx).
- Renewal price ($204.99 per 3 months for Chew+) is far above the first order ($100) and appears only in the checkout small print.

**Gaps a new competitor could use**

- Ask the real safety questions before payment and show an honest 'likely suitable, a clinician will confirm' message instead of 'approved'.
- Let answers such as earlier side effects, heart history or fertility plans visibly steer the offer (for example topical instead of oral) before checkout.
- Serve women and people with patchy or sudden loss with a proper triage path instead of a referral or a silent pass.
- Show the renewal price next to the first-order price.

## 10. Limits of this report

- The medical questionnaire, photo step and provider decision sit behind payment and sign-in; none of it was seen. Its question wording is unknown.
- Most option effects are read from the site's code, not yet proved by replay: only the three baseline paths were walked. Stage 2 should replay the code-derived rules.
- Prices are first-order promotional prices seen on 2026-11-23 during a 'Black Friday / up to 50% off' offer (offer id 1040); they will change.
- Feature flags change what a visitor sees (for example the phone-number screen was off). Another visitor may get a different variant.
- The 'unit' of vitamin D3 in the topical formulas is not stated in the data; the figure is copied as shown.
- The /product-info and /drug-facts pages were linked from product pages but not read in full in this stage.

## 11. Sources

- [Keeps home page](https://www.keeps.com/)
- [Main quiz](https://www.keeps.com/hair-assessment-quiz)
- [Main landing page](https://www.keeps.com/hair-treatment)
- [Gel landing page and quiz](https://www.keeps.com/hair-treatment-gel)
- [Legacy quiz](https://www.keeps.com/quiz)
- [Choose your plan](https://www.keeps.com/plan-selection)
- [All products](https://www.keeps.com/our-products)
- [Quiz definition (served JavaScript)](https://www.keeps.com/_next/static/chunks/4186-023f24e4c45a5ed8.js)
- [Quiz screens and state gate (served JavaScript)](https://www.keeps.com/_next/static/chunks/6717-3380f3d5983e996c.js)
- [Legacy quiz rules (served JavaScript)](https://www.keeps.com/_next/static/chunks/5819-36a4482c1f1a725d.js)
- [FAQ: Am I eligible to use Keeps?](https://www.keeps.com/faq/am-i-eligible-to-use-keeps)
- [FAQ: Can women use Keeps?](https://www.keeps.com/faq/can-women-use-keeps)
- [FAQ: How old do I have to be to use Keeps?](https://www.keeps.com/faq/how-old-do-i-have-to-be-to-use-keeps)
- [FAQ: Is Keeps available in my state?](https://www.keeps.com/faq/is-keeps-available-in-my-state)
- [FAQ: What type of hair loss is Keeps for?](https://www.keeps.com/faq/what-type-of-hair-loss-is-keeps-for)
- [FAQ: Do Keeps hair loss treatments have side effects?](https://www.keeps.com/faq/do-keeps-hair-loss-treatments-have-side-effects)
- [FAQ: How long does provider review take?](https://www.keeps.com/faq/how-long-does-it-take-for-my-medical-provider-to-review-my-hair-loss)
- [FAQ: Why do I have to submit a photo of my government-issued ID?](https://www.keeps.com/faq/why-do-i-have-to-submit-a-photo-of-my-government-issued-id)
- [FAQ: Can I take the Keeps products with other prescriptions?](https://www.keeps.com/faq/can-i-take-the-keeps-products-with-other-prescriptions)
- [FAQ: Does finasteride affect fertility?](https://www.keeps.com/faq/does-finasteride-affect-fertility)
- [FAQ: Can women be exposed to finasteride?](https://www.keeps.com/faq/can-women-be-exposed-to-finasteride)
- [FAQ: Should I use Keeps for hair loss due to chemotherapy?](https://www.keeps.com/faq/should-i-use-keeps-for-hair-loss-due-to-chemotherapy)
- [FAQ: How much does Keeps cost?](https://www.keeps.com/faq/how-much-does-keeps-cost)
- [FAQ: How much is a visit with a Keeps medical provider?](https://www.keeps.com/faq/how-much-is-a-visit-with-a-keeps-medical-provider)
- [FAQ: Why is Keeps a subscription service?](https://www.keeps.com/faq/why-is-keeps-a-subscription-service)
- [FAQ: How do I cancel my Keeps subscription?](https://www.keeps.com/faq/how-do-i-cancel-my-keeps-subscription)
- [FAQ: Automatic refill policy](https://www.keeps.com/faq/what-is-your-automatic-refill-policy)
- [FAQ: Refund and return policy](https://www.keeps.com/faq/what-is-the-keeps-refund-and-return-policy)
- [FAQ: What does off-label mean?](https://www.keeps.com/faq/what-does-off-label-mean)
- [Gel+ medication overview (contraindications)](https://www.keeps.com/product-info/gel-plus-10-in-1-dutasteride-and-minoxidil)
- [Chew+ medication overview](https://www.keeps.com/product-info/chew-plus-5-in-1-dutasteride-and-minoxidil)
- [Drug facts: finasteride](https://www.keeps.com/drug-facts/finasteride)
- [Drug facts: oral minoxidil](https://www.keeps.com/drug-facts/oral-minoxidil)
- [Not eligible (sex): referral to Nurx](https://www.keeps.com/not-eligible-user/sex)
- [Not eligible (state)](https://www.keeps.com/not-eligible-user/state)
- [Terms and conditions (Thirty Madison)](https://patient.thirtymadison.com/dashboard/legals/terms-and-conditions)
- [Informed consent for telehealth (Thirty Madison)](https://patient.thirtymadison.com/dashboard/legals/informed-consent)
