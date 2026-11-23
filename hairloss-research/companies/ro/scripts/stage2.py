# Stage 2 (EXPERIMENT) overlay for Ro. Run AFTER scripts/build_company.py:
#     python3 -I scripts/build_company.py && python3 -I scripts/sweep.py && python3 -I scripts/stage2.py
# It reads company.json, the live run folders (runs/s2-*, runs/exp-*) and the offline sweep (runs/sim/*.json),
# then rewrites experiments, rules, recommendations, product "recommendedWhen", summary lists and the evidence
# labels of the options that were replayed live. It is idempotent.
import glob, json, os, re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
c = json.load(open(BASE + 'company.json'))
SIM = {f: json.load(open(BASE + 'runs/sim/%s.json' % f)) for f in ('men', 'women')}

# ---------------------------------------------------------------- live runs
def trace(run):
    out = []
    for f in sorted(glob.glob(BASE + 'runs/%s/[0-9][0-9].txt' % run)):
        s = open(f, encoding='utf8').read()
        url = re.search(r'^URL: (.*)$', s, re.M).group(1).replace('https://start.ro.co', '')
        out.append((url.split('?')[0], s.split('--- VISIBLE TEXT ---', 1)[1]))
    return out
def seq(run):
    t = [re.sub(r'^/(fxdxbh|tefcyb)/(online-visit/)?', '', u) or 'start' for u, _ in trace(run)]
    return [t[0]] + [u for i, u in enumerate(t[1:]) if u != t[i]]
def same_wall(run, base):
    return trace(run)[-1][1] == trace(base)[-1][1]

MEN_WALL = "account wall (screen 55: testimonials, 'Your treatment options: We offer clinically proven ingredients like finasteride, minoxidil, or both in a convenient topical spray', covered by the email pop-up 'See how much fuller your hair could be in just 3 months')"
WOMEN_WALL = "account wall (screen 16: 'Thanks for sharing. Ready to go deeper?', Sign up with Email / Continue with Google)"
LIVE = [
 # id, flow, changed, expected screen sequence, note
 ('s2-baseline-men', 'men', 'Nothing (baseline man replayed): Regrow my hair / None of the above / Didn\'t want or need to until now', ['20', '22', '26', '55'],
  'Baseline still works. End state: ' + MEN_WALL + '. No product, strength, plan or price is shown before the wall.'),
 ('exp-m01', 'men', "men-q20: 'Regrow my hair' -> 'Get thicker, fuller hair'", ['20', '22', '26', '55'], 'Same questions, same wall, same pop-up headline.'),
 ('exp-m02', 'men', "men-q20: 'Regrow my hair' -> 'Proactively prevent hair loss'", ['20', '22', '26', '55'], 'Same questions, same wall, same pop-up headline (the headline does not follow the goal).'),
 ('exp-m03', 'men', "men-q22: 'None of the above' -> 'Non-prescription solutions (e.g. Rogaine, supplements)'", ['20', '22', '28', '55'],
  "Third question is reworded: 'What's the main reason you're looking for hair loss solutions now?' (q28) replaces 'What's the main reason you haven't tried hair loss treatment before?' (q26). New question answered neutrally ('I want to maximize results with a new or additional product'). Same wall."),
 ('exp-m04', 'men', "men-q22: 'None of the above' -> 'Prescription medications (e.g. Propecia, oral minoxidil)'", ['20', '22', '28', '55'],
  "Same branch as exp-m03: q28 replaces q26 (answered neutrally). Same wall."),
 ('exp-m05', 'men', "men-q26: 'Didn't want or need to until now' -> 'Not sure it'll work'", ['20', '22', '26', '55'], 'No change: same wall.'),
 ('exp-m06', 'men', "men-q26: 'Didn't want or need to until now' -> 'Seems too expensive'", ['20', '22', '26', '55'], 'No change: same wall, no price or cheaper option shown.'),
 ('exp-m07', 'men', "men-q26: 'Didn't want or need to until now' -> 'Nervous about side effects'", ['20', '22', '26', '55'], 'No change: same wall, no reassurance screen and no steer away from finasteride.'),
 ('exp-m08', 'men', "men-q28 (reached via exp-m03): 'I want to maximize results…' -> 'Over-the-counter solutions didn't work for me'", ['20', '22', '28', '55'], 'No change against exp-m03: same wall.'),
 ('exp-m09', 'men', "men-q28 (reached via exp-m03): 'I want to maximize results…' -> 'I've experienced side effects with past solutions'", ['20', '22', '28', '55'], 'No change against exp-m03: same wall, no follow-up about the side effects before the wall.'),
 ('exp-m10', 'men', 'Entry link: start.ro.co/fxdxbh/ -> the coupon link used by the paid-search quiz pages (fxdxbh/?c=<code>)', ['20', '22', '26', '55'],
  "Same questions and same wall; no banner or price on screen. Behind the scenes the page matched the code to a coupon: 'You've got 35% off first order plus free shipping' (35% off products on the first order), valid for the men's hair schemas."),
 ('s2-baseline-women', 'women', 'Nothing (baseline woman replayed): More than a year / Gradually / Top of head/crown / picture 3', ['start', '6', '8', '10', '16'],
  'Baseline still works. End state: ' + WOMEN_WALL + '. No product, strength, plan or price is shown before the wall.'),
 ('exp-w01', 'women', "women-q4: 'More than a year' -> 'Months'", ['start', '6', '8', '10', '16'], 'No change: same questions, same wall.'),
 ('exp-w02', 'women', "women-q4: 'More than a year' -> 'Within the last year'", ['start', '6', '8', '10', '16'], 'No change: same questions, same wall.'),
 ('exp-w03', 'women', "women-q6: 'Gradually' -> 'Suddenly'", ['start', '6', '8', '10', '16'], 'No change: same questions, same wall; no warning for sudden loss.'),
 ('exp-w04', 'women', "women-q6: 'Gradually' -> 'Not sure'", ['start', '6', '8', '10', '16'], 'No change: same questions, same wall.'),
 ('exp-w05', 'women', "women-q8: 'Top of head/crown' -> 'Temples'", ['start', '6', '8', '16'], "The part-line picture question (q10) is removed; straight to the wall."),
 ('exp-w06', 'women', "women-q8: 'Top of head/crown' -> 'Frontal scalp'", ['start', '6', '8', '16'], "The part-line picture question (q10) is removed; straight to the wall."),
 ('exp-w07', 'women', "women-q8: 'Top of head/crown' -> 'All over'", ['start', '6', '8', '10', '16'], "Part-line picture question still asked (answered '3'); same wall."),
 ('exp-w08', 'women', "women-q10: picture '3' -> picture '1' (normal part)", ['start', '6', '8', '10', '16'], 'No change: same wall (a normal part line is not turned away).'),
 ('exp-w09', 'women', "women-q10: picture '3' -> picture '5' (extremely wide part)", ['start', '6', '8', '10', '16'], 'No change: same wall, no warning for the most severe picture.'),
]
experiments = []
for eid, flow, changed, expect, note in LIVE:
    got = seq(eid)
    assert got == expect, (eid, got, expect)
    basew = 's2-baseline-men' if flow == 'men' else 's2-baseline-women'
    assert same_wall(eid, basew), eid
    experiments.append({'id': eid, 'flow': flow, 'changed': changed,
                        'result': 'LIVE. Screens: ' + ' > '.join('q' + x if x != 'start' else 'q4' for x in got) + '. ' + note + ('' if eid.startswith('s2-') else ' Final screen text identical to the baseline replay.'),
                        'run': 'runs/' + eid, 'evidence': 'observed'})

S1 = [('s1-baseline-men', 'men', 'Stage 1 baseline man', 'LIVE (stage 1). Goals > tried (none) > why not before > account wall (q55).', 'runs/baseline-men'),
      ('s1-men-wall-dismiss', 'men', "At the men's wall: click 'Dismiss' on the email pop-up", 'LIVE (stage 1). The pop-up stays; there is no way past it without an email.', 'runs/men-wall-dismiss'),
      ('s1-baseline-women', 'women', 'Stage 1 baseline woman', 'LIVE (stage 1). How long > how started > where > part-line picture > account wall (q16).', 'runs/baseline-women'),
      ('s1-probe-afbkau', 'men', 'Entry link: alternative men\'s slug /afbkau', 'LIVE (stage 1). Same first question; schema hl-onb-se1 with identical content.', 'runs/probe-afbkau'),
      ('s1-probe-escptw', 'men', 'Entry link: Google Shopping slug /escptw', 'LIVE (stage 1). Sign-up screen comes FIRST (wall before any question).', 'runs/probe-escptw'),
      ('s1-probe-vwayzg', 'otc-direct', 'Entry link: topical minoxidil Buy now', 'LIVE (stage 1). First screen is the account wall with a cart: 3-month plan, $16 a month, $48.', 'runs/probe-vwayzg'),
      ('s1-probe-kwrssq', 'otc-direct', 'Entry link: Revive Shampoo', 'LIVE (stage 1). One plan screen ($24 per 3 months) then the account wall.', 'runs/probe-kwrssq'),
      ('s1-probe-qcalmd', 'otc-direct', 'Entry link: Restore Conditioner', 'LIVE (stage 1). One plan screen ($24 per 3 months) then the account wall.', 'runs/probe-qcalmd')]
for eid, flow, changed, result, run in S1:
    if os.path.isdir(BASE + run):
        experiments.append({'id': eid, 'flow': flow, 'changed': changed, 'result': result, 'run': run, 'evidence': 'observed'})

# ---------------------------------------------------------------- offline sweep -> experiments
FLAG = {'noRecTopicalCombined': 'Ro Mane Spray', 'noRecOralFin': 'finasteride tablets', 'noRecOralMin': 'oral minoxidil tablets'}
def describe(flow, e):
    parts = []
    if e['added']:
        parts.append('Adds ' + '; '.join("q%d '%s'" % (q, t.rstrip()) for q, t in e['added'][:5]) + ('…' if len(e['added']) > 5 else '') + '.')
    if e['removed']:
        if len(e['removed']) > 6: parts.append('Removes the rest of the visit (%d later screens).' % len(e['removed']))
        else: parts.append('Removes ' + ', '.join('q%d' % q for q, _ in e['removed']) + '.')
    o, p = e['outcome'], e['parentOutcome']
    if flow == 'men':
        setf = [FLAG[k] for k, v in o['flags'].items() if v == 1]
        if o['recommended'].startswith('('):
            parts.append('Visit ends before any recommendation.')
        else:
            parts.append('No-recommend flags set: ' + (', '.join(setf) if setf else 'none') + '.')
            parts.append(('Recommended: %s (was %s).' % (o['recommended'], p['recommended'])) if o['recommended'] != p['recommended'] else 'Recommended stays %s; all three treatments still listed.' % o['recommended'])
    else:
        if o['result'] != p['result']: parts.append('Outcome: %s (was: %s).' % (o['result'], p['result'].split('(')[0].strip()))
        else: parts.append('Outcome unchanged: %s.' % o['result'].split('(')[0].strip())
    if not e['added'] and not e['removed'] and not e['changedOutcome']: parts.insert(0, 'No change to the questions.')
    return ' '.join(parts)

SIMIDX = {}
for flow in ('men', 'women'):
    exps = SIM[flow]['experiments']
    for e in exps:
        if 'qid' in e: SIMIDX.setdefault((flow, e['qid'], e['slug']), e)
    dupe_parent = 'sim-m-q22-hair-loss-solutions-prescription-medicat'
    def under(e, pid):
        byid = {x['id']: x for x in exps}
        while e.get('parent') and e['parent'] != 'baseline':
            if e['parent'] == pid: return True
            e = byid[e['parent']]
        return False
    groups = {}
    for e in exps:
        if e['id'].startswith(('sim-w-q6020', 'sim-w-q6040')): continue          # the 'Got it' button on a stop screen
        if flow == 'men' and under(e, dupe_parent): continue                       # same sub-tree as under 'Non-prescription'
        interesting = e['changedOutcome'] or e['added'] or e['removed'] or 'qid' not in e
        ctx = '' if e['parent'] == 'baseline' else ' [sub-baseline %s]' % e['parent']
        if interesting:
            experiments.append({'id': e['id'], 'flow': flow, 'changed': e['changed'] + ctx,
                                'result': 'OFFLINE simulation of the served schema (not a live replay). ' + describe(flow, e),
                                'run': 'runs/sim/%s.json#%s' % (flow, e['id']), 'evidence': 'code'})
        else:
            groups.setdefault((e['parent'], e['qid']), []).append(e)
    for (parent, qid), es in groups.items():
        ctx = '' if parent == 'baseline' else ' [sub-baseline %s]' % parent
        labels = [x['changed'].split(' -> ', 1)[1] for x in es]
        base_label = es[0]['changed'].split(': ', 1)[1].split(' -> ')[0]
        experiments.append({'id': 'sim-%s-q%d-noeffect%s' % (flow[0], qid, '' if parent == 'baseline' else '-sub'), 'flow': flow,
                            'changed': "%s-q%d: '%s' -> each of, one at a time: %s%s" % (flow, qid, base_label[:80], '; '.join("'%s'" % l[:70] for l in labels), ctx),
                            'result': 'OFFLINE simulation of the served schema (not a live replay). %d option(s): no question added or removed, no flag set, outcome unchanged (%s).' % (len(es), (es[0]['outcome'].get('recommended') or es[0]['outcome']['result']).split('(')[0].strip()),
                            'run': 'runs/sim/%s.json' % flow, 'evidence': 'code'})
ids = [e['id'] for e in experiments]
assert len(ids) == len(set(ids)), [i for i in ids if ids.count(i) > 1]
c['experiments'] = experiments

# ---------------------------------------------------------------- option / question evidence from live runs
LIVE_OPT = {  # (question id, slug) -> (run, extra words)
 ('men-q20', 'regrow-my-hair'): 's2-baseline-men', ('men-q20', 'get-thicker-fuller-hair'): 'exp-m01', ('men-q20', 'proactively-prevent-hair-loss'): 'exp-m02',
 ('men-q22', 'hair-loss-solutions-non-prescription'): 'exp-m03', ('men-q22', 'hair-loss-solutions-prescription-medications'): 'exp-m04', ('men-q22', 'hair-loss-solutions-none-of-the-above'): 's2-baseline-men',
 ('men-q26', 'not-sure-itll-work'): 'exp-m05', ('men-q26', 'seems-too-expensive'): 'exp-m06', ('men-q26', 'nervous-about-side-effects'): 'exp-m07', ('men-q26', 'didnt-want-or-need-to-until-now'): 's2-baseline-men',
 ('men-q28', 'i-want-to-maximize-results-with-a-new-or-additional-product'): 'exp-m03', ('men-q28', 'over-the-counter-solutions-didnt-work-for-me'): 'exp-m08', ('men-q28', 'ive-experienced-side-effects-with-past-solutions'): 'exp-m09',
 ('women-q4', 'months'): 'exp-w01', ('women-q4', 'within-the-last-year'): 'exp-w02', ('women-q4', 'more-than-a-year'): 's2-baseline-women',
 ('women-q6', 'suddenly'): 'exp-w03', ('women-q6', 'not-sure'): 'exp-w04', ('women-q6', 'gradually'): 's2-baseline-women',
 ('women-q8', 'top-of-head-crown'): 's2-baseline-women', ('women-q8', 'temples'): 'exp-w05', ('women-q8', 'frontal-scalp'): 'exp-w06', ('women-q8', 'all-over'): 'exp-w07',
 ('women-q10', '1'): 'exp-w08', ('women-q10', '3'): 's2-baseline-women', ('women-q10', '5'): 'exp-w09',
}
TAG = ' Seen live in '
for fl in c['flows']:
    for q in fl['questions']:
        hit = False
        for o in q.get('options', []):
            o['effect'] = o['effect'].split(TAG)[0]
            run = LIVE_OPT.get((q['id'], o.get('slug')))
            if run:
                hit = True
                o['evidence'] = 'observed'; o['proof'] = 'runs/' + run
                o['effect'] += TAG + 'runs/%s: the visible effect before the account wall is exactly this (the wall screen is word-for-word the same whichever option is chosen); anything said here about later screens is read from the served code.' % run
            e = SIMIDX.get((fl['id'], q.get('schemaQid'), o.get('slug')))
            if e and not run: o['proof'] = 'runs/sim/%s.json#%s (offline simulation of the served schema)' % (fl['id'], e['id'])
            if q['id'] == 'women-q8' and o.get('slug') in ('temples', 'frontal-scalp'):
                o['effectType'] = 'skip-questions'
                o['effect'] = "On its own, skips the part-line picture question (q10) and goes straight to sign-up. No variable is set and nothing changes in what is offered. Marked 'ack-clinical' in the schema (the mark is saved with the answer for the clinician)." + TAG + 'runs/%s.' % run
        if hit: q['evidence'] = 'observed'
        if q['id'] == 'men-q28':
            q['evidence'] = 'observed'; q['shownWhen'] = "qid 22 includes a 'tried' answer (fork 25). Seen live in runs/exp-m03 and runs/exp-m04."
        if q['id'] == 'men-q132':
            q['branchDetail'] = (q.get('branchDetail') or '').split(' Mixed picks:')[0] + " Mixed picks: the app takes the next question from the FIRST ticked option in display order (main bundle, next-question selector), so 'Hairline' + 'patches' still goes through onset, severity and scalp symptoms, while 'patches' alone skips them. The flags of every ticked option still apply (runs/sim/men.json#sim-m-q132-hairline+patches)."
        if q['id'] == 'men-q370':
            q['branchDetail'] = (q.get('branchDetail') or '').split(' The picture')[0] + " The picture on the follow-up questions defines the ranges (main bundle): Low under 95/55, Normal 95-130/55-80, High 131-160/81-100, Very High 161+/101+."

# ---------------------------------------------------------------- rules
SM, SW = 'runs/sim/men.json', 'runs/sim/women.json'
R = []
def rule(flow, when, then, et, affects, ev, proof, conf):
    R.append({'id': 'R%d' % (len(R) + 1), 'flow': flow, 'when': when, 'then': then, 'effectType': et, 'affects': affects, 'evidence': ev, 'proof': proof, 'confidence': conf})

# men
rule('men', "Any answer to men-q20 (goals), men-q26 (why not before) or men-q28 (why now)",
     "Nothing changes: same next question, same account wall, same pop-up wording; no product or price appears. After the wall these answers only fill the 'Here's a quick recap' bullets.",
     'marketing-only', [], 'observed', 'runs/exp-m01, runs/exp-m02, runs/exp-m05, runs/exp-m06, runs/exp-m07, runs/exp-m08, runs/exp-m09 vs runs/s2-baseline-men; recap use read in raw/js/main.260d4b871de7cb1cb657.js', 'high')
rule('men', "men-q22 includes 'Non-prescription solutions' or 'Prescription medications'",
     "The third question changes from 'What's the main reason you haven't tried hair loss treatment before?' to 'What's the main reason you're looking for hair loss solutions now?'. After the wall (code) the visit also adds 'What hair loss treatments have you used?' with a follow-up for each treatment ticked.",
     'extra-questions', [], 'observed', 'runs/exp-m03 and runs/exp-m04 vs runs/s2-baseline-men (first part); later part: forks 25 and 229 in quiz-definition.men-onboarding.raw.json, ' + SM + '#sim-m-q22-hair-loss-solutions-non-prescription', 'high')
rule('men', "Every route into the men's visit, whatever is answered before the wall",
     "The account wall comes after 3 marketing questions and before any medical question, recommendation or price. The email pop-up cannot be dismissed. (The Google Shopping link /escptw puts sign-up first.)",
     'none', [], 'observed', 'runs/s2-baseline-men, runs/exp-m01 to runs/exp-m10, runs/men-wall-dismiss, runs/probe-escptw', 'high')
rule('men', "Visit opened through a paid-search coupon link (fxdxbh/?c=<code>)",
     "Questions and wall are unchanged and nothing is shown on screen before the wall; the app silently matches a coupon ('35% off first order plus free shipping'), which applies to the first order if prescribed.",
     'marketing-only', ['p1', 'p2', 'p3'], 'observed', 'runs/exp-m10 (net/02 coupon match response) vs runs/s2-baseline-men', 'high')
rule('men', "End of the medical questions (recommendation screen, qid 3178)",
     "Recommended treatment = the first of [Ro Mane Spray, finasteride 1 mg tablets, oral minoxidil 2.5 mg tablets] whose no-recommend flag is not set and whose product group is available in the patient's state. The other treatments stay on the screen under 'Other treatment options' and can still be picked. If all are flagged: no recommendation, heading 'Your treatment options'. The plan defaults to quarterly at checkout.",
     'product-switched', ['p1', 'p2', 'p3'], 'code', 'raw/js/48419.chunk.js (getFinalRecommendation) + ' + SM + ' (baseline -> Ro Mane Spray)', 'high')
rule('men', "No red-flag answer at all (baseline man), any goal, any severity (very mild to extremely severe), hairline, crown or overall thinning, even 'Nowhere yet, but I'd like to prevent future hair loss'",
     "Ro Mane Spray is recommended every time. Goals, severity and pattern do not move the recommendation; 'Nowhere yet' only skips the onset, severity and scalp-symptom questions.",
     'none', ['p1'], 'code', SM + '#sim-m-q160-noeffect, #sim-m-q132-noeffect, #sim-m-q132-prevent-hair-loss, #sim-m-q20-noeffect', 'high')
rule('men', "Patient's US state does not support the compounded spray (server look-up by state)",
     "The spray group is treated as ineligible ('Not available in your area') and left off the screen; the recommendation moves to finasteride tablets.",
     'product-removed', ['p1'], 'code', 'raw/js/48419.chunk.js (getIneligibleProductGroupsWithReason, REASON_INELIGIBLE_COMPOUNDING_PRODUCTS_BASED_ON_STATE); the list of states is not public', 'medium')
rule('men', "Any of: patchy loss 'Random golf-ball size bald patches…' (q132); onset 'Very suddenly' (q150); 'Redness or rashes on scalp' (q170); past 'Steroid injections in the scalp' (q240); blood pressure readings still 'low' after a low-blood-pressure diagnosis (q391)",
     "All three no-recommend flags are set: nothing is recommended ('Your treatment options'), but all three treatments can still be picked and the visit still goes to checkout and clinician review. There is no stop screen for men.",
     'product-removed', ['p1', 'p2', 'p3'], 'code', SM + '#sim-m-q132-patches, #sim-m-q150-very-suddenly, #sim-m-q170-redness-or-rashes, #sim-m-q240-steroid-injections-d1, #sim-m-q391-yes-very-low-bp-reading-d1', 'high')
rule('men', "Any of: erectile dysfunction, anxiety or depression (q1000); 'Yes, we are' trying for a pregnancy in the next 3 months (q2350); past finasteride tablets with problematic side effects or allergy (q315)",
     "Both finasteride products (spray and tablets) are flagged: the recommendation becomes oral minoxidil 2.5 mg. Trying for a baby also adds a caution screen about finasteride and sperm count.",
     'product-switched', ['p1', 'p2', 'p3'], 'code', SM + '#sim-m-q1000-erectile-dysfunction, #sim-m-q1000-anxiety, #sim-m-q1000-depression, #sim-m-q2350-trying-to-get-pregnant-yes-we-are, #sim-m-q315-oral-fin-no-problematic-side-effects-d2', 'high')
rule('men', "Prostate cancer (q1000); allergy to topical minoxidil (q285) or to topical finasteride (q335)",
     "Only the spray is flagged: the recommendation becomes finasteride 1 mg tablets. (Prostate cancer does not flag the tablets in the schema.)",
     'product-switched', ['p1', 'p2'], 'code', SM + '#sim-m-q1000-prostate-cancer, #sim-m-q285-topical-min-no-allergic-to-medication-d1, #sim-m-q335-topical-fin-no-allergic-to-medication-d2', 'high')
rule('men', "Past oral minoxidil 'I found out I was allergic to it' (q265)",
     "The spray and oral minoxidil are flagged: the recommendation becomes finasteride 1 mg tablets.",
     'product-switched', ['p1', 'p2', 'p3'], 'code', SM + '#sim-m-q265-oral-min-no-allergic-to-medication-d2', 'high')
rule('men', "Any of: blood pressure still 'very high' (161+/101+) after a high-blood-pressure diagnosis (q381); phaeochromocytoma (q1000); stroke less than 6 months ago (q1260); angina, heart failure, pericarditis or pulmonary hypertension (q1300); heart attack or bypass less than 6 months ago, or not seeing a cardiologist (q1315, q1320, q1355, q1360); atrial flutter, PSVT, Wolff-Parkinson-White or ventricular fibrillation (q1420); resting heart rate under 50 or fainting from a low heart rate (q1455, q1460); past oral minoxidil with side effects or no effect (q265)",
     "Only oral minoxidil tablets are flagged. Ro Mane Spray (6% minoxidil) stays the recommendation, so for a man with no other flag nothing visible changes.",
     'product-removed', ['p3'], 'code', SM + '#sim-m-q381-yes-very-high-bp-reading-d1, #sim-m-q1000-pheochromocytoma, #sim-m-q1260-stroke-less-than-6-months-d1, #sim-m-q1300-heart-failure, #sim-m-q1420-atrial-flutter-d1, #sim-m-q1455-resting-rate-less-than-50-d2 and neighbours', 'high')
rule('men', "Past finasteride tablets 'this dose wasn't effective' (q315)",
     "Only finasteride tablets are flagged; the spray (which contains finasteride) stays recommended.",
     'product-removed', ['p2'], 'code', SM + '#sim-m-q315-oral-fin-no-dose-not-effective-d2', 'high')
rule('men', "Flags from different answers together, e.g. depression (spray + finasteride) with heart failure (oral minoxidil)",
     "Flags add up and are never cleared: with all three set there is no recommendation, though all three treatments are still offered to pick.",
     'product-removed', ['p1', 'p2', 'p3'], 'code', SM + '#sim-m-combo-dep+hf, #sim-m-combo-pc+brady', 'high')
rule('men', "Any of: liver failure or cirrhosis, kidney disease (any stage, including stage 5), coronary artery disease, atrial fibrillation, bradycardia with a normal rate, stroke more than 6 months ago, scalp pain, pus bumps or sores, eyebrow or eyelash loss, onset 'Not sure', current medicines, allergies",
     "No flag: Ro Mane Spray is still recommended. Some of these open detail questions; the answers carry a 'caution' or 'negative' mark that is saved with the answer on the server (that a clinician reads it is inferred).",
     'flag-for-clinician', [], 'code', SM + '#sim-m-q1000-liver-diseases, #sim-m-q1000-kidney-disease, #sim-m-q1300-noeffect, #sim-m-q170-noeffect, #sim-m-q2200-noeffect; marks seen in the add-answers responses saved in runs/exp-w07/net (same service)', 'high')
rule('men', "Basics screen: age under 18, sex female, or zip code not served",
     "Under 18 or unserved zip: the visit stops with a contact form. Female: sent to the women's visit (or an exit form). These are the only stops in the men's schema; there is no upper age limit (age 70 changes nothing).",
     'hard-stop', ['p1', 'p2', 'p3'], 'code', SM + '#sim-m-q112-under18, #sim-m-q112-female, #sim-m-q112-zip, #sim-m-age70', 'high')
rule('men', "men-q132 is a multi-select whose options point to different next questions (e.g. 'Hairline' + 'patches')",
     "The app follows the first ticked option in display order, so the onset, severity and scalp questions are still asked; the patch flags still apply (no recommendation).",
     'next-question', [], 'code', 'raw/js/main.260d4b871de7cb1cb657.js (next-question selector takes the first selected answer) + ' + SM + '#sim-m-q132-hairline+patches', 'medium')
rule('men', "Treatment picked on the recommendation screen",
     "The pick sets the side-effect screen that must be acknowledged (spray: finasteride + minoxidil + tretinoin; tablets: their own) and, for the spray, removes the option of an outside pharmacy. The cart gets the default strength (spray, finasteride 1 mg or minoxidil 2.5 mg) on a quarterly plan; the clinician has the final say.",
     'product-added', ['p1', 'p2', 'p3'], 'code', 'quiz-definition.men-onboarding.raw.json qids 3178, 3210, 5000, 5140 + raw/js/48419.chunk.js', 'high')
# women
rule('women', "Any answer to women-q4 (how long), women-q6 (how it started, including 'Suddenly') or women-q10 (part-line picture 1 to 5)",
     "Nothing changes: same next question and same account wall; after the wall (code) none of them changes what is offered.",
     'none', [], 'observed', 'runs/exp-w01, runs/exp-w02, runs/exp-w03, runs/exp-w04, runs/exp-w08, runs/exp-w09 vs runs/s2-baseline-women; later part ' + SW, 'high')
rule('women', "women-q8 includes 'Top of head/crown' or 'All over'",
     "Adds the part-line picture question before the wall. 'Temples' or 'Frontal scalp' alone skips it.",
     'extra-questions', [], 'observed', 'runs/exp-w05 and runs/exp-w06 (skipped) vs runs/s2-baseline-women and runs/exp-w07 (asked)', 'high')
rule('women', "Every route into the women's visit, whatever is answered before the wall",
     "The account wall comes after 3 or 4 hair questions and before any medical question, product or price.",
     'none', [], 'observed', 'runs/s2-baseline-women, runs/exp-w01 to runs/exp-w09', 'high')
rule('women', "Pregnant = 'Yes' or 'Not sure' (q1055)",
     "Hard stop: 'Unfortunately, our treatments are not available for use during pregnancy.'",
     'hard-stop', ['p10', 'p11'], 'code', SW + '#sim-w-q1055-yes, #sim-w-q1055-not-sure', 'high')
rule('women', "Any diagnosed scalp condition ticked at q1086 (alopecia areata, lichen planopilaris, FFA, CCCA, traction alopecia, lupus)",
     "Hard stop: 'visit an in-person dermatologist' (screen 6040).",
     'hard-stop', ['p10', 'p11'], 'code', SW + '#sim-w-q1086-alopecia-areata and the five neighbours', 'high')
rule('women', "Enlargement of the clitoris, discharge from the nipple(s) or deepening of the voice (q1090)",
     "Hard stop (screen 6040). Excess body or facial hair, severe acne and irregular periods do not stop the visit or change the offer.",
     'hard-stop', ['p10', 'p11'], 'code', SW + '#sim-w-q1090-enlargement-of-the-clitoris, #sim-w-q1090-discharge-from-the-nipples, #sim-w-q1090-deepening-of-your-voice, #sim-w-q1090-noeffect', 'high')
rule('women', "Lupus or other autoimmune disorder (q1096)",
     "Rules out both products: hard stop (screen 6040).",
     'hard-stop', ['p10', 'p11'], 'code', SW + '#sim-w-q1096-lupus-or-other-autoimmune-disorder', 'high')
rule('women', "Past steroid injections into the scalp (q1250); allergy to oral minoxidil = Yes (q1254); allergy to topical minoxidil in foam form or both forms (q1258)",
     "Hard stop (screen 6040). An allergy to the liquid form only, or 'Unsure', continues to the normal choice.",
     'hard-stop', ['p10', 'p11'], 'code', SW + '#sim-w-q1250-steroid-injections-into-the-scalp, #sim-w-q1254-yes-d1, #sim-w-q1258-foam-d2, #sim-w-q1258-both-d2, #sim-w-combo-liquid-allergy', 'high')
rule('women', "Breastfeeding (q1057); heart condition, stroke, phaeochromocytoma, pulmonary hypertension or high blood pressure (q1096); or age 66 or over",
     "Oral minoxidil is removed: no choice screen, Hair Solution Rx is the only treatment shown. Age 65 still gets the choice.",
     'product-removed', ['p10'], 'code', SW + '#sim-w-q1057-yes, #sim-w-q1096-high-blood-pressure, #sim-w-q1096-stroke, #sim-w-age65, #sim-w-age66, #sim-w-combo-bf+age66', 'high')
rule('women', "No exclusion and age 18 to 65 (baseline woman)",
     "Choice screen: Oral Minoxidil ($30 a month), Hair Solution Rx ($40 a month) or No preference, which puts oral minoxidil in the cart. Quarterly plan. Pattern, severity, duration, shedding and family history do not change the options.",
     'product-added', ['p10', 'p11'], 'code', SW + ' (baseline) + #sim-w-q4025-oral, #sim-w-q4025-topical, #sim-w-q4025-nopref, #sim-w-q12-noeffect', 'high')
rule('women', "Self-reported bald patch(es), scalp redness or rash, pus bumps, eyebrow or eyelash loss (q1074); sudden onset (q6); shedding (q1062, q1070); gave birth in the last year (q1059); menopause, illness, stress, weight loss, chemotherapy, hormonal contraception change (q1094)",
     "No stop and no change to the offer. Only a named diagnosis stops the visit; symptoms are only marked ('negative', 'caution', 'ack-clinical') and, we infer, left to the clinician and the scalp photos.",
     'flag-for-clinician', [], 'code', SW + '#sim-w-q1074-noeffect, #sim-w-q1059-noeffect, #sim-w-q1094-noeffect, #sim-w-q1062-noeffect', 'high')
rule('women', "Kidney disease, liver disease, thyroid disorder, anaemia, iron deficiency or PCOS (q1096); 'told you have low blood pressure' (q1185); any other condition, surgery, medicine or allergy",
     "Adds a free-text 'tell us more' box (or a searchable list). The offer does not change.",
     'extra-questions', [], 'code', SW + '#sim-w-q1096-kidney-disease, #sim-w-q1096-thyroid-disorder, #sim-w-q1096-polycystic-ovary-disease, #sim-w-q1185-yes', 'high')
rule('women', "Basics screen: age under 18, sex male, or zip code not served",
     "Under 18 or unserved zip: stop. Male: offered the men's visit.",
     'hard-stop', ['p10', 'p11'], 'code', SW + '#sim-w-age17, #sim-w-male, #sim-w-zip', 'high')
rule('otc-direct', "Topical minoxidil 5%, Revive Shampoo or Restore Conditioner opened from its own 'Buy now' link",
     "No medical question at all: plan screen (or straight to sign-up) then payment.",
     'none', ['p5', 'p7', 'p8'], 'observed', 'runs/probe-vwayzg, runs/probe-kwrssq, runs/probe-qcalmd (stage 1) + the three intent schemas', 'high')
c['rules'] = R

# ---------------------------------------------------------------- recommendations
c['recommendations'] = [
 {'profile': 'Any visitor BEFORE the account wall (man or woman, any pre-wall answers)', 'offered': [], 'default': '',
  'note': "Nothing is offered or priced before sign-up. Men see one general line ('finasteride, minoxidil, or both in a convenient topical spray'); women see no product at all. Seen in 21 live replays.", 'evidence': 'observed'},
 {'profile': 'Baseline man: 32, hairline + crown, gradual, moderate, nothing tried, no conditions or medicines, not trying for a baby', 'offered': ['p1', 'p2', 'p3'], 'default': 'p1',
  'note': "Ro Mane Spray (minoxidil 6%, finasteride 0.3%, tretinoin 0.025%) shown as the recommended treatment, $50 a month on the default quarterly plan ('Starting at $43/mo' on the card). Finasteride 1 mg tablets ($20 a month quarterly) and oral minoxidil 2.5 mg ($30 a month quarterly) listed under 'Other treatment options'. From the served code and offline simulation; the screen itself is behind the wall.", 'evidence': 'code'},
 {'profile': "Same man with any goal, any severity, or 'Nowhere yet, I'd like to prevent future hair loss'; or with liver failure, kidney disease, coronary artery disease, medicines or allergies", 'offered': ['p1', 'p2', 'p3'], 'default': 'p1',
  'note': 'Identical to the baseline: none of these sets a flag.', 'evidence': 'code'},
 {'profile': 'Man with a cardiovascular or blood-pressure red flag only (heart failure, angina, recent heart attack, bypass or stroke, listed arrhythmias, very high readings, phaeochromocytoma) or who did badly on oral minoxidil before', 'offered': ['p1', 'p2', 'p3'], 'default': 'p1',
  'note': 'Only oral minoxidil tablets are flagged; the minoxidil-containing spray is still recommended and the tablets are still listed.', 'evidence': 'code'},
 {'profile': 'Man with depression, anxiety or erectile dysfunction; or trying for a baby in the next 3 months; or past side effects or allergy with finasteride tablets', 'offered': ['p1', 'p2', 'p3'], 'default': 'p3',
  'note': 'Both finasteride products flagged: oral minoxidil 2.5 mg is recommended ($30 a month quarterly). The flagged products can still be picked.', 'evidence': 'code'},
 {'profile': 'Man with a history of prostate cancer; or allergy to topical minoxidil, topical finasteride or oral minoxidil; or living in a state where the compounded spray is not supported', 'offered': ['p1', 'p2', 'p3'], 'default': 'p2',
  'note': 'Spray flagged (or hidden, for the state rule): finasteride 1 mg tablets recommended ($20 a month quarterly).', 'evidence': 'code'},
 {'profile': 'Man with patchy loss, very sudden onset, scalp redness or rash, past steroid injections, persistently low blood pressure, or a mix of flags covering all three treatments', 'offered': ['p1', 'p2', 'p3'], 'default': '',
  'note': "No recommendation: heading 'Your treatment options'. All three treatments remain selectable and the visit goes on to checkout and clinician review. No stop screen.", 'evidence': 'code'},
 {'profile': 'Man under 18, or zip code not served', 'offered': [], 'default': '', 'note': "Stopped at the basics screen with a contact form. A female answer is sent to the women's visit.", 'evidence': 'code'},
 {'profile': 'Baseline woman: 38, thinning on top, gradual, not pregnant or breastfeeding, no conditions', 'offered': ['p10', 'p11'], 'default': 'p10',
  'note': "Choice screen: Oral Minoxidil $30 a month, Hair Solution Rx (minoxidil 5%, tretinoin 0.025%, melatonin 0.1%) $40 a month, or No preference, which puts oral minoxidil in the cart. Quarterly plan. From the served schema and offline simulation.", 'evidence': 'code'},
 {'profile': 'Woman who is breastfeeding, has high blood pressure, a heart condition, stroke, phaeochromocytoma or pulmonary hypertension, or is 66 or older', 'offered': ['p11'], 'default': 'p11',
  'note': 'Hair Solution Rx only, $40 a month quarterly; no choice screen.', 'evidence': 'code'},
 {'profile': 'Woman who is or may be pregnant', 'offered': [], 'default': '', 'note': "Stop screen: 'our treatments are not available for use during pregnancy'.", 'evidence': 'code'},
 {'profile': 'Woman with a diagnosed scalp condition (alopecia areata, scarring alopecias, traction alopecia, lupus), virilisation signs, lupus or autoimmune disorder, past scalp steroid injections, or minoxidil allergy (oral, foam or both forms)', 'offered': [], 'default': '',
  'note': 'Stop screen: referred to an in-person dermatologist (AAD find-a-derm link).', 'evidence': 'code'},
 {'profile': 'Woman under 18, or zip code not served', 'offered': [], 'default': '', 'note': "Stopped at the basics screen. A male answer is offered the men's visit.", 'evidence': 'code'},
 {'profile': "Anyone using a 'Buy now' link for topical minoxidil 5%, shampoo or conditioner", 'offered': ['p5', 'p7', 'p8'], 'default': '',
  'note': 'Sold directly with no questions: minoxidil 5% solution $16 a month on a 3-month plan ($48); shampoo and conditioner $24 per 3 months each.', 'evidence': 'observed'},
]

# ---------------------------------------------------------------- products: recommendedWhen
RW = {
 'p1': "Men: recommended by default. It is first in the fixed order (spray, finasteride tablets, oral minoxidil tablets) and is recommended whenever its flag is clear: baseline man, any goal, any severity, even 'no hair loss yet', and also for men with heart or blood-pressure red flags. It loses the recommended place (but stays selectable) with depression, anxiety, erectile dysfunction, trying for a baby, prostate cancer, bad experience or allergy with finasteride or minoxidil, or any all-flags answer; it is hidden in states that do not support compounded products. (code; runs/sim/men.json)",
 'p2': "Men: recommended only when the spray is flagged or unavailable and finasteride itself is not flagged: prostate cancer, allergy to topical minoxidil, topical finasteride or oral minoxidil, or a state without the compounded spray. Otherwise listed under 'Other treatment options'. (code; runs/sim/men.json#sim-m-q1000-prostate-cancer)",
 'p3': "Men: recommended only when both finasteride products are flagged and oral minoxidil is not: depression, anxiety, erectile dysfunction, trying for a baby in the next 3 months, or side effects or allergy with finasteride tablets. Otherwise listed under 'Other treatment options'. (code; runs/sim/men.json#sim-m-q1000-depression)",
 'p4': "Never offered by the onboarding visit: no answer adds it. It exists only as a catalogue group, so it is probably a dose step a clinician can move a patient to (inferred).",
 'p5': "Never recommended by a consultation. Bought through its own 'Buy now' link with no medical questions (observed, runs/probe-vwayzg); also present in the catalogue as an add-on.",
 'p6': "Not an outcome of the current visit. Public documents only say a clinician 'may recommend using finasteride and minoxidil together' (docs).",
 'p7': "Never recommended by the medical questions. Own 'Buy now' flow (observed, runs/probe-kwrssq) and an add-on in the men's catalogue.",
 'p8': "Never recommended by the medical questions. Own 'Buy now' flow (observed, runs/probe-qcalmd) and an add-on to the shampoo order.",
 'p9': "unknown. Requested as an add-on code by the men's schema but the catalogue group is empty.",
 'p10': "Women: offered on the choice screen to every woman aged 18 to 65 with no exclusion, and it is the default in the cart for 'No preference'. Removed when breastfeeding, with a heart condition, stroke, phaeochromocytoma, pulmonary hypertension or high blood pressure, or from age 66. (code; runs/sim/women.json)",
 'p11': "Women: offered on the choice screen to every eligible woman; it becomes the only treatment shown when oral minoxidil is ruled out (breastfeeding, cardiovascular conditions, high blood pressure, age 66+). Not offered at all after a stop (pregnancy, diagnosed scalp condition, virilisation signs, lupus or autoimmune disorder, steroid injections, minoxidil allergy). (code; runs/sim/women.json)",
}
for p in c['products']:
    if p['id'] in RW: p['recommendedWhen'] = RW[p['id']]

# ---------------------------------------------------------------- summary lists
c['access']['coverageNote'] = ("Stages 1 and 2. LIVE: every question that can be reached without an account was replayed with one answer changed at a time (21 replays in stage 2: men 3 questions, women 4), and three direct-purchase entries were opened in stage 1. Every replay ended at the account wall with no product or price shown. "
    "CODE: the consultation app itself downloads the complete question schema for each flow (every question, option, fork rule and variable change behind the wall) and the men's recommendation function is in a public JS chunk. Stage 2 ran those definitions through an offline simulator, one change at a time (291 simulated runs: 161 men, 130 women, saved in runs/sim/), which is where every post-wall rule and recommendation comes from. These are labelled 'code', not 'observed'. "
    "No email, phone, name or other contact detail was entered, nothing was submitted, no photo or payment was given. Honest note: on the first answer the page itself creates an anonymous draft visitor record and posts each answer to it; that is the site's normal anonymous behaviour, and each live replay leaves one such draft.")
c['engineSummary'] = ("Ro runs two different engines, and both can be read in full from code the site serves to any visitor. "
    "MEN: a 'soft steer' engine. Three marketing questions, then an email wall, then the medical questionnaire (the baseline man passes 19 screens up to the recommendation; reporting past treatments or conditions adds follow-ups). Nothing medical stops a man (only age under 18, female sex or an unserved zip code). Answers switch on up to three 'do not recommend' flags, one per treatment. A fixed priority list (Ro Mane Spray, then finasteride 1 mg tablets, then oral minoxidil 2.5 mg tablets) makes the first unflagged treatment the 'recommended' one, but all three stay on the screen and can be picked, on a default quarterly plan, and a clinician decides afterwards. In the offline one-change sweep the compounded spray, the dearest product, was recommended for every profile except: finasteride-type worries (depression, anxiety, erectile dysfunction, trying for a baby, past finasteride problems) which move the pick to oral minoxidil; prostate cancer or a topical allergy, which move it to finasteride tablets; and five 'another diagnosis?' answers (patches, very sudden onset, scalp redness, past steroid injections, persistently low blood pressure) which remove the recommendation but not the products. Heart and blood-pressure red flags only flag the minoxidil tablet, so the minoxidil spray stays recommended. Goals, severity and pattern only personalise a recap screen. "
    "WOMEN: a 'gate' engine. Three or four hair questions, then the sign-up wall, then the medical questionnaire (the baseline woman passes 31 screens up to the product choice). Pregnancy, any diagnosed scalp condition, signs of virilisation, lupus or autoimmune disease, past scalp steroid injections and minoxidil allergy end the visit with a referral. Breastfeeding, cardiovascular conditions, high blood pressure and age 66+ remove the tablet and leave only the compounded topical. Everyone else chooses between oral minoxidil ($30 a month) and Hair Solution Rx ($40 a month), with 'No preference' defaulting to the tablet; pattern, severity and symptoms never change the options. "
    "Before either wall the answers change only the wording or number of the next question (observed live); no product or price appears. Non-prescription products (5% minoxidil solution, shampoo, conditioner) are sold through separate links with no questions.")
c['strengths'] = [
 "Very short path to sign-up (3 to 4 easy questions) with the long medical questionnaire kept until after the email is captured; 21 live replays never showed a dead end before the wall.",
 "One clear recommended product with the alternatives still visible and pickable, and the clinician as the final check: simple for the patient and it protects conversion.",
 "Men's safety questions for oral minoxidil are detailed: blood-pressure follow-ups with a picture of the ranges, timed heart attack, stroke and bypass questions, arrhythmia types, resting heart rate, fainting.",
 "Finasteride-specific steering is thoughtful: depression, anxiety, erectile dysfunction and trying for a baby all move the recommendation away from both finasteride products, with a plain caution screen about fertility.",
 "Women's visit has firm, explained stop screens (pregnancy, scarring and autoimmune alopecias, virilisation signs) with a find-a-dermatologist link, plus scalp photos and tracked outcome scores (severity, confidence, stress).",
 "Clear public price for every plan length; coupons (35% or 50% off the first order) attach silently from ad links; no charge until a clinician approves.",
 "A broad men's range for a telehealth brand: licensed tablet, off-label oral minoxidil, a compounded 3-in-1 spray, OTC minoxidil, shampoo and conditioner.",
]
c['weaknesses'] = [
 "The men's recommendation barely uses the consultation: the same product (the highest-priced compounded spray) is recommended to every unflagged man whatever his goals, pattern or severity, including a man who reports no hair loss yet.",
 "No product, price or eligibility signal before the email wall; the wall pop-up cannot be closed. 'Seems too expensive' and 'Nervous about side effects' get no answer.",
 "Men are never stopped: patches, very sudden loss, scalp inflammation, liver failure and stage 5 kidney disease all reach checkout, relying entirely on the clinician; pain, pus bumps and eyebrow loss do not even remove the recommendation.",
 "Inconsistent logic visible in the schema: heart failure or angina flags the minoxidil tablet but leaves the 6% minoxidil spray recommended; prostate cancer steers towards finasteride tablets; 'finasteride tablets were not effective' still recommends the finasteride spray.",
 "The men's visit has no scalp-photo step (only identity photos) and no family-history question, although the FAQ says photos are requested.",
 "Women's product choice ignores pattern and severity, and 'No preference' defaults to the oral, off-label tablet with a boxed warning. Self-reported bald patches, scalp rash or sudden onset do not stop or redirect a woman; only a named diagnosis does.",
 "No finasteride, spironolactone or other anti-androgen route for women (for example after the menopause), and no pathway at all for pregnant or breastfeeding-ineligible patients beyond 'see someone else'.",
 "Public pages disagree with each other (the hair-loss FAQ still says finasteride is the only prescription option; the women's page says billed every 2 months while pricing says quarterly).",
 "The whole engine, including every clinical branch and flag, is downloadable by anyone, which makes it easy to copy and easy to game.",
]
c['opportunities'] = [
 "Show an indicative recommendation and price before asking for an email: Ro asks 3 questions and then walls everything.",
 "A recommendation that visibly uses what was asked (pattern, severity, goals, tablet-or-topical preference, budget) instead of one fixed product order; explain why this product was chosen for this person.",
 "Ask the patient's own preference (tablet, topical, 'no finasteride', 'no prescription') up front: Ro's men's flow never asks it and infers it only from medical flags.",
 "Explained 'see a doctor first' screens for red-flag hair loss in men (patches, sudden loss, inflamed scalp), as Ro already does for women, and a useful hand-off rather than a dead end.",
 "A licensed-product-first pathway (finasteride 1 mg, minoxidil 5%) with compounded products as a clearly explained second step; Ro leads with the compounded spray.",
 "Flexible plans: Ro's hair products start at quarterly billing; a monthly or pause-any-time plan and a visible price before sign-up would stand out.",
 "Better women's offer: a pathway by life stage (post-partum shedding, perimenopause, PCOS) with blood-test prompts, rather than one choice between two minoxidil products.",
 "Use scalp photos and family history for men, and tell patients how the photo changed the plan.",
 "Budget and side-effect worries are captured by Ro and then ignored: answer them directly (cheapest effective option, side-effect rates, topical-only route).",
]
c['limitations'] = [
 "Nothing after the account wall was seen live. Every post-wall question, rule and recommendation comes from the served schema, the public recommender chunk and an offline simulation of them (evidence 'code'). The real screens may differ in small ways.",
 "Live one-change testing was only possible on 7 questions (men q20, q22, q26, q28; women q4, q6, q8, q10). Not replayed live: men-q28 'easier or more convenient solution', women-q10 pictures 2 and 4, multi-select combinations, and the alternative entry links other than one coupon link.",
 "What the clinician actually prescribes, how often the patient's pick is overridden, and which strengths are used after the first order cannot be known from public information.",
 "Server-side checks (drug-interaction checks on the medicine list, state rules for compounded products, identity checks, the redirect flag for women entering the men's visit) are only visible as flags and function names; the list of states without the spray is not public.",
 "The meaning of the answer marks ('negative', 'caution', 'ack-clinical') is inferred. They are saved with each answer on the server (seen in the anonymous add-answers responses), but who sees them was not found.",
 "The variable isEligibleFor6And12MonthShipments (set when a man has used oral minoxidil or finasteride tablets before) is not used in the bundles read, so its effect on plan lengths is inferred, not shown.",
 "The women's product catalogue (exact tablet strength, other plan lengths) is not fetched before the wall; women's strengths and prices come from schema text and the pricing page.",
 "Free-text and searchable-list answers (medicines, allergies, other conditions) have no rule in the schema; any effect they have happens at clinician review.",
 "The site runs A/B experiments and changes schema versions (men v77, women v32 on the check date); the three-product men's recommender is at 100% today.",
 "Prices are US dollars and US plan structures; legal categories are US ones (Rx, OTC, compounded), not UK ones.",
]
c['parent'] = "Roman Health Ventures Inc. (trading as Ro). The terms of use name its affiliates Roman Health Medical LLC and Roman Health Pharmacy LLC (docs: https://ro.co/terms-of-use/, checked 2026-11-23)."
have = {s['url'] for s in c['sources']}
for t, u in [("Main app bundle (fork evaluator, next-question selector, recap bullets, blood-pressure ranges)", "https://start.ro.co/assets/main.260d4b871de7cb1cb657.js"),
             ("Coupon match endpoint the page calls when opened from an ad link", "https://start.ro.co/api/coupons/match-trigger"),
             ("Terms of use (company and pharmacy names)", "https://ro.co/terms-of-use/")]:
    if u not in have: c['sources'].append({'title': t, 'url': u})

json.dump(c, open(BASE + 'company.json', 'w'), indent=1, ensure_ascii=False)
print('experiments', len(c['experiments']), '(live %d, offline %d)' % (sum(1 for e in c['experiments'] if e['evidence'] == 'observed'), sum(1 for e in c['experiments'] if e['evidence'] == 'code')),
      '| rules', len(c['rules']), '| recommendations', len(c['recommendations']))
