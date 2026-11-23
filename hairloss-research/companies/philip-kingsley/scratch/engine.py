# Python port of PhilipKingsley_Quiz/js/quiz.min.js checkProductAvailability (see src/quiz.min.js)
import json
def values_by_label(data, label):
    for k,q in data.items():
        if isinstance(q,dict) and q.get('label')==label:
            return (q.get('value') or '').split('|')
    return None
def generic(data,c,default):
    vals=values_by_label(data,c['question'])
    if vals is None: return default
    if c['operator']=='and': return all(v in vals for v in c['values'])
    return any(v in vals for v in c['values'])
def composite(data,c,default):
    res=[ (generic(data,x,default) if x['type']=='GenericCondition' else composite(data,x,default)) for x in c['conditions'] if x.get('type') in ('GenericCondition','CompositeCondition')]
    if c['operator']=='and': return all(res)
    return any(res)
def cond(data,c,default):
    if c['type']=='GenericCondition': return generic(data,c,default)
    return composite(data,c,default)
def offered(state,quiz,data):
    out=[]
    for r in state['rules'][quiz]:
        b=cond(data,r['blockers'],False) if r.get('blockers') else False
        ok=cond(data,r['conditions'],True) if r.get('conditions') else True
        if not b and ok: out.append((r['sku'],r.get('group')))
    return out
