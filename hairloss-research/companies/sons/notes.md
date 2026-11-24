# Sons (UK): working notes, stage 1 (MAP)

Checked on 23 Nov 2026. Written for the next investigator. Everything here came from an anonymous browser, curl, or public
documents. No account, email, phone number, name, photo, payment or order was used at any point.

## 1. The short version

- Sons treats **men only**. One questionnaire covers all scalp hair-loss products. A woman is stopped at question 2.
- The questionnaire is a SurveyJS form. Its **whole definition (38 pages, every option, every show/hide condition)** is
  downloaded by the page as one JSON file. Saved as `quiz-definition.json`.
- There is **no stop screen for men**. Whatever a man answers, he reaches the account form.
- **Account wall:** the account form comes straight after the last consent screen. No plan, product or price is shown first.
  Pressing "Get my personalised plan" creates the account and sends the consultation in the same request.
- **The rules that turn answers into plans are in the browser**, in code any visitor can download. Two copies exist and
  they do not fully agree (section 5). Saved as `recommendation-engine.excerpt.js` (older) and `engine-newer.extract.js` (newer).
- So the map is: questions and branching = seen live; product effects = read from served code, **not** seen live.

## 2. Where things are

| file | what it is |
|---|---|
| `company.json` | The map. Built by `scripts/build-company.js` (edit the script, not the JSON, then re-run it). |
| `quiz-definition.json` | Hair consultation definition as served (`api.sons.co.uk/barber/survey/code/loader?code=uk_consultation&pharmacy=tip`). |
| `src/survey-uk_consultation.outline.short.txt` | The same thing as a readable outline (page, question id, type, options, `visibleIf`). Start here. |
| `src/survey-oral_minoxidil_5mg_consultation.raw.json` | Step-up consultation (2.5 mg to 5 mg oral minoxidil). |
| `src/survey-beard.raw.json` | Beard Booster consultation. |
| `recommendation-engine.excerpt.js` | Older rules: inline script of `sons.co.uk/pages/recommendation` (lines 690-1965 of `src/recommendation-page.inline.js`). |
| `engine-newer.extract.js` | Newer rules: two webpack modules cut unchanged from the shop app (`shop.sons.co.uk/recommendation`). |
| `scripts/engine-run.js` | Runs the newer rules offline on any set of answers. No network. |
| `baseline-men.json`, `baseline-women.json` | Replayable answer files for walk.js. |
| `scripts/all-branches-men.json` | One walk with every branch switched on (records all 24 conditional screens). Not a one-change test. |
| `runs/` | `baseline-men` (to the account form), `baseline-women` (stop notice), `all-branches-men`, `existing-customer-yes` (sign-in page), `cap-*` (raw survey downloads), `page-*` (plans page, clinic page). |
| `src/products.json` | Public Shopify feed, 56 items, all prices. |
| `src/products-text/`, `src/docs-text/` | Text of every product page and of FAQ, terms, promise pages. |
| `src/leaflets/` | Public patient leaflets (strengths, "unlicensed medicine" statements). Several are image-only PDFs: open them to read. |
| `src/chunks/` | The shop app's JavaScript. `*.pretty.js` are prettier-formatted copies. |
| `src/translation.en.json` | All interface wording of the shop app, including text of screens behind the wall (checkout, health check, ID check). |
| `shots/` | 8 key screenshots. |

## 3. How to replay

```
cd /home/user/ADHD-learning/hairloss-research
node tools/walk.js companies/sons/baseline-men.json   companies/sons/runs/<new-id> --last     # ends on the account form
node tools/walk.js companies/sons/baseline-women.json companies/sons/runs/<new-id> --last     # ends on the female notice
node companies/sons/scripts/capture-survey.js 'https://shop.sons.co.uk/consultation/?logged_in=false' companies/sons/runs/<new-id>   # re-download the definition
node companies/sons/scripts/engine-run.js '{"5143":0,"3216":0,"5148":[],"What treatment type do you prefer?":2,"5155":[],"date_of_birth":"1994-06-01"}'
node companies/sons/scripts/build-company.js && node tools/validate.js sons --stage map
```

Things to know about the form:

- Start URL is `https://shop.sons.co.uk/consultation/?logged_in=false` (the landing page `sons.co.uk/pages/consultation-hair`
  just links to it).
- Single-choice questions move on by themselves when clicked. Tick-box and text questions need the **Continue** button
  (`{"do":"click","text":"Continue"}`; selecting the button by CSS fails because a hidden copy sits first in the page).
- Free-text boxes: `{"do":"fill","selector":"textarea","value":"test"}`. Every condition text box is required except the
  High Blood Pressure one; the mood text box is required too; the three side-effect text boxes are optional.
- **walk.js does not save the survey definition**: the loader replies with content type `text/html`, so the JSON filter
  skips it. Use `scripts/capture-survey.js`.
- Answers live in memory only. `storage.json` holds nothing useful.
- On leaving the page the app tries to send a beacon with the answers so far (`account/partial/survey`). It carries no
  identity. Playwright closing the browser normally does not fire it.
- Question ids are numbers (`5140`…`5168`, `3216`, `3217`, `3275`, `3276`, `5613`–`5615`). Option values are numbers too
  (for example `5155` value `7` = Diagnosed Lactose Allergy). The outline file lists them.

## 4. The flow for a man (seen live)

1. Existing customer? (Yes sends to sign-in.) 2. Gender at birth? (Female = stop notice.) 3. Declaration tick.
4. Hair picture (4 drawings). 5. Gradual or sudden? (Sudden adds 3 yes/no screens.) 6. Mood or antidepressants? (Yes adds
a text box and two PHQ-2 questions.) 7. Past medicines (each tick adds a side-effect question after step 8).
8. Format preference. 9. Nine conditions (each tick adds a text box; Scalp Disorders adds four screens).
10. Finasteride statement + required tick + optional NHS Summary Care Record and GP consents. 11. **Account form.**

Pages `5167` and `5168` are in the definition but have no question type, so they never appear.

Not asked anywhere before the wall: age (only date of birth on the account form), current medicines, allergies other
than lactose, low blood pressure, family history, how long, goals.

## 5. The two copies of the rules

Both set five switches: oral finasteride, topical finasteride, oral minoxidil, topical minoxidil, topical combination.
Both filter a fixed list of 12 plan handles. Full detail is in `company.json` → `rules`.

| point | older (page script on sons.co.uk/pages/recommendation) | newer (shop app, module 30216) |
|---|---|---|
| first item of the list | Core Plan (spray if "topical", capsule otherwise) | Combination Spray in both orders |
| primary cards shown | 2 if finasteride tablets and minoxidil spray are both allowed, else 1 | always 1 |
| over 65 | minoxidil spray still allowed | everything blocked |
| high blood pressure | also has a legacy path that only blocks if "not controlled" (old customer data) | any tick blocks minoxidil |
| server input | reads `consultation_results` from `api.sons.co.uk/cart/data` after sign-in, plus account tags | same, and can take a server-sent ordered list (`account/recommendations`) |

The consultation code redirects new sign-ups to the **older** page (`www.sons.co.uk/pages/recommendation?token=…`).
Which copy is really live for a new customer could not be confirmed without an account.

Account tags seen in code: `finasteride_disallowed`, `minoxidil_disallowed`, `dutasteride_eligible`, `combo_pill_eligible`,
`topical_finasteride_eligible`, `consultation_complete(d)`. How the server sets them is unknown.

## 6. Entry points

- Hair: `sons.co.uk/pages/consultation-hair` (home page, menu, "Get started" on product and plan pages) and its twin
  `/pages/consultation-hair-2`. Both open the same app URL. Product pages do not pass the chosen product in the link;
  the recommendation script looks for `sessionStorage.chosenProduct`, but I did not find where it is set (searched the
  product pages, the saved landing pages and three theme scripts in `src/theme/`).
- Same questions, different landing after sign-up, via URL switches read by the app: `combo_pill=true`, `from_clinic=yes`,
  `from_ksl_clinic=yes`, `bhc-clinic=yes`, `is_google=true`, `health_check=true`, `clinic_consultation` + `clinic_id`.
- Oral minoxidil 5 mg step-up: add `&oral_minoxidil_5mg=true` (or `code=oral_minoxidil_5mg_consultation`).
- Beard: `shop.sons.co.uk/beard-consultation/` (from `/pages/consultation-beard`, `/pages/beard-consult`).
- Partner transplant clinics: `shop.sons.co.uk/clinics/<slug>` (list on `sons.co.uk/pages/clinic-finder`). Asks treatment
  type and procedure date first. Only the first screen of one clinic page was opened.
- "Log In" instead of "Get started": Oral Minoxidil 5mg, Combination Capsule, Dutasteride spray, Topical Finasteride,
  Topical Finasteride & Oral Minoxidil.
- No consultation: Non-Prescription plan, Hair Growth Complex, biotin, shampoo, conditioner, clay, dermaroller.
- Women: none. German and Irish sites exist (sonshaar.de, sons.ie) with their own survey codes; out of scope.

## 7. Products

56 items in the feed. `company.json` lists 31 entries: every current single product and plan, with the 12 legacy
customiser plans, the marketplace-style packs and the free packs each grouped into one entry. Feed handles are kept in
each entry's `handles` field. Strengths come from leaflets and from the shop app's own dose table
(`src/chunks/1234-*.pretty.js`, object `p`): finasteride 1 mg, minoxidil 5% solution, oral minoxidil 2.5 mg,
topical finasteride 0.15%, combination spray 0.15% / 5% / tretinoin 0.015%, biotin 900 micrograms.

Prices are list prices from the feed. A Black Friday sale was running (about 40% off first 6-month orders), so the
"from £x a month" headlines on pages are first-order prices.

One inconsistency left as found: the topical finasteride page says its 0.15% is slightly higher than the Combination
Spray, but the current Combination Spray leaflet and app code both say 0.15%.

## 8. Dead ends and things I did not do

- `sons.co.uk/agents.md` (in the sitemap) answered curl with a Cloudflare "Verifying your connection" page. Left alone.
- I fetched a few page addresses on shop.sons.co.uk that turned out not to exist (`/register`, `/login`, `/health-check`,
  `/healthcheck`, 404 each). They were plain page requests, not API calls. Do not repeat; the real routes are
  `/consultation`, `/beard-consultation`, `/recommendation`, `/customiser`, `/basket`, `/checkout`, `/account`, `/clinics/<slug>`.
- The older page script was not run offline (it needs a page and jQuery). Only read.
- The plan customiser, basket and checkout were not opened beyond downloading their code.
- Legal class (P or GSL) of the minoxidil spray and ketoconazole shampoo not checked on the MHRA register.
- One web search for regulator rulings about Sons found nothing specific.

## 9. What stage 2 should do first

Live walks can only show **which screens appear** before the wall. Product effects sit behind the wall, so test them by
running the site's own code offline and label those results `code`, never `observed`.

Do not try to make the live recommendation page render by planting customer data in browser storage: that imitates a
signed-in customer and is outside the rules.

Suggested order:

1. Live, one change each from `baseline-men.json`, to confirm branching (each should add exactly the screens listed in
   the outline): Suddenly · mood Yes · each of the three past medicines, then side effects Yes · each of the nine
   conditions alone · each of the four hair pictures (expect no change) · Female (done) · existing customer Yes (done).
2. Offline with `scripts/engine-run.js`, the same one-change list, plus: PHQ answers 0 to 3 on each question ·
   date of birth giving 17, 18, 65, 66, 76 · preference 0, 1, 2 · tags `dutasteride_eligible`, `combo_pill_eligible`
   with special type `combo`, `finasteride_disallowed`, `minoxidil_disallowed` · pairs that leave almost nothing
   (for example High Blood Pressure + Sexual Dysfunction should leave only Hair Growth Complex).
3. Read `recommendation-engine.excerpt.js` beside each offline result and note where the older copy would differ
   (section 5). A small jsdom harness could run it if exact card order matters.
4. Check whether anything in the served code reads the hair picture, the sudden-onset follow-ups or the scalp tick boxes
   (I found none). If still none, record them as "prescriber only, effect unknown".
5. Look for public evidence of what the prescriber refuses (reviews, help pages) to fill the gap the code cannot.

## 10. Stage 2 (EXPERIMENT), finished 23 Nov 2026

- Experiment list: `scripts/s2-experiments.json` (exp-01…37, hair flow) and `scripts/s2-experiments-extra.json` (exp-38…45,
  beard, 5 mg step-up, female "Finish Consultation"). Action files are made by `scripts/s2-make.js` / `s2-make-extra.js`;
  replay with `bash scripts/s2-run.sh exp-NN …` (one browser at a time). Log: `runs/s2-batch.log`.
- Offline engine runs: `scripts/s2-offline.js` → `runs/offline/results.json` (off-00…off-58) and `truthtable.json`.
- Everything in company.json for stage 2 (experiments, rules, recommendations, option effects, summary lists) is written
  by `scripts/s2-overlay.js`, which `scripts/build-company.js` calls. Hand-written live results are in
  `scripts/s2-manual-results.json`. Edit those files and re-run `node scripts/build-company.js`, never the JSON.
- The first stage 2 attempt was cut off at exp-27 (browser closed mid-walk). The second attempt re-ran exp-27 and ran
  exp-28…45 and exp-03; all ended normally.
- New live findings in the second attempt: beard flow "Female" is a silent dead end (stays on the gender question, no
  notice; runs/exp-42). "Finish Consultation" on the hair flow's female notice goes to the home page (runs/exp-45).
  5 mg step-up: Yes to side effects opens a free-text box (runs/exp-43 screen 03; a later click in that walk reset the
  answer to No, so only screen 03 counts). Scalp red flags, NHS and GP consents behaved as the definition says.
- Validate: `node tools/validate.js sons --stage rules` passes (43 rules, 73 experiments, 16 profiles).

## 11. Stage 3 (VERIFY), 24 Nov 2026 (in progress)

- An earlier stage 3 attempt (23 Nov evening) left 12 run folders `runs/verify-*` and no notes. This attempt kept them, read
  every one, and continued. Its findings are written into `scripts/verify-results.json` (hand-written results) and applied by
  `scripts/verify-overlay.js`, which `scripts/build-company.js` now calls after `s2-overlay.js`. Rebuild with
  `node scripts/build-company.js`, then `node tools/validate.js sons --stage final`.
- Helper scripts (all small, run with node or bash, no inline loops): `verify-defdiff.js` (survey definition then vs now),
  `verify-freshness.sh` + `verify-oldpage.js` (is the recommendation code still served unchanged), `verify-engine.js`
  (offline re-run of the newer rules, `runs/verify-offline/`), `verify-products.sh` + `verify-products.js` (live product
  pages, `runs/verify-products/`), `verify-catalogue.sh` (live product sitemap), `verify-compare.js` (screen-by-screen
  diff of two run folders), `verify-labels.js` (every "observed" claim must name an existing run folder).
