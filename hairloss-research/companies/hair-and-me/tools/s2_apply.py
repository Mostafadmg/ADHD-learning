#!/usr/bin/env python3
"""s2_apply.py — stage 2 (EXPERIMENT): write company.json for Hair + Me.

Input : company.stage1.json (the stage 1 map, untouched), quiz-definition.json, every runs/*/api.jsonl,
        runs/<id>.json (which answer each run changed), and the annotation tables in this file and s2_text.py.
Output: company.json (overwritten every time: do not edit company.json by hand, edit the tables and re-run).

  python3 tools/build_quizdef.py && python3 tools/s2_apply.py && node ../../tools/validate.js hair-and-me --stage rules

How an option's "effect" text is built:
  1. what a replay showed (one-change replay > group-test sweep > stage 1 multi-change scout > other route only),
  2. plus, where the company's own leaflets / FAQ say what the prescriber must do with that answer, that rule (DOC table).
"""
import json, os, sys, re, glob, copy, collections
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import s2_diff, s2_make, s2_text as T
base = os.path.join(HERE, '..')
D = json.load(open(os.path.join(base, 'company.stage1.json')))
QD = json.load(open(os.path.join(base, 'quiz-definition.json')))['steps']
PID = [p['id'] for p in D['products']]

# ---------------------------------------------------------------- run registry
A = s2_diff.allruns()
RUN = {}
for run, o in A.items():
    spec = {}
    try: spec = json.load(open(os.path.join(base, 'runs', run + '.json')))
    except Exception: pass
    ch = spec.get('_changed', {})
    posted = o['r']['posted']
    sexv = [v for q, v in posted.get('pds', []) if q == 3039]
    flow = 'men' if sexv and str(sexv[0]) == '1' else ('women' if sexv else None)
    if run in s2_diff.ALLBASE or run.startswith('s2-base-'): kind = 'baseline'
    elif ch.get('sweep'): kind = 'sweep'
    elif ch.get('step'): kind = 'one-change'
    elif run in ('home', 'pages', 'entry-points'): kind = 'pages'
    elif run == 'entry-promo-caps-men': kind = 'entry'
    elif run == 'scout-men-none': kind = 'one-change'
    else: kind = 'scout'
    summ = s2_diff.analyse(run) if flow else {}
    RUN[run] = {'flow': flow, 'kind': kind, 'changedSet': set(o['changedSet']), 'posted': posted, 'order': o['r']['order'], 'desc': ch.get('desc'), 'summary': summ,
                'reachedBag': 'ct' in o['r']['order'], 'nChanged': len(o['changedSet'])}
RUN.get('s2-m-mcm-bp-elevated', {}).update({'changedSet': {'bp'}, 'kind': 'one-change'}) if 's2-m-mcm-bp-elevated' in RUN else None
if 's2-m-mcm-bp' in RUN: RUN['s2-m-mcm-bp']['changedSet'] = {'mcm', 'bp'}
CONS = {r: v for r, v in RUN.items() if v['flow']}
N_S2 = sum(1 for r in CONS if r.startswith('s2-'))
N_ALL = len(CONS)

BASESTEPS = {fl: set().union(*[set(RUN[b]['order']) for b in s2_diff.BASES[fl] if b in RUN]) for fl in ('men', 'women')}
def chose(run, qid, value):
    for sid, lst in RUN[run]['posted'].items():
        for q, v in lst:
            if q != qid: continue
            vals = v if isinstance(v, list) else [v]
            if any(str(x) == str(value) for x in vals): return True
    return False

def value_of(sid, qid, label):
    for v in QD.get(sid, {}).get('variants', []):
        for q in v['definition'].get('questions', []):
            if q['id'] != qid: continue
            for o in (q.get('inputConfig') or {}).get('options') or []:
                if o.get('label') == label or o.get('value') == label: return o.get('value')
    return None
ALT_Q = {9346: [9346, 9348], 244: [244, 254], 245: [245, 255], 3053: [3053, 3079]}

def raw_changes(run):
    S = RUN[run]['summary']; rnd = {'js', 'hs'}
    if not S: return ['no summary']
    out = [('new', s) for s in S.get('newSteps', []) if s not in rnd] + [('missing', s) for s in S.get('missingSteps', []) if s not in rnd]
    out += [('changed', c['step'], c['key']) for c in S.get('candidateEffects', [])]
    if 'account wall' not in S.get('end', '') or 'error' in S.get('end', ''): out.append(('end', S.get('end')))
    if S.get('bagItemsSameAsBaseline') is not True: out.append(('bag', S.get('bag')))
    return out
def clean(run): return not raw_changes(run)
WARN = []
def warn(m): WARN.append(m); print('WARNING: ' + m)
def visible(run):
    """plain words: what a visitor could see change in this run against the baseline pool; '' if nothing"""
    S = RUN[run]['summary']; bits = []
    if run in T.VISTEXT: return T.VISTEXT[run]
    if not S: return ''
    rnd = {'js', 'hs'}
    new = [s for s in S.get('newSteps', []) if s not in rnd]; miss = [s for s in S.get('missingSteps', []) if s not in rnd]
    if 'utt' in new: return "hard stop 'We're unable to treat you at this time' (no bag)"
    if new: bits.append('extra screen(s): ' + ', '.join(T.STEPNAME.get(s, s) for s in new))
    if miss: bits.append('screen(s) skipped: ' + ', '.join(T.STEPNAME.get(s, s) for s in miss))
    for c in S.get('candidateEffects', []):
        if c['step'] in RUN[run]['changedSet'] and not c['key'].endswith('.options'): continue
        bits.append(f"{T.STEPNAME.get(c['step'], c['step'])} changed ({c['key']})")
    return '; '.join(bits)

def cite(runs, n=3): return ', '.join('runs/' + r for r in sorted(runs)[:n]) + (f' and {len(runs) - n} more' if len(runs) > n else '')

# ---------------------------------------------------------------- option effects
def evidence_for(flow, sid, qid, label):
    """returns (observed sentence, tier) for one option of one flow. tier: one-change | sweep | scout | baseline | other-route | untested"""
    qids = ALT_Q.get(qid, [qid]); val = None
    for q in qids:
        val = value_of(sid, q, label)
        if val is not None: break
    if val is None: val = label
    def picked(run): return any(chose(run, q, val) for q in qids)
    mine = [r for r, v in CONS.items() if v['flow'] == flow and picked(r)]
    other = [r for r, v in CONS.items() if v['flow'] != flow and picked(r)]
    def tiers(rs):
        # a step that no baseline visit of the route ever shows (hgp, bp, pgc) only exists because of the run's change
        def ch(r): return sid in RUN[r]['changedSet'] or sid not in BASESTEPS[RUN[r]['flow']]
        oc = [r for r in rs if RUN[r]['kind'] == 'one-change' and ch(r)]
        sw = [r for r in rs if RUN[r]['kind'] == 'sweep' and ch(r)]
        sc = [r for r in rs if RUN[r]['kind'] == 'scout' and ch(r)]
        bl = [r for r in rs if not ch(r)]
        return oc, sw, sc, bl
    oc, sw, sc, bl = tiers(mine)
    if oc:
        vis = [visible(r) for r in oc]
        v = vis[0]
        s = (f"One-change replay ({cite(oc)}): " + (v + '.' if v else "nothing a visitor can see changed: same screens, no warning, no stop, same bag (Personalised treatment, 4 week supply, £34.99)."))
        return s, 'one-change', oc
    if bl and len(bl) >= 1 and not sw and not sc:
        return f"Baseline answer ({cite(bl)}): this is the reference route to the £34.99 'Personalised treatment' bag.", 'baseline', bl
    if sw:
        v = [visible(r) for r in sw]; n = RUN[sw[0]]['nChanged']
        if not any(v): return f"Group test ({cite(sw)}: {n} non-medical answers changed together, this one among them): nothing a visitor can see changed, so this answer by itself changes nothing before the account wall.", 'sweep', sw
        return f"Group test ({cite(sw)}: {n} non-medical answers changed together, this one among them): {v[0]}. " + T.SWEEP_NOTE.get((sid, label), 'So this answer by itself changes nothing a visitor can see before the account wall.'), 'sweep', sw
    if sc:
        bag = [r for r in sc if RUN[r]['reachedBag']]
        if bag: return f"Stage 1 multi-change scout ({cite(bag)}): no stop and no extra screen from this answer; the walk reached the same £34.99 bag. Not replayed as a one-change test.", 'scout', sc
        return f"Stage 1 multi-change scout ({cite(sc)}): no stop and no extra screen from this answer up to the eligibility screen (that run ended at the under-18 stop). Not replayed as a one-change test.", 'scout', sc
    if bl: return f"Baseline answer ({cite(bl)}).", 'baseline', bl
    if other:
        oc2, sw2, sc2, bl2 = tiers(other); best = oc2 or sw2 or sc2 or bl2
        kind = 'one-change replay' if oc2 else ('group test' if sw2 else ('multi-change scout' if sc2 else 'baseline'))
        v = visible(best[0]) if (oc2 or sw2) else ''
        oth = "men's" if flow == 'women' else "women's"
        return f"Not replayed on this route. The same screen is served on the {oth} route, where a {kind} ({cite(best)}) showed " + (v if v else "nothing visible changing") + ".", 'other-route', best
    return f"Not chosen in any replay (the {N_S2} stage 2 replays had to be prioritised): effect untested.", 'untested', []

VIS_TYPE = T.VIS_TYPE  # (step, label prefix) -> effectType when the replay showed something visible

def doc_for(sid, label):
    for (s, pre), v in T.DOC.items():
        if s == sid and label.startswith(pre): return v
    return None

stats = collections.Counter()
for f in D['flows']:
    for q in f['questions']:
        sid, qid = q.get('stepId'), q.get('siteQuestionId')
        if not sid or not q['options']: continue
        for o in q['options']:
            key = (q['id'].split('-', 1)[1], o['label'])
            if key in T.OPT_FIXED or (q['id'], o['label']) in T.OPT_FIXED:
                fx = T.OPT_FIXED.get((q['id'], o['label'])) or T.OPT_FIXED[key]
                o.update({'effect': fx[0], 'effectType': fx[1], 'affects': fx[2], 'evidence': fx[3]}); stats['fixed'] += 1; continue
            if q['type'] in ('consent',) or sid in ('el',): stats['kept'] += 1; continue
            obs, tier, runs = evidence_for(f['id'], sid, qid, o['label'])
            doc = doc_for(sid, o['label'])
            vt = None
            for (s, pre), t in VIS_TYPE.items():
                if s == sid and o['label'].startswith(pre): vt = t
            if doc:
                dtext, dtype, aff, dev = doc
                o['effect'] = obs + ' ' + dtext
                o['effectType'] = vt or dtype; o['affects'] = [a for a in aff if a in PID]
                o['evidence'] = 'observed' if vt and tier in ('one-change', 'sweep', 'scout') else (dev if tier != 'untested' or dev in ('docs', 'inferred') else 'unknown')
            elif tier == 'untested':
                o['effect'] = obs; o['effectType'] = 'unknown'; o['affects'] = []; o['evidence'] = 'unknown'
            else:
                extra = T.NOTE.get((sid, o['label']), '')
                o['effect'] = obs + (' ' + extra if extra else ''); o['effectType'] = vt or 'none'; o['affects'] = T.AFFECTS.get((sid, o['label']), [])
                o['evidence'] = 'inferred' if tier == 'other-route' else 'observed'
            o['testedBy'] = tier
            stats[tier] += 1

# ---------------------------------------------------------------- question-level text
def presence(sid):
    m = [r for r, v in CONS.items() if v['flow'] == 'men' and 'el' in v['order']]; w = [r for r, v in CONS.items() if v['flow'] == 'women' and 'el' in v['order']]
    return sum(1 for r in m if sid in RUN[r]['order']), len(m), sum(1 for r in w if sid in RUN[r]['order']), len(w)
PRES = {s: presence(s) for s in ('js', 'hs', 'yna', 'ls', 'mi', 'dt')}
for f in D['flows']:
    for q in f['questions']:
        suf = q['id'].split('-', 1)[1]
        up = T.Q.get(q['id']) or T.Q.get(suf)
        if up:
            for k, v in up.items(): q[k] = v.format(**{k2: '%d of %d men\'s and %d of %d women\'s completed walks' % PRES[k2] for k2 in PRES}) if isinstance(v, str) else v
    # questions behind the account wall (docs / code / inferred only)
    f['questions'] = [q for q in f['questions'] if not q['id'].endswith(('-after-account', '-after-photos', '-after-payment'))]
    n = max(q['order'] for q in f['questions'])
    for i, aq in enumerate(T.AFTER_WALL):
        x = copy.deepcopy(aq); x['id'] = f"{f['id']}-{x['id']}"; x['order'] = n + 1 + i; f['questions'].append(x)
    f['stagesSummary'] = T.STAGES[f['id']]

# ---------------------------------------------------------------- experiments
EXP = []
for x in D['experiments']:
    y = dict(x); y['stage'] = 1; y['type'] = 'one-change' if x['id'] in ('scout-men-none', 'entry-promo-caps-men') else 'multi-change scout'; EXP.append(y)
def result_text(run):
    S = RUN[run]['summary']; v = visible(run); n = S.get('nSteps')
    if run in T.RESULT: return T.RESULT[run]
    end = S.get('end', '')
    if 'utt' in end: return "Hard stop after the eligibility screen: 'We're unable to treat you at this time... we're unable to treat your age group.' No bag, no account screen."
    tail = f"Walk ended at the account wall after {n} screens; bag unchanged: 'Prescription · Personalised treatment · 4 week supply · 12ml', £34.99, free shipping."
    if v: return v[0].upper() + v[1:] + '. ' + tail
    return "No visible change: same screens as the baseline pool, no warning, no stop. " + tail
order_ids = [e[0] for e in s2_make.EXPS] + [s[0] for s in s2_make.SWEEPS]
s2runs = sorted([r for r in CONS if r.startswith('s2-')], key=lambda r: (0 if 'base' in r else 1, order_ids.index(r) if r in order_ids else 999, r))
for run in s2runs:
    R = RUN[run]
    if R['kind'] == 'baseline': changed = f"none: replay of baseline-{R['flow']}.json to confirm it still works and to measure the server's random variation"
    else: changed = R['desc'] or ''
    EXP.append({'id': run, 'flow': R['flow'], 'changed': changed, 'result': result_text(run), 'run': 'runs/' + run, 'stage': 2,
                'type': {'baseline': 'baseline replay', 'one-change': 'one-change', 'sweep': 'group test (several non-medical answers at once)'}[R['kind']],
                'screens': R['summary'].get('nSteps'), 'endedAt': R['summary'].get('end')})
D['experiments'] = EXP

# ---------------------------------------------------------------- rules, recommendations, products, summary
def kindn(k): return sum(1 for r, v in CONS.items() if r.startswith('s2-') and v['kind'] == k)
ctx = {'N_S2': N_S2, 'N_ALL': N_ALL, 'runs': RUN, 'PRES': PRES, 'warn': warn, 'clean': clean, 'visible': visible,
       'N_BAG': sum(1 for v in CONS.values() if v['reachedBag']), 'N_BAG_S2': sum(1 for r, v in CONS.items() if v['reachedBag'] and r.startswith('s2-')),
       'N_BASE_M': len([b for b in s2_diff.BASES['men'] if b in RUN]), 'N_BASE_W': len([b for b in s2_diff.BASES['women'] if b in RUN]),
       'N_S2_BASE': kindn('baseline'), 'N_S2_OC': kindn('one-change'), 'N_S2_SW': kindn('sweep')}
D['rules'] = T.rules(ctx)
D['recommendations'] = T.RECS
for p in D['products']:
    if p['id'] in T.PROD: p.update(T.PROD[p['id']])
for k in ('engineSummary', 'strengths', 'weaknesses', 'opportunities', 'limitations'): D[k] = T.TOP[k] if not callable(T.TOP[k]) else T.TOP[k](ctx)
D['access'].update(T.ACCESS(ctx))
D['sources'] = D['sources'] + [s for s in T.SOURCES if s['url'] not in {x['url'] for x in D['sources']}]
D['checkedOn'] = '2026-11-23'
D['stage'] = 'rules (stage 2 of 3: one-change experiments)'
D['serverRandomness'] = T.RANDOMNESS(ctx)

# resolve rule cross-references (§key -> rule id)
txt = json.dumps(D, indent=1, ensure_ascii=False)
for k, rid in ctx.get('rulekeys', {}).items(): txt = txt.replace('§' + k, rid)
if '§' in txt: warn('unresolved rule reference: ' + txt[txt.index('§'):txt.index('§') + 30])
open(os.path.join(base, 'company.json'), 'w').write(txt)
D = json.loads(txt)
unk = sum(1 for f in D['flows'] for q in f['questions'] for o in q['options'] if o['effectType'] == 'unknown')
tot = sum(len(q['options']) for f in D['flows'] for q in f['questions'])
print(f"company.json written: {len(D['products'])} products, {sum(len(f['questions']) for f in D['flows'])} questions, {tot} options ({unk} unknown), {len(D['rules'])} rules, {len(D['experiments'])} experiments, {len(D['recommendations'])} recommendation profiles")
print('option evidence tiers:', dict(stats))

for r, v in sorted(CONS.items()):
    if r.startswith('s2-') and v['kind'] != 'baseline' and not clean(r) and r not in T.VISTEXT:
        print('  note: visible change without hand-written text:', r, raw_changes(r)[:4])
print(len(WARN), 'warning(s)')
