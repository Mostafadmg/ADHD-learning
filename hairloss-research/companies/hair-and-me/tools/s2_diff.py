#!/usr/bin/env python3
"""s2_diff.py <exp-run> [...] — compare a one-change experiment with ALL baseline runs of the same route.

Because the server varies steps at random between visits (see notes.md), one baseline run is not enough.
This tool pools every baseline replay of the route (men: baseline-men, s2-base-men-*; women: baseline-women,
women-a, s2-base-women-*), and for the experiment run reports only what NO baseline visit showed:
  NEW steps (never in a baseline visit) · MISSING steps (in every baseline visit, absent here)
  CHANGED definitions (a title / text / option list / badge that no baseline visit served for that step),
  split into "before the changed step" (cannot be caused by the change: noise) and "at or after it"
  the bag (items, price, promo) and where the walk ended.
Writes runs/<exp>/summary.json and prints a short report. With --json prints one JSON line per run.
"""
import json, sys, os, re, glob
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'runs')

def load(run):
    steps, order, posts, posted = {}, [], {}, {}
    p = os.path.join(base, run, 'api.jsonl')
    if not os.path.exists(p): return None
    for line in open(p):
        try: e = json.loads(line)
        except Exception: continue
        m = re.search(r'/consultation/suh/([a-z0-9-]+)$', e['url'])
        if not m: continue
        sid = m.group(1)
        if e['method'] == 'GET' and e['status'] == 200:
            try: steps[sid] = json.loads(e['body'])['step']
            except Exception: continue
            if sid not in order: order.append(sid)
        elif e['method'] == 'POST':
            try: posts[sid] = json.loads(e['body']).get('slug')
            except Exception: posts[sid] = 'HTTP %s %s' % (e['status'], e['body'][:120])
            try: posted[sid] = [(q['id'], q.get('value')) for q in json.loads(e.get('post') or '{}').get('questions', []) if q.get('value') is not None]
            except Exception: pass
    return {'steps': steps, 'order': order, 'posts': posts, 'posted': posted}

def flat(step):
    out = {'title': step.get('title'), 'description': step.get('description')}
    for q in step.get('questions', []):
        ic = q.get('inputConfig') or {}
        k = f"q{q['id']}"
        out[k + '.type'] = q['inputType']; out[k + '.label'] = q.get('label'); out[k + '.text'] = q.get('text')
        if isinstance(ic.get('options'), list):
            out[k + '.options'] = json.dumps([[o.get('label'), o.get('badges') or [], o.get('description')] for o in ic['options']], ensure_ascii=False)
        else:
            out[k + '.config'] = re.sub(r'"consultationExternalId": "[^"]+"', '', json.dumps(ic, sort_keys=True, ensure_ascii=False))
    return out

def bag(st):
    ct = st.get('ct')
    if not ct: return None
    ic = ct['questions'][0]['inputConfig']; promo = [q for q in ct['questions'] if q['inputType'] == 'promo_code']
    tot = [q for q in ct['questions'] if q['inputType'] == 'cart_totals']
    return {'items': [[i.get('code'), i['treatment'].get('name'), i['treatment'].get('description'), i['treatment'].get('pill'), i['subtotal'].get('amount'), i['subtotal'].get('originalAmount')] for i in ic.get('items', [])],
            'shipping': tot[0]['inputConfig']['shipping']['amount'] if tot else None, 'total': tot[0]['inputConfig']['total']['amount'] if tot else None,
            'promo': (promo[0]['inputConfig'].get('promotionCode') or {}).get('code') if promo else None,
            'shippingMsg': ic.get('shippingEligibilityMessage')}

BASES = {'men': ['baseline-men'] + sorted(os.path.basename(p) for p in glob.glob(os.path.join(base, 's2-base-men-*')) if os.path.isdir(p)),
         'women': ['baseline-women', 'women-a'] + sorted(os.path.basename(p) for p in glob.glob(os.path.join(base, 's2-base-women-*')) if os.path.isdir(p))}
ALLBASE = set(BASES['men'] + BASES['women'])
_all = {}
def allruns():
    """every run folder with an api.jsonl -> {'r': loaded, 'flat': {step: flat}, 'changedStep': step or None}"""
    if _all: return _all
    for p in sorted(glob.glob(os.path.join(base, '*', 'api.jsonl'))):
        run = os.path.basename(os.path.dirname(p)); r = load(run)
        if not r or not r['order']: continue
        cs, chset = None, None
        try:
            spec = json.load(open(os.path.join(base, run + '.json')))
            cs = spec.get('_changed', {}).get('step')
            if spec.get('_changed', {}).get('steps'): chset = set(spec['_changed']['steps'])
            elif not cs:   # stage 1 run: which answers differ from the baseline of its route?
                sex = spec['answers']['pds'][0]['value']['label']
                b = json.load(open(os.path.join(base, '..', 'baseline-men.json' if sex == 'Male' else 'baseline-women.json')))
                chset = {k for k in set(spec['answers']) | set(b['answers']) if spec['answers'].get(k) != b['answers'].get(k) and k in r['order']}
                if 'promocode' in spec.get('start', ''): chset.add('ct')
        except Exception: pass
        _all[run] = {'r': r, 'flat': {sid: flat(st) for sid, st in r['steps'].items()}, 'changedStep': cs, 'changedSet': chset if chset is not None else ({cs} if cs else set())}
    return _all

def seen_elsewhere(run, sid, key, val):
    """other runs that served the same value for this step/key, split into unrelated (baselines, or one-change runs that changed a different step) and related"""
    A = allruns(); mine = A[run]['changedStep']; unrelated, related = [], []
    for other, o in A.items():
        if other == run or sid not in o['flat'] or o['flat'][sid].get(key) != val: continue
        if other in ALLBASE or not (A[run]['changedSet'] & o['changedSet']): unrelated.append(other)
        else: related.append(other)
    return unrelated, related

def analyse(run):
    A = allruns()
    if run not in A: return {'run': run, 'error': 'no api.jsonl'}
    spec = {}
    try: spec = json.load(open(os.path.join(base, run + '.json')))
    except Exception: pass
    ch = spec.get('_changed', {})
    flow = ch.get('flow') or ('women' if '-w-' in run or 'women' in run else 'men')
    r = A[run]['r']; order = r['order']; cs = ch.get('step')
    chs = [x for x in A[run]['changedSet'] if x in order]
    ci = min(order.index(x) for x in chs) if chs else None
    B = [A[b] for b in BASES[flow] if b in A]
    present = {}
    for b in B:
        for sid in b['flat']: present[sid] = present.get(sid, 0) + 1
    everywhere = {}
    for o in A.values():
        for sid in o['flat']: everywhere[sid] = everywhere.get(sid, 0) + 1
    new = [s for s in order if s not in present]
    missing = [s for s, n in present.items() if n == len(B) and s not in order]
    last = order[-1] if order else None
    effects, noise = [], []
    for i, sid in enumerate(order):
        if sid not in present: continue
        f = A[run]['flat'][sid]
        keys = set(f)
        for b in B:
            if sid in b['flat']: keys |= set(b['flat'][sid])
        for k in sorted(keys):
            v = f.get(k)
            basevals = [b['flat'][sid].get(k) for b in B if sid in b['flat']]
            if v in basevals: continue
            unrelated, related = seen_elsewhere(run, sid, k, v)
            rec = {'step': sid, 'key': k, 'exp': v, 'baseline': basevals[0] if basevals else None, 'alsoIn': unrelated[:6], 'alsoInRelated': related[:6],
                   'where': 'before-change' if ci is not None and i < ci else ('changed-step' if sid in A[run]['changedSet'] else 'after-change')}
            (noise if (unrelated or rec['where'] == 'before-change' or sid == 'ar') else effects).append(rec)
    b = bag(r['steps'])
    basebags = [bag(x['r']['steps']) for x in A.values() if bag(x['r']['steps'])]
    log = ''
    try: log = open(os.path.join(base, run, 'walk.log')).read()
    except Exception: pass
    end = 'account wall (yd)' if last == 'yd' else ('stop screen utt' if last == 'utt' else f'ended at {last}')
    if 'could not' in log or 'NO NEW STEP' in log or 'FATAL' in log: end += ' [walk error: see walk.log]'
    out = {'run': run, 'flow': flow, 'changed': ch.get('desc'), 'changedStep': cs, 'baselinesPooled': [x for x in BASES[flow] if x in A], 'stepOrder': order, 'nSteps': len(order), 'end': end,
           'newSteps': new, 'missingSteps': missing, 'candidateEffects': effects, 'noise': [{'step': n['step'], 'key': n['key'], 'where': n['where'], 'alsoIn': n['alsoIn'][:3]} for n in noise],
           'bag': b, 'bagItemsSameAsBaseline': (b['items'] in [x['items'] for x in (bag(y['r']['steps']) for y in B) if x]) if b else None,
           'posted': {x: r['posted'].get(x) for x in sorted(A[run]['changedSet']) if x in r['posted']}, 'nextAfterChange': {x: r['posts'].get(x) for x in sorted(A[run]['changedSet']) if x in r['posts']}, 'sweep': bool(ch.get('sweep'))}
    json.dump(out, open(os.path.join(base, run, 'summary.json'), 'w'), indent=1, ensure_ascii=False)
    return out

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    for run in args:
        o = analyse(run)
        if '--json' in sys.argv: print(json.dumps(o, ensure_ascii=False)); continue
        if o.get('error'): print(run, o['error']); continue
        print(f"\n=== {run} [{o['flow']}] {o['changed']}")
        print(f"  end: {o['end']} after {o['nSteps']} steps | posted on changed step: {str(o['posted'])[:300]} -> next {o['nextAfterChange']}")
        print(f"  NEW steps: {o['newSteps'] or 'none'} | MISSING steps: {o['missingSteps'] or 'none'}")
        for c in o['candidateEffects']:
            print(f"  EFFECT? [{c['step']}] ({c['where']}) {c['key']}\n      baseline: {str(c['baseline'])[:500]}\n      exp:      {str(c['exp'])[:500]}\n      same value also in (related runs): {c['alsoInRelated']}")
        print(f"  noise ignored: {sorted(set(n['step'] + ':' + n['key'].split('.')[0] for n in o['noise']))}")
        print(f"  bag: {o['bag']} | items same as baseline: {o['bagItemsSameAsBaseline']}")
