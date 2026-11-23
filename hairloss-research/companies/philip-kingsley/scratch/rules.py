import json,sys
d=json.load(open(sys.argv[1])); q=sys.argv[2]
def fmt(c, ind=0):
    p='  '*ind
    if c.get('type')=='GenericCondition' or 'question' in c and 'conditions' not in c:
        return p+'[%s] %r %s %r' % (c.get('type'), c.get('question'), c.get('operator'), c.get('values'))
    s=p+'%s(%s){\n' % (c.get('type','?'), c.get('operator'))
    s+='\n'.join(fmt(x, ind+1) for x in c.get('conditions',[]))
    return s+'\n'+p+'}'
for r in d['rules'][q]:
    print('==== SKU', r['sku'], 'group', r.get('group'), 'keys', list(r.keys()))
    for k in ('conditions','blockers'):
        if r.get(k): print(' --',k); print(fmt(r[k],1))
print('==== NO RESULTS RULES')
for r in d["no_results_rules"].get(q, []) if isinstance(d["no_results_rules"], dict) else d["no_results_rules"]:
    print(' ', json.dumps({k:(v if k!='template' else (str(len(v))+' chars')) for k,v in r.items()}, ensure_ascii=False))
