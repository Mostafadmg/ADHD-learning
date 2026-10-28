/* stepGuide: the "What to do in this step" coach shown at the top of every assessment step
   (ARCHITECTURE.md 5.9). One entry per step id in AA.STEP_LIST: setup, screen, risk, history, comorbid,
   ia, hi, onset, collateral, ddx, validity, summary, report.
   Each entry: goal, time, do (ordered actions), say (lines for the patient), watch (pitfalls),
   done (how to know the step is complete), next, src.
   Original content. UK practice (NICE NG87) is the default frame, with UKAAN AQAS 2024, RCPsych CR235 (2023),
   the European Consensus (Kooij et al. 2019), CADDRA 4.1, the Australian guideline (May et al. 2023),
   DSM-5-TR and WHO ICD-11 CDDR (2024). DSM-5-TR and ICD-11 are paraphrased. DIVA wording is not reproduced:
   only its structure (adulthood then childhood, supplement question, collateral rated 0/1/2) is followed.
   Step times are clinical practice estimates. Direct contact with the patient usually totals 2 to 3 hours
   (AQAS: at least 2 hours in most cases); the 18-symptom interview (ia + hi) takes about 60 to 90 minutes.
   Collateral calls, the validity review, the conclusion and the written report add time outside the session.
   Sources: research briefs of 21 October 2026 (guidelines-uk, guidelines-intl, tools-adhd). */
AA.add('stepGuide', {

  /* ------------------------------------------------------------------ 1 */
  setup: {
    goal: "Start safely: confirm the patient's details and consent, explain the assessment, and know what evidence and informants you have.",
    time: "5-10 minutes",
    do: [
      "Before the appointment, send the pre-appointment forms (see Pre-appointment forms in the menu) and ask for school reports and previous records. On the day, read the referral, records and returned forms, and note the referral question and any red flags: suicidal thoughts, possible mania or psychosis, or a safeguarding concern.",
      "Enter a reference (initials or a local code, never a name or NHS number), age, sex and occupation. If the patient is under 18, check that an adult pathway is right; under 17 the DSM-5-TR threshold is 6 symptoms in a domain, not 5.",
      "Record who is present today and who could be contacted later. The best informants are someone who knew the patient before age 12 (usually a parent or older sibling) and someone who knows them well now.",
      "Tick the records you have, such as school reports and previous assessments. Ask now for anything missing, so it can arrive before you reach a conclusion.",
      "Book a professional interpreter if one is needed. Do not use family members to interpret.",
      "Read the script under Explain the interview, or say it in your own words: purpose, structure, how long it takes, breaks, confidentiality and its limits, and contact with informants.",
      "Ask what the patient wants from the assessment and why they are seeking it now. Write the answer in their own words under Reason for referral.",
      "Record verbal consent. If the patient does not agree, or capacity is in doubt, stop and record why.",
      "Work through Have you got everything? A gap is not a reason to stop: note it and plan how to fill it."
    ],
    say: [
      "Today I will ask about your life now and when you were a child, so that we can understand your difficulties. It usually takes two to three hours, and we can stop for a break whenever you need one.",
      "There are no right or wrong answers. 'I don't know' and 'I can't remember' are fine answers.",
      "With your permission, I would like to speak to someone who knew you as a child and someone who knows you well now.",
      "What would you like to get from today? And why now?"
    ],
    watch: [
      "Expectations: many patients expect a diagnosis or medication today. Explain early that the outcome may be ADHD, another explanation, or a need for more information.",
      "External pressure: a referral driven by an employer, university, court or relative can shape the account. Note it neutrally; you will weigh it in the validity step (RCPsych CR235 section 7).",
      "A previous diagnosis made privately or abroad: ask for the full report. Without evidence of a comprehensive assessment, carry out a standard assessment (CR235 section 8).",
      "Video appointments are acceptable (AQAS 2024; CR235 9.8). Check privacy and that nobody off-screen is prompting. The DHSC review (2026) lists assessments that are not face to face as a risk factor for misdiagnosis, so consider meeting in person when the picture is complex.",
      "Plan the time: about 2 to 3 hours of direct contact, in one session with a break or over shorter sessions (AQAS: at least 2 hours in most cases). Feedback and the treatment discussion often need a further appointment of about an hour (AQAS). Collateral calls and the report take extra time outside the session."
    ],
    done: [
      "Reference, age and consent are recorded, so the step shows as complete.",
      "You know who can give collateral information and how to reach them.",
      "Missing records or informants are noted, with a plan to obtain them."
    ],
    next: "Go to Screening questionnaires. Check the forms the patient completed before the appointment: they give a baseline and show you where to probe later.",
    src: [
      "NICE NG87 1.3.1",
      "UKAAN Adult ADHD Assessment Quality Assurance Standard (AQAS, Adamou et al. 2024): orientation to the process, informants, theme 4 (at least 2 hours in most cases)",
      "RCPsych CR235 (2023) sections 7, 8 and 9.8",
      "DHSC independent review into mental health conditions, ADHD and autism, final report 2026 (risk factors for misdiagnosis)",
      "Australian ADHD guideline (May et al. 2023): interview typically 2 to 3 hours",
      "Step times: clinical practice estimates"
    ]
  },

  /* ------------------------------------------------------------------ 2 */
  screen: {
    goal: "Use the self-report scales as a baseline and as prompts for later in the interview, never as the diagnosis.",
    time: "5-15 minutes",
    do: [
      "Check each returned form: completed by the patient, for the right time frame, with no missing items. Enter the answers here, or ask the patient to complete the scale now. Results at a glance shows which are done.",
      "ASRS v1.1: count the Part A answers (items 1 to 6) in the shaded range. Four or more is a positive screen. Use Part B as a list of probes; it has no total score. The optional ASRS-5 has its own weighted scoring: follow its Scoring guide in the tools library.",
      "WURS-25 (childhood recall, total 0 to 100): 46 or more is the original cut-off and 36 or more a more sensitive one. Depression, bipolar disorder and borderline personality disorder also raise the score.",
      "WFIRS-S (last month): a domain is impaired when two or more items are rated 2, any item is rated 3, or the domain mean is 1.5 or more. These are the areas to explore in the impairment step.",
      "Note the high-scoring items and impaired domains as prompts. Check the answers briefly with the patient and ask for an example of a high score if it helps, but save the detailed exploration for the history and the symptom interview, so the forms do not steer the patient's own account.",
      "Note mismatches: very high scores on everything, low scores despite a clear history, or answers that do not fit what you see. These feed the validity step.",
      "Act today on any urgent flag shown at the top of the page, in the safety and risk step.",
      "If you are unsure how to read a form, open Pre-appointment forms in the menu: it explains each form, what the result means and how much weight to give it."
    ],
    say: [
      "These forms help me see where to focus today. On their own they do not decide the outcome.",
      "When you filled these in, were you thinking about the last six months, or about a particularly bad patch?",
      "Did anyone help you with the answers?",
      "I will come back to some of these answers later and ask you for real examples."
    ],
    watch: [
      "NICE says a diagnosis should not be made on rating scales alone. UKAAN goes further: self-report symptom scales should only provide a baseline for measuring change after diagnosis and treatment, not evidence for the diagnosis (AQAS 2024).",
      "Positive screens are common in depression, anxiety, bipolar disorder, borderline personality disorder and substance use. In people in substance use treatment, the ASRS screen had a positive predictive value of only 0.26 (van de Glind et al. 2013; May et al. 2023).",
      "A negative screen does not exclude ADHD. People with low insight, strong compensation or high ability may under-report (Kooij et al. 2019).",
      "Retrospective childhood scales depend on memory and current mood. Contemporaneous school reports and informants carry more weight.",
      "Near-maximal scores on every item are a reason to look harder, not a sign of severe ADHD (clinical practice)."
    ],
    done: [
      "ASRS v1.1, WURS-25 and WFIRS-S are entered and scored, or the result from the official form is in the notes.",
      "You have a short list of high-scoring items and impaired domains to explore later.",
      "Any urgent flag has been taken to the safety and risk step."
    ],
    next: "Go to Safety and risk. Ask about safety before the long interview, so any urgent problem is dealt with first.",
    src: [
      "NICE NG87 1.3.2",
      "UKAAN AQAS 2024 (pre-assessment baseline data)",
      "RCPsych CR235 (2023) 9.1 and 9.6",
      "ASRS v1.1 official scoring instructions (WHO, Kessler et al.)",
      "Ward et al. 1993 (WURS-25 cut-offs)",
      "CADDRA WFIRS-S scoring instructions",
      "May et al. 2023 (Australian guideline: screening accuracy)",
      "van de Glind et al. 2013 (ASRS in substance use treatment)"
    ]
  },

  /* ------------------------------------------------------------------ 3 */
  risk: {
    goal: "Find and act on any risk to the patient or to others before the assessment goes further.",
    time: "5-10 minutes",
    do: [
      "Ask the safety questions on this page in a calm, direct way. Start with current thoughts of suicide or self-harm, then plans, past attempts and what stopped them. Use the C-SSRS screener if it is shown.",
      "Ask about risk to others and risk from others: violence, exploitation, coercive control and financial abuse.",
      "Ask whether they look after children or other people, and how things are for them at home. Follow safeguarding procedures if needed.",
      "Ask about driving: accidents, near misses, penalties for speeding or phone use, and driving after alcohol or drugs.",
      "Check current substance use that changes risk today: intoxication, dependence, injecting or withdrawal. Note any risk of misuse or diversion if stimulants may be prescribed later.",
      "Tick what the patient describes under What did you find? and read the actions that appear. For any urgent item, pause the ADHD assessment and follow your local crisis pathway today.",
      "Record the patient's words, protective factors, access to means, and the action taken or safety plan.",
      "Tick Safety reviewed only when there is no immediate risk, or a plan is in place."
    ],
    say: [
      "I ask everyone about safety, because ADHD and the problems that come with it can affect it.",
      "Have you had thoughts that life is not worth living, or of ending your life? Have you ever acted on them?",
      "Is anyone hurting you, threatening you or taking advantage of you?",
      "Do you look after children or anyone else? How are things at home?",
      "How is your driving? Any accidents, near misses or points on your licence in the last few years?"
    ],
    watch: [
      "Adults with ADHD have higher rates of accidents, self-harm, suicide attempts and relationship violence (Kooij et al. 2019 section 4.1.7). Ask everyone, not only those who seem low.",
      "Impulsivity can turn distress into action quickly. Ask about past impulsive acts as well as current intent (clinical practice).",
      "Questionnaire flags, such as a positive answer on a self-harm item, are prompts. Decisions about suicide risk, self-harm and safeguarding stay with you (DHSC independent review 2026, Annex A.4).",
      "Risk can change during the interview. Check again if the patient becomes distressed, for example when talking about childhood or trauma.",
      "If the patient is intoxicated or in withdrawal today, the account is not reliable: manage the risk and rebook (clinical practice).",
      "Explore parenting roles routinely (RCPsych CR235 11.6). Safeguarding concerns can justify sharing information without consent, a limit you explained at the start."
    ],
    done: [
      "Every urgent or high item ticked has an action recorded.",
      "Safety reviewed is ticked.",
      "You have decided whether the assessment can safely continue today."
    ],
    next: "Go to Clinical history. If urgent risk was found, deal with it first: the ADHD assessment can be rebooked.",
    src: [
      "UKAAN AQAS 2024 (risk or safety assessment always completed: essential)",
      "CADDRA 4.1 chapter 1 (assess psychiatric health and risk at the start)",
      "NICE NG87 1.7.4 (risk of substance misuse and drug diversion)",
      "Young et al. 2020, UKAP ADHD and autism consensus (harm to self, to others and from others)",
      "RCPsych CR235 (2023) 11.6",
      "Kooij et al. 2019 European Consensus section 4.1.7",
      "DHSC independent review into mental health conditions, ADHD and autism, final report 2026, Annex A.4"
    ]
  },

  /* ------------------------------------------------------------------ 4 */
  history: {
    goal: "Take a full developmental, psychiatric, medical and social history, so the ADHD interview sits inside the whole story.",
    time: "20-40 minutes",
    do: [
      "Begin with open questions about the main problems and why the patient has come now. Let them talk for a few minutes before any ADHD-specific questions.",
      "Open each area under History by area in turn. Ask the prompts that fit, tick what applies, and tick Nothing relevant in this area when you have asked and there is nothing.",
      "Development: pregnancy, birth, prematurity, milestones, early temperament, and any early speech and language, occupational therapy or paediatric input.",
      "School and work: reports, behaviour, exclusions, friendships, extra help, qualifications compared with ability, and jobs left or lost and why.",
      "Mental health: every past and current episode with dates, treatment and response. Ask specifically about periods of elevated mood, trauma, eating problems, and other neurodevelopmental conditions: autistic traits, tics, dyslexia, dyspraxia and learning disability.",
      "Physical health and medicines: seizures, head injury, thyroid problems, hearing or vision, sleep, known heart disease, palpitations, breathlessness or fainting on exertion, sudden cardiac death in a first-degree relative under 40, and all medicines, including over-the-counter ones and caffeine.",
      "Substances and behaviours: alcohol, cannabis, stimulants, other drugs, nicotine and gambling. Find the age of first use and whether the ADHD-type problems came first.",
      "Build a rough timeline as you go: when the problems started, when other conditions started, major life events, and periods when things were better or worse.",
      "Make mental state observations throughout: appearance, behaviour (including restlessness and distractibility), speech, mood, thought, perception, cognition and insight. Record them under Mental state observations at the end of the page, then review Flags from the history at the top."
    ],
    say: [
      "Before I ask about specific difficulties, tell me in your own words what has been happening and why you have come now.",
      "Were there times in your life when things were much better or much worse? What was going on then?",
      "Have you ever had a spell of several days when you felt unusually high or full of energy, and needed much less sleep?",
      "Some people have been through very difficult or frightening experiences. Is there anything like that which still affects you?",
      "Does anyone in your family have similar difficulties, or a diagnosis such as ADHD, autism, dyslexia, depression or bipolar disorder?"
    ],
    watch: [
      "Take the history before the symptom interview. Starting with a symptom checklist can lead the patient and miss other diagnoses (RCPsych CR235 9.1).",
      "Trait or state: ADHD is trait-like and present since childhood, while depression, bipolar disorder and many anxiety disorders have a more discrete onset and an episodic or fluctuating course. Date every episode (CR235 9.7).",
      "Substance use can mimic or mask ADHD. The order of onset, and how the person is when not using, are the key tests (ICD-11 CDDR).",
      "A structured home, a supportive school or high ability can hide childhood problems. Ask who organised them and what coping costs them now (AQAS 2024; CR235 9.2).",
      "NICE warns that ADHD is thought to be under-recognised in women, who may be more likely to receive an incorrect diagnosis of another mental health or neurodevelopmental condition.",
      "Psychotic symptoms are not part of ADHD and point to a separate diagnosis. Assess them, and treat them first if active (CR235 9.7.9; Kooij et al. 2019 section 7.2)."
    ],
    done: [
      "Every history area is covered with ticks, notes or Nothing relevant, and mental state observations are recorded.",
      "You have a rough timeline of the ADHD-type problems, other conditions and life events.",
      "You know which flags for differentials, risk and treatment still need follow-up."
    ],
    next: "Go to Co-occurring conditions screen to check, with brief scales, the conditions the history raised and those to consider in everyone.",
    src: [
      "NICE NG87 1.3.1 (full developmental and psychiatric history, mental state) and 1.3.4",
      "NICE NG87 1.2.2 and 1.7.5 (cardiac history)",
      "UKAAN AQAS 2024 (developmental, neurodevelopmental, mental health, medical, substance and forensic history)",
      "RCPsych CR235 (2023) 9.1, 9.2, 9.4 and 9.7",
      "Kooij et al. 2019 European Consensus section 7.2",
      "WHO ICD-11 CDDR 6A05 (substance and medication effects)"
    ]
  },

  /* ------------------------------------------------------------------ 5 */
  comorbid: {
    goal: "Screen briefly for the conditions that most often co-occur with or mimic ADHD, so none is missed.",
    time: "5-15 minutes",
    do: [
      "Complete the six core screens for everyone: PHQ-9 (depression), GAD-7 (anxiety), MDQ (bipolar disorder), AUDIT (alcohol), DAST-10 (drugs) and AQ-10 (autistic traits). If they were done before the appointment, check the answers with the patient.",
      "Add optional screens when the history points to them, for example PCL-5 for trauma, MSI-BPD for borderline personality disorder and STOP-Bang for sleep apnoea.",
      "Ask everyone about sleep: insomnia and obstructive sleep apnoea are core differentials. The ISI and Epworth scales are described in the tools library.",
      "Read Results at a glance. A positive screen means explore this further; it is not a diagnosis. The Points to column shows which differentials each scale informs.",
      "For each positive screen, ask two questions: when did this start compared with the attention problems, and are the attention problems still there when this condition is absent or treated? Note the answers.",
      "Check the time frame: PHQ-9 and GAD-7 cover the last two weeks, AUDIT and DAST-10 the last year, and the MDQ asks about episodes at any time in life. A bad fortnight also inflates ADHD self-ratings.",
      "Act today on any urgent flag, such as thoughts of self-harm on PHQ-9 item 9, in the safety and risk step.",
      "Positive screens are carried to the differential step automatically, under Signals from this assessment. Write what you found in each scale's notes."
    ],
    say: [
      "These short questionnaires check for other conditions that are common alongside ADHD, or can look like it.",
      "Your score for low mood is high. When did that start? Were the concentration problems there before it?",
      "How much do you drink in a typical week? Do you use anything else to relax, sleep or focus?",
      "Have you ever wondered, or been told, that you might be autistic?"
    ],
    watch: [
      "Co-occurring conditions are the rule: 60 to 80% of adults with ADHD have at least one in their lifetime (Kooij et al. 2019 section 6.3). A positive screen does not rule ADHD out.",
      "ADHD itself can push some screens up, for example talkativeness and distractibility on the MDQ or restlessness on the GAD-7. Check whether the items describe episodes or lifelong traits.",
      "A negative screen does not exclude: people often under-report alcohol and drug use, and autistic adults may mask.",
      "A major mood episode, psychosis or unstable substance use can make the ADHD assessment unreliable. Treat these first, then reassess (CR235 section 10; Kooij et al. 2019 section 7.2). Other comorbidity is not a barrier to assessment.",
      "Ask about bipolar disorder and eating disorders even when the screens are negative, because they change management (AQAS 2024)."
    ],
    done: [
      "The six core screens are complete, or the reason one was not done is in the notes.",
      "Sleep has been asked about.",
      "Each positive screen has a note on timing, and urgent items have gone to safety and risk."
    ],
    next: "Start the structured interview with Inattention. With the history and screens in mind, you will know which symptoms need extra care to separate from other conditions.",
    src: [
      "UKAAN AQAS 2024 (screen for common mental health problems: essential)",
      "Kooij et al. 2019 European Consensus sections 6.3 and 7.2",
      "RCPsych CR235 (2023) section 10",
      "CADDRA 4.1 chapter 1 (general screening with WSR, PHQ-9 and GAD-7)",
      "May et al. 2023 (sleep apnoea and sleep deprivation as mimics)",
      "NICE NG87 1.3.4"
    ]
  },

  /* ------------------------------------------------------------------ 6 */
  ia: {
    goal: "Decide, with real examples, which of the nine inattention symptoms are present now (last 6 months) and were present in childhood (age 5 to 12).",
    time: "35-50 minutes",
    do: [
      "Set the frame: adulthood means the last 6 months; childhood means primary school, roughly age 5 to 12. Allow 60 to 90 minutes for both parts of the interview. Press Start with (Continue with once you have begun), or open any symptom from the table.",
      "Read the main question aloud as written, then wait. Let the patient answer in their own words before you offer any example.",
      "Ask for a recent, specific example. Open the area of life they talk about, or type in Filter examples, and tick only the examples the patient actually describes. Type their own words in the box. Use Other ways to ask if the question does not land; do not read the example list out as a checklist.",
      "Open Probe further and ask how often it happens, whether it is more than in other people of the same age, in which settings, and what it costs. Ask how they cope and what happens when the coping fails.",
      "Score adulthood Yes, Unsure or No, using How to score this symptom and its calibration examples. Score Yes only when it is frequent, more than in peers, long-standing and causes problems. On a phone or tablet the scores sit in the bar at the bottom of the screen.",
      "Switch to the Childhood tab. Anchor the period (school, teacher, house, friends), ask the childhood question, tick examples and score it the same way.",
      "If an informant is present or you have school reports, rate their support for this symptom: 0 none, 1 some, 2 clear, or n/a.",
      "If the problem might come from something else (low mood, anxiety, poor sleep, substances, a learning difficulty), open Could it be something else? and flag it for the differential step. If you are unsure, score Unsure and come back after collateral.",
      "Move on with Next symptom (Next in the score bar on a phone or tablet, or the arrow keys on a keyboard). After the ninth symptom, answer the supplement question for adulthood and for childhood: are these problems greater than in others of the same age?"
    ],
    say: [
      "I am now going to ask about nine kinds of difficulty with attention and organisation. For each one I will ask about the last six months, then about when you were at primary school.",
      "Can you give me an example from the last few weeks? What happened?",
      "How often does that happen: most days, most weeks, or now and then?",
      "Compared with other people your age, is that more, less or about the same?",
      "When you were at primary school, what was this like? What did your teachers or parents say about it?"
    ],
    watch: [
      "Do not lead. Ask the open question first and use examples only as prompts. A general 'yes, that's me' is not enough: clear examples of each symptom present are essential (AQAS 2024).",
      "Count traits, not states. Problems that appear only during low mood, anxiety, sleep loss or substance use do not count (ICD-11 CDDR; DSM-5-TR criterion E). Nor do problems that come only from deliberate refusal or from not understanding the task or the language (DSM-5-TR criterion A note).",
      "Avoid double counting. One incident should not be the only evidence for two symptoms (clinical practice), and a behaviour better explained by autism should not also be counted as ADHD (Young et al. 2020, UKAP ADHD and autism consensus).",
      "Masking and scaffolding hide symptoms. Ask what it costs to cope, and what happens when the support (a partner, lists, a manager) is removed (CR235 9.2). Open Special populations for women, older adults, high ability, substance use, autism and culture.",
      "People who have read about ADHD may endorse most items. Look for varied, personal, concrete detail (CR235 9.6).",
      "Unsure is a valid score. Return to it after collateral rather than forcing Yes or No."
    ],
    done: [
      "All nine symptoms are scored for both adulthood and childhood (Unsure is allowed, to revisit).",
      "Every symptom scored Yes has at least one ticked example or the patient's own words.",
      "The supplement question is answered for adulthood and childhood.",
      "Possible mimics are flagged for the differential step."
    ],
    next: "Go to Interview part 2: hyperactivity-impulsivity, using the same method. If the patient is tiring, take a short break first: fatigue lowers the quality of the answers.",
    src: [
      "DSM-5-TR criterion A1, inattention, and the criterion A note on defiance and not understanding tasks (paraphrased)",
      "UKAAN AQAS 2024 (systematic evaluation of all 18 symptoms in adulthood and childhood, open questions, clear examples)",
      "WHO ICD-11 CDDR 6A05 (boundaries with mood and anxiety disorders)",
      "RCPsych CR235 (2023) 9.2 and 9.6",
      "Young et al. 2020, UKAP ADHD and autism consensus",
      "DIVA Foundation: interview structure only (adulthood then childhood, supplement question)",
      "Interview time: clinical practice estimate (RCPsych: DIVA about 1.5 hours with practice)"
    ]
  },

  /* ------------------------------------------------------------------ 7 */
  hi: {
    goal: "Decide, with real examples, which of the nine hyperactivity-impulsivity symptoms are present now and were present in childhood.",
    time: "25-40 minutes",
    do: [
      "Explain that in adults restlessness is often felt on the inside rather than seen. Do not score from how still the patient sits in the room.",
      "For each symptom, read the main question, wait, then ask for a recent example. Tick the examples the patient describes and type their own words.",
      "For the restlessness symptoms, ask about inner restlessness, how they cope with meetings, films and long journeys, and how they channel it (sport, pacing, fidgeting, active jobs).",
      "For the three impulsivity symptoms (answering before a question is finished, waiting their turn, interrupting), ask about conversations, queues and traffic, and impatience that leads to snap decisions. A partner's view is especially useful here.",
      "Use Probe further for frequency, peers, settings and impact, then score adulthood Yes, Unsure or No.",
      "Switch to Childhood: classroom, mealtimes, car journeys, the playground, accidents and injuries. Check school reports for comments such as fidgety, chatty or calls out. Score it.",
      "Rate informant support, and flag possible mimics: episodes of elevated mood, anxiety, medicine side effects such as akathisia, caffeine or stimulant use, restless legs, or an overactive thyroid.",
      "After the ninth symptom, answer the supplement question for both periods. Check the tallies against the threshold in the live summary."
    ],
    say: [
      "Now I would like to ask about restlessness and acting on the spur of the moment. For some people this is mostly a feeling inside rather than moving about.",
      "When you have to sit still, in a meeting, at the cinema or on a long journey, what is that like for you?",
      "Do people tell you that you interrupt, finish their sentences or talk a lot? Can you give me an example?",
      "As a child, what were you like at mealtimes, in class or on long car journeys?"
    ],
    watch: [
      "Calm behaviour in the interview does not exclude ADHD; symptoms often do not show one-to-one (Kooij et al. 2019; CR235 9.2; CADDRA 4.1).",
      "Impulsive spending, risk-taking or quitting jobs are not separate DSM-5-TR symptoms. Count them only where they illustrate a listed symptom, and record their cost as impairment (clinical practice). ICD-11 does include acting without thinking about risk, such as reckless driving, in its impulsivity cluster.",
      "Episodes of restlessness with less need for sleep, pressured speech or grandiosity point to hypomania or mania. Abrupt new hyperactivity in an adult suggests bipolar disorder or emerging psychosis (ICD-11 CDDR).",
      "Restlessness only when anxious, or caused by caffeine, stimulants, withdrawal or medicines (for example bronchodilators or antipsychotics), does not count.",
      "In ADHD, impulsivity and anger are short-lived and thoughtless rather than driven. Impulsivity tied to fear of abandonment, self-harm or an unstable sense of self points to borderline personality disorder (Kooij et al. 2019 section 6.3).",
      "Hyperactivity often lessens with age, so childhood symptoms may be clearer than adult ones (ICD-11 CDDR). Judge talkativeness and activity against people of the same age and cultural background."
    ],
    done: [
      "All nine symptoms are scored for adulthood and childhood.",
      "Every symptom scored Yes has an example.",
      "The supplement question is answered for both periods.",
      "The live summary shows the current presentation, or shows that the adult threshold is not reached."
    ],
    next: "Go to Onset and impairment: when the symptoms began and what they cost the patient. These decide criteria B, C and D.",
    src: [
      "DSM-5-TR criterion A2, hyperactivity-impulsivity (paraphrased)",
      "WHO ICD-11 CDDR 6A05 (adult restlessness, boundaries with mania, medication effects)",
      "Kooij et al. 2019 European Consensus sections 4.1 and 6.3",
      "RCPsych CR235 (2023) 9.2",
      "CADDRA 4.1 chapter 1",
      "UKAAN AQAS 2024"
    ]
  },

  /* ------------------------------------------------------------------ 8 */
  onset: {
    goal: "Decide whether symptoms began in childhood (criterion B), occur in two or more settings (C) and cause clear, at least moderate impairment (D).",
    time: "15-20 minutes",
    do: [
      "Ask whether the difficulties have always been there. If not, use memory aids (school year, teacher, house moves, the birth of a sibling) to date when they started.",
      "Answer Were several symptoms present before age 12? using the childhood scores, the patient's memories and any reports. Choose Unsure if you are waiting for collateral.",
      "If onset was after 12, read the late-onset cautions and look for another cause: mood or anxiety disorder, trauma, substances, sleep, head injury, medical illness, or a sharp rise in demands.",
      "Confirm that the current symptoms have lasted at least 6 months and are present most of the time, not only in bad patches.",
      "Rate adult impairment in each of the seven areas. Ask what happens, how often and what it has cost, tick examples, and choose None, Mild, Moderate or Severe against What each level means here.",
      "Rate childhood and adolescence the same way, using memories, informants and school reports.",
      "Check the live criteria. The app shows C as met when two or more areas are affected, and D as met when any area is at least moderate. Criterion C is about symptoms showing in two or more settings, so also check that your symptom examples come from more than one setting. For UK practice, check that at least two areas are moderate or severe: this is how UKAAN applies the NICE threshold.",
      "Write a short note on onset and the main areas of impairment, in the patient's words. The report draws on it."
    ],
    say: [
      "Have these difficulties always been there, as far back as you can remember?",
      "Think about your last year at primary school: your teacher, your classroom. What were you like then?",
      "Of everything we have talked about, where does it cause you the most trouble now?",
      "What has it cost you: jobs, money, friendships, relationships?",
      "What would be different in your life if these difficulties were not there?"
    ],
    watch: [
      "Criterion B needs several symptoms before 12, not a diagnosis at that age. Structure and support can hide problems (CR235 9.2), and NICE advises against excluding ADHD because of an uncertain time of onset.",
      "UK guidance does not support diagnosing ADHD that starts in adulthood with no childhood symptoms (BAP 2014), and 'late-onset ADHD' remains controversial. Most apparent late onset still meets the before-12 rule on careful history; check impairment, psychiatric history and substance use (Kooij et al. 2019 section 5.3).",
      "Abrupt onset of hyperactivity or inattention in adolescence or adulthood suggests another cause, such as bipolar disorder, psychosis, substances or a medical condition (ICD-11 CDDR).",
      "Rate impairment caused by the ADHD symptoms only, not impairment caused by depression, substance use or life events alone.",
      "High achievement does not rule ADHD out; impairment can lie in the effort and cost of achieving (AQAS 2024).",
      "Mild problems alone are below the NICE threshold. Rate against the anchors, not against the patient's distress alone."
    ],
    done: [
      "Onset before 12 and the 6-month duration are answered.",
      "All seven areas are rated for adulthood and for childhood.",
      "Criteria B, C and D show a status in the live summary, and you can name the areas with at least moderate impairment."
    ],
    next: "Go to Collateral information. Informants and school reports test the onset and impairment ratings you have just made.",
    src: [
      "DSM-5-TR criteria B, C and D (paraphrased)",
      "NICE NG87 1.3.3",
      "UKAAN AQAS 2024 (developmental history, theme 3 impairment: at least moderate, two or more domains)",
      "WHO ICD-11 CDDR 6A05 (onset and course)",
      "RCPsych CR235 (2023) 9.2",
      "Kooij et al. 2019 European Consensus section 5.3",
      "BAP 2014 (Bolea-Alamañac et al.): no evidence for later-onset ADHD without childhood symptoms"
    ]
  },

  /* ------------------------------------------------------------------ 9 */
  collateral: {
    goal: "Test the patient's account against people and records that knew them in childhood and know them now.",
    time: "15-30 minutes per informant, often by phone after the session",
    do: [
      "With the patient's consent, speak to informants separately, or alone for at least part of the time: a parent or older sibling for childhood, a partner or close friend for adulthood. A phone call after the appointment is fine.",
      "Record who gave the information and how, for example mother, by phone.",
      "Ask open questions first, then the listed questions. Ask for specific memories and comparisons with siblings or classmates, and tick each point the informant confirms.",
      "Read the school reports, primary school first. Tick the phrases you find and note whether comments recur across years and teachers.",
      "Rate how far each source supports the history: 0 none or little, 1 some, 2 clear, specific support, or n/a when the source is not available. Use 0 when a source contradicts the account.",
      "Go back to symptoms scored Unsure and update them if collateral settles the question. Rate informant support on the symptom too.",
      "Where accounts disagree, open When informants disagree, record both versions and your view of why they differ.",
      "If no informant or record is available, record why, look for other evidence (old letters, report cards, health records) and use the No informant available options."
    ],
    say: [
      "Thank you for helping. In your own words, what was [name] like as a child?",
      "Can you remember a particular time that shows what they were like? How did they compare with their brothers, sisters or friends?",
      "What did teachers say at parents' evenings or in school reports?",
      "What do you notice day to day now? Where does it cause problems at home?"
    ],
    watch: [
      "Relatives may have ADHD themselves and see the behaviour as normal. Ask for concrete examples rather than judgements (Young et al. 2020, UKAP females consensus).",
      "School reports can be brief or kind. Reports on girls may say daydreaming, distracted or disorganised rather than disruptive (Young et al. 2020).",
      "Missing collateral for reasons outside the patient's control should not by itself rule out a diagnosis, but ICD-11 advises caution when childhood symptoms cannot be corroborated. Record how you weighed it (CR235 9.5; ICD-11 CDDR).",
      "Informants can over- or under-report, to protect the patient or because of conflict. Give more weight to specific, consistent detail than to general impressions.",
      "Adults are often good reporters of their current symptoms, but childhood recall is weaker, especially with high ability, a structured upbringing or mainly inattentive problems. That is where informants and records matter most (Kooij et al. 2019 section 4). Do not let the patient answer for the informant (clinical practice)."
    ],
    done: [
      "Parent, partner and school sources are each rated 0, 1, 2 or n/a.",
      "Who gave each account, and how, is recorded.",
      "Symptoms scored Unsure have been revisited in the light of the collateral."
    ],
    next: "Go to Differential diagnosis. With the whole history in hand, decide whether anything else better explains the picture (criterion E).",
    src: [
      "NICE NG87 1.3.1 (observer reports)",
      "UKAAN AQAS 2024 (informants: one who knew the patient in childhood and one who knows them now)",
      "RCPsych CR235 (2023) 9.5",
      "WHO ICD-11 CDDR 6A05 additional features",
      "Kooij et al. 2019 European Consensus section 4 (role of informants)",
      "Young et al. 2020, UKAP consensus on females with ADHD",
      "DIVA 2.0 collateral rating 0, 1, 2 (structure only)"
    ]
  },

  /* ------------------------------------------------------------------ 10 */
  ddx: {
    goal: "For each relevant condition, decide whether it is absent, co-occurring or a better explanation for the symptoms (criterion E).",
    time: "15-25 minutes",
    do: [
      "Start with Signals from this assessment: the positive screens, history items and interview flags that point to a condition. Every condition listed there needs a verdict.",
      "Review the ten core conditions in every adult: depression, bipolar disorder, generalised anxiety, PTSD, borderline personality disorder, autism, alcohol use, cannabis use, insomnia and obstructive sleep apnoea.",
      "For each condition, read Questions that tell them apart, ask any you have not yet covered, and tick the Features in this patient. The weighted score shows how strongly they point to the alternative.",
      "Apply the tests under How to judge: trait or episode, onset before 12, pervasiveness across settings, and timeline (do the ADHD symptoms persist when the other condition is absent or treated?). Then ask whether it explains every symptom and the childhood picture.",
      "Choose a verdict, using Better explains the symptoms when and Diagnose both when: absent; co-occurring; better explains; or uncertain. Write one line of reasoning in the notes.",
      "Consider physical causes and medicines: thyroid disease, anaemia, hearing or vision problems, epilepsy, head injury and sleep disorders; medicines that dull thinking (some anticonvulsants, mood stabilisers, sedating antihistamines), change behaviour (levetiracetam) or activate (decongestants, bronchodilators, caffeine). Arrange tests only if the history or examination points to them.",
      "For any uncertain verdict, plan what will settle it: records, an informant, a period of abstinence, treatment of mood, a sleep study or a specialist opinion.",
      "Work through the Step-by-step differential protocol further down this page. Its checklist makes sure no group of conditions is skipped, and the ticks are saved in the report."
    ],
    say: [
      "When your mood is good, are the concentration problems still there?",
      "Have you ever had a spell of several days when you needed much less sleep and felt full of energy?",
      "When you have not been drinking or using cannabis for a few weeks, what are you like?",
      "Do you snore, or has anyone seen you stop breathing in your sleep? Do you wake up unrefreshed?"
    ],
    watch: [
      "Co-occurrence is common and does not rule ADHD out; no condition has to be excluded first (May et al. 2023). Choose Better explains only when the alternative accounts for the symptoms, not just because it is present.",
      "Do not count symptoms that occur only during mood episodes, anxiety, psychosis, intoxication or withdrawal (DSM-5-TR criterion E; ICD-11 CDDR).",
      "If a major mood episode, psychosis or unstable substance use is active, choose Uncertain, treat it first and reassess ADHD once it has settled (CR235 section 10; Kooij et al. 2019 section 7.2).",
      "Autism and ADHD often co-occur. Diagnose both when both are met, but do not count one behaviour for both (Young et al. 2020, UKAP ADHD and autism consensus).",
      "Trauma can mimic or mask ADHD, and a trauma history does not exclude it. Check the timeline of symptoms against the trauma (CADDRA 4.1; CR235 11.5).",
      "Untreated sleep apnoea or chronic sleep deprivation can cause ADHD-like inattention (May et al. 2023)."
    ],
    done: [
      "All ten core conditions and every signalled condition have a verdict.",
      "Each uncertain verdict has a plan to settle it.",
      "You can write one sentence on why the symptoms are, or are not, better explained by another disorder."
    ],
    next: "Go to Symptom validity. Before you reach a conclusion, decide how much weight the account can bear.",
    src: [
      "DSM-5-TR criterion E (paraphrased)",
      "WHO ICD-11 CDDR 6A05 boundaries with other disorders",
      "UKAAN AQAS 2024 (the report must confirm that the symptoms are not better explained by another disorder)",
      "RCPsych CR235 (2023) 9.7, 11.5 and section 10",
      "CADDRA 4.1 chapter 2",
      "Kooij et al. 2019 European Consensus sections 6.3 and 7.2",
      "May et al. 2023 (Australian guideline 2.2.2: no condition must be excluded first; medical and medication mimics)",
      "Young et al. 2020, UKAP ADHD and autism consensus"
    ]
  },

  /* ------------------------------------------------------------------ 11 */
  validity: {
    goal: "Judge how much weight the account can bear by looking at consistency, incentives and over-reporting.",
    time: "5-10 minutes",
    do: [
      "Read Consistency checks from this assessment first. They compare the screens, interview, informant ratings and impairment, and flag where they disagree.",
      "Tick any indicators that apply, such as near-maximal answers on every scale, vague or textbook examples, or impairment out of proportion to the symptoms described.",
      "Note any external incentives: exam or workplace adjustments, benefits, stimulant medication or legal proceedings.",
      "Cross-check the account using Things to cross-check: interview against questionnaires, childhood account against school reports, reported impairment against actual achievements, and the patient's account against the informants'.",
      "If you used formal validity measures (see Symptom validity measures), such as embedded scale indexes or stand-alone symptom and performance validity tests, record the results in Notes on validity. Use them only if you are trained to give and interpret them.",
      "Rate the overall concern as none, some or major, and write the reasons in neutral, factual language. Example wording for the report can be added to the notes.",
      "If concern is some or major, decide what extra evidence you need (records, informants, neuropsychological testing) before reaching a conclusion."
    ],
    say: [
      "Some of your answers are at the top of every scale. Help me understand what an ordinary day looks like.",
      "What made you decide to seek an assessment now?",
      "Is anything riding on the outcome for you, for example exams, work or medication?"
    ],
    watch: [
      "Non-credible responding is not rare in adults referred for ADHD: studies report about 15 to 31% (Suhr et al. 2008; Harrison and Edwards 2010; Marshall et al. 2016).",
      "Interviews and rating scales alone often miss it: in one clinic sample, 71% of people with non-credible effort would have been diagnosed on the interview alone (Marshall et al. 2016).",
      "Self-report scales are easy to fake, and people who have read about ADHD may endorse most items (CR235 9.6; Sollman et al. 2010).",
      "An incentive is not proof of exaggeration. Many people seek assessment for exams, work or treatment for genuine reasons, and ADHD remains under-diagnosed (CR235 9.7.8).",
      "Tell exaggeration apart from distress, low insight, or a cultural style of describing problems.",
      "Symptom validity and performance validity are different: a person can pass one and fail the other (Ovsiew et al. 2023)."
    ],
    done: [
      "Overall concern is rated none, some or major.",
      "The reasons are recorded in neutral language.",
      "If there is concern, you have a plan for the extra evidence you need."
    ],
    next: "Go to Scoring and diagnosis. The validity rating feeds the evidence-strength summary.",
    src: [
      "RCPsych CR235 (2023) 9.6 and 9.7.8",
      "Kooij et al. 2019 European Consensus section 3.3 (performance validity tests)",
      "CADDRA 4.1 (students and young adults seeking accommodations or stimulants)",
      "Suhr et al. 2008, Harrison and Edwards 2010, Marshall et al. 2016, Sollman et al. 2010, Ovsiew et al. 2023"
    ]
  },

  /* ------------------------------------------------------------------ 12 */
  summary: {
    goal: "Bring all the evidence together, check criteria A to E, and record a reasoned conclusion with presentation, severity and codes.",
    time: "10-15 minutes",
    do: [
      "Check criterion A in the criteria table: at least 5 symptoms in either domain over the last 6 months (6 if under 17), each backed by an example. Use Review to go back to any step.",
      "Check B (several symptoms before 12), C (several symptoms in two or more settings), D (clear impairment; for UK practice at least moderate, in two or more areas) and E (not better explained). Complete any criterion still pending.",
      "Read Evidence strength. Resolve or record each minus or warning: unsure symptoms, missing collateral, disagreeing screens, unresolved differentials, validity concerns.",
      "Choose a decision: criteria met; not met; other specified (impairing symptoms below the full criteria, with the reason stated); or deferred (more information needed).",
      "If met, record the presentation for the last 6 months (combined, predominantly inattentive or predominantly hyperactive-impulsive) and the severity (mild, moderate or severe), using the suggestion as a guide. Tick In partial remission only when full criteria were met in the past, fewer are met now, and impairment continues, for example in an adult diagnosed as a child.",
      "List co-occurring conditions (Fill from differential verdicts helps) and how they affect the picture and the order of treatment.",
      "Write the formulation in a few sentences: why the evidence does or does not meet each criterion, and what remains uncertain."
    ],
    say: [
      "I have put together everything you and others have told me. I would like to explain what I think and why.",
      "Your difficulties meet the criteria for ADHD. Let me explain what that means for you.",
      "I do not think ADHD is the best explanation for your difficulties. Here is what I think is going on.",
      "I need a little more information before I can give you a clear answer. This is what I need, and when we will meet again."
    ],
    watch: [
      "Do not count your way to a diagnosis. Reaching the threshold is necessary but not enough: criteria B to E and clinical judgement matter as much (AQAS 2024; CR235 9.2).",
      "Mild impairment alone may satisfy the DSM-5-TR wording but does not meet the NICE threshold (at least moderate impairment) for a diagnosis in UK practice. Record which standard you applied and why.",
      "Say which system you used. DSM-5-TR uses fixed symptom counts; ICD-11 asks for several symptoms and has no severity or remission specifier. Presentation describes the last 6 months and can change over time.",
      "The F90 codes shown are US ICD-10-CM codes that go with DSM-5-TR. WHO ICD-10, still used for NHS hospital coding, uses the same numbers differently: the WHO crosswalk maps combined presentation to F90.0, predominantly hyperactive-impulsive to F90.8, and inattention without hyperactivity to F98.8. Follow your local coding rules.",
      "If criteria are not met, say whether this is subthreshold ADHD or symptoms better explained by another condition, and still give information: NICE and UKAAN both advise this.",
      "Evidence strength and the DIVA 2.0 score form view (DSM-IV rules) are aids for comparison, not validated scales. Your clinical judgement makes the decision."
    ],
    done: [
      "A decision is recorded.",
      "If ADHD is diagnosed, the presentation, severity and codes are recorded.",
      "The formulation explains each criterion and names the evidence for it."
    ],
    next: "Go to Report and next steps to give feedback, agree a plan and finalise the report.",
    src: [
      "DSM-5-TR criteria A to E, presentations and specifiers (paraphrased)",
      "WHO ICD-11 CDDR 6A05 and its ICD-11 to ICD-10 crosswalk; WHO ICD-10 F90 and F98.8",
      "NICE NG87 1.3.3 and 1.4.4",
      "UKAAN AQAS 2024 theme 2 (report contents)",
      "RCPsych CR235 (2023) 9.2"
    ]
  },

  /* ------------------------------------------------------------------ 13 */
  report: {
    goal: "Give clear feedback, agree a plan, and finalise a report that shows how the conclusion was reached.",
    time: "30-60 minutes",
    do: [
      "Give the outcome in plain language: what you found, why, and what it means. Allow time for questions and for the patient to take it in. Feedback can be a separate appointment.",
      "If ADHD is diagnosed, hold the structured discussion: positives and negatives of the diagnosis, impulsive behaviour, environmental changes, education and work adjustments, relationships, coexisting conditions, the risk of substance misuse and self-medication, and driving.",
      "Agree the plan and tick the items that fit your decision: information and support groups, environmental modifications, treatment options and follow-up. Before any treatment starts, agree measurable goals and ask the GP about shared care for future prescribing (AQAS 2024 Table 2).",
      "If medication is an option, make sure the baseline is done: pulse, blood pressure, height, weight and a cardiovascular assessment. Ask for a cardiology opinion before starting if any of the NICE heart-history features is present.",
      "Explain the driving rule: the patient must tell the DVLA (DVA in Northern Ireland) only if their ADHD or its medication affects their ability to drive safely.",
      "If ADHD is not diagnosed, explain the alternative explanation or what is still unclear, and give information and signposting all the same.",
      "Read the draft report: symptoms with examples, scale scores, collateral, conditions present and absent, the statement that the symptoms are not better explained by another disorder, presentation, impaired domains and the plan. It is built from your entries, so correct an earlier step if a line is wrong. The report must support its own conclusion.",
      "Copy the report into the clinical record, then edit the wording and add identifiers there, not in this app. With the patient's agreement, send it to the GP. Tick I have reviewed and edited this draft.",
      "Mark the assessment complete, then delete it from this browser (Home, then Delete) so identifiable data does not stay here."
    ],
    say: [
      "Here is what I found, and why I have reached this conclusion.",
      "A diagnosis explains some of your difficulties; it does not define you. Many people find it helps them make sense of their past.",
      "Let's agree what would help most at home and at work, and then talk about treatment options.",
      "What questions do you have? It is fine to take this away and come back with more.",
      "You only need to tell the DVLA if your ADHD or your medication affects your ability to drive safely."
    ],
    watch: [
      "NICE recommends medication for adults whose symptoms still cause significant impairment in at least one domain after environmental modifications have been made and reviewed.",
      "An ECG is not needed before medication unless one of the NICE heart-history features is present, or a coexisting condition is treated with a medicine that may increase cardiac risk.",
      "Check every generated sentence against your notes before it goes into the record. The report must state that the symptoms are not better explained by another disorder (AQAS 2024).",
      "People who are told they do not have ADHD can feel dismissed. Explain the alternative and the next step clearly, and offer information about support groups, websites and help with education and work.",
      "Keep today's scale scores as a baseline, so change after treatment can be measured (AQAS 2024)."
    ],
    done: [
      "Feedback is given and the plan is agreed with the patient.",
      "The report is reviewed, edited and copied into the record.",
      "Follow-up and the GP letter are arranged."
    ],
    next: "Mark the assessment complete. At follow-up, review symptoms, impairment and side effects against today's baseline.",
    src: [
      "NICE NG87 1.4.3, 1.4.4, 1.5.15, 1.7.4 and 1.7.5",
      "UKAAN AQAS 2024 (post-diagnostic discussion, theme 2 report contents, Tables 1 to 3; about 1 hour for feedback and treatment discussion)",
      "GOV.UK: ADHD and driving",
      "RCPsych CR235 (2023) 12.1 and 16.2"
    ]
  }
});
