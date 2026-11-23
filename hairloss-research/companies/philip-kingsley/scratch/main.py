import json, sys, copy
sys.path.insert(0,'scratch')
import build as b
from build_products import P
from qparse import questions
HL='https://hairloss.philipkingsley.co.uk/'; WWW='https://www.philipkingsley.co.uk/'
ld=lambda p: json.loads(json.load(open(p))['local']['quizData'])
men_base=ld('runs/r05-baseline-men/storage.json')['men_quiz']
women_base=ld('runs/r07-baseline-women/storage.json')['women_quiz']
men_consent=["Welcome, let's get started... We're going to ask you some questions regarding your hair loss and medical history, to determine your suitability for this service, and prescribe a suitable treatment plan.","By clicking 'Get Started', you are confirming the below:","I am male, over 18 years old and live in the UK","I was assigned male at birth","I confirm all answers are provided by me, and will be truthful","I will disclose any prescription medication I currently take","I understand that I should not follow this treatment plan alongside treatments from another provider","I am aware that Philip Kingsley's Finasteride and Minoxidil are unlicensed products"]
women_consent=["Welcome, let's get started","How it works","Start by answering a few questions on your current hair & scalp condition.","We'll then recommend your best treatment options which can be a treatment plan to address your concerns, or a Clinic or Virtual Consultation to get a better understanding of your condition and personalise your treatment plan."]
scalp_consent=["Welcome, let's get started... We're going to ask you some questions regarding your scalp and medical history, to determine your suitability for this service, and prescribe a suitable treatment plan.","By clicking 'Get Started', you are confirming the below:","I am age 18 or older","I live in the UK","I confirm all answers and information is provided by me and is accurate","I will disclose any prescription medication I currently take","I understand that I should not follow this treatment plan alongside treatments from another provider"]
men_wall=["Almost done!","Your details: First Name, Last Name, Date of Birth (dd/MM/y), Email, Create password, Confirm Password","Statement to agree before proceeding: Please tick to acknowledge that it is best practice to inform your GP of any private treatment that you receive. All treatment and messaging is completely confidential. (required)","I understand the questions asked and have answered them honestly and truthfully. I understand the side effects of the treatment options, their effectiveness and alternative options and I am happy to continue with my request. I confirm and agree that any treatment prescribed for me is for my personal use only. I agree to the website terms and conditions and privacy policy. (required)","I would like to receive the Philip Kingsley newsletter... (optional)","Your details are secure and protected"]
women_wall=["Almost done!","Your details: First Name, Last Name, Date of Birth, Email, Create password, Confirm Password","Statements to agree before proceeding: Please tick to acknowledge that it is best practice to inform your GP of any private treatment that you receive. All treatment and communication is completely confidential. (required)","I understand the questions asked and have answered them honestly and truthfully. I confirm I will read any material shared with me regarding side effects and effectiveness of treatment options I am provided with by my Trichologist. I confirm and agree that any treatment prescribed for me is for my personal use only. I agree to the website terms and conditions and privacy policy. (required)","Newsletter opt-in (optional)","Your details are secure and protected"]
b.FALLBACK[0]='p-w-routine'
mq,mB=b.build_flow('men','men_quiz','quiz-definition-men.json',men_base,12,b.META_M,'men',men_consent,men_wall,'men',True)
wq,wB=b.build_flow('women','women_quiz','quiz-definition-women.json',women_base,12,b.META_W,'women',women_consent,women_wall,'women',True)
# scalp synthetic baseline from labels
st=json.load(open('quiz-definition-scalp.json'))
labs={}
for stp in questions(st,['scalp_quiz_step%d'%i for i in range(1,11)]):
    for q in stp['questions']: labs[q['code']]=q['label']
sv={'q1':'No','q3':'Mild to Moderate Dandruff','q4':'Healthy','q5':'No','q6':'None of the above','q7':'Medium, can be wavy','q8':'Medium (shoulder length)','q9':'Healthy','q10a':"No, I don't have any allergies"}
scalp_base={k:{'label':labs[k],'value':v} for k,v in sv.items()}
b.FALLBACK[0]='p-scalp-range'
sq,sB=b.build_flow('scalp','scalp_quiz','quiz-definition-scalp.json',scalp_base,10,b.META_S,'scalp',scalp_consent,men_wall[:1]+['Your details form (same fields as the hair-loss quizzes, read from code only)'],'both',False)
for q in sq:
    if q['id']=='scalp-q2': q['shownWhen']='only when Q1 = "Yes" (conditional transition: Q1 = "No" skips to Q3)'
    if q['id']=='scalp-select':
        pass
    for o in q['options']:
        if o['evidence']=='code' and q['id'] not in ('scalp-select',): o['effect']=o['effect'].replace('(code; one change from the baseline)','(code; one change from a synthetic scalp baseline: no diagnosis, mild-moderate dandruff, healthy scalp, medium hair)')
json.dump({'men':mq,'women':wq,'scalp':sq,'B':{'men':mB,'women':wB,'scalp':sB}},open('scratch/flows.json','w'),indent=1,ensure_ascii=False)
print(len(mq),len(wq),len(sq),mB,wB,sB)
