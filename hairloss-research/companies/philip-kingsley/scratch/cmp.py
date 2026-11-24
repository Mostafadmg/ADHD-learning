import json,sys,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from engine import offered
CO=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE={'men_quiz':'b-men','women_quiz':'b-women','scalp_quiz':'b-scalp'}
for run in sys.argv[1:]:
    p=os.path.join(CO,'runs',run,'eval.json')
    if not os.path.exists(p): print(run,'NO EVAL'); continue
    e=json.load(open(p)); qid=e['quizId']; f=qid.split('_')[0]
    st=json.load(open(os.path.join(CO,'runs',run,'storage.json')))
    data=json.loads(st['local']['quizData'])[qid]
    state=json.load(open(os.path.join(CO,'quiz-definition-%s.json'%f)))
    pred=[s for s,g in offered(state,qid,data)]
    b=json.load(open(os.path.join(CO,'runs',BASE[qid],'eval.json')))['skus']
    live=e['skus']
    print(run,'| live:',live,'| removed:',[x for x in b if x not in live],'added:',[x for x in live if x not in b],'| port matches:',pred==live, '' if pred==live else pred, '| noRes:',(e['noResultsTemplate'] or '')[:20].strip() and 'CONSULTATION-SCREEN')
