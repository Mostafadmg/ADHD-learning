# Numan (UK) hair loss: working notes, stage 1 (MAP)

Checked on 23 Nov 2026. Written for the next investigator (stage 2, one-change experiments).
Evidence labels are the protocol's: observed / code / docs / inferred / unknown.

## 1. The short version

- The browser was **not blocked**. Curl and Playwright both load the site.
- There is **one consultation** and it is **for men only**. There is no women's hair-loss flow (see section 7).
- The questionnaire is **server-driven**: `hair_loss`, version 14, revision `smart`, a bank of **29 questions**.
  The baseline man sees 8 of them.
- **Biggest find:** after every answer the page fetches the draft from `api.numan.com`, and that reply
  (`questionnaire_with_responses`) lists every option of every question answered so far **with its engine result**:
  `proceed`, `reject` (with the exact patient message) or `complete`, plus `query_clinically` (true, or the written
  instruction for the reviewing clinician). All 29 questions and every option result are saved in `quiz-definition.json`.
- **Second find:** the product filter runs in the browser. It reads four server flags and hides products. The code is in
  `raw/product-filter-snippet.js.txt`.
- **Account wall:** `…/subscribe/hair-loss/<draft id>/profile`. Everything before it works with no sign-in, including
  the recommendation, every plan price and the add-ons. An optional email screen comes earlier and has a Skip button.
- No contact details were typed anywhere. Free-text medical boxes got short fictional medical notes only.

## 2. Where things are

| File | What it is |
|---|---|
| `company.json` | The map: 9 products, 4 flows, 41 screens/questions, 88 options, 11 rules, 4 runs logged as experiments. Passes `validate.js numan --stage map`. Built by `scripts/build-company.py`: edit that script, not the JSON. |
| `quiz-definition.json` | All 29 questions exactly as served (HTML kept), every option id, wording and `result`, plus every observed "answer → next question" step. Built by `scripts/build-quiz-definition.py` from `runs/s*/net/`. |
| `baseline-men.json` | Baseline man, in `tools/walk.js` format, from the consent screen to the account wall. Replayed successfully (see `runs/entry-regaine-baseline`, same steps with a different start URL). |
| `baseline-men-regaine-entry.json` | Same answers, entered through the Regaine link. |
| `scripts/explore-all-branches.walk.json` | The "tick everything" mapping walk in walk.js format (converted from the commands sent; not replayed in this form). |
| `scripts/branch-mental-health.walk.json` | Depression branch only (converted, not replayed in this form). |
| `scripts/stop-under18.json` | Two clicks to the stop screen. |
| `scripts/session.js`, `scripts/do.js`, `ans.sh`, `multi.sh`, `txt.sh` | A long-lived browser that takes one command at a time (see section 5). It saves **every** numan.com JSON reply, whatever its size. |
| `raw/api-product_categories-hair-loss.json` | Product catalogue the consultation page fetched: 8 products, 59 variants (16 active), prices in pence, plan discounts, age and sex limits, dosing text. |
| `raw/api-products-all.json`, `raw/api-product_categories-supplements.json`, `raw/api-eligible_addon_product_variants.json`, `raw/bff-pricing-*.json` | Other replies the pages fetched (whole catalogue, supplements, add-ons, coupon pricing). |
| `raw/product-filter-snippet.js.txt` | The product hide-lists and the featured-product and badge logic, copied from the served JS. |
| `raw/nuxt/` | The served JS chunks kept (app bundle, product selection, question page, billing, add-ons, profile). `chunks.txt` lists all 44 URLs that were downloaded. |
| `raw/locale-en-GB.from-app-js.json`, `raw/locale-hair-loss-extract.json` | All on-screen copy from the app bundle (consent list, "no eligible products" message, side panels, add-on text, checkout wording). |
| `raw/legacy-questionnaire-hair_loss-v1-v7.json` | Seven **retired** versions of the questionnaire still shipped in the app bundle (wording only). Useful history: v5–v7 asked about previous treatment; v14 does not. |
| `raw/pages/*.txt`, `raw/help/*.txt` | Text of the public pages and help-centre articles read. `raw/sitemap-urls.txt` is the sitemap. |
| `runs/` | `s1-men-baseline` (baseline, step by step), `s2-men-explore` (all branches), `s3-entries` (other entry links), `s4-men-mentalhealth`, `entry-regaine-baseline` and `stop-under18` (walk.js), `w01`, `w02`, `page-hairloss` (first looks). |
| `shots/` | 8 screenshots: consent, first question, pattern picker, a branch, stop screen, baseline recommendation, all-flags recommendation, account wall. |

## 3. How the site works

The consultation is a Nuxt (Vue) app under `/subscribe/…`. The marketing pages are a separate Next.js site.

1. `GET /subscribe/hair-loss` shows the consent list ("The really important bit"). The page fetches
   `api.numan.com/v1/product_categories/hair-loss?all_variants=true`.
2. Pressing **Next** makes `POST api.numan.com/v1/subscriptions` with only the category id and a device id.
   The reply is an anonymous draft (`status: draft`, `customer_id: null`) that names the first question.
3. Each question: `GET /v1/subscriptions/<id>/sq/<question_id>` (text, type, options, `question_index`, `number_of_questions: 29`).
4. Each answer: `POST …/sq/<question_id>/answer` with `{"data":{"answer":["<option_id>", …]}}` (free text goes in the same array).
   The reply is a "traversal hint": `proceed` + next question id, or `complete`. A rejecting answer sends the browser to
   `…/sq/<question>/reject/<option>` ("No suitable treatment").
5. After each answer the page also calls `GET /v1/subscriptions/<id>` (the definition leak described above) and
   `POST www.numan.com/bff/assessment/subscribe/calculate-web-directives {subscriptionId}`. The second reply holds the
   **engine flags**: `isFinasterideEligible`, `isMinoxidilEligible`, `hasAllergyToFinasteride`, `hasAllergyToMinoxidil`,
   `hasAllergies`, `allergies[]`, `numberOfQuestions`. The rules that set them are on the server and were not seen.
6. After `complete`: GP choice → (GP email, skippable) → optional marketing email (Skip) → **product selection** →
   "what to expect" → billing frequency → add-ons → **profile = account wall**.

Only URLs the page itself called were used. Nothing was posted by hand.

### The product filter (code, `raw/product-filter-snippet.js.txt`)

- Hide the **finasteride list** if `!(isFinasterideEligible && !hasAllergyToFinasteride)`:
  complete-hair-kit, complete-hair-kit-pro, hassle-free-hair-kit, triple-action-spray, finasteride
  (plus retired codes: the shampoo kit, extra-strength-foam, combination-spray).
- Hide the **minoxidil list** if `!(isMinoxidilEligible && !hasAllergyToMinoxidil)`:
  complete-hair-kit, complete-hair-kit-pro, hassle-free-hair-kit, triple-action-spray, regaine, minoxidil
  (plus the shampoo kit and extra-strength-foam).
- **Never hide the product named in the entry link** (`selectedProductSlug`).
- Rosemary Oil is on neither list, so something is always left. The app has a "Thanks for completing your consultation…
  we're unable to offer treatment" message for an empty list, but it cannot show while the oil is on sale.
- Featured card: the entry product if it is still shown; else the three-part kit if offered; else the two-part kit;
  else the first product by `position` (5 finasteride, 7 Extra Strength Spray, 9 Regaine, 10 Rosemary Oil).
- Badge: "Recommended for you" for the two-part kit, Extra Strength Spray, Regaine or Finasteride when the drug is
  eligible; otherwise "Most effective". That is why the three-part kit and the lone Rosemary Oil both say "Most effective".
- The question "What's most important to you…" sets a switch (`checkMostImportantAnswers`) that nothing reads.

## 4. Entry points found

| Link | Where it is on the site | What happens |
|---|---|---|
| `/subscribe/hair-loss` (also with `?pc=hl-organic-50off` or `?pc=hl50x1`) | "Get started" on the hair-loss page, product pages, the landing page `/lps/gbr/hair-loss/hltreatments-50cdn`, `/all-treatments`, "Start your assessment" on the minoxidil page | Main consultation. |
| `/subscribe/hair-loss/regaine` | "Get started" on the Regaine cards | Same consultation; Regaine featured (observed). |
| `/subscribe/hair-loss/finasteride`, `/subscribe/hair-loss/minoxidil` | Not linked from the pages read; same route pattern as Regaine | Consent screen opens (observed in `runs/s3-entries`). Not walked further. |
| `/subscribe/hair-loss/rosemary-oil?purchase=true&pc=HL-ROSEMARY-50OFF` | "Buy now" on Rosemary Oil cards | No questions. Straight to the account form with the order summary. |
| `/subscribe/supplements/hair-growth-support` (codes `supp-organic-50off`, `supp50`, `supp-organic`) | "Buy now" on Hair Support cards | No questions. Shipping-frequency screen first. |
| `/subscribe` | "Get started" in the top bar | Chooser: Sexual health, Weight loss, Hair health → Hair loss (→ `/subscribe/hair-loss`), and so on. |
| `/hair-loss/subscribe` | One link on the minoxidil page | Redirects to `/hair-loss`. |
| `/consultations/one-off-doctors-consultation` | "Book a consultation" in the footer and menu | A paid one-off doctor call. Not hair-specific; not walked. |

`/hair-loss/check-in/yes|no|havent-tried` are email check-in landing pages that cross-sell supplements. They start no consultation.

## 5. How to replay

**Simple replay (clean browser, one draft per run):**

    node tools/walk.js companies/numan/baseline-men.json companies/numan/runs/<new-name> --last

To test one change, copy `baseline-men.json`, change one step, and replay. Tips that cost time to learn:

- Wait about 4 seconds before the first **Next** (the page must finish loading its scripts, or the click does nothing).
- Click answers with `{"do":"click","selector":"label:text-is(\"<exact option text>\")"}`. A plain text click misses on
  the picture question because the radio sits under the sticky header.
- Single-choice questions move on by themselves. Multi-choice and free-text questions need a **Next** click.
- Some option texts use a curly apostrophe (for example "I can’t tolerate any amount of lactose…"). Copy them from `quiz-definition.json`.
- To see the full offer, click **See all treatments** on the product screen, then read the text.
- The engine flags for a run are in the last `net/*calculate_web_directives*.json` before the product screen.
- walk.js skips JSON replies under 300 bytes. The flags reply and the draft reply are big enough, so they are saved.
- **Always start from a clean browser.** The entry product is remembered in localStorage
  (`vuex_production` → `subscribe.selectedProductSlug`) and changes the featured card. walk.js does start clean.
- Each consultation start creates one anonymous draft on Numan's server. Please do not replay more than needed.

**Step-by-step exploring (one browser, one draft, many answers):**

    node scripts/session.js runs/<name> "https://www.numan.com/subscribe/hair-loss?pc=hl-organic-50off"   # in the background
    node scripts/do.js runs/<name> '{"steps":[{"do":"click","text":"Reject All"},{"do":"click","text":"Next","settle":4000},{"do":"snap"}]}'
    scripts/ans.sh   runs/<name> "18 - 65"                      # single choice
    scripts/multi.sh runs/<name> "Dandruff" "Psoriasis or eczema"   # tick, then Next
    scripts/txt.sh   runs/<name> "short fictional medical note"    # free text, then Next
    node scripts/do.js runs/<name> '{"do":"click","text":"Back"}'   # change the previous answer in the same draft
    node scripts/do.js runs/<name> '{"do":"quit"}'                  # closes its own browser

`do.js` prints the screen, the API calls since the last command, and any engine flag that differs from the default.
`session.js` exits by itself after 25 idle minutes. Never kill it with pkill.

**Rebuild the data files after new runs:** `python3 -I scripts/build-quiz-definition.py`, then
`python3 -I scripts/build-company.py`, then `node tools/validate.js numan --stage map`.

## 6. What the baseline man saw (observed, `runs/s1-men-baseline`)

Consent → age "18 - 65" → pattern "Temples and Crown" → "My hair loss started gradually…" → "I am not allergic to any of
the above" → scalp "No" → "No - none" → "Effectiveness of the product" → "I do not have a major illness…" → GP "No" →
email Skip → **product selection**:

- Featured, badge "Most effective": Hair Kit - Medicated Spray, Finasteride & Supplement, £26.67, "Save 33%".
- Under "See all treatments": Hair Kit - Medicated Spray & Finasteride £22.67; Hair Kit - Combination Spray & Supplement
  £26.67; Finasteride £16.80; Triple-Action Spray £22.67; Extra Strength Spray £18.00; Regaine £51.67; Rosemary Oil £14.00.
  (These are per-month prices on the quarterly variant after the first-order code.)
- Then "Hair regrowth timeline" → billing: quarterly £40.00, six-monthly £36.00 (pre-selected, "Most effective"),
  annually £32.00 per month → add-ons → account form with order summary £216.00 − £40.00 = £176.00.

The baseline protocol items the site never asks: exact age, family history, how long, previous treatment, side-effect
history, tablets-versus-topical preference (the nearest thing is the "most important" question; "Effectiveness of the
product" was used for "wants regrowth").

## 7. Women

No women's hair-loss consultation exists (observed + code + docs):

- The only consultation makes the patient confirm they "Were assigned male at birth" on the consent screen.
- Every medicine variant in the API has `intended_assigned_sex: "male"`, ages 19–65 (the questionnaire and pages say 18–65;
  how the 19 is used was not seen). Rosemary Oil is `any`, 18–70.
- The app has a page `…/assigned-gender-restricted-notice`: "{product} is intended only for individuals assigned {gender} at birth."
- Public pages: finasteride, Regaine for Men and the sprays are "not suitable for women".
- `/womens-health` is a menopause service. The only women's hair content found is one article about rosemary oil.
- A woman can buy Rosemary Oil (cosmetic) and Hair Support (supplement; not if pregnant, likely to be, or breastfeeding).

So there is no `baseline-women.json`.

## 8. What stage 2 should test first

One change from `baseline-men.json` each time. Read the product screen and the flags.

1. **Finasteride allergy only.** Code says: finasteride list hidden, Extra Strength Spray featured, "Recommended for you".
2. **Minoxidil allergy only.** Code says: minoxidil list hidden, Finasteride featured.
3. **Each scalp symptom alone** (four runs). Together they set `isMinoxidilEligible=false`; find which one does it.
4. **The five opt-out answers:** PSA "I do not wish…finasteride", blood pressure "I do not wish…minoxidil", asthma
   "I do not wish…topical", baby "I do not wish…finasteride", mood "minoxidil only". Their results say only `proceed`,
   so the flags and the product screen are the only way to know what they do.
5. **Mental health:** specialist alone (flag went false in the mixed run); dose change "Yes"; suicidal thoughts "Yes"
   (clinician note says no finasteride, but does the screen hide it?).
6. **Lactose "can't tolerate any"** alone. Flags did not move in the mixed run, so tablets probably stay on offer.
7. **Dandruff → "No"** to topical treatments.
8. **Pattern:** Temples, Moderate, Extensive, Other. Expect no change in the offer.
9. **Age 65 or over → Yes.** Expect no change, although the API says the variants are for ages up to 65.
10. **"Most important":** Minimal side effects; Scalp-friendly options. Expect no change.
11. **"I have a major illness…"** with a fictional condition. Expect no change before the wall (free text goes to the clinician).
12. **Stops not yet clicked:** Patchy, Complete, sudden onset, 65+ "No" (messages are already in `quiz-definition.json`).
13. **Entry link plus a ruled-out drug**, for example the Regaine link with a minoxidil allergy. Code says the entry
    product is never hidden. If that is true it is a real gap in their filter.
14. **Finasteride and minoxidil entry links** to the product screen.

## 9. Oddities worth keeping

- The first-order banner says "Save 50% off your first order (max. £40)". The pricing call returned `discount: 40`
  (percentage) with a £40 cap, and the amounts match 40% (for example finasteride £84 → £50.40). Rosemary Oil and the
  supplement use other codes that really are 50%.
- `/prescribing-process` says "We do not supply unlicensed or unproven treatments". The consent screen says "you may be
  prescribed an unlicensed treatment", and the help centre says minoxidil 6% and the Combination Spray are unlicensed.
- Regaine is called "branded minoxidil foam" on the landing page. The API variant is "5% (60ml)" and the help article
  describes a scalp solution with three applicators and says "50 ml".
- The same spray has three names: Extra Strength Spray (product), Medicated Spray (inside kits), "Hair loss plan with
  minoxidil" (marketing card). The combined spray is both "Triple-Action Spray" and "Combination Spray".
- The questionnaire typo "red rinds" (and "feotus") is theirs; wording is copied as served.
- Experiments named in the app bundle that may change what a visitor sees: `hl_6_months_promo`, `hl_price_per_day`,
  `hl_autofocus_exp`, `HL_ps_science`. The guarantee strip has two wordings ("180 days" and "6 months").
- The app bundle still knows retired product codes: extra-strength-foam, combination-spray, biotin-shampoo,
  combination-tablet, hair-kit-medicated-spray-finasteride-shampoo, hair-growth-support-supplement. None is in the live
  catalogue. The help centre still has an "Extra Strength Foam" article.

## 10. Dead ends and things not done

- The full question tree is **not** in any JS file. It lives on the server and is only revealed question by question.
  The app bundle holds only retired versions v1–v7 (wording, no logic).
- `/hair-loss/complete-hair-kit` (found by web search) now redirects to `/hair-loss`. The kits have no public product page.
- `/beard-growth` pages still exist but have no working purchase link and are not hair-loss treatment.
- `/legal/terms-of-sale` has no hair-loss guarantee clause in its text; the guarantee terms are on
  `/hair-loss/money-back-guarantee` (claim between day 180 and day 210 after approval, photos every 30 days, first-time users).
- Nothing after the account wall was tried: payment, identity check, clinician questions, what is finally prescribed.
- The supplement purchase was not walked past its first screen. The one-off doctor consultation was not opened.
- `robots.txt` disallows `/subscribe` for crawlers. The walks were single, slow sessions, not crawling.
- Drafts created on Numan's side: eight confirmed in the network logs, possibly nine. They are anonymous and were never submitted.

---

# Stage 2 (EXPERIMENT), 23 Nov 2026: working log

- Baseline replayed to the account wall: `runs/x2-00-baseline-full` (same offer and £176.00 total as stage 1).
- One-change walk files are generated by `scripts/gen-exp.js <expId>` into `stage2/<expId>.json` (list of ids at the
  bottom of the script). `scripts/run-exp.sh <expId> <NN>` replays one (retry once after 30 s) into `runs/x2-NN-<expId>/`
  and prints `scripts/summ.js`: questions served, last engine flags, featured card and the other products with prices.
  Experiments stop at the product screen (plan and price after it are the same per product as the baseline).
- Results are appended to `stage2/results.txt` as they come in.
- **Rebuilding company.json:** stage-1 content comes from `scripts/build-company.py`; stage-2 content is layered on by
  `python3 -I scripts/stage2-patch.py` (data in `scripts/stage2_exps.py`, `stage2_rules.py`, `stage2_text.py`). If you ever
  rerun build-company.py, rerun stage2-patch.py straight after it, or stage 2 is lost.

## Stage 2 results (33 replays: x2-00 full baseline, x2-01 short baseline, 31 one-change runs)

Only seven answers change the offer (all observed):
- minoxidil OFF (all kits, both sprays, Regaine hidden; Finasteride featured £16.80): minoxidil allergy (x2-03), scalp
  pain/itching (x2-04), red rinds/rashes (x2-05), any blood-pressure diagnosis whatever the follow-up answer (x2-10, x2-30).
- finasteride OFF (kits, Triple-Action, Finasteride hidden; Extra Strength Spray featured £18.00): finasteride allergy (x2-02),
  mood answer "minoxidil only" (x2-13, also skips the rest of the branch), specialist-managed mental health (x2-15, skips 3 Qs),
  suicidal thoughts Yes (x2-16, no stop, no signposting).
Change nothing on screen (clinician note at most): psoriasis/eczema (x2-08, despite their own note that minoxidil is unsuitable),
dandruff Yes/No (x2-06/07), PSA opt-out (x2-09) and opt-in (x2-31), asthma opt-out (x2-11), baby opt-out (x2-12), lactose "none"
(x2-18), body hair (x2-19), GP-managed depression (x2-14), dose change Yes (x2-17: it also SKIPS the suicidal-thoughts question),
65+ Yes (x2-22), Other pattern (x2-24), Extensive (x2-29), "most important" side effects / scalp (x2-27/28), medical history Yes (x2-23).
Stops seen: sudden (x2-25), patchy (x2-26). "Review your answers" undoes a stop in the same draft (x2-32).
Entry links bypass the allergy filter: Regaine link + minoxidil allergy → Regaine still featured (x2-20); Finasteride link +
finasteride allergy → Finasteride still featured (x2-21). Product links carry no first-order code (full prices).

Not tested (see limitations in company.json): Temples, Moderate, Complete, 65+ No, asthma/baby opt-in, lactose small, All of
the above, GP Yes, minoxidil entry link, pairs of rules.

---

# Stage 3 (VERIFY), 24 Nov 2026: working log

- Re-runs use `scripts/verify-exp.sh <expId> <NN>` (same as run-exp.sh, output in `runs/verify-NN-<expId>/`). Two new
  experiment ids were added to `scripts/gen-exp.js`: `pair-alfin-scpain` and `pair-alfin-scpain-regaine`. Raw summaries are in
  `stage2/verify-results.txt`. `stage2/verify-fin-billing.json` walks the baseline, picks Finasteride (4th "Select" button,
  `button:has-text("Select")` nth 3) and stops on the billing screen.
- **Rebuild order is now:** `build-company.py` → `stage2-patch.py` → `verify-patch.py` (the last adds the stage-3 changes and the
  `verification` block; safe to run twice).
- 22 replays. Both baselines matched (product screen; £176.00 at the wall). Ten stage-2 rules re-tested live, all confirmed
  (R2, R5, R6, R7, R10, R11, R14, R18, R20 plus R3 and R21 upgraded to observed). No rule was contradicted.
- New: the entry-link bypass also beats the eligibility flags (verify-21: Regaine link + finasteride allergy + scalp pain →
  Regaine still featured with Rosemary Oil). Minoxidil entry link features Extra Strength Spray at full price £30 (verify-13).
- Gaps closed: Complete and 65+ No stops, Temples, Moderate, asthma and baby opt-ins, lactose small, All of the above: as
  predicted (stops, or no change). Finasteride billing: £28 / £24 / £20 a month.
- Product facts checked against the live API (identical to the saved copy) and the live product pages (`raw/verify/*.txt`).
  The Minoxidil page banner says "60% off your first month" (not seen anywhere in the flow).
- Corrections: an opportunity wrongly said Numan has no topical finasteride (Triple-Action has 0.1%); one clinical opinion
  labelled as inferred; R22's shorthand proof expanded.
- Still untested: GP Yes, most rule pairs, most product "Select" buttons, anything after the account wall.
