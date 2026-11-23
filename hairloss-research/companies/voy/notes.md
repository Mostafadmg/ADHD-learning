# Voy (formerly Manual), UK: working notes (stage 1 MAP + stage 2 EXPERIMENT + stage 3 VERIFY)

## S3. Stage 3 (VERIFY), 23 November 2026: read this first

An independent reviewer re-tested the work below. Short version: the public findings hold, a few labels were too strong, one
question was wrong, and the real quiz is still blocked.

### S3.1 What was re-tested and how it came out

- **Access.** `/n/hair-loss/quiz` and `/n/female-hair-loss/quiz`: same checkpoint (`runs/verify-base-men`, `runs/verify-base-women`).
  Web fetch: HTTP 429 on the quiz and on a product page, HTTP 403 on two help-centre articles. Not worked around.
- **Baselines** replayed fresh and matching: `runs/verify-popup-men-base`, `runs/verify-popup-women-base`, `runs/verify-widget-base`.
- **Six stage 2 experiments** replayed with the same result: `runs/verify-exp-m04`, `-m05`, `-w03`, `-w04`, `-p01`, `-p05`.
- **Pop-up scripts** re-read on the live pages (saved in `src/verify/`): men refuse Patchy and Complete, women refuse Patchy hair loss. Confirmed.
- **Engine code** re-read in `src/arquivo/manual-_app-20251229.js` itself (not the excerpt file): reject list, exclude list, parent
  question, JSON Logic show / hide. Confirmed. The same file shows the swap is only a flag plus `&swap=true` (the exchange is not in
  it) and that dutasteride appears only as experiment names.
- **Published exclusions**: archive quotes re-read word for word; the conceive / pregnant-partner sentence re-read on the live page;
  the help-centre lists repeated by a third, independent search summary.
- **Product facts**: 13 checked on pages that open, all matching except one (next section).

### S3.2 What was wrong and is now corrected

1. **"£33 struck through" is not shown to visitors.** It sits in the men's page code in an element called `text-strikethrough_test`
   and was hidden in every replay (and in `shots/03`). Removed from six product prices.
2. **The gateway question was wrong.** "What was your sex at birth?" is in the old code, but inside the general "Personal Questions"
   quiz for wellness and blood tests (store actions named `LOAD_WELLNESS_QUIZ…`), not hair loss. Removed; the gateway's first
   screen is now "wording unknown". Also: the old route list has no gateway page (the address fits `/n/[taxon]/quiz/[question]`),
   and the words "gateway" and "female-hair-loss" do not appear anywhere in the old code. Both are newer than what could be read.
3. **Labels downgraded to `inferred`:** topics men-t2 to men-t9, women-t2, women-t3; rules R5, R12, R13, R25, R31, R33; the
   product-first recommendation profile. Rule of thumb now used: `docs` on a rule means "Voy publishes this exclusion", never "the
   quiz was seen doing it".
4. R6 no longer lists the sprays; R26 no longer lists the women's vitamins.
5. Unsupported wording removed from strengths and weaknesses ("widest range of the UK players", "next-day delivery", "double to triple").

### S3.3 What was added (13 gap replays, all in `runs/verify-gap-*`, answer files in `scripts/verify/`)

| Mini-flow | Baseline | One change | What changed |
|---|---|---|---|
| **Older Manual plan picker** (`hello.manual.co/a/hl-hair-loss-minox-plans`, still online) | Tablets, 6 Months: £25 struck, £13 a month, `minoxidil_oral` 180 capsules | Tablets → Spray | Product code becomes `minoxidil_topical_10` (2 × 90 ml); same price |
| same | same | 6 Months → 3 Months | £29.67 struck, £14 a month; 90 capsules (or 1 × 90 ml); product unchanged |
| **Older Manual complete plan** (`…/a/complete-hair-loss-plan`) | 6 Months: £33.17 struck, £18 a month | → 3 Months | £39.67 struck, £21 a month; "Minimum 3 month treatment"; Continue opens the quiz either way |
| **Page for men and women** (`hairloss1.joinvoy.com/sem-mf`) | Men tab | → Women tab | Only the science cards and the doctor's name; no price or link changes. The pop-up here is the men's one |
| **Women's /meta pop-up** | (main page) | same pop-up on /meta, Patchy hair loss | Identical options and behaviour |
| **Coupon hand-over** (men's page, read from page code, nothing typed) | no code | `?coupon=SPOOKY50` | Hidden next-step link gains `?coupon=SPOOKY50`; hidden coupon field filled |
| **Product-first landing page** (`…/a/social/hair-loss-minoxidil`) | page load | none | Buttons point to `/n/hair-loss/quiz?flowType=atc` |

The plan picker is the only place where a choice was **seen** to switch a product. It is the old brand's page: treat codes and prices as
legacy. The Continue button was never pressed (it leads to add-to-basket on the blocked host).

Also new: product p16 (older Manual hair-transplant service; its landing page is now "Page not found", `runs/verify-page-transplant`).

### S3.4 How to replay stage 3

```
cd /home/user/ADHD-learning/hairloss-research/companies/voy
T=../../tools/walk.js
for x in exp-m04 exp-m05 exp-w03 exp-w04 exp-p01 exp-p05 gap-legacy-minox-base gap-legacy-minox-spray gap-legacy-minox-3m \
         gap-legacy-minox-spray-3m gap-legacy-complete-base gap-legacy-complete-3m gap-semmf-base gap-semmf-women-tab \
         gap-semmf-popup gap-wmeta-popup-patchy gap-atc-page page-aio page-fhl-sem page-fhl-meta page-transplant; do
  node $T scripts/verify/$x.json runs/verify-$x --last; sleep 3; done
(cd ../../tools && node ../companies/voy/scripts/verify/read-popup-cta.js "https://hairloss1.joinvoy.com/?coupon=SPOOKY50" ../companies/voy/runs/verify-gap-coupon-men-code)
python3 -I scripts/verify-company-s3.py        # rebuilds company.json from src/company-stage2.json + the stage 3 corrections
node ../../tools/validate.js voy --stage final
```

**`company.json` is now written by `scripts/verify-company-s3.py`** on top of the frozen stage 2 file `src/company-stage2.json`.
Do not run `build-company.py` or `build-company-s2.py` again: they would write the older maps over the corrections.
One selector trap: the 3-month tab on the complete-plan page has an id starting with a digit, so use `[id="3-months-tab"]`.

### S3.5 Still open

Everything about the real quiz (see `verification.stillUnverified` in `company.json`). The best untried lead is unchanged: the Wayback
copy of `/n/hair-loss/quiz` from 17 Aug 2026, for anyone who can reach web.archive.org. Screenshot note: `shots/08` is now the older
plan picker with Spray and 3 Months chosen; the help-centre sign-in picture it replaced is still in `src/help/`.

---


## 0. Stage 2 (EXPERIMENT), 23 November 2026: read this first

### 0.1 What happened

- **The real quiz is still blocked.** One re-test each of `/n/hair-loss/quiz`, `/n/hair-loss/quiz/gateway` and the newly found
  women's link `/n/female-hair-loss/quiz`: HTTP 429, "Failed to verify your browser, Code 21" (`runs/s2-retest-men`,
  `runs/s2-retest-gateway`, `runs/s2-probe-female-quiz`). The web-fetch tool also gets 429. Not worked around.
  **So no quiz question was seen and no one-change experiment could be run on the quiz itself.**
- **What could be replayed** (20 runs, all in `runs/s2-*`, answer files in `scripts/s2/`): the men's pop-up (6 options), the
  women's pop-up (4 options + Skip) and the men's pattern picker (6 options), one option at a time.
- **Three new sources** changed the picture; all are public and none touches the blocked host:
  1. `femalehairloss1.joinvoy.com`: Voy's public host for the **women's** landing pages (found in the public certificate log,
     crt.sh). Same Webflow set-up as `hairloss1`. Pages: `/`, `/sem`, `/meta`, `/meta-hcp`, `/shopping-oral-tablets`,
     `/shopping-serum`. Gives the women's quiz link, the women's pop-up and its script, prices, and the women's FAQ
     (strength set by clinician, "we'll remove any active you have allergies to"). Saved in `src/women/` and `src/hosts/`.
  2. **Portuguese Web Archive (arquivo.pt)** copies of older `www.manual.co` pages and scripts (`src/arquivo/`, see its README):
     - the web app's **shared script and route list of 29 Dec 2025**. The script holds the quiz **engine** (not the questions);
     - two **treatment-plan pages** (7 Jan 2025) with word-for-word "Who should not take it?" lists;
     - the hair-loss page of 12 Aug 2024 with **product data**: strengths and full prices per plan length;
     - the terms of sale (7 Jan 2025).
  3. A second, differently worded search confirmed which help-centre cautions sit under "Minoxidil" and which under
     "Finasteride / dutasteride" (stage 1 was unsure).

### 0.2 The engine, as read from the older app script (`src/arquivo/engine-excerpts.txt`)

The quiz definition is downloaded at run time (`/shop-api/frontend-product-flow/{taxon}` is named in the code; **not called**).
The shared script shows what the app does with it:

- A questionnaire lists `products` and `steps[].questions[]`. A question has `answers[{value,text,nullifying}]`, `required`,
  and optionally `rejectCondition`, `productExcludeCondition`, `parentQuestion` + `parentQuestionCondition`, attributes
  `questionShowCondition` / `questionHideCondition`, and `conditionals`.
- **Eligible products** = all listed products; if the chosen answer is in a question's `rejectCondition` (values joined by `|||`)
  → **empty list** → "You aren't eligible" screen; otherwise the product codes that `productExcludeCondition` lists for the
  chosen answer are **removed**. (Function `p` in module 35161.)
- **Follow-up questions**: shown only when the parent's answer matches `parentQuestionCondition`.
- **Show / hide / reword**: JSON Logic (`json-logic-js` is in the bundle) over all answers. Today's site still serves a flag
  called `json-logic-draft-evaluation`.
- Question types: textarea, choice, multichoice, checkbox, imagechoice, imageselect, BmiType, WeightType, datetime,
  productchoicetype.
- State in local storage `quiz`: answers, **changedAnswers**, eligibleProducts, inEligibleProducts, userPreferredProduct.
  Adding to the basket sends `consultationAnswers` and `changedAnswers` (matches the regulator's note that changed answers
  are shown to the prescriber).
- Rejection screen wording: "You aren't eligible / Based on your answers there is no treatment suitable for you. If you think
  you have made an error in your responses, please click below to review your answers." + tick box "I agree only to provide
  accurate responses" + "Review your answers".
- Flow types: `quiz`, `atc`, `categoryPage`. Product-first: `/n/hair-loss/quiz?atc=true`, with `&swap=true` when the stored
  preferred product has `shouldSwap`.
- Funnel pages (route list): `/n/[taxon]/quiz/[question]` → `/animation` → `/recommendations` (and
  `/n/hair-loss/your-recommendations`) → `/choose-format` → `/choose-frequency` → `/extra` → `/checkout/email` →
  `/checkout/quiz/questions` → `/checkout/photos/intro|take` → `/checkout/review` → `/checkout/thankyou`.
- Product slugs under `/hair-loss/`: `oral-finasteride-1mg`, `oral-minoxidil-2-5mg`, `topical-minoxidil-10`, `topical-minoxidil-5`,
  `oral-finasteride-1mg-minoxidil-2-5mg`, `topical-minoxidil-10-finasteride-01`, `oral-finasteride-1mg-topical-minoxidil-10-combo`,
  `…-5-combo`, `dutasteride-minoxidil-all-in-one-capsule`.
- Experiment names: `dutasterideProductChoiceLogic`, `hlDutasterideSoloTest`, `sixMonthRecommendationExpA/B`,
  `threeSixNineMonthsHL`, `upsellBundlePostQuestionnaireExperiment`, `sideEffectsNoticeCheckout`.

Caveat for every line above: it is the Manual app of December 2025. Same company and code base, but 11 months old.

### 0.3 Results of the replays

| Mini-flow | Baseline | One change | What changed |
|---|---|---|---|
| Men's pop-up (`hairloss1.joinvoy.com/`) | Temples & Crown | Temples, Moderate, Extensive, Patchy, Complete | Nothing visible: the email box unlocks the same way for all six. The verdict (script: Patchy / Complete → not eligible) only shows after an email is entered. |
| Women's pop-up (`femalehairloss1.joinvoy.com/`) | Widening part | Thinning temples, General thinning, Patchy hair loss, Skip | Same. Script: Patchy hair loss → not eligible. Skip closes the pop-up. |
| Pattern picker (`/a/hair-loss-tt-v3`) | Hairline & crown (94%) | At the temples 87%, Across the hairline 90%, Most of the top 95%, Thinning 63%, Top and sides 50% | Only the statistic. The button always opens `/n/hair-loss/quiz/gateway`. |

### 0.4 How to replay stage 2

```
cd /home/user/ADHD-learning/hairloss-research/companies/voy
T=../../tools/walk.js
node $T scripts/s2/popup-men-base.json   runs/s2-popup-men-base   --last   # then exp-m01 … exp-m05
node $T scripts/s2/popup-women-base.json runs/s2-popup-women-base --last   # then exp-w01 … exp-w04
node $T scripts/s2/widget-base.json      runs/s2-widget-base      --last   # then exp-p01 … exp-p05
node scripts/fetch-pages.js scripts/hosts-1.json src/hosts    # public hosts (women's pages)
python3 -I scripts/build-company-s2.py                         # STAGE 2 ONLY (writes the stage 2 map over company.json); after it, run scripts/verify-company-s3.py
node ../../tools/validate.js voy --stage rules
```

After stage 2, `company.json` was written by `scripts/build-company-s2.py` (stage 1's `build-company.py` output is frozen in
`src/company-stage1.json`). **Superseded by stage 3:** the file is now written by `scripts/verify-company-s3.py` from the frozen
`src/company-stage2.json` (see S3.4). If you ever change and re-run the stage 2 script, copy its output over
`src/company-stage2.json` and then run the stage 3 script again.

### 0.5 Leads NOT followed, and why (do not "fix" these without asking)

- `app-uk-prod-manualco.vercel.app`: the app's own server, named as the asset address in the 2024 page data. Opening the
  app there would be going round the checkpoint. Not requested.
- The quiz page scripts named in the archived route list (for example `static/chunks/pages/n/[taxon]/quiz/[question]-a453fca550b66487.js`):
  they only ever lived on the blocked hosts and the archive did not keep them.
- Any `/shop-api/…` address and the help-centre programming interface: not called by an anonymous page, so not called here.
- Other hosts in the certificate log that are plainly back-office or programming interfaces (api., backend., doctor-backend.,
  internal., devel. …): not opened. Opened, root page only: `homepage1`, `hello`, `start`, `try`, `offers` (404), `go`, `health` (404); plus the six women's pages on `femalehairloss1` and two not-found tries on `homepage1` (a blog page and a product page).
- Failed for technical reasons: Wayback Machine and archive.ph (connection closed by this machine's outbound proxy; web fetch
  refuses the site), Common Crawl index (504 / closed). **The Wayback copy of `/n/hair-loss/quiz` from 17 Aug 2026 is still the
  best lead** for whoever can reach web.archive.org: its HTML would name the current script files on `cdn.joinvoy.com/voyage/`.

### 0.6 For stage 3 (verification)

1. Re-check access once. If the quiz opens, the engine model in 0.2 tells you what to look for: per question, a reject list and an
   exclude list. Save `net/*.json`: the product-flow JSON would hold every rule at once.
2. Re-read the help-centre cautions if they become public again; rules R3 to R14 lean on them.
3. Check the women's strengths and what the serum contains (not public today).
4. Screenshots: `shots/02` and `shots/07` are now the women's pop-up; stage 1's hero and 94% pictures were dropped to stay at eight.

---

## Stage 1 notes (unchanged except where marked)


Checked on 23 November 2026. Written for the next investigator. Read `company.json` with these notes beside it.

## 1. The one thing to know first

**The real consultation could not be walked.** `www.joinvoy.com` (and `manual.co`) answer every request from this
machine with a Vercel security checkpoint: HTTP 429, page text "Failed to verify your browser, Code 21". That
happened in `walk.js`, in `curl` and in the web-fetch tool. Per the protocol it was **not** worked around.

So this map is built from other public sources. Nothing about the quiz itself is "observed". Every quiz-related
entry in `company.json` says so in its text.

Proof of the block: `runs/probe-hairloss/` (landing page), `runs/baseline-men/` (`/n/hair-loss/quiz`),
`runs/baseline-women/` (`/n/hair-loss/quiz/gateway`), and `shots/01-quiz-blocked-security-checkpoint.jpg`.

## 2. What was reachable, and how good each source is

| Source | How it was read | Trust |
|---|---|---|
| `hairloss1.joinvoy.com` — Voy's own public host for the hair-loss **landing pages** (Webflow). It appears in ordinary web-search results. `/` is the same page as `www.joinvoy.com/hair-loss`; `/a/…` and `/sem-mf` are the same as `www.joinvoy.com/hair-loss/a/…` and `/hair-loss/sem-mf`. It has no checkpoint. | Opened directly (curl and walk.js). Saved in `src/hairloss1-home.*` and `src/pages/`. | High (`observed` / `code`) |
| `hello.manual.co` — older Manual landing pages, still live (footer dated 2025). They carry **product codes and price tables** in page code. | Opened directly. Saved in `src/manual-legacy/`. | High for what Manual sold; "legacy" for Voy today |
| Feature-flag list the landing page downloads by itself (PostHog, `perun.manual.co/flags`) | Saved by walk.js; copy in `src/posthog-flags-2026-11-23.json` | High for flag **names**; the variant values are just this visitor's random draw |
| GPhC inspection reports (4 PDFs) | Downloaded; text in `src/gphc/*.txt` | High |
| Manual/Menwell's own published service evaluation (PMC11829753) | Web fetch | High |
| Voy **product pages** (`/hair-loss/treatments/*`), **women's pages** (`/female-hair-loss/*`), blog | Blocked. Read only through **web-search summaries** | Low to medium: summaries paraphrase and can mix things up |
| Voy **help centre** (`joinvoy.zendesk.com`) and old Manual help centre (`help.manual.co`) | Hair-loss articles redirect to a **sign-in page** (`src/help/`). Read only through web-search summaries | Low to medium |
| Third-party reviews (Fin vs Fin, TreatCompare, Healthcount, What People Actually Buy) | Web fetch | Background only |

All the search-summary facts are listed page by page in `src/search-evidence.json`, so they can be re-checked one
by one when someone can open the pages.

The landing-page host does **not** serve the product pages, the women's pages, the sitemap, the terms or the
guarantee page (all 404 there).

## 3. Entry points into a consultation (all from landing-page code)

| Link | Where it is used | What it is taken to be |
|---|---|---|
| `https://www.joinvoy.com/n/hair-loss/quiz` | "Take the hair quiz", "Get started" on the men's page and some landing pages | Men's questionnaire |
| `https://www.joinvoy.com/n/hair-loss/quiz/gateway` | Most ad landing pages, the men-and-women page (`/hair-loss/sem-mf`), and the pop-up's "eligible" button | Generic questionnaire that sorts the visitor first (inferred from the flag name `…exp_SEM-Questionnaire-Generic-vs-Male`, which swaps buttons between this link and the one above) |
| `https://www.joinvoy.com/n/hair-loss/quiz?flowType=atc` | Minoxidil social landing page | Product-first ("add to cart") route |
| any of the above `?coupon=CODE` | Pop-up and promo pages (for example `SPOOKY50`, `FLASH60`) | Same flow with a discount attached |
| `https://www.joinvoy.com/n/female-hair-loss/quiz` (+ `?coupon=50OFFBF`) | Every button on the women's pages (found in stage 2 on `femalehairloss1.joinvoy.com`) | Women's questionnaire |
| Legacy: `https://www.manual.co/n/hair-loss/quiz/` and `https://www.manual.co/add-to-cart?productCode=…&variantCode=…&coupon=…` | Older Manual pages | Same two ideas under the old brand |

## 4. Where the "quiz definition" lives

The real quiz definition was **not found**: it is inside the blocked Next.js app at `/n/hair-loss/quiz`.
Hints about it from public code:

- A flag named `json-logic-draft-evaluation` suggests the rules are written as JSON Logic and evaluated by the app.
- Flags `exp-628-exp-hair-loss-assessment-page`, `acq-1464-exp-shared-uk-assessment`, `exp-665-hl-topical-education`,
  `exp-950-exp-add-animation-to-recommendation` (there is a recommendation screen), `acq-1366-exp-otp-login-quiz`
  (sign-in by one-time passcode inside the quiz), `acq-1612-ff-onfido-check` (ID check, off on the day),
  `plan-page-redesign`, `acquisition-flow-master-flag`.
- Assets for the app are served from `cdn.joinvoy.com/voyage/…` (the app is probably called "voyage"). Chunk names are
  not known without the blocked HTML, and guessing them is not allowed.

What **was** saved as `quiz-definition.json` is the only question-and-branch logic Voy serves in the open:

1. **The landing-page pop-up** (opens by itself after 20 seconds on ten landing pages): one picture question,
   "Which image best matches your hair loss?" with Temples · Temples & Crown · Moderate · Extensive · Patchy · Complete,
   then an email box and "Check if I qualify". The page script shows **Patchy or Complete → "You aren't eligible. Based on
   your answers there is no treatment suitable for you"**; anything else → "Take the next step to treatment" → the quiz
   gateway with the coupon. The script is copied word for word in the file.
2. **The pattern picker** on `/hair-loss/a/hair-loss-tt-v3`: six patterns, each showing a success statistic (87%, 90%,
   94%, 95%, 63%, 50%). Marketing only.
3. Older Manual **product codes** and **price tables**.

## 5. How to replay

```
cd /home/user/ADHD-learning/hairloss-research/companies/voy
T=/home/user/ADHD-learning/hairloss-research/tools/walk.js

node $T baseline-men.json   runs/baseline-men   --last   # stops at the checkpoint today
node $T baseline-women.json runs/baseline-women --last   # same

node $T scripts/walk-landing-popup.json  runs/landing-popup  --from 1   # pop-up: question + options (works)
node $T scripts/walk-pattern-widget.json runs/pattern-widget --last     # pattern picker (works; the pop-up covers it after 20 s)
node $T scripts/walk-landing-cards.json  runs/landing-cards  --last     # plan cards with "from" prices

node scripts/fetch-pages.js scripts/help-1.json src/help    # shows the help-centre sign-in wall
python3 -I scripts/build-company.py                          # STAGE 1 ONLY: writes the stage-1 map over company.json. After stage 2 run scripts/build-company-s2.py instead (see 0.4)
node ../../tools/validate.js voy --stage map
```

`baseline-men.json` and `baseline-women.json` have **no steps yet** because no screen could be reached. Each holds the
baseline patient in `_baselinePatient`. When the checkpoint lets the browser in, add one step per screen.

The pop-up walk never types an email and never presses "Check if I qualify". Keep it that way.

`company.json` is generated: since stage 3, edit `scripts/verify-company-s3.py` (it builds on the frozen `src/company-stage2.json`), not the JSON.

## 6. Products in one view (detail and sources are in `company.json`)

Men: finasteride 1 mg tablets (licensed) · minoxidil **10%** spray, once a day (unlicensed strength) · oral minoxidil ·
All-in-One capsule = finasteride 1 mg + minoxidil 2.5 mg + biotin 10 mg (unlicensed special) · dutasteride + minoxidil
capsule (strengths unknown) · Complete plan (tablet + spray) · All-in-One plan (capsule + spray) · All-in-One spray
(topical finasteride + minoxidil 10% + azelaic acid 5%; seen on older Manual pages, probably still sold) · Power Shampoo ·
Hair Vitamins.

Women: topical minoxidil "serum" plan · oral minoxidil plan · Hair Vitamins. No DHT blocker or spironolactone found.

Prices: landing pages only show first-order "from" prices on a 6-month plan (£13 finasteride, £14 minoxidil, £19
combined), each with "£33" struck through, and a Black Friday banner (16–30 Nov 2026: "50% off hair loss plans. Free
shampoo with every plan."). The fuller grid for the combined plan (monthly £44, 3-month £39.67 a month = £119, 6-month
£33.17 a month) comes from a search summary of the Voy plan page and matches the older Manual page code
(`PLAN_PRICES` in `src/manual-legacy/a_complete-hair-loss-plan.html`). Older Manual code gives £29.67 (3-month) and £25
(6-month) a month for minoxidil tablets or spray.

Voy avoids medicine names on ad landing pages: the jars are labelled "Hair Oral Treatment" and "Hair Treatment Spray",
and the text says "DHT blockers" (see `shots/03-…`). That fits the regulator's complaint about advertising
prescription-only medicines.

## 7. Dead ends (so nobody repeats them)

- `www.joinvoy.com/*`, `joinvoy.com/*`, `www.manual.co/*`, `manual.co/*`: checkpoint, every path tried.
- `hairloss1.joinvoy.com`: only `/`, `/a/…`, `/sem-mf`, `/sem-mf-ext` exist. `/treatments/*`, `/guarantee`,
  `/terms-of-sale`, `/p-s`, `/female-hair-loss`, `/sitemap.xml` are 404. `voy-hairloss.webflow.io` is the same single site.
- `hello.manual.co`: only some `/a/…` pages exist.
- Help centres: every hair-loss article and section goes to sign-in. The public part has one article ("How can I get
  in touch with Voy?"). The help-centre search returns nothing for "hair" when signed out.
- Wayback Machine: copies exist (`/n/hair-loss/quiz` 2026-08-17 17:25:54, `/hair-loss` 2026-08-25, `/female-hair-loss`
  2026-08-17) but `web.archive.org` resets the connection or returns 502 from this machine, in curl, in the browser and
  in the web-fetch tool. `archive.ph` and the Common Crawl index were also unreachable. **If you can reach
  web.archive.org from somewhere else, the 17 August 2026 quiz copy is the best lead in this whole file**: it may hold
  the first screen, the page data and the script file names.
- Reviews and forums: none found that list the quiz questions.

## 8. What stage 2 should try first

1. **Re-test access once** with `baseline-men.json`. If the checkpoint is gone, do the full baseline walk for
   `/n/hair-loss/quiz`, then `/n/hair-loss/quiz/gateway` (expect a sorting question first), then `?flowType=atc`.
   Save `net/*.json` and `storage.json`: with a JSON Logic engine the whole rule set may arrive as one JSON file.
2. If still blocked, try the Wayback copy from a machine that can reach it, and re-read the help-centre articles
   listed in `src/search-evidence.json` if they have been made public again.
3. One-change experiments, in this order, because Voy's published cautions say each should change the offer:
   - hair pattern: Patchy, Complete (expect a stop, as in the pop-up); then Temples vs Extensive (does the default plan change?)
   - age: 17, 18, 66 (cautions say minoxidil is not for under 18 or over 65)
   - trying to conceive / partner pregnant (expect DHT blockers removed, minoxidil-only left)
   - prostate enlargement, or already on finasteride or dutasteride
   - breast or prostate cancer, gynaecomastia
   - severe depression or suicidal thoughts
   - low blood pressure; heart conditions (expect oral minoxidil removed)
   - sore, red or flaky scalp (expect sprays removed)
   - format preference: tablet vs spray vs both (which of the "30+ combinations" appear?)
   - what makes **dutasteride** appear instead of finasteride (previous finasteride use? no response?)
   - women: pregnant, breastfeeding, trying to conceive, heart or blood pressure condition, menopause
4. Check whether the recommendation and the prices are shown **before** the sign-in step, and whether the plan-length
   choice (1, 3, 6 months) changes anything other than price.
5. Be aware: the 2023 inspection report says the system **records when a patient changes an answer** and shows it to the
   prescriber. That applies to submitted consultations, which we never do, but it explains how Voy treats answer-flipping.

## 9. Regulatory background (useful for the final report)

- Owner: Menwell Limited. Pharmacy: Voy Pharmacy, Unit 12 Verda Park, Wallingford (GPhC premises 9012909). Site footer
  names superintendent pharmacist Dawn Neil and "GPhC Registration: 2063362". The prescribing service is separate and
  regulated by the CQC (provider 1-7337623585).
- GPhC inspections of 9012909: 24 Mar 2026 standards not all met (prescribing service does not independently verify
  what people tell it); 11 Aug 2026 standards not all met with statutory enforcement (verification for weight-loss
  treatments, unlawful advertising of prescription-only medicines, first-month discount on a weight-loss medicine;
  detailed clinical checks on only a sample); 13 Oct 2026 re-inspection: standards met. Texts in `src/gphc/`.
- GPhC inspection of the earlier Manual Pharmacy (9012134), 13 Nov 2023: hair loss graded "low risk"; questionnaire
  answers that suggest treatment may be unsuitable are highlighted; changed answers are visible; identity checked from
  the bank card; finasteride 1 mg tablets taken out of blisters and repacked in Manual-branded packs; certificates of
  conformity kept for unlicensed medicines; talks about off-label and unlicensed risks were not recorded.
- Prescribers named on the landing page: Dr Earim Chaudry (Chief Medical Officer), Eve Agwuncha, Bentley Ifediora-Ezike
  and Michael Sam-Yorke (pharmacist independent prescribers); women's content by Dr Sarah Bechstein.

## 10. Files

- `company.json` — the map and rules (after stage 3: 16 products, 9 flows, 38 rules, 48 experiments, with a `verification` block; passes `validate.js voy --stage final`).
- `quiz-definition.json` — pop-up and pattern-picker logic copied from page code, entry links, flag names, legacy codes and prices.
- `baseline-men.json`, `baseline-women.json` — replay files (empty steps; blocked).
- `runs/` — every walk (`verify-*` = stage 3). `shots/` — 8 key screenshots. `src/verify/` — live pages saved in stage 3. `scripts/verify/` — stage 3 answer files; `scripts/verify-company-s3.py` — stage 3 corrections.
- `src/hairloss1-home.*`, `src/pages/` — Voy landing pages (HTML and text). `src/manual-legacy/` — older Manual pages.
- `src/help/` — proof of the help-centre sign-in wall. `src/gphc/` — inspection reports.
- `src/posthog-flags-2026-11-23.json` — feature-flag list. `src/search-evidence.json` — every fact taken from a search summary.
- `scripts/` — helpers (`build-company.py` = stage 1, `build-company-s2.py` = stage 2, `fetch-pages.js`, `html2text.py`, `distinct.py`, walk files; `scripts/s2/` = stage 2 answer files).
- `src/women/`, `src/hosts/` — women's landing pages and other public hosts (stage 2). `src/arquivo/` — archive copies of older Manual pages and app script (stage 2).
- `src/company-stage1.json` — frozen stage 1 output that the stage 2 script builds on.
