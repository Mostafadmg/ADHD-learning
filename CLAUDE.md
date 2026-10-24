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

- **Rebuilt on the template:** m1 (24 Oct 2026), m2 (24 Oct 2026; `js/m2-curve.js`), m3 (25 Oct 2026; `js/m3-baseline.js`).
- Shared module styles use `:is(#m2,#m3)` in `css/styles.css`: add each newly rebuilt module id to that list (one find-and-replace) so it gets the same card system.
- M3 owns recognition/referral (NG87 1.2), who diagnoses and what assessment includes (1.3), the tool kit, collateral/impairment and the pre-treatment baseline (1.7). Criteria live in M1; step-by-step assessment in section A; criteria checker in section B.
- **Not yet rebuilt:** everything else. Old dark XP explorers no longer used: `imp` (m1), `pfc` (m2) in
  `js/explorers-config.js`; remove once no module needs them.

- **One website (25 Oct 2026):** the course sidebar has a "Clinician workspace" group and the home page a workspace card; the workspace sidebar and sign-in screen link back to `../index.html#home`. Course deep links such as `adhd-assessment/index.html#form-phq9` survive sign-in (`AA.router.takePending()/afterSignIn()`). When changing a workspace script, add/bump `?v=` on its `<script>` tag (bundle.js strips the query).
- M3 lesson 6 (`js/m3-forms.js`) summarises the workspace forms guide (`adhd-assessment/js/data/forms-guide.js`); if scoring facts change there, update both.

## Site map

Main course (`index.html`, logic in `js/app.js`, data in `js/data-*.js`, styles in `css/styles.css`):
Home → m1 Overview & DSM-5-TR → m2 Neurobiology → m3 Recognition, referral & assessment → ag Assessment
Guide → dx Criteria & "Does it count?" → sim Case simulator → sp Special presentations → m4 NICE treatment
pathway → m5 Drug monographs & titration → m6 Monitoring, annual review & shared care → m7 Adverse effects,
interactions & special situations → m8 Differentials & comorbidity → m9 The pharmacist's role →
m10 Branching cases → m11 Practice handbook → Course exam → Final exam → Glossary → References.

Assessment workspace (`adhd-assessment/`): 13-step guided adult assessment, training modules, cases,
tools library, differential protocol. See its README and ARCHITECTURE.md.
