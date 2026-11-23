#!/usr/bin/env python3
# Build quiz-definition files from parsed RSC rows.
# Usage: python3 -I flow_dump.py <rowsdir> <name> <outdir>
#   writes <outdir>/quiz-definition-<name>.json  (flow: nodes, edges, variables, scripts, component list without code)
#          <outdir>/quiz-outline-<name>.txt      (readable outline)
#          <outdir>/components-<name>/           (source code of each react component the flow uses)
import sys, json, os, re
rowsdir, name, outdir = sys.argv[1], sys.argv[2], sys.argv[3]
rows = json.load(open(os.path.join(rowsdir, 'rows.json')))
ref = re.compile(r'^\$([0-9a-f]+)$')
def resolve(v, depth=0):
    if isinstance(v, str):
        m = ref.match(v)
        if m and m.group(1) in rows and rows[m.group(1)]['kind'] == 'text':
            return rows[m.group(1)]['value']
        return v
    if isinstance(v, list): return [resolve(x, depth+1) for x in v]
    if isinstance(v, dict): return {k: resolve(x, depth+1) for k, x in v.items()}
    return v
props = None
for rid, r in rows.items():
    v = r['value']
    if r['kind'] == 'json' and isinstance(v, list) and len(v) == 4 and isinstance(v[3], dict) and 'flow' in v[3]:
        props = v[3]; break
flow = resolve(props['flow'])
comps = flow.get('reactComponents') or []
cdir = os.path.join(outdir, 'components-' + name); os.makedirs(cdir, exist_ok=True)
cindex = {}
for c in comps:
    cindex[c['_id']] = c.get('name')
    safe = re.sub(r'[^A-Za-z0-9_.-]+', '_', c.get('name') or c['_id'])
    src = c.get('sourceCode')
    if isinstance(src, str):
        open(os.path.join(cdir, safe + '__' + c['_id'] + '.tsx'), 'w').write(src)
slim = dict(flow)
slim['reactComponents'] = [{k: v for k, v in c.items() if k not in ('sourceCode', 'compiledCode', 'chatMessages', 'checkpoints', 'agentSessionId', 'agentSessionTouchedAt', 'agentId')} for c in comps]
extra = {k: resolve(v) for k, v in props.items() if k != 'flow'}
json.dump({'source': 'https://start.struthealth.com/flow/' + flow['_id'], 'flow': slim, 'pageProps': extra}, open(os.path.join(outdir, 'quiz-definition-%s.json' % name), 'w'), indent=1)

# outline
nodes = {n['id']: n for n in flow['nodes']}
edges = {e['id']: e for e in flow['edges']}
out = []
P = out.append
P('FLOW %s  "%s"  id=%s version=%s status=%s' % (name, flow.get('title'), flow['_id'], flow.get('versionId'), flow.get('status')))
P('nodes %d, edges %d' % (len(nodes), len(edges)))
P('variables: ' + json.dumps(flow.get('variables')))
P('')
def short(v, n=400):
    s = v if isinstance(v, str) else json.dumps(v, ensure_ascii=False)
    s = re.sub(r'\s+', ' ', s)
    return s if len(s) <= n else s[:n] + ' …[%d chars]' % len(s)
order = []
seen = set()
starts = [n['id'] for n in flow['nodes'] if n['id'].startswith('node-start')] or [flow['nodes'][0]['id']]
stack = list(reversed(starts))
bysrc = {}
for e in flow['edges']: bysrc.setdefault(e['source'], []).append(e)
while stack:
    x = stack.pop()
    if x in seen or x not in nodes: continue
    seen.add(x); order.append(x)
    # follow the node's default path first so the main line reads in order
    n0 = nodes[x]; pe = []
    for p0 in n0.get('paths') or []:
        e0 = edges.get(p0.get('edgeId') or p0.get('id'))
        if e0: pe.append((0 if p0.get('isDefault') else 1, e0['target']))
    for e0 in bysrc.get(x, []): pe.append((2, e0['target']))
    for _, t in sorted(pe, key=lambda z: -z[0]) if False else reversed(sorted(pe, key=lambda z: z[0])):
        if t not in seen: stack.append(t)
for n in flow['nodes']:
    if n['id'] not in seen: order.append(n['id'])
P('ORDER (walk from start, default path first): ' + ' > '.join(order)); P('')
for nid in order:
    n = nodes[nid]
    P('=' * 100)
    P('  edges out: ' + '; '.join('%s -> %s %s' % (e['id'], e['target'], json.dumps((e.get('data') or {}).get('label'))) for e in bysrc.get(nid, [])))
    meta = {k: v for k, v in n.items() if k not in ('config', 'paths', 'id', 'type')}
    P('%s  type=%s  %s' % (n['id'], n.get('type'), short(meta, 300)))
    cfg = n.get('config') or {}
    cmeta = {k: v for k, v in cfg.items() if k != 'blocks'}
    if cmeta: P('  config: ' + short(cmeta, 600))
    for b in cfg.get('blocks') or []:
        bt = b.get('blockType') or ('component:' + str(cindex.get(b.get('componentId'), b.get('componentId'))))
        pv = b.get('propValues') or {}
        other = {k: v for k, v in b.items() if k not in ('id', 'blockType', 'componentId', 'propValues')}
        P('  - block %s [%s] %s' % (b.get('id'), bt, short(other, 300) if other else ''))
        for k, v in pv.items():
            if k == 'options' and isinstance(v, list):
                P('      options:')
                for o in v: P('        * ' + short(o, 500))
            else:
                P('      %s: %s' % (k, short(v, 1500)))
    for p in n.get('paths') or []:
        e = edges.get(p.get('edgeId') or p.get('id'))
        tgt = e['target'] if e else '?'
        conds = []
        for g in p.get('conditionGroups') or []:
            conds.append('(' + ' AND '.join('%s %s %s' % (c.get('questionId'), c.get('operator'), json.dumps(c.get('value'))) for c in g.get('conditions') or []) + ')' + ((' [groupOp=%s]' % g.get('operator')) if g.get('operator') else ''))
        extra = {k: v for k, v in p.items() if k not in ('edgeId', 'label', 'isDefault', 'conditionGroups', 'id')}
        P('  PATH "%s"%s -> %s   when %s %s' % (p.get('label'), ' (default)' if p.get('isDefault') else '', tgt, ' OR '.join(conds) or '-', short(extra, 200) if extra else ''))
P('')
P('EDGES')
for e in flow['edges']:
    P('  %s: %s -> %s  %s' % (e['id'], e['source'], e['target'], short(e.get('data') or {}, 200)))
P('')
P('SCRIPTS')
P(json.dumps(flow.get('scripts'), indent=1)[:6000])
P('')
P('COMPONENTS')
for c in comps: P('  %s  %s  props=%s' % (c['_id'], c.get('name'), short(list((c.get('propSchema') or {}).keys()), 300)))
P('')
P('PAGE PROPS (not flow)')
P(short(extra, 3000))
open(os.path.join(outdir, 'quiz-outline-%s.txt' % name), 'w').write('\n'.join(out))
print(name, 'nodes', len(nodes), 'edges', len(edges), 'components', len(comps))
