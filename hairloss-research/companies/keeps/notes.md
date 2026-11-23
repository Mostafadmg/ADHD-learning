# Keeps (US) — working notes

Stage 1 (MAP) finished 2026-11-23. Everything here comes from public pages and code served to an anonymous browser.
No account, no contact details, no photos, no payment. Nine walker replays were used (budget was 25).

## 1. The short version

- Keeps (keeps.com, owned by Thirty Madison) treats **men only**. Women are sent to Nurx (`/not-eligible-user/sex`).
- The site is a Next.js app. Build id on the day: `P4aieEbp7XXsoIDdfc_hQ`. No bot protection was met. `curl` and the walker both work.
- There are **three quizzes**, and all three have their full definition in public JavaScript:
  1. **Main "Keeps 2.0" quiz** `/hair-assessment-quiz` → plan page `/hair-treatment-plan` → wall at `/express/checkout`.
  2. **Gel quiz** `/hair-assessment-quiz-gel` → `/hair-treatment-plan-gel` → same wall.
  3. **Legacy mini quiz** `/quiz` (same page at `/find-my-plan`) → wall at `/quiz/lead`.
- In the main quiz **only two answers change the product**: "How would you like to treat your hair loss?" (chew or drop) and
  "What's your top priority?" (affordable or not). Everything else is stored in the browser and played back.
- The plan page says **"Good news - you're approved"** before any medical question. The medical intake is after payment.

## 2. Files in this folder

| file | what it is |
|---|---|
| `company.json` | the map (20 products, 5 flows, 63 questions, 12 rules). Built by `build-company.py`: edit that script and re-run it rather than editing JSON by hand. |
| `quiz-definition.js` | exact copy of the served chunk `/_next/static/chunks/4186-023f24e4c45a5ed8.js`: main + gel quiz questions, `hideIf` rules and the recommendation function. |
| `quiz-definition.legacy-mini-quiz.js` | exact excerpts for the legacy quiz: questions (`_app` chunk, module 7679) and rules (chunk 5819, module 5737). |
| `quiz-definition.json` | my structured read of all three: every question, option, stored value, skip rule and the rules as pseudo-code. Start here. |
| `baseline-men.json` | replayable baseline, main quiz → plan page → checkout form (nothing typed there). Run folder `runs/baseline-men/`. |
| `baseline-men-gel.json` | baseline, gel quiz → gel plan page. `runs/baseline-men-gel/`. |
| `baseline-men-legacy-quiz.json` | baseline, legacy quiz → `/quiz/lead`. `runs/baseline-men-legacy-quiz/`. |
| `runs/catalogue/` | browse of `/our-products` and each product page; `net/` holds the price data. |
| `runs/entry-points/` | anonymous visits to landers, `/plan-selection`, `/request/lead`, `/consultation/intake`, `/register`, not-eligible pages. |
| `raw/` | saved evidence: `buildManifest.js` + `routes.json` (118 routes), `chunks/` (156 served JS files), `pages/` (product pages), `faq/` + `faq-extract.json`, `hair-treatment-plan.pageprops.json`, `hair-treatment-plan-gel.pageprops.json`, `catalogue-hair-lineitems.json` (every hair product id with list and first-order price), `product-pages.pageprops.json` (product copy and FAQs), `states.json`. |
| `shots/` | 8 key screenshots (first question, picture question, state gate, plan page, checkout wall, gel plan, legacy wall). |
| `tools-strip.py` | helper: `python3 -I tools-strip.py raw/chunks/<file> "<phrase>" [before] [after]` prints served JS around a phrase with image blobs removed. |

## 3. How to replay

```
cd /home/user/ADHD-learning/hairloss-research/companies/keeps
node ../../tools/walk.js baseline-men.json runs/<new-run> --last          # about 90 seconds
```

- Use `"locale": "en-US", "timezone": "America/Chicago"` (already in the baseline files).
- Answer buttons are matched by text. Options with a subtitle need `"exact": false` (for example "Receding hairline or crown thinning").
- The two loader screens advance on their own after about 5 seconds: keep the `wait` steps (6500 and 7000 ms).
- The state box is a react-select: `fill` the selector `input[id^=react-select]` with the state name, then `press Enter`.
- The tick box is clicked by its text "I confirm I am 18+ and assigned male at birth".
- On the plan page there are two "Continue to checkout" buttons; only the selected card's button is enabled
  (for the baseline that is the second one, `"nth": 1`).
- Legacy quiz: start at `/quiz?step=1` to skip the intro. Multi-select screens need a click on `CONTINUE`.
- **Fast check without a browser**: the main quiz keeps answers in `sessionStorage` (see `runs/baseline-men/storage.json`) and
  the result is just the `productId` in the plan page address: 19277 Chew+, 18640 Chew, 18636 Drop+, 18635 Drop, 19267 Gel+.
  In the legacy quiz the result is the `products=` list in the `/quiz/lead` address (211 finasteride, 239 minoxidil foam,
  11840 spray, 240 ketoconazole, 499/500 shampoo/conditioner, 682 pomade, 989 oral minoxidil, 2874 supplement).

## 4. Where the account walls are

| flow | wall | what is shown just before it |
|---|---|---|
| main / gel | `/express/checkout?products=<id>`: name, address, phone, date of birth, email and card on one page, button "Complete Purchase" | the plan page: "Good news - you're approved", the recommended product, both plan lengths and prices |
| legacy quiz | `/quiz/lead?products=…`: first name, last name, email, phone ("Create your account to unlock your personalized plan") | a one-line loader "You're just one step away from better hair"; the plan is NOT shown, but the product ids are in the address |
| request flow | `/request/lead`: first name, last name, email, on the very first screen | nothing |
| medical intake | `/consultation/intake` redirects to `/auth/sign-in` | — |

Order of steps after the wall in the main funnel (seen on `/register`): **Checkout → Account → Medical Intake**.
Checkout small print: "Your order will be reviewed by a licensed healthcare provider, who may require additional personal or
medical information, and is not prescribed until approved. Your fees are refundable if your prescription is not approved."

## 5. What is known about the hidden medical intake (code only)

- The consultation pages load a quiz schema by name from a back-end bucket. The names are listed in the public feature flag
  `quiz-configs` (`runs/probe-haq/net/02-*.json`): `keeps/intake-consultation`, `keeps/dermatology`,
  `keeps/titration-consultation`, `keeps/blood-pressure-pulse`, `keeps/phq9-consultation`, `keeps/arc` (annual check-in),
  `keeps/update-treatment-miniquiz` and others.
- **I did not fetch those schemas.** The anonymous browser never requests them (the pages redirect to sign-in first), and the
  protocol forbids calling URLs the anonymous page did not call. The only bucket file the anonymous page loads is `outages.json`.
- Hard-coded screens in `raw/chunks/8921-08fc9b2c1414f459.js` show what the intake can do: ask for a blood pressure and pulse
  reading ("We won't be able to prescribe until we confirm your blood pressure"), a "Seek Medical Attention" stop for
  "Irregular heartbeat, chest pain, shortness of breath, and swelling", a self-harm safety screen with 988 crisis numbers, a
  mood check for people on oral finasteride, three hair photos and a photo of government ID.
- A titration route exists (`/consultation/titration/[productDrugType]`), and the price data holds a lower-dose Chew+
  (dutasteride 0.2 mg, ids 18637/18638) beside the "Higher Dose" 0.5 mg one that the quiz sells. Likely a dose-step path; not confirmed.

## 6. Odd things worth knowing

- "Chew" has two meanings in the data. The card and product page say finasteride 1 mg + minoxidil 2.5 mg + vitamin D3 (ids 18639/18640).
  Ids 18156/18157 are also called "Chew" but contain dutasteride 0.5 mg + minoxidil 1.25 mg + vitamin D3; they are in the plan
  page's price data and not shown on screen.
- The "analysis" screen's lines ("You're a strong candidate", "86% of similar profiles see results") are fixed text.
- The loaders ("Confirming clinical eligibility", "Selecting prescription compounds") are 5-second timers. No request is sent.
- A product page FAQ says "You won't be charged until your prescription is approved"; the checkout says you are charged now
  ($100.00 for Chew+) and refunded if not approved, then $204.99 every 3 months.
- The new quiz does not stop "Patchy Loss" or "Less than 6 months"; the old quiz sends "Patchy" to a clinician request.
- The legacy quiz's "Vitamins and supplements" tick also swaps minoxidil foam for the compounded Minoxidil+ Spray (same code path as "tretinoin").
- Feature flags seen (PostHog): `enable-quiz-phone-collection = control` (phone screen off), `hl_funnel_gender_checkbox_default = unchecked`,
  `keeps-offer-experiment-flag = control` (a `free_gift` variant exists in code), `keeps-gel-funnel = true`. Another visitor may get other variants.
- Current offer id 1040: "Exclusive Offer: Up to 50% Off First Order" / Black Friday banner. Legacy products show a flat 30% off the first order.

## 7. Dead ends

- `/robots.txt` and `/sitemap.xml` return 404. `/server-sitemap.xml` works (FAQ and blog URLs only).
- `/recommendation-quiz-1` is the erectile-dysfunction quiz, not hair.
- `/quiz/results?products=…` redirects to `/quiz` without an account. `/get-started/your-info` does the same.
- `/request/consultation` shows "Something went wrong" without an account.
- Product pages' server data has empty price maps; prices load in the browser (use `runs/catalogue/net/` or `raw/catalogue-hair-lineitems.json`).
- `/our-products/oral-minoxidil` is a 404; oral minoxidil is sold from `https://buy.keeps.com/low-dose-oral-minoxidil` (a separate landing-page platform, not read in detail).
- `/product-info/<product>` (medication overviews with contraindications) and `/drug-facts/<slug>` were found but not read in full.

## 8. What stage 2 should test first (one change each, against `baseline-men.json`)

1. **Form = "Topical Drop (Rx Serum)"** → expect `productId=18636` (Drop+). Proves rule R1.
2. **Priority = "Keeping treatment simple & affordable"** → expect 18640 (Chew). With topical → 18635 (Drop). Proves R2.
3. **Priority = "Seeing results as soon as possible"** and **priority skipped** → expect no change (19277).
4. **Picture: "Not seeing a match?" → "Mostly Scalp"** → expect the stop screen. Then **"Patchy Loss"** → expect no stop.
5. **State = Kansas (or DC, Idaho, New Mexico…)** → expect "We currently don't serve in your state." Try one accepted state other than Texas.
6. **Leave the 18+ / male box unticked** → button stays disabled (already seen once).
7. **Treated before = Yes → "Had side effects"** → expect no change. This is the most telling "safety answer ignored" test.
8. **Duration "Less than 6 months", stage "Advanced", goal "Preserve"** → expect no change (R6). One replay each, or trust the code and spot-check two.
9. Plan page: click **"Want to switch to topical solutions?"** and record the Drop / Drop+ cards and prices on screen.
10. Legacy quiz (`baseline-men-legacy-quiz.json`), reading the `products=` list each time:
    Hairline + no preference (expect 211 + 989 oral minoxidil) · Hairline + topicals (expect 211 only) · Crown + pills (expect 211 + 989) ·
    "Nowhere yet" (expect 239 + 499 + 500, no 211) · Patchy (expect a jump to `/request/lead`) · dandruff Yes (adds 240) ·
    tretinoin (239 → 11840) · saw palmetto (adds 2874) · hair care (adds 499, 500) · pomade (adds 682) · vitamins (adds 2874 and swaps to 11840).
11. Gel quiz: change any one answer and confirm it still ends on 19267.

Not possible without breaking the rules: anything in the medical intake, the provider's decisions, and whether the provider
ever changes the quiz's product.

## 9. Stage 2 (EXPERIMENT) — progress log, 2026-11-23

Answer files for every experiment are written by `experiments/gen.js` (one file per experiment, plus `experiments/index.json`).
Run them one at a time with `bash experiments/run.sh exp-01 exp-02 …` (it retries once after 30 s). Compare plan pages with
`python3 -I experiments/compare.py baseline-men-r2 exp-01 …`. Each run is in `runs/<exp-id>/` (walker log in `walk.log`).

Main quiz results so far (baseline replay `runs/baseline-men-r2` = Chew+ 19277, checkout $100.00 then $204.99 per 3 months):

| run | one change | result |
|---|---|---|
| exp-01 | form → Topical Drop | Drop+ 18636; checkout $149.93 first 3 months, then $214.99 |
| exp-02 | priority → simple & affordable | Chew 18640; checkout $94.96, then $159.99 |
| exp-03 | exp-01 + priority → affordable | Drop 18635; checkout $140.02, then $194.99 |
| exp-04 | form → Daily Chew | no change (19277) |
| exp-05 | priority → results ASAP | no change |
| exp-06 | priority → skip link | no change |
| exp-07 | picture → more options → Mostly Scalp | STOP screen at ?step=4 |
| exp-08 | picture → more options → Patchy Loss | no stop; 19277; only the 'Today' label changes |
| exp-09 | state → Idaho | 'We currently don't serve in your state. Please check back soon.' after clicking Show my plan |
| exp-09a | typed 'Kansas' → box picked Arkansas | Arkansas accepted at the gate (not carried on) |
| exp-10 | state → California | no change |
| exp-11 | treated before → Yes → 'Had side effects' | extra question shown; no warning; 19277; plan text identical |
| exp-12..16 | duration <6 months, stage Advanced, goal Preserve, picture Advanced, comments Yes | no change to product, price or wording except the echoed label |
| exp-17 | plan page: 'Want to switch to topical solutions?' | Drop and Drop+ cards shown, Drop (cheaper) pre-selected; banner still says 'Recommended for you: Chew+' |
| exp-18 | treated before → Yes → 'Didn't see results' | extra question shown; no change (19277) |
| exp-19 | picture → more options → Diffuse Thinning | no stop; 19277; only the echoed label changes |
| exp-g1..g3 | gel: priority affordable / switch-to-oral link / Mostly Scalp | Gel+ unchanged / Chew+Chew cards / same stop screen |

Legacy quiz (`/quiz/lead?products=` list; baseline r2 = 211,239): L01 Hairline → 211,989 · L02 Crown → 211,239 · L03 Patchy →
`/request/lead` · L04 Nowhere yet → 239,499,500 (family question replaces expectations + pill preference) · L05 Pills → 211,989 ·
L06 Topicals → 211,239 · L07 Hairline+Topicals → 211 · L08/L09 finasteride/minoxidil tick → no change · L10 tretinoin → 211,11840 ·
L11 saw palmetto → +2874 · L12 ketoconazole → +240 · L13 vitamins → 211,2874,11840 · L14 hair care → +499,500 · L15 pomade → +682 ·
L16 dandruff Yes → +240 · L17 thicker / L18 prevent → no change · L19 Hairline+Pills → 211,989. Every code-read rule matched.

### Stage 2 finished (2026-11-23)

- All three baselines replayed fine (`runs/baseline-men-r2`, `-gel-r2`, `-legacy-quiz-r2`); 41 one-change experiments in total.
- `company.json` = output of `build-company.py` (stage 1) **then** `python3 -I stage2-patch.py` (stage 2: experiments[],
  observed evidence, rules R1–R24, 18 recommendation profiles, summary fields). The patch is NOT idempotent: to rebuild,
  run build-company.py first, then the patch once. Pre-patch copy was not kept in this folder.
- `node tools/validate.js keeps --stage rules` passes (0 errors, 0 warnings).
- Not tested (see limitations in company.json): remaining no-effect options of the main/gel quiz one by one, most states,
  legacy multi-select combinations, anything after the account wall.

## 10. Stage 3 (VERIFY) — 2026-11-23, independent reviewer

How to replay: `bash verify/run.sh verify/<file>.json <run-id>` (one at a time, retries once after 30 s). Answer files are in `verify/`.
`company.json` was patched by `python3 -I verify/stage3-patch.py` (safe to re-run; pre-patch copy in `verify/company.pre-stage3.json`).

- Baselines replayed fresh: `runs/verify-baseline-men` (Chew+ 19277, $100.00 then $204.99), `-men-gel` (Gel+ 19267), `-men-legacy` (211,239). All match.
- Served chunks 4186-023f24e4c45a5ed8, 6717-3380f3d5983e996c, 7039-8a2b3254b033213a are still the live versions, so the code reads stand.
- Rules re-tested live, all confirmed: R1 (verify-R1-drop), R2 (verify-R2-afford), R3 (verify-R3-scalp), R4 (verify-R4-wv, verify-R4-de: two new refused
  states), R5 (verify-R5-notick), R8, R9, R10, R15 (verify-R8-patchy … verify-R15-tret).
- New gaps: picture 'Just Starting', goal 'Both', stage 'Early signs' → no change; gel 'Had side effects' → no change; legacy pills + tretinoin →
  211,989 (pill preference blocks the spray swap; new rule R25). Gel side-effects = R26.
- Products: `runs/verify-products` (10 product pages; `net/05-*graphql.json` is the full price list). 16 products matched on name, actives, strength and price.
  The finasteride/minoxidil foam (p7) is the 'Foam' choice on the topical finasteride and minoxidil page.
- Correction: the hair quizzes never route women to `/not-eligible-user/sex` (Nurx). That route is only named in the `_app` bundle. Women are stopped by the
  tick box; the FAQ `/faq/can-women-use-keeps` says only people assigned male at birth can use Keeps. R24 rewritten.
- Loader 'Finalizing your approval' is a fixed 5.1 s timer (chunk 6717).
- `node tools/validate.js keeps --stage final` passes.
