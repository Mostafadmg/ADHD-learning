# Consultation engines and the customer experience: 19 online hair-loss companies

Written 24 Nov 2026 for a UK pharmacist independent prescriber planning a hair-loss service for men and women.

Built from: `synthesis/digest/sec-engines.md`, the header lines (account wall, how tested, coverage, question counts) of every
company digest in `synthesis/digest/`, targeted reads of `companies/<slug>/company.json` (question lists and the recorded
effect of every answer), `foundations/customer-voice.md`, `foundations/clinical-men.md`, `foundations/clinical-women.md`
and `foundations/uk-regulation.md`. No new web research was done for this file. Nothing here was invented: where a fact
could not be found in those files, the cell says "not seen" or "not public".

## How sure is this? Read this first

- **Everything after a company's sign-in wall is described from public documents or from code the site serves, not
  watched happening.** No research account was created, so nobody saw a real prescriber decide anything.
- **Voy, Hers (US) and Oxford Online Pharmacy could not be walked live** (bot checks). Voy's engine is known only from its
  landing-page pop-ups and an 11-month-old copy of the older Manual app's code. Hers (US) and Oxford Online Pharmacy are
  known only from their own pages, help centres and reviewers. Conclusions that lean on them are flagged.
- **XYON was not independently verified.** Treat its rows as a first draft.
- **Sons and Ro were still in final review when this synthesis started.** Their stage 2 data (live replays and code reads)
  is complete and is used here; small corrections may follow.
- Question counts come from the research files. They count every question recorded, including ones read from code
  after the wall, and some companies have several near-identical forms (Boots has four). Use them to compare size, not
  as exact figures.

## Words used in this file

- **Consultation engine:** the logic that turns a person's answers into a decision: stop, warn, which medicine, which
  strength, or "send to a clinician".
- **Sign-in wall (account wall):** the first screen that will not let you go further without giving contact details (an
  email, or a full account). Anything after it is hidden from a casual visitor.
- **Hard stop:** an answer that ends the journey ("you are not eligible").
- **Product removal:** an answer that takes one or more medicines off the list but lets the person carry on.
- **Server side / browser side:** where the rules run. "Server side" means on the company's computer, so a visitor cannot
  read the rules. "Browser side" means the rules are sent to the visitor's own browser, so anyone can read (and game) them.
- **Flag for clinician:** an answer that changes nothing on screen but is marked for the prescriber to look at later.
- **Compounded medicine or "special":** a medicine mixed for the patient by a pharmacy, not a licensed product. In the UK
  it is an unlicensed medicine and may only be supplied for an individual patient's special clinical need
  (MHRA Guidance Note 14, see `clinical-men.md` 10.4).
- **Off-label:** a licensed medicine used outside its licence (for example oral minoxidil tablets, licensed for high
  blood pressure, used for hair).
- **Telogen effluvium (TE):** sudden, diffuse shedding that starts about 3 months after a trigger such as childbirth,
  illness, crash dieting or a new medicine (`clinical-women.md` 1.3). It is not pattern hair loss and usually needs no
  prescription.
- **Ferritin:** the blood test for iron stores. Low ferritin is linked (weakly) to shedding in women.
- **PHQ-2:** two standard screening questions for low mood.

## Summary (the 10 most important findings)

1. **Most "consultations" decide almost nothing that the patient can see before payment.** In 12 of the 19 companies, no
   medical answer given before the wall visibly changes what is offered: the patient picks the product, a preference
   picks it, or nothing is shown at all (Superdrug does the same for men; Voy and Oxford could not be seen). The real
   decision is made later by a prescriber, out of sight.
2. **The big subscription brands put a marketing quiz in front of the real consultation.** Hims UK tested all 42 answer
   options: none changed anything, and every visitor got "Great news—we have options that may work for you" before an
   email box. Hims US, Ro (men's first three questions) and XYON's marketing quiz work the same way, and Keeps' quiz
   uses only two of its answers (tablet or topical; "strongest or cheapest") to pick the product.
3. **The safest engines seen are "subtraction filters" (our view):** start from every product and remove whole drug families for real
   contraindications. LloydsPharmacy, Numan, Philip Kingsley, Sons (after the wall) and Ro work like this.
4. **Red flags rarely stop anyone.** At Boots, nine stacked red flags reached the same ID photo screen with the same
   product and price. Hair + Me, Sons, Strut and Happy Head let patchy, sudden or inflamed-scalp loss reach checkout with
   no message; Superdrug (men) shows "see your GP first" but lets the order through.
5. **Diagnosis is the weakest link.** The only scalp-photo requirement actually seen in a UK company is Superdrug's, and
   only for men whose pattern looks unusual. Only Oxford Online Pharmacy (women's programme, from its own pages) offers
   blood tests. No company asks about weight-loss injections. Only Ro's women's form (read in code) asks about recent
   illness, childbirth, weight loss, stress and contraception changes together, and even there the answers change nothing
   on screen (childbirth and chemotherapy are only flagged for the clinician).
6. **Many stops can be undone.** Numan ("Review your answers"), Dr Fox ("You can change your answer and continue") and
   Voy's older app teach people which answer passes. The GPhC criticised Voy for not verifying answers.
7. **Some walls capture leads at the patient's expense.** Voy's pop-up and Philip Kingsley take contact details before
   telling people they are refused or must pay £200 or more for a consultation.
8. **The commonest complaints are about the service around the engine** (subscriptions and cancelling 35% of negative
   reviews; delivery about 28% and "no results" about 22% as the main complaint), but they trace back to engine choices:
   long prepaid plans as the default, no baseline photos, no follow-up schedule, no warning about early shedding.
9. **Good patterns exist and can be copied:** Lloyds' smart skipping and treatment history, Numan's early-shedding
   timeline and clinician playbook, Philip Kingsley's "route to a consultation instead of refusing", Ro's explained
   women's stop screens, Strut's crisis screen, Hims UK's "Delete my answers", Hair + Me's pet question.
10. **The opening for a new UK service:** a short, honest consultation that diagnoses first (photos, red flags, triggers),
    shows the result and full price before contact details, explains every removal, books follow-up at fixed points and
    makes cancelling as easy as joining.

---

## 1. Engine archetypes: how the decision is really made

Every company says its consultation is "personalised" or "reviewed by a clinician". What matters is **where the decision
is actually made, by what, and when the patient finds out**. Six patterns cover all 19 companies. Most companies stack
two or three of them (section 1.7).

| Archetype | One-line description | Main users |
|---|---|---|
| A. Shop shelf with a safety form | The patient picks the medicine; the form checks safety; a clinician decides after payment | Boots, Superdrug (men), Dr Fox, Oxford Online Pharmacy (docs only), Strut |
| B. Subtraction filter | Start with every product; each risky answer removes a whole drug family; the first product left is "recommended" | LloydsPharmacy, Numan, Philip Kingsley, Sons (after the wall), Ro (after the wall), Superdrug (women), Treated (automatic mode), Hims UK and Voy (both from code only) |
| C. Preference lookup | Two or three non-medical answers (sex, age band, tablet or topical, "strongest or cheapest") pick the product; safety comes later | Keeps, Happy Head, Voy's older plan picker |
| D. Clinician decides everything after payment | The form only collects answers; a prescriber chooses the medicine and strength later | Hair + Me, Strut, XYON, Hers (US) (docs only), Treated (review mode), and in effect Boots |
| E. Marketing quiz with no logic | A friendly quiz that changes nothing, then an email or account wall | Hims UK, Hims US, Ro (men's first 3 questions), XYON's landing quiz, Voy's pattern widget, Keeps' main funnel apart from its two picking questions |
| F. Gate-only front door | A few eligibility questions (age, sex, where you live, pregnancy), then an account | XYON, Voy's landing pop-ups, the Hims US state screen |

### A. Shop shelf with a safety form

**Who:** Boots Online Doctor, Superdrug Online Doctor (men), Dr Fox, Oxford Online Pharmacy (from its own pages only;
the site blocked the research machine), Strut Health.

**How it works.** The patient chooses a product, a pack size and so a price, either before the questions (Boots, Oxford,
Strut) or straight after a one-page form (Dr Fox, Superdrug). The questionnaire is a gate, not a recommender.

- Boots: three entry gates (postcode, sex, age), then the man picks medicine, brand and pack. His choice selects one of
  four fixed questionnaires. Every answer carries a plain, amber or red status, but the screen ignores it. The server
  labels the order "Normal", "Query", "Warning" or "Danger" for the clinician (observed).
- Dr Fox: 17 yes/no questions on one page. Eleven answers are hard stops in the browser. After submission the server
  removes products: a finasteride exclusion takes off every finasteride product; low-blood-pressure symptoms take off
  every minoxidil product (observed).
- Superdrug (men): the list is fixed (finasteride or Propecia in four pack sizes, or a £25 phone consultation). Sixteen
  one-change replays never changed it.
- Strut: each product has its own form. In the one form open without an account (oral minoxidil) the patient picks the
  dose and price on the second screen, before any medical question.

**Strengths.**
- The full price is visible before any sign-in (Dr Fox, Superdrug, and Boots in effect), and there is no subscription
  (Boots, Dr Fox, Superdrug, Oxford).
- Customers reward this. Oxford Online Pharmacy scores 4.7 on Trustpilot with only 3% of reviews at 1–2 stars; its
  praise is about speed (38% of positives) and value (28%) (`customer-voice.md` 1.3 and 4).
- Licensed medicines first (Boots sells only licensed finasteride and Regaine).

**Risks.**
- No diagnosis. Dr Fox asks no age, pattern, duration or photos; the patient simply declares male pattern hair loss.
- The patient must already know what they want. Strut sells 13 hair products and explains none of them.
- Red flags do not stop the journey. At Boots, nine stacked red flags and three "I will stop my consultation" answers
  reached the same ID photo screen, product and price. Strut accepted heart failure, low blood pressure,
  phaeochromocytoma and a minoxidil allergy with oral minoxidil still in the cart (observed).
- Refusal comes late, after ID photos, an account and card details (Boots, Strut, Oxford).
- Checks work one order at a time. At Dr Fox a second consultation put the compounded spray and finasteride tablets in one
  basket, even with conflicting answers, with no warning before the login page (observed).

### B. Subtraction filter

**Who:** LloydsPharmacy (server side, fully before the wall), Numan (server side, before the wall), Philip Kingsley
(browser side), Sons (browser side, after the wall), Ro (read from served code, after the wall), Superdrug women
(server side), Treated (automatic mode only), Hims UK (server side after the wall; read from code, not seen) and Voy
(older Manual app code: "reject" and "exclude" lists, not seen running).

**How it works.** The engine starts from every product. Each answer can switch off a whole drug family:

- **Finasteride off** for mood problems, plans for a baby, prostate or breast cancer, sexual problems or past side
  effects (Lloyds, Numan, Sons, Ro, Philip Kingsley).
- **Minoxidil off** for heart or blood-pressure disease, allergy, or an inflamed scalp (topical only).
- **Hard stop** for women (in men-only services), under-18s and non-pattern loss.

Whatever survives is shown, usually with one product "recommended" from a fixed priority order.

- Lloyds starts from six cards and removes families; when both families are gone, the questions end early with no
  product. Follow-up questions are skipped once the drug they protect has gone (observed).
- Numan works out two yes/no flags (finasteride allowed, minoxidil allowed) plus an allergy list; only seven answers move
  a flag on screen (observed).
- Sons turns answers into five on/off switches in the browser after the wall and shows the top one or two of twelve
  plans (code, run offline).
- Philip Kingsley gives each product "conditions" that must be true and "blockers" that must all be false. If nothing
  passes, the person is routed to a paid trichologist consultation (virtual from £200, clinic from £345) instead of being
  refused. This is the only "triage" engine in the set.
- Ro (men) is a "soft steer": up to three "do not recommend" flags and a fixed priority list (Ro Mane Spray, then
  finasteride tablets, then oral minoxidil). All three products stay pickable. Ro (women) is a gate: six answers end the
  visit with a referral (code).

**Strengths.**
- Consistent and testable: every rule re-tested in stage 3 replayed the same way at LloydsPharmacy (8 rules), Numan
  (10 rules) and Philip Kingsley (19 more live replays matched the site's own rule function).
- Real contraindications act before payment (Lloyds, Numan, Dr Fox).
- A fallback almost always exists, so few paying customers leave with nothing (Hims UK's whole range; Sons keeps a
  supplement that is never removed).
- When it runs before the wall it can show a real result and price anonymously (Lloyds, Numan).

**Risks.**
- **Blunt rules.** Removing a whole family ignores nuance: any heart or blood-pressure condition, even treated mild
  hypertension, removes the minoxidil spray as well as tablets at Lloyds and Sons. Numan removes minoxidil even when the
  man says he understands and wants it.
- **Silent removals.** Lloyds, Sons and Superdrug (women) remove products with no explanation. Sons even holds the
  reasons in a hidden "Debug (Dev Only)" block on the page. A Superdrug woman allergic to minoxidil, fish and caffeine is
  left with only the £25 phone consultation and no message.
- **Bypass routes.** At Numan, a product entry link keeps its product featured even when an answer rules out its drug
  (observed).
- **Undoable stops.** Numan's stop screens have "Review your answers"; Voy's older app had the same button.
- **Configuration errors.** Philip Kingsley's blood-pressure blocker has a leading space, so men who tick uncontrolled
  blood pressure are still offered minoxidil (observed live).
- **Readable and gameable** when it runs in the browser (Sons, Philip Kingsley, Ro): anyone can download the rules and
  learn which answers pass.
- **"Always something to buy" can replace triage.** A Sons customer reporting sudden loss is offered a minoxidil spray,
  a non-prescription plan and a supplement instead of being referred (code).

### C. Preference lookup

**Who:** Keeps (main funnel), Happy Head, Voy's older plan picker (still online).

**How it works.** Two or three answers about the person, not their health, pick the product before any safety question.

- Keeps: "How would you like to treat your hair loss?" picks the family; "What's your top priority?" picks the strength
  ("simple and affordable" gives finasteride; anything else gives the dutasteride "plus" product). Thirteen other
  one-change replays changed nothing but an echoed label. Medical screening happens after the wall and payment.
- Happy Head: only sex, a woman's age band (under or over 50) and tablet or topical reach the recommendation call. The
  "Dual" bundle is always first and pre-selected. The 12 to 16 medical questions that follow add follow-up pages but
  never remove, switch or block a product (25 live tests).
- Voy's older page: "Tablets" or "Spray" switches the product at the same price; plan length changes only the price.

**Strengths.**
- Very short: about ten taps to a named product and price at Keeps; six profile questions at Happy Head.
- The patient feels in control, and switch links show the other family at once.
- Happy Head's customers praise personalisation more than anyone's (51% of its positive reviews), although only three
  inputs drive it (`customer-voice.md` 4). Feeling personal and being personalised are different things.

**Risks.**
- **The strongest or dearest product becomes the default.** Happy Head pre-selects dutasteride plus oral minoxidil for
  every man, even "just exploring". Keeps defaults to a compounded dutasteride product for every man who does not ask
  for "cheap", never licensed finasteride first.
- **Approval theatre.** Keeps shows "You're approved" and "clinically recommended" before any medical question; its
  "Confirming clinical eligibility" loader is a timed animation of about 5 seconds.
- **Contradictions are not caught.** At Happy Head a man whose partner is pregnant declines finasteride and dutasteride,
  yet dutasteride stays in the plan.

### D. Clinician decides everything after payment

**Who:** Hair + Me, Strut, XYON (not verified), Hers (US) (docs only), Treated (most first-time buyers), and in effect Boots
and Oxford.

**How it works.** The form collects answers and passes them on. Nothing visible depends on them. A prescriber chooses
the medicine, strength and formula after the account and payment.

- Hair + Me: 47 replays; every adult over 18 ends with the same bag: "Prescription · Personalised treatment · 4 week
  supply · 12ml", £34.99. A pharmacist prescriber then picks one of 16 compounded formulas (6 capsules, 10 drops). The
  company says this "isn't automated or AI".
- Treated: the server marks each case "Auto" (automatic offer) or "Offline" (clinician review). Never having used
  treatment, or not having seen a doctor, sends a case to review. The patient sees the same screen either way.
- Strut: every clinical decision (approve, decline, strength, which actives go into a compound) is made by a provider
  after an account, an ID check and a saved card.

**Strengths.**
- Room for real clinical judgement and a broad formulary at one price (Hair + Me).
- No "computer says no" for borderline cases.
- Hair + Me offers pregnant or breastfeeding women niacinamide drops instead of a refusal.

**Risks.**
- **The patient pays without knowing what they will get.** Hair + Me's bag names no drug, strength or format; reviewers
  report asking for a liquid and being sent capsules (`customer-voice.md` 3.11).
- **No safety feedback.** Heart disease, phaeochromocytoma, an active scalp infection, a minoxidil allergy and depression
  each produced no warning at Hair + Me (observed).
- **Consistency depends on each prescriber** reading tick-boxes with no on-screen rules.
- **It looks like the "tick-box" model the BBC and the MHRA criticised**, unless the prescriber really does contact the
  patient (`customer-voice.md` 1.5; `clinical-men.md` 10.1).
- **Every order needs human time,** so delays and copy-paste replies follow when volume grows (13% of negative reviews
  mention slow or automated replies; Hair + Me 18%).

### E. Marketing quiz with no logic

**Who:** Hims UK, Hims US, Ro (men's first three questions), XYON's landing quiz, Voy's pattern widget, and Keeps' main
funnel apart from its two picking questions. Hers (US) probably works this way too (reported, not seen).

**How it works.** Picture questions about goals, pattern, hair type and stress, with "Why we ask" notes and selling
screens in between. Answers are echoed back on a summary screen. Then comes an email or account wall, and the real
medical form sits behind it.

- Hims UK: 11 questions and 10 selling screens. All 42 answer options were tested one at a time; none changed a screen,
  and every visitor got "Great news—we have options that may work for you". A man with no hair loss, no hair at all, or
  sudden loss "in the past few months" got the same message (observed, verified).
- Hims US: 11 questions; screen one says the quiz "is not a medical assessment" and is not shared with a provider, yet the
  answers are stored against an anonymous session id.
- XYON: the "personalised" quiz on the marketing site always recommends the same gel.
- Voy's pattern picker: only the headline statistic changes; every pattern opens the same quiz link.

**Strengths.**
- No friction and no dead ends, so no lead is lost before the email is captured (Hims UK's stated design strength).
- It builds commitment before asking for anything.
- Hims UK keeps answers for 7 days, lets the visitor go back, and offers "Delete my answers" (seen in stage 3).

**Risks.**
- **It looks like a consultation but is not one.** "Selected based on your goals" chips on Hims UK product pages are fixed
  text.
- **People who will be refused give their details first** (Hims US: no age, sex or pregnancy question comes before the
  Terms and Telehealth Consent).
- **Fixed copy can be wrong for the person.** Hims US tells a man who answered "No" to family history that family history
  causes his loss.
- **No early warning for red flags** (sudden loss, total baldness) that the company's own leaflets list.

### F. Gate-only front door

**Who:** XYON (four questions for men, five for women), Voy's landing pop-ups, the Hims US state screen.

**How it works.** A short gate checks who can be served at all, then hands over to an account.

**Strengths.** Done well, it stops people early: XYON stops a woman who is pregnant, trying to conceive, breastfeeding or
having fertility treatment before any personal data is collected.

**Risks.** Done badly, it collects data first: Voy's pop-up asks for an email before revealing "You aren't eligible" to
someone with patchy or complete loss, with no advice or referral. Ticking a refused option looks exactly like ticking an
accepted one (code, observed in replays).

### 1.7 Most companies stack layers

| Company | Front door (before the wall) | What really decides | When the patient learns the result |
|---|---|---|---|
| Hims UK | E (no-logic quiz) | B on the server after the wall (code), then a clinician | After email, account and medical form |
| Voy | F (pop-up) | B in the older app code; clinician review sees flagged and changed answers | Pop-up: after email. Quiz: not seen |
| Hair + Me | Data-capture form | D (pharmacist prescriber picks one of 16 formulas) | When the parcel arrives |
| Sons | Data-capture form | B in the browser after the wall, then a partner pharmacy prescriber | After name, email, phone, birth date and password |
| Numan | B on the server | B, then clinician review after payment | Before sign-in |
| Treated | Fixed list of five products | Hidden Auto or Offline switch; a clinician reviews most first orders | Product before sign-in; review status never shown |
| Dr Fox | A with browser hard stops | Server removes families, then a doctor | Product and total before sign-in |
| Philip Kingsley | Data-capture form | B in the browser (subscribe, or paid consultation) | Only after registration |
| Boots | A (patient picks) | D in effect; server labels risk for the clinician | Refusal only after ID photos, account and payment |
| Superdrug | A (men); B (women) | Doctor after payment | Product before sign-in; decision after payment |
| LloydsPharmacy | B on the server | B, then a clinician | Recommendation and price before sign-in |
| Oxford Online Pharmacy | A (docs only) | Prescriber after payment | After payment |
| Hims US | E, then a state gate | Provider after account (docs) | After account |
| Hers (US) | E (reported) | Provider (docs) | Reported: after account |
| Keeps | C | Provider after payment | "You're approved" shown before any medical question |
| Ro | E (3 questions) | B after the wall (complete schema read in code), then clinician | After email sign-up |
| Happy Head | C | Dermatologist after checkout; medical answers only tagged | Recommendation before email (price after) in most test arms |
| Strut | A (product-first order form) | D (provider after ID check and saved card) | After account, ID check and card |
| XYON | F, plus E on the marketing site | D (doctor after account) | After account (not verified) |

---

## 2. Company by company

"Questions" is the number recorded by the research (all flows, including ones read from code after the wall); the
number in brackets is how many come before sign-in. "What changes anything" is what live replays (or code, where
stated) showed actually moving: a stop, a removed or switched product, or a changed price. Extra follow-up screens are
mentioned only where they are the main effect.

### 2A. Questions, stops and the sign-in wall

| Company | Questions (before sign-in) | What actually changes anything | Hard stops | Where the sign-in wall is | Shown before the wall | Evidence |
|---|---|---|---|---|---|---|
| **Hims UK** | 53 (25). Men: 11 questions and 10 selling screens. Women (Hers UK): no anonymous step | Nothing before the wall: all 42 options tested. After the wall a server step marks 10 products eligible or not (code) | None before the wall; a "not eligible" screen after it (code) | Men: email after 21 screens. Women: name on the first screen | Nothing: a fixed "Great news" message; no product, strength or price | Pre-wall observed and verified; post-wall code and leaflets |
| **Voy** | 43 recorded (35), mostly from docs and old code; the real quiz was never seen | Pop-up: refuses 2 of 6 men's patterns and 1 of 4 women's. Pattern widget: nothing. Older plan picker: tablets or spray switches the product | Pop-up pattern (verdict only after an email); under-18s and non-pattern loss (published) | Pop-up: email after one question. Main quiz (older code): after the recommendation, plan length and add-ons | Pop-up: nothing until the email. Main quiz: recommendation and price (older code) | **Not walked live** (bot check); code is 11 months old |
| **Hair + Me** | 98 (86): about 30 short screens, about 3 minutes | A handful: sex swaps the question block; under 18 stops; three answers add a screen, one skips one; pets add a warning and a badge. The bag never changes | Age under 18 only | After the bag, at "Personalise your account" (legal name) | An unnamed "Personalised treatment" at £34.99 (no drug, strength or format) | Observed and verified |
| **Sons** | 73 (65); a healthy man taps through 10 screens | Before the wall only the women's stop (33 one-change replays). After it, browser code switches off drug families using about 9 of the answers | Women at question 2 | After the last consent: name, email, phone, date of birth, password | Nothing | Pre-wall observed; post-wall code run offline; **final review ongoing** |
| **Numan** | 41 (38); a straightforward man sees 8 of a bank of 29 | Seven answers move a safety flag on screen (two allergies, scalp pain or itch, red rinds or rashes, any blood-pressure diagnosis, "minoxidil only", specialist mental-health care or recent suicidal thoughts), plus the stops | Under 18, patchy or complete loss, sudden onset, 65+ answering No; all undoable with "Review your answers" | After product choice, billing and add-ons | Full recommendation and every price | Observed and verified |
| **Treated** | 25 (24): 11 questions, height and weight, a 9-tick profile | Two stops; smoking or any alcohol removes dutasteride (automatic mode only); most answers only switch the hidden Auto/Review mode | Female; any history of mental illness (including anxiety) | Checkout "Patient details" | Five products with prices, finasteride pre-selected | Observed and verified |
| **Dr Fox** | 23 (19): 17 yes/no questions on one page | Eleven browser stops; one question picks spray or tablets; the server removes finasteride or minoxidil families | 11, most saying "You can change your answer and continue" | After "Choose treatment" and "Confirm order" | Full product list and total price, including fee and delivery | Observed and verified |
| **Philip Kingsley** | 70 (67): about 12 questions plus follow-ups per quiz (men, women, scalp) | About half the questions feed the rules: pattern picks the family; safety answers block products or route to a paid consultation | Safety blockers route to a £200–£345 consultation rather than refusing | Straight after the last question, before any result | Nothing: even the route (plan or paid consultation) is hidden | Observed plus the site's own rule function run at the wall; verified |
| **Boots** | 192 recorded across 4 near-identical forms (about 60 different questions; 19 screens) | Only the 3 entry gates and the pack choice. Medical answers change nothing on screen; the server labels the order Normal, Query, Warning or Danger | Channel Islands postcode, female, under 18 | ID photo step (selfie and photo ID) straight after the last health question; account next | The product, pack and price the man picked; no recommendation | Observed and code; verified |
| **Superdrug** | 57 (54); one page, 11 always-shown questions plus up to 18 follow-ups | Men: nothing changes the list (16 replays); warning texts; photos required for unusual patterns. Women: server removes products for allergies, blood pressure, heart disease and non-pattern loss | None before the wall | After product choice and delivery choice | Full product list with prices | Observed and verified |
| **LloydsPharmacy** | 53 (53), one screen per answer | 16 questions remove a family or end the questions | Women, under-18s, sudden or non-pattern loss, severe kidney (eGFR under 30) or liver disease | After the final "I confirm" screen (not pressed; expected next) | Recommendation signed by a named GP, products and prices, pack size | Observed and verified |
| **Oxford Online Pharmacy** | Not seen; "about 3 minutes" (company pages) | Not seen; the prescriber decides after payment | Men only for finasteride, dutasteride and oral minoxidil; over 18 (docs) | After the questionnaire, before payment (docs) | The product and price the customer picked | **Public documents only** (site blocked) |
| **Hims US** | 30 (18): 11 questions, 3 education screens | Nothing in 12 one-change replays and 2 sweeps; the state screen refuses armed-forces addresses | State only | State screen with a Terms and Telehealth Consent tick | Nothing | Pre-wall observed; post-wall docs |
| **Hers (US)** | 17 recorded (8), all from reviewers and help pages | Not seen | Published: pregnancy, breastfeeding, phaeochromocytoma and others | Reported: after the quiz, before any result (2023 reviewer) | Reported: nothing | **Public documents only** (site blocked) |
| **Keeps** | 63 (51); about ten taps in the main funnel | Two answers pick the product (method, priority); 13 other one-change replays changed only echoed labels | "Mostly Scalp" picture, 12 states, unticked "18+ and assigned male at birth" box | Checkout (name, address, phone, date of birth, email, card); medical intake after payment | Named product, price and "You're approved" | Observed and verified |
| **Ro** | 137 (13). Men: 3 questions then wall, 19 screens to the result. Women: 3–4 then wall, 31 screens | Before the wall: only the wording or number of the next question. After it (code): men 3 "do not recommend" flags; women 6 referral stops and tablet removal for 4 conditions | Men: under 18, female, unserved zip only. Women (code): pregnancy, scalp diagnosis, virilisation, lupus or autoimmune disease, scalp steroid injections, minoxidil allergy | Men: an email pop-up that cannot be closed. Women: "Ready to go deeper?" sign-up | Nothing | Pre-wall observed; full schema read in code; **final review ongoing** |
| **Happy Head** | 48 (44): 6 profile questions, then 12–16 medical ones | Only sex, a woman's age band and tablet or topical (25 live tests); medical answers add follow-ups but never change the plan | Under 18 | An email page; a split test puts it either before the recommendation or after every medical question | Usually the recommendation (two cards, "Dual" pre-selected) but no price until the email | Observed and verified |
| **Strut** | 143 (28): one form per product; oral minoxidil 17 anonymous screens | Under-18 stop, a self-harm crisis screen, 3 free-text boxes; the patient picks the dose. No medical answer changes the cart | Under 18; "Yes" to self-harm thoughts (crisis screen that cannot be passed) | First screen for most products; oral minoxidil at "Create account" (75% through) | Oral minoxidil: dose and price, chosen before any medical question | Oral minoxidil observed; other forms code; verified |
| **XYON** | 50 (18): a 4-question gate (5 for women) | Country or state, age, sex and (women) pregnancy, conception, breastfeeding or fertility treatment decide eligibility; the marketing quiz always names the same gel | The gate answers above | After "Congrats! You are eligible." | "You are eligible"; nothing personal | **Not independently verified** |

### 2B. Photos, identity, GP, blood tests and follow-up

"Not seen" means the step sits behind the wall and no public document described it.

| Company | Scalp photos | ID check | GP | Blood tests | Follow-up after the first supply |
|---|---|---|---|---|---|
| **Hims UK** | No photo step in the quiz; terms say "You may be asked to upload photographs" | Switched on in the app's code ("verifyIdentity"); how and when not seen | GP practice asked at checkout: "we need to let your GP know if you are prescribed" (code) | None for causes of hair loss | "Regular check-ins" and unlimited messaging (selling screen); plan changes and cancelling go through support |
| **Voy** | A hair-photo step before order review in the older app; described as for progress tracking | From the bank card (docs); a reviewer's repeat order was held for an ID check they were not told about | Not found | None on the hair pages (sold for other services) | Photo progress tracker; two online consultations and monthly photos are conditions of the money-back promise |
| **Hair + Me** | Optional, after payment; if a prescriber asks and none arrive within 7 days, a non-prescription product is sent | Not seen | No GP question before the wall | None | "Regular check-ins", monthly progress photos and two 0–10 wellbeing scores; a reviewer says the annual review was requested only 4 days before supply ran out |
| **Sons** | Only for progress and the refund promise | British passport or driving licence number (code) | Optional consent to tell the GP; optional consent to read the NHS Summary Care Record | None | A repeat health check before renewals (code); six-month money-back promise |
| **Numan** | None before the wall; after it not seen | "Automatic identity check" after the order | GP-notification choice, skippable but "strongly encouraged" | None (a finasteride and PSA note only) | Not seen; supply every 3 months on prepaid plans |
| **Treated** | None before the wall; upload wording exists in the site's text files | Not seen | "Would you like us to tell your GP about any treatment we give you?" | None | Not seen |
| **Dr Fox** | None | The patient agrees to "identity verification checks"; method not public | Declaration to inform the GP; GP details at registration | None | None: pay per order, no subscription |
| **Philip Kingsley** | None in the quiz; consultations ask for photos 48 hours before | Not seen | A required tick that it is "best practice" to tell your GP (the patient's job) | None | Not seen; trichologist consultations available |
| **Boots** | No scalp photos; ID selfie only. (In the BBC's 2025 test purchases Boots was the only one of three companies that asked for a photo; the summary used here does not say which kind) | Selfie plus photo ID, before the account | "Would you like me to tell your GP about any care we provide?" | None (a PSA warning only) | One-off packs; a separate "returning" form (self-declared) |
| **Superdrug** | Men: 2 photos required for patterns A, E or "none fits" | Photo ID "may be required" (help page) | A tick that telling your GP is best practice; GP letter downloadable or sent on request | None | One-off orders; reorder with "a very short health assessment" |
| **LloydsPharmacy** | None before the wall | Not seen | A confirmation that the patient understands the importance of telling their GP | Asks for the latest eGFR (kidney blood test) if kidney disease is ticked | Not seen |
| **Oxford Online Pharmacy** | Men: none (company blog). Women: hair photos | Automatic, after ordering | Consent to tell the GP asked | Women's programme: ferritin, TSH, free T4, B12, folate, vitamin D, sent the same day (docs) | A new consultation for every reorder; no photo tracking |
| **Hims US** | "In most cases" (docs) | Photo ID "if further verification is required" | n/a (US) | None | Unlimited provider messaging; hair patients cannot request changes through the self-service tool |
| **Hers (US)** | Reported for some prescription products | Government ID reported (2026 review) | n/a | None described | Reviewer: no check-in in nearly four months (App Store) |
| **Keeps** | Required after payment, "to make a diagnosis" (code) | Government photo ID (code) | n/a | None | Renewal every 3 months; older FAQ: $5 annual consultation |
| **Ro** | Men: none (selfie and ID only). Women: scalp photos and tracked outcome scores (code) | Selfie plus ID (code) | n/a; tells people to book an annual blood-pressure check with their provider | None (asks history of anaemia, iron deficiency, thyroid disease and PCOS in women) | Not seen |
| **Happy Head** | After checkout (help centre) | Sometimes photo ID and a 5-second video | n/a | None (sells an at-home DNA kit, not a blood test) | A box to ask the doctor to change the formula; otherwise not seen |
| **Strut** | Two hairline photos on topical forms (code); none on the oral minoxidil form (observed) | Persona ID check on every order | n/a | None | Not seen |
| **XYON** | After the wall (code) | Photo ID (being tested for removal on half of US visitors) | n/a | None | Prescription valid 12 months; short renewal form and a change-dose route (code) |

**What the two tables show.**

- **Only four UK companies were seen to show a filtered or recommended offer with prices before asking who you are:**
  LloydsPharmacy, Numan, Treated and Dr Fox. Superdrug and Boots show a price, but for a product the patient chose.
  Voy's older app did the same in code, but it was not seen running.
- **Photos are almost never part of diagnosis in the UK.** Where they appear, they are for tracking or refunds (Voy, Sons,
  Hair + Me) or for unusual patterns only (Superdrug). This is the gap the BBC and customers name (`customer-voice.md`
  3.8).
- **The GP is usually the patient's job.** Philip Kingsley, Superdrug and LloydsPharmacy ask the patient to acknowledge it
  is "best practice" or "important" to tell their GP (Superdrug also offers a downloadable GP letter). Hims UK says it
  must tell the GP (code); Sons, Numan, Treated, Boots and Oxford Online Pharmacy ask for consent to do so; Hair + Me and
  Voy were not seen asking at all. The GPhC expects prescribers to get GP details and consent and to share information
  actively for higher-risk medicines, and to record why if they prescribe without it (`uk-regulation.md` 3.2c).
- **Nobody runs a planned follow-up schedule that is visible from outside.** `clinical-men.md` 10.3 proposes checks at
  2–4 weeks, 3, 6 and 12 months; `clinical-women.md` 4.4 adds an early-shedding message at 2–6 weeks. No company
  publishes anything like it.

---

## 3. What nobody asks (or almost nobody asks) that the clinical files say matters

The clinical files say an online service must first answer three questions: **is this really pattern hair loss, is the
scalp healthy, and is there a trigger or a cause that needs treating instead?** (`clinical-men.md` 10.2;
`clinical-women.md` 1.0, 1.11 and 4.1). The table checks each item against every question the research recorded.
"Before the wall" means a visitor can see it; "code" means it was read in served code after the wall.

| What matters | Why (clinical source) | Who asks, and what the answer does | Verdict |
|---|---|---|---|
| **Blood tests: full blood count, ferritin, thyroid** | PCDS: "all patients with diffuse alopecia require a FBC, ferritin and TFT"; most relevant for women and diffuse shedding (`clinical-women.md` 2.0–2.2) | Offered only by Oxford Online Pharmacy's women's programme (docs). Ro's women's form asks for a history of anaemia, iron deficiency, thyroid disease or PCOS (code: opens follow-ups, changes no product). Strut and Happy Head list thyroid among conditions (no effect). LloydsPharmacy asks for the latest eGFR, but only as a kidney safety check | **Gap.** 18 of 19 offer no tests. A men's service rarely needs them; a women's service does |
| **Scalp photos at the start** | Pattern loss must be confirmed; the minoxidil SmPC excludes sudden or patchy loss and an abnormal scalp. "Ask for photographs" (`clinical-men.md` 10.2); a six-photo set for women (`clinical-women.md` 1.1) | Superdrug (men, unusual patterns only, before the order). After payment or the wall: Keeps, Ro (women), Strut (topical forms), XYON, Happy Head, Hims US "in most cases". Optional at Hair + Me; tracking-only at Voy and Sons; none at Dr Fox, Boots, Treated, Numan, LloydsPharmacy (before the wall) | **Gap in the UK.** No UK company seen uses photos to diagnose every new patient |
| **Scalp symptoms in detail** (pain, burning, pustules, scale round hairs, smooth shiny skin) | Signs of scarring alopecia, which is permanent and needs urgent referral (`clinical-women.md` 1.0 and 1.11) | Asked by many, acted on by few. Acted on: LloydsPharmacy ("Your scalp symptoms need checking", topicals removed, see your GP), Numan (pain, itch or red rinds remove minoxidil), Philip Kingsley (severity follow-ups; severe goes to a consultation), Ro (women: a diagnosed scalp condition is a referral stop). Asked but ignored: Sons (scalp tick-boxes change nothing), Hair + Me (an active infection changes nothing), Happy Head ("may disqualify you", changes nothing), Ro men (pain, pus bumps and eyebrow loss only flagged) | **Partly covered,** but almost nobody separates scarring signs from ordinary dandruff or itch, and most only remove topicals rather than refer |
| **Medicines that can cause shedding** (a new medicine 2–4 months before; acitretin; stopping the pill; for men, anabolic steroids or testosterone) | A new medicine is a listed trigger of telogen effluvium: "ask the prescriber, do not just add a hair treatment" (`clinical-women.md` 1.3) | Medicine lists are asked by LloydsPharmacy, Boots, Superdrug, Philip Kingsley and Hair + Me, mostly to check interactions. Superdrug and Philip Kingsley ask about medicines "recently finished". Sons asks about new medicines only after "sudden" onset, and no served code reads it. Ro (women) asks about contraception changes in the last year (no effect). LloydsPharmacy explains how steroids drive pattern loss | **Gap.** Nobody asks the timing question: "did you start, stop or change any medicine in the months before the shedding began?" |
| **Recent illness, fever, surgery, COVID-19, major stress** | Classic triggers of telogen effluvium; shedding starts about 3 months later and usually regrows by itself (`clinical-women.md` 1.3) | Ro (women, code) asks about major illness, hospitalisation, surgery and a major life stressor in the last year: all have no effect. Hims UK and US ask "how often do you experience stress" (no effect; fixed copy says stress causes loss). Nobody else | **Gap.** The commonest cause of sudden diffuse shedding is not looked for |
| **Childbirth** | A listed trigger; shedding about 3 months after the birth (`clinical-women.md` 1.3) | Ro (women, code: "given birth in the last year", flagged for the clinician). Hair + Me (women: "I'm postpartum", no effect). Superdrug (women: "hair loss associated with childbirth" removes Regaine for Women). Pregnancy and breastfeeding are asked more widely, but as a safety exclusion, not as a cause | **Mostly missing** as a diagnostic question |
| **Rapid weight loss and weight-loss injections** (semaglutide, tirzepatide) | Hair loss is a listed side effect: 2.5% with semaglutide 2.4 mg and 4.9% with tirzepatide against 1.0% on placebo; mostly telogen effluvium; women "disproportionately affected" (`clinical-women.md` 3.13) | Ro (women, code) asks about "significant weight loss" (no effect). No company asks about weight-loss injections, although some of these brands prescribe them in other services (Voy's UK reviews are mostly about weight loss: `customer-voice.md` 1.3) | **Complete gap,** and a growing one |
| **Periods, androgen signs, PCOS** (irregular periods, acne, facial or body hair, deepening voice) | Androgen tests only with signs of excess; rapid virilisation needs urgent referral (`clinical-women.md` 1.6, 2.3, 4.1 questions 18–21) | Ro (women, code): excess body or facial hair, severe acne and irregular periods change nothing; clitoral enlargement, nipple discharge and a deepening voice are referral stops. Philip Kingsley: acne is a blocker. Hair + Me: PCOS is a tick-box with no follow-up. Nobody else, including the UK women's services seen (Superdrug, Hair + Me) | **Gap** in every UK women's pathway seen |
| **Menopause and HRT** | Common setting for thinning; HRT changes can cause shedding (`clinical-women.md` 1.4, 3.9) | Philip Kingsley asks both (no effect). Ro (women, code) asks about perimenopause in the last year (no effect). Hers (US) uses menopause as its finasteride rule (docs) | **Mostly missing,** and where asked it is not used |
| **Contraception** | Needed before oral minoxidil or spironolactone in a woman who could become pregnant (`clinical-women.md` 4.1 question 3) | Happy Head asks about birth control; Ro asks about recent contraception changes. Hair + Me asks one combined "pregnant, breastfeeding or likely to conceive" question | **Gap** for any service offering oral treatment to women |
| **Blood pressure and pulse readings** before oral minoxidil | A home reading before starting is a reasonable minimum; below 90/60 or a fast pulse rules out oral minoxidil (`clinical-men.md` 10.2; `clinical-women.md` 4.1 question 34) | Ro (men, code: range picture, resting heart rate, fainting), Happy Head (three questions for capsule plans), Hair + Me (optional last reading). Strut sells oral minoxidil with no blood-pressure question at all | **Partly covered;** no company verifies a reading |
| **Mood and sexual function before finasteride** | MHRA (May 2026): ask about depression and suicidal thoughts and review regularly; a sexual-function baseline is needed to judge later change (`clinical-men.md` 10.1–10.2) | Mood is widely asked (Sons' two PHQ-2 questions, LloydsPharmacy, Numan, Boots, Treated, Philip Kingsley, Dr Fox). Sexual function is asked as an exclusion by Sons, LloydsPharmacy, Ro and Dr Fox, but nobody records a baseline to compare later | **Mood covered; sexual-function baseline missing** |
| **Supplements, especially biotin** | Biotin can falsify blood tests, including troponin; no evidence it helps people who are not deficient (`clinical-men.md` 6) | Only Strut and Ro (women) ask about supplements. Meanwhile Voy and Hims UK sell products with biotin in them | **Gap,** and some companies add to the problem |
| **Family history** | Supports the diagnosis; the women's minoxidil SmPC says it is "not indicated when there is no family history" (`clinical-women.md` 4.1 question 17) | Asked by Hims UK and US, Philip Kingsley, Happy Head, Hair + Me and others. It changes nothing in any engine seen; Hims US even tells a man with no family history that family history causes his loss | **Asked as decoration** |
| **Eyebrow, eyelash and body-hair loss; a receding hairline in women** | Signs of alopecia areata or frontal fibrosing alopecia: refer (`clinical-women.md` 1.11) | LloydsPharmacy (eyebrow or beard loss ends the questions: a stop, seen live). Ro (flagged for the clinician, code). Sons ("other parts of your body": no effect). Hair + Me (eyebrow and hairline loss option: no effect) | **Asked by some, acted on before the wall only by LloydsPharmacy** |
| **Hair styling and traction** | Tight styles cause traction alopecia: stop the pulling first (`clinical-women.md` 1.7) | Hims UK and US, Hair + Me and Philip Kingsley ask about styling, but use it only for marketing or a haircare add-on | **Asked, never used clinically** |
| **Diet** (vegan, very restricted, heavy periods, bowel disease, weight-loss surgery) | Points to iron deficiency; order FBC and ferritin (`clinical-women.md` 4.1 question 30) | Nobody asks | **Complete gap** |
| **Previous treatment: how long, did it work, side effects** | Minoxidil used for under 6 months is not yet a failure; past side effects change the choice (`clinical-women.md` 4.1 question 32) | LloydsPharmacy asks benefit, duration, regular use and side effects for each product, and lets a man choose to retry finasteride. Ro (code) has a follow-up block per medicine. Hair + Me and Treated ask only a tick-list; Keeps asks "How did it go?" and ignores the answer | **Done well only at LloydsPharmacy** |
| **Pets** | Minoxidil is toxic to cats; 8 of 62 cats with signs of poisoning died in one study (`customer-voice.md` 3.11) | Hair + Me (warning and a "Better for pet owners" badge on capsules) and LloydsPharmacy (warning, skipped once topical minoxidil is gone) | **Good practice at two companies;** copy it |

**What this means.** Every company asks "where is your hair thinning?". Almost nobody asks "what happened 2 to 4 months
before it started?". That second question is how a clinician separates telogen effluvium (which needs reassurance,
sometimes bloods, and no prescription) from pattern hair loss (which needs long-term treatment). Without it, a
subscription engine will sell long-term treatment to people whose hair would have regrown by itself, which feeds the
"no results" complaints in section 4.

---

## 4. The customer side: what people complain about and praise, and the design choices behind it

Figures are from `customer-voice.md`: about 1,800 hair-related 1–2-star and 1,400 4–5-star Trustpilot reviews, plus App
Store reviews, regulator findings and the BBC. They are keyword screens (rough rates). A hand-read sample of 68 negative
reviews found the **main** complaint was delivery or stock (about 28%), "no results" (about 22%) or subscription, cancel
or refund (about 18%), each about ±10 points. Most reviews are of Hair + Me, Sons, Manual/Voy, Numan, Hims US, Hers US,
Keeps, Happy Head and two US brands outside this set (Musely, Nutrafol); the high-street online doctors have almost no
hair reviews.

### 4.1 Complaints mapped to their causes

| Complaint (share of negative reviews) | Engine or service choice that causes it | Where it was seen in the engines | What a better design does |
|---|---|---|---|
| **Cancelling and unwanted renewals** (35% mention; worst at Happy Head 51%, Sons 45%, Keeps 38%; FTC case against Hims & Hers; New York settlement with Keeps' owner) | The consultation flows straight into a long prepaid plan. The cheap headline price needs 6–12 months paid up front. Cancelling uses a different, harder route than joining | Hims UK: low price needs a 6- or 12-month plan; self-service cancelling is switched off and plan changes go through support. Voy: every headline price is a 6-month first-order plan. Numan: pay up front for 3, 6 or 12 months. Hims US: the low price needs 10 months up front. Sons: a £189 six-month renewal; sign-up online or by phone, cancel by email | Monthly by default; plan length chosen after the clinical result, not inside it; one-tap cancel and pause by the same route as joining; a reminder 7 days before every charge (DMCCA rules are expected from January 2027) |
| **Delivery, stock and gaps in treatment** (about 28% as the main complaint; stock gaps 14% at Numan) | Service, not engine, but engine choices make it worse: products recommended while out of stock, and checks that start too late | LloydsPharmacy leads the result screen with combination packs flagged out of stock. Boots shows most first-time packs as out of stock. Reviewers: Voy and Numan held paid repeat orders for ID checks; Hair + Me asked for an annual review 4 days before supply ran out (`customer-voice.md` 3.16) | Never recommend what cannot be shipped; tracked post; start reviews and ID checks 4–6 weeks before supply runs out; ship with about 3 weeks left |
| **"No results"** (about 22% as the main complaint) | No diagnosis step, so shedding (telogen effluvium) and non-pattern loss get long-term pattern treatment; no baseline photos; adverts that over-promise; no planned change at 6–12 months | Hims UK: a man with no hair loss, or sudden loss, gets "Great news". Ro: the spray is recommended to a man reporting no hair loss. Hair + Me: "no hair loss" still reaches a "Prescription" bag. Voy's pattern picker shows 50–63% "saw regrowth" for the most advanced stages while its pop-up refuses complete loss | Diagnose first (section 3); honest goals at the start; photos at 0, 6 and 12 months; change or stop at 6–12 months. Copy Keeps' honest "Mostly Scalp" stop, LloydsPharmacy's expectation screens for temple-only and extensive loss, and Superdrug's "unlikely to help" tick for advanced loss |
| **Refunds refused** (24% mention; "prescription medicines cannot be returned") | Payment is taken before the prescriber decides; guarantees come with hidden conditions | Payment before review: Keeps, Oxford Online Pharmacy, Hims UK (refund if not approved). Voy's money-back promise needs 180 days of use, two online consultations and monthly photos; Manual customers report refusals after following the steps | Take payment only on approval (Numan: "Payment pending approval"; Voy's older terms; Strut saves the card); full refund before dispensing; publish simple guarantee rules |
| **Side effects handled by sales or admin staff** (11%; Manual 24%; Hims US 18%) | No scheduled side-effect check; side-effect messages go to general support; consent quality varies | A Sons reviewer reporting a side effect was asked whether they wanted to cancel. Numan: recent suicidal thoughts give no stop or signposting; the man is simply moved to minoxidil. Good counter-examples: Hair + Me's finasteride consent screen with an opt-out; LloydsPharmacy's mental-health screen with crisis signposting; Strut's crisis screen | Route every side-effect message to a named prescriber the same working day; pause billing; check mood and sexual function at 2–4 weeks and 3 months (`clinical-men.md` 10.3) |
| **Early shedding nobody explained** (9%; Hers US 30%; Manual 18%) | No warning before the first dose and no check-in in weeks 2–8 | Only Numan was seen warning before the wall, in its "what to expect" timeline ("some people may shed more fine hairs than before. This is temporary and normal"). Hims UK's marketing screen leads with "90% saw reduced shedding" | A written warning before the first dose; a message at 2–6 weeks (`clinical-women.md` 4.4); a photo review if shedding is heavy |
| **No real clinician** (under-counted by keywords; BBC "tick-box" report; FTC allegation that most Hims customers did not get the promised consultation) | Archetypes D and E: the form decides nothing visible and nobody contacts the patient | Hims UK: no clinician call for hair; the whole consultation is a form reviewed afterwards. Hair + Me: photos optional, so most decisions come from tick-boxes. Ro (men): identity photos only | Name the prescriber; scalp photos at the start; a free call or video on request; the same clinician later |
| **Pushed to one product** (7%; "asked for tablets, sent a topical" 5% at Hair + Me) | Defaults to the dearest or strongest product; preferences asked but not binding; add-ons in the basket | Happy Head pre-selects dutasteride plus oral minoxidil; Keeps defaults to compounded dutasteride; Ro recommends its compounded spray first; Sons treats "I don't mind" as "oral capsule"; Hair + Me's format choice is not binding; Voy offers shampoo and vitamins as pre-checkout add-ons | Ask preferences (tablet or topical, pets, washing routine) and honour them, or explain in plain words why not; never pre-tick add-ons |
| **Price rises after the first order, and value** (4% rises; 7% too expensive) | The headline price is a first-order promotion on a long plan; the full price sits in small print | Voy: complete plan "from £19" bills £33.17 a month on 6-month billing and £44 monthly (from a search summary of Voy's page). Hair + Me: £14.99 or £12.99 introductory, then £34.99. Keeps: renewal $204.99 per 3 months against $100 first order. Hims UK: £16.50 a month on a 6-month plan, £60 for the monthly chew. Sons offered 40% then 50% off to a customer who was cancelling | One honest monthly price for the year, with the full price next to any offer; no retention discounts that tell loyal customers they overpaid |
| **Wanting a proper diagnosis or blood tests** (4%, higher among women) | No diagnostic questions or tests (section 3) | 18 of 19 offer no blood tests; women's pathways have no period, androgen or trigger questions | Diagnosis before product; bloods where the history points to them; refer when it is not pattern loss |
| **Distrust of compounded or changed products** (5%) | Fixed-strength compounded flagships; the formula is not named before purchase | Hims UK's flagships are compounded products in one fixed strength, so one ingredient cannot be lowered or stopped. Hair + Me names no drug before payment | Licensed first; when a special is used, say so, explain why, name the maker; warn before any formula change |
| **Website and account problems** (14%) | Full accounts demanded early; no way back | Sons and Philip Kingsley demand a full account before any result. Hims UK: a visitor who finished the quiz cannot retake it; reopening it sends him to the sign-up screen. Strut's "End questionnaire" lands on a broken page | Let people see their result without an account; ask for an account only to order |
| **Safety checks done badly: surprise holds, unexplained refusals, wrong records** (about 6%) | Checks that appear after payment without warning; refusals with no reason | Boots, Strut and Oxford refuse after ID, account and payment. LloydsPharmacy, Sons and Superdrug (women) remove products silently | Tell people at the start which checks will happen and when; explain every refusal or removal in plain words |

### 4.2 Praise mapped to its causes

| What people praise (share of positive reviews) | The design choice behind it | The catch |
|---|---|---|
| **Results** (40%; Manual 70%) | Effective medicines used long enough | Many positive reviews are invited and written in the first weeks (17% say "too early to tell") |
| **Easy process** (21%; Sons 49%, Hair + Me 40%, Oxford 27%) | Low-friction engines: Sons never stops a man after question 2; Hair + Me never says no except to under-18s | The same design lets red flags through (sections 1 and 3). The lesson is not "add friction for everyone" but "keep the typical case fast and stop the atypical one" |
| **Feels personalised** (20%; Happy Head 51%) | Clear "best for" cards and a choice between two plans | Happy Head's offer depends on only three inputs. People reward the feeling; a better engine can give both the feeling and the substance |
| **Customer service** (23%; Happy Head 67%) | Named staff who know the products and answer by phone | Not an engine feature, but it softens engine weaknesses |
| **Speed, value and clinicians who know the risks** (Oxford Online Pharmacy: fast delivery 38%, value 28%, clinician 21%) | Catalogue model, licensed products, no subscription | Weak diagnosis and no follow-up (Oxford's model has no photo tracking or check-ins) |
| **Clear information** (11%; Happy Head 22%, Manual 17%, Hair + Me 16%) | Explanations of each ingredient and what to expect | Few explain early shedding or what happens if it fails |

**The big pattern.** Customers mostly complain about the **service around the engine** (money, delivery, getting a
human). But those failures start in engine design: the consultation is built to end in a prepaid subscription, the
result is shown late, nothing is diagnosed, and nothing is scheduled after the first parcel. The two things customers
praise most that an engine can directly control are **ease** and **feeling personal**. The companies that score best on
ease (Sons, Hair + Me) are also the ones whose engines let the most red flags through, so a new service has to deliver
ease for the typical patient and real checks for the atypical one.

---

## 5. Dark patterns and good patterns seen

A **dark pattern** is a design that nudges people into something they did not choose, or hides something they would
want to know. Some below are probably deliberate; others look like neglect. Either way the effect on the patient is the
same. "Seen" means observed live unless the cell says code or docs.

### 5.1 Dark patterns

| Pattern | Where seen | Why it harms |
|---|---|---|
| **Verdict only after contact details.** The refusal or the route is hidden until an email or account is given | Voy's pop-ups ("You aren't eligible" only after the email; refused and accepted options look the same). Philip Kingsley (nobody learns whether they get a plan or a £200–£345 consultation until registered). Hims US (no age, sex or pregnancy question before the Terms and account) | People who cannot be treated hand over data for nothing and get no advice |
| **Approval theatre.** Reassuring results before any medical question | Keeps: "Good news - you're approved" and a "Confirming clinical eligibility" loader that is a timed animation. Hims UK: "Great news—we have options that may work for you" for all 42 answers, including no hair loss | Creates false trust; the real decision comes later and may differ |
| **Fake personalisation.** Copy that claims to use answers it ignores | Hims UK's "Selected based on your goals" chips are fixed text. Hims US tells men with no family history that family history causes their loss. XYON's quiz always names the same gel. Hair + Me's bag says "Personalised treatment" for everyone. Happy Head says it customises by age but uses only an age band | Misleads; also undermines trust when the parcel arrives |
| **Headline price that is not the real price.** First-order promotions on long plans; renewal prices in small print; discounts attached before any question | Voy (every headline is a 6-month first-order price; a hidden test in the page code would show "£33" struck through beside men's prices; a coupon code is attached from the landing-page address before any question). Hair + Me (£14.99 or £12.99, then £34.99). Keeps (renewal about double the first order, in checkout small print). Ro (35% or 50% coupons attach silently from ad links). Happy Head ("Black Friday sale, up to 60% off" on the email page) | Drives the price-rise and refund complaints. The DMCCA's ban on drip pricing has applied since 6 April 2025; whether a given page breaches it is a legal question, but it is a risk a new service should not copy |
| **A wall you cannot close** | Ro (men): an email pop-up after three questions that cannot be dismissed | No way to learn anything without giving an email |
| **"Change your answer and continue"** | Numan ("Review your answers" on every stop). Dr Fox ("You can change your answer and continue"). Voy's older app ("Review your answers" behind an "I agree only to provide accurate responses" tick) | Teaches people which answer passes. The GPhC found Voy's service did not independently verify answers (March 2026). Voy's older code did send "changedAnswers" to the prescriber, which helps only if someone reads them |
| **Silent removals and hidden reasons** | Sons keeps the reasons in a hidden "Debug (Dev Only)" block. LloydsPharmacy and Superdrug (women) remove products with no screen saying why. Dr Fox's spray route says "please cancel this consultation" instead of offering what is still safe | The patient cannot understand, correct a mistake, or seek the right care |
| **The dearest or strongest product by default** | Happy Head pre-selects dutasteride plus oral minoxidil for every man. Keeps defaults to compounded dutasteride. Ro's priority list puts its compounded spray first. Strut pre-selects the higher oral minoxidil dose. Sons treats "I don't mind" as "oral capsule" | Off-label and unlicensed products become first line; GN14 says a special should not be supplied where a licensed product meets the need |
| **Opt-outs and contradictions ignored** | Numan: "I do not wish to be considered for finasteride" leaves the finasteride kit featured. Happy Head: a man whose partner is pregnant declines finasteride and dutasteride, and dutasteride stays in the plan | The patient's own choice is overridden on screen |
| **Safety bypassed by the entry link** | Numan: a product entry link keeps its product featured even when the patient's answers rule out its drug | Ads land people on products their answers exclude |
| **Free-text boxes no rule reads** | Philip Kingsley: medicines and allergies are free text that no rule reads. Sons: three follow-ups after "sudden" onset are not read by any served code. Strut: three free-text boxes change nothing. Whether a prescriber reads them later is not known | The patient thinks they have flagged something important; the engine has not noticed |
| **Something to buy whatever happens** | Sons never removes its supplement; a man with sudden loss is offered a spray, a non-prescription plan and a supplement. Hair + Me ships a non-prescription product if requested photos do not arrive within 7 days (inferred from its FAQ) | Selling replaces referral |
| **Red flags labelled but not acted on** | Boots' server labels an order "Danger", but the patient still goes on to ID photos, account and payment, and only then may be refused | Refusal after payment and personal data; no advice at the moment it matters |
| **Data before consent** | Hims US stores quiz answers against an anonymous session id while telling the visitor the quiz is not a medical assessment. Hair + Me creates an anonymous visitor id on arrival and saves each answer as you go | Health data captured before any consent; the FTC case alleges sharing with advertisers (allegation only) |
| **Marketing that contradicts the rules** | Voy's pattern picker promises 50–63% "saw regrowth" for advanced stages that its pop-up refuses. Philip Kingsley's men's page says "FULLY LICENSED" while its leaflets say unlicensed. Keeps' product page says "You won't be charged until your prescription is approved" while checkout says the card is charged and refunded if not approved | Confuses and misleads; regulatory risk |
| **Hard exit** | Hims UK: cancelling and plan changes go through support (self-service cancel switched off). Sons: sign up online, cancel by email. Happy Head: AI chat, then phone. Sons offered 40% then 50% off when a customer tried to cancel | The top complaint (35%); against the coming DMCCA subscription rules |

### 5.2 Good patterns worth copying

| Pattern | Where seen | Why it helps |
|---|---|---|
| **Full price before sign-in**, including fees and delivery | Dr Fox (total including prescription fee and delivery), LloydsPharmacy, Numan, Treated, Superdrug | Trust; no drip pricing |
| **Honest labels on unlicensed and off-label medicines** | Dr Fox (explicit consent and plain warnings, including PSA, mood, sexual effects and the 12-month stop rule). Philip Kingsley (men confirm on the start screen that its finasteride and minoxidil are unlicensed). Hims UK (consent says the medicine may be compounded and off-label). Sons (says plainly which products are unlicensed specials). Keeps and Hers (US) ("not FDA-approved") | Informed consent; meets the MHRA expectation of a balanced view |
| **Honest label on a marketing quiz** | Hims US: the quiz "is not a medical assessment" | Sets expectations (but then the answers should not be stored as if it were) |
| **Smart skipping** | LloydsPharmacy skips pet and pregnancy questions once the drug they protect is gone | Shorter, more relevant form |
| **A real treatment history** | LloydsPharmacy asks benefit, duration, regular use and side effects for each past product, and lets a man choose to retry finasteride after side effects | Avoids calling a short trial a failure; respects informed choice |
| **A playbook for the prescriber** | Numan's served data has written clinician instructions behind every risky answer. Boots' server labels each order Normal, Query, Warning or Danger. Voy's older code sends changed answers to the prescriber | Makes the human review consistent and fast |
| **Route to a human instead of refusing** | Philip Kingsley sends anyone who trips a safety blocker to a trichologist consultation (virtual or clinic) | No dead end (but tell people before they register, and price it fairly) |
| **Explained stop screens with a next step** | Ro (women): firm stops for pregnancy, scarring and autoimmune alopecias and virilisation, with a find-a-dermatologist link (code). Keeps: "Mostly Scalp" says medicine is unlikely to work and points to restoration or cosmetic options. LloydsPharmacy: "Your scalp symptoms need checking", see your GP. Boots: plain gates with GP or Boots Health Hub signposting | The patient leaves with a plan |
| **A crisis screen that cannot be clicked past** | Strut: "Yes" to self-harm thoughts shows crisis numbers and stops. LloydsPharmacy and Boots show crisis signposting | Safety at the moment of disclosure |
| **Pet safety** | Hair + Me (question, warning, "Better for pet owners" badge on capsules). LloydsPharmacy (warning) | Answers a real harm (cat poisonings) and a real complaint |
| **Control over your own data** | Hims UK: answers kept 7 days so you can resume, go back to change an answer, and "Delete my answers" removes them at once | Respect; fits UK data protection |
| **Pregnancy stop before any data** | XYON (women: pregnancy, conception, breastfeeding, fertility treatment) before any account (not verified) | No data collected from people who cannot be treated |
| **A route instead of a refusal for pregnancy** | Hair + Me offers niacinamide-based drops with a consent screen and a leaflet | Keeps women in care safely |
| **Photos when the picture does not fit** | Superdrug requires two photos for unusual patterns before the order | Cheap, targeted diagnosis |
| **Change format without starting again** | Sons: a Spray/Capsule toggle on every plan card. Keeps: switch links to the other family | Less friction, fewer wrong orders |
| **Ask the doctor to change the formula** | Happy Head's customisation box | Patient voice in a compounded product |
| **Outcome scores from day one** | Hair + Me (two 0–10 wellbeing scores at sign-up, monthly photos). Ro (women: severity, confidence and stress scores, code) | Lets results be measured, not guessed |
| **Pay only on approval** | Numan ("Payment pending approval"), Strut (card saved, not charged), Voy's older terms, Boots | Removes the refund fight |
| **Verification routes beyond the questionnaire** | Sons: optional consent to read the NHS Summary Care Record and to contact the GP | The GPhC's independent-verification expectation |
| **Mood screening with a standard tool** | Sons: two PHQ-2 questions; a score of 2 or more removes finasteride | Uses a validated screen, as the MHRA asks |
| **Checking that answers fit** | Happy Head sends a woman back if her birth date does not match the age band she chose | Catches mistakes and gaming |

---

## 6. Design lessons for a better consultation

Each lesson says what to do, why, and the evidence. "Our view" marks a judgement rather than a sourced fact.

**Order and honesty**

1. **Put the stoppers first, and make them real stops.** Ask age, pregnancy and the red flags (scalp pain or burning,
   pustules or shiny skin, bald patches, eyebrow or eyelash loss, sudden onset, rapid androgen signs, systemic symptoms)
   in the first few screens. Any "yes" ends the sale and gives a named next step (GP letter, dermatology, urgent help).
   *Evidence:* `clinical-women.md` 4.1 ("the stoppers come first so that nobody answers 40 questions only to be told to
   see a GP"); Boots, Hair + Me, Sons, Strut and Happy Head let red flags through (sections 1–2); LloydsPharmacy and Ro
   (women) show it can be done.
2. **Never take contact details before telling someone they cannot be treated.** *Evidence:* Voy's pop-up and Philip
   Kingsley's wall (section 5.1); XYON stops pregnant women before any data (section 5.2).
3. **Show the real result and the full price before asking for an account; ask for an account only to order.**
   *Evidence:* LloydsPharmacy, Numan, Treated and Dr Fox do this; "easy process" is 21% of praise; account problems are
   14% of complaints (section 4).
4. **Every question must change something or be cut.** If an answer only feeds marketing, say so or drop it.
   *Evidence:* all 42 Hims UK options change nothing; family history, density and styling are decoration at Hims,
   Philip Kingsley and Happy Head; the Sons hair picture does nothing (sections 1E and 3).
5. **Explain every removal or refusal in one plain sentence and say what is still possible.** *Evidence:* silent
   removals at LloydsPharmacy, Sons and Superdrug; "please cancel" at Dr Fox; 6% of complaints are about unexplained
   holds, refusals and wrong records (`customer-voice.md` 3.16).

**Diagnosis first**

6. **Diagnose before you recommend.** Ask three things before anything about products: where is it thinning, how fast
   did it start, and what happened 2 to 4 months before. Route telogen effluvium to reassurance and, where needed,
   bloods, not to a subscription. *Evidence:* `clinical-women.md` 1.0 and 1.3; no company asks the trigger question
   systematically (section 3); "no results" is the main complaint in about 22% of negative reviews.
7. **Take a guided photo set from every new patient before the first prescription, and keep it as the baseline.**
   Parting from above, hairline pulled back, both temples, crown, eyebrows, any patch. If the photos do not fit the
   history, refer. *Evidence:* `clinical-women.md` 1.1; `clinical-men.md` 10.2 ("Ask for photographs"); only Superdrug
   requires photos, and only for unusual patterns; customers name the missing photo (`customer-voice.md` 3.8).
8. **Ask the modern triggers by name:** weight-loss injections (semaglutide, tirzepatide), rapid weight loss or crash
   dieting, childbirth in the last year, illness with fever or COVID-19, surgery, new or stopped medicines, stopping the
   pill or HRT. *Evidence:* hair loss in 2.5–4.9% on these injections against 1.0% on placebo (SmPCs in
   `clinical-women.md` 3.13); no company asks about the injections; only Ro's women's form asks most of the rest, with no
   effect.
9. **Give women their own pathway.** Ask periods, acne and unwanted hair, PCOS, menopause and HRT, contraception and
   pregnancy plans, and let the answers decide tests and medicines. *Evidence:* `clinical-women.md` 4.1 stages 1 and 4;
   the UK women's pathways seen (Superdrug, Hair + Me) ask almost none of this; women want "a diagnosis, blood tests,
   warnings about shedding" (`customer-voice.md` 7).
10. **Order blood tests only when the history points to them, and act on the result.** Diffuse shedding in women: full
    blood count, ferritin and thyroid. Androgen signs: early-morning testosterone and SHBG (not on the combined pill).
    Low haemoglobin with low ferritin is a GP referral, not a sale. Ask about biotin before any test. *Evidence:*
    `clinical-women.md` 2.0–2.4 and 4.2; only Oxford Online Pharmacy offers tests; only Strut and Ro ask about
    supplements while Voy and Hims UK sell biotin products.

**Fair rules**

11. **Use three outcomes, not two: allowed, not allowed, or "prescriber decides and records why".** Whole-family
    removal is too blunt for, say, well-controlled hypertension and a topical. *Evidence:* LloydsPharmacy and Sons remove
    even the minoxidil spray for any blood-pressure condition; Numan removes it even when the man says he understands;
    the topical minoxidil SmPC lists hypertension, and "a prescriber can judge otherwise but should record why"
    (`clinical-men.md` 10.2).
12. **Honour opt-outs and preferences, or explain why not.** *Evidence:* Numan leaves finasteride featured after "I do not
    wish to be considered"; Happy Head keeps dutasteride after a pregnant-partner opt-out; Hair + Me's format choice is
    not binding and "asked for tablets, sent a topical" is 5% of its negative reviews.
13. **Default to licensed first-line treatment, never to the dearest product.** Offer specials (compounded medicines)
    only with a recorded special clinical need. *Evidence:* Happy Head, Keeps, Ro and Strut defaults (section 5.1);
    MHRA Guidance Note 14 (`clinical-men.md` 10.4); distrust of compounded products is 5% of complaints.
14. **One safety check for every way in.** The same rules must apply to ad links, product pages, repeat orders and a
    second consultation, and they must look across orders for duplicates and conflicts. *Evidence:* Numan's entry links
    bypass the filter; Dr Fox's second consultation puts spray and tablets in one basket; the GPhC expects systems to
    flag multiple accounts and orders that are too frequent (`uk-regulation.md` 3.2b).
15. **Make a stop final within that consultation and show changed answers to the prescriber.** No "change your answer
    and continue". *Evidence:* Numan, Dr Fox and Voy's older app (section 5.1); the GPhC's March 2026 finding that Voy's
    service did not independently verify answers (`uk-regulation.md` 3.5).
16. **Run the rules on the server and test them like software.** One automated test per rule, plus a check of the
    rule file before every release. *Evidence:* Philip Kingsley's blood-pressure blocker failed because of a leading
    space; Sons, Philip Kingsley and Ro expose their rules to anyone (easy to copy and to game).

**Safety and consent**

17. **Record a mood and sexual-function baseline before finasteride or dutasteride, and repeat it at every review.**
    Give the patient-alert-card information in writing when the pack has no card (compounded or repacked products).
    *Evidence:* MHRA 2024 and 11 May 2026 updates (`clinical-men.md` 10.1); mood is widely asked but no company records a
    sexual-function baseline (section 3); finasteride worries are 12–14% of negatives at Hims US and Manual.
18. **Write consent screens that teach, with a real opt-out.** *Evidence:* good models at Hair + Me (finasteride and
    dutasteride consent with opt-out), LloydsPharmacy (safety screen with crisis advice), Philip Kingsley (unlicensed
    confirmation) and Dr Fox (plain warnings); the MHRA told Sons in 2021 to avoid "absolute statements of safety".
19. **Get GP details and consent, and send the GP a letter as standard.** Offer NHS record access as a verification
    route. *Evidence:* GPhC distance guidance (`uk-regulation.md` 3.2c); most companies leave telling the GP to the
    patient (section 2B); Sons' optional Summary Care Record consent.
20. **Tell people at the start which checks will happen and when (ID, photos, blood pressure, reviews), and finish
    them before payment or before supply runs out.** *Evidence:* reviewers' paid orders held for unexplained ID checks
    at Voy and Numan; a Hair + Me annual review requested 4 days before supply ran out (`customer-voice.md` 3.16).
21. **Ask about pets and about women and children at home,** and offer pet-safer formats. *Evidence:* Hair + Me and
    LloydsPharmacy do this; cat poisonings (`customer-voice.md` 3.11); `clinical-men.md` 10.2 (topical finasteride and a
    male fetus).

**After the first parcel**

22. **Warn about early shedding before the first dose and check in at 2–6 weeks.** *Evidence:* 9% of negatives, 30% at
    Hers US; only Numan warns before the wall; `clinical-women.md` 4.4.
23. **Build the follow-up schedule into the product:** side-effect check at 2–4 weeks and 3 months, photo comparison at 6
    and 12 months, then change or stop if it is not working. *Evidence:* `clinical-men.md` 10.3 and `clinical-women.md`
    4.4; no company publishes a schedule; "results not tracked" and "no results" complaints (section 4).
24. **Keep the clinical channel separate from sales.** Any side-effect message goes to a named prescriber the same
    working day, billing pauses, and it is never answered with a retention offer. *Evidence:* the Sons reviewer offered
    cancellation instead of advice; Manual's lost call-back (`customer-voice.md` 3.6); side effects are 11% of negatives.
25. **Choose plan length after the clinical result; default to monthly; cancel by the same route as joining; remind
    before every charge.** *Evidence:* subscriptions and cancelling are mentioned in 35% of negatives; the FTC case
    against Hims & Hers; the New York settlement with Keeps' owner; DMCCA subscription rules expected from January 2027
    (`customer-voice.md` 1.5 and 3.1).

---

## Evidence notes and limits

- **Observed vs code vs documents.** "Observed" means replayed live by the research, usually one answer changed at a
  time. "Code" means read in files the site serves to any visitor (and sometimes run offline); it shows what the site is
  built to do, not what a patient finally receives. "Docs" means the company's own pages, help centre or leaflets, or a
  third party where stated.
- **Nothing after any sign-in wall was watched.** No account, payment or photo was ever submitted. Every statement about
  prescribers, refusals, switches, ID checks and follow-up rests on documents or code, and the server can override the
  browser.
- **Voy, Hers (US) and Oxford Online Pharmacy** were not walked live; Voy's engine is from an 11-month-old copy of the
  older Manual app plus its landing pages; Hers (US) and Oxford are from public sources only. **XYON** was not
  independently verified. **Sons and Ro** were in final review when this synthesis began.
- **Question counts** include questions read from code after the wall and repeated forms (Boots' four questionnaires
  share most questions). They compare size, not quality.
- **Customer figures** are keyword screens of Trustpilot samples, mainly the most recent reviews visible to a
  logged-out visitor. Reddit, Mumsnet, MoneySavingExpert and BBB complaint text were blocked, so the UK women's voice is
  thin (`customer-voice.md` 1.4 and 7).
- **The 58 other UK sellers and 57 overseas sellers** in `market/uk-sweep.md` and `market/us-intl-sweep.md` were not used
  here: they were not tested at engine level and were not fact-checked.
- **Clinical points** come from `clinical-men.md` and `clinical-women.md`, which were independently fact-checked. The
  online pathway in `clinical-women.md` Part 4 and the follow-up schedule in `clinical-men.md` 10.3 are their authors'
  syntheses, not published UK guidelines.
