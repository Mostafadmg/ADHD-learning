/* Assessment Guide – hand-built SVG figures (no external assets). Labels are short; the step text explains each figure. */
(function(){
'use strict';
var C={navy:'#16324f',teal:'#0b6664',teal2:'#14a39f',tealL:'#e3f2f1',coral:'#a8432e',coralL:'#fbe9e4',amber:'#b26b00',amberL:'#fff3dc',green:'#2e7d4f',greenL:'#e5f4ea',ink:'#1d2733',muted:'#5b6775',line:'#d8e0e8',cream:'#fbf7f0'};
function svg(vb,label,body){return '<svg class="ag-svg" viewBox="'+vb+'" role="img" aria-label="'+label+'" xmlns="http://www.w3.org/2000/svg"><defs>'+
 '<linearGradient id="agG1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="'+C.cream+'"/></linearGradient>'+
 '<marker id="agArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="'+C.navy+'"/></marker>'+
 '<filter id="agSh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#16324f" flood-opacity=".18"/></filter></defs>'+
 '<rect width="100%" height="100%" rx="16" fill="url(#agG1)"/>'+body+'</svg>';}
function T(x,y,s,o){o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.fs||17)+'" font-weight="'+(o.fw||500)+'" fill="'+(o.c||C.ink)+'" text-anchor="'+(o.a||'middle')+'" font-family="Fredoka, system-ui, sans-serif">'+s+'</text>';}
function pill(x,y,w,h,fill,stroke,label,o){o=o||{};return '<g filter="url(#agSh)"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(o.r||14)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/></g>'+(label?T(x+w/2,y+h/2+6,label,o):'');}
function ar(x1,y1,x2,y2,c){return '<path d="M'+x1+','+y1+' L'+x2+','+y2+'" stroke="'+(c||C.navy)+'" stroke-width="2.5" fill="none" marker-end="url(#agArr)"/>';}
function curve(d,c,dash){return '<path d="'+d+'" stroke="'+(c||C.navy)+'" stroke-width="2.5" fill="none" '+(dash?'stroke-dasharray="6 5" ':'')+'marker-end="url(#agArr)"/>';}
/* simple icons */
function person(x,y,s,c){s=s||1;return '<g transform="translate('+x+','+y+') scale('+s+')"><circle cx="0" cy="-14" r="9" fill="'+c+'"/><path d="M-15,16 Q-15,-3 0,-3 Q15,-3 15,16 Z" fill="'+c+'"/></g>';}
function doc(x,y,c){return '<g transform="translate('+x+','+y+')"><path d="M-14,-18 h20 l8,8 v28 h-28 z" fill="#fff" stroke="'+c+'" stroke-width="2"/><path d="M6,-18 v8 h8" fill="none" stroke="'+c+'" stroke-width="2"/><path d="M-8,-4 h16 M-8,3 h16 M-8,10 h10" stroke="'+c+'" stroke-width="2"/></g>';}
function house(x,y,c){return '<g transform="translate('+x+','+y+')"><path d="M-20,2 L0,-18 L20,2" fill="none" stroke="'+c+'" stroke-width="3" stroke-linejoin="round"/><rect x="-14" y="0" width="28" height="20" fill="'+c+'" opacity=".9" rx="2"/><rect x="-4" y="8" width="8" height="12" fill="#fff"/></g>';}
function school(x,y,c){return '<g transform="translate('+x+','+y+')"><rect x="-22" y="-6" width="44" height="26" rx="2" fill="'+c+'"/><path d="M-26,-6 L0,-22 L26,-6 z" fill="'+c+'" opacity=".8"/><rect x="-16" y="0" width="8" height="8" fill="#fff"/><rect x="8" y="0" width="8" height="8" fill="#fff"/><rect x="-4" y="8" width="8" height="12" fill="#fff"/><path d="M0,-22 v-10 h10 v5 h-10" fill="'+c+'" stroke="'+c+'" stroke-width="1.5"/></g>';}
function brief(x,y,c){return '<g transform="translate('+x+','+y+')"><rect x="-20" y="-10" width="40" height="28" rx="5" fill="'+c+'"/><path d="M-7,-10 v-6 h14 v6" fill="none" stroke="'+c+'" stroke-width="3"/><path d="M-20,2 h40" stroke="#fff" stroke-width="2"/></g>';}
function friends(x,y,c){return person(x-12,y,0.85,c)+person(x+12,y+2,0.85,C.teal2);}
function heart(x,y,c){return '<path transform="translate('+x+','+y+')" d="M0,14 C-26,-4 -14,-22 0,-10 C14,-22 26,-4 0,14 z" fill="'+c+'"/>';}

var F={};
F.referral=function(){return svg('0 0 480 330','NICE NG87 referral routes for children and adults',
 T(240,30,'Referral routes (NG87 1.2)',{fs:19,fw:600,c:C.navy})+
 pill(20,50,200,46,C.tealL,C.teal,'Child: concern raised',{fs:15})+
 pill(260,50,200,46,C.tealL,C.teal,'Adult: concern raised',{fs:15})+
 ar(120,96,120,118)+ar(360,96,360,118)+
 pill(20,120,200,56,'#fff',C.navy,'',{})+T(120,143,'Primary care judges',{fs:15})+T(120,164,'severity, pervasiveness',{fs:13,c:C.muted})+
 pill(260,120,200,56,'#fff',C.navy,'',{})+T(360,143,'Childhood onset, persists',{fs:14})+T(360,164,'not explained, \u2265 moderate',{fs:13,c:C.muted})+
 curve('M70,176 Q55,210 62,238',C.amber)+curve('M170,176 Q185,210 178,238',C.coral)+
 pill(10,240,110,58,C.amberL,C.amber,'Moderate:',{fs:14})+T(65,288,'wait \u226410 wk',{fs:12,c:C.amber})+
 pill(126,240,104,58,C.coralL,C.coral,'Severe:',{fs:14})+T(178,288,'refer now',{fs:12,c:C.coral})+
 ar(360,176,360,238)+pill(262,240,196,58,C.greenL,C.green,'Specialist assessment',{fs:14})+
 T(240,322,'Primary care does not diagnose or start medication (1.2.9)',{fs:13,c:C.navy,fw:600}));};
F.prep=function(){var b='';var items=[['Self-report',C.teal],['Informants',C.teal2],['School reports',C.amber],['Records',C.navy],['Screen',C.coral]];
 items.forEach(function(it,i){var x=50+i*95;b+=doc(x,95,it[1])+T(x,140,it[0],{fs:13})+curve('M'+x+',150 Q'+x+',200 240,232',it[1],i===4);});
 return svg('0 0 480 320','Pre-assessment information flowing into the assessment',T(240,34,'Before the appointment',{fs:19,fw:600,c:C.navy})+b+
 '<circle cx="240" cy="262" r="40" fill="'+C.tealL+'" stroke="'+C.teal+'" stroke-width="3"/>'+person(240,270,1.1,C.teal)+
 T(240,316,'A screen (dashed) only flags; it never diagnoses',{fs:13,c:C.coral,fw:600}));};
F.grid=function(){var b='',i,j;b+=T(130,40,'Inattention (A1)',{fs:16,fw:600,c:C.teal})+T(350,40,'Hyperactive-impulsive (A2)',{fs:16,fw:600,c:C.coral});
 for(i=0;i<9;i++){var y=58+i*26;var on1=[1,1,0,1,1,1,1,1,1][i],on2=[1,0,0,0,1,0,1,0,1][i];
  b+='<rect x="40" y="'+y+'" width="180" height="20" rx="10" fill="'+(on1?C.teal:'#fff')+'" stroke="'+C.teal+'" stroke-width="1.5"/>'+T(130,y+15,'a b c d e f g h i'.split(' ')[i],{fs:13,c:on1?'#fff':C.teal});
  b+='<rect x="260" y="'+y+'" width="180" height="20" rx="10" fill="'+(on2?C.coral:'#fff')+'" stroke="'+C.coral+'" stroke-width="1.5"/>'+T(350,y+15,'a b c d e f g h i'.split(' ')[i],{fs:13,c:on2?'#fff':C.coral});}
 b+=T(130,312,'8 of 9: met (5+ at 17+)',{fs:14,fw:600,c:C.teal})+T(350,312,'4 of 9: not met',{fs:14,fw:600,c:C.coral});
 return svg('0 0 480 330','Grid of the 18 symptoms showing an example adult with 8 inattentive and 4 hyperactive-impulsive symptoms',b);};
F.timeline=function(){var b='<path d="M30,150 H450" stroke="'+C.navy+'" stroke-width="4" stroke-linecap="round"/>';
 [[0,'0'],[5,'5'],[12,'12'],[18,'18'],[34,'34']].forEach(function(a){var x=30+a[0]/34*420;b+='<circle cx="'+x+'" cy="150" r="7" fill="'+(a[0]===12?C.coral:C.navy)+'"/>'+T(x,182,a[1],{fs:15});});
 var x12=30+12/34*420;b+='<rect x="30" y="80" width="'+(x12-30)+'" height="40" rx="10" fill="'+C.tealL+'" stroke="'+C.teal+'"/>'+T((30+x12)/2,106,'Several symptoms',{fs:14,c:C.teal,fw:600});
 b+='<path d="M'+x12+',60 V200" stroke="'+C.coral+'" stroke-width="2.5" stroke-dasharray="6 5"/>'+T(x12,52,'Age 12',{fs:15,c:C.coral,fw:600});
 [7,8,9,10].forEach(function(a,i){var x=30+a/34*420;b+=doc(x,236,C.amber);});
 b+=T(118,282,'School reports at 7, 8, 9, 10',{fs:13,c:C.amber,fw:600});
 b+='<rect x="'+(x12+20)+'" y="80" width="'+(450-x12-20)+'" height="40" rx="10" fill="#fff" stroke="'+C.navy+'"/>'+T((x12+470)/2,106,'Impairment rises with demands',{fs:13,c:C.navy});
 return svg('0 0 480 300','Lifeline showing several symptoms before age 12 with school reports as evidence',T(240,30,'Onset: several symptoms before 12',{fs:18,fw:600,c:C.navy})+b);};
F.settings=function(){return svg('0 0 480 300','Overlapping settings: home, school or work, and social',
 T(240,30,'Several symptoms in 2+ settings',{fs:18,fw:600,c:C.navy})+
 '<circle cx="180" cy="140" r="78" fill="'+C.teal+'" fill-opacity=".18" stroke="'+C.teal+'" stroke-width="2.5"/>'+
 '<circle cx="300" cy="140" r="78" fill="'+C.coral+'" fill-opacity=".16" stroke="'+C.coral+'" stroke-width="2.5"/>'+
 '<circle cx="240" cy="225" r="66" fill="'+C.amber+'" fill-opacity=".16" stroke="'+C.amber+'" stroke-width="2.5"/>'+
 house(150,118,C.teal)+T(150,160,'Home',{fs:15,fw:600,c:C.teal})+school(330,118,C.coral)+T(330,160,'School / work',{fs:15,fw:600,c:C.coral})+
 friends(240,240,C.amber)+T(240,278,'Social',{fs:15,fw:600,c:C.amber})+
 '<circle cx="240" cy="168" r="18" fill="'+C.navy+'"/>'+T(240,174,'\u2713',{fs:18,c:'#fff'}));};
F.radar=function(){var dom=['Family','School/work','Life skills','Self-concept','Social','Risk'],v=[2,2.6,2.4,1.8,1.2,1.6],cx=240,cy=165,R=105,b='',pts=[],i,k;
 for(k=1;k<=3;k++){var ring=[];for(i=0;i<6;i++){var a=-Math.PI/2+i*Math.PI/3;ring.push((cx+Math.cos(a)*R*k/3).toFixed(1)+','+(cy+Math.sin(a)*R*k/3).toFixed(1));}b+='<polygon points="'+ring.join(' ')+'" fill="none" stroke="'+C.line+'" stroke-width="1.5"/>';}
 for(i=0;i<6;i++){var a2=-Math.PI/2+i*Math.PI/3;b+='<path d="M'+cx+','+cy+' L'+(cx+Math.cos(a2)*R)+','+(cy+Math.sin(a2)*R)+'" stroke="'+C.line+'"/>';
  pts.push((cx+Math.cos(a2)*R*v[i]/3).toFixed(1)+','+(cy+Math.sin(a2)*R*v[i]/3).toFixed(1));
  var lx=cx+Math.cos(a2)*(R+30),ly=cy+Math.sin(a2)*(R+22)+5;b+=T(lx,ly,dom[i],{fs:14,fw:600,c:C.navy});}
 var thr=[];for(i=0;i<6;i++){var a3=-Math.PI/2+i*Math.PI/3;thr.push((cx+Math.cos(a3)*R*1.5/3).toFixed(1)+','+(cy+Math.sin(a3)*R*1.5/3).toFixed(1));}
 b+='<polygon points="'+thr.join(' ')+'" fill="none" stroke="'+C.coral+'" stroke-width="2" stroke-dasharray="6 4"/>';
 b+='<polygon points="'+pts.join(' ')+'" fill="'+C.teal+'" fill-opacity=".35" stroke="'+C.teal+'" stroke-width="3"/>';
 return svg('0 0 480 345','Radar chart of impairment across six domains with a dashed line at a mean of 1.5',b+T(240,336,'Dashed ring = domain mean 1.5 (one WFIRS rule)',{fs:13,c:C.coral,fw:600}));};
F.wheel=function(){var seg=['Pregnancy','Development','Education','Psychiatric','Medical','Medicines','Family','Substances','Forensic'],cx=240,cy=165,R=120,r=50,b='',cols=[C.teal,C.teal2,C.amber,C.coral,C.navy,C.teal,C.teal2,C.amber,C.coral];
 seg.forEach(function(s,i){var a0=-Math.PI/2+i*2*Math.PI/9,a1=a0+2*Math.PI/9-0.03;
  function p(rr,a){return (cx+Math.cos(a)*rr).toFixed(1)+','+(cy+Math.sin(a)*rr).toFixed(1);}
  b+='<path d="M'+p(r,a0)+' L'+p(R,a0)+' A'+R+','+R+' 0 0 1 '+p(R,a1)+' L'+p(r,a1)+' A'+r+','+r+' 0 0 0 '+p(r,a0)+' z" fill="'+cols[i]+'" fill-opacity=".85"/>';
  var am=(a0+a1)/2,tx=cx+Math.cos(am)*(R+0.5*(r-R)+0),ty=cy+Math.sin(am)*((R+r)/2)+5;b+=T(cx+Math.cos(am)*((R+r)/2),ty,s,{fs:11.5,c:'#fff',fw:600});});
 b+=person(cx,cy+6,1.2,C.navy);
 return svg('0 0 480 320','Wheel of the background history areas around the person',b+T(240,310,'Cover every segment, for every assessment',{fs:14,c:C.navy,fw:600}));};
F.mse=function(){var d=[['Appearance','Fidgety'],['Speech','Talkative'],['Mood','Reactive'],['Thought form','Tangential'],['Content','No risk?'],['Perception','Normal'],['Cognition','Distractible'],['Insight','Good']],b='';
 d.forEach(function(x,i){var col=i%2,row=Math.floor(i/2),X=24+col*228,Y=48+row*66;b+=pill(X,Y,212,54,i===4?C.coralL:C.tealL,i===4?C.coral:C.teal,'',{});b+=T(X+14,Y+24,x[0],{a:'start',fs:15,fw:600,c:C.navy})+T(X+14,Y+44,x[1],{a:'start',fs:13,c:C.muted});});
 return svg('0 0 480 320','Eight mental state examination domains with typical ADHD findings',T(240,32,'MSE: what is typical, what points elsewhere',{fs:17,fw:600,c:C.navy})+b);};
F.informants=function(){return svg('0 0 480 300','Three informants with partly overlapping accounts and a third source to resolve disagreement',
 T(240,30,'Different views of the same person',{fs:18,fw:600,c:C.navy})+
 person(90,110,1.4,C.teal)+T(90,150,'Self',{fs:15,fw:600,c:C.teal})+person(240,110,1.4,C.coral)+T(240,150,'Parent / partner',{fs:15,fw:600,c:C.coral})+person(390,110,1.4,C.amber)+T(390,150,'Teacher / manager',{fs:15,fw:600,c:C.amber})+
 curve('M90,165 Q130,220 220,236',C.teal)+curve('M240,165 L240,226',C.coral)+curve('M390,165 Q350,220 260,236',C.amber)+
 pill(150,232,180,46,'#fff',C.navy,'Specific examples',{fs:15})+T(240,294,'+ third source or observation if doubt (NG87 1.3.2)',{fs:12.5,c:C.muted}));};
F.tree=function(){var q=['Onset before 12?','Episodic?','One setting only?','Sleep red flags?','Staring spells?','Worry or trauma?','Substances?','Autism or LD?'],
 out=['Later-onset cause?','Mood, substances','Context, learning','Sleep disorder','Seizures','Anxiety, PTSD','Substances','Assess both'],b='',i,G=40;
 b+='<path d="M86,58 V'+(52+8*G+6)+'" stroke="'+C.navy+'" stroke-width="3"/>';
 for(i=0;i<q.length;i++){var y=50+i*G;b+=pill(8,y,156,32,'#fff',C.navy,q[i],{fs:15,r:10});
  b+=curve('M164,'+(y+16)+' L200,'+(y+16),i===0?C.amber:C.coral,true)+T(182,y+10,i===0?'no':'yes',{fs:12,c:C.muted});
  b+=pill(204,y,168,32,i===0?C.amberL:C.coralL,i===0?C.amber:C.coral,out[i],{fs:15,r:10});}
 b+=pill(8,50+8*G,156,34,C.greenL,C.green,'ADHD best fit',{fs:15,r:10,fw:600});
 return svg('0 0 380 420','Decision tree of questions that rule mimics in or out, ending at ADHD as best fit',T(190,32,'Differential tree (simplified)',{fs:18,fw:600,c:C.navy})+b+T(190,412,'Continue down the left column when the answer is the opposite',{fs:12,c:C.muted}));};
F.ladder=function(){var r=[['Immediate risk / safeguarding',C.coral],['Psychosis or mania',C.coral],['Severe depression, eating disorder',C.amber],['Substance misuse plan',C.amber],['Cardiac assessment',C.navy],['ADHD + anxiety, autism, tics',C.teal],['Sleep, learning, social: in parallel',C.green]],b='';
 b+='<path d="M70,40 V300 M410,40 V300" stroke="'+C.muted+'" stroke-width="5" stroke-linecap="round"/>';
 r.forEach(function(x,i){var y=50+i*36;b+='<rect x="70" y="'+y+'" width="340" height="28" rx="8" fill="'+x[1]+'" fill-opacity=".9"/>'+T(240,y+19,(i+1)+'. '+x[0],{fs:13.5,c:'#fff',fw:600});});
 return svg('0 0 480 320','Ladder of priorities from immediate risk at the top to parallel support at the bottom',T(240,28,'Address from the top down',{fs:17,fw:600,c:C.navy})+b+T(240,314,'Teaching summary; sources on each rung below',{fs:12,c:C.muted}));};
F.gates=function(){var g=['A','B','C','D','E'],l=['Symptoms','Onset <12','2+ settings','Impairment','Not better explained'],b='';
 g.forEach(function(x,i){var X=30+i*88;b+='<g filter="url(#agSh)"><rect x="'+X+'" y="90" width="72" height="110" rx="12" fill="'+C.tealL+'" stroke="'+C.teal+'" stroke-width="2.5"/></g>'+T(X+36,140,x,{fs:30,fw:700,c:C.teal})+T(X+36,230,l[i].split(' ')[0],{fs:12.5,c:C.navy,fw:600})+(l[i].split(' ').length>1?T(X+36,247,l[i].split(' ').slice(1).join(' '),{fs:12.5,c:C.navy,fw:600}):'')+
  '<circle cx="'+(X+36)+'" cy="175" r="12" fill="'+C.green+'"/>'+T(X+36,181,'\u2713',{fs:14,c:'#fff'});
  if(i<4)b+=ar(X+72,145,X+88,145);});
 return svg('0 0 480 300','Five criteria gates A to E that must all be passed',T(240,40,'All five gates must open',{fs:18,fw:600,c:C.navy})+b+T(240,285,'Then: presentation + severity + ICD-11 code',{fs:14,c:C.coral,fw:600}));};
F.fork=function(){return svg('0 0 480 300','A decision fork with three outcomes: ADHD, not ADHD, or uncertain',
 T(240,30,'Three honest outcomes',{fs:18,fw:600,c:C.navy})+pill(170,50,140,44,'#fff',C.navy,'Evidence',{fs:16})+
 curve('M200,94 Q120,140 85,176',C.green)+curve('M240,94 L240,176',C.amber)+curve('M280,94 Q360,140 395,176',C.coral)+
 pill(20,180,130,56,C.greenL,C.green,'ADHD',{fs:16,fw:600})+pill(175,180,130,56,C.amberL,C.amber,'Uncertain',{fs:16,fw:600})+pill(330,180,130,56,C.coralL,C.coral,'Not ADHD',{fs:16,fw:600})+
 T(85,262,'Plan + pathway',{fs:13,c:C.muted})+T(240,262,'What is needed, by when',{fs:13,c:C.muted})+T(395,262,'Explain + help',{fs:13,c:C.muted}));};
F.report=function(){var b='<g filter="url(#agSh)"><rect x="140" y="40" width="200" height="250" rx="10" fill="#fff" stroke="'+C.navy+'" stroke-width="2"/></g>';
 var h=['Referral & sources','Difficulties','Symptoms A','Onset B \u00b7 Settings C','Impairment D','History \u00b7 MSE','Differentials E','Diagnosis','Plan & safety'];
 h.forEach(function(x,i){var y=66+i*25;b+='<rect x="156" y="'+(y-12)+'" width="10" height="10" rx="2" fill="'+(i===7?C.coral:C.teal)+'"/>'+T(174,y-3,x,{a:'start',fs:12.5,c:C.navy});});
 return svg('0 0 480 310','Report outline with nine sections',T(240,28,'Report structure',{fs:17,fw:600,c:C.navy})+b);};
F.scope=function(){return svg('0 0 480 330','Concentric circles showing learning, supervised practice and independent specialist practice',
 T(240,30,'Learn \u2192 supervised \u2192 independent',{fs:18,fw:600,c:C.navy})+
 '<circle cx="240" cy="170" r="120" fill="'+C.tealL+'" stroke="'+C.teal+'" stroke-width="2"/><circle cx="240" cy="170" r="80" fill="'+C.amberL+'" stroke="'+C.amber+'" stroke-width="2"/><circle cx="240" cy="170" r="40" fill="'+C.coralL+'" stroke="'+C.coral+'" stroke-width="2"/>'+
 T(240,76,'This guide: learning',{fs:14,fw:600,c:C.teal})+T(240,118,'Supervised practice',{fs:14,fw:600,c:C.amber})+T(240,166,'Specialist',{fs:13,fw:600,c:C.coral})+T(240,182,'diagnosis',{fs:13,fw:600,c:C.coral})+T(240,320,'NG87 1.3.1 and 1.7.2',{fs:13,c:C.muted}));};
F.bpchart=function(sbp,dbp){sbp=+sbp||0;dbp=+dbp||0;var x=function(d){return 60+(Math.min(Math.max(d,40),130)-40)/90*390;},y=function(s){return 250-(Math.min(Math.max(s,80),200)-80)/120*210;};
 var b='<rect x="60" y="40" width="390" height="210" fill="'+C.greenL+'"/>';
 b+='<rect x="'+x(90)+'" y="40" width="'+(x(130)-x(90))+'" height="210" fill="'+C.amberL+'"/><rect x="60" y="40" width="390" height="'+(y(140)-40)+'" fill="'+C.amberL+'"/>';
 b+='<rect x="'+x(120)+'" y="40" width="'+(x(130)-x(120))+'" height="210" fill="'+C.coralL+'"/><rect x="60" y="40" width="390" height="'+(y(180)-40)+'" fill="'+C.coralL+'"/>';
 b+='<path d="M60,40 V250 H450" stroke="'+C.navy+'" stroke-width="2" fill="none"/>';
 [80,110,140,170,200].forEach(function(s){b+=T(52,y(s)+5,s,{a:'end',fs:15,c:C.muted});});
 [40,60,90,120].forEach(function(d){b+=T(x(d),270,d,{fs:15,c:C.muted});});
 b+=T(255,293,'Diastolic (mmHg)',{fs:15,c:C.navy})+'<text x="16" y="150" font-size="15" fill="'+C.navy+'" transform="rotate(-90 16 150)" text-anchor="middle" font-family="Fredoka, system-ui">Systolic (mmHg)</text>';
 b+=T(x(92),y(143),'\u2265140/90',{fs:15,c:C.amber,fw:600,a:'start'})+T(x(121),y(183),'\u2265180/120',{fs:13,c:C.coral,fw:600,a:'start'});
 if(sbp&&dbp) b+='<circle cx="'+x(dbp)+'" cy="'+y(sbp)+'" r="9" fill="'+C.navy+'" stroke="#fff" stroke-width="3"/>';
 return svg('0 0 480 300','Adult clinic blood pressure plotted against the NICE NG136 140/90 and 180/120 thresholds',T(255,28,'Adult clinic BP (NICE NG136)',{fs:17,fw:600,c:C.navy})+b);};
window.AGSVG=F;
})();
