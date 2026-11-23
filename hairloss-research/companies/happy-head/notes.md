# Happy Head (US): working notes, stage 1 (MAP)

Checked on 23 Nov 2026.

## Blocker found in the first minute: robots.txt tells Claude agents to stay out

`https://www.happyhead.com/robots.txt` (saved in `raw/robots.txt`, "Last updated: April 2026") has:

    User-agent: ClaudeBot      Disallow: /
    User-agent: Claude-Web     Disallow: /
    User-agent: Claude-User    Disallow: /
    User-agent: anthropic-ai   Disallow: /

`Claude-User` is the name for Claude fetching pages for a user. The investigator on this project is Claude.
The site does load with curl and a browser user-agent, but getting in that way would mean hiding who is asking
in order to get past a rule written for exactly this agent. The protocol bans "header games", so I stopped.

What this means for this folder:

- **No live walk, no site code, no page fetches from happyhead.com** were used for this map.
- One request for the home page went out in the same command as the robots.txt request, before robots.txt had been
  read. That file was deleted unread and nothing in this map comes from it.
- The map below is built from other public sources only (search results, independent reviews, press, pharmacy and
  regulator records). Every claim is labelled `docs` (with its URL) or `inferred`.
- If the owner of this research wants a live walk, that is their decision to make knowingly; it is not one for an
  investigator to make silently.

(Work log continues below.)

## Update 22:15 — hosts and what each allows (robots.txt read for each host)

| host | what it is | robots.txt for Claude | used? |
|---|---|---|---|
| www.happyhead.com | marketing site, product pages, blog, legal | **Disallow: / for ClaudeBot, Claude-Web, Claude-User, anthropic-ai** | **No. Not fetched.** |
| www.form.happyhead.com | the consultation ("Assessment") app | `User-agent: * / Disallow:` (open to all) — `raw/form-robots.txt` | Yes, with walk.js |
| engine.embeddables.com | third-party quiz engine the form page calls | n/a (URL the page itself requested) | Yes: quiz definition |
| happyhead.zendesk.com/hc | help centre | open to all on /hc/ — `raw/zendesk-robots.txt` | Yes, with walk.js (curl and a bare headless browser get a Cloudflare "Just a moment" page; walk.js loads normally) |
| my.happyhead.com | customer account | not visited (sign-in) | No |

## THE QUIZ DEFINITION (most valuable find)

The consultation is an **Embeddables** flow. The form page requests
`https://engine.embeddables.com/init?load={"embeddablesToLoad":[{"id":"flow_d02099468c5fg664dh31b7cg"}],"originUrl":...}`
and gets back the whole flow: 62 pages, every component, page conditions, 58 computed fields, 132 data outputs,
experiments. Saved as `quiz-definition.json` (same file as `raw/embeddables-init.json`), flow title
"Happy Head - Primary Flow - Test", version 141.

### What the definition shows (read from `raw/flow-dump.txt`, made by `python3 -I tools/dump-flow.py`)

- Two question sets in one flow, switched by URL key `l`: `l=false` = the current short "v2" set (what the site's
  START NOW link uses: `/get-started/?l=false&ph=true`), anything else = the older landing-page set.
- Other URL keys: `consult=true` (product-specific consult: skips method question, adds doctor/BP/weight questions when
  the `pid` is an oral or dutasteride product), `pid` (product ids), `rec=problends`, `ot=var1` (one-time purchase page),
  `upgrade=derm|cp`, `email_capture=sms_capture|early_capture`, `coupon`, `jf2`, `s_p=a1|b1` (plan page), `lpvar`.
- The anonymous recommendation is made by `POST https://api.happyhead.com/middleware/product-recommendation`
  (through request.embeddables.com) with only: synthetic dateOfBirth from the age band, gender, preferred method,
  and any `pid`. Code: action `_a18938682205317825` in `raw/logic-actions.txt`.
- Medical questions come AFTER the product choice and BEFORE the email page. The email page is the account wall.

## Update 22:55 — live baseline (men) reaches the recommendation screen without any contact details

`node ../../tools/walk.js baseline-men.json runs/baseline-men` — the screens match the definition word for word.
Recommendation API call seen live (runs/baseline-men/network.jsonl):
`POST api.happyhead.com/middleware/product-recommendation {"dateOfBirth":"1975-11-23","userChosenPids":[],"userPreferredMethods":["Oral","Topical"],"gender":"Male"}`
(the date of birth is made up by the page from the age band: no birth date has been asked yet).
Response (runs/baseline-men/net/18-*.json) lists the exact compounded formulas, pharmacy, quantities and prices.
`python3 -I tools/reco-compact.py runs/<run>` prints it in short form.
