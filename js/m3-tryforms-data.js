/* Standalone form library: example answer sets for "Try the form".
   Items, options and scoring come from the ADHD Assessment workspace (licence-checked tool data and the tested
   scoring engine); only these example answers are written here. Each example teaches one point.
   Keys: form id in the library -> { tool: workspace tool id, ex: [ {name, story, a: {itemNumber: value}, teach} ] } */
(function(){
  'use strict';
  function seq(vals){ var a = {}; vals.forEach(function(v,i){ if(v !== null) a[i+1] = v; }); return a; }
  window.M3TRY = {
   asrs18: {tool:'asrs18', ex:[
    {name:'Priya, 31', story:'Lifelong disorganisation since primary school; her partner confirms it.', a:seq([3,3,4,3,2,4, 3,4,3,3,3,2,3,2,3,3,2,3]),
     teach:'A typical positive screen. It earns a full assessment, not a diagnosis: the interview, childhood evidence and impairment still decide.'},
    {name:'Tom, 22', story:'Fine until this term; now exam stress and poor sleep.', a:seq([2,1,2,3,3,1, 2,1,1,2,1,3,2,1,1,1,0,1]),
     teach:'Stress and poor sleep can push Part A over the line. Nothing here is lifelong, so look for the better explanation before referring for ADHD.'}]},
   wurs25: {tool:'wurs25', ex:[
    {name:'Priya, 31', story:'Remembers being "the daydreamer" who never finished work.', a:seq([4,2,3,4,3,2,4,3,1,2,3,2,2,2,3,2,2,2,1,2,2,2,1,1,3]),
     teach:'High recalled childhood difficulties. Check it against school reports and a parent: recall is not proof.'},
    {name:'Sam, 40', story:'Strict, structured upbringing; remembers little of primary school.', a:seq([1,1,1,1,0,0,1,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,1,1]),
     teach:'A low score does not exclude ADHD: recall may be poor and structure may have hidden symptoms. Ask for school reports.'}]},
   wfirs: {tool:'wfirs', ex:[
    {name:'Priya, 31', story:'Struggling at home and at work; not studying.', a:{dom:{
      'Family':[2,1,2,1,2,1,1,0],'Work':[2,2,1,2,3,1,1,2,1,0,1],'School':['na','na','na','na','na','na','na','na','na','na'],
      'Life skills':[2,2,1,3,2,1,2,1,0,1,2,1],'Self-concept':[2,2,1,2,1],'Social':[1,0,1,1,0,1,0,1,0],'Risk':[1,0,0,1,0,0,1,0,0,0,1,0,0,0]}},
     teach:'Several impaired domains: evidence of at least moderate impairment across settings (NICE NG87 1.3.3). School is marked not applicable, never 0.'},
    {name:'Alex, 28', story:'Problems only at a demanding new job.', a:{dom:{
      'Family':[0,1,0,0,1,0,0,0],'Work':[2,2,1,1,2,1,1,1,0,0,1],'School':['na','na','na','na','na','na','na','na','na','na'],
      'Life skills':[1,0,1,0,1,0,0,1,0,0,1,0],'Self-concept':[1,1,0,1,0],'Social':[0,0,1,0,0,0,0,0,0],'Risk':[0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},
     teach:'Impairment in one setting only. That does not meet the NICE requirement for pervasive problems: explore the job, sleep and mood.'}]},
   phq9: {tool:'phq9', ex:[
    {name:'Leah, 26', story:'Low for three months after a break-up.', a:seq([2,2,1,2,1,2,2,1,0,2]),
     teach:'Moderate depression. Treat or address it, and ask whether the attention problems began with the low mood (a state) or were always there (a trait).'},
    {name:'Ben, 33', story:'Lifelong ADHD-type problems; mood mostly OK.', a:seq([0,1,0,1,0,1,2,1,1,1]),
     teach:'The total is low and driven by items that overlap with ADHD, but item 9 is positive. A low total never clears item 9: a clinician asks about it before the appointment.'}]},
   gad7: {tool:'gad7', ex:[
    {name:'Nadia, 29', story:'Constant worry about everything for over a year.', a:seq([2,3,3,2,1,1,2]),
     teach:'Probable anxiety disorder, driven by the worry items. Anxiety can mimic ADHD or coexist with it.'},
    {name:'Ben, 33', story:'Restless and irritable, but not a worrier.', a:seq([1,0,1,2,2,2,0]),
     teach:'A mild score carried by items 4–6 (trouble relaxing, restlessness, irritability), which overlap with ADHD. The worry items are low.'}]},
   mdq: {tool:'mdq', ex:[
    {name:'Jade, 24', story:'Always talkative, distractible and on the go; no distinct episodes.', a:seq([0,1,0,0,1,1,1,1,1,0,0,1,1, 0, 1, null, null]),
     teach:'Eight "yes" answers, but they did not happen together in a period and caused only a minor problem, so the screen is negative. Chronic ADHD traits often tick these boxes.'},
    {name:'Rob, 35', story:'A clear week of little sleep, racing ideas and overspending last year.', a:seq([1,0,1,1,1,1,0,1,1,0,1,1,1, 1, 3, null, null]),
     teach:'All three parts are positive: a distinct episode that was a change from the usual self. Bipolar disorder must be assessed before ADHD treatment.'}]},
   audit: {tool:'audit', ex:[
    {name:'Leah, 26', story:'Drinks at weekends with friends.', a:seq([2,1,1,0,0,0,0,0,0,0]),
     teach:'Low-risk drinking. AUDIT-C (items 1–3) is below 5, so the full AUDIT is not strictly needed.'},
    {name:'Dan, 38', story:'Drinks most nights to "switch off".', a:seq([3,2,2,1,1,0,1,1,0,2]),
     teach:'Increasing-risk (hazardous) drinking. Ask about the order of onset and whether attention problems are present when sober; relevant to stimulant prescribing too.'}]},
   dast10: {tool:'dast10', ex:[
    {name:'Leah, 26', story:'No drug use.', a:seq([0,0,1,0,0,0,0,0,0,0]),
     teach:'No problems reported. Note question 3 is reverse-scored: "yes, I can always stop" scores 0.'},
    {name:'Kai, 21', story:'Daily cannabis to sleep; family worried.', a:seq([1,0,0,0,1,1,0,0,0,0]),
     teach:'Moderate problems: investigate further. Cannabis can mimic or mask ADHD, and drug use affects decisions about stimulants and diversion risk.'}]},
   aq10: {tool:'aq10', ex:[
    {name:'Sam, 40', story:'Finds social cues hard; collects facts about trains.', a:seq([1,4,2,2,4,3,1,2,3,3]),
     teach:'Screen positive across social and detail items: consider a specialist autism assessment. Autism and ADHD can both be present.'},
    {name:'Ben, 33', story:'Sociable, but hates being interrupted and multitasking.', a:seq([3,4,4,4,3,2,3,1,4,4]),
     teach:'Exactly 6, but items 3 and 4 (multitasking and switching back after an interruption) supply 2 points. ADHD attention-switching may be carrying the score over the line.'}]},
   pcl5: {tool:'pcl5', ex:[
    {name:'Mia, 30', story:'Assault two years ago; nightmares and avoidance since.', a:seq([3,2,2,3,2, 3,3, 1,2,2,2,1,2,1, 2,1,2,2,2,2]),
     teach:'Probable PTSD with intrusion and avoidance symptoms. Trauma can mimic ADHD and must be assessed.'},
    {name:'Ben, 33', story:'Car accident years ago; few memories or reminders bother him.', a:seq([1,0,0,1,1, 1,1, 0,2,1,2,2,2,2, 3,3,2,2,3,3]),
     teach:'Borderline total carried mostly by arousal items (irritability, risk, concentration, sleep) that ADHD can drive. Intrusion and avoidance are low.'}]},
   msibpd: {tool:'msibpd', ex:[
    {name:'Erin, 27', story:'Self-harm, chronic emptiness and fear of being left.', a:seq([1,1,0,1,1,0,1,1,1,1]),
     teach:'Positive, including the more specific items (self-harm, emptiness, identity, abandonment): probable borderline personality disorder, which may coexist with ADHD.'},
    {name:'Ben, 33', story:'Impulsive, quick-tempered, moody; no self-harm.', a:seq([1,0,1,1,1,1,1,1,0,0]),
     teach:'Positive, but carried mostly by items shared with ADHD (relationships, impulsivity, mood swings, anger). ADHD emotional dysregulation may explain much of it.'}]},
   cssrs: {tool:'cssrs', ex:[
    {name:'Leah, 26', story:'Sometimes wishes she could "not wake up"; no thoughts of acting.', a:{1:1,2:0,3:'na',4:'na',5:'na',6:0,7:'na'},
     teach:'A wish to be dead without suicidal thoughts. Respond with care and a safety conversation; never turn the answers into a low, medium or high risk label (NICE NG225).'},
    {name:'Dan, 38', story:'Has thought about how he might kill himself.', a:{1:1,2:1,3:1,4:0,5:0,6:0,7:'na'},
     teach:'Suicidal thoughts with some thought about method. More urgent enquiry, a safety plan and a mental health referral now, before continuing the ADHD assessment.'}]}
  };
  /* SNAP-IV-26 is not in the workspace's interactive tools (its reproduction licence is unconfirmed), so the items are
     paraphrased themes of the DSM symptoms it lists, in the official order, with its 0-3 ratings. Scoring: Swanson's
     subscale averages, compared with the tentative parent cut-offs quoted in the workspace reference card (US child norms). */
  var SNAPCUT = {IA:1.78, HI:1.44, C:1.67, ODD:1.88};
  function snapItems(){
    var IA = ['Misses details or makes careless mistakes in schoolwork','Struggles to keep attention on tasks or play','Seems not to listen when spoken to directly','Does not follow instructions through; leaves schoolwork or chores unfinished','Finds it hard to organise tasks and activities','Avoids or dislikes tasks that need sustained mental effort, such as homework','Loses things needed for tasks, such as books, pencils or toys','Easily distracted by things going on around them','Forgetful in daily activities'];
    var HI = ['Fidgets with hands or feet, or squirms in their seat','Leaves their seat when they are expected to stay seated','Runs about or climbs when it is not appropriate','Finds it hard to play or do leisure activities quietly','Always “on the go”, as if driven by a motor','Talks too much','Blurts out answers before questions are finished','Finds it hard to wait their turn','Interrupts or butts in on others'];
    var OD = ['Loses their temper','Argues with adults','Actively defies or refuses adults’ requests or rules','Deliberately does things that annoy other people','Blames others for their own mistakes or behaviour','Touchy or easily annoyed by others','Angry and resentful','Spiteful or vindictive'];
    var out = [];
    IA.forEach(function(t,i){ out.push({n:i+1, t:t, threshold:2, section:i===0?'Inattention (items 1–9)':null, sectionNote:i===0?'Think about the patient at primary-school age, before 12. Grey answers (2 or 3) are usually treated as a symptom present.':null}); });
    HI.forEach(function(t,i){ out.push({n:i+10, t:t, threshold:2, section:i===0?'Hyperactivity-impulsivity (items 10–18)':null}); });
    OD.forEach(function(t,i){ out.push({n:i+19, t:t, threshold:2, section:i===0?'Oppositional (items 19–26)':null, sectionNote:i===0?'Oppositional defiant behaviour, common alongside ADHD. These are not conduct disorder items.':null}); });
    return out;
  }
  function snapScore(ans){
    function grp(a,b){ var sum=0,n=0,hi=0; for(var i=a;i<=b;i++){ var v=ans[i]; if(typeof v==='number'){ sum+=v; n++; if(v>=2) hi++; } } return {sum:sum,n:n,hi:hi,mean:n?sum/n:null,all:b-a+1}; }
    var ia=grp(1,9), hy=grp(10,18), od=grp(19,26), c={sum:ia.sum+hy.sum,n:ia.n+hy.n}; c.mean=c.n?c.sum/c.n:null;
    var answered=ia.n+hy.n+od.n, sub=function(label,g,cut){ return {label:label, mean:g.mean, answered:g.n, impaired:g.mean!=null&&g.n===g.all&&g.mean>=cut?true:undefined, band:g.n?(g.hi+' of '+g.all+' rated 2–3'):''}; };
    var lines=[];
    lines.push('Inattention: '+ia.hi+' of 9 items rated 2 or 3; hyperactivity-impulsivity: '+hy.hi+' of 9.');
    if(ia.n===9&&hy.n===9){
      var above=[]; if(ia.mean>=SNAPCUT.IA) above.push('inattention'); if(hy.mean>=SNAPCUT.HI) above.push('hyperactivity-impulsivity');
      lines.push(above.length?'Average at or above the tentative parent cut-off for '+above.join(' and ')+' (inattention 1.78, hyperactivity-impulsivity 1.44).':'Averages below the tentative parent cut-offs (inattention 1.78, hyperactivity-impulsivity 1.44).');
      lines.push('These cut-offs come from US children rated at the time. For an adult’s childhood rated from memory they are a rough guide only: the examples behind each 2 or 3 matter more.');
    }
    if(answered<26) lines.push((26-answered)+' item(s) unanswered; the result is provisional.');
    var flags=[]; if(ia.n===9&&hy.n===9&&ia.hi<3&&hy.hi<3) flags.push({level:'info', text:'Few childhood symptoms reported. This does not exclude ADHD: parents of adults often recall little, and quiet, inattentive children were often missed. Look for school reports and a second informant.'});
    return {band: ia.n===9&&hy.n===9 ? ((ia.hi>=3||hy.hi>=3)?'Several childhood symptoms reported':'Few childhood symptoms reported') : null,
      lines:lines, flags:flags,
      subscales:[sub('Inattention average (items 1–9)',ia,SNAPCUT.IA), sub('Hyperactivity-impulsivity average (items 10–18)',hy,SNAPCUT.HI), {label:'Combined ADHD average (items 1–18)', mean:c.mean, answered:c.n, impaired:c.mean!=null&&c.n===18&&c.mean>=SNAPCUT.C?true:undefined}, sub('Oppositional average (items 19–26)',od,SNAPCUT.ODD)]};
  }
  window.M3TRY.snap4 = {local:{id:'snap4', url:'https://www.caddra.ca/wp-content/uploads/SNAP-IV-26_July-11-2022.pdf', items:snapItems(), options:[{v:0,l:'Not at all'},{v:1,l:'Just a little'},{v:2,l:'Quite a bit'},{v:3,l:'Very much'}], scoring:{method:'snap'}}, score:snapScore,
    note:'Item wording paraphrased from the symptoms the SNAP-IV lists; use the official form in practice. Scored with Swanson’s subscale averages.',
    ex:[
    {name:'Priya’s mother', story:'Rates Priya, now 31, as she was at primary school: dreamy, disorganised, always losing things, but not disruptive.',
     a:{1:2,2:3,3:2,4:2,5:3,6:2,7:3,8:3,9:2, 10:1,11:2,12:1,13:1,14:2,15:2,16:1,17:2,18:1, 19:1,20:0,21:1,22:0,23:1,24:1,25:0,26:0},
     teach:'All 9 inattention items rated 2–3; hyperactivity is milder (4 of 9), its average just reaching the cut-off: a mainly inattentive childhood picture that supports onset before 12 (criterion B). Now ask her mother for a real example behind each 2 or 3, and check it against school reports.'},
    {name:'Ben’s father', story:'Rates Ben, now 33: “a normal boy, a bit of a daydreamer”. He worked long hours and remembers little of primary school.',
     a:{1:1,2:1,3:0,4:1,5:1,6:1,7:1,8:1,9:0, 10:1,11:0,12:0,13:0,14:1,15:1,16:0,17:0,18:1, 19:0,20:0,21:0,22:0,23:0,24:0,25:0,26:0},
     teach:'Low ratings, but from someone who saw little of Ben’s school day. A low SNAP-IV from a distant informant does not exclude ADHD. Ben’s school reports (“bright but daydreams, rarely finishes work”) and his mother’s account carry more weight.'}]};
})();
