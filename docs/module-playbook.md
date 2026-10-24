# Module playbook

How to rebuild any module so it matches Module 1 (the reference). Follow it step by step, every time.
Module 1 lives in `index.html` (`section#m1`); copy its markup when in doubt.

## 1. Process

1. **Read everything first**: the module's HTML, its figures, its interactive explorer (`js/explorers*.js`),
   its quiz items (`js/data-quiz*.js`, keys `<id>` and `add('<id>',…)`), and any linked data files.
2. **Review and report**: score content and UI out of 10. List accuracy errors first, then gaps for the
   mission (beginner to specialist and clinical lead), extras to cut, language, structure and UI.
3. **Accuracy pass**: check every clinical fact against NICE NG87, BNF, SPCs, MHRA, DSM-5-TR, ICD-11 or
   named papers. Never invent doses, cut-offs, clause numbers or statistics. If not sourced, label it
   "Clinical practice". Tell the owner which facts could not be checked live.
4. **Plan lessons**: 6–10 lessons of 3–6 minutes, each one idea. Order: plain-words "what is it" →
   core knowledge → applying it → clinical judgement → recap.
5. **Build** (section 2), **write practice** (section 4), **QA** (section 6), then report what changed.
6. Back up `index.html` to the scratchpad before restructuring; check word and tag counts afterwards so
   nothing is lost.

## 2. Page structure

```
<section class="module" id="mX" data-stack-tables data-track="1" data-title="…">
  <div class="mod-head solo">                    ← overview: its own first screen
    kicker "Module X · <stage>", h1, ul.mod-meta chips (~time in N short lessons · N practice questions
    + N flashcards · Suggested CPD record · Last reviewed · Based on <sources>), 2–3 sentence plain intro,
    .objectives ("By the end of this module you can", 5–7 action verbs), optional details route box
  </div>
  <div class="lessons" data-lessons="mX">
    <section class="lesson" data-title="Short title" data-min="4"> h2.ls-h + teaching </section> …
    <section class="lesson" data-title="Recap and practise" data-min="12">
      h2.ls-h, .takeaways ("5 things to remember"), Practise box, details.sources-d, .complete-row
    </section>
  </div>
</section>
```

The lesson engine (`js/app.js`) builds the sticky lesson bar ("Lesson 2 of 10 · title · min"), clickable
progress segments, the "All lessons" menu with Overview, Previous/Next buttons, and remembers the place.
**No quizzes inside lessons.**

## 3. Components (reuse, do not reinvent)

| Need | Use |
|---|---|
| Long list of items with details | `table[data-cards="ia"|"hi"]` → tappable cards + detail panel (first 2 columns = card, rest = detail) |
| Numbers / epidemiology | `.stat-grid > .stat` (`.stat-n` big number, `.stat-l` label, `.stat-s` source). With exactly 3 tiles add `.stat-3` so they fill the row (no empty gaps) |
| Risk factors or causes with uneven evidence | `.ev-list > .ev-group` with `.ev-tag.ev-strong` "Clear link" / `.ev-mod` / `.ev-weak`, each with a `ul` of `li > b + span` |
| Myths and misconceptions | `.mf-grid > div.mf.mf-static` "Myths and facts" cards, answer always visible (owner does not want tap-to-reveal here): `.mf-v.mf-myth|mf-fact|mf-part` pill, `.mf-q` claim, `.mf-a` explanation; card tinted by verdict. Use 3 or 6 cards |
| Drug / topic summary | `dl.glance > .gl.gl-cls|how|fast|slow|dur|cd|nocd|clr` at-a-glance strip right under the "In one line" sentence (3 across, 2 on phones; green = fast/not CD, amber = slow, red = CD) |
| Clinical meaning of a mechanism | `h3.clin-h` "In clinic" + `.clin-grid` with three `.clin-c` cards: `.clin-n` What the patient notices · `.clin-s` Side effects the mechanism explains · `.clin-p` Practical point |
| Pointing to other modules | `.deeper` "Go deeper:" pill links (`<a href="#m5">…</a>`), instead of repeating content owned by another module |
| Comparing several drugs/options | `.cmp-wrap > table.cmp[data-nostack]` matrix, sticky first column, coloured header groups, `.pill.p-*` chips; scrolls sideways on phones |
| Teaching the "players" behind a mechanism | Key-players explorer (`.fx.kp-fx[data-practice]`, panels `.kp-panel` with `.kp-grid`: Where it is · Its job · What medicines do to it · What that means for the patient, plus `.kp-ana` everyday picture). Define every abbreviation correctly (DAT = dopamine transporter) and add the terms to `js/lab-data-gloss.js` |
| A set of tools/options that each do a different job | Job lanes: `.tk-filter` (age chips: All · Children · Adults) + `.tk > .tk-lane.tk-<job>` with a coloured `.tk-job` label (job name + the question it answers) and 1–2 `.tk-tool` cards (`data-age="child|adult|both"`, `.tk-chips` for who / age / Free·Licensed, `.tk-lim` "What it can't tell you"). Order lanes in the order they are used |
| A care pathway / journey overview | `.tl-key` + `ol.tl` timeline: numbered nodes with SVG icons on a continuous line, `li.in` (this module, solid teal) vs `li.out` (elsewhere, outlined), `.tl-tag` labels that link (`<a href="#mX">`) to other modules. Vertical on phones |
| A NICE decision pathway | `.bflow`: `.bf-step` numbered steps with `.bf-ref` clause chips → `.bf-fork` ("After X, how are things?") with two `.bf-way` outcomes (`.bf-ok` green / `.bf-go` amber) → `.bf-rule` (red) for a "must not" rule. Never put a rule in as a numbered step |
| How a medicine works, start to finish | `h3.chain-h` "From pill to effect" + `ol.chain` (5 steps, last = effect in green) + `.chain-else` "Elsewhere in the body (side effects)" |
| Stepped mechanism diagram | `.mech` with layered SVG (`.lay.onN`); gentle CSS motion is automatic (molecules drift, red blockers pulse, arrows flow); respects reduced motion |
| Patient script | `.say` navy card with `.fx-lbl` "How to explain it to a patient" and a quoted `p` |
| A list of groups/risks | `ul.risk-grid > li` (`strong` + `span` detail) |
| Several topics with the same facets | Feature explorer: `div.fx[data-practice]` with `.pr-tab.fx-tab` buttons and `.pr-panel.fx-panel` panels; each panel = what it is, what patients say, could it be something else, ask this, why it matters for prescribing |
| Cost/benefit by area | `.cost-grid > article.cost` (navy header + SVG icon, coral "without treatment", teal "evidence", source line) |
| Rules / criteria | table with `.crit-tbl` letter badges, or visual cards like `.rec-grid` (presentation ✓ grid, severity scale, timeline) |
| Picture with numbered markers | `figure.wt` walkthrough (auto stepper: one step at a time) |
| Teaching picture | `figure.m1-pic` + `.m1-notice` "what to notice" cards with an **Ask:** line |
| Decision tool | a small dedicated script like `js/m1-impact.js`: presets (patients), inputs, live verdict, checks with sources, "what you would do next" |
| Key messages | `.callout` (teal), `.callout.warn` (amber, "how to read the evidence"), `.callout.note` |
| Icons | inline SVG line icons, `stroke="currentColor"`, white on teal/navy squares. **Never emoji** (they render black on some systems) |

Tables in `[data-stack-tables]` sections turn into labelled cards on phones automatically; add
`data-nostack` to keep a small grid as a table.

### Consistency rules (one card system per module)

Module 2 sets the standard (CSS block "Module 2: one consistent card system"); copy it for each rebuilt
module, scoped to `#mX`:

- **Static cards**: same shape everywhere (1px border, 14px radius, padding `.85rem 1rem`, no shadows
  inside a lesson) but **coloured by meaning** with soft tints: numbers = teal tint + teal top bar;
  evidence = green / amber / grey tint with a left bar; myths = red / green / amber by verdict; info cards
  (networks, routes, medicine cards) = pale teal. Not all-white: the owner wants colour.
- **Clickable cards**: same look, teal border on hover, teal ring (`box-shadow:0 0 0 1px var(--teal)`)
  when selected. No lift/transform.
- **Eyebrow labels** (small caps above text): `.72rem`, 700, uppercase, `.06em` spacing, muted grey
  (teal for tool kickers, light teal on navy).
- **Status pills** (verdicts, evidence strength): the same pill style everywhere.
- **Icon squares**: teal with white SVG line icons.
- **Grids**: same `.6rem` gap; 4 items = 2 × 2, 3 or 6 items = 3 across; never leave a lonely card.
- Navy blocks only for the two "voice" elements: the patient script (`.say`) and the takeaways.

## 4. Practice (final lesson only)

Practise box (`div.practice[data-practice]`), tabs in this order:

1. **Flashcards** — `.flip-grid[data-deck]`, 8 cards, one at a time.
2. **Spotter** — 8–10 "recognise it" items (quote or scenario → pick the concept), key `<id>spot`.
3. **Lesson checks** — 2 questions written per lesson (`add('<id>l<n>',…)`), combined in lesson order:
   `Q.<id>checks=[].concat(Q.<id>l1,…)`.
4. **Module quiz** — 15–20 questions, at least a third clinical vignettes (`v:1`).

Quizzes render one question at a time with dots, progress bar and results screen. Inside the Practise
box they are `data-open`.

**Every explanation teaches**: why the right answer is right, why the tempting wrong ones are wrong, the
practical point, and the source in `s:`. Never "NG87 1.2.3." alone. Use real-sounding names and ages
(they/them for unnamed people).

## 5. Writing style

- Plain UK English, short sentences, define every term the first time, explain the *why*.
- Start each lesson with the idea in plain words, then the detail, then what it means in clinic or for
  prescribing ("Why it matters for prescribing").
- Prefer visuals, cards and interactives over paragraphs; no paragraph longer than ~4 lines.
- Give examples from adult practice as well as children.
- Show evidence honestly: say when data are observational ("association, not proof").
- Remove anything personal to the owner ("your workbook") and any repetition.

## 6. QA before reporting

- Browser at http://localhost:5500/#mX: every lesson, every tab, quizzes answer and score, no console
  errors, no 404s (`performance.getEntriesByType('resource')`).
- Phone width (375 px): no sideways scroll, tables stack, tabs scroll, buttons ≥ 44 px.
- Bump `?v=` on local CSS/JS links in `index.html`.
- Update the module's sources list (closed dropdown) with every new reference.
- Report: what changed, what could not be verified, what the owner must supply (images, reviewer name).

## 7. The owner's preferences (learned)

- Has ADHD: visual, interactive, short chunks, minimal scrolling, collapsed by default.
- Font **Fredoka** (do not change it).
- Overview is its own page; Next starts lesson 1. Lesson progress segments are clickable.
- Quizzes and sources live at the end, not inside lessons; sources in a closed dropdown but always kept.
- Painted, warm, semi-realistic image style (`docs/image-style-guide.md`); no text errors in images.
- Wants commercial quality: a paid course for clinicians that could be sold.
- Grids must be full: no lonely tiles or empty columns. Give each lesson one focal point, and avoid a
  wall of same-weight boxes. Show strength of evidence, not just lists.
