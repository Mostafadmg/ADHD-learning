# Ro (Roman): consultation and product report

**Market:** US · **Website:** https://ro.co/hair-loss/ · **Checked:** 2026-11-24 · **Owner:** Roman Health Ventures Inc. (trading as Ro). The terms of use name its affiliates Roman Health Medical LLC and Roman Health Pharmacy LLC (docs: https://ro.co/terms-of-use/, checked 2026-11-23).

> US direct-to-patient telehealth company: an online questionnaire ('online visit') reviewed by a US-licensed clinician, with its own pharmacy shipping generic, off-label and compounded hair-loss medicines on quarterly or longer subscriptions.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** Men (start.ro.co/fxdxbh): after 3 marketing questions, on screen qid 55, an email pop-up ('See how much fuller your hair could be in just 3 months', email + two consent boxes, or Continue with Google) that cannot be dismissed. Women (start.ro.co/tefcyb): after 3 or 4 hair questions, on screen qid 16 'Thanks for sharing. Ready to go deeper?' (Sign up with Email / Continue with Google). Topical minoxidil, shampoo and conditioner: sign-up is the first or second screen. In every flow the wall comes before any medical question and before any recommendation.
- **Blocker:** Account wall before every medical question, so no branch after the wall could be replayed live.
- **Blocker:** No bot protection problem: the site and the consultation app load normally in the walker.

Stages 1 to 3. LIVE: every question that can be reached without an account was replayed with one answer changed at a time (21 replays in stage 2: men 3 questions, women 4), and three direct-purchase entries were opened in stage 1. Every replay ended at the account wall with no product or price shown. CODE: the consultation app itself downloads the complete question schema for each flow (every question, option, fork rule and variable change behind the wall) and the men's recommendation function is in a public JS chunk. Stage 2 ran those definitions through an offline simulator, one change at a time (291 simulated runs: 161 men, 130 women, saved in runs/sim/), which is where every post-wall rule and recommendation comes from. These are labelled 'code', not 'observed'. No email, phone, name or other contact detail was entered, nothing was submitted, no photo or payment was given. Honest note: on the first answer the page itself creates an anonymous draft visitor record and posts each answer to it; that is the site's normal anonymous behaviour, and each live replay leaves one such draft. Stage 3 (independent check, 23-24 Nov 2026): 18 more live replays (both baselines, every remaining pre-wall option, three combinations, the coupon link, two alternative entry links and the three direct-purchase links); all matched the recorded results. The served schemas (men v77, women v32) were unchanged; the recommender chunk was byte-identical; the new main bundle was re-read.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen), **owner-run** (seen in the owner's own browser research, not replayed by us).

## 2. How the engine decides (short version)

Ro runs two different engines, and both can be read in full from code the site serves to any visitor. MEN: a 'soft steer' engine. Three marketing questions, then an email wall, then the medical questionnaire (the baseline man passes 19 screens up to the recommendation; reporting past treatments or conditions adds follow-ups). Nothing medical stops a man (only age under 18, female sex or an unserved zip code). Answers switch on up to three 'do not recommend' flags, one per treatment. A fixed priority list (Ro Mane Spray, then finasteride 1 mg tablets, then oral minoxidil 2.5 mg tablets) makes the first unflagged treatment the 'recommended' one, but all three stay on the screen and can be picked, on a default quarterly plan, and a clinician decides afterwards. In the offline one-change sweep the compounded spray, the dearest product, was recommended for every profile except: finasteride-type worries (depression, anxiety, erectile dysfunction, trying for a baby, past finasteride problems) which move the pick to oral minoxidil; prostate cancer or a topical allergy, which move it to finasteride tablets; and five 'another diagnosis?' answers (patches, very sudden onset, scalp redness, past steroid injections, persistently low blood pressure) which remove the recommendation but not the products. Heart and blood-pressure red flags only flag the minoxidil tablet, so the minoxidil spray stays recommended. Goals, severity and pattern only personalise a recap screen. WOMEN: a 'gate' engine. Three or four hair questions, then the sign-up wall, then the medical questionnaire (the baseline woman passes 31 screens up to the product choice). Pregnancy, any diagnosed scalp condition, signs of virilisation, lupus or autoimmune disease, past scalp steroid injections and minoxidil allergy end the visit with a referral. Breastfeeding, cardiovascular conditions, high blood pressure and age 66+ remove the tablet and leave only the compounded topical. Everyone else chooses between oral minoxidil ($30 a month) and Hair Solution Rx ($40 a month), with 'No preference' defaulting to the tablet; pattern, severity and symptoms never change the options. Before either wall the answers change only the wording or number of the next question (observed live); no product or price appears. Non-prescription products (5% minoxidil solution, shampoo, conditioner) are sold through separate links with no questions.

## 3. Engine rules (32)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men | Any answer to men-q20 (goals), men-q26 (why not before) or men-q28 (why now) | Nothing changes: same next question, same account wall, same pop-up wording; no product or price appears. After the wall these answers only fill the 'Here's a quick recap' bullets. | Marketing only | observed | high |
| R2 | men | men-q22 includes 'Non-prescription solutions' or 'Prescription medications' | The third question changes from 'What's the main reason you haven't tried hair loss treatment before?' to 'What's the main reason you're looking for hair loss solutions now?'. After the wall (code) the visit also adds 'What hair loss treatments have you used?' with a follow-up for each treatment ticked. | Adds questions | observed | high |
| R3 | men | Every route into the men's visit, whatever is answered before the wall | The account wall comes after 3 marketing questions and before any medical question, recommendation or price. The email pop-up cannot be dismissed. (The Google Shopping link /escptw puts sign-up first.) | No effect | observed | high |
| R4 | men | Visit opened through a paid-search coupon link (fxdxbh/?c=<code>) | Questions and wall are unchanged and nothing is shown on screen before the wall; the app silently matches a coupon ('35% off first order plus free shipping'), which applies to the first order if prescribed. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Marketing only | observed | high |
| R5 | men | End of the medical questions (recommendation screen, qid 3178) | Recommended treatment = the first of [Ro Mane Spray, finasteride 1 mg tablets, oral minoxidil 2.5 mg tablets] whose no-recommend flag is not set and whose product group is available in the patient's state. The other treatments stay on the screen under 'Other treatment options' and can still be picked. If all are flagged: no recommendation, heading 'Your treatment options'. The plan defaults to quarterly at checkout. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Switches product | code | high |
| R6 | men | No red-flag answer at all (baseline man), any goal, any severity (very mild to extremely severe), hairline, crown or overall thinning, even 'Nowhere yet, but I'd like to prevent future hair loss' | Ro Mane Spray is recommended every time. Goals, severity and pattern do not move the recommendation; 'Nowhere yet' only skips the onset, severity and scalp-symptom questions. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride))_ | No effect | code | high |
| R7 | men | Patient's US state does not support the compounded spray (server look-up by state) | The spray group is treated as ineligible ('Not available in your area') and left off the screen; the recommendation moves to finasteride tablets. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride))_ | Removes a product | code | medium |
| R8 | men | Any of: patchy loss 'Random golf-ball size bald patches…' (q132); onset 'Very suddenly' (q150); 'Redness or rashes on scalp' (q170); past 'Steroid injections in the scalp' (q240); blood pressure readings still 'low' after a low-blood-pressure diagnosis (q391) | All three no-recommend flags are set: nothing is recommended ('Your treatment options'), but all three treatments can still be picked and the visit still goes to checkout and clinician review. There is no stop screen for men. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Removes a product | code | high |
| R9 | men | Any of: erectile dysfunction, anxiety or depression (q1000); 'Yes, we are' trying for a pregnancy in the next 3 months (q2350); past finasteride tablets with problematic side effects or allergy (q315) | Both finasteride products (spray and tablets) are flagged: the recommendation becomes oral minoxidil 2.5 mg. Trying for a baby also adds a caution screen about finasteride and sperm count. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Switches product | code | high |
| R10 | men | Prostate cancer (q1000); allergy to topical minoxidil (q285) or to topical finasteride (q335) | Only the spray is flagged: the recommendation becomes finasteride 1 mg tablets. (Prostate cancer does not flag the tablets in the schema.) _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia))_ | Switches product | code | high |
| R11 | men | Past oral minoxidil 'I found out I was allergic to it' (q265) | The spray and oral minoxidil are flagged: the recommendation becomes finasteride 1 mg tablets. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Switches product | code | high |
| R12 | men | Any of: blood pressure still 'very high' (161+/101+) after a high-blood-pressure diagnosis (q381); phaeochromocytoma (q1000); stroke less than 6 months ago (q1260); angina, heart failure, pericarditis or pulmonary hypertension (q1300); heart attack or bypass less than 6 months ago, or not seeing a cardiologist (q1315, q1320, q1355, q1360); atrial flutter, PSVT, Wolff-Parkinson-White or ventricular fibrillation (q1420); resting heart rate under 50 or fainting from a low heart rate (q1455, q1460); past oral minoxidil with side effects or no effect (q265) | Only oral minoxidil tablets are flagged. Ro Mane Spray (6% minoxidil) stays the recommendation, so for a man with no other flag nothing visible changes. _(affects: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Removes a product | code | high |
| R13 | men | Past finasteride tablets 'this dose wasn't effective' (q315) | Only finasteride tablets are flagged; the spray (which contains finasteride) stays recommended. _(affects: Oral finasteride 1 mg (generic Propecia))_ | Removes a product | code | high |
| R14 | men | Flags from different answers together, e.g. depression (spray + finasteride) with heart failure (oral minoxidil) | Flags add up and are never cleared: with all three set there is no recommendation, though all three treatments are still offered to pick. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Removes a product | code | high |
| R15 | men | Any of: liver failure or cirrhosis, kidney disease (any stage, including stage 5), coronary artery disease, atrial fibrillation, bradycardia with a normal rate, stroke more than 6 months ago, scalp pain, pus bumps or sores, eyebrow or eyelash loss, onset 'Not sure', current medicines, allergies | No flag: Ro Mane Spray is still recommended. Some of these open detail questions; the answers carry a 'caution' or 'negative' mark that is saved with the answer on the server (that a clinician reads it is inferred). | Flags for the clinician | code | high |
| R16 | men | Basics screen: age under 18, sex female, or zip code not served | Under 18 or unserved zip: the visit stops with a contact form. Female: sent to the women's visit (or an exit form). These are the only stops in the men's schema; there is no upper age limit (age 70 changes nothing). _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Stops the patient | code | high |
| R17 | men | men-q132 is a multi-select whose options point to different next questions (e.g. 'Hairline' + 'patches') | The app follows the first ticked option in display order, so the onset, severity and scalp questions are still asked; the patch flags still apply (no recommendation). (Stage 3: the current main bundle does the same: for choice and multi-choice questions it takes the next question of the first ticked answer in display order.) | Next question | code | high |
| R18 | men | Treatment picked on the recommendation screen | The pick sets the side-effect screen that must be acknowledged (spray: finasteride + minoxidil + tretinoin; tablets: their own) and, for the spray, removes the option of an outside pharmacy. The cart gets the default strength (spray, finasteride 1 mg or minoxidil 2.5 mg) on a quarterly plan; the clinician has the final say. _(affects: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss))_ | Adds a product | code | high |
| R19 | women | Any answer to women-q4 (how long), women-q6 (how it started, including 'Suddenly') or women-q10 (part-line picture 1 to 5) | Nothing changes: same next question and same account wall; after the wall (code) none of them changes what is offered. | No effect | observed | high |
| R20 | women | women-q8 includes 'Top of head/crown' or 'All over' | Adds the part-line picture question before the wall. 'Temples' or 'Frontal scalp' alone skips it. | Adds questions | observed | high |
| R21 | women | Every route into the women's visit, whatever is answered before the wall | The account wall comes after 3 or 4 hair questions and before any medical question, product or price. | No effect | observed | high |
| R22 | women | Pregnant = 'Yes' or 'Not sure' (q1055) | Hard stop: 'Unfortunately, our treatments are not available for use during pregnancy.' _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R23 | women | Any diagnosed scalp condition ticked at q1086 (alopecia areata, lichen planopilaris, FFA, CCCA, traction alopecia, lupus) | Hard stop: 'visit an in-person dermatologist' (screen 6040). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R24 | women | Enlargement of the clitoris, discharge from the nipple(s) or deepening of the voice (q1090) | Hard stop (screen 6040). Excess body or facial hair, severe acne and irregular periods do not stop the visit or change the offer. _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R25 | women | Lupus or other autoimmune disorder (q1096) | Rules out both products: hard stop (screen 6040). _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R26 | women | Past steroid injections into the scalp (q1250); allergy to oral minoxidil = Yes (q1254); allergy to topical minoxidil in foam form or both forms (q1258) | Hard stop (screen 6040). An allergy to the liquid form only, or 'Unsure', continues to the normal choice. _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R27 | women | Breastfeeding (q1057); heart condition, stroke, phaeochromocytoma, pulmonary hypertension or high blood pressure (q1096); or age 66 or over | Oral minoxidil is removed: no choice screen, Hair Solution Rx is the only treatment shown. Age 65 still gets the choice. _(affects: Women's oral minoxidil (low dose))_ | Removes a product | code | high |
| R28 | women | No exclusion and age 18 to 65 (baseline woman) | Choice screen: Oral Minoxidil ($30 a month), Hair Solution Rx ($40 a month) or No preference, which puts oral minoxidil in the cart. Quarterly plan. Pattern, severity, duration, shedding and family history do not change the options. _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Adds a product | code | high |
| R29 | women | Self-reported bald patch(es), scalp redness or rash, pus bumps, eyebrow or eyelash loss (q1074); sudden onset (q6); shedding (q1062, q1070); gave birth in the last year (q1059); menopause, illness, stress, weight loss, chemotherapy, hormonal contraception change (q1094) | No stop and no change to the offer. Only a named diagnosis stops the visit; symptoms are only marked ('negative', 'caution', 'ack-clinical') and, we infer, left to the clinician and the scalp photos. | Flags for the clinician | code | high |
| R30 | women | Kidney disease, liver disease, thyroid disorder, anaemia, iron deficiency or PCOS (q1096); 'told you have low blood pressure' (q1185); any other condition, surgery, medicine or allergy | Adds a free-text 'tell us more' box (or a searchable list). The offer does not change. | Adds questions | code | high |
| R31 | women | Basics screen: age under 18, sex male, or zip code not served | Under 18 or unserved zip: stop. Male: offered the men's visit. _(affects: Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical))_ | Stops the patient | code | high |
| R32 | otc-direct | Topical minoxidil 5%, Revive Shampoo or Restore Conditioner opened from its own 'Buy now' link | No medical question at all: plan screen (or straight to sign-up) then payment. _(affects: Minoxidil Topical Solution 5%, 60 mL (generic Rogaine), Ro Revive Shampoo (8 oz), Ro Restore Conditioner (8 oz))_ | No effect | observed | high |

## 4. Products (11)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride)](https://ro.co/medications/ro-mane-spray/) | rx-topical-compounded | minoxidil 6%; finasteride 0.3%; tretinoin 0.025% | topical spray, 4 oz bottle, once daily (no more than 4 sprays a day) | men | US compounded prescription medicine (not FDA-approved); catalogue rx_type 'rx_compound', pharmacy name 'Compounded Topical Liquid' | $50 a month on the quarterly plan (one 4 oz bottle per 3 months) ($43 a month on the 6-month plan. No 12-month plan (catalogue delivery choices: quarterly, semiannually). Recommender card says 'Starting at $43/mo'. Landing-page coupons: 35% or 50% off the first order if prescribed.) | Men: recommended by default. It is first in the fixed order (spray, finasteride tablets, oral minoxidil tablets) and is recommended whenever its flag is clear: baseline man, any goal, any severity, even 'no hair loss yet', and also for men with heart or blood-pressure red flags. It loses the recommended place (but stays selectable) with depression, anxiety, erectile dysfunction, trying for a baby, prostate cancer, bad experience or allergy with finasteride or minoxidil, or any all-flags answer; it is hidden in states that do not support compounded products. (code; runs/sim/men.json) | code |
| [Oral finasteride 1 mg (generic Propecia)](https://ro.co/medications/finasteride/) | rx-oral | finasteride 1 mg | tablet, one a day | men | US Rx (FDA-approved generic for male pattern hair loss) | $20 a month on the quarterly plan ($18 a month on the 6-month plan, $16 a month on the 12-month plan. Catalogue: $0.66 a tablet, 30 a month. Recommender card says 'Starting at $16/mo'.) | Men: recommended only when the spray is flagged or unavailable and finasteride itself is not flagged: prostate cancer, allergy to topical minoxidil, topical finasteride or oral minoxidil, or a state without the compounded spray. Otherwise listed under 'Other treatment options'. (code; runs/sim/men.json#sim-m-q1000-prostate-cancer) | code |
| [Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss)](https://ro.co/medications/oral-minoxidil/) | rx-oral | minoxidil 2.5 mg | tablet, one a day | men | US Rx, FDA-approved for high blood pressure only; used off-label for hair loss; boxed warning | $30 a month on the quarterly plan ($27 a month on the 6-month plan, $24 a month on the 12-month plan. Catalogue: $1.00 a tablet. Recommender card says 'Starting at $24/mo'.) | Men: recommended only when both finasteride products are flagged and oral minoxidil is not: depression, anxiety, erectile dysfunction, trying for a baby in the next 3 months, or side effects or allergy with finasteride tablets. Otherwise listed under 'Other treatment options'. (code; runs/sim/men.json#sim-m-q1000-depression) | code |
| [Oral minoxidil 5 mg a day (two 2.5 mg tablets)](https://ro.co/medications/oral-minoxidil/) | rx-oral | minoxidil 5 mg a day (2 x 2.5 mg) | tablets, two a day | men | US Rx, off-label for hair loss | $30 a month (catalogue: $0.50 a tablet, 60 tablets a month) (Same monthly price as the 2.5 mg plan in the catalogue. Not selectable in the onboarding visit; no public page.) | Never offered by the onboarding visit: no answer adds it. It exists only as a catalogue group, so it is probably a dose step a clinician can move a patient to (inferred). | code |
| [Minoxidil Topical Solution 5%, 60 mL (generic Rogaine)](https://ro.co/medications/minoxidil/) | otc-medicine | minoxidil 5% | topical solution, 1 mL twice a day, one 60 mL bottle a month | men | US OTC (FDA-approved non-prescription medicine); no clinician review (catalogue: requires_prescription false, requires_review false) | $16 a month on the 3-month plan ($48 per shipment) ($14 a month on the 6-month plan; $13 a month on the 12-month plan ($156 a year: $192 less a $36 refill-frequency discount).) | Never recommended by a consultation. Bought through its own 'Buy now' link with no medical questions (observed, runs/probe-vwayzg); also present in the catalogue as an add-on. | observed |
| [Finasteride tablets + topical minoxidil together](https://ro.co/faq/hair-loss/) | bundle | finasteride 1 mg; minoxidil 5% topical | tablet plus topical solution | men | US Rx (finasteride) plus US OTC (minoxidil solution) | $1.17 a day on a quarterly plan (hair-loss FAQ); catalogue sum is $20 + $16 = $36 a month (The FAQ figures ($0.67 a day finasteride, $0.53 a day minoxidil, $1.17 a day together) look older than the pricing page; treat as approximate.) | Not an outcome of the current visit. Public documents only say a clinician 'may recommend using finasteride and minoxidil together' (docs). | docs |
| [Ro Revive Shampoo (8 oz)](https://ro.co/products/revive-shampoo/) | cosmetic | saw palmetto, pumpkin seed oil, salicylic acid, caffeine not stated | shampoo, 8 oz bottle | men | US cosmetic (sold as 'OTC' type in the catalogue, no prescription, no review) | $24 per 3 months (one bottle every 3 months) (Only a 3-month plan. Offered as an add-on in the men's visit catalogue.) | Never recommended by the medical questions. Own 'Buy now' flow (observed, runs/probe-kwrssq) and an add-on in the men's catalogue. | observed |
| [Ro Restore Conditioner (8 oz)](https://ro.co/products/restore-conditioner/) | cosmetic | plant proteins, coconut oil, shea butter not stated | conditioner, 8 oz bottle | men | US cosmetic (catalogue type 'OTC', no prescription, no review) | $24 per 3 months (one bottle every 3 months) (Only a 3-month plan. Shown as a 'Popular add-on' on the shampoo checkout.) | Never recommended by the medical questions. Own 'Buy now' flow (observed, runs/probe-qcalmd) and an add-on to the shampoo order. | observed |
| Hair Support Supplement | supplement | unknown unknown | box of 90 (catalogue: quantity 90, 30-day supply) | men | US dietary supplement (inferred from the name; no product page found) | unknown (The catalogue lists the group roman-hair-support-supplement with monthly and quarterly delivery choices but no purchasable product inside it, and the sitemap has no page for it. It may be withdrawn or paused.) | unknown. Requested as an add-on code by the men's schema but the catalogue group is empty. | code |
| [Women's oral minoxidil (low dose)](https://ro.co/medications/womens-oral-minoxidil/) | rx-oral | minoxidil exact strength not published; site says 0.25 to 2.5 mg is the typical range for women | tablet, once a day | women | US Rx, off-label for hair loss; boxed warning | $30 a month, quarterly plan (The pricing page and the consultation both say quarterly; the women's landing page says 'billed and shipped every 2 months'. Only one plan length is published.) | Women: offered on the choice screen to every woman aged 18 to 65 with no exclusion, and it is the default in the cart for 'No preference'. Removed when breastfeeding, with a heart condition, stroke, phaeochromocytoma, pulmonary hypertension or high blood pressure, or from age 66. (code; runs/sim/women.json) | code |
| [Hair Solution Rx (women's compounded topical)](https://ro.co/medications/hair-solution-rx/) | rx-topical-compounded | minoxidil 5%; tretinoin 0.025%; melatonin 0.1% | topical solution, once a day | women | US compounded prescription medicine (not FDA-approved) | $40 a month, quarterly plan (Only one plan length is published. Site: do not use if pregnant or trying to get pregnant.) | Women: offered on the choice screen to every eligible woman; it becomes the only treatment shown when oral minoxidil is ruled out (breastfeeding, cardiovascular conditions, high blood pressure, age 66+). Not offered at all after a stop (pregnancy, diagnosed scalp condition, virilisation signs, lupus or autoimmune disorder, steroid injections, minoxidil allergy). (code; runs/sim/women.json) | code |

## 5. Who gets what (14 patient profiles)

- **Any visitor BEFORE the account wall (man or woman, any pre-wall answers)** → nothing offered. Nothing is offered or priced before sign-up. Men see one general line ('finasteride, minoxidil, or both in a convenient topical spray'); women see no product at all. Seen in 21 live replays. _[observed]_
- **Baseline man: 32, hairline + crown, gradual, moderate, nothing tried, no conditions or medicines, not trying for a baby** → Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss) (default: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride)). Ro Mane Spray (minoxidil 6%, finasteride 0.3%, tretinoin 0.025%) shown as the recommended treatment, $50 a month on the default quarterly plan ('Starting at $43/mo' on the card). Finasteride 1 mg tablets ($20 a month quarterly) and oral minoxidil 2.5 mg ($30 a month quarterly) listed under 'Other treatment options'. From the served code and offline simulation; the screen itself is behind the wall. _[code]_
- **Same man with any goal, any severity, or 'Nowhere yet, I'd like to prevent future hair loss'; or with liver failure, kidney disease, coronary artery disease, medicines or allergies** → Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss) (default: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride)). Identical to the baseline: none of these sets a flag. _[code]_
- **Man with a cardiovascular or blood-pressure red flag only (heart failure, angina, recent heart attack, bypass or stroke, listed arrhythmias, very high readings, phaeochromocytoma) or who did badly on oral minoxidil before** → Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss) (default: Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride)). Only oral minoxidil tablets are flagged; the minoxidil-containing spray is still recommended and the tablets are still listed. _[code]_
- **Man with depression, anxiety or erectile dysfunction; or trying for a baby in the next 3 months; or past side effects or allergy with finasteride tablets** → Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss) (default: Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss)). Both finasteride products flagged: oral minoxidil 2.5 mg is recommended ($30 a month quarterly). The flagged products can still be picked. _[code]_
- **Man with a history of prostate cancer; or allergy to topical minoxidil, topical finasteride or oral minoxidil; or living in a state where the compounded spray is not supported** → Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss) (default: Oral finasteride 1 mg (generic Propecia)). Spray flagged (or hidden, for the state rule): finasteride 1 mg tablets recommended ($20 a month quarterly). _[code]_
- **Man with patchy loss, very sudden onset, scalp redness or rash, past steroid injections, persistently low blood pressure, or a mix of flags covering all three treatments** → Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride), Oral finasteride 1 mg (generic Propecia), Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss). No recommendation: heading 'Your treatment options'. All three treatments remain selectable and the visit goes on to checkout and clinician review. No stop screen. _[code]_
- **Man under 18, or zip code not served** → nothing offered. Stopped at the basics screen with a contact form. A female answer is sent to the women's visit. _[code]_
- **Baseline woman: 38, thinning on top, gradual, not pregnant or breastfeeding, no conditions** → Women's oral minoxidil (low dose), Hair Solution Rx (women's compounded topical) (default: Women's oral minoxidil (low dose)). Choice screen: Oral Minoxidil $30 a month, Hair Solution Rx (minoxidil 5%, tretinoin 0.025%, melatonin 0.1%) $40 a month, or No preference, which puts oral minoxidil in the cart. Quarterly plan. From the served schema and offline simulation. _[code]_
- **Woman who is breastfeeding, has high blood pressure, a heart condition, stroke, phaeochromocytoma or pulmonary hypertension, or is 66 or older** → Hair Solution Rx (women's compounded topical) (default: Hair Solution Rx (women's compounded topical)). Hair Solution Rx only, $40 a month quarterly; no choice screen. _[code]_
- **Woman who is or may be pregnant** → nothing offered. Stop screen: 'our treatments are not available for use during pregnancy'. _[code]_
- **Woman with a diagnosed scalp condition (alopecia areata, scarring alopecias, traction alopecia, lupus), virilisation signs, lupus or autoimmune disorder, past scalp steroid injections, or minoxidil allergy (oral, foam or both forms)** → nothing offered. Stop screen: referred to an in-person dermatologist (AAD find-a-derm link). _[code]_
- **Woman under 18, or zip code not served** → nothing offered. Stopped at the basics screen. A male answer is offered the men's visit. _[code]_
- **Anyone using a 'Buy now' link for topical minoxidil 5%, shampoo or conditioner** → Minoxidil Topical Solution 5%, 60 mL (generic Rogaine), Ro Revive Shampoo (8 oz), Ro Restore Conditioner (8 oz). Sold directly with no questions: minoxidil 5% solution $16 a month on a 3-month plan ($48); shampoo and conditioner $24 per 3 months each. Re-checked live in stage 3 (runs/verify-otc-minoxidil, -shampoo, -conditioner). _[observed]_

## 6. The consultation, step by step

### Men's hair-loss online visit (schema 'Hair loss onboarding', code hl-onb-consult-2rx, version 77)

Entry: https://start.ro.co/fxdxbh/

3 anonymous marketing questions (goals, what you have tried, why now) -> ACCOUNT WALL (email + consents, cannot be dismissed) -> basics (birth date, sex, zip, phone) -> hair pattern, onset, severity, scalp symptoms -> past treatments (only if any were tried) -> blood pressure -> conditions -> heart -> medicines -> allergies -> trying for a baby -> cross-sell -> anything else -> recap loader -> recommendation screen (3 treatments, 1 recommended) -> side-effect acknowledgement -> selfie + ID -> shipping -> payment -> clinician review. Everything after the wall is from the publicly served schema, not walked.

**1. What are your top hair goals?**  
_multi · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Opening question about goals. In the code the three goal variables only feed the personalised recap bullets; the recommendation logic ignores them.

- `Regrow my hair` → **Marketing only**: Sets goalRegrowth=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'You want to regrow your hair'). It does not change which treatment is recommended. Seen live in runs/s2-baseline-men: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `Get thicker, fuller hair` → **Marketing only**: Sets goalThickerAndFuller=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'You want fuller, thicker hair'). It does not change which treatment is recommended. Seen live in runs/exp-m01: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `Proactively prevent hair loss` → **Marketing only**: Sets goalPrevention=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'You want to prevent future hair loss'). It does not change which treatment is recommended. Seen live in runs/exp-m02: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_

**2. What hair loss solutions have you tried, if any?**  
_multi · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Splits people who have tried something from first-timers. Decides the next marketing question and whether the past-treatment questions are asked later.  
Downstream: Any 'tried' answer -> qid 28 now and qid 240 onwards later (fork 25 and fork 229). 'None of the above' -> qid 26 and the past-treatment block is skipped.

- `Non-prescription solutions (e.g. Rogaine, supplements)` → **Adds questions**: Sets hasTriedNonPrescription=1. Branch: the next question becomes 'What's the main reason you're looking for hair loss solutions now?' (instead of 'why haven't you tried'), and after the account wall the visit adds 'What hair loss treatments have you used?' with follow-ups about each one. Does not change the recommendation by itself. Seen live in runs/exp-m03: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `Prescription medications (e.g. Propecia, oral minoxidil)` → **Adds questions**: Sets hasTriedPrescription=1. Branch: the next question becomes 'What's the main reason you're looking for hair loss solutions now?' (instead of 'why haven't you tried'), and after the account wall the visit adds 'What hair loss treatments have you used?' with follow-ups about each one. Does not change the recommendation by itself. Seen live in runs/exp-m04: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `None of the above` → **Skips questions**: Sets hasNotTriedAnyPrescription=1. Next question is 'What's the main reason you haven't tried hair loss treatment before?' (seen in runs/baseline-men). The past-treatment questions are skipped. Seen live in runs/s2-baseline-men: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_

**3. What’s the main reason you haven’t tried hair loss treatment before?**  
_single · anonymous · role: marketing · shown: qid 22 = 'None of the above' (fork 25) · no branch · observed_  
Why they ask: Objection capture for first-timers. Two answers feed recap bullets; none changes the treatment.

- `Not sure it'll work` → **Marketing only**: Sets notSureAboutHairLossTreatment=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'Want to see real results'). It does not change which treatment is recommended. Seen live in runs/exp-m05: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `Seems too expensive` → **Marketing only**: No variable is set. Marketing data only. Seen live in runs/exp-m06: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `Nervous about side effects` → **Marketing only**: No variable is set (it does not steer away from finasteride). Marketing data only. Seen live in runs/exp-m07: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `Didn't want or need to until now` → **Marketing only**: Sets didntWantOrNeedHairLossTreatment=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'Looking to get started'). It does not change which treatment is recommended. Seen live in runs/s2-baseline-men: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_

**4. What’s the main reason you’re looking for hair loss solutions now?**  
_single · anonymous · role: marketing · shown: qid 22 includes a 'tried' answer (fork 25). Seen live in runs/exp-m03 and runs/exp-m04. · no branch · observed_  
Why they ask: Motivation capture for people who have tried something. Two answers feed recap bullets; none changes the treatment.

- `Over-the-counter solutions didn't work for me` → **Marketing only**: Sets lookingBecauseOtcNotWork=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'Looking for prescription-strength'). It does not change which treatment is recommended. Seen live in runs/exp-m08: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `I want to maximize results with a new or additional product` → **Marketing only**: No variable is set. Marketing data only. Seen live in runs/exp-m03: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `I want an easier or more convenient solution (like a pill or a spray)` → **Marketing only**: Sets lookingForEasierSolution=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: 'Looking for an easier solution'). It does not change which treatment is recommended. Seen live in runs/verify-m-rx-easier (stage 3): no branch, and the wall screen is word-for-word the same as the baseline. _[observed]_
- `I’ve experienced side effects with past solutions` → **Marketing only**: No variable is set here (side effects are asked about again, per medicine, after the account wall). Marketing data only. Seen live in runs/exp-m09: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_

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
Downstream: Hairline, crown or overall -> onset, severity and scalp-symptom questions (150, 160, 170). Patches or 'Nowhere yet' -> jump to fork 229, skipping those three. How mixed selections route is not known. Mixed picks: the app takes the next question from the FIRST ticked option in display order (main bundle, next-question selector), so 'Hairline' + 'patches' still goes through onset, severity and scalp symptoms, while 'patches' alone skips them. The flags of every ticked option still apply (runs/sim/men.json#sim-m-q132-hairline+patches).

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
Downstream: High -> qid 381. Low -> qid 391. Either, or 'I'm not sure' -> information screen 395. 'No' -> straight to qid 1000. The schema lets high and low both be recorded (two follow-up forks). The picture on the follow-up questions defines the ranges (main bundle): Low under 95/55, Normal 95-130/55-80, High 131-160/81-100, Very High 161+/101+.

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

- `Months` → **No effect**: Sets hairLossExperience='months'. No fork rule reads it; no effect on what is offered. Seen live in runs/exp-w01: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `Within the last year` → **No effect**: Sets hairLossExperience='withinTheLastYear'. No fork rule reads it; no effect on what is offered. Seen live in runs/exp-w02: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `More than a year` → **No effect**: Sets hairLossExperience='moreThanAYear'. No fork rule reads it; no effect on what is offered. Seen live in runs/s2-baseline-women: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_

**2. How did your hair loss start?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Speed of onset. Unlike the men's visit, 'Suddenly' has no flag or highlight here.

- `Suddenly` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. Seen live in runs/exp-w03: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `Gradually` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. Seen live in runs/s2-baseline-women: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `Not sure` → **No effect**: No rule in the schema depends on this answer; it is saved for the clinician. Seen live in runs/exp-w04: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_

**3. Where on your head have you noticed hair loss?**  
_multi · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Where the loss is. Top-of-head or all-over loss adds the part-line picture question.  
Downstream: 'Top of head/crown' or 'All over' -> part-line picture question (qid 10). Temples or frontal scalp only -> straight to sign-up.

- `Top of head/crown` → **Adds questions**: Sets ifTopOfHead=1: adds the question 'Which picture most closely resembles your part line?' (seen in runs/baseline-women). No effect on what is offered. Seen live in runs/s2-baseline-women: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `Temples` → **Skips questions**: On its own, skips the part-line picture question (q10) and goes straight to sign-up. No variable is set and nothing changes in what is offered. Marked 'ack-clinical' in the schema (the mark is saved with the answer for the clinician). Seen live in runs/exp-w05. _[observed]_
- `Frontal scalp` → **Skips questions**: On its own, skips the part-line picture question (q10) and goes straight to sign-up. No variable is set and nothing changes in what is offered. Marked 'ack-clinical' in the schema (the mark is saved with the answer for the clinician). Seen live in runs/exp-w06. _[observed]_
- `All over` → **Adds questions**: Exclusive answer. Sets ifAllOver=1: adds the part-line picture question. No effect on what is offered. Seen live in runs/exp-w07: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_

**4. Which picture most closely resembles your part line?**  
_single · anonymous · role: diagnosis · shown: qid 8 includes 'Top of head/crown' or 'All over' · no branch · observed_  
Why they ask: Five pictures of a widening parting (image alt texts: Normal, Slightly Wide, Wider, Very Wide, Extremely Wide Hair Part), in effect a Ludwig-style severity scale. No option changes the engine.

- `1` → **No effect**: Picture 1 of 5 (Normal Hair Part). No variable, no branch; saved for the clinician. Seen live in runs/exp-w08: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `2` → **No effect**: Picture 2 of 5 (Slightly Wide Hair Part). No variable, no branch; saved for the clinician. Seen live in runs/verify-w-pic2 (stage 3): no branch, and the wall screen is word-for-word the same as the baseline. _[observed]_
- `3` → **No effect**: Picture 3 of 5 (Wider Hair Part). No variable, no branch; saved for the clinician. Seen live in runs/s2-baseline-women: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_
- `4` → **No effect**: Picture 4 of 5 (Very Wide Hair Part). No variable, no branch; saved for the clinician. Seen live in runs/verify-w-pic4 (stage 3): no branch, and the wall screen is word-for-word the same as the baseline. _[observed]_
- `5` → **No effect**: Picture 5 of 5 (Extremely Wide Hair Part). No variable, no branch; saved for the clinician. Seen live in runs/exp-w09: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code. _[observed]_

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

- Very short path to sign-up (3 to 4 easy questions) with the long medical questionnaire kept until after the email is captured; 21 live replays never showed a dead end before the wall.
- One clear recommended product with the alternatives still visible and pickable, and the clinician as the final check: simple for the patient and it protects conversion.
- Men's safety questions for oral minoxidil are detailed: blood-pressure follow-ups with a picture of the ranges, timed heart attack, stroke and bypass questions, arrhythmia types, resting heart rate, fainting.
- Finasteride-specific steering is thoughtful: depression, anxiety, erectile dysfunction and trying for a baby all move the recommendation away from both finasteride products, with a plain caution screen about fertility.
- Women's visit has firm, explained stop screens (pregnancy, scarring and autoimmune alopecias, virilisation signs) with a find-a-dermatologist link, plus scalp photos and tracked outcome scores (severity, confidence, stress).
- Clear public price for every plan length; coupons (35% or 50% off the first order) attach silently from ad links; no charge until a clinician approves.
- A broad men's range for a telehealth brand: licensed tablet, off-label oral minoxidil, a compounded 3-in-1 spray, OTC minoxidil, shampoo and conditioner.

**Weaknesses**

- The men's recommendation barely uses the consultation: the same product (the highest-priced compounded spray) is recommended to every unflagged man whatever his goals, pattern or severity, including a man who reports no hair loss yet.
- No product, price or eligibility signal before the email wall; the wall pop-up cannot be closed. 'Seems too expensive' and 'Nervous about side effects' get no answer.
- Men are never stopped: patches, very sudden loss, scalp inflammation, liver failure and stage 5 kidney disease all reach checkout, relying entirely on the clinician; pain, pus bumps and eyebrow loss do not even remove the recommendation.
- Inconsistent logic visible in the schema: heart failure or angina flags the minoxidil tablet but leaves the 6% minoxidil spray recommended; prostate cancer steers towards finasteride tablets; 'finasteride tablets were not effective' still recommends the finasteride spray.
- The men's visit has no scalp-photo step (only identity photos) and no family-history question, although the FAQ says photos are requested.
- Women's product choice ignores pattern and severity, and 'No preference' defaults to the oral, off-label tablet with a boxed warning. Self-reported bald patches, scalp rash or sudden onset do not stop or redirect a woman; only a named diagnosis does.
- No finasteride, spironolactone or other anti-androgen route for women (for example after the menopause), and no pathway at all for pregnant or breastfeeding-ineligible patients beyond 'see someone else'.
- Public pages disagree with each other (the hair-loss FAQ still says finasteride is the only prescription option; the women's page says billed every 2 months while pricing says quarterly).
- The whole engine, including every clinical branch and flag, is downloadable by anyone, which makes it easy to copy and easy to game.

**Gaps a new competitor could use**

- Show an indicative recommendation and price before asking for an email: Ro asks 3 questions and then walls everything.
- A recommendation that visibly uses what was asked (pattern, severity, goals, tablet-or-topical preference, budget) instead of one fixed product order; explain why this product was chosen for this person.
- Ask the patient's own preference (tablet, topical, 'no finasteride', 'no prescription') up front: Ro's men's flow never asks it and infers it only from medical flags.
- Explained 'see a doctor first' screens for red-flag hair loss in men (patches, sudden loss, inflamed scalp), as Ro already does for women, and a useful hand-off rather than a dead end.
- A licensed-product-first pathway (finasteride 1 mg, minoxidil 5%) with compounded products as a clearly explained second step; Ro leads with the compounded spray.
- Flexible plans: Ro's hair products start at quarterly billing; a monthly or pause-any-time plan and a visible price before sign-up would stand out.
- Better women's offer: a pathway by life stage (post-partum shedding, perimenopause, PCOS) with blood-test prompts, rather than one choice between two minoxidil products.
- Use scalp photos and family history for men, and tell patients how the photo changed the plan.
- Budget and side-effect worries are captured by Ro and then ignored: answer them directly (cheapest effective option, side-effect rates, topical-only route).

## 8. Experiments run (216)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| s2-baseline-men | men | Nothing (baseline man replayed): Regrow my hair / None of the above / Didn't want or need to until now | LIVE. Screens: q20 > q22 > q26 > q55. Baseline still works. End state: account wall (screen 55: testimonials, 'Your treatment options: We offer clinically proven ingredients like finasteride, minoxidil, or both in a convenient topical spray', covered by the email pop-up 'See how much fuller your hair could be in just 3 months'). No product, strength, plan or price is shown before the wall. |
| exp-m01 | men | men-q20: 'Regrow my hair' -> 'Get thicker, fuller hair' | LIVE. Screens: q20 > q22 > q26 > q55. Same questions, same wall, same pop-up headline. Final screen text identical to the baseline replay. |
| exp-m02 | men | men-q20: 'Regrow my hair' -> 'Proactively prevent hair loss' | LIVE. Screens: q20 > q22 > q26 > q55. Same questions, same wall, same pop-up headline (the headline does not follow the goal). Final screen text identical to the baseline replay. |
| exp-m03 | men | men-q22: 'None of the above' -> 'Non-prescription solutions (e.g. Rogaine, supplements)' | LIVE. Screens: q20 > q22 > q28 > q55. Third question is reworded: 'What's the main reason you're looking for hair loss solutions now?' (q28) replaces 'What's the main reason you haven't tried hair loss treatment before?' (q26). New question answered neutrally ('I want to maximize results with a new or additional product'). Same wall. Final screen text identical to the baseline replay. |
| exp-m04 | men | men-q22: 'None of the above' -> 'Prescription medications (e.g. Propecia, oral minoxidil)' | LIVE. Screens: q20 > q22 > q28 > q55. Same branch as exp-m03: q28 replaces q26 (answered neutrally). Same wall. Final screen text identical to the baseline replay. |
| exp-m05 | men | men-q26: 'Didn't want or need to until now' -> 'Not sure it'll work' | LIVE. Screens: q20 > q22 > q26 > q55. No change: same wall. Final screen text identical to the baseline replay. |
| exp-m06 | men | men-q26: 'Didn't want or need to until now' -> 'Seems too expensive' | LIVE. Screens: q20 > q22 > q26 > q55. No change: same wall, no price or cheaper option shown. Final screen text identical to the baseline replay. |
| exp-m07 | men | men-q26: 'Didn't want or need to until now' -> 'Nervous about side effects' | LIVE. Screens: q20 > q22 > q26 > q55. No change: same wall, no reassurance screen and no steer away from finasteride. Final screen text identical to the baseline replay. |
| exp-m08 | men | men-q28 (reached via exp-m03): 'I want to maximize results…' -> 'Over-the-counter solutions didn't work for me' | LIVE. Screens: q20 > q22 > q28 > q55. No change against exp-m03: same wall. Final screen text identical to the baseline replay. |
| exp-m09 | men | men-q28 (reached via exp-m03): 'I want to maximize results…' -> 'I've experienced side effects with past solutions' | LIVE. Screens: q20 > q22 > q28 > q55. No change against exp-m03: same wall, no follow-up about the side effects before the wall. Final screen text identical to the baseline replay. |
| exp-m10 | men | Entry link: start.ro.co/fxdxbh/ -> the coupon link used by the paid-search quiz pages (fxdxbh/?c=<code>) | LIVE. Screens: q20 > q22 > q26 > q55. Same questions and same wall; no banner or price on screen. Behind the scenes the page matched the code to a coupon: 'You've got 35% off first order plus free shipping' (35% off products on the first order), valid for the men's hair schemas. Final screen text identical to the baseline replay. |
| s2-baseline-women | women | Nothing (baseline woman replayed): More than a year / Gradually / Top of head/crown / picture 3 | LIVE. Screens: q4 > q6 > q8 > q10 > q16. Baseline still works. End state: account wall (screen 16: 'Thanks for sharing. Ready to go deeper?', Sign up with Email / Continue with Google). No product, strength, plan or price is shown before the wall. |
| exp-w01 | women | women-q4: 'More than a year' -> 'Months' | LIVE. Screens: q4 > q6 > q8 > q10 > q16. No change: same questions, same wall. Final screen text identical to the baseline replay. |
| exp-w02 | women | women-q4: 'More than a year' -> 'Within the last year' | LIVE. Screens: q4 > q6 > q8 > q10 > q16. No change: same questions, same wall. Final screen text identical to the baseline replay. |
| exp-w03 | women | women-q6: 'Gradually' -> 'Suddenly' | LIVE. Screens: q4 > q6 > q8 > q10 > q16. No change: same questions, same wall; no warning for sudden loss. Final screen text identical to the baseline replay. |
| exp-w04 | women | women-q6: 'Gradually' -> 'Not sure' | LIVE. Screens: q4 > q6 > q8 > q10 > q16. No change: same questions, same wall. Final screen text identical to the baseline replay. |
| exp-w05 | women | women-q8: 'Top of head/crown' -> 'Temples' | LIVE. Screens: q4 > q6 > q8 > q16. The part-line picture question (q10) is removed; straight to the wall. Final screen text identical to the baseline replay. |
| exp-w06 | women | women-q8: 'Top of head/crown' -> 'Frontal scalp' | LIVE. Screens: q4 > q6 > q8 > q16. The part-line picture question (q10) is removed; straight to the wall. Final screen text identical to the baseline replay. |
| exp-w07 | women | women-q8: 'Top of head/crown' -> 'All over' | LIVE. Screens: q4 > q6 > q8 > q10 > q16. Part-line picture question still asked (answered '3'); same wall. Final screen text identical to the baseline replay. |
| exp-w08 | women | women-q10: picture '3' -> picture '1' (normal part) | LIVE. Screens: q4 > q6 > q8 > q10 > q16. No change: same wall (a normal part line is not turned away). Final screen text identical to the baseline replay. |
| exp-w09 | women | women-q10: picture '3' -> picture '5' (extremely wide part) | LIVE. Screens: q4 > q6 > q8 > q10 > q16. No change: same wall, no warning for the most severe picture. Final screen text identical to the baseline replay. |
| s1-baseline-men | men | Stage 1 baseline man | LIVE (stage 1). Goals > tried (none) > why not before > account wall (q55). |
| s1-men-wall-dismiss | men | At the men's wall: click 'Dismiss' on the email pop-up | LIVE (stage 1). The pop-up stays; there is no way past it without an email. |
| s1-baseline-women | women | Stage 1 baseline woman | LIVE (stage 1). How long > how started > where > part-line picture > account wall (q16). |
| s1-probe-afbkau | men | Entry link: alternative men's slug /afbkau | LIVE (stage 1). Same first question; schema hl-onb-se1 with identical content. |
| s1-probe-escptw | men | Entry link: Google Shopping slug /escptw | LIVE (stage 1). Sign-up screen comes FIRST (wall before any question). |
| s1-probe-vwayzg | otc-direct | Entry link: topical minoxidil Buy now | LIVE (stage 1). First screen is the account wall with a cart: 3-month plan, $16 a month, $48. |
| s1-probe-kwrssq | otc-direct | Entry link: Revive Shampoo | LIVE (stage 1). One plan screen ($24 per 3 months) then the account wall. |
| s1-probe-qcalmd | otc-direct | Entry link: Restore Conditioner | LIVE (stage 1). One plan screen ($24 per 3 months) then the account wall. |
| sim-m-q22-hair-loss-solutions-non-prescription | men | men-q22: None of the above -> Non-prescription solutions (e.g. Rogaine, supplements) | OFFLINE simulation of the served schema (not a live replay). Adds q28 'What’s the main reason you’re looking for hair loss solutions now?'; q240 'What hair loss treatments have you used?'; q285 'Did topical minoxidil work well for you?'. Removes q26. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q240-oral-minoxidil-d1 | men | men-q240: Topical minoxidil -> Oral minoxidil [sub-baseline sim-m-q22-hair-loss-solutions-non-prescription] | OFFLINE simulation of the served schema (not a live replay). Adds q255 'What dose of oral minoxidil did you use?'; q265 'Did oral minoxidil work well for you?'. Removes q285. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q255-oral-min-dosage-other-d2 | men | men-q255: 2.5mg daily -> Other [sub-baseline sim-m-q240-oral-minoxidil-d1] | OFFLINE simulation of the served schema (not a live replay). Adds q260 'Explain your treatment'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q265-oral-min-no-problematic-side-effects-d2 | men | men-q265: Yes, it worked well -> No, I had problematic side effects [sub-baseline sim-m-q240-oral-minoxidil-d1] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q265-oral-min-no-dose-not-effective-d2 | men | men-q265: Yes, it worked well -> No, this dose wasn't effective [sub-baseline sim-m-q240-oral-minoxidil-d1] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q265-oral-min-no-allergic-to-medication-d2 | men | men-q265: Yes, it worked well -> No, I found out I was allergic to it [sub-baseline sim-m-q240-oral-minoxidil-d1] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, oral minoxidil tablets. Recommended: oral finasteride (was Ro Mane Spray). |
| sim-m-q265-oral-min-effectiveness-other-d2 | men | men-q265: Yes, it worked well -> Other [sub-baseline sim-m-q240-oral-minoxidil-d1] | OFFLINE simulation of the served schema (not a live replay). Adds q270 'Explain your treatment'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q240-oral-finasteride-d1 | men | men-q240: Topical minoxidil -> Oral Finasteride [sub-baseline sim-m-q22-hair-loss-solutions-non-prescription] | OFFLINE simulation of the served schema (not a live replay). Adds q305 'What dose of oral finasteride did you use?'; q315 'Did oral finasteride work well for you?'. Removes q285. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q305-oral-fin-dosage-other-d2 | men | men-q305: 1mg -> Other [sub-baseline sim-m-q240-oral-finasteride-d1] | OFFLINE simulation of the served schema (not a live replay). Adds q310 'Explain your treatment'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q315-oral-fin-no-problematic-side-effects-d2 | men | men-q315: Yes, it worked well -> No, I had problematic side effects [sub-baseline sim-m-q240-oral-finasteride-d1] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, finasteride tablets. Recommended: oral minoxidil (was Ro Mane Spray). |
| sim-m-q315-oral-fin-no-dose-not-effective-d2 | men | men-q315: Yes, it worked well -> No, this dose wasn't effective [sub-baseline sim-m-q240-oral-finasteride-d1] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: finasteride tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q315-oral-fin-no-allergic-to-medication-d2 | men | men-q315: Yes, it worked well -> No, I found out I was allergic to it [sub-baseline sim-m-q240-oral-finasteride-d1] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, finasteride tablets. Recommended: oral minoxidil (was Ro Mane Spray). |
| sim-m-q315-oral-fin-effectiveness-other-d2 | men | men-q315: Yes, it worked well -> Other [sub-baseline sim-m-q240-oral-finasteride-d1] | OFFLINE simulation of the served schema (not a live replay). Adds q320 'Explain your treatment'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q240-topical-finasteride-d1 | men | men-q240: Topical minoxidil -> Topical finasteride [sub-baseline sim-m-q22-hair-loss-solutions-non-prescription] | OFFLINE simulation of the served schema (not a live replay). Adds q335 'Did topical finasteride work well for you?'. Removes q285. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q335-topical-fin-no-allergic-to-medication-d2 | men | men-q335: Yes, it worked well -> No, I found out I was allergic to it [sub-baseline sim-m-q240-topical-finasteride-d1] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray. Recommended: oral finasteride (was Ro Mane Spray). |
| sim-m-q335-topical-fin-effectiveness-other-d2 | men | men-q335: Yes, it worked well -> Other [sub-baseline sim-m-q240-topical-finasteride-d1] | OFFLINE simulation of the served schema (not a live replay). Adds q340 'Explain your treatment'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q240-steroid-injections-d1 | men | men-q240: Topical minoxidil -> Steroid injections in the scalp [sub-baseline sim-m-q22-hair-loss-solutions-non-prescription] | OFFLINE simulation of the served schema (not a live replay). Removes q285. No-recommend flags set: Ro Mane Spray, finasteride tablets, oral minoxidil tablets. Recommended: no-recommendation (was Ro Mane Spray). |
| sim-m-q240-other-treatment-d1 | men | men-q240: Topical minoxidil -> Other [sub-baseline sim-m-q22-hair-loss-solutions-non-prescription] | OFFLINE simulation of the served schema (not a live replay). Adds q355 'Explain your treatment'. Removes q285. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q285-topical-min-no-allergic-to-medication-d1 | men | men-q285: Yes, it worked well -> No, I found out I was allergic to it [sub-baseline sim-m-q22-hair-loss-solutions-non-prescription] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray. Recommended: oral finasteride (was Ro Mane Spray). |
| sim-m-q285-topical-min-effectiveness-other-d1 | men | men-q285: Yes, it worked well -> Other [sub-baseline sim-m-q22-hair-loss-solutions-non-prescription] | OFFLINE simulation of the served schema (not a live replay). Adds q290 'Explain your treatment'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q22-hair-loss-solutions-prescription-medicat | men | men-q22: None of the above -> Prescription medications (e.g. Propecia, oral minoxidil) | OFFLINE simulation of the served schema (not a live replay). Adds q28 'What’s the main reason you’re looking for hair loss solutions now?'; q240 'What hair loss treatments have you used?'; q285 'Did topical minoxidil work well for you?'. Removes q26. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q132-patches | men | men-q132: Hairline (along my forehead or temples) + Crown (top of my head) -> Random golf-ball size bald patches scattered all over scalp | OFFLINE simulation of the served schema (not a live replay). Removes q150, q160, q170. No-recommend flags set: Ro Mane Spray, finasteride tablets, oral minoxidil tablets. Recommended: no-recommendation (was Ro Mane Spray). |
| sim-m-q132-prevent-hair-loss | men | men-q132: Hairline (along my forehead or temples) + Crown (top of my head) -> Nowhere yet, but I’d like to prevent future hair loss | OFFLINE simulation of the served schema (not a live replay). Removes q150, q160, q170. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q150-very-suddenly | men | men-q150: Gradually -> Very suddenly | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, finasteride tablets, oral minoxidil tablets. Recommended: no-recommendation (was Ro Mane Spray). |
| sim-m-q170-redness-or-rashes | men | men-q170: None of the above -> Redness or rashes on scalp | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, finasteride tablets, oral minoxidil tablets. Recommended: no-recommendation (was Ro Mane Spray). |
| sim-m-q370-yes-have-been-diagnosed-or-treated-for-h | men | men-q370: No -> Yes, for high blood pressure | OFFLINE simulation of the served schema (not a live replay). Adds q381 'Since being diagnosed with or treated for high blood pressure, have your blood pressure re'; q395 'High or low blood pressure readings can be associated with increased risks when using cert'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q381-yes-very-high-bp-reading-d1 | men | men-q381: No, my blood pressure reading is never “very high” -> Yes, I still have “very high” blood pressure readings [sub-baseline sim-m-q370-yes-have-been-diagnosed-or-treated-for-h] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q370-yes-have-been-diagnosed-or-treated-for-l | men | men-q370: No -> Yes, for low blood pressure | OFFLINE simulation of the served schema (not a live replay). Adds q391 'Since being diagnosed with or treated for low blood pressure, have your blood pressure rea'; q395 'High or low blood pressure readings can be associated with increased risks when using cert'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q391-yes-very-low-bp-reading-d1 | men | men-q391: No, my blood pressure reading is never “low” -> Yes, I still have “low” blood pressure readings [sub-baseline sim-m-q370-yes-have-been-diagnosed-or-treated-for-l] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, finasteride tablets, oral minoxidil tablets. Recommended: no-recommendation (was Ro Mane Spray). |
| sim-m-q370-not-sure-if-diagnosed-or-treated-for-hig | men | men-q370: No -> I'm not sure | OFFLINE simulation of the served schema (not a live replay). Adds q395 'High or low blood pressure readings can be associated with increased risks when using cert'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1000-stroke | men | men-q1000: None of the above -> Stroke | OFFLINE simulation of the served schema (not a live replay). Adds q1255 'What type of stroke did you have?'; q1260 'When did your stroke occur?'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1260-stroke-less-than-6-months-d1 | men | men-q1260: 2+ years ago -> Less than 6 months ago [sub-baseline sim-m-q1000-stroke] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1000-prostate-cancer | men | men-q1000: None of the above -> Prostate cancer | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray. Recommended: oral finasteride (was Ro Mane Spray). |
| sim-m-q1000-kidney-disease | men | men-q1000: None of the above -> Kidney disease | OFFLINE simulation of the served schema (not a live replay). Adds q1275 'What kind of kidney disease do you have?'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1000-liver-diseases | men | men-q1000: None of the above -> Liver failure or liver cirrhosis | OFFLINE simulation of the served schema (not a live replay). Adds q1285 'Which of these liver conditions do you have?'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1000-erectile-dysfunction | men | men-q1000: None of the above -> Erectile dysfunction | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, finasteride tablets. Recommended: oral minoxidil (was Ro Mane Spray). |
| sim-m-q1000-anxiety | men | men-q1000: None of the above -> Anxiety | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, finasteride tablets. Recommended: oral minoxidil (was Ro Mane Spray). |
| sim-m-q1000-depression | men | men-q1000: None of the above -> Depression | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, finasteride tablets. Recommended: oral minoxidil (was Ro Mane Spray). |
| sim-m-q1000-pheochromocytoma | men | men-q1000: None of the above -> Pheochromocytoma (adrenal gland tumor) | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1300-angina | men | men-q1300: None of the above -> Repeated chest pain or tightness, also called angina | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1300-heart-attack | men | men-q1300: None of the above -> Heart attack | OFFLINE simulation of the served schema (not a live replay). Adds q1315 'When did your heart attack occur?'; q1320 'Are you seeing a cardiologist regularly for your history of heart attack?'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1315-heart-attack-less-than-6-months-d1 | men | men-q1315: 2+ years ago -> Less than 6 months ago [sub-baseline sim-m-q1300-heart-attack] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1320-heart-attack-seeing-cardiologist-no-d1 | men | men-q1320: Yes -> No [sub-baseline sim-m-q1300-heart-attack] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1300-coronary-bypass-surgery | men | men-q1300: None of the above -> Coronary bypass surgery | OFFLINE simulation of the served schema (not a live replay). Adds q1355 'When was your coronary bypass surgery?'; q1360 'Are you seeing a cardiologist regularly as a follow-up to your coronary bypass surgery?'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1355-coronary-bypass-surgery-less-than-6-mont-d1 | men | men-q1355: 2+ years ago -> Less than 6 months ago [sub-baseline sim-m-q1300-coronary-bypass-surgery] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1360-coronary-bypass-surgery-seeing-cardiolog-d1 | men | men-q1360: Yes -> No [sub-baseline sim-m-q1300-coronary-bypass-surgery] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1300-heart-failure | men | men-q1300: None of the above -> Heart failure | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1300-arrhythmia | men | men-q1300: None of the above -> Arrhythmia | OFFLINE simulation of the served schema (not a live replay). Adds q1420 'What type of arrhythmia have you been diagnosed with?'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1420-atrial-fibrillation-d1 | men | men-q1420: Premature ventricular contractions (PVCs) -> Atrial fibrillation (afib) [sub-baseline sim-m-q1300-arrhythmia] | OFFLINE simulation of the served schema (not a live replay). Adds q1430 'Have you had an ablation procedure?'; q1440 'Are you currently taking any medications for your afib?'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1430-ablation-procedure-yes-d2 | men | men-q1430: No -> Yes [sub-baseline sim-m-q1420-atrial-fibrillation-d1] | OFFLINE simulation of the served schema (not a live replay). Adds q1435 'Have you had afib since your ablation?'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1420-atrial-flutter-d1 | men | men-q1420: Premature ventricular contractions (PVCs) -> Atrial flutter [sub-baseline sim-m-q1300-arrhythmia] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1420-bradycardia-d1 | men | men-q1420: Premature ventricular contractions (PVCs) -> Bradycardia [sub-baseline sim-m-q1300-arrhythmia] | OFFLINE simulation of the served schema (not a live replay). Adds q1455 'What is your resting heart rate?'; q1460 'Have you ever fainted due to a low heart rate?'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1455-resting-rate-less-than-50-d2 | men | men-q1455: 60-69 -> Less than 50 [sub-baseline sim-m-q1420-bradycardia-d1] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1460-fainted-from-low-heart-rate-yes-d2 | men | men-q1460: No -> Yes [sub-baseline sim-m-q1420-bradycardia-d1] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1420-paroxysmal-supraventricular-tachycardia-d1 | men | men-q1420: Premature ventricular contractions (PVCs) -> Paroxysmal supraventricular tachycardia (PSVT) [sub-baseline sim-m-q1300-arrhythmia] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1420-wolff-parkinson-white-syndrome-d1 | men | men-q1420: Premature ventricular contractions (PVCs) -> Wolff-Parkinson-White syndrome [sub-baseline sim-m-q1300-arrhythmia] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1420-ventricular-fibrillation-d1 | men | men-q1420: Premature ventricular contractions (PVCs) -> Ventricular fibrillation [sub-baseline sim-m-q1300-arrhythmia] | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1420-arrhythmia-type-other-d1 | men | men-q1420: Premature ventricular contractions (PVCs) -> Other [sub-baseline sim-m-q1300-arrhythmia] | OFFLINE simulation of the served schema (not a live replay). Adds q1475 'Please explain your arrhythmia diagnosis'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1300-pericarditis | men | men-q1300: None of the above -> Pericarditis | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q1300-pulmonary-hypertension | men | men-q1300: None of the above -> Pulmonary hypertension | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: oral minoxidil tablets. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q2350-trying-to-get-pregnant-yes-we-are | men | men-q2350: No, we are not -> Yes, we are | OFFLINE simulation of the served schema (not a live replay). Adds q2355 'A word of caution if you’re planning to get pregnant.'. No-recommend flags set: Ro Mane Spray, finasteride tablets. Recommended: oral minoxidil (was Ro Mane Spray). |
| sim-m-q2510-yes | men | men-q2510: No -> Yes | OFFLINE simulation of the served schema (not a live replay). Adds q2520 'Please leave your message to your doctor here.'. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q132-hairline+patches | men | men-q132: Hairline + Crown -> Hairline + Random golf-ball size bald patches (mixed pick) | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, finasteride tablets, oral minoxidil tablets. Recommended: no-recommendation (was Ro Mane Spray). |
| sim-m-q112-under18 | men | men-q112 (basics): age 32 -> under 18 | OFFLINE simulation of the served schema (not a live replay). Adds q7010 'How can we help?'. Removes the rest of the visit (14 later screens). Visit ends before any recommendation. |
| sim-m-q112-female | men | men-q112 (basics): male -> female | OFFLINE simulation of the served schema (not a live replay). Adds q7062 'How can we help?'. Removes the rest of the visit (14 later screens). Visit ends before any recommendation. |
| sim-m-q112-zip | men | men-q112 (basics): served zip -> zip not served | OFFLINE simulation of the served schema (not a live replay). Adds q7030 'Be notified when we’re in your area!'. Removes the rest of the visit (14 later screens). Visit ends before any recommendation. |
| sim-m-age70 | men | men-q112 (basics): age 32 -> 70 | OFFLINE simulation of the served schema (not a live replay). No change to the questions. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-q22-both | men | men-q22: None of the above -> both "tried" boxes | OFFLINE simulation of the served schema (not a live replay). Adds q28 'What’s the main reason you’re looking for hair loss solutions now?'; q240 'What hair loss treatments have you used?'; q285 'Did topical minoxidil work well for you?'. Removes q26. No-recommend flags set: none. Recommended stays Ro Mane Spray; all three treatments still listed. |
| sim-m-combo-dep+hf | men | TWO changes: depression (q1000) + heart failure (q1300) | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, finasteride tablets, oral minoxidil tablets. Recommended: no-recommendation (was Ro Mane Spray). |
| sim-m-combo-pc+brady | men | THREE changes: prostate cancer + depression + heart failure | OFFLINE simulation of the served schema (not a live replay). No-recommend flags set: Ro Mane Spray, finasteride tablets, oral minoxidil tablets. Recommended: no-recommendation (was Ro Mane Spray). |
| sim-m-old-flow | men | experiment mhlConsultativeOv switched off (older two-product screen) | OFFLINE simulation of the served schema (not a live replay). Adds q3180 'Treatment Details'; q3200 'Do you have a specific treatment for hair loss that you would prefer to be prescribed?'. Removes q2350, q3177, q3178. Visit ends before any recommendation. |
| sim-m-q20-noeffect | men | men-q20: 'Regrow my hair' -> each of, one at a time: 'Get thicker, fuller hair'; 'Proactively prevent hair loss' | OFFLINE simulation of the served schema (not a live replay). 2 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q28-noeffect-sub | men | men-q28: 'I want to maximize results with a new or additional product' -> each of, one at a time: 'Over-the-counter solutions didn't work for me'; 'I want an easier or more convenient solution (like a pill or a spray)'; 'I’ve experienced side effects with past solutions' [sub-baseline sim-m-q22-hair-loss-solutions-non-prescription] | OFFLINE simulation of the served schema (not a live replay). 3 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q255-noeffect-sub | men | men-q255: '2.5mg daily' -> each of, one at a time: '2.0mg daily'; '3.0mg daily'; '3.5mg daily'; '4.0mg daily'; '5.0mg daily' [sub-baseline sim-m-q240-oral-minoxidil-d1] | OFFLINE simulation of the served schema (not a live replay). 5 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q335-noeffect-sub | men | men-q335: 'Yes, it worked well' -> each of, one at a time: 'No, I had problematic side effects'; 'No, it wasn’t effective' [sub-baseline sim-m-q240-topical-finasteride-d1] | OFFLINE simulation of the served schema (not a live replay). 2 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q285-noeffect-sub | men | men-q285: 'Yes, it worked well' -> each of, one at a time: 'No, I had problematic side effects'; 'No, it wasn’t effective' [sub-baseline sim-m-q22-hair-loss-solutions-non-prescription] | OFFLINE simulation of the served schema (not a live replay). 2 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q26-noeffect | men | men-q26: 'Didn't want or need to until now' -> each of, one at a time: 'Not sure it'll work'; 'Seems too expensive'; 'Nervous about side effects' | OFFLINE simulation of the served schema (not a live replay). 3 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q132-noeffect | men | men-q132: 'Hairline (along my forehead or temples) + Crown (top of my head)' -> each of, one at a time: 'Hairline (along my forehead or temples)'; 'Crown (top of my head)'; 'Overall thinning' | OFFLINE simulation of the served schema (not a live replay). 3 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q150-noeffect | men | men-q150: 'Gradually' -> each of, one at a time: 'Not sure' | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q160-noeffect | men | men-q160: 'Moderate' -> each of, one at a time: 'Very mild'; 'Mild'; 'Severe'; 'Extremely severe' | OFFLINE simulation of the served schema (not a live replay). 4 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q170-noeffect | men | men-q170: 'None of the above' -> each of, one at a time: 'Pain, soreness, burning, and/or tingling in areas of hair loss'; 'Recurrent pus bumps or open sores on scalp'; 'Partial or complete loss of eyebrows or eyelashes' | OFFLINE simulation of the served schema (not a live replay). 3 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q381-noeffect-sub | men | men-q381: 'No, my blood pressure reading is never “very high”' -> each of, one at a time: 'I’m not sure' [sub-baseline sim-m-q370-yes-have-been-diagnosed-or-treated-for-h] | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q391-noeffect-sub | men | men-q391: 'No, my blood pressure reading is never “low”' -> each of, one at a time: 'I’m not sure' [sub-baseline sim-m-q370-yes-have-been-diagnosed-or-treated-for-l] | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q1255-noeffect-sub | men | men-q1255: 'Ischemic stroke: a blood vessel was blocked by a clot or plaque' -> each of, one at a time: 'Hemorrhagic stroke: a blood vessel leaked blood into the brain' [sub-baseline sim-m-q1000-stroke] | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q1260-noeffect-sub | men | men-q1260: '2+ years ago' -> each of, one at a time: '7-12 months ago'; '1-2 years ago' [sub-baseline sim-m-q1000-stroke] | OFFLINE simulation of the served schema (not a live replay). 2 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q1275-noeffect-sub | men | men-q1275: 'Chronic kidney disease stage 1' -> each of, one at a time: 'Temporary decrease in kidney function only'; 'Chronic kidney disease stage 2'; 'Chronic kidney disease stage 3a'; 'Chronic kidney disease stage 3b'; 'Chronic kidney disease stage 4'; 'Chronic kidney disease stage 5 (kidney failure)' [sub-baseline sim-m-q1000-kidney-disease] | OFFLINE simulation of the served schema (not a live replay). 6 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q1285-noeffect-sub | men | men-q1285: 'Liver cirrhosis' -> each of, one at a time: 'Liver failure'; 'Both' [sub-baseline sim-m-q1000-liver-diseases] | OFFLINE simulation of the served schema (not a live replay). 2 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q1300-noeffect | men | men-q1300: 'None of the above' -> each of, one at a time: 'Coronary artery disease, or narrowing of the heart vessels' | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q1315-noeffect-sub | men | men-q1315: '2+ years ago' -> each of, one at a time: '7-12 months ago'; '1-2 years ago' [sub-baseline sim-m-q1300-heart-attack] | OFFLINE simulation of the served schema (not a live replay). 2 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q1355-noeffect-sub | men | men-q1355: '2+ years ago' -> each of, one at a time: '7-12 months ago'; '1-2 years ago' [sub-baseline sim-m-q1300-coronary-bypass-surgery] | OFFLINE simulation of the served schema (not a live replay). 2 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q1435-noeffect-sub | men | men-q1435: 'No' -> each of, one at a time: 'Yes' [sub-baseline sim-m-q1430-ablation-procedure-yes-d2] | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q1440-noeffect-sub | men | men-q1440: 'No' -> each of, one at a time: 'Yes' [sub-baseline sim-m-q1420-atrial-fibrillation-d1] | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q1455-noeffect-sub | men | men-q1455: '60-69' -> each of, one at a time: '50-59'; '70+' [sub-baseline sim-m-q1420-bradycardia-d1] | OFFLINE simulation of the served schema (not a live replay). 2 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q2200-noeffect | men | men-q2200: 'I don't take any medications' -> each of, one at a time: 'I’m taking medications' | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q2300-noeffect | men | men-q2300: 'I don't have allergies' -> each of, one at a time: 'I have allergies' | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-m-q2400-noeffect | men | men-q2400: 'None of the above' -> each of, one at a time: 'Weight loss'; 'Stronger erections'; 'Climax control'; 'Herpes or cold sores outbreaks'; 'Longevity'; 'Nutrition'; 'Skincare' | OFFLINE simulation of the served schema (not a live replay). 7 option(s): no question added or removed, no flag set, outcome unchanged (Ro Mane Spray). |
| sim-w-q8-temples | women | women-q8: Top of head/crown -> Temples | OFFLINE simulation of the served schema (not a live replay). Removes q10. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q8-frontal-scalp | women | women-q8: Top of head/crown -> Frontal scalp | OFFLINE simulation of the served schema (not a live replay). Removes q10. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1055-yes | women | women-q1055: No -> Yes | OFFLINE simulation of the served schema (not a live replay). Adds q6020 'Unfortunately, our treatments are not available for use during pregnancy.'. Removes the rest of the visit (23 later screens). Outcome: STOP: pregnancy (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1055-not-sure | women | women-q1055: No -> Not sure | OFFLINE simulation of the served schema (not a live replay). Adds q6020 'Unfortunately, our treatments are not available for use during pregnancy.'. Removes the rest of the visit (23 later screens). Outcome: STOP: pregnancy (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1057-yes | women | women-q1057: No -> Yes | OFFLINE simulation of the served schema (not a live replay). Adds q4030 'Thanks for providing all the information {firstName}'. Removes q4025. Outcome: Hair Solution Rx only (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1083-yes | women | women-q1083: No -> Yes | OFFLINE simulation of the served schema (not a live replay). Adds q1084 'Please share more details: How long ago and were any lab tests done? Did the doctor remove'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1086-alopecia-areata | women | women-q1086: None of the above -> Alopecia areata | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (12 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1086-lichen-planopilaris | women | women-q1086: None of the above -> Lichen planopilaris | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (12 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1086-frontal-fibrosing-alopecia-ffa | women | women-q1086: None of the above -> Frontal fibrosing alopecia (FFA) | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (12 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1086-central-centrifugal-cicatricial-alopecia | women | women-q1086: None of the above -> Central centrifugal cicatricial alopecia (CCCA) | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (12 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1086-traction-alopecia | women | women-q1086: None of the above -> Traction alopecia | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (12 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1086-lupus | women | women-q1086: None of the above -> Lupus | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (12 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1090-enlargement-of-the-clitoris | women | women-q1090: None of the above -> Enlargement of the clitoris | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (11 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1090-discharge-from-the-nipples | women | women-q1090: None of the above -> Discharge from the nipple(s) | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (11 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1090-deepening-of-your-voice | women | women-q1090: None of the above -> Deepening of your voice | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (11 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1096-heart-condition-coronary-artery-disease- | women | women-q1096: None of the above -> Heart condition (coronary artery disease, angina/chest pain, heart failure, heart attack, pericarditis) | OFFLINE simulation of the served schema (not a live replay). Adds q1160 'Please describe your heart related condition(s).'; q4030 'Thanks for providing all the information {firstName}'. Removes q4025. Outcome: Hair Solution Rx only (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1096-stroke | women | women-q1096: None of the above -> Stroke | OFFLINE simulation of the served schema (not a live replay). Adds q1162 'Please tell us more about your stroke.'; q4030 'Thanks for providing all the information {firstName}'. Removes q4025. Outcome: Hair Solution Rx only (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1096-kidney-disease | women | women-q1096: None of the above -> Kidney disease | OFFLINE simulation of the served schema (not a live replay). Adds q1164 'Please tell us more about your kidney disease.'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1096-liver-disease | women | women-q1096: None of the above -> Liver disease | OFFLINE simulation of the served schema (not a live replay). Adds q1166 'Please tell us more about your liver disease.'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1096-thyroid-disorder | women | women-q1096: None of the above -> Thyroid disorder | OFFLINE simulation of the served schema (not a live replay). Adds q1172 'Please describe your thyroid condition and let us know if you’re currently receiving treat'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1096-anemia-low-red-blood-cell-count | women | women-q1096: None of the above -> Anemia (low red blood cell count) | OFFLINE simulation of the served schema (not a live replay). Adds q1168 'Please describe your condition and let us know if you’re currently anemic.'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1096-iron-deficiency | women | women-q1096: None of the above -> Iron deficiency | OFFLINE simulation of the served schema (not a live replay). Adds q1170 'Please let us know when you were diagnosed with iron deficiency and if you’re currently ta'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1096-polycystic-ovary-disease | women | women-q1096: None of the above -> Polycystic ovary disease | OFFLINE simulation of the served schema (not a live replay). Adds q1174 'Please let us know when you were diagnosed with PCOS and if you’re currently receiving tre'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1096-lupus-or-other-autoimmune-disorder | women | women-q1096: None of the above -> Lupus or other autoimmune disorder | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (9 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1096-pheochromocytoma-adrenal-gland-tumor | women | women-q1096: None of the above -> Pheochromocytoma (adrenal gland tumor) | OFFLINE simulation of the served schema (not a live replay). Adds q1178 'Please tell us more about your pheochromocytoma.'; q4030 'Thanks for providing all the information {firstName}'. Removes q4025. Outcome: Hair Solution Rx only (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1096-pulmonary-hypertension | women | women-q1096: None of the above -> Pulmonary hypertension | OFFLINE simulation of the served schema (not a live replay). Adds q1180 'Please tell us more about your pulmonary hypertension.'; q4030 'Thanks for providing all the information {firstName}'. Removes q4025. Outcome: Hair Solution Rx only (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1096-high-blood-pressure | women | women-q1096: None of the above -> High blood pressure | OFFLINE simulation of the served schema (not a live replay). Adds q1182 'Please let us know when you were diagnosed, and whether you have taken or are currently ta'; q4030 'Thanks for providing all the information {firstName}'. Removes q4025. Outcome: Hair Solution Rx only (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1185-yes | women | women-q1185: No -> Yes | OFFLINE simulation of the served schema (not a live replay). Adds q1186 'Please tell us more, including whether you’ve ever had any symptoms of low blood pressure,'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1250-oral-minoxidil | women | women-q1250: None of the above -> Oral minoxidil | OFFLINE simulation of the served schema (not a live replay). Adds q1254 'As far as you know, do you have an allergy to oral minoxidil?'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1254-yes-d1 | women | women-q1254: No -> Yes [sub-baseline sim-w-q1250-oral-minoxidil] | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (7 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1250-topical-minoxidil | women | women-q1250: None of the above -> Topical minoxidil | OFFLINE simulation of the served schema (not a live replay). Adds q1256 'As far as you know, do you have an allergy to topical minoxidil?'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1256-yes-d1 | women | women-q1256: No -> Yes [sub-baseline sim-w-q1250-topical-minoxidil] | OFFLINE simulation of the served schema (not a live replay). Adds q1258 'What form of topical minoxidil did you have an allergic reaction to?'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q1258-foam-d2 | women | women-q1258: Liquid -> Foam [sub-baseline sim-w-q1256-yes-d1] | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (7 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1258-both-d2 | women | women-q1258: Liquid -> Both [sub-baseline sim-w-q1256-yes-d1] | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (7 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1250-steroid-injections-into-the-scalp | women | women-q1250: None of the above -> Steroid injections into the scalp | OFFLINE simulation of the served schema (not a live replay). Adds q6040 'Based on some of your responses, we will unfortunately be unable to evaluate and treat you'. Removes the rest of the visit (7 later screens). Outcome: STOP: see an in-person dermatologist (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1626-yes | women | women-q1626: No -> Yes | OFFLINE simulation of the served schema (not a live replay). Adds q1627 'Please list your past surgeries and procedures.'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q2200-other | women | women-q2200: I prefer not to answer -> Other | OFFLINE simulation of the served schema (not a live replay). Adds q2202 'Please list your ethnicity.'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-age17 | women | women-q30 (basics): age 38 -> under 18 | OFFLINE simulation of the served schema (not a live replay). Adds q6010 'Unfortunately we are not currently able to treat anyone under the age of 18 on our platfor'. Removes the rest of the visit (25 later screens). Outcome: STOP: under 18 (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-male | women | women-q30 (basics): female -> male | OFFLINE simulation of the served schema (not a live replay). Adds q6030 'Want to be redirected to the men's hair loss visit?'. Removes the rest of the visit (25 later screens). Outcome: redirect to men (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-zip | women | women-q30 (basics): served zip -> zip not served | OFFLINE simulation of the served schema (not a live replay). Adds q6000 'Be notified when we’re in your state!'. Removes the rest of the visit (25 later screens). Outcome: STOP: zip (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-age18 | women | women-q30 (basics): age 38 -> 18 | OFFLINE simulation of the served schema (not a live replay). Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-age21 | women | women-q30 (basics): age 38 -> 21 | OFFLINE simulation of the served schema (not a live replay). Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-age64 | women | women-q30 (basics): age 38 -> 64 | OFFLINE simulation of the served schema (not a live replay). Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-age65 | women | women-q30 (basics): age 38 -> 65 | OFFLINE simulation of the served schema (not a live replay). Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-age66 | women | women-q30 (basics): age 38 -> 66 | OFFLINE simulation of the served schema (not a live replay). Adds q4030 'Thanks for providing all the information {firstName}'. Removes q4025. Outcome: Hair Solution Rx only (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-age80 | women | women-q30 (basics): age 38 -> 80 | OFFLINE simulation of the served schema (not a live replay). Adds q4030 'Thanks for providing all the information {firstName}'. Removes q4025. Outcome: Hair Solution Rx only (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q8-temples+frontal | women | women-q8: Top of head/crown -> Temples + Frontal scalp | OFFLINE simulation of the served schema (not a live replay). Removes q10. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-combo-bf+age66 | women | TWO changes: breastfeeding + age 66 | OFFLINE simulation of the served schema (not a live replay). Adds q4030 'Thanks for providing all the information {firstName}'. Removes q4025. Outcome: Hair Solution Rx only (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-combo-liquid-allergy | women | women: used topical minoxidil, allergic, to the LIQUID form | OFFLINE simulation of the served schema (not a live replay). Adds q1256 'As far as you know, do you have an allergy to topical minoxidil?'; q1258 'What form of topical minoxidil did you have an allergic reaction to?'. Outcome unchanged: choice: Oral Minoxidil / Hair Solution Rx / No preference. |
| sim-w-q4025-oral | women | women-q4025 (choice screen): pick Oral Minoxidil | OFFLINE simulation of the served schema (not a live replay). Adds q4040 'Thanks for providing all the information {firstName}'; q4042 'Please take a moment to understand the possible side effects of this medication.'; q5041 'Shipping Info'. Outcome: ended at qid 5041 (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q4025-topical | women | women-q4025 (choice screen): pick Hair Solution Rx | OFFLINE simulation of the served schema (not a live replay). Adds q4030 'Thanks for providing all the information {firstName}'; q5042 'Shipping Info'. Outcome: ended at qid 5042 (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q4025-nopref | women | women-q4025 (choice screen): pick No preference | OFFLINE simulation of the served schema (not a live replay). Adds q5041 'Shipping Info'. Outcome: ended at qid 5041 (was: choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q4-noeffect | women | women-q4: 'More than a year' -> each of, one at a time: 'Months'; 'Within the last year' | OFFLINE simulation of the served schema (not a live replay). 2 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q6-noeffect | women | women-q6: 'Gradually' -> each of, one at a time: 'Suddenly'; 'Not sure' | OFFLINE simulation of the served schema (not a live replay). 2 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q8-noeffect | women | women-q8: 'Top of head/crown' -> each of, one at a time: 'All over' | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q10-noeffect | women | women-q10: '3' -> each of, one at a time: '1'; '2'; '4'; '5' | OFFLINE simulation of the served schema (not a live replay). 4 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1059-noeffect | women | women-q1059: 'No' -> each of, one at a time: 'Yes' | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q12-noeffect | women | women-q12: 'Moderate' -> each of, one at a time: 'Very Mild'; 'Mild'; 'Severe'; 'Extremely severe' | OFFLINE simulation of the served schema (not a live replay). 4 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1062-noeffect | women | women-q1062: 'My hair is gradually thinning (I’m slowly noticing more of my scalp showing thro' -> each of, one at a time: 'I’m shedding more hair than is normal for me (I notice more fallout in'; 'Both'; 'Unsure' | OFFLINE simulation of the served schema (not a live replay). 3 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1070-noeffect | women | women-q1070: '2' -> each of, one at a time: '1'; '3'; '4'; '5' | OFFLINE simulation of the served schema (not a live replay). 4 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1074-noeffect | women | women-q1074: 'None of the above' -> each of, one at a time: 'A patch or patches of hair loss that is nearly or completely bald'; 'Pain, soreness, burning, and/or tingling in areas of hair loss'; 'Redness or rashes on scalp'; 'Recurrent pus bumps or open sores on scalp'; 'Partial or complete loss of eyebrows or eyelashes' | OFFLINE simulation of the served schema (not a live replay). 5 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1076-noeffect | women | women-q1076: 'Yes' -> each of, one at a time: 'No'; 'I don't know' | OFFLINE simulation of the served schema (not a live replay). 2 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1078-noeffect | women | women-q1078: '3 - Somewhat' -> each of, one at a time: '1 - Not at all'; '2 - A little bit'; '4 - Quite a bit'; '5 - A lot' | OFFLINE simulation of the served schema (not a live replay). 4 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1080-noeffect | women | women-q1080: '3 - Somewhat' -> each of, one at a time: '1 - Not at all'; '2 - A little bit'; '4 - Quite a bit'; '5 - A lot' | OFFLINE simulation of the served schema (not a live replay). 4 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1090-noeffect | women | women-q1090: 'None of the above' -> each of, one at a time: 'Excess body hair on chest, abdomen, back'; 'Excess facial hair'; 'Severe acne'; 'Irregular periods' | OFFLINE simulation of the served schema (not a live replay). 4 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1094-noeffect | women | women-q1094: 'None of the above' -> each of, one at a time: 'Gone through perimenopause or menopause'; 'Significant weight loss'; 'Flare of a chronic disease'; 'Hospitalization'; 'Major illness (e.g. COVID)'; 'Major life stressor (e.g. moving, job loss, ending a relationship, or '; 'Started, stopped, or changed birth control pills or any other kind of '; 'Received chemotherapy as part of cancer treatment'; 'Major surgery' | OFFLINE simulation of the served schema (not a live replay). 9 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1250-noeffect | women | women-q1250: 'None of the above' -> each of, one at a time: 'Spironolactone'; 'Oral supplements (e.g. Biotin, Nutrafol, Viviscal)'; 'Other' | OFFLINE simulation of the served schema (not a live replay). 3 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1254-noeffect-sub | women | women-q1254: 'No' -> each of, one at a time: 'Unsure' [sub-baseline sim-w-q1250-oral-minoxidil] | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1256-noeffect-sub | women | women-q1256: 'No' -> each of, one at a time: 'Unsure' [sub-baseline sim-w-q1250-topical-minoxidil] | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1620-noeffect | women | women-q1620: 'I don't have any conditions' -> each of, one at a time: 'I have conditions' | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1630-noeffect | women | women-q1630: 'I don't take any medications' -> each of, one at a time: 'I’m taking medications' | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q1640-noeffect | women | women-q1640: 'I don't have allergies' -> each of, one at a time: 'I have allergies' | OFFLINE simulation of the served schema (not a live replay). 1 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| sim-w-q2200-noeffect | women | women-q2200: 'I prefer not to answer' -> each of, one at a time: 'White'; 'Hispanic or Latino'; 'Black or African American'; 'Native American or American Indian'; 'Asian / Pacific Islander' | OFFLINE simulation of the served schema (not a live replay). 5 option(s): no question added or removed, no flag set, outcome unchanged (choice: Oral Minoxidil / Hair Solution Rx / No preference). |
| verify-baseline-men | men | Nothing (baseline man replayed fresh in stage 3) | LIVE. Screens: q20 > q22 > q26 > q55. Wall screen text identical to the stage 2 baseline (runs/s2-baseline-men). |
| verify-baseline-women | women | Nothing (baseline woman replayed fresh in stage 3) | LIVE. Screens: q4 > q6 > q8 > q10 > q16. Wall screen text identical to the stage 2 baseline (runs/s2-baseline-women). |
| verify-m-dismiss | men | Baseline, then click 'Dismiss' on the email pop-up | LIVE. The pop-up stays and the page stays on q55; there is no way past the wall without an email or Google sign-in. |
| verify-m-goals-all | men | men-q20: all three goals ticked together | LIVE. Screens: q20 > q22 > q26 > q55. Same questions, same wall; final screen text identical to the baseline. |
| verify-m-nonrx+rx | men | men-q22: 'Non-prescription' and 'Prescription medications' both ticked; men-q28: 'maximize results' | LIVE. Screens: q20 > q22 > q28 > q55 (q28 replaces q26, as fork 25 says). Final screen text identical to the baseline. |
| verify-m-rx-easier | men | men-q22: 'Prescription medications'; men-q28: 'I want an easier or more convenient solution' | LIVE. Screens: q20 > q22 > q28 > q55. The last untested pre-wall option; no change, final screen text identical to the baseline. |
| verify-m-coupon | men | Entry link: the paid-search coupon link fxdxbh/?c=<code> (repeat of exp-m10) | LIVE. Screens: q20 > q22 > q26 > q55, nothing on screen. The page again matched coupon 253 'You've got 35% off first order plus free shipping' (net/02). Final screen text identical to the baseline. |
| verify-w-temples | women | women-q8: 'Temples' only (repeat of exp-w05) | LIVE. Screens: q4 > q6 > q8 > q16. The part-line picture is skipped. Final screen text identical to the baseline. |
| verify-w-top+temples | women | women-q8: 'Top of head/crown' + 'Temples' | LIVE. Screens: q4 > q6 > q8 > q10 > q16. Ticking the top of the head keeps the picture question even with temples. Final screen text identical to the baseline. |
| verify-w-temples+frontal | women | women-q8: 'Temples' + 'Frontal scalp' | LIVE. Screens: q4 > q6 > q8 > q16. Picture question skipped. Final screen text identical to the baseline. |
| verify-w-sudden | women | women-q6: 'Gradually' -> 'Suddenly' (repeat of exp-w02) | LIVE. Screens: q4 > q6 > q8 > q10 > q16. No branch, no warning. Final screen text identical to the baseline. |
| verify-w-pic2 | women | women-q10: picture 3 -> picture 2 | LIVE. Screens: q4 > q6 > q8 > q10 > q16. No branch. Final screen text identical to the baseline. |
| verify-w-pic4 | women | women-q10: picture 3 -> picture 4 | LIVE. Screens: q4 > q6 > q8 > q10 > q16. No branch. Final screen text identical to the baseline. |
| verify-otc-minoxidil | otc-direct | Open the topical minoxidil 'Buy now' link start.ro.co/vwayzg/ | LIVE. First screen is the sign-up wall beside the cart: 'Minoxidil Topical Solution, 60mL, 5%, 1 x per month, 3 month plan ($16/mo), $48', free shipping. No medical question. |
| verify-otc-shampoo | otc-direct | Open the shampoo 'Buy now' link start.ro.co/kwrssq/ | LIVE. Plan screen 'Revive Shampoo ... 3-Month Plan $24 per 3 months' then the sign-up wall. No medical question. |
| verify-otc-conditioner | otc-direct | Open the conditioner 'Buy now' link start.ro.co/qcalmd/ | LIVE. Plan screen 'Restore Conditioner ... 3-Month Plan $24' then the sign-up wall. No medical question. |
| verify-entry-escptw | men | Entry link: the Google Shopping link start.ro.co/escptw/ (repeat of probe-escptw) | LIVE. Redirects to /fxdxbh/online-visit/7 and shows the sign-up screen first (Log in / Sign up with Email / Continue with Google); schema hl-onb-consult-2rx v77. Same as stage 1. |
| verify-entry-afbkau | men | Entry link: the alternative link start.ro.co/afbkau/ (repeat of probe-afbkau) | LIVE. Same first question ('What are your top hair goals?'); the page loads schema hl-onb-se1 v80. Same as stage 1. |

## 9. Independent verification

Trustworthy as labelled. The pre-wall part (3 to 4 questions per flow) is fully observed: every option has now been replayed live and all 18 stage 3 replays matched what stage 2 recorded. The post-wall engine is not observed but is unusually well grounded: the consultation app downloads its complete question schema and the men's recommender in public code, both unchanged since stage 1, and an independent re-read of the raw schema and the current bundles agrees with every high-impact rule (women's hard stops, tablet removal for breastfeeding, heart and blood-pressure conditions and age 66+, the men's finasteride-to-oral-minoxidil switch, the spray > finasteride > oral minoxidil order). Treat post-wall rules as what the software is set to do before a clinician reviews the case, not as proof of what is finally prescribed; server-side state and clinician steps remain unknown.

**Re-checked**

- Baselines replayed fresh (runs/verify-baseline-men, runs/verify-baseline-women): same screens and a wall screen word-for-word the same as stage 2. Confirmed.
- Served schemas re-fetched by the page itself in the stage 3 runs: men hl-onb-consult-2rx v77 and women derm-whl-onb v32 are identical to the saved copies (the only differences were "key" fields blanked by our own redaction script). Confirmed.
- Recommender chunk 48419.d54c80ce6a7f9ba5ad88 re-downloaded (runs/verify-code/): byte-identical. Function Ye: fixed order spray > finasteride tablets > oral minoxidil; a product is skipped if its flag is 1 or its group is state-ineligible; none left = "no-recommendation". R5 confirmed.
- New main bundle main.492909756d6fd4640b5b.js re-read: answer and question variable values go through parseInt (so "1" is the number 1 and the flags work); a fork takes the first true rule; for choice and multi-choice questions the next question is that of the first ticked answer in display order. The simulator (scripts/simulate.py) does the same three things. R17 confirmed (confidence raised to high).
- State rule (R7) re-read in chunk 48419: any group holding a compounded product that is not supported in the member's state is hidden with "Not available in your area". Confirmed as code; the state list stays server-side.
- Women's hard stops re-read directly from the raw schema (not the simulator): pregnant Yes/Not sure > screen 6020; any named scalp diagnosis > fork 1087 > 6040; clitoral enlargement, nipple discharge, deeper voice > fork 1091 > 6040; lupus/autoimmune sets both "not eligible" flags > fork 1159 > 6040; scalp steroid injections > fork 1251 > 6040; oral minoxidil allergy Yes > 6040; topical allergy to foam or both > 6040. Each stop screen has one button, "Got it", which ends the visit. R22 to R26 confirmed.
- Tablet removal for women (R27) re-read: breastfeeding, heart condition, stroke, phaeochromocytoma, pulmonary hypertension and high blood pressure set ifNotEligibleForOralMinoxidil; fork 4020 sends "not eligible or userAge > 65" to 4030 (Hair Solution Rx only, which adds it to the cart). userAge comes from the date of birth on the Basics screen (chunk 70959). Age 65 keeps the choice, 66 loses the tablet. Confirmed.
- Women's choice screen (R28) re-read: "No preference" clears the cart and adds oral minoxidil on a quarterly plan; the on-screen text says so. Confirmed.
- Men's finasteride switch (R9) re-read: erectile dysfunction, anxiety, depression (q1000), trying for a baby (q2350, then a fertility caution screen q2355) and past finasteride tablets with side effects or allergy (q315) set noRecTopicalCombined and noRecOralFin; the recommender then returns oral minoxidil 2.5 mg. Confirmed.
- Men's other switches re-read: prostate cancer, topical minoxidil or topical finasteride allergy flag only the spray (> finasteride tablets, R10); oral minoxidil allergy flags spray and tablet minoxidil (> finasteride tablets, R11); patches, very sudden onset, scalp redness, scalp steroid injections and persistently low blood pressure set all three flags (no recommendation, R8); the cardiovascular list flags only oral minoxidil (R12). Every no-recommend setter in the schema was listed and matched to a rule. Confirmed.
- Men's stops (R16) re-read: the only stop routes are under 18, unserved zip and female (redirect or exit form); Basics meta has minAge 18 and no maxAge in either schema. Confirmed.
- Simulator re-run for the key profiles (baseline man and woman, depression, trying for a baby, prostate cancer, very sudden onset, heart failure, depression + heart failure, age 70; pregnant, not sure, breastfeeding, age 65 and 66, high blood pressure, lupus, deeper voice, irregular periods, traction alopecia, foam allergy): every result matches the rules.
- Pre-wall branches re-confirmed live: men q22 both boxes > q28 (verify-m-nonrx+rx), q28 "easier" option (verify-m-rx-easier, first live test), all goals (verify-m-goals-all), pop-up cannot be dismissed (verify-m-dismiss), coupon still matched (verify-m-coupon), Google Shopping link still puts sign-up first and the afbkau link still opens schema hl-onb-se1 (verify-entry-escptw, verify-entry-afbkau); women q8 temples alone and temples + frontal skip the picture, top + temples keeps it (R20), sudden onset and pictures 2 and 4 change nothing (pictures 2 and 4 first live test). All matched.
- Product facts checked against live pages: Ro Mane Spray minoxidil 6% + finasteride 0.3% + tretinoin 0.025% (product page), $50/mo quarterly, $43/mo 6-month (pricing page, re-fetched 24 Nov); finasteride 1 mg $20/$18/$16; oral minoxidil 2.5 mg $30/$27/$24; topical minoxidil 5% 60 mL $16/$14/$13 and $48 per 3-month cart (live cart, verify-otc-minoxidil); Revive Shampoo and Restore Conditioner $24 per 3 months with the stated ingredients (live, verify-otc-shampoo/-conditioner); women's oral minoxidil $30/mo quarterly and Hair Solution Rx $40/mo quarterly (pricing page); Hair Solution Rx 5% minoxidil, 0.025% tretinoin, 0.1% melatonin (schema text; the product page names the three actives without strengths); catalogue in the stage 3 run (net/03) still lists finasteride $0.66 a tablet, oral minoxidil 2.5 mg $1.00, the 5 mg (2 x 2.5 mg) group at $0.50 a tablet and the empty Hair Support Supplement group. All matched.
- Catalogue completeness: the hair-loss and women's landing pages link only to the products already listed (plus Latisse, valacyclovir and swipes, which are not hair-loss products); no product page is missing. "Spray, serum, and oral meds" on the landing page names no separate serum product.
- Evidence labels audited: every "observed" rule, product, question and option names a run folder that exists; post-wall claims are labelled code; clinician-review claims are worded as inferred.

**Corrected**

- women-q10 pictures 2 and 4 and men-q28 "I want an easier or more convenient solution" upgraded from code to observed (now replayed live).
- R17 (multi-select routing) confidence raised from medium to high after re-reading the current main bundle.
- Limitations and coverage note rewritten: the "not replayed live" list was out of date after stage 3.
- Added 18 stage 3 live runs to experiments and cited them in rules R1 to R4, R19 to R21 and R32; checkedOn moved to 2026-11-24.
- No rule, product, price or strength was contradicted, so no clinical claim had to be changed or removed.

**Still unverified**

- Everything after the account wall (every medical question, stop screen, recommendation and cart) is read from code and simulated, never seen live; real screens could differ in wording or layout.
- The list of US states where the compounded spray is not available (server-side).
- What the reviewing clinician does with the answer marks (negative, caution, ack-clinical), the medicine and allergy lists, and how often the patient's pick is overridden.
- The exact strength of the women's oral minoxidil tablet (not published; the site gives 0.25 to 2.5 mg as the usual range).
- Whether isEligibleFor6And12MonthShipments changes plan lengths (not used in any bundle read).
- Other men's schemas named by the coupon (hl-onb-kit, hl-onb-overhaul, hl-onb-consult-gs, hl-ren-consult-2rx) were not reached from any public page, so their questions are unknown.
- Older FAQ prices (finasteride + minoxidil bundle $1.17 a day) could not be matched to the current pricing page; the bundle (p6) stays docs-only.

## 10. Limits of this report

- Nothing after the account wall was seen live. Every post-wall question, rule and recommendation comes from the served schema, the public recommender chunk and an offline simulation of them (evidence 'code'). The real screens may differ in small ways.
- Live one-change testing was only possible on 7 questions (men q20, q22, q26, q28; women q4, q6, q8, q10). After stage 3 every option of those 7 questions has been replayed live, plus some multi-select combinations (men q20 all goals, q22 both 'tried' boxes; women q8 top + temples, temples + frontal). The alternative entry links were opened twice each (stages 1 and 3) and the coupon link twice; the paid-search quiz pages were read, not replayed.
- What the clinician actually prescribes, how often the patient's pick is overridden, and which strengths are used after the first order cannot be known from public information.
- Server-side checks (drug-interaction checks on the medicine list, state rules for compounded products, identity checks, the redirect flag for women entering the men's visit) are only visible as flags and function names; the list of states without the spray is not public.
- The meaning of the answer marks ('negative', 'caution', 'ack-clinical') is inferred. They are saved with each answer on the server (seen in the anonymous add-answers responses), but who sees them was not found.
- The variable isEligibleFor6And12MonthShipments (set when a man has used oral minoxidil or finasteride tablets before) is not used in the bundles read, so its effect on plan lengths is inferred, not shown.
- The women's product catalogue (exact tablet strength, other plan lengths) is not fetched before the wall; women's strengths and prices come from schema text and the pricing page.
- Free-text and searchable-list answers (medicines, allergies, other conditions) have no rule in the schema; any effect they have happens at clinician review.
- The site runs A/B experiments and changes schema versions (men v77, women v32 on the check date); the three-product men's recommender is at 100% today.
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
- [Main app bundle (fork evaluator, next-question selector, recap bullets, blood-pressure ranges)](https://start.ro.co/assets/main.260d4b871de7cb1cb657.js)
- [Coupon match endpoint the page calls when opened from an ad link](https://start.ro.co/api/coupons/match-trigger)
- [Terms of use (company and pharmacy names)](https://ro.co/terms-of-use/)
