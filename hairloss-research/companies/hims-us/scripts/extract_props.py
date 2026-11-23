#!/usr/bin/env python3
"""extract_props.py <page.html> <out.json> — pull the window.PROPS object the site embeds in its own HTML."""
import sys, json
h = open(sys.argv[1], encoding='utf8').read()
i = h.find('window.PROPS=')
if i < 0: sys.exit('no window.PROPS in page')
i += len('window.PROPS=')
dec = json.JSONDecoder()
obj, end = dec.raw_decode(h, i)
json.dump(obj, open(sys.argv[2], 'w'), indent=1)
def size(v): return len(json.dumps(v))
for k, v in sorted(obj.items(), key=lambda kv: -size(kv[1])):
    s = size(v)
    if s > 200: print(f'{s:>9}  {k}  ' + (','.join(list(v.keys())[:14]) if isinstance(v, dict) else type(v).__name__))
