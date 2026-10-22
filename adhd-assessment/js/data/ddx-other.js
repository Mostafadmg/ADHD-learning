/* Differential diagnosis: sleep disorders, psychosis, normal variation and feigning (ARCHITECTURE.md 5.5).
   Conditions in order: osa, insomnia, dsps, narcolepsy, rls, psychosis, normal, feigning.
   UK practice (NICE NG87) is the default frame. DSM-5-TR and ICD-11 content is paraphrased, not quoted.
   NICE recommendation numbers were checked on nice.org.uk (NG202, CG178, TA922) or in the research briefs
   (NG87) on 21-22 October 2026. Points not from a named source are clinical practice.
   Interview questions are original prompts written for this app; they are not a validated instrument
   and do not reproduce DIVA wording. */
AA.add('ddx', [

  /* ------------------------------------------------------------------ */
  /* Obstructive sleep apnoea                                            */
  /* ------------------------------------------------------------------ */
  {
    id: "osa",
    name: "Obstructive sleep apnoea (OSA / OSAHS)",
    group: "sleep",
    core: true,
    icd11: "7A41",
    summary: "Repeated collapse of the upper airway during sleep fragments sleep and causes intermittent drops in oxygen. The result can be daytime sleepiness, poor concentration, memory lapses and irritability that closely resemble inattentive ADHD. In adults it usually develops in mid-life, often with weight gain, and attention problems caused by OSA should improve once it is treated effectively.",
    prevalence: "A systematic review reported OSA in 20-30% of people with full-syndrome ADHD (mixed ages) and attention deficits in up to 95% of people with OSA (Youssef et al. 2011). The rate in adult ADHD clinics is not established. Sleep-clinic studies of ADHD screens in OSA are mixed (about 19% screen-positive in one sample, no excess over controls in another; secondary sources).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. DSM-5-TR criterion E asks whether the symptoms are better explained by another condition, and ICD-11 names sleep-wake disorders among the medical causes of attentional symptoms that must be weighed. Diagnose ADHD alongside OSA only when childhood-onset ADHD symptoms are established independently of the sleep disorder: present before the adult snoring, weight gain or sleepiness began, or persisting once OSA is effectively treated. If the childhood history is unclear, treat OSA first and reassess.",
    overlap: [
      "Poor sustained attention, especially in passive or repetitive tasks",
      "Forgetfulness and everyday memory lapses",
      "Irritability and low frustration tolerance",
      "Fatigue and low drive that look like procrastination",
      "Restless, fragmented sleep",
      "Slow work and mistakes from lapses in vigilance",
      "Low mood and reduced motivation",
      "Driving incidents and near misses"
    ],
    favoursADHD: [
      "Inattention, restlessness or impulsivity described before age 12, long before any snoring, weight gain or sleepiness",
      "School reports or a parent describe the same pattern in childhood",
      "Wide awake but distracted: attention drifts to other thoughts or things around them, not into drowsiness",
      "Inner restlessness and fidgeting even when well rested",
      "Impulsivity (interrupting, impulsive spending, snap decisions) that sleep loss does not explain",
      "Symptoms persist on holidays and after good nights' sleep",
      "Core symptoms persist after OSA is treated and CPAP use is good",
      "First-degree relative with ADHD"
    ],
    favoursAlt: [
      "Loud habitual snoring, witnessed pauses in breathing, choking or gasping in sleep",
      "Unrefreshing sleep despite enough time in bed; waking headaches or a dry mouth",
      "Dozing off without meaning to when reading, watching TV, in meetings or while driving",
      "Onset or clear worsening in adulthood, often with weight gain, menopause or evening alcohol",
      "Overweight or obesity, a large neck, a small or set-back jaw, large tonsils or nasal obstruction",
      "Conditions linked to OSA: treatment-resistant hypertension, type 2 diabetes, atrial fibrillation, stroke, hypothyroidism (NICE NG202 1.1.2)",
      "Nocturia (waking at night to pass urine)",
      "Concentration clearly worse after bad nights and normal after good ones",
      "No credible childhood history of ADHD symptoms from the person or an informant",
      "Attention and memory improve after CPAP or other effective OSA treatment",
      "Sleepiness, not distractibility or restlessness, is the main complaint"
    ],
    ask: [
      "Do you snore? How loud is it: could someone hear it through a closed door?",
      "Has anyone ever seen you stop breathing, choke or gasp in your sleep?",
      "How do you feel when you wake up: refreshed, or as if you have hardly slept?",
      "Do you wake with headaches or a very dry mouth?",
      "Do you nod off without meaning to: reading, watching TV, in meetings, as a passenger?",
      "Have you ever felt drowsy or dozed off while driving, or had a near miss because you were tired?",
      "When your concentration goes, is it because you feel sleepy, or are you wide awake but your mind wanders?",
      "Were concentration, restlessness or impulsivity problems there at primary school, before any snoring or weight gain?",
      "When did the tiredness and poor concentration start? Did anything change then, such as weight, drinking, menopause or a new medicine?",
      "Has your weight or collar size gone up in recent years?",
      "Do you have high blood pressure, diabetes, an irregular heartbeat or an underactive thyroid?",
      "How often do you get up to pass urine at night?",
      "How much alcohol do you drink in the evening? Do you take sleeping tablets, strong painkillers or other sedatives?",
      "On a holiday when you sleep well, is your concentration back to normal, or do the same problems carry on?",
      "If you have used CPAP, did your concentration and memory improve, and by how much?",
      "Does your job involve driving or safety-critical work?",
      "(Partner) What is their breathing like at night? Do they snore, stop breathing or thrash about?",
      "(Parent or sibling) Were they restless, distractible or impulsive as a child, long before any snoring or weight gain?"
    ],
    features: [
      { id: "osa_snore", t: "Loud habitual snoring", w: 2 },
      { id: "osa_apnoea", t: "Witnessed apnoeas, choking or gasping in sleep", w: 3 },
      { id: "osa_unrefresh", t: "Unrefreshing sleep or waking headaches despite enough time in bed", w: 2 },
      { id: "osa_doze", t: "Unintended dozing in passive situations (reading, TV, meetings)", w: 2 },
      { id: "osa_drive", t: "Drowsiness or dozing while driving", w: 2 },
      { id: "osa_adultonset", t: "Attention problems began in adulthood with no credible childhood history", w: 3 },
      { id: "osa_body", t: "Onset with weight gain; obesity or a large neck", w: 1 },
      { id: "osa_comorb", t: "Hypertension (especially treatment-resistant), type 2 diabetes, atrial fibrillation or hypothyroidism", w: 1 },
      { id: "osa_nocturia", t: "Nocturia", w: 1 },
      { id: "osa_tracks", t: "Concentration tracks sleep quality: poor after bad nights, normal after good ones", w: 2 },
      { id: "osa_scores", t: "STOP-Bang intermediate or high risk, or Epworth above 10", w: 2 },
      { id: "osa_sedatives", t: "Evening alcohol, sedatives or opioids", w: 1 },
      { id: "osa_study", t: "Sleep study confirms moderate or severe OSA", w: 2 },
      { id: "osa_cpap", t: "Attention and memory problems resolved with effective treatment and good CPAP adherence", w: 3 }
    ],
    screen: ["stopbang", "epworth"],
    investigations: [
      "Sleep history, ideally with a bed partner, when 2 or more suspicious features are present; NICE lists cognitive dysfunction or memory impairment and sleep fragmentation or insomnia among them (NICE NG202 1.1.1)",
      "Epworth Sleepiness Scale for sleepiness, and consider STOP-Bang as well (NG202 1.1.3). Do not use the Epworth alone to decide on referral, because not everyone with OSA is sleepy (NG202 1.1.4)",
      "BMI, neck circumference and blood pressure; look at the upper airway (tonsils, nasal blockage, jaw)",
      "Bloods if indicated: thyroid function, HbA1c, full blood count",
      "Referral to a sleep service; include assessment scores, how sleepiness affects the person, comorbidities and occupational risk (NG202 1.2.1)",
      "Home respiratory polygraphy is the first-line test; home oximetry if access is limited; polysomnography if tests are negative but symptoms continue (NG202 1.3.1-1.3.5)",
      "After a period of good treatment adherence, repeat ADHD symptom ratings and review the interview findings (clinical practice)"
    ],
    redFlags: [
      "Dozing or near misses while driving: advise not to drive while sleepy, and give information on DVLA guidance on excessive sleepiness and when the person must notify the DVLA (NG202 4.1.1)",
      "Vocational driver or safety-critical job: the sleep service should prioritise rapid assessment (NG202 1.2.2)",
      "Pregnancy, unstable cardiovascular disease or planned major surgery with suspected OSA (NG202 1.2.2)",
      "BMI 30 or more with OSA features or signs of night-time hypoventilation (waking headaches, ankle swelling, oxygen saturation below 94% on air, unexplained polycythaemia): assess for obesity hypoventilation syndrome (NG202 2.1.1)",
      "Plans to start a stimulant in someone with untreated suspected OSA: stimulants can mask sleepiness while the airway problem continues (clinical practice)"
    ],
    decide: {
      better: "OSA better explains the picture when attention and memory problems began in adulthood together with the sleep symptoms, there is no credible childhood history from the person or an informant, and the problems resolve or clearly improve with effective treatment.",
      both: "Diagnose both when ADHD symptoms and impairment were present from childhood, before any snoring or weight gain, and core ADHD features (distractibility while alert, restlessness, impulsivity) persist once OSA treatment is established.",
      next: "If OSA is suspected and the childhood history is unclear, refer to the sleep service and defer the ADHD conclusion; reassess after a period of effective treatment. If childhood ADHD is clear, ADHD can be diagnosed now: record OSA as a coexisting condition, treat both, and agree medicine timing with the sleep team."
    },
    pearls: [
      "Ask 'sleepy or distracted?' People with OSA describe heavy eyes and nodding off; people with ADHD describe the mind leaving the task while they are wide awake.",
      "NICE NG202 1.1.1 lists cognitive dysfunction or memory impairment and sleep fragmentation or insomnia among features that should prompt a sleep history. Many people referred to an ADHD clinic qualify, so ask the OSA questions routinely.",
      "A low Epworth score does not rule OSA out (NG202 1.1.4). Some people report tiredness, poor sleep or low mood rather than sleepiness.",
      "Treatment response is informative. All six interventional studies in Youssef et al. (2011), mostly small and in children, reported better attention after OSA treatment. Full resolution supports 'better explained by OSA'; partial improvement with persisting childhood-onset symptoms supports both.",
      "Ask about childhood snoring, mouth breathing and tonsil or adenoid surgery too. Childhood OSA can itself cause inattention and hyperactivity, so a 'childhood history' of ADHD symptoms in a child who snored needs careful reading (clinical practice).",
      "Get the bed partner's account. People rarely know that they stop breathing.",
      "Evening alcohol, which many adults with ADHD use to switch off, worsens snoring and apnoeas. NICE advises avoiding alcohol excess and sedatives before sleep (NG202 4.1.1).",
      "Stimulants can hide OSA sleepiness. Ask about snoring and apnoeas before starting medicine and again if a good response fades (clinical practice)."
    ],
    refs: [
      "NICE NG202 (2021). Obstructive sleep apnoea/hypopnoea syndrome and obesity hypoventilation syndrome in over 16s: recs 1.1.1-1.1.4, 1.2.1-1.2.2, 1.3.1-1.3.6, 4.1.1.",
      "Youssef NA, Ege M, Angly SS, Strauss JL, Marx CE. Is obstructive sleep apnea associated with ADHD? Ann Clin Psychiatry 2011;23:213-24.",
      "Chung F et al. STOP questionnaire. Anesthesiology 2008;108:812-21; STOP-Bang scoring from stopbang.ca (licence restricted).",
      "Johns MW. A new method for measuring daytime sleepiness: the Epworth Sleepiness Scale. Sleep 1991;14:540-5. Scores above 10 indicate excessive daytime sleepiness (author's bands); licence via Mapi Research Trust.",
      "WHO ICD-11 CDDR 6A05: boundary with attentional symptoms due to other medical conditions, including sleep-wake disorders.",
      "CADDRA Canadian ADHD Practice Guidelines 4.1: obstructive sleep apnoea and sleep deprivation as mimics.",
      "RCPsych CR235 (2023) 9.7.7 and 15.3."
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Insomnia                                                            */
  /* ------------------------------------------------------------------ */
  {
    id: "insomnia",
    name: "Chronic insomnia disorder",
    group: "sleep",
    core: true,
    icd11: "7A00 (chronic insomnia); 7A01 (short-term insomnia)",
    summary: "Persistent difficulty getting to sleep, staying asleep or waking too early despite enough opportunity to sleep, with daytime effects such as fatigue, poor concentration and irritability. Chronic means several nights a week for at least 3 months (DSM-5-TR and ICD-11, paraphrased). Insomnia is very common in adults with ADHD and usually coexists; the key judgement is whether daytime attention problems simply follow short sleep or were present before it and persist when sleep is good.",
    prevalence: "Insomnia in 66.8% of 268 adults with ADHD vs 28.8% of population controls, more often in the combined presentation (Brevik et al. 2017; cited in RCPsych CR235 15.1). Sleep-onset insomnia in 31 of 40 adults with ADHD in one clinic sample (Van Veen et al. 2010).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed, and often are. Insomnia disorder is diagnosed when the complaint is persistent, impairs daytime function and is not better explained by another sleep or mental disorder. ADHD needs childhood-onset symptoms that are not confined to periods of poor sleep (DSM-5-TR criterion E; ICD-11 lists sleep-wake disorders among causes of attentional symptoms). CR235 lists initial insomnia among the additional features of adult ADHD, so the insomnia may be part of the ADHD picture rather than a separate cause.",
    overlap: [
      "Daytime poor concentration, mind wandering and forgetfulness",
      "Irritability and low frustration tolerance",
      "Fatigue and low drive that look like procrastination",
      "Difficulty getting up and lateness",
      "Racing thoughts at night",
      "Using caffeine, alcohol, cannabis or screens to manage sleep",
      "Low mood and worry about performance"
    ],
    favoursADHD: [
      "Daytime inattention, restlessness and impulsivity date from childhood, before the sleep problem began",
      "Daytime symptoms persist after good nights, at weekends and on holidays",
      "Lifelong trouble settling to sleep, with bedtime battles or a busy head reported in childhood",
      "Night-time thoughts are many and unrelated (ideas, plans, songs, replaying the day), not worry about one theme",
      "Bedtime slips because they get absorbed in screens or tasks, rather than lying awake trying to sleep",
      "Impulsivity and hyperactivity that sleep loss does not explain",
      "An informant describes the same daytime pattern in childhood"
    ],
    favoursAlt: [
      "Clear onset with a trigger (stress, bereavement, shift work, a new baby, illness, a new medicine), with daytime problems starting at the same time",
      "Daytime concentration is normal after good nights and clearly worse after bad ones",
      "Conditioned arousal: wide awake in bed but able to doze on the sofa",
      "Worry about sleep itself and its consequences, with clock watching",
      "Mainly frequent or early waking rather than delayed sleep onset",
      "No credible childhood history of daytime ADHD symptoms",
      "Daytime function recovers after CBT for insomnia or sleep scheduling",
      "Shift work, night work or frequent long-haul travel",
      "Caffeine, alcohol, nicotine or cannabis explain the pattern",
      "Depression, anxiety, PTSD nightmares, pain, menopause or nocturia drive the sleep loss"
    ],
    ask: [
      "What time do you go to bed, when do you fall asleep and when do you get up, on work days and on free days?",
      "How long does it take you to fall asleep? What goes through your mind while you lie there?",
      "Is it lots of different thoughts jumping around, worry about one or two things, or worry about not sleeping?",
      "Do you wake in the night or very early and then can't get back to sleep?",
      "When did the sleep problem start? Was there a trigger?",
      "Were concentration and restlessness problems there at primary school, before you had trouble sleeping?",
      "After a good night's sleep, how is your concentration? Are you still easily distracted and disorganised?",
      "On holiday, when you can sleep as long as you like, do the daytime problems go away?",
      "Do you put off going to bed because you are absorbed in your phone, a game or a task?",
      "How much caffeine, energy drinks, alcohol, nicotine or cannabis do you use, and at what times?",
      "Do you work shifts or nights?",
      "Do you nap in the day? Do you feel sleepy, or tired but wired?",
      "Does anything else keep you awake: pain, needing the toilet, hot flushes, uncomfortable legs, a baby, noise?",
      "Have you had treatment for sleep, such as CBT for insomnia, melatonin or sleeping tablets? What changed in the daytime?",
      "How has your mood been? Have you lost interest in things?",
      "Do you take any medicines in the afternoon or evening, such as stimulants, decongestants, steroids or some antidepressants?",
      "(Parent) As a child, did they have trouble settling at night, and were they restless and distractible in the day as well?"
    ],
    features: [
      { id: "insomnia_trigger", t: "Clear trigger at onset (stress, bereavement, shift work, illness, new medicine)", w: 2 },
      { id: "insomnia_adultonset", t: "Daytime attention problems began with the insomnia in adulthood; no credible childhood history", w: 3 },
      { id: "insomnia_tracks", t: "Daytime concentration normal after good nights, poor after bad nights", w: 3 },
      { id: "insomnia_holiday", t: "Daytime symptoms resolve on holidays or when sleep is extended", w: 3 },
      { id: "insomnia_worry", t: "Pre-sleep thoughts are worry about sleep or one stressor rather than many unrelated thoughts", w: 2 },
      { id: "insomnia_conditioned", t: "Conditioned arousal: alert in bed, falls asleep easily elsewhere", w: 1 },
      { id: "insomnia_maint", t: "Mainly frequent or early waking rather than delayed sleep onset", w: 1 },
      { id: "insomnia_cbti", t: "Daytime functioning recovered after CBT for insomnia or sleep scheduling", w: 3 },
      { id: "insomnia_subst", t: "Caffeine, alcohol, nicotine or cannabis pattern explains the poor sleep", w: 1 },
      { id: "insomnia_driver", t: "Depression, anxiety, pain, menopause or another condition drives the sleep loss", w: 1 },
      { id: "insomnia_shift", t: "Shift work or irregular schedules", w: 1 },
      { id: "insomnia_isi", t: "Insomnia Severity Index 10 or more (community cut-off, Morin et al. 2011)", w: 1 }
    ],
    screen: ["isi", "phq9", "gad7", "auditc"],
    investigations: [
      "Sleep diary for 1-2 weeks covering work days and free days",
      "Actigraphy if available: adults with ADHD differ from controls on actigraphic sleep-onset latency and efficiency but not on polysomnography (Díaz-Román et al. 2018), so polysomnography is rarely needed for insomnia alone (clinical practice)",
      "Insomnia Severity Index; Epworth if the complaint is sleepiness rather than tiredness",
      "Medicine and substance review: caffeine, alcohol, nicotine, cannabis, decongestants, steroids, activating antidepressants, stimulant dose and timing",
      "Screen for drivers: depression, anxiety, PTSD and nightmares, pain, menopause, nocturia, restless legs, OSA",
      "Bloods only if indicated, for example thyroid function for thyroid symptoms or ferritin for restless legs",
      "CBT for insomnia (digital or face to face) through primary care or local services; sleep clinic if a primary sleep disorder is suspected or treatment fails"
    ],
    redFlags: [
      "Sleepiness with unintended dozing rather than tiredness: look for OSA, narcolepsy or insufficient sleep",
      "Insomnia with low mood, hopelessness or suicidal thoughts: assess mood and risk the same day",
      "Very little sleep with high energy and no tiredness: think hypomania or mania, not insomnia",
      "Escalating use of alcohol, cannabis, sedatives or over-the-counter sleep aids",
      "Drowsy driving after poor nights",
      "New insomnia after starting or increasing a stimulant: review dose and timing"
    ],
    decide: {
      better: "Insomnia better explains the picture when daytime inattention began with the sleep problem in adulthood, there is no credible childhood history, and daytime function returns to normal when sleep is good (holidays, after CBT for insomnia).",
      both: "Diagnose both when childhood-onset ADHD symptoms are established and daytime symptoms persist after good nights. Most adults with ADHD and insomnia fall here, and the insomnia often reflects a busy mind and a delayed body clock.",
      next: "If unclear, use a 2-week sleep diary, treat the insomnia (sleep hygiene, CBT for insomnia, caffeine, alcohol and medicine timing) and reassess daytime symptoms. If ADHD is diagnosed, treat both: CBT for insomnia is the standard first treatment for long-term insomnia (NICE TA922), and CR235 advises taking long-acting stimulants early in the morning."
    },
    pearls: [
      "Ask what the mind does at night. A crowd of unrelated thoughts fits ADHD; looping worry fits anxiety; dread of not sleeping fits insomnia disorder (clinical practice; CADDRA describes ADHD sleep-onset difficulty as thoughts that will not switch off).",
      "The holiday test is one of the most useful questions: 'After a week of good sleep, are you still disorganised and distractible?'",
      "Choose the right measure. Adults with ADHD differ from controls on subjective and actigraphic sleep measures but not on polysomnography (Díaz-Román et al. 2018), so use diaries and actigraphy rather than a sleep study.",
      "Stimulants do not always worsen sleep. In Brevik et al. (2017, cross-sectional), adults taking stimulants reported lower insomnia scores than those not on medicine.",
      "When scoring PHQ-9, ASRS or interview items, ask whether the symptom is present on well-rested days; do not count tiredness from short sleep as ADHD.",
      "Self-medication is common: alcohol and cannabis shorten sleep onset but fragment sleep and worsen daytime attention.",
      "CR235 suggests considering continuing melatonin into adulthood in people who used it as children (15.1)."
    ],
    refs: [
      "Brevik EJ et al. Prevalence and clinical correlates of insomnia in adults with ADHD. Acta Psychiatr Scand 2017;136:220-7.",
      "Van Veen MM et al. Delayed circadian rhythm in adults with ADHD and chronic sleep-onset insomnia. Biol Psychiatry 2010;67:1091-6.",
      "Díaz-Román A, Mitchell R, Cortese S. Sleep in adults with ADHD: systematic review and meta-analysis of subjective and objective studies. Neurosci Biobehav Rev 2018;89:61-71.",
      "RCPsych CR235 (2023) sections 9.3 and 15.1.",
      "NICE TA922 (2023) Daridorexant for treating long-term insomnia: CBTi is the standard first treatment after sleep hygiene advice.",
      "Morin CM et al. The Insomnia Severity Index. Sleep 2011;34:601-8 (licence via Mapi Research Trust).",
      "Kooij JJS et al. Updated European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34, section 7.5.5.",
      "APA DSM-5-TR (2022) insomnia disorder; WHO ICD-11 7A00 (paraphrased)."
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Delayed sleep-wake phase disorder                                   */
  /* ------------------------------------------------------------------ */
  {
    id: "dsps",
    name: "Delayed sleep-wake phase disorder (delayed sleep phase syndrome)",
    group: "sleep",
    core: false,
    icd11: "7A60",
    summary: "A circadian rhythm disorder in which the body clock runs late. The person cannot fall asleep until well after a conventional bedtime and struggles to wake for morning commitments, but sleeps normally when allowed to keep their own late schedule. A delayed sleep phase is common in adults with ADHD and is often part of the ADHD picture; the sleep debt it causes can mimic or worsen daytime inattention.",
    prevalence: "Kooij et al. (2019) state that in the majority of cases ADHD in children and adults is associated with a circadian rhythm disorder with delayed sleep onset. In one clinic sample, 31 of 40 adults with ADHD had sleep-onset insomnia with delayed dim-light melatonin onset (Van Veen et al. 2010). The rate of formally diagnosed delayed sleep-wake phase disorder in adult ADHD clinics is not established.",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. A late body clock is so common in ADHD that it is usually recorded as coexisting rather than as an alternative. The sleep disorder alone better explains the picture only when daytime attention problems are confined to periods of enforced early rising, disappear when the person sleeps on their own schedule, and there is no childhood-onset ADHD history (DSM-5-TR criterion E; ICD-11 boundary with sleep-wake disorders).",
    overlap: [
      "Lateness, missed mornings and poor time-keeping",
      "Morning inattention, slowness and forgetfulness from sleep debt",
      "Difficulty falling asleep at a conventional bedtime",
      "Evening energy and productivity ('night owl')",
      "Irritability and low mood from chronic short sleep",
      "Problems at school, college or work with early starts",
      "Long lie-ins at weekends"
    ],
    favoursADHD: [
      "Inattention, disorganisation and impulsivity all day, including the afternoon and evening when the person feels most alert",
      "Symptoms persist when the person sleeps on their own schedule (holidays, late shifts, self-employment)",
      "Childhood reports of distractibility and restlessness in class, not just morning tiredness",
      "Disorganisation in tasks unrelated to time of day: paperwork, losing things, unfinished projects",
      "Restlessness and impulsivity that tiredness does not explain",
      "Bedtime also slips through hyperfocus or poor planning, not only because sleep will not come",
      "Lateness and poor time-keeping at any time of day, including afternoon and evening commitments"
    ],
    favoursAlt: [
      "Sleep is of normal length and quality on a self-chosen late schedule",
      "Daytime function is normal when sleep timing fits the body clock (holidays, late-start work)",
      "Problems are confined to mornings and early starts",
      "Late timing began in adolescence, with no daytime ADHD features in childhood",
      "Sleep timing is regular, just shifted late (for example asleep at 3am, awake at 11am)",
      "A sleep diary or actigraphy shows a stable, consistently delayed sleep period",
      "Full daytime recovery with correctly timed melatonin, morning light and fixed wake times",
      "Family members with a similar late body clock"
    ],
    ask: [
      "If you had no work or commitments for two weeks, what time would you naturally fall asleep and wake up?",
      "On those free days, do you sleep well and wake feeling refreshed?",
      "Once you have slept on your own schedule for a while, are you still easily distracted, disorganised and restless?",
      "Are the problems mainly in the morning, or all day, including the evening when you feel most awake?",
      "Have you always been a night owl? Since when: childhood, your teens or later?",
      "At night, are you lying awake unable to sleep, or up doing things because you are not tired or got absorbed?",
      "If you go to bed at a conventional time, how long does it take to fall asleep?",
      "How hard is it to get up for work or study? Do you sleep through alarms?",
      "How much longer do you sleep at weekends than on work days?",
      "Did your teachers or parents mention distractibility or restlessness in class, not just tiredness?",
      "How much screen use, gaming or caffeine is there in your evening?",
      "Have you tried melatonin or morning light? What happened to your daytime concentration?",
      "Do you work shifts, or does your work suit a late schedule?",
      "Does anyone in your family have a similar late body clock?",
      "(Partner or parent) When they are allowed to sleep late, are they still disorganised and forgetful through the day?"
    ],
    features: [
      { id: "dsps_freesleep", t: "Normal sleep length and quality on a self-chosen late schedule", w: 2 },
      { id: "dsps_freeday", t: "Daytime function normal when sleep fits the body clock (holidays, late-start work)", w: 3 },
      { id: "dsps_morning", t: "Problems confined to mornings and early starts", w: 2 },
      { id: "dsps_stable", t: "Sleep diary or actigraphy shows a stable, consistently delayed sleep period", w: 2 },
      { id: "dsps_nochild", t: "No childhood daytime ADHD features; only morning tiredness or lateness", w: 3 },
      { id: "dsps_melatonin", t: "Full daytime recovery after correctly timed melatonin or morning light", w: 3 },
      { id: "dsps_teen", t: "Late sleep timing began in adolescence", w: 1 },
      { id: "dsps_family", t: "Family members with a similar late body clock", w: 1 },
      { id: "dsps_bedawake", t: "Lies awake at a conventional bedtime but falls asleep quickly at the preferred late time", w: 1 },
      { id: "dsps_noimpuls", t: "No restlessness or impulsivity beyond what tiredness explains", w: 2 },
      { id: "dsps_punctual_pm", t: "Late only for morning commitments; on time for afternoon and evening ones", w: 2 }
    ],
    screen: ["isi", "epworth"],
    investigations: [
      "Sleep diary for at least 2 weeks including free days: bedtime, sleep onset, waking, naps, caffeine, screens",
      "Actigraphy where available; in adult ADHD it detects differences from controls that polysomnography does not (Díaz-Román et al. 2018)",
      "Chronotype questionnaires (for example MEQ or MCTQ) as an adjunct; licences vary",
      "Dim-light melatonin onset (DLMO) only in specialist or research settings (Van Veen et al. 2010)",
      "Review evening light, screens, caffeine, alcohol, cannabis and stimulant timing",
      "Sleep clinic referral if the pattern is severe or atypical, or does not respond to melatonin, light and scheduling"
    ],
    redFlags: [
      "Driving while severely sleep-deprived after early starts",
      "Irregular or steadily drifting sleep timing, especially with visual impairment or neurological illness: refer to a sleep service (clinical practice)",
      "A sudden shift to late nights with high energy and little need for sleep: think hypomania",
      "Job or course at risk because of missed mornings: offer practical support and reasonable adjustments"
    ],
    decide: {
      better: "Delayed sleep-wake phase disorder better explains the picture when daytime problems are confined to early starts and sleep debt, function is normal on a body-clock-friendly schedule, and there is no credible childhood history of daytime ADHD symptoms.",
      both: "Diagnose both when childhood-onset ADHD symptoms are present all day and across tasks, and persist when sleep timing fits the body clock. This is the usual situation; the delayed phase is then managed as part of the person's ADHD sleep profile.",
      next: "Use a sleep diary over work and free days. If ADHD is unclear, try correctly timed melatonin, morning light and a fixed wake time, then reassess. If ADHD is diagnosed, treat both and time ADHD medicine to protect sleep, for example a long-acting stimulant as early as possible in the morning (CR235 15.1, 15.3)."
    },
    pearls: [
      "The free-schedule question separates the two best: 'When you sleep on your own clock, are you still distracted and disorganised?'",
      "A night owl who sleeps 8 good hours from 3am has a timing problem, not insomnia. Morning lateness on its own is weak evidence for ADHD.",
      "Van Veen et al. (2010) found delayed melatonin onset in adults with ADHD and sleep-onset insomnia, which supports a body-clock contribution to ADHD sleep problems.",
      "Ask why bedtime is late. 'I can't sleep' (body clock), 'I lose track of time' (hyperfocus) and 'it is the only time I get to myself' need different advice (clinical practice).",
      "Melatonin timing for a late body clock differs from its use as a sleep aid: to shift the clock it is usually given in a low dose several hours before the habitual sleep time, with bright light soon after waking. Use for a delayed body clock is off-label in UK adults; follow sleep-service or specialist pharmacy advice (clinical practice).",
      "CR235 defines delayed sleep phase as sleep delayed by 2 hours or more beyond a conventional bedtime, notes it is more common in adolescents, and lists melatonin, light therapy and chronotherapy as options (15.2)."
    ],
    refs: [
      "Kooij JJS et al. Updated European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34, section 7.5.5.",
      "Van Veen MM et al. Delayed circadian rhythm in adults with ADHD and chronic sleep-onset insomnia. Biol Psychiatry 2010;67:1091-6.",
      "RCPsych CR235 (2023) sections 15.1-15.3.",
      "Díaz-Román A, Mitchell R, Cortese S. Neurosci Biobehav Rev 2018;89:61-71.",
      "WHO ICD-11 7A60 Delayed sleep-wake phase disorder; APA DSM-5-TR circadian rhythm sleep-wake disorders, delayed sleep phase type (paraphrased)."
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Narcolepsy and central hypersomnolence                              */
  /* ------------------------------------------------------------------ */
  {
    id: "narcolepsy",
    name: "Narcolepsy and other central disorders of hypersomnolence",
    group: "sleep",
    core: false,
    icd11: "7A20 (narcolepsy); 7A21 (idiopathic hypersomnia)",
    summary: "Disorders of the brain's sleep-wake control that cause excessive daytime sleepiness despite enough night sleep. Narcolepsy type 1 (loss of hypocretin/orexin) usually includes cataplexy, a brief loss of muscle tone triggered by emotion; type 2 and idiopathic hypersomnia do not. Sleepiness, 'brain fog' and automatic behaviour can look like inattentive ADHD, and ADHD traits are also common in people with these disorders.",
    prevalence: "Not established in adult ADHD. In the reverse direction, 24% of adults with narcolepsy type 1, type 2 or idiopathic hypersomnia had ADHD traits on the ASRS vs 7% of controls, mainly inattentive (Takagi et al. 2026). Narcolepsy itself is rare.",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. Inattention caused by sleepiness should not be counted towards ADHD (DSM-5-TR criterion E; ICD-11 boundary with sleep-wake disorders). Diagnose ADHD as well only when childhood-onset inattention, and any hyperactivity or impulsivity, are established independently of the sleepiness. Takagi et al. (2026) found that ADHD traits added little to functional impact once sleepiness and distress were accounted for, so manage the hypersomnolence first.",
    overlap: [
      "Poor sustained attention and 'brain fog'",
      "Drifting off in lectures and meetings, which looks like daydreaming",
      "Automatic behaviour: carrying on a task without awareness and making errors",
      "Forgetfulness and losing track of conversations",
      "Low motivation and underachievement at school or work",
      "Irritability and mood changes",
      "Fragmented night sleep",
      "Onset can fall in late childhood or adolescence, inside the ADHD age window"
    ],
    favoursADHD: [
      "Inattention is present when the person is fully alert, including in stimulating situations",
      "Attention is pulled away by surroundings and other thoughts rather than lost to drowsiness",
      "Prominent hyperactivity, restlessness or impulsivity",
      "Sleepiness is mainly boredom-related and alertness returns quickly with stimulation or movement",
      "Childhood reports describe distractibility and restlessness, not falling asleep in class",
      "No cataplexy, sleep paralysis or vivid hallucinations at sleep onset or waking",
      "MSLT mean sleep latency above 8 minutes with fewer than 2 sleep-onset REM periods. As a group, adults with ADHD referred for MSLT had longer latencies than sleepy patients without ADHD (Uchida et al. 2026)"
    ],
    favoursAlt: [
      "Irresistible sleep attacks, including in stimulating situations (talking, eating, driving)",
      "Cataplexy: knees buckle, jaw drops or face sags with laughter, surprise or anger, with awareness kept",
      "Sleep paralysis on waking or falling asleep",
      "Vivid dream-like hallucinations at sleep onset or on waking",
      "Short naps are refreshing (narcolepsy); or long unrefreshing naps with severe grogginess on waking (idiopathic hypersomnia)",
      "Disrupted night sleep despite severe daytime sleepiness",
      "Sleepiness began in adolescence or adulthood as a clear change from before",
      "Epworth score above 10 that persists despite enough sleep",
      "Overnight polysomnography then MSLT: mean sleep latency 8 minutes or less with 2 or more sleep-onset REM periods (narcolepsy); fewer than 2, or a very long 24-hour sleep time, in idiopathic hypersomnia (ICSD-3-TR)",
      "Sleepiness persists after insufficient sleep, OSA, depression and sedating medicines are excluded"
    ],
    ask: [
      "Do you ever fall asleep when you don't want to, even when you are active, such as talking, eating or driving?",
      "When you lose focus, do you feel drowsy, or are you wide awake but distracted?",
      "When you laugh, are surprised or get angry, do your knees, jaw, face or neck ever go weak?",
      "Have you ever woken up and been unable to move for a few seconds or minutes?",
      "As you fall asleep or wake up, do you see, hear or feel very vivid, dream-like things?",
      "If you take a short nap, do you wake refreshed or groggy?",
      "How do you sleep at night? Do you wake often?",
      "Do you ever carry on doing something, like writing or driving, and have no memory of it afterwards?",
      "When did the sleepiness start? Was it there at primary school, or did it begin later?",
      "Were teachers worried that you were sleepy, or that you were restless and distracted?",
      "If something exciting happens, does the sleepiness go away completely?",
      "How many hours do you sleep on average, including weekends?",
      "Do you take any sedating medicines, antihistamines, cannabis or alcohol?",
      "Have you had a head injury or any other neurological symptoms?",
      "Does your job involve driving or safety-critical work?",
      "(Partner or family) Have you seen them suddenly go limp, or their face droop, when they laugh?"
    ],
    features: [
      { id: "narcolepsy_attacks", t: "Irresistible sleep attacks, including during activity", w: 3 },
      { id: "narcolepsy_cataplexy", t: "Cataplexy: emotion-triggered muscle weakness with awareness kept", w: 3 },
      { id: "narcolepsy_paralysis", t: "Recurrent sleep paralysis", w: 1 },
      { id: "narcolepsy_halluc", t: "Hallucinations at sleep onset or on waking", w: 1 },
      { id: "narcolepsy_naps", t: "Short naps are refreshing", w: 2 },
      { id: "narcolepsy_drowsy", t: "Attention lapses are drowsy rather than distracted", w: 2 },
      { id: "narcolepsy_onset", t: "Sleepiness began in adolescence or adulthood as a change from before", w: 2 },
      { id: "narcolepsy_ess", t: "Epworth above 10 despite enough sleep time", w: 2 },
      { id: "narcolepsy_automatic", t: "Automatic behaviour with no memory of the episode", w: 1 },
      { id: "narcolepsy_night", t: "Fragmented night sleep with severe daytime sleepiness", w: 1 },
      { id: "narcolepsy_mslt", t: "Polysomnography and MSLT confirm a central hypersomnia", w: 3 },
      { id: "narcolepsy_nochild", t: "No childhood history of distractibility, restlessness or impulsivity", w: 3 }
    ],
    screen: ["epworth", "phq9"],
    investigations: [
      "Epworth Sleepiness Scale and a 2-week sleep diary to exclude insufficient sleep",
      "Exclude commoner causes first: insufficient sleep, OSA, depression, sedating medicines, alcohol and cannabis",
      "Bloods for fatigue if indicated: thyroid function, full blood count, ferritin",
      "Referral to a specialist sleep centre (neurology or respiratory sleep services) for polysomnography followed by a multiple sleep latency test (MSLT)",
      "Stimulants, antidepressants and other medicines can change MSLT results; the sleep centre will advise on any changes before testing",
      "CSF hypocretin (orexin) measurement in specialist centres when the diagnosis remains uncertain"
    ],
    redFlags: [
      "Falling asleep while driving or in a safety-critical role: advise not to drive and give DVLA information on narcolepsy and excessive sleepiness",
      "Cataplexy causing falls or injury",
      "New sleepiness after a head injury or with other neurological signs: neurology referral",
      "Sleepiness with low mood and hopelessness: assess depression and suicide risk"
    ],
    decide: {
      better: "Narcolepsy or another central hypersomnia better explains the picture when inattention occurs mainly when drowsy, began with the sleepiness rather than in early childhood, and there is no independent history of restlessness or impulsivity.",
      both: "Diagnose both when childhood-onset ADHD symptoms, often with hyperactivity or impulsivity, were present before the sleepiness and persist when the person is alert, or when treatment controls the sleepiness but ADHD-type problems remain.",
      next: "Refer to a sleep centre before concluding on ADHD if there are sleep attacks, cataplexy or a high Epworth despite enough sleep. Reassess ADHD once the hypersomnia is treated. Both conditions may be treated with stimulants, so coordinate medicines with the sleep team."
    },
    pearls: [
      "Cataplexy is the most specific clue. Ask about weakness with laughter directly; few people volunteer it.",
      "Ask 'drowsy or distracted?' Sleepy people lose focus with heavy eyes; people with ADHD lose focus while alert.",
      "Subjective sleepiness can mislead in ADHD. Adults with ADHD referred for MSLT had Epworth scores similar to sleepy patients without ADHD, but longer sleep latency and fewer positive tests (61.8% vs 87.1%; Uchida et al. 2026). Most of the ADHD group still had a short latency, so a short latency alone does not confirm a central hypersomnia.",
      "Isolated sleep paralysis and hallucinations at sleep onset are common in the general population and after sleep loss. They add weight only alongside persistent daytime sleepiness (clinical practice).",
      "A good response to stimulants or modafinil does not tell the two apart; both improve alertness.",
      "Narcolepsy is often recognised late. Sleepiness at school may have been read as laziness or poor attention, so childhood reports need careful reading (clinical practice).",
      "Plan any ADHD medicine changes with the sleep centre before an MSLT, because some medicines affect the result."
    ],
    refs: [
      "Takagi S et al. Clinical significance of ADHD traits in central disorders of hypersomnolence. J Clin Sleep Med 2026;22:28.",
      "Uchida S et al. Subjective sleepiness and objective sleep propensity in adults with ADHD referred for multiple sleep latency testing. Front Psychiatry 2026;17:1848254.",
      "RCPsych CR235 (2023) section 15.3: narcolepsy can occur comorbidly with ADHD.",
      "WHO ICD-11 7A20, 7A21; CDDR 6A05 boundary with medical conditions including sleep-wake disorders.",
      "APA DSM-5-TR (2022) narcolepsy and hypersomnolence disorder (paraphrased).",
      "Johns MW. A new method for measuring daytime sleepiness: the Epworth Sleepiness Scale. Sleep 1991;14:540-5.",
      "American Academy of Sleep Medicine. International Classification of Sleep Disorders, 3rd edition, text revision (ICSD-3-TR, 2023): MSLT criteria for narcolepsy and idiopathic hypersomnia."
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Restless legs syndrome                                              */
  /* ------------------------------------------------------------------ */
  {
    id: "rls",
    name: "Restless legs syndrome (Willis-Ekbom disease)",
    group: "sleep",
    core: false,
    icd11: "7A80 (restless legs syndrome); 7A81 (periodic limb movement disorder)",
    summary: "A sensorimotor disorder with an urge to move the legs, usually with unpleasant sensations, that starts or worsens at rest, is relieved by movement and is worse in the evening or night. It delays sleep and causes daytime tiredness, and the restlessness can be mistaken for ADHD hyperactivity. It is common in adults with ADHD and usually coexists.",
    prevalence: "RLS symptoms in 20-33% of adults with ADHD (systematic review and meta-analysis of 29 studies; Migueis et al. 2023).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. The 2014 IRLSSG criteria require that the symptoms are not better explained by another condition, and habitual foot tapping is one of the named mimics. Count restlessness towards ADHD only when it is generalised (whole body and mind), present through the day and not tied to rest or evening, with a childhood history. Do not score leg discomfort at rest as hyperactivity.",
    overlap: [
      "Restlessness and fidgeting when sitting",
      "Difficulty sitting through films, meetings, flights or long journeys",
      "Delayed sleep onset",
      "Disturbed sleep and daytime tiredness",
      "Poor concentration from sleep loss",
      "Irritability",
      "A need to get up and move"
    ],
    favoursADHD: [
      "Restlessness is generalised and mental as well as physical: an inner drive, a busy mind, fidgeting hands and feet",
      "Restlessness is there all day, including mornings and busy times, not only at rest in the evening",
      "No unpleasant leg sensations; the urge is to be doing something rather than to move the legs",
      "Restlessness comes with talkativeness, impatience, interrupting and impulsive decisions",
      "Childhood history of being unable to stay seated and always on the go",
      "Boredom, rather than lying down, is the trigger",
      "Moving relieves boredom or inner tension, not a physical discomfort"
    ],
    favoursAlt: [
      "Urge to move the legs, usually with uncomfortable sensations (creeping, crawling, aching, tingling)",
      "Starts or worsens with rest, such as lying or sitting",
      "Partly or fully relieved by walking or stretching, for as long as the movement continues",
      "Worse in the evening or at night, or only present then",
      "Partner reports jerking leg movements in sleep (periodic limb movements)",
      "Iron deficiency or low ferritin, pregnancy, chronic kidney disease or peripheral neuropathy",
      "Started or worsened with antidepressants, sedating antihistamines, antipsychotics or dopamine-blocking anti-sickness medicines",
      "Family history of restless legs",
      "Onset in adulthood with no childhood hyperactivity",
      "Restlessness improves with iron replacement or specific RLS treatment"
    ],
    ask: [
      "Do you get an uncomfortable feeling in your legs, like creeping, crawling, tingling or aching, with an urge to move them?",
      "Is it worse when you sit or lie still, for example in the cinema or in bed?",
      "Does walking or stretching relieve it, at least while you keep moving?",
      "Is it worse in the evening and at night than in the morning?",
      "Is the restlessness mainly in your legs, or is it a whole-body, inner restlessness with a busy mind, all day?",
      "When you are busy in the morning, are you still restless and fidgety?",
      "Has a bed partner noticed your legs kicking or jerking while you are asleep?",
      "When did it start? Were you restless and fidgety as a child, at school and at home?",
      "Have you been told you are low in iron or anaemic? Do you have heavy periods or give blood often?",
      "Are you pregnant, or do you have kidney problems, diabetes or numbness in your feet?",
      "Did it start or get worse after a new medicine, such as an antidepressant, antihistamine or anti-sickness tablet?",
      "Does anyone in your family have restless legs?",
      "How much caffeine, alcohol and nicotine do you use?",
      "Does it stop you getting to sleep, or wake you up?",
      "(Parent or sibling) As a child, were they constantly on the go in the daytime, or only uncomfortable at bedtime?"
    ],
    features: [
      { id: "rls_urge", t: "Urge to move the legs with uncomfortable leg sensations", w: 3 },
      { id: "rls_rest", t: "Starts or worsens at rest", w: 2 },
      { id: "rls_relief", t: "Relieved by movement while the movement continues", w: 2 },
      { id: "rls_evening", t: "Worse, or only present, in the evening or night", w: 2 },
      { id: "rls_legsonly", t: "Restlessness confined to the legs rather than whole-body and mental", w: 3 },
      { id: "rls_plm", t: "Partner reports periodic leg jerks in sleep", w: 1 },
      { id: "rls_iron", t: "Low ferritin or iron deficiency, pregnancy or chronic kidney disease", w: 1 },
      { id: "rls_meds", t: "Onset or worsening with antidepressants, antihistamines, antipsychotics or dopamine-blocking anti-sickness medicines", w: 2 },
      { id: "rls_family", t: "Family history of restless legs", w: 1 },
      { id: "rls_adultonset", t: "Restlessness began in adulthood with no childhood hyperactivity", w: 3 },
      { id: "rls_daytime", t: "Daytime problems limited to tiredness from lost sleep", w: 2 },
      { id: "rls_treat", t: "Restlessness resolved with iron replacement or RLS treatment", w: 3 }
    ],
    screen: [],
    investigations: [
      "Clinical diagnosis using the 2014 IRLSSG essential criteria: urge to move with leg discomfort, worse at rest, relieved by movement, evening or night predominance, not explained by another condition",
      "Bloods: full blood count, ferritin and iron studies, renal function; glucose or HbA1c if neuropathy is suspected",
      "Medicine review for drugs that can provoke or worsen RLS",
      "Neurological examination of the legs for neuropathy or radiculopathy",
      "Sleep study only if periodic limb movement disorder or another sleep disorder is suspected, or the picture is atypical",
      "Most people are managed in primary care; neurology or a sleep clinic if severe, refractory or worsening on treatment"
    ],
    redFlags: [
      "Severe sleep loss with drowsy driving",
      "Iron deficiency anaemia: find the cause, for example heavy periods or gastrointestinal blood loss",
      "Leg weakness, numbness, or one-sided or progressive symptoms: think neuropathy, radiculopathy or another neurological disorder",
      "Symptoms starting earlier in the day or spreading to the arms on dopamine agonist treatment (augmentation): seek specialist advice"
    ],
    decide: {
      better: "RLS better explains the 'restlessness' when it is confined to the legs, comes with leg discomfort, is tied to rest and evening, began in adulthood and resolves with treatment, and there are no other childhood-onset ADHD symptoms.",
      both: "Diagnose both when IRLSSG criteria are met and the person also has childhood-onset, all-day, generalised restlessness and enough other ADHD symptoms. Score hyperactivity items only on restlessness that RLS does not explain.",
      next: "Check ferritin and medicines, treat RLS (iron if deficient, remove provoking medicines, sleep measures), then reassess whether daytime restlessness and inattention persist."
    },
    pearls: [
      "Ask where the restlessness lives. RLS lives in the legs and the evening; ADHD restlessness lives in the whole body and mind, all day.",
      "Ask what moving does. In RLS it relieves a physical discomfort; in ADHD it relieves boredom or inner tension.",
      "Kooij et al. (2019) describe adult ADHD hyperactivity as often inner restlessness and difficulty relaxing; RLS is a specific urge with an evening pattern.",
      "The fifth IRLSSG criterion (added in 2014) excludes mimics such as leg cramps, positional discomfort, muscle pain, venous problems, swelling, arthritis and habitual foot tapping.",
      "Antidepressants, sedating antihistamines and antipsychotics, all common in mental health settings, can trigger or worsen RLS; review them before attributing restlessness to ADHD.",
      "Check ferritin in anyone with RLS symptoms, especially people with heavy periods, a vegetarian or vegan diet or frequent blood donation (clinical practice).",
      "Early-onset RLS is often familial and can start in childhood, where it may have been called 'growing pains' or read as hyperactivity. Bedtime leg discomfort in childhood is not evidence of childhood ADHD (clinical practice)."
    ],
    refs: [
      "Allen RP et al. Restless legs syndrome/Willis-Ekbom disease diagnostic criteria: updated IRLSSG consensus criteria. Sleep Med 2014;15:860-73.",
      "Migueis DP et al. ADHD and restless leg syndrome across the lifespan: a systematic review and meta-analysis. Sleep Med Rev 2023;69:101770.",
      "Kooij JJS et al. Updated European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34, Table 1.",
      "RCPsych CR235 (2023) section 15.3.",
      "WHO ICD-11 7A80, 7A81."
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Psychosis                                                           */
  /* ------------------------------------------------------------------ */
  {
    id: "psychosis",
    name: "Psychotic disorders and the psychosis prodrome (at-risk mental state)",
    group: "psychosis",
    core: false,
    icd11: "6A20-6A25 (schizophrenia or other primary psychotic disorders); substance-induced psychotic disorders, e.g. 6C41.6 (cannabis), 6C46.6 (stimulants); 6E61 (secondary psychotic syndrome)",
    summary: "Schizophrenia, other primary psychotic disorders and substance-induced psychosis cause hallucinations, delusions, disorganised thinking and negative symptoms. The prodrome and early illness can look like new inattention, falling performance, withdrawal, poor sleep and restlessness. Psychotic symptoms are not part of ADHD, and childhood ADHD is itself linked to a higher risk of later psychosis.",
    prevalence: "Norwegian registers: schizophrenia-spectrum diagnoses in 2.5% of women and 4.2% of men with ADHD (Solberg et al. 2018). UK adult neurodevelopmental clinic audit: history of psychosis in 4.6% (Newman 2026, conference abstract, not peer-reviewed). Childhood ADHD is associated with later psychotic disorder (pooled relative effect 4.74, 95% CI 4.11-5.46; Nourredine et al. 2021).",
    coexist: "sometimes",
    coexistNote: "DSM-5-TR criterion E: ADHD is not diagnosed when the symptoms occur only during the course of schizophrenia or another psychotic disorder. ADHD can be diagnosed as well when childhood-onset ADHD symptoms were clearly present before the psychosis and persist outside psychotic episodes. CR235 states that psychotic symptoms are not features of ADHD and represent a comorbid diagnosis. ICD-11 notes that abrupt onset of hyperactivity in adolescence or adulthood may signal an emerging primary psychotic or bipolar disorder.",
    overlap: [
      "Poor concentration and distractibility",
      "Falling performance at school, college or work",
      "Disorganised behaviour and missed commitments",
      "Restlessness and agitation",
      "Social withdrawal and low drive (negative symptoms) that look like procrastination or amotivation",
      "Disrupted sleep and day-night reversal",
      "Racing or crowded thoughts",
      "Heavy cannabis or stimulant use",
      "Tangential speech that can be mistaken for impulsive, jumpy talk"
    ],
    favoursADHD: [
      "Lifelong, stable pattern of symptoms from early childhood",
      "No hallucinations, delusions or formal thought disorder at any point",
      "'Racing thoughts' are many ordinary, unrelated thoughts, with no strange content and no sense of outside control",
      "Talk jumps between topics, but the listener can follow the links and the person can be brought back",
      "Social problems come from impulsivity, forgetting and interrupting, not from suspicion or withdrawal",
      "Functioning has been uneven throughout life rather than falling from a clearly better level",
      "Informants describe the same person since childhood, not a change in personality"
    ],
    favoursAlt: [
      "Hallucinations, especially voices commenting on the person or talking to each other",
      "Delusions or fixed unusual beliefs; suspiciousness and ideas of reference",
      "Thought insertion, withdrawal or broadcast, or feeling controlled from outside",
      "Formal thought disorder: derailed or incoherent speech the listener cannot follow",
      "New decline in functioning in adolescence or adulthood from a previously good level",
      "Abrupt onset of hyperactivity in adolescence or adulthood (ICD-11 CDDR names emerging psychosis), or new inattention with no childhood history",
      "Social withdrawal, flattened affect, poverty of speech or neglected self-care",
      "Perceptual changes: sounds or colours more intense, things seeming strange or specially meaningful",
      "First-degree relative with schizophrenia or another psychosis",
      "Psychotic symptoms during or after heavy cannabis or stimulant use, including prescribed stimulants",
      "Informants describe a change in personality or behaviour over months or years"
    ],
    ask: [
      "Have you ever heard voices or sounds that other people couldn't hear, or seen things that others couldn't see?",
      "Have you felt that people were watching you, following you, talking about you or trying to harm you?",
      "Have you noticed messages meant just for you on TV, online or in things around you?",
      "Have you ever felt that thoughts were being put into your head or taken out, or that others could read your mind?",
      "Has your thinking become muddled in a new way, or have people said they can't follow what you say?",
      "When your thoughts race, what are they about? Do they ever feel as if they are not your own?",
      "Have your concentration problems always been there, or did they start recently along with other changes?",
      "Compared with two years ago, how are you managing at work or study and with looking after yourself?",
      "Have you pulled away from friends or lost interest in things you used to enjoy?",
      "Do sounds, colours or your surroundings seem strangely different, more intense or more meaningful lately?",
      "How much cannabis do you use, what kind (skunk or other high-strength) and how often? Any other drugs, including stimulants?",
      "Have cannabis, stimulants or prescribed ADHD medicine ever made you paranoid or made you hear things?",
      "Has anyone in your family had schizophrenia, psychosis or bipolar disorder?",
      "How has your sleep changed? Are you up at night and asleep in the day?",
      "How distressing are these experiences? Have you had any thoughts of harming yourself or anyone else?",
      "(Informant) Have you noticed any change in their personality, behaviour or functioning over the past year or two?",
      "(Informant) As a child, before any of these changes, were they restless, distractible or impulsive?"
    ],
    features: [
      { id: "psychosis_halluc", t: "Hallucinations, current or past", w: 3 },
      { id: "psychosis_delusions", t: "Delusions, paranoid or referential ideas", w: 3 },
      { id: "psychosis_passivity", t: "Thought insertion, withdrawal or broadcast, or experiences of outside control", w: 3 },
      { id: "psychosis_ftd", t: "Formal thought disorder: speech the listener cannot follow", w: 3 },
      { id: "psychosis_decline", t: "Clear decline from a previously good level of functioning", w: 3 },
      { id: "psychosis_abrupt", t: "Abrupt onset of attention or activity problems in adolescence or adulthood", w: 2 },
      { id: "psychosis_negative", t: "Social withdrawal, flat affect, poverty of speech or neglected self-care", w: 2 },
      { id: "psychosis_perceptual", t: "Recent perceptual changes or a sense that things have special meaning", w: 2 },
      { id: "psychosis_family", t: "First-degree relative with psychosis or schizophrenia", w: 1 },
      { id: "psychosis_substance", t: "Psychotic symptoms with cannabis, stimulants or other drugs", w: 2 },
      { id: "psychosis_informant", t: "Informant describes a change in personality or behaviour", w: 2 },
      { id: "psychosis_nochild", t: "No credible childhood history of ADHD symptoms", w: 2 },
      { id: "psychosis_pq16", t: "PQ-16 positive (6 or more items endorsed)", w: 1 }
    ],
    screen: ["pq16", "dast10", "cssrs"],
    investigations: [
      "Full mental state examination focused on perception, thought form and content, insight and risk",
      "Collateral history from family about change over time and about behaviour in childhood",
      "Urine drug screen when substance-induced psychosis is possible",
      "Physical assessment and bloods to look for secondary causes when indicated; neuroimaging or EEG if there are neurological features or an atypical course (clinical practice)",
      "First presentation of psychosis: refer to an early intervention in psychosis (EIP) service, which should assess without delay (NICE CG178 1.3.1.1-1.3.1.2)",
      "Distress and declining social functioning with transient or attenuated psychotic symptoms, other experiences suggestive of psychosis, or a first-degree relative with psychosis: refer without delay to a specialist mental health service or EIP (NICE CG178 1.2.1.1)",
      "At-risk mental state assessment by a consultant psychiatrist or a trained specialist with experience of at-risk mental states (CG178 1.2.2.1)"
    ],
    redFlags: [
      "Current psychotic symptoms with risk to self or others: same-day crisis or home treatment team response",
      "Command hallucinations, or delusions that involve harming others",
      "Psychotic symptoms after starting or increasing a stimulant: seek urgent psychiatric advice and review the stimulant. New psychosis occurred in about 1 in 660 people aged 13-25 starting prescription stimulants in US insurance data, more often with amphetamine than methylphenidate (Moran et al. 2019)",
      "Heavy high-strength cannabis use with new paranoia",
      "Rapid decline, catatonia, confusion or neurological signs: arrange urgent medical assessment for an organic cause",
      "Do not start ADHD medicine while psychotic symptoms are active or unexplained"
    ],
    decide: {
      better: "Psychosis better explains the picture when attention and activity problems began with, or after, a decline or psychotic symptoms, occur only during psychotic or prodromal periods, or lack a credible childhood history. DSM-5-TR criterion E then excludes ADHD.",
      both: "Diagnose both when childhood-onset ADHD symptoms and impairment are documented well before the psychosis, ideally in school reports or by a parent, and persist when psychotic symptoms are in remission. Agree any ADHD treatment, especially stimulants, with the psychosis team.",
      next: "Pause the ADHD pathway. Refer to EIP or the crisis team for possible first-episode psychosis, or without delay to a specialist service for a possible at-risk mental state (CG178 1.2.1.1). Reassess ADHD when the psychosis is treated and stable, using collateral history from before the onset."
    },
    pearls: [
      "Ask about content, not just speed. Racing thoughts in ADHD are ordinary and plentiful; in psychosis they may feel alien, controlled or loaded with special meaning.",
      "A change, not a trait, is the alarm bell. A student who was well organised until 19 and is now failing, withdrawn and up all night needs a psychosis assessment before an ADHD one.",
      "Cannabis is the common link. Many adults with ADHD use it to calm down, and daily high-potency cannabis is associated with a higher risk of psychotic disorder (Di Forti et al. 2019).",
      "PQ-16 items about distraction by faint sounds and social anxiety can be endorsed for non-psychotic reasons, so a positive screen needs a clinical interview, not a label.",
      "A past ADHD diagnosis does not protect against a new psychotic illness: childhood ADHD is a risk marker for later psychosis (Nourredine et al. 2021).",
      "Negative symptoms (low drive, withdrawal, poverty of speech) are easily mislabelled as inattentive ADHD or depression. Look for flat affect and loss of social interest.",
      "When psychotic symptoms emerge on a stimulant, CR235 advises a careful history of dose changes and treatment start dates to judge whether the medicine triggered them."
    ],
    refs: [
      "APA DSM-5-TR (2022): ADHD criterion E and differential diagnosis (paraphrased).",
      "WHO ICD-11 CDDR 6A05: abrupt onset of hyperactivity in adolescence or adulthood may indicate an emergent primary psychotic or bipolar disorder.",
      "RCPsych CR235 (2023) 9.7.9 Psychotic symptoms.",
      "NICE CG178 (2014) Psychosis and schizophrenia in adults: recs 1.2.1.1, 1.2.2.1, 1.3.1.1-1.3.1.2.",
      "Nourredine M et al. Association of ADHD in childhood and adolescence with the risk of subsequent psychotic disorder. JAMA Psychiatry 2021;78:519-29.",
      "Moran LV et al. Psychosis with methylphenidate or amphetamine in patients with ADHD. N Engl J Med 2019;380:1128-38.",
      "Solberg BS et al. Gender differences in psychiatric comorbidity: 40,000 adults with ADHD. Acta Psychiatr Scand 2018;137:176-86.",
      "Ising HK et al. The 16-item Prodromal Questionnaire (PQ-16). Schizophr Bull 2012;38:1288-96.",
      "Di Forti M et al. Cannabis use and the incidence of psychotic disorder across Europe (EU-GEI). Lancet Psychiatry 2019;6:427-36.",
      "Newman 2026, Brighton and Hove adult neurodevelopmental clinic audit (RCPsych Congress abstract, not peer-reviewed)."
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Normal variation                                                    */
  /* ------------------------------------------------------------------ */
  {
    id: "normal",
    name: "Normal variation in attention and activity (no disorder or sub-threshold traits)",
    group: "other",
    core: false,
    icd11: "None: not a disorder (see ICD-11 CDDR 6A05, boundary with normality)",
    summary: "Inattention, restlessness and impulsivity are dimensional traits that everyone has to some degree, and they increase with tiredness, stress, boredom and constant digital interruption. ADHD is diagnosed only when symptoms are persistent, pervasive, clearly out of keeping with developmental level and at least moderately impairing. Many people who screen positive do not meet these thresholds.",
    prevalence: "In a longitudinal study of people without childhood ADHD, about 95% of those who screened positive for late-onset ADHD symptoms were excluded after full assessment; symptoms more often reflected non-impairing cognitive fluctuations, another disorder or substance use (Sibley et al. 2018). ADHD screening scales have low specificity, so false positives are common in referred populations.",
    coexist: "no",
    coexistNote: "Not a co-diagnosis. Normal variation is the conclusion when symptom counts, pervasiveness, childhood onset or impairment fall short of DSM-5-TR or ICD-11 thresholds; NICE NG87 1.3.3 also requires at least moderate impairment, with symptoms pervasive across 2 or more important settings. Sub-threshold traits can be described in the report. DSM-5-TR other specified ADHD is for clinically significant impairment that falls short of full criteria, not for normal variation. People who fall short of a diagnosis may still benefit from information (NG87 1.4.4).",
    overlap: [
      "Occasional forgetfulness, losing things and missing details",
      "Distraction by phones, notifications and open-plan offices",
      "Putting off dull tasks",
      "Mind wandering in long meetings or lectures",
      "Fidgeting when bored or sitting for a long time",
      "Interrupting or speaking quickly when excited",
      "Attention lapses during stress, overwork, poor sleep or illness",
      "Heavy screen use and difficulty putting the phone down",
      "Strong identification with ADHD content online"
    ],
    favoursADHD: [
      "Symptoms happen most days and clearly more than in peers of the same age, education and job",
      "Present since childhood, with examples from primary school and support from informants or school reports",
      "Pervasive: at home, at work or study and socially, not only in one demanding context",
      "At least moderate impairment, with symptoms in 2 or more important settings (NICE NG87 1.3.3), and concrete consequences such as warnings, lost jobs, debt, accidents or relationship breakdown",
      "Symptoms persist despite good sleep, low stress and good structure",
      "Strategies that work for other people fail, or work only at a high cost in effort",
      "Others have commented on the problems without being asked",
      "First-degree relative with ADHD (raises the prior probability; ADHD is highly heritable)"
    ],
    favoursAlt: [
      "Symptoms are occasional, mild and similar to peers in the same situation",
      "Symptoms appear mainly under unusual demands (exams, a new senior role, a new baby) and settle when demands ease",
      "No meaningful impairment: the person meets deadlines and keeps jobs and relationships with ordinary effort",
      "Symptoms limited to one context, such as dull meetings or one difficult job",
      "No credible childhood history; school reports describe a settled, attentive child",
      "Informants do not recognise the pattern",
      "Concern began with social media content or a self-test rather than with consequences in daily life",
      "Difficulties explained by sleep loss, stress, phone use or lifestyle, and they improve when these change",
      "Informant rating scales near population norms",
      "The only evidence is a positive self-report screen"
    ],
    ask: [
      "How often does this happen: every day, most days, or now and then?",
      "Compared with friends or colleagues doing the same job, is this happening more to you? How do you know?",
      "What has actually gone wrong because of it? Can you give me a recent example and what it cost you?",
      "Have you had warnings at work, failed courses, lost jobs or got into debt because of these problems?",
      "Is it the same at home, at work and with friends, or mainly in one place?",
      "When life is calmer, you are sleeping well and the work is interesting, do the problems go away?",
      "Were you like this at primary school? What did your teachers and parents say about you?",
      "Has anyone else, such as a partner, parent or manager, raised these problems with you without being asked?",
      "What made you seek an assessment now?",
      "How much effort does it take you to keep on top of things compared with other people?",
      "How many hours a day are you on your phone, and does the distraction stop when it is out of reach?",
      "If it turned out not to be ADHD, what else might explain these difficulties?",
      "Is anything going on at the moment, such as stress, illness, caring duties or poor sleep, that is making things harder?",
      "(Informant) Compared with other people their age, do they stand out as more forgetful, distracted or restless?",
      "(Informant) What problems has this caused for them, or for you?"
    ],
    features: [
      { id: "normal_mild", t: "Symptoms occasional and mild, similar to peers", w: 3 },
      { id: "normal_noimpair", t: "No more than mild impairment in any setting", w: 3 },
      { id: "normal_onesetting", t: "Problems confined to one setting or one demanding role", w: 2 },
      { id: "normal_nochild", t: "No credible childhood history; school reports describe a settled, attentive child", w: 3 },
      { id: "normal_noinformant", t: "Informants do not recognise a pattern beyond the ordinary", w: 2 },
      { id: "normal_demand", t: "Symptoms began with a recent rise in demands and ease when demands fall", w: 2 },
      { id: "normal_lifestyle", t: "Explained by sleep loss, stress, screen use or lifestyle, and improves when these change", w: 2 },
      { id: "normal_online", t: "Concern prompted mainly by online content or a self-test, without clear consequences in daily life", w: 1 },
      { id: "normal_cope", t: "Copes with ordinary effort: meets deadlines, keeps jobs and relationships", w: 2 },
      { id: "normal_scales", t: "Informant rating scales near population norms", w: 1 },
      { id: "normal_screenonly", t: "Only evidence is a positive self-report screen", w: 2 }
    ],
    screen: ["asrs18", "wfirs", "wurs25"],
    investigations: [
      "Structured interview of all 18 symptoms, in adulthood and in childhood, with real examples and frequency",
      "Impairment rating across domains (for example WFIRS-S), anchored to concrete consequences",
      "Collateral from a parent, older sibling or someone else who saw them growing up, and school reports where available",
      "Informant rating scales to compare with self-report",
      "Review sleep, stress, workload, screen use and substances; consider a period of changes before concluding",
      "Neuropsychological testing is not diagnostic and is not needed to make this judgement (Kooij et al. 2019)"
    ],
    redFlags: [
      "Distress or low mood about not receiving a diagnosis: assess mood and risk and offer support",
      "Real impairment with sub-threshold symptoms in someone with coexisting conditions: consider other specified ADHD or a planned review rather than 'normal'",
      "A recent change in functioning: look for another cause (mood, sleep, substances, physical illness, life events)",
      "Pressure from others (employer, family, college) for a diagnosis or a prescription"
    ],
    decide: {
      better: "Normal variation is the best explanation when symptoms are not frequent or pervasive enough, are not clearly out of keeping with peers, lack a childhood onset, or cause no more than mild impairment.",
      both: "Not applicable: normal variation and ADHD exclude each other. If impairment is real but full criteria are not met, consider DSM-5-TR other specified ADHD or a planned review, and record the reasons.",
      next: "Explain the findings clearly and kindly: the traits are real but do not amount to a disorder. Give information and practical strategies (NG87 1.4.4), address sleep, stress and workload, and offer a route back if new evidence appears, such as school reports or an informant account."
    },
    pearls: [
      "Everyone recognises ADHD symptoms in themselves. CR235 notes that the core traits are normally distributed and that people who have read about ADHD may endorse most questionnaire items. Frequency, pervasiveness and impairment do the diagnostic work.",
      "Use a peer anchor for every symptom: 'more than other people your age doing the same kind of work?'",
      "Impairment must be shown, not asserted. Ask for the consequence: the warning letter, the failed module, the unpaid fine, the crash.",
      "High achievement does not rule ADHD out (UKAAN AQAS), but it moves the question to cost: how much extra effort, and at what price?",
      "A positive screen is the start, not the end. In Sibley et al. (2018), about 95% of positive late-onset screens did not survive full assessment.",
      "Phones and multitasking cause attention lapses in everyone. Ask whether the problems were there in childhood and whether they continue when the phone is out of reach.",
      "Say what you found, not only what you did not find. A clear formulation of normal traits plus current stressors is a useful outcome."
    ],
    refs: [
      "WHO ICD-11 CDDR 6A05: boundary with normality (threshold).",
      "APA DSM-5-TR (2022): ADHD criteria A-D and other specified ADHD (paraphrased).",
      "NICE NG87 recs 1.3.3 and 1.4.4.",
      "RCPsych CR235 (2023): diagnostic instruments; core symptoms are dimensional and normally distributed.",
      "Sibley MH et al. Late-onset ADHD reconsidered with comprehensive repeated assessments between ages 10 and 25. Am J Psychiatry 2018;175:140-9.",
      "Adamou M et al. UKAAN Adult ADHD Assessment Quality Assurance Standard (AQAS). Front Psychiatry 2024.",
      "Kooij JJS et al. Updated European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34, section 3.3."
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Feigned or exaggerated symptoms                                     */
  /* ------------------------------------------------------------------ */
  {
    id: "feigning",
    name: "Feigned or exaggerated symptoms (malingering, factitious presentation, non-credible reporting)",
    group: "other",
    core: false,
    icd11: "QC30 (malingering; not a mental disorder); 6D50 (factitious disorder imposed on self)",
    summary: "Some people over-report or invent ADHD symptoms, usually for an external incentive such as stimulant medicine, exam or workplace adjustments, benefits or a legal advantage (malingering), and occasionally to take on a sick role (factitious disorder). ADHD symptoms are easy to learn and self-report scales are easy to fake. Non-credible reporting can also reflect distress, low engagement or sincere misattribution, and it occurs in people who do have ADHD, so it is a reason to look harder, not proof of malingering or that ADHD is absent.",
    prevalence: "In adults referred for ADHD assessment, roughly 15-31% show non-credible symptom report or test performance: 31% failed the Word Memory Test (Suhr et al. 2008); 22% showed symptom exaggeration (Marshall et al. 2010); 20.8% showed suspect effort (Marshall et al. 2016); 14.6% of post-secondary students failed a symptom validity test (Harrison and Edwards 2010). In one outpatient sample, 22% had invalid symptom reports and 16% invalid performance, with only 6% invalid on both (Ovsiew et al. 2023).",
    coexist: "sometimes",
    coexistNote: "Feigning and ADHD can coexist: a person with genuine ADHD may exaggerate to make sure they get help. Malingering is not a mental disorder (ICD-11 QC30; DSM-5-TR lists it among other conditions that may be a focus of clinical attention). Factitious disorder is a mental disorder in which deception is not mainly driven by external reward. When validity is in doubt, self-report cannot support the diagnosis on its own; diagnose ADHD only if credible, independent evidence (records, informants, a consistent history) establishes the criteria.",
    overlap: [
      "High symptom counts on self-report scales",
      "Reported childhood difficulties without records",
      "Low scores on attention and memory tests",
      "Requests for stimulant medicine",
      "Requests for exam, study or workplace adjustments",
      "Distress about functioning",
      "Familiarity with the diagnostic criteria (common in genuine patients too)",
      "Disagreement between self-report and informants (also common in genuine ADHD)"
    ],
    favoursADHD: [
      "Rich, specific, personal examples from different stages of life, often told with some embarrassment",
      "School reports or a parent independently describe the pattern",
      "An uneven profile: some symptoms clearly absent, with plausible frequencies",
      "Impairment documented by others (warnings, academic records, driving record, debt)",
      "Coping strategies and their costs described in detail",
      "Consistent account across appointments, questionnaires and informants",
      "Passes validity tests even when attention tests are impaired",
      "Ambivalence about medicine, or more interest in understanding than in a prescription"
    ],
    favoursAlt: [
      "Clear external incentive: stimulant medicine, exam or workplace adjustments, benefits, compensation or a legal case",
      "Endorses almost every symptom at the most severe level",
      "Textbook, criterion-like descriptions with few personal examples, or the exact wording of rating scales",
      "Reports rare or implausible symptoms that are not part of ADHD",
      "Childhood records, school reports and informants contradict the account",
      "Reported severity far exceeds documented functioning (for example high grades and a demanding job with no consequences)",
      "Inconsistent account across appointments, or between questionnaires and interview",
      "Fails performance validity tests (below cut-off or below-chance scores)",
      "Elevated embedded validity indexes on rating scales (for example CAARS 2)",
      "Insists on a specific stimulant or an immediate-release form, asks early for higher doses or reports lost prescriptions",
      "Known stimulant misuse, diversion or selling",
      "Reluctant to allow contact with informants or access to school records, without a clear reason"
    ],
    ask: [
      "What made you decide to seek an assessment now?",
      "What are you hoping will be different after this assessment?",
      "Is there a deadline or decision linked to this, such as exams, a job, a court case or a benefits review?",
      "Can you tell me about a specific time last week when this caused a problem? What exactly happened?",
      "Which of these difficulties do you not have? What are you good at?",
      "In your own words, what were you like at primary school? What would your teachers have said?",
      "Do you have any school reports? Could I speak to a parent or someone else who remembers you growing up?",
      "How did you do in exams and at work? How did you manage it?",
      "Have you read about ADHD or done online tests before coming? What did you find?",
      "Have you ever taken stimulants that were not prescribed for you, for example to study or stay awake? What did they do?",
      "What do you expect ADHD medicine to do for you?",
      "If we found that something other than ADHD explains your difficulties, what would that mean for you?",
      "Has anyone ever asked you for your medicine, or have you ever given or sold medicine to anyone?",
      "Some of your questionnaire answers are higher than the problems you describe day to day. Can you help me understand that?",
      "(Informant) In your own words, what were they like as a child, and what are they like now?",
      "(Informant) Have you seen these problems cause trouble at school, work or home yourself?"
    ],
    features: [
      { id: "feigning_incentive", t: "Clear external incentive (stimulants, adjustments, benefits, legal case)", w: 2 },
      { id: "feigning_all", t: "Endorses almost every symptom at the highest severity", w: 2 },
      { id: "feigning_textbook", t: "Criterion-like, rehearsed descriptions with few personal examples", w: 2 },
      { id: "feigning_rare", t: "Endorses rare or implausible symptoms", w: 2 },
      { id: "feigning_records", t: "Records or informants contradict the account", w: 3 },
      { id: "feigning_function", t: "Reported impairment far exceeds documented functioning", w: 2 },
      { id: "feigning_inconsistent", t: "Inconsistent account across appointments or measures", w: 2 },
      { id: "feigning_pvt", t: "Failed performance validity tests", w: 3 },
      { id: "feigning_belowchance", t: "Below-chance performance on a forced-choice test", w: 3 },
      { id: "feigning_svt", t: "Elevated embedded symptom validity indexes (for example CAARS 2)", w: 2 },
      { id: "feigning_drugseek", t: "Insists on a specific stimulant or immediate-release form, or asks early for dose increases", w: 2 },
      { id: "feigning_diversion", t: "Known stimulant misuse, diversion or selling", w: 2 },
      { id: "feigning_noinformant", t: "Declines informant contact or record access without good reason", w: 1 }
    ],
    screen: ["caars2", "dast10"],
    investigations: [
      "School reports, previous health records and an informant interview before concluding",
      "Compare self-report with informant ratings (for example the CAARS 2 observer form)",
      "Use rating scales with embedded validity indexes where available (CAARS 2 indexes; CAT-A infrequency scale)",
      "Refer to clinical neuropsychology for stand-alone performance validity tests (for example TOMM or the Word Memory Test) and symptom validity tests when concerns persist; rely on 2 or more indicators",
      "Check prescribing history and shared records (for example the Summary Care Record) for previous stimulant prescriptions",
      "Urine drug screen if non-prescribed stimulant use is suspected"
    ],
    redFlags: [
      "Evidence of stimulant diversion or selling: do not prescribe stimulants (consider a non-stimulant if ADHD is confirmed), and consider safeguarding and information-sharing duties",
      "Threats or pressure on the clinician to diagnose or prescribe",
      "Forged or altered documents",
      "Features of factitious disorder (seeking the sick role without external gain): assess for an underlying mental disorder",
      "Risk to self if a diagnosis is not given: assess mood and suicide risk"
    ],
    decide: {
      better: "Feigning best explains the picture when there is a clear incentive, convergent evidence of non-credible reporting (failed validity tests, contradiction by records or informants, implausible or inconsistent symptoms) and no credible independent evidence of ADHD.",
      both: "Record both when credible independent evidence (school reports, informants, a consistent life history) establishes ADHD but current symptoms are exaggerated. Base the diagnosis and severity only on the credible evidence.",
      next: "Do not diagnose on self-report alone. Obtain records and informant accounts, use validity measures and refer for neuropsychological validity testing if needed. Document specific findings neutrally (for example 'the account was not consistent with school reports') rather than stating a motive. Offer feedback and support for any real difficulties."
    },
    pearls: [
      "Feigned ADHD looks like ADHD. Marshall et al. (2016) found that people with suspect effort were nearly indistinguishable from genuine cases on rating scales and interview; 71% would have been diagnosed by interview alone.",
      "Self-report scales are easy to fake (Sollman et al. 2010). Validity rests on independent evidence: records, informants and validity tests.",
      "Symptom validity and performance validity are separate. Ovsiew et al. (2023) found few people invalid on both, so assess both when it matters.",
      "Never rely on one indicator. Combining 2 or more failures keeps specificity high.",
      "CR235 notes that some people rehearse questionnaire answers, but also that ADHD remains under-diagnosed in the UK. Stay curious, not suspicious.",
      "Ask everyone about incentives, neutrally and routinely. It is fairer, and easier, than asking only the people you doubt.",
      "Write behaviourally: describe inconsistencies and test results, not intent. Malingering is a conclusion about motive and needs strong evidence.",
      "CADDRA notes that students may exaggerate to obtain adjustments or stimulants, and reports lifetime non-prescribed stimulant use of 5-43% in students."
    ],
    refs: [
      "RCPsych CR235 (2023) 9.7.8 Abnormal sick role behaviour.",
      "Kooij JJS et al. Updated European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34, section 3.3 (performance validity tests).",
      "Suhr J et al. Arch Clin Neuropsychol 2008;23:521-30.",
      "Marshall P et al. Clin Neuropsychol 2010;24:1204-37.",
      "Marshall PS et al. Psychol Assess 2016;28:1290-302.",
      "Harrison AG, Edwards MJ. Appl Neuropsychol 2010;17:135-43.",
      "Sollman MJ, Ranseen JD, Berry DT. Psychol Assess 2010;22:325-35.",
      "Ovsiew GP et al. Clin Neuropsychol 2023;37:1498-515.",
      "Becke M et al. Non-credible symptom report in adult ADHD: a new validity index embedded in the CAARS. J Neural Transm 2021.",
      "CADDRA Canadian ADHD Practice Guidelines 4.1: post-secondary students and young adults.",
      "WHO ICD-11 QC30 Malingering; CDDR 6D50 boundary with malingering. APA DSM-5-TR (2022) malingering (paraphrased)."
    ]
  }
]);
