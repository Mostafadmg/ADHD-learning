# Strut Health: consultation and product report

**Market:** US · **Website:** https://www.struthealth.com/ · **Checked:** 2026-11-23 · **Owner:** Partex.AI (the site logo reads "Strut, a Partex.AI Consumer Health Company")

> US cash-pay telehealth company (Dallas, Texas) selling compounded and generic prescription hair-loss medicines by subscription, with an online questionnaire reviewed afterwards by a licensed provider.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** Oral finasteride, topical finasteride and dutasteride forms: the first screen (e-mail + phone). Old checkout (women's formula, Hair Booster, ketoconazole, HairfectRx capsules, combos): the first screen. Oral minoxidil form: after 17 anonymous screens, at "Create account" (75% progress), before address, ID check and payment.
- **Blocker:** The help centre (support.struthealth.com) returned HTTP 403 with a "Just a moment..." security checkpoint to curl and to the fetch tool; it was not read.
- **Blocker:** Three of the four new forms and every old-checkout product ask for an e-mail and phone number on the first screen, so they could not be walked or tested.
- **Blocker:** Web search was unavailable for most of stage 2. One late search (23 Nov 2026) found Trustpilot and Reviews.io reviews, a press release and affiliate-style guides, but nothing that describes the hidden questionnaires or when a provider declines.

Stage 1 read the full definition of the four new intake forms (every screen, option and branch condition, including everything behind the account wall, and the product cards with prices) from the HTML served to an anonymous browser: those items are labelled "code". Stage 2 replayed the one walkable form, oral minoxidil, 27 times (1 baseline, 25 one-change runs, 1 combined worst-case run), and re-loaded the four walled baselines to confirm the walls: those items are labelled "observed" and name their run folder. Six rules read from code were confirmed live exactly as coded (under-18 stop, self-harm stop, three free-text follow-ups, dose picker price), and so was the code reading that the other screens have no branch (16 single options replayed). About 30 options of that form were not replayed on their own because the definition shows no branch on them; they keep the label "code". The oral finasteride, topical finasteride and dutasteride forms cannot be tested without an account. The questionnaires for the women's Strut Hair Formula, Hair Booster, ketoconazole shampoo, HairfectRx capsules and the combos are served only to signed-in users and were not seen; a few entries quote what Strut's public pages say the provider needs ("docs"). Stage 3 (independent verification, 23 Nov 2026) replayed the baseline fresh (identical), re-loaded the four walls (unchanged), re-tested 8 rules live (all confirmed), ran 6 gap tests (no effect, including a baseline woman on the oral minoxidil form), re-fetched the four live form definitions (same version IDs as the saved files) and re-read 15 product pages.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen), **owner-run** (seen in the owner's own browser research, not replayed by us).

## 2. How the engine decides (short version)

Strut has no recommendation engine. The patient chooses a product on the marketing site, and each product has its own form that sells only that product. The form is an order form with a medical questionnaire attached: in the one form that can be walked without an account (oral minoxidil) the dose and price are chosen on the second screen, before any medical question. Live testing found only three kinds of reaction: "Under 18" stops the form, "Yes" to thoughts of self-harm shows a crisis screen that cannot be passed, and "Yes" to surgeries, medicines or "anything else" adds one free-text box each. Nothing else does anything. Heart failure, heart attack, low blood pressure, pheochromocytoma, kidney disease, an allergy to minoxidil, earlier oral minoxidil, patchy, diffuse or sudden hair loss, a sore scalp, low mood, sexual dysfunction and age 61+ were each tried on their own, then together: same screens, same wording, same $65 cart, no warning. The served code shows the same design in the three forms behind the account wall, with two extra switches: "Female" is stopped in the oral finasteride form and swapped to a women's product in the topical finasteride form, and the dutasteride form lets the patient pick topical or oral. There is no scoring. Every clinical decision (approve, decline, strength, which actives go into a compounded formula) is made by a provider after the patient has created an account, passed an ID check and saved a card; Strut says patients who are "not a good candidate" are not charged.

## 3. Engine rules (26)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | oral-minoxidil | age = "Under 18" | Stop screen "Age Verification" (18 and older only). No product is shown. The same node sits in all four forms. _(affects: Oral Minoxidil tablets (Retail), Oral Finasteride 1mg (Retail), Hairfect Rx Topical Finasteride Formula (Compound), men, Topical Finasteride Formula for women (women's finasteride hair loss formula), Oral Dutasteride capsules (Compound or Retail), Hairfect Rx Topical Dutasteride Formula (Compound))_ | Stops the patient | observed | high |
| R2 | oral-minoxidil | age = 18-30, 31-45, 46-60 or 61+ | Continues with identical screens and cart. No upper age limit, no extra question for older patients. _(affects: Oral Minoxidil tablets (Retail))_ | No effect | observed | high |
| R3 | oral-minoxidil | dose picker = "1.25 mg" instead of the pre-selected "2.5 mg" | Price changes from $65 to $55 for 90 days and the cart line reads "2.5 mg (1.25mg)". No question changes. The patient picks the dose before any medical question. _(affects: Oral Minoxidil tablets (Retail))_ | Changes strength | observed | high |
| R4 | oral-minoxidil | "In the last 2 weeks, have you had any thoughts of hurting yourself?" = "Yes" | "Safety Alert" screen with the 988 lifeline and 911. The only ways on are to change the answer or end, so the form cannot be completed with "Yes". The same node sits in all four forms. _(affects: Oral Minoxidil tablets (Retail), Oral Finasteride 1mg (Retail), Hairfect Rx Topical Finasteride Formula (Compound), men, Topical Finasteride Formula for women (women's finasteride hair loss formula), Oral Dutasteride capsules (Compound or Retail), Hairfect Rx Topical Dutasteride Formula (Compound))_ | Stops the patient | observed | high |
| R5 | oral-minoxidil | surgeries = "Yes" | One extra free-text screen ("Please describe your surgical history:"). Nothing else changes. | Adds questions | observed | high |
| R6 | oral-minoxidil | medications, vitamins or supplements = "Yes" | One extra free-text screen (list them with dosages). Nothing else changes. | Adds questions | observed | high |
| R7 | oral-minoxidil | "Is there anything else you want your doctor to know" = "Yes" | One extra free-text screen. Nothing else changes. | Adds questions | observed | high |
| R8 | oral-minoxidil | medical conditions = heart failure or heart disease, low blood pressure, pheochromocytoma or "Other" (each on its own) | Nothing: no stop, no warning, no extra question, oral minoxidil 2.5 mg stays in the cart. The answer is left for the provider. _(affects: Oral Minoxidil tablets (Retail))_ | No effect | observed | high |
| R9 | oral-minoxidil | allergy = "Minoxidil" | Nothing: the form keeps oral minoxidil in the cart and shows no warning. _(affects: Oral Minoxidil tablets (Retail))_ | No effect | observed | high |
| R10 | oral-minoxidil | hair-loss symptoms = "Patchy bald spots" only, or scalp symptoms = "Sudden hair loss"; scalp symptoms = "Bleeding" on its own (stage 3) | Nothing: no warning that this may not be pattern hair loss, no referral, no extra question, no photo request. _(affects: Oral Minoxidil tablets (Retail))_ | No effect | observed | high |
| R11 | oral-minoxidil | mood concerns = "Yes" | Nothing. The "Important Mental Health Warning" (about finasteride and dutasteride) is shown to every patient whatever they answer. | No effect | observed | high |
| R12 | oral-minoxidil | every high-risk answer at once (age 61+, 1 month, patchy, sudden loss, bleeding scalp, minoxidil allergy, six heart, blood pressure and kidney conditions, sexual dysfunction, mood Yes twice) | Still nothing: same screens, same cart, account card reached. There is no scoring and no cumulative rule (the definition's "scoring" field is empty). _(affects: Oral Minoxidil tablets (Retail))_ | No effect | observed | high |
| R13 | oral-minoxidil | "End questionnaire" on a stop screen | The exit redirect is broken: the patient lands on an error page ("Oops, you seem lost"). | Stops the patient | observed | high |
| R24 | oral-minoxidil | sexual dysfunction = "Yes"; lost interest = "Yes"; noticed "1 month or less"; tried "Minoxidil oral tablets"; condition "Heart attack or coronary artery disease" or "Kidney disease"; scalp "Itching, pain, burning, or lesions"; symptom "Diffuse thinning (all over)" (each on its own) | Nothing: no stop, no warning, no extra question; oral minoxidil 2.5 mg, $65, stays in the cart and the account card is reached. Confirms the code reading that these screens have a single way out. _(affects: Oral Minoxidil tablets (Retail))_ | No effect | observed | high |
| R14 | oral-minoxidil | any option still not replayed on its own (durations "Less than 6 months", "6-12 months", "Over 2 years"; symptoms "Thinning at the front hairline", "Thinning at the temples", "Increased shedding"; scalp "Dry skin or dandruff", "Rash"; treatments tried other than "Minoxidil oral tablets"; allergies other than "Minoxidil"; conditions thyroid, BPH, HIV, autoimmune, glaucoma; "Other" on treatments and allergies) | No effect inside the form: each of these screens has one way out and no condition on it. _(affects: Oral Minoxidil tablets (Retail))_ | No effect | code | high |
| R15 | men-finasteride-oral | sex at birth = "Female" | Stop screen "Available for Male Patients Only". Go back or end. Oral finasteride is never offered to women. _(affects: Oral Finasteride 1mg (Retail))_ | Stops the patient | code | high |
| R16 | finasteride-topical | sex at birth = "Female" | The women's topical finasteride card replaces the men's card (price IDs 612/598 instead of 311/384, same $59 / $79). All later questions are the same as for men: there is no pregnancy, breastfeeding or contraception question anywhere in the form. _(affects: Hairfect Rx Topical Finasteride Formula (Compound), men, Topical Finasteride Formula for women (women's finasteride hair loss formula))_ | Switches product | code | high |
| R17 | dutasteride | "Which form of dutasteride are you looking to use?" = "Oral Custom Capsule" | Oral capsule card (0.1 mg, $39) instead of the topical card ($69 / $99); the solution-or-gel and formula preference questions are skipped. _(affects: Oral Dutasteride capsules (Compound or Retail), Hairfect Rx Topical Dutasteride Formula (Compound))_ | Switches product | code | high |
| R18 | finasteride-topical | formula preference chosen (finasteride 0.25% with or without tretinoin 0.0125% and minoxidil 7.5%, or "no preference"); solution or gel chosen | Recorded as a preference only. No branch and no price change; "so your physician can review the selection with your medical history". The dutasteride form does the same with its own list. _(affects: Hairfect Rx Topical Finasteride Formula (Compound), men, Topical Finasteride Formula for women (women's finasteride hair loss formula), Hairfect Rx Topical Dutasteride Formula (Compound))_ | Flags for the clinician | code | medium |
| R19 | finasteride-topical | fewer than two hairline photos added | The continue button stays disabled: front and back hairline photos are required in the topical finasteride and dutasteride forms. The oral finasteride and oral minoxidil forms ask for no photos. _(affects: Hairfect Rx Topical Finasteride Formula (Compound), men, Topical Finasteride Formula for women (women's finasteride hair loss formula), Oral Dutasteride capsules (Compound or Retail), Hairfect Rx Topical Dutasteride Formula (Compound))_ | Stops the patient | code | medium |
| R20 | men-finasteride-oral | any medical answer in the oral finasteride, topical finasteride or dutasteride forms (conditions, allergies, scalp symptoms, sexual dysfunction, mood) | No branch in the definition: nothing is removed, switched or warned about inside the form. The shared questions behaved exactly this way when replayed in the oral minoxidil form. _(affects: Oral Finasteride 1mg (Retail), Hairfect Rx Topical Finasteride Formula (Compound), men, Topical Finasteride Formula for women (women's finasteride hair loss formula), Oral Dutasteride capsules (Compound or Retail), Hairfect Rx Topical Dutasteride Formula (Compound))_ | No effect | code | medium |
| R21 | oral-minoxidil | identity check (Persona) fails; card is declined | Failed ID check -> photo ID and selfie upload instead; declined card -> back to the payment screen. Neither changes the product. | Adds questions | code | medium |
| R22 | old-checkout | after checkout, the provider judges the patient "not a good candidate" | The order is declined and the card is not charged. The provider can also change strengths and ingredients of compounded formulas, and picks the Hair Booster strength. _(affects: Hairfect Rx Topical Finasteride Formula (Compound), men, Hairfect Rx Topical Dutasteride Formula (Compound), Strut Women's Hair Growth Formula (Compound), Strut Hair Booster (Compound))_ | Flags for the clinician | docs | medium |
| R23 | old-checkout | woman who is pregnant, planning pregnancy or breastfeeding (women's formula, Hair Booster) | Strut's pages say do not use. How the hidden questionnaire handles it (stop screen or provider decision) could not be seen. _(affects: Strut Women's Hair Growth Formula (Compound), Strut Hair Booster (Compound))_ | Unknown | docs | low |
| R25 | oral-minoxidil | age = "46-60"; condition "Liver problems", "Stroke" or "Breast or prostate cancer"; scalp symptom "Bleeding" (each on its own) | Nothing: no stop, no warning, no extra question; oral minoxidil 2.5 mg, $65, stays in the cart and the account card is reached. Stage 3 gap tests; stroke and bleeding had only been seen in the combined worst-case run. _(affects: Oral Minoxidil tablets (Retail))_ | No effect | observed | high |
| R26 | oral-minoxidil | the patient is a woman (baseline woman: diffuse thinning on top, no conditions) | The form cannot tell: it asks no sex, pregnancy, breastfeeding or contraception question, so a woman gets exactly the same screens and the same oral minoxidil 2.5 mg ($65) cart as the man, up to the account card. _(affects: Oral Minoxidil tablets (Retail))_ | No effect | observed | high |

## 4. Products (15)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Oral Finasteride 1mg (Retail)](https://www.struthealth.com/hair-loss/finasteride/oral) | rx-oral | finasteride 1 mg tablet, once daily | tablet | men | US Rx, FDA-approved generic tablet (on-label for male pattern hair loss) | $25 for a 30-day supply (30 tablets), auto-refill ($49 for a 90-day supply (code: price IDs 48 and 49, slug finasteride-oral-tablets). Visit and shipping included.) | Offered to every adult who opens the oral finasteride form and answers "Male" (30-day supply pre-selected). "Female" and "Under 18" are stopped. No medical answer changes it inside the form (code; behind the account wall). The provider decides after checkout. | code |
| [Hairfect Rx Topical Finasteride Formula (Compound), men](https://www.struthealth.com/hair-loss/finasteride/topical) | rx-topical-compounded | finasteride 0.25%; minoxidil 7.5% (optional; can be left out); tretinoin 0.0125% in the form's preference list; the price label in code says 0.025% (optional); fluocinolone strength not stated by Strut for this formula (0.01% is stated for the dutasteride and women's formulas); biotin not stated | topical gel or solution (patient states a preference), 30 ml once daily or 60 ml twice daily | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $59 for a 30-day supply (30 ml, once daily) ($79 for a 30-day supply of 60 ml (twice daily). Code: price IDs 311 and 384, slug finasteride-hair-loss-formula. Formula preference options in the form: finasteride 0.25% + tretinoin 0.0125% + minoxidil 7.5%; finasterid…) | Offered to every adult who opens the topical finasteride form and answers "Male" (30 ml pre-selected). The patient states gel or solution and which actives they would like; the provider makes the final formula (code; behind the account wall). | code |
| [Topical Finasteride Formula for women (women's finasteride hair loss formula)](https://start.struthealth.com/f/6adb546a5d885b6c0877d8e4) | rx-topical-compounded | finasteride 0.25% (same preference list as the men's form); minoxidil 7.5% (optional); tretinoin 0.0125% (optional) | topical gel or solution, 30 ml once daily or 60 ml twice daily | women | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $59 for a 30-day supply (30 ml, once daily) ($79 for 60 ml (twice daily). Code: price IDs 612 and 598, slug womens-finasteride-hair-loss-formula. No product page of its own was found: it appears only as the "Female" branch of the topical finasteride form.) | Shown when "Female" is chosen at "What sex were you assigned at birth?" in the topical finasteride form (code). Not seen live: the form starts with the account card. | code |
| [Oral Dutasteride capsules (Compound or Retail)](https://www.struthealth.com/hair-loss/dutasteride/oral) | rx-oral-compounded | dutasteride 0.1 mg compounded capsule (with biotin up to 5000 mcg) or 0.5 mg retail capsule; the collection page says 0.1 mg to 0.6 mg; biotin up to 5000 mcg, only in the compounded 0.1 mg capsule | capsule, once daily | men | 0.1 mg capsule: US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription). 0.5 mg capsule: US Rx FDA-approved generic, used off-label for hair loss. | $39 for a 30-day supply (30 capsules) (Same price for the compounded 0.1 mg and the retail 0.5 mg (docs). The form's card lists one option only: "Dutasteride Oral - 0.1mg Capsules" $39 (code: price ID 382, slug dutasteride-custom-formulas). How a patient ask…) | Shown in the dutasteride form when the patient picks "Oral Custom Capsule" (one option, 0.1 mg, $39). No sex question and no medical branch in that form (code; behind the account wall). | code |
| [Hairfect Rx Topical Dutasteride Formula (Compound)](https://www.struthealth.com/hair-loss/dutasteride/topical) | rx-topical-compounded | dutasteride 0.1%; minoxidil 7.5% (optional); tretinoin 0.0125% (optional); fluocinolone 0.01% (optional); biotin not stated | topical gel or solution, 30 ml once daily or 60 ml twice daily | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $69 for a 30-day supply (30 ml, once daily) ($99 for 60 ml (twice daily). Code: price IDs 380 and 383, slug dutasteride-custom-formulas. Formula preference options in the form: dutasteride 0.1% + tretinoin 0.0125% + minoxidil 7.5% + fluocinolone 0.01%; the same wi…) | Default path of the dutasteride form ("Custom Topical Formula"): 30 ml pre-selected; the patient states gel or solution and a formula preference; the provider makes the final formula (code; behind the account wall). | code |
| [HairfectRx Capsules with Finasteride (Compound)](https://www.struthealth.com/hair-loss/hairfectrx-finasteride) | rx-oral-compounded | finasteride 1 mg; minoxidil 5 mg (oral); D-biotin, vitamin C, methyltetrahydrofolate, vitamin D3, zinc picolinate, vitamin A not stated | liposomal capsule, once daily | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $69 a month (30 capsules), monthly subscription (Old checkout: hair-compound-oral?priceId=2060.) | Never recommended by a form: the patient picks it on its own product page. Its questionnaire is behind the old checkout's account wall and was not seen; Strut says a provider reviews the answers and declines without charge if the patient is "not a good candidate" (docs). | docs |
| [HairfectRx Capsules with Dutasteride (Compound)](https://www.struthealth.com/hair-loss/hairfectrx-dutasteride) | rx-oral-compounded | dutasteride 0.4 mg; minoxidil 5 mg (oral); D-biotin, vitamin C, methyltetrahydrofolate, vitamin D3, zinc picolinate, vitamin A not stated | liposomal capsule, once daily | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $69 a month (30 capsules), monthly subscription (Old checkout: hair-compound-oral?priceId=2140.) | Never recommended by a form: the patient picks it on its own product page. Its questionnaire is behind the old checkout's account wall and was not seen; Strut says a provider reviews the answers and declines without charge if the patient is "not a good candidate" (docs). | docs |
| [Oral Minoxidil tablets (Retail)](https://www.struthealth.com/hair-loss/oral-minoxidil) | rx-oral | minoxidil 1.25 mg or 2.5 mg daily | tablet, once daily | both | US Rx, FDA-approved generic tablet (approved for high blood pressure; hair loss is off-label) | $55 for a 90-day supply (1.25 mg) ($65 for a 90-day supply (2.5 mg), which is the pre-selected dose in the form (observed). Code: price IDs 798 and 797, slug oral_minoxidil_men. The form does not ask sex before the account card; the slug says "men" and t…) | Offered to every adult who opens the oral minoxidil form: the dose picker (2.5 mg pre-selected, or 1.25 mg) is the second screen, before any medical question. In 26 one-change replays nothing removed it or changed its dose: not heart failure, heart attack, low blood pressure, pheochromocytoma, kidney disease, a minoxidil allergy, earlier use of oral minoxidil, patchy or sudden hair loss, or age 61+ (observed). Only "Under 18" and self-harm "Yes" stop the form. The provider decides after checkout. | observed |
| [Strut Women's Hair Growth Formula (Compound)](https://www.struthealth.com/hair-loss/strut-hair-formula) | rx-topical-compounded | spironolactone 1%; finasteride 0.25%; minoxidil 0 to 7.5%; tretinoin 0 to 0.025%; fluocinolone 0.01% (optional); biotin not stated | topical solution with dropper, 30 ml a month, applied nightly | women | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $59 a month (one 30 ml bottle), auto-refill (Ingredient combinations are set by the provider ("Spironolactone or Finasteride + Minoxidil + Fluocinolone + Tretinoin + Biotin"). Old checkout: womens-hair-growth-rx-formula?priceId=226.) | Never recommended by a form: a woman picks it on its product page. Strut says a provider sets the actives and strengths and that it must not be used in pregnancy, when planning pregnancy or when breastfeeding (docs). Its questionnaire is behind the account wall and was not seen. | docs |
| [Strut Hair Booster (Compound)](https://www.struthealth.com/hair-loss/hair-booster) | rx-topical-compounded | latanoprost 0.03% (regular) or 0.1% (max strength); melatonin not stated; caffeine not stated; biotin not stated | topical, 30 ml, applied once nightly | both | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) | $49 for a 30-day supply (regular strength, 30 ml) ($99 for max strength 0.1% latanoprost (30 ml). "Your provider will decide which strength is appropriate." Old checkout: latanoprost-hair-booster-formula?priceId=676.) | Never recommended by a form: picked on its product page, sold as an add-on for men and women. "Your provider will decide which strength is appropriate" (0.03% or 0.1%). Not in pregnancy or breastfeeding unless the provider agrees (docs). Questionnaire not seen. | docs |
| [Ketoconazole 2% Shampoo (Retail)](https://www.struthealth.com/hair-loss/ketoconazole-shampoo) | rx-topical-licensed | ketoconazole 2% | shampoo, 120 ml (4 oz) | both | US Rx, FDA-approved product (for dandruff and seborrhoeic dermatitis; hair-loss use is off-label) | From $25 for a 120 ml bottle, auto-refill (Old checkout: ketoconazole_shampoo_men?priceId=799 (the slug says "men"; the page does not name an audience).) | Never recommended by a form: the patient picks it on its own product page. Its questionnaire is behind the old checkout's account wall and was not seen; Strut says a provider reviews the answers and declines without charge if the patient is "not a good candidate" (docs). | docs |
| [Hairfect Combo (Retail): Finasteride Tablets + StrutVite](https://www.struthealth.com/hair-loss/hairfect-combo) | bundle | finasteride 1 mg tablet; StrutVite hair, skin and nail vitamins 2 capsules daily | tablets plus supplement capsules | men | US Rx generic tablet plus a non-prescription food supplement | $33 a month on a 3-month supply (90 tablets + 180 StrutVite capsules) (Old checkout: hairfect-combo?priceId=243.) | Never recommended by a form: the patient picks it on its own product page. Its questionnaire is behind the old checkout's account wall and was not seen; Strut says a provider reviews the answers and declines without charge if the patient is "not a good candidate" (docs). | docs |
| [Hairfect Combo (Compound): Finasteride Gel + StrutVite](https://www.struthealth.com/hair-loss/hairfect-gel-combo) | bundle | topical finasteride formula (finasteride, minoxidil, tretinoin, fluocinolone, biotin) customisable; see p2; StrutVite hair, skin and nail vitamins 2 capsules daily | topical gel or solution plus supplement capsules | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) plus a non-prescription food supplement | $55 a month on a 3-month supply (90 ml topical + 180 StrutVite capsules) (Old checkout: hairfect-gel-combo?priceId=313.) | Never recommended by a form: the patient picks it on its own product page. Its questionnaire is behind the old checkout's account wall and was not seen; Strut says a provider reviews the answers and declines without charge if the patient is "not a good candidate" (docs). | docs |
| [Hairfect Combo (Compound or Retail): Dutasteride (topical or oral) + StrutVite](https://www.struthealth.com/hair-loss/dutasteride-hair-combo) | bundle | dutasteride topical formula or dutasteride capsules see p4 and p5; StrutVite hair, skin and nail vitamins 2 capsules daily | topical or capsules, plus supplement capsules | men | US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription) or US Rx generic capsule, plus a non-prescription food supplement | $60 a month on a 90-day supply (90 ml topical + 180 StrutVite capsules) ($40 a month on a 90-day supply (90 dutasteride capsules + 180 StrutVite capsules). Old checkout: dutasteride-hair-combo?priceId=485.) | Never recommended by a form: the patient picks it on its own product page. Its questionnaire is behind the old checkout's account wall and was not seen; Strut says a provider reviews the answers and declines without charge if the patient is "not a good candidate" (docs). | docs |
| [StrutVite hair, skin and nail supplement](https://www.struthealth.com/skin/strutvite) | supplement | vitamins A, C, D, E, B1, B5, B6, B9, B12, biotin; calcium, iron, magnesium, zinc, manganese, potassium; botanicals including horsetail, fo-ti, bamboo, nettle, saw palmetto not stated on the page text captured | capsule, 2 once daily | both | US non-prescription food supplement | $24.99 for 60 capsules (30 doses), auto-refill (Old checkout: otc-strutvite?priceId=710. Listed under Skin, and bundled into the three Hairfect Combos.) | Sold on its own without a prescription, or as part of a Hairfect Combo. | docs |

## 5. Who gets what (12 patient profiles)

- **Baseline man: 31-45, hair loss over 1 year, receding hairline and thinning on top, no scalp symptoms, no treatments, no conditions, no medicines (oral minoxidil form)** → Oral Minoxidil tablets (Retail) (default: Oral Minoxidil tablets (Retail)). There is no recommendation screen. The dose picker comes straight after the age question: 2.5 mg ($65 for 90 days) is pre-selected, 1.25 mg ($55) is the other choice. The walk ends at "Create account" (75%) with 2.5 mg in the cart. Proof: runs/baseline-us. _[observed]_
- **Same man who taps "1.25 mg" on the dose picker** → Oral Minoxidil tablets (Retail) (default: Oral Minoxidil tablets (Retail)). Cart: "90 Day Supply - 2.5 mg (1.25mg)", $55.00. Questions identical. Proof: runs/exp-04-dose-1-25. _[observed]_
- **Anyone answering "Under 18"** → nothing offered. Stop screen "Age Verification"; no product is shown. Proof: runs/exp-01-age-under18. _[observed]_
- **Baseline man who answers "Yes" to thoughts of hurting himself** → nothing offered. "Safety Alert" screen (988, 911). He can only change the answer or end; the item stays in the cart but the account card cannot be reached with "Yes". Proof: runs/exp-05-selfharm-yes. _[observed]_
- **High-risk man: heart failure, heart attack, stroke, low blood pressure, pheochromocytoma, kidney disease, minoxidil allergy, sudden patchy loss, 61+** → Oral Minoxidil tablets (Retail) (default: Oral Minoxidil tablets (Retail)). Exactly the same offer as the baseline man: oral minoxidil 2.5 mg, $65, up to the account card. Any refusal can only come from the provider after sign-up, ID check and card. Proof: runs/exp-26-worst-case, plus one-change runs exp-09 to exp-23. _[observed]_
- **Man who starts from the oral finasteride page** → Oral Finasteride 1mg (Retail) (default: Oral Finasteride 1mg (Retail)). Finasteride 1 mg: 30 days $25 (default) or 90 days $49. Behind the account wall; read from the served definition. _[code]_
- **Man who starts from the topical finasteride page** → Hairfect Rx Topical Finasteride Formula (Compound), men (default: Hairfect Rx Topical Finasteride Formula (Compound), men). Hairfect Rx topical finasteride: 30 ml once daily $59 (default) or 60 ml twice daily $79; he states gel or solution and a formula preference (with or without minoxidil 7.5% and tretinoin). Behind the account wall; from the definition. _[code]_
- **Man who starts from the dutasteride page** → Hairfect Rx Topical Dutasteride Formula (Compound), Oral Dutasteride capsules (Compound or Retail) (default: Hairfect Rx Topical Dutasteride Formula (Compound)). He chooses topical (default path: 30 ml $69 or 60 ml $99, then gel or solution and formula preference) or oral 0.1 mg capsules ($39). Behind the account wall; from the definition. _[code]_
- **Woman who answers "Female" in the topical finasteride form** → Topical Finasteride Formula for women (women's finasteride hair loss formula) (default: Topical Finasteride Formula for women (women's finasteride hair loss formula)). Women's topical finasteride card, $59 or $79. No pregnancy question follows. Behind the account wall; from the definition. The baseline woman could not be walked on any route. _[code]_
- **Woman who answers "Female" in the oral finasteride form** → nothing offered. Stop screen "Available for Male Patients Only". From the definition. _[code]_
- **Baseline woman, 38, who starts from the women's product page** → Strut Women's Hair Growth Formula (Compound) (default: Strut Women's Hair Growth Formula (Compound)). The page sells one product, the Strut Women's Hair Growth Formula ($59 a month); the provider sets the actives. The questionnaire is behind the old checkout's first-screen account wall and was not seen. _[docs]_
- **Baseline woman, 38, diffuse thinning on top, no conditions, who starts from the oral minoxidil page** → Oral Minoxidil tablets (Retail) (default: Oral Minoxidil tablets (Retail)). Same as the man: no sex or pregnancy question, oral minoxidil 2.5 mg ($65 for 90 days) pre-selected, account card at 75%. Proof: runs/verify-v-woman-baseline-min. _[observed]_

## 6. The consultation, step by step

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

- `1 month or less` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Less than 6 months` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `6-12 months` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Over 1 year` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Over 2 years` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**9. What symptoms of hair loss have you noticed? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Pattern of hair loss for the provider (pattern loss, patchy, diffuse, shedding).

- `Thinning at the front hairline` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Thinning at the temples` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Thinning on the top of the head` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Receding hairline` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Patchy bald spots` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Diffuse thinning (all over)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Increased shedding` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**10. Have you noticed any scalp symptoms? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Looks for signs of scalp disease or sudden loss that would point away from pattern hair loss.

- `Itching, pain, burning, or lesions` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Dry skin or dandruff` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Rash` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Bleeding` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Sudden hair loss` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**11. What treatments have you tried before? Select all that apply.**  
_multi · after-account · role: personalisation · shown: always · no branch · code_  
Why they ask: Treatment history for the provider.

- `Minoxidil (Rogaine) topical` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Minoxidil oral tablets` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Finasteride (Propecia)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Dutasteride (Avodart)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Biotin or biotin-based vitamins` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Ketoconazole shampoo` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Steroid-based scalp injections` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Hair transplant` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `PRP (platelet-rich plasma)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Other` → **No effect**: Opens a free-text box. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**12. Do you have any issues with sexual dysfunction currently?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Baseline sexual function before a 5-alpha-reductase inhibitor.

- `Yes` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `No` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**13. Are you allergic to any of the following? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Allergy check against the ingredients Strut uses.

- `Finasteride` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Dutasteride` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Minoxidil` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Tretinoin` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Ketoconazole` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Latanoprost or Bimatoprost` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Azelaic Acid` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Caffeine` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Melatonin` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Fluocinolone or Hydrocortisone` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Other` → **No effect**: Opens a free-text box. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**14. Do you have any of the following medical conditions? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Medical history check (heart, blood pressure, liver, kidney, cancer and so on).

- `Heart failure or heart disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Heart attack or coronary artery disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Stroke` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Low blood pressure` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Pheochromocytoma` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Liver problems` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Kidney disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Thyroid disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Breast or prostate cancer` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Prostate enlargement (BPH)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `HIV` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Autoimmune disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Glaucoma or eye conditions` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Other` → **No effect**: Opens a free-text box. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

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

- `Yes` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `No` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**20. In the last 2 weeks, have you lost interest in doing your daily routine?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Depression screen.

- `Yes` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `No` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

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

- `1 month or less` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Less than 6 months` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `6-12 months` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Over 1 year` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Over 2 years` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**9. What symptoms of hair loss have you noticed? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Pattern of hair loss for the provider (pattern loss, patchy, diffuse, shedding).

- `Thinning at the front hairline` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Thinning at the temples` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Thinning on the top of the head` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Receding hairline` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Patchy bald spots` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Diffuse thinning (all over)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Increased shedding` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**10. Have you noticed any scalp symptoms? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Looks for signs of scalp disease or sudden loss that would point away from pattern hair loss.

- `Itching, pain, burning, or lesions` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Dry skin or dandruff` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Rash` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Bleeding` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Sudden hair loss` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**11. What treatments have you tried before? Select all that apply.**  
_multi · after-account · role: personalisation · shown: always · no branch · code_  
Why they ask: Treatment history for the provider.

- `Minoxidil (Rogaine) topical` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Minoxidil oral tablets` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Finasteride (Propecia)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Dutasteride (Avodart)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Biotin or biotin-based vitamins` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Ketoconazole shampoo` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Steroid-based scalp injections` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Hair transplant` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `PRP (platelet-rich plasma)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Other` → **No effect**: Opens a free-text box. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**12. Do you have any issues with sexual dysfunction currently?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Baseline sexual function before a 5-alpha-reductase inhibitor.

- `Yes` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `No` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**13. Are you allergic to any of the following? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Allergy check against the ingredients Strut uses.

- `Finasteride` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Dutasteride` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Minoxidil` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Tretinoin` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Ketoconazole` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Latanoprost or Bimatoprost` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Azelaic Acid` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Caffeine` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Melatonin` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Fluocinolone or Hydrocortisone` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Other` → **No effect**: Opens a free-text box. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**14. Do you have any of the following medical conditions? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Medical history check (heart, blood pressure, liver, kidney, cancer and so on).

- `Heart failure or heart disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Heart attack or coronary artery disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Stroke` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Low blood pressure` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Pheochromocytoma` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Liver problems` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Kidney disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Thyroid disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Breast or prostate cancer` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Prostate enlargement (BPH)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `HIV` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Autoimmune disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Glaucoma or eye conditions` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Other` → **No effect**: Opens a free-text box. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

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

- `Yes` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `No` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**20. In the last 2 weeks, have you lost interest in doing your daily routine?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Depression screen.

- `Yes` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `No` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

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

- `Solution (Preferred Physician's Choice): The solution is thinner and may work best for those with longer hair. It contains a small amount of alcohol in the formula.` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Gel: The gel is thicker and preferred by patients due to less scalp runoff. It does not contain alcohol in the formula.` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

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

- `Solution (Preferred Physician's Choice): The solution is thinner and may work best for those with longer hair. It contains a small amount of alcohol in the formula.` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Gel: The gel is thicker and preferred by patients due to less scalp runoff. It does not contain alcohol in the formula.` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

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

- `1 month or less` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Less than 6 months` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `6-12 months` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Over 1 year` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Over 2 years` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**11. What symptoms of hair loss have you noticed? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Pattern of hair loss for the provider (pattern loss, patchy, diffuse, shedding).

- `Thinning at the front hairline` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Thinning at the temples` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Thinning on the top of the head` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Receding hairline` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Patchy bald spots` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Diffuse thinning (all over)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Increased shedding` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**12. Have you noticed any scalp symptoms? Select all that apply.**  
_multi · after-account · role: diagnosis · shown: always · no branch · code_  
Why they ask: Looks for signs of scalp disease or sudden loss that would point away from pattern hair loss.

- `Itching, pain, burning, or lesions` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Dry skin or dandruff` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Rash` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Bleeding` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Sudden hair loss` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**13. What treatments have you tried before? Select all that apply.**  
_multi · after-account · role: personalisation · shown: always · no branch · code_  
Why they ask: Treatment history for the provider.

- `Minoxidil (Rogaine) topical` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Minoxidil oral tablets` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Finasteride (Propecia)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Dutasteride (Avodart)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Biotin or biotin-based vitamins` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Ketoconazole shampoo` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Steroid-based scalp injections` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Hair transplant` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `PRP (platelet-rich plasma)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Other` → **No effect**: Opens a free-text box. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**14. Do you have any issues with sexual dysfunction currently?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Baseline sexual function before a 5-alpha-reductase inhibitor.

- `Yes` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `No` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**15. Are you allergic to any of the following? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Allergy check against the ingredients Strut uses.

- `Finasteride` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Dutasteride` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Minoxidil` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Tretinoin` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Ketoconazole` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Latanoprost or Bimatoprost` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Azelaic Acid` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Caffeine` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Melatonin` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Fluocinolone or Hydrocortisone` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Other` → **No effect**: Opens a free-text box. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**16. Do you have any of the following medical conditions? Select all that apply.**  
_multi · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Medical history check (heart, blood pressure, liver, kidney, cancer and so on).

- `Heart failure or heart disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Heart attack or coronary artery disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Stroke` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Low blood pressure` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Pheochromocytoma` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Liver problems` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Kidney disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Thyroid disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Breast or prostate cancer` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Prostate enlargement (BPH)` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `HIV` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Autoimmune disease` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Glaucoma or eye conditions` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `Other` → **No effect**: Opens a free-text box. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **No effect**: Clears the other ticks. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

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

- `Yes` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `No` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

**22. In the last 2 weeks, have you lost interest in doing your daily routine?**  
_single · after-account · role: safety-screen · shown: always · no branch · code_  
Why they ask: Depression screen.

- `Yes` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_
- `No` → **No effect**: No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything. _[code]_

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

Welcome screen, age, dose picker ("Add to cart"), then 13 questions and one warning screen (up to 3 extra free-text screens), all anonymous; then the account wall ("Create account") at 75%; then address, Persona ID check, cart, card, order submitted. No sex question, no blood pressure or heart rate question, no photos. Stage 2: 26 one-change replays confirmed three kinds of branch only (under-18 stop, self-harm stop, three free-text follow-ups) plus the dose picker changing the price; no medical answer changed anything.

**1. Ready to start your Strut Hair Loss journey. Medical questionnaire. This secure form collects important health information to help our licensed medical providers evaluate your eligibility and make informed decisions about your care. HOW IT WORKS 1 Answer the questionnaire honestly and as completely as possible. 2 A licensed medical provider will review your responses within 1 business day. 3 If any additional information is needed, our team will reach out via email or SMS. [Continue]**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Welcome screen: sets expectations (provider review within 1 business day).


**2. What is your age?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Screens out under-18s. Nothing else is done with the age band inside the form; the exact date of birth is only asked later on the account card.  
Downstream: "Under 18" goes to the Age Verification stop screen (observed, runs/exp-01-age-under18). 18-30, 31-45 and 61+ all continue with identical screens and cart (observed). There is no upper age limit and no extra question for older patients.

- `Under 18` → **Stops the patient**: Stop screen "Age Verification": "These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it." The dose picker is never shown and nothing is put in the cart. The only choices are "Go back and update my answer" or "End questionnaire" (runs/exp-01-age-under18). _(affects: Oral Minoxidil tablets (Retail))_ _[observed]_
- `18-30` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-02-age-18-30 against runs/baseline-us). The answer is only stored for the reviewing provider. _[observed]_
- `31-45` → **Next question**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). _[observed]_
- `46-60` → **No effect**: No effect inside the form: same screens, same $65 cart, account card reached (observed on its own in runs/verify-v-age-46-60). _[observed]_
- `61+` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-03-age-61plus against runs/baseline-us). The answer is only stored for the reviewing provider. _[observed]_

**3. Age Verification These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it.**  
_single · anonymous · role: eligibility-gate · shown: only after "Under 18" at "What is your age?" · BRANCHES · observed_  
Why they ask: Stop screen. These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it.  
Downstream: Seen live in runs/exp-01-age-under18 and runs/exp-25-age-under18-end.

- `Go back and update my answer` → **Next question**: Returns to the age question so the answer can be changed (read from the definition; the identical control on the Safety Alert screen was seen working in runs/exp-05-selfharm-yes). _[code]_
- `End questionnaire` → **Stops the patient**: Ends the visit. The redirect is broken: the browser lands on https://start.struthealth.com/flow/www.struthealth.co, a form-builder error page that says "Oops, you seem lost. The flow you're looking for doesn't exist or is not published." (runs/exp-25-age-under18-end). The definition's redirect address is "www.struthealth.co" with no "https://" and no "m". _[observed]_

**4. Minoxidil Tablets. Oral minoxidil for hair loss · compounded by a US licensed pharmacy. DOSE [options] TOTAL TODAY. [Add to cart]**  
_single · anonymous · role: product-selector · shown: always · no branch · observed_  
Why they ask: Dose and price. Shown straight after the age question, before any medical question.  
Downstream: The choice only sets the cart line and price (observed). It does not change any question. The dose is chosen before a single medical question has been asked.

- `2.5 mg, 90 Day Supply, $65 for 90 days` → **No effect**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). Pre-selected. Cart line: "90 Day Supply - 2.5 mg", total $65.00 (price ID 797 in code). _(affects: Oral Minoxidil tablets (Retail))_ _[observed]_
- `1.25 mg, 90 Day Supply, $55 for 90 days` → **Changes strength**: Cart line becomes "90 Day Supply - 2.5 mg (1.25mg)" and the total drops from $65.00 to $55.00 (price ID 798 in code). Every later screen is identical and the walk ends at "Create account" (runs/exp-04-dose-1-25 against runs/baseline-us). The patient, not the form, picks the dose. _(affects: Oral Minoxidil tablets (Retail))_ _[observed]_

**5. How long ago did you first notice signs of hair loss?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: History for the provider: how long the hair loss has been going on.

- `1 month or less` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-18-duration-1month against runs/baseline-us). Very recent loss is a reason to look for another cause, yet the form shows no warning. The answer is only stored for the reviewing provider. _[observed]_
- `Less than 6 months` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `6-12 months` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Over 1 year` → **No effect**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). _[observed]_
- `Over 2 years` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**6. What symptoms of hair loss have you noticed? Select all that apply.**  
_multi · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Pattern of hair loss for the provider (pattern loss, patchy, diffuse, shedding).

- `Thinning at the front hairline` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thinning at the temples` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Thinning on the top of the head` → **No effect**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). _[observed]_
- `Receding hairline` → **No effect**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). _[observed]_
- `Patchy bald spots` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-14-symptom-patchy against runs/baseline-us). Ticked on its own in place of the two baseline answers. Patchy loss usually points away from pattern hair loss, yet the form shows no warning. The answer is only stored for the reviewing provider. _[observed]_
- `Diffuse thinning (all over)` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-23-symptom-diffuse-shedding against runs/baseline-us). Ticked on its own in place of the two baseline answers. Diffuse loss can have other causes (thyroid, iron, stress shedding), yet the form asks nothing more. The answer is only stored for the reviewing provider. _[observed]_
- `Increased shedding` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_

**7. Have you noticed any scalp symptoms? Select all that apply.**  
_multi · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Looks for signs of scalp disease or sudden loss that would point away from pattern hair loss.

- `Itching, pain, burning, or lesions` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-22-scalp-itch-lesions against runs/baseline-us). A sore or scaly scalp can mean a skin condition that needs treating first, yet the form asks nothing more. The answer is only stored for the reviewing provider. _[observed]_
- `Dry skin or dandruff` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Rash` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Bleeding` → **No effect**: No effect inside the form: same screens, same $65 cart, account card reached (observed on its own in runs/verify-v-scalp-bleeding). _[observed]_
- `Sudden hair loss` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-13-scalp-sudden against runs/baseline-us). Sudden loss is a classic reason to look for another cause, yet the form shows no warning. The answer is only stored for the reviewing provider. _[observed]_
- `None of the above` → **No effect**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). _[observed]_

**8. What treatments have you tried before? Select all that apply.**  
_multi · anonymous · role: personalisation · shown: always · no branch · observed_  
Why they ask: Treatment history for the provider.

- `Minoxidil (Rogaine) topical` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Minoxidil oral tablets` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-19-tried-oral-minoxidil against runs/baseline-us). A patient who has already taken oral minoxidil gets no question about how it went, what dose or what side effects. The answer is only stored for the reviewing provider. _[observed]_
- `Finasteride (Propecia)` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dutasteride (Avodart)` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Biotin or biotin-based vitamins` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Ketoconazole shampoo` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Steroid-based scalp injections` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Hair transplant` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `PRP (platelet-rich plasma)` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **No effect**: Not replayed on its own. Opens a free-text box. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **No effect**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). _[observed]_

**9. Do you have any issues with sexual dysfunction currently?**  
_single · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Baseline sexual function before a 5-alpha-reductase inhibitor. The question is shared by all four forms; it is not relevant to oral minoxidil but is asked anyway.

- `Yes` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-15-sexual-yes against runs/baseline-us). The answer is only stored for the reviewing provider. _[observed]_
- `No` → **No effect**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). _[observed]_

**10. Are you allergic to any of the following? Select all that apply.**  
_multi · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Allergy check against the ingredients Strut uses.

- `Finasteride` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Dutasteride` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Minoxidil` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-12-allergy-minoxidil against runs/baseline-us). An allergy to the very medicine in the cart does not stop the form or show a warning. The answer is only stored for the reviewing provider. _[observed]_
- `Tretinoin` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Ketoconazole` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Latanoprost or Bimatoprost` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Azelaic Acid` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Caffeine` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Melatonin` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Fluocinolone or Hydrocortisone` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **No effect**: Not replayed on its own. Opens a free-text box. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `None of the above` → **No effect**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). _[observed]_

**11. Do you have any of the following medical conditions? Select all that apply.**  
_multi · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Medical history check (heart, blood pressure, liver, kidney, cancer and so on).  
Downstream: None. Heart failure, heart attack, low blood pressure, pheochromocytoma and kidney disease were each replayed on their own, and six heart, blood pressure and kidney conditions together: no stop, no warning, no extra question, same cart (observed).

- `Heart failure or heart disease` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-09-cond-heart-failure against runs/baseline-us). Strut's own product page carries the boxed warning about heart risks, but the form does not react. The answer is only stored for the reviewing provider. _[observed]_
- `Heart attack or coronary artery disease` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-20-cond-heart-attack against runs/baseline-us). Oral minoxidil's label warns about recent heart attack and angina, but the form does not react. The answer is only stored for the reviewing provider. _[observed]_
- `Stroke` → **No effect**: No effect inside the form: same screens, same $65 cart, account card reached (observed on its own in runs/verify-v-cond-stroke). _[observed]_
- `Low blood pressure` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-10-cond-low-bp against runs/baseline-us). The answer is only stored for the reviewing provider. _[observed]_
- `Pheochromocytoma` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-11-cond-pheo against runs/baseline-us). This is a labelled contraindication for minoxidil tablets, but the form does not react. The answer is only stored for the reviewing provider. _[observed]_
- `Liver problems` → **No effect**: No effect inside the form: same screens, same $65 cart, account card reached (observed on its own in runs/verify-v-cond-liver). _[observed]_
- `Kidney disease` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-21-cond-kidney against runs/baseline-us). The answer is only stored for the reviewing provider. _[observed]_
- `Thyroid disease` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Breast or prostate cancer` → **No effect**: No effect inside the form: same screens, same $65 cart, account card reached (observed on its own in runs/verify-v-cond-cancer). _[observed]_
- `Prostate enlargement (BPH)` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `HIV` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Autoimmune disease` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Glaucoma or eye conditions` → **No effect**: Not replayed on its own. No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible. _[code]_
- `Other` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-24-cond-other against runs/baseline-us). The "Other" tile turns into a one-line text box; it was left empty and "Continue" still worked. The answer is only stored for the reviewing provider. _[observed]_
- `None of the above` → **No effect**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). _[observed]_

**12. Have you had any surgeries?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Surgical history for the provider.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen, "Please describe your surgical history:". Nothing else changes: same later screens, same cart, ends at "Create account" (runs/exp-06-surgery-yes). _[observed]_
- `No` → **Next question**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). Skips the surgical history screen. _[observed]_

**13. Please describe your surgical history: (placeholder: "Describe your surgeries...")**  
_text · anonymous · role: data-capture · shown: only after "Yes" at "Have you had any surgeries?" · no branch · observed_  
Why they ask: Free text for the provider.  
Downstream: Seen live in runs/exp-06-surgery-yes (a short fictional medical note was typed; no contact details).


**14. Are you currently taking any medications, vitamins, or supplements?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Medicines history for interaction checks.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen, "Please list all current medications, vitamins, and supplements with dosages:". Nothing else changes (runs/exp-07-meds-yes). There is no tick list of interacting medicines (for example blood pressure tablets). _[observed]_
- `No` → **Next question**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). Skips the medicines list screen. _[observed]_

**15. Please list all current medications, vitamins, and supplements with dosages: (placeholder: "List your medications...")**  
_text · anonymous · role: data-capture · shown: only after "Yes" at "Are you currently taking any medications, vitamins, or supplements?" · no branch · observed_  
Why they ask: Free text for the provider.  
Downstream: Seen live in runs/exp-07-meds-yes (a short fictional medical note was typed; no contact details).


**16. Do you have concerns about your mood, depression, anxiety, or excessive worrying?**  
_single · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Mental health screen before finasteride or dutasteride.

- `Yes` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-16-mood-yes against runs/baseline-us). The mental health warning screen that follows is shown to everyone, whatever the answer. The answer is only stored for the reviewing provider. _[observed]_
- `No` → **No effect**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). _[observed]_

**17. In the last 2 weeks, have you lost interest in doing your daily routine?**  
_single · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Depression screen.

- `Yes` → **No effect**: No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline (runs/exp-17-interest-yes against runs/baseline-us). Only the self-harm question can stop the form; low mood answers do not. The answer is only stored for the reviewing provider. _[observed]_
- `No` → **No effect**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). _[observed]_

**18. In the last 2 weeks, have you had any thoughts of hurting yourself?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Self-harm screen.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Stops the patient**: "Safety Alert" screen: "Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire." The only ways on are to change the answer or end, so the visit cannot reach the account card with "Yes" (runs/exp-05-selfharm-yes). _[observed]_
- `No` → **Next question**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). Goes on to the mental health warning screen. _[observed]_

**19. Safety Alert Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire.**  
_single · anonymous · role: safety-screen · shown: only after "Yes" at "In the last 2 weeks, have you had any thoughts of hurting yourself?" · BRANCHES · observed_  
Why they ask: Stop screen. Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire.  
Downstream: Seen live in runs/exp-05-selfharm-yes. Stage 3: pressing "Continue" without choosing keeps the patient on the alert with "An answer is required" (runs/verify-v-selfharm-continue). The alert text says "A physician will still review your questionnaire", yet the form cannot go on with "Yes".

- `Go back and update my answer` → **Next question**: Returns to the self-harm question with "Yes" still ticked, so the patient can change it to "No" and carry on (runs/exp-05-selfharm-yes). _[observed]_
- `End questionnaire` → **Stops the patient**: Not replayed here. It leads to the same ending as "End questionnaire" on the Age Verification screen, which was seen to land on a broken "Oops, you seem lost" page (runs/exp-25-age-under18-end). _[code]_

**20. Important Mental Health Warning: Important: Finasteride and dutasteride (5-alpha-reductase inhibitors) may worsen depression or anxiety symptoms. Oral use carries higher risk than topical. If you experience thoughts of self-harm while using this medication, discontinue immediately and call 911. Please read the above carefully before continuing.**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Warns that finasteride and dutasteride may worsen depression or anxiety. Shown to every patient whatever they answered, and shown unchanged in the oral minoxidil form although that form sells neither medicine (observed in the baseline and in runs/exp-16-mood-yes).


**21. Is there anything else you want your doctor to know about your condition or health?**  
_single · anonymous · role: data-capture · shown: always · BRANCHES · observed_  
Why they ask: Free-text catch-all.  
Downstream: "Yes" adds or diverts as described in the option effects.

- `Yes` → **Adds questions**: Adds one free-text screen, "Please share any additional information for your doctor." Nothing else changes (runs/exp-08-else-yes). _[observed]_
- `No` → **Next question**: Baseline answer: the form simply moves to the next screen (runs/baseline-us). Goes straight to the account card. _[observed]_

**22. Please share any additional information for your doctor. (placeholder: "Share any additional health information...")**  
_text · anonymous · role: data-capture · shown: only after "Yes" at "Is there anything else you want your doctor to know about your condition or health?" · no branch · observed_  
Why they ask: Free text for the provider.  
Downstream: Seen live in runs/exp-08-else-yes (a short fictional medical note was typed; no contact details).


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


**30. End of questionnaire: the definition redirects to "www.struthealth.co"; live, the browser lands on https://start.struthealth.com/flow/www.struthealth.co, which shows "Oops, you seem lost. The flow you're looking for doesn't exist or is not published."**  
_info · anonymous · role: eligibility-gate · shown: after choosing "End questionnaire" on a stop screen · no branch · observed_  
Why they ask: Exit after a stop screen. The redirect address is mistyped, so the patient ends on an error page with no help or link (runs/exp-25-age-under18-end).


### Old checkout app (women's Strut Hair Formula, Hair Booster, ketoconazole shampoo, HairfectRx capsules, the three Hairfect Combos, StrutVite)

Entry: https://checkout.struthealth.com/womens-hair-growth-rx-formula?priceId=226

Every old-checkout link redirects at once to /auth/sign-up (e-mail + phone). The medical questions are loaded from the Strut API only for a signed-in visit, so none are visible. Other entry links: hair-compound-oral?priceId=2060 and 2140, latanoprost-hair-booster-formula?priceId=676, ketoconazole_shampoo_men?priceId=799, hairfect-combo?priceId=243, hairfect-gel-combo?priceId=313, dutasteride-hair-combo?priceId=485, otc-strutvite?priceId=710. Entries q02 to q05 are not questions seen on screen: they quote what Strut's public pages say the provider needs to know (evidence "docs").

**1. See your treatment options. Join for a tailored experience crafted by experts. [Enter your e-mail] [Enter your phone number] [tick box: By creating an account using e-mail, Google, I agree to the Telemedicine Consent, Privacy Policy, Refund Policy and Terms & Conditions] Continue / Already have an account? Sign In. / or (Google)**  
_contact · anonymous · role: identity · shown: always · no branch · observed_  
Why they ask: Account wall on the first screen. Nothing else is shown to an anonymous visitor.


**2. [Question wording not public] Women's Hair Growth Formula: the product page tells patients to "Share any history of scalp conditions, sensitivities to topical medications, current prescriptions, pregnancy or breastfeeding status, and any history of low blood pressure or fainting." It also says: "Do not use if you are pregnant, planning to become pregnant, or breastfeeding." (https://www.struthealth.com/hair-loss/strut-hair-formula)**  
_info · after-account · role: safety-screen · shown: unknown (behind the account wall) · no branch · docs_  
Why they ask: Shows what the hidden women's questionnaire has to cover for the provider: scalp disease, topical sensitivities, current medicines, pregnancy or breastfeeding, low blood pressure or fainting. Whether each is a question, and whether "pregnant" stops the form, is not visible.  
Downstream: Not visible. The questions load only for a signed-in visit, so whether any answer branches or stops is unknown.


**3. [Question wording not public] HairfectRx capsules (finasteride or dutasteride + oral minoxidil 5 mg): the product page tells patients to "Share any history of liver disease, prostate conditions, low blood pressure, heart conditions, current prescriptions, and any plans for blood donation while on finasteride." (https://www.struthealth.com/hair-loss/hairfectrx-finasteride)**  
_info · after-account · role: safety-screen · shown: unknown (behind the account wall) · no branch · docs_  
Why they ask: Shows the topics the provider needs for the combination capsule: liver, prostate, blood pressure, heart, medicines, blood donation. The questionnaire itself was not seen.  
Downstream: Not visible. The questions load only for a signed-in visit, so whether any answer branches or stops is unknown.


**4. [Question wording not public] Strut Hair Booster (latanoprost): "Strut Hair Booster should not be used if you are pregnant or breastfeeding unless your healthcare provider decides the benefit outweighs the risk." and "Your provider will decide which strength is appropriate for you." (https://www.struthealth.com/hair-loss/hair-booster)**  
_info · after-account · role: product-selector · shown: unknown (behind the account wall) · no branch · docs_  
Why they ask: Pregnancy and breastfeeding matter for this product, and the strength (0.03% or 0.1%) is the provider's choice, not the patient's. The questionnaire itself was not seen.  
Downstream: Not visible. The questions load only for a signed-in visit, so whether any answer branches or stops is unknown.


**5. [Question wording not public] All old-checkout products: "If after checking out, the healthcare provider identifies that you are not a good candidate for treatment, you will not be charged." (product page FAQs)**  
_info · after-account · role: expectation-setting · shown: unknown (behind the account wall) · no branch · docs_  
Why they ask: Confirms the model: the decision is made by a provider after checkout, not by the form.  
Downstream: Not visible. The questions load only for a signed-in visit, so whether any answer branches or stops is unknown.


## 7. Competitive read

**Strengths**

- Very wide compounded range: topical finasteride or dutasteride with minoxidil 7.5%, tretinoin and fluocinolone; oral combination capsules (finasteride or dutasteride with oral minoxidil 5 mg); a latanoprost booster; a women's spironolactone and finasteride topical.
- The patient can ask for a formula (which actives to include) and for gel or solution, so the product feels made to order.
- Low entry prices with the visit and shipping included: oral finasteride $25 a month or $49 for 90 days; oral minoxidil $55 or $65 for 90 days. The card is saved, not charged, until a provider approves.
- Short, fast form: about 17 taps from welcome to the account card for oral minoxidil, one question a screen, cart always visible, single answers move on by themselves.
- A real self-harm safety net: "Yes" shows the 988 lifeline and 911 and cannot be clicked past.
- Identity check (Persona) on every order and two hairline photos on the topical forms give the provider something to review.

**Weaknesses**

- No guidance at all: the visitor must already know which of 13 hair products they want. Nothing explains why one fits, and nothing is recommended.
- The account wall is the first screen for most products, so a visitor sees no question and no price confirmation before giving an e-mail and phone number.
- The form does no automatic safety screening. Heart failure, low blood pressure, pheochromocytoma and a minoxidil allergy were all accepted without a warning while oral minoxidil stayed in the cart (observed). The patient learns of a refusal only after sign-up, ID check and card.
- The oral minoxidil form asks nothing about blood pressure readings, heart rate, swelling, pregnancy or sex, and takes no photos. It shows a warning about finasteride and dutasteride, which it does not sell, and none about minoxidil.
- Red flags for other diagnoses (patchy bald spots, sudden loss, bleeding or painful scalp) get no warning, no extra question and no referral advice.
- The women's branch of the topical finasteride form has no pregnancy, breastfeeding or contraception question in the served definition.
- The dose is picked by the patient before any medical question, with the higher dose pre-selected.
- Rough edges: "End questionnaire" lands on a broken "Oops, you seem lost" page; the 1.25 mg dose shows in the cart as "2.5 mg (1.25mg)"; product facts differ between pages (tretinoin 0.0125% or 0.025%; oral minoxidil headline dose and price; dutasteride "0.1 mg to 0.6 mg" against one 0.1 mg option).
- The same generic question list is reused across products, so patients are asked things that do not apply (sexual dysfunction and a finasteride warning in the minoxidil form) and not asked things that do.

**Gaps a new competitor could use**

- Recommend before asking for contact details: a short guided consultation that ends in "this is the treatment for you, and why" is something Strut does not offer at all.
- Make safety visible in the form: clear stop or warning screens for heart disease, low blood pressure and pregnancy, and "this may not be pattern hair loss, see a clinician" for patchy or sudden loss. Strut leaves all of this to an unseen review.
- Tell unsuitable patients early. Strut lets them create an account, verify ID and save a card before anyone says no.
- One joined-up route for women, with pregnancy, contraception, menopause and cycle questions. Strut splits women across an old checkout product and a hidden branch of a men's form.
- Ask what Strut never asks: family history, goals, how fast the loss is progressing, treatment preference (tablet or topical), blood pressure, lifestyle. These make a recommendation feel personal.
- Let the consultation choose the dose and step it up, rather than asking the patient to pick 1.25 mg or 2.5 mg.
- Range gaps in Strut's hair-loss collection as listed on 23 Nov 2026: no stand-alone topical minoxidil, no oral spironolactone for women, no devices (laser caps), no cosmetic shampoo or conditioner line beyond prescription ketoconazole, and only one supplement.

## 8. Experiments run (50)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| baseline-us | oral-minoxidil | none (baseline man replayed with locale en-US, time zone America/Chicago) | Identical to the stage 1 baseline: welcome, age, dose picker, 13 questions, warning screen, then "Create account" at 75%. Cart: 2.5 mg, 90 days, $65.00. |
| exp-01-age-under18 | oral-minoxidil | age: 31-45 -> Under 18 | Stop screen "Age Verification" straight after the age question. No dose picker, no cart. Choices: go back or end. |
| exp-25-age-under18-end | oral-minoxidil | age: Under 18, then "End questionnaire" on the stop screen | Browser sent to https://start.struthealth.com/flow/www.struthealth.co: an error page "Oops, you seem lost. The flow you're looking for doesn't exist or is not published." The exit redirect is broken. |
| exp-02-age-18-30 | oral-minoxidil | age: 31-45 -> 18-30 | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-03-age-61plus | oral-minoxidil | age: 31-45 -> 61+ | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-04-dose-1-25 | oral-minoxidil | dose: 2.5 mg (pre-selected) -> 1.25 mg | Cart line changes to "90 Day Supply - 2.5 mg (1.25mg)", total $55.00 instead of $65.00. Questions, wording and end screen identical. |
| exp-05-selfharm-yes | oral-minoxidil | thoughts of hurting yourself: No -> Yes | "Safety Alert" screen (988 and 911) replaces the rest of the form. "Go back and update my answer" returns to the question with "Yes" still ticked. The warning screen, the catch-all question and the account card are not reached. |
| exp-06-surgery-yes | oral-minoxidil | surgeries: No -> Yes (new free-text screen answered with a short fictional note) | One extra screen, "Please describe your surgical history:". Everything else the same; progress bar shows 76% instead of 75% at the account card. |
| exp-07-meds-yes | oral-minoxidil | medicines, vitamins or supplements: No -> Yes (new free-text screen answered with "Vitamin D") | One extra screen, "Please list all current medications, vitamins, and supplements with dosages:". Everything else the same. |
| exp-08-else-yes | oral-minoxidil | anything else for the doctor: No -> Yes (new free-text screen answered neutrally) | One extra screen, "Please share any additional information for your doctor." Then the account card as usual. |
| exp-09-cond-heart-failure | oral-minoxidil | medical conditions: None of the above -> Heart failure or heart disease | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). No warning about oral minoxidil and the heart. |
| exp-10-cond-low-bp | oral-minoxidil | medical conditions: None of the above -> Low blood pressure | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-11-cond-pheo | oral-minoxidil | medical conditions: None of the above -> Pheochromocytoma | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-24-cond-other | oral-minoxidil | medical conditions: None of the above -> Other (text box left empty) | The "Other" tile becomes a one-line text box. Left empty, "Continue" still works. No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-12-allergy-minoxidil | oral-minoxidil | allergies: None of the above -> Minoxidil | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). The form keeps selling minoxidil tablets to a patient who says they are allergic to minoxidil. |
| exp-13-scalp-sudden | oral-minoxidil | scalp symptoms: None of the above -> Sudden hair loss | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-14-symptom-patchy | oral-minoxidil | hair-loss symptoms: Receding hairline + Thinning on the top of the head -> Patchy bald spots only | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-16-mood-yes | oral-minoxidil | concerns about mood, depression, anxiety: No -> Yes | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). The mental health warning screen is the same one everybody sees. |
| exp-15-sexual-yes | oral-minoxidil | sexual dysfunction: No -> Yes | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-17-interest-yes | oral-minoxidil | lost interest or pleasure in the last 2 weeks: No -> Yes | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). Only the self-harm question stops the form. |
| exp-18-duration-1month | oral-minoxidil | how long ago noticed: Over 1 year -> 1 month or less | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-19-tried-oral-minoxidil | oral-minoxidil | treatments tried: None of the above -> Minoxidil oral tablets | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). No follow-up about dose, result or side effects. |
| exp-20-cond-heart-attack | oral-minoxidil | medical conditions: None of the above -> Heart attack or coronary artery disease | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-21-cond-kidney | oral-minoxidil | medical conditions: None of the above -> Kidney disease | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-22-scalp-itch-lesions | oral-minoxidil | scalp symptoms: None of the above -> Itching, pain, burning, or lesions | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| exp-23-symptom-diffuse-shedding | oral-minoxidil | hair-loss symptoms: Receding hairline + Thinning on the top of the head -> Diffuse thinning (all over) only | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). |
| recheck-finasteride-oral | men-finasteride-oral | none: stage 2 re-check of the oral finasteride baseline (page load only) | First screen is still the account card ("See your treatment options": e-mail, phone, consent tick box). Account wall unchanged. |
| recheck-finasteride-topical | finasteride-topical | none: stage 2 re-check of the topical finasteride baseline (page load only) | First screen is still the account card. Account wall unchanged. |
| recheck-dutasteride | dutasteride | none: stage 2 re-check of the dutasteride baseline (page load only) | First screen is still the account card. Account wall unchanged. |
| recheck-women | old-checkout | none: stage 2 re-check of the women's formula baseline (old checkout) | Still redirects straight to checkout.struthealth.com/auth/sign-up (e-mail and phone). Account wall unchanged. |
| exp-26-worst-case | oral-minoxidil | NOT a one-change run. All at once: age 61+, noticed 1 month or less, patchy bald spots, scalp sudden hair loss + bleeding, sexual dysfunction Yes, allergy Minoxidil, conditions heart failure + heart attack + stroke + low blood pressure + pheochromocytoma + kidney disease, mood Yes, lost interest Yes | No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%). So there is no hidden score or cumulative rule: the highest-risk patient the form can describe reaches the account card with oral minoxidil 2.5 mg in the cart. |
| verify-baseline-min | oral-minoxidil | none: stage 3 fresh replay of the oral minoxidil baseline with the standard tools/walk.js (en-US, America/Chicago) | Matches the recorded baseline exactly: 18 distinct screens, same wording and progress values, cart "90 Day Supply - 2.5 mg", $65.00, ends at "Create account" (75%). |
| verify-wall-men-finasteride-oral | men-finasteride-oral | none: stage 3 page load of the oral finasteride form | First screen is still the account card ("See your treatment options": e-mail, phone, consent tick box, Google). Wall confirmed. |
| verify-wall-men-finasteride-topical | finasteride-topical | none: stage 3 page load of the topical finasteride form | First screen is still the account card. Wall confirmed. |
| verify-wall-men-dutasteride | dutasteride | none: stage 3 page load of the dutasteride form | First screen is still the account card. Wall confirmed. |
| verify-wall-women-strut-hair-formula | old-checkout | none: stage 3 page load of the women's formula (old checkout) | Redirects straight to checkout.struthealth.com/auth/sign-up. Wall confirmed. |
| verify-exp-01-age-under18 | oral-minoxidil | age: 31-45 -> Under 18 (re-test of R1) | "Age Verification" stop screen straight after the age question; no dose picker, no cart. R1 confirmed. |
| verify-exp-05-selfharm-yes | oral-minoxidil | thoughts of hurting yourself: No -> Yes, then "Go back and update my answer" (re-test of R4) | "Safety Alert" screen (988, 911); "Go back" returns to the question. R4 confirmed. |
| verify-v-selfharm-continue | oral-minoxidil | thoughts of hurting yourself: No -> Yes, then press "Continue" on the Safety Alert screen without choosing | The form stays on the Safety Alert screen and shows "An answer is required". The alert cannot be passed with "Continue"; the account card is never reached. Confirms R4. |
| verify-exp-04-dose-1-25 | oral-minoxidil | dose: 2.5 mg -> 1.25 mg (re-test of R3) | Cart "90 Day Supply - 2.5 mg (1.25mg)", $55.00; questions identical. R3 confirmed. |
| verify-exp-09-cond-heart-failure | oral-minoxidil | medical conditions: None -> Heart failure or heart disease (re-test of R8) | No change; same 18 screens, $65 cart, "Create account". R8 confirmed. |
| verify-exp-12-allergy-minoxidil | oral-minoxidil | allergies: None -> Minoxidil (re-test of R9) | No change; same 18 screens, $65 cart, "Create account". R9 confirmed. |
| verify-exp-06-surgery-yes | oral-minoxidil | surgeries: No -> Yes (re-test of R5) | One extra free-text screen "Please describe your surgical history:"; progress values shift by 1-2 points; cart and end unchanged. R5 confirmed. |
| verify-exp-25-age-under18-end | oral-minoxidil | age: Under 18, then "End questionnaire" (re-test of R13) | Lands on start.struthealth.com/flow/www.struthealth.co: "Oops, you seem lost". R13 confirmed. |
| verify-v-cond-liver | oral-minoxidil | medical conditions: None -> Liver problems (gap test) | No change; same 18 screens, $65 cart, "Create account". |
| verify-v-cond-stroke | oral-minoxidil | medical conditions: None -> Stroke, on its own (gap test; before only in the combined run) | No change; same 18 screens, $65 cart, "Create account". |
| verify-v-cond-cancer | oral-minoxidil | medical conditions: None -> Breast or prostate cancer (gap test) | No change; same 18 screens, $65 cart, "Create account". |
| verify-v-scalp-bleeding | oral-minoxidil | scalp symptoms: None -> Bleeding, on its own (gap test; before only in the combined run) | No change; same 18 screens, $65 cart, "Create account". |
| verify-v-age-46-60 | oral-minoxidil | age: 31-45 -> 46-60 (gap test; before from code only) | No change; same 18 screens, $65 cart, "Create account". |
| verify-v-woman-baseline-min | oral-minoxidil | baseline woman (31-45, over 1 year, diffuse thinning + thinning on top, no conditions, no medicines) walked through the oral minoxidil form | Identical to the man: same 18 screens, no sex, pregnancy, breastfeeding or contraception question anywhere, oral minoxidil 2.5 mg $65 in the cart, ends at "Create account". |

## 9. Independent verification

For the one form that can be walked anonymously (oral minoxidil), this report is solid: the baseline replayed identically, every consequential rule re-tested live behaved exactly as recorded (two stops, the dose price, the free-text follow-up, and the "no effect" of heart failure and minoxidil allergy), the safety stop cannot be bypassed, and six new gap tests (including a woman) found nothing new. Product names, strengths and prices match the live pages, and the page-versus-form inconsistencies the report flags are real. The conclusion that the forms themselves make no clinical decision is well supported. The weaker parts are labelled honestly: the three walled forms and all old-checkout products (including the women's formula) are known from served code or marketing text only, and nothing about how the provider decides after checkout can be seen. Trust the "observed" and "code" items; treat the "docs" items about provider decisions as Strut's claims, not tested behaviour.

**Re-checked**

- Oral minoxidil baseline replayed fresh with the standard walk tool (runs/verify-baseline-min): identical to runs/baseline-us (18 screens, same wording and progress, 2.5 mg $65, "Create account" at 75%).
- All four account walls re-loaded (runs/verify-wall-*): oral finasteride, topical finasteride and dutasteride forms still open on the account card; the old checkout still redirects to /auth/sign-up.
- R1 under-18 stop: confirmed live (runs/verify-exp-01-age-under18).
- R4 self-harm stop: confirmed live, and "Continue" on the alert gives "An answer is required", so it truly cannot be passed (runs/verify-exp-05-selfharm-yes, runs/verify-v-selfharm-continue).
- R3 dose 1.25 mg -> $55: confirmed live (runs/verify-exp-04-dose-1-25).
- R5 surgeries "Yes" -> one free-text screen: confirmed live (runs/verify-exp-06-surgery-yes).
- R8 heart failure -> no effect: confirmed live (runs/verify-exp-09-cond-heart-failure).
- R9 minoxidil allergy -> no effect: confirmed live (runs/verify-exp-12-allergy-minoxidil).
- R13 "End questionnaire" -> broken "Oops, you seem lost" page: confirmed live (runs/verify-exp-25-age-under18-end).
- R15 (oral finasteride "Female" stop), R16 (topical finasteride "Female" -> women's card) and R17 (dutasteride oral/topical switch): re-read in the saved definitions; the four live form pages were re-fetched on 23 Nov 2026 and carry the same version IDs (…597, …8e6, …5b5, …c87) and the same stop and product-card names, so the code reading still applies.
- Gap tests, each with no effect: age 46-60, liver problems, stroke alone, breast or prostate cancer, bleeding scalp alone (runs/verify-v-*). New rule R25.
- Women's route: a baseline woman walked the oral minoxidil form (runs/verify-v-woman-baseline-min): identical to the man, no sex or pregnancy question. New rule R26 and a new recommendation profile.
- Product facts checked against the live pages (23 Nov 2026): oral finasteride 1 mg $25 for 30 tablets; topical finasteride formula $59 (30 ml); oral dutasteride $39 (0.1 mg compounded or 0.5 mg retail; collection page says 0.1-0.6 mg); topical dutasteride $69; HairfectRx capsules $69 (finasteride 1 mg or dutasteride 0.4 mg, each with minoxidil 5 mg); women's formula $59 (spironolactone 1%, finasteride 0.25%, minoxidil 0-7.5%, tretinoin 0-0.025%, fluocinolone 0.01%); Hair Booster $49 / $99 (latanoprost 0.03% / 0.1%, unisex); ketoconazole 2% shampoo $25 (120 ml); Hairfect combo $33 a month (90 tablets + 180 StrutVite); gel combo $55 a month; dutasteride combo $40 / $60 a month; StrutVite $24.99. All match company.json.
- Catalogue completeness: the live hair-loss collection links exactly the 13 product pages in the catalogue; with the women's topical finasteride card (form only) and StrutVite that makes the 15 products. Nothing missing.
- Evidence labels: every "observed" rule, experiment and recommendation names a run folder that exists.

**Corrected**

- Options "46-60", "Liver problems", "Breast or prostate cancer" upgraded from "code" to "observed"; "Stroke" and "Bleeding" were "observed" only through the combined worst-case run and now have their own one-change runs.
- R2 proof no longer says 46-60 is "from code only"; R14 (untested options) narrowed to what is still untested; R10 extended to "Bleeding" alone.
- Added rules R25 (stage 3 gap tests, no effect) and R26 (a woman gets the same oral minoxidil route as a man), 19 stage 3 experiment entries and a women's recommendation profile.
- p8 oral minoxidil: priceDetail now records that the live page shows $55 next to the 2.5 mg tablets too (the form charges $65), that page and form disagree on retail against compounded, that the audience "both" is inferred, and the $40 fee charged only when a prescription is transferred to another pharmacy.
- Safety Alert question: recorded that its text promises "A physician will still review your questionnaire" although the form cannot continue with "Yes".
- Limitations and coverage note updated with the stage 3 work.

**Still unverified**

- Everything behind the account wall: the oral finasteride, topical finasteride and dutasteride forms (incl. the "Female" stop and the women's topical card, R15-R21), and every screen after "Create account" in the oral minoxidil form. These rest on the served definition only ("code").
- The old-checkout questionnaires, including the only dedicated women's product (Strut Women's Hair Growth Formula), Hair Booster, ketoconazole, HairfectRx capsules and the combos: never seen.
- What the reviewing provider does with any answer (decline, dose change, removing an active); R22 and R23 rest only on Strut's own page wording.
- About 25 single options of the oral minoxidil form (listed under limitations) have still not been replayed on their own; the code shows no branch on them.
- Whether particular free-text wording triggers anything (the definition has no rule on text).
- The help centre (security checkpoint) and third-party accounts of declines were not read.

## 10. Limits of this report

- Only the oral minoxidil form could be tested live. The oral finasteride, topical finasteride and dutasteride forms start with an account card, so their rules come from the served definition ("code"), not from replays.
- What the reviewing provider does with any answer (declines, lowers the dose, removes an active) is not visible anywhere public. "No effect" in this report always means no effect inside the form, not no effect on the final prescription.
- The questionnaires of the old-checkout products, including the main women's product, were not seen at all. No baseline woman could be walked on any route.
- Not replayed on their own in the oral minoxidil form (the definition shows no branch on any of them): durations "Less than 6 months", "6-12 months", "Over 2 years"; symptoms "Thinning at the front hairline", "Thinning at the temples", "Increased shedding"; scalp "Dry skin or dandruff", "Rash"; every "treatments tried" option except "Minoxidil oral tablets"; every allergy except "Minoxidil"; conditions thyroid, BPH, HIV, autoimmune, glaucoma; "Other" on treatments and allergies. Twenty-one single options from the same screens were replayed with no effect, matching the code, so these keep the label "code" with high confidence.
- Free-text answers (surgeries, medicines, anything else) were given one short neutral note each; whether particular words trigger anything is unknown, though the definition has no rule on text.
- Nothing after the account card was tested: address (state availability), identity check, cart, promo codes, payment and the order confirmation are from code only.
- Third-party sources were barely searched (one web search late in stage 2 found nothing about the questionnaire content or declines); the help centre could not be read.
- State availability by product is not published beyond "all states except Arkansas" and "certain medications may not be available in all states".
- Replays used a copy of the shared walk tool with a shorter wait (scripts/walk_fast.js); the baseline was also run with the standard tool and matched. Each replay created an anonymous, unsubmitted form record and a cart session on Strut's side; no account, contact detail, photo, payment or order was ever entered.

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
- [Intake form: oral minoxidil (replayed 27 times in stage 2)](https://start.struthealth.com/f/6aa3d578f415d1603a6e0c85)
- [Old checkout (redirects to sign-up)](https://checkout.struthealth.com/womens-hair-growth-rx-formula?priceId=226)
- [Help centre (blocked by a security checkpoint, not read)](https://support.struthealth.com/hc/en-us)
- [Third-party review used only as a cross-check of topical strengths (not relied on)](https://perfecthairhealth.com/strut-health-review/)
