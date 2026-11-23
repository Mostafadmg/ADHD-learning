#!/usr/bin/env python3
# Pull the structured product object (the one that holds "safety":[...]) out of a struthealth.com product page.
# Usage: python3 -I product_data.py raw/<page>.html  -> prints JSON
import sys, re, json
src = open(sys.argv[1], encoding='utf8', errors='replace').read()
parts = []
for m in re.finditer(r'self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)', src):
    try: parts.append(json.loads(m.group(1)))
    except Exception: pass
s = ''.join(parts)
i = s.find('"safety":[')
if i < 0: print('{}'); sys.exit()
# walk back to the opening brace of the enclosing object
depth = 0; j = i
while j > 0:
    j -= 1
    c = s[j]
    if c in '}]': depth += 1
    elif c in '{[':
        if depth == 0 and c == '{': break
        depth -= 1
dec = json.JSONDecoder()
try:
    obj, end = dec.raw_decode(s[j:])
except Exception as e:
    print(json.dumps({'error': str(e), 'near': s[j:j+300]})); sys.exit()
print(json.dumps(obj, indent=1, ensure_ascii=False))
