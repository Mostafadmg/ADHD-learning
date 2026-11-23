#!/usr/bin/env python3
# Compact outline: one block per node in walk order: question label, type, options, paths.
# Usage: python3 -I flow_compact.py quiz-definition-<name>.json
import sys, json, re
d = json.load(open(sys.argv[1])); f = d['flow']
nodes = {n['id']: n for n in f['nodes']}; edges = {e['id']: e for e in f['edges']}
cn = {c['_id']: c['name'] for c in f['reactComponents']}
bysrc = {}
for e in f['edges']: bysrc.setdefault(e['source'], []).append(e)
order = []; seen = set()
stack = [n for n in nodes if n.startswith('node-start')]
while stack:
    x = stack.pop()
    if x in seen or x not in nodes: continue
    seen.add(x); order.append(x)
    pe = []
    for p in nodes[x].get('paths') or []:
        e = edges.get(p.get('edgeId') or p.get('id'))
        if e: pe.append((0 if p.get('isDefault') else 1, e['target']))
    for e in bysrc.get(x, []): pe.append((2, e['target']))
    for _, t in reversed(sorted(pe, key=lambda z: z[0])):
        if t not in seen: stack.append(t)
order += [n for n in nodes if n not in seen]
SKIP = {'Custom Strut Header', 'Cart', 'None of the above advance'}
print('FLOW', f['title'], f['_id'], 'nodes', len(nodes))
for i, nid in enumerate(order):
    n = nodes[nid]; cfg = n.get('config') or {}
    print('\n[%02d] %s (%s)%s' % (i, nid, n.get('type'), ' NOT REACHED FROM START' if nid not in seen else ''))
    if n.get('type', '').startswith('ending'): print('   ENDING', json.dumps(cfg)[:300])
    for b in cfg.get('blocks') or []:
        bt = b.get('blockType'); pv = b.get('propValues') or {}
        if not bt:
            name = cn.get(b.get('componentId'), b.get('componentId'))
            if name in SKIP: continue
            keep = {k: v for k, v in pv.items() if not re.search(r'Color|Radius|Opacity|imageFit|Height|Width|Padding|gap|logo|show|bar|fallback|remaining', k)}
            print('   COMPONENT "%s" %s' % (name, json.dumps(keep, ensure_ascii=False)[:1200]))
            continue
        if bt in ('navigation-buttons',): continue
        if bt in ('label', 'label-ds'):
            print('   LABEL: %s%s' % (pv.get('label'), (' || SUB: ' + pv['sublabel']) if pv.get('sublabel') else '')); continue
        extra = {k: v for k, v in pv.items() if k not in ('label', 'sublabel', 'options', 'alwaysShowNextButton', 'layout', 'showCheckbox', 'columns', 'labelPlacement')}
        print('   INPUT %s id=%s alias=%s :: %s %s' % (bt, b.get('id'), b.get('outputAlias'), pv.get('label'), json.dumps(extra, ensure_ascii=False)[:1500]))
        if pv.get('sublabel'): print('        sub: ' + pv['sublabel'])
        for o in pv.get('options') or []:
            print('        (%s) %s%s' % (o.get('id', o.get('value')), o.get('label'), (' [' + o['selectBehavior'] + ']') if o.get('selectBehavior') else ''))
    for p in n.get('paths') or []:
        e = edges.get(p.get('edgeId') or p.get('id'))
        conds = ' OR '.join('(' + ' AND '.join('%s %s %s' % (c.get('questionId'), c.get('operator'), json.dumps(c.get('value'))) for c in g.get('conditions') or []) + ')' for g in p.get('conditionGroups') or [])
        print('   PATH %-28s -> %s %s' % ('"%s"%s' % (p.get('label'), '*' if p.get('isDefault') else ''), e['target'] if e else '?', ('when ' + conds) if conds else ''))
    if not n.get('paths'):
        for e in bysrc.get(nid, []): print('   NEXT -> %s' % e['target'])
