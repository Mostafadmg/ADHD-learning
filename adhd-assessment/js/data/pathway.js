/* Assessment pathway (9 stages), guideline summaries and diagnostic criteria (ARCHITECTURE.md 5.6).
   UK practice (NICE NG87) is the default frame; international guidance is included for comparison.
   NICE, UKAAN, RCPsych, CADDRA, AADPA, WHO and APA content is paraphrased and cited, not reproduced.
   DSM-5-TR and ICD-11 criteria are paraphrased for teaching; use the source texts for formal diagnosis.
   DIVA wording is not reproduced. Sources: research briefs of 21 October 2026 (guidelines-uk, guidelines-intl). */
(function (AA) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Pathway: nine stages of an adult ADHD assessment                    */
  /* ------------------------------------------------------------------ */
  AA.add('pathway', [
    {
      id: "referral", n: 1, title: "Referral and triage",
      who: "GP or referring clinician, then the service's triage clinician. Any questionnaire screening is reviewed by an experienced team member, never applied automatically.",
      what: [
        "Clarify the referral question: what the person wants help with, and why now.",
        "NICE NG87 1.2.10: refer adults without a childhood diagnosis when typical ADHD symptoms began in childhood and have persisted, are not explained by another psychiatric diagnosis (coexisting conditions may be present), and cause at least moderate psychological, social, educational or occupational impairment.",
        "NICE NG87 1.2.11: adults treated for ADHD as children whose symptoms continue, with at least moderate impairment, are referred to general adult psychiatric services (QS39 statement 3).",
        "Note higher-prevalence groups (NG87 1.2.1): adults with a mental health condition, a history of substance misuse, epilepsy, acquired brain injury, other neurodevelopmental conditions, a close relative with ADHD, people born preterm, and people known to the criminal justice system.",
        "Remember that ADHD is under-recognised in girls and women: they are less often referred, more often undiagnosed and more often given another diagnosis (NG87 1.2.2).",
        "Ask the referrer for early developmental history, examples from two or more settings, the impact on functioning, medical history, and blood pressure and pulse (RCPsych CR235 Box 1 and section 8).",
        "A positive screening questionnaire is not enough for referral on its own, and a negative one should not be used to exclude people (NHSE ADHD Taskforce Part 2, section 5 and recommendation 10).",
        "Look first for needs that cannot wait: active suicidal thinking, possible mania or psychosis, safeguarding concerns or new neurological signs. These need a different response before any ADHD assessment (clinical practice; NICE makes no recommendations on urgent or expedited ADHD assessment).",
        "People diagnosed privately or abroad should provide the full report. Without evidence of a comprehensive assessment, a standard assessment is needed (CR235 section 8)."
      ],
      tools: ["asrs18", "asrs5", "wfirs", "aq10"],
      tips: [
        "Triage on the whole picture, not on a score. RCPsych CR235 found the ASRS undiscriminating for triage.",
        "If childhood onset is unclear, ask for more information rather than rejecting the referral: NG87 1.3.3 says an uncertain time of onset should not by itself exclude the diagnosis.",
        "Note any external pressure behind the referral (exams, work, benefits, a relative's diagnosis) without judging it (CR235 section 7).",
        "Keep risk under review while people wait. The DHSC review (2026) recommends that nobody is removed from a waiting list without being connected to appropriate help.",
        "Send clear written information about what the assessment involves, how long it takes and who to bring."
      ],
      sources: [
        "NICE NG87 1.2.1, 1.2.2, 1.2.10, 1.2.11 and 1.3.3",
        "NICE QS39 quality statements 2 and 3",
        "RCPsych in Scotland CR235 (2023), sections 7 and 8, Box 1",
        "NHSE Independent ADHD Taskforce Part 1 (2025) recommendation 6; Part 2 (2025) section 5 and recommendation 10",
        "DHSC Independent review into mental health conditions, ADHD and autism (2026), recommendation 2",
        "NICE response to a Prevention of Future Deaths report (August 2026): NG87 has no recommendations on expedited assessment"
      ]
    },
    {
      id: "pre", n: 2, title: "Pre-assessment questionnaires and records",
      who: "The patient and informants complete forms; the admin team requests records; the assessing clinician reviews everything before the first appointment.",
      what: [
        "Explain the process in advance: number and length of appointments, who to bring, and what will be asked (UKAAN AQAS: orientation is highly recommended).",
        "Send a current self-report symptom scale, for example the 18-item ASRS v1.1, to give a baseline for measuring change later. It is not diagnostic evidence (AQAS; NICE NG87 1.3.2).",
        "Send a retrospective childhood scale, for example the WURS-25, and a functional impairment scale, for example the WFIRS-S.",
        "Send short screens for common coexisting conditions: depression, anxiety, alcohol and drug use, and autistic traits (AQAS optional; CADDRA uses the WSR-II, PHQ-9 and GAD-7).",
        "Send informant forms: a current observer form for a partner or close friend, and a childhood form for a parent or older sibling.",
        "Request school reports (primary and secondary), previous assessments, the GP summary, and mental health, paediatric or educational psychology letters.",
        "Invite a short written life story or timeline (AQAS optional).",
        "Record consent to contact informants and to request records."
      ],
      tools: ["asrs18", "asrs5", "wurs25", "wfirs", "wsr2", "phq9", "gad7", "audit", "dast10", "aq10", "caars2", "baars4", "brown_efa", "bdefs", "brief_a"],
      tips: [
        "Scores are context, not evidence. People who have read about ADHD can endorse most items (CR235 9.6).",
        "Read the forms before the interview and note discrepancies to explore, for example very high symptom scores with little impairment.",
        "Norms from male or mixed samples can under-detect women, and rigid cut-offs produce false positives and false negatives (UKAP consensus on females with ADHD, 2020).",
        "Keep the baseline scores: you will need them to judge treatment response (NG87 1.7.26 uses standard scales at baseline and at each dose change).",
        "CAARS 2, BAARS-IV, Brown EF/A, BDEFS and BRIEF-A need a paid licence. Free tools cover most needs.",
        "Old school reports are often the best evidence of childhood onset. Ask early, because they take time to find."
      ],
      sources: [
        "UKAAN AQAS (Adamou et al. 2024): pre-assessment and orientation statements",
        "NICE NG87 1.3.2 and 1.7.26",
        "RCPsych CR235 (2023) section 9.6 and Box 3",
        "CADDRA Canadian ADHD Practice Guidelines 4.1, chapter 1 and figure 1.5",
        "Young et al. 2020, UKAP consensus on females with ADHD (BMC Psychiatry)"
      ]
    },
    {
      id: "interview", n: 3, title: "Clinical interview: history and structured ADHD interview",
      who: "An ADHD specialist: a psychiatrist or other appropriately qualified healthcare professional with training and expertise in diagnosing ADHD (NG87 1.3.1). Direct contact, face to face or by video.",
      what: [
        "Begin with an open psychiatric history and a mental state examination. Do not make the first appointment only a semi-structured interview, because that can lead the patient and miss other diagnoses (CR235 9.1).",
        "Presenting problems, current functioning, and why help is being sought now.",
        "Developmental history: pregnancy, birth, prematurity, milestones, early temperament, and any early speech and language, occupational therapy or paediatric input (AQAS; CR235 9.4).",
        "School history: progress, reports, behaviour in class, exclusions, friendships and any extra help.",
        "Adult history: education, jobs and reasons for leaving them, relationships, parenting, money, driving and forensic history.",
        "Work through all 18 DSM-5-TR symptoms with a semi-structured interview, for adulthood (past 6 months) and childhood (age 5 to 12), using open questions and getting a real example for every symptom you count (AQAS essential).",
        "Onset and course: have the symptoms always been there, and was there ever a period without them?",
        "Impairment in each area of life, rated none to severe with examples. At least moderate impairment in two or more domains or settings is needed (NG87 1.3.3; AQAS theme 3).",
        "Ask about adult features that are not criteria: mind-wandering, inner restlessness, emotional lability, difficulty getting to sleep and hyperfocus (CR235 9.3; Kooij 2019).",
        "Allow enough time: at least 2 hours of direct contact in most cases (AQAS theme 4)."
      ],
      tools: ["diva5", "diva2", "aceplus", "caadid", "aisrs"],
      tips: [
        "Get a recent, specific example before scoring any symptom. 'Yes, that's me' is not enough.",
        "Ask open questions first and offer examples second, so you do not lead (AQAS).",
        "Calm behaviour in the room does not exclude ADHD (Kooij 2019; CR235 9.2; CADDRA 4.1).",
        "Count a symptom only if it is clearly more frequent or severe than in peers and has been present over time, not only during an episode of illness.",
        "High achievement does not rule ADHD out. Ask what achieving costs the person (AQAS theme 3).",
        "Ask about masking and scaffolding: who organised them as a child, and which strategies they rely on now (CR235 9.2).",
        "Bring an informant into part of the interview if you can."
      ],
      sources: [
        "NICE NG87 1.3.1, 1.3.3 and 1.3.5",
        "UKAAN AQAS (2024): systematic evaluation of symptoms, impairment, developmental history, theme 3 and theme 4",
        "RCPsych CR235 (2023) sections 9.1 to 9.4 and 9.6",
        "Kooij et al. 2019 European Consensus, sections 4 and 6"
      ]
    },
    {
      id: "collateral", n: 4, title: "Collateral history and records",
      who: "The assessing clinician, with a parent or older sibling (childhood), a partner or close friend (adulthood), and school, health and work records.",
      what: [
        "Observer reports are part of the basis for diagnosis in NICE NG87 1.3.1.",
        "Seek at least one informant who knew them in childhood and one who knows them now (AQAS highly recommended).",
        "Ask informants for concrete examples rather than general impressions.",
        "Read school reports for comments on attention, organisation, behaviour, effort and unmet potential.",
        "Review previous records: CAMHS, paediatrics, educational psychology, GP, mental health and occupational health.",
        "Rate how strongly each source supports the diagnosis: none or little, some, or clear (the DIVA 0 to 2 approach).",
        "Record who was asked, what they said, and what was not available and why.",
        "If no informant is available for reasons outside the person's control, this should not by itself exclude the diagnosis (CR235 9.5), but ICD-11 advises caution when childhood history cannot be corroborated."
      ],
      tools: ["asrs18", "caars2", "baars4", "snap4", "aceplus"],
      tips: [
        "Parents may have ADHD themselves, may be protective, or may remember poorly. Ask for examples (UKAP 2020).",
        "When accounts differ, weigh how specific and detailed each one is. In adults, the patient is often a good informant (Kooij 2019).",
        "Teachers often write 'daydreams', 'could try harder' or 'chatty'. Silence in reports does not exclude a mainly inattentive presentation.",
        "Joint interviews save time but can silence the patient. Offer some time alone.",
        "A very structured or supportive childhood may have hidden symptoms. Ask what happened when that support stopped."
      ],
      sources: [
        "NICE NG87 1.3.1",
        "UKAAN AQAS (2024): informant perspectives and theme 2",
        "RCPsych CR235 (2023) section 9.5 and Table 2 (ICD-11 caution)",
        "WHO ICD-11 CDDR (2024) 6A05 additional features",
        "Young et al. 2020 UKAP consensus papers (females with ADHD; ADHD and autism)",
        "Kooij et al. 2019 European Consensus, section 4"
      ]
    },
    {
      id: "comorbid", n: 5, title: "Coexisting conditions and differential diagnosis",
      who: "The assessing clinician, involving psychology, autism, sleep, neurology or addiction services when needed.",
      what: [
        "Screen for common mental health problems, past and present, that mimic or coexist with ADHD (AQAS essential).",
        "Screen for other neurodevelopmental conditions: autism, tics and Tourette's, dyslexia, dyspraxia and intellectual disability (AQAS essential).",
        "Map the time course: trait-like and lifelong (ADHD, autism, personality) or episodic with a clear onset (depression, bipolar disorder, anxiety) (CR235 9.7).",
        "Review the core differentials in every adult: depression, bipolar disorder, generalised anxiety, PTSD, borderline personality disorder, autism, alcohol and cannabis use, insomnia and obstructive sleep apnoea.",
        "Consider medical causes and aggravators: thyroid disease, anaemia, head injury, epilepsy, hearing or vision loss, sleep disorders and medicines (CADDRA 4.1 chapter 2; AADPA 2.2.2).",
        "For each condition decide: absent, coexisting, or better explains the picture.",
        "Do not count the same symptom twice for ADHD and autism (UKAP ADHD and autism consensus, 2020).",
        "Where possible, treat major mood disorders, psychosis and unstable substance use before confirming ADHD (CR235 section 10; Kooij 2019 section 7.2)."
      ],
      tools: ["phq9", "gad7", "mdq", "hcl32", "audit", "auditc", "dast10", "cageaid", "assist", "aq10", "raads14", "pcl5", "pcptsd5", "itq", "msibpd", "pq16", "ocir", "isi", "stopbang", "epworth", "moca", "aceq", "wsr2"],
      tips: [
        "Coexisting conditions are the rule in adult ADHD and do not rule it out (WFADHD 2021).",
        "Ask 'since when?' about every symptom. A recent change points away from ADHD.",
        "ADHD screens lose specificity in clinical groups: they often screen positive in depression, bipolar disorder and borderline personality disorder (May et al. 2023, Australian guideline).",
        "Sudden or late onset of hyperactivity in adulthood should prompt a search for mania, psychosis, substances or a medical cause (ICD-11 CDDR).",
        "Psychotic symptoms are not part of ADHD and point to a separate diagnosis (CR235 9.7.9).",
        "Use a trauma-informed approach: trauma can mimic, mask or coexist with ADHD (CR235 11.5)."
      ],
      sources: [
        "UKAAN AQAS (2024): mental health history and developmental history statements (essential)",
        "RCPsych CR235 (2023) sections 9.7, 10 and 11.5",
        "CADDRA 4.1 chapter 2",
        "AADPA guideline (2022) 2.2.1 to 2.2.3; May et al. 2023 ANZJP summary",
        "WHO ICD-11 CDDR (2024) 6A05 boundaries with other disorders",
        "Kooij et al. 2019 European Consensus, sections 6.3 and 7.2",
        "Faraone et al. 2021 WFADHD International Consensus Statement"
      ]
    },
    {
      id: "risk", n: 6, title: "Risk and safety",
      who: "The assessing clinician, escalating to crisis, safeguarding or substance misuse services as needed.",
      what: [
        "Always complete a risk or safety assessment (AQAS essential).",
        "Suicidal thoughts, plans and past attempts; self-harm.",
        "Risk to others and from others, including aggression, exploitation, domestic abuse and victimisation (UKAP ADHD and autism consensus, 2020).",
        "Substance misuse, and the risk of misuse or diversion of prescribed stimulants (NG87 1.7.4).",
        "Driving: accidents, speeding and near misses, and whether ADHD affects safe driving.",
        "Parenting and child welfare: explore parenting roles routinely (CR235 11.6).",
        "Forensic history and impulsive risk-taking.",
        "While people wait, suicidal risk is a reason to prioritise (NHSE Taskforce Part 1 recommendation 6)."
      ],
      tools: ["cssrs", "phq9", "audit", "dast10", "assist"],
      tips: [
        "Ask about risk at first contact, not only at the end of the assessment.",
        "People with ADHD have a higher risk of suicide (WFADHD 2021). Ask about recent crises and access to means.",
        "Decisions about suicide risk, self-harm and safeguarding stay with qualified professionals, not with tools or software (DHSC review 2026, Annex A.4).",
        "Record what you did and who you told.",
        "Deal with urgent risk first. The ADHD assessment can wait."
      ],
      sources: [
        "UKAAN AQAS (2024): substance use, addiction and forensic history (essential)",
        "NICE NG87 1.7.4",
        "BAP 2014 Table 9",
        "RCPsych CR235 (2023) sections 11.1 and 11.6",
        "NHSE Taskforce Part 1 (2025) recommendation 6",
        "DHSC Independent review (2026) Annex A.4",
        "GOV.UK: ADHD and driving"
      ]
    },
    {
      id: "physical", n: 7, title: "Physical health baseline",
      who: "The assessing clinician, or a GP or practice nurse for measurements. Cardiology if a red flag is found.",
      what: [
        "Medical history, including conditions that affect the choice of medicine, and current medication (NG87 1.7.4).",
        "Height, weight, pulse and blood pressure measured with an appropriately sized cuff (NG87 1.7.4).",
        "Cardiovascular history and examination, including breathlessness or fainting on exertion, palpitations, chest pain, and sudden cardiac death in a first-degree relative under 40 (NG87 1.7.5).",
        "An ECG is needed only if a 1.7.5 feature is present or a coexisting condition is treated with a medicine that may increase cardiac risk (NG87 1.7.4, amended 2019).",
        "Refer for a cardiology opinion before medication if any NG87 1.7.5 feature is present, including a murmur or blood pressure in the hypertensive range.",
        "Ask specifically about seizures and head injuries (AQAS).",
        "Ask about sleep and diet, and screen for sleep apnoea and insomnia (AQAS highly recommended).",
        "Ask about common physical comorbidities: obesity, asthma and allergies, hypermobility, migraine, thyroid disease and diabetes (AQAS highly recommended).",
        "Order investigations only when clinically indicated (AADPA 2.1.2)."
      ],
      tools: ["stopbang", "epworth", "isi", "auditc"],
      tips: [
        "Record important negatives too, for example no seizures, no head injury, no cardiac symptoms (AQAS theme 2).",
        "Glaucoma, liver disease, tics and epilepsy matter for later treatment choices (CR235 Box 2).",
        "Ask about caffeine, energy drinks and decongestants, which can cause restlessness (AADPA 2.2.2).",
        "The physical baseline is needed before medication, but it should not hold up the diagnostic decision."
      ],
      sources: [
        "NICE NG87 1.7.4 and 1.7.5",
        "UKAAN AQAS (2024): medical and physical health history; theme 2",
        "RCPsych CR235 (2023) Box 2",
        "BAP 2014 Table 9",
        "AADPA guideline (2022) 2.1.2 and 2.2.2"
      ]
    },
    {
      id: "diagnosis", n: 8, title: "Diagnosis, formulation and feedback",
      who: "The assessing ADHD specialist, with multidisciplinary discussion for complex or uncertain cases.",
      what: [
        "Check every criterion: A (5 or more symptoms in a domain from age 17), B (several before 12), C (two or more settings), D (clear interference; NICE asks for at least moderate impairment) and E (not better explained).",
        "State the presentation for the past 6 months: combined, predominantly inattentive or predominantly hyperactive-impulsive.",
        "State severity and whether in partial remission, and give the DSM-5-TR (F90.x) and ICD-11 (6A05.x) codes.",
        "Say explicitly that the symptoms are not better explained by another disorder (AQAS essential).",
        "If criteria are not met, say whether this is subthreshold ADHD or symptoms secondary to another condition (AQAS).",
        "Weigh the evidence: collateral, records, consistency and any validity concerns. Say what is missing and how it affects confidence.",
        "Hold a structured discussion about how ADHD could affect the person's life: positives, stigma, impulsivity, environmental modifications, education and work, relationships, substance misuse and driving (NG87 1.4.3).",
        "People who fall short of a diagnosis should also get information (NG87 1.4.4).",
        "Agree next steps and measurable goals (AQAS Table 2)."
      ],
      tools: ["diva5", "diva2", "aceplus", "wfirs", "caars2"],
      tips: [
        "Never let a scale score make or block the diagnosis (NG87 1.3.2).",
        "QbTest and other computer tests are research only in adults (NICE HTG729 1.2).",
        "Neuropsychological tests are not diagnostic. Consider them only when impairment is out of proportion to symptoms or a learning problem is suspected (BAP 2014; Kooij 2019).",
        "If you are unsure, defer and gather more evidence rather than forcing a decision.",
        "Give feedback in plain language and leave time for questions. Some people need a second session (AQAS Table 2).",
        "Driving: people must tell the DVLA only if their ADHD or its medication affects their ability to drive safely (GOV.UK)."
      ],
      sources: [
        "NICE NG87 1.3.1 to 1.3.3, 1.4.3 and 1.4.4",
        "UKAAN AQAS (2024): theme 2, theme 3 and Table 2",
        "NICE HTG729 (2024) 1.1 and 1.2",
        "BAP 2014; Kooij et al. 2019 section 3.3",
        "DSM-5-TR (APA 2022); WHO ICD-11 CDDR (2024)",
        "GOV.UK: ADHD and driving"
      ]
    },
    {
      id: "followup", n: 9, title: "Report and follow-up",
      who: "The assessing clinician writes the report; the specialist team starts any treatment; the GP continues under shared care.",
      what: [
        "Write a report that supports its conclusion: a symptom-by-symptom account with examples, interview results with narrative, and informant and school evidence (AQAS theme 2).",
        "List coexisting conditions that are present and important ones that are absent.",
        "List the impairment domains rated at least moderate.",
        "State whether criteria are met, the presentation, and that the symptoms are not better explained by another disorder.",
        "Include driving advice and the plan.",
        "Adults: offer medication if symptoms still cause significant impairment in at least one domain after environmental modifications have been implemented and reviewed (NG87 1.5.15).",
        "Before medication, complete the NG87 1.7.4 baseline. Medication is started by a professional with training and expertise in ADHD (NG87 1.7.2), and dose and response are reviewed by an ADHD specialist (QS39 statement 6).",
        "Record symptoms, impairment and adverse effects on standard scales at baseline and at each dose change (NG87 1.7.26).",
        "People on medication should have a specialist review at least once a year (QS39 statement 7). Seek GP agreement for shared care prescribing (AQAS Table 2).",
        "If ADHD is not diagnosed, explain why, address other needs and signpost (NG87 1.4.4)."
      ],
      tools: ["asrs18", "wfirs", "aisrs", "caars2", "wsr2"],
      tips: [
        "Write for every reader: the patient, the GP and future clinicians.",
        "Share the report with the patient, in plain language, with consent.",
        "Monitor with the same scales you used at baseline.",
        "With consent, contact the clinicians involved in any coexisting condition (NG87 1.4.13).",
        "Offer families and carers advice about relationships and the importance of structure in daily life (NG87 1.4.10)."
      ],
      sources: [
        "UKAAN AQAS (2024): theme 2 and Table 2",
        "NICE NG87 1.4.4, 1.4.10, 1.4.13, 1.5.15, 1.7.2, 1.7.4 and 1.7.26",
        "NICE QS39 quality statements 6 and 7",
        "CADDRA 4.1 follow-up forms (ASRS, WFIRS-S)",
        "GOV.UK: ADHD and driving"
      ]
    }
  ]);

  /* ------------------------------------------------------------------ */
  /* Guidelines                                                          */
  /* ------------------------------------------------------------------ */
  AA.add('guidelines', [
    {
      id: "ng87",
      name: "Attention deficit hyperactivity disorder: diagnosis and management (NG87), with quality standard QS39",
      org: "National Institute for Health and Care Excellence (NICE), England",
      year: "2018 (last updated September 2019; minor changes 2022, 2023 and 2025; last reviewed July 2026)",
      scope: "Children, young people and adults with ADHD. Covers recognition, referral, diagnosis, information and support, treatment and monitoring. Quality standard QS39 (2013, updated 2018) turns key recommendations into measurable statements. The diagnosis recommendations (1.3) date from 2008, with amendments in 2018 and 2023.",
      keyPoints: [
        "ADHD should only be diagnosed by a specialist psychiatrist, paediatrician or other appropriately qualified healthcare professional with training and expertise in diagnosing ADHD (1.3.1). NICE does not define 'appropriately qualified'.",
        "Diagnosis rests on a full clinical and psychosocial assessment, a full developmental and psychiatric history, and observer reports with a mental state assessment (1.3.1).",
        "Rating scales and observation are helpful added tools but never the sole basis for diagnosis (1.3.2). NG87 names no adult instrument.",
        "Symptoms must meet DSM-5 or ICD-11 criteria, cause at least moderate impairment, and happen often in two or more important settings. Do not exclude because of autism or an uncertain time of onset (1.3.3).",
        "Include needs, coexisting conditions, social, family, educational or occupational circumstances, and physical health (1.3.4). Consider ADHD at all ages, with criteria adjusted for age (1.3.5).",
        "ADHD is under-recognised in girls and women (1.2.2). Several groups have higher prevalence, including adults with a mental health condition and people with a history of substance misuse (1.2.1).",
        "After diagnosis, hold a structured discussion about how ADHD could affect the person's life. People who fall short of a diagnosis may also benefit from information (1.4.3, 1.4.4).",
        "QbTest is an option only for people aged 6 to 17, alongside standard assessment (NICE HTG729). In adults it is a research-only use."
      ],
      assessment: [
        "Refer adults without a childhood diagnosis when symptoms began in childhood and persisted, are not explained by another psychiatric diagnosis, and cause at least moderate impairment (1.2.10; QS39 statement 2).",
        "Adults treated for ADHD as children who still have symptoms go to general adult psychiatric services (1.2.11; QS39 statement 3).",
        "Discuss behaviour and symptoms across the different domains and settings of everyday life (1.3.1).",
        "Impairment must be at least moderate, based on interview or direct observation in multiple settings (1.3.3).",
        "Before medication: confirm the criteria are still met; review coexisting conditions, work or education, risk of substance misuse and drug diversion, and care needs; take a medical history and current medication; measure height, weight, pulse and blood pressure; and complete a cardiovascular assessment (1.7.4).",
        "An ECG is not needed unless a 1.7.5 feature is present or another medicine raises cardiac risk (1.7.4, amended 2019). Refer to cardiology for any 1.7.5 red flag.",
        "Offer medication to adults whose symptoms still cause significant impairment in at least one domain after environmental modifications have been implemented and reviewed (1.5.15).",
        "Record symptoms, impairment and adverse effects on standard scales at baseline and at each dose change (1.7.26)."
      ],
      url: "https://www.nice.org.uk/guidance/ng87"
    },
    {
      id: "cks",
      name: "NICE Clinical Knowledge Summaries (CKS): Attention deficit hyperactivity disorder",
      org: "NICE CKS, produced by Clarity Informatics (trading as Agilio Software | Primary Care)",
      year: "Updated continuously",
      scope: "Practical summaries for primary care. Access is limited to eligible users in the UK. CKS is third-party content, not NICE guidance, and is excluded from the NICE UK Open Content Licence.",
      keyPoints: [
        "CKS is written for GPs and primary care teams and is read alongside NICE guidance, not instead of it.",
        "Access is restricted to eligible UK users, and scraping or data mining of CKS is not permitted.",
        "This app does not reproduce or summarise CKS content. If you work in UK primary care, read the topic directly.",
        "For adult referral, the underlying NICE sources are NG87 1.2.10 and 1.2.11 and QS39 statements 2 and 3.",
        "NG87 1.1.2 asks specialist ADHD services to agree local shared care protocols with primary care."
      ],
      assessment: [
        "GPs recognise possible ADHD and refer. The NG87 rule that primary care should not make the initial diagnosis (1.2.9) is written for children; for adults, UKAAN (2022) notes that NICE does not specify the clinical setting of the qualified professional.",
        "A screening questionnaire result alone is not enough for referral (NHSE Taskforce Part 2).",
        "A good referral includes early developmental history, symptoms in two or more settings, impairment, medical history, and blood pressure and pulse (RCPsych CR235 Box 1).",
        "Under shared care, the GP usually continues prescribing and physical monitoring after a specialist has started and stabilised treatment.",
        "Specific CKS recommendations were not verified for this app. Check the live CKS topic."
      ],
      url: "https://cks.nice.org.uk/topics/attention-deficit-hyperactivity-disorder/"
    },
    {
      id: "ukaan",
      name: "Adult ADHD Assessment Quality Assurance Standard (AQAS), with UKAAN and UKAP consensus papers",
      org: "UK Adult ADHD Network (UKAAN); UK ADHD Partnership (UKAP)",
      year: "2024 (AQAS); consensus papers 2020 and 2022",
      scope: "The main UK standard for the quality of adult ADHD diagnostic assessment, graded essential, highly recommended or optional. Built on NICE NG87 and DSM-5-TR, and cited as the adult quality standard by the NHSE ADHD Taskforce (2025). Open access (CC BY).",
      keyPoints: [
        "The gold standard is a detailed clinical exploration with a semi-structured interview, supported by collateral information. No biomarker, cognitive test or scan is accurate enough to diagnose ADHD.",
        "Evaluate each of the 18 DSM-5-TR symptoms in adulthood and in childhood, with clear examples. It must not be a tick-box exercise (essential).",
        "Recommended interviews: DIVA, CAADID or ACE+, or an expert interview that covers all symptoms, impairments and criteria (essential).",
        "Self-report symptom scales are for baseline and monitoring, not a formative part of the diagnosis.",
        "Impairment must be at least moderate in two or more domains. High achievement does not rule ADHD out.",
        "Total assessment time should be at least 2 hours in most cases (essential).",
        "The report must state that the symptoms are not better explained by another disorder (essential).",
        "Assessors should have several years of mental health experience, formal ADHD training and 10 to 20 supervised cases (highly recommended)."
      ],
      assessment: [
        "Orient the patient to the process, and use open-ended questions to avoid leading (essential).",
        "Assess by direct consultation, face to face or by video (essential).",
        "Onset must not rest on a snapshot impression. Screen for autism, tics and Tourette's, dyslexia, dyspraxia and intellectual disability (essential).",
        "Screen for current and past mental health problems that mimic or coexist with ADHD, and for conditions that change management, such as bipolar disorder or eating disorders (essential).",
        "Ask about seizures, head injury, sleep and diet. Record blood pressure, pulse and weight before medication; an ECG is not routinely needed.",
        "Always complete a risk assessment, including substance misuse and possible misuse or diversion of medication (essential).",
        "Seek informants who knew them in childhood and who know them now, and review school reports (highly recommended).",
        "Record impairment under education, employment, leisure, family and close relationships, friendships, daily tasks and self-image (highly recommended).",
        "In the report, show that criteria A to E were reviewed, state the presentation, list comorbidities present and absent, and discuss missing or contradictory information.",
        "Do not double count symptoms shared by ADHD and autism, and examine masking and compensation, especially in women (UKAP 2020)."
      ],
      url: "https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2024.1380410/full"
    },
    {
      id: "cr235",
      name: "ADHD in adults: good practice guidelines (College Report CR235)",
      org: "Royal College of Psychiatrists in Scotland",
      year: "2023 (updates the 2017 edition)",
      scope: "Practical guidance on referral, assessment, differential diagnosis, comorbidity and treatment of adult ADHD. Written for the Scottish system but College policy and relevant across the UK.",
      keyPoints: [
        "A good assessment takes time, uses several sources (third parties, school and health records) and is ideally multidisciplinary and longitudinal.",
        "Services need a referral threshold because ADHD traits are common in the population. The group found the ASRS undiscriminating for triage.",
        "Do not make the first appointment only a semi-structured interview: it can lead the patient, cause false positives and miss other diagnoses.",
        "Onset before 12 is required, but scaffolding from parents and schools can mask childhood symptoms.",
        "The absence of observable symptoms at interview does not exclude ADHD.",
        "The distinction between trait-based and state-based conditions is central to differential diagnosis.",
        "Comorbidity should not stop an assessment, but major mood disorders should be treated before assessing ADHD.",
        "Being unable to get corroborative history for reasons outside the patient's control should not necessarily exclude diagnosis and treatment."
      ],
      assessment: [
        "Referral information: early developmental history, symptoms in two or more settings, impact on functioning, medical history and examination, with blood pressure and pulse (Box 1). Desirable: WHODAS 2.0 or W-FIRS, AQ-10 and a developmental questionnaire.",
        "Take a standard psychiatric history and mental state examination with specific reference to DSM-5 or ICD-11 (9.1).",
        "Ask about additional adult features: affective instability, racing thoughts or mind-wandering, and difficulty getting to sleep (9.3).",
        "Early contact with speech and language therapy, occupational therapy, a health visitor or paediatrics suggests neurodevelopmental vulnerability (9.4).",
        "Instruments do not replace careful history taking. Patients who have read about ADHD may endorse most items (9.6).",
        "Differentials include bipolar disorder and EUPD (affective instability), complex PTSD, anxiety, autism, Tourette's, substance effects, hyperthyroidism, frontal lobe syndromes, sleep disorders and abnormal illness behaviour. Psychotic symptoms are not part of ADHD (9.7).",
        "Physical checklist: blood pressure, pulse, weight, height, cardiovascular history, tics or epilepsy, family cardiac history, liver disease and glaucoma (Box 2).",
        "Explore parenting roles routinely and use a trauma-informed approach (11.5, 11.6).",
        "Video assessment is acceptable: the quality of the assessment matters more than its mode (9.8)."
      ],
      url: "https://www.rcpsych.ac.uk/improving-care/campaigning-for-better-mental-health-policy/college-reports/2023-college-reports/cr235"
    },
    {
      id: "bap2014",
      name: "Evidence-based guidelines for the pharmacological management of ADHD: update on recommendations from the British Association for Psychopharmacology",
      org: "British Association for Psychopharmacology (BAP); Bolea-Alamañac et al., J Psychopharmacol 2014;28(3):179-203",
      year: "2014",
      scope: "Pharmacological management of ADHD across the lifespan, with sections on diagnosis, comorbidity and pre-treatment assessment. Older than NICE NG87, so some points are superseded. Licensed for personal research use only, so it is paraphrased here.",
      keyPoints: [
        "The diagnosis is clinical and needs significant impairment as well as symptoms.",
        "Under DSM-5, adults can be diagnosed with five symptoms instead of six, and ADHD can be diagnosed alongside autism.",
        "The literature does not support an ADHD of later onset without childhood symptoms, although many adults were never diagnosed as children.",
        "Neuropsychological tests should not be used on their own: their poor negative predictive value produces many false negatives. IQ testing is not mandatory. EEG is not recommended for diagnosis.",
        "Assessment of comorbidity should always be part of an ADHD diagnosis (standard of care).",
        "Superseded: the statement that medication is always first line in adults came from the 2008 guideline and was replaced by NG87 1.5.15."
      ],
      assessment: [
        "Consider neuropsychological assessment when impairment is greater than the symptoms would explain, or for educational or legal purposes.",
        "Before stimulants: full medical history, weight, height, blood pressure and pulse, cardiovascular examination, family and personal cardiac history, history of self-harm, and risk of misuse and diversion (Table 9).",
        "Before atomoxetine: the same checks, with liver history in place of misuse risk (Table 9).",
        "Use the later NICE NG87 1.7.4 and 1.7.5 criteria to decide on an ECG.",
        "Expect high rates of substance use, mood dysregulation and antisocial personality traits in adults with ADHD; about a quarter of adult male prisoners are estimated to have ADHD.",
        "Rating scales can assist but should not replace a detailed clinical assessment, because of false positives, false negatives and informant bias."
      ],
      url: "https://www.bap.org.uk/docdetails.php?docID=10"
    },
    {
      id: "kooij2019",
      name: "Updated European Consensus Statement on diagnosis and treatment of adult ADHD",
      org: "European Network Adult ADHD and the EPA Section for Neurodevelopmental Disorders Across the Lifespan (Kooij et al., Eur Psychiatry 2019;56:14-34)",
      year: "2019",
      scope: "Consensus of 63 experts on the adult clinical picture, diagnosis, comorbidity and treatment. A consensus statement, not a graded guideline. Open access (CC BY-NC-ND 4.0).",
      keyPoints: [
        "The clinical interview is essential and covers symptoms and impairment in both childhood and adulthood.",
        "Use a semi-structured interview such as DIVA (2.0, updated to DIVA-5), CAADID or ACE+.",
        "No neuropsychological or neurobiological test predicts the diagnosis well enough for individuals, and EEG is not accurate enough.",
        "Research suggests that four current symptoms may be the most appropriate adult cut-off; DSM-5 chose five out of concern about inflating prevalence.",
        "Lifetime comorbidity is 60 to 80%. Identify mood, anxiety, eating, sleep, substance use, personality, tic and autism spectrum disorders.",
        "Emotional dysregulation is common: short-lived reactive mood changes that return to baseline, unlike mood episodes.",
        "Sitting calmly during the assessment does not exclude ADHD.",
        "High intelligence can hide ADHD through compensation and lead to under-diagnosis."
      ],
      assessment: [
        "Start with the person's own account of symptoms, then a full interview, with psychiatric, somatic and family history.",
        "Establish childhood onset and current symptoms, with impairment in two or more domains such as school, work, home and relationships.",
        "Involve a parent or partner where possible. If nobody is available, school or social care reports may help.",
        "Many adults have limited insight: they may report many symptoms with little impairment, or the reverse.",
        "In apparent late onset, look carefully at impairment, psychiatric history and substance use.",
        "Some patients feign symptoms to obtain stimulants or accommodations. There is some evidence for performance validity tests.",
        "Screen targeted groups: relatives of people with ADHD, people with chronic mental disorders or several physical illnesses, and people in the criminal justice system.",
        "When conditions coexist, treat the most severe first: psychosis, bipolar disorder, substance misuse, severe depression and severe anxiety usually come first."
      ],
      url: "https://doi.org/10.1016/j.eurpsy.2018.11.001"
    },
    {
      id: "caddra",
      name: "Canadian ADHD Practice Guidelines, 4.1 edition",
      org: "Canadian ADHD Resource Alliance (CADDRA)",
      year: "2020 (4.1 edition; current as of 2026)",
      scope: "Diagnosis and treatment across the lifespan, with a free toolkit of forms: ASRS, WFIRS-S, WSR-II, SNAP-IV-26, the CADDRA ADHD Assessment Form and follow-up forms. Guideline text is copyright; forms are free for clinical use.",
      keyPoints: [
        "Rating scales are not sufficient for a diagnosis.",
        "Assess psychiatric health and risk at the start.",
        "Adult process: initial information gathering, medical review, ADHD-specific interview, then feedback and treatment recommendations, followed by long-term follow-up.",
        "Neuropsychological testing helps mainly when the diagnosis is uncertain. Continuous performance test results overlap between people with and without ADHD. CADDRA does not endorse EEG.",
        "About 85% of adults with ADHD have a comorbid condition.",
        "Symptoms may not show in a one-to-one interview; if they are visible, they are probably severe.",
        "Self-referral neither guarantees nor rules out a diagnosis, and good school performance does not rule ADHD out."
      ],
      assessment: [
        "Step 1: ASRS from the patient and from someone who knows them well, consider the WFIRS-S, and a retrospective childhood informant scale (SNAP-IV) where possible. Collect report cards and previous assessments.",
        "Screen broadly for comorbidity with the WSR-II, PHQ-9 and GAD-7.",
        "Step 2: medical review, including physical examination, medical mimics (hearing, vision, thyroid, anaemia, sleep disorders), lifestyle and contraindications to medication.",
        "Step 3: developmental history, symptoms before 12, collateral from parents or close relatives, and review of questionnaires, using the CADDRA ADHD Assessment Form or DIVA 2.0.",
        "Use the summary-of-findings grid: rate how strongly each source of evidence supports ADHD and whether any alternative explanation is better.",
        "Ask 'since when?' to separate lifelong ADHD from a recent change in mood.",
        "In students and young adults presenting for the first time, be alert to exaggeration to obtain accommodations or stimulants: check reports and collateral, and screen for substance use.",
        "Follow up with the ASRS and WFIRS-S; the Jerome Driving Questionnaire covers driving risk."
      ],
      url: "https://www.caddra.ca/canadian-adhd-practice-guidelines/"
    },
    {
      id: "aadpa",
      name: "Australian evidence-based clinical practice guideline for ADHD",
      org: "Australasian ADHD Professionals Association (AADPA), approved by the NHMRC",
      year: "2022 (summary in Aust N Z J Psychiatry 2023)",
      scope: "GRADE guideline adapted from NICE NG87 with updated evidence reviews, giving 113 recommendations across the lifespan. The website and full text are copyright; the 2023 journal summary (May et al.) is open access (CC BY 4.0).",
      keyPoints: [
        "No universal population screening. Services for high-risk groups could screen, and a positive screen must be followed by a full diagnostic assessment (1.2.1 to 1.2.5).",
        "Do not diagnose on rating scales or observation alone (2.1.4).",
        "Use more than one setting and more than one reporter to confirm pervasiveness (2.1.5).",
        "Consider ADHD at all ages, including over 65 (2.1.6).",
        "Compensation can mask symptoms, and inattention may only appear as demands rise (2.1.7).",
        "There are no specific conditions that must be excluded before ADHD can be diagnosed.",
        "Screening tools lose specificity in clinical groups such as depression, bipolar disorder and borderline personality disorder."
      ],
      assessment: [
        "The assessment includes strengths, a full developmental, mental health and medical history, observer reports, a mental state assessment and a medical assessment (2.1.2).",
        "Confirm DSM-5, ICD-10 or ICD-11 criteria, clinically significant impairment and pervasiveness, judging symptoms against age, developmental level and intellectual ability (2.1.3).",
        "A detailed interview typically takes 2 to 3 hours, possibly over several sessions; DIVA is one example of a semi-structured interview.",
        "Request school reports and any previous reports.",
        "Look for mimics and aggravators: hearing or vision impairment, thyroid disease, anaemia, sleep apnoea and sleep deprivation, and medicines or substances such as mood stabilisers, decongestants, asthma drugs, caffeine and levetiracetam (2.2.2).",
        "Higher-prevalence adult groups include borderline personality disorder, substance use, psychotic disorders, gambling, binge eating and suicidal behaviour (1.1.1).",
        "Psychometric or neuropsychological testing is not required, but helps when the diagnosis is uncertain or a learning disorder, intellectual disability or dementia is suspected.",
        "Take the person's own view of their symptoms into account (2.1.8)."
      ],
      url: "https://adhdguideline.aadpa.com.au/"
    },
    {
      id: "wfadhd",
      name: "The World Federation of ADHD International Consensus Statement: 208 evidence-based conclusions about the disorder",
      org: "World Federation of ADHD (Faraone et al., Neurosci Biobehav Rev 2021;128:789-818)",
      year: "2021 (a 2026 update was posted as a preprint in October 2026)",
      scope: "Evidence statements drawn only from large meta-analyses and cohort studies on the validity, prevalence, causes, outcomes and diagnosis of ADHD.",
      keyPoints: [
        "When made by a licensed clinician, the diagnosis is well defined and valid at all ages, even when other psychiatric disorders are present.",
        "ADHD cannot be diagnosed by rating scales alone, neuropsychological tests or brain imaging.",
        "Adult prevalence is about 2.5% in a meta-analysis and 2.8% in the WHO World Mental Health surveys.",
        "About 1 in 6 children with ADHD still meet full criteria at age 25, and about half have residual impairment (partial remission).",
        "Depression, bipolar disorder, autism, anxiety, oppositional and conduct disorders, eating disorders and substance use often coexist and do not rule ADHD out.",
        "ADHD raises the risk of accidents, substance use, unemployment, suicide and premature death.",
        "2026 update (preprint, not peer reviewed): adult prevalence about 3% worldwide; about 8% of adults with ADHD have bipolar disorder."
      ],
      assessment: [
        "Interview the patient and, where possible, a parent or caregiver, to document the criteria.",
        "Document developmentally inappropriate symptoms for at least 6 months, in different settings, with impairment, some symptoms and impairment in childhood, and no better explanation.",
        "High IQ does not exclude ADHD: it impairs highly intelligent people too.",
        "Expect physical comorbidity, such as obesity, asthma, allergy, diabetes, hypertension, sleep problems and epilepsy.",
        "About 1 in 5 people in prison have ADHD on interview-based diagnosis, so assess carefully in forensic settings."
      ],
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8328933/"
    },
    {
      id: "dsm5tr",
      name: "DSM-5-TR: the Diagnostic and Statistical Manual, fifth edition, text revision",
      org: "American Psychiatric Association",
      year: "2022 (ADHD criteria unchanged from DSM-5, 2013)",
      scope: "Diagnostic criteria A to E for ADHD, with presentations and specifiers. Used worldwide and, alongside ICD-11, in UK practice (NICE NG87 1.3.3 accepts either).",
      keyPoints: [
        "Two lists of nine symptoms: inattention and hyperactivity-impulsivity.",
        "From age 17, five or more symptoms in either list for at least 6 months; six for younger people.",
        "Several symptoms before age 12, several in two or more settings, clear interference with functioning, and no better explanation.",
        "The presentation (combined, predominantly inattentive or predominantly hyperactive-impulsive) is based on the past 6 months and can change over life.",
        "Specifiers: in partial remission; mild, moderate or severe.",
        "Autism is not an exclusion: both can be diagnosed.",
        "DSM-5-TR changed only the text (for example sex- and gender-related issues, culture and risk factors), not the criteria."
      ],
      assessment: [
        "Check every symptom against developmental level: it must be more frequent or more severe than in peers.",
        "Use the adult examples in the criteria: restlessness may be only a feeling, and distraction may come from unrelated thoughts.",
        "Do not count symptoms that are solely oppositional behaviour, defiance, hostility or failure to understand tasks.",
        "Use 'Other specified ADHD', with the reason recorded, when impairing symptoms fall short of full criteria.",
        "ICD-10-CM codes: F90.0 inattentive, F90.1 hyperactive-impulsive, F90.2 combined, F90.8 other specified, F90.9 unspecified."
      ],
      url: "https://www.psychiatry.org/psychiatrists/practice/dsm"
    },
    {
      id: "icd11",
      name: "ICD-11 Clinical descriptions and diagnostic requirements (CDDR): 6A05 Attention deficit hyperactivity disorder",
      org: "World Health Organization",
      year: "2024 (CDDR); ICD-11 in effect from 2022",
      scope: "WHO diagnostic requirements for ADHD, with presentation codes 6A05.0, 6A05.1, 6A05.2, 6A05.Y and 6A05.Z. Free to read under CC BY-NC-ND 3.0 IGO.",
      keyPoints: [
        "A persistent pattern (for example at least 6 months) of inattention and/or hyperactivity-impulsivity outside normal variation for age and intellectual development.",
        "'Several' symptoms are needed, with no fixed number. WHO deliberately avoids artificially precise cut-offs.",
        "Significant symptoms before age 12, although some people first come to attention later, when demands exceed their ability to compensate.",
        "Evident across multiple settings, and not better accounted for by another mental disorder, a substance or medication (including withdrawal), or a disease of the nervous system.",
        "Without corroboration of childhood history, an adult diagnosis should be made with caution.",
        "Abrupt onset of hyperactivity in adolescence or adulthood should raise the possibility of another cause, such as emerging psychosis or bipolar disorder.",
        "There is no severity or remission specifier."
      ],
      assessment: [
        "Seek a report from a significant other, family member or co-worker.",
        "Establish history before 12 from school or local records or from people who knew them in childhood.",
        "Inattention may not show during intensely stimulating or rewarding activities.",
        "Restlessness and poor concentration during a depressive episode count towards ADHD only if present since childhood and persisting after the episode.",
        "Inattention must not be due only to anxious preoccupation or occur only in anxiety-provoking situations.",
        "If inattention occurs only during tasks in the area of a learning difficulty, diagnose the developmental learning disorder rather than ADHD.",
        "Review medicines: carbamazepine, valproate, risperidone, bronchodilators and thyroid replacement can cause ADHD-like symptoms.",
        "For substances, the key tests are which came first and whether symptoms persist when the person is not intoxicated or withdrawing."
      ],
      url: "https://www.who.int/publications/i/item/9789240077263"
    },
    {
      id: "nhse2025",
      name: "Independent ADHD Taskforce reports (NHS England) and the Independent review into mental health conditions, ADHD and autism (DHSC)",
      org: "NHS England; Department of Health and Social Care",
      year: "2025 (Taskforce parts 1 and 2); 2026 (DHSC final report, October)",
      scope: "Policy reports with recommendations to government and the NHS. They are not clinical guidance and do not change NICE NG87, which has not been revised as of October 2026.",
      keyPoints: [
        "A clinical diagnosis of ADHD needs a full clinical assessment and cannot be made from questionnaires alone.",
        "A positive ASRS screen is not a diagnosis and, on its own, is not a reason for referral: adult screen-positive rates are much higher than diagnosis rates.",
        "Triage should not rely on questionnaire screening alone, but on additional information and supervision by an experienced clinician.",
        "NICE should define what an 'appropriately qualified' professional is; national competencies and quality standards (AQAS for adults) are recommended.",
        "All ADHD diagnostic assessments should become regulated by the Care Quality Commission (recommended, not yet in force).",
        "Misdiagnosis is more likely when assessment is brief, not face to face, fragmented, made without informants or records, or focused on a single condition (DHSC 2026).",
        "The DHSC review recommends a 'needs-led plus diagnosis' system, with digital tools supporting but never making decisions."
      ],
      assessment: [
        "Use informants and records, and avoid brief, single-condition assessments.",
        "Assess co-occurring conditions and functioning; WHODAS 2.0 is suggested as a functional measure.",
        "Keep decisions about suicide risk, self-harm and safeguarding with qualified professionals.",
        "Undiagnosed ADHD may be mistaken for anxiety or depression alone.",
        "Assessments for diagnosis, especially for prescribing, should meet accepted quality standards (AQAS for adults)."
      ],
      url: "https://www.gov.uk/government/publications/independent-review-into-mental-health-conditions-adhd-and-autism-final-report"
    }
  ]);

  /* ------------------------------------------------------------------ */
  /* Diagnostic criteria (paraphrased for teaching)                      */
  /* ------------------------------------------------------------------ */
  AA.add('criteria', {
    dsm5: {
      intro: "DSM-5-TR (American Psychiatric Association, 2022) uses the same ADHD criteria as DSM-5 (2013). All five criteria, A to E, must be met. The text below is a paraphrase for teaching; use the DSM-5-TR itself for formal diagnosis.",
      A: {
        t: "Criterion A: a persistent pattern of symptoms",
        d: "A persistent pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning or development. Symptoms have lasted at least 6 months, are out of keeping with developmental level, and have a direct negative effect on social and academic or occupational activities. They are not solely oppositional behaviour, defiance, hostility or failure to understand tasks or instructions. Threshold for each list: 6 or more symptoms up to age 16, and 5 or more from age 17. Each symptom must happen 'often'.",
        items: [
          "A1a. Misses details or makes careless mistakes; work is inaccurate.",
          "A1b. Struggles to keep attention on tasks, reading, lectures or long conversations.",
          "A1c. Seems not to be listening when spoken to directly; the mind is elsewhere.",
          "A1d. Starts tasks but loses focus and leaves duties or instructions unfinished.",
          "A1e. Has trouble organising tasks, time and belongings; misses deadlines.",
          "A1f. Avoids or dislikes tasks needing sustained mental effort, such as reports, forms or long documents.",
          "A1g. Loses things needed for tasks, such as keys, wallet, phone, paperwork or glasses.",
          "A1h. Easily distracted by things going on around them or, in adults, by unrelated thoughts.",
          "A1i. Forgetful in daily life, for example returning calls, paying bills or keeping appointments.",
          "A2a. Fidgets or squirms, or taps their hands or feet.",
          "A2b. Leaves their seat when expected to stay seated, for example in meetings.",
          "A2c. Runs about or climbs where inappropriate; in adolescents and adults this may be only a feeling of restlessness.",
          "A2d. Unable to take part in leisure activities quietly.",
          "A2e. Constantly on the go, as though driven by a motor; uncomfortable staying still for long, for example in restaurants or meetings.",
          "A2f. Talks excessively.",
          "A2g. Blurts out an answer before a question is finished; completes other people's sentences.",
          "A2h. Has trouble waiting their turn, for example in a queue.",
          "A2i. Interrupts or intrudes on others; takes over what others are doing or uses their things without asking."
        ]
      },
      B: {
        t: "Criterion B: onset before age 12",
        d: "Several inattentive or hyperactive-impulsive symptoms were present before age 12. DSM-5-TR does not give a number for 'several', and impairment before 12 is not required (DSM-IV required impairing symptoms before age 7).",
        items: [
          "Evidence comes from the person's recall, a parent or older sibling, school reports and childhood records.",
          "This app treats 3 or more childhood symptoms as a working guide for 'several' and asks you to confirm it. This is an app convention, not a DSM-5-TR rule.",
          "High ability, structure or support may have hidden symptoms; impairment may appear only when demands rise. That is late presentation, not late onset.",
          "NICE NG87 1.3.3: an uncertain time of onset should not by itself exclude the diagnosis.",
          "A genuine onset after 12 should prompt a careful search for other causes, such as mood disorder, trauma, substance use, sleep problems or a medical condition."
        ]
      },
      C: {
        t: "Criterion C: two or more settings",
        d: "Several symptoms are present in two or more settings, for example at home, at work or school, with friends or relatives, or in other activities.",
        items: [
          "NICE uses 'settings' for places and 'domains' for areas of functioning.",
          "Ask for an example from each setting rather than accepting a general statement.",
          "Symptoms seen only with one manager, or only at home during a crisis, point to a situational cause.",
          "NICE NG87 1.3.3 also requires symptoms to happen often in two or more important settings."
        ]
      },
      D: {
        t: "Criterion D: impairment",
        d: "There is clear evidence that the symptoms interfere with, or reduce the quality of, social, academic or occupational functioning.",
        items: [
          "NICE NG87 1.3.3 sets the UK bar at least at moderate psychological, social, educational or occupational impairment.",
          "UKAAN AQAS: at least moderate impairment in two or more domains, based on interview and observation.",
          "Judge impairment against what the person could manage without the symptoms, not only against average achievement: high achievers can be impaired.",
          "Rate each domain with examples. Scales such as the WFIRS-S support the judgement but do not replace the interview."
        ]
      },
      E: {
        t: "Criterion E: not better explained",
        d: "The symptoms do not occur only during schizophrenia or another psychotic disorder, and are not better explained by another mental disorder, for example a mood, anxiety, dissociative or personality disorder, or substance intoxication or withdrawal.",
        items: [
          "Autism is not an exclusion: both can be diagnosed.",
          "'Better explained' means the other condition accounts for the symptoms and their timing. Coexisting conditions are common and allowed.",
          "Use the time course: lifelong, trait-like symptoms favour ADHD; episodic symptoms with a clear onset favour mood or anxiety disorders.",
          "UKAAN AQAS: the report must state explicitly that the symptoms are not better explained by another disorder.",
          "ICD-11 also excludes the effects of substances or medication (including withdrawal) and diseases of the nervous system."
        ]
      },
      presentations: [
        "Combined presentation (ICD-10-CM F90.2): criteria A1 and A2 are both met for the past 6 months.",
        "Predominantly inattentive presentation (F90.0): A1 is met but A2 is not met for the past 6 months.",
        "Predominantly hyperactive-impulsive presentation (F90.1): A2 is met but A1 is not met for the past 6 months.",
        "The presentation describes the current picture and can change over life, which is why DSM-5 replaced 'subtype' with 'presentation'.",
        "In adults, hyperactivity often declines or becomes inner restlessness (ICD-11 CDDR), and the inattentive presentation is the most common (WFADHD 2026 update, preprint)."
      ],
      specifiers: [
        "In partial remission: full criteria were met in the past, fewer than full criteria have been met for the past 6 months, and the symptoms still impair social, academic or occupational functioning.",
        "Mild: few, if any, symptoms beyond those required, and no more than minor impairment.",
        "Moderate: symptoms or impairment between mild and severe.",
        "Severe: many symptoms beyond those required, or several symptoms that are particularly severe, or marked impairment.",
        "A DSM-5-TR 'mild' case with only minor impairment may not meet the NICE NG87 1.3.3 requirement for at least moderate impairment."
      ],
      other: "Other specified ADHD (ICD-10-CM F90.8): ADHD-type symptoms cause clinically significant distress or impairment but do not meet full criteria, and the clinician records the reason, for example 'with insufficient inattention symptoms'. Unspecified ADHD (F90.9): the same situation when the clinician does not give a reason, for example because there is not enough information. Both replaced DSM-IV 'ADHD not otherwise specified'. The app maps them to ICD-11 6A05.Y and 6A05.Z as the nearest codes, but in ICD-11 these are presentation categories of ADHD, not subthreshold diagnoses."
    },
    icd11: {
      intro: "ICD-11 (WHO) codes ADHD as 6A05 in the chapter on neurodevelopmental disorders. The Clinical Descriptions and Diagnostic Requirements (CDDR, 2024) describe essential features rather than fixed counts, leaving more room for clinical judgement. UK services use ICD-11 and DSM-5-TR, and NICE NG87 1.3.3 accepts either.",
      essential: [
        "A persistent pattern, for example over at least 6 months, of inattention and/or hyperactivity-impulsivity that is outside the limits of normal variation for age and intellectual development.",
        "Several inattentive symptoms and/or several hyperactive-impulsive symptoms, with a direct negative impact on academic, occupational or social functioning. There is no fixed number.",
        "Inattention typically shows as: difficulty sustaining attention on tasks that are not stimulating or rewarding, careless mistakes and unfinished tasks; distractibility, including by unrelated thoughts, and seeming not to listen; losing things, forgetfulness, and difficulty planning, managing and organising.",
        "Hyperactivity-impulsivity typically shows as: excessive activity (in adolescents and adults, a feeling of physical restlessness and discomfort with being still); difficulty being quiet and talking too much; blurting out, interrupting and difficulty waiting; and acting without considering risks, for example impulsive decisions or reckless driving.",
        "Evidence of significant symptoms before age 12. Some people first come to clinical attention later, often when demands exceed their ability to compensate.",
        "The symptoms are evident across multiple situations or settings, although how they show varies with the structure and demands of each setting.",
        "The symptoms are not better accounted for by another mental disorder, are not due to a substance or medication (including withdrawal), and are not due to a disease of the nervous system."
      ],
      codes: [
        "6A05.0 Predominantly inattentive presentation: all requirements met, and inattentive symptoms predominate.",
        "6A05.1 Predominantly hyperactive-impulsive presentation: all requirements met, and hyperactive-impulsive symptoms predominate.",
        "6A05.2 Combined presentation: both types are clinically significant and neither clearly predominates.",
        "6A05.Y Other specified presentation.",
        "6A05.Z Presentation unspecified.",
        "'Predominate' means several symptoms of one type with few or none of the other. The code describes the current presentation.",
        "ICD-10 crosswalk (CDDR): 6A05.0 maps to F90 or F98.8 (F98.8 if there are no hyperactive-impulsive symptoms); 6A05.1 to F90.8; 6A05.2 to F90.0; 6A05.Y to F90.8 or F98.8; 6A05.Z to F98.9."
      ],
      differences: [
        "Symptom count: DSM-5-TR needs 5 or more in a list from age 17 (6 or more below 17); ICD-11 needs 'several', with no fixed number.",
        "Duration: DSM-5-TR requires 6 months; ICD-11 gives 'for example at least 6 months' as guidance rather than a strict cut-off.",
        "Onset: both use before age 12. ICD-11 adds that first presentation may come later, when compensation fails.",
        "Impairment: DSM-5-TR needs clear evidence of interference or reduced quality of functioning; ICD-11 needs a direct negative impact. NICE adds 'at least moderate'.",
        "Exclusions: ICD-11 explicitly excludes substance or medication effects (including withdrawal) and nervous system disease; DSM-5-TR lists substance intoxication or withdrawal among the possible better explanations.",
        "Specifiers: DSM-5-TR has severity and partial remission; ICD-11 has neither.",
        "Both allow ADHD and autism to be diagnosed together.",
        "ICD-10 hyperkinetic disorder (F90) was narrower: onset before 7, symptoms needed in all three groups (inattention, overactivity and impulsivity), and exclusion when mood, anxiety or pervasive developmental disorders were present. Attention deficit without hyperactivity was coded F98.8.",
        "ICD-11 describes a severe, pervasive combined pattern, also seen by the clinician, as what used to be called hyperkinetic disorder."
      ]
    },
    diva2: {
      intro: "DIVA 2.0 (Kooij and Francken, DIVA Foundation, 2010) is a semi-structured interview built on the DSM-IV criteria. It asks about each of the 18 symptoms twice, first for adulthood (the past 6 months or longer) and then for childhood (ages 5 to 12), with concrete examples the clinician can tick. It then covers onset, impairment in five areas of life, and how far collateral information supports the diagnosis. It takes about 90 minutes and does not cover other mental health conditions, so a full psychiatric assessment is still needed. DIVA-5 (2019) is the DSM-5 version and is paid. This app follows the same structure with its own wording.",
      scoring: [
        "For each symptom, ask about adulthood first and then childhood. Tick the examples the person recognises and note any examples of their own.",
        "Score a symptom present when it is clearly more frequent or more severe than in peers of similar age and ability, or is closely tied to impairment. Not every example needs to be present.",
        "Ask whether the partner (for adulthood) or a parent or older relative (for childhood) agrees or can add examples. Where accounts conflict, use clinical judgement; the DIVA manual treats the patient as usually the best informant.",
        "Count inattention (A) and hyperactivity-impulsivity (H/I) separately, for childhood and for adulthood.",
        "Criterion A on the DIVA 2.0 score form: 6 or more symptoms in a list, in childhood and in adulthood (DSM-IV). A footnote cites research suggesting 4 or more may be enough in adults.",
        "Criterion B: symptoms and problems present since childhood and persisting through life. DIVA 2.0 asks whether symptoms were present before age 7 (the DSM-IV rule) and records the age of onset if later.",
        "Criteria C and D: symptoms and impairment in at least two of five areas (work or study; relationships and family; friends and social contacts; leisure and hobbies; self-esteem and self-image), in adulthood and in childhood, and at least moderately impairing.",
        "Criterion E: record whether another psychiatric disorder better explains the symptoms, and if so which.",
        "Collateral: rate support separately from parents or siblings, from a partner or friend, and from school reports, as not available, 0 (none or little support), 1 (some support) or 2 (clear support), and record who gave it.",
        "Outcome: diagnosis yes or no, with the DSM-IV subtype codes 314.01 (combined), 314.00 (predominantly inattentive) and 314.01 (predominantly hyperactive-impulsive). If the childhood and adult subtypes differ, the adult (current) subtype is used."
      ],
      note: "The app's main result uses DSM-5-TR rules (5 or more adult symptoms from age 17, several before 12, at least moderate impairment per NICE). The DIVA 2.0 view (6 or more in childhood and adulthood, the 4 or more research footnote, onset before 7) is shown for comparison only. DIVA 2.0 and DIVA-5 are copyright of the DIVA Foundation: DIVA-5 costs 10 euros per clinician, distribution is prohibited, and digital versions need a contract with word-for-word wording. The app does not reproduce DIVA questions or examples; clinicians who own DIVA-5 can obtain it from divacenter.eu."
    },
    changes: [
      "DSM-IV to DSM-5 (2013): ADHD moved into the new chapter of neurodevelopmental disorders.",
      "Age of onset: raised from 7 to 12. DSM-5 needs several symptoms before 12, instead of some impairing symptoms before 7. APA found no clinical differences between children identified by 7 and those identified later.",
      "Adult threshold: lowered from 6 to 5 symptoms per list from age 17, because a lower threshold was enough for reliable diagnosis in adults.",
      "Examples were added for adolescents and adults (for example unrelated thoughts, paying bills, feeling restless, meetings). The 18 symptoms themselves did not change.",
      "'Subtype' was replaced by 'presentation', because the picture can change over a lifetime.",
      "Settings: 'some impairment in two or more settings' became 'several symptoms in two or more settings'.",
      "Impairment: reworded as clear evidence that symptoms interfere with, or reduce the quality of, functioning; severity specifiers were added.",
      "Autism was removed as an exclusion, so ADHD and autism can be diagnosed together.",
      "'ADHD not otherwise specified' was replaced by 'Other specified ADHD' and 'Unspecified ADHD'.",
      "DSM-5 to DSM-5-TR (2022): no change to the ADHD criteria. Only the text changed, for example sex- and gender-related issues, culture and risk factors.",
      "ICD-10 to ICD-11 (in effect from 2022): hyperkinetic disorder (F90) was replaced by ADHD (6A05) with presentation codes; onset moved from before 7 to before 12; there is no fixed symptom count; autism no longer excludes ADHD. NICE updated NG87 to refer to ICD-11 in January 2023."
    ]
  });
})(window.AA);
