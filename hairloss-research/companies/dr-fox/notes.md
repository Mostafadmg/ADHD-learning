# Dr Fox (doctorfox.co.uk): working notes, stage 1 (map)

Started 23 Nov 2026. Working log for the next investigator.

## Where things are
- The hair-loss medical questionnaire is plain HTML on the public page https://www.doctorfox.co.uk/hair-loss-treatments/
  (form `#answer_form`, `consultation_id` = 65, POST to https://www.doctorfox.co.uk/order/choose).
  Saved copy: `quiz-definition.html` (the whole form, 17 questions, ids 739-754 and 805).
- The client-side logic is in `/assets/js/main-9ca4503f.js`; the consultation part is copied to `quiz-engine-extract.js`.
  Rule: each answer either has `data-correct="1"` (may continue, sometimes with an information message) or not
  (a warning message shows and the "Next: choose treatment" button refuses to submit). No tree/branch questions on this form.
- Product exclusions (for example finasteride removed when you answer Yes to "taking dutasteride") are NOT in the page code;
  they are applied server-side on the "choose treatment" page after the form is posted. Check with live walks.
- Curl works (no bot wall seen on first fetch, 23 Nov 2026).
