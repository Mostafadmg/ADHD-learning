#!/usr/bin/env python3
"""Stage 3 (VERIFY): apply the independent reviewer's corrections and additions to company.json, in place.

Safe to run more than once (every change checks whether it is already there).
If scripts/stage2_update.py is ever re-run, run this again afterwards.

Usage (from companies/hims-uk):  python3 -I scripts/stage3_verify.py
The hand-written stage 3 text lives in scripts/stage3_text.py.
"""
import json, os, sys
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(here)
sys.path.insert(0, here)
import stage3_text as T

path = os.path.join(root, 'company.json')
d = json.load(open(path, encoding='utf-8'))
prod = {p['id']: p for p in d['products']}
rule = {r['id']: r for r in d['rules']}
flow = {f['id']: f for f in d['flows']}
ques = {q['id']: q for f in d['flows'] for q in f['questions']}

def add_once(text, extra):
    """Append extra to text unless it is already there."""
    return text if extra in text else (text.rstrip() + ' ' + extra)

# ---- 1. proof pointers on every question that is labelled observed ---------------------------------
for qid, proof in T.QUESTION_PROOF.items():
    if qid in ques: ques[qid]['proof'] = proof

# ---- 2. rule corrections --------------------------------------------------------------------------
for rid, ch in T.RULE_CHANGES.items():
    r = rule[rid]
    for k in ('evidence', 'confidence', 'effectType', 'when'):
        if k in ch: r[k] = ch[k]
    if 'then' in ch: r['then'] = ch['then']
    if 'then_add' in ch: r['then'] = add_once(r['then'], ch['then_add'])
    if 'proof' in ch: r['proof'] = ch['proof']
    if 'proof_add' in ch: r['proof'] = add_once(r['proof'], ch['proof_add'])
    if 'affects' in ch: r['affects'] = ch['affects']
    r['verified'] = ch['verified']

# rules the reviewer did not touch still get an honest status
for r in d['rules']:
    r.setdefault('verified', T.DEFAULT_VERIFIED.get(r['evidence'], 'not re-tested'))

# ---- 3. new rules ---------------------------------------------------------------------------------
for nr in T.NEW_RULES:
    if nr['id'] in rule:
        rule[nr['id']].update(nr)
    else:
        # keep the flow's rules together: put a new rule after the last rule of the same flow
        idx = max([i for i, r in enumerate(d['rules']) if r['flow'] == nr['flow']] or [len(d['rules']) - 1])
        d['rules'].insert(idx + 1, nr); rule[nr['id']] = nr

# ---- 4. product corrections -----------------------------------------------------------------------
for pid, ch in T.PRODUCT_CHANGES.items():
    p = prod[pid]
    for k, v in ch.items():
        if k == 'priceDetail_add': p['priceDetail'] = add_once(p.get('priceDetail', ''), v)
        elif k == 'recommendedWhen_add': p['recommendedWhen'] = add_once(p['recommendedWhen'], v)
        elif k == 'active_strength':
            for a in p['actives']:
                if a['name'] in v: a['strength'] = v[a['name']]
        else: p[k] = v

# ---- 5. new questions / options -------------------------------------------------------------------
for fid, qs in T.NEW_QUESTIONS.items():
    f = flow[fid]
    for q in qs:
        if q['id'] in ques:
            ques[q['id']].update(q)
        else:
            f['questions'].append(q); ques[q['id']] = q
    f['questions'].sort(key=lambda q: q['order'])
for qid, ch in T.QUESTION_CHANGES.items():
    q = ques[qid]
    for k, v in ch.items():
        if k.endswith('_add'): q[k[:-4]] = add_once(q.get(k[:-4], ''), v)
        else: q[k] = v
for fid, ch in T.FLOW_CHANGES.items():
    for k, v in ch.items():
        if k.endswith('_add'): flow[fid][k[:-4]] = add_once(flow[fid].get(k[:-4], ''), v)
        else: flow[fid][k] = v

# ---- 6. experiments -------------------------------------------------------------------------------
have = {x['id'] for x in d['experiments']}
for x in T.NEW_EXPERIMENTS:
    if x['id'] in have:
        for y in d['experiments']:
            if y['id'] == x['id']: y.update(x)
    else:
        d['experiments'].append(x)

# ---- 7. recommendations, lists and summaries ------------------------------------------------------
for i, note in T.RECOMMENDATION_NOTE_ADD.items():
    d['recommendations'][i]['note'] = add_once(d['recommendations'][i]['note'], note)
for key, repl in T.LIST_REPLACE.items():
    for old_start, new in repl:
        for i, s in enumerate(d[key]):
            if s.startswith(old_start) or s == new:
                d[key][i] = new; break
        else:
            raise SystemExit('stage3: could not find %s item starting %r' % (key, old_start))
for key, items in T.LIST_ADD.items():
    for s in items:
        if s not in d[key]: d[key].append(s)
have_src = {s['title'] for s in d['sources']}
for s in T.NEW_SOURCES:
    if s['title'] not in have_src: d['sources'].append(s)
for s in d['sources']:
    if s['url'] in getattr(T, 'SOURCE_RETITLE', {}): s['title'] = T.SOURCE_RETITLE[s['url']]
have_cr = {c['codeRule'] for c in d.get('codeRulesConfirmedLive', [])}
for c in getattr(T, 'CODE_CONFIRMED_ADD', []):
    if c['codeRule'] not in have_cr: d.setdefault('codeRulesConfirmedLive', []).append(c)
d['engineSummary'] = add_once(d['engineSummary'], T.ENGINE_SUMMARY_ADD)
d['access']['coverageNote'] = add_once(d['access']['coverageNote'], T.COVERAGE_ADD)
for b in T.BLOCKERS_ADD:
    if b not in d['access']['blockers']: d['access']['blockers'].append(b)
d['stage'] = 'final (stage 3 of 3: independently verified on 23 November 2026)'
missing = [q['id'] for f in d['flows'] for q in f['questions'] if q['evidence'] == 'observed' and not q.get('proof')]
if missing: print('stage3: WARNING observed questions without proof:', missing)
d['verification'] = T.VERIFICATION

json.dump(d, open(path, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
nq = sum(len(f['questions']) for f in d['flows']); no = sum(len(q['options']) for f in d['flows'] for q in f['questions'])
print('stage3: wrote company.json: %d products, %d flows, %d questions, %d options, %d rules, %d experiments, %d recommendation profiles' % (
    len(d['products']), len(d['flows']), nq, no, len(d['rules']), len(d['experiments']), len(d['recommendations'])))
