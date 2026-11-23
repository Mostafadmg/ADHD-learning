# Hims UK (and Hers UK): working notes, stage 1 (MAP)

> **Stage 2 (EXPERIMENT) notes start at the heading 'Stage 2 (EXPERIMENT): working notes' further down.** Stage 1's notes are kept unchanged below; where stage 2 corrected them, see section S2.8.

Checked on 23 November 2026. Written for the next investigator. Read `company.json` for the tidy result and
`quiz-definition.json` for the full quiz as served.

## 1. The short version

- **Men (Hims UK).** The "free hair quiz" at `https://www.forhims.co.uk/c/hl` is 21 screens: 11 questions and 10 selling
  or information screens. It has **one fixed path**. Nothing a visitor answers changes the next screen, stops him, or
  changes the message. Then comes the **account wall**: `https://app.forhims.co.uk/start/signup?t=hair&anon_flow_key=hair`
  ("Ready to see if you’re eligible?", email field). No medical question, product, price or recommendation is shown
  before it.
- **Women (Hers UK).** `https://app.forhers.co.uk/start/signup?t=hair` asks for first and last name on the first screen.
  There is no anonymous quiz at all.
- **Behind the wall** (not seen live, read in served code): date of birth, a medical questionnaire, then the server marks
  each of ten products eligible or not and names one as the recommendation. The patient can swap to any other eligible
  product, picks a plan length, gives GP details and pays up front. A clinician reviews without a call and approves or
  refunds.
- **The wording of the medical questions and the answer-to-product rules are not public.** They are sent only to
  signed-in users. This is the main gap and it cannot be closed inside the research rules.

## 2. Two platforms (this matters)

Hims UK was moving platform on the day of the check. Banner on every page: "We're moving to a new platform."

| | Old platform | New platform |
|---|---|---|
| Who | Hims & Hers UK Limited | Fill Function UK Limited (Eucalyptus: the Juniper / Pilot system) |
| Where | `www.forhims.co.uk` (server-rendered React, Contentful) | `app.forhims.co.uk`, `app.forhers.co.uk` (Vite app, GraphQL at `api.external.eu.eucalyptus.vc`) |
| Hair quiz | `/c/hl` used to run it; now it only redirects | Runs the quiz as a "flow" |
| Still useful | Product content, price table, old consultation code | Flow definition, treatment screens |

`/c/hl` → 302 → `app.forhims.co.uk/anon-flow/hair?t=hair` → `/flow/a9a88e4a-89b9-47ae-8138-3a1acaa41594?t=hair&anon_flow_key=hair`.
The flow id comes from a feature flag, `cfg_anon_flow_version_map.hair.flowId = 09f03478-388f-4bf7-882f-ca4ea79f6258`.
For the Hers brand that flag has no `hair` entry, which is why Hers goes straight to sign-up.

## 3. Where things are

| File or folder | What it is |
|---|---|
| `company.json` | The result. Built by `scripts/build_company.py`. **From now on edit the JSON directly** (or edit the script and re-run it, but not both). |
| `quiz-definition.json` | Tidy quiz definition: all 21 anonymous steps with exact wording, options, stored values, the branch table; plus everything code shows about the steps behind the wall (Hims and Hers). |
| `quiz-definition.raw.json` | The raw GraphQL answer the site sent (same as `raw/flow-anon-hair.a9a88e4a.graphql.json`). |
| `baseline-men.json` | Replayable baseline walk (23 steps). Ends at the email field. |
| `baseline-women.json` | Opens the Hers entry. Zero answers possible. |
| `runs/baseline-men/` | Baseline walk, every screen as text and picture. |
| `runs/map-opposite-path/` | Second walk with the opposite answer on every question. Same end. |
| `runs/gst0/` | Product-link entry (`/c/hl?gst=KgktFDR2`). Same flow version. |
| `runs/misc1/` | `hair.forhims.co.uk` (blank), `/c` chooser, "Your answers" menu (Log in, Privacy notice, Delete my answers). |
| `runs/baseline-women/` | Hers first screen. |
| `runs/landing/` | Hair landing page with reviews. |
| `shots/` | Eight key screenshots. |
| `raw/store-product-details.json` | Price table for all 42 products (plans, pence, status). Embedded by the site in its own pages. |
| `raw/contentful-products.slim.json`, `raw/hair-products-contentful.txt` | Product content: names, tags, ingredients, strengths, full safety information. |
| `raw/app/` | New app: `index.js`, 116 route and content chunks in `chunks/`, feature flags for both brands, message extracts. |
| `raw/www-js/` | Old site code: the old hair consultation chunk and its helpers, `legacy-json-blobs.json` (copy text). |
| `raw/help/hims`, `raw/help/hers` | Every help-centre article as text (61 and 95 pages). |
| `raw/docs/`, `raw/hers/`, `raw/*.txt` | Terms, pharmacy terms, migration notice, landing and product pages as text. |
| `scripts/` | Helpers: `h2t.py` (page to text), `cf.py` (Contentful rich text), `extract_state.py` (pulls the embedded data out of a www page), `hc_crawl.js` (gentle help-centre crawler). |

## 4. How to replay

```
cd hairloss-research/companies/hims-uk
node ../../tools/walk.js baseline-men.json runs/<run-id> --last
```

Things to know:

- Single-choice questions move on by themselves about a second after the click. Use `"settle": 2500` on each click.
- The one multi-choice question (results hoped for) needs a click on `Continue`.
- Button labels change: `Continue`, `Next`, `Next →`, `Why these two? →`, `How do I get them? →`.
- The last screen has no button. It moves to the sign-up page after 5 seconds: use a `wait` of 8000 ms.
- The browser posts every answer to the server as you go (mutation `SubmitStepResponseAnonymously`, guest token, kept
  7 days). That is the site's normal behaviour. Guest tokens are redacted in the saved runs.
- **Stop at the email field.** Do not type in it.
- To make a one-change run, copy `baseline-men.json` and change one `text` value.

## 5. Products (see `company.json` for the full table)

Hims, men, ten live products. Three groups in the app: Oral, Topical, Combo.

- Compounded "Hair Hybrids": spray (finasteride 0.3% + minoxidil 6%), 4-in-1 spray (0.3% + 7% + ketoconazole 2.2% +
  biotin 0.2%), serum (0.3% + 6%), chew (finasteride 1.1 mg + minoxidil 3 mg + vitamins), minoxidil chew (3 mg +
  vitamins), supplement chew.
- Generics and brand: finasteride 1 mg tablets, alcohol-free minoxidil 5% serum (also compounded), combo kit, Regaine.
- Prices come from the embedded price table and match the "from £…" lines on the site: spray, serum and chews
  £16.50 a month on a 6-month plan; finasteride £23 a month on 12 months; combo kit £30 a month on 12 months.
- The numbers in the app code object `du` (for example spray `£30`) are **not** used for hair: the hair page asks the
  server for the price. Ignore them.

Hers, women: pill (minoxidil 1.5 mg + vitamins), chew (minoxidil 1.5 mg + biotin), serum (minoxidil 7% + ketoconazole
2.2% + dexpanthenol 5%), capsule (minoxidil 1.5 mg + spironolactone 44 mg + vitamins), vitamins only, and Regaine for
Women foam. "From £13" and "from £20" a month. Strengths were read in app code, not on a public page.

## 6. What the engine does, as far as it can be seen

1. Anonymous quiz: stores 11 answers. No effect on screen (seen live twice, and the served definition has no branch).
2. Sign-up: email, name ("matches the name on your ID"), password.
3. Date of birth: under 18 is refused in code. Help centre: 18 to 80, new customers up to 75.
4. Medical questionnaire ("triage flow"): not public.
5. Server scoring: each product and plan ("purchase preset") comes back with `eligible` and `denials`. Denial types in
   code: `PurchasePresetRuleMatchedDenial`, `PurchasePresetMissingDenial`.
6. Recommendation page: the product holding `recommendedPreset`. Line "Selected based on your goals:".
7. Options page: ineligible cards read "Not available based on your medical history".
8. Plan picker, GP practice, address, payment up front ("isUpfrontPayment: true").
9. Clinician review without a call ("requiresPrescriberCall: false"). Not approved means a refund.

The old platform did step 5 with tags. Each answer option could carry `excludesTags`; a product with a matching tag was
removed; the tag `all` removed everything. Product tags are in `quiz-definition.json`. This is the best available
picture of how "question X, option Y removes product Z" works at Hims, but the old question set is no longer served.

## 7. Dead ends

- **Medical questions.** Only after sign-in. Not allowed.
- **Wayback Machine.** `archive.org/wayback/available` says a copy of `forhims.co.uk/c/hl` exists from 10 June 2026
  (`web.archive.org/web/20260610100413/https://www.forhims.co.uk/c/hl`). `web.archive.org` resets the connection from
  this machine and the fetch tool refuses it. If someone can open it elsewhere: look in the page source for
  `window.HIMS_TANSTACK_STORE` and a query key starting `contentful-intakes`. That would be the full old question set
  with `excludesTags` on every option. This is the single most valuable thing still missing.
- **`hair.forhims.co.uk`.** Empty page.
- **Old product pages** (`/hair-loss/topical-finasteride-minoxidil`, `/oral-minoxidil-chew` and others): redirect to
  `/hair-loss` or 404. The content is still in the embedded product data.
- **`gst` product code** on the serum link: kept in the address, but no reference to it in the app code that was
  downloaded. It probably does nothing on the new platform.
- **Press article on the Hers UK launch** (regional newspaper sites): blocked (HTTP 403).
- **Help centres with curl:** bot check. Use the browser (`scripts/hc_crawl.js`).

## 8. What stage 2 should test first

The wall leaves little room for live experiments. In order of value:

1. **Decide whether one-change replays are worth running.** Expected result for every one of the 42 options: no
   change. Two full walks with opposite answers already ended identically. A sensible minimum is one run per question
   using an option not yet clicked (20 options are untested: listed as evidence "code" in `company.json`). Compare the
   screen text of steps 16 to 23 with `runs/baseline-men`. Only the summary screen (step 17) should differ.
2. **The 5% experiment.** `raw/hair-loss.HIMS_EXPERIMENT_CONTEXT.json` shows `exp-2026-previous-hl-treatment` at 5%,
   and this browser was in bucket "C" (control). The name suggests an extra "previous hair-loss treatment" question.
   Open `https://www.forhims.co.uk/hair-loss` in fresh browsers, read `window.HIMS_EXPERIMENT_CONTEXT`, and when the
   bucket is not "C" follow `/c/hl` and compare the flow version id and step list. Be gentle: a handful of loads.
3. **Phone layout.** One run with `--mobile` to check the flow is the same.
4. **More code.** About 340 of the app’s 453 chunks were not downloaded (`raw/app/all-chunks.txt`). The ones most
   likely to hold more Hims hair text: `plan-*`, `review-*`, `confirm-*`, `checkout-*`, `payment-plans-section-*`,
   `shipping-*`. Search them for `himsUk` and `hair`.
5. **Outside sources for the medical questions.** Customer reviews and forum posts that describe what Hims UK asked or
   why an order was refused. Label anything found as "docs" or "inferred".
6. **Hers.** Nothing more can be walked. The Hers help centre is fully saved in `raw/help/hers`.

## 9. Facts worth carrying forward

- Hims's own line under the quiz button: "The quiz is not a medical assessment."
- Compounded products are made by The London Specialist Pharmacy (GPhC 9010630). Clinical service: Fill Function UK
  Limited (CQC provider 1-22947623675).
- Hims hair is men only. Leaflets for most compounded products say age 18 to 65.
- Cancellation: by message to support; the help centre says 48 hours before the next order, the terms say three days.
- Hers has a 180-day money-back guarantee for hair (photos required). Hims has none for hair.
- Site flags of interest: `show-premium-spray-in-hl: true`, `ff_enable_hair_cross_sell: true`,
  `consultation_flow_config.HAIR` (all in `raw/app/launchdarkly-flags-hims-uk-anon.json` and
  `raw/contentful-feature-flags.json`).

---

# Stage 2 (EXPERIMENT): working notes

Done on 23 November 2026, after the stage 1 notes above. `company.json` now holds the stage 2 result. The file stage 1
left is kept as `company.stage1.json`.

## S2.1 The short version

- **40 replays**, all inside the rules (no account, no contact details, nothing typed into the email field).
  Baseline twice, then **31 one-change runs: every non-baseline option of all 11 anonymous questions**, then 7 extra checks.
- **Result: the anonymous quiz has exactly one outcome.** In all 31 one-change runs the screens, their order, the server's
  next-step replies, the 'Great news—we have options that may work for you' message and the email wall were identical.
  The only thing an answer can change is one line of the summary screen, and only for six of the eleven questions.
- So there is **no engine to reverse-engineer before the wall**. The engine that picks products sits behind the account and
  its questions are not public. Stage 2 added what public code and documents show about it (section S2.5).

## S2.2 One-change results, question by question

| Question | Options tested (runs) | Screen change | Engine change |
|---|---|---|---|
| men-q1 intent | 4 (exp-01 to exp-04) | none | none |
| men-q2 where | 2 (exp-05, exp-06) | summary line 1 | none |
| men-q3 how much | 2 (exp-07, exp-08) | none | none |
| men-q4 when | 3 (exp-09 to exp-11) | summary 'Noticed: …' | none |
| men-q5 goals (multi) | 4 alone (exp-12 to exp-15), 2 combinations (exp-32, exp-33) | none | none |
| men-q6 hair type | 3 (exp-16 to exp-18) | none | none |
| men-q7 hair length | 3 (exp-19 to exp-21) | none | none |
| men-q8 family history | 2 (exp-22, exp-23) | summary 'Family history: …' | none |
| men-q9 stress | 3 (exp-24 to exp-26) | summary 'Stress: …' | none |
| men-q10 styling | 3 (exp-27 to exp-29) | summary styling line | none |
| men-q11 time | 2 (exp-30, exp-31) | summary '… routine' | none |

Extra checks: phone layout (exp-34-mobile: same), Hers entry (exp-35-hers-replay: still the name wall), sign-up address
opened directly (exp-36-skip-quiz: same email screen, so the quiz is optional), other landing pages (exp-37-entries: every
button leads to /c/hl), returning visitor (exp-38-return: sent straight back to the email screen).

Multi-select details: Continue is greyed out until one box is ticked; 'All of the above' clears other ticks and is sent as
the single value `ALL`; two ticks are sent as a list.

Full machine comparison: `runs/compare-one-change.txt` and `runs/compare-one-change.json`.

## S2.3 How the runs were made (and how to repeat one)

```
cd hairloss-research/companies/hims-uk
python3 -I scripts/make_experiments.py          # writes experiments/exp-01.json … exp-31.json from baseline-men.json
bash scripts/run_batch.sh exp-07                # runs it into runs/exp-07 (one browser, 6 s pause, guest token redacted)
python3 -I scripts/compare_runs.py runs/exp-00-baseline-full runs/exp-07
python3 -I scripts/stage2_update.py             # rebuilds company.json from company.stage1.json + runs + scripts/stage2_text.py
node ../../tools/validate.js hims-uk --stage rules
```

- `scripts/walk-full.js` is `tools/walk.js` with one change: it also saves server replies smaller than 300 bytes. Those
  small replies are the server saying which step comes next, so with them every run has the complete trace
  (21 'submit step' posts + 1 'submit flow' post). `exp-00-baseline-replay` used the unmodified `walk.js`.
- `scripts/compare_runs.py` compares a run with the baseline three ways: text of every screen, the value posted for every
  step, and the next step the server named.
- `scripts/redact.py` replaces guest tokens in a run folder. `scripts/flag_diff.py` compares the feature flags each fresh
  browser was given.
- `scripts/stage2_text.py` holds all hand-written stage 2 text (rules, recommendations, summaries). Edit it and re-run
  `stage2_update.py`; do not hand-edit `company.json` unless you also stop using the script.
- A run takes about 90 seconds. Exit code 0 and a `DONE` file in the run folder mean it reached the email wall.

## S2.4 What the server traffic shows

- Each answer is posted at once (`SubmitStepResponseAnonymously`: step id + stored value). The reply names the next step.
  In every run the replies matched the branch table in the served definition.
- After the last screen the browser posts `SubmitFlowAnonymously`. The reply is a record id. **No evaluation, eligibility
  flag, product or price comes back.**
- Feature flags are requested under one shared visitor name (`{"key":"anonymous","brand":"hims-uk"}`), so every anonymous
  visitor gets the same flags: 949 identical in 41 fresh browsers, same quiz version every time. No per-visitor A/B test.

## S2.5 New things read in served code (all labelled "code" in company.json)

| File (raw/app/chunks/) | What it shows |
|---|---|
| `start-confirm-C2IJvpqe.js` | After sign-up the app sends the guest token (`ClaimFlowResponse`), attaching the quiz answers to the account. |
| `triage-complete-BpNWh0fs.js` | Medical questionnaires are scored on the server (`triageEvaluation { evaluatedAt isNotEligible }`). Any 'not eligible' → rejection screen. Then gates (GP address, home address), then recommendation or checkout. |
| `skip-cp-next-step-DLh4EqTF.js` | The decision after scoring: no product chosen → recommendation page; chosen and eligible → gates/checkout; chosen and not eligible → 'Other treatment options'. |
| `use-hims-uk-hair-purchase-options-RTx4GHla.js` | Hero product = server's `recommendedPreset`, else `defaultPreset`, else first. Greyed out when `eligible === false`. |
| `fixture-*.js` | 'Selected based on your goals:' chips are fixed text per product (`matchesPreference: false` everywhere). |
| `treatment-consent-Cks2UHMm.js` | Consent screen with hair-specific wording (compounded, off-label, 'plan to conceive in the next 3 months'). |
| `get-config-ChQNMk7O.js` (fetched in stage 2) | Hims UK brand settings: self-service cancel off; identity check on; plan changes for hair go through support; exclusive answer values (`ALL`, `NONE`, `NONE_OF_THE_ABOVE`); **one medical question key: `hairlossAllergiesDetailed` with exclusive choice `NEITHER`**. |
| `main-scIJrLNW.js` (fetched in stage 2) | The questionnaire player: step types, photo capture, min/max age messages, 'This answer must be selected on its own'. No question content. |
| `rejected-screen-COWSDWyl.js` | Rejection screen for questionnaires: 'Back home' and a contact link only (no restart). |

A search of every downloaded code file for hair answer keys found only `hairlossAllergiesDetailed`, `hairLossOnset`,
`hairLossLocation` and `hairLossFamilyHistory`. The medical question wording is not in public code.

## S2.6 Other sources used in stage 2

- Older Hims UK help centre, `himsuk.zendesk.com/hc/en-us` (still online; opens in the browser, bot check for plain
  downloads). Saved in `raw/help/hims-old/`. It gives the vitamin strengths in the chews (biotin 2.5 mg, vitamin C 100 mg,
  B5 10 mg, B6 2 mg) and a stricter statement on other types of hair loss.
- Trustpilot (through a page-summary tool, checked twice): 4.1 from 123 reviews; quotes used are in `company.json`.
- Hims's own combo-kit page (`runs/exp-37-entries/03.txt`): 4.4 from 1,913 reviews; recent broken-pump complaints.

## S2.7 Dead ends in stage 2

- `web.archive.org`, `archive.ph` and `index.commoncrawl.org` are all unreachable from this machine. The archived copy of
  the old consultation (which may list a product exclusion for every answer option) is still the most valuable missing item.
- Web searches for descriptions of the Hims UK medical questionnaire (reviews, forums, press) found nothing specific.
- The old site's 5% experiment `exp-2026-previous-hl-treatment` was not sampled: its bucket is set by the old site, the
  quiz now runs on the new app, and nothing in 41 browsers differed.

## S2.8 Corrections to stage 1

- Rule R4 (men aged 66 to 75): the 2-in-1 spray's leaflet has **no** upper age limit (only 'younger than 18'), so it is no
  longer listed as removed. Seven products are labelled 18 to 65: 4-in-1 spray, serum, both chews, minoxidil serum, combo
  kit (through the serum) and Regaine.
- The 'Selected based on your goals:' chips are fixed per product; stage 1 guessed they came from the goals answer.
- Vitamin strengths in the Hims chews are now filled in (they were 'not stated').
- Screenshot `02-men-q3-how-much-hair.jpg` was swapped for `02-exp-10-summary-started-in-past-few-months-no-warning.jpg`.

## S2.9 What stage 3 (verify) should check

1. Re-run two or three one-change runs chosen at random and confirm `compare_runs.py` still reports 'identical'.
2. Re-read the leaflet lines quoted in rules R4, R9 to R15 and R34 to R37 against `raw/hair-products-contentful.txt`.
3. Check the code-read rules R28, R30 to R33 against the named files (the minified code is short enough to read).
4. Prices: all Hims prices still come from the old price table. If any public page now shows a different 'from' price,
   update the product rows.
5. If an archive becomes reachable, fetch the 10 June 2026 copy of `/c/hl` (see section 7 above).

## S2.10 Code-read rules confirmed live (task step 3)

Eight rules were first read in the served definition or code and then seen happening. They are listed in
`company.json` under `codeRulesConfirmedLive`: one path only; six answers played back; fixed 'Great news' text; stored
values; 'All of the above' stands alone; goals question required; auto-advance and submit with no result; no anonymous
quiz for Hers.
