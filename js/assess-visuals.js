/* Lesson 2 teaching visuals. SVG keeps clinical labels sharp at every zoom level.
   These are explanatory summaries, not diagnostic tools. See each step's sources. */
(function(){
'use strict';
var V={}, navy='#16324f',teal='#0b6664',coral='#a8432e',amber='#936000';
function e(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function text(x,y,s,size,color,weight,anchor){return '<text x="'+x+'" y="'+y+'" font-size="'+(size||24)+'" fill="'+(color||navy)+'" font-weight="'+(weight||500)+'" text-anchor="'+(anchor||'start')+'">'+e(s)+'</text>';}
function lines(x,y,ss,size,color,weight){return ss.map(function(s,i){return text(x,y+i*(size+9),s,size,color,weight);}).join('');}
function rect(x,y,w,h,fill,stroke){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="18" fill="'+fill+'" stroke="'+(stroke||'#d8e4e9')+'" stroke-width="2"/>';}
function box(x,y,w,h,title,body,color){return '<g data-card="'+[x,y,w,h].join(',')+'">'+rect(x,y,w,h,'#fff',color||teal)+'<rect x="'+x+'" y="'+(y+18)+'" width="5" height="'+(h-36)+'" rx="2" fill="'+(color||teal)+'"/>'+text(x+20,y+34,title,25,color||teal,700)+lines(x+20,y+68,body||[],22,navy)+'</g>';}
function arrow(x1,y1,x2,y2,color){var a=Math.atan2(y2-y1,x2-x1),d=10;return '<path d="M'+x1+' '+y1+' L'+x2+' '+y2+' M'+(x2-d*Math.cos(a-.5))+' '+(y2-d*Math.sin(a-.5))+' L'+x2+' '+y2+' L'+(x2-d*Math.cos(a+.5))+' '+(y2-d*Math.sin(a+.5))+'" fill="none" stroke="'+(color||teal)+'" stroke-width="3" stroke-linejoin="round"/>';}
function footer(y,ss){return rect(24,y,752,ss.length*29+26,'#e3f2f1','none')+lines(44,y+33,ss,21,teal,600);}
function frame(title,sub,h,body,desc){return '<svg class="ag-svg ag-explainer" viewBox="0 0 800 '+h+'" role="img" aria-label="'+e(title)+'" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif"><title>'+e(title)+'</title><desc>'+e(desc||sub)+'</desc>'+rect(1,1,798,h-2,'#f3f8fa','none')+'<path d="M18 0 H782 Q800 0 800 18 V94 H0 V18 Q0 0 18 0" fill="'+navy+'"/>'+text(28,43,title,32,'#fff',750)+text(28,77,sub,21,'#d4e7ef')+body+'</svg>';}
function tiles(title,sub,items,cols,foot){var w=(752-(cols-1)*16)/cols,h=148,body='';items.forEach(function(it,i){body+=box(24+(i%cols)*(w+16),106+Math.floor(i/cols)*(h+16),w,h,it[0],it[1],it[2]);});var y=106+Math.ceil(items.length/cols)*(h+16);return frame(title,sub,y+foot.length*29+50,body+footer(y,foot),items.map(function(it){return it[0]+': '+it[1].join(' ');}).join('. ')+' '+foot.join(' '));}
V.referral=function(){
 function card(x,y,w,h,title,body,color,fill){return '<g data-card="'+[x,y,w,h].join(',')+'">'+rect(x,y+4,w,h,'#16324f0a','none')+rect(x,y,w,h,fill||'#fff',color)+text(x+24,y+39,title,27,color,750)+lines(x+24,y+83,body,25,navy)+'</g>';}
 function badge(x,y,label,color){return '<circle cx="'+x+'" cy="'+y+'" r="20" fill="'+color+'"/>'+text(x,y+8,label,24,'#fff',750,'middle');}
 var b=rect(0,0,1200,946,'#f3f8fa','none')+'<path d="M18 0 H1182 Q1200 0 1200 18 V106 H0 V18 Q0 0 18 0" fill="'+navy+'"/>'+text(30,48,'Referral: choose the right route',38,'#fff',750)+text(30,84,'NICE NG87 1.2.6–1.2.11 • check the local referral pathway',25,'#d4e7ef');
 b+=card(28,134,756,114,'Children and young people',['Assess severity, impact and difficulties across settings.'],teal,'#e3f2f1');
 b+=card(804,134,368,114,'Adult referral',['No childhood diagnosis.'],navy,'#e8eff7');
 b+='<path d="M406 248 V266 H212 V287 M406 266 H600 V287" fill="none" stroke="'+teal+'" stroke-width="3"/>'+arrow(212,276,212,290)+arrow(600,276,600,290)+arrow(988,248,988,290,navy);
 b+=card(28,298,368,230,'Severe impairment',['Do not delay referral','for a period of','watchful waiting.'],coral,'#fff5f1');
 b+=card(416,298,368,230,'Impact, but not severe',['Consider watchful waiting','for up to 10 weeks and','group-based parent support.'],amber,'#fffaf0');
 b+=card(804,298,368,230,'Lifelong pattern',['Began in childhood; persists.','Not better explained by','another mental disorder.','Moderate or greater impact.'],navy);
 b+=arrow(212,528,212,574,coral)+arrow(600,528,600,574,amber)+arrow(988,528,988,574,navy);
 b+=card(28,584,368,112,'Refer directly',['To secondary care.'],coral);
 b+=card(416,584,368,112,'If moderate+ persists',['Refer to secondary care.'],amber);
 b+=card(804,584,368,112,'Refer for assessment',['To an adult ADHD specialist.'],navy);
 b+=rect(28,726,1144,98,'#e3f2f1','none')+badge(62,765,'↗',teal)+text(100,764,'Previously treated for ADHD in childhood?',27,teal,750)+text(100,801,'Continuing symptoms with moderate+ impairment → general adult psychiatry.',25,navy);
 b+=rect(28,844,1144,76,navy,'none')+text(52,875,'Children: primary care does not make the initial diagnosis or start medication.',24,'#fff',600)+text(52,906,'Urgent risk or safeguarding concerns need a prompt response first.',24,'#d4e7ef');
 return '<svg class="ag-svg ag-explainer ag-wide" viewBox="0 0 1200 946" role="img" aria-label="Referral: choose the right route" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif"><title>Referral: choose the right route</title><desc>Two child referral branches distinguish severe impairment from watchful waiting and parent support with referral if moderate impairment persists. The adult pathway checks childhood onset, persistence, other explanations and at least moderate impairment before specialist referral.</desc>'+b+'</svg>';
};
V.prep=function(){var b='';
 [['Self-report','Difficulties and life impact'],['Informants','Examples now and in childhood'],['School reports','Comments across the years'],['Health records','Past history and assessments']].forEach(function(it,i){var x=24+(i%2)*384,y=110+Math.floor(i/2)*130;b+=box(x,y,368,112,it[0],[it[1]]);});
 b+=arrow(208,352,330,402)+arrow(592,352,470,402);
 b+=box(160,408,480,118,'Full specialist assessment',['Combine accounts, history and MSE.']);
 b+=footer(548,['A screen flags the need to assess; it cannot diagnose ADHD.','Review returned forms for risk; obtain consent for collateral.']);
 return frame('Before the appointment','Gather different kinds of evidence, not just a score',654,b);
};
V.grid=function(){var b='',domains=[['Inattention',8,teal],['Hyperactivity / impulsivity',4,coral]];
 domains.forEach(function(d,r){var y=120+r*164;b+=text(28,y,d[0],27,d[2],700);for(var i=0;i<9;i++){var x=28+i*82;b+=rect(x,y+20,68,62,i<d[1]?d[2]:'#fff',d[2])+text(x+34,y+61,i+1,25,i<d[1]?'#fff':d[2],700,'middle');}b+=text(28,y+119,d[1]+' of 9 symptoms supported',23,d[2],600);});
 b+=footer(438,['Adult example: Sam • current symptoms • threshold 5+ per domain.','Under 17: 6+ per domain. Assess duration and developmental level.','Counts alone are not a diagnosis: also establish criteria B–E.']);
 return frame('The 18 symptoms: count the evidence','Two domains • review childhood and the past 6 months',568,b,'Sam example: 8 of 9 inattentive and 4 of 9 hyperactive-impulsive symptoms. Filled numbered cells are supported; outlined cells are not. Age-specific thresholds and all other criteria still apply.');
};
V.timeline=function(){var b=box(24,112,752,108,'Childhood evidence',['Reports, memories and records: what happened, and at what age?']);
 b+=rect(36,260,242,84,'#e3f2f1',teal)+text(56,294,'Before age 12',26,teal,700)+text(56,326,'Several symptoms',23,teal);
 b+=arrow(54,382,746,382,navy);
 [[54,'Early years'],[300,'12'],[486,'18'],[730,'Now']].forEach(function(p){b+='<circle cx="'+p[0]+'" cy="382" r="8" fill="'+navy+'"/>'+text(p[0],419,p[1],22,navy,600,p[0]===54?'start':p[0]===730?'end':'middle');});
 b+='<path d="M300 248 V392" stroke="'+coral+'" stroke-width="3" stroke-dasharray="8 6"/>';
 b+=box(326,260,450,84,'Demands may increase later',[],coral);
 b+=footer(452,['A childhood diagnosis or full childhood threshold is not required.','Uncertain onset alone should not exclude ADHD (NG87 1.3.3).']);
 return frame('Onset: build a lifeline','DSM criterion B • symptoms and impairment can emerge differently',562,b);
};
V.settings=function(){return tiles('Symptoms across settings','DSM criterion C • look for several symptoms in at least two',[
 ['Home',['Daily routines, tasks,','family interactions.']],['School / work',['Learning, deadlines,','organisation and demands.']],['Social / activities',['Friends, clubs and','other everyday situations.']],['Compare context',['Structure and support','can change what is visible.'],coral]
 ],2,['Seek concrete examples from each setting, not a single impression.','One-setting problems call for exploration, not an automatic label.']);};
V.radar=function(){var b='',labels=['Family','School / work','Life skills','Self-concept','Social','Risk'],values=[2,2.6,2.4,1.8,1.2,1.6];
 [0,1,2,3].forEach(function(v){var x=230+v*160;b+='<path d="M'+x+' 110 V468" stroke="#d8e4e9" stroke-width="2"/>'+text(x,500,v,22,navy,500,'middle');});
 labels.forEach(function(l,i){var y=120+i*56;b+=text(28,y+26,l,24,navy,600)+rect(230,y,480,35,'#e5ecee','none')+rect(230,y,values[i]*160,35,'#288580','none')+text(724,y+26,values[i].toFixed(1),22,teal,700);});
 b+='<path d="M470 110 V468" stroke="'+coral+'" stroke-width="3" stroke-dasharray="6 5"/>'+text(470,535,'Dashed line: domain mean 1.5',22,coral,600,'middle');
 b+=footer(560,['Illustrative domain means, not the selected patient’s results.','WFIRS: one item at 3, two at 2, OR a mean ≥1.5 flags a domain.','Explain real-life consequences; a scale does not diagnose ADHD.']);
 return frame('Impairment: where does life suffer?','Example WFIRS domain means • 0–3 scale',694,b);
};
V.wheel=function(){return tiles('Background history: the whole person','For each area: what happened, when, and why does it matter?',[
 ['Birth',['Pregnancy, birth','and prematurity.']],['Development',['Milestones, speech','and social skills.']],['Education / work',['Learning, transitions','and performance.']],
 ['Mental health',['Mood, anxiety, past','diagnoses and risk.']],['Physical health',['Sleep, neurological','and cardiac history.']],['Medicines',['Prescribed, OTC','and supplements.']],
 ['Family',['ADHD, other illness','and cardiac history.']],['Substances',['Alcohol, drugs','and caffeine.']],['Social / forensic',['Housing, debt,','offending, safety.']]
 ],3,['Use the history to identify needs, alternatives and coexisting conditions.']);};
V.mse=function(){return tiles('Mental state: assess what is present','A calm clinic encounter does not rule ADHD out',[
 ['Appearance / behaviour',['Activity, interaction and self-care.']],['Speech',['Rate, amount and interruptions.']],['Mood / affect',['Mood reported;','emotional range observed.']],['Thought form',['Flow and organisation of ideas.']],['Thought content',['Worries, beliefs,','suicidal thoughts.'],coral],['Perception',['Ask about unusual experiences.']],['Cognition',['Attention, orientation','and memory.']],['Insight',['Understanding and perspective.']]
 ],2,['Describe findings; do not assume a fixed “ADHD mental state”.','Always assess and document risk; act on concerning findings.']);};
V.informants=function(){var b='';[['Self','Experience and cost of coping'],['Parent / partner','History and everyday routines'],['Teacher / colleague','Behaviour in another setting']].forEach(function(it,i){b+=box(24,110+i*116,752,96,it[0],[it[1]]);});
 b+=arrow(400,438,400,476)+box(24,480,752,126,'When accounts differ',['Compare the same symptom, setting and period.','Ask for specific examples; consider records or observation.'],coral)+footer(628,['Document how you weighed the evidence. Disagreement is informative.']);
 return frame('Collateral: compare, do not vote','Each person sees a different part of the picture',712,b);
};
V.tree=function(){var items=[['New or episodic symptoms','Explore onset, mood, substances and illness.'],['Only one setting','Examine demands, learning and context.'],['Sleep-related difficulties','Ask about sleep quality, timing and apnoea.'],['Unresponsive staring spells','Consider seizures; seek specialist assessment.'],['Worry or trauma-linked symptoms','Explore anxiety, trauma and their time course.'],['Substance / medicine effects','Review exposure, timing and withdrawal.'],['Autism or learning differences','Assess whether conditions coexist.']],b='';
 items.forEach(function(it,i){var y=110+i*104;b+=box(24,y,752,90,it[0],[it[1]],i===3?coral:teal);});
 b+=footer(850,['For each alternative: does it explain the symptoms, coexist, or neither?','This is a prompt map—not a diagnostic algorithm or rule-out test.']);
 return frame('Differentials: follow the clues','Consider explanations alongside the full ADHD criteria',960,b);
};
V.ladder=function(){var b=box(24,110,752,145,'1  Immediate safety',['Address immediate risk and safeguarding.','Acute psychosis or mania requires prompt assessment.'],coral)+arrow(400,255,400,280);
 b+=box(24,288,752,145,'2  Stabilise and plan safely',['Consider severe mood/eating problems, substance misuse','and cardiac concerns before the ADHD treatment plan.'],amber)+arrow(400,433,400,458);
 b+=box(24,466,752,145,'3  Coordinate care in parallel',['Plan care for anxiety, autism or tics where present.','Provide sleep, learning, social and environmental support.']);
 b+=footer(636,['Teaching priorities, not a universal treatment sequence.','Individualise decisions and use the condition-specific guidance.']);
 return frame('Coexisting conditions: what comes first?','Urgency, clinical stability and support needs guide the order',748,b);
};
V.gates=function(){var rows=[['A  Symptoms',['Age threshold in one or both domains; 6+ months;','beyond developmental level with functional impact.']],['B  Onset',['Several symptoms before age 12.']],['C  Settings',['Several symptoms in two or more settings.']],['D  Impairment',['Clear interference with, or reduced quality of, functioning.']],['E  Alternatives',['Not better explained by another condition.']]];
 var b='';rows.forEach(function(r,i){b+=box(24,110+i*122,752,114,r[0],r[1]);});b+=footer(740,['All DSM criteria must be supported—not just the symptom count.','Then specify presentation and severity; apply ICD-11 coding carefully.']);
 return frame('Formulation: evidence for every criterion','DSM criteria A–E • document the reasoning',852,b);
};
V.fork=function(){var b=box(24,110,752,96,'Weigh all the evidence',['Criteria, history, impairment, alternatives and uncertainty.']);
 [148,400,652].forEach(function(x){b+=arrow(400,218,x,270);});
 b+=box(24,278,240,210,'ADHD',['Explain evidence.','Agree a plan','and pathway.']);
 b+=box(280,278,240,210,'Uncertain',['Specify missing','information and','a review date.'],amber);
 b+=box(536,278,240,210,'Not ADHD',['Explain why.','Offer alternative','help and support.'],coral);
 b+=footer(510,['Every outcome needs an explanation, support and next steps.','If unsure, discuss with a supervisor or multidisciplinary team.']);
 return frame('The decision: three honest outcomes','Avoid pressure to turn uncertainty into a yes or no',622,b);
};
V.report=function(){return tiles('The report: make the reasoning visible','A useful report connects evidence → conclusion → action',[
 ['1  Sources and story',['Referral question and information sources.','Difficulties in the person’s own words.']],['2  Evidence',['Childhood and current symptoms.','Onset, settings and daily-life impact.']],['3  Clinical reasoning',['History, MSE and physical baseline.','Alternatives, formulation and diagnosis.']],['4  Action',['Recommendations and shared plan.','Risk, safety net and follow-up.']]
 ],1,['Use clear language and share appropriately with consent.']);};
V.scope=function(){var b=box(24,110,752,100,'Learn',['Use this guide to understand the assessment process.'])+arrow(400,210,400,238)+box(24,246,752,100,'Practise with supervision',['Observe, assess with support, and discuss uncertain cases.'],amber)+arrow(400,346,400,374)+box(24,382,752,126,'Work within demonstrated competence',['Specialist diagnosis requires appropriate training and expertise.','Course completion alone is not a clinical qualification.'],coral);
 b+=footer(530,['Safety net: document risk, explain who to contact, arrange follow-up.','Seek advice when unsure; follow professional and local standards.']);
 return frame('Competence and safety netting','Learning supports practice; it does not confer authority',644,b);
};
var captions={
 referral:'Referral routes for children and adults, including review, direct referral and continuing childhood ADHD. Urgent risk takes priority; follow local pathways.',
 prep:'Different sources contribute to a full assessment. Screening cannot substitute for clinical history, collateral and examination.',
 grid:'Illustrative adult example (Sam), not a live tally: 8 inattentive and 4 hyperactive-impulsive symptoms. Establish the full criteria before deciding presentation.',
 timeline:'Several symptoms before age 12—not necessarily a childhood diagnosis. Later demands may expose previously compensated difficulties.',
 settings:'Compare concrete examples across settings and account for differences in structure and demands.',
 radar:'Illustrative impairment profile, not the selected case’s results. A scoring rule supports—but does not replace—judgement about real-life impact.',
 wheel:'Nine areas of background history, with prompts that connect life events to needs, alternative explanations and treatment safety.',
 mse:'Eight mental-state domains to assess without assuming typical findings. Risk must be assessed and acted on.',
 informants:'Compare specific examples from different perspectives, explore discrepancies and document how the evidence was weighed.',
 tree:'Clues guide further assessment; they do not automatically exclude ADHD or prove another diagnosis. Conditions may coexist.',
 ladder:'A teaching framework for urgency and coordinated care, not a fixed order for every patient.',
 gates:'Support every DSM criterion with evidence. Presentation, severity and ICD-11 coding require clinical judgement.',
 fork:'ADHD, uncertainty and not ADHD each require an explanation and an actionable plan.',
 report:'Group the report around the person’s story, clinical evidence, reasoning and agreed actions.',
 scope:'Learning, supervision and competence are distinct. A course does not authorise independent specialist diagnosis.'
};
var images={
 3:['ag-consent-explained','A clinician explains the assessment and agrees contacts with an adult. Labels: explain the process, agree who to contact, quiet room and breaks. Record consent and explain confidentiality limits.'],
 4:['ag-presenting-explained','A clinician listens to the person’s story. Labels: why now, specific examples, impact and goals. Listen first and use open questions.'],
 6:['ag-onset-explained','An adult and parent review school reports, family memories and earlier records with a clinician. Look for several symptoms before age 12.'],
 7:['ag-settings-explained','The same child is shown at home and school. Compare concrete examples, context and demands across two or more settings.'],
 11:['ag-physical-explained','Before medication, record height and weight, pulse and blood pressure, and cardiac history and examination. The seated child’s arm and feet are supported. ECG only when clinically indicated.'],
 18:['ag-feedback-explained','A clinician and adult discuss the outcome, check understanding and agree next steps including adjustments and follow-up. Every outcome needs a plan.']
};
/* The practice chart stays live: visual changes do not alter the baseline tool's decisions. */
window.AGSVG.bpchart=function(sbp,dbp){
 sbp=Number(sbp);dbp=Number(dbp);
 var valid=Number.isFinite(sbp)&&Number.isFinite(dbp)&&sbp>0&&dbp>0;
 var x=function(v){return 120+(Math.max(40,Math.min(130,v))-40)*7;};
 var y=function(v){return 450-(Math.max(80,Math.min(200,v))-80)*2.5;};
 var b='<rect x="120" y="150" width="630" height="300" fill="#edf3f5"/>';
 b+='<path d="M120 150 H750 V450 H470 V300 H120 Z" fill="#fff0ce"/>';
 b+='<path d="M120 150 H750 V450 H680 V200 H120 Z" fill="#f8d9d1"/>';
 [80,100,120,140,160,180,200].forEach(function(v){b+='<path d="M120 '+y(v)+' H750" stroke="#bcc9ce"/>'+text(105,y(v)+7,v,21,navy,500,'end');});
 [40,60,80,90,100,120,130].forEach(function(v){b+='<path d="M'+x(v)+' 150 V450" stroke="#bcc9ce"/>'+text(x(v),482,v,20,navy,500,'middle');});
 b+='<path d="M120 150 V450 H750" fill="none" stroke="'+navy+'" stroke-width="3"/>';
 b+=text(435,519,'Diastolic (mmHg)',24,navy,600,'middle')+'<text transform="translate(38 300) rotate(-90)" text-anchor="middle" font-size="24" fill="'+navy+'">Systolic (mmHg)</text>';
 if(valid)b+='<circle cx="'+x(dbp)+'" cy="'+y(sbp)+'" r="10" fill="'+navy+'" stroke="#fff" stroke-width="4"/>';
 b+=text(28,123,valid?'Entered reading: '+sbp+' / '+dbp+' mmHg':'Enter both readings to plot a point',25,navy,700);
 b+=box(24,550,752,112,'Amber: systolic ≥140 OR diastolic ≥90',['Repeat clinic measurement; assess and confirm as appropriate.'],amber);
 b+=box(24,680,752,112,'Coral: systolic ≥180 OR diastolic ≥120',['Assess promptly; symptoms and signs determine urgency.'],coral);
 b+=footer(812,[valid&&(sbp<80||sbp>200||dbp<40||dbp>130)?'Point is at the chart edge: the entered value is outside this range.':'Either number can cross a threshold; this is not a diagnosis.', 'Adults only • use age/height centiles for children, not this chart.']);
 return frame('Adult clinic blood pressure','Practice chart • NICE NG136 • use the full clinical assessment',924,b);
};
window.AGTEACH={figures:V,captions:captions,images:images};
})();
