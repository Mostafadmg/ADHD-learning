# Hims (US), with sister brand Hers (US): consultation and product report

**Market:** US · **Website:** https://www.hims.com/hair-loss · **Checked:** 2026-11-23 · **Owner:** Hims & Hers Health, Inc.

> Subscription telehealth: online intake reviewed by a licensed provider (by message, or by video where a state requires it), then compounded or generic hair-loss medicines shipped on multi-month plans, plus over-the-counter products sold without a consultation.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** Not located. The consultation at hims.com/c/hl could not be opened, so where sign-in is forced in the US flow is unknown. (The landing-page pre-quiz has no wall and ends by linking to /c/hl.)
- **Blocker:** hims.com/c/hl and /c/hl/goals: the page itself returns HTTP 200, but Cloudflare answers the site's own script files (/hims.us.modern.*.js) with HTTP 403 "Just a moment..." (header cf-mitigated: challenge). The quiz is drawn by those scripts, so it never leaves the loading spinner. Tried twice, 30+ seconds apart. Not bypassed.
- **Blocker:** forhers.com (Hers US): every page shows Cloudflare's "Performing security verification" check. Not bypassed.
- **Blocker:** The fetch tool gets HTTP 403 from hims.com and forhers.com as well.

What was done: every hair product page on hims.com was read (they are server-rendered and load normally), with ingredients, strengths and public prices; all entry links were mapped; one landing-page pre-quiz (3 questions) was walked live and its definition extracted from the page data; safety information pages and help-centre drug sheets were read for who can and cannot have each treatment. What was NOT done: the real consultation (questions, branching, recommendation screen, plan prices, account wall) for men, and anything at all on Hers for women. The men's question list is a skeleton of topics, not real screens.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

Not observed. From public documents only: every prescription route goes through one consultation (/c/hl). The visitor fills in an intake form (hair goals, hair-loss pattern, products tried, family history, lifestyle, stress, styling habits, medical history, medicines), usually adds photos, and a licensed provider "reviews your info and recommends the right treatment". The site code keeps a recommended product and recommended dose that the customer may override, and lets the customer choose product, strength, quantity and plan length. Published "who should not use" lists show the medical reasons that would rule products out. The three questions on advertising landing pages are marketing only.

## 3. Engine rules (7)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men | Age under 18 | Not eligible for any prescription hair product. Published in the safety information ("are younger than 18 years of age"; "Anyone younger than 18 years of age"). How the questionnaire applies it was not seen. _(affects: Finasteride & Minoxidil + Supplement Blend Pill, Finasteride & Minoxidil + Supplement Blend Chew, Rx Hair Loss Spray (Topical Finasteride & Minoxidil Spray), Rx Hair Loss Spray + Ketoconazole + Biotin (4-in-1 spray), Rx Hair Loss Serum (Topical Finasteride & Minoxidil Serum), Minoxidil + Supplement Blend Chew, Finasteride (generic Propecia) 1 mg tablets)_ | Stops the patient | docs | medium |
| R2 | men | Woman, or anyone pregnant, breastfeeding or able to become pregnant | Finasteride products are not for them: "intended for use by adult MEN ONLY" (spray); "intended for use by individuals assigned male at birth ... who are not pregnant, breastfeeding, or able to become pregnant" (finasteride, pill). Hims sends women to Hers. _(affects: Finasteride & Minoxidil + Supplement Blend Pill, Finasteride & Minoxidil + Supplement Blend Chew, Rx Hair Loss Spray (Topical Finasteride & Minoxidil Spray), Rx Hair Loss Spray + Ketoconazole + Biotin (4-in-1 spray), Rx Hair Loss Serum (Topical Finasteride & Minoxidil Serum), Finasteride (generic Propecia) 1 mg tablets, Hair Power Pack, Finasteride & Minoxidil (two-product kit; probably the "Hair Loss Duo" named in Hims blog posts))_ | Stops the patient | docs | medium |
| R3 | men | Currently taking oral finasteride (Propecia, Proscar) or another 5-alpha reductase inhibitor (dutasteride, Avodart, Jalyn) | Should not use the topical finasteride + minoxidil spray: "Oral finasteride and topical finasteride + minoxidil spray cannot be used at the same time". The pill has the same rule. Whether the engine removes these products or asks the patient to stop the other medicine was not seen. _(affects: Finasteride & Minoxidil + Supplement Blend Pill, Rx Hair Loss Spray (Topical Finasteride & Minoxidil Spray), Rx Hair Loss Spray + Ketoconazole + Biotin (4-in-1 spray), Rx Hair Loss Serum (Topical Finasteride & Minoxidil Serum))_ | Removes a product | docs | low |
| R4 | men | Chronic liver disease (not fatty liver), history of breast cancer, or history of prostate cancer | Listed under "Do not use topical finasteride + minoxidil if you". Application by the engine not seen. _(affects: Rx Hair Loss Spray (Topical Finasteride & Minoxidil Spray), Rx Hair Loss Spray + Ketoconazole + Biotin (4-in-1 spray), Rx Hair Loss Serum (Topical Finasteride & Minoxidil Serum))_ | Removes a product | docs | low |
| R5 | men | Any of: pheochromocytoma; blood thinners, antiplatelet drugs or antifungals; bleeding disorder; liver disease; prostate cancer or male breast cancer in the last 5 years; recent chemotherapy; prostate problems; high-dose zinc supplements; allergy to grapes or wine; certain heart disease; chronic kidney disease stage 3 to 5; already using a finasteride or minoxidil product | Listed under "Who should not take Finasteride & Minoxidil + Supplement Blend" (the combination pill, which contains oral minoxidil). Application by the engine not seen. _(affects: Finasteride & Minoxidil + Supplement Blend Pill)_ | Removes a product | docs | low |
| R6 | men | State of residence is one that requires a live visit | "In some states, a video visit with a healthcare provider is required. If you reside in one of these states, you will be prompted to schedule a video visit after submitting your online intake form." Elsewhere the provider replies by secure message. | Adds questions | docs | medium |
| R7 | lp-prequiz | Any answer to the three landing-page questions | No effect on eligibility or products. The served definition has no branch, and the page says the answers are not a medical assessment and are not shared with a provider. | Marketing only | code | high |

## 4. Products (25)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Finasteride & Minoxidil + Supplement Blend Pill](https://www.hims.com/hair-loss/finasteride-minoxidil-supplement-pill) | rx-oral-compounded | finasteride 1.2 mg; minoxidil 3 mg; biotin 2.5 mg; vitamin B12 1 mg; vitamin C 100 mg; resveratrol 20 mg; zinc sulfate 30 mg (about 6.8 mg elemental zinc) | tablet, once a day | men | US prescription only, compounded (not FDA-approved; "FDA does not approve nor verify the safety, effectiveness, or quality of compounded drugs") | Starting at $35 per month (hair-loss landing page, 23 Nov 2026) (Product pages and the /lp landing page show "Starting at $29 per month*" with the footnote "*With a 10-month plan, paid upfront in full. Pricing varies by subscription plan". Prices for other plan lengths are only shown…) | unknown (the consultation that makes the recommendation could not be opened: see access.blockers) | docs |
| [Finasteride & Minoxidil + Supplement Blend Chew](https://www.hims.com/hair-loss-finasteride-minox-chew) | rx-oral-compounded | finasteride 1.2 mg; minoxidil 3 mg; biotin; vitamin B5; vitamin B6; vitamin C | chewable, once a day (citrus flavour) | men | US prescription only, compounded (not FDA-approved; "FDA does not approve nor verify the safety, effectiveness, or quality of compounded drugs") | Starting at $35 per month (hair-loss landing page, 23 Nov 2026) ("Starting at $29 per month*" on product pages and the /lp page (*10-month plan paid upfront). Supplement amounts are not published ("proprietary blend"). Tagged "Most popular".) | unknown (the consultation that makes the recommendation could not be opened: see access.blockers) | docs |
| [Rx Hair Loss Spray (Topical Finasteride & Minoxidil Spray)](https://www.hims.com/hair-loss/topical-finasteride) | rx-topical-compounded | finasteride 0.3%; minoxidil 6% | scalp spray, once a day | men | US prescription only, compounded (not FDA-approved; "FDA does not approve nor verify the safety, effectiveness, or quality of compounded drugs") | Starting at $35 per month (hair-loss landing page, 23 Nov 2026) ("Starting at $29 per month*" on product pages (*10-month plan paid upfront). Hims blog (hims-vs-keeps, 2025): "start at $35 a month (when you opt for a five-month plan) or $50 for a three-month plan" (the blog says this…) | unknown (the consultation that makes the recommendation could not be opened: see access.blockers) | docs |
| [Rx Hair Loss Spray + Ketoconazole + Biotin (4-in-1 spray)](https://www.hims.com/hair-loss/hair-loss-spray) | rx-topical-compounded | finasteride 0.3%; minoxidil 7%; ketoconazole 2.2%; biotin 0.2% | scalp spray, once a day (eucalyptus scent) | men | US prescription only, compounded (not FDA-approved; "FDA does not approve nor verify the safety, effectiveness, or quality of compounded drugs") | Starting at $39 per month (hair-loss landing page, 23 Nov 2026) ("Starting at $33 per month" on product-page carousels. Hims blog (2025): "our 4-in-1 spray ... retails for $39 a month". Fortune (2026) calls it a "select-market" product, so it may not be offered in every state (not co…) | unknown (the consultation that makes the recommendation could not be opened: see access.blockers) | docs |
| [Rx Hair Loss Serum (Topical Finasteride & Minoxidil Serum)](https://www.hims.com/hair-loss/serum) | rx-topical-compounded | finasteride 0.3%; minoxidil 6%; essential oil blend (rosemary, juniper, cedar, tea tree, sandalwood, lavender, eucalyptus) | scalp serum with dropper, once a day | men | US prescription only, compounded (not FDA-approved; "FDA does not approve nor verify the safety, effectiveness, or quality of compounded drugs") | Starting at $35 per month (hair-loss landing page, 23 Nov 2026) ("Starting at $29 per month*" on product pages (*10-month plan paid upfront). Tagged "Direct application".) | unknown (the consultation that makes the recommendation could not be opened: see access.blockers) | docs |
| [Minoxidil + Supplement Blend Chew](https://www.hims.com/hair-loss/minox-chew) | rx-oral-compounded | minoxidil 3 mg; biotin; vitamin B5; vitamin B6; vitamin C | chewable, once a day (orange flavour) | men | US prescription only, compounded (not FDA-approved; "FDA does not approve nor verify the safety, effectiveness, or quality of compounded drugs") | $29 per month on a 10-month plan, paid upfront in full (Shown as "Starting at $29 per month" everywhere. The Google Shopping page states "$29/mo, 10-mo plan*". No finasteride: the oral option without a DHT blocker. Tagged "Convenient routine".) | unknown (the consultation that makes the recommendation could not be opened: see access.blockers) | docs |
| [Finasteride (generic Propecia) 1 mg tablets](https://www.hims.com/hair-loss/finasteride) | rx-oral | finasteride 1 mg | tablet, once a day | men | US prescription only, FDA-approved generic | Starting at $22 per month (Shopping page: "One time purchase price is for a 12-month supply of Finasteride. Subscription price is for a 3-month supply" (the amounts are drawn by script and were not in the page text). Refund offer on that page: "F…) | unknown (the consultation that makes the recommendation could not be opened: see access.blockers) | docs |
| [Hair Power Pack](https://www.hims.com/hair-loss/hair-power-pack) | bundle | finasteride tablets, once a day (1 mg per the finasteride page); minoxidil solution, 1 mL twice a day (5% per the minoxidil page); saw palmetto (Thick Fix shampoo); biotin (gummies) | kit: tablets + scalp solution + shampoo + gummies | men | US prescription only (contains FDA-approved finasteride) plus OTC items | Starting at $60 per month (The product page showed "Out of stock" on 23 Nov 2026. A separate shopping page sells a "custom kit": "Subscribe at $26/mo Best Value. Get Finasteride pills and your choice of: Biotin Gummy Vitamins, Minoxidil Solution,…) | unknown (the consultation that makes the recommendation could not be opened: see access.blockers) | docs |
| [Finasteride & Minoxidil (two-product kit; probably the "Hair Loss Duo" named in Hims blog posts)](https://www.hims.com/lp/hair-start-top-fin-fa) | bundle | finasteride not stated on the card (1 mg tablets inferred); minoxidil not stated on the card (topical inferred) | kit of two products (formats not stated on the card) | men | US prescription only (finasteride) plus minoxidil | Starting at $32 per month* (*10-month plan paid upfront, per the /lp page footnote) (Seen only as a card on the landing page /lp/hair-start-top-fin-fa, with the finasteride safety link (so the finasteride part is the oral tablet: inferred). Card text: ("When used together, men saw better results in clin…) | unknown (the consultation that makes the recommendation could not be opened: see access.blockers) | docs |
| [Minoxidil Foam 5%](https://www.hims.com/hair-loss/minoxidil-foam) | otc-medicine | minoxidil 5% | foam, twice a day | men | US OTC drug (FDA-approved, no prescription) | $20 one-time purchase; "Starting at $19 per month" on subscription ("Subscribe and save: Save up to 5%". The plan picker text also reads "1-month supply $20 $30/ea", which could not be interpreted without the page script. One-time purchase or subscription. Add to cart, no consultation. …) | Sold without a consultation (add to cart). Whether the consultation offers it as an add-on was not seen. | docs |
| [Minoxidil Solution 5% ("Minoxidil Serum" / drops)](https://www.hims.com/hair-loss/minoxidil) | otc-medicine | minoxidil 5% | scalp solution with dropper, twice a day | men | US OTC drug (FDA-approved, no prescription) | $15 each; "Starting at $15 per month" (Subscription "Shipped every 3 months" or one-time purchase at $15/ea. The page says it "works best to regrow hair in the vertex or crown area. If you're experiencing a receding hairline, finasteride might work for you.") | Sold without a consultation (add to cart). | docs |
| [Non-Prescription Hair Loss Kit](https://www.hims.com/hair-loss/non-prescription-hair-kit) | bundle | minoxidil 5% solution, 2 oz; saw palmetto (Thick Fix shampoo, 6.4 oz); biotin (30 gummies) | kit: scalp solution + shampoo + gummies | men | US OTC drug plus cosmetic plus dietary supplement (no prescription) | $37 a month on subscription ("Shipped every 1 month (most popular)". No consultation needed.) | Sold without a consultation. | docs |
| [Thick Fix Thickening Shampoo](https://www.hims.com/hair-care/hair-thickening-shampoo) | cosmetic | saw palmetto | shampoo | men | Cosmetic | $19 (Add to cart. Also part of the Hair Power Pack and the non-prescription kit.) | Sold without a consultation. | docs |
| [Thick Fix Thickening Conditioner](https://www.hims.com/hair-care/conditioner) | cosmetic | niacinamide; panthenol | conditioner | men | Cosmetic | $22 (Add to cart.) | Sold without a consultation. | docs |
| [Biotin Gummies](https://www.hims.com/hair-care/vitamins) | supplement | biotin (vitamin B7); vitamin B12; vitamin B6 2 mg; vitamin D; folic acid; niacin 5 mg | gummy, one a day | men | US dietary supplement | $16 (Subscription "Shipped every 3 months" or one-time at $16/ea. The page says: "Biotin gummies are not a hair loss treatment".) | Sold without a consultation. | docs |
| [Dandruff Detox Shampoo](https://www.hims.com/hair-loss/zinc-pyrithione-shampoo) | otc-medicine | pyrithione zinc 1%; salicylic acid (listed as inactive) | medicated shampoo | men | US OTC drug (classification inferred from the anti-dandruff active; the page calls it a "medicated shampoo") | $18 one-time; about $17 on subscription ("Subscribe and save: Save up to 17%". The plan line reads "1 bottle every month $18 $17/ea" (taken as $17 on subscription).) | Sold without a consultation. | docs |
| [Max Volume Shampoo](https://www.hims.com/hair-care/volumizing-shampoo-men) | cosmetic | linden bud extract (Biovolume 128); caffeine; biotin; chia seed oil; hydrolysed rice protein | shampoo, 6.4 fl oz | men | Cosmetic | $18 one-time; about $17 on subscription (Plan line reads "1 bottle every month $18 $17/ea".) | Sold without a consultation. | docs |
| [Max Volume Conditioner](https://www.hims.com/hair-care/volumizing-conditioner) | cosmetic | argan oil; rice bran oil; linden bud extract (Biovolume 128); biotin | conditioner, 6.4 fl oz | men | Cosmetic | $18 one-time; about $17 on subscription (Plan line reads "1 bottle every month $18 $17/ea".) | Sold without a consultation. | docs |
| [Max Volume Shampoo & Conditioner](https://www.hims.com/hair-care/volumizing-shampoo-conditioner) | bundle | linden bud extract (Biovolume 128); biotin; caffeine; argan oil | shampoo + conditioner set | men | Cosmetic | $32 one-time; about $30 on subscription ("Save up to 6%". Plan line reads "1 kit every month $32 $30/ea".) | Sold without a consultation. | docs |
| [Compounded Oral Combination Tablet (ED and Hair Loss)](https://support.hims.com/hc/en-us/articles/38844902419995-Compounded-Oral-Combination-Tablet-ED-and-Hair-Loss) | rx-oral-compounded | tadalafil; finasteride; minoxidil; biotin; vitamin B12; vitamin D3 | tablet | men | US prescription only, compounded (not FDA-approved; "FDA does not approve nor verify the safety, effectiveness, or quality of compounded drugs") | unknown (no public product page found in the hair section) (Known only from a help-centre patient drug-information sheet, which says "Your compounded medication may not include all of the ingredients below". Strengths not published. Probably sold through the sexual-health consul…) | unknown | docs |
| [Minoxidil tablets (oral minoxidil on its own)](https://support.hims.com/hc/en-us/articles/38944589097883-Minoxidil) | rx-oral | minoxidil dose not published | tablet, once a day | both | US prescription only (FDA-approved drug used off-label for hair loss) | unknown (no public product page on hims.com) (Known only from a help-centre drug-information sheet shared by Hims and Hers: "Minoxidil tablets may be used to help stimulate hair growth in certain patients experiencing hair loss". Likely a Hers product or a provider…) | unknown | docs |
| [Hers Oral Minoxidil](https://www.forhers.com/hair-loss/oral-minoxidil) | rx-oral | minoxidil starting dose 1.25 mg, option to increase to 2.5 mg (as quoted from the Hers page by a search engine) | pill, once a day | women | US prescription only (off-label use) | unknown directly; a third-party roundup (NCOA) quotes "$29 per month on Hers" (The Hers site could not be opened (security check). Details are from search-engine snippets of the page, not from the page itself.) | unknown (Hers consultation not reachable) | docs |
| [Hers Minoxidil + hair vitamin ("Hair Blends", compounded)](https://www.forhers.com/hair-loss/minoxidil-hair-vitamin) | rx-oral-compounded | minoxidil not seen; vitamin blend not seen | unknown (pill or chew) | women | US prescription only, compounded (not FDA-approved; "FDA does not approve nor verify the safety, effectiveness, or quality of compounded drugs") | unknown (Search result title "Most popular Rx". Page not opened (security check). Ingredients and strengths not verified.) | unknown (Hers consultation not reachable) | docs |
| [Hers Minoxidil + Biotin Chew](https://www.forhers.com/hair-loss/minoxidil-biotin-chew) | rx-oral-compounded | minoxidil not seen; biotin not seen | chewable | women | US prescription only, compounded (not FDA-approved; "FDA does not approve nor verify the safety, effectiveness, or quality of compounded drugs") | unknown (Search result title "2-in-1 treatment Rx". Page not opened (security check).) | unknown (Hers consultation not reachable) | docs |
| [Hers Spironolactone (for hair loss)](https://www.forhers.com/hair-loss/spironolactone) | rx-oral | spironolactone not seen | tablet | women | US prescription only (off-label use) | unknown (Search snippet: "blocking androgen hormones which can lead to hair loss in women". A Hims/Hers help-centre drug sheet for spironolactone exists. Page not opened (security check).) | unknown (Hers consultation not reachable) | docs |

## 5. Who gets what (0 patient profiles)


## 6. The consultation, question by question

### Landing-page pre-quiz (3 marketing questions)

Entry: https://www.hims.com/lp/hair-start-top-fin-fa

3 anonymous marketing questions on the landing page itself, then a product pitch with buttons to the real consultation at /c/hl. No account, no medical question, no recommendation.

**1. What are your hair goals?**  
_single · anonymous · role: marketing · shown: always (first of 3, shown in the hero of the landing page) · no branch · observed_  
Why they ask: Engagement: gets the visitor clicking before the sales pitch. The page states the answers are not a medical assessment.  
Downstream: No branch in the served definition (options are plain text with no target).

- `Stop hair loss` → **Unknown**: Not clicked in a live run. The served page data gives this option no target of its own (plain text), so it should only move to the next question; stage 2 can confirm in one replay. _[unknown]_
- `Regrow hair` → **Unknown**: Not clicked in a live run. The served page data gives this option no target of its own (plain text), so it should only move to the next question; stage 2 can confirm in one replay. _[unknown]_
- `Both` → **Marketing only**: Moves to question 2. No page change, no network call, no product change. _[observed]_

**2. Are you looking for a simple solution to regrow your hair?**  
_single · anonymous · role: marketing · shown: after lp-q1 is answered · no branch · observed_  
Why they ask: Engagement and framing ("simple solution" leads into the once-a-day spray pitch).  
Downstream: No branch in the served definition.

- `Yes` → **Marketing only**: Moves to question 3. Nothing else changes. _[observed]_
- `No` → **Unknown**: Not clicked in a live run. The served page data gives this option no target of its own (plain text), so it should only move to the next question; stage 2 can confirm in one replay. _[unknown]_

**3. Are you interested in prescription-strength Rx treatments?**  
_single · anonymous · role: marketing · shown: after lp-q2 is answered · no branch · observed_  
Why they ask: Leads into the spray pitch whatever the answer.  
Downstream: Both options have the same target in the served page data.

- `Yes` → **Marketing only**: Scrolls the same page to the block "Prescription-strength ingredients for real results" with the buttons "Get the spray" and "See if treatment is right for me" (both go to /c/hl). _(affects: Rx Hair Loss Spray (Topical Finasteride & Minoxidil Spray), Rx Hair Loss Spray + Ketoconazole + Biotin (4-in-1 spray))_ _[observed]_
- `Not sure yet` → **Marketing only**: Served data links this option to the same on-page block as "Yes" (same target entry id 7iFPgDm1VFwqfOML5ug6Pv). Not clicked live. _(affects: Rx Hair Loss Spray (Topical Finasteride & Minoxidil Spray), Rx Hair Loss Spray + Ketoconazole + Biotin (4-in-1 spray))_ _[code]_

### Men's hair-loss consultation (hims.com/c/hl)

Entry: https://www.hims.com/c/hl

NOT WALKED: the page stays on a loading spinner because Cloudflare refuses the site's own script files. The question list below is a skeleton of topics from Hims' own articles and from field names in the page, not the real screens. Order and account-wall position unknown.

**1. [Exact wording not seen: the consultation would not load] Hair goals step (the "Get started" buttons open /c/hl/goals).**  
_single · anonymous · role: personalisation · shown: Entry at /c/hl/goals. Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · docs_  
Why they ask: First step when entering by the main "Get started" button. Hims says its form asks about "your hair goals".


**2. [Exact wording not seen: the consultation would not load] Hair-loss status or pattern (a third-party review mentions "receding hairline, thinning hair").**  
_single · anonymous · role: diagnosis · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · docs_  
Why they ask: Likely feeds diagnosis and the product suggestion.


**3. [Exact wording not seen: the consultation would not load] Other hair-loss products already tried.**  
_multi · anonymous · role: product-selector · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · docs_  
Why they ask: Treatment history.


**4. [Exact wording not seen: the consultation would not load] Family history of hair loss.**  
_single · anonymous · role: diagnosis · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · docs_  
Why they ask: Hims: "Hims asks questions about your hair, of course, but also about family history, lifestyle, mental health (like stress levels), and your styling routine."


**5. [Exact wording not seen: the consultation would not load] Lifestyle.**  
_single · anonymous · role: personalisation · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · docs_  
Why they ask: Named by Hims as a topic of its form. Each question can carry a "Why We Ask" note.


**6. [Exact wording not seen: the consultation would not load] Mental health, for example stress levels.**  
_single · anonymous · role: safety-screen · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · docs_  
Why they ask: Named by Hims as a topic of its form. Finasteride safety pages warn about depression, so this may also be a safety screen.


**7. [Exact wording not seen: the consultation would not load] Styling routine, styling habits and "how you prefer to wear your hair".**  
_single · anonymous · role: personalisation · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · docs_  
Why they ask: Named by Hims as a topic of its form; probably steers format (spray, serum, pill, chew).


**8. [Exact wording not seen: the consultation would not load] Prescription preference (the site stores a value called "prescriptionPreference" for the consultation).**  
_single · after-account · role: product-selector · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · code_  
Why they ask: Unknown. The stored field name suggests the visitor is asked whether they want prescription treatment; the feature flag "hairLossPrescriptionPreference" is switched on for everyone.


**9. [Exact wording not seen: the consultation would not load] Account registration (email and password, or Google sign-in).**  
_contact · after-account · role: identity · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · code_  
Why they ask: The account wall. The /c/hl page loads Google sign-in and Auth0 settings, and the consultation state has a "registration" field. Where it sits in the flow was not seen.


**10. [Exact wording not seen: the consultation would not load] State you live in (shipping state and ZIP code).**  
_text · after-account · role: eligibility-gate · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · BRANCHES · docs_  
Why they ask: Decides whether the visit can be by messages only or needs a video visit, and which products can ship. The state has an "invalidInitialShippingState" flag, so some states can be refused or re-asked.  
Downstream: Help centre: "Depending on the state where you live, your consultation may be conducted asynchronously... In some states, a video visit with a healthcare provider is required." Not available in Puerto Rico (help centre).


**11. [Exact wording not seen: the consultation would not load] Date of birth.**  
_date · after-account · role: eligibility-gate · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · BRANCHES · docs_  
Why they ask: Age gate: the safety pages say the treatments are not for anyone under 18.  
Downstream: Under 18: not eligible (published safety information). The exact screen was not seen.


**12. [Exact wording not seen: the consultation would not load] Medical intake form: medical conditions, medicines and supplements, allergies (a third-party review also mentions questions on erectile dysfunction).**  
_multi · after-account · role: safety-screen · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · BRANCHES · code_  
Why they ask: The clinical screen read by the provider. The published "who should not take" lists (see rules) show which answers matter: heart, liver, kidney and prostate problems, breast or prostate cancer, blood thinners, antifungals, current finasteride, dutasteride or minoxidil use, allergies.  
Downstream: The page state has "questions", "rootQuestions" and "triggers", which shows the form has follow-up questions triggered by answers. None of it is sent to the page before the consultation starts.


**13. [Exact wording not seen: the consultation would not load] Photos of your hair or hairline.**  
_photo · after-account · role: diagnosis · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · docs_  
Why they ask: For the provider. Hims: "In most cases, Hims will also have you submit photos of your hair." Experiments named himsHairSkipPhotos, hairLossDiagnosticPhotosReorder and hairLossSelfiePhotoReorder exist.


**14. [Exact wording not seen: the consultation would not load] Photo ID, if more verification is needed.**  
_photo · after-account · role: identity · shown: Only when further verification is needed. Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · docs_  
Why they ask: Hims: "If further verification is required, they may ask for additional documentation, like your photo ID."


**15. [Exact wording not seen: the consultation would not load] Treatment choice: product, strength, quantity, days of supply (plan length) and packaging, with a recommended product pre-selected.**  
_single · checkout · role: product-selector · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · BRANCHES · code_  
Why they ask: The product and plan picker. The stored fields show the site marks a "recommendedBrand" and a recommended dosage that the visitor may override.  
Downstream: Fields in the page state: brandId, strength, quantity, daysSupply, packagingSelection, recommendedBrand, overrideRecommendedDosage, originalRecommendedTreatment, showRecommendationModal. Two flags, maCompoundDeprecation and waCompoundDeprecation, point to different handling of compounded products in Massachusetts and Washington.


**16. [Exact wording not seen: the consultation would not load] Optional non-prescription add-ons (for example shampoo or gummies).**  
_multi · checkout · role: marketing · shown: Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked. · no branch · code_  
Why they ask: Cross-sell before payment. Experiment names himsHairOTCAddOnV1, himsHairHideOtcStep, hairLossOtcCrossSellBlock and himsHairFreeShampoo exist; the state has "additionalItems" and "otcChargedAmount".


### Hers US hair-loss consultation (forhers.com)

Entry: https://www.forhers.com/hair-loss

NOT WALKED: forhers.com shows Cloudflare's "Performing security verification" page to this browser, on every page. Nothing could be read.

## 7. Competitive read

**Strengths**

- Very wide format range for the same two actives: pill, two chews, two sprays, serum, plain finasteride tablets, kits, foam and solution.
- Low headline price ("less than $1 a day", from $29 a month) tied to a 10-month plan paid upfront.
- Over-the-counter products can be bought without any consultation.
- Published safety information for each prescription product, with clear exclusion lists.

**Weaknesses**

- Headline prices differ between pages on the same day ($35 on the main landing page, $29 on product pages for the same products).
- Plan-length prices are not published; the low price needs a 10-month upfront payment.
- Most prescription products are compounded and not FDA-approved; strengths of the vitamin blends in the chews are not published.
- The Hair Power Pack showed "Out of stock".

**Gaps a new competitor could use**

- Publish a clear price table for every plan length before the quiz.
- Show the questions and the reasons behind a recommendation openly; Hims shows neither before sign-up as far as public pages reveal.

## 8. Experiments run (6)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| s2-baseline-men | men | Nothing (baseline replay of https://www.hims.com/c/hl/goals, 23 Nov 2026 22:17 UTC) | Still blocked. The page stays blank: no question, no control, no link. Same end state as stage 1 (Cloudflare refuses the site's own script files). No offer, no stop screen and no account wall could be seen. |
| s2-baseline-lp-prequiz | lp-prequiz | Nothing (baseline replay: Q1 Both, Q2 Yes, Q3 Yes) | End state: same page (/lp/hair-start-top-fin-fa), scrolled to the block 'Prescription-strength ingredients for real results' (spray pitch) with the buttons 'Get the spray' and 'See if treatment is right for me', both linking to /c/hl. No product is selected, no price or plan is shown, no stop screen, no account wall. Each click sends one tracking event (the question and the answer, with a device id) to Hims' own event collector (api.forhims.com/dpe/producer/unauth) and to Amplitude. |
| exp-lp-01-q1-stop | lp-prequiz | lp-q1: Both → Stop hair loss | No change against baseline: identical visible text (same checksum), identical scroll positions after each click (823, 1628, 2433 px), identical buttons and links at the end (all to /c/hl or /c/hl/goals). Only the tracking event name changed (…hair-goals_stop-hair-loss…). |
| exp-lp-02-q1-regrow | lp-prequiz | lp-q1: Both → Regrow hair | No change against baseline: identical text, scroll positions and end links. Only the tracking event name changed (…hair-goals_regrow-hair…). |
| exp-lp-03-q2-no | lp-prequiz | lp-q2: Yes → No | No change against baseline: answering 'No' to 'Are you looking for a simple solution to regrow your hair?' still moves on to question 3 and ends on the same spray pitch with the same links. Only the tracking event name changed (…_no_…). |
| exp-lp-04-q3-notsure | lp-prequiz | lp-q3: Yes → Not sure yet | No change against baseline: 'Not sure yet' about prescription treatment still lands on the same prescription spray pitch ('Get the spray', 'See if treatment is right for me' → /c/hl). No non-prescription alternative is shown. Only the tracking event name changed (…_not-sure-yet_…). |

## 10. Limits of this report

- The men's consultation was not seen at all. No real question wording, option, branch, stop screen, recommendation or plan price from it is in this file.
- The Hers (women) site was not seen at all. The four Hers products come from search-result snippets and are incomplete.
- Plan-length prices are known only for the 10-month plan (from footnotes) and from two Hims blog posts and one press review.
- The "who should not use" rules are from patient information pages. They show what the provider must rule out, not what the software does with an answer.
- Prices shown differ between pages; Hims runs many price tests (hundreds of experiment names are embedded in its pages).

## 11. Sources

- [Hims hair-loss landing page](https://www.hims.com/hair-loss)
- [Landing page with on-page pre-quiz](https://www.hims.com/lp/hair-start-top-fin-fa)
- [Comparison landing page](https://www.hims.com/lp/hair-start-comparison-dlp)
- [Sitemap](https://www.hims.com/sitemap.xml)
- [Important safety information: Rx Hair Loss Spray](https://www.hims.com/important-safety/rx-hair-loss-spray)
- [Important safety information: Finasteride & Minoxidil + Supplement Blend Pill](https://www.hims.com/important-safety/finasteride-minoxidil-supplement-blend-pill)
- [Important safety information: Finasteride](https://www.hims.com/important-safety/finasteride)
- [Important safety information: Hair Hybrids chewables](https://www.hims.com/important-safety/hair-hybrids-chewables)
- [Important safety information: spray + ketoconazole + biotin](https://www.hims.com/important-safety/rxspray-ketoconazole-biotin)
- [Important safety information: serum](https://www.hims.com/important-safety/rx-hair-loss-serum)
- [Help centre: How does this work?](https://support.hims.com/hc/en-us/articles/360032844051-How-does-this-work)
- [Help centre: Where is Hims & Hers available?](https://support.hims.com/hc/en-us/articles/9586237484571-Where-is-Hims-Hers-available)
- [Help centre: Do I need a prescription?](https://support.hims.com/hc/en-us/articles/115002248531-Do-I-need-a-prescription)
- [Help centre: Compounded Oral Combination Tablet (Hair Loss)](https://support.hims.com/hc/en-us/articles/38844636581659-Compounded-Oral-Combination-Tablet-Hair-Loss)
- [Help centre: Compounded Topical Combination](https://support.hims.com/hc/en-us/articles/38844763548059-Compounded-Topical-Combination)
- [Help centre: Minoxidil + Supplements](https://support.hims.com/hc/en-us/articles/38838928667419-Minoxidil-Supplements)
- [Help centre: Finasteride](https://support.hims.com/hc/en-us/articles/38942474198171-Finasteride)
- [Help centre: Minoxidil (tablets)](https://support.hims.com/hc/en-us/articles/38944589097883-Minoxidil)
- [Help centre: Compounded Oral Combination Tablet (ED and Hair Loss)](https://support.hims.com/hc/en-us/articles/38844902419995-Compounded-Oral-Combination-Tablet-ED-and-Hair-Loss)
- [Hims blog: Hims vs. Keeps (describes the intake form and prices)](https://www.hims.com/blog/hims-vs-keeps)
- [Hims blog: Hims vs. Happy Head (describes the intake form and prices)](https://www.hims.com/blog/hims-vs-happy-head)
- [Hair check-in page (month-3 follow-up questions)](https://www.hims.com/hair-loss/check-in)
- [Fortune: Hims hair loss review (published 22 Dec 2025, updated 15 Jul 2026)](https://fortune.com/article/hims-hair-loss-review/)
- [Healthline: Hims hair review (seen through a search summary only)](https://www.healthline.com/health/hims-hair-review)
- [Hers oral minoxidil page (not opened: security check; search snippet only)](https://www.forhers.com/hair-loss/oral-minoxidil)
