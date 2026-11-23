# Numan: consultation and product report

**Market:** UK · **Website:** https://www.numan.com/hair-loss · **Checked:** 2026-11-23 · **Owner:** Vir Health Limited (Numan is its trading name; company number 11449267). Registered pharmacy: Numan Operations Limited (GPhC 9011408).

> UK online men's health clinic and pharmacy: an anonymous questionnaire, then the patient picks a subscription product, pays upfront for 3, 6 or 12 months, and a clinician reviews the request after checkout.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** At …/subscribe/hair-loss/<draft id>/profile, after the questionnaire, GP choice, optional email (skippable), product selection, 'what to expect', billing frequency and add-ons. The screen shows the order summary and asks for email, password, legal name, date of birth, phone, sex and delivery address. The full recommendation and all plan prices are visible before it. Direct purchase of Rosemary Oil hits the same form on its first screen.

Stage 1 (map). The browser was not blocked. All 29 questions of the live men's questionnaire were reached and saved with every option; the served data also gives the engine result of every option (proceed, reject with message, clinician query with internal note). The baseline man was walked to the account wall twice (main link and Regaine link). One stop screen (under 18) was opened. The product filter was read in the served JavaScript and seen once in an all-flags walk. Not done: one-change tests of most options (stage 2), anything after the account wall, and any women's flow (none exists). robots.txt disallows /subscribe for crawlers; the walks were single, slow, human-style sessions and each consultation start created one anonymous draft on Numan's side (eight confirmed in the network logs, possibly nine).

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

Numan's engine has three layers. (1) A server-driven question tree: the browser asks api.numan.com for one question at a time and each answer returns the next question id. Five answers end the consultation at once (under 18; patchy loss; complete loss; sudden onset; and 'No' from a man of 65 or over). (2) A small set of engine flags computed on the server after every answer (finasteride eligible, minoxidil eligible, allergy to each). The selection screen hides every product containing a drug that is ruled out and then features one product: the three-part kit by default, the product named in the entry link if there was one, otherwise the first product left. The patient can always open the full list and choose something else, and a cosmetic oil is always left even when both drugs are ruled out. (3) Many answers do not change the screen at all: they attach a 'query clinically' note, with written instructions, for the clinician who reviews the order after checkout. Pattern severity, the preference question and age over 65 do not appear to change the offer.

## 3. Engine rules (11)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men | men-what_is_your_age = 'Under 18' | Consultation stops on a 'No suitable treatment' screen that tells him to contact his doctor and offers clinic@numan.com. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil))_ | Stops the patient | observed | high |
| R2 | men | men-which_image_best_matches_your_hair_loss = 'Patchy' or 'Complete'; or men-when_did_you_notice = 'Over the last few days or weeks'; or men-sixty_five_and_over_confirmation = 'No' | Each of these four options carries a 'reject' result with its own patient message in the served definition, so each stops the consultation. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil))_ | Stops the patient | code | high |
| R3 | men | engine flag isFinasterideEligible is false, or hasAllergyToFinasteride is true | The selection screen hides every product on the JS finasteride list: both kits with tablets, the combination kit, Triple-Action Spray and Finasteride (the list also names retired codes). Exception: the product named in the entry link is never hidden. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ | Removes a product | code | high |
| R4 | men | engine flag isMinoxidilEligible is false, or hasAllergyToMinoxidil is true | The selection screen hides every product on the JS minoxidil list: all three kits, Triple-Action Spray, Extra Strength Spray and Regaine. Same exception for the entry product. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ | Removes a product | code | high |
| R5 | men | both finasteride and minoxidil are ruled out (in the run: both allergies ticked, all four scalp symptoms, all six cautions) | Only Rosemary Oil is offered, as the featured card with the badge 'Most effective' at £14.00. The built-in 'unable to offer treatment' message did not appear because the oil is on neither hide-list. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ | Removes a product | observed | medium |
| R6 | men | men-who_manages_your_mental_health = 'Psychiatrist/Specialist/Consultant' | isFinasterideEligible becomes false (and returns to true if the answer is changed to GP); the rest of the mental-health branch is skipped and the case carries a clinician note asking for specialist pre-approval. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ | Removes a product | observed | medium |
| R7 | men | men-have_any_scalp_issues has all four symptoms ticked | isMinoxidilEligible becomes false. Which single symptom is enough is not yet known (three of the four carry a clinician note saying minoxidil is unsuitable with an active scalp condition). _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ | Removes a product | observed | medium |
| R8 | men | nothing is hidden and the entry link names no product | The featured card is the three-part kit (Medicated Spray, Finasteride & Supplement) with the badge 'Most effective'; the other seven products sit behind 'See all treatments' in position order. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro))_ | No effect | observed | high |
| R9 | men-product-entry | the consultation is entered through /subscribe/hair-loss/<product> (seen with regaine) | That product is the featured card with the badge 'Recommended for you'; everything else, including the kits, moves under 'See all treatments'. The choice is remembered in the browser (localStorage vuex_production → subscribe.selectedProductSlug), so tests must start from a clean browser. _(affects: Regaine for Men Extra Strength 5% (code: regaine))_ | Switches product | observed | high |
| R10 | men | a group is hidden and the three-part kit is therefore gone | By the JS the featured card becomes the first remaining product by position: Finasteride when only minoxidil is ruled out, Extra Strength Spray when only finasteride is ruled out. The badge reads 'Recommended for you' for Finasteride, Extra Strength Spray or Regaine when that drug is eligible and not an allergy; otherwise 'Most effective'. _(affects: Finasteride 1 mg tablets (code: finasteride), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil))_ | Switches product | code | medium |
| R11 | men | any option whose served result has query_clinically (other pattern; either drug allergy; no lactose at all; scalp pain/itching, red rinds, psoriasis/eczema; 'No' to topical with dandruff; body hair loss; specialist-managed mental health; dose change; either answer on suicidal thoughts; 'I have' a medical history) | The patient still proceeds and can still pick a product, but the questionnaire is marked for clinician query, often with a written instruction for the reviewing clinician. The decision is therefore made by a person after checkout, not by the quiz. | Flags for the clinician | code | high |

## 4. Products (9)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro)](https://www.numan.com/subscribe/hair-loss) | bundle | minoxidil (Extra Strength / 'Medicated' Spray) 6% scalp solution, 1 ml (6 sprays) twice a day; finasteride 1 mg tablet once a day; Hair Growth Support supplement vitamin A 1000 µg, vitamin C 80 mg, vitamin E 10.2 mg, biotin 200 µg, selenium 55 µg, grape seed extract 50 mg; 1 tablet a day | kit: spray bottle + tablets + supplement tablets | men | Prescription kit. Finasteride 1 mg tablets: licensed POM. Minoxidil 6% spray: POM, unlicensed medicine (Numan's help centre says so; who makes it is not stated). Supplement: food supplement. | £40 a month, billed and delivered quarterly (£120 for 3 kits) (Billed six-monthly £36 a month (£216 per 6 months), billed annually £32 a month; all still delivered every 3 months (observed on the billing screen). A monthly-delivery variant exists in the API at £48 a kit. First-orde…) | Featured as 'Most effective' whenever neither finasteride nor minoxidil has been ruled out and the patient did not arrive through a product-specific link (observed for the baseline man; rule read in the product-selection JS). Hidden if either drug is ruled out. | observed |
| [Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit)](https://www.numan.com/subscribe/hair-loss) | bundle | minoxidil (Extra Strength / 'Medicated' Spray) 6% scalp solution, 1 ml twice a day; finasteride 1 mg tablet once a day | kit: spray bottle + tablets | men | Prescription kit. Finasteride 1 mg: licensed POM. Minoxidil 6% spray: POM, unlicensed medicine. | £36 a month, billed and delivered quarterly (£108 for 3 kits) (From the variant data in the API (not seen on a billing screen): six-monthly billing £32 a month, annual £28 a month; monthly-delivery variant £44 a kit. First-order code HL-ORGANIC-50OFF (in the site's own 'Get started…) | Listed under 'See all treatments' for the baseline man. The JS features it only if the three-part kit is not on offer but this one is; hidden if either drug is ruled out. | observed |
| [Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit)](https://www.numan.com/subscribe/hair-loss) | bundle | minoxidil 10%; azelaic acid 5%; finasteride (topical) 0.1%; Hair Growth Support supplement 1 tablet a day | kit: one combined scalp spray (1 ml once a day) + supplement tablets | men | Prescription kit. Combination (Triple-Action) Spray: POM, unlicensed medicine (help centre). Supplement: food supplement. | £40 a month, billed and delivered quarterly (£120 for 3 kits) (From the API variant data: six-monthly £36 a month, annual £32 a month; monthly-delivery variant £48. First-order code HL-ORGANIC-50OFF (in the site's own 'Get started' links): the banner says 'Save 50% off your first o…) | Listed under 'See all treatments' for the baseline man; hidden if either finasteride or minoxidil is ruled out (JS). | observed |
| [Finasteride 1 mg tablets (code: finasteride)](https://www.numan.com/hair-loss/finasteride) | rx-oral | finasteride 1 mg | tablet, one a day (packs of 28; 84 for a quarter) | men | POM, licensed generic (Numan describes it as the generic of Propecia). Tablets contain lactose. | £28 a month, billed and delivered quarterly (84 tablets for £84 = £1.00 a tablet) (From the API variant data: six-monthly £24 a month, annual £20 a month; monthly variant 28 tablets £34 (£1.21 a tablet). First-order code HL-ORGANIC-50OFF (in the site's own 'Get started' links): the banner says 'Save 5…) | Listed under 'See all treatments' for the baseline man. By the JS it becomes the featured product when minoxidil is ruled out but finasteride is not (first remaining product by position); hidden when finasteride is ruled out. Not yet observed alone. | observed |
| [Triple-Action Spray, also called Combination Spray (code: triple-action-spray)](https://help.numan.com/en/articles/9929731-combination-spray) | rx-topical-compounded | minoxidil 10%; azelaic acid 5%; finasteride 0.1% | scalp solution spray, 6 sprays (1 ml) once a day | men | POM, unlicensed medicine (help centre: 'Combination Spray is an unlicensed medication'). | £36 a month, billed and delivered quarterly (£108 for 3 bottles) (From the API variant data: six-monthly £32 a month, annual £28 a month; monthly variant £44 a bottle. First-order code HL-ORGANIC-50OFF (in the site's own 'Get started' links): the banner says 'Save 50% off your first o…) | Listed under 'See all treatments' for the baseline man; hidden if either finasteride or minoxidil is ruled out (JS). | observed |
| [Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil)](https://www.numan.com/hair-loss/minoxidil) | rx-topical-compounded | minoxidil 6% | scalp solution spray, 6 sprays (1 ml) twice a day | men | POM, unlicensed medicine (help centre: 'Minoxidil (6%) is an unlicensed medication'). The marketing page /hair-loss/minoxidil says licensed minoxidil is 2% and 5% and that 6% needs a clinician. | £30 a month, billed and delivered quarterly (£90 for 3 bottles) (From the API variant data: six-monthly £26 a month, annual £22 a month; monthly variant £38 a bottle. First-order code HL-ORGANIC-50OFF (in the site's own 'Get started' links): the banner says 'Save 50% off your first o…) | Listed under 'See all treatments' for the baseline man. By the JS it becomes the featured product when finasteride is ruled out but minoxidil is not; hidden when minoxidil is ruled out. Not yet observed alone. | observed |
| [Regaine for Men Extra Strength 5% (code: regaine)](https://www.numan.com/hair-loss/regaine) | otc-medicine | minoxidil 5% (50 mg/ml) | scalp solution with three applicators, 1 ml twice a day (API variant name '5% (60ml)'; the help article says 50 ml a bottle; the hair-loss landing page calls it 'branded minoxidil foam') | men | Licensed branded medicine that does not need a prescription (Numan's minoxidil page calls the licensed strengths 'pharmacy medicines'). Numan still sells it only through the consultation (API: prescription_required true, questionnaire_required true). | £65 a month, billed and delivered quarterly (£195 for 3 bottles) (Six-monthly £57 a month (£342 per 6 months), annual £48 a month (observed on the billing screen in the Regaine run); monthly variant £80 a bottle. First-order code HL-ORGANIC-50OFF (in the site's own 'Get started' links…) | Featured as 'Recommended for you' when the patient arrives through /subscribe/hair-loss/regaine (observed); otherwise under 'See all treatments'. Hidden when minoxidil is ruled out, unless it was the entry product (JS). | observed |
| [Rosemary Oil (code: rosemary-oil)](https://www.numan.com/hair-loss/rosemary-oil) | cosmetic | rosemary leaf oil with argan, sweet almond, flaxseed, castor seed and avocado oils 100 ml bottle, 10-12 drops a day | scalp oil with pipette | both | Cosmetic (API: medicine false, prescription_required false, questionnaire_required false; age 18-70, any sex). | £28 a bottle a month; or 3 bottles every 3 months for £70 (£23.33 a month) (Direct 'Buy now' link uses code HL-ROSEMARY-50OFF: first bottle £14 (observed order summary). Inside the consultation it showed £14.00 (was £23.33), 'Save 40%'. Also offered as an add-on at £21.00 (was £28.00).) | Always offered. It is in neither hide-list in the JS, so it is the only product left (and is then badged 'Most effective') when both finasteride and minoxidil are ruled out (observed in runs/s2-men-explore). Can be bought directly with no questions. | observed |
| [Hair Growth Support / Hair Support supplement (code: hair-growth-support, supplements category)](https://www.numan.com/supplements/hair-support) | supplement | vitamin A 1000 µg; vitamin C 80 mg; vitamin E 10.2 mg; biotin 200 µg; selenium 55 µg; grape seed extract 50 mg | tablet, one a day | both | Food supplement (no questionnaire, no prescription). Contains vitamin A: not for anyone pregnant, likely to become pregnant or breastfeeding. Not suitable for vegetarians or vegans. | £28 a bottle a month (Every 3 months £59 (£19.67 a month), every 6 months £100 (£16.67 a month), every 12 months £152 (£12.67 a month) (observed shipping-frequency screen; matches API). Code SUPP-ORGANIC-50OFF halves the first order (£14). A…) | Not chosen by the consultation. Sold on its own (straight to checkout), inside two of the kits, and as the first 'Most popular' add-on after billing. | observed |

## 5. Who gets what (4 patient profiles)

- **Baseline man: 18-65, temples and crown, gradual, no allergies, no scalp symptoms, none of the cautions, 'Effectiveness of the product', no medical history, GP not informed, entered through /subscribe/hair-loss** → Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil) (default: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro)). Featured card 'Most effective': Hair Kit - Medicated Spray, Finasteride & Supplement at £26.67 a month after the first-order code ('Save 33%'). The other seven appear after 'See all treatments'. Six-monthly billing is pre-selected on the next screen. _[observed]_
- **Same man, entered through /subscribe/hair-loss/regaine** → Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil) (default: Regaine for Men Extra Strength 5% (code: regaine)). Regaine featured as 'Recommended for you' at £51.67. _[observed]_
- **Man with both drug allergies, every scalp symptom and every caution ticked (mapping walk)** → Rosemary Oil (code: rosemary-oil) (default: Rosemary Oil (code: rosemary-oil)). Rosemary Oil only, badged 'Most effective'. No medicine offered and no stop screen. _[observed]_
- **Woman** → Rosemary Oil (code: rosemary-oil), Hair Growth Support / Hair Support supplement (code: hair-growth-support, supplements category) (default: Rosemary Oil (code: rosemary-oil)). There is no women's hair-loss consultation. The only consultation asks the patient to confirm male sex at birth, every medicine variant is marked male-only in the API, and the public pages say finasteride, Regaine for Men and the sprays are not for women. A woman can buy the cosmetic oil and the supplement (not if pregnant, likely to become pregnant or breastfeeding) directly. Not walked past the account form. _[code]_

## 6. The consultation, question by question

### Men's hair-loss consultation (questionnaire 'hair_loss', version 14, revision 'smart')

Entry: https://www.numan.com/subscribe/hair-loss

Consent screen → 8 to 28 anonymous questions out of a bank of 29 (the baseline man sees 8) → GP-notification choice → optional email (skippable) → product selection (the recommendation) → 'what to expect' → billing frequency → add-ons → ACCOUNT WALL at …/profile (order summary + create account + address) → payment, identity check and clinician review (not tested).

**0. The really important bit. By clicking “Next”, you are confirming that you: Are completing this consultation for yourself and to the best of your knowledge. Were assigned male at birth. Will disclose any serious illnesses or operations you have had or any prescription medication you currently take. Will only use one method of hair loss treatment at a time and will not combine more than one different medication for the condition. Are aware that finasteride is associated with depression, suicidal thoughts, and sexual dysfunction including decreased sex drive, erectile dysfunction, and ejaculation problems. These side effects can occur independently of each other and may persist after stopping treatment. A clinician will review your suitability before any prescription is issued. Will answer the questions in the next section about your physical and mental health history honestly, and are aware that your responses are reviewed by a prescribing clinician and kept confidential. Are aware that you should not take finasteride if you’re trying for a baby. Are aware that you may be prescribed an unlicensed treatment. Are accepting our Terms & Conditions and Terms of Sale.**  
_consent · anonymous · role: consent · shown: always (entry screen of every hair-loss consultation link) · no branch · observed_  
Why they ask: Consent, declaration of male sex at birth, finasteride risk warnings and notice that an unlicensed medicine may be prescribed.

- `Next` → **Next question**: Creates an anonymous draft on Numan's server (POST api.numan.com/v1/subscriptions, status 'draft', questionnaire hair_loss version 14, revision 'smart') and opens the first question. Sex is never asked as a question: being assigned male at birth is asserted here. _[observed]_

**1. Please tell us your age.**  
_single · anonymous · role: eligibility-gate · shown: always (first question) · BRANCHES · observed_  
Why they ask: Age gate. Under-18s are refused; 65 and over get an extra confirmation.  
Downstream: Under 18 stops; 65 or over adds one question.

- `65 or over` → **Adds questions**: Adds one extra question asking whether he still wants to be considered (see next question). No stop on its own. _[observed]_
- `18 - 65` → **Next question**: Goes on to the hair-loss pattern question. _[observed]_
- `Under 18` → **Stops the patient**: Stops the consultation. Screen 'No suitable treatment': "The safety of our patients is our top priority. Unfortunately, as hair loss under the age of 18 could be a sign of an underlying condition, we’re unable to recommend a hair loss treatment for you. Please contact your doctor for advice." plus an invitation to email clinic@numan.com, a 'Review your answers' button and 'Back to homepage'. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil))_ _[observed]_

**2. Hair loss products are not guaranteed to show results in individuals over the age of 65, however, there is still a possibility for hair growth to reoccur. Would you still like to be considered for treatments?**  
_single · anonymous · role: expectation-setting · shown: age = 65 or over · BRANCHES · observed_  
Why they ask: Sets expectations for older men and lets them opt out.  
Downstream: No stops the consultation.

- `Yes` → **Next question**: Carries on with the normal questions. No clinician flag in the definition and no change in the engine flags. _[observed]_
- `No` → **Stops the patient**: Stops: "Unfortunately, we’re unable to recommend a hair loss treatment for you. Please contact your doctor for advice." (reject result in the served definition; not clicked). _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil))_ _[code]_

**3. What kind of hair loss do you have?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Picture-based pattern check (seven drawings) to confirm male pattern hair loss and screen out patchy or complete loss.  
Downstream: Patchy and Complete stop; Other adds a free-text question and a clinician flag.

- `Temples` → **Next question**: Proceeds. No clinician flag. The served product-selection code does not read this answer, so it should not change which products are shown (not yet tested). _[code]_
- `Temples and Crown` → **Next question**: Proceeds to the onset question. Baseline answer. _[observed]_
- `Moderate` → **Next question**: Proceeds. No clinician flag in the definition (not yet tested). _[code]_
- `Extensive` → **Next question**: Proceeds. No clinician flag in the definition (not yet tested). _[code]_
- `Patchy` → **Stops the patient**: Stops: "Defined circular areas of hair loss on the head may suggest a form of alopecia, therefore it is best to consult your GP so they can investigate." (reject result in the definition). _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil))_ _[code]_
- `Complete` → **Stops the patient**: Stops: "Our treatments are not effective in individuals who have experienced complete hair loss." (reject result in the definition). _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil))_ _[code]_
- `Other hair loss pattern` → **Flags for the clinician**: Adds a free-text question about the hair loss and flags the case for a clinician. Internal note served with the option: finasteride is unlikely to work outside male pattern loss, minoxidil may; prescribing is case by case; the team may send a 'further information needed' message. _[observed]_

**4. Please tell us about your hair loss: can you describe the appearance of your hair loss; do you have a diagnosis for your hair loss?; for how long has it occurred?; has anything made it better or worse, such as stress?; do you have any other symptoms?. This information is needed so that our clinicians can ensure the prescription is safe for you to take.**  
_text · anonymous · role: diagnosis · shown: pattern = Other hair loss pattern · no branch · observed_  
Why they ask: Free-text description for the clinician when the pattern does not match the drawings.


**5. When did you start to notice your hair loss?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Screens out sudden hair loss, which needs a GP.  
Downstream: Sudden onset stops the consultation.

- `Over the last few days or weeks` → **Stops the patient**: Stops: "…our treatments are not suitable for you because they are not designed for sudden hair loss. Sudden hair loss can have a number of causes and we recommend you seek advice from your usual GP…" (reject result in the definition). _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil))_ _[code]_
- `My hair loss started gradually over the last few months or years` → **Next question**: Proceeds to the allergy question. _[observed]_

**6. Do you have an allergy or intolerance to any of the following?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Drug allergy and lactose screen. This is the main automatic product filter.  
Downstream: Minoxidil or finasteride allergy adds a reaction question and removes that drug's products; lactose adds a tolerance question.

- `I am allergic to minoxidil` → **Removes a product**: Sets the engine flag hasAllergyToMinoxidil (seen in the flags call). The product-selection JS then hides every minoxidil-containing product. Also adds a free-text 'how do you react' question and marks the case for clinician query. Seen only together with other answers so far. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ _[code]_
- `I am allergic to finasteride` → **Removes a product**: Sets hasAllergyToFinasteride. The product-selection JS then hides every finasteride-containing product (tablets, both kits with tablets, and the sprays that contain finasteride). Also adds the free-text reaction question and a clinician query. Seen only together with other answers so far. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ _[code]_
- `I have a lactose intolerance or allergy` → **Adds questions**: Adds the lactose tolerance question (finasteride tablets contain lactose). No flag by itself. _(affects: Finasteride 1 mg tablets (code: finasteride), Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit))_ _[observed]_
- `I am not allergic to any of the above` → **Next question**: Exclusive option. Proceeds to the scalp question. _[observed]_

**7. Please let us know how you react when you take this medicine**  
_text · anonymous · role: safety-screen · shown: minoxidil and/or finasteride allergy ticked (seen with both ticked; not yet separated) · no branch · observed_  
Why they ask: Free-text description of the allergic reaction for the clinician.


**8. Finasteride tablets contain very small amounts of lactose. If you have taken a tablet formulation before without experiencing symptoms, it is unlikely that you will get undesirable effects from the lactose within our tablets.**  
_single · anonymous · role: safety-screen · shown: lactose intolerance or allergy ticked · no branch · observed_  
Why they ask: Checks whether trace lactose in finasteride tablets is acceptable.

- `I can’t tolerate any amount of lactose and I would like to be considered for non-lactose containing preparations only` → **Flags for the clinician**: Flags the case for a clinician. Internal note: confirm the request is for a treatment without lactose; if tablets were requested, contact the patient and offer alternatives. The engine flags did not change, so tablets are not hidden automatically. _(affects: Finasteride 1 mg tablets (code: finasteride), Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit))_ _[observed]_
- `I can tolerate very small amounts of lactose` → **Next question**: Proceeds, no flag in the definition (not clicked). _[code]_

**9. Are you experiencing any of the following symptoms on your scalp?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Scalp-condition screen; active scalp disease is a reason not to use minoxidil.  
Downstream: Each ticked symptom adds its own follow-up; the combined answer switched minoxidil off.

- `Pain, itching, burning or bumps` → **Flags for the clinician**: Adds a free-text follow-up and flags the case. Internal note: may be psoriasis, dermatitis or another scalp condition; minoxidil is not suitable unless the patient confirms there is no active condition. When all four scalp options were ticked together the engine set isMinoxidilEligible to false; which option does that is not yet separated. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ _[code]_
- `Red rinds or rashes` → **Flags for the clinician**: Adds a free-text follow-up and flags the case, with the same internal note about minoxidil and active scalp conditions. Part of the combined answer that set isMinoxidilEligible to false. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ _[code]_
- `Dandruff` → **Adds questions**: Adds a follow-up asking whether he still wants topical treatments. No flag by itself in the definition. _[observed]_
- `Psoriasis or eczema` → **Flags for the clinician**: Adds a free-text follow-up and flags the case. Internal note: minoxidil is not suitable with an active scalp condition such as eczema or psoriasis. Part of the combined answer that set isMinoxidilEligible to false. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ _[code]_
- `No` → **Next question**: Exclusive option. Proceeds to 'Are any of the following true?'. _[observed]_

**10. You mentioned you have pain, itching, burning or bumps on your scalp. Have they been seen to or treated by a doctor?; If so, what treatments have you received?; Please give us a detailed description of your scalp condition below (including how long you’ve had it, its appearance and any other symptoms it is causing)**  
_text · anonymous · role: safety-screen · shown: scalp: 'Pain, itching, burning or bumps' ticked · no branch · observed_  
Why they ask: Free-text detail about scalp pain, itching, burning or bumps for the clinician.


**11. You mentioned you have red rinds or rashes on your scalp. Have they been seen to or treated by a doctor?; If so, what treatments have you received?; Please give us a detailed description of your scalp condition below (including how long you’ve had it, its appearance and any other symptoms it is causing).**  
_text · anonymous · role: safety-screen · shown: scalp: 'Red rinds or rashes' ticked · no branch · observed_  
Why they ask: Free-text detail about red rinds or rashes for the clinician.


**12. Topical formulations (such as spray) may worsen dandruff. Would you still like to be considered for topical treatments?**  
_single · anonymous · role: product-selector · shown: scalp: 'Dandruff' ticked · no branch · observed_  
Why they ask: Warns that sprays may worsen dandruff and asks whether topical treatment is still wanted.

- `Yes` → **Next question**: Proceeds, no flag. _[observed]_
- `No` → **Flags for the clinician**: Flags the case. Internal note: confirm the request is not for a topical treatment; if it is, contact the patient. Whether topical products are also hidden is not yet tested. _[code]_

**13. You mentioned you have eczema or psoriasis on your scalp. Have they been seen to or treated by a doctor?; If so, what treatments have you received?; Please give us a detailed description of your scalp condition below (including how long you’ve had it, its appearance and any other symptoms it is causing)**  
_text · anonymous · role: safety-screen · shown: scalp: 'Psoriasis or eczema' ticked · no branch · observed_  
Why they ask: Free-text detail about scalp psoriasis or eczema for the clinician.


**14. Are any of the following true?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: One screen for six cautions: body hair loss, prostate monitoring or cancer, blood pressure, asthma, trying for a baby, mental health.  
Downstream: Each ticked item opens its own follow-up; 'No - none' skips eleven questions.

- `I have noticed hair loss on other areas of my body other than my head.` → **Flags for the clinician**: Adds a free-text follow-up and flags the case. Internal note: finasteride is unlikely to work in conditions other than male pattern baldness; minoxidil may; decide case by case. _[observed]_
- `I am undergoing PSA (prostate) monitoring or I have previously been diagnosed with prostate cancer.` → **Adds questions**: Adds the PSA follow-up (must tell his GP he takes finasteride; may opt out of finasteride). _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ _[observed]_
- `I have been diagnosed with high or low blood pressure.` → **Adds questions**: Adds the blood-pressure follow-up (minoxidil may lower blood pressure further; may opt out of minoxidil). _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ _[observed]_
- `I have been diagnosed with asthma.` → **Adds questions**: Adds the asthma follow-up (alcohol-based sprays may worsen asthma; may opt out of topical products). _[observed]_
- `I plan on trying for a baby in the next 12 weeks.` → **Adds questions**: Adds the fertility follow-up (stop finasteride 12 weeks before trying; may opt out of finasteride). _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ _[observed]_
- `I have previously experienced, or am currently experiencing, depression, anxiety or panic disorders` → **Adds questions**: Starts the mental-health branch: mood-risk question, then who manages the condition, medicines, recent dose changes and suicidal thoughts. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ _[observed]_
- `No - none` → **Skips questions**: Exclusive option. Skips all eleven follow-ups and goes to the 'most important' question. _[observed]_

**15. Please tell us about hair loss in areas other than your head. This information is needed so that our clinicians can ensure the prescription is safe for you to take.**  
_text · anonymous · role: diagnosis · shown: 'hair loss on other areas of my body' ticked · no branch · observed_  
Why they ask: Free-text detail about hair loss elsewhere on the body.


**16. If you wish to be considered for finasteride you must tell your GP that you are taking finasteride so that they can interpret your results accordingly.**  
_single · anonymous · role: product-selector · shown: 'PSA (prostate) monitoring or … prostate cancer' ticked · no branch · observed_  
Why they ask: Tells men under prostate monitoring that finasteride changes PSA results; lets them opt out of finasteride.

- `I understand and would like to be considered for finasteride containing preparations.` → **Next question**: Proceeds; engine flags unchanged. _[observed]_
- `I do not wish to be considered for finasteride containing preparations.` → **Unknown**: Not yet tested. The definition only says 'proceed' with no clinician flag; by its wording it should rule finasteride products out. _[unknown]_

**17. Taking minoxidil alongside your regular blood pressure medication may cause your blood pressure to decrease further, potentially causing light-headedness, dizziness and fainting.**  
_single · anonymous · role: product-selector · shown: 'diagnosed with high or low blood pressure' ticked · no branch · observed_  
Why they ask: Warns that minoxidil can lower blood pressure further; lets him opt out of minoxidil.

- `I understand that minoxidil may lower my blood pressure and would like to be considered for minoxidil.` → **Next question**: Proceeds; engine flags unchanged. _[observed]_
- `I do not wish to be considered for minoxidil.` → **Unknown**: Not yet tested. The definition only says 'proceed'; by its wording it should rule minoxidil products out. _[unknown]_

**18. Topical formulations (such as spray) may contain alcohol, inhaling this spray may worsen your asthma symptoms and cause you to become short of breath.**  
_single · anonymous · role: product-selector · shown: 'diagnosed with asthma' ticked · no branch · observed_  
Why they ask: Warns that alcohol-based sprays can worsen asthma; lets him opt out of topical products.

- `I understand that topical formulations (such as spray) may worsen my asthma and would like to be considered topical formulations.` → **Next question**: Proceeds; engine flags unchanged. _[observed]_
- `I do not wish to be considered for topical formulations (such as spray).` → **Unknown**: Not yet tested. The definition only says 'proceed'; by its wording it should rule the sprays out. _[unknown]_

**19. Traces of finasteride have been found in the semen (which could affect the feotus), it is advised to stop taking finasteride 12 weeks prior to trying for a baby.**  
_single · anonymous · role: product-selector · shown: 'plan on trying for a baby in the next 12 weeks' ticked · no branch · observed_  
Why they ask: Fertility warning for finasteride; lets him opt out of finasteride.

- `I would like to be considered for finasteride and will stop taking finasteride 12 weeks prior to trying for a baby.` → **Next question**: Proceeds; engine flags unchanged. _[observed]_
- `I do not wish to be considered for preparations containing finasteride.` → **Unknown**: Not yet tested. The definition only says 'proceed'; by its wording it should rule finasteride products out. _[unknown]_

**20. Mood alterations including depressed mood, depression and, less frequently, suicidal ideation have been reported in patients treated with finasteride.**  
_single · anonymous · role: product-selector · shown: 'depression, anxiety or panic disorders' ticked · BRANCHES · observed_  
Why they ask: Finasteride mood-risk warning; he accepts the risk or asks for minoxidil only.  
Downstream: Accepting the risk opens the rest of the mental-health branch.

- `I accept the risk that finasteride can lead to detrimental effects on my mood and would like to be considered for finasteride and/or minoxidil.` → **Adds questions**: Continues the mental-health branch (who manages the condition). _[observed]_
- `I would like to proceed with a minoxidil only treatment plan.` → **Unknown**: Not yet tested. The definition only says 'proceed'; by its wording it should rule finasteride products out and may skip the rest of the mental-health branch. _[unknown]_

**21. Who manages your mental health condition?**  
_single · anonymous · role: safety-screen · shown: mood question = accept the finasteride risk · BRANCHES · observed_  
Why they ask: Finds out whether a specialist or the GP manages the condition.  
Downstream: Specialist switches finasteride off and skips the rest of the branch; GP continues.

- `Psychiatrist/Specialist/Consultant` → **Removes a product**: The engine flag isFinasterideEligible turned false straight after this answer and turned true again when the answer was changed to GP (runs/s2-men-explore). By the product-selection JS that hides all finasteride-containing products. It also skips the remaining mental-health questions and flags the case. Internal note: the specialist should be informed and confirmation given to Numan before finasteride is started. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ _[code]_
- `GP` → **Adds questions**: Continues: asks which mental-health medicines he takes. Finasteride stays eligible. _[observed]_

**22. What medications do you take for your mental health condition?**  
_text · anonymous · role: safety-screen · shown: who manages = GP · no branch · observed_  
Why they ask: Free-text list of mental-health medicines for the clinician.


**23. Have the doses of your medications changed in the last 3 months?**  
_single · anonymous · role: safety-screen · shown: who manages = GP (after the medicines question) · BRANCHES · observed_  
Why they ask: Checks whether the condition is stable.  
Downstream: Yes adds a free-text list and skips the suicidal-thoughts question; No goes to it.

- `Yes` → **Flags for the clinician**: Adds a free-text list of the changes, flags the case and skips the suicidal-thoughts question. Internal note: a recent dose change suggests the condition may not be stable; the patient should provide a GP letter approving finasteride. Engine flags unchanged. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ _[observed]_
- `No` → **Next question**: Goes to the suicidal-thoughts question. _[observed]_

**24. Please tell us which medications have been changed, your previous dose and your current dose.**  
_text · anonymous · role: safety-screen · shown: dose changed in the last 3 months = Yes · no branch · observed_  
Why they ask: Free-text detail of the dose changes.


**25. Have you had any suicidal thoughts or feelings of self-harm in the past year?**  
_single · anonymous · role: safety-screen · shown: dose changed in the last 3 months = No · no branch · observed_  
Why they ask: Suicidal-thoughts screen before finasteride.

- `Yes` → **Flags for the clinician**: Proceeds but flags the case. Internal note: 'Finasteride should not be prescribed for patients with suicidal ideation within the past year… consider them for non-finasteride containing preparations only.' Whether the selection screen also hides finasteride is not yet tested. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ _[code]_
- `No` → **Flags for the clinician**: Proceeds. Internal note: if finasteride is prescribed to anyone with a mental-health history, send the post-approval safety-net message. Engine flags unchanged (runs/s4-men-mentalhealth). _[observed]_

**26. What’s most important to you when choosing a hair loss product? (Select all that apply)**  
_multi · anonymous · role: data-capture · shown: always · no branch · observed_  
Why they ask: Preference question. Nothing served to the browser uses the answer, so it appears to be for data capture or marketing.

- `Effectiveness of the product` → **No effect**: No change seen in the engine flags; the featured product was the three-part kit. The product-selection JS sets a 'checkMostImportantAnswers' switch but never reads it, so this looks like data capture. Baseline answer. _[observed]_
- `Minimal side effects` → **Unknown**: Not yet tested. Nothing in the definition or the served JS uses it. _[unknown]_
- `Scalp-friendly options` → **Unknown**: Not yet tested. Nothing in the definition or the served JS uses it. _[unknown]_
- `All of the above` → **No effect**: Exclusive option. No change seen in the engine flags (chosen in runs/s2-men-explore, alongside many other answers). _[observed]_

**27. It's really important to tell us about: Major illnesses; Ongoing medical conditions; Any medication prescribed or over the counter that you take; Allergies to medication; Operations. This information is needed so that our clinicians can ensure the prescription is safe for you to take.**  
_single · anonymous · role: safety-screen · shown: always (last fixed question) · BRANCHES · observed_  
Why they ask: Catch-all gate for other illnesses, operations, allergies and medicines.  
Downstream: 'I have…' adds two free-text questions and a clinician query; 'I do not…' ends the questionnaire.

- `I have a major illness, ongoing medical condition, operation, allergy to medication or take prescribed or over the counter medication to tell you about.` → **Flags for the clinician**: Adds two free-text questions (conditions, then all medicines) and marks the case for clinician query. _[observed]_
- `I do not have a major illness, ongoing medical condition, operation, allergy to medication or take prescribed or over the counter medication to tell you about.` → **Next question**: Completes the questionnaire. _[observed]_

**28. Please tell us about your major illness, ongoing medical condition, allergy, or operation you've had. This information is needed so that our clinicians can ensure the prescription is safe for you to take.**  
_text · anonymous · role: safety-screen · shown: medical history = I have… · no branch · observed_  
Why they ask: Free-text medical history for the clinician.


**29. Please include a full list of any medications, prescribed or over the counter, that you are currently taking. This information is needed so that our clinicians can ensure the prescription is safe for you to take.**  
_text · anonymous · role: safety-screen · shown: medical history = I have… (after the conditions question) · no branch · observed_  
Why they ask: Free-text list of all current medicines for the clinician.


**30. Would you like your GP to be informed of this consultation? To ensure we provide the best and safest service for you, we strongly encourage you to share your GP details so we can inform them about your treatment.**  
_single · anonymous · role: consent · shown: always, after the questionnaire completes · BRANCHES · observed_  
Why they ask: Consent to tell the patient's GP (good-practice step for online prescribers).  
Downstream: Yes adds the GP email screen.

- `Yes` → **Adds questions**: Sets notify_gp true on the draft and opens a screen asking for the GP's email address, which can be skipped. _[observed]_
- `No` → **Next question**: Sets notify_gp false and goes to the optional email screen. No effect on products. _[observed]_

**31. Please enter your GP's email address**  
_contact · anonymous · role: data-capture · shown: GP question = Yes · no branch · observed_  
Why they ask: Collects the GP's email so Numan can send a treatment letter.

- `Skip` → **Next question**: Moves on without GP details (pressed; nothing typed). _[observed]_
- `Next` → **Unknown**: Would save the GP's email address. Not used: no contact details were entered. _[unknown]_

**32. Get access to special offers. Take the first step towards improving your overall health. You'll receive personalised health insights and exclusive monthly offers to Numan products. Email address (optional)**  
_contact · anonymous · role: marketing · shown: always, before product selection · no branch · observed_  
Why they ask: Optional marketing email capture just before the recommendation. It is not an account wall: 'Skip' works.

- `Skip` → **Next question**: Goes straight to the product selection screen with no email (pressed in every run). _[observed]_
- `Next` → **Marketing only**: Would save a marketing email address before the recommendation. Not used. _[code]_

**33. Please select your treatment. Our clinicians will ensure you’re prescribed the most appropriate treatment.**  
_single · anonymous · role: product-selector · shown: always, after the email screen · BRANCHES · observed_  
Why they ask: The recommendation screen: one featured product with a badge, then 'Prefer a different treatment? See all treatments'. The patient, not the engine, makes the final choice; a clinician reviews it after checkout.  
Downstream: Which products appear depends on the engine flags (finasteride eligible, minoxidil eligible, allergies) and on the entry link. The billing prices on the next screens depend on the product chosen.

- `Hair Kit - Medicated Spray, Finasteride & Supplement` → **Next question**: Stores this product's quarterly variant on the draft (PATCH product_variant_id) and moves to the 'what to expect' screen. For the baseline man the kit with three parts was the featured card ('Most effective'); the other seven appear after pressing 'See all treatments'. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro))_ _[observed]_
- `Hair Kit - Medicated Spray & Finasteride` → **Next question**: Listed under 'OTHER TREATMENTS' for the baseline man with its own 'Select' button (seen). Selecting it was tried only for Regaine (as the featured card in the Regaine-link run); the others are assumed to behave the same way. _(affects: Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit))_ _[inferred]_
- `Hair Kit - Combination Spray & Supplement` → **Next question**: Listed under 'OTHER TREATMENTS' for the baseline man with its own 'Select' button (seen). Selecting it was tried only for Regaine (as the featured card in the Regaine-link run); the others are assumed to behave the same way. _(affects: Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit))_ _[inferred]_
- `Finasteride` → **Next question**: Listed under 'OTHER TREATMENTS' for the baseline man with its own 'Select' button (seen). Selecting it was tried only for Regaine (as the featured card in the Regaine-link run); the others are assumed to behave the same way. _(affects: Finasteride 1 mg tablets (code: finasteride))_ _[inferred]_
- `Triple-Action Spray` → **Next question**: Listed under 'OTHER TREATMENTS' for the baseline man with its own 'Select' button (seen). Selecting it was tried only for Regaine (as the featured card in the Regaine-link run); the others are assumed to behave the same way. _(affects: Triple-Action Spray, also called Combination Spray (code: triple-action-spray))_ _[inferred]_
- `Extra Strength Spray` → **Next question**: Listed under 'OTHER TREATMENTS' for the baseline man with its own 'Select' button (seen). Selecting it was tried only for Regaine (as the featured card in the Regaine-link run); the others are assumed to behave the same way. _(affects: Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil))_ _[inferred]_
- `Regaine` → **Next question**: Listed under 'OTHER TREATMENTS' for the baseline man with its own 'Select' button (seen). Selecting it was tried only for Regaine (as the featured card in the Regaine-link run); the others are assumed to behave the same way. _(affects: Regaine for Men Extra Strength 5% (code: regaine))_ _[observed]_
- `Rosemary Oil` → **Next question**: Listed under 'OTHER TREATMENTS' for the baseline man with its own 'Select' button (seen). Selecting it was tried only for Regaine (as the featured card in the Regaine-link run); the others are assumed to behave the same way. _(affects: Rosemary Oil (code: rosemary-oil))_ _[inferred]_

**34. Hair regrowth timeline: what to expect. 1-2 Months: Save it. There will likely be no visible change in the first two months. Though some people may shed more fine hairs than before. This is temporary and normal. 3-6 Months: Regrow it. At this point, it may become noticeable that hair loss has slowed, stopped, or in some cases maybe even reversed. Take a photo to track your progress. 6 Months and Beyond. By now, hair loss may have considerably slowed or stopped, and some people may see signs of regrowth (usually at the crown of the head). Consistent daily treatment is required to maintain results and increase the chance of regrowth.**  
_info · anonymous · role: expectation-setting · shown: after a hair-loss treatment is selected · no branch · observed_  
Why they ask: Sets expectations (results take months) right before asking for a long upfront payment.

- `Continue` → **Next question**: Goes to the billing screen. _[observed]_

**35. Pay upfront and save big on your treatment. See results in 180 days or your money back¹**  
_single · anonymous · role: marketing · shown: after the expectations screen · no branch · observed_  
Why they ask: Upsell to longer prepaid plans. All three options list 'Delivered every 3 months', 'Pause anytime', 'Continuous care and support included'.

- `Billed quarterly` → **No effect**: Three-kit delivery billed every 3 months. For the three-part kit £40.00 per month; for Regaine £65.00 per month. (billing_frequency 1 in the variant data; viewed, not submitted.) _[observed]_
- `Billed six-monthly` → **No effect**: Pre-selected and badged 'Most effective'. Three-part kit £36.00 per month (£48.00 struck through, 'Save £144.00 per year'); Regaine £57.00 (£80.00 struck through). Pressing Continue stored billing_frequency 2 on the draft. Still 'Delivered every 3 months'. _[observed]_
- `Billed annually` → **No effect**: Three-part kit £32.00 per month ('Save £192.00 per year'); Regaine £48.00. (billing_frequency 4 in the variant data; viewed, not submitted.) _[observed]_

**36. Popular add-ons. Power your Hair Loss treatment with our additional services and supplements.**  
_multi · anonymous · role: marketing · shown: after billing frequency · no branch · observed_  
Why they ask: Cross-sell before the account form.

- `Hair Growth Support` → **Adds a product**: Badged 'Most popular'. £18.76 (was £28.00). Its 'Add' button should put the supplement on the order; it was seen but not pressed. _(affects: Hair Growth Support / Hair Support supplement (code: hair-growth-support, supplements category))_ _[inferred]_
- `Beard Growth Accessories Kit` → **Marketing only**: £18.76 (was £28.00). Not a hair-loss treatment (roller, gel, comb). Not added. _[observed]_
- `Testosterone Blood Test` → **Marketing only**: £46.40 (was £58.00). Not added. _[observed]_
- `Men's Multivitamin` → **Marketing only**: £18.76 (was £28.00). Not added. _[observed]_
- `Core Blood Test` → **Marketing only**: £70.40 (was £88.00). Not added. _[observed]_
- `Rosemary Oil` → **Adds a product**: £21.00 (was £28.00). 'Add' button seen, not pressed. _(affects: Rosemary Oil (code: rosemary-oil))_ _[inferred]_
- `Continue` → **Next question**: Goes to the order summary and account form without any add-on. _[observed]_

**37. Order summary. Create an account: Email address, Password, Legal first name, Legal surname, Date of birth, Phone number, Sex ('What sex were you assigned at birth, as shown on your original birth certificate'), then Delivery address (Address, City, Postcode), 'Yes, I agree to Numan's Terms & Conditions and Privacy Policy.' and 'I do not wish to receive marketing communications…'**  
_contact · checkout · role: identity · shown: always, after add-ons (URL …/profile) · no branch · observed_  
Why they ask: Account creation, identity details and delivery address on one screen, under the order summary (baseline: 'Hair Kit - Medicated Spray, Finasteride & Supplement (Delivered as 3 kits every 3 months) £216.00, Promo -£40.00, Total £176.00').

- `Continue` → **Unknown**: ACCOUNT WALL. Needs an email, password, legal name, date of birth, phone, sex and address. Nothing was typed and the walk stopped here. _[unknown]_

**38. After the account form (not walked): 'Review & Order' with a payment method ('You won’t be charged until our clinical team have reviewed and confirmed your order.', button 'Place order - Payment pending approval'), an automatic identity check, clinician review, then dispatch.**  
_info · after-account · role: identity · shown: after account creation (not tested) · no branch · code_  
Why they ask: What public sources say happens after the wall. Step names and payment wording come from the served app bundle; the identity check and review come from the help centre and the prescribing-process page. A page for 'assigned-gender-restricted-notice' also exists in the bundle ('{product} is intended only for individuals assigned {gender} at birth').


### Product-specific entry to the same consultation (Regaine link; same pattern works for finasteride and minoxidil)

Entry: https://www.numan.com/subscribe/hair-loss/regaine

Identical consent screen and identical questionnaire (replayed with the baseline answers in runs/entry-regaine-baseline). Only the recommendation changes: the entry product is featured with the badge 'Recommended for you' and, by the JS, is never hidden by the eligibility filter. Same account wall. See flow 'men' for every question.

### Rosemary Oil direct purchase (no consultation)

Entry: https://www.numan.com/subscribe/hair-loss/rosemary-oil?purchase=true&pc=HL-ROSEMARY-50OFF

No questions at all: the link opens the account wall (…/profile) at once with the order summary 'Rosemary Oil 100ml £28.00, Promo -£14.00, Total £14.00'.

**1. Order summary (Rosemary Oil 100ml £28.00; Promo -£14.00 'Save 50% on your first order'; Delivery Free; Total £14.00). Create an account: Email address, Password, Legal first name, Legal surname, Date of birth, Phone number, Sex, Delivery address.**  
_contact · checkout · role: identity · shown: always (first screen) · no branch · observed_  
Why they ask: Straight to account creation for a cosmetic product.

- `Continue` → **Unknown**: ACCOUNT WALL. Nothing typed; stopped here. _[unknown]_

### Hair Growth Support supplement direct purchase (no consultation)

Entry: https://www.numan.com/subscribe/supplements/hair-growth-support

No medical questions: shipping-frequency choice → (next screens not walked; by the app routes: add-ons, then the same account form).

**1. Select your preferred shipping frequency**  
_single · anonymous · role: marketing · shown: always (first screen) · no branch · observed_  
Why they ask: Plan length for the supplement. Footer: 'Billed monthly. Pause or cancel anytime.'

- `Every month` → **No effect**: 1 bottle, £28.00 / mo. With code SUPP-ORGANIC-50OFF: 'First order coupon - £14.00, Total due today £14.00'. _(affects: Hair Growth Support / Hair Support supplement (code: hair-growth-support, supplements category))_ _[observed]_
- `Every 3 months` → **No effect**: 3 bottles, £19.67 / mo (£28 struck through, 'Save £8.33'). _(affects: Hair Growth Support / Hair Support supplement (code: hair-growth-support, supplements category))_ _[observed]_
- `Every 6 months` → **No effect**: 6 bottles, £16.67 / mo ('Save £11.33'). _(affects: Hair Growth Support / Hair Support supplement (code: hair-growth-support, supplements category))_ _[observed]_
- `Every 12 months` → **No effect**: 12 bottles, £12.67 / mo ('Save £15.33'). _(affects: Hair Growth Support / Hair Support supplement (code: hair-growth-support, supplements category))_ _[observed]_

## 7. Competitive read

**Strengths**

- Short for a healthy man: 8 questions and no account needed to see the recommendation and every plan price.
- Safety logic is concentrated in a few clear gates plus clinician notes, including a detailed mental-health branch before finasteride.
- Wide range in one flow: licensed tablets, a licensed brand, two unlicensed sprays, three kits, plus a cosmetic and a supplement as fallbacks and add-ons.
- 180-day money-back guarantee shown on the recommendation and billing screens.

**Weaknesses**

- No service for women's hair loss: sex is asserted on a consent screen rather than asked, and every medicine is male-only.
- No question about previous hair-loss treatment, sexual side-effect history, heart disease by name, or family history in the current questionnaire (older versions in the app bundle did ask about previous treatment).
- The patient, not the engine, chooses the product; the default is always the most expensive kit, and six-monthly prepayment is pre-selected.
- Public pages disagree with each other: the prescribing-process page says 'We do not supply unlicensed or unproven treatments' while the consent screen and help centre say the 6% and combination sprays are unlicensed. The first-order banner says 50% off but the pricing call applied 40% (capped at £40) to hair-loss medicines.
- When both drugs are ruled out the screen still sells Rosemary Oil with the badge 'Most effective' instead of explaining that no medicine is suitable.

**Gaps a new competitor could use**

- A proper women's pathway (the site has women's health but no female hair-loss consultation).
- A recommendation that actually uses pattern, severity and stated preferences instead of one default kit.
- Clear, consistent wording on licensed versus unlicensed products and on what the first-order discount really is.
- Monthly or low-commitment plans made visible: the flow only shows quarterly, six-monthly and annual billing.

## 8. Experiments run (4)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| entry-regaine | men-product-entry | Entry link only: /subscribe/hair-loss → /subscribe/hair-loss/regaine (all baseline answers the same) | Same consent and the same 8 questions. Featured card changed from the three-part kit ('Most effective', £26.67) to Regaine ('Recommended for you', £51.67, 'Save 21%'); all other products under 'See all treatments'. Billing screen: quarterly £65.00, six-monthly £57.00, annually £48.00 per month. Order summary at the wall: Regaine 5% minoxidil, 3 bottles every 3 months, £342.00, promo -£40.00, total £302.00. |
| stop-under18 | men | men-what_is_your_age: '18 - 65' → 'Under 18' | Stop screen 'No suitable treatment' at …/sq/what_is_your_age/reject/under_eighteen with 'Review your answers' and 'Back to homepage'. |
| branch-mental-health | men | men-are_any_of_the_following_true: 'No - none' → depression/anxiety ticked, then: accept finasteride risk, GP, a fictional medicine, no dose change, no suicidal thoughts | Five extra questions. Engine flags stayed at their defaults (finasteride and minoxidil both eligible) up to the 'most important' question. The run was stopped there, so the product screen was not seen. |
| explore-all-branches | men | NOT a one-change test. Mapping walk: 65 or over, Other pattern, all three allergy options, all four scalp symptoms, all six cautions, every 'still consider me' follow-up, specialist then GP, dose change No then Yes, 'I have' a medical history; free text was short fictional medical text | Reached 28 of the 29 questions in one draft. Flags: hasAllergyToFinasteride and hasAllergyToMinoxidil true after the allergy answer; isMinoxidilEligible false after the scalp answer; isFinasterideEligible false only while 'specialist' was selected. Product screen: Rosemary Oil only. |

## 10. Limits of this report

- Nothing after the account wall was tested: payment, identity check, any follow-up questions from clinicians, and what is finally prescribed are known only from public pages and app text.
- Most option effects come from the definition the site served (code), not from separate replays; options marked 'unknown' have not been tested at all.
- The engine flags are calculated on Numan's server. Only their values were seen, not the rules that set them.
- Prices were read on 23 Nov 2026 with the first-order code that the site's own links carry; several pricing experiments are named in the app bundle (hl_6_months_promo, hl_price_per_day, HL_ps_science), so another visitor may see different presentation.
- Six-monthly and annual prices for products other than the three-part kit and Regaine are worked out from the variant data in the API, not seen on a billing screen.
- Who compounds the unlicensed sprays is not stated in any public source found.

## 11. Sources

- [Numan hair-loss landing page](https://www.numan.com/hair-loss)
- [Hair-loss consultation entry (consent screen)](https://www.numan.com/subscribe/hair-loss)
- [Finasteride product page](https://www.numan.com/hair-loss/finasteride)
- [Minoxidil product page](https://www.numan.com/hair-loss/minoxidil)
- [Regaine product page](https://www.numan.com/hair-loss/regaine)
- [Rosemary Oil product page](https://www.numan.com/hair-loss/rosemary-oil)
- [Hair Support supplement page](https://www.numan.com/supplements/hair-support)
- [Hair-loss money-back guarantee](https://www.numan.com/hair-loss/money-back-guarantee)
- [Product catalogue API called by the consultation page (products, variants, prices, age and sex limits)](https://api.numan.com/v1/product_categories/hair-loss?all_variants=true)
- [Help centre: hair loss support collection](https://help.numan.com/en/collections/7373202-hair-loss-support)
- [Help centre: Extra Strength Spray (minoxidil 6%, unlicensed) safety information](https://help.numan.com/en/articles/9917345-extra-strength-spray)
- [Help centre: Combination Spray (minoxidil 10%, azelaic acid 5%, finasteride 0.1%, unlicensed) safety information](https://help.numan.com/en/articles/9929731-combination-spray)
- [Help centre: Finasteride dos and don'ts](https://help.numan.com/en/articles/9917349-finasteride)
- [Help centre: Regaine for Men](https://help.numan.com/en/articles/9917351-regaine-for-men)
- [Help centre: Hair Kit - Medicated Hair Spray & Finasteride & Hair Support supplement](https://help.numan.com/en/articles/9917356-hair-kit-medicated-hair-spray-finasteride-hair-support-supplement)
- [Help centre: Hair Kit - Combination Spray & Hair Support supplement](https://help.numan.com/en/articles/9917362-hair-kit-combination-spray-hair-support-supplement)
- [Help centre: Hair Growth Support](https://help.numan.com/en/articles/9917011-hair-growth-support)
- [Help centre: What is an unlicensed or off-label medication?](https://help.numan.com/en/articles/9922010-what-is-an-unlicensed-or-off-label-medication)
- [Help centre: Hair Loss Disclaimer (older wording of the consent list)](https://help.numan.com/en/articles/9929389-hair-loss-disclaimer)
- [Help centre: Is this a subscription service? (commitment plans, auto-renew)](https://help.numan.com/en/articles/9925099-is-this-a-subscription-service)
- [Help centre: How do I cancel or pause my subscription?](https://help.numan.com/en/articles/9924646-how-do-i-cancel-or-pause-my-subscription)
- [Help centre: When is payment taken?](https://help.numan.com/en/articles/9925051-when-is-payment-taken)
- [Help centre: Why do I need to verify my identity?](https://help.numan.com/en/articles/9925019-why-do-i-need-to-verify-my-identity)
- [Help centre: Why do I need to share my GP details?](https://help.numan.com/en/articles/12675517-why-do-i-need-to-share-my-gp-details)
- [The Numan prescribing process](https://www.numan.com/prescribing-process)
- [How Numan is regulated](https://www.numan.com/how-we-are-regulated)
- [Terms of Sale](https://www.numan.com/legal/terms-of-sale)
- [GPhC register: Numan Operations Limited (9011408)](https://inspections.pharmacyregulation.org/pharmacy/detail/numan-operations-limited-9011408)
- [Article: benefits of rosemary oil for women (the only women's hair content found)](https://www.numan.com/womens-health/hair-loss/benefits-of-rosemary-oil-women)
