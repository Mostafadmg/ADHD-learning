# LloydsPharmacy Online Doctor (UK): working notes

Stage 1 (MAP) finished 23 Nov 2026. `node tools/validate.js lloyds-online-doctor --stage map` passes.

## Where things are

- Shop front is Shopify: `https://onlinedoctor.lloydspharmacy.com/` (curl works, no bot wall).
- Consultation engine is a separate Angular app: `https://core.onlinedoctor.lloydspharmacy.com/`.
- Hair-loss collection: `/collections/hair-loss`. **Men only** ("These treatments can only be prescribed to men").
  Choosing Female at the first question ends the questions at once (run `runs/female-01`).
- Entry URLs (all start the same single flow):
  - `…/api/questionnaire/clinic/hair-loss` (every product page button) → 302 to `/loginprompt/0?return_url=…`
  - `…/api/questionnaire/products/3756` (collection page top button; 3756 = clinic default SKU)
  - "Continue as a new patient" → `…/api/questionnaire/clinic/hair-loss?guest` (no sign-in needed).
- A "This service operates in the United Kingdom only" pop-up shows from non-UK addresses; "Continue with UK service" closes it.
- `quiz-definition.json` = the `GET …/api/questionnaire/clinic` response (first screens + 7 products with prices and result-card text).
  It is **not** the full question set: the engine is server-driven (POST answer to
  `/api/questionnaire/traversals/<id>/steps/current`, then GET the same URL for the next screen). Branches were mapped by walking.
- Pages: `pages/*.html|txt`; `pages/products-embedded.json` (prices in pence).

## How to replay

- Walker: `node tools/explore.js <policy.json> <outDir>` (this folder). Policy answers are keyed by the site's questionId.
  Answer forms: `"Option text"`, `["A","B"]`, `{"dob":[d,m,y]}`, `{"card":"Product title"}`, `{"button":"Add to basket"}`.
  `"peek": true` + `"peekFrom"` + `"peekSkip"` tries every other option one level (or two) deep and presses Back.
  Options that end the questions early go to the answers summary (no Back), so the run stops and prints
  `ENDED EARLY`; add that option to `peekSkip` and rerun from that question.
- Baseline man: `baseline-men.json` (also `baseline-men.policy.json`, older copy without the end steps).
  Best full run: `runs/baseline-men-3` (recommendations at screen 25, pack size 26, finasteride safety 27, final consent 28).
- Every screen's raw JSON is in `runs/<run>/steps/` (`step-NN.json`, `peek-NN-<qid>.json`); every API call in `network.jsonl`.
- Peek runs: `runs/peek-01`, `-02` (hair pattern), `-06`, `-07` (onset, body hair), `-08` (scalp, previous treatment, alopecia),
  `-09`, `-10` (conditions list, liver), `-12` (CKD/eGFR), `-13` (CKD to pets, full).

## Account wall

No sign-in is asked during the questions, the recommendation, product choice, pack size or the finasteride safety screen.
The last screen reached is "Please confirm the following to complete your consultation" (question 100467, "I confirm the above").
It was **not** pressed (it completes the consultation). Sign-in is expected straight after it but was not seen.
Early-stop answers (e.g. Female) also land on this same consent screen after the summary, with no product.

## Findings in one paragraph

Early stops (end at once): Female; pattern Complete or Random patches; Sudden onset; body/face hair loss Yes; Alopecia;
liver: alcohol-related/cirrhosis/cancer or sees a hospital specialist; eGFR less than 30. Warnings/acknowledgements:
Temples only, Extensive, scalp changes (says no topicals), depression (finasteride warning with opt-out + 4 mental-health
questions), self-harm (crisis signposting), steroids, allergies, trying for a baby (says no finasteride), pets (topical minoxidil).
Heart/BP Yes, breast cancer, breast tissue enlargement, prostate cancer and partner pregnant add **no** screen: their effect can only
be seen on the recommendation cards (stage 2). Baseline result: suitable for finasteride tablets, minoxidil tablets and minoxidil spray;
"start with a licensed treatment" for new patients; Dual Action packs shown first (both flagged out of stock in the card data).

## What stage 2 should test first (compare recommendation cards against `runs/baseline-men-3`)

1. Heart/BP Yes (107973) - expected loss of minoxidil tablets and Dual Action Tablets.
2. Trying for a baby (108003) and partner pregnant; Depression → "I don't want to use finasteride tablets" (103268).
3. Scalp changes Yes (105935) - topicals removed?
4. Previous treatment Yes (108014) and each 108015 option (not mapped; the walker could not tick those checkboxes:
   try clicking the input inside the label). Likely changes the "new to treatment / licensed first" wording.
5. CKD with eGFR > 30 / unknown; breast cancer; prostate cancer; allergy to minoxidil or finasteride; pets Yes.
6. Age: under 18 and over 65 (date of birth; not tested).
7. Not yet mapped: conditions-list options Phaeochromocytoma, Porphyria, Problems with my sex life, SLE (an explanation pop-up
   blocks the walker); medicines options "Medicines for high blood pressure" and "Medicated creams…"; the two untested liver options;
   "Skip, I already know" at 107977.

## Dead ends

- No full quiz definition in JS chunks or `__NEXT_DATA__` (it is an Angular app driven by the server).
- FAQ/help pages not read in this stage (time).

## Stage 2 (EXPERIMENT) log, started 24 Nov 2026

- Runner: `node tools/exp.js <exp-id> '<overrides JSON>' [--full]` builds `runs/<exp-id>/policy.json` from `baseline-men.json`
  (stops at the recommendation screen unless `--full`), runs `tools/explore.js`, saves `stdout.txt`, and prints a comparison
  (`tools/cmp.js`) with `runs/exp-base` (path added/removed, recommendation text, cards). Follow-up screens get neutral answers
  (consents ticked, free text "None", Yes/No = No, eGFR "More than 30").
- `runs/base-full` (= `runs/exp-base`): baseline replay 24 Nov 2026, 140 s. Same result as stage 1: 6 cards (Dual Action Tablet+Spray and
  Dual Action Tablets out of stock), suitable for finasteride tablets, minoxidil tablets and minoxidil spray. Pack size screen: subscription
  £28 / £80 / £138 (1/3/6 months) and one-off £34 / £95 / £163; finasteride safety screen; stops before final consent 100467.
- e01-heart-yes (107973 Yes): only Finasteride tablets + Propecia; ALL minoxidil removed (tablets AND spray, and both Dual packs); pets question 108001 and "Clinically proven results" 108360 skipped; text "You're suitable for Finasteride tablets", no licensed-first line.
- e02-trying-baby: 108004 warning, then only Minoxidil tablets + Sons spray; all finasteride (incl. Propecia, Dual packs) removed; 108360 skipped.
- e03-partner-pregnant: no change at all.
- e04-dep-nofin: Depression + "I don't want to use finasteride tablets": only Minoxidil tablets + spray; 108003 (baby) and 108360 skipped.
- e05-dep-continue: Depression + continue: 4 mental-health questions (3 text + 108419), then SAME 6 cards, but the "As you're new... licensed treatment" line is dropped.
- e06-scalp-yes: 108139 warning; spray and Dual Tablet+Spray removed; pets question 108001 skipped (shown only when a topical is still possible).
- explore.js patched: text answers fill the question's own textarea (id starts with questionId); options are clicked by label[for=answerId] first (fixes the 108015 checkboxes).
- Previous treatment (108014 Yes → 108015): for each product ticked, 108016 "Has <product> helped?" (Yes, it's helped / It's helped a little / No, I haven't noticed any benefit / It's too early to tell), then 107959 "side effects that were persistent, severe, needed medical attention or made you stop?" Yes → 107981 text. (runs/e07b-prev-topminox-peek)
- e07/e08 previous topical minoxidil or finasteride, helped, no side effects: SAME 6 cards; text says "You've previously used hair loss treatment" and the licensed-first line is dropped.
- e09 previous minoxidil spray, no benefit (12 months+, used regularly → 108017 duration and 108018 adherence asked only after "No benefit"): same cards; text adds "Previously, treatment with Minoxidil spray didn't achieve the results you were hoping for." Product still offered.
- Each product has its own "helped?" question id (spray 108016, finasteride 108022); 107959 side effects id is shared.
- e10 previous finasteride + side effects Yes: 107981 describe, then 108051 "Would you like the option to choose a treatment containing Finasteride 1mg tablets again?" (answered No) → all finasteride removed; text adds "You reported side effects to hair loss treatments".
- e11 allergy minoxidil: all minoxidil removed (tablets, spray, both Duals), pets skipped; only Finasteride + Propecia. e12 allergy finasteride: all finasteride removed, baby question skipped.
- e13 same but 108051 Yes: all 6 cards back; text "You reported side effects ... but would like to be recommended options containing Finasteride tablets".
- e14 pets Yes: 108002 pets warning (I confirm); no change to cards or text.
- e15 CKD + eGFR more than 30: Minoxidil tablets and Dual Action Tablets removed; spray, finasteride, Propecia, Dual Tablet+Spray kept; licensed-first line dropped.
- e16 eGFR "I don't know": same as e15 (oral minoxidil removed).
- e17 age 17 (born 2009): QUESTIONNAIRE_END straight after date of birth, redirect to https://onlinedoctor.lloydspharmacy.com/pages/under-18s.
- e18 age 70 (born 1956): Minoxidil tablets and Dual Action Tablets removed (same as CKD); licensed-first line dropped.
- under-18s page: "We do not treat under 18s. Please see a doctor in person for treatment and medical advice."
- e19 age 65 (born 15/6/1961): oral minoxidil removed like e18. e20 age 19 and e21 age 64: same as baseline. So the cut-off is age 65 and over (observed at 64 vs 65).
- e22 Temples only (108138 warning), e23 Extensive (108376 warning), e24 "Skip, I already know" (skips 3 info screens): offer unchanged in all three.
- e25 breast cancer, e26 prostate cancer: no extra screen, all finasteride removed (only minoxidil tablets + spray); baby question skipped.
- e27 BP medicines (103769): then 108158 "And what about these?"; ALL minoxidil removed (incl. spray) like heart Yes; pets skipped.
- e28 antidepressants: adds 101599 "list all your medications" text; offer unchanged.
- e29 finasteride/dutasteride for prostate: all finasteride removed. e30 ED tablets: finasteride AND minoxidil tablets removed, only Sons Minoxidil spray offered.
- e31 breast tissue enlargement, e32 problems with my sex life: all finasteride removed. e33 other condition Yes: 107160 details text; offer unchanged.
- e22-e33 results are in company.json experiments[]. Key extra findings: ED tablets → only the spray; BP medicines → finasteride only; breast/prostate cancer, breast tissue enlargement and sex-life problems silently remove finasteride.

### Stage 2 status (24 Nov 2026)
- 33 one-change experiments + baseline + 1 peek (about 40 replays). company.json written by `tools/patch_stage2.py` (options, new questions 108016/108022/108017/108018/107959/107981/108051) and `tools/patch_stage2b.py` (experiments, 27 rules, 9 recommendation profiles, summaries). Backup of the stage 1 file: `runs/company.stage1-backup.json`.
- `validate.js lloyds-online-doctor --stage rules` passes.
- Not tested (marked unknown/inferred): Phaeochromocytoma, Porphyria, SLE, medicated scalp creams, liver sub-options 3 and 4, previous oral minoxidil / other medication, "too early to tell", "less than 12 months", irregular use, 108419 Yes, Guanethidine and obstructive uropathy to the end, combined exclusions (e.g. heart/BP + finasteride exclusion).

## Stage 3 (VERIFY) log, 24 Nov 2026

- 18 replays with `tools/exp.js` into `runs/verify-*` (2 stalled on a walker glitch and were rerun: `-trying-baby-2`, `-prostate-cancer-2`). Each run has `cmp.txt` (comparison with `runs/exp-base`).
- Confirmed: baseline, R1 (female, but date of birth is asked first), R3 (age 65), R4 (sudden), R7 (heart/BP), R10 (eGFR < 30), R12 (ED tablets), R13 (baby), R15 (prostate cancer).
- New: Phaeochromocytoma, Porphyria, SLE each remove oral minoxidil only (R28); medicated scalp creams remove the spray (R29); heart/BP + prostate cancer leaves no product and the questions end after 107800 (R30); eGFR "not tested" = oral minoxidil removed; testosterone = warning only.
- Product pages re-read with curl: all 7 prices and strengths match. The Propecia page links to a "finasteride and Regaine bundle" that now returns 404.
- company.json patched by `tools/patch_verify.py` (adds `verification`). `validate.js --stage final` passes.
