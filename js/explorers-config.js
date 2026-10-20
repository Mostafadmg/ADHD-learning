/* Content and models for the PFC, titration and impairment explorers. Conceptual models only. */
(function(){
  'use strict';
  var XP = window.XP; if(!XP) return;
  var clamp=XP.clamp, gauss=XP.gauss, sig=XP.sig, T=XP.t;
  var C = {blue:'#6fb3f2', purple:'#b79cff', green:'#5fd3a6', amber:'#f2c14e', coral:'#ff9a76', red:'#ff7b7b', grid:'#2a4866', axis:'#5f7a96'};

  /* ===================== 1. PFC inverted-U (Module 2) ===================== */
  var PX0=46, PX1=346, PY0=186, PY1=30;
  function perf(v){ return 0.07 + 0.9*gauss(v,52,19); }
  function pfcSVG(v){
    var X=function(v){return PX0+(PX1-PX0)*v/100;}, Y=function(p){return PY0-(PY0-PY1)*p;};
    var d = XP.pathFrom(function(u){ var vv=u*100; return [X(vv), Y(perf(vv))]; },0,1,120);
    var s = '<defs><linearGradient id="pfcg" x1="0" x2="1"><stop offset="0" stop-color="'+C.blue+'"/><stop offset=".35" stop-color="'+C.green+'"/><stop offset=".62" stop-color="'+C.green+'"/><stop offset="1" stop-color="'+C.coral+'"/></linearGradient>'
      + '<filter id="pfcglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>';
    s += '<rect x="'+X(44)+'" y="'+PY1+'" width="'+(X(60)-X(44))+'" height="'+(PY0-PY1)+'" fill="'+C.green+'" opacity=".13" rx="4"/>';
    s += T((X(44)+X(60))/2, PY0-10, 'OPTIMAL', {fill:C.green, anchor:'middle', weight:600, ls:1.5});
    s += '<line x1="'+PX0+'" y1="'+PY0+'" x2="'+PX1+'" y2="'+PY0+'" stroke="'+C.axis+'"/><line x1="'+PX0+'" y1="'+PY1+'" x2="'+PX0+'" y2="'+PY0+'" stroke="'+C.axis+'"/>';
    s += '<path d="'+d+'" fill="none" stroke="url(#pfcg)" stroke-width="4" stroke-linecap="round"/>';
    var cx=X(v), cy=Y(perf(v));
    s += '<line x1="'+cx+'" y1="'+cy+'" x2="'+cx+'" y2="'+PY0+'" stroke="#c9d6e3" stroke-dasharray="3 4" opacity=".7"/>';
    s += '<circle cx="'+cx+'" cy="'+cy+'" r="13" fill="#fff" opacity=".18" filter="url(#pfcglow)"/><circle cx="'+cx+'" cy="'+cy+'" r="8" fill="#0f2236" stroke="#fff" stroke-width="3"/>';
    s += T(PX0, PY0+20, 'Low') + T(PX1, PY0+20, 'High', {anchor:'end'}) + T((PX0+PX1)/2, PY0+38, 'Catecholamine activity (DA + NA)', {anchor:'middle'});
    s += T(18, (PY0+PY1)/2, 'PFC performance', {anchor:'middle', rot:-90});
    return s;
  }
  var NG = 'NICE NG87';
  XP.cfgPFC = {
    kicker:'Interactive model · Module 2', title:'The inverted U: prefrontal catecholamines and performance',
    intro:'Drag the dot, use the slider or tap a preset. The prefrontal cortex (PFC) works best at a <em>moderate</em> level of dopamine (DA) and noradrenaline (NA): too little or too much both impair it. This is a simplified conceptual model, not a measurement.',
    chartLabel:'Inverted-U curve of prefrontal cortex performance against catecholamine activity, with an optimal band in the middle',
    vbw:360, vbh:232, x0:PX0, x1:PX1, svg:pfcSVG,
    slider:{min:0,max:100,step:1,value:26,label:'Catecholamine level', fmt:function(v){ return Math.round(v)+' / 100'; }},
    chips:[{label:'Untreated ADHD',v:26},{label:'Dose too low',v:41},{label:'Therapeutic dose',v:52},{label:'Mild overshoot',v:65},{label:'Acute stress',v:78},{label:'Excessive dose',v:93}],
    bars:[
      {label:'Attention', tone:'pos', f:function(v){ return 0.1+0.88*gauss(v,52,23); }},
      {label:'Working memory', tone:'pos2', f:function(v){ return 0.08+0.9*gauss(v,51,18); }},
      {label:'Impulse control', tone:'pos', f:function(v){ return 0.1+0.86*gauss(v,54,24); }},
      {label:'Emotional regulation', tone:'pos2', f:function(v){ return 0.12+0.84*gauss(v,50,21); }},
      {label:'Hyperactivity / restlessness', tone:'neg', f:function(v){ return clamp(0.85*(1-sig((v-40)/7))+0.65*sig((v-80)/6)+0.04,0,1); }},
      {label:'Agitation / anxiety', tone:'neg', f:function(v){ return clamp(0.03+0.95*sig((v-66)/6.5),0,1); }},
      {label:'Sleep & appetite effects', sub:'dose-related', tone:'neg2', f:function(v){ return clamp(0.02+0.9*sig((v-60)/8),0,1); }}
    ],
    zones:[
      {to:15, tone:'low', badge:'Too little', title:'Markedly under-stimulated PFC',
       text:'<p>Very little NA is reaching the high-affinity <strong>α2A receptors</strong> on PFC dendritic spines and very little DA is reaching <strong>D1 receptors</strong>. In Arnsten\'s model, the recurrent "delay-cell" networks that hold information online fire weakly, so signals fade and background noise dominates.</p><p>This is the far left of the curve: performance is poor in every domain. In real life this state is approached when untreated ADHD coincides with fatigue, boredom or low arousal.</p>',
       patient:'Very hard to start or stay on tasks, losing the thread mid-sentence, forgetting instructions within seconds, and seeking stimulation (fidgeting, risk-taking) to "wake the brain up".',
       pharm:'This is the picture you would expect before treatment or when a dose has completely worn off. Ask when symptoms are worst during the day: a pattern tied to dose timing points to <em>duration</em> of cover rather than the dose itself (Module 5).'},
      {to:37, tone:'low', badge:'Too little', title:'Under-stimulated PFC: where untreated ADHD is thought to sit',
       text:'<p>Catecholamine signalling is below the optimum. With weak α2A stimulation, cAMP–HCN channels on the spines stay open and the network signal "leaks"; with weak D1 signalling, irrelevant inputs are not filtered out. The result is <strong>low signal-to-noise</strong> in prefrontal networks.</p><p>Stimulants (and atomoxetine) are thought to raise PFC DA and NA towards the peak of the curve; guanfacine is thought to act directly at α2A receptors.</p>',
       patient:'Attention drifts, motivation is low unless a task is novel or urgent, working memory struggles ("what was I doing?"), impulsive answers and restlessness. Day to day: unfinished homework or work, lost belongings, conflict at home.',
       pharm:'At baseline record symptoms, impairment and adverse effects on standard scales before starting and at each dose change (NG87 1.7.26). Set realistic expectations: the aim is to titrate towards the optimal band, against symptoms and adverse effects (1.7.27).'},
      {to:45, tone:'mid', badge:'Rising', title:'Approaching optimal: partial response',
       text:'<p>DA and NA are rising into the effective range. α2A stimulation begins to close HCN channels and strengthen network connections, and moderate D1 stimulation starts to "sculpt" the signal. Performance improves steeply here, which is why small dose changes can make a big difference.</p><p>This is a typical place to be during early titration, or when a dose is wearing off.</p>',
       patient:'Some improvement: focus is better for short tasks but not sustained, and parents or teachers may notice "good mornings, bad afternoons".',
       pharm:'Benefit is not yet optimal and adverse effects are usually mild. Encourage completion of rating scales and continue titration as planned with the specialist. Judge non-response only after an adequate trial: NICE refers to a 6-week trial at an adequate dose (NG87 1.7.8).'},
      {to:59, tone:'ok', badge:'Optimal', title:'Optimal range: the target of titration',
       text:'<p>Moderate NA engages high-affinity <strong>α2A</strong> receptors and moderate DA engages <strong>D1</strong> receptors. In Arnsten\'s model this strengthens relevant network connections and suppresses noise, so <strong>signal-to-noise is highest</strong>. Attention, working memory and impulse control are best here.</p><p>This band is narrow and individual, so the dose that achieves it cannot be predicted from weight or age. It is found by careful titration.</p>',
       patient:'Calmer focus, able to finish tasks, think before acting and regulate frustration. They should still feel like themselves: personality, humour and appetite largely intact.',
       pharm:'This is "dose optimisation": reduced symptoms and better functioning with tolerable adverse effects (NG87 1.7.27). Reinforce adherence and consistent brand supply, and keep monitoring HR, BP, weight and height (1.8.5, 1.8.9).'},
      {to:70, tone:'warn', badge:'Above optimal', title:'Early overshoot: past the peak',
       text:'<p>Catecholamine levels are now high enough to start engaging <strong>lower-affinity receptors</strong>: α1-adrenoceptors and β-adrenoceptors for NA, and excessive D1 stimulation. In the model, these reduce PFC network firing, so performance starts to fall even though "more drug" is present.</p><p>Systemic effects of the higher dose (appetite suppression, insomnia, raised HR and BP) also grow.</p>',
       patient:'Over-focused or rigid ("stuck" on one thing), irritable, more anxious, quieter than usual, poor appetite and difficulty falling asleep. Some people describe feeling flat.',
       pharm:'Signs of overshoot such as irritability, anxiety, flat affect, insomnia or marked appetite loss suggest the dose may be too high. Discuss a dose reduction with the prescriber rather than adding more. If behaviour worsens, adjust medication and review the diagnosis (NG87 1.8.18).'},
      {to:86, tone:'high', badge:'Too much', title:'Over-stimulated PFC: "off-line"',
       text:'<p>High catecholamine levels, as in acute stress or an excessive dose, strongly engage <strong>α1</strong> and <strong>β1</strong> receptors and overstimulate <strong>D1</strong> receptors. In Arnsten\'s model, this opens potassium (HCN/KCNQ) channels on spines and switches PFC networks "off-line". Control shifts to more primitive amygdala and basal ganglia circuits: fast, reflexive and habitual.</p><p>This is the right-hand limb of the Yerkes–Dodson-type inverted U.</p>',
       patient:'Anxiety and agitation, racing thoughts, rigid or flat thinking, worse performance under pressure, tearfulness or anger. With medicine as the cause: the "zombie" feeling, insomnia, loss of appetite and weight.',
       pharm:'Ask about recent dose increases, add-on doses, a brand switch or a new interacting medicine (Module 7). Contact the prescriber about reducing the dose. Check HR and BP: sustained resting HR &gt;120 bpm, arrhythmia or systolic BP above the 95th centile (or a clinically significant rise) measured on 2 occasions means reduce the dose and refer (NG87 1.8.11).'},
      {to:100, tone:'danger', badge:'Far too much', title:'Excessive dose: harmful range',
       text:'<p>Far above the optimum, catecholamine excess produces marked systemic sympathomimetic effects as well as PFC dysfunction. The SPCs list effects such as tachycardia, hypertension, agitation, tremor and, rarely, psychotic symptoms with stimulants (see each SPC §4.8–4.9).</p><p>Performance and wellbeing are poor; this is never a therapeutic target.</p>',
       patient:'Shaky, panicky, pounding heart, unable to sleep, possibly confused or seeing or hearing things that are not there. This needs urgent advice.',
       pharm:'Treat as a possible overdose or misuse: check how much was taken and when, and the source (diversion, double dosing, a new brand). Seek urgent medical advice for significant symptoms (NHS 111 / A&amp;E / TOXBASE for clinicians). Stop ADHD medication if psychosis or mania appears and refer (NG87 1.7.19).'}
    ],
    note:'Simplified conceptual model (inverted U / Yerkes–Dodson; Arnsten\'s prefrontal catecholamine model). The x-axis is not a measurable quantity, curve shapes are illustrative, and individual responses vary (NG87 1.7.21).',
    sources:['Arnsten AFT. Stress signalling pathways that impair prefrontal cortex structure and function. <em>Nat Rev Neurosci</em> 2009;10:410–22.','Arnsten AFT. Catecholamine influences on dorsolateral prefrontal cortical networks. <em>Biol Psychiatry</em> 2011;69:e89–99.','Yerkes RM, Dodson JD. The relation of strength of stimulus to rapidity of habit-formation. <em>J Comp Neurol Psychol</em> 1908;18:459–82.','NICE NG87 (live text checked Oct 2026): 1.7.8, 1.7.19, 1.7.21, 1.7.26, 1.7.27, 1.8.5, 1.8.9, 1.8.11, 1.8.18.','Concerta XL and Intuniv SPC §5.1: the exact mode of action in ADHD is not fully established.']
  };

  /* ===================== 2. Titration explorer (Module 5) ===================== */
  var TX0=46, TX1=346, TY0=180, TY1=28, DMAX=60;
  function ben(d){ return 1-Math.exp(-d/15); }
  function adv(d){ return 0.05+0.9*sig((d-41)/6.5); }
  function regimen(d){
    d=Math.round(d);
    var m={0:'Baseline (no medicine)',5:'5 mg once daily',10:'5 mg twice daily',15:'10 mg + 5 mg',20:'10 mg twice daily',25:'15 mg + 10 mg',30:'15 mg twice daily',35:'20 mg + 15 mg',40:'20 mg twice daily',45:'20 mg + 15 mg + 10 mg',50:'20 mg + 20 mg + 10 mg',55:'20 mg + 20 mg + 15 mg',60:'20 mg three times daily (licensed max)'};
    return m[d] || (d+' mg/day');
  }
  function titSVG(d){
    var X=function(d){return TX0+(TX1-TX0)*d/DMAX;}, Y=function(p){return TY0-(TY0-TY1)*p;};
    var s='<rect x="'+X(24)+'" y="'+TY1+'" width="'+(X(40)-X(24))+'" height="'+(TY0-TY1)+'" fill="'+C.green+'" opacity=".12" rx="4"/>'
      + T(X(28), TY0-84, 'BEST BALANCE', {fill:C.green, anchor:'middle', weight:600, ls:1.2});
    s += '<line x1="'+TX0+'" y1="'+TY0+'" x2="'+TX1+'" y2="'+TY0+'" stroke="'+C.axis+'"/><line x1="'+TX0+'" y1="'+TY1+'" x2="'+TX0+'" y2="'+TY0+'" stroke="'+C.axis+'"/>';
    [0,20,40,60].forEach(function(t){ s+='<line x1="'+X(t)+'" y1="'+TY0+'" x2="'+X(t)+'" y2="'+(TY0+5)+'" stroke="'+C.axis+'"/>'+T(X(t), TY0+21, t, {anchor:'middle'}); });
    s += '<path d="'+XP.pathFrom(function(u){var x=u*DMAX;return [X(x),Y(ben(x))];},0,1,90)+'" fill="none" stroke="'+C.green+'" stroke-width="3.5"/>';
    s += '<path d="'+XP.pathFrom(function(u){var x=u*DMAX;return [X(x),Y(adv(x))];},0,1,90)+'" fill="none" stroke="'+C.coral+'" stroke-width="3.5" stroke-dasharray="7 5"/>';
    var cx=X(d);
    s += '<line x1="'+cx+'" y1="'+TY1+'" x2="'+cx+'" y2="'+TY0+'" stroke="#c9d6e3" stroke-dasharray="3 4" opacity=".7"/>';
    s += '<circle cx="'+cx+'" cy="'+Y(ben(d))+'" r="7" fill="#0f2236" stroke="'+C.green+'" stroke-width="3"/><circle cx="'+cx+'" cy="'+Y(adv(d))+'" r="7" fill="#0f2236" stroke="'+C.coral+'" stroke-width="3"/>';
    s += T(TX1, Y(ben(DMAX))-10, 'Benefit', {anchor:'end', fill:C.green, weight:600}) + T(TX1, TY0-12, 'Adverse effects', {anchor:'end', fill:C.coral, weight:600});
    s += T((TX0+TX1)/2, TY0+40, 'Methylphenidate total daily dose (mg/day)', {anchor:'middle'});
    s += T(18, (TY0+TY1)/2, 'Relative effect', {anchor:'middle', rot:-90});
    return s;
  }
  function hrTile(d){ var a=adv(d); return a<0.15?['Small or no change','ok']:a<0.4?['Modest rise: recheck','mid']:a<0.7?['Rising: recheck twice','warn']:['High: act if sustained','high']; }
  XP.cfgTit = {
    kicker:'Interactive model · Module 5', title:'Titration explorer: benefit versus adverse effects',
    intro:'Step through a typical weekly methylphenidate titration for <em>one hypothetical child</em> (IR doses shown; MR brands follow the same principle). Watch benefit level off while adverse effects rise, and what to monitor at each step.',
    chartLabel:'Benefit and adverse-effect curves against methylphenidate daily dose, with a best-balance band',
    vbw:360, vbh:228, x0:TX0, x1:TX1, svg:titSVG,
    slider:{min:0,max:60,step:5,value:0,label:'Daily dose', fmt:function(d){ return Math.round(d)+' mg/day · '+regimen(d); }},
    chips:[{label:'Baseline',v:0},{label:'Week 1 · 10 mg',v:10},{label:'Week 2 · 15 mg',v:15},{label:'Week 3 · 20 mg',v:20},{label:'Week 4 · 30 mg',v:30},{label:'Week 5 · 40 mg',v:40},{label:'Overshoot · 55 mg',v:55}],
    bars:[
      {label:'Symptom control', tone:'pos', f:function(d){ return 0.08+0.88*ben(d); }},
      {label:'Daily functioning', sub:'school / home', tone:'pos2', f:function(d){ return clamp(0.1+0.85*ben(d)-0.35*sig((d-48)/5),0,1); }},
      {label:'Appetite', sub:'higher = normal', tone:'pos', f:function(d){ return clamp(0.98-0.75*adv(d)-0.12*ben(d),0,1); }},
      {label:'Sleep-onset problems', tone:'neg', f:function(d){ return clamp(0.06+0.85*adv(d),0,1); }},
      {label:'Irritability / flat affect', tone:'neg', f:function(d){ return clamp(0.04+0.9*sig((d-46)/5),0,1); }},
      {label:'HR / BP load', tone:'neg2', f:function(d){ return clamp(0.05+0.25*ben(d)+0.6*adv(d),0,1); }}
    ],
    tiles:function(d){
      var h=hrTile(d), w=adv(d);
      return [{label:'Heart rate / BP', value:d===0?'Record baseline':h[0], tone:d===0?'info':h[1]},
              {label:'Appetite / weight', value:d===0?'Weigh + plot':w<0.2?'Usually small dip':w<0.6?'Watch weight trend':'Weight loss likely', tone:d===0?'info':w<0.2?'ok':w<0.6?'warn':'high'},
              {label:'Week', value:d===0?'0 (baseline)':d<=10?'1':d<=15?'2':d<=20?'3':d<=30?'4':d<=40?'5':'6+', tone:'info'}];
    },
    zones:[
      {to:2, tone:'info', badge:'Baseline', title:'Before starting: measure everything you will monitor',
       text:'<p>Before medication, NICE asks for a full baseline assessment: confirming the diagnosis, mental health and social circumstances, cardiovascular history, and <strong>height, weight, heart rate and blood pressure</strong> compared with the normal range for age (NG87 1.7.4). Refer for a cardiology opinion before starting if specific cardiac features apply, such as fainting on exertion or a family history of sudden cardiac death under 40 (1.7.5).</p><p>Symptoms, impairment and adverse effects should be recorded at baseline on standard scales by parents and teachers (1.7.26), so that later changes can be judged.</p>',
       patient:'The family should know what the plan is: small weekly steps, regular check-ins (for example weekly phone contact) and why repeated measurements matter.',
       pharm:'Check that baseline HR, BP, height and weight are documented and plotted. Screen for contraindications (Module 5) and interacting medicines (Module 7), and explain CD supply rules.'},
      {to:12, tone:'low', badge:'Starting dose', title:'Week 1: low starting dose, little benefit yet',
       text:'<p>A low dose such as 5 mg once or twice daily (IR) or the lowest MR strength is used to check tolerability. Benefit is usually small at this stage, and adverse effects are uncommon and mild: perhaps a slightly reduced lunchtime appetite or a headache.</p><p>Titrate in small steps, roughly weekly, against symptoms and adverse effects, in line with the BNF/BNFC (NG87 1.7.27).</p>',
       patient:'Little difference yet. Some children notice a mild tummy ache or headache; give the dose with or after breakfast if appetite is an issue.',
       pharm:'Measure HR and BP before and after each dose change (NG87 1.8.9). Encourage the parent and school to complete the rating scales each week (1.7.26).'},
      {to:22, tone:'mid', badge:'Building', title:'Weeks 2–3: benefit building',
       text:'<p>Benefit rises steeply in this range: concentration and impulse control improve, especially during the hours of cover. Adverse effects are still usually mild. Appetite suppression at lunchtime and difficulty falling asleep are the most common early effects.</p><p>Weekly review lets the specialist decide whether to step up, hold or reduce.</p>',
       patient:'Teachers may report better focus in the morning. Appetite at lunch may dip, so a good breakfast and an after-school snack help (NG87 1.8.6).',
       pharm:'Ask about sleep (a sleep diary helps: 1.8.17), appetite and mood. Check HR and BP after each increase (1.8.9) and that weight is being tracked (1.8.5).'},
      {to:40, tone:'ok', badge:'Best balance', title:'Best balance for this child',
       text:'<p>Benefit is close to its plateau while adverse effects are still tolerable: this is <strong>dose optimisation</strong> (NG87 1.7.27). For this hypothetical child it falls around 25–40 mg/day; for another person it may be lower or higher, and it cannot be predicted from weight (1.7.21).</p><p>NICE expects a <strong>6-week trial at an adequate dose</strong> before concluding that methylphenidate has not worked and switching (1.7.8).</p>',
       patient:'Calmer, more organised and able to finish work; still themselves, eating reasonably and sleeping within a normal time.',
       pharm:'Support adherence and consistent brand supply. Ongoing monitoring: HR and BP every 6 months and after any dose change (1.8.9); weight every 3 months in children 10 and under, and height every 6 months (1.8.5).'},
      {to:50, tone:'warn', badge:'Diminishing returns', title:'Above the best balance: more side effects, little extra benefit',
       text:'<p>Benefit has plateaued, but adverse effects keep rising: appetite and weight, sleep onset, irritability, and HR/BP. Each extra step now buys little improvement and costs more side effects.</p><p>If behaviour worsens on medication, NICE says to adjust the medication and review the diagnosis (NG87 1.8.18).</p>',
       patient:'May be quieter or "flat", irritable as doses wear off, picking at meals and taking longer to fall asleep.',
       pharm:'Flag the trend to the prescriber: a lower dose, a change in timing or a different formulation may give the same benefit with fewer effects. If weight loss is a concern, NICE suggests strategies such as taking the medicine with or after food, extra meals early in the morning or late in the evening, and dietary advice (1.8.6).'},
      {to:60, tone:'high', badge:'Overshoot', title:'Overshoot: adverse effects dominate',
       text:'<p>At the top of the range (60 mg/day is the licensed maximum for IR methylphenidate in children), adverse effects outweigh any extra benefit for this child. Cardiovascular load is highest, appetite and weight are most affected, and emotional blunting or anxiety are more likely.</p><p>If there is sustained resting tachycardia (&gt;120 bpm), arrhythmia or systolic BP above the 95th centile (or a clinically significant rise) on 2 occasions, NICE says to reduce the dose and refer (NG87 1.8.11).</p>',
       patient:'"Zombie-like", anxious or tearful, not hungry, struggling to sleep: the medicine is no longer helping overall.',
       pharm:'Advise the prescriber that the dose likely exceeds this person\'s optimum, and do not supply an unexplained increase beyond the licensed maximum without checking. Ensure HR, BP and weight are rechecked promptly.'}
    ],
    note:'Schematic curves for one hypothetical child. Not dosing guidance: always follow the SPC and the current BNF/BNFC (NG87 1.7.27), and the prescriber\'s plan.',
    sources:['NICE NG87 (live text checked Oct 2026): 1.7.4, 1.7.5, 1.7.8, 1.7.21, 1.7.26, 1.7.27, 1.8.5, 1.8.6, 1.8.9, 1.8.11, 1.8.17, 1.8.18.','Ritalin and Medikinet tablet SPCs §4.2 (emc): children start 5 mg once or twice daily, increase by 5–10 mg/day weekly, maximum 60 mg/day.','BNF/BNFC not verified (geo-restricted). Check the current edition.']
  };

  /* ===================== 3. Impairment across settings (Module 1) ===================== */
  var IX0=46, IX1=346, IY0=180, IY1=28;
  function imp(sev, k, mod){ // k: setting sensitivity; mod: environmental modifications
    var s = sev - (mod?10*k.mod:0);
    return clamp(0.03+0.95*sig((s-k.c)/k.w),0,1);
  }
  var SETS={home:{c:57,w:8,mod:1},school:{c:46,w:8,mod:1.2},social:{c:68,w:9,mod:.6},self:{c:66,w:11,mod:.6},safety:{c:74,w:9,mod:.4}};
  function impSVG(v,st){
    var mod=st.toggles.env, X=function(x){return IX0+(IX1-IX0)*x/100;}, Y=function(p){return IY0-(IY0-IY1)*p;};
    var thr=0.5, s='';
    s += '<rect x="'+IX0+'" y="'+IY1+'" width="'+(IX1-IX0)+'" height="'+(Y(thr)-IY1)+'" fill="'+C.coral+'" opacity=".08"/>';
    s += '<line x1="'+IX0+'" y1="'+Y(thr)+'" x2="'+IX1+'" y2="'+Y(thr)+'" stroke="'+C.amber+'" stroke-dasharray="6 5"/>'+T(IX0+6, Y(thr)+20, 'moderate impairment', {fill:C.amber, weight:600});
    s += '<line x1="'+IX0+'" y1="'+IY0+'" x2="'+IX1+'" y2="'+IY0+'" stroke="'+C.axis+'"/><line x1="'+IX0+'" y1="'+IY1+'" x2="'+IX0+'" y2="'+IY0+'" stroke="'+C.axis+'"/>';
    [['school',C.blue,'School / work'],['home',C.purple,'Home'],['social',C.green,'Friendships']].forEach(function(a,i){
      s += '<path d="'+XP.pathFrom(function(u){var x=u*100;return [X(x),Y(imp(x,SETS[a[0]],mod))];},0,1,90)+'" fill="none" stroke="'+a[1]+'" stroke-width="3.2"/>';
      s += '<circle cx="'+X(v)+'" cy="'+Y(imp(v,SETS[a[0]],mod))+'" r="6.5" fill="#0f2236" stroke="'+a[1]+'" stroke-width="3"/>';
    });
    s += '<line x1="'+X(v)+'" y1="'+IY1+'" x2="'+X(v)+'" y2="'+IY0+'" stroke="#c9d6e3" stroke-dasharray="3 4" opacity=".6"/>';
    s += T(IX0, IY0+20, 'Mild') + T(IX1, IY0+20, 'Severe', {anchor:'end'}) + T((IX0+IX1)/2, IY0+38, 'Severity of ADHD symptoms', {anchor:'middle'});
    s += T(18,(IY0+IY1)/2,'Impairment',{anchor:'middle',rot:-90});
    return s;
  }
  function settingsCount(v,mod){ var n=0; ['home','school','social'].forEach(function(k){ if(imp(v,SETS[k],mod)>=0.5) n++; }); return n; }
  XP.cfgImp = {
    kicker:'Interactive model · Module 1', title:'Symptoms versus impairment across settings',
    intro:'ADHD is diagnosed on <em>impairment</em>, not on symptoms alone. Move the severity slider and switch environmental modifications on or off to see how impairment at home, at school or work and with friends crosses the "at least moderate" threshold.',
    legend:'<span><i style="background:#6fb3f2"></i>School / work</span><span><i style="background:#b79cff"></i>Home</span><span><i style="background:#5fd3a6"></i>Friendships</span><span><i class="thr"></i>At least moderate impairment</span>',
    chartLabel:'Impairment curves for school or work, home and friendships against symptom severity, with a moderate-impairment threshold line',
    vbw:360, vbh:228, x0:IX0, x1:IX1, svg:impSVG,
    slider:{min:0,max:100,step:1,value:30,label:'Symptom severity', fmt:function(v,st){ var n=settingsCount(v,st.toggles.env); return Math.round(v)+' / 100 · moderate impairment in '+n+' of 3 settings'; }},
    toggles:[{id:'env', label:'Environmental modifications in place', on:false}],
    zoneValue:function(v,st){ return v-(st.toggles.env?10:0); },
    chips:[{label:'Typical range',v:12},{label:'Traits, no impairment',v:30},{label:'One setting only',v:50},{label:'Moderate, 2+ settings',v:68},{label:'Severe',v:90}],
    bars:[
      {label:'Home / family', tone:'neg', f:function(v,st){ return imp(v,SETS.home,st.toggles.env); }},
      {label:'School / work', tone:'neg', f:function(v,st){ return imp(v,SETS.school,st.toggles.env); }},
      {label:'Friendships / relationships', tone:'neg', f:function(v,st){ return imp(v,SETS.social,st.toggles.env); }},
      {label:'Self-esteem / mood', tone:'neg2', f:function(v,st){ return imp(v,SETS.self,st.toggles.env); }},
      {label:'Safety', sub:'accidents, driving', tone:'neg2', f:function(v,st){ return imp(v,SETS.safety,st.toggles.env); }}
    ],
    zones:[
      {to:20, tone:'ok', badge:'Typical', title:'Within the typical range',
       text:'<p>Inattention, fidgeting and impulsivity are dimensional: everyone has some. At this level they are in keeping with age and development and cause no meaningful impairment anywhere.</p>',
       patient:'Ordinary ups and downs: occasional daydreaming or restlessness, especially when tired or bored.',
       pharm:'Reassure. A parent asking "could this be ADHD?" can be signposted to general parenting and school support; there is no indication for assessment on symptoms alone.'},
      {to:40, tone:'low', badge:'Below threshold', title:'ADHD traits without significant impairment',
       text:'<p>Symptoms are noticeable but are not causing <strong>at least moderate</strong> psychological, social, educational or occupational impairment, which NICE requires for a diagnosis (NG87 1.3.3). Diagnosis needs both the DSM-5/ICD-11 symptom criteria <em>and</em> impairment.</p>',
       patient:'Some struggles (organisation, focus in dull tasks), but coping at home, school or work, often with structure or routines.',
       pharm:'Useful time to suggest practical strategies (routines, lists, reduced distractions). If problems are affecting a child\'s development or family life, NICE suggests watchful waiting for up to 10 weeks and ADHD-focused group parent support, which should not wait for a diagnosis (1.2.7).'},
      {to:57, tone:'mid', badge:'One setting', title:'Impairment mainly in one setting',
       text:'<p>Impairment is emerging, but mostly in one setting (here, school or work). DSM-5 requires several symptoms in <strong>two or more settings</strong>. A problem confined to one place should prompt a search for other explanations: a specific learning difficulty, hearing or vision problems, anxiety, bullying, sleep problems or a mismatch with the environment.</p>',
       patient:'"Fine at home, struggling at school" (or the reverse). The pattern itself is informative.',
       pharm:'Ask about sleep, mood, hearing and vision, and school or work pressures. Collateral history from more than one setting matters (NG87 1.3.3, Module 3).'},
      {to:78, tone:'warn', badge:'Moderate, 2+ settings', title:'Moderate impairment across settings',
       text:'<p>Impairment is now at least moderate in two or more settings, which is consistent with the impairment requirement for diagnosis (NG87 1.3.3), alongside the other criteria (onset in childhood, persistence, not better explained by another condition).</p><p>Switch environmental modifications on: NICE offers medication to children 5+ and young people only if ADHD symptoms still cause <strong>persistent significant impairment in at least one domain after environmental modifications</strong> have been implemented and reviewed (1.5.13); the same applies to adults (1.5.15).</p>',
       patient:'Problems in class or at work, frequent conflict at home, difficulty keeping friends, and low self-esteem from constant correction.',
       pharm:'Support referral and the assessment pathway (Module 3). Explain that environmental changes (seating, breaks, routines, workplace adjustments) come first and continue alongside any medication.'},
      {to:100, tone:'high', badge:'Severe', title:'Severe, pervasive impairment',
       text:'<p>Impairment is marked in every setting and spills into self-esteem, mood and safety: accidents, risk-taking and, in adults, driving incidents. Even with environmental modifications, impairment remains significant in at least one domain, so medication is likely to be discussed (NG87 1.5.13, 1.5.15).</p><p>For adults without a childhood diagnosis, NICE refers for assessment when symptoms began in childhood, have persisted, are not explained by another diagnosis and cause moderate or severe impairment (1.2.10).</p>',
       patient:'Exclusions or job loss, family breakdown, injuries, and a sense of failure. Coexisting anxiety, low mood and substance misuse become more likely.',
       pharm:'Treat as a priority: support timely specialist referral, check for risk (self-harm, driving, substance misuse) and remember the higher-risk groups listed by NICE (1.2.1).'}
    ],
    note:'Conceptual model: curves are illustrative, not data. Real impairment depends on the person, their environment and coexisting conditions.',
    sources:['NICE NG87 (live text checked Oct 2026): 1.2.1, 1.2.7, 1.2.10, 1.3.3, 1.5.13, 1.5.15.','American Psychiatric Association. DSM-5-TR (2022): symptoms in two or more settings, with clear interference with functioning (primary text not re-checked; summarised in Module 1).']
  };
})();
