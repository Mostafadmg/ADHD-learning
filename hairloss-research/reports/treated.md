# Treated: consultation and product report

**Market:** UK · **Website:** https://uk.treated.com/ · **Checked:** 2026-11-24 · **Owner:** HR Healthcare Ltd t/a Treated (company 06790962, Bolton); footer also names Webcare Group Limited; pharmacy GPhC 9010946

> Multi-condition UK online doctor and pharmacy; hair loss is a men-only condition sold through one generic questionnaire with licensed and off-label tablets and branded minoxidil on monthly-to-6-monthly subscriptions.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** Checkout 'Patient details' page (start.treated.com/GBR/en/#/checkout): first name, last name, date of birth, email, phone. Reached after the questionnaire, height/weight, medical profile, the treatment options screen and the product questions. The full recommendation screen and prices are shown before the wall.
- **Blocker:** Women cannot start the hair-loss consultation (sex gate hard stop).
- **Blocker:** Occasional late cookie banner and timing flakes in replays (one Regaine walk failed twice).

Men's flow walked to the treatment options screen in 21 one-change replays (runs/e00–e20) plus stage 1 walks to the account wall from the general entry and the Dutasteride, Avodart, Regaine and Propecia entries. Question set and per-option actions from the served definition (quiz-definition-male.json); product list, prices and automatic-offer limits from gettreatmentoptions, compared run by run (scripts/summ.js, scripts/odiff.js). Women: hard stop. Nothing after the account wall. Stage 3 (verify) replayed both baselines and 11 more cases fresh (runs/verify-*), re-read the live product pages and found the review/auto messages are only in the server response, not on screen.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen), **owner-run** (seen in the owner's own browser research, not replayed by us).

## 2. How the engine decides (short version)

Treated runs one short men-only questionnaire (11 questions, height and weight, a general medical profile) and then always shows the same five products with prices, with Finasteride 1mg pre-selected (or the product of the page the man came from). The answers do not choose the medicine. They decide two things: whether the man is stopped (female, or any history of mental illness), and whether the case is an automatic offer or goes to clinician review. That decision sits in the server response (mode Auto or Offline); the patient sees the same screen either way. Almost any non-standard answer, and simply never having used treatment or not having seen a doctor, sends the case to review, so most first-time buyers are reviewed after paying. Only in the automatic offer are per-product limits applied: smoking or any alcohol removes the two dutasteride products. Date of birth is asked only after the account wall. BMI over 35 sends the whole case to review, even from the Dutasteride link.

## 3. Engine rules (26)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men | men-q0 = Female | Hair-loss consultation ends at once: "This treatment category isn't suitable for the gender you have selected." No women's products. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (branded finasteride), Dutasteride 0.5mg capsules (generic), Avodart 0.5mg capsules (branded dutasteride), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml))_ | Stops the patient | observed | high |
| R2 | men | men-q8 includes "Mental illness (including depression, anxiety, suicidal thoughts)" | Hard stop for the whole consultation: inline "Finasteride and mental illness" warning, Continue disabled. Minoxidil (Regaine) cannot be reached either. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (branded finasteride), Dutasteride 0.5mg capsules (generic), Avodart 0.5mg capsules (branded dutasteride), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml))_ | Stops the patient | observed | high |
| R3 | men | men-q3 = "Yes" (seen a doctor) AND men-q4 names a treatment used before AND every other answer is a "pass" answer AND BMI 35 or under AND the medical profile has no condition, surgery, medicine, allergy, disability, family history or recreational drug | Automatic offer: the options response has mode Auto, no approval required, displayMessage "Based on what you've told us, our clinician has recommended the treatments below" (not visible on screen in the captured runs). Same products and prices as review mode. | No effect | observed | high |
| R4 | men | men-q3 = "No" (not seen a doctor), even with every other answer passing | Clinician review: options response mode Offline, approval required, displayMessage "We still need to review your consultation..." (not visible on screen). Products, prices and default unchanged; the patient still picks and pays before review. | Flags for the clinician | observed | high |
| R5 | men | men-q4 = "I've never used any" | Clinician review (Offline). With R4 this means every man new to treatment, and every man who has not seen a doctor, is reviewed by a clinician: the baseline man is never auto-offered. | Flags for the clinician | observed | high |
| R6 | men | men-q1 includes breakage, back and sides, one side, sudden onset or medicine-induced | Clinician review (Offline); no warning, no extra question, same products. | Flags for the clinician | observed | high |
| R7 | men | men-q2 = "Less than 3 months ago" | Clinician review (Offline), same products. | Flags for the clinician | observed | high |
| R8 | men | men-q5 = "Yes" (scars near the hair loss) | Clinician review (Offline), same products. No referral message on screen. | Flags for the clinician | observed | high |
| R9 | men | men-q6 = "High (Above 140/90)" or "I don't know" | Clinician review (Offline), same products; Regaine stays listed. | Flags for the clinician | observed | high |
| R10 | men | men-q6 = "Low (Below 90/60)" | No effect: still Auto with Regaine (minoxidil) offered. Low blood pressure is not screened. _(affects: Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml))_ | No effect | observed | high |
| R11 | men | men-q7 = "Over six months ago" | Clinician review (Offline), same products. | Flags for the clinician | observed | high |
| R12 | men | men-q8 includes any condition other than mental illness (diabetes, heart, high blood pressure, stroke, liver or kidney, adrenal tumour, enlarged prostate, prostate cancer, breast lump or cancer) | Clinician review (Offline). No warning, no product removed (Regaine stays even with heart disease). | Flags for the clinician | observed | high |
| R13 | men | men-q9 includes any symptom (weight loss, hot flushes, itchy scalp, skin or nail problems, bowel changes, problems passing urine) | Clinician review (Offline), same products. | Flags for the clinician | observed | high |
| R14 | men | BMI above 35 (men-hw) | Clinician review (Offline), same five products and default. Also Offline from the Dutasteride link, with Dutasteride pre-selected (runs/verify-dut-bmi40), even though the dutasteride products carry no BMI limit in the served data (offerBmi false). So BMI over 35 acts on the whole case; the mechanism is not visible in the served data. | Flags for the clinician | observed | high |
| R15 | men | Medical profile has a medical condition (any, even asthma) | Clinician review (Offline), same products. | Flags for the clinician | observed | high |
| R16 | men | Medical profile has a medicine or an allergy (observed), or surgery, a disability, family history or recreational drug use (code only) | Clinician review (Offline), same products. Medication (Paracetamol) and allergy (Penicillin) seen live; the other four follow the served limits (offerIf…=false for every product) but were not replayed. | Flags for the clinician | observed | medium |
| R17 | men | Automatic-offer case AND medical profile says the man smokes or used to smoke (any option) | Dutasteride and Avodart are removed; Finasteride (default), Propecia and Regaine remain. _(affects: Dutasteride 0.5mg capsules (generic), Avodart 0.5mg capsules (branded dutasteride))_ | Removes a product | observed | high |
| R18 | men | Automatic-offer case AND medical profile says the man drinks alcohol (even under 14 units a week) | Dutasteride and Avodart are removed; Finasteride (default), Propecia and Regaine remain. _(affects: Dutasteride 0.5mg capsules (generic), Avodart 0.5mg capsules (branded dutasteride))_ | Removes a product | observed | high |
| R19 | men | Clinician-review (Offline) case, whatever the smoking or drinking answers | All five products are listed, including Dutasteride and Avodart: the per-product limits only filter the automatic offer. | No effect | observed | high |
| R20 | men | Entry from a product link (product=024-143 / 024-313 / 024-1973 / 024-1915 / 024-322) | That product is pre-selected on the options screen; questions are the same. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (branded finasteride), Dutasteride 0.5mg capsules (generic), Avodart 0.5mg capsules (branded dutasteride), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml))_ | Switches product | observed | high |
| R21 | men | Entry from the Dutasteride link AND the automatic-offer limits remove dutasteride (smoker or any alcohol) | Default falls back to Finasteride 1mg; dutasteride is not shown. _(affects: Dutasteride 0.5mg capsules (generic), Finasteride 1mg tablets (generic))_ | Switches product | observed | high |
| R22 | men | Previous treatment named in men-q4 (finasteride, minoxidil or dutasteride) | No change to the list or default: Finasteride stays pre-selected even after dutasteride or minoxidil use. | No effect | observed | high |
| R23 | men | Save with Finasteride or Propecia selected | One product question: side-effect warning (depression, suicidal thoughts, sexual dysfunction), "I understand". Then checkout (account wall). _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (branded finasteride))_ | Adds questions | observed | high |
| R24 | men | Save with Dutasteride or Avodart selected | Three product questions: previous finasteride/minoxidil use (4 options, none branch), off-label acknowledgement, side-effect warning. Then checkout. _(affects: Dutasteride 0.5mg capsules (generic), Avodart 0.5mg capsules (branded dutasteride))_ | Adds questions | observed | high |
| R25 | men | Save with Regaine selected | No product questions; straight to checkout. _(affects: Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml))_ | Skips questions | observed | high |
| R26 | men | Age outside 18–49 (date of birth, asked only at checkout) | Probably clinician review for finasteride, Propecia and Regaine (served limit minimumAge 18, maximumAge 49); dutasteride products carry no age limit. Cannot be tested anonymously. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (branded finasteride), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml))_ | Flags for the clinician | code | low |

## 4. Products (7)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Finasteride 1mg tablets (generic)](https://uk.treated.com/hair-loss/finasteride) | rx-oral | finasteride 1mg | tablet, one daily | men | POM, licensed for male pattern hair loss | £34.95 for 28 tablets delivered every month (56 tablets every 2 months £55.95; 84 every 3 months £73.95; 168 every 6 months £130.95. Free delivery. Cancellable auto-renewing subscription.) | Default for every man who reaches the options screen from the general entry, in both automatic and review mode (all observed runs). Automatic-offer limits: age 18–49, BMI 35 or under, nothing in the medical profile except smoking or drinking. Removed only by the mental-illness hard stop. | observed |
| [Propecia 1mg tablets (branded finasteride)](https://uk.treated.com/hair-loss/propecia) | rx-oral | finasteride 1mg | tablet, one daily | men | POM, licensed for male pattern hair loss | £66.95 for 28 tablets delivered every month (56 every 2 months £114.95; 84 every 3 months £149.95; 168 every 6 months £287.95.) | Always listed (rank 3) for men who pass the hard stops; pre-selected only from the Propecia product link (runs/e15-propecia-save). Same limits as generic finasteride. | observed |
| [Dutasteride 0.5mg capsules (generic)](https://uk.treated.com/hair-loss/dutasteride) | rx-oral | dutasteride 0.5mg | capsule, one daily | men | POM, licensed for enlarged prostate; prescribed off-label for hair loss (the site says so) | £34.95 for 30 capsules delivered every month (60 every 2 months £63.95; 90 every 3 months £89.95.) | Listed for every review-mode case. In the automatic offer only for men who neither smoke (including ex-smokers) nor drink alcohol (runs/e16, e17, e19). Pre-selected only from its product link, and then only if it passes those limits (runs/e20). Never the default from the general entry, even after finasteride use. | observed |
| [Avodart 0.5mg capsules (branded dutasteride)](https://uk.treated.com/hair-loss/avodart) | rx-oral | dutasteride 0.5mg | capsule, one daily | men | POM, licensed for enlarged prostate; off-label for hair loss | £47.95 for 30 capsules delivered every month (60 every 2 months £81.95; 90 every 3 months £113.95 (the 90 pack is marked most popular).) | Same as Dutasteride: listed in review mode; in the automatic offer only for non-smoking, non-drinking men; pre-selected only from its product link. | observed |
| [Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml)](https://uk.treated.com/hair-loss/regaine) | otc-medicine | minoxidil 5% | topical solution or foam, twice daily | men | Licensed non-prescription medicine (site: 'available over the counter'; P or GSL class not checked) | £99.95 for 3x60ml solution delivered every 3 months (3x73ml (foam, half a capful twice daily) £104.95 every 3 months. Only one plan length each. The options data carries an old 'Starting from £55.95' tag; the live price shown is £99.95.) | Always listed (rank 2) for men who pass the hard stops, including men with low blood pressure or heart disease (heart sends the case to review but does not remove it). Pre-selected only from its product link. Same limits as finasteride; no product questions. | observed |
| [Finasteride + Minoxidil Drops (custom made)](https://uk.treated.com/hair-loss/finasteride-minoxidil-drops) | rx-topical-compounded | finasteride unknown; minoxidil unknown | scalp drops with pipette, daily | men | Unlicensed combined formulation made to order (the page says 'currently unlicensed') | Not available (no price shown) (Product page and category page both show 'Not available' on 2026-11-23; it is not in the consultation's options list.) | Never offered: the page says "Not available" and the product is absent from every treatment-options response (all runs). | docs |
| [Regaine (telogen effluvium category)](https://uk.treated.com/telogen-effluvium/regaine) | otc-medicine | minoxidil 2% or 5% (the page describes Regaine for Men 5% solution and foam, Regaine for Women 5% foam and 2% solution) | topical solution or foam | both | Licensed non-prescription medicine (P or GSL class not checked) | Not available (no price shown) (Category page https://uk.treated.com/telogen-effluvium and product page show "Not available" on 2026-11-24; no consultation start link. Found through the site map in stage 3.) | Never offered: shown as "Not available" and not part of the hair-loss consultation. It is the only page on the site that describes women's hair-loss products. | docs |

## 5. Who gets what (7 patient profiles)

- **Baseline man: 32, receding + thinning on top, over 3 months, not seen a doctor, never used treatment, no medical issues, BMI 24** → Finasteride 1mg tablets (generic), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml), Propecia 1mg tablets (branded finasteride), Avodart 0.5mg capsules (branded dutasteride), Dutasteride 0.5mg capsules (generic) (default: Finasteride 1mg tablets (generic)). Clinician review (server mode Offline; the patient sees the same screen as an automatic offer). Finasteride 1mg x28 £34.95 a month pre-selected; Regaine 5% £99.95 per 3 months; Propecia £66.95; Avodart £47.95; Dutasteride £34.95. Patient picks and pays, clinician approves later (runs/e00-baseline). _[observed]_
- **Baseline woman** → nothing offered. Not served: Female is a hard stop at the first screen (runs/w1-women). _[observed]_
- **Experienced man: as baseline but has seen a doctor and used finasteride (or minoxidil or dutasteride) before, non-smoker, non-drinker** → Finasteride 1mg tablets (generic), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml), Propecia 1mg tablets (branded finasteride), Avodart 0.5mg capsules (branded dutasteride), Dutasteride 0.5mg capsules (generic) (default: Finasteride 1mg tablets (generic)). Automatic offer (server mode Auto; no visible label on screen). Same five products, prices and default as review mode (runs/e01-clean, e08, e09). _[observed]_
- **Experienced man who smokes (or used to) or drinks any alcohol** → Finasteride 1mg tablets (generic), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml), Propecia 1mg tablets (branded finasteride) (default: Finasteride 1mg tablets (generic)). Automatic offer without Dutasteride and Avodart (runs/e16-smoke-daily, e17-drink-under14, e19-ex-smoker). From the Dutasteride link the default falls back to Finasteride (runs/e20-dut-entry-smoker). _[observed]_
- **Any man with a flagged answer (sudden, patchy or one-sided loss, under 3 months, scars, high or unknown blood pressure, any listed condition or symptom, BMI over 35, anything in the medical profile except smoking or drinking)** → Finasteride 1mg tablets (generic), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml), Propecia 1mg tablets (branded finasteride), Avodart 0.5mg capsules (branded dutasteride), Dutasteride 0.5mg capsules (generic) (default: Finasteride 1mg tablets (generic)). Clinician review (Offline), all five listed even if he smokes or drinks (runs/e07, e10, e11, e12, e13, e14, e05, e18). Stage 3 added live checks for under 3 months, blood pressure last checked over six months ago, a medication and an allergy (runs/verify-under3m, verify-bpcheck-old, verify-medication, verify-allergy). _[observed]_
- **Man with a history of mental illness (including depression or anxiety)** → nothing offered. Hard stop on the conditions question; no product, not even minoxidil (runs/e04-mental). _[observed]_
- **Man entering from a product page (Propecia, Dutasteride, Avodart or Regaine)** → Finasteride 1mg tablets (generic), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml), Propecia 1mg tablets (branded finasteride), Avodart 0.5mg capsules (branded dutasteride), Dutasteride 0.5mg capsules (generic) (default: that product). The product of the link is pre-selected if it passes the limits (runs/e15-propecia-save, p1-dutasteride, p2-regaine-save). _[observed]_

## 6. The consultation, step by step

### Hair loss consultation (men only)

Entry: https://uk.treated.com/consultation-startup?condition=024&uf=cond

Start page → sex (+18+/terms) → 11 hair-loss questions → GP info → height/weight → medical profile (9 ticks) → confirm → 'checking what's safe' → treatment options (pre-selected product, Edit, Choose for me) → product questions (1 for finasteride, 3 for dutasteride/Avodart, none for Regaine) → checkout patient details = account wall. Product buttons (…&product=024-143 Finasteride, 024-313 Propecia, 024-1973 Dutasteride, 024-1915 Avodart, 024-322 Regaine, &uf=prod) use the same questions and only change the pre-selected product.

**1. What sex were you assigned at birth?**  
_single · anonymous · role: eligibility-gate · shown: always (first screen) · BRANCHES · observed_  
Why they ask: Sex gate. Sub-text: 'We ask this because some things we offer, like birth control or erectile dysfunction tablets, aren't safe for everyone to take.' Footer: 'By clicking 'Continue', you're confirming that you're aged 18 or over and agreeing to our terms of use.' This click is also the only age check before the account wall.  
Downstream: Female ends the hair-loss route (runs/w1-women).

- `Male` → **Next question**: Starts the 11-question hair-loss questionnaire. _[observed]_
- `Female` → **Stops the patient**: Hard stop: pop-up 'This treatment category isn't suitable for the gender you have selected.' with 'Cancel' or 'Choose other treatment'. The hair-loss condition is set to male only (preferredGender check in served code 2644.js). _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (branded finasteride), Dutasteride 0.5mg capsules (generic), Avodart 0.5mg capsules (branded dutasteride), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml))_ _[observed]_

**2. Which of the following options describe your hair loss? (Select all that apply.)**  
_multi · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Checks the pattern fits male pattern hair loss; other patterns (patchy, one-sided, sudden, breakage, drug-induced) are flagged for clinician review.  
Downstream: The four male-pattern answers pass; breakage, back and sides, one side, sudden and medicine-induced send the case to clinician review (observed for "sudden"); Other opens free text.

- `It's falling out at the roots` → **No effect**: No flag in the served definition (Proceed); not replayed. _[code]_
- `It's falling out at the scalp` → **No effect**: No flag in the served definition (Proceed); not replayed. _[code]_
- `It's receding from the front` → **No effect**: No flag; allows the automatic offer (baseline answer, runs/e01-clean). _[observed]_
- `It's thinning all over the top` → **No effect**: No flag; allows the automatic offer (baseline answer, runs/e01-clean). _[observed]_
- `It's breaking at the middle of the strands` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `It's falling out at the back and sides as well` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `It's falling out on just one side of my head` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `It's just very suddenly starting to fall out` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. Seen live in runs/e13-sudden against runs/e01-clean. _[observed]_
- `It's falling out because I'm on medication` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `Other` → **Adds questions**: Opens a free-text follow-up question (shown below). _[code]_

**3. Please tell us more here.**  
_text · anonymous · role: data-capture · shown: men-q1 = 'Other' · no branch · code_  
Why they ask: Free-text detail for the clinician.


**4. When did you start losing your hair?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Recent onset (under 3 months) may be shedding from another cause, so it is flagged.  
Downstream: Under 3 months sends the case to clinician review (served definition).

- `Less than 3 months ago` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. Seen live in runs/verify-under3m against runs/verify-auto (stage 3). _[observed]_
- `More than 3 months ago` → **No effect**: No flag; allows the automatic offer (baseline answer, runs/e01-clean). _[observed]_

**5. Have you seen a doctor about it?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Asks whether a doctor has already looked at it; "No" is flagged for review.  
Downstream: "No" sends the case to clinician review (observed, runs/e03-used-fin-only). In practice almost every first-time buyer is reviewed by a clinician.

- `Yes` → **No effect**: No flag. Needed (together with having used a treatment before) for the automatic offer: alone it is not enough (runs/e02-doctor-yes-only stays Offline); with men-q4 = a named treatment the screen switches to Auto (runs/e01-clean). _[observed]_
- `No` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. Seen live in runs/e03-used-fin-only against runs/e01-clean. _[observed]_

**6. Which hair loss treatment(s) have you used before? (Select all that apply.)**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Treatment history. Its only effect is the flag on "never used any": a man new to treatment is always reviewed by a clinician. It does not steer the product choice.  
Downstream: "I've never used any" sends the case to clinician review (observed, runs/e02-doctor-yes-only); which treatment was used does not change the default; Other opens free text.

- `Propecia or Finasteride` → **No effect**: No flag. Which treatment was used does not change the list or the default: Finasteride stays pre-selected whether the man used finasteride, minoxidil or dutasteride before (runs/e01-clean, e08-used-regaine, e09-used-avodart). Combined with men-q3 = Yes it allows the automatic offer. _[observed]_
- `Regaine or Rogaine or Minoxidil` → **No effect**: No flag. Which treatment was used does not change the list or the default: Finasteride stays pre-selected whether the man used finasteride, minoxidil or dutasteride before (runs/e01-clean, e08-used-regaine, e09-used-avodart). Combined with men-q3 = Yes it allows the automatic offer. _[observed]_
- `Avodart or Dutasteride` → **No effect**: No flag. Which treatment was used does not change the list or the default: Finasteride stays pre-selected whether the man used finasteride, minoxidil or dutasteride before (runs/e01-clean, e08-used-regaine, e09-used-avodart). Combined with men-q3 = Yes it allows the automatic offer. _[observed]_
- `Other` → **Adds questions**: Opens a free-text follow-up question (shown below). _[code]_
- `I've never used any` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. Seen live in runs/e02-doctor-yes-only against runs/e01-clean. _[observed]_

**7. Which other treatment(s) did you use?**  
_text · anonymous · role: data-capture · shown: men-q4 = 'Other' · no branch · code_  
Why they ask: Free-text detail for the clinician.


**8. Do you have any scars near where your hair is falling out?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Scarring hair loss needs a specialist, so it is flagged.  
Downstream: "Yes" sends the case to clinician review (observed, runs/e10-scars).

- `Yes` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. Seen live in runs/e10-scars against runs/e01-clean. _[observed]_
- `No` → **No effect**: No flag; allows the automatic offer (baseline answer, runs/e01-clean). _[observed]_

**9. What's your blood pressure?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Blood pressure screen (relevant to minoxidil). High or unknown is flagged; low blood pressure is not, even though minoxidil lowers blood pressure.  
Downstream: High or unknown sends the case to clinician review (High observed, runs/e07-bp-high); Low has no effect (runs/e06-bp-low).

- `Normal (Between 90/60 - 140/90)` → **No effect**: No flag; allows the automatic offer. _[observed]_
- `Low (Below 90/60)` → **No effect**: No effect at all: still Auto with Regaine (minoxidil) listed; response identical to the normal blood pressure run (runs/e06-bp-low vs runs/e01-clean). Low blood pressure is not screened against minoxidil. _[observed]_
- `High (Above 140/90)` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. Seen live in runs/e07-bp-high against runs/e01-clean. _[observed]_
- `I don't know` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_

**10. When was it last checked?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Checks the blood pressure reading is recent; over 6 months is flagged.  
Downstream: Over six months sends the case to clinician review (served definition). Asked even when blood pressure is "I don't know" (no condition in the definition; inferred).

- `In the last six months` → **No effect**: No flag; allows the automatic offer (baseline answer, runs/e01-clean). _[observed]_
- `Over six months ago` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. Seen live in runs/verify-bpcheck-old against runs/verify-auto (stage 3). _[observed]_

**11. Do you have or have you ever had any of the following? (Select all that apply.)**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Medical history screen. Mental illness is a hard stop (finasteride mood risk); all other conditions are flagged.  
Downstream: Mental illness is a hard stop for the whole consultation (observed, runs/e04-mental); every other condition sends the case to clinician review (heart observed, runs/e11-heart).

- `Diabetes` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `Heart problems or angina` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. Seen live in runs/e11-heart against runs/e01-clean. _[observed]_
- `High blood pressure` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `Stroke` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `Liver or kidney problems` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `A tumour of the adrenal gland` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `Enlarged prostate` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `Prostate cancer` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `Mental illness (including depression, anxiety, suicidal thoughts)` → **Stops the patient**: Hard stop for the whole hair-loss consultation: an inline box "Finasteride and mental illness – Finasteride may not be suitable for men with a history of depression or mood changes. We recommend that you speak to your usual doctor or dermatologist about the safest treatment for you." appears and Continue stays disabled. Even minoxidil (Regaine), which has no mood warning, cannot be reached. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (branded finasteride), Dutasteride 0.5mg capsules (generic), Avodart 0.5mg capsules (branded dutasteride), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml))_ _[observed]_
- `Lump in the breast or breast cancer` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `None of the above` → **No effect**: No flag; allows the automatic offer (baseline answer, runs/e01-clean). Exclusive: unticks the other options. _[observed]_

**12. Do you have any of the following symptoms? (Select all that apply.)**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Symptoms that may point to thyroid, hormonal, prostate or skin causes; all are flagged.  
Downstream: Every symptom sends the case to clinician review (itchy scalp observed, runs/e14-itchy).

- `Losing weight without trying` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `Hot flushes` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `Itchy scalp` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. Seen live in runs/e14-itchy against runs/e01-clean. _[observed]_
- `Skin or nail problems` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `More frequent bowel movements than usual` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `Problems passing urine` → **Flags for the clinician**: Switches the server decision from automatic offer to clinician review (options response: mode Offline, approval required, displayMessage "We still need to review your consultation..."). The patient's screen looks the same in both modes; that message was not visible on screen in any captured run. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen. (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.) _[code]_
- `No, none of the above` → **No effect**: No flag; allows the automatic offer (baseline answer, runs/e01-clean). Exclusive: unticks the other options. _[observed]_

**13. Is there anything else you want to add?**  
_single · anonymous · role: data-capture · shown: always · BRANCHES · observed_  
Why they ask: Free text for the prescriber.  
Downstream: "Yes" opens a free-text box for the prescriber; no effect on the offer.

- `Yes` → **Adds questions**: Opens a free-text follow-up question (shown below). _[code]_
- `No` → **No effect**: No effect on the offer (served definition: Proceed, no flag). _[code]_

**14. Please type anything else you want the prescriber to know here.**  
_text · anonymous · role: data-capture · shown: men-q10 = 'Yes' · no branch · code_  
Why they ask: Free-text detail for the clinician.


**15. Would you like us to tell your GP about any treatment we give you?**  
_single · anonymous · role: data-capture · shown: always · no branch · observed_  
Why they ask: GP sharing consent; "No" shows an info pop-up.  
Downstream: No effect on the offer; "No" shows the GP info pop-up.

- `Yes` → **No effect**: No effect on the offer (served definition: Proceed, no flag). _[code]_
- `No` → **No effect**: No effect on the offer; shows the "Just so you know" GP info pop-up (observed in every replay). _[observed]_

**16. Just so you know: Telling your GP about the treatment you get from us will help them stay informed and give you better care. If you don’t want us to notify them, we recommend letting them know yourself.**  
_info · anonymous · role: expectation-setting · shown: men-q11 = 'No' (observed). Behaviour after 'Yes' not tested (the locale file has a GP search: 'Type postcode or surgery name'). · no branch · observed_  
Why they ask: Nudges the patient to inform their GP.

- `Okay` → **Next question**: Closes the pop-up and moves to height and weight. _[observed]_

**17. What's your height and weight? (Height: ft/in or cm — Feet, Inches. Weight: lbs or kg — Stone, Pounds.)**  
_number · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Works out BMI; the served automatic-offer limit for finasteride, Propecia and Regaine is BMI 35 or under.  
Downstream: BMI above 35 switches the case to clinician review (server mode Offline; runs/e05-bmi40, runs/verify-bmi40, and from the Dutasteride link runs/verify-dut-bmi40). Products and default unchanged.


**18. Here's your medical profile. Let us know if any of the below apply to you.**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: General medical profile shared across all Treated conditions. It is the main input to the per-product automatic-offer limits.  
Downstream: Each tick opens its own pop-up. Conditions, surgery, medicines, allergies, disability, family history and recreational drugs send the case to clinician review; smoking or drinking (any amount) removes Dutasteride and Avodart from the automatic offer.

- `I have one or more medical conditions` → **Flags for the clinician**: Any typed condition (even "Asthma") switches the case to clinician review (Offline); products and default unchanged. Served rule offerIfHasConditions = false for every product. _[observed]_
- `I've had surgery before` → **Flags for the clinician**: Opens pop-up: Add your surgery history — free text, then 'When did you have this surgery?': 'Less than three years ago' / 'More than three years ago'. Button 'Add surgery'. Served rule offerIfHasSurgeries = false for every hair-loss product, so any entry should switch the case to clinician review (Offline) with the same products, as observed for a medical condition (runs/e12-profile-cond). Not replayed. _[code]_
- `I'm taking medication(s)` → **Flags for the clinician**: Opens pop-up: Add a medication — Medication name, Dosage, Frequency (all three needed before 'Add medication' is enabled). Any entry (tested: Paracetamol 500mg as needed) switches the case to clinician review (server mode Offline); same five products and default. Seen live in runs/verify-medication (stage 3). Served rule offerIfHasMedications = false for every product. _[observed]_
- `I have one or more allergies` → **Flags for the clinician**: Opens pop-up: Add an allergy — free text, button 'Add allergy'. Any entry (tested: Penicillin) switches the case to clinician review (server mode Offline); same five products and default. Seen live in runs/verify-allergy (stage 3). Served rule offerIfHasAllergies = false for every product. _[observed]_
- `I smoke or used to smoke` → **Removes a product**: In automatic-offer mode, Dutasteride and Avodart are removed from the list (any answer, even "I used to smoke but I quit"); Finasteride, Propecia and Regaine stay. If Dutasteride was pre-selected by its product link, the default switches to Finasteride. In clinician-review mode nothing changes (all five listed). Served rule: offerIfSmoke false for the two dutasteride products, true for the rest. _(affects: Dutasteride 0.5mg capsules (generic), Avodart 0.5mg capsules (branded dutasteride))_ _[observed]_
- `I drink alcohol` → **Removes a product**: In automatic-offer mode, Dutasteride and Avodart are removed even for "Less than 14 units per week"; Finasteride, Propecia and Regaine stay. Served rule offerIfDrink false for the dutasteride products only. Also seen from the Dutasteride link: the default falls back to Finasteride (runs/verify-dut-drink). _(affects: Dutasteride 0.5mg capsules (generic), Avodart 0.5mg capsules (branded dutasteride))_ _[observed]_
- `I have one or more disabilities` → **Flags for the clinician**: Opens pop-up: Tell us about your disability — free text, 'Add more info'. Served rule offerIfHasDisability = false for every hair-loss product, so any entry should switch the case to clinician review (Offline) with the same products, as observed for a medical condition (runs/e12-profile-cond). Not replayed. _[code]_
- `I have one or more close relatives with a medical condition` → **Flags for the clinician**: Opens pop-up: Add a medical condition from my family history — Condition name; Who has it? (e.g. Mum, Dad, Sister). Served rule offerIfHasFamilyMember = false for every hair-loss product, so any entry should switch the case to clinician review (Offline) with the same products, as observed for a medical condition (runs/e12-profile-cond). Not replayed. _[code]_
- `I use recreational drugs` → **Flags for the clinician**: Opens pop-up: Add recreational drugs — Name of drug; How often do you use it? Served rule offerIfHasRecreationalDrugs = false for every hair-loss product, so any entry should switch the case to clinician review (Offline) with the same products, as observed for a medical condition (runs/e12-profile-cond). Not replayed. _[code]_

**19. Does this look right? It's really important to tell us as much about your health as you can, so we can suggest the best option for you. (Then a summary: You don't have any additional medical conditions. / You aren't taking any medication. / You have no allergies to any food, drugs or anything else. / You don't have a disability. / You don’t have a family history of any medical conditions. / You aren't using any recreational drugs or narcotics.)**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Confirms the profile.

- `No, go back` → **No effect**: Back to the medical profile. _[inferred]_
- `Yes, correct` → **Next question**: Shows 'We're checking what's safe for you...' then the treatment options screen. _[observed]_

**20. 1. Choose treatment 2. Checkout 3. Complete — Here's what we've got for you. You can edit it to something else if you prefer. (Pre-selected product card with Dosage, Quantity, 'Deliver to me', price; 'Most first-time users select: 1mg x 28 tablets'; Express shipping Free; Consultation + Access to our clinicians Free.) OR Not sure? We'll pick a treatment for you based on your medical profile, and you can choose whether to accept it.**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Product choice before the account wall. Every patient who passes the hard stops sees prices and a pre-selected product. Whether the case is an automatic offer (Auto) or pending clinician review (Offline) is decided by the server, but the screen looks the same in both modes: no review or recommendation message was visible in any captured run.  
Downstream: The options response carries mode Auto (displayMessage "Based on what you've told us, our clinician has recommended the treatments below", no approval) or Offline (displayMessage "We still need to review your consultation...", approval required), decided from every earlier answer. Neither message was visible on screen in the captured runs. In Auto mode products that fail their own limits are hidden from the Edit list (smoking or alcohol hides both dutasteride products) and the default falls back to Finasteride; in Offline mode all five are listed. The product link pre-selects that product when it is allowed.

- `Save` → **Next question**: Keeps the selected product and opens its product-specific questions, then checkout (account wall). _[observed]_
- `Edit` → **No effect**: Opens pickers: 'Choose a treatment:', 'Choose a strength:', 'Choose a quantity:', 'Choose a frequency:' (runs/b2-men-edit). The treatment list is the five products returned by gettreatmentoptions: Finasteride, Regaine, Propecia, Avodart, Dutasteride. In stage 3 the open 'Choose a treatment' list was captured: five products in the automatic offer (runs/verify-bp-low) and only Finasteride, Regaine and Propecia for a smoker (runs/verify-smoke). _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (branded finasteride), Dutasteride 0.5mg capsules (generic), Avodart 0.5mg capsules (branded dutasteride), Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml))_ _[observed]_
- `Choose for me` → **Adds questions**: Opens 'Add a note for your clinician. If there's anything else you want your clinician to know, you can add it here.' with a text box and Continue (runs/b5-choose-for-me). Continue was not pressed (it leads towards checkout), so what the clinician then picks is unknown; the page itself says 'We'll pick a treatment for you based on your medical profile, and you can choose whether to accept it.' _[observed]_

**21. There are some things you need to watch out for when using Finasteride (Propecia), and not everyone can use it. In rare cases, some men have reported side effects including depression, suicidal thoughts and sexual dysfunction when using this treatment. For the very few men who experience them, these symptoms usually subside after stopping treatment, but they may persist in some. If you notice these side effects, you should stop using the treatment and seek medical advice right away.**  
_consent · anonymous · role: consent · shown: after Save with Finasteride or Propecia selected (runs/b3-men-save, runs/e15-propecia-save) · no branch · observed_  
Why they ask: Side-effect acknowledgement for finasteride and Propecia (depression, suicidal thoughts, sexual dysfunction, possible persistence). Records informed consent; no branching.

- `I understand` → **Next question**: Moves on (no flag in served data). _[code]_

**22. Have you used Finasteride (Propecia) or Minoxidil (Regaine) before?**  
_single · anonymous · role: safety-screen · shown: after Save with Dutasteride or Avodart selected (runs/p2-dutasteride-save, runs/p2-avodart-save: identical) · no branch · observed_  
Why they ask: Product-specific question for Dutasteride and Avodart.

- `Yes, it didn't work` → **Next question**: Moves on (no flag in served data). _[code]_
- `Yes, I had side effects and had to stop treatment` → **Next question**: Moves on (no flag in served data). _[code]_
- `Yes, the treatment worked well` → **Next question**: Moves on (no flag in served data). _[code]_
- `No, I've never used either` → **Next question**: Moves on (no flag in served data). _[code]_

**23. Dutasteride (Avodart) has been shown to be effective for hair loss, but it isn't licensed for this purpose. If we prescribe this treatment for you, we'll send you some info about off-label prescribing and what this means. But you can also find this in the 'Our policies' section on our website (see our footer). It's very important that you read this before taking the medication.**  
_consent · anonymous · role: consent · shown: after Save with Dutasteride or Avodart selected (runs/p2-dutasteride-save, runs/p2-avodart-save: identical) · no branch · observed_  
Why they ask: Product-specific question for Dutasteride and Avodart.

- `I understand` → **Next question**: Moves on (no flag in served data). _[code]_

**24. There are some things you need to watch out for when using Dutasteride (Avodart), and not everyone can use it. In rare cases, some men have reported side effects including depression, suicidal thoughts and sexual dysfunction when using this treatment. For the very few men who experience them, these symptoms usually subside after stopping treatment, but they may persist in some. If you notice these side effects, you should stop using the treatment and seek medical advice right away.**  
_consent · anonymous · role: consent · shown: after Save with Dutasteride or Avodart selected (runs/p2-dutasteride-save, runs/p2-avodart-save: identical) · no branch · observed_  
Why they ask: Product-specific question for Dutasteride and Avodart.

- `I understand` → **Next question**: Moves on (no flag in served data). _[code]_

**25. Payment and delivery — Patient details: First name (as it appears on your ID), Last name, Date of birth (DD-MM-YYYY), Email, Phone (+44). Then Your address, Payment. Order summary with 'Edit my choice' and '*This is a cancellable subscription that auto-renews. Cancel online, anytime, right up to the day before your next order is created.'**  
_contact · checkout · role: identity · shown: after product questions · no branch · observed_  
Why they ask: ACCOUNT WALL: identity and contact details. Not filled in (protocol). Date of birth is first asked here, so the auto-offer age limit (18-49) can only be applied after the wall.


## 7. Competitive read

**Strengths**

- Full price list, all strengths and plans, and a pre-selected product shown before any contact details: very low friction.
- Fast, clear questionnaire (11 short questions plus height, weight and a profile) with tick-box answers.
- Server-side automatic-offer engine with per-product limits (age, BMI, smoking, drinking, medical profile), so products can be filtered without changing the questions.
- Clear safety stop for a history of mental illness with finasteride, and explicit off-label and side-effect acknowledgements for dutasteride before checkout.
- Product landing pages pre-select their product, so ad traffic lands straight on what it clicked.

**Weaknesses**

- No women's hair-loss service (hard stop on sex). The only women's products (Regaine for Women) sit in a telogen effluvium category marked "Not available".
- The answers barely personalise the offer: the same five products and the same default for almost everyone; previous treatment, failure or side effects do not move a man to a different product.
- The mental-illness stop is blunt: it blocks minoxidil too, and anxiety alone ends the consultation.
- Low blood pressure is not screened against minoxidil; heart disease only flags review and Regaine stays listed.
- Age is not asked until checkout, so the 18–49 limit cannot act before the wall.
- Blanket review flags (never used treatment, not seen a doctor) mean most first-time buyers go to clinician review; the screen does not tell them so (the review message is only in the server response).
- Smoking (even ex-smokers) or any alcohol removes dutasteride from the automatic offer; we could not see a clinical reason for this (our judgement, not the company's statement).
- No scalp photos, no Norwood stage, no goals or preferences (tablet vs topical) asked before the wall.
- Compounded finasteride + minoxidil drops listed but not available; no topical finasteride, no oral minoxidil, no combination spray.

**Gaps a new competitor could use**

- Women's hair loss (topical and oral minoxidil, spironolactone, combination topicals) is untouched by Treated.
- Compounded combinations (topical finasteride + minoxidil sprays, oral minoxidil) are not sold: their only combo shows "Not available".
- A consultation that uses previous treatment response and side effects to switch product (e.g. finasteride side effects → topical, minoxidil failure → oral) would be visibly smarter.
- Ask preference (tablet vs topical, no finasteride) and Norwood stage with pictures to personalise the plan.
- Screen low blood pressure and cardiac history properly for minoxidil, and offer a minoxidil-only route for men with mood history instead of a full stop.
- Check age before showing prices, and give an honest "your clinician will review" timeline up front.

## 8. Experiments run (34)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| e00-baseline | men | none (baseline man replayed with scripts/gen.js) | Treatment options screen. Server mode Offline (clinician review) in the options response; the message "We still need to review your consultation..." is in the response, not on screen. Five products listed: Finasteride 1mg (pre-selected, 28 tablets £34.95 every month), Regaine 5% (£99.95), Propecia 1mg (£66.95), Avodart 0.5mg (£47.95), Dutasteride 0.5mg (£34.95). Same as stage 1. |
| e01-clean | men | men-q3: No → Yes AND men-q4: I have never used any → Propecia or Finasteride (the two baseline OfflineTreatment flags removed together, to make an auto-offer base) | Server mode switches from Offline to Auto (response displayMessage "Based on what you have told us, our clinician has recommended the treatments below", not visible on screen), autoOfferApprovalRequired false. The product list, order, strengths, prices and pre-selected product (Finasteride 1mg x28 £34.95) are identical; only those three fields of the response change. |
| e04-mental | men | From e01-clean base, men-q8: None of the above → Mental illness (including depression, anxiety, suicidal thoughts) | Hard stop on the same screen: inline box "Finasteride and mental illness – Finasteride may not be suitable for men with a history of depression or mood changes. We recommend that you speak to your usual doctor or dermatologist..." and Continue stays disabled. The whole consultation stops, including the minoxidil (Regaine) route. |
| e05-bmi40 | men | From e01-clean base, weight 12 st → 20 st at 5 ft 10 (BMI 24.1 → 40.2) | Mode drops from Auto back to Offline (clinician review). Same five products, same order, prices and pre-selected Finasteride 1mg. Matches the served autoOffer limit maximumBmi 35. |
| e06-bp-low | men | From e01-clean base, men-q6: Normal → Low (Below 90/60) | No change at all: still Auto, same five products including Regaine (minoxidil). The served response is identical to e01-clean apart from ids. Low blood pressure is not screened against minoxidil here. |
| e07-bp-high | men | From e01-clean base, men-q6: Normal → High (Above 140/90) | Mode drops to Offline (clinician review). No warning, no extra question, same five products and default. |
| e02-doctor-yes-only | men | Baseline with men-q3: No → Yes only (still never used treatment) | Still Offline: the "never used any" flag alone keeps the case in clinician review. Same products and default. |
| e03-used-fin-only | men | Baseline with men-q4: I have never used any → Propecia or Finasteride only (still not seen a doctor) | Still Offline: "not seen a doctor" alone keeps the case in clinician review. Same products and default. |
| e08-used-regaine | men | From e01-clean base, men-q4: Propecia or Finasteride → Regaine or Rogaine or Minoxidil | No change: still Auto, same five products, Finasteride 1mg still pre-selected. Which treatment was used before does not change the offer or default, only whether one was used at all. |
| e09-used-avodart | men | From e01-clean base, men-q4: Propecia or Finasteride → Avodart or Dutasteride | No change: still Auto, same five products, Finasteride 1mg pre-selected (dutasteride is not moved up). |
| e10-scars | men | From e01-clean base, men-q5: No → Yes (scars near the hair loss) | Mode drops to Offline (clinician review). No warning on screen, no extra question, same products and default. |
| e11-heart | men | From e01-clean base, men-q8: None of the above → Heart problems or angina | Mode drops to Offline. No warning shown on the question (unlike mental illness), Continue stays enabled, Regaine (minoxidil) is still listed, same default. |
| e12-profile-cond | men | From e01-clean base, medical profile: tick "I have one or more medical conditions" and add "Asthma" (Add condition, Confirm) | Mode drops to Offline. Same products and default. Confirms the served autoOffer flag offerIfHasConditions = false: any typed condition, even a minor one, sends the case to a clinician. |
| e13-sudden | men | From e01-clean base, men-q1: receding + thinning on top → It is just very suddenly starting to fall out (only) | Mode drops to Offline. No warning, no extra question, same five products and default. |
| e14-itchy | men | From e01-clean base, men-q9: No, none of the above → Itchy scalp | Mode drops to Offline. No warning, no extra question, same five products and default. |
| e15-propecia-save | men | From e01-clean base, entry from the Propecia product link (#/choose-gender/024/024-313), then Save on the options screen | Auto mode with Propecia 1mg pre-selected instead of Finasteride. After Save, one product question: the finasteride side-effect warning (depression, suicidal thoughts, sexual dysfunction) with I understand, the same as generic finasteride. Fills the Propecia gap from stage 1. |
| e16-smoke-daily | men | From e01-clean base, medical profile: tick I smoke or used to smoke → I smoke every day (Confirm) | Still Auto, but Avodart and Dutasteride disappear from the list. Only Finasteride (pre-selected), Regaine and Propecia are offered. Explained by the served restrictions: dutasteride and Avodart have offerIfSmoke false (and offerIfDrink false), while finasteride, Propecia and Regaine allow any smoking status. Stage 1 had wrongly recorded the limits as identical for all products. |
| e17-drink-under14 | men | From e01-clean base, medical profile: tick I drink alcohol → Less than 14 units per week (Confirm) | Still Auto, but Avodart and Dutasteride are removed; Finasteride (pre-selected), Regaine and Propecia remain. Even light drinking within guidelines removes dutasteride from the automatic offer (served offerIfDrink false for both dutasteride products). |
| e18-offline-smoke | men | Baseline (Offline) man, medical profile: I smoke every day | No change against baseline: still Offline and all five products listed, including Avodart and Dutasteride. The per-product auto-offer limits only filter the list in Auto mode; in clinician-review mode everything is shown and the clinician decides. |
| e19-ex-smoker | men | From e01-clean base, medical profile: I used to smoke but I quit (smoke = 0) | Same as current smoker: Auto, Avodart and Dutasteride removed. Any tick on the smoking toggle, even an ex-smoker, removes dutasteride from the automatic offer. |
| e20-dut-entry-smoker | men | From e01-clean base, entry from the Dutasteride product link (#/choose-gender/024/024-1973) plus medical profile: I smoke every day | Still Auto, but Dutasteride and Avodart are removed and the pre-selected product switches from Dutasteride (what the link normally pre-selects, runs/p1-dutasteride) to Finasteride 1mg. The product link cannot override the auto-offer limits. |
| verify-baseline | men | Stage 3 fresh replay of the baseline man | Matches e00: mode Offline, approval required, five products, Finasteride 1mg x28 £34.95 pre-selected. The visible screen shows no review message. |
| verify-auto | men | Stage 3 fresh replay of the auto-offer base (seen a doctor, used finasteride) | Matches e01: mode Auto, same five products and default. Visible screen text identical to the baseline (Offline) screen. |
| verify-smoke | men | From the auto base, medical profile: I smoke every day; then Edit and open the treatment list | Confirms e16: Auto, Dutasteride and Avodart removed. The on-screen list shows only Finasteride (£34.95), Regaine (£99.95) and Propecia (£66.95). |
| verify-mental | men | From the auto base, men-q8: Mental illness | Confirms e04: inline "Finasteride and mental illness" warning, Continue disabled. |
| verify-bmi40 | men | From the auto base, weight 20 st at 5 ft 10 (BMI 40) | Confirms e05: mode Offline, five products, Finasteride default. |
| verify-dut-bmi40 | men | From the auto base via the Dutasteride link, BMI 40 | Mode Offline, five products, Dutasteride pre-selected. BMI over 35 sends the case to review even when the selected product has no BMI limit. |
| verify-medication | men | From the auto base, medical profile: medication Paracetamol 500mg as needed | Mode Offline, same products and default. First live test of a medication entry. |
| verify-allergy | men | From the auto base, medical profile: allergy Penicillin | Mode Offline, same products and default. First live test of an allergy entry. |
| verify-under3m | men | From the auto base, men-q2: Less than 3 months ago | Mode Offline, same products and default (was code-only). |
| verify-bpcheck-old | men | From the auto base, men-q7: Over six months ago | Mode Offline, same products and default (was code-only). |
| verify-dut-drink | men | From the auto base via the Dutasteride link, medical profile: drink less than 14 units a week | Mode Auto, Dutasteride and Avodart removed, default falls back to Finasteride. Confirms R18 and R21 with drinking instead of smoking. |
| verify-bp-low | men | From the auto base, men-q6: Low (Below 90/60); then Edit and open the treatment list | Confirms e06: Auto, all five products on screen including Regaine (minoxidil). |
| verify-women | men | Female on the sex question | Confirms w1: pop-up "This treatment category isn't suitable for the gender you have selected." with Cancel / Choose other treatment. |

## 9. Independent verification

Trustworthy as labelled for what an anonymous man sees. Both baselines and the eight highest-impact rules (female stop, mental-illness stop, smoking and alcohol removing dutasteride, product-link fallback, BMI, low blood pressure, review flags) were re-tested live and held. The one real error was presentational: earlier stages said the review or recommendation message appears on screen, but it only exists in the server response, so a patient cannot tell an automatic offer from a review case. Prices and strengths match the live pages. Remaining gaps are code-based rules marked as code, the age limit and everything behind the account wall.

**Re-checked**

- Baseline man replayed fresh (runs/verify-baseline): mode Offline, five products, Finasteride 1mg x28 £34.95 pre-selected. Matches the record.
- Auto-offer base replayed fresh (runs/verify-auto): mode Auto, same five products and default. Matches.
- Women baseline (runs/verify-women): hard stop pop-up on Female. Confirmed (R1).
- R2 mental illness hard stop (runs/verify-mental): confirmed, inline warning and Continue disabled.
- R17 smoker removes dutasteride and Avodart (runs/verify-smoke): confirmed, and the on-screen Edit list now shows only Finasteride, Regaine and Propecia.
- R18 and R21 (runs/verify-dut-drink): light drinking from the Dutasteride link removes both dutasteride products and the default falls back to Finasteride. Confirmed.
- R10 low blood pressure (runs/verify-bp-low): no effect, all five products on screen including Regaine. Confirmed.
- R14 BMI 40 (runs/verify-bmi40): Offline. Confirmed; also Offline from the Dutasteride link (runs/verify-dut-bmi40).
- R7 under 3 months (runs/verify-under3m) and R11 blood pressure last checked over six months ago (runs/verify-bpcheck-old): both Offline. Upgraded from code to observed.
- R16 medication (runs/verify-medication) and allergy (runs/verify-allergy): both Offline. Upgraded from code to observed for these two entries.
- Product facts re-read on the live pages on 2026-11-24: Finasteride 1mg £34.95/£55.95/£73.95/£130.95; Propecia 1mg £66.95/£114.95/£149.95/£287.95; Dutasteride 0.5mg 30/60/90 capsules £34.95/£63.95/£89.95; Avodart 0.5mg £47.95/£81.95/£113.95 (90 pack flagged Most Popular in the options data); Regaine 5% 3x60ml £99.95 and 3x73ml £104.95 (options data); Finasteride + Minoxidil Drops "Not available" and "currently unlicensed" as a combined formulation; dutasteride page says off-label for hair loss. All match the record.
- Evidence labels: every run folder cited as proof exists; no observed claim without a run was found apart from the on-screen message claims corrected below.

**Corrected**

- The automatic-offer and clinician-review messages ("our clinician has recommended", "We still need to review your consultation") were described as shown on the options screen. They are only in the server response: the visible screen text is identical in both modes (runs/verify-baseline vs runs/verify-auto, and no captured run shows either message). Fixed in 27 option effects, R3, R4, the options question, experiments e00/e01, the recommendations and the engine summary.
- "Choose for me" was labelled flag-for-clinician as observed; only the note box was seen, so it is now extra-questions and what follows is marked unknown.
- R7, R11 and R16 (medication, allergy) upgraded from code to observed with new runs; R16 confidence stays medium for the four entries still untested.
- R14 and the BMI limitation rewritten: stage 2 guessed the default product failing its limits might explain it; runs/verify-dut-bmi40 rules that out.
- Added a missing product page: Regaine in a telogen effluvium category (includes Regaine for Women), marked Not available and outside the consultation.
- Weaknesses reworded where they stated opinion as fact (dutasteride smoking/alcohol rule) or claimed patients pay before review without evidence.

**Still unverified**

- Age limits (18–49 for finasteride, Propecia and Regaine): date of birth is behind the account wall (code only, R26).
- Surgery, disability, family history and recreational drugs in the medical profile (code only).
- Pattern options breakage, back and sides, one side, medicine-induced, "Other"; blood pressure "I don't know"; most single conditions and symptoms other than heart and itchy scalp (code only, same server tag as confirmed options).
- What the clinician does in review cases and after "Choose for me"; anything after the checkout account wall.
- Why BMI over 35 overrides the whole automatic offer.

## 10. Limits of this report

- Nothing after the account wall was seen: date of birth, identity checks, any photo request and the clinician's actual decision in review cases are unknown (photo upload wording exists in the served locale file).
- The 18–49 age limit comes from served data only; age cannot be entered anonymously.
- Surgery, disability, family-history and recreational-drug entries in the medical profile were not replayed (served limits say they send the case to review; medication and allergy were confirmed live in stage 3). Drinking over 14 units, occasional smoking and similar sub-options were not replayed one by one.
- Not replayed one by one (rules read from served code, same tag confirmed live on 8 options): men-q1 breakage, back and sides, one side, medicine-induced, Other; men-q6 I don't know; men-q8 conditions other than heart and mental illness; men-q9 symptoms other than itchy scalp; follow-up text boxes; GP = Yes; "Choose for me".
- Why BMI over 35 sends the whole case to review is unclear: it happens even from the Dutasteride link with Dutasteride pre-selected (runs/verify-dut-bmi40), although the dutasteride products carry no BMI limit (offerBmi false). So it is not "the default product fails its limits"; the rule is server-side and not visible in the served data.
- Prices and availability checked on 23–24 Nov 2026 and may change; the engine is server-side and could change without any change to the page.
- The automatic-offer versus clinician-review decision is read from the options response the page fetched (mode, displayMessage). It is not shown to the patient on screen in any captured run, so its practical effect after checkout (for example how fast an automatic offer is dispatched) is unknown.

## 11. Sources

- [Hair loss category](https://uk.treated.com/hair-loss)
- [Finasteride](https://uk.treated.com/hair-loss/finasteride)
- [Propecia](https://uk.treated.com/hair-loss/propecia)
- [Dutasteride](https://uk.treated.com/hair-loss/dutasteride)
- [Avodart](https://uk.treated.com/hair-loss/avodart)
- [Regaine](https://uk.treated.com/hair-loss/regaine)
- [Finasteride + Minoxidil Drops](https://uk.treated.com/hair-loss/finasteride-minoxidil-drops)
- [Compare hair loss treatments](https://uk.treated.com/hair-loss/compare)
- [Off-label and unlicensed medicines policy](https://uk.treated.com/off-label-prescribing)
- [FAQ (age 18+, subscriptions, clinician review)](https://uk.treated.com/faq)
- [How it works](https://uk.treated.com/how-it-works)
- [Terms and conditions](https://uk.treated.com/terms-and-conditions)
- [Consultation start (hair loss)](https://uk.treated.com/consultation-startup?condition=024&uf=cond)
- [Treated UK telogen effluvium category (Regaine, not available)](https://uk.treated.com/telogen-effluvium)
- [Treated UK page site map](https://uk.treated.com/page-sitemap.xml)
