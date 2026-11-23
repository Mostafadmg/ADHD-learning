# Oxford Online Pharmacy: working notes (stage 1, MAP)

Checked on 23 Nov 2026. Read this before you start stage 2.

## The short version

**The map is blocked.** No page of the company's own website could be read from this machine, so there is:

- no verified product catalogue, no prices, **no compounded formulas or strengths**,
- no entry points, no baseline walk, no question wording, no quiz definition, no account-wall position.

What exists instead is a thin, honest outline built from **Trustpilot reviews and company replies** (label `docs`),
plus two business facts from Companies House. It is in `company.json`. Nothing in it was seen on the company's site.

## What was tried, in order (the dead ends)

1. **Local browser (walk.js), home page, once.** Cloudflare page "Performing security verification", HTTP 403.
   Run: `runs/probe-home` (answer file `probe-home.json`). Screenshot: `shots/00-cloudflare-security-check.jpg`.
   The brief said to try once and not fight a security check, so it was not retried.
2. **WebFetch tool** on `/hair-loss` and on the home page: HTTP 403 both times.
3. **Plain curl** on `/robots.txt` and `/sitemap.xml`: HTTP 403 ("Just a moment..." page). No header changes were tried.
4. **Web search:** one query ran and returned nothing from this company's site. The next query was refused: the web
   search budget shared by the whole workflow was used up. The refusal also says not to get round the limit through
   third-party readers, proxies or archive services.
5. **Wayback Machine:** one availability lookup (made before the refusal in point 4) shows a copy of the hair-loss
   category page exists, captured 1 Nov 2026:
   `http://web.archive.org/web/20261101123809/https://www.oxfordonlinepharmacy.co.uk/hair-loss`
   It could not be read here: the WebFetch tool refuses web.archive.org and the session proxy resets the connection.
   Because of point 4 no other archive service was tried. **This link has not been read by anyone in this project.**
6. `oxfordop.co.uk` (the company's email domain) only redirects to the main site.
7. **Regulators:** CQC site search HTTP 403, GPhC register HTTP 403, a guessed GPhC inspections URL 404.
8. **Trustpilot** worked through the WebFetch tool (plain curl is refused there as a bot, so it was not used again).
9. **Companies House** search worked.
10. Other folders of this project were searched for "Oxford": nothing useful (only a list naming it as one of the ten companies).

## What the reachable sources say

All of this is `docs`. Reviews are customers' own accounts and are not verified. The fetch tool paraphrases reviews
(it will not quote at length), so nothing below is a word-for-word quote unless it is in quotation marks. Reviewer
names are left out on purpose; reviews are identified by date.

### Business facts
- Trustpilot company page: trading name of Frosts (Online) Ltd; family business in Banbury, Oxfordshire; "since 1925";
  more than 70 staff; GPhC-registered pharmacists and prescribers; says it specialises in weight management, erectile
  dysfunction, **hair loss** and menopause; free UK delivery over £40; Unit 2, Apollo Business Park, Banbury OX15 6AY.
  35,929 reviews, TrustScore 4.7 (23 Nov 2026). A May 2022 company reply says it is CQC-registered.
- Companies House: FROSTS (ONLINE) LIMITED, no. 11232746, incorporated 5 March 2018, same address.
  FROSTS ONLINE (HOLDINGS) LIMITED, no. 11233841, same date and address.

### Hair-loss products customers say they bought
| Product | Evidence | Notes |
|---|---|---|
| Finasteride 1 mg tablets (generic) | many reviews 2021–2026 | 168-tablet pack named (Jul 2026); six-monthly reorders; brands received: Accord, Milpharm, Rudipharm; brand can change without warning |
| Propecia | one review, Aug 2023 | not confirmed as current |
| Dutasteride capsules | 20+ reviews 2020–2026 | 0.5 mg named once (Aug 2020); £138.99 for six months in Feb 2021 (old) |
| Oral minoxidil 2.5 mg tablets | many reviews 2024–2026 | "Loniten" named Nov 2026; comes with a document on off-label use and advice to taper on |
| Regaine foam, twin pack | one review, Jan 2015 | £99 then; too old to trust for today's range |
| "Minoxidil" used morning and night with finasteride | reviews 2025 | form not stated; probably a topical, not confirmed |

**Not found anywhere today:** any compounded spray or solution, topical finasteride, topical dutasteride, any women's
product, shampoos, supplements, bundles. Trustpilot searches for `spray`, `topical`, `solution`, `compounded`, `scalp`
and `spironolactone` returned nothing about hair loss. The brief's hint about compounded sprays is therefore
**unverified**. It sits in `company.json` under `unverifiedLeads`, deliberately not under `products`, so the site's
"who sells what" table cannot show it as a fact.

### How the service seems to work (from reviews and company replies)
- Catalogue style: the customer picks the product, pack size and treatment length. One customer (Jul 2026, treatment
  not named) complained of being shown "a choice of different tablets" instead of a recommendation. But another
  (Aug 2025) says the questionnaire "recommended dutasteride". So whether the questionnaire recommends anything is open.
- Questionnaire topics named by customers: height, weight, age, medical conditions (heart and liver disease named),
  current medicines, previous use, whether to tell your GP. **No question wording was seen.**
- Registration exists. **Payment is taken before the prescriber decides** (reviews Feb 2021, Jun 2024, Aug 2025).
- A doctor or pharmacist prescriber reviews each order and may email or phone. An ID check can be sent automatically
  after ordering and is not always flagged before checkout (company reply, Mar 2026). Doctors may ask for photos for
  some prescription items (company reply, May 2024, about a skin cream; not confirmed for hair loss).
- A new consultation is needed for every reorder; earlier answers are saved and pre-filled.
- **No subscription** (company reply, 24 Oct 2026: "no-subscription approach").
- Price-match guarantee: same brand, strength, quantity and medicine only (company reply, Mar 2026). Newsletter
  discount (15% mentioned), refer-a-friend voucher, follow-up emails with hair-loss information.
- If the prescriber says no: full refund (about 5 working days), or an alternative is offered.

### Prescriber rules reported by customers (R1–R8 in company.json; none tested)
1. Finasteride first: dutasteride is not supplied to someone who has not tried finasteride. Company reply of 2 Feb 2021
   says this followed a September 2020 risk assessment; a refusal of this kind is also reported on 19 Aug 2025.
2. No dutasteride together with finasteride (Feb 2021; "not a licensed regime").
3. No oral minoxidil above the usual dose: "higher doses need a specialist prescriber" (company reply, 21 Nov 2025).
4. Oral minoxidil: GP told and asked to monitor; one order cancelled pending GP blood tests (May 2025); oedema risk
   flagged in the consultation (company reply, Jun 2025).
5. Early reorders are held or declined (Aug 2025; Dec 2025).
6. Women: a woman's order for a hair-loss tablet was refused; company reply (11 Jul 2024) says it is not a hair-loss
   specialist and is limited in what it can prescribe for female patients.
7. Antidepressants did not stop a finasteride prescription in one case (review, 23 Oct 2026). One unverified account.
8. Unsuitable after payment → refund or alternative.

## Where things are
- `company.json`: validated with `node tools/validate.js oxford-online-pharmacy --stage map` (0 errors, 0 warnings).
  5 products (all from reviews), 1 flow with **0 questions** (honest: none seen), 8 `docs` rules, plus extra fields
  `unverifiedLeads` and `flows[0].knownTopicsFromReviews`.
- `runs/probe-home/`: the one browser attempt (security check).
- `shots/00-cloudflare-security-check.jpg`.
- There is **no** `baseline-<flow>.json` and **no** `quiz-definition.*`: nothing could be walked or downloaded.

## How to replay
`node tools/walk.js companies/oxford-online-pharmacy/probe-home.json companies/oxford-online-pharmacy/runs/<new-id>`
This only shows whether the security check is still there. If the page loads normally one day, start the real map from
`https://www.oxfordonlinepharmacy.co.uk/hair-loss`.

## For stage 2: read this first

One-change experiments are **not possible** until someone can read the site. Do not spend replays on it from this
machine: the block is on every URL, including robots.txt. In order of value:

1. **Get the site content by an allowed route.** Options for the workflow owner to decide: (a) a person opens the site
   in an ordinary browser and saves the hair-loss category page, each product page and each consultation screen (or a
   HAR file) into `raw/`; (b) run from a machine the security check lets through; (c) when the web-search budget is
   back, search with the domain filter for the hair-loss product pages; (d) the Wayback link in dead end 5 (the protocol
   allows cached copies, but this session's tools could not reach it).
2. **Then do the stage 1 map properly**, in this order:
   - the hair-loss category page: every product, **every compounded formula and strength**, prices per pack size;
   - whether men and women have separate pages or consultations; product-specific "start consultation" buttons;
   - the baseline walk, and exactly where registration is forced (before or after the medical questions);
   - the quiz definition in served code.
3. **Then test these first**, because customer reviews say they change the outcome:
   - asking for dutasteride with and without previous finasteride use (R1): is the block in the questionnaire or only
     with the prescriber?
   - sex = female on each prescription product (R6);
   - oral minoxidil: blood pressure, heart disease, the dose choices offered, the GP-details question (R3, R4);
   - "currently taking finasteride" when ordering dutasteride (R2);
   - mental-health / antidepressant answers on finasteride (R7);
   - any topical or compounded product, if they exist: who is offered which strength.
4. Regulator reports (CQC inspection of the online prescribing service, GPhC pharmacy inspection) probably describe
   the consultation and any compounding. Both sites refused the fetch tool today; try them again.

## Sources read
- https://uk.trustpilot.com/review/oxfordonlinepharmacy.co.uk (company page)
- same address with `?search=` hair (pages 1–4 of 5), finasteride (1 of 4), dutasteride (1), minoxidil (1 of 2),
  questionnaire (1 of 4), subscription, spray, topical, solution, compounded, scalp, Regaine, spironolactone
- https://find-and-update.company-information.service.gov.uk/search/companies?q=frosts+%28online%29

---

# Stage 2 (EXPERIMENT), 23 Nov 2026

## Access, again
- walk.js on `/hair-loss`: same Cloudflare check (`runs/probe-hairloss-s2`, answer file `probe-hairloss.json`). Not retried.
- WebFetch on `/consultation/23` (the hair-loss consultation form, found by search): HTTP 403.
- **Web search with `allowed_domains: ["oxfordonlinepharmacy.co.uk"]` works** and returns summaries of the company's own
  indexed pages. That is the source of everything new below (label `docs`). Snippets are summaries, not quotes, and some
  indexed copies are years old.
- So **no one-change experiments were run**; there are 0 questions in company.json because no exact wording is known.

## New facts (search snippets of company pages)
- Consultation form: `/consultation/23` ("Hair Loss Treatment consultation"), about 3 minutes, no photos.
  Topics: sex (men / assigned male at birth only for finasteride, dutasteride, oral minoxidil), partner pregnant or trying
  within 12 weeks (told not to use finasteride/dutasteride), heart rhythm, chest pain, breathlessness, low BP with
  dizziness/fainting, angina, recent heart attack, heart failure, LVH, oral minoxidil BP-check agreement, mood/depression,
  current and past hair treatments, liver/kidney, allergies, permission to tell NHS GP. Over 18 (finasteride page).
- Products added (p6–p16): Loniten 2.5 mg, Avodart, **compounded finasteride + minoxidil + tretinoin spray 60 ml (2 months,
  strengths and price unknown)**, Sons minoxidil 5%, generic minoxidil 5%, Regaine Men Extra Strength, Regaine for Women 2%
  (£27.77), three bundles, Oxford Female Hair Loss Programme (consultation + blood test + unnamed oral drug).
- Prices: finasteride 28/84/168 £13.99/£32.99/£54.99; dutasteride 30–180 £39.99–£159.99; oral minoxidil 2.5 mg 30–180
  £22.49–£114.99 (only 2.5 mg sold; half tablet for 14 days then one).
- Dutasteride only after at least 6 months of finasteride with a clear reason (switching blog).

## Next step if the site ever opens
Walk `/consultation/23` anonymously, record wording, find the account wall, then test in this order: sex, age,
partner pregnancy, each heart/BP item, mood, previous finasteride when ordering dutasteride. Check the spray product page
for strengths.

---

# Stage 3 (VERIFY), 23 Nov 2026

- Access re-checked: walk.js on `/consultation/23` → Cloudflare check (`runs/verify-consult`, answer file `verify-consult.json`);
  WebFetch on `/hair-loss` → 403. No baseline existed to replay (no stage ever walked the site).
- Domain-filtered web search still works; 8 fresh searches were used to re-check prices and rules.
- **Main correction:** generic dutasteride is £18.99 for 30 (£83.99 for 180); the £39.99 recorded in stage 2 is Avodart.
- Spray (p8): no product page found, only blog posts; "from" price snippets conflict (£44.99 / £18.99), so price is unknown.
- p10 is probably the same Sons 5% product as p9 (its URL is titled "Sons" in search).
- Added p17 Regaine for Women 5% foam (£34.80), p18 Regaine for Women + Florisene (£40, out of stock); p5 now the
  current Regaine for Men Extra Strength foam.
- Female programme: £75.99 = blood test (ferritin, TSH, free T4, B12, folate, vitamin D) + 3 months unnamed oral drug;
  the women's page says the consultation asks for hair photos.
- **Account wall (docs, not observed):** consultation → basket → log in / create account → pay. Questions come first.
- Close-to-exact wording of one question from a search summary: "If ordering Minoxidil (Loniten) tablets do you agree to
  check your blood pressure regularly" (in R14; not added as a question because options are unknown).
- `verification` block added; validate `--stage final` passes.
