# Treated (UK) – hair loss – stage 1 map (working log)

Checked 2026-11-23. Stage 1 (map) investigator. An earlier mapper had saved raw pages, the male quiz definition and
treatment options; this attempt continued from that.

## Where things are
- Public pages: https://uk.treated.com/hair-loss/ (+ /finasteride/, /propecia/, /dutasteride/, /avodart/, /regaine/,
  /finasteride-minoxidil-drops/, /compare/). Copies in raw/*.html and raw/*.txt.
- Consultation app: https://start.treated.com/GBR/en/#/choose-gender/024 (024 = hair loss condition code).
  Entry from uk.treated.com/consultation-startup?condition=024&uf=cond ("Start now").
- Quiz definition: JSON the app fetches from start.treated.com/gbr/catalog/getquestionsbycountry (saved as
  quiz-definition-male.json). Each option carries frontendAction (Proceed / OfflineTreatment / Block / FollowupQuestion),
  blocker text and follow-up questions.
- Product-specific "secondary questions": start.treated.com/gbr/catalog/getsecondaryquestions (after Save on a product).
- Treatment options + auto-offer restrictions: start.treated.com/gbr/prescription/gettreatmentoptions
  (saved as treatment-options-baseline-men.json; readable dump raw/options-baseline-men.txt via scripts/dump-options.py).

## Flow (men, observed runs/b1-men, b3-men-save, b4-men-wall)
choose sex (+ 18+ / terms confirmation) → 11 questions → GP info → height/weight → medical profile (9 toggles) →
"Does this look right?" → "We're checking what's safe for you..." → treatment options (pre-selected Finasteride 1mg x28,
£34.95/month; Edit; Choose for me) → Save → product secondary question (finasteride warning, "I understand") →
checkout = ACCOUNT WALL (first name, last name, DOB, email, phone). Stopped there.

## How to replay
node tools/walk.js companies/treated/scripts/b1-men-to-options.json companies/treated/runs/<id> --last
(baseline-men.json = the same file: baseline man up to the treatment options screen. Add a Save step to reach the product
questions and checkout; never fill the checkout fields. baseline-women-gate.json shows the female hard stop.)

## Entry points (all men; same 11 questions, compared byte for byte for Dutasteride)
- General: https://uk.treated.com/consultation-startup?condition=024&uf=cond → "Start now" → start.treated.com/GBR/en/#/choose-gender/024
- Product buttons: same URL + &product=<UID>&uf=prod → #/choose-gender/024/<UID>. UIDs: 024-143 Finasteride, 024-313 Propecia,
  024-1973 Dutasteride, 024-1915 Avodart, 024-322 Regaine. Effect: only the pre-selected product on the options screen changes.
- Women: choosing Female gives a hard-stop pop-up ("This treatment category isn't suitable for the gender you have selected.").
  Hair loss is male-only (conditionDetail.preferredGender check in raw/js/2644.js). No women's hair-loss products. runs/w1-women.
- Finasteride + Minoxidil Drops (compounded) page exists but shows "Not available"; not in the consultation.

## Product questions after Save (getsecondaryquestions, per product)
- Finasteride: 1 acknowledgement (side-effect warning, "I understand").
- Dutasteride and Avodart: 3 (previous finasteride/minoxidil use with 4 options; off-label acknowledgement; side-effect warning).
- Regaine: none, Save goes straight to checkout (runs/p2-regaine-save).
- Propecia: not captured.

## The engine (what the served data says)
- Each option in quiz-definition-male.json has frontendAction: Proceed / OfflineTreatment / Block / FollowupQuestion.
  OfflineTreatment answers (server tags them backendAction "AdvisePrompt") push the case to clinician review: the options
  screen then says "We still need to review your consultation..." (mode "Offline"). Only Block = "Mental illness" in the
  conditions list (hard stop pop-up "Finasteride and mental illness").
- In the baseline TWO answers are OfflineTreatment: "Have you seen a doctor about it? = No" and "Which hair loss treatment(s)
  have you used before? = I've never used any". So the baseline man is never auto-offered.
- gettreatmentoptions carries restriction.autoOffer per product/dosage/quantity (all the same for hair loss): age 18-49,
  BMI <= 35, offerIfHasConditions/Surgeries/Medications/Allergies/Disability/FamilyMember/RecreationalDrugs = false,
  smoking and drinking allowed. Date of birth is only asked at checkout (after the wall).
- Medical-profile pop-up wording is in raw/start-localeResources-en.json (section onBoardingMedicalProfile).

## Dead ends / gotchas
- Replays sometimes fail at the GP "Okay" pop-up or "Yes, correct" (timing) or a late cookie banner; the scripts now carry
  extra waits. Medical-profile pop-ups are modal: you can only open one per run.
- "Choose for me" opens a "note for your clinician" box, then Continue (not pressed; leads to checkout).

## What stage 2 should test first (highest chance of changing the offer)
1. "Have you seen a doctor about it?" = Yes, together with "used before" = Propecia or Finasteride: does mode switch to
   AutoOffer ("Based on what you've told us, our clinician has recommended the treatments below") and does the list change?
   Then each of the two alone.
2. Each OfflineTreatment option one at a time against that auto-offer baseline (pattern options, <3 months, scars, BP high /
   low / don't know, BP checked >6 months, each condition, each symptom).
3. BP "Low (Below 90/60)" is Proceed in the definition: check whether Regaine is still listed.
4. BMI over 35 (e.g. 5ft10, 18st) and each medical-profile tick (condition, medication, allergy) for auto-offer removal.
5. Mental illness hard stop: confirm the pop-up and whether "continue" exists for minoxidil only.
6. Propecia product questions (Save with Propecia selected).

# Stage 2 (experiment), 23–24 Nov 2026

## How to replay
- `node scripts/gen.js scripts/exp/<id>.json '<overrides json>'` builds an action file from the baseline answers.
  Keys: pattern[], when, doctor, used[], scars, bp, checked, cond[], sym[], extra, gp, ht[ft,in], wt[st,lb],
  profile[walk steps inserted on the medical-profile screen], start (entry URL), extra2[steps after the options screen].
  Clean auto-offer base = `{"doctor":"Yes","used":["Propecia or Finasteride"]}` (runs/e01-clean).
- `source scripts/R.sh; R <id> '<overrides>'` = gen + walk --last + summary. Each replay takes about 2.5 minutes.
- `node scripts/summ.js runs/<id>` prints mode (Auto / Offline), message, product list and pre-selected product from
  gettreatmentoptions; `node scripts/odiff.js runs/A runs/B` diffs two responses.
- Medical-profile pop-ups: condition = tick, fill "Type here", "Add condition", "Confirm". Smoking / drinking = tick,
  pick the option, "Confirm".

## Findings
- The answers never change the products or prices, only the mode: Auto ("our clinician has recommended") vs Offline
  (clinician review). Baseline is Offline because of two flags (not seen a doctor, never used treatment); each alone keeps
  it Offline (e02, e03); both removed gives Auto (e01).
- Confirmed live Offline flags: sudden onset, scars, high BP, heart, itchy scalp, BMI 40, a typed condition (asthma).
  Low BP has no effect. Mental illness = inline hard stop with Continue disabled (e04).
- NEW: stage 1 said all products share the same limits. Not true: Dutasteride and Avodart have offerIfSmoke false and
  offerIfDrink false (and no age/BMI limits). In Auto mode any smoking answer (even ex-smoker) or any alcohol removes both;
  from the Dutasteride link the default falls back to Finasteride (e16, e17, e19, e20). In Offline mode all five stay (e18).
- Previous treatment type does not change the default (e08, e09). Propecia Save = the one finasteride warning (e15).
- Not tested: see limitations in company.json. Open question: why BMI > 35 sends the whole case to review (dutasteride has
  no BMI limit); a replay of the Dutasteride link with BMI 40 would answer it.

# Stage 3 (verify), 24 Nov 2026

Independent re-test. Runs are in runs/verify-* (action files scripts/exp/verify-*.json, built with scripts/gen.js; the
women run reuses scripts/w1-women-start.json). Patches: scripts/patch-verify.js, scripts/patch-verify2.js.

- Both baselines replayed fresh and match (verify-baseline Offline, verify-auto Auto, same five products, Finasteride default).
- Main correction: the "We still need to review your consultation..." / "our clinician has recommended" messages are only in
  the gettreatmentoptions response (displayMessage). The visible options screen is word for word the same in both modes and no
  captured run shows either message. Earlier text that said the screen shows them was fixed.
- To see the product list on screen: extra2 steps Edit, wait, click text "Finasteride" nth 2 (works in Auto mode; failed once
  in Offline mode). verify-smoke shows only Finasteride, Regaine, Propecia; verify-bp-low shows all five.
- Confirmed live: female stop, mental-illness stop, smoker and light drinker lose dutasteride/Avodart, Dutasteride-link fallback
  to Finasteride (with drinking), low BP no effect, BMI 40 Offline (also from the Dutasteride link, so the BMI rule is case-wide),
  under 3 months, BP checked over 6 months, a medication and an allergy all send the case to review.
- Medication pop-up needs Medication name, Dosage and Frequency filled before "Add medication" is enabled.
- Site map (page-sitemap.xml) shows a telogen effluvium category with Regaine (incl. Regaine for Women), marked Not available;
  added as product te-reg. Other hair-loss URLs in the site map are the known five products and the drops.
- Prices re-read on the live product pages: all match.
