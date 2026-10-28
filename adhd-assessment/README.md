# ADHD Assessment

A clinician workspace for the whole **ADHD pathway, from referral to shared care**: learn the method, practise on cases, then run a real assessment step by step and, on the same patient record, plan and monitor treatment. It covers **adults (18 and over) and young people aged 6 to 17**.

Part of the [ADHD-learning](../README.md) project. Live (after merge to `main`): `https://mostafadmg.github.io/ADHD-learning/adhd-assessment/`

## What it does

- **Assess and treat**: 18 guided steps in five phases. A live panel shows symptom counts and criteria status (and, in the Treat phase, the medicine, dose, latest blood pressure, pulse and weight, trial weeks and next review).

  **Prepare**
  1. Before you start: age first (it sets the age group), patient reference, consent and who is present. For young people also school and year group, SEN support or EHCP, who has parental responsibility, the consent basis and the young person's assent.
  2. Screening questionnaires: adults ASRS v1.1, WURS-25, WFIRS-S and ASRS-5 with instant scoring; young people parent, teacher and self-report scales (such as Conners 4, SNAP-IV, Vanderbilt, ADHD-RS-5, SDQ and WFIRS-P). Licensed scales are not reproduced: you enter the result.
  3. Safety and risk (young people also safeguarding, exploitation, going missing, bullying, online harm and young carers).
  4. Clinical history (development, school, work, mental and physical health, substances, family, forensic, sleep).
  5. Co-occurring conditions screen (adults PHQ-9, GAD-7, MDQ, AUDIT, DAST-10, AQ-10, PCL-5, MSI-BPD, STOP-Bang; young people scales such as PHQ-A, MFQ, RCADS, CRAFFT, SCQ and the child or adolescent AQ-10).

  **Interview**
  6. The 9 inattention symptoms. Adults: adulthood, then childhood. Young people: now (the last 6 months), with questions for the parent, the teacher and the young person; from age 12, also before age 12.
  7. The 9 hyperactivity-impulsivity symptoms, in the same way.
  8. Onset and impairment (DSM-5-TR criteria B, C, D). For a child aged 6 to 11 the current symptoms already count as "before 12", so this step asks when the problems started and whether they came on suddenly (a red flag for another cause).
  9. Collateral information with a 0–2 support rating. Adults: partner, parent and school reports. Young people: parent or carer, teacher and the young person's own view.

  **Diagnose**
  10. Differential diagnosis (criterion E: absent, co-occurring, better explains, uncertain). Young people add oppositional defiant disorder, conduct disorder, attachment difficulties and developmental trauma, developmental language disorder, FASD, relative age, family or school environment, sleep-disordered breathing in children, and separation anxiety.
  11. Symptom validity and consistency.
  12. Scoring and diagnosis (criteria A–E, presentation, severity, ICD-11 and ICD-10-CM codes, evidence strength).

  **Treat** (once ADHD is diagnosed)
  13. Treatment plan: support first (the NICE items for the age group), the decision, and who can prescribe (see the scope note below).
  14. Pre-treatment checks: heart history, blood pressure (adults: confirm a clinic reading of 140/90 or more with ambulatory or home readings; young people: the centile for age and height), pulse, height, weight, the contraindication and caution screen, misuse risk, pregnancy (from age 12) and driving (from 17), with a live verdict.
  15. Choose and prescribe: previous medicines, the NICE order for the age group, products and their licences for this age, a dose plan, counselling and a controlled drug prescription (quantity in words and figures).
  16. Titration and reviews: the trial clock (6 weeks at the optimised or maximum dose, not from the first dose) and one record per review, with flags (for example a heart rate over 120 or raised blood pressure on 2 occasions, weight loss, troublesome side effects).
  17. Monitoring and shared care: the monitoring schedule with due dates, the annual review, a shared care letter to the GP, when to hand care back, and, for young people from age 13, planning the move to adult services.

  **Report**
  18. Draft report and plan, including the treatment sections.

- **Age groups.** The age sets the questions, labels, tools, differentials and thresholds: child (6 to 11), young person (12 to 16), young person aged 17 (adult symptom threshold, driving) and adult (18 and over). **Under 6, the app stops at the first step and advises referral** to a service with expertise in ADHD in young children; it does not assess or treat under 6. It records only the referral details and safeguarding, and builds a short referral note.
- **Demo patients.** Two made-up patients show every step filled in, from assessment to monitoring:
  - an adult aged 34: "Explore with a demo patient" on the sign-in page, or "Load demo patient" on Home;
  - a child aged 8 (child demo): "Explore with a child demo" on the sign-in page, or "Load child demo" on Home.

  Both reach a diagnosis and go on to a treatment record: plan, pre-treatment checks, prescription and titration reviews. The adult has a shared care request with the GP; the child is still being titrated.
- **Safety checks in the Treat phase.** The app suggests; it never prescribes on its own. These checks were added after a clinical safety review (October 2026):
  - **Dose ceilings.** No dose is suggested above the limit that applies: the SmPC maximum for the age and weight (lower with severe kidney or liver impairment, or an interacting medicine), the usual maximum where the SmPC allows more only in rare cases (dexamfetamine 20 mg a day), or the BNF/BNFC ceiling when the product is not licensed at that age. Atomoxetine stops at 1.8 mg/kg a day. A dose above the maximum is an error on the prescription until a specialist reason is recorded. With no age recorded, no dose is shown at all.
  - **Licence conditions.** Some licences depend on what came before: for example lisdexamfetamine in young people after methylphenidate did not help enough, or adult licences that need ADHD symptoms in childhood. Until that is recorded, the product is shown as off-label with the reason.
  - **Increases held when flags are raised.** An "act" or "urgent" flag at a review (for example a heart rate over 120 or raised blood pressure on 2 occasions, or any report of suicidal thoughts, chest pain or fainting on exertion, liver signs, seizures or psychosis) stops the next-dose suggestion. A dose marked optimised does not count until the flag is dealt with or a reason is recorded.
  - **The right medicine and dose.** Reviews belong to one medicine, so after a switch the old reviews do not set the new dose. After "Stop" there is no prescription, and after "Increase" or "Reduce" the new dose must be entered. Prescription wording is blocked when the timing is unclear (for example "morning or evening").
- **During the interview**: a searchable question bank (every question, rephrasing and example), a differential finder, and the criteria side by side.
- **Learn**: 12 training modules with quizzes, 16 practice cases and a mastery exam.
- **Library**: every screening and rating tool: the ages it covers, when to use it, how to score it, licence, and a download link where redistribution is allowed.

The interview follows the structure of the DIVA (Kooij and Francken), but all questions and examples are written for this app. Licensed instruments (DIVA-5, Young DIVA-5, CAARS 2, BAARS-IV, Conners 4, SDQ and others) are described and linked, not reproduced.

## Who can diagnose and prescribe (pharmacist scope)

Diagnosing ADHD (NICE NG87 1.3.1) and starting ADHD medicine (NICE NG87 1.7.2) are for a healthcare professional with training and expertise in diagnosing and managing ADHD. For an independent prescribing pharmacist or other non-medical prescriber, that means working inside a specialist ADHD team, being competent for this medicine and this age group, and having agreed governance and supervision. The Treatment plan step asks you to confirm all three and warns you when they are not ticked. Treatment facts (doses, licences, controlled drug rules, monitoring) follow the SmPCs, NICE NG87 and the main course; the app suggests, the prescriber decides. In Scotland the consent law for under-16s names a medical practitioner, so a pharmacist-led assessment there needs local policy or legal advice.

## Privacy

Everything is stored in the browser's `localStorage` on the device in use. Nothing is sent to a server. Profiles can have a PIN, which is a lock, not encryption. Use a patient reference, not a name; copy the report into the clinical record and delete the assessment afterwards. **About, privacy and data** has export, import and delete-all.

## Run it

No build step. Serve the folder and open `index.html`:

```bash
cd adhd-assessment
python3 -m http.server 8000   # then open http://localhost:8000
```

Single-file version for offline use: `node scripts/bundle.js adhd-assessment.html`.

## Tests

```bash
node tests/run.js        # engine unit tests (scoring, DSM-5-TR rules, age bands, treatment rules) + data validation
node tests/smoke.js      # headless browser: every route and step, console errors, phone-width overflow
```

`tests/run.js` also runs `tests/young-tests.js` (age bands and the young-person rules) and `tests/tx-tests.js` (the treatment engine). `tests/dev.html` runs the app on small fixture data (`node tests/smoke.js --dev`).

## How the code is organised

Read [ARCHITECTURE.md](ARCHITECTURE.md). In short:

| Layer | Files | Job |
|---|---|---|
| Core | `js/core/` | namespace, DOM helpers, state store (single source of truth, observer pattern, persistence), router |
| Engine | `js/engine/` | pure functions: questionnaire scoring, diagnostic rules with age bands, treatment rules (unit tested) |
| Components | `js/components/` | reusable UI widgets and the questionnaire renderer |
| Data | `js/data/` | all clinical content as plain objects (symptoms, tools, differentials, age bands, medicines and the treatment pathway, modules, cases) |
| Views | `js/views/` | screens that render data and write to the store |

## Disclaimer

Decision support and training for qualified clinicians. It does not replace clinical judgement, local policy, current guidance (NICE NG87 and others), the SmPC and BNF, or the official licensed instruments.
