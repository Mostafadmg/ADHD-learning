# Hims US (hims.com) and Hers US (forhers.com): working notes, stage 1 (MAP)

Checked on 23 November 2026 (about 21:50 to 23:00 UTC). Written for the next investigator.
Read `company.json` for the tidy result. Read section 2 first: it explains why this map is thinner than the others.

## 1. The short version

- **The real consultation could not be opened.** `https://www.hims.com/c/hl` (and `/c/hl/goals`) returns the page, but
  Cloudflare refuses the site's own script files with a security challenge, so the quiz never leaves the loading spinner.
  No question, option, branch, recommendation screen, plan price or account wall of the men's consultation was seen.
- **Hers US (women) could not be opened at all.** `forhers.com` shows "Performing security verification" on every page.
- **What did work:** all hims.com product, landing, safety and help-centre pages are server-rendered and load normally.
  So the **product catalogue is solid** (19 Hims products with ingredients, strengths and public prices, plus 2 known only
  from help-centre drug sheets), the **entry points are mapped**, and the **published exclusion lists** ("who should not
  take") are captured as docs-level rules.
- **One small quiz was walked live:** a three-question "pre-quiz" on the advertising landing page
  `/lp/hair-start-top-fin-fa`. It is marketing only. Its definition is in the page data and has no branch.
- **The men's question list in `company.json` is a skeleton of topics, not real screens.** Each entry starts with
  "[Exact wording not seen ...]". Topics come from two Hims blog posts and from field names in the page's embedded state.
  Order, wording, options and the account-wall position are unknown. Do not quote them as questions.

## 2. The blocker, exactly

| What | Result | Proof |
|---|---|---|
| `GET https://www.hims.com/c/hl` (document) | 307 then 200, 1.2 MB of HTML | `runs/diag-hl/requests.log` |
| `GET /hims.us.modern.*.js` (about 37 script files the page asks for, including `hims.us.modern.domains-consultation-hair-loss.95eddaecbb3e5482d8f4.js`) | **403**, body "Just a moment...", header `cf-mitigated: challenge`, `server: cloudflare` | `runs/diag-hl/requests.log`, `runs/diag-hl2/requests.log` (second try 30+ s later) |
| Same script with curl | 403, same challenge page | checked once |
| Same script and `/blog/...` pages with the fetch tool | 403 | checked once each |
| Images and fonts under `/forhims/image/upload/...`, `/css/fonts/...` | 403 (pages show broken images; harmless) | `runs/diag-landing/requests.log` |
| Scripts under `/shop/_next/static/...` (the newer Next.js "shop" app that draws landing and product pages) | 200 | `runs/diag-landing/requests.log` |
| `https://www.forhers.com/hair-loss` | 403 without JavaScript; with JavaScript the page reads "Performing security verification ... verifies you are not a bot" and stays there | `runs/hers-landing/`, `shots/02-hers-security-check.jpg` |

Hims US runs two front ends on one domain:

- **Old app ("Vanguard", `store-ui-web`)**: serves `/c/...` consultations and checkout. Scripts at the site root. **Blocked.**
- **New app (Next.js, under `/shop/_next/`)**: serves `/hair-loss`, product pages, `/lp/...` landing pages, blog. **Works.**
  Content comes from Contentful; the page data is streamed in `self.__next_f.push(...)` blocks.

Nothing was done to get round the challenge (protocol rule). Likely cause: this machine's traffic leaves through a shared
proxy, and Cloudflare scores it as automated. From an ordinary home connection the quiz probably loads.

## 3. Where things are

| File or folder | What it is |
|---|---|
| `company.json` | The result. Built by `scripts/build_company.py`. **Edit the JSON directly from now on** (or edit the script and re-run, not both). |
| `quiz-definition.json` | Says plainly that the main consultation definition was not found, and wraps the pre-quiz definition below. |
| `quiz-definition.lp-prequiz.json` | The landing-page pre-quiz as served: 3 questions, options, targets, the disclaimer, and what was observed. **There is no quiz definition for the real consultation: it was not reachable.** |
| `baseline-lp-prequiz.json` | Replayable walk of the pre-quiz (Both, Yes, Yes). Ends on the product pitch. |
| `baseline-men.json` | Opens `/c/hl/goals` and waits. Today it ends on the spinner. Use it to test whether the block has lifted. |
| `baseline-women.json` | Opens the Hers hair page and waits. Today it ends on the security check. |
| `runs/landing/` | `/hair-loss` landing page, full text and links. |
| `runs/q0/`, `runs/diag-hl/`, `runs/diag-hl2/` | The blocked quiz entry: spinner screenshot, every request with its status. |
| `runs/diag-landing/` | Landing page request log (shows which paths are refused and which are served). |
| `runs/lp-topfin/`, `runs/baseline-lp-prequiz/` | The pre-quiz landing page and the walk through it. |
| `runs/hers-landing/` | Hers security check. |
| `raw/props-c-hl.json` | The `window.PROPS` object embedded in the `/c/hl` HTML (1.15 MB): empty consultation and visit state (field names are useful, see section 6), navigation content, and about 1,000 experiment names with their traffic split. |
| `raw/pages/*.html`, `*.txt` | Every product, landing, safety and blog page fetched, as HTML and as text with links. `*.rsc.txt` = the decoded streamed page data. |
| `raw/help/` | Help-centre pages: search results, categories, and the drug-information sheets for hair. |
| `shots/` | Six screenshots: stuck spinner, Hers security check, landing page, pre-quiz question 1, question 2, end pitch. |
| `scripts/diag.js` | Loads one page and logs every request, failure and console error. Use it to re-test the block. |
| `scripts/getdoc.js` | Gentle page fetcher: JavaScript off, images skipped, 2.5 s pause, saves HTML and text. Works for all hims.com documents and the help centre. |
| `scripts/extract_props.py` | Pulls `window.PROPS` out of an old-app page. |
| `scripts/rsc.py` | Joins the Next.js streamed payload of a new-app page into one text file (search it for wording). |
| `actions/` | Small action files used for the runs above. |

## 4. How to replay

```
cd hairloss-research/companies/hims-us
node ../../tools/walk.js baseline-lp-prequiz.json runs/<run-id> --last     # pre-quiz, about 40 s
node ../../tools/walk.js baseline-men.json runs/<run-id> --last            # real consultation: spinner today
node scripts/diag.js https://www.hims.com/c/hl runs/<run-id> 20000         # then: grep -c '^403' runs/<run-id>/requests.log
```

Things to know about the pre-quiz:

- All three questions are in the page at once (a slider), so `walk.js` text output looks the same after every click.
  Look at the screenshots, or trust the step order.
- Question 2 and question 3 both have a button called "Yes". Use `"nth": 0` for question 2 and `"nth": 1` for question 3.
- A promo pop-up ("Start regrowing hair ... Take the free hair quiz", link to `/c/hl`) sits bottom right. It does not block clicks.
- Use locale `en-US` and timezone `America/New_York`.

Replays used in stage 1: 6 `walk.js` runs and 3 `diag.js` loads, plus about 60 single document fetches.

## 5. Products (full table in `company.json`)

Men, prescription, all through the consultation at `/c/hl`:

| Product | Actives | Public price |
|---|---|---|
| Finasteride & Minoxidil + Supplement Blend Pill (new) | finasteride 1.2 mg, minoxidil 3 mg, biotin 2.5 mg, B12 1 mg, vitamin C 100 mg, resveratrol 20 mg, zinc sulfate 30 mg | from $35 (landing) / $29 (product pages, 10-month plan paid upfront) |
| Finasteride & Minoxidil + Supplement Blend Chew ("most popular") | finasteride 1.2 mg, minoxidil 3 mg, biotin, B5, B6, C | same |
| Rx Hair Loss Spray | finasteride 0.3%, minoxidil 6% | same; blog: $35 a month on 5 months, $50 a month on 3 months |
| Rx Hair Loss Spray + Ketoconazole + Biotin | finasteride 0.3%, minoxidil 7%, ketoconazole 2.2%, biotin 0.2% | from $39 (landing) / $33 |
| Rx Hair Loss Serum | finasteride 0.3%, minoxidil 6%, essential oils | from $35 / $29 |
| Minoxidil + Supplement Blend Chew | minoxidil 3 mg, biotin, B5, B6, C | $29 a month, 10-month plan paid upfront |
| Finasteride tablets | finasteride 1 mg (FDA-approved generic) | from $22 |
| Hair Power Pack | finasteride tablets, minoxidil solution, Thick Fix shampoo, biotin gummies | from $60; "Out of stock" on its page |
| Finasteride & Minoxidil kit | two products; card only | from $32 |

No prescription needed (add to cart): minoxidil foam 5% ($20, $19 on subscription), minoxidil solution 5% ($15),
non-prescription kit ($37 a month), Thick Fix shampoo ($19) and conditioner ($22), biotin gummies ($16), Dandruff Detox
shampoo with pyrithione zinc 1% ($18), Max Volume shampoo, conditioner and set ($18, $18, $32).

Oddities worth knowing:

- **Two price levels on the same day.** The main landing page says "Starting at $35" for pill, chew, spray and serum
  ($39 for the 4-in-1 spray). Product pages and `/lp` pages say $29 ($33). The $29 carries the footnote "With a 10-month
  plan, paid upfront in full". A banner on `/lp` pages reads "New Price: Fuller hair. Lowest price ever." Probably a
  price change rolling out, or a test (Hims runs many: see section 6).
- **Plan lengths seen in public text:** 3, 5, 10 and 12 months. Per-plan prices are shown only inside the consultation.
- **Two Hims blog posts contradict each other** on the "Hair Loss Duo": one says $32 on 3 months and $39 on 12 months, the
  other the reverse. Do not rely on either.
- **Help centre says not available in Puerto Rico** (updated 28 Oct 2026); an older Hims blog says it is. Trust the help centre.
- The help centre has drug sheets for an "ED and Hair Loss" combination tablet (tadalafil + finasteride + minoxidil +
  vitamins) and for plain minoxidil tablets. Neither has a hair product page on hims.com.

Women (Hers): only four products could be named, from search-result snippets (oral minoxidil 1.25 mg rising to 2.5 mg,
a minoxidil + vitamin blend, a minoxidil + biotin chew, spironolactone). Treat as a stub.

## 6. What the page code hints about the engine (not seen running)

From `raw/props-c-hl.json`, the empty state the old app starts with:

- `consultation`: `dob`, `shippingState`, `shippingZipCode`, `invalidInitialShippingState`, `registration`,
  `prescriptionPreference`, `subTreatmentType`, `intakeFormUpfront`, `initialQuestionnaire`, `unansweredQuestions`,
  `additionalItems`, `otcChargedAmount`, `subscription`, `treatmentProducts`, `treatmentBrands`.
- `consultation.treatmentPreferences`: `selections {brandId, strength, quantity, daysSupply, packagingSelection}`,
  `regimen`, `recommendedBrand: true`, `overrideRecommendedDosage: true`, `originalRecommendedTreatment`,
  `showRecommendationModal`, `hideDosageSelection`, `maCompoundDeprecation`, `waCompoundDeprecation`.
- `visit`: `questionnaireId`, `questions`, `rootQuestions`, `root`, `triggers`, `answers`, `choices`, `requiredPhotos`,
  `ssnRequired`, `modality`, `communicationChannel`, `eligibleChannels`, `workflowCode`, `isIntakeFormCompleted`.

Reading: the medical form is a tree (`rootQuestions` plus `triggers` = follow-up questions fired by answers), fetched from
the server by `questionnaireId` once the visit starts. The site marks one product as recommended and lets the customer
override product and dose. The visit has a "modality" and "eligible channels" (message, video), which fits the help-centre
line that some states need a video visit. Massachusetts and Washington have special flags for compounded products.

Hair experiment names in the same file (all are on/off flags with no content): `himsHairSegmentation` (treatment2 at
100%), `hairLossPrescriptionPreference` (on), `himsHairTopFinRecco` (on: the name suggests topical finasteride is the
default recommendation), `himsHairQuizRevampV2` (on), `intakeV2HairLoss` (on), `1521HimsHairLPsNewFlow` (on),
`hairLossDrFirst` (off), `hairLossCheckoutFirst`, `hairLossEducationScreen`, `hairLossDateOfBirthCopy`,
`himsHairSkipPhotos`, `hairLossDiagnosticPhotosReorder`, `himsHairHideOtcStep`, `himsHairOTCAddOnV1`,
`himsHairHideChews`, `himsHairMostPopularTag`, `himsHairPremiumTopFinPriceTest`, `himsHairTopFin6MonthPriceTest`,
`hairLossMonthlySku`, `himsHairMoneyBackRemoval`, `hersHairRxOrNot`, `hersHairOralMinoxidil`, `hersHairRxOTCRecco`.
Names are hints only; do not turn them into rules without seeing the behaviour.

Other addresses in the page configuration (not called, listed for context only): GraphQL at `api.forhims.com/graphql`,
`flow-server.hims.com` (a newer flow engine used by `/g/i/wm` weight and `/g/i/sh` sexual-health entries),
`intake.hims.com` ("AI intake"). **Do not call these directly** (protocol: no guessed private APIs).

## 7. Public documents that describe the consultation

- Help centre "How does this work?" (updated 18 Jun 2026): online intake form about symptoms and medical history; a
  provider assesses; by secure message in most states, by video visit where the state requires it.
- Hims blog "Hims vs. Keeps": "Hims asks questions about your hair, of course, but also about family history, lifestyle,
  mental health (like stress levels), and your styling routine." Each question has a "Why We Ask" note. "In most cases,
  Hims will also have you submit photos of your hair."
- Hims blog "Hims vs. Happy Head": also asks "your hair goals, styling habits, and how you prefer to wear your hair";
  "may ask you to upload photos of your hairline ... If further verification is required ... your photo ID."
- `/hair-loss/check-in`: a month-3 check-in asks how you feel about the treatment, side effects, and health changes.
- Safety pages (`/important-safety/...`) give the exclusion lists now in `rules` R1 to R5.
- Fortune review (updated 15 Jul 2026): questionnaire, intake form with photos, provider review; reviewer paid $150 for
  three months of the 0.3% / 6% topical.
- Healthline review (seen only through a search summary): "create a profile and then answer some basic questions about
  your hair loss status ... what other products you've tried", then health questions including mental health and ED.
  This is the only hint that the account comes **before** the questions; it is weak and undated.

## 8. Dead ends

- The consultation scripts: 403 to the browser, to curl and to the fetch tool. No other host serves them.
- `forhers.com`: full security check. The fetch tool gets 403 too.
- Web search for a question-by-question walkthrough of the Hims US hair quiz: none found (three searches).
- Blog article bodies are not in the no-JavaScript text; use `scripts/rsc.py` and search the `.rsc.txt` file.
- `/shop/hair`, `/hair-hybrids` redirect to `/hair-loss`. `/how-it-works` redirects to `/weight-loss`.
- Product-specific "Get started" links: there are none. Every button goes to `/c/hl` or `/c/hl/goals`.

## 9. What stage 2 should do first

1. **Re-test the block.** Run `baseline-men.json` once. If the first question appears, the whole map changes: walk it
   with the protocol's baseline man (Texas if a state is asked), record every screen, stop at the account wall, then
   look in `net/` for the questionnaire JSON (expect calls to `api.forhims.com`). That would replace the skeleton list.
2. If still blocked, **say so and do not burn replays on it.** One retry at the start and one at the end is enough.
3. **Finish the pre-quiz** (cheap, 4 replays): Q1 "Stop hair loss", Q1 "Regrow hair", Q2 "No", Q3 "Not sure yet". The
   served data says none of them branches; confirm and set the four `unknown` options.
4. **Check the other landing pages for different pre-quizzes** (each is one page load with `walk.js`):
   `/lp/hair-start-comparison-dlp-sem`, `/lp/hair-start-preventmaint`, `/hair-start-personalized-treatments`,
   `/hair-start-top-fin-lp`, and vanity links such as `hims.com/hair`. Their names came from page data and search results.
5. **Prices by plan length:** look for more Hims blog or press pages that state them; the site itself shows them only
   in the consultation.
6. **Hers:** retry `baseline-women.json` once. If it loads, map its hair page and quiz the same way.

---

# Stage 2 (EXPERIMENT) log, 23 November 2026, from 22:16 UTC

## S2.1 Block re-tested: still there

- `baseline-men.json` replayed once at 22:17 UTC → blank page, no controls (`runs/s2-baseline-men`). Not retried in a loop.
- `web.archive.org` (cached copies of the consultation script) is not reachable from this machine: the connection is
  reset during the TLS handshake, and the fetch tool refuses the host. `archive.org/wayback/available` does answer and
  says snapshots exist (`/c/hl` on 11 Nov 2026, `/c/hl/goals` on 28 Oct 2026), so a later investigator on another
  network could read the archived script `hims.us.modern.domains-consultation-hair-loss.*.js` there.
- The web-search tool ran out of its shared budget after one search. Known pages were fetched directly instead.

## S2.2 Pre-quiz one-change experiments (5 replays, `scripts/prequiz.js`)

`scripts/prequiz.js <outDir> <q1> <q2> <q3>` replays the landing-page pre-quiz and, unlike walk.js, logs every request
with its body, so tracking events are visible. Each run folder holds `result.json` (summary), `requests.jsonl`,
`00-start … 03-after-q3` text and screenshots.

| Run | Answers | Result |
|---|---|---|
| `runs/s2-baseline-lp-prequiz` | Both, Yes, Yes | spray pitch, links to /c/hl |
| `runs/exp-lp-01-q1-stop` | **Stop hair loss**, Yes, Yes | identical |
| `runs/exp-lp-02-q1-regrow` | **Regrow hair**, Yes, Yes | identical |
| `runs/exp-lp-03-q2-no` | Both, **No**, Yes | identical |
| `runs/exp-lp-04-q3-notsure` | Both, Yes, **Not sure yet** | identical |

"Identical" = same visible text checksum, same scroll position after each click (823, 1628, 2433 px), same end links.
The only thing an answer changes is the name of the click event sent to `api.forhims.com/dpe/producer/unauth` (Hims' own
event collector) and to Amplitude, for example `atf_q1-what-are-your-hair-goals_stop-hair-loss_secondary-cta`. The event
carries a device id (`uet_id`), so the answer is kept as marketing data even though no account exists.
