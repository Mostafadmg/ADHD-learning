# Stage 2: one-change sweep of Ro's served quiz definitions, done OFFLINE with scripts/simulate.py.
# It never touches the website. Every result is evidence type "code" (what the served schema says), not "observed".
#
# Usage: python3 -I scripts/sweep.py        -> writes runs/sim/men.json, runs/sim/women.json, runs/sim/summary.txt
#
# Method: start from the baseline answers. For every question on the path, change ONE answer (for a multi-select:
# each option on its own) and compare the new path and result with the parent run. If a change opens new questions,
# they get a neutral answer (NEUTRAL below) and are then varied one at a time against that parent (depth up to 4).
import importlib.util, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('simulate', os.path.join(HERE, 'simulate.py'))
S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
BASE = S.BASE

# Neutral answers for questions that only appear after a change (the "nothing more to report" option).
NEUTRAL = {
 'men': {240: ['topical-minoxidil'], 1255: ['ischemic-stroke'], 1260: ['stroke-2-plus-years'], 1275: ['kidney-disease-chronic-stage-1'],
         1285: ['liver-cirrhosis'], 1315: ['heart-attack-2-plus-years'], 1320: ['heart-attack-seeing-cardiologist-yes'],
         1355: ['coronary-bypass-surgery-2-plus-years'], 1360: ['coronary-bypass-surgery-seeing-cardiologist-yes'],
         1420: ['premature-ventricular-contractions'], 1430: ['ablation-procedure-no'], 1435: ['afib-since-ablation-procedure-no'],
         1440: ['meds-for-afib-no'], 1455: ['resting-rate-60-to-69'], 1460: ['fainted-from-low-heart-rate-no']},
 'women': {},
}
for flow in NEUTRAL: S.DEFAULT[flow].update(NEUTRAL[flow])
SKIP_Q = {'men': {55, 70, 112, 3178, 3200, 395, 2355, 3177, 3180}, 'women': {30, 1050, 4025, 4030, 4040, 4042}}  # screens handled separately / no real choice

def load(flow):
    d = json.load(open(BASE + S.FILES[flow]))
    return {q['qid']: q for g in d['groups'] for q in g['questions']}

def outcome(flow, r):
    if flow == 'men':
        return {'end': r['end'][0], 'flags': r['flags'], 'recommended': r['recommended']}
    return {'end': r['end'][0], 'vars': r['vars'], 'result': r['result']}

def label(Q, qid, slugs):
    names = {a['slug']: a['text'] for a in Q[qid]['answers']}
    return ' + '.join(names.get(s, s) for s in slugs) if slugs else '(nothing)'

def sweep(flow, age=None):
    Q = load(flow)
    out, seen = [], set()
    def rec(parent_answers, parent_run, parent_id, depth):
        ppath = [p[0] for p in parent_run['path']]
        pans = {p[0]: (p[2] if len(p) > 2 else []) for p in parent_run['path']}
        for qid in ppath:
            q = Q[qid]
            if qid in SKIP_Q[flow] or not q['answers'] or q['type'] not in ('choice', 'multichoice'): continue
            if depth > 0 and (qid in seen_parent_q[parent_id]): continue
            for a in sorted(q['answers'], key=lambda a: a['position']):
                if [a['slug']] == pans.get(qid): continue
                key = (tuple(sorted((k, tuple(v)) for k, v in parent_answers.items())), qid, a['slug'])
                if key in seen: continue
                seen.add(key)
                ans = dict(parent_answers); ans[str(qid)] = [a['slug']]
                try: r = S.run(flow, ans, age)
                except SystemExit as e:
                    out.append({'id': 'ERR', 'error': str(e), 'qid': qid, 'slug': a['slug']}); continue
                path = [p[0] for p in r['path']]
                added = [x for x in path if x not in ppath]; removed = [x for x in ppath if x not in path]
                eid = 'sim-%s-q%d-%s' % (flow[0], qid, a['slug'][:40]) + ('' if depth == 0 else '-d%d' % depth)
                while any(o.get('id') == eid for o in out): eid += 'x'
                o = {'id': eid, 'flow': flow, 'depth': depth, 'parent': parent_id, 'qid': qid, 'slug': a['slug'],
                     'changed': '%s-q%d: %s -> %s' % (flow, qid, label(Q, qid, pans.get(qid, [])), a['text']),
                     'answers': ans, 'added': [(x, Q[x]['text'][:90]) for x in added], 'removed': [(x, Q[x]['text'][:90]) for x in removed],
                     'parentOutcome': outcome(flow, parent_run), 'outcome': outcome(flow, r),
                     'changedOutcome': outcome(flow, parent_run) != outcome(flow, r), 'highlight': (a.get('meta') or {}).get('highlight'),
                     'vars': a.get('variable_modifications') or []}
                out.append(o)
                if added and depth < 4:
                    seen_parent_q[eid] = set(ppath)
                    rec(ans, r, eid, depth + 1)
    seen_parent_q = {}
    base = S.run(flow, {}, age)
    rec({}, base, 'baseline', 0)
    return base, out

def main():
    os.makedirs(BASE + 'runs/sim', exist_ok=True)
    lines = []
    for flow in ('men', 'women'):
        base, out = sweep(flow)
        Q = load(flow)
        extra = []
        if flow == 'men':
            # special cases outside the automatic sweep
            cases = [('sim-m-q132-hairline+patches', {'132': ['hairline', 'patches']}, None, 'men-q132: Hairline + Crown -> Hairline + Random golf-ball size bald patches (mixed pick)'),
                     ('sim-m-q112-under18', {'112': ['under-18-years-old']}, None, 'men-q112 (basics): age 32 -> under 18'),
                     ('sim-m-q112-female', {'112': ['female']}, None, 'men-q112 (basics): male -> female'),
                     ('sim-m-q112-zip', {'112': ['not-supported-zip-code']}, None, 'men-q112 (basics): served zip -> zip not served'),
                     ('sim-m-age70', {}, 70, 'men-q112 (basics): age 32 -> 70'),
                     ('sim-m-q22-both', {'22': ['hair-loss-solutions-non-prescription', 'hair-loss-solutions-prescription-medications']}, None, 'men-q22: None of the above -> both "tried" boxes'),
                     ('sim-m-combo-dep+hf', {'1000': ['depression'], '1300': ['heart-failure']}, None, 'TWO changes: depression (q1000) + heart failure (q1300)'),
                     ('sim-m-combo-pc+brady', {'1000': ['prostate-cancer', 'depression'], '1300': ['heart-failure']}, None, 'THREE changes: prostate cancer + depression + heart failure'),
                     ('sim-m-old-flow', {}, None, 'experiment mhlConsultativeOv switched off (older two-product screen)')]
            for eid, ans, age, changed in cases:
                r = S.run('men', ans, age, 0 if eid == 'sim-m-old-flow' else 1)
                path = [p[0] for p in r['path']]; bpath = [p[0] for p in base['path']]
                extra.append({'id': eid, 'flow': 'men', 'depth': 0, 'parent': 'baseline', 'changed': changed, 'answers': ans, 'age': age,
                              'added': [(x, Q[x]['text'][:90]) for x in path if x not in bpath], 'removed': [(x, Q[x]['text'][:90]) for x in bpath if x not in path],
                              'parentOutcome': outcome('men', base), 'outcome': outcome('men', r), 'changedOutcome': outcome('men', base) != outcome('men', r)})
        else:
            cases = [('sim-w-age17', {'30': ['under-18-yo']}, None, 'women-q30 (basics): age 38 -> under 18'),
                     ('sim-w-male', {'30': ['male']}, None, 'women-q30 (basics): female -> male'),
                     ('sim-w-zip', {'30': ['not-supported-zip-code']}, None, 'women-q30 (basics): served zip -> zip not served'),
                     ('sim-w-age18', {}, 18, 'women-q30 (basics): age 38 -> 18'), ('sim-w-age21', {}, 21, 'women-q30 (basics): age 38 -> 21'),
                     ('sim-w-age64', {}, 64, 'women-q30 (basics): age 38 -> 64'), ('sim-w-age65', {}, 65, 'women-q30 (basics): age 38 -> 65'),
                     ('sim-w-age66', {}, 66, 'women-q30 (basics): age 38 -> 66'), ('sim-w-age80', {}, 80, 'women-q30 (basics): age 38 -> 80'),
                     ('sim-w-q8-temples+frontal', {'8': ['temples', 'frontal-scalp']}, None, 'women-q8: Top of head/crown -> Temples + Frontal scalp'),
                     ('sim-w-combo-bf+age66', {'1057': ['yes']}, 66, 'TWO changes: breastfeeding + age 66'),
                     ('sim-w-combo-liquid-allergy', {'1250': ['topical-minoxidil'], '1256': ['yes'], '1258': ['liquid']}, None, 'women: used topical minoxidil, allergic, to the LIQUID form'),
                     ('sim-w-q4025-oral', {'4025': ['oral-minoxidil']}, None, 'women-q4025 (choice screen): pick Oral Minoxidil'),
                     ('sim-w-q4025-topical', {'4025': ['hair-solution-rx']}, None, 'women-q4025 (choice screen): pick Hair Solution Rx'),
                     ('sim-w-q4025-nopref', {'4025': ['no-preference']}, None, 'women-q4025 (choice screen): pick No preference')]
            for eid, ans, age, changed in cases:
                if eid.startswith('sim-w-q4025'):
                    saved = set(S.STOP_AT['women']); S.STOP_AT['women'] = {5041, 5042, 6040}
                    r = S.run('women', ans, age); S.STOP_AT['women'] = saved
                else:
                    r = S.run('women', ans, age)
                path = [p[0] for p in r['path']]; bpath = [p[0] for p in base['path']]
                extra.append({'id': eid, 'flow': 'women', 'depth': 0, 'parent': 'baseline', 'changed': changed, 'answers': ans, 'age': age,
                              'added': [(x, Q[x]['text'][:90]) for x in path if x not in bpath], 'removed': [(x, Q[x]['text'][:90]) for x in bpath if x not in path],
                              'parentOutcome': outcome('women', base), 'outcome': outcome('women', r), 'changedOutcome': outcome('women', base) != outcome('women', r)})
        res = {'note': 'Offline simulation of the served schema (scripts/simulate.py + scripts/sweep.py). Evidence type: code. Not live replays.',
               'baseline': {'path': base['path'], 'outcome': outcome(flow, base)}, 'experiments': out + extra}
        json.dump(res, open(BASE + 'runs/sim/%s.json' % flow, 'w'), indent=1, ensure_ascii=False)
        lines.append('===== %s: baseline %d screens -> %s' % (flow, len(base['path']), outcome(flow, base)))
        for o in out + extra:
            if o.get('id') == 'ERR': lines.append('  ERR ' + json.dumps(o)); continue
            oc = o['outcome']
            res_s = (oc.get('recommended') or oc.get('result'))
            fl = oc.get('flags') or oc.get('vars')
            lines.append('  %-58s | %s | +%s -%s | %s | %s%s' % (o['id'][:58], o['changed'][:110], [x for x, _ in o['added']], [x for x, _ in o['removed']], res_s,
                                                               ''.join(str(v) for v in fl.values()), '  <== CHANGED' if o['changedOutcome'] else ''))
    open(BASE + 'runs/sim/summary.txt', 'w').write('\n'.join(lines) + '\n')
    print('\n'.join(lines))

if __name__ == '__main__':
    main()
