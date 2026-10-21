# ADHD Learning App for Pharmacists

Interactive, evidence-based learning resource covering ADHD diagnosis, differential assessment, management, titration, monitoring, mechanisms of action and pharmacist practical points.

**Based on:** NICE Guideline NG87 (last reviewed July 2026), BNF, DSM-5.

## Features
- Modern professional design using **Fredoka** font
- Detailed teaching modules with visual learning
- Medication pathways, titration timelines, monitoring checklists
- Static single-page app: interactive quizzes, branching cases, titration stepper, checklists

## Deploy / View Live

This is a static site. To deploy for free with GitHub Pages:

1. Go to the repository **Settings** → **Pages**
2. Under **Build and deployment**, set Source to **Deploy from a branch**
3. Select branch **main** and folder **/** (root)
4. Save

After a minute or two the site will be live at:

**https://mostafadmg.github.io/ADHD-learning/**

You can also open `index.html` locally in any browser.

## Structure
- `index.html` — single-page app (11 modules incl. the Module 11 practice handbook, course exam, final quiz, references)
- `css/styles.css`, `js/app.js` and data files (`data-quiz.js`, `data-cases.js`, `data-titration.js`, `data-brands.js`); `handbook.js` holds the Module 11 interactives
- `images/` — 35 AI-generated teaching illustrations (clinical labels are in HTML/SVG)

No build step; only external dependency is Google Fonts (Fredoka) with a system-font fallback. Progress is stored in the browser's localStorage. Content last checked 20 Oct 2026.

## Source
Educational use only. Always consult current NICE guidance, BNF and local protocols for clinical decisions.
