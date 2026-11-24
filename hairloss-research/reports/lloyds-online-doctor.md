# LloydsPharmacy Online Doctor: consultation and product report

**Market:** UK · **Website:** https://onlinedoctor.lloydspharmacy.com/ · **Checked:** 2026-11-24 · **Owner:** LloydsPharmacy (online doctor business; ownership not checked in this stage)

> UK online pharmacy and doctor service (Shopify shop front plus a server-driven questionnaire engine) selling licensed and off-label prescription hair-loss medicines to men.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** No sign-in is needed for the questions or the recommendation. "Continue as a new patient" (…/clinic/hair-loss?guest) starts as a guest. After the recommendation, choosing a product, the pack size (Add to basket) and a finasteride safety screen, the last screen is "Please confirm the following to complete your consultation" (question 100467, "I confirm the above"). The walk stopped there and did not press it, so the exact sign-in point (expected straight after it) was not seen.
- **Blocker:** A "This service operates in the United Kingdom only" pop-up (closed with "Continue with UK service"); not bot protection.
- **Blocker:** The engine is server-driven: the full question set is not in the browser code, so branches were mapped by walking.
- **Blocker:** Some checklist options open explanation pop-ups or could not be clicked by the walker (Phaeochromocytoma onwards in the conditions list, two medicines options, the previous-treatment list).

Stage 1 walked every question on the baseline path and every option one level deep. Stage 2 (24 Nov 2026) replayed the baseline and ran 33 one-change experiments to the recommendation screen, comparing cards and wording (runs/e01 to runs/e33). Options not replayed are marked unknown or inferred. Stage 3 (24 Nov 2026) replayed the baseline and 8 key rules (all confirmed) and filled 7 gaps (phaeochromocytoma, porphyria, SLE, scalp creams, eGFR not tested, testosterone, and one two-change combination); see verification.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen), **owner-run** (seen in the owner's own browser research, not replayed by us).

## 2. How the engine decides (short version)

A server-side rules engine (one screen per answer) works as a subtraction filter. It starts from six cards for every eligible man (two combination packs, generic finasteride, oral minoxidil, Sons minoxidil spray, Propecia) and removes whole drug families: any finasteride exclusion (baby plans, breast or prostate cancer, breast tissue enlargement, sex-life problems, 5-ARI or ED medicines, allergy, mood opt-out, past side effects declined) drops every finasteride product; heart/BP disease, BP medicines or minoxidil allergy drop every minoxidil product, even the spray; age 65+, kidney disease, phaeochromocytoma, porphyria, SLE or ED tablets drop oral minoxidil; scalp changes or medicated scalp creams drop topicals. When both families are gone, the questions end early with no product. Hard stops end the questions for women, under-18s, non-pattern loss and severe kidney or liver disease. Answers never change strength, dose, plan or price, and never add a product: history and efficacy answers only change the result wording. Follow-up questions are skipped once the drug they protect is gone.

## 3. Engine rules (30)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men | men-100013 = Female | Date of birth is still asked, then the questions end: answers summary and final consent, no recommendation (men-only service). | Stops the patient | observed | high |
| R2 | men | age (from men-100014) under 18 | Questions end at once; redirect to "We do not treat under 18s". | Stops the patient | observed | high |
| R3 | men | age 65 or over | Minoxidil tablets and Dual Action Tablets removed (no screen tells the patient why). _(affects: Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ | Removes a product | observed | high |
| R4 | men | men-103257 = Complete or Random patches; men-107954 = Suddenly; men-103261 = Yes; men-103270 includes Alopecia | Questions end at once; no recommendation (not male pattern hair loss). | Stops the patient | observed | high |
| R5 | men | men-103257 = Temples only or Extensive | Expectation screen that must be ticked; offer unchanged. | Shows a warning | observed | high |
| R6 | men | men-105935 = Yes (scalp changes) | Topical minoxidil removed (Sons spray, Dual Tablet + Spray); "see your GP" screen; pets question skipped. _(affects: Sons Minoxidil spray, Dual Action - Tablet + Spray)_ | Removes a product | observed | high |
| R7 | men | men-107973 = Yes (heart or blood pressure condition) | Every minoxidil product removed, oral AND topical; only Finasteride and Propecia offered. _(affects: Hair loss tablets (oral minoxidil), Sons Minoxidil spray, Dual Action - Tablets, Dual Action - Tablet + Spray)_ | Removes a product | observed | high |
| R8 | men | men-103769 includes blood pressure medicines | Every minoxidil product removed, oral and topical. _(affects: Hair loss tablets (oral minoxidil), Sons Minoxidil spray, Dual Action - Tablets, Dual Action - Tablet + Spray)_ | Removes a product | observed | high |
| R9 | men | men-100038 includes Minoxidil (allergy) | Every minoxidil product removed, after an ingredients warning. _(affects: Hair loss tablets (oral minoxidil), Sons Minoxidil spray, Dual Action - Tablets, Dual Action - Tablet + Spray)_ | Removes a product | observed | high |
| R10 | men | men-101561 = Yes and men-101564 = Less than 30 | Questions end at once; no recommendation. | Stops the patient | observed | high |
| R11 | men | men-101561 = Yes and men-101564 = More than 30, I don't know, or I haven't had an eGFR test in the past year | Minoxidil tablets and Dual Action Tablets removed; topical kept. _(affects: Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ | Removes a product | observed | high |
| R12 | men | men-103769 includes erectile dysfunction tablets | Finasteride products and Minoxidil tablets removed; only Sons Minoxidil spray offered. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets, Hair loss tablets (oral minoxidil))_ | Removes a product | observed | high |
| R13 | men | men-108003 = planning or trying for a baby | Warning screen; every finasteride product removed. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ | Removes a product | observed | high |
| R14 | men | men-108003 = My partner is pregnant | No change (only the standard card note that pregnant women must not handle finasteride). | No effect | observed | high |
| R15 | men | men-103270 includes Breast cancer, Breast tissue enlargement, Prostate cancer or Problems with my sex life | Every finasteride product removed silently (no screen). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ | Removes a product | observed | high |
| R16 | men | men-103769 includes finasteride or dutasteride for prostate problems | Every finasteride product removed. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ | Removes a product | observed | high |
| R17 | men | men-100038 includes Finasteride (allergy) | Every finasteride product removed. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ | Removes a product | observed | high |
| R18 | men | men-103270 includes Depression and men-103268 = I don't want to use finasteride tablets | Every finasteride product removed. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ | Removes a product | observed | high |
| R19 | men | men-103270 includes Depression and men-103268 = continue | Four mental-health questions; offer unchanged (with neutral answers); licensed-first line dropped. | Adds questions | observed | medium |
| R20 | men | men-107959 = Yes for finasteride and men-108051 = No | Every finasteride product removed; result notes reported side effects. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ | Removes a product | observed | high |
| R21 | men | men-108014 = Yes (any previous treatment) | Result says "You've previously used hair loss treatment" and drops "start with a licensed treatment"; products unchanged. | No effect | observed | high |
| R22 | men | previous product "No benefit" (12 months+, regular use) | Result adds "treatment with <product> didn't achieve the results you were hoping for"; the product is still offered (no switch). | No effect | observed | high |
| R23 | men | any answer that removes finasteride | The partner-pregnancy question (108003) is skipped, because it only matters for finasteride. | Skips questions | observed | high |
| R24 | men | any answer that removes topical minoxidil | The pets question (108001) is skipped, because it only matters for topical minoxidil. | Skips questions | observed | high |
| R25 | men | either drug removed | The "Clinically proven results" screen (108360) and the combination packs are dropped; remaining single products become the main cards. | Skips questions | observed | high |
| R26 | men | new to treatment, no mental-health history, and finasteride, oral minoxidil and spray (or the scalp-limited set) all on offer | The result adds "As you're new to hair loss treatment, we'd recommend starting with a licensed treatment" (naming finasteride and/or the spray). Dropped after previous treatment, depression, age 65+, CKD or any finasteride removal. | No effect | observed | medium |
| R27 | men | men-108001 = Yes, men-107800 = Yes, men-103769 includes antidepressants, men-107977 = Skip, men-108158 includes Testosterone or Anabolic steroids | Warning or free-text screen only; offer unchanged. | No effect | observed | high |
| R28 | men | men-103270 includes Phaeochromocytoma, Porphyria or Systemic Lupus Erythematosus (SLE) | Minoxidil tablets and Dual Action Tablets removed silently (no screen); finasteride, Propecia and the spray stay. _(affects: Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ | Removes a product | observed | high |
| R29 | men | men-103769 includes medicated creams applied to the scalp | Sons Minoxidil spray and Dual Action Tablet + Spray removed (same as scalp changes); pets question skipped. _(affects: Sons Minoxidil spray, Dual Action - Tablet + Spray)_ | Removes a product | observed | high |
| R30 | men | An answer set that removes both drug families, e.g. men-107973 = Yes (heart/BP) and men-103270 includes Prostate cancer | No product is left, so the questions end early (straight after the next question) and go to the answers summary and final consent, with no recommendation screen. | Stops the patient | observed | high |

## 4. Products (7)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Finasteride tablets (generic)](https://onlinedoctor.lloydspharmacy.com/products/finasteride-hair-loss) | rx-oral | finasteride 1 mg | tablet | men | POM, licensed for male pattern hair loss | £34 (1 month), £95 (3 months), £163 (6 months) one-off (Subscription (pack-size screen in the consultation): £28.00 a month, £80.00 every 3 months, £138.00 every 6 months ("Save 15% & cancel anytime"). Recommendation card shows "From £6.79 a week".) | Offered unless any finasteride exclusion is given: trying for a baby, breast cancer, breast tissue enlargement, prostate cancer, problems with sex life, 5-ARI for prostate, ED tablets, finasteride allergy, depression opt-out, or past finasteride side effects with "No" to trying again. The only drug left for heart/BP, BP medicines or minoxidil allergy. Named in the "licensed first" advice for new patients (observed). | observed |
| [Propecia (branded finasteride)](https://onlinedoctor.lloydspharmacy.com/products/propecia-hair-loss) | rx-oral | finasteride 1 mg | tablet | men | POM, licensed | £60.50 (1 month), £148.50 (3 months), £210 (6 months) one-off (Card shows "From £8.75 a week". Subscription prices not captured.) | Same rules as generic finasteride; always listed under "Other suitable treatments" next to it (observed). | observed |
| [Sons Minoxidil spray](https://onlinedoctor.lloydspharmacy.com/products/minoxidil-solution) | otc-medicine | minoxidil 5% | topical spray (solution) | men | P medicine (minoxidil 5% topical; inferred from UK status of 5% minoxidil solutions) | £33 (1 month), £54 (3 months), £99 (6 months) (Card shows "From £3.85 a week".) | Offered unless scalp changes, medicated scalp creams, heart/BP condition, BP medicines or minoxidil allergy. The only product left for men on ED tablets. Named in the "licensed first" advice (observed). | observed |
| [Hair loss tablets (oral minoxidil)](https://onlinedoctor.lloydspharmacy.com/products/hair-loss-tablets) | rx-oral | minoxidil 2.5 mg | tablet | men | POM used off-label (minoxidil tablets are licensed for high blood pressure, not hair loss) | £29 (1 month), £77 (3 months), £142 (6 months) (Card shows "From £5.52 a week".) | Offered unless age 65 or over, kidney disease (eGFR over 30, unknown or not tested), phaeochromocytoma, porphyria, SLE, heart/BP condition, BP medicines, ED tablets or minoxidil allergy (observed). | observed |
| [Dual Action - Tablet + Spray](https://onlinedoctor.lloydspharmacy.com/products/dual-action-tablets-spray) | bundle | finasteride 1 mg tablet; minoxidil 5% spray | tablet + spray | men | POM tablet + P spray; card says "Licensed for hair loss" | £106 (3 months), £189 (6 months) (Card: "From £7.35 a week", "94% experience an improvement in hair loss". On 23 Nov 2026 the card data said inStock false.) | Shown first whenever both finasteride and topical minoxidil are allowed (no exclusion for either); flagged out of stock on 24 Nov 2026 (observed). | observed |
| [Dual Action - Tablets](https://onlinedoctor.lloydspharmacy.com/products/dual-action-tablets) | bundle | finasteride 1 mg; minoxidil 2.5 mg | two tablets | men | POM; card says "Contains off-label medicine" (oral minoxidil) | £106 (3 months), £189 (6 months) (Card: "From £7.35 a week"; "We recommend as an oral alternative to the classic combo". inStock false on 23 Nov 2026.) | Shown whenever both finasteride and oral minoxidil are allowed; first card when topicals are excluded (scalp changes); out of stock on 24 Nov 2026 (observed). | observed |
| [Minoxidil 5% solution](https://onlinedoctor.lloydspharmacy.com/products/minoxidil-solution-hair-loss) | otc-medicine | minoxidil 5% | topical solution | men | P medicine (inferred) | £51 (3 months) (Shares SKU 4297 with the Sons spray 3-month pack; may be an older listing.) | Never offered in any consultation route tested; sold on the shop pages only (observed: absent from every recommendation screen). | docs |

## 5. Who gets what (11 patient profiles)

- **Baseline man: 32, temples and crown, gradual, no conditions, no medicines, no allergies, new to treatment** → Dual Action - Tablet + Spray, Dual Action - Tablets, Finasteride tablets (generic), Hair loss tablets (oral minoxidil), Sons Minoxidil spray, Propecia (branded finasteride) (default: Dual Action - Tablet + Spray). Two combination packs first (both out of stock), then Finasteride, Minoxidil tablets, Sons spray, Propecia. Advises starting with a licensed treatment (finasteride and the spray). Finasteride 6-month pack £138 on subscription or £163 one-off. _[observed]_
- **Baseline woman** → nothing offered. Not served: men only. Female at the first question: date of birth is asked, then the questions end with no product (runs/verify-female). _[observed]_
- **Man under 18** → nothing offered. Stopped after date of birth: "We do not treat under 18s". _[observed]_
- **Man 65 or over, with kidney disease (eGFR over 30, unknown or not tested), phaeochromocytoma, porphyria or SLE** → Dual Action - Tablet + Spray, Finasteride tablets (generic), Sons Minoxidil spray, Propecia (branded finasteride) (default: Dual Action - Tablet + Spray). Oral minoxidil (and Dual Action Tablets) removed; "licensed first" line dropped. _[observed]_
- **Man with heart/BP condition, on BP medicines, or allergic to minoxidil** → Finasteride tablets (generic), Propecia (branded finasteride) (default: Finasteride tablets (generic)). Finasteride only (generic or Propecia). _[observed]_
- **Man with a finasteride exclusion (trying for a baby, breast or prostate cancer, breast tissue enlargement, sex-life problems, 5-ARI for prostate, finasteride allergy, depression opt-out, past finasteride side effects and declines it)** → Hair loss tablets (oral minoxidil), Sons Minoxidil spray (default: Hair loss tablets (oral minoxidil)). Minoxidil tablets and Sons spray as the two main cards. _[observed]_
- **Man with scalp changes** → Dual Action - Tablets, Finasteride tablets (generic), Hair loss tablets (oral minoxidil), Propecia (branded finasteride) (default: Dual Action - Tablets). Topicals removed; Dual Action Tablets first; licensed-first advice names finasteride only. _[observed]_
- **Man taking erectile dysfunction tablets** → Sons Minoxidil spray (default: Sons Minoxidil spray). Only Sons Minoxidil spray. _[observed]_
- **Man who used treatment before (helped or not, no side effects)** → Dual Action - Tablet + Spray, Dual Action - Tablets, Finasteride tablets (generic), Hair loss tablets (oral minoxidil), Sons Minoxidil spray, Propecia (branded finasteride) (default: Dual Action - Tablet + Spray). Same products; wording says previously treated, and (if no benefit) that the product did not achieve the hoped-for results. No switch or strength change. _[observed]_
- **Man with both a minoxidil exclusion (e.g. heart/BP) and a finasteride exclusion (e.g. prostate cancer)** → nothing offered. Questions end early; summary and final consent with no product. _[observed]_
- **Man using medicated scalp creams** → Dual Action - Tablets, Finasteride tablets (generic), Hair loss tablets (oral minoxidil), Propecia (branded finasteride) (default: Dual Action - Tablets). Topicals removed, as for scalp changes (runs/verify-gap-scalp-creams). _[observed]_

## 6. The consultation, step by step

### Hair loss consultation (men only; one flow for every entry point)

Entry: https://core.onlinedoctor.lloydspharmacy.com/api/questionnaire/clinic/hair-loss?guest

Login prompt (Continue as a new patient) → "Before we begin" + "I confirm the above" → sex at birth → date of birth → education (optional, 3 screens) → 4 hair-loss questions → previous treatment (per product: helped? duration, adherence, side effects, retry finasteride?) → conditions → kidney → heart/BP → other conditions → medicines → allergies → partner pregnancy → pets → results info → answers summary → recommendation cards → pack size → finasteride safety → final consent (walk stops here; account expected next).

**1. What was your sex at birth?**  
_single · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Sex at birth; the service treats men only.  
Downstream: Female -> No hair-loss questions follow: straight to the answers summary and then the final consent screen. No product is shown. The service is for men only.

- `Male` → **Next question**: Continues the hair-loss questions. _[observed]_
- `Female` → **Stops the patient**: Date of birth is still asked, then the questions end: answers summary and final consent screen, no product (runs/verify-female). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Sons Minoxidil spray, Hair loss tablets (oral minoxidil), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_

**2. What is your date of birth?**  
_date · anonymous · role: eligibility-gate · shown: always · BRANCHES · observed_  
Why they ask: Age check: adults only, and the age cut-off for oral minoxidil (65 and over).  
Downstream: Under 18: hard stop (under-18s page). 65 or over: oral minoxidil (and the Dual Action Tablets pack) silently removed from the offer.

- `Age under 18 (e.g. born 2009)` → **Stops the patient**: Questions end at once; redirected to the page "We do not treat under 18s. Please see a doctor in person" (runs/e17-age-17). _[observed]_
- `Age 18 to 64 (tested 19, 32 and 64)` → **Next question**: No change: full offer (runs/e20-age-19, runs/e21-age-64, runs/exp-base). _[observed]_
- `Age 65 or over (tested 65 and 70)` → **Removes a product**: No extra screen, but Minoxidil tablets and Dual Action Tablets are removed at the end; the "start with a licensed treatment" line is dropped (runs/e19-age-65, runs/e18-age-70). _(affects: Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ _[observed]_

**3. Learn more about male pattern hair loss: Find out what causes it, and which treatments may help slow it down or help hair grow back.**  
_single · anonymous · role: expectation-setting · shown: always · BRANCHES · observed_  
Why they ask: Offers short education screens.  
Downstream: Skip removes 3 education screens; no effect on the offer.

- `Tell me more` → **Adds questions**: Shows three information screens (causes, how finasteride works, how minoxidil works). _[observed]_
- `Skip, I already know` → **Skips questions**: Skips the three education screens (what causes hair loss, how finasteride works, how minoxidil works); offer unchanged (runs/e24-skip-learn). _[observed]_

**4. What causes hair loss?: Male pattern hair loss is caused by a combination of genetics and sensitivity to DHT (dihydrotestosterone) , a hormone made from testosterone. In people who are susceptible, DHT gradually causes affected hair follicles to shrink and shortens the hair growth phase. New hairs become finer and shorter and may eventually stop growing in some areas of the scalp. Treatments can help slow further hair loss and may support regrowth. Options include finasteride and minoxidil , which work in different ways.**  
_info · anonymous · role: expectation-setting · shown: 107977 = Tell me more · no branch · observed_  
Why they ask: Education: what causes male pattern hair loss.


**5. How does finasteride work?: Finasteride reduces DHT by blocking an enzyme that converts testosterone into DHT. Lowering DHT can slow the shrinking of affected hair follicles. When taken consistently, finasteride can slow hair loss and may support regrowth in some men.**  
_info · anonymous · role: expectation-setting · shown: 107977 = Tell me more · no branch · observed_  
Why they ask: Education: how finasteride works.


**6. How does minoxidil work?: Minoxidil increases blood flow and nutrients to hair roots. Used regularly, it can help hair grow back thicker over time. It usually takes a few months to notice a difference. Some men use finasteride and minoxidil together. Complete your assessment to find out what's right for you.**  
_info · anonymous · role: expectation-setting · shown: 107977 = Tell me more · no branch · observed_  
Why they ask: Education: how minoxidil works.


**7. Please select which of the images below best represents your hair loss**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Pattern and extent of hair loss (6 pictures).  
Downstream: Complete or Random patches: hard stop. Temples only / Extensive: expectation screen, offer unchanged. Temples and Crown / Moderate: straight on.

- `Temples only` → **Shows a warning**: Adds an expectation screen ("results can be less predictable in these areas", must tick); offer and wording unchanged (runs/e22-pattern-temples). _[observed]_
- `Temples and Crown` → **Next question**: Baseline: continues. _[observed]_
- `Moderate` → **Next question**: Not replayed to the end in stage 2. The stage 1 peek showed no extra screen; no change to the offer is expected. _[inferred]_
- `Extensive` → **Shows a warning**: Adds an expectation screen ("significant regrowth may be less likely", must tick); offer and wording unchanged (runs/e23-pattern-extensive). _[observed]_
- `Complete` → **Stops the patient**: Ends the questions at once and goes to the answers summary. No recommendation was seen (inferred to be the same final consent screen as the female route). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Sons Minoxidil spray, Hair loss tablets (oral minoxidil), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `Random patches` → **Stops the patient**: Ends the questions at once (patchy loss suggests alopecia areata, not male pattern loss). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Sons Minoxidil spray, Hair loss tablets (oral minoxidil), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_

**8. Hair loss around your temples: Finasteride and minoxidil are generally most effective for early to moderate male pattern hair loss at the crown and top of the scalp. They may still slow hair loss and support regrowth around the temples or hairline, but results in these areas are less predictable and vary between individuals.**  
_consent · anonymous · role: expectation-setting · shown: 103257 = Temples only · no branch · observed_  
Why they ask: Sets expectations for temple-only loss.

- `I understand that results can be less predictable in these areas` → **Next question**: Acknowledgement; continues. _[observed]_

**9. Treating extensive hair loss: Finasteride and minoxidil are generally most effective for early to moderate male pattern hair loss at the crown and top of the scalp. If your hair loss is extensive, treatment may still help slow further hair loss, but significant regrowth is less likely. Results vary between individuals.**  
_consent · anonymous · role: expectation-setting · shown: 103257 = Extensive · no branch · observed_  
Why they ask: Sets expectations for extensive loss.

- `I understand that significant regrowth may be less likely` → **Next question**: Acknowledgement; continues. _[observed]_

**10. How did your hair loss start?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Sudden loss suggests another cause.  
Downstream: Suddenly, over days or weeks -> Ends the questions at once and goes to the answers summary.

- `Gradually, over months or years` → **Next question**: Baseline: continues. _[observed]_
- `Suddenly, over days or weeks` → **Stops the patient**: Ends the questions at once and goes to the answers summary. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Sons Minoxidil spray, Hair loss tablets (oral minoxidil), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_

**11. Have you lost any hair in other areas of your body such as eyebrows or beard?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Body or facial hair loss suggests alopecia areata or another cause.  
Downstream: Yes -> Ends the questions at once and goes to the answers summary.

- `Yes` → **Stops the patient**: Ends the questions at once and goes to the answers summary. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Sons Minoxidil spray, Hair loss tablets (oral minoxidil), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `No` → **Next question**: Baseline: continues. _[observed]_

**12. Are you currently experiencing any changes to your scalp?**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Scalp disease screen (topicals may irritate).  
Downstream: Yes: warning screen, topical minoxidil products removed, pets question skipped.

- `Yes` → **Removes a product**: Adds "Your scalp symptoms need checking" (see your GP; no topical treatments while symptoms are present). Sons Minoxidil spray and Dual Action Tablet + Spray are removed; the pets question is skipped (runs/e06-scalp-yes). _(affects: Sons Minoxidil spray, Dual Action - Tablet + Spray)_ _[observed]_
- `No` → **Next question**: Baseline: continues. _[observed]_

**13. Your scalp symptoms need checking: The symptoms you've described could be caused by a scalp condition, such as eczema, psoriasis, or an infection . These conditions can also contribute to your hair loss. Please ask your GP or healthcare professional to assess your symptoms and advise you about treatment. We're unable to offer you topical hair loss treatments while these symptoms are present, as they may irritate your scalp or make the underlying condition worse.**  
_consent · anonymous · role: safety-screen · shown: 105935 = Yes · no branch · observed_  
Why they ask: Tells the patient to see a GP; topicals not offered.

- `I understand` → **Next question**: Acknowledgement; continues. _[observed]_

**14. Have you ever taken any medication for hair loss?**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Treatment history; drives "new to treatment" wording.  
Downstream: Yes: previous-treatment list, then per product "has it helped?" (No benefit adds duration + adherence questions) and side effects (Yes adds describe + "choose finasteride again?"). Changes the result wording; finasteride removed if side effects and the patient declines it.

- `Yes` → **Adds questions**: Adds "Which hair loss treatments have you used before?" and, for each product ticked, "Has <product> helped?" and a side-effects question. The result says "You've previously used hair loss treatment" and drops the "start with a licensed treatment" line; products unchanged unless side effects are reported (runs/e07-prev-topminox, runs/e08-prev-fin). _[observed]_
- `No` → **Next question**: Baseline: the result says "You're new to hair loss treatment" and adds "we'd recommend starting with a licensed treatment, such as Finasteride tablets and Minoxidil spray" (runs/exp-base). _[observed]_

**15. Which hair loss treatments have you used before?: Include any treatments you currently use. Some products contain more than one medication, so please select all that apply.**  
_multi · anonymous · role: product-selector · shown: 108014 = Yes · BRANCHES · observed_  
Why they ask: Which treatments were used before, to ask about benefit and side effects of each.  
Downstream: Each ticked product adds its own "has it helped?" question, then the shared side-effects question 107959.

- `Topical minoxidil (e.g. Regaine foam, solution or spray, Sons Minoxidil Solution, etc.)` → **Adds questions**: Adds 108016 "Has Minoxidil spray helped?" then 107959 side effects. If helped and no side effects: same 6 products (runs/e07-prev-topminox). _[observed]_
- `Oral Minoxidil (e.g. tablets, capsules, etc.)` → **Adds questions**: Not tested. Expected (by the pattern of the two tested options) to add its own "has it helped?" and side-effects questions. _[inferred]_
- `Finasteride tablets (e.g. Propecia or generic finasteride, etc.)` → **Adds questions**: Adds 108022 "Has Finasteride tablets helped?" then 107959 side effects. If helped and no side effects: same 6 products (runs/e08-prev-fin). _[observed]_
- `Other hair loss medication (e.g. compounded sprays containing finasteride or dutasteride)` → **Unknown**: Not tested. _[unknown]_

**15.1. Hair loss medication: Has Minoxidil spray helped with your hair loss? This could mean slowing or stopping further hair loss, or helping hair grow back.**  
_single · anonymous · role: personalisation · shown: 108015 includes Topical minoxidil · BRANCHES · observed_  
Why they ask: Benefit from previous topical minoxidil.  
Downstream: No benefit adds duration and adherence questions and changes the result wording.

- `Yes, it's helped` → **Next question**: Goes to the side-effects question; no change to the offer (runs/e07-prev-topminox). _[observed]_
- `It's helped a little` → **Next question**: Goes to the side-effects question (stage 2 peek, runs/e07b-prev-topminox-peek); effect on the offer not replayed. _[observed]_
- `No, I haven't noticed any benefit` → **Adds questions**: Adds "How long have you used it?" and "Have you used it regularly?". After 12 months+ of regular use, the result adds "Previously, treatment with Minoxidil spray didn't achieve the results you were hoping for" but still offers it (runs/e09-prev-topminox-nobenefit). _[observed]_
- `It's too early to tell` → **Unknown**: Not replayed. _[unknown]_

**15.2. Hair loss medication: Has Finasteride tablets helped with your hair loss? This could mean slowing or stopping further hair loss, or helping hair grow back.**  
_single · anonymous · role: personalisation · shown: 108015 includes Finasteride tablets · BRANCHES · observed_  
Why they ask: Benefit from previous finasteride.  
Downstream: Expected to mirror 108016.

- `Yes, it's helped` → **Next question**: Goes to the side-effects question; no change to the offer (runs/e08-prev-fin). _[observed]_
- `It's helped a little` → **Next question**: Goes to the side-effects question (stage 2 peek, runs/e07b-prev-topminox-peek); effect on the offer not replayed. _[observed]_
- `No, I haven't noticed any benefit` → **Adds questions**: Inferred from the spray version: adds duration and adherence questions and a "didn't achieve the results" line. _[inferred]_
- `It's too early to tell` → **Unknown**: Not replayed. _[unknown]_

**15.3. Hair loss medication: How long have you used Minoxidil spray?**  
_single · anonymous · role: personalisation · shown: 108016 = No, I haven't noticed any benefit (shown on the same screen as 108018) · no branch · observed_  
Why they ask: Whether a fair trial of the product was done.

- `Less than 12 months` → **Unknown**: Not replayed. Inferred: may change the "didn't achieve results" wording (too early to judge). _[unknown]_
- `12 months or longer` → **Next question**: Used in runs/e09-prev-topminox-nobenefit: result says the spray didn't achieve the results hoped for; still offered. _[observed]_

**15.4. Hair loss medication: Have you used Minoxidil spray regularly? This means using it as recommended, with only occasional missed applications and no long breaks.**  
_single · anonymous · role: personalisation · shown: 108016 = No, I haven't noticed any benefit · no branch · observed_  
Why they ask: Adherence check before calling the product a failure.

- `Yes` → **Next question**: Used in runs/e09-prev-topminox-nobenefit (see 108017). _[observed]_
- `No` → **Unknown**: Not replayed. _[unknown]_

**15.5. Side effects: Have you ever experienced side effects from <product> that: were persistent, were severe, required medical attention, made you stop using it**  
_single · anonymous · role: safety-screen · shown: after each "has it helped?" question (same question id for each product) · BRANCHES · observed_  
Why they ask: Serious side effects with a product used before.  
Downstream: Yes adds a description and, for finasteride, a "choose it again?" question.

- `Yes` → **Adds questions**: Adds "Please describe the side effects" (107981); for finasteride it then asks 108051 whether to offer finasteride again (runs/e10-prev-fin-sidefx). _[observed]_
- `No` → **Next question**: No change to the offer (runs/e07-prev-topminox, runs/e08-prev-fin). _[observed]_

**15.6. Side effects: Please describe the side effects you experienced.**  
_text · anonymous · role: data-capture · shown: 107959 = Yes · no branch · observed_  
Why they ask: Free-text side-effect history for the clinician.


**15.7. Side effects: Would you like the option to choose a treatment containing Finasteride 1mg tablets again, despite your previous side effects?**  
_single · anonymous · role: product-selector · shown: 107959 = Yes for finasteride · BRANCHES · observed_  
Why they ask: Lets the patient decide whether finasteride stays on the menu after past side effects.  
Downstream: No removes finasteride.

- `Yes` → **Next question**: All 6 products kept; result says "You reported side effects ... but would like to be recommended options containing Finasteride tablets" (runs/e13-prev-fin-sidefx-again). _[observed]_
- `No` → **Removes a product**: All finasteride products removed; result says "You reported side effects to hair loss treatments"; partner-pregnancy question skipped (runs/e10-prev-fin-sidefx). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_

**16. Have you ever had any of the following conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Medical history checklist for finasteride and minoxidil cautions.  
Downstream: Alopecia: hard stop. Depression: mood warning + opt-out. Suicidal thoughts: crisis advice. Obstructive uropathy: details text. Liver: sub-questions. Breast cancer, breast tissue enlargement, prostate cancer, problems with sex life: silently remove all finasteride.

- `Alopecia` → **Stops the patient**: Ends the questions at once and goes to the answers summary. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Sons Minoxidil spray, Hair loss tablets (oral minoxidil), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `Breast cancer` → **Removes a product**: No extra screen. All finasteride products (Finasteride, Propecia, both Dual Action packs) are removed; the partner-pregnancy question is skipped (runs/e25-breast-cancer). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `Breast tissue enlargement` → **Removes a product**: No extra screen. All finasteride products removed; partner-pregnancy question skipped (runs/e31-gynaecomastia). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `Depression` → **Adds questions**: Adds a finasteride mood warning (103268) with an opt-out. Continue: 4 mental-health questions, then the same 6 products but without the "licensed first" line (runs/e05-dep-continue). Opt out: finasteride removed (runs/e04-dep-nofin). _[observed]_
- `Current or history of suicidal thoughts, self-harm, or attempts` → **Adds questions**: Adds a crisis-support screen (NHS 111, Samaritans, 999) with an acknowledgement tick; then continues. _(affects: Finasteride tablets (generic), Propecia (branded finasteride))_ _[observed]_
- `Obstructive uropathy` → **Adds questions**: Adds a free-text question about the cause and treatment. _(affects: Finasteride tablets (generic), Propecia (branded finasteride))_ _[observed]_
- `Prostate cancer` → **Removes a product**: No extra screen. All finasteride products removed; partner-pregnancy question skipped (runs/e26-prostate-cancer). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `Liver condition` → **Adds questions**: Adds "Do any of these apply to your liver condition?" (4 options). The first two options each end the questions at once; the other two were not tested. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ _[observed]_
- `Phaeochromocytoma` → **Removes a product**: No extra screen. Minoxidil tablets and Dual Action Tablets are removed; finasteride, Propecia, Sons spray and Dual Tablet + Spray stay (runs/verify-gap-phaeo). _(affects: Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ _[observed]_
- `Porphyria` → **Removes a product**: No extra screen. Minoxidil tablets and Dual Action Tablets are removed; the rest stay (runs/verify-gap-porphyria). _(affects: Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ _[observed]_
- `Problems with my sex life` → **Removes a product**: No extra screen. All finasteride products removed; partner-pregnancy question skipped (runs/e32-sex-problems). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `Systemic Lupus Erythematosus (SLE)` → **Removes a product**: No extra screen. Minoxidil tablets and Dual Action Tablets are removed; the rest stay (runs/verify-gap-sle). _(affects: Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ _[observed]_

**17. Finasteride and Propecia tablets has been associated with causing low mood, depression, and suicidal thoughts. If your mood or mental wellbeing worsens while taking this medication, stop taking Finasteride or Propecia tablets and seek medical advice as soon as possible. If you ever feel at risk of harming yourself or have seriously harmed yourself, call emergency services on 999 immediately. Please confirm that you understand this and are happy to continue.**  
_single · anonymous · role: product-selector · shown: 103270 includes Depression · BRANCHES · observed_  
Why they ask: Finasteride mood warning with an opt-out of finasteride.  
Downstream: Opt-out removes finasteride; continue adds 4 mental-health questions.

- `I understand and would like to continue` → **Adds questions**: Adds 4 mental-health questions (3 free text + crisis history). With neutral answers the offer keeps all 6 products, but the "start with a licensed treatment" line is dropped (runs/e05-dep-continue). _[observed]_
- `I don't want to use finasteride tablets` → **Removes a product**: All finasteride products removed; only Minoxidil tablets and Sons spray offered; the partner-pregnancy question is skipped (runs/e04-dep-nofin). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_

**18. Some hair loss treatments can affect mood, so we need to understand a bit more about your mental health: Please list all the mental health conditions you have, or have had. For each condition, tell us when it started and whether it has resolved, is stable, or has come back or got worse recently.**  
_text · anonymous · role: safety-screen · shown: 103268 = I understand and would like to continue · no branch · observed_  
Why they ask: Mental health history for the clinician.


**19. Who manages your mental health condition(s)? (e.g your GP, a psychiatrist)**  
_text · anonymous · role: safety-screen · shown: 103268 = I understand and would like to continue · no branch · observed_  
Why they ask: Who manages the mental health condition.


**20. List all medication you have taken for your mental health condition(s). Tell us about any that didn't work, and any that were started, increased or changed in the last 12 months because you were feeling worse.**  
_text · anonymous · role: safety-screen · shown: 103268 = I understand and would like to continue · no branch · observed_  
Why they ask: Mental health medicines and recent changes.


**21. Have any of the following ever happened to you? - Symptoms so severe you couldn't work or manage day-to-day life - Being admitted to hospital for your mental health - Being seen by a crisis team or home treatment team**  
_single · anonymous · role: safety-screen · shown: 103268 = I understand and would like to continue · no branch · observed_  
Why they ask: Severity of past mental illness.

- `Yes` → **Unknown**: Not tested. _[unknown]_
- `No` → **Next question**: Neutral answer used in runs/e05-dep-continue: full offer kept. _[observed]_

**22. If you are currently experiencing thoughts of harming yourself or suicide, it's important to seek help as soon as possible. - Contact NHS 111 or your GP for advice - You can call Samaritans free on 116 123 for confidential support (available 24 hours a day) - If you feel you are in immediate danger, call 999 or go to A&E**  
_consent · anonymous · role: safety-screen · shown: 103270 includes suicidal thoughts / self-harm · no branch · observed_  
Why they ask: Crisis signposting.

- `I understand that if I am currently experiencing thoughts of self-harm or suicide I should seek medical advice immediately` → **Next question**: Acknowledgement; continues. _[observed]_

**23. Please provide details for the cause of the obstructive uropathy and the treatment received.**  
_text · anonymous · role: safety-screen · shown: 103270 includes Obstructive uropathy · no branch · observed_  
Why they ask: Details of obstructive uropathy.


**24. Do any of these apply to your liver condition?**  
_multi · anonymous · role: eligibility-gate · shown: 103270 includes Liver condition · BRANCHES · observed_  
Why they ask: Severity of liver disease.  
Downstream: I have alcohol related liver disease, cirrhosis or liver can -> Ends the questions at once and goes to the answers summary.; I see a hospital specialist for my condition -> Ends the questions at once and goes to the answers summary.; I have been advised to avoid certain medications -> Not tested.; I am prescribed treatment or have regular monitoring ( not S -> Not tested.

- `I have alcohol related liver disease, cirrhosis or liver cancer` → **Stops the patient**: Ends the questions at once and goes to the answers summary. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Sons Minoxidil spray, Hair loss tablets (oral minoxidil), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `I see a hospital specialist for my condition` → **Stops the patient**: Ends the questions at once and goes to the answers summary. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Sons Minoxidil spray, Hair loss tablets (oral minoxidil), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `I have been advised to avoid certain medications` → **Unknown**: Not tested. _[unknown]_
- `I am prescribed treatment or have regular monitoring ( not Statins or routine yearly blood tests for fatty liver disease)` → **Unknown**: Not tested. _[unknown]_

**25. Do you have Chronic Kidney Disease (CKD) or a reduced kidney function?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Kidney disease screen.  
Downstream: Yes -> Adds the eGFR question.

- `Yes` → **Removes a product**: Adds the eGFR question. Under 30 ends the questions; any other answer removes oral minoxidil (runs/e15, runs/e16). _(affects: Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ _[observed]_
- `No` → **Next question**: Baseline. _[observed]_

**26. What was your most recent eGFR result within the past 12 months ? This is a blood test that tells you how well your kidneys are working.**  
_single · anonymous · role: safety-screen · shown: 101561 = Yes · BRANCHES · observed_  
Why they ask: Kidney function (eGFR).  
Downstream: Less than 30: hard stop. Any other answer: oral minoxidil removed.

- `Less than 30` → **Stops the patient**: Ends the questions at once and goes to the answers summary. _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Sons Minoxidil spray, Hair loss tablets (oral minoxidil), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `More than 30` → **Removes a product**: Minoxidil tablets and Dual Action Tablets removed; spray, finasteride, Propecia and Dual Tablet + Spray kept (runs/e15-ckd-egfr-over30). _(affects: Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ _[observed]_
- `I haven't had an eGFR test in the past year` → **Removes a product**: Minoxidil tablets and Dual Action Tablets are removed; topical and finasteride kept, same as "I don't know" (runs/verify-gap-egfr-notest). _(affects: Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ _[observed]_
- `I don't know` → **Removes a product**: Same as "More than 30": oral minoxidil removed (runs/e16-ckd-egfr-unknown). _(affects: Hair loss tablets (oral minoxidil), Dual Action - Tablets)_ _[observed]_

**27. Have you ever had a condition that affects your heart or blood pressure? Examples include: - High or low blood pressure - Dizziness or faintness when standing up - Heart failure - An irregular heartbeat (arrythmias) - Fluid or inflammation around the heart - Heart valve or structural heart problems - A heart attack, angina, stroke or mini-stroke (TIA) - Another heart or blood vessel condition**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Heart and blood pressure screen (oral minoxidil).  
Downstream: Yes silently removes every minoxidil product (oral and topical) and skips the pets question.

- `Yes` → **Removes a product**: No extra screen. ALL minoxidil removed (tablets, Sons spray and both Dual Action packs): only Finasteride and Propecia are offered. The pets question and "Clinically proven results" screen are skipped (runs/e01-heart-yes). _(affects: Hair loss tablets (oral minoxidil), Sons Minoxidil spray, Dual Action - Tablets, Dual Action - Tablet + Spray)_ _[observed]_
- `No` → **Next question**: Baseline. _[observed]_

**28. Do you have any medical conditions other than those we have already asked about?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Other conditions.  
Downstream: Yes -> Adds a free-text box for details (for the clinician).

- `Yes` → **Flags for the clinician**: Adds a free-text "more details" question; with a minor condition the offer is unchanged (runs/e33-other-condition). Read by the clinician later. _[observed]_
- `No` → **Next question**: Baseline. _[observed]_

**29. Please can you give us more details about your medical condition(s)?**  
_text · anonymous · role: data-capture · shown: 107800 = Yes · no branch · observed_  
Why they ask: Details of other conditions for the clinician.


**30. Are you currently taking any prescription medications?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Prescription medicines screen.  
Downstream: Yes -> Adds a medicines checklist (6 options) and then "And what about these?" (6 more).

- `Yes` → **Adds questions**: Adds a medicines checklist (6 options) and then "And what about these?" (6 more). _[observed]_
- `No` → **Next question**: Baseline. _[observed]_

**31. Are you taking any of the following medications:**  
_multi · anonymous · role: safety-screen · shown: 102632 = Yes · BRANCHES · observed_  
Why they ask: Interacting or relevant medicines, list 1.  
Downstream: BP medicines: all minoxidil removed. 5-ARI for prostate: finasteride removed. ED tablets: finasteride and oral minoxidil removed. Antidepressants: medication list text.

- `Finasteride or Dutasteride for prostate problems` → **Removes a product**: All finasteride products removed; only Minoxidil tablets and spray (runs/e29-5ari-prostate). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `Medicines for high blood pressure (e.g. amlodipine, ramipril, lisinopril, losartan etc.)` → **Removes a product**: ALL minoxidil removed (tablets, spray, both Dual packs): only Finasteride and Propecia (runs/e27-bp-meds). _(affects: Hair loss tablets (oral minoxidil), Sons Minoxidil spray, Dual Action - Tablets, Dual Action - Tablet + Spray)_ _[observed]_
- `Antidepressants (e.g. escitalopram, citalopram, duloxetine, fluoxetine, mirtazapine, paroxetine, sertraline, venlafaxine etc.)` → **Flags for the clinician**: Adds "Please can you list all your medications" (free text); offer unchanged (runs/e28-antidepressants). _[observed]_
- `Erectile dysfunction tablets (e.g. sildenafil (Viagra), tadalafil (Cialis), vardenafil (Levitra) etc.)` → **Removes a product**: Finasteride products AND Minoxidil tablets removed: only Sons Minoxidil spray is offered (runs/e30-ed-tablets). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets, Hair loss tablets (oral minoxidil))_ _[observed]_
- `Medicated creams applied to your scalp (e.g. steroids (hydrocortisone, betamethasone, clobetasone) and calcipotriol (dovonex) to treat psoriasis and eczema etc.)` → **Removes a product**: Then 108158 "And what about these?". Sons Minoxidil spray and Dual Action Tablet + Spray are removed (same as scalp changes); the pets question is skipped; finasteride, Propecia, Minoxidil tablets and Dual Action Tablets stay (runs/verify-gap-scalp-creams). _(affects: Sons Minoxidil spray, Dual Action - Tablet + Spray)_ _[observed]_
- `Guanethidine` → **Adds questions**: Not replayed to the end in stage 2 (stage 1 saw a follow-up). Inferred: likely removes minoxidil (guanethidine interaction in the minoxidil SmPC); not confirmed. _[inferred]_

**32. And what about these?**  
_multi · anonymous · role: safety-screen · shown: after 103769 · BRANCHES · observed_  
Why they ask: Relevant medicines, list 2.  
Downstream: Testosterone or Anabolic steroids -> Adds a screen: finasteride is unlikely to help while taking steroids; tick "I understand".; Inhalers for asthma or COPD -> Not tested.; Antihistamines -> Not tested.; Painkillers -> Not tested.; Acid reflux medication (e.g. omeprazole, lansoprazole, panto -> Not tested.; Other medication -> Adds a free-text list of all medicines.

- `Testosterone or Anabolic steroids` → **Shows a warning**: Adds a screen: finasteride is unlikely to help while taking steroids; tick "I understand". Offer and wording unchanged: all 6 cards (runs/verify-gap-testosterone, with antidepressants also ticked, which e28 showed has no effect). _(affects: Finasteride tablets (generic), Propecia (branded finasteride))_ _[observed]_
- `Inhalers for asthma or COPD` → **No effect**: Not tested. Inferred: no effect on the offer (no known interaction with finasteride or minoxidil). _[inferred]_
- `Antihistamines` → **No effect**: Not tested. Inferred: no effect on the offer (no known interaction with finasteride or minoxidil). _[inferred]_
- `Painkillers` → **No effect**: Not tested. Inferred: no effect on the offer (no known interaction with finasteride or minoxidil). _[inferred]_
- `Acid reflux medication (e.g. omeprazole, lansoprazole, pantoprazole, etc.)` → **No effect**: Not tested. Inferred: no effect on the offer (no known interaction with finasteride or minoxidil). _[inferred]_
- `Other medication` → **Flags for the clinician**: Adds a free-text list of all medicines. _[observed]_

**33. Steroids are thought to create male pattern hair loss by causing your body to produce higher levels of dihydrotestosterone (DHT). DHT acts on the hair follicles on your scalp, causing them to weaken over time. They eventually die and stop growing back, which results in baldness. Taking Finasteride or Propecia is unlikely to be helpful if you are still taking steroids. Steroids can also cause lots of other problems such as erectile dysfunction, infertility, heart and kidney problems as well as mood disorders.**  
_consent · anonymous · role: expectation-setting · shown: 108158 includes Testosterone or Anabolic steroids · no branch · observed_  
Why they ask: Steroids warning.

- `I understand` → **Next question**: Acknowledgement; continues. _[observed]_

**34. Please can you list all your medications below.**  
_text · anonymous · role: data-capture · shown: 108158 includes Other medication · no branch · observed_  
Why they ask: Full medicines list for the clinician.


**35. Do you have any allergies?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Allergies.  
Downstream: Yes -> Adds "Are you allergic to any of the following?" then an ingredients warning.

- `Yes` → **Adds questions**: Adds "Are you allergic to any of the following?" then an ingredients warning. _[observed]_
- `No` → **Next question**: Baseline. _[observed]_

**36. Are you allergic to any of the following?**  
_multi · anonymous · role: safety-screen · shown: 102624 = Yes · BRANCHES · observed_  
Why they ask: Allergy to the actives.  
Downstream: Each ticked allergy removes every product containing that drug, after an ingredients warning.

- `Minoxidil or Regaine` → **Removes a product**: Adds an ingredients warning (108405). ALL minoxidil removed; only Finasteride and Propecia; pets question skipped (runs/e11-allergy-minox). _(affects: Hair loss tablets (oral minoxidil), Sons Minoxidil spray, Dual Action - Tablets, Dual Action - Tablet + Spray)_ _[observed]_
- `Finasteride, Propecia or dutasteride` → **Removes a product**: Adds an ingredients warning (108405). All finasteride removed; only Minoxidil tablets and spray; partner-pregnancy question skipped (runs/e12-allergy-fin). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_

**37. As you have allergies, you must check the list of ingredients of any medication prescribed to you before taking it. It's important to be sure you're not allergic to any of the ingredients as these can be different depending on the manufacturer of the medicine. The leaflet that comes with your medicine will have a list of ingredients.**  
_consent · anonymous · role: safety-screen · shown: 100038 any option · no branch · observed_  
Why they ask: Check-the-ingredients warning.

- `I understand` → **Next question**: Acknowledgement; continues. _[observed]_

**38. Is your partner pregnant, or are you planning or trying for a baby?**  
_single · anonymous · role: product-selector · shown: only while a finasteride product is still on offer (skipped after depression opt-out, breast/prostate cancer, breast tissue enlargement, sex-life problems, 5-ARI use, ED tablets, finasteride allergy or finasteride side effects declined) · BRANCHES · observed_  
Why they ask: Partner pregnancy / trying for a baby (finasteride).  
Downstream: Trying for a baby: warning, finasteride removed. Partner pregnant: no change. Shown only when finasteride is still possible (skipped after any finasteride removal).

- `My partner is pregnant` → **No effect**: No extra screen and no change to the offer or wording (runs/e03-partner-pregnant). Finasteride cards still say tablets must not be handled by pregnant women. _[observed]_
- `We are currently planning or trying for a baby` → **Removes a product**: Adds "Finasteride and trying for a baby" (we don't prescribe finasteride to men trying for a baby). All finasteride removed; only Minoxidil tablets and spray (runs/e02-trying-baby). _(affects: Finasteride tablets (generic), Propecia (branded finasteride), Dual Action - Tablet + Spray, Dual Action - Tablets)_ _[observed]_
- `None of the above` → **Next question**: Baseline. _[observed]_

**39. Finasteride and trying for a baby: Finasteride can affect sperm quality in some men, which may make it harder to conceive. This is uncommon and sperm quality usually improves after stopping treatment . Only small amounts of finasteride pass into semen. Harm to a baby through this exposure is considered very unlikely. As a precaution, we don't prescribe finasteride to men who are trying for a baby. If you are planning to try for a baby, we recommend stopping finasteride at least 3 months before trying to conceive.**  
_consent · anonymous · role: safety-screen · shown: 108003 = trying for a baby · no branch · observed_  
Why they ask: No finasteride when trying for a baby.

- `I understand` → **Next question**: Acknowledgement; continues. _[observed]_

**40. Do you live with pets?**  
_single · anonymous · role: safety-screen · shown: only while a topical minoxidil product is still on offer (skipped after scalp changes Yes, heart/BP Yes, BP medicines or minoxidil allergy) · BRANCHES · observed_  
Why they ask: Pets (topical minoxidil is toxic to pets).  
Downstream: Yes: pets warning only; offer unchanged.

- `Yes` → **Shows a warning**: Adds a pets warning (topical minoxidil is toxic to pets; tick "I confirm"); offer unchanged (runs/e14-pets-yes). _[observed]_
- `No` → **Next question**: Baseline. _[observed]_

**41. Living with Pets: You've told us that you live with pets. Some of our treatments contain topical minoxidil , which is toxic to all pets including cats and dogs . The main risk is accidental exposure, for example if a pet licks minoxidil from your fingers, hair, skin, clothing, or bedding after application. Oral tablets or capsules are less likely to pose a risk because the medication does not sit on your hair or skin in the same way. However, tablets or capsules are still harmful if a pet ingests them. By continuing, you confirm that you understand this risk and will take appropriate precautions to protect your pets.**  
_consent · anonymous · role: safety-screen · shown: 108001 = Yes · no branch · observed_  
Why they ask: Pet safety confirmation.

- `I confirm` → **Next question**: Acknowledgement; continues. _[observed]_

**42. Clinically proven results: 1 Hu et al., Dermatol Ther 2015, 2 Kaufman et al., JAAD 1998, 3 Olsen et al., JAAD 2007**  
_info · anonymous · role: marketing · shown: only when both finasteride and minoxidil are still on offer (skipped in every run where either drug was removed) · no branch · observed_  
Why they ask: Marketing: clinically proven results with study citations.


**43. Your Recommendations: Dr. Sameer Sanghvi General Practitioner (GP) GMC no. 7085078 Consultation overview: - Your hair loss is consistent with male pattern hair loss - You're new to hair loss treatment Our recommendation: - You're suitable for Finasteride tablets , Minoxidil tablets and Minoxidil spray - As you're new to hair loss treatment, we'd recommend starting with a licensed treatment, such as Finasteride tablets and Minoxidil spray - Combining Finasteride with Minoxidil may provide greater benefits than using either treatment alone, as they work in different ways.**  
_single · anonymous · role: product-selector · shown: after the answers summary · BRANCHES · observed_  
Why they ask: Recommendation screen with product cards (shown before any account).

- `Dual Action - Tablet + Spray` → **Next question**: Choosing a card opens the pack-size step for that product. _[observed]_
- `Dual Action - Tablets` → **Next question**: Choosing a card opens the pack-size step for that product. _[observed]_
- `Finasteride tablets` → **Next question**: Choosing a card opens the pack-size step for that product. _[observed]_
- `Minoxidil tablets` → **Next question**: Choosing a card opens the pack-size step for that product. _[observed]_
- `Sons Minoxidil spray` → **Next question**: Choosing a card opens the pack-size step for that product. _[observed]_
- `Propecia` → **Next question**: Choosing a card opens the pack-size step for that product. _[observed]_

**44. Choose your pack size: **  
_single · anonymous · role: product-selector · shown: after choosing a product card · no branch · observed_  
Why they ask: Pack size and subscription or one-off purchase.

- `1 month / 3 months / 6 months (tabs) x Subscription or One time purchase, then "Add to basket"` → **Next question**: Picks the pack; the baseline pressed Add to basket on the default (6 months subscription, £138.00 billed every 6 months). _(affects: Finasteride tablets (generic))_ _[observed]_

**45. Your Safety: Important safety information for your treatment: Finasteride has been associated with causing: - Low mood, depression, and suicidal thoughts - Sexual side effects such as reduced sex drive, difficulty getting or maintaining an erection, and problems with ejaculation. - Changes in breast tissue , including lumps, pain, or nipple discharge. If you develop depression or suicidal thoughts, stop treatment and contact your doctor immediately. If you ever feel at risk of harming yourself or have seriously harmed yourself, call emergency services on 999 immediately.**  
_consent · anonymous · role: consent · shown: after choosing a finasteride product · no branch · observed_  
Why they ask: Finasteride safety information to acknowledge.

- `I understand` → **Next question**: Acknowledgement; continues. _[observed]_

**46. Please confirm the following to complete your consultation: - I have responded honestly and provided complete and accurate information that reflects my up to date medical history and information, so that the LloydsPharmacy Online Doctor clinician can safely assess and advise me. - I fully understand all the questions and information provided. If I am unsure about any aspect of the service I will contact the LloydsPharmacy Online Doctor before proceeding. - I understand the side effects, effectiveness and alternatives to the treatment I am requesting. - I understand the importance of notifying my GP about medicines and advice I may receive from this service so they can continue to provide safe medical care. - I understand this consultation will form part of my Online Doctor medical record and will be kept in line with the relevant retention period. - I have read, understand and agree to the terms and conditions and privacy notice .**  
_consent · anonymous · role: consent · shown: end of every route, including early stops · no branch · observed_  
Why they ask: Final declarations (honesty, GP, records, terms). Not pressed: the walk stops here.

- `I confirm the above` → **Next question**: Acknowledgement; continues. _[observed]_

## 7. Competitive read

**Strengths**

- Free, anonymous route to a named-clinician recommendation with prices before any account.
- Clear, consistent safety logic: removes whole drug families for real contraindications (heart/BP, ED tablets with oral minoxidil, age 65+, kidney disease, 5-ARI use).
- Smart skipping: pets and pregnancy questions disappear once the drug they relate to is off the table, so the patient is not asked irrelevant questions.
- Takes a proper treatment history: benefit, duration, adherence and side effects for each previous product, and lets the patient choose to retry finasteride after side effects.
- Mental-health screen with a finasteride opt-out and crisis signposting; expectation-setting for temple-only and extensive loss.

**Weaknesses**

- Men only: women are stopped after one question.
- Several removals are silent: breast or prostate cancer, sex-life problems, heart/BP, age 65+ and kidney disease change the offer with no screen explaining why.
- Blunt rules: a heart or BP condition (even treated, mild hypertension) removes the minoxidil spray as well as tablets; "problems with my sex life" removes finasteride outright instead of discussing it.
- No personalisation of strength, dose or plan: one 1 mg finasteride, one minoxidil tablet strength, one 5% spray. A failed product is still offered with only a wording change; no stronger or alternative option (e.g. compounded or dutasteride) exists.
- Combination packs lead the result screen while flagged out of stock.
- No questions on goals, how far the loss has progressed over time, family history, diet, stress, thyroid or iron, or photos before the recommendation.

**Gaps a new competitor could use**

- A women's hair-loss service (none here).
- Products for men excluded from both drugs (e.g. heart/BP plus finasteride exclusion) currently get nothing: offer non-drug or cosmetic routes and GP signposting.
- Strength and format choice: low-dose oral minoxidil titration, foam for sensitive scalps, topical finasteride, or a step-up for non-responders.
- Explain every removal on the result screen and give a next step, which Lloyds does not do for its silent exclusions.
- In-stock combination packs: Lloyds leads with combinations it cannot supply.

## 8. Experiments run (51)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| base-full | men | none (baseline replay, full) | Same as stage 1: 6 cards (Dual Action Tablet + Spray and Dual Action Tablets first, both out of stock; then Finasteride, Minoxidil tablets, Sons spray, Propecia). "You're new to hair loss treatment... we'd recommend starting with a licensed treatment, such as Finasteride tablets and Minoxidil spray." Pack size for finasteride: subscription £28 / £80 / £138, one-off £34 / £95 / £163. Finasteride safety screen, then final consent (not pressed). No sign-in asked up to there. |
| e01-heart-yes | men | 107973 heart/BP: No → Yes | No extra screen. Only Finasteride and Propecia offered: oral AND topical minoxidil and both Dual packs removed. Pets and "Clinically proven results" screens skipped. |
| e02-trying-baby | men | 108003: None → trying for a baby | Warning 108004, then only Minoxidil tablets and Sons spray: all finasteride removed. |
| e03-partner-pregnant | men | 108003: None → My partner is pregnant | No change at all. |
| e04-dep-nofin | men | 103270: None → Depression, then 103268 "I don't want to use finasteride tablets" | Only Minoxidil tablets and spray; baby question skipped. |
| e05-dep-continue | men | 103270: None → Depression, then continue | 4 mental-health questions (answered: past low mood, resolved). Same 6 products; "licensed first" line dropped. |
| e06-scalp-yes | men | 105935 scalp changes: No → Yes | "See your GP" warning; Sons spray and Dual Tablet + Spray removed; pets question skipped. Licensed-first line now names Finasteride tablets only. |
| e07-prev-topminox | men | 108014: No → Yes; 108015 = Topical minoxidil (helped, no side effects) | Adds 108016 and 107959. Same 6 products; text "You've previously used hair loss treatment"; licensed-first line dropped. |
| e07b-prev-topminox-peek | men | 108014 Yes, topical minoxidil, peek at 108016 options | Every 108016 answer leads to side effects 107959; Yes adds a describe box 107981. (Peek run: not a full replay.) |
| e08-prev-fin | men | 108014: No → Yes; 108015 = Finasteride (helped, no side effects) | Adds 108022 and 107959. Same 6 products; previously-used wording. |
| e09-prev-topminox-nobenefit | men | as e07 but 108016 = No benefit (12 months+, regular) | Adds 108017 + 108018. Same 6 products; text adds "Previously, treatment with Minoxidil spray didn't achieve the results you were hoping for." Spray still offered. |
| e10-prev-fin-sidefx | men | as e08 but side effects Yes, 108051 = No | Adds 107981 and 108051. All finasteride removed; "You reported side effects to hair loss treatments". |
| e11-allergy-minox | men | 102624: No → Yes; 100038 = Minoxidil | Ingredients warning; all minoxidil removed (only Finasteride, Propecia); pets skipped. |
| e12-allergy-fin | men | 102624: No → Yes; 100038 = Finasteride | Ingredients warning; all finasteride removed (only Minoxidil tablets and spray); baby question skipped. |
| e13-prev-fin-sidefx-again | men | as e10 but 108051 = Yes | All 6 products back; "...but would like to be recommended options containing Finasteride tablets". |
| e14-pets-yes | men | 108001 pets: No → Yes | Pets warning 108002 (I confirm); no change to offer or text. |
| e15-ckd-egfr-over30 | men | 101561 CKD: No → Yes; eGFR more than 30 | Minoxidil tablets and Dual Action Tablets removed; licensed-first line dropped. |
| e16-ckd-egfr-unknown | men | 101561 CKD: Yes; eGFR I don't know | Same as e15. |
| e17-age-17 | men | 100014 date of birth: 1994 → 2009 (age 17) | Questions end at once; redirected to "We do not treat under 18s" page. |
| e18-age-70 | men | 100014: age 32 → 70 | Minoxidil tablets and Dual Action Tablets removed; licensed-first line dropped. |
| e19-age-65 | men | 100014: age 32 → 65 | Same as e18 (oral minoxidil removed). |
| e20-age-19 | men | 100014: age 32 → 19 | No change. |
| e21-age-64 | men | 100014: age 32 → 64 | No change (so the oral minoxidil cut-off is 65). |
| e22-pattern-temples | men | 103257: Temples and Crown → Temples only | Expectation screen 108138; no change to offer or text. |
| e23-pattern-extensive | men | 103257: Temples and Crown → Extensive | Expectation screen 108376; no change to offer or text. |
| e24-skip-learn | men | 107977: Tell me more → Skip, I already know | 3 education screens skipped; no change. |
| e25-breast-cancer | men | 103270: None → Breast cancer | No extra screen; all finasteride removed; baby question skipped. |
| e26-prostate-cancer | men | 103270: None → Prostate cancer | No extra screen; all finasteride removed. |
| e27-bp-meds | men | 102632: No → Yes; 103769 = blood pressure medicines | All minoxidil removed (only Finasteride, Propecia); pets skipped. |
| e28-antidepressants | men | 102632: No → Yes; 103769 = antidepressants | Adds medication-list text 101599; no change to offer. |
| e29-5ari-prostate | men | 102632: No → Yes; 103769 = finasteride/dutasteride for prostate | All finasteride removed. |
| e30-ed-tablets | men | 102632: No → Yes; 103769 = ED tablets | Finasteride products and Minoxidil tablets removed: only Sons Minoxidil spray offered. |
| e31-gynaecomastia | men | 103270: None → Breast tissue enlargement | No extra screen; all finasteride removed. |
| e32-sex-problems | men | 103270: None → Problems with my sex life | No extra screen; all finasteride removed. |
| e33-other-condition | men | 107800: No → Yes | Adds details text 107160; no change to offer. |
| verify-base | men | none (stage 3 baseline replay) | Same path, same 6 cards, prices and wording as runs/exp-base. |
| verify-heart | men | men-107973: No -> Yes | Only Finasteride tablets and Propecia; all minoxidil removed, spray included; 108001 and 108360 skipped. Confirms R7. |
| verify-age-65 | men | date of birth 15/6/1994 -> 15/6/1961 (age 65) | Minoxidil tablets and Dual Action Tablets removed; licensed-first line dropped. Confirms R3. |
| verify-ed-tablets | men | men-102632 Yes + men-103769 ED tablets | Only Sons Minoxidil spray. Confirms R12. |
| verify-trying-baby-2 | men | men-108003 -> trying for a baby | Warning 108004, then only Minoxidil tablets and spray. Confirms R13. (First try runs/verify-trying-baby stalled at the pets screen.) |
| verify-prostate-cancer-2 | men | men-103270 -> Prostate cancer | All finasteride removed, no screen, 108003 skipped. Confirms R15. (First try runs/verify-prostate-cancer stalled.) |
| verify-egfr-under30 | men | men-101561 Yes + men-101564 Less than 30 | Questions end after the eGFR question; summary and final consent, no product. Confirms R10. |
| verify-female | men | men-100013: Male -> Female | Date of birth asked, then summary and final consent, no product. Confirms R1 (wording corrected). |
| verify-sudden | men | men-107954 -> Suddenly, over days or weeks | Questions end; summary and final consent, no product. Confirms R4 for sudden onset. |
| verify-gap-phaeo | men | men-103270 -> Phaeochromocytoma | Minoxidil tablets and Dual Action Tablets removed, nothing else. New R28. |
| verify-gap-porphyria | men | men-103270 -> Porphyria | Same as phaeochromocytoma. New R28. |
| verify-gap-sle | men | men-103270 -> SLE | Same as phaeochromocytoma. New R28. |
| verify-gap-scalp-creams | men | men-102632 Yes + men-103769 medicated scalp creams | Spray and Dual Tablet + Spray removed, pets question skipped. New R29. |
| verify-gap-egfr-notest | men | men-101561 Yes + men-101564 I haven't had an eGFR test | Minoxidil tablets and Dual Action Tablets removed (as inferred). Extends R11. |
| verify-combo-heart-prostate | men | men-107973 Yes AND men-103270 Prostate cancer (two changes) | No product left: questions end after 107800, summary and final consent, no recommendation. New R30. |
| verify-gap-testosterone | men | men-102632 Yes + 103769 antidepressants + 108158 Testosterone or Anabolic steroids | Steroid warning screen (103277) and medicines list (101599); all 6 cards and the same wording. |

## 9. Independent verification

High trust for what it covers. All 8 high-impact rules re-tested live in stage 3 gave exactly the recorded result: heart/BP removes every minoxidil product, age 65 removes oral minoxidil, ED tablets leave only the spray, trying for a baby and prostate cancer remove every finasteride product, and female, sudden onset and eGFR under 30 end the questions. The baseline replay matched card for card, and all 7 product prices and strengths match the live pages. No rule was contradicted; one wording error was fixed (a woman is still asked her date of birth), and seven gaps were filled, all fitting the same subtraction engine. The weak points are what was never seen: the account wall after the final consent, a few rare options, and answer combinations other than the one tested.

**Re-checked**

- Baseline man replayed fresh (runs/verify-base): same path, same 6 cards, prices and wording as runs/exp-base. Confirmed.
- R7 heart/BP Yes (runs/verify-heart): only Finasteride and Propecia; every minoxidil product removed, spray included. Confirmed.
- R3 age 65 (runs/verify-age-65): Minoxidil tablets and Dual Action Tablets removed. Confirmed.
- R12 ED tablets (runs/verify-ed-tablets): only Sons Minoxidil spray offered. Confirmed.
- R13 trying for a baby (runs/verify-trying-baby-2): warning, then all finasteride removed. Confirmed.
- R15 prostate cancer (runs/verify-prostate-cancer-2): all finasteride removed with no screen. Confirmed.
- R10 eGFR less than 30 (runs/verify-egfr-under30): questions end, no product. Confirmed.
- R4 sudden onset (runs/verify-sudden): questions end, no product. Confirmed.
- R1 female (runs/verify-female): no product. Confirmed, but date of birth is still asked first (wording corrected).
- Product facts against live product pages (curl, 24 Nov 2026): names, strengths and one-off prices of all 7 catalogue products match: finasteride 1 mg £34/£95/£163; Propecia 1 mg £60.50/£148.50/£210; Sons minoxidil 5% £33/£54/£99; hair loss tablets (minoxidil 2.5 mg) £29/£77/£142; both Dual Action packs £106/£189; Minoxidil 5% solution £51 (3 months).
- Hair-loss collection page still says "These treatments can only be prescribed to men"; no women's hair-loss product found.
- Evidence labels: every rule marked observed now names existing run folders (shorthand folder names in R23, R24, R26 written out in full).

**Corrected**

- R1 and the Female option: the questions do not end 'at once'; date of birth is asked first, then summary and consent (runs/verify-female).
- Phaeochromocytoma, Porphyria and SLE changed from unknown to observed: each removes oral minoxidil only (new R28). The earlier guess 'likely removes minoxidil' was partly right; the spray stays.
- Medicated scalp creams changed from unknown to observed: removes topical minoxidil (new R29).
- eGFR 'I haven't had a test' changed from inferred to observed (R11 widened).
- Testosterone or anabolic steroids: confirmed warning only, offer unchanged (added to R27).
- Combination gap closed: heart/BP plus prostate cancer leaves no product and the questions end early (new R30; the limitation saying combinations were not replayed is narrowed).
- Recommendation profiles, recommendedWhen for minoxidil tablets and spray, engineSummary and limitations updated to match.

**Still unverified**

- The exact sign-in point after the final consent (100467), which was never pressed.
- Two liver sub-options, previous oral minoxidil / other medication, 'too early to tell', 'less than 12 months', irregular use, 108419 Yes, Guanethidine and obstructive uropathy to the end.
- Pack-size and safety screens for products other than finasteride; subscription prices for products other than finasteride.
- Other two-answer combinations (assumed to follow the same subtraction logic).
- Rules not re-tested in stage 3 (R2, R5, R6, R8, R9, R14, R16-R22, R25-R27 except where noted) rest on stage 1 and 2 runs only.
- A dead link on the Propecia page to a 'finasteride and Regaine bundle' (404): presumably a withdrawn product; not in the catalogue.

## 10. Limits of this report

- Only the anonymous part of the flow was tested; the final consent (100467) was not pressed, so the exact sign-in point and the clinician review step are unseen.
- Untested options are marked unknown or inferred: two liver sub-options, previous oral minoxidil / other medication, "too early to tell", "less than 12 months", irregular use, 108419 Yes, the minor medicines in 108158, Guanethidine and obstructive uropathy to the end.
- Only one combination of answers was replayed (heart/BP plus prostate cancer). Other combinations are assumed to follow the same subtraction logic (inferred).
- Pack size and safety screens were only walked for finasteride; plan prices for other products come from the product data, not a walk.
- Free-text answers were neutral; a clinician may act on them after submission, which cannot be seen.
- FAQ, help-centre and subscription-terms pages were not read. Legal status of the minoxidil sprays is inferred.
- Stock flags (both Dual Action packs out of stock) and prices were checked on 24 Nov 2026 and can change.

## 11. Sources

- [Hair loss collection](https://onlinedoctor.lloydspharmacy.com/collections/hair-loss)
- [Hair loss subscription page](https://onlinedoctor.lloydspharmacy.com/pages/hair-loss-subscription)
- [Finasteride tablets](https://onlinedoctor.lloydspharmacy.com/products/finasteride-hair-loss)
- [Propecia](https://onlinedoctor.lloydspharmacy.com/products/propecia-hair-loss)
- [Sons Minoxidil spray](https://onlinedoctor.lloydspharmacy.com/products/minoxidil-solution)
- [Hair loss tablets (oral minoxidil)](https://onlinedoctor.lloydspharmacy.com/products/hair-loss-tablets)
- [Dual Action tablet + spray](https://onlinedoctor.lloydspharmacy.com/products/dual-action-tablets-spray)
- [Dual Action tablets](https://onlinedoctor.lloydspharmacy.com/products/dual-action-tablets)
- [Terms and conditions](https://onlinedoctor.lloydspharmacy.com/info/about-us/terms-and-conditions)
- [Privacy notice](https://onlinedoctor.lloydspharmacy.com/uk/privacy-notice)
- [Consultation engine (guest start)](https://core.onlinedoctor.lloydspharmacy.com/api/questionnaire/clinic/hair-loss?guest)
