# ADHD Assessment: architecture and contracts

This file is the contract between the core, the content (data files) and the views.
Read it fully before adding or changing anything.

The workspace runs one patient record through the whole pathway in 18 steps and five phases:
Prepare, Interview, Diagnose, Treat (treatment plan, pre-treatment checks, prescribing, titration,
monitoring and shared care) and Report. It covers adults (18 and over) and young people aged 6 to 17.
Under 6 the app stops and tells the clinician to refer.

## 1. Principles

- **Vanilla JavaScript, no build step, no framework.** Plain `<script>` tags in a fixed order (see `index.html`). Every file is an IIFE that attaches to `window.AA`. No ES modules, no `import`, no external JS libraries.
- **Data before UI.** Clinical content lives in `js/data/` as plain objects. Views never hard-code clinical content; they render data.
- **Single source of truth.** All user state is in `AA.store` (one object, persisted to `localStorage`). Views read with `get`, write with `set`, and subscribe to changes. Never keep a second copy of user state in a view except short-lived local UI state.
- **Pure logic is separate.** Scoring (`js/engine/scoring.js`), diagnostic rules (`js/engine/diagnosis.js`) and treatment rules (`js/engine/treatment.js`) are pure functions with no DOM code, tested in node (`tests/`). They cope with missing data collections: they return empty results instead of throwing.
- **Age is worked out, never stored.** The age band comes from `patient.age` every time (`AA.diagnosis.band`). Record keys keep one meaning at every age (section 4), so changing the age never moves data.
- **Works in a sandboxed frame.** The app is also published inside a locked-down iframe: `alert/confirm/prompt` do nothing, `window.print()` does nothing, file downloads are blocked. Use `AA.util.confirm()` (in-page dialog), `AA.util.copyText()`, and check `AA.util.isEmbedded` before offering print or download. Wrap storage access (already done in `AA.util.storage`). Only plain route tokens are used for URLs.
- **Accessible.** Real buttons and form controls, labels on every input, visible focus, keyboard operable, colour never the only signal, `aria-live` for scores.
- **Plain UK English** in all copy. Short sentences. Name things by what clinicians recognise.

## 2. Files and load order

```
index.html
css/app.css                core tokens (light + dark) and shared component classes (incl. the step strip phase labels)
css/v-assess-a.css         assess-steps-a.js (prefix .as-)
css/v-assess-iv.css        assess-interview.js (prefix .iv-)
css/v-assess-b.css         assess-steps-b.js (prefix .ab-)
css/v-assess-tx.css        assess-treat.js (prefix .tx-)
css/v-library.css          tools library and pathway (prefix .lib-)
css/v-learn.css            learning, quizzes, cases (prefix .lr-)
css/v-reference.css        ddx, criteria, question bank, glossary (prefix .rf-)
css/v-guides.css           forms guide and ddx protocol (prefix .gd-)
js/core/ns.js              window.AA, AA.add(), AA.byId()
js/core/util.js            AA.util: h(), $, $$, esc, uid, debounce, storage, sha256, toast, confirm, copyText, download, isEmbedded
js/core/store.js           AA.store, AA.auth, AA.assess, AA.progress
js/core/router.js          AA.router
js/components/ui.js        AA.ui: pageHead, btn, badge, statusPill, sevChip, callout, html, list, details, seg, check, field, input, search, progress, tabs, empty, kv, table, source
js/engine/scoring.js       AA.scoring
js/engine/diagnosis.js     AA.diagnosis (criteria, age bands, step progress)
js/engine/treatment.js     AA.treatment (treatment rules; must load after diagnosis.js)
js/components/questionnaire.js  AA.components.questionnaire, AA.components.bands, AA.components.scoreBox
js/data/tools-adhd.js      tools (5.4); also tools-comorbid.js, tools-info.js
js/data/symptoms/*.js      symptoms ia1-ia9, hi1-hi9 (5.1), one file each
js/data/impairment.js      impairment, onset, duration, supplement, collateral (5.2)
js/data/history.js         history, risk, validity, plan (5.3, 5.3b)
js/data/ddx-*.js           differentials (5.5): ddx-mood, ddx-anxiety, ddx-neurodev, ddx-personality-sud, ddx-medical, ddx-other
js/data/age-bands.js       ageBands (5.12)
js/data/ddx-young.js       differentials for young people (5.5): odd, conduct, attach, dld, fasd, relage, env, osa_child, sepanx
js/data/pathway.js         pathway, guidelines, criteria (5.6)
js/data/glossary.js        glossary (5.6)
js/data/learn-1..3.js      training modules (5.7); cases-1.js, cases-2.js: cases (5.8)
js/data/step-guide.js      stepGuide for the 13 assessment steps (5.9)
js/data/forms-guide.js     formsGuide (5.10); ddx-protocol.js: ddxProtocol (5.11)
js/data/step-guide-young.js stepGuideYoung (5.13)
js/data/tx-products.js     txDrugs, txProducts (5.14)
js/data/tx-pathway.js      txSequence, txPlanItems, txCardiac, txCautions, txSideEffects, txCounsel, txRxChecks, txMonitor (5.14)
js/data/tx-guide.js        stepGuide entries for the 5 treatment steps (merged into stepGuide, 5.9)
js/data/demo.js            demo (adult demo patient) and demoYoung (child demo, age 8), with treatment records (5.15). Last data file.
js/views/shell.js          top bar, sidebar, routes: signin, home, new, about; AA.shell (demo loader)
js/views/assess-frame.js   route: assess (workspace, step strip, live panel, step guide); AA.STEP_LIST, AA.STEP_PHASES
js/views/assess-steps-a.js AA.steps: setup, screen, risk, history, comorbid
js/views/assess-interview.js AA.steps: ia, hi, onset, collateral
js/views/assess-steps-b.js AA.steps: ddx, validity, summary, report; AA.components.assessmentReport, consistencyChecks
js/views/assess-treat.js   AA.steps: txplan, baseline, prescribe, titrate, monitor; AA.components.treatPanel, treatmentReport, sharedCareLetter
js/views/library.js        routes: tools, tool, pathway
js/views/learn.js          routes: learn, module, quiz, exam, cases, case, glossary
js/views/reference.js      routes: ddx, cond, criteria, bank, sym
js/views/guides.js         routes: forms, form, ddxguide; AA.components.ddxProtocol
js/app.js                  boot
tests/run.js               node test runner: engine unit tests + data schema validation (section 9)
tests/young-tests.js       young-person engine tests (called by run.js)
tests/tx-tests.js          treatment engine tests (called by run.js)
tests/dev.html             the app on fixture data (tests/fixtures/data.js instead of js/data/*)
tests/smoke.js             headless browser smoke test (Playwright)
scripts/bundle.js          builds one self-contained HTML file from index.html
```

Order rules that matter:
- `treatment.js` after `diagnosis.js`: it uses `AA.diagnosis.age` and `band` when they exist (it has its own fallback).
- `tx-guide.js` after `step-guide.js`: `AA.add` merges object collections, so it adds the five treatment entries to `stepGuide`.
- `ddx-young.js` after the adult `ddx-*.js` files, so lists show the adult conditions first; `demo.js` last among the data files.
- Data before views. `assess-treat.js` after `assess-steps-b.js` (the report calls `AA.components.treatmentReport` when it builds).

Cache busting: a `<script>` tag carries a `?v=` query; bump it when you change that file. `tests/run.js` and
`scripts/bundle.js` ignore the query (the bundler ignores one on a stylesheet link too, but stylesheet links
carry none at present). When you add a CSS, engine or view file to `index.html`, add it to `tests/dev.html`
too (with `../` paths); data files are not listed there.

Each view file owns its own CSS file and class prefix. Reuse the shared classes in `css/app.css` first
(section 7); add view CSS only for layout that the shared classes do not cover. Use only colour tokens
(`var(--...)`), never literal colours, so both themes work.

## 3. Core API

### AA.util (`U`)
- `U.h(tag, attrs, ...children)` creates an element. attrs: `class`, `style` (string or object), `html` (trusted innerHTML), `onclick` etc., `value`/`checked`/`disabled` as properties, anything else as attributes. Children: strings, nodes, arrays, null.
- `U.$(sel, root)`, `U.$$(sel, root)` (array), `U.clear(el)`, `U.esc(s)`, `U.uid(n)`, `U.debounce(fn, ms)` (has `.flush()`), `U.fmtDate(iso, withTime)`, `U.today()`.
- `U.storage.get/set/remove` never throw. `U.isEmbedded` true inside a frame.
- `U.toast(msg, 'ok'|'warn'|'err')`, `U.confirm({title, body, ok, cancel, danger}) -> Promise<boolean>`, `U.copyText(text) -> Promise<boolean>`, `U.download(name, text, mime) -> boolean` (false when embedded).

### AA.ui
See `js/components/ui.js` for signatures. Key ones:
- `ui.pageHead({eyebrow, title, lead, actions})` - every routed page starts with one (the router focuses its h1).
- `ui.btn({label, kind:'primary'|'secondary'|'ghost'|'quiet'|'danger', onClick, go:'route', small, icon})`.
- `ui.seg({label, options:[{v, l, kind:'yes'|'no'|'unsure'|'shade'}], value, onChange(v), small, hideLabel})` - radio-group segmented control. Clicking the selected option clears it (`onChange(null)`).
- `ui.check({label, checked, onChange(bool), hint})`, `ui.input({value, onSave(v), rows, placeholder, type})` (debounced save), `ui.field(label, control, hint)`, `ui.search(placeholder, onInput)`.
- `ui.details(summary, content, {open, meta})`, `ui.tabs([{id,label,count,render}], activeId, onChange)`, `ui.table(head, rows)`, `ui.kv(rows)`, `ui.callout(kind, content, title)`, `ui.badge(text, kind)`, `ui.statusPill('met'|'not-met'|'pending'|'partial')`, `ui.sevChip(sev0to3, text)`, `ui.html(trustedHtml)`, `ui.list(items)`, `ui.empty(title, body, action)`, `ui.progress(done, of)`, `ui.source(text)`.

### AA.store
- `AA.store.get(path, fallback)`; `AA.store.set(path, value)` (undefined deletes); `AA.store.update(path, fn)`.
- `AA.store.subscribe(prefix, fn) -> unsubscribe`. Fires when the changed path is inside `prefix` or contains it. **Always unsubscribe in your view's cleanup.**
- Paths are dot-separated: `assessments.<id>.symptoms.ia1.adult`.

### AA.auth, AA.assess, AA.progress
- `AA.auth.current()` -> `{id, name, role, ...}` or null.
- `AA.assess.get(id, rel, fallback)`, `AA.assess.set(id, rel, value)` (also stamps `updatedAt`), `AA.assess.create(patient, {demo})` (`demo: 'young'` marks a child demo, any other truthy value an adult demo), `AA.assess.insert(record)` (fills missing keys from the blank record), `AA.assess.list()`, `AA.assess.remove(id)`, `AA.assess.path(id, rel)`.
- `AA.progress.get(rel, fallback)` / `AA.progress.set(rel, value)` - per-clinician learning progress. Keys used: `modules.<moduleId>.done` (bool), `modules.<moduleId>.at`, `quizzes.<quizId>` = `{best, last, at}` (percent), `cases.<caseId>` = `{score, of, at}`, `exam` = `{best, last, at}`, `lastAssessment`, `sandbox.<toolId>` = answers object (library practice scoring).

### AA.router
- `AA.router.register(name, {title: string|fn(params), render(el, params) -> cleanup?})`.
- Route token = `name` or `name-param1-param2`. Data ids therefore never contain hyphens. Navigate with `AA.router.go(token)` or any element with `data-go="token"`. `AA.router.refresh()` re-renders the current route keeping scroll.
- `render` gets an empty `el` (`#view`). Return a cleanup function if you subscribed to anything.
- A deep link opened before sign-in waits as a pending route: `AA.router.takePending()` returns and clears it; `AA.router.afterSignIn()` goes there (or home). The demo buttons drop it, so they always open the demo.

### AA.scoring
- `AA.scoring.score(tool, answers)` -> `{complete, answered, of, total, max, band, sev (0-3|null), positive (bool|null), subscales[], flags[{level,text,item}], lines[], method, ...method extras}`.
- `AA.scoring.forAssessment(a, toolId)` -> score or null if no answers.
- Methods: `sum` (also `count`), `asrs18`, `wfirs`, `mdq`, `pcl5`, `triage`. See section 5.4.

### AA.diagnosis (`D`)
Age bands (worked out from `patient.age`, never stored):
- `D.BANDS` = `['under6', 'child', 'teen', 'y17', 'adult']`. `D.age(a)` -> number or null.
- `D.band(a)` -> `'under6'` (under 6) | `'child'` (6-11) | `'teen'` (12-16) | `'y17'` (17) | `'adult'` (18 and over, or age missing).
- `D.young(a)` -> true for child, teen and y17. `D.bandInfo(a)` -> `AA.data.ageBands[band]`, or `{}` when there is no band data.
- `D.periods(a)` -> the record periods in use: `['adult']` for band child (6-11), otherwise `['adult', 'child']`.
- `D.periodLabel(a, 'adult'|'child')` from `D.PERIOD_LABELS.young` ("Now (last 6 months)", "Before age 12") or `.adult` ("Adulthood (last 6 months)", "Childhood (age 5 to 12)").
- `D.forAge(a, x)` -> does a data item apply at this age: `x.ages` (`'young'|'adult'|'all'`, missing = all) and, when given, `x.bands`. The history step and its progress use it.
- `D.stepTools(a, 'screen'|'screenCore'|'comorbid'|'comorbidCore')` -> tool ids. Adults always get `D.STEP_TOOLS`. Young people get their band's list (ids not in the tools library are dropped). When the band has no list for the key, young people get the library tools whose numeric `ageMin`/`ageMax` covers their age (ADHD scales for `screen`, other `comorbid`-stage tools for `comorbid`, never C-SSRS), and an empty list for the core keys: never the adult list.
- `D.toolDone(a, id)` -> true when the scored answers are complete, or when an entered result (`tools.<id>.result`) has a score or a cut-off answer.

Criteria and outcome:
- `D.need(a)` current-period threshold (5 from age 17, else 6). `D.counts(a, 'adult'|'child')`. `D.SEVERAL` = 3 (the app's number for "several" symptoms before 12).
- `D.criterionA..E(a)`, `D.criteria(a)` -> `{A:{status, detail,...}, ...}`; status is `met|not-met|pending|partial`. Detail texts say "Current" and "Before age 12" for young people.
- Criterion B for band child (6-11) is judged from current symptoms plus the onset answers: pending until one onset answer is recorded (age of onset, "always there" or `before12`); `'unsure'` keeps it pending. `onset.before12 === 'no'` (a sudden or recent start) no longer fails B: B is met by the current symptoms and its detail carries a red-flag line. Instead criterion E stays pending (with `abrupt: true`) until the clinician records which differential explains or excludes the sudden start: `onset.abruptReviewed === true` or a non-empty `onset.abruptNote` (ICD-11 CDDR: abrupt onset suggests another cause).
- Criterion C for young people counts **settings**, not impairment areas: `D.SETTING_OF_DOMAIN` maps the domains to settings (`work` -> school, `relationships` and `daily` -> home, `social` -> friends, `leisure` -> other activities; self-esteem and accidents are areas of impairment, not settings). A parent or carer (collateral rated 1 or 2, or 3 or more symptoms rated yes in `symptoms.<id>.by.parent`) adds home, and a teacher (the same with `school` / `by.teacher`) adds school. Two settings meet C; the result carries `settings` and `fromSources`. Adults keep the count of affected areas (`D.ADULT_DOMAINS_MIN`).
- `D.impairment(a, period)` -> `[{id, label, sev}]`; young people get the band's `impairmentLabels`. `D.ADULT_DOMAINS_MIN` = 2.
- `D.presentation(a)` -> `combined|ia|hi|null`; `D.PRESENTATIONS[key]` -> `{label, dsm, icd11}` (also `other`, `unspecified`).
- `D.severity(a)` suggested `mild|moderate|severe|null`.
- `D.collateralKeys(a)` -> `['parent', 'school']` for young people, `['parent', 'partner', 'school']` for adults. `D.collateral(a)` -> `{level:'clear'|'some'|'none'|'unavailable', best, rated, sources, keys}` over those keys.
- `D.agreement(a)` -> `{pairs, agree, bothYes, differ[]}`: parent against teacher, from `symptoms.<id>.by`, on symptoms both rated yes or no.
- `D.coreConditions(a)` -> the differential objects that must be reviewed: for young people the band's `ddxCore` ids that exist in the library, otherwise every condition with `core: true`. `criterionE` also returns `core` (ids).
- `D.ddxScore(cond, entry)` -> `{score, max, pct, band:'none'|'weak'|'possible'|'strong', checked}`; `D.ddxScreens(a, cond)`.
- `D.confidence(a)` -> `{level:'high'|'moderate'|'low', points, reasons:[[sign, text]]}` (sign `+`, `-` or `!`). Young people: parent and school collateral, parent-teacher agreement, and an ADHD rating scale result (`D.ADHD_RATING_IDS` or any tool in an `adhd-*` group) compared with criterion A; ASRS and WURS-25 are not used.
- `D.outcome(a)` -> `{code:'met'|'not-met'|'subthreshold'|'better-explained'|'incomplete', title, reasons[], presentation, severity, confidence, dsm, icd11, criteria}`.
- `D.diva2(a)` DIVA 2.0 / DSM-IV score form view, with `applies` (false under 18, so views hide it) and a `note`.
- `D.stepProgress(a, stepId)` -> `{done, of}`, band-aware (only the periods, collateral keys, tool lists and history sections in use; for ages 6 to 11 the onset step needs one onset answer, the 6-month answer and the current impairment ratings; for ages 6 to 17 the setup step has a fourth item, a consent basis that fits the age: under 16 `parent_assent` or `gillick`, at 16 and 17 `capacity_16` or `lacks_capacity_16`; an older record holding `parent_assent` at 16 or over is read as `lacks_capacity_16`). A young band with empty core tool lists counts the screening or co-occurring step as done once any listed tool is recorded. Unknown step ids go to `AA.treatment.stepProgress` when it is loaded. `of: 0` means "not applicable" (the step strip shows a dash).

### AA.treatment (`T`) - js/engine/treatment.js
Pure functions over the assessment record, the `tx*` data (section 5.14) and the safety-step items (`AA.data.risk`). Every collection may be missing: functions then return empty results. Doses are **mg per day**; `perDay` is the number of doses. Reasons, cautions, flags, warnings and errors are objects with `level`, `text` (also `t`) and `src`, and they print as their text. Every rule carries a `src`; lines not from a named source say "Clinical practice". Results are prompts for the clinician, never a prescription on their own.

Rules that run through the whole engine:
- **No age, no numbers.** With no `patient.age`, `dosePlan`, `nextDose`, `rxText` and `licence` give no doses, maxima or licences, only "Record the age in Setup" (`ageMissing: true`).
- **Reviews belong to a medicine.** A review stores its `drug` and `product`. The dose, the trial, the next dose, the prescription dose and the titration progress use only the current medicine's reviews (`T.currentReviews`). Blood pressure, pulse and weight flags use every review, so that history carries across a switch.
- **Dose ceilings.** Nothing suggests or writes a dose above the ceiling that applies: the SmPC maximum for the age (reduced for weight, kidney or liver impairment, or an interacting medicine), the usual maximum when the SmPC allows more only in rare cases (`usualMax`), or the BNF/BNFC off-label ceiling when the product has no licence at this age. Atomoxetine up to 70 kg has a per-kg ceiling (1.8 mg/kg, never more than 120 mg) and a soft limit (the 1.2 mg/kg target).
- **Flags hold increases.** An urgent or act flag at the last review holds the next dose, and keeps a dose marked optimised from counting until the flag is acted on or a reason is recorded (`reviews.<id>.flagOverride`).

Age and applicability:
- `T.age(a)`, `T.band(a)` (use `AA.diagnosis` when loaded, else the same rules), `T.group(a)` -> `'under6'` | `'young'` (6-17) | `'adult'`.
- `T.forAge(a, x)` -> does a treatment data item apply at this age: `ages` (`'young'|'adult'|'all'`, missing = all; under 6 counts as young), `ageMin`/`ageMax` (inclusive, ignored when no age is recorded) and `bands`. Every list and count in the engine uses it, so views that filter with it show the same items the progress counts.
- `T.applicable(a)` -> `{ok, code, reason, caution?, src?, ageMissing?, note?}`: ok only when `formulation.decision` is `'met'` or `'other-specified'`; never under 6 (the reason states the tool's scope: no ADHD medicine is licensed under 6; NICE puts group parent training first under 5 and follows the 5-and-over pathway, off-label, at 5). `'other-specified'` adds `caution: true` and a reason: NICE medicine recommendations assume full criteria, so medicine is outside NICE and needs a consultant or multidisciplinary team decision. `code` is `under6`, `met`, `other-specified`, `not-met`, `deferred` or `nodecision`.
- `T.diagnosisCheck(a)` -> `{ok, issues: [{level, text, src}], src}`: before medicine, does the recorded assessment still support the decision (NICE NG87 1.7.4)? With decision `'met'` it lists an outcome other than "met" and each criterion A to E that is pending, not met or partial. It also lists a safety step not marked reviewed. `{ok: true, issues: []}` when no medicine decision applies. The plan item `tp_recheck` records the clinician's confirmation.

Lookups:
- `T.drug(id)`, `T.product(id)`; `T.reviewsSorted(a)` (every review, oldest first, each with its `id`; undated last), `T.latestReview(a)` (the last of them, any medicine).
- `T.currentReviews(a)` -> the current medicine's reviews, oldest first. A review with a `drug` counts when it matches `choice.drug` and is not dated before `choice.startDate` (a restart of the same medicine begins again). A review with no `drug` (an older record) counts only when dated after the start date, or always when there is no start date. `T.currentLatest(a)` -> the last of them.
- `T.medState(a)` -> `{reviews, latest, stopped, stopReview, optimised, optReview, held}` from the current medicine's decisions (reviews with no decision are skipped). `stopped`: the latest decision is Stop. `optimised`: the latest decision is Optimised (or Stay after it, with no Increase, Reduce, Switch or Stop since) and that review raised no act or urgent flag, unless `flagOverride` is recorded. `held`: marked optimised, but that review's flags need action first. A later Increase or Stop clears "optimised".
- `T.weight(a)`: latest review weight, else baseline, else `choice.weightKg`.
- Item lists for this age (what the views show and the counts use): `T.cardiacItems(a)`, `T.cautionItems(a)` (the two pregnancy items only from age 12), `T.planItems(a)`, `T.counselItems(a, drugId?)` (none until a medicine is chosen), `T.rxChecks(a, isCD?)` (Schedule 2 items only for a controlled drug; `optional` items are listed but never counted), `T.sideEffects(a, drugId?)` (the medicine's own `se` list, else all). `drugId` and `isCD` default to the chosen medicine. `T.planItemApplies(a, x)` -> does a conditional plan item apply now (see Progress).
- `T.histTicked(a, ids)`; `T.cardiacAnswer(a, id)`, `T.ciAnswer(a, id)` -> `{v: 'yes'|'no'|null, fromHistory, fromPregnancy, fromRisk}`. A recorded yes or no wins. For `ci_pregnancy` and `ci_breastfeeding` the pregnancy question (`baseline.pregnancy`) answers next. Otherwise an unanswered question counts as yes when a linked safety-step item is ticked (`fromRisk`: the item's `risk` ids; by default `ci_depression` follows current suicidal thoughts or recent self-harm and `ci_psychosis` follows psychosis or mania), then when a linked history item (`hist`) is ticked (`fromHistory`).

Pre-treatment checks:
- `T.bpCheck(a, rec)` -> `{level: 'ok'|'repeat'|'confirm'|'refer'|'urgent'|'unknown', text, src, pulse, clinic?}` (`pulse` is a watch note when the pulse is over 120, else null). `rec` is the baseline or a review.
  - Young people: from `rec.bpCentile` (the clinician reads the centile chart and names it in `baseline.bpChart`; the tool holds no tables). Whatever the centile entry, 180/120 or higher is `urgent` (same-day paediatric assessment), and from age 13 a reading of 130/80 or higher entered as below the 95th centile (or with no band) is `repeat` (AAP 2017 uses adult-style categories from 13).
  - Adults: `sbp`/`dbp`. With a second reading (`rec.repeat`) the lower of the two, and with a third (`rec.repeat3`) the lower of the last two, as NICE NG136 1.2.2 records it; `clinic: {sbp, dbp}` is the reading used. When one of the first two readings is 180/120 or higher and the other is much lower, the result is `confirm` until the third reading is recorded; then `abpm`.
- `T.baselineVerdict(a)` -> `{level: 'stop'|'cardiology'|'ecg'|'incomplete'|'caution'|'ok', reasons[], missing[], done, of, bp}`. A ticked safety-step item at the `urgent` level gives `stop` ("act on this before starting"); a `high` item gives `caution`. "ECG done and normal" appears only when an ECG result is recorded.
- `T.cautionsFor(a, drugId)` -> `[{id, t, level: 'ci'|'caution', src}]`: screen answers against the drug's `ci`/`caution` ids, plus pregnancy or breastfeeding, guanfacine without contraception, misuse risk for stimulants, and age 60 and over.

Choosing and dosing:
- `T.SEQUENCE` (built-in NICE order, used when `txSequence` is missing); `T.options(a)` -> `[{n, drugs, label, when, clause, status: 'next'|'possible'|'done'|'tertiary'|'blocked', why, action, current, src}]` from `treatment.prior` (empty under 6). The tertiary step (1.7.16) opens only when an adequate trial of a stimulant and of a non-stimulant did not help; when the two classes were stopped for intolerance it is `possible`, labelled clinical practice. Dexamfetamine is possible only when lisdexamfetamine helped or was not tolerated, never after it failed.
- `T.licence(a, product)` -> `{licensed, licenceNote, src, condition?, conditionUnconfirmed?, ageMissing?}`. Licence conditions in SmPC section 4.1 that depend on earlier treatment or the history are checked, as `condition: {id, text, state: 'met'|'not_met'|'unconfirmed', note, src}`:
  - young people: lisdexamfetamine and dexamfetamine need a clinically inadequate response to methylphenidate (`mph_inadequate`; dexamfetamine after lisdexamfetamine intolerance is off-label, NG87 1.7.9 footnote); guanfacine needs stimulants that are unsuitable, not tolerated or not effective (`stim_unsuitable`: `choice.stimulantsUnsuitable`, or a previous stimulant that did not work or was stopped);
  - adults: lisdexamfetamine and atomoxetine need ADHD symptoms in childhood (`childhood_symptoms`: criterion B met, or treatment continuing).
  A product may set its own in `licensed.conditions` (`{child, adult}`: a condition id, or null for none). When a condition is not met or not confirmed, `licensed` is false and the note starts "Off-label use" or "Licence condition not confirmed".
- `T.products(a, drugId)` -> `[{p, id, licensed, licenceNote, licence, offLabel, blocked[], cautions[], notes[]}]`, usable products first. `blocked` holds the drug's contraindications, the product's own `ci` items answered yes, the misuse rules (NG87 1.7.24) and under 6. A product-level contraindication (txProducts `ci`; `ci_acidsuppress` for Medikinet XL and Ambinet XL) blocks that product, not the medicine, in `T.products`, `T.dosePlan` (`blocked`), `T.nextDose` (hold) and `T.rxText` (error).
- `T.dosePlan(a, productId, weightKg?)` -> `{start, unit, perDay, step, every, max, maxText, maxSource: 'smpc'|'bnf'|null, usualMax, bnfText, bnfMax, ceiling, soft, capLabel, target, targetPerKg, weightBased, needWeight, fallback, ageMissing, scheme: 'fixed'|'atx'|'gxr', adjust, text, steps: [{week, dose, perDay, perDose, split}], warnings[], blocked[], licensed, licenceNote, licence, rounding, note, sources}`. `target` is a number, or `[low, high]` for guanfacine.
  - `max` is the SmPC maximum for this age (`maxSource: 'smpc'`); `capLabel` names a reduced cap. A product with no dose for this age group (an adult on a child-only product, or the reverse) shows the other schedule for reference (`fallback: true`), and its `max` is the BNF/BNFC off-label ceiling (`maxSource: 'bnf'`, from a numeric `bnfMax` or the `bnf` text) or null. `bnfText` always holds the BNF/BNFC line separately.
  - `usualMax`: when the SmPC allows a higher dose only in rare cases (dexamfetamine: usually 20 mg a day, 40 mg rarely), the ladder stops at `usualMax`, and the text gives `max` only as the rare specialist maximum (a specialist decision; `choice.overMaxReason` records the reason).
  - Atomoxetine up to 70 kg: no fixed `max`; `ceiling` is 1.8 mg/kg (never more than 120 mg) and `soft` the 1.2 mg/kg target, which is rounded down to the strengths. Exactly 70 kg is still dosed per kg; over 70 kg the fixed doses apply.
  - Medikinet XL in adults (`maxMgPerKg`): the cap comes from the weight, rounded down to a dose the number of doses can make. With no weight: `needWeight`, a warning, and no increase.
  - Guanfacine: the maximum comes from `maxTable` by age and weight (contiguous bands: a row ends at its `kgBelow`, else the next row's `kgMin`, else its `kgMax`). With no SmPC maximum at this age and weight, `max` is null and increases are held (specialist or tertiary decision).
  - `adjust` = `{renal, hepatic, hepaticKnown, hepaticMild, cyp2d6, cyp3a4inh, cyp3a4ind, cyp3a4unclear}` from the safety screen: severe kidney impairment caps lisdexamfetamine at 50 mg. Liver impairment (`ci_hepatic` yes) changes atomoxetine by `baseline.childPugh`: A no change (`hepaticMild`), B 50% of the usual doses, C 25%; with no class recorded, 50% and a warning. A moderate or strong CYP3A4 inhibitor (`ci_cyp3a4_inh`) halves the guanfacine range and maximum (rounded down to whole tablets, which must not be broken), and a strong inducer (`ci_cyp3a4_ind`) adds a warning (specialist re-titration up to 7 mg). A strong CYP2D6 inhibitor adds "start lower, titrate more slowly". An older record holding the combined `ci_cyp3a4` is treated as an inhibitor, with a warning that it does not say which, until one of the two new items is answered.
  - Each step carries `perDose` (mg at each dose, morning first) and `split` (how it is given). Ladders offer only doses the strengths can make.
- `T.regimen(a, productId, daily, perDay?)` -> `{perDay, doses, made, equal, halves, text}` or null: how a daily dose is given. In order: equal doses of whole units; for immediate release in 2 doses, a larger morning dose (10 mg + 5 mg); equal doses with half tablets (only products marked `scored`); unequal doses with halves; then, only when the prescriber did not set the number of doses, 3 equal doses of an immediate-release product. Liquids give any dose. `perDay` defaults to `choice.perDay` for the chosen product, then the SmPC schedule.
- `T.roundToStrengths(mg, strengths, noun)` -> the nearest dose one or two units can give; `T.roundDownToStrengths(mg, strengths, noun)` -> the largest dose not above `mg` (for targets and maxima). A dose uses the fewest tablets or capsules (Medikinet XL 15 mg is 10 mg + 5 mg).
- `T.timesCount(text)` -> how many doses a day "When to take it" means: a number, `'or'` when it offers a choice, or null when it cannot be read.

Titration, monitoring and the prescription:
- `T.trial(a, today?)` -> `{weeks, days, need, adequate, optimised, stopped, held, atMax, dose, weeksAtDose, doseDate, text, src}`. `weeks` is the time since `choice.startDate`; `need` is the medicine's `trial.weeks` (default 6). The trial is adequate only after `need` weeks **at** the optimised dose, or at the maximum (or target) dose, not from the first dose (NICE NG87 1.7.8, 1.7.12–1.7.13). The clock (`doseDate`, `weeksAtDose`) starts at the first current review that reached that dose with no act or urgent flag (unless overridden), when no later review is lower or decided to reduce.
- `T.reviewFlags(a, reviewId)` -> `[{level: 'urgent'|'act'|'watch', text, do, src}]`, most urgent first. "On 2 occasions" compares with the last earlier review that has that measurement, so a phone review in between does not break it.
  - Urgent at any level: psychosis or mania (stop the medicine), and every side effect marked `urgent` in the data (liver injury, seizures, suicidal thoughts, chest pain or fainting on exertion); the item's own `action` is the "do". With older data that has no `se_suicidal` item, a mild `se_mood` report gives "act".
  - Heart rate over 120 on 2 occasions: act (one reading: watch). Blood pressure 180/120 or more at once: urgent.
  - Adults, compared with the baseline clinic reading: a rise of 15 mmHg systolic or 10 mmHg diastolic, or 140/90 or more when the baseline was below it, on 2 occasions: act (one reading: watch). A white-coat baseline (raised in clinic, normal on ABPM or HBPM) with no rise is watch only. These cut-offs are the tool's, labelled clinical practice.
  - Young people: `reviews.<id>.bpCentile` above the 95th centile on 2 occasions (or `gt95_sustained`; the baseline counts as the earlier occasion when no earlier review has a centile): act (one: watch). A systolic rise of 15 mmHg or more over the baseline on 2 reviews: act (clinical practice). Young people are referred to a paediatric hypertension specialist, not managed under NG136.
  - Weight down 5% or more from the baseline (an app number): watch. Troublesome side effects: act.
  `T.latestFlags(a)` -> the flags of the latest review.
- `T.nextDose(a)` -> `{dose, text, atMax, hold?, overMax?, stopped?, regimen?}`: a suggestion only, starting from the dose agreed at the current medicine's latest review (`newDose`, else `dose`). `hold: true` when: no age; stopped; the plan is blocked (including a product-level contraindication); the last review (of this medicine or any) has an urgent or act flag; a weight is needed; guanfacine has no SmPC maximum at this age and weight; the dose is above the atomoxetine ceiling or the maximum (`overMax`: "off-label: record the specialist reason, or reduce"); or the dose has reached `usualMax` (`usualMax: true`: "a specialist decision; record the reason before going higher"). Once `choice.overMaxReason` is recorded, the steps above `usualMax` are offered, up to `max`. It offers only doses the strengths can make in the chosen number of doses, and adds the guanfacine maintenance-range and 7 mg notes.
- `T.monitorPlan(a, today?)` -> `[{id, what, freq, due, last, overdue, specialistOnly, src}]` from `txMonitor[group]` (items filtered by `T.forAge` and `drugs`), with dates from `choice.startDate` and `schedule`/`months`. The item's `field` says where the last check is found: a review measure (`heightCm`, `weightKg`, `bp`) or a date kept in `treatment.monitor` (`needReviewDate`, `annualDate`). A `schedule` item is due at the next schedule point at least 30 days after the last check, then every `months`. `specialistOnly` items stay with the specialist team. It adds an `annual` row (from `monitor.annualDate`, else the start date, plus 12 months; `specialistOnly`) when the data has none.
- `T.sharedCarePlan(a, today?)` -> `T.monitorPlan` without the `specialistOnly` items: the checks the GP takes on under shared care (the annual review, a planned trial off medicine and the guanfacine "still needed?" review stay with the specialist team).
- `T.rxDose(a)` -> `{dose, from: 'rx'|'review'|'start'|'stop'|null, stopped, reason, review, warnings[]}`: the daily dose for the next prescription. After Stop (the latest decision of the current medicine): no dose. After Increase or Reduce with no `newDose`: no dose, and a reason that asks for the new dose (with a suggestion after Increase). After Switch: record the new medicine first. A dose typed for the prescription (`choice.rxDose`) wins only when `choice.rxDoseDate` is on or after the latest review; an undated typed dose is used, with a warning when it differs from the review. Otherwise the dose agreed at the latest review, else `choice.startDose`.
- `T.rxText(a)` -> `{lines[], checks: [{id, t, ok, optional, src}], qtyWords, quantity, warnings[], errors[], isCD, dose, perDay, doses, coveredDays, stopped}`. The dose comes from `T.rxDose`.
  - `errors` (level `'err'`, also listed in `warnings`) mean "do not sign": no age; stopped; contraindications and product blocks; the NG87 1.7.24 misuse block; a dose above the maximum (a warning instead when `choice.overMaxReason` is recorded) or above the atomoxetine 1.8 mg/kg ceiling; and timing that does not give one clear regimen ("When to take it" offers a choice, cannot be read, disagrees with `choice.perDay`, or gives a number of doses the product does not allow). Typed unequal doses (`choice.doses`) must add up to the daily dose and match the number of doses.
  - A dose that cannot be split equally is written as a larger morning dose, half tablets (scored products only) or 3 doses, and a warning says which. Each strength gets its own line and supply. Blank timing gives "each morning" (when the product is taken once each morning) or "once a day" plus a prompt; it never copies the product's "or" text.
  - A dose above `usualMax` (but within `max`) is a warning that asks for the reason (`choice.overMaxReason`). Liquid totals round up to whole ml. `coveredDays` comes from the supply days or the quantity. A controlled drug supply over 30 days without `choice.supplyReason` adds a reminder; controlled drugs also add the Schedule 2 warnings.
- `T.words(n)` -> a number in words (28 -> 'twenty-eight'; 52.5 -> 'fifty-two point five').
- Dates: `T.today()`, `T.addDays(iso, n)`, `T.addMonths(iso, n)` (clamps to the month end), `T.daysBetween(from, to)`.

Progress:
- `T.STEPS` = `['txplan', 'baseline', 'prescribe', 'titrate', 'monitor']`. `T.stepProgress(a, stepId)` -> `{done, of}` for those steps, null for any other id. Every step except `txplan` returns `{done: 0, of: 0}` (not applicable) when treatment is not applicable or the plan decision is non-drug support or referral. What counts:
  - `txplan`: the decision plus the plan items for this age, plus the 3 scope ticks when the decision is medication (only the decision when treatment is not applicable). A ticked item always counts; an item stored as `'na'` never counts; an unticked conditional item counts only when `T.planItemApplies(a, x)` is true. Its `when` key (or the built-in default for the id) decides: `oddcd` an oppositional or conduct verdict of co-occurring or uncertain; `medhelps` the latest review's effect is "some"; `nondrug` the plan is non-drug support, an earlier medicine did not work or was not tolerated, or medicine helps only partly; `baseline` the pre-treatment checks are complete; `medication` medicine is planned (the decision is not non-drug support only or a referral). Defaults: `tp_parenttrain` oddcd, `tp_cbt` medhelps, `tp_nondrug` and `tp_psych` nondrug, `tp_medcriteria` baseline, `tp_recheck` medication. Any other `when` value counts the item.
  - `baseline`: the rows behind `baselineVerdict` (`done`/`of`).
  - `prescribe`: medicine, product, start dose, start date and supply, then the counselling items and the non-optional prescription checks once a medicine is chosen.
  - `titrate`: at least one review of the current medicine, and its dose optimised (`T.medState`: no flag left to act on) or stopped.
  - `monitor`: shared care status and next review date, plus the transition plan for young people from age 13.

### AA.components
- `AA.components.questionnaire(tool, {answers, onAnswer(n, value), mode})` renders items + live score. The caller persists answers: in an assessment, `ctx.set('tools.' + tool.id + '.answers.' + n, value)` (value `null` -> pass `undefined` to delete).
- `AA.components.bands(tool)` band table; `AA.components.scoreBox(tool, result)`; `AA.components.redFlags(a)`.
- `AA.components.consistencyChecks(a)` -> the validity cross-checks (`[{label, text, status}]`; young people get their own set).
- `AA.components.assessmentReport` = `{build(a), text(model, title?), title(a)}`. `build` returns the report sections `[{title, blocks}]` with a `.title`; `title(a)` comes from the band's `reportTitle`, with "Adult ADHD assessment: draft report" for adults. Block types: `{p}`, `{list}`, `{kv: [[k, v]]}`, `{table: {head, rows}}`.
- `AA.components.treatmentReport(a)` -> report sections in the same model: Treatment plan, Pre-treatment checks, Medicine and prescription, Titration and reviews, Monitoring and shared care. Empty sections are left out; `[]` when nothing is recorded. The report inserts them after the conclusion and before the plan.
- `AA.components.treatPanel(panelEl, a, ctx)` draws the live panel on the treatment steps (the frame calls it instead of the assessment panel). It reads the medicine's state from `T.medState` (a Stopped badge after Stop) and shows the safety flags from the safety step.
- `AA.components.sharedCareLetter(a)` -> `{title, sections, foot}` (same block model), the shared care request to the GP; `AA.components.sharedCareLetter.text(model)` gives plain text. Its dose and prescription wording come from one source (`T.rxDose` / `T.rxText`). After Stop it says not to send a shared care request; it calls the dose optimised only when `T.medState` does (flags acted on, or a `flagOverride` reason recorded); its monitoring table is `T.sharedCarePlan` (no `specialistOnly` items).

### AA.shell
- `AA.shell.loadDemo(kind)` opens (or reuses) the demo patient: `'young'` loads `AA.data.demoYoung` (marked `demo: 'young'`), anything else `AA.data.demo` (marked `demo: true`). `AA.shell.hasDemo(kind)`. The child demo button shows only when `AA.data.demoYoung` exists.
- `AA.shell.isBlankDraft(a)`: a draft nobody has typed into (also checks `patient.young` and `treatment`).

## 4. The assessment record

`AA.assess.get(id)` returns:

```js
{
  id, clinicianId, createdAt, updatedAt, status: 'active'|'complete', step: '<step id>',
  demo?: true | 'young',                        // true = adult demo, 'young' = child demo (both truthy)
  patient: { ref, age, sex, gender, occupation, referrer, reason, date,
             referralNotes: '',                                     // under 6: the referral note (concerns, impact, support
                                                                    // tried, parent training offered, safeguarding)
             informants: {patient, partner, parent, sibling, teacher, other}, sources: {schoolReports, previousRecords},
             consent: bool, interpreter: bool, present: '',
             young: { school: '', year: '', sen: 'none'|'sen_support'|'ehcp'|null,
                      pr: '',                                         // who has parental responsibility
                      consentBasis: 'parent_assent'|'gillick'|'capacity_16'|'lacks_capacity_16'|null,
                                     // under 16: parent_assent (parent consents, child assents) or gillick;
                                     // 16-17: capacity_16 (capacity presumed) or lacks_capacity_16 (assessed as lacking
                                     // capacity: best-interests decision); an older record holding parent_assent at 16+
                                     // is read as lacks_capacity_16
                      assent: bool, seenAlone: bool, lac: bool,       // lac = looked-after child
                      socialWorker: '', schoolConsent: bool } },      // consent to contact the school
  tools: { <toolId>: { answers: { <itemN>: value }, notes,
                       result?: { score: '', cutoff: 'yes'|'no'|'unsure'|null,              // entered result of an information-only
                                  rater: 'parent'|'teacher'|'self'|'clinician', date: '', notes: '' } } },   // (licensed) tool
  risk: { <riskItemId>: true, reviewed: bool, notes, action },
  history: { <sectionId>: { checks: { <itemId>: true }, notes, none: bool }, mse: { notes } },   // mse = mental state observations
  symptoms: { <symptomId>: {
      adult: 'yes'|'no'|'unsure'|null, child: 'yes'|'no'|'unsure'|null,
      exA: { <exampleKey>: true }, exC: { <exampleKey>: true },   // ticked examples, key = "<ctx>.<index>"
      otherA: '', otherC: '',                                      // patient's own examples
      infA: 0|1|2|'na'|null, infC: 0|1|2|'na'|null,               // informant agreement
      by?: { parent: 'yes'|'no'|'unsure', teacher: ..., self: ... },   // young people: who reports it now (optional)
      notes: '', flags: { <ddxId>: true } } },                      // differential flags raised here
  supplement: { iaAdult, iaChild, hiAdult, hiChild },               // 'yes'|'no'|null (DIVA supplement question)
  onset: { always: 'yes'|'no'|null, ageOnset: '', before12: 'yes'|'no'|'unsure'|null, duration6m: 'yes'|'no'|null, notes,
           abruptReviewed: bool, abruptNote: '' },                // ages 6-11 with before12 'no': which differential explains
                                                                  // or excludes the sudden start (criterion E waits for it)
  impairment: { adult: { <domainId>: { sev: 0|1|2|3|null, ex: {<key>: true}, notes } }, child: { same } },
  collateral: { parent: 0|1|2|'na'|null, partner: ..., school: ..., who: {parent:'', partner:'', school:''},
                answers: { <questionKey>: true }, notes,
                self: '' },                                         // young person's own view (NICE NG87 1.3.6)
  ddx: { <condId>: { f: { <featureId>: true }, verdict: 'absent'|'comorbid'|'better'|'uncertain'|null, notes } },
  ddxProtocol?: { <checkId>: true },                                // differential protocol ticks (5.11)
  validity: { checks: { <id>: true }, concern: 'none'|'some'|'major'|null, notes },
  formulation: { decision: 'met'|'not-met'|'other-specified'|'deferred'|null, presentation, severity, remission: bool,
                 comorbid: '', notes, plan: { <planItemId>: true }, planNotes, reportReviewed: bool },
  treatment: { ... }                                                // below; {} on a new record
}
```

**Periods keep one meaning at every age.** `adult` always means the **current period (the last 6 months)** and
`child` always means **before age 12**: `symptoms.<id>.adult`/`.child`, `exA`/`exC`, `infA`/`infC`,
`impairment.adult`/`.child` and the supplement keys. For a child aged 6 to 11 the before-12 period is the current
period, so only `adult` is used and criterion B is judged from current symptoms plus the onset answers
(`onset.before12: 'no'` = not a long-standing pattern). Labels come from `D.periodLabel`. For young people `exA`
and `impairment.adult.<domain>.ex` hold keys from `examples.child` and `child.items`, because the child example
lists describe the current period.

Collateral for young people: `collateral.parent` is the parent or carer now, `collateral.school` the teacher or
school (`who.school` names them), `collateral.self` the young person's own view. For adults `parent` is a
retrospective account and `partner` is used; `partner` is not used for young people.

The treatment block (all fields optional; maps of previous medicines and reviews are keyed by `AA.util.uid()`,
never arrays; write with `ctx.set('treatment.choice.product', v)`, and `undefined` deletes):

```js
treatment: {
  plan: { decision: 'medication'|'nondrug'|'defer'|'refer'|null,
          steps: { <txPlanItemId>: true|'na' },                // done, or 'na' = not applicable (never counted)
          prefer: '', notes: '',
          team: { specialist: bool, competent: bool, supervised: bool } },   // pharmacist and prescriber scope gate
  baseline: { date: 'YYYY-MM-DD', sbp, dbp, pulse, heightCm, weightKg, cuff: '',
              repeat: { sbp, dbp, pulse },                         // second reading when the first is raised (adults)
              repeat3: { sbp, dbp, pulse },                        // third reading when the first two differ a lot (NG136 1.2.2)
              abpm: 'not_needed'|'normal'|'hypertensive'|null,     // adults: ABPM or HBPM result
              bpCentile: 'lt90'|'90to95'|'gt95_once'|'gt95_sustained'|null,   // young people: the clinician reads the centile chart
              bpChart: '',                                         // young people: which centile chart was used (NICE names none)
              hrNote: '',
              cardiac: { <txCardiacId>: 'yes'|'no' },              // NICE NG87 1.7.5 heart history (and the 1.7.4 ECG item)
              ecg: 'not_needed'|'normal'|'abnormal'|null, cardiology: 'not_needed'|'referred'|'cleared'|null,
              ci: { <txCautionId>: 'yes'|'no' },                   // contraindication and caution screen
              childPugh: 'A'|'B'|'C'|null,                         // asked only when ci.ci_hepatic is 'yes'
              meds: '', misuse: 'low'|'moderate'|'high'|null, misuseNotes: '',
              pregnancy: 'na'|'no'|'planning'|'pregnant'|'breastfeeding'|null, contraception: bool,
              driving: 'na'|'no'|'yes'|null, notes: '' },
  prior: { <uid>: { drug: '<txDrugId>', product: '<txProductId>'|'',
                    outcome: 'not_tolerated'|'no_response'|'partial'|'worked'|'stopped_other',
                    adequate: bool,                                // a 6-week trial AT an adequate (optimised or maximum) dose
                    weeks, weeksAtDose, maxDose, notes: '' } },    // weeks taken; weeks at that dose (from T.trial on a switch)
  choice: { drug, product, why: '', weightKg, startDose, times: '', startDate: 'YYYY-MM-DD',
            perDay,                                                // number of doses a day chosen (else read from times)
            doses: [mg, ...],                                      // optional unequal doses (immediate release), morning first
            rxDose, rxDoseDate: 'YYYY-MM-DD',                      // dose typed for this prescription (mg a day) and when;
                                                                   // used only if dated on or after the latest review
            overMaxReason: '',                                     // specialist reason for a dose above the maximum
            stimulantsUnsuitable: bool,                            // guanfacine licence condition (young people)
            supplyDays, quantity, supplyReason: '',                // reason for a controlled drug supply over 30 days
            counsel: { <txCounselId>: true }, rx: { <txRxCheckId>: true }, notes: '',
            continuing? },                                         // read by the engine if present (licence to continue)
  reviews: { <uid>: { date, drug: '<txDrugId>', product: '<txProductId>',   // the medicine this review belongs to
                      dose,                                        // mg a day taken up to this review
                      newDose,                                     // mg a day agreed at it (Increase, Reduce; prefilled for Stay)
                      sbp, dbp, pulse, weightKg, heightCm,
                      bpCentile: 'lt90'|'90to95'|'gt95_once'|'gt95_sustained'|null,   // young people
                      scale: '', scaleScore: '',
                      effect: 'none'|'some'|'good'|null, dayCover: '',
                      se: { <txSideEffectId>: 'none'|'mild'|'troublesome' },
                      decision: 'increase'|'stay'|'reduce'|'switch'|'stop'|'optimised'|null,
                      flagOverride: '',                            // reason to treat the dose as optimised despite act/urgent flags
                      notes } },
  monitor: { shared: 'not_yet'|'requested'|'agreed'|'declined'|'na'|null, gp: '', nextReview: 'YYYY-MM-DD',
             annual: { <annualId>: true }, annualDate: 'YYYY-MM-DD',   // date of the last annual review
             needReviewDate: 'YYYY-MM-DD',                         // last review of the continued need (txMonitor field)
             handback: { <handbackId>: true }, transition: bool, notes: '' }
}
```
Numbers (`sbp`, `dose`, `newDose`, `weightKg` and so on) are stored as numbers; doses are mg a day. Reviews saved by
older versions have no `drug`: `T.currentReviews` then uses their dates (section 3). Older records may hold the
combined safety item `ci.ci_cyp3a4`; the engine treats a yes there as a CYP3A4 inhibitor and warns.

## 5. Data schemas

All data files call `AA.add(collection, value)`. Arrays are appended in load order.
Ids: lowercase letters/digits/underscore only (no hyphens). Text is plain strings unless a field says HTML.
HTML fields are trusted authored content: use `<p>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, `<em>`, `<table>`, `<h3>`, `<h4>`, `<blockquote>`; no scripts, no inline styles, no images.

### 5.1 Symptom (`AA.add('symptoms', [ ... ])`, one file per symptom in `js/data/symptoms/`)

```js
{
  id: 'ia1',                    // ia1..ia9 (inattention, DSM-5-TR A1a..A1i), hi1..hi9 (A2a..A2i)
  dim: 'IA',                    // 'IA' | 'HI'
  codes: { dsm5: 'A1a', diva: 'A1', asrs: [1] },   // ASRS v1.1 item numbers that tap this symptom (may be [])
  title: 'Careless mistakes, misses details',      // short label
  criterion: 'Paraphrase of the DSM-5-TR criterion in plain words (not verbatim).',
  adultForm: 'How this shows in adults (DSM-5-TR adult wording paraphrased, e.g. restlessness may be only inner).',
  why: 'What underlies it (attention/executive function), 1-3 sentences.',
  ask: { adult: 'Main question to read aloud about the last 6 months.', child: 'The same question for age 5-12 (looking back).',
         parent: 'To the parent or carer of a child aged 6-11, present tense, last 6 months, compared with children their age.',
         teen: 'To the young person aged 12-17, present tense, last 6 months.',
         teacher: 'To the teacher: "Compared with others in the class..."' },
  rephrase: ['8-14 alternative wordings: plainer, for low literacy, for people who say "everyone does that", for non-native speakers, open questions'],
  examples: {
    adult: [ { ctx: 'work', label: 'Work', items: ['...', ...] }, ... ],   // 8-12 contexts, 70-110 items in total
    child: [ { ctx: 'school', label: 'Classroom and schoolwork', items: [...] }, ... ]  // 5-8 contexts, 40-60 items
  },
  probes: [ { k: 'frequency', label: 'How often', items: [...] }, ... ],  // keys: frequency, severity, pervasive, duration, peers, impact, compensation, onset; 4-8 items each
  informant: { partner: [...8-12], parent: [...8-12], school: [...5-8 things to look for in reports],
               teacher: [...5-8 things a teacher may say now, present tense] },
  counts: ['6-10 rules: when to score Present'],
  notCount: ['8-12 rules: when NOT to score present / common scoring errors'],
  anchors: [ { score: 'yes'|'unsure'|'no', quote: 'realistic patient answer', why: 'how to score it and why' } ],  // 6-9 calibration anchors (2-3 per score)
  mimics: [ { ddx: '<ddx id>', clue: 'what points to the alternative', ask: 'discriminating question' } ],   // 6-10
  special: { women: '', older: '', highIQ: '', sud: '', asd: '', culture: '',     // 1-3 sentences each
             young: '' },                // relative age in the year group, girls, masking, what is normal for the age
  refs: ['short source strings']
}
```
Which question the interview shows: adults `ask.adult` (current) and `ask.child` (before 12); band child (6-11)
`ask.parent` as the main question plus `ask.teacher`, current period only; teen and y17 `ask.teen` plus `ask.parent`
and `ask.teacher` now, and `ask.child` for before 12. For young people the current period ticks `examples.child`
(school, homework, home, play, activities; the `teen` group first from age 12), not `examples.adult`.
Adult contexts to choose from (use these `ctx` keys and labels): `work` Work, `study` Study and training, `home` Home and household, `admin` Paperwork and money, `relationships` Partner and family, `parenting` Parenting, `social` Friends and social life, `driving` Driving and travel, `digital` Phone, screens and online, `leisure` Leisure and hobbies, `health` Health and appointments, `conversation` Conversations and meetings, `inner` Inner experience.
Child contexts: `school` Classroom and schoolwork, `homework` Homework, `home` Home and family, `play` Play and friends, `activities` Clubs, sport and outings, `reports` What teachers and parents said, `teen` Secondary school (12-16, optional).
Example item style: a concrete, observable behaviour in the patient's world, written as something the clinician can ask about or tick ("Sends emails with the wrong attachment"), 4-16 words, no duplicates, no diagnosis words.
Example keys stored in the record are `"<ctx>.<index>"`, so never reorder items after release; append only.

### 5.2 Impairment, onset and collateral (`AA.add('impairment', {...})`)

```js
{
  severity: [ { v: 0, l: 'None', d: '...' }, { v: 1, l: 'Mild', d: '' }, { v: 2, l: 'Moderate', d: '' }, { v: 3, l: 'Severe', d: '' } ],
  domains: [ {
    id: 'work', label: 'Work and education',          // ids: work, relationships, social, leisure, selfimage, daily, safety
    why: '', 
    adult: { ask: [...6-10 questions], items: [...25-40 examples], anchors: { 0:'', 1:'', 2:'', 3:'' } },
    child: { ask: [...5-8], items: [...20-30], anchors: { 0:'', 1:'', 2:'', 3:'' } },
    young: { why: '', ask: [...6-10 present-tense questions to the parent or the young person], anchors: { 0:'', 1:'', 2:'', 3:'' } }
  } ],                                    // young people tick child.items; domain labels come from ageBands[band].impairmentLabels
  onset: { intro: '', ask: [...12-20], askYoung: [...], memoryAids: [...10-15], lateOnset: [...6-10 cautions], pitfalls: [...] },
  duration: { ask: [...4-6], askYoung: [...] },
  supplement: { ia: { adult: 'question', child: 'question', young: 'present tense' }, hi: { adult: '', child: '', young: '' } },
  collateral: {
    intro: '', introYoung: '',
    rating: [ { v: 0, l: 'None or little support', d: '' }, { v: 1, l: 'Some support', d: '' }, { v: 2, l: 'Clear support', d: '' } ],
    parent: { intro: '', questions: [ { k: 'p1', q: '...' }, ... 20-30 ] },        // adults: looking back
    partner: { intro: '', questions: [ { k: 'r1', q: '...' }, ... 15-25 ] },
    school: { intro: '', lookFor: [ ...15-25 phrases typical in school reports ], caution: [...] },
    parentNow: { intro: '', questions: [ { k: 'pn1', q: '...' }, ... 12-20 ] },    // young people: parent or carer now
    teacher: { intro: '', questions: [ { k: 't1', q: '...' }, ... 10-16 ] },
    youngSelf: { intro: '', questions: [ { k: 'ys1', q: '...' }, ... 6-10 ] },     // the young person's own view
    discrepancy: [ ...6-10 rules for handling disagreement ], discrepancyYoung: [...],
    noInformant: [ ...5-8 options when nobody is available ], noInformantYoung: [...],
    srcYoung: [...]
  }
}
```
Collateral question keys (`k`) are unique across `parent`, `partner`, `parentNow`, `teacher` and `youngSelf`,
because they share `collateral.answers`.

### 5.3 History and risk (`AA.add('history', [...])`, `AA.add('risk', {...})`)

```js
// history section
{ id: 'dev', title: 'Development and early life', why: '', prompts: [...8-15 questions],
  ages?: 'young'|'adult'|'all', bands?: ['teen', 'y17', 'adult'],          // filters (see below)
  titleYoung?: '', whyYoung?: '', promptsYoung?: [...present tense, to the parent or carer and the child or young person],
  items: [ { id: 'dev_preterm', t: 'Born preterm (< 37 weeks) or low birth weight', flag: 'adhd'|'ddx'|'risk'|'treat'|null, ddx: '<ddx id>'|null, note: '',
             ddxYoung?: '<ddx id>',          // the differential to link for young people when it differs from ddx
             ages?: 'young'|'adult'|'all', src?: '' } ] }
// section ids: presenting, dev, school, work, relationships, mental, substance, physical, meds, family, forensic, social, sleep, strengths
// risk
{ intro: '', items: [ { id: 'r_si', text: 'Current thoughts of ending life', short: 'Suicidal thoughts', level: 'urgent'|'high'|'note', action: '', ages?: '', src?: '' } ],
  actions: [...], ask: [...],
  introYoung: '', askYoung: [...], actionsYoung: [...], srcYoung: [...] }
```
Age filters used across history, risk, validity, plan and differentials: `ages: 'young'|'adult'|'all'` (missing =
all); `bands: [<ageBands id>, ...]` narrows further where a view supports it. Views filter with `D.young(a)`.
The treatment data (5.14) also uses `ageMin`/`ageMax`.

### 5.3b Validity indicators and plan items (`AA.add('validity', {...})`, `AA.add('plan', [...])`)

```js
AA.add('validity', {
  intro: '',
  indicators: [ { id: 'v_all18', t: 'Endorses almost every symptom at the highest frequency', w: 2, why: '', ages?: '', src?: '' } ],  // 12-20; w 1-3
  incentives: [ { id: 'v_exam', t: 'Seeking exam or workplace accommodations', why: '', ages?: '', src?: '' } ],                     // 6-10
  consistency: [ ...6-10 things to cross-check ], consistencyYoung: [...],
  tests: [ { name: 'CAARS 2 Inconsistency/Exaggeration indexes', what: '', note: '' } ],                      // embedded and stand-alone validity measures
  wording: [ ...5-8 example sentences for reports ], wordingYoung: [...],
  refs: [...]
});
AA.add('plan', [ { id: 'pl_psychoed', group: 'After diagnosis'|'Before any medication'|'Safety'|'Other needs'|'If ADHD not diagnosed'
                     |'Support for parents and carers'|'School and education',      // the last two for young people
                   t: 'Plan item text', src: 'NICE NG87 1.x.x', ages?: '', bands?: [...] } ]);
```
For young people the report step orders plan groups by the band's `planGroups`.

### 5.4 Tool (`AA.add('tools', [...])`)

```js
{
  id: 'phq9', abbr: 'PHQ-9', name: 'Patient Health Questionnaire-9',
  group: 'adhd-screen'|'adhd-childhood'|'adhd-impairment'|'adhd-interview'|'adhd-rating'|'mood'|'bipolar'|'anxiety'|'trauma'|'substance'|'autism'|'personality'|'psychosis'|'sleep'|'risk'|'cognition'|'child'|'objective'|'validity'|'other',
  stage: ['pre', 'comorbid'],     // pathway stage ids: referral, pre, interview, collateral, comorbid, risk, physical, diagnosis, followup
  who: 'Self-report', time: '2-3 min', ages: 'Adults', items_n: 9,
  ageMin: 18, ageMax: 120,        // required numbers: inclusive ages of the person assessed; 120 = no upper limit stated
  purpose: '', when: 'When and why in the assessment', how: 'How to administer',
  interactive: true,               // false when the licence does not allow reproducing items
  instructions: 'Stem shown above the items',
  options: [ { v: 0, l: 'Not at all' }, ... ],   // default options for every item
  items: [ { n: 1, t: 'Item text', opts?: [...], score?: {"<optionValue>": points}, part?: 'A'|'B'|'1'|'2'|'3', threshold?: 2, section?: 'Heading shown before this item', sub?: '' , unscored?: true } ],
  scoring: {
    method: 'sum'|'count'|'asrs18'|'wfirs'|'mdq'|'pcl5'|'triage',
    bands: [ { min: 0, max: 4, label: 'Minimal', sev: 0 }, ... ],   // sev 0 none, 1 mild, 2 moderate, 3 high
    cutoff: { value: 10, text: 'Probable major depression' },
    flags: [ { item: 9, min: 1, level: 'urgent', text: 'Thoughts of self-harm endorsed: assess risk today.' } ],
    subscales: [ { id: 'ia', label: 'Inattention', items: [1,2,3,4,7,8,9,10,11], cutoff?: n, bands?: [...] } ],
    partA: 4,                         // asrs18
    domains: [ { id, label, items } ], rule: { twos: 2, threes: 1 },   // wfirs
    part1: 7,                         // mdq
    clusters: { B: [...], C: [...], D: [...], E: [...] },               // pcl5
    levels: [ { label: 'High risk', sev: 3, any: [4,5,6], text: 'Action' } ]   // triage, checked in order
  },
  interpretation: ['...'], psychometrics: '...', pitfalls: ['...'], adhdNotes: 'Overlap with ADHD and how to read the result in an ADHD assessment',
  licence: 'Exact status', source: 'Citation', url: 'Official page', file: 'tools/<file>.pdf' | null
}
```
Option values are numbers; WFIRS uses `'na'` for not applicable. Yes/No items use `[{v:1,l:'Yes'},{v:0,l:'No'}]`.
For keyed items (AQ-10, DAST-10 reverse item) use `score: {"1": 0, "0": 1}` or options that already carry the scored value.
Young people: the screening and co-occurring steps list the band's tools (`D.stepTools`) and hide tools outside
`ageMin`/`ageMax`. An information-only tool (`interactive: false`) gets a result form that saves
`tools.<id>.result` (score, cut-off met, rater, date, notes); `D.toolDone` counts it as recorded.

### 5.5 Differential (`AA.add('ddx', [...])`)

```js
{
  id: 'dep', name: 'Depression (major depressive disorder)', group: 'mood'|'anxiety'|'trauma'|'personality'|'neurodevelopmental'|'substance'|'psychosis'|'sleep'|'medical'|'cognitive'|'other',
  core: true,                      // must be reviewed in every adult assessment (young people: ageBands[band].ddxCore instead)
  ages: 'young'|'adult'|'all',     // optional filter (missing = all); the ddx-young.js conditions are 'young';
                                   // burnout, aspd, menopause and mci are 'adult'
  icd11: '6A70-6A71', summary: '2-3 sentences', prevalence: 'In adults with ADHD ... (source)',
  coexist: 'yes'|'no'|'sometimes', coexistNote: '',
  overlap: [...5-10], favoursADHD: [...5-10], favoursAlt: [...6-12],
  ask: [...12-20 discriminating questions],
  features: [ { id: 'dep_f1', t: 'Clear episode(s) that were a change from the usual self', w: 3 } ],  // 8-14; w 1-3 = weight towards the alternative
  screen: ['phq9'],                // tool ids
  investigations: [...], redFlags: [...],
  decide: { better: 'When the alternative better explains the picture', both: 'When to diagnose both', next: 'What to do next' },
  pearls: [...4-8], refs: [...]
}
```
Symptom `mimics[].ddx` must use these ids. Planned ids: dep, pdd, bip, cyclo, gad, social, panic, ptsd, cptsd, ocd, bpd, aspd, asd, sld, idd, dcd, tics, sud_cannabis, sud_alcohol, sud_stim, gambling, gaming, psychosis, osa, insomnia, dsps, narcolepsy, rls, thyroid, anaemia, epilepsy, tbi, sensory, meds, menopause, postviral, mci, burnout, gifted, normal, feigning, eating.
Young people (`js/data/ddx-young.js`): odd (oppositional defiant disorder), conduct, attach (attachment difficulties and developmental trauma), dld (developmental language disorder), fasd, relage (relative age and developmental immaturity), env (family or school environment), osa_child (obstructive sleep-disordered breathing in children: in the child and teen core lists; the snoring, unrefreshed-sleep and sleep-apnoea history items link to it for under-18s), sepanx (separation anxiety disorder).

### 5.6 Pathway, criteria, glossary

```js
AA.add('pathway', [ { id: 'pre', n: 2, title: '', what: [...], who: '', tools: ['asrs18'], tips: [...], sources: [...] } ]);
AA.add('guidelines', [ { id: 'ng87', name: '', org: '', year: '', scope: '', keyPoints: [...], assessment: [...], url: '' } ]);
AA.add('criteria', { dsm5: { intro, A: {...}, B, C, D, E, presentations, specifiers }, icd11: {...}, diva2: {...}, changes: [...] });
AA.add('glossary', [ { term: '', def: '' } ]);
```

### 5.7 Learning modules (`AA.add('learn', [...])`)

```js
{ id: 'm1', n: 1, title: '', minutes: 20, summary: '', objectives: [...],
  sections: [ { h: 'Heading', html: '<p>...</p>' } ],     // rich, practical teaching content
  keyPoints: [...], pitfalls: [...],
  quiz: [ { q: '', options: ['', '', '', ''], a: 1, why: '' } ],   // 8-12 questions; a = index of correct option; vary the position
  refs: [...] }
```

### 5.8 Cases (`AA.add('cases', [...])`)

```js
{ id: 'c1', title: '', patient: '29-year-old software tester', tags: [...], difficulty: 1|2|3,
  referral: '', stages: [ { title: '', html: '<p>...</p>', q?: { q: '', options: [...], a: 0, why: '' } } ],
  profile: { adultIA: 7, adultHI: 3, childIA: 6, childHI: 2, impairment: '...' },
  answer: { conclusion: '', codes: '', ddx: [...], teaching: [...] } }
```

### 5.9 Step guide (`AA.add('stepGuide', { <stepId>: {...} })`) - js/data/step-guide.js

Shown at the top of every assessment step ("What to do in this step").
```js
{ setup: { goal: 'One sentence: what this step achieves', time: '10 minutes',
           do: ['5-9 ordered actions, imperative'], say: ['2-5 lines the clinician can say to the patient'],
           watch: ['3-6 pitfalls / watch-outs'], done: ['2-4 "you are done when" checks'],
           next: 'What happens next and why', src: ['sources'] }, ... }   // all 18 step ids
```
`step-guide.js` holds the 13 assessment steps; `tx-guide.js` adds `txplan`, `baseline`, `prescribe`, `titrate`
and `monitor` (written for adults and young people). Sources go only in `src`, which the frame shows in a closed
"Sources" disclosure. For young people the frame uses `stepGuideYoung[step]` (5.13) when it exists.

### 5.10 Pre-appointment forms guide (`AA.add('formsGuide', {...})`) - js/data/forms-guide.js

Teaches what each pre-appointment form is, why it is sent, how to read and weigh it.
```js
{ intro: '<p>html</p>', principles: ['...'],
  forms: [ { id: 'asrs18', tool: 'asrs18'|null, title: '', kind: 'self'|'informant'|'records'|'history',
             what: '<p>html</p>', recommendedBy: ['NICE NG87 (rating scales as adjunct)', 'UKAAN', 'CADDRA'],
             whenSent: '', who: '', time: '',
             howToRead: '<ol><li>step-by-step</li></ol>',
             meaning: [ { result: 'Part A: 4 or more in the shaded boxes', means: '', action: '' } ],
             example: { html: '<p>worked example with real numbers</p>', takeaway: '' },
             pitfalls: ['...'], feedsInto: 'Which assessment step uses it and how', strength: 'one-line evidence summary' } ] }
```

### 5.11 Differential diagnosis protocol (`AA.add('ddxProtocol', {...})`) - js/data/ddx-protocol.js

A systematic, step-by-step method so no differential is missed.
```js
{ intro: '<p>html</p>', principles: ['...'],
  steps: [ { id: 'p1', n: 1, title: 'Build the life-course timeline', goal: '',
             do: ['...'], ask: ['questions'], tools: ['tool ids'], conds: ['ddx ids'],
             decide: ['decision rules'], redFlags: ['...'],
             checks: [ { id: 'p1_c1', t: 'Checklist item the clinician ticks' } ] } ],   // 10-14 steps, ids p1.., check ids <stepId>_c<n>
  final: { rules: ['how to reach the verdict for each condition'], documentation: ['what to write'] },
  refs: ['...'] }
```
Ticks are stored per assessment in `ddxProtocol.<checkId> = true` (assessment record) and, in the guide page, in `AA.progress` `sandbox.ddxProtocol`.

### 5.12 Age bands (`AA.add('ageBands', {...})`) - js/data/age-bands.js

One entry per band id: `under6`, `child` (6-11), `teen` (12-16), `y17` (17), `adult` (18 and over, or age missing).
Read a band with `AA.diagnosis.bandInfo(a)`; views must cope when a field is missing.
```js
{ child: { label: 'Child (6 to 11)', short: 'Child', noun: 'child', ageMin: 6, ageMax: 11,
           periods: ['adult'] | ['adult', 'child'],                    // record periods in use (section 4)
           periodLabels: { adult: 'Now (last 6 months)', child: 'Before age 12' },
           informants: ['parent', 'school', 'self'],                   // collateral sources shown
           screen: ['<toolId>'], screenCore: [], comorbid: [...], comorbidCore: [],   // tool ids; young bands have empty core lists,
                                                                       // so the step counts as done once any listed tool has a result
           ddxCore: ['<ddxId>', ...],                                  // differentials that must be reviewed (criterion E)
           impairmentLabels: { work: 'School and learning', relationships: 'Family and home', ... },   // labels for the 7 domain ids
           consent: 'parent_assent'|'gillick_or_parent'|'capacity_16'|'adult', consentText: '',
           reportTitle: 'ADHD assessment (child, 6–11): draft report',
           planGroups: ['Safety', 'After diagnosis', ...],             // order of plan groups in the report
           note: 'one-line banner for the setup step', src: [...] },
  under6: { label: 'Under 6', short, noun, ageMin: 0, ageMax: 5, stop: true,
            note: 'Refer to a service with expertise in ADHD in young children...', reportTitle, planGroups, src: [...] } }
```
The adult band repeats `D.STEP_TOOLS` and the adult `core` set; the engine still uses its own lists for adults.
Consent (`consentText`, `patient.young.consentBasis`): under 16, Gillick competence, or consent from a person with
parental responsibility plus the child's assent (Scotland: Age of Legal Capacity (Scotland) Act 1991 s2(4)); from 16,
the young person's own consent with presumed capacity (Mental Capacity Act 2005; Family Law Reform Act 1969 s8 in
England and Wales; Age of Legal Capacity (Scotland) Act 1991 s1; Age of Majority Act (Northern Ireland) 1969). A
16- or 17-year-old assessed as lacking capacity for the decision is recorded as `lacks_capacity_16`: a best-interests
decision under the MCA 2005 or with a person with parental responsibility (Scotland: Adults with Incapacity
(Scotland) Act 2000), never "assent". The Fraser guidelines cover contraception and sexual health only and are never used here.

### 5.13 Step guide for young people (`AA.add('stepGuideYoung', {...})`) - js/data/step-guide-young.js

Same shape as `stepGuide` (5.9), for the 13 assessment steps, written for the parent or carer, the teacher and the
child or young person. There are no young entries for the treatment steps: `tx-guide.js` covers both age groups.

### 5.14 Treatment data - js/data/tx-products.js, js/data/tx-pathway.js

Read by `AA.treatment` and `js/views/assess-treat.js`. Ids are stored in records: never rename or reuse one; add new
items at the end. Every clinical line has a `src` (or "Clinical practice"). Keep the SmPC maximum (`dose.*.max`)
and the BNF/BNFC off-label ceiling (`bnf`) apart. Optional filters on list items, read with `T.forAge`:
`ages: 'young'|'adult'|'all'`, `ageMin`, `ageMax` (years, inclusive) and `bands`; `drugs: [<drugId>]` limits
counselling and monitoring items to a medicine. `hist: [<history item id>]` pre-fills "yes" (shown "From
history") until the clinician answers; `risk: [<safety-step item id>]` (txCautions) does the same from the safety step
(shown "From the safety step"). Mark immediate-release products `ir: true` (the engine uses the flag before the
release text) and rate `diversionLower` where a source supports it.
```js
AA.add('txDrugs', [ { id: 'mph'|'lisdex'|'dex'|'atx'|'gxr', name: 'Methylphenidate', cls: 'Stimulant',
   cd: 'Schedule 2 controlled drug (CD2 POM)', isCD: true,
   licence: { child: '', adult: '' },
   ci: ['<txCautionId>'], caution: ['<txCautionId>'],                 // contraindications and cautions for this drug
   interactions: [ { t: '', level: 'ci'|'caution', src: '' } ],
   se: ['<txSideEffectId>'],                                           // asked about at reviews
   trial: { weeks: 6, note: '' }, pregnancy: '', breastfeeding: '', notes: [...], src: [...] } ]);

AA.add('txProducts', [ { id: 'concerta', drug: 'mph', name: 'Concerta XL', form: 'Prolonged-release tablet',
   release: '', ir: false, ratio: '22:78', lasts: 'about 12 hours', strengths: [18, 27, 36, 54], unit: 'mg', scored?: true,
   licensed: { child: true, adultStart: true, adultContinue: true,   // child = 6-17
               conditions?: { child: 'mph_inadequate'|'stim_unsuitable'|null, adult: 'childhood_symptoms'|null } },
               // conditions: overrides the engine's default SmPC 4.1 licence condition for the medicine (section 3)
   licenceText: '',
   ci?: ['<txCautionId>'],                                          // product-only contraindications, on top of the drug's
                                                                     // (Medikinet XL, Ambinet XL: ci_acidsuppress); a yes blocks it
   perDayOptions?: [1, 2],                                            // extra allowed numbers of doses a day
   dose: { child: { start, step, every: 'week', max, usualMax?, perDay, note }, adult: { ... } },  // mg a day
     // usualMax: the usual maximum when the SmPC allows max only in rare cases (dexamfetamine: usualMax 20, max 40);
     //   the ladder and the next-dose suggestion stop at usualMax
     // step: a number, or [low, high] when the SmPC gives a range (for example [5, 10]); target?: a fixed next dose
     // maxMgPerKg?: a per-kg ceiling below max (Medikinet XL adults: 1 mg/kg and 80 mg)
     // atomoxetine child: { mgPerKg: { start, target }, overKg: 70, overStart, overTarget, max, perDay, every, note }
     //   (no fixed maximum under 70 kg); atomoxetine adult: { start: 40, target: 80, max: 100 }
     // guanfacine child: { start, step, every, targetMgPerKg: [low, high], maxTable: [ { ageMin, ageMax, kgMin, kgMax?, kgBelow?, max, note? } ], note }
     //   (weight bands are contiguous: a row ends at kgBelow, else at the next row's kgMin for the same ages, else at kgMax)
   bnf: { child: '... (off-label)', adult: '... (off-label)' }, bnfMax?: { child: n, adult: n },   // numeric ceiling, else read from bnf
   take: '', food: '', open: false, openHow: '', swallowWhole: true, shell: true,
   group: 'concerta22'|'ritxl5050'|null, groupNote: '',                // SPS bioequivalence group; null when not
                                                                     // confirmed (kixel, ambinet, addepta, tuzulby)
   misuse: '', diversionLower: true|false|undefined,                   // undefined = not rated: a caution, not a block
   fromIR: '', missed: '', older: '', excipients: '', formRx: '', strengthText: '', brandNote: '', notes: [...], src: [...] } ]);

AA.add('txSequence', { young: [ { n: 1, drugs: ['mph'], when: '', clause: '1.7.7', src: '' }, ...,
                                { n: 5, drugs: [], action: 'tertiary', when: '', clause: '1.7.16', src: '' } ],
                       adult: [ ... ] });   // NICE order; the engine finds the adult first step by 1.7.11 and the switch step by 1.7.12 or 1.7.13 in `clause`
AA.add('txPlanItems', [ { id: 'tp_info', ages: 'all', group: 'Before medication'|'Non-drug support'|'If medication helps but problems remain', t: '', src: '',
   conditional?: true, when?: 'oddcd'|'medhelps'|'nondrug'|'baseline'|'medication' } ]);   // counted only when it applies (T.planItemApplies)
AA.add('txCardiac', [ { id: 'cx_chd', t: '', ask: '', askYoung: '', hist: [...], action: 'cardiology'|'ecg', src: '' } ]);   // NICE NG87 1.7.5 list; 1.7.4 ECG item
AA.add('txCautions', [ { id: 'ci_glaucoma', group: 'Eyes and hormones', t: '', ask: '', hist: [...], risk?: [...], src: '' } ]);
AA.add('txSideEffects', [ { id: 'se_appetite', t: '', ask: '', action: 'what to do', urgent?: true, src: '' } ]);   // urgent: any report, even mild, is an urgent flag
AA.add('txCounsel', [ { id: 'cs_cd', drugs: ['mph', 'lisdex', 'dex'] | 'all', t: 'What to tell the person', src: '' } ]);
AA.add('txRxChecks', [ { id: 'rx_qty_words', cd: true, optional?: true, t: '', src: '' } ]);   // cd: Schedule 2 only
AA.add('txMonitor', {
  young: [ { id: 'mn_height', what: '', freq: '', months: 6, schedule?: [3, 6], src: '',
             field?: 'heightCm'|'weightKg'|'bp'|'needReviewDate'|'annualDate',   // a review measure, or a date in treatment.monitor
             specialistOnly?: true } ],                                     // kept by the specialist team, not in the GP table
  adult: [ ... ],
  actions: [ { id: 'ac_hr', ages: '', t: 'threshold', do: 'what to do', src: '' } ],   // during treatment (NICE NG87 1.8)
  annual: [ { id: 'an_pref', area: 1, t: '', src: '' } ],             // the 8 NICE annual review areas (1.10), plus decide and record
  handback: [...], sharedCareContents: [...], sharedCareProcess: [...], transition: [...]   // { id, t, src }
});
```
`tx-guide.js` adds the five treatment step guides to `stepGuide` (5.9).

Ids added in the October 2026 safety review (records may hold them; never rename them):
- Plan items: `tp_recheck` (the diagnosis and the need for treatment re-checked before starting, NICE NG87 1.7.4;
  `when: 'medication'`; the treatment plan view asks for confirmation when `T.diagnosisCheck` lists issues) and
  `tp_diet_adult` (`tp_diet` is now for young people only).
- Heart history: `cx_known` (a known heart condition; pre-filled from the history's "other heart condition" item).
- Safety screen: `ci_cyp3a4_inh` (moderate or strong CYP3A4 inhibitor) and `ci_cyp3a4_ind` (strong inducer) replace
  `ci_cyp3a4`, which is no longer in the data (the engine still reads it in older records); `ci_acidsuppress`
  (acid-suppressing medicine: a product-level block on Medikinet XL and Ambinet XL); `ci_glaucoma_narrow` (the
  atomoxetine contraindication; `ci_glaucoma` is any glaucoma). `ci_hepatic` 'yes' brings up `baseline.childPugh`.
- Side effects: `se_suicidal` (suicidal thoughts or self-harm) and `se_chest` (chest pain, fainting or breathlessness
  on exertion) are split out of `se_mood` (now low mood and irritability) and `se_cv` (now raised pulse or blood
  pressure and palpitations). These two, `se_liver`, `se_seizure` and `se_psychosis` are `urgent`.
- Counselling: `cs_alcohol_dex` (dexamfetamine: avoid alcohol); `cs_alcohol_amf` is now lisdexamfetamine only.
- Products: `kixel` (Kixel XL), `ambinet` (Ambinet XL), `addepta` (Addepta XL) and `tuzulby` (Tuzulby), each with
  `group: null` until SPS bioequivalence is confirmed. Dexamfetamine tablets and oral solution carry `usualMax: 20`
  with `max: 40`.
- Monitoring: `mn_gxr_need` (`field: 'needReviewDate'`) and `mn_trialoff` (`field: 'annualDate'`) are `specialistOnly`.

### 5.15 Demo patients (`AA.add('demo', {...})`, `AA.add('demoYoung', {...})`) - js/data/demo.js

A partial assessment record (section 4) without `id` and `clinicianId`. `AA.shell.loadDemo` copies it into a new
record. `demo` is a 34-year-old adult and `demoYoung` an 8-year-old (band child, so only the current-period keys
are filled); both run to a diagnosis and carry a treatment record (plan, pre-treatment checks, prescription,
reviews and monitoring; no previous medicines), so every step has something to show. The app shows the child demo button only when
`demoYoung` exists. `tests/run.js` checks both demos' symptom, differential, tool and product ids and that both
reach "criteria met".

Keep the demos complete when the treatment data changes: every heart and safety-screen item answered (a new item
in `txCardiac` or `txCautions` needs an answer in both), every plan item that applies ticked (including
`tp_recheck`), reviews tagged with `drug` and `product`, a `newDose` on each Increase review, the side effects of
the medicine's `se` list recorded at each review, and `bpCentile` on the child's reviews (`baseline.bpChart` names
the chart). Then `T.baselineVerdict` is `ok` for both, `T.rxText` has no errors, and every treatment step is
complete except the child's titration, which is still in progress at 36 mg.

## 6. Views and routes

| Route | File | Purpose |
|---|---|---|
| `signin`, `home`, `new`, `about` | shell.js | profiles, dashboard (adult and child demo), new assessment, privacy and data |
| `assess`, `assess-<id>-<step>[-<sub>]` | assess-frame.js | assessment workspace: all 18 steps, steps from assess-steps-a.js, assess-interview.js, assess-steps-b.js and assess-treat.js |
| `tools`, `tool-<id>`, `pathway` | library.js | instrument library, practice scoring, pathway and guidelines |
| `learn`, `module-<id>`, `quiz-<id>`, `exam`, `cases`, `case-<id>`, `glossary` | learn.js | training |
| `ddx`, `cond-<id>`, `criteria`, `bank`, `sym-<id>` | reference.js | interview aids |
| `forms`, `form-<id>`, `ddxguide` | guides.js | pre-appointment forms guide, differential diagnosis protocol; also `AA.components.ddxProtocol(opts)` |

### Assessment steps
`AA.STEP_LIST` (assess-frame.js) defines the order, titles and phase of the 18 steps. `AA.STEP_PHASES` lists the
phases in order: `{id, label}`.

| Phase (`phase`) | Steps (`id`: title) | View file |
|---|---|---|
| Prepare (`prepare`) | `setup` Before you start, `screen` Screening questionnaires, `risk` Safety and risk, `history` Clinical history, `comorbid` Co-occurring conditions screen | assess-steps-a.js |
| Interview (`interview`) | `ia` Interview part 1: inattention, `hi` Interview part 2: hyperactivity-impulsivity, `onset` Onset and impairment, `collateral` Collateral information | assess-interview.js |
| Diagnose (`diagnose`) | `ddx` Differential diagnosis, `validity` Symptom validity and consistency, `summary` Scoring and diagnosis | assess-steps-b.js |
| Treat (`treat`) | `txplan` Treatment plan, `baseline` Pre-treatment checks, `prescribe` Choose and prescribe, `titrate` Titration and reviews, `monitor` Monitoring and shared care | assess-treat.js |
| Report (`report`) | `report` Report and next steps | assess-steps-b.js |

Each entry is `{ id, title, short, lead, phase }`. A step file registers `AA.steps.<id> = { render: function (el, ctx) { ...; return cleanup? } }`.
`ctx`: `{ id, step, sub, meta, a(), get(rel, fb), set(rel, value), go(step, sub), onChange(rel, fn) }` (`meta` is the STEP_LIST entry).
The frame already renders the page heading ("Step N of 18", plus the band label for young people), the step strip
(one scrolling row with a small phase label before the first chip of each phase), the step guide, the live panel and
previous/next buttons: a step renders only its own content into `el`.
`ctx.onChange` subscriptions are removed automatically when the step is left.
The interview steps use `sub` for the current symptom (`assess-<id>-ia-ia3`).
An unknown step id in a route or in `a.step` falls back to `setup`.

The frame by age and phase:
- Young people: the step guide comes from `stepGuideYoung` when it has the step; some leads change wording; the
  panel shows "Now" and "Before 12" (only "Now" for ages 6 to 11).
- Under 6: the workspace does not assess or treat; it records a referral. Only three steps render:
  - `setup`: the stop card (refer) and the referral details: reference, referrer, date, who has parental
    responsibility, reason, referral notes (`patient.referralNotes`), who gave information and consent to the referral;
  - `risk`: the young-person safety and safeguarding items;
  - `report`: a short referral note (identifying details, reason, referral notes, information and consent, safety
    and safeguarding, and NICE's advice for under-5s and 5-year-olds), with no symptom, impairment, differential,
    treatment or plan sections.
  Every other step shows only the "Under 6: refer, do not assess here" warning, with no step guide. The live panel is
  a single "Under 6: refer" panel listing what the referral still needs. `T.applicable` returns `under6` and the
  treatment steps render nothing.
- Treat steps: the live panel is `AA.components.treatPanel`; a step whose progress is `{of: 0}` shows a dash and
  "not applicable yet". The steps from `baseline` to `monitor` apply once the summary decision is "met" or "other
  specified" and the treatment plan decision is not "non-drug support only" or "refer"; until then `txplan`
  explains why and what to do instead. The treatment views show the engine's safeguards rather than repeat them:
  `T.applicable().caution` for other-specified ADHD, `T.diagnosisCheck` issues on the treatment plan and
  prescribing steps (ticking `tp_recheck` asks for confirmation while issues remain), the prescriber-scope warning
  wherever a medicine is planned or chosen, `rxText().errors` as a red "Do not sign yet" note, and the reasons a
  dose increase is held.

## 7. Shared CSS classes (css/app.css)

Layout: `.section`, `.stack`, `.row`, `.grid` (auto cards), `.grid-2`, `.card`, `.card-raised`, `.card-link`, `.card-meta`, `.card-foot`, `.page-head`, `.eyebrow`, `.lead`, `.muted`, `.hint`, `.source`, `.sep`.
Controls: `.btn` + `.btn-primary|-ghost|-quiet|-danger|-sm`, `.seg`, `.check`, `.field`, `.form-grid`, `.search`.
Status: `.badge-*`, `.pill-*`, `.callout-*`, `.meter`, `.empty`.
Content: `.prose`, `.list`, `.table-wrap` + `.table`, `.kv`, `.disclosure`, `.tabs`, `.chip-list` + `.chip`.
Assessment: `.ws`, `.ws-main`, `.ws-panel`, `.panel`, `.panel-fold`, `.stepper` (phase labels: `.stepper li.step-phase`), `.step-nav`, `.sx-ask`, `.sx-ask-sub`, `.sx-score`, `.ex-group`, `.ex-list`, `.flag-row`, `.report`, `.guide-src` (closed Sources disclosure).
Questionnaire: `.q-*` (owned by questionnaire.js).

## 8. Content rules

- Clinical accuracy first. Use the research briefs; never invent clause numbers, cut-offs, psychometrics or quotes. If not from a named source, label it "Clinical practice".
- Paraphrase DSM-5-TR and ICD-11 wording; do not reproduce criteria verbatim beyond short phrases.
- DIVA: the app follows DIVA's structure (adult then childhood, examples, supplement question, onset, impairment in five areas, collateral 0/1/2 rating) but all question and example wording is original. Do not copy the DIVA 2.0 or DIVA-5 example lists.
- Licensed instruments (DIVA-5, Young DIVA-5, CAARS 2, BAARS-IV, Conners 4, BRIEF-A, Brown EF/A, CAADID, Epworth, ISI, SDQ ...) are described and linked, with `interactive: false` and empty `items`. Their results can be entered (`tools.<id>.result`).
- Treatment facts (doses, licences, the NICE order, controlled drug rules, monitoring) come from the SmPCs on emc, NICE NG87 and the other named sources, and match the main course. Never invent a dose, a cut-off or a clause number; where a fact is not confirmed, send the prescriber to the SmPC or BNF.
- Sources sit in one closed "Sources" disclosure at the end of a card or step (`.guide-src`), not as clause numbers in brackets inside sentences.
- Scope: diagnosing ADHD (NICE NG87 1.3.1) and starting ADHD medicine (1.7.2) belong to a professional with training and expertise in ADHD. The treatment plan step asks a pharmacist or other non-medical prescriber to confirm they work inside a specialist ADHD team, are competent for this medicine and age group, and have agreed supervision. Never hide this.
- UK English, plain words, short sentences, inclusive (partner not husband/wife; they/them for unnamed people).

## 9. Testing

- `node tests/run.js` runs the engine unit tests and validates every data file against these schemas (ids unique, required fields, cross-references such as `mimics[].ddx`, `screen[]` tool ids, quiz answer indexes). It loads the files in the order of the `<script>` tags in `index.html` (ignoring `?v=`). The data checks include: step guides for all 18 steps, `stepGuideYoung` entries, `ageBands` tool and ddx ids, numeric `ageMin`/`ageMax` on every tool, `ages` values, collateral keys unique across all question sets, treatment ids and cross-references (drug cautions and side effects, product drugs, `hist` ids, counselling drugs), and a dose plan for every product at ages 9, 15 and 30. `node tests/run.js --data` runs only the data checks.
- `tests/young-tests.js` (called by run.js): age bands at the edges (5, 6, 11, 12, 16, 17, 18, missing), the symptom threshold, periods and labels, band tool lists, criterion B for ages 6 to 11 (and before 12 for teenagers; a sudden start keeps B met and holds E until it is reviewed), criterion C by settings for young people, the setup consent basis, impairment labels, collateral keys and `agreement`, criterion E with the band's core list, confidence, the DIVA 2.0 view, band-aware step progress (interview, onset, history sections by age), behaviour without band data, `toolDone` and the hand-over to `AA.treatment.stepProgress`.
- `tests/tx-tests.js` (called by run.js): group and age edges, applicability, `bpCheck` (adult 139/89, 140/90, 180/120, the lower of two readings, and young centiles), `baselineVerdict` with a 1.7.5 item, `cautionsFor`, `options` after earlier medicines, products and licences (Matoride XL not to start in adults), `dosePlan` (Concerta XL child and adult, atomoxetine by weight, guanfacine maximum by age and weight), `words`, `rxText` (including half tablets and the `ir` flag), `reviewFlags` (heart rate over 120 twice, urgent side effects), `nextDose`, `trial`, `monitorPlan`, `stepProgress` (including not applicable), `T.forAge` and the item lists the counts use, the pregnancy question, and missing data never throwing. It also
  covers the October 2026 safety review, one or more checks per finding: dose ceilings (guanfacine weight bands and
  no-maximum holds, the atomoxetine 1.8 mg/kg ceiling and exactly 70 kg, kidney, liver and CYP adjustments, BNF
  ceilings for unlicensed ages, doses above the maximum, Medikinet XL by weight), regimens that cannot be split
  equally, the timing rules in `rxText`, no numbers without an age, licence conditions, the trial clock at the
  optimised dose, blood pressure flags against the baseline and by centile, conditional and `'na'` plan items, the
  NICE sequence after intolerance, other-specified ADHD, the current medicine's reviews after a switch, `rxDose`
  after Stop, Increase and Reduce, `medState` with flags and overrides, `diagnosisCheck`, and safety-step pre-fill
  (`fromRisk`). Both suites export `function (ctx)` with `ctx = { AA, ok(cond, msg), eq(actual, expected, msg) }`, build their own synthetic data and restore `AA.data` afterwards. Add tests there when you change engine logic.
- `tests/dev.html` runs the app on `tests/fixtures/data.js` (small, schema-complete fixture data) instead of `js/data/*`, with the same CSS, core, engine and view files as `index.html` (`../` paths). Treatment data, age bands and the child demo are not in the fixtures, so the treatment steps show "Treatment data not loaded" there and young records use the engine's fallbacks.
- `node tests/smoke.js [--dev]` (needs Playwright): serves the folder, signs in with the adult demo, visits every route and step at desktop and phone width, and fails on console or page errors, render failures and horizontal overflow.
- Browser check: serve the folder (`python3 -m http.server`) and open `index.html`; there must be no console errors on any route. Check an adult, a child (6 to 11, or the child demo), a teenager (12 to 16), a 17-year-old and an under-6 record, at phone width too.
- Single file: `node scripts/bundle.js <out.html> [--fragment]` inlines every `css/` stylesheet and `js/` script that `index.html` lists (it strips `?v=`), so a new file is bundled once it is in `index.html`; it warns about any missing file.
