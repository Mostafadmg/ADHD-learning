import sys, json, re
from html.parser import HTMLParser
d = json.load(open(sys.argv[1]))
only = sys.argv[2:] 
VOID={'img','br','input','hr','meta','link','source'}
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.out=[]; s.stack=[]; s.skip=0; s.ctrl=None
    def handle_starttag(s,t,a):
        a=dict(a)
        if t in ('script','style'): s.skip+=1; return
        cls=a.get('class','') or ''
        if 'data-if' in a:
            s.out.append(('IF', a['data-if'], cls))
        if 'pk-quiz-control' in cls and 'pk-quiz-control-group' not in cls:
            info={k:v for k,v in a.items() if k.startswith('data-quiz') or k in ('class','data-url','name','type','placeholder')}
            s.out.append(('CTRL', t, info))
        elif t in ('input','textarea','select'):
            s.out.append(('INPUT', t, {k:v for k,v in a.items() if k not in ('style',)}))
        elif t=='a' and a.get('href'):
            s.out.append(('A', a.get('href')))
        elif t=='button':
            s.out.append(('BTN', a.get('class','')))
        if t not in VOID: s.stack.append(t)
    def handle_endtag(s,t):
        if t in ('script','style'): s.skip-=1; return
    def handle_data(s,data):
        if s.skip: return
        x=' '.join(data.split())
        if x: s.out.append(('T', x))
for k,v in d['templates'].items():
    if only and k not in only: continue
    print('=================', k)
    p=P(); p.feed(v)
    for o in p.out:
        if o[0]=='T': print('  ', o[1])
        else: print('  #', o[0], json.dumps(o[1:], ensure_ascii=False))
