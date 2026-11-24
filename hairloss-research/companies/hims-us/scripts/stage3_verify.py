#!/usr/bin/env python3
"""stage3_verify.py: stage 3 (VERIFY) corrections to company.json. Safe to re-run (idempotent)."""
import json
F = 'company.json'
c = json.load(open(F, encoding='utf8'))
P = {p['id']: p for p in c['products']}
R = {r['id']: r for r in c['rules']}
gi = next(f for f in c['flows'] if f['id'] == 'men-gi')
Q = {q['id']: q for q in gi['questions']}

# 1. Options that stage 2 left as "inferred" and stage 3 replayed (one change each, against runs/verify-baseline-men-gi)
opt_runs = {
 ('gi-q4', 'In the past year'): 'runs/verify-start-past-year',
 ('gi-q5', 'More scalp coverage'): 'runs/verify-expect-scalp',
 ('gi-q5', 'Keep the hair I have'): 'runs/verify-expect-keep',
 ('gi-q6', 'Textured or processed'): 'runs/verify-type-textured',
 ('gi-q7', 'Medium'): 'runs/verify-length-medium',
 ('gi-q13', 'I usually wear a hat'): 'runs/verify-style-hat',
}
for (qid, lab), run in opt_runs.items():
    o = next(o for o in Q[qid]['options'] if o['label'] == lab)
    o.update(effect='No change (stage 3 one-change replay): same 15 screens in the same order, same wording, same end at the state screen; the server received the changed answer. Proof: ' + run + ' vs runs/verify-baseline-men-gi.', effectType='none', evidence='observed')
ae = next(o for o in Q['gi-q15']['options'] if o['label'] == 'AE')
ae.update(effect='HARD STOP (stage 3): server reply isValid false; red message "Currently, we don\'t offer this product in your state"; Continue disabled. Proof: runs/verify-state-ae (screenshot shots/verify-state-ae-not-offered.jpg).', effectType='hard-stop', evidence='observed', affects=['p1','p2','p3','p4','p5','p6','p7','p9'])
for o in Q['gi-q15']['options']:
    if o['label'] in ('AA', 'Massachusetts'):
        o['effect'] += ' Re-confirmed in stage 3: ' + ('runs/verify-state-aa' if o['label'] == 'AA' else 'runs/verify-state-ma') + '.'  if 'stage 3' not in o['effect'] else ''
# sweep-only options: keep "observed" but say so
sweep_only = {'gi-q3': ['A little Only I notice'], 'gi-q4': ['Not sure'], 'gi-q5': ['A stronger, defined hairline', 'All of the above'], 'gi-q6': ['Curly or coily'], 'gi-q7': ['Long'], 'gi-q9': ['Not sure'], 'gi-q10': ['Rarely', 'Not sure'], 'gi-q13': ['Products Gel, mousse, etc.'], 'gi-q14': ['5-10 minutes']}
for qid, labs in sweep_only.items():
    for o in Q[qid]['options']:
        if o['label'] in labs and 'multi-change sweep' not in o['effect']:
            o['effect'] += ' Note (stage 3): seen only in a multi-change sweep (runs/exp-gi-14-all-different or runs/s2-gi-explore-2), not in a one-change replay.'

# 2. Experiments
exps = [
 ('verify-baseline-men-gi', 'men-gi', 'Nothing (stage 3 fresh baseline replay)', 'Matches runs/s2b-baseline-men-gi exactly (scripts/cmp.js: no difference): 15 screens, Texas valid, Continue disabled with the consent box unticked.'),
 ('verify-baseline-lp-prequiz', 'lp-prequiz', 'Nothing (stage 3 fresh baseline replay: Both, Yes, Yes)', 'Same steps, scroll positions and call-to-action links as runs/s2-baseline-lp-prequiz.'),
 ('verify-baseline-men', 'men', 'Nothing (stage 3 re-test of /c/hl/goals)', 'Still a blank page: the old app is still blocked.'),
 ('verify-baseline-women', 'women', 'Nothing (stage 3 re-test of forhers.com/hair-loss)', 'Still Cloudflare "Performing security verification".'),
 ('verify-state-aa', 'men-gi', 'gi-q15: Texas → AA (re-test of R23)', 'Hard stop confirmed: isValid false, "Currently, we don\'t offer this product in your state".'),
 ('verify-state-ae', 'men-gi', 'gi-q15: Texas → AE (first test)', 'Hard stop, same as AA and AP: isValid false and the same message.'),
 ('verify-state-ma', 'men-gi', 'gi-q15: Texas → Massachusetts (re-test of R25)', 'Valid, no message, no other change. R25 confirmed.'),
 ('verify-start-past-year', 'men-gi', 'gi-q4: Over a year ago → In the past year', 'No change.'),
 ('verify-expect-scalp', 'men-gi', 'gi-q5: Visibly thicker → More scalp coverage', 'No change.'),
 ('verify-expect-keep', 'men-gi', 'gi-q5: Visibly thicker → Keep the hair I have', 'No change (this run did not hit the error screen that stopped stage 2).'),
 ('verify-type-textured', 'men-gi', 'gi-q6: Straight or wavy → Textured or processed', 'No change.'),
 ('verify-length-medium', 'men-gi', 'gi-q7: Short → Medium', 'No change.'),
 ('verify-style-hat', 'men-gi', 'gi-q13: No styling → I usually wear a hat', 'No change.'),
]
have = {e['id'] for e in c['experiments']}
for i, f, ch, res in exps:
    if i not in have:
        c['experiments'].append({'id': i, 'flow': f, 'changed': ch, 'result': res, 'run': 'runs/' + i})

# 3. Rules
R['R21']['then'] = 'Nothing changes: same screens, same order, same wording, same end at the state screen. No question is added or skipped, no warning, no stop, no product. All 40 options of the 11 questions have now been seen live: 18 in one-change replays by stage 2, 6 more in one-change replays by stage 3, and the rest as the baseline answer or in 2 multi-change sweeps.'
R['R21']['proof'] = 'runs/exp-gi-01 to exp-gi-06, exp-gi-08 to exp-gi-14, runs/s2-gi-explore-2, runs/verify-start-past-year, verify-expect-scalp, verify-expect-keep, verify-type-textured, verify-length-medium, verify-style-hat vs runs/s2b-baseline-men-gi and runs/verify-baseline-men-gi'
R['R23']['when'] = 'gi-q15 state = AA, AE or AP (US armed forces mail addresses)'
R['R23']['proof'] = 'runs/exp-gi-15-state-aa, runs/exp-gi-18-state-ap, runs/verify-state-aa, runs/verify-state-ae vs runs/s2b-baseline-men-gi'
R['R25']['proof'] = R['R25']['proof'].split(' ; stage 3')[0] + ' ; stage 3 re-test: runs/verify-state-ma'
R['R26']['proof'] = 'runs/s2b-baseline-men-gi and runs/verify-baseline-men-gi (result.json: continueDisabledWithoutTick true, measured after Texas was chosen; screenshot 14-select-state-after-select.jpg)'
R['R27']['confidence'] = 'medium'
R['R27']['then'] = 'Probably refused: the flow settings served to the browser say minAge 18, "Must be at least 18 years of age." The date-of-birth screen itself is after the wall and was not seen, so the refusal was not watched happening. Backs up R1.'
R['R27']['proof'] = 'runs/s2b-baseline-men-gi/net/01-GET-initialize.json and runs/verify-baseline-men-gi/net/01-GET-initialize.json (context.metadata.validation.dateOfBirth)'
for rid in ('R1', 'R2', 'R3', 'R5'):
    if 'runs/verify-docs' not in R[rid]['proof']:
        R[rid]['proof'] += ' ; wording re-read live in stage 3: runs/verify-docs'

# 4. Products: prices re-checked on live pages (runs/verify-products, no-JavaScript HTML + the page's own schema.org offer)
note29 = 'Re-checked in stage 3 (23 Nov 2026, later the same day): the /hair-loss landing page and the product page now both show "Starting at $29 per month" and the page\'s own product data says price 29 USD (runs/verify-products). Stage 1 had seen "Starting at $35" on the landing page a few hours earlier, so the price moved during the day (or differs by test group). '
for pid in ('p1', 'p2', 'p3', 'p5'):
    p = P[pid]
    p['price'] = 'Starting at $29 per month (landing and product pages, re-checked 23 Nov 2026)'
    if 'stage 3' not in p['priceDetail']:
        p['priceDetail'] = note29 + 'The /lp page adds "*With a 10-month plan, paid upfront in full. Pricing varies by subscription plan"; the main landing page no longer shows that footnote in its served text. Earlier stage notes: ' + p['priceDetail']
P['p4']['price'] = 'Starting at $33 per month (landing and product pages, re-checked 23 Nov 2026)'
if 'stage 3' not in P['p4']['priceDetail']:
    P['p4']['priceDetail'] = 'Re-checked in stage 3: landing page and product page both "Starting at $33 per month"; product data price 33 USD (runs/verify-products). Stage 1 had seen $39 on the landing page earlier the same day. Earlier notes: ' + P['p4']['priceDetail']
if 'stage 3' not in P['p8']['priceDetail']:
    P['p8']['priceDetail'] += ' Stage 3: the page text still says "Out of stock", while the page\'s own product data says InStock at 60 USD (runs/verify-products); the two disagree.'
if 'stage 3' not in P['p16']['priceDetail']:
    P['p16']['priceDetail'] += ' Stage 3: the visible $18 / $17 confirmed; the page\'s product data says 15 USD, which does not match the visible price.'
if 'stage 3' not in P['p10']['priceDetail']:
    P['p10']['priceDetail'] += ' Stage 3: the page\'s product data says 19 USD (matches the subscription price); the $20 one-time price was not visible in the served text and is not re-confirmed.'
for pid in ('w1', 'w2', 'w3', 'w4'):
    if 'stage 3' not in P[pid]['priceDetail']:
        P[pid]['priceDetail'] += ' Stage 3: forhers.com still blocked; existence rests on search-engine listings of forhers.com pages, and any price comes from third-party reviews (NCOA), not from Hers.'

# 5. Access / limitations
a = c['access']
a['coverageNote'] = a['coverageNote'].replace('(34 of 40 options seen live)', '(34 of 40 options seen live; stage 3 replayed the other 6, so all 40 are now seen)')
if 'Stage 3' not in a['coverageNote']:
    a['coverageNote'] += ' Stage 3 (verify) replayed every baseline (all matched), re-tested the state rules (AA stop, Massachusetts valid), tested AE (stopped) and the 6 untested hair options (no change), and re-read 14 product pages and 2 safety pages.'
c['limitations'] = [l for l in c['limitations'] if not l.startswith('Stage 3:')]
c['limitations'].append('Stage 3: prices on the public pages changed during the day of research ($35 to $29 for the main Rx products, $39 to $33 for the 4-in-1 spray). Treat any public price here as a snapshot.')

# 6. Verification block
c['verification'] = {
 'checked': [
  'Baseline men-gi (/g/i/hl) replayed fresh: identical 15 screens and the same end (Texas valid, Continue disabled until the Terms and Telehealth Consent box is ticked). Confirmed. runs/verify-baseline-men-gi',
  'Baseline landing-page pre-quiz replayed: same steps, scroll positions and links. Confirmed (R7). runs/verify-baseline-lp-prequiz',
  'Old consultation /c/hl/goals: still blank (blocked). Hers forhers.com: still on the Cloudflare check. Confirmed. runs/verify-baseline-men, runs/verify-baseline-women',
  'R23 (armed forces mail states refused): AA re-tested, stop confirmed; AE tested for the first time, same stop. runs/verify-state-aa, runs/verify-state-ae',
  'R25 (Massachusetts valid, no message): confirmed. runs/verify-state-ma',
  'R26 (Continue disabled until the consent box is ticked): confirmed, measured after a valid state was chosen.',
  'R27 (minimum age 18): the setting is still served in the flow data. Confirmed as code; the refusal itself is not visible before the wall.',
  'R21 (no hair answer changes anything): confirmed by 6 new one-change replays that cover every option stage 2 had not replayed, including "Keep the hair I have" which failed twice in stage 2; all 18 stage 2 run folders were also re-compared with the fresh baseline (no difference). No site error screens in 13 stage 3 replays.',
  'R1, R2, R3, R5 (published exclusions): the quoted wording is still on the live safety pages. runs/verify-docs',
  'Product facts on live pages (runs/verify-products): p1 pill (finasteride 1.2 mg, minoxidil 3 mg, $29), p2 chew ($29), p3 spray (0.3% finasteride, 6% minoxidil, $29), p4 4-in-1 spray (0.3%, 7%, ketoconazole 2.2%, biotin 0.2%, $33), p5 serum (0.3%, 6%, $29), p6 minoxidil chew (3 mg, $29), p7 finasteride ($22), p8 Hair Power Pack ($60), p9 kit ($32 with the 10-month footnote on /lp), p11 minoxidil 5% solution ($15), p13 shampoo ($19), p14 conditioner ($22), p15 gummies ($16), p16 Dandruff Detox (pyrithione zinc 1%, $18 / $17), p12 kit ($37 a month). Actives and strengths all matched.',
  'Catalogue completeness: every hair URL in the site map is in the catalogue except promotional copies of existing pages (finasteride-gs-holiday, hair-power-pack-shopping variants) and the check-in page.'
 ],
 'corrected': [
  'Prices of p1, p2, p3, p5 changed from "Starting at $35" to "Starting at $29", and p4 from $39 to $33: the live landing and product pages and the pages\' own product data now all show $29 / $33. The earlier figures were true when stage 1 looked, so they are kept in priceDetail as history.',
  'Six men-gi options moved from "inferred" to "observed" with their own run folder (In the past year, More scalp coverage, Keep the hair I have, Textured or processed, Medium, I usually wear a hat).',
  'State AE moved from "inferred" hard stop to "observed" hard stop; R23 now covers AA, AE and AP.',
  'R27 confidence lowered from high to medium and reworded as "probably refused": the age limit is a served setting, but the date-of-birth screen was never seen.',
  'Options seen only in multi-change sweeps keep "observed" but now say so in their effect text.',
  'p8, p10 and p16: noted where the page\'s own product data disagrees with the visible page (stock status or price).',
  'Added 13 stage 3 experiments and the verify run folders as proof on R21, R23, R25, R26, R27 and the docs rules.'
 ],
 'stillUnverified': [
  'Everything after the Terms and Telehealth Consent box: account step, date of birth, medical questions, photos, the recommendation, strengths offered, plan prices. Rules R11 to R13 and R20 rest on field and flag names only (code / inferred).',
  'Whether the published exclusions (R1 to R5) are applied by the software or only by the provider.',
  'The women\'s route (Hers): forhers.com is still blocked; products w1 to w4 are a stub from search listings and third-party reviews.',
  'The other 47 valid states and D.C. were not each tested (Texas, California, Massachusetts and Washington were).',
  'Plan-length prices (3, 5, 12 months) come only from Hims blog posts that contradict each other.',
  'Process note: an early stage 2 run (runs/s2-gi-explore-2, made with an older tool version) clicked the consent tick-box several times without choosing a state; it did not get past the state screen and nothing from it is used as evidence beyond the hair answers. Later runs never tick the box.'
 ],
 'verdict': 'What is labelled observed holds up: every baseline replayed the same, every rule I re-tested live was confirmed, the six gaps in the anonymous quiz are now filled, and the product names, actives and strengths match the live pages. The main error found was prices: the public "starting at" price for the main prescription products dropped during the day, so the recorded $35 / $39 were out of date and have been corrected to $29 / $33. The report is trustworthy for the anonymous part of the Hims men\'s intake (which is marketing and data capture, with only a state-based stop) and for the public catalogue. It cannot tell you how Hims chooses a product or strength, because that happens after a consent box and an account, which this research does not cross; those parts are clearly labelled as docs, code-name hints or inference. The women\'s side (Hers) is essentially uncovered.'
}
json.dump(c, open(F, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('ok', len(c['experiments']), 'experiments')
