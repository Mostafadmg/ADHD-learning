# Hers (US): working notes, stage 1 (MAP)

Checked on 23 November 2026. Written for the next investigator. `company.json` is the tidy result.

## 1. The short version

- **The Hers site could not be opened from this machine.** `www.forhers.com` answers with a Cloudflare security
  checkpoint (HTTP 403, "Performing security verification"). It was still there after a 10 second wait. Per protocol it
  was **not** defeated. So there is **no live walk, no site code, no quiz definition and no screenshots of the quiz**.
- The likely reason is the network, not the tool: the proxy log on this machine shows
  `brunhild.challenges.cloudflare.com` as unreachable, so the checkpoint can never finish here.
- Everything in `company.json` is therefore **`docs`** (Hers's own pages as returned by a web search index, plus
  third-party reviews dated 2023 to Nov 2026) or **`inferred`**. Nothing is `observed` on Hers. Question wording is
  **not verbatim**; most option lists are missing; no answer-to-product rule is tested.
- What is solid enough to use: the product range (15 items), headline prices (with conflicts flagged), the outline of
  the journey (quiz -> account -> one or two recommended products, swappable -> medical intake -> provider review ->
  subscription), and three documented safety rules (finasteride only after menopause; oral minoxidil and
  spironolactone not in pregnancy / breastfeeding / planning a pregnancy; heart, kidney, liver and blood pressure
  cautions for oral minoxidil).

## 2. What was tried (in order)

| Run / action | Result |
|---|---|
| `runs/probe-home` (walk.js, `baseline-women.json`, en-US, 10 s wait) | HTTP 403 Cloudflare checkpoint on `https://www.forhers.com/hair-loss`. Screenshot: `shots/01-forhers-cloudflare-checkpoint.jpg`. |
| WebFetch tool on forhers.com | 403 as well (it runs from this same machine). |
| curl `www.forhers.com/robots.txt` | 200. Content: `Sitemap: https://www.forhers.com/sitemap.xml`, `Disallow: /~partytown/`. |
| curl `sitemap.xml`, `sitemap.html`, `/hair-loss/spironolactone`, `/treatment/hair-loss/spironolactone` (once each) | 403 checkpoint. Stopped. |
| `runs/probe-hims` (walk.js on `https://www.hims.com/hair-loss`) | Loads (200). Sister brand page. Quiz links there: `Get started -> /c/hl/goals`, `See if treatment is right for me -> /c/hl`, `Find my treatment -> /c/hl`. Full link list in `runs/probe-hims/02.txt`. |
| `runs/probe-hims-quiz` (walk.js on `https://www.hims.com/c/hl`) | HTML shell loads (200) but the page stays on a spinner. `shots/02-...jpg`. |
| `runs/grab-hims-c-hl` (`scripts/grab.js`, read-only, one page) | Shows why: **every** site code bundle (`hims.us.modern.*.js`) is refused with 403. `requests.jsonl` lists them. One is named `hims.us.modern.domains-consultation-hair-loss.<hash>.js`: the hair quiz lives in a code chunk with that name. |
| web.archive.org (curl and WebFetch) | Unreachable from here (connection closed, one 429). |
| Common Crawl index | `collinfo.json` loaded once (newest index `CC-MAIN-2026-47`), then every query was reset by the proxy. |
| `support.forhers.com` | Does not resolve from this machine. Help centre not read. |
| Web search (about 20 queries) and WebFetch of third-party reviews | The source of everything in `company.json`. |

Replays used: 3 walk.js runs and 2 read-only page grabs (the first grab used the default headless browser identity and
got a 403 on hims.com, the second used the same identity as walk.js). No forhers.com browser attempt was repeated.

## 3. Where the quiz definition probably lives (not fetched)

- Hims and Hers run on one platform. On hims.com the quiz is a single-page app under `/c/hl` whose code is split into
  bundles named `<brand>.<market>.modern.<chunk>.<hash>.js`, served from the site root. The hair quiz chunk is
  `hims.us.modern.domains-consultation-hair-loss.<hash>.js`.
- So on Hers the question set is very likely in `https://www.forhers.com/hers.us.modern.domains-consultation-hair-loss.<hash>.js`
  (name **inferred**; the hash is unknown and must be read from the page, not guessed).
- The Hims UK investigator found the same family of chunks on the old UK site
  (`../hims-uk/raw/www-js/hims.modern.client-domains-consultation-acquisition-hair-loss.*.js`, plus
  `application-preference-oral-topical-component`, `assessment-disqualification-component`,
  `...treatment-select-treatment-recommended`). Those are UK men's code and say nothing certain about Hers US, but they
  show the pattern: questions, a disqualification screen and a "recommended treatment" step are all in served code.
- No `quiz-definition.*` file was saved because nothing was found. Do not create one from guesses.

## 4. Entry points found (none opened)

From the search index (all on `www.forhers.com`): `/hair-loss` (main), `/hair` , `/hair-blends`, `/lp/hair-start-hair-loss`,
promo pages `/autym`, `/COLDCASE`, `/Ella`, `/DWKT` (same title "Thicker, fuller hair"), product pages
`/hair-loss/oral-minoxidil` (variants `?geo_code=XX`, `/_gb/e30`, `?preview=abcg` on `/hair-loss`), `/hair-loss/spironolactone`,
`/hair-loss/minoxidil-biotin-chew`, `/hair-loss/minoxidil-hair-vitamin`, `/hair-loss/blends-postmeno-serum`,
`/hair-loss/minoxidil-women`, `/hair-loss/minoxidil-women-otp`, `/hair-loss/minoxidil-otp`, `/hair-care`, `/hair-care/hair-mask`.
Information pages: `/treatment/hair-loss/spironolactone` (patient information with an exclusion list), `/drugs/info/minoxidil`,
`/conditions/hair-loss`, `/conditions/menopause-hair-loss`, `/conditions/perimenopause-hair-loss`, `/promotions/terms`.
Probable quiz address: `/c/hl` and `/c/hl/goals` (inferred from hims.com).

A host called `internal.forhers.com` also shows up in search results with copies of the same pages. It was **not**
opened: using a second hostname to get round the checkpoint is not within the rules.

## 5. Product notes and conflicts to settle

- **Spray or serum for postmenopausal women?** Reviews from 2023 to Nov 2026 describe a *spray* (finasteride 0.3% +
  minoxidil 6%, $39 a month, or "from $50 a month billed every 3 months" per NCOA Nov 2026). Hers's own pages name a
  *Hair Blends Postmeno Serum* (from $35 a month). One Hers page names both. Listed as p6 and p7.
- **Spironolactone (p8):** a product URL and a patient information URL exist; strength and price were not readable.
  Two review sites say about $30 a month; one says 100 mg. Unconfirmed.
- **Prescription prices:** Hers pages say "from $35 a month" for the blends; older reviews say $39. Plan-length prices
  (3, 6, 12 months) were not found anywhere.
- **Minoxidil 2% one-time price:** $30 (Hers page via search) or $45 (reviews).
- **Strengths of the oral blends** (chew, gummy, Hair Vitamins + Minoxidil) are not published on any page found.
- **Latisse** (bimatoprost, eyelashes) was sold by Hers in 2023 (Innerbody). Left out: not a scalp hair-loss product and
  not confirmed for 2026.
- A **$5 processing fee** per order was reported in 2023 (Innerbody). Not confirmed for 2026.
- **Subscription terms** (third-party summaries of the terms plus Hers's promotions terms): renews automatically unless
  cancelled at least 2 days before the renewal processing date; no refunds for part-used periods except case by case;
  cancel in the account or app, in some states through support. Prescription products are subscription only.
- **Men:** Hers is women only. Men's hair products are on the sister brand Hims. For reference, the live Hims page
  linked: `/hair-loss/finasteride-minoxidil-supplement-pill`, `/hair-loss-finasteride-minox-chew`, `/hair-loss/topical-finasteride`,
  `/hair-loss/hair-loss-spray`, `/hair-loss/serum`, `/hair-loss/minox-chew`, `/hair-loss/finasteride`, `/hair-loss/hair-power-pack`,
  `/hair-loss/minoxidil-foam`, `/hair-loss/minoxidil` (see `runs/probe-hims/02.txt`). Not catalogued here.

## 6. Quiz outline (reported by reviewers, not seen)

1. Free hair quiz, "highly visual", several questions, about 10 to 15 minutes: hair goals (reduce shedding, regrow,
   thickness and fullness, overall hair health), type of thinning or symptoms, pick-the-photo hair density, gradual or
   sudden, hair type, washing frequency, whether you want vitamins with your treatment (2023).
2. Create an account to see results (Innerbody 2023).
3. One or two recommended products (NCOA Nov 2026); keep or swap (Innerbody 2023). Prescription only: the quiz no
   longer recommends over-the-counter products (Innerbody 2023).
4. Medical intake: pregnancy and breastfeeding, hysterectomy, pre- or post-menopausal, medical conditions (including
   cardiovascular), current medicines. A 2023 review lists these inside the quiz before the account step; a June 2026
   article says the quiz "isn't the official medical evaluation" and puts the medical history in a later formal intake.
   Photos of hair and a valid ID for some prescription treatments.
5. A licensed provider in the patient's state reviews; no payment details until a treatment is selected (2023).

## 7. What stage 2 should do first

1. **Check whether the site opens now** with `node ../../tools/walk.js baseline-women.json runs/<id>`. If the
   checkpoint is still there, the experiments cannot be run from this machine; say so and stop. Do not try to get round it.
2. If it opens: read the `/hair-loss` page links for the real quiz address (expect `/c/hl`), walk it with the baseline
   woman, record every screen word for word and replace the paraphrased questions in `company.json`.
3. Save the code chunk `hers.us.modern.domains-consultation-hair-loss.<hash>.js` (take the exact URL from the page's
   own requests) as `quiz-definition.js` and extract every question, option and branch, including the disqualification
   screen and the recommended-treatment step.
4. Priority one-change tests: postmenopausal vs not (finasteride products p6, p7) · pregnant / breastfeeding / planning a
   pregnancy · hysterectomy · "want vitamins" yes or no (p1 vs p2, p3, p4) · heart, blood pressure, kidney or liver
   condition (oral minoxidil) · sudden or patchy loss · entry from a product page (`/hair-loss/oral-minoxidil`,
   `/hair-loss/spironolactone`) vs the main page.
5. Read `sitemap.xml`, `/treatment/hair-loss/spironolactone` (exclusion list) and the other `/treatment/hair-loss/*`
   pages, and the help centre.
6. Settle the conflicts in section 5.

## 8. Files

| File | What it is |
|---|---|
| `company.json` | The result (15 products, 1 flow, 17 reported steps). Built by `scripts/build_company.py`; edit one or the other, not both. |
| `baseline-women.json` | Opens the entry page; ends at the checkpoint today. Add quiz clicks once the site opens. |
| `probe-hims.json`, `probe-hims-quiz.json` | The two sister-site probes. |
| `scripts/grab.js` | Read-only: opens one page and logs what it requests. |
| `runs/` | `probe-home`, `probe-hims`, `probe-hims-quiz`, `grab-hims-c-hl`. |
| `shots/` | Checkpoint, sister-site spinner, sister-site hair page. |

---

# Stage 2 (EXPERIMENT) log, 23 November 2026

- 22:1x UTC. Re-tested access with `baseline-women.json` (10 s wait): still the Cloudflare checkpoint (HTTP 403).
  Proof: `runs/s2-retest-home`. Not defeated. **No live experiment is possible from this machine.**
- The shared Hims & Hers help centre **does** open: `https://support.hims.com/hc/en-us` ("written by Hims & Hers Health").
  Read with walk.js, read-only (`help-centre-walk.json`, `runs/s2-help-centre`). Saved in `raw/help/`:
  spironolactone, oral minoxidil, minoxidil + supplements (chew / gummy / tablet), compounded topical combination,
  "How does this work?", "Do I need a prescription?" (four of these copied from the Hims US investigator's folder).
  These give documented contraindications (label `docs`), not quiz behaviour.

## Stage 2 result in one paragraph

No live experiment was possible: the checkpoint is still up, so **0 one-change replays** were run and **no rule is
`observed`**. Stage 2 instead (a) read the shared help centre directly, (b) ran about 20 more web searches and 10 page
reads of third-party reviews, and (c) wrote 18 rules, 8 recommendation profiles and per-option effects into
`company.json`, every one labelled `docs` or `inferred`. Replays used: 2 walk.js runs (`runs/s2-retest-home`,
`runs/s2-help-centre`). Validator: `node ../../tools/validate.js hers-us --stage rules` passes (3 warnings: three
questions whose option lists are still unknown).

## What the documents give (the basis of the rules)

Opened directly (help centre, `raw/help/*.txt`, quotes are word for word):

- **Oral minoxidil tablets:** "Patients who are pregnant or are planning to become pregnant should not take minoxidil.
  Do not breastfeed while taking minoxidil tablets." Contraindicated with pheochromocytoma. "Tell your provider if you
  have had a recent heart attack or history of heart conditions". Boxed-style warning about heart-related side effects.
- **Minoxidil + Supplements (chew, gummy, tablet; code FPG-BOE-MINOXBIOTIN-PIB-OH03):** may contain minoxidil, biotin,
  vitamins B5, B6, C, zinc sulfate. "Do not take Minoxidil if you are pregnant or breastfeeding." "Do not take this
  compounded tablet if you are taking other medications or supplements that include Zinc."
- **Compounded Topical Combination (BPG-TFM-SRMSPRY-PIB-OH02):** minoxidil, finasteride, ketoconazole, biotin,
  dexpanthenol. "This compounded medication contains finasteride, which is contraindicated in females of childbearing
  potential. Women who are planning to get pregnant, are pregnant, or are breast-feeding should avoid contact with
  finasteride."
- **Spironolactone:** once or twice daily; "Common doses of spironolactone are 50mg up to 200mg daily". "Do not use it if
  you have had an allergic reaction to spironolactone, if you have high potassium levels, or if you have Addison's
  disease." Interactions named: acetylsalicylic acid, cholestyramine, cisplatin, digoxin, heparin, lithium, trimethoprim,
  NSAIDs, steroids, blood pressure medicines.
- **How does this work? (updated 18 Jun 2026):** intake form -> provider; "In some states, a video visit with a healthcare
  provider is required... you will be prompted to schedule a video visit after submitting your online intake form."
- **Do I need a prescription?:** non-prescription products "do not necessitate a medical consultation"; they can be
  sold in a kit with a prescription product after a consultation.

Read only as search-index summaries of Hers pages (not word for word; re-check if the site ever opens):

- `/hair-loss/oral-minoxidil`: "We do not offer oral minoxidil treatment for other hair disorders (eg, telogen effluvium
  or alopecia areata)" (returned twice with the same wording); not recommended to use topical and oral minoxidil together.
- `/hair-loss/minoxidil-hair-vitamin`: not for under 18s, minoxidil allergy, pregnancy, breastfeeding; may not suit heart,
  kidney or liver disease, pheochromocytoma, blood pressure problems.
- `/treatment/hair-loss/spironolactone` (title "Provided by You Health for patients"): not a candidate if taking
  eplerenone, cholestyramine, aspirin, potassium supplements, ACE inhibitors, angiotensin receptor blockers, heparin,
  lithium, digoxin; a conditions list follows (not returned); told to see a provider in person; lists warning signs of
  high potassium.
- `/conditions/perimenopause-hair-loss` and blog `best-hair-loss-treatment-for-women`: finasteride only for women past
  menopause; a finasteride-minoxidil combination "for those who qualify".
- `/hair-loss` FAQ: most oral treatments not for pregnancy or breastfeeding; some topical solutions possible while
  breastfeeding.
- New product URL: `/hair-loss/blends-solutions` (Hair Blends Serum).

Reviewers (none gives question wording): Innerbody Dec 2023 lists the health topics in the quiz (pregnancy and
breastfeeding, hysterectomy, pre- or post-menopausal, medical conditions, "whether or not you want vitamins with your
potential treatment", medicines) and the account wall before results. NCOA 3 Nov 2026: 10 to 15 minutes, ends with one
or two products, hard to browse without the assessment; spray "$50/month, billed every 3 months". Healthline 19 Nov 2026:
government ID and a card needed (platform in general). AOL 7 Jun 2026: quiz is "not the official medical evaluation";
photos and ID for certain treatments. Fortune 1 Aug 2026: sudden, patchy or severe loss -> see a provider.

Trap avoided: a search summary attributed an image caption ("how much hair you lose each day, with five images of
strands") to Hers. On the NCOA page that caption belongs to **Ro's** assessment, not Hers. Not used.

## Dead ends at stage 2

- `support.forhers.com`: proxy 502, not reachable. `support.hims.com` by curl: 403; in the walk.js browser: 200.
- WebFetch 403 on: forhers.com (any page), businesswire.com (2022 launch release), theeverymom.com.
- No Reddit thread, video transcript or blog with the quiz's wording was found by search.
- Help-centre searches ("hers hair", "women hair loss quiz") return only drug information, nothing about the quiz.

## If the site opens for a later investigator

1. Run `node ../../tools/walk.js baseline-women.json runs/<id>`; if it loads, find the quiz link (expect `/c/hl`).
2. Save the quiz code chunk and replace the paraphrased questions; then test, in this order: menopause status, pregnancy /
   breastfeeding / planning, hysterectomy, vitamins yes/no, sudden vs gradual, each medical condition, age under 18.
3. Each rule in `company.json` says "Not tested" in its proof: replace with a run folder and change evidence to `observed`.

## Files added at stage 2

`scripts/stage2_rules.py` (applies the stage 2 content to `company.json`; run it after `scripts/build_company.py`, safe
to re-run) · `help-centre-walk.json` · `runs/s2-retest-home`, `runs/s2-help-centre` · `raw/help/*.txt` ·
`shots/04-…`, `shots/05-…`.

---

# Stage 3 (VERIFY) log, 23 November 2026

Independent review. Interim notes first (saved early in case of interruption); the tidy result is the `verification`
block in `company.json`, written by `scripts/stage3_verify.py`.

- `runs/verify-baseline`: baseline replayed fresh (10 s wait). Still the Cloudflare checkpoint, HTTP 403. Matches the record.
- `runs/verify-help`: six help-centre articles re-read. All 18 quoted sentences used by the rules are there word for word.
- `runs/verify-help2`: "Where is Hims & Hers available?" (updated 28 Oct 2026: all 50 states, some treatments limited by
  state, not Puerto Rico) and four on-site help searches (ID article exists only for testosterone; no age article; the
  spironolactone leaflet is still listed; nothing about the hair quiz).
- `runs/verify-hims-hers-pages`: hims.com does **not** serve Hers hair pages (`/hair-loss/spironolactone`,
  `/treatment/hair-loss/spironolactone`, `/hair-loss/oral-minoxidil` all 404).
- Web search: only 3 searches ran before the shared search budget for this session was used up. No more were possible.
- Third-party pages re-read with the fetch tool: Innerbody, NCOA (two pages), finvsfin, Fortune, AOL / NY Post,
  Healthline, top10.com, Hello! Magazine.

## Stage 3 result in one paragraph

The site is still blocked, so stage 3 could not replay anything: **still 0 one-change replays and nothing `observed`**.
The review therefore checked the paperwork. The help-centre leaflets behind the main safety rules were re-read and
every quoted sentence is exact. Nine third-party pages were re-read with the fetch tool. Three web searches ran before
the shared search budget ran out. Replays used: 4 walk.js runs (`runs/verify-baseline`, `runs/verify-help`,
`runs/verify-help2`, `runs/verify-hims-hers-pages`). Validator: `node ../../tools/validate.js hers-us --stage final`
passes (3 warnings: three questions with no option list).

## What stage 3 found wrong or shaky (all fixed in `company.json`)

1. **Spironolactone is probably not in the hair range any more.** No review lists it (Innerbody 2023, Hello! partner
   article May 2025, top10 Aug 2025, NCOA Oct 2026) and finvsfin (Aug 2026) says a rival offers spironolactone "that Hers
   does not". The product URL and a help-centre leaflet still exist. Marked "status uncertain", label `inferred`, the
   unsourced "$30 a month" dropped, removed from the baseline woman's offered list.
2. **The Fortune review was misused.** It reviews only the over-the-counter 2% solution ($45). Its lines about sudden,
   patchy or severe loss, heart disease and blood pressure medicine are the reviewer's advice about that product, not
   Hers policy on tablets. Removed as proof from R7 and R11.
3. **The "no oral minoxidil for telogen effluvium or alopecia areata" sentence** was found by the search engine only on
   `internal.forhers.com` (a non-public copy, not opened), not on the public page. R11 is now low confidence.
4. **The spironolactone "not a candidate" medicines list (R8) could not be reproduced.** Low confidence. A sister page
   was found instead: `/treatment/hair-loss/oral-minoxidil` ("Provided by You Health for patients"), summarised as: not
   eligible through the platform if under 18, with pheochromocytoma, or already using minoxidil products; go to in-person
   care. That page is the best lead for exact exclusion lists if the site ever opens.
5. **Labels.** `docs` had been used for things only reviewers say. Now `docs` = Hers, its help centre or a Hims & Hers
   partner article; reviewer-only items are `inferred` with the source named. 12 questions, 4 options, 3 products, 1 rule
   and 2 recommendation profiles were lowered.
6. **Three questions have no traceable source** (gradual or sudden, hair type, washing frequency). Marked UNVERIFIED.
7. **Prices.** finvsfin gives no price for the spray (the $39 is 2023 only); Triple Threat is $38 for a shampoo 2-pack and
   $47 for a conditioner 2-pack, not "$38 for the pair"; the 2% solution is $45 in three reviews (the $30 was not
   confirmed); the blends are $35 (top10, Aug 2025) or $39 (Innerbody 2023, finvsfin Aug 2026): not settled.
8. **Strengths.** 6% / 0.3% are confirmed only for the spray, not for the Postmeno Serum. Innerbody (2023) gives 1.25 mg or
   2.5 mg minoxidil for the chew and the vitamin pill.

## New at stage 3

- **Code hint** (`codeHints` in `company.json`): `runs/grab-hims-c-hl/page.html` (the page hims.com serves on `/c/hl`)
  holds `window.PROPS` with a list of old experiments, 46 of them about Hers hair (2021 to June 2024): name, date and
  traffic split, no content. Examples: `hersHairOralMinoxidil` (Sep 2022, on for all), `hersHairRxOTCRecco` and
  `hersHairOTCAddOn` (off), `hersHairStepsPreReg` (Dec 2023), `hersHairSignUpDec23`, `hersHairRemoveTreatmentPricing`,
  `hersHairTeaseCompounds`, `hersBlockPrepaidHair`. Hints only; no rule rests on them. To list them:
  `grep -o '"hersHair[A-Za-z0-9]*":{"publishedAt":"[^"]*"' runs/grab-hims-c-hl/page.html`.
- **Rule R19** (docs): all 50 states, not Puerto Rico, "specific treatments may be limited to certain states" (help centre,
  updated 28 Oct 2026).
- **hims.com does not serve Hers pages** (three addresses, all 404). Its footer links to forhers.com.
- Help-centre searches: the only ID article is about testosterone; nothing on age; nothing on the hair quiz.

## Caveats for the next reader

- Review quotes were re-read through a fetch tool that summarises pages: near word for word, not guaranteed exact.
  Help-centre quotes were checked against saved page text and are exact.
- `company.json` is now built by three scripts in order: `scripts/build_company.py`, `scripts/stage2_rules.py`,
  `scripts/stage3_verify.py` (safe to re-run; it sets values and appends each sentence once).
- Not opened on purpose: `internal.forhers.com` (a second hostname would be a way round the checkpoint).
- Seen in the 2023 review only and left out of the catalogue: Complete Hair Kit ($55), Weekender Kit ($40), collagen
  powder ($27), Latisse.
- Files added: `verify-help-walk.json`, `verify-help2-walk.json`, `verify-hims-hers-pages.json`, `runs/verify-*`,
  `shots/06-…`, `shots/07-…`, `shots/08-…`, `scripts/stage3_verify.py`.
