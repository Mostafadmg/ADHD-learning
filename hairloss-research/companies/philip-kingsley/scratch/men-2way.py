import json,sys,copy
sys.path.insert(0,'scratch')
from engine import offered
st=json.load(open('quiz-definition-men.json'))
s=json.load(open('runs/r05-baseline-men/storage.json')); base=json.loads(s['local']['quizData'])['men_quiz']
q1s=['Early signs','Temples','Patchy','Temples and Crown','Temples and Crown with reduced density','Extensive']
q2s=['I have less hair than before, but it is not very noticeable','My hair has thinned/receded noticeably in some areas, but other areas are still dense','My scalp is becoming slightly visible and my hair feels less dense','My scalp is very visible and my hair feels much less dense','My hair has thinned extensively, or been lost entirely, throughout the top region']
out={}
for a1 in q1s:
  for a2 in q2s:
    row=[]
    for age in ['30 to 39','50 to 64']:
      a=copy.deepcopy(base); a['q1']['value']=a1; a['q2a']['value']=a2; a['q6']['value']=age
      g=[x[0]+('*' if x[1]=='Other' else '') for x in offered(st,'men_quiz',a)]
      row.append(','.join(g) or 'NONE')
    print('%-40s | %-28.28s | <50: %-45s | 50+: %s' % (a1,a2,row[0],row[1]))
