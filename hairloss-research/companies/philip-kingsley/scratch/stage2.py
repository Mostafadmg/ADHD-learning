import json,os
CO='/home/user/ADHD-learning/hairloss-research/companies/philip-kingsley'
c=json.load(open(CO+'/company.json'))
SKU={'PHI1301':'p-min5','PHI1302':'p-topcombo','PHI1303':'p-fin','PHI1304':'p-3combo','PHI1305':'p-5combo','PHI1308':'p-hs-topcombo',
'PHI1310':'p-3hs','PHI1311':'p-5hs','PHI1300':'p-min3','PHI1223':'p-combination-plan','PKC145':'p-shedding','PHI1749':'p-sku1749',
'PHI1220':'p-sku1220','PHI1221':'p-sku1221','PHI1306':'p-scalp-addons-men','PHI1307':'p-scalp-addons-men','PHI1309':'p-scalp-addons-men'}
def pid(s):
    if s in SKU: return SKU[s]
    if s.startswith('PHI16') or s.startswith('PHI18'): return 'p-w-routine' if not s.startswith('PHI161') and not s.startswith('PHI162') and not s.startswith('PHI163') and not s.startswith('PHI164') else 'p-scalp-range'
    return None
NAME={p['id']:p['name'].split(' (')[0].split(' [')[0] for p in c['products']}
def ev(run): return json.load(open(CO+'/runs/%s/eval.json'%run))
# run id -> (flow, question id, option label(s), follow-up note, extra note)
E=[
('b-men','men',None,None,'Baseline man replayed (protocol baseline).',''),
('b-women','women',None,None,'Baseline woman replayed (protocol baseline).',''),
('b-scalp','scalp',None,None,'Synthetic scalp baseline replayed.',''),
('m01-q1-patchy','men','men-q1','Patchy','',''),
('m02-q1-extensive','men','men-q1','Extensive','',''),
('m03-q1-early','men','men-q1','Early signs','',''),
('m04-q1-temples','men','men-q1','Temples','',''),
('m05-q1-tc-reduced','men','men-q1','Temples and Crown with reduced density','',''),
('m06-q2a-very-visible','men','men-q2a','My scalp is very visible and my hair feels much less dense','',''),
('m07-q2a-not-noticeable','men','men-q2a','I have less hair than before, but it is not very noticeable','',''),
('m08-q3-not-yet','men','men-q3',"I haven't noticed any yet",'',''),
('m09-q3-last-month','men','men-q3','In the last month','',''),
('m10-q4-sudden','men','men-q4','It started to fall out quite suddenly','',''),
('m11-q5-no','men','men-q5','No','',''),
('m12-q6-50-64','men','men-q6','50 to 64','',''),
('m13-q6-over65','men','men-q6','Over 65','',''),
('m15-q7a-itching-mild','men','men-q7a','Itching','"How severe is the itching?" appeared on the same screen (answered Mild).',''),
('m16-q7a-itching-severe','men','men-q7a','Itching','"How severe is the itching?" appeared (answered Severe).',''),
('m17-q7a-dandruff-mild','men','men-q7a','Dandruff','"How severe is your dandruff?" appeared (answered Mild).',''),
('m18-q7a-eczema-moderate','men','men-q7a','Eczema','"How severe is the eczema?" appeared (answered Moderate).',''),
('m19-q7a-redness-mild','men','men-q7a','Redness','"How severe is the redness?" appeared (answered Mild).',''),
('m20-q7a-psoriasis','men','men-q7a','Psoriasis','',''),
('m21-q7a-other','men','men-q7a','Other','A text box "Please tell us about the condition" appeared (filled with a neutral "Mild flaking").',''),
('m23-q8-burning','men','men-q8','Burning','',''),
('m24-q9-cancer-psa','men','men-q9','I have previously been diagnosed with breast cancer, prostate cancer, or I am currently undergoing PSA (prostate) monitoring','',''),
('m25-q9-bp','men','men-q9','I have uncontrolled low or high blood pressure','',''),
('m26-q9-depression-accept','men','men-q9','I am experiencing, or have previously experienced, depression, anxiety or panic disorders','The finasteride mood warning (men-q9e) appeared on the same screen; answered "I\'m happy to be recommended Finasteride".',''),
('m27-q9-depression-decline','men','men-q9','I am experiencing, or have previously experienced, depression, anxiety or panic disorders','The finasteride mood warning (men-q9e) appeared; answered "I would not like to be recommended Finasteride".',''),
('m28-q9-baby','men','men-q9','I am currently trying for a baby','',''),
('m29-q10a-yes','men','men-q10a','Yes','Two text boxes appeared (medicine names and doses; what they are for), filled neutrally ("Vitamin D 1000 units daily", "General health").',''),
('m30-q11a-minoxidil','men','men-q11a','Minoxidil','',''),
('m31-q11a-finasteride','men','men-q11a','Finasteride','',''),
('m32-q12a-yes','men','men-q12a','Yes','A text box "Please describe your allergy" appeared (filled neutrally: hay fever).',''),
('m33-q1-temples-q6-50-64','men',None,None,'Two changes on purpose (men-q1 = Temples AND men-q6 = 50 to 64) to test the code-read age rule, which only applies to Early signs / Temples.',''),
('w01-q1-pregnant','women','women-q1','Yes','',''),
('w02-q2-chemo','women','women-q2','Yes','',''),
('w03-q3a-overall','women','women-q3a','Overall thinning','"How noticable would you say your Overall Thinning is?" appeared (answered "People close to me can notice it").',''),
('w04-q3a-shedding','women','women-q3a','More shedding than usual (in the shower/on my brush)','"How noticable has your shedding become?" appeared (answered "People close to me can notice it").',''),
('w06-q3a-patches','women','women-q3a','Circular bald patches','"How noticable are your circular bald patches?" appeared (answered "People close to me can notice it").',''),
('w09-q4-sudden','women','women-q4',"It's happened very suddenly",'',''),
('w10-q3a-overall-q4-sudden','women',None,None,'Two changes on purpose (women-q3a = Overall thinning AND women-q4 = sudden) to contrast with w09.',''),
('w11-q5a-itching-mild','women','women-q5a','Itching','"How severe is the itching?" appeared (answered Mild).',''),
('w14-q5a-psoriasis','women','women-q5a','Psoriasis','',''),
('w17-q10a-menopause-hrt','women','women-q10a','Yes','"Are you on HRT?" appeared (answered Yes).',''),
('w18-q11a-minoxidil','women','women-q11a','Minoxidil','',''),
('w19-q12a-oral-minoxidil','women','women-q12a','I am taking oral minoxidil','',''),
('s01-q1-diagnosed-sebderm','scalp','scalp-q1','Yes','"What was your diagnosis?" (scalp-q2) appeared, which the baseline (Q1 = No) skips; answered Seborrhoeic Dermatitis.',''),
]
BASE={'men':'b-men','women':'b-women','scalp':'b-scalp'}
def fmt(skus):
    return ', '.join('%s (%s)'%(s,NAME.get(pid(s),'?')) for s in skus) if skus else 'none'
exps=[x for x in c['experiments'] if x['id']=='exp-01']
live={}
for run,flow,qid,lab,note,_ in E:
    e=ev(run); b=ev(BASE[flow])['skus']; s=e['skus']; live[run]=s
    rem=[x for x in b if x not in s]; add=[x for x in s if x not in b]
    if run.startswith('b-'):
        changed='none (baseline replay)'
        res='%s Reached the account wall ("Almost done! Your details") as in stage 1. The site\'s own rule check, run in the live page at the wall, passes: %s.'%(note,fmt(s))
    else:
        changed=('%s: baseline -> "%s"'%(qid,lab)) if qid else note.split(' to test')[0].split(' to contrast')[0]
        flowtxt=(note+' ') if qid else ''
        res=flowtxt+'Same later questions otherwise; no warning or stop screen; same account wall as baseline. '
        if not s: res+='Site\'s own rule check in the live page: NO SKU passes, so after the wall the quiz would show the no-results template "CHOOSE YOUR CONSULTATION TYPE" (virtual from £200 or clinic from £345).'
        elif not rem and not add: res+='Site\'s own rule check in the live page: same SKUs as baseline (%s). No effect on the offer.'%fmt(s)
        else: res+='Site\'s own rule check in the live page: %s.%s%s'%(fmt(s), (' Removed vs baseline: '+fmt(rem)+'.') if rem else '', (' Added: '+fmt(add)+'.') if add else '')
        if not qid: res=note+' '+res
    exps.append({'id':run,'flow':flow,'changed':changed,'result':res,'run':'runs/'+run})
c['experiments']=exps
json.dump(c,open(CO+'/company.json','w'),indent=1,ensure_ascii=False)
json.dump(live,open(CO+'/scratch/live-skus.json','w'),indent=1)
print(len(exps)); print(exps[5]); print(exps[-1])
