import json, re
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.items=[]; s.skip=0; s.cur_if=None; s.texts=[]
    def handle_starttag(s,t,a):
        a=dict(a)
        if t in ('script','style'): s.skip+=1; return
        cls=(a.get('class') or '').split()
        if 'data-if' in a:
            try: s.cur_if=json.loads(a['data-if'])
            except Exception: s.cur_if={'raw':a['data-if']}
            s.items.append(('if', s.cur_if))
        if 'pk-quiz-control' in cls and a.get('data-quiz-question'):
            s.items.append(('opt', {'code':a.get('data-quiz-question'),'label':a.get('data-quiz-label'),'value':a.get('data-quiz-selection'),
                                    'multiple':'multiple' in cls,'unique':bool(a.get('data-quiz-unique')),'if':s.cur_if}))
        elif t=='textarea':
            s.items.append(('textarea', {'code':a.get('name'),'if':s.cur_if}))
    def handle_endtag(s,t):
        if t in ('script','style'): s.skip-=1
    def handle_data(s,d):
        if s.skip: return
        x=' '.join(d.split())
        if x: s.items.append(('text',x))
def parse_step(html):
    p=P(); p.feed(html); return p.items
def questions(state, steps):
    """Return ordered list of question dicts per step."""
    out=[]
    for st in steps:
        items=parse_step(state['templates'][st])
        qs={}; order=[]; texts=[]; pending_text=None
        for kind,v in items:
            if kind=='text':
                texts.append(v); pending_text=v
            elif kind=='opt':
                c=v['code']
                if c not in qs:
                    qs[c]={'step':st,'code':c,'label':v['label'],'labels':set(),'options':[],'multiple':v['multiple'],'if':v['if'],'shown_text':pending_text}
                    order.append(c)
                q=qs[c]; q['labels'].add(v['label'])
                if v['value'] not in [o['value'] for o in q['options']]:
                    q['options'].append({'value':v['value'],'unique':v['unique'],'multiple':v['multiple']})
            elif kind=='textarea':
                c=v['code']; qs[c]={'step':st,'code':c,'label':pending_text,'labels':set(),'options':[],'multiple':False,'if':v['if'],'textarea':True,'shown_text':pending_text}
                order.append(c)
        out.append({'step':st,'texts':texts,'questions':[qs[c] for c in order]})
    return out
