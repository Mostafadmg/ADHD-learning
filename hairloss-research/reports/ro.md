# Ro (Roman): consultation and product report

**Market:** US · **Website:** https://ro.co/hair-loss/ · **Checked:** 2026-11-23 · **Owner:** Roman Health Ventures Inc. (trading as Ro): company name from general knowledge, not checked on the site in this stage

> US direct-to-patient telehealth company: an online questionnaire ('online visit') reviewed by a US-licensed clinician, with its own pharmacy shipping generic, off-label and compounded hair-loss medicines on quarterly or longer subscriptions.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** Men (start.ro.co/fxdxbh): after 3 marketing questions, on screen qid 55, an email pop-up ('See how much fuller your hair could be in just 3 months', email + two consent boxes, or Continue with Google) that cannot be dismissed. Women (start.ro.co/tefcyb): after 3 or 4 hair questions, on screen qid 16 'Thanks for sharing. Ready to go deeper?' (Sign up with Email / Continue with Google). Topical minoxidil, shampoo and conditioner: sign-up is the first or second screen. In every flow the wall comes before any medical question and before any recommendation.
- **Blocker:** Account wall before every medical question, so no branch after the wall could be replayed live.
- **Blocker:** No bot protection problem: the site and the consultation app load normally in the walker.

Stage 1 (map). The browser walk covers only the pre-wall screens (men: 3 questions; women: 4; three direct-purchase entries). The value is in the code: on load, the consultation app fetches the complete question schema for each flow from a public endpoint, including every question, option, fork rule and variable change behind the wall, and the men's recommendation function sits in a public JS chunk. All post-wall questions, rules and recommendation profiles here are read from that served code (evidence 'code'), not seen happening. No email, phone, name or other contact detail was entered, nothing was submitted, no photo or payment was given. Honest note: the page itself creates an anonymous draft visitor record on the first answer and posts each answer to it; that is the site's normal anonymous behaviour.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

Two different engines. MEN: a 'soft steer' engine. Nothing medical stops a man (only age under 18, female sex or an unserved zip). Answers set three flags, one per treatment. A fixed priority list (Ro Mane Spray, then finasteride tablets, then oral minoxidil tablets) picks the first unflagged treatment as 'recommended', but every treatment stays on the screen and can be picked, and a clinician decides afterwards. Goals, severity and pattern (other than patchy loss) do not change the recommendation; they only personalise a recap screen. WOMEN: a 'gate' engine. Pregnancy, any diagnosed scalp condition, signs of a hormonal disorder, lupus or autoimmune disease, past steroid injections and minoxidil allergy end the visit with a referral. Breastfeeding, cardiovascular conditions, high blood pressure and age over 65 remove the tablet and leave only the topical. Everyone else chooses between oral minoxidil and the compounded topical, with 'no preference' defaulting to the tablet. Non-prescription products (5% minoxidil solution, shampoo, conditioner) are sold through separate links with no questions.

## 3. Engine rules (21)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men | End of the medical questions (qid 3178) | Recommended treatment = the first of [Ro Mane Spray, oral finasteride, oral minoxidil] whose no-recommend flag (noRecTopicalCombined, noRecOralFin, noRecOralMin) is not 1 and whose product group is not disabled for the patient's state. The others are listed under 'Other treatment options' and stay selectable. If none qualifies the result is 'no-recommendation' and the screen is headed 'Your treatment options'. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Switches product | code | high |
| R2 | men | Patient's US state does not support the compounded product (products-support lookup by state) | The compounded group is treated as ineligible ('Not available in your area') and left off the screen; the recommendation moves to oral finasteride. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride))_ | Removes a product | code | medium |
| R3 | men | Any of: patchy loss ('Random golf-ball size bald patches…', qid 132); onset 'Very suddenly' (150); 'Redness or rashes on scalp' (170); past 'Steroid injections in the scalp' (240); still-low blood pressure readings (391) | All three no-recommend flags are set: nothing is recommended, the recap loader is skipped, but all three treatments can still be picked and the visit still goes to checkout and clinician review. There is no stop screen for men. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Removes a product | code | high |
| R4 | men | Any of: erectile dysfunction, anxiety or depression (qid 1000); trying for a pregnancy in the next 3 months (2350); past oral finasteride with problematic side effects or allergy (315) | Flags both finasteride products (spray and tablet): the recommendation becomes oral minoxidil. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia))_ | Switches product | code | high |
| R5 | men | Prostate cancer (qid 1000); allergy to topical minoxidil (285) or to topical finasteride (335) | Flags the spray only: the recommendation becomes oral finasteride. (Prostate cancer does not flag finasteride tablets in the schema.) _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride))_ | Switches product | code | high |
| R6 | men | Past oral minoxidil with allergy (qid 265) | Flags the spray and oral minoxidil: the recommendation becomes oral finasteride. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Switches product | code | high |
| R7 | men | Any of: still 'very high' blood pressure readings (381); phaeochromocytoma (1000); stroke under 6 months ago (1260); angina, heart failure, pericarditis or pulmonary hypertension (1300); heart attack or bypass under 6 months ago, or no regular cardiologist (1315, 1320, 1355, 1360); atrial flutter, PSVT, Wolff-Parkinson-White or ventricular fibrillation (1420); resting heart rate under 50 or fainting from a low heart rate (1455, 1460); past oral minoxidil with side effects or no effect (265) | Flags oral minoxidil only. The spray (which also contains minoxidil) stays the recommendation, so for a patient with no other flags nothing visible changes. _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Removes a product | code | high |
| R8 | men | Past oral finasteride 'this dose wasn't effective' (qid 315) | Flags oral finasteride only; the spray stays recommended. _(affects: Oral finasteride 1 mg (generic Propecia))_ | Removes a product | code | high |
| R9 | men | Basics screen: age under 18, sex female, or zip not served | Hard stop (under 18, zip) or hand-off to the women's visit (female). These are the only stops in the men's schema. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Stops the patient | code | high |
| R10 | men | qid 22 includes 'Non-prescription solutions' or 'Prescription medications' | Adds the marketing question 'main reason you're looking now' instead of 'why haven't you tried', and adds the past-treatment block (qid 240 and follow-ups) after the wall. | Adds questions | code | high |
| R11 | men | Goals (qid 20), reasons (26, 28), areas of thinning (132: hairline, crown, overall) | No effect on the recommendation. They only build the personalised 'Here's a quick recap' bullets on the loader. | Marketing only | code | high |
| R12 | men | Liver failure or cirrhosis, kidney disease including stage 5, coronary artery disease, medicines, allergies | No flag in the schema: the recommendation is unchanged; answers are highlighted for the clinician. | Flags for the clinician | inferred | medium |
| R13 | women | Pregnant = 'Yes' or 'Not sure' (qid 1055) | Hard stop: 'Unfortunately, our treatments are not available for use during pregnancy.' _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R14 | women | Any diagnosed scalp condition ticked at qid 1086 (alopecia areata, lichen planopilaris, FFA, CCCA, traction alopecia, lupus) | Hard stop: refer to an in-person dermatologist (screen 6040). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R15 | women | Enlargement of the clitoris, discharge from the nipple(s) or deepening of the voice (qid 1090) | Hard stop (screen 6040). Excess body or facial hair, severe acne and irregular periods do not stop the visit. _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R16 | women | Lupus or other autoimmune disorder (qid 1096) | Rules out both products -> hard stop (screen 6040). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R17 | women | Breastfeeding (1057), or any of heart condition, stroke, phaeochromocytoma, pulmonary hypertension, high blood pressure (1096), or age over 65 | Oral minoxidil is not offered: no choice screen, Hair Solution Rx is the only treatment shown (screen 4030). _(affects: Women's oral minoxidil (low dose))_ | Removes a product | code | high |
| R18 | women | Past steroid injections into the scalp (1250); allergy to oral minoxidil = Yes (1254); allergy to topical minoxidil in foam form or both forms (1258) | Hard stop (screen 6040). An allergy to the liquid form only continues. _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R19 | women | No exclusion and age 65 or under | Choice screen: Oral Minoxidil ($30/mo), Hair Solution Rx ($40/mo) or No preference (puts oral minoxidil in the cart). Hair pattern, severity and duration do not change the options. _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Adds a product | code | high |
| R20 | women | Basics screen: age under 18, sex male, or zip not served | Hard stop (under 18, zip) or hand-off to the men's visit (male). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R21 | women | qid 8 includes 'Top of head/crown' or 'All over' | Adds the part-line picture question (qid 10) before the account wall. | Adds questions | observed | high |

## 4. Products (11)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride)](https://ro.co/medications/ro-mane-spray/) | rx-topical-compounded | minoxidil 6%; finasteride 0.3%; tretinoin 0.025% | topical spray, 4 oz bottle, once daily (no more than 4 sprays a day) | men | US compounded prescription medicine (not FDA-approved); catalogue rx_type 'rx_compound', pharmacy name 'Compounded Topical Liquid' | $50 a month on the quarterly plan (one 4 oz bottle per 3 months) ($43 a month on the 6-month plan. No 12-month plan (catalogue delivery choices: quarterly, semiannually). Recommender card says 'Starting at $43/mo'. Landing-page coupons: 35% or 50% off the first order if prescribed.) | Default recommended treatment in the men's visit: it is first in the fixed order spray, oral finasteride, oral minoxidil. It loses the 'recommended' place when any answer sets noRecTopicalCombined, or when compounded products are not supported in the patient's state (then it is hidden). | code |
| [Oral finasteride 1 mg (generic Propecia)](https://ro.co/medications/finasteride/) | rx-oral | finasteride 1 mg | tablet, one a day | men | US Rx (FDA-approved generic for male pattern hair loss) | $20 a month on the quarterly plan ($18 a month on the 6-month plan, $16 a month on the 12-month plan. Catalogue: $0.66 a tablet, 30 a month. Recommender card says 'Starting at $16/mo'.) | Recommended when Ro Mane Spray is flagged (noRecTopicalCombined) or not available in the state, and noRecOralFin is not set. Example from the schema: a history of prostate cancer flags the spray only, so finasteride tablets become the recommendation. | code |
| [Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss)](https://ro.co/medications/oral-minoxidil/) | rx-oral | minoxidil 2.5 mg | tablet, one a day | men | US Rx, FDA-approved for high blood pressure only; used off-label for hair loss; boxed warning | $30 a month on the quarterly plan ($27 a month on the 6-month plan, $24 a month on the 12-month plan. Catalogue: $1.00 a tablet. Recommender card says 'Starting at $24/mo'.) | Last in the recommendation order. Recommended only when both the spray and oral finasteride are flagged (for example depression, anxiety, erectile dysfunction, trying for a baby, or bad experience with finasteride) and noRecOralMin is not set. | code |
| [Oral minoxidil 5 mg a day (two 2.5 mg tablets)](https://ro.co/medications/oral-minoxidil/) | rx-oral | minoxidil 5 mg a day (2 x 2.5 mg) | tablets, two a day | men | US Rx, off-label for hair loss | $30 a month (catalogue: $0.50 a tablet, 60 tablets a month) (Same monthly price as the 2.5 mg plan in the catalogue. Not selectable in the onboarding visit; no public page.) | unknown. It exists in the catalogue (group hl-oral-minoxidil-5mg) but no onboarding answer adds it; probably a clinician dose step (inferred). | code |
| [Minoxidil Topical Solution 5%, 60 mL (generic Rogaine)](https://ro.co/medications/minoxidil/) | otc-medicine | minoxidil 5% | topical solution, 1 mL twice a day, one 60 mL bottle a month | men | US OTC (FDA-approved non-prescription medicine); no clinician review (catalogue: requires_prescription false, requires_review false) | $16 a month on the 3-month plan ($48 per shipment) ($14 a month on the 6-month plan; $13 a month on the 12-month plan ($156 a year: $192 less a $36 refill-frequency discount).) | Never recommended by the visit. Bought directly through its own 'Buy now' link (no medical questions); also exists as an add-on product in the catalogue (hl-minoxidil-addon-group). | observed |
| [Finasteride tablets + topical minoxidil together](https://ro.co/faq/hair-loss/) | bundle | finasteride 1 mg; minoxidil 5% topical | tablet plus topical solution | men | US Rx (finasteride) plus US OTC (minoxidil solution) | $1.17 a day on a quarterly plan (hair-loss FAQ); catalogue sum is $20 + $16 = $36 a month (The FAQ figures ($0.67 a day finasteride, $0.53 a day minoxidil, $1.17 a day together) look older than the pricing page; treat as approximate.) | Docs only: 'In some cases, your doctor or nurse practitioner may recommend using finasteride and minoxidil together.' The older two-product preference screen (qid 3200) describes finasteride as suited to people who 'would like to also use topical minoxidil'. Not a separate choice in the current visit. | docs |
| [Ro Revive Shampoo (8 oz)](https://ro.co/products/revive-shampoo/) | cosmetic | saw palmetto, pumpkin seed oil, salicylic acid, caffeine not stated | shampoo, 8 oz bottle | men | US cosmetic (sold as 'OTC' type in the catalogue, no prescription, no review) | $24 per 3 months (one bottle every 3 months) (Only a 3-month plan. Offered as an add-on in the men's visit catalogue.) | Never recommended by the medical questions. Own 'Buy now' flow; loaded as an add-on in the men's visit (schema meta include_product_codes). | observed |
| [Ro Restore Conditioner (8 oz)](https://ro.co/products/restore-conditioner/) | cosmetic | plant proteins, coconut oil, shea butter not stated | conditioner, 8 oz bottle | men | US cosmetic (catalogue type 'OTC', no prescription, no review) | $24 per 3 months (one bottle every 3 months) (Only a 3-month plan. Shown as a 'Popular add-on' on the shampoo checkout.) | Never recommended by the medical questions. Own 'Buy now' flow; add-on to the shampoo order and to the men's visit. | observed |
| Hair Support Supplement | supplement | unknown unknown | box of 90 (catalogue: quantity 90, 30-day supply) | men | US dietary supplement (inferred from the name; no product page found) | unknown (The catalogue lists the group roman-hair-support-supplement with monthly and quarterly delivery choices but no purchasable product inside it, and the sitemap has no page for it. It may be withdrawn or paused.) | unknown. Requested as an add-on code by every men's hair schema (include_product_codes) but the group comes back empty. | code |
| [Women's oral minoxidil (low dose)](https://ro.co/medications/womens-oral-minoxidil/) | rx-oral | minoxidil exact strength not published; site says 0.25 to 2.5 mg is the typical range for women | tablet, once a day | women | US Rx, off-label for hair loss; boxed warning | $30 a month, quarterly plan (The pricing page and the consultation both say quarterly; the women's landing page says 'billed and shipped every 2 months'. Only one plan length is published.) | Offered when the patient is eligible for oral minoxidil (not breastfeeding, none of: heart condition, stroke, lupus or other autoimmune disorder, phaeochromocytoma, pulmonary hypertension, high blood pressure) and aged 65 or under. It is the default in the cart when she picks 'No preference'. | code |
| [Hair Solution Rx (women's compounded topical)](https://ro.co/medications/hair-solution-rx/) | rx-topical-compounded | minoxidil 5%; tretinoin 0.025%; melatonin 0.1% | topical solution, once a day | women | US compounded prescription medicine (not FDA-approved) | $40 a month, quarterly plan (Only one plan length is published. Site: do not use if pregnant or trying to get pregnant.) | Offered as a choice to every eligible woman; it becomes the only treatment offered (no choice screen) when oral minoxidil is ruled out or the patient is over 65. | code |

## 5. Who gets what (8 patient profiles)

- **Man, 32, hairline + crown, gradual, nothing tried, no conditions, not trying for a baby (baseline)** → Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss) (default: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride)). From the served code, not seen live (the result screen is behind the account wall). Ro Mane Spray is shown as recommended; oral finasteride and oral minoxidil under 'Other treatment options'. _[code]_
- **Man with depression, anxiety or erectile dysfunction, or trying for a baby in the next 3 months** → Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss) (default: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss)). Both finasteride products are flagged, so oral minoxidil is recommended; the others can still be picked. _[code]_
- **Man with a history of prostate cancer, or allergy to a topical minoxidil / topical finasteride product** → Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss) (default: Oral finasteride 1 mg (generic Propecia)). Only the spray is flagged. _[code]_
- **Man with patchy loss, sudden onset, scalp redness or rash, past steroid injections, or persistently low blood pressure** → Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss). No recommendation ('Your treatment options'); all three still selectable; clinician decides. _[code]_
- **Man with heart failure, angina, recent heart attack or stroke, or very high blood pressure** → Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss) (default: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride)). Only oral minoxidil is flagged; the minoxidil-containing spray stays recommended. _[code]_
- **Woman, 38, thinning on top, gradual, not pregnant or breastfeeding, no conditions (baseline)** → Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical) (default: Women's oral minoxidil (low dose)). Choice screen with 'No preference' defaulting to oral minoxidil. From the served schema, not seen live. _[code]_
- **Woman who is breastfeeding, has high blood pressure, a heart condition, stroke, phaeochromocytoma or pulmonary hypertension, or is over 65** → Hair Solution Rx (women's compounded topical) (default: Hair Solution Rx (women's compounded topical)). Hair Solution Rx only. _[code]_
- **Woman who is or may be pregnant; has a diagnosed scalp condition; virilisation signs; lupus or autoimmune disorder; past scalp steroid injections; minoxidil allergy** → nothing offered. Stopped and referred to in-person care. _[code]_

## 6. The consultation, question by question

### Men's hair-loss online visit (schema 'Hair loss onboarding', code hl-onb-consult-2rx, version 77)

Entry: https://start.ro.co/fxdxbh/

3 anonymous marketing questions (goals, what you have tried, why now) -> ACCOUNT WALL (email + consents, cannot be dismissed) -> basics (birth date, sex, zip, phone) -> hair pattern, onset, severity, scalp symptoms -> past treatments (only if any were tried) -> blood pressure -> conditions -> heart -> medicines -> allergies -> trying for a baby -> cross-sell -> anything else -> recap loader -> recommendation screen (3 treatments, 1 recommended) -> side-effect acknowledgement -> selfie + ID -> shipping -> payment -> clinician review. Everything after the wall is from the publicly served schema, not walked.

**1. What are your top hair goals?**  
_multi · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Opening question about goals. In the code the three goal variables only feed the personalised recap bullets; the recommendation logic ignores them.

- `Regrow my hair` → **Marketing only**: Sets goalRegrowth=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'You want to regrow your hair'). It does not change which treatment is recommended. _[code]_
- `Get thicker, fuller hair` → **Marketing only**: Sets goalThickerAndFuller=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'You want fuller, thicker hair'). It does not change which treatment is recommended. _[code]_
- `Proactively prevent hair loss` → **Marketing only**: Sets goalPrevention=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'You want to prevent future hair loss'). It does not change which treatment is recommended. _[code]_

**2. What hair loss solutions have you tried, if any?**  
_multi · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Splits people who have tried something from first-timers. Decides the next marketing question and whether the past-treatment questions are asked later.  
Downstream: Any 'tried' answer -> qid 28 now and qid 240 onwards later (fork 25 and fork 229). 'None of the above' -> qid 26 and the past-treatment block is skipped.

- `Non-prescription solutions (e.g. Rogaine, supplements)` → **Adds questions**: Sets hasTriedNonPrescription=1. Branch: the next question becomes 'What's the main reason you're looking for hair loss solutions now?' (instead of 'why haven't you tried'), and after the account wall the visit adds 'What hair loss treatments have you used?' with follow-ups about each one. Does not change the recommendation by itself. _[code]_
- `Prescription medications (e.g. Propecia, oral minoxidil)` → **Adds questions**: Sets hasTriedPrescription=1. Branch: the next question becomes 'What's the main reason you're looking for hair loss solutions now?' (instead of 'why haven't you tried'), and after the account wall the visit adds 'What hair loss treatments have you used?' with follow-ups about each one. Does not change the recommendation by itself. _[code]_
- `None of the above` → **Skips questions**: Sets hasNotTriedAnyPrescription=1. Next question is 'What's the main reason you haven't tried hair loss treatment before?' (seen in runs/baseline-men). The past-treatment questions are skipped. _[observed]_

**3. What’s the main reason you haven’t tried hair loss treatment before?**  
_single · anonymous · role: marketing · shown: qid 22 = 'None of the above' (fork 25) · no branch · observed_  
Why they ask: Objection capture for first-timers. Two answers feed recap bullets; none changes the treatment.

- `Not sure it'll work` → **Marketing only**: Sets notSureAboutHairLossTreatment=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'Want to see real results'). It does not change which treatment is recommended. _[code]_
- `Seems too expensive` → **Marketing only**: No variable is set. Marketing data only. _[code]_
- `Nervous about side effects` → **Marketing only**: No variable is set (it does not steer away from finasteride). Marketing data only. _[code]_
- `Didn't want or need to until now` → **Marketing only**: Sets didntWantOrNeedHairLossTreatment=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'Looking to get started'). It does not change which treatment is recommended. _[code]_

**4. What’s the main reason you’re looking for hair loss solutions now?**  
_single · anonymous · role: marketing · shown: qid 22 includes a 'tried' answer (fork 25) · no branch · code_  
Why they ask: Motivation capture for people who have tried something. Two answers feed recap bullets; none changes the treatment.

- `Over-the-counter solutions didn't work for me` → **Marketing only**: Sets lookingBecauseOtcNotWork=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'Looking for prescription-strength'). It does not change which treatment is recommended. _[code]_
- `I want to maximize results with a new or additional product` → **Marketing only**: No variable is set. Marketing data only. _[code]_
- `I want an easier or more convenient solution (like a pill or a spray)` → **Marketing only**: Sets lookingForEasierSolution=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'Looking for an easier solution'). It does not change which treatment is recommended. _[code]_
- `I’ve experienced side effects with past solutions` → **Marketing only**: No variable is set here (side effects are asked about again, per medicine, after the account wall). Marketing data only. _[code]_

**5. Ro members start seeing results in as little as three months [testimonial carousel, then 'Your treatment options: We offer clinically proven ingredients like finasteride, minoxidil, or both in a convenient topical spray.'] covered by a pop-up: 'See how much fuller your hair could be in just 3 months' with an Email address field, 'I agree to privacy policy', 'I agree to terms and consent to telehealth', Continue, 'Continue with Google'**  
_contact · anonymous · role: identity · shown: always · no branch · observed_  
Why they ask: ACCOUNT WALL. Email capture and consent before any medical question. No product, price or recommendation is shown before it, only a general line about ingredients.


**6. Log in**  
_contact · after-account · role: identity · shown: the email already belongs to a member (memberExists == 1) · no branch · code_  
Why they ask: Log-in screen for existing members.


**7. Answer a few questions to see if you’re eligible for treatment. [form 'The Basics': Birthdate, Sex Assigned at Birth, Zipcode, Mobile phone number]**  
_contact · after-account · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Identity and three hard gates: age (minAge 18), sex (allowedGenders: male) and whether Ro serves the zip code.  
Downstream: Under 18 -> exit 7010. Female -> fork 7060 (redirect offer to the women's visit, or an exit form). Unsupported zip -> exit 7030. Otherwise -> qid 132.

- `(engine outcome) Under 18 years old` → **Stops the patient**: Hard stop: 'Unfortunately our hair loss treatment is not available to people under 18.' with a comment form. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `(engine outcome) Female` → **Stops the patient**: Leaves the men's visit: either a screen 'We have a better experience for you!' with a button to the women's visit (/tefcyb), or, if the redirect flag is off, 'Unfortunately our hair loss treatment is currently only available to men.' _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `(engine outcome) Not supported zip code` → **Stops the patient**: Hard stop: 'Be notified when we’re in your area!' _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `(engine outcome) Next` → **Next question**: Continues to the medical questions. No upper age limit exists in the men's schema. _[code]_

**8. Where are you noticing hair loss or thinning?**  
_multi · after-account · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Pattern of loss. Typical male-pattern areas carry on; patchy loss is treated as a red flag for another diagnosis; 'nowhere yet' is the prevention route.  
Downstream: Hairline, crown or overall -> onset, severity and scalp-symptom questions (150, 160, 170). Patches or 'Nowhere yet' -> jump to fork 229, skipping those three. How mixed selections route is not known.

- `Hairline (along my forehead or temples)` → **Next question**: Sets thinningHairline=1 (recap bullet 'Thinning hairline'; two or more areas become 'Thinning in multiple areas'). Goes on to the onset question. No effect on the recommendation. _[code]_
- `Crown (top of my head)` → **Next question**: Sets thinningCrown=1 (recap bullet 'Thinning crown'). Goes on to the onset question. No effect on the recommendation. _[code]_
- `Overall thinning` → **Next question**: Sets thinningOverall=1 (recap bullet 'Thinning in several areas'). Goes on to the onset question. No effect on the recommendation. _[code]_
- `Random golf-ball size bald patches scattered all over scalp` → **Removes a product**: Routes straight to the past-treatment fork (229), skipping the onset, severity and scalp-symptom questions. Sets all three no-recommend flags (noRecTopicalCombined, noRecOralFin, noRecOralMin). The recommender then returns 'no-recommendation': the recap loader is skipped and the result screen is headed 'Your treatment options' with no recommended treatment. All three treatments are still listed and can still be picked; there is no stop screen. The clinician decides. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Nowhere yet, but I’d like to prevent future hair loss` → **Skips questions**: Exclusive answer. Skips the onset, severity and scalp-symptom questions. Sets no flag, so the recommendation is unchanged (Ro Mane Spray) even with no visible hair loss. _[code]_

**9. How did your hair loss start?**  
_single · after-account · role: diagnosis · shown: qid 132 includes hairline, crown or overall thinning · no branch · code_  
Why they ask: Speed of onset. Sudden loss points away from male-pattern hair loss.

- `Very suddenly` → **Removes a product**: Sets all three no-recommend flags (noRecTopicalCombined, noRecOralFin, noRecOralMin). The recommender then returns 'no-recommendation': the recap loader is skipped and the result screen is headed 'Your treatment options' with no recommended treatment. All three treatments are still listed and can still be picked; there is no stop screen. The clinician decides. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Gradually` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Not sure` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_

**10. How would you describe the severity of your current hair loss?**  
_single · after-account · role: data-capture · shown: qid 132 includes hairline, crown or overall thinning · no branch · code_  
Why they ask: Self-rated severity, kept as a baseline to track over time. No option changes anything in the engine.

- `Very mild` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Mild` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Moderate` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Severe` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Extremely severe` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**11. Have you noticed any of the following?**  
_multi · after-account · role: safety-screen · shown: qid 132 includes hairline, crown or overall thinning · no branch · code_  
Why they ask: Scalp red flags (inflammation, scarring, infection, eyebrow or eyelash loss). Only redness or rash removes the recommendation; the others are flags.

- `Redness or rashes on scalp` → **Removes a product**: Sets all three no-recommend flags (noRecTopicalCombined, noRecOralFin, noRecOralMin). The recommender then returns 'no-recommendation': the recap loader is skipped and the result screen is headed 'Your treatment options' with no recommended treatment. All three treatments are still listed and can still be picked; there is no stop screen. The clinician decides. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Pain, soreness, burning, and/or tingling in areas of hair loss` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `Recurrent pus bumps or open sores on scalp` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `Partial or complete loss of eyebrows or eyelashes` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `None of the above` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**12. What hair loss treatments have you used?**  
_multi · after-account · role: personalisation · shown: qid 22 includes a 'tried' answer (fork 229) · BRANCHES · code_  
Why they ask: Which treatments were used before. Opens a follow-up block per medicine; steroid injections are treated as a sign of another diagnosis.  
Downstream: Each ticked medicine opens its own follow-ups (forks 250, 280, 300, 330, 350).

- `Oral minoxidil` → **Adds questions**: Opens 'What dose of oral minoxidil did you use?' and 'Did oral minoxidil work well for you?'. Also sets isEligibleFor6And12MonthShipments=1 (not used in the downloaded front-end code; by its name it unlocks the 6- and 12-month plans for people already established on the medicine: inferred). No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Topical minoxidil` → **Adds questions**: Opens 'Did topical minoxidil work well for you?'. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Oral Finasteride` → **Adds questions**: Opens 'What dose of oral finasteride did you use?' and 'Did oral finasteride work well for you?'. Also sets isEligibleFor6And12MonthShipments=1 (see oral minoxidil). No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Topical finasteride` → **Adds questions**: Opens 'Did topical finasteride work well for you?'. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Steroid injections in the scalp` → **Removes a product**: Sets all three no-recommend flags (noRecTopicalCombined, noRecOralFin, noRecOralMin). The recommender then returns 'no-recommendation': the recap loader is skipped and the result screen is headed 'Your treatment options' with no recommended treatment. All three treatments are still listed and can still be picked; there is no stop screen. The clinician decides. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Other` → **Adds questions**: Opens a free-text box 'What other hair loss treatments have you tried?'. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**13. What dose of oral minoxidil did you use?**  
_single · after-account · role: personalisation · shown: qid 240 includes 'Oral minoxidil' · BRANCHES · code_  
Why they ask: Previous oral minoxidil dose, for the prescriber. No option sets a variable.  
Downstream: 'Other' opens a free-text dose box (qid 260).

- `2.0mg daily` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `2.5mg daily` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `3.0mg daily` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `3.5mg daily` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `4.0mg daily` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `5.0mg daily` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Other` → **Adds questions**: Opens the free-text box 'What daily dosage of oral minoxidil were you taking most recently?'. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**14. Explain your treatment**  
_text · after-account · role: data-capture · shown: qid 255 = 'Other' · no branch · code_  
Why they ask: Free-text previous oral minoxidil dose.


**15. Did oral minoxidil work well for you?**  
_single · after-account · role: product-selector · shown: qid 240 includes 'Oral minoxidil' · BRANCHES · code_  
Why they ask: Past response to oral minoxidil. Side effects, no effect or allergy stop it being recommended; allergy also blocks the spray (which contains minoxidil).  
Downstream: 'Other' opens a free-text box (qid 270).

- `Yes, it worked well` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `No, I had problematic side effects` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `No, this dose wasn't effective` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `No, I found out I was allergic to it` → **Switches product**: Sets noRecTopicalCombined and noRecOralMin. Ro Mane Spray can no longer be the recommended treatment, nor can oral minoxidil; with no other flags the recommendation becomes oral finasteride. Flagged treatments stay listed under 'Other treatment options' and can still be picked. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Other` → **Adds questions**: Opens a free-text box about how the treatment went. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**16. Explain your treatment**  
_text · after-account · role: data-capture · shown: qid 265 = 'Other' · no branch · code_  
Why they ask: Free text about past oral minoxidil treatment.


**17. Did topical minoxidil work well for you?**  
_single · after-account · role: product-selector · shown: qid 240 includes 'Topical minoxidil' · BRANCHES · code_  
Why they ask: Past response to topical minoxidil. Only an allergy changes the engine (spray no longer recommended).  
Downstream: 'Other' opens a free-text box (qid 290).

- `Yes, it worked well` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `No, I had problematic side effects` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `No, it wasn’t effective` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `No, I found out I was allergic to it` → **Switches product**: Sets noRecTopicalCombined. Ro Mane Spray can no longer be the recommended treatment; with no other flags the recommendation becomes oral finasteride. Flagged treatments stay listed under 'Other treatment options' and can still be picked. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride))_ _[code]_
- `Other` → **Adds questions**: Opens a free-text box about how the treatment went. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**18. Explain your treatment**  
_text · after-account · role: data-capture · shown: qid 285 = 'Other' · no branch · code_  
Why they ask: Free text about past topical minoxidil treatment.


**19. What dose of oral finasteride did you use?**  
_single · after-account · role: personalisation · shown: qid 240 includes 'Oral Finasteride' · BRANCHES · code_  
Why they ask: Previous finasteride dose, for the prescriber.  
Downstream: 'Other' opens a free-text dose box (qid 310).

- `1mg` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Other` → **Adds questions**: Opens the free-text box 'What daily dosage of oral finasteride were you taking most recently?'. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**20. Explain your treatment**  
_text · after-account · role: data-capture · shown: qid 305 = 'Other' · no branch · code_  
Why they ask: Free-text previous finasteride dose.


**21. Did oral finasteride work well for you?**  
_single · after-account · role: product-selector · shown: qid 240 includes 'Oral Finasteride' · BRANCHES · code_  
Why they ask: Past response to oral finasteride. Side effects or allergy flag both finasteride products (tablet and spray); 'not effective' flags the tablet only.  
Downstream: 'Other' opens a free-text box (qid 320).

- `Yes, it worked well` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `No, I had problematic side effects` → **Switches product**: Sets noRecTopicalCombined and noRecOralFin. Ro Mane Spray can no longer be the recommended treatment, nor can oral finasteride; with no other flags the recommendation becomes oral minoxidil. Flagged treatments stay listed under 'Other treatment options' and can still be picked. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia))_ _[code]_
- `No, this dose wasn't effective` → **Removes a product**: Sets noRecOralFin: oral finasteride can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended); it matters when the spray is also flagged or not available in the state, when the recommendation then skips to oral minoxidil. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral finasteride 1 mg (generic Propecia))_ _[code]_
- `No, I found out I was allergic to it` → **Switches product**: Sets noRecTopicalCombined and noRecOralFin. Ro Mane Spray can no longer be the recommended treatment, nor can oral finasteride; with no other flags the recommendation becomes oral minoxidil. Flagged treatments stay listed under 'Other treatment options' and can still be picked. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia))_ _[code]_
- `Other` → **Adds questions**: Opens a free-text box about how the treatment went. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**22. Explain your treatment**  
_text · after-account · role: data-capture · shown: qid 315 = 'Other' · no branch · code_  
Why they ask: Free text about past oral finasteride treatment.


**23. Did topical finasteride work well for you?**  
_single · after-account · role: product-selector · shown: qid 240 includes 'Topical finasteride' · BRANCHES · code_  
Why they ask: Past response to topical finasteride. Only an allergy changes the engine.  
Downstream: 'Other' opens a free-text box (qid 340).

- `Yes, it worked well` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `No, I had problematic side effects` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `No, it wasn’t effective` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `No, I found out I was allergic to it` → **Switches product**: Sets noRecTopicalCombined. Ro Mane Spray can no longer be the recommended treatment; with no other flags the recommendation becomes oral finasteride. Flagged treatments stay listed under 'Other treatment options' and can still be picked. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride))_ _[code]_
- `Other` → **Adds questions**: Opens a free-text box about how the treatment went. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**24. Explain your treatment**  
_text · after-account · role: data-capture · shown: qid 335 = 'Other' · no branch · code_  
Why they ask: Free text about past topical finasteride treatment.


**25. Explain your treatment**  
_text · after-account · role: data-capture · shown: qid 240 includes 'Other' · no branch · code_  
Why they ask: Free text: other hair-loss treatments tried.


**26. Have you ever been diagnosed with or treated for high or low blood pressure?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Blood pressure history, mainly for oral minoxidil (a blood-pressure medicine) and the minoxidil spray.  
Downstream: High -> qid 381. Low -> qid 391. Either, or 'I'm not sure' -> information screen 395. 'No' -> straight to qid 1000. The schema lets high and low both be recorded (two follow-up forks).

- `Yes, for high blood pressure` → **Adds questions**: Sets followupHighBloodPressure=1 and opens 'have your blood pressure readings still been “very high”?' then the blood-pressure information screen. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Yes, for low blood pressure` → **Adds questions**: Sets followupLowBloodPressure=1 and opens 'have your blood pressure readings still been “low”?' then the blood-pressure information screen. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `I'm not sure` → **Adds questions**: Shows the blood-pressure information screen (qid 395) before carrying on. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `No` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**27. Since being diagnosed with or treated for high blood pressure, have your blood pressure readings still been “very high”?**  
_single · after-account · role: safety-screen · shown: qid 370 = 'Yes, for high blood pressure' · no branch · code_  
Why they ask: Uncontrolled high blood pressure check. The on-screen chart defines very high as 161+ systolic or 101+ diastolic (ranges coded in raw/js/main bundle).

- `Yes, I still have “very high” blood pressure readings` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `No, my blood pressure reading is never “very high”` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `I’m not sure` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**28. Since being diagnosed with or treated for low blood pressure, have your blood pressure readings still been “low”?**  
_single · after-account · role: safety-screen · shown: qid 370 = 'Yes, for low blood pressure' · no branch · code_  
Why they ask: Persistent low blood pressure check. The chart defines low as under 95 systolic or under 55 diastolic. A 'yes' removes every recommendation.

- `Yes, I still have “low” blood pressure readings` → **Removes a product**: Sets all three no-recommend flags (noRecTopicalCombined, noRecOralFin, noRecOralMin). The recommender then returns 'no-recommendation': the recap loader is skipped and the result screen is headed 'Your treatment options' with no recommended treatment. All three treatments are still listed and can still be picked; there is no stop screen. The clinician decides. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `No, my blood pressure reading is never “low”` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `I’m not sure` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**29. High or low blood pressure readings can be associated with increased risks when using certain hair loss treatments.**  
_info · after-account · role: expectation-setting · shown: qid 370 is high, low or 'I'm not sure' · no branch · code_  
Why they ask: Information screen: out-of-range blood pressure may add risk; treatment 'may still be suitable'; see your own doctor.

- `I understand, continue` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**30. Do you have, or have you ever had, any of the following conditions?**  
_multi · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: General medical history. Mental-health and sexual-function conditions steer away from finasteride; phaeochromocytoma steers away from oral minoxidil; kidney, liver and stroke open follow-ups.  
Downstream: Stroke -> 1255 and 1260. Kidney disease -> 1275. Liver failure or cirrhosis -> 1285. 'None of the above' -> heart question.

- `Stroke` → **Adds questions**: Sets stroke=1 and opens 'What type of stroke did you have?' and 'When did your stroke occur?'. No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Prostate cancer` → **Switches product**: Sets noRecTopicalCombined. Ro Mane Spray can no longer be the recommended treatment; with no other flags the recommendation becomes oral finasteride. Flagged treatments stay listed under 'Other treatment options' and can still be picked. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride))_ _[code]_
- `Kidney disease` → **Adds questions**: Sets kidneyDisease=1 and opens 'What kind of kidney disease do you have?'. No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Liver failure or liver cirrhosis` → **Adds questions**: Sets liverDisease=1 and opens 'Which of these liver conditions do you have?'. No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Erectile dysfunction` → **Switches product**: Sets noRecTopicalCombined and noRecOralFin. Ro Mane Spray can no longer be the recommended treatment, nor can oral finasteride; with no other flags the recommendation becomes oral minoxidil. Flagged treatments stay listed under 'Other treatment options' and can still be picked. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia))_ _[code]_
- `Anxiety` → **Switches product**: Sets noRecTopicalCombined and noRecOralFin. Ro Mane Spray can no longer be the recommended treatment, nor can oral finasteride; with no other flags the recommendation becomes oral minoxidil. Flagged treatments stay listed under 'Other treatment options' and can still be picked. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia))_ _[code]_
- `Depression` → **Switches product**: Sets noRecTopicalCombined and noRecOralFin. Ro Mane Spray can no longer be the recommended treatment, nor can oral finasteride; with no other flags the recommendation becomes oral minoxidil. Flagged treatments stay listed under 'Other treatment options' and can still be picked. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia))_ _[code]_
- `Pheochromocytoma (adrenal gland tumor)` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `None of the above` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**31. What type of stroke did you have?**  
_single · after-account · role: safety-screen · shown: qid 1000 includes 'Stroke' · no branch · code_  
Why they ask: Type of stroke, for the clinician. No engine effect.

- `Hemorrhagic stroke: a blood vessel leaked blood into the brain` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Ischemic stroke: a blood vessel was blocked by a clot or plaque` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**32. When did your stroke occur?**  
_single · after-account · role: safety-screen · shown: qid 1000 includes 'Stroke' · no branch · code_  
Why they ask: Timing of stroke. A stroke in the last 6 months rules out recommending oral minoxidil.

- `Less than 6 months ago` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `7-12 months ago` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `1-2 years ago` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `2+ years ago` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**33. What kind of kidney disease do you have?**  
_single · after-account · role: safety-screen · shown: qid 1000 includes 'Kidney disease' · no branch · code_  
Why they ask: Stage of kidney disease, for the clinician. No option sets a flag; stage 5 is highlighted.

- `Temporary decrease in kidney function only` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Chronic kidney disease stage 1` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Chronic kidney disease stage 2` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Chronic kidney disease stage 3a` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Chronic kidney disease stage 3b` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Chronic kidney disease stage 4` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Chronic kidney disease stage 5 (kidney failure)` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_

**34. Which of these liver conditions do you have?**  
_single · after-account · role: safety-screen · shown: qid 1000 includes 'Liver failure or liver cirrhosis' · no branch · code_  
Why they ask: Type of liver disease, for the clinician. All answers are highlighted negative but none sets a flag or stops the visit.

- `Liver failure` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `Liver cirrhosis` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `Both` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_

**35. Do you have, or have you ever had, any of the following heart-related conditions?**  
_multi · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Heart history. This block exists for oral minoxidil (boxed warning for the heart): several answers stop it being recommended; none touches the spray or finasteride.  
Downstream: Heart attack -> 1315, 1320. Bypass surgery -> 1355, 1360. Arrhythmia -> 1420 and its follow-ups. 'None of the above' -> medicines question.

- `Repeated chest pain or tightness, also called angina` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Coronary artery disease, or narrowing of the heart vessels` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `Heart attack` → **Adds questions**: Sets heartAttack=1 and opens 'When did your heart attack occur?' and 'Are you seeing a cardiologist regularly…?'. No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Coronary bypass surgery` → **Adds questions**: Sets coronaryBypassSurgery=1 and opens 'When was your coronary bypass surgery?' and the cardiologist follow-up. No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Heart failure` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Arrhythmia` → **Adds questions**: Sets arrhythmia=1 and opens 'What type of arrhythmia have you been diagnosed with?'. No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Pericarditis` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Pulmonary hypertension` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `None of the above` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**36. When did your heart attack occur?**  
_single · after-account · role: safety-screen · shown: qid 1300 includes 'Heart attack' · no branch · code_  
Why they ask: Timing of heart attack; under 6 months rules out recommending oral minoxidil.

- `Less than 6 months ago` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `7-12 months ago` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `1-2 years ago` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `2+ years ago` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**37. Are you seeing a cardiologist regularly for your history of heart attack?**  
_single · after-account · role: safety-screen · shown: qid 1300 includes 'Heart attack' · no branch · code_  
Why they ask: Cardiology follow-up; none rules out recommending oral minoxidil.

- `Yes` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `No` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_

**38. When was your coronary bypass surgery?**  
_single · after-account · role: safety-screen · shown: qid 1300 includes 'Coronary bypass surgery' · no branch · code_  
Why they ask: Timing of bypass surgery; under 6 months rules out recommending oral minoxidil.

- `Less than 6 months ago` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `7-12 months ago` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `1-2 years ago` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `2+ years ago` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**39. Are you seeing a cardiologist regularly as a follow-up to your coronary bypass surgery?**  
_single · after-account · role: safety-screen · shown: qid 1300 includes 'Coronary bypass surgery' · no branch · code_  
Why they ask: Cardiology follow-up after bypass; none rules out recommending oral minoxidil.

- `Yes` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `No` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_

**40. What type of arrhythmia have you been diagnosed with?**  
_multi · after-account · role: safety-screen · shown: qid 1300 includes 'Arrhythmia' · BRANCHES · code_  
Why they ask: Type of rhythm problem. Fast or dangerous rhythms rule out recommending oral minoxidil; atrial fibrillation and bradycardia open follow-ups.  
Downstream: Atrial fibrillation -> 1430 (and 1435), 1440. Bradycardia -> 1455, 1460. Other -> free text 1475.

- `Atrial fibrillation (afib)` → **Adds questions**: Sets atrialFibrillation=1 and opens the ablation and afib-medicine questions. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Atrial flutter` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Premature ventricular contractions (PVCs)` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Bradycardia` → **Adds questions**: Sets bradycardia=1 and opens 'What is your resting heart rate?' and 'Have you ever fainted due to a low heart rate?'. No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Paroxysmal supraventricular tachycardia (PSVT)` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Wolff-Parkinson-White syndrome` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Ventricular fibrillation` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `Other` → **Adds questions**: Opens the free-text box 'Please explain your arrhythmia diagnosis'. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**41. Have you had an ablation procedure?**  
_single · after-account · role: safety-screen · shown: qid 1420 includes 'Atrial fibrillation (afib)' · BRANCHES · code_  
Why they ask: Ablation history, for the clinician. No flag.  
Downstream: 'Yes' adds 'Have you had afib since your ablation?'.

- `Yes` → **Adds questions**: Opens 'Have you had afib since your ablation?'. No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `No` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**42. Have you had afib since your ablation?**  
_single · after-account · role: safety-screen · shown: qid 1430 = 'Yes' · no branch · code_  
Why they ask: Afib recurrence after ablation, for the clinician. No flag.

- `Yes` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `No` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**43. Are you currently taking any medications for your afib?**  
_single · after-account · role: safety-screen · shown: qid 1420 includes 'Atrial fibrillation (afib)' · no branch · code_  
Why they ask: Current afib medicines, for the clinician. No flag.

- `Yes` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `No` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**44. What is your resting heart rate?**  
_single · after-account · role: safety-screen · shown: qid 1420 includes 'Bradycardia' · no branch · code_  
Why they ask: Resting heart rate; under 50 rules out recommending oral minoxidil.

- `Less than 50` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `50-59` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `60-69` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `70+` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**45. Have you ever fainted due to a low heart rate?**  
_single · after-account · role: safety-screen · shown: qid 1420 includes 'Bradycardia' · no branch · code_  
Why they ask: Fainting from a slow heart rate; 'Yes' rules out recommending oral minoxidil.

- `Yes` → **Removes a product**: Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_
- `No` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**46. Please explain your arrhythmia diagnosis**  
_text · after-account · role: data-capture · shown: qid 1420 includes 'Other' · no branch · code_  
Why they ask: Free text about the arrhythmia.


**47. What medications are you currently taking?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Current medicines, picked from a searchable drug list (StructuredMedications). The catalogue marks the prescription products 'ddi_enabled', so interactions are checked after submission; no schema rule depends on the answer.

- `I’m taking medications` → **Flags for the clinician**: Patient searches and selects each medicine. No schema variable or branch depends on it; the list goes to the clinician (and, by the catalogue flag ddi_enabled, to a drug-interaction check: inferred). _[inferred]_
- `I don't take any medications` → **No effect**: No effect on the flow. _[code]_

**48. Do you have any allergies?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Allergies, picked from a searchable list (StructuredAllergies). No schema rule depends on the answer.

- `I have allergies` → **Flags for the clinician**: Patient searches and selects allergies. No schema variable or branch depends on it; highlighted 'caution' for the clinician. _[inferred]_
- `I don't have allergies` → **No effect**: No effect on the flow. _[code]_

**49. Are you and your partner trying to get pregnant in the next 3 months?**  
_single · after-account · role: product-selector · shown: experiment mhlConsultativeOv = 1 (set to 100% of visitors on this entry link in raw/ro-experiments-config.json) · BRANCHES · code_  
Why they ask: Family planning. Trying to conceive steers away from both finasteride products.  
Downstream: 'Yes, we are' adds the caution screen (qid 2355).

- `Yes, we are` → **Switches product**: Sets isTryingToGetPregnantInNext3Months=1 and shows the screen 'A word of caution if you’re planning to get pregnant.' Sets noRecTopicalCombined and noRecOralFin. Ro Mane Spray can no longer be the recommended treatment, nor can oral finasteride; with no other flags the recommendation becomes oral minoxidil. Flagged treatments stay listed under 'Other treatment options' and can still be picked. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia))_ _[code]_
- `No, we are not` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**50. A word of caution if you’re planning to get pregnant.**  
_info · after-account · role: expectation-setting · shown: qid 2350 = 'Yes, we are' · no branch · code_  
Why they ask: Warning screen about finasteride, sexual side effects and sperm count; the patient acknowledges and continues.

- `Acknowledge and continue` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**51. What other health goals are on your mind?**  
_multi · after-account · role: marketing · shown: always · no branch · code_  
Why they ask: Cross-sell: other Ro services the patient might want. No engine effect.

- `Weight loss` → **Marketing only**: No engine effect in this visit; cross-sell data. _[code]_
- `Stronger erections` → **Marketing only**: No engine effect in this visit; cross-sell data. _[code]_
- `Climax control` → **Marketing only**: No engine effect in this visit; cross-sell data. _[code]_
- `Herpes or cold sores outbreaks` → **Marketing only**: No engine effect in this visit; cross-sell data. _[code]_
- `Longevity` → **Marketing only**: No engine effect in this visit; cross-sell data. _[code]_
- `Nutrition` → **Marketing only**: No engine effect in this visit; cross-sell data. _[code]_
- `Skincare` → **Marketing only**: No engine effect in this visit; cross-sell data. _[code]_
- `None of the above` → **Marketing only**: No engine effect in this visit; cross-sell data. _[code]_

**52. Is there anything else you want your Ro-affiliated doctor to know about your condition or health?**  
_single · after-account · role: data-capture · shown: always · BRANCHES · code_  
Why they ask: Last open door for anything the patient wants to tell the clinician.  
Downstream: 'Yes' opens a free-text message box (qid 2520).

- `No` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_
- `Yes` → **Adds questions**: Opens the box 'Please leave your message to your doctor here.' No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='ack-nonclinical' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_

**53. Please leave your message to your doctor here.**  
_text · after-account · role: data-capture · shown: qid 2510 = 'Yes' · no branch · code_  
Why they ask: Free-text message to the clinician.


**54. We use ingredients clinically proven to stop hair loss and regrow hair**  
_info · after-account · role: marketing · shown: experiment mhlConsultativeOv = 1 · no branch · code_  
Why they ask: Sales screen before the result, followed by a loader 'Reviewing your responses / Here’s a quick recap' that lists bullets built from the patient's own answers (goals, areas, what was tried). The loader is skipped when all three no-recommend flags are set.

- `Continue` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**55. MHL Treatment Recommendation [screen title is the recommended product's line, e.g. 'The Ro Mane Spray is our most comprehensive treatment, designed for easy, once-daily use'; if nothing is recommended: 'Your treatment options'. Sub-line: 'Your provider will review your preference and determine the best option for you.' Then 'Other treatment options'.]**  
_single · after-account · role: product-selector · shown: experiment mhlConsultativeOv = 1 · BRANCHES · code_  
Why they ask: THE RECOMMENDATION SCREEN. The code picks the first treatment, in the fixed order Ro Mane Spray, oral finasteride, oral minoxidil, whose no-recommend flag is not 1 and which is available in the patient's state. That one is shown first as recommended; the rest sit under 'Other treatment options'. The patient taps one; it goes into the cart and the clinician has the final say.  
Downstream: The pick decides which side-effect screen follows (3230 spray, 3240 finasteride, 3250 oral minoxidil) and whether the shipping screen offers an outside pharmacy (not for the compounded spray).

- `Ro Mane Spray (card: 'finasteride + minoxidil + tretinoin', 'Starting at $43/mo'; schema answer 'Select topical compounded spray')` → **Adds a product**: Clears the cart and adds Ro Mane Spray (hl-topical-spray-product); sets hasTopicalCompounded=1; next is the combined finasteride + minoxidil side-effect screen; shipping screen has no outside-pharmacy button. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride))_ _[code]_
- `Oral finasteride (card: 'Generic Propecia', 'Starting at $16/mo'; schema answer 'Select oral finasteride')` → **Adds a product**: Clears the cart and adds Finasteride 1 mg; sets hasFinasteride=1; next is the finasteride side-effect screen. _(affects: Oral finasteride 1 mg (generic Propecia))_ _[code]_
- `Oral minoxidil (card: 'Same active ingredient as Rogaine', 'Starting at $24/mo'; schema answer 'Select oral minoxidil')` → **Adds a product**: Clears the cart and adds oral minoxidil 2.5 mg; sets hasMinoxidil=1; next is the oral minoxidil side-effect screen. _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_

**56. Treatment Details**  
_info · after-account · role: expectation-setting · shown: experiment mhlConsultativeOv is off (older path; not live on the main link today) · no branch · code_  
Why they ask: Older path: 'Treatment Details' divider screen before the preference question.

- `Continue` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**57. Do you have a specific treatment for hair loss that you would prefer to be prescribed?**  
_single · after-account · role: product-selector · shown: experiment mhlConsultativeOv is off (older path; not live on the main link today) · no branch · code_  
Why they ask: Older two-product preference screen: finasteride tablets, oral minoxidil tablets, or no preference. The spray is not on it. Includes a 'Need help picking a treatment?' comparison pop-up.

- `Please tell the physician I don’t have a preference.` → **No effect**: No product is chosen by the patient ('I want my provider to determine the best treatment and plan for me.'). What then sits in the cart is not visible in the schema. _[code]_
- `Select finasteride` → **Adds a product**: Clears the cart and adds Finasteride 1 mg. Card note: 'Recommended for those interested in a multi-faceted approach to treating hair loss and would like to also use topical minoxidil (generic Rogaine).' _(affects: Oral finasteride 1 mg (generic Propecia))_ _[code]_
- `Select minoxidil` → **Adds a product**: Clears the cart and adds oral minoxidil 2.5 mg. Card note: 'May be preferred by men who do not want to risk the known (slight) chance of sexual side effects from taking finasteride.' _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ _[code]_

**58. Please take a moment to review the possible side effects of this medication.**  
_consent · after-account · role: consent · shown: Ro Mane Spray was picked (hasTopicalCompounded == 1), or nothing matched · no branch · code_  
Why they ask: Side-effect acknowledgement covering finasteride (psychological, sexual, persistence) and minoxidil (common and serious). Button: 'Got it, continue'.

- `Got it, continue` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**59. Please take a moment to review the possible side effects of this medication.**  
_consent · after-account · role: consent · shown: oral finasteride was picked (hasFinasteride == 1) · no branch · code_  
Why they ask: Side-effect acknowledgement for finasteride: may cause or worsen depression and anxiety; sexual side effects in about 4% vs 2% on placebo; possible persistence after stopping.

- `Got it, continue` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**60. Please take a moment to review the possible side effects of this medication.**  
_consent · after-account · role: consent · shown: oral minoxidil was picked (hasMinoxidil == 1) · no branch · code_  
Why they ask: Side-effect acknowledgement for oral minoxidil: low blood pressure, swelling, extra body hair; fluid retention, fast heart rate, fluid around the heart.

- `Got it, continue` → **No effect**: No flag and no stop in the schema; the answer is saved for the clinician. _[code]_

**61. Share a photo of yourself**  
_photo · after-account · role: identity · shown: no selfie on file and ID check not skipped (fork 4000) · no branch · code_  
Why they ask: Identity photo 1 of 2: a selfie. Can be skipped and done later in the account. Note: this is an identity photo, not a scalp photo; the men's schema has no scalp-photo step, although the FAQ says hair photos are requested.

- `Upload completed` → **Next question**: Goes on to the ID photo. _[code]_
- `skip` → **No effect**: Allowed: the visit continues; the clinician cannot prescribe until identity is verified. _[code]_

**62. Take a photo of your government-issued ID**  
_photo · after-account · role: identity · shown: no ID photo on file and ID check not skipped (fork 4020) · no branch · code_  
Why they ask: Identity photo 2 of 2: government ID. 'Skip for now' is offered.

- `submit id` → **Next question**: Goes on to shipping. _[code]_
- `skip` → **No effect**: Allowed ('Skip for now'); must be completed before a prescription. _[code]_

**63. Shipping Info**  
_contact · checkout · role: identity · shown: Ro Mane Spray was picked · no branch · code_  
Why they ask: Name and shipping address. Ro's own pharmacy only (no outside-pharmacy button for the compounded spray).


**64. Shipping Info**  
_contact · checkout · role: identity · shown: a tablet was picked · no branch · code_  
Why they ask: Name and shipping address, with an option to send the prescription to another pharmacy (price and free delivery then not guaranteed).


**65. Finalize your order [cart summary and payment]**  
_contact · checkout · role: data-capture · shown: always · no branch · code_  
Why they ask: Payment details. Delivery schedule is set to quarterly. Text: the card is not charged for prescription medicine until a clinician has reviewed and approved, typically within 24 hours.

- `Finish` → **Next question**: Submits the visit for clinician review (not done in this research). _[code]_

**66. Thank you**  
_info · checkout · role: expectation-setting · shown: always · no branch · code_  
Why they ask: Thank-you screen: answers go to a Ro-affiliated doctor; a phone or video call may be needed depending on state; treatment arrives in 3 to 5 days once prescribed.


**67. How can we help?**  
_info · after-account · role: eligibility-gate · shown: age under 18 · no branch · code_  
Why they ask: Exit screen for under-18s, with a comment form asking for an email.


**68. Be notified when we’re in your area!**  
_info · after-account · role: eligibility-gate · shown: zip code not served · no branch · code_  
Why they ask: Exit screen for unsupported areas, with a 'Be notified!' form.


**69. We have a better experience for you!**  
_info · after-account · role: eligibility-gate · shown: sex = female and redirect flag on · no branch · code_  
Why they ask: Hand-off to the women's visit.

- `Continue to women's hair loss visit` → **No effect**: Button link to the women's visit (/tefcyb). _[code]_

**70. How can we help?**  
_info · after-account · role: eligibility-gate · shown: sex = female and redirect flag off · no branch · code_  
Why they ask: Exit screen: treatment 'currently only available to men', with a comment form.


**71. Getting started with your hair loss visit. [Sign up with Email / Continue with Google / Log in and continue]**  
_contact · after-account · role: identity · shown: only on the Google Shopping entry (start.ro.co/escptw redirects to /fxdxbh/online-visit/7; isGSSchema == true) · no branch · observed_  
Why they ask: Alternative first screen: on this entry the account wall comes before any question; the goals questions are asked after sign-up.


### Women's hair-loss online visit (schema 'Derm Woman's Hair Loss Standard Onboarding', code derm-whl-onb, version 32)

Entry: https://start.ro.co/tefcyb/

3 or 4 anonymous hair questions (how long, how it started, where, part-line picture) -> ACCOUNT WALL (sign up with email or Google) -> basics (birth date, sex, zip, phone) -> pregnancy (stop), breastfeeding, recent birth -> severity, shedding vs thinning, shedding picture, scalp symptoms, family history, confidence and stress scores -> past evaluation -> diagnosed scalp conditions (stop) -> hormonal signs (stop) -> last-year triggers -> conditions (stop / tablet removed) -> low blood pressure -> past treatments and minoxidil allergy (stops) -> other conditions, surgeries, medicines, allergies -> ethnicity (optional) -> scalp photos -> product fork (choice of tablet or topical, topical only, or stop) -> side effects -> shipping -> payment -> clinician review. Everything after the wall is from the publicly served schema, not walked.

**1. Firstly, how long have you been experiencing hair loss?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Duration of hair loss. Stored in a variable (hairLossExperience) that no fork rule reads, so it informs the clinician only.

- `Months` → **No effect**: Sets hairLossExperience='months'. No fork rule reads it; no effect on what is offered. _[code]_
- `Within the last year` → **No effect**: Sets hairLossExperience='withinTheLastYear'. No fork rule reads it; no effect on what is offered. _[code]_
- `More than a year` → **No effect**: Sets hairLossExperience='moreThanAYear'. No fork rule reads it; no effect on what is offered. _[code]_

**2. How did your hair loss start?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Speed of onset. Unlike the men's visit, 'Suddenly' has no flag or highlight here.

- `Suddenly` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Gradually` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Not sure` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**3. Where on your head have you noticed hair loss?**  
_multi · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Where the loss is. Top-of-head or all-over loss adds the part-line picture question.  
Downstream: 'Top of head/crown' or 'All over' -> part-line picture question (qid 10). Temples or frontal scalp only -> straight to sign-up.

- `Top of head/crown` → **Adds questions**: Sets ifTopOfHead=1: adds the question 'Which picture most closely resembles your part line?' (seen in runs/baseline-women). No effect on what is offered. _[observed]_
- `Temples` → **No effect**: No variable; the part-line question is skipped unless top of head is also ticked. Highlighted 'ack-clinical' for the clinician. _[code]_
- `Frontal scalp` → **No effect**: No variable; the part-line question is skipped unless top of head is also ticked. Highlighted 'ack-clinical' for the clinician. _[code]_
- `All over` → **Adds questions**: Exclusive answer. Sets ifAllOver=1: adds the part-line picture question. No effect on what is offered. _[code]_

**4. Which picture most closely resembles your part line?**  
_single · anonymous · role: diagnosis · shown: qid 8 includes 'Top of head/crown' or 'All over' · no branch · observed_  
Why they ask: Five pictures of a widening parting (image alt texts: Normal, Slightly Wide, Wider, Very Wide, Extremely Wide Hair Part), in effect a Ludwig-style severity scale. No option changes the engine.

- `1` → **No effect**: Picture 1 of 5 (Normal Hair Part). No variable, no branch; saved for the clinician. _[code]_
- `2` → **No effect**: Picture 2 of 5 (Slightly Wide Hair Part). No variable, no branch; saved for the clinician. _[code]_
- `3` → **No effect**: Picture 3 of 5 (Wider Hair Part). No variable, no branch; saved for the clinician. _[code]_
- `4` → **No effect**: Picture 4 of 5 (Very Wide Hair Part). No variable, no branch; saved for the clinician. _[code]_
- `5` → **No effect**: Picture 5 of 5 (Extremely Wide Hair Part). No variable, no branch; saved for the clinician. _[code]_

**5. Thanks for sharing. Ready to go deeper? Next, you’ll tell your provider about your health, medical history, and lifestyle. Your provider will use this information to evaluate your symptoms and, if appropriate, prescribe medication for treatment. [Sign up with Email / Continue with Google / Already a member? Log in and continue]**  
_contact · anonymous · role: identity · shown: always · no branch · observed_  
Why they ask: ACCOUNT WALL. Shown after 3 or 4 hair questions and before any medical question. No product, price or recommendation is shown before it.


**6. Log in**  
_contact · after-account · role: identity · shown: the email already belongs to a member · no branch · code_  
Why they ask: Log-in screen for existing members.


**7. The Basics [form: Birthdate, Sex Assigned at Birth, Zip code, Phone number]**  
_contact · after-account · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Identity and three hard gates: age (minAge 18), sex (allowedGenders: female) and whether Ro serves the zip code. The age is also kept as userAge and used at the end (over 65 = no oral minoxidil).  
Downstream: Under 18 -> exit 6010. Male -> redirect offer to the men's visit (6030). Unsupported zip -> exit 6000.

- `(engine outcome) Under 18 yo` → **Stops the patient**: Hard stop: 'Unfortunately we are not currently able to treat anyone under the age of 18 on our platform.' _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `(engine outcome) Male` → **Stops the patient**: Leaves the women's visit: 'Want to be redirected to the men's hair loss visit?' with a button to start.ro.co/fxdxbh. _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `(engine outcome) Not supported zip code` → **Stops the patient**: Hard stop: 'Be notified when we’re in your state!' _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `(engine outcome) Next` → **Next question**: Continues. userAge over 65 later removes oral minoxidil (fork 4020) and, combined with topical ineligibility, stops the visit (fork 1159). _[code]_

**8. Let’s talk about your medical history**  
_info · after-account · role: expectation-setting · shown: always · no branch · code_  
Why they ask: Divider screen introducing the medical history section.

- `Continue` → **Next question**: Continues. _[code]_

**9. Are you pregnant, or possibly pregnant?**  
_single · after-account · role: eligibility-gate · shown: always · no branch · code_  
Why they ask: Pregnancy gate. 'Yes' and 'Not sure' both end the visit.

- `Yes` → **Stops the patient**: Hard stop. The visit ends on the screen 'Unfortunately, our treatments are not available for use during pregnancy.' The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `No` → **Next question**: Continues to the breastfeeding question. _[code]_
- `Not sure` → **Stops the patient**: Hard stop. The visit ends on the screen 'Unfortunately, our treatments are not available for use during pregnancy.' The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_

**10. Are you currently breastfeeding?**  
_single · after-account · role: product-selector · shown: always · no branch · code_  
Why they ask: Breastfeeding rules out oral minoxidil but not the topical.

- `Yes` → **Removes a product**: Sets ifNotEligibleForOralMinoxidil=1. Oral minoxidil is no longer offered: at the end the patient skips the choice screen and is shown Hair Solution Rx as the only treatment (qid 4030). No stop. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Women's oral minoxidil (low dose))_ _[code]_
- `No` → **No effect**: No effect. _[code]_

**11. Have you given birth in the last year?**  
_single · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Recent childbirth (postpartum shedding). Flag only.

- `Yes` → **Flags for the clinician**: No engine effect. The flow carries on. The schema also marks this answer highlight='ack-clinical' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `No` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**12. How would you describe the severity of your current hair loss?**  
_single · after-account · role: data-capture · shown: always · no branch · code_  
Why they ask: Self-rated severity, tracked over time. No engine effect.

- `Very Mild` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Mild` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Moderate` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Severe` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Extremely severe` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**13. How would you describe your hair loss?**  
_single · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Shedding versus gradual thinning (telogen effluvium versus female-pattern loss). No engine effect; for the clinician.

- `I’m shedding more hair than is normal for me (I notice more fallout in the shower, on my pillow, etc.)` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `My hair is gradually thinning (I’m slowly noticing more of my scalp showing through or my scalp seems wider or my ponytail is thinner)` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Both` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Unsure` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**14. Which picture most closely resembles how much hair you are losing per day?**  
_single · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Five pictures of daily shed hair (image alt texts: Few strands, Some strands, Many strands, Clump of hair, Extreme amount of hair). No engine effect.

- `1` → **No effect**: Picture 1 of 5 (Few strands of hair). No variable, no branch; saved for the clinician. _[code]_
- `2` → **No effect**: Picture 2 of 5 (Some strands of hair). No variable, no branch; saved for the clinician. _[code]_
- `3` → **No effect**: Picture 3 of 5 (Many strands of hair). No variable, no branch; saved for the clinician. _[code]_
- `4` → **No effect**: Picture 4 of 5 (Clump of hair). No variable, no branch; saved for the clinician. _[code]_
- `5` → **No effect**: Picture 5 of 5 (Extreme amount of hair). No variable, no branch; saved for the clinician. _[code]_

**15. Have you noticed any of the following?**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Scalp red flags (patches, pain, redness, sores, eyebrow or eyelash loss). In the women's schema these are highlights only: none stops the visit or removes a product.

- `A patch or patches of hair loss that is nearly or completely bald` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `Pain, soreness, burning, and/or tingling in areas of hair loss` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `Redness or rashes on scalp` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `Recurrent pus bumps or open sores on scalp` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `Partial or complete loss of eyebrows or eyelashes` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `None of the above` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**16. Do you have any family history of hair thinning or balding (parents, siblings, grandparents, aunts, uncles)? Consider both sides of the family.**  
_single · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Family history. Flag only.

- `Yes` → **Flags for the clinician**: No engine effect. The flow carries on. The schema also marks this answer highlight='ack-clinical' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `No` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `I don't know` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**17. To what extent has your hair been negatively affecting your self-confidence?**  
_single · after-account · role: data-capture · shown: always · no branch · code_  
Why they ask: Outcome measure: effect on self-confidence (1 to 5), tracked over time.

- `1 - Not at all` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `2 - A little bit` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `3 - Somewhat` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `4 - Quite a bit` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `5 - A lot` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**18. Hair loss can be stressful. How much is your hair loss affecting your overall stress levels?**  
_single · after-account · role: data-capture · shown: always · no branch · code_  
Why they ask: Outcome measure: effect on stress (1 to 5), tracked over time.

- `1 - Not at all` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `2 - A little bit` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `3 - Somewhat` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `4 - Quite a bit` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `5 - A lot` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**19. Have you ever been evaluated for hair loss in the past?**  
_single · after-account · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Previous medical evaluation of the hair loss.  
Downstream: 'Yes' opens a free-text box (qid 1084).

- `Yes` → **Adds questions**: Opens a free-text box: 'Please share more details: How long ago and were any lab tests done? Did the doctor remove a small piece of your scalp skin for testing (scalp biopsy)? Did you receive a diagnosis?' No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `No` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**20. Please share more details: How long ago and were any lab tests done? Did the doctor remove a small piece of your scalp skin for testing (scalp biopsy)? Did you receive a diagnosis?**  
_text · after-account · role: data-capture · shown: qid 1083 = 'Yes' · no branch · code_  
Why they ask: Free text about earlier evaluation, tests, biopsy and diagnosis.


**21. Have you ever been diagnosed with any of the following scalp conditions?**  
_multi · after-account · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Diagnosed scalp conditions. ANY listed diagnosis ends the visit (fork 1087 only lets 'None of the above' through).  
Downstream: Anything except 'None of the above' -> stop screen 6040.

- `Alopecia areata` → **Stops the patient**: Hard stop (fork 1087: only 'None of the above' continues). The visit ends on 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist…' _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `Lichen planopilaris` → **Stops the patient**: Hard stop (fork 1087: only 'None of the above' continues). The visit ends on 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist…' _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `Frontal fibrosing alopecia (FFA)` → **Stops the patient**: Hard stop (fork 1087: only 'None of the above' continues). The visit ends on 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist…' _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `Central centrifugal cicatricial alopecia (CCCA)` → **Stops the patient**: Hard stop (fork 1087: only 'None of the above' continues). The visit ends on 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist…' _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `Traction alopecia` → **Stops the patient**: Hard stop (fork 1087: only 'None of the above' continues). The visit ends on 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist…' _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `Lupus` → **Stops the patient**: Hard stop (fork 1087: only 'None of the above' continues). The visit ends on 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist…' _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `None of the above` → **Next question**: Sets ifNotDiagnosedWithAnyScalpConditions=1 and continues. _[code]_

**22. Do you have any of the following? Select all that apply.**  
_multi · after-account · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Signs of a hormonal cause. Three signs of virilisation or raised prolactin end the visit; hirsutism, acne and irregular periods do not.  
Downstream: Clitoral enlargement, nipple discharge or voice deepening -> stop screen 6040 (fork 1091).

- `Excess body hair on chest, abdomen, back` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Excess facial hair` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Severe acne` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Irregular periods` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Enlargement of the clitoris` → **Stops the patient**: Sets ifHairLossHormonalRelated=1 -> hard stop on the 'unable to evaluate and treat… visit an in-person dermatologist' screen (fork 1091). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `Discharge from the nipple(s)` → **Stops the patient**: Sets ifHairLossHormonalRelated=1 -> hard stop on the 'unable to evaluate and treat… visit an in-person dermatologist' screen (fork 1091). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `Deepening of your voice` → **Stops the patient**: Sets ifHairLossHormonalRelated=1 -> hard stop on the 'unable to evaluate and treat… visit an in-person dermatologist' screen (fork 1091). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `None of the above` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**23. Have you experienced any of the following in the last year?**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Triggers for shedding in the last year (menopause, weight loss, illness, stress, hormonal contraception changes, chemotherapy, surgery). No engine effect; for the clinician.

- `Gone through perimenopause or menopause` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Significant weight loss` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Flare of a chronic disease` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Hospitalization` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Major illness (e.g. COVID)` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Major life stressor (e.g. moving, job loss, ending a relationship, or a loved one's passing)` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Started, stopped, or changed birth control pills or any other kind of hormonal contraception (e.g. IUD, patch, ring, implant, injection) or started or stopped any other kind of hormonal treatment` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Received chemotherapy as part of cancer treatment` → **Flags for the clinician**: No engine effect. The flow carries on. The schema also marks this answer highlight='ack-clinical' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `Major surgery` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `None of the above` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**24. Do you have, or have you ever had, any of the following conditions?**  
_multi · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Medical history. Cardiovascular conditions and high blood pressure rule out oral minoxidil; lupus or another autoimmune disorder rules out both products and ends the visit; the rest open free-text follow-ups.  
Downstream: Each ticked condition opens its own free-text follow-up (forks 1159 to 1181). Fork 1159 stops the visit if topical is ruled out and (oral is ruled out or age is over 65).

- `Heart condition (coronary artery disease, angina/chest pain, heart failure, heart attack, pericarditis)` → **Removes a product**: Opens a free-text box: 'Please describe your heart related condition(s).' Sets ifNotEligibleForOralMinoxidil=1. Oral minoxidil is no longer offered: at the end the patient skips the choice screen and is shown Hair Solution Rx as the only treatment (qid 4030). No stop. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Women's oral minoxidil (low dose))_ _[code]_
- `Stroke` → **Removes a product**: Opens a free-text box: 'Please tell us more about your stroke.' Sets ifNotEligibleForOralMinoxidil=1. Oral minoxidil is no longer offered: at the end the patient skips the choice screen and is shown Hair Solution Rx as the only treatment (qid 4030). No stop. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Women's oral minoxidil (low dose))_ _[code]_
- `Kidney disease` → **Adds questions**: Opens a free-text box: 'Please tell us more about your kidney disease.' No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Liver disease` → **Adds questions**: Opens a free-text box: 'Please tell us more about your liver disease.' No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Thyroid disorder` → **Adds questions**: Opens a free-text box: 'Please describe your thyroid condition and let us know if you’re currently receiving treatment.' No engine effect. The flow carries on. The schema also marks this answer highlight='ack-clinical' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Anemia (low red blood cell count)` → **Adds questions**: Opens a free-text box: 'Please describe your condition and let us know if you’re currently anemic.' No engine effect. The flow carries on. The schema also marks this answer highlight='ack-clinical' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Iron deficiency` → **Adds questions**: Opens a free-text box: 'Please let us know when you were diagnosed with iron deficiency and if you’re currently taking iron supplements' No engine effect. The flow carries on. The schema also marks this answer highlight='ack-clinical' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Polycystic ovary disease` → **Adds questions**: Opens a free-text box: 'Please let us know when you were diagnosed with PCOS and if you’re currently receiving treatment.' No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Lupus or other autoimmune disorder` → **Stops the patient**: Sets both ifNotEligibleForOralMinoxidil and ifNotEligibleForTopicalMinoxidil; the next fork (1159) sends the patient to the stop screen. Hard stop. The visit ends on the screen 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist…' The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `Pheochromocytoma (adrenal gland tumor)` → **Removes a product**: Opens a free-text box: 'Please tell us more about your pheochromocytoma.' Sets ifNotEligibleForOralMinoxidil=1. Oral minoxidil is no longer offered: at the end the patient skips the choice screen and is shown Hair Solution Rx as the only treatment (qid 4030). No stop. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Women's oral minoxidil (low dose))_ _[code]_
- `Pulmonary hypertension` → **Removes a product**: Opens a free-text box: 'Please tell us more about your pulmonary hypertension.' Sets ifNotEligibleForOralMinoxidil=1. Oral minoxidil is no longer offered: at the end the patient skips the choice screen and is shown Hair Solution Rx as the only treatment (qid 4030). No stop. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Women's oral minoxidil (low dose))_ _[code]_
- `High blood pressure` → **Removes a product**: Opens a free-text box: 'Please let us know when you were diagnosed, and whether you have taken or are currently taking any medication(s) to control your blood pressure. Please include medication names and dosages.' Sets ifNotEligibleForOralMinoxidil=1. Oral minoxidil is no longer offered: at the end the patient skips the choice screen and is shown Hair Solution Rx as the only treatment (qid 4030). No stop. The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Women's oral minoxidil (low dose))_ _[code]_
- `None of the above` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**25. Please describe your heart related condition(s).**  
_text · after-account · role: data-capture · shown: qid 1096 includes the heart condition answer · no branch · code_  
Why they ask: Free text about the heart condition.


**26. Please tell us more about your stroke.**  
_text · after-account · role: data-capture · shown: qid 1096 includes 'Stroke' · no branch · code_  
Why they ask: Free text about the stroke.


**27. Please tell us more about your kidney disease.**  
_text · after-account · role: data-capture · shown: qid 1096 includes 'Kidney disease' · no branch · code_  
Why they ask: Free text about kidney disease.


**28. Please tell us more about your liver disease.**  
_text · after-account · role: data-capture · shown: qid 1096 includes 'Liver disease' · no branch · code_  
Why they ask: Free text about liver disease.


**29. Please describe your condition and let us know if you’re currently anemic.**  
_text · after-account · role: data-capture · shown: qid 1096 includes 'Anemia' · no branch · code_  
Why they ask: Free text about anaemia.


**30. Please let us know when you were diagnosed with iron deficiency and if you’re currently taking iron supplements**  
_text · after-account · role: data-capture · shown: qid 1096 includes 'Iron deficiency' · no branch · code_  
Why they ask: Free text about iron deficiency and supplements.


**31. Please describe your thyroid condition and let us know if you’re currently receiving treatment.**  
_text · after-account · role: data-capture · shown: qid 1096 includes 'Thyroid disorder' · no branch · code_  
Why they ask: Free text about the thyroid condition.


**32. Please let us know when you were diagnosed with PCOS and if you’re currently receiving treatment.**  
_text · after-account · role: data-capture · shown: qid 1096 includes 'Polycystic ovary disease' · no branch · code_  
Why they ask: Free text about PCOS.


**33. Please tell us more about your lupus or other autoimmune disorder.**  
_text · after-account · role: data-capture · shown: qid 1096 includes 'Lupus or other autoimmune disorder' (in practice not reached: that answer already stops the visit at fork 1159) · no branch · code_  
Why they ask: Free text about lupus or autoimmune disease.


**34. Please tell us more about your pheochromocytoma.**  
_text · after-account · role: data-capture · shown: qid 1096 includes 'Pheochromocytoma' · no branch · code_  
Why they ask: Free text about phaeochromocytoma.


**35. Please tell us more about your pulmonary hypertension.**  
_text · after-account · role: data-capture · shown: qid 1096 includes 'Pulmonary hypertension' · no branch · code_  
Why they ask: Free text about pulmonary hypertension.


**36. Please let us know when you were diagnosed, and whether you have taken or are currently taking any medication(s) to control your blood pressure. Please include medication names and dosages.**  
_text · after-account · role: data-capture · shown: qid 1096 includes 'High blood pressure' · no branch · code_  
Why they ask: Free text about blood pressure diagnosis and medicines.


**37. Have you ever been told that you have low blood pressure?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Low blood pressure history. Unlike high blood pressure it does not remove oral minoxidil in the schema; flag and free text only.  
Downstream: 'Yes' opens a free-text box (qid 1186).

- `Yes` → **Adds questions**: Opens a free-text box: 'Please tell us more, including whether you’ve ever had any symptoms of low blood pressure, such as fainting or feeling lightheaded or dizzy (particularly when getting up from a sitting position).' No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `No` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**38. Please tell us more, including whether you’ve ever had any symptoms of low blood pressure, such as fainting or feeling lightheaded or dizzy (particularly when getting up from a sitting position).**  
_text · after-account · role: data-capture · shown: qid 1185 = 'Yes' · no branch · code_  
Why they ask: Free text about low blood pressure symptoms.


**39. Which of the following treatments, if any, have you used to treat your hair loss in the past?**  
_multi · after-account · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Past hair-loss treatments. Steroid injections end the visit (a sign of another diagnosis); past minoxidil opens allergy questions.  
Downstream: Steroid injections -> stop screen (fork 1251). Oral minoxidil -> allergy question 1254. Topical minoxidil -> allergy question 1256.

- `Spironolactone` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Oral minoxidil` → **Adds questions**: Opens 'As far as you know, do you have an allergy to oral minoxidil?'. No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Topical minoxidil` → **Adds questions**: Opens 'As far as you know, do you have an allergy to topical minoxidil?'. No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_
- `Steroid injections into the scalp` → **Stops the patient**: Sets ifPastTreatmentsIncludeSteroidInjections=1 -> hard stop on the 'unable to evaluate and treat… visit an in-person dermatologist' screen (fork 1251). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `Oral supplements (e.g. Biotin, Nutrafol, Viviscal)` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Other` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `None of the above` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**40. As far as you know, do you have an allergy to oral minoxidil?**  
_single · after-account · role: eligibility-gate · shown: qid 1250 includes 'Oral minoxidil' · no branch · code_  
Why they ask: Minoxidil allergy. 'Yes' ends the whole visit (not just the tablet), because both products contain minoxidil.

- `Yes` → **Stops the patient**: Hard stop. The visit ends on the screen 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist…' _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `No` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Unsure` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**41. As far as you know, do you have an allergy to topical minoxidil?**  
_single · after-account · role: eligibility-gate · shown: qid 1250 includes 'Topical minoxidil' · BRANCHES · code_  
Why they ask: Topical minoxidil allergy; 'Yes' asks which form.  
Downstream: 'Yes' opens the foam / liquid question (qid 1258).

- `Yes` → **Adds questions**: Opens 'What form of topical minoxidil did you have an allergic reaction to?'. No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `No` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Unsure` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_

**42. What form of topical minoxidil did you have an allergic reaction to?**  
_single · after-account · role: eligibility-gate · shown: qid 1256 = 'Yes' · no branch · code_  
Why they ask: Separates a reaction to the liquid (often the propylene glycol vehicle: inferred) from a reaction to foam or both, which is read as true minoxidil allergy and ends the visit.

- `Foam` → **Stops the patient**: Hard stop. The visit ends on the screen 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist…' The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_
- `Liquid` → **Flags for the clinician**: No engine variable changes and no stop. The flow carries on. The schema also marks this answer highlight='caution' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[inferred]_
- `Both` → **Stops the patient**: Hard stop. The visit ends on the screen 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist…' The schema also marks this answer highlight='negative' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ _[code]_

**43. Search and select any medical problems or conditions that you currently have.**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Any other current medical conditions, picked from a searchable list (StructuredConditions). No schema rule depends on it.

- `I have conditions` → **Flags for the clinician**: Patient searches and selects conditions. No schema variable or branch depends on it; goes to the clinician. _[inferred]_
- `I don't have any conditions` → **No effect**: No effect on the flow. _[code]_

**44. Have you had any past surgeries or procedures?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Past surgeries or procedures.  
Downstream: 'Yes' opens a free-text list (qid 1627).

- `No` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. _[code]_
- `Yes` → **Adds questions**: Opens a free-text box: 'Please list your past surgeries and procedures.' No engine effect. The flow carries on. The schema also marks this answer highlight='ack-clinical' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician). _[code]_

**45. Please list your past surgeries and procedures.**  
_text · after-account · role: data-capture · shown: qid 1626 = 'Yes' · no branch · code_  
Why they ask: Free-text list of surgeries and procedures.


**46. Search and select any medications, vitamins, dietary supplements, and topical creams you are currently taking or using.**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Current medicines, vitamins, supplements and creams from a searchable list. No schema rule depends on it.

- `I’m taking medications` → **Flags for the clinician**: Patient searches and selects each medicine. No schema variable or branch depends on it; goes to the clinician. _[inferred]_
- `I don't take any medications` → **No effect**: No effect on the flow. _[code]_

**47. Search and select all allergies you have**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Allergies from a searchable list. No schema rule depends on it.

- `I have allergies` → **Flags for the clinician**: Patient searches and selects allergies. No schema variable or branch depends on it; highlighted 'caution' for the clinician. _[inferred]_
- `I don't have allergies` → **No effect**: No effect on the flow. _[code]_

**48. How would you describe yourself? Select all that apply.**  
_multi · after-account · role: data-capture · shown: always · BRANCHES · code_  
Why they ask: Optional race and ethnicity question for equity monitoring; the text says it does not affect treatment.  
Downstream: 'Other' opens a free-text box (qid 2202).

- `White` → **No effect**: No engine effect. _[code]_
- `Hispanic or Latino` → **No effect**: No engine effect. _[code]_
- `Black or African American` → **No effect**: No engine effect. _[code]_
- `Native American or American Indian` → **No effect**: No engine effect. _[code]_
- `Asian / Pacific Islander` → **No effect**: No engine effect. _[code]_
- `Other` → **Adds questions**: Sets followupOther=1 and opens 'Please list your ethnicity.' No effect on treatment. _[code]_
- `I prefer not to answer` → **No effect**: No engine effect. _[code]_

**49. Please list your ethnicity.**  
_text · after-account · role: data-capture · shown: qid 2200 includes 'Other' · no branch · code_  
Why they ask: Free-text ethnicity.


**50. One last thing, {firstName}**  
_photo · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Scalp photos: 'take photos of different areas and angles of your head' for the clinician. (The men's schema has no scalp-photo step.)


**51. Is there a specific type of hair loss treatment you’d like to be prescribed?**  
_single · after-account · role: product-selector · shown: fork 4020 falls through: eligible for oral minoxidil, eligible for topical, and age not over 65 · BRANCHES · code_  
Why they ask: THE PRODUCT CHOICE. Eligible patients choose between the tablet and the topical, or leave it to the provider. The engine does not rank them by hair pattern or severity.  
Downstream: Oral minoxidil -> recommendation card 4040 and side-effect screen 4042. Hair Solution Rx -> card 4030. No preference -> straight to shipping with oral minoxidil in the cart.

- `Oral Minoxidil` → **Adds a product**: Clears the cart, adds women's oral minoxidil, quarterly delivery. Card: 'An oral tablet. Recommended for patients who prefer to take a once-daily medication instead of applying a topical treatment.' $30 a month. Then a side-effect acknowledgement screen. _(affects: Women's oral minoxidil (low dose))_ _[code]_
- `Hair Solution Rx` → **Adds a product**: Clears the cart, adds Hair Solution Rx, quarterly delivery. Card: 'A topical made with minoxidil, tretinoin, and melatonin. Recommended for patients who prefer to apply a treatment to their scalp instead of taking oral medication.' $40 a month. Shipping screen has no outside-pharmacy option. _(affects: Hair Solution Rx (women's compounded topical))_ _[code]_
- `No preference` → **Adds a product**: Adds oral minoxidil to the cart by default: 'If you select this option, you'll see oral minoxidil on the checkout screen. Your provider will determine the best treatment for you and will reach out if another treatment is more suitable.' _(affects: Women's oral minoxidil (low dose))_ _[code]_

**52. Thanks for providing all the information {firstName} [product card: Hair Solution Rx. 'Your doctor will review your information to see if you are a good candidate for Hair Solution Rx.']**  
_info · after-account · role: product-selector · shown: Hair Solution Rx chosen at 4025, OR forced by fork 4020 when oral minoxidil is ruled out or age is over 65 (and topical is allowed) · no branch · code_  
Why they ask: Single-product recommendation card for the topical. Adds Hair Solution Rx to the cart.


**53. Thanks for providing all the information {firstName} [product card: Oral Minoxidil. 'Your doctor will review your information to see if you are a good candidate for Oral Minoxidil']**  
_info · after-account · role: product-selector · shown: oral minoxidil chosen at 4025, OR forced by fork 4020 when topical is ruled out but oral is allowed and age is under 65 (not reachable in practice: the only answer that rules out topical also rules out oral) · no branch · code_  
Why they ask: Single-product recommendation card for the tablet. Adds oral minoxidil to the cart.


**54. Please take a moment to understand the possible side effects of this medication.**  
_consent · after-account · role: consent · shown: after the oral minoxidil card (qid 4040) · no branch · code_  
Why they ask: Side-effect acknowledgement for oral minoxidil ('Got it').

- `Got it` → **Next question**: Continues to shipping. _[code]_

**55. Shipping Info**  
_contact · checkout · role: identity · shown: oral minoxidil in the cart · no branch · code_  
Why they ask: Shipping address, with the option of an outside pharmacy.


**56. Shipping Info**  
_contact · checkout · role: identity · shown: Hair Solution Rx in the cart · no branch · code_  
Why they ask: Shipping address; Ro's pharmacy only.


**57. Review treatment and pay [shipping frequency, cart summary, payment]**  
_contact · checkout · role: data-capture · shown: always · no branch · code_  
Why they ask: Payment details. 'You won’t be charged for any prescription medication until this review is completed and you have been approved for treatment. This review typically occurs within 24 hours.'

- `Finish` → **Next question**: Submits the visit for clinician review (not done in this research). _[code]_

**58. Thank You**  
_info · checkout · role: expectation-setting · shown: always · no branch · code_  
Why they ask: Thank-you screen and next steps (ID verification, possible phone or video call, shipment).


**59. Be notified when we’re in your state!**  
_info · after-account · role: eligibility-gate · shown: zip code not served · no branch · code_  
Why they ask: Exit: 'Be notified when we’re in your state!'


**60. Unfortunately we are not currently able to treat anyone under the age of 18 on our platform.**  
_info · after-account · role: eligibility-gate · shown: age under 18 · no branch · code_  
Why they ask: Exit for under-18s: 'Please discuss your hair loss concerns with your healthcare provider.'

- `Got it` → **No effect**: Button link to ro.co/derm. _[code]_

**61. Unfortunately, our treatments are not available for use during pregnancy.**  
_info · after-account · role: eligibility-gate · shown: pregnant or not sure · no branch · code_  
Why they ask: Exit for pregnancy.

- `Got it` → **No effect**: Button link to ro.co/derm. _[code]_

**62. Want to be redirected to the men's hair loss visit?**  
_info · after-account · role: eligibility-gate · shown: sex = male · no branch · code_  
Why they ask: Hand-off to the men's visit.

- `Continue to men's hair loss visit` → **No effect**: Button link to start.ro.co/fxdxbh. _[code]_

**63. Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist for further assessment and treatment.**  
_info · after-account · role: eligibility-gate · shown: any diagnosed scalp condition; virilisation signs; lupus or autoimmune disorder; topical ruled out and (oral ruled out or age over 65); past steroid injections; oral minoxidil allergy; topical minoxidil allergy to foam or both · no branch · code_  
Why they ask: The medical stop screen: refer to an in-person dermatologist (links to find-a-derm.aad.org).

- `Got it` → **No effect**: Button link to ro.co/derm. _[code]_

### Direct purchase flows with no medical questions (topical minoxidil 5%, Revive Shampoo, Restore Conditioner)

Entry: https://start.ro.co/vwayzg/

Topical minoxidil (start.ro.co/vwayzg, schema hl-onb-intent): the first screen is already the ACCOUNT WALL ('Your Account': sign up with email or Google) beside a cart summary; then payment. Shampoo (start.ro.co/kwrssq, schema restr-sha-onb-intent) and conditioner (start.ro.co/qcalmd, schema restr-con-onb-intent): one plan screen with Continue -> account wall -> payment. No age, sex or health question in any of the three schemas.

**1. Your Account. Ro takes your security very seriously and encrypts all of your information, meaning that your confidential data is handled securely. [Log in and continue / Sign up with Email / Continue with Google] [cart: Minoxidil Topical Solution, 60mL · 5%, 1 x per month · 3 month plan ($16/mo) · $48 · Shipping Included · Total $48]**  
_contact · anonymous · role: identity · shown: entry start.ro.co/vwayzg · no branch · observed_  
Why they ask: Topical minoxidil 'Buy now': account wall on the very first screen, with the price already shown. No questions at all.


**2. Revive Shampoo. Cleanse & Thicken. Enriched with saw palmetto, pumpkin seed oil, salicylic acid, and caffeine to cleanse the scalp for thicker-looking hair-8 oz, peppermint scented. 3-Month Plan $24 /3 mo. Your plan will be billed and shipped every 3 months. You’ll receive a 3-month (90–day) supply in each shipment. Modify or cancel your plan at any time.**  
_info · anonymous · role: marketing · shown: entry start.ro.co/kwrssq · no branch · observed_  
Why they ask: Shampoo plan screen: one plan, one price, then the account wall.

- `Continue` → **Next question**: Goes to the 'Your Account' sign-up screen (account wall), then payment with Restore Conditioner offered as a 'Popular add-on'. _(affects: Ro Revive Shampoo (8 oz))_ _[code]_

**3. Restore Conditioner. Fortify & Thicken. Formulated with targeted plant proteins, coconut oil, and shea butter to fortify and moisturize for thicker-looking hair. 8 oz, peppermint scented. 3-Month Plan $24 /3 mo. Your plan will be billed and shipped every 3 months. You’ll receive a 3-month (90–day) supply in each shipment. Modify or cancel your plan at any time.**  
_info · anonymous · role: marketing · shown: entry start.ro.co/qcalmd · no branch · observed_  
Why they ask: Conditioner plan screen: one plan, one price, then the account wall.

- `Continue` → **Next question**: Goes to the 'Your Account' sign-up screen (account wall), then payment. _(affects: Ro Restore Conditioner (8 oz))_ _[code]_

## 7. Competitive read

**Strengths**

- Very short path to sign-up (3 to 4 easy questions), with the heavy medical questions kept until after the email is captured.
- Men's safety questions are detailed for oral minoxidil (blood pressure follow-ups with a visual chart, timed heart attack, stroke and bypass questions, arrhythmia types, resting heart rate).
- Women's visit screens hard for other diagnoses (scarring alopecias, virilisation, pregnancy) and collects scalp photos and outcome scores.
- Clear public pricing page with a price for every plan length; no charge until a clinician approves.
- Recommendation screen still lets the patient choose, with the clinician as the final check.

**Weaknesses**

- Men's engine recommends the same product (the highest-priced compounded spray) to every unflagged man, whatever his goals, pattern or severity.
- Men are never stopped: patchy loss, sudden loss, scalp inflammation and liver failure all still reach checkout, relying entirely on the clinician.
- Schema quirks: prostate cancer steers a man towards finasteride tablets; heart conditions flag oral minoxidil but leave the 6% minoxidil spray recommended; the men's visit has no scalp-photo step although the FAQ says photos are requested.
- Women's product choice ignores pattern and severity; 'no preference' defaults to the oral, off-label, boxed-warning tablet.
- Public pages disagree with each other (hair-loss FAQ still says finasteride is the only prescription option; women's page says billed every 2 months while pricing says quarterly).

**Gaps a new competitor could use**

- A recommendation that visibly uses the answers already collected (pattern, severity, goals, preference for tablet or topical) rather than a fixed product order.
- Show an indicative treatment and price before asking for an email.
- Explicit, explained stop or 'see a doctor first' screens for red-flag hair loss in men, as Ro already does for women.
- Monthly or flexible plans: Ro's hair products are quarterly or longer only.
- A licensed-product-first pathway with compounded products as a clearly explained second step.

## 10. Limits of this report

- Nothing after the account wall was seen live. Post-wall questions, rules and recommendations are read from the served schema and JS; the real screens may differ in small ways (for example how a multi-select with options pointing to different next questions is routed).
- What the clinician actually prescribes, and how often the patient's pick is overridden, cannot be known from public information.
- Server-side checks (drug-interaction checks, state rules for compounded products, identity checks) are only visible as flags and function names.
- The meaning of the 'highlight' labels on answers (negative, caution, ack-clinical) is inferred: no patient-facing use was found in the code.
- The women's product catalogue JSON (strengths, plan lengths) is not fetched before the wall, so women's strengths and prices come from the schema text and the pricing page only.
- The site runs A/B experiments; the consultative men's flow is set to 100% today (config saved), but schemas and versions change (men v77, women v32 on the check date).
- Prices are US dollars and US plan structures; legal categories are US ones (Rx, OTC, compounded), not UK ones.

## 11. Sources

- [Ro hair loss (men) landing page](https://ro.co/hair-loss/)
- [Ro women's hair loss landing page](https://ro.co/womens-hair-loss/)
- [Ro pricing (all hair-loss plan prices)](https://ro.co/pricing/)
- [Ro Mane Spray product page](https://ro.co/medications/ro-mane-spray/)
- [Finasteride product page](https://ro.co/medications/finasteride/)
- [Oral minoxidil product page (men)](https://ro.co/medications/oral-minoxidil/)
- [Topical minoxidil product page](https://ro.co/medications/minoxidil/)
- [Women's oral minoxidil product page](https://ro.co/medications/womens-oral-minoxidil/)
- [Hair Solution Rx (women) product page](https://ro.co/medications/hair-solution-rx/)
- [Revive Shampoo](https://ro.co/products/revive-shampoo/)
- [Restore Conditioner](https://ro.co/products/restore-conditioner/)
- [Hair loss FAQ (how the visit works, photos, cost, when charged)](https://ro.co/faq/hair-loss/)
- [Safety information: finasteride](https://ro.co/safety-info/finasteride/)
- [Safety information: oral minoxidil](https://ro.co/safety-info/oral-minoxidil/)
- [Safety information: Ro Mane Spray](https://ro.co/safety-info/ro-mane-spray/)
- [Hair loss treatment plan (what patients are told after prescribing)](https://ro.co/treatment-plans/hair-loss/)
- [FAQ: cost, pricing, pausing and cancelling](https://ro.co/faq/cost-pricing-services/)
- [FAQ: telehealth (states served, ID photos, video calls)](https://ro.co/faq/telehealth/)
- [Returns and refunds](https://ro.co/returns-and-refunds/)
- [Men's quiz definition (public endpoint the page calls on load)](https://start.ro.co/svc/online-visit/public/roman/hair-loss/schemas/onboarding)
- [Women's quiz definition (public endpoint the page calls on load)](https://start.ro.co/svc/online-visit/public/derm/womens-hair-loss/schemas/onboarding)
- [Men's product catalogue JSON (public endpoint the page calls)](https://start.ro.co/api/public/6/grouped-products?include_product_codes=roman-revive-conditioner-24&include_product_codes=roman-revive-shampoo-24&include_product_codes=roman-hair-support-supplement&visible_in_onboarding=true)
- [Recommendation logic chunk (public JS)](https://start.ro.co/assets/48419.d54c80ce6a7f9ba5ad88.chunk.js)
- [Experiment configuration (public JS)](https://start.ro.co/svc/ro-experiments/public/roexp.min.js)
- [Paid-search quiz landing page (finasteride)](https://ro.co/lp/medications/hair-loss/quiz/)
- [Paid-search quiz landing page (oral minoxidil)](https://ro.co/lp/medications/mhl/om/quiz/)
