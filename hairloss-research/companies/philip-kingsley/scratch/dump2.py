import sys, json, re
from html.parser import HTMLParser
d = json.load(open(sys.argv[1]))
only = sys.argv[2:]
VOID={'img','br','input','hr','meta','link','source'}
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.out=[]; s.skip=0; s.lastlabel=None
    def handle_starttag(s,t,a):
        a=dict(a)
        if t in ('script','style'): s.skip+=1; return
        cls=a.get('class','') or ''
        if 'data-if' in a: s.out.append('   [IF %s]' % a['data-if'])
        if 'pk-quiz-control' in cls.split():
            q=a.get('data-quiz-question'); lab=a.get('data-quiz-label')
            flags=[f for f in ('multiple',) if f in cls.split()]
            if a.get('data-quiz-unique'): flags.append('unique')
            if lab!=s.lastlabel:
                s.out.append('   Q[%s] label="%s"' % (q,lab)); s.lastlabel=lab
            s.out.append('     - opt "%s" %s %s' % (a.get('data-quiz-selection'), ' '.join(flags), ('url='+a['data-url']) if a.get('data-url') else ''))
            s.skiptext=True
        elif t in ('input','textarea','select'):
            s.out.append('   INPUT %s %s' % (t, {k:v for k,v in a.items() if k not in ('style','class')}))
        elif t=='a' and a.get('href'):
            s.out.append('   LINK %s' % a.get('href'))
    def handle_endtag(s,t):
        if t in ('script','style'): s.skip-=1
    def handle_data(s,data):
        if s.skip: return
        x=' '.join(data.split())
        if x: s.out.append('   | '+x)
for k,v in d['templates'].items():
    if only and k not in only: continue
    print('=================', k)
    p=P(); p.feed(v)
    # drop text lines equal to the previous option
    prev=None
    for o in p.out:
        if o.startswith('   | ') and prev and prev.startswith('     - opt "') and prev.split('"')[1]==o[5:]: continue
        print(o); prev=o
