# Ro (US) hair loss: working notes

Stage 1 (MAP) finished 2026-11-23. Folder: `hairloss-research/companies/ro/`. Written for the next investigator (stage 2).

## The one thing to know

**The whole consultation engine is in publicly served code.** When the consultation app loads, the page itself
fetches the complete question schema: every question, option, fork rule and variable change, including all the
medical questions that sit behind the account wall. The men's recommendation function is in a public JS chunk.
So the engine can be read and simulated offline; the live site can only be walked for 3 to 4 questions before it
asks for an email.

| What | Where it came from (the page called it, we did not guess it) | Saved copy |
|---|---|---|
| Men's schema (`hl-onb-consult-2rx`, v77, 102 nodes) | `GET https://start.ro.co/svc/online-visit/public/roman/hair-loss/schemas/onboarding` | `quiz-definition.men-onboarding.raw.json` |
| Men's alt entry schema (`hl-onb-se1`, v80; identical content) | same URL with `?code=hl-onb-se1` | `quiz-definition.men-onboarding-se1.raw.json` |
| Women's schema (`derm-whl-onb`, v32) | `GET https://start.ro.co/svc/online-visit/public/derm/womens-hair-loss/schemas/onboarding` | `quiz-definition.women-onboarding.raw.json` |
| Topical minoxidil OTC (`hl-onb-intent`) | same men's URL with `?code=hl-onb-intent` | `quiz-definition.topical-minoxidil-otc.raw.json` |
| Shampoo / conditioner (`restr-sha-onb-intent`, `restr-con-onb-intent`) | `.../public/roman/shampoo/...`, `.../public/roman/conditioner/...` | `quiz-definition.shampoo.raw.json`, `quiz-definition.conditioner.raw.json` |
| All of the above in one file | | `quiz-definition.json` |
| Men's product catalogue with prices | `GET https://start.ro.co/api/public/6/grouped-products?...` | `raw/grouped-products-condition6-men.json` |
| Men's recommendation function | `https://start.ro.co/assets/48419.d54c80ce6a7f9ba5ad88.chunk.js` (lazy chunk named in the main bundle) | `raw/js/48419.chunk.js` |
| Main bundle (variable parsing, fork evaluator, recap loader, BP ranges) | `https://start.ro.co/assets/main.260d4b871de7cb1cb657.js` | `raw/js/main.260d4b871de7cb1cb657.js` |
| A/B experiment config | `https://start.ro.co/svc/ro-experiments/public/roexp.min.js` | `raw/js/roexp.min.js`, `raw/ro-experiments-config.json` |

Readable dumps: `quiz-definition.*.compact.txt` (short), `quiz-definition.men-onboarding.dump.txt` and
`quiz-definition.women-onboarding.dump.txt` (full). Made by `scripts/dump_compact.py` and `scripts/dump_schema.py`.

## How the schema works (so you can read it)

- A flow is a list of nodes with a `qid`. Types: `choice`, `multichoice`, `text`, `control` (special screens) and `fork`.
- Each node and each answer can carry `variable_modifications` like `["noRecOralMin","1"]`. The front end runs
  `parseInt` on the value, so "1" becomes the number 1 (main bundle, search `variableModifications`).
- A `fork` node has `forking_rules`: a list of `[target qid, expression]`; the first true expression wins
  (`1 == 1` is the default). `and` / `or` are plain words.
- Answers have `next_qid`. `exclusive: true` means "untick everything else".
- `meta.highlight` on an answer is `negative`, `caution`, `ack-clinical` or `ack-nonclinical`. No patient-facing use
  found in the code; I read it as a marker for the reviewing clinician (inferred).
- Men's engine: three flags `noRecTopicalCombined`, `noRecOralFin`, `noRecOralMin`. The recommender
  (`raw/js/48419.chunk.js`, function `Ye`) takes the fixed order **spray -> oral finasteride -> oral minoxidil**
  and recommends the first whose flag is not 1 and whose product group is not disabled for the patient's state.
  The other two are still listed under "Other treatment options". All flagged = "no-recommendation".
- Women's engine: two flags `ifNotEligibleForOralMinoxidil`, `ifNotEligibleForTopicalMinoxidil`, plus `userAge`,
  read by fork 4020 (and fork 1159). Several answers route straight to the stop screen 6040.

## Offline simulator (use this for one-change experiments)

`python3 -I scripts/simulate.py men '{"1000":["depression"]}'` -> path length, flags, recommended product.
`python3 -I scripts/simulate.py women '{"1057":["yes"]}' 38 --path` -> every screen and the result.
Answers are `{"<qid>": ["<answer slug>"]}`; anything not given takes the baseline answer. Optional third argument is
age; `mhl=0` shows the older men's path. It never touches the website. Results are evidence type **code**, not observed.
Already checked with it: baseline man -> Ro Mane Spray; depression / anxiety / ED / trying for a baby -> oral minoxidil;
prostate cancer -> oral finasteride; sudden onset -> no recommendation; heart failure -> still the spray;
baseline woman -> choice screen; breastfeeding, high BP or age 66 -> Hair Solution Rx only; age 65 -> still the choice;
pregnant or not sure, traction alopecia, voice deepening, lupus, oral minoxidil allergy -> stop.

## Live walks (12 replays used of about 25)

| Run | What | Result |
|---|---|---|
| `runs/probe-fxdxbh` | open men's entry | first question; schema fetched |
| `runs/baseline-men` (`baseline-men.json`) | baseline man | goals -> tried (none) -> why not before -> **account wall** (qid 55, email pop-up) |
| `runs/men-wall-dismiss` | click "Dismiss" on the pop-up | pop-up stays; no way past it |
| `runs/probe-women-tefcyb`, `runs/baseline-women` (`baseline-women.json`) | baseline woman | how long -> how started -> where (top of head) -> part-line picture -> **account wall** (qid 16) |
| `runs/probe-vwayzg` | topical minoxidil "Buy now" | sign-up is the first screen, with cart: 3-month plan $48 |
| `runs/probe-kwrssq`, `runs/probe-qcalmd` | shampoo, conditioner | plan screen ($24 per 3 months) -> sign-up |
| `runs/probe-afbkau` | alt men's slug from the experiment config | same first question, schema `hl-onb-se1` |
| `runs/probe-escptw` | Google Shopping slug from the experiment config | redirects to `/fxdxbh/online-visit/7`: sign-up FIRST |

Replay: `node tools/walk.js companies/ro/baseline-men.json companies/ro/runs/<new-id> --last`.
Clicks need a settle time (`"settle": 3500`) after "Continue"; the first Continue is slow because the page creates its
draft visit then. Use `"locale": "en-US"` (already in the baseline files). No cookie banner appeared.

## Things to be honest about

- **Draft records.** On the first answer the page itself POSTs `/api/members` and the server creates an anonymous draft
  visitor (role `01_draft`, placeholder e-mail made by the site), then POSTs each answer to
  `.../questionnaire/<uuid>/add-answers`. We typed no contact details and submitted nothing; this is the site's normal
  anonymous flow. But every replay leaves one more draft on their side, so keep live replays few and prefer the simulator.
  The session token in saved `net/*api_members*.json` files was replaced with `[redacted]`.
- **Experiments.** `localStorage.roExp` assigns A/B variants per clean browser. The one that matters,
  `mhlConsultativeOv`, is set to 100% variant "1" for `/fxdxbh`, `/afbkau`, `/escptw` (see `raw/ro-experiments-config.json`),
  so the 3-product recommender (qid 3178) and the "trying to get pregnant" question (qid 2350) are live for everyone.
  The older 2-product screen (qid 3200) is still in the schema but not shown. The site also reads `?roexps=name.variant`
  to force a variant (its own QA switch); I did not use it.
- **Nothing after the wall was seen live.** Every post-wall question, rule and recommendation in `company.json` has
  evidence `code`.

## Entry points (all in `company.json` -> `entryPoints`)

Men: `start.ro.co/fxdxbh` (all product pages), `fxdxbh/?c=<coupon>` (paid-search quiz pages `ro.co/lp/medications/hair-loss/quiz/`
and `ro.co/lp/medications/mhl/om/quiz/`: three marketing questions that all lead to the same link, with 35% or 50% off the
first order), `afbkau`, `escptw`. Women: `start.ro.co/tefcyb`. Direct purchase: `vwayzg`, `kwrssq`, `qcalmd`.
Not hair: `dzwvmd` (Latisse lashes), `qyftkx` (skincare), `fdalgd` (weight loss), `tfevxu` (PE), `pyiozp` (ED).

## Products and prices

`company.json` -> `products` (11). Sources: catalogue JSON, `https://ro.co/pricing/` (`raw/pricing.txt`), product pages in `raw/`.
Odd points: the hair-loss FAQ is out of date (says finasteride is the only prescription option, older per-day prices);
the women's landing page says "billed and shipped every 2 months" but pricing and the schema say quarterly;
"Hair Support Supplement" is in the catalogue as an empty group with no page; the men's spray is still called
"Hair Solution Rx" in places (the same name now used for the women's topical); `/medications/topical-finasteride/`
serves the Ro Mane Spray page.

## Dead ends

- The email pop-up cannot be dismissed, so no post-wall screen can be reached without contact details. Stopped there.
- Women's product catalogue (`/api/public/62/grouped-products`, by analogy) is not called before the wall, so I did not
  call it. Women's strengths come from schema text (Hair Solution Rx: minoxidil 5%, tretinoin 0.025%, melatonin 0.1%);
  the women's oral minoxidil strength is not published (site: 0.25 to 2.5 mg typical range).
- `isEligibleFor6And12MonthShipments` (set when a man has used oral minoxidil or oral finasteride before) is not used in
  the two bundles I downloaded; it probably lives in the checkout chunk or the server.
- Source maps (`*.chunk.js.map`) are referenced but I did not fetch them; the minified code was enough.
- Web search was not needed and not used in this stage.

## What stage 2 should do first

1. **Run the simulator across every option, one change at a time**, for both flows, and turn the output into the
   `experiments` and `rules` tables (evidence `code`). Rules R1 to R21 in `company.json` are my reading; check each.
   Priority: men's qid 1000, 1300, 1420, 370/381/391, 240/265/285/315/335, 2350, 132, 150, 170; women's 1055, 1057, 1086,
   1090, 1096, 1250/1254/1256/1258 and age 64/65/66.
2. **Live, pre-wall only** (few replays): (a) men's qid 22 "Prescription medications" -> expect qid 28 instead of 26;
   (b) women's qid 8 "Temples" only -> expect no part-line question; "All over" -> expect it;
   (c) does the email pop-up title change with the goal chosen at qid 20 (try "Proactively prevent hair loss")?
   (d) does a coupon link (`fxdxbh/?c=...`) change anything before the wall?
3. **Open question:** men's qid 132 is a multi-select whose options point to different next questions
   (hairline/crown/overall -> 150; patches / "nowhere yet" -> 229). How a mixed pick (hairline + patches) routes is not
   visible in the schema; look in the main bundle for the multi-select `nextQid` choice.
4. Find `isEligibleFor6And12MonthShipments` and the state list for compounded products in other public chunks
   (chunk names are in `raw/js/runtime~main.*.js`; only fetch chunks the bundle itself names).
5. Confirm the meaning of `highlight` if any public chunk or doc shows it.
6. Public documents for clinician-review claims and subscription terms are listed in `company.json` -> `sources`
   (`raw/faq_*.txt`, `raw/safety-info_*.txt`, `raw/treatment-plans_hair-loss.txt`, `raw/returns-and-refunds.txt`).

## Rebuild

`python3 -I scripts/build_company.py` rewrites `company.json` from the schema files plus the annotations in that script
(question and option wording is copied from the schema, never retyped). Then
`node ../../tools/validate.js ro --stage map` (passes: 0 errors, 1 warning for the supplement with no URL).

## Stage 2 (EXPERIMENT) finished 2026-11-23

**Result in one line:** the live walk confirms the pre-wall branches exactly as the served schema says, and an offline
one-change sweep of the schema (291 simulated runs) confirms every stage 1 rule; nothing is offered or priced before the wall.

### What was run

| What | How | Where |
|---|---|---|
| 21 live replays, one browser at a time | `scripts/run_exp.sh <id> ...` (walk.js, then token redaction) | action files `experiments/*.json`, results `runs/s2-baseline-*`, `runs/exp-m01..m10`, `runs/exp-w01..w09` |
| Offline sweep of both schemas | `python3 -I scripts/sweep.py` (uses `scripts/simulate.py`; never touches the site) | `runs/sim/men.json`, `runs/sim/women.json`, readable `runs/sim/summary.txt` |
| company.json overlay | `python3 -I scripts/stage2.py` | rewrites experiments, rules, recommendations, recommendedWhen, summary lists |

Rebuild order: `build_company.py` (stage 1) -> `sweep.py` -> `stage2.py` -> `node ../../tools/validate.js ro --stage rules`
(passes: 0 errors, 1 warning for the supplement with no URL). `stage2.py` asserts that each live run's screen order and
final wall text are what the experiment row claims, so it fails loudly if a run folder is replaced by a different result.
`scripts/trace.py runs/<id>` prints the screen order of any run.

### Live findings (evidence: observed)

- Men, baseline: q20 -> q22 -> q26 -> wall (q55). Women, baseline: q4 -> q6 -> q8 -> q10 -> wall (q16). Both still work.
- Men q22 'Non-prescription' or 'Prescription' -> q28 replaces q26 (exp-m03, exp-m04). Fork 25 confirmed.
- Men q20 (goals), q26, q28: no change at all; the final wall text is byte-for-byte the baseline's (exp-m01, m02, m05 to m09).
  The pop-up headline does NOT follow the goal.
- Coupon link `fxdxbh/?c=dhg3wrpe3qn32yash32ng` (from the paid-search quiz page): same screens; the page posts to
  `/api/coupons/match-trigger` and gets coupon 253 "You've got 35% off first order plus free shipping", valid for schema
  codes hl-onb-consult-2rx, hl-onb-consult-gs, hl-onb-intent, hl-onb-kit, hl-onb-overhaul, hl-onb-se1, hl-ren-consult-2rx
  (so other men's schemas exist: kit, overhaul, renewal). Nothing is shown on screen before the wall (exp-m10).
- Women q8 'Temples' or 'Frontal scalp' alone -> q10 skipped (exp-w05, exp-w06); 'All over' -> q10 asked (exp-w07). Fork 9 confirmed.
- Women q4, q6 ('Suddenly' included), q10 pictures 1 and 5: no change (exp-w01 to w04, w08, w09).
- The add-answers responses echo each answer with its `highlight` mark (see `runs/exp-w07/net/`), so the marks are stored
  server-side with the answers. Who sees them is still inferred (clinician).

Seven code-read rules confirmed live: fork 25 (men), no branch on q20 / q26 / q28 (men), fork 9 both ways (women),
no branch on q4 / q6 / q10 (women).

### Code findings added in stage 2

- **Multi-select routing (stage 1 open question 3): solved.** Main bundle, next-question selector (search
  `getIn(["meta","type"])==="MasterQuestion"`): if the question has no `nextQid` of its own, the app takes the `nextQid`
  of the FIRST selected answer in display order. So men's q132 'Hairline' + 'patches' goes to q150 (onset etc. still
  asked) and the patch flags still apply; 'patches' alone skips to fork 229. The simulator already behaves this way.
- Blood-pressure picture ranges (main bundle, array near `highlightedRangeKey`): Low <95/<55, Normal 95-130/55-80,
  High 131-160/81-100, Very High 161+/101+.
- Recommender chunk re-read: the saved answer text on the recommendation screen is the name of the RECOMMENDED group
  (or 'No Recommendation'), and an analytics event records recommended vs selected product. With the V2 layout,
  state-ineligible groups are simply left off the screen.
- Sweep highlights: spray recommended for every unflagged man (any goal, severity, 'no hair loss yet', age 70);
  heart and blood-pressure flags only hit the minoxidil tablet (spray stays); flags add up (depression + heart failure
  -> no recommendation); women: only named diagnoses stop, self-reported patches / rash / sudden onset do not;
  age 65 still gets the choice, 66+ gets topical only; women's 'oral minoxidil only' fork branch (4020 -> 4040) cannot
  be reached by any answer, because the only answer that rules out the topical (lupus) also rules out the tablet.
- Stage 1's option-level effects were checked against the sweep: 0 outcome mismatches in 222 options; two fixes
  (women q8 'Temples' and 'Frontal scalp' are now 'skip-questions').

### Not done / still open

- Not replayed live: men q28 'easier or more convenient solution', women q10 pictures 2 and 4, multi-select combinations.
- `isEligibleFor6And12MonthShipments` still not found in the saved bundles (0 hits in all five files in `raw/js/`).
- The state list for the compounded spray, the female-redirect flag and drug-interaction checks are server-side.
- Parent company confirmed in stage 2 from the terms of use (`raw/terms-of-use.html`): 'Roman Health Ventures Inc. and its affiliates including Roman Health Medical LLC, Roman Health Pharmacy LLC, ...'.
- Web search was not used: the served code answered the questions; no public review was needed to describe post-wall steps.
- Each live replay leaves one anonymous draft record on Ro's side (stage 2 added 21). Use the simulator for anything further.

## Stage 3 (VERIFY) finished 2026-11-24

An earlier attempt at this stage (23 Nov, interrupted) left: fresh baselines `runs/verify-baseline-men` and
`runs/verify-baseline-women` (wall screens byte-for-byte the same as stage 2), fresh code downloads in `runs/verify-code/`
(new main bundle `main.492909756d6fd4640b5b.js`; recommender chunk 48419 unchanged), fresh product pages in
`runs/verify-pages/`, and four men's pre-wall replays (`verify-m-dismiss`, `verify-m-goals-all`, `verify-m-nonrx+rx`,
`verify-m-rx-easier`). This attempt continues from there. Runner: `bash scripts/run_verify.sh <id> ...` (action files in
`experiments/verify-*.json`).

- Served schemas re-checked: men v77 and women v32 are unchanged (only difference = `key` fields blanked by redact.py).
- New main bundle re-read: parseInt on variable values, fork evaluator (first true rule), multi-select next question
  (first ticked answer in display order) are all unchanged. `userAge` is set from date of birth on the Basics screen
  (`runs/verify-code/70959.*.chunk.js`); Basics enforces schema `meta.minAge` 18; men and women have no `maxAge`.
- Live today: `verify-w-temples` and `verify-w-temples+frontal` skip the part-line picture; `verify-w-top+temples` asks it
  (R20 confirmed).
- Live today (all one at a time, foreground): `verify-w-sudden`, `verify-w-pic2`, `verify-w-pic4` (no branch; pictures 2 and 4
  had never been replayed), `verify-m-coupon` (coupon 253, 35% off, still matched silently), `verify-otc-minoxidil`
  (sign-up first, cart $48 per 3 months), `verify-otc-shampoo`, `verify-otc-conditioner` ($24 per 3 months, then sign-up).
  Every wall screen is word-for-word the baseline's. Stage 3 total: 18 live replays (6 from the interrupted attempt, 12 today, incl. `verify-entry-escptw` and `verify-entry-afbkau`, both as in stage 1).
- Pricing page re-fetched today (`runs/verify-pages-1124/pricing.txt`): all hair-loss prices unchanged.
- Code re-read (raw schema, not the simulator) for the high-impact rules: women's stops (6020 pregnancy; 6040 via forks 1087,
  1091, 1159, 1251 and answers 1254 Yes, 1258 Foam/Both), tablet removal (fork 4020: not eligible or userAge > 65), the men's
  no-recommend setters (every one listed and matched to R8 to R13) and the recommender order. All confirmed; none contradicted.
- Simulator vs code: same parseInt, same first-true fork, same first-ticked-answer routing for choice/multichoice questions;
  it does not model the state rule (R7), which is server-side.
- `scripts/stage3.py` applies the stage 3 changes to company.json (experiments, observed upgrades, proofs, limitations,
  the `verification` block). Rebuild order is now: build_company.py -> sweep.py -> stage2.py -> stage3.py, then
  `node ../../tools/validate.js ro --stage final` (passes: 0 errors, 1 warning for the supplement with no URL).
- Still open: anything after the wall live; the state list; other men's schemas named by the coupon (kit, overhaul, gs, renewal);
  women's tablet strength; isEligibleFor6And12MonthShipments.
