# Hair + Me (UK): working notes, stage 1 (MAP) and stage 2 (EXPERIMENT)

Checked on 23 Nov 2026. Written for the next investigator (stage 3: verification). Site version seen: `v6.47.0`.
Sections 1 to 11 are the stage 1 map, corrected where stage 2 proved them wrong (marked "stage 2"). Section 0 is new.

## 0. Stage 2 in one page (read this first)

**What was done.** 47 replays of the public consultation, one browser at a time: 2 baseline replays, 39 experiments that
changed one answer, and 6 group tests that changed 5 to 11 non-medical answers at once. Every run was compared with a pool
of baseline visits (`tools/s2_diff.py`), because the server varies screens at random. All runs ended at the account wall
(`yd`) or at the under-18 stop; nothing was typed into the name screen.

**What the questionnaire visibly does (everything found):**

| answer | visible effect | proof |
|---|---|---|
| sex at birth Male / Female | swaps the men's and women's question blocks | baselines |
| first tile | nothing (it does not route) | `s2-m-tile-women` |
| age under 18 | the only stop screen (`utt`); 17 years 11 months stops, 18 years and 8 days passes | `s2-m-age-17`, `s2-m-age-18` |
| age 85 | nothing: no upper limit met | `s2-m-age-85` |
| two or more goals | extra screen `hgp` listing only the ticked goals | `s2-m-yhg-two` |
| blood-pressure condition | extra screen `bp`; 'Often elevated' then does nothing | `s2-m-mcm-bp`, `s2-m-mcm-bp-elevated` |
| pregnant / breastfeeding / likely to conceive = Yes | extra consent screen `pgc`; not turned away | `s2-w-pg-yes` |
| no hair loss | timing question skipped; still reaches the bag | `scout-men-none` |
| pets = Yes | warning on the same screen + 'Better for pet owners' badge on The Capsules (server adds the badge) | `s2-m-pt-yes` |
| any previous product | must-tick 'stop using them' box | `s2-m-htp-fintabs` |
| medicines = Other | required free-text box | `s2-m-mdm-other` |
| **gender identity** not blank and not Man/Boy (sex Male) | **the men's 'You're not alone' screen (`yna`) is skipped** | `s2-m-gender-transwoman` |
| everything else tested | nothing: same screens, same bag | see `company.json` |

"Everything else" includes: patches of complete hair loss, eyebrow / sideburn loss, sudden recent loss, active scalp
infection, scalp eczema, heart disease, phaeochromocytoma, liver disease, depression, sexual dysfunction, prostate and breast
cancer history, BPH, antidepressants, minoxidil allergy, finasteride allergy, PCOS, postpartum, facial hair, choosing The
Drops, and declining finasteride / dutasteride.

**The bag never changes.** 56 walks reached it: always `hairTreatment`, 'Personalised treatment', '4 week supply · 12ml',
'Prescription', £34.99, free shipping. The POST replies hold only the next step id, so nothing is hidden in the traffic.

**New in stage 2: `yna` is a branch, not noise.** Stage 1 saw it missing once in seven men's walks and called it random.
It was present in 37 of 41 men's walks; the four without it are exactly the four where gender identity was set to
Transwoman/Transgirl, Non-Binary or Prefer not to say. A one-change run confirmed it. Lesson: before calling a missing
screen "random", check every answer in the run, including optional ones.

**Where the real engine is.** After the wall: a pharmacist prescriber picks one of 16 compounded formulas. The company says
so in writing ("This isn't automated or AI", blog article 712525). Its published limits are the leaflet contraindications;
its explainer articles call finasteride first-line and dutasteride second-line, and steer women with PCOS to drops. Those
are `docs` rules in `company.json` (R28 to R42), never seen in a prescription.

**Code-only findings** (`src/nxt/ConsultationStepRoute-*.js`, shared with the other +Me brands, never served to us): an
add-on selector 'Support your treatment' with an item coded `hairSupplement` (the vitamins) and a 'First box offer'; a
bundle selector; a second treatment selector with a featured 'Personalised Treatment' option and 'Alternatively, choose
your preferred ingredients:' with Capsules / Drops chips; a subscription selector that pre-selects any option whose label
contains 'prescription'.

**How company.json is built now.** Do not edit `company.json` by hand and do not run `build_company.py` any more:

```bash
cd /home/user/ADHD-learning/hairloss-research/companies/hair-and-me
python3 tools/build_quizdef.py && python3 tools/s2_apply.py \
  && node ../../tools/validate.js hair-and-me --stage rules
```

`s2_apply.py` reads `company.stage1.json` (the frozen stage 1 map), `quiz-definition.json`, every `runs/*/api.jsonl`, and
the hand-written tables in `tools/s2_text.py` (rules, product lines, summary, limitations). It works out, for every
option, which runs chose it and how strong that evidence is: one-change replay, group test, stage 1 multi-change scout,
other route only, or untested. It warns if a rule cites a run that does not exist or claims "no visible change" for a run
that shows one. Edit the tables, then rebuild.

| stage 2 tool | use |
|---|---|
| `tools/s2_make.py [id ...]` | writes `runs/<id>.json` (baseline + one changed answer, or a group test) from the lists in the file |
| `tools/s2_run.sh <id> ...` | replays runs one at a time with a pause; `s2-base-men-N` / `s2-base-women-N` replay a baseline |
| `tools/s2_diff.py <id> ...` | compares a run with the baseline pool; prints new / missing steps, changed definitions, the bag |
| `tools/s2_apply.py` | rebuilds `company.json` |
| `tools/s2_text.py` | every hand-written sentence of stage 2, with its evidence label |

**Not tested (answer files ready in `runs/_not-run/`):** women's 'receding hairline' and 'I don't know what kind of hair
loss I have' (the only two options still `unknown`), the women's under-18 stop as a single change, age 106, BPH medicine
alone, the allergy free-text box alone, 'Complete hair loss' alone, spironolactone alone for women, the drops promo link.
To run one: `mv runs/_not-run/<id>.json runs/ && bash tools/s2_run.sh <id> && python3 tools/s2_diff.py <id>`.

**For stage 3 (verification), check first:** (1) the quotes in rules R38 to R42 against the saved articles in
`src/support/`; (2) the `yna` rule with one more gender identity value; (3) that `shots/` still matches (a screenshot of the
pet badge is at `runs/s2-m-pt-yes/16.jpg`, of the missing-`yna` run nothing to show); (4) the Trustpilot statements, which
were read through web search summaries and are labelled third-party; (5) a Cosmopolitan UK review of Hair + Me exists
(article a64428039) but could not be opened from this machine, so it is not used.

## 1. The short version

- **One consultation for everyone.** Template `sign-up-hair`, short name `suh`, URL `https://www.hairandme.com/c/suh/new`.
  There is no separate men's or women's URL. The route is set by the answer to **"sex you were assigned at birth"**, not by
  the first-screen tile ("Treatment for men / women / Neither").
- **The browser loads the site with no bot protection.** No checkpoint, no CAPTCHA.
- **The account wall is the screen "Personalise your account"** (step `yd`: legal first name, legal last name, preferred
  name). It comes after the shopping bag. Everything before it is anonymous: all hair and medical questions, date of birth,
  the UK tick and the bag.
- **Nothing is recommended before the wall.** The bag always shows one line: `Prescription · Personalised treatment ·
  4 week supply · 12ml · £34.99`, free shipping, a promo-code box. Same line for men, women, capsule or drops preference,
  and for every medical red flag tried.
- **Only one hard stop was found: age under 18** (step `utt`, "We're unable to treat you at this time... your age group").
  Patchy or total hair loss, active scalp infection, phaeochromocytoma, heart or liver disease, allergy to every active and
  pregnancy do **not** stop the flow.
- **The formulary is public in the leaflets:** 6 capsule formulas and 10 drops formulas with strengths (see section 6).
- **The full quiz is not served anywhere.** The server sends one step at a time. `quiz-definition.json` is my merge of every
  step it served during the runs (44 steps, 59 variants, 56 transitions).

## 2. How the site works (read this before replaying)

- Front end: one Vite/React app (shared with Skin + Me). All question content comes from the API, one step at a time:
  - `POST https://api.hairandme.com/new-user/2` on arrival: makes an anonymous visitor id (no details asked).
  - `GET  https://api.hairandme.com/consultation/suh/<stepId>`: the step definition (title, questions, options, input types,
    client-side show/hide rules `renderConditions`).
  - `POST https://api.hairandme.com/consultation/suh/<stepId>`: saves the answer; the reply is `{"slug": "<next stepId>"}`.
    **Branching is decided here, on the server.**
  - `GET https://rest.hairandme.com/api/v1/feature-tests?...`: an A/B test record (always `control` in my runs).
  - `GET https://rest.hairandme.com/api/v1/discount-codes`: only when a promo code is in the URL.
- Step ids are the last part of the page URL (`/c/suh/htam`). They are stable. I key everything by step id.
- **The server changes things at random between visits with identical answers.** This is the main trap:

  | what varies | detail |
  |---|---|
  | step `js` ("Where are you in your hair regrowth journey?") | present in 5 of 7 men's runs, 2 of 4 women's runs |
  | step `hs` ("How do you usually style or treat your hair?") | present in 4 of 7 men's runs, 4 of 4 women's runs |
  | step `yna` ("You're not alone" screen) | **stage 2: not random.** Shown to men only when gender identity is blank or Man/Boy (see section 0). Only its title varies at random ("Lots of people feel this way") |
  | step `pds` title | "Your medical history" or "Understanding your hormones" |
  | step `st` (skin tone) | six buttons (question 9346, short or long labels) or a drag slider (questions 9348 + 9349); title "Which best matches your skin?" or "How would you describe your skin tone?" |
  | steps `rhf`, `rha` (0–10 scores) | optional slider (questions 254 / 255) or required 1–10 button row (244 / 245) |
  | step `el` (date of birth) | one masked field (question 3053) or Day / Month / Year boxes (3079) |
  | step `ct` title | "Your shopping bag" or "Your order" |
  | step `di` | the two options swap order |
  | step `hdw` | description empty or "Hard water can dry your scalp." |

  So **a run is not a pure function of the answers**, and a fixed click list for `tools/walk.js` breaks at the first variant.
  Always compare against the noise list above (or replay the baseline twice) before calling something a branch.

## 3. Tools in this folder (`tools/`)

| file | use |
|---|---|
| `autowalk.js` | The replay tool for this site. `node tools/autowalk.js <answers.json> runs/<id> [--auto] [--html]`. Answers are keyed by step id, so step order and random steps do not matter. It clicks through the page like a visitor (it never calls the API itself), saves `steps/NN-<id>.json` (the step JSON the page fetched), `NN.txt`, `NN.jpg`, `api.jsonl` (every API call with POST bodies and replies) and `walk-actions.json` (the route as a walk.js file, for reference only). It **stops at the first step with no answer** and prints that step's JSON: that is how new screens are found. It has no default for any text field, so it always stops at the account wall. |
| `add.py` | `python3 tools/add.py <answers.json> <stepId> '<json>'` adds or replaces one answer. |
| `compare.py` | `python3 tools/compare.py <runA> <runB>`: steps only in A / B (random steps flagged), option / badge / text differences in shared steps, and the bag in each run. |
| `build_quizdef.py` | Rebuilds `quiz-definition.json` from every `runs/*/api.jsonl`. |
| `build_company.py` | Stage 1 only: it built the map that is now frozen as `company.stage1.json`. **Stage 2: do not run it** (it would overwrite `company.json` with the stage 1 version). Use `s2_apply.py` (section 0). |
| `links.js` | `node tools/links.js <url>` lists consultation links on a page with the section each sits in. |

Answer-file format (see the header of `autowalk.js`):

```jsonc
"answers": {
  "htam": ["Across the hairline"],                         // labels to click, in order
  "pds":  [{"select": "select[name='3039']", "value": {"label": "Male"}}],
  "st":   {"byQuestion": {"9346": ["Fair. It often burns, but tans a little"], "9348": [{"range": "input[type=range]", "value": 25}]}},
  "rhf":  {"byType": {"number_slider": [], "single_select_button": ["5"]}},
  "mi":   []                                               // info screen: just press the button / Skip
}
```

`--auto` answers only obvious neutral screens (info screens, a lone confirm tick, the exclusive "None of the above" on a
multi-select). Do not use it for experiments: put every answer in the file.

### One-change experiment recipe

```bash
cd /home/user/ADHD-learning/hairloss-research/companies/hair-and-me
cp baseline-men.json runs/exp-01.json
python3 tools/add.py runs/exp-01.json htc '["Recently, in the past few weeks"]'
node tools/autowalk.js runs/exp-01.json runs/exp-01          # about 2 minutes; use a Bash timeout of 400000 ms
python3 tools/compare.py baseline-men exp-01
python3 tools/build_quizdef.py                               # adds any new step to quiz-definition.json
```

If the walk prints `STOP: no answer for step ...` before `yd`, you found a new screen: add an answer for that step id and
run again. If it stops at `yd`, the route is complete. **Never add an answer for `yd`.**

Each replay creates a new anonymous visitor record on Hair + Me's servers and saves the fictional answers to it (that is
how the site works for every visitor). Keep replays to what is needed, one at a time.

## 4. The two baselines

- `baseline-men.json`: man born 15/06/1994 (32), sex at birth Male, goal "Prevent, stop or reverse hair loss", hair loss
  "Across the hairline", noticed "Over a year ago", straight hair, normal scalp, nothing else ticked, no pets, prefers
  **The Capsules** (the option badged "Most popular": the site has no "no preference"), agrees to be considered for
  dutasteride / finasteride, no medicines, conditions or allergies, UK. Clean run: `runs/baseline-men`.
  - The protocol baseline is "receding hairline and thinning crown". The site's picture question is **single choice**, so I
    chose "Across the hairline". "At the crown" is a stage 2 experiment.
  - The site never asks about family history, speed of loss beyond "when did you notice", or previous side effects.
- `baseline-women.json`: woman born 15/06/1988 (38), sex at birth Female, "My middle parting is getting wider", "Over a year
  ago", washes 3–4 times a week, not hiding hair loss, hard water "No", no pets, prefers The Capsules, pregnant /
  breastfeeding / likely to conceive = No (+ the must-tick acknowledgement), not postpartum, no facial hair, no medicines,
  conditions or allergies, UK. Clean run: `runs/baseline-women`.
  - The site never asks about contraception, periods, menopause or HRT.
- The optional 0–10 scores are left untouched when served as sliders and set to 5 when served as required buttons.

## 5. Step map (ids in the order served)

**Men** (28–32 screens): `tp` tile → `yhg` goals + data-consent tick → [`hgp` top goal, only if 2+ goals] → [`js` random] →
`pds` sex at birth + optional gender identity → `pdsc` confirm sex → `mi` "Ingredients that see results" (info) → `ht` hair
type → [`hs` styling, random] → `ls` lifestyle statements → `htp` previous products (+ "stop using them" tick if any) →
`htam` where (pictures, single choice) → [`htc` when; skipped after "None"] → `ar` "Here's what we know..." (info) → `st`
skin tone → `sc` scalp condition → `scc` scalp symptoms → `smt` six-month goal → `pt` pets → `tt` Drops or Capsules → `pp`
dutasteride / finasteride acknowledgement → `mdm` medicines (+ free text) → `mcm` conditions → [`bp` blood pressure, only if
the BP condition is ticked] → `al` allergies (+ free text) → `rhf` feelings score → [`yna` info, only when gender identity is
blank or Man/Boy: stage 2] → `rha` appearance
score → `di` what influenced you → `rj` "Consistency is key" (info) → `el` date of birth + UK tick → [`utt` stop if under 18]
→ `ct` shopping bag → `yd` **account wall**.

**Women** (32–33 screens): `tp` → `yhg` → [`hgp`] → [`js`] → `pds` → `pdsc` → `ht` → `hs` → `hw` wash frequency → `hht`
hiding hair loss → `htp` → `hdw` hard water → `htaf` where (women's pictures) → [`htc`; skipped after "I have no hair loss or
thinning"] → `ar` → `st` → `sc` → `scc` → `smt` → `pt` → `tt` → `dt` "Our Dermatology Team have a few more questions"
(info) → `pg` pregnant / breastfeeding / likely to conceive → [`pgc` pregnancy safety information, only after Yes] → `mp`
postpartum / facial hair → `mdf` medicines (+ free text) → `mcf` conditions → [`bp`] → `al` → `rhf` → `rha` → `di` → `rj`
→ `el` → [`utt`] → `ct` → `yd` **account wall**.

Men-only: `mi`, `ls`, `htam`, `pp`, `mdm`, `mcm`, `yna`. Women-only: `hw`, `hht`, `hdw`, `htaf`, `dt`, `pg`, `pgc`, `mp`,
`mdf`, `mcf`. (Stage 2: `ls` and `yna` were never served to women in 17 walks, and `mi` and `ls` were served in all 41 men's
walks, so these are route rules, not chance.)

Client-side show/hide rules read from the step JSON (`renderConditions`):
- `htp`: any product ticked → must-tick "Yes, I understand this." (stop using them when you start).
- `pt`: Yes → minoxidil pet-toxicity text on the same screen.
- `pg`: No → must-tick "Yes, I've read and understood the information and would like to carry on."
- `mdm` / `mdf`: Other → free text. `al`: Other → free text.

## 6. Products (where each fact comes from)

- **The Capsules** (6 formulas), oral leaflet `support/en/articles/254164`: minoxidil 0.5 mg; minoxidil 1.25 mg; minoxidil
  2.5 mg + vitamin B6 1.4 mg; finasteride 1 mg + minoxidil 2.5 mg; finasteride 1 mg + minoxidil 5 mg; dutasteride 0.5 mg +
  minoxidil 1.25 mg. Shell: microcrystalline cellulose, HPMC.
- **The Drops** (6 medicated formulas), topical leaflet `254578`: minoxidil 5% PGF once a day; minoxidil 5% PGF twice a day;
  minoxidil 5% + finasteride 0.1% twice a day; minoxidil 5% + tretinoin 0.01% once a day; minoxidil 5% + tretinoin 0.01% +
  finasteride 0.1% once a day; finasteride 0.2% once a day. 28 ml or 56 ml.
- **The Drops, "Healthy Hair & Pregnancy-safe"** (4 formulas), leaflet `258568`: niacinamide 5% + urea 2%; + melatonin 0.1%;
  niacinamide 5%; niacinamide 5% + melatonin 0.1%. 28 ml. Melatonin formulas are not for pregnancy.
- **The Vitamins / Multivitamins**: member add-on. Ingredients in `619143` and in the chunk `src/nxt/the-vitamins-*.js`.
  Price not public.
- The allergy question (`al`) lists the same actives: minoxidil, finasteride, dutasteride, melatonin, urea, niacinamide,
  tretinoin, vitamin B6. Spironolactone appears only as a "previously used" option, never as something they supply.
- Price: £34.99 every four weeks (`254006`, the bag, and the default promotion text in local storage). Product pages show
  "£14.99 ~~£34.99~~" and link to `/c/suh/new?promocode=HGSHOPDROPS|HGSHOPCAPS`: first three months £14.99 each
  (`runs/entry-promo-caps-men`). Refer-a-friend copy in `src/nxt/hair-*.js`: first three months £12.99, £30 credit. Dashboard
  copy: pre-paid bundles "Save up to 30%".
- Oddity: the bag says "4 week supply · 12ml" for everyone, even capsule choosers; the leaflet says 28 ml or 56 ml.
- `https://shop.hairandme.com/` is a Shopify shop behind a password page ("Opening soon"); the product-page code has a test
  variant "Buy now - £14.99" pointing to it. Not public: left alone.
- `/sitemap.xml` and `/robots.txt` return the app shell, not real files. `/products` is blank. `/how-we-compare` errors.

## 7. Entry points (all lead to the same flow)

| where | link |
|---|---|
| Home: header button, hero "START 3 MINUTE CONSULTATION", "For women" card, "For men" card | `/c/suh/new` |
| Home: "GET STARTED" under "Our expertise" | `/consultations/sign-up-hair/new` → redirects to `/c/suh/tp` |
| Home: "GET STARTED" under "How Hair + Me works" | `/HAIR_SIGNUP_URL` → **error page** (unfilled placeholder) |
| `/products/the-drops`, `/products/the-capsules` | `/c/suh/new?promocode=HGSHOPDROPS` / `HGSHOPCAPS` (same questions, cheaper bag) |
| `/products/the-drops-mx` (alcohol-free minoxidil landing page), `/ingredients`, `/meet-the-team` | `/c/suh/new` |

Other routes exist in the code (`/lp/:slug`, `/lpp/:slug`, `/r/:slug` referral, `/stc`, `/awin-stc`, `/w`) but I found no public
slugs and did not guess any.

## 8. Runs kept in `runs/`

| run | what |
|---|---|
| `home`, `pages`, `entry-points` | walk.js captures of public pages and the two other home-page links |
| `baseline-men`, `baseline-women` | clean baselines to the wall |
| `women-a` | working run for the women's baseline (same answers) |
| `scout-men-1`, `-2`, `-3`, `scout-women-1`, `-2`, `scout-neither` | **multi-change scouts**: several answers changed at once, only to find new screens. Their `.json` files say what was changed. Do not read them as one-change experiments. |
| `scout-men-none` | one change: `htam` = None (timing question skipped) |
| `entry-promo-caps-men` | baseline men entered through the capsules promo link |
| `s2-base-men-1`, `s2-base-women-1` | stage 2 baseline replays (same answers as the baselines; they show the random variation) |
| `s2-m-*`, `s2-w-*` | stage 2 experiments on the men's / women's route; each `runs/<id>.json` states its one change in `_changed`. `*-sweep-*` are group tests (several non-medical answers at once) |
| `s2-batch-*.log` | start / end time and last line of each replay |
| `_not-run/` | prepared answer files that were not replayed (budget) |

## 9. What stage 1 asked stage 2 to test (done unless section 0 says otherwise)

1. **Confirm the scout findings one change at a time** (rules R3, R5, R6, R7, R8 in `company.json` are marked preliminary):
   two goals → `hgp`; BP condition → `bp`; pregnant Yes → `pgc`; under 18 → `utt`; pets Yes → badge on `tt`.
2. **Age:** 17 years 11 months, exactly 18, 18–21, 65, 75, 85, 100. The stop text says "your age group", so look for an upper limit.
3. **Sex versus tile:** "Treatment for women" + Male (not yet tried); confirm tile has no effect.
4. **Every option of `htam` and `htaf`** one at a time (does any add a screen or change the bag?), then `htc`.
5. **`tt` Drops versus Capsules** alone, and **`pp` decline** alone: look hard at the bag JSON (`ct`) and at any later step for
   a difference. So far there is none.
6. **Each condition in `mcm` and `mcf` alone**, each medicine option alone, each allergy alone, each scalp symptom alone:
   expected result is "no visible change", but it needs one clean run each to say so with confidence.
7. **`bp` options** (Well-controlled is untested) and whether a very high typed reading does anything.
8. **Marketing questions** (`js`, `di`, `smt`, `hw`, `hht`, `hdw`, `ls`, `hs`, `ht`, `st`, `sc`): one run each for the options
   still marked unknown; check whether `di` = "I want the discounted trial" changes the bag or promo text (it did not in a scout).
9. **Promo entry for drops** (`?promocode=HGSHOPDROPS`) to confirm it matches the capsules offer.
10. Replay each baseline twice more first, to firm up the random-step list in section 2.

About 80 of 261 options are still `unknown` (never chosen in a run). They are listed in `company.json`.

## 10. Dead ends and limits

- No full quiz definition in public code: `src/nxt/ConsultationStepRoute-*.js` is only a generic renderer (input types such as
  `photo`, `photo_multiple`, `address`, `telephone_number`, `billing`, `treatment_selector`, `bundle_selector`,
  `supplement_product_selector`; interstitial types such as `answers-review`, `male-ingredients`, `you-are-not-alone`,
  `results-journey`, `prescriber-review`, `price-per-day`, `regrowth-timeline`). Those names hint at what comes after the wall
  (photos, address, card, maybe a treatment or bundle picker) but nothing more.
- Everything after `yd` is untested by rule: account creation, optional photos, payment, the prescriber's choice of formula.
- The prescriber's rules are not public. `recommendedWhen` in `company.json` is built from the leaflets and FAQ.
- Web search found press and Trustpilot only; no independent write-up of what is prescribed to whom.
- I did not request any step id that the page had not been sent by the server (no guessing of API paths).

## 11. Source files saved

- `src/index.js`, `src/nxt/*.js`: the site's JS bundle and chunks (product pages, ingredients, dashboard copy).
- `src/support/col-*.html`, `art-*.html`, `art-*.txt`: support-centre collections and 44 articles (leaflets, FAQ, terms) as
  HTML and plain text. `src/fetch_articles.py <outdir> <slug>...` fetches more.
- `src/strings.py <chunk.js>`: prints readable text from a JS chunk.
- `shots/`: 8 screenshots (first screen, men's hair-loss pictures, finasteride acknowledgement, pregnancy branch,
  blood-pressure follow-up, under-18 stop, shopping bag, account wall).

## 12. Stage 3 (VERIFY) log, 23 Nov 2026

Tools: `tools/s3_make.py` writes `runs/verify-*.json`; `tools/s3_run.sh <id> ...` replays them one at a time; compare with
`python3 tools/s2_diff.py <id>`. An earlier stage 3 attempt was interrupted mid-run in `verify-w-pg-yes`; it was re-run.

| run | result |
|---|---|
| verify-base-men | ends at the wall (`yd`), bag `hairTreatment` £34.99, no new or missing steps: matches |
| verify-base-women | same: matches |
| verify-m-age-17 | stop `utt`, no bag: confirms R (under-18 stop) |
| verify-w-pg-yes | extra `pgc` only, same bag: confirms |
| verify-m-mcm-heart | no change, same bag: confirms "heart condition does not stop or change the bag" |
| verify-m-pp-decline | no change, same bag: confirms |
| verify-m-al-minoxidil | no change, same bag: confirms |
| verify-m-gender-nonbinary | `yna` missing, all else same: confirms the gender-identity rule with a second value |
| verify-m-bp-elevated-reading | extra `bp`; 'Often elevated' + typed 180/110 posted, next step `al`, same bag: a very high reading does nothing visible |
| verify-w-age-17 | women: stop `utt` (new single-change proof for the women's route) |
| verify-w-mcf-bp | women: extra `bp`; 'Well-controlled' tested for the first time; same bag |
| verify-w-htaf-receding | women 'receding hairline': no change, same bag (first test of this option) |
| verify-w-htaf-dontknow | women "I don't know what kind": no change, same bag (first test) |
| verify-w-entry-promo-drops | drops promo link: same questions, bag £14.99 (was £34.99), code HGSHOPDROPS, same offer text as the capsules link: confirms |
| verify-m-group-medical | GROUP: five previous products, five scalp symptoms, scalp steroids, hypertrichosis + PoTS, six allergies: no new or missing step, same bag |

Product check (live support articles re-fetched to `src/verify/` today): price £34.99 every four weeks (254006); all 6 capsule
and 10 drops formulas and strengths match the leaflets 254164, 254578, 258568. Vitamins: the article 619143 gives raw
ingredient names only (it also names vitamin B12); the per-dose amounts come only from the site code
`src/nxt/the-vitamins-*.js`, which does not list B12. Label stays `code`.
| verify-w-group-medical | GROUP (women): scalp eczema + active infection + pain, scalp steroids, phaeochromocytoma + hypertrichosis + PoTS, all eight allergies: no new or missing step, same bag |
| verify-w-pt-yes | women pets Yes: 'Better for pet owners' badge on The Capsules, same bag: confirms the pets rule on the women's route |
| verify-m-gender-woman | `yna` missing: third value confirms the gender-identity rule |
| verify-w-gender-man | women, gender Man/Boy: no change |
| verify-m-mdm-bph | BPH medicine alone: no change, same bag |
| verify-w-htp-spiro | women, spironolactone before: only the must-tick box, same bag |
| verify-pages | product pages show £14.99 against £34.99; /products/the-vitamins has no public page |
| verify-suhs-explore-0 | /c/suhs/new (supplements consultation named in the code) redirects to login: behind the account wall; nothing typed |

**Result:** 21 consultation replays in stage 3, no claim contradicted. Corrections were labels only (see
`verification.corrected` in company.json): R9/R16/R17/R19/R20 now 'none' (a prescriber decision cannot be observed), R21,
R39, R40 now 'inferred', R26 widened to both routes, R23 gains Woman/Girl, 'Female' option type fixed, vitamins B12 note.

**How company.json is built now (stage 3):** the stage 3 layer is `tools/s3_text.py` (VISTEXT, OPT_FIXED, RETESTED and
`apply()`, which writes the `verification` block). Rebuild with
`python3 tools/build_quizdef.py && python3 tools/s2_apply.py && node ../../tools/validate.js hair-and-me --stage final`.
Not re-run in stage 3: `verify-m-htam-complete`, `verify-w-yhg-two`, `verify-w-htaf-none`, `verify-m-al-other`,
`verify-m-age-106` (answer files are in `runs/`; budget).
