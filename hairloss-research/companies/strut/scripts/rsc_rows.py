#!/usr/bin/env python3
# Parse a joined Next.js RSC payload into rows. Text rows ("id:T<hexlen>,<bytes>") are length-prefixed (UTF-8 bytes).
# Usage: python3 -I rsc_rows.py payload.txt outdir   -> writes outdir/rows.json {id: {"kind": "json"|"text"|"other", "value": ...}}
import sys, re, json, os
data = open(sys.argv[1], encoding='utf8').read().encode('utf8')
out = {}
i = 0; n = len(data)
hdr = re.compile(rb'([0-9a-f]*):')
while i < n:
    m = hdr.match(data, i)
    if not m:
        j = data.find(b'\n', i); 
        if j < 0: break
        i = j + 1; continue
    rid = m.group(1).decode()
    p = m.end()
    if data[p:p+1] == b'T':
        c = data.find(b',', p)
        ln = int(data[p+1:c], 16)
        out[rid] = {'kind': 'text', 'value': data[c+1:c+1+ln].decode('utf8', errors='replace')}
        i = c + 1 + ln
    else:
        j = data.find(b'\n', p)
        if j < 0: j = n
        raw = data[p:j].decode('utf8', errors='replace')
        try:
            out[rid] = {'kind': 'json', 'value': json.loads(raw)}
        except Exception:
            out[rid] = {'kind': 'other', 'value': raw}
        i = j + 1
os.makedirs(sys.argv[2], exist_ok=True)
json.dump(out, open(os.path.join(sys.argv[2], 'rows.json'), 'w'))
kinds = {}
for k, v in out.items(): kinds[v['kind']] = kinds.get(v['kind'], 0) + 1
print('rows', len(out), kinds)
