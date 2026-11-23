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
