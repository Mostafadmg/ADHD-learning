# Blueprint draft: the value and trust company

Draft written 24 November 2026 for a UK pharmacist independent prescriber who wants to launch a hair-loss service for
men and women. This draft takes one angle: **win on value and trust**. That means winning on the things customers
complain about most: hidden prices, subscription traps, late or missing parcels, products that feel unpleasant,
shedding nobody explained, no way to see progress, guarantees with hidden strings, and no real clinician.

It is built only from the research in this folder. Nothing here is new web research. Every price, dose and rule
names its source file. Anything that is our idea, not a fact, is labelled.

---

## 0. Read this first: how sure is this draft?

### 0.1 Where the evidence is weaker

- **Nothing after any competitor's sign-in wall was watched.** No research account was made. So what a competitor's
  prescriber finally decides, and the price at its real checkout, come from that company's public documents or code.
- **Voy\*, Hers (US)\* and Oxford Online Pharmacy\*** could not be walked live (bot checks). Their facts come from public
  pages, search summaries and (for Voy) an 11-month-old copy of the older Manual app's code. Every point below that
  leans on them carries **\***.
- **Sons† and Ro†** were still in final review when this work began. Their stage 2 data (live replays and code run
  offline) is complete. Points that lean on them carry **†**.
- **XYON‡** was never independently verified. It carries **‡**. This draft barely uses it.
- **Prices were read on 23 and 24 November 2026, during Black Friday.** They move often. Re-check every competitor
  price before using it in public.
- **No wholesale or specials price is in the files.** Every cost of goods below is a labelled planning assumption. Get
  real quotes before you set prices.
- **NICE CKS, the BNF and UKTIS could not be read** by the research machine. Check doses, interactions and pregnancy
  advice there before writing the clinical protocol ([clinical-men 12]; [clinical-women Part 5]).
- **This is a business and clinical design, not legal or tax advice.** The regulation file itself says to take
  regulatory advice before launch ([uk-regulation, Summary 10]).

### 0.2 Labels used in this draft

| Label | Meaning |
|---|---|
| [obs] | Seen live on a competitor's site by the research team |
| [code] | Read in code the competitor's site sends to any visitor |
| [docs] | From the competitor's public pages, leaflets or help centre |
| [sweep] | From `market/uk-sweep.md` or `market/us-intl-sweep.md` (not independently fact-checked) |
| [estimate] | Worked out by us from sourced figures |
| [assumption] | A planning number with no source in the files. Replace it with a real quote |
| [our proposal] | A design choice we recommend. Not a fact |
| [file section] | For example [clinical-men 3.1] means `foundations/clinical-men.md`, section 3.1; [rule-library R1] means rule R1 in `synthesis/rule-library.md` section 5 |

### 0.3 Words used (each is explained again where it first matters)

- **POM (prescription-only medicine):** a medicine that needs a prescription, for example finasteride tablets.
- **GSL (general sale list) medicine:** a licensed medicine anyone can buy in a shop, for example minoxidil 5% foam.
- **Licensed:** the medicine has a UK marketing authorisation for this use.
- **Off-label:** a licensed medicine used for something its licence does not cover. Example: minoxidil tablets are
  licensed for severe high blood pressure, not hair loss.
- **Unlicensed special:** a medicine made up for one patient with no licence at all (also called "compounded").
  UK guidance (MHRA Guidance Note 14, "GN14") says a licensed medicine, even used off-label, comes first. Cost or
  convenience is never a reason for a special ([uk-regulation 1.5]).
- **5-ARI (5-alpha-reductase inhibitor):** the drug family of finasteride and dutasteride. They lower DHT
  (dihydrotestosterone), the hormone that shrinks hair follicles in pattern hair loss.
- **Pattern hair loss:** slow, inherited thinning. In men it hits the temples and crown. In women it widens the
  parting and keeps the front hairline. Women's pattern loss is called **FPHL** (female pattern hair loss).
- **Telogen effluvium (TE):** sudden, all-over shedding that starts about 3 months after a trigger (childbirth, illness,
  crash dieting, a new medicine). It usually recovers by itself ([clinical-women key fact 4]).
- **Propylene glycol (PG):** a solvent in most minoxidil liquids. It is the usual cause of itchy reactions. The licensed
  minoxidil foam contains none ([clinical-men key fact 12]).
- **Engine:** the logic that turns a patient's answers into a decision (stop, warn, remove a medicine, suggest a plan).
- **Sign-in wall:** the first screen that will not let you go on without giving contact details.
- **DMCCA:** the Digital Markets, Competition and Consumers Act 2024. Its subscription rules (reminders, easy exit,
  cooling-off) are expected for new contracts from **1 January 2027**. The regulations were still a draft on
  23 November 2026 ([uk-regulation 6.3]).
- **COGS (cost of goods sold):** what the medicine, bottle and packaging cost us.
- **SmPC (summary of product characteristics):** the official product information for a licensed medicine. It sets
  the licensed doses, ages and the reasons not to use it ("contraindications").
- **The regulators:** the **MHRA** regulates medicines and medicine advertising; the **GPhC** (General Pharmaceutical
  Council) regulates pharmacies and pharmacists; the **ASA** (Advertising Standards Authority) enforces the **CAP
  Code** for adverts; the **CQC** (Care Quality Commission) registers some health services; the **ICO** (Information
  Commissioner's Office) regulates personal data. A **DPIA** is a data protection impact assessment.
- **Blood tests named in this draft:** **FBC** (full blood count, checks for anaemia); **ferritin** (iron stores);
  **TSH** (thyroid test); **testosterone and SHBG** (male-type hormone and the protein that carries it); **U&E**
  (kidney function and potassium); **PSA** (a prostate blood test that finasteride and dutasteride lower).
- **PHQ-2:** two standard questions that screen for low mood.
- **Yellow Card:** the MHRA's scheme for reporting suspected side effects.

---

## 1. Name, promise and who it is for

### 1.1 Working names (pick one, then check it)

| Option | Why it fits the value-and-trust angle |
|---|---|
| **Fairstrand** | "Fair" says the price and terms are fair. "Strand" says hair without naming any medicine |
| **Plainly Hair** | Plain words, plain prices, plain rules. Easy to say and spell |
| **Steady Hair Clinic** | Hair treatment is slow and steady. It also promises a steady price and a steady clinician |

Before choosing, the owner must check each name:

1. **Companies House** name availability (and names that are "too like" an existing company).
2. **The UK trade mark register (UKIPO)**, at least classes 5 (pharmaceuticals), 35 (retail) and 44 (medical services).
3. The web address and social handles.
4. That the name and web address **do not name any prescription medicine**. The MHRA says a web address must not name
   a POM ([uk-regulation 2.2]; [market-economics 6.2]). So no "fin", "minox" or "dutas" in the name or address.

None of these names has been checked. They are suggestions only.

### 1.2 One-line promise

> **Hair-loss care from a named pharmacist prescriber, at one fair monthly price that you can stop at any time.**

The promise is about the **service**, not about hair growing back. UK law does not let an advert promise that a
medicine works ([uk-regulation 2.4], CAP rule 12.19; BCAP 11.23). So the promise never says "results guaranteed".

The four plain commitments behind it [our proposal]:

1. **See your result and the full price before we ask for your name or email.**
2. **One price a month, all-in. No first-order deal, no lock-in, no price that doubles later.**
3. **A named prescriber who answers side-effect messages the same working day.**
4. **Photos at the start, 6 and 12 months, and an honest verdict. If it is not working, we say so and change or stop
   it.**

### 1.3 Who it is for

**For:**

- **Men and women aged 18 or over in England, Scotland and Wales** with slow, gradual thinning (pattern hair loss), or
  with worrying shedding that needs sorting out.
- **People who have been burned by subscriptions:** surprise renewals, price jumps after the first order, hard
  cancelling. Cancelling and unwanted renewals are mentioned in about 35% of negative hair-loss reviews
  ([customer-voice 3.1]).
- **Women,** who are badly served in the UK. Six of the 12 UK companies studied treat men only, and no UK company
  in the set sells spironolactone that can be stepped up ([cross-company 4.9]).
- **People worried about finasteride** who want a balanced talk, follow-up on mood and sexual function, and a real
  non-finasteride route ([customer-voice 3.12]).
- **People whose home life shapes the choice:** a cat (minoxidil on the skin can poison cats), small children, a
  partner who is pregnant, hair that cannot be washed daily ([customer-voice 3.11]; [rule-library M8, M9, F6]).

**Not for (we say so on the first screens, before any contact details):**

- Under-18s (every licence starts at 18) ([rule-library S1]).
- Women who are pregnant, trying to conceive or breastfeeding: advice only, no medicine ([rule-library S3]).
- Anyone with a red flag (painful or scarred scalp, bald patches, eyebrow loss, sudden loss in men, signs of a hormone
  problem in women). They need to be seen in person ([rule-library R1 to R8]).
- **Northern Ireland, at launch.** Pharmacies there are regulated by a different body (the Pharmaceutical Society of
  Northern Ireland), and the research did not cover the rules for posting medicines there ([uk-regulation, Verification
  log, missing item 2]). Take advice before adding it.

---

## 2. The edge: how we beat each competitor, point by point

### 2.1 Our price list in one line (the full list is in section 3)

All prices are per calendar month, all-in (prescriber, every review, photo tracking, messages and tracked delivery).
There is no minimum term and no first-order discount [our proposal].

| What you get | Price a month |
|---|---|
| Finasteride 1 mg tablets alone | **£14** |
| Minoxidil on the scalp alone (men: 5% liquid or foam; women: 5% foam or 2% solution) | **£15** |
| One off-label tablet alone, which needs a prescriber call and extra checks (minoxidil tablets, spironolactone, dutasteride) | **£16** |
| **Any two medicines** | **£24** |
| No hair-loss plan costs more than | **£24** |
| Shedding assessment that ends in "you do not need a medicine" | **£0** |

These prices are proposals. Section 7 shows the margin behind them and what to do if supplier quotes come back high.

### 2.2 The money: what a year costs (men, list prices, 23 to 24 November 2026)

"Year 1" includes each rival's first-order offer where one was seen. Rivals' lowest prices need 6 or 12 months **paid up
front**; ours is paid month by month.

| Plan | Hims UK | Voy\* | Hair + Me | Sons† | Numan | **Us** |
|---|---|---|---|---|---|---|
| **Finasteride 1 mg alone: best list price a month** | £23 (12 months prepaid) [docs/code] | unclear; older pages £23.83 to £28 [docs, OLD] | not sold alone | £22.67 (6 or 12 months) [code] | £20 (annual billing) [obs] | **£14, monthly** |
| **Finasteride alone: one month bought on its own** | £38 (one-off 3-month supply, £114) [docs] | "£44 for month 1" on monthly billing (search summary; unclear which product) [docs] | – | £29 [code] | £34 [obs/code] | **£14** |
| **Finasteride alone: year 1** | £276 [docs] | about £221 (first order "from £13" on 6 months, then the older £23.83) [estimate from docs, OLD] | – | about £218 (£13.60 first-order offer for 6 months, then £136) [estimate from code] | about £200 (£240 annual, less the first-order cap of £40, if it applies to annual billing: not confirmed) [estimate from obs] | **£168** |
| **Finasteride + topical minoxidil: best list price a month** | £30 (12 months, alcohol-free serum) [docs] | £33.17 (6-month billing, search summary) [docs] | £37.91 (compounded; £34.99 every 4 weeks) [obs] | £31.50 (Core Plan, 6 or 12 months) [code] | £28 (12 months) [code/obs] | **£24, monthly** |
| **Same, one month on its own** | £49 (one-off 3 months, £147) [docs] | £44 (monthly billing) [docs] | £37.91 [obs] | £43 [code] | £44 [code/obs] | **£24** |
| **Same, year 1** | £360 | about £313 (£19 a month for 6 months, then £33.17) [estimate from docs] | about £395 (three at £14.99, then ten at £34.99) [estimate from obs] | about £302 (Black Friday first order £18.90 a month for 6 months, then £189) [estimate from code] | about £296 (£336 annual less up to £40; cap on annual not confirmed) [estimate] | **£288** |
| **Year 2 (no offers)** | £360 | about £398 | £454.87 | £378 | £336 | **£288** |

Sources: [products-prices 3.1 to 3.5]; [market-economics, Verification log row 19].

**What this shows.** Month by month, with no prepayment, we are cheaper than all five subscription brands for both men's
plans in the table. Over a full first year we are also cheaper than their first-order deals. From year 2 the gap widens,
because their headline prices are first-order prices and renewals are at list price ([cross-company 4.8]).

**Where we do not win on price, and say so:**

- **Dr Fox** sells finasteride at £7.25 to £14.90 a month and a compounded triple spray at £12 to £13 a month, with
  no subscription ([products-prices 3.2, 3.4]). **Oxford Online Pharmacy\*** sells finasteride at £9.17 to £13.99
  ([products-prices 3.2]). We do not try to match them on a tablet alone. We beat them on care (section 2.8).
- **Hims UK's** compounded chew (finasteride 1.1 mg + oral minoxidil 3 mg + vitamins) is £16.50 a month, but only on a
  6-month plan paid up front (£99). Its monthly chew is £60 ([products-prices 3.5]). We will not sell a fixed-dose
  compounded pill (section 3.8). Our nearest plan (two separate licensed tablets) is £24 a month with no prepayment.
- **Sons'†** own licensed 5% minoxidil spray is £15 a month on a 12-month prepaid plan ([products-prices 3.3]). Our
  scalp minoxidil alone is the same £15, paid monthly. We match that one price; we do not beat it.
- **Hers UK** (Hims UK's women's brand) advertises "from £13 a month", and "£20 with spironolactone" [docs]. Its
  plan prices are shown only after sign-in, so the plan length and product behind "£13" were not seen. We cannot
  claim to beat it until we see its real checkout price.

### 2.3 Hims UK (with Hers UK for women)

| Where Hims UK falls short | Evidence | What we do instead |
|---|---|---|
| The "free hair quiz" changes nothing. All 42 answers were tested; every visitor, even with no hair loss or sudden loss, got "Great news—we have options that may work for you" | [obs], verified ([cross-company 3]) | Every question changes something or is cut. People with no hair loss are told they do not need a prescription. Sudden loss in men stops with a GP route |
| 21 screens, then an email wall. No result, no product, no price before it | [obs] | Result, reasons and full price before any contact details |
| The cheap prices need 6 or 12 months paid up front (£99 to £276); the monthly chew is £60 | [code/docs] | One monthly price, no prepayment, cheaper than its 12-month prepaid price |
| Cancel only by message to support, 48 hours or 3 days before the next order; self-service cancel switched off in the app | [code/docs] | Two-tap cancel in the account, by the same route as joining, up to dispensing. Phone and email work too |
| Flagship products are compounded, one fixed strength each (topical finasteride 0.3% with minoxidil 6% or 7%; a chew with finasteride 1.1 mg + minoxidil 3 mg). One ingredient cannot be stopped alone | [code] | Licensed first. Separate medicines, so a side effect means stopping one thing, not everything. MHRA says finasteride must be stopped at once if depression appears ([clinical-men 9]) |
| Sells minoxidil above 5% (6% and 7%). The only trial of 10% found it worse than 5% and more irritating | [code]; [clinical-men 3.1] | 5% only. We explain why "stronger" is not better |
| Spray pumps that stopped working (3 of the 5 newest reviews on its combo-kit page, 10 to 20 November) | [docs] | Licensed packs; any faulty pump replaced free within 2 working days [our proposal] |
| No guarantee for Hims hair (Hers has 180 days) | [docs] | A plain service promise for men and women alike (section 5.8) |
| No photo step in the quiz; terms say only "you may be asked" | [obs/docs] | A guided photo set from every new patient before the first prescription |
| Hers UK: name asked on the first screen; spironolactone fixed at 44 mg in a compounded capsule (below the usual 50 mg NHS start, no way to step up); oral minoxidil fixed at 1.5 mg | [obs/code] | Women answer anonymously first. Plain spironolactone tablets stepped by the NHS schedule. Oral minoxidil starts at 1.25 mg (half a Loniten 2.5 mg tablet) |
| What Hims does well, and we copy | | Answers kept 7 days, "go back and change", and a "Delete my answers" button ([engines-experience 5.2]) |

### 2.4 Voy\* (formerly Manual)

Voy's real quiz could not be opened (security check). This comparison rests on its pop-ups, public pages, search
summaries, an older app's code and regulator reports. Treat it as weaker.

| Where Voy\* falls short | Evidence | What we do instead |
|---|---|---|
| The pop-up takes an email first, then says "You aren't eligible", with no reason or next step | [obs] (pop-up only) | Stop questions come before any contact details, and every stop gives the reason and a next step |
| Headline prices ("from £13", "from £19") are first-order prices on 6-month plans. The complete plan bills £33.17 a month on 6-month billing, £44 monthly | [docs, search summary] | £24 a month for two medicines, every month, with no offer to expire |
| Sells a 10% minoxidil spray as "extra-strength" | [docs] | 5% only, because 10% did worse in the only trial ([clinical-men 3.1]) |
| Supplies oral minoxidil as an unlicensed capsule though licensed tablets exist | [docs, older pages] | Licensed Loniten tablets, as GN14 expects ([uk-regulation 1.5]) |
| GPhC inspection (March 2026): its prescribing service did not independently verify patients' answers. August 2026: statutory enforcement, partly for unlawful prescription-medicine advertising; standards met again in October 2026 | [uk-regulation 3.5] | Photos, ID with date-of-birth match, a two-way call for every off-label medicine, GP letters, and a second pharmacist checking every prescription |
| 180-day money-back promise with conditions: two online consultations, monthly photos (said to need at least 5 sets), claim between day 180 and 210. Customers report refusals after following the steps | [docs]; [customer-voice 3.2] | No results-based guarantee (the ASA treats those as a promise that a medicine works). A simple service promise with no photo hoops (section 5.8) |
| Side effects are 24% of Manual's negative reviews, including a promised call-back that never came | [customer-voice 3.6] | A separate clinical channel: same-working-day reply from a prescriber, billing paused automatically |
| Women get minoxidil only, strength "set by your clinician" and not published | [docs] | Every strength published. Spironolactone and a shedding (TE) route with blood tests |
| What Voy\* does well, and we copy | | Pause, switch or cancel in the account; delivery promised in under 48 hours; pay only after clinician approval (older terms) [docs] |

### 2.5 Hair + Me

| Where Hair + Me falls short | Evidence | What we do instead |
|---|---|---|
| £34.99 "a month" is billed every 4 weeks: 13 charges a year, £37.91 a calendar month, £454.87 a year | [obs] | Calendar-month billing only. £24 for two medicines |
| £14.99 for the first three deliveries, then £34.99. Reviewers say they did not see the jump | [obs]; [customer-voice 3.4] | No introductory price. The price you see is the price you keep, locked for 12 months |
| No medical answer changes anything; the bag always says "Personalised treatment", with no drug, strength or format named. Even "no hair loss" reaches a prescription bag | [obs], 68 replays | The result screen names the medicine, strength and format, and why. No hair loss = no prescription |
| Red flags (heart disease, an infected scalp, patchy or sudden loss) reach checkout with no message | [obs] | Real stops with reasons, before any payment |
| Every product is compounded; no licensed products at all | [docs] | Licensed first; specials only with a recorded clinical need |
| Untracked Royal Mail parcels; a serum labelled to expire after one month; an annual review asked for 4 days before supply ran out | [customer-voice 3.3, 3.5, 3.16] | Every parcel tracked. Licensed products have long shelf lives (the Regaine 5% solution: 36 months, [clinical-men 3.1]). Reviews start 4 to 6 weeks before supply runs out |
| Format preference not binding: "asked for tablets because of my cat, sent the liquid" (5% of its negatives) | [customer-voice 3.11] | Preferences are asked last, only for options still safe, and honoured or explained |
| Prepaid bundles cannot be cancelled mid-term | [code/docs] | No prepaid bundles to trap anyone |
| What Hair + Me does well, and we copy | | The pet question and pet-friendly option; alcohol-free, PG-free drops as an answer to irritation; a clear finasteride consent screen with an opt-out; two 0 to 10 wellbeing scores from day one ([engines-experience 5.2]) |

### 2.6 Sons†

Sons was still in final review when this work began. Its stage 2 data is complete.

| Where Sons† falls short | Evidence | What we do instead |
|---|---|---|
| Name, email, phone, date of birth and a password before any plan or price | [obs] | Result and price first |
| Never stops or warns a man. "Random patches", "completely bald" and sudden onset change nothing | [obs/code] | Stop, explain, and point to the GP or dermatology |
| "Nearly every day" on its hopelessness question shows no message and no crisis help | [obs] | A crisis screen on the spot (Samaritans, NHS 111, 999) and an offer of a call from a prescriber |
| Removes medicines silently; the reasons sit in a hidden "Debug (Dev Only)" block | [code] | One plain sentence for every removal, on screen |
| Sign up online, cancel by email. A £189 six-month renewal is mentioned again and again. Customers trying to leave were offered 40% then 50% off, which made them feel overcharged | [customer-voice 3.1, 3.4] | Same-route cancel; reminders 7 days before every charge; **no retention discounts**, because everyone already pays our lowest price |
| A customer who reported a side effect was asked whether they wanted to cancel | [customer-voice 3.6] | Side effects go only to a prescriber, never to sales |
| "I don't mind" is treated as "oral capsule" (an unlicensed special) | [code] | "Either" defaults to the licensed option |
| One strength per medicine | [code] | Oral minoxidil 1.25 mg, 2.5 mg or 5 mg from licensed tablets |
| What Sons† does well, and we copy | | It holds licences for its own finasteride and 5% spray (so it sells licensed products); PHQ-2 mood questions; a Spray/Capsule toggle; optional consent to read the NHS Summary Care Record and tell the GP |

### 2.7 Numan

| Where Numan falls short | Evidence | What we do instead |
|---|---|---|
| A man with suicidal thoughts in the past year gets no crisis help, only a quiet switch to minoxidil; the question is skipped if his mental-health medicine dose changed in the last 3 months | [obs] | Always ask; crisis help on the screen; prescriber call; minoxidil never removed for a mood history |
| Product links bypass the safety filter; "I do not wish to be considered for finasteride" is ignored on screen | [obs] | One rule set for every way in. Opt-outs remove the medicine at once |
| "Review your answers" lets anyone change a stopping answer and carry on | [obs] | A stop is final for that consultation; changed answers are shown to the prescriber |
| Regaine solution at £48 to £80 a month, for a product Dr Fox sells at £29 and a supermarket at about £37 a bottle | [obs]; [sweep] | Licensed minoxidil 5% at £15 a month, all-in |
| Billed 3, 6 or 12 months up front; always delivered quarterly | [obs] | Billed monthly or per parcel, same price per month |
| Stock gaps are 14% of its negative reviews | [customer-voice 3.3] | Two wholesalers, buffer stock, and we never offer what we cannot ship (section 5.6) |
| "See results in 180 days or your money back": the ASA treated similar Numan wording as a promise that the medicine works (2024) | [obs]; [uk-regulation 2.5, key fact 14] | A satisfaction promise, not a results promise |
| Men only | [obs] | Men and women |
| What Numan does well, and we copy | | Full offer and every price before sign-in; the only early-shedding warning seen before sign-in in the UK; written clinician instructions behind every risky answer |

### 2.8 Dr Fox

Dr Fox is the honest low-price benchmark. We do not beat it on the price of a finasteride tablet alone. We beat it on
everything around the tablet.

| Dr Fox | Evidence | Us |
|---|---|---|
| Finasteride £7.25 to £14.90 a month; triple spray £12 to £13 a month; no subscription; full total before sign-in; a doctor approves before despatch | [obs] | We cost more for one tablet (£14). For two medicines we cost about the same as its 6-month built bundle (£23.38) and less than its one-month bundle (£34.85) [products-prices 3.5] |
| No diagnosis: no age, pattern, duration or photos | [obs] | Pattern, speed, triggers and a photo set before the first prescription |
| "You can change your answer and continue" on stops | [obs] | Stops are final in that consultation |
| Heart or blood-pressure disease only shows a GP message; Regaine solution still sold | [obs] | High blood pressure removes topical minoxidil unless the prescriber records a reason (SmPC contraindication) |
| A second consultation can put its finasteride spray and finasteride tablets in one basket | [obs] | One safety check across every order |
| No follow-up, tracking, oral minoxidil, dutasteride or women's care | [obs] | Scheduled reviews, photo tracking, a written step-up ladder, and a women's pathway |

### 2.9 The high-street online doctors: Boots, Superdrug, LloydsPharmacy

| | Boots | Superdrug | LloydsPharmacy | Us |
|---|---|---|---|---|
| Finasteride a month | £28 (one month); £20.42 on 364 tablets. First-timers could buy only one month [obs] | £27; £22.83 on 168 tablets [obs/docs] | £34 one-off; £28 subscription; £23 on 6 months [obs] | **£14 monthly** |
| Two-medicine plan | £50.36 one month; £27.87 on 12 months [obs] | not sold as a plan | £31.50 on 6 months, **out of stock** on 23 November but still recommended [obs] | **£24 monthly** |
| Red flags | Nine at once reached the same ID photo and payment screen; refusal only after ID, account and payment [obs] | Men's list never changes; **no mood question for men** [obs] | Best engine in the UK; stops before sign-in; but removals are silent and blunt (any blood-pressure condition removes even the spray) [obs] | Stops before contact details, with reasons |
| Women | None | Regaine and supplements only; Regaine for Women still offered in pregnancy [obs] | None | A full women's pathway |
| Follow-up and tracking | None | None (every supply is a new order) | None | Built in |
| What they do well, and we copy | Pay only if approved; store pick-up | Two photos before ordering for unusual patterns | One question per screen, smart skipping, a real treatment history, crisis signposting | All four ideas |

### 2.10 The edge in five sentences

1. **Cheaper than every subscription brand, month by month, without paying ahead** (section 2.2).
2. **A named, explained result and the full price before contact details, for men and women alike.** In the set
   studied, only four UK companies show a filtered offer with prices before asking who you are (LloydsPharmacy,
   Numan, Treated, Dr Fox), and all four treat men only [cross-company 4.2].
3. **Licensed first, separate medicines, published strengths, 5% minoxidil only.**
4. **A named prescriber, scheduled follow-up, photos and an honest 6- and 12-month verdict.**
5. **Subscription terms built to the 2027 rules from day one:** monthly by default, reminders, same-route cancel, no
   retention discounts, no first-order tricks.

---

## 3. The full product range

### 3.1 Seven rules for the whole range

Each rule fixes a complaint or a failure seen in the research.

1. **Licensed first.** Finasteride 1 mg tablets and minoxidil 5% are the only two medicines licensed in the UK for
   male pattern hair loss; minoxidil 2% solution and 5% foam are the only ones licensed for women
   ([clinical-men key fact 1]; [clinical-women key fact 14]). An unlicensed special is used only with a written
   clinical reason for that one patient. GN14 says cost, convenience or "one bottle is easier" are not reasons
   ([uk-regulation 1.5]). *Why it matters for trust:* distrust of compounded or changed products is about 5% of
   complaints ([customer-voice 3.14]).
2. **Separate medicines, not fixed mixes.** If finasteride causes low mood, the MHRA says stop it at once. With a
   combined pill the patient must stop everything ([clinical-men 9]). Separate medicines also let us change one dose.
3. **Minoxidil never above 5%.** The only trial of 10% found it worse than 5% and more irritating
   ([clinical-men 3.1]).
4. **Every strength is published.** No "personalised treatment" line hiding what is in the box (Hair + Me's bag never
   names the drug [obs]).
5. **Choose by feel, not by price.** For topical minoxidil the patient chooses liquid or foam at the same price, and can
   swap once free in the first 3 months (section 3.7).
6. **Never default to the dearest or strongest option.** "Either" means the licensed first step.
7. **No vitamins or supplements.** They have no proven benefit for hair in people who are not deficient, and biotin can
   give falsely low results on some blood tests, including troponin (a heart-attack test) ([clinical-men key fact 25]).
   Rivals charge £16.50 to £51 a month for them ([products-prices 5.3]).

### 3.2 How the price works (shown in full on every product page)

[our proposal]

- **One medicine:** £14 for finasteride tablets; £15 for minoxidil on the scalp; £16 for an off-label tablet
  (minoxidil tablets, spironolactone, dutasteride). Why the steps differ, in one line each on the page: scalp minoxidil
  costs us more to buy and post than a tablet; off-label tablets need a prescriber call and extra checks.
- **Any two medicines: £24.** Two medicines share one review, one parcel and one set of check-ins, so the second one
  costs us little to add.
- **No hair-loss plan costs more than £24 a month.**
- The price includes: the prescriber, the first review and every follow-up review, photo reviews, messaging, an optional
  10-minute call, tracked delivery and packaging. There are **no** consultation fees, prescription fees or delivery
  fees.
- **Same price per month whether we post monthly or every 3 months.** You pay for what we send, when we send it.
- **Price locked for 12 months from your start date.** After that, any rise needs 30 days' written notice, and you can
  leave before it applies.
- **No first-order discount and no retention discount.** Everyone pays the same lowest price we can offer. This also
  keeps us clear of the regulators: the MHRA says special offers on medicine prices should not be highlighted, and the
  GPhC treated a first-month discount on a prescription medicine at Voy as a failed standard
  ([uk-regulation 2.2, 3.5]).
- **Optional extras at published cost-plus prices:** blood tests (the laboratory's charge plus a flat £10 handling
  fee) and ketoconazole shampoo (only when there is dandruff).

**Worked examples:**

| Plan | Price a month | A year |
|---|---|---|
| Finasteride tablets only | **£14** | £168 |
| Minoxidil 5% foam only (man or woman) | **£15** | £180 |
| Minoxidil tablets only | **£16** | £192 |
| Finasteride + minoxidil 5% liquid | **£24** | £288 |
| Finasteride + minoxidil tablets | **£24** | £288 |
| Women: spironolactone + minoxidil foam or tablets | **£24** | £288 |
| Men, step 3: dutasteride + minoxidil | **£24** | £288 |

### 3.3 Cost of goods: what the files do and do not tell us

The files give **no wholesale or specials prices**. What they do give:

- **A benchmark share.** Cost of sales was 21.8% of revenue at the Skin + Me group (Hair + Me's owner) and 22.5% at
  Hims UK ([market-economics 5.1, 5.5]). Their prices are higher than ours, so our share will be higher.
- **Retail ceilings.** The cheapest UK retail price for the same product. Our cost must be below it.

| Product | Retail ceiling found in the files | Our planning assumption (replace with a quote) |
|---|---|---|
| Finasteride 1 mg, 28 tablets | From £6.95 (pack size not stated) and ten sellers under £11 [sweep]; Dr Fox £10 [obs] | **£3 a month** [assumption] |
| Minoxidil 5% liquid (generic spray or solution) | Sons 5% at £12.50 a month on a 6-month pack (Chemist4U) [sweep]; £14.98 a month at Dr Fox on 6 bottles [obs] | **£6 a month** [assumption] |
| Minoxidil 5% foam (men) | Regaine foam £20.33 a month at Dr Fox on 6 cans [obs] | **£8 a month** [assumption] |
| Minoxidil 5% foam (women, once a day) | Regaine for Women 5% foam £34.80 a pack at Oxford\* [docs]. How long one pack lasts at 1 g a day must be checked on the pack | **£8 a month** [assumption] |
| Minoxidil 2% solution (women) | £25 at Superdrug [obs]; £27.77 at Oxford\* [docs] | **£6 a month** [assumption] |
| Loniten (minoxidil) 2.5 mg tablets | Loniten 60 tablets £50 at one online pharmacy [sweep] | **£4 a month** [assumption] |
| Dutasteride 0.5 mg | £14 a month retail on 180 capsules at Oxford\* [docs]; "from £14.99" at one seller [sweep] | **£4 a month** [assumption] |
| Spironolactone tablets | No anchor in the files | **£3 a month** [assumption] |
| Ketoconazole 2% shampoo | No anchor in the files | **£3 a bottle** [assumption] |
| Packaging, leaflet, label, per parcel | No anchor | **£0.50** [assumption] |

Section 7 shows what happens to margins if these assumptions are wrong.

### 3.4 Men's medicines

#### M1. Finasteride 1 mg tablets

| | |
|---|---|
| **Actives and strength** | Finasteride 1 mg, one tablet a day. Higher doses do not work better ([clinical-men 2.1]) |
| **Form and base** | Coated tablet (generic or Propecia). Some brands contain lactose; the pharmacist picks a brand by its leaflet for men who need to avoid it (company documents say so; **check each SmPC**, [rule-library F11]) |
| **Who it is for** | Men 18 or over with male pattern hair loss, after the mood and sexual-function questions. Trials were in men aged 18 to 41 |
| **Not for** | Women; anyone on dutasteride or finasteride 5 mg; allergy to finasteride; men who had mood or lasting sexual side effects on a 5-ARI before ([rule-library F2, F4, F10]) |
| **UK legal route** | **Licensed medicine used within its licence.** Prescription-only (POM). Comes with the patient alert card the MHRA put in every pack ([clinical-men 10.1]) |
| **Evidence** | **Strong.** +107 hairs vs placebo at 1 year in a 5.1 cm² circle; over 5 years, 48% improved and 42% unchanged on photographs, against 25% improved or unchanged on placebo ([clinical-men key facts 2, 3]) |
| **What to expect** | 3 to 6 months for loss to steady; first photo judgement at 6 months. Gains fade within 9 to 12 months of stopping ([clinical-men 2.1]) |
| **Price and plan** | **£14 a month**, monthly or every 3 months, no minimum term |
| **Expected COGS** | About £3 a month + packaging [assumption, section 3.3] |
| **Why it beats the closest rival product** | Same licensed tablet that Numan sells at £20 to £34, Sons† at £22.67 to £29 and Hims UK at £23 to £38 a month, but £14 with no prepayment, plus mood and sexual-function follow-up the MHRA asks for. Dr Fox and Oxford\* are cheaper for the tablet alone; we add diagnosis, photos and reviews they do not offer |

#### M2. Minoxidil 5%, your choice of liquid or foam

| | |
|---|---|
| **Actives and strength** | Minoxidil 5%. Never higher |
| **Form and base** | Two licensed bases, same price: **(a) liquid** (solution or generic spray): 1 ml twice a day to a dry scalp; contains propylene glycol and alcohol. **(b) foam:** 1 g (half a capful) twice a day; **no propylene glycol** (still contains alcohol) ([clinical-men 3.1]) |
| **Who it is for** | Men with pattern loss who want a scalp treatment, alone or with finasteride. Foam first for men who had itch with a liquid before |
| **Not for** | High blood pressure, treated or not, unless the prescriber records a reason (the licensed solution's SmPC lists it as a contraindication); scalp psoriasis, eczema, sunburn, broken skin or a shaved scalp until settled; true minoxidil allergy; sensitivity to alcohol (both bases contain it) ([rule-library M1, M5, M6]) |
| **UK legal route** | **Licensed medicine.** Liquid: within licence for men 18 to 65. Foam: within licence for men **18 to 49**; for men 50 and over the foam is outside its licence, so the prescriber decides and records why (or uses the liquid) ([clinical-men 3.1]). These are general-sale medicines, which we supply on our prescription as part of the plan |
| **Evidence** | **Strong.** 5% solution: +18.6 hairs/cm² at 48 weeks vs +3.9 on vehicle; foam +21.0 vs +4.3 at 16 weeks ([clinical-men 3.1]) |
| **What to expect** | Extra shedding in weeks 2 to 6 is common and usually means it is working (section 5.4). Allow 2 months or more for growth; stop if no improvement after a year; gains fade 3 to 4 months after stopping |
| **Safety counselling** | Keep children away from the treated scalp and pillow; cats can be poisoned by minoxidil on skin, hands or pillows; flammable, so not while smoking ([rule-library M8, M9, M10]) |
| **Price and plan** | **£15 a month** for either base; **£24** with finasteride |
| **Expected COGS** | About £6 (liquid) or £8 (foam) a month [assumption]. This is our thinnest-margin product (section 7.2) |
| **Why it beats the closest rival product** | Numan sells Regaine solution at £48 to £80 a month and Hims UK at £44 to £51. Sons'† own licensed spray is £15 only on a 12-month prepaid plan (£16.50 on 6 months, £33 for one month): we match its best price monthly. Voy\* sells a 10% spray, Hims UK 6% and 7% compounded mixes: no better than 5% on the evidence and more irritating. Nobody in the set lets a man keep the same drug and change only the base ([products-prices 5.2, item 6]) |

**A trust note we put on the product page [our proposal]:** "Minoxidil 5% is on general sale. You can buy it in a
shop without us. People choose us for the diagnosis, the follow-up and the photo reviews." Telling people this builds
trust and costs us little. It must stay factual and must not compare effects with other products (CAP 12.19).

#### M3. Finasteride + minoxidil 5% (the two-medicine plan)

| | |
|---|---|
| **Actives and strength** | M1 and M2 together, as two separate products |
| **Who it is for** | Men with more than mild loss, or who want the best chance of regrowth from the start ([clinical-men 11, step 1]) |
| **UK legal route** | **Two licensed medicines, each used within its licence.** The finasteride SmPC notes the maker has no data on using the two together ([clinical-men 9]) |
| **Evidence** | **Moderate** for the pair. In 450 men over 12 months, 94.1% improved on both, 80.5% on finasteride alone and 59% on minoxidil alone ([clinical-men key fact 22]) |
| **Price and plan** | **£24 a month** |
| **Expected COGS** | About £9 to £11 a month [assumption] |
| **Why it beats the closest rival product** | Sons'† Core Plan (the same two licensed medicines) is £31.50 on 6 months and £43 for one month; Numan's kit £28 to £44; Hims UK £30 to £49; Voy\* £33.17 to £44; Boots £27.87 to £50.36. Ours is £24 with no prepayment |

#### M4. Minoxidil tablets (low-dose oral minoxidil), from licensed Loniten tablets

| | |
|---|---|
| **Actives and strength** | Minoxidil by mouth: **start 2.5 mg a day; range 1.25 to 5 mg** (international expert consensus; dose figures confirmed only second-hand, so read the full paper before writing the protocol) ([clinical-men 3.2]) |
| **Form** | Loniten 2.5 mg tablet. Its SmPC says the tablet "can be divided into equal halves", so 1.25 mg is a half tablet. A generic 2.5 mg tablet's SmPC says its score line is **not** for breaking, so **we name the Loniten brand** whenever the dose needs halving ([clinical-women 3.2]). 5 mg = two 2.5 mg tablets or one 5 mg tablet |
| **Who it is for** | Step 2: men who cannot keep up twice-daily lotion, whose scalp reacts to both bases, who do not respond to topical, or who have a cat at home and prefer a tablet. Only after a two-way call, a verified blood pressure and pulse, a full medicines list and a GP letter |
| **Not for** | Past fluid round the heart (pericardial effusion), pericarditis, heart failure, pulmonary hypertension with mitral stenosis, phaeochromocytoma (a rare adrenal tumour). With fast or irregular heartbeat, blood pressure below 90/60 or kidney disease: only with GP or cardiology input, which at launch means we refer instead. New patients aged 66 or over: not at launch [our service rule; the SmPC has few data over 65] ([rule-library M2, M3, S6]) |
| **UK legal route** | **Licensed medicine used off-label** (licensed only for severe high blood pressure). The patient is told this in writing |
| **Evidence** | **Moderate.** Two double-blind trials found it about as good as topical 5%, not better. In 1,404 patients: extra body or facial hair 15.1%, fluid retention 1.3%, fast heartbeat 0.9%; 1.7% stopped ([clinical-men key facts 13, 14]) |
| **Price and plan** | **£16 a month** alone; **£24** with finasteride |
| **Expected COGS** | About £4 a month [assumption] |
| **Why it beats the closest rival product** | Sons† (£23.67 to £25.67, 2.5 mg only, unlicensed capsule), Voy\* (£25 to £29.67 on older pages, unlicensed capsule) and Hair + Me (£37.91, compounded) all use unlicensed capsules though licensed tablets exist, which GN14 says should come first. LloydsPharmacy (£23.67 to £29) and Oxford\* (£18.75 to £22.49) sell licensed tablets but at higher prices and with no scheduled follow-up ([products-prices 3.5]) |

#### M5. Dutasteride 0.5 mg capsules (step 3 only)

| | |
|---|---|
| **Actives and strength** | Dutasteride 0.5 mg, one capsule a day. **Replaces** finasteride; never both together |
| **Who it is for** | Men with too little response after 12 months of finasteride plus minoxidil, taken reliably ([clinical-men 11, step 3]). Men who switch to us from another service with a documented 12-month history may qualify sooner |
| **Not for** | Severe liver disease; men trying for a baby; strong CYP3A4 inhibitors such as ritonavir or itraconazole (prescriber call); past mood or lasting sexual side effects on a 5-ARI ([rule-library F2, F5, F9]; [clinical-men 10.2]) |
| **Counselling** | It stays in the body for weeks (half-life 3 to 5 weeks). Use a condom if a partner is or may become pregnant. Sperm count was still 23% down 24 weeks after stopping. It halves the PSA blood test by 6 months, so we tell the GP. A precautionary mood warning applies ([clinical-men key facts 17, 18]) |
| **UK legal route** | **Licensed medicine used off-label** (licensed only for an enlarged prostate) |
| **Evidence** | **Strong for efficacy** (off-label): beat finasteride by 7.1 hairs/cm² at 24 weeks in a network meta-analysis; long-term hair data are thinner than for finasteride |
| **Price and plan** | **£16 a month** alone; **£24** with minoxidil |
| **Expected COGS** | About £4 a month [assumption] |
| **Why it beats the closest rival product** | Treated charges £29.98 to £34.95 a month; Hair + Me and Voy\* sell dutasteride only inside fixed compounded capsules. Oxford\* is cheaper on 6 months (£14) but has no step-up pathway, photo review or follow-up ([products-prices 3.5, 5.2]) |

#### M6. Low-volume finasteride scalp spray (not at launch)

| | |
|---|---|
| **What it would be** | Finasteride about 0.25% in a low-volume spray, once a day, the form tested in the only phase III trial ([clinical-men key fact 19]) |
| **Who it would be for** | Only a man with a **recorded special clinical need** that the licensed tablet cannot meet. A wish for "a spray instead of a pill" is not one under GN14. Not for men who had mood or sexual side effects on a 5-ARI: topical is not a way round the warning ([rule-library F2]; [clinical-men 10.1]) |
| **UK legal route** | **Unlicensed special.** First check whether the finasteride spray licensed in other European countries (sold by ZAVA Germany [sweep]) can be imported as "licensed in its country of origin", which the MHRA ranks above a UK special. Otherwise made by an MHRA-licensed specials manufacturer (Route B) or under the pharmacy exemption in our own registered pharmacy (Route A) ([uk-regulation 1.2, 1.3]; [products-prices 5.1]) |
| **Evidence** | **Moderate** for 0.25% alone (one phase III trial; 45% of hair counts missing); **weak** for compounded finasteride with minoxidil ([clinical-men 8]) |
| **Why not at launch** | It needs a written special-need policy, stability data from the maker, the patient-card information supplied in writing (specials have no card), and legal advice. It must never be advertised. Revisit in phase 3 (section 7.6) |

### 3.5 Women's medicines and care

#### W1. Minoxidil for women: 5% foam once a day, or 2% solution twice a day

| | |
|---|---|
| **Actives and strength** | **Minoxidil 5% foam: 1 g once a day** (do not exceed 1 g a day), **or minoxidil 2% solution: 1 ml twice a day** (maximum 2 ml a day). Applied to a dry scalp, not the hair ([clinical-women 3.1]) |
| **Form and base** | Foam: no propylene glycol, once a day. Once a day may suit women who do not wash daily or who have textured hair (our view; we ask about routine first). Solution: contains propylene glycol. Both licensed. The men's 5% **solution** is contraindicated in women and is not used ([clinical-women 3.1]) |
| **Who it is for** | Women 18 to 65 with a confirmed diagnosis of female pattern hair loss (wider parting, front hairline kept) from the questions **and photos** |
| **Not for** | Pregnancy or breastfeeding ("should not be used"); high blood pressure, treated or not, unless the GP agrees; an abnormal scalp; heart disease or arrhythmia until medical advice is given ([clinical-women 3.1, 4.1 Q22, Q23]) |
| **UK legal route** | **Licensed medicine used within its licence** for confirmed FPHL. Note the licence limit: the foam SmPC says it is "not indicated" with no family history, sudden or patchy loss, or loss after childbirth. So with no family history the prescriber confirms the diagnosis from photos and records why. Use for shedding after childbirth or for traction loss is **off-label** ([clinical-women 3.1]) |
| **Evidence** | **The best evidence for women:** a Cochrane review found minoxidil roughly doubles the chance of noticeable regrowth (157 of 593 vs 77 of 555; risk ratio 1.93), about 13 more hairs per cm² than placebo. Foam once a day gave almost the same gain as 2% twice a day (+23.9 vs +24.2 hairs/cm²), though that trial missed its formal test ([clinical-women key facts 15, 16]) |
| **What to expect** | Shedding may rise in weeks 2 to 6. Foam: stop if no improvement after 24 weeks. Solution: allow 4 months or more; stop if no improvement after a year |
| **Price and plan** | **£15 a month** for either; **£24** with spironolactone |
| **Expected COGS** | About £6 to £8 a month [assumption]. Check how long one foam can lasts at 1 g a day: if two months, the cost a month halves |
| **Why it beats the closest rival product** | Voy\* charges £24 a month on its main page (strength not published); Hair + Me £37.91 for compounded drops; Oxford\* £34.80 for the foam; Superdrug £25 for the 2% (and keeps it on offer in pregnancy). Hers UK's "from £13" could not be checked (section 2.2) |

#### W2. Minoxidil tablets for women (low-dose oral minoxidil)

| | |
|---|---|
| **Actives and strength** | **Start 1.25 mg a day** (half a Loniten 2.5 mg tablet; the expert panel's usual start for women). Range 0.625 to 5 mg. Doses below 1.25 mg need a quartered tablet, which no SmPC supports, so the dose is only approximate: used only with a recorded reason and the woman told so ([clinical-women 3.2]) |
| **Who it is for** | Tier B: women with confirmed FPHL whose scalp cannot tolerate topical, who cannot keep it up, or who do not respond after 6 to 12 months of proper use. Only after a two-way call, a verified blood pressure and pulse, a contraception check and a GP letter |
| **Not for** | Pregnancy, breastfeeding, or possible pregnancy without effective contraception (the SmPC says "not recommended" without contraception); heart conditions listed for M4; blood pressure below 90/60; **any blood-pressure medicine** (women's pathway rule); kidney disease (precaution, refer at launch) ([clinical-women 3.2, 4.1 Q22 to Q27]) |
| **UK legal route** | **Licensed medicine used off-label** |
| **Evidence** | **Limited.** At about 1 mg it has not been shown to beat topical minoxidil; the trials are small and open-label; there is no placebo-controlled trial in women ([clinical-women key fact 18]) |
| **Honest warning we give** | Extra facial hair is **likely**, not rare: 73% of women on 1 mg had facial hair growth when a trial looked for it ([clinical-women key fact 19]). So we ask first whether that would be unacceptable |
| **Price and plan** | **£16 a month**; **£24** with spironolactone |
| **Expected COGS** | About £4 a month [assumption] |
| **Why it beats the closest rival product** | Hers UK's oral minoxidil is a fixed 1.5 mg compounded pill or chew, so it cannot start at 1.25 mg; Hair + Me's are compounded capsules at £37.91; Voy\* does not publish strengths. Ours is a licensed tablet at a published dose |

#### W3. Spironolactone tablets, stepped

| | |
|---|---|
| **Actives and strength** | **NHS dermatology schedule:** start 50 mg once a day for a month; if tolerated and blood tests are normal, 100 mg for a month, then 150 mg, to a maximum of 200 mg. The international PCOS guideline describes 25 to 100 mg a day as the lower-risk range ([clinical-women 3.3]). Check the tablet strengths available in the BNF before writing the protocol |
| **Who it is for** | Women with FPHL and signs of androgen excess (PCOS, unwanted hair, acne), using **effective contraception**, with normal kidney function and potassium. Best combined with minoxidil |
| **Not for** | Pregnancy or trying to conceive; no effective contraception; kidney disease, Addison's disease or a past high potassium; ACE inhibitors, sartans, potassium supplements or salt substitutes, regular NSAIDs, heparin, lithium, digoxin, co-trimoxazole (trimethoprim alone: treat the same until the BNF is checked), eplerenone or other potassium-sparing diuretics, unless the GP agrees and potassium is monitored ([rule-library W1, W2]) |
| **Monitoring** | Kidney and potassium blood test (U&E) before starting in everyone. Repeat potassium after starting and after each dose rise if aged 45 or over, or with kidney, heart or liver disease, diabetes or an interacting medicine, including a pill that contains drospirenone (for example Yasmin: check potassium in the first cycle). Pregnancy and contraception check at every supply ([clinical-women 3.3]; [rule-library W3, W4]) |
| **UK legal route** | **Licensed medicine used off-label** |
| **Evidence** | **Low quality.** 56.6% of women improved in pooled studies (43.2% alone, 65.8% with another treatment); no placebo-controlled trial ([clinical-women key fact 21]) |
| **What to expect** | Mostly stops things getting worse. Most women notice improvement after about 6 months; full effect at 12 to 18 months. Common: sore breasts, irregular periods, dizziness on standing |
| **Price and plan** | **£16 a month** alone; **£24** with any minoxidil. The U&E test is extra at cost plus £10 (section 3.6) |
| **Expected COGS** | About £3 a month [assumption] |
| **Why it beats the closest rival product** | The only anti-androgen for women in the UK set is Hers UK's spironolactone fixed at 44 mg inside a compounded capsule with minoxidil 1.5 mg and vitamins: below the usual 50 mg NHS start, with no way to step up or to stop one ingredient. Nobody in the UK set sells plain spironolactone tablets that can be stepped up ([cross-company 4.9]) |

#### W4. The shedding route (telogen effluvium): no medicine, no charge

| | |
|---|---|
| **What it is** | For sudden, all-over shedding that started about 3 months after a trigger (childbirth, illness with fever, surgery, crash dieting, a weight-loss injection, a new medicine, stopping the pill or HRT). We explain what is happening and how long it usually lasts (sheds for 3 to 6 months; usually recovers without treatment; no cause found in 1 in 3) ([clinical-women key fact 4]) |
| **Blood tests** | Full blood count (FBC), ferritin (iron stores) and thyroid test (TSH) if the shedding has lasted over 6 months, there is no clear trigger, it is severe, or diet or heavy periods raise the risk ([clinical-women 4.2]) |
| **Weight-loss injections** | Hair loss is a listed side effect: 2.5% on semaglutide 2.4 mg and 4.9% on tirzepatide, against 1.0% on placebo; most people recovered while continuing ([clinical-women key fact 25]). No rival asks about these ([cross-company 4.6]) |
| **UK legal route** | Advice only; no medicine. Iron only for proven deficiency (W5) |
| **Price** | **£0** for the questionnaire, explanation and a 3-month photo check-in. Blood tests at cost plus £10 |
| **Why it matters for value and trust** | It is the clearest proof that we do not sell a subscription to everyone. Hair + Me sold a prescription bag even to people with no hair loss [obs]. Telling people "you do not need us" earns referrals |

#### W5. Iron, only for proven low iron

| | |
|---|---|
| **When** | Ferritin below 30 µg/L with normal haemoglobin: iron replacement and a GP letter, and look for a cause (heavy periods, diet). Ferritin 30 to 40 µg/L with shedding: a time-limited iron trial with honest counselling. **Low haemoglobin with low ferritin: refer to the GP** to find the cause (urgent pathway after the menopause); we do not just sell iron ([clinical-women 4.2]) |
| **UK legal route** | A licensed iron product used within its licence. Dose from the BNF (not read by the research; check before launch) |
| **Price** | At cost plus the £10 handling fee, or advise buying it at any pharmacy [our proposal] |

#### What women are never offered online

Finasteride, dutasteride, bicalutamide and cyproterone 50 mg: contraindicated or unsafe, with weak or negative trials
([clinical-women 3.4 to 3.6, key fact 24]). A woman who asks is told why in plain words and offered a dermatology
referral letter.

### 3.6 For men and women

#### B1. Ketoconazole 2% shampoo (only with dandruff)

| | |
|---|---|
| **Who** | Men or women with plain dandruff or seborrhoeic dermatitis (flaky, greasy scale) alongside pattern loss. Not offered as a "hair growth" product |
| **UK legal route** | Licensed pharmacy medicine, used within its licence (for dandruff and seborrhoeic dermatitis) ([clinical-women 3.0]) |
| **Evidence** | **Weak** for hair growth: five small studies, no placebo-controlled hair-count trial ([clinical-men 8]) |
| **Open question** | Whether a rinse-off medicated shampoo counts as "another scalp medicine" under the minoxidil SmPC is not settled. Decide a written rule (for example: use on different days, rinse fully) with the prescriber ([rule-library M7]) |
| **Price** | Cost plus a small handling fee, added to the next parcel [our proposal; price to set after a quote] |

#### B2. Blood tests (only when the answer would change the decision)

| When | Tests | Source |
|---|---|---|
| Women: diffuse shedding, thinning with no clear pattern, or shedding over 6 months | FBC, ferritin, TSH | [clinical-women 4.2] |
| Women: heavy periods, restricted diet, rapid weight loss, weight-loss injection | FBC, ferritin | [clinical-women 4.2] |
| Women: irregular periods, unwanted hair, acne, male-pattern loss | Early-morning testosterone and SHBG (free androgen index); prolactin, FSH and TSH if periods are infrequent. Not on the combined pill (results unreliable) | [clinical-women 2.3, 4.2] |
| Before spironolactone | U&E (kidney function and potassium) | [clinical-women 3.3] |
| Men with typical pattern loss | **None.** For them, tests are mostly marketing ([market-economics 7.5]) | |

- **Before any test, ask about biotin.** It can distort results ([clinical-women 2.4]).
- **How:** a home finger-prick kit or a partner clinic, through an accredited laboratory (choose the partner and
  check its accreditation before launch; not covered by the files).
- **Price:** the laboratory's charge plus a flat £10 handling fee, published on the page [our proposal]. Benchmarks:
  Superdrug sells a hair blood test at £99 [sweep]; Oxford's\* women's programme with tests and 3 months of an unnamed
  treatment is £75.99 [docs].
- **Results always lead to an action** (section 5.5). Only Oxford\* offers hair blood tests in the set; 18 of 19 offer
  none ([cross-company 4.6]).

#### B3. Microneedling protocol (phase 2)

| | |
|---|---|
| **What** | A home microneedling device with a written protocol: weekly, never on the same day as topical minoxidil, with cleaning and stop rules, and photo follow-up ([clinical-men 11, step 2]) |
| **Evidence** | **Moderate** as an add-on to minoxidil: about +13 hairs/cm² over minoxidil alone in a network meta-analysis of small trials ([clinical-men key fact 23]) |
| **UK legal route** | A device, not a medicine. Check device and product-safety rules before selling (not covered by the files). Needle length and technique must come from the trials, read first-hand |
| **Price** | Device at cost plus a small fee. Sons† sells a dermaroller at £14 [docs]; nobody sells the protocol ([products-prices 5.2]) |

#### B4. Free tools for anyone (not only customers)

- **A guided photo tracker** (same angles, an on-screen outline, lighting tips) that anyone can use, including people
  using shop-bought minoxidil.
- **"Shedding or thinning?" explainer** with the trigger timeline.
- **A printable GP summary** for anyone our questions stop, made on their own device from their answers.

These are condition and service tools, not medicine adverts (section 6). They are our cheapest way to earn trust and
to be found.

### 3.7 Products that feel good to use

About 5% of negative reviews complain of greasy or smelly products, 7% of irritation and 7% of faulty sprays
([customer-voice 3.5]). What we do [our proposal unless sourced]:

1. **Choose by feel at the same price.** Liquid or foam for men; foam once a day or 2% solution twice a day for women.
2. **One free swap in the first 3 months** (liquid to foam, or topical to tablet if clinically suitable and after the
   checks). No new consultation fee.
3. **Ask about routine before choosing:** how often you wash, whether you style with products, whether greasy residue
   is a deal-breaker, whether you have textured hair. Residue and styling problems are a recognised reason to choose
   tablets ([clinical-men 3.2], consensus).
4. **Licensed packs with long shelf lives** (the Regaine 5% solution has 36 months ([clinical-men 3.1])) instead of
   compounded bottles that expire after a month (a Hair + Me complaint).
5. **Faulty pump or can:** a free replacement posted within 2 working days, no questions.
6. **Pet and family safety built in:** a cat at home triggers handling advice and an honest look at tablets
   ([rule-library M8]).
7. **An application card and a 60-second video in every first parcel:** dry scalp, how much, how often, wash hands,
   and what itch means.
8. **Itch on a liquid?** Switch to the foam (no propylene glycol). Only a true minoxidil allergy removes all minoxidil
   ([rule-library M5]).

### 3.8 What we deliberately do not sell, and why

| Not sold | Why | Source |
|---|---|---|
| Minoxidil above 5% | 10% did worse than 5% and irritated more | [clinical-men 3.1] |
| Fixed-dose combination capsules or chews | No trial of a fixed combination; cannot stop finasteride alone if mood drops | [clinical-men 9] |
| "Everything in one bottle" lotions (tretinoin, cetirizine, melatonin, caffeine, steroids…) | No trial of such mixtures; more irritation; harder to tell what caused a reaction | [clinical-men 9]; [products-prices 5.1] |
| Oral and topical minoxidil together | No trial; oral was no better than topical head to head | [clinical-men 9] |
| Vitamins, biotin, saw palmetto, rosemary oil | No evidence of regrowth without deficiency; biotin distorts blood tests | [clinical-men 8, key fact 25] |
| Finasteride or dutasteride for women; topical 5-ARIs for women | Contraindicated; risk to a male fetus | [clinical-women 3.4] |
| Latanoprost, topical cetirizine, DNA tests | Insufficient evidence | [clinical-men 8]; [products-prices 5.1] |
| Laser helmets (at launch) | Moderate evidence as an add-on but very expensive; information page only | [clinical-men 8] |

### 3.9 The ladder at a glance

| Step | Men | Women |
|---|---|---|
| 0. Diagnose and set expectations | Pattern, speed, triggers, photos; honest goals | Pattern, speed, triggers, hormones, photos; bloods if indicated; shedding route if TE |
| 1. Licensed first | M1 and/or M2 (M3 for more than mild loss) | W1 |
| 2. Solve what stops step 1 (review at 6 months, sooner for side effects) | Liquid to foam; M4 tablets; microneedling (phase 2) | Foam swap; W2 tablets; W3 spironolactone if androgen signs and contraception |
| 3. Not enough after 12 months of reliable step 1 | M5 dutasteride replaces finasteride | Combine W2 or W1 with W3 |
| 4. Refer | Dermatology if diagnosis in doubt; transplant or clinic options | Dermatology; GP for bloods that point to illness |
| Stop rules (every step) | Low mood on finasteride: stop at once; chest pain, breathlessness, fainting, rapid weight gain or marked swelling on tablets: stop and get medical help | Same, plus any new red flag; pregnancy plans: stop all first |

---

## 4. The consultation engine

### 4.1 Rules the engine itself follows

Each rule fixes a failure seen in the research ([rule-library 5.5]; [engines-experience 6]).

| # | Rule | The failure it fixes |
|---|---|---|
| 1 | **Stop questions first, before any contact details.** Every stop shows the reason in plain words and a named next step (GP, NHS 111, 999, dermatology). No email is ever asked for before a stop | Voy's\* pop-up takes the email, then says "not eligible"; Philip Kingsley demands full registration first |
| 2 | **Every question changes something, or it is cut** | All 42 Hims UK quiz answers changed nothing |
| 3 | **One plain sentence for every removal**, plus what is still possible ("Minoxidil on the scalp is not suitable with high blood pressure. Your prescriber can talk to you about it.") | Silent removals at LloydsPharmacy, Sons† and Superdrug |
| 4 | **Three outcomes, not two:** allowed, not allowed, or "prescriber decides and records why" | Blunt whole-family removals (any blood-pressure answer removing even the spray) |
| 5 | **A stop is final for that consultation.** Starting again is allowed, but the prescriber sees every changed answer | "Review your answers" (Numan), "change your answer and continue" (Dr Fox) |
| 6 | **One rule set for every way in:** adverts, product pages, repeat orders, a second consultation, a returning customer. It checks across orders for duplicates and clashes | Numan's product links bypass its filter; Dr Fox's second consultation puts two finasteride products in one basket |
| 7 | **Opt-outs are honoured at once** | Numan ignores "I do not wish to be considered for finasteride" |
| 8 | **Preferences are asked last,** and only for options still safe | Hair + Me asks drops or capsules before the safety answers that decide them |
| 9 | **Rules run on our server and every rule has an automated test** against its exact answer text, run before every release | Philip Kingsley's blood-pressure rule never fired because of a leading space |
| 10 | **Skip questions that protect a medicine already ruled out** | LloydsPharmacy's good pattern |
| 11 | **Free-text answers are always read by a prescriber** | Free-text boxes no rule reads (Philip Kingsley, Sons†, Strut) |
| 12 | **Privacy by design:** answers are not stored against you until you choose to continue; kept 7 days on your device so you can come back; "Delete my answers" at any time | Hims US stores answers before consent; Hims UK's good 7-day and delete pattern |
| 13 | **Never recommend what we cannot ship** | LloydsPharmacy recommended out-of-stock combination packs |

### 4.2 Action codes used in the tables

| Code | What it does |
|---|---|
| **STOP** | Ends the sale. Shows the reason, where to go next, and a printable GP summary. No contact details asked |
| **STOP + CRISIS** | As STOP, with crisis help on the same screen and an optional number for a same-day call from a prescriber |
| **EXCLUDE** | Removes a medicine from the plan and shows why in one line |
| **ADD** | Adds an option to the plan (for example ketoconazole shampoo) |
| **CHANGE** | Changes a strength or base (for example liquid to foam) |
| **BLOODS** | Orders named blood tests before (or alongside) prescribing |
| **PHOTOS+** | Extra photos needed before any order (everyone gives the standard set after sign-in) |
| **CALL** | A prescriber must speak to the patient (phone or video) before prescribing that medicine |
| **FLAG** | The prescriber sees it with a suggested action and records the decision |
| **COUNSEL** | Carry on; show the advice on screen and in writing in the parcel |
| **RECORD** | Stored as a baseline for later reviews |
| **ROUTE** | Sends the patient to another pathway (women's, shedding/TE, traction) |

### 4.3 The journey and where sign-in comes

```
Welcome  →  A. Gates  →  B. Red flags and wellbeing  →  C. What is happening (diagnosis)
         →  D. Hormones (women)  →  E. Health and medicines  →  F. DHT-blocker questions (men)
         →  G. Preferences and routine  →  RESULT (plan, reasons, full price, next steps)
         ════════════════  SIGN-IN WALL (only now: name, email, phone)  ════════════════
         →  H. Identity, GP, photos, readings, consents, card saved  →  Prescriber review
         →  Card charged only on approval  →  Tracked parcel
```

**Welcome screen (before any question):** "This takes about 5 minutes. You will see your result and the full price
before we ask for your name or email. If we cannot help you, we will say so straight away and tell you where to go.
Your answers stay on this device for 7 days unless you delete them." It also names the lead prescriber (name, photo,
GPhC number, "pharmacist independent prescriber"), as the GPhC requires on the website ([uk-regulation 3.2]).

**Screens are grouped.** Checklists with a "None of these" button share a screen. Target: about 20 screens and
5 minutes for a typical man, about 25 screens for a typical woman [our proposal; test it in the pilot]. Easy sign-up is
21% of praise ([customer-voice 4]), so the typical case must stay fast while the unusual case is stopped.

### 4.4 Stage A: gates (everyone, first)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| A1 | Your date of birth | Date | **Under 18:** STOP ("We can only treat adults. Please see your GP"). **18 to 49:** continue. **50 to 65 (men):** continue; men's foam is outside its licence, so the liquid is offered first (CHANGE) and foam needs a recorded reason. **66 or over:** continue with FLAG: topical minoxidil is outside its licence, so the prescriber decides, records why and tells the GP; minoxidil tablets not offered to new patients at launch | Every licence starts at 18; men's solution 18 to 65, men's foam 18 to 49, women's products 18 to 65; few oral minoxidil data over 65 ([rule-library S1, S6]) |
| A2 | Sex registered at birth (and, optionally, how you describe your gender, so we use the right words) | Male / Female | **Male:** men's route. **Female:** women's route (never a stop). **Anyone on gender-affirming hormones:** FLAG and CALL, because the research files do not cover this; take specialist advice before writing rules | Finasteride, dutasteride and the men's 5% solution are contraindicated in women ([rule-library S2]) |
| A3 | Where will we post your treatment? | England, Scotland or Wales / Northern Ireland / outside the UK | **GB:** continue. **Northern Ireland:** STOP at launch, with an explanation and a waiting list. **Outside the UK:** STOP | NI rules not researched ([uk-regulation, Verification log, missing 2]) |
| A4 | (Women) Are any of these true? | Pregnant / Trying to get pregnant or having fertility treatment / Breastfeeding / Had a baby in the last 12 months and not breastfeeding / None | **Pregnant, trying or breastfeeding:** STOP medicines. Show advice, the shedding explainer and "come back when you are ready". **Baby in the last 12 months:** continue; shedding after childbirth is likely (ROUTE to TE checks in C3, C4); licensed minoxidil is "not indicated" for loss due to childbirth, so any use is off-label (FLAG) | Topical minoxidil "should not be used during pregnancy or lactation"; oral options and anti-androgens are worse ([rule-library S3]; [clinical-women 3.1, 3.12]). Asked as separate options, unlike Hair + Me's one lumped question |
| A5 | (Women) Could you become pregnant? | Yes / No, after the menopause (no period for 12 months) / No, sterilised or hysterectomy / No, another reason (free text) | **Yes:** ask A6. **No:** skip A6; FLAG the free-text reason | Anti-androgens can feminise a male fetus ([clinical-women key fact 23]) |
| A6 | (Women) Which contraception do you use? | None / Condoms only / Natural methods / Combined pill / Progestogen-only pill / Implant / Injection / Hormonal coil / Copper coil / Partner's vasectomy / Other | **None, condoms only or natural methods:** EXCLUDE minoxidil tablets and spironolactone (topical still possible). **Others:** keep; the prescriber confirms the method is effective [our proposed rule; check against current contraception guidance, not covered by the files]. **Combined pill:** RECORD (androgen blood tests are unreliable on it) | Oral minoxidil "not recommended" without contraception; anti-androgens need effective contraception ([rule-library S4]; [clinical-women 2.3, 3.2, 3.3]) |

### 4.5 Stage B: red flags and wellbeing (everyone)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| B1 | Do any of these describe your scalp now? (tick all) | Pain, burning or tenderness / Spots, pus or crusts / Redness with scale around the hairs / Smooth, shiny areas where no hair grows / Flakes or dandruff only / Diagnosed scalp psoriasis or eczema / Sunburn or broken skin / None | **First four:** STOP ("This needs to be seen in person, soon. Some types of hair loss scar and become permanent"). **Dandruff only:** continue; ADD ketoconazole shampoo. **Psoriasis, eczema, sunburn, broken skin:** EXCLUDE scalp minoxidil until settled; treat the scalp first; tablets may be considered | Scarring loss is permanent ([rule-library R1]); scalp disease is a minoxidil contraindication ([rule-library M6, M7]) |
| B2 | Any of these? (tick all) | Round or oval bald patches / Eyebrow or eyelash loss / Patches in the beard / Hair loss from the body / None | **Any:** STOP and refer to the GP or dermatology | Alopecia areata, fungal infection, frontal fibrosing alopecia: not pattern loss ([rule-library R2, R3]) |
| B3 | (Women) Is your front hairline, or the hair at your temples, moving back? | Yes / No | **Yes:** STOP and refer (lost hair here does not regrow) | Frontal fibrosing alopecia until proven otherwise ([clinical-women key fact 5]) |
| B4 | How did it start? | Slowly, over months or years / Over a few weeks / Suddenly, over days | **Men, weeks or days:** STOP, show the shedding explainer and a GP summary (blood tests may be needed). **Women, weeks or days:** continue to the shedding (TE) checks in C3 and C4 | Minoxidil product information excludes sudden loss ([rule-library R3, R4]) |
| B5 | How much hair is left on top? (pictures) | Picture choices from mild to "very little or none on top" / "Completely bald everywhere" | **Very little on top:** COUNSEL with an honest screen: "Medicine mainly helps keep the hair you have. With very little left on top it is unlikely to bring much back." Options: keep what is at the sides, transplant or cosmetic options; may still continue. **Completely bald everywhere:** STOP | Copies Keeps' "Mostly Scalp" and LloydsPharmacy's expectation screens; complete loss is not for remote treatment ([engines-experience 4.1]; [rule-library R3]) |
| B6 | (Women) In the last year, any of these, especially if fast? | Deeper voice / Lots of new face or body hair / Much more muscle / Periods stopped (not menopause) / None | **Any:** STOP and refer urgently | Possible androgen-secreting tumour ([rule-library R5]) |
| B7 | Any of these lately? | Weight loss without trying / Fevers / Night sweats / Joint pains / A new rash / Extreme tiredness / None | **Any:** STOP and refer to the GP | Possible illness elsewhere in the body ([rule-library R8]). The rule set is written for women; we ask men too as a cautious addition |
| B8 | (Men) Any breast lump, pain, swelling or nipple discharge? | Yes / No | **Yes:** STOP; see the GP | Male breast cancer has been reported on finasteride ([rule-library R7]) |
| B9 | Thoughts of ending your life or harming yourself? | Never / More than a year ago / In the past year / In the last 2 weeks or now | **Last 2 weeks or now:** STOP + CRISIS: Samaritans (116 123), NHS 111, 999 in an emergency, and "leave a number and a prescriber will call you today" (optional). It cannot be clicked past. **Past year:** CALL before any finasteride or dutasteride; minoxidil is **not** removed. **More than a year ago:** FLAG; CALL before a 5-ARI. This question is **never skipped**, whatever other answers say | Never a quiet product swap ([rule-library R6, F1]); Numan skips this question after a recent dose change and gives no crisis help [obs] |
| B10 | Is hair loss badly affecting your mood or daily life? | Not really / Somewhat / A lot | **A lot:** show support information; FLAG; offer a call | ([clinical-women 4.1 Q11]) |
| B11 | (Men, while a 5-ARI is still possible) Over the last 2 weeks, how often: little interest or pleasure in doing things? Feeling down, depressed or hopeless? (the two PHQ-2 questions) | Not at all / Several days / More than half the days / Nearly every day | **Either answer "more than half the days" or "nearly every day":** CALL before any 5-ARI; offer a minoxidil-only plan now; show support information [our proposed threshold; the MHRA asks prescribers to ask and decide with the patient, not to block] | MHRA ask-and-decide ([clinical-men 10.1]); Sons† uses PHQ-2 well |
| B12 | (Men, while a 5-ARI is still possible) Have you ever been diagnosed with depression, anxiety or another mental health condition? | No / Yes, in the past / Yes, now | **Yes:** CALL before any 5-ARI; minoxidil never removed for this | ([rule-library F1, 5.4]); Treated and Philip Kingsley over-block minoxidil |

### 4.6 Stage C: what is happening (diagnosis)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| C1 | What is bothering you most? | My hair is slowly getting thinner / More hair is falling out than usual / Both / I'm not losing hair; I want to prevent it | **Not losing hair:** END politely: "You do not need a prescription now." Offer the free photo tracker. **Falling out (women):** ROUTE to TE checks. **Others:** continue | Hims UK and Hair + Me sold to people with no hair loss [obs] |
| C2 | Where is it happening? (pictures, tick all that apply) | **Men:** temples or hairline / crown / all over the top / all over including the sides and back / none of these fit. **Women:** wider parting, front hairline kept / all-over shedding / temples and crown, like a man's pattern / edges where hair is pulled / a patch in the middle of the crown spreading out, in tightly curled hair / none of these fit | **Men, sides and back, or none fit:** PHOTOS+ before any order and CALL (not a typical pattern). **Women, male-type pattern:** BLOODS (testosterone and SHBG) and refer. **Women, edges where pulled:** ROUTE to traction care. **Women, crown patch in curled hair:** STOP and refer (possible central centrifugal cicatricial alopecia, a scarring type). **Women, none fit:** PHOTOS+ and CALL | Superdrug's good pattern of photos for unusual patterns; ([clinical-women 4.1 Q15]) |
| C3 | How long has it been going on? | Under 6 months / 6 to 12 months / 1 to 5 years / Over 5 years | **Women shedding under 6 months:** TE likely: explain; BLOODS (FBC, ferritin, TSH) if no clear trigger or severe; no prescription. **Women shedding over 6 months:** BLOODS (FBC, ferritin, TSH); consider FPHL as well; refer if no cause. **Men:** RECORD | ([clinical-women 4.1 Q13]) |
| C4 | In the 6 months before it started, did any of these happen? (tick all) | Had a baby or a pregnancy ended / Illness with fever, including COVID-19 / An operation / A big life stress / Fast weight loss or a strict diet / A weight-loss injection (for example semaglutide or tirzepatide) / A new medicine or a dose change / Started or stopped the pill or HRT / None | **Any, with shedding:** ROUTE to the shedding (TE) route: timeline and reassurance, no medicine. **Weight-loss injection:** explain it is a known, usually temporary cause. **New medicine:** "Speak to the person who prescribes it; do not stop it yourself." **Very strict diet:** FLAG; think about an eating disorder and refer kindly. **Men, slow thinning plus a trigger:** FLAG (both can happen together) | Nobody in the set asks this as a timing question ([cross-company 5]); ([clinical-women 4.1 Q14, 3.13]) |
| C5 | Has anyone in your family had thinning hair? | Mother's side / Father's side / Both / No / Don't know | **Women, "No":** FLAG: the prescriber confirms the pattern from photos and records why before licensed minoxidil (its SmPC says "not indicated" without family history). **Men:** RECORD | ([clinical-women 3.1, 4.1 Q17]; [rule-library 5.4]) |
| C6 | How do you usually wear your hair? (tick all) | Tight ponytail or bun / Braids, weaves or extensions / Chemical relaxers / None of these | **Any:** COUNSEL on traction. **Women with edge loss (C2):** traction care: stop the pulling first; minoxidil is optional and off-label for traction (prescriber decision); refer if no regrowth after about 3 months free of tension, or shiny skin | ([clinical-women 1.7, 4.3]) |
| C7 | Have you used any of these before? For each one ticked: for how long, did you use it regularly, did it help, any side effects? | Finasteride tablets / Finasteride on the scalp / Minoxidil liquid / Minoxidil foam / Minoxidil tablets / Dutasteride / Spironolactone / Other / None | **Minoxidil under 6 months:** "Too early to call it a failure." **Itch or rash with the liquid only:** CHANGE to foam. **Reaction to foam as well, or swelling or hives:** EXCLUDE all minoxidil on the scalp; FLAG for possible true allergy. **Mood change or lasting sexual effects on a 5-ARI:** EXCLUDE every 5-ARI, tablet and scalp. **12 months or more of finasteride plus minoxidil, used reliably, not enough:** CALL; consider dutasteride (step 3). **Swelling, palpitations or breathlessness on minoxidil tablets:** EXCLUDE tablets; FLAG. **Still getting treatment elsewhere:** CALL to plan a safe handover (no double supply) | A real treatment history (LloydsPharmacy's good pattern); ([rule-library F2, M5]; [clinical-women 4.1 Q32]) |

### 4.7 Stage D: hormones (women only)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| D1 | Your periods | Regular / Irregular / Stopped: menopause / Stopped: other reason / None because of my contraception | **Irregular, or stopped for another reason:** BLOODS (early-morning testosterone and SHBG; add prolactin, FSH and TSH if periods are infrequent); GP letter. Not tested on the combined pill | ([clinical-women 4.1 Q18, 2.3]) |
| D2 | Do you have acne, unwanted hair on your face, chest or tummy, or diagnosed PCOS (polycystic ovary syndrome)? | Acne / Unwanted hair / PCOS / None | **Any:** BLOODS (testosterone and SHBG). **PCOS:** GP letter (diabetes and heart checks belong with the GP). Spironolactone becomes an option if A6 shows effective contraception | ([clinical-women 4.1 Q19]) |
| D3 | HRT (hormone replacement therapy)? | No / Yes, steady / Started in the last 6 months / Stopped in the last 6 months | **Recently stopped:** may explain shedding (TE). We never change HRT for hair | ([clinical-women 4.1 Q20, 3.9]) |
| D4 | (After the menopause) Any new face or body hair? | Yes / No | **Yes:** BLOODS and refer | ([clinical-women 4.1 Q21]) |

### 4.8 Stage E: health and medicines (everyone; rows marked where only one sex is asked)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| E1 | Your blood pressure | Never told it is high / High, treated / High, not treated / Low, or I faint or feel dizzy when I stand / Not sure | **High (treated or not):** EXCLUDE scalp minoxidil unless the prescriber records a reason (for example the GP agrees). **Men:** minoxidil tablets only after a CALL with a verified reading and full medicines list. **Women on any blood-pressure medicine:** EXCLUDE minoxidil tablets. **Low or fainting:** EXCLUDE minoxidil tablets (refer at launch); scalp minoxidil **not** removed; COUNSEL on dizziness. **Not sure:** a reading (pharmacy or a validated home monitor) is needed before any minoxidil [our cautious rule] | High blood pressure is a contraindication in the licensed solution's SmPC; low blood pressure is a precaution for tablets only ([rule-library M1, M3, M4, 5.4]) |
| E2 | Heart (tick all) | Heart failure / Fluid round the heart or pericarditis, ever / Fast or irregular heartbeat / Chest pain or angina / Heart attack or stent / High pressure in the lungs with a narrowed heart valve / None | **Heart failure, fluid round the heart, pericarditis, lung pressure with narrowed valve:** EXCLUDE minoxidil tablets. **Fast or irregular heartbeat:** tablets only with GP or cardiology input (refer at launch). **Any heart condition:** scalp minoxidil only after a CALL | Consensus contraindications and precautions ([rule-library M2, M3]; [clinical-women 4.1 Q23]) |
| E3 | Ever had a phaeochromocytoma (a rare adrenal gland tumour that raises blood pressure)? | Yes / No | **Yes:** EXCLUDE minoxidil tablets | ([rule-library M2]) |
| E4 | Kidney, liver or adrenal problems (tick all) | Kidney disease or dialysis / Liver disease / Addison's disease / Told my potassium was high / None | **Kidney:** EXCLUDE minoxidil tablets (precaution; refer at launch) and spironolactone. **Severe liver disease:** EXCLUDE dutasteride; CALL for any tablet. **Addison's or high potassium:** EXCLUDE spironolactone | ([rule-library M3, F9, W1]) |
| E5 | Allergies or reactions (tick all) | Minoxidil (then: "What happened, and with which product?") / Finasteride / Propylene glycol / Alcohol (ethanol) on the skin / Lactose or galactose problems / Other / None | **Minoxidil:** as C7 (liquid only = CHANGE to foam; true allergy = EXCLUDE all minoxidil). **Finasteride:** EXCLUDE every finasteride product. **Propylene glycol:** foam only. **Alcohol:** EXCLUDE licensed scalp minoxidil (both bases contain it); tablets may be considered. **Lactose:** the pharmacist picks a tablet brand by its leaflet (check SmPCs) | ([rule-library M5, F10, F11]; [clinical-men 3.1]) |
| E6 | Medicines you take (tick all, then a free-text box a prescriber always reads) | Any blood-pressure tablet / Finasteride 5 mg or dutasteride (for the prostate) / ACE inhibitor or "sartan" / Potassium tablets or a potassium salt substitute / Anti-inflammatory painkillers most days / Heparin injections / Lithium / Digoxin / Co-trimoxazole or trimethoprim / Eplerenone or another "water tablet" that keeps potassium / A pill with drospirenone (for example Yasmin) / Ritonavir or itraconazole / A steroid, tretinoin or other medicine on the scalp / Low-dose aspirin / A weight-loss injection / None | **Blood-pressure tablet:** men CALL before minoxidil tablets (more people stop on doxazosin or on three or more); women EXCLUDE minoxidil tablets. **Finasteride 5 mg or dutasteride:** EXCLUDE every 5-ARI; minoxidil only; GP letter. **ACE inhibitor, sartan, potassium, NSAIDs, heparin, lithium, digoxin, co-trimoxazole or trimethoprim, eplerenone:** EXCLUDE spironolactone unless the GP agrees and potassium is monitored. **Drospirenone pill:** spironolactone allowed; potassium check in the first cycle. **Ritonavir or itraconazole:** CALL before dutasteride. **Scalp medicines:** hold scalp minoxidil (they raise absorption; SmPC says not to combine). **Low-dose aspirin:** COUNSEL (one small study suggests it may blunt the response). **Tirzepatide and the pill:** COUNSEL (the Mounjaro SmPC advises a non-oral or extra barrier method for 4 weeks after starting and each dose rise) | ([rule-library M4, F4, W2, W3]; [clinical-men 3.1, 10.2]; [clinical-women 3.3]) |
| E7 | Supplements | Biotin or "hair vitamins" / High-dose vitamin A / Selenium / Others / None | **Biotin:** COUNSEL: tell us before any blood test, because it can distort results. **High-dose vitamin A or selenium:** advise stopping | ([clinical-women 4.1 Q29, 2.4]) |
| E8 | (Women) Any of these? | Vegetarian or vegan / Very low-calorie diet / Heavy periods / Bowel disease (for example coeliac or Crohn's) / Weight-loss surgery / None | **Any:** BLOODS (FBC and ferritin) | ([clinical-women 4.1 Q30]) |
| E9 | Who shares your home, bed or pillows? (tick all) | A cat / A dog / A baby or young children / None of these | **Cat or dog:** COUNSEL (minoxidil on skin, hands and pillows can poison cats; wash hands; keep pets off pillows); show the tablet option honestly if clinically suitable. **Children:** COUNSEL (keep them away from the treated scalp and pillow) | Cat poisonings reported; infant hair growth after contact ([rule-library M8, M9]) |
| E10 | Do you smoke? | Yes / No | **Yes:** COUNSEL: liquid and foam are flammable; never apply while smoking. Not a block | ([rule-library M10, 5.4]) |
| E11 | (Only if tablets are still possible) Your weight | Number | RECORD as a baseline: fast weight gain on minoxidil tablets is a stop sign. Never a block | ([rule-library 5.4]) |

### 4.9 Stage F: DHT-blocker questions (men, only while finasteride or dutasteride is still possible)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| F1 | Finasteride is a daily tablet that blocks DHT. Would you consider it? (A "Tell me more" link opens a balanced page: how well it works, the MHRA warnings on mood and sexual side effects, and that effects can sometimes last after stopping) | Yes / I'd rather not / Not sure: I'd like to talk first | **"I'd rather not":** EXCLUDE every 5-ARI at once; skip F2 to F4; show minoxidil-only plans. **"Talk first":** CALL before any 5-ARI | Honour opt-outs ([rule-library E4]); balanced information as the MHRA asked of Sons† in 2021 ([customer-voice 3.6]) |
| F2 | Your sex life now (three short questions: sex drive, erections, ejaculation) | Normal / Some change / A big problem | RECORD all three as a baseline. **Any "big problem":** CALL; offer minoxidil only if he prefers | Needed to judge any later change; not a contraindication ([rule-library F3]). No company records a baseline ([cross-company 5]) |
| F3 | Children | Trying for a baby now, or fertility treatment / Planning one in the next year / Partner is pregnant or may be / None of these | **Trying or fertility treatment:** CALL; EXCLUDE dutasteride; finasteride by shared decision. **Partner pregnant:** tablets: COUNSEL (she must not handle crushed or broken tablets); dutasteride: condom; finasteride on the scalp: EXCLUDE | ([rule-library F5, F6]) |
| F4 | Prostate (tick all) | I have PSA blood tests or prostate checks / Prostate cancer, ever / Trouble passing urine / None | **PSA tests:** COUNSEL and GP letter (finasteride lowers PSA; doubling the result "should be considered"). **Prostate cancer:** CALL; GP or urologist agreement before any 5-ARI. **Trouble passing urine:** suggest a GP check (our cautious addition, not in the rule set) | ([rule-library F7, F8]) |

### 4.10 Stage G: preferences and routine (asked last; only options still allowed are shown)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| G1 | How would you like to treat it? | Tablet / On the scalp / Both / Either: suggest the best first step | **Either:** the licensed first step (finasteride and/or minoxidil 5% for men; minoxidil 5% foam or 2% solution for women). Choices are honoured or the reason is shown | Never default to the dearest or unlicensed option (Sons'† "I don't mind" = capsule) |
| G2 | Your routine (tick all) | I wash my hair daily / Every 2 to 3 days / Once a week or less / I style with products / Greasy residue would put me off / I have tightly curled or textured hair | **Washes less often, or textured hair:** suggest the once-daily foam (women) or foam (men). **Residue would put me off:** foam first; tablets explained as a possible later step (men), decided at a call | Product-feel complaints ([customer-voice 3.5]); residue is a recognised reason for tablets ([clinical-men 3.2]) |
| G3 | Would extra hair on your face or body be a problem for you? | Yes / No / Not sure | **Yes:** prefer scalp treatment; avoid or keep tablet doses low | Facial hair in up to 73% of women on 1 mg when looked for ([rule-library M11]) |
| G4 | What would you be happy with after a year? | Keep what I have / Slow the loss / Regrow some hair / Not sure | Sets the honest-expectations text on the result screen: the main aim is to stop further loss; regrowth is modest; judge at 6 to 12 months | ([clinical-men 11, step 0]) |

### 4.11 The result screen (before sign-in)

What the patient sees, in this order [our proposal]:

1. **"What we think is happening":** for example, "This looks like male pattern hair loss at the crown and temples,
   going slowly." Marked "provisional: your prescriber confirms this from your photos".
2. **"What we suggest, and why":** each medicine with its strength, form and how to use it, plus one line linking it to
   their answers ("You have a cat, so we suggest the foam and explain how to keep your cat safe").
3. **"What we have ruled out, and why":** one plain line each.
4. **"What it costs":** the monthly price from the formula, what it includes, no minimum term, and "you pay nothing until a
   prescriber approves".
5. **"What happens next":** account, ID, GP details, a 5-minute photo set; for tablets, a blood-pressure reading and a
   10-minute call; for some women, blood tests. With honest timings.
6. **"What to expect":** the first-year timeline, with the early-shedding warning in plain words (section 5.4).
7. **Buttons:** "Continue" (to sign-in) · "Talk to a prescriber first" (a free 10-minute call) · "Email me this
   result" (optional) · "Delete my answers".

**Stop screens** show: what we think may be happening (without diagnosing), why remote treatment is not right, where to
go (GP, urgent GP, dermatology, NHS 111, 999), and a **printable GP summary** of their answers, made on their own
device. No email is asked for.

### 4.12 After sign-in

| Step | What happens | Why |
|---|---|---|
| H1 Account | Name, email, mobile, password. Date of birth entered again and must match A1 | Catches mistakes and gaming (Happy Head's good pattern) |
| H2 Identity check | Photo ID or a database check. The system flags multiple accounts, shared cards, the same address on many orders, and orders that are too big or too frequent | GPhC distance guidance ([uk-regulation 3.2 (b)]) |
| H3 GP details and consent to share | Yes or no. **No:** licensed scalp minoxidil at most, with the decision recorded. Optional consent to view the NHS Summary Care Record as a verification route (check the access route before launch) | ([rule-library S7]; [uk-regulation 3.2 (c)]) |
| H4 Photo set (everyone) | Guided, with an outline on screen. **Men:** hairline with hair pulled back, both temples, crown from above, top from above, any patch. **Women:** parting from above, front hairline pulled back, both temples, crown, eyebrows, close-up of any sore area. If photos do not match the answers: refer | Diagnosis and baseline ([clinical-women 1.1]; [engines-experience 6, lesson 7]) |
| H5 Blood pressure and pulse (tablets only) | From a pharmacy, GP or a validated home monitor (photo of the display). Below 90/60 or a fast or irregular pulse: no minoxidil tablets | A remote service cannot examine; this is stricter than the consensus on purpose ([clinical-women 3.2]) |
| H6 Contraception confirmation (women, tablets or spironolactone) | Confirm the method; agree to a pregnancy and contraception check at every supply | ([clinical-women 4.4]) |
| H7 Blood tests (if ordered) | Kit sent or clinic booked. Tests that decide the plan (androgens, U&E) come back **before** prescribing | ([clinical-women 4.2]) |
| H8 Consent screens | Plain-language information for each medicine. Off-label status explained in writing. For finasteride: the MHRA mood and sexual-function warnings and the patient-card information, with a real opt-out | ([uk-regulation, You must]) |
| H9 Delivery rhythm | Monthly for the first two supplies; then monthly or every 3 months, same price per month | Section 5.6 |
| H10 Card saved, not charged | The card is charged only when the prescriber approves. A decline releases it in full | Pay only on approval (Numan, Strut, Boots) |

**Prescriber review** (target: within 1 working day [our proposal]): approve / approve with a change (explained in
one line) / book a call / decline with the reason and a referral letter. A second pharmacist then does the clinical
and accuracy check before dispensing; the GPhC wants prescribing kept separate from supply where possible
([uk-regulation 7.3]).

**Repeat supplies:** a short check-in 2 to 3 weeks before each shipment (new medicines, new conditions, side effects,
mood, and for women on tablets or spironolactone, pregnancy and contraception). The same rule set runs every time.

---

## 5. The service

### 5.1 A named prescriber who answers

[our proposal unless sourced]

- **Every patient has a lead prescriber** with a name, photo, GPhC number and profession on their account page. The
  website shows the prescriber's name, registration number and whether they are a pharmacist or a doctor, as the GPhC
  requires ([uk-regulation 3.2]).
- **The same small team reads the notes,** so nobody has to repeat their story. (A Manual customer had to explain severe
  side effects to two clinicians because no notes had been made ([customer-voice 3.6]).)
- **A free 10-minute phone or video call** on request, bookable online within 2 working days. It is **required** before
  any off-label tablet (minoxidil tablets, spironolactone, dutasteride), and whenever the engine says CALL. The GPhC
  expects two-way contact rather than a questionnaire alone for medicines that need monitoring
  ([uk-regulation 3.2 (a)]).
- **Response times we publish:** clinical messages answered by a prescriber the same working day if received by 3 pm;
  side-effect reports first (target 2 working hours); everything else within one working day. A bot may answer "where is
  my parcel?", never a clinical, billing or complaint question ([customer-voice 3.9]).
- **Second check:** a second pharmacist does the clinical and accuracy check on every prescription before dispensing
  ([uk-regulation 7.3]).
- **Capacity rule:** when response times slip, new sign-ups pause (with a waiting list) before the promise breaks.

### 5.2 Follow-up schedule

No trial sets the best schedule. The MHRA says "review patients regularly" for finasteride. This schedule follows the
proposals in the clinical files ([clinical-men 10.3]; [clinical-women 4.4]).

| When | Everyone | Extra for tablets (minoxidil) | Extra for finasteride or dutasteride | Extra for spironolactone |
|---|---|---|---|---|
| **Before the first dose** | Written "what to expect", with the early-shedding warning (5.4) | Warning signs to stop and get help: chest pain, breathlessness, fainting, fast weight gain, marked swelling | Patient-card information and the "stop at once if your mood drops" rule | Pregnancy rule, dizziness on standing, period changes |
| **Days 3 to 7** | – | Short check: light-headedness, fast or irregular heartbeat | – | – |
| **Weeks 2 to 4** | Check-in: side effects, scalp reaction, shedding reassurance | Swelling, weight gain, breathlessness (watch for 4 to 6 weeks) | Mood (PHQ-2) and the three sexual-function questions vs baseline | Dizziness and periods; potassium test if aged 45+ or at risk. At one month, the first dose step if tolerated and bloods are normal; then monthly steps to the agreed dose (each step followed by the same checks) |
| **Weeks 4 to 6** | – | Women: repeat blood pressure and pulse | – | – |
| **Month 3** | Same checks. Optional photo set. "Too early to judge hair; keep going" | Blood pressure if a precaution exists | Mood and sexual function | Review the dose reached and side effects |
| **Month 6** | **Full photo set compared with baseline, reviewed by the prescriber.** First real verdict. Women on foam: stop if no improvement by 24 weeks | Same | Same | Same |
| **Month 12** | **Photo review: continue, change or stop.** Topical minoxidil: stop if no improvement after a year. Men not responding enough on finasteride + minoxidil: consider dutasteride | Same | Same | Full effect may take 12 to 18 months |
| **Then every 6 to 12 months** | Photos; new medicines and conditions | Blood pressure if a precaution exists | Mood and sexual function **every time** | Potassium if 45+ or at risk |
| **Every supply** | Short check-in 2 to 3 weeks before shipping | – | – | Women: pregnancy and contraception check (also for minoxidil tablets) |
| **Any time** | A "Report a side effect" button that goes straight to a prescriber | Stop at once and get medical help for chest pain, breathlessness, fainting, fast weight gain or marked swelling | Stop finasteride at once for low mood or suicidal thoughts and contact us (MHRA) | Stop if pregnant and contact us |

### 5.3 Side effects: clinical first, never sales

- **A separate clinical channel.** The "Report a side effect" button and any message containing side-effect words go
  to the prescriber queue, not to customer service ([customer-voice 3.6]).
- **Billing pauses automatically** the moment a side effect is reported, until a prescriber has replied and the patient
  has decided.
- **Clear advice:** stop, reduce, swap or carry on, in writing, the same working day.
- **Stop rules are written into the system:** finasteride and low mood or suicidal thoughts: stop at once
  ([clinical-men 10.1]); minoxidil tablets and chest pain, breathlessness, fainting, rapid weight gain or marked swelling:
  stop and get medical assessment ([clinical-men 11]).
- **Yellow Card:** we offer to report suspected side effects to the MHRA with the patient, including any from specials
  ([clinical-men 10.3]).
- **Never a retention offer.** A Sons† customer who reported a side effect was asked if they wanted to cancel
  ([customer-voice 3.6]).
- **Money:** the side-effect part of our promise (5.8) refunds the most recent payment if a side effect makes the
  patient stop.

### 5.4 Shedding and timelines: what we tell people, and when

Early shedding nobody warned about is 9% of negative reviews overall and 30% at Hers (US)\* ([customer-voice 3.7]).
Only Numan warned about it before sign-in ([cross-company 4.10]).

**The message before the first dose (plain words) [our proposal, built on the sourced facts]:**

> "In the first 2 to 6 weeks of minoxidil, many people shed more hair than usual. This is old, resting hair being
> pushed out by new growth. It usually settles. Please keep going. If heavy shedding goes on for more than 2 weeks,
> send us photos and a prescriber will look and advise."

Sources: shedding at 2 to 6 weeks and the 2-week advice in the SmPC; the BAD says it usually settles in 4 to 6 weeks
([clinical-men 3.1]; [clinical-women 3.1]). In a trial of women on 1 mg minoxidil tablets, 38% had early shedding at
week 4 ([clinical-women 3.2]).

**The first-year timeline we show on the result screen and in every account:**

| Time | What usually happens | Source |
|---|---|---|
| Weeks 2 to 6 | Possible extra shedding (minoxidil) | [clinical-men 3.1] |
| Month 3 | Too early to judge. Finasteride needs 3 to 6 months just for loss to steady | [clinical-men 2.1, 10.3] |
| Month 6 | First fair look, with photos | [clinical-men 10.3] |
| Months 6 to 12 | Best results usually show; women's foam judged by 24 weeks | [clinical-women 3.1] |
| Month 12 | Decide: continue, change or stop | [clinical-men 10.3] |
| If you stop | Finasteride gains fade within 9 to 12 months; minoxidil gains within 3 to 4 months | [clinical-men 11, step 0] |

**Honest goals at the start:** the main aim is to stop further loss; regrowth is modest and varies; benefit lasts only
while treatment continues ([clinical-men 11, step 0]).

### 5.5 Photos, tracking and the honest verdict

- **Baseline photos from everyone** before the first prescription (H4). They serve diagnosis first, tracking second.
- **Repeat sets at months 3 (optional), 6 and 12,** then every 6 to 12 months. An on-screen outline keeps the angles the
  same. The patient sees the side-by-side.
- **Two 0 to 10 scores at each check-in** (how much shedding, how happy with coverage), copied from Hair + Me's good
  pattern ([engines-experience 5.2]).
- **The prescriber writes a plain verdict at 6 and 12 months:** better, the same, or worse, and what we will do. If it is
  not working, we say so and change or stop the plan rather than keep posting it [our proposal]. "No results" is the
  main complaint in about 22% of a hand-read sample of negative reviews ([customer-voice 2.1]).
- **Results data stay inside the service.** We do not publish before-and-after photos or efficacy figures for
  prescription medicines in marketing (section 6).

**What a blood result does** (women's pathway, from [clinical-women 4.2]):

| Result | Action |
|---|---|
| Low haemoglobin with low ferritin | Refer to the GP to find the cause (urgent pathway after the menopause). Do not just sell iron |
| Ferritin below 30 µg/L, haemoglobin normal | Iron replacement and a GP letter; look for a cause |
| Ferritin 30 to 40 µg/L with shedding | A time-limited iron trial with honest counselling |
| Abnormal TSH (thyroid) | Refer to the GP; hair treatment waits |
| Testosterone above 4.8 on repeat (unit not given in the source; confirm with the laboratory), or any result with rapid virilisation | Urgent referral |
| Mildly raised testosterone or free androgen index | Assess for PCOS with the GP |
| Potassium above range, or reduced kidney function | No spironolactone |

### 5.6 Delivery and stock

Delivery, stock or wrong items were the **main** complaint in about 28% of a hand-read sample of negative reviews
([customer-voice 2.1, 3.3]). Missing doses matters clinically, because gains fade when treatment stops.

[our proposal unless sourced]

- **Every parcel tracked,** in plain, letterbox-friendly packaging.
- **Ship when about 3 weeks of supply are left,** so a delay never causes a gap ([customer-voice 3.3]).
- **Reviews and ID checks start 4 to 6 weeks before supply runs out,** never 4 days before (a Hair + Me complaint)
  ([customer-voice 3.16]).
- **Delivery rhythm:** monthly for the first two supplies (so the plan can change after the 2 to 4 week check without
  wasting medicine), then monthly or every 3 months at the patient's choice, at the same price per month.
- **Lost or late parcel:** a free replacement sent by tracked post the next working day.
- **Stock:** two wholesalers for every product; a buffer stock (size to be set from real order data); a product that
  cannot be shipped is never recommended; if a stock problem is coming, the patient is told **before** any charge and
  offered a licensed alternative or a pause.
- **Flammable products:** minoxidil liquid and the foam (an "extremely flammable aerosol") are flammable
  ([clinical-women 3.1]). Dr Fox ships these to mainland UK only [docs]. Check courier rules for the Highlands, islands
  and air routes before promising delivery there.
- **Never take money for an order on hold without saying so** ([customer-voice 3.16]).

### 5.7 Letters to the GP

- **A GP letter as standard** for everyone who consents. It is required for off-label tablets; without GP details or
  consent, the most we prescribe is licensed scalp minoxidil, and we record why ([rule-library S7]).
- **What the letter says** ([clinical-women 4.5]): how the diagnosis was reached (history and photos, no examination);
  the medicine, dose and whether it is off-label; baseline blood pressure, pulse and blood results; contraception
  discussed; the monitoring plan and who does it; what would make us stop.
- **Men's extras:** finasteride lowers PSA (doubling the result "should be considered"); dutasteride halves PSA by
  6 months ([rule-library F8]).
- **Referral letters** for every stop that needs the GP or dermatology: what the patient told us and why we did not
  treat.

### 5.8 Subscription terms and our promise

**Built to the DMCCA subscription rules from day one.** The draft regulations say they apply to new contracts from
1 January 2027; they require clear information before sign-up, written reminders before renewals, the right to end
the contract at any time, cooling-off rights, and refunds generally within 14 days of a cancellation
([uk-regulation 6.3]). They were still a draft on 23 November 2026, so check before launch.

| Term | What we do [our proposal] |
|---|---|
| Contract | Monthly rolling. **No minimum term.** No prepaid bundles |
| Before sign-up | One page in plain words: price, what is included, how often we charge, how to pause and cancel, reminders, refunds |
| Reminders | **7 days before every charge,** by email and text: date, amount, what is being sent, and one-tap links to skip, pause, change or cancel. A reminder before the 12-month price lock ends. Reminders say "your hair-loss treatment" and the account shows the medicine name (marketing emails must never name a POM: [uk-regulation 6.1]) |
| Cancel | **Two taps in the account, on web and app, by the same route as joining.** Phone, email or chat also work. Confirmation at once. No "are you sure" maze, and **no retention discount** |
| Up to dispensing | Cancel any order before it is dispensed for a **full refund**, whatever the reason. This is at least as generous as we expect the cooling-off rules to be; take advice on how they apply to dispensed medicines |
| Pause | Up to 3 months, in the account. Restart needs a short check-in |
| Safety stop | A failed review or a safety stop ends supply cleanly, with no charge |
| Failed payment | One retry, then a message. No repeated charge attempts (a Hims UK reviewer complained of these [customer-voice 3.1]) |
| Refund speed | Within 5 working days (inside the 14 days the draft rules allow) |
| Price | Locked for 12 months; then 30 days' notice of any rise, with the right to leave first |
| Data | Self-service download and deletion of data and account |

**The Fair Deal promise** (one short, plain page) [our proposal]:

1. **Pay only if approved.** Your card is charged only when a prescriber approves.
2. **Leave any time.** Two taps, no questions, no tricks.
3. **No surprises.** A reminder 7 days before every charge. Your price is locked for 12 months.
4. **Not for you?** If you are unhappy with our service for any reason in your first 90 days, tell us and we refund your
   most recent payment. No photos, forms or conditions.
5. **Side-effect promise.** If a side effect means you stop, we refund your most recent payment and a prescriber talks
   you through stopping safely.
6. **Delivery promise.** Tracked every time. Lost or late? We send a free replacement the next working day.
7. **Feel promise.** Do not like how it feels? One free swap of base or form in your first 3 months, if it is clinically
   suitable.
8. **Honest-verdict promise.** At 6 and 12 months a prescriber looks at your photos and tells you plainly whether it is
   working. If it is not, we change or stop it.

**What the promise never says:** "results or your money back". The ASA has ruled that a refund tied to hair regrowth
reads as a guarantee that a medicine works, even without the word "guarantee" (Numan, 2024), and CAP rule 12.19 bans
claims that a medicine's effects are guaranteed ([uk-regulation 2.4, 2.5, key fact 14]). Refunds tied to satisfaction
are allowed ([uk-regulation, You can]). Voy's\* promise needs 180 days, two consultations and monthly photos, and
customers report refusals after following the steps ([customer-voice 3.2]). Ours has no hoops.

### 5.9 Openness as a habit

- **A quarterly service report on the website** [our proposal]: median time to a prescriber decision; side-effect reply
  times; parcels on time and lost; how many people cancelled and how long it took; refunds paid; complaints and how
  they ended; share of patients who reached their 6-month photo review. These are service facts, not medicine claims.
- **Reply to every public review** ([customer-voice 6, item 9]).
- **Footer on every page:** pharmacy name and address, GPhC registration number, owner, superintendent pharmacist,
  prescriber details, how to check registration, how to complain, privacy notice ([uk-regulation 3.2]).

---

## 6. How we win customers within UK advertising law

### 6.1 The law in five lines

1. **No advert may lead to the use of a prescription-only medicine** (Human Medicines Regulations 2012, regulation 284).
   That covers finasteride, minoxidil tablets, dutasteride and spironolactone, on websites, search, social media and
   email. Breaches are criminal offences ([uk-regulation key facts 9, 10]).
2. **Unlicensed medicines may not be advertised or even mentioned** in adverts, and may not be called "clinically
   proven" ([uk-regulation key facts 8, 11]).
3. **The MHRA's Blue Guide (Appendix 6)** lets a clinic promote the **service** and the **condition**, show an
   **indicative price for the condition** on the home page, publish a factual price list on inner pages, and give a
   balanced overview of all options on pages the visitor chooses to open. It bans named POMs and POM prices on the home
   page, "Buy now" buttons, free offers and special offers on medicine prices ([market-economics 6.2]).
4. **The CAP Code** bans guaranteeing a medicine's effects, "safe" or "no side effects" claims, and endorsement of
   medicines by health professionals or celebrities (rules 12.18, 12.19); every hair-loss claim needs human trial
   evidence (rule 12.23) ([uk-regulation 2.4]).
5. **Minoxidil 5% liquid and foam are licensed general-sale medicines,** so they **can** be advertised, within their
   licence and the CAP Code ([market-economics 6.1]).

### 6.2 Our messages are about value and trust, which are service facts

That is our advantage: the things we compete on are **service** features, which can be advertised. Our rivals compete
on medicines, which cannot. Each line below must still be pre-cleared by a regulatory adviser [our proposal]:

| Lawful service message (examples) | The complaint it answers |
|---|---|
| "See your result and your full price before we ask for your email." | Email walls and hidden prices |
| "One fair monthly price. No first-order trick. Cancel in two taps." | Subscription traps (35% of negative reviews) |
| "A named pharmacist prescriber who answers the same working day." | No real clinician; side effects handled by sales |
| "Photo check-ins at 6 and 12 months, and an honest verdict." | "No results" with nobody checking |
| "Tracked delivery, every time." | Delivery and stock (the main complaint in about 28%) |
| "Hair-loss care for women, with blood tests when you need them." | Women badly served |
| "If you don't need treatment, we'll tell you, for free." | Being sold to whatever you answer |
| Home page price line: **"Hair-loss care from £14 a month, all-in."** | An indicative price for the condition, which Appendix 6 allows. No medicine named next to it |

**Comparisons with rivals.** It is tempting to publish "cheaper than Hims, Numan and Sons". Naming a rival's
prescription-medicine plan and price in an advert risks being read as promoting a POM, and comparative claims have
their own rules (not covered by the files). So: **compare service terms, not medicines** ("no 6- or 12-month
prepayment needed"), and take legal advice before any named comparison [our proposal].

### 6.3 Where the words go

| Place | What is allowed there | What we put there |
|---|---|---|
| **Home page, adverts, social posts, web address, marketing emails** | Condition and service only; no medicine names, pictures of pills or labelled bottles, or "prescription" ingredient lists ([uk-regulation 2.3]) | The value-and-trust promises; "Start your free hair check"; the indicative "from £14" condition price; the regulated details in the footer |
| **Inner condition pages the visitor chooses to open** | A balanced overview of all treatment options, licensed and off-label, with benefits and risks; a factual price list without product claims | Plain guides to every option, including "you can buy minoxidil 5% in a shop" and "you may not need treatment" |
| **The consultation and the result screen** | Medicines named as the outcome of a clinical consultation, subject to prescriber review | Names, strengths, reasons and prices (section 4.11) |
| **Service emails and texts** (reminders, check-ins) | Transactional messages about the patient's own care | "Your hair-loss treatment" and a link to the account, where the medicine is named |

### 6.4 The channels, in order of how much trust they build per pound

[our proposal; costs unknown until tested]

| Channel | How | Rules to watch |
|---|---|---|
| **Search guides (organic)** | Honest, long guides: "Shedding or thinning?", "What happened 3 months ago?", "Hair loss after a weight-loss injection", "Women's hair loss: which blood tests and when", "How to judge any hair-loss subscription". Each ends with "Start your free hair check" | Balanced, inner pages only; no efficacy claims for unlicensed products ([market-economics 6.5]) |
| **Free tools** | The photo tracker, the shedding explainer and the printable GP summary (section 3.6, B4), open to anyone | Service tools, not medicine adverts |
| **Paid search on condition words** | Bid on "hair loss consultation", "thinning hair women", "receding hairline help", never on drug names | Google requires GPhC registration and certification (LegitScript or equivalent) before health adverts ([market-economics 6.3]). "Buy Oral Minoxidil" in paid search was upheld against Manual ([uk-regulation key fact 13]) |
| **Meta (Facebook, Instagram)** | Service and education adverts only, over-18s | Prescription-medicine adverts can target only the US, Canada and New Zealand; telehealth needs certification ([market-economics 6.3]) |
| **Licensed general-sale product adverts** | Minoxidil 5% foam for women and men, within its licence and SmPC, leading into our consultation | Claims must match the licence and have human trial evidence (CAP 12.11, 12.23). A medicine advert must not offer diagnosis by correspondence (CAP 12.2.1): keep the product advert and the consultation offer separate; take advice |
| **The quarterly service report and the 2027 subscription law** | PR built on facts: our published response times, cancellation figures and refunds; commentary when the DMCCA subscription rules start | Factual service comment; no medicine claims |
| **Word of mouth and reviews** | Invite **every** customer to review, at the same point in their journey; reply to every review | Fake or selectively gathered reviews are banned under the DMCCA since 6 April 2025 ([uk-regulation 2.4]) |
| **Referral** | "Send a friend our free hair check." If any reward is given, make it a fixed charity donation or service credit, never a discount on a medicine, and never a code a referrer can post next to a medicine name | Brands answer for affiliates and referrers (ASA rulings, February 2026) ([market-economics 6.4]) |
| **Professional and community links** | Hairdressers and barbers (how to spot thinning and red flags, when to see a GP); GP practices and community pharmacies (our referral letters and stop screens make us safe to recommend); postnatal and menopause groups (shedding and women's pattern loss explained) | Education about the condition; no medicine promotion; no professional endorsement of a medicine (rule 12.18) |

### 6.5 What we will never do

From [uk-regulation, You cannot say or do], plus our own value rules:

- Name a POM on the home page, in adverts, search terms, social posts, the web address or marketing emails.
- Show or mention an unlicensed medicine in any advert; call anything "clinically proven" if it includes one.
- Use "Buy now" or "Add to basket" for a POM.
- Run first-order discounts, free trials of medicines or "50% off" banners. (We do not discount at all.)
- Promise results, or tie a refund to hair growth.
- Say "safe", "no side effects", "best", "strongest" or "better than" another treatment.
- Use doctors, pharmacists, celebrities or customer testimonials to endorse a medicine, or before-and-after photos of
  prescription treatment.
- Use urgency ("only today", "respond quickly"); the ASA ruled this socially irresponsible ([market-economics 6.4]).
- Offer retention discounts to people who try to leave.

### 6.6 A six-question check for every piece of copy

[our proposal; a regulatory adviser signs off the first versions of each template]

1. Does it name, show or hint at a prescription or unlicensed medicine? If yes, it cannot be an advert.
2. Does it promise or imply that hair will grow? If yes, rewrite.
3. Is every claim a service fact we can prove from our own data today?
4. Does any health professional or customer appear to endorse a medicine?
5. Is any price a discount, an offer or tied to a named medicine on the home page?
6. Would a regulator reading the **whole page**, pictures included, think it sells a medicine? (The whole impression
   counts, not only the words: [uk-regulation 2.6].)

---

## 7. Rough unit economics and launch plan

**Every number in this section is an estimate or an assumption unless a source is named.** The files hold no
wholesale prices, courier rates, lab charges, software costs or churn data for any UK rival
([market-economics 10]). The point of this section is to show the shape of the business and which numbers matter
most, so the owner knows what to get quotes for first.

### 7.1 The cost assumptions

| Line | Assumption | Basis |
|---|---|---|
| Medicine cost | Section 3.3 table (for example finasteride £3, minoxidil liquid £6, foam £8 a month) | [assumption], below the cheapest retail prices found |
| Tracked delivery | £2.90 a parcel | Dr Fox's delivery charge to customers, used as a proxy ([market-economics 5.5]). Tracked post may cost more: see 7.4 |
| Packaging and leaflet | £0.50 a parcel | [assumption] |
| Dispensing and second-pharmacist check | £1.50 a parcel | [assumption] |
| Parcels a year | Year 1: 6.8; year 2: 5.6 | [estimate]: two monthly parcels, then 80% of patients choose every 3 months and 20% monthly [assumption] |
| Card fees | 2.2% + 20p a charge | Stripe UK standard card rate plus its subscription tool ([market-economics 5.5]) |
| Prescriber time | £51 an hour | [estimate] from the NHS Band 8a top salary (£64,750) plus 25% employer costs over 1,600 hours ([market-economics 5.5]) |
| Prescriber minutes, year 1, licensed plan | About 46 minutes: first review with photos 12; check-ins at 2 to 4 weeks and 3 months 2 each; photo reviews at 6 and 12 months 8 each; four supply check-ins 2 each; messages 6 | [assumption] → **£3.26 a month** |
| Extra for an off-label tablet, year 1 | A 15-minute call; a days 3 to 7 check; blood pressure or blood-result reviews (about 23 minutes) | [assumption] → **£4.89 a month** in total |
| Prescriber time, year 2 | Two photo reviews, four supply check-ins, messages (about 30 minutes; 36 with an off-label tablet) | [assumption] → **£2.13** (or **£2.55**) a month |
| Promise costs (refunds, replacements, free swaps) | 3% of revenue in year 1; 1% in year 2 | [assumption] |
| Identity check | £1.50 per new patient | [assumption] |
| VAT | Zero-rated | Medicines dispensed on a pharmacist independent prescriber's prescription can be zero-rated if all conditions are met; whether licensed general-sale minoxidil supplied this way qualifies needs **tax advice** ([market-economics 5.5]). If it is standard-rated, £2.50 of each £15 is VAT |

### 7.2 What each plan earns a month

"Contribution" = what is left for fixed costs and marketing after the medicine, parcels, card fees, prescriber time,
promise costs and identity checks. "Gross margin" = price minus the medicine only.

| Plan | Price | Medicine cost [assumption] | Gross margin | Contribution, year 1 | Contribution, year 2 |
|---|---|---|---|---|---|
| Finasteride alone | £14 | £3 | 79% | **£3.99** (28%) | **£6.04** (43%) |
| Scalp minoxidil, liquid or 2% solution | £15 | £6 | 60% | **£1.94** (13%) | **£4.01** (27%) |
| Scalp minoxidil, foam | £15 | £8 | 47% | **−£0.06** (break-even) | **£2.01** (13%) |
| Minoxidil tablets alone | £16 | £4 | 75% | **£3.26** (20%) | **£6.56** (41%) |
| Finasteride + minoxidil liquid | £24 | £9 | 63% | **£7.47** (31%) | **£9.72** (41%) |
| Finasteride + minoxidil foam | £24 | £11 | 54% | **£5.47** (23%) | **£7.72** (32%) |
| Finasteride + minoxidil tablets | £24 | £7 | 71% | **£7.84** (33%) | **£11.30** (47%) |
| Women: spironolactone + minoxidil foam | £24 | £11 | 54% | **£3.84** (16%) | **£7.30** (30%) |

[estimates, from the assumptions in 7.1]

**Blended across a plausible mix** [assumption: 70% men, 30% women; men 30% finasteride alone, 10% scalp
minoxidil alone, 50% two medicines, 10% finasteride + tablets; women 70% scalp minoxidil, 15% spironolactone +
minoxidil, 15% tablets alone]:

| | Year 1 | Year 2 |
|---|---|---|
| Revenue per patient a month | £19.02 | £19.02 |
| Gross margin (after medicine only) | about 62% | about 62% |
| **Contribution per patient a month** | **about £4.23 (22%)** | **about £6.58 (35%)** |

**What this means in plain words:**

- **Gross margin is healthy.** About 62% sits above Voy's 46% and Numan's 50%, and below Hims UK's 77.5% and Hair + Me's
  group's 78% ([market-economics 5.1]). Those are whole-company figures with different cost definitions, so treat this
  as a rough comparison only.
- **Our cost is the service, not the medicine.** Prescriber time and parcels take more than the medicine on most plans.
  That is the price of keeping our promises, and it is why the two-medicine plans (which share one review and one
  parcel) carry the business.
- **Scalp minoxidil alone, especially the foam, earns almost nothing in year 1.** This is deliberate: it is on general
  sale in shops, so we price it close to cost and say so (section 3.4, M2). In our assumed mix it is about 28% of
  patients (10% of men, 70% of women), and the blended figures above already include its near-zero year-1
  contribution. It turns positive in year 2. If real foam costs come in above our £8 assumption, raise scalp minoxidil
  alone to £16 for both bases. That is still below Numan, Hims UK, Voy\* and Hair + Me, and 50p below Sons'† 6-month
  price of £16.50. Women's foam may be cheaper than assumed: at 1 g once a day, one can may last longer than a man's
  can at 2 g a day (check the pack).
- **Year 2 is where the money is.** Reviews thin out and the first-year costs are gone. So retention (still paying at
  months 3, 6 and 12) is the number to measure from day one ([market-economics 5.6]).

### 7.3 Fixed costs and break-even

Prescribers' patient time is already counted per patient above (bought as sessions as volume grows). Fixed costs are
everything else.

| Fixed cost a month | Standard set-up | Lean set-up (share an existing registered pharmacy) | Basis |
|---|---|---|---|
| Founder (prescriber, superintendent, clinical lead) | £6,750 | £3,000 (part draw) | Band 8a top salary plus 25% as a benchmark ([market-economics 5.5]); lean figure [assumption] |
| Minimum second-pharmacist cover | £3,000 | £1,500 | [assumption] |
| Patient-care lead | £2,800 | £1,400 (part-time) | [assumption] |
| Content and marketing staff | £2,000 | £1,000 | [assumption] |
| Premises (registered pharmacy) | £2,000 | £1,000 | [assumption] |
| Software (website, engine, telehealth, photos, reminders, pharmacy system) | £3,000 | £1,500 | [assumption] |
| Insurance (indemnity naming online, off-label and any compounding work; product liability; cyber) | £800 | £800 | [assumption]; cover must name these ([uk-regulation 7.1]) |
| Compliance, legal, accounts, certification, ICO fee | £1,500 | £1,000 | ICO fee £52 to £78 a year ([uk-regulation 6.1]); rest [assumption] |
| **Total** | **about £21,850** | **about £11,200** | |

| Break-even (before marketing spend) | Standard | Lean |
|---|---|---|
| Active patients needed at year-1 contribution (£4.23) | about **5,200** | about **2,650** |
| Active patients needed at year-2 contribution (£6.58) | about **3,300** | about **1,700** |
| Revenue at the year-2 break-even point | about £63,000 a month (£0.75m a year) | about £32,000 a month |

[estimates]

**Marketing on top.** No UK rival publishes its cost to win a customer ([market-economics 5.3]). At our year-1
contribution, a £50 acquisition cost takes about 12 months to earn back, £100 about 24 months; at year-2 contribution,
8 and 15 months. So we must win customers cheaply: **a target of £50 or less per paying patient** [our proposal]. For
comparison, Hair + Me's first-order discount alone costs about £60 a customer and Voy's\* promo price is about £85
below its list price over 6 months ([market-economics 5.3]). We do not spend that money on discounts; we spend it on
service.

**An illustrative funding need** [estimate, very rough]: with the standard set-up, if active patients grow by about 250
a month from launch, break-even comes after roughly 19 to 20 months, with operating losses of about £200,000 before
marketing, plus about £15,000 a month of marketing at a £50 acquisition cost: **about £0.5 million before break-even**,
plus one-off set-up costs (legal and regulatory advice, the engine and website, premises fit-out, opening stock,
certifications), which need quotes. The lean set-up roughly halves the operating loss. Replace all of this with real
figures from the pilot.

### 7.4 Which assumptions matter most (sensitivity on the blended year-1 contribution of £4.23)

| If… | Blended year-1 contribution becomes | What to do |
|---|---|---|
| Medicine costs are half our assumption | about £7.86 | Good news; keep prices, build reserves |
| Medicine costs are 50% higher | about £0.60 | Use the fallback price list below |
| Tracked postage is £4, not £2.90 | about £3.61 | Negotiate a contract rate; encourage 3-monthly parcels honestly (fewer parcels, greener) |
| Everyone chooses monthly parcels | about £2.02 | Explain the trade-off; consider passing on a real monthly-parcel cost later, shown openly |
| Prescriber time is 30% lower (good triage by exception) | about £5.29 | Engine flags only the check-ins that need a person; a prescriber still signs every review |
| Every price is £1 higher | about £5.21 | The fallback list |

**Fallback price list** if quotes come back high [our proposal]: finasteride £15, scalp minoxidil £16, off-label tablet
£17, any two medicines £26. It still beats Hims UK, Voy\*, Hair + Me and Numan on monthly and 12-month list prices and
Sons'† 6-month list prices, but **not** Sons'† and Numan's first-year totals with their first-order deals (about £302
and £296 against our £312 for two medicines). Use it only if the real numbers force it.

**Price floor rule** [our proposal]: at real quotes, the blended contribution must be at least £4 a month in year 1 and
£6 in year 2, and every two-medicine plan must earn at least £3 in year 1. Scalp minoxidil alone is the one deliberate
near-cost line, but it must never lose money in year 2. Any plan that breaks the rule goes up by £1 at the next
12-month price review, with 30 days' notice.

### 7.5 The team for a small, pharmacist-led launch

| Role | Who | Notes |
|---|---|---|
| Lead prescriber, superintendent pharmacist, clinical lead | The owner | Writes the protocol, signs the rule set, leads audits. Can legally be owner, superintendent, responsible pharmacist and prescriber, but the GPhC wants prescribing kept separate from supply where possible ([uk-regulation 7.3]) |
| Second pharmacist (part-time at first) | Employed or sessional | Clinical and accuracy check on every prescription; prescribing cover for holidays and sickness |
| Pharmacy technician or dispenser | One person | Dispensing and packing. From 10 December 2026 a pharmacist can authorise a registered pharmacy technician to prepare or supervise preparation under the pharmacy exemption, which matters only if we compound later ([uk-regulation, Verification log, missing 4]) |
| Patient-care lead | One person | Billing, delivery, account help. Never answers clinical questions; routes them |
| Content and marketing | Part-time or freelance | Guides, free tools, service report; every piece through the six-question check |
| Technology | Freelance or a platform partner | The engine, rule tests, reminders, photo tracker; data hosted in the UK or an equivalent jurisdiction ([uk-regulation 6.1]) |

### 7.6 Launch plan

Today is 24 November 2026. The DMCCA subscription rules are expected from 1 January 2027, so we build to them from the
start.

**Phase 0: set-up (about months 1 to 4)** [our proposal; timings to confirm]

1. Pick a name and run the checks in section 1.1.
2. Engage a regulatory adviser and a tax adviser (VAT on general-sale minoxidil supplied on prescription; the cooling-off
   rules for dispensed medicines; named price comparisons).
3. Register the pharmacy with the GPhC (premises, superintendent, responsible pharmacist, written procedures including
   remote supply and delivery) ([uk-regulation, You must]).
4. Indemnity that names online prescribing and off-label use; product liability.
5. Data: ICO fee, a DPIA (required before launch for an online prescribing service), records of processing, UK hosting
   ([uk-regulation 6.1]).
6. CQC: get **written advice** that a pharmacist-only prescribing service does not need registration; it would if a
   doctor or nurse joined the treatment team ([uk-regulation key fact 20, You must]).
7. Read what the research could not: NICE CKS (male and female pattern hair loss), the BNF, UKTIS pregnancy monographs,
   the full oral minoxidil consensus paper, and the GPhC's January 2026 inspection framework (reported but not read)
   ([clinical-men 12]; [clinical-women Part 5]; [uk-regulation, Verification log, missing 1]).
8. Write the clinical protocol and the rule file from sections 3 and 4; build one automated test per rule.
9. Supplier accounts with two wholesalers; quotes for every product in section 3.3; courier contract (tracked;
   flammable goods); laboratory partner; identity-check provider; payment provider with subscription tools.
10. Certification for adverts (GPhC registration, then LegitScript or equivalent, then Google) ([market-economics 6.3]).
11. Pre-clear the home page, guides, adverts and email templates with the regulatory adviser.

**Phase 1: closed pilot (about months 4 to 6)**

- Around 100 patients, invited through the owner's own professional network and the free tools, not through medicine
  adverts.
- Measure: minutes to finish the questions; share stopped at red flags; time to a prescriber decision; side-effect
  reply times; parcels on time; reminders sent and cancellations completed in under a minute; first real costs per
  parcel and per review.
- Fix what breaks before opening the doors.

**Phase 2: public launch (about month 6 onwards; after 1 January 2027)**

- Men: M1 to M4, and M5 for men who transfer with a documented 12-month history. Women: W1 to W5. Blood tests. The
  shedding route.
- Marketing: search guides, free tools, condition paid search once certified, professional links, review invitations,
  the first quarterly service report after 3 months of data.
- Add sessional prescribers before response times slip; pause sign-ups if they do.

**Phase 3: after about 12 to 18 months**

- The microneedling protocol (B3) once device rules and the trial method are checked.
- A written special-need policy, and only then any unlicensed product (M6), starting with whether an imported product
  licensed elsewhere in Europe can be used.
- Northern Ireland, after advice.
- Publish a first-year service report: retention at 3, 6 and 12 months, reply times, complaints, refunds.

### 7.7 The numbers to watch every month

| Measure | Why |
|---|---|
| Still paying at months 3, 6 and 12 | The single number that decides whether the model works ([market-economics 5.6]) |
| Contribution per plan against the model in 7.2 | Shows whether prices need the fallback list |
| Cost to win a paying patient, by channel | Target £50 or less |
| Share who finish the questions, and median minutes | Ease is 21% of praise |
| Share stopped or referred, and why | A quality sign, not a failure |
| Time to prescriber decision; side-effect reply time | Our published promises |
| Parcels on time; lost parcels; stock-outs | The main complaint in about 28% of negative reviews |
| Share of patients who reach the 6-month photo review | Our "honest verdict" promise depends on it |
| Refunds under the Fair Deal promise, by reason | Early warning of a product or service problem |
| Median time to cancel | Should be under a minute |

---

## 8. The three biggest risks and how to handle them

### Risk 1: thin margins against rivals with far more money

**What could happen.** Our model earns about £4 to £7 per patient a month after service costs (section 7.2), on
assumptions that may be wrong. Hims & Hers spent US$919 million on marketing in 2025 and now owns Hims UK, ZAVA (the
platform behind the Superdrug and Asda online doctors) and Juniper UK; Voy turned over £227 million in 2025
([market-economics 8, key facts 10, 13, 15]). They can sell first orders at half price for longer than we can, and
prices are falling (finasteride £10 at Dr Fox; Hims UK's prepaid chew £16.50). If our real costs are higher, or our
cost to win a customer is above about £50, we run out of money before we reach break-even.

**How to handle it.**

1. **Get real quotes before setting prices:** two wholesalers, a courier contract, a laboratory, an identity-check
   provider. Apply the price floor rule (section 7.4) and keep the fallback list ready.
2. **Do not fight on discounts.** Never match a first-order offer. Our pitch is that we do not play that game; a
   discount would break the promise and invite regulator attention ([uk-regulation 3.5]).
3. **Win customers cheaply:** search guides, free tools, referrals, professional links and reviews before paid
   channels. Track cost per paying patient by channel from week one.
4. **Protect year 2.** Retention is where the profit is: the honest 6-month verdict, reminders, tracked parcels and fast
   side-effect replies are retention tools as much as trust tools.
5. **Keep fixed costs lean** at first: share an existing registered pharmacy's premises if possible (lean set-up,
   section 7.3), buy prescriber time in sessions, and use off-the-shelf software where it is safe.
6. **Hold the niches the giants serve badly:** women (no UK rival in the set has a stepped spironolactone pathway or
   blood-test-led plan with named medicines), people who distrust subscriptions, and people who want a real clinician.

### Risk 2: a regulatory or legal mistake

**What could happen.** A value brand is tempted to shout about price next to medicine names, or to write "results or
your money back". Regulators have acted against Hims, Numan, Manual/Voy and others for exactly this, and the GPhC moved
to statutory enforcement against Voy's pharmacy in August 2026, partly for unlawful prescription-medicine advertising
([uk-regulation key facts 12 to 15]). Other open questions: the GPhC expects verification and two-way contact for
higher-risk remote prescribing; finasteride warnings could tighten again; the DMCCA subscription rules were still a
draft on 23 November 2026; VAT on general-sale minoxidil supplied on prescription is unclear; Northern Ireland has
different rules; and adding a doctor or nurse would bring CQC registration ([uk-regulation 3.2, 6.3, key fact 20];
[market-economics 5.5]).

**How to handle it.**

1. **Advisers before launch:** a regulatory adviser signs off the first version of every page, advert and email template;
   a tax adviser settles VAT; a lawyer checks the subscription terms against the final regulations and any named
   price comparison.
2. **The six-question copy check** (section 6.6) on everything, every time, with a named person accountable.
3. **Build to the higher standard now:** photos, ID with date-of-birth match, two-way calls for off-label tablets, GP
   letters, a second pharmacist check, a written risk assessment reviewed regularly, and audits, as the GPhC distance
   guidance expects ([uk-regulation 3.2]).
4. **Watch for change monthly:** MHRA Drug Safety Updates, GPhC guidance and inspection reports, ASA rulings, and the
   final DMCCA regulations. Change the rule file and tests the same week.
5. **Keep the service pharmacist-only** unless the owner decides to register with the CQC; get the CQC's view in
   writing ([uk-regulation, You must]).
6. **Re-check every competitor fact before using it.** Several of our comparisons rest on Voy\*, Sons† and Oxford\* data
   that could not be fully verified, and on Black Friday prices.

### Risk 3: breaking our own promises as we grow

**What could happen.** A trust brand is judged on its promises. Same-working-day side-effect replies, tracked parcels
with no gaps, reminders before every charge, and 6- and 12-month photo reviews all cost time and money, and all get
harder as volume grows. One founder is a single point of failure. Stock shortages happen (LloydsPharmacy's combination
pack was out of stock on 23 November; stock gaps are 14% of Numan's negative reviews ([products-prices 3.5];
[customer-voice 3.3])). A broken promise would hurt us more than it hurts a rival who never made one.

**How to handle it.**

1. **Promise only what we measure,** and publish the measures quarterly (section 5.9), including bad quarters.
2. **A capacity rule:** when reply times or review backlogs slip past target, new sign-ups pause behind a waiting list
   until they recover.
3. **Cover for the founder:** a second pharmacist from day one and a bank of sessional prescribers trained on the
   protocol.
4. **Stock:** two wholesalers per product, a buffer stock sized from real orders, and the rule that we never recommend
   what we cannot ship and tell patients before any charge if a problem is coming.
5. **Automate the dull, safety-critical parts** (reminders, check-in scheduling, supply-run-out warnings, the rule
   tests) and test them like software before every release.
6. **A simple incident process:** any missed promise is logged, the patient is told and put right (refund, replacement
   or call), and the cause is fixed.

---

## 9. In ten lines

1. **Name (to check):** Fairstrand, Plainly Hair or Steady Hair Clinic. **Promise:** hair-loss care from a named
   pharmacist prescriber, at one fair monthly price you can stop any time.
2. **Prices:** £14 finasteride, £15 scalp minoxidil, £16 an off-label tablet, £24 for any two medicines, all-in, monthly,
   no first-order deal, no lock-in, locked for 12 months.
3. **Against the five subscription brands:** cheaper month by month without prepayment, and cheaper over the first year
   than their first-order deals for finasteride and for two medicines; Dr Fox stays cheaper for a tablet alone.
4. **Range:** licensed first (finasteride, minoxidil 5% liquid or foam; women's 5% foam or 2% solution), then
   off-label Loniten tablets, stepped spironolactone and dutasteride, each a separate medicine at a published strength.
5. **Not sold:** minoxidil above 5%, fixed-dose mixes, multi-active lotions, vitamins, and any 5-ARI for women.
6. **Engine:** stops and red flags first, before any contact details; diagnosis by pattern, speed, triggers and photos;
   one plain reason for every removal; result and full price before sign-in.
7. **Service:** a named prescriber, same-working-day side-effect replies, scheduled reviews, photo verdicts at 6 and
   12 months, GP letters, tracked parcels shipped with 3 weeks to spare.
8. **Terms and promise:** built to the 2027 subscription rules; two-tap cancel; reminders 7 days before every charge;
   a satisfaction and side-effect refund promise, never a results guarantee.
9. **Economics (estimates):** about 62% gross margin and £4 to £7 per patient a month after service costs; break-even
   around 1,700 to 5,200 active patients depending on set-up and year; target £50 or less to win a patient.
10. **Biggest risks:** thin margins against rich rivals, a regulatory slip, and breaking our own promises at scale;
    each has a plan above. Get real quotes and run a 100-patient pilot before launch.

