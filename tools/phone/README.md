# Phone checks

Small scripts used to test the course on a phone. They need Playwright (`npm i -D playwright` or a global install) and
the site served locally: `python3 -m http.server 5500` from the repo root.

| Script | What it does |
|---|---|
| `node tools/phone/audit.js 5500 375 out.json [m5,m6] [shotDir]` | Opens every lesson of every module (or the listed ones) at 375px (or 320 / 414) and records sideways overflow, tap targets under 40px, tiny text, page height and console or network errors. `Q=noparts node …` measures full lesson length (the phone shell normally cuts tall lessons into parts). |
| `node tools/phone/shoot.js 5500 375 m5 4 out.png ["css|css"]` | Screenshot of one lesson (1-based), optionally clicking selectors first. |
| `node tools/phone/textsnap.js 5500 m6 before.json` | Saves all text of a module (open or folded) so a layout change can be checked afterwards. |
| `python3 tools/phone/wdiff.py before.json after.json` | Lists words that occur fewer times after a change. Use it after restructuring a module: it should print nothing important. |
| `python3 tools/phone/textdiff.py before.json after.json` | Stricter: numbers and whole sentences that disappeared. Noisy when lessons were re-flowed into cards. |

Typical flow after a layout change: snapshot the module from the old commit (`git archive <commit> | tar -x -C /tmp/old`, serve it on
another port), snapshot the new page, run `wdiff.py`, then `audit.js` at 375 and 320.
