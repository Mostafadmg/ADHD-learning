import json,sys
d=json.load(open(sys.argv[1]))
print({k:v for k,v in d.items() if k!='questions'})
def show(q,ind=''):
    print(f"{ind}[{q['type']}] {q['text']} | sub={q.get('subText')!r} code={q.get('code')}")
    for o in q.get('options') or []:
        extra=[]
        if o['frontendAction']!='Proceed': extra.append(o['frontendAction'])
        for k in ['advisoryTitle','advisoryText','advisoryTickText','blockerTitle','blockerText']:
            if o.get(k): extra.append(f"{k}={o[k]!r}")
        if o.get('uncheckRestOptions'): extra.append('exclusive')
        if o.get('score') is not None: extra.append(f"score={o['score']}")
        print(f"{ind}   - {o['text']} {extra}")
        if o.get('followupQuestion'): show(o['followupQuestion'],ind+'      ')
for q in d['questions']: show(q)
