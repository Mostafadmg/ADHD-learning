# Philip Kingsley (PK Lab): working notes (stage 1, map)

Started 23 Nov 2026.

## Where things are
- Marketing page (men): https://www.philipkingsley.co.uk/hair-loss/pklab/treatments
- The assessment is a separate Magento store view: https://hairloss.philipkingsley.co.uk/
  - First screen "Select quiz": hair loss -> /welcome ; scalp irritation -> /quiz/step/start/stepId/scalp_quiz_step0/
  - /welcome = "Select gender at birth": Male -> /quiz/step/start/?stepId=men_quiz_step0 ; Female -> ?stepId=women_quiz_step0
  - Quiz is server-rendered (Magento module, class pk-quiz). Answers are divs `.pk-quiz-button` with data-quiz-step / data-url.
- Raw HTML copies in src/.

## Log
- r01-treatments: men's marketing page. r02-hl-start: assessment landing.
