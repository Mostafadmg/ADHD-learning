# Stage 3 (VERIFY) overlay for company.json. Idempotent: safe to run again after build_company.py -> sweep.py -> stage2.py.
# Usage: python3 -I scripts/stage3.py   (run from anywhere). It checks that each live run it cites exists and that its
# final screen is the account wall with text identical to the matching verify baseline, then patches company.json.
import json, os, glob

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
P = BASE + 'company.json'
d = json.load(open(P, encoding='utf8'))


def body(path):
    s = open(path, encoding='utf8').read()
    return s.split('\n', 2)[2]  # drop the STEP and URL lines


def last(run):
    return sorted(glob.glob(BASE + run + '/[0-9][0-9].txt'))[-1]


def same_wall(run, base):
    return body(last(run)) == body(last(base))


MEN_BASE, WOMEN_BASE = 'runs/verify-baseline-men', 'runs/verify-baseline-women'
LIVE = [
    # id, flow, changed, result, base for wall comparison (None = own check)
    ('verify-baseline-men', 'men', 'Nothing (baseline man replayed fresh in stage 3)',
     'LIVE. Screens: q20 > q22 > q26 > q55. Wall screen text identical to the stage 2 baseline (runs/s2-baseline-men).', None),
    ('verify-baseline-women', 'women', 'Nothing (baseline woman replayed fresh in stage 3)',
     'LIVE. Screens: q4 > q6 > q8 > q10 > q16. Wall screen text identical to the stage 2 baseline (runs/s2-baseline-women).', None),
    ('verify-m-dismiss', 'men', "Baseline, then click 'Dismiss' on the email pop-up",
     'LIVE. The pop-up stays and the page stays on q55; there is no way past the wall without an email or Google sign-in.', MEN_BASE),
    ('verify-m-goals-all', 'men', "men-q20: all three goals ticked together",
     'LIVE. Screens: q20 > q22 > q26 > q55. Same questions, same wall; final screen text identical to the baseline.', MEN_BASE),
    ('verify-m-nonrx+rx', 'men', "men-q22: 'Non-prescription' and 'Prescription medications' both ticked; men-q28: 'maximize results'",
     'LIVE. Screens: q20 > q22 > q28 > q55 (q28 replaces q26, as fork 25 says). Final screen text identical to the baseline.', MEN_BASE),
    ('verify-m-rx-easier', 'men', "men-q22: 'Prescription medications'; men-q28: 'I want an easier or more convenient solution'",
     'LIVE. Screens: q20 > q22 > q28 > q55. The last untested pre-wall option; no change, final screen text identical to the baseline.', MEN_BASE),
    ('verify-m-coupon', 'men', 'Entry link: the paid-search coupon link fxdxbh/?c=<code> (repeat of exp-m10)',
     "LIVE. Screens: q20 > q22 > q26 > q55, nothing on screen. The page again matched coupon 253 'You've got 35% off first order plus free shipping' (net/02). Final screen text identical to the baseline.", MEN_BASE),
    ('verify-w-temples', 'women', "women-q8: 'Temples' only (repeat of exp-w05)",
     'LIVE. Screens: q4 > q6 > q8 > q16. The part-line picture is skipped. Final screen text identical to the baseline.', WOMEN_BASE),
    ('verify-w-top+temples', 'women', "women-q8: 'Top of head/crown' + 'Temples'",
     'LIVE. Screens: q4 > q6 > q8 > q10 > q16. Ticking the top of the head keeps the picture question even with temples. Final screen text identical to the baseline.', WOMEN_BASE),
    ('verify-w-temples+frontal', 'women', "women-q8: 'Temples' + 'Frontal scalp'",
     'LIVE. Screens: q4 > q6 > q8 > q16. Picture question skipped. Final screen text identical to the baseline.', WOMEN_BASE),
    ('verify-w-sudden', 'women', "women-q6: 'Gradually' -> 'Suddenly' (repeat of exp-w02)",
     'LIVE. Screens: q4 > q6 > q8 > q10 > q16. No branch, no warning. Final screen text identical to the baseline.', WOMEN_BASE),
    ('verify-w-pic2', 'women', "women-q10: picture 3 -> picture 2",
     'LIVE. Screens: q4 > q6 > q8 > q10 > q16. No branch. Final screen text identical to the baseline.', WOMEN_BASE),
    ('verify-w-pic4', 'women', "women-q10: picture 3 -> picture 4",
     'LIVE. Screens: q4 > q6 > q8 > q10 > q16. No branch. Final screen text identical to the baseline.', WOMEN_BASE),
    ('verify-otc-minoxidil', 'otc-direct', "Open the topical minoxidil 'Buy now' link start.ro.co/vwayzg/",
     "LIVE. First screen is the sign-up wall beside the cart: 'Minoxidil Topical Solution, 60mL, 5%, 1 x per month, 3 month plan ($16/mo), $48', free shipping. No medical question.", None),
    ('verify-otc-shampoo', 'otc-direct', "Open the shampoo 'Buy now' link start.ro.co/kwrssq/",
     "LIVE. Plan screen 'Revive Shampoo ... 3-Month Plan $24 per 3 months' then the sign-up wall. No medical question.", None),
    ('verify-otc-conditioner', 'otc-direct', "Open the conditioner 'Buy now' link start.ro.co/qcalmd/",
     "LIVE. Plan screen 'Restore Conditioner ... 3-Month Plan $24' then the sign-up wall. No medical question.", None),
    ('verify-entry-escptw', 'men', 'Entry link: the Google Shopping link start.ro.co/escptw/ (repeat of probe-escptw)',
     "LIVE. Redirects to /fxdxbh/online-visit/7 and shows the sign-up screen first (Log in / Sign up with Email / Continue with Google); schema hl-onb-consult-2rx v77. Same as stage 1.", None),
    ('verify-entry-afbkau', 'men', 'Entry link: the alternative link start.ro.co/afbkau/ (repeat of probe-afbkau)',
     "LIVE. Same first question ('What are your top hair goals?'); the page loads schema hl-onb-se1 v80. Same as stage 1.", None),
]

for rid, flow, changed, result, base in LIVE:
    run = 'runs/' + rid
    assert os.path.isdir(BASE + run), run + ' missing'
    if base:
        assert same_wall(run, base), run + ': final screen differs from ' + base
    elif rid.startswith('verify-baseline'):
        old = 'runs/s2-' + rid.split('verify-')[1]
        assert same_wall(run, old), run + ' differs from ' + old
    e = {'id': rid, 'flow': flow, 'changed': changed, 'result': result, 'run': run, 'evidence': 'observed'}
    ex = [x for x in d['experiments'] if x['id'] == rid]
    if ex: ex[0].update(e)
    else: d['experiments'].append(e)

# Options that are now observed live
UPG = {('women-q10', '2'): 'runs/verify-w-pic2', ('women-q10', '4'): 'runs/verify-w-pic4',
       ('men-q28', 'I want an easier or more convenient solution (like a pill or a spray)'): 'runs/verify-m-rx-easier'}
for f in d['flows']:
    for q in f['questions']:
        for o in q['options']:
            k = (q['id'], o['label'])
            if k in UPG:
                o['evidence'] = 'observed'; o['proof'] = UPG[k]
                tail = ' Seen live in %s (stage 3): no branch, and the wall screen is word-for-word the same as the baseline.' % UPG[k]
                if 'stage 3' not in o['effect']: o['effect'] += tail

# Rule proofs: add the stage 3 run folders
ADD = {'R1': ['runs/verify-m-goals-all', 'runs/verify-m-rx-easier', 'runs/verify-m-nonrx+rx'],
       'R2': ['runs/verify-m-nonrx+rx', 'runs/verify-m-rx-easier'],
       'R3': ['runs/verify-baseline-men', 'runs/verify-m-dismiss', 'runs/verify-entry-escptw', 'runs/verify-entry-afbkau'],
       'R4': ['runs/verify-m-coupon'],
       'R19': ['runs/verify-w-sudden', 'runs/verify-w-pic2', 'runs/verify-w-pic4'],
       'R20': ['runs/verify-w-temples', 'runs/verify-w-temples+frontal', 'runs/verify-w-top+temples'],
       'R21': ['runs/verify-baseline-women'],
       'R32': ['runs/verify-otc-minoxidil', 'runs/verify-otc-shampoo', 'runs/verify-otc-conditioner']}
for r in d['rules']:
    if r['id'] in ADD:
        extra = [x for x in ADD[r['id']] if x not in r['proof']]
        if extra: r['proof'] += '; stage 3 re-check: ' + ', '.join(extra)
    if r['id'] == 'R16' and 'minAge' not in r['proof']:
        r['proof'] += "; stage 3: Basics screen meta minAge 18 and no maxAge in both schemas, enforced by the Basics code (runs/verify-code/70959.df0d5458cee1e6eee02a.chunk.js)"
    if r['id'] == 'R17':
        r['proof'] = r['proof'].replace(' and runs/verify-code/main.492909756d6fd4640b5b.js', '')
        r['proof'] = r['proof'].replace('raw/js/main.260d4b871de7cb1cb657.js', 'raw/js/main.260d4b871de7cb1cb657.js and runs/verify-code/main.492909756d6fd4640b5b.js')
        if r['confidence'] == 'medium':
            r['confidence'] = 'high'
            r['then'] += ' (Stage 3: the current main bundle does the same: for choice and multi-choice questions it takes the next question of the first ticked answer in display order.)'
    if r['id'] == 'R27' and 'userAge' not in r['proof']:
        r['proof'] += "; stage 3: forks 1159 and 4020 read userAge, which the Basics screen sets from the date of birth (runs/verify-code/70959.df0d5458cee1e6eee02a.chunk.js)"
    if r['id'] == 'R5' and 'stage 3' not in r['proof']:
        r['proof'] += '; stage 3: chunk 48419 unchanged (same hash, byte-identical in runs/verify-code/); variable values are parseInt-ed in the current main bundle, so the flags compare as numbers'

# Recommendation for direct links: now also stage 3 runs
for rec in d['recommendations']:
    if rec['profile'].startswith("Anyone using a 'Buy now'") and 'verify-otc' not in rec['note']:
        rec['note'] = (rec['note'] + ' ' if rec['note'] else '') + 'Re-checked live in stage 3 (runs/verify-otc-minoxidil, -shampoo, -conditioner).'

# Limitations and coverage
lim = d['limitations']
for i, x in enumerate(lim):
    if x.startswith('Live one-change testing was only possible on 7 questions'):
        lim[i] = ("Live one-change testing was only possible on 7 questions (men q20, q22, q26, q28; women q4, q6, q8, q10). "
                  "After stage 3 every option of those 7 questions has been replayed live, plus some multi-select combinations "
                  "(men q20 all goals, q22 both 'tried' boxes; women q8 top + temples, temples + frontal). The alternative entry links "
                  "were opened twice each (stages 1 and 3) and the coupon link twice; the paid-search quiz pages were read, not replayed.")
cn = d['access']['coverageNote'].split(' Stage 3 (independent check')[0]
if True:
    d['access']['coverageNote'] = cn.replace('Stages 1 and 2.', 'Stages 1 to 3.') + (
        ' Stage 3 (independent check, 23-24 Nov 2026): 18 more live replays (both baselines, every remaining pre-wall option, '
        'three combinations, the coupon link, two alternative entry links and the three direct-purchase links); all matched the recorded results. The served '
        'schemas (men v77, women v32) were unchanged; the recommender chunk was byte-identical; the new main bundle was re-read.')
d['checkedOn'] = '2026-11-24'

src_urls = {s['url'] for s in d['sources']}
for t, u in [('Ro pricing page (re-fetched 24 Nov 2026, runs/verify-pages-1124/pricing.txt)', 'https://ro.co/pricing/'),
             ('Ro Mane Spray safety information (dose: do not exceed 4 sprays)', 'https://ro.co/safety-info/ro-mane-spray/')]:
    if u not in src_urls: d['sources'].append({'title': t, 'url': u})

d['verification'] = {
    'checked': [
        'Baselines replayed fresh (runs/verify-baseline-men, runs/verify-baseline-women): same screens and a wall screen word-for-word the same as stage 2. Confirmed.',
        'Served schemas re-fetched by the page itself in the stage 3 runs: men hl-onb-consult-2rx v77 and women derm-whl-onb v32 are identical to the saved copies (the only differences were "key" fields blanked by our own redaction script). Confirmed.',
        'Recommender chunk 48419.d54c80ce6a7f9ba5ad88 re-downloaded (runs/verify-code/): byte-identical. Function Ye: fixed order spray > finasteride tablets > oral minoxidil; a product is skipped if its flag is 1 or its group is state-ineligible; none left = "no-recommendation". R5 confirmed.',
        'New main bundle main.492909756d6fd4640b5b.js re-read: answer and question variable values go through parseInt (so "1" is the number 1 and the flags work); a fork takes the first true rule; for choice and multi-choice questions the next question is that of the first ticked answer in display order. The simulator (scripts/simulate.py) does the same three things. R17 confirmed (confidence raised to high).',
        'State rule (R7) re-read in chunk 48419: any group holding a compounded product that is not supported in the member\'s state is hidden with "Not available in your area". Confirmed as code; the state list stays server-side.',
        'Women\'s hard stops re-read directly from the raw schema (not the simulator): pregnant Yes/Not sure > screen 6020; any named scalp diagnosis > fork 1087 > 6040; clitoral enlargement, nipple discharge, deeper voice > fork 1091 > 6040; lupus/autoimmune sets both "not eligible" flags > fork 1159 > 6040; scalp steroid injections > fork 1251 > 6040; oral minoxidil allergy Yes > 6040; topical allergy to foam or both > 6040. Each stop screen has one button, "Got it", which ends the visit. R22 to R26 confirmed.',
        'Tablet removal for women (R27) re-read: breastfeeding, heart condition, stroke, phaeochromocytoma, pulmonary hypertension and high blood pressure set ifNotEligibleForOralMinoxidil; fork 4020 sends "not eligible or userAge > 65" to 4030 (Hair Solution Rx only, which adds it to the cart). userAge comes from the date of birth on the Basics screen (chunk 70959). Age 65 keeps the choice, 66 loses the tablet. Confirmed.',
        'Women\'s choice screen (R28) re-read: "No preference" clears the cart and adds oral minoxidil on a quarterly plan; the on-screen text says so. Confirmed.',
        'Men\'s finasteride switch (R9) re-read: erectile dysfunction, anxiety, depression (q1000), trying for a baby (q2350, then a fertility caution screen q2355) and past finasteride tablets with side effects or allergy (q315) set noRecTopicalCombined and noRecOralFin; the recommender then returns oral minoxidil 2.5 mg. Confirmed.',
        'Men\'s other switches re-read: prostate cancer, topical minoxidil or topical finasteride allergy flag only the spray (> finasteride tablets, R10); oral minoxidil allergy flags spray and tablet minoxidil (> finasteride tablets, R11); patches, very sudden onset, scalp redness, scalp steroid injections and persistently low blood pressure set all three flags (no recommendation, R8); the cardiovascular list flags only oral minoxidil (R12). Every no-recommend setter in the schema was listed and matched to a rule. Confirmed.',
        'Men\'s stops (R16) re-read: the only stop routes are under 18, unserved zip and female (redirect or exit form); Basics meta has minAge 18 and no maxAge in either schema. Confirmed.',
        'Simulator re-run for the key profiles (baseline man and woman, depression, trying for a baby, prostate cancer, very sudden onset, heart failure, depression + heart failure, age 70; pregnant, not sure, breastfeeding, age 65 and 66, high blood pressure, lupus, deeper voice, irregular periods, traction alopecia, foam allergy): every result matches the rules.',
        'Pre-wall branches re-confirmed live: men q22 both boxes > q28 (verify-m-nonrx+rx), q28 "easier" option (verify-m-rx-easier, first live test), all goals (verify-m-goals-all), pop-up cannot be dismissed (verify-m-dismiss), coupon still matched (verify-m-coupon), Google Shopping link still puts sign-up first and the afbkau link still opens schema hl-onb-se1 (verify-entry-escptw, verify-entry-afbkau); women q8 temples alone and temples + frontal skip the picture, top + temples keeps it (R20), sudden onset and pictures 2 and 4 change nothing (pictures 2 and 4 first live test). All matched.',
        'Product facts checked against live pages: Ro Mane Spray minoxidil 6% + finasteride 0.3% + tretinoin 0.025% (product page), $50/mo quarterly, $43/mo 6-month (pricing page, re-fetched 24 Nov); finasteride 1 mg $20/$18/$16; oral minoxidil 2.5 mg $30/$27/$24; topical minoxidil 5% 60 mL $16/$14/$13 and $48 per 3-month cart (live cart, verify-otc-minoxidil); Revive Shampoo and Restore Conditioner $24 per 3 months with the stated ingredients (live, verify-otc-shampoo/-conditioner); women\'s oral minoxidil $30/mo quarterly and Hair Solution Rx $40/mo quarterly (pricing page); Hair Solution Rx 5% minoxidil, 0.025% tretinoin, 0.1% melatonin (schema text; the product page names the three actives without strengths); catalogue in the stage 3 run (net/03) still lists finasteride $0.66 a tablet, oral minoxidil 2.5 mg $1.00, the 5 mg (2 x 2.5 mg) group at $0.50 a tablet and the empty Hair Support Supplement group. All matched.',
        'Catalogue completeness: the hair-loss and women\'s landing pages link only to the products already listed (plus Latisse, valacyclovir and swipes, which are not hair-loss products); no product page is missing. "Spray, serum, and oral meds" on the landing page names no separate serum product.',
        'Evidence labels audited: every "observed" rule, product, question and option names a run folder that exists; post-wall claims are labelled code; clinician-review claims are worded as inferred.'
    ],
    'corrected': [
        'women-q10 pictures 2 and 4 and men-q28 "I want an easier or more convenient solution" upgraded from code to observed (now replayed live).',
        'R17 (multi-select routing) confidence raised from medium to high after re-reading the current main bundle.',
        'Limitations and coverage note rewritten: the "not replayed live" list was out of date after stage 3.',
        'Added 18 stage 3 live runs to experiments and cited them in rules R1 to R4, R19 to R21 and R32; checkedOn moved to 2026-11-24.',
        'No rule, product, price or strength was contradicted, so no clinical claim had to be changed or removed.'
    ],
    'stillUnverified': [
        'Everything after the account wall (every medical question, stop screen, recommendation and cart) is read from code and simulated, never seen live; real screens could differ in wording or layout.',
        'The list of US states where the compounded spray is not available (server-side).',
        'What the reviewing clinician does with the answer marks (negative, caution, ack-clinical), the medicine and allergy lists, and how often the patient\'s pick is overridden.',
        'The exact strength of the women\'s oral minoxidil tablet (not published; the site gives 0.25 to 2.5 mg as the usual range).',
        'Whether isEligibleFor6And12MonthShipments changes plan lengths (not used in any bundle read).',
        'Other men\'s schemas named by the coupon (hl-onb-kit, hl-onb-overhaul, hl-onb-consult-gs, hl-ren-consult-2rx) were not reached from any public page, so their questions are unknown.',
        'Older FAQ prices (finasteride + minoxidil bundle $1.17 a day) could not be matched to the current pricing page; the bundle (p6) stays docs-only.'
    ],
    'verdict': ('Trustworthy as labelled. The pre-wall part (3 to 4 questions per flow) is fully observed: every option has now been replayed live '
                'and all 18 stage 3 replays matched what stage 2 recorded. The post-wall engine is not observed but is unusually well '
                'grounded: the consultation app downloads its complete question schema and the men\'s recommender in public code, both '
                'unchanged since stage 1, and an independent re-read of the raw schema and the current bundles agrees with every high-impact '
                'rule (women\'s hard stops, tablet removal for breastfeeding, heart and blood-pressure conditions and age 66+, the men\'s '
                'finasteride-to-oral-minoxidil switch, the spray > finasteride > oral minoxidil order). Treat post-wall rules as what the '
                'software is set to do before a clinician reviews the case, not as proof of what is finally prescribed; server-side state '
                'and clinician steps remain unknown.')
}

json.dump(d, open(P, 'w', encoding='utf8'), ensure_ascii=False, indent=2)
print('stage3 overlay applied:', len(d['experiments']), 'experiments,', len(d['rules']), 'rules')
