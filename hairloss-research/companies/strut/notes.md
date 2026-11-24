# Strut Health (US): working notes

Stage 1 (MAP), started 23 Nov 2026. Everything here is from public pages, anonymous browser only.

## Where things are (first pass)
- Marketing site: https://www.struthealth.com (Next.js). curl works. Sitemap: /sitemap.xml (408 URLs, mostly blog).
- Hair-loss collection: https://www.struthealth.com/hair-loss (13 product cards).
- Raw HTML saved in `raw/`, plain text of each page in `text/` (made with `python3 -I scripts/h2t.py raw/<file>.html --links`).
- Two kinds of "Get started" link:
  1. New intake forms: `https://start.struthealth.com/f/<formId>`
     - 6adb53275c3d5e719ab02595 = oral finasteride (from /hair-loss/finasteride and /finasteride/oral)
     - 6adb546a5d885b6c0877d8e4 = topical finasteride (Hairfect Rx topical) (from /hair-loss/finasteride/topical)
     - 6ad9e1d39fba7abfd231a5b3 = dutasteride oral and topical (from /hair-loss/dutasteride, /oral, /topical)
     - 6aa3d578f415d1603a6e0c85 = oral minoxidil (from /hair-loss/oral-minoxidil)
  2. Old checkout flows: `https://checkout.struthealth.com/<slug>?priceId=<n>`
     - hair-compound-oral?priceId=2060 (HairfectRx capsules with finasteride), ?priceId=2140 (with dutasteride)
     - womens-hair-growth-rx-formula?priceId=226 (Strut Hair Formula, women)
     - latanoprost-hair-booster-formula?priceId=676 (Hair Booster)
     - ketoconazole_shampoo_men?priceId=799
     - hairfect-combo?priceId=243, hairfect-gel-combo?priceId=313, dutasteride-hair-combo?priceId=485
- Sign-in: https://my.struthealth.com/sign-in (not used).

## BIG FIND: the whole quiz definition is in the page HTML (new intake forms)
- `https://start.struthealth.com/f/<formId>` redirects to `/flow/<formId>`. The page is a Next.js app from a form builder
  called **PathwAI** (assets.pathwai.care). The 17 MB HTML carries the full flow as a React Server Components payload:
  every node (screen), every option, every branch condition, the edges, and the source code of every custom card
  (product pickers with price IDs and prices, account card, ID check, photo card, cart, payment).
- How it was extracted (no browser needed, one plain page load per form):
  1. `curl -L https://start.struthealth.com/f/<id> -o raw/start_<name>.html`
  2. `python3 -I scripts/rsc_extract.py raw/start_<name>.html raw/start_<name>.rsc.txt` (joins the `self.__next_f.push` strings)
  3. `python3 -I scripts/rsc_rows.py raw/start_<name>.rsc.txt raw/start_<name>_rows` (splits rows; text rows are length-prefixed)
  4. `python3 -I scripts/flow_dump.py raw/start_<name>_rows <name> .` writes
     `quiz-definition-<name>.json` (flow nodes, edges, paths, scripts; component list without code),
     `quiz-outline-<name>.txt` (long outline) and `components/` (source of each custom card).
  5. `python3 -I scripts/flow_compact.py quiz-definition-<name>.json > quiz-compact-<name>.txt` (short readable outline: START HERE).
- Names: `fin_oral` (form 6adb5327…, title "Finasteride Tablet Prod 2310"), `fin_topical` (6adb546a…, "Finasteride Prod 2310"),
  `dut` (6ad9e1d3…, "Dutasteride Prod 2310"), `oral_min` (6aa3d578…, "Minoxidil Prod").
- Each page load creates an empty anonymous "submission" record on their side (status in-progress, no answers). Keep loads few.
- The component list is shared by the whole organisation (221 cards: weight loss, BHRT, ED and so on). Hair ones:
  `finasteride tablet`, `finasteride men : Dose selection`, `finasteride women : Dose selection`, `Dutasteride topical : Dose selection`,
  `Dutasteride Oral : Dose selection`, `Dutasteride : Dose selection` (older, 3 options), `Minoxidil : Dose selection`,
  `Hairloss photo input`, `ProfileCard` / `Strut Auth` (account), `Strut ID Verification` (Persona), `Shopping Cart`, `Strut Finalize`.
- The served component records also carried the builder's internal chat history (`chatMessages`, `checkpoints`). Not kept: it is
  not about the consultation. `flow_dump.py` drops those fields.

## Account wall (observed live, 23 Nov 2026)
- Oral finasteride, topical finasteride and dutasteride forms: **the very first screen is the account card** ("See your treatment
  options. Join for a tailored experience crafted by experts." e-mail + phone + consent tick box, or Google). Nothing can be
  walked anonymously. Runs: `runs/baseline-men-finasteride-oral`, `runs/baseline-men-finasteride-topical`, `runs/baseline-men-dutasteride`.
  All later screens for these three flows are known only from the served definition (evidence label `code`).
- Oral minoxidil form: welcome screen, age, dose picker ("Add to cart"), then 14 medical screens, then the account card
  ("Create account": first name, last name, date of birth, phone, e-mail, password) at 75% progress.
  Full baseline walk: `baseline-men-oral-minoxidil.json` -> `runs/baseline-men-oral-minoxidil` (25 steps, exit 0).
  Single-choice answers move on by themselves; multi-select screens need "Continue".
- Old checkout app (`checkout.struthealth.com/<slug>?priceId=N`, Angular): redirects straight to `/auth/sign-up`
  (e-mail + phone). Run: `runs/old-womens-00`. Its questions come from `checkout-api.struthealth.com/api/Checkout/GetMedicationQuestions`
  which needs a signed-in visit and order id: NOT reachable, not tried. `main.*.js` holds no question text (checked).
  So the women's Strut Hair Formula, Hair Booster, ketoconazole shampoo, HairfectRx capsules and the three combos have
  **no publicly visible questionnaire**.

## Product catalogue (15 items, all in company.json)
- Source pages: `text/hair-loss*.txt` (plain text of each product page) and `product-data/*.json` (the structured
  ingredients / Safety Info / disclaimer object each product page carries; `product-data/_summary.txt` is a digest).
  Rebuild one with `python3 -I scripts/product_data.py raw/<page>.html`.
- Prices in the new forms come from the product cards' own code (`components/*Dose_selection*.tsx`, `finasteride_tablet__*.tsx`):
  oral finasteride 1 mg $25/30 days or $49/90 days; topical finasteride $59 (30 ml once daily) or $79 (60 ml twice daily), same
  for the women's card; topical dutasteride $69 / $99; oral dutasteride 0.1 mg $39; oral minoxidil 2.5 mg $65/90 days or 1.25 mg $55/90 days.
- Strengths: finasteride 0.25%, dutasteride 0.1%, minoxidil 7.5%, tretinoin 0.0125%, fluocinolone 0.01% come from the formula
  preference questions in the forms; the women's formula page gives spironolactone 1%, finasteride 0.25%, minoxidil 0 to 7.5%,
  tretinoin 0 to 0.025%, fluocinolone 0.01%.
- Inconsistencies seen (kept as found, not resolved): tretinoin 0.0125% (form) against 0.025% (price label in card code);
  oral minoxidil page headline "$55 ... 2.5mg" against the form ($55 = 1.25 mg, $65 = 2.5 mg); oral dutasteride "0.1 mg to 0.6 mg"
  (collection page) against "0.1 mg compounded or 0.5 mg retail" (product page) against one 0.1 mg option in the form;
  the oral minoxidil card says "compounded by a US licensed pharmacy" while the page calls the tablets "Retail".
- No product page was found for the women's topical finasteride product (slug `womens-finasteride-hair-loss-formula`,
  price IDs 612 and 598); it only exists as the "Female" branch of the topical finasteride form.

## How the engine works (from the definitions)
- No recommendation step anywhere. Patient picks a product page -> that product's form.
- Branches found in all four definitions, and nothing else:
  under 18 -> stop; self-harm "Yes" -> Safety Alert stop; surgeries / medicines / "anything else" "Yes" -> one free-text screen each;
  oral finasteride: "Female" -> "Available for Male Patients Only" stop; topical finasteride: "Female" -> women's product card;
  dutasteride: topical or oral card (topical adds solution/gel + formula preference); Persona failure -> photo ID + selfie; card declined -> back to payment.
- No medical condition, allergy, scalp symptom or mood answer changes the route, the cart or shows a warning. Review happens after checkout.
- Topical finasteride and dutasteride forms need two hairline photos (button disabled until both are added).
- Women in the topical finasteride form get the same questions as men: no pregnancy / breastfeeding / contraception question.
- company.json is generated: edit `scripts/build_company.py` (products, annotations, rules) and run
  `python3 -I scripts/build_company.py`, then `node ../../tools/validate.js strut --stage map`. Question text and options are read
  from the quiz-definition files, never typed by hand.

## Replays used in stage 1 (8 of about 25)
1. `runs/old-womens-00` old checkout, women's formula: sign-up wall at once.
2. `runs/baseline-men-finasteride-oral` first screen = account card.
3-5. three short oral minoxidil walks (first screen, 3 steps, 10 steps) while building the answer file (overwritten by the final run).
6. `runs/baseline-men-oral-minoxidil` full baseline to the account card (exit 0).
7-8. `runs/baseline-men-finasteride-topical`, `runs/baseline-men-dutasteride` first screen = account card.
Replay: `node ../../tools/walk.js baseline-men-oral-minoxidil.json runs/<new-id> --last` (about 90 seconds).

## Dead ends
- Help centre `support.struthealth.com/hc/en-us`: HTTP 403 "Just a moment..." checkpoint for curl and for the fetch tool. Not read.
- Old checkout questionnaires (women's formula, Hair Booster, ketoconazole, HairfectRx capsules, combos): API needs a signed-in visit. Not reachable.
- Baseline woman: no anonymous women's route exists. `baseline-women-strut-hair-formula.json` only records the sign-up wall.
- The big raw downloads (17 MB HTML per form) were deleted to keep the folder small; re-fetch with the curl line above if needed.
- "promo" versions of the product cards exist in the component list (for example `finasteride tablet promo`), which suggests other
  form IDs for promotions. None is linked from the public pages checked; not guessed.

## What stage 2 should test first (only the oral minoxidil form can be replayed anonymously)
Change one answer in `baseline-men-oral-minoxidil.json` each time and compare the screens up to "Create account":
1. Age "Under 18" -> expect the "Age Verification" stop screen (code R1). Also "61+" -> expect no change.
2. Self-harm "Yes" -> expect "Safety Alert" (code R5).
3. Medical conditions one at a time, starting with "Heart failure or heart disease", "Low blood pressure", "Pheochromocytoma",
   "Heart attack or coronary artery disease", "Kidney disease": code says no stop and no warning (R7). Confirm, and check the
   cart strip at the bottom still shows the same item.
4. Allergy "Minoxidil" -> code says no stop.
5. Dose "1.25 mg" on the picker -> cart shows $55; questions unchanged.
6. Scalp symptoms "Sudden hair loss", hair-loss symptom "Patchy bald spots", sexual dysfunction "Yes", mood "Yes": expect no change.
7. Surgeries "Yes", medicines "Yes", anything else "Yes" -> one extra free-text screen each (type a harmless fictional medical note, no contact details).
8. "Other" on treatments / allergies / conditions -> free-text box appears.
For the three forms behind the first-screen wall and for the old checkout, nothing can be replayed: work from the definitions,
re-fetch them to check the version IDs have not changed, and look for public sources on what providers decline.

---

# Stage 2 (EXPERIMENT), 23 Nov 2026

## How the experiments are run
- Only the oral minoxidil form can be replayed without an account, so every live experiment is on that form.
- `scripts/make_exp.py` holds the baseline as named blocks and one entry per experiment (the ONE changed answer). Run
  `python3 -I scripts/make_exp.py` to write `experiments/<exp-id>.json`.
- `scripts/walk_fast.js` is a copy of `tools/walk.js` with one change: the per-step "network idle" wait is 2 s, not 6 s
  (this form never goes idle, so walk.js took 2 min 48 s a replay; the copy takes about 1 min 35 s). Same output format.
- `bash scripts/run_exp.sh <exp-id> ...` runs them one after another, saves `runs/<exp-id>/` (with `actions.json`) and prints
  `scripts/compare_runs.py runs/<exp-id> runs/baseline-us`: screens added / missing, cart line, reworded screens, end screen.
- Baseline for stage 2: `runs/baseline-us` (same answers as stage 1 but locale en-US, time zone America/Chicago; run with
  tools/walk.js). It is identical to the stage 1 run: 18 distinct screens, cart "90 Day Supply - 2.5 mg | $65.00", ends at
  "Create account" (75%).

## Results so far (all `observed`)
- exp-01 age Under 18 -> "Age Verification" stop screen (go back or end). R1 confirmed.
- exp-04 dose 1.25 mg -> cart line "90 Day Supply - 2.5 mg (1.25mg)", $55.00; questions identical.
- exp-05 self-harm Yes -> "Safety Alert" screen (988 / 911); "Go back and update my answer" returns to the question. R5 confirmed.
- exp-06 surgeries Yes, exp-07 medicines Yes, exp-08 anything else Yes -> one extra free-text screen each; cart and all other
  screens unchanged; ends at "Create account". R6 confirmed.

## Stage 2, second session (23 Nov 2026)
- Ran the eight prepared but unrun experiments, one at a time with `scripts/run_exp.sh`: exp-15 sexual dysfunction Yes,
  exp-17 lost interest Yes, exp-18 noticed 1 month or less, exp-19 tried oral minoxidil, exp-20 heart attack, exp-21 kidney
  disease, exp-22 scalp itching/pain/lesions, exp-23 diffuse thinning only. All eight: no change (18 screens, same wording,
  cart 2.5 mg $65, ends at "Create account"). New rule R24 (observed); R14 now covers only the options still not replayed.
- Re-loaded the four walled baselines (runs/recheck-finasteride-oral, -topical, -dutasteride, -women): walls unchanged.
- exp-25 ("End questionnaire" broken redirect) is a real finding, not a failed run.
- One web search: Trustpilot/Reviews.io reviews and affiliate guides only; nothing on hidden questionnaires or declines.
- Totals: 27 oral minoxidil replays (1 baseline, 25 one-change, 1 combined), 24 rules, 31 experiment entries.
  Backup of the build script before this session: scripts/build_company.stage2a.bak.py. Validator (--stage rules) passes.
- Not done: the remaining single options listed in limitations (code shows no branch on them).

---

# Stage 3 (VERIFY), 23 Nov 2026 (independent reviewer)

- company.json is still generated by `scripts/build_company.py`; stage 3 changes are applied on top by
  `python3 -I scripts/apply_verification.py` (idempotent). Re-run both in that order if you rebuild.
- `scripts/run_verify.sh <exp-id> ...` replays an `experiments/<exp-id>.json` file into `runs/verify-<exp-id>` and compares it
  with the fresh stage 3 baseline `runs/verify-baseline-min`. New experiment files: `experiments/v-*.json`.
- 19 replays, one at a time: fresh baseline (standard tools/walk.js, identical to runs/baseline-us); four wall page loads
  (runs/verify-wall-*, all walls unchanged); re-tests of R1, R3, R4, R5, R8, R9, R13 (all confirmed); "Continue" on the Safety
  Alert without a choice -> "An answer is required" (cannot be passed); gap tests age 46-60, liver, stroke alone, breast/prostate
  cancer, bleeding alone (no effect, rule R25); baseline woman on the oral minoxidil form (identical to the man, no sex or
  pregnancy question, rule R26).
- Re-fetched the four live form pages with curl: same version IDs as the saved quiz-definition files, so R15-R21 still apply.
  The 17 MB downloads were deleted afterwards.
- Re-read 15 live product pages (curl, plain text in the scratchpad only): every price and strength in company.json matched.
  New small facts: the oral minoxidil page shows $55 next to the 2.5 mg tablets too (form: $65); the FAQ's $40 provider fee
  applies only when a prescription is transferred to a non-preferred pharmacy.
- Validator: `node ../../tools/validate.js strut --stage final` passes.
