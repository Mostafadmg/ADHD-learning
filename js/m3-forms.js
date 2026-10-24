/* Module 3: "Before the DIVA: the pre-assessment pack".
   Renders (1) the step-by-step pack into [data-prepack] and (2) a form library explorer into [data-formlib].
   Content summarised from the ADHD Assessment workspace forms guide (adhd-assessment/js/data/forms-guide.js),
   which cites UKAAN AQAS 2024, RCPsych CR235, CADDRA 4.1, NICE NG87/NG222/NG225 and each tool's own manual. */
(function(){
  'use strict';
  var WS = 'adhd-assessment/index.html#form-';   /* deep link into the workspace forms guide */

  var G = [
   {g:'ADHD forms', forms:[
    {id:'asrs18', ab:"ASRS v1.1", full:"Adult ADHD Self-Report Scale, version 1.1 (World Health Organization)", use:"Screening current adult ADHD symptoms and recording a baseline to measure treatment response.", basis:"NICE NG87 1.3.2: rating scales are valuable adjuncts, never the basis of a diagnosis; NG87 1.7.26: baseline and repeat measures. UKAAN AQAS 2024 recommends a current self-report scale before assessment.", n:'ASRS v1.1 (18 items)', who:'Patient · about 5 min · past 6 months', what:'Current adult ADHD symptoms. Part A (items 1–6) is the screener; Part B (items 7–18) gives interview cues.',
     score:'Part A: count answers in the shaded range. Items 1–3 count from <em>Sometimes</em> upwards; items 4–6 from <em>Often</em> upwards. Part B has no total score.',
     res:[['4–6 shaded','Screen positive: further assessment is warranted.','warn'],['0–3 shaded','Screen negative, but it does not exclude ADHD: about 3 in 10 people with ADHD screened negative in the original study.','ok'],['Part B shaded items','Use them as probes in the interview.','info']],
     watch:'Anxiety, depression, poor sleep and substance use all raise it. Check whether the patient could see which shaded answers "count".', feeds:'Baseline score and interview probes'},
    {id:'wurs25', ab:"WURS-25", full:"Wender Utah Rating Scale, 25-item version", use:"Recording the adult’s own memory of childhood ADHD-type difficulties.", basis:"Supports the DSM-5-TR requirement for several symptoms before age 12 (criterion B). Recommended as a retrospective scale by UKAAN AQAS 2024 and CADDRA; not named in NICE NG87.", n:'WURS-25 (Wender Utah Rating Scale)', who:'Patient, about their own childhood · a few min', what:'Retrospective rating of childhood ADHD-type difficulties.',
     score:'Score each item 0–4 and add the 25 items (0–100). Do not apply WURS-25 cut-offs to other versions such as the German WURS-k.',
     res:[['46 or more','Strongly recalled childhood difficulties (Ward 1993).','warn'],['36–45','Above the sensitive cut-off (Brevik 2020: sensitivity 0.89, specificity 0.90 against population controls).','warn'],['Below 36','Few difficulties recalled; does not exclude ADHD: recall may be poor or the childhood very structured.','ok']],
     watch:'Raised by mood and personality disorders. It is recall, not evidence: check it against school reports and a parent.', feeds:'Childhood columns of the interview'},
    {id:'wfirs', ab:"WFIRS-S", full:"Weiss Functional Impairment Rating Scale – Self-report", use:"Measuring how much ADHD affects daily life across family, work or school, life skills, self-concept, social life and risk.", basis:"Evidence for the NICE threshold of at least moderate impairment in 2 or more settings (NG87 1.3.3). Used by CADDRA and UKAAN.", n:'WFIRS-S (impairment)', who:'Patient · 69 items · 10–15 min', what:'Functional impairment across family, work, school, life skills, self-concept, social and risk.',
     score:'Rate 0–3 or not applicable (never score not applicable as 0). A domain is impaired if 2 or more items are rated 2 or higher, or any item is 3, or the domain mean is 1.5 or more (CADDRA).',
     res:[['2 or more domains impaired','Impairment across settings, consistent with NICE NG87 1.3.3.','warn'],['1 domain impaired','One area only, or other areas masked by support or avoidance.','info'],['No domain impaired','Low insight, compensation by family, or a hidden cost of high achievement.','ok']],
     watch:'Depression and anxiety raise it. Keep the total as a baseline: CADDRA describes a fall of 13 points as a significant improvement.', feeds:'Impairment evidence and treatment baseline'},
    {id:'wsr2', ab:"WSR-II", full:"Weiss Symptom Record, version II", use:"A broad problem checklist: picks up mood, anxiety, substance, sleep, autism and other problems alongside ADHD.", basis:"Supports NG87 1.3.4 (assess coexisting conditions). Part of the CADDRA toolkit.", n:'WSR-II (Weiss Symptom Record)', who:'Patient (optionally partner or parent)', what:'Broad problem checklist across ADHD, mood, anxiety, substances, sleep, autism and more.',
     score:'Read the suicide items first. For each section count items rated 2–3; there is no total. CADDRA guide: 5 or more in attention or hyperactivity-impulsivity suggests adult ADHD; depression 5 or more.',
     res:[['5+ items at 2–3 in an ADHD section','Suggests adult ADHD (same limits as any self-report list).','warn'],['Mood sections raised','Possible depression or emotional dysregulation.','info'],['Any 2–3 in psychosis, substances, autism, sleep','Sections that need a closer look.','info']],
     watch:'Any suicide item rated above none needs follow-up before the appointment.', feeds:'Which coexisting screens to add; safety'}
   ]},
   {g:'Informants and records', forms:[
    {id:'informant_forms', ab:"Informant forms", full:"Observer rating forms completed by a partner, friend, parent or older sibling", use:"Getting an outside view of current and childhood symptoms.", basis:"NICE NG87 1.3.1: a full assessment includes reports from people who know the person; 1.3.3: symptoms across settings.", n:'Informant forms', who:'Partner or friend (current) · parent or older sibling (childhood)', what:'Other people’s ratings of current and childhood symptoms.',
     score:'Score each form by its own rules. Lay them side by side with the patient’s, item by item: agree, informant higher, informant lower. Read free text first: one dated example beats a page of ticks.',
     res:[['Agreement with examples from 2+ settings','Convergent evidence for current symptoms and pervasiveness (criterion C).','warn'],['Informant reports fewer symptoms','Inner symptoms are invisible, contact is limited, masking, or over-reporting by the patient.','info'],['Informant reports more','Limited insight is common in adult ADHD; or conflict colours the account.','info']],
     watch:'Get consent; ask informants to complete forms separately from the patient. Informants may have ADHD themselves or be in conflict with the patient.', feeds:'Collateral rating (0, 1 or 2)'},
    {id:'history_questionnaire', ab:"History questionnaire", full:"Pre-assessment developmental and life history questionnaire", use:"Building a dated life timeline before the interview.", basis:"NICE NG87 1.3.1: a full assessment includes a developmental and psychiatric history; 1.3.4: needs, circumstances and physical health.", n:'Pre-assessment history questionnaire', who:'Patient, with a parent for pregnancy, birth and early years', what:'Development, education, work, health, family and forensic history.',
     score:'Build a dated timeline from birth to now. Mark when each difficulty first appeared: before 12? Continuous (trait) or in episodes (state)?',
     res:[['Difficulties from early childhood, continuous','A trait-like, neurodevelopmental pattern: consistent with ADHD, or autism or learning disorders.','warn'],['Clear onset in adolescence or adulthood','Late onset should raise other causes first (mood, psychosis, substances, injury).','info'],['Early delay or therapy contact','Neurodevelopmental vulnerability.','info']],
     watch:'Allow time for the patient to ask family about the early years.', feeds:'Clinical history and onset'},
    {id:'school_reports', ab:"School reports", full:"Contemporaneous school reports (primary and secondary)", use:"Independent, written-at-the-time evidence of childhood symptoms.", basis:"Supports onset before 12 and symptoms in 2+ settings (DSM-5-TR criteria B and C; NICE NG87 1.3.3). Recommended by UKAAN AQAS and RCPsych CR235.", n:'Old school reports', who:'Patient or family provide; clinician reads before the appointment', what:'Teachers’ comments written at the time: the best evidence of childhood onset.',
     score:'Sort by date and age; focus on ages 5–12. Read the comments, not the grades. Highlight themes that map to symptoms: off task, daydreams, careless mistakes, unfinished work, talks in class.',
     res:[['Same themes from several teachers across years, before 12','Strong support for criteria B (onset) and C (settings).','warn'],['Occasional mild comments','Some support only; common in children without ADHD.','info'],['Problems only in one subject','Possible specific learning disorder.','info']],
     watch:'Ask early: reports take time to find.', feeds:'Collateral evidence for onset'},
    {id:'previous_records', ab:"Previous records", full:"GP, CAMHS, paediatric, educational psychology and occupational health records", use:"Checking past diagnoses, episodes and childhood concerns.", basis:"NICE NG87 1.3.1 (full history) and 1.3.4 (coexisting conditions).", n:'Previous records', who:'GP, CAMHS, paediatrics, educational psychology, occupational health', what:'Dated history of diagnoses, episodes, treatments and childhood concerns.',
     score:'Extract a dated list of diagnoses, episodes and treatments and add it to the timeline. Look for childhood consultations about behaviour or concentration, and for episodes that could be a better explanation.',
     res:[['Childhood behaviour or attention concerns recorded','Independent support for criteria B and C.','warn'],['Mood, psychotic or substance episodes','A possible better explanation, or a coexisting condition.','info'],['Previous comprehensive ADHD report','Diagnosis well documented.','ok']],
     watch:'Check the author, date and purpose of each document.', feeds:'History, collateral and differentials'}
   ]},
   {g:'Coexisting conditions and safety', forms:[
    {id:'phq9', ab:"PHQ-9", full:"Patient Health Questionnaire-9", use:"Screening for depression and rating its severity; item 9 asks about thoughts of self-harm.", basis:"NICE NG222 (depression in adults) uses PHQ-9 scores to describe severity. NG87 1.3.4: assess coexisting conditions.", n:'PHQ-9 (depression)', who:'Patient · a few min', what:'Nine depression items.',
     score:'<strong>Item 9 first</strong>: any score of 1 or more needs a clinician’s enquiry before the appointment. Then add the items (0–27).',
     res:[['0–4 / 5–9','Minimal / mild (often driven by items that overlap with ADHD).','ok'],['10–14 / 15–19','Moderate / moderately severe; 10 or more is the usual screening cut-off.','warn'],['20–27','Severe.','bad']],
     watch:'Items 3, 4, 6, 7 and 8 (sleep, tiredness, concentration, restlessness) overlap with ADHD. A low total never clears a positive item 9.', feeds:'Safety, depression differential, baseline'},
    {id:'gad7', ab:"GAD-7", full:"Generalised Anxiety Disorder 7-item scale", use:"Screening for anxiety and rating its severity.", basis:"NICE CG123 (common mental health problems) recommends the GAD-2 and GAD-7 to identify anxiety. NG87 1.3.4.", n:'GAD-7 (anxiety)', who:'Patient · a few min', what:'Seven anxiety items.',
     score:'Add the items (0–21). 5, 10 and 15 mark mild, moderate and severe.',
     res:[['0–4','Minimal anxiety.','ok'],['5–9','Mild anxiety, or ADHD restlessness and irritability.','info'],['10 or more','Probable anxiety disorder: sensitivity 89%, specificity 82% for GAD (Spitzer 2006).','warn']],
     watch:'Items 4–6 (trouble relaxing, restlessness, irritability) overlap with ADHD; look at the worry items 1–3 and 7.', feeds:'Anxiety differential and baseline'},
    {id:'mdq', ab:"MDQ", full:"Mood Disorder Questionnaire", use:"Screening for past manic or hypomanic episodes (bipolar spectrum).", basis:"Supports NG87 1.3.4 and the bipolar differential (Module 8). Used by CADDRA and the European Consensus; not named by NICE.", n:'MDQ (bipolar screen)', who:'Patient; a relative can add an account', what:'Screen for past manic or hypomanic episodes.',
     score:'Positive only if <strong>all three</strong>: 7 or more "yes" in question 1, AND yes to question 2 (at the same time), AND a moderate or serious problem in question 3.',
     res:[['Positive (all three)','Probable bipolar spectrum: sensitivity 0.73, specificity 0.90 in outpatients.','warn'],['7+ items but not the other two','Usually chronic ADHD traits rather than an episode.','info'],['Fewer than 7','Negative, but it misses many people with bipolar disorder in the community.','ok']],
     watch:'About half of adults with ADHD screen positive. Ask about distinct episodes that were a change from the usual self.', feeds:'Bipolar differential'},
    {id:'audit', ab:"AUDIT / AUDIT-C", full:"Alcohol Use Disorders Identification Test (WHO); AUDIT-C is its 3 consumption questions", use:"Identifying hazardous, harmful or dependent drinking.", basis:"NICE CG115 (alcohol-use disorders) recommends AUDIT for identification. NG87 1.3.4 and 1.7.23 (misuse risk before prescribing).", n:'AUDIT-C and AUDIT (alcohol)', who:'Patient · a few min', what:'Alcohol consumption, dependence and harm.',
     score:'AUDIT-C (items 1–3, 0–12): 5 or more is positive, so complete the full AUDIT. Full AUDIT zones (UK form): 0–7 low, 8–15 increasing, 16–19 higher risk, 20+ possible dependence.',
     res:[['AUDIT-C 0–4 / AUDIT 0–7','Low-risk drinking.','ok'],['AUDIT 8–15','Hazardous drinking.','warn'],['AUDIT 16+','Harmful drinking or possible dependence.','bad']],
     watch:'Ask the order of onset: did attention problems come before the drinking, and are they present when sober?', feeds:'Substance differential and risk'},
    {id:'dast10', ab:"DAST-10", full:"Drug Abuse Screening Test, 10-item version", use:"Identifying drug-related problems (not prescribed medicines taken as directed).", basis:"NG87 1.3.4 (coexisting conditions) and 1.7.23–1.7.24 (assess the risk of misuse and diversion before stimulants).", n:'DAST-10 (drugs)', who:'Patient · a few min', what:'Drug-related problems (prescribed medicines taken as directed do not count).',
     score:'1 point per yes, except question 3 (always able to stop), where "no" scores 1.',
     res:[['0','No problems reported.','ok'],['1–2 / 3–5','Low level / moderate: investigate further.','warn'],['6–10','Substantial to severe problems.','bad']],
     watch:'Cannabis and stimulant use can mimic or mask ADHD; also relevant to stimulant prescribing and diversion.', feeds:'Substance differential and prescribing safety'},
    {id:'aq10', ab:"AQ-10", full:"Autism Spectrum Quotient, 10-item version", use:"Screening for autistic traits that may need a separate autism assessment.", basis:"NICE CG142 (autism in adults) suggests the AQ-10 when autism is suspected. Autism often coexists with ADHD and both can be diagnosed.", n:'AQ-10 (autistic traits)', who:'Patient · a few min', what:'Ten-item autism screen.',
     score:'Score with the key (agree on items 1, 7, 8, 10; disagree on 2–6 and 9). 6 or more: consider a specialist autism assessment.',
     res:[['6 or more','Screen positive.','warn'],['6+ carried by items 3 and 4','ADHD attention-switching may push the score over the line.','info'],['Below 6','Negative, but many false negatives in referral samples.','ok']],
     watch:'Autism and ADHD often coexist and can be diagnosed together.', feeds:'Autism differential'},
    {id:'pcl5', ab:"PCL-5", full:"PTSD Checklist for DSM-5", use:"Screening for post-traumatic stress disorder after a reported trauma.", basis:"Supports NG87 1.3.4 and the trauma differential (Module 8). Developed by the US National Center for PTSD.", n:'PCL-5 (PTSD)', who:'Patient · a few min', what:'Twenty PTSD symptom items after a stated event.',
     score:'Check the event first. Add the items (0–80): 31–33 or more suggests probable PTSD.',
     res:[['31–33+ with intrusion and avoidance','Probable PTSD.','warn'],['31–33+ carried by arousal items','ADHD may be lifting the total.','info'],['Below 31','PTSD less likely; symptoms can still matter.','ok']],
     watch:'Use when trauma is reported; arousal items (concentration, irritability, sleep) overlap with ADHD.', feeds:'Trauma differential'},
    {id:'msibpd', ab:"MSI-BPD", full:"McLean Screening Instrument for Borderline Personality Disorder", use:"Screening for borderline (emotionally unstable) personality disorder.", basis:"Supports NG87 1.3.4 and the personality differential (Module 8). Used by CADDRA and the European Consensus.", n:'MSI-BPD (borderline personality)', who:'Patient · a few min', what:'Ten yes/no items.',
     score:'Count the yes answers (0–10). 7 or more is positive (sensitivity 0.81, specificity 0.85).',
     res:[['7+ including specific items','Probable borderline personality disorder (identity, emptiness, abandonment, self-harm).','warn'],['7+ carried by shared items','ADHD impulsivity and emotional dysregulation may explain much of it.','info'],['Below 7','Negative.','ok']],
     watch:'Impulsivity, mood changes, anger and unstable relationships are shared with ADHD.', feeds:'Personality differential and risk'},
    {id:'stopbang', ab:"STOP-Bang / Epworth", full:"STOP-Bang: Snoring, Tiredness, Observed apnoea, blood Pressure, BMI, age, Neck size, Gender. Epworth Sleepiness Scale", use:"Screening for obstructive sleep apnoea and measuring daytime sleepiness.", basis:"NICE NG202 (obstructive sleep apnoea) covers recognising and referring suspected sleep apnoea. Poor sleep is a key ADHD mimic.", n:'STOP-Bang and Epworth (sleep)', who:'Patient; a bed partner can confirm snoring', what:'Sleep apnoea risk and daytime sleepiness.',
     score:'STOP-Bang (0–8): 0–2 low, 3–4 intermediate, 5–8 high. Epworth (0–24): 0–10 normal, 11–12 mild, 13–15 moderate, 16–24 severe sleepiness.',
     res:[['STOP-Bang 5–8','Sleep apnoea likely enough to investigate.','warn'],['3–4','Possible sleep apnoea.','info'],['0–2','Less likely.','ok']],
     watch:'Sleep apnoea and insomnia can mimic ADHD; treat them first.', feeds:'Sleep differential and baseline'},
    {id:'cssrs', ab:"C-SSRS", full:"Columbia Suicide Severity Rating Scale (screen version)", use:"Structured questions about suicidal thoughts and behaviour, to decide how much enquiry is needed now.", basis:"NICE NG225 (self-harm): use questions to guide a psychosocial assessment, never to predict risk or label people low, medium or high risk.", n:'C-SSRS screen (suicide)', who:'Asked by a clinician, by phone, video or in person', what:'Structured suicide questions.',
     score:'Ask questions 1 and 2. If 2 is yes, ask 3, 4 and 5. Always ask 6 (any suicidal behaviour ever; if yes, in the past 3 months?). Note the highest yes.',
     res:[['No to all','No recent thoughts or lifetime behaviour reported.','ok'],['Yes to 1 and/or 2 only','Wish to be dead or suicidal thoughts without method, intent or plan.','warn'],['Yes to 3, 4, 5 or recent behaviour','More urgent enquiry, consultation and a safety plan now.','bad']],
     watch:'NICE NG225: never use it to label people low, medium or high risk, or to decide who gets care. Do not wait for the appointment to follow up a positive form.', feeds:'Safety and risk'}
   ]}
  ];
  var BY = {}; G.forEach(function(g){ g.forms.forEach(function(f){ BY[f.id] = f; }); });

  var STEPS = [
   {t:'Orient and consent', d:'Explain the process in advance: how many appointments, how long, who to bring and what will be asked. Record consent to contact informants and to request records.', f:[], src:'UKAAN AQAS 2024'},
   {t:'Send the ADHD self-report pack', d:'A current symptom scale (baseline), a childhood recall scale and an impairment scale. Add a broad checklist if useful.', f:['asrs18','wurs25','wfirs','wsr2'], src:'AQAS; CADDRA 4.1'},
   {t:'Screen for coexisting conditions', d:'Short screens for depression, anxiety, alcohol, drugs and autistic traits for everyone; add bipolar, trauma, personality and sleep screens when the history points that way.', f:['phq9','gad7','audit','dast10','aq10','mdq','pcl5','msibpd','stopbang'], src:'AQAS; CR235'},
   {t:'Act on safety straight away', d:'If PHQ-9 item 9 is 1 or more, or any WSR-II suicide item is rated, a clinician asks the C-SSRS questions <strong>before</strong> the appointment and makes a safety plan.', f:['cssrs'], src:'NICE NG225', alert:true},
   {t:'Gather informants and records', d:'A current observer form (partner or friend) and a childhood form (parent or older sibling), completed separately. Request school reports, the GP summary, CAMHS or educational psychology letters and previous assessments; invite a life timeline.', f:['informant_forms','history_questionnaire','school_reports','previous_records'], src:'AQAS; CR235 9.6'},
   {t:'Review everything before the DIVA', d:'Score each form, build a dated timeline, list discrepancies to explore (for example very high symptom scores with little impairment, or informants who disagree), and write the probes you will use in the interview. Keep the scores as the treatment baseline.', f:[], src:'NICE NG87 1.3.2, 1.7.26'}
  ];

  /* ---------- 1. step-by-step pack ---------- */
  var pk = document.querySelector('[data-prepack]');
  if(pk){
    var h = '<ol class="pp">';
    STEPS.forEach(function(s,i){
      h += '<li class="pp-s'+(s.alert?' pp-alert':'')+'"><span class="pp-n">'+(i+1)+'</span><div class="pp-b"><b>'+s.t+'</b><p>'+s.d+'</p>';
      if(s.f.length) h += '<div class="pp-f">'+s.f.map(function(id){ var f = BY[id]; return '<button type="button" class="pp-form" data-form="'+id+'"><b>'+f.ab+'</b><span class="pp-full">'+f.full+'</span><span class="pp-use">'+f.use+'</span></button>'; }).join('')+'</div>';
      h += '<span class="bf-ref">'+s.src+'</span></div></li>';
    });
    pk.innerHTML = h + '</ol>';
  }

  /* ---------- 2. form library explorer ---------- */
  var lib = document.querySelector('[data-formlib]'); if(!lib) return;
  var tabs = '', panels = '';
  G.forEach(function(g){
    tabs += '<span class="fl-grp">'+g.g+'</span>';
    g.forms.forEach(function(f){
      tabs += '<button type="button" role="tab" class="fl-tab" data-form="'+f.id+'" aria-selected="false"><b>'+f.ab+'</b><small>'+f.full+'</small></button>';
      panels += '<div class="fl-panel" role="tabpanel" data-form="'+f.id+'" hidden><h3>'+f.ab+'</h3><p class="fl-full">'+f.full+'</p><p class="fl-who">'+f.who+'</p><p class="fl-what">'+f.what+'</p>'
        + '<div class="fl-why"><div><span class="fx-lbl">Used for</span><p>'+f.use+'</p></div><div><span class="fx-lbl">Guideline basis</span><p>'+f.basis+'</p></div></div>'
        + '<div class="fl-box fl-score"><span class="fx-lbl">How to score it</span><p>'+f.score+'</p></div>'
        + '<div class="fl-res"><span class="fx-lbl">What the result means</span>'+f.res.map(function(r){ return '<div class="fl-r fl-'+r[2]+'"><b>'+r[0]+'</b><span>'+r[1]+'</span></div>'; }).join('')+'</div>'
        + '<div class="fl-box fl-watch"><span class="fx-lbl">Watch out</span><p>'+f.watch+'</p></div>'
        + '<p class="fl-foot"><span><span class="fx-lbl">Feeds into</span>'+f.feeds+'</span><a href="'+WS+f.id+'" target="_blank" rel="noopener">Full reading guide and worked example in the Assessment workspace ↗</a></p></div>';
    });
  });
  lib.innerHTML = '<div class="fl"><div class="fl-tabs" role="tablist" aria-label="Pre-assessment forms">'+tabs+'</div><div class="fl-panels">'+panels+'</div></div>';
  var tb = lib.querySelectorAll('.fl-tab'), pn = lib.querySelectorAll('.fl-panel');
  function sel(id, focusPanel){
    tb.forEach(function(t){ var on = t.dataset.form===id; t.setAttribute('aria-selected', on?'true':'false'); t.classList.toggle('on', on); t.tabIndex = on?0:-1; });
    pn.forEach(function(p){ p.hidden = p.dataset.form!==id; });
    if(focusPanel){ var top = lib.getBoundingClientRect().top + window.scrollY - 90; window.scrollTo({top:top}); }
  }
  lib.addEventListener('click', function(e){ var t = e.target.closest('.fl-tab'); if(t) sel(t.dataset.form); });
  if(pk) pk.addEventListener('click', function(e){ var c = e.target.closest('.pp-form'); if(c) sel(c.dataset.form, true); });
  sel('asrs18');
})();
