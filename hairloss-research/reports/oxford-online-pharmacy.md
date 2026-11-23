# Oxford Online Pharmacy: consultation and product report

**Market:** UK · **Website:** https://www.oxfordonlinepharmacy.co.uk/ · **Checked:** 2026-11-23 · **Owner:** Trading name of Frosts (Online) Limited (company no. 11232746, Banbury, Oxfordshire). A sister company, Frosts Online (Holdings) Limited (11233841), is registered at the same address.

> Family-owned UK online pharmacy with its own prescribers: the customer picks a product, answers a medical questionnaire, pays, and a doctor or pharmacist prescriber approves or declines. One-off orders, no subscription. (Built from third-party public sources only; the company's own site could not be opened.)

## 1. How far this could be tested

- **Tested by:** public-docs
- **Account wall:** Not seen: the site could not be opened. Customer reviews show that registration exists and that payment is taken before the prescriber decides, but where sign-in is forced relative to the questions is unknown.
- **Blocker:** Cloudflare security check ('Performing security verification', HTTP 403) blocked the local browser on the home page (runs/probe-home). Tried once, as instructed, and not fought.
- **Blocker:** The WebFetch tool also got HTTP 403 on the home page and on /hair-loss; plain curl got HTTP 403 on /robots.txt and /sitemap.xml.
- **Blocker:** Web search was not available: the shared search budget for the whole workflow ran out after one query (which returned nothing from this company's site).
- **Blocker:** A Wayback Machine copy of /hair-loss exists (captured 1 Nov 2026) but could not be read: the fetch tool refuses web.archive.org and the session proxy resets the connection. Archive services were not pursued further.
- **Blocker:** Regulator pages that might describe the prescribing service were also blocked to the fetch tool today (CQC search HTTP 403, GPhC register HTTP 403).

No page of the company's own site was read. There was no live walk, no site code and no quiz definition, so the product catalogue, prices, entry points and question wording are NOT mapped. Everything here comes from the company's Trustpilot page and Trustpilot's own review search (words: hair, finasteride, dutasteride, minoxidil, spray, topical, solution, compounded, scalp, Regaine, spironolactone, questionnaire, subscription), read through a fetch tool that paraphrases reviews, plus a Companies House search. Reviews are customers' own accounts and are not verified. The compounded sprays named in the task brief could not be confirmed from any source read today, so they are listed under unverifiedLeads, not under products.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

Not observed. From customer reviews and company replies only: this looks like a catalogue pharmacy, not a recommending quiz. The customer chooses the product, strength and pack size; a questionnaire (height, weight, age, conditions, medicines, previous use, GP details) screens for safety; payment is taken; then a human prescriber makes the real decision and may decline, refund, or offer something else. Known prescriber rules: finasteride before dutasteride, no finasteride and dutasteride together, no high-dose oral minoxidil, GP involvement for oral minoxidil, early reorders are held, and limited prescribing for women. Whether any of these are built into the questionnaire, or all sit with the prescriber, is unknown.

## 3. Engine rules (8)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | hair | The patient asks for dutasteride and has not tried finasteride first. | Dutasteride is not supplied; finasteride is offered first. In one case the refusal came by phone after payment, although the customer says the questionnaire had 'recommended dutasteride'. _(affects: Dutasteride capsules, Finasteride 1 mg tablets (generic))_ | Switches product | docs | medium |
| R2 | hair | The patient wants dutasteride while still taking finasteride. | The prescription is declined; the patient is told to stop finasteride and reorder. Company reply: it is 'not a licensed regime'. _(affects: Dutasteride capsules)_ | Removes a product | docs | low |
| R3 | hair | The patient asks for oral minoxidil above the usual dose (the limit itself is not stated). | The higher dose is not supplied (part of the order was cancelled). Company reply: higher doses need a specialist prescriber. _(affects: Oral minoxidil 2.5 mg tablets (Loniten named by one customer))_ | Changes strength | docs | medium |
| R4 | hair | The patient orders oral minoxidil. | Extra checks may follow: the GP is told and asked to monitor; one order was cancelled until GP blood tests were done; the oedema risk is flagged in the consultation and the patient agrees to tell their doctor. _(affects: Oral minoxidil 2.5 mg tablets (Loniten named by one customer))_ | Flags for the clinician | docs | low |
| R5 | hair | A reorder is placed early, while the patient should still have supply left. | The order is put on hold and queried, or declined by the doctor. | Flags for the clinician | docs | medium |
| R6 | hair | A woman orders a hair-loss tablet (the tablet is not named). | The order was refused in the one known case. Company reply: it must prescribe within its clinical team's limits, it is not a hair-loss specialist, and it is limited in what it can prescribe for female patients. | Stops the patient | docs | low |
| R7 | hair | The patient takes antidepressants and orders finasteride. | Finasteride was still prescribed in the one known case (the customer complained about this). So antidepressant use may not be a hard stop. One unverified account. _(affects: Finasteride 1 mg tablets (generic))_ | No effect | docs | low |
| R8 | hair | The prescriber judges the chosen treatment unsuitable after payment. | The order is declined with a full refund (refunds can take about 5 working days), or an alternative is offered which the patient can accept or decline. | Switches product | docs | medium |

## 4. Products (5)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Finasteride 1 mg tablets (generic)](https://www.oxfordonlinepharmacy.co.uk/hair-loss) | rx-oral | finasteride 1 mg | tablet | men | Prescription-only medicine. Finasteride 1 mg is licensed in the UK for male pattern hair loss (general knowledge; not read from the company's site). | unknown (the company's site could not be opened) (One customer names a 168-tablet pack (24 weeks) in July 2026; others describe six-monthly reorders. Customers call the price competitive. Company reply (March 2026): the price-match guarantee applies only to the same br…) | Company reply on Trustpilot (Feb 2021): finasteride is offered first-line to patients who have not tried medication. Exact rule in the consultation is unknown. | docs |
| [Propecia (branded finasteride 1 mg): named in one 2023 customer review](https://www.oxfordonlinepharmacy.co.uk/hair-loss) | rx-oral | finasteride 1 mg | tablet | men | Prescription-only medicine, licensed for male pattern hair loss (general knowledge; not read from the company's site). | unknown (the company's site could not be opened) | unknown | docs |
| [Dutasteride capsules](https://www.oxfordonlinepharmacy.co.uk/hair-loss) | rx-oral | dutasteride 0.5 mg (named in one August 2020 review; current strengths not confirmed) | capsule | men | Prescription-only medicine. Dutasteride is licensed in the UK for an enlarged prostate, so use for hair loss is off-label (inferred from the UK licence; the company's own wording was not seen). | unknown today (the company's site could not be opened) (One customer paid £138.99 for a six-month supply in February 2021. That price is old and may not hold now.) | Only after finasteride has been tried, and not together with finasteride. Sources: customer reviews of January and February 2021 and August 2025, and company replies. One August 2025 reviewer says the online questionnaire itself 'recommended dutasteride' and the refusal came afterwards by phone, so the block may sit with the prescriber, not the questionnaire. | docs |
| [Oral minoxidil 2.5 mg tablets (Loniten named by one customer)](https://www.oxfordonlinepharmacy.co.uk/hair-loss) | rx-oral | minoxidil 2.5 mg | tablet | men | Prescription-only medicine. Minoxidil tablets are licensed for severe high blood pressure, so use for hair loss is off-label. Customers say the pharmacy sends a document about off-label use. | unknown (the company's site could not be opened) | unknown. Reviews show extra care around it: questions about health and current medicines, the GP is told and asked to monitor, one order was cancelled pending GP blood tests (May 2025), an ID check can follow the order, and a higher dose was refused (company reply, November 2025: higher doses need a specialist prescriber). Whether women can have it is unknown. | docs |
| [Regaine foam (minoxidil), twin pack: seen only in a 2015 customer review](https://www.oxfordonlinepharmacy.co.uk/hair-loss) | otc-medicine | minoxidil 5% (inferred: Regaine foam is only made as 5%; the review does not state it) | foam | both | Licensed over-the-counter medicine (pharmacy or general sale; not checked on the company's site). | unknown today (the company's site could not be opened) (The only evidence is a January 2015 customer review (£99, described as six cans for six months). It may not reflect today's range or price. Men's or women's version not stated.) | unknown | docs |

## 5. Who gets what (0 patient profiles)


## 6. The consultation, question by question

### Hair-loss online consultation (not walked; outline from customer reviews only)

Entry: https://www.oxfordonlinepharmacy.co.uk/hair-loss

Not walked: the site blocked the browser. Outline from customer reviews: choose a product (reviews mention a wide range of products, pack sizes and treatment lengths, and 'a choice of different tablets') → online medical questionnaire → registration and payment (payment is taken before the prescriber decides) → review by a doctor or pharmacist prescriber, sometimes with an email or phone call, an automatic ID check, a request for photos, or a request for GP blood tests → dispatch, or decline with a refund, or an alternative offered. A fresh consultation is needed for every reorder, with earlier answers pre-filled. No subscription.

## 7. Competitive read

**Strengths**

- No subscription: one-off orders, which several customers praise (company reply of 24 Oct 2026 calls it a 'no-subscription approach').
- Low prices and a price-match guarantee (same brand, strength, quantity and medicine); free UK delivery over £40.
- Sells oral dutasteride and oral minoxidil for hair loss, which many UK online clinics do not.
- Long trading history and very large review base (35,929 Trustpilot reviews, TrustScore 4.7 on 23 Nov 2026).
- Answers are saved and pre-filled for reorders.

**Weaknesses**

- Payment is taken before the prescriber decides, so refusals arrive after payment and refunds take days (several 1-star reviews).
- The customer is shown a choice of products rather than a recommendation (one customer complaint, July 2026; treatment not named).
- Generic brand can change without warning (2025 and 2026 reviews).
- Limited offer for women (company reply, July 2024).
- ID checks are not always flagged before checkout (company reply, March 2026).

**Gaps a new competitor could use**

- Tell the patient what they are eligible for before taking payment (for example the finasteride-before-dutasteride rule), instead of refusing afterwards.
- Give a clear recommendation instead of a list of products to choose from.
- A proper women's hair-loss pathway, which this company says it is limited in.

## 10. Limits of this report

- The company's own website was not read at all, so there is no verified product catalogue, no prices, no compounded formulas or strengths, no entry points and no question wording.
- The compounded sprays and solutions named in the task brief are unconfirmed (see unverifiedLeads; they are not in the products list).
- All findings come from Trustpilot reviews and company replies, paraphrased by a fetch tool that will not quote at length. Reviews are one-sided, unverified and some are years old.
- The 'rules' are prescriber behaviour reported by customers, not engine behaviour seen in a replay. None has been tested.
- Web search was unavailable (shared budget used up), so press, help-centre pages and regulator reports were not found.
- Not every page of each Trustpilot search was read (for example 'finasteride' pages 2 to 4 and 'hair' page 5).

## 11. Sources

- [Trustpilot: Oxford Online Pharmacy company page (business facts)](https://uk.trustpilot.com/review/oxfordonlinepharmacy.co.uk)
- [Trustpilot review search: hair (pages 1 to 4 of 5 read)](https://uk.trustpilot.com/review/oxfordonlinepharmacy.co.uk?search=hair)
- [Trustpilot review search: finasteride (page 1 of 4 read)](https://uk.trustpilot.com/review/oxfordonlinepharmacy.co.uk?search=finasteride)
- [Trustpilot review search: dutasteride (page 1 read)](https://uk.trustpilot.com/review/oxfordonlinepharmacy.co.uk?search=dutasteride)
- [Trustpilot review search: minoxidil (page 1 of 2 read)](https://uk.trustpilot.com/review/oxfordonlinepharmacy.co.uk?search=minoxidil)
- [Trustpilot review search: questionnaire (page 1 of 4 read)](https://uk.trustpilot.com/review/oxfordonlinepharmacy.co.uk?search=questionnaire)
- [Trustpilot review search: subscription](https://uk.trustpilot.com/review/oxfordonlinepharmacy.co.uk?search=subscription)
- [Trustpilot review searches with no hair-loss result: spray, topical, solution, compounded, scalp, spironolactone](https://uk.trustpilot.com/review/oxfordonlinepharmacy.co.uk?search=spray)
- [Companies House search: Frosts (Online) Limited, 11232746](https://find-and-update.company-information.service.gov.uk/search/companies?q=frosts+%28online%29)
- [NOT READ (blocked here): Wayback Machine copy of the hair-loss category page, captured 1 Nov 2026](http://web.archive.org/web/20261101123809/https://www.oxfordonlinepharmacy.co.uk/hair-loss)
