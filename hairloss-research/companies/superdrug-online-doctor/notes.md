# Superdrug Online Doctor (UK): working notes

Stage 1 (MAP) finished 23 Nov 2026. Written for the next investigator (stage 2: one-change experiments).
Everything here is from public pages and anonymous consultation steps. No account, no contact details, no photos,
no payment. Nothing was typed into the sign-in screen.

## 1. What this company is (in one minute)

- https://onlinedoctor.superdrug.com/ is run by **Health Bridge Ltd** (the Zava platform) under the Superdrug brand.
  The assessment app, the questionnaire format and the API paths are Zava's.
- It is a classic doctor-led service, not a recommendation quiz: **one-page questionnaire → pick a product yourself →
  delivery → create account → pay → doctor reviews**.
- Hair loss has **three entry points and two questionnaires**:

| Entry | URL | Service id | Questionnaire | Product filter by answers |
|---|---|---|---|---|
| Men ("Request Treatment") | `/assessment/147929` (from `/hair-loss-consultation.html`) | 147929 "HAIR LOSS SD 2" | 201037 v7 | **off** (`fhir_product_filter_enabled: 0`) |
| Women, "Request Regaine for Women" | `/assessment/147757` | 147757 "SD Regaine Women" | 201132 v8 | **on** |
| Women, "Request Nourkrin" | `/assessment/147778` | 147778 "SD Nourkrin Woman" | 201132 v8 (same) | **on** |

- Age and sex are **not asked in the questionnaire**. They are first asked on the account-creation screen
  (date of birth, gender), which comes after the product and delivery choice.

## 2. Where things are in this folder

| File | What it is |
|---|---|
| `company.json` | The map. Rebuild it with `python3 local-tools/build-company.py` (edit the script, not the JSON, or edit the JSON and stop using the script: pick one). |
| `quiz-definition.json` | Men's questionnaire, the FHIR JSON the page fetched (`/questionnaire-api/Prod/Questionnaire/201037`), full copy with the option pictures embedded. |
| `quiz-definition-women.json` | Women's questionnaire (`…/Questionnaire/201132`). |
| `quiz-outline.txt` | Both definitions as plain text: every linkId, option code, required flag and show-when condition, plus the page selectors. **Read this first.** |
| `pattern-images/` | The six hair-pattern pictures (A–E and "No pattern fits well") cut out of the men's definition. A = no loss, B = temples, C = temples + crown spot, D = larger, E = bald top. |
| `assessment-api.json`, `products-api*.json` | Copies of `/ecommerce/api/v2/assessment/147929` and `/ecommerce/api/v2/product/<service>` as served to the anonymous page (product ids, prices in pence, delivery modes, leaflet-style text). |
| `baseline-men.json` | walk.js answer file: baseline man to the "Your request" screen. |
| `baseline-women-regaine.json`, `baseline-women-nourkrin.json` | Baseline woman through each women's entry to "Your request". Written for `local-tools/capture.js`; they also run in walk.js. |
| `actions/baseline-men-to-wall.json` | Baseline man on through product (84 generic tablets), Delivery (free standard) and Next, to the sign-in wall. |
| `local-tools/capture.js` | Like walk.js, but keeps **small API replies and POST bodies** (walk.js drops bodies under 300 bytes, which hides the two replies that matter). Writes `api.jsonl`. |
| `local-tools/pages.js` | Opens a list of public pages in one browser and saves full text (walk.js cuts text at 12,000 characters). |
| `runs/` | Evidence. See section 6. |
| `shots/` | 7 key screenshots. |

## 3. How to replay

```bash
cd /home/user/ADHD-learning/hairloss-research/tools
C=../companies/superdrug-online-doctor
# men, to the product screen (walk.js)
node walk.js $C/baseline-men.json $C/runs/<run-id> --last
# any flow, keeping the API replies (use this for experiments)
node $C/local-tools/capture.js $C/baseline-women-regaine.json $C/runs/<run-id>
```

Things that will trip you up:

1. **Cookie banner.** It covers the form and swallows clicks. Every answer file must click
   `#onetrust-reject-all-handler` ("Deny Cookies") first. walk.js does not know this banner's button names.
2. **"Request Treatment" does not navigate in the robot browser.** Use a `goto` to `/assessment/<id>`.
3. **Use selectors, not text.** There are a dozen "Yes"/"No" radios. The names follow the definition:
   - single choice: `input[name='SingleChoice-option<linkId>'][value='<code>']`
   - multi choice: `input[name='MultiChoice-option<linkId>'][value='<code>']`
   - yes/no: `input[name='<linkId>'][value='true']` or `'false'`
   - tick box: `input[name='Disclaimer-option<linkId>']`
   - submit: `button[data-qa='cdc-questionnaire-submit']` (greyed out until every required item is answered)
   - product screen: the radios are plain `input[type=radio]` in list order; the Order button is `button:has-text('Order'):visible`.
   The inputs are visually hidden, so a normal click times out and the tools fall back to a forced click. That works.
4. Free-text follow-up boxes were never opened, so their selectors are not known yet. Typing made-up medical free text
   is allowed; contact details are not.
5. One full replay takes about 2 to 3 minutes. curl is blocked (HTTP 403); the Playwright browser is not.

## 4. What the engine does (evidence so far)

**Men (service 147929)**

- Sequence seen in `runs/baseline-men-wall/api.jsonl`:
  `GET questionnaire-api/Prod/Questionnaire/201037` → `POST /uk/api/v2/assessment/saveQuestionnaireResponse?serviceId=201037`
  (reply `"data":[]`) → `POST /ecommerce/api/v2/section/1039315014` (just a "tick") → `GET /ecommerce/api/v2/product/147929`
  → `POST /ecommerce/api/v2/product/147929 {"selected_product":…}` → `GET /ecommerce/api/v2/delivery/147929/<product>`
  → `POST /ecommerce/delivery/info` → redirect to `/auth/register/?redirect=…#/checkout/checkout-address`.
- The assessment script only filters products when `fhir_product_filter_enabled` is on
  (`applyClinicalProductFilters` in `runs/baseline-men-delivery/js/…assessment_legacy….js`). For men it is 0, and no
  filter call was made. So, by the code, **no answer should change the men's product list**; the doctor screens after payment.
  This still needs one or two live checks (see section 5).
- On-screen branches are all in `quiz-outline.txt`: follow-up boxes, three warning texts (advanced pattern E, scalp
  changes, erection problems) and a photo request for patterns A, E and "No pattern fits well". None of them is a stop
  in the definition.
- The definition is tagged `zava.questionnaire_evaluator.cds`. That is probably a server-side scorer that flags answers
  for the doctor (inferred from the name only). Nothing from it came back to the browser in the baseline run.
- Odd detail: follow-ups use `operator: "exists"` with `answerBoolean`. Standard FHIR would read that as "is answered /
  is not answered", but the page treats it as "equals Yes / equals No" (seen: "Have you taken finasteride before?"
  appears only after answering No, and the baseline No answers did not open any warning).

**Women (services 147757 and 147778)**

- Same sequence, plus one more call after the product list loads:
  `POST /consultation-triage/product-rules` with the whole QuestionnaireResponse. Baseline reply:
  `{"status":{"code":200,"message":null},"data":[],"meta":{},"errors":[]}`.
- The script then removes every product whose id is in `data[].suggestions` (`filterProducts`). So for women the
  anonymous engine **does** remove products by answer. The rules live on the server; only the replies show them.
- Product ids: Regaine for Women 9895328, Nourkrin 9895329, Alpecin Caffeine 9895330, Alpecin Double Effect 9895331,
  Telephone Consultation 9894989. (Men: finasteride 9895411 / 9895567 / 9895412 / 9895413, Propecia 10649 / 9895566 /
  10650 / 9870126.)

**Account wall** (`runs/baseline-men-wall/28.txt`, `shots/06-…`): "Create your patient account": first name, last name,
email (verification code), password, date of birth (years 2011 back to 1900), gender (Female / Male), optional mobile,
marketing tick, terms tick. After it (not seen): address, "Your Order", payment, "Payment Successful". The Help page
says a photo-ID check may be asked for and that the doctor can put an order on hold and message the patient.

## 5. What stage 2 should test first

Use `capture.js` and read `api.jsonl` after each run. Change one answer from the baseline file each time.

Women (most likely to show real rules; look at the `product-rules` reply and the product list):
1. `SingleChoice-option718` = 7182 (I'm pregnant), then 7184 (I'm breastfeeding).
2. Allergy = Yes (`49` true), then one tick at a time in `MultiChoice-option49.1`: 101 Minoxidil, 117 Fish, 118 Caffeine,
   119 Ethanol, 120 Propylene glycol, 112 Peanuts or Soya, 47703008 Lactose, 111 Penicillin.
3. `38341003` true (high blood pressure); `719` true (heart condition; a required details box opens).
4. Each tick of `MultiChoice-option717`: 728 shaved scalp, 724 sudden or patchy, 725 scalp skin problems, 726 childbirth.
5. Does the reply ever empty the list, or leave only the phone consultation? Is any message shown?

Men (expected: no change to the list; confirm it and look for any stop):
1. Conditions `MultiChoice-option723`: 254837009 Breast cancer, 254900004 Prostate cancer, 235856003 Liver (details box).
2. Pattern `SingleChoice-option298000004`: 5 (E: warning tick `Disclaimer-option2980000045` and photo item), 1 (A), 6.
   Check whether Next works **without** photos (the item is not flagged required). Do not upload anything.
3. Allergy to finasteride: `49` true then `MultiChoice-option49.1` = 386963006.
4. `021106` false (erection problems), `716` true (scalp changes), `SingleChoice-option602` = 162463006 (Suddenly),
   `SingleChoice-option276131009` = 1 (in the last month), `2304202` true (already on finasteride).
5. Compare `saveQuestionnaireResponse` replies: does `data` or `errors` ever carry anything?

Cannot be tested without an account: age limits, a woman entering the men's service, ID check, what the doctor refuses.

## 6. Runs

| Run | What it shows |
|---|---|
| `runs/scout-hairloss` | `/hair-loss.html` is a 404 (dead end). |
| `runs/scout-catalogue` | Men's service page, category pages, finasteride page (walk.js; text cut at 12,000 characters). |
| `runs/consult-00`, `consult-01` | Consultation entry page; the "Request Treatment" click that does not navigate. |
| `runs/consult-02` | First load of `/assessment/147929`; where the questionnaire JSON was first seen (`net/12-…`). |
| `runs/baseline-men` | **Baseline man** to "Your request" (walk.js). |
| `runs/baseline-men-capture-a` | Same with capture.js; stopped at the Order button (wrong selector). API log is valid. |
| `runs/baseline-men-delivery` | Baseline man to the Delivery step; `js/` holds the served scripts that were searched for engine logic. |
| `runs/baseline-men-wall` | **Baseline man to the sign-in wall.** `28.txt` is the wall screen. |
| `runs/women-open` | First load of both women's assessments (full-page screenshots). |
| `runs/baseline-women-regaine` | **Baseline woman via Regaine entry** to "Your request"; first `product-rules` call. |
| `runs/baseline-women-nourkrin` | **Baseline woman via Nourkrin entry**; same five products, Nourkrin first. |
| `runs/scout-products` | Propecia, Regaine for Men, Alpecin, topical finasteride, minoxidil, women's page, services list. |
| `runs/pages-1` | Sitemap, Regaine for Women, Nourkrin, finasteride side effects, discounts, how it works, Help/FAQ, terms, regulation (full text). |

About 16 browser sessions were used.

## 7. Findings worth knowing

- **Regaine for Men and Alpecin are advertised for men but not orderable in the men's flow.** The men's service page
  lists both in its price table and their pages have a "Request Hair Loss Treatment" button to service 147929, but the
  men's "Your request" screen offered only finasteride, Propecia and the phone consultation. No separate men's Regaine
  service was found in the sitemap or the services list.
- **No topical finasteride, no oral minoxidil, no dutasteride.** The topical-finasteride page says outright:
  "While Superdrug Online Doctor does not offer topical finasteride, we do offer finasteride in tablet form."
  The dutasteride and minoxidil pages are articles.
- **No subscription.** Every supply is a one-off order; repeat supplies use a "reorder" button and a short repeat
  assessment (men's repeat questionnaire id 201038, signed-in only, not fetched).
- **Discount codes disagree:** HL40 (40% off) on the service, finasteride and Propecia pages; HL30 (30% off) on the
  Regaine for Men and Alpecin pages. Only HL40 is in the promotions terms.
- **Phone consultation text contradicts itself:** the product name says "Available 2-3pm Friday", its description says
  Tuesday, Wednesday and Thursday.
- The men's questionnaire has **no question on depression, family history or planning a baby**; these are covered by one
  long consent tick. The women's has **no question on periods, menopause, contraception or trying to conceive**.
- Terms: 18 or over for this service. Payment is taken when the order is placed and refunded if the doctor declines.
- Our browser was tagged `clientIPCountryCode: "US"` in the served settings but was not blocked; the page only shows
  "This service is only available in the UK."

## 8. Dead ends

- curl: HTTP 403 on every page.
- `/hair-loss.html`: 404.
- No `__NEXT_DATA__` (the site is not Next.js). The assessment is an AngularJS shell with Vue micro-frontends
  (`/widgets/ws-ecommerce-ui/prd/mf-clinical-data-capture/…`). The questionnaire renderer has no hard-stop feature of
  its own: only show/hide, required fields and validation.
- The product-rules themselves are not in any served file; they sit behind `/consultation-triage/product-rules`.

---

# Stage 2 (EXPERIMENT), 23 Nov 2026: working log

Tools added in `local-tools/`:
- `exp.js <actions.json> <outDir> [--nosubmit]`: fast replay (about 30 s). Saves `pre.txt/jpg` (questionnaire as answered, every control),
  `post.txt/jpg` (next screen), `api.jsonl`, `summary.json` (product ids on screen, product-rules reply, save reply).
- `make-experiments.py`: writes every one-change answer file to `actions/exp-*.json` (+ `actions/experiments-index.json`).
- `run-batch.sh exp-w01 exp-w02 …`: runs them one at a time in the foreground, retry once after 30 s.
- Free-text boxes are `textarea[id='<linkId>']` (for example `textarea[id='719.1']`).
- Wait about 1.5 s after the cookie-banner click, or the next forced click lands on the fading banner (exp.js does this).

Interim results (women, Regaine entry; product-rules reply in each run's `api.jsonl`):
- pregnant (exp-w01), breastfeeding (exp-w02): reply empty, all five products still shown.
- high blood pressure (w03), heart condition (w04), shaved scalp (w05), sudden or patchy (w06), scalp skin problems (w07),
  childbirth (w08), minoxidil allergy (w11): reply `suggestions:[9895328]` → Regaine for Women removed.
- fish allergy (w12): `suggestions:[9895329]` → Nourkrin removed.
- other health condition 'hay fever' (w09), medicine 'cetirizine' (w10): nothing removed.
