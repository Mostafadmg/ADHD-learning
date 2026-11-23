#!/usr/bin/env python3
# Pull the Next.js RSC payload strings (self.__next_f.push([1,"..."])) out of an HTML file and join them.
# Usage: python3 -I rsc_extract.py in.html out.txt
import sys, re, json
src = open(sys.argv[1], encoding='utf8', errors='replace').read()
parts = []
for m in re.finditer(r'self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)', src):
    try:
        parts.append(json.loads(m.group(1)))
    except Exception as e:
        parts.append('')
out = ''.join(parts)
open(sys.argv[2], 'w', encoding='utf8').write(out)
print('chunks', len(parts), 'chars', len(out))
