# Blueprint draft: the clinical precision company

Draft written 24 November 2026 for the owner, a UK pharmacist independent prescriber. This is one of several angle
drafts. Its angle is **clinical precision**: win by being the most accurate and the safest service in the UK for men
and women with hair loss.

What "clinical precision" means here, in five parts:

1. **Diagnose before you prescribe.** Structured scalp photos, the right questions in the right order, and blood
   tests only when the answer would change the decision.
2. **A stepped treatment ladder from the evidence.** Licensed medicines first, a written step-up plan, and a planned
   review at fixed times.
3. **Measured outcomes.** Baseline photos and scores, the same photos again at set times, and our own results
   published every year.
4. **Real clinician contact.** A named prescriber, a call or video when the medicine needs it, and a same-day route for
   side effects that never goes through sales.
5. **Products formulated better than anyone else's.** The right strength, the right base (vehicle) for the person, and
   combinations only where trials show they add something.

---

## 0. Read this first: how sure is this draft?

- **Built only from this project's research files.** No new web research was done. The sources are
  `synthesis/cross-company.md`, `findings.json`, `rule-library.md` (section 5), `products-prices.md`,
  `engines-experience.md` (section 6), the 19 company digests and the five fact-checked files in `foundations/`.
- **Labels used in this draft.**
  - A source in brackets, such as **[clinical-men 3.1]**, means the fact comes from that section of a fact-checked
    foundations file. Where a file was corrected in its verification log, the corrected text is used.
  - **[obs]** = seen live on the competitor's site; **[code]** = read in the site's own served code; **[docs]** = the
    company's public documents. These are the competitor files' own labels.
  - **[estimate]** = worked out by us from figures in the files. **[assumption]** = a planning number with no source;
    replace it with a real quote. **[our view]** = a judgement, not a sourced fact. **[to verify]** = must be checked
    before launch.
- **Evidence limits on competitors.** Nothing after any company's sign-in wall was watched; everything after it comes
  from public documents or served code. **Voy\*** could not be walked live (bot checks): its quiz was never seen, and
  its rows rest on pop-ups, public pages and an 11-month-old copy of the older Manual app's code. **Hers (US)\*** and
  **Oxford Online Pharmacy\*** were also not walked live. **Sons†** and **Ro†** were still in final review when this
  work started (their stage 2 data is complete). **XYON‡** was never independently verified. Where a point below leans
  on one of these, the mark is shown.
- **Unread references.** NICE CKS, the BNF and the UKTIS pregnancy monographs could not be opened by the research
  machine. The full text of the oral minoxidil expert consensus (Akiska 2025) was confirmed only partly first-hand for
  men [clinical-men verification row 23] and fully for women [clinical-women verification claim 9]. All of these must be
  read before the clinical protocol is signed off (section 8 and the checklist at the end).
- **Not legal or tax advice.** The regulation file recommends legal and regulatory advice before launch
  [uk-regulation, Summary 10].

### Words used in this draft

- **Pattern hair loss:** the common, inherited type. In men, the hairline goes back at the temples and the crown
  thins (male pattern hair loss). In women, the parting widens and the top thins while the front hairline usually stays
  (female pattern hair loss, FPHL).
- **DHT (dihydrotestosterone):** a hormone made from testosterone that shrinks genetically sensitive hair follicles.
- **5-ARI (5-alpha-reductase inhibitor):** the drug family that lowers DHT: finasteride and dutasteride.
- **Telogen effluvium (TE):** sudden, all-over shedding that starts about 3 months after a trigger such as childbirth,
  a high fever, crash dieting or a new medicine. It usually regrows by itself and does not need a hair-loss medicine.
- **Scarring alopecia:** hair loss where the follicle is destroyed. It is permanent, so it needs urgent face-to-face
  care.
- **Licensed:** the medicine has a UK marketing authorisation for that use. **Off-label:** a licensed medicine used
  outside its licence (for example minoxidil tablets, licensed for severe high blood pressure, used for hair).
  **Unlicensed "special":** a medicine made for one named patient with no licence at all.
- **GN14:** MHRA Guidance Note 14 on specials. It says a licensed medicine, even used off-label, comes before a special,
  and that cost or convenience is not a reason to use a special [uk-regulation 1.5].
- **Vehicle (base):** the liquid, foam or gel that carries a drug onto the scalp. It decides how the product feels and
  who reacts to it. **Propylene glycol (PG)** is a solvent in minoxidil solutions and the usual cause of minoxidil
  "allergy" [clinical-men 3.1].
- **POM:** prescription-only medicine. **GSL:** general sale list (can be sold anywhere). **P:** pharmacy medicine.
- **GPhC:** the pharmacy regulator. **MHRA:** the medicines regulator. **ASA:** the advertising regulator.
- **DMCCA:** the Digital Markets, Competition and Consumers Act 2024, which brings new subscription rules expected from
  1 January 2027 [uk-regulation 6.3].

---

## 1. Name, promise and who it is for

### 1.1 Working names (pick one, then check it)

| Option | Why it fits the angle |
|---|---|
| **Root Cause** (for example "Root Cause Hair") | Says the core idea in two words: find out why before treating. A light pun on hair roots |
| **Parting & Crown** | Names the two places women and men usually thin. Signals from the start that the service is for both |
| **Measured** (for example "Measured Hair Care") | Says the third promise: progress is measured, not guessed |

Before using any name:

- Check it at **Companies House** (including whether any word is a "sensitive word" that needs approval) and on the
  **UK trade mark register** (UKIPO), and check the web address is free. **[to verify]**
- Never put a medicine name in the company name or the web address. MHRA guidance says web addresses must not name
  prescription-only medicines in their core URL [uk-regulation 2.2].
- Avoid "doctor" in the name if the prescribers are pharmacists. The GPhC requires the website to say whether the
  prescriber is a doctor or a pharmacist [uk-regulation 3.2], and the name should not suggest otherwise. **[our view]**

### 1.2 One-line promise

> **"We find out why your hair is thinning before we treat it, treat it the way the evidence supports, and show you
> whether it is working."**

This promises a service, not a result. It names no medicine, so it can go on the home page and in adverts
[uk-regulation 2.2; "You can" list]. It avoids "guaranteed", "best", "strongest" and "clinically proven"
[uk-regulation "You cannot say or do"].

### 1.3 Who it is for

| Group | Why they come to us |
|---|---|
| Men aged 18 and over with gradual thinning at the temples or crown | A real diagnosis, licensed medicines first, honest prices without a long prepaid plan, and real follow-up of mood and sexual function on finasteride |
| Men worried about finasteride, or who had side effects on it | Balanced counselling, a recorded baseline, and a properly dosed non-tablet or non-finasteride route |
| Women aged 18 and over with a widening parting | A women's pathway built from women's medicine: periods, PCOS (polycystic ovary syndrome), menopause, contraception, pregnancy plans, bloods when needed, and spironolactone that can be stepped up. Six of the 12 UK companies studied treat men only [cross-company 4.9] |
| Women and men with sudden shedding (after childbirth, illness, crash dieting, weight-loss injections or a new medicine) | We tell them what it is, check for causes, and do not sell a long-term prescription they do not need. Nobody else does this [cross-company 5] |
| People let down by "tick-box" services | A named prescriber who looks at their photos, and a plan they can see before they pay |

**Who it is not for (we say so on screen, with a next step):** under-18s; anyone with signs of scarring, patches,
eyebrow loss, a receding hairline (women) or rapid androgen signs (they are referred); women who are pregnant, trying
to conceive or breastfeeding (advice and safe scalp care only); and, until legal advice is taken, people in Northern
Ireland, where a different pharmacy regulator applies and the rules were not researched [uk-regulation verification,
missing item 2]. Wales was also not checked [uk-regulation 4.3]. People on gender-affirming hormones need their own
protocol: the research files do not cover them, so they go to a prescriber call at launch and a written protocol must
follow. **[to verify]**

---

## 2. The edge: how we beat each rival, point by point

Read each table as: what the rival does (with how we know), and what we do instead. Each table ends with where the
rival is stronger than us, so the owner knows where not to fight.

### 2.1 Hims UK (with Hers UK for women)

| Where Hims UK falls short | What we do instead |
|---|---|
| The anonymous quiz is not a consultation. All 42 answers were tested and none changed anything; everyone, even a man with no hair loss, got "Great news" and then an email box [obs, verified] | Every question we ask changes something or is cut. Answers act on screen: stop, remove, add, or flag, each with one plain sentence |
| Nothing is shown before the email: no product, no strength, no price [obs] | The provisional plan, what is ruled out and why, and every price appear **before** any account |
| No age, sex, medical, mood, medicine, scalp-symptom or onset-speed question before the wall [obs] | Stop questions (age, red flags, crisis, pregnancy) come first, before any contact details |
| Flagship products are compounded (unlicensed) in one fixed strength each: topical finasteride 0.3% with minoxidil 6% or 7%; a chew with finasteride 1.1 mg and minoxidil 3 mg [code] | Licensed first. Separate medicines so one can be stopped or changed alone. Minoxidil never above 5%, because the one trial of 10% found it worse than 5% and more irritating [clinical-men 3.1] |
| No photo step in the quiz; terms only say photos "may" be asked for [obs/docs] | A guided photo set from every new patient before the first prescription, kept as the baseline |
| Cheap prices need 6 or 12 months paid up front (£16.50 a month only on a 6-month plan); cancelling is by message to support only [code/docs] | Monthly by default at a price close to rivals' 6-month price; cancel online in two taps, by the same route as joining |
| Women go to a separate brand (Hers UK) that asks for a name on screen one; its spironolactone is a fixed 44 mg inside a compounded capsule, below the 50 mg NHS starting dose, with no way to step up [obs/code] | One service for both sexes. Spironolactone from licensed tablets, stepped up on the NHS schedule, with kidney and potassium checks [clinical-women 3.3] |
| No dutasteride, no oral minoxidil in adjustable doses, no blood tests for hair in the men's range [docs/code] | A written step-up ladder including oral minoxidil from a licensed tablet (1.25, 2.5 or 5 mg) and dutasteride after 12 months of finasteride, with bloods when the history points to them |

**Where Hims UK is stronger:** money (its owner spent US$919m on marketing in 2025 [market-economics 5.3]), a
friction-free quiz, a wide fallback range, and good data controls (answers kept 7 days, "Delete my answers") [obs].
We copy the data controls. We do not try to out-spend them.

### 2.2 Voy\* (formerly Manual)

\*Voy's real quiz was never seen. These points rest on its pop-ups (observed), public pages and old app code.

| Where Voy falls short | What we do instead |
|---|---|
| Its pop-up takes an email first and only then says "You aren't eligible", with no reason or referral [obs] | We never take contact details from someone we cannot treat. A stop screen explains why and gives a next step, plus a printable summary for their GP |
| Its pattern picker promises 50% to 63% "saw regrowth" for advanced stages its own pop-up refuses [obs] | Honest expectations at the start: the main aim is to stop further loss; regrowth is modest and takes 6 to 12 months to judge [clinical-men 11] |
| The GPhC found in March 2026 that its prescribing service did not independently verify patients' answers; in August 2026 it took statutory enforcement action, mainly over POM advertising and a first-order discount (standards met again in October 2026) [uk-regulation 3.5] | Independent checks built in: photos, ID, GP details and sharing, a verified blood pressure before oral minoxidil, and a video call for off-label medicines. No headline discounts on prescription medicines |
| 10% minoxidil spray and unlicensed oral minoxidil capsules, though licensed 2.5 mg tablets exist [docs] | Minoxidil 5% at most on the scalp; oral minoxidil from the licensed tablet (MHRA GN14 says licensed, even off-label, comes first) [uk-regulation 1.5] |
| Women get minoxidil only, for every cause it lists (hormonal, menopause, after childbirth); no blood test on the hair pages [docs] | Cause-finding first, bloods when needed, spironolactone where appropriate, and a shedding route with no medicine |
| Headline prices are first-order offers on 6-month plans; the complete plan bills £33.17 a month on 6 months and £44 monthly (search summary) [docs] | One standing price for each plan length, shown in full before sign-up. No introductory price that jumps later |

**Where Voy is stronger:** size, an in-house pharmacy and prescribers, delivery advertised in under 48 hours, and
pause, switch and cancel in the account [docs]. We must match the account controls and delivery speed.

### 2.3 Hair + Me

| Where Hair + Me falls short | What we do instead |
|---|---|
| No medical answer changes anything. Heart disease, phaeochromocytoma (a rare adrenal tumour), an infected scalp, depression, patchy or sudden loss and even "no hair loss" all reach the same bag [obs, 68 replays, verified] | Our engine acts on every safety answer on screen, before payment |
| The bag says only "Personalised treatment": no drug, strength or format is named before payment [obs] | The result screen names the medicine, the strength, the form, why it was chosen and what was ruled out |
| Photos are optional and asked for after payment [docs] | Photos are required for every new patient and reviewed before the first prescription |
| The format preference (drops or capsules) is asked before the safety questions and is not binding; "asked for tablets, sent a topical" is 5% of its negative reviews [obs; customer-voice] | Preferences are asked last, after safety, and honoured. If we cannot honour one, we say why |
| Women: one combined pregnancy question; nothing on contraception (needed for tretinoin), periods, menopause or HRT; no anti-androgen [obs/docs] | A full women's route (section 4.4) and stepped spironolactone |
| All 16 formulas are compounded specials; no licensed product at all [docs] | Licensed first; specials only for a recorded clinical need |
| Bills every 4 weeks, so £34.99 is £37.91 a calendar month; first three orders £14.99 [obs] | Calendar-month billing at one honest price |

**Where Hair + Me is stronger:** ease (40% of its positive reviews), a pet question with a "Better for pet owners"
badge, a route for pregnant women (niacinamide drops), two 0 to 10 wellbeing scores from day one, and a well-written
finasteride consent screen with an opt-out [obs/docs]. We copy the pet question, the outcome scores and the consent
screen. For pregnancy we follow the UK product information: advice and safe scalp care only [clinical-women 3.12].

### 2.4 Sons†

†Sons was still in final review. Its pre-wall questions were observed; its plan logic was read in code and run offline.

| Where Sons falls short | What we do instead |
|---|---|
| No plan, product or price until the man gives name, email, phone, date of birth and a password [obs] | Full result and prices before any account |
| "Random patches", "completely bald" and sudden onset are not stopped or referred; sudden onset still offers a minoxidil spray [obs/code] | These stop the sale and point to the GP or dermatology, with a reason |
| "Nearly every day" on its hopelessness question shows no message and no crisis help [obs] | A crisis screen that cannot be clicked past (Strut's good pattern), and a clinician contacts the person if they agree |
| Removals are silent; reasons sit in a hidden "Debug (Dev Only)" block [code] | One plain sentence for every removal and what is still possible |
| "I don't mind" is treated as "oral capsule", leading the undecided to an unlicensed oral minoxidil capsule with biotin [code] | Undecided patients are offered licensed options first, explained side by side. No biotin, which can falsify blood tests including troponin [clinical-men 6] |
| One strength per medicine; topical finasteride 0.15% at 4 pumps (0.664 ml) a day [code] | Strengths matched to the evidence. By simple arithmetic, 0.15% × 0.664 ml is about 1.0 mg of finasteride a day on the scalp [estimate], more than twice the licensed European spray's maximum of about 0.46 mg a day [clinical-men 2.2]. Our topical finasteride is dosed like the licensed product |
| Men only; women stopped at question 2 [obs] | Men and women |
| Sign up online or by phone, cancel by email; retention offers of 40% then 50% off [customer-voice] | Cancel by the same route as joining; no retention discounts |

**Where Sons is stronger:** it holds UK licences for its own finasteride 1 mg and minoxidil 5% spray, a Spray/Capsule
toggle on every plan, two PHQ-2 mood questions (a standard two-question depression screen), and optional consent to
read the NHS Summary Care Record and tell the GP [code/docs]. We copy the mood screen and the record-sharing consent.
Sons' licensed 5% spray could also be one of our licensed stock lines (Lloyds and Dr Fox already sell it [obs]),
but its own FAQ says it cannot be sold to women [docs].

### 2.5 Numan

| Where Numan falls short | What we do instead |
|---|---|
| A man with suicidal thoughts in the past year gets no stop and no crisis help, only a quiet switch to minoxidil; if his mental-health medicine dose changed in the last 3 months, the suicidal-thoughts question is skipped [obs, verified] | The crisis question is asked of everyone and never skipped. Recent thoughts stop the sale with crisis help on the same screen |
| Product links bypass the safety filter: a product stays featured even when the answers rule out its drug [obs] | One rule engine on the server for every route in: adverts, product pages, repeat orders, second consultations |
| "I do not wish to be considered for finasteride" leaves finasteride featured [obs] | Opt-outs remove the product at once |
| "Review your answers" on every stop lets people change a stopping answer and carry on [obs] | A stop is final for that consultation; any changed answer is shown to the prescriber |
| Any blood-pressure diagnosis removes even topical minoxidil, and so does low blood pressure, which the product information does not require [obs] | Three outcomes, not two: allowed, not allowed, or "prescriber decides and records why". Low blood pressure does not remove topical minoxidil [rule-library 5.4] |
| Regaine solution at £80 for one month; 6% and 10% compounded minoxidil sprays [obs] | Licensed Regaine-type products at a fair price; nothing above 5% |
| Men only [obs] | Men and women |

**Where Numan is stronger:** it shows the full offer and every price before sign-in, warns about early shedding
before sign-in (the only one seen), and has written clinician instructions behind every risky answer [obs/code]. We
copy all three.

### 2.6 Dr Fox

| Where Dr Fox falls short | What we do instead |
|---|---|
| No diagnosis step at all: no age, pattern, duration or photos; the patient declares male pattern loss [obs] | Diagnosis first: pattern, speed, triggers and photos |
| Most stops say "You can change your answer and continue" [obs] | Stops are final in the session and explained |
| High blood pressure or heart disease shows only a GP message; Regaine solution is still sold, though its product information lists high blood pressure as a contraindication [obs; clinical-men 3.1] | Topical minoxidil is not offered with high blood pressure unless the prescriber records a reason, such as GP agreement |
| Two consultations in one session can put its finasteride spray and finasteride tablets in one basket [obs] | Duplicate and conflict checks across the whole account and every order |
| No oral minoxidil, dutasteride or step-up path; no follow-up; men only [obs] | A written ladder with planned reviews at 2 to 4 weeks, 3, 6 and 12 months, for men and women |

**Where Dr Fox is stronger:** price. Finasteride costs £7.25 a month on 168 tablets and its triple spray £12 to £13 a
month, with the full total including fee and delivery shown before sign-in, and no subscription [obs]. A doctor
approves every order before despatch [docs]. **We will not win on price against Dr Fox.** We win on diagnosis,
follow-up, women and side-effect care, and we show our full price just as openly [our view].

### 2.7 The high-street online doctors (Boots, Superdrug, LloydsPharmacy)

| Where they fall short | What we do instead |
|---|---|
| **Boots:** nine red flags at once (including suicidal thoughts, circular patches and a painful scalp) reached the same ID-photo screen and price; refusal comes only after ID, account and payment. Its server does label the order "Danger" for the clinician [obs/code, verified] | Red flags stop the journey on screen, before any personal data |
| **Boots and Superdrug:** the patient picks the drug and pack with no guidance; no scalp photos for most men [obs] | A recommendation with reasons, built from the answers and photos |
| **Superdrug:** men's list never changes, even for finasteride allergy or prostate or breast cancer; no mood question for men; pregnancy and breastfeeding keep Regaine for Women on offer [obs] | Each of these answers acts on screen |
| **LloydsPharmacy:** removals are silent and blunt (any blood-pressure condition removes even the spray); combination packs recommended while out of stock [obs] | One-line reasons; three outcomes; never recommend what cannot be shipped |
| **All three:** men only for prescription treatment (Superdrug offers women only Regaine and supplements) [obs] | A full women's pathway |
| **All three:** no follow-up programme; Superdrug and Boots supply one-off orders only [obs/docs] | A follow-up schedule built into the product |

**Where they are stronger:** trusted brands and store collection (Boots, Superdrug). **LloydsPharmacy has the best
engine in the UK set:** it acts on most clinical risks before sign-in, shows prices, takes a real treatment history,
skips irrelevant questions, asks about pets and shows crisis help [obs, verified]. Superdrug is the only UK company
seen to require photos before ordering (for unusual men's patterns) [obs]. We copy Lloyds' treatment history and smart
skipping, and Superdrug's targeted photo rule, then go further.

### 2.8 The summary of the edge

1. **We diagnose; they sell.** Photos from everyone, the trigger question ("what happened 2 to 4 months before?"),
   weight-loss injections asked by name, and bloods when the story points to them. No UK company in the set does all
   of this [cross-company 4.6].
2. **Our stops are real and come first.** Nobody hands over contact details to be told "no".
3. **Licensed first, written ladder.** Nobody publishes a stepped, licensed-first plan [cross-company 5].
4. **Products dosed and based by the evidence**, not by what sells: no "extra strength", no fixed combination pills,
   no vitamin passengers.
5. **Women's medicine done properly.** The clearest gap in the UK set [products-prices 4.3].
6. **Follow-up and side-effect care with a named prescriber**, kept apart from sales.
7. **The easiest service to leave**, ready for the January 2027 subscription rules.

---

## 3. The product range

### 3.1 How we formulate: six rules that make our products more precise

These rules are the "formulated better" promise. Each comes from the clinical files.

1. **Separate medicines, not fixed mixes.** The MHRA says finasteride 1 mg must be stopped at once if depression or
   suicidal thoughts appear. A combined pill or an all-in-one lotion forces the patient to stop everything or keep
   taking a drug that should stop. No trial of a fixed combination pill was found [clinical-men 3.2, 9].
2. **Strengths that match the trials.** Topical minoxidil at 5% or less (10% did worse than 5% in the only trial)
   [clinical-men 3.1]. Oral minoxidil at the consensus doses from a licensed tablet that can be split [clinical-men
   3.2; clinical-women 3.2]. Topical finasteride dosed like the licensed European spray, not poured on like minoxidil:
   a compounded lotion used at 1 ml of 0.25% gives 2.5 mg of finasteride, more than five times the licensed spray's
   daily maximum of about 0.46 mg, so the licensed product's safety data do not carry over [clinical-men 2.2].
3. **The base chosen for the person.** Solution (contains propylene glycol and ethanol) or foam (no propylene glycol)
   [clinical-men 3.1]. An itch from the solution means a switch to the foam, not a ban on minoxidil. A special base
   only when both licensed forms have failed for a recorded reason.
4. **Pairs only where trials show added benefit.** One DHT-lowering drug (finasteride or dutasteride) with one growth
   drug (minoxidil): 94.1% improved on both against 80.5% on finasteride alone and 59% on minoxidil alone in a
   450-man, 12-month trial [clinical-men 9]. Minoxidil with weekly microneedling [clinical-men 5.1]. Never two 5-ARIs;
   never oral plus topical minoxidil; never oral plus topical finasteride (no trial behind either) [clinical-men 9].
5. **No passengers.** No biotin (it can falsify blood tests, including troponin, and has no benefit without
   deficiency), no tretinoin (it only let once-daily minoxidil match twice-daily in one 31-man trial, and raises
   absorption and irritation), no cetirizine, latanoprost, melatonin, caffeine or steroid in a prescription product
   [clinical-men 3.4, 4, 6, 9].
6. **Specials made to a known standard.** When a special is truly needed, it comes from an MHRA-licensed specials
   manufacturer with stability data and an expiry based on testing, or from our own pharmacy only after a written risk
   assessment [uk-regulation 1.3, 3.3]. Finasteride powder is a hormone-acting drug that pregnant women must not handle,
   so in-house compounding of it needs specialist advice on containment [uk-regulation 3.3]. **[our view: buy
   finasteride specials in, do not make them]**

### 3.2 Price rules

- **One price per plan length, shown in full before sign-up.** All prices include the prescriber, every review, photo
  tracking, messaging and tracked delivery. No first-order discount: the MHRA says special offers on medicine prices
  should not be highlighted, and the GPhC treated a first-month discount on a prescription medicine as an improper
  incentive at Voy [uk-regulation 2.2, 3.5].
- **Monthly by default.** Our monthly price is set at or below what the main subscription rivals charge on their 6-month
  prepaid plans. The UK median for finasteride on 6 months is £22.83 a month; for a finasteride and minoxidil bundle it
  is £31.50 [products-prices 3.6].
- **Optional 3-monthly plan** (about 10% less, billed and shipped every 3 months) offered only after the first review,
  when the plan is settled. **[our proposal]**
- **The first two supplies are one month each,** so the plan can change after the 2 to 4 week check without wasting
  medicine. **[our view]**
- **Every price in this section is our proposal, not a fact.** They must be checked against real wholesaler and
  specials quotes before launch.

### 3.3 Cost of goods: what the files do and do not tell us

The files give **no wholesale or specials price**. What they give:

- A **planning benchmark**: cost of sales was 21.8% of revenue at the Skin + Me group and 22.5% at Hims UK
  [market-economics 5.1, 5.5]. Used below as "planning COGS = 22% of our price" **[estimate]**. At our lower prices the
  true share will be higher, because a generic tablet costs the same whatever we charge.
- **Retail ceilings**: the cheapest retail price seen for the same product. Our cost must be below it.
- For a compounded topical, the only anchor is Dr Fox's retail price of £26 for a 60 ml triple spray (two months)
  [market-economics 5.5].

### 3.4 Men's medicines

#### M1. Finasteride 1 mg tablet

- **Actives and strength:** finasteride 1 mg, one tablet daily [clinical-men 2.1].
- **Form:** film-coated tablet (generic; Propecia on request at its higher price).
- **Who for:** men 18+ with male pattern hair loss, after the mood and sexual-function questions. First-line,
  alone or with minoxidil.
- **UK legal route:** licensed POM used within licence [clinical-men 2.1].
- **Evidence grade:** Strong [clinical-men 8]. About half of men see visible regrowth and about nine in ten hold their
  ground over five years [clinical-men 2.1].
- **Price:** £20 a month rolling; £54 per 3 months (£18 a month) after the first review. A year costs £216 to £240,
  against £240 at Numan (annual billing), £245 at Boots, £272 at Sons† and £276 at Hims UK [products-prices 3.2].
- **Cost of goods basis:** no wholesale price in the files. Retail ceiling: Dr Fox sells 168 tablets for £43.50
  (£7.25 a month) [obs]. Planning COGS: £4.40 a month **[estimate]**.
- **Why it beats the closest rival product:** the same licensed tablet as everyone, but monthly at a price others give
  only on long prepaid plans, plus what the MHRA asks for and rivals do not show: a recorded mood and sexual-function
  baseline, patient-card information in writing, and reviews at set times [clinical-men 10.1, 10.3]. Dr Fox is cheaper
  and we say so; we include follow-up they do not.
- **To verify:** lactose content of each brand we stock against its product information (companies say the tablets
  contain lactose; not checked in the SmPC) [rule-library 5.3 F11].

#### M2. Minoxidil 5% scalp solution or spray

- **Actives and strength:** minoxidil 5%; 1 ml twice daily to a dry scalp, maximum 2 ml a day [clinical-men 3.1].
- **Form and vehicle:** licensed solution or pump spray. Contains propylene glycol and ethanol (for example Regaine 5%
  solution: PG 500 mg/ml, ethanol 280.53 mg/ml; a generic 5% spray: PG 350 mg/ml, ethanol 510 mg/ml) [clinical-men 3.1].
- **Who for:** men 18 to 65 with pattern loss and a healthy scalp, without high blood pressure (unless the prescriber
  records a reason) [clinical-men 3.1, 10.2].
- **UK legal route:** licensed GSL or P medicine used within licence (18 to 65). Over 65: off-label, prescriber records
  why and tells the GP [rule-library 5.1 S6]. Candidate stock: Sons' own licensed 5% spray (sold by Lloyds and Dr Fox)
  or a generic 5% spray [obs].
- **Evidence grade:** Strong [clinical-men 8]. +18.6 hairs/cm² at 48 weeks against +3.9 for the vehicle (the base
  without the drug) [clinical-men key fact 10].
- **Price:** £17 a month; £46 per 3 months.
- **Cost of goods basis:** retail ceiling: Sons 5% at Dr Fox £19.95 for one month, £14.98 a month on 6 [obs]. Planning
  COGS: £3.74 **[estimate]**.
- **Why it beats the closest rival product:** Voy, Numan and Hims sell 6% to 10% "extra strength" compounded sprays
  that the evidence does not support [products-prices 5.3]. We use the strength that works, warn about the early shed
  (2 to 6 weeks) before the first dose, and switch base instead of stopping if it itches.

#### M3. Minoxidil 5% foam (propylene-glycol-free)

- **Actives and strength:** minoxidil 5%; 1 g (half a capful) twice daily, maximum 2 g a day [clinical-men 3.1].
- **Form and vehicle:** licensed aerosol foam. No propylene glycol; contains ethanol (536.3 mg/g), butylated
  hydroxytoluene, cetyl and stearyl alcohol [clinical-men 3.1]. Half the blood exposure of the solution (AUC 8.81
  against 18.71 ng·hr/ml) [clinical-men 3.1].
- **Who for:** men whose scalp itched or reddened on the solution; men who prefer a foam.
- **UK legal route:** licensed GSL medicine used within licence for men **18 to 49**. Over 49 it is off-label: the
  prescriber records why (usually: solution not tolerated) [clinical-men 3.1].
- **Evidence grade:** Strong (the foam trial: +21.0 against +4.3 hairs/cm² at 16 weeks) [clinical-men 3.1, 8].
- **Price:** £24 a month; £65 per 3 months.
- **Cost of goods basis:** retail ceiling: Regaine foam at Dr Fox £29.50 for one month, £20.33 a month on 6 [obs].
  Planning COGS: £5.28 **[estimate]**. The foam is an "extremely flammable aerosol" [clinical-women 3.1]: courier rules
  for posting it are not in the files **[to verify]**.
- **Why it beats the closest rival product:** most "minoxidil allergy" is really propylene glycol; no company in the
  set switches the patient to the foam, they either remove all minoxidil or do nothing [rule-library 3.7]. We switch.

#### M4. Oral minoxidil from a licensed tablet (low dose)

- **Actives and strength:** minoxidil 1.25 mg (half a Loniten 2.5 mg tablet), 2.5 mg or 5 mg once daily. Usual start
  2.5 mg; range 1.25 to 5 mg [clinical-men 3.2]. In a 100-man trial, 5 mg was not better than 2.5 mg (figures from a
  news summary, provisional) [clinical-men 3.2].
- **Form:** licensed tablet. **Name the brand on the prescription** when the dose depends on splitting: Loniten 2.5 mg
  "can be divided into equal halves"; one generic 2.5 mg tablet's score line "is not intended for breaking"
  [clinical-women 3.2].
- **Who for:** step 2. Men whose topical minoxidil failed, irritated, or cannot be kept up twice daily; men with cats
  at home who prefer a tablet (if clinically suitable) [clinical-men 11; rule-library M8].
- **UK legal route:** licensed POM used **off-label** (licensed only for severe high blood pressure) [clinical-men 3.2].
  Needs: a two-way consultation (video or phone), a verified blood pressure and pulse, a full medicines list, and a GP
  letter [rule-library 5.5 E6; clinical-women 4.0].
- **Evidence grade:** Moderate. Not better than topical 5% in two head-to-head trials; its value is convenience
  [clinical-men 1, 8]. Extra body or facial hair in 15.1% in a 1,404-patient cohort and 49% at 5 mg in a trial
  [clinical-men key facts 13, 14].
- **Price:** £22 a month; with M1 finasteride £36.
- **Cost of goods basis:** retail ceiling: licensed 2.5 mg tablets at Oxford\* £22.49 for 30 (£19.17 a month on 6) [docs].
  Planning COGS: £4.84 **[estimate]**.
- **Why it beats the closest rival product:** Sons†, Voy\* and Hair + Me supply oral minoxidil as unlicensed capsules
  (Sons and Voy add biotin) although licensed tablets exist; GN14 says licensed first [cross-company 4.7]. Hims UK puts
  3 mg in a chew with finasteride and vitamins, a strength no licensed tablet makes [code]. Ours is the licensed tablet,
  in three dose steps, with a verified blood pressure, which no company in the set checks [engines-experience 3].

#### M5. Dutasteride 0.5 mg capsule (step 3)

- **Actives and strength:** dutasteride 0.5 mg once daily [clinical-men 2.3].
- **Form:** soft capsule, swallowed whole; cannot be split; leaking capsules must not be handled by women
  [clinical-men 2.3].
- **Who for:** men with an inadequate response after **12 months** of finasteride plus minoxidil taken reliably. It
  replaces finasteride (never both) [clinical-men 11].
- **UK legal route:** licensed POM used **off-label** (licensed for prostate enlargement) [clinical-men 2.3]. Fresh
  consent: off-label, half-life of 3 to 5 weeks, sperm count still 23% down 24 weeks after stopping, condom if the
  partner is or may be pregnant, PSA halves by 6 months, a precautionary mood warning [clinical-men 2.3, key fact 18].
- **Evidence grade:** Strong for efficacy (7.1 hairs/cm² more than finasteride at 24 weeks in a network
  meta-analysis); long-term hair data thinner than finasteride's [clinical-men 8].
- **Price:** £22 a month; with M2 £34; with M4 £38.
- **Cost of goods basis:** retail ceiling: generic dutasteride at Oxford\* £18.99 for 30, £14.00 a month on 180 [docs].
  Planning COGS: £4.84 **[estimate]**.
- **Why it beats the closest rival product:** in the UK, plain dutasteride is sold only by Treated and Oxford\*, with
  no step-up pathway around it; Hair + Me and Voy\* sell it inside fixed compounded capsules [products-prices 5.2]. Ours
  sits at a defined step, after a defined trial, with new consent and a PSA note to the GP.

#### M6. Finasteride low-volume scalp spray (only with a recorded clinical need)

- **Actives and strength:** finasteride 0.25% w/w (2.275 mg/ml), 50 microlitres per spray (114 micrograms); 1 to 4
  sprays once daily on separate areas; maximum 4 sprays (about 0.46 mg) a day; leave on at least 6 hours. This copies
  the European licensed product exactly [clinical-men 2.2].
- **Form and vehicle:** low-volume hydroalcoholic spray (the licensed product uses ethanol, propylene glycol,
  hydroxypropyl chitosan and water) [clinical-men 2.2].
- **Who for:** a narrow group. Men with a recorded clinical reason not to take the tablet, for example inability to
  swallow tablets, or an intolerance to a tablet ingredient (MHRA's own examples) [uk-regulation 1.5]. **Not** for men
  who had mood change or lasting sexual effects on any 5-ARI: topical is not a way round the warning [rule-library F2].
  Not with a partner who is or may be pregnant, or young children who touch the scalp, unless strict transfer advice
  is accepted [rule-library F6].
- **UK legal route:** unlicensed in the UK (no topical finasteride on the emc or MHRA register on 23 November 2026)
  [clinical-men key fact 21]. MHRA order of preference: an **imported product licensed in its country of origin**
  ranks above a **UK-made special** [uk-regulation 1.5]. So: first choice, an EU-licensed spray (names seen include
  Fynzur, Finjuve, Caretopic, Fincrezo) [clinical-men 2.2]; second choice, a UK special from an MHRA-licensed specials
  manufacturer made to the same design. How we would source an imported licensed product is not covered by the
  research files **[to verify with a regulatory adviser]**. Re-check the MHRA register before launch: a UK licence
  could appear [clinical-men 2.2].
- **Evidence grade:** Moderate (one phase III trial, 24 weeks: +20.2 against +6.7 hairs; blood DHT fell 34.5% against
  55.6% on the tablet; only 55% of men had usable counts; no data beyond 6 months) [clinical-men 2.2, 8].
- **Price:** £28 a month **provisional**, after quotes. Anchor: ZAVA Germany sells the licensed spray from EUR 75.32
  (pack size not recorded) [us-intl sweep, not fact-checked].
- **Cost of goods basis:** unknown. Anchor for a UK compounded spray: Dr Fox's £26 retail for 60 ml [market-economics 5.5].
- **Why it beats the closest rival product:** rivals' finasteride sprays are mixed into minoxidil (and often tretinoin)
  at strengths and volumes with no licensed equivalent: Sons† 0.15% at 0.664 ml a day, Hims UK 0.3% with minoxidil 6%,
  Numan 0.1% with minoxidil 10% and azelaic acid, Dr Fox 0.3% with tretinoin [code/obs]. Ours is a single drug at the
  dose of the only product with a phase III trial, given only to men who need it, with the same mood warnings as the
  tablet in writing (a special has no patient card) [clinical-men 10.1].
- **Note:** the licensed minoxidil products say they should not be used with other scalp medicines [clinical-men 3.1].
  Using M6 with topical minoxidil is therefore off-label use of the minoxidil, and is a prescriber decision with a
  recorded reason; pairing M6 with oral minoxidil (M4) avoids the issue [our view].

### 3.5 Women's medicines

#### W1. Minoxidil 5% foam, once daily

- **Actives and strength:** minoxidil 5%, 1 g (half a capful) once daily; do not exceed 1 g a day [clinical-women 3.1].
- **Form and vehicle:** licensed foam (Regaine for Women Once a Day), no propylene glycol [clinical-women 3.1].
- **Who for:** women 18 to 65 with a **confirmed** diagnosis of female pattern hair loss, not pregnant or
  breastfeeding, no high blood pressure, healthy scalp. Suits women who cannot face a twice-daily liquid.
- **UK legal route:** licensed GSL medicine used within licence. Any other use (shedding after childbirth, traction,
  no family history, over 65) is off-label and a prescriber decision with recorded reasons [clinical-women 3.1, 4.0].
- **Evidence grade:** topical minoxidil roughly doubles the chance of noticeable regrowth (Cochrane: 26% against 14%;
  moderate-quality evidence for regrowth) [clinical-women 3.1, verification claim 5]. Foam: +13.4 against +4.3
  hairs/cm² at 24 weeks [clinical-women 3.1]. Stop if no improvement by 24 weeks.
- **Price:** £26 a month; £70 per 3 months.
- **Cost of goods basis:** retail anchor: Oxford\* lists the 5% foam at £34.80 (pack length not recorded) [docs].
  Planning COGS: £5.72 **[estimate]**.
- **Why it beats the closest rival product:** Superdrug keeps Regaine for Women on offer in pregnancy with no warning
  [obs]; Voy's\* strengths for women are not published [docs]. Ours follows a photo-confirmed diagnosis, a pregnancy
  and blood-pressure check, an early-shed warning, and a 6-month photo review.

#### W2. Minoxidil 2% solution, twice daily

- **Actives and strength:** minoxidil 2%, 1 ml twice daily, maximum 2 ml a day [clinical-women 3.1].
- **Form and vehicle:** licensed solution (Regaine for Women Regular Strength).
- **Who for:** as W1, for women who prefer a liquid or react to the foam. Stop if no improvement after one year.
- **UK legal route:** licensed GSL medicine used within licence (18 to 65).
- **Evidence grade:** as W1; the Cochrane pooled regrowth result is mainly for 2% [clinical-women verification claim 5].
- **Price:** £20 a month; £54 per 3 months.
- **Cost of goods basis:** retail anchor: Oxford\* £27.77 (pack length not recorded) [docs]. Planning COGS: £4.40
  **[estimate]**.
- **Why it beats the closest rival product:** we never give a woman the **men's** 5% solution as a routine supply. Its
  product information lists use in women as a contraindication [clinical-women 3.1]. That makes it a recorded
  prescriber decision only.

#### W3. Oral minoxidil from a licensed tablet (women)

- **Actives and strength:** start 1.25 mg daily (half a Loniten 2.5 mg tablet; the consensus start for women); range
  0.625 to 5 mg. A 0.625 mg dose (a quarter tablet, as one NHS trust uses) is approximate and outside every product
  information; we tell her so [clinical-women 3.2]. Raise slowly only if tolerated and wanted.
- **Form:** licensed tablet; brand named on the prescription because the dose depends on splitting.
- **Who for:** tier B. Female pattern hair loss where topical minoxidil was not tolerated, did not work after a fair
  trial, or leaves residue she cannot manage; no cardiac or kidney precautions; effective contraception or unable to
  conceive [clinical-women 4.3].
- **UK legal route:** licensed POM used **off-label**. The product information says it "is not recommended during
  pregnancy and in women of childbearing potential not using contraception" [clinical-women 3.2]. Needs a two-way
  consultation, verified blood pressure and pulse, contraception check, and a GP letter [clinical-women 4.0].
- **Evidence grade:** low-dose oral minoxidil has not been shown to work better than topical minoxidil in women, and the
  trials are too small to prove it works equally well; there is no placebo-controlled trial in women
  [clinical-women key fact 18].
- **Honest counselling:** extra facial hair is likely at 1 mg: 73% in a double-blind trial that examined for it
  [clinical-women key fact 19].
- **Price:** £20 a month.
- **Cost of goods basis:** as M4 (half a tablet a day halves the tablet count). Planning COGS: £4.40 **[estimate]**.
- **Why it beats the closest rival product:** Hers UK's oral minoxidil cannot start below 1.5 mg and comes with
  biotin, vitamins and zinc in a compounded pill [code]; Hair + Me's capsules are compounded at £37.91 a calendar month
  [obs]. Ours is licensed, starts at the consensus dose, and comes with a verified blood pressure and a GP letter.

#### W4. Spironolactone tablets, stepped

- **Actives and strength:** NHS schedule: 50 mg daily for a month; if tolerated and bloods are normal, 100 mg, then
  150 mg, to a maximum of 200 mg [clinical-women 3.3]. The international PCOS guideline cites 25 to 100 mg as the
  lower-risk range [clinical-women 3.3]. Tablet strengths to stock: confirm against the product information and BNF
  **[to verify]**.
- **Form:** licensed tablet (Aldactone and generics).
- **Who for:** tier B. Female pattern hair loss, especially with signs of androgen excess (PCOS, acne, unwanted hair),
  effective contraception in place, normal kidney function and potassium [clinical-women 4.3].
- **UK legal route:** licensed POM used **off-label** [clinical-women 3.3].
- **Safety built in:** U&E (kidney function and potassium) before starting in everyone; repeat potassium after starting
  and after dose rises in women aged 45 or over or with risk factors (10.1% of women aged 45+ developed high potassium)
  [clinical-women 3.3, key fact 22]; potassium in the first cycle if she takes a drospirenone pill such as Yasmin
  [clinical-women 3.3]; pregnancy and contraception asked at **every** review (seven pregnancies occurred in the UK SAFA
  trial despite advice) [clinical-women 3.3].
- **Evidence grade:** low quality. 56.6% of women improved in pooled studies (65.8% with another treatment, 43.2%
  alone); no placebo-controlled trial [clinical-women key fact 21].
- **Price:** £18 a month (plus the baseline U&E at its published price); with W3 £32; with W1 £38.
- **Cost of goods basis:** no price in the files **[quote needed]**. Planning COGS: £3.96 **[estimate]**.
- **Why it beats the closest rival product:** the only anti-androgen in the UK set is Hers UK's fixed 44 mg capsule,
  below the 50 mg NHS start and impossible to step up [products-prices 4.3]. Ours follows the NHS schedule with the
  monitoring the evidence supports. Nobody in the UK set sells stepped spironolactone [products-prices 5.2].

#### W5. Iron, only for a proven deficiency

- **What:** one tablet a day of ferrous sulfate, fumarate or gluconate (every other day if not tolerated), per the
  British Society of Gastroenterology [clinical-women 3.10].
- **Who for:** ferritin below 30 µg/L with normal haemoglobin (treat and find the cause, GP letter); ferritin 30 to 40
  with shedding (a time-limited trial, with honest words that the hair evidence is weak) [clinical-women 2.2].
  **Low haemoglobin with low ferritin is a GP referral, not a sale** [clinical-women 2.2].
- **UK legal route:** licensed medicine (legal class of the pack we choose to confirm) **[to verify]**.
- **Price:** at cost plus a small published margin **[our proposal]**. We do not sell iron, vitamins or "hair
  supplements" to people with normal results.

### 3.6 For both sexes

#### S1. Ketoconazole 2% shampoo (only with dandruff or seborrhoeic dermatitis)

- **Use:** wash twice weekly for 2 to 4 weeks, leave on 3 to 5 minutes, then once every 1 to 2 weeks
  [clinical-women 3.8].
- **UK legal route:** licensed medicine used **within licence** for dandruff or seborrhoeic dermatitis (GSL and P packs
  exist) [clinical-women 3.8]. We do not sell it as a hair-growth product: the hair evidence is weak (five small
  studies, no placebo-controlled hair-count trial) [clinical-men 4.1].
- **Open question:** whether a rinse-off medicated shampoo counts as "another scalp medicine" under the minoxidil
  product information is not settled. The clinical lead must write a rule before launch [rule-library 5.3 M7].
  **[to verify]**
- **Price:** at a small published margin over cost **[quote needed]**.
- **Why it beats rivals:** Hims UK put ketoconazole inside a leave-on compounded spray [code], which has no trial
  evidence [clinical-men 4.1]. We treat the flaky scalp on its own licence, which also helps minoxidil tolerance.

#### S2. Minoxidil in an alternative base (special, recorded need only)

- **Actives:** minoxidil 5% for men; 2% (or 5% once daily, a prescriber decision) for women [clinical-women 3.1].
- **Vehicle:** without propylene glycol and lower in alcohol. Named alternatives in the literature: butylene glycol,
  polysorbate, glycerol; a negative patch test does not guarantee tolerance [clinical-men 3.1].
- **Who for:** a person who reacted to **both** the licensed solution and the licensed foam, with the reaction recorded
  (GN14's own example: intolerance to an ingredient) [uk-regulation 1.5]. Not for preference or convenience.
- **UK legal route:** unlicensed special from an MHRA-licensed specials manufacturer, with stability data
  [clinical-men 3.1]. Patient told in writing it is unlicensed and what that means [uk-regulation 3.3].
- **Evidence grade:** minoxidil itself Strong; the effect of the new base on absorption and results is unknown
  [clinical-men 3.1].
- **Price:** £28 a month provisional. **Cost basis:** unknown **[quote needed]**.
- **Why it beats rivals:** Hair + Me and Hims UK each sell one PG-free product, but no company lets a patient keep the
  same drug and change only the base [products-prices 5.2].

#### S3. Blood tests (ordered only when the answer would change the decision)

| Panel | When we order it | Source |
|---|---|---|
| **Core diffuse panel:** full blood count (FBC), ferritin, thyroid (TSH) | Women with diffuse shedding or thinning without a clear pattern, shedding over 6 months, or heavy periods, restricted diet, rapid weight loss or a weight-loss injection. Men only when the story suggests something more than pattern loss (restrictive diet, weight loss, bowel disease) | [clinical-women 2.1, 4.2; clinical-men 6] |
| **Androgen panel:** early-morning total testosterone and SHBG (sex hormone binding globulin), giving the free androgen index; add prolactin, FSH and TSH if periods are infrequent | Women with irregular periods, hirsutism (unwanted hair), acne or male-pattern loss. **Not** on the combined pill (results unreliable) | [clinical-women 2.3, 4.2] |
| **Safety panel:** U&E (kidney function and potassium) | Before spironolactone in everyone; repeat by age and risk | [clinical-women 3.3] |
| **Not routinely:** vitamin D, B12, folate, zinc | Only for another clinical reason | [clinical-women 2.1] |

- Ask about **biotin** before every test [clinical-women 2.4].
- **Price:** published per panel after laboratory quotes **[quote needed]**. Anchors: Oxford\*'s women's programme costs
  £75.99 including tests and 3 months of an unnamed treatment [docs]; Superdrug sells a hair blood test at £99
  [sweep, not fact-checked]. Sample collection method (home kit or partner clinic) and laboratory choice are not
  covered by the files **[to verify]**.
- **Why it beats rivals:** 18 of 19 companies offer no blood tests for hair; Oxford\* has the right tests but hides the
  medicine [cross-company 4.6; products-prices 4.3]. Ours are targeted, named and acted on (section 5.5).

#### S4. Microneedling as a supervised add-on

- **What:** weekly microneedling added to topical minoxidil. **Never on the same day as minoxidil; restart 24 hours
  later** (the rule used in the main trial) and never straight after a finasteride lotion [clinical-men 5.1].
- **Evidence grade:** Moderate as an add-on: about +13 hairs/cm² over minoxidil alone at 24 weeks; 12 small trials,
  weak blinding; microneedling alone ranks below minoxidil [clinical-men 5.1]. Women: ranked first in a women-only
  network meta-analysis, with low to very low certainty [clinical-women 3.11].
- **Unknowns:** the trial used a 1.5 mm roller in clinic; depths from 0.5 to 2.5 mm were used across trials and depth
  made no detectable difference [clinical-men 5.1; clinical-women 3.11]. Safe home-use depth, device classification and
  supplier are not in the files **[to verify]**.
- **Price:** after supplier quote; anchor: Sons sells a dermaroller at £14 [docs].
- **Why it beats rivals:** Sons sells a roller and Happy Head gives one away, but nobody sells the protocol (timing,
  instructions, follow-up) [products-prices 5.2].

#### S5. The shedding programme (no medicine)

- **Who for:** anyone whose story fits telogen effluvium (sudden shedding about 3 months after a trigger).
- **What they get:** a plain explanation of the timeline (shedding lasts 3 to 6 months; regrowth usually follows),
  trigger-specific advice (a new medicine: speak to its prescriber; a weight-loss injection: most people recover while
  continuing; do not stop it for hair alone), bloods if the shedding passes 6 months or there is no clear trigger, and
  free photo check-ins at 3 and 6 months [clinical-women 1.3, 3.13, 4.3].
- **Price:** free. Bloods at their published price when indicated.
- **Why it beats rivals:** nobody asks the trigger question as a timing question, and nobody asks about weight-loss
  injections [cross-company 5]. Selling long-term treatment to people whose hair would regrow feeds the "no results"
  complaint (about 22% of negative reviews as the main complaint) [cross-company 4.3]. This programme is our best
  trust-builder and a source of future patients if pattern loss shows up later. **[our view]**

#### S6. Laser devices: information only, not sold at launch

Moderate evidence in men as an add-on (sham-controlled trials, high heterogeneity) [clinical-men 5.2]. In women, hair
counts rose but women did not rate the laser comb better than sham [clinical-women 3.11]. We give honest information
and do not sell devices at launch. **[our view]**

### 3.7 What we deliberately do not offer, and why

| Not offered | Why (one line) | Source |
|---|---|---|
| Minoxidil above 5% | The only trial of 10% found it worse than 5% and more irritating | [clinical-men 3.1] |
| Fixed combination pills (for example finasteride with minoxidil in one capsule) | No trial; forces stopping everything if mood falls | [clinical-men 9] |
| "All-in-one" lotions with tretinoin, cetirizine, latanoprost, melatonin, caffeine or steroids | No trial of the mixtures; each extra adds irritation and makes reactions hard to trace | [clinical-men 9; products-prices 5.1] |
| Biotin and "hair vitamins" for people without a deficiency | No benefit shown; biotin can falsify blood tests, including troponin | [clinical-men 6] |
| Finasteride or dutasteride for women | Contraindicated in UK product information; the one good 1 mg trial was negative | [clinical-women 3.4] |
| Bicalutamide; cyproterone 50 mg | No added benefit in the only bicalutamide trial and a rare risk of fatal liver injury; cyproterone has a dose-related meningioma risk | [clinical-women 3.5, 3.6] |
| Sublingual minoxidil; topical dutasteride | Weak evidence; unlicensed | [clinical-men 8] |
| Oral plus topical minoxidil together; oral plus topical finasteride together | No trial behind either | [clinical-men 9] |
| Platelet-rich plasma (PRP) | A clinic procedure; not deliverable remotely | [clinical-men 5.3] |
| Investigational drugs (clascoterone, pyrilutamide, extended-release oral minoxidil) | Not licensed in the UK; plan for them only when a UK licence exists | [clinical-men 7] |

### 3.8 The ladder in one view

| Step | Men | Women | Review |
|---|---|---|---|
| 0. Diagnose and set expectations | Photos, history, triggers; stop further loss is the main aim; 6 to 12 months to judge | Same, plus hormones and life stage; bloods when indicated | Before any prescription |
| 1. Licensed first | M1 finasteride and/or M2 or M3 minoxidil (both together from the start for more than mild loss or for the best chance of regrowth) | W1 foam or W2 solution | 2 to 4 weeks, 3 months, 6 months |
| 2. Fix what stops step 1 working | Solution itches: M3 foam. Cannot keep up or failed: M4 oral minoxidil. Wants more: S4 microneedling. Recorded reason not to take the tablet: M6 | Topical not tolerated or failed: W3 oral minoxidil. Androgen signs and contraception: W4 spironolactone (with minoxidil) | 6 months, then 12 months |
| 3. Not enough after 12 months of finasteride + minoxidil | M5 dutasteride replaces finasteride | Increase W3 or W4 within limits | 12 months |
| 4. Refer | Diagnosis in doubt, wants surgery or procedures, nothing worked at 12 months | Same, plus any red flag at any time | Any time |

Sources: [clinical-men 11; clinical-women 4.3, 4.4].

---

## 4. The consultation engine

### 4.1 The rules the engine itself follows

These come from the best-practice rule set [rule-library 5.5, rules E1 to E11] and the design lessons
[engines-experience 6]. Each one fixes something a rival gets wrong.

1. **Stop questions first, before any contact details** (age, pregnancy, red flags, crisis). Nobody answers 40
   questions to be told "see your GP" [clinical-women 4.1].
2. **Every stop gives the reason and a named next step** (GP, dermatology, NHS 111, Samaritans, 999), plus a printable
   one-page summary the person can take to their GP. Never a dead end or an error page.
3. **Three outcomes, not two:** allowed, not allowed, or "prescriber decides and records why". Whole-family removals
   are kept for true contraindications.
4. **One plain sentence for every removal**, and what is still possible.
5. **Every question changes something or is cut.** If an answer only helps the prescriber's diagnosis, the prescriber
   sees it highlighted. Free text is always read by a person.
6. **A stop is final for that consultation.** No "change your answer and continue". If someone goes back and changes a
   stopping answer, the change is logged and shown to the prescriber.
7. **The same rules on every route:** advert links, product pages, repeat orders, a second consultation, an existing
   patient's request. The engine checks the whole account for duplicates and conflicts (for example two 5-ARIs).
8. **Opt-outs are honoured at once.**
9. **Preferences are asked last,** after safety, and only formats the person can have are shown.
10. **Licensed first by default.** The engine can never put an unlicensed special first; only a prescriber can choose
    one, and must record the clinical need.
11. **Rules run on the server and are tested like software:** one automated test per rule, matched to the exact answer
    text, run before every release. (A leading space in one answer made a rival's blood-pressure rule fail silently
    [rule-library 4.1 row 6].)
12. **Smart skipping:** questions that protect a medicine disappear once that medicine is off the table (LloydsPharmacy's
    good pattern) [engines-experience 5.2]. The crisis question is never skipped.
13. **Answers are not stored unless the person chooses to continue.** "Delete my answers" is on every screen (Hims UK's
    good pattern) [engines-experience 5.2]. The data protection impact assessment covers this step [uk-regulation 6.1].

### 4.2 Action codes used in the question tables

| Code | What happens on screen and behind it |
|---|---|
| **STOP-URGENT** | Ends the consultation. Explains why, says "see your GP within days" or "urgent referral", offers a printable GP summary. No contact details asked |
| **STOP-REFER** | Ends the consultation with a routine GP or dermatology signpost and the printable summary |
| **STOP-CRISIS** | A crisis screen on the same page that cannot be clicked past to any sale: 999 if in danger now, NHS 111, Samaritans [rule-library R6]. Offers, but never requires, a call from our prescriber |
| **ROUTE** | Moves the person to another pathway (women's route, shedding programme, prescriber-call route) |
| **EXCLUDE x** | Removes product x, with one plain sentence why |
| **ADD x** | Adds product or check x to the provisional plan |
| **SET x** | Sets a strength or form (for example foam instead of solution) |
| **BLOODS x** | Adds blood panel x (section 3.6, S3), with its price |
| **PHOTO+** | Asks for an extra close-up photo after sign-in |
| **BP** | Requires a verified blood pressure and pulse after sign-in |
| **CALL** | Requires a two-way video or phone consultation before prescribing |
| **GP** | Requires GP details and consent; a GP letter will be sent |
| **FLAG** | Prescriber decides and records why; the reason is shown to the patient in plain words |
| **COUNSEL** | Carry on; advice shown on screen and repeated in writing in the parcel |
| **SKIP** | Later questions that no longer matter are skipped |
| **BASELINE** | Stored as a starting measurement for follow-up |

### 4.3 The journey, and where sign-in comes

```
 BEFORE SIGN-IN (anonymous, about 5 minutes, nothing saved unless chosen)
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ Start screen: "We'll show your result and full price before we ask who   │
 │ you are." Privacy note. Delete-my-answers button on every screen.        │
 │  Stage A  Gates: date of birth, route (sex at birth), where you live;    │
 │           women: pregnancy, contraception                                 │
 │  Stage B  Red flags and wellbeing (crisis question for everyone)         │
 │  Stage C  Diagnosis: where, how fast, what happened before; women:       │
 │           periods, PCOS signs, menopause, HRT                             │
 │  Stage D  Medical history and medicines                                  │
 │  Stage E  Men only, if a 5-ARI is still possible: sexual-function        │
 │           baseline, past 5-ARI effects, fertility, household             │
 │  Stage F  Previous treatment, goals, preferences, pets, hair care        │
 │  RESULT   What we think is going on; the plan with names, strengths,     │
 │           licence status and full prices; what is ruled out and why;    │
 │           what happens next; what to expect. Print or delete.            │
 └──────────────────────────────────────────────────────────────────────────┘
                        │ "Continue to photos and prescriber review"
                        ▼
 SIGN-IN WALL: create an account (email, password; mobile optional for reminders)
                        ▼
 AFTER SIGN-IN
  Stage G  Identity check (date of birth must match Stage A)
  Stage H  GP details and consent; optional NHS record consent
  Stage I  Guided photo set (required for every new patient)
  Stage J  Blood pressure and pulse (only if oral minoxidil is being considered)
  Stage K  Blood test kit (only if flagged)
  Stage L  Information and consent screens (off-label / unlicensed; finasteride
           card information; contraception for tier B; early-shed warning)
  Stage M  Card saved; charged only if the prescriber approves
  Stage N  Prescriber review (and a call if required) → approve, change,
           ask for more, or decline with a GP letter
  Stage O  Second pharmacist's clinical and accuracy check → dispense → tracked delivery
```

### 4.4 Stage A: gates (everyone, first)

| # | Question (patient wording) | Options | What each option does | Why |
|---|---|---|---|---|
| A1 | What is your date of birth? | Date | **Under 18:** STOP-REFER ("Hair-loss medicines are licensed from 18. Please see your GP"). **18 to 65:** continue. **66 to 75:** continue; FLAG for topical medicines (outside licence ages: men's solution 18 to 65, men's foam 18 to 49, women's products 18 to 65), and oral minoxidil only with CALL, BP and GP agreement. **Over 75:** continue for topical and finasteride with FLAG; EXCLUDE starting oral minoxidil | Licence ages [clinical-men 3.1; clinical-women 3.0]. Oral minoxidil has few data over 65 and can cause dizziness on standing; the service must write its own limit [clinical-women 3.2]. The 75 cut-off is **our proposed service rule** |
| A2 | Which route is right for you? We ask about sex registered at birth because some medicines are unsafe in pregnancy or work differently by sex | Male · Female · I'm trans or non-binary, or on hormone treatment such as testosterone or oestrogen | **Male:** men's route. **Female:** women's route. **Third option:** ROUTE to a free prescriber call; no automatic plan | Finasteride, dutasteride and men's 5% solutions are contraindicated in women [rule-library S2]. The research files do not cover gender-affirming hormones, so no automated rule is safe yet **[to verify: write a protocol]** |
| A3 | Where do you live? | England · Scotland · Wales · Northern Ireland · Outside the UK | **England, Scotland:** continue. **Wales:** continue **[to verify Welsh rules before launch]**. **Northern Ireland:** STOP-REFER ("We can't treat people in Northern Ireland yet") until advice is taken. **Outside the UK:** STOP | NI pharmacies have a different regulator and own advertising list; not researched [uk-regulation verification, missing 2]. Wales not checked [uk-regulation 4.3] |
| A4 | *(Women)* Are you pregnant, trying to get pregnant (including fertility treatment), or breastfeeding? | Pregnant · Trying · Breastfeeding · None of these | **Any yes:** no medicines. ROUTE to advice and safe scalp care; if the story is shedding after childbirth, ROUTE to the shedding programme (S5); "come back when you have stopped breastfeeding or after the pregnancy" | Topical minoxidil "should not be used during pregnancy or lactation"; oral options and anti-androgens are worse [clinical-women 3.12]. We follow the UK product information even though one US source is more relaxed about breastfeeding |
| A5 | *(Women)* Could you become pregnant? (You still have periods and no procedure prevents pregnancy) | Yes · No · Not sure | **Yes or not sure:** ask A6. **No:** SKIP A6 | Decides whether oral minoxidil and spironolactone are possible [clinical-women 4.1 Q3] |
| A6 | *(Women)* What contraception do you use now? | None · Condoms only · Combined pill (which one?) · Progestogen-only pill · Implant · Injection · Hormonal coil · Copper coil · Sterilisation (you or partner) · Other | **None:** EXCLUDE oral minoxidil (W3) and spironolactone (W4), with the reason. **Condoms only or Other:** FLAG (the clinical lead must define "effective contraception" in the protocol **[to verify]**). **Combined pill:** note that androgen blood tests are unreliable on it; if it contains drospirenone (for example Yasmin), potassium check in the first cycle of spironolactone. **Long-acting methods or sterilisation:** continue | Anti-androgens can feminise a male fetus; oral minoxidil "not recommended" without contraception [clinical-women 3.2, 3.3, 2.3, key fact 23] |

### 4.5 Stage B: red flags and wellbeing (everyone)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| B1 | Do you have any of these on your scalp? Tick all that apply | Pain, burning or tenderness · Spots with pus, crusts or open sores · Redness or scale stuck around the hairs · Smooth, shiny areas where no hair grows · Itch with flakes, like dandruff · Psoriasis or eczema on the scalp · Sunburn or broken skin now · None | **First four:** STOP-URGENT ("these can be signs of a scarring type of hair loss, which is permanent if not treated quickly"). **Itch with flakes:** COUNSEL; ADD ketoconazole shampoo option (S1). **Psoriasis or eczema:** EXCLUDE topical minoxidil until settled; "treat the scalp first with your GP"; oral options stay. **Sunburn or broken skin:** EXCLUDE topical until healed. **None:** continue | Scarring is permanent and needs urgent referral [clinical-women 1.0, 1.11]. Scalp disease is a contraindication for topical minoxidil [clinical-men 3.1]. This splits scarring signs from ordinary dandruff, which almost no rival does [engines-experience 3] |
| B2 | Do you have any of these? Tick all | One or more separate round bald patches · Loss of eyebrows or eyelashes · Patchy loss in the beard or on the body · *(Women)* Your front hairline is moving back · All the hair on your scalp has gone · None | **Any of the first four:** STOP-REFER (fast-track wording if eyebrows or lashes are going). **All hair gone:** STOP-REFER with honest words that medicine is unlikely to help, and information on other options. **None:** continue | Alopecia areata, tinea, traction or frontal fibrosing alopecia, not pattern loss; a receding hairline in a woman is frontal fibrosing alopecia until proven otherwise [clinical-women 1.8, 1.9, key fact 5; rule-library R2, R3] |
| B3 | How quickly has it happened? | Slowly, over months or years · Suddenly, over a few weeks, with a lot of hair coming out · Not sure | **Slowly:** pattern questions. **Suddenly:** ROUTE to shedding questions (C5 decides); no hair-loss medicine is offered to men on this route, women go to the shedding programme unless C-stage answers also show pattern loss. **Not sure:** continue; photos decide (FLAG) | Sudden loss is not for remote treatment in men; in women it is usually telogen effluvium [clinical-men 10.2; clinical-women 1.3] |
| B4 | Over the last 2 weeks, how often have you been bothered by: (a) little interest or pleasure in doing things; (b) feeling down, depressed or hopeless? | Not at all · Several days · More than half the days · Nearly every day (for each) | Scored as the standard PHQ-2 screen. **Positive screen** (cut-off set by the clinical lead **[to verify]**): show support information at once; FLAG; CALL before any finasteride or dutasteride. Minoxidil is **not** removed | MHRA: ask about depression before finasteride and decide with the patient [clinical-men 10.1]. Minoxidil has no mood warning, so it is never removed for mood [rule-library 5.4] |
| B5 | In the last month, have you had thoughts that you would be better off dead, or of hurting yourself? | No · Yes, in the last month · Yes, between a month and a year ago · Yes, more than a year ago | **In the last month:** STOP-CRISIS. **1 to 12 months ago:** FLAG; CALL before any 5-ARI; support information; minoxidil allowed. **More than a year ago:** FLAG; CALL before any 5-ARI. **No:** continue. **Never skipped**, whatever other answers say | Thoughts of self-harm need crisis help on the screen, never a quiet product swap [rule-library R6]. Numan skips this question after a recent dose change and Sons† shows nothing [cross-company 4.4] |
| B6 | On a scale of 0 to 10, how much is your hair loss affecting your mood or daily life? | 0 to 10 | **BASELINE** (repeated at every review as our patient-rated outcome). **High score** (threshold set by the clinical lead **[to verify]**): offer a prescriber call and support information; FLAG | Moderate to severe distress is a reason to refer [clinical-women 1.2, 1.11]; outcome scores from day one (Hair + Me's good pattern) [engines-experience 5.2] |
| B7 | *(Men)* Have you noticed a lump, pain, swelling or discharge in either breast or nipple? | Yes · No | **Yes:** STOP-REFER ("please see your GP soon") | Male breast cancer has been reported on finasteride [rule-library R7] |
| B8 | *(Women)* In the last year, have you had any of these, and did they come on quickly? Deeper voice · A lot of new hair on the face, chest or tummy · More muscle · Periods stopped (not menopause or pregnancy) · *(After the menopause)* any new face or body hair | Each: Yes, quickly · Yes, slowly · No | **Any "Yes, quickly", or any new androgen sign after the menopause:** STOP-URGENT (urgent endocrine or gynaecology referral). **"Yes, slowly":** continue; BLOODS (androgen panel) via C-stage | Possible androgen-secreting tumour [clinical-women 1.6, 1.11; rule-library R5] |
| B9 | Have you had any of these with the hair loss? Weight loss without trying · Fevers · Night sweats · Joint pains · A new rash · Extreme tiredness | Tick any · None | **Any:** STOP-REFER ("these need a doctor to check for an illness behind the hair loss") | Systemic illness [rule-library R8; clinical-women 1.3]. The source is the women's file; we ask men too **[our view]** |

### 4.6 Stage C: diagnosis (pattern, speed, triggers)

**Men**

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| C1 | Where is your hair thinning? Tick all that apply (pictures) | Temples and front hairline · Crown · Top of the head · All over evenly, including sides and back · Not sure | **Temples, crown, top (any mix):** fits male pattern; continue. **All over evenly:** does not fit male pattern; PHOTO+; ROUTE to shedding questions; if photos confirm diffuse loss, STOP-REFER to GP (optional bloods as in C6). **Not sure:** photos decide (FLAG) | Male pattern is temples and crown; diffuse loss is not for remote treatment [clinical-men 10.2]. Multiple choice lets a man record hairline **and** crown, which Hair + Me's single choice cannot [engines-experience 2] |
| C2 | Which picture looks most like you now? (a set of pattern-stage pictures) | Stages from early to advanced | **BASELINE.** **Advanced stages:** COUNSEL honestly that medicine aims to keep what is left and cannot rebuild bald areas; information on procedures | Honest expectations; copies the LloydsPharmacy and Superdrug expectation screens [engines-experience 4.1] |
| C3 | How long has it been going on? | Under 6 months · 6 to 12 months · 1 to 5 years · Over 5 years | Combined with B3 and C5. **Under 6 months and sudden:** shedding route | Telogen effluvium timing [clinical-women 1.3] |
| C4 | Is the main problem more hair falling out, or hair getting thinner and finer? | Falling out · Thinner and finer · Both | **Falling out:** C5 weighs heavily. **Thinner:** pattern | First sort: shedding or thinning [clinical-women 1.0] |
| C5 | In the 6 months before it started, did any of these happen? Tick all | Illness with a high fever (including COVID-19) or a hospital stay · An operation · A major stress or life event · Fast weight loss or a strict diet · A weight-loss injection (for example semaglutide or tirzepatide) · Started, stopped or changed a medicine (which?) · Started testosterone, anabolic steroids or similar · None | **Sudden shedding + any trigger:** ROUTE to the shedding programme (S5): no hair medicine; timeline and trigger advice. **Gradual thinning + a trigger:** both may be present; photos decide (FLAG). **Weight-loss injection:** explain it is a known cause, most people recover while continuing, do not stop the injection for hair alone. **New medicine:** "speak to the prescriber of that medicine; we will not just add a hair treatment". **Testosterone or anabolic steroids:** COUNSEL (these can drive pattern loss) and FLAG | The trigger question is how a clinician tells shedding from pattern loss; nobody asks it as a timing question, and nobody asks about weight-loss injections [cross-company 5; clinical-women 1.3, 3.13]; steroids [engines-experience 3] |
| C6 | Do any of these apply? Vegetarian or vegan diet · Very low-calorie diet · Bowel disease such as coeliac or Crohn's · Weight-loss surgery | Tick any · None | **Any:** BLOODS (FBC and ferritin). An unexplained low ferritin in a man goes to his GP to find the cause | Blood tests are for the man whose story suggests more than pattern loss [clinical-men 6] |
| C7 | Do you take any supplements? | Biotin or "hair, skin and nails" · High-dose vitamin A · Selenium · Saw palmetto or pumpkin seed oil · Other · None | **Biotin:** COUNSEL to tell any lab before a blood test; we will not add more. **High-dose vitamin A or selenium:** advise stopping (they can cause hair loss). **Saw palmetto:** FLAG (ask about sexual side effects) | [clinical-men 4.8, 6; clinical-women 2.4] |
| C8 | Do you often wear your hair in tight styles (tight ponytail or bun, braids, weaves, extensions)? | Yes · No | **Yes:** COUNSEL to stop the pulling first; PHOTO+ of the edges; FLAG | Traction alopecia [clinical-women 1.7] |

Family history is **not asked of men**: in every engine seen it changes nothing [engines-experience 3], and it changes
no rule for men in the clinical files. It is asked of women, where it does (WC3).

**Women** (A4 to A6, B1 to B9 and C5 to C8 are also asked). For women, C5 adds two options: "Gave birth, or a
pregnancy ended" and "Stopped or changed the contraceptive pill or HRT"; either one with sudden shedding routes to the
shedding programme [clinical-women 1.3, 4.1 Q14]. C6 adds "Heavy periods", which also triggers FBC and ferritin
[clinical-women 4.1 Q30].

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| WC1 | Is the main change a wider parting and thinner hair on top, or a lot of hair falling out all over? | Wider parting, thinner on top, slowly · A lot falling out, suddenly · Both · Not sure | **Wider parting:** FPHL likely. **Falling out, under 6 months, with a C5 trigger:** shedding programme (S5); BLOODS only if severe or no clear trigger. **Falling out over 6 months:** BLOODS (FBC, ferritin, TSH); consider FPHL too; refer if no cause. **Both:** both routes; photos decide | [clinical-women 1.0, 1.3, 4.1 Q12 to Q13] |
| WC2 | Where is it thinnest? (pictures) | Top and crown, front hairline kept · Temples and crown, like a man · At the edges, where hair is pulled · Middle of the crown, spreading out (tightly curled hair) · All over evenly | **Top and crown:** FPHL. **Like a man:** STOP-REFER with a recommendation for androgen tests (male-pattern loss in a woman is a red flag). **Edges:** traction route (C8). **Middle of the crown in tightly curled hair:** ask about tenderness, itch and breakage; low bar to STOP-REFER (possible CCCA, a scarring type). **All over evenly:** shedding questions; BLOODS | [clinical-women 1.2, 1.7, 1.10, 1.11, 4.1 Q15] |
| WC3 | Does anyone in your family have thinning hair (either parent's side)? | Yes · No · Don't know | **Yes:** supports FPHL. **No or don't know:** FLAG: the prescriber confirms the diagnosis from photos and records why, because the licensed minoxidil says it "is not indicated when there is no family history" | [clinical-women 3.1, 4.1 Q17] |
| WH1 | Are your periods regular? Have you gone through the menopause? | Regular · Irregular or stopped (not menopause) · Going through the menopause now · Menopause (no period for a year) · My contraception stops my periods | **Irregular or stopped:** BLOODS androgen panel plus prolactin, FSH and TSH; GP letter. On the combined pill: do not order androgen tests (unreliable); FLAG | [clinical-women 1.5, 2.3, 4.1 Q18] |
| WH2 | Do you have acne, or unwanted hair on your face, chest or tummy? Have you been told you have PCOS? | Acne · Unwanted hair · PCOS diagnosed · None | **Any:** BLOODS androgen panel (unless on the combined pill). **Results fit PCOS:** GP involvement (PCOS also needs diabetes and heart-risk checks). Spironolactone (W4) becomes a sensible option if contraception is in place | [clinical-women 1.5, 4.1 Q19] |
| WH3 | Are you on HRT? Which one? Started, changed or stopped in the last 6 months? | Not on HRT · On HRT, no change · Started or changed · Stopped | **Stopped or changed:** may explain shedding; COUNSEL. We never start or change HRT for hair | [clinical-women 3.9, 4.1 Q20] |

### 4.7 Stage D: medical history and medicines (everyone; rows marked for one sex)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| D1 | Has a doctor or nurse ever told you that you have high blood pressure? | No · Yes, and I take medicine for it · Yes, but I don't take medicine · I have low blood pressure, or I faint or feel dizzy when I stand | **High (either):** topical minoxidil EXCLUDE by default ("its product information says not to use it with high blood pressure; your prescriber can still consider it if your GP agrees"), with a FLAG route via GP. Oral minoxidil: men CALL + BP + full medicines list; women on blood-pressure medicine EXCLUDE; women not on medicine FLAG + GP. **Low or fainting:** EXCLUDE oral minoxidil; topical stays with COUNSEL about dizziness | Licensed topical solution lists treated or untreated high blood pressure as a contraindication [clinical-men 3.1]; low blood pressure (below 90/60) is a precaution for oral only [rule-library 3.3, 5.4] |
| D2 | Have you ever had any of these? Heart failure · Fluid around the heart or pericarditis · Pulmonary hypertension with a narrowed heart valve · Phaeochromocytoma (an adrenal tumour) · A fast or irregular heartbeat · Angina or a heart attack · None | Tick any | **First four:** EXCLUDE oral minoxidil; topical FLAG (doctor's advice first). **Fast or irregular heartbeat:** oral only with GP or cardiology input (FLAG); topical COUNSEL. **Angina or heart attack:** oral EXCLUDE by default (FLAG with GP or cardiology input); topical FLAG | Consensus contraindications and precautions for oral minoxidil [clinical-men 10.2; clinical-women 3.2, 4.1 Q23] |
| D3 | Do you have kidney disease, Addison's disease or a past high potassium level? Are you on dialysis? | Tick any · None | **Kidney disease or dialysis:** oral minoxidil FLAG (GP input needed); women EXCLUDE spironolactone. **Addison's or past high potassium:** EXCLUDE spironolactone | [clinical-men 3.2; clinical-women 3.3, 4.1 Q24] |
| D4 | Do you have liver disease? | Severe liver disease · Other liver disease · None | **Severe:** EXCLUDE dutasteride; FLAG all other oral options. **Other:** FLAG | Dutasteride is contraindicated in severe liver impairment [clinical-men 2.3; clinical-women 4.1 Q25] |
| D5 | *(Men)* Do you have prostate cancer now or in the past, or do you have PSA (prostate) blood tests? Do you take dutasteride or finasteride 5 mg for your prostate? | Prostate cancer · PSA tests · Take dutasteride or finasteride 5 mg · None | **Prostate cancer:** FLAG; GP or urologist agreement before any 5-ARI. **PSA tests:** COUNSEL and GP letter (finasteride lowers PSA, so doubling the result "should be considered"; dutasteride halves it by 6 months). **Already on a 5-ARI:** EXCLUDE all 5-ARIs; minoxidil only; tell the GP | [clinical-men 2.1, 2.3, 10.2; rule-library F4, F7, F8] |
| D6 | Have you ever reacted badly to any of these? Finasteride · Dutasteride · Minoxidil liquid or spray · Minoxidil foam · Propylene glycol · Alcohol on the skin · Lactose · Spironolactone · None | Tick any; then "What happened?" (itch, redness or flaking · rash or hives · swelling of face or lips · other) | **Finasteride:** EXCLUDE every finasteride product. **Minoxidil liquid only, with itch, redness or flaking:** SET foam; EXCLUDE solution. **Both liquid and foam, or hives or swelling:** true minoxidil allergy, EXCLUDE all minoxidil; if irritation only with both, FLAG for S2 (special base). **Propylene glycol:** SET foam. **Alcohol on the skin:** both licensed topicals contain ethanol, so FLAG (oral or S2). **Lactose:** FLAG; check the stocked brand's ingredients **[to verify]** | Propylene glycol is the usual cause; the foam has none [rule-library M5, 3.7] |
| D7 | Are you using any other medicine on your scalp (for example a steroid lotion, coal tar or dithranol), or is your scalp shaved? | Yes · No | **Yes:** EXCLUDE topical minoxidil while it continues ("other scalp medicines can raise how much minoxidil gets into your body") | SmPC contraindications [clinical-men 3.1; rule-library M6] |
| D8 | Which of these medicines do you take? Tick all (picker, plus free text for anything else) | Blood-pressure tablets · Water tablets, including spironolactone, eplerenone or amiloride · ACE inhibitors or "sartans" · Potassium tablets or a potassium salt substitute · Regular anti-inflammatory painkillers such as ibuprofen · Heparin injections · Lithium · Digoxin · Co-trimoxazole or trimethoprim · Ritonavir or itraconazole · Erection tablets · Medicines for mental health · Acitretin · Testosterone · Other · None | **Blood-pressure tablets:** men CALL before oral minoxidil (more stopped treatment on doxazosin or on three or more such drugs); women EXCLUDE oral minoxidil. **Potassium-sparing diuretics or eplerenone:** EXCLUDE spironolactone. **ACE inhibitor, sartan, potassium, NSAIDs, heparin, lithium, digoxin, co-trimoxazole:** EXCLUDE spironolactone, or FLAG with GP agreement and potassium checks (trimethoprim alone: treat the same until the BNF is checked **[to verify]**). **Ritonavir or itraconazole:** FLAG for dutasteride. **Erection tablets:** FLAG (the files do not address oral minoxidil with these) **[to verify]**. **Mental-health medicines:** FLAG before any 5-ARI; B5 is never skipped. **Acitretin:** a known cause of diffuse loss; ask the prescriber of that medicine. **Testosterone:** FLAG. **Free text:** always read by the prescriber | [clinical-men 10.2; clinical-women 3.3, 4.1 Q27; engines-experience 3] |

### 4.8 Stage E: men, only if finasteride or dutasteride is still possible (otherwise SKIP)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| E1 | Right now, how are your (a) sex drive, (b) erections, (c) ejaculation? | No problems · Some problems · Big problems (each) | **BASELINE** for every man. **Any problem:** FLAG; offer a minoxidil-only plan beside the finasteride plan; not a contraindication | A baseline is needed to judge later change; no company records one [clinical-men 10.2; cross-company 5] |
| E2 | Have you taken finasteride or dutasteride before? If yes: did you have low mood, anxiety or suicidal thoughts · sexual problems that lasted after stopping · breast tenderness or swelling · other effects · none? | Tick any | **Mood change or lasting sexual effects:** EXCLUDE all 5-ARIs, tablet and topical, unless a specialist advises. **Breast changes or other:** FLAG | Effects can persist; topical is not a way round the warning [rule-library F2] |
| E3 | Are you trying for a baby, or having fertility treatment, now or in the next 12 months? | Yes · No | **Yes:** EXCLUDE dutasteride; finasteride by shared decision (FLAG; COUNSEL that the sperm-count data come from the 5 mg dose) | Dutasteride's semen effects last months [rule-library F5; clinical-men 2.1, 2.3] |
| E4 | Is your partner pregnant, or might she be? | Yes · No · Not applicable | **Yes:** tablets COUNSEL (she must not handle crushed or broken tablets); dutasteride COUNSEL (condom); topical finasteride (M6) EXCLUDE unless strict transfer advice is accepted (FLAG) | [rule-library F6] |
| E5 | Does a baby or young child, or a woman who is or may be pregnant, live with you? | Yes · No | **Yes:** COUNSEL for every topical (keep them away from the treated scalp and pillow; wash hands); FLAG M6 | Infant hair growth after contact with minoxidil; finasteride skin transfer [clinical-men 3.1, 2.2] |
| E6 | Information screen: what finasteride can do to mood and sexual function, the patient-card points, "stop at once and contact us if your mood drops", and showing the card to family | "I've read this and want to consider finasteride" · "I'd rather not take finasteride" | **Opt-out:** EXCLUDE all finasteride and dutasteride at once | MHRA 2024 and 2026 [clinical-men 10.1]; opt-outs honoured (Numan fails this) [rule-library E4] |

### 4.9 Stage F: previous treatment, goals and preferences (asked last)

| # | Question | Options | What each option does | Why |
|---|---|---|---|---|
| F1 | Have you used a hair-loss treatment before? For each one: how long, did you use it as directed, did it help, any side effects, why did you stop? | Product picker with follow-ups | **Minoxidil for under 6 months:** not a failure; may restart. **Under 12 months of finasteride plus minoxidil:** not yet a step-3 failure. **Past irritation with solution:** SET foam. **Past swelling, palpitations or dizziness on oral minoxidil:** EXCLUDE oral (FLAG). **Past side effects on finasteride:** per E2; a man may choose to retry only after a prescriber call | LloydsPharmacy is the only rival with a real treatment history [engines-experience 3, 5.2; clinical-women 4.1 Q32] |
| F2 | What matters most to you? | Keep the hair I have · Regrow as much as possible · Not sure | **Regrow, with more than mild loss (C2):** offer both medicines together from the start (men), or the combination route (women, if eligible). **Keep:** a single licensed medicine is a reasonable start | Offer both from the start to men with more than mild loss or who want the best chance [clinical-men 11] |
| F3 | How would you like to treat it? | Something on the scalp · A tablet · No preference · *(Men)* I don't want finasteride | **Honoured.** **No preference:** both licensed options shown side by side with plain pros and cons; the engine never defaults to an unlicensed product. **Tablet chosen but not possible:** say why, offer what is possible | Sons† treats "I don't mind" as an unlicensed capsule; Hair + Me ignores preference [engines-experience 4.1] |
| F4 | Do you live with a cat or dog? | Cat · Dog · Both · No | **Cat or dog:** COUNSEL (topical minoxidil can poison cats; wash hands, keep pets off pillows); offer an oral option if clinically suitable | Real poisonings reported [rule-library M8] |
| F5 | How often do you wash your hair, and how would you describe it? | Daily · Every 2 to 3 days · Weekly or less; and straight · wavy · curly · coily | **Infrequent washing or coily hair:** prefer the once-daily foam for women; explain residue; oral option if topical is not workable (a clinical decision, not a convenience special) | Women with textured hair report products they cannot wash out [customer-voice 7] |
| F6 | Would extra hair growth on your face or body be unacceptable to you? | Yes · No · Not sure | **Yes:** prefer topical; avoid or minimise oral minoxidil | Facial hair in up to 73% of women on 1 mg when looked for [rule-library M11] |
| F7 | Do you smoke? | Yes · No | **Yes:** COUNSEL that minoxidil solution and foam are flammable; do not apply while smoking. No restriction | [rule-library M10, 5.4] |

Questions that are **deliberately not rules**: smoking, alcohol and body mass index do not block anything; mental-health
history never removes minoxidil; low blood pressure never removes topical minoxidil [rule-library 5.4].

### 4.10 The result screen (still before sign-in)

What the person sees, in this order:

1. **What we think is going on**, in one sentence. For example: "Your answers fit male pattern hair loss"; "Your
   answers fit shedding after a trigger, which usually settles by itself"; "We can't tell from answers alone: your
   photos will decide".
2. **What we suggest:** one or two plan cards. Each card names the medicine, strength, form and how to use it; a
   licence label (**Licensed** / **Off-label: licensed for something else** / **Unlicensed special**) with one plain line
   on what that means; the monthly and 3-monthly price; and "Why this plan" in two lines, quoting the person's own
   answers.
3. **What we've ruled out and why**, one line each ("Oral minoxidil isn't suitable because of the heart condition you
   told us about").
4. **What happens next:** photos (every new patient), ID check, GP details, a blood pressure reading or a video call if
   needed, blood tests if needed (with price), and "you pay only if your prescriber approves".
5. **What to expect:** the early shed in weeks 2 to 6 with minoxidil, 6 to 12 months to judge, benefit lasts only
   while treatment continues, the main side effects.
6. **Buttons:** "Continue to photos and prescriber review" · "Print or download this summary" · "Delete my answers".
   No "Buy now" or "Add to basket" for any prescription medicine [uk-regulation 2.2].

### 4.11 After sign-in (stages G to O)

| Stage | What happens | Rule |
|---|---|---|
| G. Identity | Photo-ID and selfie check, or a credit-reference check. Date of birth must match A1; a mismatch stops and goes to the prescriber. The system flags multiple accounts, shared cards, many orders to one address, and orders too large or too frequent | GPhC distance guidance [uk-regulation 3.2(b), 6.2]. A face-matching check is biometric data, so it is in the data protection impact assessment [uk-regulation 6.1] |
| H. GP and records | GP name and surgery; consent to share. Optional consent to view the NHS Summary Care Record (Sons' pattern; how a private online pharmacy gets this access is **[to verify]**). **No GP or no consent:** licensed topical medicines at most, with the reason recorded | [rule-library S7; uk-regulation 3.2(c)] |
| I. Photos | Guided capture with on-screen frames and an automatic blur and light check. **Men (6 photos):** hairline from the front with hair pushed back; left temple; right temple; top from above; crown from above; back of the head; plus a close-up of any area of concern. **Women (5 photos):** parting from above (middle parting, dry hair, good light); front hairline pulled back showing both temples; eyebrows close-up; crown from above; back of the head; plus a close-up of any patch or sore area. If photos do not fit the history, the prescriber refers | Photo set [clinical-women 1.1]; "Ask for photographs" [clinical-men 10.2]. The men's set is our adaptation **[our view]** |
| J. Blood pressure and pulse (oral minoxidil only) | Two readings. Preferred: a reading taken at a pharmacy or GP surgery and uploaded. Alternative: a home upper-arm monitor, photographed showing the reading, or taken during the video call. **Below 90/60, or a fast or irregular pulse:** no oral minoxidil | A real reading is stricter than the consensus on purpose, because a remote service cannot examine [clinical-women 3.2, 4.1 Q34]. GPhC: consider whether self-reported readings need verifying [clinical-women 4.0]. The verification method is **[our view]** |
| K. Blood tests | Kit or appointment booked only when flagged; results go to the prescriber, who acts on them (section 5.5) | [clinical-women 4.2] |
| L. Information and consent | Off-label or unlicensed: what it means, in writing. Finasteride: patient-card information in writing for every man, tablet or topical. Women on tier B: contraception declaration. Everyone: early-shed warning | [uk-regulation "You must"; clinical-men 10.1] |
| M. Payment | Card saved, charged only on approval; full refund at any point before dispensing | Pay-on-approval removes the refund fight [engines-experience 5.2] |
| N. Prescriber review | See 4.12 | |
| O. Check and dispense | A second pharmacist does the clinical and accuracy check; the patient is told they may use another pharmacy | GPhC prescriber guidance [uk-regulation 3.4] |

### 4.12 Prescriber review

**What the prescriber sees on one screen:** the provisional plan and the rule that produced each part; every answer,
with changed answers and free text highlighted; colour-coded flags; photos beside a pattern guide; past orders and
any duplicate or conflict; blood and blood-pressure results; and written instructions for each flag (Numan's good
pattern of a clinician playbook) [engines-experience 5.2].

**Four outcomes, each with a plain reason sent to the patient:**

| Outcome | When |
|---|---|
| Approve as proposed | Everything fits |
| Approve with a change | For example a lower starting dose, or a different form |
| Need more | Retake photos, a call, a blood-pressure reading, blood tests or GP information, with a date |
| Decline and refer | Photos or history do not fit pattern loss, or a safety reason; a GP letter is sent with consent |

**When a call is required:** every off-label oral medicine (M4, M5, W3, W4); any FLAG from the mood questions before a
5-ARI; any request for a special (M6, S2); anything the prescriber judges unclear. GPhC guidance says higher-risk
prescribing should not rest on a questionnaire alone [uk-regulation 3.2(a)].

**Targets [our proposal]:** a decision within one working day of a complete file; side-effect messages answered by a
prescriber the same working day.

### 4.13 Example outcomes (what the engine would show before sign-in)

| Person | Key answers | What the result screen shows |
|---|---|---|
| Man, 27 | Temples and crown, 3 years, gradual, no flags, wants to regrow, no preference | "Fits male pattern hair loss." Two-medicine plan: finasteride 1 mg tablet + minoxidil 5% solution, £32 a month. Single-medicine alternatives shown. Next: photos, ID, GP |
| Man, 44 | Crown, gradual; high blood pressure on amlodipine; no mood issues | Finasteride plan, £20. "Minoxidil on the scalp isn't usually suitable with high blood pressure; your prescriber can consider it if your GP agrees. Minoxidil tablets need a video call and a blood pressure reading." |
| Man, 31 | Sudden heavy shedding all over for 6 weeks; had COVID-19 with fever 3 months ago | "Fits shedding after an illness, which usually regrows by itself." Shedding programme, free; no medicine; photo check-ins at 3 and 6 months |
| Man, 38 | Pattern loss; on finasteride 18 months ago, sexual problems that lasted | All 5-ARIs ruled out with the reason. Minoxidil 5% solution £17 or foam £24; oral minoxidil option needs a call |
| Woman, 33 | Heavy shedding 3 months after giving birth; breastfeeding | No medicines while breastfeeding (A4). Shedding programme: what to expect; bloods if it lasts past 6 months or is severe |
| Woman, 52 | Wider parting, slow, no periods for 2 years, no flags, family history yes | "Fits female pattern hair loss." Minoxidil 5% foam once daily, £26. Next: photos (including hairline and eyebrows) |
| Woman, 29 | Wider parting; irregular periods, acne, PCOS diagnosed; combined pill containing drospirenone | Androgen tests not ordered on the combined pill (unreliable); FBC, ferritin and TSH offered. Plan: minoxidil foam now; spironolactone discussed on a call (U&E first; potassium in the first cycle because of the drospirenone pill) |
| Woman, 41 | Shedding all over for 5 months; on tirzepatide, lost weight fast; relies on the pill | Shedding programme; core bloods; "do not stop your injection for hair alone". Tier B medicines not offered until contraception is reviewed (tirzepatide affects the pill) |
| Woman, 58 | Hairline moving back and thinner eyebrows | STOP-REFER: "this pattern needs a face-to-face check by your GP or a dermatologist", with a printable summary |

### 4.14 Proving the engine works

- **Automated tests:** one test per rule, with the exact answer text, run before every release [rule-library E5].
- **Route tests:** every entry link (adverts, product information pages, repeat orders, second consultations) runs
  through the same rules [rule-library E3].
- **Monthly audit [our proposal]:** the second pharmacist re-reviews a random sample of decisions and every stop, and
  the clinical lead reviews any disagreement.
- **Before launch:** walk the whole engine against NICE CKS, the BNF and the full oral minoxidil consensus paper, none
  of which the research could open (section 8 checklist).

---

## 5. The service around the medicine

### 5.1 Prescribers and the team

- **A named prescriber for every patient,** shown on the website with name, GPhC registration number and the fact that
  they are a pharmacist independent prescriber, as the GPhC requires [uk-regulation 3.2].
- **The same prescriber at every review where possible** (continuity is part of the promise). **[our view]**
- **Prescribing kept apart from supply:** a second pharmacist does the clinical and accuracy check before anything is
  dispensed, and patients are told they may take their prescription to another pharmacy [uk-regulation 3.4]. Budget
  for this from day one: the GPhC's 2026 inspections of Voy tested whether the pharmacy really checked the
  prescriptions it dispensed [uk-regulation 3.5, 7.3].
- **A free call with the prescriber on request** for any patient, as well as the required calls for off-label
  medicines. **[our proposal]**
- **No sales targets or per-prescription pay for prescribers.** GPhC guidance bars incentives to prescribe
  [uk-regulation 3.2, 3.4].
- **Pharmacist-only prescribing keeps the service outside CQC registration in England.** If a doctor or nurse joins in
  a professional capacity (for example a consultant dermatologist reviewing cases), CQC registration is needed; get
  written CQC advice before involving any doctor [uk-regulation 4]. A dermatologist cannot appear in adverts endorsing
  medicines either [uk-regulation 2.4].

### 5.2 Follow-up schedule (built into the product, not optional)

| When | Men | Women | Source |
|---|---|---|---|
| Before the first dose | How to use; early-shed warning; side effects to watch; patient-card information for finasteride | How to use; early-shed warning; for tier B, pregnancy and contraception reminder | [clinical-men 3.1, 10.1; clinical-women 3.1] |
| Week 1 (oral minoxidil only) | Dizziness, fast heartbeat (watch 3 to 7 days after starting or raising the dose) | Same | [clinical-women 3.2, 4.4] |
| Weeks 2 to 4 (women: 2 to 6) | Side-effect check: mood (PHQ-2 and the crisis question), sexual function against baseline, dizziness, swelling, scalp reaction. Reassure about the early shed | Early-shed message so she does not stop; side-effect check | [clinical-men 10.3; clinical-women 4.4] |
| Weeks 4 to 6 (oral minoxidil only) | Swelling, weight gain, breathlessness, chest pain; repeat blood pressure and pulse | Same | [clinical-women 3.2, 4.4] |
| After starting or raising spironolactone | — | Potassium and kidney function if aged 45 or over or at risk; dizziness and period changes | [clinical-women 3.3, 4.4] |
| Month 3 | Same checks; too early to judge hair; patient score (B6) | Same | [clinical-men 10.3] |
| Every tier B supply | — | Pregnancy and contraception check; new medicines check | [clinical-women 4.4] |
| Month 6 | Photo set against baseline: first judgement of effect; step 2 if needed | Photo set; 5% foam: stop if no improvement by 24 weeks; oral minoxidil may only show by now | [clinical-men 10.3, 11; clinical-women 4.4] |
| Month 12 | Continue, change (step 3) or stop. Minoxidil: stop if no improvement after a year | 2% solution: stop if no improvement. Spironolactone: full effect takes 12 to 18 months | [clinical-men 10.3; clinical-women 4.4] |
| Then every 6 months | Mood and sexual-function questions every time; photos at least yearly | Contraception and pregnancy questions every time for tier B; photos at least yearly | MHRA: "review patients regularly" [clinical-men 10.1]. 6 months is our choice within the 6 to 12 months in the files |
| Dutasteride | New PSA baseline at 6 months, told to the GP | — | [clinical-men 2.3] |
| Shedding programme | Photo check-ins at 3 and 6 months; past 6 months: bloods, reconsider pattern loss, refer if unexplained | Same | [clinical-women 4.3] |
| Planning a pregnancy | Dutasteride and finasteride: discuss before trying | Stop all treatment first; one NHS leaflet advises waiting a month after stopping spironolactone | [clinical-women 4.4] |

**Reviews are started 4 to 6 weeks before supply runs out,** so a check never leaves a patient without treatment. A
Hair + Me reviewer was asked for an annual review 4 days before supply ran out [engines-experience 4.1].

### 5.3 Side effects

- **A clinical channel separate from customer service.** Any message that mentions a side effect goes to a prescriber
  and is answered **the same working day** [customer-voice 5, need 2].
- **Instant safety advice in the app** for red-flag symptoms: chest pain, breathlessness, fainting, rapid weight gain
  or marked swelling on oral minoxidil means stop and seek urgent medical help [clinical-men 11].
- **Finasteride: new low mood or suicidal thoughts means stop at once** and contact us (MHRA); the crisis screen
  applies [clinical-men 10.1, 11]. Sexual problems: review and consider stopping.
- **Billing pauses automatically** when a side-effect report is opened; unused prepaid months are refunded if treatment
  stops. **Never a retention offer in a side-effect conversation** (a Sons reviewer reporting a side effect was asked if
  they wanted to cancel) [engines-experience 6, lesson 24].
- **Yellow Card:** we report suspected reactions, including to specials, and help patients report their own
  [clinical-men 10.3; uk-regulation "You must"].
- **One medicine changed at a time,** which separate products make possible (section 3.1).

### 5.4 Photos, tracking and measured outcomes

**For each patient:**

| Measure | When | How |
|---|---|---|
| Standard photo set (section 4.11, stage I) | Baseline, 6 and 12 months, then at least yearly | Same framing guides, light check, dry hair, no styling products |
| Prescriber's rating of change | 6 and 12 months | Paired photos, baseline beside latest, on one fixed scale chosen by the clinical lead (for example much worse to much better). For a sample, a second reviewer rates the pairs without knowing which photo is later. **[our view]** |
| Patient's own scores | Baseline and every review | B6 (effect on mood and daily life, 0 to 10) plus "how happy are you with your hair?" (0 to 10), copying Hair + Me's two-score idea [engines-experience 5.2] |
| Side effects | Every review | Structured: mood (PHQ-2 and crisis question), sexual function against baseline (men on 5-ARIs), oral minoxidil symptoms, blood pressure where needed |
| Adherence | Every review | "In the last 2 weeks, how many days did you miss?" |

**For the service, from day one:** share of consultations stopped or referred and why; share sent to the shedding
programme; share of new patients with a complete baseline photo set (target 100%); time to decision; side-effect
reply time; share of patients on licensed medicines only; share of specials with a recorded clinical need (target
100%); stable-or-better rate at 6 and 12 months; retention at 3, 6 and 12 months; complaints by theme; time taken to
cancel.

**Publish a yearly outcomes report** with honest denominators: everyone who started, not just those who answered.
Hims' published study of 638,629 men had replies from only 23.7% [market-economics 5.4]. **Caution:** outcome figures
for prescription medicines must not be used in adverts; how and where to publish them needs legal advice
**[to verify]** [uk-regulation 2.6].

### 5.5 Blood tests: what each result does

| Result | Action | Source |
|---|---|---|
| Low haemoglobin with low ferritin (iron deficiency anaemia) | **Refer to the GP** to find the cause; urgent pathway wording for men and postmenopausal women (about a third have a gut cause); coeliac screening in premenopausal women. Not a sale | [clinical-women 2.2, 4.2] |
| Ferritin below 30 µg/L, haemoglobin normal | Iron (W5) and a GP letter; look for a cause such as heavy periods or diet | [clinical-women 2.2, 4.2] |
| Ferritin 30 to 40 µg/L with shedding | A time-limited iron trial, with honest words that the hair evidence is weak | [clinical-women 2.2] |
| Ferritin above 40 µg/L | No promise that pushing it higher will regrow hair | [clinical-women 2.2] |
| Abnormal TSH (thyroid) | **Refer to the GP;** hair treatment waits | [clinical-women 4.2] |
| Testosterone above 4.8 on a repeat test, or any result with rapid virilisation | **Urgent referral.** The unit for 4.8 is not stated on the PCDS page; use the laboratory's range **[to verify]** | [clinical-women 1.6, 4.2] |
| Mildly raised testosterone or free androgen index | Assess for PCOS with the GP | [clinical-women 4.2] |
| Potassium above range or reduced kidney function | No spironolactone | [clinical-women 4.2] |
| A man with an unexplained low ferritin | GP to find the cause | [clinical-men 6] |

### 5.6 GP communication

- **GP details and consent are asked for every patient;** a letter is sent, with consent, when any prescription
  medicine starts, changes or stops, and with every referral.
- **What the letter says:** the diagnosis and how it was reached (history and photos, no examination); the medicine,
  dose, and whether it is off-label or unlicensed; baseline blood pressure, pulse and blood results; contraception
  discussed; the monitoring plan and who does it; what would make us stop treatment [clinical-women 4.5]. For men on a
  5-ARI: the PSA effect [clinical-men 10.2].
- **People we cannot treat** get a printable one-page summary for their GP, without giving us any details.
- **Why it matters:** the GPhC expects active sharing for higher-risk prescribing; most rivals leave it to the patient
  [cross-company 5; uk-regulation 3.2(c)].

### 5.7 Delivery

- Tracked, plain-packaged delivery included in every price.
- **Ship when about 3 weeks of supply are left;** reviews and any ID re-check are finished first [engines-experience 4.1].
- **Never recommend a product we cannot ship.** LloydsPharmacy led with combination packs marked out of stock [obs].
- Two suppliers for every licensed line where possible, including the brand of 2.5 mg minoxidil tablet whose product
  information allows halving. **[our view]**
- Minoxidil solutions and foams are flammable (the foam is an "extremely flammable aerosol"); Dr Fox ships its spray to
  mainland UK only for this reason [clinical-women 3.1; products-prices 2.2]. Carrier rules are not in the files
  **[to verify]**.
- Delivery or stock failure is the main complaint in about 28% of negative reviews [customer-voice 5]. A delivery
  failure is treated as a clinical risk (a gap in treatment loses regrown hair), not only a service issue. **[our view]**

### 5.8 Subscription terms (built for the 2027 rules now)

The draft UK subscription rules are expected for new contracts from 1 January 2027; they were still a draft on
23 November 2026, so check the final text before launch [uk-regulation 6.3].

| Term | What we do | Why |
|---|---|---|
| Information before sign-up | One plain screen: total price, how often we charge, what is included, how to pause and cancel, cooling-off rights | Draft rules: pre-contract information; drip pricing has been banned since April 2025 [uk-regulation 2.4, 6.3] |
| Default plan | Monthly rolling. A 3-monthly plan only after the first review | Cheap prices locked in long prepaid plans drive the top complaint (35% of negative reviews) [cross-company 4.10] |
| Reminders | In writing (email, with text if chosen) **7 days before every charge**, and before any price change | Draft rules require reminders before renewals [uk-regulation 6.3]; customers ask for a reminder before every charge [customer-voice 5] |
| Reminder wording | Never names a prescription medicine ("Your hair-loss plan renews on 3 March") | Emails to existing customers that named POMs were upheld against Numan and Voy [uk-regulation 2.6, 6.3] |
| Cancel, pause, skip | Online in two taps, by the same route as joining, any time; email confirmation | Draft rules: consumer may end at any time; Hims UK cancels only through support [uk-regulation 6.3; cross-company 2a] |
| Retention offers | None. No discount for threatening to leave | Sons customers report 40% then 50% off when cancelling, which told them they had overpaid [products-prices 5.3] |
| Refunds | Within 14 days of a cancellation; unused prepaid months refunded | Draft rules [uk-regulation 6.3] |
| Safety stop or failed review | Supply ends cleanly and billing stops | Each repeat needs a valid prescription and a clinical decision [uk-regulation 6.3] |
| Price changes | 30 days' notice and a fresh "yes" for anyone on a plan | **[our view]** |

### 5.9 The care promise (our guarantee)

Refunds tied to **results** are read by the ASA as a guarantee of effect, even without the word "guarantee"
(Numan, March 2024) [uk-regulation 2.5]. So every promise is about **our care**, not about hair growth:

1. **You pay only if your prescriber approves,** and get a full refund at any time before we dispense.
2. **If we can't treat you, you pay nothing,** and you get a summary for your GP.
3. **If a side effect means you stop, billing stops that day,** and unused prepaid months are refunded.
4. **If you're not happy with our care in your first 90 days, tell us and we refund your last month.** No photos, no
   conditions about results. **[our proposal; satisfaction-based refunds are allowed: uk-regulation "You can"]**
5. **If a parcel we sent late leaves you short, we send a replacement by the fastest tracked service at our cost.**
   (We pay the postage; we do not give medicine free, because free medicine offers are not allowed
   [uk-regulation 2.2].)

### 5.10 Records and governance

- Each record holds at least: the ID check; the history and mood answers and any record or GP check; the photos and
  whether two-way contact happened (and why not, if not); the options discussed, licensed first; for off-label, why it
  serves the patient better; for a special, the recorded clinical need; that the patient was told what "unlicensed" or
  "off-label" means and the written information given; GP details and what was shared; the monitoring plan; batch and
  supply records for specials kept at least five years [uk-regulation 5.5, 1.3].
- A written risk assessment for the whole service, reviewed regularly, with audits [uk-regulation 3.2].
- If the pharmacy ever prepares specials itself: the GPhC's unlicensed-medicines guidance applies in full (formula from
  a recognised source, batch records, recall system, trained staff) [uk-regulation 3.3].

---

## 6. How we win customers within UK advertising law

### 6.1 The law in five lines

- No advert may lead to the use of a **prescription-only medicine** (regulation 284; CAP Code 12.12). This covers
  finasteride, dutasteride, minoxidil tablets and spironolactone, on websites, search ads, social media and emails
  [uk-regulation 2.1, 2.4].
- **Unlicensed medicines may not be mentioned at all** in advertising; nothing that includes one may be called
  "clinically proven" [uk-regulation 2.2, 2.3].
- The **home page** may promote the condition and the service and show an indicative price for the condition, but no
  named prescription medicine or its price [uk-regulation 2.2].
- Deeper pages the visitor chooses to open may give a **balanced, factual overview** of treatments [uk-regulation 2.2].
- Breaches are criminal offences, and repeated breaches reached a pharmacy's own registration (Voy, August 2026)
  [uk-regulation 2.6].

### 6.2 Why this angle is easier to market legally

Most rivals' selling points are **products** (an "extra-strength" spray, a one-a-day combined pill), which they cannot
lawfully advertise and have repeatedly been told off for [uk-regulation 2.5]. Our selling points are **service
features**, which we can advertise freely: a diagnosis before treatment, a named pharmacist who looks at your photos,
blood tests when needed, a women's service, follow-up that is built in, and the easiest cancel in the market.
**[our view]**

### 6.3 What we advertise and where

| Channel | What we say (examples) | Rules that apply |
|---|---|---|
| **Home page** | "Find out why your hair is thinning before you treat it." "A named pharmacist reviews your photos." "Hair-loss care from £17 a month." "Cancel any time, online." | Indicative condition price only; no medicine names, no "Buy now" [uk-regulation 2.2] |
| **Paid search on the condition** | Bid on "thinning hair women", "hair falling out after baby", "receding hairline", "hair loss check"; never on drug names | Google requires GPhC registration plus LegitScript (or NABP) and Google certification before it will run pharmacy or telehealth adverts [market-economics 6.3] |
| **Search-optimised guides** (our strongest channel) | Deep, balanced, source-cited guides: "Shedding or thinning? How to tell", "Hair loss 3 months after having a baby", "Hair shedding after weight-loss injections", "What a scalp photo can and can't show", each ending in "Start your hair check" | Inner pages may name medicines only in a fair overview, without claims or price-led nudges [uk-regulation 2.2]. Customers ask for a diagnosis and clear information; clear information is 11% of praise [customer-voice 4, 5] |
| **The free hair check and the shedding programme** | The consultation itself is the landing page; people with shedding leave with an answer and no sale | Must be clear it is a consultation that may or may not lead to a prescription [uk-regulation 2.2] |
| **Licensed non-prescription products** | Minoxidil 5% foam and solution (men) and Regaine for Women may be advertised as medicines, within their licence | Claims must match the product information and be backed by trials (CAP 12.1, 12.11, 12.23); no "guaranteed", "best" or "better than" [uk-regulation 2.4]. The landing page must not make a prescription medicine the obvious outcome [market-economics 6.4] |
| **Condition-led social media** | Real people talking about the problem and the service; plain photos of the process (a phone taking a scalp photo, a pharmacist on a call) | No medicine images, no pill shapes, no labelled bottles, no before-and-after photos for prescription medicines; Meta does not allow UK prescription-drug adverts; influencers may not promote prescription medicines [uk-regulation 2.3, 2.5; market-economics 6.3, 6.4] |
| **Hairdressers and barbers** | A plain leaflet about spotting thinning and red flags, and about the service | They see thinning first. **[our view]** We answer for anything a referral partner says, so no medicine names and no codes that name medicines [uk-regulation 2.5, Voy February 2026] |
| **GPs** | Good GP letters and referral summaries build our name with GPs over time | **[our view]** |
| **Reviews** | Invite every customer, not just happy ones; reply to all | Fake reviews have been banned since April 2025 [uk-regulation 2.4]; reviews must not become testimonials endorsing a medicine [uk-regulation "You cannot"] |
| **Emails to patients** | Marketing emails under the soft opt-in, about the service only; clinical messages (reviews, reminders) are not marketing | No prescription medicine named in marketing emails [uk-regulation 6.1, 2.6] |

### 6.4 What we never do

From the regulation file's "You cannot say or do" list [uk-regulation]: no medicine names on the home page, in search
ads, social posts, the web address or marketing emails; no mention or picture of an unlicensed product; no "clinically
proven" for anything that includes an unlicensed medicine; no "prescription medication" or prescription ingredients in
adverts; no "Buy now" or "Add to basket" for prescription medicines; no results promises or results-based refunds; no
"safe", "no side effects", "best", "strongest" or "better than"; no doctor, pharmacist, scientist, celebrity or
customer endorsing a medicine; no free medicines or headline discounts on prescription medicines; no affiliate or
referral codes that name prescription medicines; no urgency ("act now") [market-economics 6.4].

**Process:** every advert and page is checked against a written checklist built from the list above before it goes
live, and the log is kept. **[our view]**

---

## 7. Rough unit economics and launch plan

**Every number in this section is an estimate or an assumption unless a source is given.** No UK rival publishes its
customer acquisition cost (CAC) or churn [market-economics 5.3, 5.4]. Replace every assumption with real quotes and
real data as soon as they exist.

### 7.1 Revenue per patient

| Group | Assumed mix **[assumption]** | Average monthly price from our list |
|---|---|---|
| Men (60% of patients) | 30% finasteride only (£20); 15% topical minoxidil only (about £19); 40% two-medicine plans (about £33); 15% step 2 or 3 plans (about £36) | about **£27.45** **[estimate]** |
| Women (40% of patients) | 50% topical minoxidil (about £24); 20% oral minoxidil (£20); 30% spironolactone combinations (about £34) | about **£26.20** **[estimate]** |
| Blended, allowing for some patients moving to the cheaper 3-monthly plan | | about **£26 a month** **[estimate]** |

### 7.2 Monthly cost and contribution per paying patient

"Contribution" means what is left to pay for staff, technology, premises and marketing.

| Line | Year 1 | Year 2 onwards | Basis |
|---|---|---|---|
| Revenue | £26.00 | £26.00 | 7.1 **[estimate]** |
| Medicine and packaging | −£5.72 | −£5.72 | 22% of revenue, the sector benchmark [market-economics 5.1, 5.5] **[estimate]** |
| Delivery | −£1.94 | −£0.97 | £2.90 per parcel (Dr Fox's customer charge used as a proxy) [market-economics 5.5]; about 0.67 parcels a month in year 1 (monthly at first), 0.33 later **[assumption]** |
| Card fees | −£0.75 | −£0.70 | 1.5% + 20p, plus 0.7% for subscription billing [market-economics 5.5] |
| Prescriber follow-up time | −£3.90 | −£2.13 | About £51 an hour for an experienced pharmacist with on-costs [market-economics 5.5, estimate]; about 55 minutes a year in year 1 (four reviews plus messages), 30 minutes later **[assumption]** |
| Second pharmacist check | −£1.70 | −£0.85 | About 3 minutes per supply **[assumption]** at the same hourly cost |
| Technology, ID checks, photo storage, texts | −£1.00 | −£1.00 | **[assumption; quotes needed]** |
| **Contribution** | **about £11.00 (42%)** | **about £14.60 (56%)** | **[estimate]** |

For comparison, the market file's worked example for a typical subscription brand leaves about 67% after similar costs,
because it spends only about £1.50 a month on clinician time [market-economics 5.6]. **Our model deliberately spends
more on clinical care.** That is the product; it is also the main economic risk (section 8).

### 7.3 One-off cost to start a patient

| Line | Cost | Basis |
|---|---|---|
| First review, tier A (answers and photos, about 15 minutes) | about £12.75 | £51 an hour **[estimate]** |
| First review, tier B (with a video call, about 40 minutes) | about £34.00 | **[estimate]** |
| Blended first review (75% tier A, 25% tier B) | about £18.10 | **[assumption on mix]** |
| Reviews of people who sign up but are not treated (refused after photos, or shedding programme) | about £3.40 per paying patient | 0.4 such reviews for each paying patient, 10 minutes each **[assumption]**. Most stops happen before sign-in at no clinician cost, which is the engine's job |
| Welcome information pack | about £1.00 | **[assumption]** |
| **Total start-up cost per patient** | **about £22.50**, plus the ID-check fee **[quote needed]** | |

### 7.4 Customer acquisition cost and payback

| CAC (cost to win one paying patient) | Plus start-up cost | Months of year-1 contribution to earn it back |
|---|---|---|
| £60 | £82.50 | about 7.5 months |
| £100 | £122.50 | about 11 months |
| £150 | £172.50 | about 16 months |

CAC scenarios are the market file's planning range [market-economics 5.6]; the payback maths is ours **[estimate]**.

**What a patient is worth over time (before CAC) [estimate]:** about £110 if they stay 12 months; about £285 if they
stay 24 months. With a CAC of £100, a 12-month patient barely pays back; a 24-month patient is clearly profitable.

**Sensitivity [estimate]:** £4 more on every price (still at or below rivals' monthly prices) raises year-1
contribution to about £14 and cuts payback at a £100 CAC to about 9 months. Keeping CAC at or below £60 through guides,
the free shedding programme, reviews and word of mouth matters more than any price change.

**The three numbers to measure from day one:** how many patients are still paying at months 3, 6 and 12
[market-economics 5.6]; CAC by channel; and real clinician minutes per patient.

### 7.5 Fixed costs and break-even (illustrative only)

Known figures from the files: ICO data protection fee £52 a year at tier 1 [uk-regulation 6.1]; an experienced NHS
pharmacist (Band 8a) earns £57,528 to £64,750 from April 2026 [market-economics 5.5]. Everything else needs a quote:
registered pharmacy premises and GPhC fees, indemnity (naming online prescribing, off-label use and any specials),
LegitScript and Google certification, the platform build, the ID-check vendor, the laboratory, legal and regulatory
advice, accountancy (including VAT on prescribed medicines, which may be zero-rated if the conditions are met
[market-economics 5.5]), and marketing.

**Illustration [assumption]:** if fixed costs were £20,000 a month, break-even would need about 1,800 paying patients at
year-1 contribution (£11), or about 1,370 at year-2 contribution (£14.60). Replace £20,000 with the real budget.

### 7.6 The team at launch

| Role | Why | Notes |
|---|---|---|
| Owner: pharmacist independent prescriber and clinical lead (and superintendent if we own the pharmacy) | Prescribes, writes protocols, runs audit | The GPhC wants prescribing kept apart from supply where possible [uk-regulation 3.4] |
| Second pharmacist (part-time at first) | Clinical and accuracy check of every prescription; cover; audit | Essential, not optional [uk-regulation 7.3] |
| Pharmacy technician or dispenser | Dispensing, packing, stock | From 10 December 2026 a pharmacist may authorise a registered technician to supervise preparation under section 10, relevant only if we ever make specials in-house [uk-regulation 1.2] |
| Patient support coordinator | Billing, delivery, non-clinical messages; trained to pass every clinical message to a prescriber | Keeps sales and clinical apart |
| Contract developer and designer | The engine, rule tests, photo capture, prescriber console, billing | Rules on the server, tested before every release |
| Contract writer for guides | The content channel | Every piece checked against the advertising checklist |
| Advisers (as needed) | Regulatory and advertising law, data protection (DPIA), tax, CQC (if any doctor joins) | [uk-regulation "You must"] |

**Pharmacy model.** Either our own GPhC-registered distance-selling pharmacy (full control of supply and quality) or a
partner pharmacy that dispenses our prescriptions, as Sons does with The Independent Pharmacy [uk-regulation 4.2].
**[our view: start with a partner if speed matters, move to our own pharmacy once volumes justify it, and in either case
keep the second clinical check]**

### 7.7 Launch plan

| Phase | Timing (from launch) | What happens |
|---|---|---|
| **0. Set up** | Months −6 to 0 | Read the references the research could not open and finalise protocols (checklist below). Pharmacy model, superintendent, SOPs, indemnity, ICO registration and DPIA, UK data hosting, CQC advice if any doctor is involved, LegitScript and Google certification, legal review of the website and terms, final DMCCA text, VAT advice, Northern Ireland and Wales advice. Quotes from two wholesalers for every licensed line, a laboratory, an ID vendor and a courier. Build the engine with a test for every rule, the photo tool, the prescriber console, the follow-up scheduler, billing with reminders and two-tap cancel, the GP-letter generator and the Yellow Card workflow. Interview women with hair loss before launch: the UK women's voice in the research is thin [customer-voice 7] |
| **1. Soft launch** | Months 0 to 3 | England and Scotland (Wales after advice). Tier A for men and women: licensed finasteride, licensed minoxidil solution and foam, the shedding programme, core blood tests. Cap weekly new patients so same-day side-effect replies stay true. **[our view]** Watch every stop reason and decision time |
| **2. Tier B** | Months 3 to 6 | Oral minoxidil (men and women) and stepped spironolactone, with video calls, verified blood pressure and GP letters. Dutasteride for men who arrive with 12 months of documented finasteride and minoxidil elsewhere |
| **3. Specials and add-ons** | Months 6 to 12 | Only once a real group with a recorded clinical need exists: the finasteride low-volume spray (imported licensed product if a lawful route is confirmed, otherwise a UK special) and the minoxidil alternative base; the microneedling protocol after device checks |
| **4. Prove it** | Months 12 to 24 | First 12-month outcomes report; reprice from real costs; consider a 6-month plan with full refund of unused months; add newly UK-licensed medicines only when licensed (for example topical clascoterone or an extended-release oral minoxidil, neither licensed in the UK yet) [clinical-men 7] |

---

## 8. The three biggest risks and how to handle them

### Risk 1: precision costs more and adds steps, while rivals have far more money

**The risk.** Photos, calls and follow-up cost clinician time (our contribution is about 42% in year 1 against about
67% in the market's typical example). Rivals can sell first orders at half price for longer than a start-up can
(Hims & Hers spent US$919m on marketing in 2025) [market-economics 5.3, 8]. Each extra step can lose people; Sons and
Hair + Me win "easy process" praise precisely because they never stop anyone [engines-experience 4.2].

**How to handle it.**
- Keep the typical case fast: about 5 minutes of questions, phone photos, no call for licensed tier A medicines.
- Show the result and the price before sign-in. Only four UK rivals do [cross-company 4.2].
- Fight where precision is visibly worth paying for: women, shedding, men worried about finasteride, and people failed
  by tick-box services. Do not fight Dr Fox on price.
- Win customers cheaply through guides, the free shedding programme, GP goodwill and reviews; track CAC by channel.
- Review prices at 6 months against real costs; there is room of a few pounds below rivals' monthly prices.

### Risk 2: clinical and regulatory liability

**The risk.** Oral minoxidil and spironolactone are off-label; any topical finasteride is unlicensed in the UK; the
MHRA strengthened finasteride warnings again in May 2026; the GPhC now tests verification and second checks; the
advertising rules are criminal law. A single serious adverse event or a regulator's ruling would damage a brand whose
whole promise is safety [uk-regulation 2.6, 3.5, 5.3].

**How to handle it.**
- Licensed first; every off-label or unlicensed choice backed by a recorded reason, a call, a verified blood pressure
  where needed, written information and a GP letter.
- A second pharmacist checks every prescription; monthly audit of decisions; rules tested before every release.
- Sign off the protocol only after reading NICE CKS, the BNF, UKTIS and the full oral minoxidil consensus paper.
- Indemnity that names online prescribing, off-label use and specials; tell the insurer in writing [uk-regulation 7.1].
- Every advert checked against the "You cannot" list; legal review before launch.
- Delay specials until a real recorded-need group exists; consider the imported licensed spray route first.

### Risk 3: a small team, promises that depend on it, and supply

**The risk.** The owner may be prescriber, clinical lead and superintendent at once. Same-day side-effect replies,
one-day decisions and "no gaps in treatment" all depend on a few people. Delivery and stock failures are the main
complaint in about 28% of negative reviews [customer-voice 5]. Our women's low-dose oral minoxidil depends on one
tablet brand whose product information allows halving [clinical-women 3.2].

**How to handle it.**
- Cap new patients to capacity; a second pharmacist and a cover rota from launch.
- Start reviews 4 to 6 weeks before supply ends; ship with 3 weeks left; never recommend what is out of stock.
- Two suppliers for each licensed line. If the splittable 2.5 mg brand is unavailable, men can take whole tablets; for
  women, whether a special is justified when the licensed product cannot be obtained is a question for the regulatory
  adviser **[to verify]**.
- Keep the clinical channel separate so a busy sales day never delays a side-effect reply.

---

## Before launch: what the research could not confirm (must be checked)

1. **NICE CKS** (male and female pattern hair loss), the **BNF** and **UKTIS** pregnancy monographs: not readable by the
   research machine [clinical-men 12; clinical-women Part 5].
2. **The oral minoxidil expert consensus** (Akiska 2025): read the full paper before writing doses and lists into the
   protocol [clinical-men 3.2].
3. **Lactose** in each finasteride brand stocked (from company documents, not the SmPC) [rule-library 5.6].
4. **Ketoconazole shampoo with licensed minoxidil:** write a rule [clinical-women verification, missing 4].
5. **The testosterone cut-off of 4.8:** confirm the unit with the laboratory [clinical-women 1.6].
6. **Trimethoprim alone with spironolactone:** check the BNF [clinical-women 3.3].
7. **Spironolactone tablet strengths** to stock, and the definition of "effective contraception" for the protocol.
8. **The UK licence status of topical finasteride** (re-check the MHRA register) and whether an **imported EU-licensed
   spray** can be sourced lawfully [clinical-men 2.2; uk-regulation 1.5].
9. **Northern Ireland and Wales** rules; **CQC** written advice if any doctor or nurse is involved
   [uk-regulation 4.3, verification missing 2].
10. **The GPhC inspection framework of January 2026** (not read) [uk-regulation verification, missing 1].
11. **The final DMCCA subscription regulations** and their start date [uk-regulation 6.3].
12. **VAT** on prescribed medicines from a private online service [market-economics 5.5].
13. **Courier rules** for flammable minoxidil solution and foam; **microneedling device** classification and safe home
    depth; **NHS Summary Care Record** access route for a private pharmacy.
14. **Blood-donor deferral periods** for finasteride and dutasteride (unverified) [clinical-men 10.2].
15. **A protocol for people on gender-affirming hormones** (not covered by the research).
16. **PHQ-2 cut-off and the distress threshold** used by the engine, chosen and recorded by the clinical lead.
17. **Name checks** at Companies House, the UK trade mark register and for the web address.

## Sources used for this draft

All inside `hairloss-research/`: `synthesis/cross-company.md`, `synthesis/findings.json`, `synthesis/rule-library.md`
(sections 3 to 5), `synthesis/products-prices.md`, `synthesis/engines-experience.md` (sections 3 to 6), the company
digests in `synthesis/digest/` (strengths, weaknesses, opportunities and verification verdicts for Hims UK, Voy, Hair +
Me, Sons, Numan, Dr Fox, Boots, Superdrug and LloydsPharmacy), `foundations/clinical-men.md`,
`foundations/clinical-women.md`, `foundations/uk-regulation.md`, `foundations/customer-voice.md`,
`foundations/market-economics.md`, and two lines from `market/us-intl-sweep.md` and `market/uk-sweep.md` (marked
"not fact-checked" where used).

