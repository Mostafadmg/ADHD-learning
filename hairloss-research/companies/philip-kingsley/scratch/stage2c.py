import json
CO='/home/user/ADHD-learning/hairloss-research/companies/philip-kingsley'
c=json.load(open(CO+'/company.json'))
R={r['id']:r for r in c['rules']}
LIVE=" Confirmed in live replays: at the account wall the site's own rule check (window.quiz.checkProductAvailability(), run read-only in the live page) gave the same SKUs as the code reading."
def up(rid, runs, then_add=None, then_new=None):
    r=R[rid]; r['proof']=r['proof'].rstrip('.')+'; live: '+', '.join('runs/'+x for x in runs)
    if then_new: r['then']=then_new
    if then_add: r['then']+=' '+then_add
    r['confidence']='high'
up('R1',['m08-q3-not-yet','m10-q4-sudden','m23-q8-burning','exp-01-men-q8-pain','m24-q9-cancer-psa','m26-q9-depression-accept','m27-q9-depression-decline','m28-q9-baby'],LIVE+' Each of these single changes left no SKU passing.')
up('R2',['m16-q7a-itching-severe'],LIVE)
up('R3',['m15-q7a-itching-mild','m17-q7a-dandruff-mild','m18-q7a-eczema-moderate'],then_new="Hair-loss plans are swapped for scalp plans. Live page checks: mild itching -> only PHI1306 + PHI1309 (unnamed scalp SKUs); mild dandruff -> PHI1306, PHI1307, PHI1308 (Healthy Scalp Topical Combination Plan), PHI1309, PHI1311 (5% Healthy Scalp Combination Plan); moderate eczema -> PHI1306 + PHI1309 next to the unnamed PHI1220/PHI1221. Minoxidil 5%, Oral Finasteride, the Topical and 5% Combination Plans are removed in all three.")
up('R4',['m19-q7a-redness-mild','m20-q7a-psoriasis','m21-q7a-other'],LIVE+' Acne was not replayed.')
up('R5',['m01-q1-patchy','m02-q1-extensive','m05-q1-tc-reduced'],LIVE)
up('R6',['m33-q1-temples-q6-50-64','m12-q6-50-64','m13-q6-over65'],LIVE+' m33 (Temples + 50 to 64) dropped PHI1303 and PHI1305; for the baseline picture (Temples and Crown) age 50 to 64 or over 65 changed nothing (m12, m13).')
up('R7',['m30-q11a-minoxidil'],LIVE+' Live result: only PHI1221 and PHI1303 (Oral Finasteride) remain.')
up('R8',['m31-q11a-finasteride'],LIVE+' Live result: only PHI1220 and PHI1301 (Minoxidil 5%) remain.')
up('R9',['m25-q9-bp'],LIVE+' Live result: PHI1220, PHI1301, PHI1302, PHI1303, PHI1305 still pass; only PHI1221 (whose second blocker list spells the answer without the space) drops out.')
up('R10',[],'In all 46 live replays of this stage PHI1304 never passed.')
R['R10']['proof']=R['R10']['proof'].replace('; live: ','; live: none of the 46 runs in experiments[] returned PHI1304')
up('R11',['w01-q1-pregnant','w02-q2-chemo','w06-q3a-patches','w14-q5a-psoriasis','w18-q11a-minoxidil','w19-q12a-oral-minoxidil'],LIVE)
up('R12',['w09-q4-sudden','w10-q3a-overall-q4-sudden'],LIVE+' w09 (wider parting + sudden) still passes PHI1749 + add-on; w10 (overall thinning + sudden) passes nothing.')
up('R13',['w04-q3a-shedding'],LIVE+' The haircare add-on also changes (PHI1670 -> PHI1668).')
up('R15',['w17-q10a-menopause-hrt'],LIVE+' Menopause = Yes and HRT = Yes gave the same SKUs as the baseline (PHI1749, PHI1670).')
R['R16']['proof']+='; every one of the 43 one-change runs in experiments[] (runs/m01 ... runs/s01) ended on a wall screen with exactly the same text as the baseline, including the 16 runs where no SKU passed'
new=[
{'id':'R17','flow':'men','when':'men-q7a includes Itching, Dandruff, Redness or Eczema (or Other)','then':'A severity question (Mild / Moderate / Severe) appears on the same screen for each ticked symptom; Other opens a free-text box instead. Nothing else in the quiz changes.','effectType':'extra-questions','affects':[],'evidence':'observed','proof':'runs/m15-q7a-itching-mild, runs/m17-q7a-dandruff-mild, runs/m18-q7a-eczema-moderate, runs/m19-q7a-redness-mild, runs/m21-q7a-other (follow-ups absent in runs/b-men)','confidence':'high'},
{'id':'R18','flow':'men','when':'men-q9 includes "I am experiencing, or have previously experienced, depression, anxiety or panic disorders"','then':'A finasteride mood warning (men-q9e: "occasional reports of depression and even suicidal thoughts") appears with accept / decline choices. Whatever is chosen, every SKU is blocked, so the consultation screen follows the wall; the warning never changes the outcome.','effectType':'soft-warning','affects':['p-consult-virtual','p-consult-clinic'],'evidence':'observed','proof':'runs/m26-q9-depression-accept, runs/m27-q9-depression-decline (warning seen; live rule check: no SKU passes)','confidence':'high'},
{'id':'R19','flow':'men','when':'men-q10a = Yes (medicines) or men-q12a = Yes (other allergies)','then':'Free-text boxes appear (medicine names and doses, and what they are for; allergy description). They are only recorded for the prescriber: no product changes.','effectType':'flag-for-clinician','affects':[],'evidence':'observed','proof':'runs/m29-q10a-yes, runs/m32-q12a-yes (same SKUs as baseline in the live rule check)','confidence':'high'},
{'id':'R20','flow':'women','when':'women-q3a = a hair-loss picture with a follow-up (overall thinning, shedding, wider parting, temples, circular patches)','then':'A "how noticeable" question appears on the same screen (only I / people close to me / everyone). No product rule reads this answer; the picture alone decides.','effectType':'extra-questions','affects':[],'evidence':'observed','proof':'runs/w03-q3a-overall, runs/w04-q3a-shedding, runs/w06-q3a-patches, runs/b-women; rules in quiz-definition-women.json','confidence':'high'},
{'id':'R21','flow':'women','when':'women-q10a = Yes (menopause)','then':'"Are you on HRT?" appears. Neither answer changes the offer.','effectType':'extra-questions','affects':[],'evidence':'observed','proof':'runs/w17-q10a-menopause-hrt (live rule check: PHI1749 + PHI1670, same as baseline)','confidence':'high'},
{'id':'R22','flow':'scalp','when':'scalp-q1 = No (not diagnosed)','then':'Q2 "What was your diagnosis?" is skipped (the only conditional jump in any of the three quizzes). With Q1 = Yes, Q2 is shown; answering Seborrhoeic Dermatitis did not change the products.','effectType':'skip-questions','affects':[],'evidence':'observed','proof':'runs/b-scalp vs runs/s01-q1-diagnosed-sebderm; conditional_transitions in quiz-definition-scalp.json','confidence':'high'},
{'id':'R23','flow':'men','when':'men-q1 = "Early signs" (with the baseline density answer "thinned/receded noticeably in some areas") and age under 50','then':'Everything the baseline gets, plus the unnamed SKU PHI1306 in the "Other" group.','effectType':'product-added','affects':['p-scalp-addons-men'],'evidence':'code','proof':'quiz-definition-men.json rule PHI1306; live: runs/m03-q1-early','confidence':'high'},
{'id':'R24','flow':'men','when':'Any single change of: family history (men-q5 = No), age (men-q6 = 50 to 64 or Over 65) for the baseline Temples and Crown picture, density (men-q2a = very visible, or not very noticeable), onset "In the last month", medicines = Yes, other allergies = Yes','then':'No change: the same six SKUs pass as for the baseline man. These answers are recorded but do not steer the offer.','effectType':'none','affects':[],'evidence':'code','proof':'live: runs/m11-q5-no, runs/m12-q6-50-64, runs/m13-q6-over65, runs/m06-q2a-very-visible, runs/m07-q2a-not-noticeable, runs/m09-q3-last-month, runs/m29-q10a-yes, runs/m32-q12a-yes','confidence':'high'},
{'id':'R25','flow':'women','when':'women-q5a = Itching with severity Mild','then':'The main product (PHI1749) stays; only the "Complete Your Routine" haircare add-on switches (PHI1670 -> PHI1688).','effectType':'product-switched','affects':['p-w-routine'],'evidence':'code','proof':'quiz-definition-women.json; live: runs/w11-q5a-itching-mild','confidence':'high'},
{'id':'R26','flow':'men','when':'Age: men-q6 offers only 18 to 29, 30 to 39, 40 to 49, 50 to 64, Over 65','then':'There is no under-18 answer, so the quiz cannot screen out minors; age is checked only through the date of birth on the account wall (not tested). The women\'s and scalp quizzes ask no age question at all.','effectType':'none','affects':[],'evidence':'code','proof':'quiz-definition-men.json step6; quiz-definition-women.json and quiz-definition-scalp.json have no age step; runs/b-men','confidence':'high'},
]
c['rules']=[r for r in c['rules'] if r['id'] not in {x['id'] for x in new}]+new
recs=[
{'profile':'Man with mild scalp itching (otherwise baseline)','offered':['p-scalp-addons-men'],'default':'p-scalp-addons-men','note':'Only the unnamed scalp SKUs PHI1306 and PHI1309; no minoxidil or finasteride plan (live rule check runs/m15).','evidence':'code'},
{'profile':'Man with mild dandruff (otherwise baseline)','offered':['p-scalp-addons-men','p-hs-topcombo','p-5hs'],'default':'','note':'PHI1306, PHI1307, PHI1308 Healthy Scalp Topical Combination Plan (£100), PHI1309, PHI1311 5% Healthy Scalp Combination Plan (£122) (runs/m17).','evidence':'code'},
{'profile':'Man with moderate eczema, psoriasis, redness or other scalp condition','offered':['p-sku1220','p-sku1221','p-scalp-addons-men'],'default':'','note':'Moderate eczema: PHI1220, PHI1221, PHI1306, PHI1309 (runs/m18). Psoriasis, mild redness or other: only PHI1220 and PHI1221 (runs/m19-m21). If those unnamed SKUs are not sold, these men reach the consultation screen.','evidence':'code'},
{'profile':'Man allergic to minoxidil','offered':['p-sku1221','p-fin'],'default':'','note':'Oral Finasteride (£40) and PHI1221 only (runs/m30).','evidence':'code'},
{'profile':'Man allergic to finasteride','offered':['p-sku1220','p-min5'],'default':'','note':'Minoxidil 5% (£40) and PHI1220 only (runs/m31).','evidence':'code'},
{'profile':'Man with uncontrolled low or high blood pressure','offered':['p-sku1220','p-min5','p-topcombo','p-fin','p-5combo'],'default':'p-5combo','note':'Minoxidil plans still offered because of the typo in the blood-pressure blocker; only PHI1221 drops (runs/m25).','evidence':'code'},
{'profile':'Man with early signs of loss (noticeable thinning in some areas), under 50','offered':['p-sku1220','p-sku1221','p-min5','p-topcombo','p-fin','p-5combo','p-scalp-addons-men'],'default':'','note':'Baseline set plus PHI1306 (runs/m03).','evidence':'code'},
{'profile':'Woman with wider parting whose loss happened very suddenly','offered':['p-sku1749','p-w-routine'],'default':'p-sku1749','note':'Same as the baseline woman: sudden onset is not escalated for this picture (runs/w09); the same change with overall thinning goes to consultation (runs/w10).','evidence':'code'},
{'profile':'Woman with mild scalp itching','offered':['p-sku1749','p-w-routine'],'default':'p-sku1749','note':'Main product kept; add-on switched to PHI1688 (runs/w11).','evidence':'code'},
{'profile':'Scalp quiz baseline (mild-moderate dandruff, not diagnosed)','offered':['p-scalp-range'],'default':'','note':'PHI1619 and PHI1635 (names not found); same after a Seborrhoeic Dermatitis diagnosis (runs/b-scalp, runs/s01).','evidence':'code'},
]
for r in c['recommendations']:
    if r['profile'].startswith('Man, 32'): r['note']=(r.get('note','')+' Live rule check at the wall gave exactly PHI1220, PHI1221, PHI1301, PHI1302, PHI1303, PHI1305 (runs/b-men).').strip()
    if r['profile'].startswith('Woman, 38'): r['note']=(r.get('note','')+' Live rule check at the wall: PHI1749 + add-on PHI1670 (runs/b-women).').strip()
have={r['profile'] for r in c['recommendations']}
c['recommendations']+= [r for r in recs if r['profile'] not in have]
json.dump(c,open(CO+'/company.json','w'),indent=1,ensure_ascii=False)
print(len(c['rules']),len(c['recommendations']))
