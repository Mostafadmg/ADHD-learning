# Cross-company report: 19 online hair-loss companies

Written 24 November 2026 for a UK pharmacist independent prescriber who plans to launch a hair-loss service for men
and women. This is the top-level comparison. The detail sits in three files:
[rule-library.md](rule-library.md) (what each company does with each medical answer),
[products-prices.md](products-prices.md) (what they sell and what it costs) and
[engines-experience.md](engines-experience.md) (how each consultation decides, and what customers say).

Built from those three files, the 19 company digests in `digest/` (engine summaries and verification verdicts in
`digest/sec-engines.md`) and the fact-checked files in `../foundations/`. No new web research was done for this file,
and nothing in it is invented. Where something could not be seen, it says so.

## How sure is this? Read this first

- **Nothing after a company's sign-in wall was watched.** The sign-in wall (or account wall) is the first screen that
  will not let you go on without giving contact details. No research account was created. So every statement about
  what a prescriber finally decides comes from public documents or from code the website sends to any visitor.
- **Three companies could not be walked live** because their sites blocked the research machine (bot checks):
  **Voy**, **Hers (US)** and **Oxford Online Pharmacy**. They are marked **\*** below. Their rows rest on public pages,
  reviews and (for Voy) an 11-month-old copy of the older Manual app's code.
- **Sons and Ro** were still in final review when this work started. Their stage 2 data (live replays and code read
  and run offline) is complete and is used here, but small corrections may follow. They are marked **†**.
- **XYON** was never independently verified. Treat its rows as a first draft. It is marked **‡**.
- How each fact was found is labelled where it matters: **observed** (we changed one answer on the live site and
  watched), **code** (read in the site's own served code), **docs** (the company's public documents say so).

## Words used in this report

- **Consultation engine (engine):** the logic that turns a person's answers into a decision: stop, warn, which
  medicine, or "send to a clinician".
- **Hard stop:** an answer that ends the journey. **Product removal:** an answer that takes a medicine off the list but
  lets the person carry on.
- **Licensed medicine:** has a UK marketing authorisation for that use (for example finasteride 1 mg tablets for male
  pattern hair loss). **Off-label:** a licensed medicine used outside its licence (for example minoxidil tablets,
  licensed for high blood pressure, used for hair). **Compounded medicine or "special":** made up by a pharmacy for one
  patient, with no licence at all. MHRA Guidance Note 14 (GN14) says a special should only be used for a patient's
  special clinical need, and a licensed product (even off-label) comes first.
- **5-ARI (5-alpha-reductase inhibitor):** the drug family of finasteride and dutasteride. They lower DHT, the hormone
  that shrinks hair follicles.
- **SmPC:** the official product information for a licensed medicine.
- **MHRA:** the UK medicines regulator. **GPhC:** the pharmacy regulator.
- **Telogen effluvium:** sudden, all-over shedding that starts about 3 months after a trigger (illness, childbirth,
  crash dieting, a new medicine). It usually regrows by itself and does not need a hair-loss prescription.
- **Red flag:** an answer that means this may not be ordinary pattern hair loss (bald patches, sudden loss, a painful
  or scarred scalp) and needs a proper examination.

---

## 1. Executive summary

We studied 19 online hair-loss companies: 12 in the UK and 7 in the US. For each one we walked the public
consultation, changed one answer at a time, read the code the website sends, and read its public documents. Here is
what that shows, in plain words.

1. **Most "consultations" decide nothing before you pay.** In 12 of the 19, no medical answer given before the
   sign-in wall changes what is offered. A prescriber decides later, out of sight, after the patient has given ID,
   an account and a card.
2. **LloydsPharmacy is the only UK company that acts on screen for most clinical risks before sign-in, with Numan
   next.** Both remove unsafe medicines and show prices before asking who you are. Dr Fox, Treated and Superdrug
   (women) filter a few answers. Even the best remove products silently and bluntly.
3. **Red flags rarely stop anyone.** At Boots, nine red flags at once reached the same ID screen and price. Hair + Me,
   Sons, Strut and Happy Head let patchy or sudden loss reach checkout with no message.
4. **Mental health is handled badly at both ends.** Numan and Sons show no crisis help for suicidal or hopeless
   thoughts. Treated and Philip Kingsley block minoxidil for any mood history, which the evidence does not need.
5. **Rules break and can be got round.** A typo stops Philip Kingsley's blood-pressure rule from ever working. Numan's
   product links skip its safety filter. Numan and Dr Fox let people change a stopping answer and carry on.
6. **Nobody diagnoses properly.** No UK company uses scalp photos to diagnose every new patient. Only Oxford Online
   Pharmacy\* offers blood tests (for women). Nobody asks what happened 2 to 4 months before the shedding, or about
   weight-loss injections.
7. **Prices vary up to four times for the same tablet.** Licensed finasteride costs £7.25 to £14 a month at Dr Fox and
   Oxford\*, and about £22 to £35 at the subscription brands. Headline prices are first-order offers on long plans.
8. **Unlicensed, "extra-strength" and dearest-first products lead the subscription ranges,** although MHRA guidance
   says licensed first, and the one trial of 10% minoxidil found it worse than 5%.
9. **Women are badly served.** Half the UK companies treat men only. The only anti-androgen for women in the UK set is
   a fixed 44 mg spironolactone dose inside a compounded capsule (Hers UK).
10. **Customers' biggest complaint is cancelling** (35% of negative reviews mention it). New UK subscription rules are
    expected from 1 January 2027.

**The opening (our view).** A UK service that diagnoses first, stops red flags before taking any details, shows the
real result and full price before an account, starts with licensed medicines and steps up on a written plan, gives
women their own pathway, and builds in follow-up and easy cancelling would beat every company in this set on safety
and on what customers complain about.

---

## 2. The 19 companies at a glance

**Engine types** (from [engines-experience.md](engines-experience.md), section 1):
**A** = shop shelf: the patient picks the medicine, a form checks safety, a clinician decides after payment.
**B** = product-removal filter: start with every product and remove whole drug families for risky answers.
**C** = preference lookup: two or three non-medical answers pick the product.
**D** = the clinician decides everything after payment; the form only collects answers.
**E** = marketing quiz with no logic, then an email or account wall.
**F** = gate only: a few eligibility questions, then an account.
Most companies stack two types; the first letter is the front door.

"Cheapest a month" is the lowest list price per month seen for a hair-loss medicine (not a supplement), on that
company's longest plan or pack, from [products-prices.md](products-prices.md) (read 23 and 24 November 2026, during Black
Friday). First-order offers are marked. Delivery and fees are left out unless stated.

### 2a. UK companies

| Company | Treats | Engine type | Questions before sign-in | What decides the product | Cheapest a month | Standout product | Biggest weakness | How well tested |
|---|---|---|---|---|---|---|---|---|
| **Hims UK** (Hers UK for women) | Men; women | E, then B after the wall (code) | Men: 11 quiz questions and 10 selling screens. Women: none (name asked first) | Nothing before the email. After it, a server step marks 10 products in or out (code); a clinician reviews without a call | £16.50 (finasteride + minoxidil spray or chew, 6-month plan paid up front) | Compounded finasteride 0.3% + minoxidil 6% spray; Hers UK spironolactone 44 mg capsule | All 42 quiz answers change nothing: everyone gets "Great news"; cancel only through support | Quiz observed and verified; after the wall code and leaflets only |
| **Voy\*** (was Manual) | Men; women | F (pop-up), then B in old code | Real quiz never seen; the pop-up asks 1 question | Not seen. Pop-up refuses patchy or complete loss. Old code had "reject" and "exclude" lists | "From £13" (first order, 6-month plan); full price not confirmed | 10% minoxidil spray; finasteride + minoxidil capsule | Asks for an email before saying "not eligible"; GPhC found its prescribing did not independently check answers (March 2026) | **Not walked live**: pop-ups observed; rest from docs and 11-month-old code |
| **Hair + Me** | Men; women | D | About 30 short screens (86 questions recorded) | A pharmacist prescriber picks 1 of 16 compounded formulas after payment | £37.91 (£34.99 every 4 weeks; first three £14.99) | 16 formulas at one price; niacinamide drops for pregnancy; pet-friendly capsules | No medical answer changes anything; the bag says only "Personalised treatment" | Observed and verified (68 replays) |
| **Sons†** | Men | B (in the browser, after the account form) | About 10 screens for a healthy man (65 recorded) | About 9 answers switch 5 drug options on or off; the top 1–2 of 12 plans are shown; partner-pharmacy prescriber reviews | £15 (own licensed 5% minoxidil spray, 12 months); first order from £13.60 | Holds the licences for its own finasteride and 5% spray; only topical dutasteride in the UK set | Never stops or warns a man; no crisis help for hopelessness; patchy, complete and sudden loss not referred | Before the wall observed; plan logic from code run offline; **final review not finished** |
| **Numan** | Men | B (server, before sign-in) | 8 for a typical man (bank of 29) | Two server flags (finasteride allowed, minoxidil allowed) plus an allergy list | £20 finasteride (annual billing); first order £16.80 | Triple spray: minoxidil 10% + azelaic acid 5% + finasteride 0.1% | Suicidal thoughts get no crisis help, and the question is skipped after a recent dose change; product links bypass the filter | Observed and verified |
| **Treated** | Men | A (fixed list of 5) with a hidden auto/review switch | 11 questions, height and weight, a 9-tick profile | The patient picks (finasteride pre-selected). Answers only stop, or send the case to hidden review | £21.83 finasteride (168 tablets) | Plain oral dutasteride 0.5 mg (generic or Avodart) | Any mental illness, even past anxiety, stops everything, minoxidil included | Observed and verified |
| **Dr Fox** | Men | A, with browser stops and server removal | 17 yes/no questions on one page | The patient picks; 11 stops; the server removes the finasteride or minoxidil family; a doctor approves before despatch | £7.25 finasteride (168 tablets), plus £1–4 fee and £2.90 delivery per order | Triple spray (finasteride 0.3% + minoxidil 5% + tretinoin) at £12–13 a month, no subscription | No diagnosis at all; "change your answer and continue"; two consultations put spray and tablets in one basket | Observed and verified |
| **Philip Kingsley** | Men; women | B (rules in the browser), with a paid-consultation route | About 12 per quiz plus follow-ups (3 quizzes) | The hair-loss picture picks the family; safety answers block products or send to a paid trichologist (from £200) | 3% minoxidil drops £36 a bottle (first £18); billing interval unclear | A trichologist consultation instead of a refusal | Full registration before any result; a typo means uncontrolled blood pressure still gets minoxidil | Observed, plus the site's own rule function run live; verified |
| **Boots** | Men | A; clinician decides | 19 screens (about 60 different questions over 4 forms) | The patient picks drug and pack; the server labels the order Normal, Query, Warning or Danger for the clinician | £20.42 finasteride (364 tablets); first-timers can buy only one month (£28) | Licensed-only range; store pick-up | Nine red flags at once reach the same ID photo screen and price; refusal only after ID, account and payment | Observed and code; verified |
| **Superdrug** | Men; women (Regaine only) | A (men); B (women) | One page: 11 questions plus up to 18 follow-ups | Men: the patient picks from a fixed list. Women: the server removes products silently. A doctor decides after payment | £22.83 finasteride (168 tablets); a 40% code lowers it | Two photos required before ordering for unusual men's patterns; £25 doctor phone call | Men's list never changes (allergy, cancer); no mood question for men; pregnancy keeps Regaine for Women on offer | Observed and verified |
| **LloydsPharmacy** | Men | B (server, before sign-in) | Up to 53, one per screen | Starts from 6 product cards and removes whole drug families; recommendation signed by a named GP | £16.50 (Sons 5% spray, 6 months); finasteride £23 (subscription) | Licensed oral minoxidil 2.5 mg tablet; a real treatment-history section | Removals are silent and blunt (any blood-pressure condition removes even the spray) | Observed and verified |
| **Oxford Online Pharmacy\*** | Men; women | A (docs only) | Not seen ("about 3 minutes") | The customer picks; a prescriber decides after payment | £9.17 finasteride (168 tablets) | Women's programme with blood tests (£75.99); licensed minoxidil tablets | Payment before review; the women's medicine is not named | **Public documents only** (site blocked) |

### 2b. US companies (for comparison)

| Company | Treats | Engine type | Questions before sign-in | What decides the product | Cheapest a month | Standout product | Biggest weakness | How well tested |
|---|---|---|---|---|---|---|---|---|
| **Hims (US)** | Men (women go to Hers) | E, then a state gate | 11 questions, 3 education screens | Nothing visible; a provider decides after the account (docs) | Finasteride from $22; combined spray from $29 on a 10-month plan paid up front | Many formats of finasteride + minoxidil (chews, sprays, serum) | Says the quiz "is not a medical assessment" but stores the answers; consent before any eligibility question | Before the wall observed and verified; after it docs |
| **Hers (US)\*** | Women | E (reported), then D | About 8 (reported) | A provider (docs); a vitamins question may pick the blend | Oral minoxidil $29 | Oral minoxidil 1.25 to 2.5 mg; post-menopause finasteride spray | Thin cause-finding reported; early shedding is 30% of its complaints | **Public documents only** (site blocked) |
| **Keeps** | Men | C | About 10 taps | Two answers: tablet or topical, and "strongest or cheapest" | Finasteride $26.67 ($18.67 first 3 months) | Compounded dutasteride + minoxidil chew | "You're approved" before any medical question; medical intake after payment | Observed and verified |
| **Ro†** | Men; women | E (3 questions), then B after the wall (code) | 3 (men), 3–4 (women) | Men: a fixed priority list minus up to 3 flags. Women: 6 referral stops | Finasteride $16 (12 months) | Ro Mane spray; explained stop screens for women | Its compounded spray is recommended to nearly every man, even one with no hair loss | Before the wall observed; full schema read in code; **final review not finished** |
| **Happy Head** | Men; women | C | 6 profile questions, then 12–16 medical | Sex, a woman's age band (under or over 50), tablet or topical | Finasteride from $24 (2025 price); main plans about $89 per 25-day bottle | "Dual" plan: dutasteride topical + capsule | Strongest plan pre-selected for every man; dutasteride offered to women 50+ who say they can become pregnant | Observed and verified |
| **Strut** | Men; women | A (one order form per product), then D | Oral minoxidil form: 17 screens. Most other forms: email first | The patient picks product and dose; a provider decides after ID and a saved card | Finasteride $16.33 (90 days) | Made-to-order compounded topicals; women's spironolactone 1% formula | No answer changes the cart; women's topical finasteride has no pregnancy question | Oral minoxidil observed; other forms code; verified |
| **XYON‡** | Men; women | F (gate), plus E on the marketing site | 4 (men), 5 (women) | A doctor after the account | Spironolactone $29; finasteride $35 | Patented gel base; spironolactone tablets in 25, 50 and 100 mg | Nothing personal before sign-up; the quiz always names the same gel | **Not independently verified** |

---

## 3. Each company in a paragraph: how its engine decides

### UK subscription and specialist brands

**Hims UK (with Hers UK for women).** The front door is a marketing quiz: 11 picture questions and 10 selling
screens. We tested all 42 answers one at a time. None changed anything. Every visitor, even one with no hair loss or
loss that began "in the past few months", got "Great news—we have options that may work for you" and then an email
box (observed, verified). The real engine sits behind the account. Code shows a server step that marks each of 10
products eligible or not, names one as recommended and greys out the rest ("Not available based on your medical
history"), or shows a rejection screen. Which answer removes which product is not public; Hims's leaflets are the
best guide. The man then pays up front for 3, 6 or 12 months, and a UK clinician reviews the form without a call.
Hers UK asks for a name on its first screen, so nothing there could be tested. Good touches: answers kept for 7 days
and a "Delete my answers" button.

**Voy\* (formerly Manual).** Voy's real quiz sat behind a security check and was never seen. What was seen is a
one-question pop-up on its landing pages. It refuses patchy or complete loss (men) and patchy loss (women), but only
after the visitor has typed an email, and a refused option looks exactly like an accepted one (observed). A December
2025 copy of the older Manual app's code shows a product-removal engine: an answer can carry a "reject" list (stop,
with a "Review your answers" button) or an "exclude" list (remove named products and carry on). Which answers sit on
which list could not be read. Voy publishes that finasteride is not for men trying for a baby or with a pregnant
partner, prostate or breast cancer, or severe depression, and that minoxidil is not for low or uncontrolled blood
pressure, a sore scalp or the over-65s. In March 2026 the GPhC found its prescribing service did not independently
verify patients' answers. A later inspection (August 2026) took statutory enforcement action, mainly over advertising
prescription-only medicines and first-order discounts; standards were met again in October 2026
(`foundations/uk-regulation.md`, 3.5). Treat everything about the quiz itself as unproven.

**Hair + Me.** The form collects answers and decides nothing a visitor can see. Across 68 live replays, only an age
under 18 stopped anyone. Heart disease, phaeochromocytoma (a rare adrenal tumour that raises blood pressure), an
infected scalp, minoxidil allergy, depression, patchy or sudden loss and even "no hair loss" all reached the same bag:
"Prescription · Personalised treatment · 4 week supply · 12ml", £34.99 (observed, verified). After payment a
pharmacist independent prescriber picks one of 16 compounded formulas (6 capsules, 10 drops) within the limits its
leaflets publish, for example no oral minoxidil with heart disease, and only niacinamide drops in pregnancy (docs).
The patient learns the drug, strength and format only when the parcel arrives. Good touches: a pet question that
nudges cat owners towards capsules, and two 0–10 wellbeing scores from day one. It bills every 4 weeks, so £34.99 is
really £37.91 a calendar month.

**Sons†.** Sons asks one gate question (sex at birth) and then never stops or warns a man: 33 live one-change
replays all reached the same account form, which takes name, email, phone, date of birth and a password before any
plan is shown (observed). After that, code in the visitor's own browser turns about nine answers into five on/off
switches (finasteride tablet, finasteride spray, minoxidil capsule, minoxidil spray, combination spray) and shows the
top one or two of 12 plans (code, run offline). Finasteride goes off for a PHQ-2 score of 2 or more (two standard
low-mood questions), sexual problems, kidney or liver disease, prostate disease and past side effects. Minoxidil goes
off for high blood pressure and heart disease. But "nearly every day" on the hopelessness question shows no message
and no crisis help; "random patches" and "completely bald" change nothing; sudden onset still offers a minoxidil spray;
and a supplement is never removed, so there is always something to buy. A partner pharmacy's prescriber reviews the
order afterwards. Final review of this research was not finished.

**Numan.** After LloydsPharmacy, the most active filter before sign-in in the UK. A typical man answers 8 questions and sees the full
offer and every price before giving any details. The server keeps two yes/no flags (finasteride allowed, minoxidil
allowed) and an allergy list. Seven answers move a flag: either allergy, scalp pain or itch, red rinds or rashes, any
blood-pressure diagnosis (minoxidil off), and "minoxidil only", specialist mental-health care or recent suicidal
thoughts (finasteride off). Under-18s, patchy or complete loss, sudden onset and over-65s who do not confirm they
understand are stopped, but every stop has "Review your answers". Serious gaps (all observed): a man with suicidal
thoughts in the past year gets no crisis help, only a quiet switch to minoxidil; if his mental-health medicine dose
changed in the last 3 months, the suicidal-thoughts question is skipped; a product link keeps that product featured
even when his answers rule it out; and his own opt-outs ("I do not wish to be considered for finasteride") are
ignored on screen. Good touch: the only early-shedding warning seen before sign-in.

**Philip Kingsley (PK Lab).** A heritage trichology clinic and haircare brand. Its full rule set is sent to the
browser, so it was read and run live. Each product has conditions that must be true (hair-loss picture, density, age,
scalp state) and blockers that must all be false (safety answers). The picture picks the family. Mild scalp symptoms
swap to "Healthy Scalp" plans. If every product is blocked (for example depression or anxiety, trying for a baby, any
cancer, sudden loss, a painful scalp), the person is sent to a paid trichologist consultation (virtual from £200,
clinic from £345) instead of being refused. That triage idea is good, but people must register fully before they
learn which route, or price, they face. A leading space in one rule means a man who ticks uncontrolled high or low
blood pressure is still offered minoxidil (confirmed live). It also over-blocks: a mood history blocks minoxidil-only
plans too. Its finasteride is a compounded capsule with biotin and vitamin D, sold to men who confirm it is unlicensed.

### UK pharmacies and online doctors

**Treated.** Treated shows the same five products with prices to almost everyone, with finasteride pre-selected,
before asking for contact details. The answers do not choose the medicine. They stop two groups (women, and anyone
with any history of mental illness, even past anxiety, which blocks minoxidil too). Otherwise they set a hidden
switch: "Auto" (automatic offer) or "Offline" (clinician review). The patient cannot tell which. Never having used
treatment, or not having seen a doctor, sends the case to review, so most first-time buyers are reviewed after paying.
In automatic mode only, smoking (even ex-smoking) or any alcohol removes dutasteride, and a BMI over 35 sends the case
to review; the clinical files give no reason for either. Low blood pressure gets the automatic offer with Regaine. It
is one of only two UK companies selling plain oral dutasteride.

**Dr Fox.** A cheap shop shelf with a one-page safety form: 17 yes/no questions, all public. Eleven answers stop the
form in the browser, and most say "You can change your answer and continue", which teaches people which answer
passes. One question picks spray or tablets. After submission the server removes the whole finasteride family for a
finasteride exclusion, and the whole minoxidil family for low-blood-pressure symptoms. Heart or blood-pressure
disease only shows a GP message, so Regaine solution is still sold although its SmPC lists high blood pressure as a
contraindication. There is no age, pattern, duration or photo question: the patient simply declares male pattern
loss. Filling the form twice can put the minoxidil-plus-finasteride spray and finasteride tablets in one basket
(observed). Strengths: the lowest prices in the set, the full total including fee and delivery before sign-in, no
subscription, and a doctor approves every order before despatch.

**Boots Online Doctor.** A narrow, licensed-only shelf for men: generic finasteride or Propecia, alone or with Regaine
foam. Three gates come first (mainland UK postcode, male, 18 or over). The man then picks medicine and pack
(first-timers can buy only one month), and his pick chooses one of four fixed questionnaires. Every answer carries a
plain, amber or red status, but the screen ignores it: nine stacked red flags (including suicidal thoughts, circular
patches and a painful scalp) reached the same ID photo screen with the same product and price (observed). The server
does label each order Normal, Query, Warning or Danger for the clinician, so the information is not lost. The patient
just learns of any refusal after ID photos, an account and payment. Crisis help is shown for suicidal thoughts. He
pays only if approved and can collect from a store.

**Superdrug Online Doctor.** A doctor-led clinic on the Zava platform with one-page forms. Men see a fixed list
(generic finasteride or Propecia in four pack sizes, or a £25 phone call with a doctor). It never changed in 16
one-change replays, even for finasteride allergy or prostate or breast cancer, and there is no mood question, only
consent text (observed). One good rule: men whose pattern is unusual (pictures A, E or "none fits") must upload two
photos before ordering, the only pre-order photo step seen in the UK. Women get a server filter that silently removes
products (Regaine for Women for high blood pressure, heart disease, non-pattern loss, or an allergy to minoxidil,
ethanol or propylene glycol), but pregnancy and breastfeeding change nothing. A doctor decides after payment. Orders
are one-off.

**LloydsPharmacy Online Doctor.** The most complete engine seen in the UK. It runs on the server, one question per
screen, entirely before sign-in. It starts from six product cards and removes whole drug families. Finasteride goes
for baby plans, breast or prostate cancer, sexual problems, other 5-ARI or erection medicines, allergy, or past side
effects. All minoxidil goes for heart or blood-pressure disease, blood-pressure medicines or minoxidil allergy. Oral
minoxidil goes for age 65 or over, kidney disease or phaeochromocytoma. Women, under-18s, sudden or non-pattern loss,
eyebrow or beard loss and severe kidney or liver disease end the questions. It skips questions once the drug they
protect has gone, takes a real treatment history, asks about pets and shows crisis help. Weak points: removals are
silent; rules are blunt (any blood-pressure condition removes even the spray, and low blood pressure removes topical
minoxidil, which the evidence does not need); and combination packs are recommended while out of stock.

**Oxford Online Pharmacy\*.** The site could not be opened, so this rests on its own pages read through search
summaries, and on reviews. It is a catalogue pharmacy: the customer picks a product and pack, answers a short
questionnaire (about 3 minutes), pays, and a prescriber approves or declines. Its pages state the rules: prescription
tablets for men only, 18 or over, dutasteride only after 6 months or more of finasteride, and oral minoxidil 2.5 mg
only, with blood-pressure checks (docs). Its women's programme is the only one in the set with blood tests (ferritin,
thyroid tests, B12, folate, vitamin D; £75.99), but the medicine is not named and other pages say oral treatments are
refused for women. Prices are among the lowest (finasteride £9.17 a month on 168 tablets), and customers praise its
speed and value.

### US companies (for comparison)

**Hims (US).** The same kind of quiz as Hims UK: 11 questions and three education screens. In 12 one-change replays
and two sweeps nothing changed (observed). Screen one honestly says the quiz "is not a medical assessment", yet the
answers are stored against an anonymous session. The first real gate is a state screen with a Terms and Telehealth
Consent tick; armed-forces addresses are refused. After the account (not seen), public pages describe a medical
question tree, photos "in most cases", a pre-selected product and dose the customer can change, and a provider
decision within about 48 hours. "Starting at" prices need a 10-month plan paid up front.

**Hers (US)\*.** Blocked at every stage, so this is published policy, not observed behaviour. Its help-centre leaflets
say finasteride (a post-menopause spray) is only for women past the menopause; oral minoxidil and finasteride are
ruled out in pregnancy, when planning one, or when breastfeeding; phaeochromocytoma rules out oral minoxidil; and a
heart history goes to the provider. A licensed provider decides after an account, by message or video depending on
the state. Reviewers describe little cause-finding and no blood tests. Early shedding nobody warned about is 30% of
its negative reviews, the highest in the set.

**Keeps.** A two-answer lookup. "How would you like to treat your hair loss?" picks the family. "What's your top
priority?" picks the strength: only "simple and affordable" gets finasteride; everyone else gets a compounded
dutasteride product. Thirteen other one-change replays changed only an echoed label (observed). It shows "You're
approved" and a "Confirming clinical eligibility" loader (a timed animation of about 5 seconds) before any medical
question; the medical intake comes after payment. One honest touch: the "Mostly Scalp" picture stops the journey and
says medicine is unlikely to help.

**Ro† (Roman).** Three marketing questions, then an email pop-up that cannot be closed. The full question schema is
in code the site sends, so both engines were read and simulated. Men: up to three "do not recommend" flags and a fixed
priority list (its compounded Ro Mane spray, then finasteride tablets, then oral minoxidil); all three stay pickable
and a clinician decides. The spray was recommended to nearly every profile, including a man with no hair loss yet, and
kidney disease of any stage or liver failure raised no flag. Women: a firmer gate. Pregnancy, a diagnosed scalp
condition, virilisation (male-type changes such as a deeper voice), lupus or autoimmune disease, scalp steroid
injections and minoxidil allergy end the visit with a referral. Its women's form is also the only one that asks about
recent illness, childbirth, weight loss and stress, though the answers change nothing on screen. Final review of this
research was not finished.

**Happy Head.** The offer depends on three answers: sex, a woman's age band (under or over 50) and tablet or topical.
The "Dual" bundle (topical plus capsule) is always first and pre-selected. Men and women of 50 or over get dutasteride
plus minoxidil; women under 50 get minoxidil plus a spironolactone capsule. The 12 to 16 medical questions that follow
never change the plan (25 live tests); they are tagged for a dermatologist after checkout. So a woman of 50 or over who
says she can become pregnant is still offered dutasteride, and a man who refuses the pregnant-partner risk keeps it.
Customers praise it as personal (51% of positive reviews) and complain most about cancelling (51% of negatives).

**Strut.** No recommendation engine: each product has its own order form, and most forms ask for email and phone on
the first screen. In the one form open without an account (oral minoxidil), the dose and price are picked on screen
two, before any medical question. Only three kinds of answer do anything: under 18 stops; "Yes" to self-harm shows a
crisis screen that cannot be passed (a good pattern); and some answers add free-text boxes. Heart failure, low blood
pressure, phaeochromocytoma and minoxidil allergy, even all at once, left the $65 cart unchanged (observed). Code shows
the women's topical finasteride form has no pregnancy question, and the oral minoxidil form never asks sex. A provider
decides after an ID check and a saved card.

**XYON‡.** A short gate: country or state, age, sex and, for women, pregnancy, trying to conceive, breastfeeding or
fertility treatment, all before any personal data. A pregnant woman is stopped before giving details, which is good.
Pass, and you must create an account; the medical history, preference, photos and ID come after, and a doctor
chooses. The "personalised" quiz on the marketing site always names the same gel. Not independently verified.

---

## 4. The ten most important findings across the market

Each finding gives the evidence and where to read more. "Observed" means replayed live; "code" means read in the
site's own served code; "docs" means the company's own documents.

### 4.1 Most consultations decide nothing the patient can see before payment

In 12 of the 19 companies, no medical answer given before the sign-in wall changes what is offered. The patient
picks the product, a preference picks it, or nothing is shown. A prescriber decides later.

- **Evidence:** Hims UK, all 42 quiz answers, no change (observed, verified). Hair + Me, 68 replays, same unnamed bag
  for every adult (observed). Superdrug men, 16 replays, list never changes (observed). Boots, nine red flags, same
  screen and price (observed). Keeps asks its medical questions only after payment (observed to the wall).
- **Why it matters:** a refusal, if it comes, comes after ID photos, an account and a card. "Refunds refused" is
  mentioned in 24% of negative reviews (`foundations/customer-voice.md`).
- **Read more:** [engines-experience.md](engines-experience.md) sections 1 and 2A;
  [rule-library.md](rule-library.md) section 4.

### 4.2 Contact details and payment come before the bad news

Only four UK companies show a filtered or recommended offer with prices before asking who you are: LloydsPharmacy,
Numan, Treated and Dr Fox. Elsewhere the order is backwards.

- **Evidence:** Voy's\* pop-up takes an email before saying "You aren't eligible" (observed). Philip Kingsley takes
  full registration before people learn whether they get a plan or a £200 to £345 consultation (code checked live).
  Keeps says "You're approved" before any medical question (observed). Ro's† men's email pop-up cannot be closed
  (observed). Boots, Strut and Oxford\* refuse only after ID, an account and card details.
- **Why it matters:** people who cannot be treated hand over data for nothing. Website and account problems are 14%
  of complaints; "easy process" is 21% of praise.
- **Read more:** [engines-experience.md](engines-experience.md) sections 2A and 5.1.

### 4.3 Red flags rarely stop the sale

Patchy, sudden or complete loss, or a painful or scarred scalp, may not be pattern hair loss and should be examined.
The minoxidil product information excludes sudden or patchy loss.

- **Evidence:** Numan, LloydsPharmacy and Dr Fox stop and point elsewhere (observed); this is right. Hair + Me, Sons†,
  Strut and the anonymous Hims quizzes do nothing (observed or code). Happy Head says scalp symptoms "may disqualify
  you" and then changes nothing (observed). Boots passes nine red flags to the same screen, though its server labels
  the order "Danger" for the clinician (observed and code).
- **Why it matters:** selling long-term treatment to the wrong diagnosis feeds the "no results" complaints (about
  22% of negative reviews as the main complaint).
- **Read more:** [rule-library.md](rule-library.md) section 3.4.

### 4.4 Mental health is handled badly at both ends

The MHRA (April 2024 and 11 May 2026) tells prescribers to ask about depression and suicidal thoughts before
finasteride, decide with the patient, and review regularly. It does not say block, and it says nothing against
minoxidil. Current suicidal thoughts need crisis help on the screen.

- **Too little:** Numan gives no crisis help for suicidal thoughts in the past year, and skips that question if the
  mental-health medicine dose changed in the last 3 months (observed). Sons† shows nothing for "nearly every day" on
  its hopelessness question (observed). Superdrug's men's form has no mood question at all (observed).
- **Too much:** Treated stops the whole consultation for any mental illness, even past anxiety (observed). Philip
  Kingsley blocks every plan, minoxidil included, and sends people to a paid consultation (code checked live).
- **Done well:** LloydsPharmacy and Boots show crisis signposting; Strut's crisis screen cannot be clicked past.
- **Read more:** [rule-library.md](rule-library.md) sections 3.1 and 4.1.

### 4.5 Rules are blunt, often silent, and can be got round

- **Bugs:** a leading space means Philip Kingsley's blood-pressure blocker never matches, so uncontrolled blood
  pressure still gets minoxidil (confirmed live).
- **Bypasses:** Numan's product links keep the product featured even when the answers rule out its drug (observed).
  Dr Fox lets a second consultation put its finasteride spray and finasteride tablets in one basket (observed).
- **Undoable stops:** Numan's "Review your answers" and Dr Fox's "You can change your answer and continue" teach
  people which answer passes. The GPhC found in March 2026 that Voy's\* prescribing service did not independently
  verify patients' answers (`foundations/uk-regulation.md`, 3.5).
- **Blunt and inconsistent:** the licensed Regaine 5% solution SmPC lists high blood pressure as a contraindication,
  yet Dr Fox, Hair + Me and Treated keep topical minoxidil on offer. Meanwhile Numan, LloydsPharmacy and Dr Fox
  remove topical minoxidil for *low* blood pressure, which the evidence does not need.
- **Silent:** LloydsPharmacy, Sons† and Superdrug (women) remove products with no reason on screen. Sons† keeps the
  reasons in a hidden "Debug (Dev Only)" block.
- **Read more:** [rule-library.md](rule-library.md) sections 3.3, 4.1 and 4.3.

### 4.6 Diagnosis is the weakest link in the whole market

The clinical files say a remote service must first answer three questions: is this really pattern hair loss, is the
scalp healthy, and is there a trigger or cause to treat instead?

- **Photos:** no UK company was seen to use scalp photos to diagnose every new patient. Superdrug asks for two, and
  only for unusual men's patterns. Elsewhere photos serve tracking or refund promises (Voy\*, Sons†, Hair + Me).
- **Blood tests:** 18 of 19 offer none for hair. Only Oxford's\* women's programme includes them (docs).
- **Triggers:** nobody asks "did anything happen 2 to 4 months before the shedding started?" Only Ro's† women's form
  asks about illness, childbirth, weight loss and stress, and the answers change nothing.
- **Weight-loss injections:** no company asks, although hair loss is a listed side effect (2.5% on semaglutide 2.4 mg
  and 4.9% on tirzepatide, against 1.0% on placebo, in their SmPCs).
- **Read more:** [engines-experience.md](engines-experience.md) section 3.

### 4.7 Licensed-first is ignored by the subscription brands

MHRA Guidance Note 14 says a licensed medicine, even used off-label, comes before an unlicensed special, and that cost
or convenience are not reasons to choose a special.

- **Evidence:** Sons†, Voy\* and Hair + Me supply oral minoxidil as unlicensed capsules, although licensed 2.5 mg
  tablets exist (LloydsPharmacy and Oxford\* sell them). Hims UK's main products are compounded, in one fixed strength
  each (code). Defaults go to the strongest or dearest product: Happy Head pre-selects dutasteride plus oral minoxidil
  for every man; Keeps defaults to compounded dutasteride; Ro's† priority list puts its compounded spray first.
- **"Extra strength":** Voy\* (10%), Numan (6% and 10%), Hims (6% and 7%) and Happy Head (8%) sell minoxidil above
  5%. The one trial of 10% found it worse than 5% and more irritating (`foundations/clinical-men.md`, 3.1).
- **Read more:** [products-prices.md](products-prices.md) sections 2.3 and 5.3.

### 4.8 The same medicine costs up to four times as much, and headline prices are not real prices

- **Finasteride:** the same licensed tablet costs £7.25 to £14 a month at Dr Fox and Oxford\*, against about £22 to
  £35 elsewhere. The UK median is £28.50 for one month and £22.83 a month on 6 months. A year costs about £100 to £116
  at Dr Fox, against £240 to £276 at Numan, Boots, Sons† and Hims UK.
- **Regaine:** £29 a month at Dr Fox, £80 at Numan, for the same licensed solution.
- **Headlines:** Voy\* "from £13", Sons† "from £13.60" and Hair + Me £14.99 are first-order prices on long plans. Numan's
  banner said 50% off; the discount applied was 40%. Hair + Me bills every 4 weeks, so £34.99 is £37.91 a calendar
  month (£454.87 a year).
- **Read more:** [products-prices.md](products-prices.md) section 3.

### 4.9 Women are badly served in the UK

- **Evidence:** 6 of the 12 UK companies treat men only (Sons†, Numan, Treated, Dr Fox, Boots, LloydsPharmacy).
  Superdrug offers women only Regaine and supplements. The only anti-androgen is Hers UK's spironolactone, fixed at
  44 mg inside a compounded capsule: below the usual NHS starting dose of 50 mg, with no way to step up (code). Nobody
  in the UK set sells plain spironolactone tablets that can be stepped up, or a blood-test-led plan with a named
  medicine.
- **Questions missing:** no UK women's pathway seen acts on periods, acne, unwanted hair, PCOS, menopause, HRT or
  contraception. Superdrug keeps Regaine for Women on offer in pregnancy, with no warning.
- **US over-reach not to copy:** Strut's women's topical finasteride has no pregnancy question; Happy Head offers
  dutasteride to women of 50 or over who say they can become pregnant. Both drugs are contraindicated in women in UK
  product information.
- **Read more:** [products-prices.md](products-prices.md) section 4; [rule-library.md](rule-library.md) section 3.6.

### 4.10 Customers' top complaints trace back to engine and plan design

Figures are keyword screens of about 1,800 negative and 1,400 positive hair-related Trustpilot reviews, plus App Store
reviews and regulator findings (`foundations/customer-voice.md`). They are rough rates. The high-street online
doctors have almost no hair reviews, and the UK women's voice is thin.

- **Cancelling and unwanted renewals:** mentioned in 35% of negative reviews (Happy Head 51%, Sons† 45%, Keeps 38%).
  The cheap price needs a long prepaid plan; cancelling uses a harder route than joining (Hims UK: by message to
  support only; Sons†: sign up online, cancel by email).
- **Main complaint in a hand-read sample of 68:** delivery or stock about 28%, "no results" about 22%, subscription
  or refund about 18% (each about ±10 points).
- **Early shedding nobody warned about:** 9% overall, 30% at Hers (US)\*. Only Numan warns before sign-in.
- **Law:** UK subscription rules under the Digital Markets, Competition and Consumers Act (DMCCA: clear information,
  renewal reminders, easy online exit) are expected for new contracts from 1 January 2027; the regulations were still
  in draft on 23 November 2026.
- **Read more:** [engines-experience.md](engines-experience.md) section 4.

---

## 5. Shared blind spots: where every company is weak at once

A blind spot here is something almost no company does before sign-in, although the clinical, regulatory or customer
files say it matters. A company may do some of these privately after the wall; we could not see that. But a missing
question cannot be caught by a reviewer who never sees the answer.

| Blind spot | What we saw | Any exception | Why it matters |
|---|---|---|---|
| **The trigger question:** "what happened 2 to 4 months before it started?" | Nobody asks it as a timing question | Ro† (women) asks illness, childbirth, weight loss and stress, with no effect | It is how a clinician tells temporary shedding (telogen effluvium) from pattern loss. Without it, people whose hair would regrow get long-term treatment |
| **Weight-loss injections** (semaglutide, tirzepatide) | Nobody asks | None | A listed cause of shedding (2.5% and 4.9% against 1.0% on placebo); women are more affected. A growing group |
| **Scalp photos to diagnose every new patient** | None in the UK | Superdrug, unusual men's patterns only | Photos separate pattern loss from patchy, scarring or shedding loss, and give a baseline for later |
| **Blood tests when the history points to them** | 18 of 19 offer none | Oxford\* (women, docs) | Diffuse shedding in women needs full blood count, ferritin and thyroid tests |
| **A women's hormone and life-stage pathway** (periods, acne, unwanted hair, PCOS, menopause, HRT, contraception) | No UK women's pathway acts on these | Ro† (US, women) acts on virilisation | Decides which tests and medicines are safe; rapid virilisation needs urgent referral |
| **A licensed-first plan that steps up** | Nobody publishes one; subscription brands lead with fixed compounded mixes | None | The evidence ladder starts with licensed finasteride and minoxidil, reviews at 6 months, and steps up only if needed |
| **Spironolactone that can be stepped up; low-dose oral minoxidil from a licensed tablet for women** | Not sold in the UK set | Hers UK sells a fixed 44 mg compounded capsule | The clearest product gap for women |
| **What reacted: the minoxidil or the base?** | Allergy removes all minoxidil, or nothing happens | Superdrug (women) asks about propylene glycol; nobody switches to the foam | Most "minoxidil allergy" from the solution is a reaction to propylene glycol; the licensed foam has none |
| **Children and pets at home** | Nobody asks about children; only two ask about pets | LloydsPharmacy and Hair + Me (pets) | Infant hair growth after contact; minoxidil can poison cats |
| **A sexual-function baseline before finasteride** | Asked as an exclusion only; nobody records a baseline | None | Needed to judge later change; the MHRA says review regularly |
| **A written follow-up schedule and early-shedding warning** | No company publishes one | Numan warns about early shedding before sign-in | Checks at 2 to 4 weeks, 3, 6 and 12 months catch side effects and decide whether to change or stop |
| **One plain line explaining each removal or refusal** | Most removals are silent | Ro† (women) explains its stops | Patients cannot correct a mistake or find the right care; 6% of complaints are about unexplained holds and refusals |
| **One safety check across every route and every order** | Product links and second consultations get round the rules | Not seen anywhere | The GPhC expects systems to flag repeat accounts and orders that are too frequent |
| **GP letter as standard** | Usually left to the patient | Hims UK says it must tell the GP (code) | The GPhC expects GP details, consent and sharing for higher-risk medicines |
| **A fair subscription** (monthly by default, easy exit, one honest price) | Cheap prices need long prepaid plans; cancelling is hard | One-off pharmacies have nothing to cancel | Top complaint; DMCCA rules expected from January 2027 |

### What this means for a newcomer (our view)

1. **Compete on diagnosis, not on another quiz.** Ask three things before any product: where is it thinning, how fast
   did it start, and what happened 2 to 4 months before. Take a guided photo set from every new patient. Order blood
   tests only when the history points to them. No company in the set does all of this; customers name the missing
   photo and diagnosis, and it is the best defence against "no results".
2. **Put the stop questions first and make them real stops.** Age, pregnancy and red flags go in the first screens,
   before email or payment, and every stop gives a named next step (GP, dermatology, crisis help). Never take contact
   details from someone you cannot treat.
3. **Show the real result and the full price before asking for an account.** Only four UK companies do this now.
4. **Licensed first, then a written step-up plan.** Licensed finasteride and minoxidil first; review at 6 months; a
   licensed tablet before any special; specials only with a recorded clinical need. Price it near the honest end of
   the market. A year of finasteride at £240 to £276 leaves room below the subscription brands, while Dr Fox and
   Oxford\* show how low the floor is.
5. **Give women their own pathway.** Hormone and life-stage questions, bloods when needed, spironolactone that can be
   stepped up with contraception and potassium checks, and minoxidil from a licensed tablet where possible. This is
   the clearest gap in the UK set.
6. **Make the rules fair, explained and tested.** Three outcomes, not two: allowed, not allowed, or "prescriber decides
   and records why". One plain sentence for every removal. The same rules on every route, and an automated test for
   every rule. Do not over-block: no smoking, alcohol or BMI gates, no minoxidil block for a mood history.
7. **Build the follow-up into the product.** An early-shedding warning before the first dose, checks at 2 to 4 weeks,
   3, 6 and 12 months, mood and sexual-function questions every time, and a same-day route to a named prescriber for
   side effects, kept apart from sales.
8. **Be the easiest to leave.** Monthly by default, plan length chosen after the clinical result, a reminder before
   every charge, and cancel by the same route as joining. This answers the top complaint and the 2027 law.

These are judgements from the evidence, not tested business results. The full best-practice rule set (55 clinical
rules and 11 rules for the engine itself, each with its source) is in [rule-library.md](rule-library.md) section 5,
and 25 design lessons are in [engines-experience.md](engines-experience.md) section 6.

---

## 6. Where to read more

### The three detailed cross-company files

- [rule-library.md](rule-library.md): 35 clinical situations × 19 companies, where companies disagree, the safety
  gaps ranked by harm, and the best-practice rule set for a new UK service. Machine-readable copy:
  [rule-library.json](rule-library.json).
- [products-prices.md](products-prices.md): what each company sells, forms and bases, the price benchmark, the
  women's offer, product gaps and services around the product.
- [engines-experience.md](engines-experience.md): the six engine types, each company's questions and sign-in wall,
  what nobody asks, customer complaints and praise, dark and good patterns, and 25 design lessons.
- [findings.json](findings.json): the biggest findings in short form.

### One report per company

UK:

- [Hims UK (with Hers UK)](../reports/hims-uk.md)
- [Voy\*](../reports/voy.md)
- [Hair + Me](../reports/hair-and-me.md)
- [Sons†](../reports/sons.md)
- [Numan](../reports/numan.md)
- [Treated](../reports/treated.md)
- [Dr Fox](../reports/dr-fox.md)
- [Philip Kingsley](../reports/philip-kingsley.md)
- [Boots Online Doctor](../reports/boots-online-doctor.md)
- [Superdrug Online Doctor](../reports/superdrug-online-doctor.md)
- [LloydsPharmacy Online Doctor](../reports/lloyds-online-doctor.md)
- [Oxford Online Pharmacy\*](../reports/oxford-online-pharmacy.md)

US:

- [Hims (US)](../reports/hims-us.md)
- [Hers (US)\*](../reports/hers-us.md)
- [Keeps](../reports/keeps.md)
- [Ro†](../reports/ro.md)
- [Happy Head](../reports/happy-head.md)
- [Strut](../reports/strut.md)
- XYON‡: no report has been written yet. Use the digest [digest/xyon.md](digest/xyon.md) and the data file
  `../companies/xyon/company.json`.

The short digests for every company are in [digest/](digest/), one file per company.

### Background research (fact-checked)

- `../foundations/clinical-men.md` and `../foundations/clinical-women.md`: the clinical evidence.
- `../foundations/uk-regulation.md`: MHRA, GPhC, advertising and consumer law.
- `../foundations/customer-voice.md`: what customers praise and complain about.
- `../foundations/market-economics.md`: market size and pricing trends.
- `../market/uk-sweep.md` and `../market/us-intl-sweep.md`: 58 other UK sellers and 57 overseas sellers (not
  independently fact-checked, and not used for the findings above).
