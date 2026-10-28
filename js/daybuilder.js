/* Medication day-profile builder. A schematic teaching model built from SPC descriptions of release
   (IR:MR ratios, Tmax, duration). Relative levels only, not pharmacokinetic data. */
(function(){
  'use strict';
  var XP = window.XP; if(!XP) return;
  var clamp=XP.clamp, esc=XP.esc, T=XP.t;
  var DT=0.02, H0=5, H1=24, N=Math.round((H1-H0)/DT)+1;
  var WLO=0.36, WHI=1.25, TOO=1.5, YMAX=2;

  /* ---------- formulation models (tuned so cover is about the SPC durations) ---------- */
  var MODEL = {
    ir:   {comps:[{frac:1,lag:0,ka:1.8}], ke:0.36},
    /* v5 (21 Oct 2026) re-fitted to SmPC 5.2 timings: Equasym XL peaks ~1.5 h and ~4.5 h; Medikinet XL second rise
       ~3 h after the first with a 3-4 h plateau >=75% of peak; Ritalin XL-type peaks 1-2 h and 5-7 h (~4 h apart);
       Concerta XL initial maximum 1-2 h, peak 6-8 h (Tmax 6.8 h), ~12 h. Checked with build/pkcheck.js. */
    eq:   {comps:[{frac:.3,lag:0,ka:1.8},{frac:.7,lag:1.2,zero:[6,[[0,.2],[.3,1],[1,0]]]}], ke:0.36},
    mk:   {comps:[{frac:.5,lag:0,ka:1.8},{frac:.5,lag:1.0,zero:[4,[[0,0],[.5,1],[1,0]]]}], ke:0.36},
    rxl:  {comps:[{frac:.5,lag:0,ka:1.4},{frac:.5,lag:4.2,ka:1.0}], ke:0.36},
    oros: {comps:[{frac:.22,lag:0,ka:2.2},{frac:.78,lag:0.6,zero:[10,[[0,.3],[.5,1.3],[1,.2]]]}], ke:0.40},
    dex:  {comps:[{frac:1,lag:0,ka:1.0}], ke:0.28},
    lis:  {comps:[{frac:1,lag:0,ka:1.5}], ke:0.12, kc:0.6}
  };
  function interp(pts,u){ for(var i=0;i<pts.length-1;i++){ var a=pts[i],b=pts[i+1]; if(u>=a[0]&&u<=b[0]) return a[1]+(b[1]-a[1])*(u-a[0])/(b[0]-a[0]); } return 0; }
  var unitCache={};
  function unit(key){
    if(unitCache[key]) return unitCache[key];
    var m=MODEL[key], out=new Float64Array(N), gut=m.comps.map(function(){return 0;}), pro=0, cen=0;
    var areas=m.comps.map(function(c){ if(!c.zero) return 0; var p=c.zero[1],a=0; for(var i=0;i<p.length-1;i++) a+=(p[i+1][0]-p[i][0])*(p[i][1]+p[i+1][1])/2; return a; });
    for(var i=0;i<N;i++){
      var t=i*DT, inp=0;
      m.comps.forEach(function(c,j){
        if(c.zero){ var D=c.zero[0]; if(t>=c.lag && t<c.lag+D) inp+=c.frac*interp(c.zero[1],(t-c.lag)/D)/areas[j]/D*DT; }
        else { if(Math.abs(t-c.lag)<DT/2) gut[j]+=c.frac; var a=gut[j]*c.ka*DT; gut[j]-=a; inp+=a; }
      });
      if(m.kc){ pro+=inp; var cv=pro*m.kc*DT; pro-=cv; inp=cv; }
      cen+=inp-cen*m.ke*DT; out[i]=cen;
    }
    return (unitCache[key]=out);
  }
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
    if(g.id==='dex'){ if(adult) w.push(['high','Dexamfetamine is not licensed for adults with ADHD in the UK (off-label, specialist use; see Module 5).']); if(tot>40) w.push(['danger','Total dexamfetamine '+tot+' mg/day is above 40 mg/day.'+OFF]); else if(!adult&&tot>20) w.push(['warn','Total dexamfetamine '+tot+' mg/day: the usual maximum in children is 20 mg; up to 40 mg only in some older children (SPC).']); else w.push(['info','Total dexamfetamine: '+tot+' mg/day.']); }
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
     shape:'<p><strong>Non-stimulant, steady effect:</strong> atomoxetine is a selective noradrenaline reuptake inhibitor. Plasma levels still rise and fall each day, but the clinical benefit builds gradually over <em>weeks</em> and is not tied to a daily peak. So there is no "wearing off" curve: the model shows a flat line once steady effect is reached. It can be given once daily in the morning or split into two doses (morning and late afternoon or early evening) if not tolerated or not effective once daily (SPC). It is not a controlled drug.</p>'},
    {id:'gua', chip:'Guanfacine (Intuniv)', drug:'gua', flat:true, brands:['Intuniv prolonged-release tablets'],
     doses:[1,2,3,4,5,6,7], def:2, childMax:4, adultMax:0,
     shape:'<p><strong>Non-stimulant α2A agonist, steady effect:</strong> guanfacine prolonged-release is taken once daily (morning or evening) and titrated in 1 mg steps no more often than weekly. Benefit builds over weeks rather than hours, so the model shows a flat line. Unlike stimulants it <em>lowers</em> blood pressure and heart rate, and it commonly causes sleepiness. It must not be stopped abruptly because of rebound hypertension: taper it (SPC). It is not a controlled drug.</p>'}
  ];
  var G={}; GROUPS.forEach(function(g){ G[g.id]=g; });
  var TIMES=[]; for(var m=360;m<=570;m+=30) TIMES.push(m);
  var ADD_T=[]; for(m=600;m<=1140;m+=30) ADD_T.push(m);
  function hhmm(mins){ mins=Math.round(mins); if(mins>=1440) return '24:00'; var h=Math.floor(mins/60)%24, mm=mins%60; return (h<10?'0':'')+h+':'+(mm<10?'0':'')+mm; }
  var COLS=['#6fb3f2','#f2c14e','#b79cff'];
  var SCEN=[
    {label:'School day: Concerta XL 36 mg', s:{g:'oros',b:0,d:36,t:450,age:'child',add:[]}},
    {label:'Medikinet XL + IR at 14:00', s:{g:'mk',b:0,d:20,t:450,age:'child',add:[{d:10,t:840}]}},
    {label:'IR three times daily', s:{g:'mphir',b:0,d:10,t:450,age:'child',add:[{d:10,t:720},{d:5,t:960}]}},
    {label:'Elvanse 30 mg', s:{g:'lis',b:0,d:30,t:450,age:'child',add:[]}},
    {label:'Late top-up at 18:00', s:{g:'oros',b:0,d:36,t:450,age:'child',add:[{d:10,t:1080}]}}
  ];
  var TCHIPS=[['Breakfast',450],['School',600],['Lunch',750],['Homework',990],['Evening',1110],['Bedtime',1260]];

  function opt(v,l,sel){ return '<option value="'+v+'"'+(sel?' selected':'')+'>'+esc(l)+'</option>'; }

  function build(mount){
    var S={g:'oros',b:0,d:36,t:450,age:'child',add:[],time:600};
    var id='db', h='<div class="xp card-dark db" id="dayBuilder">'
      +'<p class="xp-kicker">Interactive model · Module 5</p><h3 class="xp-title">Medication day-profile builder</h3>'
      +'<p class="xp-intro">Build a regimen: choose the medicine, brand, dose and time, then add up to two immediate-release top-ups. Drag across the chart or use the time slider to see what is happening at each point in the day. <strong>Schematic, not pharmacokinetic data:</strong> relative levels only.</p>'
      +'<div class="xp-chart"><svg class="xp-svg" viewBox="0 0 360 250" role="img" aria-label="Day profile chart"></svg></div>'
      +'<div class="db-legend"></div>'
      +'<label class="xp-sl-label" for="db-r">Time of day <output class="xp-out" for="db-r"></output></label>'
      +'<input class="xp-range" id="db-r" type="range" min="300" max="1440" step="15" value="600">'
      +'<div class="xp-chips db-tchips" role="group" aria-label="Jump to time">'+TCHIPS.map(function(c,i){return '<button type="button" class="xp-chip" data-tm="'+c[1]+'" aria-pressed="false">'+c[0]+' '+hhmm(c[1])+'</button>';}).join('')+'</div>'
      +'<div class="db-warn" role="status"></div>'
      +'<div class="xp-state" aria-live="polite"><span class="xp-badge"></span><h4 class="xp-head"></h4></div>'
      +'<div class="xp-text db-now"></div>'
      +'<div class="xp-bars">'+XP.barsHTML([{label:'Focus now',tone:'pos'},{label:'Homework cover',sub:'16:00–18:00',tone:'pos2'},{label:'Evening rebound risk',sub:'whole day',tone:'neg'},{label:'Appetite now',sub:'higher = normal',tone:'pos'},{label:'Sleep-onset risk',sub:'level at bedtime',tone:'neg'},{label:'BP / HR load now',tone:'neg2'}])+'</div>'
      +'<h4 class="db-build">Build the regimen</h4>'
      +'<p class="db-step">Example regimens</p><div class="xp-chips db-scen" role="group" aria-label="Example regimens">'+XP.chipsHTML(SCEN)+'</div>'
      +'<p class="db-step">1 · Medicine</p><div class="xp-chips db-meds" role="group" aria-label="Medicine">'+GROUPS.map(function(g){return '<button type="button" class="xp-chip" data-g="'+g.id+'" aria-pressed="false">'+esc(g.chip)+'</button>';}).join('')+'</div>'
      +'<div class="db-form">'
      +'<label>2 · Brand / product<select class="db-brand"></select></label>'
      +'<label>3 · Dose<select class="db-dose"></select></label>'
      +'<label>4 · Morning dose time<select class="db-time">'+TIMES.map(function(t){return opt(t,hhmm(t),t===450);}).join('')+'</select></label>'
      +'<div class="db-age" role="group" aria-label="Patient"><span>5 · Patient</span><div class="xp-chips"><button type="button" class="xp-chip" data-age="child" aria-pressed="true">Child 6–17</button><button type="button" class="xp-chip" data-age="adult" aria-pressed="false">Adult</button></div></div>'
      +'</div>'
      +'<div class="db-adds"></div><button type="button" class="btn db-addbtn">+ Add a dose</button><p class="db-addnote"></p>'
      +'<div class="xp-tiles db-tiles"></div>'
      +'<details class="db-more" open><summary>Why the curve has this shape</summary><div class="db-shape"></div></details>'
      +'<details class="db-more db-addrisk" open><summary>Risks of the extra dose(s)</summary><div class="db-addx"></div></details>'
      +'<div class="xp-boxes"><div class="xp-box xp-pt"><h5>What this means for the patient</h5><div class="xp-ptx"></div></div>'
      +'<div class="xp-box xp-ph"><h5>Pharmacist action</h5><div class="xp-phx"></div></div></div>'
      +'<p class="xp-note">Schematic, not pharmacokinetic data. The curves are built from SPC descriptions of release (IR:MR ratio, Tmax, duration) using a simple one-compartment model, normalised so that the morning dose is assumed to be titrated into this person\'s window. Real levels and responses vary widely between people (NG87 1.7.21). Strengths shown: check the current product range (dm+d).</p>'
      +'<details class="xp-src"><summary>Sources</summary><ul>'
      +'<li>SPCs (emc): Ritalin; Medikinet tablets; Concerta XL; Xaggitin XL, Affenid XL, Xenidate XL (emc) and Delmosart (Accord UK SmPC) for 22:78 maxima (54 mg child, 72 mg adult). BNF/BNFC (accessed 21 Oct 2026): Concerta XL up to 108 mg/day (off-label), Delmosart and Xaggitin XL 54 mg/day in adults (SmPC 72 mg); this tool keeps each product\'s SmPC maximum and shows differing BNF figures as notes; Medikinet XL; Equasym XL; Elvanse; dexamfetamine; Strattera; Intuniv (sections 4.2, 5.2).</li>'
      +'<li>NICE NG87 (live text checked Oct 2026): 1.7.8, 1.7.17, 1.7.21, 1.7.22, 1.7.23, 1.8.6, 1.8.9, 1.8.17.</li>'
      +'<li>MHRA Drug Safety Update (2022): prescribe modified-release methylphenidate by brand.</li>'
      +'<li>SPS: Methylphenidate modified-release preparations (updated 28 Aug 2025).</li>'
      +'<li>Misuse of Drugs Regulations 2001 (Schedule 2 prescription requirements); Module 9.</li></ul></details>'
      +'</div>';
    mount.innerHTML=h;
    var R=mount.firstChild, $=function(s){return R.querySelector(s);};
    var svg=$('.xp-svg'), range=$('.xp-range'), out=$('.xp-out');
    var selB=$('.db-brand'), selD=$('.db-dose'), selT=$('.db-time');
    var curves=null, lastKey='', lastState='';

    function fillSelects(){
      var g=G[S.g];
      selB.innerHTML=g.brands.map(function(b,i){return opt(i,b,i===S.b);}).join('');
      var ds=(g.brandDoses&&g.brandDoses[g.brands[S.b]])||g.doses;
      if(ds.indexOf(S.d)<0) S.d=ds.indexOf(g.def)>=0?g.def:ds[0];
      selD.innerHTML=ds.map(function(d){return opt(d,d+' mg'+(g.id==='mphir'||g.id==='dex'?' (morning)':' once daily'),d===S.d);}).join('');
      selT.value=S.t;
      R.querySelectorAll('.db-meds .xp-chip').forEach(function(c){ c.setAttribute('aria-pressed', c.dataset.g===S.g?'true':'false'); });
      R.querySelectorAll('.db-age .xp-chip').forEach(function(c){ c.setAttribute('aria-pressed', c.dataset.age===S.age?'true':'false'); });
    }
    function addKind(){ var g=G[S.g]; return g.flat?null:(g.drug==='mph'?{name:'Methylphenidate IR',model:'ir',doses:[5,10,15,20],factor:1}:{name:'Dexamfetamine IR',model:'dex',doses:[5,10],factor:0.73}); }
    function renderAdds(){
      var k=addKind(), wrap=$('.db-adds');
      if(!k){ S.add=[]; }
      S.add.forEach(function(a){ if(k && k.doses.indexOf(a.d)<0) a.d=k.doses[1]; });
      wrap.innerHTML=S.add.map(function(a,i){
        return '<div class="db-add" style="--c:'+COLS[i+1]+'"><b>Extra dose '+(i+1)+' · '+esc(k.name)+'</b>'
          +'<label>Dose<select data-i="'+i+'" data-f="d">'+k.doses.map(function(d){return opt(d,d+' mg',d===a.d);}).join('')+'</select></label>'
          +'<label>Time<select data-i="'+i+'" data-f="t">'+ADD_T.map(function(t){return opt(t,hhmm(t),t===a.t);}).join('')+'</select></label>'
          +'<button type="button" class="db-rm" data-i="'+i+'" aria-label="Remove extra dose '+(i+1)+'">Remove</button></div>';
      }).join('');
      var btn=$('.db-addbtn'), note=$('.db-addnote');
      btn.disabled = !k || S.add.length>=2;
      note.textContent = !k ? 'Extra IR doses do not apply: '+G[S.g].chip.replace(/ \(.*/,'')+' gives a steady effect. Combining with a stimulant is a specialist decision.' : (S.add.length>=2 ? 'Maximum of two extra doses in this model.' : '');
    }

    function compute(){
      var g=G[S.g], key=JSON.stringify([S.g,S.b,S.d,S.t,S.add]);
      if(key===lastKey) return curves; lastKey=key;
      var doses=[];
      if(g.flat){ curves={flat:true, doses:[], total:null}; return curves; }
      var f=g.factor||1, base=unit(g.model), scale=0.85/(peakOf(base)*S.d*f);
      function place(model, mg, fac, tmin){
        var u=unit(model), a=new Float64Array(N), off=Math.round((tmin/60-H0)/DT);
        for(var i=off;i<N;i++) a[i]=u[i-off]*mg*fac*scale; return a;
      }
      doses.push({lbl:g.brands[S.b].replace(/ \(.*\)$/,'')+' '+S.d+' mg', t:S.t, a:place(g.model,S.d,f,S.t), col:COLS[0]});
      var k=addKind();
      S.add.forEach(function(ad,i){ doses.push({lbl:k.name+' '+ad.d+' mg', t:ad.t, a:place(k.model,ad.d,k.factor,ad.t), col:COLS[i+1]}); });
      var tot=new Float64Array(N); doses.forEach(function(d){ for(var i=0;i<N;i++) tot[i]+=d.a[i]; });
      // summary
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

    /* ----- chart ----- */
    var X0=44,X1=348,Y0=206,Y1=18;
    function X(mins){ return X0+(X1-X0)*(mins/60-H0)/(H1-H0); }
    function Y(L){ return Y0-(Y0-Y1)*clamp(L,0,YMAX)/YMAX; }
    function draw(){
      var c=curves, s='';
      s+='<rect x="'+X0+'" y="'+Y1+'" width="'+(X1-X0)+'" height="'+(Y(TOO)-Y1)+'" fill="#ff7b7b" opacity=".12"/>';
      s+=T(X0+6,Y1+17,'TOO MUCH',{fill:'#ff9a9a',weight:600,ls:1.2});
      s+='<rect x="'+X0+'" y="'+Y(WHI)+'" width="'+(X1-X0)+'" height="'+(Y(WLO)-Y(WHI))+'" fill="#5fd3a6" opacity=".13"/>';
      s+=T(X0+6,Y(WHI)+17,'WINDOW',{fill:'#7fe0b8',weight:600,ls:1.2});
      for(var hh=6;hh<=24;hh+=3){ s+='<line x1="'+X(hh*60)+'" y1="'+Y1+'" x2="'+X(hh*60)+'" y2="'+Y0+'" stroke="#2a4866" stroke-width="1"/>'+T(X(hh*60),Y0+20,(hh<10?'0':'')+hh,{anchor:'middle'}); }
      s+='<line x1="'+X0+'" y1="'+Y0+'" x2="'+X1+'" y2="'+Y0+'" stroke="#5f7a96"/>';
      s+=T((X0+X1)/2,Y0+40,'Time of day (24-hour clock)',{anchor:'middle'})+T(16,(Y0+Y1)/2,'Relative level (schematic)',{anchor:'middle',rot:-90});
      // bedtime marker
      var bed=S.age==='child'?1260:1350;
      s+='<line x1="'+X(bed)+'" y1="'+Y1+'" x2="'+X(bed)+'" y2="'+Y0+'" stroke="#b79cff" stroke-dasharray="2 4" opacity=".8"/>';
      if(c.flat){
        var d='M'+X(300)+','+Y(0.7)+'L'+X(1440)+','+Y(0.7);
        s+='<path d="'+d+'" stroke="#5fd3a6" stroke-width="4" fill="none"/>'+T(X(330),Y(0.7)-12,'steady effect after several weeks',{fill:'#dbe6f0'});
      } else {
        function pth(a){ var d='',step=10; for(var i=0;i<N;i+=step){ d+=(i?'L':'M')+X(minOf(i)).toFixed(1)+','+Y(a[i]).toFixed(1); } d+='L'+X(minOf(N-1)).toFixed(1)+','+Y(a[N-1]).toFixed(1); return d; }
        if(c.doses.length>1) c.doses.forEach(function(d){ s+='<path d="'+pth(d.a)+'" stroke="'+d.col+'" stroke-width="2.2" stroke-dasharray="6 5" fill="none"/>'; });
        s+='<path d="'+pth(c.total)+'L'+X(1440)+','+Y0+'L'+X(300)+','+Y0+'Z" fill="url(#dbg)" opacity=".35"/>';
        s='<defs><linearGradient id="dbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".5"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>'+s;
        s+='<path d="'+pth(c.total)+'" stroke="#ffffff" stroke-width="3.6" fill="none" stroke-linejoin="round"/>';
        c.doses.forEach(function(d){ var x=X(d.t); s+='<path d="M'+x+','+(Y0-1)+'l-7,-11h14z" fill="'+d.col+'" stroke="#0f2236" stroke-width="1.5"/>'; });
      }
      var tx=X(S.time), L=lvl(S.time);
      s+='<line x1="'+tx+'" y1="'+Y1+'" x2="'+tx+'" y2="'+Y0+'" stroke="#fff" stroke-width="1.5" opacity=".75"/>';
      s+='<circle cx="'+tx+'" cy="'+Y(L)+'" r="12" fill="#fff" opacity=".16"/><circle cx="'+tx+'" cy="'+Y(L)+'" r="7.5" fill="#0f2236" stroke="#fff" stroke-width="3"/>';
      svg.innerHTML=s;
      var lg=c.flat?'<span><i style="background:#5fd3a6"></i>Steady effect (no daily peak)</span>':c.doses.map(function(d){return '<span><i style="background:'+d.col+'"></i>'+esc(d.lbl)+' at '+hhmm(d.t)+'</span>';}).join('')+(c.doses.length>1?'<span><i class="tot"></i>Combined total (solid)</span>':'');
      $('.db-legend').innerHTML=lg+'<span><i class="bed"></i>Bedtime '+hhmm(bed)+'</span><span><i class="win"></i>Therapeutic window (schematic)</span><span><i class="too"></i>Too much</span>';
      var sm=c.flat?'Flat steady effect over 24 hours.':'Combined level is in the window for about '+c.cover.toFixed(1)+' hours'+(c.segs.length?', from '+hhmm(minOf(c.segs[0][0]))+' to '+hhmm(minOf(c.segs[c.segs.length-1][1])):'')+'. Peak at '+hhmm(minOf(c.pkI))+'.';
      svg.setAttribute('aria-label','Day profile chart. '+sm+' Cursor at '+hhmm(S.time)+'.');
    }

    /* ----- state at cursor ----- */
    function stateAt(){
      var g=G[S.g], c=curves;
      if(c.flat) return {k:'steady',tone:'ok',badge:'Steady state',title:'Steady 24-hour effect'};
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
      if(st.k==='steady') return '<p><strong>'+t+':</strong> '+(g.id==='ato'?'atomoxetine':'guanfacine')+' is not expected to give a daily peak or trough of effect once established. Benefit builds over several weeks, so symptoms are similar morning, afternoon and evening, including before school and at bedtime. There is no wearing-off and no need for afternoon top-ups.</p>';
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
    function shapeText(){ return G[S.g].shape; }
    function addRisk(){
      var g=G[S.g], k=addKind(), out=[];
      if(!S.add.length){ out.push(g.flat?'<p>Not applicable to a steady-effect non-stimulant.</p>':'<p>No extra doses added. NICE suggests considering an MR methylphenidate preparation in the morning plus an IR dose at another time of day to extend the duration of effect (NG87 1.7.22). Use <em>Add a dose</em> to see the effect.</p>'); return out.join(''); }
      var bed=S.age==='child'?1260:1350;
      S.add.forEach(function(a,i){
        var gap=(bed-a.t)/60, rest=lvl(bed);
        out.push('<p><strong>Extra dose '+(i+1)+' ('+a.d+' mg at '+hhmm(a.t)+'):</strong> '+(gap<4.5?'only '+gap.toFixed(1).replace('.0','')+' h before bedtime: there is a high risk that it is still active at bedtime and delays sleep onset.':gap<6?'taken '+gap.toFixed(1).replace('.0','')+' h before bedtime: some effect may remain at bedtime; check sleep.':'well before bedtime, so the effect on sleep onset should be small, though this varies.')+'</p>');
      });
      if(curves.tooT!==null) out.push('<p><strong>Overlap:</strong> the extra dose lands while the morning dose is still high, so the combined level enters the "too much" zone at '+hhmm(minOf(curves.tooT))+'. A smaller top-up or a later time (if sleep allows) may be safer. This is a prescriber decision.</p>');
      else if(curves.hiT!==null) out.push('<p><strong>Overlap:</strong> the combined level goes above the usual window from '+hhmm(minOf(curves.hiT))+'. Watch for over-focus, headache, appetite loss and raised pulse.</p>');
      if(g.drug==='mph') out.push('<p><strong>Cumulative dose:</strong> extra doses count towards the total daily methylphenidate dose and the licensed maximum (see warnings above).</p>');
      if(g.id==='mphir'||g.id==='dex') out.push('<p>For IR-only regimens the "extra doses" are simply the usual 2nd and 3rd doses of the day. The Ritalin SPC notes that if the effect wears off too early in the evening, disturbed behaviour and/or difficulty sleeping may recur. A small evening dose may help, weighing the pros and cons against problems falling asleep.</p>');
      if(g.id==='lis') out.push('<p><strong>Lisdexamfetamine + dexamfetamine IR</strong> is outside NG87 1.7.22, which covers methylphenidate only. It is specialist-only practice. The Elvanse SPC advises avoiding afternoon doses because of insomnia.</p>');
      if(g.id==='mk') out.push('<p>Medikinet XL already contains 50% IR. In adults the SPC allows a split dose (morning and lunchtime, with or after meals); an extra IR dose adds to this.</p>');
      return out.join('');
    }
    function patientText(st){
      var g=G[S.g];
      if(g.flat) return g.id==='ato'?'<p>Take at the same time each day, with or without food. Benefit builds over several weeks, so it should not be judged in the first few days. Common early effects include stomach upset, reduced appetite, nausea and sleepiness, which often settle. Report low mood, agitation or any thoughts of self-harm straight away. Seek urgent help for jaundice or dark urine (rare liver injury).</p>':'<p>Take once a day at the same time, and avoid taking it with a high-fat meal or grapefruit juice (SPC). Sleepiness, tiredness, dizziness on standing and lower blood pressure are common, especially early on and after dose increases. <strong>Do not stop suddenly</strong>, because blood pressure can rebound; ask before stopping.</p>';
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
      var bed=S.age==='child'?1260:1350;
      S.add.forEach(function(a,i){ if(a.t>=bed-300) w.push(['warn','Extra dose '+(i+1)+' at '+hhmm(a.t)+' is less than 5 h before bedtime ('+hhmm(bed)+'): high risk of delayed sleep onset.']); });
      if(curves && !curves.flat && curves.tooT!==null) w.push(['danger','Combined level reaches the "too much" zone at '+hhmm(minOf(curves.tooT))+' (schematic).']);
      return w;
    }

    function bars(){
      var g=G[S.g], c=curves, L=lvl(S.time), bed=S.age==='child'?1260:1350;
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
      var c=curves, g=G[S.g];
      if(c.flat) return [{label:'Hours of cover',value:'24 h (steady)',tone:'ok'},{label:'Onset of benefit',value:'Builds over weeks',tone:'info'},{label:g.id==='gua'?'BP / HR':'Controlled drug',value:g.id==='gua'?'Lowers: monitor':'No',tone:g.id==='gua'?'warn':'info'}];
      return [{label:'Time in window',value:'≈ '+c.cover.toFixed(1)+' h',tone:c.cover>=10?'ok':c.cover>=7?'mid':'warn'},
              {label:'In window',value:c.segs.length?hhmm(minOf(c.segs[0][0]))+'–'+hhmm(minOf(c.segs[c.segs.length-1][1])):'never',tone:'info'},
              {label:'Level at bedtime',value:lvl(S.age==='child'?1260:1350)>=WLO?'Still active':lvl(S.age==='child'?1260:1350)>0.15?'Some effect':'Low',tone:lvl(S.age==='child'?1260:1350)>=WLO?'high':lvl(S.age==='child'?1260:1350)>0.15?'warn':'ok'}];
    }

    var raf=0, regKey='';
    function render(){
      raf=0; compute();
      draw();
      out.textContent=hhmm(S.time); range.value=S.time; range.setAttribute('aria-valuetext',hhmm(S.time)); XP.rangeFill(range);
      R.querySelectorAll('.db-tchips .xp-chip').forEach(function(c){ c.setAttribute('aria-pressed', +c.dataset.tm===S.time?'true':'false'); });
      var st=stateAt(), sk=st.k+lastKey+S.age;
      if(sk!==lastState){ lastState=sk;
        var b=$('.xp-badge'); b.textContent=st.badge; b.className='xp-badge xp-t-'+st.tone; $('.xp-head').textContent=st.title; R.dataset.tone=st.tone;
        $('.xp-ptx').innerHTML=patientText(st);
      }
      $('.db-now').innerHTML=nowText(st);
      var rk=lastKey+S.age+S.b;
      if(rk!==regKey){ regKey=rk;
        $('.db-shape').innerHTML=shapeText(); $('.db-addx').innerHTML=addRisk(); $('.xp-phx').innerHTML=pharmText();
        $('.db-warn').innerHTML=warnings().map(function(w){return '<p class="db-w db-w-'+w[0]+'">'+w[1]+'</p>';}).join('');
        $('.db-tiles').innerHTML=tiles().map(function(t){ return '<div class="xp-tile xp-t-'+t.tone+'"><span>'+esc(t.label)+'</span><b>'+esc(t.value)+'</b></div>'; }).join('');
        R.querySelectorAll('.db-scen .xp-chip').forEach(function(c,i){ var s=SCEN[i].s; c.setAttribute('aria-pressed', (s.g===S.g&&s.d===S.d&&s.t===S.t&&JSON.stringify(s.add)===JSON.stringify(S.add.map(function(a){return {d:a.d,t:a.t};})))?'true':'false'); });
      }
      XP.setBars(R, bars());
    }
    function req(){ if(!raf) raf=requestAnimationFrame(render); }
    function full(){ fillSelects(); renderAdds(); render(); }

    R.querySelectorAll('.db-meds .xp-chip').forEach(function(c){ c.addEventListener('click',function(){ S.g=c.dataset.g; S.b=0; S.d=G[S.g].def; full(); }); });
    R.querySelectorAll('.db-age .xp-chip').forEach(function(c){ c.addEventListener('click',function(){ S.age=c.dataset.age; full(); }); });
    R.querySelectorAll('.db-scen .xp-chip').forEach(function(c,i){ c.addEventListener('click',function(){ var s=SCEN[i].s; S.g=s.g;S.b=s.b;S.d=s.d;S.t=s.t;S.age=s.age;S.add=s.add.map(function(a){return {d:a.d,t:a.t};}); if(s.add.length) S.time=s.add[s.add.length-1].t+60; full(); }); });
    R.querySelectorAll('.db-tchips .xp-chip').forEach(function(c){ c.addEventListener('click',function(){ S.time=+c.dataset.tm; render(); }); });
    selB.addEventListener('change',function(){ S.b=+selB.value; full(); });
    selD.addEventListener('change',function(){ S.d=+selD.value; full(); });
    selT.addEventListener('change',function(){ S.t=+selT.value; full(); });
    $('.db-addbtn').addEventListener('click',function(){ var k=addKind(); if(!k||S.add.length>=2) return; var last=S.add.length?S.add[S.add.length-1].t+180:(G[S.g].id==='mphir'||G[S.g].id==='dex'?720:840); S.add.push({d:k.doses[Math.min(1,k.doses.length-1)],t:Math.min(last,1140)}); renderAdds(); render(); var sels=R.querySelectorAll('.db-add select'); if(sels.length) sels[sels.length-2].focus(); });
    $('.db-adds').addEventListener('change',function(e){ var s=e.target; if(s.tagName!=='SELECT') return; S.add[+s.dataset.i][s.dataset.f]=+s.value; render(); });
    $('.db-adds').addEventListener('click',function(e){ var b=e.target.closest('.db-rm'); if(!b) return; S.add.splice(+b.dataset.i,1); renderAdds(); render(); $('.db-addbtn').focus(); });
    range.addEventListener('input',function(){ S.time=+range.value; req(); });
    XP.dragChart(svg, range, X0, X1, 360);
    full();
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
