# Hair-loss consultation research: shared protocol

Every investigator follows this. It keeps the work honest, comparable and safe.

## 1. The goal

For one company, find out:

1. **Every hair-loss product** it sells (prescription, compounded, pharmacy, cosmetic, supplement, bundles): actives,
   strengths, form, who it is for, price, legal status.
2. **Every question** in its hair-loss consultation(s) (men, women, product-specific): exact wording, answer type,
   every answer option.
3. **What each answer does to the engine**: does the flow branch (extra questions, skipped questions), does it stop
   the patient, does it remove / add / switch a product or strength, or is it only marketing or data capture?
4. **What is recommended at the end** for each kind of patient.

The method for 3 is the classic one: **hold everything the same, change one answer, replay, compare.**

## 2. Hard rules (do not break these)

Allowed:
- Public pages, and consultation / quiz steps that work **without signing in**.
- Reading anything the site serves to an anonymous browser: page HTML, `__NEXT_DATA__`, JS bundles, JSON the page
  itself requested (walk.js saves these in `net/`). Quiz definitions often sit there and show every branch at once.
- Help centre, FAQs, terms, patient leaflets, pharmacy registration pages, published reviews, press, web search.
- Fictional quiz answers that are not contact details (age, sex, hair pattern, medical yes/no).

Not allowed:
- **No accounts and no sign-in.** Do not enter an email, phone number, name, address or password anywhere, real or
  made up. If a step needs one to continue, that is the **account wall**: stop that route and record exactly where it is.
- **No submitting a consultation for a clinician to review, no photos, no payment details, no orders.**
- **No defeating bot protection.** No CAPTCHA solving, stealth plug-ins, proxy tricks or header games. If a site shows a
  security checkpoint, record it and use other sources (web search, help centre, cached copies, press, reviews).
- **No guessing private APIs.** Only call URLs the anonymous page itself called. Never POST made-up patient data to an API
  outside the normal on-page flow.
- **Be gentle.** One browser at a time, no parallel crawling of one site, a couple of seconds between page loads.
- **Never run `pkill`, `killall` or anything that kills browsers.** Other investigators share this machine. walk.js closes
  its own browser.
- Never put any real person's details into a site. Never mention who this research is for.
- Only write inside your own folder `hairloss-research/companies/<slug>/` (or the folder your task names).

## 3. Evidence labels (every claim carries one)

| label | meaning |
|---|---|
| `observed` | You saw it happen in a live replay. Name the run folder as proof. |
| `code` | You read it in the site's own served code / JSON. Name the file or URL. |
| `docs` | The company says so in public (FAQ, help centre, product page, leaflet). Give the URL. |
| `inferred` | Your reasoning from clinical norms or indirect signs. Say why. Never present it as fact. |

If you could not find out, write `unknown`. **Never invent** a question, an option, a price, a strength or a rule.
A short honest report beats a long guessed one.

## 4. The tool: `walk.js`

`node /home/user/ADHD-learning/hairloss-research/tools/walk.js <actions.json> <outDir> [--last] [--from N] [--mobile]`

- `actions.json` = `{ "start": "<url>", "steps": [ ... ] }`. Steps: `click` (by `text` or `selector`, optional `nth`),
  `fill` (`label` or `selector` + `value`), `select`, `press`, `wait`, `goto`, `scroll`, `back`. Open the file header for details.
- It replays from a clean browser every time, so a run is a pure function of the answers. After each step it saves
  `NN.txt` (URL, visible text, every control and link with its href) and `NN.jpg`, plus `network.jsonl`, `net/*.json`
  (JSON the page fetched) and `storage.json` (local/session storage: quiz state often lives there).
- `--last` prints only the final screen (use it for replays); `--from N` prints from step N.
- Exit code 2 means a step failed; the printout lists the controls that were on screen so you can fix the step.
- If clicking a link does not navigate, read its href in `NN.txt` and use a `goto` step.
- Use a Bash timeout of at least 300000 ms for long replays. Write your own Playwright script if you need something
  walk.js cannot do (`require('playwright')` works anywhere; `chromium.launch()` needs no options).

Keep runs in `companies/<slug>/runs/<run-id>/`. Save the baseline answer file as `companies/<slug>/baseline-<flow>.json`.

## 5. Baseline patients (use these unless the site forces otherwise)

- **Man:** 32, male, receding hairline and thinning crown (Norwood 3), gradual over about 2 years, family history yes,
  no medical conditions, no medicines, no allergies, no previous hair treatment, no side-effect history, wants regrowth,
  no preference between tablets and topical (or the site's default).
- **Woman:** 38, female, widening parting / diffuse thinning on top (Ludwig I–II), gradual over about 2 years, not pregnant,
  not breastfeeding, not trying for a baby, using reliable contraception, periods regular, no conditions, no medicines.

One-change experiments, in rough priority order (do the ones the site actually asks):
sex · age (under 18, 18–21, over 65) · pregnancy / breastfeeding / trying to conceive / contraception · menopause ·
hair-loss pattern (patchy, sudden, all over, eyebrows/body) · how fast and how long · scalp symptoms (itch, pain, scale,
redness, scarring) · family history · medical conditions one at a time (heart disease, low or high blood pressure, liver,
kidney, prostate or breast cancer, depression / mental health, sexual dysfunction, thyroid, PCOS, anaemia) · medicines ·
allergies · previous treatments and side effects from them · treatment preference (tablet vs topical, "no finasteride",
"no prescription") · goals · lifestyle questions (stress, diet, smoking) · every option of any multi-select, one at a time.

## 6. What to write: `companies/<slug>/company.json`

One file per company. `node tools/validate.js <slug>` must pass before you finish. Shape (all text in plain UK English):

```jsonc
{
  "slug": "example", "company": "Example", "market": "UK", "website": "https://…", "parent": "…or null",
  "audiences": ["men", "women"],
  "model": "One line: what kind of business this is.",
  "checkedOn": "2026-11-23",
  "access": {
    "howTested": ["live-walk", "site-code", "public-docs"],          // any of these three
    "accountWall": "Where sign-in is forced, or null if never",
    "blockers": ["e.g. security checkpoint blocked the browser"],
    "coverageNote": "Plain summary of what was and was not tested."
  },
  "products": [{
    "id": "p1", "name": "…",
    "category": "rx-topical-compounded | rx-topical-licensed | rx-oral | rx-oral-compounded | otc-medicine | cosmetic | supplement | device | bundle | service",
    "actives": [{ "name": "finasteride", "strength": "0.1%" }],
    "form": "spray", "audience": "men | women | both",
    "legalStatus": "e.g. POM, unlicensed special (compounded) / POM licensed / P / GSL / cosmetic / food supplement / US compounded / US Rx / US OTC",
    "price": "£30 a month on a 3-month plan", "priceDetail": "other plan prices, first-order offers",
    "url": "https://…",
    "recommendedWhen": "Plain rule for when the consultation offers it (or 'unknown').",
    "evidence": "observed | code | docs | inferred"
  }],
  "flows": [{
    "id": "men", "name": "Men's consultation", "audience": "men | women | both", "entryUrl": "https://…",
    "stagesSummary": "e.g. 9 anonymous questions → account wall → medical questions (not tested) → checkout",
    "questions": [{
      "id": "men-q1", "order": 1,
      "stage": "anonymous | after-account | checkout",
      "text": "Exact question wording",
      "type": "single | multi | text | number | date | photo | info | consent | contact",
      "options": [{
        "label": "Exact option wording",
        "effect": "Plain words: what the engine does when this is chosen.",
        "effectType": "none | next-question | extra-questions | skip-questions | hard-stop | soft-warning | product-removed | product-added | product-switched | strength-changed | flag-for-clinician | marketing-only | unknown",
        "affects": ["p1"],                       // product ids, may be empty
        "evidence": "observed | code | docs | inferred | unknown"
      }],
      "purpose": "Why they ask it, in plain words.",
      "engineRole": "eligibility-gate | safety-screen | diagnosis | product-selector | personalisation | expectation-setting | marketing | data-capture | consent | identity",
      "branches": true, "branchDetail": "What changes downstream, or ''",
      "shownWhen": "always, or the condition that shows it",
      "evidence": "observed | code | docs | inferred"
    }]
  }],
  "rules": [{
    "id": "R1", "flow": "men",
    "when": "men-q5 = 'Yes' (heart condition)",
    "then": "Oral minoxidil is removed; only topical options are offered.",
    "effectType": "product-removed",              // same list as option effectType
    "affects": ["p3"], "evidence": "observed", "proof": "runs/exp-07 vs runs/baseline-men",
    "confidence": "high | medium | low"
  }],
  "experiments": [{ "id": "exp-07", "flow": "men", "changed": "men-q5: No → Yes", "result": "What changed against baseline.", "run": "runs/exp-07" }],
  "recommendations": [{ "profile": "Man, 32, hairline + crown, no medical issues", "offered": ["p1", "p2"], "default": "p1", "note": "", "evidence": "observed" }],
  "engineSummary": "A short plain-language explanation of how this company's engine decides.",
  "strengths": ["…"], "weaknesses": ["…"], "opportunities": ["A gap a new competitor could use."],
  "sources": [{ "title": "…", "url": "https://…" }],
  "limitations": ["What this report cannot tell you, and why."]
}
```

Also keep `companies/<slug>/notes.md`: a working log (what you tried, where the quiz definition lives, how to replay,
dead ends). The next investigator starts from it, so write it for a stranger.

Copy up to 8 key screenshots (first question, a branch, a stop screen, the recommendation screen) into
`companies/<slug>/shots/` with meaningful names.

## 7. The "explained" format (stage `explained`), added 24 Nov 2026

The owner found the first reports too vague. Every company is now written to the standard of the owner's own Voy
walkthrough (`owner-sources/voy-walkthrough.txt`, section "Step-by-step consultation"): for **every answer** say what
happens next, what the patient is offered (product, strength, price), and **why**, with the source. Plain UK English,
short sentences, every term defined the first time. Proof codes (run folders, file names, variable names) go in
`proof`, never in the explanation text.

New fields (all plain text; `plainEnglish` and `explained` may use simple Markdown: paragraphs, **bold**, lists):

```jsonc
{
  "plainEnglish": "The service in plain English (300–700 words): how the service works end to end; what the questionnaire really is (a rules engine? a marketing quiz? a form for a clinician?); the headline findings with specifics (which answers stop, which switch the product, which change nothing; product names and prices); what happens after the sign-in wall according to the company; what we could and could not see.",
  "flows": [{
    "steps": [{
      "id": "s5", "title": "Medical history",
      "summary": "One sentence verdict, e.g. 'The main safety screen. It changes the product but never stops or refers.'",
      "explained": "80–350 words: why a careful prescriber asks these questions; which answers UK guidance says should change the plan (name the source: SmPC section, NICE CKS, BAD leaflet, MHRA); what this company actually did (named product and price); the verdict (right, over-cautious, missing a stop, or no effect)."
    }],
    "questions": [{
      "step": "s5",                 // must match a step id in this flow
      "ref": "M14",                 // optional short code shown to the reader
      "expected": "Optional: what a careful UK prescriber or the guidance would expect this question to do, with source.",
      "options": [{
        "next": "What happens next, concretely: 'Next question', 'Opens a follow-up: \"…\"', 'Consultation ends: stop screen \"You aren't eligible…\"', 'Goes to the email wall'.",
        "outcome": "The offer with everything else at the baseline. Start with 'No change:', 'Changes to:', 'Removes:', 'STOP:' or 'Not tested:'. Name the product, strength and price shown, e.g. 'Changes to: Finasteride Tablets 1 mg, £12.42 a month (6-month plan); oral minoxidil removed.'",
        "why": "The reason, in labelled parts: 'Company says: …' (their rule, served code or help text), 'Evidence: …' (SmPC, NICE, BAD, MHRA, trial; name it), 'Likely reason: …' (our inference, labelled). Add 'A careful prescriber would …' when the company's behaviour falls short or overreaches.",
        "proof": "Run folders, files, rule ids or source sections that prove it (may be empty for docs-only claims)."
      }]
    }]
  }]
}
```

Rules:
- Every single, multi and consent question gets `next`, `outcome` and `why` on every option. Info screens get them on
  their Continue option if they list one. If something was not tested, say so in `outcome` ("Not tested: the served
  rules suggest …") rather than guessing.
- The same rationale may repeat across sibling options when it is genuinely the same (e.g. four hair-pattern pictures
  with no rule), but every option's `outcome` must be specific to that option.
- Keep `effect` as a one-line plain summary (it feeds the compare tables).
- New evidence label **`owner-run`**: seen in the owner's own browser research (the master report in
  `owner-sources/master-*.md` or the Voy walkthrough, 12–15 Nov 2026), not replayed by us. Use it for anything only
  those sources show. When they disagree with our own runs, keep both, say which is newer, and explain.
- Never copy personal details from the owner's sources (names, emails) into a report; cite them as "owner's master
  report, Voy §4.2" or "owner's Voy walkthrough, step M14".

`node tools/validate.js <slug> --stage explained` checks all of this.

Cross-checks: when the owner's master report covers the company (Voy, Hims UK, Numan, Sons, Hair + Me), add
`"crossCheck": [{ "topic": "…", "ours": "…", "owner": "…", "resolution": "…" }]` for every point where the two
disagree or where the owner's research adds something we did not have. Say which is newer and which you trust, and why.
