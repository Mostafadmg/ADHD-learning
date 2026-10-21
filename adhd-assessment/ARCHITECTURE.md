# ADHD Assessment: architecture and contracts

This file is the contract between the core, the content (data files) and the views.
Read it fully before adding or changing anything.

## 1. Principles

- **Vanilla JavaScript, no build step, no framework.** Plain `<script>` tags in a fixed order (see `index.html`). Every file is an IIFE that attaches to `window.AA`. No ES modules, no `import`, no external JS libraries.
- **Data before UI.** Clinical content lives in `js/data/` as plain objects. Views never hard-code clinical content; they render data.
- **Single source of truth.** All user state is in `AA.store` (one object, persisted to `localStorage`). Views read with `get`, write with `set`, and subscribe to changes. Never keep a second copy of user state in a view except short-lived local UI state.
- **Pure logic is separate.** Scoring (`js/engine/scoring.js`) and diagnostic rules (`js/engine/diagnosis.js`) are pure functions with tests in `tests/`.
- **Works in a sandboxed frame.** The app is also published inside a locked-down iframe: `alert/confirm/prompt` do nothing, `window.print()` does nothing, file downloads are blocked. Use `AA.util.confirm()` (in-page dialog), `AA.util.copyText()`, and check `AA.util.isEmbedded` before offering print or download. Wrap storage access (already done in `AA.util.storage`). Only plain route tokens are used for URLs.
- **Accessible.** Real buttons and form controls, labels on every input, visible focus, keyboard operable, colour never the only signal, `aria-live` for scores.
- **Plain UK English** in all copy. Short sentences. Name things by what clinicians recognise.

## 2. Files and load order

```
index.html
css/app.css                core tokens (light + dark) and shared component classes
css/v-assess-a.css         assess-steps-a.js (prefix .as-)
css/v-assess-iv.css        assess-interview.js (prefix .iv-)
css/v-assess-b.css         assess-steps-b.js (prefix .ab-)
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
js/engine/diagnosis.js     AA.diagnosis
js/components/questionnaire.js  AA.components.questionnaire, AA.components.bands, AA.components.scoreBox
js/data/*.js               content (section 5)
js/views/shell.js          top bar, sidebar, routes: signin, home, new, about
js/views/assess-frame.js   route: assess (workspace, step strip, live panel); AA.STEP_LIST
js/views/assess-steps-a.js AA.steps: setup, screen, risk, history, comorbid
js/views/assess-interview.js AA.steps: ia, hi, onset, collateral
js/views/assess-steps-b.js AA.steps: ddx, validity, summary, report
js/views/library.js        routes: tools, tool, pathway
js/views/learn.js          routes: learn, module, quiz, exam, cases, case, glossary
js/views/reference.js      routes: ddx, cond, criteria, bank, sym
js/views/guides.js         routes: forms, form, ddxguide; AA.components.ddxProtocol
js/app.js                  boot
tests/run.js               node test runner: engine unit tests + data schema validation
```

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
- `AA.assess.get(id, rel, fallback)`, `AA.assess.set(id, rel, value)` (also stamps `updatedAt`), `AA.assess.create(patient)`, `AA.assess.insert(record)`, `AA.assess.list()`, `AA.assess.remove(id)`, `AA.assess.path(id, rel)`.
- `AA.progress.get(rel, fallback)` / `AA.progress.set(rel, value)` - per-clinician learning progress. Keys used: `modules.<moduleId>.done` (bool), `modules.<moduleId>.at`, `quizzes.<quizId>` = `{best, last, at}` (percent), `cases.<caseId>` = `{score, of, at}`, `exam` = `{best, last, at}`, `lastAssessment`, `sandbox.<toolId>` = answers object (library practice scoring).

### AA.router
- `AA.router.register(name, {title: string|fn(params), render(el, params) -> cleanup?})`.
- Route token = `name` or `name-param1-param2`. Data ids therefore never contain hyphens. Navigate with `AA.router.go(token)` or any element with `data-go="token"`. `AA.router.refresh()` re-renders the current route keeping scroll.
- `render` gets an empty `el` (`#view`). Return a cleanup function if you subscribed to anything.

### AA.scoring
- `AA.scoring.score(tool, answers)` -> `{complete, answered, of, total, max, band, sev (0-3|null), positive (bool|null), subscales[], flags[{level,text,item}], lines[], method, ...method extras}`.
- `AA.scoring.forAssessment(a, toolId)` -> score or null if no answers.
- Methods: `sum` (also `count`), `asrs18`, `wfirs`, `mdq`, `pcl5`, `triage`. See section 5.4.

### AA.diagnosis (`D`)
- `D.need(a)` adult threshold (5 from age 17, else 6). `D.counts(a, 'adult'|'child')`.
- `D.criterionA..E(a)`, `D.criteria(a)` -> `{A:{status, detail,...}, ...}`; status is `met|not-met|pending|partial`.
- `D.presentation(a)` -> `combined|ia|hi|null`; `D.PRESENTATIONS[key]` -> `{label, dsm, icd11}` (also `other`, `unspecified`).
- `D.severity(a)` suggested `mild|moderate|severe|null`. `D.collateral(a)` -> `{level:'clear'|'some'|'none'|'unavailable', best, rated}`.
- `D.ddxScore(cond, entry)` -> `{score, max, pct, band:'none'|'weak'|'possible'|'strong', checked}`; `D.ddxScreens(a, cond)`.
- `D.confidence(a)` -> `{level:'high'|'moderate'|'low', points, reasons:[[sign, text]]}` (sign `+`, `-` or `!`).
- `D.outcome(a)` -> `{code:'met'|'not-met'|'subthreshold'|'better-explained'|'incomplete', title, reasons[], presentation, severity, confidence, dsm, icd11, criteria}`.
- `D.diva2(a)` DIVA 2.0 / DSM-IV score form view. `D.stepProgress(a, stepId)` -> `{done, of}`. `D.STEP_TOOLS`.

### AA.components
- `AA.components.questionnaire(tool, {answers, onAnswer(n, value), mode})` renders items + live score. The caller persists answers: in an assessment, `ctx.set('tools.' + tool.id + '.answers.' + n, value)` (value `null` -> pass `undefined` to delete).
- `AA.components.bands(tool)` band table; `AA.components.scoreBox(tool, result)`; `AA.components.redFlags(a)`.

## 4. The assessment record

`AA.assess.get(id)` returns:

```js
{
  id, clinicianId, createdAt, updatedAt, status: 'active'|'complete', step: 'setup', demo?: true,
  patient: { ref, age, sex, gender, occupation, referrer, reason, date,
             informants: {partner, parent, sibling, other}, sources: {schoolReports, previousRecords},
             consent: bool, interpreter: bool, present: '' },
  tools: { <toolId>: { answers: { <itemN>: value }, notes } },
  risk: { <riskItemId>: true, reviewed: bool, notes, action },
  history: { <sectionId>: { checks: { <itemId>: true }, notes, none: bool } },
  symptoms: { <symptomId>: {
      adult: 'yes'|'no'|'unsure'|null, child: 'yes'|'no'|'unsure'|null,
      exA: { <exampleKey>: true }, exC: { <exampleKey>: true },   // ticked examples, key = "<ctx>.<index>"
      otherA: '', otherC: '',                                      // patient's own examples
      infA: 0|1|2|'na'|null, infC: 0|1|2|'na'|null,               // informant agreement
      notes: '', flags: { <ddxId>: true } } },                      // differential flags raised here
  supplement: { iaAdult, iaChild, hiAdult, hiChild },               // 'yes'|'no'|null (DIVA supplement question)
  onset: { always: 'yes'|'no'|null, ageOnset: '', before12: 'yes'|'no'|'unsure'|null, duration6m: 'yes'|'no'|null, notes },
  impairment: { adult: { <domainId>: { sev: 0|1|2|3|null, ex: {<key>: true}, notes } }, child: { same } },
  collateral: { parent: 0|1|2|'na'|null, partner: ..., school: ..., who: {parent:'', partner:''},
                answers: { <questionKey>: true }, notes },
  ddx: { <condId>: { f: { <featureId>: true }, verdict: 'absent'|'comorbid'|'better'|'uncertain'|null, notes } },
  validity: { checks: { <id>: true }, concern: 'none'|'some'|'major'|null, notes },
  formulation: { decision: 'met'|'not-met'|'other-specified'|'deferred'|null, presentation, severity, remission: bool,
                 comorbid: '', notes, plan: { <planItemId>: true }, planNotes, reportReviewed: bool }
}
```

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
  ask: { adult: 'Main question to read aloud about the last 6 months.', child: 'The same question for age 5-12.' },
  rephrase: ['8-14 alternative wordings: plainer, for low literacy, for people who say "everyone does that", for non-native speakers, open questions'],
  examples: {
    adult: [ { ctx: 'work', label: 'Work', items: ['...', ...] }, ... ],   // 8-12 contexts, 70-110 items in total
    child: [ { ctx: 'school', label: 'Classroom and schoolwork', items: [...] }, ... ]  // 5-8 contexts, 40-60 items
  },
  probes: [ { k: 'frequency', label: 'How often', items: [...] }, ... ],  // keys: frequency, severity, pervasive, duration, peers, impact, compensation, onset; 4-8 items each
  informant: { partner: [...8-12], parent: [...8-12], school: [...5-8 things to look for in reports] },
  counts: ['6-10 rules: when to score Present'],
  notCount: ['8-12 rules: when NOT to score present / common scoring errors'],
  anchors: [ { score: 'yes'|'unsure'|'no', quote: 'realistic patient answer', why: 'how to score it and why' } ],  // 6-9 calibration anchors (2-3 per score)
  mimics: [ { ddx: '<ddx id>', clue: 'what points to the alternative', ask: 'discriminating question' } ],   // 6-10
  special: { women: '', older: '', highIQ: '', sud: '', asd: '', culture: '' },  // 1-3 sentences each
  refs: ['short source strings']
}
```
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
    child: { ask: [...5-8], items: [...20-30], anchors: { 0:'', 1:'', 2:'', 3:'' } }
  } ],
  onset: { intro: '', ask: [...12-20], memoryAids: [...10-15], lateOnset: [...6-10 cautions], pitfalls: [...] },
  duration: { ask: [...4-6] },
  supplement: { ia: { adult: 'question', child: 'question' }, hi: { adult: '', child: '' } },
  collateral: {
    intro: '',
    rating: [ { v: 0, l: 'None or little support', d: '' }, { v: 1, l: 'Some support', d: '' }, { v: 2, l: 'Clear support', d: '' } ],
    parent: { intro: '', questions: [ { k: 'p1', q: '...' }, ... 20-30 ] },
    partner: { intro: '', questions: [ { k: 'r1', q: '...' }, ... 15-25 ] },
    school: { intro: '', lookFor: [ ...15-25 phrases typical in school reports ], caution: [...] },
    discrepancy: [ ...6-10 rules for handling disagreement ],
    noInformant: [ ...5-8 options when nobody is available ]
  }
}
```

### 5.3 History and risk (`AA.add('history', [...])`, `AA.add('risk', {...})`)

```js
// history section
{ id: 'dev', title: 'Development and early life', why: '', prompts: [...8-15 questions],
  items: [ { id: 'dev_preterm', t: 'Born preterm (< 37 weeks) or low birth weight', flag: 'adhd'|'ddx'|'risk'|'treat'|null, ddx: '<ddx id>'|null, note: '' } ] }
// section ids: presenting, dev, school, work, relationships, mental, substance, physical, meds, family, forensic, social, sleep, strengths
// risk
{ intro: '', items: [ { id: 'r_si', text: 'Current thoughts of ending life', short: 'Suicidal thoughts', level: 'urgent'|'high'|'note', action: '' } ],
  actions: [...], ask: [...] }
```

### 5.3b Validity indicators and plan items (`AA.add('validity', {...})`, `AA.add('plan', [...])`)

```js
AA.add('validity', {
  intro: '',
  indicators: [ { id: 'v_all18', t: 'Endorses almost every symptom at the highest frequency', w: 2, why: '' } ],  // 12-20; w 1-3
  incentives: [ { id: 'v_exam', t: 'Seeking exam or workplace accommodations', why: '' } ],                     // 6-10
  consistency: [ ...6-10 things to cross-check ],
  tests: [ { name: 'CAARS 2 Inconsistency/Exaggeration indexes', what: '', note: '' } ],                      // embedded and stand-alone validity measures
  wording: [ ...5-8 example sentences for reports ],
  refs: [...]
});
AA.add('plan', [ { id: 'pl_psychoed', group: 'After diagnosis'|'Before any medication'|'Safety'|'Other needs'|'If ADHD not diagnosed', t: 'Plan item text', src: 'NICE NG87 1.x.x' } ]);  // 18-30 items
```

### 5.4 Tool (`AA.add('tools', [...])`)

```js
{
  id: 'phq9', abbr: 'PHQ-9', name: 'Patient Health Questionnaire-9',
  group: 'adhd-screen'|'adhd-childhood'|'adhd-impairment'|'adhd-interview'|'adhd-rating'|'mood'|'bipolar'|'anxiety'|'trauma'|'substance'|'autism'|'personality'|'psychosis'|'sleep'|'risk'|'cognition'|'child'|'objective'|'validity'|'other',
  stage: ['pre', 'comorbid'],     // pathway stage ids: referral, pre, interview, collateral, comorbid, risk, physical, diagnosis, followup
  who: 'Self-report', time: '2-3 min', ages: 'Adults', items_n: 9,
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

### 5.5 Differential (`AA.add('ddx', [...])`)

```js
{
  id: 'dep', name: 'Depression (major depressive disorder)', group: 'mood'|'anxiety'|'trauma'|'personality'|'neurodevelopmental'|'substance'|'psychosis'|'sleep'|'medical'|'cognitive'|'other',
  core: true,                      // must be reviewed in every adult assessment
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
           next: 'What happens next and why', src: ['sources'] }, ... }   // all 13 step ids
```

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

## 6. Views and routes

| Route | File | Purpose |
|---|---|---|
| `signin`, `home`, `new`, `about` | shell.js | profiles, dashboard, new assessment, privacy and data |
| `assess`, `assess-<id>-<step>[-<sub>]` | assess-frame.js | assessment workspace |
| `tools`, `tool-<id>`, `pathway` | library.js | instrument library, practice scoring, pathway and guidelines |
| `learn`, `module-<id>`, `quiz-<id>`, `exam`, `cases`, `case-<id>`, `glossary` | learn.js | training |
| `ddx`, `cond-<id>`, `criteria`, `bank`, `sym-<id>` | reference.js | interview aids |
| `forms`, `form-<id>`, `ddxguide` | guides.js | pre-appointment forms guide, differential diagnosis protocol; also `AA.components.ddxProtocol(opts)` |

### Assessment steps
`AA.STEP_LIST` (assess-frame.js) defines order and titles: setup, screen, risk, history, comorbid, ia, hi, onset, collateral, ddx, validity, summary, report.
A step file registers `AA.steps.<id> = { render: function (el, ctx) { ...; return cleanup? } }`.
`ctx`: `{ id, step, sub, meta, a(), get(rel, fb), set(rel, value), go(step, sub), onChange(rel, fn) }`.
The frame already renders the page heading, step strip, live score panel and previous/next buttons: a step renders only its own content into `el`.
`ctx.onChange` subscriptions are removed automatically when the step is left.
The interview steps use `sub` for the current symptom (`assess-<id>-ia-ia3`).

## 7. Shared CSS classes (css/app.css)

Layout: `.section`, `.stack`, `.row`, `.grid` (auto cards), `.grid-2`, `.card`, `.card-raised`, `.card-link`, `.card-meta`, `.card-foot`, `.page-head`, `.eyebrow`, `.lead`, `.muted`, `.hint`, `.source`, `.sep`.
Controls: `.btn` + `.btn-primary|-ghost|-quiet|-danger|-sm`, `.seg`, `.check`, `.field`, `.form-grid`, `.search`.
Status: `.badge-*`, `.pill-*`, `.callout-*`, `.meter`, `.empty`.
Content: `.prose`, `.list`, `.table-wrap` + `.table`, `.kv`, `.disclosure`, `.tabs`, `.chip-list` + `.chip`.
Assessment: `.ws`, `.ws-main`, `.ws-panel`, `.panel`, `.stepper`, `.step-nav`, `.sx-ask`, `.sx-ask-sub`, `.sx-score`, `.ex-group`, `.ex-list`, `.flag-row`, `.report`.
Questionnaire: `.q-*` (owned by questionnaire.js).

## 8. Content rules

- Clinical accuracy first. Use the research briefs; never invent clause numbers, cut-offs, psychometrics or quotes. If not from a named source, label it "Clinical practice".
- Paraphrase DSM-5-TR and ICD-11 wording; do not reproduce criteria verbatim beyond short phrases.
- DIVA: the app follows DIVA's structure (adult then childhood, examples, supplement question, onset, impairment in five areas, collateral 0/1/2 rating) but all question and example wording is original. Do not copy the DIVA 2.0 or DIVA-5 example lists.
- Licensed instruments (DIVA-5, CAARS 2, BAARS-IV, Conners 4, BRIEF-A, Brown EF/A, CAADID, Epworth, ISI, SDQ ...) are described and linked, with `interactive: false` and empty `items`.
- UK English, plain words, short sentences, inclusive (partner not husband/wife; they/them for unnamed people).

## 9. Testing

- `node tests/run.js` runs the engine unit tests and validates every data file against these schemas (ids unique, required fields, cross-references such as `mimics[].ddx`, `screen[]` tool ids, quiz answer indexes).
- Browser check: serve the folder (`python3 -m http.server`) and open `index.html`; there must be no console errors on any route.
