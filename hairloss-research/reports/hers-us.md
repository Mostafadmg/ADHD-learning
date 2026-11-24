# Hers (US): consultation and product report

**Market:** US · **Website:** https://www.forhers.com/hair-loss · **Checked:** 2026-11-23 · **Owner:** Hims & Hers Health, Inc. (the men's sister brand is Hims, www.hims.com)

> US telehealth brand for women: a free online hair quiz and intake, review by a licensed provider (no visit), then compounded and off-label prescription hair treatments on subscription, plus over-the-counter minoxidil, supplements and hair care sold directly.

## 1. How far this could be tested

- **Tested by:** public-docs
- **Account wall:** Not observed (site blocked). Reported by one reviewer in Dec 2023 (Innerbody, re-read at stage 3): 'You'll have to make a Hers account to see your results', that is, after the quiz and before any recommendation. Later descriptions (a Hims & Hers partner article, May 2025; AOL / New York Post, Jun 2026) say the quiz 'leads to an intake form' and do not say where the account step sits. A Nov 2026 review adds that a government-issued ID and a payment card are needed to complete a consultation (Healthline, about the platform in general). No step behind this wall was tested.
- **Blocker:** www.forhers.com answered the research browser with a Cloudflare security checkpoint (HTTP 403, 'Performing security verification'); still there after a 10 second wait. Not defeated, per protocol. Proof: runs/probe-home.
- **Blocker:** Plain requests for forhers.com pages (sitemap.xml, sitemap.html, product pages) also get the checkpoint; only robots.txt is served.
- **Blocker:** The sister site www.hims.com serves its pages, but every quiz code bundle on /c/hl is refused (HTTP 403), so the shared quiz code could not be read there either. Proof: runs/probe-hims-quiz, runs/grab-hims-c-hl/requests.jsonl.
- **Blocker:** Public archives could not be used from this machine: web.archive.org connections were closed or rate-limited; the Common Crawl index reset every query.
- **Blocker:** support.forhers.com is not reachable from this machine, so the Hers-branded help centre address was not read; the shared Hims & Hers help centre at support.hims.com was read instead (stages 2 and 3).
- **Blocker:** Stage 2 re-test (2026-11-23): www.forhers.com still shows the Cloudflare checkpoint after a 10 second wait. Not defeated. Proof: runs/s2-retest-home. So no one-change experiment could be run.
- **Blocker:** The shared Hims & Hers help centre (support.hims.com) opens in the research browser and was read (runs/s2-help-centre); plain curl requests to it get 403.
- **Blocker:** Stage 3 re-test (2026-11-23): www.forhers.com still shows the Cloudflare checkpoint (HTTP 403) after a 10 second wait. Not defeated. Proof: runs/verify-baseline.
- **Blocker:** The sister site does not serve Hers hair pages: /hair-loss/spironolactone, /treatment/hair-loss/spironolactone and /hair-loss/oral-minoxidil on www.hims.com all return 'page doesn't exist' (404). Proof: runs/verify-hims-hers-pages.
- **Blocker:** Stage 3 could run only three web searches before the shared search budget for the session was used up, so the Hers page statements that earlier stages read through a search index could not all be re-read.

No live walk of the Hers consultation was possible at any of the three stages: the site stays behind a security checkpoint, which was not defeated. No answer was changed and replayed, so nothing in this file is 'observed'. What the file holds is (1) Hers's stated safety and eligibility policy, from patient leaflets in the shared Hims & Hers help centre (opened directly and re-read word for word at stage 3) and from Hers pages read only through a search index; (2) descriptions of the quiz by reviewers and one partner article (2023 to Nov 2026), now labelled 'inferred' because they are not Hers's own statements; (3) one code hint: names of old Hers hair experiments in the page state served by the sister site. These say who Hers says can have each product. Whether the quiz enforces a rule itself (stop screen, product hidden) or leaves it to the provider is not known. Question wording is not verbatim. Hers is women only; men are served by the sister brand Hims.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen), **owner-run** (seen in the owner's own browser research, not replayed by us).

## 2. How the engine decides (short version)

Untested: the site was blocked at all three stages, so this is how the engine should work according to Hers's own public statements and reviewers, not how it was seen to work. Hers treats one diagnosis, female pattern hair loss, with one main drug, minoxidil, sold in several formats. (1) A short visual quiz collects goals, symptoms, hair density and routine; nothing public shows these changing the product. (2) Health questions, either inside the quiz (2023 report) or in an intake form after it (2025 and 2026 reports), feed three documented gates. Menopause: finasteride (the Postmeno Serum) is only for women past menopause. Pregnancy, planning a pregnancy or breastfeeding: oral minoxidil in any form and finasteride are ruled out. Health: pheochromocytoma rules out oral minoxidil and a heart history must go to the provider (confirmed word for word in the help centre); kidney, liver and blood pressure problems, age under 18 and already using minoxidil are further exclusions read only through a search index. (3) A preference question reported in 2023 (vitamins with your treatment?) probably picks between plain oral minoxidil at $29 a month and the vitamin blends at $35 to $39. (4) One or two prescription products are shown, reportedly after an account is made, and can be swapped; a licensed provider then approves, changes or declines and sets the dose, by message in most states and by video in some. Over-the-counter minoxidil, supplements and hair care sit outside the quiz. Spironolactone may no longer be part of the hair range.

## 3. Engine rules (19)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | women | women-q11 = pre-menopausal (any woman who has not gone through menopause) | Finasteride products are not offered. The offer stays with minoxidil-based products, with spironolactone as a possible alternative. _(affects: Hair Blends Postmenopause Serum (Postmeno Serum), Postmenopausal Hair Loss Spray (finasteride + minoxidil))_ | Removes a product | docs | high |
| R2 | women | women-q11 = post-menopausal | The finasteride plus minoxidil topical (Hair Blends Postmenopause Serum; earlier a spray) is added to what can be offered, 'for those who qualify'. _(affects: Hair Blends Postmenopause Serum (Postmeno Serum), Postmenopausal Hair Loss Spray (finasteride + minoxidil))_ | Adds a product | docs | high |
| R3 | women | women-q9 = pregnant (or planning a pregnancy) | Oral minoxidil in any form (plain tablets and the minoxidil plus vitamin blends) and the finasteride products are ruled out. Spironolactone would be too (Hers blog via search index, not re-confirmed; the product may no longer be offered). Whether the quiz shows a stop screen or leaves the refusal to the provider is not known. _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil, Spironolactone (may no longer be offered for hair loss), Hair Blends Postmenopause Serum (Postmeno Serum), Postmenopausal Hair Loss Spray (finasteride + minoxidil))_ | Removes a product | docs | high |
| R4 | women | women-q9 = breastfeeding | Oral minoxidil products and finasteride are ruled out. Hers says some topical solutions are possible while breastfeeding, so a topical is the likely remaining offer (which one is not stated). _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil, Hair Blends Postmenopause Serum (Postmeno Serum), Postmenopausal Hair Loss Spray (finasteride + minoxidil))_ | Removes a product | docs | medium |
| R5 | women | age under 18 | Not eligible for oral minoxidil products through Hers; a search summary of Hers's treatment terms page says such patients are pointed to in-person care. Where the quiz asks age, and whether it stops the whole consultation, is not known. _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil)_ | Removes a product | docs | medium |
| R6 | women | women-q12 includes pheochromocytoma (an adrenal tumour), or an allergy to minoxidil | Oral minoxidil in any form is contraindicated. _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil)_ | Removes a product | docs | medium |
| R7 | women | women-q12 includes heart disease or a past heart attack, kidney disease, liver disease or a blood pressure problem (or the patient takes blood pressure medicine) | Oral minoxidil 'may not be appropriate': the case goes to the provider, who may refuse the tablets. A topical is the likely alternative (inferred). _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil)_ | Flags for the clinician | docs | medium |
| R8 | women | women-q13 (medicines) includes eplerenone, cholestyramine, aspirin, potassium supplements, an ACE inhibitor, an angiotensin receptor blocker, heparin, lithium or digoxin | If spironolactone is still offered for hair (uncertain, see p8): not a candidate for it through Hers; told to see a healthcare provider in person. Other products are not affected by this rule. _(affects: Spironolactone (may no longer be offered for hair loss))_ | Removes a product | docs | low |
| R9 | women | women-q12 includes high potassium, Addison's disease, or a past allergic reaction to spironolactone | Spironolactone must not be used (this matters only if Hers still offers spironolactone for hair: uncertain, see p8). _(affects: Spironolactone (may no longer be offered for hair loss))_ | Removes a product | docs | medium |
| R10 | women | women-q13 includes another medicine or supplement that contains zinc | The Hair Vitamins + Minoxidil tablet (which may contain zinc sulfate) should not be taken. What replaces it is not documented; plain oral minoxidil would be the natural substitute (inferred). _(affects: Hair Vitamins + Minoxidil)_ | Removes a product | docs | low |
| R11 | women | women-q2 or women-q4 points to a hair disorder other than female pattern hair loss (sudden shedding = telogen effluvium; patches = alopecia areata) | Oral minoxidil is reportedly not offered (sentence not confirmed on the public page). Whether the quiz asks anything that would detect these conditions, or shows a stop screen, is not known. _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil)_ | Removes a product | docs | low |
| R12 | women | women-q7 = yes, wants vitamins with treatment | The suggestion probably moves from plain Oral Minoxidil ($29 a month) to a minoxidil plus vitamin product ($35 a month): Hair Vitamins + Minoxidil, or the biotin chew or gummy. _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil)_ | Switches product | inferred | low |
| R13 | women | the patient is offered or chooses an oral minoxidil product | Topical minoxidil is not given with it: Hers says using both at once is not recommended. So the engine offers a tablet route or a topical route, not both. _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil, Hair Blends Serum (also called Hair Blends Solution), Minoxidil 5% Foam, Minoxidil 2% Solution (drops))_ | Switches product | docs | medium |
| R14 | women | any prescription product is chosen | A licensed provider reviews the answers and can approve, change or decline; completing the assessment does not guarantee a prescription. The provider sets the oral minoxidil dose: 1.25 mg to start, 2.5 mg possible later. _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil, Hair Blends Serum (also called Hair Blends Solution), Spironolactone (may no longer be offered for hair loss), Hair Blends Postmenopause Serum (Postmeno Serum), Postmenopausal Hair Loss Spray (finasteride + minoxidil))_ | Flags for the clinician | docs | high |
| R15 | women | the patient lives in a state that requires a live visit | After the intake form is sent she is asked to book a video visit with a provider; elsewhere the review is by secure message only. | Adds questions | docs | medium |
| R16 | women | the patient wants a product without a prescription (5% foam, 2% drops, biotin gummies, shampoo and conditioner) | No quiz and no provider: these are bought directly from their product pages. The quiz itself is reported to recommend prescription products only. _(affects: Minoxidil 5% Foam, Minoxidil 2% Solution (drops), Biotin Gummies (Biotin Builder), Triple Threat Shampoo and Conditioner, Full Volume (Volumizing) Shampoo and Conditioner, Rapid Repair Hair Mask, Detox Scalp Scrub)_ | Skips questions | docs | medium |
| R17 | women | a prescription treatment is selected (after the account step) | The patient must show a government-issued ID and give a payment card; for some prescription-strength treatments she must also upload clear photos of her hair. | Adds questions | inferred | medium |
| R18 | women | the visitor is a man | Hers does not serve him: its hair range and safety text are written for women only. Men's hair-loss treatment is on the sister site Hims (www.hims.com/hair-loss). | Stops the patient | inferred | low |
| R19 | women | the patient's delivery address is in Puerto Rico, or in a state where a given treatment is not offered | Hims & Hers is available in all 50 states but not in Puerto Rico, and 'specific treatments may be limited to certain states'. Which hair treatments are limited, and in which states, is not stated. | Removes a product | docs | medium |

## 4. Products (15)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Oral Minoxidil](https://www.forhers.com/hair-loss/oral-minoxidil) | rx-oral | minoxidil 1.25 mg to start, option to increase to 2.5 mg | tablet, once a day | women | US Rx. Licensed tablet used off-label (oral minoxidil is FDA-approved for high blood pressure, not for hair loss). | From $29 a month (plan length for that price not stated) (Hers's own comparison blog posts (Hers vs Musely, Hers vs Nutrafol, 2026) and its hair-loss page give $29 a month. The product page says the actual price depends on product and plan. An older Hers figure of $32 a month …) | Not observed. From Hers's documents: for an adult woman with female pattern hair loss who is not pregnant, not breastfeeding and not planning a pregnancy, and has no pheochromocytoma (help centre leaflet, re-read word for word at stage 3); a history of heart problems must be told to the provider (same leaflet). Hers product pages, read only through a search index, add that it may not suit people with kidney or liver disease or blood pressure problems. A search summary of Hers's treatment terms page (/treatment/hair-loss/oral-minoxidil) says people under 18, people with pheochromocytoma and people already using minoxidil products are not eligible through the platform and are pointed to in-person care. A sentence saying oral minoxidil is not offered for telogen effluvium or alopecia areata was found by the search engine only on a copy of the page on another Hers host (internal.forhers.com), so it is not confirmed for the public page. Whether the quiz steers a patient to plain tablets or to a vitamin blend is unknown. The provider sets the dose: 1.25 mg to start, 2.5 mg possible (reviews). | docs |
| [Biotin + Minoxidil Chew](https://www.forhers.com/hair-loss/minoxidil-biotin-chew) | rx-oral-compounded | minoxidil 1.25 mg or 2.5 mg according to one review (Innerbody, Dec 2023); not published on the Hers pages found; biotin unknown | lemon (citrus) flavoured chew, once a day | women | US compounded Rx (not FDA-approved as a combination; Hers states this). | From $35 a month (top10.com, Aug 2025); from $39 a month in two other reviews (Dec 2023, Aug 2026) (Sources disagree and the current figure is not settled: top10.com (6 Aug 2025) says 'Starting at $35/month'; Innerbody (Dec 2023) and finvsfin (8 Aug 2026) say the blends start at $39 a month. Hers's own pages, read thr…) | Not observed. Same safety rules as plain oral minoxidil (p1). Probably offered when the patient says she wants vitamins with her treatment and prefers a chew (inferred from a 2023 review that names a 'vitamins with your treatment' question). | docs |
| [Biotin + Minoxidil Gummy](https://www.forhers.com/hair-loss/oral-minoxidil) | rx-oral-compounded | minoxidil unknown; biotin unknown | green apple flavoured gummy, once a day | women | US compounded Rx. | From $35 a month (Listed on Hers's oral minoxidil page with a starting price of $35 a month (read through a web search index on 2026-11-23, not opened directly (site blocked)). NCOA (Oct 2026) describes the gummy and the chew as similar …) | Not observed. Same safety rules as plain oral minoxidil (p1). Probably an alternative format to the chew for patients who want vitamins (inferred). | docs |
| [Hair Vitamins + Minoxidil](https://www.forhers.com/hair-loss/minoxidil-hair-vitamin) | rx-oral-compounded | minoxidil low dose; 1.25 mg or 2.5 mg according to one review (Innerbody, Dec 2023); not published on the Hers pages found; biotin 2.5 mg (NCOA, Oct 2026); vitamin C unknown; zinc unknown; vitamin B6 unknown; pantothenic acid (vitamin B5) unknown | pill, once a day | women | US compounded Rx. | From $35 a month (top10.com, Aug 2025); from $39 a month in two other reviews (Dec 2023, Aug 2026) (top10.com (6 Aug 2025): 'Starting at $35/month'. Innerbody (Dec 2023) and finvsfin (8 Aug 2026): from $39 a month. Not settled. Ingredients confirmed at stage 3: NCOA (Oct 2026) lists low-dose minoxidil, 2.5 mg biotin, …) | Not observed. Same safety rules as plain oral minoxidil (p1). Probably offered when the patient wants vitamins with her treatment (inferred). The patient information adds: do not take it with other medicines or supplements that contain zinc. | docs |
| [Hair Blends Serum (also called Hair Blends Solution)](https://www.forhers.com/hair-loss/blends-solutions) | rx-topical-compounded | minoxidil 7%; biotin unknown; ketoconazole unknown; pantothenic acid (vitamin B5) unknown | topical serum applied with a dropper | women | US compounded Rx (Hers: Hair Blends are compounded and not FDA-approved). | From $35 a month (top10.com (6 Aug 2025): 'Starting at $35/month'; finvsfin (8 Aug 2026): blends start at $39 a month. Hers's own pages, read through a search index at stage 1, said $35. Plan lengths not found.) | Not observed. The topical prescription route for women who are not past menopause: likely offered to women who prefer not to take a tablet, or for whom oral minoxidil is unsuitable (inferred). Hers says topical and oral minoxidil should not be used together, so it is an alternative to p1 to p4, not an add-on. | docs |
| [Hair Blends Postmenopause Serum (Postmeno Serum)](https://www.forhers.com/hair-loss/blends-postmeno-serum) | rx-topical-compounded | minoxidil reported as 6% on one Hers page read through a search index; not confirmed at stage 3 (NCOA, Oct 2026, gives no strength for the serum); finasteride reported as 0.3% (same single source; not confirmed at stage 3). 0.3% and 6% are confirmed only for the older spray (p7); essential oils (rosemary, juniper, lavender) not an active medicine | topical serum applied with a dropper | women | US compounded Rx. Prescription only, for postmenopausal women. | From $35 a month (top10.com (6 Aug 2025): 'Starting at $35/month' (re-read at stage 3). Hers product page via search index: 'listed at $35/mo'.) | Postmenopausal women only (Hers: finasteride is only recommended for women who have gone through menopause; the patient information says finasteride is contraindicated in women who could become pregnant). Never for women who are pregnant, planning a pregnancy or breastfeeding. How the quiz establishes menopause (a reported 'pre- or post-menopausal' question, possibly with the hysterectomy question) was not tested. | docs |
| [Postmenopausal Hair Loss Spray (finasteride + minoxidil)](https://www.forhers.com/hair-loss) | rx-topical-compounded | finasteride 0.3%; minoxidil 6% | topical spray, once a day (2 fl oz bottle) | women | US compounded Rx, postmenopausal women only. (NCOA's page calls it FDA-approved; that is wrong for a compounded product, see Hers's own statement on compounded drugs.) | $39 a month in a 2023 review (Innerbody); 'starting at $50/month' on a 3-month billing cycle (NCOA, 3 Nov 2026) (Stage 3 correction: finvsfin (Aug 2026) lists the spray and its strengths (0.3% finasteride, 6% minoxidil) but gives no price for it, so the $39 figure rests on Innerbody (Dec 2023) alone. NCOA says the product cannot b…) | Same rule as the Postmeno Serum (p6): postmenopausal women only, never in pregnancy, when planning one or when breastfeeding. It is unclear whether the spray is still sold alongside the serum. | inferred |
| [Spironolactone (may no longer be offered for hair loss)](https://www.forhers.com/hair-loss/spironolactone) | rx-oral | spironolactone not published on the pages found; the help centre says common doses are 50 mg up to 200 mg a day, taken once or twice daily (one third-party review says 100 mg) | tablet, once or twice a day as prescribed | women | US Rx. Licensed tablet used off-label (not FDA-approved for hair loss). | Unknown (A Hers product address and a Hers treatment terms page for spironolactone are in the search index, but neither could be read. Stage 1 noted 'about $30 a month' from two review sites it did not name; stage 3 found that f…) | Unknown, and it may no longer be offered for hair loss. None of the range descriptions re-read at stage 3 lists spironolactone (Innerbody Dec 2023, a Hims & Hers partner article May 2025, top10.com Aug 2025, NCOA Oct 2026), and finvsfin (Aug 2026) says a rival offers spironolactone 'that Hers does not'. Against that: the product address and a treatment terms page are in the search index, and the shared help centre still carries a spironolactone leaflet (updated Jul 2025) that says it is used off-label for hair loss and acne. If it is offered: for women before menopause with hormonal hair loss; not in pregnancy or when trying to conceive (Hers blog, via search index, not re-read); not with high potassium, Addison's disease or a spironolactone allergy (help centre, confirmed word for word at stage 3). | inferred |
| [Minoxidil 5% Foam](https://www.forhers.com/hair-loss/minoxidil-women) | otc-medicine | minoxidil 5% | topical foam, once a day | women | US OTC (FDA-approved over-the-counter hair regrowth treatment for women). No consultation needed. | $54 one-time; subscription from $12.67 a month (One-time $54 on the Hers product page (via search index); Innerbody (Dec 2023) says that is a 4-month supply and gives subscriptions of $30 every 2 months, $54 every 4 months, $76 every 6 months ($12.67 a bottle). Hers'…) | Bought directly, no consultation. The quiz is reported to recommend prescription products only (2023 review). The fallback for anyone who is not eligible for, or does not want, a prescription (inferred). | docs |
| [Minoxidil 2% Solution (drops)](https://www.forhers.com/hair-loss/minoxidil-otp) | otc-medicine | minoxidil 2% | topical solution with dropper, 1 mL twice a day | women | US OTC (FDA-approved over-the-counter). No consultation needed. | $45 one-time (Innerbody Dec 2023, a 3-month supply; finvsfin and Fortune, Aug 2026); subscription from $12.67 a month on a 6-month plan (Stage 3 correction: three reviews give $45; the $30 one-time figure from a search-index read of a Hers page at stage 1 was not confirmed. Subscription tiers (Innerbody 2023): $30 every 2 months, $54 every 4 months, $76 …) | Bought directly, no consultation. Same position as the 5% foam (p9). | docs |
| [Biotin Gummies (Biotin Builder)](https://www.forhers.com/hair-care) | supplement | biotin 300 mcg (Innerbody 2023; NCOA Oct 2026); vitamin B12, folic acid and other vitamins unknown | cherry flavoured gummy | women | US dietary supplement. No prescription. | From $13.50 a month ('Starts at $13.50/mo' on the Hers hair-loss page (via search index, older snapshot). $16 a bottle on subscription (finvsfin Aug 2026). 2023 detail: $32 one-time for 2 bottles; $57 every 4 months; $81 every 6 months.) | Bought directly, no consultation. Not part of the quiz result as far as reviewers describe it. The help centre says non-prescription products can be sold in a kit with a prescription product after a consultation. | docs |
| [Triple Threat Shampoo and Conditioner](https://www.forhers.com/hair-care) | cosmetic | biotin, saw palmetto, pumpkin seed oil (cosmetic ingredients) not stated | shampoo and conditioner | women | US cosmetic. No prescription. | $38 for a 2-pack of shampoo and $47 for a 2-pack of conditioner (Healthline, 19 Nov 2026; same in Innerbody, Dec 2023) (Stage 3 correction: the earlier entry ('$38 every two months for the pair') came from finvsfin (Aug 2026) and conflicts with two sources in which $38 buys the shampoo 2-pack alone. 2023 bundle subscription (Innerbody): …) | Bought directly, no consultation. Not part of the quiz result as far as reviewers describe it. The help centre says non-prescription products can be sold in a kit with a prescription product after a consultation. | docs |
| [Full Volume (Volumizing) Shampoo and Conditioner](https://www.forhers.com/hair-care) | cosmetic | biotin, brown rice, Biovolume 128 (cosmetic ingredients) not stated | shampoo and conditioner | women | US cosmetic. No prescription. | $32 one-time or $30 a month for the set (NCOA (Oct 2026); Hers's hair-loss page lists Full Volume at $32 (via search index).) | Bought directly, no consultation. Not part of the quiz result as far as reviewers describe it. The help centre says non-prescription products can be sold in a kit with a prescription product after a consultation. | docs |
| [Rapid Repair Hair Mask](https://www.forhers.com/hair-care/hair-mask) | cosmetic | keratin, coconut (cosmetic ingredients) not stated | hair mask | women | US cosmetic. No prescription. | Unknown today; $44 one-time for a 2-pack in a 2023 review (The page URL is in the search index; the price is from Innerbody (Dec 2023) and may be out of date.) | Bought directly, no consultation. Not part of the quiz result as far as reviewers describe it. The help centre says non-prescription products can be sold in a kit with a prescription product after a consultation. | docs |
| [Detox Scalp Scrub](https://www.forhers.com/hair-care) | cosmetic | salicylic acid (cosmetic use) not stated | scalp scrub | women | US cosmetic. No prescription. | Unknown today; $44 one-time for a 2-pack in a 2023 review (Known only from Innerbody (Dec 2023). It may no longer be sold.) | Bought directly, no consultation. Not part of the quiz result as far as reviewers describe it. The help centre says non-prescription products can be sold in a kit with a prescription product after a consultation. | inferred |

## 5. Who gets what (8 patient profiles)

- **Baseline woman: 38, widening parting, gradual over 2 years, not pregnant, not breastfeeding, not planning a pregnancy, periods regular, no conditions, no medicines** → Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil, Hair Blends Serum (also called Hair Blends Solution) (default: unknown). Not observed (site blocked). Expected from Hers's documents: one or two minoxidil-based prescription products (NCOA, Nov 2026: 'one or two products will be recommended'), most likely Oral Minoxidil or a Hair Blends product, swappable. Finasteride products are excluded because she is not past menopause. Spironolactone was removed from this list at stage 3: it may no longer be offered (see p8). Which product is shown first is not known. _[inferred]_
- **Woman past menopause with gradual thinning, no conditions, no medicines** → Hair Blends Postmenopause Serum (Postmeno Serum), Postmenopausal Hair Loss Spray (finasteride + minoxidil), Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil, Hair Blends Serum (also called Hair Blends Solution) (default: unknown). Hers says finasteride is offered to eligible women who have gone through menopause, as a finasteride plus minoxidil topical (Postmeno Serum; earlier a spray). The minoxidil-only products remain possible. Not observed. Stage 3: the spray (p7) may have been replaced by the serum (p6). _[docs]_
- **Woman who is pregnant or planning a pregnancy** → nothing offered (default: unknown). Hers's safety text rules out every tablet and finasteride. No source says what, if anything, the quiz then offers; over-the-counter products can still be bought directly but Hers does not recommend them for pregnancy in any text found. Not observed. Stage 3 label change (docs to inferred): the exclusions are documented, but 'nothing is offered' is our reading; the documents do not cover the topical serum (p5) in pregnancy. _[inferred]_
- **Woman who is breastfeeding** → Hair Blends Serum (also called Hair Blends Solution), Minoxidil 5% Foam, Minoxidil 2% Solution (drops) (default: unknown). Tablets are ruled out. Hers's FAQ is summarised by the search index as saying some topical solutions are possible while breastfeeding, without naming them, so the three topicals listed here are the candidates, not a confirmed offer. Not observed. _[inferred]_
- **Woman with heart disease, a blood pressure problem, or kidney or liver disease** → Hair Blends Serum (also called Hair Blends Solution), Minoxidil 5% Foam, Minoxidil 2% Solution (drops) (default: unknown). Oral minoxidil 'may not be appropriate'; the provider decides. A topical is the likely alternative. Spironolactone is itself a heart and blood pressure medicine with its own exclusions, so it is unlikely here. Inferred from Hers's safety text; not observed. _[inferred]_
- **Woman with sudden shedding or patchy loss (not female pattern hair loss)** → nothing offered (default: unknown). Unknown. A sentence saying Hers does not offer oral minoxidil for telogen effluvium or alopecia areata was found only on a non-public copy of the product page (not confirmed). The 2026 review that says women with sudden, patchy or severe loss should see a healthcare provider is about the over-the-counter 2% solution and is the reviewer's advice. Whether the quiz stops her or still shows a product was not observed. _[inferred]_
- **Woman who does not want a prescription** → Minoxidil 5% Foam, Minoxidil 2% Solution (drops), Biotin Gummies (Biotin Builder), Triple Threat Shampoo and Conditioner, Full Volume (Volumizing) Shampoo and Conditioner (default: unknown). Bought directly from product pages with no quiz (help centre: non-prescription products 'do not necessitate a medical consultation'; Healthline: guest checkout). Hers does not state a default; the 5% foam once a day is the usual first choice for women (our reading). _[docs]_
- **Baseline man: 32, receding hairline and thinning crown** → nothing offered (default: none). Not served. Hers is the women's brand; men are served by the sister site Hims. No Hers men's flow exists to test. _[inferred]_

## 6. The consultation, step by step

### Hers women's hair quiz and intake

Entry: https://www.forhers.com/hair-loss

Reported, never observed: free hair quiz, mostly visual (goals, symptoms and type of thinning, hair density from photos, hair-care routine; 'takes just minutes' to 10 to 15 minutes) -> health questions (pregnancy and breastfeeding, hysterectomy, pre- or post-menopausal, conditions, medicines, 'vitamins with your treatment'); a 2023 review puts these inside the quiz before the account step, 2025 and 2026 articles put medical history in an 'intake form' after the quiz -> create an account to see results (2023 report) -> one or two recommended prescription products, which can be swapped -> ID, payment card and, for some treatments, hair photos -> provider review by message (video visit in some states) -> subscription. No step could be tested at any stage: the site is behind a security checkpoint.

**1. Wording NOT captured (site blocked). Topic: your goals. A Hims & Hers partner article (Hello! Magazine, 30 May 2025) describes it as: 'what goals I have in pursuing treatment: for example reducing shedding, regrowing lost hair, improving thickness and fullness or supporting overall hair health'.**  
_multi · anonymous · role: personalisation · shown: Probably always, as the first step (inferred) · no branch · docs_  
Why they ask: Finds out what the patient wants so the result can be framed around it. Also a soft first step that gets the visitor clicking.  
Downstream: Not tested. No public source describes a goal changing the product. On the sister site the first quiz address is /c/hl/goals, so goals is probably step one on Hers too (inferred).

- `Reducing shedding (partner article's wording, May 2025; not confirmed as the site's)` → **Marketing only**: Not tested (site blocked). Probably changes only the wording of the result: every Hers prescription product for women who are not past menopause is built on minoxidil, so a goal has no different active ingredient to switch to (inferred from the range). _[inferred]_
- `Regrowing lost hair (partner article's wording, May 2025; not confirmed as the site's)` → **Marketing only**: Not tested (site blocked). Probably changes only the wording of the result: every Hers prescription product for women who are not past menopause is built on minoxidil, so a goal has no different active ingredient to switch to (inferred from the range). _[inferred]_
- `Improving thickness and fullness (partner article's wording, May 2025; not confirmed as the site's)` → **Marketing only**: Not tested (site blocked). Probably changes only the wording of the result: every Hers prescription product for women who are not past menopause is built on minoxidil, so a goal has no different active ingredient to switch to (inferred from the range). _[inferred]_
- `Supporting overall hair health (partner article's wording, May 2025; not confirmed as the site's)` → **Marketing only**: Not tested (site blocked). Probably changes only the wording of the result: every Hers prescription product for women who are not past menopause is built on minoxidil, so a goal has no different active ingredient to switch to (inferred from the range). _[inferred]_

**2. Wording NOT captured (site blocked). Topic as reported by reviewers: the type of thinning or symptoms you have (thinning, shedding, menopause-related hormonal thinning).**  
_single · anonymous · role: diagnosis · shown: Unknown (reported as part of the opening hair questions) · no branch · docs_  
Why they ask: Sorts the patient into a kind of hair loss. Hers only prescribes for female pattern hair loss, so this is where other kinds should be picked up.  
Downstream: Not tested. Hers's own page says oral minoxidil is not offered for other hair disorders (telogen effluvium, alopecia areata); whether this question enforces that, or the provider does, is unknown.

- `Reviewer's category, not the site's wording: general thinning` → **No effect**: Not tested (site blocked). This is the pattern Hers treats (female pattern hair loss), so it should lead to the standard minoxidil-based offer (inferred). _[inferred]_
- `Reviewer's category, not the site's wording: a widening parting` → **No effect**: Not tested (site blocked). As for general thinning: the classic female pattern, so the standard offer (inferred). _[inferred]_
- `Reviewer's category, not the site's wording: shedding` → **Unknown**: Not tested (site blocked). Unknown. Hers's oral minoxidil page says it does not offer oral minoxidil for telogen effluvium (shedding), but no source says how the quiz treats this answer. _[unknown]_
- `Reviewer's category, not the site's wording: hormonal thinning related to menopause` → **Unknown**: Not tested (site blocked). Unknown. A natural route to the menopause question and the postmenopausal finasteride products, but no source confirms it. _[unknown]_

**3. Wording NOT captured (site blocked). Topic as reported by reviewers: pick the photo that matches your hair density (the quiz is described as 'highly visual', 'often asking you to identify your hair density from a series of photos').**  
_single · anonymous · role: diagnosis · shown: Unknown · no branch · inferred_  
Why they ask: Grades how advanced the hair loss is, from pictures.  
Downstream: Not tested. No public source describes severity changing the product or the dose: reviews say oral minoxidil starts at 1.25 mg for everyone and the provider may raise it later. Probably used for the provider's record and the result page (inferred).


**4. Wording NOT captured (site blocked). Topic as reported by reviewers: whether the hair loss came on gradually or suddenly.**  
_single · anonymous · role: diagnosis · shown: Unknown · BRANCHES · inferred_  
Why they ask: Sudden loss points away from female pattern hair loss and towards causes that need a different work-up.  
Downstream: Not tested, and the question itself is unverified. A sentence saying Hers does not offer oral minoxidil for telogen effluvium or alopecia areata was found only on a non-public copy of the product page (see R11). The review that says women with sudden, patchy or severe loss should see a healthcare provider (Fortune, Aug 2026) is about the over-the-counter 2% solution and is the reviewer's advice, not Hers policy.

- `Gradual (paraphrase)` → **No effect**: Not tested (site blocked). The expected answer for female pattern hair loss, so no change to the standard offer (inferred). _[inferred]_
- `Sudden (paraphrase)` → **Flags for the clinician**: Not tested (site blocked). Hers says it does not offer oral minoxidil for telogen effluvium or alopecia areata, the usual causes of sudden loss, so this answer should at least be flagged to the provider and may remove the oral products. Whether the quiz shows a warning or stop screen is unknown (inferred from Hers's stated policy). _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil)_ _[inferred]_

**5. Wording NOT captured (site blocked). Topic as reported by reviewers: your hair type.**  
_single · anonymous · role: personalisation · shown: Unknown · no branch · inferred_  
Why they ask: Hair-care routine detail; probably only used to personalise the wording.  
Downstream: Not tested. No documented effect.

- `Straight (paraphrase)` → **Unknown**: Not tested (site blocked). Unknown. No public source links hair type to a product. _[unknown]_
- `Wavy (paraphrase)` → **Unknown**: Not tested (site blocked). Unknown. No public source links hair type to a product. _[unknown]_
- `Curly (paraphrase)` → **Unknown**: Not tested (site blocked). Unknown. No public source links hair type to a product. _[unknown]_
- `Coily (paraphrase)` → **Unknown**: Not tested (site blocked). Unknown. No public source links hair type to a product. _[unknown]_

**6. Wording NOT captured (site blocked). Topic as reported by reviewers: how often you wash your hair in a week.**  
_single · anonymous · role: personalisation · shown: Unknown · no branch · inferred_  
Why they ask: Hair-care routine detail. It could steer between a daily topical and a tablet, but nothing public says so.  
Downstream: Not tested. No documented effect.


**7. Wording NOT captured (site blocked). Topic as reported by reviewers: whether you want vitamins with your treatment.**  
_single · anonymous · role: product-selector · shown: Reported in 2023 among the health questions, before the account step; may have changed · BRANCHES · inferred_  
Why they ask: A preference question that would choose between plain minoxidil and the minoxidil plus vitamin blends. The blends cost more ($35 to $39 against $29 a month), so it is also an upsell.  
Downstream: Not tested. The only reported question whose sole purpose is product choice. Expected effect: p1 against p2, p3, p4.

- `Yes, wants vitamins (implied by the reviewer's description; wording not captured)` → **Switches product**: Not tested (site blocked). Probably switches the suggestion from plain Oral Minoxidil to a minoxidil plus vitamin product: Hair Vitamins + Minoxidil, or the biotin chew or gummy (inferred: these products differ from p1 only by the added vitamins). _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil)_ _[inferred]_
- `No (implied by the reviewer's description; wording not captured)` → **Switches product**: Not tested (site blocked). Probably keeps the suggestion on plain Oral Minoxidil or the topical serum (inferred). _(affects: Oral Minoxidil, Hair Blends Serum (also called Hair Blends Solution))_ _[inferred]_

**8. Account wall (reported, not seen): 'You'll have to make a Hers account to see your results' is a reviewer's sentence from Dec 2023, not the site's wording.**  
_contact · anonymous · role: identity · shown: Reported position: after the quiz, before the result. Not observed. · no branch · inferred_  
Why they ask: Captures the lead and ties the answers to a person before any result is shown.  
Downstream: The account wall. Anonymous research stops here. Everything after it in this file comes from documents, not from testing.


**9. Wording NOT captured (site blocked). Topic as reported by reviewers: pregnancy and breastfeeding status.**  
_single · after-account · role: safety-screen · shown: Uncertain. A 2023 review lists it inside the quiz before the account step; a June 2026 article says the quiz is not the medical evaluation and puts medical history in a later intake. · BRANCHES · inferred_  
Why they ask: The main safety screen for women: oral minoxidil, spironolactone and finasteride are all unsuitable in pregnancy.  
Downstream: Documented exclusions, enforcement untested. 'Planning a pregnancy' is excluded for oral minoxidil in the patient information but no reviewer reports it as a separate quiz option. Contraception and period regularity are not reported as questions at all.

- `Pregnant (implied by the reviewer's description; wording not captured)` → **Removes a product**: Hers's own safety text rules out the oral minoxidil products (pregnant or planning a pregnancy: should not take; do not breastfeed), spironolactone (not when pregnant or trying to conceive) and finasteride (contraindicated in women who could become pregnant). What the quiz shows on this answer (stop screen, topical-only offer, or nothing until the provider reads it) was not tested. Stage 3 label change (docs to inferred): the policy is documented, but that this quiz answer is what triggers it is our inference; the option wording itself is not known. _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil, Spironolactone (may no longer be offered for hair loss), Hair Blends Postmenopause Serum (Postmeno Serum), Postmenopausal Hair Loss Spray (finasteride + minoxidil))_ _[inferred]_
- `Breastfeeding (implied by the reviewer's description; wording not captured)` → **Removes a product**: Oral minoxidil products are ruled out (patient information: do not breastfeed while taking minoxidil tablets); finasteride too. Hers's FAQ says most oral treatments are not intended for women who are pregnant or breastfeeding and that some topical solutions are possible while breastfeeding. Quiz behaviour not tested. Stage 3 label change (docs to inferred): the policy is documented, but that this quiz answer is what triggers it is our inference; the option wording itself is not known. _(affects: Oral Minoxidil, Biotin + Minoxidil Chew, Biotin + Minoxidil Gummy, Hair Vitamins + Minoxidil, Hair Blends Postmenopause Serum (Postmeno Serum), Postmenopausal Hair Loss Spray (finasteride + minoxidil))_ _[inferred]_
- `Neither (implied; wording not captured)` → **No effect**: Not tested (site blocked). No restriction; the standard offer (inferred). _[inferred]_

**10. Wording NOT captured (site blocked). Topic as reported by reviewers: whether you have had a hysterectomy.**  
_single · after-account · role: safety-screen · shown: Uncertain (see women-q9) · BRANCHES · inferred_  
Why they ask: Helps decide whether pregnancy is possible, which is the reason finasteride is restricted in women.  
Downstream: Not tested. Probably feeds the finasteride decision together with menopause status (inferred).

- `Yes (implied; wording not captured)` → **Unknown**: Not tested (site blocked). Unknown. After a hysterectomy pregnancy is not possible, so this may be how the engine allows finasteride-containing products, or skips pregnancy questions (inferred from the reason finasteride is restricted; no source confirms). _(affects: Hair Blends Postmenopause Serum (Postmeno Serum), Postmenopausal Hair Loss Spray (finasteride + minoxidil))_ _[unknown]_
- `No (implied; wording not captured)` → **No effect**: Not tested (site blocked). No change expected (inferred). _[inferred]_

**11. Wording NOT captured (site blocked). Topic as reported by reviewers: whether you are pre- or post-menopausal.**  
_single · after-account · role: product-selector · shown: Uncertain (see women-q9) · BRANCHES · inferred_  
Why they ask: Decides whether finasteride products can be offered. The single clearest product gate in the women's range.  
Downstream: Documented rule (Hers pages and patient information); enforcement untested. Perimenopause is not reported as a separate answer; Hers's perimenopause page says finasteride is only recommended after menopause.

- `Pre-menopausal (reviewer's wording: 'pre- or post-menopausal')` → **Removes a product**: Finasteride products are not offered: Hers says finasteride is only recommended for postmenopausal women, and the patient information calls it contraindicated in women of childbearing potential. The offer stays with minoxidil-based products and possibly spironolactone. Quiz behaviour not tested. Stage 3 label change (docs to inferred): the policy is documented, but that this quiz answer is what triggers it is our inference; the option wording itself is not known. _(affects: Hair Blends Postmenopause Serum (Postmeno Serum), Postmenopausal Hair Loss Spray (finasteride + minoxidil))_ _[inferred]_
- `Post-menopausal (reviewer's wording: 'pre- or post-menopausal')` → **Adds a product**: The finasteride plus minoxidil topical (Postmeno Serum, earlier sold as a spray) becomes available 'for those who qualify'. Quiz behaviour not tested. Stage 3 label change (docs to inferred): the policy is documented, but that this quiz answer is what triggers it is our inference; the option wording itself is not known. _(affects: Hair Blends Postmenopause Serum (Postmeno Serum), Postmenopausal Hair Loss Spray (finasteride + minoxidil))_ _[inferred]_

**12. Wording NOT captured (site blocked). Topic as reported by reviewers: medical conditions you have (a detailed medical history 'including any cardiovascular issues').**  
_multi · after-account · role: safety-screen · shown: Uncertain (see women-q9) · BRANCHES · docs_  
Why they ask: Safety screen for the tablets. Hers's documents name the conditions that matter: for oral minoxidil, heart disease or a past heart attack, kidney disease, liver disease, blood pressure problems and pheochromocytoma; for spironolactone, high potassium and Addison's disease.  
Downstream: Option list not captured, so no options are listed here. Documented effects: pheochromocytoma is a contraindication to oral minoxidil; heart, kidney, liver and blood pressure problems 'may not be appropriate' (provider decides); high potassium or Addison's disease rules out spironolactone. See rules R6 to R9. Not reported as asked: thyroid disease, anaemia or iron, PCOS, depression, breast cancer history, scalp symptoms.


**13. Wording NOT captured (site blocked). Topic as reported by reviewers: current medications.**  
_text · after-account · role: safety-screen · shown: Uncertain (see women-q9) · BRANCHES · docs_  
Why they ask: Interaction check. Hers's spironolactone page lists medicines that make a patient 'not a candidate': eplerenone, cholestyramine, aspirin, potassium supplements, ACE inhibitors, angiotensin receptor blockers, heparin, lithium and digoxin.  
Downstream: Not tested. Documented effect: any of the listed medicines removes spironolactone and the patient is told to see a provider in person. For Hair Vitamins + Minoxidil: not with other zinc-containing supplements. Blood pressure medicines are a caution for oral minoxidil (review, 2026). See rules R8, R10.


**14. Result: one or two products are recommended; you can keep the suggested treatment or swap it for another (wording not captured).**  
_info · after-account · role: product-selector · shown: After the account is created (reported) · BRANCHES · inferred_  
Why they ask: Shows the engine's pick and lets the patient change it before a provider sees it.  
Downstream: Reported: one or two products, which the patient can keep or swap. Prescription products only. Which answers produce which pick was not tested; the documented gates are menopause (finasteride), pregnancy and breastfeeding (tablets), and the vitamins preference.


**15. Photos of your hair and a valid ID, 'for some prescription treatments' (wording not captured).**  
_photo · after-account · role: identity · shown: After the account step; for prescription treatments (reported) · no branch · inferred_  
Why they ask: Identity check and evidence for the provider.  
Downstream: Reported: photos of the hair and a valid ID 'for certain prescription-strength treatments' (June 2026); a government-issued ID and a payment card for any consultation (Healthline, Nov 2026). Which hair products need photos is not known.


**16. Provider review: a licensed provider in your state reviews your profile and decides whether a prescription is appropriate; messaging if needed (wording not captured).**  
_info · after-account · role: eligibility-gate · shown: Always for prescription products · BRANCHES · docs_  
Why they ask: The legal prescribing step. Completing the assessment does not guarantee a prescription.  
Downstream: The provider can approve, change or decline, and sets the oral minoxidil dose (1.25 mg, later 2.5 mg). Usually by secure message with no live visit; the help centre says some states require a video visit, booked after the intake form is sent. Review is reported to take about 24 hours.


**17. Plan and payment. Reported: no payment details are needed until you select a treatment; prescription products are subscription only (wording not captured).**  
_info · checkout · role: data-capture · shown: After a treatment is selected · no branch · inferred_  
Why they ask: Takes the order.  
Downstream: Plan lengths and prices on this screen were not seen. Reported: prescription products are subscription only; one reviewer gives 'from $50 a month billed every 3 months' for the postmenopausal spray; a $5 processing fee was reported in 2023.


## 7. Competitive read

**Strengths**

- Many formats of one proven drug: plain oral minoxidil, three minoxidil plus vitamin formats (pill, chew, gummy) and a topical serum, so almost any preference can be met without changing the active ingredient.
- A clear, defensible finasteride rule (after menopause only), with a dedicated postmenopausal product.
- Low entry price: $29 a month for oral minoxidil and over-the-counter minoxidil from $12.67 a month on a long plan.
- The patient can swap the suggested treatment before the provider sees it (reported), and pays nothing until a treatment is selected.
- Written patient information for every prescription product is public in the help centre, and compounded products are clearly labelled as not FDA-approved.
- Narrow scope: Hers is reported to say it does not offer oral minoxidil for telogen effluvium or alopecia areata (sentence found only on a non-public copy of the page; not confirmed).

**Weaknesses**

- The quiz result sits behind an account (reported), so a visitor cannot see a recommendation or a final price without giving contact details.
- The consultation is reported as thin on cause-finding: no reviewer mentions questions on thyroid disease, iron or anaemia, PCOS or signs of high androgens, recent illness or weight loss, scalp symptoms, family history, contraception or period regularity. No blood tests and no blood pressure reading are described, although the main drug is a blood pressure medicine.
- Most prescription products are compounded and not FDA-approved, and the strengths of the oral blends are not published on the pages found.
- Eligibility rules are scattered: exclusion lists sit on separate treatment terms pages (/treatment/hair-loss/...), apart from the product pages (pages not opened; from search-index reads).
- No source shows dutasteride, oral finasteride for women, tretinoin add-ons or iron or vitamin D testing in the range. Spironolactone, the usual anti-androgen tablet for women before menopause, appears in no 2023 to 2026 description of the hair range, and one 2026 reviewer says Hers does not offer it.
- Prices are hard to pin down: sources give $35 and $39 for the blends, $39 and $50 a month for the postmenopausal spray, and plan-length prices are only shown inside the flow.
- Reviewers are said to report complaints about subscription charges, refunds and reaching a clinician (stage 1 reading; not re-checked at stage 3).

**Gaps a new competitor could use**

- Show the recommendation, strength and full price before asking for an email or an account.
- Ask the cause-finding questions Hers is not reported to ask (thyroid, iron, PCOS signs, recent illness, scalp symptoms, medicines that cause shedding) and explain how each answer changed the plan.
- Offer a route for the women Hers's stated policy leaves out: sudden shedding, patchy loss, pregnancy and breastfeeding (advice, safe topicals, blood tests, referral).
- Ask for a home blood pressure and pulse reading before oral minoxidil, and say so up front. If offering spironolactone (Hers appears not to today), include a potassium check plan.
- Publish who cannot have each treatment on the product page itself, and state exact strengths for combination products.
- Give perimenopausal women a clear answer: Hers's finasteride rule is 'after menopause only', with nothing specific in between.
- Sell fewer, simpler options with fixed, visible plan prices; Hers's many near-identical minoxidil formats are hard to compare.

## 8. Experiments run (6)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| s2-retest-home | women | Nothing changed: access re-test of the women's baseline (10 second wait) at the start of stage 2 | Still the Cloudflare security checkpoint (HTTP 403, 'Performing security verification'). No quiz screen was reached, so no baseline end state exists and no one-change experiment could be run. The checkpoint was not defeated. |
| s2-help-centre | women | Not a quiz replay: read-only visit to the shared Hims & Hers help centre (4 pages, no clicks, no forms) | Opened. Patient drug information for spironolactone and for the compounded minoxidil plus supplements tablet was read; two help-centre searches found no article describing the hair quiz. With four articles saved earlier by the Hims US investigator (oral minoxidil, minoxidil + supplements chew and gummy, compounded topical combination, 'How does this work?'), these are the proof for rules R1, R3, R4, R6, R7, R9, R10, R14, R15, R16. |
| verify-baseline | women | Nothing changed: stage 3 fresh replay of the women's baseline (10 second wait) | Same end state as recorded at stages 1 and 2: Cloudflare security checkpoint, HTTP 403, 'Performing security verification'. No quiz screen. Not defeated. |
| verify-help | women | Not a quiz replay: stage 3 read-only re-read of six help-centre articles the rules rest on | All six opened. All 18 sentences quoted in the rules are present word for word (oral minoxidil, Minoxidil + Supplements, Compounded Topical Combination, Spironolactone, How does this work?, Do I need a prescription?). |
| verify-help2 | women | Not a quiz replay: stage 3 read-only visit to one more help-centre article and four help-centre searches | 'Where is Hims & Hers available?' (updated 28 Oct 2026): all 50 states, some treatments limited by state, not Puerto Rico. Searches: the only identity article is about testosterone; no article on age; the spironolactone leaflet is still listed; nothing describes the hair quiz. |
| verify-hims-hers-pages | women | Not a quiz replay: stage 3 check of whether the sister site serves Hers hair pages (three addresses, once each) | No. /hair-loss/spironolactone, /treatment/hair-loss/spironolactone and /hair-loss/oral-minoxidil on www.hims.com each return 'this particular page ... doesn't exist' (404). The footer links to forhers.com. |

## 9. Independent verification

Trust this report as a map of Hers's published policy and product range, not as a description of its quiz. The site was blocked at all three stages, so no answer was ever changed and replayed and nothing is observed. The safety rules that rest on the help-centre leaflets (finasteride not before menopause; no oral minoxidil in pregnancy, when planning one or when breastfeeding; pheochromocytoma; heart history to the provider; provider decides; video visit in some states) were re-read word for word and are solid as policy. The product list is broadly right for the five core prescription products and the over-the-counter items, with prices good to within a few dollars and several strengths unknown. The quiz outline is second-hand, partly three years old, and three of its questions have no traceable source. Spironolactone and the spray may no longer be sold. After the stage 3 corrections the labels are honest: 'docs' means Hers, its help centre or a partner article says so (sometimes read only through a search index, which is flagged each time); 'inferred' covers reviewer reports and reasoning. A reader should not use this file to say what any single answer does in the Hers quiz.

**Re-checked**

- Baseline replayed fresh (runs/verify-baseline): still the Cloudflare checkpoint, HTTP 403, after a 10 second wait. Matches the record. No quiz screen exists to compare.
- Live re-test of rules was impossible (site blocked), so the documents behind the rules were re-read instead. Six help-centre articles opened directly (runs/verify-help): all 18 quoted sentences are present word for word.
- R1 finasteride not before menopause: CONFIRMED as policy ('contraindicated in females of childbearing potential').
- R3 pregnancy or planning one rules out oral minoxidil and finasteride: CONFIRMED as policy; the spironolactone part NOT confirmed.
- R4 breastfeeding rules out minoxidil tablets: CONFIRMED as policy; the 'some topicals are possible' line not re-read.
- R6 pheochromocytoma or minoxidil allergy rules out oral minoxidil: CONFIRMED as policy.
- R7 heart, kidney, liver, blood pressure: heart part CONFIRMED word for word; the rest supported only by search-index reads; one wrong citation (Fortune) removed.
- R8 spironolactone 'not a candidate' medicines list: NOT reproduced (one exact-phrase search found nothing); confidence lowered.
- R9 high potassium, Addison's disease or allergy rules out spironolactone: CONFIRMED as policy.
- R10 zinc with the Hair Vitamins + Minoxidil tablet: CONFIRMED as policy.
- R11 no oral minoxidil for telogen effluvium or alopecia areata: WEAKENED. The sentence was found only on a non-public copy of the page (internal.forhers.com, not opened).
- R14 provider decides, R15 video visit in some states, R16 no consultation for non-prescription products: CONFIRMED word for word.
- Product facts checked against reviews re-read at stage 3 (live product pages are blocked): oral minoxidil 1.25 to 2.5 mg and $29 (confirmed); chew and Hair Vitamins + Minoxidil (actives confirmed; $35 against $39 unresolved); Hair Blends Serum 7% minoxidil with biotin, B5, ketoconazole (confirmed); Postmeno Serum ingredients (confirmed, strengths not); spray 0.3% / 6% (confirmed), price $39 in 2023 and $50 a month in Nov 2026; 5% foam $54 and $12.67 (confirmed, 2023); 2% solution $45 (confirmed in three reviews); biotin gummies 300 mcg (confirmed); Triple Threat price (corrected); Full Volume $32 / $30 (confirmed); mask and scrub $44 (2023 only).
- Reviewer descriptions of the quiz re-read: Innerbody Dec 2023 (health topics, account to see results, keep or swap), AOL / New York Post Jun 2026 (visual quiz, density photos, 'not the official medical evaluation', photos and ID), NCOA Nov 2026 (10 to 15 minutes, one or two products), Healthline Nov 2026 (ID and card), Hello! Magazine May 2025 (partner article: goals, symptoms, routines). Mostly as stages 1 and 2 reported; the differences are listed under corrected.
- Checked that the sister site does not serve Hers pages (runs/verify-hims-hers-pages: three addresses, all 404).
- Evidence labels audited: there was no 'observed' or 'code' label to downgrade. Labels based only on third-party reviews were lowered (see corrected).

**Corrected**

- Evidence labels: 12 questions known only from third-party reviews changed from docs to inferred (q3 to q11, q14, q15, q17), with the source named; 'docs' is kept only where Hers or a Hims & Hers partner article says it (q1, q2, q12, q13, q16).
- Four options (pregnant, breastfeeding, pre-menopausal, post-menopausal) changed from docs to inferred: the policy is documented, the link to a quiz answer is not.
- Three questions (gradual or sudden, hair type, washing frequency) marked UNVERIFIED: no source could be found for them.
- Spironolactone (p8): label lowered to inferred and marked 'status uncertain'. No review lists it in the hair range and one 2026 review says Hers does not offer it; the unsourced '$30 a month' price was dropped; it was removed from the baseline woman's offered list; rules R8 and R9 now start 'if still offered'.
- Postmenopausal spray (p7): label lowered to inferred; the $39 price is from 2023 only (finvsfin gives no price for it); it may have been replaced by the Postmeno Serum.
- Postmeno Serum (p6): the 6% and 0.3% strengths are now marked as unconfirmed for the serum.
- Chew and Hair Vitamins + Minoxidil (p2, p4): minoxidil strength filled in as '1.25 mg or 2.5 mg according to one 2023 review'; price shown as $35 or $39.
- Minoxidil 2% solution (p10): one-time price set to $45 (three reviews); the $30 figure is unconfirmed.
- Triple Threat (p12): price corrected to $38 for a shampoo 2-pack and $47 for a conditioner 2-pack.
- Detox Scalp Scrub (p15): label lowered to inferred (2023 review only).
- R5 (under 18): effect changed from hard-stop to product-removed; no stop screen is documented.
- R7 and R11: the Fortune review was wrongly used as support. It reviews the over-the-counter 2% solution and gives the reviewer's own advice. Removed as proof.
- R8 and R11: confidence lowered to low. R10: effect changed to product-removed (only the exclusion is documented). R17: label lowered to inferred (third-party only).
- Recommendation profiles for pregnancy and for sudden or patchy loss changed from docs to inferred with default 'unknown'; the 'no prescription' profile's default changed from p9 to unknown.
- Added: rule R19 (state limits and Puerto Rico, from the help centre), a codeHints block (old Hers hair experiment names in the sister site's page state), four verify run records, and a new Hers source (treatment terms page for oral minoxidil, via search summary).

**Still unverified**

- Everything about quiz behaviour: no question, option, branch, stop screen or recommendation was seen. Every rule is policy or reasoning, not tested behaviour.
- The exact wording and order of every question; all option lists; where the account step sits today.
- All statements read only through a search index of Hers's own pages: prices on product pages, the under-18, kidney, liver and blood pressure exclusions, the 'already using minoxidil' exclusion, the breastfeeding FAQ, finasteride 'only after menopause' on the perimenopause page, and the spironolactone medicines list.
- Whether spironolactone and the postmenopausal spray are still sold; the Postmeno Serum's strengths; strengths of the chew and gummy; any plan-length price for a prescription product.
- Whether the starting price of the blends is $35 or $39 today.
- The default product for any profile, and whether 'vitamins with your treatment' still exists as a question.
- Which states limit which hair treatments, and which states need a video visit.
- Complaint themes and the subscription terms quoted at stage 1 were not re-checked.

## 10. Limits of this report

- Nothing was observed live on Hers at either stage: the site is behind a security checkpoint that was not, and must not be, defeated. No answer was changed and replayed, so there are no tested rules.
- Every rule is Hers's stated eligibility or safety policy (docs) or reasoning from it (inferred). The documents say who should not have a product; they do not say whether the quiz blocks the patient, hides the product, shows a warning or leaves it to the provider.
- Question wording is not verbatim and most answer options are unknown. Options shown as 'implied' or 'reviewer's category' are not the site's wording.
- Not tested, because the quiz could not be reached: age bands, each hair pattern, speed and duration, scalp symptoms, family history, each medical condition, each medicine, allergies, previous treatments and side effects, treatment preference, goals, lifestyle questions, and entry from product pages against the main page.
- Whether the health questions come before or after the account step is unresolved (a 2023 review says before; a 2026 article implies after).
- The conditions half of the spironolactone 'not a candidate' list, and the exact safety wording on product pages, were read only as search-index summaries and may be incomplete or out of date.
- Prices come from a search index and from reviews of different dates and disagree in places; plan-length prices for prescription products were not found.
- The default product for any profile is unknown; the 'offered' lists in recommendations are the products the patient is eligible for on paper, not a seen result.
- The quiz definition (probably a code chunk named hers.us.modern.domains-consultation-hair-loss.<hash>.js) was not read; reading it would settle most of the above.
- Stage 3 re-read the third-party reviews through a fetch tool that summarises pages, so short quotes from reviews are close to, but not guaranteed to be, word for word. Help-centre quotes were checked against the saved page text and are exact.
- Stage 3 could not re-read Hers's own pages: the site is blocked and the shared web-search budget ran out after three searches. Statements marked 'via search index' are therefore still second-hand.
- Whether spironolactone and the postmenopausal spray are still sold is not settled.
- Seen only in a 2023 review and left out of the catalogue: Complete Hair Kit ($55), Weekender Kit ($40), collagen powder ($27) and Latisse for eyelashes.

## 11. Sources

- [Hers hair-loss page (not readable from this machine; via search index)](https://www.forhers.com/hair-loss)
- [Hers Hair Blends page (via search index)](https://www.forhers.com/hair-blends)
- [Hers oral minoxidil page (via search index)](https://www.forhers.com/hair-loss/oral-minoxidil)
- [Hers Biotin + Minoxidil Chew page (via search index)](https://www.forhers.com/hair-loss/minoxidil-biotin-chew)
- [Hers Hair Vitamins + Minoxidil page (via search index)](https://www.forhers.com/hair-loss/minoxidil-hair-vitamin)
- [Hers Hair Blends Postmeno Serum page (via search index)](https://www.forhers.com/hair-loss/blends-postmeno-serum)
- [Hers spironolactone product page (URL only)](https://www.forhers.com/hair-loss/spironolactone)
- [Hers spironolactone patient information ('You are not a candidate ... if any of the following apply')](https://www.forhers.com/treatment/hair-loss/spironolactone)
- [Hers minoxidil 5% foam page (via search index)](https://www.forhers.com/hair-loss/minoxidil-women)
- [Hers minoxidil 2% drops page (via search index)](https://www.forhers.com/hair-loss/minoxidil-otp)
- [Hers blog: Hers vs Musely 2026](https://www.forhers.com/blog/hers-vs-musely)
- [Hers blog: Hers vs Nutrafol 2026](https://www.forhers.com/blog/hers-hair-vs-nutrafol)
- [Hers blog: Hers vs Happy Head](https://www.forhers.com/blog/hers-vs-happy-head)
- [Hers blog: Spironolactone for hair loss](https://www.forhers.com/blog/spironolactone-hair-loss)
- [Hers: menopause hair loss](https://www.forhers.com/conditions/menopause-hair-loss)
- [Hers promotions terms (subscription renews unless cancelled 2 days before the renewal processing date)](https://www.forhers.com/promotions/terms)
- [Hers terms and conditions](https://www.forhers.com/terms-and-conditions)
- [ConductAtlas summary of Hims & Hers terms: auto-renewal and no-refund policy](https://conductatlas.com/platform/hims-hers/hims-hers-terms-and-conditions/auto-renewal-subscription-and-no-refund-policy/)
- [Innerbody: Hers Hair Review (Dec 2023) - quiz outline and full price table](https://www.innerbody.com/hers-hair-review)
- [AOL / New York Post: I took the Hers hair growth quiz (updated 7 Jun 2026)](https://www.aol.com/articles/took-hers-hair-growth-quiz-163000000.html)
- [NCOA: Hers hair growth review (5 Oct 2026)](https://www.ncoa.org/product-resources/hair-loss/hers-hair-growth-review/)
- [NCOA: menopausal hair loss treatments (3 Nov 2026)](https://www.ncoa.org/product-resources/hair-loss/menopausal-hair-loss-treatments/)
- [finvsfin: Hers hair loss review (8 Aug 2026)](https://finvsfin.com/hers-hair-loss-review/)
- [Fortune: Hers hair growth review (updated 1 Aug 2026). Reviews the over-the-counter Minoxidil 2% solution only ($45); its 'who it's not for' lines are the reviewer's advice, not Hers policy](https://fortune.com/article/hers-hair-growth-review/)
- [Hello! Magazine sponsored article (30 May 2025)](https://www.hellomagazine.com/shopping/829248/hims-and-hers-hair-loss-treatment/)
- [top10.com Hers review (6 Aug 2025)](https://www.top10.com/hair-loss/reviews/hers)
- [Sister site Hims hair-loss page (opened live; shows the shared quiz path /c/hl)](https://www.hims.com/hair-loss)
- [Help centre (shared Hims & Hers): Spironolactone patient drug information (opened directly, updated 14 Jul 2025)](https://support.hims.com/hc/en-us/articles/38945518659227-Spironolactone-Generic-for-Aldactone)
- [Help centre: Minoxidil oral tablets patient drug information (updated 14 Jul 2025)](https://support.hims.com/hc/en-us/articles/38944589097883-Minoxidil)
- [Help centre: Minoxidil + Supplements (chew, gummy, tablet) patient drug information](https://support.hims.com/hc/en-us/articles/38838928667419-Minoxidil-Supplements)
- [Help centre: Minoxidil + Supplements Compounded Tablet](https://support.hims.com/hc/en-us/articles/38834273003547-Minoxidil-Supplements-Compounded-Tablet)
- [Help centre: Compounded Topical Combination (minoxidil, finasteride, ketoconazole, biotin, dexpanthenol)](https://support.hims.com/hc/en-us/articles/38844763548059-Compounded-Topical-Combination)
- [Help centre: How does this work? (video visit in some states; updated 18 Jun 2026)](https://support.hims.com/hc/en-us/articles/360032844051-How-does-this-work)
- [Help centre: Do I need a prescription?](https://support.hims.com/hc/en-us/articles/115002248531-Do-I-need-a-prescription)
- [Hers Hair Blends Serum product page (via search index)](https://www.forhers.com/hair-loss/blends-solutions)
- [Hers: perimenopause hair loss (finasteride only after menopause; via search index)](https://www.forhers.com/conditions/perimenopause-hair-loss)
- [Hers blog: Best hair loss treatments for women (via search index)](https://www.forhers.com/blog/best-hair-loss-treatment-for-women)
- [Hers: finasteride drug information (via search index)](https://www.forhers.com/drugs/info/finasteride)
- [Healthline: Hers review (updated 19 Nov 2026; ID and card needed; tester used birth control, not hair)](https://www.healthline.com/health/womens-health/hers-review)
- [healthrx.com: Hers prescription process (undated summary, not first-hand)](https://healthrx.com/brands-hers/prescription-process)
- [Business Wire: Hers introduces new prescription dermatology offerings (13 Jan 2022; page not readable, title and summary only)](https://www.businesswire.com/news/home/20220113005023/en/)
- [Hers treatment terms page for oral minoxidil ('Provided by You Health for patients'; via search summary at stage 3, not opened)](https://www.forhers.com/treatment/hair-loss/oral-minoxidil)
- [Help centre: Where is Hims & Hers available? (updated 28 Oct 2026; opened at stage 3)](https://support.hims.com/hc/en-us/articles/9586237484571-Where-is-Hims-Hers-available)
- [Sister site page state with old Hers hair experiment names (saved copy: runs/grab-hims-c-hl/page.html)](https://www.hims.com/c/hl)
