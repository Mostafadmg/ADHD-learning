/* Pre-assessment pack (ARCHITECTURE.md section 5.16): what to send before the DIVA interview, when and to whom;
   letter templates; the triage decision. Read by js/engine/pack.js (AA.pack) and js/views/assess-pack.js.
   Items link to the forms guide (guide), the workspace tool used to enter the result (tool), the course's printable
   form (form: ../forms/print.html?f=<toolId>, interactive tools only) and the official PDF (official, in
   ../forms/official/). outgoing: true marks a letter that only goes out (Sent completes it). Ids are stored in records: never rename or reuse one; add new items at the end.
   Template placeholders: {ref} {clinician} {service} {sentDate} {returnBy} {interviewDate} {interviewTime}
   {interviewMode}. Details the portal does not hold (names, dates of birth) are left in [square brackets]. */
AA.add('pack', {
  intro: 'The pack goes out as soon as the referral is accepted, so questionnaires, informant forms and records are back before the DIVA interview. It saves interview time and shows early what else needs looking at. It never makes the diagnosis on its own.',

  stages: [
    { id: 'referral', title: 'Referral accepted', day: 0, what: 'Check the referral belongs with this service and agree who may be contacted.',
      do: ['Record the date and the patient reference.', 'Check the age range and that no other ADHD service is involved.', 'Ask for consent to contact a partner or family member, the GP and, for young people, the school.'] },
    { id: 'sent', title: 'Pack sent', day: 1, what: 'Send the pack for this age group with a return date.',
      do: ['Send the welcome letter, consent and the questionnaires.', 'Send the informant letters, with the patient\'s agreement.', 'Request school reports and the GP summary.'] },
    { id: 'chase', title: 'Reminder', day: 14, what: 'If the required forms are not back, send a reminder.',
      do: ['Send the reminder letter.', 'Offer help: a phone call, large print or an interpreter.', 'Note any form that cannot be done, and why.'] },
    { id: 'returned', title: 'Forms back', day: 21, what: 'Enter what came back, and check safety first.',
      do: ['Mark each item as back.', 'Enter the scores in Screening questionnaires and Co-occurring conditions.', 'Act the same day on any safety flag.'] },
    { id: 'triage', title: 'Triage', day: 24, what: 'Decide whether to go ahead with the interview.',
      do: ['Read the results alongside the referral.', 'Choose: book, wait for information, act on safety first, or another route first.', 'Write down the reason.'] },
    { id: 'booked', title: 'Interview booked', day: 28, what: 'Book the DIVA interview and invite the right people.',
      do: ['Book about 90 minutes.', 'Invite a partner and a parent or older relative.', 'Send the appointment letter.'] }
  ],

  groups: [
    { id: 'letters', label: 'Letters and consent' },
    { id: 'self', label: 'Questionnaires for the patient' },
    { id: 'informant', label: 'For a partner, family member or teacher' },
    { id: 'records', label: 'Records to request' },
    { id: 'health', label: 'Health and safety' }
  ],

  items: [
    /* ---------- adults ---------- */
    { id: 'pk_welcome', group: 'letters', ages: 'adult', title: 'Welcome letter and what happens next', who: 'Patient',
      why: 'Explains the steps, the return date and why the forms and informants matter.', required: true, outgoing: true, template: 'tpl_welcome' },
    { id: 'pk_consent', group: 'letters', ages: 'all', title: 'Consent and privacy', who: 'Patient, or a person with parental responsibility',
      why: 'Agreement to contact informants, the GP and the school, and how the information is stored and shared.', required: true },
    { id: 'pk_history', group: 'self', ages: 'adult', title: 'Pre-assessment history questionnaire', who: 'Patient, with family help for early childhood',
      why: 'Development, school, health and family history, so the interview can focus on symptoms.', required: true, guide: 'history_questionnaire' },
    { id: 'pk_asrs', group: 'self', ages: 'adult', title: 'ASRS v1.1 (18 questions)', who: 'Patient',
      why: 'Current adult symptoms. Part A is the screen; all 18 items give a baseline.', required: true, tool: 'asrs18', form: 'asrs18', official: 'asrs-v1-1.pdf', guide: 'asrs18' },
    { id: 'pk_wfirs', group: 'self', ages: 'adult', title: 'WFIRS-S (daily functioning)', who: 'Patient',
      why: 'How the symptoms affect daily life. Repeat it later to measure change.', required: true, tool: 'wfirs', form: 'wfirs', official: 'wfirs-s.pdf', guide: 'wfirs' },
    { id: 'pk_wurs', group: 'self', ages: 'adult', title: 'WURS-25 (childhood recall)', who: 'Patient',
      why: 'The patient\'s own memory of childhood. Informant and school evidence weigh more.', required: false,
      when: 'Use it when childhood informants or school reports may be hard to get.', tool: 'wurs25', form: 'wurs25', guide: 'wurs25' },
    { id: 'pk_phq9', group: 'self', ages: 'adult', title: 'PHQ-9 (low mood)', who: 'Patient',
      why: 'Low mood can mimic or add to ADHD. Item 9 asks about thoughts of self-harm.', required: true, tool: 'phq9', form: 'phq9', official: 'phq-9.pdf', guide: 'phq9' },
    { id: 'pk_gad7', group: 'self', ages: 'adult', title: 'GAD-7 (anxiety)', who: 'Patient',
      why: 'Anxiety often co-occurs and can look like inattention.', required: true, tool: 'gad7', form: 'gad7', official: 'gad-7.pdf', guide: 'gad7' },
    { id: 'pk_audit', group: 'self', ages: 'adult', title: 'AUDIT (alcohol)', who: 'Patient',
      why: 'Alcohol affects attention, the diagnosis and later prescribing.', required: true, tool: 'audit', form: 'audit', official: 'audit.pdf', guide: 'audit' },
    { id: 'pk_dast', group: 'self', ages: 'adult', title: 'DAST-10 (drugs)', who: 'Patient',
      why: 'Drug use can mimic ADHD and matters before any controlled drug is prescribed.', required: true, tool: 'dast10', form: 'dast10', guide: 'dast10' },
    { id: 'pk_mdq', group: 'self', ages: 'adult', title: 'MDQ (bipolar screen)', who: 'Patient',
      why: 'Screens for past periods of high or irritable mood that need ruling out.', required: false,
      when: 'Add it when there are mood swings, periods of high energy, or a family history of bipolar disorder.', tool: 'mdq', form: 'mdq', guide: 'mdq' },
    { id: 'pk_aq10', group: 'self', ages: 'adult', title: 'AQ-10 (autism traits)', who: 'Patient',
      why: 'Autism often co-occurs with ADHD and shares some features.', required: false,
      when: 'Add it when the referral or history mentions social difficulties, rigid routines or sensory problems.', tool: 'aq10', form: 'aq10', official: 'aq-10.pdf', guide: 'aq10' },
    { id: 'pk_pcl5', group: 'self', ages: 'adult', title: 'PCL-5 (trauma)', who: 'Patient',
      why: 'Trauma symptoms can affect concentration, sleep and mood.', required: false,
      when: 'Add it when the referral or history mentions trauma. The patient may leave it for the appointment.', tool: 'pcl5', form: 'pcl5', official: 'pcl-5.pdf', guide: 'pcl5' },
    { id: 'pk_msibpd', group: 'self', ages: 'adult', title: 'MSI-BPD (emotional instability)', who: 'Patient',
      why: 'Screens for borderline personality traits, which overlap with ADHD.', required: false,
      when: 'Add it when there is self-harm, chaotic relationships or marked emotional instability.', tool: 'msibpd', form: 'msibpd', guide: 'msibpd' },
    { id: 'pk_sleep', group: 'self', ages: 'adult', title: 'STOP-Bang and Epworth (sleep)', who: 'Patient, and a bed partner for snoring',
      why: 'Sleep apnoea and poor sleep can cause attention problems.', required: false,
      when: 'Add it for snoring, daytime sleepiness, or attention problems that started in adulthood.', tool: 'stopbang', guide: 'stopbang' },
    { id: 'pk_wsr2', group: 'self', ages: 'adult', title: 'WSR-II (broad problem checklist)', who: 'Patient',
      why: 'A wide screen of problems across many conditions in one form.', required: false,
      when: 'Use it if your service screens many conditions at once with it.', tool: 'wsr2', official: 'wsr-ii.pdf', guide: 'wsr2' },
    { id: 'pk_inf_partner', group: 'informant', ages: 'adult', title: 'Informant form: partner or close friend (now)', who: 'Partner, close friend or housemate',
      why: 'An outside view of current symptoms and their impact.', required: true, guide: 'informant_forms', template: 'tpl_informant' },
    { id: 'pk_inf_parent', group: 'informant', ages: 'adult', title: 'Informant form: parent or older relative (childhood)', who: 'Parent, older sibling or another adult who knew them before 12',
      why: 'Childhood evidence is needed for the diagnosis and is often the hardest part to get.', required: true, guide: 'informant_forms', template: 'tpl_informant' },
    { id: 'pk_invite', group: 'informant', ages: 'all', title: 'Invite someone to the interview', who: 'Patient, or the parent or carer',
      why: 'A partner (now) and a parent or older relative (childhood) make the interview more accurate.', required: false,
      when: 'Ask every patient. It is fine if nobody can come.' },
    { id: 'pk_school', group: 'records', ages: 'adult', title: 'Old school reports', who: 'Patient or family',
      why: 'Primary school teacher comments are some of the best evidence of childhood symptoms.', required: false,
      when: 'Ask everyone. Many adults no longer have them; record what was tried.', guide: 'school_reports' },
    { id: 'pk_gp', group: 'records', ages: 'all', title: 'GP summary and medicines', who: 'GP',
      why: 'Physical health, medicines, blood pressure and past mental health care.', required: true, guide: 'previous_records', template: 'tpl_gp' },
    { id: 'pk_previous', group: 'records', ages: 'all', title: 'Earlier assessments and reports', who: 'Patient, family, school or services',
      why: 'Educational psychology, dyslexia, CAMHS or other mental health reports.', required: false,
      when: 'Ask for them if there has been any earlier assessment.', guide: 'previous_records' },
    { id: 'pk_health', group: 'health', ages: 'all', title: 'Physical health and heart questions', who: 'Patient, or the parent or carer',
      why: 'Fainting, chest pain, heart problems or sudden death in the family matter if medicine is considered later.', required: false,
      when: 'Useful in every pack, and needed before any ADHD medicine.' },

    /* ---------- young people (6 to 17) ---------- */
    { id: 'pk_y_letter', group: 'letters', ages: 'young', title: 'Letter to the parent or carer', who: 'Parent or carer',
      why: 'Explains the steps, who fills in which form, and the return date.', required: true, outgoing: true, template: 'tpl_welcome_young' },
    { id: 'pk_y_history', group: 'self', ages: 'young', title: 'Developmental history questionnaire', who: 'Parent or carer',
      why: 'Pregnancy, birth, early development, health and family history.', required: true, guide: 'history_questionnaire' },
    { id: 'pk_y_parent', group: 'informant', ages: 'young', title: 'Parent rating scale (for example SNAP-IV or Conners 4)', who: 'Parent or carer',
      why: 'ADHD symptoms at home, compared with children of the same age.', required: true, tool: 'snap4', official: 'snap-iv-26.pdf' },
    { id: 'pk_y_teacher', group: 'informant', ages: 'young', title: 'Teacher rating scale and school information', who: 'Class teacher or SENCo',
      why: 'Symptoms in a second setting: the diagnosis needs problems in two or more settings.', required: true, template: 'tpl_school' },
    { id: 'pk_y_sdq', group: 'informant', ages: 'young', title: 'SDQ (strengths and difficulties)', who: 'Parent and teacher; the young person from age 11',
      why: 'A broad screen for emotional, behaviour and friendship problems.', required: false,
      when: 'Add it when other difficulties are suspected, or if your service sends it to everyone.', tool: 'sdq' },
    { id: 'pk_y_wfirsp', group: 'informant', ages: 'young', title: 'WFIRS-P (functioning at home and school)', who: 'Parent or carer',
      why: 'How the difficulties affect family life, learning and friendships.', required: false,
      when: 'Use it to measure impairment, and change after treatment.', tool: 'wfirsp' },
    { id: 'pk_y_school', group: 'records', ages: 'young', title: 'School reports and any support plan (SEN support or EHCP)', who: 'Parent or school',
      why: 'Shows how long the problems have been there and what support has been tried.', required: true, guide: 'school_reports' }
  ],

  templates: [
    { id: 'tpl_welcome', title: 'Welcome letter and forms', for: 'Patient', subject: 'Your ADHD assessment: next steps and forms',
      body: 'Hello,\n\nThank you for your referral to {service}. Your reference is {ref}.\n\nBefore we meet, please fill in the enclosed questionnaires and return them by {returnBy}. You can do them in more than one sitting. There are no right or wrong answers: answer about your usual self, not your best or worst days.\n\nTwo things help us most:\n- Someone who knew you as a child, such as a parent or an older brother or sister. There is a form for them, and they are welcome to join the appointment.\n- Old school reports, especially from primary school, if you or your family still have them.\n\nWhen your forms are back we will check them and offer you an appointment for the assessment interview, called DIVA. It takes about 90 minutes. We will talk through your life now and when you were a child, with real examples.\n\nIf anything is hard to fill in, or you need large print or an interpreter, please contact us. If you feel unsafe or have thoughts of harming yourself, contact your GP or NHS 111, or call 999 in an emergency.\n\nKind regards,\n{clinician}\n{service}' },
    { id: 'tpl_welcome_young', title: 'Letter to the parent or carer', for: 'Parent or carer', subject: 'ADHD assessment (reference {ref}): next steps and forms',
      body: 'Hello,\n\nThank you for the referral to {service} for your child (reference {ref}).\n\nBefore we meet, please fill in the enclosed forms and return them by {returnBy}. There are no right or wrong answers: describe how your child usually is, compared with other children of the same age.\n\nWe also need to hear from school, because ADHD shows in more than one place. Please tell us if you are happy for us to contact your child\'s school, or pass the school form to the class teacher yourself.\n\nPlease send copies of school reports, and any plans or reports about extra support at school (for example SEN support or an EHCP).\n\nAt the appointment we will see you and your child, and we may spend part of the time with each of you.\n\nIf you need large print or an interpreter, please contact us.\n\nKind regards,\n{clinician}\n{service}' },
    { id: 'tpl_informant', title: 'Letter to a partner or family member', for: 'Partner or family member', subject: 'Helping with an ADHD assessment',
      body: 'Hello,\n\n[Patient\'s name] has asked us to contact you as part of an ADHD assessment with {service}, and has agreed to us doing so.\n\nADHD starts in childhood and lasts, so we need to hear from people who know the person well. Please fill in the enclosed form about the time you know best: as they are now, or as they were as a child, roughly between the ages of 5 and 12.\n\nReal examples help more than ticks: what happened, how often, and how it compared with others of the same age. You do not need to remember everything.\n\nPlease return the form by {returnBy}. You are also welcome to join part of the assessment appointment, in person or by phone.\n\nThank you for your help.\n\n{clinician}\n{service}' },
    { id: 'tpl_reminder', title: 'Reminder: forms not back', for: 'Patient', subject: 'Reminder: your ADHD assessment forms',
      body: 'Hello,\n\nWe sent you the forms for your ADHD assessment on {sentDate} and have not received all of them yet. Please return them as soon as you can.\n\nIf something is getting in the way, such as a form that is hard to understand, a question you would rather talk about in person, or a family member who cannot help, please get in touch. We can usually find a way round it.\n\nKind regards,\n{clinician}\n{service}' },
    { id: 'tpl_school', title: 'Request to the school', for: 'School', subject: 'Information request: ADHD assessment (reference {ref})',
      body: 'Dear class teacher or SENCo,\n\n{service} is assessing [pupil\'s name] (our reference {ref}) for ADHD, with the family\'s consent. It would help us greatly to know how they are at school.\n\nPlease complete the enclosed questionnaire and, if you can, tell us in a few lines:\n- how their attention, activity and behaviour compare with other pupils of the same age,\n- how they get on with learning, friendships and unstructured times,\n- what support is in place and how well it works.\n\nPlease return it by {returnBy}. Thank you for your help.\n\n{clinician}\n{service}' },
    { id: 'tpl_gp', title: 'Request to the GP', for: 'GP', subject: 'Request for a summary: ADHD assessment (reference {ref})',
      body: 'Dear Doctor,\n\n{service} is assessing your patient [name, date of birth] (our reference {ref}) for ADHD. With the patient\'s consent, please could you send us:\n- a summary of current and past medical problems,\n- current medicines, and any recent blood pressure, pulse, height and weight,\n- any past mental health care, referrals or diagnoses,\n- any history of heart problems or fainting, or sudden death in the family.\n\nThis helps us look for other causes of the symptoms and plan safely if treatment is offered.\n\nKind regards,\n{clinician}\n{service}' },
    { id: 'tpl_appointment', title: 'Interview appointment letter', for: 'Patient', subject: 'Your ADHD assessment appointment',
      body: 'Hello,\n\nYour ADHD assessment appointment is on {interviewDate} at {interviewTime}, {interviewMode}.\n\nIt lasts about 90 minutes. We will use an interview called DIVA. It goes through each of the main signs of ADHD, first as they are now and then as they were when you were a child, and asks for real examples from your life.\n\nIt helps a lot if someone who knows you well can join for part of it: a partner for how you are now, and a parent or older relative for your childhood. They can join in person or by phone.\n\nPlease bring any school reports and a list of your medicines.\n\nAt the end we will explain what happens next. You may not get a final answer on the day: sometimes we need more information first.\n\nIf you need to change the appointment, please contact us as soon as possible.\n\nKind regards,\n{clinician}\n{service}' },
    { id: 'tpl_missing', title: 'Information still needed', for: 'Patient', subject: 'Information still needed for your ADHD assessment',
      body: 'Hello,\n\nThank you for the forms you have returned. To complete your assessment we still need:\n[list what is missing]\n\nIf any of this is not available, please let us know. It will not always stop the assessment, but it helps us plan the appointment.\n\nKind regards,\n{clinician}\n{service}' }
  ],

  triage: [
    { id: 'tr_book', label: 'Book the DIVA interview', when: 'The required forms are back, or reasonably cannot be got, and nothing needs acting on first.' },
    { id: 'tr_wait', label: 'Wait for missing information', when: 'Something important, such as the informant forms or the GP summary, is still missing and worth waiting for.' },
    { id: 'tr_safety', label: 'Act on a safety concern first', when: 'A returned form raises a safety concern, such as thoughts of self-harm on PHQ-9 item 9: assess the same day and follow local risk procedures.' },
    { id: 'tr_other', label: 'Another route first', when: 'Another need comes first, for example active drug or alcohol dependence, a current severe mental illness, or a referral that belongs to another service.' }
  ],

  src: [
    'What each form screens and how to read it: the pre-appointment forms guide in this workspace',
    'NICE NG87 (information from others and rating scales support, and do not replace, the clinical assessment)',
    'UKAAN AQAS 2024 (informant and school information)',
    'RCPsych CR235 (2023)',
    'Timings, letters and triage options: clinical practice'
  ]
});
