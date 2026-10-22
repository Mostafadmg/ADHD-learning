/* ddx-personality-sud: differential diagnosis cards for personality disorders, substance use and
   behavioural addictions, and eating disorders (ARCHITECTURE.md section 5.5).
   Conditions, in order: bpd, aspd, sud_cannabis, sud_alcohol, sud_stim, gambling, gaming, eating.
   Core (reviewed in every adult assessment): bpd, sud_cannabis, sud_alcohol.
   Sources: DSM-5-TR (APA 2022) and ICD-11 CDDR (WHO 2024), paraphrased; NICE NG87, CG78, CG77, CG115,
   CG51, NG248 and NG69 (recommendation numbers checked on nice.org.uk in October 2026); CADDRA 4.1 (2020);
   Kooij et al. 2019 European consensus; RCPsych CR235 (2023); Crunelle et al. 2018 international consensus
   on ADHD and SUD; Young et al. 2018 UKAP consensus on offenders; Australian ADHD guideline (AADPA 2022);
   the epidemiological papers named in each entry. Interview questions are original clinical prompts built
   from the cited discriminating features; they are not a validated interview. Points without a named
   source are clinical practice. */
AA.add('ddx', [

  /* ------------------------------------------------------------------ Borderline personality disorder */
  {
    id: "bpd",
    name: "Borderline personality disorder (emotionally unstable personality disorder; ICD-11 personality disorder with borderline pattern)",
    group: "personality",
    core: true,
    icd11: "6D10 Personality disorder (6D10.0 mild, 6D10.1 moderate, 6D10.2 severe) with 6D11.5 Borderline pattern",
    summary: "An enduring pattern of unstable relationships, self-image and emotion with marked impulsivity, usually emerging in adolescence or early adulthood. It shares impulsivity, mood lability, anger and relationship problems with ADHD, and the two often co-occur. The discriminators are the interpersonal engine of the symptoms (fear of abandonment, idealisation and devaluation), identity disturbance, chronic emptiness, recurrent self-harm and stress-related dissociation, none of which belong to ADHD.",
    prevalence: "Lifetime BPD in 33.7% of adults with ADHD versus 5.2% of the general population (NESARC, cited in CADDRA 4.1). Any personality disorder in 13.6% of women and 9.1% of men with ADHD in Norwegian registers (Solberg 2018), and in 19% of adults newly diagnosed in one UK NHS clinic audit (Newman 2026, conference abstract, not peer reviewed). Reverse direction: ADHD in about 20% of adults with BPD (Asherson 2014) and 30-60% in retrospective or self-report studies (Ditrich 2021).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed when each is met in its own right. DSM-5-TR lists personality disorders among the conditions that must not better explain the ADHD symptoms, and notes that ADHD is not characterised by fear of abandonment, self-injury or extreme ambivalence. ICD-11 notes that persistent ADHD can be hard to separate from personality disorder with prominent disinhibition or negative affectivity, and that whether an added personality disorder diagnosis is useful depends on the clinical situation. Both are trait-like (RCPsych CR235), so a lifelong course does not discriminate: use the age at onset, corroborated childhood symptoms and the features specific to BPD. NICE CG78 1.3.6.1 advises reviewing a diagnosis made during a crisis before treating a comorbid condition.",
    overlap: [
      "Impulsivity: spending, risky sex, reckless driving, substance use, binge eating",
      "Rapid mood shifts and low frustration tolerance",
      "Intense or poorly controlled anger and irritability",
      "Unstable relationships, frequent break-ups and conflict",
      "Boredom and stimulation seeking",
      "Unstable work and study history",
      "Both are chronic and trait-like, so a lifelong course does not separate them",
      "Both are associated with childhood adversity and with substance misuse",
      "Screens overlap: impulsivity, anger and mood items on the MSI-BPD and mood questionnaires are endorsed in ADHD"
    ],
    favoursADHD: [
      "Inattention, disorganisation and restlessness documented in primary school, before adolescent relationships began",
      "Impulsivity in every mood and setting, including calm and content periods (blurting, interrupting, impulse buys)",
      "Anger is quick, thoughtless and short-lived, with a return to baseline within hours (Kooij 2019)",
      "Relationship problems come from forgetting, lateness, not listening and impulsive remarks, not from fear of abandonment",
      "A stable core sense of self and values despite a chaotic life",
      "Mood shifts follow everyday frustration, boredom or overload rather than perceived rejection",
      "No repeated self-harm used to manage emotional pain (self-harm is also more common in ADHD, so a single episode does not discriminate; Kooij 2019)",
      "Informants describe a scattered, restless person even when relationships are going well"
    ],
    favoursAlt: [
      "Frantic efforts to avoid real or imagined abandonment",
      "Relationships swing between idealisation and devaluation",
      "Identity disturbance: markedly unstable self-image, goals, values or sense of self",
      "Chronic feelings of emptiness",
      "Recurrent self-harm, suicidal threats or suicide attempts",
      "Impulsive acts mainly in states of intense negative emotion, often after an interpersonal trigger",
      "Intense dysphoric mood states, usually lasting a few hours but up to several days (ICD-11), often set off by perceived rejection or criticism",
      "Transient stress-related paranoid ideas or dissociation (feeling unreal, losing time)",
      "Onset of the pattern in adolescence or early adulthood with no convincing childhood inattention or hyperactivity",
      "A view of the self as bad, worthless or profoundly different from other people (ICD-11)",
      "ADHD-type symptoms largely settle when relationships and mood are stable"
    ],
    ask: [
      "When someone close to you seems to pull away, what happens inside you, and what do you do next?",
      "Do you go to great lengths to stop people leaving you, even when part of you knows they are not really going?",
      "Do your feelings about the people closest to you swing from thinking they are wonderful to thinking they are awful?",
      "Do you have a steady sense of who you are, what you value and what you want, or does that change a lot depending on who you are with?",
      "Do you often feel empty inside, as if there is nothing there?",
      "Have you ever hurt yourself on purpose or tried to end your life? What was happening at the time?",
      "When you do something impulsive, what usually comes just before it: feeling hurt or rejected, or simply seeing something and acting?",
      "Do you also act on impulse when you are content and nothing is wrong, for example interrupting, buying on a whim or jumping between tasks?",
      "When you get angry, how long does it last, and how quickly are you back to your normal self?",
      "When you are very upset, do you ever feel unreal or detached, lose chunks of time, or feel that people are against you?",
      "When things are calm and your relationships are good, are you still disorganised, forgetful, late or restless?",
      "Think back to primary school, before teenage friendships and relationships. Were you distractible, fidgety or forgetful then? What did your reports say?",
      "How old were you when the relationship difficulties and big emotional swings started?",
      "What was it like for you growing up? Did you feel safe at home?",
      "When you lose friends, is it because you forget to reply, turn up late or say things without thinking, or because things become intense and then fall apart?",
      "(Informant) On an ordinary calm day, what are they like: scattered and restless, or settled and organised?",
      "(Informant) Do the big emotional storms mostly come after arguments, rejections or separations?"
    ],
    features: [
      { id: "bpd_abandon", t: "Frantic efforts to avoid real or imagined abandonment", w: 3 },
      { id: "bpd_identity", t: "Identity disturbance: markedly unstable self-image or sense of self", w: 3 },
      { id: "bpd_selfharm", t: "Recurrent self-harm, suicidal threats or suicide attempts", w: 3 },
      { id: "bpd_onset", t: "Pattern began in adolescence or early adulthood, with no convincing evidence of ADHD symptoms before 12", w: 3 },
      { id: "bpd_idealise", t: "Relationships alternate between idealisation and devaluation", w: 2 },
      { id: "bpd_empty", t: "Chronic feelings of emptiness", w: 2 },
      { id: "bpd_trigger", t: "Impulsive acts mainly follow interpersonal triggers or intense negative emotion", w: 2 },
      { id: "bpd_dissoc", t: "Stress-related dissociation or transient paranoid ideas", w: 2 },
      { id: "bpd_calm", t: "Inattention and restlessness largely settle when mood and relationships are stable", w: 2 },
      { id: "bpd_dysphoria", t: "Intense dysphoric states lasting hours to days after perceived rejection", w: 1 },
      { id: "bpd_selfview", t: "Persistent view of the self as bad, worthless or profoundly different from others", w: 1 },
      { id: "bpd_msi", t: "MSI-BPD 7 or more, with positive items beyond impulsivity, anger and mood swings", w: 1 }
    ],
    screen: ["msibpd", "cssrs", "itq", "aceq"],
    investigations: [
      "No blood test or scan helps: the diagnosis is clinical, built on the longitudinal history and collateral.",
      "School reports and a parent or older sibling account of the person before age 12, to show whether ADHD features came before the adolescent difficulties.",
      "Previous mental health records: crisis presentations, self-harm episodes, earlier personality assessments and diagnoses made during a crisis.",
      "Structured personality assessment when uncertain (for example SCID-5-PD or IPDE; licensed instruments used by trained staff).",
      "Screen for co-occurring complex PTSD or PTSD (ITQ, PCL-5), depression, eating disorders and substance use.",
      "Referral: community mental health team or specialist personality disorder service for assessment and psychological treatment (NICE CG78). For women where reducing recurrent self-harm is the priority, NICE CG78 1.3.4.5 suggests a comprehensive DBT programme."
    ],
    redFlags: [
      "Current suicidal thoughts, recent self-harm or escalating risk: assess and safety-plan the same day. Do not use risk scales to predict suicide (NICE NG225).",
      "Repeated crises during the assessment period, when interview answers may not reflect the person's baseline.",
      "Domestic abuse, a coercive relationship or exploitation: follow safeguarding procedures.",
      "Requests for stimulants during a crisis or to manage emotional pain; overdose risk with any new medicine.",
      "Co-occurring alcohol or drug misuse, which raises impulsivity and self-harm risk.",
      "Dependent children in a chaotic household: consider their needs (NICE CG78 1.3.1.2)."
    ],
    decide: {
      better: "BPD better explains the picture when the inattentive and impulsive symptoms appear mainly in emotional crises or after interpersonal triggers, began in adolescence alongside the relationship difficulties, and there is no convincing evidence from records or an informant of ADHD symptoms before age 12. Do not diagnose ADHD on emotional dysregulation and impulsivity alone.",
      both: "Diagnose both when childhood-onset inattention and/or hyperactivity is corroborated and persists in calm, stable periods, and BPD-specific features (abandonment fear, identity disturbance, emptiness, recurrent self-harm) are also present. Count each symptom once, for the disorder that explains it best.",
      next: "Assess and manage risk first. If uncertain, obtain school reports and a childhood informant, and reassess after a period of stability rather than during a crisis. Refer to community mental health or personality disorder services for psychological treatment. If ADHD is diagnosed, treat both: ADHD medication may reduce impulsivity but does not treat BPD (CADDRA 4.1), and NICE CG78 1.3.5.1 advises against drug treatment for BPD itself. Methylphenidate SmPCs list psychopathic or borderline personality disorder among contraindications, so prescribing needs specialist judgement, documented reasoning and a plan for overdose and misuse risk."
    },
    pearls: [
      "Course does not separate the two: both are trait-like (RCPsych CR235). Use the age at onset and the trigger for each symptom instead.",
      "Ask what comes just before an impulsive act. Rejection, abandonment or shame points to BPD; boredom, opportunity or a passing thought points to ADHD.",
      "Duration overlaps: ADHD emotional reactions settle within hours (Kooij 2019), while borderline dysphoria typically lasts hours but can last several days (ICD-11). The trigger and content of the emotion discriminate better than the clock.",
      "NICE NG87 1.2.2 warns that women with ADHD may receive an incorrect diagnosis of another mental health condition, and CR235 names BPD as one to check. Look for the school-age history before accepting a BPD label as the whole story.",
      "'Rejection sensitive dysphoria' is not a DSM-5-TR or ICD-11 construct, and ICD-11 lists rejection hypersensitivity as a feature of borderline pattern. Explore it, but do not count it as evidence for ADHD.",
      "Screens mislead in both directions: MSI-BPD items on impulsivity, anger and mood overlap with ADHD. Give more weight to the identity, emptiness, abandonment and self-harm items.",
      "Trauma can underlie both, and complex PTSD is a key third option: ask about trauma with care and screen with the ITQ.",
      "In female offenders, BPD often masks ADHD (Young 2018 UKAP consensus): look for inattention as well as the externalising behaviour."
    ],
    refs: [
      "DSM-5-TR (APA 2022): ADHD differential diagnosis; borderline personality disorder (paraphrased)",
      "ICD-11 CDDR (WHO 2024): 6D10 general requirements; 6D11.5 Borderline pattern; 6A05 boundary with personality disorder",
      "NICE CG78 Borderline personality disorder (2009): 1.1.1.1, 1.3.1.2, 1.3.4.5 (DBT), 1.3.5.1, 1.3.6.1-1.3.6.3",
      "NICE NG87 Attention deficit hyperactivity disorder (2018, updated 2025): 1.2.2",
      "NICE NG225 Self-harm (2022): 1.6.1-1.6.3",
      "CADDRA Canadian ADHD Practice Guidelines 4.1 (2020): borderline personality disorder section and Table 2.5",
      "Kooij JJS et al. Updated European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34 (4.1.4, 6.3, 7.2)",
      "RCPsych CR235 (2023): 9.7.1 and section 10",
      "Asherson P et al. ADHD in relation to bipolar disorder or borderline personality disorder in adults. Curr Med Res Opin 2014;30:1657-72",
      "Ditrich I, Philipsen A, Matthies S. BPD and ADHD revisited. Borderline Personal Disord Emot Dysregul 2021;8:22",
      "Zanarini MC et al. MSI-BPD. J Pers Disord 2003;17:568-73",
      "Solberg BS et al. Psychiatric comorbidity in 40,000 adults with ADHD (Norwegian registers). Biol Psychiatry 2018",
      "Young S et al. Offenders with ADHD: expert consensus. BMC Psychiatry 2018;18:281",
      "Methylphenidate (Concerta XL) SmPC section 4.3"
    ]
  },

  /* ------------------------------------------------------------------ Antisocial personality disorder */
  {
    id: "aspd",
    name: "Antisocial personality disorder (dissocial personality disorder), including a history of conduct disorder",
    group: "personality",
    core: false,
    icd11: "6D10 Personality disorder with 6D11.2 Dissociality (often with 6D11.3 Disinhibition); childhood history coded as 6C91 Conduct-dissocial disorder. ICD-11 has no separate antisocial category.",
    summary: "A pervasive pattern, present since age 15, of disregard for and violation of the rights of others, with conduct disorder before 15. Impulsive rule-breaking, lying, failure to plan, irritability and unstable work and money overlap with ADHD. The discriminators are planned, instrumental behaviour for gain, deceit for profit or pleasure, aggression used to control others and lack of remorse.",
    prevalence: "In the WHO World Mental Health surveys, ODD or adult antisocial behaviour was present in 8.3% of adults with ADHD, with an odds ratio of 15.0, the highest of any disorder (Fayyad 2017). CADDRA 4.1 places conduct disorder or ASPD at 11-30% in adult ADHD. About 26% of adult prisoners meet criteria for ADHD (meta-analysis of 42 studies cited in Kooij 2019; Young 2018). Many people with ASPD have an ADHD history, but most people with ADHD do not develop ASPD (CADDRA 4.1).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed when criteria for each are met. DSM-5-TR antisocial personality disorder needs age 18 or over and evidence of conduct disorder before 15, and is not diagnosed when the behaviour occurs only during schizophrenia or bipolar disorder. ICD-11: disruptive behaviour driven by ADHD impulsivity is usually not severe or dissocial and does not justify conduct-dissocial disorder, and people with conduct-dissocial disorder alone typically lack inattention and hyperactivity. ADHD is a treatable risk factor for ASPD (CADDRA 4.1).",
    overlap: [
      "Impulsive rule-breaking and trouble with the law (speeding, fights, minor offences)",
      "Lying to get out of trouble",
      "Failure to plan ahead; walking out of jobs",
      "Irritability, temper and interpersonal conflict",
      "Risk-taking that endangers self or others",
      "Unstable employment and debts",
      "School exclusion, truancy and early substance use",
      "Both are over-represented in prisons and probation caseloads"
    ],
    favoursADHD: [
      "Rule-breaking is impulsive, unplanned and often against the person's own interests",
      "Lying is quick and defensive, to avoid blame, not to exploit others",
      "Fights are a loss of temper, not a way to take control or intimidate",
      "Genuine remorse and distress after harming others",
      "Inattention, forgetfulness and disorganisation even when nothing is gained (missed appointments, lost keys, unpaid bills)",
      "School reports describe a restless, dreamy or disorganised child, not only a defiant one",
      "Offending falls when structure, support or treatment is in place",
      "Fidgeting and restlessness visible in neutral settings such as the waiting room"
    ],
    favoursAlt: [
      "Conduct disorder before 15: cruelty to people or animals, fire-setting, breaking in, weapon use or serious violation of others' rights",
      "Repeated acts that are grounds for arrest, often planned",
      "Deceit for profit or pleasure: aliases, conning, manipulation",
      "Aggression used to dominate others or to get what they want",
      "Lack of remorse: indifferent to, or rationalising, harm to others",
      "Consistent irresponsibility in work and money with no wish to change",
      "Reckless disregard for the safety of others",
      "Entitlement and callousness (ICD-11 dissociality)",
      "No inattention or hyperactivity outside conflict, intoxication or situations of gain",
      "A history of selling, swapping or misusing prescribed controlled drugs"
    ],
    ask: [
      "Before you were 15, did you get into fights, bully others, steal, break into places, set fires, hurt animals or run away from home?",
      "Have you been in trouble with the police? What sort of things, and how old were you the first time?",
      "When you broke rules or the law, was it on the spur of the moment, or did you plan it?",
      "What did you get out of it: money, excitement, status, or did it just happen?",
      "After you have hurt or let someone down, how did you feel, and what did you do about it?",
      "Have you ever used other names, or talked people into giving you money or things?",
      "In fights, were you losing your temper, or using force to make people do what you wanted?",
      "Apart from getting into trouble, were you a distractible, fidgety or dreamy child? What did teachers say about your concentration?",
      "Do you lose things, forget appointments or leave tasks unfinished even when it costs you and there is nothing to gain?",
      "When you have had structure, for example a steady job, a good relationship or education in custody, how was your concentration?",
      "How do you feel about rules in general?",
      "Have you ever sold, swapped or given away prescribed medication, or taken someone else's?",
      "What do you hope an ADHD diagnosis or treatment would change for you?",
      "Have you had a head injury, for example in fights or accidents? Were you knocked out?",
      "(Informant) Did their trouble mostly come from not thinking before acting, or from deliberately taking advantage of people?",
      "(Informant) When they hurt someone, did they seem genuinely sorry?"
    ],
    features: [
      { id: "aspd_cd", t: "Conduct disorder before age 15 (aggression, destruction, theft, serious rule-breaking)", w: 3 },
      { id: "aspd_planned", t: "Offending or rule-breaking mostly planned and instrumental", w: 3 },
      { id: "aspd_remorse", t: "Lack of remorse, or rationalising harm to others", w: 3 },
      { id: "aspd_noia", t: "No inattention or hyperactivity outside conflict, gain or intoxication", w: 3 },
      { id: "aspd_deceit", t: "Deceit for profit or pleasure (aliases, conning, manipulation)", w: 2 },
      { id: "aspd_control", t: "Aggression used to dominate or obtain goals", w: 2 },
      { id: "aspd_records", t: "Records or informants describe childhood defiance and aggression but not inattention or restlessness", w: 2 },
      { id: "aspd_divert", t: "History of selling, swapping or misusing prescribed medicines", w: 2 },
      { id: "aspd_irresp", t: "Persistent irresponsibility in work and money with no wish to change", w: 1 },
      { id: "aspd_reckless", t: "Reckless disregard for the safety of others", w: 1 },
      { id: "aspd_focus", t: "The referral is focused on obtaining stimulants rather than on help with daily functioning", w: 1 }
    ],
    screen: ["aceq"],
    investigations: [
      "School reports and records of exclusions, youth offending or social care: early reports often separate inattention from defiance.",
      "Criminal justice and probation records (with consent). NICE CG77 1.3.2.1 advises adding information from written records or family and carers, with consent, because the person may not always be a reliable source.",
      "Structured assessment in secondary and forensic services (NICE CG77 1.3.1.2); in forensic services PCL-R or PCL-SV for severity and HCR-20 for violence risk.",
      "Urine or oral-fluid drug screen with consent when substance use is likely: part of the assessment, never the sole basis (NICE CG51 1.2.2.3).",
      "Symptom and performance validity testing when there is a clear incentive (see the validity step).",
      "Ask about head injury and learning difficulties: acquired brain injury and the criminal justice system are both higher-prevalence groups for ADHD (NICE NG87 1.2.1).",
      "Referral: forensic mental health or specialist personality disorder service; liaison and diversion services for people in contact with police or courts."
    ],
    redFlags: [
      "Threats or violence towards others, weapons or a named potential victim: assess and manage risk now; high-risk cases go to multi-agency public protection arrangements (NICE CG77 1.3.3.1).",
      "Domestic abuse (perpetrated or experienced) or child safeguarding concerns.",
      "Selling or diverting controlled drugs.",
      "Co-occurring substance dependence, especially stimulants.",
      "Recent head injury from violence.",
      "Suicide risk: ask directly, particularly around arrest, early custody and release."
    ],
    decide: {
      better: "ASPD, or a conduct-disorder history alone, better explains the picture when antisocial behaviour is planned and instrumental, remorse is absent, and there is no inattention or hyperactivity outside conflict, intoxication or gain, with no childhood evidence of ADHD beyond defiance.",
      both: "Diagnose both when corroborated childhood-onset inattention and/or hyperactivity persists in neutral settings and causes impairment independent of offending, alongside the full ASPD pattern. This combination is common in forensic samples.",
      next: "Gather records and collateral before deciding. Assess risk to others and the risk of diversion. If ADHD is diagnosed, NICE NG87 1.7.4 requires a risk assessment for substance misuse and diversion before medication, and NG87 1.7.24 advises against immediate-release or easily injected or snorted modified-release stimulants when that risk exists. Offer treatment for comorbid conditions whether or not the ASPD is being treated (NICE CG77 1.4.1.1); group cognitive and behavioural programmes address impulsivity, interpersonal difficulties and antisocial behaviour (CG77 1.4.2.1) and offending (CG77 1.4.2.2). Medicines are not used routinely for ASPD or its aggression, anger and impulsivity (CG77 1.4.3.1), so any ADHD medicine must be justified by the ADHD itself, with a plan for poor adherence and misuse of prescribed medicines (CG77 1.4.1.2)."
    },
    pearls: [
      "Ask what the behaviour was for. 'I didn't think' is ADHD-like; 'I needed the money' or 'they had it coming' is not.",
      "Remorse is one of the most useful discriminators (CADDRA 4.1 Table 2.4): ask how they felt afterwards and what they did about it.",
      "Do not let an offending history block an ADHD assessment. NICE NG87 1.2.1 lists the criminal justice system as a higher-prevalence group, and treating ADHD may make structured ASPD interventions more workable (CADDRA 4.1).",
      "ASPD requires conduct disorder before 15, so childhood records serve both diagnoses: look for inattention and restlessness separate from defiance.",
      "Offenders with ADHD often recall childhood poorly and minimise impairment (Young 2018). Expect gaps and seek records rather than assuming absence.",
      "In male offenders, conduct disorder and ASPD can mask ADHD (Young 2018). Do not focus only on externalising behaviour: ask about inattention too.",
      "When a stimulant prescription is the main goal, use the validity step and consider non-stimulant options first."
    ],
    refs: [
      "DSM-5-TR (APA 2022): antisocial personality disorder; ADHD differential diagnosis (paraphrased)",
      "ICD-11 CDDR (WHO 2024): 6C91 boundary with ADHD; 6D11.2 Dissociality; 6A05 boundary with conduct-dissocial disorder",
      "NICE CG77 Antisocial personality disorder (2009): 1.3.1.1, 1.3.1.2, 1.3.2.1, 1.3.3.1, 1.4.1.1, 1.4.1.2, 1.4.2.1, 1.4.2.2, 1.4.3.1",
      "NICE NG87 (2018, updated 2025): 1.2.1, 1.7.4, 1.7.23-1.7.24",
      "NICE CG51 Drug misuse: psychosocial interventions (2007): 1.2.2.3",
      "CADDRA 4.1 (2020): antisocial personality disorder section and Table 2.4",
      "Fayyad J et al. The descriptive epidemiology of DSM-IV adult ADHD in the WHO World Mental Health Surveys. Atten Defic Hyperact Disord 2017;9:47-65",
      "Young S et al. Identification and treatment of offenders with ADHD in the prison population: expert consensus. BMC Psychiatry 2018;18:281",
      "Kooij JJS et al. European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34"
    ]
  },

  /* ------------------------------------------------------------------ Cannabis */
  {
    id: "sud_cannabis",
    name: "Cannabis use disorder, intoxication and withdrawal (including residual cognitive effects)",
    group: "substance",
    core: true,
    icd11: "6C41 Disorders due to use of cannabis: 6C41.1 harmful pattern of use, 6C41.2 cannabis dependence, 6C41.3 cannabis intoxication, 6C41.4 cannabis withdrawal",
    summary: "Regular cannabis use impairs attention, working memory and drive during intoxication, and withdrawal brings irritability, restlessness, anxiety and poor sleep, all of which can be mistaken for ADHD. Cannabis is also the substance most often misused by adults with ADHD, frequently to calm restlessness or to get to sleep. The key tests are which came first, and whether the symptoms persist during drug-free periods.",
    prevalence: "Cannabis is the substance most commonly misused by people with ADHD (CADDRA 4.1). Any substance use disorder in 15.2% of adults with ADHD over 12 months (NCS-R, Kessler 2006); substance use disorder in 16.2% of women and 27.5% of men with ADHD in Norwegian registers (Solberg 2018); substance misuse in 29% of one UK adult ADHD clinic sample (Newman 2026, not peer reviewed). Reverse direction: ADHD in 23.1% of adults in SUD treatment (meta-analysis of 29 studies, van Emmerik-van Oortmerssen 2012). ADHD began first in the large majority of people with both (Fayyad 2017).",
    coexist: "yes",
    coexistNote: "Commonly co-occur, and both should be diagnosed when each is met. ADHD is not diagnosed when the symptoms are better explained by intoxication or withdrawal (DSM-5-TR criterion E) or are due to the effects of a substance (ICD-11 6A05). ICD-11 names two key tests: the order of onset, and persistence when not intoxicated. Crunelle 2018 advises starting the diagnostic process once there is no serious intoxication or withdrawal, focusing on drug-free periods, and verifying the diagnosis during SUD treatment.",
    overlap: [
      "Poor concentration, forgetfulness and slowed thinking",
      "Low motivation, procrastination and unfinished tasks",
      "Restlessness, irritability and short temper, especially in withdrawal",
      "Difficulty getting to sleep, or needing cannabis to sleep",
      "Underachievement at school, college or work",
      "Impulsive decisions and risk-taking",
      "Mood swings and anxiety",
      "Lateness, missed appointments and a disorganised daily routine"
    ],
    favoursADHD: [
      "ADHD features documented in school reports before first use, ideally before age 12",
      "Symptoms persist through periods of a month or more without cannabis",
      "Cannabis started as a way to calm restlessness, quieten a busy mind or get to sleep",
      "A childhood informant describes the same pattern long before any substance use",
      "Impairment across settings on drug-free days (losing things, missing deadlines, zoning out)",
      "Family history of ADHD",
      "Early first use with fast escalation to problem use, a common pattern in ADHD (Crunelle 2018)"
    ],
    favoursAlt: [
      "Attention problems began after regular use started, usually in adolescence or later",
      "Symptoms rise and fall with use, intoxication and withdrawal",
      "Clear improvement after several weeks of abstinence",
      "No childhood history from records or informants",
      "Withdrawal after stopping heavy use: irritability, anxiety, restlessness, poor sleep and low appetite, starting 12 hours to 3 days after the last use and peaking at 4-7 days (ICD-11)",
      "Daily or near-daily use, or high-potency products",
      "Memory gaps mainly for events while intoxicated",
      "Apathy and low drive rather than distractibility",
      "Paranoia or perceptual changes with use",
      "Dependence: impaired control, use taking precedence over other activities, tolerance or withdrawal"
    ],
    ask: [
      "How old were you when you first tried cannabis, and when did you start using it regularly? What were you like at school before then?",
      "How much do you use now, how often, and what kind (for example skunk, resin, edibles or vapes)? When did you last use?",
      "What does cannabis do for you: calm you down, quieten your thoughts, help you sleep, help you focus, or get you high?",
      "Have you had a month or more without cannabis since you started? How were your concentration, restlessness and organisation then?",
      "When you stop for a few days, what happens: irritability, anxiety, poor sleep, vivid dreams, low appetite or sweats?",
      "Are the concentration problems worse on the days you use or the day after?",
      "Do you lose things, miss deadlines or zone out even on days when you have not used at all?",
      "Do you find it hard to cut down, or has cannabis taken priority over things you used to enjoy or need to do?",
      "Have you ever felt paranoid, or heard or seen things, when using?",
      "Do you use anything else alongside it: alcohol, tobacco, other drugs, or someone else's ADHD medication?",
      "Do you mostly use in the evening to switch off, or through the day?",
      "If you have been in treatment or recovery, did your focus improve as you stayed off it?",
      "Has anyone in your family had ADHD, or problems with drugs or alcohol?",
      "What are you hoping ADHD treatment would do for you?",
      "(Informant) Before they started using cannabis, were they restless, impulsive or disorganised?",
      "(Informant) Have you seen them through drug-free stretches? What were they like then?"
    ],
    features: [
      { id: "sud_cannabis_after", t: "Attention problems began after regular cannabis use started", w: 3 },
      { id: "sud_cannabis_abst", t: "Symptoms clearly improve after several weeks of abstinence", w: 3 },
      { id: "sud_cannabis_nochild", t: "No childhood ADHD evidence from records or informants", w: 3 },
      { id: "sud_cannabis_track", t: "Symptoms rise and fall with use, intoxication and withdrawal", w: 2 },
      { id: "sud_cannabis_heavy", t: "Daily or near-daily use, or high-potency products", w: 2 },
      { id: "sud_cannabis_wd", t: "Withdrawal syndrome on stopping (irritability, anxiety, restlessness, poor sleep, low appetite)", w: 2 },
      { id: "sud_cannabis_intox", t: "Symptom ratings made while intoxicated or in the first week of withdrawal", w: 2 },
      { id: "sud_cannabis_dep", t: "Dependence features: impaired control, use takes priority, tolerance", w: 1 },
      { id: "sud_cannabis_amotiv", t: "Apathy and low drive rather than distractibility", w: 1 },
      { id: "sud_cannabis_psych", t: "Paranoid or perceptual symptoms linked to use", w: 1 },
      { id: "sud_cannabis_screen", t: "DAST-10 3 or more, or ASSIST cannabis score in the moderate or high range", w: 1 }
    ],
    screen: ["dast10", "assist", "cageaid"],
    investigations: [
      "Urine or oral-fluid drug screen with consent, as part of the assessment and never the sole basis (NICE CG51 1.2.2.3). Cannabis metabolites can remain detectable for days to weeks after heavy regular use, so a positive test does not prove current intoxication.",
      "A dated timeline of use against ADHD symptoms, including any abstinent periods (custody, hospital, pregnancy, treatment, travel).",
      "School reports from before first use, and an informant who knew the person then.",
      "Re-rate symptoms after a period of reduced use or abstinence when feasible, and verify the diagnosis as SUD treatment progresses (Crunelle 2018).",
      "Mental state examination for psychotic symptoms; refer to early intervention in psychosis if they are present.",
      "Referral: local NHS-commissioned drug and alcohol service. Concurrent treatment of ADHD and SUD is usually best (CADDRA 4.1; Crunelle 2018)."
    ],
    redFlags: [
      "Psychotic symptoms with use, or a family history of psychosis.",
      "Assessment attempted while the person is intoxicated or in significant withdrawal: rebook.",
      "Use of synthetic cannabinoids ('spice'), with unpredictable potency and toxicity.",
      "Driving after use, or use in safety-critical work. Persistent drug misuse or dependence must be notified to the DVLA by the driver: advise and record it.",
      "Debts, dealing or exploitation linked to supply: consider safeguarding.",
      "Heavy use of several substances combined with a request for stimulants."
    ],
    decide: {
      better: "Cannabis effects better explain the picture when attention and restlessness problems began after regular use, track use and withdrawal, and resolve during sustained abstinence, and there is no childhood evidence of ADHD.",
      both: "Diagnose both when ADHD symptoms are documented before first use (school reports, childhood informant) and persist through drug-free periods. This is the usual pattern: ADHD began first in most people with both conditions (Fayyad 2017).",
      next: "Do not put the whole assessment on hold for abstinence. Start when the person is not intoxicated or in serious withdrawal, focus on drug-free periods and childhood evidence, and verify the diagnosis as SUD treatment progresses (Crunelle 2018). CADDRA 4.1 notes that specialist input may be needed before diagnosing ADHD during active illicit drug use. Offer referral to drug services and treat both, usually concurrently. Before ADHD medication, assess the risk of misuse and diversion (NICE NG87 1.7.4)."
    },
    pearls: [
      "Many patients say cannabis helps them focus. CADDRA 4.1 notes there is no evidence that cannabis treats ADHD, and evidence that it impairs cognition and motivation.",
      "Ask why they use, not only how much. Using to sleep or to quieten a racing mind is a common ADHD story; it does not prove ADHD, but it makes the timeline question essential.",
      "Withdrawal can mimic ADHD: it peaks at 4-7 days and may last 1-3 weeks after stopping heavy use (ICD-11). Avoid rating current ADHD symptoms until withdrawal has settled, and lean on childhood evidence and longer drug-free periods.",
      "In a meta-analysis of young frequent users, small residual cognitive effects were no longer significant in studies requiring more than 72 hours of abstinence (Scott 2018). Marked deficits weeks after stopping need another explanation, including ADHD.",
      "Teenage-onset heavy use with no childhood history is the classic over-diagnosis; childhood-onset ADHD with early, fast-escalating use is the classic missed diagnosis.",
      "Tobacco is often mixed with cannabis, and nicotine withdrawal also causes poor concentration, irritability and restlessness.",
      "On the DAST-10, explain that prescribed medicines taken as directed do not count, but cannabis does."
    ],
    refs: [
      "DSM-5-TR (APA 2022): ADHD criterion E; cannabis use disorder and cannabis withdrawal (paraphrased)",
      "ICD-11 CDDR (WHO 2024): 6C41; Table 6.16 cannabis withdrawal; 6A05 boundary with substance use",
      "Crunelle CL et al. International consensus statement on screening, diagnosis and treatment of SUD patients with comorbid ADHD. Eur Addict Res 2018;24:43-51",
      "CADDRA 4.1 (2020): substance use disorder section",
      "NICE NG87 (2018, updated 2025): 1.2.1, 1.7.4",
      "NICE CG51 Drug misuse: psychosocial interventions (2007): 1.2.2.3",
      "Kessler RC et al. Prevalence and correlates of adult ADHD (NCS-R). Am J Psychiatry 2006;163:716-23",
      "van Emmerik-van Oortmerssen K et al. Prevalence of ADHD in SUD patients: a meta-analysis. Drug Alcohol Depend 2012;122:11-19",
      "Fayyad J et al. 2017 (WHO World Mental Health surveys)",
      "Scott JC et al. Cannabis use and cognitive functioning in adolescents and young adults: meta-analysis. JAMA Psychiatry 2018;75:585-95"
    ]
  },

  /* ------------------------------------------------------------------ Alcohol */
  {
    id: "sud_alcohol",
    name: "Alcohol use disorder (harmful use and dependence), intoxication, withdrawal and alcohol-related cognitive impairment",
    group: "substance",
    core: true,
    icd11: "6C40 Disorders due to use of alcohol: 6C40.1 harmful pattern of use, 6C40.2 alcohol dependence, 6C40.3 alcohol intoxication, 6C40.4 alcohol withdrawal",
    summary: "Heavy drinking, hangovers and withdrawal impair attention, memory and planning and cause restlessness, irritability and poor sleep, and long-term heavy use can cause lasting cognitive impairment. Adults with ADHD often drink to switch off or to sleep, and binge drinking is common. Separate the two by the timeline, by functioning during sober periods and by childhood evidence.",
    prevalence: "Any substance use disorder in 15.2% of adults with ADHD over 12 months (NCS-R, Kessler 2006) and 11.4% across the WHO World Mental Health surveys, where ADHD began first in the large majority of comorbid cases (Fayyad 2017). ADHD in 23.1% of adults in SUD treatment (van Emmerik-van Oortmerssen 2012). Alcohol-specific rates in UK adult ADHD clinics are not well established.",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. ADHD is not diagnosed when the symptoms are better explained by intoxication or withdrawal (DSM-5-TR criterion E) or are due to a substance (ICD-11 6A05); the tests are the order of onset and persistence when sober. NICE CG115 1.2.2.8 uses 3 to 4 weeks of abstinence as the point at which comorbid mental health problems that have not improved need specific treatment. The same window is a sensible time to re-rate ADHD symptoms in a heavy drinker (clinical practice).",
    overlap: [
      "Poor concentration, forgetfulness and missed commitments",
      "Irritability, temper and relationship conflict",
      "Restlessness and anxiety, especially the morning after or in withdrawal",
      "Poor sleep and early waking",
      "Impulsive decisions, risky behaviour and spending when drinking",
      "Lateness, absence and underperformance at work",
      "Low mood and low self-esteem",
      "Driving offences and accidents"
    ],
    favoursADHD: [
      "School reports from before drinking began describe inattention or restlessness",
      "Problems persist through sober periods, including weeks or months of abstinence",
      "Alcohol is used to calm restlessness, quieten a busy mind or get to sleep",
      "A childhood informant confirms the same pattern before adolescence",
      "Impairment on days with no alcohol in the system",
      "Family history of ADHD",
      "Early first drinking with fast escalation (Crunelle 2018)"
    ],
    favoursAlt: [
      "Attention and memory problems began after heavy drinking became established",
      "Symptoms are worst the morning after drinking and ease as the day goes on or after a drink",
      "Withdrawal features: tremor, sweating, nausea, anxiety, insomnia and distractibility, starting 6-12 hours after the last drink and usually lasting 3-7 days (ICD-11)",
      "Clear improvement after 3-4 weeks of abstinence",
      "Blackouts and memory gaps for drinking episodes",
      "Dependence: impaired control, drinking taking precedence, tolerance, withdrawal or relief drinking",
      "Physical signs of long-term heavy use: raised GGT or MCV, liver disease, neuropathy, unsteady gait",
      "Persisting memory and executive problems in a long-term heavy drinker (alcohol-related brain damage)",
      "No childhood history from records or informants",
      "AUDIT 16 or more (higher risk) or 20 or more (possible dependence)"
    ],
    ask: [
      "How old were you when you started drinking regularly? What were you like at school before then?",
      "In a typical week, on how many days do you drink, and how much? What is the most you have in one day?",
      "What does alcohol do for you: help you relax, switch off your mind, sleep, or feel confident with people?",
      "Have you had weeks or months without drinking? How were your concentration, restlessness and organisation then?",
      "Do you ever need a drink in the morning to steady yourself, or get shaky, sweaty or anxious when you go without?",
      "Are your concentration problems worse the day after drinking?",
      "Do you lose things, forget appointments or struggle to finish tasks even in a week when you have not drunk?",
      "Have you had blackouts, or woken up unable to remember the night before?",
      "Have you ever had a fit, seen or heard things, or become confused when you stopped drinking?",
      "Have you tried to cut down? What happened?",
      "Do you drink more when you are bored, restless or can't sleep, or when you are low or anxious?",
      "Do you use cannabis, cocaine or other drugs when you drink?",
      "Has drinking caused problems at work, with driving, with the police or with your family?",
      "Has anyone in your family had ADHD, or problems with alcohol?",
      "(Informant) Before they started drinking heavily, were they restless, impulsive or disorganised?",
      "(Informant) What are they like in a week when they are not drinking?"
    ],
    features: [
      { id: "sud_alcohol_after", t: "Attention and memory problems began after heavy drinking became established", w: 3 },
      { id: "sud_alcohol_abst", t: "Symptoms resolve or clearly improve after 3-4 weeks of abstinence", w: 3 },
      { id: "sud_alcohol_nochild", t: "No childhood ADHD evidence from records or informants", w: 3 },
      { id: "sud_alcohol_morning", t: "Symptoms worst the morning after drinking or relieved by a drink", w: 2 },
      { id: "sud_alcohol_wd", t: "Withdrawal features (tremor, sweating, anxiety, insomnia) or relief drinking", w: 2 },
      { id: "sud_alcohol_dep", t: "Dependence: impaired control, drinking takes precedence, tolerance", w: 2 },
      { id: "sud_alcohol_arbd", t: "Persisting memory or executive deficits after long-term heavy use", w: 2 },
      { id: "sud_alcohol_intox", t: "Symptom ratings made while intoxicated or in withdrawal", w: 2 },
      { id: "sud_alcohol_blackout", t: "Repeated blackouts or memory gaps for drinking episodes", w: 1 },
      { id: "sud_alcohol_bloods", t: "Raised GGT or MCV, or other physical signs of heavy drinking", w: 1 },
      { id: "sud_alcohol_audit", t: "AUDIT 16 or more (higher risk) or 20 or more (possible dependence)", w: 1 }
    ],
    screen: ["auditc", "audit", "assist", "cageaid"],
    investigations: [
      "AUDIT-C, then the full AUDIT if the score is 5 or more (UK OHID forms). The AUDIT is the NICE-named tool for identification and outcome monitoring (NICE CG115 1.2.1.4).",
      "Severity of dependence (SADQ or LDQ) and of withdrawal (CIWA-Ar) in specialist settings (NICE CG115 1.2.1.4).",
      "LFTs including GGT and an FBC (MCV) to identify physical health needs. NICE CG115 1.2.2.10 advises against using blood tests routinely to identify or diagnose alcohol use disorders.",
      "Brief cognitive screen (for example MoCA, by trained staff) when memory complaints accompany long-term heavy drinking. Formal neuropsychological testing is usually done only if impairment persists after a period of abstinence or a large reduction in drinking (NICE CG115 1.2.2.11).",
      "If the person arrives intoxicated, rebook rather than assess (clinical practice).",
      "Referral: local alcohol service. Consider assisted withdrawal for people who drink over 15 units a day and/or score 20 or more on the AUDIT (NICE CG115 1.3.4.1)."
    ],
    redFlags: [
      "History of withdrawal seizures, delirium tremens or withdrawal hallucinations: do not advise stopping suddenly without medical support.",
      "Confusion, unsteadiness or abnormal eye movements in a heavy drinker: suspect Wernicke's encephalopathy and treat as an emergency with thiamine (NICE CG100).",
      "Drink-driving or drinking in safety-critical work. Persistent alcohol misuse or dependence must be notified to the DVLA by the driver: advise and record it.",
      "Suicidal thoughts, particularly when drinking.",
      "Domestic abuse or child safeguarding concerns.",
      "Planned disulfiram with methylphenidate: dose-related psychotic episodes have been described with this combination (Crunelle 2018)."
    ],
    decide: {
      better: "Alcohol effects better explain the picture when attention, memory and restlessness problems began after heavy drinking, follow the drinking cycle (worse after drinking or in withdrawal) and resolve after 3-4 weeks of abstinence, with no childhood evidence of ADHD.",
      both: "Diagnose both when ADHD features are documented before drinking began and persist through sober periods. Treat both, usually concurrently, stabilising severe alcohol dependence first (Kooij 2019 7.2; CADDRA 4.1).",
      next: "Assess when the person is sober and not in withdrawal, and take a careful history of sober periods and childhood. If dependence is significant, refer for treatment and re-rate ADHD symptoms after about 3-4 weeks of abstinence. Before ADHD medication, complete the NICE NG87 1.7.4 baseline, including the risk of substance misuse and diversion."
    },
    pearls: [
      "Ask about sober periods. Weeks without alcohol (pregnancy, illness, custody, treatment, a dry month) are the best natural experiment.",
      "Ask what alcohol does for them before asking how much. Drinking to sleep or to quieten a busy mind is common in ADHD.",
      "The AUDIT items on memory loss and failing to do what was expected can be driven by ADHD forgetfulness: ask whether these happen only when drinking.",
      "Morning anxiety, shakiness and poor concentration in a heavy drinker may be withdrawal, not ADHD or depression.",
      "Long-term heavy drinking can cause alcohol-related brain damage with executive and memory deficits. It is acquired, so there is no childhood history.",
      "Anxiety and insomnia can recur for months after stopping drinking, especially around drinking cues (ICD-11). Persisting poor sleep or anxiety in early recovery does not by itself point to ADHD.",
      "Alcohol often travels with cannabis, cocaine and gambling: screen for all of them.",
      "Clinic-wide, ask every adult about alcohol: NICE NG87 1.2.1 lists people with a history of substance misuse as a higher-prevalence group for ADHD, and the reverse holds too."
    ],
    refs: [
      "DSM-5-TR (APA 2022): ADHD criterion E; alcohol use disorder and alcohol withdrawal (paraphrased)",
      "ICD-11 CDDR (WHO 2024): 6C40; substance dependence requirements; Table 6.16 alcohol withdrawal",
      "NICE CG115 Alcohol-use disorders (2011): 1.2.1.4, 1.2.2.7, 1.2.2.8, 1.2.2.10, 1.2.2.11, 1.3.4.1",
      "NICE CG100 Alcohol-use disorders: diagnosis and management of physical complications",
      "NICE NG87 (2018, updated 2025): 1.2.1, 1.7.4",
      "Crunelle CL et al. Eur Addict Res 2018;24:43-51",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34 (7.2)",
      "CADDRA 4.1 (2020): substance use disorder section",
      "Babor TF et al. AUDIT manual, 2nd edition. WHO 2001; UK OHID AUDIT and AUDIT-C forms",
      "Kessler RC et al. Am J Psychiatry 2006;163:716-23; Fayyad J et al. 2017",
      "van Emmerik-van Oortmerssen K et al. Drug Alcohol Depend 2012;122:11-19"
    ]
  },

  /* ------------------------------------------------------------------ Stimulants */
  {
    id: "sud_stim",
    name: "Stimulant use disorder and stimulant effects (cocaine, amphetamines, methamphetamine, cathinones, non-prescribed ADHD medication)",
    group: "substance",
    core: false,
    icd11: "6C45 Disorders due to use of cocaine; 6C46 Disorders due to use of stimulants including amfetamines, methamfetamine or methcathinone; 6C47 Disorders due to use of synthetic cathinones (withdrawal 6C45.4, 6C46.4)",
    summary: "Stimulant intoxication causes overactivity, talkativeness and impulsivity, and the crash that follows brings exhaustion, low mood, poor concentration and irritability that can last weeks. Some adults with undiagnosed ADHD use cocaine or non-prescribed stimulants and feel calmer and more focused, while others seek a diagnosis to obtain stimulants. Decide on the timeline, drug-free functioning and childhood evidence, never on the response to a stimulant.",
    prevalence: "Drug dependence in 4.4% of adults with ADHD over 12 months (odds ratio 7.9; NCS-R, Kessler 2006). People with ADHD are at higher risk of using nicotine, cocaine and cannabis, and start earlier (CADDRA 4.1). Lifetime non-prescribed stimulant use among students ranges from 5% to 43% (CADDRA 4.1). ADHD in 23.1% of adults in SUD treatment (van Emmerik-van Oortmerssen 2012). People with ADHD and SUD or conduct disorder are at highest risk of misusing and diverting prescribed stimulants (CADDRA 4.1).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. ADHD is not diagnosed when the symptoms are better explained by intoxication or withdrawal (DSM-5-TR criterion E; ICD-11 6A05). DSM-5-TR does not count tolerance or withdrawal towards stimulant use disorder when a stimulant is taken as prescribed under medical supervision. Prescribed ADHD medication taken as directed is not misuse; extra doses, snorting or injecting, or using someone else's supply is.",
    overlap: [
      "Overactivity, talkativeness and impulsivity (intoxication)",
      "Poor concentration, fatigue and low motivation (crash and withdrawal)",
      "Irritability, anger and relationship conflict",
      "Disturbed sleep and an erratic daily routine",
      "Risk-taking, spending and debt",
      "Erratic work performance",
      "Reports that stimulants calm them and help them focus",
      "Anxiety and restlessness"
    ],
    favoursADHD: [
      "School reports from before first use describe inattention or hyperactivity",
      "Symptoms persist through drug-free periods of weeks or months",
      "A childhood informant describes the same pattern well before adolescence",
      "Non-prescribed stimulants used mainly to function (work, study, daily tasks) rather than to party",
      "Family history of ADHD",
      "Early first use with fast escalation to problem use (Crunelle 2018)",
      "Impairment across settings unrelated to drug cycles"
    ],
    favoursAlt: [
      "Concentration and motivation problems began after regular stimulant use started",
      "Problems cluster in the days after use: exhaustion, oversleeping, low mood, irritability and craving",
      "Withdrawal course (ICD-11): after cocaine it starts within 6-24 hours and lasts up to about 7 days, with craving late; after amfetamines it starts 24 hours to 4 days after stopping, with low mood, lethargy and oversleeping for 7-14 days, then irritability and craving that can persist for 6-8 weeks",
      "Overactivity and talkativeness only when intoxicated",
      "Paranoia, suspiciousness or hallucinations with use",
      "Binge pattern over days, used to get high",
      "Dependence: impaired control, priority over other activities, tolerance, craving",
      "No childhood history from records or informants",
      "The request is fixed on a particular stimulant, dose or immediate-release formulation",
      "Drug screen positive for cocaine or for amphetamines that were not prescribed"
    ],
    ask: [
      "Have you used cocaine, amphetamine (speed), methamphetamine, mephedrone or other stimulants? When did you first use, and how often now?",
      "Have you taken ADHD medication that was not prescribed for you, or more of your own than prescribed? Where did you get it, and how did you take it?",
      "What did the stimulant feel like: a high and a buzz, or calmer and more focused? What were you using it for?",
      "What happens in the days after you use: tired, sleeping a lot, low, irritable, craving more?",
      "Have you had drug-free periods of a few weeks or more? How were your concentration, restlessness and organisation then?",
      "What were you like at primary school, before any drugs?",
      "Have you ever felt paranoid or very suspicious, or heard or seen things, after using?",
      "Do you use alcohol or cannabis to come down?",
      "Have you had chest pain, palpitations, fainting or a fit when using?",
      "Have you ever injected or snorted drugs?",
      "Has stimulant use caused money problems, debts or trouble with the law?",
      "Have you ever sold, swapped or given away medicines?",
      "Which medicine are you hoping for, and why that one?",
      "If you were prescribed ADHD medication, how would you keep it safe from other people?",
      "Has anyone in your family had ADHD, or problems with drugs?",
      "(Informant) Were they restless or disorganised before they ever used drugs?",
      "(Informant) What are they like between binges?"
    ],
    features: [
      { id: "sud_stim_after", t: "Concentration and motivation problems began after regular stimulant use", w: 3 },
      { id: "sud_stim_nochild", t: "No childhood ADHD evidence from records or informants", w: 3 },
      { id: "sud_stim_abst", t: "Symptoms resolve during sustained abstinence (allowing up to 6-8 weeks after heavy amfetamine use)", w: 3 },
      { id: "sud_stim_crash", t: "Problems cluster in the crash: exhaustion, oversleeping, low mood, craving", w: 2 },
      { id: "sud_stim_intox", t: "Overactivity and talkativeness seen only when intoxicated", w: 2 },
      { id: "sud_stim_dep", t: "Dependence features: impaired control, craving, binges over days", w: 2 },
      { id: "sud_stim_route", t: "Snorting or injecting stimulants, including prescribed ones", w: 2 },
      { id: "sud_stim_divert", t: "History of buying, selling or swapping prescription stimulants", w: 2 },
      { id: "sud_stim_psych", t: "Paranoia or hallucinations with use", w: 1 },
      { id: "sud_stim_request", t: "Request fixed on a particular stimulant, dose or immediate-release form", w: 1 },
      { id: "sud_stim_test", t: "Drug screen positive for non-prescribed cocaine or amphetamines", w: 1 }
    ],
    screen: ["dast10", "assist", "cageaid"],
    investigations: [
      "Urine or oral-fluid drug screen with consent, as part of the assessment and not the sole method (NICE CG51 1.2.2.3). Prescribed dexamfetamine and lisdexamfetamine give positive amphetamine results.",
      "Pulse, blood pressure and cardiovascular history; cardiology opinion before ADHD medication if any NICE NG87 1.7.5 feature is present. Cocaine is linked to myocardial infarction and stroke (ICD-11).",
      "Mental state examination for psychotic symptoms.",
      "Prescribing history (for example the Summary Care Record) for previous ADHD prescriptions, early repeat requests or several prescribers (clinical practice).",
      "Symptom and performance validity testing when a stimulant prescription is the main goal (see the validity step).",
      "Referral: drug service, with blood-borne virus testing if injecting. NICE CG51 1.4.1.2 recommends contingency management for people who mainly misuse stimulants."
    ],
    redFlags: [
      "Chest pain, palpitations, fainting or seizures with stimulant use: medical assessment.",
      "Stimulant-induced psychosis or persistent paranoia.",
      "Injecting drug use.",
      "Selling or diverting prescription stimulants.",
      "Suicidal thoughts during the crash or withdrawal.",
      "Cocaine used together with alcohol, which adds cardiovascular risk.",
      "Drug debts, exploitation or county lines involvement: safeguarding."
    ],
    decide: {
      better: "Stimulant effects better explain the picture when the problems began after regular use, follow intoxication and crash cycles, and resolve over a sustained drug-free period (allowing up to 6-8 weeks after heavy amfetamine use), with no childhood evidence of ADHD.",
      both: "Diagnose both when ADHD features are documented before any stimulant use and persist through drug-free periods. Feeling calm or focused on cocaine or amphetamine is not evidence either way.",
      next: "Assess when the person is not intoxicated and is past the acute crash (about a week after cocaine, 1-2 weeks after amfetamines; ICD-11). Seek records and a childhood informant. If ADHD is diagnosed, treating both is recommended (Crunelle 2018), but NICE NG87 1.7.24 advises against immediate-release or easily injected or snorted modified-release stimulants where misuse or diversion is a risk. Long-acting formulations have lower rates of misuse and diversion (Crunelle 2018), and non-stimulants have no abuse potential (CADDRA 4.1). Agree safe storage, limited supplies and monitoring."
    },
    pearls: [
      "A calming response to illicit stimulants is often reported by adults with ADHD (RCPsych CR235 9.3), but stimulants also improve some cognitive measures in people without ADHD. Never use the response to a stimulant as diagnostic evidence.",
      "Ask what non-prescribed stimulants were used for: studying or working suggests self-treatment, partying and bingeing suggests recreational use. Neither settles the diagnosis.",
      "Separate the crash from ADHD. After amfetamines, low mood, fatigue and oversleeping dominate the first 1-2 weeks and irritability and craving can persist for 6-8 weeks; cocaine withdrawal is shorter, up to about a week. Suicidal thoughts can occur when dysphoria is marked (ICD-11).",
      "Tolerance and withdrawal on prescribed ADHD medication taken as directed do not count towards stimulant use disorder (DSM-5-TR).",
      "Interpret amphetamine-positive drug screens alongside the prescription: lisdexamfetamine and dexamfetamine are amphetamines.",
      "Do not withhold ADHD treatment because of past stimulant use: in people with SUD, treating ADHD can reduce ADHD symptoms without worsening the SUD (Crunelle 2018), with careful monitoring for misuse and diversion.",
      "Caffeine and nicotine are stimulants too: heavy energy-drink use worsens sleep and anxiety, and nicotine withdrawal impairs concentration."
    ],
    refs: [
      "DSM-5-TR (APA 2022): stimulant use disorder (note on medically supervised use), stimulant intoxication and withdrawal; ADHD criterion E (paraphrased)",
      "ICD-11 CDDR (WHO 2024): 6C45, 6C46, 6C47; Table 6.16 stimulant withdrawal",
      "NICE NG87 (2018, updated 2025): 1.7.4, 1.7.5, 1.7.23-1.7.24",
      "NICE CG51 Drug misuse: psychosocial interventions (2007): 1.2.2.3, 1.4.1.2",
      "Crunelle CL et al. Eur Addict Res 2018;24:43-51",
      "CADDRA 4.1 (2020): substance use disorder section",
      "RCPsych CR235 (2023): 9.3",
      "Kessler RC et al. Am J Psychiatry 2006;163:716-23",
      "van Emmerik-van Oortmerssen K et al. Drug Alcohol Depend 2012;122:11-19"
    ]
  },

  /* ------------------------------------------------------------------ Gambling */
  {
    id: "gambling",
    name: "Gambling disorder and gambling-related harm",
    group: "substance",
    core: false,
    icd11: "6C50 Gambling disorder (6C50.0 predominantly offline, 6C50.1 predominantly online); QE21 Hazardous gambling or betting",
    summary: "A persistent pattern of impaired control over gambling, increasing priority given to it, and continuation despite harm, usually over at least 12 months. Impulsivity, reward seeking, debt, secrecy about money and relationship damage overlap with ADHD, and the two often co-occur. Gambling disorder is a separate, treatable condition that ADHD does not explain, and it carries a high suicide risk.",
    prevalence: "Reverse direction: in 163 adults with gambling disorder, 25.2% met full DSM-5 criteria for current ADHD and 28.8% had lifetime ADHD (Retz 2016). ADHD symptom severity correlates modestly with gambling severity (pooled r = 0.17; Theule 2019 meta-analysis). Gambling problems are listed among the burdens of adult ADHD (Kooij 2019), and gambling disorder among adult groups with raised ADHD prevalence (Australian guideline 2022). The rate of gambling disorder in UK adult ADHD clinics is not well established.",
    coexist: "yes",
    coexistNote: "Both can be diagnosed when each is met. ICD-11 does not diagnose gambling disorder when the gambling is better explained by a manic or hypomanic episode, or is caused by a medicine or substance (for example dopamine agonists or methamfetamine), and allows co-diagnosis with personality disorder and substance use disorders. ADHD impulsivity may drive the gambling, but gambling disorder still needs its own treatment (CADDRA 4.1; NICE NG248 1.5.7).",
    overlap: [
      "Impulsive decisions with money, spending sprees and debt",
      "Reward and excitement seeking; low tolerance of boredom",
      "Lying about or hiding money problems",
      "Neglect of work, study and household tasks",
      "Relationship conflict and break-ups",
      "Late nights online and poor sleep",
      "Low mood, anxiety and shame",
      "Co-occurring alcohol and substance use"
    ],
    favoursADHD: [
      "Inattention and restlessness documented in childhood, long before any gambling",
      "Impulsivity, disorganisation and forgetfulness across many areas, not only money and betting",
      "Problems persist during periods without gambling (self-exclusion, treatment)",
      "A childhood informant describes the same pattern before adolescence",
      "Impulsive spending on many things, not focused on wagers",
      "Family history of ADHD"
    ],
    favoursAlt: [
      "Impaired control over gambling: cannot stop, set limits or keep to them",
      "Gambling takes precedence over other interests and responsibilities",
      "Gambling continues or escalates despite serious losses or harm",
      "Chasing losses: bigger stakes to win back money",
      "Preoccupation and urges to gamble during other activities",
      "Borrowing, stealing or lying to fund gambling or hide losses",
      "Gambling used to escape low mood, anxiety, boredom or loneliness",
      "Attention problems mainly reflect preoccupation with gambling, debts or the aftermath of losses",
      "Gradual onset in adolescence or adulthood with escalation over years (ICD-11)",
      "Onset after starting a dopamine agonist or aripiprazole (a medication effect; NICE NG248 1.1.22)",
      "Gambling only during episodes of elevated mood and reduced need for sleep (points to bipolar disorder)"
    ],
    ask: [
      "Do you gamble at all, for example sports betting, scratchcards, the lottery, casino games or online slots? How often?",
      "Are you worried about your own gambling, or has anyone else been worried about it?",
      "Have you tried to cut down or stop? What happened?",
      "Do you ever bet more to win back money you have lost?",
      "Have you borrowed money, sold things, used credit or taken money that was not yours to gamble or to cover losses?",
      "Have you hidden how much you gamble from the people close to you?",
      "Do you find yourself thinking about gambling when you are doing other things?",
      "What does gambling do for you: excitement, an escape from feeling low or stressed, relief from boredom?",
      "When did gambling become a problem, and what were you like at school long before that?",
      "When you have not been gambling, for example after self-excluding, are you still distractible, disorganised or restless?",
      "Are you impulsive with money in other ways, or is it mainly gambling?",
      "Have you ever had a spell of several days when you felt unusually high, needed little sleep and gambled or spent far more than usual?",
      "Do you take any medicines for Parkinson's disease, restless legs or psychosis?",
      "Have you had thoughts of ending your life, especially after a big loss?",
      "How much do you drink, and do you use cocaine or other drugs when you gamble?",
      "(Informant) Have you noticed money going missing, secrecy about phones or bank accounts, or mood changes after betting?"
    ],
    features: [
      { id: "gambling_control", t: "Impaired control over gambling (cannot stop or keep to limits)", w: 3 },
      { id: "gambling_harm", t: "Gambling continues or escalates despite serious financial, family or work harm", w: 3 },
      { id: "gambling_nochild", t: "No childhood ADHD evidence from records or informants", w: 3 },
      { id: "gambling_priority", t: "Gambling takes priority over other interests and duties", w: 2 },
      { id: "gambling_chase", t: "Chasing losses with bigger stakes", w: 2 },
      { id: "gambling_fund", t: "Borrowing, stealing or lying to fund gambling or hide losses", w: 2 },
      { id: "gambling_confined", t: "Attention problems mainly reflect preoccupation with gambling or the aftermath of losses", w: 2 },
      { id: "gambling_meds", t: "Onset after starting a dopamine agonist or aripiprazole", w: 2 },
      { id: "gambling_urges", t: "Preoccupation and urges to gamble during other activities", w: 1 },
      { id: "gambling_escape", t: "Gambling used to escape low mood, stress or boredom", w: 1 },
      { id: "gambling_pgsi", t: "PGSI 8 or more (problem gambling)", w: 1 }
    ],
    screen: ["cssrs"],
    investigations: [
      "Ask directly ('Do you gamble?', 'Are you worried about your own or another person's gambling?'; NICE NG248 1.1.6) and point people to the NHS website gambling questionnaire (NG248 1.1.7).",
      "Problem Gambling Severity Index (PGSI: 9 items, 0-27; 8 or more indicates problem gambling) or the South Oaks Gambling Screen; NG248 1.1.20 suggests an up-to-date validated tool.",
      "Ask directly about suicidal thoughts and intent (NG248 1.1.13); the C-SSRS can structure the questions but does not predict risk.",
      "Medication review for dopamine agonists and aripiprazole (NG248 1.1.22).",
      "Mood history for hypomanic or manic episodes.",
      "Referral: NHS gambling treatment through NHS triage, with self-referral through the National Gambling Helpline as an option (NG248 1.1.16-1.1.17); specialist NHS gambling clinics for severe harm or complex co-occurring needs, including neurodiversity (NG248 1.3.1).",
      "Practical protection: debt advice, gambling-blocking software, bank gambling blocks and self-exclusion schemes (NG248 1.1.14-1.1.15)."
    ],
    redFlags: [
      "Suicidal thoughts: the risk may be highest straight after a gambling episode (NICE NG248 1.1.13); refer urgently if risk is considerable or immediate (NG248 1.1.12).",
      "Large debts, illegal lending or theft to fund gambling.",
      "Domestic or economic abuse, or harm to children in the household.",
      "Gambling during a period of elevated mood and reduced need for sleep (possible bipolar disorder).",
      "New gambling after starting a dopamine agonist or aripiprazole.",
      "Co-occurring alcohol or cocaine dependence (NG248 1.1.3)."
    ],
    decide: {
      better: "Gambling disorder, not ADHD, explains the picture when inattention, restlessness and disorganisation arise from preoccupation with gambling, losses, debt and secrecy, began with the gambling, and there is no childhood evidence of ADHD. Gambling confined to mood episodes points to bipolar disorder; gambling that started with a dopamine agonist or aripiprazole points to a medication effect.",
      both: "Diagnose both when childhood-onset ADHD is corroborated and persists outside gambling, and the gambling meets ICD-11 or DSM-5-TR criteria in its own right. This combination is common, and both need treatment.",
      next: "Assess suicide risk the same day. Refer to NHS gambling treatment, where group CBT (or individual CBT) is first line (NICE NG248 1.5.13-1.5.14), and offer debt advice and blocking tools. If ADHD is diagnosed, treat it alongside: treat the addictive behaviour and the ADHD each in their own right, ideally at the same time (CADDRA 4.1), rather than expecting ADHD treatment to resolve the gambling."
    },
    pearls: [
      "NICE NG248 1.1.3 says to ask about gambling when anyone presents with ADHD. Make it a routine question, like alcohol.",
      "Gambling is hidden and shaming (NG248 1.1.1). Ask neutrally and normalise: 'Lots of people bet on their phones now. Do you?'",
      "Chasing losses and borrowing to gamble are the most specific features; impulsive spending on its own fits ADHD too.",
      "When gaming involves wagers (for example online poker), ICD-11 says gambling disorder is usually the better diagnosis. Ask about betting inside games and apps.",
      "Gambling-related harm can be a dominant suicide risk factor even without other risk factors (NG248 1.1.11).",
      "Always check for dopamine agonists and aripiprazole: they can cause impaired control over gambling, and ICD-11 then does not diagnose gambling disorder.",
      "Men are affected about twice as often as women in adulthood; women tend to start later but progress faster and more often have co-occurring mood or anxiety disorders (ICD-11).",
      "Gamblers with ADHD gamble for longer, more often describe gambling as calming, progress faster and have more suicide attempts and cluster B personality disorders than gamblers without ADHD (Retz 2016)."
    ],
    refs: [
      "ICD-11 CDDR (WHO 2024): 6C50 Gambling disorder (requirements, course, gender features and boundaries); QE21",
      "DSM-5-TR (APA 2022): gambling disorder (paraphrased)",
      "NICE NG248 Gambling-related harms: identification, assessment and management (2025): 1.1.1, 1.1.3, 1.1.6, 1.1.7, 1.1.11-1.1.17, 1.1.20, 1.1.22, 1.3.1, 1.5.7, 1.5.13-1.5.14",
      "CADDRA 4.1 (2020): addictions section",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34 (4.1.7)",
      "Australian evidence-based clinical practice guideline for ADHD (AADPA 2022): 1.1.1",
      "Theule J et al. Exploring the relationships between problem gambling and ADHD: a meta-analysis. J Atten Disord 2019;23(12)",
      "Retz W et al. Association of attention-deficit/hyperactivity disorder with gambling disorder. J Neural Transm 2016;123:1013-19"
    ]
  },

  /* ------------------------------------------------------------------ Gaming */
  {
    id: "gaming",
    name: "Gaming disorder and problematic gaming or internet use",
    group: "substance",
    core: false,
    icd11: "6C51 Gaming disorder (6C51.0 predominantly online, 6C51.1 predominantly offline); QE22 Hazardous gaming",
    summary: "A persistent pattern of impaired control over digital gaming, increasing priority given to it, and continuation despite harm, usually over at least 12 months. Adults with ADHD often hyperfocus on games and lose hours online, which can cause, hide or be mistaken for the disorder. Gaming disorder does not explain lifelong inattention across settings, but night-time gaming and displacement of work and study can mimic ADHD in someone who does not have it.",
    prevalence: "ICD-11 notes elevated rates of problematic gaming and gaming disorder in people with ADHD and in autistic people, possibly because games are used to regulate attention. The Australian guideline (2022) lists internet addiction second only to BPD among adult groups with raised ADHD prevalence. Gaming disorder is most prevalent in adolescent and young adult males aged 12-20, with lower rates in adults (ICD-11). A meta-analysis of mostly cross-sectional studies found a moderate correlation between gaming disorder and ADHD symptom severity (r = 0.30), as strong for inattention as for hyperactivity (Koncz 2023). No reliable figure exists for UK adult ADHD clinics.",
    coexist: "yes",
    coexistNote: "Both can be diagnosed: ICD-11 lists ADHD among the conditions that commonly co-occur with gaming disorder. Gaming disorder is not diagnosed when the gaming is better explained by a manic episode or is due to a substance or medication. DSM-5-TR includes internet gaming disorder only as a condition for further study (Section III); ICD-11 6C51 is the diagnostic category. Heavy gaming alone, or gaming in line with peer and cultural norms, is not a disorder (ICD-11).",
    overlap: [
      "Hours lost to screens and poor sense of time",
      "Hyperfocus on games but not on work or study",
      "Procrastination and missed deadlines",
      "Late nights, delayed sleep and daytime tiredness",
      "Irritability when interrupted or asked to stop",
      "Neglect of chores, self-care and meals",
      "Underachievement and dropping out of courses",
      "Social withdrawal, or friendships mostly online"
    ],
    favoursADHD: [
      "Inattention and restlessness documented at primary school, before heavy gaming",
      "Difficulties in many areas, not only those displaced by gaming",
      "Problems persist during periods without gaming (holidays, a broken console, time away)",
      "Hyperfocus also on other high-interest activities, not only games",
      "A childhood informant confirms the pattern before screens became a big part of life",
      "Gaming is used to manage boredom and restlessness but can be stopped when the stakes are high"
    ],
    favoursAlt: [
      "Impaired control over gaming: cannot stop, limit sessions or keep to agreed times",
      "Gaming takes precedence over other interests, relationships and duties",
      "Gaming continues despite serious harm (failed course, job loss, health effects)",
      "Escalation: longer sessions or more demanding games to keep the same excitement",
      "Low mood, anger or aggression when made to stop (ICD-11)",
      "Attention and sleep problems began when gaming escalated, typically in adolescence or later",
      "Daytime inattention largely explained by sleep lost to night-time gaming",
      "Attention and mood improve after a period of reduced gaming",
      "No childhood history from records or informants",
      "Gaming used to escape low mood, social anxiety or social difficulty (screen for depression, social anxiety and autism)"
    ],
    ask: [
      "How many hours a day do you spend gaming or online, on a work or study day and on a day off? When do you usually stop?",
      "Do you find it hard to stop when you planned to, or to keep to limits you set yourself?",
      "Has gaming pushed out things you used to enjoy, or things you need to do?",
      "Have you kept gaming despite problems, such as missed work, failed exams, arguments or health problems?",
      "What happens when you can't play, or someone asks you to stop?",
      "What does gaming give you: excitement, an escape from stress or low mood, social contact, a sense of achievement?",
      "Do you lose track of time like this with other things you enjoy, or is it mainly games?",
      "When you have not been able to game for a while, for example on holiday, how were your concentration and organisation?",
      "When did your gaming increase, and what were you like at school before then?",
      "How much sleep do you get on nights you game, and how are you the next day?",
      "Do your games involve spending money, loot boxes or betting?",
      "Do you feel anxious or uncomfortable around people, so that online contact feels easier?",
      "Have you felt low, or lost interest in things, recently?",
      "(Informant) As a child, before gaming took over, were they restless, distractible or disorganised?",
      "(Informant) How do they react when asked to stop playing?"
    ],
    features: [
      { id: "gaming_control", t: "Impaired control over gaming (cannot stop or keep to limits)", w: 3 },
      { id: "gaming_harm", t: "Gaming continues despite serious harm to study, work, relationships or health", w: 3 },
      { id: "gaming_onset", t: "Attention and sleep problems began when gaming escalated", w: 3 },
      { id: "gaming_nochild", t: "No childhood ADHD evidence from records or informants", w: 3 },
      { id: "gaming_priority", t: "Gaming takes precedence over other interests and duties", w: 2 },
      { id: "gaming_sleep", t: "Daytime inattention largely explained by sleep lost to night-time gaming", w: 2 },
      { id: "gaming_improve", t: "Attention improves after a period of reduced gaming", w: 2 },
      { id: "gaming_selective", t: "Concentration adequate for other demanding tasks when gaming is not displacing them", w: 2 },
      { id: "gaming_escalate", t: "Escalating session length or game intensity to keep the same excitement", w: 1 },
      { id: "gaming_stop", t: "Low mood, anger or aggression when gaming is stopped or limited", w: 1 },
      { id: "gaming_escape", t: "Gaming used to escape low mood, anxiety or social difficulty", w: 1 }
    ],
    screen: ["phq9", "aq10"],
    investigations: [
      "One to two weeks of sleep diary with screen-time reports from the phone or console.",
      "Screen for depression, social anxiety and autism (for example PHQ-9, AQ-10 or RAADS-14), which often drive a retreat into gaming.",
      "Ask about in-game spending and gambling elements (loot boxes, betting on items) and assess gambling separately if present.",
      "Agree a trial of structured reduction, then re-rate attention, mood and sleep (clinical practice).",
      "Referral: the NHS National Centre for Gaming Disorders (CNWL) treats people in England aged 13 and over, including by self-referral; local psychological services for CBT-based approaches."
    ],
    redFlags: [
      "Severe sleep loss, neglect of meals or self-care, or gaming for days without respite.",
      "Aggression or violence when gaming is limited.",
      "Suicidal thoughts or significant depression.",
      "Large in-game spending, debts or betting through games.",
      "Complete social withdrawal or not leaving home."
    ],
    decide: {
      better: "Gaming disorder, or simply heavy gaming with sleep loss, better explains the picture when attention and organisation problems began as gaming escalated, are confined to the areas gaming displaces, improve when gaming is reduced, and there is no childhood evidence of ADHD.",
      both: "Diagnose both when childhood-onset ADHD is corroborated and persists when gaming is limited, and the gaming meets ICD-11 6C51 requirements in its own right (impaired control, priority, continuation despite harm, usually over 12 months).",
      next: "Fix the sleep and screen-time picture first where it is clearly contributing, then re-rate. Screen for depression, social anxiety and autism. If ADHD is diagnosed, treat it alongside specific help for the gaming, and review gaming after treatment starts rather than assuming it will settle."
    },
    pearls: [
      "Hyperfocus on games is not evidence against ADHD: ICD-11 notes higher rates of problematic gaming in ADHD, possibly as a way to regulate attention.",
      "Equally, hours of gaming are not evidence for ADHD. Ask about childhood before screens, and about functioning when gaming is not possible.",
      "Sleep is the hidden mediator: night-time gaming produces daytime inattention that looks like ADHD. Ask about bedtimes and screen use after midnight.",
      "ICD-11 does not count heavy gaming that fits peer or cultural norms (for example during holidays) as a disorder: look for impaired control and harm.",
      "If the games involve wagers, consider gambling disorder instead (ICD-11).",
      "Autistic people also have raised rates of problematic gaming (ICD-11): ask about social communication history and sensory preferences."
    ],
    refs: [
      "ICD-11 CDDR (WHO 2024): 6C51 Gaming disorder (requirements, threshold, course, developmental features and boundaries); QE22",
      "DSM-5-TR (APA 2022): internet gaming disorder, Section III conditions for further study",
      "Australian evidence-based clinical practice guideline for ADHD (AADPA 2022): 1.1.1",
      "CADDRA 4.1 (2020): addictions section",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34 (4.1.7)",
      "Koncz P et al. The emerging evidence on the association between symptoms of ADHD and gaming disorder: systematic review and meta-analysis. Clin Psychol Rev 2023;106:102343",
      "CNWL NHS Foundation Trust: National Centre for Gaming Disorders (service information, October 2026)"
    ]
  },

  /* ------------------------------------------------------------------ Eating disorders */
  {
    id: "eating",
    name: "Eating disorders (binge-eating disorder, bulimia nervosa, anorexia nervosa, avoidant-restrictive food intake disorder)",
    group: "other",
    core: false,
    icd11: "6B80 Anorexia nervosa; 6B81 Bulimia nervosa; 6B82 Binge-eating disorder; 6B83 Avoidant-restrictive food intake disorder",
    summary: "Eating disorders co-occur with ADHD more often than chance, especially binge-eating and bulimic patterns, where impulsivity and poor regulation of eating overlap. Starvation, bingeing and purging also impair concentration, sleep and mood and can mimic ADHD. They matter for safety and treatment: methylphenidate product information lists anorexia nervosa among contraindications, and stimulants can be sought to suppress appetite.",
    prevalence: "Females with ADHD were 3.6 times more likely than females without ADHD to meet criteria for an eating disorder, and ADHD prevalence in eating disorders is about 11.4% (CADDRA 4.1). Bulimia nervosa is more common in ADHD, and ADHD is more common in the purging type of anorexia nervosa (CADDRA 4.1). A clinically referred adult ADHD sample showed an excess of eating disorders compared with controls (Sobanski 2007). The Australian guideline lists binge-eating disorder among adult groups with raised ADHD prevalence (AADPA 2022 1.1.1, consensus).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. Do not count inattention, restlessness or irritability that appeared with starvation, purging or a binge cycle and resolves with nutritional recovery. Motor hyperactivity can be a weight-control behaviour in anorexia nervosa (ICD-11), not ADHD hyperactivity. Binge eating in ADHD is often impulsive or used to manage restlessness (Kooij 2019); diagnose binge-eating disorder only when episodes show loss of control and marked distress and meet the frequency and duration requirements (for example at least weekly for 3 months; ICD-11).",
    overlap: [
      "Impulsive, unplanned eating and grazing",
      "Irregular meals: forgetting to eat while hyperfocused, then overeating",
      "Poor concentration and mental fog",
      "Irritability and mood swings",
      "Restlessness and high activity levels",
      "Low self-esteem and shame",
      "Sleep disturbance",
      "Eating used to manage boredom, stress or low mood"
    ],
    favoursADHD: [
      "Inattention and restlessness documented in childhood, before any eating problem",
      "Disorganised eating as part of wider disorganisation (forgotten meals, no shopping, chaotic routine) without concern about weight or shape",
      "Concentration problems persist when eating and weight are stable",
      "A childhood informant describes the pattern before adolescence",
      "Impulsivity in many areas, not only food",
      "Restlessness is fidgety and unfocused, not exercise driven by burning calories"
    ],
    favoursAlt: [
      "Overvaluation of weight or shape, central to self-worth",
      "Recurrent binges with loss of control, distress, guilt or disgust",
      "Compensatory behaviours: vomiting, laxatives, diuretics, fasting or driven exercise",
      "Restriction, low or falling weight, and fear of weight gain",
      "Concentration problems began with weight loss or a binge-purge cycle",
      "Preoccupation with food, calories or body during periods of restriction",
      "Overactivity is compulsive exercise or deliberate movement to burn energy",
      "Interest in stimulants mainly for appetite or weight control",
      "Physical signs: bradycardia, low blood pressure, electrolyte disturbance, dental erosion, menstrual disturbance",
      "Narrow, avoidant eating driven by sensory aversion, fear of choking or lack of interest, without body-image concern (ARFID)"
    ],
    ask: [
      "How would you describe your eating on a typical day? Do you have regular meals?",
      "Do you ever forget to eat because you are absorbed in something, and then eat a lot later?",
      "Do you have times when you feel you can't stop eating, or lose control over what or how much you eat? How often does that happen?",
      "How do you feel afterwards?",
      "Have you ever made yourself sick, or used laxatives, diet pills, fasting or hard exercise to make up for eating?",
      "How much do your weight and shape affect how you feel about yourself?",
      "Has your weight changed a lot recently? What are the lowest and highest weights you have been as an adult?",
      "Do you limit what you eat or avoid certain foods? Is that about weight, or about taste, texture, fear of choking or lack of interest?",
      "When did the eating difficulties start, and what were you like at school before then?",
      "When your eating has been settled, how were your concentration and organisation?",
      "Do you exercise to burn calories, or feel you must keep moving?",
      "Have you ever taken stimulants, slimming pills or someone else's ADHD medication to control your appetite or weight?",
      "Do you feel dizzy, faint or cold, or have palpitations? Are your periods regular?",
      "How would you feel if a medicine reduced your appetite?",
      "(Informant) Have you noticed changes in their eating, weight or exercise, or trips to the bathroom straight after meals?"
    ],
    features: [
      { id: "eating_shape", t: "Overvaluation of weight or shape, central to self-worth", w: 3 },
      { id: "eating_comp", t: "Compensatory behaviours (vomiting, laxatives, diuretics, fasting, driven exercise)", w: 3 },
      { id: "eating_restrict", t: "Restriction with low or falling weight and fear of weight gain", w: 3 },
      { id: "eating_onset", t: "Concentration problems began with weight loss or a binge-purge cycle", w: 3 },
      { id: "eating_nochild", t: "No childhood ADHD evidence from records or informants", w: 3 },
      { id: "eating_loc", t: "Recurrent binge episodes with loss of control and marked distress", w: 2 },
      { id: "eating_recover", t: "Attention improves with nutritional recovery or stable eating", w: 2 },
      { id: "eating_exercise", t: "Overactivity is driven exercise or movement to burn energy", w: 2 },
      { id: "eating_stim", t: "Interest in stimulants mainly for appetite or weight control", w: 2 },
      { id: "eating_physical", t: "Physical signs: bradycardia, low blood pressure, electrolyte disturbance, dental erosion, menstrual change", w: 2 },
      { id: "eating_preocc", t: "Preoccupation with food, calories or body during restriction", w: 1 },
      { id: "eating_arfid", t: "Narrow, avoidant eating driven by sensory aversion, fear or lack of interest (ARFID)", w: 1 }
    ],
    screen: [],
    investigations: [
      "Weight, height and BMI, pulse, blood pressure (lying and standing if restriction is suspected) and temperature.",
      "Bloods if restriction or purging is suspected: FBC, urea and electrolytes including potassium, magnesium and phosphate, glucose and LFTs (NICE NG69; RCPsych MEED).",
      "ECG if there is purging, significant weight change, or medication that could affect cardiac function (NICE NG69).",
      "Screening questions such as the SCOFF are prompts only: NICE NG69 1.2.5 says not to use screening tools as the sole method to decide whether someone has an eating disorder.",
      "Use the RCPsych Medical Emergencies in Eating Disorders (MEED) guidance to grade physical risk.",
      "Referral: if an eating disorder is suspected after initial assessment, refer immediately to a community-based eating disorder service (NICE NG69 1.2.10)."
    ],
    redFlags: [
      "Rapid weight loss, very low BMI, bradycardia, low blood pressure, fainting or electrolyte disturbance: same-day medical assessment (NICE NG69; RCPsych MEED).",
      "Purging with dizziness, palpitations or muscle weakness (possible hypokalaemia).",
      "Suicidal thoughts or self-harm.",
      "Insulin omission in diabetes.",
      "Seeking stimulants for weight loss, or misusing prescribed stimulants to suppress appetite.",
      "Eating disorder during pregnancy."
    ],
    decide: {
      better: "An eating disorder better explains the picture when concentration, restlessness and irritability began with restriction, bingeing or purging and improve with nutritional recovery, overactivity is driven exercise, and there is no childhood evidence of ADHD.",
      both: "Diagnose both when childhood-onset ADHD is corroborated and persists when eating and weight are stable, and the eating disorder meets criteria in its own right. ADHD with binge-eating or bulimic patterns is a common combination.",
      next: "Assess physical risk first and refer to eating disorder services (NICE NG69 1.2.10). If ADHD is also diagnosed, plan medication with the eating disorder team: stimulants reduce appetite and weight, and methylphenidate SmPCs list anorexia nervosa among contraindications. Record baseline weight (NICE NG87 1.7.4). NG87 1.8.5 sets 6-monthly weight checks for adults on ADHD medication; with an eating disorder, agree closer monitoring with the eating disorder team (clinical practice)."
    },
    pearls: [
      "Ask about eating in every adult ADHD assessment, especially in women: UKAAN quality standards (AQAS) say to enquire about conditions such as binge eating and anorexia because they change management.",
      "Separate disorganised eating from an eating disorder: forgetting to eat while hyperfocused and then grazing is common in ADHD and has no weight or shape concern.",
      "Starvation impairs concentration and narrows attention to food. Do not rate ADHD symptoms in someone who is acutely underweight.",
      "Watch for stimulant-seeking for weight loss (CADDRA 4.1); ICD-11 lists stimulants among the medicines used to increase energy expenditure in anorexia nervosa.",
      "Binge eating in ADHD is often impulsive or used to calm restlessness (Kooij 2019); in binge-eating disorder the core is loss of control with marked distress (ICD-11).",
      "Narrow, sensory-driven eating (ARFID) often goes with autism: screen for autism too.",
      "Obesity raises the risk of obstructive sleep apnoea, which can mimic or worsen ADHD; check sleep before attributing tiredness and inattention to ADHD (CADDRA 4.1).",
      "Risk is highest between 13 and 17, but eating disorders can begin at any age (NICE NG69 1.2.4)."
    ],
    refs: [
      "ICD-11 CDDR (WHO 2024): 6B80-6B83 feeding and eating disorders",
      "DSM-5-TR (APA 2022): feeding and eating disorders (paraphrased)",
      "NICE NG69 Eating disorders: recognition and treatment (2017, updated 2020): 1.2.4, 1.2.5, 1.2.6, 1.2.9, 1.2.10",
      "Royal College of Psychiatrists CR233 Medical emergencies in eating disorders (MEED), 2022",
      "NICE NG87 (2018, updated 2025): 1.2.2, 1.7.4, 1.8.5",
      "CADDRA 4.1 (2020): eating disorders section",
      "Australian evidence-based clinical practice guideline for ADHD (AADPA 2022): 1.1.1",
      "RCPsych CR235 (2023): 9.2 (women: differentiate from eating disorders)",
      "Kooij JJS et al. Eur Psychiatry 2019;56:14-34 (4.1.3)",
      "UKAAN Adult ADHD Quality Assessment Standards (AQAS; Adamou et al. 2024): mental health history",
      "Sobanski E et al. Psychiatric comorbidity in clinically referred adults with ADHD. Eur Arch Psychiatry Clin Neurosci 2007",
      "Methylphenidate (Concerta XL) SmPC section 4.3"
    ]
  }
]);
