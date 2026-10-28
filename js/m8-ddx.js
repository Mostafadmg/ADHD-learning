/* Module 8: "ADHD or something else?" explorer and the course-shapes figure.
   Mounts:
     <div class="m8x" data-m8x="mood"></div>        one or more group ids, comma separated ("sub,sleep")
     <div class="m8-shapes" data-m8shapes></div>   the four course shapes used in lesson 2
   Each condition card compares ADHD with one condition: a course chart (typical shape over life, not to scale),
   three "points to ADHD / points to X" rows, the best clue and questions, what to check (form chips open the
   standalone Form library), when X alone explains it, when to diagnose both, and what comes first if both.
   Content is a teaching summary of the workspace differential reference (adhd-assessment/js/data/ddx-*.js, research
   briefs of 21 Oct 2026) plus NICE NG87 (live text, Oct 2026) and emc SmPCs (Concerta XL rev. 06/11/2025,
   Elvanse rev. 02/10/2026, atomoxetine rev. 06/12/2024), checked 28 Oct 2026. Unsourced points are clinical practice.
   Window.M8DX is exposed so search or other modules can reuse the data. */
(function(){
  'use strict';

  var G = {
    mood:  {t:'Mood, psychosis and eating', c:'#7b4fb3', l:'#f3edfa'},
    anx:   {t:'Anxiety, trauma and personality', c:'#2f6fb3', l:'#e8f0fa'},
    sub:   {t:'Substances and medicines', c:'#9a6200', l:'#fff4dc'},
    sleep: {t:'Sleep', c:'#3d4f9a', l:'#eceffa'},
    body:  {t:'Body and brain', c:'#a8432e', l:'#fbe9e4'},
    nd:    {t:'Neurodevelopmental and childhood', c:'#0b6664', l:'#e3f4f3'}
  };
  var KIND = {
    both:   ['Often comes with ADHD', 'k-both'],
    either: ['Mimic or co-traveller', 'k-either'],
    mimic:  ['Mainly a mimic', 'k-mimic']
  };
  /* Typical symptom level at 13 points: birth, 2.5, 5, 8, 12, 15, 18, 24, 30, 38, 45, 52, 60 (not to scale). */
  var ADHD = [0.18,0.52,0.7,0.74,0.74,0.72,0.7,0.68,0.66,0.64,0.62,0.6,0.58];
  var AGES = {0:'Birth',2:'5',4:'12',6:'18',8:'30',10:'45',12:'60'};

  /* Forms that open in the standalone form library (window.__m3form). */
  var FORM = {phq9:'PHQ-9', gad7:'GAD-7', mdq:'MDQ', audit:'AUDIT', dast10:'DAST-10', aq10:'AQ-10', pcl5:'PCL-5', msibpd:'MSI-BPD', stopbang:'STOP-Bang / Epworth', cssrs:'C-SSRS screen'};

  var C = [
  /* ---------------- Mood, psychosis and eating ---------------- */
  {id:'dep', g:'mood', t:'Depression', s:'depression', k:'either', ws:[['dep','Depression']],
   stat:'18.6% of adults with ADHD in a US national survey also had major depression (Kessler 2006).',
   v:[0.1,0.1,0.1,0.12,0.12,0.15,0.2,0.78,0.22,0.15,0.72,0.2,0.15], ev:[6.5,'Episode'],
   cap:'Episodes: a clear change from the usual self that lifts when mood recovers.',
   rows:[['When it starts','Before 12, before any low mood','A clear “since when”: a change from the usual self'],
         ['Over time','Steady; still there on good days and holidays','Episodes of 2 weeks or more; lifts when mood recovers'],
         ['Drive and interest','Fails for dull tasks; returns fast for new, rewarding things','Lost for almost everything, with sleep, appetite and energy change']],
   clue:'The good-mood test: on holiday or in a good year, were focus and organisation still poor?',
   ask:['Were the concentration problems there at primary school, before you ever felt low?','Has there been a spell of 2 weeks or more when you felt low or flat most of the day, nearly every day?'],
   check:[['f','phq9'],['f','cssrs'],['t','Thyroid tests: consider in adults with depression (NICE NG145)']],
   mimic:'the problems began with an episode, stay inside episodes and go when mood recovers, with no childhood history.',
   both:'childhood ADHD symptoms persist in periods of normal mood and a depressive episode also meets its own criteria. ADHD usually starts first.',
   first:'Suicide risk and severe depression come first (NICE NG225, NG222). Severe depression and suicidal tendencies are methylphenidate contraindications (SmPC 4.3): stabilise, then rate ADHD symptoms again.'},

  {id:'bip', g:'mood', t:'Bipolar disorder', s:'bipolar disorder', k:'either', ws:[['bip','Bipolar disorder']],
   stat:'17% of adults with bipolar disorder have ADHD, and 8% of adults with ADHD have bipolar disorder (meta-analysis, Schiweck 2021).',
   v:[0.1,0.1,0.1,0.12,0.15,0.2,0.86,0.2,0.15,0.82,0.18,0.15,0.15], ev:[5.6,'First episode'],
   cap:'Distinct episodes with normal periods between them.',
   rows:[['When it starts','Before 12','First episode usually from the late teens; a change from normal'],
         ['Over time','Constant, lifelong restlessness and distraction','Episodes: hypomania lasts at least 4 days, mania at least a week'],
         ['Sleep','Tired but cannot switch off','Needs much less sleep and does not feel tired']],
   clue:'Less need for sleep with elation or grandiosity, as a spell that was different from the person’s normal self.',
   ask:['Have there been days when you felt on top of the world, slept 3 or 4 hours and did not feel tired?','Does anyone in your family have bipolar disorder, depression, or has anyone died by suicide?'],
   check:[['f','mdq'],['t','Life chart or mood diary, with an account from family']],
   mimic:'ADHD-like features happen only within mood episodes and attention is normal between them, with no childhood history.',
   both:'childhood ADHD symptoms are present between episodes. Count a symptom for ADHD only if it is there outside an episode.',
   first:'Stabilise mood first. In acute mania or psychosis stop ADHD medicine; consider restarting after it resolves (NG87 1.7.19). Poorly controlled bipolar I is a methylphenidate contraindication (SmPC 4.3).'},

  {id:'psy', g:'mood', t:'Psychosis', s:'psychosis', k:'either', ws:[['psychosis','Psychosis']],
   v:[0.12,0.12,0.12,0.14,0.18,0.3,0.82,0.7,0.62,0.58,0.56,0.55,0.55], ev:[5.4,'Decline'],
   cap:'A change: a period of decline, then the first episode, usually in the late teens or early adulthood.',
   rows:[['When it starts','Before 12','Late teens or early adulthood, often after a period of decline'],
         ['What changes','Nothing: a lifelong trait','Withdrawal, falling grades or work, odd beliefs or experiences'],
         ['Racing thoughts','Ordinary thoughts jumping between topics','May feel alien, controlled or full of special meaning']],
   clue:'A change, not a trait. A student who was organised until 19 and is now failing, withdrawn and up all night needs a psychosis assessment first.',
   ask:['Have you had experiences other people did not seem to share, such as hearing voices or feeling watched?','How much cannabis do you use, and how strong is it?'],
   check:[['t','Mental state examination, collateral history, urine drug screen if substances are possible']],
   mimic:'symptoms occur only during a psychotic disorder. DSM-5-TR criterion E then rules ADHD out.',
   both:'childhood ADHD is documented well before the psychosis and persists when psychotic symptoms are in remission.',
   first:'First episode: refer to early intervention in psychosis (NICE CG178). Stop ADHD medicine in an acute psychotic episode (NG87 1.7.19). Agree any later ADHD treatment with the psychosis team.'},

  {id:'eat', ch:'Eating disorders', g:'mood', t:'Eating disorders', s:'an eating disorder', k:'either', ws:[['eating','Eating disorders']],
   v:[0.05,0.05,0.05,0.08,0.2,0.62,0.72,0.6,0.5,0.42,0.36,0.32,0.3], ev:[4.6,'Onset'],
   cap:'Usually begins in adolescence or early adulthood.',
   rows:[['When it starts','Before 12','Usually adolescence or early adulthood'],
         ['Concentration','Poor whatever the eating or weight','Narrowed to food and weight; improves with nutritional recovery'],
         ['Overactivity','Restless and fidgety all day','Driven exercise to control weight (anorexia nervosa)']],
   clue:'Do not rate ADHD symptoms in someone who is acutely underweight: starvation itself impairs concentration.',
   ask:['Do you worry a lot about your weight or shape, or try hard to control what you eat?','Do you sometimes eat a large amount and feel you cannot stop?'],
   check:[['t','Weight, BMI and an eating history (NICE NG69)']],
   mimic:'concentration, restlessness and irritability began with restriction, bingeing or purging and improve with nutritional recovery.',
   both:'childhood ADHD is corroborated and persists when eating and weight are stable. ADHD with binge eating or bulimia is a common pair.',
   first:'Stabilise the eating disorder first. Anorexia nervosa is a methylphenidate and dexamfetamine contraindication (SmPC 4.3). Watch for stimulant misuse to suppress appetite (NG87 1.7.23).'},

  /* ---------------- Anxiety, trauma and personality ---------------- */
  {id:'anx', ch:'Anxiety', g:'anx', t:'Anxiety disorders', s:'anxiety', k:'both', ws:[['gad','Generalised anxiety'],['social','Social anxiety'],['panic','Panic disorder']],
   stat:'47% of adults with ADHD in a US national survey also had an anxiety disorder (Kessler 2006).',
   v:[0.1,0.14,0.2,0.42,0.24,0.56,0.3,0.6,0.34,0.52,0.3,0.46,0.3],
   cap:'Comes and goes with stress and feared situations.',
   rows:[['When it starts','Before 12, in every setting','Often later, or tied to stress'],
         ['Where the mind goes','Scattered across many unrelated thoughts','Pulled back, again and again, to one worry'],
         ['When it is worse','Dull, unstructured tasks, even on calm days','Feared situations; better on calm, safe days']],
   clue:'The calm-day test: if focus, timekeeping and organisation are still poor on a relaxed day, it is not only anxiety.',
   ask:['When you lose focus, what is on your mind?','On a calm day or on holiday, are you still disorganised and distracted?'],
   check:[['f','gad7'],['t','Caffeine, alcohol and cannabis; thyroid tests if suggested (NICE NG145)']],
   mimic:'the inattention began with the anxiety, happens mainly when anxious and is driven by worry, with no childhood history.',
   both:'ADHD symptoms were there before 12 and persist on low-anxiety days. Realistic worry about repeated ADHD slip-ups is not, on its own, an anxiety disorder.',
   first:'Usually treat together. Same ADHD medicine choices (NG87 1.7.18), slower titration and closer monitoring (1.7.28). Methylphenidate can worsen anxiety (SmPC 4.4); atomoxetine did not worsen it in controlled trials (SmPC 4.4).'},

  {id:'ocd', ch:'OCD', g:'anx', t:'Obsessive-compulsive disorder (OCD)', s:'OCD', k:'either', ws:[['ocd','OCD']],
   v:[0.05,0.08,0.15,0.3,0.45,0.4,0.55,0.45,0.5,0.42,0.46,0.4,0.4],
   cap:'Can start in childhood; waxes and wanes.',
   rows:[['Checking','A fix for forgetting: “I’d probably have left it on”','Driven by fear: “something terrible would happen, and it would be my fault”'],
         ['Thoughts','Wander to anything new or interesting','Return again and again to the same feared theme'],
         ['Lateness','Loses track of time','Held up by rituals']],
   clue:'Ask what would happen if they did not check.',
   ask:['What would happen if you did not check?','Do the same unwanted thoughts keep coming back, however hard you push them away?'],
   check:[['t','Clinical interview; ask about tics, which are more likely when OCD and ADHD occur together']],
   mimic:'attention is taken up by obsessions and time by rituals, with no childhood ADHD across settings.',
   both:'distractibility, restlessness and impulsivity show outside the obsessional themes, and have done since childhood.',
   first:'Treat both; NICE CG31 covers OCD. NG87 1.7.28 names OCD among the anxiety disorders that need slower titration and closer monitoring.'},

  {id:'ptsd', ch:'Trauma and PTSD', g:'anx', t:'Trauma and PTSD', s:'trauma', k:'both', ws:[['ptsd','PTSD'],['cptsd','Complex PTSD']],
   v:[0.1,0.1,0.1,0.1,0.12,0.12,0.76,0.6,0.7,0.5,0.6,0.46,0.45], ev:[5.5,'Trauma'],
   cap:'Starts or clearly worsens after a traumatic event.',
   rows:[['When it starts','Before 12, before the trauma','After a traumatic event'],
         ['Where attention goes','To whatever is new or interesting','Inward to memories, or outward scanning for danger'],
         ['Specific signs','None of these','Flashbacks, nightmares, avoidance, jumpiness; in children, attachment problems after neglect or many placements']],
   clue:'Re-experiencing is the discriminator: a flashback feels as if it is happening now.',
   ask:['Were you like this before anything bad happened? What did school reports say then?','Do memories come back as if it is happening again?'],
   check:[['f','pcl5'],['t','Safeguarding: current risk to the person and any children. Do not press for trauma details in an ADHD assessment.']],
   mimic:'attention, restlessness and irritability began after the trauma, are driven by intrusions, avoidance and threat, and settle in safe settings.',
   both:'ADHD symptoms were there before the trauma and persist in safe, calm settings. ADHD raises the risk of accidents and assaults, so the two often travel together.',
   first:'Safety and safeguarding first; trauma-focused care follows NICE NG116. ADHD treatment can run alongside, with slower titration (NG87 1.7.28 lists PTSD).'},

  {id:'eupd', ch:'EUPD (borderline)', g:'anx', t:'Emotionally unstable (borderline) personality disorder', s:'EUPD', k:'either', ws:[['bpd','EUPD / BPD']],
   v:[0.05,0.05,0.1,0.15,0.32,0.72,0.46,0.76,0.5,0.6,0.4,0.36,0.3], ev:[4.6,'Adolescence'],
   cap:'Emerges in adolescence or early adulthood, with crises tied to relationships.',
   rows:[['When it starts','Before 12: a restless, distractible child','Adolescence or early adulthood, with relationship difficulties'],
         ['What sets off an impulsive act','Boredom, an opportunity, a passing thought','Rejection, abandonment or shame'],
         ['Core features','Inattention, restlessness and impulsivity in all areas','Fear of abandonment, unstable sense of self, emptiness, repeated self-harm']],
   clue:'Both are long-standing, so the course does not separate them. Ask what comes just before the impulsive act.',
   ask:['What happens just before you do something on impulse?','Do you often fear people will leave you? Have you ever hurt yourself on purpose?'],
   check:[['f','msibpd'],['f','cssrs']],
   mimic:'impulsivity and inattention appear mainly in emotional crises or after interpersonal triggers and began in adolescence, with no childhood ADHD.',
   both:'childhood ADHD is corroborated and persists in calm, stable periods, and EUPD features are also present. Count each symptom once.',
   first:'Self-harm and risk first (NICE NG225); EUPD care follows NICE CG78. Borderline personality disorder is a methylphenidate contraindication (SmPC 4.3), so prescribing is a specialist decision. Women with ADHD may be given another diagnosis instead (NG87 1.2.2), and EUPD is a common one: look for the school-age history.'},

  /* ---------------- Substances and medicines ---------------- */
  {id:'sud', ch:'Alcohol and drugs', g:'sub', t:'Alcohol and drugs', s:'substance use', k:'both', ws:[['sud_alcohol','Alcohol'],['sud_cannabis','Cannabis'],['sud_stim','Stimulants']],
   stat:'23% of adults in treatment for substance use have ADHD (meta-analysis, van Emmerik-van Oortmerssen 2012).',
   v:[0.05,0.05,0.05,0.08,0.15,0.55,0.76,0.5,0.7,0.4,0.6,0.36,0.35], ev:[4.7,'Regular use'],
   cap:'Starts with regular use, then follows the cycle of use, withdrawal and abstinence.',
   rows:[['When it starts','Before 12, before first use','After regular use began'],
         ['Over time','Still there in sober and drug-free periods','Follows intoxication, hangover, withdrawal and crashes'],
         ['After stopping','Persists through weeks without use','Clears with sustained abstinence (for alcohol, 3–4 weeks)']],
   clue:'Ask about sober periods: weeks without alcohol or drugs (pregnancy, illness, custody, treatment) are the best natural experiment.',
   ask:['Which came first: the concentration problems or the drinking or drug use?','How were you during the longest time you went without?'],
   check:[['f','audit'],['f','dast10'],['t','Urine drug screen with consent, never on its own']],
   mimic:'problems began after regular use, follow the use cycle and clear with sustained abstinence, with no childhood history (DSM-5-TR criterion E; ICD-11).',
   both:'ADHD was there before first use and persists through drug-free periods. This is the usual pattern: ADHD usually starts first.',
   first:'Stabilise severe dependence or withdrawal first, then treat both. With a misuse or diversion risk: caution with stimulants (NG87 1.7.23); no immediate-release stimulants, or modified-release ones that are easy to inject or snort (1.7.24); slower titration (1.7.28).'},

  {id:'med', ch:'Medicines and caffeine', g:'sub', t:'Medicines, caffeine and nicotine', s:'a medicine', k:'mimic', ws:[['meds','Medicines']],
   v:[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.12,0.74,0.74,0.16,0.12], ev:[8.5,'New medicine'],
   cap:'Starts with a new medicine or dose, and eases when it is stopped or changed.',
   rows:[['When it starts','Before 12','With a new medicine or a dose change'],
         ['Over time','Steady, whatever the medicines','Eases when the medicine is reduced, stopped or retimed'],
         ['What it looks like','Distractible while alert','Slowed and foggy (sedation), or an unpleasant inner urge to move (akathisia)']],
   clue:'Draw the medicine timeline against the symptom timeline.',
   ask:['What do you take, including inhalers, sleeping tablets, painkillers, cold remedies, supplements and energy drinks?','Did this start or get worse with a new medicine or dose?'],
   check:[['t','Medicines reconciliation: GP record, pharmacy records and the person’s own list (NICE NG5)']],
   mimic:'symptoms began with the medicine, ease when it is reduced or stopped, and there is no childhood history. DSM-5-TR names bronchodilators, isoniazid, antipsychotics (akathisia) and thyroid replacement.',
   both:'childhood ADHD symptoms predate the medicine and persist off it or on a stable dose.',
   first:'Agree any change with the prescriber; never stop an anti-seizure medicine without the specialist. A pharmacist’s medication review is a real strength here.'},

  /* ---------------- Sleep ---------------- */
  {id:'osa', ch:'Sleep apnoea', g:'sleep', t:'Obstructive sleep apnoea', s:'sleep apnoea', k:'either', ws:[['osa','Sleep apnoea']],
   v:[0.05,0.42,0.32,0.14,0.1,0.12,0.15,0.25,0.4,0.55,0.62,0.68,0.7],
   cap:'Children: large tonsils or adenoids. Adults: rises with weight and age.',
   rows:[['Sleepy or distracted?','Mind leaves the task while wide awake','Heavy eyes and nodding off after broken sleep'],
         ['At night','Late to sleep, busy mind','Loud snoring, gasping, pauses in breathing'],
         ['Who','Since childhood','Children with big tonsils; adults with weight gain, a larger neck, older age']],
   clue:'Ask the bed partner or parent about snoring and pauses in breathing.',
   ask:['Does anyone say you snore loudly or stop breathing in your sleep?','Do you nod off in the day when you sit still?'],
   check:[['f','stopbang'],['t','Adults: sleep service (NICE NG202). Children: ENT or sleep referral (clinical practice)']],
   mimic:'attention and memory problems began with the sleep symptoms, there is no childhood history, and they improve with treatment.',
   both:'ADHD was present in childhood, before the snoring or weight gain, and core features persist once sleep apnoea is treated. If unsure, treat the apnoea and reassess.',
   first:'Treat the sleep apnoea, then rate ADHD symptoms again. Do not use the Epworth score alone to decide on referral: not everyone with sleep apnoea is sleepy (NG202).'},

  {id:'clock', ch:'Short sleep, late body clock', g:'sleep', t:'Short sleep and a late body clock', s:'short sleep', k:'both', ws:[['dsps','Late body clock'],['insomnia','Insomnia']],
   v:[0.05,0.1,0.15,0.3,0.55,0.38,0.62,0.36,0.55,0.34,0.45,0.3,0.3],
   cap:'Worse with early starts and sleep debt; better on the person’s own clock.',
   rows:[['Pattern','All day, across tasks','Mainly after short nights and early starts'],
         ['Bedtime','“My brain switches on at 11 pm”: common in ADHD','Late body clock (delayed sleep phase), screens, shifts, caffeine'],
         ['In children','Present after good nights too','Overtired children can look more active, not sleepy (clinical practice)']],
   clue:'The free-schedule question: “When you sleep on your own clock, are you still distracted and disorganised?”',
   ask:['What time do you fall asleep and wake on days off?','How many hours do you sleep on work or school nights?'],
   check:[['t','Sleep diary for at least 2 weeks, including days off']],
   mimic:'problems are confined to early starts and sleep debt and clear on a body-clock-friendly schedule, with no childhood daytime history.',
   both:'a late body clock is so common in ADHD that it usually travels with it. Record it and manage it as part of the plan.',
   first:'Sleep advice first. Record sleep before any medicine: NICE asks you to monitor changes in sleep on treatment (NG87 1.8.17). Melatonin is a specialist or shared-care decision (Module 7).'},

  {id:'rls', g:'sleep', t:'Restless legs', s:'restless legs', k:'both', ws:[['rls','Restless legs']],
   v:[0.02,0.05,0.08,0.1,0.12,0.15,0.2,0.25,0.3,0.38,0.45,0.5,0.55],
   cap:'Can start at any age; often more common with age.',
   rows:[['Where it lives','Whole body and mind','The legs, with an unpleasant feeling'],
         ['When','All day, worse when bored','At rest, in the evening and at night'],
         ['What moving does','Relieves boredom or inner tension','Relieves the leg discomfort']],
   clue:'Ask where the restlessness lives, and when.',
   ask:['Do you get an unpleasant urge to move your legs when you sit or lie down in the evening?','Does walking about ease it?'],
   check:[['t','Full blood count and ferritin (iron deficiency is linked); review medicines that can worsen it']],
   mimic:'the restlessness is confined to the legs and tied to rest and evening, and other ADHD symptoms are absent.',
   both:'restless legs are present and the person also has childhood, all-day, whole-body restlessness. Count only the restlessness that restless legs do not explain.',
   first:'Treat the restless legs: correct low iron and review medicines that can worsen it, such as sedating antihistamines, some antidepressants and antipsychotics (clinical practice).'},

  /* ---------------- Body and brain ---------------- */
  {id:'thy', g:'body', t:'Thyroid disease', s:'thyroid disease', k:'mimic', ws:[['thyroid','Thyroid disease']],
   v:[0.05,0.05,0.05,0.05,0.06,0.06,0.08,0.1,0.72,0.7,0.2,0.15,0.15], ev:[7.5,'Thyroid illness'],
   cap:'Starts with the illness in adulthood and settles with treatment.',
   rows:[['When it starts','Before 12, lifelong','Adulthood, with a clear change'],
         ['Body clues','No physical signs','Over-active (copies restlessness): tremor, palpitations, weight loss, heat intolerance. Under-active (copies inattention): weight gain, cold intolerance, tiredness'],
         ['Over time','Lifelong and steady','Settles once thyroid levels are back to normal']],
   clue:'Timing, not the test: a normal TSH does not prove ADHD, and an abnormal one does not rule it out.',
   ask:['Have you noticed weight change, shaking, a racing heart, or feeling too hot or too cold?','Is anyone in your family treated for thyroid problems?'],
   check:[['t','TSH when the history or examination suggests it; not routine for every assessment (NICE NG145)']],
   mimic:'symptoms began in adulthood with physical features and abnormal tests, with no childhood history.',
   both:'childhood symptoms predate the thyroid disease and persist once thyroid levels are normal.',
   first:'Treat the thyroid first. Hyperthyroidism is a contraindication for methylphenidate, lisdexamfetamine and dexamfetamine (SmPC 4.3). In anyone on levothyroxine, too high a dose causes jitteriness.'},

  {id:'abi', ch:'Head injury', g:'body', t:'Head injury (acquired brain injury)', s:'a head injury', k:'either', ws:[['tbi','Brain injury']],
   v:[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.76,0.66,0.6,0.56,0.55,0.55], ev:[6.5,'Injury'],
   cap:'New problems after the injury; informants describe a change.',
   rows:[['When it starts','Before 12, before any injury','After the injury'],
         ['What it looks like','Lifelong inattention, restlessness, impulsivity','New slowed thinking, fatigue, irritability, disinhibition, headaches'],
         ['Injuries','Many minor injuries since childhood can be a sign of ADHD','One significant injury (knocked out, a hospital stay) before the change']],
   clue:'Ask in more than one way: “Have you ever been knocked out or dazed?” finds injuries that “head injury” misses.',
   ask:['Have you ever been knocked out, dazed, or kept in hospital after a blow to the head?','Were you different before it? What did school reports say?'],
   check:[['t','Injury records, scans and discharge letters; neuropsychology or brain injury services if there are new deficits']],
   mimic:'problems began after the injury, with no childhood history: record a brain-injury-related condition, not ADHD.',
   both:'childhood ADHD is documented before the injury. The injury may have added new problems on top.',
   first:'ADHD is more common after acquired brain injury (NG87 1.2.1), and it is on the list for slower titration and closer monitoring (1.7.28). Work with neurology or brain injury services; NICE NG232 covers early head injury care.'},

  {id:'epi', ch:'Absence seizures', g:'body', t:'Epilepsy (absence seizures)', s:'seizures', k:'either', ws:[['epilepsy','Epilepsy']],
   v:[0.05,0.15,0.6,0.62,0.45,0.2,0.1,0.08,0.08,0.08,0.08,0.08,0.08],
   cap:'Childhood absence epilepsy usually starts in the primary-school years.',
   rows:[['The spells','Daydreaming that drifts in and out','Blank spells of seconds with a sudden start and stop; may have eyelid flutter'],
         ['Can you interrupt it?','Yes: stops when you call the name or touch them','No; no memory of the spell afterwards'],
         ['How often','Mostly during dull tasks','Many times a day, at any time, even mid-sentence']],
   clue:'The bedside test: can the spell be interrupted?',
   ask:['Do they stop mid-sentence and stare, then carry on as if nothing happened?','Can you snap them out of it by calling their name?'],
   check:[['t','An eyewitness account and a phone video; urgent referral to a first-seizure or epilepsy specialist (NICE NG217). EEG is the specialist’s decision and has no role in diagnosing ADHD.']],
   mimic:'the lapses are brief, abrupt, cannot be interrupted and are not remembered. Refer, and do not diagnose ADHD on lapses.',
   both:'ADHD symptoms (disorganisation, restlessness, impulsivity) are present between seizures, from childhood, and go beyond the lapses.',
   first:'Optimise seizure control with neurology. Epilepsy is not a reason to withhold ADHD treatment: titrate slowly (NG87 1.7.28) and review medicines if seizures start or worsen (1.8.16).'},

  {id:'meno', ch:'Perimenopause', g:'body', t:'Perimenopause and menopause', s:'perimenopause', k:'either', ws:[['menopause','Menopause']],
   v:[0.05,0.05,0.05,0.05,0.06,0.06,0.06,0.07,0.08,0.3,0.7,0.6,0.3], ev:[9.3,'Perimenopause'],
   cap:'New in midlife, with changes in periods and hot flushes.',
   rows:[['When it starts','Childhood; may get much worse in perimenopause','Midlife, with changes in periods and hot flushes'],
         ['History','A lifelong pattern, held together by effort and systems until now','No earlier history; others describe a recent change'],
         ['Other clues','Earlier hormone-linked worsening (premenstrual, after a birth) is often reported','Hot flushes, night sweats, broken sleep, low mood, “brain fog”']],
   clue:'The childhood history decides: perimenopause can unmask lifelong ADHD, but it cannot create a childhood history.',
   ask:['Were you disorganised or distracted at school, long before your periods changed?','How much of the fog follows nights broken by sweats?'],
   check:[['t','Over 45, diagnose perimenopause from symptoms; no FSH test needed (NICE NG23). Thyroid tests if atypical (NICE NG145); FBC and ferritin if periods are heavy.']],
   mimic:'symptoms began in midlife with menstrual change and hot flushes, with no childhood history, and improve once sleep and flushes are treated.',
   both:'there is a credible lifelong pattern that perimenopause has worsened or unmasked. Record perimenopause as an aggravating factor.',
   first:'Treat menopause symptoms with the GP or a menopause service (NICE NG23), then reassess. Evidence on ADHD and the menopause is still small and mostly self-reported.'},

  {id:'sens', ch:'Hearing and sight', g:'body', t:'Hearing and vision problems', s:'a hearing or sight problem', k:'mimic', ws:[['sensory','Hearing and vision']],
   v:[0.1,0.58,0.48,0.2,0.1,0.1,0.1,0.12,0.18,0.28,0.38,0.48,0.58],
   cap:'Children: glue ear and uncorrected sight. Adults: noise exposure and age.',
   rows:[['Did they hear it?','Heard, then drifted away','Did not hear or see it properly'],
         ['Where','Also one-to-one, close up, in quiet','Mainly in noise, at the back of the class, with small or distant text'],
         ['History','Lifelong, across settings','Glue ear, ear infections, speech delay, squinting, headaches']],
   clue:'“Did they not hear, or hear and drift away?”',
   ask:['When were hearing and eyesight last checked?','Is it better when you sit at the front, or face the person?'],
   check:[['t','Hearing test and sight test, especially in children if not done recently']],
   mimic:'the “inattention” happens mainly in tasks that need that sense and clears with correction.',
   both:'ADHD symptoms are present in quiet, well-lit, one-to-one settings with aids in place, and date from childhood.',
   first:'Quick to test and often easy to fix: do it early. Give information in a form that suits sight and hearing needs (NG87 1.4.5).'},

  {id:'cog', ch:'Later-life decline', g:'body', t:'Memory decline in later life', s:'cognitive decline', k:'mimic', ws:[['mci','Cognitive decline']],
   v:[0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.06,0.1,0.22,0.5,0.82], ev:[9.6,'Decline'],
   cap:'A decline from the person’s own earlier level, getting worse over time.',
   rows:[['When it starts','Lifelong','Mid or later life'],
         ['Over time','Stable','Getting worse; repeat testing shows decline'],
         ['Best witness','Someone who knew them at 20 describes the same person','Others notice new forgetting, getting lost or a change in personality']],
   clue:'Lifelong or decline? An informant who knew the person at 20 is worth more than any test.',
   ask:['Have you always been like this, or is it a change in the last few years?','What has changed recently: retirement, or losing a partner who organised things?'],
   check:[['t','GP or memory service check for reversible causes, then memory assessment (NICE NG97)']],
   mimic:'there is a measurable decline, onset in mid or later life, and progression, with no childhood history.',
   both:'lifelong ADHD is well documented and a new decline goes beyond that baseline.',
   first:'Refer to a memory service. For lifelong ADHD in older adults, see Section E; most ADHD medicine SmPCs have little or no data after 60–65 (Module 7).'},

  /* ---------------- Neurodevelopmental and childhood ---------------- */
  {id:'asd', g:'nd', t:'Autism', s:'autism', k:'both', ws:[['asd','Autism']],
   stat:'28% of autistic people also have ADHD (meta-analysis of 96 studies, Lai 2019).',
   v:[0.3,0.62,0.7,0.7,0.7,0.7,0.68,0.66,0.64,0.62,0.6,0.6,0.6],
   cap:'Also lifelong from early childhood, so the course does not separate them: the pattern does.',
   rows:[['“Not listening”','Attention drifts away','The social cue is missed, or attention is locked on an interest'],
         ['Routines','A scaffold against forgetting, often dropped','Give predictability; a sudden change causes distress'],
         ['Friendships','Makes friends easily, may lose them','Finds it hard to make friends']],
   clue:'“Make or keep friends?” Autistic people more often struggle to make friends; people with ADHD more often lose them.',
   ask:['Is it harder to make friends, or to keep them?','How do you feel when your routine changes at short notice?'],
   check:[['f','aq10'],['t','Autism assessment through the local pathway (NICE CG142 adults, CG128 under 19s)']],
   mimic:'“not listening”, interrupting and restlessness all come from autism: attention fails only for non-preferred or social input, or in sensory overload.',
   both:'there is also broad inattention or hyperactivity-impulsivity from childhood, across settings including quiet, familiar ones. Count each symptom once.',
   first:'Treat both. Do not exclude ADHD because of autism (NG87 1.3.3). Same medicine choices (1.7.18), slower titration and closer monitoring (1.7.28).'},

  {id:'id', ch:'Intellectual disability', g:'nd', t:'Intellectual disability', s:'intellectual disability', k:'either', ws:[['idd','Intellectual disability']],
   v:[0.4,0.62,0.66,0.66,0.66,0.66,0.66,0.66,0.66,0.66,0.66,0.66,0.66],
   cap:'Lifelong from early development: judge ADHD against developmental level.',
   rows:[['On easy, familiar tasks','Attention still poor compared with people of the same ability','Attention fine when the task is within reach'],
         ['When it shows','Across settings and tasks','Mainly when demands are above the person’s ability'],
         ['Best evidence','Carers compare them with others they support','Global delay from early milestones']],
   clue:'Compare with people of similar ability, not with people of the same age (ICD-11; DSM-5-TR).',
   ask:['(To a carer) Compared with others you support at the same level, how is their attention?','What happens when the task is made simpler?'],
   check:[['t','Carers from more than one setting, observation, and DIVA-5 ID for adults (Section E)']],
   mimic:'inattention and restlessness match the person’s mental age and appear mainly when demands exceed ability.',
   both:'ADHD symptoms clearly exceed those of people of similar ability, across settings and with simple, familiar tasks.',
   first:'Slower titration and closer monitoring (NG87 1.7.28 names learning disability). Look for causes (genetic syndromes, prenatal alcohol) and unmet needs, and watch for diagnostic overshadowing.'},

  {id:'sld', ch:'Dyslexia and dyspraxia', g:'nd', t:'Dyslexia, dyscalculia and dyspraxia', s:'a specific learning difficulty', k:'both', ws:[['sld','Learning disorders'],['dcd','Dyspraxia (DCD)']],
   v:[0.05,0.2,0.6,0.62,0.58,0.52,0.48,0.44,0.42,0.42,0.42,0.42,0.42], ev:[1.6,'School'],
   cap:'Shows when the skill is needed: reading, writing, maths or movement.',
   rows:[['When attention fails','Everywhere: conversations, chores, driving, leisure','Only with reading, writing or maths'],
         ['Reading','Eyes move over the words while the mind is elsewhere','Words do not go in because they are hard to decode'],
         ['Clumsiness (dyspraxia)','Goes when they slow down and concentrate','Stays even with full attention: handwriting, sport, dressing']],
   clue:'“Is your attention a problem when you are not reading or writing?” If not, think learning difficulty first.',
   ask:['Is your focus a problem outside reading, writing or maths?','Is the clumsiness still there when you slow down and concentrate?'],
   check:[['t','School records; educational psychology or specialist assessment']],
   mimic:'attention problems arise only with the hard skill, and attention is ordinary elsewhere (ICD-11; DSM-5-TR).',
   both:'there is a skill deficit and, separately, ADHD symptoms outside academic or motor tasks. This combination is common.',
   first:'Treat in parallel: learning support through school or college (letter to school, NG87 1.4.12) plus ADHD care. In UK usage “learning disability” means intellectual disability; “specific learning difficulty” means dyslexia, dyscalculia or dyspraxia.'},

  {id:'tic', ch:'Tics and Tourette', g:'nd', t:'Tics and Tourette syndrome', s:'tics', k:'both', ws:[['tics','Tics']],
   stat:'54% of people with Tourette syndrome have ADHD at some point in their life (Hirschtritt 2015).',
   v:[0.05,0.24,0.5,0.76,0.56,0.42,0.3,0.26,0.22,0.2,0.2,0.2,0.2],
   cap:'Start in childhood, wax and wane, and often improve by early adulthood.',
   rows:[['The movement','Fidgeting and general restlessness','Sudden, repeated movements or sounds: blinks, sniffs, throat clearing'],
         ['The urge','Boredom or inner restlessness','A bodily urge before the tic and relief after; can be held back briefly'],
         ['Over time','Steady since early childhood','Wax and wane; often improve by early adulthood']],
   clue:'The premonitory urge: a feeling just before the tic, and relief after it.',
   ask:['Do you get a feeling or urge just before the movement, and relief after?','Can you hold it back for a while?'],
   check:[['t','Watch during the interview; ask a parent or partner; a simple tic diary']],
   mimic:'the “hyperactivity” or blurting is made up of tics, and there is no childhood pattern of inattention or general restlessness.',
   both:'ADHD symptoms are present when the tics are quiet. This is the usual clinic picture.',
   first:'ADHD is usually the more impairing condition. Same medicine choices (NG87 1.7.18), slower titration (1.7.28). Tourette syndrome is a dexamfetamine contraindication (SmPC 4.3). Tics on a stimulant: Module 7.'},

  {id:'odd', ch:'Oppositional behaviour', g:'nd', t:'Oppositional and conduct problems (children)', s:'oppositional behaviour', k:'both', ws:[],
   v:[0.1,0.48,0.7,0.66,0.5,0.38,0.28,0.22,0.2,0.18,0.18,0.18,0.18],
   cap:'Mainly childhood and adolescence; directed at adults in charge.',
   rows:[['“Won’t” or “can’t”?','Can’t: forgets, loses track, drifts off','Won’t: refuses, argues, defies'],
         ['Who it targets','Everyone and everything','Mainly adults in charge; angry or spiteful'],
         ['With a liked task','Still drifts off','Can focus when they want to']],
   clue:'DSM-5-TR: ADHD symptoms are not just oppositional behaviour or a failure to understand instructions.',
   ask:['Does the work stay unfinished because they drift off, or because they refuse?','Is the anger aimed mainly at the adults in charge?'],
   check:[['t','Parent and teacher reports; observation at school when in doubt (NG87 1.3.2)']],
   mimic:'non-compliance is refusal, aimed mainly at authority, and attention is fine for liked tasks.',
   both:'inattention or hyperactivity-impulsivity is present beyond the defiance. Common: NG87 1.2.1 lists children with oppositional defiant or conduct disorder.',
   first:'Offer parents a parent-training programme (NG87 1.5.11–1.5.12) alongside ADHD care. Antipsychotics for aggression only with tertiary advice (1.7.17). If behaviour worsens on medicine, adjust it and review the diagnosis (1.8.18).'},

  {id:'fasd', ch:'FASD', g:'nd', t:'Fetal alcohol spectrum disorder (FASD)', s:'FASD', k:'both', ws:[],
   v:[0.5,0.68,0.72,0.72,0.72,0.7,0.68,0.66,0.64,0.62,0.6,0.6,0.6],
   cap:'Present from birth; often a wider pattern of difficulties.',
   rows:[['Cause','Mostly genetic; often a family history of ADHD','Alcohol exposure before birth'],
         ['Profile','Inattention, hyperactivity, impulsivity','Often wider: learning, memory, language, social and daily-living problems; sometimes growth and facial features'],
         ['History','Family history of ADHD','Alcohol in pregnancy; often adoption or a care history']],
   clue:'Ask about alcohol in pregnancy routinely and sensitively.',
   ask:['Do you know whether there was any alcohol use during the pregnancy?','Has there been adoption, foster care or a care history?'],
   check:[['t','Referral for FASD assessment where indicated (NICE QS204)']],
   mimic:'it is a cause rather than a rival: FASD explains why ADHD-like problems are there, often with a wider pattern of difficulties.',
   both:'ADHD criteria are met. ADHD is common in FASD and is diagnosed alongside it.',
   first:'Treat ADHD as usual, with slower titration and closer monitoring for a neurodevelopmental condition (NG87 1.7.28). FASD is not named in NG87 1.2.1, but looked-after children are.'}
  ];

  window.M8DX = {groups:G, conds:C};

  function esc(x){ return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function cap1(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

  /* ---------- course chart (SVG) ---------- */
  var W = 300, H = 132, L = 10, R = 10, T = 22, B = 24;
  function X(i){ return L + i*(W-L-R)/12; }
  function Y(v){ return T + (1-v)*(H-T-B); }
  function path(v){
    var p = v.map(function(y,i){ return [X(i), Y(y)]; }), d = 'M'+p[0][0].toFixed(1)+' '+p[0][1].toFixed(1);
    for(var i=0;i<p.length-1;i++){
      var p0 = p[i-1]||p[i], p1 = p[i], p2 = p[i+1], p3 = p[i+2]||p2;
      var c1x = p1[0]+(p2[0]-p0[0])/6, c1y = p1[1]+(p2[1]-p0[1])/6, c2x = p2[0]-(p3[0]-p1[0])/6, c2y = p2[1]-(p3[1]-p1[1])/6;
      d += ' C'+c1x.toFixed(1)+' '+c1y.toFixed(1)+' '+c2x.toFixed(1)+' '+c2y.toFixed(1)+' '+p2[0].toFixed(1)+' '+p2[1].toFixed(1);
    }
    return d;
  }
  function chart(v, col, lt, ev, label, showAdhd){
    var s = '<svg class="m8x-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(label)+'">';
    s += '<rect x="0" y="0" width="'+W+'" height="'+H+'" rx="10" fill="#fbfcfd"/>';
    s += '<line x1="'+X(0)+'" y1="'+(H-B)+'" x2="'+X(12)+'" y2="'+(H-B)+'" stroke="#c9d3dd"/>';
    /* the age-12 line: everything before it counts as childhood onset */
    s += '<rect x="'+X(0)+'" y="'+T+'" width="'+(X(4)-X(0))+'" height="'+(H-T-B)+'" fill="#16324f" opacity=".04"/>';
    s += '<line x1="'+X(4)+'" y1="'+(T-4)+'" x2="'+X(4)+'" y2="'+(H-B)+'" stroke="#16324f" stroke-dasharray="2 3" opacity=".55"/>';
    s += '<text x="'+(X(4)-4)+'" y="'+(T+2)+'" font-size="9.5" fill="#55626f" text-anchor="end">before 12</text>';
    Object.keys(AGES).forEach(function(i){ var an = +i===0 ? 'start' : (+i===12 ? 'end' : 'middle'); s += '<text x="'+X(+i)+'" y="'+(H-8)+'" font-size="10" fill="#55626f" text-anchor="'+an+'">'+AGES[i]+'</text>'; });
    var d = path(v);
    s += '<path d="'+d+' L'+X(12)+' '+(H-B)+' L'+X(0)+' '+(H-B)+' Z" fill="'+lt+'"/>';
    if(ev){ var ex = X(ev[0]); s += '<line x1="'+ex+'" y1="'+(T-2)+'" x2="'+ex+'" y2="'+(H-B)+'" stroke="'+col+'" stroke-width="1.4" stroke-dasharray="3 3"/><text x="'+Math.min(Math.max(ex,30),W-30)+'" y="'+(T-8)+'" font-size="10" font-weight="600" fill="'+col+'" text-anchor="middle">'+esc(ev[1])+'</text>'; }
    if(showAdhd!==false) s += '<path d="'+path(ADHD)+'" fill="none" stroke="#16324f" stroke-width="2" stroke-dasharray="5 4" opacity=".75"/>';
    s += '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="2.6" stroke-linecap="round"/>';
    return s + '</svg>';
  }

  /* ---------- explorer ---------- */
  var memo = {};
  try{ memo = JSON.parse(localStorage.getItem('adhd.m8x')||'{}')||{}; }catch(e){ memo = {}; }
  function remember(k,id){ memo[k] = id; try{ localStorage.setItem('adhd.m8x', JSON.stringify(memo)); }catch(e){} }

  function checkHTML(c){
    return c.check.map(function(x){
      if(x[0]==='f') return '<button type="button" class="m8x-form" data-form="'+x[1]+'" title="Open the '+esc(FORM[x[1]])+' in the Form library">'+esc(FORM[x[1]])+'</button>';
      return '<span class="m8x-test">'+esc(x[1])+'</span>';
    }).join('');
  }

  function mount(m){
    var keys = m.getAttribute('data-m8x').split(','), list = C.filter(function(c){ return keys.indexOf(c.g) >= 0; });
    if(!list.length) return;
    var mk = keys.join(','), cur = 0;
    for(var i=0;i<list.length;i++) if(list[i].id===memo[mk]) cur = i;
    function draw(){
      var c = list[cur], g = G[c.g], k = KIND[c.k], n = list.length;
      var h = '<div class="m8x-pick" role="group" aria-label="Choose a condition">';
      keys.forEach(function(gk){
        var gl = list.filter(function(x){ return x.g===gk; });
        if(keys.length>1) h += '<span class="m8x-gl" style="--c:'+G[gk].c+'">'+esc(G[gk].t)+'</span>';
        h += gl.map(function(x){ var j = list.indexOf(x); return '<button type="button" class="m8x-chip" style="--c:'+G[x.g].c+';--l:'+G[x.g].l+'" data-j="'+j+'" aria-pressed="'+(j===cur)+'" title="'+esc(x.t)+'"><i class="'+KIND[x.k][1]+'" aria-hidden="true"></i>'+esc(x.ch||x.t)+'</button>'; }).join('');
      });
      h += '</div>';
      h += '<article class="m8x-card" style="--c:'+g.c+';--l:'+g.l+'" aria-live="polite">';
      h += '<header><div><span class="m8x-eb">ADHD or '+esc(c.s)+'? · '+(cur+1)+' of '+n+'</span><h3>'+esc(c.t)+'</h3></div><span class="m8x-kind '+k[1]+'">'+k[0]+'</span></header>';
      if(c.stat) h += '<p class="m8x-stat">'+esc(c.stat)+'</p>';
      h += '<div class="m8x-top"><figure class="m8x-fig">'+chart(c.v, g.c, g.l, c.ev, 'Typical course over life, not to scale. Dashed line: ADHD, present from early childhood. Solid line: '+c.t+'. '+c.cap)
        + '<figcaption><span class="m8x-key"><i class="ka"></i>ADHD</span><span class="m8x-key"><i class="kx"></i>'+esc(cap1(c.s))+'</span><span class="m8x-cap">'+esc(c.cap)+'</span></figcaption></figure>';
      h += '<div class="m8x-clue"><span class="m8x-lb">Best clue</span><p>'+esc(c.clue)+'</p><span class="m8x-lb">Ask</span><ul>'+c.ask.map(function(q){ return '<li>“'+esc(q)+'”</li>'; }).join('')+'</ul></div></div>';
      h += '<div class="m8x-cmp" role="table" aria-label="Points to ADHD or to '+esc(c.s)+'"><div class="m8x-r m8x-h" role="row"><span role="columnheader"></span><span role="columnheader" class="ha">Points to ADHD</span><span role="columnheader" class="hx">Points to '+esc(c.s)+'</span></div>'
        + c.rows.map(function(r){ return '<div class="m8x-r" role="row"><b role="rowheader">'+esc(r[0])+'</b><p class="pa" role="cell"><span class="m8x-sl">ADHD</span>'+esc(r[1])+'</p><p class="px" role="cell"><span class="m8x-sl">'+esc(cap1(c.s))+'</span>'+esc(r[2])+'</p></div>'; }).join('') + '</div>';
      h += '<div class="m8x-dec"><p class="d-mim"><b>'+esc(cap1(c.s))+' alone explains it when</b>'+esc(c.mimic)+'</p><p class="d-both"><b>Diagnose both when</b>'+esc(c.both)+'</p><p class="d-first"><b>If both: what comes first</b>'+esc(c.first)+'</p></div>';
      h += '<div class="m8x-check"><span class="m8x-lb">Check</span>'+checkHTML(c)+'</div>';
      h += '<footer><button type="button" class="btn secondary m8x-go" data-d="-1"'+(cur===0?' disabled':'')+'>← Previous</button>'
        + (c.ws.length ? '<span class="m8x-ws">Full reference: '+c.ws.map(function(w){ return '<a href="adhd-assessment/index.html#cond-'+w[0]+'" target="_blank" rel="noopener">'+esc(w[1])+' ↗</a>'; }).join(' ')+'</span>' : '<span class="m8x-ws"></span>')
        + '<button type="button" class="btn m8x-go" data-d="1"'+(cur===n-1?' disabled':'')+'>Next →</button></footer></article>';
      m.innerHTML = h;
      /* on phones the chips scroll sideways: keep the chosen one in view */
      var pc = m.querySelector('.m8x-chip[aria-pressed="true"]'), row = pc && pc.parentNode;
      if(row && row.scrollWidth > row.clientWidth) row.scrollLeft = Math.max(0, pc.offsetLeft - 12);
    }
    m.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b || !m.contains(b)) return;
      if(b.classList.contains('m8x-chip')){ cur = +b.dataset.j; }
      else if(b.classList.contains('m8x-go')){ cur = Math.max(0, Math.min(list.length-1, cur + (+b.dataset.d))); }
      else if(b.classList.contains('m8x-form')){
        var id = b.dataset.form; location.hash = 'form-library';
        setTimeout(function(){ if(window.__m3form) window.__m3form(id); var p = document.querySelector('#form-library .fl-panel[data-form="'+id+'"]'); if(p && p.scrollIntoView) p.scrollIntoView({block:'start'}); }, 80);
        return;
      }
      else return;
      remember(mk, list[cur].id);
      var y = window.scrollY; draw(); window.scrollTo(0, y);
      var f = m.querySelector(b.classList.contains('m8x-chip') ? '.m8x-chip[aria-pressed="true"]' : '.m8x-go[data-d="'+b.dataset.d+'"]:not([disabled])') || m.querySelector('.m8x-card h3');
      if(f){ if(f.tagName==='H3') f.setAttribute('tabindex','-1'); f.focus({preventScroll:true}); }
    });
    draw();
  }

  /* ---------- lesson 2: four course shapes ---------- */
  var SH = [
    {t:'Steady since childhood', d:'ADHD. Also autism and intellectual disability, so look at the pattern too.', c:'#16324f', l:'#e8edf3', v:ADHD, adhd:false},
    {t:'Episodes', d:'Depression, bipolar disorder: a clear change from the usual self that comes and goes.', c:'#7b4fb3', l:'#f3edfa', v:[0.1,0.1,0.1,0.12,0.15,0.2,0.84,0.2,0.15,0.8,0.18,0.15,0.15]},
    {t:'Starts later, after a change', d:'Head injury, substances, a new medicine, thyroid disease, menopause, psychosis, memory decline.', c:'#a8432e', l:'#fbe9e4', v:[0.06,0.06,0.06,0.06,0.07,0.08,0.1,0.72,0.68,0.64,0.62,0.6,0.6], ev:[6.5,'Event']},
    {t:'Comes and goes with a trigger', d:'Anxiety, trauma, sleep loss: worse in feared situations or after bad nights, better on good days.', c:'#2f6fb3', l:'#e8f0fa', v:[0.1,0.14,0.2,0.42,0.24,0.56,0.3,0.6,0.34,0.52,0.3,0.46,0.3]}
  ];
  function shapes(m){
    m.innerHTML = '<div class="m8-sh-grid">' + SH.map(function(s,i){
      return '<figure class="m8-sh" style="--c:'+s.c+';--l:'+s.l+'"><span class="m8-sh-n">'+(i+1)+'</span>'+chart(s.v, s.c, s.l, s.ev, s.t+': '+s.d, s.adhd!==false && i>0)+'<figcaption><b>'+esc(s.t)+'</b>'+esc(s.d)+'</figcaption></figure>';
    }).join('') + '</div><p class="m8-sh-key"><span class="m8x-key"><i class="ka"></i>ADHD (dashed, for comparison)</span><span class="m8-sh-note">Shapes are typical patterns, not to scale. The shaded band is childhood, before age 12.</span></p>';
  }

  function init(){
    Array.prototype.forEach.call(document.querySelectorAll('[data-m8x]'), mount);
    Array.prototype.forEach.call(document.querySelectorAll('[data-m8shapes]'), shapes);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
