# LloydsPharmacy Online Doctor (UK): working notes

Stage 1 (MAP), started 23 Nov 2026. Work in progress: this file is rewritten as findings come in.

## Where things are (so far)

- Shop front is Shopify: `https://onlinedoctor.lloydspharmacy.com/` (curl works, no bot wall).
- Consultation engine is a separate app: `https://core.onlinedoctor.lloydspharmacy.com/` (header `x-application-context: eh-consultation-questionnaire-web`).
- Hair-loss collection: `/collections/hair-loss`. Men only ("These treatments can only be prescribed to men").
- Entry URLs (both 302 to `/loginprompt/0?return_url=…`):
  - `https://core.onlinedoctor.lloydspharmacy.com/api/questionnaire/clinic/hair-loss` (every product page button)
  - `https://core.onlinedoctor.lloydspharmacy.com/api/questionnaire/products/3756` (collection page top button; 3756 = "clinicPageDefaultSku")
- The login prompt offers "Continue as a new patient" → `…/api/questionnaire/clinic/hair-loss?guest`. No sign-in needed to start.
- From a non-UK address a "This service operates in the United Kingdom only" pop-up shows; "Continue with UK service" closes it. Not bot protection.
- The guest page (`/pages/preconsultation`) fetches `GET https://core.onlinedoctor.lloydspharmacy.com/api/questionnaire/clinic` (53 KB JSON): saved as `quiz-definition.json` (first two screens + 7 products with prices and the result-card text). A readable dump is `quiz-definition.readable.txt`.

## Saved pages

`pages/*.html` and `pages/*.txt` (text versions). `pages/products-embedded.json` = every product/variant object embedded in the product pages (prices in pence).

## Interim findings (saved early in case of interruption)

- The questionnaire itself is an old Angular app at `/consultation/current`, fully **server-driven**: after each answer the
  page POSTs the answer to `/api/questionnaire/traversals/<id>/steps/current` and GETs the same URL for the next step.
  So there is **no complete quiz definition in the client**; branches must be found by walking.
- Guest walk works with no sign-in all the way to a "Your Recommendations" screen (question 107988, type PRODUCT_CARD).
  Order seen for the baseline man: sex at birth → date of birth (+ "I confirm I am 32 years old" tick) → "Learn more" prompt
  → 3 info screens → hair-loss picture (6 options) → how it started → other body hair → scalp changes → ever taken hair-loss
  medication → conditions list (12 + None) → CKD → heart/blood pressure → other conditions → prescription medicines →
  allergies → partner pregnant / trying → pets → "Clinically proven results" info → answers summary ("Your Consultation")
  → recommendations.
- Walker: `tools/explore.js <policy.json> <outDir>` (in this folder). Policy = answers keyed by the site's questionId.
  Raw step JSON for every screen is in `runs/<run>/steps/step-NN.json`; every API call in `runs/<run>/network.jsonl`.
- Date of birth is the site's age question. A fictional date was used (15/06/1994). No name, email, phone or address was entered.
