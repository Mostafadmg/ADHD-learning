/* stepGuideYoung: the "What to do in this step" coach for children and young people aged 6-17
   (same shape as stepGuide, ARCHITECTURE.md 5.9: goal, time, do, say, watch, done, next, src).
   The frame uses an entry here when AA.diagnosis.young(a) is true and the entry exists; otherwise it uses stepGuide.
   Entries: setup, screen, risk, history, comorbid, ia, hi, onset, collateral, ddx, validity, summary, report.
   (The treatment steps have their own guide in tx-guide.js.)
   Original content in plain UK English. Sources sit in src (shown in a closed Sources disclosure), not in the text.
   NICE NG87 clause numbers were checked against the live guideline on 25 Oct 2026 (research brief, section 1).
   Consent law: research brief section 3. Tool ages and cut-offs: research brief section 4 and the tool entries.
   Step times and interview wording are clinical practice estimates. */
(function (AA) {
  'use strict';

  AA.add('stepGuideYoung', {

    /* ------------------------------------------------------------------ 1 */
    setup: {
      goal: 'Start safely: confirm the age band, who can consent, who knows the child best now, and what school information you need.',
      time: '15-20 minutes',
      do: [
        'Enter the age first. It sets the age band, the symptom threshold and the questions in every step. Under 6, stop here and refer to a service with expertise in ADHD in young children.',
        'Before the appointment, send the parent and teacher rating scales, and ask the school for a current report with work samples, attendance and any SEN support plan or EHCP. Read the referral and any records from the GP, health visitor, speech and language therapy, educational psychology or CAMHS.',
        'Record the school and year group, SEN support or EHCP, and whether the child is looked after. If they are, record the social worker: who can consent depends on the legal order.',
        'Check who has parental responsibility. Then choose the consent basis that fits the age: under 16, Gillick competence, or a parent\'s consent with the child\'s assent; from 16, the young person\'s own consent.',
        'Ask for consent to contact the school, and record it. Note a teacher who knows the child well and can be contacted.',
        'Explain the assessment twice: to the parent or carer, and to the child in words that suit their age. Use the scripts on this page.',
        'From about 12, plan time with the young person on their own. Explain confidentiality and its limits first.',
        'Book a professional interpreter if the family needs one. Do not ask the child or a relative to interpret.',
        'Record consent and assent, and anything that was not agreed.'
      ],
      say: [
        'Today I will talk with you and with your child. I will ask about home, school and friends: how things are now, and when they first started.',
        'There are no right or wrong answers. Real examples help me more than labels.',
        'With your consent, I would like to contact school, because I need to know how things are there too.',
        'To the child: my job is to find out what things are like for you. You are not in trouble, and you can have a break whenever you need one.'
      ],
      watch: [
        'Pharmacist scope: an ADHD diagnosis is made by a specialist with training and expertise in diagnosing ADHD. A pharmacist assesses young people only inside a specialist ADHD team, with the right training, governance and supervision. Check this applies to you before you start.',
        'Separated parents may both hold parental responsibility. One person with parental responsibility is usually enough to consent, but if parents disagree and it cannot be resolved, get advice.',
        'Do not use the Fraser guidelines: they cover contraception and sexual health. Use Gillick competence. In Scotland a different law applies, and it names a medical practitioner, so check local policy.',
        'A child who is calm and focused one-to-one in clinic may still have ADHD. A new, interesting setting with an adult\'s full attention is where many children manage best.',
        'Explain at the start that you will share information if you are worried about anyone\'s safety.'
      ],
      done: [
        'Reference, age and consent are recorded, so the step shows as complete.',
        'You know who has parental responsibility, the consent basis, and whether you may contact the school.',
        'The parent or carer, the teacher and the child or young person each have a way to give their view.'
      ],
      next: 'Go to Screening questionnaires and enter the parent and teacher rating scales you sent out before the appointment.',
      src: [
        'NICE NG87 1.3.1 (who diagnoses ADHD; full assessment with observer reports) and 1.3.6 (the child\'s or young person\'s own views)',
        'NICE NG87 1.5.7-1.5.9 (children under 5)',
        'Gillick v West Norfolk and Wisbech AHA [1986]; GMC 0-18 years, paragraphs 24-32',
        'Mental Capacity Act 2005; Family Law Reform Act 1969 s8 (England and Wales); Age of Legal Capacity (Scotland) Act 1991 s2(4)',
        'NSPCC Learning: Gillick competence and Fraser guidelines',
        'Clinical practice: seeing the young person on their own from about 12; step time'
      ]
    },

    /* ------------------------------------------------------------------ 2 */
    screen: {
      goal: 'Collect parent and teacher ratings of the child\'s current behaviour, as a baseline and as prompts for the interview, never as the diagnosis.',
      time: '10-15 minutes',
      do: [
        'Check each returned form: who completed it, the date, the child\'s age and school year, and whether the child was taking ADHD medicine at the time.',
        'Most child scales are licensed and not reproduced here. Score them on the official form or the publisher\'s system, then enter the result: the score, whether it reaches the cut-off, who rated it and the date.',
        'Aim for at least one parent rating and one teacher rating. Ratings from two settings give a first view of criterion C.',
        'Use scales that fit the age: Vanderbilt 6-12, ADHD-RS-5 5-17, Conners 4 6-18 (self-report from 8), SDQ up to 17 (self-report from about 11). Tools outside the child\'s age are hidden.',
        'Add the WFIRS-P for the parent\'s view of impairment and, for teenagers, the WFIRS-S for their own.',
        'Note the high-scoring items and settings, to explore with examples in the interview. Note any big gap between the parent and the teacher.',
        'If your service uses QbTest (an option from 6 to 17), record the result and who interpreted it in the notes.'
      ],
      say: [
        'When you filled this in, were you thinking about the last six months, or a particularly bad patch?',
        'Was your child taking any medicine for ADHD when you, or the teacher, filled these in?',
        'These forms help me see where to focus. On their own they do not give the answer.'
      ],
      watch: [
        'Rating scales do not diagnose ADHD. NICE names the Conners scales and the SDQ as helpful added tools only.',
        'Parent and teacher ratings often disagree, because the settings and demands differ. Disagreement is information: ask both for examples.',
        'Ratings made while the child is on medication understate symptoms.',
        'High scores also come with anxiety, trauma, autism, learning difficulties, language disorder and stress at home.',
        'A teacher who has known the child only briefly gives weaker evidence than one who has taught them for months.',
        'Do not copy licensed items into notes or letters. Record the scores only.'
      ],
      done: [
        'At least one rating scale result is entered, so the step shows as complete. Ideally there is one from a parent and one from a teacher.',
        'You have a short list of high-scoring items and settings to explore.'
      ],
      next: 'Go to Safety and risk. Ask about safety before the long interview.',
      src: [
        'NICE NG87 1.3.1 (QbTest as an option for ages 6-17, added May 2025) and 1.3.2 (rating scales such as the Conners and SDQ as added tools)',
        'Tool ages, licences and cut-offs: research brief 25 Oct 2026, section 4, and each tool\'s entry in the tools library',
        'Clinical practice: informant disagreement, teacher familiarity, step time'
      ]
    },

    /* ------------------------------------------------------------------ 3 */
    risk: {
      goal: 'Find and act on any risk to the child or young person, or to others, before the assessment goes further.',
      time: '10-15 minutes',
      do: [
        'Ask the parent or carer about safety: accidents and injuries, running off, risky play, going missing, and any worry about harm to or from others.',
        'From about 12, ask the young person on their own about self-harm, thoughts of suicide, bullying in person or online, feeling unsafe at home, and anyone pressuring them to carry or sell things or to send images.',
        'Ask about missed school and time missing from home, and whether the young person looks after a family member (a young carer).',
        'For teenagers, ask about alcohol, cannabis, vaping and other drugs. At 17, ask about learner driving.',
        'Tick what you find in the list on this page and read the actions. For any urgent item, pause the ADHD assessment and act today under your local safeguarding and crisis procedures.',
        'Record the words used, who you told and the action taken. Tell the young person what you will share and why, where it is safe to do so.',
        'Tick Safety reviewed only when there is no immediate risk, or a plan is in place.'
      ],
      say: [
        'To the young person: I ask everyone your age about safety. Have you ever hurt yourself on purpose, or had thoughts of ending your life?',
        'Does anyone at home, at school or online make you feel unsafe, or pressure you to do things you do not want to do?',
        'To the parent: has your child had more accidents or injuries than other children? Have they ever gone missing?',
        'What you tell me stays private unless I am worried about your safety or someone else\'s. If that happens, I will talk to you first where I can.'
      ],
      watch: [
        'Children with ADHD have more accidents, and teenagers more risk-taking. Ask everyone, not only those who seem low.',
        'Questionnaire flags, such as a positive self-harm item, are prompts. Decisions about risk and safeguarding stay with you and your safeguarding lead.',
        'Do not use risk tools or scales to predict suicide or self-harm, or to decide who gets help.',
        'Exploitation can look like defiance: missing episodes, new older friends, unexplained money or phones, carrying drugs. Treat it as a safeguarding concern, not a behaviour problem.',
        'A safeguarding concern can justify sharing information without consent. You explained this limit at the start.'
      ],
      done: [
        'Every urgent or high item ticked has an action recorded.',
        'Safety reviewed is ticked.',
        'You have decided whether the assessment can safely continue today.'
      ],
      next: 'Go to Clinical history. If you found an urgent risk, deal with it first: the ADHD assessment can be rebooked.',
      src: [
        'Working Together to Safeguard Children 2023 (England), or the equivalent guidance where you work',
        'NICE NG76 (child abuse and neglect)',
        'NICE NG225 (self-harm): do not use risk tools or scales to predict suicide or self-harm',
        'Clinical practice: questions, exploitation signs, step time'
      ]
    },

    /* ------------------------------------------------------------------ 4 */
    history: {
      goal: 'Build the developmental, family, school and health history that the diagnosis and the differentials depend on.',
      time: '30-45 minutes',
      do: [
        'Pregnancy and birth: alcohol, drugs and smoking in pregnancy, prematurity, birth weight and early problems.',
        'Development: milestones, speech and language, coordination, play, early temperament and sleep.',
        'Nursery and school: when the concerns started, what each teacher said, learning progress, SEN support or EHCP, exclusions, school moves and attendance.',
        'Family: who lives at home, who has parental responsibility, changes and losses, and any family history of ADHD, autism, learning difficulties, mental illness, or sudden cardiac death under 40.',
        'Ask about the parents\' or carers\' own mental health and how they are coping. Do it sensitively, with the child out of the room if needed.',
        'Physical health: hearing and vision checks, seizures or staring spells, head injury, snoring and sleep, appetite and growth, medicines and allergies.',
        'Adversity and social care: trauma, neglect, domestic abuse, being looked after, social worker involvement. Time any adversity against the first ADHD symptoms.',
        'Strengths and interests: what the child enjoys and is good at. They matter for the plan and for the child\'s self-esteem.'
      ],
      say: [
        'Tell me about the pregnancy and the first few years. When did you first notice something was different?',
        'What did nursery and each teacher say about your child?',
        'Does anyone else in the family have similar difficulties, now or as a child?',
        'How are you coping at the moment? Is anything affecting the family that I should know about?'
      ],
      watch: [
        'Alcohol in pregnancy can cause fetal alcohol spectrum disorder, which can look like ADHD. Ask without blame, and record what is known and not known.',
        'Brief staring spells several times a day that cannot be interrupted suggest absence seizures, not inattention. Refer for a specialist opinion.',
        'Hearing loss, poor vision and sleep problems, including snoring and sleep apnoea, can cause inattention. Check that hearing and vision have been tested.',
        'A parent\'s own ADHD, low mood or stress affects both the child and the account. It is a reason to offer support, not to discount the report.',
        'If the problems started suddenly, ask what changed at that time: a move, a loss, abuse, bullying or illness.'
      ],
      done: [
        'Each history section has ticks, notes, or None recorded.',
        'The parents\' or carers\' mental health has been asked about.',
        'Family history of sudden cardiac death under 40 and the child\'s cardiac symptoms are recorded, ready for any medication baseline.'
      ],
      next: 'Go to Co-occurring conditions screen.',
      src: [
        'NICE NG87 1.3.4 (needs, coexisting conditions, family and educational circumstances, physical health, and the parents\' or carers\' mental health)',
        'NICE NG87 1.2.1 (groups with a higher prevalence of ADHD, such as children born preterm and looked-after children)',
        'NICE NG87 1.7.4-1.7.5 (cardiac history before medication)',
        'NICE QS204 (fetal alcohol spectrum disorder)',
        'NICE NG217 (epilepsies): absence seizures',
        'Clinical practice: history prompts, step time'
      ]
    },

    /* ------------------------------------------------------------------ 5 */
    comorbid: {
      goal: 'Screen for the conditions that most often co-occur with ADHD in children and young people, or can look like it.',
      time: '10-20 minutes',
      do: [
        'First read the SDQ emotional, conduct and peer scores, and any oppositional or anxiety-depression screens on the SNAP-IV or Vanderbilt.',
        'Add the screens the history points to: RCADS (8-18) or MFQ for anxiety and low mood; PHQ-A (11-17) for depression; CRAFFT (12 and over) for alcohol and drugs; AQ-10 Child (4-11) or AQ-10 Adolescent (12-15), both only for children without a learning disability, or the SCQ for autistic traits. At 16 and 17 the adult AQ-10 is offered as clinical practice.',
        'Ask young people to complete self-report scales on their own, after you have explained confidentiality.',
        'Ask about sleep for every child: settling, night waking, snoring, daytime sleepiness and screens at night.',
        'Ask about tics, coordination, reading, writing and maths, and understanding and using language.',
        'Enter each result (score, cut-off, rater, date). Positive screens are carried to the differential step.',
        'Act today on any urgent flag, such as thoughts of self-harm, in the Safety and risk step.'
      ],
      say: [
        'Some children with these difficulties also worry a lot or feel low. Does that happen for your child?',
        'To the young person: lots of people your age try alcohol or vaping. What about you and your friends? This stays private unless I am worried about your safety.',
        'How does your child sleep? Do they snore?'
      ],
      watch: [
        'Co-occurring conditions are common in children with ADHD, and a positive screen does not rule ADHD out. Ask when each problem started compared with the attention problems.',
        'Defiance on its own is not an ADHD symptom. Ask whether the child cannot do the task, or will not.',
        'Anxious children can look inattentive and restless. Ask whether the problems show in calm, safe settings too.',
        'Autistic traits and ADHD often co-occur. Do not count one behaviour for both.',
        'Most child screens are information-only here. Score them on the official form and enter the result.'
      ],
      done: [
        'Every screen the history called for is entered, or the reason it was not done is in the notes.',
        'Sleep, tics, learning and language have been asked about.',
        'Each positive screen has a note on timing, and urgent items have gone to Safety and risk.'
      ],
      next: 'Start the interview with Inattention.',
      src: [
        'NICE NG87 1.3.4 (assess coexisting conditions)',
        'Tool ages, licences and cut-offs: research brief 25 Oct 2026, section 4 (RCADS, MFQ, PHQ-A, CRAFFT, SCQ, AQ-10 Child and Adolescent)',
        'DSM-5-TR criterion A note: behaviour that comes only from defiance or not understanding does not count (paraphrased)',
        'Clinical practice: screening questions, step time'
      ]
    },

    /* ------------------------------------------------------------------ 6 */
    ia: {
      goal: 'Decide, with real examples from home and school, which of the nine inattention symptoms are present now and, from age 12, which were present before 12.',
      time: '30-45 minutes',
      do: [
        'Set the frame: now means the last 6 months. For ages 6 to 11 that is the only period. From 12, also ask about primary school, before age 12.',
        'Ages 6 to 11: read the question to the parent or carer. From 12: ask the young person first, then the parent. Use the teacher\'s question by phone, or the teacher\'s report.',
        'Ask for a recent, specific example from home and one from school. Tick only the examples someone actually describes, and type their words.',
        'Judge against children of the same age and developmental level: is it more than in classmates, often, for at least 6 months, and does it cause problems?',
        'Record who reports it now: parent, teacher or the young person. A symptom seen at home and at school is stronger evidence than one seen in one place.',
        'Score Yes, Unsure or No. Score Unsure if you are waiting for the teacher, and come back after collateral.',
        'Flag possible mimics for the differential step: not understanding instructions, anxiety, low mood, poor sleep, absence seizures, a learning difficulty, or problems in one class only.',
        'If your service uses Young DIVA-5 or ACE v.2, use it alongside and record its conclusions here.',
        'After the ninth symptom, answer the supplement question.'
      ],
      say: [
        'To the parent: can you give me an example from the last few weeks, at home or with homework?',
        'Compared with other children in the class, is that more, less or about the same?',
        'To the young person: when the teacher is explaining something, what happens to your attention?',
        'What do teachers say about this at parents\' evening or in reports?'
      ],
      watch: [
        'Do not lead. Ask the open question first and use the examples only as prompts. A general yes is not enough: get a real example.',
        'Work left unfinished only because of defiance, or because the child did not understand the instruction or the language, does not count.',
        'The youngest in the year group can look less attentive than classmates. Compare with children of the same age, not with the class.',
        'Girls and quiet children are often described as daydreamy or chatty rather than disruptive, so their inattention is easily missed.',
        'A child who manages one-to-one in clinic may still struggle in a class of 30.',
        'Teenagers may play problems down, and parents of teenagers may not see schoolwork. Ask the school.'
      ],
      done: [
        'All nine symptoms are scored for now and, from 12, for before age 12. Unsure is allowed, to revisit.',
        'Every symptom scored Yes has an example, ideally from more than one setting.',
        'The supplement question is answered, and possible mimics are flagged.'
      ],
      next: 'Go to Interview part 2: hyperactivity-impulsivity. Offer the child a break first.',
      src: [
        'DSM-5-TR criterion A1 and the criterion A note on defiance and not understanding (paraphrased): 6 symptoms in a domain under 17, 5 from 17',
        'NICE NG87 1.3.5 (adjust the criteria for age-appropriate behaviour) and 1.3.6',
        'Young et al. 2020, UKAP consensus on girls and women with ADHD',
        'DIVA Foundation (Young DIVA-5) and Psychology Services Ltd (ACE v.2): optional interview schedules',
        'Clinical practice: relative age, order of informants, step time'
      ]
    },

    /* ------------------------------------------------------------------ 7 */
    hi: {
      goal: 'Decide, with real examples, which of the nine hyperactivity-impulsivity symptoms are present now and, from age 12, which were present before 12.',
      time: '20-35 minutes',
      do: [
        'Ask about the classroom, mealtimes, car journeys, assemblies, the playground and bedtime. Ask the teacher about staying seated, calling out and waiting for a turn.',
        'For younger children, ask about running and climbing where it is not allowed, noisy play and being always on the go. For teenagers, ask about feeling restless inside, fidgeting, and finding lessons or films hard to sit through.',
        'For the three impulsivity symptoms, ask about blurting out answers, waiting in queues and games, and interrupting or barging into other people\'s games and conversations.',
        'Ask about accidents and injuries, and acting without thinking: running into the road, climbing, risky dares and, for teenagers, money, phones and online behaviour.',
        'Score Yes, Unsure or No for each period in use, record who reports it now, and flag mimics.',
        'After the ninth symptom, answer the supplement question and check the counts against the threshold in the live summary.'
      ],
      say: [
        'To the parent: what is your child like at mealtimes, or on a long car journey?',
        'Does the teacher say your child calls out, leaves their seat or finds it hard to wait their turn?',
        'To the young person: when you have to sit still in a lesson, what is that like for you?'
      ],
      watch: [
        'Calm behaviour in clinic does not exclude ADHD. Judge from usual behaviour across settings.',
        'Quick, unplanned outbursts are common in ADHD. Deliberate defiance, arguing and spite point to oppositional defiant disorder. Both can be present.',
        'Restlessness only when anxious, after a reminder of a trauma, or from medicines such as bronchodilators, does not count.',
        'A sudden change in a teenager, with much less need for sleep and very high or irritable mood, points to another cause such as bipolar disorder or substances.',
        'Hyperactivity often lessens in adolescence, so the before-12 picture may be clearer than the present.',
        'Judge activity and talkativeness against children of the same age and cultural background.'
      ],
      done: [
        'All nine symptoms are scored for each period in use.',
        'Every symptom scored Yes has an example.',
        'The supplement question is answered, and the live summary shows the presentation or that the threshold is not reached.'
      ],
      next: 'Go to Onset and impairment: when the problems began and what they cost the child.',
      src: [
        'DSM-5-TR criterion A2 (paraphrased)',
        'WHO ICD-11 CDDR 6A05 (boundaries with mania; hyperactivity lessening with age)',
        'Clinical practice: questions, step time'
      ]
    },

    /* ------------------------------------------------------------------ 8 */
    onset: {
      goal: 'Decide when the symptoms began (criterion B), whether they show in two or more settings (C), and how much they impair the child (D).',
      time: '15-25 minutes',
      do: [
        'Ages 6 to 11: criterion B is judged from the current symptoms, because now is before 12. Still record the age the parent first noticed problems, and whether they started gradually or suddenly.',
        'From 12: use the before-12 scores, the parent\'s account and primary school reports to decide whether several symptoms were present before 12.',
        'Confirm that the symptoms have lasted at least 6 months and are present most of the time, not only in a bad patch or one term.',
        'Rate impairment in each area: school and learning, family and home, friends and peers, activities, self-esteem, self-care, and accidents and risk-taking. Ask what happens, how often and what it costs.',
        'Ask the child or young person how the problems affect them, and take their view into account when you judge how severe the impairment is.',
        'Check the settings: symptoms must show in two or more, usually home and school. If problems are only at school or only at home, look harder for another explanation.',
        'Write a short note on onset and the main areas of impairment, in the family\'s words.'
      ],
      say: [
        'To the parent: when did you first notice these difficulties? Were they there at nursery or in Reception?',
        'Did anything change around that time, such as a move, a new baby, a loss or a new school?',
        'To the child: what is the hardest thing for you at school? And at home?',
        'What would be different for your child if these difficulties were not there?'
      ],
      watch: [
        'A sudden start, or problems that began after a clear event, suggests another cause: trauma or abuse, bullying, seizures, sleep problems, a medical condition or substances. Ask what changed.',
        'Problems in one setting only point to something about that setting: the class, a learning difficulty, bullying, or stress at home.',
        'NICE asks for at least moderate impairment. Mild problems alone are below the threshold: rate against the anchors, not the parent\'s distress alone.',
        'Rate impairment caused by the ADHD symptoms, not by a co-occurring condition alone.',
        'Support at school, such as a teaching assistant or a quiet room, can hide impairment. Ask what happens without it.'
      ],
      done: [
        'The onset questions (and, from 12, before age 12) and the 6-month duration are answered.',
        'Every impairment area is rated for each period in use.',
        'Criteria B, C and D show a status in the live summary.'
      ],
      next: 'Go to Collateral information. The teacher\'s account tests the settings and impairment you have just rated.',
      src: [
        'DSM-5-TR criteria B, C and D (paraphrased)',
        'NICE NG87 1.3.3 (at least moderate impairment, in 2 or more important settings) and 1.3.6 (the child\'s own view of impairment)',
        'WHO ICD-11 CDDR 6A05 (abrupt onset suggests another cause)',
        'Clinical practice: questions, step time'
      ]
    },

    /* ------------------------------------------------------------------ 9 */
    collateral: {
      goal: 'Bring together the parent\'s account now, the teacher\'s account of school, and the child\'s or young person\'s own view.',
      time: '15-30 minutes per informant, often by phone or in writing',
      do: [
        'With consent, speak to a teacher who knows the child well: the class teacher, form tutor or SENCO. Use the teacher questions on this page, and ask for a current report with work samples.',
        'Read the school information: reports across several years, attendance, behaviour logs, exclusions, SEN support plans, an EHCP and any educational psychology reports.',
        'Rate how far each source supports the history: 0 none or little, 1 some, 2 clear and specific, or n/a when not available.',
        'Record the child\'s or young person\'s own view in their words: what they find hard, what helps and what they want.',
        'If the accounts disagree and you are unsure, arrange a school observation, or ask a second teacher or a club leader.',
        'Go back to symptoms scored Unsure and update them with the new evidence.',
        'Record who gave each account, how and when.'
      ],
      say: [
        'To the teacher: how does this child compare with others in the class for attention, sitting still and waiting their turn?',
        'What support is in place, and what happens when it is not there?',
        'To the young person: what do you think makes school hard for you? What helps?'
      ],
      watch: [
        'Parents and teachers often disagree, because settings and demands differ. Record both views and why they might differ; do not simply pick one.',
        'A parent\'s own ADHD, mood or stress can colour their account. Specific examples weigh more than general impressions.',
        'Teachers may not know a child well early in the school year, and may notice behaviour more than quiet inattention.',
        'The young person\'s view counts when you judge how severe the impairment is, even when they play the problems down.',
        'Contact the school only with consent, and share only what is needed.'
      ],
      done: [
        'Parent and school sources are each rated 0, 1, 2 or n/a, and the young person\'s own view is recorded.',
        'Who gave each account, and how, is recorded.',
        'Symptoms scored Unsure have been revisited.'
      ],
      next: 'Go to Differential diagnosis. With the whole picture in hand, decide whether anything else explains it better.',
      src: [
        'NICE NG87 1.3.1 (observer reports), 1.3.2 (school observation when there is doubt about symptoms) and 1.3.6 (the child\'s or young person\'s own views)',
        'DIVA collateral rating 0, 1, 2 (structure only)',
        'Clinical practice: consent before contacting the school; informant disagreement; step time'
      ]
    },

    /* ------------------------------------------------------------------ 10 */
    ddx: {
      goal: 'For each condition that can look like ADHD at this age, decide whether it is absent, co-occurring or a better explanation (criterion E).',
      time: '20-30 minutes',
      do: [
        'Start with Signals from this assessment: positive screens, history items and interview flags.',
        'Review the core conditions for this age. Children: oppositional defiant disorder, conduct disorder, attachment difficulties and developmental trauma, developmental language disorder, fetal alcohol spectrum disorder, young for the school year, the family or school environment, autism, specific learning disorders, intellectual disability, DCD, tics, depression, generalised and social anxiety, PTSD, snoring and sleep apnoea, other sleep problems, hearing or vision problems, absence epilepsy, normal variation and high ability. From 12, also bipolar disorder, cannabis and alcohol use, eating disorders, delayed sleep phase and gaming disorder.',
        'For each, ask the questions that tell them apart and tick the features you find.',
        'Apply the tests: did the problems start in early childhood, do they show in more than one setting, do they persist when the other problem is absent or treated, and does the other condition explain every symptom?',
        'Check that hearing and vision have been tested. Arrange other tests only if the history or examination points to them.',
        'Choose a verdict for each and write one line of reasoning. For an uncertain verdict, plan what will settle it: a school observation, a speech and language or educational psychology assessment, a hearing test, or a specialist opinion.',
        'Work through the step-by-step protocol further down the page.'
      ],
      say: [
        'Does your child understand instructions when they are said once, or do they need them repeated or shown?',
        'Is your child\'s behaviour different with different adults, or in different places?',
        'Has anything frightening or very upsetting happened to your child?',
        'To the young person: have you ever had a spell of days when you needed much less sleep and felt full of energy?'
      ],
      watch: [
        'Co-occurrence is common. Choose Better explains only when the alternative accounts for the symptoms, not just because it is present.',
        'Do not diagnose antisocial personality disorder under 18, and be very cautious with any personality disorder diagnosis in a young person.',
        'Language problems can look like inattention: a child who does not understand cannot follow instructions.',
        'Trauma and attachment difficulties can look like ADHD, and both can be present. Time the symptoms against the adversity.',
        'The youngest children in a school year are more often referred. Compare with children of the same age.',
        'Problems in one setting only point to that setting, not to ADHD.'
      ],
      done: [
        'Every core condition for this age and every signalled condition has a verdict.',
        'Each uncertain verdict has a plan to settle it.',
        'You can write one sentence on why the symptoms are, or are not, better explained by something else.'
      ],
      next: 'Go to Symptom validity and consistency.',
      src: [
        'DSM-5-TR criterion E (paraphrased); antisocial personality disorder needs age 18 or over',
        'WHO ICD-11 CDDR 6A05 (boundaries with other disorders)',
        'NICE NG87 1.3.2 (school observation when there is doubt)',
        'Clinical practice: core differentials for young people, relative age, step time'
      ]
    },

    /* ------------------------------------------------------------------ 11 */
    validity: {
      goal: 'Decide how much weight each account can bear: agreement between sources, pressures on the assessment, and over- or under-reporting.',
      time: '10-15 minutes',
      do: [
        'Compare the parent\'s account, the teacher\'s account, the young person\'s view and the records, symptom by symptom.',
        'Look for the reason behind any gap: different demands at home and school, a parent\'s own stress, a teacher who knows the child only briefly, or a young person who plays problems down.',
        'Ask neutrally about pressures on the assessment, such as a school exclusion, an EHCP application, benefits, a family court case or a dispute between parents. Record them without judgement.',
        'Check the response-style indexes of any rating scale that has them, such as the Conners 4.',
        'Tick the indicators that apply and choose the level of concern.',
        'If you are worried about fabricated or induced illness, do not confront the family. Discuss it with your safeguarding lead and follow local procedures.'
      ],
      say: [
        'Different people often see different sides of a child. Can you help me understand why school sees this differently?',
        'What do you hope the assessment will lead to?'
      ],
      watch: [
        'A pressure or incentive is common and is not evidence of exaggeration. Weigh it with everything else.',
        'Disagreement between parent and teacher is normal and is not a validity concern on its own.',
        'Fabricated or induced illness is rare but serious. Alerting signs include reported problems that no one else ever sees, and repeated requests for more assessments, diagnoses or medicines.',
        'Young people may play problems down to avoid a label, or over-report after reading about ADHD online.'
      ],
      done: [
        'The level of concern is recorded, with reasons.',
        'Any safeguarding concern has been discussed with your safeguarding lead.'
      ],
      next: 'Go to Scoring and diagnosis.',
      src: [
        'RCPCH: Perplexing presentations and fabricated or induced illness in children (2021)',
        'Working Together to Safeguard Children 2023 (England)',
        'Clinical practice: informant comparison, step time'
      ]
    },

    /* ------------------------------------------------------------------ 12 */
    summary: {
      goal: 'Bring the evidence together, check criteria A to E for this age, and record your conclusion.',
      time: '15-20 minutes',
      do: [
        'Criterion A: 6 or more symptoms in a domain under 17, or 5 or more at 17, for at least 6 months.',
        'Criterion B: for ages 6 to 11, from the current picture and the age of onset; from 12, several symptoms before 12.',
        'Criteria C and D: symptoms at home and at school, and at least moderate impairment, with the child\'s own view taken into account.',
        'Criterion E: the differentials for this age, each with a verdict.',
        'Record the presentation (combined, inattentive or hyperactive-impulsive), the severity and any co-occurring conditions.',
        'Record your decision: ADHD, other specified ADHD, not ADHD, or deferred until more information arrives.',
        'If you are a pharmacist, agree the conclusion with the supervising consultant or the team, as your service\'s governance requires.'
      ],
      say: [
        'When you prepare feedback: here is what we found at home and at school, and what it means.'
      ],
      watch: [
        'Rating scales and a clinic observation do not diagnose ADHD on their own.',
        'Do not diagnose from one setting or one informant.',
        'Deferring is a valid outcome. Gather more evidence rather than force a decision.'
      ],
      done: [
        'A decision is recorded, so the step shows as complete.',
        'The presentation, severity and co-occurring conditions are recorded.'
      ],
      next: 'If ADHD is diagnosed, go to Treatment plan. Otherwise go to Report and next steps.',
      src: [
        'DSM-5-TR criteria A-E (paraphrased)',
        'NICE NG87 1.3.1-1.3.3 and 1.3.6',
        'Clinical practice: pharmacist decisions within team governance'
      ]
    },

    /* ------------------------------------------------------------------ 13 */
    report: {
      goal: 'Give clear feedback to the family and the young person, agree the plan, and finalise a report that shows how you reached the conclusion.',
      time: '30-60 minutes',
      do: [
        'Give feedback to the parent or carer and, separately and in words that suit their age, to the child or young person. Leave time for questions.',
        'If ADHD is diagnosed, give information about ADHD and offer ADHD-focused support for parents and carers. It can be a group, and as short as 1 or 2 sessions.',
        'If there are oppositional or conduct problems, also offer a parent-training programme.',
        'With consent, contact the school: the diagnosis, how ADHD may affect school life, any co-occurring condition, the plan and reasonable adjustments. Do this again when symptoms change, and at each move to a new school, college or university.',
        'Explain that medicine is offered only if significant impairment persists after changes at home and school have been made and reviewed, after information about ADHD has been discussed, and after a baseline check.',
        'Encourage a balanced diet and exercise. Do not advise removing colourings or additives as a general treatment, or offer omega-3 or other fatty acid supplements. If a food seems to affect behaviour, suggest a food diary and a dietitian.',
        'If the young person is close to the age of transfer, start planning the move to adult services now. It should usually be complete by 18, and planning normally starts by Year 9.',
        'Read the draft report, correct any earlier step that is wrong, copy it into the record, and send it to the GP and, with consent, to the school.',
        'Mark the assessment complete, then delete it from this browser.'
      ],
      say: [
        'To the parent: here is what we found, and why. ADHD explains some of your child\'s difficulties; it does not define them.',
        'To the child: your brain finds it harder to keep its attention on some things. It is nobody\'s fault, and there are things that help.',
        'With your agreement, I would like to write to school so they can help.'
      ],
      watch: [
        'Medicine is not the first step for most children: information, parent support and changes at school come first.',
        'If ADHD is not diagnosed, explain what better explains the difficulties, and still offer information and support.',
        'Check every generated sentence, the report title and the informants for this age before the report leaves.',
        'Share with the school only what the family has agreed to.'
      ],
      done: [
        'Feedback is given to the family and the young person, and the plan is agreed.',
        'The report is reviewed, edited and copied into the record.',
        'School liaison (with consent), the GP letter and follow-up are arranged.'
      ],
      next: 'Mark the assessment complete. At follow-up, compare parent and teacher ratings with today\'s baseline.',
      src: [
        'NICE NG87 1.4.12 (school liaison with consent), 1.5.10 (information and ADHD-focused parent support), 1.5.11 (parent-training programme with oppositional or conduct symptoms), 1.5.13 (when to offer medication) and 1.5.14 (CBT if medication helps but impairment remains)',
        'NICE NG87 1.6 (diet)',
        'NICE NG87 1.1.4-1.1.5 and NICE NG43 1.2.1 (transition to adult services: plan from Year 9 at the latest, or at once if the young person is close to transfer)',
        'NICE NG87 1.7.26 (parent and teacher ratings at baseline and at each dose change)'
      ]
    }
  });
})(typeof window !== 'undefined' ? window.AA : globalThis.AA);
