/* tx-guide: the "What to do in this step" coach for the five treatment steps (ARCHITECTURE.md 5.9):
   txplan, baseline, prescribe, titrate, monitor. Merged into the existing stepGuide collection.
   Written for an independent prescribing pharmacist working inside a specialist ADHD team, for adults and
   young people (6 to 17). Each entry: goal, time, do (ordered actions), say (lines for the person or family),
   watch (pitfalls), done (how to know the step is complete), next, src.
   Facts match tx-products.js and tx-pathway.js. Step times are clinical practice estimates. */
AA.add('stepGuide', {

  /* ------------------------------------------------------------------ T1 */
  txplan: {
    goal: "Agree what happens after the diagnosis: information and support first, then whether medicine is right now, and who can safely start it.",
    time: "About 30 minutes, often at a separate feedback appointment",
    do: [
      "Check the diagnosis is recorded in the Summary step. If ADHD was not diagnosed, stop here: no ADHD medicine. Under 6: refer to a service with expertise in ADHD in young children.",
      "Explain the diagnosis and the treatment options, and give written information. Ask what the person (and the family, for a young person) most wants to change.",
      "Young people: offer ADHD-focused support to parents or carers. Add a parent-training programme if there are oppositional or conduct symptoms. With consent, contact the school.",
      "Put environmental modifications in place at home, school or work, and review them. Medicine comes only if significant impairment remains after they have been made and reviewed (young people and adults).",
      "Adults: offer a non-drug option (a structured, ADHD-focused psychological intervention with regular follow-up) instead of medicine or alongside it. It is a choice, not a hurdle.",
      "Give diet advice to everyone: the value of a balanced diet, good nutrition and regular exercise. For children and young people also: no omega-3 or other fatty acid supplements, no general removal of colourings or additives, and if a food seems to affect behaviour, a food diary and then a dietitian.",
      "Check your scope. You start ADHD medicine only inside a specialist ADHD team, trained and competent for this medicine and age group, with supervision and a team (MDT) agreed. If you cannot tick all three, hand over to a colleague who can.",
      "If medicine is planned, re-check the diagnosis before starting: the criteria are still met, treatment is needed, and coexisting conditions and circumstances have been reviewed. If the recorded findings disagree with the diagnosis, sort that out first.",
      "Record the decision: medication, non-drug support only, defer, or refer."
    ],
    say: [
      "ADHD is common and treatable. Some things help without medicine, and medicine is an option we can add on top.",
      "Medicine does not change who you are. It can make it easier to focus and to stop and think. If it does not suit you, we can stop it.",
      "For a young person: what would you most like to be different at school and at home? Your views count in this decision.",
      "If we try medicine, we start low, check in about every week, and change the dose step by step."
    ],
    watch: [
      "Scope: NICE says only a professional with training and expertise in diagnosing and managing ADHD should start ADHD medicine. A pharmacist prescriber does this inside a specialist team, with supervision and governance, never alone.",
      "Young people: do not skip support and environmental changes. Medicine needs all three: persistent significant impairment after modifications were made and reviewed, an ADHD information discussion, and a baseline assessment.",
      "Under 6: this tool does not cover treatment. No ADHD medicine is licensed under 6; under 5, NICE puts group parent training first and asks for a second specialist opinion before any medicine.",
      "Anxiety, tics and autism get the same medicine choices as anyone with ADHD. Titrate more slowly and monitor more often with autism, tics, learning disability, anxiety (including OCD), depression, bipolar disorder or schizophrenia, personality disorder, an eating disorder, PTSD, substance misuse, heart disease, epilepsy or brain injury.",
      "Consent: 16 to 17, presume capacity. Under 16, check Gillick competence or get consent from a person with parental responsibility. The Fraser guidelines are for contraception, not ADHD."
    ],
    done: [
      "The treatment decision is recorded.",
      "The plan items for this age group are ticked, or the notes say why not.",
      "If medicine is planned, all three scope boxes and the diagnosis re-check are ticked."
    ],
    next: "If medicine is planned, go to Pre-treatment checks: heart history, blood pressure, pulse, height and weight, and the safety screen.",
    src: [
      "NICE NG87 1.3.1, 1.3.4, 1.3.6, 1.4.12",
      "NICE NG87 1.5.1–1.5.6 (shared plan), 1.5.7–1.5.9 (under 5), 1.5.10–1.5.14 (children 5 and over), 1.5.15–1.5.18 (adults)",
      "NICE NG87 1.6.1–1.6.5 (diet)",
      "NICE NG87 1.7.2 (who starts medication), 1.7.4 (re-check the diagnosis and the need for treatment), 1.7.18, 1.7.28",
      "GMC 0–18 years paras 24–28; Family Law Reform Act 1969 s8; Mental Capacity Act 2005",
      "Main course Module 9 (pharmacist scope ladder)",
      "Step time: clinical practice estimate"
    ]
  },

  /* ------------------------------------------------------------------ T2 */
  baseline: {
    goal: "Make sure ADHD medicine is safe to start: confirm the need, check the heart history, measure blood pressure, pulse, height and weight, and screen for contraindications, misuse risk, pregnancy and driving.",
    time: "20 to 30 minutes",
    do: [
      "Check that the diagnosis re-check in the treatment plan is done (criteria still met, treatment needed). Review coexisting conditions, education or work, and care needs.",
      "Measure pulse and blood pressure with a cuff of the right size, seated and rested. Measure height and weight.",
      "Young people: plot height and weight on a growth chart, and blood pressure on a centile chart for age and height. Record which chart you used. Blood pressure consistently above the 95th centile: refer to a paediatric hypertension specialist before starting.",
      "Adults: if clinic blood pressure is 140/90 or higher, take a second reading and use the lower one. Still raised: offer ambulatory (ABPM) or home (HBPM) readings. 180/120 or higher: do not start; follow NICE NG136.",
      "Ask the heart-history questions aloud. Any yes: get a cardiology opinion (with an ECG) before starting. A medicine for another condition that may raise cardiac risk: do an ECG.",
      "Work through the contraindication and caution screen. Check all current medicines, including over-the-counter, herbal and illicit drugs.",
      "Liver disease: record the Child-Pugh class (atomoxetine starting and target doses are 50% for class B and 25% for class C). Ask separately about CYP3A4 inhibitors (guanfacine dose halved) and strong CYP3A4 inducers, including St John's wort (guanfacine may need re-titration up to 7 mg).",
      "Rate the risk of misuse or diversion: the person's own use, others at home, and any past selling or sharing.",
      "Discuss pregnancy and contraception with anyone who could become pregnant (12 and over: ask, never assume). Ask about driving at 17 and over.",
      "Read the verdict card. Deal with every red or amber line before you go on."
    ],
    say: [
      "Before any ADHD medicine we check your heart, blood pressure, pulse, height and weight, so we have a starting point to compare with.",
      "Has anyone in your family died suddenly of a heart problem before the age of 40? Have you ever fainted, or got very breathless, when exercising?",
      "Some ADHD medicines are controlled drugs. Does anyone at home use drugs, or has anyone ever asked you for your tablets?",
      "Could you be pregnant, or are you planning a pregnancy? It changes which medicine is safest."
    ],
    watch: [
      "No routine ECG. It is needed only with a heart-history feature, or a medicine that may raise cardiac risk.",
      "NICE sets no baseline heart-rate threshold: compare the pulse with the normal range for age. A resting pulse over 120: recheck and look for a cause before starting.",
      "A cuff that is too small gives falsely high readings. Use the right size, especially for older children and larger adults.",
      "This tool does not hold paediatric centile tables. Use your service's chart and say which one.",
      "Glaucoma, phaeochromocytoma, an MAOI in the last 14 days and serious heart disease rule out most ADHD medicines. Guanfacine is the exception: its only contraindication is hypersensitivity, but it lowers blood pressure and pulse.",
      "Older adults: the methylphenidate, dexamfetamine and guanfacine SmPCs say they should not be used in older people (safety and efficacy not established; most methylphenidate products were not studied over 60 or 65). Lisdexamfetamine and atomoxetine have limited data. Any use is a specialist decision."
    ],
    done: [
      "Blood pressure, pulse, height and weight are recorded (young people: with the centile band).",
      "Every heart-history and screen question has an answer.",
      "The verdict is green, or amber with a plan; any ECG, ABPM or cardiology result is recorded."
    ],
    next: "Go to Choose and prescribe: the NICE order for this age, then the product, dose, counselling and prescription.",
    src: [
      "NICE NG87 1.7.4 (baseline), 1.7.5 (cardiology opinion), 1.7.6 (paediatric hypertension), 1.7.23–1.7.24 (misuse), 1.7.28",
      "NICE NG136 1.1.4, 1.2.2–1.2.8, 1.5.1–1.5.3 (adult blood pressure)",
      "SmPC sections 4.2–4.6 of each ADHD medicine (see the product cards); atomoxetine SmPC section 4.2 (Child-Pugh); Intuniv SmPC sections 4.2, 4.5 and Table 3 (CYP3A4)",
      "UKTIS (pregnancy); GOV.UK ADHD and driving",
      "Clinical practice: cuff size advice; step time estimate"
    ]
  },

  /* ------------------------------------------------------------------ T3 */
  prescribe: {
    goal: "Choose the medicine and product in the NICE order for this age, set a safe starting dose, counsel the person, and write a legal prescription.",
    time: "20 to 30 minutes",
    do: [
      "Record any previous ADHD medicines: the product, the highest dose, how long, and why it stopped. A trial counts only after 6 weeks at an adequate dose.",
      "Follow the NICE order. Young people: methylphenidate first; lisdexamfetamine after an adequate 6-week methylphenidate trial; dexamfetamine if lisdexamfetamine helps but its longer effect cannot be tolerated; atomoxetine or guanfacine if a stimulant is not tolerated or both did not help. Adults: lisdexamfetamine or methylphenidate as a shared choice; switch to the other after an adequate 6-week trial that did not help enough; dexamfetamine (off-label) only if lisdexamfetamine helps but its longer effect cannot be tolerated; atomoxetine if either cannot be tolerated or neither helped after separate 6-week trials; then a second opinion or tertiary referral (guanfacine in adults only with tertiary advice).",
      "Choose the product: licensed for this age, the hours of cover needed, food rules, whether a capsule can be opened, excipients and misuse risk. Prefer once-daily modified-release. Prescribe modified-release methylphenidate by brand.",
      "With a risk of misuse or diversion, do not offer immediate-release stimulants, or modified-release ones that can easily be injected or snorted.",
      "Set the starting dose from the dose plan. Atomoxetine under 70 kg and guanfacine need today's weight.",
      "Counsel the person (and parent or carer) with the checklist: how and when to take it, what to expect, side effects to report, controlled drug rules, driving, travel and school.",
      "Write the prescription. Schedule 2: dose, form, strength, total quantity in words and figures, signed and dated with your address; valid for 28 days; usually no more than 30 days' supply; no repeats.",
      "Book the first contact (for example a phone call in a week) and the blood pressure and pulse check after the first dose change."
    ],
    say: [
      "We start with a low dose and raise it about once a week until we find the dose that helps most with the fewest side effects.",
      "Stimulants work on the day you take them and wear off later in the day. Atomoxetine and guanfacine are different: they build up over several weeks.",
      "This is a controlled drug. Keep it somewhere safe, never share it, and order the next prescription before you run out.",
      "Tell us straight away about chest pain, fainting, a racing heartbeat at rest, seeing or hearing things, or thoughts of harming yourself."
    ],
    watch: [
      "Licences differ by product: Equasym XL, Addepta XL, Tuzulby and Medikinet tablets are for children only; Matoride XL cannot be started in an adult; dexamfetamine and guanfacine are not licensed in adults. Explain and record any off-label use.",
      "Do not switch between modified-release methylphenidate products that are not bioequivalent. Equasym XL matches no other product; Medikinet XL needs particular care.",
      "Dose by product, not by drug. Keep to each SmPC maximum; BNF/BNFC off-label ceilings are for specialist decisions only. Dexamfetamine in children and young people: usually up to 20 mg a day; up to 40 mg only in rare cases, as a specialist decision with the reason recorded.",
      "Different medicines have no conversion factor: a new medicine starts at its own starting dose. No washout is needed between methylphenidate and lisdexamfetamine.",
      "Atomoxetine with fluoxetine or paroxetine (strong CYP2D6 inhibitors): titrate more slowly; a lower final dose may be needed. Known CYP2D6 poor metabolisers: consider a lower starting dose. Atomoxetine with SSRIs, SNRIs, triptans, tramadol or tricyclics: watch for serotonin syndrome. Medikinet XL and Ambinet XL: never with proton pump inhibitors, H2 blockers or antacids. Guanfacine with a moderate or strong CYP3A4 inhibitor (clarithromycin, ketoconazole, grapefruit juice): halve the dose, rounded down to whole tablets because they must not be broken. With a strong CYP3A4 inducer (carbamazepine, rifampicin, phenytoin, St John's wort): re-titration up to 7 mg a day may be considered.",
      "More than 30 days' supply of a Schedule 2 medicine needs a recorded reason."
    ],
    done: [
      "The medicine, product, starting dose and start date are recorded.",
      "The counselling checklist for this medicine is ticked.",
      "The prescription checklist is complete and the prescription text is copied into your prescribing system."
    ],
    next: "Go to Titration and reviews. Log each contact: dose, blood pressure, pulse, weight, benefit and side effects.",
    src: [
      "NICE NG87 1.7.2–1.7.3, 1.7.7–1.7.17 (choice of medicine), 1.7.20–1.7.24 (formulation, misuse), 1.7.25 (controlled drug law)",
      "Misuse of Drugs Regulations 2001 regs 15–16; NICE NG46 1.5.5",
      "SmPC sections 4.1–4.5 of each product (dexamfetamine 4.2: usual maximum 20 mg, 40 mg in rare cases; Intuniv 4.2: CYP3A4); SPS: prescribing and switching between modified-release methylphenidate (updated 28 Aug 2025)",
      "MHRA Drug Safety Update (Sept 2022): prescribe modified-release methylphenidate by brand",
      "Clinical practice: no washout between methylphenidate and lisdexamfetamine; first-contact timing; rounding a halved guanfacine dose down to whole tablets"
    ]
  },

  /* ------------------------------------------------------------------ T4 */
  titrate: {
    goal: "Find the best tolerated dose: review often, measure, ask about benefit and side effects, and decide the next step.",
    time: "10 to 20 minutes per review",
    do: [
      "Review about once a week during titration, by phone or face to face, as agreed with the specialist team.",
      "At baseline and each dose change, record symptoms, impairment and side effects on a standard rating scale (from parents and teachers for a young person).",
      "Measure blood pressure and pulse before and after each dose change. Weigh at each visit; plot a young person's weight and height on the growth chart.",
      "Ask about the whole day: when it starts working, when it wears off, and how appetite, sleep and mood are.",
      "Decide: increase, stay, reduce, switch or stop. Increase only if more benefit is needed and side effects are tolerable, and never above the SmPC maximum.",
      "Act on flags. Resting pulse over 120, an arrhythmia, or a significant blood pressure rise on 2 occasions: reduce the dose and refer. Psychosis or mania: stop all ADHD medicine. Signs of liver injury, new or more frequent seizures, suicidal thoughts or self-harm, and chest pain, fainting or breathlessness on exertion are urgent even when mild: arrange a same-day review.",
      "After 6 weeks at an adequate dose, judge the trial. Not enough benefit: move to the next NICE option. When the dose is right, mark it optimised."
    ],
    say: [
      "Compared with before the medicine, what has changed at school or work, and at home?",
      "When in the day do you notice it working, and when does it wear off?",
      "How is your appetite at lunchtime? What time are you falling asleep?",
      "Have you felt low, anxious or irritable, or had any strange experiences? Have you had any thoughts of harming yourself or of ending your life?",
      "Have you had chest pain, fainted, or been very out of breath when exercising?"
    ],
    watch: [
      "A 6-week trial means 6 weeks at the best tolerated dose, not a few weeks at the starting dose.",
      "Titrate more slowly and review more often with autism, tics, learning disability, anxiety (including OCD), depression, bipolar disorder or schizophrenia, personality disorder, an eating disorder, PTSD, substance misuse, epilepsy, heart disease or brain injury.",
      "One high pulse or blood pressure reading: repeat it and look for causes (caffeine, decongestants, anxiety) before acting.",
      "Late-afternoon wear-off or rebound is common: think about timing or a product with a different profile before raising the dose. Methylphenidate only: a morning modified-release dose can be topped up with immediate release later.",
      "The methylphenidate and lisdexamfetamine SmPCs advise stopping if there is no improvement after suitable dose adjustment over about a month.",
      "Guanfacine: weekly checks of sleepiness, blood pressure and pulse during titration; never stop it suddenly."
    ],
    done: [
      "Each review has a date, dose, blood pressure, pulse and weight.",
      "The dose is marked optimised, or a decision to switch or stop is recorded with the reason."
    ],
    next: "Once the dose is optimised and stable, go to Monitoring and shared care.",
    src: [
      "NICE NG87 1.7.8, 1.7.12–1.7.13 (6-week trials), 1.7.19, 1.7.22, 1.7.26–1.7.28",
      "NICE NG87 1.8.6, 1.8.9, 1.8.11–1.8.18",
      "Methylphenidate and Elvanse SmPC section 4.2 (stop if no improvement); Intuniv SmPC sections 4.2, 4.4",
      "Methylphenidate, Elvanse, Amfexa and atomoxetine SmPC section 4.4 (exertional chest pain or fainting: prompt cardiac evaluation; suicidal thoughts: evaluate at once; atomoxetine liver injury); NICE NG87 1.8.16 (seizures)",
      "Clinical practice: single readings; same-day review for urgent side effects; step time estimate"
    ]
  },

  /* ------------------------------------------------------------------ T5 */
  monitor: {
    goal: "Keep treatment safe and worthwhile over time: a monitoring schedule, an annual review, and a safe hand-over of prescribing to the GP under shared care.",
    time: "15 to 30 minutes per review; longer for the annual review",
    do: [
      "Set the schedule. Young people: height every 6 months; weight every 3 months at 10 and under, or at 3 and 6 months then every 6 months over 10; pulse and blood pressure every 6 months and around each dose change. Adults: weight, pulse and blood pressure every 6 months and around each dose change.",
      "At every contact ask about sleep, mood, behaviour, tics, seizures and side effects. On atomoxetine, ask young people and adults about sexual problems.",
      "Keep reviewing misuse and diversion risk as circumstances and age change; involve parents and carers.",
      "Once the dose is stable and results are satisfactory, ask the GP to share care. Send the letter (diagnosis, exact product and dose, baseline and latest measurements, due dates, action thresholds, when to hand back, contacts). Keep prescribing until the GP agrees.",
      "Do the annual review in the 8 NICE areas. Consider a trial off medicine or a lower dose, and record why treatment continues.",
      "Agree when the GP hands back: an action threshold crossed, a new mental health problem, seizures, pregnancy, missed monitoring, or treatment possibly no longer needed.",
      "Young people from Year 9 (age 13 to 14) at the latest, or straight away if they joined close to transfer: start planning the move to adult services. From 16, use the care programme approach to help the transfer. Reassess the need at school-leaving age; transfer is usually complete by 18."
    ],
    say: [
      "Your GP will take over the prescriptions and the routine checks, and we will still see you at least once a year.",
      "Once a year we look at whether you still need the medicine. Sometimes a planned break helps us find out.",
      "If you plan a pregnancy, start a new medicine, or notice your heart racing or your mood changing, contact us."
    ],
    watch: [
      "No routine blood tests (including liver tests) or ECGs without a clinical reason.",
      "Shared care is voluntary for the GP. Do not stop prescribing until the GP has agreed.",
      "The annual review, any planned trial off medicine and the guanfacine \"still needed?\" review stay with the specialist team: they are not in the GP's monitoring table.",
      "Modified-release methylphenidate must stay on the same brand unless the specialist changes it.",
      "Weight loss: try food timing, extra meals and high-calorie foods before a break or a switch. Height falling below the expected centile: consider a planned break over the school holidays.",
      "Guanfacine: checks at least every 3 months in the first year, and taper when stopping (rebound hypertension).",
      "At 18 some products are not licensed: Equasym XL, Addepta XL, Tuzulby, Medikinet tablets, dexamfetamine and guanfacine; Matoride XL may continue but cannot be started in an adult."
    ],
    done: [
      "The shared care status and the next review date are recorded.",
      "The annual review checklist is ticked when it has been done.",
      "Young people aged 13 to 17: the transition plan is recorded."
    ],
    next: "Go to Report to add the treatment sections to the draft report, and copy the shared care letter.",
    src: [
      "NICE NG87 1.7.29 (shared care), 1.8.1–1.8.19 (monitoring), 1.10.1–1.10.3 (annual review)",
      "NICE NG87 1.1.4–1.1.5 and NICE NG43 1.2.1 (transition: planning from Year 9 at the latest)",
      "NHS England national shared care protocol: atomoxetine in adults (v1, July 2022); local protocols vary",
      "Intuniv SmPC section 4.2; SmPC section 4.1 of each product (adult licences)",
      "Step time: clinical practice estimate"
    ]
  }
});
