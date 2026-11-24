# LloydsPharmacy Online Doctor (UK) — digest
Slug: lloyds-online-doctor · Verified: yes · Audiences: men

Model: UK online pharmacy and doctor service (Shopify shop front plus a server-driven questionnaire engine) selling licensed and off-label prescription hair-loss medicines to men.
Account wall: No sign-in is needed for the questions or the recommendation. "Continue as a new patient" (…/clinic/hair-loss?guest) starts as a guest. After the recommendation, choosing a product, the pack size (Add to basket) and a finasteride safety screen, the last screen is "Please confirm the following to complete your consultation" (question 100467, "I confirm the above"). The walk stopped there and did not press it, so the exact sign-in point (expected straight after it) was not seen.
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 walked every question on the baseline path and every option one level deep. Stage 2 (24 Nov 2026) replayed the baseline and ran 33 one-change experiments to the recommendation screen, comparing cards and wording (runs/e01 to runs/e33). Options not replayed are marked unknown or inferred. Stage 3 (24 Nov 2026) replayed the baseline and 8 key rules (all confirmed) and filled 7 gaps (phaeochromocytoma, porphyria, SLE, scalp creams, eGFR not tested, testosterone, and one two-change combination); see verification.

Questions: 53 (53 before sign-in; 28 branch). Flows: men (53q)

## Engine summary
A server-side rules engine (one screen per answer) works as a subtraction filter. It starts from six cards for every eligible man (two combination packs, generic finasteride, oral minoxidil, Sons minoxidil spray, Propecia) and removes whole drug families: any finasteride exclusion (baby plans, breast or prostate cancer, breast tissue enlargement, sex-life problems, 5-ARI or ED medicines, allergy, mood opt-out, past side effects declined) drops every finasteride product; heart/BP disease, BP medicines or minoxidil allergy drop every minoxidil product, even the spray; age 65+, kidney disease, phaeochromocytoma, porphyria, SLE or ED tablets drop oral minoxidil; scalp changes or medicated scalp creams drop topicals. When both families are gone, the questions end early with no product. Hard stops end the questions for women, under-18s, non-pattern loss and severe kidney or liver disease. Answers never change strength, dose, plan or price, and never add a product: history and efficacy answers only change the result wording. Follow-up questions are skipped once the drug they protect is gone.

## Rules
| id | when | then | effect | evidence | conf |
|---|---|---|---|---|---|
| R1 | men-100013 = Female | Date of birth is still asked, then the questions end: answers summary and final consent, no recommendation (men-only service). | hard-stop | observed | high |
| R2 | age (from men-100014) under 18 | Questions end at once; redirect to "We do not treat under 18s". | hard-stop | observed | high |
| R3 | age 65 or over | Minoxidil tablets and Dual Action Tablets removed (no screen tells the patient why). [Hair loss tablets (oral minoxidil); Dual Action - Tablets] | product-removed | observed | high |
| R4 | men-103257 = Complete or Random patches; men-107954 = Suddenly; men-103261 = Yes; men-103270 includes Alopecia | Questions end at once; no recommendation (not male pattern hair loss). | hard-stop | observed | high |
| R5 | men-103257 = Temples only or Extensive | Expectation screen that must be ticked; offer unchanged. | soft-warning | observed | high |
| R6 | men-105935 = Yes (scalp changes) | Topical minoxidil removed (Sons spray, Dual Tablet + Spray); "see your GP" screen; pets question skipped. [Sons Minoxidil spray; Dual Action - Tablet + Spray] | product-removed | observed | high |
| R7 | men-107973 = Yes (heart or blood pressure condition) | Every minoxidil product removed, oral AND topical; only Finasteride and Propecia offered. [Hair loss tablets (oral minoxidil); Sons Minoxidil spray; Dual Action - Tablets; Dual Action - Tablet + Spray] | product-removed | observed | high |
| R8 | men-103769 includes blood pressure medicines | Every minoxidil product removed, oral and topical. [Hair loss tablets (oral minoxidil); Sons Minoxidil spray; Dual Action - Tablets; Dual Action - Tablet + Spray] | product-removed | observed | high |
| R9 | men-100038 includes Minoxidil (allergy) | Every minoxidil product removed, after an ingredients warning. [Hair loss tablets (oral minoxidil); Sons Minoxidil spray; Dual Action - Tablets; Dual Action - Tablet + Spray] | product-removed | observed | high |
| R10 | men-101561 = Yes and men-101564 = Less than 30 | Questions end at once; no recommendation. | hard-stop | observed | high |
| R11 | men-101561 = Yes and men-101564 = More than 30, I don't know, or I haven't had an eGFR test in the past year | Minoxidil tablets and Dual Action Tablets removed; topical kept. [Hair loss tablets (oral minoxidil); Dual Action - Tablets] | product-removed | observed | high |
| R12 | men-103769 includes erectile dysfunction tablets | Finasteride products and Minoxidil tablets removed; only Sons Minoxidil spray offered. [Finasteride tablets (generic); Propecia (branded finasteride); Dual Action - Tablet + Spray; Dual Action - Tablets; Hair loss tablets (oral minoxidil)] | product-removed | observed | high |
| R13 | men-108003 = planning or trying for a baby | Warning screen; every finasteride product removed. [Finasteride tablets (generic); Propecia (branded finasteride); Dual Action - Tablet + Spray; Dual Action - Tablets] | product-removed | observed | high |
| R14 | men-108003 = My partner is pregnant | No change (only the standard card note that pregnant women must not handle finasteride). | none | observed | high |
| R15 | men-103270 includes Breast cancer, Breast tissue enlargement, Prostate cancer or Problems with my sex life | Every finasteride product removed silently (no screen). [Finasteride tablets (generic); Propecia (branded finasteride); Dual Action - Tablet + Spray; Dual Action - Tablets] | product-removed | observed | high |
| R16 | men-103769 includes finasteride or dutasteride for prostate problems | Every finasteride product removed. [Finasteride tablets (generic); Propecia (branded finasteride); Dual Action - Tablet + Spray; Dual Action - Tablets] | product-removed | observed | high |
| R17 | men-100038 includes Finasteride (allergy) | Every finasteride product removed. [Finasteride tablets (generic); Propecia (branded finasteride); Dual Action - Tablet + Spray; Dual Action - Tablets] | product-removed | observed | high |
| R18 | men-103270 includes Depression and men-103268 = I don't want to use finasteride tablets | Every finasteride product removed. [Finasteride tablets (generic); Propecia (branded finasteride); Dual Action - Tablet + Spray; Dual Action - Tablets] | product-removed | observed | high |
| R19 | men-103270 includes Depression and men-103268 = continue | Four mental-health questions; offer unchanged (with neutral answers); licensed-first line dropped. | extra-questions | observed | medium |
| R20 | men-107959 = Yes for finasteride and men-108051 = No | Every finasteride product removed; result notes reported side effects. [Finasteride tablets (generic); Propecia (branded finasteride); Dual Action - Tablet + Spray; Dual Action - Tablets] | product-removed | observed | high |
| R21 | men-108014 = Yes (any previous treatment) | Result says "You've previously used hair loss treatment" and drops "start with a licensed treatment"; products unchanged. | none | observed | high |
| R22 | previous product "No benefit" (12 months+, regular use) | Result adds "treatment with <product> didn't achieve the results you were hoping for"; the product is still offered (no switch). | none | observed | high |
| R23 | any answer that removes finasteride | The partner-pregnancy question (108003) is skipped, because it only matters for finasteride. | skip-questions | observed | high |
| R24 | any answer that removes topical minoxidil | The pets question (108001) is skipped, because it only matters for topical minoxidil. | skip-questions | observed | high |
| R25 | either drug removed | The "Clinically proven results" screen (108360) and the combination packs are dropped; remaining single products become the main cards. | skip-questions | observed | high |
| R26 | new to treatment, no mental-health history, and finasteride, oral minoxidil and spray (or the scalp-limited set) all on offer | The result adds "As you're new to hair loss treatment, we'd recommend starting with a licensed treatment" (naming finasteride and/or the spray). Dropped after previous treatment, depression, age 65+, CKD or any finasteride removal. | none | observed | medium |
| R27 | men-108001 = Yes, men-107800 = Yes, men-103769 includes antidepressants, men-107977 = Skip, men-108158 includes Testosterone or Anabolic steroids | Warning or free-text screen only; offer unchanged. | none | observed | high |
| R28 | men-103270 includes Phaeochromocytoma, Porphyria or Systemic Lupus Erythematosus (SLE) | Minoxidil tablets and Dual Action Tablets removed silently (no screen); finasteride, Propecia and the spray stay. [Hair loss tablets (oral minoxidil); Dual Action - Tablets] | product-removed | observed | high |
| R29 | men-103769 includes medicated creams applied to the scalp | Sons Minoxidil spray and Dual Action Tablet + Spray removed (same as scalp changes); pets question skipped. [Sons Minoxidil spray; Dual Action - Tablet + Spray] | product-removed | observed | high |
| R30 | An answer set that removes both drug families, e.g. men-107973 = Yes (heart/BP) and men-103270 includes Prostate cancer | No product is left, so the questions end early (straight after the next question) and go to the answers summary and final consent, with no recommendation screen. | hard-stop | observed | high |

## Products
| name | category | actives | form | for | legal | price | offered when | ev |
|---|---|---|---|---|---|---|---|---|
| Finasteride tablets (generic) | rx-oral | finasteride 1 mg | tablet | men | POM, licensed for male pattern hair loss | £34 (1 month), £95 (3 months), £163 (6 months) one-off | Offered unless any finasteride exclusion is given: trying for a baby, breast cancer, breast tissue enlargement, prostate cancer, problems with sex life, 5-ARI for prostate, ED tablets, finasteride allergy, depression opt-out, or past finasteride side effects with "No" to trying again. The only drug left for heart/BP, BP medicines or minoxidil allergy. Named in the "licensed first" advice for new patients (observed). | observed |
| Propecia (branded finasteride) | rx-oral | finasteride 1 mg | tablet | men | POM, licensed | £60.50 (1 month), £148.50 (3 months), £210 (6 months) one-off | Same rules as generic finasteride; always listed under "Other suitable treatments" next to it (observed). | observed |
| Sons Minoxidil spray | otc-medicine | minoxidil 5% | topical spray (solution) | men | P medicine (minoxidil 5% topical; inferred from UK status of 5% minoxidil solutions) | £33 (1 month), £54 (3 months), £99 (6 months) | Offered unless scalp changes, medicated scalp creams, heart/BP condition, BP medicines or minoxidil allergy. The only product left for men on ED tablets. Named in the "licensed first" advice (observed). | observed |
| Hair loss tablets (oral minoxidil) | rx-oral | minoxidil 2.5 mg | tablet | men | POM used off-label (minoxidil tablets are licensed for high blood pressure, not hair loss) | £29 (1 month), £77 (3 months), £142 (6 months) | Offered unless age 65 or over, kidney disease (eGFR over 30, unknown or not tested), phaeochromocytoma, porphyria, SLE, heart/BP condition, BP medicines, ED tablets or minoxidil allergy (observed). | observed |
| Dual Action - Tablet + Spray | bundle | finasteride 1 mg tablet; minoxidil 5% spray | tablet + spray | men | POM tablet + P spray; card says "Licensed for hair loss" | £106 (3 months), £189 (6 months) | Shown first whenever both finasteride and topical minoxidil are allowed (no exclusion for either); flagged out of stock on 24 Nov 2026 (observed). | observed |
| Dual Action - Tablets | bundle | finasteride 1 mg; minoxidil 2.5 mg | two tablets | men | POM; card says "Contains off-label medicine" (oral minoxidil) | £106 (3 months), £189 (6 months) | Shown whenever both finasteride and oral minoxidil are allowed; first card when topicals are excluded (scalp changes); out of stock on 24 Nov 2026 (observed). | observed |
| Minoxidil 5% solution | otc-medicine | minoxidil 5% | topical solution | men | P medicine (inferred) | £51 (3 months) | Never offered in any consultation route tested; sold on the shop pages only (observed: absent from every recommendation screen). | docs |

## Who gets what
- Baseline man: 32, temples and crown, gradual, no conditions, no medicines, no allergies, new to treatment → Dual Action - Tablet + Spray; Dual Action - Tablets; Finasteride tablets (generic); Hair loss tablets (oral minoxidil); Sons Minoxidil spray; Propecia (branded finasteride) [observed] Two combination packs first (both out of stock), then Finasteride, Minoxidil tablets, Sons spray, Propecia. Advises starting with a licensed treatment (finasteride and the spray). Finasteride 6-month pack £138 on subscription or £163 one-off.
- Baseline woman → nothing [observed] Not served: men only. Female at the first question: date of birth is asked, then the questions end with no product (runs/verify-female).
- Man under 18 → nothing [observed] Stopped after date of birth: "We do not treat under 18s".
- Man 65 or over, with kidney disease (eGFR over 30, unknown or not tested), phaeochromocytoma, porphyria or SLE → Dual Action - Tablet + Spray; Finasteride tablets (generic); Sons Minoxidil spray; Propecia (branded finasteride) [observed] Oral minoxidil (and Dual Action Tablets) removed; "licensed first" line dropped.
- Man with heart/BP condition, on BP medicines, or allergic to minoxidil → Finasteride tablets (generic); Propecia (branded finasteride) [observed] Finasteride only (generic or Propecia).
- Man with a finasteride exclusion (trying for a baby, breast or prostate cancer, breast tissue enlargement, sex-life problems, 5-ARI for prostate, finasteride allergy, depression opt-out, past finasteride side effects and declines it) → Hair loss tablets (oral minoxidil); Sons Minoxidil spray [observed] Minoxidil tablets and Sons spray as the two main cards.
- Man with scalp changes → Dual Action - Tablets; Finasteride tablets (generic); Hair loss tablets (oral minoxidil); Propecia (branded finasteride) [observed] Topicals removed; Dual Action Tablets first; licensed-first advice names finasteride only.
- Man taking erectile dysfunction tablets → Sons Minoxidil spray [observed] Only Sons Minoxidil spray.
- Man who used treatment before (helped or not, no side effects) → Dual Action - Tablet + Spray; Dual Action - Tablets; Finasteride tablets (generic); Hair loss tablets (oral minoxidil); Sons Minoxidil spray; Propecia (branded finasteride) [observed] Same products; wording says previously treated, and (if no benefit) that the product did not achieve the hoped-for results. No switch or strength change.
- Man with both a minoxidil exclusion (e.g. heart/BP) and a finasteride exclusion (e.g. prostate cancer) → nothing [observed] Questions end early; summary and final consent with no product.
- Man using medicated scalp creams → Dual Action - Tablets; Finasteride tablets (generic); Hair loss tablets (oral minoxidil); Propecia (branded finasteride) [observed] Topicals removed, as for scalp changes (runs/verify-gap-scalp-creams).

## Strengths
- Free, anonymous route to a named-clinician recommendation with prices before any account.
- Clear, consistent safety logic: removes whole drug families for real contraindications (heart/BP, ED tablets with oral minoxidil, age 65+, kidney disease, 5-ARI use).
- Smart skipping: pets and pregnancy questions disappear once the drug they relate to is off the table, so the patient is not asked irrelevant questions.
- Takes a proper treatment history: benefit, duration, adherence and side effects for each previous product, and lets the patient choose to retry finasteride after side effects.
- Mental-health screen with a finasteride opt-out and crisis signposting; expectation-setting for temple-only and extensive loss.

## Weaknesses
- Men only: women are stopped after one question.
- Several removals are silent: breast or prostate cancer, sex-life problems, heart/BP, age 65+ and kidney disease change the offer with no screen explaining why.
- Blunt rules: a heart or BP condition (even treated, mild hypertension) removes the minoxidil spray as well as tablets; "problems with my sex life" removes finasteride outright instead of discussing it.
- No personalisation of strength, dose or plan: one 1 mg finasteride, one minoxidil tablet strength, one 5% spray. A failed product is still offered with only a wording change; no stronger or alternative option (e.g. compounded or dutasteride) exists.
- Combination packs lead the result screen while flagged out of stock.
- No questions on goals, how far the loss has progressed over time, family history, diet, stress, thyroid or iron, or photos before the recommendation.

## Opportunities
- A women's hair-loss service (none here).
- Products for men excluded from both drugs (e.g. heart/BP plus finasteride exclusion) currently get nothing: offer non-drug or cosmetic routes and GP signposting.
- Strength and format choice: low-dose oral minoxidil titration, foam for sensitive scalps, topical finasteride, or a step-up for non-responders.
- Explain every removal on the result screen and give a next step, which Lloyds does not do for its silent exclusions.
- In-stock combination packs: Lloyds leads with combinations it cannot supply.

## Verification verdict
High trust for what it covers. All 8 high-impact rules re-tested live in stage 3 gave exactly the recorded result: heart/BP removes every minoxidil product, age 65 removes oral minoxidil, ED tablets leave only the spray, trying for a baby and prostate cancer remove every finasteride product, and female, sudden onset and eGFR under 30 end the questions. The baseline replay matched card for card, and all 7 product prices and strengths match the live pages. No rule was contradicted; one wording error was fixed (a woman is still asked her date of birth), and seven gaps were filled, all fitting the same subtraction engine. The weak points are what was never seen: the account wall after the final consent, a few rare options, and answer combinations other than the one tested.

## Limitations
- Only the anonymous part of the flow was tested; the final consent (100467) was not pressed, so the exact sign-in point and the clinician review step are unseen.
- Untested options are marked unknown or inferred: two liver sub-options, previous oral minoxidil / other medication, "too early to tell", "less than 12 months", irregular use, 108419 Yes, the minor medicines in 108158, Guanethidine and obstructive uropathy to the end.
- Only one combination of answers was replayed (heart/BP plus prostate cancer). Other combinations are assumed to follow the same subtraction logic (inferred).
- Pack size and safety screens were only walked for finasteride; plan prices for other products come from the product data, not a walk.
- Free-text answers were neutral; a clinician may act on them after submission, which cannot be seen.
- FAQ, help-centre and subscription-terms pages were not read. Legal status of the minoxidil sprays is inferred.
- Stock flags (both Dual Action packs out of stock) and prices were checked on 24 Nov 2026 and can change.
