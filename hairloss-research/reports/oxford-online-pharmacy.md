# Oxford Online Pharmacy: consultation and product report

**Market:** UK · **Website:** https://www.oxfordonlinepharmacy.co.uk/ · **Checked:** 2026-11-23 · **Owner:** Trading name of Frosts (Online) Limited (company no. 11232746, Banbury, Oxfordshire). A sister company, Frosts Online (Holdings) Limited (11233841), is registered at the same address.

> Family-owned UK online pharmacy with its own prescribers: the customer picks a product, answers a medical questionnaire, pays, and a doctor or pharmacist prescriber approves or declines. One-off orders, no subscription. (Built from third-party public sources only; the company's own site could not be opened.)

## 1. How far this could be tested

- **Tested by:** public-docs
- **Account wall:** docs only, not observed: the women's page lists the steps as start consultation → complete the consultation (medical history, photos of hair) → add the programme to the basket → log in or create an account → pay. So the questions come before the account wall, and payment comes before prescriber review. Not seen live: the site blocks this machine.
- **Blocker:** Cloudflare security check ('Performing security verification', HTTP 403) blocked the local browser on the home page (runs/probe-home). Tried once, as instructed, and not fought.
- **Blocker:** The WebFetch tool also got HTTP 403 on the home page and on /hair-loss; plain curl got HTTP 403 on /robots.txt and /sitemap.xml.
- **Blocker:** Web search was not available: the shared search budget for the whole workflow ran out after one query (which returned nothing from this company's site).
- **Blocker:** A Wayback Machine copy of /hair-loss exists (captured 1 Nov 2026) but could not be read: the fetch tool refuses web.archive.org and the session proxy resets the connection. Archive services were not pursued further.
- **Blocker:** Regulator pages that might describe the prescribing service were also blocked to the fetch tool today (CQC search HTTP 403, GPhC register HTTP 403).
- **Blocker:** Stage 2 (23 Nov 2026): walk.js on /hair-loss still got the Cloudflare check (runs/probe-hairloss-s2); WebFetch on /consultation/23 got HTTP 403. Web search with a domain filter worked and returned snippets of the company's own pages.
- **Blocker:** Stage 3 (23 Nov 2026): walk.js on /consultation/23 got the Cloudflare check again (runs/verify-consult); WebFetch on /hair-loss got HTTP 403. Domain-filtered web search still works.

No page of the company's site could be opened, so no live replay and no one-change experiments were possible. Stage 2 added the product catalogue (16 items with pack prices) and the consultation's topics from web-search snippets of the company's own pages, including the hair-loss consultation page (/consultation/23). Search snippets are summaries of indexed copies, some years old; no exact question wording or option list is known. Stage 3 re-checked prices and rules against fresh domain-filtered search summaries; several prices were corrected and three products added. Still no live replay.

Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site's own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).

## 2. How the engine decides (short version)

Oxford Online Pharmacy is a catalogue pharmacy, not a recommender. The customer picks a product and pack size, then completes a short (about 3-minute) questionnaire. The form screens sex, age, partner pregnancy, heart and blood-pressure problems, mood, liver and kidney disease, allergies and previous treatment, and asks consent to tell the GP. Hard limits sit mainly with the prescriber after payment: men only for finasteride, dutasteride and oral minoxidil; over 18; dutasteride only after 6+ months of finasteride; oral minoxidil 2.5 mg only, at the usual dose, with blood-pressure checks. Women go to a separate programme that needs a blood test. None of this was seen live; it comes from the company's pages and reviews.

## 3. Engine rules (17)

| # | Route | When | Then | Effect | Evidence | Confidence |
|---|---|---|---|---|---|---|
| R1 | hair | The patient asks for dutasteride and has not tried finasteride first. | Dutasteride is not supplied; finasteride is offered first. In one case the refusal came by phone after payment, although the customer says the questionnaire had 'recommended dutasteride'. _(affects: Dutasteride 0.5 mg capsules (generic), Finasteride 1 mg tablets (generic; Accord pack also listed))_ | Switches product | docs | medium |
| R2 | hair | The patient wants dutasteride while still taking finasteride. | The prescription is declined; the patient is told to stop finasteride and reorder. Company reply: it is 'not a licensed regime'. _(affects: Dutasteride 0.5 mg capsules (generic))_ | Removes a product | docs | low |
| R3 | hair | The patient asks for oral minoxidil above the usual dose (the limit itself is not stated). | The higher dose is not supplied (part of the order was cancelled). Company reply: higher doses need a specialist prescriber. _(affects: Minoxidil 2.5 mg tablets (generic oral minoxidil))_ | Changes strength | docs | medium |
| R4 | hair | The patient orders oral minoxidil. | Extra checks may follow: the GP is told and asked to monitor; one order was cancelled until GP blood tests were done; the oedema risk is flagged in the consultation and the patient agrees to tell their doctor. _(affects: Minoxidil 2.5 mg tablets (generic oral minoxidil))_ | Flags for the clinician | docs | low |
| R5 | hair | A reorder is placed early, while the patient should still have supply left. | The order is put on hold and queried, or declined by the doctor. | Flags for the clinician | docs | medium |
| R6 | hair | A woman orders a hair-loss tablet (the tablet is not named). | The order was refused in the one known case. Company reply: it must prescribe within its clinical team's limits, it is not a hair-loss specialist, and it is limited in what it can prescribe for female patients. | Stops the patient | docs | low |
| R7 | hair | The patient takes antidepressants and orders finasteride. | Finasteride was still prescribed in the one known case (the customer complained about this). So antidepressant use may not be a hard stop. One unverified account. _(affects: Finasteride 1 mg tablets (generic; Accord pack also listed))_ | No effect | docs | low |
| R8 | hair | The prescriber judges the chosen treatment unsuitable after payment. | The order is declined with a full refund (refunds can take about 5 working days), or an alternative is offered which the patient can accept or decline. | Switches product | docs | medium |
| R9 | hair | Sex = female (or assigned female at birth) and the request is finasteride, dutasteride or oral minoxidil | Not supplied; clinicians will not approve. The patient is pointed to a specialist clinic or, on newer pages, to the Oxford Female Hair Loss Programme or Regaine for Women. _(affects: Finasteride 1 mg tablets (generic; Accord pack also listed), Propecia (branded finasteride 1 mg tablets), Dutasteride 0.5 mg capsules (generic), Minoxidil 2.5 mg tablets (generic oral minoxidil), Minoxidil (Loniten) 2.5 mg tablets, branded, Avodart (branded dutasteride 0.5 mg capsules), Bundle: finasteride 1 mg (168 tablets) + oral minoxidil 2.5 mg (180 tablets))_ | Stops the patient | docs | high |
| R10 | hair | Age under 18 | Finasteride (and the compounded spray) not supplied: product pages say over 18 only. _(affects: Finasteride 1 mg tablets (generic; Accord pack also listed), Propecia (branded finasteride 1 mg tablets), Finasteride, minoxidil and tretinoin topical solution (spray), compounded)_ | Stops the patient | docs | medium |
| R11 | hair | Request for dutasteride with less than 6 months on finasteride, or no clear reason to switch | Dutasteride not prescribed; finasteride (plus Regaine for first-time patients) is the route. Strengthens R1. _(affects: Dutasteride 0.5 mg capsules (generic), Avodart (branded dutasteride 0.5 mg capsules), Finasteride 1 mg tablets (generic; Accord pack also listed), Regaine for Men Extra Strength solution (minoxidil 5%), 60 ml)_ | Switches product | docs | medium |
| R12 | hair | Partner is pregnant, or trying for a baby within the next 12 weeks | The form tells men not to use finasteride or dutasteride if their partner is pregnant or they are trying for a baby within 12 weeks; it also says pregnant women should not handle the tablets. Whether the engine stops the order or only warns is unknown. _(affects: Finasteride 1 mg tablets (generic; Accord pack also listed), Propecia (branded finasteride 1 mg tablets), Dutasteride 0.5 mg capsules (generic), Avodart (branded dutasteride 0.5 mg capsules), Bundle: finasteride 1 mg (28 tablets) + Sons Minoxidil 5% 60 ml, 1-month pack, Bundle: finasteride 1 mg (168 tablets) + oral minoxidil 2.5 mg (180 tablets), Bundle: finasteride 1 mg (84 tablets) + 3 × Regaine 60 ml + Alpecin shampoo 250 ml)_ | Shows a warning | docs | medium |
| R13 | hair | Heart or blood-pressure problem declared (fast or irregular heartbeat, chest pain, breathlessness, low blood pressure with dizziness or fainting, angina, recent heart attack, heart failure, left ventricular hypertrophy) | Inferred: oral minoxidil is not supplied (these are its listed contraindications and cautions); topical options and finasteride remain. Exact engine effect not seen. The questions themselves are confirmed (search summary of /consultation/23 lists angina, recent heart attack, LVH, heart failure, low blood pressure with dizziness or fainting); only the effect is inferred. _(affects: Minoxidil 2.5 mg tablets (generic oral minoxidil), Minoxidil (Loniten) 2.5 mg tablets, branded, Bundle: finasteride 1 mg (168 tablets) + oral minoxidil 2.5 mg (180 tablets))_ | Removes a product | inferred | low |
| R14 | hair | Oral minoxidil ordered | The form asks "If ordering Minoxidil (Loniten) tablets do you agree to check your blood pressure regularly" (wording from a search summary, so treat as close, not exact) and warns about dizziness, fluid retention and breathlessness; the GP is told. What happens on "No" is unknown. _(affects: Minoxidil 2.5 mg tablets (generic oral minoxidil), Minoxidil (Loniten) 2.5 mg tablets, branded, Bundle: finasteride 1 mg (168 tablets) + oral minoxidil 2.5 mg (180 tablets))_ | Flags for the clinician | docs | medium |
| R15 | hair | Woman with hair thinning (including menopause) | Offered the Oxford Female Hair Loss Programme (£75.99): consultation (with hair photos) and a blood test first; an unnamed oral treatment for 3 months if suitable, otherwise GP advice. Regaine for Women (solution 2%, foam 5%) is also sold without a prescription. _(affects: Oxford Female Hair Loss Programme, Regaine for Women Regular Strength (minoxidil 2%), 60 ml, Regaine for Women Extra Strength scalp foam (minoxidil 5%), 73 ml)_ | Adds a product | docs | medium |
| R16 | hair | Mood or depression history declared | Asked in the form; the form tells patients to stop finasteride and seek advice if low mood develops (search summary of /consultation/23). Whether a "yes" stops the order is unknown; one reviewer on antidepressants still got finasteride (R7). _(affects: Finasteride 1 mg tablets (generic; Accord pack also listed), Propecia (branded finasteride 1 mg tablets), Dutasteride 0.5 mg capsules (generic), Avodart (branded dutasteride 0.5 mg capsules))_ | Flags for the clinician | inferred | low |
| R17 | hair | Woman orders the Female Hair Loss Programme | A blood test (ferritin, TSH, free T4, B12, folate, vitamin D) must be done before oral treatment; results decide between treatment and referral to the GP. Conflicts with a men's blog post saying blood tests are normally not needed (that post is about the men's consultation). _(affects: Oxford Female Hair Loss Programme)_ | Flags for the clinician | docs | medium |

## 4. Products (17)

| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Finasteride 1 mg tablets (generic; Accord pack also listed)](https://www.oxfordonlinepharmacy.co.uk/hair-loss/finasteride) | rx-oral | finasteride 1 mg | tablet | men | Prescription-only medicine. Finasteride 1 mg is licensed in the UK for male pattern hair loss (general knowledge; not read from the company's site). | £13.99 for 28 tablets (Generic page (search snippet, 23 Nov 2026): 28 £13.99, 56 £23.99, 84 £32.99, 168 £54.99. Accord-brand listings: 28 £14.99, 168 £59.99 (/hair-loss/finasteride-accord). A blog table shows 168 at £58.94: cached copies diff…) | Men and those assigned male at birth, over 18, with hereditary (male pattern) hair loss. The company presents it as the first-line prescription treatment; first-time patients are steered to finasteride plus Regaine rather than dutasteride. Not for women. Sources: company product pages and dutasteride page (search snippets); company reply on Trustpilot (Feb 2021). | docs |
| [Propecia (branded finasteride 1 mg tablets)](https://www.oxfordonlinepharmacy.co.uk/hair-loss/propecia) | rx-oral | finasteride 1 mg | tablet | men | Prescription-only medicine, licensed for male pattern hair loss (general knowledge; not read from the company's site). | £41.59 for 28 tablets (28 £41.59, 56 £80.94, 84 £109.99, 168 £214.99 (£1.28 a tablet). One page dates its price note Nov 2024. Consultation needed before purchase.) | Same eligibility as generic finasteride (men over 18); a branded choice the customer picks, not a separate engine outcome (inferred: catalogue model). | docs |
| [Dutasteride 0.5 mg capsules (generic)](https://www.oxfordonlinepharmacy.co.uk/hair-loss/dutasteride) | rx-oral | dutasteride 0.5 mg | capsule | men | Prescription-only medicine. Dutasteride is licensed in the UK for an enlarged prostate, so use for hair loss is off-label (inferred from the UK licence; the company's own wording was not seen). | £18.99 for 30 capsules (Generic page (search snippet, 23 Nov 2026): 30 £18.99, 60 £35.99, 90 £49.99, 120 £63.99, 150 £74.99, 180 £83.99 (47p a capsule). Corrected in stage 3: the earlier £39.99 for 30 is the branded Avodart price. Off-label fo…) | Men only. Only considered after at least 6 months on finasteride and with a clear reason (company blog on switching), not together with finasteride, and not for first-time patients (product page recommends Regaine plus finasteride instead). Off-label for hair loss. Sources: company pages (search snippets) and Trustpilot replies 2021 and 2025. | docs |
| [Minoxidil 2.5 mg tablets (generic oral minoxidil)](https://www.oxfordonlinepharmacy.co.uk/hair-loss/minoxidil-generic) | rx-oral | minoxidil 2.5 mg | tablet | men | Prescription-only medicine. Minoxidil tablets are licensed for severe high blood pressure, so use for hair loss is off-label. Customers say the pharmacy sends a document about off-label use. | £22.49 for 30 tablets (30 £22.49, 60 £44.98 (a blog says £44.99), 120 £74.99, 180 £114.99. Only 2.5 mg is sold. Off-label (licensed only for severe hypertension).) | Men and those assigned male at birth only (the product page says clinicians cannot approve it for women). The consultation screens heart and blood-pressure problems, and the patient must agree to check blood pressure regularly; doses above the usual are refused (higher doses need a specialist). Off-label (licensed only for high blood pressure). | docs |
| [Regaine for Men Extra Strength scalp foam (minoxidil 5%), 73 ml and 3 × 60 g packs](https://www.oxfordonlinepharmacy.co.uk/hair-loss/regaine-for-men-extra-strength-scalp-foam-3-x-60g) | otc-medicine | minoxidil 5% | foam | both | Licensed over-the-counter medicine (pharmacy or general sale; not checked on the company's site). | £59.99 for 3 × 60 g (Search snippet titles: "Regaine For Men Extra Strength Foam, 3 x 60g for £59.99" and a 73 ml listing (price not seen). Replaces the stage 1 entry built only from a 2015 review.) | unknown | docs |
| [Minoxidil (Loniten) 2.5 mg tablets, branded](https://www.oxfordonlinepharmacy.co.uk/hair-loss/minoxidil-loniten) | rx-oral | minoxidil 2.5 mg | tablet | men | Prescription-only medicine, licensed for high blood pressure; off-label for hair loss. | £24.99 for 30 tablets (Pfizer Loniten 2.5 mg: 30 £24.99, 60 £49.99, 120 £84.99, 180 £139.99. Off-label for hair loss.) | Same rules as generic oral minoxidil; a branded choice the customer picks (inferred: catalogue model). | docs |
| [Avodart (branded dutasteride 0.5 mg capsules)](https://www.oxfordonlinepharmacy.co.uk/hair-loss/avodart) | rx-oral | dutasteride 0.5 mg | capsule | men | Prescription-only medicine, licensed for enlarged prostate; off-label for hair loss. | £39.99 for 30 capsules (30 £39.99, 90 £113.99, 120 £1.08 a capsule (about £129.60), 180 £159.99 (89p a capsule). Off-label for hair loss.) | Same rules as generic dutasteride (after finasteride, men only). | docs |
| [Finasteride, minoxidil and tretinoin topical solution (spray), compounded](https://www.oxfordonlinepharmacy.co.uk/blog/what-is-topical-finasteride-and-minoxidil-spray) | rx-topical-compounded | finasteride unknown; minoxidil unknown; tretinoin unknown | spray (topical solution), 60 ml bottle, about 2 months | men | POM (prescription required, says the blog table); unlicensed special (inferred: no licensed topical finasteride exists in the UK) | unknown (Two search summaries of the same ~2.6-year-old comparison table give different "from" prices (£44.99 and £18.99); £18.99 equals the generic dutasteride from-price, so the row cannot be trusted. Dosing is given as once d…) | unknown; blog posts present it as an all-in-one alternative to separate finasteride and minoxidil. Over 18 only. | docs |
| [Sons Minoxidil 5% solution, 60 ml](https://www.oxfordonlinepharmacy.co.uk/hair-loss/sons-minoxidil-5-solution-for-hair-loss-60ml) | otc-medicine | minoxidil 5% | topical solution | men | Pharmacy medicine (P) (inferred from minoxidil 5% status in the UK) | £28.98 for 60 ml (listing about 3 years old) (£28.98 for one 60 ml bottle, £53.98 for three (snippets of differing ages). GSL/P minoxidil 5%, no prescription.) | Bought from the catalogue; paired with finasteride in a bundle. Consultation route unknown. | docs |
| [Minoxidil 5% solution 60 ml (listing titled "generic Regaine"): probably the same Sons product as p9](https://www.oxfordonlinepharmacy.co.uk/hair-loss/minoxidil-5-solution-for-hair-loss-generic-regaine-60ml) | otc-medicine | minoxidil 5% | topical solution | men | Pharmacy medicine (P) (inferred) | from £21.94 for 60 ml (The URL /hair-loss/minoxidil-5-solution-for-hair-loss-generic-regaine-60ml is titled "Sons Topical Minoxidil 5% Solution for hair loss 60ml" in search results, so p10 is probably an older listing of p9, not a separate p…) | Catalogue purchase; recommended alongside finasteride for first-time men (company pages). | docs |
| [Regaine for Men Extra Strength solution (minoxidil 5%), 60 ml](https://www.oxfordonlinepharmacy.co.uk/hair-loss/regaine-for-men-extra-strength-solution) | otc-medicine | minoxidil 5% | topical solution | men | Pharmacy medicine (P) | £33.60 for 60 ml (the same page's structured data says £28.00) (Triple pack £69.98; 1-year supply (4 × triple packs) £239.95. Prices inconsistent between cached copies.) | First-time male patients: the dutasteride page recommends Regaine plus finasteride 1 mg as the starting point. | docs |
| [Regaine for Women Regular Strength (minoxidil 2%), 60 ml](https://www.oxfordonlinepharmacy.co.uk/hair-loss/regaine-for-women-regular-strength-60ml) | otc-medicine | minoxidil 2% | topical solution | women | Pharmacy medicine (P), licensed for female pattern hair loss in women aged 18–65 | £27.77 for 60 ml (From £27.77 on the women's page; a blog says £27.99.) | Women 18–65 with female pattern hair loss; the company calls topical minoxidil the only licensed treatment for women. | docs |
| [Bundle: finasteride 1 mg (28 tablets) + Sons Minoxidil 5% 60 ml, 1-month pack](https://www.oxfordonlinepharmacy.co.uk/hair-loss/oral-finasteride-sons-topical-minoxidil-1-month-treatment-pack) | bundle | finasteride 1 mg; minoxidil 5% | tablets + topical solution | men | Contains a prescription-only medicine | from £34.99 | Men eligible for finasteride who want the two-drug approach (company says combining works better). | docs |
| [Bundle: finasteride 1 mg (168 tablets) + oral minoxidil 2.5 mg (180 tablets)](https://www.oxfordonlinepharmacy.co.uk/hair-loss) | bundle | finasteride 1 mg; minoxidil 2.5 mg | tablets | men | Prescription-only medicines (minoxidil off-label) | from £169.98 | Men eligible for both finasteride and oral minoxidil (both safety screens passed). | docs |
| [Bundle: finasteride 1 mg (84 tablets) + 3 × Regaine 60 ml + Alpecin shampoo 250 ml](https://www.oxfordonlinepharmacy.co.uk/hair-loss) | bundle | finasteride 1 mg; minoxidil 5% (Regaine, inferred Extra Strength); caffeine shampoo (Alpecin) n/a | tablets + topical solution + shampoo | men | Contains a prescription-only medicine | from £89.99 (Accord version from £99.99) (Listing page may be several years old (indexed about 6 years ago).) | Men eligible for finasteride; a catalogue bundle. | docs |
| [Oxford Female Hair Loss Programme](https://www.oxfordonlinepharmacy.co.uk/female-hair-loss) | service | unnamed oral prescription treatment unknown | online consultation + blood test + oral prescription | women | Prescription service (contents not stated) | £75.99 for the blood test plus 3 months of oral treatment (Blood test (ferritin, TSH, free T4, B12, folate, vitamin D) sent the same day; results decide whether treatment is given or the patient is sent to their GP. The women's page says the consultation asks for photos of the …) | Women with hair thinning (including menopausal). It starts with an online consultation and a blood test to check whether the treatment suits, or whether the GP is the better route. The drug is not named; the company elsewhere says finasteride, dutasteride and oral minoxidil are not supplied to women, so the oral treatment is unknown (spironolactone is a plausible guess but not confirmed). | docs |
| [Regaine for Women Extra Strength scalp foam (minoxidil 5%), 73 ml](https://www.oxfordonlinepharmacy.co.uk/hair-loss/regaine-for-women-scalp-foam-5-extra-strength-73) | otc-medicine | minoxidil 5% | foam | women | GSL/P licensed medicine | £34.80 (Search snippet, age of copy unknown.) | Bought directly without a prescription; no consultation rule known. | docs |
| [Bundle: Regaine for Women 60 ml + Florisene 90 tablets](https://www.oxfordonlinepharmacy.co.uk/hair-loss/regaine-for-women-60ml-and-florisene-90-tablets) | bundle | minoxidil 2%; Florisene (iron, vitamin C, L-lysine food supplement) unknown | solution + tablets | women | GSL/P medicine + food supplement | £40.00 (Page said "currently out of stock" in the indexed copy. Florisene contents are from general knowledge of the brand, not the page (inferred).) | Bought directly; no consultation rule known. Possibly discontinued. | docs |

## 5. Who gets what (5 patient profiles)

- **Baseline man, 32, Norwood 3, no conditions, no previous treatment** → Finasteride 1 mg tablets (generic; Accord pack also listed), Regaine for Men Extra Strength solution (minoxidil 5%), 60 ml, Minoxidil 5% solution 60 ml (listing titled "generic Regaine"): probably the same Sons product as p9, Bundle: finasteride 1 mg (28 tablets) + Sons Minoxidil 5% 60 ml, 1-month pack, Finasteride, minoxidil and tretinoin topical solution (spray), compounded (default: Finasteride 1 mg tablets (generic; Accord pack also listed)). Catalogue model: the man chooses. Company pages steer first-time men to finasteride 1 mg plus Regaine (topical minoxidil); dutasteride is not offered first. Oral minoxidil is sold to men who pass the heart/blood-pressure screen. No live outcome seen. _[docs]_
- **Baseline woman, 38, diffuse thinning** → Oxford Female Hair Loss Programme, Regaine for Women Regular Strength (minoxidil 2%), 60 ml, Regaine for Women Extra Strength scalp foam (minoxidil 5%), 73 ml (default: Oxford Female Hair Loss Programme). Finasteride, dutasteride and oral minoxidil refused. Female programme (£75.99, blood test + 3 months oral treatment) or Regaine for Women 2% solution / 5% foam bought directly. _[docs]_
- **Man asking for dutasteride without 6 months of finasteride** → Finasteride 1 mg tablets (generic; Accord pack also listed) (default: Finasteride 1 mg tablets (generic; Accord pack also listed)). Declined or switched to finasteride, sometimes only after payment. _[docs]_
- **Man with heart disease or low blood pressure** → Finasteride 1 mg tablets (generic; Accord pack also listed), Regaine for Men Extra Strength solution (minoxidil 5%), 60 ml, Minoxidil 5% solution 60 ml (listing titled "generic Regaine"): probably the same Sons product as p9 (default: Finasteride 1 mg tablets (generic; Accord pack also listed)). Inferred: oral minoxidil removed. _[inferred]_
- **Under 18** → nothing offered. Prescription products are for over-18s only. _[docs]_

## 6. The consultation, question by question

### Hair-loss online consultation (not walked; outline from customer reviews only)

Entry: https://www.oxfordonlinepharmacy.co.uk/consultation/23

Not walked (security check). From company pages and reviews: pick a product and pack on a product page ("you need to complete a consultation before you can purchase") → about 3-minute online consultation form (/consultation/23) → registration and payment (payment before prescriber review) → confidential clinical review by a doctor or pharmacist prescriber (may email/phone, ID check, GP blood tests) → dispatch, refund or alternative. No photos needed (company blog). New consultation for every reorder. Women: a separate Female Hair Loss Programme with consultation and blood test.

## 7. Competitive read

**Strengths**

- Very wide range for men: generic and branded finasteride, dutasteride, oral minoxidil (generic and Loniten), a compounded finasteride + minoxidil + tretinoin spray, topical minoxidil and bundles.
- Low, transparent pack prices with no subscription; long packs (168 tablets, 180 capsules) cut the monthly cost.
- Clear safety stance: finasteride-first, off-label documents, GP informed, blood-pressure checks for oral minoxidil.
- Large trust signal (35,000+ Trustpilot reviews, 4.7).

**Weaknesses**

- Payment is taken before the prescriber decides; refusals (dutasteride, early reorders, women) come after checkout.
- Customer chooses the drug; the questionnaire does not appear to recommend or personalise a plan.
- Weak women's offer: oral treatments refused, programme needs a blood test and the drug is not named; pages conflict.
- Only 2.5 mg minoxidil tablets, so patients must split tablets for the usual starting dose.
- New consultation for every reorder.

**Gaps a new competitor could use**

- A guided consultation that recommends a plan (and screens before payment) would beat their pick-then-pay flow.
- Women's hair loss: offer clear licensed and off-label options (topical minoxidil, oral minoxidil low dose, spironolactone) with transparent eligibility.
- Lower-strength oral minoxidil (1.25 mg or less) to avoid tablet splitting.
- Publish the compounded spray strengths and price clearly; Oxford does not.
- Follow-up and progress tracking (photos, check-ins) are not part of their model.

## 8. Experiments run (2)

| Id | Route | What was changed | What happened |
|---|---|---|---|
| probe-hairloss-s2 | hair | None: access check of /hair-loss before experiments | Cloudflare "Performing security verification" page again; no experiments possible. |
| verify-consult | hair | None: stage 3 access check of /consultation/23 | Cloudflare "Performing security verification" page; no experiments possible. |

## 9. Independent verification

Treat this as a desk-research profile, not a tested map of the engine. The Cloudflare check blocked every live and fetch attempt at all three stages, so no answer was ever changed and no screen was seen; every fact comes from search summaries of the company's own pages or from Trustpilot. Within that limit the labels are now honest: nothing claims to be observed or read from code, prices were re-checked and one clear error (generic dutasteride priced as Avodart) fixed, and the main eligibility rule (prescription hair-loss tablets for men only) is well supported. The product list is fairly complete for licensed and OTC items, but prices may be out of date, the compounded spray is barely documented, and the consultation's wording, options and in-form logic remain unknown.

**Re-checked**

- Access: walk.js on /consultation/23 (runs/verify-consult) and WebFetch on /hair-loss: both still blocked (Cloudflare / HTTP 403). No baseline exists to replay; stage 1 and 2 had no live runs either.
- Evidence labels: no product, rule or recommendation is labelled "observed" or "code", so no claim relied on a missing run folder. 0 questions exist, so no option-level claim needed checking.
- p1 finasteride generic prices (28 £13.99, 84 £32.99, 168 £54.99): confirmed by a fresh search summary; 56 £23.99 added.
- p2 Propecia 168 £214.99 (£1.28 each): confirmed; 28/56/84 prices added.
- p3 generic dutasteride price: CONTRADICTED. £39.99 for 30 is Avodart; generic is £18.99 for 30, £83.99 for 180.
- p7 Avodart: 120 at £1.08 each confirmed; 30 £39.99, 90 £113.99, 180 £159.99 added.
- p4 generic oral minoxidil 2.5 mg 30 £22.49 / 180 £114.99: confirmed.
- p6 Loniten 2.5 mg 30 £24.99: confirmed; other packs added.
- p8 compounded spray: 60 ml / 2 months and prescription-only confirmed from blog posts; price and strengths still unknown; no product page found.
- p9 Sons 5% 60 ml £28.98: confirmed. p11 Regaine Men Extra Strength £33.60: confirmed but the same page also shows £28.00. p12 Regaine for Women from £27.77: confirmed (blog £27.99). p13 £34.99 and p14 £169.98 bundles: confirmed. p15 Alpecin bundle £89.99 (blog) / from £99.99 (category page): confirmed as stated.
- R9 (no finasteride, dutasteride or oral minoxidil for women): confirmed again from /consultation/23 and the account-wall summary; raised to high confidence.
- R10 (over 18), R11 (dutasteride after 6 months of finasteride), R12 (partner pregnancy), R13 topics, R14 (BP agreement): the underlying statements were found again in fresh summaries; R12, R13, R14 effects remain untested.
- R1–R8 rest on Trustpilot reviews; not re-checked (stage 1 sources; reviews are single accounts).

**Corrected**

- p3 generic dutasteride: price changed from £39.99 to £18.99 for 30 (the old figure was Avodart's).
- p5: replaced the 2015-review "Regaine foam twin pack" with the current Regaine for Men Extra Strength foam listings (3 × 60 g £59.99).
- p8: price set to unknown (two conflicting "from" figures, one equal to another product's price); noted that no product page was found and dosing conflicts.
- p10: flagged as probably the same Sons 5% product as p9 (its URL is titled Sons in search results).
- p11: noted the conflicting £28.00 price on the same page.
- p16: added price £75.99, blood-test markers and that the consultation asks for hair photos.
- Added p17 Regaine for Women 5% foam (£34.80) and p18 Regaine for Women + Florisene bundle (£40, out of stock).
- Account wall: was unknown; now recorded from the company's own step list (questions → basket → log in or create account → pay), labelled docs, not observed.
- R16 relabelled "inferred" (its effect is a guess). R13 kept "inferred". Added R17 (female programme blood test). R12/R14/R15 wording tightened.

**Still unverified**

- Every question's exact wording and every answer option: nothing was seen live, so flows[0].questions stays empty.
- Whether any answer stops the order in the form itself or only later with the prescriber (R1, R11, R12, R13, R14, R16).
- Strengths and price of the compounded finasteride + minoxidil + tretinoin spray, and whether it is still sold.
- The oral drug in the Female Hair Loss Programme.
- Whether prices are current: search summaries come from cached copies of different ages (some 2–6 years old).
- All Trustpilot-based rules (R1–R8): single customer accounts.

## 10. Limits of this report

- The company's website could not be opened (Cloudflare check, HTTP 403) at stage 1 or stage 2. Product, price and consultation facts come from web-search snippets of the company's own pages, which are summaries of indexed copies of varying age, not the live pages.
- The compounded spray (p8) is confirmed, but its strengths and price are not.
- All findings come from Trustpilot reviews and company replies, paraphrased by a fetch tool that will not quote at length. Reviews are one-sided, unverified and some are years old.
- The 'rules' are prescriber behaviour reported by customers, not engine behaviour seen in a replay. None has been tested.
- Web search was unavailable (shared budget used up), so press, help-centre pages and regulator reports were not found.
- Not every page of each Trustpilot search was read (for example 'finasteride' pages 2 to 4 and 'hair' page 5).
- No one-change experiments were run: the consultation could not be reached. Every option-level effect is untested; rules are labelled docs or inferred.
- No exact question wording or answer options are known, so flows[0].questions is empty; the topics list is a summary only.
- Not tested: every one-change experiment in the protocol (sex, age, pregnancy, heart, blood pressure, liver, kidney, mood, medicines, allergies, previous treatment, preference).
- Stage 3 verification could only compare stage 2 claims with fresh search summaries of the same indexed pages, not with the live site; prices differ between cached copies of different ages.

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
- [Hair loss category](https://www.oxfordonlinepharmacy.co.uk/hair-loss)
- [Hair Loss Treatment consultation (HTTP 403; seen via search snippets)](https://www.oxfordonlinepharmacy.co.uk/consultation/23)
- [Finasteride 1 mg](https://www.oxfordonlinepharmacy.co.uk/hair-loss/finasteride)
- [Dutasteride](https://www.oxfordonlinepharmacy.co.uk/hair-loss/dutasteride)
- [Minoxidil 2.5 mg tablets](https://www.oxfordonlinepharmacy.co.uk/hair-loss/minoxidil-generic)
- [Minoxidil (Loniten)](https://www.oxfordonlinepharmacy.co.uk/hair-loss/minoxidil-loniten)
- [Hair loss treatment for women](https://www.oxfordonlinepharmacy.co.uk/female-hair-loss)
- [What is topical finasteride and minoxidil spray?](https://www.oxfordonlinepharmacy.co.uk/blog/what-is-topical-finasteride-and-minoxidil-spray)
- [Switching from finasteride to dutasteride](https://www.oxfordonlinepharmacy.co.uk/blog/switching-from-finasteride-to-dutasteride)
- [Regaine for Women](https://www.oxfordonlinepharmacy.co.uk/hair-loss/regaine-for-women-regular-strength-60ml)
- [Female hair loss page (search summary)](https://www.oxfordonlinepharmacy.co.uk/female-hair-loss)
- [Generic dutasteride 180 capsules](https://www.oxfordonlinepharmacy.co.uk/hair-loss/dutasteride-0-5mg-capsules-generic-avodart-180)
- [Regaine for Men Extra Strength solution](https://www.oxfordonlinepharmacy.co.uk/hair-loss/regaine-for-men-extra-strength-solution)
