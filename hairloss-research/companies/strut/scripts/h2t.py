#!/usr/bin/env python3
# html -> visible text (+ links). Usage: python3 -I h2t.py file.html [--links]
import sys, re, html
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.out=[]; s.skip=0; s.links=[]; s.cur=None
    def handle_starttag(s,t,a):
        if t in('script','style','noscript','svg'): s.skip+=1
        if t in('p','div','li','h1','h2','h3','h4','h5','br','section','tr','button','a','summary','details','td','th','label'): s.out.append('\n')
        if t=='a':
            d=dict(a); s.cur=d.get('href')
            if s.cur: s.out.append('['); 
    def handle_endtag(s,t):
        if t in('script','style','noscript','svg'): s.skip=max(0,s.skip-1)
        if t=='a' and s.cur: s.out.append('](%s)'%s.cur); s.cur=None
        if t in('p','div','li','h1','h2','h3','h4','h5','section','tr','button','summary','td','th'): s.out.append('\n')
    def handle_data(s,d):
        if not s.skip: s.out.append(d)
src=open(sys.argv[1],encoding='utf8',errors='replace').read()
p=P(); p.feed(src)
t=''.join(p.out)
if '--links' not in sys.argv: t=re.sub(r'\[\s*\]\([^)]*\)','',t)
t=re.sub(r'[ \t\r\f\v]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t)
print(t.strip())
