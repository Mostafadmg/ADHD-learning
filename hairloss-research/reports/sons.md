# Sons: consultation and product report

**Market:** UK · **Website:** https://www.sons.co.uk/ · **Checked:** 2026-11-23 · **Owner:** Careforsons Ltd (trading as Sons), company number 11557956, London. Sister sites sons.ie and sonshaar.de.

> Men-only UK hair-loss subscription brand. Its own Shopify store and consultation app sell licensed finasteride 1 mg and minoxidil 5% (Sons holds the licences), unlicensed compounded sprays and capsules, supplements and shampoos; prescribing and dispensing are done by a partner, The Independent Pharmacy (ABSM Healthcare Ltd, GPhC 9012559).

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** After the last consent screen (finasteride statement). The next screen is an account form (first name, last name, email, phone, date of birth, password) titled "Based on your questionnaire results, we are now preparing your personalised health plan. Please complete your account set up to continue." No recommendation, product or price is shown before it. Pressing "Get my personalised plan" creates the account and sends the consultation together. Answering "Yes" to "Are you an existing Sons customer?" hits the sign-in page at question 1.
- **Blocker:** sons.co.uk/agents.md (listed in the sitemap) returned a Cloudflare "Verifying your connection" check to curl; not pursued.
- **Blocker:** Recommendation, plan choice, basket and checkout screens need an account, so they were read from served code only.

Walked live with the baseline man to the account form (11 screens), then once more with every branch switched on, so all 24 conditional screens were also seen live. The baseline woman is stopped at question 2. The full question set (38 pages) was read from the survey definition the page itself downloads, and the rules that turn answers into plans were read from two copies of the recommendation code that the site serves to anonymous visitors. Nothing behind the account form was tested live: no account, email, phone or order was created. Product strengths come from public leaflets and the shop app code; prices from the public product feed.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

One short questionnaire for men only. It never stops a man before the account form: sex at birth is the only gate. Every clinical answer is carried forward and, after sign-up, a script running in the customer's browser turns the answers into five on/off switches (finasteride tablet, finasteride spray, minoxidil capsule, minoxidil spray, combination spray). Each ticked condition or reported side effect flips whole drug families off, a fixed ordered list of twelve plans is filtered by those switches, and the format preference only picks which of two orders is used. The top one or two survivors are shown as the recommendation. The partner pharmacy's prescriber reviews the order afterwards. Rules below are read from the served code, not yet replayed.

## 3. Engine rules (23)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men | Gender at birth = Female | Hard stop with a notice; redirected to the home page; nothing sent. | Stops the patient | observed | high |
| R2 | men | Existing Sons customer = Yes | Questionnaire dropped; sent to the sign-in page. | Skips questions | observed | high |
| R3 | men | Male, any combination of answers | No stop screen before the account form. Even sudden onset + every condition ticked reaches the account form. | No effect | observed | high |
| R4 | men | Treatment preference = Topical sprays | Plan list uses the topical order; otherwise the oral order ("I don't mind" counts as oral). _(affects: Core Plan (spray version), Core Plan - Capsule, Combination Spray ("Finasteride and Minoxidil", with tretinoin))_ | Switches product | code | medium |
| R5 | men | Hair loss started Suddenly | Oral finasteride, topical finasteride, oral minoxidil and the combination spray are removed. Minoxidil spray, Non-Prescription plan and Hair Growth Complex remain. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Oral Minoxidil ("Oral Capsule"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ | Removes a product | code | medium |
| R6 | men | Either PHQ question = More than half the days or Nearly every day | All finasteride (tablet, spray, combination) removed. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ | Removes a product | code | medium |
| R7 | men | Mood question = Yes but both PHQ answers below 2 | No product removed (the blocking line is commented out). | No effect | code | medium |
| R8 | men | Past finasteride side effects = Yes | All finasteride removed. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ | Removes a product | code | medium |
| R9 | men | Past minoxidil side effects = Yes | All minoxidil (spray, capsule, combination, Non-Prescription plan) removed. _(affects: Minoxidil Spray, Oral Minoxidil ("Oral Capsule"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Non-Prescription plan, Combination Capsule, Dutasteride Combination Spray)_ | Removes a product | code | medium |
| R10 | men | Past combination side effects = Yes | Combination spray removed only. _(affects: Combination Spray ("Finasteride and Minoxidil", with tretinoin), Dutasteride Combination Spray)_ | Removes a product | code | medium |
| R11 | men | High Blood Pressure or Cardiovascular Disease ticked | All minoxidil removed, topical included. Finasteride tablet, topical finasteride and Hair Growth Complex remain. _(affects: Minoxidil Spray, Oral Minoxidil ("Oral Capsule"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Non-Prescription plan, Combination Capsule, Dutasteride Combination Spray)_ | Removes a product | code | medium |
| R12 | men | Severe Kidney or Liver Disease, Prostate/Breast/Testicular cancer group, Rheumatoid/Lupus/Methotrexate, or Sexual Dysfunction ticked | All finasteride removed. Minoxidil options remain. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ | Removes a product | code | medium |
| R13 | men | Scalp Disorders ticked | Topical minoxidil and the combination spray removed. Oral options and topical finasteride remain. _(affects: Minoxidil Spray, Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Ultimate Plan (spray version), Non-Prescription plan, Dutasteride Combination Spray)_ | Removes a product | code | medium |
| R14 | men | Phaeochromocytoma ticked | Oral minoxidil removed only. _(affects: Oral Minoxidil ("Oral Capsule"), Core Plan - Capsule, Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule)_ | Removes a product | code | medium |
| R15 | men | Diagnosed Lactose Allergy ticked | Finasteride tablets and oral minoxidil removed; sprays remain. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Oral Minoxidil ("Oral Capsule"), Topical Finasteride & Oral Minoxidil, Combination Capsule)_ | Removes a product | code | medium |
| R16 | men | Age over 65 (from date of birth on the account) | Older page script: finasteride (tablet and spray), oral minoxidil and combination spray removed, minoxidil spray kept. Newer app code: everything including minoxidil spray removed. Product pages meanwhile say finasteride suits ages 18-75. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Oral Minoxidil ("Oral Capsule"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ | Removes a product | code | low |
| R17 | men | Date of birth under 18 on the account form | Form refuses: "You must be at least 18 years old to continue." | Stops the patient | code | medium |
| R18 | men | Account tag finasteride_disallowed / minoxidil_disallowed (set by staff or server; trigger unknown) | Removes that whole drug family from the list. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray, Minoxidil Spray, Oral Minoxidil ("Oral Capsule"), Non-Prescription plan)_ | Removes a product | code | medium |
| R19 | men | Account tag dutasteride_eligible | Dutasteride Combination Spray is put first in the list. _(affects: Dutasteride Combination Spray)_ | Adds a product | code | medium |
| R20 | men | Account tag combo_pill_eligible AND a combo route (combo_pill=true or partner-clinic flag) | Combination Capsule is put first in the list. _(affects: Combination Capsule)_ | Adds a product | code | medium |
| R21 | men | Visitor came from a product page that stored a chosen product | That product is moved to the top (Core Plan is swapped for Core Plan - Capsule, Oral Capsule for Oral Minoxidil, Oral Tablet for Finasteride) if it survives the blocks. _(affects: Core Plan - Capsule, Oral Minoxidil ("Oral Capsule"), Finasteride ("Hair Loss Tablet" / "Oral Tablet"))_ | Switches product | code | low |
| R22 | men | Hair-loss picture (any of four), body hair loss, new medicines, other symptoms, scalp tick boxes, free-text answers | Not read by the recommendation code. Saved for the prescriber; effect on approval unknown. | No effect | code | medium |
| R23 | men | Nothing blocked | Older page script shows two primary cards (first two of the list); if finasteride tablets or minoxidil spray are blocked it shows one. Newer app code always shows one primary card. Hair Growth Complex is never removed. _(affects: Hair Growth Complex)_ | No effect | code | medium |

## 4. Products (31)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Finasteride ("Hair Loss Tablet" / "Oral Tablet")](https://sons.co.uk/products/finasteride) | rx-oral | finasteride 1 mg | tablet, one a day | men | POM, licensed. Careforsons Ltd is named as marketing authorisation holder in its own leaflet and in the consultation statement. | £136 for 6 months (£22.67 a month) list price (1 month £29 · 3 months £83 · 6 months £136 · 12 months £272. Page headline "From £13.60 / month" is the first-order offer price. List prices from the public product feed (sons.co.uk/products.json, 23 Nov 2026). A Black …) | In both served recommendation lists. Removed when oral finasteride is blocked: sudden onset, PHQ answer of "More than half the days" or worse, past finasteride side effects, severe kidney or liver disease, prostate/breast/testicular cancer group, rheumatoid/lupus/methotrexate group, lactose allergy, sexual dysfunction, age over 65, or the account tag finasteride_disallowed. Shown as one card with a Tablet/Spray toggle paired with topical finasteride. | code |
| [Minoxidil Spray](https://sons.co.uk/products/minoxidil) | otc-medicine | minoxidil 5% cutaneous solution | scalp spray, 1 ml (10 pumps) twice a day | men | Licensed non-prescription medicine (Careforsons says it holds the marketing authorisation for 5% minoxidil solution). Whether it is classed P or GSL was not confirmed. The shop still routes new buyers through the consultation. | £99 for 6 months (£16.50 a month) list price (1 month £33 · 3 months £54 · 6 months £99 · 12 months £180. List prices from the public product feed (sons.co.uk/products.json, 23 Nov 2026). A Black Friday offer was running on the day: about 40% off the first order of…) | In both lists. Removed when topical minoxidil is blocked: high blood pressure, cardiovascular disease, scalp disorder, past minoxidil side effects, tag minoxidil_disallowed (and, in the newer code only, age over 65). It is one of the few items left after a "sudden onset" answer. | code |
| [Oral Minoxidil ("Oral Capsule")](https://sons.co.uk/products/oral-minoxidil) | rx-oral-compounded | minoxidil 2.5 mg; biotin 50 micrograms | capsule, one a day | men | POM, unlicensed special, used off-label for hair loss. Leaflet: made by Xeal Pharma Ltd (MS 46688) for Careforsons. | £142 for 6 months (£23.67 a month) list price (3 months £77 · 6 months £142. Page headline "From £14.20 / month" is the first-order offer price. List prices from the public product feed (sons.co.uk/products.json, 23 Nov 2026). A Black Friday offer was running on the…) | In both lists. Removed when oral minoxidil is blocked: sudden onset, high blood pressure, cardiovascular disease, phaeochromocytoma, lactose allergy, past minoxidil side effects, age over 65, tag minoxidil_disallowed. Shown as one card with a Capsule/Spray toggle paired with Minoxidil Spray. The basket code also has an off-label consent tick for oral minoxidil. | code |
| [Oral Minoxidil 5mg (two 2.5 mg capsules a day)](https://sons.co.uk/products/oral-minoxidil-5mg) | rx-oral-compounded | minoxidil 5 mg a day (2 x 2.5 mg) | capsules | men | POM, unlicensed special, off-label. | £187.20 for 6 months (£31.20 a month) (3 months £105.30 · 6 months £187.20.) | Existing customers only: the product page shows "Log In", and a separate four-question step-up consultation (flow oral-minoxidil-5mg) is for men already on 2.5 mg. The basket data has a server flag is_oral_minoxidil_eligible; how it is set is unknown. | code |
| [Topical Finasteride ("Hair Loss Spray")](https://sons.co.uk/products/topical-hair-loss-spray) | rx-topical-compounded | finasteride 0.15% | scalp spray, 4 pumps (0.664 ml) once a day | men | POM, unlicensed medicine (the product page and leaflet say so). | £136 for 6 months (£22.67 a month) list price (3 months £83 · 6 months £136. List prices from the public product feed (sons.co.uk/products.json, 23 Nov 2026). A Black Friday offer was running on the day: about 40% off the first order of selected 6-month plans and 35…) | In both lists, paired with finasteride tablets on one card. Removed when topical finasteride is blocked: sudden onset, PHQ answer of "More than half the days" or worse, past finasteride side effects, kidney/liver, prostate/cancer, rheumatoid/lupus/methotrexate, sexual dysfunction, age over 65, tag finasteride_disallowed. It survives a lactose allergy answer. The product page button says "Log In" for visitors, yet the code offers it to new customers after the consultation. | code |
| [Combination Spray ("Finasteride and Minoxidil", with tretinoin)](https://sons.co.uk/products/topical-finasteride-minoxidil-spray) | rx-topical-compounded | finasteride 0.15%; minoxidil 5%; tretinoin 0.015% | scalp spray, 4 pumps (0.664 ml) once a day; one bottle lasts 90 days | men | POM, unlicensed medicine made for Careforsons. | £189 for 6 months (£31.50 a month) list price (3 months £106 · 6 months £189. Page headline "From £18.90 / month" is the first-order offer price. List prices from the public product feed (sons.co.uk/products.json, 23 Nov 2026). A Black Friday offer was running on th…) | In both lists. In the newer code it is the first item of both lists, so it is the single primary recommendation for a man with no blocks. Removed when the "topical combo" flag is off, which nearly every block switches off: sudden onset, PHQ answers, any past side effects (finasteride, minoxidil or combination), high blood pressure, cardiovascular disease, kidney/liver, prostate/cancer, rheumatoid/lupus/methotrexate, scalp disorder, sexual dysfunction, age over 65, either account tag. It survives phaeochromocytoma and lactose allergy. | code |
| [Combination Capsule](https://sons.co.uk/products/combination-capsule) | rx-oral-compounded | finasteride 1 mg; minoxidil 2.5 mg; biotin 50 micrograms | capsule, one a day | men | POM, unlicensed medicine. | £189 for 6 months (£31.50 a month) list price (1 month £32 · 3 months £106 · 6 months £189. Partner-clinic routes apply codes worth 50-55% off (HQHT45, KSLCLINIC, BHC50 appear in the code).) | Not in the standard lists. Added to the top only when the account carries the tag combo_pill_eligible AND the visit came through a "combo" route (consultation URL with combo_pill=true or a partner-clinic flag). Needs oral finasteride and oral minoxidil both allowed. The product page shows "Log In" to visitors. | code |
| [Dutasteride Combination Spray](https://sons.co.uk/products/dutasteride-combination-spray) | rx-topical-compounded | dutasteride 0.1%; minoxidil 5%; tretinoin 0.01% | scalp spray | men | POM, unlicensed medicine made for Careforsons. | £199 for 6 months (£33.17 a month) (3 months £111 · 6 months £199.) | Not in the standard lists. Added to the top only when the account carries the tag dutasteride_eligible (how an account earns that tag is unknown; likely set by the clinical team for men who did not respond to finasteride). The product page shows "Log In" to visitors. | code |
| [Ketoconazole Shampoo](https://sons.co.uk/products/ketoconazole) | otc-medicine | ketoconazole 2% | medicated shampoo, 60 ml | men | Medicated anti-dandruff shampoo (non-prescription medicine; P or GSL class not confirmed). The checkout code makes the buyer accept ketoconazole terms. | £16 for 6 months (3 months £9.49 · 6 months £16.) | Not in the recommendation lists. Sold as an add-on; the scalp questions (5613-5615) added to the consultation look designed to support it, but no served rule links them (unknown). | docs |
| [Hair Growth Complex](https://sons.co.uk/products/hair-growth-complex) | supplement | nine-ingredient blend including AnaGain, marine collagen, biotin, saw palmetto not stated | capsule/tablet, daily | men | Food supplement. | £168 for 6 months (£28 a month) list price (1 month £35 · 3 months £96 · 6 months £168 · 12 months £300. Can be added to the basket without a consultation.) | Last item of both lists and never removed by any block, so it is always offered. Also inside the Ultimate and Advanced plans. | code |
| [Biotin](https://sons.co.uk/products/biotin) | supplement | biotin 900 micrograms (from the shop app code) | tablet, daily | men | Food supplement. | £54 for 6 months (£9 a month) (1 month £12.99 · 3 months £30 · 6 months £54 · 12 months £96. Add to cart without a consultation.) | Not recommended on its own; part of the Non-Prescription, Full Works and Simplicity plans. | docs |
| [Strengthening Shampoo ("DHT-blocking")](https://sons.co.uk/products/shampoo) | cosmetic | saw palmetto, caffeine, argan oil, vitamin B3 cosmetic | shampoo, 200 ml | men | Cosmetic. | £66 for 6 months (£11 a month) (1 month £15 · 3 months £39 · 6 months £66 · 12 months £108. Add to cart without a consultation.) | Not recommended on its own; part of the Ultimate, Non-Prescription, Full Works and Simplicity plans. | docs |
| [Strengthening Conditioner](https://sons.co.uk/products/conditioner) | cosmetic | Octopirox, biotin, argan oil, amino acids cosmetic | conditioner | men | Cosmetic. | £66 for 6 months (£11 a month) (1 month £17.99 · 3 months £39 · 6 months £66 · 12 months £108.) | Never recommended by the consultation; add-on. | docs |
| [Shower Duo (shampoo + conditioner)](https://sons.co.uk/products/shampoo-conditioner) | bundle | see shampoo and conditioner cosmetic | shampoo and conditioner | men | Cosmetic bundle. | £120 for 6 months (£20 a month) (1 month £28 · 3 months £72 · 6 months £120.) | Never recommended by the consultation; add-on. | docs |
| [Thickening Hair Clay](https://sons.co.uk/products/hair-thickening-clay) | cosmetic | kaolin clay, caffeine, biotin cosmetic | styling clay, 75 ml | men | Cosmetic. | £54 for 6 months (£9 a month) (1 month £15.99 · 3 months £30 · 6 months £54.) | Never recommended by the consultation; add-on. | docs |
| [Dermaroller](https://sons.co.uk/products/dermaroller) | device | n/a | microneedling roller | men | Device/accessory. | £14 one pack (One-off item.) | Never recommended by the consultation; pitched at men already using the minoxidil spray. | docs |
| [Ultimate Shine Spray (a joke product)](https://sons.co.uk/products/ultimate-shine-spray) | cosmetic | n/a | spray | men | Novelty item; the page says "this product is a joke". | £10 one bottle | Never recommended; marketing stunt. | docs |
| [Core Plan (spray version)](https://sons.co.uk/products/the-duo-plan) | bundle | finasteride 1 mg tablet; minoxidil 5% spray | tablet + scalp spray | men | Bundle of a licensed POM (finasteride) and a licensed non-prescription medicine (minoxidil 5%). | £189 for 6 months (£31.50 a month) list price (1 month £43 · 3 months £106 · 6 months £189 · 12 months £378. Page headline "From £18.90 / month" is the first-order offer price. List prices from the public product feed (sons.co.uk/products.json, 23 Nov 2026). A Black…) | Top of the "topical" list in the older code (shown first when the man prefers sprays). Needs oral finasteride and topical minoxidil both allowed. Shown as one card with a Spray/Capsule toggle with Core Plan - Capsule. | code |
| [Core Plan - Capsule](https://sons.co.uk/products/oral-duo-plan) | bundle | finasteride 1 mg tablet; minoxidil 2.5 mg capsule (with biotin 50 micrograms) | tablet + capsule | men | Bundle of a licensed POM and an unlicensed special (oral minoxidil). | £189 for 6 months (£31.50 a month) list price (3 months £106 · 6 months £189. List prices from the public product feed (sons.co.uk/products.json, 23 Nov 2026). A Black Friday offer was running on the day: about 40% off the first order of selected 6-month plans and 3…) | Top of the "oral" list in the older code (shown first when the man prefers capsules or does not mind). Needs oral finasteride and oral minoxidil both allowed. If the man arrived from the Core Plan product page, the code treats that stored choice as this capsule version. | code |
| [Ultimate Plan (spray version)](https://sons.co.uk/products/ultimate-hair-loss-plan) | bundle | finasteride 1 mg tablet; minoxidil 5% spray; Hair Growth Complex supplement; Strengthening Shampoo cosmetic | tablet + spray + supplement + shampoo | men | Bundle: licensed POM + licensed non-prescription medicine + supplement + cosmetic. | £299 for 6 months (£49.83 a month) list price (1 month £59 · 3 months £168 · 6 months £299 · 12 months £566.40. Page headline "From £29.90 / month" is the first-order offer price. List prices from the public product feed (sons.co.uk/products.json, 23 Nov 2026). A Bl…) | In both lists (fifth or sixth). Needs oral finasteride and topical minoxidil allowed. Tagged "most popular". Toggle card with the capsule version. | code |
| [Ultimate Plan - Capsule](https://sons.co.uk/products/ultimate-hair-loss-plan-capsule) | bundle | finasteride 1 mg tablet; minoxidil 2.5 mg capsule; Hair Growth Complex supplement; Strengthening Shampoo cosmetic | tablet + capsule + supplement + shampoo | men | Bundle: licensed POM + unlicensed special + supplement + cosmetic. | £299 for 6 months (£49.83 a month) list price (3 months £168 · 6 months £299. List prices from the public product feed (sons.co.uk/products.json, 23 Nov 2026). A Black Friday offer was running on the day: about 40% off the first order of selected 6-month plans and 3…) | In both lists. Needs oral finasteride and oral minoxidil allowed. | code |
| [Topical Finasteride & Oral Minoxidil](https://sons.co.uk/products/hair-loss-spray-hair-loss-capsule) | bundle | finasteride 0.15% spray; minoxidil 2.5 mg capsule | scalp spray + capsule | men | Bundle of two unlicensed medicines (POM). | £189 for 6 months (£31.50 a month) list price (3 months £106 · 6 months £189. List prices from the public product feed (sons.co.uk/products.json, 23 Nov 2026). A Black Friday offer was running on the day: about 40% off the first order of selected 6-month plans and 3…) | Fourth in both lists. Needs topical finasteride and oral minoxidil both allowed. It stays on offer for a man who ticks only "Scalp Disorders" (topical minoxidil blocked) and goes when oral minoxidil or topical finasteride is blocked. | code |
| [Non-Prescription plan](https://sons.co.uk/products/the-non-prescription-plan) | bundle | minoxidil 5% spray; biotin supplement; Strengthening Shampoo cosmetic | spray + supplement + shampoo | men | Bundle with no prescription-only medicine. The product page lets a visitor pick a plan length and add it to the cart without the consultation. | £198 for 6 months (£33 a month) list price (1 month £42 · 3 months £109 · 6 months £198 · 12 months £380. On the day: 6 months £118.80 first order (40% off), then £198 every 6 months.) | In both lists (second to last). Removed only when topical minoxidil is blocked. It is what is left, with minoxidil spray and Hair Growth Complex, when finasteride and oral minoxidil are blocked (for example sudden onset). The medical FAQ also points men trying for a baby to it. | code |
| [Advanced Plan and Advanced Plan - Capsule](https://sons.co.uk/products/advanced-hair-loss-plan) | bundle | finasteride 1 mg tablet; minoxidil 5% spray or 2.5 mg capsule; Hair Growth Complex supplement | tablet + spray or capsule + supplement | men | Bundle: POM + minoxidil + supplement. | £254 for 6 months (£42.33 a month) (Spray version: 1 month £48 · 3 months £142 · 6 months £254 · 12 months £460.80. Capsule version: 3 months £142 · 6 months £254.) | Published product pages, but not in the served recommendation lists and not on the current plans page. Reachable as a cross-sell and through the plan customiser. | docs |
| [Full Works and Oral Full Works](https://sons.co.uk/products/the-full-works-plan) | bundle | finasteride 1 mg tablet; minoxidil 5% spray or 2.5 mg capsule; biotin supplement; Strengthening Shampoo cosmetic | tablet + spray or capsule + supplement + shampoo | men | Bundle: POM + minoxidil + supplement + cosmetic. | £269 for 6 months (£44.83 a month) (Full Works: 1 month £54 · 3 months £148 · 6 months £269 · 12 months £422.40. Oral Full Works: 3 months £148 · 6 months £269.) | Older flagship plan. Still published and tagged "consultation" and "most popular", but not in the served recommendation lists (the Ultimate Plan has taken its place). | docs |
| [Simplicity plan](https://sons.co.uk/products/the-simplicity-plan) | bundle | finasteride 1 mg tablet; biotin supplement; Strengthening Shampoo cosmetic | tablet + supplement + shampoo | men | Bundle: POM + supplement + cosmetic. | £254 for 6 months (£42.33 a month) (1 month £48 · 3 months £142 · 6 months £254 · 12 months £412.80.) | Older plan; published but not in the served recommendation lists. | docs |
| [Customiser combination plans (12 legacy two- and three-item plans)](https://sons.co.uk/collections/all) | bundle | mixes of finasteride, minoxidil (spray or capsule), biotin, shampoo as the single products | various | men | Mixed: prescription and non-prescription combinations. | From £78 for 6 months (Biotin & Shampoo) to £213 for 6 months (oral three-item plans) (Feed handles and list prices (1 / 3 / 6 / 12 months where sold): shampoo-biotin-plan £18/£42/£78/£201.50 · shampoo-minoxidil-plan, biotin-minoxidil-plan, shampoo-finasteride-plan, bioitin-finasteride-plan £31/£84/£150/£…) | Not recommended by the consultation. These are the plan SKUs the "customise products" tool in the account maps to when a customer removes or swaps an item. | docs |
| [Hair Transplant Clinic Bundle](https://sons.co.uk/products/hair-transplant-clinic-bundle) | bundle | finasteride not stated; minoxidil not stated; ketoconazole shampoo not stated; Hair Growth Complex supplement; shampoo cosmetic | bundle | men | Bundle containing prescription medicine (contents taken from the product tags). | £142.97 for 3 months (3 months £142.97 · 6 months £257.23 (marked unavailable in the feed).) | Offered through partner hair-transplant clinic pages (pre- and post-procedure plan lists come from the clinic record), not through the standard recommendation lists. | code |
| [One-off retail packs (minoxidil 5% spray, ketoconazole shampoo, hair clay)](https://sons.co.uk/collections/all) | otc-medicine | minoxidil 5%; ketoconazole 2% | spray / shampoo / clay packs | men | Non-prescription medicines and a cosmetic, sold as fixed packs. | £29.99 for minoxidil 60 ml + ketoconazole 60 ml (Minoxidil 5% 3 x 60 ml + ketoconazole 2 x 60 ml £79.99 · minoxidil 1 x 60 ml + ketoconazole 1 x 60 ml £29.99 · ketoconazole 60 ml + clay 75 ml £19.99 · ketoconazole 2 x 60 ml + clay 3 x 75 g £49.99 · ketoconazole 60 ml …) | Not part of the consultation. | docs |
| [Free packs (Welcome Pack; post-transplant Free Care Pack)](https://sons.co.uk/products/the-sons-welcome-pack) | bundle | n/a | wash bag, pill box, travel bottles; or neck pillow, saline spray, anti-itch shampoo | men | Not medicines. | £0 (gift) (Welcome Pack: free with selected first 6-month plans during the offer. Free Care Pack "worth £49.99": for men referred by a partner transplant clinic who give a procedure date.) | Gift logic, not clinical. | docs |
| [Beard Booster](https://sons.co.uk/products/beard-booster) | rx-topical-compounded | minoxidil 6%; tretinoin 0.01% | cream/serum for the beard area | men | POM, unlicensed medicine. | £180 for 6 months (£30 a month) (1 month £46 · 3 months £105 · 6 months £180.) | Separate beard consultation (flow beard). Facial hair, not scalp hair loss; listed because it shares the engine. | docs |

## 5. Who gets what (2 patient profiles)

- **Man, 32, temples and crown, gradual onset, no mood concerns, no past treatment, no conditions, "I don't mind" on format (the baseline man)** → Core Plan - Capsule, Core Plan (spray version), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Topical Finasteride & Oral Minoxidil, Ultimate Plan - Capsule, Ultimate Plan (spray version), Oral Minoxidil ("Oral Capsule"), Minoxidil Spray, Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Non-Prescription plan, Hair Growth Complex (default: Core Plan - Capsule). READ FROM CODE, NOT SEEN LIVE (the page needs an account). Older page script on sons.co.uk/pages/recommendation: two primary cards, Core Plan (opening on the capsule version, spray on a toggle) and the Combination Spray; the other ten sit under "See more plans". Newer app code at shop.sons.co.uk/recommendation: one primary card, the Combination Spray, then the rest. Which copy a new customer lands on today was not confirmed; the consultation code redirects to the sons.co.uk page. The newer function was also run offline on these answers (node scripts/engine-run.js) and returned the Combination Spray as the primary card. _[code]_
- **Woman, 38 (the baseline woman)** → nothing offered. Stopped at question 2 with a notice to see a GP or hair-loss specialist. The medical FAQ adds that 5% minoxidil "cannot be sold to females as Sons are not permitted to do so under UK licensing". _[observed]_

## 6. The consultation, question by question

### Hair-loss consultation (the only route in for scalp hair loss; survey code uk_consultation)

Entry: https://shop.sons.co.uk/consultation/?logged_in=false

2 gate questions (existing customer, sex at birth) → self-declaration tick → 6 core screens for a healthy man (picture, onset, mood, past medicines, format preference, conditions) with up to 24 extra conditional screens → finasteride statement and optional NHS/GP consents → ACCOUNT WALL (account form; consultation is sent with it) → recommendation page, plan length, basket, checkout, identity check, prescriber review (not tested; read from code and public pages).

**1. Are you an existing Sons customer?**  
_single · anonymous · role: identity · shown: always (first screen) · BRANCHES · observed_  
Why they ask: Sends existing customers to sign in instead of creating a second account.  
Downstream: Yes leaves the questionnaire for the sign-in page.

- `Yes` → **Skips questions**: The questionnaire is cleared and the browser goes to sons.co.uk/account/login?return_url=/pages/consultation-hair. Account wall straight away. _[observed]_
- `No` → **Next question**: Moves to the next question. No effect on what is offered. _[observed]_

**2. What is your gender at birth?**  
_single · anonymous · role: eligibility-gate · shown: always (second screen) · BRANCHES · observed_  
Why they ask: Sons only treats people born male. This is the only stop screen before the account form.  
Downstream: Female hides every other page and shows the female notice.

- `Female` → **Stops the patient**: Hard stop. Shows the notice "Sons products are formulated for those born male…" with a "Finish Consultation" button. The code then shows the message "Unfortunately you are ineligible for prescription based products. Redirecting to the home page." and nothing is sent. _[observed]_
- `Male` → **Next question**: Moves to the next question. No effect on what is offered. _[observed]_

**3. Please read the statement and accept if you meet all the criteria**  
_consent · anonymous · role: consent · shown: always (for anyone who answered Male) · no branch · observed_  
Why they ask: Self-declaration: male, over 18, lives in the UK, sole user, accepts terms, answers honestly. Age is not checked here; date of birth is only asked on the account form.

- `I accept` → **Next question**: Required tick. Without it the Continue button will not move on. _[observed]_

**4. Please select the image that best describes your hair loss:**  
_single · anonymous · role: diagnosis · shown: always (for anyone who answered Male) · no branch · observed_  
Why they ask: Rough pattern of hair loss, picked from four drawings. It is the only "how bad is it" question; there is no Norwood scale.  
Downstream: No branch and no stop for any option, including "Random patches" and "Completely bald" (seen live: the next question is the same for all).

- `Temples only (receding at the front)` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Typical male pattern. _[code]_
- `Temples/Crown` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Typical male pattern (used for the baseline man). _[code]_
- `Random patches` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Patchy loss would normally point away from male pattern baldness, yet no warning or stop appears. Whether the prescriber acts on it is unknown. _[code]_
- `Completely bald` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. No stop screen appears even though treatment cannot help a fully bald scalp. The app code knows notice pages called "extensive-loss-notice" and "Sudden Hair Loss Notice" (from another market or an earlier version), but the current UK questionnaire contains neither. _[code]_

**5. Can you please state how your hair loss started?**  
_single · anonymous · role: safety-screen · shown: always (for anyone who answered Male) · BRANCHES · observed_  
Why they ask: Separates slow male-pattern loss from sudden shedding, which needs a doctor.  
Downstream: Suddenly adds three yes/no questions (body hair, new medicines, other symptoms).

- `Gradually over months and years` → **Next question**: Moves to the next question. No effect on what is offered. _[observed]_
- `Suddenly (it fell out over a matter of days or a few weeks)` → **Removes a product**: Recommendation code switches off oral finasteride, topical finasteride, oral minoxidil and the combination spray, so these are taken out of the list of plans shown. Topical minoxidil is NOT switched off, so Minoxidil Spray, the Non-Prescription plan and Hair Growth Complex are still offered. It also adds three follow-up questions (seen live). _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Oral Minoxidil ("Oral Capsule"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ _[code]_

**6. Is their hair loss over other parts of your body?**  
_single · anonymous · role: safety-screen · shown: only if hair loss started "Suddenly" · no branch · observed_  
Why they ask: Looks for alopecia areata / general hair loss.

- `Yes` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Likely for the prescriber (not confirmed). _[code]_
- `No` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Likely for the prescriber (not confirmed). _[code]_

**7. Have you started any new medications recently?**  
_single · anonymous · role: safety-screen · shown: only if hair loss started "Suddenly" · no branch · observed_  
Why they ask: Looks for drug-induced hair loss.

- `Yes` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Likely for the prescriber (not confirmed). Note there is no free-text box to name the medicine. _[code]_
- `No` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Likely for the prescriber (not confirmed). Note there is no free-text box to name the medicine. _[code]_

**8. Have you noticed any other physical symptoms?**  
_single · anonymous · role: safety-screen · shown: only if hair loss started "Suddenly" · no branch · observed_  
Why they ask: Looks for illness behind sudden shedding.

- `Yes` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Likely for the prescriber (not confirmed). No free-text box follows. _[code]_
- `No` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Likely for the prescriber (not confirmed). No free-text box follows. _[code]_

**9. Do you have any concerns about your mood, or are you currently taking antidepressants?**  
_single · anonymous · role: safety-screen · shown: always (for anyone who answered Male) · BRANCHES · observed_  
Why they ask: Finasteride mood warning (MHRA). Opens a short depression screen.  
Downstream: Yes adds a free-text box and two PHQ-2 style questions.

- `Yes` → **Adds questions**: Adds three screens: a free-text box and two "over the past two weeks" questions. On its own it does not remove any product: the line that would block finasteride for a plain Yes is commented out in the served code. _[observed]_
- `No` → **Next question**: Moves to the next question. No effect on what is offered. _[observed]_

**10. Please tell us a bit more, if you feel comfortable.**  
_text · anonymous · role: safety-screen · shown: only if mood question = Yes · no branch · observed_  
Why they ask: Free text on diagnosis, treatment, last review, changes in mood, energy or sex drive. Required.


**11. Over the past two weeks, how often have you had little interest or pleasure in doing things?**  
_single · anonymous · role: safety-screen · shown: only if mood question = Yes · no branch · observed_  
Why they ask: First PHQ-2 depression question.

- `Not at all` → **No effect**: No product change. _[code]_
- `Several days` → **No effect**: No product change. _[code]_
- `More than half the days` → **Removes a product**: Recommendation code switches off oral finasteride, topical finasteride and the combination spray (score of 2 or more on either question), so these are taken out of the list of plans shown. Minoxidil products stay. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ _[code]_
- `Nearly every day` → **Removes a product**: Recommendation code switches off oral finasteride, topical finasteride and the combination spray (score of 2 or more on either question), so these are taken out of the list of plans shown. Minoxidil products stay. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ _[code]_

**12. Over the past two weeks, how often have you felt down, depressed, or hopeless?**  
_single · anonymous · role: safety-screen · shown: only if mood question = Yes · no branch · observed_  
Why they ask: Second PHQ-2 depression question.

- `Not at all` → **No effect**: No product change. _[code]_
- `Several days` → **No effect**: No product change. _[code]_
- `More than half the days` → **Removes a product**: Recommendation code switches off oral finasteride, topical finasteride and the combination spray (score of 2 or more on either question), so these are taken out of the list of plans shown. Minoxidil products stay. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ _[code]_
- `Nearly every day` → **Removes a product**: Recommendation code switches off oral finasteride, topical finasteride and the combination spray (score of 2 or more on either question), so these are taken out of the list of plans shown. Minoxidil products stay. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ _[code]_

**13. Have you ever taken any of the below medicines before?**  
_multi · anonymous · role: safety-screen · shown: always (for anyone who answered Male) · BRANCHES · observed_  
Why they ask: Treatment history; decides which side-effect questions follow.  
Downstream: Each ticked medicine adds its own "Have you experienced any adverse effects?" screen, shown after the treatment preference question.

- `Finasteride or Propecia` → **Adds questions**: Adds the finasteride side-effect question later. _[observed]_
- `Minoxidil or Regaine` → **Adds questions**: Adds the minoxidil side-effect question later. _[observed]_
- `Topical Finasteride Minoxidil Combination` → **Adds questions**: Adds the combination side-effect question later. _[observed]_
- `None of these` → **Next question**: Moves to the next question. No effect on what is offered. _[observed]_

**14. What treatment type do you prefer?**  
_single · anonymous · role: product-selector · shown: always (for anyone who answered Male) · no branch · observed_  
Why they ask: The one product-choice question. It only changes the ORDER of plans, never what is allowed.

- `Topical sprays - (apply to scalp)` → **Switches product**: Uses the "topical" order. Older page script: Core Plan (tablet + minoxidil spray) first, each paired card opens on its spray version. Newer app code: the Combination Spray is first either way. _(affects: Core Plan (spray version), Core Plan - Capsule, Combination Spray ("Finasteride and Minoxidil", with tretinoin))_ _[code]_
- `Oral capsule - (take once a day)` → **Switches product**: Uses the "oral" order. Older page script: Core Plan - Capsule first, paired cards open on the capsule/tablet version. _(affects: Core Plan - Capsule, Core Plan (spray version), Combination Spray ("Finasteride and Minoxidil", with tretinoin))_ _[code]_
- `I don’t mind - I want what’s most effective for me` → **Switches product**: Treated exactly like "Oral capsule" (the code only tests for answer 0 = topical). _(affects: Core Plan - Capsule, Core Plan (spray version), Combination Spray ("Finasteride and Minoxidil", with tretinoin))_ _[code]_

**15. Have you experienced any adverse effects?**  
_single · anonymous · role: safety-screen · shown: only if "Finasteride or Propecia" was ticked · BRANCHES · observed_  
Why they ask: Past finasteride side effects.  
Downstream: Yes adds an optional free-text box.

- `Yes` → **Removes a product**: Recommendation code switches off oral finasteride, topical finasteride and the combination spray, so these are taken out of the list of plans shown. Also opens a free-text box (seen live). _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ _[code]_
- `No` → **No effect**: No product change. _[code]_

**16. Have you experienced any adverse effects from taking Finasteride or Propecia?**  
_text · anonymous · role: safety-screen · shown: only if finasteride side effects = Yes · no branch · observed_  
Why they ask: Free text about finasteride side effects. Optional.


**17. Have you experienced any adverse effects?**  
_single · anonymous · role: safety-screen · shown: only if "Minoxidil or Regaine" was ticked · BRANCHES · observed_  
Why they ask: Past minoxidil side effects.  
Downstream: Yes adds an optional free-text box.

- `Yes` → **Removes a product**: Recommendation code switches off oral minoxidil, topical minoxidil and the combination spray, so these are taken out of the list of plans shown. Also opens a free-text box (seen live). _(affects: Minoxidil Spray, Oral Minoxidil ("Oral Capsule"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Non-Prescription plan, Combination Capsule, Dutasteride Combination Spray)_ _[code]_
- `No` → **No effect**: No product change. _[code]_

**18. Can you tell us what side effects you experienced from using Minoxidil or Regaine?**  
_text · anonymous · role: safety-screen · shown: only if minoxidil side effects = Yes · no branch · observed_  
Why they ask: Free text about minoxidil side effects. Optional.


**19. Have you experienced any adverse effects?**  
_single · anonymous · role: safety-screen · shown: only if "Topical Finasteride Minoxidil Combination" was ticked · BRANCHES · observed_  
Why they ask: Past side effects from a topical finasteride + minoxidil mix.  
Downstream: Yes adds an optional free-text box.

- `Yes` → **Removes a product**: Recommendation code switches off the combination spray only, so these are taken out of the list of plans shown. Separate finasteride and minoxidil products stay. Also opens a free-text box (seen live). _(affects: Combination Spray ("Finasteride and Minoxidil", with tretinoin), Dutasteride Combination Spray)_ _[code]_
- `No` → **No effect**: No product change. _[code]_

**20. Can you tell us what side effects you experienced when using a Topical Finasteride Minoxidil Combination?**  
_text · anonymous · role: safety-screen · shown: only if combination side effects = Yes · no branch · observed_  
Why they ask: Free text about combination side effects. Optional.


**21. Do any of the following apply to you?**  
_multi · anonymous · role: safety-screen · shown: always (for anyone who answered Male) · BRANCHES · observed_  
Why they ask: The main medical screen: nine tick boxes. Each one switches whole drug families off in the recommendation code and opens its own free-text box.  
Downstream: Every ticked condition adds a free-text screen. Scalp Disorders adds four screens. No tick causes a stop: with all nine ticked the flow still reaches the account form (run all-branches-men).

- `High Blood Pressure` → **Removes a product**: Recommendation code switches off oral minoxidil, topical minoxidil and the combination spray, so these are taken out of the list of plans shown. Finasteride tablets, topical finasteride and Hair Growth Complex stay. No check of whether blood pressure is controlled in this version. Adds an optional free-text box. _(affects: Minoxidil Spray, Oral Minoxidil ("Oral Capsule"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Non-Prescription plan, Combination Capsule, Dutasteride Combination Spray)_ _[code]_
- `Cardiovascular Disease (incl. Heart Attack, Rhythm, Valve Disorder or Stroke)` → **Removes a product**: Recommendation code switches off oral minoxidil, topical minoxidil and the combination spray, so these are taken out of the list of plans shown. Same effect as High Blood Pressure. Adds a required free-text box. _(affects: Minoxidil Spray, Oral Minoxidil ("Oral Capsule"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Non-Prescription plan, Combination Capsule, Dutasteride Combination Spray)_ _[code]_
- `Severe Kidney or Liver Disease` → **Removes a product**: Recommendation code switches off oral finasteride, topical finasteride and the combination spray, so these are taken out of the list of plans shown. Minoxidil spray, oral minoxidil, Non-Prescription plan and Hair Growth Complex stay. Adds a required free-text box. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ _[code]_
- `Prostate Disease, Male Breast Cancer or Testicular Cancer` → **Removes a product**: Recommendation code switches off oral finasteride, topical finasteride and the combination spray, so these are taken out of the list of plans shown. Adds a required free-text box. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ _[code]_
- `Rheumatoid Arthritis, Systemic Lupus or on Methotrexate` → **Removes a product**: Recommendation code switches off oral finasteride, topical finasteride and the combination spray, so these are taken out of the list of plans shown. Adds a required free-text box about medicines. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ _[code]_
- `Scalp Disorders (including Scalp Psoriasis, Eczema, Dermatitis or Infection)` → **Removes a product**: Recommendation code switches off topical minoxidil and the combination spray, so these are taken out of the list of plans shown. Oral routes stay: Core Plan - Capsule, Ultimate - Capsule, oral minoxidil, finasteride tablets, topical finasteride. Adds four screens: free text plus three scalp tick-box questions. _(affects: Minoxidil Spray, Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Ultimate Plan (spray version), Non-Prescription plan, Dutasteride Combination Spray)_ _[code]_
- `Phaeochromocytoma` → **Removes a product**: Recommendation code switches off oral minoxidil only, so these are taken out of the list of plans shown. Topical minoxidil and all finasteride options stay. Adds a required free-text box. _(affects: Oral Minoxidil ("Oral Capsule"), Core Plan - Capsule, Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule)_ _[code]_
- `Diagnosed Lactose Allergy` → **Removes a product**: Recommendation code switches off oral finasteride and oral minoxidil (both contain lactose), so these are taken out of the list of plans shown. Left on offer: Combination Spray, Minoxidil Spray, topical finasteride, Non-Prescription plan, Hair Growth Complex. Adds a required free-text box. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Oral Minoxidil ("Oral Capsule"), Topical Finasteride & Oral Minoxidil, Combination Capsule)_ _[code]_
- `Sexual Dysfunction` → **Removes a product**: Recommendation code switches off oral finasteride, topical finasteride and the combination spray, so these are taken out of the list of plans shown. Adds a required free-text box. _(affects: Finasteride ("Hair Loss Tablet" / "Oral Tablet"), Topical Finasteride ("Hair Loss Spray"), Combination Spray ("Finasteride and Minoxidil", with tretinoin), Core Plan (spray version), Core Plan - Capsule, Ultimate Plan (spray version), Ultimate Plan - Capsule, Topical Finasteride & Oral Minoxidil, Combination Capsule, Dutasteride Combination Spray)_ _[code]_
- `None of these` → **Next question**: Moves to the next question. No effect on what is offered. _[observed]_

**22. Please can you tell us more about this condition?**  
_text · anonymous · role: safety-screen · shown: only if High Blood Pressure ticked · no branch · observed_  
Why they ask: Detail on high blood pressure. Optional (the only condition box that can be left empty).


**23. Please can you tell us more about your condition and how you are managing it?**  
_text · anonymous · role: safety-screen · shown: only if Cardiovascular Disease ticked · no branch · observed_  
Why they ask: Detail on cardiovascular disease. Required.


**24. Please can you tell us more about your diagnosis and what medications you are using to manage this condition?**  
_text · anonymous · role: safety-screen · shown: only if Severe Kidney or Liver Disease ticked · no branch · observed_  
Why they ask: Detail on severe kidney or liver disease. Required.


**25. Please can you tell us more about this diagnosis and the treatment you are receiving for it**  
_text · anonymous · role: safety-screen · shown: only if Prostate Disease, Male Breast Cancer or Testicular Cancer ticked · no branch · observed_  
Why they ask: Detail on prostate disease or cancer. Required.


**26. Please can you tell us more about the medications that you are taking to manage this condition?**  
_text · anonymous · role: safety-screen · shown: only if Rheumatoid Arthritis, Systemic Lupus or on Methotrexate ticked · no branch · observed_  
Why they ask: Medicines for rheumatoid arthritis or lupus (methotrexate). Required.


**27. Please can you tell us more about your scalp and how you are managing it currently?**  
_text · anonymous · role: safety-screen · shown: only if Scalp Disorders ticked · no branch · observed_  
Why they ask: Detail on the scalp condition. Required.


**28. Which of the following scalp symptoms do you experience?**  
_multi · anonymous · role: diagnosis · shown: only if Scalp Disorders ticked · no branch · observed_  
Why they ask: Dandruff / seborrhoeic dermatitis symptom list. Newer question ids (56xx) than the rest, so recently added.

- `Persistent dandruff or flaking` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_
- `Greasy or yellow scales on the scalp` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_
- `Scalp itching associated with dandruff` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_
- `Red or irritated areas on the scalp` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_
- `Previously diagnosed with seborrheic dermatitis` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_
- `None of the above` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_

**29. Have you tried any treatments for scalp concerns before?**  
_multi · anonymous · role: diagnosis · shown: only if Scalp Disorders ticked · no branch · observed_  
Why they ask: What the man has already tried for his scalp.

- `Anti‑dandruff shampoos (e.g. ketoconazole, selenium sulphide, zinc)` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_
- `Prescription scalp treatments` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_
- `Regular cosmetic shampoos only` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_
- `I haven’t tried anything yet` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_

**30. Do any of the following apply to you?**  
_multi · anonymous · role: diagnosis · shown: only if Scalp Disorders ticked · no branch · observed_  
Why they ask: Scalp red flags: open sores, infection, severe pain. No warning or stop appears when ticked (not ticked in any run; from the definition there is no linked page).

- `Open sores, broken skin or infection on the scalp` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_
- `Severe scalp pain, oozing or signs of infection` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_
- `None of the above` → **No effect**: No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed). _[code]_

**31. When was this diagnosed and did you have surgery to correct this?**  
_text · anonymous · role: safety-screen · shown: only if Phaeochromocytoma ticked · no branch · observed_  
Why they ask: Detail on phaeochromocytoma. Required.


**32. Please can you tell us more as the oral treatments only have minute amounts of lactose in and most people can take these without issue - so that I can understand please tell me more about your allergy?**  
_text · anonymous · role: safety-screen · shown: only if Diagnosed Lactose Allergy ticked · no branch · observed_  
Why they ask: Detail on lactose allergy. Required. The wording tells the man the oral treatments hold only tiny amounts of lactose.


**33. Please can you tell me more about the sexual dysfunction you experience and how you manage it currently?**  
_text · anonymous · role: safety-screen · shown: only if Sexual Dysfunction ticked · no branch · observed_  
Why they ask: Detail on sexual dysfunction. Required.


**34. What is the date of the first order for this customer?**  
_date · anonymous · role: data-capture · shown: never shown to the patient (blank question type in the definition) · no branch · code_  
Why they ask: Internal field for staff/system use. It has no input type, so it is never drawn on screen.


**35. When was your most recent health check?**  
_date · anonymous · role: data-capture · shown: never shown to the patient (blank question type in the definition) · no branch · code_  
Why they ask: Internal field for the repeat "health check". Never drawn on screen.


**36. Please confirm that you've read and understood the following:**  
_info · anonymous · role: expectation-setting · shown: always (for anyone who answered Male) · no branch · observed_  
Why they ask: Finasteride safety statement: mood and sexual side effects, stop three months before trying for a baby, and a note that some plans contain off-label or unlicensed "specials". Shown to every man whatever he answered.


**37. I confirm that I have read and understood the above statement**  
_consent · anonymous · role: consent · shown: always (for anyone who answered Male) · no branch · observed_  
Why they ask: Required tick before the account form.

- `I confirm that I have read and understood the above statement` → **Next question**: Required. Unlocks the account form. _[observed]_

**38. NHS Summary Of Care (optional): "Do you consent to us accessing your NHS Summary Care Record (the medical details held by your GP) or requesting further information on your medical history from your GP?"**  
_consent · anonymous · role: consent · shown: always (for anyone who answered Male) · no branch · code_  
Why they ask: Optional consent for the prescriber to read the NHS Summary Care Record. Product pages say the final decision rests on the consultation "and NHS Summary Care Record".

- `NHS Summary Of Care` → **Flags for the clinician**: Opens a second tick box "I agree". Optional; no effect on the plans shown. _[code]_

**39. GP Consent (optional): "Do you consent to us sharing consultation information with your GP?"**  
_consent · anonymous · role: consent · shown: always (for anyone who answered Male) · BRANCHES · code_  
Why they ask: Optional consent to tell the GP. If agreed, the account form adds GP surgery name and address fields.  
Downstream: Agreeing adds five GP surgery fields to the account form.

- `GP Consent` → **Adds questions**: Opens a second tick box "I agree"; agreeing adds GP surgery fields to the account form. _[code]_

**40. Based on your questionnaire results, we are now preparing your personalised health plan. Please complete your account set up to continue.**  
_contact · anonymous · role: identity · shown: always, after the finasteride statement · no branch · observed_  
Why they ask: THE ACCOUNT WALL. Name, email, phone, date of birth and a password are needed to see any recommendation. Pressing the button creates the account and sends the whole consultation in one request (customer/survey). Date of birth is checked here: under 18 is refused on screen.


**41. Sons products are formulated for those born male and we do not currently provide treatment for those who were born female. Whilst some of these treatments may be suitable for those born female, we would recommend a face to face consultation with a hair loss specialist or GP to ensure the most appropriate treatment options.**  
_info · anonymous · role: eligibility-gate · shown: only if gender at birth = Female · no branch · observed_  
Why they ask: Stop screen for anyone who answers Female.


**42. Based on your responses in the consultation, our medical team recommend the following plan for you:**  
_info · after-account · role: product-selector · shown: after account creation · no branch · code_  
Why they ask: Recommendation screen ("<first name>'s Hair Growth Recommendations"). One or two primary plan cards, then "See more plans". The list is built in the browser from the answers by the code saved in recommendation-engine.excerpt.js.


**43. Choose your plan (subscription length)**  
_single · after-account · role: personalisation · shown: after account creation · no branch · code_  
Why they ask: Plan length = billing period. Paid up front, renews at the same interval.

- `1 month` → **Marketing only**: Sets how many months are sent and billed up front; longer plans cost less per month. Not every product has every length (minoxidil 1-month is hidden on the recommendation page). _[code]_
- `3 months` → **Marketing only**: Sets how many months are sent and billed up front; longer plans cost less per month. Not every product has every length (minoxidil 1-month is hidden on the recommendation page). _[code]_
- `6 months` → **Marketing only**: Sets how many months are sent and billed up front; longer plans cost less per month. Not every product has every length (minoxidil 1-month is hidden on the recommendation page). _[code]_
- `12 months` → **Marketing only**: Sets how many months are sent and billed up front; longer plans cost less per month. Not every product has every length (minoxidil 1-month is hidden on the recommendation page). _[code]_

**44. How did you hear about Sons?**  
_single · checkout · role: marketing · shown: checkout · no branch · code_  
Why they ask: Attribution survey at checkout.

- `Facebook/Instagram` → **Marketing only**: Marketing attribution only. _[code]_
- `Search Engine` → **Marketing only**: Marketing attribution only. _[code]_
- `Recommended by Friend / Family` → **Marketing only**: Marketing attribution only. _[code]_
- `TV Advertisement` → **Marketing only**: Marketing attribution only. _[code]_
- `Print Media (magazines, billboards)` → **Marketing only**: Marketing attribution only. _[code]_
- `Sports Team Partnership` → **Marketing only**: Marketing attribution only. _[code]_
- `Podcast / Radio` → **Marketing only**: Marketing attribution only. _[code]_
- `Clinic Referral` → **Marketing only**: Marketing attribution only. _[code]_
- `Online Reviews` → **Marketing only**: Marketing attribution only. _[code]_
- `Tiktok` → **Marketing only**: Marketing attribution only. _[code]_
- `Reddit` → **Marketing only**: Marketing attribution only. _[code]_
- `Youtube` → **Marketing only**: Marketing attribution only. _[code]_
- `ChatGPT` → **Marketing only**: Marketing attribution only. _[code]_
- `Train Poster` → **Marketing only**: Marketing attribution only. _[code]_

**45. I confirm that I have been informed that Minoxidil 2.5mg is approved for the treatment of high blood pressure, but is prescribed off-label for hair loss treatment and that approved alternatives exist. I agree to this off-label prescription.**  
_consent · checkout · role: consent · shown: checkout, when the basket holds oral minoxidil (market not confirmed) · no branch · code_  
Why they ask: Off-label consent for oral minoxidil. The text sits in the shared translation file with an error message "Please accept terms & conditions for this oral minoxidil product"; which markets show it was not confirmed.

- `I have read the notice and explicitly agree to off-label prescription.` → **Unknown**: Not tested (behind the account wall). _[unknown]_

**46. Ketoconazole terms and conditions (exact wording not served to anonymous visitors)**  
_consent · checkout · role: consent · shown: checkout, when the basket holds ketoconazole shampoo · no branch · code_  
Why they ask: The checkout refuses to place the order until "all terms and conditions for this Ketoconazole product" are accepted.


**47. Pharmacy disclaimer (exact wording not served to anonymous visitors)**  
_consent · checkout · role: consent · shown: checkout · no branch · code_  
Why they ask: Error text in code: "Please accept the pharmacy disclaimer."


**48. Identity verification: British passport or driving licence number**  
_text · checkout · role: identity · shown: after order, only if the automatic check fails · no branch · code_  
Why they ask: If automatic identity checks fail, the customer is asked for passport MRZ digits or driving licence number. Orders "without a male patient name will be held".


**49. Before your next order can be dispatched, we require you to confirm if you've experienced any changes in your health status whilst using your prescription medication**  
_single · after-account · role: safety-screen · shown: existing subscribers, before a renewal is sent · no branch · code_  
Why they ask: Repeat "health check" for subscribers. "Changed" reopens the consultation in health_check mode; the answer page can report "eligibility_changed".

- `No changes in my health status` → **Unknown**: Not tested (behind the account wall). _[unknown]_
- `My health status has changed` → **Unknown**: Not tested (behind the account wall). _[unknown]_

### Oral minoxidil 5 mg step-up consultation (existing customers on 2.5 mg)

Entry: https://shop.sons.co.uk/consultation/?logged_in=false&oral_minoxidil_5mg=true

One page, four visible questions plus two conditional text boxes. The questions render for an anonymous visitor; submitting needs a signed-in customer (not tested).

**1. How would you describe your response to oral minoxidil 2.5 mg so far?**  
_single · anonymous · role: personalisation · shown: always · no branch · observed_  
Why they ask: Has 2.5 mg worked? Step-up is pitched at men who have plateaued.

- `I've had a good response and I'm happy to continue improving` → **Unknown**: Effect on approval unknown; the form is a single page with no stop screens. _(affects: Oral Minoxidil 5mg (two 2.5 mg capsules a day))_ _[unknown]_
- `I've had some improvement but it now seems to have plateaued` → **Unknown**: Effect on approval unknown; the form is a single page with no stop screens. _(affects: Oral Minoxidil 5mg (two 2.5 mg capsules a day))_ _[unknown]_
- `I've had only a limited improvement so far` → **Unknown**: Effect on approval unknown; the form is a single page with no stop screens. _(affects: Oral Minoxidil 5mg (two 2.5 mg capsules a day))_ _[unknown]_
- `I've seen little or no improvement` → **Unknown**: Effect on approval unknown; the form is a single page with no stop screens. _(affects: Oral Minoxidil 5mg (two 2.5 mg capsules a day))_ _[unknown]_

**2. Have you experienced any side effects whilst taking oral minoxidil 2.5 mg?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Side effects on 2.5 mg.  
Downstream: Yes shows the free-text box that follows.

- `Yes` → **Adds questions**: Opens a required free-text box. Effect on approval unknown (reviewed by the prescriber). _[code]_
- `No` → **Unknown**: No extra box. _(affects: Oral Minoxidil 5mg (two 2.5 mg capsules a day))_ _[unknown]_

**3. Please can you tell us more about the side effects you have experienced?**  
_text · anonymous · role: safety-screen · shown: only if the question before = Yes · no branch · code_  
Why they ask: Free text on side effects.


**4. Since starting oral minoxidil, have there been any changes to your health or medicines?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Changes in health or medicines since starting.  
Downstream: Yes shows the free-text box that follows.

- `Yes` → **Adds questions**: Opens a required free-text box. Effect on approval unknown (reviewed by the prescriber). _[code]_
- `No` → **Unknown**: No extra box. _(affects: Oral Minoxidil 5mg (two 2.5 mg capsules a day))_ _[unknown]_

**5. Please can you tell us more about what has changed?**  
_text · anonymous · role: safety-screen · shown: only if the question before = Yes · no branch · code_  
Why they ask: Free text on what changed.


**6. I confirm that I wish to increase my oral minoxidil treatment from 2.5 mg to 5 mg. I understand that this is a higher dose and that if I develop any side effects or concerning symptoms, I should stop treatment and seek advice from a healthcare professional.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Consent to double the dose.

- `I confirm` → **Unknown**: Effect on approval unknown; the form is a single page with no stop screens. _(affects: Oral Minoxidil 5mg (two 2.5 mg capsules a day))_ _[unknown]_

### Beard consultation (Beard Booster; facial hair, not scalp)

Entry: https://shop.sons.co.uk/beard-consultation/

Same two gates and declaration → 4 to 9 beard questions → ACCOUNT WALL → Beard Booster product page. Only the first screen was seen live; the rest is from the definition the page downloaded.

**1. Are you an existing Sons customer?**  
_single · anonymous · role: identity · shown: always · no branch · code_  
Why they ask: Existing customers are sent to sign in.

- `Yes` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `No` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_

**2. What is your gender at birth?**  
_single · anonymous · role: eligibility-gate · shown: always · no branch · code_  
Why they ask: Born-male gate (same as the hair flow).

- `Female` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `Male` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_

**3. Please read the statement and accept if you meet all the criteria**  
_consent · anonymous · role: consent · shown: code condition: {5141} anyof ['0'] · no branch · code_  
Why they ask: Self-declaration tick.

- `I accept` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_

**4. Please select the answer that best describes your beard hair loss**  
_single · anonymous · role: diagnosis · shown: code condition: {5141} anyof ['0'] · no branch · code_  
Why they ask: Pattern of beard loss. Sudden well-defined patches or inflamed skin point away from simple patchy growth.

- `Slow, patchy or thin growth areas` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `New/sudden well-defined areas of beard loss` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `Inflamed/irritated skin with beard loss` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `No growth` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_

**5. Have you noticed any hair loss on other parts of your body apart from your beard and head?**  
_single · anonymous · role: safety-screen · shown: code condition: {5141} anyof ['0'] · BRANCHES · code_  
Why they ask: Hair loss elsewhere on the body.

- `Yes` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `No` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_

**6. Please tell us more about your hair loss on the rest of your body?**  
_text · anonymous · role: safety-screen · shown: code condition: {5173} anyof ['1'] · no branch · code_  
Why they ask: Free text.


**7. Have you taken minoxidil/regaine before/in the last 12 months?**  
_single · anonymous · role: safety-screen · shown: code condition: {5141} anyof ['0'] · BRANCHES · code_  
Why they ask: Minoxidil history.

- `Yes` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `No` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_

**8. Did you experience any side effects?**  
_single · anonymous · role: safety-screen · shown: code condition: {5175} anyof ['1'] · BRANCHES · code_  
Why they ask: Minoxidil side effects.

- `Yes` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `No` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_

**9. Please can you tell us what side effects you have experienced from minoxidil/regaine?**  
_text · anonymous · role: safety-screen · shown: code condition: {5176} anyof ['1'] · no branch · code_  
Why they ask: Free text.


**10. Are you allergic to minoxidil or tretinoin?**  
_single · anonymous · role: safety-screen · shown: code condition: {5141} anyof ['0'] · no branch · code_  
Why they ask: Allergy to either active ingredient.

- `Yes` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `No` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_

**11. Do you suffer from any of the following affecting the face?**  
_multi · anonymous · role: safety-screen · shown: code condition: {5141} anyof ['0'] · BRANCHES · code_  
Why they ask: Skin conditions of the face.

- `Psoriasis` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `Eczema` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `Scalp/skin infections` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `Any other medical conditions/operations' affecting the face/beard area` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `None of these` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_

**12. Psoriasis, eczema and related skin conditions can be exacerbated with the use of topical minoxidil and tretinoin. Are you willing to proceed?**  
_single · anonymous · role: consent · shown: code condition: {5179} anyof ['0'] · no branch · code_  
Why they ask: Informed-risk question for psoriasis.

- `Yes` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_
- `No` → **Unknown**: Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page. _(affects: Beard Booster)_ _[unknown]_

**13. Please, can you tell us more about the issues that you have with your face?**  
_text · anonymous · role: safety-screen · shown: code condition: {5179} anyof ['3'] · no branch · code_  
Why they ask: Free text.


**14. Based on your questionnaire results, we are now preparing your personalised health plan. Please complete your account set up to continue.**  
_contact · anonymous · role: identity · shown: always, last screen · no branch · code_  
Why they ask: Account wall (same form as the hair flow). After it the code sends the man to the Beard Booster product page.


### Partner hair-transplant clinic entry

Entry: https://shop.sons.co.uk/clinics/british-hair-clinic

Clinic landing page (treatment type, procedure date) → the standard hair consultation with the clinic attached → clinic recommendation page with the clinic's own pre-/post-procedure plan list. Only the landing page was opened.

**1. What is your treatment type?**  
_single · anonymous · role: product-selector · shown: on shop.sons.co.uk/clinics/<clinic> · BRANCHES · observed_  
Why they ask: Partner hair-transplant clinic landing page. Ties the man to the clinic and to a pre- or post-procedure plan list.  
Downstream: Leads to a procedure date question, then the standard consultation with clinic_id attached.

- `transplant (the only value in the clinic record for British Hair Clinic; the on-screen label was not opened)` → **Unknown**: Unknown. The clinic record carries separate pre-procedure and post-procedure plan lists. _(affects: Hair Transplant Clinic Bundle)_ _[unknown]_

**2. What is your procedure date?**  
_date · anonymous · role: product-selector · shown: after treatment type · no branch · code_  
Why they ask: Decides pre-op versus post-op plans and the free post-op pack ("You're eligible for a free* post-op transplant pack worth £49.99").


## 7. Competitive read

**Strengths**

- Very short: a healthy man clicks through 10 screens before the account form, most of them one tap.
- Holds its own UK licences for finasteride 1 mg and minoxidil 5%, and says so; it is open that sprays and capsules are unlicensed specials.
- Wide format choice (tablet, spray, capsule, combined spray, combined capsule) with a Spray/Capsule toggle on each plan card.
- PHQ-2 style mood questions and a finasteride safety statement sit inside the flow.
- Optional NHS Summary Care Record and GP-sharing consents.
- Money-back "Sons Promise" after six months, a repeat health check before renewals, and a partner-clinic programme for transplant patients.

**Weaknesses**

- No recommendation, price or product is shown until the visitor hands over name, email, phone, date of birth and a password.
- The hair picture (including "Random patches" and "Completely bald") and the sudden-onset follow-ups do not change what is offered in the served code; a man with sudden patchy loss is still shown minoxidil and a supplement.
- Age is not asked before the wall; the over-65 rule differs between the two code copies and from the product pages (18-75 for finasteride).
- No questions on current medicines (apart from one yes/no after sudden onset), allergies, low blood pressure, family history, how long hair has been thinning, or goals.
- The whole rule set runs in the browser and is readable by anyone, with a hidden "Debug (Dev Only)" block of reasons in the page.
- Women are turned away with no alternative product or signposting beyond "see a GP".
- Small wording and data slips: "Is their hair loss over other parts of your body?", the drawing for "Random patches" looks like a larger temples-and-crown pattern rather than patches, product pages that disagree with the leaflet on the combination spray strength.

**Gaps a new competitor could use**

- Show a provisional plan and price before asking for contact details.
- Use the pattern picture and onset answers for real triage (stop or refer for patchy, sudden or scarring loss) and explain why.
- Serve women, whom Sons refuses outright.
- Ask about current medicines, blood pressure and goals, and explain each exclusion to the patient instead of silently hiding plans.
- Offer a clear route for men over 65 and men trying for a baby.

## 10. Limits of this report

- Nothing after the account form was seen live. The recommendation rules are read from code the site serves; the server may add or override them (it can send its own ordered list and sets account tags such as finasteride_disallowed).
- What the prescriber at the partner pharmacy does with the answers, how often orders are refused, and whether photos are ever requested are unknown.
- Two copies of the recommendation code disagree in places (order of the list, number of primary cards, over-65 rule). Which one new customers see was not confirmed.
- Prices are list prices on one day during a Black Friday sale; first-order discounts change often.
- Legal class of the minoxidil spray and ketoconazole shampoo (P or GSL) was not checked against the MHRA register.
- The exact wording of checkout consents (pharmacy disclaimer, ketoconazole terms) is not served to anonymous visitors.

## 11. Sources

- [Sons consultation landing page](https://sons.co.uk/pages/consultation-hair)
- [Consultation app](https://shop.sons.co.uk/consultation/?logged_in=false)
- [Survey definition requested by the consultation page (saved as quiz-definition.json)](https://api.sons.co.uk/barber/survey/code/loader?code=uk_consultation&pharmacy=tip)
- [Recommendation page whose inline script holds the rules (saved as recommendation-engine.excerpt.js)](https://sons.co.uk/pages/recommendation)
- [Public product feed](https://sons.co.uk/products.json?limit=250)
- [Hair loss plans page](https://sons.co.uk/pages/hair-loss)
- [Medical FAQs](https://sons.co.uk/pages/medical-faqs)
- [Subscription and order FAQs](https://sons.co.uk/pages/subscription-faqs)
- [Finasteride FAQs](https://sons.co.uk/pages/finasteride-faqs)
- [Minoxidil FAQs](https://sons.co.uk/pages/minoxidil-faqs)
- [Terms and conditions (pharmacy partner, prescribers, subscription, cancellation)](https://sons.co.uk/pages/terms-conditions)
- [Sons Promise (money-back guarantee terms)](https://sons.co.uk/pages/sons-promise)
- [Refund policy](https://sons.co.uk/pages/refund-policy)
- [Leaflet: topical finasteride 0.15%, minoxidil 5%, tretinoin 0.015% spray](https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_MinoFinaTret_Topical_PIL_1126_site.pdf)
- [Leaflet: finasteride topical spray 0.15%](https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Topical_Finasteride_PIL_Site_Version.pdf)
- [Leaflet: minoxidil 2.5 mg and biotin capsules](https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Oral_Minoxidil__Biotin_PIL_Outlined_4.pdf)
- [Leaflet: finasteride, minoxidil and biotin combination capsule](https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Combo_Cap_Leaflet_01_Site.pdf)
- [Leaflet: dutasteride 0.1%, minoxidil 5%, tretinoin 0.01% spray](https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Dutasteride_Mino_Tret_PIL_0726.pdf)
- [Leaflet: Beard Booster (minoxidil 6%, tretinoin 0.01%)](https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Beard_Booster_PIL_A522UKA01_260526.pdf)
- [Partner clinic page (example)](https://shop.sons.co.uk/clinics/british-hair-clinic)
- [The Independent Pharmacy hair-loss page (partner pharmacy)](https://www.theindependentpharmacy.co.uk/hair-loss-treatments)
