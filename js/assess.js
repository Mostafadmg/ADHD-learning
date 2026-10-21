/* Assessment Guide – step-by-step interactive walkthrough (19 steps). No dependencies.
   Uses window.AGSTEPS, AGSX, AGCASES, AGDDX, AGSVG. State is kept in localStorage on this device. */
(function(){
'use strict';
var KEY='adhd.ag.v1';
var S=load();
function load(){try{var s=JSON.parse(localStorage.getItem(KEY));if(s&&typeof s==='object')return fill(s);}catch(e){}return fill({});}
function fill(s){s.step=s.step||1;s.cs=s.cs||'sam';s.iv=s.iv||{sam:{},leo:{}};s.iv.sam=s.iv.sam||{};s.iv.leo=s.iv.leo||{};s.rv=s.rv||{};s.q=s.q||{};s.dc=s.dc||{};s.ck=s.ck||{};s.sx=s.sx||{sam:0,leo:0};s.tr=s.tr||[];s.wf=s.wf||{};s.as=s.as||{};s.sev=s.sev||{};s.dec=s.dec||{};s.tri=s.tri||{};s.st=s.st||{};s.dis=s.dis||{};return s;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function esc(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function $(s,r){return (r||document).querySelector(s);} function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
var STEPS=window.AGSTEPS, SX=window.AGSX, CASES=window.AGCASES, DDX=window.AGDDX, SVG=window.AGSVG, N=STEPS.length;
var CAP={referral:'Figure: NG87 referral routes. Children: primary care judges severity; moderate problems may have watchful waiting of up to 10 weeks with parent support, severe go straight to the specialist. Adults: refer if childhood-onset, persistent, not explained by another diagnosis and at least moderately impairing.',
 prep:'Figure: information from several sources feeds the assessment. The screen (dashed line) only flags that assessment is warranted.',
 grid:'Figure: the 18 symptoms as two rows of nine. The filled cells show Sam now: 8 inattentive (threshold met at 5+ for 17 and over) and 4 hyperactive-impulsive (not met), so the current presentation is predominantly inattentive.',
 timeline:'Figure: a lifeline. Several symptoms must be present before 12 (shaded); school reports at different ages are strong evidence. Impairment often rises later as structure falls away.',
 settings:'Figure: home, school or work, and social settings. ADHD needs several symptoms in at least two; the overlap (tick) is what you are looking for.',
 radar:'Figure: impairment across six domains (illustrative ratings). The dashed ring marks a domain mean of 1.5, one of the WFIRS rules for impairment.',
 wheel:'Figure: the background history areas to cover in every assessment.',
 mse:'Figure: the eight MSE domains with findings typical in ADHD. The highlighted domain (thought content and risk) must always be asked about.',
 informants:'Figure: self, parent or partner, and teacher or manager each see part of the picture. Resolve differences with specific examples and, if in doubt, a third source or observation.',
 tree:'Figure: a simplified version of the decision tree below. Each "yes" (dashed) sends you to a mimic or co-existing condition to assess; if nothing explains the picture better, ADHD remains the best fit.',
 ladder:'Figure: a teaching ladder of priorities. Higher rungs are addressed first; lower rungs often run in parallel.',
 gates:'Figure: criteria A to E as five gates. All must be passed before you specify presentation, severity and the ICD-11 code.',
 fork:'Figure: the three possible outcomes. Each one ends with a plan.',
 report:'Figure: a report outline. The diagnosis section is highlighted, but the reasoning in every other section is what makes the report useful.',
 scope:'Figure: this guide sits in the outer ring (learning). Diagnosis is made by a trained specialist (NG87 1.3.1); you build towards it through supervised practice.'};
var AICAP='AI-generated illustration, not a real patient.';
var ZERO={ /* why the case evidence does not count, per cell */
 sam:{ia3:[null,'Only in the last month and linked to stress about a parent\u2019s illness: not persistent for 6 months, and better explained by preoccupation.'],
  ia6:['No avoidance described in childhood: does not count.',null],ia9:['No clear examples: you cannot count a symptom without evidence. Mother "did everything", so it may have been hidden, but record it as not established.',null],
  hi2:[null,'Better explained by back pain: getting up is for a physical reason.'],hi3:[null,'Settled in the teens; no current inner restlessness. Common: hyperactivity often reduces with age.'],
  hi4:['"No more than his brothers": within the normal range for the family and age.','Not impairing: scrolling while watching TV is common and causes no problems.'],
  hi6:[null,'Talkative but not impairing: no problems at work or home.'],hi8:['No problems with waiting described.','No problems with waiting described.']},
 leo:{ia5:['Typical for age: a messy bedroom at 8 is common and no worse than his sister\u2019s.','No messier than most of the class: within the normal range for age.'],
  ia7:[null,'Teacher sees no more than other children. It still counts overall because home evidence is strong.'],ia9:['"No worse than his friends": within the normal range.','No concerns at school.'],
  hi4:[null,'Quiet reading is fine at school. It still counts overall because of the home evidence.'],hi6:['Talkative only about a favourite topic when excited: normal, not impairing.','No more than other children.']}};

/* ---------- small components ---------- */
function mcqHTML(key,it){var ans=S.q[key];var h='<div class="ag-q" data-key="'+key+'"><p class="ag-qq"><strong>Check:</strong> '+esc(it.q)+'</p><div class="ag-opts">';
 it.o.forEach(function(o,i){var cls='';if(ans!=null){if(i===it.a)cls=' good';else if(i===ans)cls=' bad';}h+='<button type="button" class="ag-opt'+cls+'" data-i="'+i+'" aria-pressed="'+(ans===i)+'">'+esc(o)+'</button>';});
 h+='</div><div class="ag-fb" aria-live="polite">'+(ans!=null?fbHTML(ans===it.a,it.e):'')+'</div></div>';return h;}
function fbHTML(ok,e){return '<div class="fb '+(ok?'good':'bad')+'"><strong>'+(ok?'Correct.':'Not quite.')+'</strong> '+esc(e)+'</div>';}
function dicHTML(key,it){var ans=S.dc[key];var h='<div class="ag-dic" data-key="'+key+'"><div class="ag-dic-h"><span class="ag-tag">Does it count?</span></div><p>'+esc(it.s)+'</p><div class="ag-opts two">';
 [[1,'Counts'],[0,'Doesn\u2019t count']].forEach(function(o){var cls='';if(ans!=null){if(o[0]===it.a)cls=' good';else if(o[0]===ans)cls=' bad';}h+='<button type="button" class="ag-opt'+cls+'" data-v="'+o[0]+'" aria-pressed="'+(ans===o[0])+'">'+o[1]+'</button>';});
 h+='</div><div class="ag-fb" aria-live="polite">'+(ans!=null?'<div class="fb '+(ans===it.a?'good':'bad')+'"><strong>'+(ans===it.a?'Correct':'Not quite')+' \u00b7 '+esc(it.r)+'.</strong> '+esc(it.e)+'</div>':'')+'</div></div>';return h;}
function wrap(kicker,title,body){return '<div class="ag-w"><div class="ag-w-h"><span class="ag-tag">'+kicker+'</span><h3>'+title+'</h3></div>'+body+'</div>';}
function caseNow(){return CASES[S.cs];}

/* ---------- widgets ---------- */
var W={};
/* Step 1: triage sorter */
var TRI=[{s:'Child, 7. Moderate problems at home and school for 2 months. No support tried yet.',a:0,e:'NG87 1.2.7: for moderate problems, watchful waiting for up to 10 weeks and group-based parent support may be offered; refer if problems persist with at least moderate impairment.'},
 {s:'Child, 9. Excluded from school twice this term; has run into the road twice. Severe impairment.',a:1,e:'NG87 1.2.8: refer directly to secondary care if impairment is severe.'},
 {s:'Adult, 26. Lifelong problems confirmed by mother, moderate impairment at work, no other diagnosis explains them.',a:2,e:'NG87 1.2.10: meets the adult referral criteria.'},
 {s:'Adult, 19. Treated for ADHD as a child; symptoms persist and need ongoing treatment.',a:3,e:'NG87 1.2.11: refer to general adult psychiatric services for assessment (in many areas this is an adult ADHD service).'},
 {s:'Young person, 14, referred for ADHD. The letter mentions self-harm last week with suicidal intent.',a:4,e:'Risk comes first: follow your urgent risk and safeguarding procedures (clinical practice; see NICE NG225 on self-harm). The ADHD assessment can follow.'}];
var TRO=['Watchful waiting \u226410 weeks + parent support','Refer directly to specialist','Refer to adult ADHD assessment','General adult psychiatry','Urgent risk response first'];
W.triage=function(){var h='<p>Choose the best route for each referral.</p>';
 TRI.forEach(function(t,i){var a=S.tri[i];h+='<div class="ag-tri" data-i="'+i+'"><p><strong>'+(i+1)+'.</strong> '+esc(t.s)+'</p><div class="ag-opts">';
  TRO.forEach(function(o,j){var c='';if(a!=null){if(j===t.a)c=' good';else if(j===a)c=' bad';}h+='<button type="button" class="ag-opt sm'+c+'" data-j="'+j+'" aria-pressed="'+(a===j)+'">'+esc(o)+'</button>';});
  h+='</div><div class="ag-fb" aria-live="polite">'+(a!=null?fbHTML(a===t.a,t.e):'')+'</div></div>';});
 return wrap('Practice','Triage the referral',h);};
/* Step 2: ASRS-style Part A screen */
var ASRS=['Trouble finishing the final details of a project once the hard parts are done','Difficulty getting things in order for a task that needs organising','Problems remembering appointments or obligations','Avoiding or delaying starting tasks that need a lot of thought','Fidgeting or squirming with hands or feet when sitting for a long time','Feeling overly active, as if driven by a motor'];
var FREQ=['Never','Rarely','Sometimes','Often','Very often'];
W.asrs=function(){var v=S.as.v||[null,null,null,null,null,null];var h='<p>Rate how often over the past 6 months (themes paraphrased; use the official WHO form in practice).</p><div class="ag-asrs">';
 ASRS.forEach(function(t,i){h+='<div class="ag-asrs-row"><p><strong>'+(i+1)+'.</strong> '+esc(t)+' <span class="ag-mini">(shaded from '+(i<3?'Sometimes':'Often')+')</span></p><div class="ag-seg" role="group" aria-label="Item '+(i+1)+' frequency">';
  FREQ.forEach(function(f,j){var shaded=j>=(i<3?2:3);h+='<button type="button" class="ag-segb'+(shaded?' sh':'')+'" data-i="'+i+'" data-j="'+j+'" aria-pressed="'+(v[i]===j)+'">'+f+'</button>';});h+='</div></div>';});
 h+='</div><div class="ag-row"><button type="button" class="btn secondary ag-asrs-sam">Fill with Sam\u2019s answers</button><button type="button" class="btn secondary ag-asrs-clr">Clear</button></div><div class="ag-asrs-out" aria-live="polite">'+asrsOut(v)+'</div>';
 return wrap('Try it','ASRS v1.1 Part A: a screen only',h);};
function asrsOut(v){var n=0,done=0;v.forEach(function(x,i){if(x!=null){done++;if(x>=(i<3?2:3))n++;}});
 if(done<6)return '<p class="ag-mini">'+done+' of 6 answered. Shaded answers so far: '+n+'.</p>';
 return n>=4?'<div class="fb ok"><strong>'+n+' of 6 in shaded boxes: screen positive.</strong> Symptoms are highly consistent with adult ADHD and further assessment is warranted. This is not a diagnosis.</div>':'<div class="fb good"><strong>'+n+' of 6 in shaded boxes: screen negative.</strong> A negative screen does not rule ADHD out if the clinical history is strong; it is one piece of information.</div>';}
/* Step 5: structured interview */
function ivAns(cs,id){return (S.iv[cs]||{})[id]||[null,null];}
function correct(cs,id){var e=CASES[cs].ev[id];return [e[0][1],e[1][1]];}
function tally(cs,useCorrect){var r={IA:[0,0],HI:[0,0],any:{IA:0,HI:0},done:0};SX.forEach(function(s){var a=useCorrect?correct(cs,s.id):ivAns(cs,s.id);if(a[0]!=null&&a[1]!=null)r.done++;
 if(a[0]===1)r[s.d][0]++;if(a[1]===1)r[s.d][1]++;if(a[0]===1||a[1]===1)r.any[s.d]++;});return r;}
W.interview=function(){var cs=S.cs,c=CASES[cs],i=S.sx[cs]||0,s=SX[i],a=ivAns(cs,s.id),cor=correct(cs,s.id),rv=S.rv[cs+':'+s.id];
 var h='<p class="ag-mini">Case: <strong>'+esc(c.label)+'</strong>. Columns: '+esc(c.cols[0])+' and '+esc(c.cols[1])+'. Switch case at the top of the guide.</p>';
 h+='<div class="ag-sxnav" role="group" aria-label="Choose a symptom">';SX.forEach(function(x,k){var aa=ivAns(cs,x.id),st=(aa[0]!=null&&aa[1]!=null)?(S.rv[cs+':'+x.id]?'rv':'dn'):'';
  h+='<button type="button" class="ag-sxb '+x.d.toLowerCase()+' '+st+'" data-k="'+k+'" aria-current="'+(k===i?'step':'false')+'" aria-label="'+esc(x.k+' '+x.t)+'">'+x.k.slice(1)+'</button>';});h+='</div>';
 h+='<div class="ag-sx"><div class="ag-sx-h"><span class="ag-tag '+s.d.toLowerCase()+'">'+(s.d==='IA'?'Inattention':'Hyperactivity-impulsivity')+' \u00b7 '+s.k+'</span><span class="ag-mini">Symptom '+(i+1)+' of 18</span></div>';
 h+='<h4>'+esc(s.t)+'</h4><p>'+esc(s.p)+'</p><p class="ag-prompt"><strong>Ask:</strong> "'+esc(c.adult?s.qa:s.qc)+'"</p>';
 h+='<details class="ag-ex"><summary>Examples and rules: when it counts</summary><div class="ag-ex-g"><div><h5>Child examples</h5><ul>'+s.ec.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div><div><h5>Adult examples</h5><ul>'+s.ea.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div></div><p class="ag-yes"><strong>Counts when:</strong> '+esc(s.yes)+'</p><p class="ag-no"><strong>Does not count when:</strong> '+esc(s.no)+'</p></details>';
 h+='<div class="ag-cols">';[0,1].forEach(function(col){var v=a[col];h+='<div class="ag-col"><h5>'+esc(c.cols[col])+'</h5><p class="ag-ev">'+esc(c.ev[s.id][col][0])+'</p><div class="ag-opts two">';
  [[1,'Counts'],[0,'Doesn\u2019t count']].forEach(function(o){var cls='';if(rv){if(o[0]===cor[col])cls=' good';else if(o[0]===v)cls=' bad';}h+='<button type="button" class="ag-opt ag-iv'+cls+'" data-col="'+col+'" data-v="'+o[0]+'" aria-pressed="'+(v===o[0])+'">'+o[1]+'</button>';});
  h+='</div>';if(rv){var z=(ZERO[cs][s.id]||[])[col];h+='<div class="fb '+(v===cor[col]?'good':'bad')+'"><strong>'+(cor[col]?'Counts.':'Doesn\u2019t count.')+'</strong> '+esc(cor[col]?s.yes:(z||s.no))+'</div>';}h+='</div>';});
 h+='</div><div class="ag-row"><button type="button" class="btn secondary ag-sxprev"'+(i===0?' disabled':'')+'>\u2190 Previous symptom</button><button type="button" class="btn ag-sxchk">Check this symptom</button><button type="button" class="btn secondary ag-sxnext"'+(i===17?' disabled':'')+'>Next symptom \u2192</button></div></div>';
 var t=tally(cs),tc=tally(cs,true),thr=c.adult?5:6;
 h+='<div class="ag-tally"><h4>Your running tally</h4><div class="table-wrap"><table class="ag-tbl"><thead><tr><th></th><th>'+esc(c.colShort[0])+'</th><th>'+esc(c.colShort[1])+'</th>'+(c.adult?'':'<th>Either</th>')+'</tr></thead><tbody>'+
  ['IA','HI'].map(function(d){return '<tr><th>'+(d==='IA'?'Inattention':'Hyperactive-<wbr>impulsive')+'</th><td>'+t[d][0]+'/9</td><td>'+t[d][1]+'/9</td>'+(c.adult?'':'<td>'+t.any[d]+'/9</td>')+'</tr>';}).join('')+'</tbody></table></div>'+
  '<p class="ag-mini">'+t.done+' of 18 symptoms rated in both columns. Threshold now: '+thr+'+ per domain ('+(c.adult?'age 17+':'under 17')+').'+(c.adult?' Childhood needs <em>several</em> symptoms before 12.':' Count a symptom if it is present and impairing in either setting, and check several appear in both settings.')+'</p>'+
  '<div class="ag-row"><button type="button" class="btn secondary ag-rvall">Reveal all answers</button><button type="button" class="btn secondary ag-ivclr">Clear my answers for this case</button></div>'+
  (Object.keys(S.rv).some(function(k){return k.indexOf(cs+':')===0;})?'<p class="ag-mini">Correct tally for this case: '+(c.adult?'childhood '+tc.IA[0]+' inattentive, '+tc.HI[0]+' hyperactive-impulsive; now '+tc.IA[1]+' and '+tc.HI[1]+'.':'inattentive '+tc.any.IA+', hyperactive-impulsive '+tc.any.HI+' (either setting).')+'</p>':'')+'</div>';
 return wrap('Interactive interview','18 symptoms, step by step',h);};
/* Step 7: settings */
var SET={sam:{o:['Home','School (childhood)','Work','Social','Driving'],a:[1,1,1,1,1],e:'All five have evidence: home (partner), school (reports), work (manager, dismissals), social (friends), driving (speeding fines). Two are enough; more strengthens the case.'},
 leo:{o:['Home','School','Swimming club','Grandparents','Clinic room'],a:[1,1,1,0,0],e:'Home, school and swimming club have reports. There is no information from grandparents, and good focus in the clinic room does not count against ADHD.'}};
W.settings=function(){var d=SET[S.cs],v=S.st[S.cs]||[],done=S.st[S.cs+':c'];var h='<p>Case: <strong>'+esc(caseNow().label)+'</strong>. Tap each setting where there is evidence of several symptoms.</p><div class="ag-opts">';
 d.o.forEach(function(o,i){var c='';if(done){c=d.a[i]?' good':(v[i]?' bad':'');}h+='<button type="button" class="ag-opt ag-st'+c+'" data-i="'+i+'" aria-pressed="'+(!!v[i])+'">'+esc(o)+'</button>';});
 h+='</div><div class="ag-row"><button type="button" class="btn ag-stchk">Check</button></div><div class="ag-fb" aria-live="polite">'+(done?'<div class="fb ok">'+esc(d.e)+'</div>':'')+'</div>';
 return wrap('Practice','Which settings have evidence?',h);};
/* Step 8: WFIRS-style rater */
var WF=[['Family','Conflict at home about everyday tasks','Partner or parents frustrated with you','Problems in family routines (meals, mornings)'],
 ['School / work','Not finishing work or assignments','Trouble with teachers, managers or colleagues','At risk of failing or losing a job'],
 ['Life skills','Problems managing money or bills','Late, missed appointments','Problems with sleep or self-care'],
 ['Self-concept','Feeling a failure','Low confidence','Frustration with yourself'],
 ['Social','Trouble making or keeping friends','Being left out','Arguments with others'],
 ['Risk','Accidents or injuries','Driving problems (fines, near-misses)','Acting without thinking in risky ways']];
var WFP={sam:[[2,2,1],[3,2,3],[3,2,1],[2,2,2],[1,0,1],[1,2,1]],leo:[[2,2,2],[2,2,1],[1,0,1],[1,1,1],[3,2,1],[2,0,2]]};
W.wfirs=function(){var v=S.wf.v||WF.map(function(){return [null,null,null];});var h='<p>Rate each example item 0 (never or not at all) to 3 (very often or very much), or NA. Items are paraphrased examples, not the WFIRS wording.</p>';
 WF.forEach(function(d,i){var r=wfDom(v[i]);h+='<div class="ag-wf"><div class="ag-wf-h"><h5>'+esc(d[0])+'</h5><span class="ag-pill '+(r.imp?'bad':(r.n?'good':''))+'">'+(r.n?(r.imp?'Impaired':'Not impaired')+' \u00b7 mean '+r.mean.toFixed(1):'Not rated')+'</span></div>';
  for(var k=1;k<4;k++){h+='<div class="ag-wf-i"><span>'+esc(d[k])+'</span><div class="ag-seg sm" role="group" aria-label="'+esc(d[k])+'">';['NA',0,1,2,3].forEach(function(o){var val=o==='NA'?'NA':o;h+='<button type="button" class="ag-segb" data-i="'+i+'" data-k="'+(k-1)+'" data-v="'+val+'" aria-pressed="'+(v[i][k-1]===val)+'">'+o+'</button>';});h+='</div></div>';}
  h+='</div>';});
 var imp=v.filter(function(x){return wfDom(x).imp;}).length;
 h+='<div class="ag-row"><button type="button" class="btn secondary ag-wfp" data-c="sam">Fill with Sam</button><button type="button" class="btn secondary ag-wfp" data-c="leo">Fill with Leo</button><button type="button" class="btn secondary ag-wfclr">Clear</button></div><p class="ag-mini" aria-live="polite"><strong>'+imp+' of 6 domains impaired.</strong> Rule used: 2+ items scored 2, or 1 item scored 3, or a mean of 1.5 or more (NA items excluded). Clinical judgement decides whether overall impairment is at least moderate (NG87 1.3.3).</p>';
 return wrap('Try it','Impairment by domain (WFIRS-style rule)',h);};
function wfDom(a){var x=a.filter(function(y){return y!==null&&y!=='NA';});var n=x.length,sum=0,c2=0,c3=0;x.forEach(function(y){sum+=y;if(y===2)c2++;if(y===3)c3++;});var mean=n?sum/n:0;return {n:n,mean:mean,imp:n>0&&(c2>=2||c3>=1||mean>=1.5)};}
/* Step 11: baseline tool */
var CARD=['Congenital heart disease or previous cardiac surgery','Sudden death in a first-degree relative under 40 suggesting cardiac disease','Shortness of breath on exertion compared with peers','Fainting on exertion or in response to fright or noise','Rapid, regular palpitations that start and stop suddenly','Chest pain suggesting cardiac origin','Signs of heart failure','A murmur on cardiac examination','Blood pressure classified as hypertensive for adults'];
W.baseline=function(){var b=S.bl||{age:'adult',sbp:128,dbp:82,hr:76,f:[],med:false,c95:false};S.bl=b;
 var h='<div class="ag-seg" role="group" aria-label="Age group"><button type="button" class="ag-segb ag-blage" data-v="adult" aria-pressed="'+(b.age==='adult')+'">Adult</button><button type="button" class="ag-segb ag-blage" data-v="child" aria-pressed="'+(b.age==='child')+'">Child / young person</button></div>';
 h+='<div class="ag-blin"><label>Heart rate (bpm)<input type="number" inputmode="numeric" class="ag-bl" data-k="hr" value="'+esc(b.hr)+'" min="30" max="220"></label>';
 if(b.age==='adult')h+='<label>Systolic (mmHg)<input type="number" inputmode="numeric" class="ag-bl" data-k="sbp" value="'+esc(b.sbp)+'" min="60" max="260"></label><label>Diastolic (mmHg)<input type="number" inputmode="numeric" class="ag-bl" data-k="dbp" value="'+esc(b.dbp)+'" min="30" max="160"></label>';
 h+='</div>';
 if(b.age==='adult')h+='<div class="ag-fig">'+SVG.bpchart(b.sbp,b.dbp)+'</div>';
 else h+='<label class="ag-chk"><input type="checkbox" class="ag-blc95"'+(b.c95?' checked':'')+'> Blood pressure consistently above the 95th centile for age and height (plot on a paediatric centile chart; this tool does not hold centile tables)</label>';
 h+='<fieldset class="ag-fs"><legend>NG87 1.7.5 features</legend>';CARD.forEach(function(c,i){if(i===8&&b.age!=='adult')return;h+='<label class="ag-chk"><input type="checkbox" class="ag-blf" data-i="'+i+'"'+(b.f.indexOf(i)>=0?' checked':'')+'> '+esc(c)+'</label>';});
 h+='<label class="ag-chk"><input type="checkbox" class="ag-blmed"'+(b.med?' checked':'')+'> A coexisting condition treated with a medicine that may increase cardiac risk</label></fieldset>';
 h+='<div class="ag-blout" aria-live="polite">'+blOut(b)+'</div>';
 return wrap('Try it','Physical baseline decision',h);};
function blOut(b){var o=[],f=b.f.slice();if(b.age==='adult'&&+b.sbp&&+b.dbp){if(+b.sbp>=180||+b.dbp>=120)o.push(['bad','Clinic BP 180/120 or higher: follow NICE NG136 for same-day referral criteria and do not start ADHD medication until assessed.']);else if(+b.sbp>=140||+b.dbp>=90)o.push(['ok','Clinic BP 140/90 or higher: offer ABPM (or HBPM) to confirm hypertension (NICE NG136 1.2.3\u20131.2.4). If hypertension is confirmed, that is a 1.7.5 feature: refer for a cardiology opinion before starting.']);}
 if(f.length)o.push(['bad','1.7.5 feature present: refer for a cardiology opinion before starting ADHD medication (NG87 1.7.5).']);
 if(b.age==='child'&&b.c95)o.push(['bad','Refer to a paediatric hypertension specialist before starting ADHD medication (NG87 1.7.6).']);
 if(b.med)o.push(['ok','A medicine that may increase cardiac risk: an ECG is indicated before starting (NG87 1.7.4).']);
 if(+b.hr>120)o.push(['ok','Resting heart rate above 120 bpm: recheck and assess the cause before starting. (On treatment, NG87 1.8.11 says reduce the dose and refer if HR is over 120 on 2 occasions.)']);
 if(!o.length)o.push(['good','No 1.7.5 features: an ECG is not needed before starting stimulants, atomoxetine or guanfacine (NG87 1.7.4). Record height, weight, pulse and BP as the baseline.']);
 return o.map(function(x){return '<div class="fb '+x[0]+'">'+esc(x[1])+'</div>';}).join('');}
/* Step 12: informant disagreement */
var DIS=[{s:'Leo: mother says he loses things constantly; teacher says no more than others.',o:['Mother is exaggerating','The setting differs: school has a tray and routines, home does not','Leo cannot have ADHD','Teacher does not know him'],a:1,e:'Structure reduces the impact of some symptoms. The symptom can still count if it is frequent and impairing at home.'},
 {s:'Sam rates talking too much as a big problem; partner says it is not an issue.',o:['Count it because Sam says so','Ask for specific examples and the impact; count it only if it causes impairment','Ignore the partner','Repeat the rating scale'],a:1,e:'Specific examples showed no impairment, so it does not count.'},
 {s:'A 13-year-old: the maths teacher reports severe inattention; four other teachers report none.',o:['Diagnose ADHD','Look at the maths lessons: difficulty level, relationship, anxiety about maths','Exclude all learning problems','Ask for more rating scales from the maths teacher'],a:1,e:'A one-subject problem points to something about that setting (for example a specific learning difficulty or anxiety). Explore it before attributing it to ADHD.'}];
W.disagree=function(){var h='';DIS.forEach(function(d,i){var a=S.dis[i];h+='<div class="ag-tri ag-dis" data-i="'+i+'"><p><strong>'+(i+1)+'.</strong> '+esc(d.s)+'</p><div class="ag-opts">';
 d.o.forEach(function(o,j){var c='';if(a!=null){if(j===d.a)c=' good';else if(j===a)c=' bad';}h+='<button type="button" class="ag-opt sm'+c+'" data-j="'+j+'" aria-pressed="'+(a===j)+'">'+esc(o)+'</button>';});
 h+='</div><div class="ag-fb" aria-live="polite">'+(a!=null?fbHTML(a===d.a,d.e):'')+'</div></div>';});return wrap('Practice','When informants disagree',h);};
/* Step 13: differential tree + cards */
var TCASE={sam:{q1:[1,'Yes: school reports at 7 to 10 and mother\u2019s account.'],q2:[0,'No: low mood began 2 months ago, but the ADHD symptoms are lifelong and present before it.'],q2m:[0,'No periods of elevated mood or reduced need for sleep.'],q3:[0,'No: home, work, social and (in childhood) school.'],q4:[0,'No snoring, pauses or daytime sleepiness.'],q5:[0,'No staring spells.'],q6:[0,'No hearing or vision concerns.'],q7:[0,'Worry is about work and follows the problems; it does not drive them.'],q8:[0,'About 10 units a week; symptoms predate any drinking.'],q9:[0,'No social communication differences; normal learning.'],q10:[0,'No thyroid symptoms, head injury or prenatal alcohol.'],q11:[0,'No self-harm, identity disturbance or abandonment fears.']},
 leo:{q1:[1,'Yes: Leo is 8; symptoms from nursery.'],q2:[0,'No: constant since nursery.'],q2m:[0,'No elevated mood episodes.'],q3:[0,'No: home, school and swimming club.'],q4:[0,'Snores only with colds, no pauses, not sleepy in the day.'],q5:[0,'No staring spells.'],q6:[0,'Hearing and vision tests normal.'],q7:[0,'No worry-driven inattention; no trauma or safeguarding concerns.'],q8:[0,'Not applicable at 8; no medicines.'],q9:[0,'Reciprocal and socially engaged; behind in reading but improving with 1:1 help (educational psychology to advise).'],q10:[0,'No alcohol in pregnancy; no head injury; no thyroid features.'],q11:[0,'Not applicable at this age.']}};
function nodeById(id){for(var i=0;i<DDX.tree.length;i++)if(DDX.tree[i].id===id)return DDX.tree[i];}
function cardById(id){for(var i=0;i<DDX.cards.length;i++)if(DDX.cards[i].id===id)return DDX.cards[i];}
W.ddx=function(){var path=S.tr,cur='q1',out=null,h='<p>Answer each question for your patient. "Yes" opens the conditions to assess. Run it for a worked case to see the answers and reasoning.</p>';
 h+='<div class="ag-row"><button type="button" class="btn secondary ag-trcase">Run with '+esc(caseNow().name)+'</button><button type="button" class="btn secondary ag-trclr">Start again</button></div><ol class="ag-trail">';
 for(var i=0;i<path.length;i++){var nd=nodeById(path[i].id),ans=path[i].a;var nx=ans?nd.yes:nd.no;h+='<li><span class="ag-mini">'+esc(nd.q)+'</span> <strong>'+(ans?'Yes':'No')+'</strong>'+(path[i].why?'<br><span class="ag-mini">'+esc(path[i].why)+'</span>':'')+'</li>';
  if(typeof nx==='string')cur=nx;else{out=nx;cur=null;break;}}
 h+='</ol>';
 if(cur){var n=nodeById(cur);h+='<div class="ag-trq"><p class="ag-mini">Question '+(path.length+1)+' of up to '+DDX.tree.length+'</p><p class="ag-qq"><strong>'+esc(n.q)+'</strong></p><p class="ag-mini">'+esc(n.why)+'</p><div class="ag-opts two"><button type="button" class="ag-opt ag-tra" data-a="1">Yes</button><button type="button" class="ag-opt ag-tra" data-a="0">No</button></div></div>';}
 else if(out){h+='<div class="fb '+(out.c.length?'ok':'good')+'"><strong>'+esc(out.t)+'.</strong> '+esc(out.x)+'</div>';if(out.c.length)h+='<p><strong>Assess:</strong> '+out.c.map(function(c){return '<a href="#agc-'+c+'" class="ag-cardlink" data-c="'+c+'">'+esc(cardById(c).t)+'</a>';}).join(' \u00b7 ')+'</p>';
  if(path.length&&out.c.length)h+='<p class="ag-mini">Even after a "yes", continue through the rest of the tree in practice: more than one mimic or co-existing condition can apply. Tap "Start again" and answer the rest.</p>';}
 h+='<h4 class="ag-sub">15 conditions to rule in or out</h4><div class="ag-cards">';
 DDX.cards.forEach(function(c){h+='<details class="ag-card" id="agc-'+c.id+'"><summary><span>'+esc(c.t)+'</span><span class="ag-pill '+(c.co?'':'good')+'">'+(c.co?'Mimic or co-exists':'Mainly a mimic')+'</span></summary><dl><dt>Overlap</dt><dd>'+esc(c.over)+'</dd><dt>How it differs</dt><dd>'+esc(c.diff)+'</dd><dt>What to ask</dt><dd>'+esc(c.ask)+'</dd><dt>What to test or who to involve</dt><dd>'+esc(c.test)+'</dd><dt>Key point</dt><dd>'+esc(c.note)+'</dd></dl><p class="ag-mini">Source: '+esc(c.src)+'</p></details>';});
 h+='</div>';return wrap('Interactive','Differential decision tree',h);};
/* Step 14: treat-first ladder */
var LAD=[['Immediate risk and safeguarding','Suicidal intent, serious self-harm, risk to others or a safeguarding concern come first.','Clinical practice; NICE NG225 (self-harm).'],
 ['Psychosis or mania','Do not start ADHD medication during an acute psychotic or manic episode; if on it, stop it. Consider restarting after the episode has resolved.','NG87 1.7.19; methylphenidate SmPC 4.3 (psychotic symptoms, mania).'],
 ['Severe depression, suicidal tendencies, anorexia nervosa','Listed as contraindications in the methylphenidate SmPC. Stabilise first with the relevant specialist.','Concerta XL SmPC 4.3; NICE NG222/NG134.'],
 ['Substance misuse','Does not exclude ADHD. Be cautious with stimulants if there is a risk of diversion; avoid immediate-release or easily injected or snorted preparations if there is a risk of misuse or diversion. Coordinate with substance misuse services.','NG87 1.7.23, 1.7.24; coordination is clinical practice.'],
 ['Cardiac concerns','Cardiology opinion before starting if any 1.7.5 feature; paediatric hypertension specialist if BP consistently above the 95th centile.','NG87 1.7.5, 1.7.6.'],
 ['Anxiety, tics, autism and other conditions','Offer the same medication choices as other people with ADHD. Titrate more slowly and monitor more often with coexisting neurodevelopmental, mental or physical health conditions.','NG87 1.7.18, 1.7.28.'],
 ['Sleep, learning and social needs','Address in parallel within a holistic shared treatment plan that takes sleep and the impact of other conditions into account.','NG87 1.5.2.']];
W.treatfirst=function(){var h='<ol class="ag-lad">';LAD.forEach(function(l,i){h+='<li><details><summary><span class="ag-rung">'+(i+1)+'</span>'+esc(l[0])+'</summary><p>'+esc(l[1])+'</p><p class="ag-mini">Source: '+esc(l[2])+'</p></details></li>';});
 return wrap('Reference','What to address first',h+'</ol><p class="ag-mini">The order is a teaching summary built from the cited clauses; no single guideline sets out this exact ladder.</p>');};
/* Step 15: formulation */
W.formulate=function(){var cs=S.cs,c=caseNow(),mine=tally(cs),useC=!!S.fmc,t=useC?tally(cs,true):mine,thr=c.adult?5:6;
 var ia,hi;if(c.adult){ia=t.IA[1];hi=t.HI[1];}else{ia=t.any.IA;hi=t.any.HI;}
 var p=ia>=thr&&hi>=thr?['Combined presentation','6A05.2']:ia>=thr?['Predominantly inattentive presentation','6A05.0']:hi>=thr?['Predominantly hyperactive-impulsive presentation','6A05.1']:null;
 var h='<div class="ag-seg" role="group" aria-label="Which tallies to use"><button type="button" class="ag-segb ag-fm" data-v="0" aria-pressed="'+(!useC)+'">My Step 5 answers ('+mine.done+'/18)</button><button type="button" class="ag-segb ag-fm" data-v="1" aria-pressed="'+useC+'">Model answers</button></div>';
 h+='<div class="table-wrap"><table class="ag-tbl"><tbody><tr><th>A1 inattention (now)</th><td>'+ia+'/9 '+(ia>=thr?'\u2713':'\u2717')+'</td></tr><tr><th>A2 hyperactive-impulsive (now)</th><td>'+hi+'/9 '+(hi>=thr?'\u2713':'\u2717')+'</td></tr>'+
  (c.adult?'<tr><th>Childhood (before 12)</th><td>'+t.IA[0]+' inattentive, '+t.HI[0]+' hyperactive-impulsive: several present '+(t.IA[0]+t.HI[0]>=3?'\u2713':'?')+'</td></tr>':'')+
  '<tr><th>B onset</th><td>'+esc(c.notes[6])+'</td></tr><tr><th>C settings</th><td>'+esc(c.notes[7])+'</td></tr><tr><th>D impairment</th><td>'+esc(c.notes[8])+'</td></tr><tr><th>E alternatives</th><td>'+esc(c.notes[13])+'</td></tr></tbody></table></div>';
 h+='<div class="fb '+(p?'good':'ok')+'"><strong>'+(p?'Presentation: '+p[0]+' \u00b7 ICD-11 '+p[1]:'Threshold not met with these answers')+'.</strong> '+(p?'Threshold '+thr+'+ per domain ('+(c.adult?'17 and over':'under 17')+').':'Check your Step 5 answers or switch to the model answers.')+'</div>';
 var sv=S.sev[cs];h+='<p><strong>Choose severity:</strong></p><div class="ag-opts">';['Mild','Moderate','Severe'].forEach(function(l,j){var c='';if(sv!=null){if(j===1)c=' good';else if(j===sv)c=' bad';}h+='<button type="button" class="ag-opt ag-sev'+c+'" data-v="'+j+'" aria-pressed="'+(sv===j)+'">'+l+'</button>';});h+='</div>';
 if(sv!=null)h+='<div class="fb '+(sv===1?'good':'bad')+'"><strong>'+(sv===1?'Agreed: moderate.':'The model answer is moderate.')+'</strong> '+(cs==='sam'?'Sam has a few symptoms above threshold for inattention and impairment across several domains (two dismissals, debt, fines), but not marked impairment in every area.':'Leo has symptoms beyond the threshold in both domains with impairment in learning, social and family life, but not the marked, pervasive impairment of the severe category.')+' Severity is a clinical judgement.</div>';
 return wrap('Formulation','Criteria, presentation, severity, code',h);};
/* Step 16: decision */
var DEC=[{s:'Sam (with all the evidence gathered in this guide)',a:0,e:'All criteria A\u2013E met with collateral, records and a differential considered.'},
 {s:'Adult, 22: clear current symptoms; no informant, no records; drinking heavily most days for 3 years.',a:2,e:'Onset not established and heavy alcohol use may explain symptoms. Address alcohol, seek collateral, re-assess.'},
 {s:'Child, 10: inattentive at school only; parents, club and grandparents see none; educational psychology finds a specific reading difficulty.',a:1,e:'One setting only and a better explanation: the reading difficulty. Explain this and plan learning support.'}];
W.decide=function(){var h='';DEC.forEach(function(d,i){var a=S.dec[i];h+='<div class="ag-tri ag-dec" data-i="'+i+'"><p><strong>'+(i+1)+'.</strong> '+esc(d.s)+'</p><div class="ag-opts">';
 ['ADHD','Not ADHD','Uncertain: more information'].forEach(function(o,j){var c='';if(a!=null){if(j===d.a)c=' good';else if(j===a)c=' bad';}h+='<button type="button" class="ag-opt sm'+c+'" data-j="'+j+'" aria-pressed="'+(a===j)+'">'+o+'</button>';});
 h+='</div><div class="ag-fb" aria-live="polite">'+(a!=null?fbHTML(a===d.a,d.e):'')+'</div></div>';});return wrap('Practice','Make the decision',h);};
/* Step 17: report */
function reportText(){var c=caseNow(),n=c.notes,t=tally(c.id,true);var L=[];
 L.push('ADHD ASSESSMENT REPORT (TRAINING EXAMPLE, FICTIONAL CASE)','Name: '+c.label,'');
 L.push('1. Reason for referral and sources',n[1],n[2],'');L.push('2. Presenting difficulties',n[4],'');
 L.push('3. Symptom review',c.adult?('Childhood (before 12): '+t.IA[0]+'/9 inattentive, '+t.HI[0]+'/9 hyperactive-impulsive. Current (last 6+ months): '+t.IA[1]+'/9 inattentive, '+t.HI[1]+'/9 hyperactive-impulsive. Threshold at 17+: 5 per domain.'):('Inattentive '+t.any.IA+'/9 and hyperactive-impulsive '+t.any.HI+'/9 (home and school combined). Threshold under 17: 6 per domain.'),'');
 SX.forEach(function(s){var e=c.ev[s.id];if(e[0][1]||e[1][1])L.push('  - '+s.t+': '+(e[0][1]?e[0][0]:e[1][0]));});L.push('');
 L.push('4. Onset, settings and impairment',n[6],n[7],n[8],'');L.push('5. Background history',n[9],'');L.push('6. Mental state and physical baseline',n[10],n[11],'');
 L.push('7. Informants',n[12],'');L.push('8. Differential diagnosis',n[13],'');L.push('9. Coexisting conditions',n[14],'');L.push('10. Formulation and diagnosis',n[15],n[16],'');
 L.push('11. Plan and recommendations',n[18],'');L.push('12. Risk and safety-netting','Risk assessed and documented. Advice given on who to contact if things get worse. Driving discussed (NG87 1.4.3).','',n[19]);
 return L.join('\n');}
W.report=function(){return wrap('Template','Report built from '+esc(caseNow().name)+'\u2019s notes','<label class="ag-mini" for="ag-rep">Editable draft (changes are not saved)</label><textarea id="ag-rep" class="ag-rep" rows="14">'+esc(reportText())+'</textarea><div class="ag-row"><button type="button" class="btn secondary ag-repcp">Copy</button><button type="button" class="btn secondary ag-repdl">Download .txt</button></div><p class="ag-mini ag-repmsg" aria-live="polite"></p>');};

/* ---------- step renderer ---------- */
function visHTML(st){var v=st.vis,h='';
 if(v.img)h='<figure class="ag-vis"><picture><source srcset="images/'+v.img+'.webp" type="image/webp"><img src="images/'+v.img+'.jpg" alt="'+esc(v.alt)+'" width="1152" height="864" loading="lazy" decoding="async"></picture><figcaption>'+AICAP+'</figcaption></figure>';
 else h='<figure class="ag-vis ag-vsvg">'+SVG[v.svg]()+'<figcaption>'+esc(CAP[v.svg]||'')+'</figcaption></figure>';
 if(st.svg2)h+='<figure class="ag-vis ag-vsvg">'+SVG[st.svg2]()+'<figcaption>'+esc(CAP[st.svg2]||'')+'</figcaption></figure>';
 return h;}
function notesHTML(st){var c=caseNow(),h='<div class="ag-case"><div class="ag-case-h"><span class="ag-tag">Worked case</span><strong>'+esc(c.label)+'</strong></div>';
 if(st.n===1)h+='<p>'+esc(c.intro)+'</p>';
 h+='<p class="ag-now"><strong>Step '+st.n+' notes:</strong> '+esc(c.notes[st.n]||'')+'</p>';
 if(st.n>1){h+='<details class="ag-run"><summary>Running notes so far (steps 1\u2013'+(st.n-1)+')</summary><ol>';for(var k=1;k<st.n;k++)h+='<li value="'+k+'"><strong>'+esc(STEPS[k-1].t)+':</strong> '+esc(c.notes[k])+'</li>';h+='</ol></details>';}
 return h+'</div>';}
function render(focus){var root=$('#ag-app');if(!root)return;var st=STEPS[S.step-1],ck=S.ck[st.n]||{};
 var h='<div class="ag-top" id="ag-top"><div class="ag-casesw" role="group" aria-label="Worked case"><span class="ag-mini">Worked case:</span>';
 Object.keys(CASES).forEach(function(k){h+='<button type="button" class="ag-segb ag-cs" data-c="'+k+'" aria-pressed="'+(S.cs===k)+'">'+esc(CASES[k].short||CASES[k].label)+'</button>';});h+='</div>';
 h+='<div class="ag-prog"><div class="ag-prog-t"><strong>Step '+st.n+' of '+N+'</strong><span>'+esc(st.t)+'</span></div><div class="ag-bar" role="progressbar" aria-valuemin="1" aria-valuemax="'+N+'" aria-valuenow="'+st.n+'" aria-label="Guide progress"><span style="width:'+Math.round(st.n/N*100)+'%"></span></div></div>';
 h+='<nav class="ag-dots" aria-label="Guide steps"><ol>';STEPS.forEach(function(s){var dn=S.ck[s.n]&&Object.keys(S.ck[s.n]).filter(function(k){return S.ck[s.n][k];}).length>=s.chk.length;h+='<li><button type="button" class="ag-dot'+(dn?' dn':'')+'" data-n="'+s.n+'" aria-current="'+(s.n===st.n?'step':'false')+'" title="'+esc(s.t)+'"><span class="ag-dn">'+s.n+'</span><span class="ag-dl">'+esc(s.t)+'</span></button></li>';});h+='</ol></nav></div>';
 h+='<article class="ag-step" aria-labelledby="ag-h"><div class="ag-step-h"><span class="kicker">Step '+st.n+' of '+N+'</span><h2 id="ag-h" tabindex="-1">'+esc(st.t)+'</h2><p class="ag-sum">'+esc(st.s)+'</p></div>';
 h+='<div class="ag-grid"><div class="ag-main">'+visHTML(st)+'<div class="ag-teach">'+st.teach+'</div></div><aside class="ag-side">'+notesHTML(st)+'</aside></div>';
 (st.w||[]).forEach(function(w){h+=W[w]();});
 if(st.dic&&st.dic.length){h+='<div class="ag-w"><div class="ag-w-h"><span class="ag-tag">Judgement</span><h3>Does it count?</h3></div><div class="ag-dics">';st.dic.forEach(function(d,i){h+=dicHTML(st.n+':'+i,d);});h+='</div></div>';}
 if(st.q&&st.q.length){h+='<div class="ag-w"><div class="ag-w-h"><span class="ag-tag">What would you do?</span><h3>Check your understanding</h3></div>';st.q.forEach(function(q,i){h+=mcqHTML(st.n+':'+i,q);});h+='</div>';}
 h+='<div class="ag-w ag-cl"><div class="ag-w-h"><span class="ag-tag">Checklist</span><h3>Before you move on</h3></div><ul class="ag-cklist">';st.chk.forEach(function(c,i){h+='<li><label class="ag-chk"><input type="checkbox" class="ag-ck" data-i="'+i+'"'+(ck[i]?' checked':'')+'> '+esc(c)+'</label></li>';});h+='</ul></div>';
 h+='<details class="xp-src ag-src"><summary>Sources for this step</summary><p>'+esc(st.src)+'</p></details>';
 h+='<div class="ag-nav"><button type="button" class="btn secondary ag-back"'+(st.n===1?' disabled':'')+'>\u2190 Back</button><span class="ag-mini">Step '+st.n+' of '+N+'</span><button type="button" class="btn ag-next">'+(st.n===N?'Finish: print checklist':'Next: '+esc(STEPS[st.n].t)+' \u2192')+'</button></div></article>';
 root.innerHTML=h;
 var cur=$('.ag-dot[aria-current="step"]',root);if(cur&&cur.scrollIntoView){var dots=$('.ag-dots',root);dots.scrollLeft=Math.max(0,cur.offsetLeft-dots.clientWidth/2+cur.clientWidth/2);}
 if(focus){var t=$('#ag-top');if(t)t.scrollIntoView({block:'start'});var hh=$('#ag-h');if(hh)hh.focus({preventScroll:true});}}
function go(n){S.step=Math.max(1,Math.min(N,n));save();render(true);}
function rerender(){/* re-render, keep scroll position and keyboard focus on the equivalent control */
 var y=window.scrollY,root=$('#ag-app'),ae=document.activeElement,idx=-1;
 if(root&&ae&&root.contains(ae)){idx=$$('button,input,textarea,summary,a[href]',root).indexOf(ae);}
 render(false);window.scrollTo(0,y);
 if(idx>=0){var el=$$('button,input,textarea,summary,a[href]',root)[idx];if(el)el.focus({preventScroll:true});}}

/* ---------- export ---------- */
function checklistText(){var L=['ADHD ASSESSMENT CHECKLIST (19 steps)','From the ADHD learning site Assessment Guide. Educational aid; follow your service protocol.',''];
 STEPS.forEach(function(s){L.push('STEP '+s.n+'. '+s.t.toUpperCase());s.chk.forEach(function(c,i){L.push('  ['+((S.ck[s.n]||{})[i]?'x':' ')+'] '+c);});L.push('');});
 L.push('Diagnosis only by an appropriately qualified specialist (NICE NG87 1.3.1).');return L.join('\n');}
function notesText(){var c=caseNow(),L=['WORKED CASE NOTES: '+c.label+' (fictional)',c.intro,''];STEPS.forEach(function(s){L.push(s.n+'. '+s.t+': '+(c.notes[s.n]||''));});return L.join('\n');}
function download(name,text){var b=new Blob([text],{type:'text/plain;charset=utf-8'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);}
function printChecklist(){var p=$('#ag-print');if(!p){p=document.createElement('div');p.id='ag-print';document.body.appendChild(p);}
 var h='<h1>ADHD assessment checklist</h1><p>Educational aid from the Assessment Guide. Diagnosis only by an appropriately qualified specialist (NICE NG87 1.3.1).</p>';
 STEPS.forEach(function(s){h+='<h2>'+s.n+'. '+esc(s.t)+'</h2><ul>';s.chk.forEach(function(c,i){h+='<li>'+((S.ck[s.n]||{})[i]?'\u2611':'\u2610')+' '+esc(c)+'</li>';});h+='</ul>';});
 p.innerHTML=h;document.body.classList.add('ag-printing');window.print();setTimeout(function(){document.body.classList.remove('ag-printing');},500);}

/* ---------- events (delegated) ---------- */
function onClick(e){var b=e.target.closest('button,a.ag-cardlink,input');if(!b||!b.closest('#ag')) return;var st=STEPS[S.step-1],cs=S.cs;
 if(b.matches('.ag-next')){if(st.n===N)printChecklist();else go(st.n+1);return;}
 if(b.matches('.ag-back')){go(st.n-1);return;}
 if(b.matches('.ag-dot')){go(+b.dataset.n);return;}
 if(b.matches('.ag-cs')){S.cs=b.dataset.c;S.tr=[];save();rerender();return;}
 if(b.matches('.ag-print-btn')){printChecklist();return;}
 if(b.matches('.ag-dl-ck')){download('adhd-assessment-checklist.txt',checklistText());return;}
 if(b.matches('.ag-dl-notes')){download('adhd-case-notes-'+cs+'.txt',notesText());return;}
 if(b.matches('.ag-reset')){if(confirm('Reset all Assessment Guide answers and ticks on this device?')){S=fill({});save();render(true);}return;}
 var q=b.closest('.ag-q');if(q&&b.matches('.ag-opt')){S.q[q.dataset.key]=+b.dataset.i;save();rerender();return;}
 var d=b.closest('.ag-dic');if(d&&b.matches('.ag-opt')){S.dc[d.dataset.key]=+b.dataset.v;save();rerender();return;}
 if(b.closest('.ag-tri')&&!b.closest('.ag-dis')&&!b.closest('.ag-dec')&&b.matches('.ag-opt')){S.tri[b.closest('.ag-tri').dataset.i]=+b.dataset.j;save();rerender();return;}
 if(b.closest('.ag-dis')&&b.matches('.ag-opt')){S.dis[b.closest('.ag-dis').dataset.i]=+b.dataset.j;save();rerender();return;}
 if(b.closest('.ag-dec')&&b.matches('.ag-opt')){S.dec[b.closest('.ag-dec').dataset.i]=+b.dataset.j;save();rerender();return;}
 if(b.matches('.ag-asrs .ag-segb')){var v=S.as.v||[null,null,null,null,null,null];v[+b.dataset.i]=+b.dataset.j;S.as.v=v;save();rerender();return;}
 if(b.matches('.ag-asrs-sam')){S.as.v=[3,3,4,3,3,2];save();rerender();return;}
 if(b.matches('.ag-asrs-clr')){S.as.v=null;save();rerender();return;}
 if(b.matches('.ag-sxb')){S.sx[cs]=+b.dataset.k;save();rerender();return;}
 if(b.matches('.ag-sxprev')){S.sx[cs]=Math.max(0,(S.sx[cs]||0)-1);save();rerender();return;}
 if(b.matches('.ag-sxnext')){S.sx[cs]=Math.min(17,(S.sx[cs]||0)+1);save();rerender();return;}
 if(b.matches('.ag-iv')){var id=SX[S.sx[cs]||0].id,a=ivAns(cs,id).slice();a[+b.dataset.col]=+b.dataset.v;S.iv[cs][id]=a;delete S.rv[cs+':'+id];save();rerender();return;}
 if(b.matches('.ag-sxchk')){S.rv[cs+':'+SX[S.sx[cs]||0].id]=1;save();rerender();return;}
 if(b.matches('.ag-rvall')){SX.forEach(function(s){S.rv[cs+':'+s.id]=1;});save();rerender();return;}
 if(b.matches('.ag-ivclr')){S.iv[cs]={};Object.keys(S.rv).forEach(function(k){if(k.indexOf(cs+':')===0)delete S.rv[k];});save();rerender();return;}
 if(b.matches('.ag-st')){var sv=S.st[cs]||[];sv[+b.dataset.i]=!sv[+b.dataset.i];S.st[cs]=sv;delete S.st[cs+':c'];save();rerender();return;}
 if(b.matches('.ag-stchk')){S.st[cs+':c']=1;save();rerender();return;}
 if(b.matches('.ag-wf .ag-segb')){var wv=S.wf.v||WF.map(function(){return [null,null,null];});var val=b.dataset.v==='NA'?'NA':+b.dataset.v;wv[+b.dataset.i][+b.dataset.k]=val;S.wf.v=wv;save();rerender();return;}
 if(b.matches('.ag-wfp')){S.wf.v=JSON.parse(JSON.stringify(WFP[b.dataset.c]));save();rerender();return;}
 if(b.matches('.ag-wfclr')){S.wf.v=null;save();rerender();return;}
 if(b.matches('.ag-blage')){S.bl.age=b.dataset.v;S.bl.f=S.bl.f.filter(function(i){return i!==8;});save();rerender();return;}
 if(b.matches('.ag-trcase')){var tc=TCASE[cs],path=[],cur='q1';while(cur){var nd=nodeById(cur),ans=tc[cur];path.push({id:cur,a:ans[0],why:ans[1]});var nx=ans[0]?nd.yes:nd.no;cur=typeof nx==='string'?nx:null;}S.tr=path;save();rerender();return;}
 if(b.matches('.ag-trclr')){S.tr=[];save();rerender();return;}
 if(b.matches('.ag-tra')){var last=S.tr.length?S.tr[S.tr.length-1]:null,cid='q1';if(last){var ln=nodeById(last.id),nx2=last.a?ln.yes:ln.no;cid=typeof nx2==='string'?nx2:null;}if(cid){S.tr.push({id:cid,a:+b.dataset.a});save();rerender();}return;}
 if(b.matches('a.ag-cardlink')){e.preventDefault();var cd=document.getElementById('agc-'+b.dataset.c);if(cd){cd.open=true;cd.scrollIntoView({block:'center'});cd.querySelector('summary').focus();}return;}
 if(b.matches('.ag-fm')){S.fmc=b.dataset.v==='1';save();rerender();return;}
 if(b.matches('.ag-sev')){S.sev[cs]=+b.dataset.v;save();rerender();return;}
 if(b.matches('.ag-repcp')){var ta=$('#ag-rep');var msg=$('.ag-repmsg');(navigator.clipboard?navigator.clipboard.writeText(ta.value):Promise.reject()).then(function(){msg.textContent='Copied.';},function(){ta.select();msg.textContent='Select-all done: press Ctrl/Cmd+C to copy.';});return;}
 if(b.matches('.ag-repdl')){download('adhd-report-'+cs+'.txt',$('#ag-rep').value);return;}
}
function onChange(e){var t=e.target;if(!t.closest||!t.closest('#ag'))return;var st=STEPS[S.step-1];
 if(t.matches('.ag-ck')){S.ck[st.n]=S.ck[st.n]||{};S.ck[st.n][t.dataset.i]=t.checked;save();var dot=$('.ag-dot[data-n="'+st.n+'"]');if(dot)dot.classList.toggle('dn',Object.keys(S.ck[st.n]).filter(function(k){return S.ck[st.n][k];}).length>=st.chk.length);return;}
 if(t.matches('.ag-bl')){S.bl[t.dataset.k]=t.value;save();var o=$('.ag-blout');if(o)o.innerHTML=blOut(S.bl);var fg=$('.ag-w .ag-fig');if(fg&&S.bl.age==='adult')fg.innerHTML=SVG.bpchart(S.bl.sbp,S.bl.dbp);return;}
 if(t.matches('.ag-blf')){var i=+t.dataset.i,f=S.bl.f;if(t.checked&&f.indexOf(i)<0)f.push(i);if(!t.checked)S.bl.f=f.filter(function(x){return x!==i;});save();$('.ag-blout').innerHTML=blOut(S.bl);return;}
 if(t.matches('.ag-blmed')){S.bl.med=t.checked;save();$('.ag-blout').innerHTML=blOut(S.bl);return;}
 if(t.matches('.ag-blc95')){S.bl.c95=t.checked;save();$('.ag-blout').innerHTML=blOut(S.bl);return;}
}
function init(){if(!$('#ag-app'))return;render(false);document.addEventListener('click',onClick);document.addEventListener('change',onChange);
 document.addEventListener('input',function(e){if(e.target.matches&&e.target.matches('.ag-bl'))onChange(e);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.AG={go:go,state:function(){return S;},tally:tally,reportText:reportText};
})();
