import json
CO='/home/user/ADHD-learning/hairloss-research/companies/philip-kingsley'
c=json.load(open(CO+'/company.json')); live=json.load(open(CO+'/scratch/live-skus.json'))
for x in c['experiments']: x['result']=x['result'].strip()
Q={q['id']:q for f in c['flows'] for q in f['questions']}
def L(run):
    s=live[run]; return ('no SKU passes, so the consultation screen follows the wall' if not s else 'passing SKUs '+', '.join(s))
# options tested live: (qid, label, run)
T=[('men-q1','Patchy','m01-q1-patchy'),('men-q1','Extensive','m02-q1-extensive'),('men-q1','Early signs','m03-q1-early'),('men-q1','Temples','m04-q1-temples'),
('men-q1','Temples and Crown with reduced density','m05-q1-tc-reduced'),('men-q1','Temples and Crown','b-men'),
('men-q2a','My scalp is very visible and my hair feels much less dense','m06-q2a-very-visible'),('men-q2a','I have less hair than before, but it is not very noticeable','m07-q2a-not-noticeable'),
('men-q3',"I haven't noticed any yet",'m08-q3-not-yet'),('men-q3','In the last month','m09-q3-last-month'),('men-q4','It started to fall out quite suddenly','m10-q4-sudden'),
('men-q5','No','m11-q5-no'),('men-q6','50 to 64','m12-q6-50-64'),('men-q6','Over 65','m13-q6-over65'),
('men-q7a','Itching','m15-q7a-itching-mild'),('men-q7f','Mild','m15-q7a-itching-mild'),('men-q7f','Severe','m16-q7a-itching-severe'),
('men-q7a','Dandruff','m17-q7a-dandruff-mild'),('men-q7b','Mild','m17-q7a-dandruff-mild'),('men-q7a','Eczema','m18-q7a-eczema-moderate'),('men-q7d','Moderate','m18-q7a-eczema-moderate'),
('men-q7a','Redness','m19-q7a-redness-mild'),('men-q7c','Mild','m19-q7a-redness-mild'),('men-q7a','Psoriasis','m20-q7a-psoriasis'),('men-q7a','Other','m21-q7a-other'),
('men-q8','Burning','m23-q8-burning'),('men-q8','Pain','exp-01'),
('men-q9','I have previously been diagnosed with breast cancer, prostate cancer, or I am currently undergoing PSA (prostate) monitoring','m24-q9-cancer-psa'),
('men-q9','I have uncontrolled low or high blood pressure','m25-q9-bp'),('men-q9','I am experiencing, or have previously experienced, depression, anxiety or panic disorders','m26-q9-depression-accept'),
('men-q9e',"I'm happy to be recommended Finasteride",'m26-q9-depression-accept'),('men-q9e','I would not like to be recommended Finasteride','m27-q9-depression-decline'),
('men-q9','I am currently trying for a baby','m28-q9-baby'),('men-q10a','Yes','m29-q10a-yes'),('men-q11a','Minoxidil','m30-q11a-minoxidil'),('men-q11a','Finasteride','m31-q11a-finasteride'),
('men-q12a','Yes','m32-q12a-yes'),
('women-q1','Yes','w01-q1-pregnant'),('women-q2','Yes','w02-q2-chemo'),('women-q3a','Overall thinning','w03-q3a-overall'),('women-q3a','More shedding than usual (in the shower/on my brush)','w04-q3a-shedding'),
('women-q3a','Circular bald patches','w06-q3a-patches'),('women-q3a','Seeing more of my scalp or wider parting','b-women'),('women-q4',"It's happened very suddenly",'w09-q4-sudden'),('women-q5a','Itching','w11-q5a-itching-mild'),
('women-q5f','Mild','w11-q5a-itching-mild'),('women-q5a','Psoriasis','w14-q5a-psoriasis'),('women-q10a','Yes','w17-q10a-menopause-hrt'),('women-q10b','Yes','w17-q10a-menopause-hrt'),
('women-q11a','Minoxidil','w18-q11a-minoxidil'),('women-q12a','I am taking oral minoxidil','w19-q12a-oral-minoxidil'),('scalp-q1','Yes','s01-q1-diagnosed-sebderm'),('scalp-q2','Seborrhoeic Dermatitis','s01-q1-diagnosed-sebderm')]
n=0
for qid,lab,run in T:
    q=Q[qid]; o=[o for o in q['options'] if o['label']==lab]
    if not o: print('MISSING',qid,lab); continue
    o=o[0]
    if 'Live check' in o['effect']: continue
    if run=='exp-01': o['effect']+=' Live check (runs/exp-01-men-q8-pain): same account wall, no warning.'
    else: o['effect']+=' Live check (runs/%s): the site\'s own rule check, run in the live page at the wall, gave %s; no warning before the wall.'%(run,L(run))
    n+=1
# show-ifs seen live
SW={'men-q7f':'m15-q7a-itching-mild','men-q7b':'m17-q7a-dandruff-mild','men-q7c':'m19-q7a-redness-mild','men-q7d':'m18-q7a-eczema-moderate','men-q7e':'m21-q7a-other',
'men-q9e':'m26-q9-depression-accept','men-q10b':'m29-q10a-yes','men-q10c':'m29-q10a-yes','men-q12b':'m32-q12a-yes','women-q3b':'w03-q3a-overall','women-q3e':'w04-q3a-shedding',
'women-q3f':'w06-q3a-patches','women-q3c':'b-women','women-q5f':'w11-q5a-itching-mild','women-q10b':'w17-q10a-menopause-hrt','scalp-q2':'s01-q1-diagnosed-sebderm'}
for qid,run in SW.items():
    q=Q[qid]; q['evidence']='observed'
    if 'seen live' not in q['shownWhen']: q['shownWhen']+=' (seen live on the same screen as its parent question, runs/%s; absent in the baseline run)'%run
for qid in ['men-q7a','men-q9','men-q10a','men-q12a','women-q3a','women-q5a','women-q10a','scalp-q1']:
    q=Q[qid]; q['branches']=True
BD={
'men-q7a':'Ticking Itching, Dandruff, Redness or Eczema opens a severity question on the same screen; Other opens a text box (all seen live). Products: mild/moderate itching, dandruff or eczema swap the hair-loss plans for scalp plans; severe itching or dandruff, or severe eczema, ends at the consultation screen; psoriasis, redness, acne or other leave only the unnamed SKUs PHI1220/PHI1221 (code, confirmed in the live page runs m15-m21).',
'men-q9':'The depression/anxiety option opens the finasteride mood warning (men-q9e) on the same screen (seen live). Cancer/PSA, depression and trying for a baby block every SKU, so the consultation screen follows the wall; the blood-pressure option removes only PHI1221 because of a typo in the main blocker (code, confirmed live m24-m28).',
'men-q10a':'Yes opens two text boxes (medicine names and doses; what they are for), seen live. No product rule reads them (live check m29: same SKUs).',
'men-q12a':'Yes opens a text box for the allergy (seen live). No product rule reads it (live check m32: same SKUs).',
'women-q3a':'Each picture except band-like recession and something else opens a "how noticeable" follow-up on the same screen (seen live for overall thinning, shedding, patches, parting). The picture decides the product (main product PHI1749, Hair Shedding Drops for shedding, consultation for patches, band-like recession or something else); the follow-up answer is not used by any rule (code, confirmed live w03, w04, w06).',
'women-q5a':'Itching, dandruff, redness or eczema open a severity question on the same screen (seen live for itching). Mild itching keeps the main product and switches the haircare add-on (live w11); psoriasis, redness, acne, other and moderate or severe symptoms end at the consultation screen (code, live w14).',
'women-q10a':'Yes opens "Are you on HRT?" (seen live). Neither answer changes the offer (live check w17).',
'scalp-q1':'No skips Q2 through a conditional transition (baseline run); Yes shows "What was your diagnosis?" (seen live, s01). The diagnosis given did not change the offer for Seborrhoeic Dermatitis (live check s01).'}
for qid,t in BD.items(): Q[qid]['branchDetail']=t
for qid in ['men-q9e']:
    Q[qid]['branchDetail']='Shown only after the depression/anxiety option (seen live). Both answers end at the consultation screen because the Q9 answer already blocks every SKU (code, live m26 and m27); the opt-out choice has no separate effect.'
json.dump(c,open(CO+'/company.json','w'),indent=1,ensure_ascii=False)
print('options updated',n)
