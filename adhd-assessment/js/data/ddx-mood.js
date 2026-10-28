/* ddx-mood: mood and stress differentials for adult ADHD assessment (ARCHITECTURE.md section 5.5).
   Conditions, in order: dep (major depressive disorder), pdd (persistent depressive disorder / dysthymia),
   bip (bipolar I and II), cyclo (cyclothymic disorder), burnout (burnout and chronic stress overload).
   Core (reviewed in every adult assessment): dep, bip. Adult only (ages: "adult", hidden for under-18s): burnout.
   Young-person screens on dep (PHQ-A, MFQ, RCADS low mood) have no items here: their results are entered by hand.
   DSM-5-TR and ICD-11 content is paraphrased, not quoted. ICD-11 boundary statements were checked against
   the WHO CDDR (2024) text. NICE recommendation numbers are given only where verified (NG87 1.2.10, 1.3.3;
   NG145 1.2.3; CG185 1.2.3; CG142 1.2.3; NG225 1.6.1-1.6.3). Interview questions are original clinical prompts, not a
   validated interview, and do not reproduce DIVA wording. Points not from a named source are clinical practice.
   Sources: research briefs of 21 October 2026 (ddx-evidence, guidelines-uk, guidelines-intl, tools-comorbid);
   Kooij et al. 2019 European Consensus; CADDRA Canadian ADHD Practice Guidelines 4.1; RCPsych CR235 (2023);
   Kessler et al. 2006; Fayyad et al. 2017; Solberg et al. 2018; Lundervold et al. 2020; Asherson et al. 2014. */
AA.add('ddx', [

  /* ------------------------------------------------------------------ Major depressive disorder */
  {
    id: "dep",
    name: "Major depressive disorder (single episode or recurrent)",
    group: "mood",
    core: true,
    icd11: "6A70 single episode depressive disorder; 6A71 recurrent depressive disorder",
    summary: "Episodes of at least two weeks of low mood or loss of interest or pleasure, with changes in sleep, appetite, energy, concentration, self-worth and thoughts of death. Poor concentration, indecision, restlessness and low drive during an episode can look like ADHD inattention. The key difference is time: depressive symptoms are a change from the person's usual self and are tied to the episode, while ADHD symptoms are trait-like and present since childhood.",
    prevalence: "12-month major depression in 18.6% of adults with ADHD in the US National Comorbidity Survey Replication (Kessler 2006). Register diagnoses of depression in 28.8% of women and 20.3% of men with ADHD in Norway (Solberg 2018). 17.9% of adults newly diagnosed in a UK NHS adult ADHD clinic (Newman 2026 audit, conference abstract, not peer-reviewed). ADHD began before the mood disorder in about 86% of comorbid cases in the WHO World Mental Health surveys (Fayyad 2017).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed when each meets its own criteria (DSM-5-TR; ICD-11). ICD-11 adds that poor concentration and restlessness during a depressive episode count towards ADHD only if they have been present since childhood and persist after the episode resolves. Treat severe depression or high suicide risk first, then rate ADHD symptoms again once mood has recovered.",
    overlap: [
      "Poor concentration, slowed or muddled thinking and indecision.",
      "Forgetfulness and losing track of tasks.",
      "Low drive, procrastination and unfinished tasks.",
      "Restlessness or agitation (in agitated depression).",
      "Irritability and low frustration tolerance.",
      "Sleep problems and daytime tiredness.",
      "Low self-esteem, guilt and a sense of failure.",
      "Falling performance at work or study and withdrawal from demands."
    ],
    favoursADHD: [
      "Attention and organisation problems began in childhood, before any low mood (school reports, parent account).",
      "The problems are there in good times too: on holiday, early in a new job or relationship, when mood is fine.",
      "Drive fails for boring or effortful tasks, but interest and pleasure return quickly for new or rewarding activities (ADHD amotivation can mimic anhedonia; CADDRA).",
      "Low self-esteem is long-standing and explained by years of criticism, under-achievement and failure (demoralisation), not a recent drop.",
      "Mood dips are reactive and short-lived, lasting hours, and lift when circumstances change (Kooij 2019).",
      "The sleep problem is mainly getting off to sleep because the mind will not switch off, not early-morning waking.",
      "Restlessness is lifelong and present whatever the mood.",
      "Any depressive episodes began after the ADHD-type difficulties, and the difficulties persisted between episodes."
    ],
    favoursAlt: [
      "A clear answer to 'since when?': a definable onset after which the person was not their usual self.",
      "Low mood or emptiness most of the day, nearly every day, for at least two weeks.",
      "Loss of interest or pleasure in almost everything, including activities the person usually loves.",
      "Neurovegetative change: appetite or weight change, early-morning waking or oversleeping, mood worst in the morning.",
      "Psychomotor slowing: thinking, speech and movement feel slowed.",
      "Fatigue and loss of energy out of keeping with the person's usual drive.",
      "Excessive or inappropriate guilt, hopelessness, thoughts of death or suicide.",
      "Episodic course, with a return to normal functioning between episodes.",
      "Concentration problems are absent from childhood records and absent in periods of normal mood.",
      "Onset after a loss, a major stressor, childbirth or physical illness, or in later adulthood with no earlier difficulties.",
      "Mood-congruent psychotic features (ideas of guilt, ruin or illness) in severe episodes."
    ],
    ask: [
      "When did the concentration problems start? Were they there at primary school, before you ever felt low?",
      "Think of a time when your mood was good, such as a holiday or a good year at work. Were you still disorganised, forgetful or restless then?",
      "Has there been a spell of two weeks or more when you felt low, empty or flat for most of the day, nearly every day?",
      "When you are low, do you lose interest in everything, even things you usually love? Or only in dull or difficult tasks?",
      "If something new or exciting comes up, can you still get absorbed in it?",
      "When low spells have lifted in the past, did your focus and organisation go back to normal, or stay as they always were?",
      "How do you sleep: trouble dropping off because your mind is busy, or waking very early and not getting back to sleep?",
      "Has your appetite or weight changed recently?",
      "Do you feel slowed down, as if your thinking and body are running at half speed?",
      "Is your mood worse at a particular time of day?",
      "How long does a low mood usually last: a few hours after something goes wrong, or weeks at a time without a clear reason?",
      "Have you had thoughts that life is not worth living, or of harming yourself? Have you ever acted on them?",
      "How have you seen yourself over the years? Is feeling a failure new, or has it been there since school?",
      "Has anyone in your family had depression, bipolar disorder or spells of needing very little sleep?",
      "Have antidepressants helped your mood? Did they change your focus or organisation at all?",
      "(Informant) Was there a time when they changed and were not their usual self? Or have they always been scattered and forgetful?",
      "(Informant) What were they like as a child: dreamy, disorganised or restless? Or settled and organised until things changed?"
    ],
    features: [
      { id: "dep_onset", t: "Clear onset: a definable point after which the person was not their usual self", w: 3 },
      { id: "dep_episode", t: "At least two weeks of low mood or loss of interest most of the day, nearly every day", w: 3 },
      { id: "dep_anhedonia", t: "Loss of pleasure even in activities the person usually loves, not only in boring tasks", w: 3 },
      { id: "dep_euthymic", t: "Concentration and organisation were normal in periods of good mood (patient and informant agree)", w: 3 },
      { id: "dep_nochild", t: "No inattention or hyperactivity in school reports or the childhood informant account", w: 3 },
      { id: "dep_course", t: "Episodic course: distinct spells with a return to normal functioning in between", w: 2 },
      { id: "dep_veg", t: "Appetite or weight change, early-morning waking or mood worst in the morning", w: 2 },
      { id: "dep_slow", t: "New psychomotor slowing or marked fatigue", w: 2 },
      { id: "dep_guilt", t: "Excessive guilt, worthlessness or hopelessness out of proportion to events", w: 2 },
      { id: "dep_resolve", t: "ADHD-type symptoms eased fully when the depression was treated or remitted", w: 2 },
      { id: "dep_trigger", t: "Symptoms began after a loss, major stressor, childbirth or physical illness", w: 1 },
      { id: "dep_suicide", t: "Recurrent thoughts of death or suicidal ideation (assess risk whatever the diagnosis)", w: 1 },
      { id: "dep_fh", t: "Family history of depressive disorder", w: 1 }
    ],
    screen: ["phq9", "cssrs", "phqa", "mfq", "rcads"],
    investigations: [
      "Risk assessment the same day for any suicidal thoughts (PHQ-9 item 9 or disclosed at interview). Use the C-SSRS screener to guide enquiry, not as a risk score (NICE NG225 1.6.1-1.6.3).",
      "PHQ-9 for current severity: manual bands at 5, 10, 15 and 20; NICE NG222 uses 16 or more as 'more severe'. It rates the last two weeks, so ask whether each endorsed item is new or lifelong.",
      "Thyroid function tests: NICE NG145 1.2.3 says to consider them in adults with depression or unexplained anxiety.",
      "Full blood count, ferritin, B12 and folate, and glucose or HbA1c when fatigue or slowing is prominent (clinical practice).",
      "Medicine and substance review: alcohol, cannabis, sedatives and opioids impair mood and concentration; corticosteroids can lower or raise mood (clinical practice).",
      "Life chart or mood diary over several weeks to separate episodes from a lifelong baseline, with collateral from someone who knew the person before the first episode and school reports.",
      "Route by severity: NHS Talking Therapies for less severe depression; community mental health team or crisis team for severe depression, psychotic features or high risk.",
      "Neuropsychological testing does not separate depression from ADHD and is not routine (RCPsych CR235). Consider it when the diagnosis stays unclear, impairment is out of proportion to the symptoms (BAP 2014), or another cognitive disorder is suspected."
    ],
    redFlags: [
      "Suicidal thoughts with a plan or intent, recent self-harm or a recent attempt: act today.",
      "Psychotic features: delusions of guilt, ruin or illness, or hallucinations.",
      "Severe depression with poor eating or drinking, or marked slowing.",
      "Onset in pregnancy or after childbirth (perinatal mental health referral).",
      "New cognitive decline in mid or later life: assess for a neurocognitive disorder rather than adult-onset ADHD.",
      "Any past hypomania or mania: ask before an antidepressant is started or changed, because this points to bipolar depression."
    ],
    decide: {
      better: "Depression better explains the picture when the attention, drive and organisation problems began with a depressive episode, are confined to episodes and resolve when mood recovers, and there is no convincing childhood history from records or informants. Do not diagnose ADHD on symptoms recorded only during an episode.",
      both: "Diagnose both when ADHD symptoms meet criteria from childhood and persist in periods of normal mood, and a depressive episode also meets its own criteria. This is common: ADHD usually comes first, and repeated failure and demoralisation raise the risk of depression.",
      next: "Assess risk first. Treat severe depression, or depression with high suicide risk, before ADHD (Kooij 2019 section 7.2; CADDRA), choosing treatment by NICE NG222; RCPsych CR235 advises treating major mood disorders before completing the ADHD assessment. Then rate ADHD symptoms again in euthymia, with collateral and records. When ADHD is clear and depression is mild, ADHD treatment can run alongside mood treatment (CADDRA; Kooij 2019 section 7.2). A diagnosis or history of severe depression or suicidal tendencies is a listed contraindication in methylphenidate SmPCs (section 4.3), so any specialist decision to prescribe needs a documented risk-benefit discussion."
    },
    pearls: [
      "Ask 'since when?' for every symptom. A recent change points to depression; 'I have always been like this' points to a trait.",
      "Use good-mood windows as the test: holidays, a new relationship, the first weeks of a new job. ADHD symptoms are still there; depressive concentration problems are not.",
      "Lifelong demoralisation is not a depressive episode. Many adults with unrecognised ADHD describe years of feeling a failure without anhedonia or neurovegetative change.",
      "Read PHQ-9 items 3, 4, 7 and 8 (sleep, energy, concentration, restlessness) with care: they can be ADHD traits. Items 1 and 2 (loss of interest and low mood) carry the depression signal.",
      "Poor response to several antidepressants, with concentration problems that persist between episodes, is a reason to assess for ADHD, not evidence of it.",
      "Irritability alone is not depression. DSM-5-TR cautions against overdiagnosing a depressive episode in children with ADHD whose mood change is irritability rather than sadness or loss of interest; the same logic helps in adults.",
      "Depressive episodes in adults with ADHD are often set off by the consequences of ADHD: job loss, debt, relationship breakdown. Record both and plan for both.",
      "Medication response is not a diagnostic test. Stimulants improve some cognitive measures in people without ADHD, and stimulant insomnia or appetite loss can inflate depression scores at follow-up."
    ],
    refs: [
      "DSM-5-TR (APA 2022): ADHD and major depressive disorder differential diagnosis sections (paraphrased)",
      "WHO ICD-11 CDDR (2024): 6A05 boundary with mood disorders; depressive episode boundary with ADHD",
      "NICE NG87 (2018, last updated 2019) 1.2.10, 1.3.3; NICE NG222 Depression in adults (2022); NICE NG145 1.2.3; NICE NG225 1.6.1-1.6.3",
      "Kooij JJS et al. Updated European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34 (sections 4.1.4, 6.3, 7.2)",
      "CADDRA Canadian ADHD Practice Guidelines 4.1 (2020), chapter 2: differentiating ADHD from major depression",
      "RCPsych CR235 (2023) section 9.7: trait versus state disorders; BAP 2014 (Bolea-Alamanac et al., J Psychopharmacol 2014;28:179-203): role of neuropsychological testing",
      "Kessler RC et al. Am J Psychiatry 2006;163:716-23 (NCS-R); Fayyad J et al. 2017 (WHO World Mental Health surveys); Solberg BS et al. 2018 (Norwegian registers)",
      "Kroenke K et al. 2001 and PHQ instruction manual (PHQ-9 scoring)",
      "Methylphenidate SmPC (for example Concerta XL), section 4.3 contraindications"
    ]
  },

  /* ------------------------------------------------------------------ Persistent depressive disorder (dysthymia) */
  {
    id: "pdd",
    name: "Persistent depressive disorder (dysthymia)",
    group: "mood",
    core: false,
    icd11: "6A72 dysthymic disorder",
    summary: "Depressed mood for most of the day, on more days than not, for at least two years, with milder depressive symptoms such as low energy, low self-worth, poor concentration and hopelessness. Like ADHD it is chronic and often starts early, so the trait-versus-episode test helps less. The deciding questions are which came first, whether low mood or attention is the core complaint, and whether attention problems are still there on good days.",
    prevalence: "Dysthymia in 12.8% of adults with ADHD over 12 months in the US National Comorbidity Survey Replication (odds ratio 7.5 against adults without ADHD; Kessler 2006). RCPsych CR235 gives 23% in adult ADHD, without a primary source.",
    coexist: "yes",
    coexistNote: "Both can be diagnosed when each meets its own criteria. Chronic low mood can be secondary to years of unrecognised ADHD (demoralisation), so record both and review mood after ADHD treatment. Neither DSM-5-TR nor ICD-11 allows this diagnosis after any manic or hypomanic episode (consider bipolar disorder or cyclothymia instead). DSM-5-TR persistent depressive disorder includes chronic major depression; ICD-11 dysthymic disorder requires that no depressive episode occurred in the first two years.",
    overlap: [
      "Chronic course lasting years, often starting in childhood, adolescence or early adulthood.",
      "Poor concentration and indecision.",
      "Low energy and fatigue.",
      "Low self-worth and a sense of failure.",
      "Hopelessness about change after repeated setbacks.",
      "Under-achievement at school and work.",
      "Disturbed sleep and irregular appetite."
    ],
    favoursADHD: [
      "Inattention, disorganisation and restlessness are the main complaints; low mood comes second in the story.",
      "Attention problems predate the low mood, often by years (school reports, parent account).",
      "Mood lifts quickly with success, novelty, praise or a change of circumstances.",
      "Mood changes are reactive and short-lived, settling within hours (Kooij 2019).",
      "Low self-worth has a clear history: criticism, failed exams, lost jobs, being called lazy.",
      "Interest and pleasure are intact for rewarding activities, and hyperfocus is possible.",
      "Restlessness, impulsivity and talkativeness are present; these are not features of dysthymia.",
      "Concentration problems are the same on low-mood and good-mood days."
    ],
    favoursAlt: [
      "Low, gloomy mood most of the day on more days than not, for two years or more, is the core complaint.",
      "No spell of two months or more free of low mood since it began.",
      "Mood stays low even when circumstances are good: a pay rise, a holiday, a new relationship.",
      "Concentration and drive are worse on low-mood days and better on the rare good days.",
      "Low energy and fatigue rather than restlessness.",
      "Pervasive pessimism and hopelessness, with a reduced capacity to enjoy things.",
      "Childhood described as settled and organised, with gloominess or withdrawal rather than restlessness or disorganisation.",
      "Onset in adolescence or adulthood with no earlier attention or hyperactivity problems.",
      "No hyperactive or impulsive features at any age.",
      "Family history of depressive disorders (ICD-11 notes a raised risk)."
    ],
    ask: [
      "Over the past two years, have you felt down or gloomy for most of the day, on more days than not?",
      "Since this started, has there been a stretch of two months or more when you felt fine?",
      "Which came first: feeling low, or struggling to concentrate and get organised?",
      "On a rare good day, are you still easily distracted, late and losing things?",
      "When something good happens, does your mood lift? For how long?",
      "Does your mood change within a day in response to what happens, or stay flat and low for weeks?",
      "If you could fix one thing, would it be your mood or your focus and organisation?",
      "Do you still enjoy anything? Can you get absorbed in something that interests you?",
      "Do you feel tired and low on energy most of the time, or restless and on the go?",
      "Do you feel hopeless about the future most of the time?",
      "What makes the low mood worse: failures, deadlines and criticism, or does it come without a reason?",
      "What were you like at primary school: restless, chatty and dreamy, or quiet, sad and withdrawn?",
      "Has the low mood ever become much deeper for a few weeks, with sleep, appetite and hope all going?",
      "Have you ever had spells of feeling unusually high or needing very little sleep?",
      "(Informant) How would you describe them most of the time: low and flat, or scattered, restless and up and down?",
      "(Informant) Were the concentration problems there before they became low?"
    ],
    features: [
      { id: "pdd_core", t: "Low mood is the core complaint, present most days for two years or more", w: 3 },
      { id: "pdd_moodfirst", t: "Low mood clearly began before the attention problems", w: 3 },
      { id: "pdd_nonreactive", t: "Mood stays low even when circumstances are good", w: 3 },
      { id: "pdd_attmood", t: "Concentration problems track mood and ease on good days", w: 3 },
      { id: "pdd_nohi", t: "No hyperactive or impulsive features at any age", w: 2 },
      { id: "pdd_child", t: "Childhood account of gloominess or withdrawal, not restlessness or disorganisation", w: 2 },
      { id: "pdd_anhedonia", t: "Reduced capacity for pleasure even in rewarding activities", w: 2 },
      { id: "pdd_nointerval", t: "No symptom-free spell of two months or more since onset", w: 2 },
      { id: "pdd_energy", t: "Persistent low energy and fatigue rather than restlessness", w: 1 },
      { id: "pdd_hopeless", t: "Pervasive pessimism or hopelessness", w: 1 },
      { id: "pdd_fh", t: "Family history of depressive disorders", w: 1 }
    ],
    screen: ["phq9", "cssrs"],
    investigations: [
      "Life chart from childhood: when did low mood start, and when did attention problems start? School reports help date both.",
      "PHQ-9 at baseline and on review. It rates the last two weeks, not duration, so chronicity must come from the interview.",
      "Thyroid function tests where clinically indicated (NICE NG145 1.2.3); ICD-11 excludes low mood caused by a medical condition such as hypothyroidism.",
      "Medicine and substance review: ICD-11 gives benzodiazepines and withdrawal from stimulants as examples of substances that cause persistent low mood; also ask about alcohol and cannabis.",
      "Review chronic physical illness, chronic pain and sleep disorders that sustain low mood (clinical practice).",
      "Psychological therapy (NHS Talking Therapies) or secondary care mental health assessment, depending on severity and risk."
    ],
    redFlags: [
      "Suicidal thoughts: ICD-11 notes that suicide risk is significantly raised in dysthymic disorder.",
      "A deeper depressive episode on top of chronic low mood (double depression), with loss of function.",
      "Any past hypomania or mania: the diagnosis changes to a bipolar or cyclothymic disorder.",
      "Heavy use of alcohol or sedatives to manage mood."
    ],
    decide: {
      better: "Dysthymia better explains the picture when chronic low mood is the core problem, it began before the attention difficulties, concentration varies with mood, there are no childhood ADHD symptoms in records or collateral, and there is no hyperactivity or impulsivity.",
      both: "Diagnose both when childhood-onset ADHD symptoms meet criteria and persist on better-mood days, and low mood on most days for two years also meets dysthymia criteria. This is common, and the low mood is often a reaction to years of ADHD-related failure.",
      next: "Assess risk. When ADHD is clearly established, RCPsych CR235 suggests treating ADHD first in dysthymia; review mood after ADHD treatment and offer psychological therapy for low mood that persists. When ADHD is uncertain, treat the low mood first and rate attention again in a better period, with collateral."
    },
    pearls: [
      "Dysthymia blunts the trait-versus-episode test because both conditions are chronic. Use sequence (which came first), core complaint (mood or attention) and good-day testing instead.",
      "Demoralisation is not dysthymia. Demoralised adults with ADHD feel hopeless about specific tasks and failures but brighten with success; dysthymic mood stays low despite success.",
      "Ask the person to rank their problems. Adults with ADHD usually lead with focus, time and organisation; adults with dysthymia lead with mood.",
      "Hyperactive and impulsive symptoms are not part of dysthymia. If they have been present since childhood, they need another explanation, usually ADHD.",
      "DSM-5-TR and ICD-11 draw this category differently: check which system the report uses and code accordingly.",
      "After successful ADHD treatment, review mood formally. Low mood that persists on medication is a reason to treat the mood disorder, not to keep raising the stimulant dose (clinical practice)."
    ],
    refs: [
      "DSM-5-TR (APA 2022): persistent depressive disorder criteria and ADHD differential diagnosis (paraphrased)",
      "WHO ICD-11 CDDR (2024): 6A72 dysthymic disorder, essential features, course and boundaries",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34, sections 4.1.4 and 6.3 (low mood and lability in ADHD confused with dysthymia)",
      "RCPsych CR235 (2023) section 9.7 and Table 3 (treat ADHD first in dysthymia; rates without primary sources)",
      "Kessler RC et al. Am J Psychiatry 2006;163:716-23 (NCS-R dysthymia 12.8%)",
      "NICE NG222 Depression in adults (2022); NICE NG145 1.2.3"
    ]
  },

  /* ------------------------------------------------------------------ Bipolar I and II */
  {
    id: "bip",
    name: "Bipolar disorder (type I and type II)",
    group: "mood",
    core: true,
    icd11: "6A60 bipolar type I disorder; 6A61 bipolar type II disorder",
    summary: "Episodes of mania (type I) or hypomania (type II), usually with depressive episodes, separated by periods of more normal mood. During a high, distractibility, talkativeness, restlessness, impulsive spending and risk-taking look like ADHD. The difference is that these features come as distinct episodes lasting days to weeks, with elevated, expansive or irritable mood, more energy and less need for sleep, and they are a change from the person's usual self.",
    prevalence: "About 8% of adults with ADHD have bipolar disorder (7.95%), and about 17% of adults with bipolar disorder have ADHD (meta-analysis of 71 studies, Schiweck 2021; also cited in the WFADHD 2026 update preprint). Register diagnoses in 12.9% of women and 8.9% of men with ADHD in Norway (Solberg 2018); 7% in a UK NHS adult ADHD clinic audit (Newman 2026, not peer-reviewed). The 19.4% 12-month figure from the NCS-R (Kessler 2006) used a broad lay-interview definition.",
    coexist: "yes",
    coexistNote: "Both can be diagnosed when each meets its own criteria (DSM-5-TR; ICD-11). In co-occurring cases ADHD symptoms remain present between episodes (Asherson 2014) and tend to worsen during them (ICD-11). Count a symptom towards ADHD only if it is present outside mood episodes; DSM-5-TR advises checking whether a symptom belongs to a distinct episode, which avoids double-counting. Stabilise bipolar disorder before treating ADHD.",
    overlap: [
      "Distractibility and jumping between tasks.",
      "Talkativeness, rapid speech and interrupting.",
      "Racing or crowded thoughts.",
      "Restlessness and increased activity.",
      "Impulsive spending, risk-taking and sexual impulsivity.",
      "Irritability and anger outbursts.",
      "Sleep disturbance.",
      "Starting many projects and not finishing them.",
      "Mood instability and a chaotic life history (relationships, jobs, debt)."
    ],
    favoursADHD: [
      "Symptoms are continuous and trait-like since childhood, varying with demands and interest rather than coming in episodes.",
      "Distractibility and restlessness are present in every mood state, including stable mood.",
      "The sleep problem is difficulty falling asleep, with tiredness the next day; the person needs and wants sleep (CADDRA).",
      "Mood changes are reactive to events, brief (minutes to hours) and within a poorly regulated but essentially normal range (Kooij 2019).",
      "Self-esteem tends to be low; there is no grandiosity.",
      "Sexual impulsivity takes the form of impulsive encounters rather than a sustained rise in sexual drive (CADDRA).",
      "Racing thoughts are described as a lifelong busy mind, not a change from usual.",
      "School reports and parents describe restlessness, dreaminess, lost belongings and unfinished work long before any mood problems.",
      "No hospital admission, psychosis or spells that others saw as out of character."
    ],
    favoursAlt: [
      "Distinct episodes with a recognisable start and end, lasting at least 4 consecutive days (hypomania) or a week (mania), clearly different from the usual self.",
      "Decreased need for sleep: sleeping 3-4 hours and feeling rested, without catching up later.",
      "Elevated, euphoric or expansive mood, or sustained irritability, lasting days.",
      "Grandiosity: inflated self-esteem, belief in special abilities, plans out of keeping with the person's means.",
      "A marked rise in energy and goal-directed activity during the episode.",
      "Pressured speech and flight of ideas that others notice as a change.",
      "Depressive episodes alternating with highs; early-onset, recurrent or postpartum depression raises suspicion.",
      "Mood episodes began in late adolescence or adulthood, after a childhood without attention or hyperactivity problems.",
      "Antidepressant-emergent hypomania or mania that persists beyond the drug's effect (DSM-5-TR counts this towards bipolar disorder).",
      "Psychotic symptoms during episodes, or hospital admission for a mood episode.",
      "Family history of bipolar disorder.",
      "Seasonal or postpartum timing of episodes."
    ],
    ask: [
      "Have you ever had a spell of several days when you needed much less sleep, say three or four hours, but still felt full of energy and not tired?",
      "During that time, did you feel unusually happy, high, invincible or very irritable? Did others say you were not your usual self?",
      "How long did it last: hours, or days to weeks? How did it begin and end?",
      "Did your thoughts race faster than your normal busy mind, so that you jumped from idea to idea?",
      "Did you spend money, start projects, take sexual risks or make big decisions in a way that was out of character, beyond your usual impulsiveness?",
      "Did you feel you had special talents, powers or importance, or that you were destined for something big?",
      "Between those spells, were you still distractible, late and disorganised, as you were at school?",
      "When you cannot sleep, is it that your mind will not switch off and you are exhausted the next day, or that you do not feel the need to sleep?",
      "When your mood changes, how long does it last: minutes or hours after something happens, or days to weeks without a clear reason?",
      "Have you had periods of depression? How old were you at the first one? Did any follow childbirth?",
      "Has an antidepressant ever made you feel wired, high, agitated or unable to sleep? How long did it last?",
      "Has anyone in your family had bipolar disorder, manic depression or psychosis, or died by suicide?",
      "Have you ever been admitted to hospital, or needed to be, because of your mood or behaviour?",
      "During a high or low spell, have you heard or seen things others could not, or believed things others thought were not true?",
      "Did stimulants, cocaine, steroids, cannabis or alcohol come before any of the high spells?",
      "Do the spells cluster at particular times of year?",
      "(Informant) Have there been spells of days when they were noticeably different from their usual self? What did you notice?",
      "(Informant) As a child, before any mood problems, were they restless, distractible or disorganised?"
    ],
    features: [
      { id: "bip_episode", t: "Distinct episodes of at least 4 days that were a clear change from the usual self", w: 3 },
      { id: "bip_sleep", t: "Decreased need for sleep without tiredness during episodes", w: 3 },
      { id: "bip_elev", t: "Elevated, euphoric or expansive mood lasting days", w: 3 },
      { id: "bip_grand", t: "Grandiosity or inflated self-esteem during episodes", w: 3 },
      { id: "bip_interep", t: "Attention and activity normal between episodes", w: 3 },
      { id: "bip_energy", t: "Marked rise in energy and goal-directed activity during episodes", w: 2 },
      { id: "bip_nochild", t: "No childhood attention or hyperactivity problems in records or collateral", w: 2 },
      { id: "bip_observed", t: "Others saw the episodes as out of character", w: 2 },
      { id: "bip_ad", t: "Antidepressant-emergent hypomania or mania", w: 2 },
      { id: "bip_psych", t: "Psychotic symptoms during mood episodes", w: 2 },
      { id: "bip_admit", t: "Hospital admission or crisis care for a mood episode", w: 2 },
      { id: "bip_fh", t: "First-degree relative with bipolar disorder", w: 2 },
      { id: "bip_dep", t: "Recurrent, early-onset or postpartum depressive episodes", w: 1 }
    ],
    screen: ["mdq", "hcl32"],
    investigations: [
      "Structured interview for mood episodes, with collateral from a partner or family member. The MDQ and HCL-32 are prompts only: NICE CG185 1.2.3 advises against questionnaires to identify bipolar disorder in primary care.",
      "Life chart of mood episodes, treatments, substances and ADHD symptoms from childhood to now.",
      "Prospective mood, energy and sleep diary for several weeks if episodes are unclear.",
      "Thyroid function tests; urine drug screen if substance-induced mood symptoms are possible.",
      "Medicine review for agents that can induce mania or hypomania: antidepressants, corticosteroids, stimulants including ADHD medication, levodopa (clinical practice).",
      "Neurological assessment and brain imaging if a first manic episode occurs in mid or later life or with neurological signs (secondary mania; clinical practice).",
      "Refer to or discuss with general adult psychiatry or the community mental health team if bipolar disorder is suspected (NICE CG185)."
    ],
    redFlags: [
      "Current mania or hypomania: do not start a stimulant; arrange urgent psychiatric review if severe.",
      "Psychotic symptoms.",
      "Suicidal thoughts, especially in mixed states (low mood with agitation and racing thoughts).",
      "Dangerous risk-taking, debt or sexual risk during an episode.",
      "New manic symptoms after starting a stimulant or antidepressant.",
      "First manic episode in mid or later life, or with neurological signs: look for a medical cause.",
      "Pregnancy or the postpartum period in someone with bipolar disorder (perinatal psychiatry)."
    ],
    decide: {
      better: "Bipolar disorder better explains the picture when the ADHD-like features occur only within mood episodes, attention and activity are normal between episodes, and there is no convincing childhood history from records or informants. Late onset, episodic course and the intensity of mood elevation all point to bipolar disorder (ICD-11).",
      both: "Diagnose both when childhood-onset ADHD symptoms are present in euthymic periods and the person also has clear hypomanic or manic episodes. The combination is common, and comorbid ADHD is linked to onset of bipolar disorder about 4 years earlier (Schiweck 2021).",
      next: "Refer to or discuss with psychiatry and stabilise mood first (Kooij 2019 section 7.5.1; CADDRA). Do not give a stimulant without mood-stabilising treatment: in a Swedish register study (Viktorin 2017, cited by Kooij 2019), methylphenidate alone raised the risk of mania in the following 3 months (hazard ratio 6.7), while methylphenidate added to a mood stabiliser did not (hazard ratio 0.6). Methylphenidate SmPCs list severe, episodic (type I) bipolar disorder that is not well controlled as a contraindication (section 4.3). Rate ADHD symptoms in a stable period, with collateral, and monitor sleep and mood closely after any ADHD medication is started."
    },
    pearls: [
      "Decreased need for sleep, with elation and grandiosity, is among the most discriminating features (CADDRA). ADHD: tired but unable to switch off. Hypomania: sleeps little and does not miss it.",
      "Ask about episodes, not symptoms. Almost every adult with ADHD says yes to distractibility, talkativeness and racing thoughts; the question is whether these came as a spell that differed from their normal self.",
      "About half of adults with ADHD screen positive on the MDQ (50.2% versus 5% of controls; Lundervold 2020). A positive MDQ means 'ask about episodes', not 'bipolar'.",
      "Mood shifts within a day, triggered by events, fit ADHD emotional dysregulation or emotionally unstable personality disorder. DSM-5-TR requires at least 4 consecutive days for a hypomanic episode.",
      "Bipolar II is often missed because people present in the depressed phase and remember hypomania as a good, productive spell. Ask every depressed adult with suspected ADHD about past highs, and ask an informant too.",
      "Antidepressant activation is not the same as a switch. DSM-5-TR counts a full hypomanic episode that persists beyond the drug's effect; one or two symptoms such as edginess or agitation are not enough.",
      "When both are present, ADHD symptoms worsen during mood episodes (ICD-11). Rate ADHD in a euthymic period, and ask the informant to compare.",
      "Sleep loss is both a trigger and an early warning sign of mania. Monitor sleep closely after starting ADHD medication in anyone with a bipolar history (clinical practice)."
    ],
    refs: [
      "DSM-5-TR (APA 2022): manic and hypomanic episode criteria; ADHD and bipolar I differential diagnosis sections (paraphrased)",
      "WHO ICD-11 CDDR (2024): 6A05 boundary with mood disorders; manic episode and 6A60/6A61 boundaries with ADHD",
      "NICE CG185 Bipolar disorder: assessment and management (2014) 1.2.3; NICE NG87 1.3.3",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34, sections 4.1.4, 6.3, 7.2 and 7.5.1",
      "CADDRA Canadian ADHD Practice Guidelines 4.1 (2020), chapter 2: differentiating ADHD from bipolar disorder",
      "Asherson P et al. Curr Med Res Opin 2014: ADHD in relation to bipolar disorder and borderline personality disorder in adults",
      "Schiweck C et al. Neurosci Biobehav Rev 2021: ADHD and adult bipolar disorder, systematic review and meta-analysis",
      "Viktorin A et al. Am J Psychiatry 2017;174:341-8: treatment-emergent mania with methylphenidate in bipolar disorder (Swedish registers)",
      "Lundervold AJ et al. Front Psychol 2020;11:571101 (MDQ in adult ADHD); Hirschfeld RMA et al. Am J Psychiatry 2000 (MDQ); Angst J et al. J Affect Disord 2005 (HCL-32)",
      "RCPsych CR235 (2023) section 9.7.1: ADHD can mimic mania; explore the time course with a third party",
      "Methylphenidate SmPC (for example Concerta XL), section 4.3 contraindications"
    ]
  },

  /* ------------------------------------------------------------------ Cyclothymic disorder */
  {
    id: "cyclo",
    name: "Cyclothymic disorder",
    group: "mood",
    core: false,
    icd11: "6A62 cyclothymic disorder",
    summary: "A chronic pattern, lasting at least two years, of numerous periods of hypomanic symptoms and periods of depressive symptoms that never reach a manic episode and, in the first two years, never reach a depressive episode (ICD-11; DSM-5-TR also excludes full hypomanic episodes). Because it is persistent and often begins in adolescence, it is the mood disorder most easily confused with ADHD mood lability. The difference is what swings: in cyclothymia, mood, energy, sleep need and confidence shift together for days at a time; in ADHD, emotional reactions are brief and triggered, and attention problems are constant.",
    prevalence: "No reliable figure for cyclothymia in adults with ADHD was found. DSM-5-TR gives a lifetime general-population prevalence of about 0.4-1%. ICD-11 notes that co-occurring disorders, particularly ADHD, are common in children and adolescents with cyclothymic disorder, and Kooij 2019 names cyclothymia among the conditions that ADHD mood lability can be confused with.",
    coexist: "sometimes",
    coexistNote: "Both can be diagnosed when each meets its own criteria (ICD-11 CDDR); when they co-occur, ADHD symptoms tend to worsen during hypomanic periods. Under ICD-11, a manic or mixed episode changes the diagnosis to bipolar I disorder, and a depressive episode in someone with past hypomanic episodes changes it to bipolar II disorder. DSM-5-TR changes the diagnosis if any full major depressive, manic or hypomanic episode occurs. Swings caused by a medical condition (such as hyperthyroidism) or by a substance, including stimulants, do not count towards cyclothymia.",
    overlap: [
      "Chronic course with onset in adolescence or early adulthood.",
      "Frequent ups and downs that the person describes as 'mood swings'.",
      "Bursts of energy, talkativeness and starting projects, then dropping them.",
      "Irritability and short temper.",
      "Impulsive spending and risk-taking.",
      "Variable productivity and unreliable performance at work.",
      "Irregular sleep.",
      "Relationship strain from unpredictability."
    ],
    favoursADHD: [
      "Mood changes are reactions to events (frustration, rejection, boredom) and settle within minutes to hours (Kooij 2019).",
      "Sleep need does not change: the person always wants more sleep but struggles to switch off.",
      "Energy and confidence do not rise and fall together in multi-day phases.",
      "Distractibility, disorganisation and lateness are the same in every mood state.",
      "Clear childhood onset, before 12, of inattention or hyperactivity, documented in school reports or by parents.",
      "Bursts of activity follow interest and novelty (hyperfocus), not a phase of raised mood.",
      "A prospective chart shows many short reactive dips rather than multi-day cycles."
    ],
    favoursAlt: [
      "Shifts last days rather than minutes or hours.",
      "'Up' periods bring reduced sleep need, more energy, more confidence and sociability together.",
      "'Down' periods bring oversleeping, slowing, low self-worth and withdrawal.",
      "Shifts often come without a clear trigger.",
      "Concentration changes with the mood phase and is good in steady spells.",
      "Mood symptoms on more days than not for two years, never steady for two months or more.",
      "Swings began in adolescence or adulthood, with no childhood attention or hyperactivity problems.",
      "First-degree relative with bipolar disorder.",
      "An antidepressant triggered several hypomanic symptoms together (raised mood, energy and confidence, less need for sleep), not just edginess or agitation.",
      "Informants describe spells of days when the person was clearly 'not themselves'.",
      "A daily mood, energy and sleep chart shows multi-day cycles."
    ],
    ask: [
      "Do your energy and confidence go up and down in spells lasting several days, or does your mood change within the hour depending on what happens?",
      "In an 'up' spell, do you need less sleep than usual without feeling tired?",
      "In an 'up' spell, do you feel more confident, sociable, talkative and full of ideas than you normally are?",
      "In a 'down' spell, do you sleep more, slow down, lose confidence and pull away from people?",
      "Do the spells come out of the blue, or are they always set off by something that happened?",
      "How long do the up and down spells usually last? How many do you have in a typical month?",
      "Over the past two years, has there been a stretch of two months or more when your mood was steady?",
      "Is your concentration the same in up, down and steady spells, or does it change with them?",
      "When did the swings start? What were you like before, at primary school?",
      "Have the swings ever been strong enough that others said you were not yourself, or you needed time off?",
      "Do you get more done in the up spells, then drop projects when the low comes?",
      "Has an antidepressant ever made you feel wired, high or unable to sleep?",
      "Does anyone in your family have bipolar disorder, mood swings that needed treatment, or a history of suicide?",
      "Have caffeine, alcohol, cannabis, stimulants or a prescribed medicine started or changed the swings?",
      "Do the swings follow your menstrual cycle or the seasons?",
      "(Informant) Are there spells of days when they seem unusually high or unusually flat compared with their usual self?",
      "(Informant) As a child, were they restless, dreamy and disorganised all the time, or did the problems start with the mood swings in their teens?"
    ],
    features: [
      { id: "cyclo_days", t: "Mood and energy shifts last days rather than minutes or hours", w: 3 },
      { id: "cyclo_package", t: "'Up' periods bring reduced sleep need, more energy and more confidence together", w: 3 },
      { id: "cyclo_attvar", t: "Concentration changes with the mood phase and is good in steady spells", w: 3 },
      { id: "cyclo_onset", t: "Swings began in adolescence or adulthood, with no childhood attention problems", w: 3 },
      { id: "cyclo_chart", t: "A prospective daily chart shows multi-day cycles of mood, energy and sleep", w: 3 },
      { id: "cyclo_down", t: "'Down' periods bring oversleeping, slowing, low self-worth and withdrawal", w: 2 },
      { id: "cyclo_untriggered", t: "Shifts often occur without a clear trigger", w: 2 },
      { id: "cyclo_2yr", t: "Mood symptoms on more days than not for two years, never steady for two months", w: 2 },
      { id: "cyclo_fh", t: "First-degree relative with bipolar disorder", w: 2 },
      { id: "cyclo_ad", t: "An antidepressant triggered hypomanic symptoms, not just edginess or agitation", w: 2 },
      { id: "cyclo_observed", t: "Informants describe spells of days when the person was 'not themselves'", w: 2 }
    ],
    screen: ["mdq", "hcl32"],
    investigations: [
      "Prospective daily chart of mood, energy, sleep, substances and (where relevant) menstrual cycle for four to eight weeks (clinical practice).",
      "Thyroid function tests: ICD-11 excludes swings caused by a medical condition such as hyperthyroidism (NICE NG145 1.2.3 supports testing in unexplained anxiety or depression).",
      "Substance history and, where relevant, urine drug screen: stimulant, cannabis and alcohol use can produce on-off cycles of energy and mood.",
      "Collateral from a partner or family member about multi-day changes from baseline, and school reports for childhood attention.",
      "Refer to or discuss with general adult psychiatry if a bipolar-spectrum disorder is likely (NICE CG185)."
    ],
    redFlags: [
      "Any period meeting criteria for hypomania or mania: reassess as bipolar disorder.",
      "Suicidal thoughts in low phases.",
      "Psychotic symptoms, which are not typical of cyclothymia: reconsider the diagnosis.",
      "Escalating mood instability after starting a stimulant or antidepressant.",
      "Rapidly escalating spending, sexual risk or dangerous driving in 'up' phases."
    ],
    decide: {
      better: "Cyclothymia better explains the picture when the problems with attention, activity and impulsivity rise and fall with multi-day mood phases, were not present in childhood, and are absent in steady periods.",
      both: "Diagnose both when childhood-onset ADHD symptoms persist across all mood phases, including steady spells, and the swings themselves meet cyclothymia criteria: multi-day hypomanic and depressive periods with changes in sleep need and energy, over at least two years.",
      next: "Ask for a daily mood, energy and sleep chart for four to eight weeks and obtain collateral. Refer to or discuss with general adult psychiatry if cyclothymia or bipolar disorder is likely. If ADHD medication is started in someone with cyclothymia, monitor closely for hypomanic symptoms and sleep loss; symptoms caused by a stimulant do not count towards cyclothymia but do need review."
    },
    pearls: [
      "The most useful question is about sleep need in the 'up' times. Needing less sleep and not missing it points to a hypomanic mechanism; wanting to sleep but being unable to switch off points to ADHD or insomnia.",
      "Count duration in days, not hours. Kooij 2019 describes ADHD emotional changes as short-lived reactions to daily events with a return to baseline within a few hours.",
      "Retrospective accounts of 'constant mood swings' are hard to interpret. A daily chart separates brief reactive dips from multi-day phases (clinical practice).",
      "Cyclothymia carries a high risk of later bipolar I or II disorder: 15-50% (DSM-5-TR). Check again for full episodes at follow-up, especially after starting stimulants or antidepressants.",
      "Swings locked to the menstrual cycle suggest premenstrual dysphoric disorder, or premenstrual worsening of ADHD, rather than cyclothymia (clinical practice).",
      "Emotionally unstable personality disorder is the third option: swings within a day driven by relationships, with fear of abandonment, emptiness and self-harm, point there.",
      "Hypomanic symptoms overlap with ADHD distractibility, hyperactivity and impulsivity; ICD-11 separates them by their episodic nature and the accompanying elevated, euphoric or irritable mood."
    ],
    refs: [
      "WHO ICD-11 CDDR (2024): 6A62 cyclothymic disorder, essential features, course, developmental presentations and boundary with ADHD",
      "DSM-5-TR (APA 2022): cyclothymic disorder criteria, prevalence and course, including the 15-50% risk of later bipolar I or II disorder (paraphrased)",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34, sections 4.1.4 and 6.3",
      "CADDRA Canadian ADHD Practice Guidelines 4.1 (2020), chapter 2: ADHD and bipolar-spectrum differentiation",
      "NICE CG185 Bipolar disorder 1.2.3 (no questionnaires to identify bipolar disorder in primary care)",
      "Angst J et al. J Affect Disord 2005;88:217-33 (HCL-32); Lundervold AJ et al. 2020 (MDQ positive in about half of adults with ADHD)"
    ]
  },

  /* ------------------------------------------------------------------ Burnout and chronic stress overload */
  {
    id: "burnout",
    name: "Burnout and chronic stress overload",
    group: "trauma",
    core: false,
    ages: "adult",
    icd11: "QD85 burnout (chapter 24, factors influencing health status: an occupational phenomenon, not a mental disorder). For overload outside work, consider 6B43 adjustment disorder.",
    summary: "ICD-11 describes burnout as the result of chronic workplace stress that has not been successfully managed, with exhaustion, mental distance or cynicism about the job, and reduced professional efficacy. Exhaustion and overload cause forgetfulness, poor focus, irritability and an inability to unwind that can look like adult-onset ADHD, but these begin with the overload and ease with rest. Burnout is also a common way for adults with lifelong, unrecognised ADHD to present for the first time, when their coping strategies fail.",
    prevalence: "No reliable prevalence figure for burnout in adults with ADHD was found: burnout is not a diagnosis in DSM-5-TR or ICD-11, and studies use different definitions and measures. Clinical practice: exhaustion after years of compensating is a frequent reason adults first seek ADHD assessment, so burnout is often the trigger for referral rather than an alternative explanation.",
    coexist: "yes",
    coexistNote: "Burnout does not exclude ADHD; it often sits alongside it and can reveal it. Decide whether the ADHD-type symptoms predate the overload (from childhood) or began with it. If the exhaustion meets criteria for a depressive episode, an anxiety disorder or adjustment disorder, diagnose that condition rather than relying on the burnout label. ICD-11 restricts the term burnout to the occupational context.",
    overlap: [
      "Forgetfulness, losing track of tasks and missed deadlines.",
      "Poor concentration and slowed thinking at work.",
      "Procrastination and difficulty starting tasks.",
      "Irritability and a short fuse.",
      "Inability to switch off or relax; feeling 'wired but tired'.",
      "Sleep problems and daytime fatigue.",
      "Falling performance and a reduced sense of competence.",
      "Emotional overwhelm and withdrawal from social contact."
    ],
    favoursADHD: [
      "Attention, organisation and time problems were present at school, long before the current job or caring role.",
      "The problems persist on holiday and after a period of rest, once energy has returned.",
      "The same difficulties appeared in earlier jobs, courses and relationships, including easy periods.",
      "The person has always needed far more effort, structure or help than peers to keep up (compensation and scaffolding).",
      "The overload began when the scaffolding fell away: a promotion, a new manager, home working, parenthood, a move away from family support (clinical practice).",
      "Hyperactive-impulsive features since childhood: restlessness, interrupting, impulsive decisions.",
      "Parents, siblings or school reports describe similar difficulties in childhood.",
      "Work problems centre on organisation and sustaining effort on dull tasks rather than on cynicism about the job."
    ],
    favoursAlt: [
      "Clear onset during a period of sustained excessive demand: workload, staff shortages, caring duties, conflict or job insecurity.",
      "Before the overload the person was organised and reliable, with good reports from school and earlier jobs.",
      "Profound exhaustion is the main complaint; attention problems follow the fatigue.",
      "Cynicism, detachment or dread about the job itself (mental distance from work).",
      "A new loss of confidence in professional competence.",
      "Symptoms ease on holiday, sick leave or after demands fall, then return with the stressor.",
      "Physical stress symptoms such as headaches, gut upset, muscle tension or frequent infections (clinical practice).",
      "New 'brain fog' in midlife with no earlier history.",
      "Informants describe a change in a previously capable person.",
      "No childhood attention or hyperactivity problems in school reports or collateral."
    ],
    ask: [
      "When did these problems start? What was happening in your life and work at the time?",
      "Before this stressful period, how organised and reliable were you at work and at home?",
      "At primary and secondary school, did teachers comment on daydreaming, careless mistakes, unfinished work or restlessness?",
      "On holiday, or after a week or two of proper rest, does your focus come back to normal?",
      "Have you had the same problems in other jobs or courses, including ones that were not stressful?",
      "Is your main problem exhaustion, or keeping focused and organised even when you have energy?",
      "How do you feel about your job now: detached, cynical, dreading it? Was that always the case?",
      "How many hours are you working, and how much are you caring for others?",
      "Have you always needed extra systems, lists, late nights or help from others to keep up? What happened when they fell away?",
      "What changed recently: a new role, manager or workload, home working, a baby, a bereavement, an illness?",
      "Do you still enjoy things outside work? Has your mood been low or flat most days for two weeks or more?",
      "How is your sleep? How much caffeine, alcohol or anything else are you using to keep going or to wind down?",
      "Do you have physical symptoms such as headaches, stomach problems or frequent infections?",
      "If your demands went back to normal tomorrow, which problems would go and which would stay?",
      "Do you find social situations, noise or crowds draining? Has anyone suggested you might be autistic?",
      "(Informant) Were they like this before the current pressure, for example as a teenager or in their first job?",
      "(Informant) Did they change recently, or have they always been forgetful, late and disorganised?"
    ],
    features: [
      { id: "burnout_onset", t: "Clear onset during a period of sustained excessive demand or stress", w: 3 },
      { id: "burnout_before", t: "Organised and reliable before the overload (school, earlier jobs, informant)", w: 3 },
      { id: "burnout_rest", t: "Attention problems ease on holiday, leave or with reduced demands", w: 3 },
      { id: "burnout_nochild", t: "No childhood attention or hyperactivity problems in records or collateral", w: 3 },
      { id: "burnout_exhaust", t: "Exhaustion is the main complaint and drives the attention problems", w: 2 },
      { id: "burnout_cynic", t: "Mental distance from or cynicism about the job", w: 2 },
      { id: "burnout_load", t: "Demands that would overwhelm most people (hours, caring, staffing)", w: 2 },
      { id: "burnout_change", t: "Informants describe a change in a previously capable person", w: 2 },
      { id: "burnout_efficacy", t: "New loss of confidence in professional competence", w: 1 },
      { id: "burnout_somatic", t: "Physical stress symptoms such as headaches, gut upset or muscle tension", w: 1 },
      { id: "burnout_nohi", t: "No lifelong restlessness or impulsivity", w: 1 }
    ],
    screen: ["phq9", "gad7", "isi", "auditc", "aq10"],
    investigations: [
      "No blood test or scale diagnoses burnout. Where fatigue is prominent, exclude physical causes: full blood count, ferritin, thyroid function, glucose or HbA1c, B12 and folate (clinical practice; NICE NG145 1.2.3 for thyroid tests in depression or unexplained anxiety).",
      "Screen for depression, anxiety, insomnia and alcohol use (PHQ-9, GAD-7, ISI, AUDIT-C), because burnout often overlaps with or progresses to these.",
      "Sleep history, and assessment for obstructive sleep apnoea when daytime sleepiness is marked.",
      "A period of reduced demands (leave or adjusted duties) followed by reassessment can settle the question: overload symptoms ease, ADHD traits persist.",
      "Occupational health referral and a fit note where needed; reasonable adjustments under the Equality Act 2010 where a condition (for example ADHD, autism or depression) amounts to a disability; Access to Work support.",
      "Autism assessment if social exhaustion, sensory overload and loss of skills suggest autistic burnout (AQ-10 6 or above, or clinical suspicion: NICE CG142 1.2.3)."
    ],
    redFlags: [
      "Suicidal thoughts or hopelessness: a burnout label does not lower risk; assess as for depression.",
      "Exhaustion with weight loss, night sweats, breathlessness or other physical symptoms: investigate medically.",
      "Escalating use of alcohol, sedatives or non-prescribed stimulants to cope.",
      "Loss of skills, shutdowns or inability to manage self-care (possible autistic burnout or a depressive episode).",
      "Workplace bullying, harassment, or safeguarding concerns at home."
    ],
    decide: {
      better: "Burnout or stress overload better explains the picture when the attention and organisation problems began with a period of sustained excessive demand, the person was organised and reliable before (confirmed by records or informants), there is no childhood history, and the symptoms ease when demands fall. Do not diagnose ADHD on problems that began in adulthood during overload.",
      both: "Record both when childhood-onset ADHD criteria are met and a recent overload has added exhaustion on top. Many adults with ADHD reach assessment when compensation fails; the burnout is then partly a consequence of unrecognised ADHD and both need a plan.",
      next: "Screen for depression, anxiety, insomnia and alcohol use, and treat any disorder found. Advise rest, workload reduction and occupational health support (NICE NG212 covers mental wellbeing at work). If ADHD is uncertain, rate attention again after a period of reduced demand, with collateral and school reports."
    },
    pearls: [
      "Ask the 'before' question: what were you like before this job or this period? A previously organised person who became forgetful under overload has an overload problem until shown otherwise.",
      "Burnout is often the moment unrecognised ADHD becomes visible. Look for the scaffolding that held things together, such as a structured job, an organising partner or long hours of compensation, and what happened when it went (clinical practice).",
      "ICD-11 limits burnout to work. For overload from caring, money or family stress, consider adjustment disorder or the relevant mood or anxiety disorder.",
      "Rest is a useful test. Overload symptoms improve with sustained rest (weeks, not a weekend); ADHD traits remain, although they may impair less when demands are lower.",
      "Burnout has no agreed clinical definition beyond ICD-11's description and no diagnostic cut-off. Questionnaire scores alone cannot decide it.",
      "Consider autistic burnout in autistic adults: long-lasting exhaustion, loss of skills and reduced tolerance of sensory input after chronic stress and masking (Raymaker 2020). Autism and ADHD often co-occur.",
      "New 'brain fog' in midlife has a wide differential: depression, perimenopause, sleep disorders, medicines and medical causes as well as burnout. ADHD needs a childhood history whatever the age at presentation."
    ],
    refs: [
      "WHO ICD-11 MMS: QD85 burnout (occupational phenomenon, chapter 24); WHO statement 'Burn-out an occupational phenomenon' (May 2019)",
      "WHO ICD-11 CDDR (2024): 6B43 adjustment disorder",
      "Bianchi R, Schonfeld IS, Laurent E. Burnout-depression overlap: a review. Clin Psychol Rev 2015;36:28-41",
      "Raymaker DM et al. Defining autistic burnout. Autism in Adulthood 2020;2(2):132-143",
      "NICE NG212 Mental wellbeing at work (2022); NICE CG142 1.2.3 (AQ-10); NICE NG145 1.2.3",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34, section 4 (collateral is especially valuable when high ability or a structured upbringing obscured childhood symptoms)",
      "NICE NG87 1.3.3 (symptoms must be present across settings and cause at least moderate impairment)"
    ]
  }
]);
