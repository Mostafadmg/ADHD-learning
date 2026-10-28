/* ddx-young.js: differentials for children and young people aged 6-17 (ARCHITECTURE.md 5.5).
   Conditions, in order: odd, conduct, attach, dld, fasd, relage, env, osa_child (obstructive sleep-disordered
   breathing in children), sepanx (separation anxiety disorder).
   Every entry has ages: 'young' (shown only in young-person assessments) and core: false; the age band's
   ddxCore list (age-bands.js) decides which must be reviewed.
   DSM-5-TR and ICD-11 content is paraphrased, not quoted. Interview questions are original prompts written
   for this app, not a validated instrument; '(Parent)', '(Teacher)' and '(Young person)' say who to ask.
   Checked on 25 Oct 2026: NICE NG87, CG158, NG26 and QS204 recommendation text (nice.org.uk, downloaded);
   SIGN 156 (2019, PDF); NICE NG76, NG116, NG205 and CG89 publication pages; RCPCH PP/FII guidance page;
   PubMed or Crossref records for every journal article cited. Points without a named source are
   clinical practice.
   ODD and conduct disorder list no screen tool: the SDQ result entered in the Screening step is the total or
   hyperactivity-inattention band, not the conduct problems scale, so it cannot signal either (youthinmind SDQ
   scoring: separate bands for each scale). osa_child and sepanx added 27 Oct 2026 (sources in their refs; the AAP
   2012 guideline and the CHAT trial abstract were read on PubMed). */
AA.add('ddx', [

  /* ------------------------------------------------------------------ */
  /* Oppositional defiant disorder                                       */
  /* ------------------------------------------------------------------ */
  {
    id: "odd",
    name: "Oppositional defiant disorder (ODD)",
    group: "other",
    ages: "young",
    core: false,
    icd11: "6C90 (6C90.0 with chronic irritability-anger; 6C90.1 without chronic irritability-anger)",
    summary: "A persistent pattern (at least 6 months) of angry or irritable mood, arguing with and defying adults, and spiteful behaviour, beyond what is usual for the child's age and culture. Not doing what is asked can look like inattention, and losing their temper can look like impulsivity. The key question is 'won't or can't?': ODD is refusal aimed mainly at the adults in charge; ADHD is failing to finish or follow through despite wanting to. The two very often occur together.",
    prevalence: "DSM-5-TR (paraphrased): in the general population, ODD occurs alongside ADHD in about half of children with the combined presentation and about a quarter with the predominantly inattentive presentation. NICE NG87 1.2.1 lists children and young people diagnosed with ODD or conduct disorder as a group with a higher prevalence of ADHD.",
    coexist: "yes",
    coexistNote: "DSM-5-TR and ICD-11 allow both. To add ODD, the refusal must not happen only in situations that need sustained effort or sitting still (DSM-5-TR, ODD differential, paraphrased). The ADHD criteria also say a symptom must not be only oppositional behaviour or a failure to understand instructions. DSM-5-TR does not allow ODD alongside disruptive mood dysregulation disorder (DMDD). ICD-11 has no DMDD and records chronic irritability as an ODD qualifier instead.",
    overlap: [
      "Does not do what adults ask, or leaves tasks unfinished",
      "Loses their temper quickly; frequent arguments at home and school",
      "Disrupts lessons and gets into trouble with staff",
      "Blames others for their own mistakes",
      "Annoys brothers, sisters and classmates",
      "Homework battles and missing school work",
      "Detentions, exclusions or phone calls home from school",
      "Strained relationships with parents and teachers, and high parent stress"
    ],
    favoursADHD: [
      "Does not follow instructions because they drift off, forget or lose track, not because they refuse (DSM-5-TR criterion A note)",
      "Problems show with all kinds of tasks and with all adults, including adults they like and want to please",
      "Outbursts are quick, blow over, and are followed by regret",
      "Inattention and restlessness are present even when nobody is making demands: watching TV, in play, on outings",
      "Also forgets things, loses things, makes careless mistakes, fidgets and interrupts",
      "Wants to do well and is upset by repeated failure or being told off",
      "Restlessness or distractibility began in early childhood, before the conflict built up"
    ],
    favoursAlt: [
      "Refusal is deliberate and aimed mainly at the adults in charge: 'won't' rather than 'can't'",
      "Can focus well on tasks they choose or enjoy, including long games or screen time, and can sit still when they want to",
      "Angry, touchy or resentful mood much of the time, not just short bursts of frustration",
      "Spiteful or vindictive acts (DSM-5-TR asks for at least twice in 6 months)",
      "Argues with and defies even short, simple requests that need no concentration",
      "Deliberately annoys others and blames them for their own mistakes",
      "Behaviour is much worse with one parent or one teacher, linked to that relationship",
      "School reports describe defiance but no distractibility, forgetfulness or restlessness",
      "Behaviour improves quickly with a consistent behaviour plan or parent training"
    ],
    ask: [
      "(Parent) When they do not do what you ask, is it because they did not take it in, forgot or drifted off, or because they decided not to?",
      "(Parent) Does it happen with quick, simple requests too, such as 'put your shoes on', or mainly with long or boring tasks?",
      "(Parent) Can they concentrate on things they choose, like games or building, for a long time without wandering off?",
      "(Parent) How often do they lose their temper? How long does it last, and how do they seem afterwards?",
      "(Parent) Are they angry or resentful much of the time, or mostly cheerful between outbursts?",
      "(Parent) Do they ever do things on purpose to annoy people or to get back at them? Can you give an example from the last 6 months?",
      "(Parent) Is it the same with both parents, grandparents, childminders and teachers, or worse with one person?",
      "(Parent) What helps: a calm warning, a reward chart, time together? What makes it worse?",
      "(Parent) When did the arguments and refusals start? What was going on at home or school at that time?",
      "(Teacher) In class, is the problem refusing work, or starting it and then drifting off, losing things or rushing?",
      "(Teacher) Do they follow instructions from adults they like, and in practical or active lessons?",
      "(Teacher) Do they argue with staff, blame other pupils or deliberately wind others up?",
      "(Teacher) When there is no conflict going on, are they still fidgety, distractible or forgetful?",
      "(Young person) When you get told off for not doing something, what usually happened: you forgot, you got distracted, or you did not want to?",
      "(Young person) What makes you really angry? How long does it take you to calm down?",
      "(Young person) Are there adults you get on well with? What is different about them?",
      "(Young person) Do you sometimes mean to get back at people, or does it come out before you think?"
    ],
    features: [
      { id: "odd_f1", t: "Refusal is deliberate and aimed mainly at the adults in charge ('won't' rather than 'can't')", w: 3 },
      { id: "odd_f2", t: "Attention is ordinary on chosen or enjoyed tasks and when no demands are made", w: 3 },
      { id: "odd_f3", t: "Angry, irritable or defiant behaviour at least weekly for 6 months or more (DSM-5-TR frequency from age 5)", w: 2 },
      { id: "odd_f4", t: "Spiteful or vindictive acts at least twice in the last 6 months", w: 2 },
      { id: "odd_f5", t: "Argues with and defies even short, simple requests", w: 2 },
      { id: "odd_f6", t: "Deliberately annoys others and blames them for own mistakes", w: 2 },
      { id: "odd_f7", t: "Behaviour much worse with one adult or in one relationship", w: 2 },
      { id: "odd_f8", t: "School reports describe defiance but no distractibility, forgetfulness or restlessness", w: 2 },
      { id: "odd_f9", t: "No fidgeting, restlessness or impulsive talking when calm and not in conflict", w: 2 },
      { id: "odd_f10", t: "Behaviour improved clearly with a consistent behaviour plan or parent training", w: 1 },
      { id: "odd_f11", t: "A cycle of harsh or inconsistent discipline and escalating conflict at home", w: 1 },
      { id: "odd_f12", t: "Oppositional items on rating scales raised while the ADHD items are near normal", w: 1 }
    ],
    screen: [],
    investigations: [
      "Parent and teacher accounts of the same behaviours, with examples from the last 6 months: who, where, how often, and what helps",
      "Rating scales with an oppositional section from home and school: the SDQ conduct problems scale (NICE CG158 1.3.4), SNAP-IV items 19-26, the NICHQ Vanderbilt ODD section or the Conners 4 ODD scale. These are screens, not diagnoses",
      "School observation when accounts disagree or symptoms are in doubt (NICE NG87 1.3.2)",
      "Assess parenting, the parent-child relationship, adult relationships at home (including domestic abuse) and the parents' wellbeing and mental health (NICE CG158 1.3.15; NICE NG87 1.3.4)",
      "Look for coexisting problems that drive irritability or refusal: anxiety, low mood, language disorder, learning difficulties, autism and trauma (NICE CG158 1.3.11)",
      "Hearing and vision checks if 'not listening' is a main complaint",
      "Ask about conduct disorder behaviours (aggression, cruelty, theft, fire-setting, running away, truancy) to see whether conduct disorder is the better description"
    ],
    redFlags: [
      "Aggression that injures people or animals, weapon use, fire-setting or sexual harm to others: assess for conduct disorder and risk, and follow safeguarding procedures",
      "Signs of abuse, neglect or domestic abuse at home (NICE CG158 1.3.14): follow local safeguarding procedures",
      "Irritability with low mood, withdrawal, sleep change or talk of self-harm: assess for depression and suicide risk",
      "Severe temper outbursts most days with irritability in between: think of DMDD (DSM-5-TR) or ODD with chronic irritability-anger (ICD-11), and assess mood",
      "Excluded or at risk of exclusion from school: urgent school liaison and a review of special educational needs",
      "A parent at breaking point or rejecting the child: family support and early help"
    ],
    decide: {
      better: "ODD better explains the picture when the non-compliance is deliberate refusal aimed mainly at the adults in charge, attention and activity are ordinary on chosen tasks and when no demands are made, and there are no inattention or hyperactivity-impulsivity symptoms beyond the conflict, across 2 or more settings. Diagnose ODD (or record the oppositional behaviour) and do not count the refusal toward the ADHD symptoms (DSM-5-TR criterion A note).",
      both: "Diagnose both when ADHD symptoms show in situations with no conflict or demand (play, outings, chosen activities, with liked adults) and across settings, and ODD criteria are also met beyond what ADHD explains. This is common, especially with the combined presentation.",
      next: "Offer parents a parent-training programme in line with NICE CG158 1.5.1-1.5.10, as well as group ADHD-focused support (NICE NG87 1.5.11); consider individual parent training if groups are not possible or the family's needs are too complex (1.5.12). Explain that this does not imply bad parenting (1.4.11). Do not use medicine to manage the behaviour itself (CG158 1.6.1); ADHD medicine treats the ADHD (CG158 1.6.2). An added antipsychotic for pervasive aggression, rages or irritability needs tertiary advice (NG87 1.7.17). If behaviour worsens on ADHD medicine, adjust it and review the diagnosis (NG87 1.8.18)."
    },
    pearls: [
      "'Won't or can't?' Ask what happens with a quick, simple request that needs no concentration. Refusal there points to ODD; failure only on long or dull tasks points to ADHD.",
      "See the child with a liked adult or on a chosen task. ADHD symptoms continue there; oppositional behaviour often does not.",
      "Irritability is the bridge to mood. A child who is angry most of the day, most days, needs a mood assessment, not only a behaviour plan.",
      "Oppositional behaviour often grows out of unrecognised ADHD: years of telling-off and failure build conflict. Ask what the child was like at 4 or 5, before the battles started.",
      "Check understanding before calling it refusal. Language problems are easily missed in children labelled oppositional (see developmental language disorder).",
      "ODD often comes before childhood-onset conduct disorder, but many children with ODD never develop it (DSM-5-TR, paraphrased). Ask about conduct behaviours again as the child grows.",
      "Group ADHD-focused support for parents should not wait for a formal diagnosis (NICE NG87 1.2.7)."
    ],
    refs: [
      "APA. DSM-5-TR (2022): oppositional defiant disorder criteria, course and differential diagnosis; ADHD criterion A note and comorbidity (paraphrased)",
      "WHO. ICD-11 CDDR (2024): 6C90 oppositional defiant disorder",
      "NICE NG87 (2018, updated 2019) 1.2.1, 1.2.7, 1.3.2, 1.3.4, 1.4.11, 1.5.11, 1.5.12, 1.7.17, 1.8.18",
      "NICE CG158 Antisocial behaviour and conduct disorders in children and young people (2013, updated 2017) 1.3.4, 1.3.11, 1.3.14, 1.3.15, 1.5.1-1.5.10, 1.6.1, 1.6.2"
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Conduct disorder                                                    */
  /* ------------------------------------------------------------------ */
  {
    id: "conduct",
    name: "Conduct disorder (conduct-dissocial disorder)",
    group: "other",
    ages: "young",
    core: false,
    icd11: "6C91 conduct-dissocial disorder (6C91.0 childhood onset; 6C91.1 adolescent onset; each qualified as with limited or typical prosocial emotions)",
    summary: "A repeated, persistent pattern of behaviour that breaks other people's basic rights or major rules for the young person's age: aggression to people or animals, destroying property, lying or stealing, and serious rule-breaking such as running away or truanting. ADHD impulsivity can be disruptive and lead to fights or broken rules, but on its own it does not involve deliberate harm or violating others' rights. The two often occur together, and the combination has a worse outlook, so both need recognising.",
    prevalence: "DSM-5-TR (paraphrased): conduct disorder occurs in about a quarter of children or adolescents with the combined presentation of ADHD, depending on age and setting. NICE NG87 1.2.1 lists children and young people with conduct disorder, and people known to the Youth Justice System, as groups with a higher prevalence of ADHD.",
    coexist: "yes",
    coexistNote: "DSM-5-TR (paraphrased): hyperactive and impulsive behaviour does not by itself violate social norms or the rights of others, so it does not usually meet conduct disorder criteria; when criteria for both are met, diagnose both. NICE CG158 1.3.3 says a neurodevelopmental condition such as ADHD must not be a barrier to assessment for conduct disorder, and 1.3.5 names ADHD as a significant complicating factor to look for.",
    overlap: [
      "Rule-breaking and getting into trouble at school and in the community",
      "Fights and aggression, often after provocation",
      "Lying, often to get out of trouble",
      "Risk-taking: roads, heights, vehicles, alcohol and drugs",
      "Poor attendance, exclusions and low attainment",
      "Contact with the police or youth justice services",
      "Peer problems and mixing with older or risk-taking peers",
      "Family conflict and stretched parenting"
    ],
    favoursADHD: [
      "Fights and rule-breaking are impulsive and unplanned, and often regretted soon after",
      "Lies are quick cover-ups for forgotten or lost things, not schemes to gain something",
      "Things get broken through carelessness or rough play, not destroyed on purpose",
      "Shows guilt and empathy; upset when others are hurt",
      "Inattention, forgetfulness and restlessness show in calm, neutral settings with no rule to break",
      "Risk-taking is thrill-seeking or not thinking ahead, not intended to harm others",
      "Hyperactivity and inattention were present in early childhood, before any antisocial behaviour"
    ],
    favoursAlt: [
      "Planned or repeated aggression: bullying, threatening, intimidating or starting fights to get something",
      "Cruelty to people or animals",
      "Deliberate fire-setting or destruction of property",
      "Theft, breaking into homes or cars, or lying to con people",
      "Serious rule-breaking from a young age: staying out at night against the rules or truanting before 13, or running away overnight at least twice (or once for a long period)",
      "Little guilt or remorse, little empathy and shallow emotions (DSM-5-TR 'with limited prosocial emotions'; ICD-11 qualifier)",
      "Acts are goal-directed and hidden from adults rather than impulsive and in plain view",
      "Attention and activity are ordinary in lessons the young person is engaged in",
      "Antisocial peer group, with most of the behaviour outside home and school"
    ],
    ask: [
      "(Parent) Has your child ever hurt someone on purpose, used a weapon, or forced someone to do something?",
      "(Parent) Have they been cruel to animals or to younger children?",
      "(Parent) Has anything been set on fire, broken or damaged on purpose rather than by accident?",
      "(Parent) Do they steal, at home, from shops or from other people? Do they lie to get things or to get out of doing things?",
      "(Parent) Do they stay out late against your rules, run away overnight or skip school? From what age? How many times have they run away overnight, and for how long?",
      "(Parent) After they have hurt or upset someone, do they seem sorry? Do they understand how the other person feels?",
      "(Parent) When they break rules, is it on the spur of the moment, or planned and hidden?",
      "(Parent) What were they like at 4 or 5: restless and distractible, or settled until the trouble started later?",
      "(Teacher) Is the main difficulty attention and restlessness in lessons, or deliberate aggression, intimidation or theft?",
      "(Teacher) When they are interested in a lesson, can they focus and stay in their seat?",
      "(Teacher) Who do they spend time with? Are there worries about older peers, gangs or exploitation?",
      "(Young person) When you have got into fights or trouble, did you plan it, or did it happen before you thought?",
      "(Young person) How do you feel afterwards when someone has been hurt or upset?",
      "(Young person) Has anyone ever asked you to carry, hide or sell things, or pushed you into doing things you did not want to do?",
      "(Young person) Do you use alcohol, cannabis or other drugs? How much, and how often?",
      "(Young person) Have you had any contact with the police or a youth justice (youth offending) team?",
      "(Young person) In lessons you enjoy, can you concentrate and sit still?"
    ],
    features: [
      { id: "conduct_f1", t: "Deliberate aggression to people: bullying, threatening, starting fights or using a weapon", w: 3 },
      { id: "conduct_f2", t: "Cruelty to people or animals", w: 3 },
      { id: "conduct_f3", t: "Deliberate fire-setting or destruction of property", w: 3 },
      { id: "conduct_f4", t: "Theft, breaking in, or lying to gain something or avoid duties", w: 2 },
      { id: "conduct_f5", t: "Serious rule-breaking: out at night or truanting before 13, or running away overnight at least twice (or once for a long period)", w: 2 },
      { id: "conduct_f6", t: "Little guilt, remorse or empathy; shallow emotions (limited prosocial emotions)", w: 3 },
      { id: "conduct_f7", t: "Antisocial acts are planned and hidden rather than impulsive", w: 2 },
      { id: "conduct_f8", t: "Attention and activity ordinary when engaged in a lesson or activity", w: 2 },
      { id: "conduct_f9", t: "No hyperactivity or inattention in early childhood, before the antisocial behaviour began", w: 2 },
      { id: "conduct_f10", t: "Antisocial peer group, gang involvement or youth justice contact", w: 1 },
      { id: "conduct_f11", t: "Pattern seen over 12 months, with at least one behaviour in the last 6 months (DSM-5-TR duration)", w: 1 },
      { id: "conduct_f12", t: "Substance misuse linked to the antisocial behaviour", w: 1 }
    ],
    screen: [],
    investigations: [
      "Comprehensive assessment in line with NICE CG158 1.3.8-1.3.10: offer the young person time on their own, involve a parent or carer, and ask about aggression, destruction, deceit or theft and serious rule-breaking, functioning at home, at school and with peers, and parenting quality",
      "Look for complicating factors and refer to specialist CAMHS if any are present: another mental health problem, a neurodevelopmental condition (especially ADHD and autism), a learning disability or difficulty, or substance misuse (CG158 1.3.5-1.3.6)",
      "SDQ from a parent, carer or teacher for the initial assessment (CG158 1.3.4)",
      "Check speech, language and communication and reading; consider a cognitive assessment if a learning disability is possible (CG158 1.3.11-1.3.12)",
      "Risk assessment and, if needed, a risk management plan for self-neglect, exploitation, self-harm and harm to others (CG158 1.3.13)",
      "Assess for physical, sexual and emotional abuse (CG158 1.3.14), and assess the parents: discipline, the parent-child relationship, domestic abuse, mental health, substance use (including in pregnancy) and offending (CG158 1.3.15)",
      "With consent, gather information from school, social care and the youth justice service"
    ],
    redFlags: [
      "Carrying a weapon, serious violence or sexual harm to others: risk assessment and multi-agency safeguarding the same day",
      "Signs of criminal or sexual exploitation (unexplained money or phones, going missing, older associates, county lines): follow safeguarding procedures",
      "Abuse or neglect at home (CG158 1.3.14): safeguarding referral",
      "Self-harm, suicidal thoughts or heavy substance use: assess risk",
      "Repeated deliberate fire-setting: specific risk assessment, and involve the local fire and rescue service's youth fire-setting scheme where one exists (Clinical practice)",
      "Diversion risk if a stimulant is considered: be cautious, avoid immediate-release or easily injected or snorted stimulants, and keep reviewing the risk (NICE NG87 1.7.23, 1.7.24, 1.8.19)"
    ],
    decide: {
      better: "Conduct disorder better explains the picture when the main problems are deliberate aggression, cruelty, destruction, deceit or serious rule-breaking, attention and activity are ordinary when the young person is engaged, and there was no early pattern of hyperactivity or inattention before the antisocial behaviour began. Do not count antisocial acts as ADHD impulsivity.",
      both: "Diagnose both when there is a childhood pattern of inattention and/or hyperactivity-impulsivity across settings, including calm and neutral ones, and conduct disorder criteria are met by behaviours that ADHD does not explain (deliberate harm, theft, cruelty). DSM-5-TR asks for both diagnoses when both sets of criteria are met.",
      next: "Refer to specialist CAMHS when complicating factors are present (CG158 1.3.6). Psychosocial treatment comes first: parent training for ages 3-11 (CG158 1.5.1-1.5.10), group social and cognitive problem-solving programmes for ages 9-14 (1.5.11), and multimodal interventions such as multisystemic therapy for ages 11-17 (1.5.13). Do not use medicine routinely for the behaviour (1.6.1); treat coexisting ADHD with ADHD medicine in line with NG87 (CG158 1.6.2), after assessing diversion risk. Risperidone for severe aggression is a short-term specialist option only after psychosocial treatment has not worked (CG158 1.6.3); in ADHD, an added antipsychotic needs tertiary advice (NG87 1.7.17)."
    },
    pearls: [
      "Ask about each conduct behaviour directly, with examples. Families and young people rarely volunteer cruelty, fire-setting or theft.",
      "Plan or impulse? ADHD rule-breaking is in plain view and regretted. Conduct disorder acts are often planned, hidden or used to gain something.",
      "Check for limited prosocial emotions: no remorse or guilt, little empathy, no concern about performance, shallow feelings. It marks a more serious, more persistent pattern and shapes the treatment plan.",
      "Childhood-onset conduct disorder (a conduct symptom before 10) is more often persistent and more often comes with ADHD than adolescent-onset conduct disorder (DSM-5-TR, paraphrased).",
      "Speech, language and communication problems are common and often missed in young people with conduct problems (CG158 1.3.11, 1.3.16). Check understanding before relying on a spoken account.",
      "ADHD medicine can reduce impulsive aggression, but it does not treat planned antisocial behaviour. Agree in advance what you expect it to change (Clinical practice).",
      "Antisocial personality disorder cannot be diagnosed before 18 and needs evidence of conduct disorder before 15 (DSM-5-TR). Record conduct disorder clearly: adult services will need it."
    ],
    refs: [
      "APA. DSM-5-TR (2022): conduct disorder criteria, subtypes, 'with limited prosocial emotions' specifier and differential diagnosis; ADHD comorbidity; antisocial personality disorder criterion C (paraphrased)",
      "WHO. ICD-11 CDDR (2024): 6C91 conduct-dissocial disorder",
      "NICE CG158 Antisocial behaviour and conduct disorders in children and young people (2013, updated 2017) 1.3.3-1.3.16, 1.5.1-1.5.14, 1.6.1-1.6.3",
      "NICE NG87 (2018, updated 2019) 1.2.1, 1.7.17, 1.7.23, 1.7.24, 1.8.19"
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Attachment difficulties and developmental trauma                    */
  /* ------------------------------------------------------------------ */
  {
    id: "attach",
    name: "Attachment difficulties and developmental trauma",
    group: "trauma",
    ages: "young",
    core: false,
    icd11: "6B44 reactive attachment disorder; 6B45 disinhibited social engagement disorder. Most children with attachment difficulties meet neither. 'Developmental trauma' is a descriptive term, not a diagnosis in ICD-11 or DSM-5-TR (see also 6B40 PTSD and 6B41 complex PTSD)",
    summary: "Children who have lived through neglect, abuse, frequent changes of carer or early institutional care may find it hard to trust adults, manage their feelings and feel safe. Watching for danger looks like distractibility, a body on alert looks restless, and fight-or-flight reactions look impulsive. Over-friendliness with strangers can look like social impulsivity. ADHD is also more common in these children, so the task is to work out what drives each behaviour, not to pick one label.",
    prevalence: "NICE NG87 1.2.1 lists looked-after children and young people as a group with a higher prevalence of ADHD. In the English and Romanian Adoptees study, young people who spent more than 6 months in severely depriving institutions met ADHD criteria far more often (19% at 15 years and 29.3% in young adulthood) than the low-deprivation group (5.6% and 3.8%) (Kennedy et al. 2016). Looked-after children in Britain have higher rates of nearly all psychiatric disorders than children living in private households (Ford et al. 2007).",
    coexist: "yes",
    coexistNote: "Both can be present. NICE NG26 1.3.2 lists ADHD among the conditions commonly associated with attachment difficulties that the assessment must cover, and 1.3.3 says to treat them in line with the relevant NICE guideline. DSM-5-TR says the over-familiar approach to strangers in disinhibited social engagement disorder is not limited to impulsivity as in ADHD (paraphrased). Only diagnose an attachment disorder when formal DSM or ICD criteria are met (NG26 1.3.6).",
    overlap: [
      "Poor concentration in class and missed instructions",
      "Restlessness, fidgeting and trouble settling",
      "Sudden outbursts, aggression or running off",
      "Poor sleep and nightmares",
      "Difficulty making and keeping friends",
      "Over-familiar or indiscriminate approach to adults",
      "Poor school progress and frequent school moves",
      "Rule-breaking and lying",
      "Low self-esteem"
    ],
    favoursADHD: [
      "Inattention and restlessness were present before the adverse experiences, or from early childhood in a stable placement",
      "Symptoms are similar in safe, calm and familiar settings, not only when stressed or reminded of the past",
      "Problems continue after a long period of stable, nurturing care",
      "Distractibility is drawn by anything new or interesting, not by scanning for danger",
      "A birth parent or sibling with ADHD, when the family history is known",
      "Forgetful, disorganised and careless on neutral tasks with no relationship demands"
    ],
    favoursAlt: [
      "Clear history of neglect, abuse, domestic abuse, many placements or early institutional care before the difficulties",
      "Hypervigilance: scans the room, watches adults' faces, startles easily",
      "Reactions are set off by reminders, transitions, contact visits or being told off, and are out of proportion to the event",
      "Better when the child feels safe with a consistent carer; worse with placement or staff changes",
      "Does not seek comfort from carers when hurt or upset, or accepts comfort from anyone",
      "Over-familiar with strangers, wanders off with unfamiliar adults, does not check back with carers",
      "Controlling, rejecting or role-reversed behaviour with carers",
      "Re-experiencing: nightmares, trauma play or intrusive memories (think of PTSD)",
      "Dissociation: 'switching off' or staring when stressed, with gaps in memory",
      "Lying driven by shame or fear, and difficulty accepting praise"
    ],
    ask: [
      "(Parent or carer) What do you know about their early life: who looked after them, any neglect, harm or separations, and how many moves?",
      "(Parent or carer) Were they restless or distractible before they came to you, in earlier placements or at nursery?",
      "(Parent or carer) When they are hurt or upset, do they come to you for comfort, push you away, or go to anyone?",
      "(Parent or carer) How do they behave with strangers? Do they go off with people they do not know, or check back with you?",
      "(Parent or carer) What sets off the big reactions: being told off, changes, contact visits, or particular smells, sounds or people?",
      "(Parent or carer) Are they jumpy, watchful or always on the lookout? Do they startle easily?",
      "(Parent or carer) Do they seem to 'go blank', stare or switch off when stressed? Do they remember it afterwards?",
      "(Parent or carer) How has their behaviour changed since they have been with you? Does it get worse around moves or new staff?",
      "(Parent or carer) Have they had nightmares, or played out frightening events?",
      "(Teacher) Is their attention worse after contact visits, changes of staff, or at the start of the week?",
      "(Teacher) In a calm room with a trusted adult, can they focus and settle?",
      "(Teacher) Do they watch the adults and the door rather than the work?",
      "(Young person) When you can't concentrate, what is going on in your head: worry about what might happen, memories, or your mind just jumping around?",
      "(Young person) Are there places or people where you feel safe? Is concentrating easier there?",
      "(Social worker) What does the file show about early care, placement moves and any previous assessments?"
    ],
    features: [
      { id: "attach_f1", t: "Neglect, abuse, domestic abuse or early institutional care before the difficulties began", w: 3 },
      { id: "attach_f2", t: "Many placement or carer changes", w: 2 },
      { id: "attach_f3", t: "Clearly worse with reminders, transitions, contact or relationship stress, and better when feeling safe", w: 3 },
      { id: "attach_f4", t: "Hypervigilance and exaggerated startle", w: 2 },
      { id: "attach_f5", t: "Does not seek or accept comfort from carers when distressed", w: 3 },
      { id: "attach_f6", t: "Over-familiar with unfamiliar adults, goes off with strangers, does not check back with carers", w: 3 },
      { id: "attach_f7", t: "Controlling, rejecting or role-reversed behaviour with carers", w: 2 },
      { id: "attach_f8", t: "Re-experiencing: nightmares, trauma play or intrusive memories", w: 2 },
      { id: "attach_f9", t: "Dissociative episodes: blank staring or 'switching off' under stress", w: 2 },
      { id: "attach_f10", t: "No inattention or hyperactivity reported before the adversity, or in a stable early setting", w: 2 },
      { id: "attach_f11", t: "Steady improvement with consistent, nurturing care", w: 1 },
      { id: "attach_f12", t: "Social care or post-adoption records describe attachment concerns", w: 1 }
    ],
    screen: [],
    investigations: [
      "Read the social care, adoption or looked-after health records: early history, placements, maltreatment, previous assessments and any SDQs on file (looked-after children aged 4-16 in England have a carer SDQ each year)",
      "Comprehensive assessment in line with NICE NG26 1.3.2: attachment pattern and relationships, placement history, education, carers' sensitivity, parental factors, maltreatment or trauma, physical health and coexisting conditions, including ADHD",
      "Attachment assessment, when needed, by a service with specialist expertise (NG26 1.3.8). Tools such as the Child Attachment Interview (ages 7-15) need trained staff (NG26 1.3.4-1.3.5)",
      "Assess for PTSD and other trauma reactions; NICE NG116 covers PTSD in children and young people",
      "Observe in more than one setting, ideally including one where the child feels safe (NICE NG87 1.3.2)",
      "Think of FASD when there is a care or adoption history with possible prenatal alcohol exposure (NICE QS204)",
      "Do not use genetic tests to predict or identify attachment difficulties (NG26 1.3.7)"
    ],
    redFlags: [
      "Current abuse, neglect or domestic abuse: follow safeguarding procedures the same day",
      "Going missing, unexplained gifts or money, older 'friends': think of sexual or criminal exploitation",
      "Over-friendliness with strangers that puts the child at risk: agree a safety plan with carers and school",
      "Self-harm, suicidal thoughts or severe dissociation: assess risk and refer to CAMHS",
      "Placement at risk of breaking down: urgent multi-agency support (NG26 1.1.10, 1.1.14)"
    ],
    decide: {
      better: "Attachment difficulties or trauma better explain the picture when the attention and activity problems began after the adversity, are driven by threat, reminders and relationships, are much better when the child feels safe, and there is no sign of ADHD symptoms before the adversity or in a stable, calm setting. Record the attachment or trauma formulation and do not count threat-driven behaviours toward ADHD.",
      both: "Diagnose ADHD as well when inattention and/or hyperactivity-impulsivity show across settings, including safe, calm and familiar ones, and persist after a period of stable, nurturing care. This is common after early deprivation (Kennedy et al. 2016). NG26 1.3.3 asks for coexisting ADHD to be treated in line with NG87.",
      next: "Do not treat attachment difficulties with medicine (NG26 1.1.20). Refer for attachment-focused help through a service with specialist expertise (NG26 1.3.8), for example parental sensitivity and behaviour training or video feedback programmes for carers (NG26 sections 1.4 and 1.5). Offer trauma-focused CBT if there are signs of PTSD after maltreatment (NG26 1.4.12; NICE NG116). If ADHD is also diagnosed, treat it in line with NG87, check who holds parental responsibility before consent (care order or section 20 accommodation), and titrate more slowly and monitor more often if PTSD is present (NG87 1.7.28)."
    },
    pearls: [
      "Ask what the behaviour is for. Scanning the room is watching for danger; an outburst after being told off may be shame. ADHD distractibility follows interest, not threat.",
      "Look at the timeline. Behaviour that came before the adversity, or was seen in a calm, stable early placement, points to ADHD.",
      "Compare safe and unsafe settings. Trauma-driven behaviour changes with how safe the child feels; ADHD is more constant.",
      "Over-friendliness with strangers is not ADHD impulsivity. DSM-5-TR keeps the two apart: disinhibited social engagement is reduced wariness of strangers, not general impulsivity.",
      "Do not wait for a stable placement before helping: NG26 1.1.5 says placement stability must not decide whether services are offered. Do review the ADHD question again once things settle.",
      "Children who are adopted or in care may also have prenatal alcohol exposure, preterm birth and language delay. Look for these together.",
      "Write carefully. Avoid 'attachment disorder' unless criteria are met (NG26 1.3.6); 'attachment difficulties' or a trauma-informed formulation is usually more accurate."
    ],
    refs: [
      "NICE NG26 Children's attachment: attachment in children and young people who are adopted from care, in care or at high risk of going into care (2015) 1.1.5, 1.1.10, 1.1.14, 1.1.20, 1.3.2-1.3.8, 1.4.12",
      "NICE NG87 (2018, updated 2019) 1.2.1, 1.3.2, 1.7.28",
      "NICE NG116 Post-traumatic stress disorder (2018); NICE NG205 Looked-after children and young people (2021)",
      "APA. DSM-5-TR (2022): reactive attachment disorder and disinhibited social engagement disorder, differential diagnosis with ADHD (paraphrased)",
      "WHO. ICD-11 CDDR (2024): 6B44 reactive attachment disorder; 6B45 disinhibited social engagement disorder",
      "Kennedy M et al. Early severe institutional deprivation is associated with a persistent variant of adult ADHD. J Child Psychol Psychiatry 2016;57:1113-25",
      "Sonuga-Barke EJS et al. Child-to-adult neurodevelopmental and mental health trajectories after early life deprivation: the English and Romanian Adoptees study. Lancet 2017;389:1539-48",
      "Ford T et al. Psychiatric disorder among British children looked after by local authorities. Br J Psychiatry 2007;190:319-25"
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Developmental language disorder                                     */
  /* ------------------------------------------------------------------ */
  {
    id: "dld",
    name: "Developmental language disorder (DLD)",
    group: "neurodevelopmental",
    ages: "young",
    core: false,
    icd11: "6A01.2 (6A01.20 receptive and expressive; 6A01.21 mainly expressive; 6A01.22 mainly pragmatic; 6A01.23 other specified language impairment)",
    summary: "A lasting difficulty understanding or using spoken language that is not explained by hearing loss or a known biomedical condition (CATALISE). A child who cannot follow long or complex instructions looks as if they are not listening, drifts off during class talk and may act out from frustration. The language problem is often hidden because everyday chat sounds fine. DLD and ADHD often occur together.",
    prevalence: "About 7.6% of children starting school had language disorder of unknown origin in a UK population study (Norbury et al. 2016, Surrey reception classes). Children aged 6-8 with ADHD had nearly 3 times the odds of language problems compared with controls (adjusted odds ratio 2.8; Sciberras et al. 2014). In a meta-analysis of children with emotional and behavioural disorders, 81% had below-average language that had not been identified (Hollo et al. 2014).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. CATALISE agreed that DLD can co-occur with other neurodevelopmental disorders such as ADHD, that risk factors do not rule DLD out, and that DLD does not need a gap between verbal and non-verbal ability. Count 'does not seem to listen' or 'does not follow instructions' toward ADHD only when poor understanding does not explain it (DSM-5-TR criterion A note: not only a failure to understand instructions).",
    overlap: [
      "Does not seem to listen when spoken to",
      "Does not follow instructions or finish work",
      "Drifts off during whole-class teaching, stories and assemblies",
      "Talks over others or answers before the question is finished",
      "Frustration, outbursts and behaviour problems in class",
      "Poor reading comprehension and written work",
      "Friendship difficulties",
      "Forgets what was said"
    ],
    favoursADHD: [
      "Understands complex language well when interested, for example following the plot of a film or a long story",
      "Attention also wanders during visual, practical or hands-on tasks that need little language",
      "Can repeat an instruction back correctly, then forgets or gets distracted before doing it",
      "Vocabulary, grammar and story-telling are in line with age on assessment",
      "Talks a lot, interrupts and blurts out, in fluent, well-formed sentences",
      "Restlessness and fidgeting in all settings, not only during talk"
    ],
    favoursAlt: [
      "Late to talk or to put words together; earlier speech and language therapy",
      "Struggles with longer or complex instructions even when fully attending, and copies other children instead",
      "Small vocabulary, word-finding pauses, simple sentences or grammar errors for age",
      "Retelling a story or explaining an event is muddled or very short",
      "Attention is much better on visual, practical or one-to-one tasks with simple language",
      "Says 'yes' or nods without understanding; answers a different question from the one asked",
      "Trouble with jokes, idioms, inference or abstract words (also think of pragmatic difficulties or autism)",
      "Family history of language or literacy difficulties",
      "Behaviour problems mainly in talk-heavy lessons"
    ],
    ask: [
      "(Parent) When did they say their first words and start putting words together? Did anyone worry about their talking?",
      "(Parent) Have they ever seen a speech and language therapist? What was found?",
      "(Parent) If you give a two- or three-step instruction, can they do it when they are calm and looking at you?",
      "(Parent) Can they tell you clearly, and in order, what happened at school today?",
      "(Parent) Can they follow a TV programme or a story read to them, and tell you what happened?",
      "(Parent) Do they get stuck finding words, or use 'thing' and 'stuff' a lot?",
      "(Parent) Does anyone else in the family have difficulties with talking, reading or spelling?",
      "(Parent) Is English their first language? How do they manage in the language spoken at home?",
      "(Teacher) Is their attention worse in talk-heavy lessons than in practical or visual ones?",
      "(Teacher) Do they watch other children to work out what to do after an instruction?",
      "(Teacher) How do their vocabulary, sentences and reading comprehension compare with the class?",
      "(Teacher) If you check understanding one-to-one in simple words, can they then do the task?",
      "(Young person) When the teacher talks for a long time, what happens: the words get confusing, or your mind goes somewhere else?",
      "(Young person) Do you sometimes not understand what people mean, even when you are listening hard?",
      "(Young person) Is it easier when things are shown or written down?"
    ],
    features: [
      { id: "dld_f1", t: "Late language milestones, or earlier speech and language therapy for language (not only speech sounds)", w: 3 },
      { id: "dld_f2", t: "Struggles with long or complex instructions even when fully attending", w: 3 },
      { id: "dld_f3", t: "Speech and language therapy assessment shows language below age expectations", w: 3 },
      { id: "dld_f4", t: "Small vocabulary, word-finding problems or grammar errors for age", w: 2 },
      { id: "dld_f5", t: "Attention much better on visual, practical or one-to-one tasks with simple language", w: 2 },
      { id: "dld_f6", t: "Muddled or very short retelling of events or stories", w: 2 },
      { id: "dld_f7", t: "Copies peers to work out what to do; nods or says yes without understanding", w: 2 },
      { id: "dld_f8", t: "No restlessness or distractibility in activities with little language", w: 2 },
      { id: "dld_f9", t: "Behaviour problems mainly in talk-heavy lessons", w: 1 },
      { id: "dld_f10", t: "Family history of language or literacy difficulties", w: 1 },
      { id: "dld_f11", t: "Poor reading comprehension with adequate word reading", w: 1 }
    ],
    screen: [],
    investigations: [
      "Hearing test (audiology), especially after glue ear or repeated ear infections, before drawing conclusions",
      "Referral to speech and language therapy for a language assessment with standardised tests and observation. The therapist chooses the tests; parent checklists such as the Children's Communication Checklist-2 are aids, not diagnoses",
      "Ask school for the SENCO's view, any early-years language screening, and samples of work",
      "For children learning English as an additional language, find out how they manage in the home language, with an interpreter if needed (Clinical practice)",
      "Cognitive assessment if a wider learning difficulty is possible; DLD does not need a gap between verbal and non-verbal ability (CATALISE)",
      "Think of autism when difficulties with the social use of language (pragmatics) stand out",
      "Adapt your own interview: short sentences, one question at a time, visual supports, and check understanding. NICE NG87 1.4.5 asks for information in a form that takes account of delays in language development"
    ],
    redFlags: [
      "Loss of language skills the child once had: urgent paediatric or neurological review (think of epilepsy, including acquired epileptic aphasia, or a neurodegenerative condition)",
      "No response to name or sounds, or fluctuating hearing with ear infections: hearing assessment first",
      "Language problems with signs of autism or global developmental delay: refer to the neurodevelopmental pathway",
      "Exclusion or youth justice contact with unrecognised language needs: ask for speech and language therapy input so that the young person understands what is happening (Clinical practice)",
      "Frustration leading to self-harm or withdrawal: assess mood and risk"
    ],
    decide: {
      better: "DLD better explains the picture when 'not listening', not following instructions and drifting off happen mainly with spoken language, attention is ordinary on visual, practical or hands-on tasks, and there is clear evidence of a language disorder from the history and a formal assessment. Do not count failures of understanding toward ADHD (DSM-5-TR criterion A note).",
      both: "Diagnose both when inattention and/or hyperactivity-impulsivity show in situations with little language demand (play, practical tasks, outings, screen time) and across settings, and a language disorder is also confirmed. CATALISE accepts co-occurrence with ADHD, and children with both have poorer reading and maths than children with ADHD alone (Sciberras et al. 2014), so both need a plan.",
      next: "Refer to speech and language therapy and, with consent, share the findings with school (NICE NG87 1.4.12). Ask school to adapt teaching: short instructions, visual supports and checking understanding. If ADHD is also treated, review language and learning separately: medicine may help attention but will not treat the language disorder (Clinical practice)."
    },
    pearls: [
      "Ask the child to repeat an instruction back. If they can repeat it but do not do it, think attention. If they cannot repeat or explain it, think language.",
      "Everyday chat can sound fine. DLD shows with longer instructions, abstract words, inference and retelling events.",
      "Many children with behaviour problems have language difficulties nobody has spotted (Hollo et al. 2014). Check language in every child referred for behaviour and 'not listening'.",
      "Check hearing first: fluctuating hearing from glue ear can look like both inattention and a language disorder (Clinical practice).",
      "Learning two languages does not cause DLD. A child who also struggles in the home language may have DLD; a child who is fluent in the home language probably does not (Clinical practice).",
      "Adapt the assessment itself: short sentences, one question at a time, pictures or written prompts. Otherwise the interview can miss symptoms or produce false 'yes' answers.",
      "Speech and language are different. Unclear speech sounds on their own are not DLD."
    ],
    refs: [
      "Bishop DVM et al. CATALISE: a multinational and multidisciplinary Delphi consensus study. Identifying language impairments in children. PLoS One 2016;11:e0158753",
      "Bishop DVM et al. Phase 2 of CATALISE: a multinational and multidisciplinary Delphi consensus study of problems with language development: terminology. J Child Psychol Psychiatry 2017;58:1068-80",
      "Norbury CF et al. The impact of nonverbal ability on prevalence and clinical presentation of language disorder: evidence from a population study. J Child Psychol Psychiatry 2016;57:1247-57",
      "Sciberras E et al. Language problems in children with ADHD: a community-based study. Pediatrics 2014;133:793-800",
      "Hollo A, Wehby JH, Oliver RM. Unidentified language deficits in children with emotional and behavioral disorders: a meta-analysis. Exceptional Children 2014;80:169-86",
      "WHO. ICD-11 CDDR (2024): 6A01.2 developmental language disorder",
      "APA. DSM-5-TR (2022): language disorder; ADHD criterion A note (paraphrased)",
      "NICE NG87 (2018, updated 2019) 1.4.5, 1.4.12; NICE CG158 1.3.11"
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Fetal alcohol spectrum disorder                                     */
  /* ------------------------------------------------------------------ */
  {
    id: "fasd",
    name: "Fetal alcohol spectrum disorder (FASD)",
    group: "neurodevelopmental",
    ages: "young",
    core: false,
    icd11: "No single ICD-11 code for FASD. LD2F.00 fetal alcohol syndrome covers the form with the characteristic facial features; otherwise record the neurodevelopmental findings. DSM-5-TR lists neurobehavioural disorder associated with prenatal alcohol exposure as a condition for further study",
    summary: "Lifelong brain-based difficulties caused by alcohol exposure before birth. Many people with FASD do not have the characteristic facial features. Inattention, impulsivity and hyperactivity are common, usually within a wider pattern of difficulty with learning, memory, language, planning, emotional control and everyday skills. FASD explains why the difficulties are there rather than competing with ADHD: when ADHD criteria are met, ADHD is diagnosed alongside it.",
    prevalence: "ADHD was found in about 50% of people with FASD in a systematic review of 26 studies, about 10 times the expected rate (Weyrauch et al. 2017). In a UK birth cohort (ALSPAC, Bristol), 6-17% of children screened positive for FASD depending on the method used; this is a screening estimate, not a diagnosed rate (McQuire et al. 2019).",
    coexist: "yes",
    coexistNote: "ADHD is common in FASD and is diagnosed alongside it when criteria are met (UK ADHD Partnership consensus, Young et al. 2016). SIGN 156 assesses attention and executive function (which includes impulse control and hyperactivity) as two of the 10 areas used to diagnose FASD. FASD is not named in NICE NG87 1.2.1, but looked-after children are.",
    overlap: [
      "Inattention, distractibility and poor concentration",
      "Hyperactivity and impulsivity",
      "Poor planning, organisation and working memory",
      "Learning difficulties and slow school progress",
      "Emotional outbursts and poor self-control",
      "Social problems and being easily led",
      "Behaviour that does not improve with the usual strategies"
    ],
    favoursADHD: [
      "No known or probable prenatal alcohol exposure, and no facial features or growth problems",
      "Difficulties are mainly attention, activity and impulsivity, with thinking, language, memory and everyday skills in the expected range",
      "A biological parent or sibling with ADHD",
      "Learns from consequences and routines once attention is supported",
      "Growth and head size in the typical range",
      "Clear benefit from usual ADHD strategies and support"
    ],
    favoursAlt: [
      "Confirmed or probable prenatal alcohol exposure (birth parent's report, records, or alcohol-related problems during the pregnancy)",
      "All 3 sentinel facial features: short palpebral fissures (eye openings), smooth philtrum (groove above the lip) and thin upper lip (SIGN 156)",
      "Small head (microcephaly), poor growth, or other birth defects such as heart, eye or hearing problems",
      "A wide pattern of difficulty: memory, language, learning, motor skills and everyday living skills, not only attention",
      "Does not learn from consequences, repeats the same mistakes, and cannot carry a rule from one situation to another",
      "Social naivety: very trusting, easily led, misreads other people's intentions",
      "Everyday skills (self-care, money, time, keeping safe) well below age",
      "Care, adoption or kinship care history with known alcohol use in the pregnancy",
      "A brother or sister diagnosed with FASD"
    ],
    ask: [
      "(Birth parent) Asked kindly and routinely: was there any alcohol during the pregnancy, including before you knew you were pregnant? How much, and how often?",
      "(Parent or carer) Do the records, health visitor notes or social care files mention alcohol in the pregnancy?",
      "(Parent or carer) Was your child born small or early, or with a small head? Any heart, eye or hearing problems?",
      "(Parent or carer) As a baby or toddler, were there feeding, sleep or developmental worries?",
      "(Parent or carer) Apart from attention, are there problems with memory, learning, coordination, language or understanding?",
      "(Parent or carer) Do they learn from mistakes, or repeat the same mistake even after consequences?",
      "(Parent or carer) Can they use a rule learned in one place somewhere else?",
      "(Parent or carer) How are their everyday skills compared with others their age: dressing, money, time, keeping safe?",
      "(Parent or carer) Are they very trusting or easily led by others?",
      "(Parent or carer) Has a brother or sister been diagnosed with FASD or had similar difficulties?",
      "(Teacher) Do they learn something one day and lose it the next? Do they need the same instruction many times?",
      "(Teacher) Is attention the main problem, or also memory, understanding, maths and organisation?",
      "(Young person) What is hardest for you at school and at home: remembering, understanding, or keeping your attention on things?",
      "(Social worker) What does the file say about the pregnancy, alcohol use and early development?"
    ],
    features: [
      { id: "fasd_f1", t: "Confirmed prenatal alcohol exposure (reliable report, records or alcohol treatment during the pregnancy)", w: 3 },
      { id: "fasd_f2", t: "All 3 sentinel facial features (short palpebral fissures, smooth philtrum, thin upper lip)", w: 3 },
      { id: "fasd_f3", t: "Severe impairment in 3 or more neurodevelopmental areas on formal assessment", w: 3 },
      { id: "fasd_f4", t: "Microcephaly or growth restriction", w: 2 },
      { id: "fasd_f5", t: "Difficulties well beyond attention: memory, language, motor, learning and everyday skills", w: 2 },
      { id: "fasd_f6", t: "Does not learn from consequences or carry rules between settings", w: 2 },
      { id: "fasd_f7", t: "Everyday living and safety skills well below age", w: 2 },
      { id: "fasd_f8", t: "Social naivety; easily led or exploited", w: 1 },
      { id: "fasd_f9", t: "Birth defects linked with FASD (heart, eye, hearing, palmar creases, joints)", w: 1 },
      { id: "fasd_f10", t: "Brother or sister with FASD", w: 1 },
      { id: "fasd_f11", t: "Care or adoption history with known alcohol use in the pregnancy", w: 1 }
    ],
    screen: [],
    investigations: [
      "Record prenatal alcohol exposure as confirmed, confirmed absent or unknown, from the birth parent's report, health records or social care files. Ask sensitively and without blame (SIGN 156 2.1; NICE QS204 statements 2-3)",
      "If prenatal alcohol exposure is probable and there are significant physical, developmental or behavioural difficulties, refer for assessment by a professional with additional training in FASD, usually in community paediatrics, a child development centre or CAMHS (NICE QS204 statement 3; SIGN 156 2.1.4)",
      "Multidisciplinary neurodevelopmental assessment across 10 areas: motor skills, neuroanatomy or neurophysiology, cognition, language, academic achievement, memory, attention, executive function (including impulse control and hyperactivity), affect regulation, and adaptive behaviour, social skills or social communication. FASD needs severe impairment in 3 or more (QS204 statement 4; SIGN 156 3.4)",
      "Physical examination including growth, head circumference and the 3 sentinel facial features, with a family, social and medical history (SIGN 156 3.2-3.3)",
      "Consider genetic causes, especially when exposure is uncertain or the features are atypical (SIGN 156 3.1)",
      "Hearing and vision checks"
    ],
    redFlags: [
      "Exploitation or abuse linked to social naivety: follow safeguarding procedures",
      "Current alcohol misuse in the household, or a parent who is pregnant and drinking: safeguarding and support for the family",
      "Young people in youth justice or care whose needs seem underestimated: SIGN 156 3.6 asks staff to be aware of higher rates of prenatal alcohol exposure in these groups and to refer for assessment",
      "Self-harm or suicidal thoughts: assess risk",
      "A placement breaking down because behaviour does not respond to usual strategies: multi-agency review"
    ],
    decide: {
      better: "FASD alone better explains the picture when there is confirmed prenatal alcohol exposure (or all 3 facial features), a wide pattern of neurodevelopmental impairment, and the attention and activity problems do not meet ADHD criteria or are part of a broader impairment. Record FASD, or 'at risk for neurodevelopmental disorder and FASD, associated with prenatal alcohol exposure', as SIGN 156 describes.",
      both: "Diagnose ADHD as well when ADHD criteria are met. FASD explains why the difficulties are there; it does not answer whether ADHD is present. Having both is the usual situation (Weyrauch et al. 2017; Young et al. 2016).",
      next: "Refer for FASD assessment where indicated (QS204 statement 3), but do not hold back the ADHD decision while waiting. If ADHD medicine is used, titrate more slowly and monitor more often, as for other neurodevelopmental disorders (NICE NG87 1.7.28). Make sure there is a management plan shared with school and social care (QS204 statement 5)."
    },
    pearls: [
      "Ask about alcohol in pregnancy routinely and kindly in every child assessment. Asking only when you already suspect FASD misses most cases.",
      "No facial features does not mean no FASD. Many affected children look typical (NICE QS204).",
      "Think of FASD when ADHD-like problems come with poor memory, poor learning from consequences and everyday skills far below age.",
      "Adopted, fostered and kinship-care children are at higher risk. The social care file may hold the alcohol history that the carers do not know.",
      "SIGN 156 scores hyperactivity and impulse control under executive function, not under attention, when it counts the 10 areas.",
      "In fetal alcohol syndrome, conduct disorder and receptive and expressive language disorder are among the commonest coexisting conditions (Popova et al. 2016). Look for them too.",
      "A diagnosis helps family and school adjust expectations: concrete instructions, routines, supervision and repetition (Clinical practice)."
    ],
    refs: [
      "SIGN 156. Children and young people exposed prenatally to alcohol (2019): sections 2.1, 3.1-3.4, 3.6",
      "NICE QS204 Fetal alcohol spectrum disorder (2022): quality statements 2-5",
      "NICE NG87 (2018, updated 2019) 1.2.1, 1.7.28",
      "Young S et al. Guidelines for identification and treatment of individuals with ADHD and associated fetal alcohol spectrum disorders based upon expert consensus. BMC Psychiatry 2016;16:324",
      "Weyrauch D et al. Comorbid mental disorders in fetal alcohol spectrum disorders: a systematic review. J Dev Behav Pediatr 2017;38:283-91",
      "Popova S et al. Comorbidity of fetal alcohol spectrum disorder: a systematic review and meta-analysis. Lancet 2016;387:978-87",
      "McQuire C et al. Screening prevalence of fetal alcohol spectrum disorders in a region of the United Kingdom: a population-based birth-cohort study. Prev Med 2019;118:344-51",
      "WHO. ICD-11: LD2F.00 fetal alcohol syndrome. APA. DSM-5-TR (2022): neurobehavioural disorder associated with prenatal alcohol exposure (conditions for further study)"
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Relative age and developmental immaturity                           */
  /* ------------------------------------------------------------------ */
  {
    id: "relage",
    name: "Relative age and developmental immaturity (youngest in the school year)",
    group: "other",
    ages: "young",
    core: false,
    icd11: "None: not a disorder. ICD-11 6A05 needs symptoms outside the normal variation expected for age and intellectual level; DSM-5-TR needs symptoms inconsistent with developmental level",
    summary: "The youngest children in a school year can be almost a year younger than the oldest. Their attention, sitting still and self-control are judged against older classmates, so normal immaturity can look like ADHD, especially in teacher reports. In many countries, the youngest children in the year are more likely to be diagnosed with and treated for ADHD. Judge symptoms against the child's own age, not the class average.",
    prevalence: "In over a million UK children (CPRD primary care records), the youngest quarter of the school year was more likely to be diagnosed with ADHD than the oldest quarter (adjusted hazard ratio 1.36; Root et al. 2019). A meta-analysis of 32 studies found relative risks of 1.38 for diagnosis and 1.28 for medication in the relatively youngest; the age effect showed in teacher ratings but not in parent ratings (Frisira et al. 2025). The effect is the norm internationally, including where prescribing is low (Whitely et al. 2019).",
    coexist: "no",
    coexistNote: "Not a co-diagnosis. Being young for the year does not cause or prevent ADHD; it raises the risk that ordinary immaturity is mistaken for ADHD. A young-for-year child can still have ADHD when symptoms are clearly beyond their own age, pervasive and impairing.",
    overlap: [
      "Restless and fidgety on the carpet or at the desk",
      "Short attention span for teacher-led tasks",
      "Calls out, interrupts and finds it hard to wait",
      "Behind classmates in reading, writing and number work",
      "Tires easily and becomes silly or upset late in the day",
      "Less organised than classmates; loses things",
      "Bigger emotional reactions than classmates"
    ],
    favoursADHD: [
      "Symptoms are clearly beyond what is expected for the child's own age, not just compared with older classmates",
      "Parents and other adults outside school describe the same problems (relative age effects show mainly in teacher ratings)",
      "Problems are present at home, at clubs and with friends, not only in the classroom",
      "Symptoms continue or grow as the child moves up the years and the age gap matters less",
      "Rating scales are raised when scored against norms for the child's exact age",
      "Classmates with similar birthdays are coping"
    ],
    favoursAlt: [
      "Born in the last months before the school-year cut-off: summer, especially August, in England and Wales; January or February in Scotland, where deferred entry is possible; April to 1 July in Northern Ireland",
      "Concerns come mainly from school, while parents describe a child who is typical for their age",
      "Behaviour is within the expected range when compared with children of the same age rather than the same class",
      "Problems were greatest in Reception and early primary, and are easing year by year",
      "Learning is behind classmates but progressing steadily at the child's own pace",
      "Improves with age-appropriate expectations: shorter tasks, movement breaks, more adult support",
      "Rating scales fall within the normal range when scored with norms for the child's exact age",
      "Problems are limited to structured, teacher-led tasks"
    ],
    ask: [
      "(Parent) What is your child's date of birth, and which school year are they in? Have they ever repeated or skipped a year, or started school earlier or later than usual?",
      "(Parent) Compared with children of the same age (not the same class), such as cousins, neighbours or children at clubs, do they stand out?",
      "(Parent) At home, at clubs and on outings, are the same difficulties there?",
      "(Parent) Have things been getting better, worse or staying the same as they move up the years?",
      "(Parent) Did the problems start when school started, or before, at nursery or at home?",
      "(Parent) Who first raised the concern: you, school or someone else?",
      "(Teacher) How old is this child compared with the class? Are the other youngest children in the class behaving in a similar way?",
      "(Teacher) Compared with a typical child of exactly this age, not with the class average, how far out of line is the behaviour?",
      "(Teacher) If this child were in the year below, would they stand out?",
      "(Teacher) Does the behaviour improve with shorter tasks, movement breaks or more adult support?",
      "(Teacher) Is the child making steady progress at their own pace, even if behind older classmates?",
      "(Teacher) Did previous teachers see the same things, and has it changed over time?",
      "(Young person) Do you find lessons harder than your friends do? What is hard?"
    ],
    features: [
      { id: "relage_f1", t: "Youngest in the year group (born in the last 3 months before the school-year cut-off)", w: 2 },
      { id: "relage_f2", t: "Concerns mainly from school; parents and other adults describe typical behaviour for age", w: 3 },
      { id: "relage_f3", t: "Behaviour within the expected range when compared with children of the same age, not the same class", w: 3 },
      { id: "relage_f4", t: "Problems mainly in structured, teacher-led tasks; fine at home, at clubs and in play", w: 2 },
      { id: "relage_f5", t: "Difficulties easing year by year as the child moves up", w: 2 },
      { id: "relage_f6", t: "Improves with age-appropriate expectations (shorter tasks, movement breaks, support)", w: 2 },
      { id: "relage_f7", t: "Rating scales within the normal range when scored with norms for the child's exact age", w: 2 },
      { id: "relage_f8", t: "Steady learning progress at own pace, though behind older classmates", w: 1 },
      { id: "relage_f9", t: "Other young-for-year classmates show similar behaviour", w: 1 }
    ],
    screen: [],
    investigations: [
      "Record the date of birth and the actual school year group, and note any delayed or early entry, repeated year or placement outside the usual year group (Clinical practice)",
      "Score rating scales with norms for the child's exact age and sex where the scale provides them (for example the Conners 4 or ADHD-RS-5), and compare parent with teacher ratings",
      "School observation, ideally including unstructured time, when symptoms are in doubt (NICE NG87 1.3.2)",
      "Information from more than one setting: home, clubs and wider family (NICE NG87 1.3.3 needs symptoms in 2 or more important settings)",
      "When impairment is not severe and the picture is unclear, put school adjustments in place and plan a review (Clinical practice; NICE NG87 1.2.7 describes watchful waiting of up to 10 weeks before referral)",
      "Check developmental history, language, learning and hearing, which also lag in younger children"
    ],
    redFlags: [
      "Severe impairment, risk to safety or exclusion: do not put it down to immaturity; assess fully (NICE NG87 1.2.8)",
      "Low mood or self-esteem from constant comparison with older classmates: relative youth is also linked with depression diagnosis (Root et al. 2019)",
      "Pressure to start medicine because of school concerns alone: medicine only after environmental changes have been made and reviewed (NICE NG87 1.5.13)",
      "Global delay rather than relative immaturity: think of intellectual disability or another developmental condition"
    ],
    decide: {
      better: "Relative age and normal immaturity better explain the picture when the child is young for the year, concerns come mainly from school, the behaviour is within the normal range for the child's own age, it is not pervasive across settings, and it is easing over time or with age-appropriate expectations. Record the reasons and advise school on reasonable expectations.",
      both: "Not a co-diagnosis. A young-for-year child has ADHD when symptoms are clearly beyond their own developmental level (DSM-5-TR; ICD-11 normal variation for age; NICE NG87 1.3.5 adjusts criteria for age-appropriate behaviour), present in 2 or more settings including outside school, and causing at least moderate impairment (NICE NG87 1.3.3).",
      next: "Explain the relative age effect to the family and school. Suggest age-appropriate adjustments (shorter tasks, movement breaks, adult support) and plan a review, for example after a term, with fresh ratings from home and school scored against age norms. Medicine is offered only after environmental changes have been made and reviewed (NICE NG87 1.5.13)."
    },
    pearls: [
      "Always write the date of birth next to the school year. The same behaviour means something different in a child who has just turned 5 and one who is nearly 6.",
      "Compare with age, not class. Ask the teacher: 'If this child were in the year below, would they stand out?'",
      "Teacher ratings show the relative age effect; parent ratings do not (Frisira et al. 2025). A big gap between parent and teacher in a young-for-year child is a clue.",
      "The effect is international and is not just a sign of high prescribing: Whitely et al. (2019) found it even where prescribing is low.",
      "In US states with a 1 September cut-off, August-born children were diagnosed more often than September-born children (85.1 against 63.6 per 10,000; Layton et al. 2018).",
      "Relative youth is also linked with diagnoses of intellectual disability and depression (Root et al. 2019). It affects how many difficulties are judged, not only ADHD.",
      "Relative age does not rule ADHD out. Real ADHD in a young-for-year child is missed if every concern is put down to age."
    ],
    refs: [
      "Root A et al. Association of relative age in the school year with diagnosis of intellectual disability, attention-deficit/hyperactivity disorder, and depression. JAMA Pediatr 2019;173:1068-75",
      "Frisira E, Holland J, Sayal K. Systematic review and meta-analysis: relative age in attention-deficit/hyperactivity disorder and autism spectrum disorder. Eur Child Adolesc Psychiatry 2025;34:381-401 (online 2024)",
      "Whitely M et al. Annual Research Review: ADHD late birthdate effect common in both high and low prescribing international jurisdictions: a systematic review. J Child Psychol Psychiatry 2019;60:380-91",
      "Layton TJ et al. Attention deficit-hyperactivity disorder and month of school enrollment. N Engl J Med 2018;379:2122-30",
      "Holland J, Sayal K. Relative age and ADHD symptoms, diagnosis and medication: a systematic review. Eur Child Adolesc Psychiatry 2019;28:1417-29",
      "NICE NG87 (2018, updated 2019) 1.2.7, 1.2.8, 1.3.2, 1.3.3, 1.3.5, 1.5.13",
      "WHO. ICD-11 CDDR (2024): 6A05 essential features. APA. DSM-5-TR (2022): ADHD criterion A (paraphrased)"
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Family, parenting or school environment                             */
  /* ------------------------------------------------------------------ */
  {
    id: "env",
    name: "Family stress, parenting or school environment as the main driver",
    group: "other",
    ages: "young",
    core: false,
    icd11: "None: not a mental disorder. Record the context with ICD-11 chapter 24 (factors influencing health status) or the DSM-5-TR 'other conditions that may be a focus of clinical attention', such as a parent-child relational problem or an educational problem",
    summary: "Children's attention and behaviour respond strongly to what is happening around them. Family stress (conflict, separation, domestic abuse, bereavement, money or housing worries, a parent's illness), inconsistent or harsh discipline, chaotic routines, too little sleep, bullying, or a class that does not meet the child's needs can all cause restlessness, poor concentration and defiance. When the environment is the main driver, the problems are tied to particular settings or periods and improve when things change. Stress can also make real ADHD worse, so both can be present.",
    prevalence: "No reliable figure: this is a formulation, not a diagnosis. NICE NG87 1.3.4 asks every assessment of a child or young person to cover family and educational circumstances and the parents' or carers' mental health, and NG87 1.3.3 needs symptoms in 2 or more important settings.",
    coexist: "sometimes",
    coexistNote: "Family and school stress do not exclude ADHD. Children with ADHD also put extra demands on parents and teachers, so cause and effect run both ways. NICE NG87 1.4.11 asks clinicians to explain that parent training does not imply bad parenting: children with ADHD have above-average parenting needs. Diagnose ADHD only when symptoms are pervasive across settings and persist when the environment is reasonably supportive.",
    overlap: [
      "Poor concentration and unfinished work",
      "Restlessness and trouble settling",
      "Defiance, outbursts and arguing",
      "Poor sleep and tiredness",
      "Falling behind at school",
      "Withdrawal or attention-seeking behaviour",
      "Frequent conflict at home",
      "High parent stress"
    ],
    favoursADHD: [
      "Symptoms began in early childhood and have been present through calm and stressful periods alike",
      "Present across settings: home, school, clubs, with grandparents or at the other parent's home",
      "Persist after the stress has eased and with consistent, warm routines in place",
      "Brothers and sisters raised in the same home do not show the same pattern, unless they also have ADHD",
      "A first-degree relative with ADHD",
      "Teachers in different years or schools report the same difficulties",
      "Parenting strategies that work for brothers and sisters do not work for this child"
    ],
    favoursAlt: [
      "Onset or clear worsening linked to a life event: separation, a new partner, a bereavement, a house move, a new school or a new baby",
      "Problems confined to one setting: one home, one class, one teacher or one school",
      "Domestic abuse, parental mental illness or substance misuse, or high conflict at home",
      "Inconsistent, harsh or very permissive discipline; few routines; little supervision",
      "Bullying, an unsuitable class placement or unmet learning needs at school",
      "Not enough sleep: late bedtimes, screens in the bedroom, shared or crowded sleeping space",
      "Hunger, poverty or housing insecurity",
      "Clear improvement after changes at home or school, or in a different setting such as a holiday or a grandparent's home",
      "The child talks about worry, sadness or unfairness rather than difficulty concentrating"
    ],
    ask: [
      "(Parent) When did you first notice the difficulties? What else was happening in the family then?",
      "(Parent) Have there been big changes: separation, a new partner, a death, a move, money worries, a new baby or someone unwell?",
      "(Parent) What is a normal school day like, from waking up to bedtime? What time do they fall asleep, and are there screens in the bedroom?",
      "(Parent) How do the adults at home handle difficult behaviour? Do you agree with each other on the rules?",
      "(Parent) Is it the same at the other parent's home, at grandparents' or on holiday?",
      "(Parent) How are you coping? Is anyone at home dealing with stress, low mood or other health problems?",
      "(Parent, seen alone) Is anyone at home ever frightened of someone else in the house?",
      "(Teacher) Is the behaviour the same in every lesson and with every adult, or mainly in some?",
      "(Teacher) Has anything changed at school: a new class, teacher, seat, friendship group, or bullying?",
      "(Teacher) Are their learning needs met in class? Is the work pitched at the right level?",
      "(Teacher) Did previous teachers have the same concerns?",
      "(Young person) Is anything worrying you at home or at school at the moment?",
      "(Young person) Is anyone hurting you, scaring you or being unkind to you, at home, at school or online?",
      "(Young person) Where do you find it easiest to concentrate? Where is it hardest?",
      "(Young person) How are you sleeping?"
    ],
    features: [
      { id: "env_f1", t: "Onset or clear worsening linked to a family or school event", w: 3 },
      { id: "env_f2", t: "Problems confined to one setting (one home, one class or one teacher)", w: 3 },
      { id: "env_f3", t: "Clear improvement when the situation changes or in a different setting", w: 3 },
      { id: "env_f4", t: "Domestic abuse, high conflict, or parental mental illness or substance misuse at home", w: 2 },
      { id: "env_f5", t: "Inconsistent, harsh or very permissive discipline; few routines", w: 2 },
      { id: "env_f6", t: "Bullying, unsuitable placement or unmet learning needs at school", w: 2 },
      { id: "env_f7", t: "Too little or disrupted sleep", w: 2 },
      { id: "env_f8", t: "No reports of inattention or hyperactivity before the stress began", w: 2 },
      { id: "env_f9", t: "Poverty, hunger or housing insecurity", w: 1 },
      { id: "env_f10", t: "The child describes worry, sadness or unfairness rather than difficulty concentrating", w: 1 },
      { id: "env_f11", t: "Teachers in previous years did not raise similar concerns", w: 1 }
    ],
    screen: [],
    investigations: [
      "Assess family circumstances and the parents' or carers' mental health as part of every child and young person ADHD assessment (NICE NG87 1.3.4)",
      "Accounts from at least 2 settings, ideally from more than one adult in each, and school observation when accounts conflict (NICE NG87 1.3.2, 1.3.3)",
      "Assess parenting and family relationships, including discipline, domestic abuse and parental wellbeing (NICE CG158 1.3.15 sets out these areas)",
      "Offer the young person time on their own (Clinical practice; NICE CG158 1.3.8 recommends this when conduct problems are assessed)",
      "Sleep history, or a 1-2 week sleep diary",
      "Ask school about bullying, attendance, learning needs, SEN support and recent changes",
      "When impairment is moderate and the picture unclear, put changes in place (routines, sleep, parent support, school adjustments) and review (Clinical practice; compare NICE NG87 1.2.7)"
    ],
    redFlags: [
      "Domestic abuse, neglect or any child protection concern: follow safeguarding procedures (NICE NG76; NICE CG89)",
      "A parent in crisis (severe mental illness, substance misuse, suicidal thoughts): urgent support and a safeguarding review",
      "Bullying with self-harm or school refusal: assess risk and liaise with school",
      "The child is a young carer: carer's assessment and support (Clinical practice)",
      "Pressure for a diagnosis to secure support, or problems reported that no one else sees: think of perplexing presentations or fabricated or induced illness, and follow the RCPCH guidance with safeguarding colleagues"
    ],
    decide: {
      better: "The environment is the main driver when the symptoms started with, or follow, a stressor, are confined to one setting or period, there is no earlier history of ADHD symptoms, and they improve when the situation improves. Record a formulation of the family and school factors, offer support, and do not diagnose ADHD.",
      both: "Diagnose ADHD as well when inattention and/or hyperactivity-impulsivity started in early childhood, show across settings including supportive ones, and persist despite reasonable changes at home and school. Name the stressors in the formulation, because they will affect treatment and adherence.",
      next: "Whatever the verdict, give advice on positive parent-child time, clear and consistent rules and a daily structure (NICE NG87 1.4.9), and on sleep and routines; offer family or parenting support or early help; with consent, liaise with school about bullying or learning needs; and encourage parents to get support for their own health. If ADHD is diagnosed, offer ADHD-focused parent support (1.5.10) and parent training when there are oppositional or conduct symptoms (1.5.11), explaining that this does not imply bad parenting (1.4.11). Review once the changes have had time to work, with fresh accounts from home and school."
    },
    pearls: [
      "Draw the timeline: life events on one line, symptoms on the other. ADHD runs through calm and stressful times; stress-driven symptoms follow the events.",
      "Ask about every setting the child spends time in, including a second home. A child who is fine at one parent's home and struggling at the other's is telling you something.",
      "Never blame. Parenting is a target for support, not a verdict on the family; children with ADHD need above-average parenting (NICE NG87 1.4.11).",
      "Ask the young person on their own about home, school, bullying and online life. Children often keep worries from their parents (Clinical practice).",
      "Check sleep. Too little sleep causes daytime inattention and irritability in children, and it is often fixable (Clinical practice).",
      "Stress makes real ADHD worse. Improvement after support does not prove the child never had ADHD; check whether problems persist across settings once things are calmer.",
      "Parents and teachers often disagree. Look for the reason (different demands, a relationship, the setting) before deciding who is right."
    ],
    refs: [
      "NICE NG87 (2018, updated 2019) 1.2.7, 1.3.2, 1.3.3, 1.3.4, 1.4.9, 1.4.11, 1.4.12, 1.5.10, 1.5.11, 1.5.13",
      "NICE CG158 Antisocial behaviour and conduct disorders in children and young people (2013, updated 2017) 1.3.8, 1.3.14, 1.3.15",
      "NICE NG76 Child abuse and neglect (2017); NICE CG89 Child maltreatment: when to suspect maltreatment in under 18s (2009, updated 2025)",
      "RCPCH. Perplexing presentations (PP) and fabricated or induced illness (FII) in children: guidance (2021)",
      "APA. DSM-5-TR (2022): other conditions that may be a focus of clinical attention, including relational and educational problems (paraphrased)"
    ]
  },
  /* ------------------------------------------------------------------ */
  /* Obstructive sleep-disordered breathing in children                  */
  /* ------------------------------------------------------------------ */
  {
    id: "osa_child",
    name: "Obstructive sleep-disordered breathing in children (habitual snoring and obstructive sleep apnoea)",
    group: "sleep",
    ages: "young",
    core: false,
    icd11: "7A41 (obstructive sleep apnoea)",
    summary: "The upper airway narrows or closes again and again during sleep, most often because of enlarged tonsils and adenoids, or with obesity. Sleep is broken. In children this usually shows in the day as restlessness, poor attention, irritability and learning problems rather than the obvious sleepiness seen in adults, so it can look very like ADHD. Ask about snoring in every child; when the airway is the likely cause, refer, treat it and then reassess attention.",
    prevalence: "The American Academy of Pediatrics guideline gives a prevalence of obstructive sleep apnoea of about 1.2-5.7% in children; snoring without apnoea is more common (Marcus et al. 2012). A systematic review reported obstructive sleep apnoea in 20-30% of people with full-syndrome ADHD (mixed ages, mostly children) and attention deficits in up to 95% of people with sleep apnoea (Youssef et al. 2011).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. DSM-5-TR criterion E asks whether another condition better explains the symptoms, and ICD-11 names sleep-wake disorders among the medical causes of attention symptoms. When a child snores most nights with other signs, refer and treat the airway first, then reassess. Diagnose ADHD when the symptoms were there before the snoring, are clearly beyond the child's developmental level in more than one setting, and persist once the breathing problem has been treated well. Treatment often improves behaviour without removing every attention problem (Marcus et al. 2013).",
    overlap: [
      "Hyperactivity, fidgeting and restlessness in the day",
      "Poor attention and distractibility in class",
      "Irritability, low frustration tolerance and emotional outbursts",
      "Learning and school progress below the child's ability",
      "Restless, broken sleep",
      "Hard to wake, or grumpy and tired at the start of the day",
      "Behaviour worse after a poor night"
    ],
    favoursADHD: [
      "Restlessness, inattention and impulsivity from early childhood, with no snoring or breathing pauses at night",
      "Daytime problems are the same after good nights, at weekends and on holidays",
      "Symptoms continue once the snoring has stopped after treatment, for example after adenotonsillectomy",
      "Parent and teacher describe the same pattern across settings, morning and afternoon",
      "Impulsivity (calling out, interrupting, acting without thinking) that tiredness does not explain",
      "Quiet sleep with normal breathing, seen by the family or on a phone recording",
      "Parent or brother or sister with ADHD"
    ],
    favoursAlt: [
      "Snores most nights (often defined as 3 or more nights a week), loud enough to hear outside the bedroom",
      "Pauses in breathing, gasping, snorting or choking in sleep, seen by a parent",
      "Laboured or mouth breathing at night, or sleeps with the neck stretched back or sitting up",
      "Very restless or sweaty sleep, or bedwetting that has come back after a dry spell",
      "Large tonsils, a blocked nose or a mouth-open, nasal-voiced look; frequent tonsillitis or glue ear",
      "Obesity, or a condition that narrows the airway, such as Down syndrome or a small lower jaw",
      "Morning headaches, very hard to wake, or sleepy in the day (less common than in adults)",
      "Behaviour and attention clearly worse after poor nights and better after good ones",
      "Daytime problems started or worsened with the snoring, or with a spell of enlarged tonsils or repeated infections",
      "Behaviour or attention improved after treatment of the airway",
      "Poor growth or weight gain without another cause"
    ],
    ask: [
      "(Parent) Does your child snore? How many nights a week, and how loud: can you hear it from outside the room?",
      "(Parent) Have you ever seen them stop breathing, gasp, choke or snort in their sleep?",
      "(Parent) Do they breathe through their mouth, by day or at night? Is their nose often blocked?",
      "(Parent) How do they sleep: very restless, sweaty, or in odd positions such as sitting up or with the head tipped back?",
      "(Parent) Have they started wetting the bed again after being dry?",
      "(Parent) Are they hard to wake, grumpy in the morning, or do they wake with headaches?",
      "(Parent) Do they fall asleep in the car, in front of the TV or at school more than other children their age?",
      "(Parent) Have they had a lot of tonsillitis, ear infections or glue ear? Has anyone said their tonsils or adenoids are large?",
      "(Parent) When did the snoring start, and when did the restlessness and poor concentration start? Which came first?",
      "(Parent) After a good night's sleep, or on holiday, are they calmer and more focused?",
      "(Parent) Were they restless and distractible as a toddler, before any snoring?",
      "(Parent) Have they had their tonsils or adenoids out, or used a nasal spray or a breathing machine at night? Did their behaviour change afterwards?",
      "(Teacher) Is the child more restless or inattentive in the morning or in the afternoon? Do they look tired or fall asleep in class?",
      "(Young person) Do you wake up feeling rested? Has anyone told you that you snore?",
      "(Young person) In lessons, do you feel sleepy, or wide awake with your mind wandering?"
    ],
    features: [
      { id: "osac_snore", t: "Habitual snoring: most nights, often defined as 3 or more nights a week", w: 2 },
      { id: "osac_apnoea", t: "Witnessed pauses, gasping, snorting or choking in sleep", w: 3 },
      { id: "osac_mouth", t: "Mouth breathing, laboured breathing or unusual sleep positions (neck stretched back, sitting up)", w: 2 },
      { id: "osac_tonsils", t: "Large tonsils or adenoids, nasal blockage or a mouth-open, nasal-voiced look", w: 2 },
      { id: "osac_restless", t: "Very restless or sweaty sleep, or bedwetting returning after a dry spell", w: 1 },
      { id: "osac_morning", t: "Very hard to wake, morning headaches or daytime sleepiness", w: 1 },
      { id: "osac_tracks", t: "Daytime behaviour and attention clearly worse after poor nights and better after good ones", w: 2 },
      { id: "osac_onset", t: "Daytime problems began with the snoring and were not there before it", w: 3 },
      { id: "osac_risk", t: "Obesity, Down syndrome, a craniofacial condition or another known airway risk", w: 1 },
      { id: "osac_study", t: "Sleep study (overnight oximetry, polygraphy or polysomnography) shows obstructive sleep apnoea", w: 3 },
      { id: "osac_treated", t: "Behaviour and attention improved clearly after treatment of the airway, for example adenotonsillectomy", w: 3 }
    ],
    screen: [],
    investigations: [
      "Ask about snoring and night-time breathing in every child, with a parent who has watched them sleep. A phone video or sound recording of a typical night helps the specialist (clinical practice).",
      "Look at the throat and nose (tonsil size, nasal blockage, mouth breathing) and plot height, weight and BMI on a growth chart.",
      "Refer to the GP, ENT or a paediatric sleep service when a child snores regularly and has other signs or symptoms. The AAP guideline advises a sleep study, or referral to a specialist when one is not available, in this situation (Marcus et al. 2012). In the UK the specialist service usually arranges overnight oximetry or polygraphy (clinical practice).",
      "Treatment is for the specialist team: adenotonsillectomy first when large tonsils and adenoids are the cause; CPAP if surgery is not done or sleep apnoea persists; weight management if overweight; nasal steroids are an option for mild sleep apnoea (Marcus et al. 2012).",
      "After a period of effective treatment, repeat the parent and teacher ADHD ratings and review the interview findings before deciding on ADHD (clinical practice).",
      "From 16, the adult pathway applies (NICE NG202 covers people over 16): see the adult obstructive sleep apnoea entry."
    ],
    redFlags: [
      "Breathing pauses with blue or grey lips, or very laboured breathing in sleep: same-day medical advice (clinical practice).",
      "Snoring with poor growth or weight loss: refer promptly (clinical practice).",
      "Snoring in a child with Down syndrome, a craniofacial or neuromuscular condition, or severe obesity: refer to a specialist service, because the risk is higher (clinical practice).",
      "About to start a stimulant while sleep-disordered breathing is untreated: refer first, and record sleep before any medicine, because stimulants can delay sleep and mask tiredness (clinical practice).",
      "Falling asleep while cycling or, at 16 and 17, while driving: give safety advice now."
    ],
    decide: {
      better: "Sleep-disordered breathing better explains the picture when the child snores most nights with pauses, gasping or laboured breathing, the daytime restlessness and inattention began with the snoring and were not there before it, problems track poor nights, and they settle clearly after the airway is treated. Do not diagnose ADHD on the current picture: refer and reassess after treatment.",
      both: "Diagnose both when ADHD symptoms were present before the snoring began, are clearly beyond the child's developmental level in more than one setting, and persist after effective treatment of the airway. Treatment often improves behaviour without removing every attention problem (Marcus et al. 2013).",
      next: "Refer to the GP, ENT or a paediatric sleep service and agree a review of attention after a period of effective treatment, with fresh parent and teacher ratings. If a long-standing ADHD history is clear, ADHD can be diagnosed now: record the sleep problem, treat both, and check sleep before and after any ADHD medicine."
    },
    pearls: [
      "Children with broken sleep are more often overactive, irritable and inattentive than visibly sleepy. A child who never seems tired can still be sleeping badly (clinical practice).",
      "Ask about snoring in every child. The AAP recommends that all children and young people are screened for snoring (Marcus et al. 2012).",
      "In the CHAT trial of 464 children aged 5-9 with sleep apnoea, early adenotonsillectomy improved behaviour, symptoms, quality of life and sleep study results compared with watchful waiting, but not attention and executive function on testing (Marcus et al. 2013). Clear improvement after treatment supports the sleep explanation; ADHD symptoms that persist support both.",
      "Bedwetting that comes back after a dry spell can be a clue to disturbed night-time breathing (clinical practice).",
      "Record sleep before any ADHD medicine. Stimulants can delay sleep onset, and a sleep problem first noticed after starting is hard to untangle (clinical practice).",
      "In a teenager with obesity, sleep apnoea may follow the adult pattern (sleepiness, a large neck) rather than large tonsils. From 16 use the adult entry and NICE NG202 (clinical practice)."
    ],
    refs: [
      "Marcus CL et al; American Academy of Pediatrics. Diagnosis and management of childhood obstructive sleep apnea syndrome (clinical practice guideline). Pediatrics 2012;130:576-84",
      "Marcus CL et al (Childhood Adenotonsillectomy Trial, CHAT). A randomized trial of adenotonsillectomy for childhood sleep apnea. N Engl J Med 2013;368:2366-76",
      "Youssef NA, Ege M, Angly SS, Strauss JL, Marx CE. Is obstructive sleep apnea associated with ADHD? Ann Clin Psychiatry 2011;23:213-24",
      "NICE NG202 (2021): obstructive sleep apnoea/hypopnoea syndrome in over 16s (scope)",
      "WHO ICD-11 7A41 obstructive sleep apnoea; ICD-11 CDDR 6A05 (sleep-wake disorders among medical causes of attention symptoms)",
      "APA DSM-5-TR (2022): ADHD criterion E (paraphrased)"
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Separation anxiety disorder                                         */
  /* ------------------------------------------------------------------ */
  {
    id: "sepanx",
    name: "Separation anxiety disorder",
    group: "anxiety",
    ages: "young",
    core: false,
    icd11: "6B05",
    summary: "Fear or worry about being apart from the people the child is attached to, usually a parent or carer, far beyond what is expected for their age and lasting at least 4 weeks in children and young people (DSM-5-TR, paraphrased). The child worries that harm will come to the parent or to themselves, resists going to school or sleeping alone, and becomes distressed or unwell when a separation is coming. Restlessness, poor concentration and refusal at separation times can look like ADHD or oppositional behaviour.",
    prevalence: "About 4% of children over 6 to 12 months, and 1.6% of adolescents over 12 months in the US; it is the most common anxiety disorder in children under 12 (DSM-5-TR). Anxiety disorders often co-occur with ADHD in children (clinical practice).",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. Inattention and restlessness that happen only around separations (school mornings, bedtime, when a parent leaves) point to separation anxiety. ADHD symptoms are there at calm, settled times too, in more than one setting, and usually from early childhood. DSM-5-TR criterion E asks whether an anxiety disorder better explains the symptoms; ICD-11 classifies separation anxiety disorder with the anxiety and fear-related disorders.",
    overlap: [
      "Restless, fidgety and unsettled, especially before school",
      "Poor concentration in class, with the mind on home or the parent",
      "Refuses or argues when asked to do things that mean being apart (going to school, to bed, to a club)",
      "Tantrums or crying at separation times that look like defiance",
      "Trouble settling to sleep, or coming into the parent's bed at night",
      "Stomach aches, headaches or feeling sick on school days",
      "Missed or late school days"
    ],
    favoursADHD: [
      "Restless, inattentive and impulsive at home with the parent there, not only around separations",
      "Problems are the same at weekends and in the holidays, when there is no separation",
      "Distractible and disorganised even when content and settled at school",
      "Impulsive acts (calling out, interrupting, grabbing) that have nothing to do with worry",
      "A long-standing pattern from early childhood, before any separation fears began",
      "The teacher describes the same difficulties once the child has settled in the day"
    ],
    favoursAlt: [
      "Worry that something bad will happen to a parent (illness, an accident, not coming back) or to the child (getting lost, being taken)",
      "Distress, clinging or physical complaints when a separation is coming or happens",
      "Reluctance or refusal to go to school, clubs, sleepovers or to sleep alone",
      "Nightmares about separation",
      "Phones or messages the parent again and again, or checks where they are",
      "Settles and concentrates once the separation is over or the parent is near",
      "Started after an event: a loss, illness in the family, a move, parents separating, a new school or a frightening event",
      "Worry and avoidance, not restlessness or impulsivity, are the main problem",
      "Other anxiety in the child, or anxiety in a parent"
    ],
    ask: [
      "(Parent) When you leave your child, or they have to leave you, what happens? Is it more than in other children their age?",
      "(Parent) Do they worry that something will happen to you, or to them, while you are apart?",
      "(Parent) Can they go to school, clubs, friends' houses or sleepovers without you? Can they sleep in their own bed?",
      "(Parent) Do they get stomach aches, headaches or feel sick on school mornings, and do these go at weekends?",
      "(Parent) When did this start? Did anything happen around then, such as a loss, illness, a move or a change at home?",
      "(Parent) When you are with them and they are relaxed, are they still restless, distractible and impulsive?",
      "(Parent) At weekends and in the holidays, how are their concentration and behaviour?",
      "(Parent) Has anyone else in the family had problems with anxiety?",
      "(Teacher) How does the child arrive in the morning? Do they settle after the parent leaves, and how long does it take?",
      "(Teacher) Once settled, can they concentrate and sit still as well as others in the class?",
      "(Teacher) Do they often ask to phone home, go to the office or see the school nurse?",
      "(Young person) What goes through your mind when you are away from home, or away from your mum, dad or carer?",
      "(Young person) Do you worry that something bad might happen to them, or to you?",
      "(Young person) When you are at home and not worried, is it easy to concentrate on something like homework?"
    ],
    features: [
      { id: "sepanx_f1", t: "Excessive worry about harm to a parent or carer, or about something that would separate them", w: 3 },
      { id: "sepanx_f2", t: "Distress, clinging or physical complaints when a separation is coming or happens", w: 3 },
      { id: "sepanx_f3", t: "Reluctance or refusal to go to school or other places because of separation", w: 2 },
      { id: "sepanx_f4", t: "Reluctance to sleep alone or away from home, or nightmares about separation", w: 2 },
      { id: "sepanx_f5", t: "Restlessness and poor concentration mainly around separation times, settled otherwise", w: 3 },
      { id: "sepanx_f6", t: "Focus and behaviour ordinary at home with the parent there, and at weekends", w: 2 },
      { id: "sepanx_f7", t: "Started after a loss, illness, move, family change or frightening event", w: 2 },
      { id: "sepanx_f8", t: "Lasted at least 4 weeks and is far beyond what is expected for the child's age", w: 1 },
      { id: "sepanx_f9", t: "RCADS separation anxiety subscale raised (parent or young person)", w: 1 },
      { id: "sepanx_f10", t: "Other anxiety in the child, or anxiety in a parent", w: 1 }
    ],
    screen: ["rcads"],
    investigations: [
      "Map a typical school morning, bedtime and weekend with the parent: when the worry and restlessness appear, and when they settle (clinical practice)",
      "RCADS or RCADS-P from age 8: read the separation anxiety subscale, not only the total; the SDQ emotional symptoms scale is a broad prompt",
      "Teacher account of how the child arrives and settles, attendance records, and visits to the office or school nurse",
      "A timeline of family events (loss, illness, a move, parents separating, a new school) and of when the attention problems began",
      "Ask about anxiety in the parents and their own experience of separations; for children and young people, NICE asks you to assess the parents' or carers' mental health (NICE NG87 1.3.4)",
      "With school refusal, look for bullying, learning difficulties, social anxiety and low mood as well (clinical practice)"
    ],
    redFlags: [
      "Long absence from school or a child missing education: involve the school and plan a supported return (clinical practice)",
      "Worry about a parent's safety that may be realistic, for example domestic abuse or a parent's serious illness: follow local safeguarding procedures if a child may be at risk",
      "Low mood, self-harm or suicidal thoughts with the anxiety: assess risk the same day",
      "Separation fears that began after abuse or a frightening event: also review post-traumatic stress"
    ],
    decide: {
      better: "Separation anxiety better explains the picture when the worry about being apart is far beyond what is expected for the child's age, the restlessness and poor concentration happen mainly around separations, the child is settled and attentive at home with the parent and at weekends, and the problems began with the anxiety rather than in early childhood.",
      both: "Diagnose both when ADHD symptoms are present at calm times and in more than one setting, began before the separation fears or are independent of them, and continue once the anxiety is treated. Treat the anxiety alongside ADHD; anxiety does not rule ADHD out.",
      next: "Refer or signpost for anxiety treatment (for example CBT-based help with gradual, planned separations, involving the parents), agree a supported school plan with the school, and reassess attention once the anxiety has settled (clinical practice)."
    },
    pearls: [
      "Ask 'When exactly?' Restlessness only on school mornings, at bedtime or when the parent leaves points to anxiety; restlessness all day, with the parent there, points to ADHD (clinical practice).",
      "School refusal is not always defiance. Ask what the child fears will happen at home while they are away (clinical practice).",
      "Physical complaints on school days that go at weekends are a common sign of anxiety in younger children (clinical practice).",
      "Separation anxiety is the most common anxiety disorder before 12 (DSM-5-TR), and the child may only show it at transitions, so the clinic visit with a parent present can look normal.",
      "A parent's own anxiety can keep separation fears going. Supporting the parent is part of the treatment (clinical practice).",
      "Anxiety and ADHD often occur together. Treating the anxiety can make the ADHD picture clearer, and the reverse (clinical practice)."
    ],
    refs: [
      "APA DSM-5-TR (2022): separation anxiety disorder, criteria, duration and prevalence (paraphrased)",
      "WHO ICD-11 6B05 separation anxiety disorder",
      "Chorpita BF, Spence SH. Revised Child Anxiety and Depression Scale (RCADS and RCADS-P): separation anxiety subscale",
      "NICE NG87 (2018, updated 2019) 1.3.4"
    ]
  }
]);
