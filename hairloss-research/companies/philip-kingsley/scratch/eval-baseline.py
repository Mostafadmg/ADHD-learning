import json,sys
sys.path.insert(0,'scratch')
from engine import offered
st=json.load(open('quiz-definition-men.json'))
ans=json.load(open('extracted/baseline-men-answers.json'))['data']['men_quiz']
print(offered(st,'men_quiz',ans))
