#!/usr/bin/env python3
# Turn a saved HTML page into readable text, keeping link targets. Usage: python3 -I html2text.py file.html
import sys, re, html
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.out=[]; s.skip=0; s.href=None
    def handle_starttag(s,t,a):
        a=dict(a)
        if t in('script','style','noscript','svg'): s.skip+=1
        if s.skip: return
        if t in('p','div','section','li','h1','h2','h3','h4','h5','h6','br','tr','details','summary','header','footer','nav','article','ul','ol','table','form','label','option'): s.out.append('\n')
        if t in('h1','h2','h3','h4'): s.out.append('#'*int(t[1])+' ')
        if t=='a' and a.get('href'): s.href=a['href']; s.out.append('[')
        if t=='img' and a.get('alt'): s.out.append('{img: '+a['alt']+'}')
        if t=='input': s.out.append('{input '+(a.get('type') or '')+' name='+(a.get('name') or '')+' value='+(a.get('value') or '')+' placeholder='+(a.get('placeholder') or '')+'}')
    def handle_endtag(s,t):
        if t in('script','style','noscript','svg'): s.skip=max(0,s.skip-1)
        if s.skip: return
        if t=='a' and s.href is not None: s.out.append(']('+s.href+')'); s.href=None
        if t in('p','div','li','h1','h2','h3','h4','h5','h6','tr','summary'): s.out.append('\n')
    def handle_data(s,d):
        if not s.skip: s.out.append(d)
p=P(); p.feed(open(sys.argv[1],encoding='utf8',errors='replace').read())
t=''.join(p.out)
t=re.sub(r'[ \t ]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t)
print(t.strip())
