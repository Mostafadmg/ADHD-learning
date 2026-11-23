import json,sys
from collections import defaultdict, OrderedDict
d=json.load(open(sys.argv[1])); q=sys.argv[2]
SHORT={}
def leaves(c):
    if 'conditions' in c and c.get('type')!='GenericCondition':
        for x in c['conditions']: yield from leaves(x)
    else: yield c
def count_and(c):
    return sum(1 for x in c.get('conditions',[]) )
for r in d['rules'][q]:
    out=[r['sku'], r.get('group')]
    for k in ('conditions','blockers'):
        if not r.get(k): continue
        u=OrderedDict()
        for l in leaves(r[k]):
            u.setdefault(l['question'][:60], set()).update(l['values'])
        print('%s %s %s:' % (r['sku'], r.get('group'), k.upper()))
        for qq,vals in u.items(): print('     %-62s %s' % (qq, sorted(vals)))
