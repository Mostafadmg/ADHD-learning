#!/usr/bin/env python3
"""compare.py <runA> <runB> — what changed between two autowalk runs (for one-change experiments).

Reads runs/<run>/api.jsonl (every call the page made). Prints:
  - steps only in A / only in B (after removing steps that come and go at random between visits)
  - for steps in both: differences in the served definition (options, badges, text), ignoring known random variants
  - the shopping bag (items, prices, promo text) in each run
  - the last step reached

Known random noise (seen with identical answers, see notes.md): steps js, hs, yna appear in some visits only;
steps pds, st, rhf, rha, el, ct, yna, hdw, di change wording / control type / option order between visits.
"""
import json, sys, os, re
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'runs')
RANDOM_PRESENCE = {'js', 'hs', 'yna'}
RANDOM_WORDING = {'pds', 'st', 'rhf', 'rha', 'el', 'ct', 'yna', 'hdw', 'di', 'ar', 'pdsc'}

def load(run):
    steps, order, posts = {}, [], {}
    for line in open(os.path.join(base, run, 'api.jsonl')):
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
            except Exception: pass
    return steps, order, posts

def flat(step):
    out = {'title': step.get('title'), 'description': step.get('description')}
    for q in step.get('questions', []):
        ic = q.get('inputConfig') or {}
        k = f"q{q['id']}"
        out[k + '.type'] = q['inputType']; out[k + '.label'] = q.get('label'); out[k + '.text'] = q.get('text')
        if isinstance(ic.get('options'), list):
            out[k + '.options'] = [(o.get('label'), tuple(o.get('badges') or []), o.get('description')) for o in ic['options']]
        else:
            out[k + '.config'] = re.sub(r'"consultationExternalId": "[^"]+"', '', json.dumps(ic, sort_keys=True, ensure_ascii=False))
    return out

a, b = sys.argv[1], sys.argv[2]
sa, oa, pa = load(a); sb, ob, pb = load(b)
print(f'A = {a}: {len(oa)} steps, last = {oa[-1] if oa else None}\nB = {b}: {len(ob)} steps, last = {ob[-1] if ob else None}')
onlyA = [s for s in oa if s not in sb]; onlyB = [s for s in ob if s not in sa]
print('\nSteps only in A:', [s + (' (random step, ignore)' if s in RANDOM_PRESENCE else '') for s in onlyA] or 'none')
print('Steps only in B:', [s + (' (random step, ignore)' if s in RANDOM_PRESENCE else '') for s in onlyB] or 'none')
print('\nDefinition differences in shared steps:')
n = 0
for s in oa:
    if s not in sb: continue
    fa, fb = flat(sa[s]), flat(sb[s])
    for k in sorted(set(fa) | set(fb)):
        if fa.get(k) != fb.get(k):
            if s in RANDOM_WORDING and s != 'ct': tag = ' (step varies at random between visits: check before trusting)'
            else: tag = ''
            if s == 'ar': tag = ' (echo of the answers given)'
            print(f'  [{s}] {k}{tag}\n      A: {str(fa.get(k))[:500]}\n      B: {str(fb.get(k))[:500]}'); n += 1
if not n: print('  none')
for name, st in ((a, sa), (b, sb)):
    ct = st.get('ct')
    if ct:
        ic = ct['questions'][0]['inputConfig']; promo = [q for q in ct['questions'] if q['inputType'] == 'promo_code']
        items = [(i.get('code'), i['treatment'].get('name'), i['treatment'].get('description'), i['treatment'].get('pill'), i['subtotal'].get('amount'), i['subtotal'].get('originalAmount')) for i in ic.get('items', [])]
        print(f'\nBag in {name}: {items}  promo: {promo[0]["inputConfig"].get("promotionCode") if promo else None}')
    else:
        print(f'\nBag in {name}: not reached')
