#!/usr/bin/env python3
"""rsc.py <page.html> <out.txt> — join the Next.js streamed payload (self.__next_f.push) of a page into one text file."""
import sys, re, json
h = open(sys.argv[1], encoding='utf8').read()
out = []
for m in re.finditer(r'self\.__next_f\.push\((\[.*?\])\)</script>', h, flags=re.S):
    try:
        a = json.loads(m.group(1))
        if len(a) > 1 and isinstance(a[1], str): out.append(a[1])
    except Exception as e:
        pass
s = ''.join(out)
open(sys.argv[2], 'w', encoding='utf8').write(s)
print(len(s), 'chars of payload')
