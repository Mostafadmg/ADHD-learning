import sys,re
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.out=[]; s.skip=0; s.href=None
    def handle_starttag(s,t,a):
        if t in ('script','style','svg','noscript','head'): s.skip+=1
        if t in ('p','div','li','h1','h2','h3','h4','h5','br','section','tr','button','summary','details'): s.out.append('\n')
        if t=='a':
            h=dict(a).get('href'); 
            if h: s.out.append(' [')
            s.href=h
    def handle_endtag(s,t):
        if t in ('script','style','svg','noscript','head'): s.skip=max(0,s.skip-1)
        if t=='a' and s.href: s.out.append(' -> '+s.href+'] '); s.href=None
        if t in ('p','div','li','h1','h2','h3','h4','h5','section','tr','button','summary'): s.out.append('\n')
    def handle_data(s,d):
        if not s.skip: s.out.append(d)
h=open(sys.argv[1],encoding='utf-8').read()
i=h.find('// Constants')
if i>0: h=h[:i]
p=P(); p.feed(h)
t=''.join(p.out)
t=re.sub(r'[ \t\xa0]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t)
print(t.strip())
