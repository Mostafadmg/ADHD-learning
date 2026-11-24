# Numan: consultation and product report

**Market:** UK · **Website:** https://www.numan.com/hair-loss · **Checked:** 2026-11-23 · **Owner:** Vir Health Limited (Numan is its trading name; company number 11449267). Registered pharmacy: Numan Operations Limited (GPhC 9011408).

> UK online men's health clinic and pharmacy: an anonymous questionnaire, then the patient picks a subscription product, pays upfront for 3, 6 or 12 months, and a clinician reviews the request after checkout.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** At …/subscribe/hair-loss/<draft id>/profile, after the questionnaire, GP choice, optional email (skippable), product selection, 'what to expect', billing frequency and add-ons. The screen shows the order summary and asks for email, password, legal name, date of birth, phone, sex and delivery address. The full recommendation and all plan prices are visible before it. Direct purchase of Rosemary Oil hits the same form on its first screen.

Stage 1 mapped all 29 questions and every option's served result. Stage 2 (23 Nov 2026) replayed the baseline to the account wall and ran 32 one-change replays to the product screen (runs/x2-*), covering every option that the served data or stage 1 suggested could change the offer: both allergies, lactose, each scalp symptom alone, every caution and its opt-out, the whole mental-health branch, three stops, a stop-bypass, age 65+, three patterns, two preference answers, medical history and two entry links with an allergy. Nothing after the account wall was tried. No contact details were entered anywhere. Stage 3 (24 Nov 2026) replayed the baseline twice (to the product screen and to the account wall), re-tested ten stage-2 rules and ran the main untested options (Complete, 65+ No, Temples, Moderate, asthma and baby opt-ins, lactose small, All of the above, the minoxidil entry link, a two-rule pair with and without an entry link, and the Finasteride billing screen): 22 replays in runs/verify-*.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen), **owner-run** (seen in the owner's own browser research, not replayed by us).

## 2. How the engine decides (short version)

Numan's engine is simple. The server serves one question at a time and a few answers stop the consultation (under 18, patchy or complete loss, sudden onset, 65+ saying No), but every stop has a 'Review your answers' button that lets the patient change the answer and carry on. After each answer the server works out two yes/no flags, finasteride allowed and minoxidil allowed, plus an allergy list. The product screen hides every product containing a drug that is not allowed and features one product: the three-part kit by default, the product in the entry link if there was one (even when its drug is ruled out), or the first product left (Finasteride or Extra Strength Spray). Live tests show only seven answers move a flag: either drug allergy, scalp pain/itching, red rinds/rashes, any blood-pressure diagnosis (minoxidil off), and 'minoxidil only', specialist-managed mental health or recent suicidal thoughts (finasteride off). Everything else, including psoriasis/eczema and the patient's own 'I do not wish to be considered' answers for prostate monitoring, asthma and trying for a baby, changes nothing on screen: it only becomes a note for the clinician who reviews the order after payment details are taken. Pattern, age over 65 and preferences never change the offer. There is no dose or strength choice in the quiz: each product has one strength.

## 3. Engine rules (25)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men | men-what_is_your_age = 'Under 18' | Stop screen 'No suitable treatment' (see your doctor; clinic email). 'Review your answers' lets him go back and change it. | Stops the patient | observed | high |
| R2 | men | pattern = 'Patchy', or onset = 'Over the last few days or weeks' | Stop screen 'No suitable treatment' with its own GP message. | Stops the patient | observed | high |
| R3 | men | pattern = 'Complete', or 65+ confirmation = 'No' | Stop screen 'No suitable treatment' with its own message, the clinic email and 'Review your answers'. | Stops the patient | observed | high |
| R4 | men | any stop screen, then 'Review your answers' and a different answer | The consultation carries on in the same draft and reaches the full offer. Stops are not locked. | No effect | observed | high |
| R5 | men | allergy = 'I am allergic to finasteride' | All finasteride products are hidden (three kits, Triple-Action Spray, Finasteride). Extra Strength Spray is featured as 'Recommended for you' (£18.00); Regaine and Rosemary Oil remain. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ | Removes a product | observed | high |
| R6 | men | allergy = 'I am allergic to minoxidil' | All minoxidil products are hidden (three kits, both sprays, Regaine). Finasteride is featured as 'Recommended for you' (£16.80); Rosemary Oil remains. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ | Removes a product | observed | high |
| R7 | men | scalp = 'Pain, itching, burning or bumps' or 'Red rinds or rashes' (either alone) | isMinoxidilEligible becomes false: all minoxidil products hidden, Finasteride featured, Rosemary Oil remains. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ | Removes a product | observed | high |
| R8 | men | scalp = 'Psoriasis or eczema' (alone) | Nothing is hidden. Only a clinician note says minoxidil is unsuitable. The full offer, including minoxidil kits, is shown. | Flags for the clinician | observed | high |
| R9 | men | scalp = 'Dandruff' (either follow-up answer) | Nothing is hidden, even when he says he does not want a topical treatment; 'No' adds a clinician note. | Flags for the clinician | observed | high |
| R10 | men | cautions = high or low blood pressure (either follow-up answer) | isMinoxidilEligible becomes false: all minoxidil products hidden, Finasteride featured. Saying he wants to be considered for minoxidil does not bring it back. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ | Removes a product | observed | high |
| R11 | men | either answer (opt-in or 'I do not wish to be considered') on the PSA, asthma or trying-for-a-baby follow-up | Nothing is hidden. The opted-out drug or form stays on the screen and the kits stay featured. Only the blood-pressure opt-out is enforced (and that one by the tick itself). | No effect | observed | high |
| R12 | men | depression/anxiety, then mood answer = 'minoxidil only' | The rest of the mental-health branch is skipped and all finasteride products are hidden; Extra Strength Spray featured. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ | Removes a product | observed | high |
| R13 | men | who manages mental health = 'Psychiatrist/Specialist/Consultant' | All finasteride products hidden; medicines, dose change and suicidal-thoughts questions skipped; clinician note asks for specialist approval. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ | Removes a product | observed | high |
| R14 | men | suicidal thoughts or self-harm in the past year = 'Yes' | No stop and no crisis signposting screen. All finasteride products hidden; minoxidil products still offered. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ | Removes a product | observed | high |
| R15 | men | mental-health medicine dose changed in the last 3 months = 'Yes' | A text box is added and the suicidal-thoughts question is skipped. Nothing is hidden (clinician note only). | Skips questions | observed | high |
| R16 | men | depression/anxiety with GP management, stable doses and no suicidal thoughts | Five extra questions, offer unchanged; clinician note to send a mental-health safety-net message if finasteride is approved. | Adds questions | observed | high |
| R17 | men | lactose intolerance, with either follow-up ('can't tolerate any amount' or 'very small amounts') | Nothing is hidden; finasteride tablets (which contain lactose) stay on offer. Clinician note only. | Flags for the clinician | observed | high |
| R18 | men-product-entry | entry link names a product (/subscribe/hair-loss/<product>) and the patient is allergic to its drug | That product is still featured (badge drops to 'Most effective'); the rest of the drug's group is hidden. The entry product escapes the safety filter. _(affects: Regaine for Men Extra Strength 5% (code: regaine), Finasteride 1 mg tablets (code: finasteride))_ | No effect | observed | high |
| R19 | men-product-entry | entry link names a product, nothing ruled out | That product is featured 'Recommended for you'; the kits move under 'See all treatments'. Product links carry no first-order code, so prices are full price (Regaine £65.00, Finasteride £28.00). _(affects: Regaine for Men Extra Strength 5% (code: regaine))_ | Switches product | observed | high |
| R20 | men | nothing ruled out (baseline) | Three-part kit featured 'Most effective' £26.67/month (quarterly variant, first-order code); seven others under 'See all treatments'; six-monthly plan pre-selected; £176.00 at the wall. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil))_ | No effect | observed | high |
| R21 | men | both drugs ruled out (any finasteride rule plus any minoxidil rule) | Only Rosemary Oil (a cosmetic) is offered, badged 'Most effective', with the 'See results in 180 days or your money back' strip and 'Save 40%' (£14.00). No stop and no 'unable to treat' message. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ | Removes a product | observed | high |
| R22 | men | age 65 or over (confirmed Yes), any pattern other than Patchy or Complete (Temples, Moderate, Extensive, Other), body hair loss, any 'most important' answer, or 'I have' a medical history | No product change. Extra text boxes where relevant, read by a clinician after checkout. | No effect | observed | high |
| R23 | men | a free-text answer or any option with a 'query_clinically' result | The order is flagged for the reviewing clinician (written instruction in the served data). The final decision is made after checkout, not by the quiz. | Flags for the clinician | code | medium |
| R24 | men | entry link names a product AND the man is ruled out of its drug by an eligibility flag, not only an allergy (here Regaine link + scalp pain, plus a finasteride allergy) | The entry product is still featured (Regaine, 'Most effective', £65.00 full price) next to Rosemary Oil. So the entry-link bypass beats the eligibility flags too, not just the allergy flags; with both drugs ruled out the man is still offered minoxidil. _(affects: Regaine for Men Extra Strength 5% (code: regaine))_ | Adds a product | observed | high |
| R25 | men | entry link /subscribe/hair-loss/minoxidil, baseline answers | Extra Strength Spray is featured 'Recommended for you' at full price (£30.00 a month, no first-order code); the other seven products sit under 'See all treatments' at full price (three-part kit £40.00, Finasteride £28.00, Regaine £65.00). _(affects: Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil))_ | Switches product | observed | high |

## 4. Products (9)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro)](https://www.numan.com/subscribe/hair-loss) | bundle | minoxidil (Extra Strength / 'Medicated' Spray) 6% scalp solution, 1 ml (6 sprays) twice a day; finasteride 1 mg tablet once a day; Hair Growth Support supplement vitamin A 1000 µg, vitamin C 80 mg, vitamin E 10.2 mg, biotin 200 µg, selenium 55 µg, grape seed extract 50 mg; 1 tablet a day | kit: spray bottle + tablets + supplement tablets | men | Prescription kit. Finasteride 1 mg tablets: licensed POM. Minoxidil 6% spray: POM, unlicensed medicine (Numan's help centre says so; who makes it is not stated). Supplement: food supplement. | £40 a month, billed and delivered quarterly (£120 for 3 kits) (Billed six-monthly £36 a month (£216 per 6 months), billed annually £32 a month; all still delivered every 3 months (observed on the billing screen). A monthly-delivery variant exists in the API at £48 a kit. First-orde…) | Featured 'Most effective' whenever neither drug is ruled out and the patient came in through the main link (x2-01 and every flag-only run). Hidden if either drug is ruled out (x2-02, x2-03). | observed |
| [Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit)](https://www.numan.com/subscribe/hair-loss) | bundle | minoxidil (Extra Strength / 'Medicated' Spray) 6% scalp solution, 1 ml twice a day; finasteride 1 mg tablet once a day | kit: spray bottle + tablets | men | Prescription kit. Finasteride 1 mg: licensed POM. Minoxidil 6% spray: POM, unlicensed medicine. | £36 a month, billed and delivered quarterly (£108 for 3 kits) (From the variant data in the API (not seen on a billing screen): six-monthly billing £32 a month, annual £28 a month; monthly-delivery variant £44 a kit. First-order code HL-ORGANIC-50OFF (in the site's own 'Get started…) | Listed under 'See all treatments' when neither drug is ruled out; hidden if either is (x2-02, x2-03). Never seen featured. | observed |
| [Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit)](https://www.numan.com/subscribe/hair-loss) | bundle | minoxidil 10%; azelaic acid 5%; finasteride (topical) 0.1%; Hair Growth Support supplement 1 tablet a day | kit: one combined scalp spray (1 ml once a day) + supplement tablets | men | Prescription kit. Combination (Triple-Action) Spray: POM, unlicensed medicine (help centre). Supplement: food supplement. | £40 a month, billed and delivered quarterly (£120 for 3 kits) (From the API variant data: six-monthly £36 a month, annual £32 a month; monthly-delivery variant £48. First-order code HL-ORGANIC-50OFF (in the site's own 'Get started' links): the banner says 'Save 50% off your first o…) | Listed under 'See all treatments' when neither drug is ruled out; hidden if either is (x2-02, x2-03). | observed |
| [Finasteride 1 mg tablets (code: finasteride)](https://www.numan.com/hair-loss/finasteride) | rx-oral | finasteride 1 mg | tablet, one a day (packs of 28; 84 for a quarter) | men | POM, licensed generic (Numan describes it as the generic of Propecia). Tablets contain lactose. | £28 a month, billed and delivered quarterly (84 tablets for £84 = £1.00 a tablet) (Six-monthly £24 a month and annual £20 a month (from the API discounts and seen on the billing screen in runs/verify-22-fin-billing, struck-through £34.00); monthly variant 28 tablets £34 (£1.21 a tablet). First-order c…) | Listed when finasteride is not ruled out. Featured 'Recommended for you' (£16.80) when minoxidil is ruled out: minoxidil allergy, scalp pain/itching, red rinds/rashes or a blood-pressure diagnosis (x2-03, x2-04, x2-05, x2-10). Stays featured on the finasteride entry link even with a finasteride allergy (x2-21). | observed |
| [Triple-Action Spray, also called Combination Spray (code: triple-action-spray)](https://help.numan.com/en/articles/9929731-combination-spray) | rx-topical-compounded | minoxidil 10%; azelaic acid 5%; finasteride 0.1% | scalp solution spray, 6 sprays (1 ml) once a day | men | POM, unlicensed medicine (help centre: 'Combination Spray is an unlicensed medication'). | £36 a month, billed and delivered quarterly (£108 for 3 bottles) (From the API variant data: six-monthly £32 a month, annual £28 a month; monthly variant £44 a bottle. First-order code HL-ORGANIC-50OFF (in the site's own 'Get started' links): the banner says 'Save 50% off your first o…) | Listed when neither drug is ruled out; hidden if either is (x2-02, x2-03). | observed |
| [Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil)](https://www.numan.com/hair-loss/minoxidil) | rx-topical-compounded | minoxidil 6% | scalp solution spray, 6 sprays (1 ml) twice a day | men | POM, unlicensed medicine (help centre: 'Minoxidil (6%) is an unlicensed medication'). The marketing page /hair-loss/minoxidil says licensed minoxidil is 2% and 5% and that 6% needs a clinician. | £30 a month, billed and delivered quarterly (£90 for 3 bottles) (From the API variant data: six-monthly £26 a month, annual £22 a month; monthly variant £38 a bottle. First-order code HL-ORGANIC-50OFF (in the site's own 'Get started' links): the banner says 'Save 50% off your first o…) | Listed when minoxidil is not ruled out. Featured 'Recommended for you' (£18.00) when finasteride is ruled out: finasteride allergy, 'minoxidil only', specialist mental-health care, or suicidal thoughts (x2-02, x2-13, x2-15, x2-16). | observed |
| [Regaine for Men Extra Strength 5% (code: regaine)](https://www.numan.com/hair-loss/regaine) | otc-medicine | minoxidil 5% (50 mg/ml) | scalp solution with three applicators, 1 ml twice a day (API variant name '5% (60ml)'; the help article says 50 ml a bottle; the hair-loss landing page calls it 'branded minoxidil foam') | men | Licensed branded medicine that does not need a prescription (Numan's minoxidil page calls the licensed strengths 'pharmacy medicines'). Numan still sells it only through the consultation (API: prescription_required true, questionnaire_required true). | £65 a month, billed and delivered quarterly (£195 for 3 bottles) (Six-monthly £57 a month (£342 per 6 months), annual £48 a month (observed on the billing screen in the Regaine run); monthly variant £80 a bottle. First-order code HL-ORGANIC-50OFF (in the site's own 'Get started' links…) | Listed when minoxidil is not ruled out; featured when the patient enters through the Regaine link, and still featured there even with a minoxidil allergy (x2-20). | observed |
| [Rosemary Oil (code: rosemary-oil)](https://www.numan.com/hair-loss/rosemary-oil) | cosmetic | rosemary leaf oil with argan, sweet almond, flaxseed, castor seed and avocado oils 100 ml bottle, 10-12 drops a day | scalp oil with pipette | both | Cosmetic (API: medicine false, prescription_required false, questionnaire_required false; age 18-70, any sex). | £28 a bottle a month; or 3 bottles every 3 months for £70 (£23.33 a month) (Direct 'Buy now' link uses code HL-ROSEMARY-50OFF: first bottle £14 (observed order summary). Inside the consultation it showed £14.00 (was £23.33), 'Save 40%'. Also offered as an add-on at £21.00 (was £28.00).) | Always listed, whatever the answers; the only product left when both drugs are ruled out (runs/s2-men-explore). Also sold directly with no questions. | observed |
| [Hair Growth Support / Hair Support supplement (code: hair-growth-support, supplements category)](https://www.numan.com/supplements/hair-support) | supplement | vitamin A 1000 µg; vitamin C 80 mg; vitamin E 10.2 mg; biotin 200 µg; selenium 55 µg; grape seed extract 50 mg | tablet, one a day | both | Food supplement (no questionnaire, no prescription). Contains vitamin A: not for anyone pregnant, likely to become pregnant or breastfeeding. Not suitable for vegetarians or vegans. | £28 a bottle a month (Every 3 months £59 (£19.67 a month), every 6 months £100 (£16.67 a month), every 12 months £152 (£12.67 a month) (observed shipping-frequency screen; matches API). Code SUPP-ORGANIC-50OFF halves the first order (£14). A…) | Never chosen by the consultation: inside two kits, offered as an add-on after billing, or bought directly with no questions. | observed |

## 5. Who gets what (11 patient profiles)

- **Baseline man: 18-65, temples and crown, gradual, no allergies, no scalp symptoms, no cautions, no medical history, main link** → Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil) (default: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro)). Featured 'Most effective': Hair Kit - Medicated Spray, Finasteride & Supplement £26.67 a month (quarterly variant, first-order code). Others: two-part kit £22.67, combination kit £26.67, Finasteride £16.80, Triple-Action £22.67, Extra Strength Spray £18.00, Regaine £51.67, Rosemary Oil £14.00. Billing: six-monthly pre-selected (£36.00 a month), quarterly £40.00, annual £32.00. Wall: £216.00 − £40.00 = £176.00. Runs x2-00, x2-01. _[observed]_
- **Man with minoxidil ruled out: minoxidil allergy, scalp pain/itching, red rinds/rashes, or any blood-pressure diagnosis** → Finasteride 1 mg tablets (code: finasteride), Rosemary Oil (code: rosemary-oil) (default: Finasteride 1 mg tablets (code: finasteride)). Finasteride featured 'Recommended for you' £16.80; Rosemary Oil £14.00. No kit, spray or Regaine. Runs x2-03, x2-04, x2-05, x2-10, x2-30. _[observed]_
- **Man with finasteride ruled out: finasteride allergy, 'minoxidil only' mood answer, specialist-managed mental health, or suicidal thoughts in the past year** → Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil) (default: Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil)). Extra Strength Spray featured 'Recommended for you' £18.00; Regaine £51.67; Rosemary Oil £14.00. Runs x2-02, x2-13, x2-15, x2-16. _[observed]_
- **Man with both drugs ruled out (for example a finasteride allergy plus a blood-pressure diagnosis)** → Rosemary Oil (code: rosemary-oil) (default: Rosemary Oil (code: rosemary-oil)). Rosemary Oil only, badged 'Most effective', £14.00, with the money-back strip. No stop screen. Replayed as a clean pair in runs/verify-14-pair-alfin-scpain (finasteride allergy + scalp pain); first seen in runs/s2-men-explore. _[observed]_
- **Man with flag-only answers: psoriasis/eczema, dandruff (either answer), PSA, asthma or baby opt-outs, lactose 'none', body hair loss, depression managed by the GP, dose change, other pattern, 65+, any 'most important' answer, 'I have' a medical history** → Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil) (default: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro)). Exactly the baseline offer; the answers only reach the clinician after checkout. _[observed]_
- **Man entering through /subscribe/hair-loss/regaine** → Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil) (default: Regaine for Men Extra Strength 5% (code: regaine)). Regaine featured 'Recommended for you'. With a minoxidil allergy it is STILL featured (badge 'Most effective', £65.00 with no code), with Finasteride £28.00 and Rosemary Oil £23.33. Runs entry-regaine-baseline, x2-20. _[observed]_
- **Man entering through /subscribe/hair-loss/finasteride with a finasteride allergy** → Finasteride 1 mg tablets (code: finasteride), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil) (default: Finasteride 1 mg tablets (code: finasteride)). Finasteride STILL featured ('Most effective', £28.00); Extra Strength Spray £30.00, Regaine £65.00, Rosemary Oil £23.33. Run x2-21. _[observed]_
- **Man under 18, patchy or complete loss, sudden onset, or 65+ who answers No** → nothing offered. Stop screen 'No suitable treatment' with its own message and the clinic email; 'Review your answers' lets him change the answer and carry on (x2-32). Runs stop-under18, x2-25, x2-26, verify-11-pat-complete, verify-12-age-65-no. _[observed]_
- **Woman** → Rosemary Oil (code: rosemary-oil), Hair Growth Support / Hair Support supplement (code: hair-growth-support, supplements category) (default: Rosemary Oil (code: rosemary-oil)). No women's consultation. The only hair-loss consultation requires 'assigned male at birth'. A woman can only buy the cosmetic oil or the supplement directly (stage 1). _[docs]_
- **Man entering through /subscribe/hair-loss/minoxidil, baseline answers** → Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil) (default: Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil)). Extra Strength Spray featured 'Recommended for you' at £30.00 (no first-order code on product links). Run verify-13-min-entry. _[observed]_
- **Man entering through /subscribe/hair-loss/regaine with both drugs ruled out (finasteride allergy + scalp pain)** → Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil) (default: Regaine for Men Extra Strength 5% (code: regaine)). Regaine (minoxidil) still featured, £65.00, although minoxidil is ruled out by the scalp answer. Run verify-21-pair-alfin-scpain-regaine. _[observed]_

## 6. The consultation, step by step

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

- `65 or over` → **Adds questions**: Adds one confirmation question. If he says Yes, the offer is the same as the baseline (nothing hidden although the API variants say up to 65). Run x2-22. _[observed]_
- `18 - 65` → **Next question**: Goes on to the hair-loss pattern question. _[observed]_
- `Under 18` → **Stops the patient**: Hard stop: 'No suitable treatment', see your doctor or email the clinic. Soft in practice: 'Review your answers' lets him change it. _[observed]_

**2. Hair loss products are not guaranteed to show results in individuals over the age of 65, however, there is still a possibility for hair growth to reoccur. Would you still like to be considered for treatments?**  
_single · anonymous · role: expectation-setting · shown: age = 65 or over · BRANCHES · observed_  
Why they ask: Sets expectations for older men and lets them opt out.  
Downstream: No stops the consultation.

- `Yes` → **No effect**: Continues. No change to the offer (all eight products, three-part kit featured). Run x2-22. _[observed]_
- `No` → **Stops the patient**: Stops: 'No suitable treatment. Unfortunately, we’re unable to recommend a hair loss treatment for you. Please contact your doctor for advice.' with the clinic email and 'Review your answers'. Run verify-12-age-65-no. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil))_ _[observed]_

**3. What kind of hair loss do you have?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Picture-based pattern check (seven drawings) to confirm male pattern hair loss and screen out patchy or complete loss.  
Downstream: Patchy and Complete stop; Other adds a text box; the other four change nothing (x2-24, x2-26, x2-29).

- `Temples` → **No effect**: Continues; no extra question and no change to the offer (three-part kit featured, all eight products). Run verify-19-pat-temples. _[observed]_
- `Temples and Crown` → **Next question**: Proceeds to the onset question. Baseline answer. _[observed]_
- `Moderate` → **No effect**: Continues; no extra question and no change to the offer (three-part kit featured, all eight products). Run verify-20-pat-moderate. _[observed]_
- `Extensive` → **No effect**: Continues; no extra question. No change to the offer (all eight products, three-part kit featured). Run x2-29. _[observed]_
- `Patchy` → **Stops the patient**: Stop screen: circular patches may be alopecia areata, see your GP (x2-26). 'Review your answers' goes back and a different answer continues in the same draft (x2-32). _[observed]_
- `Complete` → **Stops the patient**: Stops at once: 'No suitable treatment. Our treatments are not effective in individuals who have experienced complete hair loss.' with the clinic email and a 'Review your answers' button. Run verify-11-pat-complete. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Finasteride 1 mg tablets (code: finasteride), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine), Rosemary Oil (code: rosemary-oil))_ _[observed]_
- `Other hair loss pattern` → **Flags for the clinician**: Adds a free-text description and a clinician note. No change to the offer (all eight products, three-part kit featured). Run x2-24. _[observed]_

**4. Please tell us about your hair loss: can you describe the appearance of your hair loss; do you have a diagnosis for your hair loss?; for how long has it occurred?; has anything made it better or worse, such as stress?; do you have any other symptoms?. This information is needed so that our clinicians can ensure the prescription is safe for you to take.**  
_text · anonymous · role: diagnosis · shown: pattern = Other hair loss pattern · no branch · observed_  
Why they ask: Free-text description for the clinician when the pattern does not match the drawings.


**5. When did you start to notice your hair loss?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Screens out sudden hair loss, which needs a GP.  
Downstream: Sudden onset stops the consultation.

- `Over the last few days or weeks` → **Stops the patient**: Stop screen: not designed for sudden hair loss, see your GP (x2-25). _[observed]_
- `My hair loss started gradually over the last few months or years` → **Next question**: Proceeds to the allergy question. _[observed]_

**6. Do you have an allergy or intolerance to any of the following?**  
_multi · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Drug allergy and lactose screen. This is the main automatic product filter.  
Downstream: Each drug allergy removes that drug's whole product group (x2-02, x2-03) except an entry-link product (x2-20, x2-21). Lactose adds a question but removes nothing (x2-18).

- `I am allergic to minoxidil` → **Removes a product**: Adds a reaction text box; sets hasAllergyToMinoxidil. Removes the minoxidil group hidden (all kits, both sprays, Regaine); Finasteride featured 'Recommended for you' £16.80, Rosemary Oil also listed. Run x2-03. Exception: the product named in the entry link stays (x2-20). _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ _[observed]_
- `I am allergic to finasteride` → **Removes a product**: Adds a reaction text box; sets hasAllergyToFinasteride. Removes the finasteride group hidden (all kits, Triple-Action Spray, Finasteride); Extra Strength Spray featured 'Recommended for you' £18.00, Regaine and Rosemary Oil also listed. Run x2-02. Exception: the entry product stays (x2-21). _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ _[observed]_
- `I have a lactose intolerance or allergy` → **Adds questions**: Adds the lactose tolerance question. Nothing is hidden, even with 'can't tolerate any'. Run x2-18. _[observed]_
- `I am not allergic to any of the above` → **Next question**: Exclusive option. Proceeds to the scalp question. _[observed]_

**7. Please let us know how you react when you take this medicine**  
_text · anonymous · role: safety-screen · shown: minoxidil and/or finasteride allergy ticked (seen with each alone: x2-02, x2-03) · no branch · observed_  
Why they ask: Free-text description of the allergic reaction for the clinician.


**8. Finasteride tablets contain very small amounts of lactose. If you have taken a tablet formulation before without experiencing symptoms, it is unlikely that you will get undesirable effects from the lactose within our tablets.**  
_single · anonymous · role: safety-screen · shown: lactose intolerance or allergy ticked · no branch · observed_  
Why they ask: Checks whether trace lactose in finasteride tablets is acceptable.

- `I can’t tolerate any amount of lactose and I would like to be considered for non-lactose containing preparations only` → **Flags for the clinician**: Clinician note only ('confirm the request is for a lactose-free treatment'); finasteride tablets stay on offer. Run x2-18. _[observed]_
- `I can tolerate very small amounts of lactose` → **No effect**: Continues. Flags unchanged apart from the allergy list (lactose_intolerance_or_allergy); offer identical to baseline. Run verify-17-al-lac-small. _[observed]_

**9. Are you experiencing any of the following symptoms on your scalp?**  
_multi · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Scalp-condition screen; active scalp disease is a reason not to use minoxidil.  
Downstream: Pain/itching and red rinds/rashes each remove all minoxidil products (x2-04, x2-05). Dandruff and psoriasis/eczema add a follow-up but remove nothing (x2-06..08). Each symptom adds its own follow-up.

- `Pain, itching, burning or bumps` → **Removes a product**: Adds a text box and sets isMinoxidilEligible=false: minoxidil group hidden (all kits, both sprays, Regaine); Finasteride featured 'Recommended for you' £16.80, Rosemary Oil also listed. Run x2-04. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ _[observed]_
- `Red rinds or rashes` → **Removes a product**: Adds a text box and sets isMinoxidilEligible=false: minoxidil group hidden (all kits, both sprays, Regaine); Finasteride featured 'Recommended for you' £16.80, Rosemary Oil also listed. Run x2-05. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ _[observed]_
- `Dandruff` → **Adds questions**: Adds the 'still consider topical?' question. Nothing hidden whatever the answer (x2-06, x2-07). _[observed]_
- `Psoriasis or eczema` → **Flags for the clinician**: Adds a text box and a clinician note saying minoxidil is not suitable. Minoxidil is NOT hidden: No change to the offer (all eight products, three-part kit featured). Run x2-08. _[observed]_
- `No` → **Next question**: Exclusive option. Proceeds to 'Are any of the following true?'. _[observed]_

**10. You mentioned you have pain, itching, burning or bumps on your scalp. Have they been seen to or treated by a doctor?; If so, what treatments have you received?; Please give us a detailed description of your scalp condition below (including how long you’ve had it, its appearance and any other symptoms it is causing)**  
_text · anonymous · role: safety-screen · shown: scalp: 'Pain, itching, burning or bumps' ticked · no branch · observed_  
Why they ask: Free-text detail about scalp pain, itching, burning or bumps for the clinician.


**11. You mentioned you have red rinds or rashes on your scalp. Have they been seen to or treated by a doctor?; If so, what treatments have you received?; Please give us a detailed description of your scalp condition below (including how long you’ve had it, its appearance and any other symptoms it is causing).**  
_text · anonymous · role: safety-screen · shown: scalp: 'Red rinds or rashes' ticked · no branch · observed_  
Why they ask: Free-text detail about red rinds or rashes for the clinician.


**12. Topical formulations (such as spray) may worsen dandruff. Would you still like to be considered for topical treatments?**  
_single · anonymous · role: data-capture · shown: scalp: 'Dandruff' ticked · no branch · observed_  
Why they ask: Warns that sprays may worsen dandruff and asks whether topical treatment is still wanted.  
Downstream: Neither answer changes the offer (x2-06, x2-07); 'No' adds a clinician note.

- `Yes` → **No effect**: No change to the offer (all eight products, three-part kit featured). Run x2-06. _[observed]_
- `No` → **Flags for the clinician**: Clinician note only ('confirm request is not topical'). Sprays stay on offer. Run x2-07. _[observed]_

**13. You mentioned you have eczema or psoriasis on your scalp. Have they been seen to or treated by a doctor?; If so, what treatments have you received?; Please give us a detailed description of your scalp condition below (including how long you’ve had it, its appearance and any other symptoms it is causing)**  
_text · anonymous · role: safety-screen · shown: scalp: 'Psoriasis or eczema' ticked · no branch · observed_  
Why they ask: Free-text detail about scalp psoriasis or eczema for the clinician.


**14. Are any of the following true?**  
_multi · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: One screen for six cautions: body hair loss, prostate monitoring or cancer, blood pressure, asthma, trying for a baby, mental health.  
Downstream: Blood pressure removes all minoxidil products whatever the follow-up (x2-10, x2-30). Depression opens the mental-health branch, which can remove finasteride. PSA, asthma, baby and body hair add a follow-up but remove nothing (x2-09, x2-11, x2-12, x2-19).

- `I have noticed hair loss on other areas of my body other than my head.` → **Flags for the clinician**: Adds a text box and a clinician note. No change to the offer (all eight products, three-part kit featured). Run x2-19. _[observed]_
- `I am undergoing PSA (prostate) monitoring or I have previously been diagnosed with prostate cancer.` → **Adds questions**: Adds the PSA follow-up. Neither follow-up answer hides anything (x2-09, x2-31). _[observed]_
- `I have been diagnosed with high or low blood pressure.` → **Removes a product**: Adds the blood-pressure follow-up and sets isMinoxidilEligible=false whatever the follow-up answer: minoxidil group hidden (all kits, both sprays, Regaine); Finasteride featured 'Recommended for you' £16.80, Rosemary Oil also listed. Runs x2-10, x2-30. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ _[observed]_
- `I have been diagnosed with asthma.` → **Adds questions**: Adds the asthma follow-up. Neither answer hides the sprays (x2-11). _[observed]_
- `I plan on trying for a baby in the next 12 weeks.` → **Adds questions**: Adds the fertility follow-up. Neither answer hides finasteride (x2-12). _[observed]_
- `I have previously experienced, or am currently experiencing, depression, anxiety or panic disorders` → **Adds questions**: Starts the mental-health branch (mood risk, then who manages it, medicines, dose change, suicidal thoughts). With all neutral answers the offer is unchanged (x2-14). _[observed]_
- `No - none` → **Skips questions**: Exclusive option. Skips all eleven follow-ups and goes to the 'most important' question. _[observed]_

**15. Please tell us about hair loss in areas other than your head. This information is needed so that our clinicians can ensure the prescription is safe for you to take.**  
_text · anonymous · role: diagnosis · shown: 'hair loss on other areas of my body' ticked · no branch · observed_  
Why they ask: Free-text detail about hair loss elsewhere on the body.


**16. If you wish to be considered for finasteride you must tell your GP that you are taking finasteride so that they can interpret your results accordingly.**  
_single · anonymous · role: data-capture · shown: 'PSA (prostate) monitoring or … prostate cancer' ticked · no branch · observed_  
Why they ask: Tells men under prostate monitoring that finasteride changes PSA results; lets them opt out of finasteride.  
Downstream: Neither answer changes the offer (x2-09, x2-31); the opt-out is not enforced on screen.

- `I understand and would like to be considered for finasteride containing preparations.` → **No effect**: No change to the offer (all eight products, three-part kit featured). Run x2-31. _[observed]_
- `I do not wish to be considered for finasteride containing preparations.` → **No effect**: Recorded only. Finasteride products are NOT hidden: No change to the offer (all eight products, three-part kit featured). Run x2-09. _[observed]_

**17. Taking minoxidil alongside your regular blood pressure medication may cause your blood pressure to decrease further, potentially causing light-headedness, dizziness and fainting.**  
_single · anonymous · role: data-capture · shown: 'diagnosed with high or low blood pressure' ticked · no branch · observed_  
Why they ask: Warns that minoxidil can lower blood pressure further; lets him opt out of minoxidil.  
Downstream: Both answers lead to the same result: minoxidil already removed by the blood-pressure tick (x2-10, x2-30).

- `I understand that minoxidil may lower my blood pressure and would like to be considered for minoxidil.` → **Removes a product**: Minoxidil is still removed (the removal comes from ticking blood pressure): minoxidil group hidden (all kits, both sprays, Regaine); Finasteride featured 'Recommended for you' £16.80, Rosemary Oil also listed. Run x2-30. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ _[observed]_
- `I do not wish to be considered for minoxidil.` → **Removes a product**: Minoxidil removed: minoxidil group hidden (all kits, both sprays, Regaine); Finasteride featured 'Recommended for you' £16.80, Rosemary Oil also listed. Run x2-10. Same as the other answer. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil), Regaine for Men Extra Strength 5% (code: regaine))_ _[observed]_

**18. Topical formulations (such as spray) may contain alcohol, inhaling this spray may worsen your asthma symptoms and cause you to become short of breath.**  
_single · anonymous · role: data-capture · shown: 'diagnosed with asthma' ticked · no branch · observed_  
Why they ask: Warns that alcohol-based sprays can worsen asthma; lets him opt out of topical products.  
Downstream: The opt-out does not hide sprays (x2-11).

- `I understand that topical formulations (such as spray) may worsen my asthma and would like to be considered topical formulations.` → **No effect**: Continues. Offer identical to baseline (topical sprays and kits still shown). Run verify-15-c-ast-yes. _[observed]_
- `I do not wish to be considered for topical formulations (such as spray).` → **No effect**: Recorded only. Sprays and Regaine stay on offer: No change to the offer (all eight products, three-part kit featured). Run x2-11. _[observed]_

**19. Traces of finasteride have been found in the semen (which could affect the feotus), it is advised to stop taking finasteride 12 weeks prior to trying for a baby.**  
_single · anonymous · role: data-capture · shown: 'plan on trying for a baby in the next 12 weeks' ticked · no branch · observed_  
Why they ask: Fertility warning for finasteride; lets him opt out of finasteride.  
Downstream: The opt-out does not hide finasteride (x2-12).

- `I would like to be considered for finasteride and will stop taking finasteride 12 weeks prior to trying for a baby.` → **No effect**: Continues. Offer identical to baseline (finasteride kits still featured). Run verify-16-c-baby-yes. _[observed]_
- `I do not wish to be considered for preparations containing finasteride.` → **No effect**: Recorded only. Finasteride products stay on offer: No change to the offer (all eight products, three-part kit featured). Run x2-12. _[observed]_

**20. Mood alterations including depressed mood, depression and, less frequently, suicidal ideation have been reported in patients treated with finasteride.**  
_single · anonymous · role: product-selector · shown: 'depression, anxiety or panic disorders' ticked · BRANCHES · observed_  
Why they ask: Finasteride mood-risk warning; he accepts the risk or asks for minoxidil only.  
Downstream: 'Minoxidil only' removes finasteride and skips the rest of the branch (x2-13).

- `I accept the risk that finasteride can lead to detrimental effects on my mood and would like to be considered for finasteride and/or minoxidil.` → **Next question**: Continues to 'who manages your mental health'. Offer unchanged if the rest is neutral (x2-14). _[observed]_
- `I would like to proceed with a minoxidil only treatment plan.` → **Removes a product**: Skips the rest of the branch and sets isFinasterideEligible=false: finasteride group hidden (all kits, Triple-Action Spray, Finasteride); Extra Strength Spray featured 'Recommended for you' £18.00, Regaine and Rosemary Oil also listed. Run x2-13. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ _[observed]_

**21. Who manages your mental health condition?**  
_single · anonymous · role: product-selector · shown: mood question = accept the finasteride risk (skipped by 'minoxidil only': x2-13) · BRANCHES · observed_  
Why they ask: Finds out whether a specialist or the GP manages the condition.  
Downstream: Specialist removes finasteride and skips three questions (x2-15); GP continues (x2-14).

- `Psychiatrist/Specialist/Consultant` → **Removes a product**: Skips medicines, dose change and suicidal-thoughts questions; sets isFinasterideEligible=false: finasteride group hidden (all kits, Triple-Action Spray, Finasteride); Extra Strength Spray featured 'Recommended for you' £18.00, Regaine and Rosemary Oil also listed; clinician note asks for specialist approval. Run x2-15. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ _[observed]_
- `GP` → **Adds questions**: Continues to medicines, dose change and suicidal thoughts. Offer unchanged if neutral (x2-14). _[observed]_

**22. What medications do you take for your mental health condition?**  
_text · anonymous · role: safety-screen · shown: who manages = GP · no branch · observed_  
Why they ask: Free-text list of mental-health medicines for the clinician.


**23. Have the doses of your medications changed in the last 3 months?**  
_single · anonymous · role: safety-screen · shown: who manages = GP (after the medicines text) · BRANCHES · observed_  
Why they ask: Checks whether the condition is stable.  
Downstream: Yes adds a text box and skips the suicidal-thoughts question (x2-17).

- `Yes` → **Flags for the clinician**: Adds a dose-change text box and then SKIPS the suicidal-thoughts question. Clinician note only: No change to the offer (all eight products, three-part kit featured). Run x2-17. _[observed]_
- `No` → **Next question**: Continues to the suicidal-thoughts question (x2-14). _[observed]_

**24. Please tell us which medications have been changed, your previous dose and your current dose.**  
_text · anonymous · role: safety-screen · shown: dose changed in the last 3 months = Yes · no branch · observed_  
Why they ask: Free-text detail of the dose changes.


**25. Have you had any suicidal thoughts or feelings of self-harm in the past year?**  
_single · anonymous · role: product-selector · shown: who manages = GP and dose changed = No (skipped if the dose changed: observed in x2-17) · no branch · observed_  
Why they ask: Suicidal-thoughts screen before finasteride.  
Downstream: Yes removes finasteride, no stop (x2-16).

- `Yes` → **Removes a product**: No stop and no signposting screen. Sets isFinasterideEligible=false: finasteride group hidden (all kits, Triple-Action Spray, Finasteride); Extra Strength Spray featured 'Recommended for you' £18.00, Regaine and Rosemary Oil also listed. Run x2-16. _(affects: Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro), Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit), Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit), Triple-Action Spray, also called Combination Spray (code: triple-action-spray), Finasteride 1 mg tablets (code: finasteride))_ _[observed]_
- `No` → **Flags for the clinician**: Continues; clinician note to send the mental-health safety-net message if finasteride is approved. Offer unchanged (x2-14). _[observed]_

**26. What’s most important to you when choosing a hair loss product? (Select all that apply)**  
_multi · anonymous · role: marketing · shown: always · no branch · observed_  
Why they ask: Preference question. Nothing served to the browser uses the answer, so it appears to be for data capture or marketing.  
Downstream: No effect on the offer (x2-27, x2-28).

- `Effectiveness of the product` → **No effect**: Baseline answer. No effect on the offer. _[observed]_
- `Minimal side effects` → **Marketing only**: No change to the offer (all eight products, three-part kit featured). Run x2-27. _[observed]_
- `Scalp-friendly options` → **Marketing only**: No change to the offer (all eight products, three-part kit featured). Run x2-28. _[observed]_
- `All of the above` → **Marketing only**: Continues; offer identical to baseline. The switch it sets in the browser is never read. Run verify-18-imp-all. _[observed]_

**27. It's really important to tell us about: Major illnesses; Ongoing medical conditions; Any medication prescribed or over the counter that you take; Allergies to medication; Operations. This information is needed so that our clinicians can ensure the prescription is safe for you to take.**  
_single · anonymous · role: safety-screen · shown: always (last fixed question) · BRANCHES · observed_  
Why they ask: Catch-all gate for other illnesses, operations, allergies and medicines.  
Downstream: 'I have…' adds two free-text questions and a clinician query; 'I do not…' ends the questionnaire.

- `I have a major illness, ongoing medical condition, operation, allergy to medication or take prescribed or over the counter medication to tell you about.` → **Flags for the clinician**: Adds two free-text boxes (conditions, medicines) and a clinician query. No change to the offer (all eight products, three-part kit featured). Run x2-23. _[observed]_
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

- Fast and low friction: 8 questions for a straightforward man, the full offer and every price before any sign-in.
- A clear, tested safety filter for the two drugs: allergies, scalp inflammation and blood pressure remove minoxidil, and mood risk removes finasteride, on screen and before checkout (x2 runs).
- Targeted follow-ups: each caution opens its own short explanation and choice instead of a long form; specialist-managed patients skip irrelevant questions.
- Detailed written clinician instructions sit behind every risky answer (in the served data), so the human review has a playbook.
- Always leaves something to buy (Rosemary Oil), and the money-back guarantee and kit discounts are visible throughout.

**Weaknesses**

- Patient opt-outs are ignored on screen: 'I do not wish to be considered for finasteride' (prostate monitoring, trying for a baby) and 'not topical' (asthma, dandruff) leave those products on offer and the finasteride kit featured (x2-09, x2-11, x2-12, x2-07).
- Psoriasis/eczema on the scalp does not remove minoxidil, although Numan's own clinician note says minoxidil is not suitable with an active scalp condition (x2-08); pain/itching and red rinds do remove it.
- Product links bypass the safety filter: the entry product stays featured even with an allergy to its drug (x2-20, x2-21, verify-08) or when its drug is ruled out by a scalp answer (verify-21: Regaine offered with scalp pain and a finasteride allergy).
- Stops are soft: 'Review your answers' lets anyone change a stopping answer and continue in the same draft (x2-32).
- Suicidal thoughts in the past year give no stop or signposting screen; the man is simply moved to minoxidil products (x2-16). A recent mental-health dose change skips the suicidal-thoughts question altogether (x2-17).
- Ticking blood pressure removes minoxidil even when the man says he understands and wants it (x2-30): blunt for well-controlled hypertension on topical minoxidil (our clinical view, inferred).
- Thin history: no exact age, duration, family history, previous treatments or side effects, sexual side-effect history, or treatment preference (tablet vs topical); lactose 'none' does not remove the tablets (x2-18).
- Men only: no women's consultation at all; the only consultation requires 'assigned male at birth'.

**Gaps a new competitor could use**

- Serve women: a female pattern hair-loss consultation (topical and oral minoxidil, spironolactone pathways) is entirely missing at Numan.
- Honour patient choices at once: if someone opts out of a drug or a form, show only what they asked for, and explain why.
- Offer strength and form choices (oral minoxidil, several minoxidil strengths, topical finasteride on its own). Numan has topical finasteride only inside its combination spray, and its quiz never asks about strength or form.
- Collect a fuller history (duration, family history, previous treatment and side effects, sexual function, photos) and use it to personalise and to set expectations.
- Stronger mental-health safety: a crisis signposting screen for recent suicidal thoughts and asking it regardless of dose changes.
- Close the entry-link gap and lock stop screens for the session, then advertise the stricter safety as a trust point.

## 8. Experiments run (59)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| entry-regaine | men-product-entry | Entry link only: /subscribe/hair-loss → /subscribe/hair-loss/regaine (all baseline answers the same) | Same consent and the same 8 questions. Featured card changed from the three-part kit ('Most effective', £26.67) to Regaine ('Recommended for you', £51.67, 'Save 21%'); all other products under 'See all treatments'. Billing screen: quarterly £65.00, six-monthly £57.00, annually £48.00 per month. Order summary at the wall: Regaine 5% minoxidil, 3 bottles every 3 months, £342.00, promo -£40.00, total £302.00. |
| stop-under18 | men | men-what_is_your_age: '18 - 65' → 'Under 18' | Stop screen 'No suitable treatment' at …/sq/what_is_your_age/reject/under_eighteen with 'Review your answers' and 'Back to homepage'. |
| branch-mental-health | men | men-are_any_of_the_following_true: 'No - none' → depression/anxiety ticked, then: accept finasteride risk, GP, a fictional medicine, no dose change, no suicidal thoughts | Five extra questions. Engine flags stayed at their defaults (finasteride and minoxidil both eligible) up to the 'most important' question. The run was stopped there, so the product screen was not seen. |
| explore-all-branches | men | NOT a one-change test. Mapping walk: 65 or over, Other pattern, all three allergy options, all four scalp symptoms, all six cautions, every 'still consider me' follow-up, specialist then GP, dose change No then Yes, 'I have' a medical history; free text was short fictional medical text | Reached 28 of the 29 questions in one draft. Flags: hasAllergyToFinasteride and hasAllergyToMinoxidil true after the allergy answer; isMinoxidilEligible false after the scalp answer; isFinasterideEligible false only while 'specialist' was selected. Product screen: Rosemary Oil only. |
| x2-00-baseline-full | men | none (baseline replay to the account wall) | Still works. 8 questions. Featured three-part kit £26.67/month; six-monthly plan pre-selected; order summary at the wall: kit x3 every 3 months £216.00, promo -£40.00, total £176.00. |
| x2-01-baseline | men | none (baseline replay to the product screen; reference for all x2 runs) | 8 questions; flags isFinasterideEligible=true, isMinoxidilEligible=true. Featured three-part kit 'Most effective' £26.67; others: two-part kit £22.67, combination kit £26.67, Finasteride £16.80, Triple-Action £22.67, Extra Strength Spray £18.00, Regaine £51.67, Rosemary Oil £14.00. |
| x2-02-al-fin | men | allergy: 'I am not allergic…' → 'I am allergic to finasteride' (reaction text answered neutrally) | Adds 1 question (reaction text). hasAllergyToFinasteride=true (isFinasterideEligible stays true). Finasteride group hidden. Featured: Extra Strength Spray, 'Recommended for you', £18.00; also Regaine £51.67 and Rosemary Oil £14.00. All three kits, Triple-Action Spray and Finasteride gone. |
| x2-03-al-min | men | allergy: → 'I am allergic to minoxidil' (reaction text answered neutrally) | Adds the reaction text question. hasAllergyToMinoxidil=true. Minoxidil group hidden. Featured: Finasteride, 'Recommended for you', £16.80; also Rosemary Oil £14.00. All kits, both sprays and Regaine gone. |
| x2-04-sc-pain | men | scalp: 'No' → 'Pain, itching, burning or bumps' (follow-up text answered neutrally) | Adds clarify_pain_itching. isMinoxidilEligible=false. Minoxidil group hidden. Featured: Finasteride, 'Recommended for you', £16.80; also Rosemary Oil £14.00. All kits, both sprays and Regaine gone. |
| x2-05-sc-red | men | scalp: 'No' → 'Red rinds or rashes' (follow-up text answered neutrally) | Adds clarify_red_rinds_or_rashes. isMinoxidilEligible=false. Minoxidil group hidden. Featured: Finasteride, 'Recommended for you', £16.80; also Rosemary Oil £14.00. All kits, both sprays and Regaine gone. |
| x2-06-sc-dan-yes | men | scalp: 'No' → 'Dandruff'; follow-up 'still consider topical?' = Yes | Adds clarify_dandruff. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). |
| x2-07-sc-dan-no | men | scalp: 'No' → 'Dandruff'; follow-up 'still consider topical?' = No | Adds clarify_dandruff. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). The 'No' (do not want topical) does not hide any spray; it only carries a clinician note. |
| x2-08-sc-pso | men | scalp: 'No' → 'Psoriasis or eczema' (follow-up text answered neutrally) | Adds clarify_diagnosis_of_pso_ecz. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). Minoxidil stays on offer although the served clinician note says it is not suitable with an active scalp condition. |
| x2-09-c-psa-no | men | cautions: 'No - none' → PSA/prostate cancer; follow-up = 'I do not wish to be considered for finasteride…' | Adds clarify_psa. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). The finasteride opt-out does not hide finasteride products. |
| x2-10-c-bp-no | men | cautions: → high or low blood pressure; follow-up = 'I do not wish to be considered for minoxidil.' | Adds clarify_uncontrolled_bp. isMinoxidilEligible=false. Minoxidil group hidden. Featured: Finasteride, 'Recommended for you', £16.80; also Rosemary Oil £14.00. All kits, both sprays and Regaine gone. |
| x2-11-c-ast-no | men | cautions: → asthma; follow-up = 'I do not wish to be considered for topical formulations' | Adds clarify_asthma. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). Sprays stay on offer despite the opt-out. |
| x2-12-c-baby-no | men | cautions: → trying for a baby in 12 weeks; follow-up = 'I do not wish to be considered for preparations containing finasteride.' | Adds clarify_plan_on_trying_for_baby. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). The finasteride opt-out does not hide finasteride products. |
| x2-13-dep-minonly | men | cautions: → depression/anxiety; mood question = 'I would like to proceed with a minoxidil only treatment plan.' | Adds mood_alterations only: the rest of the mental-health branch (who manages, medicines, dose change, suicidal thoughts) is skipped. isFinasterideEligible=false. Finasteride group hidden. Featured: Extra Strength Spray, 'Recommended for you', £18.00; also Regaine £51.67 and Rosemary Oil £14.00. All three kits, Triple-Action Spray and Finasteride gone. |
| x2-14-dep-gp | men | cautions: → depression/anxiety; accept finasteride mood risk, GP, a fictional medicine, no dose change, no suicidal thoughts | Adds 5 questions (13 in all). Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). |
| x2-15-dep-spec | men | as x2-14 but who manages = 'Psychiatrist/Specialist/Consultant' | Adds 2 questions; medicines, dose change and suicidal-thoughts questions are skipped. isFinasterideEligible=false. Finasteride group hidden. Featured: Extra Strength Spray, 'Recommended for you', £18.00; also Regaine £51.67 and Rosemary Oil £14.00. All three kits, Triple-Action Spray and Finasteride gone. |
| x2-16-dep-suic | men | as x2-14 but suicidal thoughts in the past year = Yes | No stop screen. isFinasterideEligible=false. Finasteride group hidden. Featured: Extra Strength Spray, 'Recommended for you', £18.00; also Regaine £51.67 and Rosemary Oil £14.00. All three kits, Triple-Action Spray and Finasteride gone. |
| x2-17-dep-dose | men | as x2-14 but dose changed in last 3 months = Yes (list text answered neutrally) | Adds the dose-change list and then SKIPS the suicidal-thoughts question. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). |
| x2-18-al-lac-none | men | allergy: → lactose intolerance; follow-up = 'I can’t tolerate any amount of lactose…' | Adds lactose_tolerance. allergies=[lactose]. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). Finasteride tablets stay on offer. |
| x2-19-c-body | men | cautions: → hair loss on other areas of the body (text answered neutrally) | Adds clarify_noticed_hair_loss_on_my_body. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). |
| x2-20-regaine-almin | men-product-entry | entry link /subscribe/hair-loss/regaine (no promo code) + minoxidil allergy | hasAllergyToMinoxidil=true. Regaine (minoxidil) is STILL featured, badge changes to 'Most effective', £65.00 (no first-order code on this link); others: Finasteride £28.00, Rosemary Oil £23.33. Kits and sprays hidden. The entry product escapes the allergy filter. |
| x2-21-fin-entry-alfin | men-product-entry | entry link /subscribe/hair-loss/finasteride (no promo code) + finasteride allergy | hasAllergyToFinasteride=true. Finasteride is STILL featured ('Most effective', £28.00); others: Extra Strength Spray £30.00, Regaine £65.00, Rosemary Oil £23.33. The entry product escapes the allergy filter. |
| x2-22-age-65 | men | age: '18 - 65' → '65 or over'; confirmation = Yes | Adds sixty_five_and_over_confirmation. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). (The API variants say ages 19-65, but nothing is hidden.) |
| x2-24-pat-other | men | pattern: 'Temples and Crown' → 'Other hair loss pattern' (text answered neutrally) | Adds clarify_other_hair_loss_pattern. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). |
| x2-23-hist-yes | men | medical history: 'I do not have…' → 'I have a major illness…' (two text boxes answered with mild hay fever and an antihistamine) | Adds tell_us_about_medical_history and tell_us_about_medication_history (10 questions). Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). Free text is read by a clinician later, not by the quiz. |
| x2-25-onset-sudden | men | onset: gradual → 'Over the last few days or weeks' | Stop screen 'No suitable treatment' (…/sq/when_did_you_notice/reject/sudden): not designed for sudden hair loss, see your GP, or email clinic@numan.com; buttons 'Review your answers' and 'Back to homepage'. |
| x2-26-pat-patchy | men | pattern: 'Temples and Crown' → 'Patchy' | Stop screen 'No suitable treatment' (…/reject/patchy): circular patches may suggest a form of alopecia, see your GP. |
| x2-27-imp-se | men | most important: 'Effectiveness' → 'Minimal side effects' | Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). |
| x2-28-imp-scalp | men | most important: 'Effectiveness' → 'Scalp-friendly options' | Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). |
| x2-29-pat-extensive | men | pattern: 'Temples and Crown' → 'Extensive' | Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). No extra question. |
| x2-30-c-bp-yes | men | cautions: → high or low blood pressure; follow-up = 'I understand… and would like to be considered for minoxidil.' | isMinoxidilEligible=false even though he asked to be considered. Minoxidil group hidden. Featured: Finasteride, 'Recommended for you', £16.80; also Rosemary Oil £14.00. All kits, both sprays and Regaine gone. So ticking blood pressure removes minoxidil whatever the follow-up answer. |
| x2-31-c-psa-yes | men | cautions: → PSA/prostate cancer; follow-up = 'I understand and would like to be considered for finasteride…' | Adds clarify_psa. Offer identical to baseline: three-part kit featured ('Most effective', £26.67), all eight products listed. Flags unchanged (both drugs eligible). |
| x2-32-patchy-review | men | pattern: 'Patchy' (stop screen), then 'Review your answers' and change to 'Temples and Crown' in the same draft | The stop is soft: 'Review your answers' returns to the pattern question; after changing the answer the walk continues normally to the full baseline offer (three-part kit featured, all eight products). The draft id did not change. |
| verify-01-baseline | men | none (baseline replayed fresh) | Same as recorded: 8 questions, both flags true, three-part kit featured Most effective £26.67, seven others at the recorded prices. |
| verify-02-baseline-full | men | none (baseline-men.json replayed to the account wall) | Same as recorded: order summary three-part kit, 3 kits every 3 months £216.00, promo −£40.00, total £176.00; account form at …/profile. |
| verify-03-al-fin | men | allergy: none → finasteride (re-test of R5) | Confirmed: hasAllergyToFinasteride true; Extra Strength Spray featured Recommended for you £18.00; only Regaine and Rosemary Oil besides. |
| verify-04-al-min | men | allergy: none → minoxidil (re-test of R6) | Confirmed: Finasteride featured Recommended for you £16.80; only Rosemary Oil besides. |
| verify-05-sc-red | men | scalp: No → 'Red rinds or rashes' (re-test of R7) | Confirmed: isMinoxidilEligible false; Finasteride featured £16.80 + Rosemary Oil. |
| verify-06-c-bp-yes | men | cautions: blood pressure, follow-up asks to be considered for minoxidil (re-test of R10) | Confirmed: minoxidil still removed; Finasteride featured £16.80 + Rosemary Oil. |
| verify-07-dep-suic | men | mental-health branch, GP, stable dose, suicidal thoughts Yes (re-test of R14) | Confirmed: no stop, no signposting screen; isFinasterideEligible false; Extra Strength Spray featured £18.00, Regaine, Rosemary Oil. |
| verify-08-regaine-almin | men | Regaine entry link + minoxidil allergy (re-test of R18) | Confirmed: Regaine still featured (Most effective, £65.00) with Finasteride £28.00 and Rosemary Oil £23.33. |
| verify-09-onset-sudden | men | onset: gradual → 'Over the last few days or weeks' (re-test of R2) | Confirmed: reject URL …/when_did_you_notice/reject/sudden, 'No suitable treatment… not designed for sudden hair loss… seek advice from your usual GP'. |
| verify-10-c-psa-no | men | cautions: PSA, follow-up 'I do not wish to be considered for finasteride…' (re-test of R11) | Confirmed: offer identical to baseline; finasteride kits still featured. |
| verify-11-pat-complete | men | pattern: 'Complete' (new; R3 was code only) | Stop: …/reject/complete, 'Our treatments are not effective in individuals who have experienced complete hair loss.' |
| verify-12-age-65-no | men | age: 65 or over, confirmation 'No' (new; R3 was code only) | Stop: …/sixty_five_and_over_confirmation/reject/no, 'unable to recommend a hair loss treatment… contact your doctor'. |
| verify-13-min-entry | men | entry link /subscribe/hair-loss/minoxidil (new) | Extra Strength Spray featured Recommended for you £30.00 (full price); all eight products listed at full price. |
| verify-14-pair-alfin-scpain | men | pair: finasteride allergy + scalp pain/itching (new; R21 was from a mixed mapping walk) | Both drugs ruled out: only Rosemary Oil, 'Most effective', £14.00, with the money-back strip; no stop or 'unable to treat' message. |
| verify-15-c-ast-yes | men | cautions: asthma, follow-up opts in to topical (new) | No change from baseline. |
| verify-16-c-baby-yes | men | cautions: trying for a baby, follow-up opts in to finasteride (new) | No change from baseline. |
| verify-17-al-lac-small | men | allergy: lactose, follow-up 'very small amounts' (new) | Allergy list gains lactose_intolerance_or_allergy; no change in the offer. |
| verify-18-imp-all | men | most important: 'All of the above' (new) | No change from baseline. |
| verify-19-pat-temples | men | pattern: 'Temples' (new) | No change from baseline. |
| verify-20-pat-moderate | men | pattern: 'Moderate' (new) | No change from baseline. |
| verify-21-pair-alfin-scpain-regaine | men | Regaine entry link + finasteride allergy + scalp pain (new) | Regaine still featured (Most effective, £65.00) with Rosemary Oil £23.33, although isMinoxidilEligible is false: the entry bypass also beats the eligibility flag. |
| verify-22-fin-billing | men | baseline, then choose Finasteride and go to the billing screen (new) | Billing screen: quarterly £28.00 a month; six-monthly £24.00 (pre-selected, struck-through £34.00, "Save £120.00 per year"); annually £20.00. Matches the API-derived prices. |

## 9. Independent verification

Trustworthy as labelled. Every high-consequence rule I re-tested (ten of them, plus both baselines) gave exactly the recorded result, and the live catalogue and product pages match the recorded names, strengths and prices. I found no contradicted rule. The errors I found were small: two stops and one pair rule rested on code or a mixed walk (now observed), one opportunity wrongly said Numan has no topical finasteride, and one clinical opinion was not labelled. The new finding is that product entry links beat the eligibility flags as well as the allergy flags. The main limit is structural: the engine's flags are computed on Numan's server and everything after the account wall, including the clinician's final decision, is unseen, so the report describes what the anonymous quiz offers, not what is finally prescribed.

**Re-checked**

- Baseline replayed fresh twice: product screen identical (verify-01) and account wall total £176.00 identical (verify-02).
- R5 finasteride allergy: confirmed (verify-03).
- R6 minoxidil allergy: confirmed (verify-04).
- R7 scalp 'red rinds or rashes' removes minoxidil: confirmed (verify-05).
- R10 blood pressure removes minoxidil even with the opt-in answer: confirmed (verify-06).
- R14 suicidal thoughts Yes: no stop or signposting; finasteride removed: confirmed (verify-07).
- R18 Regaine entry link survives a minoxidil allergy: confirmed (verify-08).
- R2 sudden onset stop: confirmed (verify-09).
- R11 PSA opt-out ignored on screen: confirmed (verify-10).
- R3 'Complete' and 65+ 'No' stops: were code only, now observed (verify-11, verify-12).
- R21 both drugs ruled out leaves only Rosemary Oil: was from a mixed walk, now a clean pair (verify-14).
- Product facts against the live API (api.numan.com product_categories/hair-loss, read 24 Nov 2026): all 16 active variants, strengths and prices identical to the saved stage-1 copy (three-part kit £120/quarter with 6% spray + finasteride 1 mg; two-part kit £108; combination kit £120; Finasteride 84 tablets £84; Triple-Action 10% minoxidil / 5% azelaic acid / 0.1% finasteride £108; Extra Strength Spray 6% £90; Regaine 5% £195; Rosemary Oil £28 or £70).
- Product pages read live: Finasteride 'From £1.00 / tablet'; Minoxidil plan 'From £30.00 / bottle' and licensed strengths 2% and 5%; Regaine £65.00 → £51.67 and 1 ml dose; Rosemary Oil £28.00 → £14.00, 10-12 drops a day; Hair Support £28.00 a bottle with vitamin A 1000 µg, vitamin C 80 mg, vitamin E 10.2 mg, biotin 200 µg, selenium 55 µg, grape seed extract 50 mg. All match company.json.
- Finasteride six-monthly £24 and annual £20 a month: seen on the billing screen (verify-22).
- Catalogue completeness: the hair-loss landing page and the live API list no product missing from company.json (no oral minoxidil, dutasteride, shampoo or device).
- Women: still no women's consultation; nothing new found on the live pages.
- Every run folder cited as proof exists (one shorthand proof in R22 was expanded to full folder names).

**Corrected**

- R3 evidence code → observed (stops replayed).
- R21 confidence medium → high, with a clean one-change pair as proof; the Rosemary-only screen also carries the money-back strip.
- New rule R24: the entry-link bypass also beats the eligibility flags (Regaine offered when minoxidil is ruled out by scalp pain). Weakness and engine summary updated.
- New rule R25 and recommendation: the minoxidil entry link features Extra Strength Spray at full price.
- Eight options moved from inferred/code to observed (Temples, Moderate, Complete, 65+ No, lactose small, asthma opt-in, baby opt-in, All of the above); R11, R17 and R22 widened to cover them.
- Opportunity text corrected: it said Numan has no topical finasteride, but the Triple-Action Spray contains 0.1% finasteride.
- A clinical opinion in the weaknesses (blood pressure and topical minoxidil) is now labelled as our inferred view.
- Finasteride price detail: six-monthly and annual prices now cite the observed billing screen; Minoxidil page's '60% off your first month' banner noted.
- Limitations and coverage note updated; the old 'not replayed' list replaced by what is still untested.

**Still unverified**

- Everything after the account wall: what the clinician finally prescribes, and whether the clinician notes (psoriasis, PSA, asthma, baby, lactose opt-outs) are acted on.
- The server rules that set the flags were never seen as code; they are known only from replays, so untested combinations could behave differently.
- GP 'Yes' path and the GP email screen.
- Who compounds the unlicensed sprays.
- Whether the pricing experiments named in the app bundle show other visitors different prices or offers.

## 10. Limits of this report

- Nothing after the account wall was tested: payment, identity check, clinician follow-up and what is finally prescribed are known only from public pages and the served clinician notes.
- The flags are computed on Numan's server. Rules were found by one-change replays (33 in stage 2), not read from code; untested options are marked 'inferred'.
- Experiments stopped at the product screen; plan and price after it were checked only for the baseline (x2-00). Prices on product links are without the first-order code.
- Prices were read on 23 Nov 2026 with the code the site's own links carry; pricing experiments named in the app (hl_6_months_promo, hl_price_per_day, HL_ps_science) may change what others see.
- Six-monthly and annual prices for products other than the three-part kit, Regaine and Finasteride are worked out from the API discount data, not seen on a billing screen.
- Each replay created one anonymous draft on Numan's side (about 33 in stage 2); none was submitted.
- Who compounds the unlicensed sprays is not stated in any public source found.
- Still not replayed: GP 'Yes' (it opens a GP email screen; no contact details may be entered), most pairs of rules (one pair was tested), and every 'Select' on the product screen except Regaine, the three-part kit and Finasteride.
- About 22 more anonymous drafts were created on Numan's side in stage 3; none was submitted.

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
