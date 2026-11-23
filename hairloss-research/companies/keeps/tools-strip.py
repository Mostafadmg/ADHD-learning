# usage: python3 -I tools-strip.py <file> [term] [before] [after]
# Prints a served JS chunk with base64 blobs removed; with a term, prints the text around each hit.
import re,sys
s=open(sys.argv[1],encoding='utf8').read()
s=re.sub(r'data:image/[a-z+]+;base64,[A-Za-z0-9+/=]+','B64',s)
if len(sys.argv)>2:
    term=sys.argv[2]; b=int(sys.argv[3]) if len(sys.argv)>3 else 500; a=int(sys.argv[4]) if len(sys.argv)>4 else 2000
    last=-1
    for m in re.finditer(re.escape(term),s):
        if m.start()<last: continue
        print('@@',m.start()); print(s[max(0,m.start()-b):m.start()+a]); print()
        last=m.start()+a
else:
    print(s)
