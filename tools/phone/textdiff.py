#!/usr/bin/env python3
"""usage: python3 textdiff.py before.json after.json
Reports content that was in 'before' but is missing from 'after' (whole module, order ignored):
 - every number token (with its unit) whose count dropped
 - every sentence of 25+ characters not found as a substring (whitespace-normalised, case-insensitive)
Intentional re-wording or sentence splits show up as missing sentences: check each and list the genuine, intended ones in your report."""
import json,re,sys,collections
b=json.load(open(sys.argv[1])); a=json.load(open(sys.argv[2]))
norm=lambda t: re.sub(r'\s+',' ',t.replace('’',"'").replace('‑','-').replace(' ',' ')).strip().lower()
B=' '.join(b.values()); A=' '.join(a.values()); nB=norm(B); nA=norm(A)
num=re.compile(r'\d+(?:[.,]\d+)?(?:\s?(?:mg|mcg|kg|ml|mmhg|bpm|h|hours?|minutes?|min|days?|weeks?|months?|years?|%|cm|mm))?')
cb=collections.Counter(m.group(0).replace(' ','') for m in num.finditer(nB)); ca=collections.Counter(m.group(0).replace(' ','') for m in num.finditer(nA))
lost={k:(v,ca.get(k,0)) for k,v in cb.items() if ca.get(k,0)<v}
print('NUMBER TOKENS that appear fewer times after (before,after):',len(lost))
for k,(x,y) in sorted(lost.items(),key=lambda kv:-kv[1][0])[:60]: print('  ',k,x,'->',y)
sents=[s.strip() for s in re.split(r'(?<=[.!?;:])\s+',B) if len(s.strip())>=25]
miss=[s for s in sents if norm(s) not in nA]
print('\nSENTENCES (25+ chars) not found verbatim after:',len(miss),'of',len(sents))
for s in miss[:80]: print('  -',s[:220])
print('\nCharacters before/after:',len(nB),len(nA))
