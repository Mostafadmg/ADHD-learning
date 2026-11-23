# Boots Online Doctor (UK): working notes

Stage 1 (MAP) finished on 2026-11-23. Written for the next investigator (stage 2: one-change experiments).
Evidence labels as in `tools/PROTOCOL.md`: observed / code / docs / inferred.

## 1. What this site is (short)

- Marketing site: https://onlinedoctor.boots.com/ (static pages behind Imperva/Incapsula).
- Consultation app: https://onlinedoctor-clinic.boots.com/ (AngularJS + Angular single-page app).
- Platform: Lemonaid Health UK "PIMS" (`prod-api.lemonaidpims.co.uk/v2.0/…`). Provider: Boots Digital Health Ltd (CQC).
- Hair loss is **men only**. Service `HAI` (genders `["male"]`, age 18 to 120) with two child services:
  `HAI-F` (first time) and `HAI-R` (returning). **There is no women's hair-loss service** (only facial hair *removal*).
- Products: finasteride 1 mg, Propecia 1 mg, and each bundled with "Regaine foam extra strength" (73 ml cans).
  18 packs per child service. One-off packs, no subscription. Prices in `company.json`.
- **No recommendation engine.** The patient picks medicine + pack *before* the medical questions. That pick selects one
  of four fixed questionnaires. A clinician decides after ID photos, account and payment details.

## 2. The four routes (one entry URL)

Entry for everything: `https://onlinedoctor-clinic.boots.com/Hair-Loss` (every "Get started" button goes there).

| route | "used before?" | product kind | questionnaire id | saved definition | questions |
|---|---|---|---|---|---|
| first-tablets | First time | Finasteride / Propecia alone | 2049 | `quiz-definition.json` | 35 on 19 screens |
| first-bundle | First time | tablets + Regaine foam | 2050 | `quiz-definition-combo-regaine.json` | 38 on 21 screens |
| returning-tablets | Returning | tablets alone | 2051 | `quiz-definition-returning.json` | 36 on 19 screens |
| returning-bundle | Returning | tablets + Regaine foam | 2052 | `quiz-definition-returning-combo-regaine.json` | 39 on 21 screens |

(The service list names older ids 1174 and 1176; the live order task points to 2049 to 2052.)

Screen order (observed, `runs/baseline-men`):
1. "What's your postcode?" 2. "What's your birth gender?" (Female / Male) 3. "What's your date of birth?"
   → the site itself creates a placeholder temporary user (`POST users/temp`; name/email are auto-generated placeholders).
4. "Have you used this service before?" (First time / Returning)
5. "Which medicine do you prefer?" (tiles; more behind "See more treatment options")
6. Product page (Continue) → creates a draft order, status "Not submitted", tasks:
   Health Questions → ID Photos → Account-Setup → Delivery → Payment.
7. "Important info" + tick box "I understand the important information above."
8. Health questions, one screen per section (`/questions/1` … `/questions/19`), progress shown as a percentage.
9. `/camera/id`: "Let's confirm it's you … a selfie, a photo of your ID" → **the wall. Stop here.**

## 3. The quiz definition (the main find)

- Served as plain JSON to the anonymous temp session: `GET prod-api.lemonaidpims.co.uk/v2.0/questionnaires/<id>`.
  It is only fetched after product page → Continue → Important info, so you must walk that far. Do **not** call it
  directly with made-up ids (protocol: only URLs the page itself called).
- Shape: `sections[] → questions[] → options[]`. Per question: `type` (`select`, `gp_address`), `max` (1 = radio
  buttons; missing = tick boxes), `required`, `display_condition {parent_question_id, options[]}`.
  Per option: `status` (0, 2 or 3), `exclusive`, `details` (+ `hint`, `type` text/address).
- **Branching** is one level only: a follow-up is shown when its condition lists an option chosen on the *first*
  question of the same section (app code, `raw/questionnaire-ctrl-snippet.js`).
- **Option `status`**: 0 = plain; 2 = sits on "tell me more" answers (amber: inferred); 3 = sits on answers such as
  smooth circular patches, complete baldness, painful scalp, "not effective", partner trying to conceive, suicidal
  thoughts, galactose intolerance, high blood pressure (bundles), and every "I will stop my consultation" choice
  (red: inferred). **The app never reads `status`**: Next always works and the flow goes on to ID photos. So on the
  website there are no hard stops inside the questionnaire. What the server or clinician does with a red flag is unknown.
- Answers are posted once, after the last question (`postTask`). After the baseline, the order showed
  Health Questions task status 3 and order `admin_status` 4.1 (`runs/baseline-men/net/89-…orders_….json`).

## 4. Where things are in this folder

- `company.json`: the map (built by `node scripts/build-company.js`; edit that script, not the JSON, for stage 1 facts).
- `quiz-definition*.json`: the four served definitions (untouched copies).
- `baseline-men.json`: the walked baseline (first-time, tablets only). Run folder `runs/baseline-men` (64 steps).
- `baseline-men-first-bundle.json`, `baseline-men-returning-tablets.json`, `baseline-men-returning-bundle.json`:
  **generated** by `scripts/make-walk.js`, not yet replayed end to end.
- `scripts/make-walk.js`: builds a walk file for any route with answer overrides (see section 5).
- `raw/`: saved pages, served API JSON, app JavaScript (`raw/js/`), code snippets cut from the bundle.
- `runs/`: `w00`…`w07` (finding the way in), `baseline-men`, `r01-returning`, `c01-combo-regaine`,
  `c02-returning-combo` (each to the first health question), `d01-docs` (public information pages as text).
- `shots/`: 8 key screenshots.

## 5. How to replay and how to run a one-change experiment

```
cd hairloss-research/companies/boots-online-doctor
node ../../tools/walk.js baseline-men.json runs/<run-id> --from 24        # about 4 minutes; use a 600000 ms timeout
node scripts/make-walk.js first-tablets scripts/exp-x.json scripts/my-override.json   # then walk scripts/exp-x.json
```

Override file example (`scripts/example-override-partner-trying.json`):
`{ "partner pregnant": "My partner is trying to get pregnant" }` . Keys are regular expressions on the question text;
values are an option label, a list of labels, or `{"label": "…", "details": "free text"}`. Follow-ups are added
automatically; if one has no answer the script stops and tells you what to add.

Things that tripped me up:
- The postcode box only validates on **keyup**: use `click` on `input[name=zip]` then `type` (not `fill`).
- Date of birth: `click` `#dob-preflight`, then `type` eight digits (`15061994`); the mask adds the slashes.
- Product tiles are `[role=button]` divs: `[role=button]:has-text("£28")`. Bundles need "See more treatment options" first.
- The "Important info" tick box: click `label[for=agreeRadio]`, then `#important-info button.btn`.
- Answers: `.radio-answer:has(label:text-is("…"))` / `.checkbox-answer:…`; Next: `button.questionnaire__btn-next`.
  If an exact-label click fails (odd apostrophes), switch to `:has-text("short unique part")` as in `baseline-men.json`.
- What to compare between runs: the screens, and the **last `net/*orders_<id>.json`** of the run (order `status`,
  `admin_status`, the task list and each task's status), plus the final URL.

## 6. What stage 2 should test first (highest value first)

1. **Does a red-flag answer change anything the website shows or the order JSON?** One change each:
   partner trying to conceive; "Random patches" + circular patches "Yes"; "Complete" + complete baldness "Yes";
   suicidal thoughts; painful/pus-filled scalp; "I … will stop this consultation now". Compare final URL, order
   `admin_status`, task list. Expectation from code: no on-screen change.
2. **Sex and age gates** (cheap, stop at preflight): Female; date of birth giving 17, 18 and 70+ years.
3. **Bundle route** (`first-bundle`): age band "50 years or older" (off-label follow-up; "I'd rather NOT have Regaine");
   blood-pressure medicine "Yes" → "change my prescription to tablets alone" vs "No"; scalp skin "Yes";
   condition "High blood pressure". Check whether the order's product changes (expect not).
4. **Does Propecia use the same questionnaire as generic finasteride?** Pick `£55` (first time) and read the
   `questionnaires/<id>` request. Same for the Propecia bundle (`£72`).
5. **"Out of stock" tiles in the first-time list**: can they be clicked? (If not, first-time patients are limited to
   one month.) Re-check on another day to see whether the stock flags move.
6. **Already on finasteride** = "Yes": follow-ups (effective? side effects?), and the extra returning-only question.
7. Scalp condition ticks, "Suddenly", "Within the last month", hair loss elsewhere, prostate medicine, other medicines
   (needs free text: use a medicine name, never personal details), allergies, "False" on the understanding check.
8. Unsupported postcode (a Jersey `JE…` postcode is refused in the browser, per code).

Do **not** choose "Yes" on the GP question (it opens a GP practice search = third-party details), and never go past
`/camera/id`.

## 7. Rules I followed, judgement calls, footprint

- No email, name, phone, address, password, photo or payment was entered. No sign-in. Nothing was submitted for review
  (orders stay "Not submitted").
- **Postcode judgement call.** The first screen needs a postcode before anything else. I treated a postcode on its own
  as a location/eligibility answer (like "which country"), not a contact detail, and used `N1 0QH`, the placeholder
  postcode hard-coded in the site's own app for another service. If the project owner counts a postcode as an
  "address", stop live walks and rely on the saved definitions.
- **Temporary user.** After date of birth the site creates its own placeholder user and token (no input from us).
  I treated that as an anonymous session, not an account.
- Footprint: 16 browser sessions; about 12 placeholder temp users and 7 draft orders were created, one with baseline
  answers posted. Keep stage 2 lean (each replay adds one of each).
- Bot protection: curl to the marketing site was blocked after about five quick requests (Incapsula page). The normal
  browser was never challenged. Nothing was done to get round it. Go slowly.

## 8. Public documents read (text copies in `runs/d01-docs/*.txt`, `raw/*.txt`)

- Service page `/propecia-online`: "From 67p per tablet", "Clinical review within 2–24 hours", "repeat prescriptions
  for up to 12 months without the need for another consultation"; approved by Dr Mark Perera, reviewed 17/04/2023.
- `/propecia-online-important-info`: "This service is not suitable for women or for men with hair loss that's not
  caused by male pattern baldness."; pregnancy warning; "If you're still losing your hair after 12 months of
  treatment, it's unlikely it will work for you."; Regaine alone is sold on boots.com. Reviewed 21/06/2021.
- `/propecia-online-helpful-info`: male pattern baldness explainer; other causes → see GP.
- `/treatments/finasteride`: 1 mg once daily; 5 mg not prescribed for hair loss; side effects; alternatives.
- `/pick-up-and-delivery`: pick up in any Boots pharmacy (not Jersey/Guernsey) within about 2 business hours of the
  prescription; free Royal Mail Tracked 48; discreet packaging.
- `/faq`, `/patient-guide`, `/off-label-medicines`: saved; FAQ answers are collapsed and were not expanded.
- Not read: terms and conditions, privacy policy.

## 9. Dead ends and oddities

- `propecia-online-helpful-info` / `-important-info` via curl → Incapsula block page. Fine in the browser.
- The app has public routes `/preflight/products/:service` and `/eligibility/:service` in its route table; the
  hair-loss entry does not use them and I did not open them.
- Content oddities: "Tick all that apply" on a single-choice question (tablets route); age bands "Between 18 and 50"
  and "50 years or older" overlap; the content JSON still holds asthma-inhaler and "Lorem ipsum" placeholder text and a
  hidden `HAI-F-No-Choice` product entry; bundles ask an age band although the date of birth is known.
