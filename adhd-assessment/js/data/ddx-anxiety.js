/* ddx-anxiety: differential diagnosis entries for anxiety, trauma-related and obsessive-compulsive disorders
   (ARCHITECTURE.md section 5.5). Order: gad, social, panic, ptsd, cptsd, ocd. Core (reviewed in every adult
   assessment): gad, ptsd.
   Sources: DSM-5-TR (2022) ADHD criterion E and differential diagnosis sections, and the criteria for each
   condition (paraphrased); WHO ICD-11 CDDR (2024) 6A05 boundaries and 6B00, 6B01, 6B04, 6B20, 6B40, 6B41;
   CADDRA Canadian ADHD Practice Guidelines 4.1 (2020) Table 2.6 and comorbidity sections; Kooij et al. 2019
   European Consensus; RCPsych CR235 (2023) sections 9.7, 10, 11.5 and Table 3; NICE NG87, NG145, NG116, CG113,
   CG159, CG31; Kessler et al. 2006 (NCS-R); Fayyad et al. 2017 (WHO World Mental Health surveys).
   Interview questions are written for this app from the cited discriminating features: they are suggested
   prompts, not a validated interview. Points without a named source are clinical practice. */
AA.add('ddx', [

  /* ------------------------------------------------------------------ Generalised anxiety disorder */
  {
    id: "gad",
    name: "Generalised anxiety disorder",
    group: "anxiety",
    core: true,
    icd11: "6B00",
    summary: "Persistent, excessive and hard-to-control worry about several areas of everyday life, or free-floating apprehension, lasting months, with tension, autonomic arousal, poor concentration, irritability and poor sleep. Four of the six DSM-5-TR associated symptoms (restlessness, poor concentration, irritability, sleep disturbance) also occur in adult ADHD. The key question is what drives the inattention: worry, or a lifelong attentional style.",
    prevalence: "In adults with ADHD: GAD 8.0% and any anxiety disorder 47.1% over 12 months in the US National Comorbidity Survey Replication (Kessler et al. 2006); any anxiety disorder 34.2% in the WHO World Mental Health surveys (Fayyad et al. 2017). CADDRA: up to half of adults with ADHD have a comorbid anxiety disorder. A UK NHS adult ADHD clinic audit recorded GAD in 18.5% of newly diagnosed adults (Newman et al. 2026, conference abstract, not peer-reviewed).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. DSM-5-TR criterion E and ICD-11 require that inattention and restlessness are not better explained by the anxiety: they must not be solely due to anxious preoccupation or occur only in anxiety-provoking situations (ICD-11 6A05 boundary). Realistic worry about repeated ADHD-related failures is not GAD (CADDRA). When GAD is present, check that ADHD symptoms began before it and persist on low-anxiety days.",
    overlap: [
      "Restlessness, feeling keyed up or unable to relax",
      "Poor concentration and the mind going blank, especially under pressure",
      "Irritability and low frustration tolerance",
      "Difficulty falling asleep and unrefreshing sleep",
      "Procrastination and avoidance of tasks (ICD-11 lists procrastination as a GAD behaviour)",
      "Worry about work performance, deadlines and money",
      "Fatigue and feeling overwhelmed by everyday demands",
      "A busy mind described as 'my head never stops'",
      "Reassurance-seeking and repeated checking",
      "GAD-7 items on trouble relaxing, restlessness and irritability are often endorsed in ADHD alone"
    ],
    favoursADHD: [
      "Inattention and fidgeting are present whatever the emotional state, including calm, happy and holiday periods (CADDRA Table 2.6)",
      "Thoughts are many, unrelated and jump from topic to topic, with no repeated theme or abnormal content (Kooij et al. 2019)",
      "Attention is pulled outward by noise, novelty or more interesting activities rather than inward by worry (DSM-5-TR)",
      "Worries are realistic and tied to real lapses: missed deadlines, lost items, late bills (CADDRA)",
      "Few or no physical anxiety symptoms (CADDRA Table 2.6)",
      "Socially disinhibited: talks over people, blurts out, seeks stimulation and novelty",
      "Sleep-onset delay comes from being unable to switch off a busy mind, not from going over worries",
      "School reports and family describe inattention or restlessness in primary school, before any anxiety",
      "Checking is brief and compensates for known forgetfulness, without dread",
      "Boredom makes focus worse; interest or an urgent deadline can briefly make it better"
    ],
    favoursAlt: [
      "Inattention mainly or only during anxious periods or worry-provoking situations (ICD-11 6A05 boundary)",
      "Worry is excessive, hard to control, present more days than not and spans several areas of life, for at least 6 months (DSM-5-TR) or at least several months (ICD-11 6B00)",
      "Worry is about hypothetical future events ('what if...') rather than the results of real lapses",
      "Prominent physical arousal: palpitations, nausea, abdominal discomfort, sweating, trembling, dry mouth, muscle tension (ICD-11 6B00)",
      "Sleep-onset insomnia from rumination on specific worries (CADDRA Table 2.6)",
      "Socially inhibited, cautious and harm-avoidant",
      "Onset in adolescence or adulthood, often after a stressor; ICD-11 gives a typical onset in the early to mid-30s",
      "Concentration recovers when worry settles; symptoms rise and fall with stress",
      "Perfectionism, over-preparation and reassurance-seeking dominate",
      "Concentration and organisation returned to normal when the anxiety was treated",
      "Childhood described as worried, shy, rule-bound and keen to please rather than restless, chatty or dreamy",
      "Family history of anxiety disorders, with no family history of ADHD"
    ],
    ask: [
      "When you can't concentrate, what is going on in your head: one worry going round, or lots of unrelated thoughts?",
      "On a calm day with nothing to worry about, are you still distractible, late or losing things?",
      "Think of a holiday or a relaxed weekend. How were your focus and organisation then?",
      "Which came first: the worrying, or the problems with concentration and organisation?",
      "What do you worry about most? Is it mainly forgetting or messing up because it has happened before, or lots of things that might go wrong?",
      "Once a worry starts, can you put it aside, or does it keep going however hard you try?",
      "When you feel anxious, what happens in your body: racing heart, churning stomach, sweating, shaking, tight muscles?",
      "When you lie in bed, are you going over particular worries, or just unable to switch off from random thoughts?",
      "Are you restless only when you feel tense, or do you fidget and need to move even when relaxed or enjoying yourself?",
      "In a group, do you tend to hold back, or to interrupt and say things without thinking?",
      "Do you avoid new or uncertain situations, or go looking for novelty and excitement?",
      "When something really interests you, can you lose yourself in it for hours?",
      "When you put things off, is it because you fear doing them badly, or because you can't get started on boring tasks?",
      "Have you had treatment for anxiety? When the anxiety eased, did your concentration and organisation get back to normal?",
      "How much caffeine, energy drinks, nicotine or alcohol do you use? Has that changed recently?",
      "As a child, were you described as a worrier and shy, or as fidgety, chatty and a daydreamer?",
      "Does anyone in your family have anxiety, or ADHD?",
      "(Informant) Before the worrying started, were they already restless, disorganised or forgetful as a child?"
    ],
    features: [
      { id: "gad_worry", t: "Excessive, hard-to-control worry about several areas of life, more days than not for 6 months or more", w: 3 },
      { id: "gad_state", t: "Inattention mainly or only during anxious periods; focus is normal on calm days", w: 3 },
      { id: "gad_content", t: "Attention is lost to a recurring worry theme, not to outside distractions or wandering thoughts", w: 3 },
      { id: "gad_onset", t: "Concentration problems began in adolescence or adulthood, with or after the anxiety", w: 3 },
      { id: "gad_treat", t: "Concentration and organisation recovered fully when the anxiety was treated", w: 3 },
      { id: "gad_somatic", t: "Prominent physical arousal (palpitations, nausea, trembling, sweating, muscle tension)", w: 2 },
      { id: "gad_hypo", t: "Worries are about hypothetical future events rather than the results of real lapses", w: 2 },
      { id: "gad_inhib", t: "Socially inhibited, cautious, harm-avoidant style", w: 2 },
      { id: "gad_child", t: "Childhood described as anxious or shy, with no restlessness, chattiness or daydreaming at school", w: 2 },
      { id: "gad_fluct", t: "Symptoms rise and fall with stress and life events rather than being steady since childhood", w: 2 },
      { id: "gad_sleep", t: "Sleep-onset insomnia from rumination on specific worries", w: 1 },
      { id: "gad_reassure", t: "Perfectionism, over-preparation or reassurance-seeking dominate the picture", w: 1 },
      { id: "gad_fhx", t: "Family history of anxiety disorders, with no family history of ADHD", w: 1 }
    ],
    screen: ["gad7", "phq9"],
    investigations: [
      "No test diagnoses GAD. The diagnosis is clinical, against DSM-5-TR or ICD-11 criteria; GAD-7 of 10 or more prompts further assessment (PHQ Screeners manual).",
      "Thyroid function tests: consider in adults with unexplained anxiety (NICE NG145 1.2.3).",
      "Review caffeine, energy drinks, nicotine, alcohol, cannabis and stimulant use, and withdrawal from alcohol or benzodiazepines (ICD-11 6B00 exclusions).",
      "Medication review: bronchodilators, corticosteroids, levothyroxine dose, decongestants, and any recent start or change of an antidepressant. Benzodiazepines, pregabalin and sedating medicines taken for anxiety can themselves blunt attention and memory.",
      "Pulse and blood pressure; ECG if palpitations or other cardiac features; blood glucose if episodes suggest hypoglycaemia.",
      "Sleep diary to separate rumination-driven insomnia from the delayed sleep onset common in ADHD.",
      "UK referral: NHS Talking Therapies (self-referral possible) for CBT or applied relaxation in line with NICE CG113; secondary mental health care if severe, complex or not responding."
    ],
    redFlags: [
      "Anxiety with suicidal thoughts, self-harm or co-occurring depression: assess risk the same day.",
      "New anxiety with weight loss, tremor, heat intolerance or palpitations: examine and check thyroid function.",
      "First anxiety in middle or later life with no previous history: look for physical illness, medicines, alcohol and early cognitive change.",
      "Daily alcohol, benzodiazepine or other sedative use to control anxiety: assess dependence and withdrawal risk.",
      "Severe anxiety that prevents engagement with assessment or treatment: treat it first, then reassess ADHD (Kooij et al. 2019)."
    ],
    decide: {
      better: "GAD better explains the picture when inattention and restlessness began with the anxiety (often in adolescence or adulthood), occur mainly when anxious, are driven by worry content, and there is no convincing childhood evidence of ADHD from school reports or family. Do not diagnose ADHD now; treat the anxiety and reassess if attention problems persist once it has settled.",
      both: "Diagnose both when ADHD symptoms were present across settings before age 12, persist on low-anxiety days and in calm settings, and GAD criteria are also met in their own right (excessive, uncontrollable worry about several areas, with physical arousal). Realistic anxiety about ADHD-related failures does not need a separate GAD diagnosis (CADDRA).",
      next: "Use GAD-7 and an interview about worry content and course. Build a timeline of anxiety and ADHD symptoms with an informant. If anxiety is severe, treat it first and re-rate ADHD symptoms afterwards (Kooij et al. 2019; CR235 Table 3). If milder, both can be treated together: titrate stimulants slowly and monitor anxiety (CADDRA). If anxiety becomes too intense, reduce or stop the ADHD medicine and stabilise the anxiety before restarting (CADDRA); consider atomoxetine if stimulants worsen anxiety (CR235 Table 3)."
    },
    pearls: [
      "Ask what the mind is doing when attention fails. Worry pulls attention back to one theme; ADHD scatters it across many unrelated thoughts (Kooij et al. 2019; DSM-5-TR).",
      "The calm-day test is the most useful single question. If focus, time-keeping and organisation are still poor on a good day, the problem is not only anxiety.",
      "Read GAD-7 items 1-3 and 7 (worry and fear) separately from items 4-6 (trouble relaxing, restlessness, irritability), which ADHD can drive on its own.",
      "Secondary anxiety is common. Years of forgetting things breeds realistic worry and compensatory checking; that is not a reason to rule out ADHD (CADDRA).",
      "ICD-11 gives a typical GAD onset in the early to mid-30s. Concentration problems that began then, with no school-age history, need a strong informant account before ADHD is diagnosed.",
      "Women with ADHD are often treated first for anxiety or depression. Treatment-resistant anxiety is a reason to screen for ADHD (Young et al. 2020).",
      "Stimulants can increase anxiety at the start or after a dose increase; slower titration usually helps, and both stimulants and non-stimulants can be used when anxiety is comorbid (CADDRA).",
      "Timeline matters. In the WHO surveys ADHD began before most co-occurring anxiety disorders other than specific phobia (Fayyad et al. 2017). Anxiety that clearly began before any attention problem is a reason to look harder at the childhood history."
    ],
    refs: [
      "American Psychiatric Association. DSM-5-TR (2022): ADHD criterion E and differential diagnosis; generalized anxiety disorder (paraphrased).",
      "WHO. ICD-11 Clinical Descriptions and Diagnostic Requirements (2024): 6A05 boundary with anxiety and fear-related disorders; 6B00.",
      "CADDRA. Canadian ADHD Practice Guidelines 4.1 (2020): anxiety disorder section and Table 2.6.",
      "Kooij JJS et al. Updated European Consensus Statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019;56:14-34 (sections 4.1.5, 7.2).",
      "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023): 9.7.3 and Table 3.",
      "Kessler RC et al. The prevalence and correlates of adult ADHD in the United States (NCS-R). Am J Psychiatry 2006;163:716-23.",
      "Fayyad J et al. The descriptive epidemiology of DSM-IV adult ADHD in the WHO World Mental Health Surveys. Atten Defic Hyperact Disord 2017;9:47-65.",
      "Young S et al. Females with ADHD: an expert consensus statement taking a lifespan approach. BMC Psychiatry 2020;20:404.",
      "Spitzer RL et al. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med 2006;166:1092-7.",
      "NICE CG113. Generalised anxiety disorder and panic disorder in adults: management (2011).",
      "NICE NG145. Thyroid disease: assessment and management (2019), recommendation 1.2.3.",
      "Newman et al. 2026. UK NHS adult ADHD clinic audit, RCPsych Congress abstract (not peer-reviewed)."
    ]
  },

  /* ------------------------------------------------------------------ Social anxiety disorder */
  {
    id: "social",
    name: "Social anxiety disorder (social phobia)",
    group: "anxiety",
    core: false,
    icd11: "6B04",
    summary: "Marked, persistent fear of social or performance situations in which the person might be watched or judged, with fear of acting in a way, or showing anxiety, that others will evaluate negatively. Situations are avoided or endured with intense anxiety. It was the commonest anxiety disorder in adults with ADHD in the US NCS-R; both usually begin in childhood and both damage social life, so the discriminator is the mechanism: fear of judgement versus inattention and impulsivity.",
    prevalence: "In adults with ADHD: social phobia 29.3% over 12 months in the NCS-R, the commonest anxiety disorder in that sample (Kessler et al. 2006); 12.6% in the WHO World Mental Health surveys (Fayyad et al. 2017).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed when each meets criteria in its own right. Do not count inattention towards ADHD if it occurs only in social or performance situations (ICD-11 6A05 boundary). Social anxiety can suppress visible impulsivity and delay recognition of ADHD (Katzman et al. 2017). Social problems caused by interrupting, forgetting plans or impulsive remarks are ADHD impairment, not social anxiety, unless fear of negative evaluation is also present.",
    overlap: [
      "Avoiding meetings, seminars, parties and phone calls",
      "Mind going blank when speaking or being watched",
      "Poor performance in presentations, interviews and oral exams",
      "Low self-esteem and expecting criticism",
      "Few close friendships, or friendships that lapse",
      "Replaying conversations afterwards",
      "Strong reactions to perceived criticism or rejection",
      "Alcohol or cannabis used to cope with social events (ICD-11 notes raised substance use risk in social anxiety)",
      "Both commonly begin in childhood or early adolescence"
    ],
    favoursADHD: [
      "Social problems come from interrupting, talking too much, missing cues through inattention, forgetting plans or replying late",
      "Socially disinhibited rather than inhibited (CADDRA Table 2.6)",
      "Concentration is also poor when alone, at home, or on tasks nobody will see",
      "Enjoys and seeks company, but loses friends through unreliability or impulsive remarks",
      "Worry about social situations followed repeated social mistakes rather than preceding them",
      "School reports describe chattiness, restlessness, calling out or daydreaming, not shyness",
      "Little anticipatory dread; tends to arrive late or unprepared rather than over-rehearsed",
      "Speaking in front of others is hard mainly because they lose the thread, not because they fear looking anxious"
    ],
    favoursAlt: [
      "Marked fear of scrutiny, embarrassment or humiliation, out of proportion to the situation (DSM-5-TR; ICD-11 6B04)",
      "Attention problems confined to social or performance situations; focus is fine when alone",
      "Anticipatory anxiety for days before an event",
      "Blushing, sweating, trembling or a shaking voice when observed, and fear that others will notice (ICD-11 6B04)",
      "Safety behaviours: rehearsing sentences, avoiding eye contact, hiding a tremor, sitting at the back",
      "Avoids eating, writing, phoning or speaking in front of others",
      "Long post-event rumination, searching for mistakes",
      "Quiet and inhibited; rarely interrupts or blurts out",
      "Gradual onset between about 8 and 15 years, or abrupt onset after a humiliating social experience (ICD-11 course features)",
      "Fear limited to performance (presentations, exams) with normal attention in ordinary daily tasks",
      "Fear and avoidance have lasted 6 months or more (DSM-5-TR)"
    ],
    ask: [
      "In meetings or groups, what makes it hard: fear of being judged, or drifting off and losing the thread?",
      "When you are at home alone with a task, is your concentration fine?",
      "Before a social event, do you worry for days about embarrassing yourself?",
      "Do you avoid speaking up, eating in front of others or making phone calls because of what people might think?",
      "When people are watching you, do you blush, sweat, shake or feel your voice wobble? Do you worry they will notice?",
      "Do friends say you talk too much and interrupt, or that you are very quiet?",
      "Have you lost friends because you forgot plans or replied late, or because you kept away from them?",
      "When you feel comfortable with people, do you enjoy their company, or is socialising always an ordeal?",
      "Do you rehearse what you are going to say before you speak?",
      "After a conversation, do you go over it for hours looking for mistakes?",
      "If the fear of being judged disappeared tomorrow, would the problems with organisation, lateness and focus still be there?",
      "When did the shyness or fear start? Was there a particular embarrassing event?",
      "At school, were you described as quiet and shy, or as chatty, restless or a daydreamer?",
      "Is the fear only about presentations and exams, or about everyday conversations too?",
      "Do you drink or use cannabis to get through social situations?",
      "(Informant) As a child, did they hang back from other children, or rush in and talk over people?"
    ],
    features: [
      { id: "social_fear", t: "Marked fear of negative evaluation in social or performance situations", w: 3 },
      { id: "social_confined", t: "Concentration problems occur mainly in social or performance situations; focus is normal alone", w: 3 },
      { id: "social_treat", t: "Attention and organisation recovered when the social anxiety was treated", w: 3 },
      { id: "social_antic", t: "Anticipatory anxiety for days before social events", w: 2 },
      { id: "social_somatic", t: "Blushing, sweating, trembling or shaking voice when observed, with fear that others will notice", w: 2 },
      { id: "social_avoid", t: "Avoids, or endures with intense fear, speaking up, phoning, eating or writing in front of others", w: 2 },
      { id: "social_safety", t: "Safety behaviours (rehearsing, avoiding eye contact, hiding a tremor)", w: 2 },
      { id: "social_inhib", t: "Socially inhibited style; rarely interrupts or blurts out", w: 2 },
      { id: "social_child", t: "Childhood described as shy or quiet, with no restlessness, chattiness or daydreaming at school", w: 2 },
      { id: "social_onset", t: "Onset after a humiliating social experience, with no earlier attention problems", w: 2 },
      { id: "social_rumin", t: "Long post-event rumination about perceived mistakes", w: 1 },
      { id: "social_alc", t: "Uses alcohol or other substances specifically to manage social fear", w: 1 }
    ],
    screen: ["gad7"],
    investigations: [
      "No test is needed; the diagnosis is clinical. GAD-7 has moderate accuracy for social anxiety (Kroenke et al. 2007). Dedicated measures (SPIN, Mini-SPIN, LSAS) are used in specialist services; their licences vary and they are not reproduced here.",
      "Check alcohol and drug use (AUDIT, DAST-10): people with social anxiety may use substances to manage social fear.",
      "If social difficulty dates from early childhood with difficulty understanding social rules, consider autism assessment (NICE CG142).",
      "School reports: look for 'quiet, shy, reluctant to contribute' versus 'chatty, distracted, calls out'.",
      "UK referral: NHS Talking Therapies for CBT developed specifically for social anxiety, in line with NICE CG159."
    ],
    redFlags: [
      "Complete social withdrawal, leaving work or education, or being housebound: assess for depression, autism and psychosis.",
      "Suicidal thoughts linked to shame or isolation: assess risk.",
      "Heavy drinking or sedative use before social situations: assess dependence.",
      "New social fear with suspiciousness or a belief that others are talking about or watching them: consider emerging psychosis."
    ],
    decide: {
      better: "Social anxiety better explains the picture when attention problems are confined to social or performance situations, are driven by fear of being judged, began with the social fear, and there is no childhood evidence of ADHD across settings.",
      both: "Diagnose both when ADHD symptoms are present across settings, including when alone and unobserved, date from before age 12, and fear of negative evaluation also meets criteria in its own right. This combination is common.",
      next: "Separate the mechanism for each social difficulty (fear versus impulsivity or inattention), using school reports and an informant. Treat significant social anxiety with CBT (NICE CG159). Atomoxetine improved both ADHD and social anxiety in an adult randomised trial (Kooij et al. 2019, citing Adler et al. 2009). Re-rate ADHD symptoms in non-social settings."
    },
    pearls: [
      "Ask why each social problem happens. 'I interrupt and forget names' is ADHD; 'I don't speak because I'll look stupid' is social anxiety. Many people have both.",
      "Age of onset discriminates poorly: most social anxiety starts between about 8 and 15 years (ICD-11). Rely on the mechanism and on school descriptions.",
      "Social anxiety can hide hyperactivity and impulsivity. A quiet, anxious adult may still have lifelong inattention (Katzman et al. 2017).",
      "ADHD-related hurt after a perceived slight is reactive and usually short-lived; social anxiety is anticipatory and leads to avoidance before anything has happened (clinical practice).",
      "If the person could never make friends, rather than struggling to keep them, think of autism (CR235 9.7.4).",
      "Alcohol used to get through social events is common in both conditions and needs its own assessment."
    ],
    refs: [
      "American Psychiatric Association. DSM-5-TR (2022): social anxiety disorder; ADHD criterion E (paraphrased).",
      "WHO. ICD-11 CDDR (2024): 6B04 social anxiety disorder (course features); 6A05 boundary with anxiety and fear-related disorders.",
      "CADDRA. Canadian ADHD Practice Guidelines 4.1 (2020): Table 2.6 Anxiety disorder differentiation.",
      "Kessler RC et al. Am J Psychiatry 2006;163:716-23 (NCS-R).",
      "Fayyad J et al. Atten Defic Hyperact Disord 2017;9:47-65 (WHO World Mental Health Surveys).",
      "Katzman MA et al. Adult ADHD and comorbid disorders: clinical implications of a dimensional approach. BMC Psychiatry 2017;17:302.",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34 (section 7.4; Adler LA et al. Depress Anxiety 2009).",
      "Kroenke K et al. Anxiety disorders in primary care: prevalence, impairment, comorbidity, and detection. Ann Intern Med 2007;146:317-25.",
      "Royal College of Psychiatrists. CR235 (2023): 9.7.3, 9.7.4 and Table 3.",
      "NICE CG159. Social anxiety disorder: recognition, assessment and treatment (2013).",
      "NICE CG142. Autism spectrum disorder in adults: diagnosis and management."
    ]
  },

  /* ------------------------------------------------------------------ Panic disorder */
  {
    id: "panic",
    name: "Panic disorder (and agoraphobia)",
    group: "anxiety",
    core: false,
    icd11: "6B01 (agoraphobia 6B02)",
    summary: "Recurrent unexpected panic attacks, discrete surges of intense fear that peak within minutes, followed by persistent worry about further attacks or by changes in behaviour to avoid them. Since DSM-5, and in ICD-11, agoraphobia is a separate diagnosis that often accompanies it. Concentration suffers during and after attacks and with anticipatory anxiety, and restlessness or leaving situations abruptly can look like ADHD. Panic is episodic; ADHD is continuous.",
    prevalence: "In adults with ADHD: panic disorder 8.9% and agoraphobia 4.0% over 12 months in the NCS-R (Kessler et al. 2006); panic disorder 5.7% in the WHO World Mental Health surveys (Fayyad et al. 2017).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. Do not count inattention towards ADHD if it is confined to attacks and anticipatory anxiety. Attacks that occur only in the context of another disorder (for example only with PTSD reminders or GAD worries) do not make panic disorder; ICD-11 adds a 'with panic attacks' specifier instead. Substances can cause panic (ICD-11 6B01 gives coffee, cocaine and withdrawal from alcohol or benzodiazepines as examples; prescribed stimulants and cannabis can too), so check timing before diagnosing either.",
    overlap: [
      "Restlessness and inability to settle",
      "Poor concentration during and after attacks, and with anticipatory anxiety",
      "Avoiding lectures, meetings, public transport and crowded shops",
      "Leaving situations abruptly, which can look impulsive",
      "Sleep disruption, including waking in panic",
      "Irritability and feeling on edge",
      "Frequent GP or emergency visits that disrupt work and study",
      "Caffeine, nicotine and stimulant use can worsen both"
    ],
    favoursADHD: [
      "Attention and organisation problems are present all the time, independent of attacks",
      "Restlessness is a constant need to move, present when calm and happy",
      "No discrete surges of fear with physical symptoms",
      "Leaving meetings or queues early is driven by boredom or impatience, not fear of an attack",
      "Symptoms began in primary school, years before any panic",
      "Daily functioning is impaired on days with no attacks and no fear of them",
      "Sleep problems are a lifelong late, busy-minded sleep onset, not waking in panic",
      "A parent or sibling has ADHD or similar lifelong traits"
    ],
    favoursAlt: [
      "Recurrent unexpected attacks: an abrupt surge of fear that peaks within minutes (DSM-5-TR; ICD-11 6B01)",
      "Attacks bring physical symptoms: palpitations, sweating, trembling, breathlessness, choking, chest pain, nausea, dizziness, tingling, chills or hot flushes",
      "During attacks: depersonalisation or derealisation, and fear of dying, losing control or going mad",
      "At least a month of persistent worry about further attacks or their meaning, or of behaviour change to avoid them (DSM-5-TR)",
      "Agoraphobic avoidance: public transport, crowds, queues, being far from home, or needing a companion",
      "Concentration problems clustered around attacks and anticipatory anxiety, and normal between them",
      "Onset typically in the early 20s; panic disorder is very rare in young children (ICD-11 course features)",
      "Repeated emergency visits for chest pain or palpitations with normal tests (ICD-11)",
      "Nocturnal attacks: waking from sleep in a state of panic (ICD-11)",
      "Attention problems resolved when panic was treated"
    ],
    ask: [
      "Have you had sudden surges of intense fear that peak within minutes, with your heart pounding, breathlessness or a feeling you might die or lose control?",
      "Do these come out of the blue, or only in particular situations?",
      "How long does an attack last, and what do you do when it happens?",
      "Between attacks, do you worry a lot about having another one, or about what they mean for your health?",
      "Have you stopped doing things because of the attacks, such as using public transport, going into shops or travelling alone?",
      "On days with no attacks and no worry about them, how are your concentration and organisation?",
      "How old were you at the first attack? Were the concentration and restlessness problems there before that?",
      "Is your restlessness a constant need to move, or mainly a rush of fear during attacks?",
      "When you leave a meeting or a queue early, is it because you're bored and impatient, or because you fear an attack?",
      "How much caffeine, energy drinks or nicotine do you use? Do attacks follow them?",
      "Have you used cocaine, amfetamine, cannabis or someone else's ADHD tablets? Did attacks start around then?",
      "Do attacks happen when you cut down alcohol or stop tablets such as diazepam?",
      "Do attacks ever wake you from sleep?",
      "Have you been to A&E or your GP with chest pain or palpitations? What tests were done?",
      "Has anyone in your family had panic attacks or an anxiety disorder? Does anyone have ADHD?"
    ],
    features: [
      { id: "panic_attacks", t: "Recurrent unexpected panic attacks that peak within minutes", w: 3 },
      { id: "panic_cluster", t: "Concentration problems clustered around attacks and anticipatory anxiety, normal between them", w: 3 },
      { id: "panic_onset", t: "Attention complaints began with or after the first attacks, typically in late adolescence or early adulthood", w: 3 },
      { id: "panic_treat", t: "Attention and organisation normal once the panic was treated", w: 3 },
      { id: "panic_worry", t: "A month or more of worry about further attacks or their consequences", w: 2 },
      { id: "panic_agora", t: "Agoraphobic avoidance (transport, crowds, queues, leaving home alone)", w: 2 },
      { id: "panic_child", t: "No childhood restlessness, inattention or impulsivity reported by school or family", w: 2 },
      { id: "panic_somatic", t: "Marked physical symptoms during attacks (palpitations, breathlessness, chest pain, dizziness)", w: 1 },
      { id: "panic_derealis", t: "Depersonalisation or derealisation during attacks", w: 1 },
      { id: "panic_ae", t: "Repeated emergency or GP visits for chest pain or palpitations with normal tests", w: 1 },
      { id: "panic_nocturnal", t: "Nocturnal panic attacks", w: 1 }
    ],
    screen: ["gad7"],
    investigations: [
      "No test diagnoses panic disorder. GAD-7 has moderate accuracy for panic (Kroenke et al. 2007); the PHQ panic module is a free alternative. Exclude physical causes when the history suggests them.",
      "ECG if palpitations, chest pain, syncope or a family history of sudden cardiac death; consider ambulatory ECG for paroxysmal palpitations.",
      "Thyroid function tests (NICE NG145 1.2.3: consider in adults with unexplained anxiety).",
      "Blood glucose if attacks follow fasting or occur in diabetes. Consider asthma, vestibular disorders, focal seizures and, rarely, phaeochromocytoma (an ICD-11 example) when attacks are atypical.",
      "Caffeine, nicotine, stimulant and cannabis history; alcohol and benzodiazepine withdrawal.",
      "Before any ADHD medication, complete the cardiovascular assessment in NICE NG87 1.7.4-1.7.5, and record whether palpitations have been explained.",
      "UK referral: GP for physical investigations; NHS Talking Therapies for CBT for panic disorder (NICE CG113)."
    ],
    redFlags: [
      "Chest pain, palpitations or syncope on exertion: cardiac assessment before attributing symptoms to panic.",
      "First attacks in middle or later life, or atypical attacks without fear: look for medical causes such as arrhythmia, thyroid disease or seizures.",
      "Episodes with loss of awareness, automatisms or confusion afterwards: consider focal seizures.",
      "Panic with suicidal thoughts, or with heavy alcohol or benzodiazepine use.",
      "Attacks that began after starting prescribed or illicit stimulants."
    ],
    decide: {
      better: "Panic disorder better explains the picture when attention and restlessness problems are confined to attacks, their aftermath and anticipatory anxiety, began with the panic, and there is no childhood ADHD history.",
      both: "Diagnose both when trait ADHD symptoms predate the first attacks, persist between attacks and on attack-free days, and panic disorder criteria are also met.",
      next: "Clarify attack frequency, triggers and avoidance, and exclude physical causes when indicated. Treat panic first if it is frequent or disabling (Kooij et al. 2019; CR235 Table 3), then re-rate ADHD symptoms. If ADHD medication is started, reduce caffeine, titrate slowly and monitor (CADDRA); consider atomoxetine if stimulants worsen anxiety (CR235 Table 3)."
    },
    pearls: [
      "Panic is episodic; ADHD is continuous. Ask the person to describe a typical attack-free week.",
      "Ask why they leave situations early. Fear of an attack points to panic; boredom or impatience points to ADHD.",
      "Panic disorder very rarely starts in young children (ICD-11). Restlessness and inattention in primary school point to ADHD, not panic.",
      "Adults with undiagnosed ADHD often use a lot of caffeine or energy drinks to stay alert, which can provoke panic. Ask about intake before judging either condition (clinical practice).",
      "Panic attacks also occur in GAD, social anxiety, PTSD and withdrawal states. Panic disorder needs unexpected attacks plus persistent worry or avoidance (ICD-11 6B01).",
      "Severe agoraphobia can restrict life so much that ADHD impairment is hard to judge. Ask about functioning in the settings the person still uses, and in the years before avoidance began."
    ],
    refs: [
      "American Psychiatric Association. DSM-5-TR (2022): panic disorder and agoraphobia; ADHD criterion E (paraphrased).",
      "WHO. ICD-11 CDDR (2024): 6B01 panic disorder, 6B02 agoraphobia, MB23.H panic attacks specifier; 6A05 boundaries.",
      "Kessler RC et al. Am J Psychiatry 2006;163:716-23 (NCS-R).",
      "Fayyad J et al. Atten Defic Hyperact Disord 2017;9:47-65 (WHO World Mental Health Surveys).",
      "Kroenke K et al. Ann Intern Med 2007;146:317-25.",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34 (section 7.2).",
      "Royal College of Psychiatrists. CR235 (2023): Table 3.",
      "NICE CG113. Generalised anxiety disorder and panic disorder in adults: management (2011).",
      "NICE NG145 (2019) recommendation 1.2.3; NICE NG87 (2018, updated 2019) recommendations 1.7.4-1.7.5."
    ]
  },

  /* ------------------------------------------------------------------ PTSD */
  {
    id: "ptsd",
    name: "Post-traumatic stress disorder",
    group: "trauma",
    core: true,
    icd11: "6B40",
    summary: "A syndrome after exposure to an extremely threatening or horrific event: re-experiencing in the here and now (flashbacks, vivid intrusive images, nightmares), deliberate avoidance of reminders, and a persistent sense of current threat with hypervigilance and startle. Hyperarousal, poor concentration, irritability, recklessness and poor sleep closely mimic adult ADHD, and ADHD itself raises the risk of trauma, so timing relative to the trauma is the key.",
    prevalence: "In adults with ADHD: PTSD 11.9% over 12 months in the NCS-R (Kessler et al. 2006). A UK NHS adult ADHD clinic audit recorded PTSD in 19% of newly diagnosed adults (Newman et al. 2026, conference abstract, not peer-reviewed). A meta-analysis found the association runs in both directions (Spencer et al. 2016).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. A trauma history does not exclude ADHD when criteria are otherwise met (CADDRA; Australian guideline 2022). Count symptoms towards ADHD only if they were present before the trauma, or are clearly present outside trauma-related states, and are not fully explained by re-experiencing, avoidance and hyperarousal (DSM-5-TR criterion E). When no pre-trauma account exists, record the decision as uncertain and reassess after trauma-focused treatment.",
    overlap: [
      "Poor concentration and forgetfulness (a DSM-5-TR PTSD arousal symptom)",
      "Restlessness, being keyed up, unable to settle",
      "Irritability and angry outbursts",
      "Reckless or self-destructive behaviour and risk-taking",
      "Difficulty getting to sleep and broken sleep",
      "Zoning out (dissociation) that looks like daydreaming",
      "Emotional dysregulation and low frustration tolerance",
      "Gaps in memory for parts of the event, read as forgetfulness",
      "Avoiding tasks, places and people, which can look like procrastination",
      "Alcohol or cannabis used to manage arousal or sleep"
    ],
    favoursADHD: [
      "School reports or family accounts describe inattention or hyperactivity before the trauma",
      "Attention problems are present in safe, calm, non-triggering settings and on holiday",
      "Distraction is outward and novelty-driven (noise, interests, phone), not pulled by intrusive memories or by scanning for danger",
      "No re-experiencing in the here and now and no deliberate avoidance of reminders",
      "Restlessness is a lifelong need to move, not startle-prone watchfulness",
      "Emotional outbursts are short-lived, triggered by everyday frustrations, with return to baseline within hours (Kooij et al. 2019)",
      "Risk-taking is sensation-seeking and was present before the trauma",
      "Symptom level changed little after the trauma, or worsened only for a while",
      "Family history of ADHD"
    ],
    favoursAlt: [
      "Exposure to an extremely threatening or horrific event, followed by onset or clear worsening of symptoms, usually within 3 months; delayed onset is possible (ICD-11 6B40)",
      "Re-experiencing in the here and now: flashbacks, vivid intrusive images or nightmares, with strong emotion and body sensations (ICD-11 6B40)",
      "Deliberate avoidance of thoughts, people, places or conversations linked to the event",
      "Persistent sense of current threat: hypervigilance, exaggerated startle, safety behaviours such as sitting facing the door (ICD-11 6B40)",
      "Attention captured by intrusions or by scanning for danger",
      "Dissociative episodes (feeling unreal or detached, losing time), especially with reminders",
      "Concentration and sleep worse after reminders, anniversaries or new stressors",
      "Negative changes in beliefs and mood after the event: blame, guilt, shame, detachment (DSM-5-TR)",
      "Informants describe a clear change from the person they were before",
      "Concentration returned to normal after trauma-focused treatment (partial improvement does not rule out ADHD)"
    ],
    ask: [
      "Some people have been through frightening or harmful events, including in childhood. Has anything like that happened to you? You don't need to give me details.",
      "Did your concentration and restlessness problems start before or after those events? How were you at school before then?",
      "Do memories of what happened come back as if it is happening again, with the same feelings or body sensations?",
      "Do you have nightmares about it, or wake up frightened?",
      "When you lose focus, is your mind pulled back to what happened or to possible danger, or drawn to something more interesting?",
      "Do you go out of your way to avoid people, places, conversations or thoughts that remind you?",
      "Do you feel constantly on guard, jump at sudden noises, or need to sit where you can see the door?",
      "Do you ever feel unreal, detached from your body, or lose chunks of time?",
      "In a safe, calm place, for example on holiday, are you still disorganised, forgetful and restless?",
      "When you get angry, what sets it off and how long does it last?",
      "Has the way you see yourself or other people changed since the events?",
      "Do things get worse around anniversaries or after reminders?",
      "Do you use alcohol, cannabis or other drugs to calm down or to sleep?",
      "Have you had trauma-focused therapy? Did your concentration change afterwards?",
      "Did you hit your head or lose consciousness during any of these events, for example in an assault, accident or military service?",
      "Are you safe now? Is anyone currently hurting, threatening or controlling you?",
      "(Informant) What were they like as a young child, before the events: restless, distractible, forgetful?"
    ],
    features: [
      { id: "ptsd_event", t: "Exposure to an extremely threatening or horrific event, followed by onset or clear worsening of the symptoms", w: 3 },
      { id: "ptsd_reexp", t: "Re-experiencing in the here and now (flashbacks, vivid intrusive images, trauma-related nightmares)", w: 3 },
      { id: "ptsd_capture", t: "Attention captured by intrusive memories or by scanning for danger", w: 3 },
      { id: "ptsd_noprior", t: "No inattention or hyperactivity described before the trauma (school reports, family)", w: 3 },
      { id: "ptsd_treat", t: "Concentration and restlessness returned to normal after trauma-focused treatment", w: 3 },
      { id: "ptsd_avoid", t: "Deliberate avoidance of reminders", w: 2 },
      { id: "ptsd_threat", t: "Hypervigilance, exaggerated startle or safety behaviours", w: 2 },
      { id: "ptsd_safe", t: "Focus and organisation near normal in safe, calm settings", w: 2 },
      { id: "ptsd_dissoc", t: "Dissociative episodes (feeling unreal, losing time), especially with reminders", w: 2 },
      { id: "ptsd_change", t: "Informants describe a clear change from the person they were before the trauma", w: 2 },
      { id: "ptsd_cue", t: "Symptoms worse after reminders, anniversaries or new stressors", w: 1 },
      { id: "ptsd_cog", t: "Persistent guilt, shame or self-blame linked to the event", w: 1 }
    ],
    screen: ["pcptsd5", "pcl5", "itq", "aceq"],
    investigations: [
      "No test diagnoses PTSD. Use a trauma-informed clinical interview; questionnaires support it but do not replace it. CAPS-5 is the reference structured interview in specialist services.",
      "PC-PTSD-5: positive at 4 or more (consider 3 in women). PCL-5: a total of 31-33 or more suggests probable PTSD, but it does not establish trauma exposure (VA National Center for PTSD).",
      "ITQ for ICD-11 PTSD and complex PTSD: use the diagnostic algorithm, not cut-off scores (Cloitre et al. 2018).",
      "Head injury during assaults, accidents or military service: consider traumatic brain injury and neurological assessment.",
      "Screen alcohol and drug use (AUDIT, DAST-10).",
      "Safeguarding: ask about current risk from others (domestic abuse, exploitation) and about children in the household.",
      "Request school reports from before the trauma to date the onset of attention problems.",
      "UK referral: NHS Talking Therapies or secondary mental health care for trauma-focused CBT or EMDR (NICE NG116); Op COURAGE for veterans in England; specialist trauma services for complex presentations."
    ],
    redFlags: [
      "Current danger (domestic abuse, stalking, exploitation, threats): follow safeguarding procedures now.",
      "Suicidal thoughts or self-harm, which are common in PTSD (ICD-11): assess risk the same day.",
      "Severe dissociation, or flashbacks with a hallucinatory quality that may be mistaken for psychosis (ICD-11 6B40 boundary).",
      "Heavy alcohol or drug use to manage symptoms.",
      "Significant head injury during the trauma.",
      "Disclosure of child abuse, or a child currently at risk: act under local safeguarding policy."
    ],
    decide: {
      better: "PTSD better explains the picture when attention, restlessness and irritability began or clearly worsened after the trauma, are driven by intrusions, avoidance and threat-scanning, improve in safe settings, and no ADHD symptoms were described before the trauma.",
      both: "Diagnose both when ADHD symptoms were present across settings before the trauma (school reports, family), persist in safe and calm settings, and PTSD criteria are also met. ADHD increases the risk of accidents, assaults and other adverse events, so this combination is common (CR235).",
      next: "Check safety first. Use PC-PTSD-5, then PCL-5 or ITQ, within a trauma-informed interview, and obtain pre-trauma collateral. If the timeline cannot be established (for example trauma from infancy), record 'uncertain' and reassess after stabilisation or trauma-focused treatment. Treating ADHD can help a person engage with trauma therapy and can be part of stabilisation (CR235 11.5)."
    },
    pearls: [
      "Re-experiencing is the discriminator. Flashbacks are felt as happening now; remembering or ruminating about the event does not count (ICD-11 6B40).",
      "Ask where attention goes. In PTSD it is pulled inward to memories or outward to danger; in ADHD it goes to whatever is new or interesting.",
      "Four of the six PCL-5 arousal items (irritability, risk-taking, concentration, sleep) look like ADHD. A high arousal score with low intrusion and avoidance scores should prompt the question: was this there before the trauma?",
      "People with ADHD have more adverse childhood experiences, accidents and assaults (CR235). Trauma in an adult with ADHD is common and does not mean the ADHD is really PTSD.",
      "Trauma can also mask ADHD. Screen for ADHD in trauma services, especially when someone struggles to engage with structured therapy (CR235 11.5).",
      "Do not press for details of the trauma in an ADHD assessment. You need the timing and the symptom pattern, not the story.",
      "Delayed-onset PTSD can appear years after the event (ICD-11). A long symptom-free gap does not rule it out."
    ],
    refs: [
      "American Psychiatric Association. DSM-5-TR (2022): posttraumatic stress disorder; ADHD criterion E (paraphrased).",
      "WHO. ICD-11 CDDR (2024): 6B40 post-traumatic stress disorder (course features, boundaries); 6A05 culture-related features.",
      "CADDRA. Canadian ADHD Practice Guidelines 4.1 (2020): psychological trauma.",
      "Royal College of Psychiatrists. CR235 (2023): 9.7.2 and 11.5 (trauma-informed approach).",
      "Australian Evidence-Based Clinical Practice Guideline for ADHD (AADPA 2022): trauma as a special presentation.",
      "Kessler RC et al. Am J Psychiatry 2006;163:716-23 (NCS-R).",
      "Spencer AE et al. Examining the association between PTSD and ADHD: a systematic review and meta-analysis. J Clin Psychiatry 2016;77:72-83.",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34 (section 4.1.4).",
      "VA National Center for PTSD: PC-PTSD-5 and PCL-5 scoring guidance (public domain).",
      "Cloitre M et al. The International Trauma Questionnaire. Acta Psychiatr Scand 2018;138:536-46.",
      "NICE NG116. Post-traumatic stress disorder (2018); July 2026 exceptional surveillance: no update.",
      "Newman et al. 2026. UK NHS adult ADHD clinic audit, RCPsych Congress abstract (not peer-reviewed)."
    ]
  },

  /* ------------------------------------------------------------------ Complex PTSD */
  {
    id: "cptsd",
    name: "Complex post-traumatic stress disorder (ICD-11)",
    group: "trauma",
    core: false,
    icd11: "6B41",
    summary: "An ICD-11 diagnosis after prolonged or repeated trauma from which escape was difficult or impossible, such as repeated childhood abuse, domestic violence or torture. It needs all the core features of PTSD plus disturbances in self-organisation: severe problems regulating emotion, a persistently negative view of oneself, and difficulty sustaining relationships. These closely resemble the emotional dysregulation, low self-esteem and relationship problems of adult ADHD, and early trauma removes the clean 'before' period, which makes this one of the hardest differentials.",
    prevalence: "No reliable figure for complex PTSD in adults with ADHD was found. PTSD of any kind was 11.9% in adults with ADHD in the NCS-R (Kessler et al. 2006). Children with ADHD are more likely than their peers to have adverse childhood experiences (CR235, citing Brown et al. 2017).",
    coexist: "sometimes",
    coexistNote: "Both can be diagnosed when each meets criteria independently. DSM-5-TR has no complex PTSD category: record PTSD and describe the additional features. ICD-11 notes that children with complex PTSD often report symptoms consistent with ADHD, and that co-occurring diagnoses should be made only when symptoms are not fully accounted for by complex PTSD and all requirements are met. The ITQ counts self-organisation problems only when full PTSD criteria are also met, which protects against relabelling ADHD emotional dysregulation as complex PTSD (Cloitre et al. 2018).",
    overlap: [
      "Heightened emotional reactivity to minor stressors and anger outbursts",
      "Reckless or self-destructive behaviour",
      "Persistent sense of failure and low self-worth",
      "Difficulty sustaining relationships and jobs",
      "Poor concentration, forgetfulness and 'zoning out'",
      "Restlessness and poor sleep",
      "Alcohol or drug use to manage feelings",
      "A chaotic early environment, which is also common when a parent has ADHD (CR235 9.7.2)",
      "Both overlap with borderline personality disorder, and all three can coexist (CR235)"
    ],
    favoursADHD: [
      "Inattention, restlessness and impulsivity are seen in settings unrelated to threat and with safe adults, such as a stable school year or a later secure relationship",
      "Emotional reactions are brief and settle within hours (Kooij et al. 2019); no emotional numbing",
      "Self-criticism centres on repeated practical failures (lateness, lost items, unfinished work), not on shame linked to the trauma",
      "Relationships end through forgetfulness, impulsive remarks or boredom rather than avoidance, distrust or disconnection",
      "No re-experiencing, avoidance of reminders or persistent sense of threat",
      "A parent or sibling has ADHD or similar lifelong traits",
      "Lifelong sensation-seeking and enjoyment of novelty",
      "Attention problems continued unchanged after the person reached safety"
    ],
    favoursAlt: [
      "Prolonged or repeated trauma from which escape was difficult (childhood abuse, domestic violence, trafficking, torture) (ICD-11 6B41)",
      "Full PTSD core features: re-experiencing, avoidance and a persistent sense of current threat",
      "Emotional numbing, inability to feel pleasure, dissociation under stress (ICD-11 6B41)",
      "Pervasive shame, guilt or worthlessness linked to the trauma",
      "Relationships marked by avoidance, distrust and disconnection, or occasional intense ones that cannot be sustained (ICD-11 6B41)",
      "Attention captured by intrusions, threat-scanning or dissociation rather than novelty",
      "As a child: watchful, frozen or withdrawn, or swinging between neediness, rejection and aggression towards caregivers, rather than restless and novelty-seeking (ICD-11 6B41 developmental presentations)",
      "Symptoms worse with reminders, conflict or perceived threat, and better in reliably safe settings",
      "Onset or marked worsening during or after the period of trauma, described by informants",
      "ITQ algorithm met for both PTSD and disturbances in self-organisation",
      "Concentration and emotional control return to normal with trauma-focused treatment, not just partly improve"
    ],
    ask: [
      "Were there long periods in your life when you were hurt, threatened or controlled and could not get away, for example at home as a child or in a relationship?",
      "Do memories from that time come back as if they are happening now, or in nightmares?",
      "Do you feel on guard or unsafe even when you know you are safe?",
      "When you get upset, how long does it take you to calm down: minutes, hours or days?",
      "Do you sometimes feel numb, empty or unable to feel pleasure?",
      "When stressed, do you zone out, feel unreal or lose time? Is that different from drifting off when bored?",
      "How do you see yourself? Does that feeling come from what happened to you, or from the everyday things you keep getting wrong?",
      "What usually ends your relationships or friendships: forgetting, impulsive comments and losing interest, or finding it hard to trust and feel close?",
      "Were there safe times or places in childhood, such as a grandparent's house or a good school year? How were your concentration and restlessness there?",
      "Since you have been safe, have your concentration and organisation changed?",
      "Does a parent, brother or sister have similar problems with focus and restlessness?",
      "Do you harm yourself, or think about ending your life?",
      "Do you use alcohol or drugs to cope with feelings?",
      "Have you had therapy for trauma? Did your attention or emotional control change afterwards?",
      "(Informant, with consent) What were they like at nursery or primary school: restless and distractible, or watchful, frozen or withdrawn?"
    ],
    features: [
      { id: "cptsd_core", t: "Core PTSD features present: re-experiencing, avoidance and sense of current threat", w: 3 },
      { id: "cptsd_threat", t: "Attention captured by intrusions or threat-scanning rather than novelty", w: 3 },
      { id: "cptsd_change", t: "Onset or marked worsening during or after the period of trauma, described by informants", w: 3 },
      { id: "cptsd_treat", t: "Attention and emotional control returned to normal with trauma-focused treatment", w: 3 },
      { id: "cptsd_prolonged", t: "Prolonged or repeated trauma from which escape was difficult or impossible", w: 2 },
      { id: "cptsd_numb", t: "Emotional numbing or inability to feel pleasure", w: 2 },
      { id: "cptsd_dissoc", t: "Dissociation under stress (feeling unreal, losing time)", w: 2 },
      { id: "cptsd_shame", t: "Pervasive shame, guilt or worthlessness linked to the trauma", w: 2 },
      { id: "cptsd_disconnect", t: "Relationships marked by avoidance, distrust or disconnection", w: 2 },
      { id: "cptsd_safe", t: "Concentration and restlessness clearly better in reliably safe settings or periods", w: 2 },
      { id: "cptsd_itq", t: "ITQ algorithm met for both PTSD and disturbances in self-organisation", w: 2 },
      { id: "cptsd_nofam", t: "No family history of ADHD", w: 1 }
    ],
    screen: ["itq", "pcptsd5", "pcl5", "aceq", "msibpd"],
    investigations: [
      "No test diagnoses complex PTSD. Use a trauma-informed interview, over more than one session if needed. The ITQ supports the ICD-11 diagnosis; use its algorithm, not cut-offs (Cloitre et al. 2018).",
      "Assess borderline personality disorder, depression, dissociative disorders and substance use, which often co-occur.",
      "Obtain the earliest records available (health visitor, nursery, primary school, social care) and look for attention problems in safe settings and periods.",
      "Ask about head injury, including from physical abuse or domestic violence.",
      "Safeguarding: current risk to the person and to any children.",
      "UK referral: secondary mental health care or specialist trauma services. For complex PTSD, NICE NG116 advises extra time to build trust, work on barriers to trauma-focused therapy (such as dissociation, emotional dysregulation and negative self-perception) and more sessions where needed."
    ],
    redFlags: [
      "Ongoing abuse or coercive control: safeguarding now.",
      "Self-harm or suicidal thoughts; in complex PTSD suicidality tends to be less frequent but of higher lethality than in borderline personality disorder (ICD-11 6B41 boundary).",
      "Severe dissociation (losing hours, finding evidence of actions not remembered): consider a dissociative disorder and specialist referral.",
      "Psychotic symptoms, which can occur in complex PTSD (ICD-11): assess carefully.",
      "Heavy substance use."
    ],
    decide: {
      better: "Complex PTSD better explains the picture when emotional dysregulation, negative self-concept and relationship problems sit alongside full PTSD features after prolonged trauma, attention problems are driven by intrusions, threat or dissociation, and ADHD-type symptoms are not seen in safe settings or periods.",
      both: "Diagnose both when ADHD symptoms are trait-like, pervasive and present in safe settings and periods (for example a stable school year or after reaching safety), and complex PTSD criteria are also met. A family history of ADHD supports the dual diagnosis.",
      next: "Prioritise safety and stabilisation. Use the ITQ and a trauma-informed interview, and gather the earliest records. If ADHD cannot be separated, record 'uncertain' and reassess after stabilisation or trauma-focused treatment; treating ADHD may help engagement with trauma therapy (CR235 11.5). Assess borderline personality disorder in parallel."
    },
    pearls: [
      "Complex PTSD needs full PTSD first. Without re-experiencing, avoidance and a sense of threat, emotional dysregulation plus low self-esteem is not complex PTSD (ICD-11; ITQ algorithm).",
      "Early chronic trauma erases the 'before' period. Look instead for safe islands: a kind grandparent, a stable placement, a good school year, adulthood after leaving. ADHD shows up there too (clinical practice).",
      "ADHD is highly heritable, so a parent's own ADHD may have contributed to a chaotic home. That is one reason trauma and ADHD so often travel together (CR235 9.7.2).",
      "Emotional patterns can differ: ADHD flare-ups are quick and pass within hours (Kooij et al. 2019); complex PTSD brings numbing, shame and prolonged dysregulation after reminders or perceived threat (ICD-11). Kooij et al. note it is unclear whether ADHD emotional instability differs in kind from that in PTSD, so do not rely on this alone.",
      "Dissociation is losing contact with the present; ADHD daydreaming is drifting to another, more interesting thought. Ask for a detailed description of a recent episode.",
      "Relationships: complex PTSD tends towards avoidance and disconnection, borderline personality disorder towards fear of abandonment and instability (ICD-11 6B41 boundary), and ADHD towards losing people through unreliability and impulsivity."
    ],
    refs: [
      "WHO. ICD-11 CDDR (2024): 6B41 complex post-traumatic stress disorder (essential features, developmental presentations, boundary with personality disorder).",
      "American Psychiatric Association. DSM-5-TR (2022): posttraumatic stress disorder; ADHD criterion E (paraphrased).",
      "Cloitre M et al. The International Trauma Questionnaire. Acta Psychiatr Scand 2018;138:536-46.",
      "Royal College of Psychiatrists. CR235 (2023): 9.7.2 and 11.5.",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34 (section 4.1.4).",
      "CADDRA. Canadian ADHD Practice Guidelines 4.1 (2020): psychological trauma.",
      "Kessler RC et al. Am J Psychiatry 2006;163:716-23 (NCS-R).",
      "Brown NM et al. Associations between adverse childhood experiences and ADHD diagnosis and severity. Acad Pediatr 2017;17:349-55 (cited in CR235).",
      "NICE NG116. Post-traumatic stress disorder (2018)."
    ]
  },

  /* ------------------------------------------------------------------ OCD */
  {
    id: "ocd",
    name: "Obsessive-compulsive disorder",
    group: "anxiety",
    core: false,
    icd11: "6B20 (6B20.0 fair to good insight; 6B20.1 poor to absent insight)",
    summary: "Persistent obsessions (intrusive, unwanted thoughts, images or urges) and/or compulsions (repetitive acts or mental rituals done to neutralise anxiety, by rigid rules or until it feels right), taking more than an hour a day or causing distress or impairment. Obsessional preoccupation, slowness and checking can look like inattention and forgetfulness, while many people with ADHD check because they know they forget. The motive behind the checking and what fills the mind tell them apart.",
    prevalence: "In adults with ADHD: OCD 2.7% over 12 months in the NCS-R, not significantly higher than in adults without ADHD (Kessler et al. 2006). CADDRA places OCD in its 11-30% comorbidity band for adult ADHD, but reported co-occurrence rates are highly inconsistent and lower in adults than in children (Abramovitch et al. 2015). Lifetime prevalence of OCD in the general population is 1-3% (CADDRA).",
    coexist: "sometimes",
    coexistNote: "Both can be diagnosed when each meets criteria independently. ADHD-like symptoms caused by OCD (attention taken up by obsessions, slowness from rituals) can be misdiagnosed as ADHD (Abramovitch et al. 2015), so do not count them towards ADHD. When ADHD and OCD occur together, look for tic disorders (CADDRA); DSM-5-TR has a tic-related OCD specifier.",
    overlap: [
      "Attention drawn away from tasks (by obsessions in OCD, by distraction in ADHD)",
      "Slowness and failure to finish tasks",
      "Repeated checking of doors, appliances, emails or work",
      "Restlessness and feeling unable to relax",
      "Indecision and procrastination",
      "Time lost every day, lateness and missed deadlines",
      "Clutter, or difficulty throwing things away",
      "Irritability when routines are interrupted",
      "Both can begin in childhood, and both co-occur with tics"
    ],
    favoursADHD: [
      "Checking is driven by knowing they are forgetful ('did I really lock it?'), is brief, and carries no dread or rules (CADDRA; CR235 Table 3)",
      "The mind wanders to many unrelated, often interesting thoughts, with no repeated theme or abnormal content (Kooij et al. 2019)",
      "Distraction is external and novelty-driven",
      "Slowness comes from getting side-tracked and starting other things, not from repeating steps until they feel right",
      "Impulsive, risk-taking, novelty-seeking temperament",
      "Clutter results from disorganisation and never getting round to sorting, without distress at throwing things away",
      "Routines are used to manage forgetfulness and are dropped easily when not needed (CR235)",
      "Lifelong difficulties across settings, not tied to particular feared themes"
    ],
    favoursAlt: [
      "Intrusive, unwanted thoughts, images or urges (contamination, harm, sexual, religious, symmetry) that the person tries to ignore, suppress or neutralise (ICD-11 6B20; DSM-5-TR)",
      "Compulsions done to reduce anxiety or prevent a feared outcome, by rigid rules or until it feels 'just right' (ICD-11 6B20)",
      "Checking driven by dread that something terrible will happen, repeated a set number of times or until certain",
      "Mental rituals: counting, repeating phrases, reviewing memories to make sure no harm was caused (ICD-11 6B20)",
      "Obsessions and compulsions take more than an hour a day (ICD-11; DSM-5-TR)",
      "Attention lost to obsessional preoccupation rather than to outside distraction",
      "Cautious, harm-avoidant, perfectionist temperament",
      "Repeated reassurance-seeking about the feared theme",
      "Slowness from repeating or perfecting steps",
      "Avoidance of triggers, such as contamination or sharp objects",
      "Marked distress if a ritual is interrupted",
      "Onset usually in the late teens or early 20s; sudden or late onset needs a medical assessment (ICD-11 course features)"
    ],
    ask: [
      "When you check things, what is in your mind: that you've probably forgotten, or that something terrible will happen if you don't check?",
      "Do you have to check a certain number of times, or until it feels right?",
      "How do you feel if you are stopped from checking or finishing a routine?",
      "Do you get unwanted thoughts, images or urges that upset you and that you try to push away or cancel out?",
      "When you lose focus at work, is your mind on those thoughts, or wandering to more interesting things?",
      "Do you do things in your head to feel safe, such as counting, repeating words or going back over memories?",
      "How much time do rituals or checking take on a typical day?",
      "Are you slow because you do things perfectly or repeat them, or because you get distracted and start something else?",
      "Do you ask others for reassurance about the same worries again and again?",
      "Would you call yourself a risk-taker, or very cautious?",
      "If your home is cluttered, is that because you never get round to tidying, or because throwing things away feels wrong or dangerous?",
      "Do you avoid touching certain things or going to certain places because of what might happen?",
      "Have you ever had tics, such as blinking, sniffing, throat clearing or jerking movements?",
      "When did the habits start? Was that before or after the concentration problems were noticed?",
      "As a child, were you restless and distractible, or careful and worried about doing things the right way?",
      "Has anyone in your family had OCD, tics or ADHD?",
      "(Informant) Do they repeat things until they feel right and get upset if stopped, or do they just lose track and forget?"
    ],
    features: [
      { id: "ocd_obs", t: "Intrusive, unwanted thoughts, images or urges that are resisted or neutralised", w: 3 },
      { id: "ocd_comp", t: "Compulsions done to reduce anxiety or prevent harm, by rules or until 'just right'", w: 3 },
      { id: "ocd_capture", t: "Attention lost to obsessional preoccupation rather than outside distraction", w: 3 },
      { id: "ocd_treat", t: "Attention returned to normal when OCD was treated (ERP or an SSRI)", w: 3 },
      { id: "ocd_check", t: "Checking driven by dread, repeated a set number of times or until certain", w: 2 },
      { id: "ocd_mental", t: "Mental rituals (counting, repeating phrases, reviewing memories)", w: 2 },
      { id: "ocd_time", t: "Obsessions and compulsions take more than an hour a day", w: 2 },
      { id: "ocd_slow", t: "Slowness from repeating or perfecting steps", w: 2 },
      { id: "ocd_distress", t: "Marked distress if a ritual is interrupted", w: 2 },
      { id: "ocd_child", t: "No childhood restlessness or impulsivity; described as careful and worried", w: 2 },
      { id: "ocd_harmavoid", t: "Cautious, harm-avoidant, perfectionist temperament", w: 1 },
      { id: "ocd_reassure", t: "Repeated reassurance-seeking about feared themes", w: 1 },
      { id: "ocd_avoid", t: "Avoidance of triggers (contamination, sharp objects, particular numbers or places)", w: 1 }
    ],
    screen: ["ocir", "ybocs"],
    investigations: [
      "No test diagnoses OCD; the diagnosis is clinical. The OCI-R (self-report) and Y-BOCS (clinician-rated severity) support assessment in specialist services; their licence status is not confirmed, so they are described but not reproduced here.",
      "Sudden onset, or onset after about 35, needs assessment for a medical cause such as a basal ganglia stroke (ICD-11 6B20 course features).",
      "Check for substance-induced symptoms: ICD-11 gives amfetamine as an example of a substance that can cause obsessive-compulsive symptoms.",
      "Ask about and look for tics.",
      "Consider autism if repetitive behaviours are wanted, enjoyable or calming rather than anxiety-driven.",
      "Ask about the perinatal period: onset or worsening of OCD around pregnancy and after birth is recognised (ICD-11).",
      "UK referral: NHS Talking Therapies for CBT with exposure and response prevention (ERP), in line with NICE CG31; secondary care or specialist OCD services for severe or treatment-resistant OCD."
    ],
    redFlags: [
      "Intrusive thoughts of harming a baby or child: distinguish unwanted, distressing obsessions (not acted on) from intent, assess carefully and avoid an alarmist response.",
      "Poor or absent insight with fixed beliefs: consider a psychotic disorder (ICD-11 6B20 boundary).",
      "Sudden onset in adulthood, or neurological signs: medical assessment.",
      "Rituals so severe that the person cannot eat, wash or leave home.",
      "Depression or suicidal thoughts alongside OCD: assess risk.",
      "Obsessional symptoms that started or worsened after starting a stimulant."
    ],
    decide: {
      better: "OCD better explains the picture when inattention reflects time and attention lost to obsessions and rituals, checking is anxiety-driven and rule-bound, and there is no childhood history of ADHD across settings.",
      both: "Diagnose both when trait ADHD symptoms (distractibility, restlessness, impulsivity) are present outside the obsessional themes and since childhood, and OCD criteria are also met. Check for tics.",
      next: "Explore the motive behind each repetitive behaviour. Use the OCI-R or Y-BOCS where available. If both are present, treat them together; the presence of OCD does not change the treatment approach for either (CADDRA). Stimulants do not usually worsen OCD (CADDRA, citing a 2014 review), but monitor obsessional symptoms during titration."
    },
    pearls: [
      "Ask what would happen if they did not check. 'I'd probably have left it on' sounds like ADHD; 'something terrible would happen and it would be my fault' sounds like OCD.",
      "Compensatory checking in ADHD is a fix for forgetfulness, not OCD (CADDRA; CR235 Table 3).",
      "ADHD mind-wandering has no pattern of repeated thoughts or abnormal content (Kooij et al. 2019); obsessional thoughts keep returning to the same feared theme.",
      "Temperament helps: ADHD tends towards risk and novelty, OCD towards caution and harm avoidance (clinical practice).",
      "ADHD with OCD raises the likelihood of tics or Tourette syndrome (CADDRA), and up to 30% of people with OCD have a tic disorder at some point (ICD-11). Ask about tics every time.",
      "30-50% of adults with OCD report a childhood onset (ICD-11), so childhood rituals do not point to ADHD. Ask specifically about restlessness and distractibility in situations unrelated to the rituals.",
      "Autistic routines are usually wanted and calming; OCD rituals are unwanted and anxiety-driven (clinical practice)."
    ],
    refs: [
      "American Psychiatric Association. DSM-5-TR (2022): obsessive-compulsive disorder (insight and tic-related specifiers); ADHD criterion E (paraphrased).",
      "WHO. ICD-11 CDDR (2024): 6B20 obsessive-compulsive disorder (essential features, course features, boundaries).",
      "CADDRA. Canadian ADHD Practice Guidelines 4.1 (2020): obsessive-compulsive disorder.",
      "Abramovitch A et al. Comorbidity between ADHD and OCD across the lifespan: a systematic and critical review. Harv Rev Psychiatry 2015;23:245-62.",
      "Kessler RC et al. Am J Psychiatry 2006;163:716-23 (NCS-R).",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34 (section 4.1.5).",
      "Royal College of Psychiatrists. CR235 (2023): Table 3.",
      "Foa EB et al. The Obsessive-Compulsive Inventory: development and validation of a short version. Psychol Assess 2002;14:485-96.",
      "Goodman WK et al. The Yale-Brown Obsessive Compulsive Scale. Arch Gen Psychiatry 1989.",
      "NICE CG31. Obsessive-compulsive disorder and body dysmorphic disorder: treatment (2005)."
    ]
  }
]);
