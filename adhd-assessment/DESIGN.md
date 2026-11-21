# Design system: how every workspace page should look and read

The workspace is used by busy clinicians, and the owner has ADHD and learns visually. Every page must be **easy to scan,
calm, and professional**: short chunks, clear hierarchy, depth on demand. Brand colours and fonts stay those of
`css/app.css` (they match the EveryDayMeds Rx portal). Shared styles: `css/ds.css`. Shared builders: `AA.ui` in
`js/components/ui.js` (section "Design system building blocks").

## Rules (apply to every page)

1. **One page, one purpose.** Start with a page head (eyebrow, title, one-sentence lead, primary action) and, where useful,
   a hero card (`ui.hero`) that says what the page is for, with stat tiles or the main action.
2. **Structure, not prose.** Turn text into the component that fits it (table below). A paragraph longer than about
   3 lines is a smell: split it, or turn it into cards, steps or a table.
3. **No boxes inside boxes.** At most one level of card. Inside a card use hairlines, spacing, a coloured left bar, a
   dot or a label, never another bordered or shadowed box. Grouped disclosures go in one `ui.acc` card.
4. **Even padding.** Content sits about 1.25 to 1.5rem from a card's edge and lines up with the card's title.
5. **One thing at a time.** Long sets (more than about 6 big items: steps, symptoms, conditions, questions) use
   `ui.stepper` or tabs (`ui.tabs`), not a long stack. Aim for each screen to fit in about two phone screens.
6. **Collapsed by default.** Depth (rationale, examples, pitfalls, references) goes in closed disclosures or an `ui.acc`.
   Sources go in one closed "Sources" disclosure at the end (`.guide-src` or `ui.details('Sources', ...)`). No clause
   chips or "(NG87 1.3.1)" brackets inside body text.
7. **Group logically.** Long lists are grouped by purpose; each group has a title, a one-line purpose and a count.
8. **Plain UK English.** Short sentences, define a term the first time, the "why" in one line. Inclusive wording.
9. **Phone first.** No sideways scroll at 390 and 320px wide; tap targets at least 44px; no text below 13px.
10. **Accessible.** Real buttons and links, labels, visible focus, colour never the only signal, headings in order.

## Turning text into structure

| The content is… | Use |
|---|---|
| 3 to 9 parallel ideas, principles, tests or options | `ui.cards(items)` (icon or number, title, one line) |
| a short process in order (3 to 7 steps) | `ui.steps(items)` |
| a long set of big items to work through (protocol steps, symptoms, cases) | `ui.stepper(items, opts)` |
| many items each with detail on demand (principles, FAQs, pitfalls) | `ui.acc(items)` (one card, hairlines) |
| numbers worth remembering | `ui.stats(items)` inside `ui.hero({ aside })` |
| a long reference page with sections | `ui.split(content, ui.toc(sections))` + `ui.section(...)` |
| filters or quick links | `ui.chips(items)` |
| label and value pairs | `dl.ds-kv` |
| a comparison across the same attributes | a table (`ui.table` or `.table`) |
| a warning, a safety point | `ui.callout('warn' or 'err', ...)` (left bar) |

## Builders (js/components/ui.js)

- `ui.icon(name)`: line icons (`ui.ICONS` lists them: check, clock, alert, info, book, layers, search, users, file,
  compass, target, repeat, eye, shield, heart, brain, list, link, flag, chart, calendar, pill, mail, route, school,
  star, scale, timeline, moon, drop, spark).
- `ui.hero({ eyebrow, title, text, actions, aside, h1 })`.
- `ui.stats([{ n, l, s }])`: number, label, source (small).
- `ui.cards([{ icon | n, title, text, meta, tone, go | onClick }], { wide })`.
- `ui.steps([{ title, text }] | [strings])`.
- `ui.stepper([{ title, sub, label, done, render }], { start, eyebrow, onChange, label })` -> `.show(i)`, `.index()`, `.refresh()`.
- `ui.acc([{ title, meta, n, render, open }], { title, actions })`: bodies are built on first open.
- `ui.section({ id, title, text, actions }, content)`.
- `ui.toc([{ id, label }], { label })`: highlights the section in view; becomes a chip row on narrow screens inside `ui.split`.
- `ui.split(main, aside, { left })`, `ui.chips([{ label, n, on, onClick | go }])`.
- Existing: `ui.pageHead`, `ui.btn`, `ui.badge`, `ui.callout`, `ui.details`, `ui.tabs`, `ui.table`, `ui.seg`, `ui.check`, `ui.field`, `ui.input`.

## What not to change when restyling a page

- Clinical facts, numbers, sources and their meaning. You may shorten or split text, never change what it says.
- Route names, record keys, data ids, test hooks. Behaviour stays the same unless the brief says otherwise.
- Shared files (`css/app.css`, `css/ds.css`, `js/components/ui.js`) unless you own the design system task; ask for new
  shared pieces in your report. View CSS stays in the view's own file and prefix.

## Check before you finish

- `node tests/run.js` (all checks pass) and `node tests/smoke.js` (no console errors, render failures or overflow).
- Screenshots at 1440px and 390px of every page you changed; look at them. Spot-check the dark theme (`data-theme="dark"`).
