# Treated (UK) – hair loss – stage 1 map (working log)

Checked 2026-11-23. Stage 1 (map) investigator. An earlier mapper had saved raw pages, the male quiz definition and
treatment options; this attempt continued from that.

## Where things are
- Public pages: https://uk.treated.com/hair-loss/ (+ /finasteride/, /propecia/, /dutasteride/, /avodart/, /regaine/,
  /finasteride-minoxidil-drops/, /compare/). Copies in raw/*.html and raw/*.txt.
- Consultation app: https://start.treated.com/GBR/en/#/choose-gender/024 (024 = hair loss condition code).
  Entry from uk.treated.com/consultation-startup?condition=024&uf=cond ("Start now").
- Quiz definition: JSON the app fetches from start.treated.com/gbr/catalog/getquestionsbycountry (saved as
  quiz-definition-male.json). Each option carries frontendAction (Proceed / OfflineTreatment / Block / FollowupQuestion),
  blocker text and follow-up questions.
- Product-specific "secondary questions": start.treated.com/gbr/catalog/getsecondaryquestions (after Save on a product).
- Treatment options + auto-offer restrictions: start.treated.com/gbr/prescription/gettreatmentoptions
  (saved as treatment-options-baseline-men.json; readable dump raw/options-baseline-men.txt via scripts/dump-options.py).

## Flow (men, observed runs/b1-men, b3-men-save, b4-men-wall)
choose sex (+ 18+ / terms confirmation) → 11 questions → GP info → height/weight → medical profile (9 toggles) →
"Does this look right?" → "We're checking what's safe for you..." → treatment options (pre-selected Finasteride 1mg x28,
£34.95/month; Edit; Choose for me) → Save → product secondary question (finasteride warning, "I understand") →
checkout = ACCOUNT WALL (first name, last name, DOB, email, phone). Stopped there.

## How to replay
node tools/walk.js companies/treated/scripts/b1-men-to-options.json companies/treated/runs/<id> --last
(baseline-men.json = same answers + Save; do not go past the checkout screen.)
