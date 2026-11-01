#!/usr/bin/env python3
"""usage: wdiff.py before.json after.json  -> words (lowercase, punctuation ignored) that occur FEWER times after than before"""
import json,re,sys,collections
b=json.load(open(sys.argv[1])); a=json.load(open(sys.argv[2]))
tok=lambda d: collections.Counter(re.findall(r"[a-z0-9]+(?:[.\-\u2011/][a-z0-9]+)*", ' '.join(d.values()).lower().replace("\u2019","'")))
cb,ca=tok(b),tok(a)
lost={w:(n,ca.get(w,0)) for w,n in cb.items() if ca.get(w,0)<n}
print('words before/after:',sum(cb.values()),sum(ca.values()),'| distinct words with fewer occurrences after:',len(lost))
for w,(x,y) in sorted(lost.items(),key=lambda kv:-(kv[1][0]-kv[1][1]))[:40]: print('  ',w,x,'->',y)
