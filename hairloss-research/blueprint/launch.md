# Launch: phases, team, suppliers, money, marketing and measures

Part of the final blueprint (see `plan.md` for the summary, evidence marks and labels). **Every money figure here is
an [estimate] or an [assumption] unless a source is named.** No file holds a wholesale price, a courier rate, a
laboratory charge, a software cost, or any UK rival's cost to win a customer or churn [market-economics 10]. Replace
each assumption with a quote or pilot data as soon as one exists.

---

## 1. Launch by phase [proposal]

Today is 24 November 2026. The DMCCA subscription rules are expected for new contracts from 1 January 2027, so every
contract we sign will fall under them; build to them from the start [uk-regulation key fact 24].

### Phase 0: set up (months −6 to 0)

| Area | Tasks |
|---|---|
| **Name and company** | Choose a name (`plan.md` 1.1); Companies House, trade mark register, web address |
| **Pharmacy** | Own GPhC-registered pharmacy, a partner pharmacy, or the lean option of sharing an existing registered pharmacy's premises (section 3.1). Superintendent, responsible-pharmacist procedures, SOPs (including remote supply and flammable goods), written risk assessment |
| **Clinical protocol** | Read **NICE CKS** (male and female pattern hair loss, alopecia areata, hirsutism, PCOS), the **BNF**, **UKTIS** and the **full oral minoxidil consensus**. Set the PHQ-2 cut-off and distress threshold from the published tools. Write "effective contraception", the ketoconazole-with-minoxidil rule, the gender-affirming hormones protocol and the 66+ rule (`risks.md` 3.7) |
| **Advice, in writing** | Regulatory adviser (result screen, GSL product adverts, copy templates, replacement-parcel wording); CQC (pharmacist-only is out of scope); Scotland and Wales; Northern Ireland; cooling-off rules for dispensed medicines; the final DMCCA text; VAT; the GPhC January 2026 inspection framework |
| **Quotes** | Two wholesalers for every licensed line (section 3.2); a laboratory; an ID vendor; a tracked courier that takes flammable goods; a payment provider; indemnity |
| **Build** | The engine with one automated test per rule; photo capture; blood pressure upload; call booking; prescriber console with playbook notes; second-check workflow; follow-up scheduler; billing with reminders and two-tap cancel; GP-letter generator; Yellow Card workflow; free tools; UK hosting |
| **Data** | ICO fee, DPIA (required before launch for this service), records of processing, privacy notice, retention policy [uk-regulation 6.1, key fact 23] |
| **Advertising** | GPhC registration first, then LegitScript (or NABP), then Google certification [market-economics 6.3]. Pre-clear the home page, guides and email templates |
| **Women's research** | **Interview 15 to 20 women** with thinning or shedding (after a baby, in perimenopause, with PCOS, on weight-loss injections, with textured hair) and test the women's prices. The UK women's voice in the research is thin [customer-voice 7; judging 4.2] |

### Phase 1: closed pilot (months 0 to 2)

- **About 100 patients**, invited through the owner's professional network and the free tools, **not** through
  medicine adverts [VT 7.6].
- **Tier A only:** licensed finasteride and scalp minoxidil for men and women; the shedding, pregnancy and traction
  routes; blood tests.
- **Measure:** minutes to finish the questions; share stopped and why; prescriber minutes per patient; time to
  decision; side-effect reply time; parcels on time; real cost per parcel; reminders sent; time to cancel.
- **Fix what breaks** before opening the doors. Test finasteride at £18 and £20.

### Phase 2: public launch, Tier A (months 2 to 5)

- England and Scotland (Scotland once cleared). Wales and Northern Ireland on a waiting list.
- Marketing: guides, free tools, condition-only paid search once certified, referral partners, review invitations.
- **A weekly cap on new patients** so same-day side-effect replies stay true; the capacity rule applies (section 6.5).

### Phase 3: Tier B, capped (months 5 to 8)

- Minoxidil tablets for men (M4) and women (W2), stepped spironolactone (W3, W4), dutasteride (M5) for men who reach or
  arrive with 12 documented months of finasteride and minoxidil.
- Calls, two blood pressure readings on different days, U&E, contraception at every supply, GP letters.
- **Cap Tier B starts** to what the prescribers can call and follow up.

### Phase 4: prove and reprice (months 8 to 12)

- First 6-month photo verdicts; first **quarterly service report** after 3 months of public data.
- Reprice from real costs under the price floor rule (section 5.6).
- Decide on Wales with advice in hand.

### Year 2 (months 12 to 24)

- **Specials and add-ons only once a real group with a recorded clinical need exists:** the finasteride low-volume
  spray (an imported licensed product if a lawful route is confirmed, otherwise a UK special) and the minoxidil
  alternative base; the microneedling protocol after device checks.
- Revisit the 66+ minoxidil tablet rule after the first audit, using CP's and WF's rule (65 to 74 at the lowest start
  with readings and GP agreement) [judging 5].
- Publish outcome figures only after legal advice; until then, blinded photo re-rating stays an internal audit.
- Add newly UK-licensed medicines only when licensed (for example clascoterone, extended-release oral minoxidil)
  [clinical-men 7].

---

## 2. The team

| Role | Why | When | Notes |
|---|---|---|---|
| **Owner:** pharmacist independent prescriber, clinical lead (and superintendent if we own the pharmacy) | Prescribes, writes the protocol, signs the rule set, runs audit | Day one | The owner can be owner, superintendent and prescriber, but the GPhC wants prescribing kept apart from supply where possible [uk-regulation 7.3] |
| **Second pharmacist** (part-time at first) | Clinical and accuracy check of **every** prescription; prescribing cover; audit | Day one | Essential: the GPhC's 2026 Voy inspections tested whether the pharmacy really checked what it dispensed [uk-regulation 3.5] |
| **Sessional prescribers** | Extra capacity, bought as sessions as volume grows | From phase 2 | Trained on the protocol; no sales targets or per-prescription pay [uk-regulation 3.2, 3.4] |
| **Pharmacy technician or dispenser** | Dispensing, packing, stock, couriers | Day one | From 10 December 2026 a pharmacist may authorise a registered technician to supervise section 10 preparation: relevant only if we ever prepare specials [uk-regulation 1.2] |
| **Patient-care lead** (a named human) | Billing, delivery, account help; passes **every** clinical message to a prescriber the same day | Day one | Keeps sales and clinical care apart |
| **Developer and designer** (contract or platform partner) | Engine, rule tests, photo tool, console, billing | Month −6 | Rules on the server; tests before every release |
| **Content and marketing** (part-time) | Guides, free tools, women's content, partnerships, service report | Month −2 | Trained on Appendix 6 and the CAP Code; every piece through the copy check |
| **Advisers** | Regulatory and advertising law, data protection (DPIA), tax, CQC, trade mark | Month −6 | Retained, not full-time |

**No doctor or nurse in the treating team** unless the service registers with the CQC. A dermatologist reviewing cases
would bring CQC registration and cannot endorse medicines in adverts [uk-regulation 4, 2.4].

**Prescriber capacity [estimate]:** a first review takes about 15 minutes (Tier A) or 40 (Tier B), and follow-up about
55 to 63 minutes in year 1. One full-time prescriber (1,600 hours a year, the market file's assumption), with 75% of
time on patients [assumption], covers roughly **900 patients in their first year**. Lean break-even (about 1,380
patients) therefore needs the owner plus sessional cover.

---

## 3. Pharmacy model and suppliers

### 3.1 Where we dispense

| Option | Good | Watch |
|---|---|---|
| **Our own GPhC-registered distance-selling pharmacy** | Full control of supply, quality and stock | Highest fixed cost (premises, registration, RP cover) |
| **A partner pharmacy** dispensing our prescriptions (as Sons does with The Independent Pharmacy) [uk-regulation 4.2] | Fast to start | Their stock and delivery failures become ours; the second check must still happen |
| **Lean set-up:** share an existing registered pharmacy's premises [VT 7.3] | Roughly halves fixed costs | Written agreement on responsibilities, RP cover and data |

**[CP view]:** start with a partner or shared premises if speed matters; move to our own pharmacy once volumes justify
it; keep the second clinical check whatever the model.

### 3.2 Medicines: two wholesalers per licensed line [to verify; quotes needed]

| Line | Note |
|---|---|
| Finasteride 1 mg tablets | Check lactose in each brand's SmPC |
| Minoxidil 5% liquid (generic solution or spray; Sons' own licensed spray is one candidate) | Flammable. **[reviewed: corrected]** Sons† is a direct rival that also sells this spray to patients at £15 to £16.50 a month on longer plans; buying from it gives a rival a view of our volumes and control of our supply. Never make it the only source |
| Minoxidil 5% foam (men) | Extremely flammable aerosol; check pack length (one month at 2 g a day) |
| Regaine for Women 5% foam once daily and 2% solution | **Check how long one foam can lasts at 1 g a day** (the UK sweep suggests about 2 months, not fact-checked); ask whether a generic 2% solution exists |
| Loniten 2.5 mg (the brand whose SmPC allows halving), plus a second 2.5 mg source | Men can take whole tablets if Loniten is short; for women, whether a special is justified when the licensed product cannot be obtained is a question for the regulatory adviser [to verify] |
| Dutasteride 0.5 mg | |
| Spironolactone (strengths that make 25, 50 and 100 mg steps) | Confirm on the emc and in the BNF |
| Ketoconazole 2% shampoo; oral iron | Legal class of the chosen packs |

### 3.3 Specials: buy in, do not make

- **Finasteride low-volume spray (M6):** first ask whether an **imported product licensed in its own country** (for
  example Fynzur) can be supplied lawfully, which the MHRA ranks above a UK special; otherwise a UK special from an
  **MHRA-licensed specials manufacturer** with stability data and a tested expiry [uk-regulation 1.5; clinical-men 2.2].
- **Minoxidil alternative base (S2):** an MHRA-licensed specials manufacturer, with stability data.
- **Own preparation:** legally possible in our own registered pharmacy (Medicines Act 1968 s10) but **not planned**.
  It would need a written risk assessment and the full GPhC unlicensed-medicines guidance (recognised formula, batch
  records, recall, trained staff). **Never finasteride powder in-house:** pregnant women must not handle it
  [uk-regulation 3.3; judging 3.3 item 8].
- Specials are never advertised and need records kept at least 5 years [uk-regulation key facts 4, 7].

### 3.4 Other suppliers [quotes needed]

| Supplier | What we need |
|---|---|
| **Laboratory** | Accredited; home finger-prick kit or partner clinic; FBC, ferritin, TSH, testosterone, SHBG, prolactin, FSH, U&E; results to the prescriber console |
| **Courier** | Tracked; takes flammable liquids and aerosols; rules for the Highlands, islands and air routes (Dr Fox ships its spray to mainland UK only) [to verify] |
| **ID check** | Photo ID with selfie match, or credit-reference check; flags for repeat accounts; covered by the DPIA |
| **Payments** | Subscription billing with reminders and one retry; Stripe UK standard is 1.5% + 20p plus 0.7% for its billing tool [market-economics 5.5] |
| **Software** | UK or equivalent hosting; engine, photos, console, scheduler, GP letters |
| **Insurance** | Indemnity naming online prescribing, off-label use and any specials; product liability; cyber [uk-regulation 7.1] |
| **Microneedling device** (year 2) | Device classification and safe home depth first [to verify] |

---

## 4. Pricing [proposal; provisional until quotes]

| Plan | Price a month | Planning cost of goods [assumption] |
|---|---|---|
| Men: finasteride 1 mg (M1) | **£18 to £20** (test in the pilot) | £4.40 |
| Men: scalp minoxidil 5%, liquid or foam (M2) | **£22** | liquid £6.00; foam £12.00 |
| Men: finasteride + scalp minoxidil (M3) | **£32** | £10.40 or £16.40 |
| Men: minoxidil tablets (M4); with finasteride | **£22**; **£36** | £4.84; £9.24 |
| Men: dutasteride (M5); with scalp minoxidil; with tablets | **£22**; **£34**; **£38** | £4.84; £10.84 or £16.84; £9.68 |
| Women: scalp minoxidil, 5% foam or 2% solution (W1) | **£26** | foam £13.00; 2% £10.00 |
| Women: minoxidil tablets (W2) | **£20** | £4.40 |
| Women: spironolactone (W3); with tablets; with scalp minoxidil | **£18**; **£32**; **£38** | £3.96; £8.36; £16.96 |
| Shedding programme, pregnancy route, traction advice, free tools | **Free** | – |
| Blood tests | Laboratory charge + a flat published handling fee | – |

**Rules:** one price per calendar month whatever the delivery rhythm; all-in; no first-order, retention or plan-length
discounts; price changes with 30 days' notice and the right to leave; reviewed every 6 months under the price floor
rule. **Dropped:** CP's 10% 3-monthly price; VT's £14/£15/£16/£24 list, "no plan over £24" and 12-month price lock
[judging 4.4].

**Home-page price line:** "Hair-loss care from £18 a month": an indicative price for the condition, which Appendix 6
allows; no medicine named next to it [uk-regulation 2.2]. **[reviewed: corrected]** Two problems to clear with the
regulatory adviser before using it. (1) Only prescription plans reach £18 (finasteride, and spironolactone from
phase 3); the cheapest general-sale plan is £22. The ASA's 2026 advice counts a price as promoting a prescription
medicine when the page makes that medicine the likely outcome [market-economics 6.4]. (2) If the pilot sets
finasteride at £20, then in phase 2 (Tier A only) no plan costs £18, and "from £18" would mislead. Safer: show the
lowest price a real share of new patients can get at the time, and have the adviser approve the wording.

---

## 5. Unit economics

### 5.1 Inputs

| Line | Value used | Basis |
|---|---|---|
| Medicine | Section 4 table | [assumption]: 22% of list price for generic tablets (held fixed); 50% of price for branded foam; £6 for generic 5% liquid; £10 for women's 2% (branded) [judging 5, 6] |
| Tracked post | £2.90 a parcel | Dr Fox's customer charge, used as a proxy [market-economics 5.5]. **[reviewed: corrected]** A price one pharmacy charges its customers is not a courier cost, and it was not confirmed as tracked. About 62% of patients in the mix get scalp minoxidil, which contains ethanol (the foam is an "extremely flammable aerosol"), so those parcels may cost more [to verify; quote needed]. At £4.00 a parcel the blended contribution falls by about 62p (section 5.8) |
| Packaging and leaflet | £0.50 a parcel | [VT assumption] |
| Dispensing and second-pharmacist check | ~~£1.50 a parcel~~ **£2.55 a parcel** | **[reviewed: corrected]** VT's £1.50 had to pay for the dispenser **and** the second pharmacist's clinical and accuracy check. At this plan's own £51 an hour it buys under 2 minutes of pharmacist time and nothing for the dispenser. £2.55 is CP's 3-minute check at £51 an hour [CP 7.2]. The dispenser (section 2, "day one") is still in neither this line nor the fixed costs: get a wage figure, or put dispensing in the shared-premises agreement [quote needed] |
| Parcels a year | Year 1: 6.8; year 2: 5.6 | Two monthly parcels, then 80% choose every 3 months and 20% monthly [VT assumption] → **£3.37 a month in year 1, £2.78 in year 2** at £5.95 a parcel. **[reviewed: corrected]** The blueprint had £2.78 and £2.29 at £4.90 a parcel |
| Card fees | 2.2% + 20p, 12 charges a year | Stripe UK plus its billing tool [market-economics 5.5] |
| Prescriber time | £51 an hour (£0.85 a minute) | NHS Band 8a top (£64,750) plus 25% on-costs over 1,600 hours [market-economics 5.5; the 25% and hours are that file's assumptions] |
| Prescriber minutes, follow-up | Tier A: 55 in year 1, 30 in year 2. Tier B: 63 in year 1, 36 in year 2 | CP's minutes (four reviews plus messages) [CP 7.2]; Tier B adds VT's extra checks (days 3 to 7, blood pressure and blood results) less the call, which sits in the first review [VT 7.1] → **£3.90 / £4.46 a month in year 1; £2.13 / £2.55 in year 2**. **[reviewed: corrected]** The follow-up schedule (`engine.md` 10) also has a check-in before **every** supply (about 6 a year) and a pregnancy and contraception check at every supply for women on tablets. "Four reviews" does not count them. If each needs about 3 prescriber minutes [assumption], Tier A year 1 rises to about 72 minutes: the "+30%" row in 5.8 (about £1.20 lower blended). Measure it in the pilot |
| Technology per patient (photo storage, texts, telehealth minutes) | £1.00 a month | [CP assumption] |
| Promise costs (refunds, replacements, free swaps) | 3% of revenue in year 1; 1% in year 2 | [VT assumption]. **[reviewed: corrected]** No benchmark. The 90-day "not happy with our care" refund has no conditions, so it will be claimed mostly by people who leave early, the same people who never pay back the cost of winning them. Track refunds by month of leaving |
| ID check | £1.50 per new patient (one-off) | [VT assumption] |
| VAT | Treated as zero-rated | Medicines dispensed on a pharmacist independent prescriber's prescription can be zero-rated if all conditions are met; whether GSL minoxidil supplied this way qualifies needs **tax advice** [market-economics 5.5] (section 5.8) |

### 5.2 What each plan earns a month [estimate]

"Contribution" = price minus medicine, parcels, card fees, prescriber time, technology and promise costs.

| Plan | Price | Medicine | Parcels | Card | Prescriber | Promise | **Year 1** | **Year 2** |
|---|---|---|---|---|---|---|---|---|
| Finasteride at £20 | £20 | £4.40 | £2.78 | £0.64 | £3.90 | £0.60 | **£6.69** (33%) | **£9.35** (47%) |
| Finasteride at £18 | £18 | £4.40 | £2.78 | £0.60 | £3.90 | £0.54 | **£4.79** (27%) | **£7.41** (41%) |
| Men's scalp minoxidil, liquid | £22 | £6.00 | £2.78 | £0.68 | £3.90 | £0.66 | **£6.98** (32%) | **£9.68** (44%) |
| Men's scalp minoxidil, foam | £22 | £12.00 | £2.78 | £0.68 | £3.90 | £0.66 | **£0.98** (4%) | **£3.68** (17%) |
| Finasteride + liquid | £32 | £10.40 | £2.78 | £0.90 | £3.90 | £0.96 | **£12.06** (38%) | **£14.96** (47%) |
| Finasteride + foam | £32 | £16.40 | £2.78 | £0.90 | £3.90 | £0.96 | **£6.06** (19%) | **£8.96** (28%) |
| Men's minoxidil tablets (or dutasteride) alone | £22 | £4.84 | £2.78 | £0.68 | £4.46 | £0.66 | **£7.58** (34%) | **£10.42** (47%) |
| Finasteride + minoxidil tablets | £36 | £9.24 | £2.78 | £0.99 | £4.46 | £1.08 | **£16.45** (46%) | **£19.57** (54%) |
| Dutasteride + liquid | £34 | £10.84 | £2.78 | £0.95 | £4.46 | £1.02 | **£12.95** (38%) | **£16.04** (47%) |
| Dutasteride + foam | £34 | £16.84 | £2.78 | £0.95 | £4.46 | £1.02 | **£6.95** (20%) | **£10.04** (30%) |
| Dutasteride + minoxidil tablets | £38 | £9.68 | £2.78 | £1.04 | £4.46 | £1.14 | **£17.90** (47%) | **£21.07** (55%) |
| Women's scalp minoxidil, 5% foam | £26 | £13.00 | £2.78 | £0.77 | £3.90 | £0.78 | **£3.78** (15%) | **£6.56** (25%) |
| Women's scalp minoxidil, 2% solution | £26 | £10.00 | £2.78 | £0.77 | £3.90 | £0.78 | **£6.78** (26%) | **£9.56** (37%) |
| Women's minoxidil tablets | £20 | £4.40 | £2.78 | £0.64 | £4.46 | £0.60 | **£6.12** (31%) | **£8.92** (45%) |
| Spironolactone alone | £18 | £3.96 | £2.78 | £0.60 | £4.46 | £0.54 | **£4.66** (26%) | **£7.43** (41%) |
| Spironolactone + minoxidil tablets | £32 | £8.36 | £2.78 | £0.90 | £4.46 | £0.96 | **£13.54** (42%) | **£16.58** (52%) |
| Spironolactone + foam | £38 | £16.96 | £2.78 | £1.04 | £4.46 | £1.14 | **£10.62** (28%) | **£13.79** (36%) |

Every row also pays £1.00 a month for technology (not shown). Year 2 uses £2.29 parcels, the year-2 prescriber
minutes and 1% promise costs.

**[reviewed: corrected]** The table uses the blueprint's £1.50 dispensing cost. With the reviewed £2.55, **every row is
about £0.60 lower in year 1 and £0.49 lower in year 2**: for example men's foam alone £0.39 and £3.19, women's foam
£3.18 and £6.07, finasteride at £18 £4.20 and £6.92. Every row's arithmetic was recomputed and matches within a
penny of rounding (review log, D1).

**What this shows.** Branded foam is the weak spot: men's foam alone earns about £1 a month in year 1. Two-medicine
plans and tablet plans carry the business. This is why scalp minoxidil is priced at £22 and £26, not CP's £17 and £20.

### 5.3 Blended across a plausible mix [assumption]

**Mix:** 60% men, 40% women. **Men:** 30% finasteride alone (at £19, the middle of the range); 15% scalp minoxidil
alone; 40% finasteride + scalp minoxidil; 15% finasteride + minoxidil tablets; scalp users 70% liquid, 30% foam.
**Women:** 60% scalp minoxidil alone (70% foam, 30% 2% solution); 15% minoxidil tablets; 25% spironolactone
combinations (half with foam, half with tablets). Result: **about a third of patients use foam** (the judge's
assumption) and **a quarter are on Tier B** (CP's 75/25 split).

| | Year 1 | Year 2 |
|---|---|---|
| Average revenue per patient a month | **£27.26** | £27.26 |
| **Contribution per patient a month** (blueprint, £1.50 dispensing) | £8.14 (30%) | £10.98 (40%) |
| **[reviewed: corrected] Contribution per patient a month, reviewed base case (£2.55 dispensing and check)** | **£7.55 (28%)** | **£10.49 (38%)** |
| Finasteride at £18 instead of £19 / at £20 (blueprint basis) | £7.97 / £8.31 | £10.81 / £11.16 |
| Early months, Tier A only (no tablets yet) (blueprint basis; reviewed: £5.93 and £8.82) | £6.53 (revenue £25.79) | £9.31 |

For comparison: CP's draft showed about £11.00 (42%) in year 1; the judge re-estimated about £9. The rest of the gap is
VT's per-parcel costs, promise costs and ID checks, which CP left out. The market file's typical subscription brand
keeps about 67%, but spends only about £1.50 a month on clinician time [market-economics 5.6]. **We spend more on care
on purpose; that is the product and the main economic risk.**

### 5.4 One-off cost to start a patient [estimate]

| Line | Cost | Basis |
|---|---|---|
| First review, Tier A (answers and photos, about 15 minutes) | £12.75 | £51 an hour |
| First review, Tier B (with a call, about 40 minutes) | £34.00 | CP's 40 minutes [judging 5] |
| Blended first review (75% Tier A, 25% Tier B) | £18.06 | [assumption on mix] |
| Reviews of people who sign up but are not treated | £3.40 per paying patient | 0.4 such reviews per paying patient, 10 minutes each [CP assumption]. Most stops happen before sign-in at no clinician cost |
| Welcome pack (application card, how-to video link) | £1.00 | [assumption] |
| ID check | £1.50 | [assumption] |
| **Total** | **about £24** | |

**[reviewed: corrected] Not costed anywhere: the free routes.** The shedding programme (photo check-ins at 3 and 6
months, then bloods or referral), the pregnancy and new-mum route, traction advice and the free "talk to a prescriber
first" call all use prescriber time and earn nothing. At the plan's own rate each 10 prescriber minutes costs about
£8.50. The 0.4 short reviews per paying patient above cover only the first look. Count every free route's prescriber
time as part of the cost to win a customer, and cap it under the capacity rule (6.5).

### 5.5 Cost to win a customer, and payback [estimate]

No UK rival publishes its cost to win a customer (CAC). The market file's planning range starts at £60
[market-economics 5.6]. VT's £50 target is dropped: no file supports it [judging 3.3].

**[reviewed: corrected] £60 is not a benchmark.** In the market file the £60 row is labelled "only a first-order
discount": it is the size of Hair + Me's discount (£20 off each of three orders), before any advertising
[market-economics 5.3, 5.6]. The only all-in figure is Hims & Hers: US$919m of marketing in 2025, 39% of revenue,
about US$32 a month per subscriber [market-economics 5.3, key fact 12]. At 39% of our £27.26 that would be about
**£10.63 a patient a month, more than our whole year-1 contribution**. We cannot afford rival-level advertising, and
we refuse the discounts and price-led adverts that rivals use. **Plan on £100 as the central case, £150 as the
cautious case, and treat £60 as a stretch target for guides, free tools and partners only.**

| CAC | CAC + start cost | Months of contribution to earn it back (reviewed: £7.55, then £10.49 from month 13) | Blueprint (£8.14, then £10.98) |
|---|---|---|---|
| £60 | £84 | **about 11** | about 10 |
| £100 | £124 | **about 15** (12 × £7.55 = £90.60, then £33.40 ÷ £10.49 = 3.2 more months) | about 14 |
| £150 | £174 | **about 20** | about 19 |

**What a patient is worth before CAC [reviewed: corrected]:** about **£67** if they stay 12 months (12 × £7.55 − £24);
about **£192** if they stay 24 months (adding 12 × £10.49). The blueprint had £74 and £206. At a £100 CAC, a 12-month
patient does not pay back; a 24-month patient clearly does. **Retention past month 12 decides the business.**

**[reviewed: corrected] What retention the plan needs.** Payback only counts while the patient is still paying, and the
blueprint's break-even (5.7) ignores the cost of replacing those who leave. No UK rival publishes how many patients
leave, so the table uses **scenarios, not benchmarks**: a fixed share leaving each month.

| Leaving each month [scenario] | Average stay | Still paying at month 3 / 6 / 12 | Most we can pay to win a patient | Break-even, lean £11,200, CAC £100 | Break-even, standard £21,850, CAC £100 | Break-even, lean, CAC £60 |
|---|---|---|---|---|---|---|
| 3% | 33 months | 91% / 83% / 69% | about £296 | **about 1,910** | about 3,720 | about 1,580 |
| 5% | 20 months | 86% / 74% / 54% | about £159 | **about 3,810** | about 7,440 | about 2,270 |
| 7% | 14 months | 80% / 65% / 42% | about £101 | not realistic (over 100,000) | not realistic | about 3,860 |
| 10% | 10 months | 73% / 53% / 28% | about £60 | never | never | never |

**Working [estimate].** Still paying after *t* months = (1 − share leaving)^*t*. In a steady state the share of active
patients past month 12 is (1 − share leaving)^12; they earn £10.49 a month and the rest earn £7.55, which gives the
average contribution *m* (for example £9.59 at 3%). Lifetime contribution = *m* ÷ share leaving; "most we can pay" =
that minus the £24 start cost. Break-even active patients = fixed costs ÷ (*m* − share leaving × (CAC + £24)): at 3%
and £100, £11,200 ÷ (£9.59 − 0.03 × £124) = £11,200 ÷ £5.87 = about 1,910. Real leaving is likely to be heavier in
months 1 to 6 (results take 3 to 6 months to show [market-economics 5.4]; we have no prepaid plans and a 90-day refund),
which makes these figures kinder than reality. Full working: review log, D17.

**What this means.** At £100 to win a customer the plan needs about 3% or fewer leaving a month (roughly 7 in 10 still
paying at month 12). At 5% it needs about 3,800 patients on the lean set-up; at 7% or more it does not work at any
realistic size unless the cost to win a customer falls towards £60. **Measure months 3, 6 and 12 in the pilot before
spending on paid acquisition.**

### 5.6 The price floor rule [proposal, adapted from VT 7.4]

At real quotes, every six months:

1. **No plan may lose money in year 1 or earn under £3 a month in year 2.**
2. **Every two-medicine plan must earn at least £5 a month in year 1.**
3. **The blended contribution must be at least £7 in year 1 and £10 in year 2.**

4. **[reviewed: corrected; added] Acquisition floor:** at the measured share leaving each month and the measured cost
   to win a customer by channel, a new patient's expected lifetime contribution must exceed that cost plus the £24
   start cost (5.5). If it does not, cut paid acquisition first, then reprice; never cut the clinical checks.

A plan that breaks a floor rises at the next 6-monthly review, with 30 days' written notice and the right to leave
first. The model above passes floors 1 to 3. **[reviewed: corrected]** The reviewed base case also passes, but only just
for men's foam alone (£0.39 in year 1, £3.19 in year 2). **Example:** if branded foam costs 70% of price, men's foam
alone would lose about **£2.40** a month in year 1 (£0.98 − (£15.40 − £12.00)), or about £3.00 with the reviewed
dispensing cost, so its price must rise (or the foam must be quoted lower). The blueprint's "£3.80" did not follow
from its own inputs.

VT's own floors (£4 and £6) were set for its lower prices; these are higher because our clinician time is higher.

### 5.7 Fixed costs and break-even (before marketing) [estimate]

Prescriber patient time is already in the per-patient costs (bought as sessions as volume grows). Fixed costs are
everything else [VT 7.3].

| Fixed cost a month | Standard | Lean (shared registered pharmacy) | Basis |
|---|---|---|---|
| Owner (prescriber, superintendent, clinical lead) | £6,750 | £3,000 (part draw) | Band 8a top plus 25% as a benchmark [market-economics 5.5]; lean [assumption] |
| Minimum second-pharmacist cover | £3,000 | £1,500 | [assumption] |
| Patient-care lead | £2,800 | £1,400 | [assumption] |
| Content and marketing staff | £2,000 | £1,000 | [assumption] |
| Premises (registered pharmacy) | £2,000 | £1,000 | [assumption] |
| Software | £3,000 | £1,500 | [assumption] |
| Insurance | £800 | £800 | [assumption]; cover must name online, off-label and any specials |
| Compliance, legal, accounts, certification, ICO fee | £1,500 | £1,000 | ICO fee £52 to £78 a year [uk-regulation 6.1]; rest [assumption] |
| **Total** | **about £21,850** (CP used £20,000) | **about £11,200** | |

**[reviewed: corrected] Three gaps in this table.**

1. **No dispenser.** Section 2 hires a pharmacy technician or dispenser from day one, but no line pays for one (see
   5.1). Add a wage or a shared-premises charge once quoted.
2. **The owner's prescribing is counted twice.** The owner's pay sits here, and the same hours are also charged per
   patient at £51 an hour (5.1). Until sessional prescribers are needed, that overstates costs by up to about
   **£2,250 a month (lean, 75% of a £3,000 draw)** or **£5,060 (standard, 75% of £6,750)**. Decide which line pays
   for the owner's patient time; do not count it in both. This error makes the plan look **worse**, not better.
3. **No set-up budget anywhere.** Phase 0 runs for 6 months (build, advisers, DPIA, certification, pharmacy
   registration or a shared-premises deal, indemnity, women's research, staff who start before launch), but no file
   or section gives its cost. Get quotes and add a set-up budget before raising money.

| Break-even **before replacing leavers** | Lean (£11,200) | Standard (£20,000) | Standard (£21,850) |
|---|---|---|---|
| Active patients at year-1 contribution (blueprint £8.14) | about 1,380 | about 2,460 | about 2,680 |
| **[reviewed: corrected] at reviewed year-1 contribution (£7.55)** | **about 1,480** | **about 2,650** | **about 2,890** |
| Active patients at year-2 contribution (blueprint £10.98) | about 1,020 | about 1,820 | about 1,990 |
| **[reviewed: corrected] at reviewed year-2 contribution (£10.49)** | **about 1,070** | **about 1,910** | **about 2,080** |
| Monthly revenue at the reviewed year-1 point | about £40,400 | about £72,200 | about £78,900 |

**[reviewed: corrected] These are not real break-even points.** They leave out the cost of winning patients to replace
those who leave. Including it (5.5), the lean set-up at £100 to win a customer needs about 1,910 active patients if
3% leave a month and about 3,810 if 5% leave.

**Marketing on top.** At a £100 CAC plus the £24 start cost, simply winning 1,380 patients costs about £171,000, and
2,460 patients about £305,000, **before** allowing for people who leave and for months of fixed costs while volume
builds [estimate]. Real funding needs come from the pilot's retention and CAC.

**[reviewed: corrected] A month-by-month view of the money needed [estimate].** The £171,000 above is far too low.
The scenarios below add patients at a steady rate and keep paying fixed costs while numbers build.

| New paying patients a month | Leaving a month | CAC | Set-up | Lowest cash point (excludes set-up spending) | First month cash-positive after marketing |
|---|---|---|---|---|---|
| 100 | 3% | £60 | Lean | about £296,000 (month 34) | month 35 |
| 150 | 3% | £100 | Lean | about £466,000 (month 35) | month 36 |
| 150 | 5% | £60 | Lean | about £367,000 (month 42) | month 43 |
| 100 to 200 | 5% | £100 | Lean | over £730,000 and still falling at month 72 | not within 6 years |
| 300 | 5% | £100 | Lean | about £783,000 (month 45) | month 46 |
| 200 | 3% | £100 | Standard | about £904,000 (month 46) | month 47 |

Assumptions: a 100-patient pilot with no CAC at month 0; fixed costs from month 1; each new patient costs CAC plus
£24 in the month they join and earns £7.55 a month for months 1 to 12 and £10.49 after; a fixed share leaves each
month. Left out, all of which make reality **worse**: set-up spending, the uncosted dispenser and free routes, the
lower Tier A-only months (£5.93), the VAT risk (5.8), tax, and heavier early leaving. Left out, which makes reality **better**: the owner double count above.
**Raise money for the cautious case, and only after the pilot has measured leaving rates and CAC.**

### 5.8 Sensitivity: which assumptions matter most [estimate]

| If… | Blended year 1 | Blended year 2 | What to do |
|---|---|---|---|
| **Base case** (blueprint) | **£8.14** | **£10.98** | |
| **[reviewed: corrected] Reviewed base case: dispensing and check £2.55 a parcel.** Every row below is about £0.60 (year 1) and £0.49 (year 2) lower on this basis | **£7.55** | **£10.49** | Use this as the planning case. On this basis post at £4.00 (about £6.93) and prescriber minutes 30% higher (about £6.33) also break floor 3, so either one alone means repricing |
| Branded foam costs 30% of price | £9.71 | £12.55 | Hold prices; build reserves. **[reviewed: corrected]** recomputed (blueprint £9.75 / £12.59) |
| Branded foam costs 70% of price | £6.57 | £9.41 | Breaks floors 1 and 3: reprice the foam lines. **[reviewed: corrected]** recomputed (blueprint £6.53 / £9.37) |
| A generic 2% solution at £6 | £8.43 | £11.27 | Use it |
| All tablet costs 50% higher | £6.36 | £9.20 | Breaks floor 3: reprice tablet plans |
| Tracked post £4.00, not £2.90 | £7.52 | £10.47 | Negotiate a contract rate |
| Everyone chooses monthly parcels | £6.02 | £8.37 | Breaks floor 3: explain the 3-monthly option honestly (fewer parcels), then reprice if needed |
| Prescriber minutes 30% higher | £6.93 | £10.31 | Just breaks floor 3: triage check-ins by exception (a prescriber still signs every review), then reprice if needed |
| Prescriber minutes 30% lower | £9.35 | £11.65 | – |
| Every price £2 higher | £10.04 | £12.92 | Still at or below rivals' single-month prices |
| **GSL minoxidil is standard-rated for VAT** | at least about £1.40 lower | | £3.67 of the men's £22 and £4.33 of the women's £26 would be VAT; men's and women's foam alone would lose money in year 1. **Take tax advice before fixing scalp minoxidil prices**. **[reviewed: corrected]** £1.40 counts only the scalp-only plans. If the scalp part of the two-medicine plans (finasteride + scalp; spironolactone + foam) is also standard-rated, the blended loss is about **£2.50** a patient a month (working: share of patients on each plan × the VAT inside its scalp price). The adviser must also say how VAT works on one all-in price that bundles a prescriber's service with medicines |

**The three numbers to measure from day one:** patients still paying at months 3, 6 and 12; CAC by channel; real
prescriber minutes per patient [market-economics 5.6].

**[reviewed: corrected] Costs to sign-ups that no row models.** Each choice below is deliberate, but each may lower
how many visitors become paying patients, which raises the real cost to win one: no first-order discount while
rivals offer 40% to 57% off [products-prices 3.1]; GP consent needed before any tablet at launch [judging 3.4],
when discretion is one reason people choose online (32.8% on a German platform [market-economics 1.3]); photos
before the first prescription; a call for every Tier B tablet; and no email captured before the result, so no
reminder emails to people who leave half-way. Measure sign-up at each step in the pilot.

---

## 6. The service we launch with

### 6.1 The Fair Deal promise (one plain page) [VT 5.8, at our prices]

Every promise is about **our care**, never about hair growth. A refund tied to results reads as a guarantee that a
medicine works (ASA, Numan, March 2024; CAP 12.19) [uk-regulation key fact 14]. Refunds tied to satisfaction are
allowed [uk-regulation, "You can"].

1. **Pay only if approved.** Your card is charged only when a prescriber approves. **Full refund any time before we
   dispense.**
2. **Not happy with our care in your first 90 days?** Tell us and we refund your most recent payment. No photos, forms
   or conditions about results.
3. **Side-effect promise.** If a side effect means you stop, billing pauses that day, we refund your most recent
   payment, and a prescriber talks you through stopping safely.
4. **Delivery promise.** Tracked every time. Lost or late? We send a replacement by tracked post the next working day,
   at no extra cost (you have already paid for it; we never give medicine away as an offer [uk-regulation 2.2]).
5. **Faulty pump or can?** Replaced at no extra cost within 2 working days.
6. **Feel promise.** One swap of base or form in your first 3 months, at no extra cost, if clinically suitable.
7. **Honest-verdict promise.** At 6 and 12 months a prescriber looks at your photos and tells you plainly whether it is
   working. If it is not, we change or stop it.
8. **Leave any time.** Two taps, no questions, no retention offers. **You may take your prescription to any pharmacy.**

Wording of promises 4 to 6 checked by the regulatory adviser [to verify].

### 6.2 Subscription terms (built to the DMCCA rules now)

| Term | What we do |
|---|---|
| Contract | Monthly rolling; **no minimum term**; no prepaid bundles |
| Before sign-up | One plain screen: price, what is included, how often we charge, how to pause and cancel, reminders, refunds, cooling-off rights (how they apply to dispensed medicines: [to verify]) |
| Reminders | **7 days before every charge** and before any price change, by email (and text if chosen): date, amount, one-tap skip, pause, change or cancel. Wording "Your hair-loss plan renews on…": **never** names a prescription medicine (emails naming POMs were upheld against Numan and Voy) [uk-regulation 2.6] |
| Cancel | **Two taps, by the same route as joining**; phone, email and chat also work; confirmation at once; no retention discount |
| Pause | Up to 3 months in the account; restart needs a short check-in |
| Failed payment | **One retry**, then a message |
| Refunds | Within 5 working days (inside the 14 days the draft rules allow) |
| Safety stop | A failed review or safety stop ends supply cleanly, with no charge |
| Data | Self-service download and deletion |

### 6.3 Delivery and stock

- Tracked, plain, letterbox-friendly packaging; **ship when about 3 weeks of supply are left**; reviews and ID re-checks
  start 4 to 6 weeks before supply runs out.
- **Two wholesalers per line** and a buffer stock sized from real orders. **Never recommend what cannot be shipped**;
  if a stock problem is coming, the patient hears **before** any charge and is offered a licensed alternative or a
  pause.
- Delivery or stock is the main complaint in about 28% of negative reviews [customer-voice summary]. A gap in treatment
  loses regrown hair, so a delivery failure is treated as a **clinical** risk [our view].

### 6.4 Side effects and GP letters

- **A clinical channel separate from customer service.** Any message mentioning a side effect goes to a prescriber and
  is answered **the same working day**. Billing pauses automatically. **Never a retention offer in a side-effect
  conversation** (a Sons† reviewer reporting a side effect was asked whether they wanted to cancel)
  [engines-experience 6].
- **Yellow Card:** we report suspected reactions, including to specials, and help patients report their own.
- **GP letters** with consent when any prescription medicine starts, changes or stops, and with every referral: how
  the diagnosis was reached (history and photos, no examination); medicine, dose and licence status; baseline blood
  pressure, pulse and blood results; contraception discussed; the monitoring plan; what would make us stop; PSA effect
  for men on a 5-ARI [clinical-women 4.5; clinical-men 10.2].

### 6.5 The capacity rule [VT 5.1]

When decision times, side-effect replies or review backlogs slip past target, **new sign-ups pause behind a waiting
list** until they recover. The free "Talk to a prescriber first" call is offered only while capacity allows. Any missed
promise is logged, the patient is told and put right, and the cause is fixed.

### 6.6 The quarterly service report [VT 5.9]

Published on the website: median time to a prescriber decision; side-effect reply times; parcels on time and lost;
how many cancelled and how long it took; refunds paid; complaints and how they ended; share of patients reaching their
6-month photo review. **Service facts, not medicine claims.** Bad quarters too.

---

## 7. Marketing within UK advertising law

### 7.1 The law in brief

| Rule | What it means for us | Source |
|---|---|---|
| Regulation 284; CAP 12.12 | **No advert may lead to the use of a prescription-only medicine**: finasteride, dutasteride, minoxidil tablets, spironolactone. Websites, search, social, email | [uk-regulation key fact 9] |
| Regulation 279 | No advert for an unlicensed medicine; unlicensed medicines "should not be mentioned" | [key facts 8, 11] |
| **Regulation 286; CAP 12.2.1** | A medicine advert may not offer **"to provide a diagnosis or suggest a treatment by post or by means of an electronic communications network"** | [uk-regulation verification row 10; judging 0] |
| Regulation 289; CAP 12.18 | No endorsement of a medicine by health professionals, scientists or celebrities; reg 286(3) also covers case histories and before-and-after stories | [uk-regulation verification rows 10, 11] |
| CAP 12.19, 12.23 | No guaranteed effects; hair-loss claims need human trial evidence | [uk-regulation 2.4] |
| Appendix 6 (MHRA Blue Guide) | Home page: the condition and the service, an **indicative price for the condition**, no named POM or POM price, no "Buy now", no free offers. Inner pages the visitor chooses: a balanced overview; a factual price list without claims | [uk-regulation key fact 11] |
| Regulation 303 | Breaches are criminal (up to two years' prison and/or a fine) | [key fact 10] |
| DMCCA 2024 | Fake or selectively gathered reviews banned since 6 April 2025 | [uk-regulation 2.4] |

### 7.2 Why our angle is easier to market

Rivals' selling points are products ("extra strength", a one-a-day combined pill), which they cannot lawfully advertise
and have repeatedly been told off for. Ours are **service features**, which we can: a diagnosis before treatment, a
named pharmacist who looks at your photos, blood tests when needed, a women's service, built-in follow-up, the easiest
cancel. **No price-led or named-rival advertising**: our price is mid-market, and naming rivals' prescription plans
and prices risks promoting a POM [judging 3.3, 4.4].

### 7.3 What goes where

| Place | Allowed | What we put there |
|---|---|---|
| **Home page, adverts, social, web address, marketing emails** | Condition and service only | The promise; "Start your free hair check"; "Hair-loss care from £18 a month"; regulated details in the footer |
| **Inner guides the visitor chooses** | A balanced, factual overview of every option, licensed and off-label; a factual price list without claims | Plain guides, including "you can buy minoxidil 5% in a shop" and "you may not need treatment" |
| **The consultation and result screen** | Medicines named as the outcome of a consultation the person started, subject to prescriber review | Names, strengths, reasons and prices (`engine.md` 5) |
| **Service emails and texts** | Transactional messages about the patient's own care | "Your hair-loss plan" with a link to the account, where the medicine is named |

**Landing-page rule:** when the hair check is an advert's landing page, its first screen talks about the condition and
the service only (ASA v Voy, September 2025) [judging 3.4].

### 7.4 Channels

| Channel | What we do | Rules that apply |
|---|---|---|
| **Search guides** (the main engine) | Two front doors. **Women:** shedding after a baby; perimenopause and after the menopause; PCOS and hair; shedding on weight-loss injections; iron and thyroid; traction and textured hair; "shedding or thinning?". **Men:** what really works and what to expect; finasteride side effects explained fairly; why "extra strength" is not better; receding hairline or something else? Each ends "Start your hair check" | Condition-first; medicines named only in a fair overview of all options on inner pages; never "best". **[reviewed: corrected]** (1) Never use a guide that names a prescription medicine as the landing page of a paid advert: the ASA ruled against Voy (September 2025) when a no-name advert landed on a page about prescriptions [uk-regulation 2.5]. (2) "Why 'extra strength' is not better" is about rivals' compounded 6% to 10% minoxidil, which are unlicensed; Appendix 6 says unlicensed medicines "should not be mentioned", and "better than another treatment" is on the regulation file's "You cannot say" list. Write it about the evidence for licensed strengths, name no rival product, and get the adviser's sign-off, or drop it |
| **Free tools (no email needed)** | Photo tracker; shedding timeline; "shedding or thinning?" explainer; printable GP summary | Information, not diagnosis; reviewed under reg 286. **[reviewed: corrected]** A photo tracker for people who are not patients handles health data outside "provision of health care" (Article 9(2)(h) [uk-regulation 6.1]): keep photos on the person's own device, or cover it in the DPIA with its own legal basis |
| **Paid search on the condition** | "thinning parting", "hair falling out after baby", "hair loss perimenopause", "receding hairline", "hair loss check"; **never** drug names | Google requires GPhC registration plus LegitScript (or NABP) and its own certification; "Buy Oral Minoxidil" was upheld against Manual [market-economics 6.3; uk-regulation key fact 13] |
| **Meta and other social** | Condition education and real people talking about the problem and the service; a phone taking a scalp photo; a pharmacist on a call | No medicine names, pill shapes, labelled bottles or before-and-after photos; Meta allows prescription-medicine adverts only in the US, Canada and New Zealand; influencers talk about the condition and service only, under a written brief [market-economics 6.3, 6.4]. **[reviewed: corrected]** Every paid post must be clearly marked as an advert (CAP Code section 2; not covered in the regulation file, so confirm with the adviser [to verify]). The MHRA also treats general words such as "pills" or "tablets" that imply the outcome of a consultation as promoting a prescription medicine [uk-regulation 2.3] |
| **Partnerships (women)** | Referral links with postnatal groups, menopause services, PCOS support and weight-management services that do not treat hair | **Condition and service only**; written agreements; no payments or incentives to prescribers; no professional endorsement of medicines; we answer for what partners post [uk-regulation 2.5]. **[reviewed: corrected]** Any payment per referral turns a partner into an affiliate, which the ASA holds the brand responsible for (rulings of 11 February 2026 [market-economics 6.4]); prefer unpaid listings or flat fees for content |
| **Hairdressers and barbers** | A plain leaflet: spotting thinning and red flags, when to see a GP, our service | No medicine names; no codes that name medicines |
| **GPs and community pharmacies** | Good GP letters and stop-screen summaries build our name over time | [our view] |
| **Reviews** | Invite **every** customer at 3 and 6 months; reply to every review | No fake, bought or selectively gathered reviews; reviews must not become testimonials for a medicine. **[reviewed: corrected]** Patients will name finasteride and other medicines in their reviews. Never show review quotes, widgets or star badges that carry a medicine name on the home page, in adverts or in social posts (reg 289 and CAP 12.18 ban endorsement of a medicine; testimonials count [uk-regulation, "You cannot"]). Show service ratings only |
| **Existing customers** | Soft opt-in marketing emails about the service and the condition | **Never** name or point to a POM (MHRA, Numan 2023; ASA, Voy May 2026) [WF 6.3]. **[reviewed: corrected]** The soft opt-in covers the email rules (PECR) only [uk-regulation 6.1]. Choosing whom to email because they are hair-loss patients uses health data, and the usual legal condition for it, Article 9(2)(h), is for providing health care, not marketing. Ask the data-protection adviser which condition applies (explicit consent may be needed) and record it in the DPIA [to verify] |
| **PR** | The quarterly service report; commentary when the 2027 subscription rules start | Service facts only |
| **Refer a friend** | **Not at launch.** Later, perhaps a fixed charity donation or service credit with posting rules | The ASA held Voy responsible for referral posts naming a POM (February 2026) [WF 6.3] |

### 7.5 Adverts for shop-bought minoxidil (GSL)

Minoxidil 5% (men) and the women's 2% and 5% foam are licensed general-sale medicines, so they **can** be advertised
within their licence and the CAP Code [market-economics 6.1]. **But** CP's and WF's drafts had those adverts lead into
the online consultation. A medicine advert may not offer diagnosis or treatment online (reg 286; CAP 12.2.1)
[judging 3.1, 3.2]. So:

- **At launch: no GSL product adverts.** [proposal]
- After **written legal advice**, only if the product advert and the consultation offer are kept fully apart (no link
  from the product advert to the hair check). If the adviser cannot confirm a lawful design, drop the channel.

### 7.6 Words to use and words to avoid [WF 6.4]

| Avoid (and why) | Use instead |
|---|---|
| "Finasteride from £18" on the home page (names a POM) | "Hair-loss care from £18 a month" |
| "Clinically proven treatment" | "Options backed by published research, chosen after a consultation" (inner pages, evidence shown fairly) |
| "See results in 6 months or your money back" (a guarantee) | "Not happy with our care in 90 days? We refund your last payment" |
| "Buy now" | "Start your hair check" |
| "The strongest formula" | "The strength the research supports" (inner pages only) |
| "50% off your first month" | One price, shown in full |
| "Safe", "no side effects" | "Every medicine can cause side effects. We tell you what to expect and check in with you" |
| "Cheaper than [rival]" | "No 6- or 12-month prepayment needed" (a service term, not a medicine) |

### 7.7 What we never do [uk-regulation, "You cannot say or do"]

Name a POM on the home page, in adverts, search terms, social posts, the web address or marketing emails; mention or
show an unlicensed product; call anything that includes one "clinically proven"; use "Buy now" for a POM; offer free
medicines, first-order or headline discounts; promise results or tie refunds to growth; say "safe", "no side effects",
"best", "strongest" or "better than"; use doctors, pharmacists, celebrities or customers to endorse a medicine; let
affiliates post codes naming POMs; use urgency ("act now").

### 7.8 The copy check: every advert, page and email, every time [VT 6.6, with the reg 286 check added]

A named person signs it off; the log is kept; a regulatory adviser signs off the first version of each template.

1. Does it name, show or hint at a prescription or unlicensed medicine? If yes, it cannot be an advert.
2. Does it promise or imply that hair will grow? If yes, rewrite.
3. Is every claim a service fact we can prove from our own data today?
4. Does any health professional or customer appear to endorse a medicine?
5. Is any price a discount, an offer, or tied to a named medicine on the home page?
6. Would a regulator reading the **whole page**, pictures included, think it sells a medicine?
7. **Reg 286 check:** if it advertises any medicine, even a GSL one, does it offer a diagnosis or treatment online, or
   link to the hair check? If yes, it cannot run.

---

## 8. The numbers that tell you it is working

Targets are proposals; replace them with pilot data where they are guesses.

| Measure | Target or trigger [proposal] | Why |
|---|---|---|
| **Still paying at months 3, 6 and 12** | Track from day one; no UK benchmark exists. **[reviewed: corrected]** Planning trigger: at least about 91% / 83% / 69% (about 3% leaving a month) to support £100 to win a customer; below about 80% / 65% / 42% (7% a month) stop paid acquisition | Decides the business [market-economics 5.6]; retention table (5.5) |
| **CAC by channel** | Aim near £60; scale a paid channel only when its measured payback is under about 12 months. **[reviewed: corrected]** £60 is a stretch target with no benchmark; plan on £100. Include free-route prescriber time (5.4). Scale a channel only when its CAC plus £24 is below the lifetime contribution at the **measured** leaving rate (floor 4, 5.6) | Payback table (5.5) |
| Contribution per plan against section 5.2 | Every plan above the price floor | Price floor rule (5.6) |
| Share who finish the questions; median minutes | About 5 to 6 minutes | Easy sign-up is 21% of praise [customer-voice] |
| Share stopped or referred, and why | A quality sign, reviewed monthly | Proves the engine stops what it should |
| New patients with a complete baseline photo set before the first prescription | **100%** | Diagnosis first |
| Women 45+ with hairline and eyebrow photos and an FFA check recorded | **100%** | Settled safety rule |
| Specials with a recorded clinical need | **100%** | GN14 |
| Time to prescriber decision | Within 1 working day of a complete file | Our published promise |
| Side-effect reply time | Same working day | Second-ranked unmet need [customer-voice summary 8] |
| Potassium, contraception and blood pressure checks done on time | **100%** | Tier B safety |
| Parcels on time; lost parcels; stock-outs | Lost or late replaced next working day | Main complaint in about 28% of negative reviews |
| Patients reaching their 6-month photo review | Track; the honest-verdict promise depends on it | "No results" is about 22% of main complaints |
| Median time to cancel | Under a minute | DMCCA; top complaint |
| Fair Deal refunds, by reason | Early warning of a product or service problem | Promise costs assumed at 3% then 1% |
| Complaints by theme; review scores | Reply to every review | Trust |
| Real prescriber minutes per patient | Against the 55 / 63 minutes assumed | The biggest controllable cost |

---

## Commercial review log

**What this is.** An independent commercial review of `plan.md` and this file, done on 24 November 2026 by a reviewer
who did not write them and was asked to assume wishful thinking. Every market figure, rival fact, price comparison,
unit-economics input and marketing rule was checked against `foundations/market-economics.md`,
`synthesis/products-prices.md`, the company digests (`synthesis/digest/`) and the other foundations files. All
arithmetic was recomputed. Fixes in `plan.md` and this file are marked **[reviewed: corrected]**. No new web research
was done; `products.md`, `engine.md` and `risks.md` were read but not edited.

**Evidence limits that still apply.** Voy\*, Hers (US)\* and Oxford Online Pharmacy\* could not be walked live; XYON‡
was never verified; Sons† and Ro† were still in final review (their stage 2 data is complete). Where a verdict leans on
them it says so. Everything after any rival's sign-in wall comes from public documents, not observation. The UK
market sweep (Dermatica, City Skin Clinic, SkinDoc, Midland Skin) was not fact-checked.

**Verdict words.** **Confirmed**: matches the source. **Corrected**: the text was wrong, overstated or incomplete and is
now fixed; *(wishful)* means the error made the plan look better than it is; *(cautious)* means it made the plan look
worse. **Gap**: something the plan needed was missing and is now added. **At risk**: an unsourced assumption that may
be fine but has no quote or benchmark; flagged, not changed.

### A. Market figures and "why now" (`plan.md` 2)

| # | Checked | Verdict | Source or working |
|---|---|---|---|
| A1 | About 12m UK men and 3.4m to 6.2m UK women have pattern hair loss | Confirmed (an estimate in the source) | market-economics 1.2, key fact 4 |
| A2 | Under 10% of affected European men on treatment (2005) | Confirmed | market-economics key fact 5 (men 18 to 45, phone survey) |
| A3 | Online +12.7% a year, women +9.1% a year | Corrected | Global forecasts from one firm, not UK figures [market-economics 2.1, key fact 9] |
| A4 | Hims & Hers US$2.35bn; owns Hims UK, ZAVA, Juniper UK; US$919m marketing | Confirmed | market-economics key facts 10, 12, 13 |
| A5 | Voy (£227m) and Numan (£69m) "grew mainly on weight loss" | Corrected *(wishful)* | Only ZAVA's accounts say so; Voy's and Numan's do not split sales by condition; years are 2025 and 2024 [market-economics 3.1] |
| A6 | Women badly served (6 of 12 men only; only anti-androgen Hers UK 44 mg; no life-stage pathway) | Confirmed for the 12; Corrected *(wishful)* in scope | products-prices 4.1, 4.3; uk-sweep 1 and 4d name Dermatica, City Skin Clinic, SkinDoc, Midland Skin |
| A7 | Hair loss on weight-loss injections: 2.5% (semaglutide 2.4 mg), 4.9% (tirzepatide), 1.0% placebo | Confirmed | clinical-women key fact 25, verification row 18 |
| A8 | Regulators acting: GPhC enforcement at Voy (Aug 2026), MHRA finasteride (May 2026), ASA rulings | Confirmed; Corrected *(wishful)* | Voy met all standards again on 13 Oct 2026; the GPhC's discount finding was about a weight-loss medicine [uk-regulation 3.5, verification row 29] |
| A9 | DMCCA subscription rules from 1 Jan 2027 (draft) | Confirmed; Corrected in meaning | uk-regulation key fact 24. The rules bind rivals' new contracts too, which weakens edge line 7 |
| A10 | Complaints: 35% cancelling; main complaint 28% / 22% / 18%; 24% refunds refused | Confirmed; Corrected in scope | customer-voice summary, 1.2, 1.3: keyword screens; about 1,045 of about 1,861 screened negative reviews concern US companies (sum of the 1.3 table); the 28/22/18 split is 68 hand-read reviews |
| A11 | First orders at about half price; Dr Fox £10 for 28 tablets | Confirmed | market-economics key facts 21, 22; products-prices 3.1 (Numan banner 50% against 40% in its pricing call is a conflict in the source) |
| A12 | Hims lost about 103,000 subscribers; cause is an inference | Confirmed | market-economics key fact 11, verification row 4 |
| A13 | Is the market big enough for break-even? | Gap, now added (`plan.md` 2) | Market file: UK online hair prescribing "probably tens of millions of pounds a year" (low confidence) [market-economics 2.2]. Reviewed break-even at 3% leaving and £100 CAC: 1,910 × £27.26 × 12 = about £0.62m a year (lean); 3,720 × £27.26 × 12 = about £1.22m (standard) |

### B. Rival facts (`plan.md` 1.4, 3.1, 3.2)

| # | Checked | Verdict | Source or working |
|---|---|---|---|
| B1 | Hims UK / Hers UK row (42 answers change nothing; nothing before email; fixed strengths; cancel via support; Hers UK asks her name first; spironolactone 44 mg; £16.50 on a 6-month plan) | Confirmed | hims-uk digest; products-prices 3.4, 3.5, 4.1 |
| B2 | Voy\* row | Confirmed; Corrected *(wishful)* | voy digest (email before verdict, 10% spray, capsules, under-48-hour delivery, pause, switch and cancel in the account); the October 2026 re-inspection was missing [uk-regulation 3.5]. Its quiz was never seen |
| B3 | Hair + Me row (40% of praise, 68 replays, 16 formulas, £37.91) | Confirmed | hair-and-me digest; cross-company 3; customer-voice 4 ("easy process" is 40% of its praise); £34.99 × 13 ÷ 12 = £37.91 |
| B4 | Sons† row (own licences, PHQ-2, NHS record consent, no crisis response, silent removals, cancel by email, 40% then 50% off on leaving) | Confirmed | sons digest; customer-voice 3 and log rows 2, 20 (the retention offers rest on one confirmed review); Sons† still in final review |
| B5 | Numan row | Confirmed | numan digest; cross-company 3 (the only early-shedding warning before sign-in) |
| B6 | Dr Fox row (£7.25 on 168 tablets; a doctor approves every order) | Confirmed | dr-fox digest; products-prices 3.2; cross-company 2a |
| B7 | Treated, Philip Kingsley, Boots, Superdrug and LloydsPharmacy rows | Confirmed | Their digests; cross-company 1, 4.6 (Boots: nine red flags reached the same screen; Superdrug: photos only for unusual patterns) |
| B8 | Oxford\* row | Confirmed (desk research only) | oxford-online-pharmacy digest; products-prices 4.1 |
| B9 | US table (`plan.md` 3.2) | Not re-checked line by line | Ideas only; no price, cost or claim in the plan rests on it |
| B10 | Rivals missing from the comparison | Gap, now added (`plan.md` 3.1) | Dermatica, City Skin Clinic, SkinDoc, Midland Skin [uk-sweep 1, 4d; not fact-checked] |
| B11 | "Women's minoxidil tablets from a licensed tablet, which no UK rival sells" | Corrected *(wishful)* | products-prices 5.2 says "as far as public material shows". Oxford\* stocks licensed 2.5 mg tablets and its women's programme names no drug [products-prices 4.1, 3.5] |

### C. Price comparisons (`plan.md` 3.3, 4.2; this file 4)

| # | Checked | Verdict | Source or working |
|---|---|---|---|
| C1 | Dr Fox finasteride £7.25 to £14.90; Oxford\* £9.17 to £13.99 | Confirmed | products-prices 3.2 |
| C2 | Hims UK chew £16.50 a month on a 6-month plan (£99) | Confirmed | products-prices 3.5 (not re-read live in the market file's fact-check) |
| C3 | Sons† 5% spray £15 a month "on a 12-month prepaid plan" | Corrected *(wishful)* | products-prices 3.3 gives £15 on 12 months but not whether paid up front; Dr Fox sells the same spray at £19.95, or £14.98 a month on 6 months |
| C4 | Numan finasteride £20 a month on annual billing | Confirmed | products-prices 3.2 |
| C5 | A year of finasteride: ours £216 to £240 against £240 to £276 | Confirmed; Corrected *(wishful)* | £18 × 12 = £216; £20 × 12 = £240. Dr Fox, about £100 to £116 a year, was left out [products-prices 3.2] |
| C6 | Two medicines at £32 against medians of £31.50 (6 months) and £43.50 (single month) | Confirmed | products-prices 3.6 |
| C7 | Men's two-medicine comparisons in `products.md` M3 | Confirmed | products-prices 3.5 bundles (Voy\* figures from search summaries) |
| C8 | Women's prices against rivals and shop prices | Gap, now added (`plan.md` 3.3) | products-prices 4.1: Voy\* £24 (£14.99 on adverts), Hers UK £13 / £20, Hair + Me £37.91, Philip Kingsley £36; Regaine for Women £25 (Superdrug), £27.77 / £34.80 (Oxford\*) |

### D. Unit economics (this file 5)

| # | Checked | Verdict | Source or working |
|---|---|---|---|
| D1 | Arithmetic of all 18 plan rows, the blend (£27.26; £8.14 / £10.98), break-even, payback, worth before CAC, start cost (£23.96), prescriber capacity | Confirmed | Contribution = price − medicine − parcels − card (2.2% + 20p) − minutes × £0.85 ÷ 12 − promise % − £1.00. Finasteride £20, year 1: 20 − 4.40 − 2.78 − 0.64 − 3.90 − 0.60 − 1.00 = £6.68 (table £6.69, rounding). Mix gives 31.7% on foam and 25% Tier B, as stated. Capacity: 1,600 h × 75% = 72,000 min ÷ 82 min per first-year patient = about 875 |
| D2 | Sensitivity rows (5.8) | Confirmed except the two foam rows; Corrected | Foam users: 9.9% of patients at £22, 21.8% at £26. A 20-point change in foam cost moves the blend by 0.099 × £4.40 + 0.218 × £5.20 = £1.57: £9.71 / £12.55 and £6.57 / £9.41 (blueprint £9.75 / £12.59 and £6.53 / £9.37) |
| D3 | Price-floor example: men's foam "would lose about £3.80" at 70% | Corrected | £0.98 − (0.70 × £22 − £12.00) = −£2.42 |
| D4 | Tablets at 22% of price | At risk (probably cautious) | No quote. Dr Fox retails 168 finasteride tablets for £43.50 (£7.25 a month), so wholesale is lower; the 22% comes from compounding firms' accounts whose cost of sales is not itemised [market-economics 5.1, 5.5]. Women's half-tablet (£4.40) costs more than men's whole tablet (£4.84) on a per-mg basis: cautious |
| D5 | Branded foam at 50% of price | At risk | Retail ceilings: Dr Fox £20.33 a month on 6 months; Superdrug 3 cans £65.99 [products-prices 3.3]. Women's can length [to verify] |
| D6 | Tracked post £2.90 | At risk (weak proxy) | A customer charge at one pharmacy, not a cost, and not confirmed as tracked [market-economics 5.5]. Share of patients with flammable scalp minoxidil: 0.6 × 0.55 + 0.4 × 0.725 = 62% |
| D7 | Dispensing and second-pharmacist check £1.50 a parcel | Corrected *(wishful)* | £1.50 ÷ £0.85 a minute = 1.8 minutes of pharmacist time and nothing for the dispenser. CP 7.2: 3 minutes a supply = £2.55 for the check alone. Effect: £1.05 × 6.8 ÷ 12 = £0.60 a month (year 1); £1.05 × 5.6 ÷ 12 = £0.49 (year 2). New base £7.55 (28%) and £10.49 (38%) |
| D8 | Prescriber minutes, 55 / 63 in year 1 | At risk | `engine.md` 10 adds a check-in before every supply; at about 3 minutes × about 5.8 repeat supplies, Tier A rises to about 72 minutes (+31%), the existing "+30%" row. The plan already spends 2.6 to 3 times the market file's £1.50 a month, by design [market-economics 5.6] |
| D9 | Prescriber cost £51 an hour | Confirmed (benchmark, not a quote) | £64,750 × 1.25 ÷ 1,600 h = £50.59 [market-economics 5.5] |
| D10 | Card fees 2.2% + 20p | Confirmed | market-economics 5.5, verification row 20 |
| D11 | Promise costs 3% then 1% | At risk | No benchmark; the 90-day no-conditions refund falls mostly on early leavers |
| D12 | VAT if general-sale minoxidil is standard-rated: "at least £1.40" | Corrected *(wishful)* | Scalp-only plans: 9% of patients × £3.67 + 24% × £4.33 = £1.37. Adding the scalp part of finasteride + scalp (24% × £3.67) and spironolactone + foam (5% × £4.33) gives £2.47 a patient a month |
| D13 | Owner's pay in fixed costs and owner's patient hours in per-patient costs | Corrected *(cautious)* | Double count of up to 0.75 × £3,000 = £2,250 (lean) or 0.75 × £6,750 = £5,063 (standard) a month |
| D14 | Dispenser | Gap, now flagged | Hired from day one (section 2) but in no cost line (5.1, 5.7) |
| D15 | Set-up (phase 0) budget | Gap, now flagged | No cost for build, advisers, DPIA, certification, registration, indemnity or pre-launch staff anywhere in the blueprint |
| D16 | Prescriber time on the free routes | Gap, now flagged (5.4) | £0.85 a minute; shedding check-ins at 3 and 6 months (`engine.md` 10), pregnancy route, free calls |
| D17 | Break-even and payback ignore patients who leave | Gap, now added (5.5); **the largest correction** | Still paying after *t* months = (1 − *c*)^*t*. Steady-state contribution *m* = (1 − (1 − *c*)^12) × £7.55 + (1 − *c*)^12 × £10.49. Lifetime contribution = *m* ÷ *c*. Break-even active patients = fixed costs ÷ (*m* − *c* × (CAC + £24)). At *c* = 5%: 0.95^12 = 0.540; *m* = 0.46 × 7.55 + 0.54 × 10.49 = £9.14; lifetime £183; most CAC £159; lean at £100: £11,200 ÷ (9.14 − 6.20) = 3,810. Leaving rates are scenarios: no UK rival publishes one [market-economics 5.4] |
| D18 | "The market file's planning range starts at £60" | Corrected *(wishful)* | market-economics 5.6 labels £60 "only a first-order discount" (Hair + Me's £20 × 3, 5.3). Only all-in benchmark: Hims & Hers marketing 39% of revenue, about US$32 a subscriber a month [5.3, key fact 12]; 0.39 × £27.26 = £10.63 a patient a month |
| D19 | Funding: "£171,000 to win 1,380 patients" | Corrected *(wishful)* | Month-by-month model (5.7): each month adds N patients at CAC + £24; those still paying = N × (1 − *c*)^(age − 1); cash = contribution − fixed costs − acquisition; table shows the lowest cumulative cash. Results £296,000 to over £900,000 before set-up spending |
| D20 | Payback and worth before CAC on the reviewed base | Corrected (follows D7) | £84 ÷ £7.55 = 11.1 months; £124: 12 + £33.40 ÷ £10.49 = 15.2; £174: 12 + £83.40 ÷ £10.49 = 20.0. Worth: 12 × £7.55 − £24 = £66.60; + 12 × £10.49 = £192.48 |
| D21 | Sign-up costs of deliberate choices (no discount, GP consent for tablets, photos, calls, no early email) | Gap, now flagged (5.8) | products-prices 3.1 (40% to 57% first-order offers); judging 3.4; market-economics 1.3 (32.8% chose online for discretion) |
| D22 | "A typical subscription brand keeps about 67%" | Confirmed | market-economics 5.6 (a £30 plan shipped quarterly, £1.50 a month of clinician time) |

### E. The claimed edge against each rival: real, or copied within a month?

The seven edge lines are in `plan.md` 1.4: (1) diagnose first, (2) real stops before contact details, (3) licensed
first with a written ladder, (4) separate medicines at evidence doses, (5) women's medicine done properly, (6) a named
prescriber, (7) the Fair Deal.

| # | Rival | Already has | Could copy in about a month | Hard for them to copy | Verdict |
|---|---|---|---|---|---|
| E1 | Hims UK / Hers UK | 7 in part (refund if not approved), a women's brand, data controls; its group bought two laboratory-testing businesses (2025, 2026) [market-economics 7.5] | Answers that act on screen, result before email, self-service cancel (the 2027 rules push it), photos at start (its terms already allow them) | Separate licensed medicines and stepped doses: its range is fixed-strength compounded products, and "personalised offerings" are over 70% of US revenue [market-economics 3.2] | Edge real on the clinical model; its threat is price (£16.50 prepaid) and marketing money, not features |
| E2 | Voy\* | 6 in part (in-house prescribers, "unlimited clinician support"), 7 in part (account pause and cancel), photo tracker, women's dermatologist lead, more clinical checking since October 2026; sells weight-loss injections | Verdict before email; trigger and weight-loss-injection questions; published strengths. Within a quarter: a women's spironolactone protocol | Licensed first (its range rests on 10% sprays and capsules) | The fastest, best-funded copier. Our lasting edge over Voy is a clean record and women's depth. *Quiz never seen* |
| E3 | Hair + Me | 6 in part (named pharmacist prescribers, consultant dermatologists), pregnancy route, outcome scores, pet question | Photos before prescribing | A plan shown before payment (its prescribers choose after payment); licensed medicines (all 16 formulas compounded) | Edge real; low copy risk; its threat is the £14.99 introductory price |
| E4 | Sons† | 3 and 4 in part: it holds UK licences for finasteride 1 mg and minoxidil 5%, so it can sell licensed-first more cheaply than us; PHQ-2; NHS record consent | A written licensed-first ladder; stops with reasons; result before details | A women's service (women refused at question 2) | On men's licensed-first it can match and undercut us; our edge is women, triage and terms. *In final review* |
| E5 | Numan | 2 in part (full offer and prices before sign-in), early-shedding warning, clinician playbooks | Crisis screen, honoured opt-outs, locked stops | Any women's service (none exists) | Closest to our men's front door; women and scheduled follow-up are the gap |
| E6 | Dr Fox | Prices before sign-in; a doctor approves every order; the price floor | Little; its model is cheap one-off orders | Follow-up and women | Not a feature race: we do not beat it on price, and serve a different buyer |
| E7 | Treated | Full price list before details | Possible, no sign of intent | Women, photos | Low threat |
| E8 | Philip Kingsley | Paid trichologist route, scalp-first, women's quiz | Route shown before registration; fixing its rule errors | Prescriber-led women's medicines (none online) | Its brand pull with women is a threat to our women's door |
| E9 | Boots Online Doctor | 3 and 4 (licensed only), 7 in part (pay only if approved), trusted brand | Slow corporate pace | Women's pathway, subscription, follow-up | Low near-term risk; high impact if it ever moves on women |
| E10 | Superdrug Online Doctor | Photos for unusual men's patterns; women's list filtered by safety; platform owned by Hims & Hers | Its owner could push Hers UK products through it | A real follow-up model | Watch as a Hims & Hers channel |
| E11 | LloydsPharmacy Online Doctor | 2, 3 and 4 largely (stops and prices before sign-in, licensed oral minoxidil, treatment history, crisis help) | Explained removals; in-stock checks | Women's pathway; photos; scheduled follow-up | Our men's edge over Lloyds is thin (photos, follow-up, named prescriber). The women's door is the difference |
| E12 | Oxford Online Pharmacy\* | Licensed oral minoxidil; women's programme with blood tests; low prices; 4.7 on Trustpilot from 35,929 reviews | Naming the women's medicine; charging after approval | A follow-up model | It may already do privately part of what we call unique (women's bloods with licensed tablets). *Desk research only* |
| E13 | Dermatica (sweep only) | Reported: photos and dermatology review for women's thinning, monthly plan, large skincare customer base | Unknown actives | Unknown | The most direct rival to our women's door; check it before launch. *Not fact-checked* |

**Overall verdict on the edge.** None of the seven lines is impossible to copy. Lines 2, 3, 4 and 7 are already done
in part by at least one rival or will become law in 2027. Lines 1 and 6 can be copied but cost money every month.
Line 5 is the most defensible, but as a whole pathway (bloods, contraception checks, stepped doses, life-stage
questions), not as a product. The edge is a head start of months; it lasts only if the women's pathway and the
service record stay ahead.

### F. Marketing against UK law (this file 7; `plan.md` 1.2, 6)

| # | Checked | Verdict | Source or working |
|---|---|---|---|
| F1 | The law table in 7.1 (regs 279, 284, 286, 289, 303; CAP 12.12, 12.18, 12.19, 12.23; Appendix 6; DMCCA review rules) | Confirmed | uk-regulation key facts 8 to 11, verification rows 8 to 15, 25 |
| F2 | Home page "Hair-loss care from £18 a month" | Allowed in principle; Corrected (risk) | Appendix 6 allows an indicative condition price [uk-regulation 2.2]; ASA 2026 advice on prices that point to a prescription outcome [market-economics 6.4]; only prescription plans reach £18, and in phase 2 none may |
| F3 | Condition-only paid search; Google needs GPhC plus LegitScript and its own certification | Confirmed | market-economics 6.3; uk-regulation key fact 13. LegitScript cost and time not quoted |
| F4 | Meta, social and influencers | Confirmed; Corrected (added) | market-economics 6.3; ad labelling (CAP Code section 2) [to verify]; MHRA 2019 advice on "pills" or "tablets" [uk-regulation 2.3] |
| F5 | Guides on inner pages ending "Start your hair check" | Allowed; Corrected (two cautions) | Appendix 6 deeper pages [uk-regulation 2.2]; ASA v Voy, September 2025 (landing pages) [uk-regulation 2.5]; unlicensed medicines "should not be mentioned" (the "extra strength" guide) |
| F6 | Review invitations and display | Confirmed for invitations; Gap on display, now added | reg 289 and CAP 12.18 on endorsement [uk-regulation "You cannot"]; DMCCA fake-review ban [verification row 25] |
| F7 | Soft opt-in emails to customers | Lawful under PECR; Gap (health data), now flagged | uk-regulation 6.1; Article 9(2)(h) covers providing health care |
| F8 | Free photo tracker for non-patients | Gap (health data), now flagged | uk-regulation 6.1, key fact 23 |
| F9 | Partnerships | Confirmed; Corrected (affiliate payments) | ASA rulings of 11 February 2026 on affiliates [market-economics 6.4] |
| F10 | No general-sale product adverts at launch (reg 286) | Confirmed | uk-regulation verification row 10; judging 3.1, 3.2 |
| F11 | Fair Deal refunds tied to care, never results | Confirmed | uk-regulation key fact 14, "You can" |
| F12 | Reminders and marketing emails never name a prescription medicine | Confirmed | uk-regulation 6.1; ASA v Voy, May 2026 |
| F13 | No refer-a-friend at launch | Confirmed | ASA v Voy, February 2026 [uk-regulation 2.5] |
| F14 | No price-led or named-rival adverts; "No 6- or 12-month prepayment needed" | Confirmed (a lawful service claim) | judging 3.3; Appendix 6 |

### G. Summary

**Counts.** 81 items: A 13, B 11, C 8, D 22, E 13, F 14. Of the 68 items in parts A to D and F (some carry two
verdicts): **Confirmed** 40. **Corrected** 22 (11 *wishful*, 1 *cautious*, 10 accuracy, scope or legal-risk fixes).
**Gaps** added or flagged 11. **At risk** (unsourced assumptions, flagged) 5. **Not re-checked** 1 (the US table).
Part E is 13 rival-by-rival copy tests. Rival facts in the blueprint were accurate; the weaknesses were in what it left
out and in the money.

**The five corrections that matter most.**

1. **Break-even ignored patients who leave (D17).** "About 1,400 patients" is only true if nobody leaves. At £100 to
   win a customer, the lean set-up needs about 1,910 active patients if 3% leave a month, about 3,810 if 5% leave,
   and no realistic number if 7% or more leave. Retention, not price, decides the business.
2. **Money needed was understated several times over (D19).** Not £171,000: about £300,000 to £470,000 in the better
   lean scenarios, reached after about 3 years, plus all set-up costs; more in worse ones.
3. **£60 to win a customer had no benchmark (D18).** It is the size of one rival's first-order discount. Plan on
   £100, and remember that rival-level marketing (39% of revenue) would cost more than our whole year-1 contribution.
4. **The second-pharmacist check was under-costed (D7).** Contribution falls from £8.14 to about £7.55 (year 1) and
   £10.98 to £10.49 (year 2). The dispenser, the set-up budget and the free routes are still uncosted (D14 to D16).
5. **The edge is copyable (E).** Voy\*, LloydsPharmacy and Sons† could copy most of the men's edge within weeks; the
   2027 subscription rules turn most of the Fair Deal into everyone's legal minimum. The lasting edge is the women's
   pathway and the service record, and it faces new women's rivals (Dermatica, private dermatology) the blueprint
   did not name.

**What to do next.** Run the pilot to measure three numbers before raising money or buying adverts: the share still
paying at months 3, 6 and 12; the cost to win a customer by channel; and real prescriber minutes per patient. Get
quotes for the dispenser, courier (flammable goods), wholesale foam and tablets, and the set-up budget. Take tax
advice on VAT (up to £2.50 a patient a month at stake) and adviser sign-off on the home-page price line, review
display and the data basis for marketing emails.
