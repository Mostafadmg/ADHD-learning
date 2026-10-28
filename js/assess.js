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
function mcqHTML(key,it){var ans=S.q[key];var h='<div class="ag-q" data-key="'+key+'"><p class="ag-qq"><strong class="ag-qk">Check:</strong> '+esc(it.q)+'</p><div class="ag-opts">';
 it.o.forEach(function(o,i){var cls='';if(ans!=null){if(i===it.a)cls=' good';else if(i===ans)cls=' bad';}h+='<button type="button" class="ag-opt'+cls+'" data-i="'+i+'" aria-pressed="'+(ans===i)+'">'+esc(o)+'</button>';});
 h+='</div><div class="ag-fb" aria-live="polite">'+(ans!=null?fbHTML(ans===it.a,it.e,it.o[it.a]):'')+'</div></div>';return h;}
function fbHTML(ok,e,right){return '<div class="fb '+(ok?'good':'bad')+'"><p class="fb-head"><strong>'+(ok?'Correct.':'Not quite.')+'</strong>'+(!ok&&right?' The best answer is <b>'+esc(right)+'</b>.':'')+'</p><p class="fb-why"><span>Why</span>'+esc(e)+'</p></div>';}
function dicHTML(key,it){var ans=S.dc[key];var h='<div class="ag-dic" data-key="'+key+'"><div class="ag-dic-h"><span class="ag-tag">Does it count?</span></div><p>'+esc(it.s)+'</p><div class="ag-opts two">';
 [[1,'Counts'],[0,'Doesn\u2019t count']].forEach(function(o){var cls='';if(ans!=null){if(o[0]===it.a)cls=' good';else if(o[0]===ans)cls=' bad';}h+='<button type="button" class="ag-opt'+cls+'" data-v="'+o[0]+'" aria-pressed="'+(ans===o[0])+'">'+o[1]+'</button>';});
 h+='</div><div class="ag-fb" aria-live="polite">'+(ans!=null?fbHTML(ans===it.a,'Deciding rule: '+it.r+'. '+it.e,it.a?'Counts':'Doesn\u2019t count'):'')+'</div></div>';return h;}
function wrap(kicker,title,body){return '<div class="ag-w"><div class="ag-w-h"><span class="ag-tag">'+kicker+'</span><h3>'+title+'</h3></div>'+body+'</div>';}
function caseNow(){return CASES[S.cs];}

/* ---------- widgets ---------- */
var W={};
/* Step 1: triage sorter */
var TRI=[{s:'Child, 7. Moderate problems at home and school for 2 months. No support tried yet.',a:0,e:'The problems are moderate, recent and no support has been tried yet. NICE NG87 1.2.7 says consider watchful waiting for up to 10 weeks and offer group-based ADHD-focused parent support, which should not wait for a diagnosis. Direct referral is for severe impairment (1.2.8), and the adult routes do not apply to a child. Refer to secondary care if problems persist with at least moderate impairment.'},
 {s:'Child, 9. Excluded from school twice this term; has run into the road twice. Severe impairment.',a:1,e:'Two school exclusions and running into the road twice show severe impairment and real danger. NICE NG87 1.2.8: with severe impairment, refer directly to secondary care (a child psychiatrist, paediatrician or specialist ADHD CAMHS). Watchful waiting is for less severe problems (1.2.7) and would leave the child at risk here.'},
 {s:'Adult, 26. Lifelong problems confirmed by mother, moderate impairment at work, no other diagnosis explains them.',a:2,e:'Symptoms that began in childhood and persisted (confirmed by the mother), are not explained by another diagnosis, and cause moderate impairment meet NICE NG87 1.2.10: refer to a mental health specialist trained in diagnosing and treating ADHD. The general adult psychiatry route (1.2.11) is for adults already treated for ADHD as children. Watchful waiting with parent support is a child pathway.'},
 {s:'Adult, 19. Treated for ADHD as a child; symptoms persist and need ongoing treatment.',a:3,e:'NICE NG87 1.2.11: adults treated for ADHD as children whose symptoms continue with at least moderate impairment should be referred to general adult psychiatric services for assessment (in many areas this is the adult ADHD service). The new-diagnosis route (1.2.10) is for adults without a childhood diagnosis. Nothing here suggests urgent risk, and the child pathways no longer apply at 19.'},
 {s:'Young person, 14, referred for ADHD. The letter mentions self-harm last week with suicidal intent.',a:4,e:'Self-harm last week with suicidal intent is an immediate safety issue, so it comes before any ADHD route. Follow your urgent risk and safeguarding procedures now (clinical practice; see NICE NG225 on self-harm). Sending this into a routine ADHD pathway would delay urgent care. The ADHD assessment is not cancelled; it follows once the young person is safe.'}];
var TRO=['Watchful waiting \u226410 weeks + parent support','Refer directly to specialist','Refer to adult ADHD assessment','General adult psychiatry','Urgent risk response first'];
W.triage=function(){var h='<p>Choose the best route for each referral.</p>';
 TRI.forEach(function(t,i){var a=S.tri[i];h+='<div class="ag-tri" data-i="'+i+'"><p><strong>'+(i+1)+'.</strong> '+esc(t.s)+'</p><div class="ag-opts">';
  TRO.forEach(function(o,j){var c='';if(a!=null){if(j===t.a)c=' good';else if(j===a)c=' bad';}h+='<button type="button" class="ag-opt sm'+c+'" data-j="'+j+'" aria-pressed="'+(a===j)+'">'+esc(o)+'</button>';});
  h+='</div><div class="ag-fb" aria-live="polite">'+(a!=null?fbHTML(a===t.a,t.e,TRO[t.a]):'')+'</div></div>';});
 return wrap('Practice','Triage the referral',h);};
/* Step 2: ASRS-style Part A screen */
var ASRS=['Trouble finishing the final details of a project once the hard parts are done','Difficulty getting things in order for a task that needs organising','Problems remembering appointments or obligations','Avoiding or delaying starting tasks that need a lot of thought','Fidgeting or squirming with hands or feet when sitting for a long time','Feeling overly active, as if driven by a motor'];
var FREQ=['Never','Rarely','Sometimes','Often','Very often'];
W.asrs=function(){var v=S.as.v||[null,null,null,null,null,null];var h='<p>Rate how often over the past 6 months (themes paraphrased; use the official WHO form in practice).</p><div class="ag-asrs">';
 ASRS.forEach(function(t,i){h+='<div class="ag-asrs-row"><p><strong>'+(i+1)+'.</strong> '+esc(t)+' <span class="ag-mini">(shaded from '+(i<3?'Sometimes':'Often')+')</span></p><div class="ag-seg" role="group" aria-label="Item '+(i+1)+' frequency">';
  FREQ.forEach(function(f,j){var shaded=j>=(i<3?2:3);h+='<button type="button" class="ag-segb'+(shaded?' sh':'')+'" data-i="'+i+'" data-j="'+j+'" aria-pressed="'+(v[i]===j)+'">'+f+'</button>';});h+='</div></div>';});
 h+='</div><div class="ag-row"><button type="button" class="btn secondary ag-asrs-sam">Fill with Sam\u2019s answers</button><button type="button" class="btn secondary ag-asrs-clr">Clear</button></div><div class="ag-asrs-out" aria-live="polite">'+asrsOut(v)+'</div>';
 return wrap('Tool','ASRS v1.1 Part A: a screen only',h);};
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
 return wrap('Tool','Impairment by domain (WFIRS-style rule)',h);};
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
 return wrap('Tool','Physical baseline decision',h);};
function blOut(b){var o=[],f=b.f.slice();if(b.age==='adult'&&+b.sbp&&+b.dbp){if(+b.sbp>=180||+b.dbp>=120)o.push(['bad','Clinic BP 180/120 or higher: follow NICE NG136 for same-day referral criteria and do not start ADHD medication until assessed.']);else if(+b.sbp>=140||+b.dbp>=90)o.push(['ok','Clinic BP 140/90 or higher: offer ABPM (or HBPM) to confirm hypertension (NICE NG136 1.2.3\u20131.2.4). If hypertension is confirmed, that is a 1.7.5 feature: refer for a cardiology opinion before starting.']);}
 if(f.length)o.push(['bad','1.7.5 feature present: refer for a cardiology opinion before starting ADHD medication (NG87 1.7.5).']);
 if(b.age==='child'&&b.c95)o.push(['bad','Refer to a paediatric hypertension specialist before starting ADHD medication (NG87 1.7.6).']);
 if(b.med)o.push(['ok','A medicine that may increase cardiac risk: an ECG is indicated before starting (NG87 1.7.4).']);
 if(+b.hr>120)o.push(['ok','Resting heart rate above 120 bpm: recheck and assess the cause before starting. (On treatment, NG87 1.8.11 says reduce the dose and refer if HR is over 120 on 2 occasions.)']);
 if(!o.length)o.push(['good','No 1.7.5 features: an ECG is not needed before starting stimulants, atomoxetine or guanfacine (NG87 1.7.4). Record height, weight, pulse and BP as the baseline.']);
 return o.map(function(x){return '<div class="fb '+x[0]+'">'+esc(x[1])+'</div>';}).join('');}
/* Step 12: informant disagreement */
var DIS=[{s:'Leo: mother says he loses things constantly; teacher says no more than others.',o:['Mother is exaggerating','The setting differs: school has a tray and routines, home does not','Leo cannot have ADHD','Teacher does not know him'],a:1,e:'School gives Leo a tray, routines and reminders, and that structure can hide a symptom that shows clearly at home. So the difference may be the setting, not anyone’s honesty: saying the mother exaggerates or the teacher does not know him blames a person without evidence. One setting not seeing it does not rule ADHD out. The symptom can still count if it is frequent and impairing at home, though ADHD overall still needs symptoms in 2 or more settings (DSM-5-TR criterion C).'},
 {s:'Sam rates talking too much as a big problem; partner says it is not an issue.',o:['Count it because Sam says so','Ask for specific examples and the impact; count it only if it causes impairment','Ignore the partner','Repeat the rating scale'],a:1,e:'A symptom counts only if it is frequent and causes impairment, and specific examples are how you test that. Here the examples showed no real impact, so it does not count. Counting it because Sam says so, or ignoring the partner, relies on one view only. Repeating the scale just collects the same opinion again.'},
 {s:'A 13-year-old: the maths teacher reports severe inattention; four other teachers report none.',o:['Diagnose ADHD','Look at the maths lessons: difficulty level, relationship, anxiety about maths','Exclude all learning problems','Ask for more rating scales from the maths teacher'],a:1,e:'Severe inattention in one subject only, while four other teachers see none, points to something about maths: the level of difficulty, a specific learning difficulty, anxiety about maths or the relationship with the teacher. ADHD needs symptoms across settings (DSM-5-TR criterion C), so diagnosing ignores the other four teachers. Excluding learning problems is the opposite of what is needed, and more scales from the same teacher add no new view.'}];
W.disagree=function(){var h='';DIS.forEach(function(d,i){var a=S.dis[i];h+='<div class="ag-tri ag-dis" data-i="'+i+'"><p><strong>'+(i+1)+'.</strong> '+esc(d.s)+'</p><div class="ag-opts">';
 d.o.forEach(function(o,j){var c='';if(a!=null){if(j===d.a)c=' good';else if(j===a)c=' bad';}h+='<button type="button" class="ag-opt sm'+c+'" data-j="'+j+'" aria-pressed="'+(a===j)+'">'+esc(o)+'</button>';});
 h+='</div><div class="ag-fb" aria-live="polite">'+(a!=null?fbHTML(a===d.a,d.e,d.o[d.a]):'')+'</div></div>';});return wrap('Practice','When informants disagree',h);};
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
var DEC=[{s:'Sam (with all the evidence gathered in this guide)',a:0,e:'All five DSM-5-TR criteria (A\u2013E) are met: enough current symptoms, childhood onset shown by school reports and the mother\u2019s account, several settings, clear impairment, and other explanations such as low mood, anxiety and alcohol considered and found not to explain the picture. That is the evidence a safe diagnosis needs (NICE NG87 1.3.1, 1.3.3). \u201cUncertain\u201d would fit only if a key piece were missing, and \u201cNot ADHD\u201d ignores evidence that meets every criterion.'},
 {s:'Adult, 22: clear current symptoms; no informant, no records; drinking heavily most days for 3 years.',a:2,e:'Onset is not established (no informant or records), and heavy daily drinking for 3 years can itself cause poor attention and impulsivity (DSM-5-TR criterion E). So you cannot diagnose yet, but you should not exclude ADHD on uncertain onset alone (NICE NG87 1.3.3). Address the alcohol use, seek collateral and records, then re-assess once drinking is reduced or stopped.'},
 {s:'Child, 10: inattentive at school only; parents, club and grandparents see none; educational psychology finds a specific reading difficulty.',a:1,e:'Symptoms appear only at school, while parents, club and grandparents see none, so the settings rule is not met (DSM-5-TR criterion C; NICE NG87 1.3.3). The specific reading difficulty is a better explanation (criterion E). “Uncertain” is not needed because the evidence is complete and consistent. Explain the finding and plan learning support.'}];
W.decide=function(){var h='';DEC.forEach(function(d,i){var a=S.dec[i];h+='<div class="ag-tri ag-dec" data-i="'+i+'"><p><strong>'+(i+1)+'.</strong> '+esc(d.s)+'</p><div class="ag-opts">';
 ['ADHD','Not ADHD','Uncertain: more information'].forEach(function(o,j){var c='';if(a!=null){if(j===d.a)c=' good';else if(j===a)c=' bad';}h+='<button type="button" class="ag-opt sm'+c+'" data-j="'+j+'" aria-pressed="'+(a===j)+'">'+o+'</button>';});
 h+='</div><div class="ag-fb" aria-live="polite">'+(a!=null?fbHTML(a===d.a,d.e,['ADHD','Not ADHD','Uncertain: more information'][d.a]):'')+'</div></div>';});return wrap('Practice','Make the decision',h);};
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
function visHTML(st){var v=st.vis,h='',teaching=window.AGTEACH;
 if(teaching){
  var asset=teaching.images[st.n],draw=teaching.figures,cap=teaching.captions;
  if(asset)h='<figure class="ag-vis'+(asset[3]>asset[2]?' ag-ai-portrait':'')+'" data-title="'+esc(asset[5]||st.t)+'"><picture><img src="images/'+asset[0]+'.png" alt="'+esc(asset[1])+'" width="'+(asset[2]||1448)+'" height="'+(asset[3]||1086)+'" decoding="async"></picture><figcaption>'+(asset[4]?esc(asset[4])+'<br> ':'')+AICAP+'</figcaption></figure>';
  else h='<figure class="ag-vis ag-vsvg">'+draw[v.svg]()+'<figcaption>'+esc(cap[v.svg])+'</figcaption></figure>';
  if(st.svg2)h+='<figure class="ag-vis ag-vsvg">'+draw[st.svg2]()+'<figcaption>'+esc(cap[st.svg2])+'</figcaption></figure>';
  return h;
 }
 if(v.img)h='<figure class="ag-vis"><picture><source srcset="images/'+v.img+'.webp" type="image/webp"><img src="images/'+v.img+'.jpg" alt="'+esc(v.alt)+'" width="1152" height="864" decoding="async"></picture><figcaption>'+AICAP+'</figcaption></figure>';
 else h='<figure class="ag-vis ag-vsvg">'+SVG[v.svg]()+'<figcaption>'+esc(CAP[v.svg]||'')+'</figcaption></figure>';
 if(st.svg2)h+='<figure class="ag-vis ag-vsvg">'+SVG[st.svg2]()+'<figcaption>'+esc(CAP[st.svg2]||'')+'</figcaption></figure>';
 return h;}
function notesHTML(st){var c=caseNow(),h='<div class="ag-case"><div class="ag-case-h"><span class="ag-tag">Worked case</span><strong>'+esc(c.label)+'</strong></div>';
 if(st.n===1)h+='<p>'+esc(c.intro)+'</p>';
 h+='<p class="ag-now"><strong>Step '+st.n+' notes:</strong> '+esc(c.notes[st.n]||'')+'</p>';
 if(st.n>1){h+='<details class="ag-run"><summary>Running notes so far ('+(st.n===2?'step 1':'steps 1\u2013'+(st.n-1))+')</summary><ol>';for(var k=1;k<st.n;k++)h+='<li value="'+k+'"><strong>'+esc(STEPS[k-1].t)+':</strong> '+esc(c.notes[k])+'</li>';h+='</ol></details>';}
 return h+'</div>';}
/* Each step is split into short parts shown one at a time: Learn (picture + teaching + worked case),
   Try it (the step's interactive tool, when it has one) and Check (judgements, a question, the clinic checklist). */
var PART=0,PH=[[1,3,'Before the appointment','Before'],[4,8,'The interview','Interview'],[9,14,'The wider picture','Wider picture'],[15,19,'Decide and share','Decide and share']];
function phaseOf(n){for(var i=0;i<PH.length;i++)if(n>=PH[i][0]&&n<=PH[i][1])return i;return 0;}
/* One view per step: Learn, then the practice section (tool, questions, checklist) at the end. */
var CKOPEN=false;
/* One view per step: the teaching first, then practice, questions and the checklist at the end. */
function partsOf(st){return [['Learn','What to do and why']];}
/* Question pager: in Try it and Check, scenario and question lists show one at a time with a progress strip,
   answered dots (green right, red wrong) and Previous / Next. The position survives re-renders. */
var PG={};
function pager(root,st){
 var sel='.ag-tri,.ag-q,.ag-dic',groups=[];
 $$(sel,root).forEach(function(it){var p=it.parentNode;if(groups.indexOf(p)<0)groups.push(p);});
 groups.forEach(function(p,gi){
  var items=Array.prototype.filter.call(p.children,function(c){return c.matches(sel);});if(items.length<2)return;
  var key=st.n+':'+PART+':'+gi,i=Math.min(PG[key]||0,items.length-1);
  var right=items.filter(function(it){return it.querySelector('.fb.good');}).length,ans=items.filter(function(it){return it.querySelector('.fb');}).length;
  var bar=document.createElement('div');bar.className='pg-bar';
  bar.innerHTML='<span class="pg-pos">Question <b>'+(i+1)+'</b> of '+items.length+'</span><span class="pg-dots">'+items.map(function(it,k){var c=it.querySelector('.fb.good')?' ok':it.querySelector('.fb')?' no':'';return '<button type="button" class="pg-dot'+c+(k===i?' on':'')+'" data-pg="'+key+'" data-k="'+k+'" aria-label="Question '+(k+1)+(c===' ok'?' (correct)':c===' no'?' (answered)':'')+'"></button>';}).join('')+'</span><span class="pg-score">'+(ans?right+' / '+ans+' correct':'Not started')+'</span>'+(ans?'<button type="button" class="pg-reset" data-pg="'+key+'">↺ Reset answers</button>':'');
  p.insertBefore(bar,items[0]);
  items.forEach(function(it,k){it.hidden=k!==i;it.classList.add('pg-item');});
  var cur=items[i],answered=!!cur.querySelector('.fb');
  var nav=document.createElement('div');nav.className='pg-nav';
  nav.innerHTML='<button type="button" class="btn secondary pg-go" data-pg="'+key+'" data-k="'+(i-1)+'"'+(i===0?' disabled':'')+'>\u2190 Previous</button>'
   +(i<items.length-1?'<button type="button" class="btn pg-go'+(answered?'':' secondary')+'" data-pg="'+key+'" data-k="'+(i+1)+'">Next question \u2192</button>'
   :(ans===items.length?'<span class="pg-done">All done: '+right+' of '+items.length+' correct</span>':'<span class="pg-left">'+(items.length-ans)+' still to answer</span>'));
  cur.parentNode.insertBefore(nav,cur.nextSibling);
 });
}
/* Learn part layout: the opening idea becomes a key-point card, each h4 topic a numbered card with a contents strip,
   and NICE clause numbers in brackets become small reference tags. Works on the existing teaching HTML of every step. */
function teachHTML(html){
 var box=document.createElement('div');box.innerHTML=html;
 var lead=[],secs=[],cur=null;
 Array.prototype.slice.call(box.childNodes).forEach(function(nd){
  if(nd.nodeType===1&&nd.tagName==='H4'){cur={t:nd.innerHTML,b:[]};secs.push(cur);return;}
  if(nd.nodeType===3&&!nd.textContent.trim())return;
  (cur?cur.b:lead).push(nd.nodeType===1?nd.outerHTML:nd.textContent);
 });
 if(lead.length>1){secs.unshift({t:'The essentials',b:lead.slice(1)});lead=lead.slice(0,1);}
 function refs(h){return h.replace(/\s*\((?:NICE )?(NG87 )?(\d\.\d+\.\d+(?:\s*[\u2013-]\s*\d\.\d+\.\d+)?(?:,\s*\d\.\d+\.\d+)*)\)/g,function(){return '';});}
 var h='';
 if(lead.length)h+='<div class="lx-lead"><span class="lx-lk">Key idea</span>'+refs(lead.join(''))+'</div>';
 if(secs.length>1)h+='<nav class="lx-toc" aria-label="In this step"><span>In this step</span>'+secs.map(function(sc,i){return '<button type="button" class="lx-go" data-s="'+i+'"><b>'+(i+1)+'</b>'+sc.t.replace(/\s*\((?:NICE )?NG87[^)]*\)/,'')+'</button>';}).join('')+'<button type="button" class="lx-all">Open all</button></nav>';
 secs.forEach(function(sc,i){
  h+='<details class="lx-sec" id="lx-s'+i+'"><summary><span class="lx-n">'+(i+1)+'</span><h4>'+sc.t.replace(/\s*\((?:NICE )?NG87[^)]*\)/,'')+'</h4>'+'<span class="lx-chev" aria-hidden="true"></span></summary><div class="lx-body">'+refs(sc.b.join(''))+'</div></details>';});
 return h;
}
/* Step practice lives in the module's Practise box (#ag-prac), not inside the guide, so the guide is teaching only.
   PSTEP is the step being practised; the guide's own position (S.step) is separate. */
var PSTEP=1;
function tryHTML(st){var h='',ck=S.ck[st.n]||{};

  var ws=(st.w||[]).map(function(w){return W[w]();}),qs='';
  (st.dic||[]).forEach(function(x,i){qs+=dicHTML(st.n+':'+i,x);});
  (st.q||[]).forEach(function(x,i){qs+=mcqHTML(st.n+':'+i,x);});
  /* questions join the step's practice set when it has one, so there is one pager, not two boxes */
  var host=-1;ws.forEach(function(x,i){if(x.indexOf('class="ag-tri')>=0)host=i;});
  if(qs&&host>=0){ws[host]=ws[host].slice(0,-6)+qs+'</div>';qs='';}
  h+=ws.join('');
  if(qs)h+='<div class="ag-w ag-qbox"><div class="ag-w-h"><span class="ag-tag">Questions</span><h3>Questions on this step</h3></div><div class="ag-qs">'+qs+'</div></div>';
  var nck=st.chk.filter(function(c,i){return ck[i];}).length,full=nck===st.chk.length;
  h+='<details class="ck-d'+(full?' full':'')+'"'+(CKOPEN?' open':'')+'><summary><span class="ck-ic" aria-hidden="true">'+(full?'\u2713':nck)+'</span><span class="ck-tt"><b>Clinic checklist</b><small>'+(full?'Step complete: every item ticked':nck+' of '+st.chk.length+' ticked')+'</small></span><span class="ck-chev" aria-hidden="true"></span></summary>';
  h+='<div class="ck-in">'+(full?'':'<button type="button" class="btn secondary ck-all">Tick all</button>')+'<ul class="ag-cklist">';st.chk.forEach(function(c,i){h+='<li><label class="ag-chk"><input type="checkbox" class="ag-ck" data-i="'+i+'"'+(ck[i]?' checked':'')+'> '+esc(c)+'</label></li>';});h+='</ul></div></details>';
 return h;}
function renderPrac(){var root=$('#ag-prac');if(!root)return;PSTEP=S.ps||PSTEP;var st=STEPS[PSTEP-1],ph=phaseOf(st.n);
 /* one step at a time: where you are, a progress bar, the step's practice, then Previous / Next */
 var h='<div class="agp agx ph'+(ph+1)+'"><div class="agx-top"><span class="agx-badge">'+st.n+'</span><div class="agx-tt"><span class="agp-k">Step '+st.n+' of '+N+' \u00b7 '+esc(PH[ph][2])+'</span><h3>'+esc(st.t)+'</h3></div>';
 h+='<label class="agx-jump-l"><span class="sr-only">Go to step</span><select class="agx-jump">'+STEPS.map(function(s2){return '<option value="'+s2.n+'"'+(s2.n===st.n?' selected':'')+'>'+s2.n+'. '+esc(s2.t)+'</option>';}).join('')+'</select></label></div>';
 h+='<div class="agx-bar" aria-hidden="true"><i style="width:'+Math.round(100*st.n/N)+'%"></i></div>';
 h+='<p class="agx-case">Worked case: '+Object.keys(CASES).map(function(k){return '<button type="button" class="ag-cs" data-c="'+k+'" aria-pressed="'+(S.cs===k)+'">'+esc(CASES[k].short||CASES[k].label)+'</button>';}).join('')+'<button type="button" class="agx-learn" data-n="'+st.n+'">Reread this step \u2197</button></p>';
 h+='<div class="agx-body">'+tryHTML(st)+'</div>';
 h+='<div class="agx-nav"><button type="button" class="btn secondary agx-go" data-n="'+(st.n-1)+'"'+(st.n===1?' disabled':'')+'>\u2190 Previous step</button>'
  +(st.n<N?'<button type="button" class="btn agx-go" data-n="'+(st.n+1)+'">Next: '+esc(STEPS[st.n].t)+' \u2192</button>':'<span class="pg-done">All 19 steps practised</span>')+'</div></div>';
 root.innerHTML=h;pager(root,st);}
function pracGo(n,scroll){PSTEP=S.ps=Math.max(1,Math.min(N,n));CKOPEN=false;save();renderPrac();
 if(scroll){var r=$('#ag-prac');if(r){var y=r.getBoundingClientRect().top+window.scrollY-120;window.scrollTo(0,Math.max(0,y));}}}
function render(focus){var root=$('#ag-app');if(!root)return;var st=STEPS[S.step-1],ck=S.ck[st.n]||{},parts=partsOf(st),ph=phaseOf(st.n);
 if(PART>=parts.length)PART=parts.length-1;
 /* one player card: header, phase track, part tabs, content, sticky navigation */
 var h='<div class="agp ph'+(ph+1)+'" id="ag-top">';
 h+='<div class="agp-h"><span class="agp-badge" aria-hidden="true">'+st.n+'</span><div class="agp-ht"><span class="agp-k">'+esc(PH[ph][2])+' \u00b7 step '+st.n+' of '+N+'</span><h2 id="ag-h" tabindex="-1">'+esc(st.t)+'</h2><p class="agp-sum">'+esc(st.s)+'</p></div>';
 h+='<div class="agp-tools"><div class="agp-case" role="group" aria-label="Worked case">';
 Object.keys(CASES).forEach(function(k){h+='<button type="button" class="ag-cs" data-c="'+k+'" aria-pressed="'+(S.cs===k)+'">'+esc(CASES[k].short||CASES[k].label)+'</button>';});
 h+='</div><details class="ag-more"><summary aria-label="Guide tools">\u22EF</summary><div class="ag-more-b"><button type="button" class="btn secondary ag-print-btn">Print checklist</button><button type="button" class="btn secondary ag-dl-ck">Download checklist (.txt)</button><button type="button" class="btn secondary ag-dl-notes">Download case notes (.txt)</button><button type="button" class="btn secondary ag-reset">Reset guide</button></div></details></div></div>';
 h+='<nav class="agp-track" aria-label="Guide steps">';
 PH.forEach(function(P,pi){h+='<div class="agp-ph ph'+(pi+1)+(pi===ph?' cur':'')+'"><span class="agp-phn" title="'+esc(P[2])+'">'+esc(P[3])+'</span><div class="agp-segs">';
  for(var n=P[0];n<=P[1];n++){var s2=STEPS[n-1],dn=S.ck[n]&&Object.keys(S.ck[n]).filter(function(k){return S.ck[n][k];}).length>=s2.chk.length;
   h+='<button type="button" class="ag-dot'+(dn?' dn':'')+(n<st.n?' past':'')+'" data-n="'+n+'" aria-current="'+(n===st.n?'step':'false')+'" title="'+n+'. '+esc(s2.t)+'" aria-label="Step '+n+': '+esc(s2.t)+(dn?' (done)':'')+'"><span>'+n+'</span></button>';}
  h+='</div></div>';});
 h+='</nav>';
 if(parts.length>1){h+='<div class="agp-parts" role="tablist" aria-label="Parts of this step">';parts.forEach(function(p,i){h+='<button type="button" role="tab" class="ag-part'+(i<PART?' done':'')+'" data-p="'+i+'" aria-selected="'+(i===PART)+'"><span class="ag-pn">'+(i<PART?'\u2713':i+1)+'</span>'+p[0]+'</button>';});h+='</div>';}
 h+='<div class="agp-body">';
 var key=parts[PART][0];
 {h+='<div class="agp-learn"><div class="ag-teach tlx">'+teachHTML(st.teach)+'</div><aside class="agp-aside">'+notesHTML(st)+visHTML(st)+'</aside></div>';
  }
 h+='<button type="button" class="ag-goprac"><span aria-hidden="true">\u270E</span><span><b>Practise step '+st.n+'</b><small>Tool, questions and clinic checklist, in the Practise box at the end of this module</small></span><span aria-hidden="true">\u2192</span></button>';
  h+='<details class="xp-src ag-src"><summary>Sources for this step</summary><p>'+esc(st.src)+'</p></details>';
 h+='</div>';
 var last=PART===parts.length-1;
 var backL=PART>0?'\u2190 '+parts[PART-1][0]:(st.n>1?'\u2190 Step '+(st.n-1):'\u2190 Back');
 var nextL=!last?'Next: '+parts[PART+1][0]+' \u2192':(st.n===N?'Finish: print checklist':'Next step: '+esc(STEPS[st.n].t)+' \u2192');
 h+='<div class="ag-nav"><button type="button" class="btn secondary ag-back"'+(st.n===1&&PART===0?' disabled':'')+'>'+backL+'</button>'+(parts.length>1?'<span class="agp-dots" aria-hidden="true">'+parts.map(function(p,i){return '<i class="'+(i===PART?'on':i<PART?'dn':'')+'"></i>';}).join('')+'</span>':'<span></span>')+'<button type="button" class="btn ag-next">'+nextL+'</button></div></div>';
 root.innerHTML=h;
 pager(root,st);
 preloadNext(st.n);
 if(focus){var t=$('#ag-top',root);if(t){var y=t.getBoundingClientRect().top+window.scrollY-110;window.scrollTo(0,Math.max(0,y));}var hh=$('#ag-h');if(hh)hh.focus({preventScroll:true});}}
var PRE={};function preloadNext(n){/* warm the cache for the next step's image (eager images only; no lazy loading) */
 [n,n+1].forEach(function(k){var nx=STEPS[k];if(!nx||!nx.vis||!nx.vis.img||PRE[nx.vis.img])return;PRE[nx.vis.img]=1;var im=new Image();im.decoding='async';im.src='images/'+nx.vis.img+'.webp';});}
var TAB=0;
function go(n){TAB=0;PART=0;CKOPEN=false;S.step=Math.max(1,Math.min(N,n));save();render(true);}
function rerender(){/* re-render, keep scroll position and keyboard focus on the equivalent control */
 var y=window.scrollY,ae=document.activeElement,idx=-1,root=[$('#ag-app'),$('#ag-prac')].filter(function(r){return r&&ae&&r.contains(ae);})[0];
 if(root){idx=$$('button,input,textarea,summary,a[href]',root).indexOf(ae);}
 render(false);renderPrac();window.scrollTo(0,y);
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
function onClick(e){
 var gp=e.target.closest('.ag-goprac');if(gp){openPrac(S.step);return;}
 var xg=e.target.closest('.agx-step,.agx-go');if(xg&&!xg.disabled){pracGo(+xg.dataset.n,xg.matches('.agx-go'));return;}
 var xl=e.target.closest('.agx-learn');if(xl){window.__agGo(+xl.dataset.n);return;}
 var rs=e.target.closest('.pg-reset');if(rs&&rs.closest('#ag-app,#ag-prac')){
  /* clear every answer in this question set and go back to question 1 */
  $$('.pg-item',rs.closest('.pg-bar').parentNode).forEach(function(it){var k=it.dataset.key,i=it.dataset.i;
   if(it.matches('.ag-q'))delete S.q[k];else if(it.matches('.ag-dic'))delete S.dc[k];else if(it.matches('.ag-dis'))delete S.dis[i];else if(it.matches('.ag-dec'))delete S.dec[i];else if(it.matches('.ag-tri'))delete S.tri[i];});
  PG[rs.dataset.pg]=0;save();rerender();return;}
 var cks=e.target.closest('.ck-d>summary');if(cks){CKOPEN=!cks.parentNode.open;return;}
 var tg=e.target.closest('.lx-go');if(tg){var sec=$('#lx-s'+tg.dataset.s);if(sec){sec.open=true;var y=sec.getBoundingClientRect().top+window.scrollY-120;window.scrollTo({top:y,behavior:'smooth'});}return;}
 var la=e.target.closest('.lx-all');if(la){var ds=$$('.lx-sec',$('#ag-app')),open=ds.some(function(d){return !d.open;});ds.forEach(function(d){d.open=open;});la.textContent=open?'Close all':'Open all';return;}
 var pg=e.target.closest('.pg-dot,.pg-go');if(pg&&pg.closest('#ag-app,#ag-prac')){var pr=pg.closest('#ag-app,#ag-prac');PG[pg.dataset.pg]=+pg.dataset.k;rerender();var it=$('.pg-item:not([hidden])',$('#'+pr.id));if(it&&it.getBoundingClientRect().top<90)it.scrollIntoView({block:'center'});return;}
 var ca=e.target.closest('.ck-all');if(ca&&ca.closest('#ag-prac')){var sn=STEPS[PSTEP-1];S.ck[sn.n]=S.ck[sn.n]||{};sn.chk.forEach(function(c,i){S.ck[sn.n][i]=true;});save();rerender();return;}
 var ps=e.target.closest('.ph-step[data-agstep]');if(ps){var app=$('#ag-app'),ls=app&&app.closest('.lesson');if(ls&&window.__lessonReveal)window.__lessonReveal(ls);go(+ps.dataset.agstep);return;}
 var tb=e.target.closest('.ag-tab');if(tb&&tb.closest('#ag-app')){TAB=+tb.dataset.t;rerender();return;}
 var b=e.target.closest('button,a.ag-cardlink,input');if(!b||!b.closest('#ag')) return;var st=STEPS[S.step-1],cs=S.cs;
 var np=partsOf(st).length;
 if(b.matches('.ag-part')){PART=+b.dataset.p;TAB=0;render(true);return;}
 if(b.matches('.ag-next')){if(PART<np-1){PART++;TAB=0;render(true);}else if(st.n===N)printChecklist();else go(st.n+1);return;}
 if(b.matches('.ag-back')){if(PART>0){PART--;TAB=0;render(true);}else go(st.n-1);return;}
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
function onChange(e){var t=e.target;if(t.matches&&t.matches('.agx-jump')){pracGo(+t.value,false);return;}if(!t.closest||!t.closest('#ag'))return;var st=STEPS[S.step-1];
 if(t.matches('.ag-ck')){st=STEPS[PSTEP-1];S.ck[st.n]=S.ck[st.n]||{};S.ck[st.n][t.dataset.i]=t.checked;save();rerender();return;}
 if(t.matches('.ag-bl')){if(S.bl[t.dataset.k]===t.value)return;S.bl[t.dataset.k]=t.value;save();var o=$('.ag-blout');if(o)o.innerHTML=blOut(S.bl);var fg=$('.ag-w .ag-fig');if(fg&&S.bl.age==='adult')fg.innerHTML=SVG.bpchart(S.bl.sbp,S.bl.dbp);return;}
 if(t.matches('.ag-blf')){var i=+t.dataset.i,f=S.bl.f;if(t.checked&&f.indexOf(i)<0)f.push(i);if(!t.checked)S.bl.f=f.filter(function(x){return x!==i;});save();$('.ag-blout').innerHTML=blOut(S.bl);return;}
 if(t.matches('.ag-blmed')){S.bl.med=t.checked;save();$('.ag-blout').innerHTML=blOut(S.bl);return;}
 if(t.matches('.ag-blc95')){S.bl.c95=t.checked;save();$('.ag-blout').innerHTML=blOut(S.bl);return;}
}
/* hook for the site search: open the guide at step n */
function openPrac(n){var r=$('#ag-prac');if(!r)return;var ls=r.closest('.lesson');if(ls&&window.__lessonReveal)window.__lessonReveal(ls);
 var pn=r.closest('.pr-panel'),box=r.closest('.practice');if(pn&&box&&pn.hidden){var i=$$('.pr-panel',box).indexOf(pn),t=$$('.pr-tab',box)[i];if(t)t.click();}
 setTimeout(function(){pracGo(n,true);},30);}
window.__agPrac=openPrac;
window.__agGo=function(n){var app=$('#ag-app'),ls=app&&app.closest('.lesson');if(ls&&window.__lessonReveal)window.__lessonReveal(ls);go(n);};
function init(){if(!$('#ag-app'))return;render(false);renderPrac();document.addEventListener('click',onClick);document.addEventListener('change',onChange);
 document.addEventListener('input',function(e){if(e.target.matches&&e.target.matches('.ag-bl'))onChange(e);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.AG={go:go,state:function(){return S;},tally:tally,reportText:reportText};
})();
