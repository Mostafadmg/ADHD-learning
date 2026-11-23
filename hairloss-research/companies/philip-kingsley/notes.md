# Philip Kingsley (PK Lab): working notes

Stage 1 (map) done 23 Nov 2026. `node tools/validate.js philip-kingsley --stage map` passes.

## The short version

- One entry point for everything: https://hairloss.philipkingsley.co.uk/ ("Select quiz"). Every "assessment", "get started",
  "find your plan" and "book a consultation" link on the men's page, the women's page, /hair-loss/pklab, /female-hair-loss and
  the product pages goes there. Two other routes skip the quiz: the header "BOOK A CONSULTATION" (phorest.com clinic booking)
  and the header "HAIR QUIZ" (/hair-quiz, a haircare product quiz, not looked at).
- Three quizzes: men_quiz (12 questions), women_quiz (12), scalp_quiz (10). All were walked live to the account wall.
- **Account wall:** straight after the last question, BEFORE any result ("Almost done! Your details": first name, last name,
  date of birth, email, password, GP tick, consent tick). Results (plan list or consultation screen) come only after
  POST /quiz/step/register. A man whose answers block every product meets the same wall with no warning (exp-01).
- **The whole quiz definition is served to anonymous visitors.** Each quiz page calls `quiz.loadState({...})` with: every
  step's HTML (questions, options, show-if conditions), the step order, the product rules and the consultation screen.
  Saved as `quiz-definition-men.json`, `quiz-definition-women.json`, `quiz-definition-scalp.json`.

## How the engine decides (from src/quiz.min.js)

- Each SKU has a rule with `conditions` (must be true) and `blockers` (must be false). Composite and/or trees; a leaf matches a
  question by its LABEL text and checks whether any (or, for "and", all) listed values are among the answers ("|"-joined for
  multi-select). Unanswered: blockers default false, conditions default true.
- The plan list = every SKU that passes, in groups "Recommended" / "Other" (women: "Complete Your Routine" add-ons).
- No SKU passes -> template `no_results` = "CHOOSE YOUR CONSULTATION TYPE ... Book your first Consultation with your
  Trichologist" with a booking calendar. `no_results_rules` (men only) all point to empty templates, so the default screen is used.
- Python port: `scratch/engine.py`. Tables: `extracted/men-one-change-code.json`, `extracted/women-one-change-code.json`,
  `extracted/men-pattern-density-age-code.txt`. Readable rules: `extracted/rules-*.txt`, `extracted/rules-men-compact.txt`.

## Key findings (all "code" unless marked)

- Men -> consultation: noticed none yet; sudden or not-started loss; scalp pain/burning/crusting/bleeding; cancer/PSA;
  depression/anxiety (either answer to the finasteride warning); trying for a baby; allergy to both actives; severe itching or dandruff.
- Men: Patchy, Extensive, Temples-and-Crown-with-reduced-density (unless scalp visible), Early signs (unless "thinned/receded
  noticeably"), psoriasis, redness, acne, other -> every named plan removed, only unmapped SKUs PHI1220/PHI1221 left.
  If the server hides those, these people reach the consultation screen. Cannot be tested without an account.
- Men 50+ with Early signs or Temples lose oral finasteride and the 5% Combination Plan.
- Configuration errors: blood-pressure value has a leading space (BP does not block minoxidil); 3% Combination Plan rule expects
  "Temples & Crown with Reduced Density" (never fires); PHI1230 uses the wrong question label; PHI1770-1772 contradict themselves;
  the redness Moderate/Severe options carry the label "How severe is the redness??"; Q2 internal label differs from screen text.
- Women -> consultation: pregnant/breastfeeding; chemo; circular patches, band-like recession, something else; redness, psoriasis,
  acne, other/not sure, moderate or severe itching/dandruff/eczema; minoxidil or other allergy; taking oral minoxidil.
- Women gap: sudden onset blocks every picture except "Seeing more of my scalp or wider parting".
- Women: menopause/HRT answers are unused; no finasteride product is ever offered to women online.
- Women shedding -> Hair Shedding Drops (cosmetic, PKC145) instead of the main product PHI1749.
- Women Q6-Q9 (scalp type, texture, length, styling) only choose a "Complete Your Routine" haircare add-on.

## Products (SKU map)

Product pages on the hairloss store show "id name image price GBP ... sku:PHIxxxx" in the page text. Found via web search
(the www copies of the plan pages now say "not available"; the same paths work on hairloss.philipkingsley.co.uk):
PHI1300 Minoxidil 3% £36 · PHI1301 Minoxidil 5% £40 · PHI1302 Topical Combination Plan £58 · PHI1303 Oral Finasteride £40
(www £42) · PHI1304 3% Combination Plan £76 · PHI1305 5% Combination Plan £80 · PHI1308 Healthy Scalp Topical Combination Plan £100
· PHI1310 3% Healthy Scalp Combination Plan £118 · PHI1311 5% Healthy Scalp Combination Plan £122 · PHI1223 The Combination Plan
£216 (www only) · PKC145 Hair Shedding Drops £65. Not named: PHI1220, PHI1221, PHI1230, PHI1306, PHI1307, PHI1309, PHI1770-1772,
PHI1749, women's add-ons PHI1651-1694/PHI1827, scalp products PHI1618-1646. A web search for the SKU codes found nothing.
Leaflets (www /pklabs-patient-information*) give strengths and say "unlicensed ... made and dispensed under pharmacist supervision".
Clinic price list (/treatments): Initial Consultation & Clinical Treatment from £345; Virtual Initial Consultation from £200;
follow-up from £150. The virtual consultation page still says "from £150".

## How to replay

`node tools/walk.js companies/philip-kingsley/baseline-men.json <outDir> --last` (same for baseline-women.json,
baseline-scalp.json). Answers are clicked by CSS selector `.pk-quiz-control[data-quiz-question="qX"][data-quiz-selection="..."]`;
multi-select steps and steps with a text box need `button.pk-quiz-action.Next`. Single-select steps advance by themselves.
Women Q10 "No" advances by itself (no text box); men Q10 needs Next. The answers that were stored are in each run's storage.json
(`quizData`). Never fill the "Your details" form.

To change one answer: copy the baseline file and swap one selector (example: `scratch/exp-men-q8-pain.json`).

## Runs

r01 men's page · r02 assessment root · r03 men's step 0 · r04 men try · r05 baseline men (to wall) · r06 women try ·
r07 baseline women (to wall) · r08 baseline scalp (to wall) · exp-01 men Q8 = Pain (same wall, no warning). 9 replays in all.

## What stage 2 should do first

1. Nothing past the wall can be seen, so live experiments can only show question flow (show-ifs, the scalp Q1 skip) and the wall.
   The product effects in company.json are code results; a live replay cannot add to them without an account.
2. Worth a live check: does any answer show a message or a different screen before the wall (none expected from the code)?
   Try women Q1 = Yes (pregnant), men Q9 = depression (finasteride warning follow-up), men Q7 = Other (text box).
3. Re-check whether the served rules change (configuration errors above could be fixed at any time): re-extract the
   `quiz.loadState` JSON with `scratch/extract.py` and diff.
4. Try to name the unmapped SKUs (PHI1220, PHI1221, PHI1749 especially) from any public source; they decide whether Patchy and
   Extensive men get a product or a consultation.

## Dead ends

- www plan pages (the-5-combination-plan.html etc.) return "Sorry, this page is not available"; use the hairloss subdomain.
- quiz.js (non-minified) is empty; the page loads quiz.min.js.
- No product JSON or results data is served before registration; persistData only echoes the answers.

## Files

- src/: raw HTML and JS as served (pages, quiz.min.js, sitemap.xml). extracted/: text versions and analysis tables.
- scratch/: my scripts (extract.py, dump2.py, qparse.py, engine.py, build*.py, main.py, final.py rebuild company.json).
