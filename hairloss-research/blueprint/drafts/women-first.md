# Women first, men equally well: a concept for a new UK hair-loss service

Draft for the owner (a UK pharmacist independent prescriber). Written 24 November 2026. Status: **first full draft**,
built only from the research files in this project. No new web research was done. Nothing here is legal advice.

**The idea in one breath.** Most UK online hair-loss companies grew up selling to men, decide nothing before you pay,
and treat every woman as a smaller man. This service starts with women: it finds out *why* the hair is changing
before it treats anything, it handles pregnancy, contraception, periods and the menopause properly, and it stays
with the patient after the first parcel. Men get the same care, licensed medicines first, and the easiest exit in
the market.

---

## 0. How to read this file

### 0.1 How sure is each part?

- **Clinical facts** (doses, side effects, licences) come from `foundations/clinical-women.md` and
  `foundations/clinical-men.md`. Both were independently fact-checked; where the fact-check corrected the text, this
  file uses the corrected version.
- **Rules about law and advertising** come from `foundations/uk-regulation.md` (fact-checked).
- **What competitors do** comes from the synthesis files and company digests. Read these warnings:
  - **Voy**, **Hers (US)** and **Oxford Online Pharmacy** could not be walked live (their sites blocked the research
    machine). Statements about them rest on public pages and old code. They are marked **\***.
  - **Sons** and **Ro** were still in final review when this work began; their detailed data is complete. Marked **†**.
  - **XYON** was never independently verified. Marked **‡**.
  - For **every** company, what happens after the sign-in wall (the first screen that demands contact details) was
    never watched. It is described from the company's own documents or code.
- **Prices** for competitors were read on 23 and 24 November 2026, during Black Friday. They move often.
- **Our prices, our rules and our plans are proposals.** They are labelled **"Proposal"**. Money figures that are
  worked out rather than read from a source are labelled **"ESTIMATE"** and show their basis.

### 0.2 Words used (each is explained again where it first matters)

| Word | Plain meaning |
|---|---|
| **FPHL** (female pattern hair loss) | Slow thinning on top of the head in women. The parting gets wider. The front hairline usually stays. |
| **Male pattern hair loss** | Slow loss at the temples and crown in men, driven by the hormone DHT. |
| **TE** (telogen effluvium) | Sudden, all-over shedding that starts about 3 months after a shock to the body: childbirth, illness, crash dieting, weight-loss injections, a new medicine, stopping the pill. It usually settles by itself. |
| **Scarring hair loss** | Hair loss where the follicle is destroyed. It is permanent, so it needs a fast, face-to-face specialist. |
| **Licensed medicine** | Has a UK marketing authorisation (a licence) for that use. |
| **Off-label** | A licensed medicine used for something its licence does not cover. Example: minoxidil tablets are licensed for severe high blood pressure, not hair. |
| **Unlicensed "special"** | A medicine made up for one patient, with no licence at all. MHRA Guidance Note 14 (GN14) says use one only for a patient's *special clinical need*, and only when no licensed product (even off-label) will do. Cost and convenience do not count. |
| **GSL / P / POM** | Legal classes: General Sale List (any shop), Pharmacy medicine, Prescription-only medicine. |
| **PIP** | Pharmacist independent prescriber (the owner). |
| **5-ARI** | The finasteride and dutasteride family. They lower DHT. |
| **LDOM** | Low-dose oral minoxidil: small daily minoxidil tablets for hair. |
| **SmPC** | The official product information for a licensed medicine. |
| **U&E** | A blood test of kidney function and potassium. |
| **SHBG** | A blood protein that carries testosterone; needed to work out the "free androgen index". |
| **Tier A / Tier B** | Our two levels of consultation (section 4). Tier A = questionnaire plus photos, reviewed by a prescriber. Tier B = Tier A plus a video or phone call, a checked blood pressure reading, blood tests where needed and a letter to the GP. Every off-label tablet sits in Tier B. |
| **DMCCA** | Digital Markets, Competition and Consumers Act 2024. Its subscription rules are expected for new contracts from 1 January 2027 (the regulations were still a draft on 23 November 2026). |

---

## 1. Name, promise and who it is for

### 1.1 Working names (pick one, then check it)

| Option | Why it works | Watch out for |
|---|---|---|
| **Rootcause** (for example "Rootcause Hair Clinic") | Says the point of difference: we find the cause before we treat. Works for women and men. | "Root cause" is an ordinary phrase, so a trade mark may be hard to register or defend. |
| **The Parting** | Named after the first sign most women notice: a wider parting. Memorable and women-first. | "Parting" also means leaving. Less obvious for men. |
| **Kindred Hair** | Pattern hair loss runs in families; one service for women and men. Warm, not clinical. | Says less about diagnosis. Check for clashes in health and beauty. |

**Checks before you use any name:**

- Companies House (is the company name free?) and the UK Intellectual Property Office trade mark register. Ask a
  trade mark attorney which classes to search (pharmacy and medical services, medicines, cosmetics and retail are the
  likely ones).
- Domain and social handles.
- **The web address must not contain a prescription medicine name.** The MHRA's guidance for online clinics (Blue
  Guide Appendix 6) says core web addresses should not name prescription-only medicines (`uk-regulation.md` 2.2).
- **Do not use "Doctor" or "Dr" in the name.** The prescriber is a pharmacist, and the GPhC requires the website to
  say whether the prescriber is a doctor or a pharmacist (`uk-regulation.md` 3.2). A "doctor" name would mislead.

### 1.2 One-line promise

> **"We find out why your hair is changing before we treat it, and a named pharmacist stays with you all the way."**

It promises a process, not a result. That matters: a promise of results is treated as a guarantee by the advertising
regulator (ASA ruling against Numan, March 2024; `uk-regulation.md` 2.5).

### 1.3 Who it is for

**Women 18 and over** with:

- **Female pattern hair loss** (a widening parting over months or years), at any age, including in perimenopause and
  after the menopause.
- **Shedding after a trigger** (telogen effluvium): after childbirth, an illness with fever (including COVID-19), an
  operation, a crash diet or fast weight loss, **weight-loss injections** (semaglutide, tirzepatide), a new medicine,
  or stopping the pill or HRT.
- **Hair loss with polycystic ovary syndrome (PCOS)** or other signs of raised male-type hormones (androgens):
  irregular periods, acne, unwanted face or body hair.
- **Women who are pregnant, trying to conceive or breastfeeding** get a safe advice-only route (no medicines), not a
  refusal.
- **Early traction hair loss** (from tight styles), with styling advice first.

**Men 18 and over** with gradual male pattern hair loss, who want licensed medicines first, honest follow-up and an
easy exit.

**Not for (we stop and point them to the right place before taking any details):** under-18s; anyone with signs of
scarring hair loss, bald patches, eyebrow or eyelash loss, or (in women) a hairline moving back; rapid male-type
changes in women; illness symptoms such as fevers or unexplained weight loss; current thoughts of suicide or
self-harm (crisis help on screen).

**Where (Proposal):** start from a GPhC-registered pharmacy in England, serving Great Britain once advice confirms
it. The research covered a pharmacist-only service in England (no CQC registration needed) and a Scottish service run
from a registered pharmacy; it did not cover an English service treating patients in Scotland, and the Welsh
regulator's rules were not checked (`uk-regulation.md` 4.3). Northern Ireland is regulated differently and **was not
researched**: do not accept Northern Ireland patients until you have advice (`uk-regulation.md`, "Important things
missing" 2).

---

## 2. The edge: how we beat each competitor, point by point

**Our five differences in one list:**

1. **Diagnose first.** Every new patient answers the trigger question ("what happened 2 to 4 months before?"), sends a
   guided photo set, and gets blood tests when the history points to them. No UK company in the research does all
   three (`cross-company.md` 5).
2. **Women have their own pathway**: periods, PCOS signs, menopause, HRT, contraception, pregnancy plans and
   weight-loss injections all change what happens. No UK women's pathway seen acts on these (`cross-company.md` 4.9).
3. **Licensed first, then a written step-up plan.** Licensed tablets before any special; doses that can be stepped up
   or down; no "everything in one bottle".
4. **The result and the full price before any contact details**, and payment only if the prescriber approves.
5. **Follow-up built in and the easiest exit**: scheduled check-ins, a named prescriber for side effects the same
   working day, monthly by default, cancel online in two taps.

Below, each competitor gets: what they do well (be honest about it), where they fall short, and exactly how we beat
them. The evidence label says how the research found it.

### 2.1 Hims UK and Hers UK (the women's brand of the same company)

| | Detail | Evidence |
|---|---|---|
| **Strong at** | Huge marketing budget (the group spent US$919m on marketing in 2025). A wide compounded range. £16.50 a month for a combined spray or chew on a 6-month plan paid up front. Answers saved for 7 days with a "Delete my answers" button. Hers UK sells the only anti-androgen for women in the UK set: a capsule of spironolactone 44 mg with minoxidil 1.5 mg (from £20 a month). | Quiz observed and verified; after the wall from code and leaflets |
| **Falls short** | All 42 quiz answers change nothing: even "no hair loss" gets "Great news". Nothing is shown before the email. Flagship products are unlicensed, in one fixed strength, so one ingredient cannot be lowered or stopped. Hers UK asks for the woman's name on the first screen, so she learns nothing anonymously. Spironolactone is fixed at 44 mg, below the usual NHS starting dose of 50 mg, with no way to step up. Oral minoxidil cannot start below 1.5 mg (the usual starting dose for women is 1.25 mg). No blood tests. No photo step described for hair. Cancelling is by message to support only. | Observed (quiz); code (products, cancelling) |
| **How we beat them** | (1) A consultation that actually decides: red flags stop, safety answers remove products with a one-line reason, and the woman sees her likely diagnosis, plan and price before giving her name. (2) Licensed spironolactone tablets that start at 50 mg and step up monthly, with U&E (kidney and potassium) checks and contraception checks; licensed minoxidil tablets halved to 1.25 mg. Each medicine separate, so one can be changed or stopped. (3) Blood tests when the history points to them. (4) Monthly billing at the same price per month as longer plans, so no 6-month lock-in is needed for a fair price; cancel online. | |
| **Where we will not beat them** | On reach and price-per-month for prepaid compounded products. We compete on trust and care, not on being cheapest. | |

### 2.2 Voy\* (formerly Manual)

| | Detail | Evidence |
|---|---|---|
| **Strong at** | Big brand (parent turnover £227.4m in 2025, mostly weight loss). Women's service with a dermatologist lead and strengths set per patient. 180-day money-back promise. Photo progress tracker. Pay only after approval (older terms). | Public pages, reviews and 11-month-old code: **not walked live** |
| **Falls short** | The eligibility pop-up takes an email first, then says "You aren't eligible", with no reason or next step. Women get minoxidil only (topical or tablets) and vitamins, for every cause; no anti-androgen, no blood test on the hair pages. Headline prices are first-order offers on 6-month plans (complete plan "from £19" but £33.17 a month on 6-month billing and £44 monthly). Oral minoxidil as unlicensed capsules although licensed tablets exist. The GPhC found in March 2026 that its prescribing service did not independently check patients' answers, and took statutory enforcement action in August 2026 (mainly for advertising prescription medicines and a first-order discount); standards were met again in October 2026. | Pop-ups observed; rest docs (**\***) |
| **How we beat them** | (1) Verdict and reason before any email; every stop names a next step. (2) A real women's pathway: cause work-up, bloods, spironolactone where right, and an honest "this is shedding, it will usually settle" route. (3) One honest price, the same on monthly or longer plans, no first-order discount on prescription medicines. (4) Independent checks built in: photos, a verified blood pressure reading before minoxidil tablets, GP letters, NHS record consent where possible. (5) Licensed tablets before capsules. | |
| **Caution** | Because Voy's real quiz was never seen, we may be under-rating it. Re-check its public consultation pages (without submitting anything) before relying on this comparison internally. Never use a named-competitor comparison in adverts (the law bans "better than another identifiable treatment" claims for medicines). | |

### 2.3 Hair + Me

| | Detail | Evidence |
|---|---|---|
| **Strong at** | Very easy: about 3 minutes, one flat price. Serves men and women. A pregnancy route (non-hormonal drops) instead of a refusal. Water-based, alcohol-free minoxidil drops. A pet question that nudges cat owners to capsules. Two 0 to 10 wellbeing scores and monthly photos. Pharmacist prescribers. | Observed and verified (68 replays) |
| **Falls short** | No medical answer changes anything: heart disease, scalp infection, patches, sudden loss, even "no hair loss" all reach the same bag ("Personalised treatment", no drug or strength named). 16 compounded formulas, no licensed products. Photos optional and after payment. One combined pregnancy question; no contraception question, although some drops contain tretinoin; nothing on periods, menopause, HRT, thyroid or iron; no anti-androgen. £34.99 every 4 weeks is really £37.91 a calendar month (£454.87 a year); first three months at £14.99. Format preference not binding. | Observed (engine, price); docs (formulas) |
| **How we beat them** | (1) The plan is shown and explained before payment, with what was ruled out and why. (2) Safety answers act on screen. (3) Photos are part of the diagnosis, before the first prescription. (4) Separate pregnancy, trying-to-conceive and breastfeeding questions, then contraception, periods, menopause and HRT, each with a clear effect. (5) Spironolactone and blood tests for the women who need them. (6) Priced per calendar month; no introductory price that jumps later. (7) Format chosen last, after safety, and honoured. | |
| **Copy from them** | The pet question, the pregnancy route, the wellbeing scores, the plain consent screen with an opt-out. | |

### 2.4 Sons†

| | Detail | Evidence |
|---|---|---|
| **Strong at** | Holds UK licences for its own finasteride 1 mg and minoxidil 5% spray; the spray is £15 a month on a 12-month plan. Two standard low-mood questions (PHQ-2) in the flow. Optional consent to read the NHS Summary Care Record and to tell the GP. A repeat health check before renewals. Says plainly which products are unlicensed. | Before the wall observed; plan logic from code run offline (**†**) |
| **Falls short** | Men only; women are turned away at question 2. No plan, product or price until name, email, phone, date of birth and password are given. "Nearly every day" on the hopelessness question shows no message and no crisis help. Patchy, complete and sudden loss are not referred. Exclusions are silent. One strength per medicine. Oral minoxidil as an unlicensed capsule. Sign up online, cancel by email; customers report £189 six-month renewals and retention offers of 40% then 50% off. | Observed and code (**†**) |
| **How we beat them** | (1) We treat women. (2) A crisis screen at the moment of disclosure. (3) Red flags stop and refer. (4) Result and price before an account. (5) Doses that step up and down. (6) Cancel by the same route you joined, with a reminder before every charge, and no retention discounts. | |
| **Copy from them** | The PHQ-2 mood questions, NHS record consent, the repeat health check before renewal, plain "unlicensed" labels. | |

### 2.5 Numan

| | Detail | Evidence |
|---|---|---|
| **Strong at** | Fast (8 questions for a typical man) and shows the full offer and every price before sign-in. A real safety filter for the two drugs. Written clinician instructions behind risky answers. The only early-shedding warning seen before sign-in. Payment pending approval. | Observed and verified |
| **Falls short** | Men only. A man with suicidal thoughts in the past year gets no crisis help, just a quiet switch to minoxidil; if his mental-health medicine dose changed recently, the suicidal-thoughts question is skipped. Product links bypass the safety filter. "I do not wish to be considered for finasteride" is ignored on screen. Every stop has "Review your answers", which teaches people which answer passes. Any blood-pressure diagnosis removes even the topical minoxidil spray. Regaine at £80 for one month against £29 at Dr Fox. Uses a "see results in 180 days or your money back" promise, which the ASA has ruled against before. | Observed and verified |
| **How we beat them** | (1) Women. (2) Crisis help shown at once, and the suicidal-thoughts question is never skipped. (3) One safety check on every route in (ad links, product pages, re-orders). (4) Opt-outs honoured. (5) A stop is final for that consultation; changed answers are shown to the prescriber. (6) Three outcomes, not two: allowed, not allowed, or "the prescriber decides and records why" (for example well-controlled blood pressure and a topical). (7) A satisfaction-based guarantee, never a results-based one. | |
| **Copy from them** | Price before sign-in, the clinician playbook, the early-shedding warning, payment pending approval. | |

### 2.6 Dr Fox

| | Detail | Evidence |
|---|---|---|
| **Strong at** | The price floor: finasteride £7.25 a month on 168 tablets (£10 for 28, plus a £1 to £4 fee and £2.90 delivery); a triple compounded spray at £12 to £13 a month. Full total shown before sign-in. No subscription. A doctor approves every order before despatch. Very open about unlicensed and off-label supply. | Observed and verified |
| **Falls short** | Men only. No diagnosis at all: no age, pattern, duration or photo question. "You can change your answer and continue" on most stops. Two consultations can put its finasteride spray and finasteride tablets in one basket. High blood pressure or heart disease only shows a GP message; Regaine solution is still sold, although its SmPC lists high blood pressure as a contraindication. No step-up options. | Observed and verified |
| **How we beat them** | Not on price for finasteride alone (the research says price-matching Dr Fox is hard; compete on care, follow-up and women). We beat them on: (1) women; (2) diagnosis and photos; (3) a step-up path (oral minoxidil from a licensed tablet, dutasteride); (4) follow-up and photo comparison; (5) one safety check across orders. Our men's prices sit well below the subscription brands but above Dr Fox, and we say why: the price includes the prescriber's follow-up. | |

### 2.7 The high-street online doctors: Boots, Superdrug and LloydsPharmacy

| Company | Strong at | Falls short | How we beat them |
|---|---|---|---|
| **Boots Online Doctor** (observed, verified) | Licensed-only range; trusted brand; store collection; pay only if approved; crisis help for suicidal thoughts; the server labels each order Normal, Query, Warning or Danger for the clinician | Men only. Nine red flags at once (including suicidal thoughts, round patches and a painful scalp) reached the same ID-photo screen and price; refusal comes only after ID, account and payment. First-timers can buy only one month (£28) | Red flags stop on the screen where they are answered, before any ID or payment; women served; a plan, not a one-off pack |
| **Superdrug Online Doctor** (observed, verified; the platform, ZAVA, is now owned by Hims & Hers) | The only pre-order photo step in the UK (men with unusual patterns); a £25 doctor phone call; one-off orders | Men: the list never changes, even for finasteride allergy or prostate cancer; no mood question at all. Women: Regaine for Women 2% and supplements only, and pregnancy or breastfeeding keeps Regaine on offer with no warning | Photos for everyone; a mood question (as the MHRA expects before finasteride); women's medicines beyond Regaine; pregnancy handled properly |
| **LloydsPharmacy Online Doctor** (observed, verified) | The best engine in the UK set: acts on most risks before sign-in, shows prices, takes a real treatment history, asks about pets, shows crisis help, sells licensed oral minoxidil 2.5 mg tablets | Men only. Removals are silent and blunt: any blood-pressure condition removes even the minoxidil spray, and low blood pressure removes topical minoxidil, which the evidence does not need. Recommends combination packs that are out of stock | Copy its engine strengths, then add: one-line reasons for every removal; a prescriber-decides outcome instead of blunt removal; never recommend what cannot ship; women |

**Oxford Online Pharmacy\*** is worth knowing as the value benchmark (finasteride £9.17 a month on 168 tablets;
licensed oral minoxidil tablets; the only women's programme in the set with blood tests, £75.99). It could not be walked
live, the women's medicine is not named, and other pages say oral treatments are refused for women. We beat it on a
named, explained women's plan, photos and follow-up. Treat everything about Oxford as unconfirmed.

### 2.8 What we deliberately copy from the best

Full price before sign-in (Dr Fox, LloydsPharmacy, Numan). Treatment history (LloydsPharmacy). Pet question (Hair + Me,
LloydsPharmacy). Crisis screen that cannot be clicked past (Strut, US). Pregnancy stop before any data (XYON‡, not
verified). Photos when the picture does not fit (Superdrug). Pay only on approval (Numan, Boots). Clinician playbook
(Numan). NHS record consent (Sons†). Mood questions with a standard tool (Sons†). "Delete my answers" (Hims UK).
Honest "medicine is unlikely to help" screen for very advanced loss (Keeps, US).

---

## 3. The product range

### 3.1 Rules for the whole range

1. **Licensed first.** A licensed product used within its licence comes first. Next, a licensed product used
   off-label (with the reason recorded). An unlicensed special only for a recorded special clinical need, never for
   cost, convenience or "it's our house product" (MHRA GN14; `uk-regulation.md` 1.5, 1.6).
2. **One medicine, one product.** No fixed-dose combination capsules and no "everything in one bottle" lotions. If a
   side effect appears, one medicine can be stopped. The MHRA says finasteride 1 mg must be stopped at once if
   depression or suicidal thoughts appear; a combined capsule makes that impossible without stopping everything
   (`clinical-men.md` 9).
3. **Doses that can move.** Every tablet plan can step up or down using licensed tablet strengths.
4. **No product is sold to someone the diagnosis does not fit.** Shedding after a trigger gets care, not a
   subscription.
5. **Women never get finasteride, dutasteride, bicalutamide or cyproterone online.** Contraindicated or unsuitable
   in women in the UK product information; the one good trial of finasteride 1 mg in women was negative
   (`clinical-women.md` 3.4 to 3.6).
6. **What the price includes (Proposal):** the consultation, prescriber review, photo reviews, every scheduled
   follow-up and tracked delivery. **Blood tests are extra and charged at cost**, with the price shown before they are
   ordered. One price per calendar month, the same whether you take deliveries monthly or every 2 or 3 months.

**How to read each product card.** "Legal route" uses five types: (a) licensed, used within licence; (b) licensed,
used off-label; (c) unlicensed special (from an MHRA-licensed specials manufacturer, or made in our own pharmacy
under the pharmacy exemption); (d) cosmetic or device; (e) food supplement. "Evidence" uses the four grades in
`clinical-men.md` section 8 (Strong, Moderate, Weak, Insufficient); for women's medicines the grade is our reading of
`clinical-women.md` and says so. "Cost of goods" is always an **ESTIMATE**: no supplier price list is in the files.
Two bases are used: (1) a **ceiling**: the cheapest UK retail price seen, which already includes that seller's margin,
so our buying cost must be lower; (2) a **benchmark**: cost of sales was 21.8% of revenue at the Skin + Me group and
22.5% at Hims UK (`market-economics.md` 5.5). The benchmark fits own-brand and compounded products; it may be too low
for branded licensed products such as Regaine. **Get supplier quotes before fixing any price.**

### 3.2 The range at a glance

| # | Product | For | Legal route | Evidence | Proposed price a month |
|---|---|---|---|---|---|
| W1 | Licensed minoxidil for women: 5% foam once a day, or 2% solution twice a day | Women with confirmed FPHL, 18 to 65 | (a) licensed, within licence | Moderate (women's file) | £24 |
| W2 | Minoxidil tablets for women, from licensed 2.5 mg tablets (halved) | FPHL when topical fails or does not suit | (b) off-label | Weak in women (no placebo-controlled trial) | £22 |
| W3 | Spironolactone tablets, stepped dose | FPHL, especially with PCOS or androgen signs | (b) off-label | Weak (low-quality evidence, no placebo trial) | £22 |
| W4 | Two-medicine plan: spironolactone plus minoxidil (tablet or topical), as separate products | FPHL not controlled on one medicine | (b) and (a)/(b) | Weak, but better than spironolactone alone in pooled data | £29 |
| W5 | Shedding check (telogen effluvium route) | Shedding after a trigger | Service; no medicine | Natural history is good (regrows in 3 to 6 months) | £29 one-off, blood tests at cost |
| W6 | Iron, only for proven low iron | Low ferritin on a blood test | (a) licensed, within licence | Weak for hair; correct deficiency anyway | At cost plus a small fee, one-off |
| W7 | Pregnancy, trying-to-conceive and new-mum care | Pregnant, trying or breastfeeding | Service; no medicine | Follows the SmPCs | Free |
| W8 | Traction care | Early traction hair loss | Advice; minoxidil off-label if prescribed | Topical minoxidil listed by the BAD; off-label | Advice free; W1 price if minoxidil |
| M1 | Finasteride 1 mg tablets | Men, male pattern hair loss | (a) licensed | Strong | £18 |
| M2 | Licensed minoxidil 5% (solution or spray twice a day; foam twice a day) | Men | (a) licensed | Strong | £17 (solution or spray); £20 (foam) |
| M3 | Finasteride tablets plus licensed minoxidil 5%, as two products | Men with more than mild loss, or who want the best chance | (a) licensed | Moderate (the pair beats either alone on photos) | £30 (£33 with foam) |
| M4 | Minoxidil tablets for men, from licensed 2.5 mg tablets | Topical irritates, fails or is not used reliably | (b) off-label | Moderate | £20; £32 with finasteride |
| M5 | Dutasteride 0.5 mg capsules (step-up) | After 12 months of finasteride plus minoxidil without enough response | (b) off-label | Strong for efficacy | £22; £34 with minoxidil |
| M6 | Low-volume finasteride scalp spray (later phase, not at launch) | Recorded clinical reason not to take the tablet | (c) unlicensed special | Moderate for the licensed EU spray; Weak for compounded versions | £25; never advertised |
| B1 | Ketoconazole 2% shampoo | Dandruff or seborrhoeic dermatitis only | (a) licensed, within licence | Weak as a hair-growth agent | Shelf price, one-off |
| B2 | Microneedling kit with a written protocol (later phase) | Add-on to topical minoxidil | (d) device | Moderate as an add-on in men; low to very low certainty in women | About £15 one-off |

All prices are **Proposals**, to be tested against supplier quotes and customer research.

### 3.3 Women's products in detail

#### W1. Licensed minoxidil for women

- **What it is.** Regaine for Women Once a Day 5% foam: 1 g (half a capful) once a day, no more than 1 g a day. Or
  Regaine for Women Regular Strength 2% solution: 1 ml twice a day, no more than 2 ml a day. Apply to a dry scalp, not
  the hair. Both are licensed for female pattern hair loss in women aged 18 to 65, and are on general sale
  (`clinical-women.md` 3.1).
- **Form and base.** The foam has **no propylene glycol** (a common cause of itch and rash with solutions), but it is
  an "extremely flammable aerosol". The solution contains propylene glycol and ethanol. The foam is our default for
  women who have had itch with a solution, and for women who prefer it.
- **Who it is for.** Women with a **confirmed** diagnosis of FPHL, 18 to 65, not pregnant or breastfeeding, no high
  blood pressure (treated or untreated is a listed contraindication), healthy scalp.
- **Legal route.** (a) Licensed, used within licence, **only** for confirmed FPHL. The SmPC says it is not indicated
  for sudden or patchy loss, loss after childbirth, an unknown cause, or no family history. Using it for shedding,
  traction or over 65 is off-label, so those cases move to a prescriber decision with a recorded reason. A woman with
  typical FPHL but no family history needs the prescriber to confirm the diagnosis from photos and record why.
- **Evidence.** Moderate (our reading of the women's file: the Cochrane review rated the regrowth result moderate
  quality). About 1 woman in 4 notices clear regrowth, against about 1 in 7 on placebo (157 of 593 against 77 of 555);
  about 13 more hairs per cm². PCDS estimates about 40% benefit in some way. 2% and 5% did not differ in the Cochrane
  review. Works only while used.
- **What we tell her first.** Shedding may rise 2 to 6 weeks after starting; it usually settles as new hairs grow.
  Judge it at 6 months (the foam SmPC says stop if no improvement by 24 weeks; the 2% SmPC says stop if none by one
  year). About 4% of women in trials grew unwanted facial or body hair, more with 5%. Keep babies away from treated
  skin. Do not apply while smoking or near a flame. Cats can be poisoned by topical minoxidil.
- **Price (Proposal).** £24 a month, including the consultation, photo reviews and follow-ups. **Market:** Voy\*
  topical £24 a month on its main page (£14.99 on advert pages); Hair + Me £37.91 a calendar month; Superdrug sells
  Regaine for Women 2% for £25 one-off with no follow-up; Oxford\* sells the 5% foam (73 ml) for £34.80.
- **Cost of goods (ESTIMATE).** Ceiling: the 73 ml foam sells for £34.80 (Oxford\*) to £37 (a supermarket, from the
  UK sweep). At 1 g once a day one can should last about two months (our inference from the men's foam, where one can
  is one month at 2 g a day; **check the pack**), so about £17.40 to £18.50 a month retail. The 2% solution (60 ml,
  one month) sells for £17.98 to £27.77. This is the **thinnest-margin plan**: branded stock may cost close to
  retail. For planning, assume £12 a month (50% of price); get a wholesaler quote, and move the price to about £26 if
  needed.
- **Why it beats the closest competitor.** Hers UK and Voy\* lead women with compounded topicals (Hers UK's serum
  combines minoxidil 7% with ketoconazole and dexpanthenol). Ours is the licensed product. Superdrug and Oxford\* sell
  the same licensed product, but as a one-off with no diagnosis; ours comes after a diagnosis and photos, with a
  propylene-glycol-free option, an honest expectation set before the first dose, and a 6-month photo review.

#### W2. Minoxidil tablets for women (low-dose oral minoxidil, LDOM)

- **What it is.** Licensed minoxidil tablets (Loniten 2.5 mg) used off-label. **Start 1.25 mg once a day** (half a
  Loniten 2.5 mg tablet: its SmPC says it "can be divided into equal halves"). This is the international consensus
  starting dose for women (range 0.625 to 5 mg). For a gentler start (for example women aged 65 to 74, or anyone
  worried about side effects), one NHS trust uses **0.625 mg on alternate days** (a quarter tablet, cut with a pill
  cutter). Tell her a quarter is an approximate dose: no SmPC supports quartering. **Name the brand on the
  prescription**, because a generic 2.5 mg tablet's SmPC says its score line is not for breaking
  (`clinical-women.md` 3.2).
- **Service ceiling (Proposal):** 2.5 mg a day online (the top of the NHS trust's range); higher only with specialist
  input. The consensus panel set no strict upper limit, so this is our choice. **Upper age (Proposal):** no new starts
  at 75 or over; 65 to 74 only at the alternate-day start, with a verified blood pressure and GP agreement. The SmPC
  has few data over 65 and warns of dizziness on standing; the women's file asks each service to write its own limit.
- **Form.** Tablet. Good for women whose hair routine makes a daily scalp product hard (for example textured hair that
  is not washed daily: customers complained about serums that needed washing out), and for cat owners.
- **Who it is for.** FPHL where topical minoxidil irritated, left residue, caused styling problems, did not work after
  a fair trial, or is not practical (the consensus reasons). **Not** with: past fluid round the heart (pericardial
  effusion), tamponade or pericarditis; heart failure; pulmonary hypertension with mitral stenosis; phaeochromocytoma;
  pregnancy or breastfeeding; a significant interacting medicine; blood-pressure medicines (our women's-pathway rule);
  a woman who could conceive without effective contraception (the SmPC: "not recommended ... in women of childbearing
  potential not using contraception"). **Take advice first** for a fast or irregular heartbeat, blood pressure below
  90/60, kidney impairment or severe liver impairment.
- **Legal route.** (b) Off-label. Tier B: video or phone call, a real blood pressure and pulse reading, a medicines
  list checked against the GP record where possible, a contraception check, and a GP letter.
- **Evidence.** Weak in women (our reading): no placebo-controlled trial; in a small open-label trial (25 women on the
  tablet) 1 mg was not significantly better than topical 5%, and the trial could not show the two are equal. Safety
  comes from large case-note reviews (1,404 patients: extra hair 15.1%, lightheadedness 1.7%, fluid retention 1.3%,
  fast heartbeat 0.9%). **Extra facial hair is likely**: in a trial that examined women on 1 mg, 73% had facial hair
  growth and 41% body hair growth at 24 weeks. We say this plainly, and we ask first whether extra hair would be
  unacceptable to her.
- **What we tell her first.** First benefit at 3 months at the earliest, perhaps 6 if she has an early shed. Watch for
  lightheadedness and a fast heartbeat for the first 3 to 7 days after starting or a dose rise, and for swollen feet or
  face, weight gain, chest pain or breathlessness for 4 to 6 weeks: stop and seek help.
- **Price (Proposal).** £22 a month. **Market:** Hers UK 1.5 mg compounded chew from £13 (fixed strength); Voy\*
  tablets £15 first order (£25 struck through); Hair + Me £37.91.
- **Cost of goods (ESTIMATE).** Ceiling: one UK online pharmacy in the sweep sells Loniten 2.5 mg at £50 for 60
  tablets (not fact-checked). At half a tablet a day, 60 tablets last about 4 months, so about £12.50 a month retail.
  Benchmark at 22% of price: £4.84.
- **Why it beats the closest competitor.** Hers UK's chew cannot start below 1.5 mg and is a compounded special; Voy\*
  and Hair + Me use unlicensed capsules. Ours is a licensed tablet (which GN14 prefers), starts at the consensus dose
  or lower, and comes with a checked blood pressure and a GP letter.

#### W3. Spironolactone tablets, stepped

- **What it is.** Licensed spironolactone tablets used off-label (licensed for heart failure, liver cirrhosis with
  fluid, nephrotic syndrome and primary aldosteronism). It blocks the effect of male-type hormones.
- **Dose.** **Start 50 mg once a day** for a month (NHS dermatology leaflet). If tolerated and blood tests are normal,
  step to 100 mg. The NHS schedule continues to 150 mg and then a maximum of 200 mg. **Service ceiling (Proposal):**
  100 mg online, because the international PCOS guideline says 25 to 100 mg "appears to have lower risks of adverse
  effects"; higher doses only with GP or dermatologist agreement. The prescriber may start at 25 mg (inside that
  lower-risk range) in women aged 45 or over or with risk factors. Dispense licensed tablet strengths that make each
  step (confirm pack strengths on the emc before launch).
- **Who it is for.** FPHL, especially with signs of androgen excess (PCOS, acne, unwanted hair), in a woman who is not
  pregnant or breastfeeding and either cannot become pregnant or uses effective contraception. Normal kidney function
  and potassium. **Not** with: kidney impairment, Addison's disease, high potassium, eplerenone or another
  potassium-sparing diuretic. **Only with GP agreement and potassium checks** with: ACE inhibitors, sartans, potassium
  supplements or potassium salt substitutes, regular NSAIDs, heparin, lithium, digoxin, co-trimoxazole (trimethoprim
  alone: unverified, treat the same until the BNF is checked).
- **Pregnancy and contraception.** It can feminise a male fetus. Effective contraception is required and is
  **re-checked at every supply** (seven pregnancies still happened in a UK acne trial despite advice at every visit).
  She may try for a baby one month after stopping (NHS leaflet). Breastfeeding: sources disagree; we follow the SmPC
  and the BAD (do not use). **What counts as "effective contraception" is not defined in the research files:** write
  it into the protocol from current UK contraception guidance before launch.
- **Blood tests (Proposal, from the women's file).** U&E (kidney function and potassium) before starting, in
  everyone. No routine repeats in a healthy woman under 45 with normal results and no interacting medicines. Repeat
  potassium after starting and after each dose rise, then periodically, in women 45 or over (high potassium in 10.1%
  of women 45 and over), or with kidney, heart or liver disease, diabetes or any interacting medicine. On a pill that
  contains drospirenone (for example Yasmin): check potassium in the first cycle of the combination.
- **Legal route.** (b) Off-label. Tier B.
- **Evidence.** Weak (the women's file calls it low quality): no placebo-controlled trial. In pooled studies 56.6% of
  women improved (43.2% on spironolactone alone, 65.8% when combined). It mostly stops things getting worse; about 4 in
  10 regrow some hair. Improvement after about 6 months; full effect at 12 to 18 months. Common side effects: sore
  breasts, irregular periods, dizziness on standing. No link with breast cancer was found in people (very low
  certainty).
- **Price (Proposal).** £22 a month; U&E tests at cost. **Market:** nobody in the UK set sells plain spironolactone
  that can be stepped up. Hers UK's only anti-androgen is a capsule fixed at 44 mg with minoxidil 1.5 mg, from £20.
- **Cost of goods (ESTIMATE).** No price in the files. Benchmark at 22%: £4.84. Get a quote.
- **Why it beats the closest competitor.** Hers UK's 44 mg dose sits below the usual NHS start of 50 mg and cannot be
  raised, and it is locked to minoxidil in one capsule. Ours starts at the NHS dose, steps up, is licensed, and comes
  with the kidney, potassium and contraception checks the women's file asks for. This is **the clearest product gap
  for women in the UK** (`products-prices.md` 5.1, 5.2).

#### W4. Two-medicine plan for women

- **What it is.** Spironolactone (W3) plus minoxidil, either licensed topical (W1) or tablets (W2), as **separate**
  products so either can be changed or stopped.
- **Evidence.** Pooled data favour combination over spironolactone alone (65.8% against 43.2% improved; low-quality
  evidence). Safety of the pair (432 women): any side effect 37.7%, extra hair 12.3%, dizziness 12.0%; taking another
  blood-pressure-altering medicine tripled the odds of dizziness on standing.
- **Who.** FPHL not controlled on one medicine after a fair trial, or FPHL with clear androgen signs from the start.
- **Legal route.** (b) plus (a) or (b). Tier B.
- **Price (Proposal).** £29 a month. **Market:** Hers UK's combined capsule from £20. We are dearer; the difference
  pays for the video consultation, verified blood pressure, potassium plan and adjustable doses. Test this price.
- **Cost of goods (ESTIMATE).** Benchmark at 22%: £6.38 (more if the topical is branded foam).

#### W5. Shedding check (the telogen effluvium route)

- **What it is.** A one-off service for women (and men) whose answers point to shedding after a trigger: childbirth,
  illness with fever or COVID-19, surgery, a major stress, fast weight loss or crash dieting, weight-loss injections,
  a new medicine, or stopping the pill or HRT.
- **What she gets.** A prescriber reviews her answers and photos, and checks for female pattern loss underneath
  (the two often overlap). A written timeline: shedding usually starts about 3 months after the trigger, lasts 3 to 6
  months, and regrowth takes many more months to restore volume. Photo check-ins at 3 and 6 months. Blood tests (full
  blood count, ferritin and thyroid) **only** when the history points to them: shedding for more than 6 months, no
  clear trigger, severe shedding, heavy periods, a restricted diet, rapid weight loss, weight-loss injections, bowel
  disease or weight-loss surgery. If the shedding goes on beyond 6 months, or the parting is widening, she moves to the
  FPHL work-up; if no cause is found, we refer her to her GP.
- **No hair medicine.** Medicine does not speed regrowth in telogen effluvium (BAD), and licensed topical minoxidil is
  not indicated for loss due to childbirth or an unknown cause.
- **Weight-loss injections.** Hair loss is a listed side effect: 2.5% on semaglutide 2.4 mg and 4.9% on tirzepatide,
  against 1.0% on placebo; most recovered while continuing (`clinical-women.md` 3.13). We do not advise stopping the
  injection for hair alone; that is her decision with its prescriber. We ask about food intake.
- **Legal route.** Service. Iron (W6) only if a test shows low iron.
- **Evidence.** PCDS: unless the trigger repeats, "spontaneous complete regrowth occurs within three to six months."
- **Price (Proposal).** £29 one-off; blood tests extra at cost, price shown before ordering. **Market anchors:**
  Superdrug sells a hair blood test separately for £99 (UK sweep, not fact-checked); Oxford's\* women's programme is
  £75.99 including tests and 3 months of an unnamed treatment.
- **Cost (ESTIMATE).** About 25 minutes of prescriber time at about £51 an hour (`market-economics.md` 5.5): about
  £21. This product is about trust and first contact, not profit.
- **Why it beats everyone.** No company asks "what happened 2 to 4 months before?" as a timing question; nobody asks
  about weight-loss injections (`cross-company.md` 5). Selling long-term treatment to shedding that would regrow by
  itself feeds the "no results" complaints (about 22% of negative reviews as the main complaint).

#### W6. Iron, only for proven low iron

- **What it is.** A licensed oral iron tablet (ferrous sulfate, fumarate or gluconate), one tablet a day, or every
  other day if not tolerated (British Society of Gastroenterology). Legal class to be confirmed per product.
- **The rules (from the women's file, 2.2 and 4.2).** Ferritin below 30 µg/L with normal haemoglobin: iron deficiency
  by general-medicine standards: treat, write to the GP, look for the cause (heavy periods, diet). Ferritin 30 to 40
  µg/L with shedding: a time-limited iron trial, telling her the evidence that it helps hair is weak. Ferritin above
  40 µg/L: no iron for hair; do not chase "70". **Low haemoglobin with low ferritin (iron deficiency anaemia) is a GP
  referral, not a sale**: postmenopausal women need the urgent pathway (about a third have a gut cause), and
  premenopausal women should be screened for coeliac disease by the GP. Recheck at about 3 months.
- **Evidence.** Weak for hair ("insufficient evidence on the efficacy of the replacement of iron on the outcome of
  TE"); correcting deficiency is right on general medical grounds.
- **Price (Proposal).** At cost plus a small dispensing fee, as a one-off pack. No subscription.

#### W7. Pregnancy, trying-to-conceive and new-mum care

- **What it is.** A free advice-only route. No minoxidil (the SmPC says it "should not be used during pregnancy or
  lactation"; LactMed is more relaxed about established breastfeeding, but we follow the UK SmPC). No anti-androgens.
  Explains shedding after childbirth (telogen effluvium), books a photo check-in about 3 and 6 months after the birth,
  and plans treatment for after breastfeeding ends if pattern loss is found.
- **Scalp care.** Ketoconazole 2% shampoo (B1) only for dandruff or seborrhoeic dermatitis; its SmPC lists "no known
  risks" in pregnancy and breastfeeding.
- **Price.** Free. It earns trust with women at the moment most services turn them away or (Superdrug) keep Regaine
  for Women on offer with no warning.
- **Why not sell a "pregnancy-safe" product?** Hair + Me sells niacinamide drops for pregnancy. The clinical files
  give no evidence grade for niacinamide, so we offer care, not a product.

#### W8. Traction care

- **What it is.** Advice to stop the pulling (tight ponytails, buns, braids, weaves, extensions, relaxers), which is
  the main step; early cases regrow fully once the pulling stops. Topical minoxidil 2% or 5% is listed by the BAD as
  an option, but it is **off-label** (the licences cover pattern hair loss only), so it is a prescriber decision with
  a recorded reason. Refer if there is smooth shiny skin, no regrowth about 3 months after the tension stops, pustules
  or marked inflammation, or the picture could be frontal fibrosing alopecia (FFA) or central centrifugal cicatricial
  alopecia (CCCA, a scarring loss on the crown, mainly in women of African descent with tightly curled hair).
- **Price (Proposal).** Advice free; the W1 price if minoxidil is prescribed.

### 3.4 Men's products in detail

#### M1. Finasteride 1 mg tablets

- **What it is.** Licensed prescription-only medicine for male pattern hair loss. 1 mg once a day; higher doses do not
  work better. Loss steadies in 3 to 6 months; gains start to reverse within 6 months of stopping and are gone by 9 to
  12 months (`clinical-men.md` 2.1).
- **Who.** Men 18 and over with gradual male pattern loss, after the mood and sexual-function questions (section 4).
- **Legal route.** (a) Licensed, within licence.
- **Evidence.** Strong. Over 5 years, 48% improved and 42% were unchanged on photographs, against 25% improved or
  unchanged on placebo. Sexual side effects in year one: 3.8% against 2.1% on placebo.
- **Safety we build in.** Ask about depression and suicidal thoughts before prescribing; record a baseline of sexual
  function; give the patient-card information in writing as well as the card in the pack; tell him to stop at once and
  contact us if low mood or suicidal thoughts appear; review mood and sexual function at every check-in (MHRA April
  2024 and 11 May 2026). Ask about breast lumps. Tell him and his GP that finasteride lowers PSA (the prostate blood
  test; the SmPC says doubling the result "should be considered").
- **Price (Proposal).** £18 a month, the same on any delivery length: £216 a year. **Market:** UK median £22.83 a
  month on 6-month plans and £28.50 for one month; £240 to £276 a year at Numan, Boots, Sons† and Hims UK; the floor is
  Dr Fox at about £100 to £116 a year with fees and delivery.
- **Cost of goods (ESTIMATE).** Ceiling: below £7.25 a month (Dr Fox's 168-tablet price, which includes its margin).
  Benchmark at 22%: £3.96.
- **Why it beats the closest competitor.** Numan, Sons† and Hims UK charge more and need prepaid plans for their best
  price. Dr Fox is cheaper but has no diagnosis, no photos and no follow-up. We sit between, with structured
  follow-up included.

#### M2. Licensed minoxidil 5% for men

- **What it is.** A licensed 5% solution or spray: 1 ml twice a day to a dry scalp, no more than 2 ml a day, men 18
  to 65. Or 5% foam: 1 g twice a day, no more than 2 g a day, men 18 to 49. Stop if no improvement after a year;
  regrown hair is lost 3 to 4 months after stopping (`clinical-men.md` 3.1).
- **Form and base.** Solutions contain propylene glycol (350 to 500 mg/ml) and ethanol; the foam has no propylene
  glycol. A reaction to the solution usually means a reaction to propylene glycol: switch to the foam. A true
  minoxidil allergy rules out all minoxidil.
- **Legal route.** (a) Licensed (general sale).
- **Evidence.** Strong. +18.6 hairs per cm² at 48 weeks against +3.9 on the base alone. **5% is the right strength:**
  the only trial of 10% found it worse than 5% and more irritating. We do not sell "extra strength" minoxidil.
- **Price (Proposal).** £17 a month for solution or spray; £20 for foam. **Market:** Sons'† own spray £15 to £16.50 a
  month on long plans (£33 for one month); £14.98 to £19.95 at Dr Fox; Regaine £44 to £80 a month at Hims UK and Numan.
- **Cost of goods (ESTIMATE).** Ceiling: below £14.98 a month (Dr Fox, 6 months). Benchmark at 22%: £3.74.
- **Why it beats the closest competitor.** Voy\* (10%), Numan (6%, 10%) and Hims (6%, 7%) sell strengths above 5% with
  no evidence behind them. We sell the strength the evidence supports, with a foam switch for irritation.

#### M3. Finasteride plus licensed minoxidil 5%

- **What it is.** M1 and M2 as two separate products, offered from the start to men with more than mild loss or who
  want the best chance of regrowth.
- **Evidence.** Moderate. In one 12-month trial, 94.1% improved on both, 80.5% on finasteride alone and 59% on
  minoxidil alone.
- **Price (Proposal).** £30 a month (£33 with foam). **Market:** median £31.50 a month on 6-month bundles; Sons† Core
  £31.50 (£43 for one month); Numan £32 on 6 months, £44 monthly; Voy\* £33.17 on 6-month billing, £44 monthly; Hims UK
  £30 to £35; Dr Fox built from two items £23.38.
- **Cost of goods (ESTIMATE).** Benchmark at 22%: £6.60.
- **Why it beats the closest competitor.** The same monthly price without a 6-month lock-in, and two products so a
  mood side effect means stopping finasteride only.

#### M4. Minoxidil tablets for men

- **What it is.** Licensed minoxidil 2.5 mg tablets used off-label. **Start 2.5 mg once a day** (the consensus's most
  common starting dose for men; range 1.25 to 5 mg). 1.25 mg is half a Loniten 2.5 mg tablet. No agreed scheme for
  stepping up: the prescriber decides and records why. **Upper age (Proposal):** 65 to 74 start at 1.25 mg with a
  verified blood pressure and GP agreement; no new starts at 75 or over.
- **Who.** Topical minoxidil irritates, leaves residue, causes styling problems, has stopped working, or is not used
  reliably (consensus reasons). The same heart exclusions and precautions as W2. Ask about every blood-pressure
  medicine: men on doxazosin or on three or more such medicines stopped more often.
- **Legal route.** (b) Off-label. Tier B: call, blood pressure and pulse reading, medicines list, GP letter.
- **Evidence.** Moderate. In two double-blind trials it was about as good as topical 5%, not better. Extra hair in
  15.1% in a large case-note review, up to about half at 5 mg. Its value is convenience.
- **Price (Proposal).** £20 a month; £32 with finasteride. **Market:** licensed tablets £18.75 to £22.49 a month at
  Oxford\* and £23.67 to £29 at LloydsPharmacy; Sons'† unlicensed capsule £23.67; Hims UK compounded chew (with
  finasteride 1.1 mg) £16.50 on a 6-month prepaid plan.
- **Cost of goods (ESTIMATE).** Ceiling: below £18.75 a month (Oxford\*). Benchmark at 22%: £4.40.
- **Why it beats the closest competitor.** Sons†, Voy\* and Hair + Me supply oral minoxidil as unlicensed capsules
  although licensed tablets exist; GN14 says licensed first. Hims UK's chew locks finasteride and minoxidil together
  at unusual strengths (1.1 mg and 3 mg) that match no licensed tablet.

#### M5. Dutasteride 0.5 mg capsules (step-up)

- **What it is.** Licensed for an enlarged prostate; used off-label for hair. 0.5 mg once a day, swallowed whole.
  **Never with finasteride.** Only after 12 months of finasteride plus minoxidil taken reliably without enough
  response (`clinical-men.md` 11, step 3).
- **New consent covers:** off-label use; a half-life of 3 to 5 weeks (effects take months to clear); sperm count still
  23% below baseline 24 weeks after stopping; a condom if his partner is or may be pregnant; PSA halves by 6 months
  (tell the GP: a new baseline is needed); the precautionary mood warning (MHRA, May 2026); women must not handle
  leaking capsules. **Not** with severe liver impairment or if trying for a baby. Check for strong CYP3A4 inhibitors
  (for example ritonavir, itraconazole), which raise its levels.
- **Legal route.** (b) Off-label. Tier B call before the switch.
- **Evidence.** Strong for efficacy: about 7 more hairs per cm² than finasteride at 24 weeks in a network
  meta-analysis; ranked first in two. Long-term hair data are thinner than for finasteride.
- **Price (Proposal).** £22 a month; £34 with minoxidil 5%. **Market:** Oxford\* generic £14 to £18.99; Treated
  £29.98 to £34.95. No UK subscription brand offers plain dutasteride as a step-up.
- **Cost of goods (ESTIMATE).** Ceiling: below £14 a month (Oxford\*, 180 capsules). Benchmark at 22%: £4.84.

#### M6. Low-volume finasteride scalp spray (later phase; not at launch)

- **What it is.** An unlicensed special that copies the licensed European spray: finasteride 0.25% w/w, 50 microlitre
  sprays (114 micrograms each), 1 to 4 sprays once a day on separate thinning areas, maximum 4 sprays (about 0.46 mg)
  a day, left on for at least 6 hours (`clinical-men.md` 2.2). **Not** a high-volume lotion: 1 ml of a 0.25% lotion
  holds 2.5 mg, more than five times the spray's daily maximum, so the spray's safety data do not transfer.
- **Who.** Only a man with a **recorded clinical reason** not to take the tablet. Not after past mood change or
  lasting sexual side effects on a 5-ARI: those exclude all 5-ARIs, topical included. He must be told it is still
  absorbed (blood DHT fell by about a third with the licensed spray) and carries the same warnings and follow-up as
  the tablet. Keep pregnant partners and children away from the treated scalp.
- **A clash to solve first.** The licensed minoxidil solution's SmPC says not to use it with other scalp medicines.
  So this spray pairs naturally with **minoxidil tablets** (M4), not with licensed topical minoxidil, unless the
  prescriber records a reason.
- **Legal route.** (c) Unlicensed special from an MHRA-licensed specials manufacturer, with stability data. Before
  choosing a UK-made special, check two things: (1) whether a licensed finasteride spray now has a UK licence (one UK
  pharmacy claims "Finjuve" does; the MHRA register did not list it on 23 November 2026); (2) whether an imported
  product licensed in its country of origin can be supplied instead, which MHRA guidance ranks above a UK-made special
  (from the UK sweep; **verify**).
- **Evidence.** Moderate for the licensed 0.25% spray (one phase III trial, 24 weeks, many hair counts missing); weak
  for compounded versions. The US FDA (April 2025) received 32 reports of mood, sexual and other effects with
  compounded topical finasteride, most persisting after stopping.
- **Advertising.** Never mentioned in any advert, social post, email or public price list. Its price is shown only
  inside the consultation of a patient for whom it is being considered.
- **Price (Proposal).** £25 a month. **Market:** Dr Fox's compounded triple spray £12 to £13; Sons'† finasteride 0.15%
  spray £22.67 to £27.67; Hims UK's finasteride and minoxidil spray £16.50 on a 6-month prepaid plan.
- **Cost of goods.** Unknown. Dr Fox's retail price (£26 for 60 ml) shows the making cost must be well below that.

### 3.5 For both sexes

#### B1. Ketoconazole 2% shampoo

- **What it is.** Licensed for dandruff and seborrhoeic dermatitis (sold in general-sale, pharmacy and
  prescription-only packs; none is licensed for hair loss). Wash twice a week for 2 to 4 weeks, leave on 3 to 5
  minutes, then once every 1 to 2 weeks. **Use it only when there is dandruff or seborrhoeic dermatitis**; never sell
  it as a hair-growth product (evidence: weak; five small studies, no randomised trial).
- **Open rule to settle before launch.** Topical minoxidil's SmPC contraindicates "other scalp medicines". Whether a
  rinse-off medicated shampoo counts is not stated in any source read. Write a rule; until then the prescriber decides
  per patient and records why.
- **Price (Proposal).** Shelf price, one-off, no subscription. No benchmark in the files.

#### B2. Microneedling kit with a written protocol (later phase)

- **What it is.** A device (not a medicine) plus written instructions, as an add-on for patients using topical
  minoxidil. Copy the trial rule: needle once a week; **do not apply minoxidil on the day of needling; restart 24
  hours later**; never apply a lotion containing finasteride or dutasteride straight after needling (no trial measured
  how much needling raises blood levels).
- **Evidence.** Moderate as an add-on in men (about 13 more hairs per cm² than minoxidil alone at 24 weeks in a network
  meta-analysis); in women the certainty is low to very low. Trials used needle depths of 0.5 to 2.5 mm with no
  standard protocol; **home-use safety and the right depth are not covered by the research files**: take advice and
  choose a properly marked device.
- **Price (Proposal).** About £15 one-off (Sons† sells a dermaroller for £14).
- **Advertising.** Claims that a product slows or reverses hair loss need trial evidence (CAP Code 12.23); keep claims
  to what the trials show.

### 3.6 What we deliberately do not sell, and why

| Not sold | Why | Source |
|---|---|---|
| Minoxidil above 5% ("extra strength") | The only trial of 10% found it worse than 5% and more irritating | `clinical-men.md` 3.1 |
| Fixed-dose combination capsules or chews | No trial of any fixed combination; stopping one drug means stopping all | `clinical-men.md` 9 |
| "Everything in one bottle" lotions (latanoprost, cetirizine, melatonin, caffeine, steroids and so on) | No trial of the mixtures; each extra active adds irritation; steroids hide irritation instead of fixing the base | `clinical-men.md` 4, 9; `products-prices.md` 5.1 |
| Biotin or "hair vitamins" | No evidence in people who are not deficient; biotin can give false blood results, including a falsely low troponin (missed heart attack) | `clinical-men.md` 6; `clinical-women.md` 2.4 |
| Finasteride, dutasteride, bicalutamide or cyproterone for women | Contraindicated or unsuitable; pregnancy, liver and meningioma risks | `clinical-women.md` 3.4 to 3.6 |
| DNA or "will minoxidil work?" tests | Mainly company-funded evidence | `products-prices.md` 5.1 |
| Investigational drugs (clascoterone solution, pyrilutamide and others) | No UK licence; company announcements only. Watch the pipeline; build nothing on it until a UK licence exists | `clinical-men.md` 7 |

**Vitamin D:** we give the NHS general advice (consider 10 micrograms a day in autumn and winter; all year for people
rarely outdoors, who cover most of their skin, or who have dark skin; never more than 100 micrograms a day) and treat
a proven deficiency. We do not sell it as a hair treatment.

---

## 4. The consultation engine

### 4.1 Design rules (each fixes a failure seen in the research)

1. **Stoppers first.** Age, pregnancy and red flags come in the first screens, so nobody answers 40 questions to be
   told "see your GP" (`clinical-women.md` 4.1).
2. **No contact details before the verdict.** Everything up to the result screen is anonymous. Voy\* and Philip
   Kingsley take details first and refuse later.
3. **The result and the full price before sign-in.** Only four UK companies do this now (LloydsPharmacy, Numan,
   Treated, Dr Fox).
4. **Every question changes something, or says why it is asked** (for example "This is your starting score, so we can
   measure progress"). All 42 Hims UK quiz answers change nothing.
5. **Three outcomes, not two:** allowed, not allowed, or "your prescriber decides and records why".
6. **One plain sentence for every removal**, and what is still possible.
7. **A stop is final for that consultation.** No "change your answer and continue". If someone goes back and changes
   a safety answer, the prescriber sees both answers.
8. **One safety check on every way in**: adverts, product pages, re-orders, a second consultation in the same basket.
9. **Rules run on our server and every rule has an automated test** against its exact answer text (Philip Kingsley's
   blood-pressure rule failed because of one stray space).
10. **Preferences are asked last**, after safety, and only formats that are still allowed are offered.

**Action codes used below.**

| Code | What happens |
|---|---|
| **STOP-REFER** | The consultation ends. The screen says why in one sentence and names the next step (GP, urgent GP, dermatology, NHS 111). A printable note for the GP is offered without needing an account. No contact details are asked. |
| **CRISIS** | A crisis screen that cannot be clicked past (copied from Strut, US): "If you are in danger now, call 999. You can talk to Samaritans any time on 116 123. Your GP or NHS 111 can help today." The sale stops. |
| **ROUTE** | Switches to a different pathway: TE (shedding check, W5), PREG (pregnancy and new-mum care, W7) or TRACTION (W8). |
| **EXCLUDE x** | Takes product x off the list and shows one plain line saying why. |
| **ADD x** | Puts product x on the list (or makes it the suggested option). |
| **DOSE** | Sets a starting dose or a ceiling. |
| **BLOODS** | Names blood tests to order after sign-in (price shown on the result screen). |
| **PHOTOS+** | Asks for extra photos (for example close-ups, hairline, eyebrows). |
| **TIER B** | The plan needs a call, a verified blood pressure and pulse where relevant, blood tests where relevant, and a GP letter. |
| **FLAG** | The prescriber must look at this answer before approving; the playbook note tells them what to check. |
| **COUNSEL** | Advice shown now, and repeated in the written plan. |
| **RECORD** | Kept as a baseline or for the record; changes nothing on screen. The screen says so. |

### 4.2 The journey at a glance

```
Welcome (no questions)
  -> Stage 1  Gates: age, where you live, sex, hormones, pregnancy, contraception, GP          (anonymous)
  -> Stage 2  Red flags: scalp, patches, brows, hairline, rapid hormone change, illness, mood  (anonymous)
  -> Stage 3  Pattern and timing: what, how long, what happened before, where, hair type       (anonymous)
  -> Stage 4  Women only: periods, menopause, HRT, acne, unwanted hair, PCOS                   (anonymous)
  -> Stage 5  Health and medicines (men: mood, sexual function, children, prostate)            (anonymous)
  -> Stage 6  Past treatment: what, how long, did it work, side effects                        (anonymous)
  -> Stage 7  Preferences: tablet or scalp, routine, pets, children, extra hair                (anonymous)
  -> RESULT SCREEN: likely diagnosis, route, options, what was ruled out and why, full prices  (anonymous)
  == SIGN-IN WALL ==
  -> Account -> ID check -> GP details -> guided photos -> (Tier B: blood pressure, blood tests,
     call booking) -> written information and consent -> card saved, not charged
  -> Prescriber review -> second pharmacist check -> payment taken -> dispatch
```

**Length (ESTIMATE).** With smart skipping (a question is skipped once the product it protects is gone, as
LloydsPharmacy does), a typical woman sees about 30 short screens (about 6 minutes) and a typical man about 22
(about 4 minutes). Red-flag questions are grouped onto a few screens, but each item is answered on its own.

### 4.3 Welcome screen (before any question)

The patient sees, in plain words:

- "This takes about 5 minutes. You will see what we think and the full price **before** we ask for your name."
- "A pharmacist prescriber makes the final decision. **You pay only if they approve.**"
- "We may ask for photos of your scalp, ID, a blood pressure reading or a blood test. We will tell you which, and
  what they cost, before you sign up."
- Who we are: pharmacy name and GPhC number, superintendent pharmacist, the prescriber's name, GPhC number and that
  they are a pharmacist (GPhC requirement), how to complain.
- "Your answers stay in this session. **Delete my answers** at any time. Tick here if you want us to keep them for 7
  days so you can come back." (Copied from Hims UK. Health data is special category data: the DPIA must cover this
  anonymous stage.)

### 4.4 Stage 1: gates

| # | Question (plain words) | Options | What each option does | Why |
|---|---|---|---|---|
| 1.1 | What is your date of birth? | Date | Under 18: **STOP-REFER** ("We only treat adults. Please see your GP.") 18 to 64: continue. 65 to 74: continue; **FLAG** (licensed topical minoxidil is outside its licence age; men's foam licence is 18 to 49) and **DOSE** (minoxidil tablets only at the lowest start, with a verified blood pressure and GP agreement). 75 or over: continue; **EXCLUDE** minoxidil tablets (new starts); **FLAG** | Every licence starts at 18; topical minoxidil licences end at 65 (men's foam at 49); oral minoxidil has few data over 65 and can cause dizziness on standing. The 75 limit is our Proposal; re-checked at the ID step |
| 1.2 | Where do you live? | England / Scotland / Wales / Northern Ireland / Outside the UK | Great Britain: continue. Northern Ireland: **STOP** ("We cannot serve Northern Ireland yet"), with a signpost to the GP or a local pharmacy. Outside the UK: **STOP** | Northern Ireland has its own pharmacy regulator and advertising list; not researched |
| 1.3 | What sex were you registered with at birth? We ask because medicines and doses differ. | Female / Male / Intersex, or I'd like to explain | Female: women's route. Male: men's route. Intersex or explain: **FLAG**: prescriber call before any plan | Finasteride, dutasteride and men's 5% solutions are contraindicated in women; doses differ |
| 1.4 | Do you take testosterone, anabolic steroids, oestrogen, or hormone blockers (including gender-affirming hormones)? (HRT and contraception are asked later) | Yes (which) / No | Yes: **FLAG**: the prescriber decides the route; men on testosterone or anabolic steroids: **COUNSEL** (these can drive pattern loss) | Not covered by the research files, so a person decides, not a rule |
| 1.5 | [Women] Are you pregnant, trying to get pregnant, or breastfeeding? | Pregnant / Trying / Breastfeeding / Had a baby in the last 12 months, not breastfeeding / None of these | Pregnant, trying or breastfeeding: **ROUTE** PREG (no medicines; free care, W7); she may still answer the shedding questions for advice. Baby in the last 12 months: continue, and "childbirth" is pre-ticked in 3W.3. None: continue | Topical minoxidil "should not be used during pregnancy or lactation"; tablets and anti-androgens are worse (`clinical-women.md` 3.12) |
| 1.6 | [Women] Could you become pregnant? | Yes / No, after the menopause / No, because of surgery or a medical reason / Not sure | Yes or Not sure: ask 1.7. No: continue (the prescriber confirms at review) | Decides whether contraception matters |
| 1.7 | [Women] Which contraception do you use? | None / Condoms / Combined pill (which brand?) / Progestogen-only pill / Hormonal coil / Copper coil / Implant / Injection / Other | None: **EXCLUDE** spironolactone and minoxidil tablets ("These can harm a baby, so we only prescribe them with reliable contraception. A licensed scalp treatment is still possible.") Any method: **FLAG** (the prescriber confirms it counts as effective under the protocol). Combined pill: **RECORD**; no androgen blood tests while on it. A pill containing drospirenone (for example Yasmin): spironolactone allowed, **BLOODS** potassium in the first cycle | Anti-androgens can feminise a male fetus; oral minoxidil "not recommended" without contraception; the combined pill makes androgen tests unreliable; Yasmin SmPC. The protocol must define "effective" from UK contraception guidance (not in the files) |
| 1.8 | Are you registered with a UK GP, and may we tell them about any treatment we give? | Yes, and yes / Yes, but please don't tell them / I don't have a GP | Yes and yes: full range. No consent or no GP: licensed topical products only; **EXCLUDE** every tablet ("Tablets need us to share care with your GP"); **RECORD** the decision | GPhC: share with the GP for higher-risk prescribing, or record why it is still safe (`uk-regulation.md` 3.2) |

### 4.5 Stage 2: red flags (any "yes" stops, unless stated)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| 2.1 | Is your scalp painful, burning, tender, very itchy, red, scaly around the hairs, spotty or crusted? | Yes / Just flaky (dandruff) / Not sure / No | Yes: **STOP-REFER** (urgent GP or dermatology: "This could be a type of hair loss that scars, and scarring cannot be reversed"). Just flaky: continue; **ADD** B1 shampoo; **FLAG** (topical minoxidil is contraindicated on an abnormal scalp: the prescriber decides). Not sure: **PHOTOS+** (close-up) and **FLAG** | Scarring hair loss is permanent; PCDS says refer urgently |
| 2.2 | Are there smooth, shiny areas where no hair grows at all? | Yes / No | Yes: **STOP-REFER** (urgent) | Sign of scarring |
| 2.3 | Do you have one or more separate bald patches (often round)? | Yes / No | Yes: **STOP-REFER** (GP or dermatology; "see someone quickly if it is spreading fast or your eyebrows or eyelashes are going") | Alopecia areata, scalp ringworm, traction or hair pulling: not pattern loss |
| 2.4 | Are you losing eyebrows, eyelashes or hair elsewhere on your body? | Yes / No | Yes: **STOP-REFER** | Alopecia areata or frontal fibrosing alopecia |
| 2.5 | [Women] Is your front hairline, or the hair at your temples, moving back? | Yes / No / Not sure | Yes: **STOP-REFER** ("Hairline loss in women needs a face-to-face check"). Not sure: **PHOTOS+** (hairline pulled back, both temples, eyebrows) and **FLAG** | "Any hairline recession or eyebrow loss in a woman = refer" (`clinical-women.md` 1.9). Men skip this: it is the usual male pattern |
| 2.6 | [Women] In the last year, have you had a deeper voice, a lot of new face or body hair, much more muscle, or periods stopping (not from menopause, pregnancy or contraception)? | Yes, and it came on fast / Yes, slowly over years / No | Fast: **STOP-REFER** (urgent: GP for endocrine or gynaecology referral; printable letter). Slowly: continue to Stage 4 (PCOS questions) | Possible androgen-secreting tumour |
| 2.7 | [Women] Have you noticed a rounder face with new stretch marks and easy bruising, or your hands, feet or jaw getting bigger? | Yes / No | Yes: **STOP-REFER** (GP) | Features of Cushing's syndrome or acromegaly (PCDS) |
| 2.8 | Are you unwell in other ways: losing weight without trying, fevers, night sweats, joint pains, a new rash, or extreme tiredness? | Yes / No | Yes: **STOP-REFER** (GP) | Hair loss may be a sign of a general illness |
| 2.9 | [Men] Any lump, pain or discharge in either breast? | Yes / No | Yes: **STOP-REFER** (GP) | Male breast cancer has been reported with finasteride; check first |
| 2.10 | [Men] Did your hair loss start suddenly, over days or weeks, or is it falling out all over your head? | Yes / No | Yes: **STOP-REFER** (GP: "Sudden or all-over loss in men is not usually pattern hair loss") | Remote treatment suits gradual pattern loss only; the minoxidil product information excludes sudden or patchy loss |
| 2.11 | Over the last 2 weeks, how often have you (a) had little interest or pleasure in doing things, (b) felt down, depressed or hopeless? | Not at all / Several days / More than half the days / Nearly every day (each) | Always **RECORD** (mood baseline). Any answer above "Not at all": support information shown (GP, local NHS talking therapies). Men with a raised score: **FLAG**: a prescriber talks with him before any finasteride or dutasteride. Minoxidil is never removed for mood | Two standard questions (the PHQ-2, as Sons† uses). The MHRA asks prescribers to ask about depression before finasteride, decide with the patient and review regularly; it does not say block, and says nothing against minoxidil |
| 2.12 | Have you had thoughts of ending your life or harming yourself? **Asked to everyone; never skipped.** | Yes, in the last month / Yes, in the last year / Yes, longer ago / No | Last month: **CRISIS**. We offer a call from our pharmacist within one working day; this is the only place we ask for a phone number before sign-in, and it is optional. Last year: **FLAG** (men: no 5-ARI without a prescriber call); support information. Longer ago: **RECORD**; men: **FLAG** for 5-ARIs (shared decision) | Numan gives no crisis help here and skips the question after a recent dose change; Sons† shows nothing. Never a quiet product swap |
| 2.13 | How much is your hair affecting your life? (0 to 10) Do you avoid going out, or is it affecting work or relationships? | Score; Yes / No | Always **RECORD** (outcome baseline). 8 or more with "Yes": **FLAG**: prescriber call offered before any plan; support information | PCDS lists moderate to severe distress as a reason to refer; hair loss has a real psychological cost |

### 4.6 Stage 3: pattern and timing (this makes the diagnosis)

**Women's route**

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| 3W.1 | What is happening to your hair? | More hair falling out than usual / Getting thinner, especially on top or at the parting / Both / Not sure | Falling out: telogen effluvium likely; go to 3W.3. Thinner on top: FPHL likely. Both: FPHL work-up plus **BLOODS** (full blood count, ferritin, thyroid). Not sure: photos decide; **FLAG** | Shedding versus thinning is the first sort |
| 3W.2 | When did you first notice it? | Under 3 months / 3 to 6 months / 6 to 12 months / Over a year | Shedding for more than 6 months: **BLOODS** (full blood count, ferritin, thyroid); consider FPHL as well | Shedding beyond 6 months needs a cause looked for |
| 3W.3 | In the 6 months before it started, did any of these happen? Tick all, and the month if you know it | Had a baby / Illness with a high fever, or COVID-19 / An operation / A big shock or stress / Fast weight loss or a very strict diet / Started a weight-loss injection (for example semaglutide or tirzepatide) / Started, stopped or changed a medicine / Stopped the pill or another hormone, including HRT / None of these | Any trigger with shedding: **ROUTE** TE (W5); the screen shows a timeline ("your shedding began about 3 months after X, which fits"). Weight-loss injection: **BLOODS** (full blood count, ferritin, plus thyroid if diffuse); ask 3W.3a; do not advise stopping the injection. Medicine change: **COUNSEL** (talk to that medicine's prescriber; do not just add a hair treatment) and **FLAG**. Diet or weight loss: ask 3W.3a. None, with shedding: **BLOODS** | The trigger question nobody asks; TE starts about 3 months after the trigger; no cause is found in 1 in 3 |
| 3W.3a | Are you eating much less than usual, skipping meals most days, or worried about your eating? | Yes / No / Prefer not to say | Yes or prefer not to say: **FLAG**; prescriber call; GP signpost | Very low intake can point to an eating disorder (author's synthesis in `clinical-women.md` 1.3) |
| 3W.4 | Where is your hair thinner? (pictures; tick all) | Top and crown, front hairline kept / Temples and crown, like a man's pattern / At the edges where hair is pulled / Middle of the crown, spreading outwards / Evenly all over / Front hairline moving back | Top and crown: FPHL. Man's pattern: **STOP-REFER** (GP; printable letter suggesting testosterone and SHBG tests). Edges: **ROUTE** TRACTION (W8). Middle of crown: see 3W.5. All over: diffuse; **BLOODS**. Hairline moving back: **STOP-REFER** (consistency check with 2.5) | Male-pattern loss in a woman is very uncommon unless androgens are raised; traction and CCCA need different care |
| 3W.5 | What is your natural hair like? | Straight / Wavy / Curly / Tightly curled or coily | Tightly curled with crown thinning: ask 3W.5a. All: used for product fit (washing routine, foam or tablets) | The CCCA trap: early scarring on the crown looks like FPHL |
| 3W.5a | On your crown, do you have tenderness, itch or hair breaking off? | Yes / No | Yes: **STOP-REFER** (dermatology; early treatment limits permanent loss). No: continue; **PHOTOS+** (crown close-up) and **FLAG** (low bar for referral) | `clinical-women.md` 1.10 |
| 3W.6 | How do you usually wear your hair? (tick all) | Tight ponytail or bun / Braids or cornrows / Weaves or extensions / Relaxers or chemical straightening / Wigs fixed with clips or glue / Tight head scarf / None of these | Any, with loss at the edges: **ROUTE** TRACTION. Any, without edge loss: **COUNSEL** (lower the tension) | Traction alopecia: stop the pulling first |
| 3W.7 | Has anyone in your family had thinning hair (either parent's side)? | Yes / No / Don't know | No or don't know: **FLAG**: the prescriber confirms FPHL from photos and records why before licensed minoxidil | The SmPC says licensed topical minoxidil "is not indicated when there is no family history" |
| 3W.8 | How would you rate your hair now (0 to 10)? | Score | **RECORD** (outcome baseline); the screen says so | Lets results be measured, not guessed |

**Men's route**

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| 3M.1 | Where are you losing hair? (pictures; tick all) | Temples / Crown / Across the top / Very little hair left on top | Temples, crown or top: male pattern likely. Very little left: **COUNSEL** honest screen ("Medicines mainly keep the hair you have. Where very little is left they are unlikely to help much"), with surgery and cosmetic options; he may continue to protect what is left; **FLAG** | Honest expectations (Keeps' "Mostly Scalp" pattern) |
| 3M.2 | How long has it been going on? | Under 1 year / 1 to 3 years / 3 to 5 years / Over 5 years | **RECORD** (expectations, photo comparison) | Context for results |
| 3M.3 | In the 6 months before it started or got worse, did any of these happen? | Illness with a high fever, or COVID-19 / An operation / Fast weight loss or a weight-loss injection / Started or stopped a medicine (including testosterone or anabolic steroids) / A big shock or stress / None | Any, with shedding: explain telogen effluvium (W5 available). Any, with typical pattern: treat the pattern and explain. Testosterone or steroids: **FLAG** and **COUNSEL** | The trigger question applies to men too |
| 3M.4 | Has anyone in your family had pattern hair loss? | Yes / No / Don't know | **RECORD** (supports the diagnosis) | |
| 3M.5 | What matters most to you? | Keeping what I have / Regrowing some / Both | **COUNSEL** (finasteride's main effect is stopping further loss; regrowth is modest) | Over-promising feeds "no results" complaints |
| 3M.6 | How would you rate your hair now (0 to 10)? | Score | **RECORD** (outcome baseline) | |

### 4.7 Stage 4: hormones and life stage (women only)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| 4.1 | What are your periods like? | Regular / Irregular or far apart / Stopped: menopause / Stopped: because of contraception / Stopped: after a hysterectomy / Never regular | Irregular, far apart, never regular, or stopped for no clear reason: **BLOODS** (early-morning testosterone and SHBG, plus prolactin, FSH and thyroid if periods are infrequent) and GP letter. On the combined pill: **no** androgen tests (unreliable); the prescriber discusses with the GP instead | PCDS hyperandrogenism pathway; the pill trap (`clinical-women.md` 2.3) |
| 4.2 | Where are you with the menopause? | Not started / Changes have started (perimenopause) / Periods have stopped / Not sure | Perimenopause, after, or age 45 or over: **PHOTOS+** (hairline with hair pulled back, both temples, eyebrows: required). After: ask 4.4 | Frontal fibrosing alopecia mainly affects women after the menopause; check hairline and eyebrows in every woman over about 45 |
| 4.3 | Do you take HRT? | No / Yes (which, and since when) / Stopped or changed in the last 6 months | Stopped or changed: possible shedding trigger (**ROUTE** TE if the pattern fits). All: **RECORD** the type; **COUNSEL** ("We do not start or change HRT for hair; that is for your GP or menopause service") | HRT data for hair are limited and inconsistent; stopping a hormone can trigger shedding |
| 4.4 | [After menopause] Since the menopause, have you had new hair on your face or body, or new acne? | Yes / No | Yes: **STOP-REFER** (GP, with a printable letter suggesting testosterone and SHBG tests) | New androgen signs after the menopause need investigation for a tumour or ovarian hyperthecosis |
| 4.5 | Do you have acne, or unwanted hair on your face, chest or tummy? Have you been told you have PCOS? | Yes (which) / No | Yes: **BLOODS** (testosterone and SHBG, not on the combined pill); GP involvement (PCOS also needs diabetes and heart-risk checks); **ADD** W3 spironolactone as an option if contraception is in place | 22% of women with PCOS had pattern hair loss; hair loss without unwanted hair is a weak predictor of raised androgens, so test only with signs |

### 4.8 Stage 5: health and medicines

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| 5.1 | Do you have high blood pressure? | No / Yes, treated and well controlled / Yes, treated but often high / Yes, not treated / Don't know | Any "Yes": **EXCLUDE** licensed topical minoxidil by default ("Its product information lists high blood pressure as a reason not to use it"), with **FLAG**: the prescriber may allow it with a recorded reason, such as GP agreement (**TIER B**). Minoxidil tablets: women on blood-pressure medicines **EXCLUDE**; men **TIER B** with a verified reading and full medicines list. Don't know: a blood pressure reading is required before any minoxidil (Proposal) | Licensed topical SmPC contraindication; three outcomes, not blunt removal |
| 5.2 | Do you have any of these heart conditions? (tick) | Heart failure / Fluid around the heart or pericarditis, ever / High blood pressure in the lungs with a narrow mitral valve / Fast or irregular heartbeat / Chest pain / Another heart condition / None | First three: **EXCLUDE** minoxidil tablets. Fast or irregular heartbeat: tablets only with GP or cardiology input (**FLAG**). Chest pain or another heart condition: tablets **EXCLUDE** pending the GP; women's topical minoxidil only after medical advice (**FLAG**) | Consensus contraindications and precautions for oral minoxidil; the women's topical SmPC says see a doctor first |
| 5.3 | Do you have low blood pressure, faint, or feel dizzy when you stand up? | Yes / No | Yes: minoxidil tablets only with a verified reading of at least 90/60 and GP input (**FLAG**). Topical minoxidil is **not** removed; **COUNSEL** about dizziness | Below 90/60 is a precaution for tablets only; removing topical (Numan, LloydsPharmacy, Dr Fox) is stricter than the evidence |
| 5.4 | Have you been told you have a phaeochromocytoma (a rare adrenal gland tumour)? | Yes / No | Yes: **EXCLUDE** minoxidil tablets | SmPC contraindication |
| 5.5 | Do you have kidney disease, or are you on dialysis? (latest kidney test result if known) | Yes / No | Yes: women **EXCLUDE** spironolactone; minoxidil tablets only with GP input (**FLAG**) | Spironolactone contraindication; oral minoxidil precaution |
| 5.6 | Do you have liver disease? | Yes, severe / Yes, mild / No | Severe: men **EXCLUDE** dutasteride; all tablets **FLAG**. Mild: **FLAG** | Dutasteride contraindicated in severe liver impairment; caution with oral options |
| 5.7 | [Women] Have you had Addison's disease, or high potassium in a blood test? | Yes / No | Yes: **EXCLUDE** spironolactone | SmPC contraindication |
| 5.8 | Right now, do you have scalp psoriasis, eczema, sunburn or broken skin, a shaved head, or use another medicine on your scalp? | Yes (which) / No | Yes: **EXCLUDE** topical minoxidil until settled ("Treat the scalp first"); tablets offered if otherwise suitable | SmPC contraindications; other scalp medicines raise absorption |
| 5.9 | Have you reacted to a hair-loss product before? | No / Itch or rash with a minoxidil liquid only / A reaction with minoxidil foam, or any minoxidil product / [Men] A reaction to finasteride / Something else | Liquid only: **EXCLUDE** minoxidil solutions; **ADD** foam ("Most reactions to the liquid are to propylene glycol, which the foam does not contain"). Foam or any minoxidil: **EXCLUDE** all minoxidil (true allergy). Finasteride: **EXCLUDE** all finasteride. Something else: **FLAG** | Propylene glycol is the usual culprit; no company in the research asks *what* reacted |
| 5.10 | Any other allergies or intolerances, including lactose or galactose? | Yes (which) / No | Lactose or galactose: **FLAG** (check the excipients of the chosen tablet brand against its SmPC). Others: **FLAG** | Company documents say finasteride tablets contain lactose; not verified against the SmPC |
| 5.11 | Which medicines do you take? (pick list plus free text; the prescriber always sees the free text) | Any blood-pressure medicine (how many; doxazosin?) / ACE inhibitor or sartan / Potassium tablets or a potassium salt substitute / Regular anti-inflammatory painkillers such as ibuprofen / Heparin injections / Lithium / Digoxin / Co-trimoxazole or trimethoprim / Eplerenone or another potassium-sparing water tablet / [Men] Dutasteride or finasteride 5 mg for the prostate / [Men] Ritonavir, itraconazole or ketoconazole tablets / Weight-loss injection / Testosterone or anabolic steroids / A medicine started in the last 6 months / None | Blood-pressure medicines: women **EXCLUDE** minoxidil tablets; men **TIER B** (doxazosin or three or more: extra caution). ACE inhibitor, sartan, potassium, NSAIDs, heparin, lithium, digoxin, co-trimoxazole or trimethoprim: women **EXCLUDE** spironolactone, or only with GP agreement and potassium checks. Eplerenone or a potassium-sparing diuretic: **EXCLUDE** spironolactone. Men on a 5-ARI for the prostate: **EXCLUDE** all 5-ARIs, minoxidil only, tell the GP. CYP3A4 inhibitors: **FLAG** for dutasteride. Weight-loss injection: ask 5.12. New medicine: **FLAG** (possible trigger). Erection tablets (men) are **RECORD** only: no automatic block | `clinical-women.md` 3.3 and 4.1 Q27; `clinical-men.md` 2.1, 2.3, 10.2. Trimethoprim alone is unverified (BNF not read): treated like co-trimoxazole until checked |
| 5.12 | [If a weight-loss injection] Which one, since when, how much weight have you lost, and when did the dose last change? | Free entry | **ROUTE** TE if the pattern fits; **BLOODS** (full blood count, ferritin; thyroid if diffuse). Women on tirzepatide who rely on the pill: **COUNSEL** and **FLAG**: before spironolactone or minoxidil tablets, switch to a non-oral method or add condoms for 4 weeks after starting and after each dose rise | Mounjaro SmPC; women are disproportionately affected by injection-related shedding |
| 5.13 | Do you take any supplements? | Biotin or "hair, skin and nails" / Vitamin A / Selenium / Iron / Vitamin D / Other / None | Biotin: **COUNSEL** ("Tell us and the laboratory before any blood test: biotin can give false results"). High-dose vitamin A or selenium: **COUNSEL** to stop (they can cause hair loss). All: **RECORD** | `clinical-women.md` 2.4 |
| 5.14 | Do any of these apply? | Vegetarian or vegan / Very low-calorie diet / [Women] Heavy periods / Bowel disease such as coeliac or Crohn's / Weight-loss surgery / None | Any: **BLOODS** (full blood count and ferritin; others only for a clinical reason) | Points to iron deficiency |
| 5.15 | [Men] Have you ever had depression, anxiety, self-harm or suicidal thoughts? Are you under a mental health team now? Has a mental health medicine changed in the last 3 months? | Yes / No (each) | Any yes: **FLAG**: a prescriber talks with him before any 5-ARI, decides with him, and gives the warning in writing. Minoxidil is never removed for a mood history. Question 2.12 is still asked | MHRA April 2024 and 11 May 2026; Treated and Philip Kingsley over-block minoxidil |
| 5.16 | [Men] How are your sex drive, erections and ejaculation right now? (baseline) | Normal for me / Some change / A lot of change / Prefer not to say (each) | Always **RECORD** (baseline for later checks). Any problem: **FLAG**; minoxidil-only offered if he prefers | Needed to judge later change; effects can persist after stopping; no company records a baseline |
| 5.17 | [Men] Have you had side effects from finasteride or dutasteride before? | Mood change / Sexual problems that lasted / Breast tenderness / Something else / Never taken / No side effects | Mood change or lasting sexual problems: **EXCLUDE** all 5-ARIs, tablets and topical, unless a specialist advises. Other: **FLAG** | Effects can persist; topical is not a way round the warning |
| 5.18 | [Men] Are you trying for a baby, having fertility treatment, or is your partner pregnant? | Trying now or within a year / Fertility treatment / Partner pregnant / None | Trying or fertility treatment: **FLAG**; **EXCLUDE** dutasteride; finasteride by shared decision. Partner pregnant: tablets **COUNSEL** (she must not handle crushed or broken tablets); dutasteride needs a condom; topical 5-ARI **EXCLUDE** or strict transfer advice | Semen exposure to finasteride is judged unlikely to harm; dutasteride's effects last months; skin transfer is the risk with topicals |
| 5.19 | [Men] Do you have PSA blood tests, or have you had prostate cancer or prostate treatment? | PSA tests / Prostate cancer / Prostate enlargement treatment / None | Prostate cancer: **FLAG**: GP or urologist agreement before any 5-ARI. PSA tests: **COUNSEL** and GP letter (finasteride: consider doubling the PSA result; dutasteride halves it by 6 months) | So prostate checks are read correctly |
| 5.20 | [Women, automatic, no question] Age 45 or over and spironolactone is an option | (none) | **BLOODS** U&E at baseline, and a repeat potassium plan | High potassium in 10.1% of women 45 and over |

### 4.9 Stage 6: past treatment

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| 6.1 | Have you used a hair-loss treatment before? (tick all) | Minoxidil liquid or foam / Minoxidil tablets / Finasteride / Dutasteride / Spironolactone / Something else / None | For each one ticked, ask 6.2 | A real treatment history (copied from LloydsPharmacy) |
| 6.2 | For each: how long, did you use it as directed, did it help, any side effects? | Under 3 months / 3 to 6 / 6 to 12 / Over 12 months; Mostly / Sometimes; Better / Same / Worse / Too early to tell; side effects (pick list and free text) | Topical minoxidil under 6 months: **COUNSEL** ("Too early to call it a failure"). Topical failed after 6 to 12 months used as directed: tablets become an option (**TIER B**). Men, finasteride plus minoxidil for 12 months or more used reliably without enough response: **ADD** M5 dutasteride (instead of finasteride, never with it). Helped: **ADD** the same treatment. Side effects: as 5.9 and 5.17 | Avoids calling a short trial a failure; sets the step-up ladder |

### 4.10 Stage 7: preferences (asked last; only allowed formats are shown)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| 7.1 | Which would you prefer? | A tablet / Something for my scalp / No preference | Honoured among the options still allowed; if not possible, one line says why. "No preference" never defaults to an off-label or unlicensed product: licensed topical comes first | Sons† treats "I don't mind" as an unlicensed capsule; Hair + Me's format choice is not binding |
| 7.2 | [If a scalp product is possible] How often do you wash your hair, and how do you style it? | Daily / Every 2 to 3 days / Weekly or less; free text | Product fit: foam or solution; for infrequent washing or textured hair, **COUNSEL** on residue and offer tablets if clinically suitable | Women with textured hair complained about serums that needed daily washing |
| 7.3 | Do you have cats or dogs at home? | Cats / Dogs / Both / None | Any: **COUNSEL** (topical minoxidil can poison cats; wash hands, keep pets off pillows and away from treated hair); tablets suggested if clinically suitable | Cat poisonings; copied from Hair + Me and LloydsPharmacy |
| 7.4 | Do babies or young children touch your head or pillow? | Yes / No | Yes: **COUNSEL** (keep them away from the treated scalp and pillow) | Excess hair growth in infants after contact |
| 7.5 | [Women, if tablets are possible] Would extra hair on your face or body be unacceptable to you? | Yes / No / Not sure | Yes: prefer topical; tablets only at the lowest dose if at all. No or not sure: continue, with honest **COUNSEL** (likely at 1 mg) | Facial hair in 73% of women on 1 mg when looked for |
| 7.6 | Do you smoke? | Yes / No | Yes: **COUNSEL** (solutions and foam are flammable: do not apply while smoking). Never a block | No clinical reason to block for smoking, alcohol or weight |

### 4.11 The result screen (still anonymous, before sign-in)

What the patient sees, in this order:

1. **What we think is going on**, in plain words and labelled provisional. Examples: "Your answers fit female
   pattern hair loss." "Your answers fit shedding after a trigger (telogen effluvium). It usually settles by itself
   within 3 to 6 months." "You need a doctor to look at your scalp" (only for stops, shown earlier).
2. **Your route:** Shedding check, Tier A (questionnaire and photos) or Tier B (plus a call, a blood pressure reading,
   blood tests if needed and a letter to your GP), and why.
3. **Your options**, each with one line on what it is, whether it is licensed, off-label or unlicensed, and an honest
   expectation (for example "About 1 woman in 4 notices clear regrowth; judge it at 6 months").
4. **What was ruled out and why**, one line each ("Minoxidil tablets: not with your heart condition").
5. **The full price** of each option per calendar month, delivery included, and the price of any blood test. No
   first-order discount; the same price on monthly or longer deliveries.
6. **What happens next and when:** account, ID check, photos, any blood pressure reading, blood tests or call, and
   how long the prescriber takes.
7. "**A pharmacist prescriber makes the final decision. You pay only if they approve.**"

Buttons: **"Continue to my consultation"** (never "Buy now" or "Add to basket": banned for prescription medicines),
"Email me this summary" (optional, separate consent), "Delete my answers".

Naming medicines here is part of a consultation the person chose to start, not an advert. Keep the wording factual and
balanced, and have the screen reviewed by a regulatory adviser before launch (`uk-regulation.md` 2.2).

### 4.12 After the sign-in wall

| Step | What happens | Why |
|---|---|---|
| A. Account | Email and password (or a one-time link), name, address, phone for delivery and reminders. Marketing consent is separate and unticked | GPhC; data protection |
| B. Identity | Photo ID plus a selfie match, or a credit-reference check. The date of birth must match question 1.1. The system flags multiple accounts, shared payment details, several people at one address and orders that are too frequent | GPhC distance guidance 2025 |
| C. GP | Practice details; consent confirmed. Optional consent to view the NHS Summary Care Record (copy Sons†; check feasibility) | Independent verification for higher-risk medicines |
| D. Guided photos | **Women (6):** parting from above (dry hair, middle parting, good light); front hairline with hair pulled back; left temple; right temple; crown from above; eyebrows close-up; plus a close-up of any patch or sore area. **Men (5):** front hairline with hair pushed back; both temples; top from above; crown from above; plus brows, beard or any patch if flagged. An on-screen guide and a quality check (blur, light) ask for retakes | `clinical-women.md` 1.1 (author's synthesis; no UK standard exists). Photos that do not fit the history mean **refer** |
| E. Blood pressure (Tier B) | Two readings on different days from an upper-arm monitor (home, pharmacy or GP), with a photo of each display, and the pulse (Proposal: the files ask for "a real blood pressure and pulse reading" and independent verification where possible) | Stricter than the consensus on purpose, because we cannot examine the patient |
| F. Blood tests (if ordered) | Book a home sample kit or a local laboratory visit; price shown before booking; biotin reminder; no androgen tests on the combined pill | `clinical-women.md` 2.4 and 4.2 |
| G. Call (Tier B) | Book a video or phone call with the prescriber | GPhC: no higher-risk prescribing on a questionnaire alone |
| H. Written information and consent | Off-label or unlicensed status and what it means; the early shed; the finasteride patient-card text; contraception; side effects; when to stop. A real opt-out for each medicine | GPhC; MHRA prescribers' responsibilities |
| I. Card saved, not charged | "You pay only when your prescriber approves your plan" | Removes the refund fight (24% of negative reviews mention refunds refused) |

### 4.13 The prescriber's review

- The prescriber sees every answer, every changed answer, each **FLAG** with a playbook note (what to check and the
  usual decision, copied from Numan's approach), the photos, readings, blood results and record checks.
- Decisions: approve as suggested; approve with a change; approve after the call; refer; or decline. Every off-label
  or unlicensed decision, every departure from an SmPC and every "prescriber decides" outcome is recorded with the
  reason (MHRA; GPhC; GN14).
- **A second pharmacist** does the clinical and accuracy check before dispensing, and patients are told they may take
  a prescription elsewhere (GPhC prescriber guidance: keep prescribing separate from supply where possible).
- Payment is taken only after approval; the patient gets the plan, the reasons and the follow-up dates in writing.

---

## 5. The service around the medicine

Customers mostly complain about the service around the consultation (cancelling, delivery, no human, no results),
but those failures start in design (`engines-experience.md` 4). This section fixes each one. Timings marked
**Proposal** are our service standards, not legal requirements.

### 5.1 Prescriber review and who does what

- **Who prescribes.** The owner (a pharmacist independent prescriber) at launch, then further pharmacist prescribers.
  The website names each prescriber, their GPhC number and that they are a pharmacist.
- **Who checks.** A second pharmacist does the clinical and accuracy check before anything is dispensed. The GPhC
  wants prescribing kept separate from supply where possible, and inspectors tested exactly this at Voy\* in 2026
  (`uk-regulation.md` 3.4, 3.5).
- **No doctors or nurses in treatment at launch.** A pharmacist-only service run from a registered pharmacy in England
  does not need CQC registration; one doctor or nurse in the treating team changes that. Get the CQC's view in writing
  before involving any doctor, even as a policy adviser (`uk-regulation.md` 4).
- **Turnaround (Proposal).** Tier A decision within one working day of complete photos. Tier B call offered within
  three working days. The patient sees which step is waiting and why.

### 5.2 Follow-up schedule (built into the product, not optional)

No company in the research publishes a follow-up schedule (`engines-experience.md` 2B). Ours comes from
`clinical-men.md` 10.3 and `clinical-women.md` 4.4 (both authors' syntheses, not published guidelines).

| When | Women | Men | How |
|---|---|---|---|
| Before the first dose | Early-shed warning (any minoxidil); how to use; what to expect and when; contraception reminder (Tier B); off-label explanation | Patient-card information for finasteride (stop at once and contact us if low mood or suicidal thoughts); early-shed warning (minoxidil); baseline mood and sexual function already recorded | Written plan, in the parcel and in the account |
| Days 3 to 7 after starting or raising minoxidil tablets | Lightheadedness, fast or irregular heartbeat? | Same | Message with "all fine" / "I have a problem" buttons |
| Weeks 2 to 4 | Early-shed reassurance (shedding can rise at 2 to 6 weeks); scalp irritation (switch to foam); mood | Mood and sexual-function questions (5-ARIs); scalp; dizziness or swelling (tablets) | Short check-in; prescriber reads any problem the same working day |
| Weeks 4 to 6 | Minoxidil tablets: swelling, weight gain, breathlessness, chest pain; repeat blood pressure and pulse. Spironolactone: step-up decision at about one month if tolerated and blood tests are normal; potassium test if 45 or over, at risk, or on a drospirenone pill (first cycle) | Minoxidil tablets: same checks and a repeat reading | Check-in plus reading upload |
| 3 months | Side effects; iron re-check if on an iron trial; shedding-check photos | Side effects; mood and sexual function; "too early to judge hair" | Review |
| 6 months | **Photo comparison with the baseline.** 5% foam: the SmPC says stop if no improvement by 24 weeks, so change the plan. Tablets: the effect may only show by 6 months. Spironolactone: continue (full effect at 12 to 18 months). Shedding check: still shedding, or the parting is widening: FPHL work-up, blood tests, or referral | **Photo comparison.** First judgement of effect; change the plan if needed | Prescriber review |
| 12 months | Photos. 2% solution: stop if no improvement (SmPC). Continue, change or stop | Photos. Topical minoxidil: stop if no improvement after a year (SmPC). Finasteride plus minoxidil without enough response: offer dutasteride instead of finasteride (M5) | Prescriber review; the plan may change |
| Every 6 months after that | Photos; new medicines; potassium as planned | Photos; mood and sexual function | Review |
| Before **every** supply of a Tier B medicine | Pregnancy and contraception; new medicines; blood pressure if on minoxidil tablets (Proposal) | New medicines; mood (5-ARIs) | Two-minute check before dispatch |
| Any time | New red flag (scalp symptoms, hairline or eyebrow loss, patches, androgen signs): stop and refer. Planning a pregnancy: stop all treatment first; wait one month after spironolactone (NHS leaflet) | Low mood or suicidal thoughts on finasteride: stop at once (MHRA). Chest pain, breathlessness, fainting, rapid weight gain or marked swelling on minoxidil tablets: stop and get medical help | "Report a problem" button everywhere |

**Ship and review together.** Reviews and any ID re-checks start 4 to 6 weeks before the supply runs out, so a check
never leaves someone without treatment (a Hair + Me customer was asked for an annual review 4 days before running out).

### 5.3 Side effects

- A **"Report a side effect"** button in the account and in every email goes to a clinical inbox, never to sales.
- A named prescriber replies **the same working day** (Proposal). Urgent symptoms get instructions on screen at once
  (chest pain or breathlessness: 999; suicidal thoughts: the crisis screen).
- **Billing pauses automatically** until the prescriber closes the report.
- A side-effect report is **never** answered with a discount or a retention offer (a Sons† customer who reported a side
  effect was asked whether they wanted to cancel).
- We report suspected reactions on the **Yellow Card** scheme, including reactions to any special, and help the patient
  report too.
- If a side effect means treatment must stop, we refund the unused part of the supply.
- Side-effect rates by product are reviewed every quarter (clinical audit).

### 5.4 Photos and tracking

- Baseline photo set before the first prescription (diagnosis, not just marketing). Repeat at 6 and 12 months, then
  every 6 to 12 months, using the same guided angles and a lighting check.
- A side-by-side viewer in the account. Two 0 to 10 scores (hair rating, how much it affects life) at every review,
  so results are measured, not guessed (copied from Hair + Me's wellbeing scores).
- An honest rule: if photos show no benefit at the planned review, we change or stop the treatment. We do not keep
  billing for something that is not working.
- Photos are health data: stored in the UK (or an equivalent jurisdiction), covered by the DPIA, deleted on request
  within the record-keeping rules.

### 5.5 Blood tests

| Situation | Tests | What the result does |
|---|---|---|
| Typical FPHL, slow, regular periods, no androgen signs, eats normally, topical treatment | None needed to start | |
| Diffuse shedding, unclear pattern, or shedding over 6 months | Full blood count, ferritin, thyroid (TSH) | Low haemoglobin with low ferritin: **GP referral**, not a sale (urgent pathway after the menopause). Ferritin below 30: iron and a GP letter. 30 to 40 with shedding: time-limited iron trial. Abnormal thyroid: GP; hair treatment waits |
| Heavy periods, restricted diet, rapid weight loss, weight-loss injections, bowel disease, weight-loss surgery | Full blood count, ferritin (others only for a clinical reason) | As above |
| Irregular periods, unwanted hair, acne (not on the combined pill) | Early-morning testosterone and SHBG; prolactin, FSH and TSH if periods are infrequent | Mildly raised: assess for PCOS with the GP. Above 4.8 on repeat (the PCDS page gives no unit; use the laboratory's range) or any result with rapid change: **urgent referral** |
| Before spironolactone | U&E in everyone; repeat potassium if 45 or over, at risk, or on a drospirenone pill | Raised potassium or reduced kidney function: no spironolactone |
| Before minoxidil tablets with no precautions | None routinely; blood pressure and pulse instead | |
| Men with typical pattern loss | None routinely; men whose story suggests something else go to the GP | |

- **How:** an accredited UK laboratory, by home sample kit or a local visit. Quotes needed. Price shown before booking,
  charged at cost (Proposal).
- **Before any test:** ask about biotin and tell the patient to tell the laboratory (biotin gives false results; the
  stopping time depends on the dose and the assay). No androgen tests on the combined pill.
- Results are explained by the prescriber in writing; any abnormal result is copied to the GP.

### 5.6 GP communication

- GP details and consent are asked **before** the result screen (question 1.8), because they decide whether tablets
  are possible.
- With consent, every new prescription triggers a letter. Tier B always. The letter says (`clinical-women.md` 4.5):
  the diagnosis and how it was reached (history and photos, no examination); the medicine, dose and that it is
  off-label where relevant; baseline blood pressure, pulse and blood results; the contraception discussed; the
  monitoring plan and who does it; what would make us stop. For men: the PSA effect of finasteride or dutasteride.
- Updates go to the GP on a dose change, a stop, a serious side effect or a referral.
- No GP or no consent: licensed topical products only, and the reason is recorded (GPhC).
- Set up a secure electronic route to practices before launch.

### 5.7 Delivery

- Tracked, plain, discreet packaging; delivery included in the price.
- First supply dispatched within one working day of approval (Proposal).
- Next supply sent with about 3 weeks of treatment left; checks start 4 to 6 weeks before it runs out.
- **Never recommend what cannot be shipped.** A product that is out of stock is not shown (LloydsPharmacy recommended
  out-of-stock packs). Keep a stock buffer for every first-line product.
- Minoxidil solution and foam are flammable. Dr Fox ships them only to mainland UK for this reason: check courier
  rules before promising delivery to islands.
- A faulty pack (for example a spray pump that stops working) is replaced free at once.
- Delivery and stock problems were the main complaint in about 28% of a hand-read sample of negative reviews
  (`customer-voice.md`).

### 5.8 Subscription terms (built to the DMCCA rules now)

The DMCCA subscription rules are expected for contracts made from 1 January 2027; the regulations were still a draft
on 23 November 2026, so **check the final text before launch** (`uk-regulation.md` 6.3). We build to them from day one:

1. **Clear before you sign:** the price per delivery, how often, the total for the first year, how to cancel, and
   cooling-off rights, in one box before the patient commits.
2. **No lock-in needed for a fair price.** One price per calendar month whether deliveries are monthly or every 2 or
   3 months. No first-order discount and no price jump.
3. **Billing (Proposal):** pay per delivery. The first three deliveries are monthly (doses and products often change
   early); after the 3-month review, the patient chooses every 1, 2 or 3 months.
4. **A reminder before every charge**, 7 days ahead, by email and text (a "durable medium"), and before any price
   change. Reminders are service messages and **do not name a prescription medicine** ("Your next hair treatment
   delivery").
5. **Cancel or pause online in two taps**, by the same route used to join. No call, no email, no "are you sure?"
   discounts. Written confirmation at once.
6. **Cooling-off** information given; refunds made within 14 days where due.
7. **Safety comes first:** a failed review, a safety stop or a missing check ends supply and billing cleanly. Each
   repeat supply still needs a valid prescription and a clinical decision.
8. **Price changes (Proposal):** 30 days' notice and a fresh "yes"; otherwise the plan ends at the old price.

### 5.9 Guarantee (satisfaction, never results)

The ASA ruled against Numan (2022 and 2024) and Hims UK (2023) because refunds tied to regrowth imply that results are
guaranteed (`uk-regulation.md` 2.5). So our promises are about **our service**, not about hair:

- **You pay only if the prescriber approves.**
- **A full refund any time before we dispense.**
- **Not happy with our care in your first 90 days? Tell us and we refund your last payment.** (Proposal: test the cost.)
- **If a side effect means you must stop, we refund the unused part of your supply** and pause billing.
- We never say "see results or your money back".

### 5.10 Records, data and governance (the minimum)

- A written risk assessment for the whole service, reviewed regularly; standard operating procedures; a responsible
  pharmacist signed in; a superintendent pharmacist.
- Clinical records that show the reasons for every decision, the licensed options offered first, the special clinical
  need for any special, what the patient was told about off-label or unlicensed status, the GP sharing (or why not) and
  the follow-up plan (`uk-regulation.md` 5.5). Specials records kept for at least 5 years.
- ICO fee; a DPIA **before launch** (health data used to decide access to a service, and biometric ID checks, both
  trigger it); UK hosting; Article 6 plus Article 9(2)(h) as the legal basis.
- Indemnity that names online prescribing, off-label use and (if used later) specials.
- Website shows the pharmacy's GPhC number, owner, superintendent, prescriber details and how to complain.
- Quarterly clinical audit: stops and referrals, photos complete before prescribing, potassium and contraception checks
  done on time, blood pressure readings before tablets, side-effect response times.

---

## 6. Winning customers inside UK advertising law

### 6.1 The rules in one box

It is a **criminal offence** to publish an advert "likely to lead to the use of a prescription only medicine" to the
public, or any advert for an unlicensed medicine (Human Medicines Regulations 2012, regulations 284, 279 and 303;
`uk-regulation.md` 2.1). The MHRA's Appendix 6 and the ASA's CAP Code turn this into practical rules. **We may not:**

- name any prescription medicine (finasteride, dutasteride, minoxidil tablets, spironolactone) on the home page, in
  paid search, social posts, web addresses or marketing emails, including small print and hover text;
- mention, picture or make any claim for an unlicensed product; show labelled bottles or pills that look like the
  medicine supplied;
- say "prescription medication", list prescription ingredients in adverts, or call a treatment that includes an
  unlicensed medicine "clinically proven";
- use "Buy now", "Add to basket" or "Buy [drug]" for prescription medicines;
- promise results, or tie a refund to regrowth; say "safe", "no side effects", "best", "strongest" or "better than";
- use doctors, pharmacists, scientists, celebrities, customer testimonials or before-and-after photos to promote a
  prescription medicine;
- offer free medicine, headline discounts on prescription medicines, or "free trials" that are not plainly a free
  consultation; create urgency ("respond quickly");
- let affiliates or referral-scheme members post codes or content that name prescription medicines (we answer for them).

**We may:** promote the **condition** and the **service**; show **indicative prices for the condition** on the home
page ("Care for women's hair loss from £22 a month"); give a balanced, factual overview of treatment options on deeper
pages the visitor chooses to open; publish a factual price list (not on the home page, no product claims); answer a
patient's own unprompted question about an off-label or unlicensed product factually; advertise **licensed
non-prescription** products within their licence; email existing customers under the soft opt-in, as long as the email
does not name or point to a prescription medicine.

The regulators act: Hims UK, Numan, Manual/Voy\*, Sons† and others have rulings against them, and the GPhC took
statutory enforcement action against Voy's pharmacy in August 2026 partly for advertising prescription medicines
(`uk-regulation.md` 2.5). Our brand promise ("trust") makes a ruling against us doubly costly.

### 6.2 Our positioning (all lawful)

- **Women first.** Show women, with real hair types and life stages, in every image and story. Most UK services grew up
  around men; women told researchers they want "a diagnosis, blood tests, warnings about shedding" and products that
  suit their hair (`customer-voice.md` 7).
- **"We find out why first."** A process claim, not a medicine claim.
- **"A named pharmacist who stays with you."** A service claim. The founder can talk about the condition and the
  service, but must not endorse a medicine in an advert (regulation 289).
- **"Easiest to leave."** Monthly by default, two-tap cancel, a reminder before every charge. This answers the top
  complaint (35% of negative reviews mention cancelling or renewals) and can be said loudly.

### 6.3 Channels

| Channel | What we do | Compliance notes |
|---|---|---|
| **Search content (the main engine)** | Deep, honest guides on the women's topics competitors barely cover: hair shedding after having a baby; hair loss in perimenopause and after the menopause; PCOS and hair; hair shedding on weight-loss injections; iron, thyroid and hair; "shedding or thinning?"; traction hair loss and textured hair; when hair loss needs a doctor. For men: what really works and what to expect, finasteride side effects explained fairly, why "extra strength" is not better | Condition-first. Medicines may be named only on deeper pages, inside a fair overview of all options, never with "best". Every page ends with "Start a consultation", which may or may not lead to a prescription. The MHRA focuses on home pages but acts on complaints about deeper pages |
| **Paid search** | Bid on condition phrases ("hair falling out after baby", "thinning parting", "hair loss perimenopause", "receding hairline"); the advert sells the consultation | Never a medicine name in the advert or landing page address. Google requires GPhC registration and its own certification (and LegitScript or equivalent for telemedicine); Meta allows prescription-medicine adverts only in the US, Canada and New Zealand. Budget for certification before launch (`market-economics.md` 6.3) |
| **Free tools (no email needed)** | A **shedding timeline**: enter the date of the birth, illness, diet or injection and see when shedding usually starts and settles. A **"shedding or thinning?" explainer** with pictures, ending in a free shedding check | Information about the condition, not a medicine. Word it as information, not a diagnosis, and have it reviewed (regulation 286 bans adverts for medicines that offer a diagnosis online) |
| **Licensed non-prescription products** | Women's minoxidil foam and solution, and men's minoxidil 5%, are licensed and not prescription-only, so they **can** be advertised, within their licence (pattern hair loss, 18 to 65; men's foam 18 to 49) | Claims must match the SmPC and be backed by trials (CAP 12.1, 12.23); no guarantee; no "better than". The advert leads to our consultation, not a "Buy now" button |
| **Social media** | Condition education: women's stories about shedding and thinning, myth-busting (biotin, "extra strength"), what a consultation looks like | No medicine names, no pill or bottle images, no before-and-after for prescription medicines. Influencers may talk about the condition and the service only, under a written brief we check (Hims' own filings say promoting prescription medicines via influencers is prohibited in the UK) |
| **Partnerships** | Referral routes with people who meet the triggers: independent weight-management services that do not treat hair, menopause and PCOS support services, postnatal groups, hairdressers and trichologists (they often notice thinning first) | Partners promote the service and condition only. No payments or incentives to prescribers (GPhC). No health-professional endorsement of medicines in adverts. Written agreements and a content check |
| **Existing customers** | Service messages (reminders, check-ins) are factual. Marketing emails (soft opt-in) cover the condition, new services and education | Never name or point to a prescription medicine in a marketing email: the MHRA (Numan, 2023) and the ASA (Voy, May 2026) upheld complaints about exactly this |
| **Reviews** | Invite reviews at 3 and 6 months (not only after the first parcel); reply to every review | Never fake, buy or incentivise reviews (banned outright under the DMCCA since April 2025; penalties up to 10% of worldwide turnover) |
| **Refer a friend** | **Not at launch** (Proposal). Later, perhaps a charity donation or service credit with posting rules | The ASA held Voy responsible for referral posts naming a prescription medicine (Feb 2026); the GPhC treated a first-month discount on a prescription medicine as an incentive (Aug 2026) |
| **PR and proof** | The women-first story; a yearly **outcomes and safety report** from our own audit (stops and referrals, photo-measured change, side effects, response times) | A service-quality report, not a medicine claim. Hims and Voy's\* parent published patient studies as proof; ours should be audited and honest |

### 6.4 Words to use and words to avoid

| Avoid (and why) | Use instead |
|---|---|
| "Finasteride from £18" on the home page (names a prescription medicine) | "Men's hair loss care from £18 a month" |
| "Clinically proven treatment" (not allowed for anything unlicensed; risky generally) | "Treatment options backed by published research, chosen after a consultation" (deeper pages, with the evidence shown fairly) |
| "See results in 6 months or your money back" (a guarantee) | "Not happy with our care in 90 days? We refund your last payment" |
| "Buy now" | "Start your consultation" |
| "The strongest formula" | "The strength the research supports" (deeper pages only) |
| "50% off your first month" | One price, shown in full |
| "Safe" or "no side effects" | "Every medicine can cause side effects. We tell you what to expect and check in with you" |

### 6.5 Why this can work without matching the giants' budgets (our view)

- **Search intent for women's triggers is unserved.** No company asks about weight-loss injections or the 2-to-4-month
  trigger, so honest content about them has little competition from the brands in this research.
- **Retention is cheaper than acquisition.** Every big brand sells 6 or 12 months up front, which hides churn; we will
  earn retention through follow-up instead. Measure 3-, 6- and 12-month retention from day one (`market-economics.md`
  5.4).
- **The rules are tightening on everyone.** A service built to the higher standard now loses nothing when the next
  ruling lands; competitors that rely on discounts and prescription-medicine marketing do.

---

## 7. Rough unit economics and launch plan

**Every money figure in this section is an ESTIMATE or an assumption unless a source is named.** No UK competitor
publishes its customer acquisition cost or churn, and no supplier price list is in the research files. Replace every
assumption with real quotes and real retention data as soon as they exist.

### 7.1 Assumptions

| Line | Assumption used | Basis |
|---|---|---|
| Cost of goods | 22% of price for generic tablets and own-label items; **50% of price** for the women's branded foam (cautious) | Cost of sales 21.8% (Skin + Me group) and 22.5% (Hims UK) (`market-economics.md` 5.5); the foam figure is our caution because branded stock may cost close to retail |
| Deliveries in year 1 | 7 (monthly for 3 months, then every 2 months), £2.90 each = £1.69 a month | £2.90 is what Dr Fox charges customers; real courier contract rates are unknown |
| Card fees | 2.2% of each charge plus 20p, 7 charges a year | Stripe UK: 1.5% + 20p, plus 0.7% for subscription billing tools (`market-economics.md` 5.5) |
| Pharmacist time | £51 an hour (about £0.85 a minute) | NHS Band 8a top point £64,750 plus 25% employer costs over 1,600 hours (`market-economics.md` 5.5; the 25% and 1,600 hours are that file's assumptions) |
| Minutes per patient in year 1 | Tier A: 35 prescriber minutes (first review plus 5 short check-ins). Tier B: 90 (first review, call, blood pressure and blood results, 6 check-ins). Plus 3 minutes of second-pharmacist checking per supply (21 a year) | Our assumption |
| VAT | Prescribed medicines dispensed by a pharmacist on a pharmacist prescriber's prescription treated as zero-rated | HMRC Notice 701/57 zero-rates these if all conditions are met; it does not spell out private online prescriptions, and general-sale products bought without a prescription are standard-rated. **Take tax advice** (`market-economics.md` 5.5) |

### 7.2 Contribution per customer per month, year 1 (ESTIMATE)

"Contribution" here means what is left for marketing, staff, premises and technology after the direct costs.

| Plan | Price | Cost of goods | Delivery | Card fees | Pharmacist time | Contribution | Share of price |
|---|---|---|---|---|---|---|---|
| M1 Finasteride (Tier A) | £18.00 | £3.96 | £1.69 | £0.51 | £3.97 | **£7.87** | 44% |
| M2 Minoxidil 5% solution (Tier A) | £17.00 | £3.74 | £1.69 | £0.49 | £3.97 | **£7.11** | 42% |
| M3 Finasteride + minoxidil 5% (Tier A) | £30.00 | £6.60 | £1.69 | £0.78 | £3.97 | **£16.96** | 57% |
| M1 + M4 Finasteride + minoxidil tablets (Tier B) | £32.00 | £7.04 | £1.69 | £0.82 | £7.86 | **£14.59** | 46% |
| W1 Women's licensed topical (Tier A), cautious cost | £24.00 | £12.00 | £1.69 | £0.64 | £3.97 | **£5.70** | 24% |
| W1 at the 22% benchmark | £24.00 | £5.28 | £1.69 | £0.64 | £3.97 | **£12.42** | 52% |
| W2 or W3 One tablet (Tier B) | £22.00 | £4.84 | £1.69 | £0.60 | £7.86 | **£7.01** | 32% |
| W4 Two-medicine plan (Tier B) | £29.00 | £6.38 | £1.69 | £0.75 | £7.86 | **£12.32** | 42% |
| W5 Shedding check (one-off) | £29.00 | none | none | £0.84 | £21.25 (25 minutes) | **£6.91 per check** | 24% |

**What this shows.**

- The care model costs money. Tier B pharmacist time (about £7.86 a month in year 1) is the biggest direct cost after
  the medicine. It falls in year 2 (fewer reviews, fewer deliveries): **ESTIMATE** about £4.25 a month for Tier B and
  about £2 for Tier A, which adds roughly £2 to £3.60 a month to each contribution.
- **The women's foam plan (W1) is the weak spot.** If the branded foam costs close to retail, contribution is about
  £5.70. If HMRC treats it as standard-rated, £4 of the £24 is VAT and contribution falls to about **£1.70**. Get a
  wholesaler quote and tax advice before fixing this price; £26 may be needed.
- **The men's two-product plan (M3) and the women's two-medicine plan (W4) carry the business.**
- The shedding check is a trust and first-contact product, not a profit line.

**Blended example (assumption).** If active subscribers were 20% M3, 15% M1, 10% M1 + M4, 20% W1, 15% W2 or W3 and
20% W4, average revenue would be about **£25.80** a month and average contribution about **£10.70** (cautious foam
cost) to **£12.00** (benchmark foam cost).

**What one new customer can cost (ESTIMATE, at £10.70 a month contribution).**

| Cost to win a customer | Months of paying needed just to earn it back |
|---|---|
| £60 (Hair + Me gives £60 of first-order discounts per customer, `market-economics.md` 5.3) | about 6 |
| £100 | about 9 |
| £150 | about 14 |
| £200 | about 19 |

No retention figure exists for any UK rival. **The first numbers to measure are how many customers are still paying
at 3, 6 and 12 months.** Do not scale paid advertising until those numbers show acquisition pays back.

**Fixed costs (assumption, to show the arithmetic only).** Premises and pharmacy registration, superintendent and
responsible-pharmacist cover, dispensing and customer-care staff, software, identity checks, certification for
advertising platforms, indemnity, legal and regulatory advice, and a laboratory set-up are all **quote needed**. Only
the ICO fee is known (£52 a year at tier 1). If those costs came to £12,000 to £20,000 a month (pure assumption),
covering them alone would need roughly **1,100 to 1,900 paying subscribers** at £10.70 each, before any marketing.

**Market context.** Hair and skin prescribing businesses keep about 75p to 80p of each £1 after the cost of goods,
then spend most of it on marketing, people and technology (Hims & Hers spent 39% of revenue on marketing in 2025)
(`market-economics.md` 5.1, 5.2). Our model trades some of that margin for clinical time, and bets that follow-up
and honesty raise retention.

### 7.3 Team (small, led by the pharmacist prescriber)

| Role | When | Notes |
|---|---|---|
| Founder: superintendent pharmacist and lead prescriber | From day one | Owner, superintendent and prescriber can be one person, but prescribing should be kept apart from supply where possible |
| Second pharmacist (checking pharmacist; responsible-pharmacist cover) | Part-time from day one; full-time when volume needs it | Clinical and accuracy check on everything the founder prescribes (GPhC; the Voy\* inspections tested this) |
| Dispenser or pharmacy technician | From launch | Packing, stock, couriers |
| Customer-care lead (a named human) | From launch | Never answers clinical questions; routes them to the prescriber the same day |
| Developer or agency, part-time | From month 0 | Server-side rules with one automated test per rule; subscription system built to the DMCCA rules |
| Content and marketing lead, part-time | From month 2 | Trained on Appendix 6 and the CAP Code; every advert checked before it goes out |
| Retained advisers | From month 0 | Regulatory adviser, solicitor (terms, subscriptions, data), accountant (VAT), trade mark attorney |

No doctor or nurse in the treating team unless the service registers with the CQC.

### 7.4 Launch plan

**Phase 0: foundations (months 0 to 4)**

1. Choose and check the name (Companies House, trade marks, domain); form the company.
2. Premises and GPhC pharmacy registration; superintendent; responsible-pharmacist procedures; written risk
   assessment; SOPs (including delivery of flammable products).
3. Written advice: CQC (confirm a pharmacist-only service is out of scope), Northern Ireland and Wales, the final
   DMCCA subscription regulations, the GPhC inspection framework of January 2026 (not yet read).
4. Clinical protocol: **read NICE CKS (female and male pattern hair loss, alopecia areata, hirsutism, PCOS), the BNF,
   the UKTIS pregnancy monographs and the full oral minoxidil consensus paper** before writing doses into software
   (none could be read by the research). Settle the open rules in section 9.
5. Supplier quotes: Regaine for Women foam and solution, Loniten 2.5 mg, spironolactone, finasteride, dutasteride,
   minoxidil 5%; a laboratory (home kits and local visits); a courier that takes flammable goods; an identity-check
   provider; a payment provider with compliant subscription tools.
6. Build the engine (section 4), the result screen, the guided photo capture, blood-pressure upload, call booking,
   the clinical record with playbook notes, the second-check workflow and the subscription system.
7. Data protection: ICO fee, DPIA, UK hosting, privacy notice, retention policy.
8. Indemnity: personal and pharmacy cover that names online prescribing, off-label oral minoxidil and spironolactone,
   and UK-wide postal supply.
9. Advertising: GPhC registration first, then LegitScript (or equivalent) and Google certification.
10. **Talk to 15 to 20 women** with thinning or shedding (after childbirth, in perimenopause, with PCOS, on weight-loss
    injections) and test the prices. The research says the UK women's voice is thin and recommends primary research
    before launch (`customer-voice.md` 7).

**Phase 1: soft launch (months 4 to 7)**

- Women: shedding check (W5), pregnancy and new-mum care (W7), licensed topical (W1), traction care (W8).
- Men: finasteride and licensed minoxidil (M1 to M3).
- Tier B (W2 to W4, M4) for a capped number of patients, with the founder taking the calls.
- Organic search content and social education; small paid-search tests on condition phrases.

**Phase 2: scale what works (months 7 to 12)**

- Full Tier B for women and men; dutasteride step-up (M5) for men reaching 12 months.
- Partnerships (weight-management, menopause and PCOS services, hairdressers).
- First 6-month outcomes audit; re-price using real costs and retention.

**Phase 3: extend (months 12 to 24)**

- Microneedling kit and protocol (B2).
- Low-volume finasteride spray (M6) only if a clear clinical-need group exists and the supply route is settled.
- Publish the first yearly outcomes and safety report.
- Watch the pipeline (a licensed topical anti-androgen, clascoterone; an extended-release minoxidil tablet, VDPHL01).
  Build nothing on them until a UK licence exists.

### 7.5 Measures from day one

| Measure | Why |
|---|---|
| Share of visitors stopped or referred before giving any details | Proves the engine stops what it should |
| Share of new patients with a complete baseline photo set before the first prescription (target 100%) | Diagnosis first |
| Time to decision; time from approval to dispatch | Delivery is a top complaint |
| Side-effect reports answered the same working day | Second-ranked unmet need |
| Retention at 3, 6 and 12 months, and reasons for cancelling | The unknown that decides the business |
| Potassium, contraception and blood-pressure checks done on time | Tier B safety |
| Complaints, refunds and review scores | Trust |
| Cost to win a customer, by channel | Payback |

---

## 8. The three biggest risks and how to handle them

### Risk 1. A clinical harm in the women's tablet pathway, at a distance

**What could go wrong.** A pregnancy on spironolactone or minoxidil tablets; high potassium; heart effects from
minoxidil tablets; a missed scarring hair loss (frontal fibrosing alopecia, CCCA), a missed androgen-secreting tumour
or a missed anaemia; a dose written into software from a source the research could not read (NICE CKS, BNF and
UKTIS were all blocked).

**How we handle it.**

- Tier B for every off-label tablet: a call, two photographed blood pressure readings, U&E before spironolactone, a
  GP letter, and contraception re-checked **at every supply**.
- Conservative ceilings and age limits (Proposals): spironolactone up to 100 mg online; minoxidil tablets for women up
  to 2.5 mg; no new minoxidil tablet starts at 75 or over.
- Mandatory photos; hairline and eyebrow photos for every woman 45 or over; a low bar for referral with crown thinning
  in tightly curled hair.
- Red flags stop before any details; the prescriber can still refer after reviewing photos.
- Read NICE CKS, the BNF, UKTIS and the full consensus paper before launch; have the protocol peer-reviewed.
- A second pharmacist checks every prescription; quarterly clinical audit; incident reporting; Yellow Card reports;
  indemnity that names this work.

### Risk 2. A breach of medicines advertising law or GPhC standards

**What could go wrong.** An advert, landing page, influencer post, referral code or marketing email that names or
points to a prescription medicine, mentions an unlicensed product, promises results or offers a discount. This is a
criminal offence and has led to ASA rulings, MHRA action and, for Voy\*, GPhC statutory enforcement. A second risk:
rules still moving (the final DMCCA regulations, the GPhC's 2026 inspection framework, CQC scope if a doctor joins,
Northern Ireland).

**How we handle it.**

- An Appendix 6 checklist and sign-off by a trained person for every piece of marketing; a regulatory adviser reviews
  the website and the result screen before launch.
- No first-order discounts, no refer-a-friend at launch, no influencer content about medicines, no medicine names in
  marketing emails.
- Licensed first, so the range does not depend on unlicensed products we cannot talk about.
- Re-check the moving rules before launch and every quarter; keep the service pharmacist-only unless CQC-registered.

### Risk 3. The honest model does not pay for itself fast enough

**What could go wrong.** Clinical time, photos and calls cost more than a tick-box form (section 7.2). The women's foam
plan may barely cover its costs. Rivals with far more money (Hims & Hers spent US$919m on marketing in 2025; Voy's\*
parent turned over £227m) can sell first orders at half price, and Hers UK could copy a women's pathway. Stops and
photo steps lose some sales. Delivery or stock failures, the main complaint in about 28% of a hand-read sample of
negative reviews, could sink trust early.

**How we handle it.**

- Keep the typical case fast (about 4 to 6 minutes before the result) and put friction only where the evidence needs
  it.
- Price from real supplier quotes and tax advice; re-price W1 if needed; push the plans that carry the business (M3,
  W4).
- Win through search content and partnerships on the triggers nobody serves; do not scale paid adverts until
  retention data show payback.
- Make retention the growth engine: follow-up, photo progress, fast side-effect replies, easy pause.
- Cap fixed costs in Phase 1; add staff only as volume proves itself.
- Treat delivery as a clinical-grade process: stock buffers, early reviews, tracked post.
- Later options if growth is slow: run the service for other pharmacies or retailers (ZAVA earns "platform fee
  revenue" running Superdrug's and Asda's online doctors, `market-economics.md` 6.5).

---

## 9. Open questions to settle before launch

| # | Question | Why it matters | Where it came from |
|---|---|---|---|
| 1 | NICE CKS, BNF and UKTIS: do they change any dose, interaction or pregnancy rule? | None could be read by the research | `clinical-women.md` Part 5; `clinical-men.md` 12 |
| 2 | Full text of the oral minoxidil consensus (Akiska 2025) | Dose and exclusion lists confirmed only partly first-hand | `clinical-men.md` verification row 23 |
| 3 | The unit of the PCDS testosterone cut-off (4.8) | The page gives no unit; use the laboratory's range | `clinical-women.md` 1.6 |
| 4 | Trimethoprim alone with spironolactone | The SmPC names only co-trimoxazole | `clinical-women.md` 3.3 |
| 5 | Ketoconazole shampoo with topical minoxidil | Does a rinse-off medicated shampoo count as "another scalp medicine"? | `clinical-women.md` verification |
| 6 | Which contraception counts as "effective" | Needed for W2 to W4 | Not in the files |
| 7 | Lactose in finasteride tablets | From company documents, not the SmPC | `rule-library.md` F11 |
| 8 | Spironolactone and Loniten pack strengths and wholesale prices | Dose steps and margins | Not in the files |
| 9 | Has a finasteride spray been licensed in the UK, and can an EU-licensed spray be imported? | Decides whether M6 is ever a UK-made special | `clinical-men.md` 2.2; UK sweep |
| 10 | Finasteride and high-grade prostate cancer (SmPC section 4.4) | Relevant to older men | `clinical-men.md` verification gap 4 |
| 11 | Blood-donor deferral after finasteride and dutasteride | Counselling | `clinical-men.md` 10.2 (unverified) |
| 12 | Northern Ireland and Wales rules | Where we can treat | `uk-regulation.md` "missing" 2; 4.3 |
| 13 | Final DMCCA subscription regulations and the GPhC January 2026 inspection framework | Subscription terms and inspection | `uk-regulation.md` 6.3 and "missing" 1 |
| 14 | VAT on prescribed general-sale products and on the shedding-check fee | W1 and W5 margins | `market-economics.md` 5.5 |
| 15 | Home-use safety and needle depth for microneedling | B2 | Not in the files |

---

## 10. How much of this rests on the weaker evidence

| Conclusion in this file | Leans on | How much it matters |
|---|---|---|
| Voy's\* eligibility pop-up, women's offer (minoxidil only), prices and guarantee (section 2.2) | Pop-ups observed; the rest public pages and 11-month-old code. **Not walked live** | Medium: the comparison could under-rate Voy. Check a live consultation before relying on it |
| Oxford Online Pharmacy\* as the value benchmark; several cost-of-goods ceilings (oral minoxidil, dutasteride) and the £75.99 women's programme | Search summaries of its pages. **Not walked live** | Medium: those ceilings are only as good as the snapshots; replace with supplier quotes |
| Hers (US)\* early-shedding complaints (30% of its negatives) | Reviews only; site blocked | Low: used only to show why the early-shed warning matters |
| Sons'† gaps (no crisis help, patches and sudden loss not referred, account wall) and good patterns (PHQ-2, NHS record consent) | Live replays before the wall and code run offline; final review not finished | Medium: small corrections may follow |
| Ro† women's stop screens as a good pattern | Code read offline; final review not finished | Low |
| XYON‡ pregnancy stop before any data | Not independently verified | Low: the pattern is right whatever XYON does |
| Everything any company does after its sign-in wall | Company documents or code only | Medium: competitors may do more privately than we credit |
| Market-sweep figures (Loniten £50 for 60, Superdrug's £99 blood test, the supermarket foam price) | `market/uk-sweep.md`, not fact-checked | Medium for prices; replace with quotes |
| What women want | Customer reviews, mostly US brands and Hair + Me; UK forums were blocked | High: do the interviews in Phase 0 |

---

## 11. Summary (10 lines)

1. **Concept:** a UK pharmacist-led hair-loss service, women first and men equally well; working names Rootcause, The
   Parting or Kindred Hair (check Companies House and the trade mark register; no medicine names in the web address).
2. **Promise:** "We find out why your hair is changing before we treat it, and a named pharmacist stays with you."
3. **Edge:** diagnosis first (trigger question, guided photos, blood tests when indicated), a real women's pathway,
   licensed first, the result and full price before any contact details, built-in follow-up and two-tap cancelling.
4. **Women's range:** licensed minoxidil foam or solution (£24), minoxidil tablets from halved licensed 2.5 mg tablets
   (£22), stepped spironolactone from 50 mg (£22), a two-medicine plan (£29), a £29 shedding check, free pregnancy
   and new-mum care; no finasteride or dutasteride for women.
5. **Men's range:** finasteride 1 mg (£18), licensed minoxidil 5% (£17 to £20), both (£30), minoxidil tablets and
   dutasteride as written step-ups; no "extra strength", no fixed-dose combinations, specials only for a recorded need.
6. **Engine:** about 30 anonymous screens for women and 22 for men; stoppers first; three outcomes; one-line reasons;
   crisis help never skipped; sign-in only after the result screen; payment only on approval.
7. **Service:** a second-pharmacist check, follow-ups at days 3 to 7, weeks 2 to 6, 3, 6 and 12 months, same-day
   side-effect replies with billing paused, GP letters, tracked delivery, DMCCA-ready subscriptions, a
   satisfaction (not results) guarantee.
8. **Marketing:** condition and service only; women's trigger topics in search; licensed non-prescription products can
   be advertised; no discounts, no medicine names in marketing, no referral scheme at launch.
9. **Economics (ESTIMATE):** about £10.70 to £12 contribution per subscriber a month in year 1; the women's foam plan
   is the weak spot; measure 3-, 6- and 12-month retention before scaling paid adverts.
10. **Biggest risks:** clinical harm in the women's tablet pathway, an advertising or GPhC breach, and margins too thin
    against rich rivals; each has a plan, and NICE CKS, the BNF and UKTIS must be read before launch.

