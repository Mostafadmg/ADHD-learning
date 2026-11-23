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
