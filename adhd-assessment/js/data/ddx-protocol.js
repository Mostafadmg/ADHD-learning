/* ddxProtocol: the systematic differential diagnosis protocol for adult ADHD (ARCHITECTURE.md 5.11).
   Shown on the "Differential diagnosis protocol" page (route ddxguide) and inside the assessment's
   differential step. 14 steps (p1..p14), each with a goal, actions, questions, tools (canonical tool ids),
   conditions covered (canonical ddx ids), decision rules, red flags and tickable checks (<stepId>_c<n>).
   Ticks are stored as ddxProtocol.<checkId> on the assessment record, or in AA.progress sandbox.ddxProtocol.
   Purpose: a reliable, documented conclusion on DSM-5-TR criterion E (not better explained by another
   condition, not only during a psychotic disorder) and on co-occurring conditions. It maximises
   reliability; it does not promise certainty.
   Original content. UK practice (NICE NG87) is the default frame, with UKAAN AQAS 2024, RCPsych CR235 (2023),
   the European Consensus (Kooij et al. 2019), CADDRA 4.1, the Australian guideline (AADPA 2022; May et al. 2023),
   WFADHD 2021, DSM-5-TR and the WHO ICD-11 CDDR. DSM-5-TR and ICD-11 are paraphrased. DIVA wording is not
   reproduced. Interview questions are original prompts built from the cited discriminating features; they are
   not a validated instrument. Statements without a named source are clinical practice.
   Sources: research briefs of 21 October 2026 (ddx-evidence, guidelines-uk, guidelines-intl, tools-adhd,
   tools-comorbid). */
AA.add('ddxProtocol', {

  intro: "<p>This protocol is a fixed route through the differential diagnosis of adult ADHD. Work through the steps in order. Each step names the conditions it covers, the tools that can help, the questions to ask and the rules for deciding. Tick the checks before you move on.</p>" +
    "<p>The protocol answers two questions. First, <strong>DSM-5-TR criterion E</strong>: are the symptoms better explained by another condition, or do they occur only during a psychotic disorder? Second: <strong>which other conditions are present alongside ADHD</strong>? Both matter. About half of adults with ADHD in the WHO World Mental Health surveys (51.7%) had at least one other mental disorder in the past year, and the European Consensus puts lifetime comorbidity at 60-80%.</p>" +
    "<p>The same six tests run through every step:</p>" +
    "<ol><li><strong>Onset</strong>: were several symptoms present before age 12, and before the other condition began?</li>" +
    "<li><strong>Course</strong>: are the symptoms trait-like and continuous, or do they come and go in episodes?</li>" +
    "<li><strong>Persistence</strong>: are the symptoms still there when the other condition is absent or treated?</li>" +
    "<li><strong>Pervasiveness</strong>: do they occur across settings and moods, or only in the situations and states that belong to the other condition?</li>" +
    "<li><strong>Specific features</strong>: is there anything that belongs only to the other condition, such as reduced need for sleep, flashbacks or abandonment fear?</li>" +
    "<li><strong>Independent evidence</strong>: what do informants, school reports and records say?</li></ol>" +
    "<p>No screening score makes the differential. Screens are triggers for a closer look. Following the protocol makes the conclusion more reliable and easier to defend, but it remains a clinical judgement. When the picture is unclear, the honest verdict is <em>uncertain</em>, with a plan to reassess.</p>",

  principles: [
    "Diagnose both when both are present. A co-occurring condition does not rule out ADHD. It rules it out only when it better explains the symptoms (NICE NG87 1.2.10; WFADHD 2021). No condition has to be excluded before ADHD can be diagnosed (AADPA 2022).",
    "ADHD is trait-like and starts in childhood. Look for several symptoms before age 12 and a continuous course since then. Ups and downs driven by demands and support are expected; episodes that are a change from the usual self are not (UKAAN AQAS 2024).",
    "Never diagnose ADHD from symptoms that occur only during an episode: depression, hypomania or mania, psychosis, intoxication or withdrawal, or a spell of severe sleep loss. The test is whether the symptoms were there before and persist between episodes.",
    "Treat urgent and severe conditions first. Suicide risk, psychosis, mania, severe depression, severe anxiety and unstable substance use come before the ADHD question (European Consensus 2019; CADDRA 4.1).",
    "Reassess after stabilisation. If another condition may explain the symptoms and the childhood evidence is unclear, treat that condition first, then review current ADHD symptoms once it has settled.",
    "Every condition gets a verdict: absent, co-occurring, better explains, or uncertain. A condition that was not asked about is not absent.",
    "Screens trigger questions; they do not diagnose. Positive MDQ, AQ-10 and MSI-BPD results are common in adults with ADHD and need a clinical interview, not a label.",
    "Do not double-count. A symptom explained by another condition, such as not listening because of autistic social-communication difference, or poor concentration during a depressive episode, does not count towards ADHD (UKAP ADHD and autism consensus 2020).",
    "Ask two questions about every overlapping symptom: 'Since when?' and 'What is it like when the other problem is absent?'. Together they separate most mimics from ADHD.",
    "Seek independent evidence. Informants who knew the person before age 12, school reports and records outweigh recall alone. Missing collateral is not by itself a reason to refuse a diagnosis (CR235 9.5), but it lowers confidence.",
    "Response to stimulant medicine is not a diagnostic test. Stimulants improve some aspects of attention in people without ADHD.",
    "Think of masking and compensation. High ability, structured families, anxiety and camouflaging can hide ADHD in childhood, especially in girls and women (NICE NG87 1.2.2; UKAAN consensus on females 2020)."
  ],

  steps: [

    /* ------------------------------------------------------------------ p1 */
    {
      id: "p1", n: 1, title: "Safety and urgent presentations first",
      goal: "Find anything that needs action today, before the ADHD question: risk to self or others, psychosis, mania, intoxication or withdrawal, a neurological emergency or a safeguarding concern.",
      do: [
        "Before you start, read the referral, records and returned forms for red flags: PHQ-9 item 9, recent self-harm, previous admissions, psychosis, mania, heavy substance use, a recent head injury or seizures.",
        "Ask about suicidal thoughts and self-harm directly in every assessment. If present, explore them clinically and agree a safety plan. Use the C-SSRS screener as a structured prompt, not as a risk score (NICE NG225 1.6.1-1.6.3: do not use risk tools or low, medium or high stratification to predict suicide).",
        "Screen for psychotic experiences: voices or visions, persecutory or unusual beliefs, and thoughts felt to be inserted, broadcast or controlled.",
        "Screen for a current high or mixed state: elevated or very irritable mood with markedly reduced need for sleep, pressured speech or grandiosity.",
        "Check whether the patient is intoxicated or in withdrawal now. If so, do not continue the diagnostic interview today; address safety and rebook.",
        "Ask about new neurological symptoms: a recent head injury, seizures, new severe headache, weakness, confusion, or a rapid change in memory or personality. These need a medical opinion first.",
        "Ask about risk to others and from others, including domestic abuse, and about children or vulnerable adults in the patient's care. Follow local safeguarding procedures.",
        "Ask about driving: crashes, near misses and falling asleep at the wheel. Advise not to drive while sleepy and follow DVLA guidance.",
        "Decide whether to continue, pause and act, or stop and refer. Record what you found, what you did and why."
      ],
      ask: [
        "Have things been so hard lately that you have thought about ending your life, or wished you were not here?",
        "Have you ever harmed yourself on purpose? When was the most recent time?",
        "Have you heard voices or seen things that other people could not?",
        "Have you felt that people were watching you, following you or plotting against you?",
        "In the last few weeks, have you needed much less sleep than usual but still felt full of energy?",
        "When did you last have alcohol or drugs, and how much have you had today?",
        "Do you get shaky, sweaty or sick when you go without a drink or a drug?",
        "Have you had a head injury, a blackout or a fit recently?",
        "Has your memory or personality changed quickly over the last few months, or has anyone told you so?",
        "Is anyone hurting you, threatening you or controlling you at home?",
        "Do you look after children or anyone else? Are they safe?",
        "Have you had any crashes or near misses while driving, or nodded off at the wheel?"
      ],
      tools: ["cssrs", "phq9", "pq16", "auditc"],
      conds: ["psychosis", "bip", "dep", "sud_alcohol", "sud_stim", "tbi", "epilepsy"],
      decide: [
        "Suicidal intent or a plan, current psychosis or mania, intoxication, significant withdrawal or a neurological emergency: stop the ADHD assessment, act today, and rebook once the person is safe and stable.",
        "If psychotic symptoms are present, ADHD cannot be diagnosed from symptoms that occur only during the psychotic disorder (DSM-5-TR criterion E). A clear childhood history may still support co-occurring ADHD later, under specialist oversight. Psychotic symptoms are not features of ADHD (CR235 9.7.9).",
        "Passive thoughts of death or past self-harm without current intent: continue with a safety plan, share it with the GP, and keep risk in mind throughout.",
        "Abrupt onset of hyperactivity or inattention in adolescence or adulthood should raise the possibility of another cause, such as emerging psychosis or bipolar disorder (ICD-11 CDDR). Substances and new medical problems are the other common causes.",
        "A safeguarding concern does not stop the assessment, but it must be acted on under local policy, on the same day if anyone is at immediate risk."
      ],
      redFlags: [
        "Suicidal intent, a plan, a recent attempt or escalating self-harm",
        "Hallucinations, delusions or thought disorder",
        "Elevated or irritable mood now, with markedly reduced need for sleep",
        "Intoxication at the appointment, or alcohol withdrawal signs such as tremor, sweating or confusion",
        "New neurological signs, seizures, or rapid change in cognition or personality",
        "Risk to children, domestic abuse, or violence to others",
        "Sleepiness or accidents while driving"
      ],
      checks: [
        { id: "p1_c1", t: "Asked about suicidal thoughts and self-harm, and acted on any risk found" },
        { id: "p1_c2", t: "Screened for current psychotic symptoms" },
        { id: "p1_c3", t: "Screened for a current high or mixed mood state" },
        { id: "p1_c4", t: "Confirmed the patient is not intoxicated or in withdrawal today" },
        { id: "p1_c5", t: "Asked about recent head injury, seizures and rapid cognitive change" },
        { id: "p1_c6", t: "Asked about safeguarding: risk to others, from others and to dependants" },
        { id: "p1_c7", t: "Recorded the decision to continue, pause or refer, and why" }
      ]
    },

    /* ------------------------------------------------------------------ p2 */
    {
      id: "p2", n: 2, title: "Build the life-course timeline",
      goal: "Draw one life chart from early childhood to now that shows when ADHD-type symptoms started, how they behaved over time, and how they relate to every other problem, so that onset and course can be judged.",
      do: [
        "Draw a timeline by life stage: preschool, primary school, secondary school, further study or training, each job, relationships, parenthood, and later changes such as menopause or retirement.",
        "Mark when ADHD-type symptoms were first noticed, by whom and in what setting. Record concrete examples from before age 12 and their source: patient, parent, sibling or school report.",
        "Add lanes on the same chart for mood episodes, anxiety, trauma, substance use (first use, peak, abstinent spells), sleep problems, head injuries and illnesses, medicines (start and stop dates) and major stresses.",
        "Mark the windows when each other problem was absent: well spells between mood episodes, abstinence, good sleep, safe settings, holidays. These windows test whether ADHD symptoms persist without the other condition.",
        "Mark changes in structure and support, such as leaving home, starting university, a new job, or losing a partner who organised things. Symptoms that surface when support falls away suggest ADHD unmasked, not new onset.",
        "Describe the course in one phrase: lifelong and trait-like; trait-like with episodes on top; episodic only; or started after a clear event.",
        "Check the timeline against informants and records, and note where they agree and where they differ."
      ],
      ask: [
        "What is your earliest memory of struggling to concentrate, sit still or get organised?",
        "What did teachers write about you in your primary school reports?",
        "Was there ever a time when these problems were not there at all? What was different then?",
        "Did they get worse when something changed, such as moving school, leaving home or starting a job?",
        "Which came first: the concentration problems, or the low mood, worry, drinking or poor sleep?",
        "When the low mood, worry or drinking settled, did the concentration problems go too, or stay as they always were?",
        "Who kept you organised when you were growing up? What happened when they were not around?",
        "Has anything changed you suddenly, such as an injury, an illness or a frightening event?",
        "Which medicines have you taken over the years, and did any of them change your focus?",
        "(Informant) What were they like at age 6 to 10, compared with their brothers, sisters or classmates?"
      ],
      tools: ["wurs25", "diva5", "diva2", "aceplus"],
      conds: ["dep", "bip", "ptsd", "sud_cannabis", "sud_alcohol", "tbi", "mci"],
      decide: [
        "Several symptoms before age 12 and a continuous course since then support ADHD. Fluctuation with demands, interest and support is expected and does not make the course episodic.",
        "Symptoms that appear only with mood episodes, substance use, trauma, illness or injury, and resolve with them, point to that condition. Separate trait-based from state-based disorders (CR235 9.7).",
        "Clear onset after age 12 with no earlier signs, even allowing for masking: DSM-5-TR criterion B is not met, so look hard for another cause. In a follow-up of 239 young people without childhood ADHD, about 95% of those who screened positive on symptom checklists were excluded from a late-onset diagnosis after full assessment. Among those with impairing symptoms, the commonest reason was symptoms occurring only with heavy substance use (Sibley et al. 2018).",
        "Uncertain onset is not by itself a reason to exclude ADHD (NICE NG87 1.3.3). Without corroboration of childhood symptoms, diagnose with caution (ICD-11 CDDR).",
        "ADHD-type symptoms that persist in the windows when the other problems were absent make ADHD more likely."
      ],
      redFlags: [
        "First symptoms in middle or later life with no earlier signs",
        "Stepwise change after a head injury, illness, new medicine or trauma",
        "Decline from a previously good level of functioning",
        "Informants describe a change in the person rather than how they always were"
      ],
      checks: [
        { id: "p2_c1", t: "Drew a life chart from early childhood to now" },
        { id: "p2_c2", t: "Recorded at least two concrete examples from before age 12, with their source" },
        { id: "p2_c3", t: "Plotted mood, anxiety, trauma, substance, sleep, medical and medicine lanes" },
        { id: "p2_c4", t: "Identified the periods when each other problem was absent" },
        { id: "p2_c5", t: "Classified the course: trait-like, trait plus episodes, episodic only, or acquired" },
        { id: "p2_c6", t: "Compared the timeline with informants and records" }
      ]
    },

    /* ------------------------------------------------------------------ p3 */
    {
      id: "p3", n: 3, title: "Check that symptoms exceed peers and are pervasive",
      goal: "Confirm that the symptoms are more frequent and more impairing than in people of the same age, ability and culture, and that they occur across settings rather than in one situation.",
      do: [
        "For each reported symptom, ask for recent, concrete examples and how often they happen. Answer 'everyone does that' with frequency, severity and impact, not with the behaviour itself.",
        "Compare with the right peer group: the same age, intellectual level, education, job and culture. Ask how colleagues, siblings or friends manage the same demands.",
        "Check at least two settings, such as work, home, study, relationships and leisure. Look for interference with functioning, not just annoyance (DSM-5-TR criteria C and D; NICE NG87 1.3.3: at least moderate impairment, in 2 or more important settings).",
        "Look for situational causes: an overloaded job, a new baby, a carer role, a financial crisis, bereavement. Ask what happens when the pressure is lifted.",
        "Ask about phone, social media and gaming habits. Distraction that starts with the device and settles when it is out of reach is not, by itself, evidence of ADHD.",
        "Consider culture, language and education. Use an interpreter if needed, and judge behaviour against the person's cultural norms (ICD-11 CDDR).",
        "Consider high ability and compensation. Good results do not exclude ADHD; ask what it costs to achieve them (UKAAN AQAS 2024).",
        "Treat self-rating scales as a baseline, not as proof. Their questions are leading, and UKAAN advises against using them as a formative part of the diagnosis (UKAAN AQAS 2024). Norms, for example from the CAARS 2, give only a rough guide to how unusual the symptoms are."
      ],
      ask: [
        "Can you give me an example from the last week or two?",
        "How often does that happen: every day, every week, or now and then?",
        "How do your colleagues or friends cope with the same workload?",
        "What has this cost you: jobs, money, relationships or safety?",
        "Does this happen at home as well as at work, and with friends as well as on your own?",
        "If your workload halved tomorrow, would these problems go away?",
        "How much time do you spend on your phone each day? Are you just as distracted when it is in another room?",
        "How much extra time or effort does it take you to keep up?",
        "Was there a time in your life with less pressure? How were you then?",
        "(Informant) Compared with other people their age, how unusual is this?"
      ],
      tools: ["asrs18", "caars2", "wfirs"],
      conds: ["normal", "gifted", "burnout"],
      decide: [
        "Count a symptom only if it is frequent, has lasted at least 6 months, goes beyond what is expected for age and ability, and interferes with functioning. Occasional lapses are normal.",
        "Symptoms confined to one setting or one situation do not pass the pervasiveness test. Look for a situational, sensory or learning explanation.",
        "Impairment explained by an exceptional workload, a crisis or a device habit, with good functioning once the pressure is lifted, points to normal variation or situational stress rather than ADHD.",
        "High achievement does not rule out ADHD when there is clear evidence of excessive effort, compensation and impairment elsewhere.",
        "If you cannot obtain concrete examples, do not count the symptom. Note it, and look for informant evidence."
      ],
      redFlags: [
        "Symptoms described only in general terms, with no examples",
        "Impairment only in one role, such as a new and demanding job",
        "A self-diagnosis built from online content, described as symptom lists rather than experiences",
        "Problems that began with a new life situation and are easing as it settles"
      ],
      checks: [
        { id: "p3_c1", t: "Obtained concrete, recent examples for each symptom counted" },
        { id: "p3_c2", t: "Judged frequency and severity against the right peer group" },
        { id: "p3_c3", t: "Confirmed several symptoms in at least two settings" },
        { id: "p3_c4", t: "Confirmed at least moderate impairment, with examples" },
        { id: "p3_c5", t: "Considered situational stress, device habits and culture" },
        { id: "p3_c6", t: "Considered high ability and compensation" }
      ]
    },

    /* ------------------------------------------------------------------ p4 */
    {
      id: "p4", n: 4, title: "Mood: depression, persistent depressive disorder and burnout",
      goal: "Decide whether low mood explains the concentration and motivation problems, co-occurs with ADHD, or is a consequence of years of struggling.",
      do: [
        "Screen with the PHQ-9 and take any positive item 9 back to the safety step. Remember that the sleep, energy, concentration and restlessness items overlap with ADHD.",
        "Ask about discrete depressive episodes: two weeks or more of low or empty mood or loss of interest, nearly every day, that was a change from the usual self.",
        "Ask about chronic low mood: depressed for most of the day, on more days than not, for two years or more.",
        "Plot each episode on the timeline and ask what attention, organisation and restlessness were like before, during and after it. CADDRA's key question is 'since when?'.",
        "Separate anhedonia from ADHD boredom. In ADHD, interest returns quickly for novel or rewarding things; in depression, pleasure is lost broadly.",
        "Separate demoralisation from depression. Low self-esteem built on repeated failure and criticism is common in ADHD and lifts when things go well.",
        "Consider burnout: exhaustion, detachment and reduced performance tied to work, easing with time away. ICD-11 classes burn-out as an occupational phenomenon, not a mental disorder.",
        "Ask about low mood after childbirth and mood changes around periods. CR235 names postnatal depression among the conditions to separate from ADHD in women.",
        "Consider thyroid tests where clinically indicated: NICE NG145 1.2.3 suggests considering them in adults with depression or unexplained anxiety."
      ],
      ask: [
        "Has there been a time of two weeks or more when you felt low or empty most of the day, nearly every day?",
        "When you are low, do you lose interest in everything, or only in tasks that are dull or hard?",
        "Did the concentration problems start before you ever felt depressed? Were they there at primary school?",
        "When your mood has been good, for example on holiday or early in a relationship, were you still disorganised and forgetful?",
        "When a low spell lifted, did your focus return to normal, or to your usual level of struggle?",
        "Is your sleep problem getting off to sleep because your mind is busy, or waking very early and not getting back to sleep?",
        "Have your appetite or weight changed? Do you feel slowed down in body or mind?",
        "Has your mood been low on most days for the last two years?",
        "Does your mood lift when something good happens?",
        "Is the exhaustion mainly about work? How are you after two weeks off?",
        "Have antidepressants helped your mood? Did they change your concentration?"
      ],
      tools: ["phq9", "cssrs"],
      conds: ["dep", "pdd", "burnout"],
      decide: [
        "Concentration problems that occur only during depressive episodes, with normal attention between them and no childhood history, are better explained by depression. Count them towards ADHD only if they were present since childhood and persist after the episode resolves (ICD-11 CDDR).",
        "Childhood-onset symptoms that persist between episodes: diagnose both. In the WHO surveys, ADHD began before the mood disorder in most adults who had both (Fayyad et al. 2017).",
        "Severe depression or suicide risk: treat the depression first, then reassess current ADHD symptoms when mood has improved (European Consensus 2019; CADDRA 4.1; CR235 section 10).",
        "Chronic low mood that follows a life of ADHD-related failure may be demoralisation, or persistent depressive disorder co-occurring with ADHD. Record both and review mood after ADHD treatment.",
        "Burnout explains the picture only when symptoms began with work overload, are tied to work stress and recover with rest. It cannot explain childhood symptoms."
      ],
      redFlags: [
        "PHQ-9 item 9 scored 1 or more, or any suicidal thoughts",
        "Psychotic features, marked slowing, or not eating and drinking",
        "A recent, sharp decline in functioning",
        "A past high, wired or agitated reaction to an antidepressant (consider bipolar disorder)"
      ],
      checks: [
        { id: "p4_c1", t: "Screened for depression and reviewed the suicide item" },
        { id: "p4_c2", t: "Asked about past and current depressive episodes and plotted them on the timeline" },
        { id: "p4_c3", t: "Asked about chronic low mood lasting two years or more" },
        { id: "p4_c4", t: "Compared attention and organisation in and out of low mood" },
        { id: "p4_c5", t: "Separated anhedonia and demoralisation from ADHD boredom" },
        { id: "p4_c6", t: "Considered work-related burnout" },
        { id: "p4_c7", t: "Recorded verdicts for depression, persistent depressive disorder and burnout" }
      ]
    },

    /* ------------------------------------------------------------------ p5 */
    {
      id: "p5", n: 5, title: "Bipolar spectrum",
      goal: "Rule bipolar disorder and cyclothymia in or out. They mimic ADHD, often co-occur with it, and change which treatment is safe.",
      do: [
        "Ask about distinct periods, lasting days rather than hours, when mood was high, expansive or very irritable and energy was raised, and that others saw as a change from the usual self. DSM-5-TR requires at least 4 consecutive days for hypomania and at least a week for mania, unless admission was needed.",
        "Ask specifically about reduced need for sleep: sleeping 3 or 4 hours and not feeling tired. This differs from the ADHD pattern of struggling to get to sleep and being exhausted the next day (CADDRA 4.1).",
        "Look for features that belong to mania or hypomania: grandiosity, speech more pressured than the usual chattiness, thoughts racing faster than usual, and out-of-character spending or sexual behaviour.",
        "Ask about highs triggered by antidepressants, past psychotic symptoms, hospital admissions, and family history of bipolar disorder, psychosis or suicide.",
        "Use the MDQ or HCL-32 only as a prompt for this interview. About half of adults with ADHD screened positive on the MDQ in one study (Lundervold et al. 2020). NICE CG185 1.2.3 advises against questionnaires to identify bipolar disorder in primary care.",
        "Separate ADHD emotional lability (brief, reactive, back to baseline within hours: European Consensus 2019) from mood episodes (sustained for days to weeks) and from cyclothymia (numerous high and low periods over at least two years that fall short of full episodes).",
        "Ask an informant whether there were spells when the person was clearly not their usual self.",
        "If the picture stays unclear, ask the patient to keep a daily mood and sleep chart for several weeks."
      ],
      ask: [
        "Have you had a spell of several days when you needed much less sleep but felt full of energy?",
        "During that time, did you feel unusually happy, powerful or important, or very irritable?",
        "Did other people say you were not your usual self? What did they notice?",
        "How long did it last, and how did it start and end?",
        "Were your thoughts racing faster than your normal busy mind?",
        "Did you spend money or take risks in a way that was unusual even for you?",
        "When your mood changes, does it last minutes to hours after something happens, or days to weeks for no clear reason?",
        "Has an antidepressant ever made you feel wired, euphoric or unable to sleep?",
        "Has anyone in your family had bipolar disorder or psychosis, or taken their own life?",
        "Between these spells, were you still distractible, late and disorganised, as you were as a child?",
        "(Informant) Have there been times when they were clearly different from their usual self for days at a time?"
      ],
      tools: ["mdq", "hcl32"],
      conds: ["bip", "cyclo"],
      decide: [
        "Inattention, talkativeness, impulsivity and restlessness that occur only within discrete mood episodes, with no childhood or between-episode ADHD, are better explained by bipolar disorder. Late onset, an episodic course and the intensity of mood elevation point to bipolar disorder (ICD-11 CDDR).",
        "Childhood-onset ADHD symptoms that are present between episodes, when mood is stable: diagnose both.",
        "Suspected or confirmed bipolar disorder: refer to psychiatry and stabilise mood first. Methylphenidate without a mood stabiliser has been associated with a higher risk of manic switch (European Consensus 2019, section 7.5.1).",
        "Lifelong, brief, reactive mood swings without sustained episodes fit ADHD emotional dysregulation. Consider cyclothymia only when high and low periods are numerous, last beyond a reaction to events and span at least two years.",
        "A positive MDQ or HCL-32 without interview evidence of discrete episodes is not evidence of bipolar disorder."
      ],
      redFlags: [
        "Reduced need for sleep without tiredness",
        "Grandiosity or psychotic symptoms during high periods",
        "Mania or hypomania triggered by an antidepressant",
        "Bipolar disorder in a first-degree relative",
        "A current high or mixed state at the appointment"
      ],
      checks: [
        { id: "p5_c1", t: "Asked about discrete high or irritable periods lasting days" },
        { id: "p5_c2", t: "Asked about reduced need for sleep, separately from trouble getting to sleep" },
        { id: "p5_c3", t: "Asked about antidepressant-induced highs and family history" },
        { id: "p5_c4", t: "Interpreted any positive MDQ or HCL-32 against interview evidence" },
        { id: "p5_c5", t: "Separated brief reactive lability from sustained mood episodes" },
        { id: "p5_c6", t: "Sought an informant view of any change from the usual self" },
        { id: "p5_c7", t: "Recorded verdicts for bipolar disorder and cyclothymia" }
      ]
    },

    /* ------------------------------------------------------------------ p6 */
    {
      id: "p6", n: 6, title: "Anxiety disorders and OCD",
      goal: "Decide whether worry, fear or obsessions explain the poor concentration and restlessness, or sit alongside ADHD.",
      do: [
        "Screen with the GAD-7, remembering that the items on trouble relaxing, restlessness and irritability overlap with ADHD.",
        "Ask what fills the mind when concentration fails: one worry going round (anxiety), unwanted intrusive thoughts (OCD), or many unrelated thoughts and distractions (ADHD).",
        "Ask whether inattention and fidgeting happen when calm. In ADHD they occur regardless of emotional state; in anxiety they occur mainly when anxious (CADDRA 4.1).",
        "Ask about physical anxiety symptoms, avoidance and anticipatory worry, and about panic attacks: sudden surges of fear that peak within minutes.",
        "In social situations, ask whether the problem is fear of being judged (social anxiety) or interrupting, drifting off and forgetting plans (ADHD).",
        "Explore checking. Checking because 'I know I forget' is compensation; checking to prevent harm, by rules or until it feels right, suggests OCD.",
        "Ask about caffeine, energy drinks, decongestants and other activating substances that can cause anxiety and restlessness. If the anxiety is unexplained, consider thyroid tests (NICE NG145 1.2.3).",
        "Ask which came first and plot anxiety on the timeline. In the WHO surveys, ADHD usually began before anxiety disorders other than specific phobia (Fayyad et al. 2017)."
      ],
      ask: [
        "When you cannot concentrate, what is going through your mind?",
        "On a calm day with nothing to worry about, are you still distractible and losing things?",
        "Which came first, the worrying or the concentration problems?",
        "When you are anxious, do you get a racing heart, a tight chest, shaking or an upset stomach?",
        "Have you had sudden attacks of intense fear that peak within minutes?",
        "In a group, is the hard part fear of being judged, or keeping track of the conversation?",
        "Do you avoid places or people because of fear?",
        "When you check things, is it because you know you forget, or because something bad might happen if you don't?",
        "Do you have to repeat things a set number of times, or until they feel right?",
        "Do upsetting thoughts or images push into your mind against your will?",
        "How much coffee or energy drink do you have in a day?",
        "As a child, were you seen as a worrier, or as dreamy, fidgety and chatty?"
      ],
      tools: ["gad7", "ocir", "ybocs"],
      conds: ["gad", "social", "panic", "ocd"],
      decide: [
        "Inattention that occurs only when anxious, or only in feared situations, with no childhood ADHD, is better explained by the anxiety disorder (ICD-11 CDDR).",
        "Trait inattention and restlessness in calm, low-anxiety settings since childhood: diagnose both. Anxiety is one of the commonest co-occurring conditions.",
        "Inattention caused by obsessions, and checking driven by fear of harm, point to OCD. Compensatory checking for forgetfulness does not.",
        "Severe anxiety: treat it first, and reassess ADHD symptoms once it has eased. Milder anxiety can be treated alongside ADHD (European Consensus 2019).",
        "Anxiety that is mainly about real, repeated ADHD failures, such as lateness, lost items and missed deadlines, is often secondary. Record it and review it after ADHD treatment."
      ],
      redFlags: [
        "Panic with chest pain, fainting or palpitations that has not been medically assessed",
        "Avoidance so severe that the person is housebound",
        "Distressing intrusive thoughts of harm: assess sensitively, as they usually reflect OCD rather than intent",
        "Heavy caffeine or stimulant use driving the anxiety"
      ],
      checks: [
        { id: "p6_c1", t: "Screened for anxiety and reviewed the overlapping items" },
        { id: "p6_c2", t: "Asked what fills the mind when concentration fails" },
        { id: "p6_c3", t: "Compared attention in calm and anxious states" },
        { id: "p6_c4", t: "Asked about panic attacks, social fear and avoidance" },
        { id: "p6_c5", t: "Explored the motive for any checking and asked about obsessions" },
        { id: "p6_c6", t: "Reviewed caffeine and other activating substances" },
        { id: "p6_c7", t: "Recorded verdicts for generalised anxiety, social anxiety, panic disorder and OCD" }
      ]
    },

    /* ------------------------------------------------------------------ p7 */
    {
      id: "p7", n: 7, title: "Trauma: PTSD and complex PTSD",
      goal: "Find out whether trauma explains the hypervigilance, poor concentration and emotional dysregulation, or whether ADHD was present before it.",
      do: [
        "Use a trauma-informed approach: explain why you are asking, ask permission, and do not ask for details of the events unless they are needed.",
        "Ask about trauma and adversity across the life span, including childhood abuse, neglect, domestic abuse and bereavement.",
        "Screen with the PC-PTSD-5, and use the PCL-5 or the ITQ if it is positive. The ITQ also covers complex PTSD (ICD-11).",
        "Ask about re-experiencing in the present (flashbacks, nightmares), avoidance of reminders, and a persistent sense of current threat.",
        "Ask whether loss of focus comes from intrusions or scanning for danger, or from outside distractions and mind-wandering.",
        "Date the trauma on the timeline and look for evidence from before it: school reports, or a parent's or sibling's account.",
        "For complex PTSD, ask about persistent shame or worthlessness, difficulty feeling close to others, and severe emotional dysregulation after prolonged or repeated trauma.",
        "Ask about dissociation, such as losing time or feeling unreal. Do not mistake dissociative absences for ADHD daydreaming.",
        "If there is current abuse or risk, act on safeguarding first."
      ],
      ask: [
        "Have you been through events where you or someone else was in serious danger, including as a child?",
        "Were the concentration and restlessness problems there before those events?",
        "Do memories come back as if they are happening again, as flashbacks or nightmares?",
        "When your mind drifts, is it pulled towards the past or towards danger, or towards something more interesting?",
        "Do you go out of your way to avoid reminders?",
        "Do you feel constantly on guard, or startle easily?",
        "Do you lose chunks of time, or feel unreal or detached?",
        "How do you see yourself: worthless, ashamed, damaged? Since when?",
        "In a safe and calm place, are you still disorganised and forgetful?",
        "(Informant) What were they like before these events happened?"
      ],
      tools: ["pcptsd5", "pcl5", "itq", "aceq"],
      conds: ["ptsd", "cptsd"],
      decide: [
        "Symptoms driven by intrusions, avoidance and threat, with no ADHD symptoms before the trauma, are better explained by PTSD or complex PTSD.",
        "ADHD symptoms documented before the trauma and present in safe, non-triggering settings: diagnose both. The association runs in both directions.",
        "Trauma from early childhood, so there is no 'before': judge the pattern. ADHD symptoms in safe settings, not tied to threat, intrusions or avoidance, support co-occurring ADHD. If threat-driven symptoms dominate, record uncertain, offer trauma-focused treatment and reassess ADHD afterwards.",
        "A trauma history does not by itself exclude ADHD when criteria are otherwise met (CADDRA 4.1).",
        "Count dissociative absences and threat-driven distractibility towards PTSD, not ADHD."
      ],
      redFlags: [
        "Current abuse, coercive control or ongoing danger",
        "Severe dissociation, or self-harm linked to trauma memories",
        "Suicidal thoughts after disclosure",
        "Distress rising during the interview: pause and help the person settle before going on"
      ],
      checks: [
        { id: "p7_c1", t: "Asked about trauma exposure in a trauma-informed way" },
        { id: "p7_c2", t: "Screened for PTSD and, where relevant, complex PTSD" },
        { id: "p7_c3", t: "Dated the trauma and looked for evidence of symptoms before it" },
        { id: "p7_c4", t: "Separated threat- and intrusion-driven inattention from ADHD distractibility" },
        { id: "p7_c5", t: "Asked about dissociation" },
        { id: "p7_c6", t: "Recorded verdicts for PTSD and complex PTSD" }
      ]
    },

    /* ------------------------------------------------------------------ p8 */
    {
      id: "p8", n: 8, title: "Personality: emotionally unstable and antisocial patterns",
      goal: "Separate ADHD impulsivity and emotional lability from emotionally unstable (borderline) and antisocial personality patterns, and recognise when both are present.",
      do: [
        "Ask about self-harm, suicide attempts, fear of abandonment, intense unstable relationships, identity disturbance, chronic emptiness, and stress-related paranoia or dissociation. When these are marked, they point to EUPD; in ADHD alone they are usually milder (CADDRA 4.1; European Consensus 2019).",
        "Ask what triggers impulsive acts. In ADHD, impulsivity and anger are usually short-lived and thoughtless rather than driven, and occur in any mood; in EUPD they are more often driven by interpersonal stress or emotional pain (European Consensus 2019).",
        "Ask how long anger lasts and how quickly the person calms down.",
        "Ask about conduct problems before age 15: fighting, cruelty, stealing, fire-setting, truanting and running away.",
        "For rule-breaking, ask whether it was impulsive and regretted (more typical of ADHD) or planned, for gain and with little remorse (more typical of ASPD).",
        "Look for inattention and restlessness outside crises and outside rule-breaking, from primary school onwards. People with conduct-dissocial problems alone usually lack them (ICD-11 CDDR).",
        "Use the MSI-BPD only as a prompt; its impulsivity, anger, mood and relationship items overlap with ADHD.",
        "Note any risk of stimulant misuse or diversion where there is an antisocial or substance-use history."
      ],
      ask: [
        "When a relationship goes wrong, what happens inside you? Do you feel terrified of being left?",
        "Do you swing between seeing people as wonderful and then awful?",
        "Do you have a steady sense of who you are and what you want?",
        "Do you often feel empty inside?",
        "Have you ever hurt yourself on purpose? What was happening at the time?",
        "Do your impulsive acts happen mostly when you are upset, or all the time, even when you are content?",
        "When you lose your temper, how long does it take to calm down?",
        "Before age 15, did you get into fights, steal, damage things or truant?",
        "When you broke rules, was it in the heat of the moment, or planned?",
        "How did you feel afterwards when you hurt or let someone down?",
        "When your relationships and mood are settled, are you still late, forgetful and disorganised?",
        "(Informant) When things are calm, what are they like day to day?"
      ],
      tools: ["msibpd"],
      conds: ["bpd", "aspd"],
      decide: [
        "Impulsivity and lability that occur only in emotional crises, with identity disturbance, abandonment fear and self-harm, and no childhood ADHD, are better explained by EUPD.",
        "Childhood-onset inattention and hyperactivity that persist when relationships are stable: diagnose both. Both conditions are trait-like, so course alone does not separate them (European Consensus 2019).",
        "Planned, instrumental rule-breaking without remorse, with conduct disorder before 15 and no inattention or hyperactivity, is better explained by ASPD.",
        "When ADHD and a personality disorder are both present, record both. Treating ADHD does not resolve EUPD (CADDRA 4.1).",
        "Do not diagnose a personality disorder from one assessment during a crisis. Seek longitudinal and informant evidence."
      ],
      redFlags: [
        "Recurrent self-harm or suicide attempts",
        "Violence, weapon use or risk to others",
        "Stress-related paranoia or severe dissociation",
        "Interest in stimulants alongside a history of selling or misusing medicines"
      ],
      checks: [
        { id: "p8_c1", t: "Asked about self-harm, abandonment fear, identity and emptiness" },
        { id: "p8_c2", t: "Asked what triggers impulsive acts and how long anger lasts" },
        { id: "p8_c3", t: "Asked about conduct problems before age 15 and later offending" },
        { id: "p8_c4", t: "Judged whether rule-breaking was impulsive or instrumental, and whether remorse followed" },
        { id: "p8_c5", t: "Checked for ADHD symptoms outside crises" },
        { id: "p8_c6", t: "Recorded verdicts for EUPD and ASPD" }
      ]
    },

    /* ------------------------------------------------------------------ p9 */
    {
      id: "p9", n: 9, title: "Neurodevelopmental conditions",
      goal: "Look for autism, specific learning disorders, intellectual disability, developmental coordination disorder and tics. They often co-occur with ADHD and can explain some of its symptoms.",
      do: [
        "Screen every adult for autism traits (UKAAN AQAS 2024). With the AQ-10, a score of 6 or more, or clinical suspicion, prompts an offer of autism assessment (NICE CG142 1.2.3). Its specificity in adults referred to specialist services is low, and RAADS-14 scores in ADHD often exceed its cut-off, so a positive screen is a reason to ask, not a finding.",
        "Take an early developmental history, from a parent where possible: speech, play, friendships, response to name, routines, sensory reactions and motor milestones.",
        "For autism, separate making friends from keeping them, routines that ease distress from routines that manage forgetfulness, and lifelong intense interests from short-lived enthusiasms (CR235 9.7.4).",
        "Do not double-count. A symptom explained by social-communication difference, sensory overload or a non-preferred topic does not count towards ADHD (UKAP ADHD and autism consensus 2020).",
        "Ask about reading, spelling and number difficulties that persist even with full attention, extra help at school, and any educational psychology report.",
        "Check whether inattention occurs only during tasks in the area of a learning difficulty, or across all tasks (ICD-11 CDDR).",
        "Judge symptoms against intellectual level: ADHD symptoms must be out of proportion to it. Ask about type of school, support received and daily living skills.",
        "Ask about clumsiness that persists when the person slows down and concentrates, and about tics with an urge before and relief after.",
        "Consider high ability. Very able people may compensate until demands outgrow their strategies (European Consensus 2019)."
      ],
      ask: [
        "As a young child, did you want to play with other children, and did you know how to join in?",
        "Is your difficulty making friends in the first place, or keeping them?",
        "Do you prefer things done the same way? What happens if a plan changes suddenly?",
        "Are your routines there to stop you forgetting, or because change feels distressing?",
        "Are you very sensitive to noise, light, textures or smells?",
        "Did you learn to read later or with more difficulty than your classmates? Is your spelling poor even when you take your time?",
        "Do you lose focus during films or conversations you enjoy, or only when reading and writing?",
        "Did you go to a mainstream school? Did you have extra support?",
        "Do you bump into or drop things even when you are concentrating?",
        "Do you make movements or noises that you feel you have to make, with an urge before and relief after?",
        "Did school feel easy until a certain point? What changed then?",
        "(Parent) In the first five years, how did they play, talk and get on with other children?"
      ],
      tools: ["aq10", "raads14"],
      conds: ["asd", "sld", "idd", "dcd", "tics", "gifted"],
      decide: [
        "Autism and ADHD can be diagnosed together (DSM-5-TR; NICE NG87 1.3.3 advises against excluding ADHD because of a pervasive developmental disorder). Diagnose both when ADHD symptoms are broad and cross-situational, beyond what autism explains.",
        "Inattention confined to non-preferred or social tasks or to sensory overload, and movement that is stereotyped rather than restless, are better explained by autism.",
        "Inattention that occurs only during tasks in the area of a learning difficulty: diagnose the learning disorder, not ADHD (ICD-11 CDDR).",
        "Diagnose ADHD alongside intellectual disability only if the symptoms are excessive for the person's intellectual level (ICD-11 CDDR).",
        "Clumsiness caused by haste or distraction is not DCD; motor problems that persist with full attention suggest DCD. Tics do not explain inattention: diagnose a tic disorder alongside ADHD when both are present, and do not count tics as fidgeting.",
        "Suspected autism, learning disorder or intellectual disability: refer for specialist assessment. This need not delay the ADHD conclusion when the ADHD evidence is clear."
      ],
      redFlags: [
        "Loss of skills or developmental regression",
        "Possible genetic syndrome or fetal alcohol spectrum disorder",
        "Autistic burnout or shutdowns with self-neglect",
        "Severe tics with self-injury"
      ],
      checks: [
        { id: "p9_c1", t: "Screened for autism traits and took an early developmental history" },
        { id: "p9_c2", t: "Avoided double-counting symptoms explained by autism" },
        { id: "p9_c3", t: "Asked about reading, spelling and number difficulties" },
        { id: "p9_c4", t: "Judged symptoms against intellectual level and support needs" },
        { id: "p9_c5", t: "Asked about coordination and tics" },
        { id: "p9_c6", t: "Considered compensation by high ability" },
        { id: "p9_c7", t: "Recorded verdicts for autism, learning disorders, intellectual disability, DCD and tics" }
      ]
    },

    /* ------------------------------------------------------------------ p10 */
    {
      id: "p10", n: 10, title: "Substances, behavioural addictions and eating",
      goal: "Establish whether alcohol, cannabis, stimulants, other drugs, gambling, gaming or disordered eating explain the symptoms, make them worse, or co-occur with ADHD.",
      do: [
        "Ask about every substance: alcohol, cannabis, cocaine, amphetamines, non-prescribed ADHD medicines, other drugs, nicotine and caffeine. Use the AUDIT-C (full AUDIT if positive) and the DAST-10.",
        "Put substance use on the timeline: age at first use, start of regular use, peak, and every abstinent spell. Ask what the person was like before first use.",
        "Ask what attention and restlessness were like during abstinent periods of a month or more. Focus on drug- and alcohol-free periods (Crunelle et al. 2018).",
        "Ask why the person uses: to calm restlessness, to sleep, to focus, or for a high. Self-medication is common in ADHD (European Consensus 2019).",
        "Do not complete the diagnostic interview during intoxication or significant withdrawal. Consider a urine or oral-fluid drug screen with consent, and liver tests if drinking is heavy (clinical practice).",
        "Ask about gambling and gaming: time, money, loss of control and harm. ICD-11 CDDR lists gaming disorder among the conditions more common in ADHD, and AADPA 2022 lists gambling disorder among adult groups with higher ADHD prevalence.",
        "Ask about eating: binges, restriction, purging, and any wish to use stimulants to lose weight. Binge eating can be part of ADHD impulsivity, and starvation itself impairs concentration.",
        "Assess the risk of misuse and diversion of medication as part of planning (NICE NG87 1.7.4)."
      ],
      ask: [
        "How old were you when you first drank or used drugs? What were you like at school before then?",
        "Have you had a month or more without drinking or using? How was your concentration then?",
        "What does it do for you: calm you, help you sleep, help you focus, or give you a high?",
        "When did you last drink or use, and how much?",
        "Is your concentration worse the day after using, or when you try to stop?",
        "Have you ever taken someone else's ADHD medicine, or cocaine or speed? What did it do?",
        "How much coffee, energy drink or nicotine do you have each day?",
        "How much time and money do you spend on gambling or gaming? Have you tried to cut down?",
        "Do you have times when you eat a large amount and feel out of control?",
        "Have you ever restricted food, made yourself sick or used pills to control your weight?",
        "(Informant) Before they started drinking or using, were they restless, impulsive or disorganised?"
      ],
      tools: ["auditc", "audit", "dast10", "cageaid", "assist"],
      conds: ["sud_cannabis", "sud_alcohol", "sud_stim", "gambling", "gaming", "eating"],
      decide: [
        "No ADHD symptoms before regular use, and symptoms that resolve with sustained abstinence: better explained by the substance. Heavy substance use was the commonest reason apparent late-onset ADHD was excluded in the MTA follow-up (Sibley et al. 2018).",
        "Childhood ADHD before first use, and symptoms that persist when abstinent: diagnose both. In the WHO surveys, ADHD began first in almost all adults who had both (Fayyad et al. 2017).",
        "Current use does not rule out an assessment. Start once the person is not seriously intoxicated or in withdrawal, and verify the diagnosis as treatment progresses, because the picture can change (Crunelle et al. 2018).",
        "Severe or unstable substance use: stabilise it first. Both conditions are usually then treated together (European Consensus 2019; CADDRA 4.1).",
        "Gambling, gaming and binge eating can follow from ADHD impulsivity. Diagnose them as co-occurring when they meet their own criteria.",
        "Restrictive eating with low weight can impair concentration by itself. Restore weight and reassess before attributing attention problems to ADHD."
      ],
      redFlags: [
        "Past alcohol withdrawal with seizures or delirium",
        "Injecting drug use or overdose",
        "Selling or giving away prescribed medicines",
        "Very low weight, or purging with physical symptoms",
        "Gambling debts with suicidal thoughts"
      ],
      checks: [
        { id: "p10_c1", t: "Screened alcohol and drug use with a validated tool" },
        { id: "p10_c2", t: "Plotted first use, peak use and abstinent spells on the timeline" },
        { id: "p10_c3", t: "Asked about symptoms during abstinent periods" },
        { id: "p10_c4", t: "Confirmed the interview was not done during intoxication or withdrawal" },
        { id: "p10_c5", t: "Asked about gambling, gaming and eating" },
        { id: "p10_c6", t: "Assessed the risk of misuse and diversion" },
        { id: "p10_c7", t: "Recorded verdicts for each substance and behavioural condition considered" }
      ]
    },

    /* ------------------------------------------------------------------ p11 */
    {
      id: "p11", n: 11, title: "Sleep disorders",
      goal: "Find sleep disorders that cause daytime inattention, make ADHD worse or travel with it, and judge whether the daytime symptoms would remain if sleep were normal.",
      do: [
        "Take a sleep history: usual bed and wake times on work days and free days, time to fall asleep, night waking, snoring, daytime sleepiness and naps.",
        "Screen for obstructive sleep apnoea: loud snoring, witnessed pauses, gasping, morning headaches, unrefreshing sleep, high body weight, a large neck, high blood pressure. STOP-Bang can guide this.",
        "Separate sleepiness (dozing off) from inattention (awake but distracted). The Epworth Sleepiness Scale measures daytime sleepiness.",
        "Ask about a lifelong night-owl pattern with a busy mind at bedtime. Delayed sleep onset is very common in adults with ADHD (European Consensus 2019, section 7.5.5).",
        "Ask about restless legs: an urge to move the legs at rest, worse in the evening, relieved by movement.",
        "Ask about features of narcolepsy: sudden sleep attacks, cataplexy (weakness with laughter or strong emotion), sleep paralysis, vivid images at sleep onset, and refreshing short naps.",
        "Ask what daytime symptoms are like after good sleep, for example on holiday.",
        "Refer for a sleep study if sleep apnoea or narcolepsy is suspected. Use a sleep diary for one to two weeks if the pattern is unclear."
      ],
      ask: [
        "What time do you fall asleep and wake when you have no commitments?",
        "What keeps you awake: a busy mind, worry about one thing, or physical discomfort?",
        "Do you snore loudly? Has anyone seen you stop breathing or gasp in your sleep?",
        "Do you wake unrefreshed or with a headache?",
        "Do you fall asleep without meaning to while reading, watching TV, in meetings or when driving?",
        "When you lose focus, are you drowsy, or wide awake but distracted?",
        "After a week of good sleep, are you still disorganised and distractible?",
        "In the evening, do your legs feel uncomfortable, with an urge to move them?",
        "When you laugh or are startled, do your knees or face ever go weak?",
        "Have you always been a night owl, even as a teenager?",
        "Do you work shifts, or use alcohol, cannabis or screens to get to sleep?"
      ],
      tools: ["stopbang", "epworth", "isi"],
      conds: ["osa", "insomnia", "dsps", "narcolepsy", "rls"],
      decide: [
        "Daytime symptoms that began with the sleep problem and resolve when sleep is corrected, with no childhood ADHD, are better explained by the sleep disorder.",
        "Childhood-onset daytime symptoms that persist after adequate sleep: diagnose both. Delayed sleep onset is so common in ADHD that it is usually co-occurring.",
        "Suspected sleep apnoea or narcolepsy with an unclear ADHD history: refer and treat first, then reassess. Inattention improved after sleep apnoea treatment in small interventional studies.",
        "An urge to move the legs at rest, worse in the evening and relieved by movement, is restless legs syndrome, not ADHD hyperactivity. The two often co-occur. Check ferritin, treat it and reassess.",
        "Excessive daytime sleepiness with driving risk needs action now, whatever the ADHD conclusion: advise the person not to drive while sleepy and explain the DVLA rules on excessive sleepiness."
      ],
      redFlags: [
        "Falling asleep while driving, or at work in a safety-critical role",
        "Witnessed breathing pauses with high blood pressure or heart disease",
        "Cataplexy",
        "Very short sleep without tiredness (consider mania)"
      ],
      checks: [
        { id: "p11_c1", t: "Took a sleep history including sleep timing on free days" },
        { id: "p11_c2", t: "Screened for sleep apnoea" },
        { id: "p11_c3", t: "Separated daytime sleepiness from inattention" },
        { id: "p11_c4", t: "Asked about restless legs and features of narcolepsy" },
        { id: "p11_c5", t: "Asked how daytime symptoms change after good sleep" },
        { id: "p11_c6", t: "Arranged a sleep diary or sleep referral where needed" },
        { id: "p11_c7", t: "Recorded verdicts for each sleep condition considered" }
      ]
    },

    /* ------------------------------------------------------------------ p12 */
    {
      id: "p12", n: 12, title: "Medical and medication causes",
      goal: "Find physical illnesses and medicines that mimic or worsen ADHD symptoms, and decide which need investigation. Test when clinically indicated, not routinely.",
      do: [
        "Take a medical history and review of systems: thyroid symptoms, fatigue, heavy periods, diet, seizures, head injuries, neurological illness, hearing and vision, chronic illness, recent infections and episodes that suggest low blood sugar. ICD-11 CDDR lists hypoglycaemia, thyroid disease, toxins and sleep-wake disorders as medical mimics.",
        "Review every medicine, including over-the-counter and herbal products, and when each was started. Medicines that can cause ADHD-like symptoms include carbamazepine, valproate, risperidone, bronchodilators and thyroid replacement (ICD-11 CDDR). Antipsychotic-induced akathisia can look like hyperactivity (DSM-5-TR). Mood stabilisers and other sedating medicines can dull attention; decongestants, asthma medicines and caffeine can cause activation (CADDRA 4.1; AADPA 2022).",
        "Ask specifically about seizures and head injuries (UKAAN AQAS 2024). Brief staring spells with an abrupt start and end, unresponsiveness and no memory of the event suggest seizures rather than daydreaming.",
        "For any head injury, ask about loss of consciousness or concussion and whether attention, temper or personality changed afterwards.",
        "Consider hearing and vision when there are clues: missing what is said, doing better one-to-one, squinting or headaches (CADDRA 4.1; AADPA 2022).",
        "In people going through perimenopause, usually in their 40s and 50s, ask how symptoms changed, and separate worsening of lifelong ADHD from new symptoms. Thyroid symptoms can be mistaken for menopause (NICE NG145 1.2.5).",
        "Ask about infections before the symptoms started, such as COVID-19 or glandular fever, followed by fatigue and brain fog.",
        "In older adults, or anyone with new memory problems, take a longitudinal history from an informant and consider cognitive screening and a memory service referral.",
        "Order tests only if indicated: TSH first if thyroid disease is suspected (NICE NG145 1.2.8); full blood count and ferritin for fatigue, heavy periods, restrictive diet or restless legs; a neurology referral if seizures are suspected."
      ],
      ask: [
        "Have you noticed changes in weight, feeling too hot or too cold, a racing heart or a tremor?",
        "Do you feel tired all the time, or breathless on effort? Are your periods heavy?",
        "Have you had a head injury where you were knocked out or dazed? Did anything change afterwards?",
        "Has anyone seen you stare blankly for a few seconds and not respond?",
        "What medicines do you take, including inhalers, sleeping tablets, painkillers and anything from the chemist?",
        "Did the concentration problems start or worsen when a medicine was started or changed?",
        "Do you struggle to hear in noisy places, or need to sit close to see?",
        "Did your symptoms start or get worse after an infection?",
        "(If relevant) How have your symptoms changed around periods, pregnancy or the menopause?",
        "Is your memory getting worse over time? Do you forget recent events, or get lost in familiar places?",
        "(Informant) Is this how they have always been, or a change in recent years?"
      ],
      tools: ["moca"],
      conds: ["thyroid", "anaemia", "epilepsy", "tbi", "sensory", "meds", "menopause", "postviral", "mci"],
      decide: [
        "A medical cause better explains the symptoms when they began with it, have no childhood history, and resolve when it is treated. Treat it and reassess.",
        "Lifelong symptoms made worse by a medical condition, such as perimenopause or anaemia: diagnose ADHD and the condition, and treat both.",
        "Epilepsy and acquired brain injury are linked with higher ADHD prevalence (NICE NG87 1.2.1). With epilepsy, diagnose ADHD when the symptoms are present between seizures and are not explained by absences, post-ictal states or antiseizure medicines. With brain injury, diagnose ADHD only if the symptoms were present before the injury; new symptoms after it point to a cognitive disorder due to the injury.",
        "New cognitive decline in mid or later life points to a neurocognitive disorder, depression, medicines or sleep, not ADHD, unless there is a clear lifelong history (CADDRA 4.1: use a longitudinal history).",
        "Do not order routine blood tests for every assessment. Investigate when the history or examination suggests a cause (AADPA 2022)."
      ],
      redFlags: [
        "Progressive memory loss, or getting lost in familiar places",
        "Seizures, staring spells or new neurological signs",
        "Personality change after a head injury",
        "Weight loss, palpitations or tremor suggesting an overactive thyroid",
        "Symptoms that began with a new medicine"
      ],
      checks: [
        { id: "p12_c1", t: "Took a medical history and review of systems" },
        { id: "p12_c2", t: "Reviewed all medicines and when each started" },
        { id: "p12_c3", t: "Asked specifically about seizures and head injuries" },
        { id: "p12_c4", t: "Considered hearing and vision" },
        { id: "p12_c5", t: "Considered hormonal change, post-viral illness and cognitive decline where relevant" },
        { id: "p12_c6", t: "Ordered investigations only where indicated, and recorded why" },
        { id: "p12_c7", t: "Recorded verdicts for each medical cause considered" }
      ]
    },

    /* ------------------------------------------------------------------ p13 */
    {
      id: "p13", n: 13, title: "Symptom validity and incentives",
      goal: "Judge how far the reported symptoms can be relied on, without accusing anyone, and decide whether formal validity testing is needed.",
      do: [
        "Ask neutrally what the person hopes the assessment will bring: understanding, treatment, medication, exam or workplace adjustments, benefits, or help with a legal case.",
        "Look for inconsistency: between the account and the records, between self-report and informants, between the severity claimed and the functioning seen, and between sessions.",
        "Look for atypical patterns: almost every symptom at the maximum, rare or implausible symptoms, textbook wording, vague answers when asked for examples, or childhood symptoms reported only by the patient.",
        "Remember that self-report scales are easy to fake. In clinic samples of adults referred for ADHD, about 15-31% gave non-credible responses (Suhr et al. 2008; Harrison and Edwards 2010; Marshall et al. 2016). In Marshall's study, 71% of those with suspect effort would have been diagnosed by interview alone.",
        "Use embedded validity indicators where available, such as the CAARS 2 Negative Impression and Inconsistency indexes, and refer for formal symptom and performance validity testing when concerns persist. The two can fail separately, so both matter.",
        "Consider stimulant-seeking and diversion, particularly with an antisocial or substance-use history (CR235 9.7.8: abnormal sick role behaviour).",
        "Balance this against the evidence that ADHD remains under-diagnosed (CR235 9.7.8). An incentive does not mean the symptoms are false."
      ],
      ask: [
        "What would a diagnosis change for you?",
        "Have you read about ADHD or done online tests? What did you recognise in yourself?",
        "Can you take me through the last time that happened, step by step?",
        "Is there anything you are hoping to leave with today, such as medication or a letter?",
        "Have you ever taken ADHD medicine that was not prescribed for you? What did it do?",
        "Is any of this connected with an exam, a job, a benefit claim or a court case?",
        "Which of these problems affects you most, and which affects you least?",
        "(Informant) Do you recognise the problems they describe? Can you give an example?"
      ],
      tools: ["caars2"],
      conds: ["feigning"],
      decide: [
        "A consistent account, with concrete examples and corroboration: no validity concern. Record that you checked.",
        "Some inconsistency, or a clear incentive without other signs: note it, seek more collateral or records, and weigh the evidence with more caution.",
        "Several indicators together, such as maximum endorsement, failed embedded validity scales, inconsistency with records and vague examples: refer for formal validity testing, and do not diagnose on self-report alone.",
        "Over-reporting does not prove that ADHD is absent; a person can have ADHD and still exaggerate. Base the conclusion on the evidence that is reliable.",
        "Describe validity findings neutrally in the report. Do not use the word malingering unless deliberate deception for gain has been shown."
      ],
      redFlags: [
        "A request for a specific stimulant at first contact",
        "A history of selling, sharing or misusing prescribed medicines",
        "An account that changes between sessions or between informants",
        "Symptoms reported only after learning about ADHD, with no earlier evidence"
      ],
      checks: [
        { id: "p13_c1", t: "Asked neutrally about expectations and incentives" },
        { id: "p13_c2", t: "Cross-checked the account against records and informants" },
        { id: "p13_c3", t: "Looked for atypical or extreme symptom reporting" },
        { id: "p13_c4", t: "Used embedded validity indicators where available" },
        { id: "p13_c5", t: "Decided whether formal validity testing is needed" },
        { id: "p13_c6", t: "Recorded the level of validity concern and its effect on confidence" }
      ]
    },

    /* ------------------------------------------------------------------ p14 */
    {
      id: "p14", n: 14, title: "Integrate, decide and document",
      goal: "Bring every step together: give each condition a verdict, decide criterion E, set the treatment order for co-occurring conditions, and write it down so that another clinician can follow the reasoning.",
      do: [
        "List every condition reviewed, including all ten core conditions: depression, bipolar disorder, generalised anxiety, PTSD, EUPD, autism, alcohol use, cannabis use, insomnia and obstructive sleep apnoea.",
        "Give each one verdict: absent, co-occurring, better explains the symptoms, or uncertain.",
        "Check every symptom you counted towards ADHD: was it counted only because of another condition?",
        "Decide criterion E: met (no condition better explains the symptoms, and they do not occur only during psychosis), not met (name the condition), or uncertain (say what is missing).",
        "Set the treatment order: urgent and severe conditions first, then ADHD. Milder co-occurring conditions can be treated alongside ADHD (European Consensus 2019; CADDRA 4.1).",
        "For any uncertain verdict, set a plan: the evidence or treatment needed, who will arrange it, and when you will reassess.",
        "Write the differential section of the report, and state explicitly whether the symptoms are better explained by another disorder (UKAAN AQAS 2024)."
      ],
      ask: [
        "Have I asked about every core condition, and can I say why each is absent or present?",
        "Did the ADHD symptoms start before age 12, and before each other condition?",
        "Do the ADHD symptoms persist when each other condition is absent or treated?",
        "Is there a feature that belongs only to another condition and explains the picture better?",
        "What does the independent evidence say, and where does it disagree with the patient's account?",
        "Would another experienced clinician reach the same verdicts from my notes?",
        "What would change my mind, and can I get that information?",
        "(To the patient) Does this explanation fit how you see your difficulties?"
      ],
      tools: [],
      conds: ["dep", "bip", "gad", "ptsd", "bpd", "asd", "sud_alcohol", "sud_cannabis", "insomnia", "osa"],
      decide: [
        "ADHD and another condition both meet criteria, with ADHD symptoms that predate it and persist without it: diagnose both, and say which to treat first.",
        "Another condition accounts for the symptoms, their onset and their course: do not diagnose ADHD. Name the condition and the plan, and give information and support anyway (NICE NG87 1.4.4).",
        "The evidence is incomplete, or a current episode clouds the picture: record uncertain or deferred, treat the other condition, and set a date to reassess.",
        "ADHD criteria met and no other condition present: record each core condition as absent, with the reason.",
        "ADHD criteria not met: say whether this is subthreshold ADHD or symptoms secondary to another condition, and offer information and support either way (UKAAN AQAS 2024; NICE NG87 1.4.4).",
        "Do not let a strong ADHD history stop the search. Comorbidity is the rule, and missed bipolar disorder, psychosis or substance misuse changes what treatment is safe."
      ],
      redFlags: [
        "A core condition with no verdict",
        "ADHD diagnosed during an untreated mood episode or active psychosis",
        "A symptom counted towards both ADHD and another condition",
        "A conclusion that rests on rating scales or self-report alone"
      ],
      checks: [
        { id: "p14_c1", t: "Recorded a verdict for every core condition" },
        { id: "p14_c2", t: "Recorded a verdict for every other condition raised" },
        { id: "p14_c3", t: "Checked that no symptom was double-counted" },
        { id: "p14_c4", t: "Stated whether criterion E is met, not met or uncertain, with reasons" },
        { id: "p14_c5", t: "Set the treatment order for co-occurring conditions" },
        { id: "p14_c6", t: "Set a reassessment plan for every uncertain verdict" },
        { id: "p14_c7", t: "Wrote the differential diagnosis section of the report" }
      ]
    }
  ],

  final: {
    rules: [
      "Absent: you asked about the condition, it does not meet criteria now or in the past, and nothing in the records or informant accounts suggests it.",
      "Co-occurring: the condition meets its own criteria, and the ADHD symptoms began in childhood (before it, if it started later) and go beyond what it explains: they persist when it is absent or treated, or, for lifelong conditions such as autism, they occur in settings and tasks it does not affect.",
      "Better explains: the ADHD-type symptoms began with the condition, rise and fall with it, are confined to its states or settings, or are accounted for by features that belong only to it. Do not diagnose ADHD now.",
      "Uncertain: the condition is possible but not established, or it overlaps so much that ADHD cannot be judged while it is active. Say what you need and when you will reassess.",
      "Psychosis: if the ADHD-type symptoms occur only during a psychotic disorder, criterion E is not met. Childhood ADHD that predates the psychosis can be co-occurring.",
      "Mood episodes: count concentration problems and restlessness towards ADHD only if they were present since childhood and persist after the episode resolves (ICD-11 CDDR).",
      "Substances: if symptoms appear only with heavy use, intoxication or withdrawal and settle with abstinence, the substance explains them. Verify any ADHD diagnosis as substance treatment progresses (Crunelle et al. 2018).",
      "Autism: diagnose both when each meets criteria, and do not count a symptom towards ADHD if autism explains it (UKAP ADHD and autism consensus 2020).",
      "Learning, intellectual and motor conditions: diagnose ADHD as well only if inattention extends beyond the area of difficulty and is excessive for intellectual level (ICD-11 CDDR).",
      "Sleep and medical causes: if correcting the cause removes the symptoms, it explains them. If lifelong symptoms remain, diagnose both.",
      "Validity: if the reliability of the account is in serious doubt, do not diagnose on self-report alone. Seek independent evidence and formal testing.",
      "Criterion E is met only when every condition considered has a verdict and none better explains the ADHD symptoms you counted. If an uncertain condition could explain the symptoms, defer the ADHD conclusion or make it with stated low confidence."
    ],
    documentation: [
      "Each condition considered, its verdict, and the key evidence for it, for example 'no discrete mood episodes; ADHD symptoms present when mood is stable'.",
      "Core conditions recorded as absent explicitly, with the reason. UKAAN AQAS 2024 recommends naming conditions that are absent.",
      "A clear statement on criterion E: whether the symptoms are better explained by another disorder (UKAAN AQAS 2024: essential).",
      "A timeline summary: onset before 12, the course, and how ADHD symptoms related to the other conditions over time.",
      "The sources behind each conclusion: patient, informants, school reports, records, screening scores (with dates) and examination.",
      "Screening results and how you interpreted them, including overlap with ADHD, for example a positive MDQ explained by trait ADHD symptoms.",
      "The validity checks made and their effect on confidence.",
      "Investigations ordered or not ordered, and why.",
      "The treatment order for co-occurring conditions, referrals made and any safety actions taken.",
      "For each uncertain verdict: what is missing, what will be done, who will do it, and when the ADHD question will be reviewed."
    ]
  },

  refs: [
    "American Psychiatric Association. DSM-5-TR (2022): ADHD criteria B and E, differential diagnosis including medication-induced symptoms; bipolar episode durations (paraphrased).",
    "World Health Organization. ICD-11 Clinical Descriptions and Diagnostic Requirements (CDDR), 6A05 ADHD: course, boundaries with other disorders, substances, medicines and medical mimics (paraphrased). ICD-11 MMS QD85 Burn-out.",
    "NICE NG87. Attention deficit hyperactivity disorder: diagnosis and management (2018, last updated 2019): recommendations 1.2.1, 1.2.2, 1.2.10, 1.3.3, 1.4.4, 1.7.4.",
    "NICE NG225. Self-harm: assessment, management and preventing recurrence (2022): recommendations 1.6.1-1.6.3.",
    "NICE NG145. Thyroid disease: assessment and management: recommendations 1.2.3, 1.2.5, 1.2.8.",
    "NICE CG142. Autism spectrum disorder in adults: recommendation 1.2.3 (AQ-10). NICE CG185. Bipolar disorder: recommendation 1.2.3.",
    "Adamou M, et al. The adult ADHD assessment quality assurance standard (UKAAN AQAS). Front Psychiatry 2024;15:1380410.",
    "Royal College of Psychiatrists in Scotland. CR235: ADHD in adults, good practice guidelines (2023), sections 9.2, 9.5, 9.7 and 10.",
    "Kooij JJS, et al. Updated European Consensus Statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019;56:14-34.",
    "CADDRA. Canadian ADHD Practice Guidelines, 4.1 edition (2021), chapter 2: differential diagnosis and comorbidity (paraphrased).",
    "May T, et al. The Australian evidence-based clinical practice guideline for ADHD (AADPA 2022). Aust N Z J Psychiatry 2023;57:1101-1116.",
    "Faraone SV, et al. The World Federation of ADHD International Consensus Statement: 208 evidence-based conclusions about the disorder. Neurosci Biobehav Rev 2021;128:789-818.",
    "Young S, et al. Guidance for identification and treatment of individuals with ADHD and autism spectrum disorder based upon expert consensus (UKAP). BMC Med 2020;18:146. Young S, et al. Females with ADHD: an expert consensus statement taking a lifespan approach. BMC Psychiatry 2020;20:404.",
    "Fayyad J, et al. The descriptive epidemiology of DSM-IV adult ADHD in the World Health Organization World Mental Health Surveys. Atten Defic Hyperact Disord 2017;9:47-65.",
    "Sibley MH, et al. Late-onset ADHD reconsidered with comprehensive repeated assessments between ages 10 and 25. Am J Psychiatry 2018;175:140-149.",
    "Crunelle CL, et al. International consensus statement on screening, diagnosis and treatment of substance use disorder patients with comorbid ADHD. Eur Addict Res 2018;24:43-51.",
    "Marshall PS, et al. The impact of failing to identify suspect effort in patients undergoing adult ADHD assessment. Psychol Assess 2016;28:1290-1302 (correction: 28:1289).",
    "Suhr J, et al. Arch Clin Neuropsychol 2008;23:521-530 (Word Memory Test failure in adults referred for ADHD). Harrison AG, Edwards MJ. Appl Neuropsychol 2010;17:135-143.",
    "Lundervold AJ, et al. Current and retrospective childhood ratings of emotional fluctuations in adults with ADHD (MDQ positive in 50.2% of 502 adults with ADHD vs 5% of controls). Front Psychol 2020;11:571101.",
    "Clinical practice: interview questions are original prompts built from the discriminating features in these sources; they are not a validated instrument."
  ]
});
