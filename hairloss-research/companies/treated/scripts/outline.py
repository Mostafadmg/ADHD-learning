#!/usr/bin/env python3
"""outline.py <quiz-definition.json> : print every question, option, action, advisory/blocker text and follow-up as a tree.
Run with: python3 -I scripts/outline.py quiz-definition-male.json"""
import json, sys
d = json.load(open(sys.argv[1], encoding='utf-8'))
keys = set()
def show(q, depth=0, n=None):
    pad = '    ' * depth
    head = f"Q{n}" if n is not None else 'follow-up'
    print(f"{pad}{head} [{q.get('type')}] id={q.get('id')} category={q.get('category')} code={q.get('code')}")
    print(f"{pad}  text: {q.get('text')!r}")
    if q.get('subText'): print(f"{pad}  subText: {q.get('subText')!r}")
    if q.get('placeholderText'): print(f"{pad}  placeholder: {q.get('placeholderText')!r}")
    for k in q: keys.add('q.' + k)
    for o in q.get('options') or []:
        for k in o: keys.add('o.' + k)
        extra = []
        for k in ('advisoryTitle', 'advisoryText', 'advisoryTickText', 'blockerTitle', 'blockerText'):
            if o.get(k): extra.append(f"{k}={o[k]!r}")
        if o.get('uncheckRestOptions'): extra.append('uncheckRestOptions')
        if o.get('score') is not None: extra.append(f"score={o['score']}")
        print(f"{pad}  - {o.get('text')!r} value={o.get('value')!r} seq={o.get('sequance')} action={o.get('frontendAction')} id={o.get('id')}")
        for e in extra: print(f"{pad}      {e}")
        if o.get('followupQuestion'): show(o['followupQuestion'], depth + 2)
for k in d:
    if k != 'questions': print('TOP', k, '=', json.dumps(d[k], ensure_ascii=False)[:400])
for i, q in enumerate(d.get('questions') or [], 1): show(q, 0, i)
print('\nkeys seen:', sorted(keys))
