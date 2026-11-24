import sys; sys.path.insert(0,'/home/user/ADHD-learning/hairloss-research/companies/philip-kingsley/scratch')
from mk import *
FILL=lambda q,v: {"do":"fill","selector":"#"+q,"value":v}
DEP="I am experiencing, or have previously experienced, depression, anxiety or panic disorders"
V={
 'm01-q1-patchy':[('q1','Patchy')],
 'm02-q1-extensive':[('q1','Extensive')],
 'm03-q1-early':[('q1','Early signs')],
 'm04-q1-temples':[('q1','Temples')],
 'm05-q1-tc-reduced':[('q1','Temples and Crown with reduced density')],
 'm06-q2a-very-visible':[('q2a','My scalp is very visible and my hair feels much less dense')],
 'm07-q2a-not-noticeable':[('q2a','I have less hair than before, but it is not very noticeable')],
 'm08-q3-not-yet':[('q3',"I haven't noticed any yet")],
 'm09-q3-last-month':[('q3','In the last month')],
 'm10-q4-sudden':[('q4','It started to fall out quite suddenly')],
 'm11-q5-no':[('q5','No')],
 'm12-q6-50-64':[('q6','50 to 64')],
 'm13-q6-over65':[('q6','Over 65')],
 'm20-q7a-psoriasis':[('q7a','Psoriasis')],
 'm23-q8-burning':[('q8','Burning')],
 'm24-q9-cancer-psa':[('q9','I have previously been diagnosed with breast cancer, prostate cancer, or I am currently undergoing PSA (prostate) monitoring')],
 'm25-q9-bp':[('q9','I have uncontrolled low or high blood pressure')],
 'm28-q9-baby':[('q9','I am currently trying for a baby')],
 'm30-q11a-minoxidil':[('q11a','Minoxidil')],
 'm31-q11a-finasteride':[('q11a','Finasteride')],
}
A={
 'm15-q7a-itching-mild':([('q7a','Itching')],{'q7a':[sel('q7f','Mild')]}),
 'm16-q7a-itching-severe':([('q7a','Itching')],{'q7a':[sel('q7f','Severe')]}),
 'm17-q7a-dandruff-mild':([('q7a','Dandruff')],{'q7a':[sel('q7b','Mild')]}),
 'm18-q7a-eczema-moderate':([('q7a','Eczema')],{'q7a':[sel('q7d','Moderate')]}),
 'm19-q7a-redness-mild':([('q7a','Redness')],{'q7a':[sel('q7c','Mild')]}),
 'm21-q7a-other':([('q7a','Other')],{'q7a':[FILL('q7e','Mild flaking')]}),
 'm26-q9-depression-accept':([('q9',DEP)],{'q9':[sel('q9e',"I'm happy to be recommended Finasteride")]}),
 'm27-q9-depression-decline':([('q9',DEP)],{'q9':[sel('q9e',"I would not like to be recommended Finasteride")]}),
 'm29-q10a-yes':([('q10a','Yes')],{'q10a':[FILL('q10b','Vitamin D 1000 units daily'),FILL('q10c','General health')]}),
 'm32-q12a-yes':([('q12a','Yes')],{'q12a':[FILL('q12b','Hay fever, mild sneezing in summer')]}),
}
for k,v in V.items(): write(k, variant('men',v))
for k,(c,a) in A.items(): write(k, variant('men',c,a))
d=variant('men',[('q1','Temples'),('q6','50 to 64')]); write('m33-q1-temples-q6-50-64',d)
