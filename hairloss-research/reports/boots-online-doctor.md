# Boots Online Doctor: consultation and product report

**Market:** UK · **Website:** https://onlinedoctor.boots.com/ · **Checked:** 2026-11-23 · **Owner:** Boots UK (provider: Boots Digital Health Ltd, CQC registered; runs on the Lemonaid Health UK platform)

> High-street pharmacy's online doctor: a men-only questionnaire for licensed finasteride or Propecia tablets (optionally bundled with Regaine foam), reviewed by a clinician, sold as one-off packs with store pick-up or free delivery.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** After the health questions. Nothing asks for an email before that: after postcode, birth gender and date of birth the site itself creates a placeholder "temporary user" (POST users/temp). The first screen we could not pass is the ID photo step at /camera/id ("Let's confirm it's you": a selfie and a photo of your ID), which comes straight after the last health question. Account set-up (email, name, phone, address, password) is the next task after the photos, then delivery and payment. No recommendation is shown before the wall: the patient has already picked the medicine.
- **Blocker:** ID photos (selfie + photo ID) are required before account set-up; photos are outside the research rules, so nothing after the health questions was seen.
- **Blocker:** curl to the marketing site was blocked by the Imperva/Incapsula bot protection after about five quick requests; the normal browser (walk.js) was not blocked. Nothing was done to get round it.

Walked live with the baseline man from the entry page to the ID photo screen for the first-time, tablets-only route (all 19 question screens). The three other routes (first-time bundle, returning tablets, returning bundle) were walked to their first health question, which made the site serve their full question sets; those questions are recorded from the served definitions, not clicked through. All four definitions are saved. No account, email, name, phone, address, password, photo or payment was entered. A postcode had to be typed to start: the placeholder postcode found in the site's own code (N1 0QH) was used; it is a location check, not a contact detail. There is no women's hair-loss consultation to walk.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

There is no product-recommending engine. Three eligibility gates come first (postcode, birth sex male, age 18+). The patient then says first-time or returning and picks the medicine, brand and pack size himself. That choice selects one of four fixed questionnaires (tablets only or Regaine bundle, first-time or returning). Each questionnaire is a linear list of screens with simple one-level follow-ups (a follow-up appears when a given option is chosen). Every option carries a status of 0, 2 or 3 in the served definition. The website does not act on these: it never blocks, even on "I will stop my consultation" answers. Answers are sent once at the end and a clinician decides after ID photos, account and payment details. In bundles, the questions can steer the order back to tablets only (age 50+, blood-pressure medicine).

## 3. Engine rules (8)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men-first-tablets | Birth gender = "Female" | The preflight refuses: the hair-loss service is configured for male only. There is no women's hair-loss service. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Stops the patient | code | medium |
| R2 | men-first-tablets | Date of birth gives an age under 18 (service min age 18, max 120) | The server eligibility check should refuse the date of birth; under 16 is refused in the browser. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Stops the patient | code | medium |
| R3 | men-first-tablets | Product chosen is tablets only vs a Regaine bundle | Tablets only loads questionnaire 2049 (35 questions); a Regaine bundle loads questionnaire 2050 (38 questions) with age-band, scalp-skin and blood-pressure questions. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Adds questions | observed | high |
| R4 | men-returning-tablets | "Have you used this service before?" = "Returning for this service" | Child service HAI-R: every pack size is available and questionnaires 2051 (tablets) / 2052 (bundle) are used; they add "…depression, suicidal thoughts and sexual dysfunction can occur. Do you think any of these have happened to you?" for men already on finasteride. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Adds questions | observed | high |
| R5 | men-first-tablets | "Have you used this service before?" = "First time using this service" | Only one-month packs (28 tablets, or 28 tablets + 1 Regaine) could be chosen on the day tested; all larger packs showed "Out of stock". Returning patients saw every pack available. This looks like a first-supply limit done through stock flags: inferred. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Removes a product | observed | low |
| R6 | men-first-tablets | Any option carrying status 3 in the definition (for example smooth circular patches, complete baldness, painful or pus-filled scalp, treatment not effective, partner trying to conceive, suicidal thoughts, galactose intolerance, or any "I will stop my consultation" choice) | The website does not block: the app code never reads the status field, so Next still works. The red flag travels with the answers to the clinician side. Refusal is the expected outcome but is not visible without an account. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ | Flags for the clinician | code | medium |
| R7 | men-first-bundle | Bundle: taking blood-pressure medicine = "Yes", or age band = "50 years or older" | A follow-up offers to drop Regaine and keep tablets only (amber flag). Answering "No" to dropping Regaine when on blood-pressure medicine is a red flag. "High blood pressure (hypertension)" as a condition is also a red flag in bundles. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ | Switches product | code | medium |
| R8 | men-first-tablets | All health questions answered (any answers) | Answers are posted once, at the end. The Health Questions task becomes status 3 and the order admin_status becomes 4.1; the next task is ID Photos, then Account-Setup, Delivery, Payment. No recommendation or result screen is shown. | Next question | observed | high |

## 4. Products (5)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Finasteride 1mg tablets (generic)](https://onlinedoctor.boots.com/treatments/finasteride) | rx-oral | finasteride 1 mg | tablet, one a day | men | POM, licensed medicine (generic finasteride 1 mg) | £28 for 28 tablets; £245 for 364 tablets (about 67p a tablet) (One-off packs, no subscription. First-time (HAI-F): 28 Tablets £28 (sku 25-9); 56 Tablets £55 (sku 530-9, shown "Out of stock"); 84 Tablets £80 (sku 23-9, shown "Out of stock"); 168 Tablets £138 (sku 532-9, shown "Out o…) | Not recommended by an engine: the patient picks it on the "Which medicine do you prefer?" screen before any medical question. A clinician then approves or refuses. Bundle questionnaires let the patient ask to be switched to tablets only (aged 50 or over, or on blood-pressure medicine). | observed |
| [Propecia 1mg tablets (brand)](https://onlinedoctor.boots.com/propecia-online) | rx-oral | finasteride 1 mg | tablet, one a day | men | POM, licensed medicine (branded finasteride 1 mg) | £55 for 28 tablets; £400 for 364 tablets (One-off packs, no subscription. First-time (HAI-F): 28 Tablets £55 (sku 29-9); 56 Tablets £98 (sku 528-9, shown "Out of stock"); 84 Tablets £119 (sku 27-9, shown "Out of stock"); 168 Tablets £216 (sku 534-9, shown "Out …) | Patient choice on the "Which medicine do you prefer?" screen. Same service as generic finasteride; which questionnaire it loads was not walked (expected to be the tablets-only one). | observed |
| [Finasteride 1mg tablets + Regaine foam extra strength (bundle)](https://onlinedoctor.boots.com/propecia-online) | bundle | finasteride 1 mg; minoxidil not stated on the site ("Regaine foam extra strength", 73 ml can). The licensed UK product of that name is 5% w/w: inferred | tablet once a day + scalp foam twice a day (1 g, half a capful) | men | Finasteride: POM, licensed. Regaine foam: licensed medicine sold without prescription in UK shops (inferred GSL); here it is supplied as part of the prescription order. Off-label for men aged 50 or over (the site says the licence covers up to age 49). | £50.36 for one month (28 tablets + 1 x 73 ml); £334.39 for 12 months (One-off packs, no subscription. First-time (HAI-F): 28 tablets + 73ml £50.36 (sku 817-9); 84 tablets + 3 x 73ml £108 (sku 821-9, shown "Out of stock"); 168 tablets + 6 x 73ml £181.59 (sku 823-9, shown "Out of stock"); 3…) | Patient choice, found under "See more treatment options". Choosing a bundle loads a longer questionnaire with age band, scalp skin and blood-pressure questions. The patient can ask to drop Regaine if aged 50 or over or on blood-pressure medicine. | observed |
| [Propecia 1mg tablets + Regaine foam extra strength (bundle)](https://onlinedoctor.boots.com/propecia-online) | bundle | finasteride 1 mg; minoxidil not stated on the site ("Regaine foam extra strength", 73 ml can). The licensed UK product of that name is 5% w/w: inferred | tablet once a day + scalp foam twice a day | men | Propecia: POM, licensed. Regaine foam: licensed medicine sold without prescription in UK shops (inferred GSL). Off-label for men aged 50 or over. | £72 for one month (28 tablets + 1 x 73 ml); £458 for 12 months (One-off packs, no subscription. First-time (HAI-F): 28 tablets + 73ml £72 (sku 825-9); 84 tablets + 3 x 73ml £139 (sku 826-9, shown "Out of stock"); 168 tablets + 6 x 73ml £244 (sku 827-9, shown "Out of stock"); 364 tab…) | Patient choice, found under "See more treatment options". Expected to load the bundle questionnaire (only the finasteride bundle was walked). | observed |
| [Regaine (minoxidil) on its own: signposted to boots.com, not sold by the Online Doctor](https://onlinedoctor.boots.com/propecia-online-important-info) | otc-medicine | minoxidil not stated (the finasteride page mentions "minoxidil 5% solution") | scalp foam or solution | men | Sold without prescription on boots.com and in Boots stores (not part of this service) | Not listed on Boots Online Doctor (sold on boots.com; price not checked) (The information page says: "Regaine can be used on its own and is available from boots.com or in Boots stores.") | Mentioned as an alternative on information pages only. Never offered inside the consultation on its own. | docs |

## 5. Who gets what (1 patient profiles)

- **Man, 32, temples and crown, gradual, no medical issues, first time (baseline)** → Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle). There is no recommendation screen. The patient is shown all four product lines and picks one (and a pack size) before any medical question. The baseline picked Finasteride 1mg, 28 tablets, £28 and reached the ID photo step with no warning. Final say is the clinician's, after payment details are given. _[observed]_

## 6. The consultation, question by question

### Men, first time, tablets only (Finasteride or Propecia)

Entry: https://onlinedoctor-clinic.boots.com/Hair-Loss

Postcode → birth gender → date of birth (site creates a placeholder temporary user) → first time or returning → patient picks medicine and pack → product page → honesty tick box → 19 health-question screens (35 questions with follow-ups; questionnaire 2049) → ID photos (selfie + photo ID: research stops here) → account set-up → delivery or pick-up → payment → clinician review within 24 hours.

**1. What's your postcode?**  
_text · anonymous · role: eligibility-gate · shown: always (first screen of every hair-loss entry) · BRANCHES · observed_  
Why they ask: Service-area check before anything else.  
Downstream: The app checks the postcode with the server (users/me/eligibility?zip=… and a postcode look-up). Jersey (JE) and Guernsey (GY) postcodes are refused in the browser: "We do not currently provide our service to this postcode." Unknown postcodes: "Sorry, Boots isn't in your postcode yet." (messages read in the app code; not tested live). Next stays disabled until the postcode passes.


**2. What’s your birth gender?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Hair-loss treatment here is for men only.  
Downstream: Female cannot continue.

- `Female` → **Stops the patient**: Stops here. The service is set to male only (genders ["male"] in the service list). Message in the app code: "We're sorry, this service isn't available for the sex you were assigned at birth. Visit Boots Health Hub for advice." Not tested live. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Male` → **Next question**: Next is enabled; goes to date of birth. _[observed]_

**3. What’s your date of birth? (Please make sure this is accurate to avoid delays to your treatment)**  
_date · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Age check. Also used later to match the photo ID.  
Downstream: Under 16 is refused in the browser ("Sorry, you need to be at least 16 to use Boots Online Doctor Service."). The server then checks the age for this service (users/me/eligibility?dob=…&category_code=HAI); the service list gives min age 18 and max age 120 for hair loss. Under-18 and over-65 behaviour not tested. After this screen the site itself creates a placeholder "temporary user" (POST users/temp) so the visit can go on without an email.


**4. Have you used this service before?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Splits new patients from returning ones.  
Downstream: Chooses the child service (HAI-F or HAI-R), and with it the product list and the questionnaire. It is self-declared: a brand-new anonymous visitor can pick "Returning" (observed).

- `First time using this service` → **Next question**: Opens the first-time product list (child service HAI-F). On the day tested only one-month packs could be chosen there; larger packs showed "Out of stock". _[observed]_
- `Returning for this service` → **Adds questions**: Opens the returning product list (child service HAI-R): same medicines and prices, every pack size available, larger packs shown first. Uses the returning questionnaires, which add one side-effect question. _[observed]_

**5. Which medicine do you prefer? (Ultimately it will be a joint decision between you and one of our clinicians on whether a particular medicine is appropriate.)**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The patient, not an engine, chooses the medicine, brand and pack size before any medical question.  
Downstream: Tablets-only packs load one questionnaire and Regaine bundles load another (ids 2049 / 2050 first-time, 2051 / 2052 returning). Featured packs are shown first; the rest (including every bundle that is available) sit behind "See more treatment options", which also has a search box. The site content also holds a "No-Choice" product entry (code HAI-F-No-Choice) that was not shown on screen.

- `Finasteride 1mg, 28 Tablets, £28` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Walked with sku 25-9. _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg, 56 Tablets, £55 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets (generic))_ _[unknown]_
- `Finasteride 1mg, 84 Tablets, £80 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets (generic))_ _[unknown]_
- `Finasteride 1mg, 168 Tablets, £138 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets (generic))_ _[unknown]_
- `Finasteride 1mg, 364 Tablets, £245 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets (generic))_ _[unknown]_
- `Propecia 1mg, 28 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 56 Tablets, £98 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets (brand))_ _[unknown]_
- `Propecia 1mg, 84 Tablets, £119 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets (brand))_ _[unknown]_
- `Propecia 1mg, 168 Tablets, £216 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets (brand))_ _[unknown]_
- `Propecia 1mg, 364 Tablets, £400 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets (brand))_ _[unknown]_
- `Finasteride 1mg (28 tablets) \| Regaine foam extra strength (73ml), £50.36` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Walked with sku 817-9. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[observed]_
- `Finasteride 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £108 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_
- `Finasteride 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £181.59 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_
- `Finasteride 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £334.39 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_
- `Propecia 1mg (28 tablets) \| Regaine foam extra strength (73ml), £72` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £139 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_
- `Propecia 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £244 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_
- `Propecia 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £458 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_

**6. Product page for the chosen pack: name, price, short description, and four fold-out sections: "Is it suitable for me?", "How to take it", "How it works", "What else should I know?"**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Shows who should not take the medicine before the questions start.

- `Continue` → **Next question**: Creates the draft order on the server (status "Not submitted") with this task list: Health Questions, ID Photos, Account-Setup, Delivery, Payment. _[observed]_

**7. Important info: Just like a traditional consultation we're going to ask you about your medical history and symptoms. Your answers will help us assess your suitability for treatment. Please answer all questions honestly and in full. If you have any problems understanding or answering a question please call or message us.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Honesty statement before the medical questions.

- `I understand the important information above.` → **Next question**: Tick box. Continue stays disabled until it is ticked, then the health questions open. _[observed]_

**8. Which of the following best describes your hair loss? (Tick all that apply)**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Checks the pattern fits male pattern baldness (temples, crown). Patches or complete loss suggest another cause.  
Downstream: Follow-ups: "Are you experiencing any areas of hair loss on your scalp that look l…"; "Do you have complete baldness?". The wording says "Tick all that apply" but only one option can be chosen (max 1).

- `Temples only (receding at the front)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Temples and Crown` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_
- `Random patches` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you experiencing any areas of hair loss on your scalp that look like circular patches…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Complete` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Do you have complete baldness?". _[code]_

**9. Are you experiencing any areas of hair loss on your scalp that look like circular patches, with a smooth surface?**  
_single · anonymous · role: diagnosis · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Random patches" · no branch · code_  
Why they ask: Screens for alopecia areata (smooth round patches), which this service does not treat.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `No` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_

**10. Do you have complete baldness?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Complete" · no branch · code_  
Why they ask: Finasteride is unlikely to help once most hair is lost.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `No, it affects mostly the front and top of my scalp` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**11. Do you have any of the following? Please select all that apply.**  
_multi · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Looks for scalp disease that could be the real cause or needs treating first.  
Downstream: Follow-ups: "Treatment will be less effective if you have damaged hair follicles f…".

- `Psoriasis, fungal infections such as ringworm, or dandruff of your scalp` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Treatment will be less effective if you have damaged hair follicles from a scalp conditio…". _[code]_
- `Itchy, rough or scaling areas on your scalp` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Treatment will be less effective if you have damaged hair follicles from a scalp conditio…". _[code]_
- `Any pain, burning/ blistering or pus-filled spots on the scalp` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `None of the above` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. _[observed]_

**12. Treatment will be less effective if you have damaged hair follicles from a scalp condition. I recommend you sort your scalp condition before starting this treatment.**  
_single · anonymous · role: expectation-setting · shown: Only when "Do you have any of the following? Please select all that apply." is answered "Psoriasis, fungal infections such as ringworm, or dandruff of your scalp" or "Itchy, rough or scaling areas on your scalp" · no branch · code_  
Why they ask: Warns that a scalp condition makes treatment work less well; the patient chooses to go on or stop.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to continue with my consultation` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I understand and do not wish to continue with my consultation.  I will stop this consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**13. Have you lost any hair elsewhere on your body?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Body hair loss points away from male pattern baldness.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**14. When did you start losing your hair?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Very recent hair loss is not typical of male pattern baldness.

- `Within the last month` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. _[code]_
- `More than a month ago` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**15. How did your hair loss start?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Male pattern baldness is gradual; sudden loss suggests another cause.  
Downstream: Follow-ups: "Sudden hair loss is unusual. Treatment is designed to treat the initi…".

- `Suddenly` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sudden hair loss is unusual. Treatment is designed to treat the initial stages of male pa…". _[code]_
- `Gradually` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**16. Sudden hair loss is unusual. Treatment is designed to treat the initial stages of male pattern baldness, which usually happens gradually.**  
_single · anonymous · role: expectation-setting · shown: Only when "How did your hair loss start?" is answered "Suddenly" · no branch · code_  
Why they ask: Warns that sudden loss is not what the treatment is for; the patient chooses to go on or stop.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to continue with this consultation` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I understand and do not wish to continue. I will stop my consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**17. Are you currently using Finasteride or Propecia for hair loss?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Separates new starters from men already on treatment and opens the follow-up questions.  
Downstream: Follow-ups: "Is it effective?"; "Do you experience any side effects?".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Is it effective?" and "Do you experience any side effects?". _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**18. Is it effective?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: No point continuing a treatment that has not worked.

- `Yes` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Not yet, but I've been using it for less than 6 months` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Not sure, but I'd like to continue. I understand if there's no improvement after 6 months then it's unlikely to work for me.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**19. Do you experience any side effects?**  
_single · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Picks up side effects from current finasteride use.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**20. Is your partner pregnant or trying to get pregnant?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Finasteride can harm a male foetus; trying to conceive is a reason not to treat.  
Downstream: Follow-ups: "If your partner is pregnant you must use condoms while taking finaste…"; "As your partner is trying to get pregnant, you should not use this me…".

- `My partner is pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If your partner is pregnant you must use condoms while taking finasteride or Propecia to …". _[code]_
- `My partner is trying to get pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As your partner is trying to get pregnant, you should not use this medication. If you're …". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**21. If your partner is pregnant you must use condoms while taking finasteride or Propecia to prevent harm to the baby.**  
_consent · anonymous · role: consent · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is pregnant" · no branch · code_  
Why they ask: Makes the patient confirm the condom advice when a partner is pregnant.  
Downstream: Helper text under the question: "Please confirm that you understand this."

- `I confirm that I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**22. As your partner is trying to get pregnant, you should not use this medication. If you're already taking finasteride or Propecia, we recommend you stop taking it for at least 2 weeks before trying to conceive with your partner.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is trying to get pregnant" · no branch · code_  
Why they ask: Tells the patient the medicine is not suitable while trying to conceive.

- `I understand and will stop my consultation.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**23. Are you taking medication for a prostate condition?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Looks for finasteride 5 mg or similar medicines, and for men whose PSA tests matter.  
Downstream: Follow-ups: "You need to know that these medicines can affect prostate blood test …".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You need to know that these medicines can affect prostate blood test results. If you need…". Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**24. You need to know that these medicines can affect prostate blood test results. If you need a prostate blood test, tell your doctor that you take finasteride or propecia.**  
_consent · anonymous · role: consent · shown: Only when "Are you taking medication for a prostate condition?" is answered "Yes" · no branch · code_  
Why they ask: Makes the patient acknowledge that finasteride changes PSA test results.

- `I understand that If I need a prostate blood test, the doctor will need to know I am on this medication.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**25. Are you taking any other prescription-only medicines, over-the-counter medicines, alternative medicines or recreational drugs?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Full medicines history for the clinician.  
Downstream: Follow-ups: "You've told me you don't take any medication at all. Is that right?".

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You've told me you don't take any medication at all. Is that right?". _[observed]_

**26. You've told me you don't take any medication at all. Is that right?**  
_single · anonymous · role: safety-screen · shown: Only when "Are you taking any other prescription-only medicines, over-the-counte…" is answered "No" · no branch · observed_  
Why they ask: Double-checks a "no medicines" answer.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Correct - I'm not on any medication` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_
- `No, I forgot to tell you something` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me here") that must be filled in before Next works. _[code]_

**27. Do you have any of the following conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Conditions that matter for finasteride (and, in bundles, for Regaine).  
Downstream: Follow-ups: "Depression and suicidal thoughts are an uncommon side effect of Finas…"; "If you’re experiencing thoughts of self harm or suicide, help is avai…"; "Sexual dysfunction (including decreased sex drive and erectile dysfun…".

- `Cancer` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Liver condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Depression` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Depression and suicidal thoughts are an uncommon side effect of Finasteride/Propecia. If …". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Suicidal thoughts` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If you’re experiencing thoughts of self harm or suicide, help is available. Please call N…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _[code]_
- `Sexual dysfunction (including decreased sex drive and erectile dysfunction)` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommo…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Skin condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Kidney/urinary condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Hereditary problems of galactose intolerance, Lapp lactase deficiency or glucosegalactose malabsorption` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. _[observed]_

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

- `I understand that this medication is not suitable for me and will stop this application.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**31. Other than those already mentioned, do you have any other significant medical conditions, illnesses, hospital stays or past surgical procedures?**  
_single · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Catch-all medical history.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**32. Do you have any known allergies?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Allergy check.  
Downstream: Follow-ups: "Are you allergic to any of the following?".

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you allergic to any of the following?". _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**33. Are you allergic to any of the following?**  
_multi · anonymous · role: safety-screen · shown: Only when "Do you have any known allergies?" is answered "Yes" · no branch · code_  
Why they ask: Allergy detail; medicine allergies are flagged.

- `Penicillin` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Other medicines` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Grass, pollen, trees, or plants (hayfever)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `House dust` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Animals (dogs, cats, horses etc)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Nuts` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Something else` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_

**34. I want to check your understanding of the hair loss treatment. Please tell me: You will need to take the treatment for at least 3-6 months before you see any benefit, and stopping treatment will reverse any regrowth and hair loss will resume.**  
_single · anonymous · role: expectation-setting · shown: always · BRANCHES · observed_  
Why they ask: Checks the patient knows it takes 3 to 6 months and stops working when stopped.  
Downstream: Follow-ups: "The medication takes several months to work and so you won’t start to…".

- `True` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_
- `False` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "The medication takes several months to work and so you won’t start to see a benefit for 3…". _[code]_

**35. The medication takes several months to work and so you won’t start to see a benefit for 3-6 months**  
_consent · anonymous · role: expectation-setting · shown: Only when "I want to check your understanding of the hair loss treatment. Please…" is answered "False" · no branch · code_  
Why they ask: Corrects a wrong answer to the understanding check.

- `I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**36. You also need to know that these medicines can affect prostate blood test results. So if you need a prostate blood test, tell your doctor that you take finasteride or propecia.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Makes the patient acknowledge that finasteride changes PSA test results.

- `I understand that if I need a prostate blood test, the doctor will need to know I am on this medicine.` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**37. You should know about the following important side effects that have occurred in some men: Depression and suicidal thoughts; Sexual problems, such as erectile dysfunction, that can last even when medication is stopped; Increase risk of breast tenderness**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Side-effect warning the patient must acknowledge.

- `I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**38. If you experience these side effects, please stop the medication and send a message to Boots Online Doctor**  
_single · anonymous · role: consent · shown: always · BRANCHES · observed_  
Why they ask: Tells the patient to stop and message the service; offers the leaflet.  
Downstream: Follow-ups: "Here is the Patient Information Leaflet for Finasteride with further …". Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to proceed` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_
- `I'd like more information` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Here is the Patient Information Leaflet for Finasteride with further details- please copy…". _[code]_

**39. Here is the Patient Information Leaflet for Finasteride with further details- please copy and paste this link into your browser: https://www.medicines.org.uk/emc/files/pil.7068.pdf**  
_single · anonymous · role: consent · shown: Only when "If you experience these side effects, please stop the medication and …" is answered "I'd like more information" · no branch · code_  
Why they ask: Gives the leaflet link; lets the patient ask a question.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I'd like to ask more about side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("How can I help?") that must be filled in before Next works. _[code]_

**40. Would you like me to tell your GP about any care we provide? Ideally your GP should know about any medicines you’re taking.**  
_single · anonymous · role: data-capture · shown: always · no branch · observed_  
Why they ask: Asks permission to inform the GP and, if yes, collects the GP practice.

- `Yes` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Opens a GP practice search box (a GP surgery name or postcode); not used in this research. _[code]_
- `No (This won't affect our review of your order, but we would encourage you to tell your GP)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**41. Before we finish, is there anything else you want to tell me?**  
_single · anonymous · role: data-capture · shown: always · no branch · observed_  
Why they ask: Free-text catch-all for the clinician.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**42. Please confirm: you understand the questions asked; have answered them honestly; any treatment is for you only. You should read our clinicians’ advice and also, the patient information leaflet that comes with any medication. You can message us if needed.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Final declaration of honesty and own use.

- `Please tick to confirm that you understand and agree` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[observed]_

**43. Let's confirm it's you. We need to verify your identity before we can prescribe. You'll be asked for: a selfie; a photo of your ID**  
_photo · anonymous · role: identity · shown: always, straight after the last health question (task 2 of the order) · no branch · observed_  
Why they ask: Identity check before prescribing ("Regulations require us to see who we're treating." in the order data). ID wording in the app parameters: driver's licence or passport, with full name, date of birth and face visible.

- `Open camera` → **Unknown**: Starts the selfie and photo-ID capture. NOT done in this research (photos are not allowed). This is where every walk stops. _[unknown]_

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
Downstream: The app checks the postcode with the server (users/me/eligibility?zip=… and a postcode look-up). Jersey (JE) and Guernsey (GY) postcodes are refused in the browser: "We do not currently provide our service to this postcode." Unknown postcodes: "Sorry, Boots isn't in your postcode yet." (messages read in the app code; not tested live). Next stays disabled until the postcode passes.


**2. What’s your birth gender?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Hair-loss treatment here is for men only.  
Downstream: Female cannot continue.

- `Female` → **Stops the patient**: Stops here. The service is set to male only (genders ["male"] in the service list). Message in the app code: "We're sorry, this service isn't available for the sex you were assigned at birth. Visit Boots Health Hub for advice." Not tested live. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Male` → **Next question**: Next is enabled; goes to date of birth. _[observed]_

**3. What’s your date of birth? (Please make sure this is accurate to avoid delays to your treatment)**  
_date · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Age check. Also used later to match the photo ID.  
Downstream: Under 16 is refused in the browser ("Sorry, you need to be at least 16 to use Boots Online Doctor Service."). The server then checks the age for this service (users/me/eligibility?dob=…&category_code=HAI); the service list gives min age 18 and max age 120 for hair loss. Under-18 and over-65 behaviour not tested. After this screen the site itself creates a placeholder "temporary user" (POST users/temp) so the visit can go on without an email.


**4. Have you used this service before?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Splits new patients from returning ones.  
Downstream: Chooses the child service (HAI-F or HAI-R), and with it the product list and the questionnaire. It is self-declared: a brand-new anonymous visitor can pick "Returning" (observed).

- `First time using this service` → **Next question**: Opens the first-time product list (child service HAI-F). On the day tested only one-month packs could be chosen there; larger packs showed "Out of stock". _[observed]_
- `Returning for this service` → **Adds questions**: Opens the returning product list (child service HAI-R): same medicines and prices, every pack size available, larger packs shown first. Uses the returning questionnaires, which add one side-effect question. _[observed]_

**5. Which medicine do you prefer? (Ultimately it will be a joint decision between you and one of our clinicians on whether a particular medicine is appropriate.)**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The patient, not an engine, chooses the medicine, brand and pack size before any medical question.  
Downstream: Tablets-only packs load one questionnaire and Regaine bundles load another (ids 2049 / 2050 first-time, 2051 / 2052 returning). Featured packs are shown first; the rest (including every bundle that is available) sit behind "See more treatment options", which also has a search box. The site content also holds a "No-Choice" product entry (code HAI-F-No-Choice) that was not shown on screen.

- `Finasteride 1mg, 28 Tablets, £28` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Walked with sku 25-9. _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg, 56 Tablets, £55 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets (generic))_ _[unknown]_
- `Finasteride 1mg, 84 Tablets, £80 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets (generic))_ _[unknown]_
- `Finasteride 1mg, 168 Tablets, £138 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets (generic))_ _[unknown]_
- `Finasteride 1mg, 364 Tablets, £245 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets (generic))_ _[unknown]_
- `Propecia 1mg, 28 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 56 Tablets, £98 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets (brand))_ _[unknown]_
- `Propecia 1mg, 84 Tablets, £119 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets (brand))_ _[unknown]_
- `Propecia 1mg, 168 Tablets, £216 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets (brand))_ _[unknown]_
- `Propecia 1mg, 364 Tablets, £400 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets (brand))_ _[unknown]_
- `Finasteride 1mg (28 tablets) \| Regaine foam extra strength (73ml), £50.36` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Walked with sku 817-9. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[observed]_
- `Finasteride 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £108 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_
- `Finasteride 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £181.59 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_
- `Finasteride 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £334.39 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_
- `Propecia 1mg (28 tablets) \| Regaine foam extra strength (73ml), £72` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £139 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_
- `Propecia 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £244 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_
- `Propecia 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £458 [shown as "Out of stock"]` → **Unknown**: Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[unknown]_

**6. Product page for the chosen pack: name, price, short description, and four fold-out sections: "Is it suitable for me?", "How to take it", "How it works", "What else should I know?"**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Shows who should not take the medicine before the questions start.

- `Continue` → **Next question**: Creates the draft order on the server (status "Not submitted") with this task list: Health Questions, ID Photos, Account-Setup, Delivery, Payment. _[observed]_

**7. Important info: Just like a traditional consultation we're going to ask you about your medical history and symptoms. Your answers will help us assess your suitability for treatment. Please answer all questions honestly and in full. If you have any problems understanding or answering a question please call or message us.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Honesty statement before the medical questions.

- `I understand the important information above.` → **Next question**: Tick box. Continue stays disabled until it is ticked, then the health questions open. _[observed]_

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
- `I'd rather NOT have Regaine, please change my prescription to Finasteride tablets only.` → **Switches product**: Asks for Regaine to be dropped and tablets only to be prescribed. The website keeps the bundle on the order; the change is left to the clinician: inferred. Amber flag (status 2 in the quiz definition): marked for the clinician. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle), Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[inferred]_

**10. Which of the following best describes your hair loss? (Tick all that apply)**  
_multi · anonymous · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Checks the pattern fits male pattern baldness (temples, crown). Patches or complete loss suggest another cause.  
Downstream: Follow-ups: "Are you experiencing any areas of hair loss on your scalp that look l…"; "Do you have complete baldness?". Up to 4 options may be ticked.

- `Temples only (receding at the front)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Temples and Crown` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Random patches` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you experiencing any areas of hair loss on your scalp that look like circular patches…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Complete` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Do you have complete baldness?". _[code]_

**11. Are you experiencing any areas of hair loss on your scalp that look like circular patches, with a smooth surface?**  
_single · anonymous · role: diagnosis · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Random patches" · no branch · code_  
Why they ask: Screens for alopecia areata (smooth round patches), which this service does not treat.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_

**12. Do you have complete baldness?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Complete" · no branch · code_  
Why they ask: Finasteride is unlikely to help once most hair is lost.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No, it affects mostly the front and top of my scalp` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**13. Do you have broken, infected, shaved or inflamed skin on your scalp?**  
_single · anonymous · role: safety-screen · shown: always · no branch · code_  
Why they ask: Regaine must not go on damaged, infected, inflamed or shaved scalp skin.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**14. Have you lost any hair elsewhere on your body?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Body hair loss points away from male pattern baldness.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**15. When did you start losing your hair?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Very recent hair loss is not typical of male pattern baldness.

- `Within the last month` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. _[code]_
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
- `I understand and do not wish to continue. I will stop this consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

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
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**20. Do you experience any of the following side effects? Low mood, suicidal thoughts or sexual problems? Please stop the medication if you have these.**  
_single · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Picks up side effects from current finasteride use.

- `Yes I have those side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No, I have other side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more") that must be filled in before Next works. _[code]_
- `No side effects` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**21. Is your partner pregnant or trying to get pregnant?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Finasteride can harm a male foetus; trying to conceive is a reason not to treat.  
Downstream: Follow-ups: "If your partner is pregnant you must use condoms while taking finaste…"; "As your partner is trying to get pregnant, you should not use this me…".

- `My partner is pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If your partner is pregnant you must use condoms while taking finasteride or Propecia to …". _[code]_
- `My partner is trying to get pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As your partner is trying to get pregnant, you should not use this medication. If you are…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**22. If your partner is pregnant you must use condoms while taking finasteride or Propecia to prevent harm to the baby.**  
_consent · anonymous · role: consent · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is pregnant" · no branch · code_  
Why they ask: Makes the patient confirm the condom advice when a partner is pregnant.  
Downstream: Helper text under the question: "Please confirm that you understand this."

- `I confirm that I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**23. As your partner is trying to get pregnant, you should not use this medication. If you are already taking finasteride or propecia, we recommend you stop taking it for at least 2 weeks before trying to conceive with your partner.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is trying to get pregnant" · no branch · code_  
Why they ask: Tells the patient the medicine is not suitable while trying to conceive.

- `I understand and will stop my consultation.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

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

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As you are taking medication for high blood pressure, Regaine is not suitable for you. Wo…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**27. As you are taking medication for high blood pressure, Regaine is not suitable for you. Would you prefer to have tablets without Regaine?**  
_single · anonymous · role: product-selector · shown: Only when "Are you taking any medication for high blood pressure (hypertension)?" is answered "Yes" · no branch · code_  
Why they ask: Offers to drop Regaine and keep tablets only.

- `Yes - please change my prescription to tablets alone.` → **Switches product**: Asks for Regaine to be dropped and tablets only to be prescribed. The website keeps the bundle on the order; the change is left to the clinician: inferred. Amber flag (status 2 in the quiz definition): marked for the clinician. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle), Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[inferred]_
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**28. Are you taking any prescription-only medicines, over-the-counter medicines, alternative medicines or recreational drugs?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Full medicines history for the clinician.  
Downstream: Follow-ups: "You've told me you don't take any medication at all. Is that right?".

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please give me the names of all your medicines") that must be filled in before Next works. _[code]_
- `No` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You've told me you don't take any medication at all. Is that right?". _[code]_

**29. You've told me you don't take any medication at all. Is that right?**  
_single · anonymous · role: safety-screen · shown: Only when "Are you taking any prescription-only medicines, over-the-counter medi…" is answered "No" · no branch · code_  
Why they ask: Double-checks a "no medicines" answer.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Correct - I'm not on any medication` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `No, I forgot to tell you something` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me here") that must be filled in before Next works. _[code]_

**30. Do you have any of the following conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Conditions that matter for finasteride (and, in bundles, for Regaine).  
Downstream: Follow-ups: "Sexual dysfunction (including decreased sex drive and erectile dysfun…"; "Depression is an uncommon side effect of Finasteride/Propecia. If you…"; "If you’re experiencing thoughts of self harm or suicide, help is avai…".

- `Cancer` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Liver condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Sexual problems` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommo…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Depression` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Depression is an uncommon side effect of Finasteride/Propecia. If your depression gets wo…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Suicidal thoughts` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If you’re experiencing thoughts of self harm or suicide, help is available. Please call N…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _[code]_
- `Skin condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Kidney/urinary condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Hereditary problems of galactose intolerance, Lapp lactase deficiency or glucosegalactose malabsorption` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `High blood pressure (hypertension)` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
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

- `I understand that this medication is not suitable for me and I will stop this application.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**34. Other than those already mentioned, do you have any other significant medical conditions, illnesses, hospital stays or past surgical procedures?**  
_single · anonymous · role: safety-screen · shown: always · no branch · code_  
Why they ask: Catch-all medical history.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
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
- `Other medicines` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Grass, pollen, trees, or plants (hayfever)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `House dust` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Animals (dogs, cats, horses etc)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Nuts` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Something else` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_

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
- `I'd like to ask more about side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("How can I help?") that must be filled in before Next works. _[code]_

**43. Before we finish, is there anything else you want to tell me?**  
_single · anonymous · role: data-capture · shown: always · no branch · code_  
Why they ask: Free-text catch-all for the clinician.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
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

- `Open camera` → **Unknown**: Starts the selfie and photo-ID capture. NOT done in this research (photos are not allowed). This is where every walk stops. _[unknown]_

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
Downstream: The app checks the postcode with the server (users/me/eligibility?zip=… and a postcode look-up). Jersey (JE) and Guernsey (GY) postcodes are refused in the browser: "We do not currently provide our service to this postcode." Unknown postcodes: "Sorry, Boots isn't in your postcode yet." (messages read in the app code; not tested live). Next stays disabled until the postcode passes.


**2. What’s your birth gender?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Hair-loss treatment here is for men only.  
Downstream: Female cannot continue.

- `Female` → **Stops the patient**: Stops here. The service is set to male only (genders ["male"] in the service list). Message in the app code: "We're sorry, this service isn't available for the sex you were assigned at birth. Visit Boots Health Hub for advice." Not tested live. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Male` → **Next question**: Next is enabled; goes to date of birth. _[observed]_

**3. What’s your date of birth? (Please make sure this is accurate to avoid delays to your treatment)**  
_date · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Age check. Also used later to match the photo ID.  
Downstream: Under 16 is refused in the browser ("Sorry, you need to be at least 16 to use Boots Online Doctor Service."). The server then checks the age for this service (users/me/eligibility?dob=…&category_code=HAI); the service list gives min age 18 and max age 120 for hair loss. Under-18 and over-65 behaviour not tested. After this screen the site itself creates a placeholder "temporary user" (POST users/temp) so the visit can go on without an email.


**4. Have you used this service before?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Splits new patients from returning ones.  
Downstream: Chooses the child service (HAI-F or HAI-R), and with it the product list and the questionnaire. It is self-declared: a brand-new anonymous visitor can pick "Returning" (observed).

- `First time using this service` → **Next question**: Opens the first-time product list (child service HAI-F). On the day tested only one-month packs could be chosen there; larger packs showed "Out of stock". _[observed]_
- `Returning for this service` → **Adds questions**: Opens the returning product list (child service HAI-R): same medicines and prices, every pack size available, larger packs shown first. Uses the returning questionnaires, which add one side-effect question. _[observed]_

**5. Which medicine do you prefer? (Ultimately it will be a joint decision between you and one of our clinicians on whether a particular medicine is appropriate.)**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The patient, not an engine, chooses the medicine, brand and pack size before any medical question.  
Downstream: Tablets-only packs load one questionnaire and Regaine bundles load another (ids 2049 / 2050 first-time, 2051 / 2052 returning). Featured packs are shown first; the rest (including every bundle that is available) sit behind "See more treatment options", which also has a search box. The site content also holds a "No-Choice" product entry (code HAI-F-No-Choice) that was not shown on screen.

- `Finasteride 1mg, 28 Tablets, £28` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 56 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 84 Tablets, £80` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Walked with sku 24-9. _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg, 168 Tablets, £138` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 364 Tablets, £245` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Propecia 1mg, 28 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 56 Tablets, £98` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 84 Tablets, £119` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 168 Tablets, £216` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 364 Tablets, £400` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Finasteride 1mg (28 tablets) \| Regaine foam extra strength (73ml), £50.36` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Walked with sku 829-9. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[observed]_
- `Finasteride 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £108` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Finasteride 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £181.59` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Finasteride 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £334.39` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (28 tablets) \| Regaine foam extra strength (73ml), £72` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £139` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £244` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £458` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_

**6. Product page for the chosen pack: name, price, short description, and four fold-out sections: "Is it suitable for me?", "How to take it", "How it works", "What else should I know?"**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Shows who should not take the medicine before the questions start.

- `Continue` → **Next question**: Creates the draft order on the server (status "Not submitted") with this task list: Health Questions, ID Photos, Account-Setup, Delivery, Payment. _[observed]_

**7. Important info: Just like a traditional consultation we're going to ask you about your medical history and symptoms. Your answers will help us assess your suitability for treatment. Please answer all questions honestly and in full. If you have any problems understanding or answering a question please call or message us.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Honesty statement before the medical questions.

- `I understand the important information above.` → **Next question**: Tick box. Continue stays disabled until it is ticked, then the health questions open. _[observed]_

**8. Which of the following best describes your hair loss? (Tick all that apply)**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Checks the pattern fits male pattern baldness (temples, crown). Patches or complete loss suggest another cause.  
Downstream: Follow-ups: "Are you experiencing any areas of hair loss on your scalp that look l…"; "Do you have complete baldness?". The wording says "Tick all that apply" but only one option can be chosen (max 1).

- `Temples only (receding at the front)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Temples and Crown` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Random patches` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you experiencing any areas of hair loss on your scalp that look like circular patches…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Complete` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Do you have complete baldness?". _[code]_

**9. Are you experiencing any areas of hair loss on your scalp that look like circular patches, with a smooth surface?**  
_single · anonymous · role: diagnosis · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Random patches" · no branch · code_  
Why they ask: Screens for alopecia areata (smooth round patches), which this service does not treat.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `No` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_

**10. Do you have complete baldness?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Complete" · no branch · code_  
Why they ask: Finasteride is unlikely to help once most hair is lost.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `No, it affects mostly the front and top of my scalp` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**11. Do you have any of the following? Please select all that apply.**  
_multi · anonymous · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Looks for scalp disease that could be the real cause or needs treating first.  
Downstream: Follow-ups: "Treatment will be less effective if you have damaged hair follicles f…".

- `Psoriasis, fungal infections such as ringworm, or dandruff of your scalp` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Treatment will be less effective if you have damaged hair follicles from a scalp conditio…". _[code]_
- `Itchy, rough or scaling areas on your scalp` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Treatment will be less effective if you have damaged hair follicles from a scalp conditio…". _[code]_
- `Any pain, burning/ blistering or pus-filled spots on the scalp` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `None of the above` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. _[code]_

**12. Treatment will be less effective if you have damaged hair follicles from a scalp condition. I recommend you sort your scalp condition before starting this treatment.**  
_single · anonymous · role: expectation-setting · shown: Only when "Do you have any of the following? Please select all that apply." is answered "Psoriasis, fungal infections such as ringworm, or dandruff of your scalp" or "Itchy, rough or scaling areas on your scalp" · no branch · code_  
Why they ask: Warns that a scalp condition makes treatment work less well; the patient chooses to go on or stop.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `I understand and wish to continue with my consultation` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `I understand and do not wish to continue with my consultation.  I will stop this consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**13. Have you lost any hair elsewhere on your body?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Body hair loss points away from male pattern baldness.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**14. When did you start losing your hair?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Very recent hair loss is not typical of male pattern baldness.

- `Within the last month` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. _[code]_
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
- `I understand and do not wish to continue. I will stop my consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

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
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**19. Do you experience any side effects?**  
_single · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Picks up side effects from current finasteride use.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**20. I want to remind you that depression, suicidal thoughts and sexual dysfunction can occur. Do you think any of these have happened to you?**  
_multi · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Asks directly about the MHRA-highlighted side effects (depression, suicidal thoughts, sexual dysfunction) in men already on treatment.

- `Depression` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `Suicidal thoughts` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `Sexual dysfunction` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `None of the above` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. _[code]_

**21. Is your partner pregnant or trying to get pregnant?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Finasteride can harm a male foetus; trying to conceive is a reason not to treat.  
Downstream: Follow-ups: "If your partner is pregnant you must use condoms while taking finaste…"; "As your partner is trying to get pregnant, you should not use this me…".

- `My partner is pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If your partner is pregnant you must use condoms while taking finasteride or Propecia to …". _[code]_
- `My partner is trying to get pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As your partner is trying to get pregnant, you should not use this medication. If you're …". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**22. If your partner is pregnant you must use condoms while taking finasteride or Propecia to prevent harm to the baby.**  
_consent · anonymous · role: consent · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is pregnant" · no branch · code_  
Why they ask: Makes the patient confirm the condom advice when a partner is pregnant.  
Downstream: Helper text under the question: "Please confirm that you understand this."

- `I confirm that I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**23. As your partner is trying to get pregnant, you should not use this medication. If you're already taking finasteride or Propecia, we recommend you stop taking it for at least 2 weeks before trying to conceive with your partner.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is trying to get pregnant" · no branch · code_  
Why they ask: Tells the patient the medicine is not suitable while trying to conceive.

- `I understand and will stop my consultation.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

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

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You've told me you don't take any medication at all. Is that right?". _[code]_

**27. You've told me you don't take any medication at all. Is that right?**  
_multi · anonymous · role: safety-screen · shown: Only when "Are you taking any other prescription-only medicines, over-the-counte…" is answered "No" · no branch · code_  
Why they ask: Double-checks a "no medicines" answer.

- `Correct - I'm not on any medication` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `No, I forgot to tell you something` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me here") that must be filled in before Next works. Ticking it clears the other boxes. _[code]_

**28. Do you have any of the following conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Conditions that matter for finasteride (and, in bundles, for Regaine).  
Downstream: Follow-ups: "Depression and suicidal thoughts are an uncommon side effect of Finas…"; "If you’re experiencing thoughts of self harm or suicide, help is avai…"; "Sexual dysfunction (including decreased sex drive and erectile dysfun…".

- `Cancer` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Liver condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Depression` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Depression and suicidal thoughts are an uncommon side effect of Finasteride/Propecia. If …". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Suicidal thoughts` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If you’re experiencing thoughts of self harm or suicide, help is available. Please call N…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _[code]_
- `Sexual dysfunction (including decreased sex drive and erectile dysfunction)` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommo…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Skin condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Kidney/urinary condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Hereditary problems of galactose intolerance, Lapp lactase deficiency or glucosegalactose malabsorption` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
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

- `I understand that this medication is not suitable for me and I will stop this application.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**32. Other than those already mentioned, do you have any other significant medical conditions, illnesses, hospital stays or past surgical procedures?**  
_single · anonymous · role: safety-screen · shown: always · no branch · code_  
Why they ask: Catch-all medical history.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
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
- `Other medicines` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Grass, pollen, trees, or plants (hayfever)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `House dust` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Animals (dogs, cats, horses etc)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Nuts` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Something else` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_

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
- `I'd like to ask more about side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("How can I help?") that must be filled in before Next works. _[code]_

**41. Would you like me to tell your GP about any care we provide? Ideally your GP should know about any medicines you’re taking.**  
_single · anonymous · role: data-capture · shown: always · no branch · code_  
Why they ask: Asks permission to inform the GP and, if yes, collects the GP practice.

- `Yes` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Opens a GP practice search box (a GP surgery name or postcode); not used in this research. _[code]_
- `No (This won't affect our review of your order, but we would encourage you to tell your GP)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**42. Before we finish, is there anything else you want to tell me?**  
_single · anonymous · role: data-capture · shown: always · no branch · code_  
Why they ask: Free-text catch-all for the clinician.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**43. Please confirm that you understand the questions asked and have answered them honestly. This treatment is for you only. You should read the patient information leaflet that comes with your medicine and send us a message if you have further questions.**  
_consent · anonymous · role: consent · shown: always · no branch · code_  
Why they ask: Final declaration of honesty and own use.

- `Please tick to confirm that you understand and agree` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**44. Let's confirm it's you. We need to verify your identity before we can prescribe. You'll be asked for: a selfie; a photo of your ID**  
_photo · anonymous · role: identity · shown: always, straight after the last health question (task 2 of the order) · no branch · code_  
Why they ask: Identity check before prescribing ("Regulations require us to see who we're treating." in the order data). ID wording in the app parameters: driver's licence or passport, with full name, date of birth and face visible.

- `Open camera` → **Unknown**: Starts the selfie and photo-ID capture. NOT done in this research (photos are not allowed). This is where every walk stops. _[unknown]_

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
Downstream: The app checks the postcode with the server (users/me/eligibility?zip=… and a postcode look-up). Jersey (JE) and Guernsey (GY) postcodes are refused in the browser: "We do not currently provide our service to this postcode." Unknown postcodes: "Sorry, Boots isn't in your postcode yet." (messages read in the app code; not tested live). Next stays disabled until the postcode passes.


**2. What’s your birth gender?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Hair-loss treatment here is for men only.  
Downstream: Female cannot continue.

- `Female` → **Stops the patient**: Stops here. The service is set to male only (genders ["male"] in the service list). Message in the app code: "We're sorry, this service isn't available for the sex you were assigned at birth. Visit Boots Health Hub for advice." Not tested live. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Male` → **Next question**: Next is enabled; goes to date of birth. _[observed]_

**3. What’s your date of birth? (Please make sure this is accurate to avoid delays to your treatment)**  
_date · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Age check. Also used later to match the photo ID.  
Downstream: Under 16 is refused in the browser ("Sorry, you need to be at least 16 to use Boots Online Doctor Service."). The server then checks the age for this service (users/me/eligibility?dob=…&category_code=HAI); the service list gives min age 18 and max age 120 for hair loss. Under-18 and over-65 behaviour not tested. After this screen the site itself creates a placeholder "temporary user" (POST users/temp) so the visit can go on without an email.


**4. Have you used this service before?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Splits new patients from returning ones.  
Downstream: Chooses the child service (HAI-F or HAI-R), and with it the product list and the questionnaire. It is self-declared: a brand-new anonymous visitor can pick "Returning" (observed).

- `First time using this service` → **Next question**: Opens the first-time product list (child service HAI-F). On the day tested only one-month packs could be chosen there; larger packs showed "Out of stock". _[observed]_
- `Returning for this service` → **Adds questions**: Opens the returning product list (child service HAI-R): same medicines and prices, every pack size available, larger packs shown first. Uses the returning questionnaires, which add one side-effect question. _[observed]_

**5. Which medicine do you prefer? (Ultimately it will be a joint decision between you and one of our clinicians on whether a particular medicine is appropriate.)**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: The patient, not an engine, chooses the medicine, brand and pack size before any medical question.  
Downstream: Tablets-only packs load one questionnaire and Regaine bundles load another (ids 2049 / 2050 first-time, 2051 / 2052 returning). Featured packs are shown first; the rest (including every bundle that is available) sit behind "See more treatment options", which also has a search box. The site content also holds a "No-Choice" product entry (code HAI-F-No-Choice) that was not shown on screen.

- `Finasteride 1mg, 28 Tablets, £28` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 56 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 84 Tablets, £80` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Walked with sku 24-9. _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg, 168 Tablets, £138` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Finasteride 1mg, 364 Tablets, £245` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets (generic))_ _[inferred]_
- `Propecia 1mg, 28 Tablets, £55` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 56 Tablets, £98` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 84 Tablets, £119` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 168 Tablets, £216` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Propecia 1mg, 364 Tablets, £400` → **Next question**: Creates a draft order for this pack and loads the tablets-only questionnaire. Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets (brand))_ _[inferred]_
- `Finasteride 1mg (28 tablets) \| Regaine foam extra strength (73ml), £50.36` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Walked with sku 829-9. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[observed]_
- `Finasteride 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £108` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Finasteride 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £181.59` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Finasteride 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £334.39` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (28 tablets) \| Regaine foam extra strength (73ml), £72` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (84 tablets) \| Regaine foam extra strength (3 x 73ml), £139` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (168 tablets) \| Regaine foam extra strength (6 x 73ml), £244` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_
- `Propecia 1mg (364 tablets) \| Regaine foam extra strength (12 x 73ml), £458` → **Adds questions**: Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions). Not walked for this exact pack: assumed to behave like the walked pack of the same kind. _(affects: Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[inferred]_

**6. Product page for the chosen pack: name, price, short description, and four fold-out sections: "Is it suitable for me?", "How to take it", "How it works", "What else should I know?"**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Shows who should not take the medicine before the questions start.

- `Continue` → **Next question**: Creates the draft order on the server (status "Not submitted") with this task list: Health Questions, ID Photos, Account-Setup, Delivery, Payment. _[observed]_

**7. Important info: Just like a traditional consultation we're going to ask you about your medical history and symptoms. Your answers will help us assess your suitability for treatment. Please answer all questions honestly and in full. If you have any problems understanding or answering a question please call or message us.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Honesty statement before the medical questions.

- `I understand the important information above.` → **Next question**: Tick box. Continue stays disabled until it is ticked, then the health questions open. _[observed]_

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
- `I'd rather NOT have Regaine, please change my prescription to Finasteride tablets only.` → **Switches product**: Asks for Regaine to be dropped and tablets only to be prescribed. The website keeps the bundle on the order; the change is left to the clinician: inferred. Amber flag (status 2 in the quiz definition): marked for the clinician. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle), Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[inferred]_

**10. Which of the following best describes your hair loss? (Tick all that apply)**  
_multi · anonymous · role: diagnosis · shown: always · BRANCHES · code_  
Why they ask: Checks the pattern fits male pattern baldness (temples, crown). Patches or complete loss suggest another cause.  
Downstream: Follow-ups: "Are you experiencing any areas of hair loss on your scalp that look l…"; "Do you have complete baldness?". Up to 4 options may be ticked.

- `Temples only (receding at the front)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Temples and Crown` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Random patches` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Are you experiencing any areas of hair loss on your scalp that look like circular patches…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Complete` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Do you have complete baldness?". _[code]_

**11. Are you experiencing any areas of hair loss on your scalp that look like circular patches, with a smooth surface?**  
_single · anonymous · role: diagnosis · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Random patches" · no branch · code_  
Why they ask: Screens for alopecia areata (smooth round patches), which this service does not treat.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_

**12. Do you have complete baldness?**  
_single · anonymous · role: eligibility-gate · shown: Only when "Which of the following best describes your hair loss? (Tick all that …" is answered "Complete" · no branch · code_  
Why they ask: Finasteride is unlikely to help once most hair is lost.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No, it affects mostly the front and top of my scalp` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**13. Do you have broken, infected, shaved or inflamed skin on your scalp?**  
_single · anonymous · role: safety-screen · shown: always · no branch · code_  
Why they ask: Regaine must not go on damaged, infected, inflamed or shaved scalp skin.

- `Yes` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**14. Have you lost any hair elsewhere on your body?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Body hair loss points away from male pattern baldness.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**15. When did you start losing your hair?**  
_single · anonymous · role: diagnosis · shown: always · no branch · code_  
Why they ask: Very recent hair loss is not typical of male pattern baldness.

- `Within the last month` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. _[code]_
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
- `I understand and do not wish to continue. I will stop this consultation now.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

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
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**20. Do you experience any of the following side effects? Low mood, suicidal thoughts or sexual problems? Please stop the medication if you have these.**  
_single · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Picks up side effects from current finasteride use.

- `Yes I have those side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `No, I have other side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more") that must be filled in before Next works. _[code]_
- `No side effects` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**21. I want to remind you that depression, suicidal thoughts and sexual dysfunction can occur. Do you think any of these have happened to you?**  
_multi · anonymous · role: safety-screen · shown: Only when "Are you currently using Finasteride or Propecia for hair loss?" is answered "Yes" · no branch · code_  
Why they ask: Asks directly about the MHRA-highlighted side effects (depression, suicidal thoughts, sexual dysfunction) in men already on treatment.

- `Depression` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Suicidal thoughts` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `Sexual dysfunction` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `None of the above` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. Ticking it clears the other boxes. _[code]_

**22. Is your partner pregnant or trying to get pregnant?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Finasteride can harm a male foetus; trying to conceive is a reason not to treat.  
Downstream: Follow-ups: "If your partner is pregnant you must use condoms while taking finaste…"; "As your partner is trying to get pregnant, you should not use this me…".

- `My partner is pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If your partner is pregnant you must use condoms while taking finasteride or Propecia to …". _[code]_
- `My partner is trying to get pregnant` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As your partner is trying to get pregnant, you should not use this medication. If you are…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _[code]_
- `None of these apply` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**23. If your partner is pregnant you must use condoms while taking finasteride or Propecia to prevent harm to the baby.**  
_consent · anonymous · role: consent · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is pregnant" · no branch · code_  
Why they ask: Makes the patient confirm the condom advice when a partner is pregnant.  
Downstream: Helper text under the question: "Please confirm that you understand this."

- `I confirm that I understand` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**24. As your partner is trying to get pregnant, you should not use this medication. If you are already taking finasteride or propecia, we recommend you stop taking it for at least 2 weeks before trying to conceive with your partner.**  
_consent · anonymous · role: eligibility-gate · shown: Only when "Is your partner pregnant or trying to get pregnant?" is answered "My partner is trying to get pregnant" · no branch · code_  
Why they ask: Tells the patient the medicine is not suitable while trying to conceive.

- `I understand and will stop my consultation.` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

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

- `Yes` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "As you are taking medication for high blood pressure, Regaine is not suitable for you. Wo…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `No` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_

**28. As you are taking medication for high blood pressure, Regaine is not suitable for you. Would you prefer to have tablets without Regaine?**  
_single · anonymous · role: product-selector · shown: Only when "Are you taking any medication for high blood pressure (hypertension)?" is answered "Yes" · no branch · code_  
Why they ask: Offers to drop Regaine and keep tablets only.

- `Yes - please change my prescription to tablets alone.` → **Switches product**: Asks for Regaine to be dropped and tablets only to be prescribed. The website keeps the bundle on the order; the change is left to the clinician: inferred. Amber flag (status 2 in the quiz definition): marked for the clinician. _(affects: Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle), Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[inferred]_
- `No` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**29. Are you taking any prescription-only medicines, over-the-counter medicines, alternative medicines or recreational drugs?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Full medicines history for the clinician.  
Downstream: Follow-ups: "You've told me you don't take any medication at all. Is that right?".

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please give me the names of all your medicines") that must be filled in before Next works. _[code]_
- `No` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "You've told me you don't take any medication at all. Is that right?". _[code]_

**30. You've told me you don't take any medication at all. Is that right?**  
_single · anonymous · role: safety-screen · shown: Only when "Are you taking any prescription-only medicines, over-the-counter medi…" is answered "No" · no branch · code_  
Why they ask: Double-checks a "no medicines" answer.  
Downstream: Drawn as tick boxes, but each choice clears the others, so it works as single choice.

- `Correct - I'm not on any medication` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `No, I forgot to tell you something` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me here") that must be filled in before Next works. _[code]_

**31. Do you have any of the following conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Conditions that matter for finasteride (and, in bundles, for Regaine).  
Downstream: Follow-ups: "Sexual dysfunction (including decreased sex drive and erectile dysfun…"; "Depression is an uncommon side effect of Finasteride/Propecia. If you…"; "If you’re experiencing thoughts of self harm or suicide, help is avai…".

- `Cancer` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Liver condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Sexual problems` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Sexual dysfunction (including decreased sex drive and erectile dysfunction) is an uncommo…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Depression` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "Depression is an uncommon side effect of Finasteride/Propecia. If your depression gets wo…". Amber flag (status 2 in the quiz definition): marked for the clinician. _[code]_
- `Suicidal thoughts` → **Adds questions**: Shows a follow-up question straight after this one (same step of the progress bar): "If you’re experiencing thoughts of self harm or suicide, help is available. Please call N…". Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _[code]_
- `Skin condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Kidney/urinary condition` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Hereditary problems of galactose intolerance, Lapp lactase deficiency or glucosegalactose malabsorption` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
- `High blood pressure (hypertension)` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_
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

- `I understand that this medication is not suitable for me and I will stop this application` → **Flags for the clinician**: Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Finasteride 1mg tablets + Regaine foam extra strength (bundle), Propecia 1mg tablets + Regaine foam extra strength (bundle))_ _[code]_

**35. Other than those already mentioned, do you have any other significant medical conditions, illnesses, hospital stays or past surgical procedures?**  
_single · anonymous · role: safety-screen · shown: always · no branch · code_  
Why they ask: Catch-all medical history.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
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
- `Other medicines` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
- `Grass, pollen, trees, or plants (hayfever)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `House dust` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Animals (dogs, cats, horses etc)` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Nuts` → **Next question**: No flag (status 0 in the quiz definition). Carries on to the next question. _[code]_
- `Something else` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_

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
- `I'd like to ask more about side effects` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("How can I help?") that must be filled in before Next works. _[code]_

**44. Before we finish, is there anything else you want to tell me?**  
_single · anonymous · role: data-capture · shown: always · no branch · code_  
Why they ask: Free-text catch-all for the clinician.

- `Yes` → **Flags for the clinician**: Amber flag (status 2 in the quiz definition): marked for the clinician. The website carries on to the next question. Opens a free-text box ("Please tell me more about this") that must be filled in before Next works. _[code]_
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

- `Open camera` → **Unknown**: Starts the selfie and photo-ID capture. NOT done in this research (photos are not allowed). This is where every walk stops. _[unknown]_

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

**Weaknesses**

- Men only; nothing for women's hair loss.
- Very narrow range: finasteride 1 mg tablets with or without Regaine foam. No topical finasteride, oral minoxidil, dutasteride, compounded sprays, shampoos or supplements.
- The patient must choose medicine and pack before answering anything; no guidance or recommendation.
- No photos of the scalp are asked for; pattern is one four-option question with wording errors ("Tick all that apply" on a single-choice question).
- Red-flag answers do not stop the flow on screen; the patient can go on to ID photos and payment details and only then be refused.
- First-time list showed most packs as "Out of stock"; ID photo step adds friction; dated copy (pages last reviewed 2021 and 2023, placeholder text left in the content data).

**Gaps a new competitor could use**

- A guided recommendation (pattern, goals, preferences) instead of a price list.
- Options for men who cannot or will not take oral finasteride, and a women's pathway.
- Immediate, kind on-screen outcomes for red-flag answers with signposting, instead of late refusal.
- Scalp photo review and progress tracking; subscription convenience with easy pause.

## 10. Limits of this report

- The meaning of option status 2 (amber) and 3 (red) is inferred from which answers carry them; the site never shows it. What the clinician or server does with them cannot be seen without an account.
- Nothing after the health questions was seen live (ID photos, account, delivery, payment, clinician messages, refusals). Those steps are described from the order task list and app parameters only.
- Only one full click-through was done (first-time, tablets only). The other three question sets come from the served definitions; their screens were not clicked through.
- Propecia packs and the Propecia bundle were not walked; they are assumed to use the same questionnaires as the finasteride packs.
- Under-18, over-65, female and unsupported-postcode behaviour was read in the code, not tested.
- Stock flags and prices are as served on 2026-11-23 and may change. The Regaine strength is not stated on the site.
- A postcode had to be entered to begin (the site's own placeholder N1 0QH was used). If the project owner counts a postcode as an address, treat every live walk here as outside the rules and rely on the served definitions only.

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
