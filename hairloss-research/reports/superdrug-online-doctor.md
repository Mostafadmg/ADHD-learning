# Superdrug Online Doctor: consultation and product report

**Market:** UK · **Website:** https://onlinedoctor.superdrug.com/ · **Checked:** 2026-11-23 · **Owner:** Operated by Health Bridge Ltd (the Zava platform; company no. 07392646) under the Superdrug brand; medicines dispensed by Superdrug Stores plc pharmacies

> High-street pharmacy brand running a doctor-led online clinic on the Zava platform: one-page questionnaire, patient picks a preferred product, pays, then a GMC doctor approves, swaps or refuses; one-off orders with reorder, no subscription.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** After the questionnaire, the product choice ('Your request') and the delivery choice. Pressing Next on Delivery redirects to /auth/register/ ('Create your patient account': first name, last name, email, password, date of birth, gender, optional mobile). Seen in runs/baseline-men-wall. Just before the wall the patient has already seen the full product list with prices and the delivery options.
- **Blocker:** curl gets HTTP 403; the Playwright browser loads every page normally (no checkpoint seen)
- **Blocker:** The cookie banner blocks clicks on the questionnaire until 'Deny Cookies' (#onetrust-reject-all-handler) is pressed; walk.js does not dismiss it on its own

Stage 1 mapped all three entry points and both full questionnaire definitions. Stage 2 replayed the three baselines and ran 40 one-change experiments (22 women, 18 men). Stage 3 (independent check) replayed the baselines again, re-tested 11 key rules live, added the last untested men's options (specialist diagnosis, pattern B, skin condition, peanut and other-substance allergy) and two women's combinations. Every question option except delivery choices and the men's 'Other medications' allergy has now been replayed. Age, sex and the doctor's decision sit behind the account wall and were not tested.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

Superdrug Online Doctor (Zava platform) runs no recommendation engine. Each service is a one-page medical questionnaire with show/hide follow-ups, followed by a product list the patient picks from; the doctor decides after account creation and payment. Men: the list is fixed (generic finasteride or Propecia in four pack sizes, or a £25 phone consultation). Sixteen one-change replays, including prostate cancer, breast cancer and finasteride allergy, never changed it; the only on-screen effects are warning texts (scalp symptoms, erection problems, advanced pattern E) and a photo upload that blocks the form for patterns A, E and 'none fits'. Women: a server-side product-rules call silently removes products by ingredient and suitability: Regaine for Women goes for high blood pressure, heart disease, non-pattern presentations and minoxidil/ethanol/propylene glycol allergy; Nourkrin for fish allergy; Alpecin for caffeine allergy. Removals add up: a woman allergic to minoxidil, fish and caffeine is left with only the phone consultation, with no message. Pregnancy changes nothing. No answer ever stops the patient before the account wall.

## 3. Engine rules (22)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men | men-q2 = A, E or 'No pattern fits well' | A photo-upload item appears and Next is blocked by a 'Please upload photos' error until photos are added. (Our route stops here; we never upload.) | Adds questions | observed | high |
| R2 | men | men-q2 = E | A required tick box warns that finasteride is unlikely to help extensive loss and risks may outweigh benefits; the patient may tick and continue. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ | Shows a warning | observed | high |
| R3 | men | men-q2 = B, C or D | No photo and no warning; the full list is shown. | No effect | observed | high |
| R4 | men | men-q6 = Yes (redness, itching, flaking or soreness) | A 'see your GP first' message is shown, but the form still goes through and finasteride and Propecia are still offered. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ | Shows a warning | observed | high |
| R5 | men | men-q7 = No (erection problems) | A warning about sexual side effects is shown; no stop and no change to the list. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ | Shows a warning | observed | high |
| R6 | men | men-q3 = Yes (already on finasteride) | A box on effect and side effects opens and men-q3b ('taken before?') is hidden; list unchanged. | Skips questions | observed | high |
| R7 | men | men-q5 = Suddenly | Two free-text boxes open (other causes; how it started); no warning, list unchanged. | Adds questions | observed | high |
| R8 | men | men-q8 includes Liver condition (or skin condition, by definition) | A required details box opens; list unchanged. | Adds questions | observed | high |
| R9 | men | Any single answer change on the men's questionnaire other than hair pattern A, E or 'No pattern fits well' (R1): including prostate cancer, breast cancer, skin condition, finasteride, peanut or other allergies, lactose intolerance, diagnosis by a specialist, pattern B or D, and past side effects such as low mood | The product list never changes: 4 generic finasteride packs, 4 Propecia packs and the phone consultation, at the same prices. No product-rules call is made (fhir_product_filter_enabled = 0). The help pages say a doctor reviews the order after account creation and payment; that the doctor acts on these answers is inferred, not seen. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Telephone Consultation with a Doctor (no medicine included))_ | No effect | observed | high |
| R10 | men | men-q11a = Finasteride (allergy to finasteride) | Nothing happens: no warning, no follow-up, finasteride and Propecia still offered. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ | No effect | observed | high |
| R11 | women | women-q1 includes shaved scalp, sudden or patchy loss, scalp skin problems, or hair loss after childbirth | Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain. _(affects: Regaine for Women 2% w/w solution 60ml)_ | Removes a product | observed | high |
| R12 | women | women-q2 = Yes (high blood pressure or treated for it) | Regaine for Women is removed. _(affects: Regaine for Women 2% w/w solution 60ml)_ | Removes a product | observed | high |
| R13 | women | women-q3 = Yes (heart condition) | A required details box opens and Regaine for Women is removed. _(affects: Regaine for Women 2% w/w solution 60ml)_ | Removes a product | observed | high |
| R14 | women | women-q7a includes Minoxidil, Ethanol or Propylene glycol | Regaine for Women is removed (these are its active and base ingredients). _(affects: Regaine for Women 2% w/w solution 60ml)_ | Removes a product | observed | high |
| R15 | women | women-q7a includes Fish | Nourkrin is removed. Reason (docs): the Nourkrin page says it contains Marilex, a fish extract. _(affects: Nourkrin Woman Hair Growth Tablets (60))_ | Removes a product | observed | high |
| R16 | women | women-q7a includes Caffeine | Both Alpecin caffeine shampoos are removed. _(affects: Alpecin Caffeine Shampoo 250ml, Alpecin Double Effect Shampoo 200ml)_ | Removes a product | observed | high |
| R17 | women | women-q4 = I'm pregnant or I'm breastfeeding | Nothing changes: Regaine for Women and all other products stay on the list, with no warning. Left to the doctor. _(affects: Regaine for Women 2% w/w solution 60ml)_ | No effect | observed | high |
| R18 | women | women-q5 = Yes, women-q6 = Yes, or women-q7a = Penicillin, Peanuts or Soya, Lactose, Other medication or Other substance | Details boxes open where the definition says so; the list is unchanged. | No effect | observed | high |
| R19 | women | Entry point is Request Nourkrin instead of Request Regaine for Women | The same rules apply; only the order of the first two products changes (entry product first). _(affects: Regaine for Women 2% w/w solution 60ml, Nourkrin Woman Hair Growth Tablets (60))_ | No effect | observed | high |
| R20 | both | Any answer, any flow | No answer ends the consultation with a stop screen before the account wall; the phone consultation is always offered, even when every product has been removed (runs/verify-w-combo3). The engine only shows warnings (men), blocks for photos (men patterns A, E, none fits), or silently removes products (women). _(affects: Telephone Consultation with a Doctor (no medicine included))_ | No effect | observed | medium |
| R21 | women | Several removal answers together (combinations), e.g. high blood pressure + fish allergy, or minoxidil + fish + caffeine allergy | The removals add up: the product-rules reply carries one suggestions entry per triggered rule and every listed product goes. High blood pressure + fish allergy leaves only the two Alpecin shampoos and the phone consultation. Minoxidil + fish + caffeine allergy leaves only the £25 phone consultation, with no message explaining why and no stop screen. _(affects: Regaine for Women 2% w/w solution 60ml, Nourkrin Woman Hair Growth Tablets (60), Alpecin Caffeine Shampoo 250ml, Alpecin Double Effect Shampoo 200ml)_ | Removes a product | observed | high |
| R22 | men | men-q11a includes 'Peanuts or Soya' | A required tick box warns that some makers' tablets are unsuitable for peanut or soya allergy and asks the patient to check the leaflet; after the tick the full list is shown. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ | Shows a warning | observed | high |

## 4. Products (8)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Finasteride 1mg tablets (generic)](https://onlinedoctor.superdrug.com/finasteride.html) | rx-oral | finasteride 1mg | tablet, one a day | men | POM, licensed generic (site: 'prescription-only'; made by Milpharm Ltd) | £27.00 for 28 tablets (1 month), one-off order (56 tablets £54.00; 84 tablets £79.00; 168 tablets £137.00. With code HL40 (40% off the hair-loss service): £16.20 / £32.40 / £47.40 / £82.20. No subscription: each supply is a separate order (reorder from the account). …) | Every man who completes the questionnaire with pattern B, C or D (or A/E/none-fits with photos), whatever his other answers; no answer removes it on screen. The doctor decides after payment. | observed |
| [Propecia 1mg tablets (brand)](https://onlinedoctor.superdrug.com/propecia.html) | rx-oral | finasteride 1mg | tablet, one a day | men | POM, licensed brand (Organon Pharma) | £60.00 for 28 tablets (1 month), one-off order (56 tablets £110.00; 84 tablets £140.00; 168 tablets £265.00. With code HL40: £36.00 / £66.00 / £84.00 / £159.00.) | Same as generic finasteride: always listed for men, next to it, at about twice the price. | observed |
| [Regaine for Men Extra Strength foam 50mg/g (3 x 73ml)](https://onlinedoctor.superdrug.com/regaine-for-men.html) | otc-medicine | minoxidil 5% (50mg/g) | scalp foam, twice a day | men | Non-prescription medicine (site: 'available without a prescription'; the site does not say whether it is P or GSL) | £65.99 for 3 x 73ml (Men's hair-loss treatment page (/hair-loss-treatment.html) shows £39.59 with HL40; the product page shows a different code, HL30 (£46.19).) | Never offered in the consultation: it appears on the men's price table and product page, but the men's 'Your request' list does not include it (runs/s2-baseline-men). | docs |
| [Regaine for Men Extra Strength solution 5% w/w (3 x 60ml)](https://onlinedoctor.superdrug.com/regaine-for-men.html) | otc-medicine | minoxidil 5% w/w | scalp solution, 1ml twice a day | men | Non-prescription medicine (site: 'non-prescription treatment'; P or GSL not stated) | £70.00 for 3 x 60ml (Men's hair-loss treatment page (/hair-loss-treatment.html) shows £42.00 with HL40; the product page shows HL30 (£49.00).) | Never offered in the consultation (same as the foam). | docs |
| [Alpecin Caffeine Shampoo 250ml](https://onlinedoctor.superdrug.com/alpecin.html) | cosmetic | caffeine not stated | shampoo, daily, leave on 2 minutes | both | Cosmetic shampoo (site: 'non-prescription hair loss treatment'). The product API flags it prescription=true, which looks like a set-up quirk: it is still reviewed by a doctor. | £7.50 for 250ml (Men's hair-loss treatment page (/hair-loss-treatment.html) shows £4.50 with HL40; the Alpecin page shows HL30 (£5.25) and a headline 'from £5.50' that matches no table row.) | Offered to every woman unless she reports a caffeine allergy (runs/exp-w13). Not offered to men in the consultation. | observed |
| [Alpecin Double Effect Shampoo 200ml](https://onlinedoctor.superdrug.com/alpecin.html) | cosmetic | caffeine not stated; salicylic acid not stated | anti-dandruff shampoo, daily | both | Cosmetic shampoo (non-prescription) | £9.99 for 200ml (Men's hair-loss treatment page (/hair-loss-treatment.html) shows £5.99 with HL40; the Alpecin page shows HL30 (£6.99).) | Offered to every woman unless she reports a caffeine allergy (runs/exp-w13). Not offered to men in the consultation. | observed |
| [Regaine for Women 2% w/w solution 60ml](https://onlinedoctor.superdrug.com/regaine-for-women.html) | otc-medicine | minoxidil 2% w/w | scalp solution, 1ml twice a day | women | Non-prescription medicine (P or GSL not stated on site). Product page: for women aged 18 to 65 with hereditary hair loss. | £25.00 for 60ml (One pack size only. No discount code shown on the women's pages.) | Offered to women unless they report high blood pressure, a heart condition, an allergy to minoxidil, ethanol or propylene glycol, or a shaved scalp, sudden or patchy loss, scalp skin problems or loss after childbirth. Pregnancy and breastfeeding do not remove it. | observed |
| [Nourkrin Woman Hair Growth Tablets (60)](https://onlinedoctor.superdrug.com/nourkrin-woman.html) | supplement | Marilex (fish extract) not stated | tablet, one twice a day | women | Food supplement (site: 'nutritional supplement'). Not suitable for women allergic to fish. | £51.00 for 60 tablets (1 month) (One pack size only. Hair-loss-in-women page: £0.85 per tablet.) | Offered to women unless they report a fish allergy (runs/exp-w12). | observed |
| [Telephone Consultation with a Doctor (no medicine included)](https://onlinedoctor.superdrug.com/hair-loss-consultation.html) | service | n/a | 10-minute phone call | both | Clinical service from a CQC-registered provider (Health Bridge Ltd) | £25.00 (Title says 'Available 2-3pm Friday'; its information text says appointments are 2pm to 3pm on Tuesday, Wednesday and Thursday (the site contradicts itself). Does not include treatment costs.) | Always the last option in all three entry points; never removed by any answer tested. | observed |

## 5. Who gets what (10 patient profiles)

- **Baseline man (pattern C, no issues)** → Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Telephone Consultation with a Doctor (no medicine included). Generic finasteride 1mg £27 (1 month), £54, £79, £137 (6 months); Propecia £60, £110, £140, £265; phone consultation £25. Nothing preselected. One-off orders, no subscription. (runs/s2-baseline-men) Re-confirmed in runs/verify-base-men. _[observed]_
- **Any man with any single change tested other than pattern A, E or none fits (prostate or breast cancer, liver or skin condition, finasteride, peanut, lactose or other allergy, ED, scalp symptoms, sudden or recent loss, past side effects, specialist diagnosis, pattern B or D)** → Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Telephone Consultation with a Doctor (no medicine included). Identical to baseline; warnings shown for ED and scalp symptoms only. (runs/exp-m03 to exp-m18) Stage 3 added runs/verify-m-prostate, verify-m-finallergy, verify-m-patB, verify-m-specialist, verify-m-skin, verify-m-peanut, verify-m-othersub; peanut adds a warning tick. _[observed]_
- **Man choosing pattern A, E or 'No pattern fits well'** → nothing offered. Cannot reach the product list without uploading photos (not done). (runs/exp-m01, exp-m02, exp-m16) _[observed]_
- **Baseline woman (either entry)** → Regaine for Women 2% w/w solution 60ml, Nourkrin Woman Hair Growth Tablets (60), Alpecin Caffeine Shampoo 250ml, Alpecin Double Effect Shampoo 200ml, Telephone Consultation with a Doctor (no medicine included). Regaine for Women £25, Nourkrin £51, Alpecin Caffeine £7.50, Alpecin Double Effect £9.99, phone £25; the entry product is first. (runs/s2b-women-regaine, s2b-women-nourkrin) Re-confirmed in runs/verify-base-wreg and verify-base-wnour. _[observed]_
- **Woman with high blood pressure, heart condition, minoxidil/ethanol/propylene glycol allergy, or a non-pattern presentation (shaved scalp, sudden or patchy, scalp skin problem, after childbirth)** → Nourkrin Woman Hair Growth Tablets (60), Alpecin Caffeine Shampoo 250ml, Alpecin Double Effect Shampoo 200ml, Telephone Consultation with a Doctor (no medicine included). Regaine for Women removed. (runs/exp-w03 to w08, w11, w14, w15) _[observed]_
- **Woman with a fish allergy** → Regaine for Women 2% w/w solution 60ml, Alpecin Caffeine Shampoo 250ml, Alpecin Double Effect Shampoo 200ml, Telephone Consultation with a Doctor (no medicine included). Nourkrin removed. (runs/exp-w12, w22) _[observed]_
- **Woman with a caffeine allergy** → Regaine for Women 2% w/w solution 60ml, Nourkrin Woman Hair Growth Tablets (60), Telephone Consultation with a Doctor (no medicine included). Both Alpecin shampoos removed. (runs/exp-w13) _[observed]_
- **Pregnant or breastfeeding woman** → Regaine for Women 2% w/w solution 60ml, Nourkrin Woman Hair Growth Tablets (60), Alpecin Caffeine Shampoo 250ml, Alpecin Double Effect Shampoo 200ml, Telephone Consultation with a Doctor (no medicine included). Same as baseline, Regaine included, no warning. (runs/exp-w01, w02, w21) _[observed]_
- **Woman with high blood pressure and a fish allergy** → Alpecin Caffeine Shampoo 250ml, Alpecin Double Effect Shampoo 200ml, Telephone Consultation with a Doctor (no medicine included). Regaine for Women and Nourkrin both removed; only the two Alpecin shampoos and the phone consultation. (runs/verify-w-combo-heart-fish) _[observed]_
- **Woman allergic to minoxidil, fish and caffeine** → Telephone Consultation with a Doctor (no medicine included). Every product removed; only the £25 phone consultation is left, with no explanation. (runs/verify-w-combo3) _[observed]_

## 6. The consultation, question by question

### Men's hair-loss consultation (service 147929 'HAIR LOSS SD 2', questionnaire 201037 version 7)

Entry: https://onlinedoctor.superdrug.com/hair-loss-consultation.html

One page with 11 always-shown medical questions (up to 18 conditional follow-up items) and 3 required ticks → 'Your request' (pick finasteride or Propecia pack, or a phone consultation) → Delivery choice → ACCOUNT WALL (create patient account: name, email, password, date of birth, gender) → address → order summary → payment → doctor review (not tested).

**1. These medical questions help our doctors treat you safely. Check that you fully understand them, and message us if you're unsure. (Banner above: 'Please note: This service is only available in the UK.')**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Sets the frame: answers go to a doctor. Whole questionnaire is one scrolling page.


**2. Have you been diagnosed with Androgenic Alopecia (Male Pattern Baldness)?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Records whether a doctor has already diagnosed male pattern hair loss; self-diagnosis is accepted.  
Downstream: No branch; every answer gives the same product list.

- `Yes, by my GP` → **No effect**: Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m12). The answer goes to the doctor after payment. (That the doctor sees and weighs this answer after payment is inferred; nothing on screen changes.) _[observed]_
- `Yes, by a specialist` → **No effect**: Questionnaire accepted; 'Your request' shows the same 9 options as baseline, no message (runs/verify-m-specialist). (That the doctor sees and weighs this answer after payment is inferred; nothing on screen changes.) _[observed]_
- `No, self-diagnosis` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**3. Please choose your hair pattern.**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Classifies the hair-loss pattern with pictures A to E; asks for photos when the pattern is unusual (A, E, none fits).  
Downstream: A, E and 'No pattern fits well' open a photo upload that blocks Next until photos are added; E also adds a required 'unlikely to help' tick box. B, C and D have no follow-up.

- `A` → **Adds questions**: Opens a photo-upload item. Without photos, Next does nothing and a red 'Please upload photos' error shows, so the route cannot go on without uploading photos (runs/exp-m02). We never upload photos, so what follows is unknown. _[observed]_
- `B` → **No effect**: No photo item and no warning. Questionnaire accepted; 'Your request' shows the same 9 options as baseline (runs/verify-m-patB). _[observed]_
- `C` → **No effect**: Picture: receding hairline plus a bald spot on the crown. Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_
- `D` → **No effect**: Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m15). The answer goes to the doctor after payment. No photo item and no warning. _[observed]_
- `E` → **Adds questions**: Opens a photo-upload item and a required tick box warning that finasteride is unlikely to help extensive loss. Ticking the box is allowed, but without photos Next is blocked by a 'Please upload photos' error (runs/exp-m01). _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_
- `No pattern fits well` → **Adds questions**: Opens the photo-upload item; without photos Next is blocked by the 'Please upload photos' error (runs/exp-m16). _[observed]_

**4. Please upload 2 photos clearly showing your hair pattern.**  
_photo · anonymous · role: diagnosis · shown: men-q2 = A, E or No pattern fits well · no branch · observed_  
Why they ask: Lets the doctor see unusual patterns (no visible loss, very advanced loss, or one that does not fit).  
Downstream: Required in practice: without photos a 'Please upload photos' error stops the form (runs/exp-m01, exp-m02, exp-m16), although the definition does not flag it as required.


**5. From the hair distribution image that you've selected, your hair loss may be quite extensive. In this case it is unlikely that this medication will lead to a significant improvement in your hair distribution. It is also possible that the side effects or possible risks of treatment may outweigh any benefits. Please tick to confirm if you would like to continue with the assessment.**  
_consent · anonymous · role: expectation-setting · shown: men-q2 = E · no branch · observed_  
Why they ask: Sets expectations for extensive loss and records that the patient chose to continue.

- `(tick box)` → **Shows a warning**: Required tick before 'Next' can be pressed (definition: required). It warns but does not stop the patient. Seen and ticked in runs/exp-m01 and runs/verify-m-patE (the photo item still blocked Next). _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_

**6. Are you currently using finasteride (or the brand Propecia)?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Finds out if this is a new start or continuing treatment.  
Downstream: Yes opens a box on effect and side effects and hides men-q3b; No shows men-q3b. No product change (runs/exp-m11).

- `Yes` → **Adds questions**: Opens the free-text box 'Are you finding it effective? Have you had any side effects?' and hides men-q3b. Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m11). The answer goes to the doctor after payment. _[observed]_
- `No` → **Adds questions**: Shows 'Have you taken finasteride or Propecia for hair loss before?' (seen in runs/baseline-men). Full product list shown. _[observed]_

**7. Are you finding it effective? Have you had any side effects?**  
_text · anonymous · role: safety-screen · shown: men-q3 = Yes · no branch · code_  
Why they ask: Free text for the doctor about current treatment and tolerability.


**8. Have you taken finasteride or Propecia for hair loss before?**  
_single · anonymous · role: safety-screen · shown: men-q3 = No · BRANCHES · observed_  
Why they ask: Finds past use and past side effects.  
Downstream: Yes opens a free-text box; past side effects such as low mood do not change the list (runs/exp-m14).

- `Yes` → **Adds questions**: Opens the free-text box 'Was it effective? Did you have any side effects?'. Even a reply describing low mood and reduced sex drive gives the full baseline list with no warning (runs/exp-m14). Left to the doctor. _[observed]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**9. Was it effective? Did you have any side effects?**  
_text · anonymous · role: safety-screen · shown: men-q3b = Yes · no branch · code_  
Why they ask: Free text for the doctor about past treatment.


**10. When did you first notice any hair loss?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Separates new, possibly reversible shedding from long-standing pattern loss.  
Downstream: No branch and no product change (runs/exp-m10).

- `In the last month` → **No effect**: Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m10). The answer goes to the doctor after payment. No warning, even though very recent loss is a reason to check other causes. (That the doctor sees and weighs this answer after payment is inferred; nothing on screen changes.) _[observed]_
- `More than a month ago` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**11. How did your hair loss start?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Screens for sudden loss that may have another cause (stress, illness, alopecia areata).  
Downstream: Suddenly opens two free-text boxes; no warning, no product change (runs/exp-m09).

- `Suddenly` → **Adds questions**: Opens two free-text boxes (other causes; how it started). Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m09). The answer goes to the doctor after payment. No warning about sudden loss. _[observed]_
- `Gradually (over months)` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**12. Do you think your hair loss could be due to any other causes?**  
_text · anonymous · role: diagnosis · shown: men-q5 = Suddenly · no branch · code_  
Why they ask: Free text for the doctor.


**13. Can you give more details about how your hair loss started?**  
_text · anonymous · role: diagnosis · shown: men-q5 = Suddenly · no branch · code_  
Why they ask: Free text for the doctor.


**14. Have you noticed any other changes to the areas where you are losing hair? (Help text: Such as redness, itching, flaking or soreness)**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Screens for scalp disease (redness, itch, flaking, soreness) that points away from pattern loss.  
Downstream: Yes shows a 'see your GP first' message and a details box; the form still goes through with the full list (runs/exp-m08).

- `Yes` → **Shows a warning**: Shows the message 'These symptoms suggest there could be other causes … We'd suggest you see your GP first' and a details box, but the form still goes through: Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m08). The answer goes to the doctor after payment. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**15. These symptoms suggest there could be other causes contributing to your hair loss, other than male pattern hair loss, which may improve with other treatments. We'd suggest you see your GP first to consider any other causes before taking this medication.**  
_info · anonymous · role: safety-screen · shown: men-q6 = Yes · no branch · code_  
Why they ask: Soft warning: steers the patient to a GP.


**16. Please describe the all changes that you've noticed**  
_text · anonymous · role: diagnosis · shown: men-q6 = Yes · no branch · code_  
Why they ask: Free text for the doctor (wording copied exactly, including the typo).


**17. Can you always get and maintain an erection when you want one?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Records erectile function before starting finasteride, a known side effect.  
Downstream: No shows a side-effect warning; no stop, no product change (runs/exp-m07).

- `Yes` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_
- `No` → **Shows a warning**: Shows a warning that finasteride can cause sexual problems in about 2% of men and erectile dysfunction may worsen. No stop: Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m07). The answer goes to the doctor after payment. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_

**18. One of the side effects of finasteride and Propecia, which occurs in around 2% of men, is problems with sexual function, including erectile dysfunction, meaning your symptoms of ED may worsen.**  
_info · anonymous · role: expectation-setting · shown: men-q7 = No · no branch · code_  
Why they ask: Soft warning about sexual side effects.


**19. Do you have, or have you had, any of the following conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Screens for conditions relevant to finasteride: prostate and breast cancer, liver disease, skin disease.  
Downstream: Liver or skin condition opens a required details box. No option stops the patient or changes the list (runs/exp-m03, exp-m04, exp-m05).

- `Prostate cancer` → **No effect**: Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m03). The answer goes to the doctor after payment. No warning or follow-up. (That the doctor sees and weighs this answer after payment is inferred; nothing on screen changes.) _[observed]_
- `Breast cancer` → **No effect**: Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m04). The answer goes to the doctor after payment. No warning or follow-up. (That the doctor sees and weighs this answer after payment is inferred; nothing on screen changes.) _[observed]_
- `Liver condition` → **Adds questions**: Opens the required 'Please provide more details.' box. Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m05). The answer goes to the doctor after payment. _[observed]_
- `Any type of skin conditions` → **Adds questions**: Opens the required 'Please provide more details.' box (filled with 'Mild eczema on the arms'). Questionnaire accepted; same 9 options as baseline, no message (runs/verify-m-skin). _[observed]_
- `None of the above` → **No effect**: Exclusive option. Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**20. Please provide more details.**  
_text · anonymous · role: safety-screen · shown: men-q8 includes 'Liver condition' or 'Any type of skin conditions' · no branch · observed_  
Why they ask: Free text about the liver or skin condition.


**21. Do you have any other medical conditions not mentioned above?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Catches any other condition for the doctor.  
Downstream: Yes opens a details box; no product change (runs/exp-m18).

- `Yes` → **Adds questions**: Opens a details box. Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m18). The answer goes to the doctor after payment. _[observed]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**22. Please provide more details**  
_text · anonymous · role: safety-screen · shown: men-q9 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**23. Are you currently taking any medication, or have you recently finished a course of medication?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Medicine list for interaction checks by the doctor.  
Downstream: Yes opens two required text boxes; no product change (runs/exp-m13).

- `Yes` → **Adds questions**: Opens two required text boxes (names and doses; what for). Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m13). The answer goes to the doctor after payment. _[observed]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**24. Please list the names and doses of all these medications?**  
_text · anonymous · role: safety-screen · shown: men-q10 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**25. What do you use these medications for?**  
_text · anonymous · role: safety-screen · shown: men-q10 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**26. Are you allergic to any medicines or other substances? (Help text: For instance peanuts or soya.)**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Allergy screen.  
Downstream: Yes opens the allergy tick list; no product change (runs/exp-m06, exp-m17).

- `Yes` → **Adds questions**: Opens the allergy tick list (men-q11a). Each option tested left the product list unchanged (runs/exp-m06, runs/exp-m17). _[observed]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**27. What allergies do you have?**  
_multi · anonymous · role: safety-screen · shown: men-q11 = Yes · BRANCHES · observed_  
Why they ask: Which allergy: finasteride itself, peanut or soya and lactose (tablet ingredients in some brands), others.  
Downstream: Peanuts or Soya opens a leaflet-check tick box; Lactose opens 'Can you take medication that contains lactose?'; Other opens a text box. Finasteride allergy opens nothing and does not remove finasteride (runs/exp-m06).

- `Finasteride` → **No effect**: No follow-up and no warning, and finasteride and Propecia are still offered: Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m06). The answer goes to the doctor after payment. A clear contraindication that the page does not act on. (That the doctor sees and weighs this answer after payment is inferred; nothing on screen changes.) Re-tested in stage 3: same result (runs/verify-m-finallergy). _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_
- `Peanuts or Soya` → **Shows a warning**: Opens a required tick box saying some makers' tablets are unsuitable for peanut or soya allergy and asking the patient to check the leaflet. After ticking, the questionnaire is accepted and the same 9 options are shown (runs/verify-m-peanut). _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_
- `Lactose` → **Adds questions**: Opens 'Can you take medication that contains lactose?'. Even with 'No' (finasteride tablets contain lactose) the list is unchanged: Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, 4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call (runs/exp-m17). The answer goes to the doctor after payment. _[observed]_
- `Other medications` → **Adds questions**: Opens a required free-text box (definition). Not replayed in the men's flow; the same option in the women's flow ('Ibuprofen') changed nothing (runs/exp-w19). _[code]_
- `Other substances` → **Adds questions**: Opens the required free-text box (filled with 'Latex'). Questionnaire accepted; same 9 options as baseline (runs/verify-m-othersub). _[observed]_

**28. Our pharmacists source medication from a wide range of approved manufacturers to ensure we have a good supply available. Some manufacturers produce medication that isn’t suitable for people who suffer with peanut or soya allergies. Before starting your medication, it’s important to check the enclosed manufacturer’s leaflet to make sure the medication you’ve received is suitable for people with peanut or soya allergies. We also recommend checking with your local pharmacist. Please tick if you’d still like to proceed with your order.**  
_consent · anonymous · role: consent · shown: men-q11a includes 'Peanuts or Soya' · no branch · observed_  
Why they ask: Shifts the excipient check to the patient.

- `(tick box)` → **Shows a warning**: Required tick before 'Next' (definition). A warning, not a stop. Seen and ticked in runs/verify-m-peanut. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_

**29. Can you take medication that contains lactose?**  
_single · anonymous · role: safety-screen · shown: men-q11a includes 'Lactose' · no branch · observed_  
Why they ask: Checks if a lactose-allergic patient can still take lactose-containing tablets.  
Downstream: 'No' changes nothing on screen (runs/exp-m17).

- `Yes` → **No effect**: No further change (definition). Information for the doctor. _[code]_
- `No` → **No effect**: No stop and no product change: finasteride and Propecia are still offered (runs/exp-m17). (That the doctor sees and weighs this answer after payment is inferred; nothing on screen changes.) _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[observed]_

**30. Please tell us what medications or substances you’re allergic to.**  
_text · anonymous · role: safety-screen · shown: men-q11a includes 'Other medications' or 'Other substances' · no branch · observed_  
Why they ask: Free text for the doctor.


**31. Almost done. Important information to read and confirm you agree and understand: Trying for a baby – Finasteride may affect male fertility while you are taking it. These changes are usually reversible after stopping treatment, but recovery may take several months. If you are planning to try for a baby, it is best not to use this or to stop it several months before trying to conceive. Depression – Some people have experienced severe depression when taking finasteride. Before taking finasteride, read and keep the finasteride patient cards and patient information leaflet within your pack and inform your doctor if you have any personal history of depression or suicidal thought. You should stop taking this medication immediately if you notice that your mood is affected and speak to your doctor. Finasteride and your prostate – Finasteride can lower the level of a prostate protein called PSA (prostate-specific antigen) in your blood. Because of this, it’s recommended that you see your GP for a prostate check (rectal examination) and a PSA blood test before starting treatment, and then at regular intervals while taking it. How often this is needed will depend on your age and personal risk factors. These checks help to detect any prostate problems, including prostate cancer, as early as possible. Sexual problems – If you experience decreased sex drive, difficulty having an erection or ejaculation problems on finasteride, you should contact your doctor for medical advice. This medication is prescribed for your own personal use – If you are requesting any follow-up medication, you confirm you are tolerating your treatment and any side effects experienced. Your answers are used to make medical decisions – Answer the questions honestly and as accurately as you can. Our doctors rely on this information to prescribe treatment safely. Missing or incorrect information can increase the risk of side effects or lead to serious risk to your health. In case of questions, please contact us. By continuing, you confirm that you have understood the information provided, especially around treatment options, side effects, and effectiveness.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Informed consent. Fertility, depression and prostate (PSA) are handled here as warnings, not as questions.

- `(tick box)` → **No effect**: Required. 'Next' stays greyed out until all required items are answered (seen in runs/consult-02 and runs/baseline-men). _[observed]_

**32. Please tick to acknowledge that it is best practice to inform your GP of any private treatment you receive. All treatment and messaging is completely confidential. However, you can easily update your GP by downloading a GP letter from the ‘Order History’ section of your account and sending it to them. If you prefer, we can send this letter directly to your GP, just send us their details**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: GP-sharing acknowledgement.

- `(tick box)` → **No effect**: Required tick. _[observed]_

**33. Please tick here to signify that you have read, understand and agree to abide by our terms and conditions and privacy and cookie policy.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Terms and privacy agreement.

- `(tick box)` → **Next question**: Required tick. Then the 'Next' button sends the answers and opens 'Your request'. _[observed]_

**34. Your request (choose one, then press 'Order')**  
_single · anonymous · role: product-selector · shown: after pressing Next on the questionnaire · BRANCHES · observed_  
Why they ask: The patient picks a 'preferred treatment' and pack size. Nothing is preselected and there is no recommendation label. The entry page says the doctor may offer an alternative if the preferred one is not suitable.  
Downstream: The choice sets the price and the delivery modes on the next step.

- `Finasteride 1mg - (1 month - Generic Treatment) (28 tablets) £27.00` → **No effect**: Shown to the baseline man. Not chosen. _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg - (2 months - Generic Treatment) (56 tablets) £54.00` → **No effect**: Shown to the baseline man. Not chosen. _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg - (3 months - Generic Treatment) (84 tablets) £79.00` → **Next question**: Chosen in runs/baseline-men-wall; 'Order' opens the Delivery step. _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Finasteride 1mg - (6 months - Generic Treatment) (168 tablets) £137.00` → **No effect**: Shown to the baseline man. Not chosen. The product data gives it fewer delivery modes (no pharmacy-collect modes 24 and 232). _(affects: Finasteride 1mg tablets (generic))_ _[observed]_
- `Propecia 1mg - (1 month) (28 tablets) £60.00` → **No effect**: Shown to the baseline man. Not chosen. _(affects: Propecia 1mg tablets (brand))_ _[observed]_
- `Propecia 1mg - (2 months) (56 tablets) £110.00` → **No effect**: Shown to the baseline man. Not chosen. _(affects: Propecia 1mg tablets (brand))_ _[observed]_
- `Propecia 1mg - (3 months) (84 tablets) £140.00` → **No effect**: Shown to the baseline man. Not chosen. _(affects: Propecia 1mg tablets (brand))_ _[observed]_
- `Propecia 1mg - (6 months) (168 tablets) £265.00` → **No effect**: Shown to the baseline man. Not chosen. _(affects: Propecia 1mg tablets (brand))_ _[observed]_
- `Telephone Consultation with a Doctor (does not include prescription medication): Available 2-3pm Friday (Only Phone consultation) £25.00` → **No effect**: Shown to the baseline man. Not chosen. _(affects: Telephone Consultation with a Doctor (no medicine included))_ _[observed]_

**35. Choose your delivery**  
_single · anonymous · role: data-capture · shown: after pressing Order on 'Your request' · no branch · observed_  
Why they ask: Delivery or in-store collection. No address is asked yet.

- `Free Standard Delivery (FREE) – with an optional tick 'Deliver without a signature'` → **Next question**: Chosen in runs/baseline-men-wall; 'Next' then opens the account wall. _[observed]_
- `Superdrug Pharmacy Collect (FREE) – 'Find a location near' search box` → **No effect**: Delivery choice only; any choice leads to the account wall. Not replayed with this option. _[inferred]_
- `Express Delivery (£3.99) – with an optional tick 'Deliver without a signature'` → **No effect**: Delivery choice only; any choice leads to the account wall. Not replayed with this option. _[inferred]_

**36. Create your patient account. Fields: First Name; Last Name; Email (a verification code is sent); Password; Date of birth (day, month, year: the year list runs from 2011 back to 1900); Gender (Female / Male); Mobile number (optional); Superdrug.com marketing communications (optional tick); 'I agree to the Terms and Conditions and the Privacy Policy.'**  
_contact · after-account · role: identity · shown: after pressing Next on Delivery (URL /auth/register/?redirect=…/assessment/147929#/checkout/checkout-address) · no branch · observed_  
Why they ask: ACCOUNT WALL. Age (date of birth) and sex (Gender) are first asked here, after the medical questions. Nothing was typed.


**37. After sign-in (not tested): delivery address ('checkout-address'), 'Your Order' summary, payment, 'Payment Successful'. The Help page says an ID check with photo ID may be required and that the doctor may put the order on hold and message questions.**  
_info · checkout · role: identity · shown: after creating an account · no branch · docs_  
Why they ask: Checkout and doctor review happen only after an account exists and payment is taken.


### Women's hair-loss consultation (services 147757 'SD Regaine Women' and 147778 'SD Nourkrin Woman'; both use questionnaire 201132 version 8)

Entry: https://onlinedoctor.superdrug.com/hair-loss-in-women.html

One page with 7 always-shown medical questions (up to 6 conditional follow-up items) and 3 required ticks → product-rules filter call → 'Your request' (Regaine for Women, Nourkrin, two Alpecin shampoos, phone consultation) → Delivery → ACCOUNT WALL → address → order summary → payment → doctor review (after 'Your request' not walked in the women's flows).

**1. These medical questions help our doctors treat you safely. Check that you fully understand them, and message us if you're unsure. (Banner above: 'Please note: This service is only available in the UK.')**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Sets the frame. Whole questionnaire is one scrolling page, the same for both women's entry points.


**2. Do you have or have you had:**  
_multi · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Screens out hair loss that is not female pattern loss (shaved scalp, sudden or patchy loss, scalp skin disease, post-partum shedding), where minoxidil is not suitable.  
Downstream: Any of the four situations removes Regaine for Women from the list (runs/exp-w05 to exp-w08); the other products stay.

- `a shaved scalp` → **Removes a product**: Product-rules reply suggestions:[9895328]: Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain. No message is shown (runs/exp-w05). _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_
- `sudden or patchy hair loss` → **Removes a product**: Product-rules reply suggestions:[9895328]: Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain. No message is shown (runs/exp-w06). _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_
- `skin problems on the scalp - such as sunburn or psoriasis` → **Removes a product**: Product-rules reply suggestions:[9895328]: Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain. No message is shown (runs/exp-w07). _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_
- `hair loss associated with childbirth` → **Removes a product**: Product-rules reply suggestions:[9895328]: Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain. No message is shown (runs/exp-w08). _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_
- `none of the above` → **No effect**: Exclusive option. Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**3. Do you have, or are you using treatment for, high blood pressure?**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Blood-pressure screen for minoxidil.  
Downstream: Yes removes Regaine for Women (runs/exp-w03).

- `Yes` → **Removes a product**: Product-rules reply suggestions:[9895328]: Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain. No message is shown (runs/exp-w03). _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**4. Do you have any conditions affecting your heart? (Help text: Including an irregular heart beat.)**  
_single · anonymous · role: product-selector · shown: always · BRANCHES · observed_  
Why they ask: Heart screen for minoxidil.  
Downstream: Yes opens a required details box and removes Regaine for Women (runs/exp-w04).

- `Yes` → **Removes a product**: Opens a required details box. Product-rules reply suggestions:[9895328]: Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain. No message is shown (runs/exp-w04). _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**5. Please provide more details:**  
_text · anonymous · role: safety-screen · shown: women-q3 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**6. Are you pregnant or breastfeeding?**  
_single · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Pregnancy and breastfeeding screen.  
Downstream: Neither answer changes the list or shows a warning (runs/exp-w01, exp-w02, exp-w21); left to the doctor.

- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_
- `I'm pregnant` → **No effect**: Product-rules reply empty; all five baseline options still shown (runs/exp-w01, runs/exp-w21). Regaine for Women stays on offer although its leaflet says not to use it in pregnancy; no follow-up question or warning. (That the doctor sees and weighs this answer after payment is inferred; nothing on screen changes.) _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_
- `I'm breastfeeding` → **No effect**: Product-rules reply empty; all five baseline options still shown (runs/exp-w02). No warning. (That the doctor sees and weighs this answer after payment is inferred; nothing on screen changes.) _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_

**7. Do you have any other health conditions?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Catches other conditions for the doctor.  
Downstream: Yes opens a details box; no product change (runs/exp-w09).

- `Yes` → **Adds questions**: Opens a details box. Product-rules reply empty; all five baseline options still shown (runs/exp-w09, details 'Hay fever'). _[observed]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**8. Please provide more details**  
_text · anonymous · role: safety-screen · shown: women-q5 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**9. Are you currently taking any medication, or have you recently finished a course of medication?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Medicine list for the doctor.  
Downstream: Yes opens two required text boxes; no product change (runs/exp-w10).

- `Yes` → **Adds questions**: Opens two required text boxes. Product-rules reply empty; all five baseline options still shown (runs/exp-w10, 'Cetirizine'). _[observed]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**10. Please list the names and doses of all these medications?**  
_text · anonymous · role: safety-screen · shown: women-q6 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**11. What do you use these medications for?**  
_text · anonymous · role: safety-screen · shown: women-q6 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**12. Are you allergic to any medicines or other substances?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Allergy screen; gate to the allergy list.  
Downstream: Yes opens women-q7a.

- `Yes` → **Adds questions**: Opens the ten-item allergy tick list (women-q7a), which is the main product selector. _[observed]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**13. Please tick all of the allergies that apply to you.**  
_multi · anonymous · role: product-selector · shown: women-q7 = Yes · BRANCHES · observed_  
Why they ask: Matches allergies to product ingredients: minoxidil, ethanol and propylene glycol (Regaine solution), fish (Nourkrin), caffeine (Alpecin).  
Downstream: Minoxidil, ethanol or propylene glycol remove Regaine for Women; fish removes Nourkrin; caffeine removes both Alpecin shampoos; penicillin, peanuts or soya and lactose do nothing; the two Other options open a details box (runs/exp-w11 to exp-w20).

- `Minoxidil` → **Removes a product**: Product-rules reply suggestions:[9895328]: Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain. No message is shown (runs/exp-w11). _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_
- `Penicillin` → **No effect**: Product-rules reply empty; all five baseline options still shown (runs/exp-w18). _[observed]_
- `Fish` → **Removes a product**: Product-rules reply suggestions:[9895329]: Nourkrin is silently removed (inferred reason: it contains a fish-derived ingredient); the other four remain (runs/exp-w12; same from the Nourkrin entry, runs/exp-w22). _(affects: Nourkrin Woman Hair Growth Tablets (60))_ _[observed]_
- `Caffeine` → **Removes a product**: Product-rules reply suggestions:[9895330,9895331]: both Alpecin caffeine shampoos are removed; Regaine for Women, Nourkrin and the phone consultation remain (runs/exp-w13). _(affects: Alpecin Caffeine Shampoo 250ml, Alpecin Double Effect Shampoo 200ml)_ _[observed]_
- `Peanuts or Soya` → **No effect**: Product-rules reply empty; all five baseline options still shown (runs/exp-w16). No follow-up (unlike the men's form). _[observed]_
- `Ethanol` → **Removes a product**: Product-rules reply suggestions:[9895328]: Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain. No message is shown (runs/exp-w14). _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_
- `Propylene glycol` → **Removes a product**: Product-rules reply suggestions:[9895328]: Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain. No message is shown (runs/exp-w15). _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_
- `Lactose` → **No effect**: Product-rules reply empty; all five baseline options still shown (runs/exp-w17). No follow-up. _[observed]_
- `Other medication` → **Adds questions**: Opens a required details box. Product-rules reply empty; all five baseline options still shown (runs/exp-w19, 'Ibuprofen'). _[observed]_
- `Other substance` → **Adds questions**: Opens a required details box. Product-rules reply empty; all five baseline options still shown (runs/exp-w20, 'Latex'). _[observed]_

**14. Please provide more details.**  
_text · anonymous · role: safety-screen · shown: women-q7a includes 'Other medication' or 'Other substance' · no branch · code_  
Why they ask: Free text for the doctor.


**15. Please tick to acknowledge that it is best practice to inform your GP of any private treatment you receive. All treatment and messaging is completely confidential. However, you can easily update your GP by downloading a GP letter from the ‘Order History’ section of your account and sending it to them. If you prefer, we can send this letter directly to your GP, just send us their details**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: GP-sharing acknowledgement.

- `(tick box)` → **No effect**: Required tick. _[observed]_

**16. I fully understand the questions asked & have answered honestly & truthfully. I fully understand the side-effects of the treatment options, their effectiveness and alternative options & am happy to continue with my request. I confirm & agree that any treatment prescribed for me is for my personal use only.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Honesty, understanding and personal-use confirmation.

- `(tick box)` → **No effect**: Required tick (one box for the three statements). _[observed]_

**17. Please tick here to signify that you have read, understand and agree to abide by our terms and conditions and privacy and cookie policy.**  
_consent · anonymous · role: consent · shown: always · no branch · observed_  
Why they ask: Terms and privacy agreement.

- `(tick box)` → **Next question**: Required tick. 'Next' then sends the answers, calls the product-rules service and opens 'Your request'. _[observed]_

**18. Your request (choose one, then press 'Order')**  
_single · anonymous · role: product-selector · shown: after pressing Next on the questionnaire · BRANCHES · observed_  
Why they ask: The patient picks one product. Nothing is preselected. The list is what is left after the product-rules filter (nothing was removed for the baseline woman).  
Downstream: The entry point only changes the order of the first two rows.

- `Regaine for Women 2% w/w (60ml) £25.00` → **No effect**: Shown to the baseline woman (first in the list via service 147757, second via 147778). Not chosen. _(affects: Regaine for Women 2% w/w solution 60ml)_ _[observed]_
- `Nourkrin Woman Hair Growth Tablets (60 tablets) £51.00` → **No effect**: Shown to the baseline woman (second via 147757, first via 147778). Not chosen. _(affects: Nourkrin Woman Hair Growth Tablets (60))_ _[observed]_
- `Alpecin Caffeine Shampoo (250ml) £7.50` → **No effect**: Shown to the baseline woman. Not chosen. _(affects: Alpecin Caffeine Shampoo 250ml)_ _[observed]_
- `Alpecin Shampoo Double Effect (200ml) £9.99` → **No effect**: Shown to the baseline woman. Not chosen. _(affects: Alpecin Double Effect Shampoo 200ml)_ _[observed]_
- `Telephone Consultation with a Doctor (does not include prescription medication): Available 2-3pm Friday (Only Phone consultation) £25.00` → **No effect**: Shown to the baseline woman. Not chosen. _(affects: Telephone Consultation with a Doctor (no medicine included))_ _[observed]_

**19. Choose your delivery**  
_single · anonymous · role: data-capture · shown: after pressing Order on 'Your request' · no branch · code_  
Why they ask: Delivery or collection.

- `Free Standard Delivery (FREE)` → **No effect**: Delivery choice only (served delivery data); leads to the account wall. Not replayed in the women's flow. _[inferred]_
- `Superdrug Pharmacy Collect (FREE)` → **No effect**: Delivery choice only (served delivery data); leads to the account wall. Not replayed in the women's flow. _[inferred]_
- `Express Delivery (£3.99)` → **No effect**: Delivery choice only (served delivery data); leads to the account wall. Not replayed in the women's flow. _[inferred]_

**20. Create your patient account. Fields: First Name; Last Name; Email (a verification code is sent); Password; Date of birth (day, month, year: the year list runs from 2011 back to 1900); Gender (Female / Male); Mobile number (optional); Superdrug.com marketing communications (optional tick); 'I agree to the Terms and Conditions and the Privacy Policy.'**  
_contact · after-account · role: identity · shown: after pressing Next on Delivery · no branch · code_  
Why they ask: ACCOUNT WALL (seen in the men's flow; the women's services serve the same step list: section, product, delivery, checkout_summary, login, payment). Age and sex are first asked here.


## 7. Competitive read

**Strengths**

- Trusted high-street brand; CQC-registered doctor service and GPhC-registered Superdrug pharmacies.
- Very short: one page, no account until after product and delivery choice, prices shown up front.
- Low generic finasteride price (£27 a month, £137 for six months) with free delivery or free store collection.
- Women's list is filtered by ingredient allergies and minoxidil safety (blood pressure, heart, non-pattern loss) before the patient chooses, so unsuitable items never show.
- Asks for photos when the chosen pattern does not look like typical male pattern loss, and sets realistic expectations for advanced loss.
- Clear consent text on fertility, depression, PSA and sexual side effects.

**Weaknesses**

- Men's screen is not acted on: finasteride allergy, prostate or breast cancer, past low mood on finasteride and sudden loss all still show finasteride and Propecia with no answer-specific warning (only the general consent text); everything waits for the doctor after payment.
- Pregnancy and breastfeeding do not remove Regaine for Women or show any warning, although the product should not be used then.
- Removals for women are silent: no explanation of why a product disappeared or what to do instead.
- Men are offered tablets only: no topical finasteride, no minoxidil (Regaine for Men is advertised but not in the flow), no oral minoxidil, no combinations.
- No guidance on which product or pack to choose; no personalisation, no 'recommended' result.
- No questions on mood or mental health, family history, age, or fertility plans for men; none on periods, menopause, contraception, PCOS, thyroid or iron for women.
- No subscription or follow-up programme; every supply is a new order. Inconsistent site copy (discount codes, phone-consultation days).
- A woman with several allergies can be left with only the £25 phone consultation and no explanation (runs/verify-w-combo3).

**Gaps a new competitor could use**

- Act on safety answers before payment (stop or switch on finasteride allergy, breast cancer, depression history) and explain why.
- Offer a guided result with a reason ('this suits you because…') and an alternative when a product is removed.
- Sell topical and combination options for men (topical finasteride, minoxidil, oral minoxidil under a prescriber).
- A real women's pathway: differential questions (menopause, PCOS, iron, thyroid, post-partum) and prescription options such as oral minoxidil or spironolactone.
- Subscription with check-ins and progress photos to support adherence over the 3 to 6 months finasteride needs.

## 8. Experiments run (64)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| s2-baseline-men | men | none (baseline replay, walk.js) | 9 options: generic finasteride 1mg £27/£54/£79/£137 (1/2/3/6 months), Propecia £60/£110/£140/£265, phone consultation £25. No stop. |
| s2b-women-regaine | women | none (baseline replay, Regaine entry) | 5 options: Regaine for Women £25, Nourkrin £51, Alpecin Caffeine £7.50, Alpecin Double Effect £9.99, phone consultation £25. Product-rules reply empty. |
| s2b-women-nourkrin | women | none (baseline replay, Nourkrin entry) | Same 5 options, Nourkrin listed first. Product-rules reply empty. |
| exp-w01 | women | women-q4 pregnant or breastfeeding: No -> I'm pregnant | Reached 'Your request' with 5 options (9895328, 9895329, 9895330, 9895331, 9894989). Product-rules: "data":[]. |
| exp-w02 | women | women-q4 pregnant or breastfeeding: No -> I'm breastfeeding | Reached 'Your request' with 5 options (9895328, 9895329, 9895330, 9895331, 9894989). Product-rules: "data":[]. |
| exp-w03 | women | women-q2 high blood pressure: No -> Yes | Reached 'Your request' with 4 options (9895329, 9895330, 9895331, 9894989). Product-rules: "data":[{"suggestions":[9895328]}]. |
| exp-w04 | women | women-q3 heart condition: No -> Yes (details box filled neutrally: 'Occasional palpitations, checked by GP, no treatment needed') | Reached 'Your request' with 4 options (9895329, 9895330, 9895331, 9894989). Product-rules: "data":[{"suggestions":[9895328]}]. |
| exp-w05 | women | women-q1: none of the above -> a shaved scalp | Reached 'Your request' with 4 options (9895329, 9895330, 9895331, 9894989). Product-rules: "data":[{"suggestions":[9895328]}]. |
| exp-w06 | women | women-q1: none of the above -> sudden or patchy hair loss | Reached 'Your request' with 4 options (9895329, 9895330, 9895331, 9894989). Product-rules: "data":[{"suggestions":[9895328]}]. |
| exp-w07 | women | women-q1: none of the above -> skin problems on the scalp | Reached 'Your request' with 4 options (9895329, 9895330, 9895331, 9894989). Product-rules: "data":[{"suggestions":[9895328]}]. |
| exp-w08 | women | women-q1: none of the above -> hair loss associated with childbirth | Reached 'Your request' with 4 options (9895329, 9895330, 9895331, 9894989). Product-rules: "data":[{"suggestions":[9895328]}]. |
| exp-w09 | women | women-q5 other health conditions: No -> Yes (details: 'Hay fever') | Reached 'Your request' with 5 options (9895328, 9895329, 9895330, 9895331, 9894989). Product-rules: "data":[]. |
| exp-w10 | women | women-q6 taking medication: No -> Yes (details: 'Cetirizine 10mg once a day' / 'Hay fever') | Reached 'Your request' with 5 options (9895328, 9895329, 9895330, 9895331, 9894989). Product-rules: "data":[]. |
| exp-w11 | women | women-q7 allergies: No -> Yes, women-q7a = Minoxidil only | Reached 'Your request' with 4 options (9895329, 9895330, 9895331, 9894989). Product-rules: "data":[{"suggestions":[9895328]}]. |
| exp-w12 | women | women-q7 allergies: No -> Yes, women-q7a = Fish only | Reached 'Your request' with 4 options (9895328, 9895330, 9895331, 9894989). Product-rules: "data":[{"suggestions":[9895329]}]. |
| exp-w13 | women | women-q7 allergies: No -> Yes, women-q7a = Caffeine only | Reached 'Your request' with 3 options (9895328, 9895329, 9894989). Product-rules: "data":[{"suggestions":[9895330,9895331]}]. |
| exp-w14 | women | women-q7 allergies: No -> Yes, women-q7a = Ethanol only | Reached 'Your request' with 4 options (9895329, 9895330, 9895331, 9894989). Product-rules: "data":[{"suggestions":[9895328]}]. |
| exp-w15 | women | women-q7 allergies: No -> Yes, women-q7a = Propylene glycol only | Reached 'Your request' with 4 options (9895329, 9895330, 9895331, 9894989). Product-rules: "data":[{"suggestions":[9895328]}]. |
| exp-w16 | women | women-q7 allergies: No -> Yes, women-q7a = Peanuts or Soya only | Reached 'Your request' with 5 options (9895328, 9895329, 9895330, 9895331, 9894989). Product-rules: "data":[]. |
| exp-w17 | women | women-q7 allergies: No -> Yes, women-q7a = Lactose only | Reached 'Your request' with 5 options (9895328, 9895329, 9895330, 9895331, 9894989). Product-rules: "data":[]. |
| exp-w18 | women | women-q7 allergies: No -> Yes, women-q7a = Penicillin only | Reached 'Your request' with 5 options (9895328, 9895329, 9895330, 9895331, 9894989). Product-rules: "data":[]. |
| exp-w19 | women | women-q7 allergies: No -> Yes, women-q7a = Other medication only (details: 'Ibuprofen') | Reached 'Your request' with 5 options (9895328, 9895329, 9895330, 9895331, 9894989). Product-rules: "data":[]. |
| exp-w20 | women | women-q7 allergies: No -> Yes, women-q7a = Other substance only (details: 'Latex') | Reached 'Your request' with 5 options (9895328, 9895329, 9895330, 9895331, 9894989). Product-rules: "data":[]. |
| exp-w21 | women | Nourkrin entry, women-q4: No -> I'm pregnant | Reached 'Your request' with 5 options (9895329, 9895328, 9895330, 9895331, 9894989). Product-rules: "data":[]. |
| exp-w22 | women | Nourkrin entry, women-q7 allergies: No -> Yes, women-q7a = Fish only | Reached 'Your request' with 4 options (9895328, 9895330, 9895331, 9894989). Product-rules: "data":[{"suggestions":[9895329]}]. |
| exp-m01 | men | men-q2 hair pattern: C -> E (warning tick ticked; NO photos uploaded) | Next blocked by 'Please upload photos' error; no save call, product screen not reached. |
| exp-m02 | men | men-q2 hair pattern: C -> A (no visible loss; NO photos uploaded) | Next blocked by 'Please upload photos' error; no save call, product screen not reached. |
| exp-m03 | men | men-q8 conditions: None of the above -> Prostate cancer | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m04 | men | men-q8 conditions: None of the above -> Breast cancer | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m05 | men | men-q8 conditions: None of the above -> Liver condition (details: 'Fatty liver found on a scan, liver blood tests normal') | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m06 | men | men-q11 allergies: No -> Yes, men-q11a = Finasteride only | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m07 | men | men-q7 always get and keep an erection: Yes -> No | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m08 | men | men-q6 other scalp changes: No -> Yes (details: 'Itchy, flaky scalp') | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m09 | men | men-q5 how it started: Gradually -> Suddenly (follow-up boxes: 'Not sure' / 'Noticed more hair in the shower over two weeks') | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m10 | men | men-q4 first noticed: More than a month ago -> In the last month | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m11 | men | men-q3 currently using finasteride: No -> Yes (follow-up: 'Yes, it has slowed the loss. No side effects.'); men-q3b is no longer shown | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m12 | men | men-q1 diagnosed: No, self-diagnosis -> Yes, by my GP | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m13 | men | men-q10 taking medication: No -> Yes (details: 'Cetirizine 10mg once a day' / 'Hay fever') | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m14 | men | men-q3b taken finasteride before: No -> Yes (follow-up: 'It worked but I had low mood and reduced sex drive, so I stopped') | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m15 | men | men-q2 hair pattern: C -> D (no photo item expected) | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m16 | men | men-q2 hair pattern: C -> No pattern fits well (NO photos uploaded) | Next blocked by 'Please upload photos' error; no save call, product screen not reached. |
| exp-m17 | men | men-q11 allergies: No -> Yes, men-q11a = Lactose only; men-q11c 'Can you take medication that contains lactose?' = No | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| exp-m18 | men | men-q9 other medical conditions: No -> Yes (details: 'Hay fever') | Reached 'Your request' with 9 options (9895411, 9895567, 9895412, 9895413, 10649, 9895566, 10650, 9870126, 9894989). Product-rules: no product-rules call (men's filter off). |
| verify-base-men | men | none (stage 3 baseline replay, exp.js) | Same 9 options and prices as recorded (finasteride £27/£54/£79/£137, Propecia £60/£110/£140/£265, phone £25). Save reply data:[]. No product-rules call. Matches. |
| verify-base-wreg | women | none (stage 3 baseline replay, Regaine entry) | Same 5 options and prices (Regaine for Women £25, Nourkrin £51, Alpecin £7.50, Double Effect £9.99, phone £25). Product-rules data:[]. Matches. |
| verify-base-wnour | women | none (stage 3 baseline replay, Nourkrin entry) | Same 5 options, Nourkrin first. Product-rules data:[]. Matches. |
| verify-m-patA | men | men-q2: C -> A | Photo item; Next does nothing; red 'Please upload photos'; no save call. Matches R1. |
| verify-m-patE | men | men-q2: C -> E (warning ticked) | Photo item and warning tick; Next blocked by 'Please upload photos'. Matches R1/R2. |
| verify-m-prostate | men | men-q8: None -> Prostate cancer | Same 9 options, no message, no product-rules call. Matches R9. |
| verify-m-finallergy | men | men-q11: No -> Yes, Finasteride | Same 9 options, no warning or follow-up. Matches R10. |
| verify-w-bp | women | women-q2: No -> Yes | suggestions:[9895328]; Regaine for Women gone, 4 left. Matches R12. |
| verify-w-patchy | women | women-q1: none -> sudden or patchy | suggestions:[9895328]; Regaine for Women gone. Matches R11. |
| verify-w-shaved | women | women-q1: none -> a shaved scalp | suggestions:[9895328]; Regaine for Women gone. Matches R11. |
| verify-w-minox | women | women-q7a: Minoxidil | suggestions:[9895328]. Matches R14. |
| verify-w-fish | women | women-q7a: Fish | suggestions:[9895329]; Nourkrin gone. Matches R15. |
| verify-w-caffeine | women | women-q7a: Caffeine | suggestions:[9895330,9895331]; both Alpecin shampoos gone. Matches R16. |
| verify-w-pregnant | women | women-q4: No -> I'm pregnant | Product-rules data:[]; all 5 options; no warning. Matches R17. |
| verify-w-combo-heart-fish | women | COMBINATION women-q2 Yes + women-q7a Fish | Two suggestions entries; Regaine for Women and Nourkrin gone; Alpecin x2 + phone left. New rule R21. |
| verify-w-combo3 | women | COMBINATION women-q7a Minoxidil + Fish + Caffeine | Three suggestions entries; only the £25 phone consultation left; no message, no stop. New rule R21. |
| verify-m-patB | men | men-q2: C -> B | No photo, no warning; same 9 options. First live replay of B. |
| verify-m-specialist | men | men-q1: self-diagnosis -> Yes, by a specialist | Same 9 options. First live replay. |
| verify-m-skin | men | men-q8: None -> Any type of skin conditions (details 'Mild eczema on the arms') | Required details box; same 9 options. First live replay. |
| verify-m-peanut | men | men-q11a: Peanuts or Soya (warning ticked) | Required leaflet-check tick appears; same 9 options. New rule R22. |
| verify-m-othersub | men | men-q11a: Other substances (details 'Latex') | Required free-text box; same 9 options. First live replay. |

## 9. Independent verification

This report can be trusted for what it says about the anonymous part of the journey. Every baseline and all 11 high-consequence rules I re-tested came out the same as recorded, the product names, strengths and prices match the live pages, and every run folder cited exists. The main faults were labelling, not facts: 'flag-for-clinician' was claimed as observed when only 'no change' was seen, and a few options were filled in from the definition; these are now corrected or replayed. The report says nothing reliable about what the doctor does after payment, about age or sex handling, or about men who need to upload photos, and it is honest about that.

**Re-checked**

- Baselines replayed fresh (runs/verify-base-men, verify-base-wreg, verify-base-wnour): same products, order, prices and empty server replies as recorded.
- R1 photo block (patterns A and E) re-tested live: confirmed (runs/verify-m-patA, verify-m-patE).
- R2 pattern E warning tick: confirmed (runs/verify-m-patE).
- R9 men list never changes: confirmed in 7 more replays (prostate cancer, finasteride allergy, pattern B, specialist, skin condition, peanut, other substance).
- R10 finasteride allergy does nothing: confirmed (runs/verify-m-finallergy).
- R11 non-pattern presentations remove Regaine for Women: confirmed for sudden or patchy and shaved scalp (runs/verify-w-patchy, verify-w-shaved).
- R12 high blood pressure removes Regaine for Women: confirmed (runs/verify-w-bp).
- R14 minoxidil allergy removes Regaine for Women: confirmed (runs/verify-w-minox).
- R15 fish allergy removes Nourkrin: confirmed (runs/verify-w-fish).
- R16 caffeine allergy removes both Alpecin shampoos: confirmed (runs/verify-w-caffeine).
- R17 pregnancy changes nothing: confirmed (runs/verify-w-pregnant).
- R20 no stop screen: confirmed, even when every product is removed (runs/verify-w-combo3).
- Product facts checked on live pages (runs/verify-pages): finasteride 1mg £27/£54/£79/£137 and HL40 prices; Propecia 1mg £60/£110/£140/£265 (Organon); Regaine for Men 50mg/g foam 3x73ml £65.99 and 5% w/w solution 3x60ml £70.00 (HL30 on its page, HL40 £39.59/£42.00 on /hair-loss-treatment.html); Alpecin 250ml £7.50 and Double Effect 200ml £9.99 (caffeine); Regaine for Women 2% w/w 60ml £25.00; Nourkrin Woman 60 tablets £51.00 with Marilex fish extract; express delivery £3.99. All match.
- Product links: Regaine for Men and Alpecin pages send to the men's service 147929, which (verify-base-men) offers neither: confirmed. Regaine for Women and Nourkrin pages send to 147757 and 147778: confirmed.
- Every run folder cited in company.json exists; spot-checked stage-2 runs exp-m07 (ED warning text), exp-m08 (see your GP text), exp-m11, exp-m16, exp-w04, w08, w14, w15, m03, m04, m17 summaries: they show what is claimed.

**Corrected**

- Options and rule R9 labelled 'flag-for-clinician' with evidence 'observed' were changed to effectType 'none': the replays only show that nothing changes; that the doctor acts on the answer is inferred. Affected: men-q1 'Yes, by my GP'; men-q1 'Yes, by a specialist'; men-q4 'In the last month'; men-q8 'Prostate cancer'; men-q8 'Breast cancer'; men-q11a 'Finasteride'; men-q11c 'Yes'; men-q11c 'No'; women-q4 'I'm pregnant'; women-q4 'I'm breastfeeding'.
- R9 said 'any single answer change' but patterns A, E and 'none fits' block the form (R1); its condition now excludes them.
- R15's reason for removing Nourkrin is now cited to the product page (Marilex fish extract) instead of being called inferred.
- Untested options now replayed and relabelled observed: men-q1 'by a specialist', men-q2 B, men-q8 skin condition, men-q11a peanuts or soya (warning tick, new R22) and other substances.
- Combinations were listed as untested; two were run and they show removals add up and can leave only the phone consultation (new R21, two new recommendation profiles).
- Product price notes said 'hair-loss page' for the HL40 Regaine/Alpecin prices; the page is /hair-loss-treatment.html (the consultation page shows no price table).

**Still unverified**

- Anything after the account wall: age and sex checks, ID check, what the doctor declines or changes, address and payment.
- What happens after a photo upload for men's patterns A, E and 'none fits' (we never upload).
- Whether the server-side questionnaire evaluator (zava.questionnaire_evaluator.cds tag) flags answers for the doctor: inferred from its name only.
- Women's product rules for answers never sent: the rules live on the server and are known only from replies.
- Delivery options other than men's free standard delivery; women's 'breastfeeding' (stage 2 only); men's 'Other medications' allergy.
- Regaine legal class (P or GSL) is not stated by the site.

## 10. Limits of this report

- Only the anonymous part was tested; what the doctor does after account creation and payment is not visible.
- Age and sex are asked only at account creation, so under-18, over-65 and wrong-sex handling could not be tested.
- Patterns A, E and 'No pattern fits well' block without photos; we never upload, so what follows for them is unknown.
- Not replayed: delivery options other than free standard (men) and all delivery options in the women's flow; women-q4 'breastfeeding' was replayed only in stage 2; men 'Other medications' allergy (same box as 'Other substances', which was replayed).
- Only two combinations of answers were tried (both women). Other combinations, and any combination in the men's flow, are covered only by the code (men's filter off).
- The women's product rules sit on the server (/consultation-triage/product-rules); they were read only from replies, so rules for answers not tried are unknown.
- The men's repeat-order questionnaire (201038) and everything after sign-in (address, ID check, payment) were not seen.
- Regaine legal class is not stated by the site; our browser was seen as outside the UK (clientIPCountryCode 'US') but was not blocked.

## 11. Sources

- [Hair Loss Treatments for Men (service page, prices, HL40)](https://onlinedoctor.superdrug.com/hair-loss-treatment.html)
- [Hair loss service (consultation entry page)](https://onlinedoctor.superdrug.com/hair-loss-consultation.html)
- [Men's assessment (questionnaire page)](https://onlinedoctor.superdrug.com/assessment/147929)
- [Men's questionnaire definition (FHIR JSON fetched by the page; saved as quiz-definition.json)](https://onlinedoctor.superdrug.com/questionnaire-api/Prod/Questionnaire/201037)
- [Women's questionnaire definition (saved as quiz-definition-women.json)](https://onlinedoctor.superdrug.com/questionnaire-api/Prod/Questionnaire/201132)
- [Finasteride product page](https://onlinedoctor.superdrug.com/finasteride.html)
- [Propecia product page](https://onlinedoctor.superdrug.com/propecia.html)
- [Regaine for Men product page](https://onlinedoctor.superdrug.com/regaine-for-men.html)
- [Alpecin product page](https://onlinedoctor.superdrug.com/alpecin.html)
- [Hair Loss In Women (service page)](https://onlinedoctor.superdrug.com/hair-loss-in-women.html)
- [Regaine for Women product page](https://onlinedoctor.superdrug.com/regaine-for-women.html)
- [Nourkrin Woman product page](https://onlinedoctor.superdrug.com/nourkrin-woman.html)
- [Topical Finasteride (article: 'Superdrug Online Doctor does not offer topical finasteride')](https://onlinedoctor.superdrug.com/topical-finasteride.html)
- [Minoxidil For Hair Loss (article)](https://onlinedoctor.superdrug.com/minoxidil.html)
- [Side Effects of Finasteride](https://onlinedoctor.superdrug.com/side-effects-finasteride.html)
- [Side Effects of Propecia](https://onlinedoctor.superdrug.com/propecia-side-effects.html)
- [Help & Frequently Asked Questions (order review, cancellations, reorder, ID check)](https://onlinedoctor.superdrug.com/help.html)
- [Terms and Conditions (18+ for this service, cancellations)](https://onlinedoctor.superdrug.com/terms.html)
- [Discounts and promotions (HL40 terms)](https://onlinedoctor.superdrug.com/discounts-and-promotions.html)
- [Regulation (Health Bridge Ltd, CQC, GMC, GPhC 9010736)](https://onlinedoctor.superdrug.com/regulation.html)
- [How it works](https://onlinedoctor.superdrug.com/how-it-works.html)
- [Sitemap](https://onlinedoctor.superdrug.com/sitemap.xml)
