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

Two more labels describe gaps in the questionnaire itself:

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
