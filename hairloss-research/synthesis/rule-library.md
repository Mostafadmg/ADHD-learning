# Cross-company rule library: hair-loss consultations

Built 24 Nov 2026 from the 19 company digests (`synthesis/digest/sec-rules.md` and the per-company files), the
company data files, and the fact-checked clinical files (`foundations/clinical-men.md`, `clinical-women.md`), with
regulation and patient-voice points from `foundations/uk-regulation.md` and `customer-voice.md`.
Machine-readable copy: `synthesis/rule-library.json` (one object per situation).

## 1. What this file is and how to read it

### What an "engine rule" is

An online consultation is a list of questions. Behind the questions sits software that decides what happens after
each answer. We call that software the **engine**. An **engine rule** is one "if this, then that" line inside it:

> **If** the patient ticks "high blood pressure", **then** hide every minoxidil product.

An engine can do only a few things with an answer:

| What the engine does | What the patient sees | Code used in the tables |
|---|---|---|
| Ends the consultation | A stop screen, or a dead end. No medicine is offered | **STOP** |
| Takes products off the list | Fewer products, usually with no reason given | **−F** (finasteride and dutasteride), **−M** (all minoxidil), **−oM** (oral minoxidil only), **−D** (dutasteride only), or the product named |
| Changes the recommendation only | A different "recommended" product, but the others can still be picked | "from recommendation" |
| Shows a warning | A message or tick box; the offer does not change | **warn** |
| Passes the answer to a clinician | Nothing on screen; a flag or note goes with the order | **clin** |
| Nothing | The answer is stored; nothing changes | **none** |

Four more labels describe gaps in what we could see:

- **not asked**: the questionnaire we could see has no question on this. A clinician may still ask later.
- **after pay**: the company asks its medical questions only after the patient has paid (Keeps).
- **?**: unknown. We could not see this part (usually it sits behind the sign-in wall).
- **n/a**: does not apply (for example a men-only service and a pregnancy question).

Other short words: **5-ARI** means 5-alpha-reductase inhibitor, the drug family of finasteride and dutasteride
(they block the hormone DHT that shrinks hair follicles). **Oral minoxidil** is minoxidil taken as a tablet or
capsule (off-label: licensed in the UK only for severe high blood pressure). **Off-label** means a licensed medicine
used for something its licence does not cover. **Compounded** (a "special") means made up for one patient by a
pharmacy, with no UK licence. **SmPC** is the official product information for a licensed medicine. **PSA** is the
prostate blood test. **Paid consult** means the patient is sent to a paid consultation instead of a plan.

### Evidence labels

Each cell ends with a letter in brackets. It says how we know.

| Label | Meaning | How much to trust it |
|---|---|---|
| **(o) observed** | We changed one answer on the live website and watched the result | Highest |
| **(c) code** | Read from the site's own served code or question definition, not watched happening | High, but a server rule could still override it |
| **(d) docs** | The company's own public documents (leaflets, FAQs, help pages) say so | Medium: says what should happen, not what the engine does |
| **(i) inferred** | Our reasoning from clues (names in code, product leaflets) | Low |

### Read this before relying on a cell

1. **The sign-in wall.** Everything after each company's account or payment wall is described from public
   documents, not observed. Many companies leave all medical decisions to a clinician after payment. So "none" or
   "not asked" in a cell means *the engine before the wall* does nothing. It does **not** prove that the patient
   gets the medicine: a clinician may refuse after payment. Section 4 says where this matters.
2. **Companies we could not walk live:** **Voy**, **Hers (US)** and **Oxford Online Pharmacy** (bot checks blocked
   us). Their cells rest on documents and old code. They are marked **\*** in the table headings.
3. **Not independently verified:** **XYON** was never verified. **Sons** and **Ro** were still in final review
   when this library was built; their stage 2 data is complete. They are marked **†**. Sons product effects come
   from its served recommendation code run offline; Ro's come from its question schema run in a simulator.
4. **Hims UK** shows nothing medical before the email wall. Its medical cells come from leaflets and app code.
5. **Philip Kingsley** cells were checked by running the site's own rule function in the live page, but the result
   screen itself sits after the account wall.
6. Rule ids (R1, R2 …) refer to each company's rule table in `synthesis/digest/<slug>.md`. Run names
   (runs/x2-16 and so on) are folders under `companies/<slug>/runs/`.

## 2. Master matrix

One row per situation. One column per company. Each cell: what the engine does, then the evidence label.
The tables are split in three so they fit on a screen. The same data, with the best-practice rule and its source
for every row, is in `rule-library.json`.

Codes (full list in section 1): **STOP** hard stop · **−F** removes finasteride and dutasteride · **−M** removes all
minoxidil · **−oM** removes oral minoxidil · **−D** removes dutasteride · **warn** warning only · **clin** flagged
for the clinician, offer unchanged · **none** asked, nothing changes · **not asked** · **after pay** ·
**?** unknown · \* not walked live · † not independently verified.

### 2a. UK subscription and specialist brands

| Situation | Hims UK | Voy* | Hair + Me | Sons† | Numan | Philip Kingsley |
|---|---|---|---|---|---|---|
| **A. Who is asking** | | | | | | |
| Under 18 | STOP after sign-up (c) | STOP (d) | STOP (o) | STOP at account form (c) | STOP (can go back) (o) | no under-18 option; ? after wall (c) |
| Over 65 | 66-75 −most range; >75 STOP (i/d) | minoxidil 'not suitable' >65; effect ? (d) | none (oral capsules at 85) (o) | −most or all (2 code copies differ) (c) | must confirm; 'No' = STOP (o) | −oral fin for some pictures only (c) |
| Woman (female at birth) on a men's route | STOP; sent to Hers UK (d) | switched to women's plans (i) | re-routed by sex at birth; no 5-ARI (o/d) | STOP, no signposting (o) | ? sex asked at the wall | separate women's quiz, no 5-ARI (c) |
| Woman pregnant, breastfeeding or trying to conceive | STOP likely (Hers UK) (d/i) | STOP likely; TTC −oM (i/d) | info screen; niacinamide only (o/d) | n/a: men only | n/a: men only | no plan; paid consult (c) |
| Woman who could conceive and uses no contraception | ? | ? | not asked (o) | n/a: men only | n/a: men only | not asked (c) |
| Man whose partner is pregnant (or a pregnant person at home) | clin or −F expected (i) | −F (d) | not asked (o) | not asked (statement only) (o) | not asked (o) | not asked (c) |
| Man trying for a baby | clin or −F expected (i) | −F (d) | not asked; leaflet −F (o/d) | not asked (statement only) (o) | warn; opt-out not enforced (o) | no plan; paid consult (c) |
| **B. Heart and circulation** | | | | | | |
| Heart disease (heart failure, pericarditis, arrhythmia, angina) | clin or −M expected (i) | −oM (d) | none; leaflet −oM (o/d) | −M (topical too) (c) | not asked (free text) (o) | not asked (c) |
| High blood pressure | −Regaine; oral flagged (d/i) | uncontrolled: −oM (d) | extra question; none (o) | −M (5% spray too) (c) | −M (o) | bug: minoxidil kept (c) |
| Low blood pressure or fainting | clin expected (i) | −oM (d) | none (o) | not asked (o) | −M (o) | bug: minoxidil kept (c) |
| Takes blood-pressure medicines | clin expected (i) | ? | not asked (free text) (o) | not asked (o) | −M (via BP answer) (o) | free text, no rule reads it (c) |
| Phaeochromocytoma (adrenal tumour) | −oral chews (d) | ? | none; leaflet −oM (o/d) | −oM (c) | not asked (free text) (o) | not asked (c) |
| **C. Other organs and cancers** | | | | | | |
| Kidney disease | ? | ? | not asked (o) | severe: −F only; oral minoxidil kept (c) | free text → clin (c) | not asked (c) |
| Liver disease | −finasteride spray (d) | ? | none; leaflet −oM, −dutasteride (o/d) | severe: −F (c) | free text → clin (c) | not asked (c) |
| Prostate cancer history, or PSA monitoring | −finasteride spray (d) | −F (d) | none; leaflet −F (o/d) | −F (c) | PSA: warn; opt-out not enforced (o) | no plan; paid consult (c) |
| Male breast cancer history, breast lump or gynaecomastia | −finasteride spray (d) | −F (d) | none; leaflet −F (o/d) | −F (c) | not asked (o) | no plan; paid consult (c) |
| **D. Mood and sexual function** | | | | | | |
| Depression or anxiety (history or now) | ? | warn or clin likely (d/i) | none (o) | low score none; high score −F (c) | extra questions + clin; specialist-led −F (o) | warn, then paid consult (minoxidil blocked too) (o/c) |
| Suicidal thoughts or self-harm (now or recent) | ? | −F (d) | not asked (o) | −F silently; no signposting (o/c) | −F; no signposting (o) | no plan; paid consult (c) |
| Sexual problems now (libido, erections, ejaculation) | ? | ? | none; leaflet −oral 5-ARI (o/d) | −F (c) | not asked (o) | not asked (c) |
| **E. Type of hair loss and scalp** | | | | | | |
| Patchy bald patches | quiz: none; STOP likely later (o/i) | STOP (shown after email) (c) | none (o) | none (o/c) | STOP (o) | men −named plans; women paid consult (c) |
| Sudden or rapid shedding | quiz: none; STOP likely later (o/i) | ? | none (o) | −F, −oM; minoxidil spray kept (c) | STOP (o) | paid consult (women: gap for wider parting) (c) |
| Complete baldness, scars or shiny skin | quiz: none; STOP likely later (o/i) | STOP (c/d) | none (extensive loss) (o) | none (c) | STOP (o) | −named plans (extensive) (c) |
| Scalp pain, redness, infection, psoriasis or eczema | −topicals; 'see your GP' (d/i) | −topical minoxidil (i) | none; leaflet −drops (o/d) | −topical minoxidil; capsules first (c) | pain/redness −M; psoriasis clin only (o) | pain or crusting: paid consult; mild itch: scalp plans (c) |
| **F. Allergies and medicines** | | | | | | |
| Allergy to minoxidil | −M (d) | −product; women: active removed (d) | none; leaflet −minoxidil (o/d) | not asked (o) | −M (product links bypass it) (o) | −minoxidil plans (c) |
| Allergy to finasteride | −F (d) | −product (d) | none; leaflet −F (o/d) | not asked (o) | −F (o) | −finasteride plans (c) |
| Propylene glycol or alcohol (ethanol) sensitivity | −Regaine (d) | ? | not asked (o) | not asked (o) | not asked (o) | free text, no rule reads it (c) |
| Already taking dutasteride or finasteride 5 mg | −finasteride products (d) | −F (d) | must agree to stop it; leaflet −F (o/d) | not asked (o) | not asked (free text) (o) | free text, no rule reads it (c) |
| Lactose or galactose intolerance | −tablets (old platform tag) (i) | −finasteride tablets (d) | not asked (o) | −oral finasteride, −oM (c) | clin note; tablets kept (o) | not asked (c) |
| **G. Household and lifestyle** | | | | | | |
| Pets at home (cats especially) | ? | ? | warn + nudge to capsules (o) | not asked (o) | not asked (o) | not asked (c) |
| Babies or young children who touch the scalp or pillow | ? | ? | not asked (o) | not asked (o) | not asked (o) | not asked (c) |
| Smoking or drinking alcohol | ? | ? | not asked (o) | not asked (o) | not asked (o) | not asked (c) |
| BMI or weight | ? | ? | not asked (weight-loss statement only) (o) | not asked (o) | not asked (o) | not asked (c) |
| **H. Treatment history** | | | | | | |
| Side effects on finasteride before | ? | clinician may switch to topical (d) | not asked (tick-list only) (o) | −F (c) | not asked (o) | not asked (c) |
| Side effects on minoxidil before | ? | ? | not asked (o) | −M (spray and capsule) (c) | not asked (o) | not asked (c) |
| No family history of hair loss | none (o) | ? | not asked (o) | not asked (o) | not asked (o) | none (c) |

### 2b. UK pharmacies and online doctors

| Situation | Treated | Dr Fox | Boots | Superdrug | Lloyds | Oxford OP* |
|---|---|---|---|---|---|---|
| **A. Who is asking** | | | | | | |
| Under 18 | ? age limit 18, asked at checkout (c) | declares 18+; DOB after wall (d) | STOP (o) | ? DOB after wall | STOP (o) | STOP for finasteride (d) |
| Over 65 | clin? (limit 49 for fin, Regaine) (c) | supplied off-label (d) | none; bundle 50+ off-label warn (o) | ? DOB after wall | −oM (o) | ? |
| Woman (female at birth) on a men's route | STOP (o) | STOP at registration (c) | STOP (o) | separate women's route (o) | STOP (o) | no 5-ARI or oral minoxidil (d) |
| Woman pregnant, breastfeeding or trying to conceive | n/a: men only | n/a: men only | n/a: men only | none: Regaine stays (o) | n/a: men only | ? |
| Woman who could conceive and uses no contraception | n/a: men only | n/a: men only | n/a: men only | not asked (o) | n/a: men only | ? |
| Man whose partner is pregnant (or a pregnant person at home) | not asked (o) | awareness tick only (o) | warn: use condoms (c) | consent text only (o) | none (card note) (o) | warn (d) |
| Man trying for a baby | not asked (o) | not asked (o) | clin ('Danger' flag) (o) | consent text only (o) | −F (o) | warn (12 weeks) (d) |
| **B. Heart and circulation** | | | | | | |
| Heart disease (heart failure, pericarditis, arrhythmia, angina) | clin; Regaine kept (o) | warn only; minoxidil kept (o) | not asked (c) | women −Regaine; men n/a (o) | −M (o) | −oM (i) |
| High blood pressure | clin; Regaine kept (o) | warn only; minoxidil kept (o) | bundle: clin ('Danger') (c) | women −Regaine (o) | −M (o) | oral: agree BP checks (d) |
| Low blood pressure or fainting | none (auto-offer with Regaine) (o) | −M (o) | not asked (c) | not asked (o) | −M (o) | −oM (i) |
| Takes blood-pressure medicines | clin (any medicine) (o) | not asked (BP warn only) (o) | bundle: switch request + clin (o) | women −Regaine (o) | −M (o) | ? |
| Phaeochromocytoma (adrenal tumour) | clin; Regaine kept (o) | not asked (o) | not asked (c) | not asked (o) | −oM (o) | ? |
| **C. Other organs and cancers** | | | | | | |
| Kidney disease | clin (o) | not asked (o) | clin (amber) (c) | not asked (free text) (o) | eGFR<30 STOP; else −oM (o) | ? |
| Liver disease | clin (o) | −F (o) | clin (amber) (c) | details box; none (o) | follow-up; severe = STOP (o) | ? |
| Prostate cancer history, or PSA monitoring | clin (o) | −F (o) | clin (amber); PSA notice (c) | none (o) | −F (o) | ? |
| Male breast cancer history, breast lump or gynaecomastia | clin (o) | −F (gynaecomastia) (o) | clin (amber) (c) | none (o) | −F (o) | ? |
| **D. Mood and sexual function** | | | | | | |
| Depression or anxiety (history or now) | STOP whole consultation (o) | −F (o) | warn + acknowledge (c) | not asked (consent text) (o) | warn + opt-out; extra questions (o) | asked; effect ? (d) |
| Suicidal thoughts or self-harm (now or recent) | STOP (o) | −F (o) | crisis signposting + 'Danger' flag (o) | not asked (o) | crisis signposting; continues (o) | ? |
| Sexual problems now (libido, erections, ejaculation) | not asked (o) | not asked (only past side effects) (o) | warn + acknowledge (c) | warn (o) | −F (ED tablets: −F, −oM) (o) | ? |
| **E. Type of hair loss and scalp** | | | | | | |
| Patchy bald patches | clin (o) | STOP (o) | clin ('Danger') (o) | men photos required; women −Regaine (o) | STOP (o) | ? |
| Sudden or rapid shedding | clin (o) | STOP (days or weeks) (o) | warn (c) | men free text; women −Regaine (o) | STOP (o) | ? |
| Complete baldness, scars or shiny skin | scars: clin (o) | STOP (total alopecia) (o) | clin ('Danger') (o) | extensive: warn + photos (o) | STOP (o) | ? |
| Scalp pain, redness, infection, psoriasis or eczema | itchy scalp: clin (o) | STOP (o) | clin ('Danger') (o/c) | men warn (see GP); women −Regaine (o) | −topical minoxidil + 'see GP' (o) | ? |
| **F. Allergies and medicines** | | | | | | |
| Allergy to minoxidil | clin (any allergy) (o) | not asked (o/d) | clin ('other medicines') (c) | women −Regaine; men n/a (o) | −M (o) | ? |
| Allergy to finasteride | clin (any allergy) (o) | −F (o) | clin ('other medicines') (c) | none (o) | −F (o) | ? |
| Propylene glycol or alcohol (ethanol) sensitivity | clin (any allergy) (o) | not asked (o) | clin ('something else') (c) | women −Regaine (o) | not asked (o) | ? |
| Already taking dutasteride or finasteride 5 mg | clin (o) | −F (o) | PSA notice only (c) | free text; none (o) | −F (o) | dutasteride + finasteride refused (d) |
| Lactose or galactose intolerance | clin (any allergy) (o) | not asked (o) | clin ('Danger') (o) | follow-up question; none (o) | ? | ? |
| **G. Household and lifestyle** | | | | | | |
| Pets at home (cats especially) | not asked (o) | not asked (o) | not asked (c) | not asked (o) | warn (tick to confirm) (o) | ? |
| Babies or young children who touch the scalp or pillow | not asked (o) | not asked (o) | not asked (c) | not asked (o) | not asked (o) | ? |
| Smoking or drinking alcohol | −D in the automatic offer only (o) | not asked (o) | recreational drugs: clin (c) | not asked (o) | not asked (o) | ? |
| BMI or weight | BMI > 35: clin (o) | not asked (o) | not asked (c) | not asked (o) | not asked (o) | ? |
| **H. Treatment history** | | | | | | |
| Side effects on finasteride before | asked, not acted on (o) | sexual side effects: −F (o) | current users: clin (amber) (c) | free text; none (o) | −F unless he opts back in (o) | ? |
| Side effects on minoxidil before | asked, not acted on (o) | not asked (o) | not asked (c) | not asked (o) | text box; effect not recorded (o) | ? |
| No family history of hair loss | not asked (o) | not asked (o) | not asked (c) | not asked (o) | not asked (o) | ? |

### 2c. US companies (for comparison)

| Situation | Hims US | Hers US* | Keeps | Ro† | Happy Head | Strut | XYON† |
|---|---|---|---|---|---|---|---|
| **A. Who is asking** | | | | | | | |
| Under 18 | STOP after wall (d/c) | −oM; in-person care (d) | STOP (18+ tick box) (o) | STOP (c) | STOP (o) | STOP (o) | STOP (c) |
| Over 65 | ? (max age 120 in settings) (c) | ? | after pay (o) | men none; women 66+ −oM (c) | none (70 tested) (o) | none (61+) (o) | none (no upper limit) (c) |
| Woman (female at birth) on a men's route | sent to Hers; no finasteride (d) | n/a: women only | STOP (assigned-male tick) (o) | sent to women's visit (c) | women's set; 50+ get dutasteride (o) | mixed by form (see note) (o/c) | some products men-only (c) |
| Woman pregnant, breastfeeding or trying to conceive | no finasteride (d) | −oM, −F, −spiro (d) | n/a: men only | pregnant STOP; breastfeeding −oM, topical kept (c) | clin 'critical'; nothing removed (c/o) | not asked (c/o) | STOP (o) |
| Woman who could conceive and uses no contraception | n/a | not reported by reviewers (i) | n/a: men only | ? | clin; spironolactone + oral minoxidil kept (o) | not asked (c) | ? |
| Man whose partner is pregnant (or a pregnant person at home) | handling warning or clin (d) | n/a | after pay (o) | not asked (c) | clin; 'do not accept' keeps dutasteride (o) | ? | ? |
| Man trying for a baby | ? | n/a | after pay (o) | −F from recommendation + caution (c) | clin 'critical' (c) | ? | ? |
| **B. Heart and circulation** | | | | | | | |
| Heart disease (heart failure, pericarditis, arrhythmia, angina) | −combo pill (d) | clin (d) | after pay (o) | −oM from recommendation (some conditions) (c) | clin; oral kept (o) | none (o) | ? |
| High blood pressure | ? | clin (d) | after pay (o) | only 'very high': −oM from recommendation (c) | not flagged (c) | none (o) | ? |
| Low blood pressure or fainting | ? | clin (d) | after pay (o) | no recommendation; all pickable (c) | clin 'critical'; oral kept (o) | none (o) | ? |
| Takes blood-pressure medicines | ? | clin (d) | after pay (o) | none (medicines not flagged) (c) | not flagged (c) | free text; none (o) | ? |
| Phaeochromocytoma (adrenal tumour) | −combo pill (d) | −oM (d) | after pay (o) | −oM (c) | clin (c) | none (o) | ? |
| **C. Other organs and cancers** | | | | | | | |
| Kidney disease | CKD 3-5: −combo pill (d) | clin (d) | after pay (o) | men none (any stage); women free text (c) | clin (c) | none (o) | ? |
| Liver disease | −spray, −combo pill (d) | clin (d) | after pay (o) | none (even cirrhosis) (c) | clin (c) | none (o) | ? |
| Prostate cancer history, or PSA monitoring | −spray, −combo pill (d) | n/a | after pay (o) | −spray only; tablets kept (c) | clin (c) | none (o) | ? |
| Male breast cancer history, breast lump or gynaecomastia | −spray (d) | ? | after pay (o) | not asked (c) | clin (c) | none (o) | ? |
| **D. Mood and sexual function** | | | | | | | |
| Depression or anxiety (history or now) | ? | ? | after pay (o) | −F from recommendation (c) | clin (c) | none (generic warning) (o) | ? |
| Suicidal thoughts or self-harm (now or recent) | ? | ? | after pay (o) | ? | clin (mental health) (c) | STOP + crisis lines (o) | ? |
| Sexual problems now (libido, erections, ejaculation) | ? | n/a | after pay (o) | −F from recommendation (c) | clin (c) | none (o) | ? |
| **E. Type of hair loss and scalp** | | | | | | | |
| Patchy bald patches | quiz: none; 'seek medical attention' (o/d) | −oM reported (d) | legacy → clinician request; main quiz none (o) | men: no recommendation; women: symptom clin (c) | clin (c) | none (o) | ? |
| Sudden or rapid shedding | clin expected (d) | −oM reported (d) | none (o) | men: no recommendation; women: clin (c) | none (o) | none (o) | ? |
| Complete baldness, scars or shiny skin | ? | ? | 'Mostly scalp' STOP (o) | women: named scarring diagnosis STOP (c) | ? | ? | ? |
| Scalp pain, redness, infection, psoriasis or eczema | ? | ? | dandruff: + ketoconazole (o) | men: redness no recommendation, pain none; women: diagnosis STOP (c) | free text; clin (o) | none (o) | ? |
| **F. Allergies and medicines** | | | | | | | |
| Allergy to minoxidil | ? | −oM (d) | after pay (o) | men −from recommendation; women STOP (c) | not flagged (c) | none (o) | ? |
| Allergy to finasteride | ? | ? | after pay (o) | −F from recommendation (c) | not flagged; dutasteride kept (o/c) | none (no branch) (c) | ? |
| Propylene glycol or alcohol (ethanol) sensitivity | ? | ? | after pay (o) | ? | not flagged (c) | none (no branch) (c) | ? |
| Already taking dutasteride or finasteride 5 mg | −spray, −combo pill (d) | n/a | after pay (o) | ? | not flagged (c) | free text (o) | ? |
| Lactose or galactose intolerance | ? | ? | after pay (o) | ? | not flagged (c) | ? | ? |
| **G. Household and lifestyle** | | | | | | | |
| Pets at home (cats especially) | ? | ? | after pay (o) | not asked (c) | not asked (c) | not asked (c) | ? |
| Babies or young children who touch the scalp or pillow | ? | ? | after pay (o) | ? | household pregnancy only (o) | ? | ? |
| Smoking or drinking alcohol | ? | ? | after pay (o) | ? | not asked (c) | not asked (c) | ? |
| BMI or weight | ? | ? | after pay (o) | not asked (c) | asked for capsules; not flagged (o/c) | not asked (c) | ? |
| **H. Treatment history** | | | | | | | |
| Side effects on finasteride before | ? | n/a | asked; no follow-up (o) | −F from recommendation (c) | clin 'critical'; dutasteride kept (o) | none (o) | ? |
| Side effects on minoxidil before | ? | ? | asked; no follow-up (o) | oral: −oM from recommendation (c) | clin 'critical' (c) | none (o) | ? |
| No family history of hair loss | none (o) | ? | none (legacy quiz) (o) | men not asked; women none (o/c) | none (o) | ? | ? |

### Notes on the tables

- **Hair + Me** cells say "none; leaflet −X". The live questionnaire did nothing visible for any medical answer
  except age (observed). Its own product leaflets say the prescriber must exclude the product (docs). Both are true:
  the engine is silent, the prescriber is meant to act after payment (rules R9, R16, R17, R19 and R28 to R33).
- **Boots** "clin ('Danger')" means: the website lets the patient carry on to the ID photo step, but the server
  labels the order "Danger" (red answer) or "Warning" / "Query" (amber) for the clinician (rules R6 and R15).
- **Ro** "from recommendation" means the product loses its "recommended" badge but can still be picked and sent
  to a clinician (rules R5, R8 and R14).
- **Treated** "clin" means the order switches from automatic offer to clinician review (rules R3 to R16). The
  products and prices on screen do not change.
- **Philip Kingsley** "paid consult" means no plan is offered; after the account wall the patient is shown a paid
  trichologist consultation (virtual from £200, clinic from £345; rule R1).
- **Strut** woman row: the oral finasteride form stops women; the topical finasteride form swaps in a women's
  topical finasteride with no pregnancy question; the oral minoxidil form never asks sex (rules R15, R16, R26).
- **Keeps** asks its medical questions only after payment, and we did not see them. "after pay" is not a gap in
  itself; the gap is that payment comes first.
- **Hims UK** and **Hims US**: the anonymous quizzes ask none of these medical questions; every medical cell is
  from leaflets, help pages or code read after the wall.

## 3. Where companies disagree

These are the situations where two companies given the same answer do very different things. For each one: who
does what, what the clinical files support, and the plain reason.

### 3.1 Depression and mental health: from "stop everything" to "nothing happens"

| Approach | Companies |
|---|---|
| Stop the whole consultation, minoxidil included | Treated (R2, observed) |
| Block every plan and send to a paid consultation | Philip Kingsley (R1, R18, code checked live) |
| Remove finasteride silently | Dr Fox (R6), Numan for specialist-managed or suicidal cases (R13, R14), Sons on high mood scores (R15, code), Voy (R10, docs) |
| Warn, let the patient opt out, ask more | Lloyds (R18, R19), Boots (warning plus clinician flag), Numan for GP-managed cases (R16) |
| Flag for a clinician, offer unchanged | Happy Head (R9), Ro (finasteride loses the recommendation, R9) |
| Nothing, or no question at all | Hair + Me (R17, R19), Superdrug (no mood question, R9), Strut (R11) |

**What the evidence supports.** The MHRA (April 2024 and May 2026) tells prescribers to *ask* about depression and
suicidal thoughts before finasteride, decide *with the patient* whether to prescribe, tell men to stop at once if
mood falls, and review regularly. It does not say a history of depression bars finasteride, and it says nothing
against minoxidil (clinical-men 10.1 and 10.2). So:

- **Lloyds and Numan (GP-managed branch) are closest to the evidence:** ask, warn, offer a minoxidil-only choice,
  and pass the detail to the clinician.
- **Treated and Philip Kingsley over-block.** Minoxidil has no mood warning, yet both block it for a mood history.
- **Hair + Me, Superdrug and Strut under-screen.** Superdrug's men's form has no mood question at all, only consent
  text, although the MHRA asks prescribers to ask.
- **Current suicidal thoughts are different.** They need crisis help on the screen, not a quiet product change
  (clinical-women 4.1 Q11). Lloyds, Boots and Strut show crisis help; Numan and Sons do not (section 4).

### 3.2 A man whose partner is pregnant, or who is trying for a baby

| Approach | Companies |
|---|---|
| Remove finasteride for both | Voy (R8, docs) |
| Remove finasteride for trying; nothing for partner pregnant | Lloyds (R13, R14) |
| Condom advice for partner pregnant; red flag for trying | Boots (definitions; R6) |
| Warning with an opt-out that is not enforced | Numan (R11) |
| Flag only; dutasteride kept even if he refuses the risk | Happy Head (R11) |
| Consent text only, or not asked | Superdrug, Sons, Hair + Me, Treated, Dr Fox |

**What the evidence supports.** For finasteride tablets the SmPC judges the amount in semen (under 0.001% of the
dose) unlikely to harm a male fetus; the real hazard is a pregnant woman handling crushed or broken tablets. The
sperm-count fall was measured with the 5 mg dose, not 1 mg. Dutasteride is different: a half-life of 3 to 5 weeks,
sperm count still 23% down 24 weeks after stopping, and a condom is advised if the partner is or may be pregnant.
Topical finasteride or dutasteride can pass to others through skin (clinical-men 2.1, 2.3, 10.2). So:

- **Partner pregnant, tablets:** Lloyds (no change plus a handling note) and Boots (condom advice) fit the SmPC.
  Removing finasteride (Voy) is stricter than the evidence needs.
- **Partner pregnant, topical 5-ARI or dutasteride:** this is where removal or strong counselling is justified.
  Happy Head keeps topical dutasteride even when the man says he does not accept the risk.
- **Trying for a baby:** a clinician discussion is right. Avoiding dutasteride is well supported; for finasteride
  1 mg the fertility data are weak (5 mg trial), so a shared decision is fairer than a silent removal.

### 3.3 Blood pressure and *topical* minoxidil

| Approach | Companies |
|---|---|
| Any blood-pressure condition (high or low) removes all minoxidil, topical too | Lloyds (R7), Numan (R10), Sons (high only, R20, code) |
| Low-BP symptoms remove all minoxidil; high BP only a message | Dr Fox (R8, R10) |
| High BP: flag only, Regaine stays | Treated (R9), Boots bundle (flag) |
| High BP: nothing | Hair + Me (R9), Happy Head (not flagged), Strut (R12) |
| Meant to remove minoxidil, but a typo stops it | Philip Kingsley (R9) |

**What the evidence supports.** The licensed Regaine 5% solution SmPC lists *treated or untreated* high blood
pressure as a contraindication. A prescriber may judge otherwise but should record why (clinical-men 3.1, 10.2;
clinical-women 4.1 Q22). Low blood pressure is a precaution for *oral* minoxidil (below 90/60), not a listed
contraindication for topical. So:

- **High BP:** removing topical minoxidil, or sending to a clinician who records a reason, matches the SmPC.
  "Message only" (Dr Fox) or "nothing" (Hair + Me) does not, unless a prescriber acts later.
- **Low BP:** removing topical minoxidil (Numan, Lloyds, Dr Fox) is stricter than the product information. It
  costs the patient a licensed option. Removing *oral* minoxidil is right.

### 3.4 Patchy, sudden or complete loss

| Approach | Companies |
|---|---|
| Stop with a GP message | Numan (R2, R3), Lloyds (R4), Dr Fox (R3), Voy pop-up (R1) |
| Flag for the clinician, carry on | Boots (R6), Treated (R6), Happy Head (R9) |
| No recommendation, but every product can still be picked | Ro men (R8) |
| Removes some products, keeps others | Sons sudden onset keeps the minoxidil spray (R13); Philip Kingsley (R5) |
| Nothing | Hair + Me (R15), Sons patchy and complete (R27), Strut (R10), Hims UK and Hims US anonymous quizzes |

**What the evidence supports.** Remote treatment suits only gradual pattern loss. Sudden, patchy or diffuse loss
and an abnormal scalp are not suitable; the minoxidil product information excludes sudden or patchy loss
(clinical-men 10.2). For women, patches, hairline or eyebrow loss and scarring signs are stop-and-refer red flags
(clinical-women 1.11). **The stop-and-signpost companies are right.** For women, sudden shedding after a trigger is
usually telogen effluvium, which needs explanation and sometimes blood tests, not a hair medicine (clinical-women
1.3, 4.3).

### 3.5 Age over 65

| Approach | Companies |
|---|---|
| No limit, no warning (oral minoxidil included) | Hair + Me at 85 (R5), Happy Head at 70 (R19), Strut 61+ (R2), Ro men at 70 (R16), XYON |
| Supplied off-label after a blanket consent | Dr Fox (R19) |
| Must confirm they understand; otherwise stop | Numan (R3) |
| Removes oral minoxidil only | Lloyds (R3); Ro women 66+ (R27) |
| Removes most or all of the range | Sons (R29, code, two copies disagree); Hims UK 66 to 75 (inferred) and stop over 75 (docs) |

**What the evidence supports.** The licences set upper ages: men's 5% solution 18 to 65, men's foam 18 to 49,
women's products 18 to 65 (clinical-men 3.1; clinical-women 3.0). The oral minoxidil SmPC has few data over 65 and
warns of dizziness on standing; the women's file asks each service to set and write down its own limit
(clinical-women 3.2). So **Lloyds' approach (remove oral minoxidil, keep the rest for a clinician to decide) is the
best fit**; "no limit and no warning" for oral minoxidil is the weakest.

### 3.6 Women and 5-ARIs (finasteride, dutasteride)

| Approach | Companies |
|---|---|
| Never online for women | Hair + Me (R28), Philip Kingsley (R15), Oxford (R9), Superdrug, Voy |
| Post-menopausal women only, topical, "for those who qualify" | Hers US (R2) |
| Women's topical finasteride with no pregnancy question | Strut (R16) |
| Women aged 50 or over get dutasteride capsule and topical by default | Happy Head (R3), even if she says she can become pregnant (R20) |
| Dutasteride gel tagged for both sexes | XYON (R5) |

**What the evidence supports.** In the UK finasteride and dutasteride are contraindicated in women; the only good
trial of finasteride 1 mg (post-menopausal women) was negative; a pregnancy exposure can harm a male fetus. The
women's file advises not offering them in a first online service; if ever added, only for women who cannot become
pregnant, with a specialist's recommendation (clinical-women 3.4). **The UK companies' approach is right; Happy
Head's and Strut's are the furthest from the evidence.**

### 3.7 Minoxidil allergy and propylene glycol

Lloyds (R9), Numan (R6) and Philip Kingsley (R7) remove all minoxidil for a stated allergy; Hair + Me (R19) and
Strut (R9) do nothing; Dr Fox does not ask (R25). Only Superdrug's women's route asks about propylene glycol and
ethanol separately (R14).

**What the evidence supports.** Most "minoxidil allergy" from the solution is really propylene glycol allergy; the
licensed foam has none (clinical-men 3.1, key fact 12). So the best rule asks *what* reacted: a true minoxidil
allergy removes all minoxidil; a solution reaction moves the patient to the foam. No company does this well; a
blanket removal loses a licensed option, and doing nothing is unsafe.

### 3.8 Kidney disease

Lloyds asks for the eGFR (a kidney blood-test number): under 30 stops, any other answer removes oral minoxidil
(R10, R11). Sons removes finasteride but keeps oral minoxidil (R21, code). Ro ignores kidney disease of any stage
(R15, code). Treated, Boots and Happy Head flag it.

**What the evidence supports.** Kidney impairment and dialysis are consensus precautions for *oral minoxidil*
(clinical-men 3.2), and significant kidney impairment rules out spironolactone (clinical-women 3.3). **Lloyds fits
best; Sons has the drugs the wrong way round.**

### 3.9 Smoking, alcohol and BMI

Only Treated acts on these: smokers and any drinkers lose dutasteride in the automatic offer (R17, R18) and BMI
over 35 sends the case to a clinician (R14). Nobody else asks.

**What the evidence supports.** The clinical files give no reason to block a hair-loss medicine for smoking,
alcohol or BMI. The only relevant points are counselling (solution and foam are flammable: do not apply while
smoking, clinical-women 3.1), weight as a baseline for oral minoxidil (rapid weight gain is a stop sign,
clinical-men 11), and weight-loss injections as a cause of shedding in women (clinical-women 3.13).

### 3.10 Pets

Only Lloyds (warning tick, R27) and Hair + Me (warning plus a nudge to capsules, R12) ask. Cats can be poisoned by
topical minoxidil (Cats Protection, May 2026; a US study found 8 of 62 poisoned cats died; customer-voice.md). A
question and clear handling advice are the right response; blocking is not needed. Patients notice: one Hair + Me
reviewer asked for tablets because of a cat and was sent liquid (customer-voice.md).

## 4. Safety gaps found

A **gap** here means one of two things:

- **Let through:** the engine lets an answer pass that the clinical files say should stop the sale, send the
  patient elsewhere, or at least warn.
- **Over-blocked:** the engine blocks something the clinical files say need not be blocked, so the patient loses a
  safe option.

Fairness rule used throughout: almost every company says a clinician reviews the order after sign-in or payment.
That review may catch what the engine misses. So each gap says whether a later check could catch it. Even when it
can, the patient has usually given ID, an account and card details first, and may be refused days later; and a
missing *question* cannot be caught by a reviewer who never sees the answer.

Ranked by harm, highest first.

### 4.1 Let through: the most serious

| # | Company | What happens | Evidence | What the clinical files say | Could a later check catch it? |
|---|---|---|---|---|---|
| 1 | **Numan** | A man who says he had **suicidal thoughts or self-harm in the past year** gets no stop and no crisis help; finasteride is hidden and minoxidil is offered. If he says his mental-health medicine dose changed in the last 3 months, the suicidal-thoughts question is **skipped** | Observed: R14 (runs/x2-16), R15 (runs/x2-17) | Self-harm thoughts need urgent help (clinical-women 4.1 Q11); MHRA: ask about suicidal thoughts before finasteride (clinical-men 10.1) | Partly. A clinician sees the answers after checkout, but the crisis message should come at the moment of disclosure. The skipped question cannot be caught: it was never asked |
| 2 | **Sons** † | "Nearly every day" on the hopelessness question passes with **no message**; finasteride is removed later, silently. Open scalp sores pass with no message | Observed (R7, R9); product effect from code (R15) | As above; scalp red flags mean refer (clinical-women 1.11) | Partly: the partner pharmacy's prescriber reviews after the order (R36, docs) |
| 3 | **Strut** (US) | The **women's topical finasteride** route has **no pregnancy, breastfeeding or contraception question**. The oral minoxidil form never asks sex or pregnancy: a woman gets the same 2.5 mg cart as a man | Code (R16); observed (R26, runs/verify-v-woman-baseline-min) | Finasteride contraindicated in women; oral minoxidil contraindicated in pregnancy and breastfeeding (clinical-women 3.2, 3.4, 3.12) | Only if the provider asks after checkout (R22, docs). The form gives them nothing to act on |
| 4 | **Happy Head** (US) | A woman aged 50 or over who says she **can become pregnant** is still offered dutasteride capsule and topical. A woman under 50 with **no contraception** keeps the spironolactone + minoxidil capsule. A man who refuses the partner-pregnancy risk keeps dutasteride | Observed: R20, R23 (runs/verify-w-bc-none), R11 | Anti-androgens can feminise a male fetus; effective contraception required (clinical-women key fact 23; 3.3, 3.4) | Yes in principle: these answers are flagged "critical" or "important" for the dermatologist (R9, code). The engine does not change the plan |
| 5 | **Superdrug** | **Women:** pregnant or breastfeeding, Regaine for Women stays on the list with no warning. **Men:** no question at all on mood or depression (consent text only); a **finasteride allergy**, prostate cancer or breast cancer changes nothing | Observed: R17 (runs/exp-w01, w02, w21), R9, R10 | Topical minoxidil "should not be used during pregnancy or lactation" (clinical-women 3.1); MHRA: ask about depression (clinical-men 10.1) | The doctor reviews after payment (docs). The allergy and cancer answers are visible to the doctor; the missing mood question is not |
| 6 | **Philip Kingsley** | A man who ticks **"uncontrolled low or high blood pressure"** is still offered minoxidil 5% and the combination plans. A leading space in the rule's text means it never matches. Two more typos: the 3% plan can never be offered, and a woman with sudden loss and a "wider parting" picture still gets the main product | Code checked live in the page: R9 (runs/m25), R10, R12 (w09) | Topical minoxidil contraindicated in high blood pressure (clinical-men 3.1) | Unknown: what happens after the account wall was not seen. The bug itself is certain |
| 7 | **Hair + Me** | No medical answer changes anything on screen: heart disease, phaeochromocytoma, often-high or often-low blood pressure, active scalp infection, minoxidil allergy, depression, patchy or sudden loss, pregnancy (info screen only). A man of 85 can choose oral minoxidil capsules with no warning | Observed: R9, R10, R15 to R19 (for example runs/s2-m-mcm-heart, s2-m-mcm-pheo, s2-m-htam-patches), R5 (runs/s2-m-age-85) | Phaeochromocytoma and heart failure: never oral minoxidil; patchy or sudden: refer (clinical-men 3.2, 10.2) | **Yes, by design.** Every case is read by a pharmacist prescriber who chooses the formula inside the leaflet limits, and refunds if ineligible (R36, R38, docs). The gap is that the patient learns nothing until after paying |
| 8 | **Numan** | **Product links bypass the safety filter.** Arriving from a product page, the named product stays featured even with an allergy to its drug, or when a scalp answer has ruled its drug out (Regaine offered to a man with scalp pain and a finasteride allergy). Opt-outs for PSA monitoring and trying for a baby are **not enforced**. Scalp psoriasis or eczema does not hide minoxidil, although Numan's own clinician note says it is unsuitable | Observed: R18, R24 (runs/x2-20, x2-21, verify-08, verify-21), R11 (x2-09, x2-11, x2-12), R8 (x2-08) | Minoxidil allergy and an abnormal scalp are SmPC contraindications (clinical-men 3.1) | Yes, probably: a clinician reviews after checkout (R23, code). But the patient has been shown, priced and sold a product they cannot safely use |
| 9 | **Dr Fox** | **High blood pressure or heart disease:** a message only; every minoxidil product, including Regaine solution, is still sold. **No question on minoxidil allergy.** Two consultations in one session put the spray (which contains minoxidil 5% and finasteride) and finasteride tablets in one basket, even when the second form reports low blood-pressure symptoms | Observed: R10, R23, R24 (runs/verify-gap-two-consults, verify-gap-two-consults-conflict); docs R25 | Regaine SmPC: high blood pressure is a contraindication (clinical-men 3.1); do not double 5-ARIs (clinical-men 2.1) | Yes, likely: a doctor approves every order before despatch (R22, docs). The basket conflict breaks Dr Fox's own published rule |
| 10 | **Sons** † | **Severe kidney or liver disease** removes finasteride but **keeps oral minoxidil**. **Sudden onset** keeps the minoxidil spray. "Random patches" and "Completely bald" change nothing. Earlier stop screens for extensive and sudden loss have been removed from the current form | Code: R21, R13, R27, R37 | Kidney impairment is a precaution for oral minoxidil (clinical-men 3.2); patchy, sudden or complete loss: not for remote treatment (clinical-men 10.2) | Partly: the prescriber reviews after the order (R36, docs) |
| 11 | **Ro** † (US) | **Kidney disease of any stage (including stage 5), liver failure or cirrhosis** raise no flag: the spray stays recommended and oral minoxidil can be picked. **Prostate cancer** flags the spray but not finasteride tablets. A **breastfeeding** woman is still offered the topical minoxidil product | Code (schema simulation): R15, R10, R27 | Kidney impairment: oral minoxidil precaution (clinical-men 3.2); UK SmPC: topical minoxidil not in lactation (clinical-women 3.12; LactMed is more relaxed) | Yes, probably: a US clinician reviews every visit (R18, code). Not verified independently |
| 12 | **Treated** | **Low blood pressure** gives the automatic offer with Regaine, no review. **Heart disease** or an **adrenal tumour** keeps Regaine on the list (the case does go to review) | Observed: R10, R12 | Oral minoxidil precaution below 90/60; topical minoxidil: medical advice first with heart disease (clinical-men 10.2; clinical-women 3.1) | Low BP: no, the offer is automatic ("no approval required" in the server reply, R3). Heart disease: yes, a clinician reviews |
| 13 | **Boots** | Every red-flag answer (suicidal thoughts, circular patches, complete baldness, painful or pus-filled scalp, partner trying to conceive, galactose intolerance) lets the patient carry on to ID photos, account and payment. Taking dutasteride or finasteride 5 mg for the prostate brings only a PSA notice. No heart, low blood pressure or minoxidil-allergy question on the Regaine bundle | Observed: R6, R15 (runs/x08-all-red-flags, verify-r-galactose); code for the prostate and bundle questions | Double 5-ARI not allowed (clinical-men 2.1); patchy or complete loss: refer (10.2) | **Yes, by design:** the server labels the order "Danger" or "Warning" for the clinician (R15). The gap is timing and patient experience, not missing information. Boots does show crisis help for suicidal thoughts |
| 14 | **Strut** (US) | In the oral minoxidil form, **minoxidil allergy, heart failure, low blood pressure, phaeochromocytoma, kidney disease, patchy loss and a bleeding scalp** all change nothing, even all at once | Observed: R8, R9, R10, R12, R24, R25 (runs/exp-26-worst-case, exp-09 to exp-23) | Phaeochromocytoma and heart failure: never oral minoxidil (clinical-men 3.2) | Only by the provider after sign-up, ID check and card (R22, docs) |

### 4.2 Questions nobody (or almost nobody) asks

A reviewer cannot act on an answer that was never given. These gaps are not fixed by a clinician check.

| Missing question | Who misses it (before the wall) | Why it matters |
|---|---|---|
| Propylene glycol or ethanol sensitivity | Everyone except Superdrug women and Hims UK leaflets | Decides between minoxidil solution and the licensed PG-free foam (clinical-men 3.1) |
| Children or babies at home | Everyone (Happy Head asks about pregnancy in the household only) | Infant hair growth after contact with a treated scalp (clinical-men 3.1) |
| Pets | All but Lloyds and Hair + Me | Cat poisoning from topical minoxidil (customer-voice.md) |
| Current sexual function (baseline) | Numan, Treated, Dr Fox, Philip Kingsley | Needed to judge later change; effects can persist (clinical-men 10.2) |
| Kidney disease | Hair + Me, Dr Fox, Philip Kingsley, Superdrug (free text only) | Oral minoxidil precaution (clinical-men 3.2) |
| Low blood pressure | Sons, Boots, Superdrug | Oral minoxidil precaution (clinical-men 3.2) |
| Contraception (women) | Hair + Me, Philip Kingsley, Superdrug, Strut | Rules out oral minoxidil and spironolactone (clinical-women 4.1 Q3) |
| Mood or depression | Superdrug men, Hair + Me (suicidal thoughts), Hims UK and Hims US before the wall | MHRA requirement (clinical-men 10.1) |
| Any medical question before payment | Keeps (intake after payment), Hims UK and Hims US (after email or consent wall) | The patient finds out only after committing |

### 4.3 Over-blocked: safe options taken away

| # | Company | What is blocked | Evidence | Why that is stricter than the evidence |
|---|---|---|---|---|
| 1 | **Treated** | **Any mental illness** (including past anxiety) stops the whole consultation, minoxidil included | Observed: R2 (runs/e04-mental) | The MHRA mood warning is about finasteride and dutasteride; nothing in the clinical files links minoxidil to mood (clinical-men 10.1) |
| 2 | **Philip Kingsley** | Depression or anxiety history, trying for a baby, or any cancer: every plan is blocked and the patient is sent to a paid consultation (£200 virtual, £345 clinic). Nothing tells them before the account wall | Code checked live: R1, R16, R18 | A minoxidil-only plan is safe for most of these men (clinical-men 10.2, 11) |
| 3 | **Numan, Lloyds, Dr Fox** | **Low blood pressure** removes **topical** minoxidil too | Observed: Numan R10, Lloyds R7, Dr Fox R8 | Low blood pressure is a precaution for oral minoxidil only; it is not a listed contraindication for topical (clinical-men 3.1, 10.2) |
| 4 | **Lloyds** | Taking **erectile dysfunction tablets** removes finasteride and oral minoxidil; "problems with my sex life" removes finasteride | Observed: R12, R15 | Sexual problems need a baseline and a discussion, not an automatic block (clinical-men 10.2). The clinical files do not address oral minoxidil with these tablets |
| 5 | **Treated** | **Smoking (even ex-smoking) or any alcohol** removes dutasteride from the automatic offer | Observed: R17, R18 (runs/e16-smoke-daily, e17-drink-under14, e19-ex-smoker) | No clinical file gives a smoking or alcohol reason to withhold dutasteride. (The effect is limited: in review mode dutasteride is listed again, R19) |
| 6 | **Voy** | Partner pregnant removes all DHT blockers, tablets included | Docs: R8 | For tablets the SmPC judges semen exposure unlikely to harm; the handling advice is the safeguard (clinical-men 2.1) |
| 7 | **Sons** † | Age over 65: the newer code copy removes everything except a food supplement | Code: R29 (low confidence: two copies disagree) | Licensed topical options and a clinician decision would serve most men over 65 (clinical-men 3.1) |
| 8 | **Dr Fox** | On the spray route, any finasteride or minoxidil exclusion says "please cancel this consultation" instead of offering the other drug | Observed: R5, R7, R9 | Not a clinical block, but the patient is not shown the safe alternative that the tablets route would offer |

### 4.4 Fair-dealing gaps linked to the rules

- **Numan:** when both drugs are ruled out, the only product left is Rosemary Oil, a cosmetic, badged "Most
  effective" with a "See results in 180 days or your money back" strip (observed, R21). The ASA upheld a complaint
  against Numan's 2022 Regaine advert for the same money-back wording implying guaranteed results
  (uk-regulation.md 2.5).
- **Voy:** the pop-up refuses patchy or complete loss only *after* the email has been handed over (observed, R20).
- **Hair + Me:** a person who says they have **no hair loss** is still sold a "Prescription" line (observed, R7).
- **Strut:** "End questionnaire" on a stop screen leads to an error page (observed, R13); **Sons** beard route:
  a woman meets a silent dead end with no message (observed, R41).
