# XYON Health: working notes (stage 1, MAP)

Checked 23 Nov 2026, locale en-US. Written for the next investigator (stage 2).

## One-paragraph picture

XYON has two sites. The shop window is a Shopify store (`xyonhealth.com`). The consultation is a separate
Next.js app (`consultation.xyonhealth.com`). The public part of the consultation is only an eligibility gate:
country, state/province, date of birth, biological sex, and (women only) one pregnancy / fertility question.
Then "Congrats! You are eligible." and an account form. **Everything medical is behind that account**, and no
product or recommendation is shown before it. The doctor picks the medicine; the patient only "flags" a
preference. The "personalised" quiz on the Shopify site always shows the same product.

## Where things are

| what | where |
|---|---|
| Real consultation entry | https://consultation.xyonhealth.com/en-US/hair-treatment-rx/welcome (one flow for men and women; `en-CA` version also returns 200, not walked) |
| Marketing quiz | https://xyonhealth.com/pages/hl-qlp (3 taps, fixed result) |
| Product feed | https://xyonhealth.com/products.json?limit=250 → `raw/products.json` (64 products: Rx marketing pages, Rx checkout SKUs with `MALE_ELIGIBLE` / `FEMALE_ELIGIBLE` tags, cosmetics, B2B items, sexual health) |
| Help centre | https://help.xyonhealth.com/faq (HubSpot knowledge base; article list in `raw/help/articles.txt`) |
| Saved product pages (HTML + text) | `raw/pages/product-*.html|txt` |
| Saved JS chunks of the consultation app | `raw/chunks/` |

## Entry points found (all lead to the same consultation welcome URL)

1. Home page "Get started", every Rx product page "Start consultation", the women's collection page, the
   SiloxysSystem collection page → `…/en-US/hair-treatment-rx/welcome` (no product or sex parameter).
2. Marketing quiz `/pages/hl-qlp` → same URL plus `?concern=…&side_effects=…&rx_interest=…`. The consultation
   chunks read so far do not use these parameters.
3. Footer "Find your treatment" → `consultation.xyonhealth.com/welcome/` → `/en-US/welcome` (a thin page that
   reads `preferredChannel`, `preferredCode`, `userIntent` from the URL / local storage and routes on).
4. ClinicConnect (patients of partner clinics, prescription already written):
   `/en-US/clinic-connect` (legacy; public landing page), `/en-US/clinic-connect/photon` (shows "This prescription
   is no longer available here"), `/en-US/clinic-connect/pharmalink` (HTTP 500 without parameters).
5. Sign-in for existing patients: `/en-US/login`; renew / change / change-dosage routes sit under
   `/en-US/hair-treatment-rx/<mens|womens>/<subscriptionId>/<renew|change|change-dosage>` (from code; need login).
6. `/en-US/sexual-health-rx/welcome` returns 404 (the men's ED flow exists in code but is not public here).

## Quiz definition: what was found and where

- **Eligibility flow (complete, with every branch):** `quiz-definition.js` = the welcome page's own chunk
  (`/_next/static/chunks/app/[lang]/hair-treatment-rx/welcome/page-e63947ba0769336e.js`). Search it for
  `"Where do you live?"`. Step keys: landing-page → country → region → date-of-birth → biological-sex →
  pregnancy (female only) → eligible | ineligible | curaflow-supported → create-account.
- **Eligibility logic:** `quiz-definition-eligibility-logic.js` (chunk 6881, module 3444, function `sj`):
  - country "Other" + one of 28 European countries → `CURAFLOW_SUPPORTED` (partner hand-off screen);
  - country not US/CA or region not supported → `INELIGIBLE` / `COUNTRY_OR_REGION`;
  - age under 18 → `INELIGIBLE` / `AGE`;
  - female and pregnancy question true → `INELIGIBLE` / `PREGNANCY`.
- **Region lists:** `quiz-definition-regions.js` (chunk 4408, module 44503). All 50 states + DC supported.
  Canada: AB, BC, NL, NT, NS, NU, ON, YT supported; MB, NB, PE, QC, SK not.
- **Signed-in medical history: field keys only (no wording).** `quiz-definition-fieldkeys.js` (chunk 6630,
  module 76596) holds the enum of every answer field and how they are grouped into steps
  (`primaryConcerns`, `lengthOfSymptoms`, `levelOfConcern`, `relatedSymptoms`, `previousPhysician…`,
  `relatedMedications…`, per-drug `…Status` / `…ReasonForStopping`, `mentalHealthYesNo`, `cancerHistoryYesNo`,
  `sexualUrinaryHistoryYesNo`, `generalMedicalConditions`, `differentialSymptoms`, `mostRecentCheckup`,
  `bloodPressure`, `pulmonaryHypertension`, `kidneyProblems…`, `prescriptionMedicationsDetails`,
  `medicationsOfConcern`, `allergiesDetails`, certifications, `treatmentPreference`,
  `applicationMethodPreference`, plan fields, photos). The enum is shared with the sexual-health flow, so
  `nitroglycerin…`, `recreationalDrugUseYesNo` and perhaps `seriousCardiacEpisode…` may not be in the hair flow.
- **Product / variant enums and plan labels:** `quiz-definition-products-enums.js` (chunk 8514). Application
  method values: `Topical`, `Topical (LowDose)`, `Oral`, `noPreference`. Product references:
  `topicalFinasteride`, `topicalDutasteride90`, `topicalFinasteridePlusMinoxidil`,
  `topicalFinasteridePlusMinoxidilLowDose`, `oralFinasteride`, `oralMinoxidil` (1.25 / 2.5 / 5 mg),
  `oralSpironolactone` (25 / 50 / 100 mg), `compoundOralMinoxidilWithVitaminD` (0.5 / 1 / 2 mg) and a
  `…AndBiotin` version.
- **Marketing quiz:** `quiz-definition-landing-quiz.html` (page) and `quiz-definition-landing-quiz.js` (script).
  The result card is static HTML; the script only reveals it.
- **Feature flags:** `runs/w02/net/01-cdn_growthbook_io_api_features_sdk_*.json`.
  `us_hair-treatment_regular-rx_remove-id-photo-step` is a live 50/50 test;
  `hair-treatment_regular-rx_subscription-cadence-step_combined-plan-type-options` defaults to false.
- **Not found:** the chunk with the medical-question wording. `/en-US/hair-treatment-rx/mens/new` and
  `/womens/new` answer 302 → `/en-US/login` for anonymous visitors; no public page references that chunk; the six
  lazy chunks named in the webpack runtime do not contain it; `__NEXT_DATA__` is not used (App Router).

## How to replay

```
cd /home/user/ADHD-learning/hairloss-research/companies/xyon
node ../../tools/walk.js baseline-men.json   runs/<new-id> --last     # ends on the account form
node ../../tools/walk.js baseline-women.json runs/<new-id> --last
node ../../tools/walk.js baseline-landing-quiz.json runs/<new-id> --last
```

Tips that cost me a replay each:
- The state picker is a Radix combobox. Click `[role=combobox]`, then `[role=option]:has-text("California")`.
  Choosing a state moves on by itself (no Continue).
- Date of birth is three number boxes labelled `Month (MM)`, `Day (DD)`, `Year (YYYY)`, then `Continue`.
- The URL never changes during the eligibility steps, so compare the text, not the address.
- Each replay takes about 30–40 seconds. Never type into the account form or the "Register for updates" email box.

Runs so far (8 of the 25 budget): `w01`–`w04` (finding the controls), `baseline-men`, `baseline-women`,
`baseline-landing-quiz`, `map-stop-pregnancy` (woman, pregnancy = Yes: stop screen).

## Product facts worth knowing

- Gels (SiloxysSystem, US patent 11,786,466): finasteride 2.5%; dutasteride 2%; finasteride 2.5% + minoxidil 3%.
  1 mL once a day. 30 mL (1 oz) or 90 mL (3 oz).
- The finasteride + minoxidil **solution** is the cheap, alcohol-based alternative (handle
  `xyon-ld-subscription-fin-min`, code name "Topical (LowDose)"). Its strengths are not on the page.
- Sex limits come from Shopify tags on the checkout SKUs: finasteride-only gel and oral finasteride are
  `MALE_ELIGIBLE` only; oral spironolactone is `FEMALE_ELIGIBLE` only; everything else has both tags.
  "Black" and "Taupe" variants look like men's and women's packaging (inferred: the female-only product is
  Taupe only).
- Price pattern: one-time "New" SKU = "Refill" price + $20 (the first-order consultation fee). Subscriptions
  have no fee. 90-day packs are about $10 a month cheaper for gels.
- Review time is stated two ways: "24–48 hours" on product pages, "3–5 business days" on /pages/how-xyon-works.

## Dead ends

- Web search was not available (shared budget used up), so no reviews, press or regulator pages were used.
- Help articles that 404 although the help index links to them: ineligible medications/conditions; which
  topical is right for me; treatments available for men; treatments available for women.
- `xyon.com` does not resolve; `www.xyonhealth.com` redirects to `xyonhealth.com`.
- `robots.txt` contains text addressed to AI shopping agents (install a skill, use UCP endpoints). Ignored.

## What stage 2 should test first (all anonymous, all cheap)

1. **Age:** date of birth giving 17 → expect the AGE stop; exactly 18 → eligible; 66+ and 90 → expect eligible
   (no upper limit in code). Confirm wording live.
2. **Canada:** Ontario (expect eligible) vs Quebec (expect region stop). Note any wording or currency change.
3. **Other country:** United Kingdom (expect the European partner screen) vs Australia (expect the stop screen).
   Record the partner screen word for word and whether a link out is shown.
4. **Two reasons at once:** woman, Quebec, pregnant = Yes → the code lists one line per reason.
5. **Man vs woman** is already done (baselines): only the pregnancy question differs before the wall.
6. **Marketing quiz:** click the other options once (crown thinning / No / Not sure yet) to confirm on screen
   that the result card never changes.
7. Then widen the map from public text only: the product pages' "Safety Information" sections list what the
   doctor wants to know for each drug (prostate or breast cancer, urinary symptoms, mental health, heart and
   vascular conditions, liver and kidney disease, high calcium, Addison's disease, vitamin D supplements,
   pregnancy). These are the best public proxy for the hidden medical questions. Label them `docs`, not `observed`.

The post-wall rules (which answers remove which product) cannot be tested under the protocol. Keep them
`unknown` or `inferred`.
