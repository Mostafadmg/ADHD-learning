/* Additional explorers (Modules 3, 4, 6, 7, 8, 9). Educational aids only. */
(function(){
  'use strict';
  var XP=window.XP; if(!XP||!XP.form) return;
  var esc=XP.esc, clamp=XP.clamp;
  function ul(a){ return '<ul>'+a.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>'; }
  function p(a){ return a.map(function(x){return '<p>'+x+'</p>';}).join(''); }
  function has(arr,v){ return arr.indexOf(v)>=0; }

  /* ================= M3: DSM-5 criteria checker ================= */
  var IN=[['i1','Careless mistakes / misses details'],['i2','Hard to sustain attention'],['i3','Does not seem to listen'],['i4','Does not finish tasks'],['i5','Difficulty organising'],['i6','Avoids sustained mental effort'],['i7','Loses things'],['i8','Easily distracted'],['i9','Forgetful in daily activities']];
  var HI=[['h1','Fidgets / squirms'],['h2','Leaves seat when expected to stay'],['h3','Runs or climbs inappropriately (adults: feels restless)'],['h4','Cannot play or relax quietly'],['h5','"On the go", as if driven by a motor'],['h6','Talks excessively'],['h7','Blurts out answers'],['h8','Difficulty waiting their turn'],['h9','Interrupts or intrudes on others']];
  var OTHER=[['dur','Present ≥6 months'],['dev','Inconsistent with developmental level'],['b12','Several symptoms before age 12'],['set','Several symptoms in 2+ settings'],['imp','Clear interference with functioning'],['exp','Not better explained by another condition']];
  function opts(a){ return a.map(function(x){return {v:x[0],label:x[1]};}); }
  var ALLO=['dur','dev','b12','set','imp','exp'];
  XP.registry.dsm = function(m){ XP.form(m,{
    kicker:'Interactive checker · Module 3', title:'DSM-5 criteria checker', visualFirst:true,
    intro:'Tick the symptoms and criteria you have evidence for, or load an example. The checker shows which DSM-5 criteria are met and why. <strong>Educational, not diagnostic.</strong> In the UK, diagnosis is made by a trained specialist after a full clinical and psychosocial assessment, never from a checklist or rating scale alone (NG87 1.3.1–1.3.2).',
    presetLabel:'Examples',
    presets:[
      {label:'Child: combined',set:{age:'child',ina:['i1','i2','i4','i5','i8','i9','i7'],hi:['h1','h2','h3','h5','h6','h8'],oth:ALLO.slice(),sev:'mod'}},
      {label:'Adult: inattentive',set:{age:'adult',ina:['i2','i4','i5','i6','i9','i8'],hi:['h1','h4'],oth:ALLO.slice(),sev:'mod'}},
      {label:'Sub-threshold',set:{age:'child',ina:['i2','i8','i9','i3'],hi:['h1','h6'],oth:ALLO.slice(),sev:'mild'}},
      {label:'Onset after 12',set:{age:'adult',ina:['i2','i4','i5','i8','i9','i6'],hi:['h1','h4','h5','h6','h9'],oth:['dur','dev','set','imp','exp'],sev:'mod'}},
      {label:'One setting only',set:{age:'child',ina:['i1','i2','i4','i5','i8','i9'],hi:[],oth:['dur','dev','b12','imp','exp'],sev:'mod'}}],
    controls:[
      {type:'chips',id:'age',label:'Age',value:'child',options:[{v:'child',label:'Child / young person (≤16)'},{v:'adult',label:'17 years and over'}]},
      {type:'multi',id:'ina',label:'A1 · Inattention (9 symptoms)',value:[],options:opts(IN)},
      {type:'multi',id:'hi',label:'A2 · Hyperactivity–impulsivity (9 symptoms)',value:[],options:opts(HI)},
      {type:'multi',id:'oth',label:'Criteria A–E',value:[],options:opts(OTHER)},
      {type:'chips',id:'sev',label:'Impairment (NICE)',value:'mild',options:[{v:'none',label:'None'},{v:'mild',label:'Mild'},{v:'mod',label:'At least moderate'}]}],
    evaluate:function(st){
      var need=st.age==='adult'?5:6, ni=st.ina.length, nh=st.hi.length, A1=ni>=need, A2=nh>=need, o=st.oth;
      var miss=[]; if(!A1&&!A2) miss.push('symptom count (A1 or A2 needs ≥'+need+')');
      [['dur','symptoms for ≥6 months (A)'],['dev','inconsistent with developmental level (A)'],['b12','several symptoms before age 12 (B)'],['set','several symptoms in 2+ settings (C)'],['imp','clear interference with functioning (D)'],['exp','not better explained by another condition (E)']].forEach(function(x){ if(!has(o,x[0])) miss.push(x[1]); });
      var met=!miss.length, pres=A1&&A2?'combined presentation':A1?'predominantly inattentive presentation':'predominantly hyperactive-impulsive presentation';
      var nice=met&&st.sev==='mod';
      var tone=nice?'ok':met?'warn':(miss.length<=2?'mid':'low');
      var badge=nice?'Criteria met':met?'DSM met · NICE not':'Not met';
      var title=nice?'Consistent with ADHD, '+pres:met?'DSM-5 criteria met, but impairment below NICE threshold':'DSM-5 criteria not met ('+miss.length+' gap'+(miss.length>1?'s':'')+')';
      var text=[];
      text.push('<strong>Symptom count:</strong> '+ni+'/9 inattention and '+nh+'/9 hyperactivity–impulsivity. For '+(st.age==='adult'?'people aged 17 and over DSM-5 needs at least <strong>5</strong>':'children up to 16 DSM-5 needs at least <strong>6</strong>')+' symptoms in a domain, present for at least 6 months and to a degree inconsistent with developmental level.');
      if(met) text.push('All of criteria A–E are ticked, giving the <strong>'+pres+'</strong>. The presentation describes the last 6 months and can change over time (for example, hyperactivity often becomes inner restlessness in adults).');
      else text.push('<strong>Missing:</strong> '+miss.join('; ')+'. '+(has(miss,'several symptoms before age 12 (B)')?'Onset after 12 does not rule out ADHD in itself, since symptoms may have been unrecognised. Collateral history (school reports, family) is key, but a genuinely late onset should prompt a search for other causes (Module 8).':'Without every criterion, the pattern may still matter clinically, so look for differentials (Module 8).'));
      text.push('<strong>NICE adds</strong> that symptoms must cause <strong>at least moderate</strong> psychological, social, educational or occupational impairment, based on interview and/or direct observation in multiple settings, and be pervasive in two or more important settings (NG87 1.3.3). '+(met&&!nice?'Here impairment is recorded as '+(st.sev==='none'?'absent':'mild')+', so a UK diagnosis would not be made.':''));
      var bars=[{label:'Inattention symptoms',sub:'threshold '+need+'/9',tone:A1?'pos':'pos2',v:ni/9,text:ni+' of 9'},{label:'Hyperactivity–impulsivity',sub:'threshold '+need+'/9',tone:A2?'pos':'pos2',v:nh/9,text:nh+' of 9'},{label:'Criteria A–E evidenced',tone:'pos',v:o.length/6,text:o.length+' of 6'},{label:'Impairment',sub:'NICE needs moderate',tone:st.sev==='mod'?'pos':'neg2',v:st.sev==='mod'?0.8:st.sev==='mild'?0.4:0.05}];
      var vis='<div class="xf-sum xp-t-'+tone+'" aria-hidden="true"><b>'+badge+'</b><span>Inattention <strong>'+ni+'/9</strong></span><span>Hyper–impulsive <strong>'+nh+'/9</strong></span><span>Criteria <strong>'+o.length+'/6</strong></span><small>Threshold '+need+' per domain · result updates as you tick</small></div>';
      return {tone:tone,badge:badge,title:title,text:p(text),bars:bars,visual:vis,
        tiles:[{label:'Threshold',value:'≥'+need+' per domain',tone:'info'},{label:'A1 inattention',value:A1?'Met':'Not met',tone:A1?'ok':'low'},{label:'A2 hyper–impulsive',value:A2?'Met':'Not met',tone:A2?'ok':'low'}],
        patient:nice?'<p>A specialist may make a diagnosis after a full assessment. Diagnosis can explain long-standing struggles and opens up support, environmental changes and, where appropriate, treatment options.</p>':'<p>Symptoms alone do not make a diagnosis. Difficulties may still deserve support (school or workplace adjustments, help for sleep, anxiety or learning needs), whatever the outcome.</p>',
        pharm:ul(['Pharmacists do not diagnose: signpost to the GP for referral, using NG87 1.2 (children: watchful waiting up to 10 weeks and group parent support; adults: referral when symptoms began in childhood, have persisted, and cause at least moderate impairment, 1.2.10).','Do not rely on online self-tests or rating scales alone (1.3.2).','Use the checker to explain to families <em>why</em> an assessment asks about childhood, several settings and impairment.'])};
    },
    note:'Educational, not diagnostic. Symptom labels are short paraphrases of DSM-5-TR criterion A; consult the full criteria text. ICD-11 (6A05) uses similar concepts without fixed symptom counts.',
    sources:['American Psychiatric Association. DSM-5-TR (2022): ADHD criteria A–E; ≥6 symptoms (≥5 for age 17+), several before 12, 2+ settings.','NICE NG87 (live text checked Oct 2026): 1.2.7, 1.2.10, 1.3.1, 1.3.2, 1.3.3.']
  }); };

  /* ================= M4: NICE pathway decision tree ================= */
  var N={
    start:{q:'Who is the person?',tone:'info',badge:'Start',title:'Choose the age group',text:'NICE NG87 has different first steps for under-5s, children aged 5 and over and young people, and adults. Everyone gets information, support and a shared treatment plan (1.5.2–1.5.6).',opts:[['Child under 5','u5'],['Child 5+ or young person','c1'],['Adult','a1']]},
    u5:{q:'After an ADHD-focused group parent-training programme, do symptoms still cause significant impairment across settings (after environmental modifications)?',tone:'mid',badge:'Under 5',title:'Group parent training first',clause:'1.5.7',text:'Offer an ADHD-focused group parent-training programme to parents or carers of children under 5 as <strong>first-line treatment</strong> (1.5.7).',opts:[['No: improving','u5ok'],['Yes: still significant impairment','u5b']]},
    u5ok:{end:true,tone:'ok',badge:'Continue',title:'Continue support and review',clause:'1.8.4',text:'Continue non-drug support and review according to severity, whether or not medication is used (1.8.4).'},
    u5b:{end:true,tone:'warn',badge:'Specialist',title:'Specialist advice; medication only after a second specialist opinion',clause:'1.5.8–1.5.9',text:'Obtain advice from a specialist ADHD service with expertise in young children, ideally tertiary (1.5.8). <strong>Do not offer medication to any child under 5 without a second specialist opinion</strong> (1.5.9). Most ADHD medicines are not licensed below 6 years.'},
    c1:{q:'After ADHD-focused information and support (1.5.10) and environmental modifications, is there still persistent significant impairment in at least one domain?',tone:'mid',badge:'Age 5+',title:'Support and environmental modifications first',clause:'1.5.10, 1.5.13',text:'Give ADHD-focused information and support to parents and carers (1.5.10). If there are symptoms of ODD or conduct disorder, offer a parent-training programme (1.5.11). Implement and review environmental modifications.',opts:[['No','c1ok'],['Yes','c2']]},
    c1ok:{end:true,tone:'ok',badge:'No medication now',title:'Medication not indicated at present',clause:'1.5.13, 1.8.4',text:'NICE offers medication only if symptoms still cause persistent significant impairment after environmental modifications have been implemented and reviewed (1.5.13). Continue support and review (1.8.4).'},
    c2:{q:'After a 6-week trial of methylphenidate at an adequate dose, was there enough benefit?',tone:'ok',badge:'1st line',title:'Methylphenidate (short or long acting)',clause:'1.7.7',text:'Offer <strong>methylphenidate</strong> as first-line medication for children aged 5+ and young people (1.7.7; off-label at age 5). Do a baseline assessment first (1.7.4) and titrate in line with the BNF/BNFC (1.7.27).',opts:[['Yes: good response','okT'],['Not enough benefit','c3'],['Not tolerated','c3']]},
    c3:{q:'Lisdexamfetamine after a 6-week adequate trial: what happened?',tone:'warn',badge:'2nd line',title:'Switch to lisdexamfetamine',clause:'1.7.8',text:'Consider switching to <strong>lisdexamfetamine</strong> after a 6-week trial of methylphenidate at an adequate dose without enough benefit (1.7.8).',opts:[['Good response','okT'],['Responds, but long profile not tolerated','c4'],['No response / not tolerated','c5']]},
    c4:{end:true,tone:'ok',badge:'Option',title:'Consider dexamfetamine',clause:'1.7.9',text:'Consider <strong>dexamfetamine</strong> if symptoms respond to lisdexamfetamine but the longer effect profile cannot be tolerated (1.7.9). It is licensed for 6–17 years when the response to methylphenidate is clinically inadequate.'},
    c5:{q:'Atomoxetine or guanfacine: what happened?',tone:'high',badge:'3rd line',title:'Atomoxetine or guanfacine',clause:'1.7.10',text:'Offer <strong>atomoxetine or guanfacine</strong> if methylphenidate and lisdexamfetamine are not tolerated, or symptoms did not respond to separate 6-week trials of each, having considered alternative preparations and adequate doses (1.7.10).',opts:[['Good response','okT'],['Unresponsive','ter']]},
    a1:{q:'After environmental modifications, is there still significant impairment in at least one domain?',tone:'mid',badge:'Adult',title:'Environmental modifications first',clause:'1.5.15',text:'Offer medication to adults if ADHD symptoms still cause significant impairment in at least one domain after environmental modifications have been implemented and reviewed (1.5.15).',opts:[['Yes: wants medication','a2'],['Yes: prefers no medication','aNP'],['No','c1okA']]},
    c1okA:{end:true,tone:'ok',badge:'No medication now',title:'Medication not indicated at present',clause:'1.5.15, 1.8.4',text:'Continue support and follow-up according to severity (1.8.4).'},
    aNP:{end:true,tone:'ok',badge:'Non-drug',title:'Non-pharmacological treatment',clause:'1.5.16, 1.5.18',text:'Consider non-pharmacological treatment for adults who make an informed choice not to have medication, or who have difficulty adhering, find it ineffective or cannot tolerate it (1.5.16). As a minimum: a structured supportive psychological intervention focused on ADHD, plus regular follow-up (1.5.18). It may include CBT.'},
    a2:{q:'After a 6-week trial at an adequate dose, was there enough benefit?',tone:'ok',badge:'1st line',title:'Lisdexamfetamine or methylphenidate',clause:'1.7.11',text:'Offer <strong>lisdexamfetamine or methylphenidate</strong> first line for adults (1.7.11). Not all methylphenidate preparations are licensed for adults.',opts:[['Yes','okT'],['Not enough benefit: switch to the other','a3'],['Lisdexamfetamine works, but profile not tolerated','a4']]},
    a3:{q:'After a 6-week trial of the other stimulant?',tone:'warn',badge:'Switch',title:'Switch stimulant',clause:'1.7.12–1.7.13',text:'Consider switching to lisdexamfetamine after an inadequate 6-week methylphenidate trial (1.7.12), or to methylphenidate after an inadequate lisdexamfetamine trial (1.7.13).',opts:[['Good response','okT'],['Neither tolerated / no response','a5']]},
    a4:{end:true,tone:'ok',badge:'Option',title:'Consider dexamfetamine (off-label in adults)',clause:'1.7.14',text:'Consider dexamfetamine for adults whose symptoms respond to lisdexamfetamine but who cannot tolerate the longer effect profile (1.7.14; off-label).'},
    a5:{q:'Atomoxetine: what happened?',tone:'high',badge:'Next line',title:'Atomoxetine',clause:'1.7.15, 1.7.17',text:'Offer <strong>atomoxetine</strong> if lisdexamfetamine and methylphenidate are not tolerated or there was no response to separate 6-week trials of each (1.7.15). <strong>Guanfacine in adults</strong> only with advice from a tertiary ADHD service (1.7.17; off-label).',opts:[['Good response','okT'],['Unresponsive','ter']]},
    okT:{end:true,tone:'ok',badge:'Optimised',title:'Continue: dose optimisation, then shared care',clause:'1.7.27, 1.7.29, 1.8',text:'Titrate to dose optimisation (1.7.27). After titration and stabilisation, prescribing and monitoring move to primary care under Shared Care Protocol arrangements (1.7.29). Monitor as in Module 6 (1.8).'},
    ter:{end:true,tone:'danger',badge:'Tertiary',title:'Second opinion or tertiary referral',clause:'1.7.16',text:'Obtain a second opinion or refer to a tertiary service if symptoms are unresponsive to one or more stimulants and one non-stimulant (1.7.16).'}
  };
  XP.registry.path = function(m){
    var trail=['start'];
    var R=XP.form(m,{
      kicker:'Interactive pathway · Module 4', title:'NICE NG87 pathway walker',
      intro:'Choose the age group, then answer each question to walk the NICE treatment pathway. Each step shows the NG87 recommendation it comes from. This is a teaching summary and does not replace the full guideline or specialist judgement.',
      controls:[], visualFirst:true,
      evaluate:function(){
        var id=trail[trail.length-1], n=N[id], depth=trail.length;
        var vis='<ol class="pw-trail">'+trail.map(function(t,i){ var x=N[t]; return '<li class="pw-step xp-t-'+x.tone+(i===trail.length-1?' cur':'')+'"><span class="pw-dot"></span><b>'+esc(x.title)+'</b>'+(x.clause?' <small>NG87 '+esc(x.clause)+'</small>':'')+(i<trail.length-1&&trail.answers&&trail.answers[i]?'<em>→ '+esc(trail.answers[i])+'</em>':'')+'</li>'; }).join('')+'</ol>'
          +(n.end?'':'<p class="pw-q">'+esc(n.q)+'</p><div class="xp-chips pw-opts" role="group" aria-label="Answer">'+n.opts.map(function(o,i){return '<button type="button" class="xp-chip" data-o="'+i+'">'+esc(o[0])+'</button>';}).join('')+'</div>')
          +'<div class="pw-nav">'+(trail.length>1?'<button type="button" class="xp-chip pw-back">← Back a step</button><button type="button" class="xp-chip pw-reset">Start again</button>':'')+'</div>';
        var line=id==='start'?'':(id[0]==='u'?'u5':id[0]==='a'?'adult':'child');
        return {tone:n.tone,badge:n.badge,title:n.title,text:'<p>'+n.text+'</p>',visual:vis,
          patient:n.end?(n.tone==='danger'?'<p>A different specialist team will review the options. Not responding to several medicines is not a failure; it means a closer look at the diagnosis, coexisting conditions and alternatives.</p>':'<p>The plan is shared: you can revisit decisions about treatment at any point (1.5.6). Keep doing the non-drug strategies that help.</p>'):'<p>Each step is a joint decision after discussing benefits, harms and preferences (1.5.4). A "6-week trial" means 6 weeks at an <em>adequate</em> dose, not just the starting dose.</p>',
          pharm:ul(['Check where the person is on the pathway before advising on a switch: the "6-week trial at an adequate dose" rule (1.7.8, 1.7.12) applies at each step.','Initiation and switches are specialist decisions (1.7.2); in primary care, support adherence, monitor (1.8) and feed back to the specialist under shared care (1.7.29).',line==='adult'?'Adults: guanfacine needs tertiary advice (1.7.17); dexamfetamine is off-label (1.7.14).':line==='u5'?'Under 5: medication only after a second specialist opinion (1.5.9).':'Children: methylphenidate first line (1.7.7). Check the SPC licence for the age (for example, 6+ for most products).'])};
      },
      after:function(R2,st,render){
        R2.querySelectorAll('.pw-opts .xp-chip').forEach(function(b){ b.onclick=function(){ var n=N[trail[trail.length-1]], o=n.opts[+b.dataset.o]; trail.answers=trail.answers||[]; trail.answers[trail.length-1]=o[0]; trail.push(o[1]); render(); var f=R2.querySelector('.pw-opts .xp-chip,.pw-back'); if(f) f.focus({preventScroll:true}); }; });
        var bk=R2.querySelector('.pw-back'); if(bk) bk.onclick=function(){ trail.pop(); render(); var f=R2.querySelector('.pw-opts .xp-chip'); if(f) f.focus({preventScroll:true}); };
        var rs=R2.querySelector('.pw-reset'); if(rs) rs.onclick=function(){ trail.length=1; trail.answers=[]; render(); var f=R2.querySelector('.pw-opts .xp-chip'); if(f) f.focus({preventScroll:true}); };
      },
      note:'Teaching summary of NICE NG87 (2018, updated 2019). Medicines can be off-label at some ages; check the SPC and the BNF/BNFC.',
      sources:['NICE NG87 (live text checked Oct 2026): 1.5.2–1.5.18, 1.7.2, 1.7.4, 1.7.7–1.7.17, 1.7.27, 1.7.29, 1.8.4.']
    });
  };

  /* ================= M6: BP / HR response explorer (upgrades the old action helper) ================= */
  XP.registry.bp = function(m){ XP.form(m,{
    kicker:'Interactive tool · Module 6', title:'Heart rate and blood pressure: when to act', visualFirst:true,
    intro:'Slide the resting heart rate, choose the blood pressure finding and say whether it was confirmed. The card applies NICE NG87 1.8.9–1.8.12. It is an educational aid, not a clinical decision tool.',
    presetLabel:'Scenarios',
    presets:[{label:'Routine review',set:{grp:'child',hr:88,bp:'norm',two:'no',ex:[]}},{label:'HR 125, once',set:{grp:'child',hr:125,bp:'norm',two:'no',ex:[]}},{label:'HR 125, confirmed',set:{grp:'adult',hr:125,bp:'norm',two:'yes',ex:[]}},{label:'SBP >95th, confirmed',set:{grp:'child',hr:96,bp:'high',two:'yes',ex:[]}},{label:'Guanfacine: fainting',set:{grp:'child',hr:58,bp:'norm',two:'yes',ex:['orth']}}],
    controls:[
      {type:'chips',id:'grp',label:'Patient group',value:'child',options:[{v:'child',label:'Child / young person'},{v:'adult',label:'Adult'}]},
      {type:'range',id:'hr',label:'Resting heart rate',min:40,max:160,step:1,value:88,fmt:function(v){return v+' bpm';}},
      {type:'chips',id:'bp',label:'Systolic BP',value:'norm',options:[{v:'norm',label:'In normal range for age'},{v:'rise',label:'Raised, not significant'},{v:'high',label:'>95th centile / clinically significant rise'}]},
      {type:'chips',id:'two',label:'Confirmed on 2 occasions?',value:'no',options:[{v:'no',label:'Single reading'},{v:'yes',label:'Yes, sustained'}]},
      {type:'multi',id:'ex',label:'Other findings',value:[],options:[{v:'arr',label:'Arrhythmia / palpitations'},{v:'orth',label:'On guanfacine: orthostatic hypotension or fainting'},{v:'chest',label:'Chest pain or syncope on exertion'}]}],
    evaluate:function(st){
      var hr=st.hr, sus=st.two==='yes', hrHi=hr>120, bpHi=st.bp==='high', arr=has(st.ex,'arr'), orth=has(st.ex,'orth'), chest=has(st.ex,'chest');
      var ref=st.grp==='child'?'a paediatric hypertension specialist':'an adult physician';
      var tone,badge,title,text;
      if(chest){ tone='danger';badge='Urgent';title='Exertional chest pain or syncope: same-day medical assessment';text='Symptoms such as chest pain or fainting on exertion need urgent medical assessment. Do not wait for the routine review; contact the prescriber or urgent care today, and withhold the next stimulant dose pending advice (a clinical decision).'; }
      else if(arr || ((hrHi||bpHi)&&sus)){ tone='high';badge='Act: 1.8.11';title='Reduce the dose and refer';text='NICE NG87 1.8.11: sustained resting tachycardia (>120 bpm), arrhythmia, or systolic BP above the 95th centile (or a clinically significant increase) measured on 2 occasions → <strong>reduce the dose and refer to '+ref+'</strong>. Inform the initiating specialist under the shared care protocol.'; }
      else if(hrHi||bpHi){ tone='warn';badge='Recheck';title='Single high reading: repeat to confirm';text='One raised reading is not enough to act under 1.8.11, which requires the finding to be <strong>sustained / measured on 2 occasions</strong>. Repeat at rest (correct cuff size, after sitting quietly), and check timing relative to the dose, caffeine, anxiety and exercise.'; }
      else if(orth){ tone='warn';badge='Act: 1.8.12';title='Guanfacine: reduce the dose or switch';text='If a person taking guanfacine has sustained orthostatic hypotension or fainting episodes, <strong>reduce the dose or switch</strong> to another ADHD medication (NG87 1.8.12). Never stop guanfacine abruptly: taper by no more than 1 mg every 3–7 days (Intuniv SPC).'; }
      else if(st.bp==='rise'||hr>100){ tone='mid';badge='Monitor';title='Within action thresholds: monitor and document';text='Stimulants and atomoxetine commonly raise heart rate and blood pressure a little. Compare with the normal range for age, document, and re-measure at the next scheduled check or sooner if rising (1.8.9).'; }
      else { tone='ok';badge='No action';title='In range: routine monitoring';text='Record heart rate and blood pressure, compare with the normal range for age, and repeat before and after each dose change and every 6 months (1.8.9). Routine ECGs are not needed without a clinical indication (1.8.10).'; }
      var vis='<svg class="xp-svg" viewBox="0 0 360 92" role="img" aria-label="Heart rate scale with the 120 bpm NICE threshold; current '+hr+' bpm">'
        +'<rect x="20" y="30" width="320" height="16" rx="8" fill="#223d59"/><rect x="'+(20+320*(120-40)/120)+'" y="30" width="'+(320*(40)/120)+'" height="16" rx="0" fill="#ff7b7b" opacity=".35"/>'
        +'<line x1="'+(20+320*80/120)+'" y1="22" x2="'+(20+320*80/120)+'" y2="56" stroke="#ff9a9a" stroke-width="2"/>'+XP.t(20+320*80/120,16,'120 bpm (NG87 1.8.11)',{anchor:'middle',fill:'#ff9a9a',weight:600})
        +'<circle cx="'+(20+320*(clamp(hr,40,160)-40)/120)+'" cy="38" r="10" fill="#0f2236" stroke="#fff" stroke-width="3"/>'
        +XP.t(20,76,'40')+XP.t(340,76,'160',{anchor:'end'})+XP.t(180,76,'resting heart rate (bpm)',{anchor:'middle'})+'</svg>';
      return {tone:tone,badge:badge,title:title,text:'<p>'+text+'</p>',visual:vis,
        bars:[{label:'Heart rate vs 120 bpm',sub:hr+' bpm',tone:hrHi?'neg':'pos',v:clamp(hr/160,0,1),text:hr+' bpm'},{label:'Systolic BP finding',tone:bpHi?'neg':st.bp==='rise'?'neg2':'pos',v:bpHi?0.95:st.bp==='rise'?0.6:0.3},{label:'Confirmation',sub:'2 occasions',tone:'pos2',v:sus?1:0.5}],
        tiles:[{label:'HR threshold',value:hrHi?'Above 120':'Below 120',tone:hrHi?'high':'ok'},{label:'Sustained?',value:sus?'Yes (2 readings)':'Single reading',tone:sus?'warn':'info'},{label:'Refer to',value:tone==='high'?(st.grp==='child'?'Paediatric hypertension':'Adult physician'):'Not needed now',tone:tone==='high'?'high':'info'}],
        patient:tone==='ok'||tone==='mid'?'<p>A slightly faster pulse or higher BP is common on ADHD medicines and is usually not dangerous, which is why it is checked regularly. Report palpitations, chest pain, breathlessness or fainting.</p>':'<p>The reading needs follow-up. Do not stop or change the medicine yourself unless told to (guanfacine in particular must not be stopped suddenly); the team will advise on dose changes.</p>',
        pharm:ul(['Measure properly: rested, seated, correct cuff; children\'s BP is interpreted against centiles for age and height (1.7.6 uses the 95th centile for referral before starting).','Act on 1.8.11 only when sustained or confirmed, but act promptly when it is: reduce the dose and refer to '+ref+'.','Check for raisers: decongestants (pseudoephedrine), high caffeine, salbutamol at high dose, missed antihypertensives, and interacting medicines (Module 7).','Document and inform the specialist under shared care.'])};
    },
    note:'Educational aid only, not a clinical decision tool. Heart rate and BP must be compared with the normal range for age (NG87 1.8.9).',
    sources:['NICE NG87 (live text checked Oct 2026): 1.7.6, 1.8.9, 1.8.10, 1.8.11, 1.8.12.','Intuniv SPC §4.2, 4.4: taper by ≤1 mg every 3–7 days; BP and pulse may rise on discontinuation.','Concerta XL SPC §4.5: caution with other drugs that raise BP.']
  }); };

  /* ================= M6: growth / weight trend explorer ================= */
  XP.registry.growth = function(m){ XP.form(m,{
    kicker:'Interactive model · Module 6', title:'Growth and weight on stimulants', visualFirst:true,
    intro:'Drag the slider to show how far a child\'s weight has fallen across centile lines since starting medication, and switch on a height concern. The chart is a schematic centile chart, not real growth data.',
    presetLabel:'Scenarios',
    presets:[{label:'Tracking well',set:{drop:0,ht:'ok'}},{label:'Dipping 1 centile space',set:{drop:1,ht:'ok'}},{label:'Crossing 2 spaces',set:{drop:2,ht:'ok'}},{label:'Height falling behind',set:{drop:2,ht:'low'}}],
    controls:[
      {type:'range',id:'drop',label:'Weight change since starting',min:0,max:3,step:0.25,value:0,fmt:function(v){return v===0?'tracking own centile':'down '+v+' centile space'+(v===1?'':'s');}},
      {type:'chips',id:'ht',label:'Height over time',value:'ok',options:[{v:'ok',label:'As expected for age'},{v:'low',label:'Not meeting expected height'}]}],
    evaluate:function(st){
      var d=st.drop, lowH=st.ht==='low';
      var X0=40,X1=346,Y0=176,Y1=16, cents=[0.4,2,9,25,50,75,91,98,99.6];
      function yc(i){ return Y0-(Y0-Y1)*(i+0.5)/9; }
      var vis='<svg class="xp-svg" viewBox="0 0 360 214" role="img" aria-label="Schematic weight centile chart; the child\'s weight falls '+d+' centile spaces after starting medication">';
      cents.forEach(function(c,i){ vis+='<path d="M'+X0+','+(yc(i)+8)+' L'+X1+','+(yc(i)-20)+'" fill="none" stroke="'+(c===50?'#5f7a96':'#2a4866')+'" stroke-width="'+(c===50?2:1.2)+'"/>'; });
      var start=5, pts=[]; for(var k=0;k<=20;k++){ var u=k/20, x=X0+(X1-X0)*u; var lineI=start-(u>0.3?d*Math.min(1,(u-0.3)/0.5):0); var ybase=Y0-(Y0-Y1)*(lineI+0.5)/9+8-(u*28); pts.push([x, ybase]); }
      vis+='<path d="'+pts.map(function(q,i){return (i?'L':'M')+q[0].toFixed(1)+','+q[1].toFixed(1);}).join('')+'" fill="none" stroke="'+(d>=2?'#ff9a76':d>=1?'#f2c14e':'#5fd3a6')+'" stroke-width="4" stroke-linecap="round"/>';
      vis+='<line x1="'+(X0+(X1-X0)*0.3)+'" y1="'+Y1+'" x2="'+(X0+(X1-X0)*0.3)+'" y2="'+Y0+'" stroke="#c9d6e3" stroke-dasharray="3 4" opacity=".7"/>'+XP.t(X0+(X1-X0)*0.3+5,Y1+12,'medication started',{fill:'#dbe6f0'});
      vis+=XP.t((X0+X1)/2,Y0+24,'Age (schematic)',{anchor:'middle'})+XP.t(16,(Y0+Y1)/2,'Weight centile',{anchor:'middle',rot:-90})+'</svg>';
      var tone,badge,title,text;
      if(lowH){ tone='high';badge='Height';title='Height affected: consider a planned treatment break';text='If height over time is significantly affected by medication (the child has not met the height expected for their age), NICE suggests <strong>considering a planned break over school holidays</strong> to allow catch-up growth (NG87 1.8.7). This is a specialist decision, shared with the family.'; }
      else if(d>=2){ tone='warn';badge='Review';title='Crossing two or more centile spaces: review with the specialist';text='A sustained fall across two or more centile spaces is commonly used as a prompt to review (a growth-chart convention, not an NG87 threshold). Use the NG87 1.8.6 strategies and ask the specialist about the dose, timing or formulation, or a change of medication.'; }
      else if(d>0){ tone='mid';badge='Watch';title='Weight dipping: start weight strategies';text='Appetite suppression is a common, dose-related stimulant effect. If weight loss is a clinical concern, NICE suggests: taking medication with or after food rather than before meals, extra meals or snacks early in the morning or late in the evening, dietary advice and high-calorie foods of good nutritional value (NG87 1.8.6).'; }
      else { tone='ok';badge='On track';title='Tracking own centile: routine monitoring';text='Keep plotting. NICE: height every 6 months in children and young people; weight every 3 months if 10 years or under, and at 3 and 6 months after starting and then 6-monthly if over 10 (NG87 1.8.5).'; }
      return {tone:tone,badge:badge,title:title,text:'<p>'+text+'</p>',visual:vis,
        bars:[{label:'Weight trend',sub:'centile spaces lost',tone:d>=2?'neg':'neg2',v:d/3,text:d+' spaces'},{label:'Appetite at lunch',sub:'typical, schematic',tone:'pos',v:clamp(0.9-d*0.22,0.1,1)},{label:'Height concern',tone:lowH?'neg':'pos2',v:lowH?0.85:0.1}],
        tiles:[{label:'Weigh',value:'3-monthly ≤10 y',tone:'info'},{label:'Height',value:'6-monthly',tone:'info'},{label:'Plot on',value:'Growth chart',tone:'info'}],
        patient:'<p>Eat a good breakfast before or with the morning dose, keep snacks for after school, and offer a larger meal in the evening when the medicine has worn off. Weight is checked regularly because of this.</p>',
        pharm:ul(['Ask about appetite and meals at every supply; check that height and weight have been <strong>plotted</strong> (1.8.5).','Advise the NG87 1.8.6 strategies; for adults, consider monitoring BMI if weight changes, and changing medication if the change persists (1.8.8).','Refer persistent weight loss or a height concern back to the specialist; planned breaks are a specialist decision (1.8.7).'])};
    },
    note:'Conceptual model: schematic centile lines; the shape of the curve is illustrative. Growth must be judged on real, plotted measurements.',
    sources:['NICE NG87 (live text checked Oct 2026): 1.8.5, 1.8.6, 1.8.7, 1.8.8.','UK-WHO growth charts (RCPCH): centile lines and spaces. The 2-space review prompt is a convention, not an NG87 recommendation.']
  }); };

  /* ================= M7: side-effect management explorer ================= */
  var SE={
    app:{l:'Appetite / weight loss',drugs:'Stimulants, atomoxetine',time:'From the first weeks; worst at lunchtime while the dose is working',mech:'Dose-related: catecholamine effects on central appetite regulation during the hours of effect.',m:['Take the dose with or after breakfast; offer a substantial breakfast and an after-school snack.','Apply NG87 1.8.6 strategies: extra meals early morning or late evening, high-calorie foods of good nutritional value, dietary advice. Monitor weight (1.8.5).','Refer to the specialist: dose or formulation change, a planned break or a change of medication (1.8.6–1.8.7).'],pt:'Eat when the medicine is weakest (breakfast before it peaks, a bigger evening meal).'},
    sleep:{l:'Insomnia / delayed sleep',drugs:'Stimulants (late or long-acting doses)',time:'Days to weeks; linked to dose timing',mech:'Stimulant still active at bedtime; ADHD itself is also linked to sleep problems.',m:['Give the dose earlier; avoid late top-ups; sleep hygiene and caffeine review.','Keep a sleep diary and adjust medication accordingly (NG87 1.8.17); consider a shorter-acting profile with the prescriber (see the day-profile builder).','Specialist review; melatonin only via the specialist.'],pt:'Keep a sleep diary for 2 weeks: bedtime, sleep onset, dose times.'},
    head:{l:'Headache / abdominal pain',drugs:'Stimulants, atomoxetine',time:'Usually early in treatment and often transient',mech:'Common early adverse effects; often settle as the body adjusts.',m:['Take with food; reassure that it often settles; simple analgesia if appropriate.','If persistent, review the dose and timing with the prescriber.','Severe or unusual headache (for example with high BP or neurological symptoms): urgent medical assessment.'],pt:'Report it if it lasts more than a couple of weeks or is severe.'},
    cv:{l:'Raised heart rate / BP',drugs:'Stimulants, atomoxetine',time:'After starting and after each dose increase',mech:'Sympathomimetic (noradrenergic) effect on heart rate and vascular tone.',m:['Monitor before and after each dose change and every 6 months (NG87 1.8.9).','Repeat to confirm; check decongestants, caffeine and interacting drugs (Module 7).','Sustained HR >120, arrhythmia or SBP >95th centile on 2 occasions: reduce the dose and refer (1.8.11). Use the Module 6 tool.'],pt:'Report palpitations, chest pain or fainting at once.'},
    reb:{l:'Rebound irritability',drugs:'IR stimulants; any stimulant as it wears off',time:'Late afternoon / evening as the level falls',mech:'Symptoms return, sometimes with irritability, as the dose wears off.',m:['Plan calm, structured time and a snack at the wearing-off time.','Discuss an MR formulation or a small later IR dose with the prescriber (NG87 1.7.22), weighing sleep.','If behaviour worsens on medication, adjust the medication and review the diagnosis (1.8.18).'],pt:'Note the time it happens: it helps the team adjust the profile.'},
    anx:{l:'Anxiety / agitation',drugs:'Stimulants',time:'Often at peak levels or after dose increases',mech:'Overshoot of the inverted U: too much catecholamine activity (Module 2).',m:['Check the timing against dose peaks; review caffeine.','Dose reduction or slower titration with the specialist; NICE offers the same medication choices for people with anxiety disorder (1.7.18).','Severe anxiety, agitation or mood change: same-day prescriber contact.'],pt:'Feeling "wired" or anxious on the medicine is worth reporting; the dose may be too high.'},
    tics:{l:'Tics',drugs:'Stimulants',time:'Any time; tics naturally wax and wane',mech:'Possibly stimulant-related; must be judged against the natural course of tics.',m:['Decide whether the tics are related to the stimulant and whether the impairment from the tics outweighs the benefit of treatment (NG87 1.8.13).','If stimulant-related: reduce the dose or consider guanfacine (children 5+ and young people), atomoxetine, clonidine (tertiary advice, under 18) or stopping (1.8.14).','Specialist decision for any switch.'],pt:'Keep a simple record of when tics occur and how much they bother the child.'},
    guan:{l:'Sedation / hypotension (guanfacine)',drugs:'Guanfacine',time:'Early weeks and after dose increases',mech:'α2A agonism lowers sympathetic tone, so BP and HR fall and sleepiness occurs.',m:['Advise caution with driving and cycling until the response is known; drink plenty of fluid; consider evening dosing (SPC allows morning or evening).','Monitor BP, pulse and sedation; check CNS depressants, alcohol and CYP3A4 inhibitors (Module 7).','Sustained orthostatic hypotension or fainting: reduce the dose or switch (NG87 1.8.12). Never stop abruptly: taper by ≤1 mg every 3–7 days (SPC).'],pt:'Stand up slowly; do not stop suddenly.'},
    atx:{l:'Atomoxetine-specific',drugs:'Atomoxetine',time:'Nausea early; mood effects any time; liver injury very rare',mech:'Noradrenaline reuptake inhibition; idiosyncratic hepatic injury (very rare).',m:['Nausea: take with food or split into two doses (SPC). Ask about sexual dysfunction (NG87 1.8.15).','Monitor for suicidal thoughts, agitation and mood change, especially early and after dose changes (SPC §4.4).','Jaundice or evidence of liver injury: stop and do not restart (SPC). Suicidal thoughts: urgent review.'],pt:'Seek help at once for yellow skin or eyes, dark urine, or thoughts of self-harm.'},
    psy:{l:'Psychosis / mania (rare)',drugs:'Stimulants (and others)',time:'Any time; rare',mech:'Excess dopaminergic activity in predisposed people.',m:['Ask about unusual experiences at reviews in people at risk.','Same-day contact with the prescriber or crisis team.','Acute psychotic or manic episode: stop ADHD medication; consider restarting only after it resolves (NG87 1.7.19).'],pt:'Seeing or hearing things others do not, or extreme elation, needs urgent help.'},
    seiz:{l:'New or worse seizures',drugs:'Any ADHD medication',time:'Any time',mech:'Possible lowering of the seizure threshold (for example atomoxetine SPC).',m:['Check the history and interacting drugs that lower the seizure threshold.','Urgent review.','Review the ADHD medication and stop any that might be contributing; after investigation, cautiously reintroduce if unlikely to be the cause (NG87 1.8.16).'],pt:'Any seizure needs medical assessment.'}
  };
  XP.registry.se = function(m){ XP.form(m,{
    kicker:'Interactive explorer · Module 7', title:'Side-effect management explorer',
    intro:'Pick an adverse effect, then how severe or persistent it is. The card shows typical timing and mechanism, and how management escalates. This summarises the table above, NG87 and the SPCs.',
    controls:[
      {type:'chips',id:'e',label:'Adverse effect',value:'app',options:Object.keys(SE).map(function(k){return {v:k,label:SE[k].l};})},
      {type:'chips',id:'s',label:'Severity',value:0,options:[{v:0,label:'Mild / new'},{v:1,label:'Persistent'},{v:2,label:'Severe / red flag'}]}],
    evaluate:function(st){
      var e=SE[st.e], s=+st.s, tone=['mid','warn','danger'][s];
      return {tone:tone,badge:['Step 1','Step 2','Step 3'][s]+' of 3',title:e.l+': '+['first steps','if it persists','severe or red flag'][s],
        text:'<p><strong>Mechanism:</strong> '+e.mech+'</p><p><strong>Management now:</strong> '+e.m[s]+'</p>',
        visual:'<ol class="se-ladder">'+e.m.map(function(x,i){return '<li class="'+(i===s?'cur ':'')+'xp-t-'+['mid','warn','danger'][i]+'"><b>'+['Mild / new','Persistent','Severe / red flag'][i]+'</b><span>'+x+'</span></li>';}).join('')+'</ol>',
        tiles:[{label:'Typical drugs',value:e.drugs,tone:'info'},{label:'Timing',value:e.time,tone:'info'}],
        patient:'<p>'+e.pt+'</p>',
        pharm:ul(['Ask open questions at every supply (appetite, sleep, mood, palpitations, tics) and record adverse effects (NG87 1.8.1–1.8.2).',s===2?'Red flag: contact the prescriber the same day (or urgent care), and document.':'Manage within your competence and the shared care protocol; feed back to the prescriber.','Consider whether timing, brand switch, interacting medicines or overshoot explain the effect (Modules 5 and 7).'])};
    },
    note:'Educational summary. Frequencies are not quoted because they could not be verified against SPC tables for all products.',
    sources:['NICE NG87 (live text checked Oct 2026): 1.7.18, 1.7.19, 1.7.22, 1.8.1–1.8.18.','SPCs (emc): Concerta XL, Elvanse, atomoxetine, Intuniv §4.2, 4.4, 4.8.']
  }); };

  /* ================= M7: interaction checker ================= */
  var ADHD={mph:'Methylphenidate',amf:'Lisdexamfetamine / dexamfetamine',atx:'Atomoxetine',gua:'Guanfacine'};
  var OTH={maoi:'MAOI (e.g. phenelzine)',f2d6:'Fluoxetine / paroxetine',ssri:'Other SSRIs / SNRIs',inh3:'Clarithromycin / ketoconazole / grapefruit',ind:'Carbamazepine / phenytoin / rifampicin',val:'Valproate',ahyp:'Antihypertensives',clon:'Clonidine',alc:'Alcohol',dec:'Pseudoephedrine / phenylephrine',salb:'High-dose salbutamol (IV / nebulised)',qt:'QT-prolonging drugs',warf:'Warfarin (coumarins)',apsy:'Antipsychotics',alk:'Urinary alkalinisers (bicarbonate, acetazolamide)',anae:'Halogenated anaesthetics (surgery)'};
  var SEV={contra:['danger','Contraindicated'],major:['high','Major: adjust'],caution:['warn','Caution'],monitor:['mid','Monitor'],none:['ok','No relevant interaction expected'],unk:['info','Not in SPC sections reviewed']};
  var IX={
    'mph|maoi':['contra','Possible hypertensive crisis.','Do not use during or within 2 weeks of a non-selective irreversible MAOI (SPC §4.3, 4.5).'],
    'amf|maoi':['contra','Increased release of noradrenaline and other monoamines: hypertensive crisis, toxic neurological effects, malignant hyperpyrexia.','Do not give during or within 14 days of an MAOI (Elvanse and dexamfetamine SPCs).'],
    'atx|maoi':['contra','Additive noradrenergic effects.','Atomoxetine must not be used with MAOIs or within 2 weeks of stopping one (SPC §4.3).'],
    'atx|f2d6':['major','Strong CYP2D6 inhibition: atomoxetine exposure up to 6–8× higher, Css max 3–4× higher.','Slower titration and a lower final dose may be needed; re-evaluate response if the inhibitor is started or stopped (SPC §4.5). Serotonergic caution also applies.'],
    'mph|f2d6':['caution','Reports of serotonin syndrome with serotonergic drugs; methylphenidate may inhibit SSRI metabolism.','Counsel on serotonin syndrome symptoms; stop methylphenidate as soon as possible if suspected (Concerta SPC §4.5).'],
    'mph|ssri':['caution','Reports of serotonin syndrome; methylphenidate may inhibit the metabolism of some antidepressants.','Counsel on symptoms; dose adjustment of the antidepressant may be needed when starting or stopping methylphenidate (SPC §4.5).'],
    'amf|f2d6':['caution','Serotonin syndrome rarely reported with amfetamines plus SSRIs/SNRIs.','Counsel on symptoms and monitor (Elvanse SPC §4.5).'],
    'amf|ssri':['caution','Serotonin syndrome rarely reported with amfetamines plus SSRIs/SNRIs.','Counsel on symptoms and monitor (Elvanse SPC §4.5).'],
    'atx|ssri':['caution','Increased risk of serotonin syndrome; some (fluoxetine, paroxetine) also inhibit CYP2D6; SSRIs can lower the seizure threshold.','Use with caution; titrate slowly if a CYP2D6 inhibitor is involved (SPC §4.5).'],
    'gua|inh3':['major','CYP3A4/5 inhibition: with ketoconazole, guanfacine Cmax ×2 and AUC ×3; risk of hypotension, bradycardia and sedation.','A 50% dose reduction of guanfacine is recommended with moderate or strong CYP3A4/5 inhibitors (Intuniv SPC §4.2, 4.5). Grapefruit juice is listed.'],
    'gua|ind':['major','CYP3A4 induction: with rifampicin, guanfacine Cmax down 54% and AUC down 70%.','An increase in the guanfacine dose within the recommended range is proposed (Intuniv SPC §4.2, 4.5).'],
    'mph|ind':['monitor','Methylphenidate may inhibit the metabolism of anticonvulsants (phenobarbital, phenytoin, primidone). It is not CYP-metabolised, so inducers are not expected to affect it.','Check anticonvulsant levels and adjust when starting or stopping methylphenidate (SPC §4.5).'],
    'amf|ind':['monitor','Dexamfetamine may inhibit the metabolism of phenobarbital, phenytoin and primidone; its own CYP dependence is unknown.','Caution; monitor anticonvulsant levels (dexamfetamine SPC §4.5).'],
    'mph|inh3':['none','Methylphenidate is not metabolised by CYP450 to a clinically relevant extent.','No adjustment expected (SPC §4.5). Note that clarithromycin and erythromycin can prolong QT in their own right.'],
    'amf|inh3':['caution','It is not known to what degree dexamfetamine metabolism depends on CYP enzymes.','Co-administration with potent CYP inhibitors should be made with caution (dexamfetamine SPC §4.5).'],
    'atx|inh3':['caution','Clinically relevant increases are possible only in CYP2D6 poor metabolisers taking potent inhibitors of other CYP enzymes; erythromycin is also QT-prolonging.','Caution (atomoxetine SPC §4.5).'],
    'gua|val':['monitor','Guanfacine can increase valproic acid concentrations (possibly competitive glucuronidation).','Monitor for CNS effects and consider valproate levels; adjust doses as needed (Intuniv SPC §4.5).'],
    'mph|ahyp':['monitor','Methylphenidate may decrease the effectiveness of antihypertensives.','Monitor BP (SPC §4.5).'],
    'amf|ahyp':['monitor','Amfetamines may decrease the effectiveness of antihypertensives.','Monitor BP (Elvanse SPC §4.5).'],
    'atx|ahyp':['monitor','Atomoxetine can raise BP and may reduce antihypertensive effect.','Monitor BP; review either drug if BP changes significantly (SPC §4.5).'],
    'gua|ahyp':['caution','Additive hypotension, bradycardia and syncope risk.','Caution; monitor BP and pulse; advise fluids (Intuniv SPC §4.4–4.5).'],
    'mph|clon':['major','Serious adverse events, including sudden death, have been reported with methylphenidate plus clonidine; long-term safety with centrally acting α2 agonists not systematically evaluated.','Specialist decision only; monitor closely (Concerta SPC §4.5). NG87: clonidine only with tertiary advice (1.7.17).'],
    'amf|clon':['caution','Clonidine may prolong dexamfetamine\'s action; dexamfetamine may inhibit clonidine\'s antihypertensive action.','Specialist use only; monitor BP (dexamfetamine SPC §4.5).'],
    'gua|clon':['caution','Two α2 agonists: additive hypotension, bradycardia and sedation (SPC: caution with antihypertensives and sedatives).','Not a routine combination; specialist advice.'],
    'mph|alc':['caution','Alcohol may worsen CNS adverse effects; with Concerta XL, alcohol >10% increased drug release in vitro (and very high alcohol may make some MR beads release faster).','Advise abstaining from alcohol during treatment (SPC §4.5).'],
    'amf|alc':['unk','Limited data on alcohol (Elvanse SPC §4.5).','Advise caution and moderation; check the full SPC.'],
    'gua|alc':['major','Additive sedation and somnolence.','Patients should not drink alcohol while taking guanfacine (Intuniv SPC §4.4).'],
    'mph|dec':['caution','Additive BP effect: caution with any drug that can raise BP.','Advise avoiding OTC sympathomimetic decongestants (SPC §4.5).'],
    'atx|dec':['caution','Drugs affecting noradrenaline (pseudoephedrine, phenylephrine named): additive or synergistic effects; pressor effect.','Use with caution; advise avoiding OTC decongestants (SPC §4.5).'],
    'amf|dec':['caution','Additive sympathomimetic and pressor effect; dexamfetamine SPC advises special caution with vasopressors.','Advise avoiding OTC decongestants.'],
    'atx|salb':['caution','High-dose nebulised or systemic salbutamol: cardiovascular effects can be potentiated. Standard inhaled doses did not increase BP or HR in studies.','Monitor HR and BP (SPC §4.5).'],
    'atx|qt':['caution','Potential increased risk of QT prolongation (for example neuroleptics, class IA/III anti-arrhythmics, moxifloxacin, erythromycin, methadone, TCAs, lithium).','Caution (SPC §4.5).'],
    'gua|qt':['major','Guanfacine lowers heart rate; combined use with QT-prolonging drugs is generally not recommended.','Avoid where possible; specialist advice (Intuniv SPC §4.5).'],
    'mph|warf':['monitor','Methylphenidate may inhibit coumarin metabolism.','Check coagulation times (INR) when starting or stopping (SPC §4.5).'],
    'amf|warf':['monitor','Dexamfetamine may inhibit coumarin metabolism.','Check INR when starting or stopping (dexamfetamine SPC §4.5).'],
    'atx|warf':['none','No protein-binding displacement in vitro (warfarin did not affect atomoxetine binding).','No interaction expected from the SPC data (SPC §4.5).'],
    'mph|apsy':['caution','Pharmacodynamic interactions with dopamine antagonists, including antipsychotics (methylphenidate raises extracellular dopamine).','Caution; specialist advice (SPC §4.5).'],
    'amf|apsy':['caution','Chlorpromazine and haloperidol block dopamine receptors and inhibit the central stimulant effects of amfetamines.','Expect reduced stimulant effect; specialist advice (Elvanse SPC §4.5).'],
    'atx|apsy':['caution','Neuroleptics: QT prolongation and lowered seizure threshold.','Caution (SPC §4.5).'],
    'gua|apsy':['caution','Additive sedation (antipsychotics are listed as CNS depressants).','Caution (Intuniv SPC §4.5).'],
    'amf|alk':['monitor','Alkalinising agents decrease urinary excretion and extend amfetamine half-life; acidifiers (e.g. ascorbic acid) do the opposite.','Be aware of variable effect (Elvanse and dexamfetamine SPCs §4.5).'],
    'mph|alk':['none','Not relevant to methylphenidate elimination.','No adjustment expected.'],
    'mph|anae':['major','Risk of a sudden rise in BP and heart rate during surgery.','Do not take methylphenidate on the day of planned surgery; tell the anaesthetist (SPC §4.5).'],
    'amf|anae':['major','Risk of a sudden rise in BP during surgery (dexamfetamine SPC).','Do not take dexamfetamine on the day of planned surgery; tell the anaesthetist. Check the Elvanse SPC for lisdexamfetamine.']
  };
  XP.registry.ix = function(m){ XP.form(m,{
    kicker:'Interactive checker · Module 7', title:'Interaction checker',
    intro:'Pick an ADHD medicine and another medicine or situation. The result comes only from the SPC sections reviewed for this course (§4.3 and §4.5). If a pair is not listed, the checker says so rather than guessing.',
    controls:[
      {type:'chips',id:'a',label:'ADHD medicine',value:'atx',options:Object.keys(ADHD).map(function(k){return {v:k,label:ADHD[k]};})},
      {type:'select',id:'b',label:'Other medicine / situation',value:'f2d6',options:Object.keys(OTH).map(function(k){return {v:k,label:OTH[k]};})}],
    evaluate:function(st){
      var r=IX[st.a+'|'+st.b]||['unk','Not listed in the SPC sections reviewed for this course.','Check the full SPC (§4.5) and the BNF interactions appendix before advising.'], sv=SEV[r[0]];
      var lvl={contra:1,major:0.8,caution:0.55,monitor:0.35,none:0.05,unk:0.2}[r[0]];
      return {tone:sv[0],badge:sv[1],title:ADHD[st.a]+' + '+OTH[st.b],
        text:'<p><strong>Mechanism / effect:</strong> '+r[1]+'</p><p><strong>Action:</strong> '+r[2]+'</p>',
        bars:[{label:'Severity',sub:sv[1],tone:r[0]==='none'?'pos':'neg',v:lvl,text:sv[1]}],
        patient:r[0]==='contra'||r[0]==='major'?'<p>Do not start the other medicine (or stop either) without speaking to the prescriber or pharmacist. Tell every prescriber, dentist and anaesthetist that you take an ADHD medicine.</p>':'<p>Usually manageable with advice or monitoring. Tell your pharmacist about any new medicines, including over-the-counter and herbal products.</p>',
        pharm:ul(['Check every new medicine against the ADHD medicine, including OTC (decongestants) and herbal products.','For contraindicated or major interactions, contact the prescriber before supply and document the outcome.','When unlisted here, check the full SPC and BNF; do not assume "no interaction".'])};
    },
    note:'Educational aid built from SPC §4.3/4.5 extracts (emc; Concerta XL, Elvanse, dexamfetamine, atomoxetine, Intuniv). Not exhaustive: always check the full current SPC and BNF.',
    sources:['Concerta XL SPC §4.5 (emc, rev. 06/11/2025).','Elvanse SPC §4.5; dexamfetamine (Medice) SPC §4.5.','Atomoxetine SPC §4.3, 4.5; Intuniv SPC §4.2, 4.4, 4.5 (emc).','NICE NG87 1.7.17.']
  }); };

  /* ================= M8: symptom-overlap explorer (conceptual) ================= */
  var FEAT=['Inattention','Restlessness','Impulsivity','Emotional dysregulation','Sleep problems','Social difficulty'];
  var DX={
    anx:{l:'Anxiety',o:[2,2,1,2,2,1],course:'situational',clue:'Worry-driven inattention; symptoms track feared situations; physical anxiety symptoms.',ask:'What goes through your mind when you cannot concentrate? Is it worse in particular situations?',ref:'Often co-exists: treat both. NICE offers the same ADHD medication choices with anxiety disorder (NG87 1.7.18), with slower titration (1.7.28).'},
    dep:{l:'Depression',o:[2,1,0,2,2,1],course:'episodic',clue:'Episodic; low mood and anhedonia; later onset; change from previous functioning.',ask:'Has there been a period when mood and interest were clearly lower than usual?',ref:'Screen (for example PHQ-9 in adults) and treat co-existing depression.'},
    bip:{l:'Bipolar disorder',o:[1,2,2,2,2,1],course:'episodic',clue:'Distinct episodes of elevated mood and reduced need for sleep (not just difficulty falling asleep).',ask:'Have there been days of feeling on top of the world, needing little sleep, unlike your usual self?',ref:'Stop ADHD medication in acute mania or psychosis (NG87 1.7.19).'},
    asd:{l:'Autism',o:[1,1,1,2,1,2],course:'trait',clue:'Social communication differences and restricted or repetitive interests, also from early childhood.',ask:'Is the difficulty mainly with social understanding and change, or with attention and activity?',ref:'Frequently co-occurs and both can be diagnosed; slower titration (NG87 1.7.18, 1.7.28).'},
    slp:{l:'Sleep disorder (OSA, insufficient sleep)',o:[2,1,1,1,2,0],course:'variable',clue:'Daytime sleepiness, snoring, witnessed apnoeas, late bedtimes.',ask:'How many hours of sleep? Snoring? Sleepy in the day?',ref:'Take a sleep history; sleep studies where indicated. Treating sleep problems may improve attention.'},
    hv:{l:'Hearing / vision problem',o:[2,0,0,0,0,1],course:'variable',clue:'Missed instructions; worse at the back of the class or in noise.',ask:'When were hearing and vision last checked?',ref:'Check hearing and vision in children before attributing inattention to ADHD.'},
    trm:{l:'Trauma / adverse environment',o:[2,2,2,2,2,1],course:'situational',clue:'Hypervigilance, dissociation, onset after adverse events; safeguarding concerns.',ask:'Did anything change or happen around the time the difficulties started?',ref:'Safeguarding first; trauma-informed assessment. Can co-exist.'},
    sub:{l:'Substance misuse',o:[2,2,2,2,2,1],course:'recent',clue:'Symptoms linked to intoxication or withdrawal; later onset; fluctuating.',ask:'Alcohol, cannabis, stimulants, energy drinks: how much and when?',ref:'Screen (for example AUDIT); assess diversion risk and avoid easily misused stimulant forms (NG87 1.7.23–1.7.24).'},
    epi:{l:'Absence epilepsy',o:[2,0,0,0,0,0],course:'episodic',clue:'Brief "switching off" episodes with no memory of them, sometimes many times a day.',ask:'Are there moments of blank staring that cannot be interrupted?',ref:'Refer for assessment; an EEG is a specialist decision. Review medication if seizures appear or worsen (NG87 1.8.16).'},
    med:{l:'Medicines / substances',o:[2,1,1,1,1,0],course:'recent',clue:'Onset after a new medicine: sedating antihistamines, some anticonvulsants (e.g. topiramate), benzodiazepines, high-dose β-agonists, corticosteroids, thyroxine excess, caffeine.',ask:'Any new or changed medicines, OTC products or supplements around the time it started?',ref:'Medication review: a pharmacist strength (Module 8 deep dive).'}
  };
  XP.registry.dd = function(m){ XP.form(m,{
    kicker:'Interactive model · Module 8', title:'Symptom-overlap explorer',
    intro:'Choose a differential, then describe the pattern (course and settings). The bars show how much each feature typically overlaps with ADHD, as a <strong>conceptual, qualitative</strong> guide, not data. The badge shows which way the pattern points.',
    controls:[
      {type:'chips',id:'d',label:'Differential',value:'anx',options:Object.keys(DX).map(function(k){return {v:k,label:DX[k].l};})},
      {type:'chips',id:'c',label:'Course',value:'trait',options:[{v:'trait',label:'Trait-like since childhood'},{v:'episodic',label:'Episodic'},{v:'recent',label:'Recent onset'}]},
      {type:'chips',id:'s',label:'Settings',value:'all',options:[{v:'all',label:'Pervasive (2+ settings)'},{v:'one',label:'One setting / situational'}]}],
    evaluate:function(st){
      var d=DX[st.d], adhdLike=st.c==='trait'&&st.s==='all';
      var tone,badge,title;
      if(adhdLike && (d.course==='trait'||st.d==='asd')){ tone='warn';badge='Both likely';title='Pattern fits ADHD; '+d.l.toLowerCase()+' may co-exist'; }
      else if(adhdLike){ tone='ok';badge='Favours ADHD';title='Trait-like and pervasive: favours ADHD (screen for '+d.l.toLowerCase()+' too)'; }
      else if(st.c===d.course || (st.c==='recent'&&d.course!=='trait') || (st.s==='one'&&d.course==='situational')){ tone='high';badge='Favours '+d.l.split(' ')[0];title='Pattern points towards '+d.l.toLowerCase(); }
      else { tone='mid';badge='Unclear';title='Mixed pattern: more history needed'; }
      var lv=[0.15,0.5,0.85], names=['low','some','high'];
      return {tone:tone,badge:badge,title:title,
        text:'<p><strong>Distinguishing features:</strong> '+d.clue+'</p><p><strong>Ask:</strong> '+d.ask+'</p><p>ADHD is trait-like, starts in childhood (several symptoms before 12) and is present across settings; collateral history confirms it. '+(st.c!=='trait'?'An <strong>'+(st.c==='episodic'?'episodic':'recent-onset')+'</strong> course is not typical of ADHD.':'')+(st.s==='one'?' Difficulty in only one setting is not typical of ADHD.':'')+'</p>',
        bars:FEAT.map(function(f,i){return {label:f,sub:'overlap: '+names[d.o[i]],tone:d.o[i]===2?'neg':d.o[i]===1?'neg2':'pos2',v:lv[d.o[i]],text:names[d.o[i]]};}),
        patient:'<p>Several conditions can look like ADHD, and many happen alongside it. Getting the full picture means the right help for each one.</p>',
        pharm:ul([d.ref,'Comorbidity usually changes titration speed and monitoring, not medication choice (NG87 1.7.18, 1.7.28).','Do a medication review for drug-induced inattention or agitation.'])};
    },
    note:'Conceptual, qualitative model for teaching; overlap levels are judgement-based summaries of the Module 8 table, not measured data.',
    sources:['NICE NG87 (live text checked Oct 2026): 1.7.18, 1.7.19, 1.7.23–1.7.24, 1.7.28, 1.8.16.','DSM-5-TR (2022): criterion B (several symptoms before 12), C (2+ settings), E (not better explained).']
  }); };

  /* ================= M9: CD prescription validity checker ================= */
  var EL=[['pt','Patient name and address'],['drug','Drug name'],['form','Formulation (e.g. tablets)'],['str','Strength'],['dose','Dose clearly defined'],['sig','Prescriber signature'],['addr','Prescriber address (UK)'],['date','Date signed']];
  XP.registry.cd = function(m){ XP.form(m,{
    kicker:'Interactive checker · Module 9', title:'Schedule 2 CD prescription checker',
    intro:'Build a methylphenidate or lisdexamfetamine prescription: tick the elements present, set the quantity wording, form type, age of the prescription and days\' supply. The checker says whether it can be supplied and why. Educational: follow your SOP and the regulations.',
    presetLabel:'Scenarios',
    presets:[
      {label:'Complete NHS prescription',set:{el:EL.map(function(e){return e[0];}),q:'both',typ:'nhs',days:3,sup:30}},
      {label:'Quantity in figures only',set:{el:EL.map(function(e){return e[0];}),q:'one',typ:'nhs',days:3,sup:30}},
      {label:'"As directed"',set:{el:['pt','drug','form','str','sig','addr','date'],q:'both',typ:'nhs',days:3,sup:30}},
      {label:'Private, ordinary form',set:{el:EL.map(function(e){return e[0];}),q:'both',typ:'priv',days:3,sup:30}},
      {label:'Day 30',set:{el:EL.map(function(e){return e[0];}),q:'both',typ:'nhs',days:30,sup:30}},
      {label:'60 days\' supply',set:{el:EL.map(function(e){return e[0];}),q:'both',typ:'nhs',days:2,sup:60}}],
    controls:[
      {type:'chips',id:'typ',label:'Form',value:'nhs',options:[{v:'nhs',label:'NHS (WP10 / EPS)'},{v:'pcd',label:'Private on WP10PCD with prescriber ID'},{v:'priv',label:'Private on an ordinary form'}]},
      {type:'multi',id:'el',label:'Elements present',value:EL.map(function(e){return e[0];}),options:EL.map(function(e){return {v:e[0],label:e[1]};})},
      {type:'chips',id:'q',label:'Total quantity',value:'both',options:[{v:'both',label:'In words and figures'},{v:'one',label:'Words or figures only'},{v:'none',label:'Missing'}]},
      {type:'range',id:'days',label:'Days since the appropriate date',min:0,max:35,step:1,value:3,fmt:function(v){return 'day '+v+(v>28?' (expired)':'');}},
      {type:'range',id:'sup',label:'Days\' supply prescribed',min:7,max:90,step:1,value:30,fmt:function(v){return v+' days';}}],
    evaluate:function(st){
      var miss=EL.filter(function(e){return !has(st.el,e[0]);}).map(function(e){return e[1];});
      var problems=[], fix=[], tone,badge,title;
      if(st.typ==='priv') problems.push('A private Schedule 2 prescription for community dispensing in Wales must be on form <strong>WP10PCD or WP10PCDSS</strong> with the private prescriber identification number (England: FP10PCD).');
      if(miss.length) problems.push('Missing: '+miss.join(', ')+(has(miss,'Dose clearly defined')?' ("as directed" alone is not a dose; "one as directed" is)':'')+'.');
      if(st.q==='none') problems.push('No total quantity: it must be stated in words and figures.');
      if(st.q==='one') fix.push('Total quantity in words <em>or</em> figures only: the pharmacist may amend the prescription to add the missing form, indelibly and attributably (name, date, signature, GPhC number), if the intention is clear.');
      if(st.days>28) problems.push('Older than <strong>28 days</strong> from the appropriate date: it is no longer valid and cannot be supplied (and owings cannot be supplied after 28 days).');
      var long=st.sup>30;
      if(problems.length){ tone='danger';badge='Do not supply';title='Not legally valid as written'; }
      else if(fix.length){ tone='warn';badge='Amend, then supply';title='Pharmacist may amend this error'; }
      else if(long){ tone='mid';badge='Valid: query';title='Legally valid; more than 30 days\' supply'; }
      else { tone='ok';badge='Valid';title='Meets Schedule 2 requirements'; }
      var text=problems.concat(fix);
      if(long) text.push('More than 30 days\' supply is <strong>not illegal</strong>, but DH and Welsh guidance strongly recommend that Schedule 2–4 CD prescriptions do not exceed 30 days unless there is a justified clinical need, recorded in the notes. Check with the prescriber if unclear.');
      if(!text.length) text.push('All required elements present, total quantity in words and figures, within 28 days, and within the 30-day supply recommendation.');
      var left=Math.max(0,28-st.days);
      return {tone:tone,badge:badge,title:title,text:p(text),
        bars:[{label:'Required elements',sub:(EL.length-miss.length)+' of '+EL.length,tone:miss.length?'neg':'pos',v:(EL.length-miss.length)/EL.length,text:(EL.length-miss.length)+' of '+EL.length},{label:'Validity left',sub:left+' of 28 days',tone:left<=3?'neg':'pos2',v:left/28,text:left+' days'},{label:'Supply length',sub:'guide: ≤30 days',tone:long?'neg2':'pos',v:clamp(st.sup/90,0,1),text:st.sup+' days'}],
        tiles:[{label:'Validity',value:st.days>28?'Expired':'Day '+st.days+' of 28',tone:st.days>28?'danger':'info'},{label:'Emergency supply',value:'Not permitted',tone:'high'},{label:'Safe custody',value:'Required',tone:'info'}],
        patient:tone==='danger'?'<p>The pharmacy cannot legally supply this prescription as written. They will contact the prescriber for a corrected or new prescription; please allow time before your supply runs out.</p>':'<p>Collect within 28 days of the date on the prescription. You may be asked for ID when collecting a controlled drug.</p>',
        pharm:ul(['Check every legal element before supply; mark the date of supply on the prescription and make the CD register entry.','Only two kinds of error can be amended by the pharmacist: total quantity in words or figures only, and minor typographical errors.','No emergency supply of Schedule 2 CDs; check the collector\'s identity; brand switches need a new prescription (Module 9).'])};
    },
    note:'Educational summary of the Misuse of Drugs Regulations 2001 for Schedule 2 prescriptions. Follow current law, your SOP and local NHS Wales guidance.',
    sources:['Misuse of Drugs Regulations 2001 (as amended): Schedule 2/3 prescription requirements, 28-day validity.','Community Pharmacy England: Dispensing controlled drugs (WP10PCD/WP10PCDSS for private CDs in Wales; prescriber identification number).','Powys Teaching Health Board: CD prescriber guidance (30-day supply recommendation; pharmacist amendments).','NHSBSA: What prescription forms are valid?']
  }); };
})();
