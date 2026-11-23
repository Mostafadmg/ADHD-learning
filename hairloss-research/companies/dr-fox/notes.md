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

## Live walks so far (23 Nov 2026)
- `runs/baseline-men` (answer file `baseline-men.json`): all safe answers, Q745 "order the spray?" = No.
  Result: POST to /order/choose shows a "Choose treatment" page with 17 checkboxes (finasteride generic 28/56/84/168,
  Propecia 28/56/84/168, Sons 5% 1/3/6 x 60 ml, Regaine ES solution 1/3/6, Regaine ES foam 1/3/6). No spray.
  No account needed yet. Buttons: "Confirm items", then "Next: Confirm order, enter your details and pay".
- `runs/baseline-men-spray` (answer file `baseline-men-spray.json`): same but Q745 = Yes.
  Result: choose page shows ONLY the Dr Fox Hair Growth Spray as 3 radio buttons (1 x 60 ml £26.00, 2 x 60 ml £48.50,
  3 x 60 ml £72.00). Note: £48.50 here vs £48.00 on the product and price pages.
- There is no age question and no sex question in the anonymous form: the only sex check is Q744 (aware finasteride is
  for men only) and the Q754 declaration "I am biologically male, over 18". Age is probably taken at registration (unknown).
- `runs/baseline-men-wall` (answer file `baseline-men-to-wall.json`): baseline, tick Finasteride 28 tablets, "Confirm items"
  → /order/confirm (Finasteride £10.00 + "Online prescription fee" £2.00 + delivery £2.90 = £14.90), then the
  "Confirm order" button (the note beside it reads "Next: Register/login and pay") → /order/login
  "Please login to continue. Create account or login". THAT IS THE ACCOUNT WALL. Nothing entered.
- `runs/check-q740-yes`: Q740 = Yes. Form did not submit; stayed on the page with "Please consult with your GP about
  these symptoms. We are unable to provide treatment." Confirms the client-side hard stop.
- `runs/html-choose-men`, `runs/html-choose-men-spray`, `runs/html-baseline-men`: saved page HTML (my own Playwright
  helper, same answers). Copies: `choose-page-tablets-route.html`, `choose-page-spray-route.html`.

## The engine in one paragraph
One page, 17 yes/no questions (`quiz-definition.html`, parsed into `quiz-definition.parsed.json`). Answers without
`data-correct="1"` are hard stops (11 of them: 739 No, 740 Yes, 741 Yes, 744 No, 748-752 No, 805 No, 754 No); the
messages for most of them say "you can change your answer and continue". Four answers continue with a message saying
products will not be supplied (742 Yes and 743 Yes: no finasteride tablets or spray; 746 Yes: no minoxidil products
including the spray; 747 Yes: "consult your GP" only). Q745 ("Do you wish to order the spray?") is the product fork:
Yes = spray only (radio, 3 packs); No = finasteride/Propecia/Sons/Regaine (checkboxes, 17 packs, max 4 items).
The patient picks; nothing is pre-selected. Q753 Yes opens a required free-text box for the doctor.
No age question, no hair-pattern/duration question, no photos. Birth gender and date of birth are on the registration
page (behind the wall); site code warns "consultation is for males only ... The doctor will not authorise this order"
if FEMALE is chosen with this consultation in the basket (main.js genderError).

## Products (6) and where they come from
Finasteride 1 mg generic (28 £10.00 / 56 £18.80 / 84 £26.50 / 168 £43.50), Propecia (28 £42.40 / 56 £81.70 / 84 £108.40 /
168 £214.00), Dr Fox Dual Action Hair Growth Spray (finasteride 0.3% + minoxidil 5% + tretinoin 0.01%, 60 ml = 2 months,
£26.00 / 2x £48.00 on product page but £48.50 on choose page / 3x £72.00; unlicensed special by Xeal Pharma MS 46688),
Regaine ES solution (60 ml £29.00 / x3 £64.00 / x6 £118.00), Regaine ES foam (73 ml £29.50 / x3 £66.00 / x6 £122.00),
Sons minoxidil 5% (60 ml £19.95 / x3 £48.75 / x6 £89.90). All three minoxidil products are GSL on emc (solution 18-65,
foam 18-49) but Dr Fox only sells them through the form. Men only: no women's product at all (FAQ says so).
Prescription fee (order.js recalcPrice): only items flagged `data-is_prescription="1"` count (finasteride and Propecia);
bands £0.01-9.99 = £1, £10-19.99 = £2, £20-39.99 = £3, £40+ = £4. Spray, Regaine and Sons are flagged 0, so £0 fee.
Delivery £2.90. No subscription anywhere. Not sold: minoxidil tablets, dutasteride, women's treatments (FAQ).

## Entry points
Only one form (consultation_id 65). Every "Start order" button on every product page and the FAQ links to
https://www.doctorfox.co.uk/hair-loss-treatments/#medical_questions_tab. `data-product-preselect` on the form is empty for
every entry we saw, so no product-specific flow.

## How to replay
`node ../../tools/walk.js baseline-men.json runs/<id> --last` from this folder. To change one answer, copy the file
and edit the `value` in the selector `label:has(input[name="answers[NNN]"][value="yes|no"])` for question NNN.
The result to read is the final screen: /order/choose (which products are listed) or the form with a warning.
Each replay takes about 40 seconds; no bot wall, no CAPTCHA seen; plain curl also works for public pages.

## What stage 2 should test first (only these can change the offer)
1. Q742 = Yes with Q745 = No → are finasteride and Propecia gone from the choose page? (and with Q745 = Yes → is the
   spray refused, or does the page come back empty?)
2. Q743 = Yes, same two routes.
3. Q746 = Yes with Q745 = No → are Sons/Regaine gone (finasteride only)? With Q745 = Yes → spray refused?
4. Q747 = Yes → any product change, or message only?
5. Q742 = Yes AND Q746 = Yes together → what does an empty choose page look like?
6. Q753 = Yes with some neutral text (no personal details) → still reaches the choose page? (text box rule)
7. Hard stops are already proven by code and one live check (Q740); a spot check of one "awareness" No (e.g. Q751 No)
   is enough.

## Dead ends and cautions
- No JSON APIs: the site is server-rendered PHP-style pages; `net/` folders are empty. The quiz definition is the HTML.
- No age or sex question before the wall, so the protocol's age experiments cannot be run anonymously.
- Do not fill in /register (contact details). Viewing it is fine; it was read with curl only.

## Stage 2 (experiment), 23 Nov 2026
Helper scripts (outside the repo, in the session scratchpad): `mkvar.js` copies a baseline and changes one answer
(`node mkvar.js baseline-men.json exp.json "note" 742=yes`), `summ.js` prints the last screen (URL, products listed, any
form messages visible). Each replay takes 35-50 s. Variant answer files are saved inside each run folder as `actions.json`.
- Baselines replayed and still work (23 Nov): `runs/exp-base-men` (tablets route, 17 checkboxes, same prices),
  `runs/exp-base-spray` (spray route, 3 radio packs £26.00 / £48.50 / £72.00), `runs/exp-base-wall` (Finasteride 28
  £10.00 + fee £2.00 + delivery £2.90 = £14.90, then /order/login).
- KEY FINDING: product exclusions are applied server-side on /order/choose (not in page code). Q742 Yes or Q743 Yes
  removes finasteride + Propecia (tablets route) or empties the spray route; Q746 Yes removes Sons + both Regaine
  (tablets route) or empties the spray route; Q747 Yes changes nothing. When nothing is left the choose page says
  "Some medication are not permitted ..." + "Sorry for the inconvenience - please cancel this consultation." + Cancel.
  When only some products are removed, nothing is explained on the choose page. Runs exp-01..exp-09.
- Q753 Yes: empty box blocks submit (exp-11); a neutral typed question leaves the offer unchanged (exp-10). In walk.js,
  type the text as the LAST step before submit: typing first stopped the Q754 click from registering.
