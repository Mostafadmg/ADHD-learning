#!/usr/bin/env python3
# Print the lines of page text files that have not been printed before (drops repeated testimonials/boilerplate).
# Usage: python3 -I distinct.py seen.txt file1.txt file2.txt ...   (seen.txt accumulates lines already shown)
import sys, os, re
seenf=sys.argv[1]; seen=set(open(seenf,encoding='utf8').read().split('\n')) if os.path.exists(seenf) else set()
for f in sys.argv[2:]:
    t=open(f,encoding='utf8').read()
    i=t.find('\n# '); t=t[i:] if i>0 else t
    print('=================',os.path.basename(f))
    for ln in t.split('\n'):
        k=ln.strip()
        if not k or k in seen: continue
        if re.match(r'^\{img: [^}]*\}$',k): continue
        seen.add(k); print(ln)
open(seenf,'w',encoding='utf8').write('\n'.join(sorted(seen)))
