# Boots Online Doctor: consultation and product report

**Market:** UK · **Website:** https://onlinedoctor.boots.com/ · **Checked:** 2026-11-23 · **Owner:** Boots UK (provider: Boots Digital Health Ltd, CQC registered; runs on the Lemonaid Health UK platform)

> High-street pharmacy's online doctor: a men-only questionnaire for licensed finasteride or Propecia tablets (optionally bundled with Regaine foam), reviewed by a clinician, sold as one-off packs with store pick-up or free delivery.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** After the health questions. Nothing asks for an email before that: after postcode, birth gender and date of birth the site itself creates a placeholder "temporary user" (POST users/temp). The first screen we could not pass is the ID photo step at /camera/id ("Let's confirm it's you": a selfie and a photo of your ID), which comes straight after the last health question. Account set-up (email, name, phone, address, password) is the next task after the photos, then delivery and payment. No recommendation is shown before the wall: the patient has already picked the medicine.
- **Blocker:** ID photos (selfie + photo ID) are required before account set-up; photos are outside the research rules, so nothing after the health questions was seen.
- **Blocker:** curl to the marketing site was blocked by the Imperva/Incapsula bot protection after about five quick requests; the normal browser (walk.js) was not blocked. Nothing was done to get round it.

Walked live with the baseline man from the entry page to the ID photo screen for the first-time, tablets-only route (all 19 question screens). The three other routes (first-time bundle, returning tablets, returning bundle) were walked to their first health question, which made the site serve their full question sets; those questions are recorded from the served definitions, not clicked through. All four definitions are saved. No account, email, name, phone, address, password, photo or payment was entered. A postcode had to be typed to start: the placeholder postcode found in the site's own code (N1 0QH) was used; it is a location check, not a contact detail. There is no women's hair-loss consultation to walk. Stage 2: 14 live one-change runs (x00 to x13, runs/x*) confirmed the gates, the product list limits and that no answer changes the product, price or flow on screen. Stage 3 (independent check): 14 more live runs (runs/verify-*) replayed all four baselines, the gates (plus age 18 and Guernsey), the out-of-stock tile, completed the bundle age-50 run, walked the returning bundle route end to end for the first time, tested one amber and one red answer on their own and the Propecia bundle. It found that the order JSON does record a triage label (answer_status), which stage 2 had missed.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen), **owner-run** (seen in the owner's own browser research, not replayed by us).

## 2. How the engine decides (short version)

There is no recommending engine on screen; the website is a gate, a price list and a fixed form. Three hard stops come first and were all seen live: postcode (Jersey and Guernsey refused), birth sex (female refused) and age (under 18 refused; 18 and 75 accepted with no change). The man then says first-time or returning (no proof) and picks medicine, brand and pack himself. First-timers can only pick one-month packs (bigger packs are marked out of stock in the served product list and cannot be clicked); "returning" unlocks all packs. Tablets or bundle, first-time or returning, picks one of four fixed questionnaires; Propecia uses the same one as generic. Follow-ups appear one level deep. Every option carries a plain/amber/red status. The screen ignores it: even nine stacked red flags and three "I will stop my consultation" answers reach the same ID photo screen with the same product and price. But the server does use it: once the answers are posted, the order is labelled "Normal", "Query", "Warning" or "Danger" for the clinician. Asking to drop Regaine does not change the order. All decisions are left to a clinician after ID photos, account and payment.

## 3. Engine rules (16)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men-first-tablets | Birth gender = "Female" | Hard stop on the second screen: "We're sorry, this service isn't available for the sex you were assigned at birth. Visit Boots Health Hub for advice." There is no women's hair-loss service. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Stops the patient | observed | high |
| R2 | men-first-tablets | Date of birth gives an age under 18 | Hard stop: "Based on your age, you're not suitable for our online service. Please speak with a local GP or clinic". A man who turned 18 the day before is accepted (runs/verify-r-age18). _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Stops the patient | observed | high |
| R9 | men-first-tablets | Date of birth gives an older age (75 tested) | No change: same products, prices and stock flags; Regaine bundles are still offered. Only the bundle questionnaire later asks an age band and warns about off-label Regaine use at 50 or over. | No effect | observed | high |
| R10 | men-first-tablets | Postcode in Jersey (JE…) or Guernsey (GY…) | Hard stop on the postcode screen: "We do not currently provide our service to this postcode." _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Stops the patient | observed | high |
| R3 | men-first-tablets | Product chosen is tablets only vs a Regaine bundle | Tablets only loads questionnaire 2049 (35 questions); a Regaine bundle loads questionnaire 2050 (38 questions) with age-band, scalp-skin and blood-pressure questions. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Adds questions | observed | high |
| R4 | men-returning-tablets | "Have you used this service before?" = "Returning for this service" | Child service HAI-R: every pack size is available and questionnaires 2051 (tablets) / 2052 (bundle) are used; they add "…depression, suicidal thoughts and sexual dysfunction can occur. Do you think any of these have happened to you?" for men already on finasteride. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Adds questions | observed | high |
| R8 | men-first-tablets | All health questions answered (any answers) | Answers are posted once, at the end. The Health Questions task becomes status 3 and the order admin_status becomes 4.1; the next task is ID Photos, then Account-Setup, Delivery, Payment. No recommendation or result screen is shown. | Next question | observed | high |
| R5 | men-first-tablets | "Have you used this service before?" = "First time using this service" | Only one-month packs can be chosen (Finasteride 28 £28, Propecia 28 £55, and the one-month Regaine bundles £50.36 and £72). The served product list marks every larger first-time pack out_of_stock: true, the tile says "Out of stock" and clicking it does nothing. Saying "Returning" (no proof asked) unlocks every pack, e.g. 84 tablets for £80. Whether this is real stock or a deliberate first-supply limit is inferred, not known. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Removes a product | observed | medium |
| R11 | men-first-tablets | Medicine chosen = Propecia instead of generic finasteride | Same questionnaire (2049 for first-time tablets); only the order product and price change (sku 29-9, £55 vs sku 25-9, £28). _(affects: Propecia 1mg tablets (brand))_ | No effect | observed | high |
| R6 | men-first-tablets | Any red-flag answer (status 3 in the definition), e.g. circular patches, complete baldness, painful or pus-filled scalp, "I will stop" answers, treatment not effective, partner trying to conceive, suicidal thoughts, galactose intolerance (tested alone in verify-r-galactose) | The website does not stop the patient: the follow-up warning is shown, Next still works and the flow ends at the ID photo step with the same product and price in the draft order. But the server does act: after the answers are posted the order line field answer_status changes from "Normal" to "Danger" (x08 also set answer_score_1 and answer_score_2 to 2; their meaning is unknown). So red flags are triaged for the clinician, not shown to the patient. Refusal, if any, happens after ID photos, account and payment details. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Flags for the clinician | observed | high |
| R7 | men-first-bundle | Bundle: taking blood-pressure medicine = "Yes" → "Yes - please change my prescription to tablets alone." | The website keeps the bundle in the order (sku 817-9, £50.36). The request to drop Regaine is only an answer for the clinician; no price or product change is shown. Server side the order line answer_status becomes "Warning". _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Flags for the clinician | observed | high |
| R12 | men-first-bundle | Bundle: age band = "50 years or older" | An off-label warning for Regaine (licensed up to 49) appears with the choice to continue or switch to tablets only. Choosing tablets only does not change the draft order (still sku 817-9, £50.36); the flow reaches ID photos and the server sets answer_status "Warning". _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Flags for the clinician | observed | high |
| R13 | men-first-bundle | Bundle: blood-pressure medicine = "Yes" → "No" (keeps Regaine), or "High blood pressure" ticked as a condition, or broken/inflamed scalp skin = "Yes" | Red flag (status 3) in the definition; by R6 the website would carry on. Not replayed one by one. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Flags for the clinician | code | medium |
| R14 | men-first-tablets | Every follow-up question in all four definitions | Shown only when its display_condition lists an option ticked on the first question of the same screen (one level deep). No answer skips a later screen; the number of screens is fixed (19 for tablets, 21 for bundles). | Adds questions | code | high |
| R15 | men-first-tablets | Health answers posted at the end of any route | The server scores the answers and stores a triage label on the order line (answer_status): "Normal" for the baselines, "Query" or "Warning" when an amber (status 2) answer is given, "Danger" when a red (status 3) answer is given. This is the only place the answers act before a clinician sees them; the screen, product and price do not change. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Flags for the clinician | observed | high |
| R16 | men-first-bundle | Medicine chosen = Propecia + Regaine bundle instead of the generic finasteride bundle | Same bundle questionnaire 2050; only the order product and price change (sku 825-9, £72 vs sku 817-9, £50.36). _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | No effect | observed | high |

## 4. Products (5)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Finasteride 1mg tablets (generic)](https://onlinedoctor.boots.com/treatments/finasteride) | rx-oral | finasteride 1 mg | tablet, one a day | men | POM, licensed medicine (generic finasteride 1 mg) | £28 for 28 tablets; £245 for 364 tablets (about 67p a tablet) (One-off packs, no subscription. First-time (HAI-F): 28 Tablets £28 (sku 25-9); 56 Tablets £55 (sku 530-9, shown "Out of stock"); 84 Tablets £80 (sku 23-9, shown "Out of stock"); 168 Tablets £138 (sku 532-9, shown "Out o…) | Never recommended by the engine: the man picks it from the price list before any medical question. First-time patients can only pick 28 tablets (£28); returning patients any pack. Red-flag answers do not remove it on screen; the clinician decides later. | observed |
| [Propecia 1mg tablets (brand)](https://onlinedoctor.boots.com/propecia-online) | rx-oral | finasteride 1 mg | tablet, one a day | men | POM, licensed medicine (branded finasteride 1 mg) | £55 for 28 tablets; £400 for 364 tablets (One-off packs, no subscription. First-time (HAI-F): 28 Tablets £55 (sku 29-9); 56 Tablets £98 (sku 528-9, shown "Out of stock"); 84 Tablets £119 (sku 27-9, shown "Out of stock"); 168 Tablets £216 (sku 534-9, shown "Out …) | Patient choice only (brand version at about twice the price). Uses exactly the same questionnaire as generic finasteride (observed, runs/x06-propecia). First-time: 28 tablets £55 only. | observed |
| [Finasteride 1mg tablets + Regaine foam extra strength (bundle)](https://onlinedoctor.boots.com/propecia-online) | bundle | finasteride 1 mg; minoxidil not stated on the site ("Regaine foam extra strength", 73 ml can). The licensed UK product of that name is 5% w/w: inferred | tablet once a day + scalp foam twice a day (1 g, half a capful) | men | Finasteride: POM, licensed. Regaine foam: licensed medicine sold without prescription in UK shops (inferred GSL); here it is supplied as part of the prescription order. Off-label for men aged 50 or over (the site says the licence covers up to age 49). | £50.36 for one month (28 tablets + 1 x 73 ml); £334.39 for 12 months (One-off packs, no subscription. First-time (HAI-F): 28 tablets + 73ml £50.36 (sku 817-9); 84 tablets + 3 x 73ml £108 (sku 821-9, shown "Out of stock"); 168 tablets + 6 x 73ml £181.59 (sku 823-9, shown "Out of stock"); 3…) | Patient choice under "See more treatment options". The bundle questionnaire lets him ask to drop Regaine (age 50+, blood-pressure medicine) but the order on screen stays the bundle; the clinician would switch it. | observed |
| [Propecia 1mg tablets + Regaine foam extra strength (bundle)](https://onlinedoctor.boots.com/propecia-online) | bundle | finasteride 1 mg; minoxidil not stated on the site ("Regaine foam extra strength", 73 ml can). The licensed UK product of that name is 5% w/w: inferred | tablet once a day + scalp foam twice a day | men | Propecia: POM, licensed. Regaine foam: licensed medicine sold without prescription in UK shops (inferred GSL). Off-label for men aged 50 or over. | £72 for one month (28 tablets + 1 x 73 ml); £458 for 12 months (One-off packs, no subscription. First-time (HAI-F): 28 tablets + 73ml £72 (sku 825-9); 84 tablets + 3 x 73ml £139 (sku 826-9, shown "Out of stock"); 168 tablets + 6 x 73ml £244 (sku 827-9, shown "Out of stock"); 364 tab…) | Patient choice under "See more treatment options" (£72 a month for first-timers). Uses the same bundle questionnaire 2050 as the generic bundle (observed, runs/verify-r-propecia-bundle, sku 825-9). | observed |
| [Regaine (minoxidil) on its own: signposted to boots.com, not sold by the Online Doctor](https://onlinedoctor.boots.com/propecia-online-important-info) | otc-medicine | minoxidil not stated (the finasteride page mentions "minoxidil 5% solution") | scalp foam or solution | men | Sold without prescription on boots.com and in Boots stores (not part of this service) | Not listed on Boots Online Doctor (sold on boots.com; price not checked) (The information page says: "Regaine can be used on its own and is available from boots.com or in Boots stores.") | Never offered inside the consultation; information pages point to boots.com for Regaine on its own. | docs |

## 5. Who gets what (12 patient profiles)

- **Baseline man, 32, temples and crown, gradual, no medical issues, first time** → Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle). No recommendation screen. He sees a price list and picks; only the 28-tablet packs (£28 generic, £55 Propecia) and the one-month bundles (£50.36, £72) can be chosen. The £28 pick reaches the ID photo step with no message. (runs/verify-b01-baseline) _[observed]_
- **Same man choosing Propecia** → Propecia 1mg tablets (brand) (default: Propecia 1mg tablets (brand)). Same questionnaire as generic; £55 for 28 tablets. (runs/x06-propecia) _[observed]_
- **Same man choosing the finasteride + Regaine bundle** → Finasteride 1mg tablets + Regaine foam extra strength (bundle) (default: Finasteride 1mg tablets + Regaine foam extra strength (bundle)). Longer questionnaire (2050) with age band, scalp skin and blood-pressure questions; £50.36 for one month. (runs/x09-bundle-baseline) _[observed]_
- **Bundle patient on blood-pressure medicine who asks for tablets alone** → Finasteride 1mg tablets + Regaine foam extra strength (bundle) (default: Finasteride 1mg tablets + Regaine foam extra strength (bundle)). The order stays the bundle at £50.36 on screen; the clinician is expected to change it to tablets only (inferred). (runs/x10-bundle-bp-drop-regaine) _[observed]_
- **Bundle patient aged 50 or over** → Finasteride 1mg tablets + Regaine foam extra strength (bundle) (default: Finasteride 1mg tablets + Regaine foam extra strength (bundle)). Warned that Regaine is off-label over 49 and offered tablets only; choosing tablets only leaves the bundle in the order on screen, but the server labels the answers "Warning" (runs/verify-r-x11-age50). _[observed]_
- **Man saying he is returning (no proof asked)** → Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle). All pack sizes open, e.g. Finasteride 84 tablets £80; returning questionnaire 2051 adds a side-effect question for current users. (runs/x12-returning-baseline, runs/verify-b04-returning-bundle) _[observed]_
- **Man with red-flag answers (patchy or complete loss, painful scalp, sudden onset, partner trying to conceive, suicidal thoughts)** → Finasteride 1mg tablets (generic) (default: Finasteride 1mg tablets (generic)). Nothing changes on screen: the chosen product stays in the order and he goes on to ID photos. The server labels the order "Danger" for the clinician (observed). Refusal can only come from the clinician later (inferred). (runs/x08-all-red-flags, runs/verify-r-galactose) _[observed]_
- **Man aged 75** → Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle). Accepted; same list and prices as the baseline man. (runs/x04-age75) _[observed]_
- **Baseline woman, 38** → nothing offered. Refused at the birth-gender screen; signposted to Boots Health Hub. No women's hair-loss service. (runs/x02-female, runs/verify-r-x02) _[observed]_
- **Under 18** → nothing offered. Refused at the date-of-birth screen; told to see a GP or clinic. (runs/x03-age17, runs/verify-r-x03) _[observed]_
- **Jersey or Guernsey postcode** → nothing offered. Refused at the postcode screen. (runs/x05-jersey, runs/verify-r-x05, runs/verify-r-guernsey) _[observed]_
- **Same man choosing the Propecia + Regaine bundle** → Propecia 1mg tablets + Regaine foam extra strength (bundle) (default: Propecia 1mg tablets + Regaine foam extra strength (bundle)). Same bundle questionnaire (2050) as the generic bundle; £72 for one month (runs/verify-r-propecia-bundle). _[observed]_

## 6. The consultation, step by step

### Men, first time, tablets only (Finasteride or Propecia)

Entry: https://onlinedoctor-clinic.boots.com/Hair-Loss

Postcode → birth gender → date of birth (site creates a placeholder temporary user) → first time or returning → patient picks medicine and pack → product page → honesty tick box → 19 health-question screens (35 questions with follow-ups; questionnaire 2049) → ID photos (selfie + photo ID: research stops here) → account set-up → delivery or pick-up → payment → clinician review within 24 hours.

**1. What's your postcode?**  
_text · anonymous · role: eligibility-gate · shown: always (first screen of every hair-loss entry) · BRANCHES · observed_  
Why they ask: Service-area check before anything else.  
Downstream: Jersey postcode (JE2 4WD) refused: "We do not currently provide our service to this postcode." (runs/x05-jersey). Unknown postcodes: "Sorry, Boots isn't in your postcode yet." (app code, not tested). Next stays disabled until the postcode passes.


**2. What’s your birth gender?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Hair-loss treatment here is for men only.  
Downstream: Female cannot continue.

- `Female` → **Stops the patient**: Hard stop: "We're sorry, this service isn't available for the sex you were assigned at birth. Visit Boots Health Hub for advice." (runs/x02-female) _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[observed]_
- `Male` → **Next question**: Next is enabled; goes to date of birth. (Seen live in runs/verify-b01-baseline.) _[observed]_

**3. What’s your date of birth? (Please make sure this is accurate to avoid delays to your treatment)**  
_date · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Age check. Also used later to match the photo ID.  
Downstream: Age 17 refused: "Based on your age, you're not suitable for our online service. Please speak with a local GP or clinic" (runs/x03-age17). Age 75 accepted with the same products and prices (runs/x04-age75). Server limits 18 to 120.


**4. Have you used this service before?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Splits new patients from returning ones. (Seen live in runs/verify-b01-baseline.)  
Downstream: Chooses the child service (HAI-F or HAI-R), and with it the product list and the questionnaire. It is self-declared: a brand-new anonymous visitor can pick "Returning" (observed).

- `First time using this service` → **Next question**: Opens the first-time product list (child service HAI-F). On the day tested only one-month packs could be chosen there; larger packs showed "Out of stock". (Seen live in runs/verify-b01-baseline.) _[observed]_
- `Returning for this service` → **Adds questions**: Opens the returning product list (child service HAI-R): same medicines and prices, every pack size available, larger packs shown first. Uses the returning questionnaires, which add one side-effect question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**5. Which medicine do you prefer? (Ultimately it will be a joint decision between you and one of our clinicians on whether a particular medicine is appropriate.)**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The patient, not an engine, chooses the medicine, brand and pack size before any medical question.  
Downstream: Tablets-only packs load one questionnaire and Regaine bundles load another (ids 2049 / 2050 first-time, 2051 / 2052 returning). Featured packs are shown first; the rest (including every bundle that is available) sit behind "See more treatment options", which also has a search box. The site content also holds a "No-Choice" product entry (code HAI-F-No-Choice) that was not shown on screen.

- `Finasteride 1mg, 28 Tablets, £28` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Walked with sku 25-9. (Seen live in runs/verify-b01-baseline.) _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg, 56 Tablets, £55 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets (generic))_ _[code]_
- `Finasteride 1mg, 84 Tablets, £80 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live: runs/x13-out-of-stock-tile. Returning patients can choose larger packs (runs/x12-returning-baseline). _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg, 168 Tablets, £138 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets (generic))_ _[code]_
- `Finasteride 1mg, 364 Tablets, £245 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets (generic))_ _[code]_
- `Propecia 1mg, 28 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. Observed: Propecia uses the same questionnaire as generic finasteride (2049 for first-time tablets, runs/x06-propecia). _(affects: Propecia 1mg tablets (brand))_ _[observed]_
- `Propecia 1mg, 56 Tablets, £98 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets (brand))_ _[code]_
- `Propecia 1mg, 84 Tablets, £119 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets (brand))_ _[code]_
- `Propecia 1mg, 168 Tablets, £216 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets (brand))_ _[code]_
- `Propecia 1mg, 364 Tablets, £400 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets (brand))_ _[code]_
- `Finasteride 1mg (28 tablets) \| Regaine foam extra strength (73ml), £50.36` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Walked with sku 817-9. (Seen live in runs/verify-b01-baseline.) _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[observed]_
- `Finasteride 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £108 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Finasteride 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £181.59 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Finasteride 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £334.39 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Propecia 1mg (28 tablets) \| Regaine foam extra strength (73ml), £72` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £139 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Propecia 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £244 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Propecia 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £458 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**6. Product page for the chosen pack: name, price, short description, and four fold-out sections: "Is it suitable for me?", "How to take it", "How it works", "What else should I know?"**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Shows who should not take the medicine before the questions start. (Seen live in runs/verify-b01-baseline.)

- `Continue` → **Next question**: Creates the draft order on the server (status "Not submitted") with this task list: Health Questions, ID Photos, Account-Setup, Delivery, Payment. (Seen live in runs/verify-b01-baseline.) _[observed]_

**7. Important info: Just like a traditional consultation we're going to ask you about your medical history and symptoms. Your answers will help us assess your suitability for treatment. Please answer all questions honestly and in full. If you have any problems understanding or answering a question please call or message us.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Honesty statement before the medical questions. (Seen live in runs/verify-b01-baseline.)

- `I understand the important information above.` → **Next question**: Tick box. Continue stays disabled until it is ticked, then the health questions open. (Seen live in runs/verify-b01-baseline.) _[observed]_

**8. Which of the following best describes your hair loss? (Tick all that apply)**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Checks the pattern fits male pattern baldness (temples, crown). Patches or complete loss suggest another cause.  
Downstream: Follow-ups: "Are you experiencing any areas of hair loss on your scalp that look l…"; "Do you have complete baldness?". The wording says "Tick all that apply" but only one option can be chosen (max 1).

- `Temples only (receding at the front)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Temples and Crown` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_
- `Random patches` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you experiencing any areas of hair loss on your scalp that look like circular patches…". Amber flag (status 2 in the quiz definition): marked for the clinician. Observed in runs/x07-patches or runs/x08-all-red-flags: the follow-up appears, nothing else changes. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[observed]_
- `Complete` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Do you have complete baldness?". Observed in runs/x07-patches or runs/x08-all-red-flags: the follow-up appears, nothing else changes. _[observed]_

**9. Are you experiencing any areas of hair loss on your scalp that look like circular patches, with a smooth surface?**  
_single · anonymous · role: diagnosis · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Random patches" · no branch · code_  
Why they ask: Screens for alopecia areata (smooth round patches), which this service does not treat.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x07-patches). Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_
- `No` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**10. Do you have complete baldness?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Complete" · no branch · code_  
Why they ask: Finasteride is unlikely to help once most hair is lost.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x08-all-red-flags). Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_
- `No, it affects mostly the front and top of my scalp` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**11. Do you have any of the following? Please select all that apply.**  
_multi · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Looks for scalp disease that could be the real cause or needs treating first.  
Downstream: Follow-ups: "Treatment will be less effective if you have damaged hair follicles f…".

- `Psoriasis, fungal infections such as ringworm, or dandruff of your scalp` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Treatment will be less effective if you have damaged hair follicles from a scalp conditio…". _[code]_
- `Itchy, rough or scaling areas on your scalp` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Treatment will be less effective if you have damaged hair follicles from a scalp conditio…". _[code]_
- `Any pain, burning/ blistering or pus-filled spots on the scalp` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x08-all-red-flags). Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_
- `None of the above` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. (Seen live in runs/verify-b01-baseline.) _[observed]_

**12. Treatment will be less effective if you have damaged hair follicles from a scalp condition. I recommend you sort your scalp condition before starting this treatment.**  
_single · anonymous · role: expectation-setting · shown: Only when "Do you have any of the following? Please select all that apply." is answered "Psoriasis, fungal infections such as ringworm, or dandruff of your scalp" or "Itchy, rough or scaling areas on your scalp" · no branch · code_  
Why they ask: Warns that a scalp condition makes treatment work less well; the patient chooses to go on or stop.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to continue with my consultation` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I understand and do not wish to continue with my consultation.  I will stop this consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**13. Have you lost any hair elsewhere on your body?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Body hair loss points away from male pattern baldness.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x08-all-red-flags). Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[observed]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**14. When did you start losing your hair?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Very recent hair loss is not typical of male pattern baldness.

- `Within the last month` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x08-all-red-flags). Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[observed]_
- `More than a month ago` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**15. How did your hair loss start?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Male pattern baldness is gradual; sudden loss suggests another cause.  
Downstream: Follow-ups: "Sudden hair loss is unusual. Treatment is designed to treat the initi…".

- `Suddenly` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sudden hair loss is unusual. Treatment is designed to treat the initial stages of male pa…". Observed in runs/x07-patches or runs/x08-all-red-flags: the follow-up appears, nothing else changes. _[observed]_
- `Gradually` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**16. Sudden hair loss is unusual. Treatment is designed to treat the initial stages of male pattern baldness, which usually happens gradually.**  
_single · anonymous · role: expectation-setting · shown: Only when "How did your hair loss start?" is answered "Suddenly" · no branch · code_  
Why they ask: Warns that sudden loss is not what the treatment is for; the patient chooses to go on or stop.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to continue with this consultation` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I understand and do not wish to continue. I will stop my consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x08-all-red-flags). Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_

**17. Are you currently using Finasteride or Propecia for hair loss?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Separates new starters from men already on treatment and opens the follow-up questions.  
Downstream: Follow-ups: "Is it effective?"; "Do you experience any side effects?".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Is it effective?" and "Do you experience any side effects?". Observed in runs/x07-patches or runs/x08-all-red-flags: the follow-up appears, nothing else changes. _[observed]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**18. Is it effective?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: No point continuing a treatment that has not worked.

- `Yes` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Not yet, but I've been using it for less than 6 months` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Not sure, but I'd like to continue. I understand if there's no improvement after 6 months then it's unlikely to work for me.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x08-all-red-flags). Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_

**19. Do you experience any side effects?**  
_single · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Picks up side effects from current finasteride use.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x08-all-red-flags). Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[observed]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**20. Is your partner pregnant or trying to get pregnant?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Finasteride can harm a male foetus; trying to conceive is a reason not to treat.  
Downstream: Follow-ups: "If your partner is pregnant you must use condoms while taking finaste…"; "As your partner is trying to get pregnant, you should not use this me…".

- `My partner is pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If your partner is pregnant you must use condoms while taking finasteride or Propecia to …". _[code]_
- `My partner is trying to get pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As your partner is trying to get pregnant, you should not use this medication. If you're …". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x01-partner-ttc). Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _[observed]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**21. If your partner is pregnant you must use condoms while taking finasteride or Propecia to prevent harm to the baby.**  
_consent · anonymous · role: consent · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is pregnant" · no branch · code_  
Why they ask: Makes the patient confirm the condom advice when a partner is pregnant.  
Downstream: Helper text under the question: "Please confirm that you understand this."

- `I confirm that I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**22. As your partner is trying to get pregnant, you should not use this medication. If you're already taking finasteride or Propecia, we recommend you stop taking it for at least 2 weeks before trying to conceive with your partner.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is trying to get pregnant" · no branch · code_  
Why they ask: Tells the patient the medicine is not suitable while trying to conceive.

- `I understand and will stop my consultation.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x01-partner-ttc). Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_

**23. Are you taking medication for a prostate condition?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Looks for finasteride 5 mg or similar medicines, and for men whose PSA tests matter. (Seen live in runs/verify-b01-baseline.)  
Downstream: Follow-ups: "You need to know that these medicines can affect prostate blood test …".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You need to know that these medicines can affect prostate blood test results. If you need…". Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**24. You need to know that these medicines can affect prostate blood test results. If you need a prostate blood test, tell your doctor that you take finasteride or propecia.**  
_consent · anonymous · role: consent · shown: Only when "Are you taking medication for a prostate condition?" is answered "Yes" · no branch · code_  
Why they ask: Makes the patient acknowledge that finasteride changes PSA test results.

- `I understand that If I need a prostate blood test, the doctor will need to know I am on this medication.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**25. Are you taking any other prescription-only medicines, over-the-counter medicines, alternative medicines or recreational drugs?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Full medicines history for the clinician.  
Downstream: Follow-ups: "You've told me you don't take any medication at all. Is that right?".

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You've told me you don't take any medication at all. Is that right?". (Seen live in runs/verify-b01-baseline.) _[observed]_

**26. You've told me you don't take any medication at all. Is that right?**  
_single · anonymous · role: safety-screen · shown: Only when "Are you taking any other prescription-only medicines, over-the-counte…" is answered "No" · no branch · observed_  
Why they ask: Double-checks a "no medicines" answer.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Correct - I'm not on any medication` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_
- `No, I forgot to tell you something` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me here") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**27. Do you have any of the following conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Conditions that matter for finasteride (and, in bundles, for Regaine).  
Downstream: Follow-ups: "Depression and suicidal thoughts are an uncommon side effect of Finas…"; "If you’re experiencing thoughts of self harm or suicide, help is avai…"; "Sexual dysfunction (including decreased sex drive and erectile dysfun…".

- `Cancer` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Liver condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Depression` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Depression and suicidal thoughts are an uncommon side effect of Finasteride/Propecia. If …". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Suicidal thoughts` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If you’re experiencing thoughts of self harm or suicide, help is available. Please call N…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x08-all-red-flags). Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _[observed]_
- `Sexual dysfunction (including decreased sex drive and erectile dysfunction)` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommo…". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Skin condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Kidney/urinary condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Hereditary problems of galactose intolerance, Lapp lactase deficiency or glucosegalactose malabsorption` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. (Seen live in runs/verify-b01-baseline.) _[observed]_

**28. Depression and suicidal thoughts are an uncommon side effect of Finasteride/Propecia. If your depression gets worse, please stop this medicine and contact your doctor as soon as possible.**  
_consent · anonymous · role: consent · shown: Only when "Do you have any of the following conditions?" is answered "Depression" · no branch · code_  
Why they ask: Makes a patient with this condition acknowledge the matching side-effect warning.  
Downstream: Helper text under the question: "Please tick to confirm that you have understood this."

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**29. Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommon side effect of Finasteride/Propecia. If your sexual dysfunction gets worse, please stop this medicine and contact your doctor as soon as possible.**  
_consent · anonymous · role: consent · shown: Only when "Do you have any of the following conditions?" is answered "Sexual dysfunction (including decreased sex drive and erectile dysfunction)" · no branch · code_  
Why they ask: Makes a patient with this condition acknowledge the matching side-effect warning.

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**30. If you’re experiencing thoughts of self harm or suicide, help is available. Please call NHS 111, your local NHS Mental Health Crisis service, or your GP. You can also call the Samaritans on 116 123 OR text Shout on 85258.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Do you have any of the following conditions?" is answered "Suicidal thoughts" · no branch · code_  
Why they ask: Signposts crisis help and tells the patient the medicine is not suitable.

- `I understand that this medication is not suitable for me and will stop this application.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline (runs/x08-all-red-flags). Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_

**31. Other than those already mentioned, do you have any other significant medical conditions, illnesses, hospital stays or past surgical procedures?**  
_single · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Catch-all medical history.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**32. Do you have any known allergies?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Allergy check. (Seen live in runs/verify-b01-baseline.)  
Downstream: Follow-ups: "Are you allergic to any of the following?".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you allergic to any of the following?". _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**33. Are you allergic to any of the following?**  
_multi · anonymous · role: safety-screen · shown: Only when "Do you have any known allergies?" is answered "Yes" · no branch · code_  
Why they ask: Allergy detail; medicine allergies are flagged.

- `Penicillin` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Other medicines` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Grass, pollen, trees, or plants (hayfever)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `House dust` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Animals (dogs, cats, horses etc)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Nuts` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Something else` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**34. I want to check your understanding of the hair loss treatment. Please tell me: You will need to take the treatment for at least 3-6 months before you see any benefit, and stopping treatment will reverse any regrowth and hair loss will resume.**  
_single · anonymous · role: expectation-setting · shown: always · BRANCHES · observed_  
Why they ask: Checks the patient knows it takes 3 to 6 months and stops working when stopped. (Seen live in runs/verify-b01-baseline.)  
Downstream: Follow-ups: "The medication takes several months to work and so you won’t start to…".

- `True` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_
- `False` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "The medication takes several months to work and so you won’t start to see a benefit for 3…". _[code]_

**35. The medication takes several months to work and so you won’t start to see a benefit for 3-6 months**  
_consent · anonymous · role: expectation-setting · shown: Only when "I want to check your understanding of the hair loss treatment. Please…" is answered "False" · no branch · code_  
Why they ask: Corrects a wrong answer to the understanding check.

- `I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**36. You also need to know that these medicines can affect prostate blood test results. So if you need a prostate blood test, tell your doctor that you take finasteride or propecia.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Makes the patient acknowledge that finasteride changes PSA test results. (Seen live in runs/verify-b01-baseline.)

- `I understand that if I need a prostate blood test, the doctor will need to know I am on this medicine.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**37. You should know about the following important side effects that have occurred in some men: Depression and suicidal thoughts; Sexual problems, such as erectile dysfunction, that can last even when medication is stopped; Increase risk of breast tenderness**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Side-effect warning the patient must acknowledge. (Seen live in runs/verify-b01-baseline.)

- `I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**38. If you experience these side effects, please stop the medication and send a message to Boots Online Doctor**  
_single · anonymous · role: consent · shown: always · BRANCHES · observed_  
Why they ask: Tells the patient to stop and message the service; offers the leaflet. (Seen live in runs/verify-b01-baseline.)  
Downstream: Follow-ups: "Here is the Patient Information Leaflet for Finasteride with further …". Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_
- `I'd like more information` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Here is the Patient Information Leaflet for Finasteride with further details- please copy…". _[code]_

**39. Here is the Patient Information Leaflet for Finasteride with further details- please copy and paste this link into your browser: https://www.medicines.org.uk/emc/files/pil.7068.pdf**  
_single · anonymous · role: consent · shown: Only when "If you experience these side effects, please stop the medication and …" is answered "I'd like more information" · no branch · code_  
Why they ask: Gives the leaflet link; lets the patient ask a question.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I'd like to ask more about side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("How can I help?") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**40. Would you like me to tell your GP about any care we provide? Ideally your GP should know about any medicines you’re taking.**  
_single · anonymous · role: data-capture · shown: always · no branch · observed_  
Why they ask: Asks permission to inform the GP and, if yes, collects the GP practice. (Seen live in runs/verify-b01-baseline.)

- `Yes` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Opens a GP practice search box (a GP surgery name or postcode); not used in this research. _[code]_
- `No (This won't affect our review of your order, but we would encourage you to tell your GP)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**41. Before we finish, is there anything else you want to tell me?**  
_single · anonymous · role: data-capture · shown: always · no branch · observed_  
Why they ask: Free-text catch-all for the clinician.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**42. Please confirm: you understand the questions asked; have answered them honestly; any treatment is for you only. You should read our clinicians’ advice and also, the patient information leaflet that comes with any medication. You can message us if needed.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Final declaration of honesty and own use. (Seen live in runs/verify-b01-baseline.)

- `Please tick to confirm that you understand and agree` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. (Seen live in runs/verify-b01-baseline.) _[observed]_

**43. Let's confirm it's you. We need to verify your identity before we can prescribe. You'll be asked for: a selfie; a photo of your ID**  
_photo · anonymous · role: identity · shown: always, straight after the last health question (task 2 of the order) · no branch · observed_  
Why they ask: Identity check before prescribing ("Regulations require us to see who we're treating." in the order data). ID wording in the app parameters: driver's licence or passport, with full name, date of birth and face visible. (Seen live in runs/verify-b01-baseline.)

- `Open camera` → **Unknown**: Starts the selfie and photo-ID capture: the research stops here (photos not allowed). What follows (account, delivery, payment, clinician review) was not seen. _[unknown]_

**44. Account-Setup (task name in the order; screen not reached). App parameter text: "CREATE ACCOUNT" with terms, privacy and marketing tick boxes.**  
_contact · after-account · role: identity · shown: after the ID photos (task 4 of the order) · no branch · code_  
Why they ask: Real account: email, name, mobile number, address, password. Replaces the placeholder temporary user.


**45. Delivery (task name in the order; screen not reached). App parameter title: "WOULD YOU LIKE TO PICK UP IN STORE (FASTEST)?"**  
_single · checkout · role: data-capture · shown: after account set-up (task 5 of the order) · no branch · code_  
Why they ask: How the medicine is supplied. No subscription or automatic refill option is in the order data.

- `Mail order one-time ("Ship to me just once")` → **No effect**: Free Royal Mail Tracked 48 delivery. Marked as the default option in the order data. _[code]_
- `Pharmacy pick-up ("I'll pick up at a local pharmacy")` → **No effect**: Collect from a Boots pharmacy (not Jersey or Guernsey), usually within 2 business hours of the prescription being written. _[code]_

**46. Payment (task name in the order; screen not reached). App content: "Your Order", "If we don’t prescribe, we’ll refund you.", button "Place Order".**  
_info · checkout · role: data-capture · shown: last task of the order (task 6) · no branch · code_  
Why they ask: Card details. Placing the order sends the visit to a clinician ("Your order is being reviewed by a clinician … within 24 hours").


### Men, first time, tablets + Regaine foam bundle

Entry: https://onlinedoctor-clinic.boots.com/Hair-Loss

Postcode → birth gender → date of birth (site creates a placeholder temporary user) → first time or returning → patient picks medicine and pack → product page → honesty tick box → 21 health-question screens (38 questions with follow-ups; questionnaire 2050) → ID photos (selfie + photo ID: research stops here) → account set-up → delivery or pick-up → payment → clinician review within 24 hours.

**1. What's your postcode?**  
_text · anonymous · role: eligibility-gate · shown: always (first screen of every hair-loss entry) · BRANCHES · observed_  
Why they ask: Service-area check before anything else.  
Downstream: Jersey postcode (JE2 4WD) refused: "We do not currently provide our service to this postcode." (runs/x05-jersey). Unknown postcodes: "Sorry, Boots isn't in your postcode yet." (app code, not tested). Next stays disabled until the postcode passes.


**2. What’s your birth gender?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Hair-loss treatment here is for men only. (Seen live in runs/x09-bundle-baseline.)  
Downstream: Female cannot continue.

- `Female` → **Stops the patient**: Stops here. The service is set to male only (genders ["male"] in the service list). Message in the app code: "We're sorry, this service isn't available for the sex you were assigned at birth. Visit Boots Health Hub for advice." Not tested live. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Male` → **Next question**: Next is enabled; goes to date of birth. (Seen live in runs/x09-bundle-baseline.) _[observed]_

**3. What’s your date of birth? (Please make sure this is accurate to avoid delays to your treatment)**  
_date · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Age check. Also used later to match the photo ID.  
Downstream: Age 17 refused: "Based on your age, you're not suitable for our online service. Please speak with a local GP or clinic" (runs/x03-age17). Age 75 accepted with the same products and prices (runs/x04-age75). Server limits 18 to 120.


**4. Have you used this service before?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Splits new patients from returning ones. (Seen live in runs/x09-bundle-baseline.)  
Downstream: Chooses the child service (HAI-F or HAI-R), and with it the product list and the questionnaire. It is self-declared: a brand-new anonymous visitor can pick "Returning" (observed).

- `First time using this service` → **Next question**: Opens the first-time product list (child service HAI-F). On the day tested only one-month packs could be chosen there; larger packs showed "Out of stock". (Seen live in runs/x09-bundle-baseline.) _[observed]_
- `Returning for this service` → **Adds questions**: Opens the returning product list (child service HAI-R): same medicines and prices, every pack size available, larger packs shown first. Uses the returning questionnaires, which add one side-effect question. (Seen live in runs/x09-bundle-baseline.) _[observed]_

**5. Which medicine do you prefer? (Ultimately it will be a joint decision between you and one of our clinicians on whether a particular medicine is appropriate.)**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The patient, not an engine, chooses the medicine, brand and pack size before any medical question.  
Downstream: Tablets-only packs load one questionnaire and Regaine bundles load another (ids 2049 / 2050 first-time, 2051 / 2052 returning). Featured packs are shown first; the rest (including every bundle that is available) sit behind "See more treatment options", which also has a search box. The site content also holds a "No-Choice" product entry (code HAI-F-No-Choice) that was not shown on screen.

- `Finasteride 1mg, 28 Tablets, £28` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Walked with sku 25-9. (Seen live in runs/x09-bundle-baseline.) _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg, 56 Tablets, £55 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets (generic))_ _[code]_
- `Finasteride 1mg, 84 Tablets, £80 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live: runs/x13-out-of-stock-tile. Returning patients can choose larger packs (runs/x12-returning-baseline). _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg, 168 Tablets, £138 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets (generic))_ _[code]_
- `Finasteride 1mg, 364 Tablets, £245 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets (generic))_ _[code]_
- `Propecia 1mg, 28 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. Observed: Propecia uses the same questionnaire as generic finasteride (2049 for first-time tablets, runs/x06-propecia). _(affects: Propecia 1mg tablets (brand))_ _[observed]_
- `Propecia 1mg, 56 Tablets, £98 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets (brand))_ _[code]_
- `Propecia 1mg, 84 Tablets, £119 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets (brand))_ _[code]_
- `Propecia 1mg, 168 Tablets, £216 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets (brand))_ _[code]_
- `Propecia 1mg, 364 Tablets, £400 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets (brand))_ _[code]_
- `Finasteride 1mg (28 tablets) \| Regaine foam extra strength (73ml), £50.36` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Walked with sku 817-9. (Seen live in runs/x09-bundle-baseline.) _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[observed]_
- `Finasteride 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £108 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Finasteride 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £181.59 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Finasteride 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £334.39 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Propecia 1mg (28 tablets) \| Regaine foam extra strength (73ml), £72` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £139 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Propecia 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £244 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Propecia 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £458 [shown as "Out of stock"]` → **Removes a product**: Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile. Returning patients can choose larger packs (runs/x12-returning-baseline). The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**6. Product page for the chosen pack: name, price, short description, and four fold-out sections: "Is it suitable for me?", "How to take it", "How it works", "What else should I know?"**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Shows who should not take the medicine before the questions start. (Seen live in runs/x09-bundle-baseline.)

- `Continue` → **Next question**: Creates the draft order on the server (status "Not submitted") with this task list: Health Questions, ID Photos, Account-Setup, Delivery, Payment. (Seen live in runs/x09-bundle-baseline.) _[observed]_

**7. Important info: Just like a traditional consultation we're going to ask you about your medical history and symptoms. Your answers will help us assess your suitability for treatment. Please answer all questions honestly and in full. If you have any problems understanding or answering a question please call or message us.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Honesty statement before the medical questions. (Seen live in runs/x09-bundle-baseline.)

- `I understand the important information above.` → **Next question**: Tick box. Continue stays disabled until it is ticked, then the health questions open. (Seen live in runs/x09-bundle-baseline.) _[observed]_

**8. I need to check your age, please select the category below that applies to you:**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Regaine foam is licensed only up to age 49, so the bundle asks for an age band (although the date of birth was already given).  
Downstream: Follow-ups: "As you're over 49, I want to tell you that Regaine foam is technicall…".

- `Between 18 and 50 years old` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `50 years or older` → **Adds questions**: Shows the off-label Regaine follow-up (licence covers up to 49). Observed: no other change; the draft order stays the bundle (runs/x11-bundle-age50-drop-regaine, partial run). _[observed]_

**9. As you're over 49, I want to tell you that Regaine foam is technically being prescribed off-label. This means the drug company licence only covers up to the age of 49, but it's commonly used by men over this age.**  
_single · anonymous · role: product-selector · shown: Only when "I need to check your age, please select the category below that appli…" is answered "50 years or older" · no branch · code_  
Why they ask: Tells men aged 50 or over that Regaine would be off-label and lets them drop it for tablets only.

- `I understand and will continue` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I'd rather NOT have Regaine, please change my prescription to Finasteride tablets only.` → **Flags for the clinician**: The patient asks for tablets only (amber flag). Observed to the end (runs/verify-r-x11-age50): the draft order stays the bundle at £50.36 (sku 817-9) and the flow reaches ID photos; the server sets answer_status "Warning". Any switch is left to the clinician. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle), Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_

**10. Which of the following best describes your hair loss? (Tick all that apply)**  
_multi · anonymous · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Checks the pattern fits male pattern baldness (temples, crown). Patches or complete loss suggest another cause.  
Downstream: Follow-ups: "Are you experiencing any areas of hair loss on your scalp that look l…"; "Do you have complete baldness?". Up to 4 options may be ticked.

- `Temples only (receding at the front)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Temples and Crown` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Random patches` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you experiencing any areas of hair loss on your scalp that look like circular patches…". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Complete` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Do you have complete baldness?". _[code]_

**11. Are you experiencing any areas of hair loss on your scalp that look like circular patches, with a smooth surface?**  
_single · anonymous · role: diagnosis · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Random patches" · no branch · code_  
Why they ask: Screens for alopecia areata (smooth round patches), which this service does not treat.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**12. Do you have complete baldness?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Complete" · no branch · code_  
Why they ask: Finasteride is unlikely to help once most hair is lost.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No, it affects mostly the front and top of my scalp` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**13. Do you have broken, infected, shaved or inflamed skin on your scalp?**  
_single · anonymous · role: safety-screen · shown: always · no branch · code_  
Why they ask: Regaine must not go on damaged, infected, inflamed or shaved scalp skin.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**14. Have you lost any hair elsewhere on your body?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Body hair loss points away from male pattern baldness.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**15. When did you start losing your hair?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Very recent hair loss is not typical of male pattern baldness.

- `Within the last month` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `More than a month ago` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**16. How did your hair loss start?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Male pattern baldness is gradual; sudden loss suggests another cause.  
Downstream: Follow-ups: "Sudden hair loss is unusual. These treatments are specifically design…".

- `Suddenly` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sudden hair loss is unusual. These treatments are specifically designed to treat the init…". _[code]_
- `Gradually` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**17. Sudden hair loss is unusual. These treatments are specifically designed to treat the initial stages of male pattern baldness, which usually happens gradually.**  
_single · anonymous · role: expectation-setting · shown: Only when "How did your hair loss start?" is answered "Suddenly" · no branch · code_  
Why they ask: Warns that sudden loss is not what the treatment is for; the patient chooses to go on or stop.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to go ahead with treatment.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I understand and do not wish to continue. I will stop this consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**18. Are you currently using Finasteride or Propecia for hair loss?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · code_  
Why they ask: Separates new starters from men already on treatment and opens the follow-up questions.  
Downstream: Follow-ups: "Is it effective?"; "Do you experience any of the following side effects? Low mood, suicid…".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Is it effective?" and "Do you experience any of the following side effects? Low mood, suicidal thoughts or sexua…". _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**19. Is it effective?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: No point continuing a treatment that has not worked.

- `Yes` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Not yet, but I've been using it for less than 6 months and want to continue` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Not sure, but I understand that if I don't see improvement or slowing of my hair loss after 6 months, continuing to take treatment is unlikely to be effective for me.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**20. Do you experience any of the following side effects? Low mood, suicidal thoughts or sexual problems? Please stop the medication if you have these.**  
_single · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Picks up side effects from current finasteride use.

- `Yes I have those side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No, I have other side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No side effects` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**21. Is your partner pregnant or trying to get pregnant?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Finasteride can harm a male foetus; trying to conceive is a reason not to treat.  
Downstream: Follow-ups: "If your partner is pregnant you must use condoms while taking finaste…"; "As your partner is trying to get pregnant, you should not use this me…".

- `My partner is pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If your partner is pregnant you must use condoms while taking finasteride or Propecia to …". _[code]_
- `My partner is trying to get pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As your partner is trying to get pregnant, you should not use this medication. If you are…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**22. If your partner is pregnant you must use condoms while taking finasteride or Propecia to prevent harm to the baby.**  
_consent · anonymous · role: consent · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is pregnant" · no branch · code_  
Why they ask: Makes the patient confirm the condom advice when a partner is pregnant.  
Downstream: Helper text under the question: "Please confirm that you understand this."

- `I confirm that I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**23. As your partner is trying to get pregnant, you should not use this medication. If you are already taking finasteride or propecia, we recommend you stop taking it for at least 2 weeks before trying to conceive with your partner.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is trying to get pregnant" · no branch · code_  
Why they ask: Tells the patient the medicine is not suitable while trying to conceive.

- `I understand and will stop my consultation.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**24. Are you taking medication for a prostate condition?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Looks for finasteride 5 mg or similar medicines, and for men whose PSA tests matter.  
Downstream: Follow-ups: "You need to know that these medicines can affect prostate blood test …".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You need to know that these medicines can affect prostate blood test results. If you need…". Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**25. You need to know that these medicines can affect prostate blood test results. If you need a prostate blood test, tell your doctor that you take finasteride or propecia.**  
_consent · anonymous · role: consent · shown: Only when "Are you taking medication for a prostate condition?" is answered "Yes" · no branch · code_  
Why they ask: Makes the patient acknowledge that finasteride changes PSA test results.

- `I understand that if I need a prostate blood test, the doctor will need to know I am on this medicine.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**26. Are you taking any medication for high blood pressure (hypertension)?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Regaine (minoxidil) is not suitable for men on blood-pressure medicine.  
Downstream: Follow-ups: "As you are taking medication for high blood pressure, Regaine is not …".

- `Yes` → **Adds questions**: Shows the follow-up "As you are taking medication for high blood pressure, Regaine is not suitable for you. Would you prefer to have tablets without Regaine?" (runs/x10-bundle-bp-drop-regaine). Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[observed]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**27. As you are taking medication for high blood pressure, Regaine is not suitable for you. Would you prefer to have tablets without Regaine?**  
_single · anonymous · role: product-selector · shown: Only when "Are you taking any medication for high blood pressure (hypertension)?" is answered "Yes" · no branch · code_  
Why they ask: Offers to drop Regaine and keep tablets only.

- `Yes - please change my prescription to tablets alone.` → **Flags for the clinician**: The patient asks to drop Regaine (amber flag). Observed: the order on the website does NOT change; it stays the bundle at £50.36 and goes on to ID photos (runs/x10-bundle-bp-drop-regaine). Any switch to tablets only is left to the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle), Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**28. Are you taking any prescription-only medicines, over-the-counter medicines, alternative medicines or recreational drugs?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Full medicines history for the clinician.  
Downstream: Follow-ups: "You've told me you don't take any medication at all. Is that right?".

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please give me the names of all your medicines") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You've told me you don't take any medication at all. Is that right?". _[code]_

**29. You've told me you don't take any medication at all. Is that right?**  
_single · anonymous · role: safety-screen · shown: Only when "Are you taking any prescription-only medicines, over-the-counter medi…" is answered "No" · no branch · code_  
Why they ask: Double-checks a "no medicines" answer.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Correct - I'm not on any medication` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `No, I forgot to tell you something` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me here") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**30. Do you have any of the following conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Conditions that matter for finasteride (and, in bundles, for Regaine).  
Downstream: Follow-ups: "Sexual dysfunction (including decreased sex drive and erectile dysfun…"; "Depression is an uncommon side effect of Finasteride/Propecia. If you…"; "If you’re experiencing thoughts of self harm or suicide, help is avai…".

- `Cancer` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Liver condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Sexual problems` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommo…". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Depression` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Depression is an uncommon side effect of Finasteride/Propecia. If your depression gets wo…". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Suicidal thoughts` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If you’re experiencing thoughts of self harm or suicide, help is available. Please call N…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _[code]_
- `Skin condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Kidney/urinary condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Hereditary problems of galactose intolerance, Lapp lactase deficiency or glucosegalactose malabsorption` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `High blood pressure (hypertension)` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. _[code]_

**31. Depression is an uncommon side effect of Finasteride/Propecia. If your depression gets worse, please stop this medicine and contact us as soon as possible.**  
_consent · anonymous · role: consent · shown: Only when "Do you have any of the following conditions?" is answered "Depression" · no branch · code_  
Why they ask: Makes a patient with this condition acknowledge the matching side-effect warning.  
Downstream: Helper text under the question: "Please tick to confirm that you have understood this."

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**32. Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommon side effect of Finasteride/Propecia. If your sexual dysfunction gets worse, please stop this medicine and contact your doctor.**  
_consent · anonymous · role: consent · shown: Only when "Do you have any of the following conditions?" is answered "Sexual problems" · no branch · code_  
Why they ask: Makes a patient with this condition acknowledge the matching side-effect warning.

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**33. If you’re experiencing thoughts of self harm or suicide, help is available. Please call NHS 111, your local NHS Mental Health Crisis service, or your GP. You can also call the Samaritans on 116 123 OR text Shout on 85258.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Do you have any of the following conditions?" is answered "Suicidal thoughts" · no branch · code_  
Why they ask: Signposts crisis help and tells the patient the medicine is not suitable.

- `I understand that this medication is not suitable for me and I will stop this application.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**34. Other than those already mentioned, do you have any other significant medical conditions, illnesses, hospital stays or past surgical procedures?**  
_single · anonymous · role: safety-screen · shown: always · no branch · code_  
Why they ask: Catch-all medical history.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**35. Do you have any known allergies?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Allergy check.  
Downstream: Follow-ups: "Are you allergic to any of the following?".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you allergic to any of the following?". _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**36. Are you allergic to any of the following?**  
_multi · anonymous · role: safety-screen · shown: Only when "Do you have any known allergies?" is answered "Yes" · no branch · code_  
Why they ask: Allergy detail; medicine allergies are flagged.

- `Penicillin` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Other medicines` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Grass, pollen, trees, or plants (hayfever)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `House dust` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Animals (dogs, cats, horses etc)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Nuts` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Something else` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**37. I want to check your understanding of the hair loss treatment. Please tell me: You will need to take the treatment for at least 3-6 months before you see any benefit, and stopping treatment will reverse any regrowth and hair loss will resume.**  
_single · anonymous · role: expectation-setting · shown: always · BRANCHES · code_  
Why they ask: Checks the patient knows it takes 3 to 6 months and stops working when stopped.  
Downstream: Follow-ups: "The medication takes several months to work and so you won’t start to…".

- `True` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `False` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "The medication takes several months to work and so you won’t start to see a benefit for 3…". _[code]_

**38. The medication takes several months to work and so you won’t start to see a benefit for 3-6 months**  
_consent · anonymous · role: expectation-setting · shown: Only when "I want to check your understanding of the hair loss treatment. Please…" is answered "False" · no branch · code_  
Why they ask: Corrects a wrong answer to the understanding check.

- `I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**39. Please note that these medicines can affect prostate blood test results. If you need a prostate blood test, tell your doctor that you take finasteride or propecia.**  
_consent · anonymous · role: consent · shown: always · no branch · code_  
Why they ask: Makes the patient acknowledge that finasteride changes PSA test results.

- `I understand that if I need a prostate blood test, the doctor will need to know I am on this medicine.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**40. You should know about the following important side effects that have occurred in some men: Depression and suicidal thoughts; Sexual problems, such as erectile dysfunction, that can last even when medication is stopped; Increase risk of breast tenderness**  
_consent · anonymous · role: consent · shown: always · no branch · code_  
Why they ask: Side-effect warning the patient must acknowledge.

- `I understand and wish to continue` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**41. If you experience these side effects, please stop the medication and send a message to Boots Online Doctor**  
_single · anonymous · role: consent · shown: always · BRANCHES · code_  
Why they ask: Tells the patient to stop and message the service; offers the leaflet.  
Downstream: Follow-ups: "Here is the Patient Information Leaflet for Finasteride with further …". Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I'd like more information` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Here is the Patient Information Leaflet for Finasteride with further details- please copy…". _[code]_

**42. Here is the Patient Information Leaflet for Finasteride with further details- please copy and paste this link into your browser: https://www.medicines.org.uk/emc/files/pil.7068.pdf**  
_single · anonymous · role: consent · shown: Only when "If you experience these side effects, please stop the medication and …" is answered "I'd like more information" · no branch · code_  
Why they ask: Gives the leaflet link; lets the patient ask a question.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I'd like to ask more about side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("How can I help?") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**43. Before we finish, is there anything else you want to tell me?**  
_single · anonymous · role: data-capture · shown: always · no branch · code_  
Why they ask: Free-text catch-all for the clinician.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**44. Would you like me to tell your GP about any care we provide? Ideally your GP should know about any medicines you’re taking.**  
_single · anonymous · role: data-capture · shown: always · no branch · code_  
Why they ask: Asks permission to inform the GP and, if yes, collects the GP practice.

- `Yes` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Opens a GP practice search box (a GP surgery name or postcode); not used in this research. _[code]_
- `No (This won't affect our review of your order, but we would encourage you to tell your GP)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**45. Please confirm: you understand the questions asked; have answered them honestly; any treatment is for you only. You should read our clinicians’ advice and also, the patient information leaflet that comes with any medication. You can message us if needed.**  
_consent · anonymous · role: consent · shown: always · no branch · code_  
Why they ask: Final declaration of honesty and own use.

- `Please tick to confirm that you understand and agree` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**46. Let's confirm it's you. We need to verify your identity before we can prescribe. You'll be asked for: a selfie; a photo of your ID**  
_photo · anonymous · role: identity · shown: always, straight after the last health question (task 2 of the order) · no branch · code_  
Why they ask: Identity check before prescribing ("Regulations require us to see who we're treating." in the order data). ID wording in the app parameters: driver's licence or passport, with full name, date of birth and face visible.

- `Open camera` → **Unknown**: Starts the selfie and photo-ID capture: the research stops here (photos not allowed). What follows (account, delivery, payment, clinician review) was not seen. _[unknown]_

**47. Account-Setup (task name in the order; screen not reached). App parameter text: "CREATE ACCOUNT" with terms, privacy and marketing tick boxes.**  
_contact · after-account · role: identity · shown: after the ID photos (task 4 of the order) · no branch · code_  
Why they ask: Real account: email, name, mobile number, address, password. Replaces the placeholder temporary user.


**48. Delivery (task name in the order; screen not reached). App parameter title: "WOULD YOU LIKE TO PICK UP IN STORE (FASTEST)?"**  
_single · checkout · role: data-capture · shown: after account set-up (task 5 of the order) · no branch · code_  
Why they ask: How the medicine is supplied. No subscription or automatic refill option is in the order data.

- `Mail order one-time ("Ship to me just once")` → **No effect**: Free Royal Mail Tracked 48 delivery. Marked as the default option in the order data. _[code]_
- `Pharmacy pick-up ("I'll pick up at a local pharmacy")` → **No effect**: Collect from a Boots pharmacy (not Jersey or Guernsey), usually within 2 business hours of the prescription being written. _[code]_

**49. Payment (task name in the order; screen not reached). App content: "Your Order", "If we don’t prescribe, we’ll refund you.", button "Place Order".**  
_info · checkout · role: data-capture · shown: last task of the order (task 6) · no branch · code_  
Why they ask: Card details. Placing the order sends the visit to a clinician ("Your order is being reviewed by a clinician … within 24 hours").


### Men, returning, tablets only

Entry: https://onlinedoctor-clinic.boots.com/Hair-Loss

Postcode → birth gender → date of birth (site creates a placeholder temporary user) → first time or returning → patient picks medicine and pack → product page → honesty tick box → 19 health-question screens (36 questions with follow-ups; questionnaire 2051) → ID photos (selfie + photo ID: research stops here) → account set-up → delivery or pick-up → payment → clinician review within 24 hours.

**1. What's your postcode?**  
_text · anonymous · role: eligibility-gate · shown: always (first screen of every hair-loss entry) · BRANCHES · observed_  
Why they ask: Service-area check before anything else.  
Downstream: Jersey postcode (JE2 4WD) refused: "We do not currently provide our service to this postcode." (runs/x05-jersey). Unknown postcodes: "Sorry, Boots isn't in your postcode yet." (app code, not tested). Next stays disabled until the postcode passes.


**2. What’s your birth gender?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Hair-loss treatment here is for men only. (Seen live in runs/x12-returning-baseline.)  
Downstream: Female cannot continue.

- `Female` → **Stops the patient**: Stops here. The service is set to male only (genders ["male"] in the service list). Message in the app code: "We're sorry, this service isn't available for the sex you were assigned at birth. Visit Boots Health Hub for advice." Not tested live. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Male` → **Next question**: Next is enabled; goes to date of birth. (Seen live in runs/x12-returning-baseline.) _[observed]_

**3. What’s your date of birth? (Please make sure this is accurate to avoid delays to your treatment)**  
_date · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Age check. Also used later to match the photo ID.  
Downstream: Age 17 refused: "Based on your age, you're not suitable for our online service. Please speak with a local GP or clinic" (runs/x03-age17). Age 75 accepted with the same products and prices (runs/x04-age75). Server limits 18 to 120.


**4. Have you used this service before?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Splits new patients from returning ones. (Seen live in runs/x12-returning-baseline.)  
Downstream: Chooses the child service (HAI-F or HAI-R), and with it the product list and the questionnaire. It is self-declared: a brand-new anonymous visitor can pick "Returning" (observed).

- `First time using this service` → **Next question**: Opens the first-time product list (child service HAI-F). On the day tested only one-month packs could be chosen there; larger packs showed "Out of stock". (Seen live in runs/x12-returning-baseline.) _[observed]_
- `Returning for this service` → **Adds questions**: Opens the returning product list (child service HAI-R): same medicines and prices, every pack size available, larger packs shown first. Uses the returning questionnaires, which add one side-effect question. (Seen live in runs/x12-returning-baseline.) _[observed]_

**5. Which medicine do you prefer? (Ultimately it will be a joint decision between you and one of our clinicians on whether a particular medicine is appropriate.)**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The patient, not an engine, chooses the medicine, brand and pack size before any medical question.  
Downstream: Tablets-only packs load one questionnaire and Regaine bundles load another (ids 2049 / 2050 first-time, 2051 / 2052 returning). Featured packs are shown first; the rest (including every bundle that is available) sit behind "See more treatment options", which also has a search box. The site content also holds a "No-Choice" product entry (code HAI-F-No-Choice) that was not shown on screen.

- `Finasteride 1mg, 28 Tablets, £28` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 56 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 84 Tablets, £80` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Walked with sku 24-9. (Seen live in runs/x12-returning-baseline.) _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg, 168 Tablets, £138` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 364 Tablets, £245` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Propecia 1mg, 28 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. Observed: Propecia uses the same questionnaire as generic finasteride (2049 for first-time tablets, runs/x06-propecia). _(affects: Propecia 1mg tablets (brand))_ _[observed]_
- `Propecia 1mg, 56 Tablets, £98` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 84 Tablets, £119` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 168 Tablets, £216` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 364 Tablets, £400` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Finasteride 1mg (28 tablets) \| Regaine foam extra strength (73ml), £50.36` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Walked with sku 829-9. (Seen live in runs/x12-returning-baseline.) _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[observed]_
- `Finasteride 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £108` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Finasteride 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £181.59` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Finasteride 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £334.39` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (28 tablets) \| Regaine foam extra strength (73ml), £72` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £139` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £244` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £458` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_

**6. Product page for the chosen pack: name, price, short description, and four fold-out sections: "Is it suitable for me?", "How to take it", "How it works", "What else should I know?"**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Shows who should not take the medicine before the questions start. (Seen live in runs/x12-returning-baseline.)

- `Continue` → **Next question**: Creates the draft order on the server (status "Not submitted") with this task list: Health Questions, ID Photos, Account-Setup, Delivery, Payment. (Seen live in runs/x12-returning-baseline.) _[observed]_

**7. Important info: Just like a traditional consultation we're going to ask you about your medical history and symptoms. Your answers will help us assess your suitability for treatment. Please answer all questions honestly and in full. If you have any problems understanding or answering a question please call or message us.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Honesty statement before the medical questions. (Seen live in runs/x12-returning-baseline.)

- `I understand the important information above.` → **Next question**: Tick box. Continue stays disabled until it is ticked, then the health questions open. (Seen live in runs/x12-returning-baseline.) _[observed]_

**8. Which of the following best describes your hair loss? (Tick all that apply)**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Checks the pattern fits male pattern baldness (temples, crown). Patches or complete loss suggest another cause.  
Downstream: Follow-ups: "Are you experiencing any areas of hair loss on your scalp that look l…"; "Do you have complete baldness?". The wording says "Tick all that apply" but only one option can be chosen (max 1).

- `Temples only (receding at the front)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Temples and Crown` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Random patches` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you experiencing any areas of hair loss on your scalp that look like circular patches…". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Complete` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Do you have complete baldness?". _[code]_

**9. Are you experiencing any areas of hair loss on your scalp that look like circular patches, with a smooth surface?**  
_single · anonymous · role: diagnosis · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Random patches" · no branch · code_  
Why they ask: Screens for alopecia areata (smooth round patches), which this service does not treat.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `No` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**10. Do you have complete baldness?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Complete" · no branch · code_  
Why they ask: Finasteride is unlikely to help once most hair is lost.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `No, it affects mostly the front and top of my scalp` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**11. Do you have any of the following? Please select all that apply.**  
_multi · anonymous · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Looks for scalp disease that could be the real cause or needs treating first.  
Downstream: Follow-ups: "Treatment will be less effective if you have damaged hair follicles f…".

- `Psoriasis, fungal infections such as ringworm, or dandruff of your scalp` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Treatment will be less effective if you have damaged hair follicles from a scalp conditio…". _[code]_
- `Itchy, rough or scaling areas on your scalp` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Treatment will be less effective if you have damaged hair follicles from a scalp conditio…". _[code]_
- `Any pain, burning/ blistering or pus-filled spots on the scalp` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `None of the above` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. _[code]_

**12. Treatment will be less effective if you have damaged hair follicles from a scalp condition. I recommend you sort your scalp condition before starting this treatment.**  
_single · anonymous · role: expectation-setting · shown: Only when "Do you have any of the following? Please select all that apply." is answered "Psoriasis, fungal infections such as ringworm, or dandruff of your scalp" or "Itchy, rough or scaling areas on your scalp" · no branch · code_  
Why they ask: Warns that a scalp condition makes treatment work less well; the patient chooses to go on or stop.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to continue with my consultation` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I understand and do not wish to continue with my consultation.  I will stop this consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**13. Have you lost any hair elsewhere on your body?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Body hair loss points away from male pattern baldness.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**14. When did you start losing your hair?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Very recent hair loss is not typical of male pattern baldness.

- `Within the last month` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `More than a month ago` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**15. How did your hair loss start?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Male pattern baldness is gradual; sudden loss suggests another cause.  
Downstream: Follow-ups: "Sudden hair loss is unusual. Treatment is designed to treat the initi…".

- `Suddenly` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sudden hair loss is unusual. Treatment is designed to treat the initial stages of male pa…". _[code]_
- `Gradually` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**16. Sudden hair loss is unusual. Treatment is designed to treat the initial stages of male pattern baldness, which usually happens gradually.**  
_single · anonymous · role: expectation-setting · shown: Only when "How did your hair loss start?" is answered "Suddenly" · no branch · code_  
Why they ask: Warns that sudden loss is not what the treatment is for; the patient chooses to go on or stop.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to continue with this consultation` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I understand and do not wish to continue. I will stop my consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**17. Are you currently using Finasteride or Propecia for hair loss?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · code_  
Why they ask: Separates new starters from men already on treatment and opens the follow-up questions.  
Downstream: Follow-ups: "Is it effective?"; "Do you experience any side effects?"; "I want to remind you that depression, suicidal thoughts and sexual dy…".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Is it effective?" and "Do you experience any side effects?" and "I want to remind you that depression, suicidal thoughts and sexual dysfunction can occur.…". _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**18. Is it effective?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: No point continuing a treatment that has not worked.

- `Yes` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Not yet, but I've been using it for less than 6 months` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Not sure, but I'd like to continue. I understand if there's no improvement after 6 months then it's unlikely to work for me.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**19. Do you experience any side effects?**  
_single · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Picks up side effects from current finasteride use.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**20. I want to remind you that depression, suicidal thoughts and sexual dysfunction can occur. Do you think any of these have happened to you?**  
_multi · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Asks directly about the MHRA-highlighted side effects (depression, suicidal thoughts, sexual dysfunction) in men already on treatment.

- `Depression` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `Suicidal thoughts` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `Sexual dysfunction` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `None of the above` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. _[code]_

**21. Is your partner pregnant or trying to get pregnant?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Finasteride can harm a male foetus; trying to conceive is a reason not to treat.  
Downstream: Follow-ups: "If your partner is pregnant you must use condoms while taking finaste…"; "As your partner is trying to get pregnant, you should not use this me…".

- `My partner is pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If your partner is pregnant you must use condoms while taking finasteride or Propecia to …". _[code]_
- `My partner is trying to get pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As your partner is trying to get pregnant, you should not use this medication. If you're …". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**22. If your partner is pregnant you must use condoms while taking finasteride or Propecia to prevent harm to the baby.**  
_consent · anonymous · role: consent · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is pregnant" · no branch · code_  
Why they ask: Makes the patient confirm the condom advice when a partner is pregnant.  
Downstream: Helper text under the question: "Please confirm that you understand this."

- `I confirm that I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**23. As your partner is trying to get pregnant, you should not use this medication. If you're already taking finasteride or Propecia, we recommend you stop taking it for at least 2 weeks before trying to conceive with your partner.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is trying to get pregnant" · no branch · code_  
Why they ask: Tells the patient the medicine is not suitable while trying to conceive.

- `I understand and will stop my consultation.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**24. Are you taking medication for a prostate condition?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Looks for finasteride 5 mg or similar medicines, and for men whose PSA tests matter.  
Downstream: Follow-ups: "You need to know that these medicines can affect prostate blood test …".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You need to know that these medicines can affect prostate blood test results. If you need…". Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**25. You need to know that these medicines can affect prostate blood test results. If you need a prostate blood test, tell your doctor that you take finasteride or propecia.**  
_consent · anonymous · role: consent · shown: Only when "Are you taking medication for a prostate condition?" is answered "Yes" · no branch · code_  
Why they ask: Makes the patient acknowledge that finasteride changes PSA test results.

- `I understand that If I need a prostate blood test, the doctor will need to know I am on this medication.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**26. Are you taking any other prescription-only medicines, over-the-counter medicines, alternative medicines or recreational drugs?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Full medicines history for the clinician.  
Downstream: Follow-ups: "You've told me you don't take any medication at all. Is that right?".

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You've told me you don't take any medication at all. Is that right?". _[code]_

**27. You've told me you don't take any medication at all. Is that right?**  
_multi · anonymous · role: safety-screen · shown: Only when "Are you taking any other prescription-only medicines, over-the-counte…" is answered "No" · no branch · code_  
Why they ask: Double-checks a "no medicines" answer.

- `Correct - I'm not on any medication` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `No, I forgot to tell you something` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me here") that must be filled in before Next works. Ticking it clears the other boxes. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**28. Do you have any of the following conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Conditions that matter for finasteride (and, in bundles, for Regaine).  
Downstream: Follow-ups: "Depression and suicidal thoughts are an uncommon side effect of Finas…"; "If you’re experiencing thoughts of self harm or suicide, help is avai…"; "Sexual dysfunction (including decreased sex drive and erectile dysfun…".

- `Cancer` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Liver condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Depression` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Depression and suicidal thoughts are an uncommon side effect of Finasteride/Propecia. If …". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Suicidal thoughts` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If you’re experiencing thoughts of self harm or suicide, help is available. Please call N…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _[code]_
- `Sexual dysfunction (including decreased sex drive and erectile dysfunction)` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommo…". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Skin condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Kidney/urinary condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Hereditary problems of galactose intolerance, Lapp lactase deficiency or glucosegalactose malabsorption` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. _[code]_

**29. Depression and suicidal thoughts are an uncommon side effect of Finasteride/Propecia. If your depression gets worse, please stop this medicine and contact your doctor as soon as possible.**  
_consent · anonymous · role: consent · shown: Only when "Do you have any of the following conditions?" is answered "Depression" · no branch · code_  
Why they ask: Makes a patient with this condition acknowledge the matching side-effect warning.  
Downstream: Helper text under the question: "Please tick to confirm that you have understood this."

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**30. Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommon side effect of Finasteride/Propecia. If your sexual dysfunction gets worse, please stop this medicine and contact your doctor as soon as possible.**  
_consent · anonymous · role: consent · shown: Only when "Do you have any of the following conditions?" is answered "Sexual dysfunction (including decreased sex drive and erectile dysfunction)" · no branch · code_  
Why they ask: Makes a patient with this condition acknowledge the matching side-effect warning.

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**31. If you’re experiencing thoughts of self harm or suicide, help is available. Please call NHS 111, your local NHS Mental Health Crisis service, or your GP. You can also call the Samaritans on 116 123 OR text Shout on 85258.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Do you have any of the following conditions?" is answered "Suicidal thoughts" · no branch · code_  
Why they ask: Signposts crisis help and tells the patient the medicine is not suitable.

- `I understand that this medication is not suitable for me and I will stop this application.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**32. Other than those already mentioned, do you have any other significant medical conditions, illnesses, hospital stays or past surgical procedures?**  
_single · anonymous · role: safety-screen · shown: always · no branch · code_  
Why they ask: Catch-all medical history.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**33. Do you have any known allergies?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Allergy check.  
Downstream: Follow-ups: "Are you allergic to any of the following?".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you allergic to any of the following?". _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**34. Are you allergic to any of the following?**  
_multi · anonymous · role: safety-screen · shown: Only when "Do you have any known allergies?" is answered "Yes" · no branch · code_  
Why they ask: Allergy detail; medicine allergies are flagged.

- `Penicillin` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Other medicines` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Grass, pollen, trees, or plants (hayfever)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `House dust` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Animals (dogs, cats, horses etc)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Nuts` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Something else` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**35. I want to check your understanding of the hair loss treatment. Please tell me: You will need to take the treatment for at least 3-6 months before you see any benefit, and stopping treatment will reverse any regrowth and hair loss will resume.**  
_single · anonymous · role: expectation-setting · shown: always · BRANCHES · code_  
Why they ask: Checks the patient knows it takes 3 to 6 months and stops working when stopped.  
Downstream: Follow-ups: "The medication takes several months to work and so you won’t start to…".

- `True` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `False` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "The medication takes several months to work and so you won’t start to see a benefit for 3…". _[code]_

**36. The medication takes several months to work and so you won’t start to see a benefit for 3-6 months**  
_consent · anonymous · role: expectation-setting · shown: Only when "I want to check your understanding of the hair loss treatment. Please…" is answered "False" · no branch · code_  
Why they ask: Corrects a wrong answer to the understanding check.

- `I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**37. You also need to know that these medicines can affect prostate blood test results. So if you need a prostate blood test, tell your doctor that you take finasteride or propecia.**  
_consent · anonymous · role: consent · shown: always · no branch · code_  
Why they ask: Makes the patient acknowledge that finasteride changes PSA test results.

- `I understand that if I need a prostate blood test, the doctor will need to know I am on this medicine.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**38. You should know about the following important side effects that have occurred in some men: Depression and suicidal thoughts; Sexual problems, such as erectile dysfunction, that can last even when medication is stopped; Increase risk of breast tenderness**  
_consent · anonymous · role: consent · shown: always · no branch · code_  
Why they ask: Side-effect warning the patient must acknowledge.

- `I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**39. If you experience these side effects, please stop the medication and send a message to Boots Online Doctor**  
_single · anonymous · role: consent · shown: always · BRANCHES · code_  
Why they ask: Tells the patient to stop and message the service; offers the leaflet.  
Downstream: Follow-ups: "Here is the Patient Information Leaflet for Finasteride with further …". Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I'd like more information` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Here is the Patient Information Leaflet for Finasteride with further details- please copy…". _[code]_

**40. Here is the Patient Information Leaflet for Finasteride with further details- please copy and paste this link into your browser: https://www.medicines.org.uk/emc/files/pil.7068.pdf**  
_single · anonymous · role: consent · shown: Only when "If you experience these side effects, please stop the medication and …" is answered "I'd like more information" · no branch · code_  
Why they ask: Gives the leaflet link; lets the patient ask a question.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I'd like to ask more about side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("How can I help?") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**41. Would you like me to tell your GP about any care we provide? Ideally your GP should know about any medicines you’re taking.**  
_single · anonymous · role: data-capture · shown: always · no branch · code_  
Why they ask: Asks permission to inform the GP and, if yes, collects the GP practice.

- `Yes` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Opens a GP practice search box (a GP surgery name or postcode); not used in this research. _[code]_
- `No (This won't affect our review of your order, but we would encourage you to tell your GP)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**42. Before we finish, is there anything else you want to tell me?**  
_single · anonymous · role: data-capture · shown: always · no branch · code_  
Why they ask: Free-text catch-all for the clinician.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**43. Please confirm that you understand the questions asked and have answered them honestly. This treatment is for you only. You should read the patient information leaflet that comes with your medicine and send us a message if you have further questions.**  
_consent · anonymous · role: consent · shown: always · no branch · code_  
Why they ask: Final declaration of honesty and own use.

- `Please tick to confirm that you understand and agree` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**44. Let's confirm it's you. We need to verify your identity before we can prescribe. You'll be asked for: a selfie; a photo of your ID**  
_photo · anonymous · role: identity · shown: always, straight after the last health question (task 2 of the order) · no branch · code_  
Why they ask: Identity check before prescribing ("Regulations require us to see who we're treating." in the order data). ID wording in the app parameters: driver's licence or passport, with full name, date of birth and face visible.

- `Open camera` → **Unknown**: Starts the selfie and photo-ID capture: the research stops here (photos not allowed). What follows (account, delivery, payment, clinician review) was not seen. _[unknown]_

**45. Account-Setup (task name in the order; screen not reached). App parameter text: "CREATE ACCOUNT" with terms, privacy and marketing tick boxes.**  
_contact · after-account · role: identity · shown: after the ID photos (task 4 of the order) · no branch · code_  
Why they ask: Real account: email, name, mobile number, address, password. Replaces the placeholder temporary user.


**46. Delivery (task name in the order; screen not reached). App parameter title: "WOULD YOU LIKE TO PICK UP IN STORE (FASTEST)?"**  
_single · checkout · role: data-capture · shown: after account set-up (task 5 of the order) · no branch · code_  
Why they ask: How the medicine is supplied. No subscription or automatic refill option is in the order data.

- `Mail order one-time ("Ship to me just once")` → **No effect**: Free Royal Mail Tracked 48 delivery. Marked as the default option in the order data. _[code]_
- `Pharmacy pick-up ("I'll pick up at a local pharmacy")` → **No effect**: Collect from a Boots pharmacy (not Jersey or Guernsey), usually within 2 business hours of the prescription being written. _[code]_

**47. Payment (task name in the order; screen not reached). App content: "Your Order", "If we don’t prescribe, we’ll refund you.", button "Place Order".**  
_info · checkout · role: data-capture · shown: last task of the order (task 6) · no branch · code_  
Why they ask: Card details. Placing the order sends the visit to a clinician ("Your order is being reviewed by a clinician … within 24 hours").


### Men, returning, tablets + Regaine foam bundle

Entry: https://onlinedoctor-clinic.boots.com/Hair-Loss

Postcode → birth gender → date of birth (site creates a placeholder temporary user) → first time or returning → patient picks medicine and pack → product page → honesty tick box → 21 health-question screens (39 questions with follow-ups; questionnaire 2052) → ID photos (selfie + photo ID: research stops here) → account set-up → delivery or pick-up → payment → clinician review within 24 hours.

**1. What's your postcode?**  
_text · anonymous · role: eligibility-gate · shown: always (first screen of every hair-loss entry) · BRANCHES · observed_  
Why they ask: Service-area check before anything else.  
Downstream: Jersey postcode (JE2 4WD) refused: "We do not currently provide our service to this postcode." (runs/x05-jersey). Unknown postcodes: "Sorry, Boots isn't in your postcode yet." (app code, not tested). Next stays disabled until the postcode passes.


**2. What’s your birth gender?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Hair-loss treatment here is for men only. (Seen live in runs/verify-b04-returning-bundle.)  
Downstream: Female cannot continue.

- `Female` → **Stops the patient**: Stops here. The service is set to male only (genders ["male"] in the service list). Message in the app code: "We're sorry, this service isn't available for the sex you were assigned at birth. Visit Boots Health Hub for advice." Not tested live. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Male` → **Next question**: Next is enabled; goes to date of birth. (Seen live in runs/verify-b04-returning-bundle.) _[observed]_

**3. What’s your date of birth? (Please make sure this is accurate to avoid delays to your treatment)**  
_date · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Age check. Also used later to match the photo ID.  
Downstream: Age 17 refused: "Based on your age, you're not suitable for our online service. Please speak with a local GP or clinic" (runs/x03-age17). Age 75 accepted with the same products and prices (runs/x04-age75). Server limits 18 to 120.


**4. Have you used this service before?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Splits new patients from returning ones. (Seen live in runs/verify-b04-returning-bundle.)  
Downstream: Chooses the child service (HAI-F or HAI-R), and with it the product list and the questionnaire. It is self-declared: a brand-new anonymous visitor can pick "Returning" (observed).

- `First time using this service` → **Next question**: Opens the first-time product list (child service HAI-F). On the day tested only one-month packs could be chosen there; larger packs showed "Out of stock". (Seen live in runs/verify-b04-returning-bundle.) _[observed]_
- `Returning for this service` → **Adds questions**: Opens the returning product list (child service HAI-R): same medicines and prices, every pack size available, larger packs shown first. Uses the returning questionnaires, which add one side-effect question. (Seen live in runs/verify-b04-returning-bundle.) _[observed]_

**5. Which medicine do you prefer? (Ultimately it will be a joint decision between you and one of our clinicians on whether a particular medicine is appropriate.)**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The patient, not an engine, chooses the medicine, brand and pack size before any medical question.  
Downstream: Tablets-only packs load one questionnaire and Regaine bundles load another (ids 2049 / 2050 first-time, 2051 / 2052 returning). Featured packs are shown first; the rest (including every bundle that is available) sit behind "See more treatment options", which also has a search box. The site content also holds a "No-Choice" product entry (code HAI-F-No-Choice) that was not shown on screen.

- `Finasteride 1mg, 28 Tablets, £28` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 56 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 84 Tablets, £80` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Walked with sku 24-9. (Seen live in runs/verify-b04-returning-bundle.) _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg, 168 Tablets, £138` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 364 Tablets, £245` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Propecia 1mg, 28 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. Observed: Propecia uses the same questionnaire as generic finasteride (2049 for first-time tablets, runs/x06-propecia). _(affects: Propecia 1mg tablets (brand))_ _[observed]_
- `Propecia 1mg, 56 Tablets, £98` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 84 Tablets, £119` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 168 Tablets, £216` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 364 Tablets, £400` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Finasteride 1mg (28 tablets) \| Regaine foam extra strength (73ml), £50.36` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Walked with sku 829-9. (Seen live in runs/verify-b04-returning-bundle.) _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[observed]_
- `Finasteride 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £108` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Finasteride 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £181.59` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Finasteride 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £334.39` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (28 tablets) \| Regaine foam extra strength (73ml), £72` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £139` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £244` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £458` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_

**6. Product page for the chosen pack: name, price, short description, and four fold-out sections: "Is it suitable for me?", "How to take it", "How it works", "What else should I know?"**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Shows who should not take the medicine before the questions start. (Seen live in runs/verify-b04-returning-bundle.)

- `Continue` → **Next question**: Creates the draft order on the server (status "Not submitted") with this task list: Health Questions, ID Photos, Account-Setup, Delivery, Payment. (Seen live in runs/verify-b04-returning-bundle.) _[observed]_

**7. Important info: Just like a traditional consultation we're going to ask you about your medical history and symptoms. Your answers will help us assess your suitability for treatment. Please answer all questions honestly and in full. If you have any problems understanding or answering a question please call or message us.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Honesty statement before the medical questions. (Seen live in runs/verify-b04-returning-bundle.)

- `I understand the important information above.` → **Next question**: Tick box. Continue stays disabled until it is ticked, then the health questions open. (Seen live in runs/verify-b04-returning-bundle.) _[observed]_

**8. I need to check your age, please select the category below that applies to you:**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Regaine foam is licensed only up to age 49, so the bundle asks for an age band (although the date of birth was already given).  
Downstream: Follow-ups: "As you're over 49, I want to tell you that Regaine foam is technicall…".

- `Between 18 and 50 years old` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `50 years or older` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As you're over 49, I want to tell you that Regaine foam is technically being prescribed o…". _[code]_

**9. As you're over 49, I want to tell you that Regaine foam is technically being prescribed off-label. This means the drug company licence only covers up to the age of 49, but it's commonly used by men over this age.**  
_single · anonymous · role: product-selector · shown: Only when "I need to check your age, please select the category below that appli…" is answered "50 years or older" · no branch · code_  
Why they ask: Tells men aged 50 or over that Regaine would be off-label and lets them drop it for tablets only.

- `I understand and will continue` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I'd rather NOT have Regaine, please change my prescription to Finasteride tablets only.` → **Flags for the clinician**: The patient asks to drop Regaine. Inferred from the first-time bundle (runs/x10-bundle-bp-drop-regaine): the website does not change the order; the clinician decides. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle), Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[inferred]_

**10. Which of the following best describes your hair loss? (Tick all that apply)**  
_multi · anonymous · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Checks the pattern fits male pattern baldness (temples, crown). Patches or complete loss suggest another cause.  
Downstream: Follow-ups: "Are you experiencing any areas of hair loss on your scalp that look l…"; "Do you have complete baldness?". Up to 4 options may be ticked.

- `Temples only (receding at the front)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Temples and Crown` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Random patches` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you experiencing any areas of hair loss on your scalp that look like circular patches…". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Complete` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Do you have complete baldness?". _[code]_

**11. Are you experiencing any areas of hair loss on your scalp that look like circular patches, with a smooth surface?**  
_single · anonymous · role: diagnosis · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Random patches" · no branch · code_  
Why they ask: Screens for alopecia areata (smooth round patches), which this service does not treat.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**12. Do you have complete baldness?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Complete" · no branch · code_  
Why they ask: Finasteride is unlikely to help once most hair is lost.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No, it affects mostly the front and top of my scalp` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**13. Do you have broken, infected, shaved or inflamed skin on your scalp?**  
_single · anonymous · role: safety-screen · shown: always · no branch · code_  
Why they ask: Regaine must not go on damaged, infected, inflamed or shaved scalp skin.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**14. Have you lost any hair elsewhere on your body?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Body hair loss points away from male pattern baldness.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**15. When did you start losing your hair?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Very recent hair loss is not typical of male pattern baldness.

- `Within the last month` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `More than a month ago` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**16. How did your hair loss start?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Male pattern baldness is gradual; sudden loss suggests another cause.  
Downstream: Follow-ups: "Sudden hair loss is unusual. These treatments are specifically design…".

- `Suddenly` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sudden hair loss is unusual. These treatments are specifically designed to treat the init…". _[code]_
- `Gradually` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**17. Sudden hair loss is unusual. These treatments are specifically designed to treat the initial stages of male pattern baldness, which usually happens gradually.**  
_single · anonymous · role: expectation-setting · shown: Only when "How did your hair loss start?" is answered "Suddenly" · no branch · code_  
Why they ask: Warns that sudden loss is not what the treatment is for; the patient chooses to go on or stop.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to go ahead with treatment.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I understand and do not wish to continue. I will stop this consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**18. Are you currently using Finasteride or Propecia for hair loss?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · code_  
Why they ask: Separates new starters from men already on treatment and opens the follow-up questions.  
Downstream: Follow-ups: "Is it effective?"; "Do you experience any of the following side effects? Low mood, suicid…"; "I want to remind you that depression, suicidal thoughts and sexual dy…".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Is it effective?" and "Do you experience any of the following side effects? Low mood, suicidal thoughts or sexua…" and "I want to remind you that depression, suicidal thoughts and sexual dysfunction can occur.…". _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**19. Is it effective?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: No point continuing a treatment that has not worked.

- `Yes` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Not yet, but I've been using it for less than 6 months and want to continue` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Not sure, but I understand that if I don't see improvement or slowing of my hair loss after 6 months, continuing to take treatment is unlikely to be effective for me.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**20. Do you experience any of the following side effects? Low mood, suicidal thoughts or sexual problems? Please stop the medication if you have these.**  
_single · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Picks up side effects from current finasteride use.

- `Yes I have those side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No, I have other side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No side effects` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**21. I want to remind you that depression, suicidal thoughts and sexual dysfunction can occur. Do you think any of these have happened to you?**  
_multi · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Asks directly about the MHRA-highlighted side effects (depression, suicidal thoughts, sexual dysfunction) in men already on treatment.

- `Depression` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Suicidal thoughts` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Sexual dysfunction` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `None of the above` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. _[code]_

**22. Is your partner pregnant or trying to get pregnant?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Finasteride can harm a male foetus; trying to conceive is a reason not to treat.  
Downstream: Follow-ups: "If your partner is pregnant you must use condoms while taking finaste…"; "As your partner is trying to get pregnant, you should not use this me…".

- `My partner is pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If your partner is pregnant you must use condoms while taking finasteride or Propecia to …". _[code]_
- `My partner is trying to get pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As your partner is trying to get pregnant, you should not use this medication. If you are…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**23. If your partner is pregnant you must use condoms while taking finasteride or Propecia to prevent harm to the baby.**  
_consent · anonymous · role: consent · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is pregnant" · no branch · code_  
Why they ask: Makes the patient confirm the condom advice when a partner is pregnant.  
Downstream: Helper text under the question: "Please confirm that you understand this."

- `I confirm that I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**24. As your partner is trying to get pregnant, you should not use this medication. If you are already taking finasteride or propecia, we recommend you stop taking it for at least 2 weeks before trying to conceive with your partner.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is trying to get pregnant" · no branch · code_  
Why they ask: Tells the patient the medicine is not suitable while trying to conceive.

- `I understand and will stop my consultation.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**25. Are you taking medication for a prostate condition?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Looks for finasteride 5 mg or similar medicines, and for men whose PSA tests matter.  
Downstream: Follow-ups: "You need to know that these medicines can affect prostate blood test …".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You need to know that these medicines can affect prostate blood test results. If you need…". Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**26. You need to know that these medicines can affect prostate blood test results. If you need a prostate blood test, tell your doctor that you take finasteride or propecia.**  
_consent · anonymous · role: consent · shown: Only when "Are you taking medication for a prostate condition?" is answered "Yes" · no branch · code_  
Why they ask: Makes the patient acknowledge that finasteride changes PSA test results.

- `I understand that if I need a prostate blood test, the doctor will need to know I am on this medicine.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**27. Are you taking any medication for high blood pressure (hypertension)?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Regaine (minoxidil) is not suitable for men on blood-pressure medicine.  
Downstream: Follow-ups: "As you are taking medication for high blood pressure, Regaine is not …".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As you are taking medication for high blood pressure, Regaine is not suitable for you. Wo…". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**28. As you are taking medication for high blood pressure, Regaine is not suitable for you. Would you prefer to have tablets without Regaine?**  
_single · anonymous · role: product-selector · shown: Only when "Are you taking any medication for high blood pressure (hypertension)?" is answered "Yes" · no branch · code_  
Why they ask: Offers to drop Regaine and keep tablets only.

- `Yes - please change my prescription to tablets alone.` → **Flags for the clinician**: The patient asks to drop Regaine. Inferred from the first-time bundle (runs/x10-bundle-bp-drop-regaine): the website does not change the order; the clinician decides. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle), Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[inferred]_
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**29. Are you taking any prescription-only medicines, over-the-counter medicines, alternative medicines or recreational drugs?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Full medicines history for the clinician.  
Downstream: Follow-ups: "You've told me you don't take any medication at all. Is that right?".

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please give me the names of all your medicines") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You've told me you don't take any medication at all. Is that right?". _[code]_

**30. You've told me you don't take any medication at all. Is that right?**  
_single · anonymous · role: safety-screen · shown: Only when "Are you taking any prescription-only medicines, over-the-counter medi…" is answered "No" · no branch · code_  
Why they ask: Double-checks a "no medicines" answer.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Correct - I'm not on any medication` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `No, I forgot to tell you something` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me here") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**31. Do you have any of the following conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Conditions that matter for finasteride (and, in bundles, for Regaine).  
Downstream: Follow-ups: "Sexual dysfunction (including decreased sex drive and erectile dysfun…"; "Depression is an uncommon side effect of Finasteride/Propecia. If you…"; "If you’re experiencing thoughts of self harm or suicide, help is avai…".

- `Cancer` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Liver condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Sexual problems` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommo…". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Depression` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Depression is an uncommon side effect of Finasteride/Propecia. If your depression gets wo…". Amber flag (status 2 in the quiz definition): marked for the clinician. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Suicidal thoughts` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If you’re experiencing thoughts of self harm or suicide, help is available. Please call N…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _[code]_
- `Skin condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Kidney/urinary condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Hereditary problems of galactose intolerance, Lapp lactase deficiency or glucosegalactose malabsorption` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `High blood pressure (hypertension)` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. _[code]_

**32. Depression is an uncommon side effect of Finasteride/Propecia. If your depression gets worse, please stop this medicine and contact us as soon as possible.**  
_consent · anonymous · role: consent · shown: Only when "Do you have any of the following conditions?" is answered "Depression" · no branch · code_  
Why they ask: Makes a patient with this condition acknowledge the matching side-effect warning.  
Downstream: Helper text under the question: "Please tick to confirm that you have understood this."

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**33. Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommon side effect of Finasteride/Propecia. If your sexual dysfunction gets worse, please stop this medicine and contact your doctor.**  
_consent · anonymous · role: consent · shown: Only when "Do you have any of the following conditions?" is answered "Sexual problems" · no branch · code_  
Why they ask: Makes a patient with this condition acknowledge the matching side-effect warning.

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**34. If you’re experiencing thoughts of self harm or suicide, help is available. Please call NHS 111, your local NHS Mental Health Crisis service, or your GP. You can also call the Samaritans on 116 123 OR text Shout on 85258.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Do you have any of the following conditions?" is answered "Suicidal thoughts" · no branch · code_  
Why they ask: Signposts crisis help and tells the patient the medicine is not suitable.

- `I understand that this medication is not suitable for me and I will stop this application` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**35. Other than those already mentioned, do you have any other significant medical conditions, illnesses, hospital stays or past surgical procedures?**  
_single · anonymous · role: safety-screen · shown: always · no branch · code_  
Why they ask: Catch-all medical history.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**36. Do you have any known allergies?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Allergy check.  
Downstream: Follow-ups: "Are you allergic to any of the following?".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you allergic to any of the following?". _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**37. Are you allergic to any of the following?**  
_multi · anonymous · role: safety-screen · shown: Only when "Do you have any known allergies?" is answered "Yes" · no branch · code_  
Why they ask: Allergy detail; medicine allergies are flagged.

- `Penicillin` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Other medicines` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `Grass, pollen, trees, or plants (hayfever)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `House dust` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Animals (dogs, cats, horses etc)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Nuts` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Something else` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**38. I want to check your understanding of the hair loss treatment. Please tell me: You will need to take the treatment for at least 3-6 months before you see any benefit, and stopping treatment will reverse any regrowth and hair loss will resume.**  
_single · anonymous · role: expectation-setting · shown: always · BRANCHES · code_  
Why they ask: Checks the patient knows it takes 3 to 6 months and stops working when stopped.  
Downstream: Follow-ups: "The medication takes several months to work and so you won’t start to…".

- `True` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `False` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "The medication takes several months to work and so you won’t start to see a benefit for 3…". _[code]_

**39. The medication takes several months to work and so you won’t start to see a benefit for 3-6 months**  
_consent · anonymous · role: expectation-setting · shown: Only when "I want to check your understanding of the hair loss treatment. Please…" is answered "False" · no branch · code_  
Why they ask: Corrects a wrong answer to the understanding check.

- `I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**40. Please note that these medicines can affect prostate blood test results. If you need a prostate blood test, tell your doctor that you take finasteride or propecia.**  
_consent · anonymous · role: consent · shown: always · no branch · code_  
Why they ask: Makes the patient acknowledge that finasteride changes PSA test results.

- `I understand that if I need a prostate blood test, the doctor will need to know I am on this medicine.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**41. You should know about the following important side effects that have occurred in some men: Depression and suicidal thoughts; Sexual problems, such as erectile dysfunction, that can last even when medication is stopped; Increase risk of breast tenderness**  
_consent · anonymous · role: consent · shown: always · no branch · code_  
Why they ask: Side-effect warning the patient must acknowledge.

- `I understand and wish to continue` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**42. If you experience these side effects, please stop the medication and send a message to Boots Online Doctor**  
_single · anonymous · role: consent · shown: always · BRANCHES · code_  
Why they ask: Tells the patient to stop and message the service; offers the leaflet.  
Downstream: Follow-ups: "Here is the Patient Information Leaflet for Finasteride with further …". Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I'd like more information` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Here is the Patient Information Leaflet for Finasteride with further details- please copy…". _[code]_

**43. Here is the Patient Information Leaflet for Finasteride with further details- please copy and paste this link into your browser: https://www.medicines.org.uk/emc/files/pil.7068.pdf**  
_single · anonymous · role: consent · shown: Only when "If you experience these side effects, please stop the medication and …" is answered "I'd like more information" · no branch · code_  
Why they ask: Gives the leaflet link; lets the patient ask a question.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I'd like to ask more about side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("How can I help?") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_

**44. Before we finish, is there anything else you want to tell me?**  
_single · anonymous · role: data-capture · shown: always · no branch · code_  
Why they ask: Free-text catch-all for the clinician.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**45. Would you like me to tell your GP about any care we provide? Ideally your GP should know about any medicines you’re taking.**  
_single · anonymous · role: data-capture · shown: always · no branch · code_  
Why they ask: Asks permission to inform the GP and, if yes, collects the GP practice.

- `Yes` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Opens a GP practice search box (a GP surgery name or postcode); not used in this research. _[code]_
- `No (This won't affect our review of your order, but we would encourage you to tell your GP)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**46. Please confirm that you understand the questions asked and have answered them honestly. This treatment is for you only. You should read the patient information leaflet that comes with your medicine and send us a message if you have further questions.**  
_consent · anonymous · role: consent · shown: always · no branch · code_  
Why they ask: Final declaration of honesty and own use.

- `Please tick to confirm that you understand and agree` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**47. Let's confirm it's you. We need to verify your identity before we can prescribe. You'll be asked for: a selfie; a photo of your ID**  
_photo · anonymous · role: identity · shown: always, straight after the last health question (task 2 of the order) · no branch · code_  
Why they ask: Identity check before prescribing ("Regulations require us to see who we're treating." in the order data). ID wording in the app parameters: driver's licence or passport, with full name, date of birth and face visible.

- `Open camera` → **Unknown**: Starts the selfie and photo-ID capture: the research stops here (photos not allowed). What follows (account, delivery, payment, clinician review) was not seen. _[unknown]_

**48. Account-Setup (task name in the order; screen not reached). App parameter text: "CREATE ACCOUNT" with terms, privacy and marketing tick boxes.**  
_contact · after-account · role: identity · shown: after the ID photos (task 4 of the order) · no branch · code_  
Why they ask: Real account: email, name, mobile number, address, password. Replaces the placeholder temporary user.


**49. Delivery (task name in the order; screen not reached). App parameter title: "WOULD YOU LIKE TO PICK UP IN STORE (FASTEST)?"**  
_single · checkout · role: data-capture · shown: after account set-up (task 5 of the order) · no branch · code_  
Why they ask: How the medicine is supplied. No subscription or automatic refill option is in the order data.

- `Mail order one-time ("Ship to me just once")` → **No effect**: Free Royal Mail Tracked 48 delivery. Marked as the default option in the order data. _[code]_
- `Pharmacy pick-up ("I'll pick up at a local pharmacy")` → **No effect**: Collect from a Boots pharmacy (not Jersey or Guernsey), usually within 2 business hours of the prescription being written. _[code]_

**50. Payment (task name in the order; screen not reached). App content: "Your Order", "If we don’t prescribe, we’ll refund you.", button "Place Order".**  
_info · checkout · role: data-capture · shown: last task of the order (task 6) · no branch · code_  
Why they ask: Card details. Placing the order sends the visit to a clinician ("Your order is being reviewed by a clinician … within 24 hours").


## 7. Competitive read

**Strengths**

- Trusted pharmacy brand, CQC-registered provider, named clinical lead, pick-up in any Boots store within about 2 business hours of approval.
- Licensed medicines only; clear safety wording (pregnancy, PSA tests, depression and sexual side effects) repeated as must-acknowledge screens.
- No email needed until after the questions; pay only if approved; no subscription lock-in.
- Bundle questionnaire handles Regaine limits (age 49 licence limit, blood pressure, scalp skin).
- Every gate it does have is immediate and plainly worded (sex, age, postcode), with signposting to a GP or Boots Health Hub.
- Safety follow-ups appear exactly when relevant (pregnancy, suicidal thoughts, blood pressure with Regaine, off-label Regaine over 49), so the clinician gets context in the patient's own answers.

**Weaknesses**

- Men only; nothing for women's hair loss.
- Very narrow range: finasteride 1 mg tablets with or without Regaine foam. No topical finasteride, oral minoxidil, dutasteride, compounded sprays, shampoos or supplements.
- The patient must choose medicine and pack before answering anything; no guidance or recommendation.
- No photos of the scalp are asked for; pattern is one four-option question with wording errors ("Tick all that apply" on a single-choice question).
- Red-flag answers do not stop the flow on screen; the patient can go on to ID photos and payment details and only then be refused.
- First-time list showed most packs as "Out of stock"; ID photo step adds friction; dated copy (pages last reviewed 2021 and 2023, placeholder text left in the content data).
- Live tests show the screen never acts on its own red flags: patients who say they will stop, who have patchy or complete hair loss, or suicidal thoughts still reach ID photos, account and payment steps. The server only labels the order ("Danger") for later review.
- Choosing "tablets alone" in the bundle form does not change the basket; the patient still sees the bundle price.
- "Returning" is self-declared with no check, and it unlocks bigger packs that first-timers cannot buy.
- No questions about goals, how much hair loss bothers the patient, preferences (tablet vs topical) or previous non-finasteride treatments; nothing about women, so half of hair-loss patients are turned away.

**Gaps a new competitor could use**

- A guided recommendation (pattern, goals, preferences) instead of a price list.
- Options for men who cannot or will not take oral finasteride, and a women's pathway.
- Immediate, kind on-screen outcomes for red-flag answers with signposting, instead of late refusal.
- Scalp photo review and progress tracking; subscription convenience with easy pause.
- Act on red flags at once with a clear "this is not right for you, here is what to do" screen, saving the patient ID photos and sign-up.
- Let the questionnaire change the basket live (e.g. drop Regaine for blood-pressure patients, suggest topical options for men who do not want oral finasteride).
- Offer longer first supplies or a subscription after a proper first review, instead of stock flags.
- Serve women and the "no finasteride" group (topical finasteride, oral or topical minoxidil, combination sprays), which Boots does not sell online.

## 8. Experiments run (28)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| x00 | men-first-tablets | none (baseline replay: man 32, first time, Finasteride 1mg 28 tablets £28) | Still works. Ends at /camera/id (ID photos). Order: sku 25-9, £28, admin_status 4.1, Health Questions task status 3, next tasks ID Photos, Account-Setup, Delivery, Payment. No recommendation screen. |
| x01 | men-first-tablets | men-first-tablets-q13: None of these apply → My partner is trying to get pregnant | Adds the follow-up "As your partner is trying to get pregnant, you should not use this medication…" whose only option is "I understand and will stop my consultation." After ticking it, Next goes on to the prostate question. Same screen, product and price at the end as baseline, but the order line answer_status is "Danger" (baseline "Normal"); stage 2 missed this field. |
| x02 | men-first-tablets | pre2 birth gender: Male → Female | Hard stop on the birth-gender screen: "We're sorry, this service isn't available for the sex you were assigned at birth. Visit Boots Health Hub for advice." No questions, no products. |
| x03 | men-first-tablets | pre3 date of birth: 15/06/1994 (32) → 15/06/2009 (17) | Hard stop on the date-of-birth screen: "Based on your age, you're not suitable for our online service. Please speak with a local GP or clinic". |
| x04 | men-first-tablets | pre3 date of birth: 15/06/1994 (32) → 15/06/1951 (75) | Accepted. Same product list, same prices and same stock flags as baseline (Regaine bundles still offered). No age-based change before the questions. |
| x05 | men-first-tablets | pre1 postcode: N1 0QH → JE2 4WD (Jersey) | Hard stop on the postcode screen: "We do not currently provide our service to this postcode." |
| x06 | men-first-tablets | pre5 medicine: Finasteride 1mg 28 tablets £28 → Propecia 1mg 28 tablets £55 | Draft order sku 29-9 £55; the site loads the same questionnaire 2049 as generic finasteride. Walked to the first health question only. |
| x07 | men-first-tablets | men-first-tablets-q1: Temples and Crown → Random patches (and the follow-up "circular patches…" = Yes) | Adds the circular-patches follow-up (Yes is a red flag, status 3). No warning on screen, flow continues to ID photos with the same product and price; the order line answer_status is "Danger" (baseline "Normal"). (First attempt failed on a slow click at screen 16; retried once and passed.) |
| x08 | men-first-tablets | Stacked red-flag check (deliberately more than one change, to test whether ANY red flag acts on screen): Complete + complete baldness Yes; pus-filled scalp; hair lost elsewhere Yes; started within the last month; Suddenly + "I will stop my consultation now"; already on finasteride, not effective, side effects Yes; partner trying to conceive + "will stop"; suicidal thoughts + "not suitable, will stop". | All follow-ups appear as the definition says, but nothing blocks. The flow ends at /camera/id with the same product, price, admin_status 4.1 and task statuses as baseline. The order line differs: answer_status "Danger", answer_score_1 = 2, answer_score_2 = 2 (baseline "Normal", 0, 0). Stage 2 reported it as identical; that was wrong. |
| x09 | men-first-bundle | none (bundle baseline: Finasteride 28 + Regaine foam 1 can, £50.36; age band 18–50) | Still works. Questionnaire 2050, ends at /camera/id. Order sku 817-9, £50.36, admin_status 4.1. |
| x10 | men-first-bundle | men-first-bundle-q19 blood-pressure medicine: No → Yes, then "Yes - please change my prescription to tablets alone." | Follow-up "As you are taking medication for high blood pressure, Regaine is not suitable for you…" appears. Choosing tablets alone does NOT change the order (still sku 817-9, £50.36); the order line answer_status is "Warning" (bundle baseline "Normal"). |
| x11 | men-first-bundle | men-first-bundle-q1 age band: Between 18 and 50 → 50 years or older, then "I'd rather NOT have Regaine…" | Off-label follow-up appears; the flow carries on. Partial run (stopped at screen 15 of 21). Completed in stage 3 as verify-r-x11-age50: order still the bundle at £50.36, ID photo step reached, answer_status "Warning". |
| x12 | men-returning-tablets | pre4: First time → Returning for this service (and pack: Finasteride 84 tablets £80) | No proof of a previous order is asked. The 84-tablet pack (out of stock for first-timers) can be chosen. Questionnaire 2051, ends at /camera/id, order sku 24-9 (HAI-R), £80, admin_status 4.1. (First attempt failed while the page was loading; retried after 30 s and passed.) |
| x13 | men-first-tablets | pre5 pack: £28 (28 tablets) → £80 (84 tablets, labelled "Out of stock") | Clicking the out-of-stock tile does nothing: the page stays on /products/HAI-F and no draft order is made (an in-stock tile opens /product/<id>/HAI-F). First-time patients can only choose 28-tablet packs or the one-month bundles. |
| v01 | men-first-tablets | none (stage 3 fresh baseline replay) | Same as x00: /camera/id, sku 25-9, £28, admin_status 4.1, Health Questions task status 3, answer_status "Normal". Served questionnaire 2049 is byte-identical (sections) to the saved quiz-definition.json. |
| v02 | men-returning-bundle | none (first full replay of the returning bundle baseline: Returning, Finasteride 28 + Regaine 73 ml, £50.36) | No proof of a previous order asked. Questionnaire 2052 (identical to the saved definition), all 21 screens, ends at /camera/id. Order sku 829-9, £50.36, HAI-R, admin_status 4.1, answer_status "Normal". Every HAI-R pack is out_of_stock: false. |
| v03 | men-first-tablets | pre2 birth gender: Male → Female (re-test) | Same hard stop as x02. |
| v04 | men-first-tablets | pre3 date of birth → 15/06/2009, age 17 (re-test) | Same hard stop as x03. |
| v05 | men-first-tablets | pre3 date of birth → 22/11/2008 (turned 18 the day before) | Accepted: goes on to "Have you used this service before?". The age gate is 18 exactly. |
| v06 | men-first-tablets | pre1 postcode → JE2 4WD (Jersey, re-test) | Same hard stop as x05. |
| v07 | men-first-tablets | pre1 postcode → GY1 1AA (Guernsey) | Hard stop: "We do not currently provide our service to this postcode." (same as Jersey). |
| v08 | men-first-tablets | pre5 pack: £28 → £80 (84 tablets, "Out of stock") (re-test) | Same as x13: clicking does nothing, stays on /products/HAI-F, no draft order. |
| v09 | men-first-bundle | men-first-bundle-q1 age band → 50 years or older, then "I'd rather NOT have Regaine…" (completes x11) | Full run to /camera/id. Order still sku 817-9, £50.36; answer_status "Warning". |
| v10 | men-first-tablets | men-first-tablets "Have you lost any hair elsewhere on your body?": No → Yes (amber, single change) | A free-text box ("Please tell me more about this") opens and was filled with the word "test"; flow continues to /camera/id with the same product and price; answer_status "Query" (baseline "Normal"). |
| v11 | men-first-tablets | men-first-tablets conditions: None of these apply → Hereditary problems of galactose intolerance… (red, single change) | No follow-up, no warning; flow continues to /camera/id with the same product and price; answer_status "Danger". |
| v12 | men-first-bundle | pre5 medicine: Finasteride + Regaine £50.36 → Propecia + Regaine £72 (walked to the first health question) | Draft order sku 825-9, £72; the site loads the same bundle questionnaire 2050. |
| v13 | men-first-bundle | none (stage 3 fresh replay of the first-time bundle baseline) | Same as x09: questionnaire 2050, /camera/id, sku 817-9, £50.36, admin_status 4.1, answer_status "Normal". |
| v14 | men-returning-tablets | none (stage 3 fresh replay of the returning tablets baseline) | Same as x12: questionnaire 2051, /camera/id, sku 24-9, £80, HAI-R, admin_status 4.1, answer_status "Normal". |

## 9. Independent verification

The core picture holds up: Boots Online Doctor has no on-screen recommending engine, men only, three entry gates (sex, age 18+, mainland UK postcode), the patient picks the product, and that pick chooses one of four fixed questionnaires that are saved word for word. Prices and products were all re-checked live and match. One important claim was wrong: answers are not ignored. The server labels each order Normal, Query, Warning or Danger from the option statuses, which is how red flags reach the clinician. With that corrected, the report can be trusted as labelled for everything before the ID photo wall; nothing after the wall (clinician decisions, refusals, switches) is known.

**Re-checked**

- All four baselines replayed fresh to /camera/id (runs/verify-b01-baseline, verify-b02-first-bundle, verify-b03-returning-tablets, verify-b04-returning-bundle; the returning bundle had never been walked end to end). Questionnaire ids, skus, prices, admin_status and task lists match stage 1 and 2: confirmed.
- The four served questionnaires (2049 to 2052) re-fetched live are identical (all sections) to the saved quiz-definition files: confirmed. Every question and option in company.json matches the definitions word for word (192 questions, 0 missing).
- R1 female refused (verify-r-x02), R2 under 18 refused (verify-r-x03) and 18 accepted (verify-r-age18), R10 Jersey refused (verify-r-x05) and Guernsey refused (verify-r-guernsey): confirmed.
- R5 first-time out-of-stock tile cannot be clicked (verify-r-x13), and the served product lists show out_of_stock true for every larger first-time pack and false for every returning pack: confirmed.
- R12 bundle age 50 or over + tablets only: completed in full (verify-r-x11-age50); order stays the bundle: confirmed.
- R7 bundle + blood-pressure medicine + tablets alone: re-read x10 order JSON; product unchanged: confirmed, but the server label (Warning) was missing.
- R6 red flags do not stop the flow on screen: confirmed with a single red answer (galactose intolerance, verify-r-galactose). The claim that the order is identical: contradicted (answer_status changes).
- Propecia bundle uses questionnaire 2050 like the generic bundle (verify-r-propecia-bundle): new, confirmed.
- Product facts: all 36 pack prices (18 first-time, 18 returning), product names, skus and stock flags checked against the live served product lists; the ten tablet prices and "from 67p per tablet" also checked on the public pages /treatments/finasteride and /propecia-online (23 Nov 2026): all match.
- Women: the served service list has hair loss for genders ["male"] only (women get Facial Hair Removal only); a web search found no Boots Online Doctor women's hair-loss service: confirmed there is no women's route.

**Corrected**

- Stage 2 said red-flag runs ended with an "identical draft order". Wrong: each order line has answer_status, which is "Normal" on every baseline, "Danger" after a red answer (x01, x07, x08, verify-r-galactose), "Warning" after amber bundle answers (x10, verify-r-x11-age50) and "Query" after an amber tablets answer (verify-r-elsewhere). x08 also set answer_score_1 and answer_score_2 to 2. Added rule R15; rewrote R6, R7, R12, experiments x01, x07, x08, x10, x11, the engine summary, a weakness, limitations and every amber/red option effect.
- R12 upgraded from medium (partial run) to high (full run verify-r-x11-age50).
- p4 (Propecia + Regaine) was "assumed to use the bundle questionnaire (not walked)"; now observed (questionnaire 2050). Added rule R16 and a recommendation profile.
- Out-of-stock pack options were labelled "inferred"; the flag is in the served product list, so they are now "code" with the file named.
- R2 and R10 widened with the new boundary (age 18 accepted) and Guernsey results.
- Every "observed" question, option and recommendation now names its run folder.
- Noted that the largest tablet packs are titled "364 Tablets" but coded "336-Tablets" internally.

**Still unverified**

- What answer_score_1 and answer_score_2 mean, and exactly which answers give "Query" versus "Warning".
- What the clinician does with a "Danger" or "Warning" order, and whether a bundle is switched to tablets only: after the ID photo wall.
- Whether "Out of stock" for first-time packs is real stock or a deliberate first-supply limit (inferred).
- The strength of "Regaine foam extra strength" is not stated on the site; 5% is inferred from the UK product of that name.
- Single answers not replayed: most conditions one by one, prostate medicine, other medicines and allergies, scalp ticks, the understanding check "False", GP "Yes".
- Returning bundle with Propecia was not walked (by analogy it uses questionnaire 2052).

## 10. Limits of this report

- The site never shows option status. Stage 3 saw that the server turns it into an order label (answer_status Normal / Query / Warning / Danger), but how the clinician uses that label, and what answer_score_1 and answer_score_2 mean, cannot be seen without an account.
- Nothing after the health questions was seen live (ID photos, account, delivery, payment, clinician messages, refusals). Those steps are described from the order task list and app parameters only.
- Stock flags and prices are as served on 2026-11-23 and may change. The Regaine strength is not stated on the site.
- A postcode had to be entered to begin (the site's own placeholder N1 0QH was used). If the project owner counts a postcode as an address, treat every live walk here as outside the rules and rely on the served definitions only.
- Stage 2 live runs: 14 (x00 to x13). Fully replayed: first-time tablets and bundle baselines, returning tablets baseline, partner trying to conceive, patchy loss, a stacked red-flag run, bundle + blood-pressure medicine, out-of-stock tile, sex, age 17 and 75, Jersey postcode, Propecia questionnaire id. x11 (bundle, 50 or over) was partial; stage 3 completed it (runs/verify-r-x11-age50).
- x08 changed many answers at once on purpose (to test whether any red flag acts on screen). Because nothing changed, each flag in it is shown not to act; but a single-answer effect that cancels another cannot be ruled out completely.
- Not tested live: other conditions one by one (cancer, liver, depression, sexual dysfunction, skin, kidney); prostate medicine; other medicines and allergies (they need free text); scalp-condition ticks; the understanding check "False"; "I'd like to ask more about side effects"; GP "Yes" (opens a GP practice search: third-party details, avoided). By the served code these add a follow-up and an amber or red status, which by R15 should only change the server label, not the order.
- Whether "Out of stock" is a deliberate first-supply limit or real stock is inferred; the flags may change from day to day.
- What the clinician does with flagged answers, and whether the bundle is switched to tablets only, happens after the account wall and was not seen.

## 11. Sources

- [Hair loss service page (prices in structured data)](https://onlinedoctor.boots.com/propecia-online)
- [Hair loss treatment facts (important info)](https://onlinedoctor.boots.com/propecia-online-important-info)
- [Hair loss: what you need to know (helpful info)](https://onlinedoctor.boots.com/propecia-online-helpful-info)
- [Finasteride treatment-library page](https://onlinedoctor.boots.com/treatments/finasteride)
- [Duplicate service page](https://onlinedoctor.boots.com/services/hair-loss)
- [Consultation entry](https://onlinedoctor-clinic.boots.com/Hair-Loss)
- [FAQ](https://onlinedoctor.boots.com/faq)
- [Pick up and delivery](https://onlinedoctor.boots.com/pick-up-and-delivery)
- [Patient guide](https://onlinedoctor.boots.com/patient-guide)
- [Off-label medicines](https://onlinedoctor.boots.com/off-label-medicines)
- [Terms and conditions (not read in this stage)](https://onlinedoctor.boots.com/terms-and-conditions)
- [Finasteride patient leaflet linked from the questionnaire](https://www.medicines.org.uk/emc/files/pil.7068.pdf)
- [Served API: service list with ages, sexes and questionnaire ids (saved copy raw/api-products-categories.json)](https://prod-api.lemonaidpims.co.uk/v2.0/products/categories)
- [Served API: hair-loss content (saved copy raw/api-content-web-categories-HAI.json)](https://prod-api.lemonaidpims.co.uk/v2.0/content/web/categories/HAI)
- [Served API: first-time products (saved copy raw/api-categories-HAI-F-products.json)](https://prod-api.lemonaidpims.co.uk/v2.0/categories/HAI-F/products)
