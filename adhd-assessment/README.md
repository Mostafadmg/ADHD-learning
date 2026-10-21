# ADHD Assessment

A clinician workspace for **adult ADHD assessment**: learn the method, practise on cases, then run a real assessment step by step and score it as you go.

Part of the [ADHD-learning](../README.md) project. Live (after merge to `main`): `https://mostafadmg.github.io/ADHD-learning/adhd-assessment/`

## What it does

- **Assess** – 13 guided steps from consent to report:
  1. Before you start (patient reference, consent, who is present)
  2. Screening questionnaires (ASRS v1.1, WURS-25, WFIRS-S, ASRS-5) with instant scoring
  3. Safety and risk
  4. Clinical history (development, school, work, mental and physical health, substances, family, forensic, sleep)
  5. Co-occurring conditions screen (PHQ-9, GAD-7, MDQ, AUDIT, DAST-10, AQ-10, PCL-5, MSI-BPD, STOP-Bang)
  6. Interview part 1: the 9 inattention symptoms, adulthood then childhood
  7. Interview part 2: the 9 hyperactivity-impulsivity symptoms
  8. Onset and impairment (DSM-5-TR criteria B, C, D)
  9. Collateral information (informants, school reports, 0–2 support rating)
  10. Differential diagnosis (criterion E: absent, co-occurring, better explains, uncertain)
  11. Symptom validity and consistency
  12. Scoring and diagnosis (criteria A–E, presentation, severity, ICD-11 and ICD-10-CM codes, evidence strength)
  13. Draft report and plan
  A live summary panel shows symptom counts and criteria status throughout.
- **During the interview** – a searchable question bank (every question, rephrasing and example), a differential finder, and the criteria side by side.
- **Learn** – 12 training modules with quizzes, 16 practice cases and a mastery exam.
- **Library** – every screening and rating tool: when to use it, how to score it, licence, and a download link where redistribution is allowed.

The interview follows the structure of the DIVA (Kooij and Francken), but all questions and examples are written for this app. Licensed instruments (DIVA-5, CAARS 2, BAARS-IV and others) are described and linked, not reproduced.

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
node tests/run.js        # engine unit tests (scoring, DSM-5-TR rules) + data validation
node tests/smoke.js      # headless browser: every route and step, console errors, phone-width overflow
```

## How the code is organised

Read [ARCHITECTURE.md](ARCHITECTURE.md). In short:

| Layer | Files | Job |
|---|---|---|
| Core | `js/core/` | namespace, DOM helpers, state store (single source of truth, observer pattern, persistence), router |
| Engine | `js/engine/` | pure functions: questionnaire scoring and diagnostic rules (unit tested) |
| Components | `js/components/` | reusable UI widgets and the questionnaire renderer |
| Data | `js/data/` | all clinical content as plain objects (symptoms, tools, differentials, modules, cases) |
| Views | `js/views/` | screens that render data and write to the store |

## Disclaimer

Decision support and training for qualified clinicians. It does not replace clinical judgement, local policy, current guidance (NICE NG87 and others) or the official licensed instruments.
