# Strut Health: consultation and product report

**Market:** US · **Website:** https://www.struthealth.com/ · **Checked:** 2026-11-23 · **Owner:** Partex.AI (the site logo reads "Strut, a Partex.AI Consumer Health Company")

> US cash-pay telehealth company (Dallas, Texas) selling compounded and generic prescription hair-loss medicines by subscription, with an online questionnaire reviewed afterwards by a licensed provider.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** Oral finasteride, topical finasteride and dutasteride forms: the first screen (e-mail + phone). Old checkout (women's formula, Hair Booster, ketoconazole, HairfectRx capsules, combos): the first screen. Oral minoxidil form: after 17 anonymous screens, at "Create account" (75% progress), before address, ID check and payment.
- **Blocker:** The help centre (support.struthealth.com) returned HTTP 403 with a "Just a moment..." security checkpoint to curl and to the fetch tool; it was not read.
- **Blocker:** Three of the four new forms and every old-checkout product ask for an e-mail and phone number on the first screen, so they could not be walked.

The full definition of the four new intake forms (every screen, option and branch condition, including everything behind the account wall, plus the product cards with prices) was read from the HTML the site serves to an anonymous browser; those items are labelled "code". Only the oral minoxidil form could be walked live (baseline man, 25 steps, to the account card); those items are labelled "observed". The questionnaires for the women's Strut Hair Formula, Hair Booster, ketoconazole shampoo, HairfectRx capsules and the combos are served only to signed-in users and were not seen. No one-change experiments were run in this stage.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

Strut does not run a recommendation engine. The patient chooses a product on the marketing site; each product has its own form that sells only that product (the dutasteride form lets you pick topical or oral, the topical finasteride form swaps to a women's product if you answer "Female"). The form is a fixed list of questions with three kinds of branch only: stop screens (under 18; female in the oral finasteride form; thoughts of self-harm), three optional free-text follow-ups, and product-card swaps. No medical answer changes the product, strength or price inside the form. All clinical decisions, including strength and which actives go into a compounded formula, are left to a provider who reviews the answers and photos after the patient has created an account, passed an ID check and saved a card.

## 3. Engine rules (7)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | oral-minoxidil | oral-minoxidil age = "Under 18" | Stop screen "Age Verification": only for patients 18 and older. Go back or end. Same node in all four forms. _(affects: Oral Minoxidil tablets (Retail))_ | Stops the patient | code | high |
| R2 | men-finasteride-oral | sex at birth = "Female" | Stop screen "Available for Male Patients Only". Go back or end. _(affects: Oral Finasteride 1mg (Retail))_ | Stops the patient | code | high |
| R3 | finasteride-topical | sex at birth = "Female" | The women's topical finasteride card replaces the men's card (price IDs 612/598 instead of 311/384); all later questions are the same and none asks about pregnancy. _(affects: Hairfect Rx Topical Finasteride Formula (Compound), men, Topical Finasteride Formula for women (women's finasteride hair loss formula))_ | Switches product | code | high |
| R4 | dutasteride | "Which form of dutasteride are you looking to use?" = "Oral Custom Capsule" | Oral capsule card ($39) instead of the topical card; solution/gel and formula preference questions are skipped. _(affects: Oral Dutasteride capsules (Compound or Retail), Hairfect Rx Topical Dutasteride Formula (Compound))_ | Switches product | code | high |
| R5 | oral-minoxidil | "In the last 2 weeks, have you had any thoughts of hurting yourself?" = "Yes" | "Safety Alert" screen with 988 and 911; the only ways on are to change the answer or end. Same node in all four forms. | Stops the patient | code | high |
| R6 | oral-minoxidil | surgeries = "Yes"; medications = "Yes"; anything else = "Yes" | Each adds one free-text screen. Nothing else changes. | Adds questions | code | high |
| R7 | oral-minoxidil | any other answer (hair-loss pattern, scalp symptoms, sexual dysfunction, allergies including "Minoxidil", medical conditions including heart failure, low blood pressure or pheochromocytoma, mood questions) | No branch, no warning and no change to the cart inside the form. The decision is left to the provider who reviews the answers after checkout. _(affects: Oral Minoxidil tablets (Retail))_ | Flags for the clinician | code | medium |

## 4. Products (15)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Oral Finasteride 1mg (Retail)](https://www.struthealth.com/hair-loss/finasteride/oral) | rx-oral | finasteride 1 mg tablet, once daily | tablet | men | US Rx, FDA-approved generic tablet (on-label for male pattern hair loss) | $25 for a 30-day supply (30 tablets), auto-refill ($49 for a 90-day supply (code: price IDs 48 and 49, slug finasteride-oral-tablets). Visit and shipping included.) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. The form ends the visit for anyone who answers "Female" (code). | code |
| [Hairfect Rx Topical Finasteride Formula (Compound), men](https://www.struthealth.com/hair-loss/finasteride/topical) | rx-topical-compounded | finasteride 0.25%; minoxidil 7.5% (optional; can be left out); tretinoin 0.0125% in the form's preference list; the price label in code says 0.025% (optional); fluocinolone strength not stated by Strut for this formula (0.01% is stated for the dutasteride and women's formulas); biotin not stated | topical gel or solution (patient states a preference), 30 ml once daily or 60 ml twice daily | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $59 for a 30-day supply (30 ml, once daily) ($79 for a 30-day supply of 60 ml (twice daily). Code: price IDs 311 and 384, slug finasteride-hair-loss-formula. Formula preference options in the form: finasteride 0.25% + tretinoin 0.0125% + minoxidil 7.5%; finasterid…) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. In the topical finasteride form, "Male" leads to this card; the patient then states a gel/solution and formula preference for the provider. | code |
| [Topical Finasteride Formula for women (women's finasteride hair loss formula)](https://start.struthealth.com/f/6adb546a5d885b6c0877d8e4) | rx-topical-compounded | finasteride 0.25% (same preference list as the men's form); minoxidil 7.5% (optional); tretinoin 0.0125% (optional) | topical gel or solution, 30 ml once daily or 60 ml twice daily | women | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $59 for a 30-day supply (30 ml, once daily) ($79 for 60 ml (twice daily). Code: price IDs 612 and 598, slug womens-finasteride-hair-loss-formula. No product page of its own was found: it appears only as the "Female" branch of the topical finasteride form.) | Shown when "Female" is chosen at "What sex were you assigned at birth?" in the topical finasteride form (code). Not seen live: the form starts with the account card. | code |
| [Oral Dutasteride capsules (Compound or Retail)](https://www.struthealth.com/hair-loss/dutasteride/oral) | rx-oral-compounded | dutasteride 0.1 mg compounded capsule (with biotin up to 5000 mcg) or 0.5 mg retail capsule; the collection page says 0.1 mg to 0.6 mg; biotin up to 5000 mcg, only in the compounded 0.1 mg capsule | capsule, once daily | men | 0.1 mg capsule: US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription). 0.5 mg capsule: US Rx FDA-approved generic, used off-label for hair loss. | $39 for a 30-day supply (30 capsules) (Same price for the compounded 0.1 mg and the retail 0.5 mg (docs). The form's card lists one option only: "Dutasteride Oral - 0.1mg Capsules" $39 (code: price ID 382, slug dutasteride-custom-formulas). How a patient ask…) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. In the dutasteride form it is shown when the patient answers "Oral Custom Capsule". | code |
| [Hairfect Rx Topical Dutasteride Formula (Compound)](https://www.struthealth.com/hair-loss/dutasteride/topical) | rx-topical-compounded | dutasteride 0.1%; minoxidil 7.5% (optional); tretinoin 0.0125% (optional); fluocinolone 0.01% (optional); biotin not stated | topical gel or solution, 30 ml once daily or 60 ml twice daily | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $69 for a 30-day supply (30 ml, once daily) ($99 for 60 ml (twice daily). Code: price IDs 380 and 383, slug dutasteride-custom-formulas. Formula preference options in the form: dutasteride 0.1% + tretinoin 0.0125% + minoxidil 7.5% + fluocinolone 0.01%; the same wi…) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. In the dutasteride form it is the default path ("Custom Topical Formula"). | code |
| [HairfectRx Capsules with Finasteride (Compound)](https://www.struthealth.com/hair-loss/hairfectrx-finasteride) | rx-oral-compounded | finasteride 1 mg; minoxidil 5 mg (oral); D-biotin, vitamin C, methyltetrahydrofolate, vitamin D3, zinc picolinate, vitamin A not stated | liposomal capsule, once daily | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $69 a month (30 capsules), monthly subscription (Old checkout: hair-compound-oral?priceId=2060.) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. Its questionnaire sits behind the account wall of the old checkout and was not seen. | docs |
| [HairfectRx Capsules with Dutasteride (Compound)](https://www.struthealth.com/hair-loss/hairfectrx-dutasteride) | rx-oral-compounded | dutasteride 0.4 mg; minoxidil 5 mg (oral); D-biotin, vitamin C, methyltetrahydrofolate, vitamin D3, zinc picolinate, vitamin A not stated | liposomal capsule, once daily | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $69 a month (30 capsules), monthly subscription (Old checkout: hair-compound-oral?priceId=2140.) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. Its questionnaire sits behind the account wall of the old checkout and was not seen. | docs |
| [Oral Minoxidil tablets (Retail)](https://www.struthealth.com/hair-loss/oral-minoxidil) | rx-oral | minoxidil 1.25 mg or 2.5 mg daily | tablet, once daily | both | US Rx, FDA-approved generic tablet (approved for high blood pressure; hair loss is off-label) | $55 for a 90-day supply (1.25 mg) ($65 for a 90-day supply (2.5 mg), which is the pre-selected dose in the form (observed). Code: price IDs 798 and 797, slug oral_minoxidil_men. The form does not ask sex before the account card; the slug says "men" and t…) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. Both doses are shown to every adult straight after the age question, before any medical question (observed). | observed |
| [Strut Women's Hair Growth Formula (Compound)](https://www.struthealth.com/hair-loss/strut-hair-formula) | rx-topical-compounded | spironolactone 1%; finasteride 0.25%; minoxidil 0 to 7.5%; tretinoin 0 to 0.025%; fluocinolone 0.01% (optional); biotin not stated | topical solution with dropper, 30 ml a month, applied nightly | women | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $59 a month (one 30 ml bottle), auto-refill (Ingredient combinations are set by the provider ("Spironolactone or Finasteride + Minoxidil + Fluocinolone + Tretinoin + Biotin"). Old checkout: womens-hair-growth-rx-formula?priceId=226.) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. Product page: do not use if pregnant, planning pregnancy or breastfeeding. Its questionnaire sits behind the account wall and was not seen. | docs |
| [Strut Hair Booster (Compound)](https://www.struthealth.com/hair-loss/hair-booster) | rx-topical-compounded | latanoprost 0.03% (regular) or 0.1% (max strength); melatonin not stated; caffeine not stated; biotin not stated | topical, 30 ml, applied once nightly | both | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $49 for a 30-day supply (regular strength, 30 ml) ($99 for max strength 0.1% latanoprost (30 ml). "Your provider will decide which strength is appropriate." Old checkout: latanoprost-hair-booster-formula?priceId=676.) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. Sold as unisex and as an add-on to finasteride, dutasteride or minoxidil. Not for use in pregnancy or breastfeeding unless a provider agrees (docs). | docs |
| [Ketoconazole 2% Shampoo (Retail)](https://www.struthealth.com/hair-loss/ketoconazole-shampoo) | rx-topical-licensed | ketoconazole 2% | shampoo, 120 ml (4 oz) | both | US Rx, FDA-approved product (for dandruff and seborrhoeic dermatitis; hair-loss use is off-label) | From $25 for a 120 ml bottle, auto-refill (Old checkout: ketoconazole_shampoo_men?priceId=799 (the slug says "men"; the page does not name an audience).) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. Its questionnaire sits behind the account wall of the old checkout and was not seen. | docs |
| [Hairfect Combo (Retail): Finasteride Tablets + StrutVite](https://www.struthealth.com/hair-loss/hairfect-combo) | bundle | finasteride 1 mg tablet; StrutVite hair, skin and nail vitamins 2 capsules daily | tablets plus supplement capsules | men | US Rx generic tablet plus a non-prescription food supplement | $33 a month on a 3-month supply (90 tablets + 180 StrutVite capsules) (Old checkout: hairfect-combo?priceId=243.) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. | docs |
| [Hairfect Combo (Compound): Finasteride Gel + StrutVite](https://www.struthealth.com/hair-loss/hairfect-gel-combo) | bundle | topical finasteride formula (finasteride, minoxidil, tretinoin, fluocinolone, biotin) customisable; see p2; StrutVite hair, skin and nail vitamins 2 capsules daily | topical gel or solution plus supplement capsules | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) plus a non-prescription food supplement | $55 a month on a 3-month supply (90 ml topical + 180 StrutVite capsules) (Old checkout: hairfect-gel-combo?priceId=313.) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. | docs |
| [Hairfect Combo (Compound or Retail): Dutasteride (topical or oral) + StrutVite](https://www.struthealth.com/hair-loss/dutasteride-hair-combo) | bundle | dutasteride topical formula or dutasteride capsules see p4 and p5; StrutVite hair, skin and nail vitamins 2 capsules daily | topical or capsules, plus supplement capsules | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) or US Rx generic capsule, plus a non-prescription food supplement | $60 a month on a 90-day supply (90 ml topical + 180 StrutVite capsules) ($40 a month on a 90-day supply (90 dutasteride capsules + 180 StrutVite capsules). Old checkout: dutasteride-hair-combo?priceId=485.) | Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that product. A provider reviews the answers afterwards and can approve, change or decline. | docs |
| [StrutVite hair, skin and nail supplement](https://www.struthealth.com/skin/strutvite) | supplement | vitamins A, C, D, E, B1, B5, B6, B9, B12, biotin; calcium, iron, magnesium, zinc, manganese, potassium; botanicals including horsetail, fo-ti, bamboo, nettle, saw palmetto not stated on the page text captured | capsule, 2 once daily | both | US non-prescription food supplement | $24.99 for 60 capsules (30 doses), auto-refill (Old checkout: otc-strutvite?priceId=710. Listed under Skin, and bundled into the three Hairfect Combos.) | Sold on its own without a prescription, or as part of a Hairfect Combo. | docs |

## 5. Who gets what (1 patient profiles)

- **Man, 31-45, hair loss over 1 year, receding hairline and thinning on top, no scalp symptoms, no treatments, no conditions, no medicines (oral minoxidil form)** → Oral Minoxidil tablets (Retail) (default: Oral Minoxidil tablets (Retail)). Dose picker shows 2.5 mg ($65 for 90 days, pre-selected) and 1.25 mg ($55 for 90 days) before any medical question. The form never shows a recommendation screen; it reaches "Create account" at 75%. _[observed]_

## 6. The consultation, question by question

### Oral finasteride intake form (new PathwAI form)

Entry: https://start.struthealth.com/f/6adb53275c3d5e719ab02595

Account card first (e-mail + phone): nothing is anonymous. Then, from the served definition: date of birth, age, sex, supply picker, 13 questions and one warning screen (up to 3 extra free-text screens), profile, address, Persona ID check, cart, card, order submitted for provider review.

**1. See your treatment options. Join for a tailored experience crafted by experts. [Enter your e-mail] [Enter your phone number] [tick box: I agree to the Consent, Privacy, Terms, and receiving recurring automated marketing texts from Strut Health.] Continue / Already have an account? Sign In. / or (Google)**  
_contact · anonymous · role: identity · shown: always · no branch · observed_  
Why they ask: Account wall: creates the account (e-mail and phone, or Google) before any question is shown.


**2. To verify your eligibility, please enter your date of birth**  
_date · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Date of birth for identity and age (year, month, day pickers). The card saves it to the Strut account; an invalid date shows "Date of Birth is not valid. Please enter a valid Date of Birth."


**3. What is your age?**  
_single · after-account · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Screens out under-18s.  
Downstream: "Under 18" goes to the Age Verification stop screen; every other band continues.

- `Under 18` → **Stops the patient**: Goes to the "Age Verification" stop screen: "These medications are only available for patients 18 and older." The only choices are to go back or end. _[code]_
- `18-30` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `31-45` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `46-60` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `61+` → **Next question**: Continues. No other age band changes the route in the form. _[code]_

**4. Age Verification These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it.**  
_single · after-account · role: eligibility-gate · shown: only after "Under 18" at "What is your age?" · BRANCHES · code_  
Why they ask: Stop screen. These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it.

- `Go back and update my answer` → **Next question**: Returns to the question so the answer can be changed. _[code]_
- `End questionnaire` → **Stops the patient**: Ends the questionnaire and redirects to www.struthealth.co. _[code]_

**5. What sex were you assigned at birth?**  
_single · after-account · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Decides whether the product can be offered and which product card is shown.  
Downstream: See option effects. The block is internally labelled "Which hair loss product are you interested in?" with the sub-label "You can select one or more options" (the separate heading block of the node says "What sex were you assigned at birth?"; which wording shows on screen was not seen because this screen is behind the account wall).

- `Male` → **Next question**: Default path: shows the finasteride tablet supply card. _(affects: Oral Finasteride 1mg (Retail))_ _[code]_
- `Female` → **Stops the patient**: Goes to the stop screen "Available for Male Patients Only": "These medications are only available for male." Choices: go back or end. _(affects: Oral Finasteride 1mg (Retail))_ _[code]_

**6. Available for Male Patients Only These medications are only available for male. If you selected the wrong answer, you can go back and update it.**  
_single · after-account · role: eligibility-gate · shown: only after "Female" at "What sex were you assigned at birth?" · BRANCHES · code_  
Why they ask: Stop screen. These medications are only available for male. If you selected the wrong answer, you can go back and update it.

- `Go back and update my answer` → **Next question**: Returns to the question so the answer can be changed. _[code]_
- `End questionnaire` → **Stops the patient**: Ends the questionnaire and redirects to www.struthealth.co. _[code]_

**7. Finasteride Tablets. For Men. Oral finasteride 1mg for hair loss · dispensed by a US licensed pharmacy. SUPPLY [options] Total today. [Add to cart]**  
_single · after-account · role: product-selector · shown: after "Male" at the sex question (default path) · no branch · code_  
Why they ask: Supply length and price. Shown right after the sex question, before the medical questions.  
Downstream: The choice sets the price ID put in the cart ("Add to cart"). It does not change the questions.

- `30 Day Supply - 1mg ($25 for 30 days)` → **No effect**: Default. Puts price ID 48 in the cart. _(affects: Oral Finasteride 1mg (Retail))_ _[code]_
- `90 Day Supply - 1mg ($49 for 90 days)` → **No effect**: Puts price ID 49 in the cart. _(affects: Oral Finasteride 1mg (Retail))_ _[code]_

**8. How long ago did you first notice signs of hair loss?**  
_single · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: History for the provider: how long the hair loss has been going on.

- `1 month or less` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Less than 6 months` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `6-12 months` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Over 1 year` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Over 2 years` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**9. What symptoms of hair loss have you noticed? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Pattern of hair loss for the provider (pattern loss, patchy, diffuse, shedding).

- `Thinning at the front hairline` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thinning at the temples` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thinning on the top of the head` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Receding hairline` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Patchy bald spots` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Diffuse thinning (all over)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Increased shedding` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**10. Have you noticed any scalp symptoms? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Looks for signs of scalp disease or sudden loss that would point away from pattern hair loss.

- `Itching, pain, burning, or lesions` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dry skin or dandruff` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Rash` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Bleeding` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Sudden hair loss` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**11. What treatments have you tried before? Select all that apply.**  
_multi · after-account · role: personalisation · shown: always · no branch · code_  
Why they ask: Treatment history for the provider.

- `Minoxidil (Rogaine) topical` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Minoxidil oral tablets` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Finasteride (Propecia)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dutasteride (Avodart)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Biotin or biotin-based vitamins` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Ketoconazole shampoo` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Steroid-based scalp injections` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Hair transplant` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `PRP (platelet-rich plasma)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**12. Do you have any issues with sexual dysfunction currently?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Baseline sexual function before a 5-alpha-reductase inhibitor.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**13. Are you allergic to any of the following? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Allergy check against the ingredients Strut uses.

- `Finasteride` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dutasteride` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Minoxidil` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Tretinoin` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Ketoconazole` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Latanoprost or Bimatoprost` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Azelaic Acid` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Caffeine` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Melatonin` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Fluocinolone or Hydrocortisone` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**14. Do you have any of the following medical conditions? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Medical history check (heart, blood pressure, liver, kidney, cancer and so on).

- `Heart failure or heart disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Heart attack or coronary artery disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Stroke` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Low blood pressure` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Pheochromocytoma` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Liver problems` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Kidney disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thyroid disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Breast or prostate cancer` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Prostate enlargement (BPH)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `HIV` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Autoimmune disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Glaucoma or eye conditions` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**15. Have you had any surgeries?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Surgical history for the provider.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen: "Please describe your surgical history". _[code]_
- `No` → **Next question**: Skips the surgical history screen. _[code]_

**16. Please describe your surgical history: (placeholder: "Describe your surgeries...")**  
_text · after-account · role: data-capture · shown: only after "Yes" at "Have you had any surgeries?" · no branch · code_  
Why they ask: Free text for the provider.


**17. Are you currently taking any medications, vitamins, or supplements?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Medicines history for interaction checks.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen: "Please list all current medications, vitamins, and supplements with dosages". _[code]_
- `No` → **Next question**: Skips the medicines list screen. _[code]_

**18. Please list all current medications, vitamins, and supplements with dosages: (placeholder: "List your medications...")**  
_text · after-account · role: data-capture · shown: only after "Yes" at "Are you currently taking any medications, vitamins, or supplements?" · no branch · code_  
Why they ask: Free text for the provider.


**19. Do you have concerns about your mood, depression, anxiety, or excessive worrying?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Mental health screen before finasteride or dutasteride.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**20. In the last 2 weeks, have you lost interest in doing your daily routine?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Depression screen.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**21. In the last 2 weeks, have you had any thoughts of hurting yourself?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Self-harm screen.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Stops the patient**: Goes to the "Safety Alert" screen (988 Suicide and Crisis Lifeline, 911). The only choices are to go back and change the answer or end the questionnaire, so the visit cannot continue with "Yes". _[code]_
- `No` → **Next question**: Goes on to the mental health warning screen. _[code]_

**22. Safety Alert Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire.**  
_single · after-account · role: safety-screen · shown: only after "Yes" at "In the last 2 weeks, have you had any thoughts of hurting yourself?" · BRANCHES · code_  
Why they ask: Stop screen. Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire.

- `Go back and update my answer` → **Next question**: Returns to the question so the answer can be changed. _[code]_
- `End questionnaire` → **Stops the patient**: Ends the questionnaire and redirects to www.struthealth.co. _[code]_

**23. Important Mental Health Warning: Important: Finasteride and dutasteride (5-alpha-reductase inhibitors) may worsen depression or anxiety symptoms. Oral use carries higher risk than topical. If you experience thoughts of self-harm while using this medication, discontinue immediately and call 911. Please read the above carefully before continuing.**  
_info · after-account · role: expectation-setting · shown: always · no branch · code_  
Why they ask: Warns that finasteride and dutasteride may worsen depression or anxiety.


**24. Is there anything else you want your doctor to know about your condition or health?**  
_single · after-account · role: data-capture · shown: always · BRANCHES · code_  
Why they ask: Free-text catch-all.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen (up to 1,000 characters). _[code]_
- `No` → **Next question**: Goes straight on. _[code]_

**25. Please share any additional information for your doctor. (placeholder: "Share any additional health information...")**  
_text · after-account · role: data-capture · shown: only after "Yes" at "Is there anything else you want your doctor to know about your condition or health?" · no branch · code_  
Why they ask: Free text for the provider.


**26. Complete your free account. All fields are required. [First name*] [Last name*] [Gender*] [Email*] [Phone*] [Password*] [Confirm password*] plus agreement to Telemedicine Consent, Privacy Policy, Refund Policy and Terms & Conditions**  
_contact · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Completes the account profile (name, gender, password) after the questions.


**27. What is your address? Start typing to search for your address**  
_contact · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Shipping address (address search).


**28. Verify your identity [Start Identity Verification] (Persona identity check, pre-filled from the account profile)**  
_photo · after-account · role: identity · shown: always · BRANCHES · code_  
Why they ask: Identity check by Persona (government ID). If it fails, the form falls back to a photo ID and selfie upload.  
Downstream: If the card reports route = "selfie" the next screen is the Selfie Input fallback; otherwise the shopping cart.


**29. Identity verification: Verification failed Sorry we could not verify you through Persona. Your doctor will review the information you provided and verify you at that time. Please upload the requested photos and press Next. [Photo ID: Take a picture of your government ID, or upload one you already have.] [Selfie: Open the camera for a live photo, or upload a selfie. You can replace or remove it.]**  
_photo · after-account · role: identity · shown: only when the Persona identity check fails · no branch · code_  
Why they ask: Fallback when the Persona check fails: photo ID and selfie for the provider to verify by hand.


**30. Shopping cart with order summary and promo code field. [Proceed to Checkout]**  
_info · checkout · role: data-capture · shown: always · no branch · code_  
Why they ask: Order summary before payment (a "coupon" URL variable can pre-fill a promo code).


**31. Payment Details [Save Card] (Authorize.net, card is saved, not charged at this step)**  
_contact · checkout · role: data-capture · shown: always · no branch · code_  
Why they ask: Card details. The card is stored ("setup" mode); Strut says you are only charged if the provider approves.


**32. Order is submitted (FinishOrderV2). No question shown unless the card is declined.**  
_info · checkout · role: data-capture · shown: always · BRANCHES · code_  
Why they ask: Places the order for provider review.  
Downstream: status = "declined" sends the patient back to the payment screen; otherwise the order-completed screen.


**33. Order completed. Thank you — we received your order. A doctor from our team will review your order and we will email you once your prescription has been written. You should hear from us within 48 hours.**  
_info · checkout · role: expectation-setting · shown: always · no branch · code_  
Why they ask: Confirmation: a doctor reviews the order and e-mails within 48 hours.


**34. End of questionnaire: the browser is sent to www.struthealth.co**  
_info · after-account · role: eligibility-gate · shown: after choosing "End questionnaire" on a stop screen · no branch · code_  
Why they ask: Exit after a stop screen.


### Topical finasteride (Hairfect Rx) intake form (new PathwAI form)

Entry: https://start.struthealth.com/f/6adb546a5d885b6c0877d8e4

Account card first (e-mail + phone): nothing is anonymous. Then, from the served definition: date of birth, age, sex (men's or women's product card), 13 questions and one warning screen, two hairline photos (required), solution or gel, formula preference, profile, address, Persona ID check, cart, card, order submitted.

**1. See your treatment options. Join for a tailored experience crafted by experts. [Enter your e-mail] [Enter your phone number] [tick box: I agree to the Consent, Privacy, Terms, and receiving recurring automated marketing texts from Strut Health.] Continue / Already have an account? Sign In. / or (Google)**  
_contact · anonymous · role: identity · shown: always · no branch · observed_  
Why they ask: Account wall: creates the account (e-mail and phone, or Google) before any question is shown.


**2. To verify your eligibility, please enter your date of birth**  
_date · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Date of birth for identity and age (year, month, day pickers). The card saves it to the Strut account; an invalid date shows "Date of Birth is not valid. Please enter a valid Date of Birth."


**3. What is your age?**  
_single · after-account · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Screens out under-18s.  
Downstream: "Under 18" goes to the Age Verification stop screen; every other band continues.

- `Under 18` → **Stops the patient**: Goes to the "Age Verification" stop screen: "These medications are only available for patients 18 and older." The only choices are to go back or end. _[code]_
- `18-30` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `31-45` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `46-60` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `61+` → **Next question**: Continues. No other age band changes the route in the form. _[code]_

**4. Age Verification These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it.**  
_single · after-account · role: eligibility-gate · shown: only after "Under 18" at "What is your age?" · BRANCHES · code_  
Why they ask: Stop screen. These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it.

- `Go back and update my answer` → **Next question**: Returns to the question so the answer can be changed. _[code]_
- `End questionnaire` → **Stops the patient**: Ends the questionnaire and redirects to www.struthealth.co. _[code]_

**5. What sex were you assigned at birth?**  
_single · after-account · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Decides whether the product can be offered and which product card is shown.  
Downstream: See option effects. The block is internally labelled "Which hair loss product are you interested in?" with the sub-label "You can select one or more options" (the separate heading block of the node says "What sex were you assigned at birth?"; which wording shows on screen was not seen because this screen is behind the account wall).

- `Male` → **Next question**: Default path: shows the men's topical finasteride card ($59 / $79). _(affects: Hairfect Rx Topical Finasteride Formula (Compound), men)_ _[code]_
- `Female` → **Switches product**: Shows the women's topical finasteride card instead (same prices, different product and price IDs). The questions after it are the same as for men: the form has no pregnancy, breastfeeding or contraception question. _(affects: Topical Finasteride Formula for women (women's finasteride hair loss formula))_ _[code]_

**6. Topical Finasteride. Custom hair loss formula · compounded by a US licensed pharmacy. FORMULA [options] Total today. [Add to cart] (women's card)**  
_single · after-account · role: product-selector · shown: only after "Female" at "What sex were you assigned at birth?" · no branch · code_  
Why they ask: Quantity and price for women. Shown only after "Female".  
Downstream: The choice sets the price ID put in the cart ("Add to cart"). It does not change the questions.

- `30 Day Supply - 30 ml (Once Daily) ($59 for 30 days)` → **No effect**: Default. Puts price ID 612 in the cart (women's product). _(affects: Topical Finasteride Formula for women (women's finasteride hair loss formula))_ _[code]_
- `30 Day Supply - 60 ml (Twice Daily) ($79 for 30 days)` → **No effect**: Puts price ID 598 in the cart. _(affects: Topical Finasteride Formula for women (women's finasteride hair loss formula))_ _[code]_

**7. Topical Finasteride. Custom hair loss formula · compounded by a US licensed pharmacy. FORMULA [options] Total today. [Add to cart]**  
_single · after-account · role: product-selector · shown: after "Male" at the sex question (default path) · no branch · code_  
Why they ask: Quantity and price for men. Shown right after the sex question.  
Downstream: The choice sets the price ID put in the cart ("Add to cart"). It does not change the questions.

- `30 Day Supply - 30 ml (Once Daily) ($59 for 30 days)` → **No effect**: Default. Puts price ID 311 in the cart. _(affects: Hairfect Rx Topical Finasteride Formula (Compound), men)_ _[code]_
- `30 Day Supply - 60 ml (Twice Daily) ($79 for 30 days)` → **No effect**: Puts price ID 384 in the cart (double quantity). _(affects: Hairfect Rx Topical Finasteride Formula (Compound), men)_ _[code]_

**8. How long ago did you first notice signs of hair loss?**  
_single · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: History for the provider: how long the hair loss has been going on.

- `1 month or less` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Less than 6 months` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `6-12 months` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Over 1 year` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Over 2 years` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**9. What symptoms of hair loss have you noticed? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Pattern of hair loss for the provider (pattern loss, patchy, diffuse, shedding).

- `Thinning at the front hairline` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thinning at the temples` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thinning on the top of the head` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Receding hairline` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Patchy bald spots` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Diffuse thinning (all over)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Increased shedding` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**10. Have you noticed any scalp symptoms? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Looks for signs of scalp disease or sudden loss that would point away from pattern hair loss.

- `Itching, pain, burning, or lesions` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dry skin or dandruff` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Rash` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Bleeding` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Sudden hair loss` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**11. What treatments have you tried before? Select all that apply.**  
_multi · after-account · role: personalisation · shown: always · no branch · code_  
Why they ask: Treatment history for the provider.

- `Minoxidil (Rogaine) topical` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Minoxidil oral tablets` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Finasteride (Propecia)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dutasteride (Avodart)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Biotin or biotin-based vitamins` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Ketoconazole shampoo` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Steroid-based scalp injections` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Hair transplant` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `PRP (platelet-rich plasma)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**12. Do you have any issues with sexual dysfunction currently?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Baseline sexual function before a 5-alpha-reductase inhibitor.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**13. Are you allergic to any of the following? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Allergy check against the ingredients Strut uses.

- `Finasteride` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dutasteride` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Minoxidil` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Tretinoin` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Ketoconazole` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Latanoprost or Bimatoprost` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Azelaic Acid` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Caffeine` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Melatonin` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Fluocinolone or Hydrocortisone` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**14. Do you have any of the following medical conditions? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Medical history check (heart, blood pressure, liver, kidney, cancer and so on).

- `Heart failure or heart disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Heart attack or coronary artery disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Stroke` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Low blood pressure` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Pheochromocytoma` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Liver problems` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Kidney disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thyroid disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Breast or prostate cancer` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Prostate enlargement (BPH)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `HIV` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Autoimmune disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Glaucoma or eye conditions` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**15. Have you had any surgeries?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Surgical history for the provider.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen: "Please describe your surgical history". _[code]_
- `No` → **Next question**: Skips the surgical history screen. _[code]_

**16. Please describe your surgical history: (placeholder: "Describe your surgeries...")**  
_text · after-account · role: data-capture · shown: only after "Yes" at "Have you had any surgeries?" · no branch · code_  
Why they ask: Free text for the provider.


**17. Are you currently taking any medications, vitamins, or supplements?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Medicines history for interaction checks.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen: "Please list all current medications, vitamins, and supplements with dosages". _[code]_
- `No` → **Next question**: Skips the medicines list screen. _[code]_

**18. Please list all current medications, vitamins, and supplements with dosages: (placeholder: "List your medications...")**  
_text · after-account · role: data-capture · shown: only after "Yes" at "Are you currently taking any medications, vitamins, or supplements?" · no branch · code_  
Why they ask: Free text for the provider.


**19. Do you have concerns about your mood, depression, anxiety, or excessive worrying?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Mental health screen before finasteride or dutasteride.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**20. In the last 2 weeks, have you lost interest in doing your daily routine?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Depression screen.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**21. In the last 2 weeks, have you had any thoughts of hurting yourself?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Self-harm screen.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Stops the patient**: Goes to the "Safety Alert" screen (988 Suicide and Crisis Lifeline, 911). The only choices are to go back and change the answer or end the questionnaire, so the visit cannot continue with "Yes". _[code]_
- `No` → **Next question**: Goes on to the mental health warning screen. _[code]_

**22. Safety Alert Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire.**  
_single · after-account · role: safety-screen · shown: only after "Yes" at "In the last 2 weeks, have you had any thoughts of hurting yourself?" · BRANCHES · code_  
Why they ask: Stop screen. Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire.

- `Go back and update my answer` → **Next question**: Returns to the question so the answer can be changed. _[code]_
- `End questionnaire` → **Stops the patient**: Ends the questionnaire and redirects to www.struthealth.co. _[code]_

**23. Important Mental Health Warning: Important: Finasteride and dutasteride (5-alpha-reductase inhibitors) may worsen depression or anxiety symptoms. Oral use carries higher risk than topical. If you experience thoughts of self-harm while using this medication, discontinue immediately and call 911. Please read the above carefully before continuing.**  
_info · after-account · role: expectation-setting · shown: always · no branch · code_  
Why they ask: Warns that finasteride and dutasteride may worsen depression or anxiety.


**24. Hair photos for your doctor. [Front of your hairline: "Tilt your head slightly down so your front hairline is visible."] [Back of your hairline: "Use a mirror or helper to show the back of your hairline."] Good lighting, no filters.**  
_photo · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Two scalp photos for the provider. The continue button stays disabled until both photos are added (code: disabled={!allComplete}).


**25. Would you like the solution or gel? (Note under the options: "Both options have a mild peppermint oil scent.")**  
_single · after-account · role: personalisation · shown: always · no branch · code_  
Why they ask: Vehicle preference for the compounded topical.

- `Solution (Preferred Physician's Choice): The solution is thinner and may work best for those with longer hair. It contains a small amount of alcohol in the formula.` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Gel: The gel is thicker and preferred by patients due to less scalp runoff. It does not contain alcohol in the formula.` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**26. Please select a preference if you have one, so your physician can review the selection with your medical history. Please view our website for a full side effect profile and product safety information.**  
_single · after-account · role: product-selector · shown: always · no branch · code_  
Why they ask: Lets the patient ask for a formula (which actives to include). The provider decides.

- `Finasteride 0.25% + Tretinoin 0.0125% + Minoxidil 7.5% Strongest - 3 active ingredients in 1 formula` → **Flags for the clinician**: Recorded as the patient's preferred formula. No branch in the form; the provider makes the final choice. _[code]_
- `Finasteride 0.25% + Minoxidil 7.5% Strong - 2 active ingredients in 1 formula` → **Flags for the clinician**: Recorded as the patient's preferred formula. No branch in the form; the provider makes the final choice. _[code]_
- `Finasteride 0.25% + Tretinoin 0.0125% Medium/Strong - 2 active ingredients in 1 formula` → **Flags for the clinician**: Recorded as the patient's preferred formula. No branch in the form; the provider makes the final choice. _[code]_
- `Finasteride 0.25% Medium - 1 active ingredients in formula` → **Flags for the clinician**: Recorded as the patient's preferred formula. No branch in the form; the provider makes the final choice. _[code]_
- `I do not have a preference. I want my physician to make the full recommendation` → **Flags for the clinician**: Recorded as the patient's preferred formula. No branch in the form; the provider makes the final choice. _[code]_

**27. Is there anything else you want your doctor to know about your condition or health?**  
_single · after-account · role: data-capture · shown: always · BRANCHES · code_  
Why they ask: Free-text catch-all.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen (up to 1,000 characters). _[code]_
- `No` → **Next question**: Goes straight on. _[code]_

**28. Please share any additional information for your doctor. (placeholder: "Share any additional health information...")**  
_text · after-account · role: data-capture · shown: only after "Yes" at "Is there anything else you want your doctor to know about your condition or health?" · no branch · code_  
Why they ask: Free text for the provider.


**29. Complete your free account. All fields are required. [First name*] [Last name*] [Gender*] [Email*] [Phone*] [Password*] [Confirm password*] plus agreement to Telemedicine Consent, Privacy Policy, Refund Policy and Terms & Conditions**  
_contact · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Completes the account profile (name, gender, password) after the questions.


**30. What is your address? Start typing to search for your address**  
_contact · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Shipping address (address search).


**31. Verify your identity [Start Identity Verification] (Persona identity check, pre-filled from the account profile)**  
_photo · after-account · role: identity · shown: always · BRANCHES · code_  
Why they ask: Identity check by Persona (government ID). If it fails, the form falls back to a photo ID and selfie upload.  
Downstream: If the card reports route = "selfie" the next screen is the Selfie Input fallback; otherwise the shopping cart.


**32. Identity verification: Verification failed Sorry we could not verify you through Persona. Your doctor will review the information you provided and verify you at that time. Please upload the requested photos and press Next. [Photo ID: Take a picture of your government ID, or upload one you already have.] [Selfie: Open the camera for a live photo, or upload a selfie. You can replace or remove it.]**  
_photo · after-account · role: identity · shown: only when the Persona identity check fails · no branch · code_  
Why they ask: Fallback when the Persona check fails: photo ID and selfie for the provider to verify by hand.


**33. Shopping cart with order summary and promo code field. [Proceed to Checkout]**  
_info · checkout · role: data-capture · shown: always · no branch · code_  
Why they ask: Order summary before payment (a "coupon" URL variable can pre-fill a promo code).


**34. Payment Details [Save Card] (Authorize.net, card is saved, not charged at this step)**  
_contact · checkout · role: data-capture · shown: always · no branch · code_  
Why they ask: Card details. The card is stored ("setup" mode); Strut says you are only charged if the provider approves.


**35. Order is submitted (FinishOrderV2). No question shown unless the card is declined.**  
_info · checkout · role: data-capture · shown: always · BRANCHES · code_  
Why they ask: Places the order for provider review.  
Downstream: status = "declined" sends the patient back to the payment screen; otherwise the order-completed screen.


**36. Order completed. Thank you — we received your order. A doctor from our team will review your order and we will email you once your prescription has been written. You should hear from us within 48 hours.**  
_info · checkout · role: expectation-setting · shown: always · no branch · code_  
Why they ask: Confirmation: a doctor reviews the order and e-mails within 48 hours.


**37. End of questionnaire: the browser is sent to www.struthealth.co**  
_info · after-account · role: eligibility-gate · shown: after choosing "End questionnaire" on a stop screen · no branch · code_  
Why they ask: Exit after a stop screen.


### Dutasteride intake form, topical or oral (new PathwAI form)

Entry: https://start.struthealth.com/f/6ad9e1d39fba7abfd231a5b3

Account card first (e-mail + phone): nothing is anonymous. Then, from the served definition: date of birth, age, topical-or-oral choice, product card (topical also asks solution or gel and formula preference), 13 questions and one warning screen, two hairline photos (required), profile, address, Persona ID check, cart, card, order submitted. There is no sex question in this form.

**1. See your treatment options. Join for a tailored experience crafted by experts. [Enter your e-mail] [Enter your phone number] [tick box: I agree to the Consent, Privacy, Terms, and receiving recurring automated marketing texts from Strut Health.] Continue / Already have an account? Sign In. / or (Google)**  
_contact · anonymous · role: identity · shown: always · no branch · observed_  
Why they ask: Account wall: creates the account (e-mail and phone, or Google) before any question is shown.


**2. To verify your eligibility, please enter your date of birth**  
_date · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Date of birth for identity and age (year, month, day pickers). The card saves it to the Strut account; an invalid date shows "Date of Birth is not valid. Please enter a valid Date of Birth."


**3. What is your age?**  
_single · after-account · role: eligibility-gate · shown: always · BRANCHES · code_  
Why they ask: Screens out under-18s.  
Downstream: "Under 18" goes to the Age Verification stop screen; every other band continues.

- `Under 18` → **Stops the patient**: Goes to the "Age Verification" stop screen: "These medications are only available for patients 18 and older." The only choices are to go back or end. _[code]_
- `18-30` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `31-45` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `46-60` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `61+` → **Next question**: Continues. No other age band changes the route in the form. _[code]_

**4. Age Verification These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it.**  
_single · after-account · role: eligibility-gate · shown: only after "Under 18" at "What is your age?" · BRANCHES · code_  
Why they ask: Stop screen. These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it.

- `Go back and update my answer` → **Next question**: Returns to the question so the answer can be changed. _[code]_
- `End questionnaire` → **Stops the patient**: Ends the questionnaire and redirects to www.struthealth.co. _[code]_

**5. Which form of dutasteride are you looking to use?**  
_single · after-account · role: product-selector · shown: always · BRANCHES · code_  
Why they ask: Chooses between the topical formula and the oral capsule.

- `Custom Topical Formula` → **Switches product**: Shows the topical dutasteride card (30 ml $69 or 60 ml $99), then "Would you like the solution or gel?" and the formula preference question. _(affects: Hairfect Rx Topical Dutasteride Formula (Compound))_ _[code]_
- `Oral Custom Capsule` → **Switches product**: Shows the oral dutasteride card (0.1 mg capsules, $39) and skips the solution/gel and formula preference questions. _(affects: Oral Dutasteride capsules (Compound or Retail))_ _[code]_

**6. Dutasteride Oral. custom hair loss formula compounded by a US licensed pharmacy. FORMULA [option] Total today. [Add to cart]**  
_single · after-account · role: product-selector · shown: only after "Oral Custom Capsule" at "Which form of dutasteride are you looking to use?" · no branch · code_  
Why they ask: Price for the oral capsule (one option only).  
Downstream: The choice sets the price ID put in the cart ("Add to cart"). It does not change the questions.

- `Dutasteride Oral - 0.1mg Capsules ($39 for 30 days)` → **No effect**: Only option. Puts price ID 382 in the cart. _(affects: Oral Dutasteride capsules (Compound or Retail))_ _[code]_

**7. Dutasteride Topical. Custom topical hair loss formula · compounded by a US licensed pharmacy. SUPPLY [options] Total today. [Add to cart]**  
_single · after-account · role: product-selector · shown: only when "Custom Topical Formula" is chosen at "Which form of dutasteride are you looking to use?" (default path); skipped for "Oral Custom Capsule" · no branch · code_  
Why they ask: Quantity and price for the topical formula.  
Downstream: The choice sets the price ID put in the cart ("Add to cart"). It does not change the questions.

- `30 ml once daily ($69 for 30 days)` → **No effect**: Default. Puts price ID 380 in the cart. _(affects: Hairfect Rx Topical Dutasteride Formula (Compound))_ _[code]_
- `60 ml twice daily ($99 for 30 days)` → **No effect**: Puts price ID 383 in the cart. _(affects: Hairfect Rx Topical Dutasteride Formula (Compound))_ _[code]_

**8. Would you like the solution or gel? (Note under the options: "Both options have a mild peppermint oil scent.")**  
_single · after-account · role: personalisation · shown: only when "Custom Topical Formula" is chosen at "Which form of dutasteride are you looking to use?" (default path); skipped for "Oral Custom Capsule" · no branch · code_  
Why they ask: Vehicle preference for the compounded topical.

- `Solution (Preferred Physician's Choice): The solution is thinner and may work best for those with longer hair. It contains a small amount of alcohol in the formula.` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Gel: The gel is thicker and preferred by patients due to less scalp runoff. It does not contain alcohol in the formula.` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**9. Please select a preference if you have one, so your physician can review the selection with your medical history. Please view our website for a full side effect profile and product safety information.**  
_single · after-account · role: product-selector · shown: only when "Custom Topical Formula" is chosen at "Which form of dutasteride are you looking to use?" (default path); skipped for "Oral Custom Capsule" · no branch · code_  
Why they ask: Lets the patient ask for a formula (which actives to include). The provider decides.

- `Dutasteride 0.1% + Tretinoin 0.0125% + Minoxidil 7.5% + Fluocinolone 0.01%` → **Flags for the clinician**: Recorded as the patient's preferred formula. No branch in the form; the provider makes the final choice. _[code]_
- `Dutasteride 0.1% + Tretinoin 0.0125% + Minoxidil 7.5%` → **Flags for the clinician**: Recorded as the patient's preferred formula. No branch in the form; the provider makes the final choice. _[code]_
- `Dutasteride 0.1% + Minoxidil 7.5%` → **Flags for the clinician**: Recorded as the patient's preferred formula. No branch in the form; the provider makes the final choice. _[code]_
- `Dutasteride 0.1%` → **Flags for the clinician**: Recorded as the patient's preferred formula. No branch in the form; the provider makes the final choice. _[code]_
- `I do not have a preference. I want my physician to make the full recommendation` → **Flags for the clinician**: Recorded as the patient's preferred formula. No branch in the form; the provider makes the final choice. _[code]_

**10. How long ago did you first notice signs of hair loss?**  
_single · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: History for the provider: how long the hair loss has been going on.

- `1 month or less` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Less than 6 months` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `6-12 months` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Over 1 year` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Over 2 years` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**11. What symptoms of hair loss have you noticed? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Pattern of hair loss for the provider (pattern loss, patchy, diffuse, shedding).

- `Thinning at the front hairline` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thinning at the temples` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thinning on the top of the head` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Receding hairline` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Patchy bald spots` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Diffuse thinning (all over)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Increased shedding` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**12. Have you noticed any scalp symptoms? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Looks for signs of scalp disease or sudden loss that would point away from pattern hair loss.

- `Itching, pain, burning, or lesions` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dry skin or dandruff` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Rash` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Bleeding` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Sudden hair loss` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**13. What treatments have you tried before? Select all that apply.**  
_multi · after-account · role: personalisation · shown: always · no branch · code_  
Why they ask: Treatment history for the provider.

- `Minoxidil (Rogaine) topical` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Minoxidil oral tablets` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Finasteride (Propecia)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dutasteride (Avodart)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Biotin or biotin-based vitamins` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Ketoconazole shampoo` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Steroid-based scalp injections` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Hair transplant` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `PRP (platelet-rich plasma)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**14. Do you have any issues with sexual dysfunction currently?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Baseline sexual function before a 5-alpha-reductase inhibitor.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**15. Are you allergic to any of the following? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Allergy check against the ingredients Strut uses.

- `Finasteride` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dutasteride` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Minoxidil` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Tretinoin` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Ketoconazole` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Latanoprost or Bimatoprost` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Azelaic Acid` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Caffeine` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Melatonin` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Fluocinolone or Hydrocortisone` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**16. Do you have any of the following medical conditions? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Medical history check (heart, blood pressure, liver, kidney, cancer and so on).

- `Heart failure or heart disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Heart attack or coronary artery disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Stroke` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Low blood pressure` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Pheochromocytoma` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Liver problems` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Kidney disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thyroid disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Breast or prostate cancer` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Prostate enlargement (BPH)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `HIV` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Autoimmune disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Glaucoma or eye conditions` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**17. Have you had any surgeries?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Surgical history for the provider.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen: "Please describe your surgical history". _[code]_
- `No` → **Next question**: Skips the surgical history screen. _[code]_

**18. Please describe your surgical history (placeholder: "Describe your surgeries...")**  
_text · after-account · role: data-capture · shown: only after "Yes" at "Have you had any surgeries?" · no branch · code_  
Why they ask: Free text for the provider.


**19. Are you currently taking any medications, vitamins, or supplements?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Medicines history for interaction checks.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen: "Please list all current medications, vitamins, and supplements with dosages". _[code]_
- `No` → **Next question**: Skips the medicines list screen. _[code]_

**20. Please list all current medications, vitamins, and supplements with dosages (placeholder: "List your medications...")**  
_text · after-account · role: data-capture · shown: only after "Yes" at "Are you currently taking any medications, vitamins, or supplements?" · no branch · code_  
Why they ask: Free text for the provider.


**21. Do you have concerns about your mood, depression, anxiety, or excessive worrying?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Mental health screen before finasteride or dutasteride.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**22. In the last 2 weeks, have you lost interest in doing your daily routine?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Depression screen.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**23. In the last 2 weeks, have you had any thoughts of hurting yourself?**  
_single · after-account · role: safety-screen · shown: always · BRANCHES · code_  
Why they ask: Self-harm screen.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Stops the patient**: Goes to the "Safety Alert" screen (988 Suicide and Crisis Lifeline, 911). The only choices are to go back and change the answer or end the questionnaire, so the visit cannot continue with "Yes". _[code]_
- `No` → **Next question**: Goes on to the mental health warning screen. _[code]_

**24. Safety Alert Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire.**  
_single · after-account · role: safety-screen · shown: only after "Yes" at "In the last 2 weeks, have you had any thoughts of hurting yourself?" · BRANCHES · code_  
Why they ask: Stop screen. Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire.

- `Go back and update my answer` → **Next question**: Returns to the question so the answer can be changed. _[code]_
- `End questionnaire` → **Stops the patient**: Ends the questionnaire and redirects to www.struthealth.co. _[code]_

**25. Important Mental Health Warning: Important: Finasteride and dutasteride (5-alpha-reductase inhibitors) may worsen depression or anxiety symptoms. Oral use carries higher risk than topical. If you experience thoughts of self-harm while using this medication, discontinue immediately and call 911. Please read the above carefully before continuing.**  
_info · after-account · role: expectation-setting · shown: always · no branch · code_  
Why they ask: Warns that finasteride and dutasteride may worsen depression or anxiety.


**26. Hair photos for your doctor. [Front of your hairline: "Tilt your head slightly down so your front hairline is visible."] [Back of your hairline: "Use a mirror or helper to show the back of your hairline."] Good lighting, no filters.**  
_photo · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Two scalp photos for the provider. The continue button stays disabled until both photos are added (code: disabled={!allComplete}).


**27. Is there anything else you want your doctor to know about your condition or health?**  
_single · after-account · role: data-capture · shown: always · BRANCHES · code_  
Why they ask: Free-text catch-all.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen (up to 1,000 characters). _[code]_
- `No` → **Next question**: Goes straight on. _[code]_

**28. Please share any additional information for your doctor (placeholder: "Share additional information...")**  
_text · after-account · role: data-capture · shown: only after "Yes" at "Is there anything else you want your doctor to know about your condition or health?" · no branch · code_  
Why they ask: Free text for the provider.


**29. Complete your free account. All fields are required. [First name*] [Last name*] [Gender*] [Email*] [Phone*] [Password*] [Confirm password*] plus agreement to Telemedicine Consent, Privacy Policy, Refund Policy and Terms & Conditions**  
_contact · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Completes the account profile (name, gender, password) after the questions.


**30. What is your address? Start typing to search for your address**  
_contact · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Shipping address (address search).


**31. Verify your identity We need to confirm your identity before continuing [Start Identity Verification] (Persona identity check, pre-filled from the account profile)**  
_photo · after-account · role: identity · shown: always · BRANCHES · code_  
Why they ask: Identity check by Persona (government ID). If it fails, the form falls back to a photo ID and selfie upload.  
Downstream: If the card reports route = "selfie" the next screen is the Selfie Input fallback; otherwise the shopping cart.


**32. Identity verification: Verification failed Sorry we could not verify you through Persona. Your doctor will review the information you provided and verify you at that time. Please upload the requested photos and press Next. [Photo ID: Take a picture of your government ID, or upload one you already have.] [Selfie: Open the camera for a live photo, or upload a selfie. You can replace or remove it.]**  
_photo · after-account · role: identity · shown: only when the Persona identity check fails · no branch · code_  
Why they ask: Fallback when the Persona check fails: photo ID and selfie for the provider to verify by hand.


**33. Shopping cart with order summary and promo code field. [Proceed to Checkout]**  
_info · checkout · role: data-capture · shown: always · no branch · code_  
Why they ask: Order summary before payment (a "coupon" URL variable can pre-fill a promo code).


**34. Payment Details Your payment information is securely processed. [Save Card] (Authorize.net, card is saved, not charged at this step)**  
_contact · checkout · role: data-capture · shown: always · no branch · code_  
Why they ask: Card details. The card is stored ("setup" mode); Strut says you are only charged if the provider approves.


**35. Order is submitted (FinishOrderV2). No question shown unless the card is declined.**  
_info · checkout · role: data-capture · shown: always · BRANCHES · code_  
Why they ask: Places the order for provider review.  
Downstream: status = "declined" sends the patient back to the payment screen; otherwise the order-completed screen.


**36. Order completed. Thank you — we received your order. A doctor from our team will review your order and we will email you once your prescription has been written. You should hear from us within 48 hours.**  
_info · checkout · role: expectation-setting · shown: always · no branch · code_  
Why they ask: Confirmation: a doctor reviews the order and e-mails within 48 hours.


**37. End of questionnaire: the browser is sent to www.struthealth.co**  
_info · after-account · role: eligibility-gate · shown: after choosing "End questionnaire" on a stop screen · no branch · code_  
Why they ask: Exit after a stop screen.


### Oral minoxidil intake form (new PathwAI form)

Entry: https://start.struthealth.com/f/6aa3d578f415d1603a6e0c85

Welcome screen, age, dose picker ("Add to cart"), then 13 questions and one warning screen (up to 3 extra free-text screens), all anonymous; then the account wall ("Create account") at 75%; then address, Persona ID check, cart, card, order submitted. No sex question, no blood pressure or heart rate question, no photos.

**1. Ready to start your Strut Hair Loss journey. Medical questionnaire. This secure form collects important health information to help our licensed medical providers evaluate your eligibility and make informed decisions about your care. HOW IT WORKS 1 Answer the questionnaire honestly and as completely as possible. 2 A licensed medical provider will review your responses within 1 business day. 3 If any additional information is needed, our team will reach out via email or SMS. [Continue]**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Welcome screen: sets expectations (provider review within 1 business day).


**2. What is your age?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Screens out under-18s.  
Downstream: "Under 18" goes to the Age Verification stop screen; every other band continues.

- `Under 18` → **Stops the patient**: Goes to the "Age Verification" stop screen: "These medications are only available for patients 18 and older." The only choices are to go back or end. _[code]_
- `18-30` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `31-45` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `46-60` → **Next question**: Continues. No other age band changes the route in the form. _[code]_
- `61+` → **Next question**: Continues. No other age band changes the route in the form. _[code]_

**3. Age Verification These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it.**  
_single · anonymous · role: eligibility-gate · shown: only after "Under 18" at "What is your age?" · BRANCHES · code_  
Why they ask: Stop screen. These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it.

- `Go back and update my answer` → **Next question**: Returns to the question so the answer can be changed. _[code]_
- `End questionnaire` → **Stops the patient**: Ends the questionnaire and redirects to www.struthealth.co. _[code]_

**4. Minoxidil Tablets. Oral minoxidil for hair loss · compounded by a US licensed pharmacy. DOSE [options] TOTAL TODAY. [Add to cart]**  
_single · anonymous · role: product-selector · shown: always · no branch · observed_  
Why they ask: Dose and price. Shown straight after the age question, before any medical question.  
Downstream: The choice sets the price ID put in the cart ("Add to cart"). It does not change the questions.

- `2.5 mg, 90 Day Supply, $65 for 90 days` → **No effect**: Pre-selected. Puts price ID 797 in the cart. The questions that follow do not change. _(affects: Oral Minoxidil tablets (Retail))_ _[observed]_
- `1.25 mg, 90 Day Supply, $55 for 90 days` → **No effect**: Puts price ID 798 in the cart. Whether the questions change was not replayed, but the definition has no branch on this card. _(affects: Oral Minoxidil tablets (Retail))_ _[code]_

**5. How long ago did you first notice signs of hair loss?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: History for the provider: how long the hair loss has been going on.

- `1 month or less` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Less than 6 months` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `6-12 months` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Over 1 year` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Over 2 years` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**6. What symptoms of hair loss have you noticed? Select all that apply.**  
_multi · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Pattern of hair loss for the provider (pattern loss, patchy, diffuse, shedding).

- `Thinning at the front hairline` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thinning at the temples` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thinning on the top of the head` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Receding hairline` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Patchy bald spots` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Diffuse thinning (all over)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Increased shedding` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**7. Have you noticed any scalp symptoms? Select all that apply.**  
_multi · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Looks for signs of scalp disease or sudden loss that would point away from pattern hair loss.

- `Itching, pain, burning, or lesions` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dry skin or dandruff` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Rash` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Bleeding` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Sudden hair loss` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**8. What treatments have you tried before? Select all that apply.**  
_multi · anonymous · role: personalisation · shown: always · no branch · observed_  
Why they ask: Treatment history for the provider.

- `Minoxidil (Rogaine) topical` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Minoxidil oral tablets` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Finasteride (Propecia)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dutasteride (Avodart)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Biotin or biotin-based vitamins` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Ketoconazole shampoo` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Steroid-based scalp injections` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Hair transplant` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `PRP (platelet-rich plasma)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**9. Do you have any issues with sexual dysfunction currently?**  
_single · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Baseline sexual function before a 5-alpha-reductase inhibitor.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**10. Are you allergic to any of the following? Select all that apply.**  
_multi · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Allergy check against the ingredients Strut uses.

- `Finasteride` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dutasteride` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Minoxidil` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Tretinoin` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Ketoconazole` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Latanoprost or Bimatoprost` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Azelaic Acid` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Caffeine` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Melatonin` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Fluocinolone or Hydrocortisone` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**11. Do you have any of the following medical conditions? Select all that apply.**  
_multi · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Medical history check (heart, blood pressure, liver, kidney, cancer and so on).

- `Heart failure or heart disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Heart attack or coronary artery disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Stroke` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Low blood pressure` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Pheochromocytoma` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Liver problems` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Kidney disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thyroid disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Breast or prostate cancer` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Prostate enlargement (BPH)` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `HIV` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Autoimmune disease` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Glaucoma or eye conditions` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **Next question**: Opens a free-text box. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **Next question**: Clears the other ticks. No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**12. Have you had any surgeries?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Surgical history for the provider.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen: "Please describe your surgical history". _[code]_
- `No` → **Next question**: Skips the surgical history screen. _[code]_

**13. Please describe your surgical history: (placeholder: "Describe your surgeries...")**  
_text · anonymous · role: data-capture · shown: only after "Yes" at "Have you had any surgeries?" · no branch · code_  
Why they ask: Free text for the provider.


**14. Are you currently taking any medications, vitamins, or supplements?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Medicines history for interaction checks.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen: "Please list all current medications, vitamins, and supplements with dosages". _[code]_
- `No` → **Next question**: Skips the medicines list screen. _[code]_

**15. Please list all current medications, vitamins, and supplements with dosages: (placeholder: "List your medications...")**  
_text · anonymous · role: data-capture · shown: only after "Yes" at "Are you currently taking any medications, vitamins, or supplements?" · no branch · code_  
Why they ask: Free text for the provider.


**16. Do you have concerns about your mood, depression, anxiety, or excessive worrying?**  
_single · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Mental health screen before finasteride or dutasteride.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**17. In the last 2 weeks, have you lost interest in doing your daily routine?**  
_single · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Depression screen.

- `Yes` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `No` → **Next question**: No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**18. In the last 2 weeks, have you had any thoughts of hurting yourself?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Self-harm screen.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Stops the patient**: Goes to the "Safety Alert" screen (988 Suicide and Crisis Lifeline, 911). The only choices are to go back and change the answer or end the questionnaire, so the visit cannot continue with "Yes". _[code]_
- `No` → **Next question**: Goes on to the mental health warning screen. _[code]_

**19. Safety Alert Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire.**  
_single · anonymous · role: safety-screen · shown: only after "Yes" at "In the last 2 weeks, have you had any thoughts of hurting yourself?" · BRANCHES · code_  
Why they ask: Stop screen. Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire.

- `Go back and update my answer` → **Next question**: Returns to the question so the answer can be changed. _[code]_
- `End questionnaire` → **Stops the patient**: Ends the questionnaire and redirects to www.struthealth.co. _[code]_

**20. Important Mental Health Warning: Important: Finasteride and dutasteride (5-alpha-reductase inhibitors) may worsen depression or anxiety symptoms. Oral use carries higher risk than topical. If you experience thoughts of self-harm while using this medication, discontinue immediately and call 911. Please read the above carefully before continuing.**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Warns that finasteride and dutasteride may worsen depression or anxiety.


**21. Is there anything else you want your doctor to know about your condition or health?**  
_single · anonymous · role: data-capture · shown: always · BRANCHES · observed_  
Why they ask: Free-text catch-all.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen (up to 1,000 characters). _[code]_
- `No` → **Next question**: Goes straight on. _[code]_

**22. Please share any additional information for your doctor. (placeholder: "Share any additional health information...")**  
_text · anonymous · role: data-capture · shown: only after "Yes" at "Is there anything else you want your doctor to know about your condition or health?" · no branch · code_  
Why they ask: Free text for the provider.


**23. Create account. A few details and you are ready to continue. [Sign up \| Sign in] [FIRST NAME] [LAST NAME] [DATE OF BIRTH] [PHONE NUMBER] [EMAIL] [PASSWORD] Create account / Already have an account? Sign in**  
_contact · anonymous · role: identity · shown: always · no branch · observed_  
Why they ask: Account wall: the anonymous walk stops here (75% on the progress bar).


**24. What is your address?**  
_contact · after-account · role: identity · shown: always · no branch · code_  
Why they ask: Shipping address (address search).


**25. Verify your identity [Start Identity Verification] (Persona identity check, pre-filled from the account profile)**  
_photo · after-account · role: identity · shown: always · BRANCHES · code_  
Why they ask: Identity check by Persona (government ID). If it fails, the form falls back to a photo ID and selfie upload.  
Downstream: If the card reports route = "selfie" the next screen is the Selfie Input fallback; otherwise the shopping cart.


**26. Shopping cart with order summary and promo code field. [Proceed to Checkout]**  
_info · checkout · role: data-capture · shown: always · no branch · code_  
Why they ask: Order summary before payment (a "coupon" URL variable can pre-fill a promo code).


**27. Payment Details [Save Card] (Authorize.net, card is saved, not charged at this step)**  
_contact · checkout · role: data-capture · shown: always · no branch · code_  
Why they ask: Card details. The card is stored ("setup" mode); Strut says you are only charged if the provider approves.


**28. Order is submitted (FinishOrderV2). No question shown unless the card is declined.**  
_info · checkout · role: data-capture · shown: always · BRANCHES · code_  
Why they ask: Places the order for provider review.  
Downstream: status = "declined" sends the patient back to the payment screen; otherwise the order-completed screen.


**29. Order completed. Thank you — we received your order. A doctor from our team will review your order and we will email you once your prescription has been written. You should hear from us within 48 hours.**  
_info · checkout · role: expectation-setting · shown: always · no branch · code_  
Why they ask: Confirmation: a doctor reviews the order and e-mails within 48 hours.


**30. End of questionnaire: the browser is sent to www.struthealth.co**  
_info · anonymous · role: eligibility-gate · shown: after choosing "End questionnaire" on a stop screen · no branch · code_  
Why they ask: Exit after a stop screen.


### Old checkout app (women's Strut Hair Formula, Hair Booster, ketoconazole shampoo, HairfectRx capsules, the three Hairfect Combos, StrutVite)

Entry: https://checkout.struthealth.com/womens-hair-growth-rx-formula?priceId=226

Every old-checkout link redirects at once to /auth/sign-up (e-mail + phone). The medical questions are loaded from the Strut API only for a signed-in visit, so none are visible. Other entry links: hair-compound-oral?priceId=2060 and 2140, latanoprost-hair-booster-formula?priceId=676, ketoconazole_shampoo_men?priceId=799, hairfect-combo?priceId=243, hairfect-gel-combo?priceId=313, dutasteride-hair-combo?priceId=485, otc-strutvite?priceId=710.

**1. See your treatment options. Join for a tailored experience crafted by experts. [Enter your e-mail] [Enter your phone number] [tick box: By creating an account using e-mail, Google, I agree to the Telemedicine Consent, Privacy Policy, Refund Policy and Terms & Conditions] Continue / Already have an account? Sign In. / or (Google)**  
_contact · anonymous · role: identity · shown: always · no branch · observed_  
Why they ask: Account wall on the first screen. Nothing else is shown to an anonymous visitor.


## 7. Competitive read

**Strengths**

- Very wide compounded range: topical finasteride or dutasteride with minoxidil 7.5%, tretinoin and fluocinolone; oral combination capsules; a latanoprost booster; a women's spironolactone and finasteride topical.
- The patient can state a formula preference (which actives to include) and gel or solution.
- Low entry price ($25 a month oral finasteride; $49 for 90 days) with visit and shipping included; card is saved, not charged, until a provider approves.
- Identity check (Persona) and hairline photos are built into the topical flows.

**Weaknesses**

- The account wall is the first screen for most products, so a visitor sees no questions and no personalised offer before giving an e-mail and phone number.
- The forms do almost no automatic screening: heart disease, low blood pressure or a minoxidil allergy do not change or stop the oral minoxidil form.
- The oral minoxidil form reuses the finasteride/dutasteride mental health warning and asks nothing about blood pressure, heart rate, pregnancy or sex.
- The women's branch of the topical finasteride form has no pregnancy, breastfeeding or contraception question in the served definition.
- Product facts are inconsistent across pages (tretinoin 0.0125% or 0.025%; oral minoxidil headline dose and price; dutasteride "0.1 mg to 0.6 mg" against a single 0.1 mg option in the form).

**Gaps a new competitor could use**

- Show a real recommendation before asking for contact details: Strut makes the patient choose the product first and never explains why one fits.
- Automated safety screening with clear stop or warning screens (heart and blood pressure for oral minoxidil; pregnancy for women) would be a visible safety advantage.
- A single guided consultation for women: Strut splits women across an old checkout product and a hidden branch of the men's topical form.

## 10. Limits of this report

- Only one of the forms (oral minoxidil) could be walked. Everything behind an account wall is from the served definition, which shows what the form does but not how it looks live or whether the server adds checks.
- What the reviewing provider does with any answer (declines, changes strength, removes an active) is not visible anywhere public.
- The questionnaires of the old-checkout products, including the main women's product, were not seen at all.
- No one-change experiments were run in this stage; branch effects in the oral minoxidil form are from code and still need a live replay.
- State availability by product is not published beyond "all states except Arkansas" and "certain medications may not be available in all states".
- The help centre could not be read.

## 11. Sources

- [Hair loss collection (13 product cards)](https://www.struthealth.com/hair-loss)
- [Oral finasteride](https://www.struthealth.com/hair-loss/finasteride/oral)
- [Topical finasteride (Hairfect Rx)](https://www.struthealth.com/hair-loss/finasteride/topical)
- [Finasteride overview](https://www.struthealth.com/hair-loss/finasteride)
- [Dutasteride overview](https://www.struthealth.com/hair-loss/dutasteride)
- [Oral dutasteride](https://www.struthealth.com/hair-loss/dutasteride/oral)
- [Topical dutasteride](https://www.struthealth.com/hair-loss/dutasteride/topical)
- [HairfectRx capsules with finasteride](https://www.struthealth.com/hair-loss/hairfectrx-finasteride)
- [HairfectRx capsules with dutasteride](https://www.struthealth.com/hair-loss/hairfectrx-dutasteride)
- [Oral minoxidil](https://www.struthealth.com/hair-loss/oral-minoxidil)
- [Strut Women's Hair Growth Formula](https://www.struthealth.com/hair-loss/strut-hair-formula)
- [Strut Hair Booster](https://www.struthealth.com/hair-loss/hair-booster)
- [Ketoconazole 2% shampoo](https://www.struthealth.com/hair-loss/ketoconazole-shampoo)
- [Hairfect Combo (finasteride tablets + StrutVite)](https://www.struthealth.com/hair-loss/hairfect-combo)
- [Hairfect Combo (finasteride gel + StrutVite)](https://www.struthealth.com/hair-loss/hairfect-gel-combo)
- [Hairfect Combo (dutasteride + StrutVite)](https://www.struthealth.com/hair-loss/dutasteride-hair-combo)
- [StrutVite](https://www.struthealth.com/skin/strutvite)
- [FAQ (shipping, visits, subscriptions)](https://www.struthealth.com/faq)
- [How it works](https://www.struthealth.com/how-it-works)
- [Refund policy](https://www.struthealth.com/refund-policy)
- [Terms and conditions](https://www.struthealth.com/terms-and-conditions)
- [Telemedicine consent](https://www.struthealth.com/telemedicine-consent)
- [Intake form: oral finasteride (definition in page HTML)](https://start.struthealth.com/f/6adb53275c3d5e719ab02595)
- [Intake form: topical finasteride](https://start.struthealth.com/f/6adb546a5d885b6c0877d8e4)
- [Intake form: dutasteride](https://start.struthealth.com/f/6ad9e1d39fba7abfd231a5b3)
- [Intake form: oral minoxidil](https://start.struthealth.com/f/6aa3d578f415d1603a6e0c85)
- [Old checkout (redirects to sign-up)](https://checkout.struthealth.com/womens-hair-growth-rx-formula?priceId=226)
- [Help centre (blocked by a security checkpoint, not read)](https://support.struthealth.com/hc/en-us)
- [Third-party review used only as a cross-check of topical strengths (not relied on)](https://perfecthairhealth.com/strut-health-review/)
