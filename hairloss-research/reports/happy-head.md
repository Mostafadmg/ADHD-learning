# Happy Head: consultation and product report

**Market:** US · **Website:** https://www.happyhead.com/ · **Checked:** 2026-11-23

> US dermatologist-founded telehealth company selling custom-compounded prescription hair-loss medicines (topical, oral and combined) on subscription, plus non-prescription hair products.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** An email page ('BLACK FRIDAY SALE, Up to 60% Off, Plus FREE Dermaroller' on 23 Nov 2026) with a consent tick. Its fields and place depend on a split test chosen when the quiz loads: (a) sms_capture: email + US mobile number, after every medical question (about 26 screens in; runs/baseline-men, runs/verify-base-women-pinned); (b) no redirect: email only, same place at the end (runs/s2/baseline-men, runs/verify-base-men); (c) early_capture: email only, straight after 'Take Me to My Plan', BEFORE the recommendation screen and before any medical question (runs/verify-base-women, runs/s2/var-early-capture-women). Submitting it posts the questionnaire to api.happyhead.com/middleware/embeddables and leads to checkout at my.happyhead.com. Nothing was entered.
- **Blocker:** www.happyhead.com/robots.txt (last updated April 2026) says 'Disallow: /' for ClaudeBot, Claude-Web, Claude-User and anthropic-ai. This research was done by Claude, so the marketing site, its product pages, collection pages, FAQ, legal pages and sitemap were NOT fetched. One home-page request went out before robots.txt was read; that copy was deleted unread.
- **Blocker:** The help centre (happyhead.zendesk.com) is open to all agents in its robots.txt but shows a Cloudflare 'Just a moment' check to curl, to WebFetch and to a bare headless browser. It loads normally in the standard walk.js browser; 24 articles were read that way. No check was solved or worked around.

Tested live: the standard assessment on www.form.happyhead.com (its own robots.txt allows all agents) for the baseline man and the baseline woman, both to the email page. Read from code: the full quiz definition (62 pages, all conditions, the recommendation call, the order payload with its clinician flags), served to the anonymous page by engine.embeddables.com. Read from documents: 24 help-centre articles and four independent reviews. Not tested: product pages and prices on www.happyhead.com (closed to this agent; a few facts were checked through web-search summaries only), anything after the email page, and what the dermatologist actually does with a flagged answer. Stage 2: 21 one-change experiments and both baselines replayed live on 23 Nov 2026, all stopping at the email page with no consultation posted. Stage 3 (independent check, 23 Nov 2026): both baselines and 12 high-impact rules replayed live in runs/verify-*, plus 4 new one-change tests (woman 50+ choosing Oral, woman with no birth control, woman with household pregnancy, man with low blood pressure). All runs: 0 consultation posts.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

A three-input engine. Only sex, the woman's age band (under 50 or 50+) and the topical/oral preference reach the recommendation call, which runs before any medical question. Men and women 50+ get dutasteride + minoxidil; women under 50 get minoxidil topical + a spironolactone/minoxidil capsule. The topical + capsule "Dual" bundle is always first and pre-selected; the second card is Topical (or SuperCapsule if the person said Oral). After the choice, about 12 to 16 medical questions follow. They add follow-up pages (free text, reactions, partner-pregnancy consent, three blood-pressure questions for capsule plans) but never remove, switch or block a product: 25 live one-change tests (21 in stage 2, 4 more in the stage 3 check) changed the offer only through sex/age band and method. Answers are tagged important or critical for a dermatologist who reviews after checkout. The only hard stop is age under 18, and a woman whose birth date does not fit her band is sent back to choose again. The email wall is a split test: in one arm it comes before the recommendation screen.

## 3. Engine rules (26)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | main | Sex/age answer = 'Male' | The recommendation is dutasteride 0.3% + minoxidil 8% topical, the dutasteride 0.5 mg + minoxidil 1.25 mg SuperCapsule, and the two as a bundle (bundle first, pre-selected). Finasteride is never offered by the standard assessment. _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil)_ | Switches product | observed | high |
| R2 | main | Sex/age answer = 'Female under 50' | No finasteride or dutasteride. The recommendation is minoxidil 6% topical, the spironolactone 25 mg + minoxidil 1.25 mg SuperCapsule, and the two as a bundle. _(affects: Custom Topical: Minoxidil & Retinoic Acid (formula code TM3), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3), Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil)_ | Switches product | observed | high |
| R3 | main | Sex/age answer = 'Female 50 or older' | Switched to the men's dutasteride set: Dual (dutasteride 0.3%/minoxidil 8% topical + dutasteride 0.5 mg/minoxidil 1.25 mg capsule) and Topical dutasteride. The recommendation call is sent with a birth date 51 years ago. _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil)_ | Switches product | observed | high |
| R4 | main | Method answer = Topical / Oral / Not sure | Bundle card always first. Second card is Topical for 'Topical' and 'Not sure', SuperCapsule for 'Oral'. _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Custom Topical: Minoxidil & Retinoic Acid (formula code TM3), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3))_ | Switches product | observed | high |
| R5 | main | Only sex, the female age band, the method answer and any product id in the URL are sent to the recommendation service | Goal, duration, family history and hair-loss pattern do not change the anonymous recommendation. | No effect | observed | high |
| R6 | main | Chosen plan includes a SuperCapsule (bundle or capsule) | Three extra questions are asked: last doctor check-up, blood pressure, weight. Topical-only skips them. _(affects: SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil, SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3), Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil)_ | Adds questions | observed | high |
| R7 | main | Date of birth gives an age under 18 | 'You must be over 18' and no NEXT button. The only hard stop in the quiz. | Stops the patient | observed | high |
| R8 | main | Woman's date of birth does not match her age band | She is sent back to the "Which option best describes you?" page with "There is a discrepancy between your date of birth and the selected age range. Please review it and try again." Choosing the other band switches the product family. _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil, Custom Topical: Minoxidil & Retinoic Acid (formula code TM3), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3), Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil)_ | Shows a warning | observed | high |
| R9 | main | Answers flagged in the order payload | 'Critical': reaction to a previous treatment, anyone pregnant/breastfeeding/trying in the household, low blood pressure, a customisation request. 'Important': bald patches, another pattern, other previous treatment, any unusual scalp or body-hair symptom, able to become pregnant, no birth control, either answer on the pregnancy-risk screen, every listed health condition, anything-else text. Nothing else is flagged (medicines, allergies, mildly raised or high blood pressure, weight are not). | Flags for the clinician | code | high |
| R10 | main | Any medical answer | The quiz never removes or changes the chosen product and never shows a stop screen for a medical answer. All medical decisions are left to the dermatologist after payment. Stage 3 added low blood pressure (runs/verify-m-bp-low) and no birth control in a woman able to become pregnant (runs/verify-w-bc-none): same result. | Flags for the clinician | observed | high |
| R11 | main | m-household-preg = 'Yes' | The partner-pregnancy safety screen for finasteride/dutasteride is added. Choosing "No, I do not accept these risks" does not remove dutasteride: the plan is unchanged and the quiz carries on. _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil)_ | Flags for the clinician | observed | high |
| R12 | main | m-reco = 'CHOOSE TOPICAL' (second click) | Plan = the topical alone; the check-up, blood-pressure and weight questions are skipped. _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9))_ | Skips questions | observed | high |
| R13 | main | m-reco = 'CHOOSE SUPERCAPSULE' (only offered when method = Oral) | Plan = the capsule alone; check-up, blood-pressure and weight questions are still asked. _(affects: SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2))_ | Switches product | observed | high |
| R14 | main | m-symptoms = any unusual symptom (itch/burning/rash, pain/pus/sores, loss of brows/lashes/body hair) | One free-text details page is added. No warning or stop, even though the question says these "may disqualify you". Plan unchanged. | Adds questions | observed | high |
| R15 | main | m-conditions = any condition (e.g. Heart condition) | One free-text details page is added. Oral minoxidil stays in the plan; nothing is removed. | Adds questions | observed | high |
| R16 | main | m-prior = any treatment (e.g. Oral Finasteride) | Adds "Did you have any reactions?"; "Yes" opens a text box. A reaction to finasteride does not remove dutasteride. | Adds questions | observed | high |
| R17 | main | Woman: m-preg-ability = 'No' | Asks why (post-menopausal, surgery, partner vasectomy, other) instead of birth control. The product family does not change: a post-menopausal woman who chose "under 50" keeps the spironolactone set. | Adds questions | observed | high |
| R18 | main | m-custom = 'Yes' | A text box and an extra "anything else for your doctor?" page are added. A request such as "finasteride instead of dutasteride" does not change the plan in the quiz. | Adds questions | observed | high |
| R19 | main | m-dob gives age 70 (man) | No upper age limit and no message: oral minoxidil and dutasteride stay in the plan. | No effect | observed | high |
| R20 | main | Woman 50 or older who says she can become pregnant | She is still offered dutasteride (topical and capsule) with no on-screen warning; the answer only goes to the dermatologist. _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil)_ | Flags for the clinician | observed | medium |
| R21 | main | Real date of birth (asked near the end) | Not used for the product. The recommendation call is made before it with a birth date the page makes up from the age band (51 years ago for men and women 50+, 19 years ago for women under 50). | No effect | observed | high |
| R22 | main | m-sexage = 'Female 50 or older' and m-method = 'Oral' | Cards: Dual (dutasteride topical + dutasteride capsule) first, then the dutasteride + minoxidil SuperCapsule alone. Same as a man who chooses Oral. _(affects: SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil)_ | Switches product | observed | high |
| R23 | main | Woman under 50 able to become pregnant, m-birth-control = 'None of the above' | No warning and no stop. The spironolactone + minoxidil capsule stays in the plan; the answer is only flagged 'important' for the dermatologist. _(affects: SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3), Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil)_ | Flags for the clinician | observed | high |
| R24 | main | Woman under 50, m-household-preg = 'Yes' | She is shown the 'Finasteride & Dutasteride: Partner Pregnancy Risk' screen even though her plan holds neither drug. The screen is the same for everyone and is not tied to the plan. | Adds questions | observed | high |
| R25 | main | m-bp = 'Low (Below 100 / 65)' | No warning, no stop; oral minoxidil stays in the plan. Flagged 'critical' for the dermatologist (code). _(affects: SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil)_ | Flags for the clinician | observed | high |
| R26 | main | Split test chosen on load (email_capture = early_capture) | The email wall comes straight after 'Take Me to My Plan', before the recommendation screen and before all medical questions. The recommendation call has already been made. | No effect | observed | high |

## 4. Products (33)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9)](https://www.happyhead.com/products/topical-solution-dutasteride-minoxidil) | rx-topical-compounded | dutasteride 0.3%; minoxidil 8%; retinoic acid (tretinoin) 0.001%; hydrocortisone 1% | solution with dropper, 50 ml per 25-day supply, 1 ml twice daily | both | US prescription, compounded by a pharmacy (Chemistry Rx named in the site's own data); compounded products are not FDA-approved as finished medicines | $89 per 25-day supply (subscription or one-time) (3 bottles $267 every 75 days; 5 bottles $445 every 125 days (no multi-bottle discount in the API data). Site advertises 'up to 60% off' the first order and a free dermaroller. Refills on the prescription record: 16 (1-b…) | Man, or woman who picks "Female 50 or older", with method Topical or not sure: shown as the CHOOSE TOPICAL card; also inside the Dual bundle. Seen live (runs/s2/m-method-topical, w-50plus, m-choose-topical). | observed |
| [SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2)](https://www.happyhead.com/products/supercapsule-dutasteride-minoxidil-vitamin-d3) | rx-oral-compounded | dutasteride 0.5 mg; minoxidil 1.25 mg; vitamin D3 2,000 IU | capsule, one a day, 25 per supply | both | US prescription, compounded by a pharmacy (Chemistry Rx named in the site's own data); compounded products are not FDA-approved as finished medicines | $89 per 25-day supply (subscription or one-time) (3 bottles $267 every 75 days; 5 bottles $445 every 125 days. NCOA (Sep 2026) quotes $71 a month on subscription or $89 one-time. Stage 3 re-check (runs/verify-base-men): $89 / $267 (3) / $445 (5); SC2 0.5 mg dutasteride…) | Man or woman 50+: always inside the Dual bundle; its own CHOOSE SUPERCAPSULE card only when the method answer is Oral (runs/s2/m-method-oral, m-oral-choose-capsule). | observed |
| [Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil](https://www.form.happyhead.com/get-started/?l=false&ph=true) | bundle | dutasteride 0.3% topical + 0.5 mg oral; minoxidil 8% topical + 1.25 mg oral; retinoic acid 0.001%; hydrocortisone 1%; vitamin D3 2,000 IU | topical solution + daily capsule | both | US prescription, compounded by a pharmacy (Chemistry Rx named in the site's own data); compounded products are not FDA-approved as finished medicines | $178 per 25-day supply at list price (two $89 items) (The flow's hidden plan page (URL key s_p) lists $178/mo with 10% off 1-month ($160), 15–20% off 3-month ($151 or $142), 25–30% off 5-month ($134 or $125). NCOA (Sep 2026): $142 a month on subscription or $178 one-time.) | Default, pre-selected first card for every man and every woman who picks "50 or older", whatever the goal, pattern, medical answers or age (runs/s2/baseline-men, w-50plus and all one-change runs). | observed |
| [Custom Topical: Minoxidil & Retinoic Acid (formula code TM3)](https://www.form.happyhead.com/get-started/?l=false&ph=true) | rx-topical-compounded | minoxidil 6%; retinoic acid (tretinoin) 0.01%; hydrocortisone 1% | solution with dropper, 50 ml per 25-day supply, 1 ml twice daily | women | US prescription, compounded by a pharmacy (Chemistry Rx named in the site's own data); compounded products are not FDA-approved as finished medicines | $59 per 25-day supply (subscription or one-time) (3 bottles $177 every 75 days; 5 bottles $295 every 125 days. Top10 (Aug 2025) lists 'Topical Solution: Minoxidil & Retinoic Acid' from $24. Stage 3 re-check (runs/verify-base-women-pinned): $59 / $177 (3) / $295 (5); TM…) | Woman who picks "Female under 50" with method Topical or not sure: CHOOSE TOPICAL card (runs/s2/base-women, w-method-topical). | observed |
| [SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3)](https://www.form.happyhead.com/get-started/?l=false&ph=true) | rx-oral-compounded | spironolactone 25 mg; minoxidil 1.25 mg; vitamin D3 2,000 IU | capsule, one a day, 25 per supply | women | US prescription, compounded by a pharmacy (Chemistry Rx named in the site's own data); compounded products are not FDA-approved as finished medicines | $89 per 25-day supply (subscription or one-time) (3 bottles $267 every 75 days; 5 bottles $445 every 125 days. Top10 (Aug 2025): from $36. Stage 3 re-check (runs/verify-base-women-pinned): $89 / $267 (3) / $445 (5); SC3 25 mg spironolactone, 1.25 mg minoxidil, 2,000 IU…) | Woman under 50: inside her Dual bundle; its own card only when the method answer is Oral (runs/s2/w-method-oral). | observed |
| [Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil](https://www.form.happyhead.com/get-started/?l=false&ph=true) | bundle | minoxidil 6% topical + 1.25 mg oral; spironolactone 25 mg oral; retinoic acid 0.01%; hydrocortisone 1%; vitamin D3 2,000 IU | topical solution + daily capsule | women | US prescription, compounded by a pharmacy (Chemistry Rx named in the site's own data); compounded products are not FDA-approved as finished medicines | $148 per 25-day supply at list price ($59 + $89) (Hidden plan page: $148/mo list; 1-month $133, 3-month $126 or $118, 5-month $111 or $104. NCOA (Sep 2026): $118 a month on subscription or $148 one-time.) | Default, pre-selected first card for every woman who picks "Female under 50", including one who says she is post-menopausal (runs/s2/base-women, w-preg-no-postmeno). | observed |
| [SuperCapsule: Finasteride, Minoxidil & Vitamin D3](https://www.happyhead.com/products/supercapsule-finasteride-minoxidil-vitamin-d3) | rx-oral-compounded | finasteride 1 mg; minoxidil 1.25 mg; vitamin D3 2,000 IU | capsule, one a day | both | US prescription, compounded (not FDA-approved as a finished medicine) | $79 list, $63.20 a month on subscription (web-search summary of happyhead.com product page, 23 Nov 2026; page not opened) (Earlier figure ($29 first month then $59, finvsfin.com Oct 2025) is out of date. A landing page advertises 60% off the first Rx order ($32). Strengths finasteride 1.0 mg, minoxidil 1.25 mg, D3 2,000 IU are stated on a H…) | Not offered by the standard assessment (which always leads with dutasteride for men). Reached from its product page (product-specific consult). Exact trigger unknown. | docs |
| [SuperCapsule + ED Performance](https://happyhead.zendesk.com/hc/en-us/articles/21018342179863-How-do-I-know-if-the-SuperCapsule-ED-Performance-is-right-for-me) | rx-oral-compounded | dutasteride (or finasteride 1 mg in a second version) unverified; tadalafil 5 mg; vitamin D3 2,000 IU | capsule, one a day | men | US prescription, compounded (not FDA-approved as a finished medicine) | unknown (Top10 (Aug 2025) lists a 'SuperCapsule: Finasteride & Tadalafil (ED Performance)' from $36; the help centre (updated about Aug 2026) describes dutasteride + tadalafil. The two sources disagree on the 5-alpha-reductase d…) | Not offered by the standard assessment. Product-page entry only (unknown trigger). | docs |
| [Topical Solution: Finasteride & Minoxidil (custom)](https://www.happyhead.com/products/topical-solution-finasteride-minoxidil) | rx-topical-compounded | finasteride 0.3% (third-party figure); minoxidil 6% (third-party figure); hydrocortisone 1% (third-party figure) | solution with dropper | both | US prescription, compounded (not FDA-approved as a finished medicine) | from $35 a month (Top10.com review dated 6 Aug 2025 ('starting at' price, likely a first-order or multi-month price)) (Strengths come from Top10 and Perfect Hair Health, not from Happy Head's own pages; the formula is customisable.) | Not offered by the standard assessment. Men of any age and women over 50 (company FAQ wording seen in search results). Product-page entry. | docs |
| [Topical Solution: Finasteride, Dutasteride & Minoxidil (Advanced Formula)](https://www.happyhead.com/products) | rx-topical-compounded | finasteride unknown; dutasteride unknown; minoxidil unknown | solution | both | US prescription, compounded (not FDA-approved as a finished medicine) | from $48 a month (Top10.com review dated 6 Aug 2025 ('starting at' price, likely a first-order or multi-month price)) | Never offered by the anonymous assessment in any answer combination tested (inferred: sold from its own product page, which was not opened, or chosen by the dermatologist after checkout). | docs |
| [Topical Finasteride & Minoxidil (Aqueous Formula)](https://happyhead.zendesk.com/hc/en-us/articles/17624946350743-Which-of-your-hair-growth-solutions-are-customizable) | rx-topical-compounded | finasteride unknown; minoxidil unknown | water-based solution (contains some alcohol) | both | US prescription, compounded (not FDA-approved as a finished medicine) | from $48 a month (Top10.com review dated 6 Aug 2025 ('starting at' price, likely a first-order or multi-month price)) (Not customisable (help centre).) | Never offered by the anonymous assessment in any answer combination tested (inferred: sold from its own product page, which was not opened, or chosen by the dermatologist after checkout). | docs |
| [Topical Latanoprost, Finasteride & Minoxidil](https://happyhead.zendesk.com/hc/en-us/articles/17624946350743-Which-of-your-hair-growth-solutions-are-customizable) | rx-topical-compounded | latanoprost unknown; finasteride unknown; minoxidil unknown | solution | both | US prescription, compounded (not FDA-approved as a finished medicine) | from $60 a month (Top10.com review dated 6 Aug 2025 ('starting at' price, likely a first-order or multi-month price)) (Not customisable (help centre).) | Never offered by the anonymous assessment in any answer combination tested (inferred: sold from its own product page, which was not opened, or chosen by the dermatologist after checkout). | docs |
| [Topical SuperSolution: Finasteride, Minoxidil (Liposomal Formula)](https://www.happyhead.com/products/topical-supersolution-finasteride-minoxidil-and-liposomal) | rx-topical-compounded | finasteride unknown; minoxidil unknown | liposomal base, slow release | both | US prescription, compounded (not FDA-approved as a finished medicine) | from $39 a month (Top10.com review dated 6 Aug 2025 ('starting at' price, likely a first-order or multi-month price)) (Not customisable (help centre).) | Never offered by the anonymous assessment in any answer combination tested (inferred: sold from its own product page, which was not opened, or chosen by the dermatologist after checkout). | docs |
| [TopicalRx Solution: Spironolactone & Minoxidil (women under 50)](https://www.happyhead.com/products) | rx-topical-compounded | spironolactone 0.5%; minoxidil 6%; retinoic acid figure unclear (NCOA prints 1%); hydrocortisone 1% | solution | women | US prescription, compounded (not FDA-approved as a finished medicine) | $63 a month on subscription or $79 one-time (NCOA review published 23 Sep 2026) (Top10 (Aug 2025): from $32. Strengths are NCOA's; its retinoic acid figure looks like a misprint. Stage 3: no current Happy Head price found by web search; finvsfin lists $39 first month then $79. Price unverified.) | Not offered by the standard assessment, which gives women under 50 a minoxidil-only topical (p4). Company FAQ: 'We offer Topical Spironolactone for women of childbearing age.' | docs |
| [Topical Solution: Dutasteride & Minoxidil (Bryan's Formula)](https://www.happyhead.com/products) | rx-topical-compounded | dutasteride unknown; minoxidil unknown | solution | both | US prescription, compounded (not FDA-approved as a finished medicine) | from $58 a month (Top10.com review dated 6 Aug 2025 ('starting at' price, likely a first-order or multi-month price)) | Never offered by the anonymous assessment in any answer combination tested (inferred: sold from its own product page, which was not opened, or chosen by the dermatologist after checkout). | docs |
| [TopicalRx Advanced ProBlend (10-in-1)](https://happyhead.zendesk.com/hc/en-us/articles/32006248028439-What-is-Topical-Rx-Advanced-ProBlend) | rx-topical-compounded | minoxidil 8%; cetirizine HCl 1%; dutasteride 0.25%; finasteride 0.25%; biotin 0.2%; caffeine 0.2%; latanoprost 0.005%; tretinoin 0.001%; vitamin D3 1,000 IU/mL; melatonin 0.1% (web-search summary of the product page, 23 Nov 2026) | serum, once daily | both | US prescription, compounded (not FDA-approved as a finished medicine) | $79 a month on subscription or $99 one-time (NCOA review published 23 Sep 2026) (For men 18+ and women 50+. Not customisable. Melatonin is named for the ProBlend family; the help article lists nine strengths. Stage 3 web search: a landing page advertises $59 for the first month; standard price not c…) | Offered through the ProBlends version of the assessment (URL key rec=problends) or its product page; not in the standard assessment. | docs |
| [TopicalRx SuperSolution ProBlend (10-in-1, lipodermal)](https://happyhead.zendesk.com/hc/en-us/articles/32104727861783-What-is-TopicalRx-SuperSolution-ProBlend) | rx-topical-compounded | minoxidil 8%; dutasteride 0.25%; finasteride 0.25%; cetirizine HCl unknown; latanoprost unknown; melatonin unknown; caffeine unknown; tretinoin unknown; vitamin D3 unknown; biotin unknown | cream in a pump, 30 ml, five pumps once daily | both | US prescription, compounded (not FDA-approved as a finished medicine) | $79 a month on subscription or $99 one-time (NCOA review published 23 Sep 2026) (Optional 2.5% ketoconazole add-in (help centre). SKU TOP-DUT-FIN-LIPOD-1 in the quiz code. Not customisable.) | In the ProBlends version of the assessment (rec=problends) this is the topical card for men and women 50+ (code); women under 50 still get p4. | code |
| [Oral Medication: Finasteride](https://www.happyhead.com/collections/finasteride) | rx-oral | finasteride unknown | tablet or capsule | both | US prescription (whether a licensed generic or compounded is unknown) | from $24 a month (Top10.com review dated 6 Aug 2025 ('starting at' price, likely a first-order or multi-month price)) | Never offered by the anonymous assessment in any answer combination tested (inferred: sold from its own product page, which was not opened, or chosen by the dermatologist after checkout). | docs |
| [Oral Medication: Minoxidil](https://www.happyhead.com/collections/minoxidil) | rx-oral | minoxidil unknown | tablet or capsule | both | US prescription, off-label for hair loss (licensed generic or compounded: unknown) | from $22 a month (Top10.com review dated 6 Aug 2025 ('starting at' price, likely a first-order or multi-month price)) | Never offered by the anonymous assessment in any answer combination tested (inferred: sold from its own product page, which was not opened, or chosen by the dermatologist after checkout). | docs |
| [Oral Medication: Dutasteride](https://www.happyhead.com/collections/dutasteride) | rx-oral | dutasteride unknown | capsule | both | US prescription, off-label for hair loss (licensed generic or compounded: unknown) | from $59 a month (Top10.com review dated 6 Aug 2025 ('starting at' price, likely a first-order or multi-month price)) | Never offered by the anonymous assessment in any answer combination tested (inferred: sold from its own product page, which was not opened, or chosen by the dermatologist after checkout). | docs |
| [Oral Medication: Spironolactone](https://www.happyhead.com/products) | rx-oral | spironolactone unknown | tablet or capsule | women | US prescription, off-label for hair loss (licensed generic or compounded: unknown) | from $49 a month (Top10.com review dated 6 Aug 2025 ('starting at' price, likely a first-order or multi-month price)) | Never offered by the anonymous assessment in any answer combination tested (inferred: sold from its own product page, which was not opened, or chosen by the dermatologist after checkout). | docs |
| [TopicalRx Copper Peptide Formula (GHK-Cu)](https://happyhead.zendesk.com/hc/en-us/articles/42614001770903-TopicalRx-Copper-Peptide-Formula-GHK-Cu) | rx-topical-compounded | GHK-Cu (copper tripeptide-1) 0.5%; rosemary leaf oil not stated | scalp solution | both | US prescription, compounded (not FDA-approved as a finished medicine) | unknown (Add-on product id 6127095 in the quiz code.) | Upsell inside the topical card when the assessment URL has upgrade=cp ('Complete Your Scalp Routine'). | code |
| [TopicalRx Dandruff Solution](https://happyhead.zendesk.com/hc/en-us/articles/35813909022103-TopicalRx-Dandruff-Solution-Clobetasol-Ketoconazole-by-Happy-Head) | rx-topical-compounded | clobetasol 0.05%; ketoconazole 2.5% | topical solution | both | US prescription, compounded (not FDA-approved as a finished medicine) | unknown (Scalp product, not a hair-loss product; listed because the same quiz has a dandruff wording set.) | Product-specific consult only: the quiz switches to dandruff wording when the URL has consult=true and one of four dandruff product ids. | code |
| [TopicalRx Beard Formula](https://happyhead.zendesk.com/hc/en-us/articles/35817027675287-Topical-Rx-Beard-Formula-An-In-Depth-Guide) | rx-topical-compounded | minoxidil 8%; cetirizine HCl 1%; other actives not captured | once-daily topical | men | US prescription, compounded (not FDA-approved as a finished medicine) | unknown (Beard product. Not customisable.) | Product-page entry only. | docs |
| [Scalp Dermaroller](https://happyhead.zendesk.com/hc/en-us/articles/31044488677655-What-non-prescription-products-does-Happy-Head-offer) | device | n/a | micro-needle roller | both | non-prescription device | unknown ('$30 off' when added to the topical card) (Add-on product id 499008. 'FREE Dermaroller with any Rx subscription' in the Black Friday banner seen on 23 Nov 2026.) | Upsell inside the topical card when the assessment URL has upgrade=derm. | code |
| [5% Minoxidil Topical Solution, USP (Men's Formula)](https://happyhead.zendesk.com/hc/en-us/articles/31044488677655-What-non-prescription-products-does-Happy-Head-offer) | otc-medicine | minoxidil 5% | solution | men | US OTC | unknown (No returns on non-prescription items.) | Not part of the assessment; for people who do not want a prescription. | docs |
| [2% Minoxidil Topical Solution, USP (Women's Formula)](https://happyhead.zendesk.com/hc/en-us/articles/31044488677655-What-non-prescription-products-does-Happy-Head-offer) | otc-medicine | minoxidil 2% | solution, three 2 oz bottles in the 3-month bundle | women | US OTC | unknown | Not part of the assessment. | docs |
| [Thickening Shampoo & Conditioner](https://happyhead.zendesk.com/hc/en-us/articles/31044488677655-What-non-prescription-products-does-Happy-Head-offer) | cosmetic | argan oil, biotin, collagen, keratin, saw palmetto | shampoo and conditioner | both | cosmetic | unknown | Not part of the assessment. | docs |
| [Hair Serum (drug-free)](https://happyhead.zendesk.com/hc/en-us/articles/32542827356695-Happy-Head-Hair-Serum) | cosmetic | n/a | topical serum | both | cosmetic | unknown | Not part of the assessment. | docs |
| [Anti-Gray Serum](https://happyhead.zendesk.com/hc/en-us/articles/39893272487447-Happy-Head-Anti-Gray-Serum-Benefits-and-How-to-Use-It) | cosmetic | n/a | scalp serum | both | cosmetic | unknown | Not part of the assessment. | docs |
| [Hair Growth Supplements](https://happyhead.zendesk.com/hc/en-us/articles/32651800976151-Unlock-Thicker-Healthier-Hair-with-Happy-Head-s-All-in-One-Hair-Growth-Supplement) | supplement | biotin, collagen, keratin, saw palmetto, ashwagandha, probiotics, vitamins A and D | capsules | both | US dietary supplement | $88 each (text in the quiz's hidden plan page) (Given free on 3- and 5-month plans in one plan-page variant.) | Free add-on on longer plans in one plan-page variant (URL key s_p=a1). | code |
| [Advanced Laser Helmet Hair Growth System](https://happyhead.zendesk.com/hc/en-us/articles/32625347016087-Everything-You-Need-to-Know-About-the-Advanced-Laser-Helmet-Hair-Growth-System) | device | n/a | helmet with 204 laser diodes | both | device, described by the company as FDA-cleared | unknown | Not part of the assessment. | docs |
| [StrandIQ System DNA Starter Kit](https://happyhead.zendesk.com/hc/en-us/articles/34706991232151-StrandIQ-System-DNA-Starter-Kit-Unlock-Your-Hair-s-Genetic-Code-for-Personalized-Growth) | service | n/a | at-home DNA test with reports, a dermatologist consultation and a first month of treatment | both | consumer genetic test plus prescription service | $349 one-time including the first month (NCOA review published 23 Sep 2026) (Perfect Hair Health (Oct 2026) quotes $298.) | A separate way in: buy the kit instead of taking the assessment. | docs |
| [Ultimate Growth Bundle: Topical Solution + SuperCapsule, finasteride & minoxidil](https://www.happyhead.com/products/topical-solution-supercapsule-finasteride-minoxidil) | bundle | finasteride unknown; minoxidil unknown | topical solution + daily capsule | both | US prescription, compounded (not FDA-approved as a finished medicine) | unknown (Name and link are in the help-centre footer; the page itself was not opened.) | Never offered by the anonymous assessment in any answer combination tested (inferred: sold from its own product page, which was not opened, or chosen by the dermatologist after checkout). | docs |

## 5. Who gets what (12 patient profiles)

- **Man, 32, hairline + top, 1-3 years, family history yes, no method preference, no medical issues** → Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil, Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9) (default: Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil). Heading 'We Recommend Dutasteride + Minoxidil Rx'. Bundle card badged FASTEST RESULTS and '7/10 Customers Choose This Plan'. The service also returned the SuperCapsule alone (p2) but the page hides that card unless the method answer is Oral. No price on the screen. Replayed 23 Nov 2026 (runs/s2/baseline-men): same result; list price $89 + $89 = $178 per 25 days, only in the API data, not on screen. _[observed]_
- **Woman, 38, parting + all over, 1-3 years, able to become pregnant, on the pill, no medical issues** → Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil, Custom Topical: Minoxidil & Retinoic Acid (formula code TM3) (default: Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil). Heading 'We Recommend Minoxidil & Retinoic Acid Rx'. Active-ingredient panel lists spironolactone first. The service also returned the spironolactone SuperCapsule alone (p5), hidden unless the method answer is Oral. Replayed (runs/s2/base-women): same result; $59 + $89 = $148 per 25 days list. _[observed]_
- **Man, baseline, method = Oral** → Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil, SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2) (default: Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil). Dual pre-selected; second card SuperCapsule (dutasteride 0.5 mg, minoxidil 1.25 mg, D3). runs/s2/m-method-oral _[observed]_
- **Man, baseline, method = Topical** → Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil, Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9) (default: Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil). Same as baseline. runs/s2/m-method-topical _[observed]_
- **Woman under 50, method = Oral** → Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil, SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3) (default: Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil). Second card spironolactone SuperCapsule. runs/s2/w-method-oral _[observed]_
- **Woman under 50, method = Topical** → Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil, Custom Topical: Minoxidil & Retinoic Acid (formula code TM3) (default: Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil). Same as baseline woman. runs/s2/w-method-topical _[observed]_
- **Woman 50 or older (any method answer tested: not sure)** → Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil, Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9) (default: Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil). Gets the men's dutasteride set, even when she says she can become pregnant. runs/s2/w-50plus, w-50plus-full _[observed]_
- **Man who picks the Topical card** → Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9) (default: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9)). $89 per 25 days; three blood-pressure/check-up/weight questions skipped. runs/s2/m-choose-topical _[observed]_
- **Man (method Oral) who picks the SuperCapsule card** → SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2) (default: SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2)). $89 per 25 days. runs/s2/m-oral-choose-capsule _[observed]_
- **Anyone with a date of birth under 18** → nothing offered. Stopped on the date-of-birth page ("You must be over 18"). runs/s2/m-dob-under18 _[observed]_
- **Man with red flags (bald patches, scalp symptoms, heart condition, reaction to finasteride, pregnant partner who declines the risk, age 70, low blood pressure)** → Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil, Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9) (default: Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil). Identical to the baseline man in every case tested; flags go only to the dermatologist after checkout. _[observed]_
- **Woman 50 or older, method = Oral** → Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil, SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2) (default: Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil). Dutasteride set; capsule card second. runs/verify-w-50plus-oral _[observed]_

## 6. The consultation, question by question

### Standard assessment ('Get my custom plan'), men and women, current short version

Entry: https://www.form.happyhead.com/get-started/?l=false&ph=true

Welcome → 6 profile questions (goal, duration, family history, sex/age band, pattern, method) → summary → recommendation screen with product choice (no price shown) → 10 to 16 medical questions → email + mobile page (account wall, not passed) → checkout on my.happyhead.com → photos and ID after payment → dermatologist review.

**1. A Custom Hair Growth Plan in 2-3 Minutes — You're a few questions away from a solution with real results, made just for you.**  
_info · anonymous · role: marketing · shown: URL has ph=true (the START NOW link does) · BRANCHES · observed_  
Why they ask: Welcome screen with a phone-sales alternative.  
Downstream: Phone callback path needs a phone number.

- `GET MY CUSTOM PLAN` → **Next question**: Starts the questions. _[observed]_
- `Need help? Talk to a Hair Specialist` → **Marketing only**: Opens 'How can we contact you?' asking for a phone number for a callback ('Average Callback Time: 1-2 min'). Not used. _[observed]_

**2. What would you like to improve about your hair? — Understanding your concerns helps us personalize the most effective formula for you. Select all that apply.**  
_multi · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Goal question. It feeds the summary screen and analytics; the old 'how committed' field is sent to the doctor as '-'.

- `I want to regrow a receding hairline` → **Marketing only**: Saved and sent to analytics only. The code does not send it to the recommendation service. Seen live: runs/s2/baseline-men. _[observed]_
- `I want fuller, healthier-looking hair` → **Marketing only**: Saved and sent to analytics only. The code does not send it to the recommendation service. _[code]_
- `I want to prevent future hair loss` → **No effect**: No effect on the questions or the offer. Seen live: runs/s2/m-goal-prevent. _[observed]_
- `I'm just exploring my options` → **Marketing only**: Saved and sent to analytics only. The code does not send it to the recommendation service. _[code]_

**3. How long have you noticed changes in your hair?**  
_single · anonymous · role: data-capture · shown: always · no branch · observed_  
Why they ask: History for the clinician.

- `Less than 6 months` → **No effect**: Mapped onto the older three-band answer and passed to the dermatologist. No effect on the recommendation. _[code]_
- `6-12 months` → **No effect**: Mapped onto the older three-band answer and passed to the dermatologist. No effect on the recommendation. _[code]_
- `1-3 years` → **No effect**: Mapped onto the older three-band answer and passed to the dermatologist. No effect on the recommendation. _[code]_
- `More than 3 years` → **No effect**: Mapped onto the older three-band answer and passed to the dermatologist. No effect on the recommendation. _[code]_
- `I’m not sure` → **No effect**: Mapped onto the older three-band answer and passed to the dermatologist. No effect on the recommendation. _[code]_

**4. Does hair loss run in your family? — Hair loss is often genetic—and this helps us personalize your treatment.**  
_single · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Stated reason: 'understanding family history helps our dermatologists personalize your treatment plan'. In the code it appears only on the summary screen and in analytics, not in the order payload.

- `Yes` → **Marketing only**: Saved and sent to analytics only. The code does not send it to the recommendation service. Seen live: runs/s2/baseline-men. _[observed]_
- `No` → **No effect**: No effect on the questions or the offer. Seen live: runs/s2/m-family-no. _[observed]_
- `Not sure` → **Marketing only**: Saved and sent to analytics only. The code does not send it to the recommendation service. _[code]_

**5. Let’s tailor your treatment to your biology. Which option best describes you?**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The main product selector: sex and the under-50 / 50-plus split for women decide which drug family is offered.  
Downstream: Decides the product family; women also get pregnancy questions later.

- `Male` → **Switches product**: Recommendation service is called with gender Male and a made-up birth date 51 years ago. Result: dutasteride + minoxidil topical (p1), dutasteride SuperCapsule (p2) and the two together (p3). Heading 'We Recommend Dutasteride + Minoxidil Rx'. No pregnancy-ability questions. Seen live: runs/s2/baseline-men. _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil)_ _[observed]_
- `Female under 50` → **Switches product**: Service called with gender Female and a made-up birth date 19 years ago. Result: minoxidil-only topical (p4), spironolactone SuperCapsule (p5) and the two together (p6). Heading 'We Recommend Minoxidil & Retinoic Acid Rx'. Adds the pregnancy-ability questions. Later date of birth must give an age of 18 to 50 or the user is sent back. Seen live: runs/s2/base-women. _(affects: Custom Topical: Minoxidil & Retinoic Acid (formula code TM3), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3), Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil)_ _[observed]_
- `Female 50 or older` → **Switches product**: Switches the product family to the men's dutasteride set (topical dutasteride 0.3%/minoxidil 8% and the dutasteride capsule), heading "Dutasteride + Minoxidil". Seen live: runs/s2/w-50plus. Re-checked live in stage 3 (runs/verify-w-50plus-full); with method Oral she gets the dutasteride SuperCapsule card (runs/verify-w-50plus-oral). _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil)_ _[observed]_

**6. Where are you experiencing hair loss? — Select all that apply.**  
_multi · anonymous · role: diagnosis · shown: sex = male · BRANCHES · observed_  
Why they ask: Pattern for the clinician; patchy and unusual patterns are flagged as possible non-pattern hair loss.  
Downstream: 'Another pattern' adds a text box.

- `Thinning at the hairline` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Bald patches` → **No effect**: No effect on screen: no warning, same offer. Seen live: runs/s2/m-pattern-patches. _[observed]_
- `Thinning all over` → **No effect**: Stored under the key 'crown' and shown to the dermatologist as 'Thinning at the top of the head'. Not flagged. _[code]_
- `Another pattern of hair loss` → **Adds questions**: Adds a free-text page asking for more details. Offer unchanged. Seen live: runs/s2/m-pattern-other. _[observed]_
- `None, I'm trying to prevent hair loss` → **No effect**: Exclusive option. Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_

**7. Where on your head are you experiencing hair loss? — Select the options that apply to you best.**  
_multi · anonymous · role: diagnosis · shown: sex = female · BRANCHES · observed_  
Why they ask: Pattern for the clinician.  
Downstream: 'Another pattern' adds a text box.

- `Thinning at the hairline` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Thinning all over` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Thinning along my part` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Bald patches` → **Flags for the clinician**: Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `Another pattern of hair loss` → **Adds questions**: Adds a free-text question and is passed to the dermatologist marked 'important'. _[code]_
- `None, I'm trying to prevent hair loss` → **No effect**: Exclusive option. Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_

**8. Please provide more details about your hair loss**  
_text · anonymous · role: diagnosis · shown: 'Another pattern of hair loss' ticked · no branch · observed_  
Why they ask: Free text for the clinician (placeholder: 'Please describe where you are experiencing hair loss.').


**9. What’s your preferred method of taking medication?**  
_single · anonymous · role: product-selector · shown: not a product-specific consult · BRANCHES · observed_  
Why they ask: Chooses which single-product card sits next to the bundle. The bundle is always shown first and pre-selected, even for people who say 'Topical' or 'Oral'.  
Downstream: Changes the cards on the recommendation screen.

- `Topical (applied directly to the scalp)` → **No effect**: Second card is Topical; no visible difference from "not sure". Seen live: runs/s2/m-method-topical. _(affects: SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3))_ _[observed]_
- `Oral (ingested by mouth)` → **Switches product**: Second card becomes SuperCapsule instead of Topical; same products returned. Seen live: runs/s2/m-method-oral. _(affects: SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3), Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), Custom Topical: Minoxidil & Retinoic Acid (formula code TM3))_ _[observed]_
- `I’m not sure / I don’t have a preference` → **Removes a product**: Service is sent ['Oral','Topical']. Cards shown: Dual Treatment (first, pre-selected) and Topical. The capsule-only card is not shown. Seen live: runs/s2/baseline-men. _(affects: SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3))_ _[observed]_

**10. Here’s what we know about you so far (YOUR HAIR: goal, duration, pattern, method · LIFESTYLE: sex/age, family history)**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Plays the answers back before the recommendation.

- `TAKE ME TO MY PLAN` → **Next question**: Goes to four 3-second 'Building Your Personalized Treatment Plan' loading screens, then the recommendation. _[observed]_

**11. Building Your Personalized Treatment Plan — Our dermatologists use clinically backed ingredients to help target hair loss from multiple angles (then 'Reviewing Your Responses...', 'Matching Ingredients to Your Goals...')**  
_info · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Timed loading screens naming finasteride, minoxidil and dutasteride while the recommendation call runs.


**12. We Recommend {Dutasteride + Minoxidil Rx \| Minoxidil & Retinoic Acid Rx} — Dual Treatment delivers the best chance of regrowth.**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The product choice. Made before any medical question is asked. No price is shown on this screen.  
Downstream: Any plan with a capsule adds: When did you last see a doctor, blood pressure, weight.

- `CHOOSE DUAL TREATMENT` → **Adds questions**: Selects topical + SuperCapsule (two product ids). Adds three questions later: last doctor check-up, blood pressure, weight. Seen live: runs/s2/baseline-men. _(affects: Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil, Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil)_ _[observed]_
- `CHOOSE TOPICAL` → **Skips questions**: Plan becomes the topical alone and the check-up, blood-pressure and weight questions are skipped. Seen live: runs/s2/m-choose-topical. _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), Custom Topical: Minoxidil & Retinoic Acid (formula code TM3))_ _[observed]_
- `CHOOSE SUPERCAPSULE` → **Switches product**: Plan becomes the capsule alone; check-up, blood-pressure and weight questions are still asked. Seen live: runs/s2/m-oral-choose-capsule. _(affects: SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3))_ _[observed]_

**13. Medical Review — Next, we'll ask a few questions about your health history to ensure your treatment is safe and appropriate. Takes 2 min**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Three-second intro to the medical questions.


**14. Have you previously tried any of the following hair loss treatments?**  
_multi · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Treatment history. Stated reason: 'Previous treatments can provide important insight into your hair loss journey'.  
Downstream: Anything except 'None' adds the reactions question; 'Other' adds a text box.

- `Topical Minoxidil (Rogaine™)` → **Adds questions**: Adds the 'reactions' question. Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Topical Finasteride` → **Adds questions**: Adds the 'reactions' question. Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Oral Minoxidil` → **Adds questions**: Adds the 'reactions' question. Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Oral Finasteride (Propecia/Proscar™)` → **Adds questions**: Adds the "Did you have any reactions?" question. Offer unchanged. Seen live: runs/s2/m-prior-oralfin-reaction. _[observed]_
- `Other` → **Adds questions**: Adds a free-text question and the 'reactions' question; marked 'important' for the dermatologist. _[code]_
- `None of the above` → **Skips questions**: Exclusive option; goes straight on and skips the 'reactions' question. _[observed]_

**15. Please specify what other hair loss treatments you’ve used**  
_text · anonymous · role: personalisation · shown: 'Other' ticked in previous treatments · no branch · code_  
Why they ask: Free text for the clinician.


**16. Did you have any reactions to these treatments?**  
_single · anonymous · role: safety-screen · shown: any previous treatment ticked · BRANCHES · observed_  
Why they ask: Side-effect history; the main route by which a formula gets weakened or an ingredient removed.  
Downstream: 'Yes' needs a written explanation.

- `Yes` → **Flags for the clinician**: Opens a text box for details; flagged for the clinician (code). Dutasteride stays in the plan. Seen live: runs/s2/m-prior-oralfin-reaction. _[observed]_
- `No` → **Next question**: Goes on. _[code]_

**17. Do you have any of these unusual symptoms that may disqualify you for treatment? — Your honest responses help our dermatologists safely determine the most suitable hair growth formulation for you.**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Red-flag screen for scarring, inflammatory or autoimmune hair loss. Despite the word 'disqualify', the quiz itself never stops anyone here.  
Downstream: Any symptom adds a text box.

- `Severe itching, burning, or rash on my scalp` → **Adds questions**: Adds a free-text details page; no warning or stop. Flagged for the clinician (code). Seen live: runs/s2/m-symptoms-itch. _[observed]_
- `Severe pain, pimples, pus, bumps, or sores on my scalp` → **Adds questions**: Adds a required free-text question. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `Loss of brows, lashes, facial, or body hair` → **Adds questions**: Adds a required free-text question. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `None of the above` → **Next question**: Exclusive option; goes on. _[observed]_

**18. Please provide more details about your symptoms.**  
_text · anonymous · role: safety-screen · shown: any unusual symptom ticked · no branch · observed_  
Why they ask: Placeholder: 'Your doctor will evaluate you symptoms and may disqualify you from treatment. Please describe your symptoms in more detail.'


**19. Do you currently have the ability to become pregnant? — To keep you safe, we avoid ingredients that aren't pregnancy-safe. This helps us tailor your treatment responsibly.**  
_single · anonymous · role: safety-screen · shown: sex = female · BRANCHES · observed_  
Why they ask: Pregnancy-risk screen for women (asked of women of any age band).  
Downstream: Yes → birth control; No → reason.

- `Yes` → **Adds questions**: Adds the birth-control question. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. Seen live: runs/s2/base-women. _[observed]_
- `No` → **Adds questions**: Shows "Please specify why you cannot become pregnant" instead of the birth-control question. Offer unchanged. Seen live: runs/s2/w-preg-no-postmeno. _[observed]_

**20. Are you currently using any form of birth control?**  
_multi · anonymous · role: safety-screen · shown: female and able to become pregnant · BRANCHES · observed_  
Why they ask: Contraception check for women who can become pregnant.  
Downstream: 'Other' adds a text box.

- `Oral contraceptives` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[observed]_
- `IUD` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Condoms` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Other birth control method` → **Adds questions**: Opens a required text box. Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `None of the above` → **Flags for the clinician**: Seen live (runs/verify-w-bc-none): no warning, no stop; the spironolactone capsule and minoxidil topical stay in the plan (product_ids 287244,68633). Passed to the dermatologist marked 'important' (code). _[observed]_

**21. Please specify why you cannot become pregnant: — This helps our doctors safely determine if certain medications (e.g., Finasteride, Dutasteride, or Retinoic Acid) are appropriate and medically safe for your specific circumstances.**  
_single · anonymous · role: safety-screen · shown: female and not able to become pregnant · BRANCHES · observed_  
Why they ask: Lets the doctor decide whether finasteride, dutasteride or retinoic acid can be used in a woman.  
Downstream: 'Other reason' adds a text box.

- `I am post menopausal` → **Flags for the clinician**: Recorded only; offer unchanged (still spironolactone set for a woman who chose "under 50"). Seen live: runs/s2/w-preg-no-postmeno. _[observed]_
- `I have had a surgical procedure` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `My partner has had a vasectomy` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Other reason` → **Adds questions**: Opens a required text box. Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_

**22. Is anyone in your household currently pregnant, breastfeeding, or actively trying to get pregnant? — Some ingredients aren’t recommended during pregnancy to protect both you and your family’s health.**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Pregnancy exposure screen, asked of everyone (for a woman it also covers herself).  
Downstream: 'Yes' adds a risk-acceptance screen.

- `Yes` → **Adds questions**: Adds the partner-pregnancy safety screen (finasteride/dutasteride risk). Flagged critical for the clinician (code). Seen live: runs/s2/m-household-yes-decline. Also shown to a woman under 50 whose plan has no finasteride or dutasteride (runs/verify-w-household-yes): the screen is not tied to the plan. _[observed]_
- `No` → **Next question**: Goes on. _[observed]_

**23. IMPORTANT SAFETY INFORMATION — Finasteride & Dutasteride: Partner Pregnancy Risk**  
_consent · anonymous · role: consent · shown: household pregnancy = Yes · no branch · observed_  
Why they ask: Risk acceptance. This matches the 'warning, do you want to continue?' screen described by NCOA's tester.

- `Yes, I accept these risks and would like to be prescribed Finasteride and/or Dutasteride if considered appropriate by my physician.` → **Flags for the clinician**: Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `No, I do not accept these risks and do not want to be prescribed Finasteride and/or Dutasteride.` → **Flags for the clinician**: Recorded only. The quiz carries on and the dutasteride topical and capsule stay in the plan; any change is left to the dermatologist. Seen live: runs/s2/m-household-yes-decline. _[observed]_

**24. Are you taking any medications?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Interaction check, free text only (no drug list).  
Downstream: 'Yes' adds a text box.

- `Yes` → **Adds questions**: Opens a required text box ('It is important that you list the names/doses of all medications, so your doctor can evaluate if there are any concerning interactions with your requested hair loss treatment.'). Not flagged in the payload. _[code]_
- `No` → **Next question**: Goes on. _[observed]_

**25. Do you have any allergies? — Your allergy information ensures we create a formula that's safe and customized for you.**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Allergy check, free text only.  
Downstream: 'Yes' adds a text box.

- `Yes` → **Adds questions**: Opens a required text box ('Please list your medication allergies here.'). Not flagged in the payload. _[code]_
- `No` → **Next question**: Goes on. _[observed]_

**26. When did you last see a doctor for a check-up?**  
_single · anonymous · role: safety-screen · shown: chosen plan includes a SuperCapsule (or a product-specific consult for a listed oral product id) · no branch · observed_  
Why they ask: Asked only when the plan includes a capsule (oral minoxidil).  
Downstream:  Seen live: shown for Dual and SuperCapsule plans, skipped for Topical only (runs/s2/m-choose-topical).

- `Within the last year` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[observed]_
- `Within the last 2 years` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Within the last 3-5 years` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Over 5 years ago` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_

**27. What is your most recent blood pressure reading?**  
_single · anonymous · role: safety-screen · shown: chosen plan includes a SuperCapsule · no branch · observed_  
Why they ask: Oral minoxidil lowers blood pressure, so only low blood pressure is marked critical.  
Downstream:  Seen live: shown for Dual and SuperCapsule plans, skipped for Topical only (runs/s2/m-choose-topical).

- `Low (Below 100 / 65)` → **Flags for the clinician**: Seen live (runs/verify-m-bp-low): no warning and no stop; the oral minoxidil capsule stays in the plan. Passed to the dermatologist marked 'critical' (code: raw/backend-payload-code.txt). _[observed]_
- `Normal (Around 120 / 80)` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[observed]_
- `Mildly Elevated (Around 140 / 90)` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. (Note: not flagged in the code.) _[code]_
- `High (Around 150 / 100)` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. (Note: not flagged in the code.) _[code]_

**28. What is your current weight?**  
_single · anonymous · role: safety-screen · shown: chosen plan includes a SuperCapsule · no branch · observed_  
Why they ask: Dose context for oral treatment.  
Downstream:  Seen live: shown for Dual and SuperCapsule plans, skipped for Topical only (runs/s2/m-choose-topical).

- `<100 pounds (<45kg)` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `100-200 pounds (45kg - 90kg)` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[observed]_
- `>200 pounds (>90kg)` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_

**29. Have you ever been diagnosed with any of the following health conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Medical history. Every condition is treated the same way by the quiz: flagged for the dermatologist, never a stop.  
Downstream: Any condition adds a text box.

- `None` → **Next question**: Exclusive option; goes on. Seen live: runs/s2/baseline-men. _[observed]_
- `Heart condition (e.g., high/low blood pressure, heart failure, abnormal heart rate/EKG, pericarditis)` → **Adds questions**: Adds a free-text page for details. Oral minoxidil stays in the plan; flagged for the clinician (code). Seen live: runs/s2/m-cond-heart. _[observed]_
- `Vascular disease (e.g., stroke, blood clots, uncontrolled lower leg swelling)` → **Adds questions**: Adds a required free-text question about diagnoses and treatments. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `Cancer (e.g. prostrate, breast cancer)` → **Adds questions**: Adds a required free-text question about diagnoses and treatments. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `Sexual Dysfunction (e.g. erectile dysfunction, low libido)` → **Adds questions**: Adds a required free-text question about diagnoses and treatments. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `Kidney disease` → **Adds questions**: Adds a required free-text question about diagnoses and treatments. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `Liver disease (e.g. cirrhosis)` → **Adds questions**: Adds a required free-text question about diagnoses and treatments. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `Eye disease (e.g. glaucoma, uveitis)` → **Adds questions**: Adds a required free-text question about diagnoses and treatments. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `Endocrine disease (e.g. thyroid disease, pheochromocytoma)` → **Adds questions**: Adds a required free-text question about diagnoses and treatments. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `Mental health conditions (e.g. depression, mood disorders)` → **Adds questions**: Adds a required free-text question about diagnoses and treatments. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `Other medical conditions` → **Adds questions**: Adds a required free-text question about diagnoses and treatments. Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_

**30. Please provide additional details on your diagnoses and treatments — Include whether your condition is well controlled, date of last check-up, and if your PCP or other specialist has given you any restrictions based on your conditions.**  
_text · anonymous · role: safety-screen · shown: any health condition ticked · no branch · observed_  
Why they ask: Free text for the clinician.


**31. What is your date of birth? — We customize your hair growth formula based on your age to ensure the most effective and safe treatment. For example, certain ingredients are specifically tailored for customers over 50.**  
_date · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Real age check (year, month, day pickers). Men of any adult age pass: there is no upper age limit and no check for men aged 18 to 21 or over 65 in the code.  
Downstream: Under 18 is blocked; a woman's age must match her band.

- `Age 18 or over, matching the age band chosen earlier` → **Next question**: Carries on. No upper age limit (a 70-year-old man is treated like the baseline). Seen live: runs/s2/m-dob-70. _[observed]_
- `Under 18` → **Stops the patient**: "You must be over 18" and no NEXT button: the only hard stop. Seen live: runs/s2/m-dob-under18. _[observed]_
- `Woman whose age does not match the band she picked (under 50 vs 50 or older)` → **Shows a warning**: Sent back to the sex/age-band page with a discrepancy message. Seen live: runs/s2/w-dob-mismatch. _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil, Custom Topical: Minoxidil & Retinoic Acid (formula code TM3), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3), Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil)_ _[observed]_

**32. Do you have any customization requests?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Lets the patient ask for a different strength or for an ingredient to be removed or added. This free-text box is how the 'custom' formula is actually set.  
Downstream: 'Yes' adds a text box and one more question.

- `Yes, I have a customization request` → **Adds questions**: Opens a text box and adds "Is there anything else you would like to share with your doctor". Offer unchanged; text goes to the doctor. Seen live: runs/s2/m-custom-yes. _[observed]_
- `No, let the doctor customize it for me (Recommended)` → **Next question**: Goes to the email page. Seen live: runs/s2/baseline-men. _[observed]_

**33. Is there anything else you would like to share with your doctor about hair loss? — Feel free to ask about any medical problems not already discussed or include anything else you would like the doctor to know.**  
_text · anonymous · role: data-capture · shown: customisation request = Yes · no branch · observed_  
Why they ask: Free text (default value 'None'; placeholder: 'If nothing else, please write “none” to confirm.'). Always marked 'important' in the payload.


**34. BLACK FRIDAY SALE, Up to 60% Off, Plus, FREE Dermaroller (23 Nov 2026). Split test: 'Email' + 'Mobile Number' (sms_capture) or 'Email Address*' only. 'By checking this box you agree to our Terms, Privacy Policy, Drug Safety, Telehealth Consent, and MDI Telehealth Consent.'**  
_contact · anonymous · role: identity · shown: always; at the end, or straight after 'Take Me to My Plan' in the early_capture split-test arm (runs/verify-base-women) · no branch · observed_  
Why they ask: THE ACCOUNT WALL. Needs an email (and in one test arm a US mobile number) and the consent tick. In the early_capture arm it appears before the recommendation screen. Submitting posts every answer to Happy Head's backend and leads to checkout. Not filled in.


**35. Subscribe & save 20% or one time purchase?**  
_single · checkout · role: product-selector · shown: URL has ot=var1 · no branch · code_  
Why they ask: Subscription or single purchase. Only shown in a test variant.

- `Subscription & Save 20%` → **No effect**: Uses the subscription product ids ('20% Off every order', 'Free Shipping', 'Plus additional discount on your first order', 'Automatic Refills. Cancel Anytime.'). _[code]_
- `One-Time Purchase` → **No effect**: Switches to the one-time product ids ('Standard pricing. No automatic refills.'). _[code]_

**36. BLACK FRIDAY DEALS — Lock in lifetime discounts this Black Friday, including FREE gifts on select plans.**  
_single · checkout · role: product-selector · shown: URL has s_p=a1 or s_p=b1 · no branch · code_  
Why they ask: Plan-length page that exists in the code for two price tests. Not shown in the standard walk.

- `1-Month Plan (10% off: $80/mo single product, $160/mo bundle; women under 50 $53 or $133)` → **No effect**: Sets the billing period. _[code]_
- `3-Month Plan (15% off + free supplements, or 20% off: $76 or $71 single, $151 or $142 bundle; women under 50 $47, $126 or $118)` → **No effect**: Sets the billing period. _[code]_
- `5-Month Plan (25% off + free supplements, or 30% off: $67 or $62 single, $134 or $125 bundle; women under 50 $41, $111 or $104)` → **No effect**: Sets the billing period. _[code]_

**37. you're all done — Proceeding to Secure Checkout — Our dermatologists will review your profile to ensure your treatment is right for you.**  
_info · checkout · role: expectation-setting · shown: after the email page · no branch · code_  
Why they ask: Redirects to my.happyhead.com/hh-checkout with the chosen product ids. Not reached.


**38. After checkout: upload photos of your hair; in some cases a photo ID and/or a 5-second video**  
_photo · after-account · role: identity · shown: after payment · no branch · docs_  
Why they ask: Identity and clinical evidence for the dermatologist (help centre). Sent through the account page, a web form or by text.


### Older landing-page assessment (same flow file, URL without l=false)

Entry: https://www.form.happyhead.com/get-started/

Landing page → sex → (women) age range → duration → pattern → commitment → method → recommendation → the same medical questions, date of birth, customisation and email page as the standard assessment. Read from code only; not walked.

**1. Landing page before the questions (three versions in the code: category page, 'bot' page, 'emotional survey' page). The survey version asks: 'How confident do you feel about the way your hair looks?' (Very confident / Kinda confident / I dislike it), 'How long have you been feeling this way?' (Over 6 months / The past few months / Recently), 'Have you tried a customized prescription hair growth treatment?' (Yes, I have / I’ve researched but haven’t tried / No, I'd like to learn more)**  
_info · anonymous · role: marketing · shown: URL without l=false (survey version: lpvar=top3) · no branch · code_  
Why they ask: Marketing landing pages; the three survey answers only fire analytics events.


**2. To start, what was your sex assigned at birth?**  
_single · anonymous · role: product-selector · shown: URL without l=false · BRANCHES · code_  
Why they ask: Sex, asked first in the older question set.  
Downstream: Female adds the age range.

- `Male` → **Switches product**: Men's products (dutasteride family). Skips the age-band question. _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil)_ _[code]_
- `Female` → **Adds questions**: Adds the age-range question. _[code]_

**3. What’s your age range? — We customize your hair growth formula based on your age to ensure the most effective and safe treatment. (MORE INFO: 'Women under age 50 are not eligible for Finasteride or Dutasteride. We offer Spironolactone and Minoxidil instead.')**  
_single · anonymous · role: product-selector · shown: female, older question set · BRANCHES · code_  
Why they ask: Women's age band; the same under-50 / 50-plus rule as the current version, with four bands.  
Downstream: Under 50 vs 50+ switches the drug family.

- `18 - 29` → **Switches product**: Female under 50: minoxidil topical and spironolactone capsule. _(affects: Custom Topical: Minoxidil & Retinoic Acid (formula code TM3), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3), Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil)_ _[code]_
- `30 - 39` → **Switches product**: Female under 50: minoxidil topical and spironolactone capsule. _(affects: Custom Topical: Minoxidil & Retinoic Acid (formula code TM3), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3), Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil)_ _[code]_
- `40 - 49` → **Switches product**: Female under 50: minoxidil topical and spironolactone capsule. _(affects: Custom Topical: Minoxidil & Retinoic Acid (formula code TM3), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3), Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil)_ _[code]_
- `50+` → **Switches product**: Treated like a man for product choice (dutasteride family cards). _(affects: Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9), SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2), Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil)_ _[code]_

**4. How long have you been experiencing hair loss?**  
_single · anonymous · role: data-capture · shown: older question set · no branch · code_  
Why they ask: History for the clinician.

- `Less than 6 months` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `6 months to 2 years` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Over 2 years` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_

**5. Where on your head are you experiencing hair loss? — Select the options that apply to you best.**  
_multi · anonymous · role: diagnosis · shown: male, older question set · BRANCHES · code_  
Why they ask: Same as the current version; only the third label differs.  
Downstream: 'Another pattern' adds a text box.

- `Thinning at the hairline` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Bald patches` → **Flags for the clinician**: Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen. _[code]_
- `Thinning at the top of the head` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Another pattern of hair loss` → **Adds questions**: Adds a text box; marked 'important'. _[code]_
- `None, I'm trying to prevent hair loss` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_

**6. How committed are you to hair growth?**  
_single · anonymous · role: marketing · shown: older question set · no branch · code_  
Why they ask: Sales-intent question; sent to the doctor but not used by the recommendation call.

- `Just exploring my options` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `Committed but not in a rush` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_
- `I want results as quickly as possible` → **No effect**: Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation. _[code]_

### Product-specific consult (from a product page's own button)

Entry: https://www.form.happyhead.com/get-started/?consult=true&pid=<product id>

Intro → sex → (women) age range → duration → pattern → commitment → no method question and no recommendation screen → the same medical questions → date of birth → customisation → email page. Read from code only; the product pages on www.happyhead.com that link here were not opened, so the exact links are not confirmed.

**1. We'll be asking a few questions for your dermatologist consultation.**  
_info · anonymous · role: expectation-setting · shown: URL has consult=true · no branch · code_  
Why they ask: Intro for a product-specific consult.

- `NEXT` → **Next question**: Starts the questions. _[code]_

**2. Product already chosen on a product page (passed as pid in the URL)**  
_info · anonymous · role: product-selector · shown: URL has consult=true · BRANCHES · code_  
Why they ask: In a product-specific consult the method question and the recommendation screen are skipped; the product is fixed by the page the person came from, then corrected for sex and age.  
Downstream: Sex and age can swap the product.

- `Man arriving with a women-under-50 product id (e.g. the spironolactone SuperCapsule, id 287244)` → **Switches product**: The code swaps it for a men's product id (287244 → 230910; 260068 → 110425; 16268 → 14275) and the thank-you page says 'Based on your age and gender, we've tailored your selection to best suit your needs.' _(affects: SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3))_ _[code]_
- `Woman under 50 arriving with a men's product id` → **Switches product**: The code swaps it for a women-under-50 id (110425 → 68633, the minoxidil topical; 230910 → 287244, the spironolactone SuperCapsule; 15313 and 3131341 → 68633; 287362 → 383783; 14275, 138137, 107497, 14296, 96732 or 94152 → 1330569). _(affects: Custom Topical: Minoxidil & Retinoic Acid (formula code TM3), SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3))_ _[code]_
- `Woman 50 or older arriving with product id 110425` → **Switches product**: Swapped to id 68611 (product name not identified). _[code]_
- `Any other case` → **No effect**: The chosen product id is kept. _[code]_

**3. When did you last see a doctor for a check-up? · What is your most recent blood pressure reading? · What is your current weight?**  
_info · anonymous · role: safety-screen · shown: consult=true and pid on the list · no branch · code_  
Why they ask: The three capsule questions are asked only if the product id is on a list of about 38 ids in the code (oral and dutasteride products).


**4. Dandruff wording set: 'How long have you been experiencing dandruff and/or scalp irritation?', 'Where on your head are you experiencing dandruff and/or scalp irritation?' (Scalp (top of head) / Hairline and temples / Back of head / All over / None of the above, I’m looking to maintain a healthier scalp), 'How committed are you to treating your dandruff and/or scalp irritation?'**  
_info · anonymous · role: diagnosis · shown: consult=true and pid is one of 5016601, 5016643, 5016669, 5016675 · no branch · code_  
Why they ask: Same quiz reused for the dandruff prescription.


## 7. Competitive read

**Strengths**

- Very short path to a named plan: six profile questions, then a clear two-card choice with a "best for" line on each.
- Leads with dutasteride and 8% minoxidil, stronger than most rivals' first offer, and explains each ingredient.
- A clear age rule for women: no finasteride or dutasteride for women who say they are under 50, and a date-of-birth check that sends a mismatched woman back.
- Branching follow-ups capture detail where it matters (free text for symptoms, conditions, other patterns, reactions; a written partner-pregnancy consent).
- Asks blood pressure, weight and last check-up only when an oral capsule is chosen, keeping the topical path short.
- A customisation box lets the patient ask the doctor to change the formula.

**Weaknesses**

- The product is chosen before any safety question, and the most intensive plan (dutasteride + oral minoxidil) is pre-selected for every man, even "just exploring" or "prevention only".
- Red flags do nothing on screen: bald patches, severe scalp symptoms ("may disqualify you"), heart disease with oral minoxidil, a reaction to finasteride, all leave the plan unchanged.
- A pregnant partner who declines finasteride/dutasteride still has dutasteride in the plan; a woman 50+ who can become pregnant is offered dutasteride with no warning.
- Goal, duration, family history and hair-loss pattern are asked "to personalise" but change nothing.
- Age comes from a self-chosen band; the real birth date is asked only at the end and does not change the product. No upper age limit.
- No price on the recommendation screen; price appears only after email and mobile number.
- Finasteride, the usual first-line drug, is never offered by the assessment.

**Gaps a new competitor could use**

- Ask safety questions first and let them shape the offer: remove oral minoxidil for heart disease or low blood pressure, drop 5-alpha-reductase inhibitors when the patient declines them, refer patchy loss or scarring signs.
- Use goal, pattern and duration to offer a gentler start (topical only, finasteride) to "prevention" or "exploring" patients.
- Offer finasteride as first line with a plain comparison against dutasteride.
- Show the price on the recommendation screen before asking for contact details.
- Use the actual date of birth (not a band) and handle older adults and post-menopausal women under 50 explicitly.
- Ask about women's specific causes (iron, thyroid, PCOS, recent childbirth or illness), which this quiz does not ask.

## 8. Experiments run (37)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| baseline-men | main | none: baseline man replayed (pinned start URL) | Still works. Ends on the email + mobile page (account wall). Offer: Dual Treatment (p3) pre-selected + Topical (p1); recommendation call returned p1, p2 and the bundle; $89 + $89 list. 0 consultation posts. |
| base-women | main | none: baseline woman replayed | Still works. Ends on the email page. Offer: Dual Treatment (p6: minoxidil 6% topical + spironolactone 25 mg capsule) + Topical (p4); $59 + $89 list. |
| m-method-oral | main | m-method: Not sure -> Oral | Same products returned (call sends only "Oral"); second card becomes CHOOSE SUPERCAPSULE (p2) instead of Topical; capsule group listed first. |
| m-method-topical | main | m-method: Not sure -> Topical | No visible change against baseline: Dual + Topical cards; call sends only "Topical". |
| w-method-oral | main | m-method (woman): Not sure -> Oral | Second card becomes CHOOSE SUPERCAPSULE (spironolactone p5). Same products returned. |
| w-method-topical | main | m-method (woman): Not sure -> Topical | No visible change: Dual (p6) + Topical (p4). |
| w-50plus | main | m-sexage: Female under 50 -> Female 50 or older | Product family switches to the men's set: heading "Dutasteride + Minoxidil", Dual (dutasteride topical + dutasteride capsule) + Topical dutasteride 0.3%/minoxidil 8%. The call sends gender Female with a birth date 51 years ago. |
| w-50plus-full | main | m-sexage: Female 50 or older, birth year 1970 to match, rest as baseline | Full walk to the email page. Still asked "able to become pregnant?" and birth control. Plan stays dutasteride (product_ids 116443, 274216). No warning about dutasteride and pregnancy for a woman who says she can become pregnant. |
| m-goal-prevent | main | m-goals: regrow hairline -> I want to prevent future hair loss | No change: same call, same Dual dutasteride offer. |
| m-family-no | main | m-family: Yes -> No | No change: same call, same offer. |
| m-pattern-patches | main | m-pattern-male: + Bald patches | No change and no warning (patchy loss is a possible alopecia areata sign): same Dual dutasteride offer. |
| m-pattern-other | main | m-pattern-male: + Another pattern of hair loss | One extra page "Please provide more details about your hair loss" (free text, answered neutrally). Offer unchanged. |
| m-choose-topical | main | m-reco: Dual Treatment -> Topical (two clicks) | Check-up, blood pressure and weight pages disappear (3 fewer questions). Plan = topical dutasteride only (product_ids 116443, $89). |
| m-oral-choose-capsule | main | m-method Oral, then m-reco: SuperCapsule only | Plan = dutasteride/minoxidil SuperCapsule only (product_ids 274216, $89). Check-up, blood pressure and weight still asked. |
| m-household-yes-decline | main | m-household-preg: No -> Yes, then "No, I do not accept these risks" | Partner-pregnancy safety screen shown. After declining finasteride/dutasteride the quiz carries on and the plan still holds the dutasteride topical and capsule (product_ids unchanged). No warning, no switch. |
| m-dob-under18 | main | m-dob: 1994 -> 2010 (age 16) | Hard stop: "You must be over 18" appears and the NEXT button is removed. The product had already been recommended earlier in the quiz. |
| m-dob-70 | main | m-dob: 1994 -> 1956 (age 70) | No change and no message: no upper age limit, oral minoxidil and dutasteride stay in the plan. |
| w-dob-mismatch | main | m-dob (woman under 50): 1988 -> 1970 (age 56) | Sent back to the "Which option best describes you?" page with "There is a discrepancy between your date of birth and the selected age range. Please review it and try again." |
| m-symptoms-itch | main | m-symptoms: None -> Severe itching, burning, or rash on my scalp | One extra free-text page "Please provide more details about your symptoms." No warning or stop although the question says these "may disqualify you". Plan unchanged. |
| m-cond-heart | main | m-conditions: None -> Heart condition | One extra free-text page "Please provide additional details on your diagnoses and treatments". Oral minoxidil capsule stays in the plan; no warning. |
| w-preg-no-postmeno | main | m-preg-ability: Yes -> No, then "I am post menopausal" | Birth-control page replaced by the "why can you not become pregnant" page. Plan unchanged (still spironolactone + minoxidil, not dutasteride, although she is post-menopausal and under 50). |
| m-prior-oralfin-reaction | main | m-prior: None -> Oral Finasteride, then m-reactions: Yes (free text) | Reactions page and a text box appear. Plan unchanged: dutasteride (same drug class as finasteride) stays. |
| m-custom-yes | main | m-custom: No -> Yes (text asks for finasteride instead of dutasteride) | Text box plus one extra page "Is there anything else you would like to share with your doctor". Plan unchanged; the request is only passed to the doctor. |
| verify-base-men | main | none: baseline man replayed fresh (plain start URL) | Same recommendation (Dual dutasteride set, $89 + $89). Ended on an email-only wall (no mobile field): split test. |
| verify-base-women | main | none: baseline woman replayed fresh (plain start URL) | Redirected to the early_capture arm: the email wall came before the recommendation screen. Recommendation call (spironolactone + minoxidil 6% topical) was still made. |
| verify-base-women-pinned | main | none: baseline woman on the sms_capture URL | Same as recorded: Dual minoxidil 6% topical TM3 ($59) + spironolactone SuperCapsule SC3 ($89); email + mobile wall at the end. |
| verify-w-50plus-full | main | re-test of R3 (Female 50 or older, birth year 1970) | Confirmed: dutasteride set. |
| verify-m-dob-under18 | main | re-test of R7 (birth year 2010) | Confirmed: 'You must be over 18', no NEXT button. |
| verify-w-dob-mismatch | main | re-test of R8 (woman under 50, birth year 1970) | Confirmed: sent back to the sex/age page with the discrepancy message. |
| verify-m-household-yes-decline | main | re-test of R11 | Confirmed: risk screen shown; after 'No, I do not accept' the plan still holds dutasteride (product_ids 116443,274216). |
| verify-m-cond-heart | main | re-test of R15 | Confirmed: one free-text page; plan unchanged. |
| verify-m-choose-topical | main | re-test of R12 | Confirmed: check-up, blood-pressure and weight pages skipped; product_ids 116443. |
| verify-m-method-oral | main | re-test of R4 (man, Oral) | Confirmed: second card SuperCapsule; service sent ['Oral']. |
| verify-w-50plus-oral | main | NEW: Female 50 or older + method Oral | Dual dutasteride set first, then the dutasteride SuperCapsule card. |
| verify-w-bc-none | main | NEW: woman birth control Oral contraceptives -> None of the above | No warning; spironolactone capsule stays. |
| verify-w-household-yes | main | NEW: woman household pregnancy No -> Yes | Finasteride/dutasteride partner-risk screen shown to a woman on a spironolactone plan (run stopped on that screen). |
| verify-m-bp-low | main | NEW: man blood pressure Normal -> Low | No change; oral minoxidil stays. |

## 9. Independent verification

The core finding holds up well. Every high-impact rule re-tested live (stops, product family by sex and age band, card swap by method, topical-only skipping the blood-pressure questions, medical answers never changing the plan) reproduced exactly, and the served code agrees. The one real error was the account wall: it is a split test, and in one arm it comes before the recommendation is shown. Facts about the six products the quiz returns are reliable (live API data). Facts about the rest of the catalogue are weaker: they rest on help-centre text, third-party reviews and search summaries because the marketing site's robots.txt bars this agent, and one stage 2 price was out of date. Treat the engine logic as high confidence and the wider catalogue prices as rough.

**Re-checked**

- Baseline man replayed fresh (runs/verify-base-men): same Dual dutasteride recommendation, same prices; wall was email-only, not email + mobile.
- Baseline woman replayed fresh twice: plain URL went to the early_capture arm with the wall before the recommendation (runs/verify-base-women); pinned sms_capture URL matched the record exactly (runs/verify-base-women-pinned).
- R3 woman 50+ gets the dutasteride set: confirmed (runs/verify-w-50plus-full).
- R4 method Oral swaps the second card to SuperCapsule: confirmed (runs/verify-m-method-oral).
- R7 under-18 hard stop: confirmed (runs/verify-m-dob-under18).
- R8 woman birth date out of band sends her back: confirmed (runs/verify-w-dob-mismatch).
- R11 declining the partner-pregnancy risk keeps dutasteride: confirmed (runs/verify-m-household-yes-decline).
- R12/R6 choosing Topical skips check-up, blood pressure and weight: confirmed (runs/verify-m-choose-topical).
- R15 heart condition adds a text page only: confirmed (runs/verify-m-cond-heart).
- R9 clinician flags: re-read raw/backend-payload-code.txt; the four critical options and 23 important options match the rule.
- Products checked against live recommendation data: p1, p2, p4, p5 (names, formulas, strengths, $89/$59 and 3- and 5-bottle prices) and p3, p6 (sums); all confirmed.
- Products checked by web search of happyhead.com pages (pages not opened, robots.txt): p7 (strengths confirmed, price corrected), p8 (conflict found), p14 (price not confirmed), p16 (melatonin strength added).
- Every run folder named as proof in rules and experiments exists.

**Corrected**

- Account wall: was 'email + US mobile after all questions'. It is a split test; one arm is email-only and one puts the wall before the recommendation screen (new rule R26).
- R8 effectType product-switched -> soft-warning (the woman is sent back; no product changes).
- R4 effectType product-removed -> product-switched (a card is swapped).
- coverageNote said Female 50+ and Oral were not tested live; they were (stage 2 and stage 3).
- p7 price: finvsfin's 2025 figure replaced by the product page's $79 / $63.20 (search summary).
- p8 actives: two versions (dutasteride or finasteride with tadalafil) noted as unverified.
- m-medintro evidence code -> observed (it shows in every run).
- Added rules R22 to R26 and 14 stage 3 experiments; low blood pressure and no-birth-control options upgraded to observed.

**Still unverified**

- All product facts outside the six products the quiz returns (p7 to p34): prices and strengths come from help-centre articles, third-party reviews or search summaries, not from opened product pages.
- What happens after the email wall: dermatologist decisions, final checkout prices and discounts.
- URL variants (problends, ot, s_p, upgrade, consult) were read in code only.
- Options never replayed (read in code only): most health conditions other than heart, medicines yes, allergies yes, other symptom types, duration answers, the accept answer on the risk screen. Code says none changes the product.
- How the split test is assigned (share of visitors in each arm).

## 10. Limits of this report

- Product pages on www.happyhead.com were not read (robots.txt closes them to this agent). Prices and strengths for products outside the two baseline recommendations come from the help centre and from third-party reviews of different dates, and may be out of date.
- The recommendation service's own rules are on the server. Only its inputs (sex, a made-up birth date from the age band, method, product ids) and two outputs were seen.
- Nothing after the email page was seen: checkout prices, discounts, photo upload, identity check, and what the dermatologist changes or refuses.
- The flow title contains the word 'Test' and the code holds several price and layout experiments, so screens can differ between visitors and over time.
- State-by-state availability in the US was not found.
- 21 one-change experiments plus the two baselines were run live (runs/s2/). Not tested live: goal "exploring", durations other than 1-3 years, family history "not sure", the other scalp symptoms and health conditions one by one, low/high blood pressure, weight bands, medicines and allergies "Yes", other birth-control answers, "accept" on the partner-pregnancy screen, the women's pattern options other than baseline, and all URL variants (problends, ot, s_p, upgrade, coupon, consult). Their effects come from the served quiz code, which shows none of them change the product.
- The recommendation service is on the server: only its inputs and outputs were seen. A woman 50+ with method Oral was not walked.
- Nothing after the email page (account wall) was seen: what the dermatologist changes, checkout prices and discounts are not observed.
- Stage 3 checked non-quiz products only through web-search summaries; prices there may be promotional and change often.

## 11. Sources

- [Quiz definition (Embeddables flow 'Happy Head - Primary Flow - Test', version 141), fetched by the assessment page](https://engine.embeddables.com/init (flow_d02099468c5fg664dh31b7cg); saved as quiz-definition.json)
- [Standard assessment (walked live)](https://www.form.happyhead.com/get-started/?l=false&ph=true)
- [robots.txt of the marketing site (blocks Claude agents)](https://www.happyhead.com/robots.txt)
- [robots.txt of the assessment host (open to all)](https://www.form.happyhead.com/robots.txt)
- [Help centre: What medications does Happy Head offer?](https://happyhead.zendesk.com/hc/en-us/articles/16254069704983-What-medications-does-Happy-Head-offer)
- [Help centre: Which of your hair growth solutions are customizable?](https://happyhead.zendesk.com/hc/en-us/articles/17624946350743-Which-of-your-hair-growth-solutions-are-customizable)
- [Help centre: About Happy Head's pricing ($59–$119 a month typical; $24–$119 range)](https://happyhead.zendesk.com/hc/en-us/articles/31042509646871-About-Happy-Head-s-pricing)
- [Help centre: What is the ordering process for Happy Head?](https://happyhead.zendesk.com/hc/en-us/articles/4402321888535-What-is-the-ordering-process-for-Happy-Head)
- [Help centre: Why do you need my photos? / photo ID](https://happyhead.zendesk.com/hc/en-us/articles/16253781819415-Why-do-you-need-my-photos)
- [Help centre: Why Happy Head Asks for Your Age and Gender](https://happyhead.zendesk.com/hc/en-us/articles/31569172936599-Why-Happy-Head-Asks-for-Your-Age-and-Gender)
- [Help centre: What non-prescription products does Happy Head offer?](https://happyhead.zendesk.com/hc/en-us/articles/31044488677655-What-non-prescription-products-does-Happy-Head-offer)
- [Help centre: What is your return policy?](https://happyhead.zendesk.com/hc/en-us/articles/4402314831383-What-is-your-return-policy)
- [Help centre: How can I cancel my subscription?](https://happyhead.zendesk.com/hc/en-us/articles/4402322014359-How-can-I-cancel-my-subscription)
- [Help centre: Subscription vs One-Time Orders](https://happyhead.zendesk.com/hc/en-us/articles/17571301347607-Subscription-vs-One-Time-Orders)
- [Help centre: Annual Health Check](https://happyhead.zendesk.com/hc/en-us/articles/19957315243159-How-can-I-update-my-health-information-for-my-Annual-Health-Check)
- [Help centre: Do you ship internationally? (US only)](https://happyhead.zendesk.com/hc/en-us/articles/17624465131415-Do-you-ship-internationally)
- [Help centre: insurance, FSA, HSA](https://happyhead.zendesk.com/hc/en-us/articles/42296905667479-Does-Happy-Head-accept-outside-insurance-FSA-or-HSA)
- [NCOA: Happy Head review (23 Sep 2026)](https://www.ncoa.org/product-resources/hair-loss/happy-head-review/)
- [Top10.com: Happy Head review (6 Aug 2025)](https://www.top10.com/hair-loss/reviews/happy-head)
- [finvsfin.com: Happy Head SuperCapsule review (updated 2 Oct 2025)](https://finvsfin.com/happy-head-super-capsule-reviews/)
- [Perfect Hair Health: Happy Head review, 5 concerns (Oct 2026; written by a competitor's affiliate)](https://perfecthairhealth.com/happy-head-review/)
- [Company FAQ wording on women and topical finasteride, seen only as a search-engine snippet (page not opened)](https://happyhead.com/faq)
- [Happy Head SuperCapsule finasteride landing page (via web search)](https://happyhead.com/lp/supercapsule/dy82zh)
- [Happy Head SuperCapsule finasteride product page (via web search, not opened)](https://www.happyhead.com/products/supercapsule-finasteride-minoxidil-vitamin-d3)
