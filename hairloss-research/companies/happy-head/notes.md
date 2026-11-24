# Happy Head (US): working notes, stage 1 (MAP)

Checked on 23 Nov 2026. Written for the next investigator (stage 2: one-change experiments).

## 1. Read this first: the marketing site tells Claude agents to stay out

`https://www.happyhead.com/robots.txt` (saved as `raw/robots.txt`, "Last updated: April 2026") has:

    User-agent: ClaudeBot      Disallow: /
    User-agent: Claude-Web     Disallow: /
    User-agent: Claude-User    Disallow: /
    User-agent: anthropic-ai   Disallow: /

`Claude-User` is the name for Claude fetching pages for a user, which is what this research is. The site does load
with curl and a browser user-agent, but going in that way would mean hiding who is asking to get past a rule written
for exactly this agent. The protocol bans header games, so **www.happyhead.com was not fetched**: no product pages,
collection pages, FAQ, legal pages, blog or sitemap.

- One home-page request went out in the same command as the robots.txt request, before robots.txt had been read.
  That copy was deleted unread. Nothing here comes from it.
- If the owner of this research wants those pages read, that is their decision to make knowingly (for example by
  reading them in their own browser). An investigator should not make it silently.

Each host has its own robots.txt, and I followed each one:

| host | what it is | its robots.txt | used? |
|---|---|---|---|
| www.happyhead.com | marketing site, product pages, FAQ, legal | Disallow: / for Claude agents | **No** |
| www.form.happyhead.com | the assessment (quiz) app | `User-agent: * / Disallow:` = open to all (`raw/form-robots.txt`) | Yes, walk.js |
| engine.embeddables.com | third-party quiz engine the quiz page calls | (URL the page itself requested) | Yes: the quiz definition |
| happyhead.zendesk.com/hc | help centre | /hc/ open to all (`raw/zendesk-robots.txt`) | Yes, walk.js |
| my.happyhead.com | account and checkout | not visited (sign-in / payment) | No |
| www2.happyhead.com, form.dev / staging hosts | linked from legal links and code | not visited | No |

Help centre note: curl, WebFetch and a bare headless browser get a Cloudflare "Just a moment" page there. The standard
walk.js browser loads it normally. Nothing was solved or worked around; if walk.js starts getting the check, stop.

## 2. The quiz definition (the most valuable find)

The assessment is an **Embeddables** flow. The quiz page requests
`https://engine.embeddables.com/init?load={"embeddablesToLoad":[{"id":"flow_d02099468c5fg664dh31b7cg"}],"originUrl":...}`
and receives the whole flow: 62 pages, every component and option, page conditions, 58 computed fields, 132 actions.

- `quiz-definition.json` — the raw response (flow "Happy Head - Primary Flow - Test", version 141).
- `raw/flow-dump.txt` — readable dump: every page, text, option, "SHOWN WHEN" condition. Rebuild with
  `python3 -I tools/dump-flow.py`.
- `raw/logic-computed.txt` — the computed fields that matter (female_under_50, consult_pid, valid_age_range,
  consult_and_valid_pid, date_of_birth_for_api_request, product_ids ...).
- `raw/logic-actions.txt` — the actions that matter. Start with `_a18938682205317825` "Get product recommendation".
- `raw/backend-payload-code.txt` — action `_a7004594546312322` "POST to backend + redirect URL": the order payload,
  with `isImportant` / `isCritical` on every option. This is the clinician flag list.

What it shows:

1. **One flow file, several question sets**, switched by URL keys:
   `l=false` current short set (the START NOW link uses it) · no `l` = older landing-page set ·
   `consult=true&pid=<ids>` product-specific consult (no method question, no recommendation screen) ·
   `rec=problends` ProBlends recommendation · `ot=var1` adds a subscribe-or-one-time page · `s_p=a1|b1` adds a
   plan-length page with prices · `upgrade=derm|cp` adds a dermaroller or copper-peptide upsell ·
   `email_capture=sms_capture|early_capture` moves the email page · `coupon=TryHappyHead` bundle-only offer ·
   `jf2=var2` alternative wording · `lpvar=bot1|top3` landing pages.
2. **The recommendation is a server call**: `POST api.happyhead.com/middleware/product-recommendation` (sent through
   request.embeddables.com) with only `{dateOfBirth, userChosenPids, userPreferredMethods, gender}`. The birth date
   is made up by the page: 51 years ago for men and women 50+, 19 years ago for women under 50.
3. The page then shows the bundle first (pre-selected) plus Topical (method = topical or not sure) or SuperCapsule
   (method = oral).
4. **Medical answers do not change the product and never stop the user.** They are only used in the final POST,
   where options carry important/critical flags. The only hard stop is age under 18 on the date-of-birth page.
5. Choosing a plan with a capsule adds three questions (last check-up, blood pressure, weight).

## 3. Live walks (how to replay)

    cd hairloss-research/companies/happy-head
    node ../../tools/walk.js baseline-men.json   runs/baseline-men   --last
    node ../../tools/walk.js baseline-women.json runs/baseline-women --last
    python3 -I tools/reco-compact.py runs/baseline-men      # short view of the recommendation response

- Each full walk takes about 4 minutes; use a Bash timeout of 300000 ms. Both ran clean on 23 Nov 2026.
- Clicks are by visible text. The date of birth uses three pickers: click `input[placeholder="Year"]` then the year,
  the same for Month ("Jun", three-letter names) and Day.
- The first URL redirects to `/get-started-now/?l=false&email_capture=sms_capture&ph=true&_stsgnoredir=1`.
- Both walks end on the email + mobile page. **Stop there.** Filling it in posts the consultation.
  Check after any run: `grep -c 'middleware%2Fembeddables' runs/<run>/network.jsonl` must print 0.
- The recommendation request and response are in `runs/<run>/network.jsonl` and `runs/<run>/net/*produ*.json`.
- Every screen fires analytics events to api.happyhead.com (normal page behaviour).

Baseline man: goal "regrow a receding hairline", 1-3 years, family history Yes, Male, hairline + "Thinning all over"
(the code key is `crown`), no preference → **Dual Treatment (topical dutasteride 0.3%/minoxidil 8% + SuperCapsule
dutasteride 0.5 mg/minoxidil 1.25 mg/D3)**, then no to everything, born 15 Jun 1994.

Baseline woman: goal "fuller, healthier-looking hair", 1-3 years, family history Yes (not set by the protocol; kept the
same as the man), Female under 50, parting + all over, no preference → **Dual Treatment (topical minoxidil 6% +
SuperCapsule spironolactone 25 mg/minoxidil 1.25 mg/D3)**, able to become pregnant Yes, oral contraceptives, no to
everything else, born 15 Jun 1988.

## 4. Products: where each fact comes from

- p1–p6 (the six products the standard assessment offers): exact formulas, quantities, prices and pharmacy
  (Chemistry Rx) are in the live recommendation responses. Evidence `observed`.
- ProBlends, copper peptide, dermaroller, supplements price, plan-page prices: quiz code. Evidence `code`.
- Everything else: help-centre articles (`raw/hc/help-centre-articles.txt`, 24 articles) and third-party reviews
  (NCOA Sep 2026, Top10 Aug 2025, finvsfin Oct 2025, Perfect Hair Health Oct 2026). Evidence `docs`. Third-party
  prices are "starting at" figures of different dates and should be treated as rough.
- Unknown and marked so: strengths of the single-ingredient oral medicines and of several topical variants.
- Product URLs on www.happyhead.com are taken from links in the help-centre footer and from search results.
  The pages themselves were not opened.
- Not captured: the "Anti-Dandruff Shampoo" help article and about 38 other help articles (list in
  `raw/hc/urls.txt`).

## 5. Dead ends

- www.happyhead.com: closed to this agent (section 1).
- Help centre by curl or WebFetch: Cloudflare check (HTTP 403). Use walk.js `goto` steps (`runs/hc-docs.json`).
- No state-availability list found.
- Legal pages (terms, subscription terms, drug safety, telehealth consent) are on www.happyhead.com /
  www2.happyhead.com: not read. The quiz also links "MDI Telehealth Consent" at mdintegrations.com/tos (the
  clinician network appears to be MD Integrations; not read).

## 6. What stage 2 should test first (all on www.form.happyhead.com, stopping at the email page)

1. **Female 50 or older** (one change from the woman baseline, with a matching birth year): which products does the
   service return? The code suggests the dutasteride set; the company's documents say finasteride is preferred for
   women over 50.
2. **Method = Oral** and **Method = Topical** for the man and the woman: confirm the cards and whether the service
   returns different groups.
3. **Choose Topical** instead of Dual: confirm the three blood-pressure questions disappear.
4. **Household pregnancy = Yes**, then each answer on the risk screen: capture the full safety text and confirm
   the product is unchanged.
5. **Date of birth**: under 18 (stop message), woman's age not matching her band (sent back), a man aged 70
   (code says no limit).
6. One red flag at a time (bald patches, each scalp symptom, each health condition, low blood pressure, reaction to
   previous treatment): the code says nothing changes on screen. One or two spot checks are enough.
7. URL variants: `?l=false&ph=true&rec=problends`, `&ot=var1`, `&s_p=a1`, `&upgrade=derm`, `&upgrade=cp`.
   They are public URL keys in the served code, but they are not links found on a page, so treat them as optional
   and say so in the report.
8. Do **not** try `consult=true&pid=...` with guessed product ids. Product ids seen in real responses are:
   116443 (topical dutasteride), 274216 (SuperCapsule dutasteride), 68633 (topical minoxidil), 287244 (SuperCapsule
   spironolactone).

## 7. Files

- `company.json` — built by `python3 -I tools/build-company.py` (edit the script, not the JSON). Passes
  `node ../../tools/validate.js happy-head --stage map`.
- `baseline-men.json`, `baseline-women.json` — replayable answer files.
- `quiz-definition.json` — the full flow.
- `runs/baseline-men`, `runs/baseline-women`, `runs/hc-docs`, `runs/q00` (first look at the start page).
- `shots/` — welcome screen, first question, both recommendation screens, serious-symptoms and health-conditions
  screens, the women's birth-control branch, the account wall.

# Stage 2 (EXPERIMENT) log, 23 Nov 2026

- Answer files: `runs/s2/<id>.json` built by `tools/make-exps.py`; run one at a time with `bash tools/run-batch.sh <id>`
  (uses `tools/walk-fast.js`; never parallel). Summarise with `python3 -I tools/summarise-run.py runs/s2/<id>`.
- Choosing a card other than the pre-selected Dual card needs TWO clicks on its button (first click selects the card,
  second continues). The answer files for m-choose-topical and m-oral-choose-capsule now do this.
- Done and confirmed so far (all 0 consultation posts): baseline-men (runs/s2/baseline-men), base-women,
  m-method-oral, m-method-topical, w-method-oral, w-method-topical, w-50plus, m-household-yes-decline
  (no change at all: dutasteride stays in the plan), m-choose-topical (check-up, blood pressure and weight pages vanish;
  product_ids = 116443 only).
- Later the same session: m-dob-under18, w-dob-mismatch, m-pattern-other, m-symptoms-itch, m-cond-heart,
  w-preg-no-postmeno, m-custom-yes, m-prior-oralfin-reaction, m-oral-choose-capsule, m-pattern-patches, m-goal-prevent,
  w-50plus-full, m-dob-70, m-family-no. All 0 consultation posts.
- Results: only sex/age band and method change the offer; every medical answer only adds a follow-up page or nothing.
  Hard stop only for age under 18. Woman's birth date outside her band sends her back to the sex/age page.
- company.json: after `python3 -I tools/build-company.py`, run `python3 -I tools/stage2-patch.py` ONCE (adds experiments,
  observed evidence, rules R11-R21, recommendations, summary). Stage 1 copy kept in raw/company-stage1-backup.json.
- Not run (written but skipped for time): m-goal-exploring, m-duration-lt6m, w-pattern-patches, m-household-yes-accept,
  w-household-yes, m-bp-low, m-meds-yes, m-allergy-minoxidil, w-bc-none. Code says none changes the product.
- New shots: shots/s2-*.jpg (under-18 stop, woman DOB mismatch, partner-pregnancy screen, woman 50+ recommendation).

# Stage 3 (VERIFY) log, 23 Nov 2026 (in progress)

- Runner: `bash tools/run-verify.sh <id>` (answers `runs/verify/<id>.json`, output `runs/<id>/`, one at a time).
- verify-base-men (plain start URL, no redirect this time): same recommendation as recorded; ended on an EMAIL-ONLY wall
  (no mobile field). verify-base-women on the plain URL was redirected to `email_capture=early_capture`: the email wall came
  straight after "Take Me to My Plan", BEFORE the recommendation screen and before every medical question (the
  recommendation call had already been made). So the wall's place and fields depend on a split test. Stage 2 runs/s2/baseline-men
  already showed the email-only wall; company.json had said "email + US mobile" only. Corrected.
- verify-base-women-pinned (sms_capture URL): same as recorded (minoxidil 6% topical TM3 $59 + spironolactone SuperCapsule SC3 $89).
- Confirmed live: R3 (woman 50+ gets dutasteride set), R7 (under 18 stop, no NEXT), R8 (woman DOB mismatch sent back),
  R11 (household pregnancy decline: plan unchanged), R15 (heart condition: one free-text page, plan unchanged),
  R12 (choose topical: check-up/BP/weight skipped, product_ids 116443).
- More confirmed: R4 (runs/verify-m-method-oral). New one-change tests: verify-w-50plus-oral (dutasteride capsule card), verify-w-bc-none
  (no birth control: no warning, spironolactone stays), verify-w-household-yes (woman on a spironolactone plan is shown the
  finasteride/dutasteride partner-risk screen), verify-m-bp-low (no change). 14 replays in stage 3, all 0 consultation posts.
- company.json patched ONCE with `python3 -I tools/stage3-patch.py` (stage 2 copy in raw/company-stage2-backup.json). Adds the
  verification block, rules R22-R26, 14 experiments; fixes R4/R8 effect types, the account wall text, p7/p8/p14/p16 product facts.
- Product facts outside the quiz were checked only through WebSearch summaries (www.happyhead.com still not opened: robots.txt).
- Validate: `node ../../tools/validate.js happy-head --stage final` passes.
- Tip for the next person: pin the sms_capture start URL; the plain URL can land in the early_capture arm, where the email wall
  comes before the recommendation screen and replays stop there.
