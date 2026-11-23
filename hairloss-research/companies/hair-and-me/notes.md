# Hair + Me (UK): working notes, stage 1 (MAP)

Checked on 23 Nov 2026. Written for the next investigator (stage 2: one-change experiments). Site version seen: `v6.47.0`.

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
  | step `yna` ("You're not alone" screen) | present in 6 of 7 men's runs, never for women; title sometimes "Lots of people feel this way" |
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
| `build_company.py` | Rebuilds `company.json` from `quiz-definition.json` + the annotation tables inside the script. If you edit `company.json` by hand instead, say so here and stop using the script. |
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
the BP condition is ticked] → `al` allergies (+ free text) → `rhf` feelings score → [`yna` info, random] → `rha` appearance
score → `di` what influenced you → `rj` "Consistency is key" (info) → `el` date of birth + UK tick → [`utt` stop if under 18]
→ `ct` shopping bag → `yd` **account wall**.

**Women** (32–33 screens): `tp` → `yhg` → [`hgp`] → [`js`] → `pds` → `pdsc` → `ht` → `hs` → `hw` wash frequency → `hht`
hiding hair loss → `htp` → `hdw` hard water → `htaf` where (women's pictures) → [`htc`; skipped after "I have no hair loss or
thinning"] → `ar` → `st` → `sc` → `scc` → `smt` → `pt` → `tt` → `dt` "Our Dermatology Team have a few more questions"
(info) → `pg` pregnant / breastfeeding / likely to conceive → [`pgc` pregnancy safety information, only after Yes] → `mp`
postpartum / facial hair → `mdf` medicines (+ free text) → `mcf` conditions → [`bp`] → `al` → `rhf` → `rha` → `di` → `rj`
→ `el` → [`utt`] → `ct` → `yd` **account wall**.

Men-only: `mi`, `ls`, `htam`, `pp`, `mdm`, `mcm`, `yna`. Women-only: `hw`, `hht`, `hdw`, `htaf`, `dt`, `pg`, `pgc`, `mp`,
`mdf`, `mcf`. (`ls` and `yna` were never served to women in 4 runs; with random steps in play, treat that as likely, not
proven.)

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

## 9. What stage 2 should test first

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
