import json,sys,copy
sys.path.insert(0,'scratch')
from engine import offered
from qparse import questions
st=json.load(open('quiz-definition-men.json'))
s=json.load(open('runs/r05-baseline-men/storage.json')); base=json.loads(s['local']['quizData'])['men_quiz']
B=set(x[0] for x in offered(st,'men_quiz',base))
print('BASELINE', sorted(offered(st,'men_quiz',base)))
steps=['men_quiz_step%d'%i for i in range(1,13)]
res={}
for stp in questions(st,steps):
    for q in stp['questions']:
        if q.get('textarea'): continue
        for o in q['options']:
            a=copy.deepcopy(base)
            lab=q['label']
            # use the option's own label (labels can differ per option, e.g. redness)
            a[q['code']]={'label':lab,'value':o['value']}
            if q['if'] and q['if'].get('field'):  # sub-question: also set parent
                par=q['if']['field']; a[par]={'label':base[par]['label'],'value':q['if']['value'] if isinstance(q['if']['value'],str) else q['if']['value'][0]}
            if q['code']=='q9e':
                a['q9']={'label':base['q9']['label'],'value':'I am experiencing, or have previously experienced, depression, anxiety or panic disorders'}
            got=offered(st,'men_quiz',a); G=set(x[0] for x in got)
            key='%s=%s'%(q['code'],o['value'])
            res[key]=sorted(got)
            diff='' if G==B else ('  -%s +%s' % (sorted(B-G), sorted(G-B)))
            print('%-6s %-60.60s -> %s%s' % (q['code'], o['value'], ','.join(x[0]+('*' if x[1]=='Other' else '') for x in sorted(got)) or 'NONE (consultation)', diff))
json.dump(res,open('extracted/men-one-change-code.json','w'),indent=1)
