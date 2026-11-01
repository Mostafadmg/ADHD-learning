/* Medication day-profile builder. A schematic teaching model built from SPC descriptions of release
   (IR:MR ratios, Tmax, duration). Relative levels only, not pharmacokinetic data. */
(function(){
  'use strict';
  var XP = window.XP, RM = window.RELMODEL; if(!XP || !RM) return;
  var clamp=XP.clamp, esc=XP.esc;
  var DT=0.02, H0=5, H1=24, N=Math.round((H1-H0)/DT)+1;
  var WLO=0.36, WHI=1.25, TOO=1.5, YMAX=2;

  /* ---------- formulation models: shared with the M5 lesson 3 explorer (js/release-model.js) ---------- */
  var MODEL = RM.MODEL;
  function unit(key){ return RM.curve(key, null, H1-H0); }
  /* ---------- pure dose/licence check (unit-tested: build/test_dosecheck.js) ---------- */
  function prodMaxOf(g,brand,adult){
    if(!adult) return g.childMax;
    return (g.adultMax!==null && typeof g.adultMax==='object') ? g.adultMax[brand] : g.adultMax;
  }
  var OFF=' This may be intentional specialist off-label dosing; confirm with the prescriber.';
  function doseCheck(S){
    var g=G[S.g], w=[], adult=S.age==='adult', brand=g.brands[S.b]||g.brands[0];
    var addTot=S.add.reduce(function(a,x){return a+x.d;},0), tot=S.d+addTot;
    if(g.drug==='mph'){
      var bmax=prodMaxOf(g,brand,adult), absLim=adult?80:60;
      if(adult && bmax===0) w.push(['high',brand+' is not licensed for adults in the UK (SPC 4.1). Use in adults would be off-label.']);
      if(adult && g.adultNote && g.adultNote[brand]) w.push(['high',g.adultNote[brand]]);
      if(adult && bmax===null) w.push(['info','Adult licensing differs between generic IR methylphenidate tablets: check the SPC of the product dispensed.']);
      if(bmax && S.d>bmax) w.push(['danger',brand+' '+S.d+' mg is above the licensed maximum for this product ('+bmax+' mg/day '+(adult?'adult':'child')+', SPC 4.2).'+OFF]);
      var kg=(adult&&g.id==='mk')?' Medikinet XL adult dosing must also not exceed 1 mg/kg body weight (≤1 mg/kg, SPC 4.2).':'';
      var cap=bmax?Math.min(bmax,absLim):absLim, src=(bmax&&bmax<absLim)?brand+' SPC':'methylphenidate '+(adult?'adult':'child')+' maximum';
      if(S.add.length && g.id!=='mphir') w.push(['warn','MR + IR combinations are outside any single product licence; check the BNF/BNFC and the shared-care protocol. Prescriber decision (NG87 1.7.22).']);
      if(tot>cap) w.push(['danger','Total methylphenidate is '+tot+' mg/day, above '+cap+' mg/day ('+src+').'+kg+OFF]);
      else w.push(['info','Total methylphenidate: '+tot+' mg/day (reference maximum '+cap+' mg/day: '+src+(adult&&g.id==='mk'?', and ≤1 mg/kg body weight':'')+').']);
    }
    if(g.id==='lis'){ if(S.d>70) w.push(['danger','Above 70 mg/day (Elvanse SPC maximum).'+OFF]); if(S.add.length) w.push(['high','Lisdexamfetamine plus a dexamfetamine IR top-up is specialist-only practice. NG87 1.7.22 covers methylphenidate MR + IR only.']); }
    if(g.id==='dex'){ if(adult) w.push(['high','Dexamfetamine is not licensed for adults with ADHD in the UK (off-label, specialist use; see Module 5).']); if(tot>40) w.push(['danger','Total dexamfetamine '+tot+' mg/day is above 40 mg/day'+(adult?' (shared-care protocols go to 60 mg: see Module 5).':'.')+OFF]); else if(!adult&&tot>20) w.push(['warn','Total dexamfetamine '+tot+' mg/day: the usual maximum in children is 20 mg; up to 40 mg only in some older children (SPC).']); else w.push(['info','Total dexamfetamine: '+tot+' mg/day.']); }
    if(g.id==='ato'){ if(!adult) w.push(['info','Children and young people up to 70 kg: dosing is weight-based (mg/kg). Fixed strengths are shown here for illustration only (SPC).']); else if(S.d>100) w.push(['danger','Above 100 mg/day (SPC maximum).'+OFF]); }
    if(g.id==='gua'){ if(adult) w.push(['high','Guanfacine in adults is off-label: use only with advice from a tertiary ADHD service (NG87 1.7.17).']); else if(S.d>4) w.push(['warn','Above 4 mg: 6–12 year olds max 4 mg; 13–17 year olds up to 7 mg by weight band (SPC). Check the weight band.']); }
    return w;
  }
  /* BNF/BNFC figures (accessed 21 Oct 2026) shown only where they differ from the product's SmPC maximum. */
  function bnfNote(g,brand,adult){
    var B='BNF', C='BNFC', id=g.id;
    if(id==='mphir') return adult?B+' (adult IR): up to 100 mg/day in 2–3 doses; doses above the Ritalin 80 mg licence are off-label.':C+' (6–17 y): licensed maximum 60 mg/day; up to 90 mg/day only under specialist direction (off-label).';
    if(id==='oros'){
      if(brand==='Concerta XL') return adult?B+' (adult Concerta XL): maximum 108 mg/day, above the 72 mg licence (off-label).':C+' (Concerta XL): licensed maximum 54 mg; up to 108 mg/day only under specialist direction (off-label).';
      if(brand==='Delmosart'||brand==='Xaggitin XL') return adult?B+' lists a maximum of 54 mg/day for '+brand+' in adults; the SmPC licenses up to 72 mg/day. This tool uses the SmPC maximum.':'';
      return 'No brand-specific '+B+'/'+C+' entry for '+brand+': follow its SmPC.';
    }
    if(id==='rxl') return 'No brand-specific '+B+'/'+C+' entry for '+brand+': follow its SmPC (general '+C+' methylphenidate entry: licensed child maximum 60 mg/day).';
    if(id==='mk'||id==='eq') return adult?B+' (adult '+(id==='mk'?'Medikinet XL':'Equasym XL')+'): maximum 100 mg/day'+(id==='eq'?'; Equasym XL has no adult licence (off-label).':', above the 80 mg licence (off-label).'):C+': licensed maximum 60 mg; up to 90 mg/day only under specialist direction (off-label).';
    if(id==='dex') return adult?B+' (adult): 5 mg twice daily, maximum 60 mg/day; dexamfetamine has no adult ADHD licence (off-label).':'';
    if(id==='ato') return adult?B+' (adult): maximum 120 mg/day under specialist direction; the "dose maximum of 120 mg" is not licensed.':C+': maximum 1.8 mg/kg and 120 mg/day under specialist direction; doses above 100 mg daily are not licensed.';
    if(id==='gua') return adult?B+' lists no adult dose for guanfacine.':'';
    return '';
  }
  XP._doseCheck=doseCheck; XP._bnfNote=bnfNote;
  XP._unit=function(k){ return MODEL[k]?unit(k):null; }; XP._pkDT=DT;
  function peakOf(a){ var p=0; for(var i=0;i<a.length;i++) if(a[i]>p) p=a[i]; return p; }

  /* ---------- products ---------- */
  var GROUPS = [
    {id:'mphir', chip:'Methylphenidate IR', drug:'mph', model:'ir', brands:['Ritalin','Medikinet tablets','Generic methylphenidate IR tablets'],
     doses:[5,10,15,20], def:10, unitLbl:'mg', childMax:60, adultMax:{ 'Ritalin':80, 'Medikinet tablets':0, 'Generic methylphenidate IR tablets':null },
     shape:'<p><strong>Immediate release:</strong> the tablet dissolves and methylphenidate is absorbed quickly. The SPC gives a Tmax of 1–2 h and a duration of effect of up to about 4 h (Ritalin; Medikinet tablets 1–4 h). Food increases Ritalin\'s Cmax by about 23%. One morning tablet does not cover a school or working day, so IR is usually given 2–3 times a day, or used as a top-up to an MR product.</p>'},
    {id:'oros', chip:'MR 22:78 (Concerta-type)', drug:'mph', model:'oros', brands:['Concerta XL','Xaggitin XL','Delmosart','Affenid XL','Xenidate XL','Atenza XL','Matoride XL'],
     doses:[18,27,36,54,72], def:36, childMax:54, adultMax:{'Concerta XL':72,'Xaggitin XL':72,'Delmosart':72,'Affenid XL':72,'Xenidate XL':72,'Atenza XL':72,'Matoride XL':54},
     brandDoses:{'Atenza XL':[18,27,36,45,54,72],'Matoride XL':[18,36,54]},
     /* Atenza XL (emc 101204): children 6+ and adults, adult max 72 mg; the only brand with a 45 mg tablet. Matoride XL (emc 3304/3305/3682, SmPC rev. 06/05/2026, checked live 28 Oct 2026): children 6+ only, max 54 mg/day; starting it in adults is not appropriate, though treatment may continue into adulthood (SmPC 4.1, 4.2). */
     /* each brand checked against its own UK SPC 4.1/4.2 (Oct 2026): children 6+ and adults; max 54 mg child, 72 mg adult */
     shape:'<p><strong>22:78-type prolonged-release tablets (Concerta XL and bioequivalent brands):</strong> about a fifth of the dose is released straight away from the tablet coat, giving an initial maximum at about 1–2 h. The rest is released gradually from the tablet core, so the level keeps <em>rising</em> to a peak at about 6–8 h (Concerta XL SmPC: Tmax 6.8 ± 1.8 h in adults) and cover lasts about 12 h (SPS). <strong>Concerta XL, Affenid XL, Atenza XL and Matoride XL are osmotic tablets</strong>: the empty, non-absorbable shell can appear in stools, which is expected (SmPC 4.4). <strong>Xaggitin XL</strong> (25:75; polymer core, no shell) and <strong>Xenidate XL</strong> (multiple-unit tablet) are not osmotic but are bioequivalent (SmPC 6.1, 5.2; SPS). All must be swallowed whole and not chewed, divided or crushed (SmPC 4.2).</p>'},
    {id:'mk', chip:'Medikinet XL (50:50)', drug:'mph', model:'mk', brands:['Medikinet XL'],
     doses:[5,10,20,30,40,50,60], def:20, childMax:60, adultMax:80,
     shape:'<p><strong>Bead capsule, 50:50:</strong> half the dose is in immediate-release pellets (white) and half in gastro-resistant modified-release pellets (blue). The SPC describes a second rising portion about 3 hours after the first and a plateau of 3–4 h during which levels do not fall below 75% of the peak (Tmax 2.75 h after breakfast), so cover is about 8 h: a strong morning <em>and</em> a strong early afternoon. It must be taken with or after breakfast. The SPC states that 20 mg Medikinet XL can replace 10 mg IR at breakfast plus 10 mg IR at lunchtime.</p>'},
    {id:'rxl', chip:'MR 50:50 (Ritalin XL-type)', drug:'mph', model:'rxl', brands:['Ritalin XL','Meflynate XL','Metyrol XL','Focusim XL'],
     doses:[10,20,30,40,60], def:20, childMax:60, adultMax:80,
     /* Ritalin XL (emc 15966), Meflynate XL (15094), Metyrol XL (13797), Focusim XL (100558): children 6+ and adults; max 60 child, 80 adult. */
     shape:'<p><strong>Bead capsule, 50:50 (Ritalin XL, Meflynate XL, Metyrol XL, Focusim XL):</strong> half the dose is in immediate-release beads, giving a first peak at about 1–2 h. The other half is in delayed-release beads that dissolve after about 4 h and give a second peak at about 5–7 h, so the profile has <em>two distinct peaks about 4 hours apart</em>, like IR methylphenidate taken twice daily 4 hours apart (Ritalin XL SmPC 5.2). Cover is about 8 h (SPS). It can be taken with or without food, and the capsule can be opened and the beads sprinkled on cool soft food (SmPC 4.2). SPS lists these four capsules as bioequivalent to each other.</p>'},
    {id:'eq', chip:'Equasym XL (30:70)', drug:'mph', model:'eq', brands:['Equasym XL'],
     doses:[10,20,30,40,50,60], def:20, childMax:60, adultMax:0,
     shape:'<p><strong>Bead capsule, 30:70:</strong> 30% immediate-release and 70% modified-release beads (Equasym XL SPC). The SmPC describes a sharp first rise with a peak at about 1–2 h (mean 7.7 ng/ml at 1.5 h) and a second maximum at about 4.5 h (mean 8.2 ng/ml), then a gradual decline, with cover of about 8 h. In the SmPC study the two peaks were of similar height; this schematic one-compartment model draws the first peak lower than the second, so read the timings, not the heights. Compared with Medikinet XL (50:50), less is released at breakfast and more later. A high-fat breakfast delays Tmax by about 1 h. Capsules are 10, 20 and 30 mg, combined for higher doses.</p>'},
    {id:'lis', chip:'Lisdexamfetamine', drug:'amf', model:'lis', brands:['Elvanse (6 years+, incl. adults)'],
     doses:[20,30,40,50,60,70], def:30, childMax:70, adultMax:70, factor:0.297,
     shape:'<p><strong>Prodrug:</strong> lisdexamfetamine is inactive until red blood cells hydrolyse it to d-amfetamine and L-lysine (Elvanse SPC). Because this conversion is gradual and rate-limited, the level rises smoothly (d-amfetamine Tmax about 3.5 h) and effects were still present at 13 h in children and 14 h in adults (SPC). The SPC advises that <em>afternoon doses should be avoided because of the potential for insomnia</em>.</p>'},
    {id:'dex', chip:'Dexamfetamine IR', drug:'amf', model:'dex', brands:['Amfexa','Generic dexamfetamine tablets'],
     doses:[5,10,15,20], def:5, childMax:40, adultMax:0, factor:0.73,
     shape:'<p><strong>Immediate release:</strong> dexamfetamine tablets are absorbed within hours and are usually given in divided doses. The SmPC gives a Tmax of about 1.5 h and a plasma half-life of about 10 h, and the dose is given once or twice daily (e.g. breakfast and lunch). The SmPC does not state a duration of effect: the curve here shows the clinical effect of each dose schematically (about 5–6 h), not the plasma level, which falls more slowly. The SPC advises that doses should not be taken too late after lunchtime, to avoid disturbing sleep. The usual maximum in children is 20 mg/day, with up to 40 mg in some older children (SPC).</p>'},
    {id:'ato', chip:'Atomoxetine', drug:'ato', flat:true, brands:['Atomoxetine capsules / oral solution (Strattera and generics)'],
     doses:[10,18,25,40,60,80,100], def:40, childMax:0, adultMax:100,
     shape:'<p><strong>Non-stimulant, no daily curve:</strong> atomoxetine is a selective noradrenaline reuptake inhibitor. Plasma levels still rise and fall each day. NICE says non-stimulants can take longer to have an effect than stimulants, but the SmPC gives no time to full effect and no daily peak or trough of clinical effect, so the model shows a flat line only because there is nothing to draw. It can be given once daily in the morning or split into two doses (morning and late afternoon or early evening) if not tolerated or not effective once daily (SPC). It is not a controlled drug.</p>'},
    {id:'gua', chip:'Guanfacine (Intuniv)', drug:'gua', flat:true, brands:['Intuniv prolonged-release tablets'],
     doses:[1,2,3,4,5,6,7], def:2, childMax:4, adultMax:0,
     shape:'<p><strong>Non-stimulant α2A agonist, no daily curve:</strong> guanfacine prolonged-release is taken once daily (morning or evening) and titrated in 1 mg steps no more often than weekly. NICE says non-stimulants can take longer to have an effect than stimulants, but the SmPC gives no time to full effect and no daily peak or trough of clinical effect, so the model shows a flat line only because there is nothing to draw. Unlike stimulants it <em>lowers</em> blood pressure and heart rate, and it commonly causes sleepiness. It must not be stopped abruptly because of rebound hypertension: taper it (SPC). It is not a controlled drug.</p>'}
  ];
  var G={}; GROUPS.forEach(function(g){ G[g.id]=g; });
  var TIMES=[]; for(var m=360;m<=570;m+=30) TIMES.push(m);
  var ADD_T=[]; for(m=600;m<=1140;m+=30) ADD_T.push(m);
  function hhmm(mins){ mins=Math.round(mins); if(mins>=1440) return '24:00'; var h=Math.floor(mins/60)%24, mm=mins%60; return (h<10?'0':'')+h+':'+(mm<10?'0':'')+mm; }
  var COLS=['#2f6fb3','#b07400','#6b4fa3'];
  var SCEN=[
    {label:'School day: Concerta XL 36 mg', s:{g:'oros',b:0,d:36,t:450,age:'child',add:[]}},
    {label:'Medikinet XL + IR at 14:00', s:{g:'mk',b:0,d:20,t:450,age:'child',add:[{d:10,t:840}]}},
    {label:'IR three times daily', s:{g:'mphir',b:0,d:10,t:450,age:'child',add:[{d:10,t:720},{d:5,t:960}]}},
    {label:'Elvanse 30 mg', s:{g:'lis',b:0,d:30,t:450,age:'child',add:[]}},
    {label:'Late top-up at 18:00', s:{g:'oros',b:0,d:36,t:450,age:'child',add:[{d:10,t:1080}]}}
  ];
  var TCHIPS=[['Breakfast',450],['School',600],['Lunch',750],['Homework',990],['Evening',1110],['Bedtime',1260]];

  function opt(v,l,sel){ return '<option value="'+v+'"'+(sel?' selected':'')+'>'+esc(l)+'</option>'; }

  /* ---------- the guided builder: three steps, one at a time (Regimen, Top-ups, See the day) ---------- */
  var PICKC={mphir:['#a8432e','#fbeae5'],oros:['#0b6664','#e3f4f3'],mk:['#2f6fb3','#e8f0fa'],rxl:['#2f6fb3','#e8f0fa'],eq:['#2f6fb3','#e8f0fa'],lis:['#6b4fa3','#f0ebf8'],dex:['#6b4fa3','#f0ebf8'],ato:['#55626f','#eef3f7'],gua:['#55626f','#eef3f7']};
  var CLASSN={mph:'Methylphenidate',amf:'Amfetamine',ato:'Non-stimulant',gua:'Non-stimulant'};
  var STEPS=[['Regimen','Choose the regimen'],['Top-ups','Add top-ups'],['See the day','See the day']];
  var METERS=[{label:'Focus now',tone:'pos',good:1},{label:'Homework cover',sub:'16:00–18:00',tone:'pos2',good:1},{label:'Evening rebound risk',sub:'whole day',tone:'neg',good:0},{label:'Appetite now',sub:'higher = normal',tone:'pos',good:1},{label:'Sleep-onset risk',sub:'level at bedtime',tone:'neg',good:0},{label:'BP / HR load now',tone:'neg2',good:0}];
  var SEV={danger:['Danger',0],high:['Important',1],warn:['Caution',2],info:['Note',3]};
  var SVGO='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var ICON={check:SVGO+'<path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',next:SVGO+'<path d="M9 5l7 7-7 7"/></svg>',back:SVGO+'<path d="M15 5l-7 7 7 7"/></svg>',plus:SVGO+'<path d="M12 5v14M5 12h14"/></svg>',alert:SVGO+'<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.4v.2"/></svg>'};
  var uidn=0;
  function pad2(n){ return (n<10?'0':'')+n; }

  function build(mount){
    var S={g:'oros',b:0,d:36,t:450,age:'child',add:[],time:600,step:1};
    var u='dy'+(++uidn);
    var h='<div class="dy" id="dayBuilder'+(uidn>1?uidn:'')+'" data-step="1">'
      /* step track */
      +'<ol class="dy-track" aria-label="Steps">'+STEPS.map(function(s,i){
        return '<li><button type="button" class="dy-tk" data-go="'+(i+1)+'" aria-label="Step '+(i+1)+' of 3: '+s[1]+'"><span class="dy-tn" aria-hidden="true">'+(i+1)+'</span><span class="dy-tl">'+s[0]+'</span></button></li>';
      }).join('')+'</ol>'
      /* step 1 */
      +'<section class="dy-pane" data-pane="1" aria-labelledby="'+u+'-h1">'
        +'<h4 class="dy-h" id="'+u+'-h1" tabindex="-1">1 · Choose the regimen</h4>'
        +'<p class="dy-lead">Tap an example to jump straight to its day, or build your own below.</p>'
        +'<div class="dy-f"><p class="dy-fl" id="'+u+'-ex">Quick start: tap an example</p><div class="dy-chips dy-scen" role="group" aria-labelledby="'+u+'-ex">'
          +SCEN.map(function(s,i){return '<button type="button" class="dy-chip" data-i="'+i+'" aria-pressed="false">'+esc(s.label)+'</button>';}).join('')+'</div></div>'
        +'<p class="dy-or"><span>or build your own</span></p>'
        +'<div class="dy-f"><p class="dy-fl" id="'+u+'-md">Medicine</p><div class="dy-picks dy-meds" role="group" aria-labelledby="'+u+'-md">'
          +GROUPS.map(function(g){var c=PICKC[g.id]; return '<button type="button" class="dy-pick" data-g="'+g.id+'" aria-pressed="false" style="--c:'+c[0]+';--l:'+c[1]+'"><b>'+esc(g.chip)+'</b></button>';}).join('')+'</div></div>'
        +'<div class="dy-row">'
          +'<div class="dy-f dy-f-brand"><label class="dy-fl" for="'+u+'-brand">Brand / product</label><select class="dy-brand" id="'+u+'-brand"></select><p class="dy-static dy-brand1" hidden></p></div>'
          +'<div class="dy-f dy-f-dose"><p class="dy-fl" id="'+u+'-ds">Dose <span class="dy-dlbl"></span></p><div class="dy-seg dy-dose" role="group" aria-labelledby="'+u+'-ds"></div></div>'
          +'<div class="dy-pair"><div class="dy-f dy-f-time"><label class="dy-fl" for="'+u+'-time">Morning dose time</label><select class="dy-time" id="'+u+'-time">'+TIMES.map(function(t){return opt(t,hhmm(t),t===450);}).join('')+'</select></div>'
          +'<div class="dy-f dy-f-age"><p class="dy-fl" id="'+u+'-pt">Patient</p><div class="dy-seg dy-age" role="group" aria-labelledby="'+u+'-pt"><button type="button" data-age="child" aria-pressed="true">Child 6–17</button><button type="button" data-age="adult" aria-pressed="false">Adult</button></div></div></div>'
        +'</div>'
        +'<p class="dy-sum dy-sum1" hidden></p>'
        +'<div class="dy-checks"></div>'
        +'<div class="dy-nav dy-nav1"><button type="button" class="dy-btn" data-nav="2">Next: top-ups'+ICON.next+'</button></div>'
      +'</section>'
      /* step 2 */
      +'<section class="dy-pane" data-pane="2" aria-labelledby="'+u+'-h2" hidden>'
        +'<h4 class="dy-h" id="'+u+'-h2" tabindex="-1">2 · Add top-ups</h4>'
        +'<p class="dy-sum"></p>'
        +'<p class="dy-lead">Optional. A top-up is an extra immediate-release (IR) dose later in the day to stretch the cover. You can add up to two. Bedtime in this model is <b class="dy-bedt"></b>.</p>'
        +'<div class="dy-adds"></div>'
        +'<button type="button" class="dy-btn dy-sec dy-addbtn">'+ICON.plus+'Add a top-up</button>'
        +'<p class="dy-addnote" role="status"></p>'
        +'<div class="dy-empty"></div>'
        +'<p class="dy-rule dy-sleep"></p>'
        +'<details class="dy-more dy-risk" hidden><summary>Overlap and total-dose risks</summary><div class="dy-addx"></div></details>'
        +'<div class="dy-checks"></div>'
        +'<div class="dy-nav"><button type="button" class="dy-btn dy-sec" data-nav="1">'+ICON.back+'Back</button><button type="button" class="dy-btn" data-nav="3">See the day'+ICON.next+'</button></div>'
      +'</section>'
      /* step 3 */
      +'<section class="dy-pane dy-p3" data-pane="3" aria-labelledby="'+u+'-h3" hidden>'
        +'<h4 class="dy-h" id="'+u+'-h3" tabindex="-1">3 · See the day</h4>'
        +'<div class="dy-colA">'
          +'<p class="dy-sum"></p>'
          +'<div class="dy-chart" tabindex="0" role="group" aria-label="Day chart. Drag across it, or use the left and right arrow keys, to move the time marker."><svg class="dy-svg" role="img"></svg></div>'
          +'<p class="dy-cap"></p>'
          +'<div class="dy-time3"><label class="dy-tlab" for="'+u+'-r">Time of day <output class="dy-out" for="'+u+'-r"></output></label>'
          +'<input class="dy-range" id="'+u+'-r" type="range" min="300" max="1440" step="15" value="600"></div>'
          +'<div class="dy-verdict" aria-live="polite" data-tone="ok"><span class="dy-badge"></span><h5 class="dy-vt"></h5><div class="dy-now"></div></div>'
        +'</div>'
        +'<div class="dy-colB">'
          +'<div class="dy-f"><div class="dy-jump" role="group" aria-label="Jump to a time of day">'
            +TCHIPS.map(function(c,i){return '<button type="button" data-tm="'+c[1]+'"'+(i===TCHIPS.length-1?' data-bed="1"':'')+' aria-pressed="false"><b>'+c[0]+'</b><small>'+hhmm(c[1])+'</small></button>';}).join('')+'</div></div>'
          +'<dl class="dy-stats"></dl>'
          +'<div class="dy-f"><p class="dy-fl">Six meters</p>'
          +'<div class="dy-meters">'+METERS.map(function(m,i){return '<div class="dy-m dy-m-'+m.tone+'" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="'+esc(m.label+(m.sub?' ('+m.sub+')':''))+'"><span class="dy-ml">'+esc(m.label)+(m.sub?'<small>'+esc(m.sub)+'</small>':'')+'</span><span class="dy-mt"><span class="dy-mf" data-i="'+i+'"></span></span></div>';}).join('')+'</div></div>'
        +'</div>'
        +'<div class="dy-colC">'
          +'<div class="dy-checks dy-checks3"></div>'
          +'<details class="dy-more"><summary>Why the curve has this shape</summary><div class="dy-shape"></div></details>'
          +'<details class="dy-more"><summary>What this means for the patient</summary><div class="dy-ptx"></div></details>'
          +'<details class="dy-more"><summary>Pharmacist action</summary><div class="dy-phx"></div></details>'
          +'<details class="dy-more"><summary>Sources and the schematic note</summary>'
            +'<p class="dy-note">Schematic, not pharmacokinetic data. The curves are built from SPC descriptions of release (IR:MR ratio, Tmax, duration) using a simple one-compartment model, normalised so that the morning dose is assumed to be titrated into this person\'s window. Real levels and responses vary widely between people (NG87 1.7.21). Strengths shown: check the current product range (dm+d).</p>'
            +'<ul class="dy-src">'
            +'<li>SPCs (emc): Ritalin; Medikinet tablets; Concerta XL; Xaggitin XL, Affenid XL, Xenidate XL (emc) and Delmosart (Accord UK SmPC) for 22:78 maxima (54 mg child, 72 mg adult). BNF/BNFC (accessed 21 Oct 2026): Concerta XL up to 108 mg/day (off-label), Delmosart and Xaggitin XL 54 mg/day in adults (SmPC 72 mg); this tool keeps each product\'s SmPC maximum and shows differing BNF figures as notes; Medikinet XL; Equasym XL; Elvanse; dexamfetamine; Strattera; Intuniv (sections 4.2, 5.2).</li>'
            +'<li>NICE NG87 (live text checked Oct 2026): 1.7.8, 1.7.17, 1.7.21, 1.7.22, 1.7.23, 1.8.6, 1.8.9, 1.8.17.</li>'
            +'<li>MHRA Drug Safety Update (2022): prescribe modified-release methylphenidate by brand.</li>'
            +'<li>SPS: Methylphenidate modified-release preparations (updated 28 Aug 2025).</li>'
            +'<li>Misuse of Drugs Regulations 2001 (Schedule 2 prescription requirements); Module 9.</li></ul></details>'
          +'<div class="dy-nav"><button type="button" class="dy-btn dy-sec" data-nav="2">'+ICON.back+'Back</button><button type="button" class="dy-btn" data-nav="1">Edit regimen</button></div>'
        +'</div>'
      +'</section>'
      +'</div>';
    mount.innerHTML=h;
    var R=mount.firstChild, $=function(s){return R.querySelector(s);}, $$=function(s){return Array.prototype.slice.call(R.querySelectorAll(s));};
    var panes=$$('.dy-pane'), tks=$$('.dy-tk');
    var wrap=$('.dy-chart'), svg=$('.dy-svg'), range=$('.dy-range'), out=$('.dy-out');
    var selB=$('.dy-brand'), selT=$('.dy-time');
    var curves=null, lastKey='', lastReg='', lastSt='', raf=0, geo=null, notesOpen=false, htmlCache={};

    function bedOf(){ return S.age==='child'?1260:1350; }
    function setHTML(el,s){ if(el._h===s) return; el._h=s; el.innerHTML=s; }
    function plain(s){ return s.replace(/<[^>]+>/g,''); }

    /* ----- controls: step 1 ----- */
    function brandsAndDoses(){
      var g=G[S.g], one=g.brands.length<2, b1=$('.dy-brand1');
      selB.innerHTML=g.brands.map(function(b,i){return opt(i,b,i===S.b);}).join('');
      selB.hidden=one; b1.hidden=!one; b1.textContent=g.brands[0];
      var ds=(g.brandDoses&&g.brandDoses[g.brands[S.b]])||g.doses;
      if(ds.indexOf(S.d)<0) S.d=ds.indexOf(g.def)>=0?g.def:ds[0];
      $('.dy-dose').innerHTML=ds.map(function(d){return '<button type="button" data-d="'+d+'" aria-pressed="'+(d===S.d)+'">'+d+' mg</button>';}).join('');
      $('.dy-dlbl').textContent='('+((g.id==='mphir'||g.id==='dex')?'morning dose':'once daily')+')';
      $('.dy-f-time').hidden=!!g.flat;
    }
    function syncPressed(){
      $$('.dy-meds .dy-pick').forEach(function(c){ var on=c.dataset.g===S.g; c.setAttribute('aria-pressed',on); c.classList.toggle('on',on); });
      $$('.dy-age button').forEach(function(c){ c.setAttribute('aria-pressed',c.dataset.age===S.age); });
      $$('.dy-dose button').forEach(function(c){ c.setAttribute('aria-pressed',+c.dataset.d===S.d); });
      selT.value=S.t;
      var bc=$('.dy-jump button[data-bed]'); bc.dataset.tm=bedOf(); bc.querySelector('small').textContent=hhmm(bedOf());
      $('.dy-bedt').textContent=hhmm(bedOf())+' ('+(S.age==='child'?'child':'adult')+')';
    }

    /* ----- controls: step 2 ----- */
    function addKind(){ var g=G[S.g]; return g.flat?null:(g.drug==='mph'?{name:'Methylphenidate IR',model:'ir',doses:[5,10,15,20],factor:1}:{name:'Dexamfetamine IR',model:'dex',doses:[5,10],factor:0.73}); }
    function renderAdds(){
      var k=addKind(), wr=$('.dy-adds');
      if(!k){ S.add=[]; }
      S.add.forEach(function(a){ if(k && k.doses.indexOf(a.d)<0) a.d=k.doses[1]; });
      wr.innerHTML=S.add.map(function(a,i){
        return '<div class="dy-add" style="--c:'+COLS[i+1]+'" data-i="'+i+'">'
          +'<div class="dy-ah"><b><i aria-hidden="true"></i>Top-up '+(i+1)+'<small>'+esc(k.name)+'</small></b><button type="button" class="dy-rm" data-i="'+i+'" aria-label="Remove top-up '+(i+1)+'">Remove</button></div>'
          +'<div class="dy-f"><p class="dy-fl" id="'+u+'-ad'+i+'">Dose</p><div class="dy-seg" role="group" aria-labelledby="'+u+'-ad'+i+'">'+k.doses.map(function(d){return '<button type="button" data-i="'+i+'" data-d="'+d+'" aria-pressed="'+(d===a.d)+'">'+d+' mg</button>';}).join('')+'</div></div>'
          +'<div class="dy-f"><label class="dy-fl" for="'+u+'-at'+i+'">Time</label><select id="'+u+'-at'+i+'" data-i="'+i+'">'+ADD_T.map(function(t){return opt(t,hhmm(t),t===a.t);}).join('')+'</select></div>'
          +'<p class="dy-gap"></p></div>';
      }).join('');
      var btn=$('.dy-addbtn'), note=$('.dy-addnote');
      btn.disabled = !k || S.add.length>=2;
      note.textContent = !k ? 'Top-ups do not apply: '+G[S.g].chip.replace(/ \(.*/,'')+' has no daily curve in this model. Combining with a stimulant is a specialist decision.' : (S.add.length>=2 ? 'Maximum of two top-ups in this model.' : '');
      var sl='';
      if(k){ sl = G[S.g].drug==='mph' ? 'Ritalin and Medikinet tablet SmPCs (4.2): the last dose should, in general, not be given within 4 hours before bedtime.'
        : (S.g==='lis' ? 'Elvanse SPC: afternoon doses should be avoided because of the potential for insomnia. Dexamfetamine SPC: doses should not be taken too late after lunchtime, to avoid disturbing sleep.' : 'Dexamfetamine SPC: doses should not be taken too late after lunchtime, to avoid disturbing sleep.'); }
      var sp=$('.dy-sleep'); sp.textContent=sl; sp.hidden=!sl;
      lastReg='';
    }

    /* ----- model: unchanged ----- */
    function compute(){
      var g=G[S.g], key=JSON.stringify([S.g,S.b,S.d,S.t,S.add]);
      if(key===lastKey) return curves; lastKey=key;
      var doses=[];
      if(g.flat){ curves={flat:true, doses:[], total:null}; return curves; }
      var f=g.factor||1, base=unit(g.model), scale=0.85/(peakOf(base)*S.d*f);
      function place(model, mg, fac, tmin){
        var un=unit(model), a=new Float64Array(N), off=Math.round((tmin/60-H0)/DT);
        for(var i=off;i<N;i++) a[i]=un[i-off]*mg*fac*scale; return a;
      }
      doses.push({lbl:g.brands[S.b].replace(/ \(.*\)$/,'')+' '+S.d+' mg', t:S.t, a:place(g.model,S.d,f,S.t), col:COLS[0]});
      var k=addKind();
      S.add.forEach(function(ad,i){ doses.push({lbl:k.name+' '+ad.d+' mg', t:ad.t, a:place(k.model,ad.d,k.factor,ad.t), col:COLS[i+1]}); });
      var tot=new Float64Array(N); doses.forEach(function(d){ for(var i=0;i<N;i++) tot[i]+=d.a[i]; });
      var segs=[], inW=false, s0=0, pk=0, pkI=0, tooT=null, hiT=null;
      for(var i=0;i<N;i++){ var L=tot[i]; if(L>pk){pk=L;pkI=i;} if(L>=TOO && tooT===null) tooT=i; if(L>WHI && hiT===null) hiT=i;
        if(L>=WLO && !inW){inW=true;s0=i;} if((L<WLO||i===N-1) && inW){inW=false; segs.push([s0,i]);} }
      var cover=segs.reduce(function(a,s){return a+(s[1]-s[0])*DT;},0);
      curves={doses:doses,total:tot,segs:segs,cover:cover,pk:pk,pkI:pkI,tooT:tooT,hiT:hiT};
      return curves;
    }
    function iOf(mins){ return clamp(Math.round((mins/60-H0)/DT),0,N-1); }
    function minOf(i){ return (H0+i*DT)*60; }
    function lvl(mins){ return curves.flat?0.7:curves.total[iOf(mins)]; }

    /* ----- chart (light, drawn at the real pixel width so the text stays readable) ----- */
    function draw(){
      var c=curves, W=Math.round(wrap.clientWidth);
      if(W<150){ geo=null; return; }
      var narrow=W<460, H=narrow?224:292, ML=14, MR=14, PT=30, PB=30, PW=W-ML-MR, PH=H-PT-PB;
      geo={W:W,ML:ML,PW:PW};
      function X(m){ return ML+PW*(m/60-H0)/(H1-H0); }
      function Y(L){ return PT+PH*(1-clamp(L,0,YMAX)/YMAX); }
      var base=Y(0), s='', bed=bedOf(), i;
      s+='<rect x="'+ML+'" y="'+PT+'" width="'+PW+'" height="'+(Y(TOO)-PT)+'" fill="#fbe9e4"/>';
      s+='<text x="'+(ML+6)+'" y="'+(PT+15)+'" class="dy-zt" fill="#a8432e">TOO MUCH</text>';
      s+='<rect x="'+ML+'" y="'+Y(WHI)+'" width="'+PW+'" height="'+(Y(WLO)-Y(WHI))+'" fill="#e4f5ea"/>';
      s+='<text x="'+(ML+6)+'" y="'+(Y(WHI)+15)+'" class="dy-zt" fill="#1d7a3e">WINDOW</text>';
      for(var hh=6;hh<=24;hh+=3){ var gx=X(hh*60);
        s+='<line x1="'+gx+'" y1="'+PT+'" x2="'+gx+'" y2="'+base+'" stroke="#16324f" stroke-opacity=".12" stroke-dasharray="2 4"/>';
        s+='<text x="'+gx+'" y="'+(base+18)+'" class="dy-ax" text-anchor="'+(hh===24?'end':'middle')+'">'+pad2(hh%24===0?24:hh)+'</text>'; }
      s+='<line x1="'+ML+'" y1="'+base+'" x2="'+(W-MR)+'" y2="'+base+'" stroke="#8796a5" stroke-width="1.5"/>';
      var bx=X(bed);
      s+='<line x1="'+bx+'" y1="'+PT+'" x2="'+bx+'" y2="'+base+'" stroke="#6b4fa3" stroke-width="1.8" stroke-dasharray="3 4"/>';
      s+='<text x="'+(bx-5)+'" y="'+(PT+15)+'" class="dy-zt" fill="#6b4fa3" text-anchor="end">BED '+hhmm(bed)+'</text>';
      if(c.flat){
        s+='<path d="M'+X(300)+','+Y(0.7)+'L'+X(1440)+','+Y(0.7)+'" stroke="#1d7a3e" stroke-width="4" stroke-linecap="round" fill="none"/>';
        s+='<text x="'+(ML+PW/2)+'" y="'+(Y(0.7)-12)+'" class="dy-ax" text-anchor="middle" fill="#16324f">no daily peak stated (SmPC)</text>';
      } else {
        var pth=function(a){ var d='',step=10; for(var j=0;j<N;j+=step){ d+=(j?'L':'M')+X(minOf(j)).toFixed(1)+','+Y(a[j]).toFixed(1); } d+='L'+X(minOf(N-1)).toFixed(1)+','+Y(a[N-1]).toFixed(1); return d; };
        if(c.doses.length>1) c.doses.forEach(function(d){ s+='<path d="'+pth(d.a)+'" stroke="'+d.col+'" stroke-width="2.4" stroke-dasharray="6 4" fill="none"/>'; });
        s='<defs><linearGradient id="'+u+'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16324f" stop-opacity=".22"/><stop offset="1" stop-color="#16324f" stop-opacity="0"/></linearGradient></defs>'+s;
        s+='<path d="'+pth(c.total)+'L'+X(1440)+','+base+'L'+X(300)+','+base+'Z" fill="url(#'+u+'g)"/>';
        s+='<path d="'+pth(c.total)+'" stroke="#16324f" stroke-width="3.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>';
        c.doses.forEach(function(d){ var x=X(d.t); s+='<path d="M'+x+','+(base-1)+'l-8,-13h16z" fill="'+d.col+'" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>'; });
      }
      var tx=X(S.time), ty=Y(lvl(S.time)), tw=46, tgx=clamp(tx-tw/2,ML,W-MR-tw);
      s+='<line x1="'+tx+'" y1="'+(PT-2)+'" x2="'+tx+'" y2="'+base+'" stroke="#16324f" stroke-width="1.6" opacity=".6"/>';
      s+='<circle cx="'+tx+'" cy="'+ty+'" r="14" fill="#16324f" opacity=".12"/><circle cx="'+tx+'" cy="'+ty+'" r="8.5" fill="#fff" stroke="#16324f" stroke-width="3.2"/>';
      s+='<rect x="'+tgx+'" y="2" width="'+tw+'" height="22" rx="11" fill="#16324f"/><text x="'+(tgx+tw/2)+'" y="17.5" class="dy-ctag" text-anchor="middle" fill="#fff">'+hhmm(S.time)+'</text>';
      svg.setAttribute('viewBox','0 0 '+W+' '+H); svg.setAttribute('width',W); svg.setAttribute('height',H);
      svg.innerHTML=s;
      var sm=c.flat?'Flat line: the SmPC gives no daily peak or length of effect.':'Combined level is in the window for about '+c.cover.toFixed(1)+' hours'+(c.segs.length?', from '+hhmm(minOf(c.segs[0][0]))+' to '+hhmm(minOf(c.segs[c.segs.length-1][1])):'')+'. Peak at '+hhmm(minOf(c.pkI))+'.';
      svg.setAttribute('aria-label','Day profile chart. '+sm+' Time marker at '+hhmm(S.time)+'.');
    }
    function caption(){
      var c=curves;
      $('.dy-cap').textContent=(!c.flat&&c.doses.length>1?'Solid line: combined level. Dashed lines: each dose. ':'')+'Heights are relative (schematic), not blood levels.';
    }

    /* ----- state at the time marker ----- */
    function stateAt(){
      var g=G[S.g], c=curves;
      if(c.flat) return {k:'steady',tone:'ok',badge:'No daily curve',title:'No daily peak stated in the SmPC'};
      var L=lvl(S.time), Lp=lvl(S.time-15), first=S.t;
      if(S.time<first) return {k:'before',tone:'low',badge:'Before dose',title:'Before the morning dose: untreated baseline'};
      if(L>=TOO) return {k:'too',tone:'danger',badge:'Too much',title:'Combined level in the "too much" zone'};
      if(L>WHI) return {k:'above',tone:'high',badge:'Above window',title:'Above the usual window'};
      if(L>=WLO) return {k:'in',tone:'ok',badge:'In window',title:'Within the therapeutic window'};
      if(L>=Lp && L>0.02) return {k:'build',tone:'mid',badge:'Building',title:'Level rising, effect starting'};
      if(L>0.12) return {k:'wear',tone:'warn',badge:'Wearing off',title:'Below the window: wearing off'};
      return {k:'off',tone:'low',badge:'Worn off',title:'Worn off: back to baseline'};
    }
    function nowText(st){
      var g=G[S.g], c=curves, t=hhmm(S.time), name=g.brands[S.b].replace(/ \(.*\)$/,'');
      if(st.k==='steady') return '<p><strong>'+t+':</strong> '+(g.id==='ato'?'atomoxetine':'guanfacine')+' has no release curve in this model. The SmPC gives no daily peak or trough of clinical effect, so the chart cannot show how symptoms change across the day: ask the person, including before school or work and at bedtime. NICE says non-stimulants can take longer to have an effect than stimulants, and the SmPC gives no time to full effect.</p>';
      var since=(S.time-S.t)/60, base='';
      if(st.k==='before') base='No medicine yet: symptoms are at their untreated level. Getting up, dressed and out of the door can be the hardest part of the day for some families.';
      else if(st.k==='build') base=since.toFixed(1).replace('.0','')+' h after the morning dose, the level is rising but not yet in the window. Effect is just starting.';
      else if(st.k==='in') base='The combined level is in the window: concentration, impulse control and the ability to stay on task should be at their best. In total this regimen gives about <strong>'+c.cover.toFixed(1)+' h</strong> in the window.';
      else if(st.k==='above') base='Above the usual window. This is a common place for over-focus, feeling "wired", headache, low appetite and raised pulse. A single product titrated correctly should not sit here for long; overlapping doses are the usual cause.';
      else if(st.k==='too') base='The overlap of doses pushes the combined level into the "too much" zone. Expect agitation, anxiety, palpitations, tremor or a flat, "zombie-like" state, as well as more insomnia and appetite loss.';
      else if(st.k==='wear') base='The level has fallen below the window, so symptoms are returning. Some people have a "rebound" of irritability, tearfulness or hyperactivity as a dose wears off.';
      else base='The medicine has worn off and symptoms are back to baseline.';
      return '<p><strong>'+t+' ('+esc(name)+'):</strong> '+base+'</p>';
    }
    function addRisk(){
      var g=G[S.g], each=[], rest=[];
      if(!S.add.length){ rest.push(g.flat?'<p>Not applicable to a non-stimulant in this model.</p>':'<p>No top-ups added. NICE suggests considering an MR methylphenidate preparation in the morning plus an IR dose at another time of day to extend the duration of effect (NG87 1.7.22). Use <em>Add a top-up</em> to see the effect.</p>'); return {each:each,rest:rest}; }
      var bed=bedOf();
      S.add.forEach(function(a,i){
        var gap=(bed-a.t)/60, gs=gap.toFixed(1).replace('.0','');
        each.push({tone:gap<4.5?'high':gap<6?'warn':'ok', html:'<strong>Top-up '+(i+1)+' ('+a.d+' mg at '+hhmm(a.t)+'):</strong> '+(gap<4.5?'only '+gs+' h before bedtime: there is a high risk that it is still active at bedtime and delays sleep onset.':gap<6?'taken '+gs+' h before bedtime: some effect may remain at bedtime; check sleep.':'well before bedtime, so the effect on sleep onset should be small, though this varies.')});
      });
      if(curves.tooT!==null) rest.push('<p><strong>Overlap:</strong> the top-up lands while the morning dose is still high, so the combined level enters the "too much" zone at '+hhmm(minOf(curves.tooT))+'. A smaller top-up or a later time (if sleep allows) may be safer. This is a prescriber decision.</p>');
      else if(curves.hiT!==null) rest.push('<p><strong>Overlap:</strong> the combined level goes above the usual window from '+hhmm(minOf(curves.hiT))+'. Watch for over-focus, headache, appetite loss and raised pulse.</p>');
      if(g.drug==='mph') rest.push('<p><strong>Cumulative dose:</strong> top-ups count towards the total daily methylphenidate dose and the licensed maximum (see warnings above).</p>');
      if(g.id==='mphir'||g.id==='dex') rest.push('<p>For IR-only regimens the "top-ups" are simply the usual 2nd and 3rd doses of the day. The Ritalin SPC notes that if the effect wears off too early in the evening, disturbed behaviour and/or difficulty sleeping may recur. A small evening dose may help, weighing the pros and cons against problems falling asleep.</p>');
      if(g.id==='lis') rest.push('<p><strong>Lisdexamfetamine + dexamfetamine IR</strong> is outside NG87 1.7.22, which covers methylphenidate only. It is specialist-only practice. The Elvanse SPC advises avoiding afternoon doses because of insomnia.</p>');
      if(g.id==='mk') rest.push('<p>Medikinet XL already contains 50% IR. In adults the SPC allows a split dose (morning and lunchtime, with or after meals); a top-up IR dose adds to this.</p>');
      return {each:each,rest:rest};
    }
    function patientText(st){
      var g=G[S.g];
      if(g.flat) return g.id==='ato'?'<p>Take at the same time each day, with or without food. It can take longer to start working than a stimulant, so do not judge it, or stop it, in the first few days. Common early effects include stomach upset, reduced appetite, nausea and sleepiness, which often settle. Report low mood, agitation or any thoughts of self-harm straight away. Seek urgent help for jaundice or dark urine (rare liver injury).</p>':'<p>Take once a day at the same time, and avoid taking it with a high-fat meal or grapefruit juice (SPC). Sleepiness, tiredness, dizziness on standing and lower blood pressure are common, especially early on and after dose increases. <strong>Do not stop suddenly</strong>, because blood pressure can rebound; ask before stopping.</p>';
      var p={before:'Mornings before the dose may be chaotic: plan routines, and give the dose early enough that it is working by the start of school or work.',
        build:'The first hour can feel no different. Breakfast before or with the dose helps appetite later in the day.',
        'in':'Best time for demanding tasks: lessons, exams, driving, homework. Lunch appetite is often reduced at this point, so offer a good breakfast and a snack after school.',
        above:'May feel jittery, over-focused or have a headache, with little appetite. If this happens every day, mention it: the timing or dose may need adjusting.',
        too:'Unpleasant: racing heart, anxiety, feeling shaky or "flat". If this happens, tell the prescriber; do not take extra doses on your own.',
        wear:'Symptoms return. Some children are irritable or tearful at this time ("rebound"), so plan calm activities and a substantial snack or meal.',
        off:'Back to baseline. Appetite usually returns, which is a good time for the main meal (NG87 1.8.6 suggests extra meals early morning or late evening).'};
      return '<p>'+p[st.k]+'</p>';
    }
    function pharmText(){
      var g=G[S.g], li=[];
      if(g.drug==='mph'&&g.id!=='mphir') li.push('<strong>Prescribe and dispense by brand:</strong> MR methylphenidate products differ in their IR:MR ratio and profile (MHRA 2022). Do not switch between brands, or between ratios (22:78, 50:50, 30:70), without the prescriber, and counsel the patient if a switch is planned (Module 9). Check the SPS list before treating products as interchangeable.');
      if(g.drug==='mph'||g.drug==='amf') li.push('<strong>Controlled drug (Schedule 2):</strong> the prescription needs the dose, strength, formulation and total quantity in words and figures, and it is valid for 28 days. A 30-day supply limit is recommended. An extra IR top-up is a separate item, with its own dose and quantity. Safe custody applies. For school doses, agree storage and a record with the school and send a separately labelled supply (Module 9).');
      if(g.flat) li.push('<strong>Not a controlled drug.</strong> '+(g.id==='gua'?'Monitor BP, pulse and sedation; taper on stopping. In adults guanfacine is off-label and needs tertiary ADHD service advice (NG87 1.7.17).':'Check for interacting CYP2D6 inhibitors (e.g. fluoxetine, paroxetine) (Module 7). Children\'s doses are weight-based.'));
      li.push('<strong>Monitoring:</strong> measure heart rate and BP before and after each dose change, and every 6 months (NG87 1.8.9). Track weight and appetite (1.8.5–1.8.6) and use a sleep diary if sleep problems appear (1.8.17).');
      if(S.add.length) li.push('<strong>Adding a dose:</strong> confirm that the prescriber intended it, that the timing fits sleep, and that the total stays within the licensed maximum. Record it as a dose change, which triggers HR and BP rechecks (1.8.9).');
      if(g.id==='mk') li.push('<strong>Medikinet XL must be taken with or after food</strong> (SPC). Check that breakfast is realistic.');
      if(g.id==='lis') li.push('<strong>Morning only:</strong> the Elvanse SPC advises avoiding afternoon doses (insomnia).');
      li.push('<strong>Before deciding it "has not worked",</strong> check that the trial was at an adequate dose for 6 weeks (NG87 1.7.8), and that the profile matched the hours of need.');
      return '<ul>'+li.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>';
    }
    function warnings(){
      var w=doseCheck(S);
      var bn=bnfNote(G[S.g],G[S.g].brands[S.b]||G[S.g].brands[0],S.age==='adult'); if(bn) w.push(['info',bn]);
      if(S.g==='lis') w.push(['info','Time in window is schematic (a threshold on a model curve). The Elvanse SPC reports effects still present at 13 h in children and 14 h in adults.']);
      var bed=bedOf();
      S.add.forEach(function(a,i){ if(a.t>=bed-300) w.push(['warn','Top-up '+(i+1)+' at '+hhmm(a.t)+' is less than 5 h before bedtime ('+hhmm(bed)+'): high risk of delayed sleep onset.']); });
      if(curves && !curves.flat && curves.tooT!==null) w.push(['danger','Combined level reaches the "too much" zone at '+hhmm(minOf(curves.tooT))+' (schematic).']);
      return w;
    }
    function bars(){
      var g=G[S.g], c=curves, L=lvl(S.time), bed=bedOf();
      if(c.flat){ var a=g.id==='ato';
        return [0.7, 0.7, 0.05, a?0.75:0.92, a?0.2:0.06, a?0.4:0.05]; }
      var focus = S.time<S.t?0.1: (L<=0.85 ? 0.1+0.85*Math.pow(clamp(L/0.85,0,1),0.9) : clamp(0.95-0.45*clamp((L-1.15)/0.7,0,1),0,1));
      var hw=0,n=0; for(var m=960;m<=1080;m+=6){ hw+=clamp(lvl(m)/WLO,0,1)>=1?1:clamp(lvl(m)/WLO,0,1)*0.6; n++; } hw/=n;
      var endI=c.segs.length?c.segs[c.segs.length-1][1]:0, endM=minOf(endI), reb=0;
      if(c.segs.length && endM<1430){ var drop=clamp((lvl(endM-45)-lvl(endM+45))/0.3,0,1), tw=(endM>=870&&endM<=1170)?1:(endM>1170&&endM<=1290)?0.75:0.45; reb=clamp((0.1+0.85*drop)*tw,0,1); }
      var app=clamp(1-0.75*clamp(L/1.25,0,1)-0.15*clamp((L-1.25)/0.5,0,1),0,1);
      var sl=clamp(lvl(bed)/0.45,0,1)*0.95+0.03;
      var bp=clamp(L/1.6,0,1);
      return [focus,hw,reb,app,sl,bp];
    }
    function tiles(){
      var c=curves, g=G[S.g], bl=lvl(bedOf());
      if(c.flat) return [{label:'Hours of cover',value:'Not stated (SmPC)',tone:'info'},{label:'Onset of benefit',value:'Can take longer (NICE)',tone:'info'},{label:g.id==='gua'?'BP / HR':'Controlled drug',value:g.id==='gua'?'Lowers: monitor':'No',tone:g.id==='gua'?'warn':'info'}];
      return [{label:'Time in window',value:'≈ '+c.cover.toFixed(1)+' h',tone:c.cover>=10?'ok':c.cover>=7?'mid':'warn'},
              {label:'In window',value:c.segs.length?hhmm(minOf(c.segs[0][0]))+'–'+hhmm(minOf(c.segs[c.segs.length-1][1])):'never',tone:'info'},
              {label:'Level at bedtime',value:bl>=WLO?'Still active':bl>0.15?'Some effect':'Low',tone:bl>=WLO?'high':bl>0.15?'warn':'ok'}];
    }

    /* ----- text blocks that follow the regimen ----- */
    function summaryHTML(){
      var g=G[S.g], name=esc(g.brands[S.b].replace(/ \(.*\)$/,'')), col=function(i){ return g.flat?'#1d7a3e':COLS[i]; };
      var p='<span class="dy-dc" style="--c:'+col(0)+'"><i aria-hidden="true"></i><b>'+name+' '+S.d+' mg</b>'+(g.flat?' once daily':' at '+hhmm(S.t))+'</span>';
      S.add.forEach(function(a,i){ p+='<span class="dy-dc" style="--c:'+COLS[i+1]+'"><i aria-hidden="true"></i><b>'+a.d+' mg IR</b> at '+hhmm(a.t)+'</span>'; });
      return p+'<span class="dy-sumage">'+(S.age==='child'?'Child 6–17':'Adult')+'</span>';
    }
    /* Steps 1 and 2 show every caution in full; step 3 (the chart) shows only the danger and important ones in full and
       folds the cautions and notes into one dropdown so the chart stays on screen. Nothing is dropped. */
    function checksHTML(compact, ar){
      var w=warnings().map(function(x,i){return {s:x[0],t:x[1],i:i};});
      var cut=compact?1:2, cap=compact?1:2;
      w.sort(function(a,b){return SEV[a.s][1]-SEV[b.s][1]||a.i-b.i;});
      var main=w.filter(function(x,i){return SEV[x.s][1]<=cut;}).slice(0,cap);
      var rest=w.filter(function(x){return main.indexOf(x)<0;});
      var li=function(x){return '<p class="dy-w dy-w-'+x.s+'"><b class="dy-wl">'+SEV[x.s][0]+'</b>'+x.t+'</p>';};
      var risk=(compact&&ar&&S.add.length)?'<h5 class="dy-sh">Top-up risks</h5>'+ar.each.map(function(x){return '<p>'+x.html+'</p>';}).join('')+ar.rest.join(''):'';
      var lab=compact?(risk?'Cautions, notes and top-up risks':main.length?'More cautions and dose notes':'Cautions and dose notes'):(main.length?'More dose and licence notes':'Dose and licence notes');
      var cnt=rest.length?' <span class="dy-ct dy-ct-'+rest[0].s+'">'+rest.length+'</span><span class="dy-sr"> (most serious: '+SEV[rest[0].s][0].toLowerCase()+')</span>':'';
      return main.map(li).join('')+((rest.length||risk)?'<details class="dy-more dy-notes"'+(notesOpen?' open':'')+'><summary>'+lab+cnt+'</summary>'+rest.map(li).join('')+risk+'</details>':'');
    }

    function setMeters(vals){
      var rows=$$('.dy-m');
      vals.forEach(function(v,i){ var r=rows[i]; if(!r) return; var p=Math.round(clamp(v,0,1)*100);
        r.querySelector('.dy-mf').style.transform='scaleX('+(p/100)+')';
        r.setAttribute('aria-valuenow',p); r.setAttribute('aria-valuetext',p+' out of 100, '+(METERS[i].good?'higher is better':'lower is better')); });
    }

    var verdictKey='';
    function render(){
      raf=0; compute(); draw(); caption();
      var hh=hhmm(S.time);
      out.textContent=hh; range.value=S.time; range.setAttribute('aria-valuetext',hh); XP.rangeFill(range);
      $$('.dy-jump button').forEach(function(c){ c.setAttribute('aria-pressed', +c.dataset.tm===S.time?'true':'false'); });
      var st=stateAt(), vk=st.k+lastKey+S.age;
      var V=$('.dy-verdict');
      if(vk!==verdictKey){ verdictKey=vk;
        $('.dy-badge').textContent=st.badge; $('.dy-vt').textContent=st.title; V.dataset.tone=st.tone;
        setHTML($('.dy-ptx'),patientText(st));
      }
      setHTML($('.dy-now'),nowText(st));
      var rk=lastKey+S.age+S.b;
      if(rk!==lastReg){ lastReg=rk;
        $('.dy-shape').innerHTML=G[S.g].shape; $('.dy-phx').innerHTML=pharmText();
        var ar=addRisk(), cks=checksHTML(false), ck3=checksHTML(true,ar); $$('.dy-checks').forEach(function(e){ e.innerHTML=e.classList.contains('dy-checks3')?ck3:cks; });
        $$('.dy-add').forEach(function(card,i){ var gp=card.querySelector('.dy-gap'), x=ar.each[i]; if(x){ gp.className='dy-gap dy-g-'+x.tone; gp.innerHTML=x.html; } });
        var has=S.add.length>0;
        $('.dy-empty').innerHTML=has?'':ar.rest.join(''); $('.dy-empty').hidden=has;
        var rd=$('.dy-risk'); rd.hidden=!has; $('.dy-addx').innerHTML=has?ar.rest.join(''):'';
        var tl=tiles(); $('.dy-stats').innerHTML=tl.map(function(t){return '<div class="dy-s dy-s-'+t.tone+'"><dt>'+esc(t.label)+'</dt><dd>'+esc(t.value)+'</dd></div>';}).join('');
        $$('.dy-scen .dy-chip').forEach(function(c,i){ var s=SCEN[i].s; c.setAttribute('aria-pressed', (s.g===S.g&&s.d===S.d&&s.t===S.t&&JSON.stringify(s.add)===JSON.stringify(S.add.map(function(a){return {d:a.d,t:a.t};})))?'true':'false'); });
      }
      var sh=summaryHTML(); $$('.dy-sum').forEach(function(e){ setHTML(e,sh); }); $('.dy-sum1').hidden=!S.add.length;
      setMeters(bars());
    }
    function req(){ if(!raf) raf=requestAnimationFrame(render); }

    /* ----- steps ----- */
    /* After a step change, bring the new step into view just below the page's sticky bars (the top bar and this lesson's bar). */
    function bring(n){
      var sb=0, ls=R.closest('.lessons'), bars=[document.querySelector('.topbar'), ls&&ls.querySelector(':scope > .ls-bar')];
      bars.forEach(function(e){ if(!e) return; var pos=getComputedStyle(e).position; if(pos==='sticky'||pos==='fixed'){ var b=e.getBoundingClientRect().bottom; if(b>sb) sb=b; } });
      var r=(n===3?panes[2]:R).getBoundingClientRect();
      if(r.top<sb+2 || r.top>window.innerHeight*0.5) window.scrollTo(0, window.pageYOffset+r.top-sb-8);
    }
    function go(n, quiet){
      S.step=n; R.dataset.step=n;
      panes.forEach(function(p,i){ p.hidden=(i+1)!==n; });
      tks.forEach(function(t,i){ if(i+1===n) t.setAttribute('aria-current','step'); else t.removeAttribute('aria-current'); t.classList.toggle('done',i+1<n); t.querySelector('.dy-tn').innerHTML=(i+1<n)?ICON.check:String(i+1); });
      render();
      if(!quiet){ var hd=panes[n-1].querySelector('.dy-h'); try{ hd.focus({preventScroll:true}); }catch(e){ hd.focus(); } bring(n); }
    }
    function full(){ brandsAndDoses(); syncPressed(); renderAdds(); render(); }

    /* ----- events ----- */
    tks.forEach(function(t){ t.addEventListener('click',function(){ go(+t.dataset.go); }); });
    $$('[data-nav]').forEach(function(b){ b.addEventListener('click',function(){ go(+b.dataset.nav); }); });
    $$('.dy-scen .dy-chip').forEach(function(c,i){ c.addEventListener('click',function(){ var s=SCEN[i].s; S.g=s.g;S.b=s.b;S.d=s.d;S.t=s.t;S.age=s.age;S.add=s.add.map(function(a){return {d:a.d,t:a.t};}); if(s.add.length) S.time=s.add[s.add.length-1].t+60; full(); go(3); }); });
    $$('.dy-meds .dy-pick').forEach(function(c){ c.addEventListener('click',function(){ S.g=c.dataset.g; S.b=0; S.d=G[S.g].def; full(); }); });
    $('.dy-age').addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; S.age=b.dataset.age; syncPressed(); render(); });
    $('.dy-dose').addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; S.d=+b.dataset.d; syncPressed(); render(); });
    selB.addEventListener('change',function(){ S.b=+selB.value; brandsAndDoses(); syncPressed(); renderAdds(); render(); });
    selT.addEventListener('change',function(){ S.t=+selT.value; render(); });
    $$('.dy-jump button').forEach(function(c){ c.addEventListener('click',function(){ S.time=+c.dataset.tm; render(); }); });
    $('.dy-addbtn').addEventListener('click',function(){
      var k=addKind(); if(!k||S.add.length>=2) return;
      var last=S.add.length?S.add[S.add.length-1].t+180:(G[S.g].id==='mphir'||G[S.g].id==='dex'?720:840);
      S.add.push({d:k.doses[Math.min(1,k.doses.length-1)],t:Math.min(last,1140)}); renderAdds(); render();
      var card=$$('.dy-add').pop(); if(card){ var f=card.querySelector('.dy-seg button'); if(f) f.focus(); }
    });
    $('.dy-adds').addEventListener('change',function(e){ var s=e.target; if(s.tagName!=='SELECT') return; S.add[+s.dataset.i].t=+s.value; render(); });
    $('.dy-adds').addEventListener('click',function(e){
      var rm=e.target.closest('.dy-rm');
      if(rm){ S.add.splice(+rm.dataset.i,1); renderAdds(); render(); $('.dy-addbtn').focus(); return; }
      var b=e.target.closest('.dy-seg button'); if(!b) return;
      var i=+b.dataset.i; S.add[i].d=+b.dataset.d;
      Array.prototype.forEach.call(b.parentNode.children,function(x){ x.setAttribute('aria-pressed',x===b?'true':'false'); });
      render();
    });
    R.addEventListener('toggle',function(e){ if(e.target.classList&&e.target.classList.contains('dy-notes')){ notesOpen=e.target.open; } },true);
    range.addEventListener('input',function(){ S.time=+range.value; req(); });

    /* touch, mouse and pen on the chart: drag to move the time marker (vertical swipes still scroll the page) */
    var dragging=false;
    function timeFromX(cx){ var r=svg.getBoundingClientRect(), x=(cx-r.left)*(geo.W/r.width), f=clamp((x-geo.ML)/geo.PW,0,1); return clamp(Math.round((H0*60+f*(H1-H0)*60)/15)*15,300,1440); }
    function moveTo(cx){ if(!geo) return; var m=timeFromX(cx); if(m!==S.time){ S.time=m; req(); } }
    svg.addEventListener('pointerdown',function(e){ dragging=true; try{ svg.setPointerCapture(e.pointerId); }catch(x){} moveTo(e.clientX); });
    svg.addEventListener('pointermove',function(e){ if(dragging) moveTo(e.clientX); });
    ['pointerup','pointercancel','lostpointercapture'].forEach(function(t){ svg.addEventListener(t,function(){ dragging=false; }); });
    wrap.addEventListener('keydown',function(e){
      var d={ArrowRight:15,ArrowLeft:-15,PageUp:60,PageDown:-60}[e.key]; var m;
      if(e.key==='Home') m=300; else if(e.key==='End') m=1440; else if(d!=null) m=clamp(S.time+d,300,1440); else return;
      e.preventDefault(); S.time=m; req();
    });
    if(window.ResizeObserver){ var lastW=0; new ResizeObserver(function(){ var w=Math.round(wrap.clientWidth); if(w&&w!==lastW){ lastW=w; if(curves) draw(); } }).observe(wrap); }
    else window.addEventListener('resize',function(){ if(curves) draw(); });

    full(); go(1,true);
  }
  XP.dayBuilder = build;

  function init(){
    document.querySelectorAll('.xp-mount[data-xp]').forEach(function(m){
      var k=m.dataset.xp;
      try{
        if(XP.registry && XP.registry[k]) XP.registry[k](m);
        else if(k==='day') build(m);
        else if(k==='pfc' && XP.cfgPFC) XP.make(m, XP.cfgPFC);
        else if(k==='tit' && XP.cfgTit) XP.make(m, XP.cfgTit);
        else if(k==='imp' && XP.cfgImp) XP.make(m, XP.cfgImp);
      }catch(e){ if(window.console) console.error('Explorer '+k+' failed', e); }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
