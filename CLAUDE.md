# ADHD-learning: project instructions

## The mission

This is **one website** that takes an independent prescribing (IP) pharmacist who knows nothing about ADHD
and turns them, start to finish, into a true ADHD specialist who can:

- **assess** adults for ADHD (screening, structured interview, collateral, differentials, validity),
- **diagnose** (DSM-5-TR / ICD-11, NICE NG87),
- **prescribe** (choice of drug, formulations, contraindications, controlled drug rules),
- **titrate** (doses, steps, targets, when to switch),
- **monitor** (BP, pulse, weight, sleep, mood, misuse, annual review, shared care),
- and work at the level of a **clinical lead and supervisor** (governance, supervising others, audit,
  service design, complex cases): someone a service would pay £100k for.

The knowledge must be exceptional: deep, accurate, practical and complete, with the tools a specialist
actually uses. Teach from zero, but finish at expert level.

## How Claude works on this repo

The owner asks for reviews one page at a time. For each page or module:

1. **Content.** Is it accurate, current (NICE NG87, BNF, MHRA, SPCs, DSM-5-TR, ICD-11) and deep enough for
   a specialist? What is missing for the journey above? Flag anything wrong or out of date.
2. **Remove extras.** Cut repetition, padding and anything that does not help the learner do the job.
3. **Plain language.** Rewrite so it is simple and well explained: short sentences, define every term
   the first time, explain the *why*, use worked examples. Expert content, easy words.
4. **Structure and UI.** Is the page easy to follow and use? Suggest better order, layout, visuals,
   interactives and tools.
5. **Report first, then change.** Give a clear verdict (what is good, what to fix, in priority order),
   then make the agreed changes.

**When rebuilding any module, follow `docs/module-playbook.md` step by step** (process, page structure,
components, practice, writing style, QA, and the owner's preferences). Module 1 is the reference build.

Also keep in mind:

- **The owner has ADHD and learns best visually and interactively.** Favour images with "what to notice"
  explanations, interactives, and short chunks over long text. Avoid long scrolling: quizzes show one
  question at a time, flashcards are a deck, and each module ends with one tabbed **Practise** box
  (flashcards, spotter-style exercises, module quiz). New images go in `images/`.
- **Module template (Module 1 is the reference).** Header with `.mod-meta` chips (time, lessons, quick
  checks, suggested CPD, last reviewed, sources), then `<div class="lessons" data-lessons="<id>">` with short
  `<section class="lesson" data-title data-min>` screens (3–6 min each) with no quizzes inside them, and a
  final "Recap and practise" lesson with `.takeaways`, the Practise box (Flashcards · Spotter · Lesson checks,
  2 questions per lesson, `data-quiz="<id>checks"` · Module quiz), sources in a closed `details.sources-d`
  dropdown, and the complete button. The module overview is its own first screen. Use `table[data-cards]`, `.stat-grid`, `.risk-grid` and figure
  walkthroughs instead of long tables and lists. Font is Fredoka (the owner prefers it; keep it); image style is in `docs/image-style-guide.md`.
- **Every quiz and exam answer must teach.** Each explanation says why the right answer is right, why the
  tempting wrong answers are wrong, and the practical point, with its source. Never just "NG87 1.2.3."
- **Design rules the owner has asked for (apply to every page):**
  - **No boxes inside boxes.** Inside a lesson card use at most one level of card; no inner shadows, grey frames
    around cards, or tinted panels inside tinted panels. Coloured meaning goes on a left or top bar, a dot or a label.
  - **Even padding.** Content inside a card sits about 1.5rem from its edge and lines up with the card's title and tabs.
  - **One thing at a time.** Every NICE pathway (`.bflow`) is shown automatically as a journey (app.js): all steps visible as coloured numbered cards with arrows, then the decision and the rule. Short content is shown all at once; a click-through stepper is only for long content. Long sets (gates, steps, symptoms, questions) use a stepper (`[data-gst]`), a tab set or
    a one-at-a-time card with Previous / Next, not a long stack. Aim for every lesson to fit in about 2 screens.
  - **Teach in lessons, practise at the end.** Quizzes, drills, scenario sets and scoring trainers go in the module's
    end Practise box (nested tabs allowed: `.practice.pr-nested`). Big "Try it" explorers inside a lesson sit in a
    closed `details.mx.mx-tool` dropdown; side topics and checklists in `details.mx`.
  - **Collapsed by default; references at the bottom.** Depth goes in closed dropdowns. Guideline-basis lines,
    clause lists and sources go in the closed sources dropdown at the end, not under each card.
    No reference tags in lesson text: no clause chips (`NG87 1.3.1`, `SmPC 4.2`), no "(NG87 1.2.7)" brackets,
    no source labels under stats. Quiz and exam answer explanations still name their source.
  - **No repeats across modules.** Each topic lives in one place (e.g. the 18 symptoms in M1, the baseline in M3);
    elsewhere link to it with `.deeper`.
  - **Group logically.** Pickers and long lists are grouped by purpose, each group a card with an icon, a one-line
    purpose and a count; colour keys sit with the thing they explain.
  - **Dropdowns look the same everywhere:** one global `select` style (white field, teal chevron and focus ring; the
    old dark explorers keep theirs). A long picker (more than about 8 options, e.g. the 18 symptoms) uses domain tabs
    and chips, not a native list.
  - **Navigation:** the sticky lesson bar has ‹ › lesson arrows and a floating "All lessons" menu; keep it that way.
- When CSS or JS changes, bump the `?v=` query on the local `<link>`/`<script>` tags in `index.html` so
  browsers load the new files.

- It must feel like **one website**. The main course (`index.html`) and the assessment workspace
  (`adhd-assessment/`) should link together and read as one learning journey.
- Clinical accuracy first. Never invent doses, cut-offs, clause numbers or psychometrics; cite the source.
- UK English. Inclusive wording (they/them for unnamed people, partner not husband/wife).
- Static site, no build step. Run locally with `python -m http.server 5500` and open http://localhost:5500.
- Before changing anything in `adhd-assessment/`, read `adhd-assessment/ARCHITECTURE.md` and follow it;
  run `node adhd-assessment/tests/run.js` after changes.
- Commit and push to `main` on GitHub (`Mostafadmg/ADHD-learning`) only when the owner asks; GitHub Pages
  serves the live site from `main`.

## Rebuild status

- **Rebuilt on the template:** m1 (24 Oct 2026), m2 (24 Oct 2026; `js/m2-curve.js`), m3 (25 Oct 2026; `js/m3-baseline.js`), m4 (27 Oct 2026; quiz items in `js/data-quiz-m4.js`, which replaces the old m4 bank; clause numbers verified against live NG87).
- **m8 rebuilt 28 Oct 2026:** 8 lessons + recap (ids m8-mimic, m8-clues, m8-mood, m8-anx, m8-sub, m8-body, m8-nd, m8-first, m8-recap); explorer `js/m8-ddx.js` (`window.M8DX`, 25 conditions); quiz `js/data-quiz-m8.js`. The "Check:" label in guide questions has class `.ag-qk` (only that is hidden).
- **m9 rebuilt 28 Oct 2026:** 9 lessons + recap (pharmacists across the pathway, counselling, Schedule 2 checks, CDs in the pharmacy, shortages, diversion, escalation, prescriber scope, governance and leading a service); audit planner `js/m9-audit.js`; quiz `js/data-quiz-m9.js`.
- **m11 rebuilt 28 Oct 2026:** a clinic quick-reference in 8 lessons + recap (lesson ids #m11-l1…l9 for deep links); tools in `js/handbook.js` (light card style), data `js/data-brands.js`, quiz `js/data-quiz-m11.js`. Matoride XL is children 6+ only, max 54 mg (emc SmPC rev. 06/05/2026, checked live 28 Oct 2026); M5 table and daybuilder match.
- **m10 rebuilt 28 Oct 2026:** 4 themed case lessons, one case at a time via a picker (`js/m10-cases.js`; case data `js/data-cases.js`, best answers rotated across A–D; quiz `js/data-quiz-m10.js`). Case ids: case-ethan, -mia, -liam12, -noah, -anxiety, -emma, -sophia, -david, -bp, -shortage, -misuse, -adultnew.
- **Rebuilt 28 Oct 2026:** m5 (`js/data-quiz-m5.js`; titration explorer and simulator live in the Practise box), m6 (`js/data-quiz-m6.js`), m7 (`js/data-quiz-m7.js`). Drafts were checked against emc SmPCs, NG87, MHRA, UKTIS and DVLA; BNF/BNFC pages were not reachable live, so BNF-only ceilings sit in closed dropdowns labelled with the 21 Oct check. The old m5/m6/m7 items in `data-quiz.js`/`data-quiz3.js` stay only because the final quiz copies a few of them on load.
- **Less scrolling (28 Oct 2026):** practice sits in each module's end Practise box (a Practise box can hold a nested `.practice.pr-nested` tab set; `app.js` only binds a box's own tabs). Big "Try it" explorers inside lessons go in closed `details.mx.mx-tool` dropdowns; side topics and checklists in `details.mx`. Sources dropdowns close again whenever the lesson changes. M3 lost its "score the scales" lesson (now a Practise tab), and "Collateral history and impairment" is merged into lesson 4, now a five-part stepper (who diagnoses, what it covers, collateral, impairment, the diagnosis checklist); M3 has 9 lessons; Section B is 4 lessons (the DSM/ICD comparison is a dropdown in lesson 1, the 18 symptoms live only in M1, the 60 scenarios are a Practise tab, the five gates are a coloured stepper with DSM-5-TR and ICD-11 side by side in each gate, and the criteria checker is a five-step wizard with a live verdict: patient, inattention table, hyperactivity table, other gates, verdict). The sticky lesson bar has ‹ › lesson arrows and its "All lessons" menu floats over the page.
- **Quizzes, practice and exams share one look (28 Oct 2026):** `renderQuiz` (app.js) draws every `.quiz[data-quiz]` (module quizzes, lesson checks, course exam) as `.qz2`: one question at a time, a segmented track, lettered answer tiles, a feedback card with a source chip and a results ring. End-of-module Practise boxes become icon tiles (`.pr2`, `.prt-cards|quiz|checks|drill`, chosen from the tab label). The final exam (`R.exam` in lab.js) reuses the `.qz2` classes plus `.xm-*` (start tiles, domain bars, case-station card that folds after its first question, results, review mode). Paged drills (`pager()` in assess.js, `R.mcq` in lab.js) use the same header and track. Change one, check the others.
- **Sections A–D rebuilt on the template (25 Oct 2026):** ag (overview, phases lesson, the 19-step guide in one lesson; each step's checks are one tabbed box in `js/assess.js`), dx (6 lessons), sim (3 lessons), sp (6 lessons). Their interactive tools (`js/assess.js`, `js/lab.js`) are unchanged in behaviour; they now sit inside lessons, with drills and scenario sets in the Practise box.
- Shared module styles use `:is(#m2,#m3,#m4,#ag,#dx,#sim,#sp)` in `css/styles.css`: add each newly rebuilt module id to that list (one find-and-replace) so it gets the same card system.
- M3 owns recognition/referral (NG87 1.2), who diagnoses and what assessment includes (1.3), the tool kit, collateral/impairment and the pre-treatment baseline (1.7). Criteria live in M1; step-by-step assessment in section A; criteria checker in section B.
- **All modules are now on the lesson template** (m1–m11 and sections A–E). Old dark XP explorers no longer used: `imp` (m1), `pfc` (m2) in
  `js/explorers-config.js`; remove once no module needs them.
- **Light explorers (28 Oct 2026):** the M4 pathway walker (`XP.registry.path` in `js/explorers-more.js`) no longer uses the
  dark `XP.form` card: it renders `.pw2` (route on the left, tap a step to go back; one step card coloured by tone; patient and
  pharmacist points in a closed `details.mx`; route shrinks to numbered dots on phones). Since 1 Nov 2026 the `XP.form`
  explorers (bp, growth, se, ix, dd, cd) are light too (`css/xp-light.css`, root class `.xpl`: presets as a scrolling chip
  row, verdict directly under the controls, patient and pharmacist panels as two closed dropdowns, a sticky result strip),
  and the M5 day builder is a three-step light tool (`js/daybuilder.js`, `css/m5-day.css`, classes `dy-*`). Only `XP.make`
  based explorers (titration, `imp`, `pfc`) still use the old `.xp.card-dark` rules in `css/styles.css`.
  Section B lesson 1's phase grid (`.ph-grid`) is a four-column journey with a numbered step timeline per phase.

- **One website (25 Oct 2026):** the course sidebar has a "Clinician workspace" group and the home page a workspace card; the workspace sidebar and sign-in screen link back to `../index.html#home`. Course deep links such as `adhd-assessment/index.html#form-phq9` survive sign-in (`AA.router.takePending()/afterSignIn()`). When changing a workspace script, add/bump `?v=` on its `<script>` tag (bundle.js strips the query).
- M1 lesson 2 "The 18 symptoms" is `js/m1-symptoms.js` (`[data-sx18]`): domain tabs, symptom list and one detail card built from `window.AGSX` (`js/assess-data-sx.js`) plus short examples in the script; the old tables stay inside `<noscript>`. Edit symptom wording in AGSX, which the guide and Section B also use.
- M3 lesson 6 (`js/m3-forms.js`) summarises the workspace forms guide (`adhd-assessment/js/data/forms-guide.js`); if scoring facts change there, update both.
- Its "Try the form" boxes (`js/m3-tryforms.js`) load the workspace tool data and scoring engine on demand; only the example answers live in `js/m3-tryforms-data.js`. Never copy item wording into the course: licensed tools (WSR-II, STOP-Bang/Epworth) show the forms-guide worked example only. Exception: SNAP-IV (`snap4`) has no workspace item bank, so `js/m3-tryforms-data.js` holds paraphrased item themes and its own scorer (Swanson averages, parent cut-offs from the workspace reference card).

- **Site search (`js/search.js`):** one box in the top bar (`/` or Ctrl+K). It indexes on first use: module/lesson/heading text, key-point cards, flashcards, `window.QUIZ` questions, `window.GLOSS`, `window.AGSTEPS` and `window.M3FORMS`. Add synonyms to `SYN` when new drugs or tools appear. Hooks it uses: `window.__agGo(n)` (assess.js) and `window.__m3form(id)` (m3-forms.js).
- **Forms:** M3 lesson 7 is the form library. Each form opens blank ("Fill it in yourself"); examples are optional. `forms/print.html?f=<id>` is a printable, fill-in page (score shows in a sticky right column via the shared `js/score-panel.js` + `css/score-panel.css`, the same panel as the lesson) built from the same item data; every form links to its official source (`tool.url`). Never copy wording from third-party PDFs into the site. Original PDFs live in `forms/official/` (sources in its README) and open through `forms/view.html?f=<file>`. Item wording was checked word for word against those PDFs on 26 Oct 2026 (ASRS, WFIRS, PHQ-9, GAD-7, AUDIT, AQ-10, PCL-5, C-SSRS); WURS-25, DAST-10, MDQ and MSI-BPD have no official PDF saved.
- **Module 3 is lettered A–E (28 Oct 2026):** A = Module 3's own 9 lessons (referral and assessment), B = Assessment Guide (#ag), C = Criteria & Does it count? (#dx), D = Case simulator (#sim), E = Special presentations (#sp). Older notes below that say "sections A–D" mean B–E. Cross-references in the page text use these new letters.
- **Sidebar:** sections A–D are nested under Module 3 (`li.sb-grp > ol.sb-sub`) and shown while you are in that group. The Assessment Guide step player (`js/assess.js` render) shows teaching only for each step, ending in a "Practise step N" link; all step practice (tool, paged questions with Reset answers, checklist dropdown) lives in the module-end Practise box, tab "The 19 steps" (`#ag-prac`, `renderPrac()`/`tryHTML()`: one step at a time with a progress bar, a "go to step" select and Previous/Next; its own step `S.ps`, separate from the guide position `S.step`); feedback shows the best answer and a "Why" explanation. 4-phase step track. Lists of practice or check questions show one at a time (`pager()` in assess.js; `R.mcq` in lab.js uses the same `.pg-bar` / `.pg-nav` markup), with lettered answer tiles styled for `.agp` and `.lab-mount`.

- **Start an assessment (27 Oct 2026):** the course sidebar (right after Home, and inside every module's lesson menu), the home hero and a home card open `adhd-assessment/index.html#new`. The workspace now runs the whole pathway in 18 steps grouped Prepare · Interview · Diagnose · Treat · Report, for adults and young people 6–17 (under 6: refer). New files: `js/engine/treatment.js` (`AA.treatment`), `js/data/tx-products.js`, `tx-pathway.js`, `tx-guide.js`, `age-bands.js`, `ddx-young.js`, `step-guide-young.js`, `js/views/assess-treat.js`, `css/v-assess-tx.css`; tests `tests/tx-tests.js`, `tests/young-tests.js` (run by `tests/run.js`). Record keys: `adult` = current 6 months and `child` = before 12 at every age. Doses, licences and NICE order match the course (M4/M5/M11) and were reviewed adversarially; see `adhd-assessment/ARCHITECTURE.md` §3–§6 before changing anything. Two demos: adult (Elvanse) and an 8-year-old (Concerta XL).
- **M5 lesson 2 (methylphenidate products)** is static cards in `index.html` driven by `js/m5-mph.js`. Edit doses in the cards; keep them matching `js/data-brands.js` and M11.
  It covers every UK methylphenidate product (emc search, all results read 25 Oct 2026; Ambinet XL, Addepta XL, Kixel XL,
  Tuzulby and Viatris IR tablets re-read 28 Oct 2026). Rebuilt 1 Nov 2026 in three parts, each under an `h3.mph-h`:
  "Why the brand matters" (three icon points and the "So" note), "Find a product" and "Rules for every product"
  (2 × 2 cards, then the BNF dropdown). The finder (`[data-mph]`) has three duration tabs `[data-f]` (IR · 8 h · 12 h,
  bars on one 12-hour scale), the chosen family's list `[data-fl]` of `[data-p]` buttons (8 h split 50:50 / 30:70), and
  one `[data-panel]` card at a time: beside the list in a wide column, below it in a narrow one (container queries
  `mph` and `mphcard`; on a phone, tapping a product scrolls its card up). Each card has licence chips, a facts strip
  (`.mph-facts`: released, lasts, form) and children and adults side by side; the doses show as a ladder (start, step,
  maximum) drawn by CSS from the card's `dl`. A link to a card heading (site search) opens that card. The card
  markup is generated, so edit carefully.
  Only the two SPS sets are interchangeable; Kixel XL, Ambinet XL, Addepta XL and Tuzulby are not on the SPS list.
  The M11 brand look-up (`js/data-brands.js`) does not yet include those five.
- **M5 lesson 3 (release profiles), rebuilt 1 Nov 2026:** the static schematic and the "compare release profiles"
  dropdown are replaced by one explorer, `js/m5-release.js` (`[data-rp]`, built by the script; a `<noscript>` table
  is the fallback). Six product chips (IR, Equasym XL, Medikinet XL, Ritalin XL, Concerta XL, and lisdexamfetamine
  for comparison); a chart of one 07:30 dose with the IR and MR parts stacked; numbered key moments tied to a
  "Through the day" panel; a time cursor (drag, tap or arrow keys) with a readout of which part is working; an IR
  "Add a 12:00 dose" option; and a "Compare with" outline. Curves come from the shared model `js/release-model.js`
  (`window.RELMODEL`), which the lesson 4 day builder (`js/daybuilder.js`) also uses: change shapes there only.
  The "Lasts" bars use the SmPC/SPS durations, not the curve. Re-fitted on 1 Nov 2026: Equasym XL to its SmPC
  levels (first peak about 94% of the second), and Medikinet XL to last about 8 h with levels at 75% of the peak or
  more for 3–4 h after the first peak (it used to cover only about 6.5 h in the day builder).
- **Layout: Design A "Clear Clinic" (31 Oct 2026)** lives in `css/layout.css`, loaded last in `index.html`. It styles the
  shell only: white top bar, white sidebar with the lessons as a progress track (state text hidden), soft page
  background, content column centred, the lesson bar and lesson joined into one card, the module overview card and the
  home page. The owner asked that lesson content keep its current look, so do not restyle lesson components there.
  Mock-ups of the three options (A, B route map, C dark focus) are in `docs/design-options/`.
- **Progress saving (1 Nov 2026, `js/app.js`, key `adhdPharmLearn.v2`):** a lesson is ticked when you move on to a later
  lesson by any route (Next, arrows, progress bar, lesson menu, sidebar), never when moving back. Ticking every lesson
  marks the module complete. "Mark module/section as complete" only marks (it also ticks all lessons); a separate Undo
  link takes it back. Other open tabs pick up saves through the `storage` event, so a stale tab cannot overwrite newer
  progress. Progress is per browser and per site address (localhost and the live site are separate).
- **Lessons end with a next-module button** (app.js): the last lesson's Next goes to the following page in the course menu (M11 → Course exam).

## Phone study layer and medicine labs (1 Nov 2026)

The owner studies mostly on a phone, so phone use comes first. Run the checks in `tools/phone/` (see its README) after any
layout change: `audit.js` at 375 and 320px (no sideways scroll, 44px tap targets, no console errors) and `wdiff.py` before
and after restructuring a module (no words may be lost).

- **Phone shell** (screens up to 900px; `css/mobile.css`, loaded last): `js/mobile-dock.js` builds a fixed bottom bar (Back,
  "3 of 10 · title" which opens the list of lessons as a bottom sheet, Next) from the lesson bar `app.js` already makes, and
  clicks that bar's own buttons, so progress saving is untouched. The top bar slides away on scroll down. Form fields are 16px
  (no iPhone zoom). Everything depending on the dock is gated on `body.has-dock`.
- **Progressive reading** (`js/mobile-parts.js`, up to 700px): a lesson taller than about two screens opens a part at a time
  (about 1.2 screens each, cut between blocks, never after a heading) with a "Keep going" card and a "Show the whole lesson"
  link; the dock's Next says "Continue" until every part is open. Nothing is removed from the page. `scrollIntoView` is wrapped
  so search results, anchors and "reread" links open the part that holds their target. Add `?noparts` to the URL to see full length.
- **Per-module phone files:** `css/m6-phone.css` … `css/m9-phone.css` (+ `m8`, `m10`, `m11`, `m5` where present) and
  `js/m7-extra.js`, `js/m9-extra.js`, `js/m5-extra.js`. They only change presentation (steppers, tabs, folded depth); lesson
  ids, `data-title`, `data-min` and quiz keys must not change.
- **Medicine labs (Module 5):** one engine, `js/m5-lab.js` + `css/m5-lab.css` (`window.M5LAB`; the header comment is the data spec),
  and one data file per family: `js/m5-lab-mph.js` (methylphenidate: Convert and "Which switches have an official rule?"),
  `js/m5-lab-amf.js` (lisdexamfetamine `lis`, dexamfetamine `dex`), `js/m5-lab-ns.js` (atomoxetine `atx`, guanfacine `gua`; new
  curve models are in `js/release-model.js`). A lesson shows a lab with `<div data-ml="id"></div>`. Each lab has a day graph,
  dose steps or calculator, and a switch/convert tool. **Every conversion result carries an honest status badge** (SmPC table,
  SmPC statement, SPS equivalence, Guideline (no numbers), Local NHS protocol (not national), Worked out from the SmPC table
  (not official), No official conversion). Never show a worked-out or local figure as official. Facts were verified against emc
  SmPCs, SPS, NICE NG87 and MHRA on 1 Nov 2026 (BNF/BNFC were unreachable, so BNF-only figures stay in dropdowns labelled as
  not re-checked) and then re-checked by independent reviewers who found and fixed blockers (for example a converted adult dose
  above the licensed maximum with no warning). Tests: `node tests/m5-lab-mph.test.js`, `m5-lab-amf.test.js`, `m5-lab-ns.test.js`,
  `m5-quiz-mph.test.js`; keep them green and extend them for any new rule. Curves are schematic and relative (the shared model
  `js/release-model.js`), drawn at the same total area when two regimens are compared.
- **Module 5 now has 13 lessons:** glance; methylphenidate doses; release profiles; switching methylphenidate products
  (`#m5-switch`); day builder; lisdexamfetamine (`#m5-lis`); dexamfetamine (`#m5-dex`); atomoxetine; guanfacine;
  contraindications; titration; switching, stopping and CD rules; recap. Lesson-check order and the extra module-quiz questions
  are wired in `js/data-quiz-m5-wire.js` (loaded after `data-quiz-m5*.js`); quiz keys `m5x_mph_*`, `m5x_amf_*`, `m5x_ns_*`.
- **No published conversion exists** between lisdexamfetamine, dexamfetamine and methylphenidate, or between stimulants and
  non-stimulants (NICE says when, not how many mg). The labs say so plainly; the only mg table found for lisdexamfetamine to
  dexamfetamine is in NHS local documents (two written for shortages) and is shown only as a labelled local row.

## Site map

Main course (`index.html`, logic in `js/app.js`, data in `js/data-*.js`, styles in `css/styles.css`):
Home → m1 Overview & DSM-5-TR → m2 Neurobiology → m3 Recognition, referral & assessment → ag Assessment
Guide → dx Criteria & "Does it count?" → sim Case simulator → sp Special presentations → m4 NICE treatment
pathway → m5 Drug monographs & titration → m6 Monitoring, annual review & shared care → m7 Adverse effects,
interactions & special situations → m8 Differentials & comorbidity → m9 The pharmacist's role →
m10 Branching cases → m11 Practice handbook → Course exam → Final exam → Glossary → References.

Assessment workspace (`adhd-assessment/`): 13-step guided adult assessment, training modules, cases,
tools library, differential protocol. See its README and ARCHITECTURE.md.
