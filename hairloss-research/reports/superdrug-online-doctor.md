# Superdrug Online Doctor: consultation and product report

**Market:** UK · **Website:** https://onlinedoctor.superdrug.com/ · **Checked:** 2026-11-23 · **Owner:** Operated by Health Bridge Ltd (the Zava platform; company no. 07392646) under the Superdrug brand; medicines dispensed by Superdrug Stores plc pharmacies

> High-street pharmacy brand running a doctor-led online clinic on the Zava platform: one-page questionnaire, patient picks a preferred product, pays, then a GMC doctor approves, swaps or refuses; one-off orders with reorder, no subscription.

## 1. How far this could be tested

- **Tested by:** live-walk, site-code, public-docs
- **Account wall:** After the questionnaire, the product choice ('Your request') and the delivery choice. Pressing Next on Delivery redirects to /auth/register/ ('Create your patient account': first name, last name, email, password, date of birth, gender, optional mobile). Seen in runs/baseline-men-wall. Just before the wall the patient has already seen the full product list with prices and the delivery options.
- **Blocker:** curl gets HTTP 403; the Playwright browser loads every page normally (no checkpoint seen)
- **Blocker:** The cookie banner blocks clicks on the questionnaire until 'Deny Cookies' (#onetrust-reject-all-handler) is pressed; walk.js does not dismiss it on its own

Stage 1 (map) only. All three entry points were walked with the baseline patients to the product screen; the men's flow was walked on through Delivery to the sign-in wall. Both full questionnaire definitions (FHIR JSON the page itself fetched) are saved, so every question, option and on-screen branch is known. No one-change experiments were run: what each answer does to the product list (women) or to the doctor's decision (all) is still unknown. Age and sex are only asked at account creation, so age and sex rules cannot be tested without an account. The repeat-order questionnaire (id 201038, men) is only for signed-in reorders and was not fetched.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

Superdrug Online Doctor does not run a recommendation quiz. Each service is a single-page medical questionnaire (served as FHIR JSON) with simple show/hide follow-ups and a few warning texts, followed by a product list from which the patient picks a 'preferred treatment'. In the men's service the list is fixed (generic finasteride or Propecia in four pack sizes, or a £25 phone consultation) and the served settings switch the answer-based product filter off, so the screening is done by a doctor after account creation and payment. In the women's services the filter is switched on: the answers go to a product-rules service that can remove products before the list is shown (rules not yet tested). Age and sex are not asked in the questionnaire at all; they are collected when the account is created.

## 3. Engine rules (5)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | men | men-q2 (hair pattern) = A, E or 'No pattern fits well' | An extra item appears asking for 2 photos of the hair pattern (not flagged as required in the definition). | Adds questions | code | high |
| R2 | men | men-q2 (hair pattern) = E | A required tick box warns that the medicine is unlikely to help extensive hair loss; the patient can still continue. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ | Shows a warning | code | high |
| R3 | men | men-q6 (other scalp changes) = Yes, or men-q7 (erections) = No | A warning text is shown (see your GP first / erectile dysfunction may worsen). The definition has no stop: the form can still be sent. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ | Shows a warning | code | medium |
| R4 | men | any set of answers on the men's questionnaire | The product list is not filtered by answers: the service is served with fhir_product_filter_enabled = 0 and the page only calls the filter when that flag is on. The baseline run made no product-rules call. Suitability is left to the doctor after payment. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Telephone Consultation with a Doctor (no medicine included))_ | No effect | code | medium |
| R5 | women | any set of answers on the women's questionnaire | After Next the page posts the answers to /consultation-triage/product-rules; every product id listed under data[].suggestions is removed from 'Your request'. For the baseline woman the reply was empty, so nothing was removed. Which answers remove which products is not yet known. _(affects: Alpecin Caffeine Shampoo 250ml, Alpecin Double Effect Shampoo 200ml, Regaine for Women 2% w/w solution 60ml, Nourkrin Woman Hair Growth Tablets (60))_ | Removes a product | code | medium |

## 4. Products (8)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Finasteride 1mg tablets (generic)](https://onlinedoctor.superdrug.com/finasteride.html) | rx-oral | finasteride 1mg | tablet, one a day | men | POM, licensed generic (site: 'prescription-only'; made by Milpharm Ltd) | £27.00 for 28 tablets (1 month), one-off order (56 tablets £54.00; 84 tablets £79.00; 168 tablets £137.00. With code HL40 (40% off the hair-loss service): £16.20 / £32.40 / £47.40 / £82.20. No subscription: each supply is a separate order (reorder from the account). …) | Shown to every man who completes the men's questionnaire: the baseline man saw all four pack sizes. The patient picks a 'preferred treatment'; a doctor approves, swaps or refuses after payment. Not offered in the women's flows. | observed |
| [Propecia 1mg tablets (brand)](https://onlinedoctor.superdrug.com/propecia.html) | rx-oral | finasteride 1mg | tablet, one a day | men | POM, licensed brand (Organon Pharma) | £60.00 for 28 tablets (1 month), one-off order (56 tablets £110.00; 84 tablets £140.00; 168 tablets £265.00. With code HL40: £36.00 / £66.00 / £84.00 / £159.00.) | Shown to every man who completes the men's questionnaire, next to generic finasteride (baseline man saw all four pack sizes). Patient's choice; doctor decides after payment. | observed |
| [Regaine for Men Extra Strength foam 50mg/g (3 x 73ml)](https://onlinedoctor.superdrug.com/regaine-for-men.html) | otc-medicine | minoxidil 5% (50mg/g) | scalp foam, twice a day | men | Non-prescription medicine (site: 'available without a prescription'; the site does not say whether it is P or GSL) | £65.99 for 3 x 73ml (Hair-loss page shows £39.59 with HL40; the product page shows a different code, HL30 (£46.19).) | unknown. It is on the men's price table and its page says 'one of our doctors will check whether Regaine is suitable', but it was NOT in the men's 'Your request' list in the baseline run (only finasteride, Propecia and the phone consultation were). How a man orders it is not clear. | docs |
| [Regaine for Men Extra Strength solution 5% w/w (3 x 60ml)](https://onlinedoctor.superdrug.com/regaine-for-men.html) | otc-medicine | minoxidil 5% w/w | scalp solution, 1ml twice a day | men | Non-prescription medicine (site: 'non-prescription treatment'; P or GSL not stated) | £70.00 for 3 x 60ml (Hair-loss page shows £42.00 with HL40; the product page shows HL30 (£49.00).) | unknown. Listed on the men's price table but not shown in the men's 'Your request' list in the baseline run. | docs |
| [Alpecin Caffeine Shampoo 250ml](https://onlinedoctor.superdrug.com/alpecin.html) | cosmetic | caffeine not stated | shampoo, daily, leave on 2 minutes | both | Cosmetic shampoo (site: 'non-prescription hair loss treatment'). The product API flags it prescription=true, which looks like a set-up quirk: it is still reviewed by a doctor. | £7.50 for 250ml (Hair-loss page shows £4.50 with HL40; the Alpecin page shows HL30 (£5.25) and a headline 'from £5.50' that matches no table row.) | Shown to the baseline woman on 'Your request' in both women's entry points. Listed on the men's price table but NOT shown in the men's product step in the baseline run. | observed |
| [Alpecin Double Effect Shampoo 200ml](https://onlinedoctor.superdrug.com/alpecin.html) | cosmetic | caffeine not stated; salicylic acid not stated | anti-dandruff shampoo, daily | both | Cosmetic shampoo (non-prescription) | £9.99 for 200ml (Hair-loss page shows £5.99 with HL40; the Alpecin page shows HL30 (£6.99).) | Shown to the baseline woman on 'Your request' in both women's entry points. Not shown in the men's product step in the baseline run. | observed |
| [Regaine for Women 2% w/w solution 60ml](https://onlinedoctor.superdrug.com/regaine-for-women.html) | otc-medicine | minoxidil 2% w/w | scalp solution, 1ml twice a day | women | Non-prescription medicine (P or GSL not stated on site). Product page: for women aged 18 to 65 with hereditary hair loss. | £25.00 for 60ml (One pack size only. No discount code shown on the women's pages.) | Shown first on 'Your request' when a woman enters through 'Request Regaine for Women' (service 147757) and second through 'Request Nourkrin' (147778). The women's services filter products by answers (served settings), so some answers probably remove it: not yet tested. | observed |
| [Nourkrin Woman Hair Growth Tablets (60)](https://onlinedoctor.superdrug.com/nourkrin-woman.html) | supplement | Marilex (fish extract) not stated | tablet, one twice a day | women | Food supplement (site: 'nutritional supplement'). Not suitable for women allergic to fish. | £51.00 for 60 tablets (1 month) (One pack size only. Hair-loss-in-women page: £0.85 per tablet.) | Shown first on 'Your request' through 'Request Nourkrin' (service 147778) and second through 'Request Regaine for Women' (147757). May be removed by some answers (for example fish allergy): not yet tested. | observed |
| [Telephone Consultation with a Doctor (no medicine included)](https://onlinedoctor.superdrug.com/hair-loss-consultation.html) | service | n/a | 10-minute phone call | both | Clinical service from a CQC-registered provider (Health Bridge Ltd) | £25.00 (Title says 'Available 2-3pm Friday'; its information text says appointments are 2pm to 3pm on Tuesday, Wednesday and Thursday (the site contradicts itself). Does not include treatment costs.) | Always the last option on 'Your request' in all three flows (men, women via Regaine, women via Nourkrin) for the baseline patients. | observed |

## 5. Who gets what (2 patient profiles)

- **Baseline man: self-diagnosed, pattern C, never used finasteride, gradual loss for more than a month, no scalp changes, no erection problems, no conditions, medicines or allergies** → Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand), Telephone Consultation with a Doctor (no medicine included). All four pack sizes of generic finasteride and of Propecia, plus the phone consultation. Nothing preselected, no 'recommended' label. Regaine for Men and Alpecin were not offered. (runs/baseline-men, runs/baseline-men-wall) _[observed]_
- **Baseline woman: none of the listed hair/scalp situations, no high blood pressure or heart condition, not pregnant or breastfeeding, no conditions, medicines or allergies** → Regaine for Women 2% w/w solution 60ml, Nourkrin Woman Hair Growth Tablets (60), Alpecin Caffeine Shampoo 250ml, Alpecin Double Effect Shampoo 200ml, Telephone Consultation with a Doctor (no medicine included). Same five options from both entry points; the entry product is listed first. (runs/baseline-women-regaine, runs/baseline-women-nourkrin) _[observed]_

## 6. The consultation, question by question

### Men's hair-loss consultation (service 147929 'HAIR LOSS SD 2', questionnaire 201037 version 7)

Entry: https://onlinedoctor.superdrug.com/hair-loss-consultation.html

One page with 11 always-shown medical questions (up to 18 conditional follow-up items) and 3 required ticks → 'Your request' (pick finasteride or Propecia pack, or a phone consultation) → Delivery choice → ACCOUNT WALL (create patient account: name, email, password, date of birth, gender) → address → order summary → payment → doctor review (not tested).

**1. These medical questions help our doctors treat you safely. Check that you fully understand them, and message us if you're unsure. (Banner above: 'Please note: This service is only available in the UK.')**  
_info · anonymous · role: expectation-setting · shown: always · no branch · observed_  
Why they ask: Sets the frame: answers go to a doctor. Whole questionnaire is one scrolling page.


**2. Have you been diagnosed with Androgenic Alopecia (Male Pattern Baldness)?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Checks whether a clinician has confirmed male pattern hair loss.

- `Yes, by my GP` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The men's service has its product filter switched off in the served settings, so the product list should stay the same; what the doctor does with this answer after payment is unknown. _[unknown]_
- `Yes, by a specialist` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The men's service has its product filter switched off in the served settings, so the product list should stay the same; what the doctor does with this answer after payment is unknown. _[unknown]_
- `No, self-diagnosis` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**3. Please choose your hair pattern.**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Grades the hair loss with five pictures (a simplified Norwood scale). The pictures are in pattern-images/.  
Downstream: A, E and 'No pattern fits well' add a photo-upload item; E also adds a required warning tick.

- `A` → **Adds questions**: Picture: full head of hair, no visible loss. Shows the extra item 'Please upload 2 photos clearly showing your hair pattern.' (definition). Effect on products not tested. _[code]_
- `B` → **Unknown**: Picture: receding temples only. No extra item in the definition. Not tested yet. Nothing changes on screen in the questionnaire definition. The men's service has its product filter switched off in the served settings, so the product list should stay the same; what the doctor does with this answer after payment is unknown. _[unknown]_
- `C` → **No effect**: Picture: receding hairline plus a bald spot on the crown. Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_
- `D` → **Unknown**: Picture: deeper recession and a larger crown patch, with a band of hair between. No extra item in the definition. Not tested yet. Nothing changes on screen in the questionnaire definition. The men's service has its product filter switched off in the served settings, so the product list should stay the same; what the doctor does with this answer after payment is unknown. _[unknown]_
- `E` → **Adds questions**: Picture: top of the head bald, hair only at the sides. Shows the photo-upload item AND a required tick box warning that the medicine is unlikely to help much (definition). Effect on products not tested. _[code]_
- `No pattern fits well` → **Adds questions**: Picture: a 'no' symbol. Shows the photo-upload item (definition). Effect on products not tested. _[code]_

**4. Please upload 2 photos clearly showing your hair pattern.**  
_photo · anonymous · role: diagnosis · shown: men-q2 = A, E or 'No pattern fits well' · no branch · code_  
Why they ask: Lets the doctor see the scalp when the picture choice is unusual (no loss, very advanced, or no match).


**5. From the hair distribution image that you've selected, your hair loss may be quite extensive. In this case it is unlikely that this medication will lead to a significant improvement in your hair distribution. It is also possible that the side effects or possible risks of treatment may outweigh any benefits. Please tick to confirm if you would like to continue with the assessment.**  
_consent · anonymous · role: expectation-setting · shown: men-q2 = E · no branch · code_  
Why they ask: Sets expectations for advanced hair loss and records that the patient chose to go on.

- `(tick box)` → **Shows a warning**: Required tick before 'Next' can be pressed (definition: required). It warns but does not stop the patient. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**6. Are you currently using finasteride (or the brand Propecia)?**  
_single · anonymous · role: personalisation · shown: always · BRANCHES · observed_  
Why they ask: Separates new starters from men already on treatment.  
Downstream: Yes adds a free-text follow-up; No adds a yes/no question about past use.

- `Yes` → **Adds questions**: Shows the free-text item 'Are you finding it effective? Have you had any side effects?' (definition). Effect on products not tested. _[code]_
- `No` → **Adds questions**: Shows 'Have you taken finasteride or Propecia for hair loss before?' (seen in runs/baseline-men). Full product list shown. _[observed]_

**7. Are you finding it effective? Have you had any side effects?**  
_text · anonymous · role: safety-screen · shown: men-q3 = Yes · no branch · code_  
Why they ask: Free text for the doctor about current treatment and tolerability.


**8. Have you taken finasteride or Propecia for hair loss before?**  
_single · anonymous · role: safety-screen · shown: men-q3 = No · BRANCHES · observed_  
Why they ask: Finds past users so the doctor can ask about results and side effects.  
Downstream: Yes adds a free-text follow-up.

- `Yes` → **Adds questions**: Shows the free-text item 'Was it effective? Did you have any side effects?' (definition). Effect on products not tested. _[code]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**9. Was it effective? Did you have any side effects?**  
_text · anonymous · role: safety-screen · shown: men-q3b = Yes · no branch · code_  
Why they ask: Free text for the doctor about past treatment.


**10. When did you first notice any hair loss?**  
_single · anonymous · role: diagnosis · shown: always · no branch · observed_  
Why they ask: Very recent loss points away from male pattern hair loss.

- `In the last month` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The men's service has its product filter switched off in the served settings, so the product list should stay the same; what the doctor does with this answer after payment is unknown. _[unknown]_
- `More than a month ago` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**11. How did your hair loss start?**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Sudden onset suggests another cause (illness, stress, medicines).  
Downstream: Suddenly adds two free-text questions.

- `Suddenly` → **Adds questions**: Shows two free-text items: 'Do you think your hair loss could be due to any other causes?' and 'Can you give more details about how your hair loss started?' (definition). Effect on products not tested. _[code]_
- `Gradually (over months)` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**12. Do you think your hair loss could be due to any other causes?**  
_text · anonymous · role: diagnosis · shown: men-q5 = Suddenly · no branch · code_  
Why they ask: Free text for the doctor.


**13. Can you give more details about how your hair loss started?**  
_text · anonymous · role: diagnosis · shown: men-q5 = Suddenly · no branch · code_  
Why they ask: Free text for the doctor.


**14. Have you noticed any other changes to the areas where you are losing hair? (Help text: Such as redness, itching, flaking or soreness)**  
_single · anonymous · role: diagnosis · shown: always · BRANCHES · observed_  
Why they ask: Scalp symptoms suggest a skin disease rather than pattern hair loss.  
Downstream: Yes adds a 'see your GP first' message and a free-text box.

- `Yes` → **Shows a warning**: Shows a warning text ('…We'd suggest you see your GP first to consider any other causes before taking this medication.') and a free-text box (definition). It does not stop the form in the definition. Effect on products not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**15. These symptoms suggest there could be other causes contributing to your hair loss, other than male pattern hair loss, which may improve with other treatments. We'd suggest you see your GP first to consider any other causes before taking this medication.**  
_info · anonymous · role: safety-screen · shown: men-q6 = Yes · no branch · code_  
Why they ask: Soft warning: steers the patient to a GP.


**16. Please describe the all changes that you've noticed**  
_text · anonymous · role: diagnosis · shown: men-q6 = Yes · no branch · code_  
Why they ask: Free text for the doctor (wording copied exactly, including the typo).


**17. Can you always get and maintain an erection when you want one?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Baseline sexual function before a medicine that can cause erectile dysfunction.  
Downstream: No adds a warning text.

- `Yes` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_
- `No` → **Shows a warning**: Shows a warning text: finasteride and Propecia cause sexual problems in around 2% of men, so erectile dysfunction may get worse (definition). It does not stop the form. Effect on products not tested. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**18. One of the side effects of finasteride and Propecia, which occurs in around 2% of men, is problems with sexual function, including erectile dysfunction, meaning your symptoms of ED may worsen.**  
_info · anonymous · role: expectation-setting · shown: men-q7 = No · no branch · code_  
Why they ask: Soft warning about sexual side effects.


**19. Do you have, or have you had, any of the following conditions?**  
_multi · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Screens for conditions that matter with finasteride (it lowers PSA, has been linked to male breast cancer reports, and is cleared by the liver) and for skin disease.  
Downstream: Liver condition or skin condition adds a required details box.

- `Prostate cancer` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The men's service has its product filter switched off in the served settings, so the product list should stay the same; what the doctor does with this answer after payment is unknown. _[unknown]_
- `Breast cancer` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The men's service has its product filter switched off in the served settings, so the product list should stay the same; what the doctor does with this answer after payment is unknown. _[unknown]_
- `Liver condition` → **Adds questions**: Shows a required free-text item 'Please provide more details.' (definition). Effect on products not tested. _[code]_
- `Any type of skin conditions` → **Adds questions**: Shows a required free-text item 'Please provide more details.' (definition). Effect on products not tested. _[code]_
- `None of the above` → **No effect**: Exclusive option. Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**20. Please provide more details.**  
_text · anonymous · role: safety-screen · shown: men-q8 includes 'Liver condition' or 'Any type of skin conditions' · no branch · code_  
Why they ask: Free text about the liver or skin condition.


**21. Do you have any other medical conditions not mentioned above?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Catch-all medical history. Note: there is no specific question about depression, although the consent text and product text warn about it.  
Downstream: Yes adds a details box.

- `Yes` → **Adds questions**: Shows a free-text item 'Please provide more details' (definition). Effect on products not tested. _[code]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**22. Please provide more details**  
_text · anonymous · role: safety-screen · shown: men-q9 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**23. Are you currently taking any medication, or have you recently finished a course of medication?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Medicines history for the doctor.  
Downstream: Yes adds two required text boxes.

- `Yes` → **Adds questions**: Shows two required free-text items: 'Please list the names and doses of all these medications?' and 'What do you use these medications for?' (definition). Effect on products not tested. _[code]_
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
Downstream: Yes adds an allergy tick list.

- `Yes` → **Adds questions**: Shows the required tick list 'What allergies do you have?' (definition). Effect on products not tested. _[code]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men). _[observed]_

**27. What allergies do you have?**  
_multi · anonymous · role: safety-screen · shown: men-q11 = Yes · BRANCHES · code_  
Why they ask: Picks out allergies that matter for finasteride tablets and their excipients.  
Downstream: Peanut/soya, lactose and 'other' each add a follow-up.

- `Finasteride` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The men's service has its product filter switched off in the served settings, so the product list should stay the same; what the doctor does with this answer after payment is unknown. (Clinically this should rule out both tablets.) _[unknown]_
- `Peanuts or Soya` → **Adds questions**: Shows a required tick box explaining that some manufacturers' tablets are not suitable for people with peanut or soya allergy (definition). _[code]_
- `Lactose` → **Adds questions**: Shows the yes/no item 'Can you take medication that contains lactose?' (definition). _[code]_
- `Other medications` → **Adds questions**: Shows a required free-text item asking what the patient is allergic to (definition). _[code]_
- `Other substances` → **Adds questions**: Shows a required free-text item asking what the patient is allergic to (definition). _[code]_

**28. Our pharmacists source medication from a wide range of approved manufacturers to ensure we have a good supply available. Some manufacturers produce medication that isn’t suitable for people who suffer with peanut or soya allergies. Before starting your medication, it’s important to check the enclosed manufacturer’s leaflet to make sure the medication you’ve received is suitable for people with peanut or soya allergies. We also recommend checking with your local pharmacist. Please tick if you’d still like to proceed with your order.**  
_consent · anonymous · role: consent · shown: men-q11a includes 'Peanuts or Soya' · no branch · code_  
Why they ask: Shifts the excipient check to the patient.

- `(tick box)` → **Shows a warning**: Required tick before 'Next' (definition). A warning, not a stop. _(affects: Finasteride 1mg tablets (generic), Propecia 1mg tablets (brand))_ _[code]_

**29. Can you take medication that contains lactose?**  
_single · anonymous · role: safety-screen · shown: men-q11a includes 'Lactose' · no branch · code_  
Why they ask: Finasteride tablets usually contain lactose.

- `Yes` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The men's service has its product filter switched off in the served settings, so the product list should stay the same; what the doctor does with this answer after payment is unknown. _[unknown]_
- `No` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The men's service has its product filter switched off in the served settings, so the product list should stay the same; what the doctor does with this answer after payment is unknown. _[unknown]_

**30. Please tell us what medications or substances you’re allergic to.**  
_text · anonymous · role: safety-screen · shown: men-q11a includes 'Other medications' or 'Other substances' · no branch · code_  
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
- `Superdrug Pharmacy Collect (FREE) – 'Find a location near' search box` → **Unknown**: Not chosen (the store search needs a location). _[unknown]_
- `Express Delivery (£3.99) – with an optional tick 'Deliver without a signature'` → **Unknown**: Not chosen. _[unknown]_

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
_multi · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: These four situations match the 'do not use' list for minoxidil scalp solution (shaved or damaged scalp, sudden/patchy loss, loss after childbirth).

- `a shaved scalp` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. _[unknown]_
- `sudden or patchy hair loss` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. _[unknown]_
- `skin problems on the scalp - such as sunburn or psoriasis` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. _[unknown]_
- `hair loss associated with childbirth` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. _[unknown]_
- `none of the above` → **No effect**: Exclusive option. Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**3. Do you have, or are you using treatment for, high blood pressure?**  
_single · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Minoxidil can lower blood pressure; its leaflet tells people with treated or untreated high blood pressure not to use it.

- `Yes` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. _[unknown]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**4. Do you have any conditions affecting your heart? (Help text: Including an irregular heart beat.)**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Heart disease is a caution for minoxidil.  
Downstream: Yes adds a required details box.

- `Yes` → **Adds questions**: Shows a required free-text item 'Please provide more details:' (definition). Effect on products not tested. _[code]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**5. Please provide more details:**  
_text · anonymous · role: safety-screen · shown: women-q3 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**6. Are you pregnant or breastfeeding?**  
_single · anonymous · role: safety-screen · shown: always · no branch · observed_  
Why they ask: Minoxidil is not for use in pregnancy or breastfeeding. Note: there is no question about trying for a baby, contraception, periods or menopause.

- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_
- `I'm pregnant` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. _[unknown]_
- `I'm breastfeeding` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. _[unknown]_

**7. Do you have any other health conditions?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Catch-all medical history.  
Downstream: Yes adds a details box.

- `Yes` → **Adds questions**: Shows a free-text item 'Please provide more details' (definition). Effect on products not tested. _[code]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**8. Please provide more details**  
_text · anonymous · role: safety-screen · shown: women-q5 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**9. Are you currently taking any medication, or have you recently finished a course of medication?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Medicines history.  
Downstream: Yes adds two required text boxes.

- `Yes` → **Adds questions**: Shows two required free-text items: 'Please list the names and doses of all these medications?' and 'What do you use these medications for?' (definition). Effect on products not tested. _[code]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**10. Please list the names and doses of all these medications?**  
_text · anonymous · role: safety-screen · shown: women-q6 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**11. What do you use these medications for?**  
_text · anonymous · role: safety-screen · shown: women-q6 = Yes · no branch · code_  
Why they ask: Free text for the doctor.


**12. Are you allergic to any medicines or other substances?**  
_single · anonymous · role: safety-screen · shown: always · BRANCHES · observed_  
Why they ask: Allergy screen.  
Downstream: Yes adds a ten-item allergy tick list.

- `Yes` → **Adds questions**: Shows the required tick list 'Please tick all of the allergies that apply to you.' (definition). Effect on products not tested. _[code]_
- `No` → **No effect**: Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine). _[observed]_

**13. Please tick all of the allergies that apply to you.**  
_multi · anonymous · role: product-selector · shown: women-q7 = Yes · BRANCHES · code_  
Why they ask: Each option lines up with an ingredient of one of the four products, which fits a product-by-product filter.  
Downstream: 'Other' options add a details box. Product effects are the first thing stage 2 should test.

- `Minoxidil` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. (Likely target: Regaine for Women.) _[unknown]_
- `Penicillin` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. _[unknown]_
- `Fish` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. (Likely target: Nourkrin, which contains fish extract.) _[unknown]_
- `Caffeine` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. (Likely target: the two Alpecin shampoos.) _[unknown]_
- `Peanuts or Soya` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. _[unknown]_
- `Ethanol` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. (Likely target: Regaine solution, which contains alcohol.) _[unknown]_
- `Propylene glycol` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. (Likely target: Regaine solution.) _[unknown]_
- `Lactose` → **Unknown**: Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it. _[unknown]_
- `Other medication` → **Adds questions**: Shows a required free-text item 'Please provide more details.' (definition). _[code]_
- `Other substance` → **Adds questions**: Shows a required free-text item 'Please provide more details.' (definition). _[code]_

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

- `Free Standard Delivery (FREE)` → **Unknown**: Not walked in the women's flows; the step list served for services 147757 and 147778 is the same as the men's. _[code]_
- `Superdrug Pharmacy Collect (FREE)` → **Unknown**: Not walked in the women's flows. _[code]_
- `Express Delivery (£3.99)` → **Unknown**: Not walked in the women's flows. _[code]_

**20. Create your patient account. Fields: First Name; Last Name; Email (a verification code is sent); Password; Date of birth (day, month, year: the year list runs from 2011 back to 1900); Gender (Female / Male); Mobile number (optional); Superdrug.com marketing communications (optional tick); 'I agree to the Terms and Conditions and the Privacy Policy.'**  
_contact · after-account · role: identity · shown: after pressing Next on Delivery · no branch · code_  
Why they ask: ACCOUNT WALL (seen in the men's flow; the women's services serve the same step list: section, product, delivery, checkout_summary, login, payment). Age and sex are first asked here.


## 7. Competitive read

**Strengths**

- Trusted high-street brand; CQC-registered doctor service and GPhC-registered Superdrug pharmacies
- Very short and fast: one page, no account needed until after product and delivery choice, prices visible up front
- Low generic price (£27 a month, about £16 with code HL40; £137 for six months) and free delivery or same-day store collection
- Clear informed-consent text on fertility, depression, PSA/prostate and sexual side effects

**Weaknesses**

- Men are offered tablets only: no topical finasteride, no oral minoxidil, no combination, and Regaine/Alpecin are advertised for men but missing from the men's product step
- No recommendation or guidance on which product or pack to pick; no personalisation
- No direct questions on depression or mental health, family history, age or trying for a baby (handled by a consent tick or left to the doctor)
- Women get only OTC minoxidil 2%, a supplement and caffeine shampoo; no prescription options and no questions on periods, menopause, PCOS, thyroid or iron
- Site copy is inconsistent (HL40 vs HL30 codes, phone-consultation days, Alpecin 'from £5.50')
- No subscription or adherence support: every supply is a new order

**Gaps a new competitor could use**

- A guided result ('this is what suits you and why') instead of a bare product list
- Topical and combination options for men who do not want oral finasteride
- A real women's pathway with proper differential questions and prescription options
- Ask about mood and fertility plans as questions, not just consent text
- Subscription with check-ins and progress photos

## 10. Limits of this report

- No one-change experiments yet: option effects marked 'unknown' are untested.
- The doctor's decision rules after payment cannot be seen from outside; only the on-screen engine is mapped.
- Age and sex are asked only at account creation, so under-18, over-65 and wrong-sex handling could not be tested.
- The men's repeat-order questionnaire (201038) and everything after sign-in (address, ID check, payment) were not seen.
- The site does not state whether Regaine products are P or GSL; legal class is recorded only as 'non-prescription'.
- Our browser was seen as outside the UK (clientIPCountryCode 'US' in the served settings) yet was not blocked; UK visitors may see the same pages but this was not confirmed.

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
