/* tools-info: information-only instruments used around an adult ADHD assessment (ARCHITECTURE.md section 5.4).
   Child and adolescent ADHD scales met in childhood or transition records (conners4, adhdrs5, vanderbilt, snap4, sdq),
   sleep (epworth, isi), bipolar (hcl32), OCD (ocir, ybocs), cognition (moca), adverse childhood experiences (aceq)
   and substance use (assist).
   Interactive: aceq only. CDC states that the ACE Study questionnaires are not copyrighted and carry no fees; the
   10 items follow the 'Finding your ACE score' short form (copy checked: US Probation, District of Minnesota).
   All others are interactive:false with empty items, because the licence does not allow reproduction, the licence
   could not be verified, or the scale is a child tool. No PDFs are redistributed (file: null throughout).
   Scoring rules and figures were checked against: AAP scoring instructions for the NICHQ Vanderbilt scales (2012)
   and the 2002 parent form; CADDRA SNAP-IV-26 form and toolkit; WHO ASSIST manual (2010); ATS sleep questionnaire
   pages; MoCA permission page; sdqinfo.org; NICHQ resource page; CDC ACE Study page; and the PubMed abstracts of
   Johns 1991, Bastien 2001, Morin 2011, Angst 2005, Foa 2002, Goodman 1989, Nasreddine 2005, Felitti 1998,
   Humeniuk 2008, Wolraich 2003, Bussing 2008, Goodman 1997, DuPaul 2016, Baldwin 2019 and Mataix-Cols 2016; the
   Conners 4 online manual; and the GOV.UK ASSIST-Lite and DVLA fitness-to-drive pages. Figures not confirmed in a primary source are
   labelled as such in the text. Clinical advice without a named source is clinical practice. */
AA.add('tools', [

  /* ------------------------------------------------------------------ Conners 4 */
  {
    id: "conners4", abbr: "Conners 4", name: "Conners 4th Edition (Conners 4)",
    group: "child", stage: ["referral", "collateral"],
    who: "Parent and teacher forms, and a young person's self-report. Publisher qualification required.",
    time: "Full forms 10-25 minutes (average 12-15); Short forms 5-10 minutes; ADHD Index 1-3 minutes (Conners 4 manual)",
    ages: "6-18 (self-report 8-18)", items_n: null,
    purpose: "Commercial rating scale for ADHD symptoms and related problems in children and adolescents (MHS, 2022; successor to the Conners 3). NICE NG87 rec 1.3.2 names the Conners' rating scales, with the SDQ, as helpful added tools in diagnosis. Both are child and adolescent scales.",
    when: "Not used to assess adults directly. It matters in two situations. Transition: a young person of 17-18 referred from CAMHS or paediatrics may arrive with recent Conners parent, teacher and self-report results. Childhood records: old Conners reports (Conners 4, Conners 3 or earlier editions) in school, CAMHS or paediatric notes are useful evidence for Criterion B (several symptoms before 12) and Criterion C (more than one setting). Read them in the Collateral step. For an adult's own symptoms use adult tools such as the ASRS or CAARS 2.",
    how: "Administered and scored by a qualified user, on paper or online through MHS. When you read an old report, note the edition, who completed each form, the child's age, whether the child was taking medication at the time, and the actual scale scores, not only the summary.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Results are T-scores (mean 50, standard deviation 10) against age-based norms. Conners 4 reports use combined-gender norms by default, with gender-specific norms as an option, so check which the report used. In the manual, T-scores below 60 are generally typical and 70 or more is very elevated (2 standard deviations above the mean). Use the ranges printed in the report you are reading: editions differ, so do not apply Conners 4 ranges to an older report.",
      "Forms (publisher listing): full Parent 117 items, Teacher 109 and Self-Report 118; Short Parent 53, Teacher 49 and Self-Report 51; and a 12-item ADHD Index on each form for screening.",
      "Scales (Conners 4 manual): content scales (inattention/executive dysfunction, hyperactivity, impulsivity, emotional dysregulation, depressed mood, anxious thoughts); DSM symptom scales (ADHD inattentive, hyperactive-impulsive and total, oppositional defiant and conduct disorder); impairment and functional outcome scales (schoolwork, peer interactions, family life). Response-style indexes (Negative Impression, Inconsistency, omitted items, pace) flag ratings that need caution.",
      "Critical items cover severe conduct and self-harm, and there is a sleep problems indicator. In a transition referral, read these first: an endorsed self-harm item needs follow-up in the Safety and risk step.",
      "Raised inattention or hyperactivity ratings from both a parent and a teacher are stronger evidence than one high rating. Parent-teacher agreement is often modest.",
      "A normal childhood report does not rule ADHD out, especially when symptoms were mainly inattentive or the form was completed for a different question."
    ],
    psychometrics: "Normed by the publisher on US general-population samples, with reliability and validity data in the Conners 4 manual. These were not reviewed in detail for this app. There are no UK norms.",
    pitfalls: [
      "Normed only up to age 18. Do not ask an older adult, or their parent, to complete it about the present or about childhood.",
      "Rating scales do not diagnose ADHD on their own (NICE NG87 rec 1.3.2).",
      "Old reports may use the Conners 3, the Conners' Rating Scales-Revised or earlier forms, with different scales and norms.",
      "Ratings made while the child was on medication understate symptoms.",
      "High ratings also occur with anxiety, trauma, autism, learning difficulties and family stress."
    ],
    adhdNotes: "In an adult assessment the Conners is collateral, not a test. A childhood report with raised ratings from more than one informant supports onset before 12 and pervasiveness. Weigh it with school reports and the parent interview, and record it in the Collateral step.",
    licence: "Proprietary (Multi-Health Systems). Qualification required; forms and reports are sold by MHS. Items and norms may not be reproduced. Not reproduced here.",
    source: "Conners CK. Conners 4th Edition (Conners 4). Toronto: Multi-Health Systems, 2022. Conners 4 online manual (MHS): overview of content, interpretation and standardisation chapters. NICE NG87, rec 1.3.2.",
    url: "https://storefront.mhs.com/collections/conners-4",
    file: null
  },

  /* ------------------------------------------------------------------ ADHD-RS-5 */
  {
    id: "adhdrs5", abbr: "ADHD-RS-5", name: "ADHD Rating Scale-5 for Children and Adolescents (and the ADHD-RS-IV with adult prompts)",
    group: "child", stage: ["collateral", "followup"],
    who: "Parent (Home Version) or teacher (School Version). The ADHD-RS-IV with adult prompts is a clinician rating used in adult trials.",
    time: "About 5-10 minutes (clinical practice estimate)",
    ages: "5-17 (child form 5-10, adolescent form 11-17)", items_n: 18,
    purpose: "Commercial DSM-5 rating scale for ADHD symptoms in children and adolescents (DuPaul, Power, Anastopoulos and Reid; Guilford, 2016). Nine inattention and nine hyperactivity-impulsivity items are rated for frequency. Six impairment domains (relationships with family or teachers, peers, academic functioning, behaviour, homework and self-esteem) are rated after each symptom set. Its predecessor, the ADHD-RS-IV, with adult prompts added, is widely used as the clinician-rated outcome in adult ADHD medication trials.",
    when: "A child tool. In an adult assessment you meet it in childhood or transition records (Collateral step), and in the adult treatment trials you draw on when explaining medication evidence. It is not validated as a retrospective rating of an adult's childhood. For an adult's baseline and monitoring, use the ASRS v1.1 or the clinician-rated AISRS instead.",
    how: "The parent or teacher rates each symptom on a 4-point frequency scale (0 never or rarely, 1 sometimes, 2 often, 3 very often), then rates impairment. The clinician sums the subscales and compares them with the age- and gender-based percentile norms in the manual. In the adult-prompt version, the clinician reads set prompts for each item and scores the highest frequency the patient describes.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Each item 0-3: inattention and hyperactivity-impulsivity subscales 0-27 each, total 0-54.",
      "In the ADHD-RS-IV, odd-numbered items are inattention and even-numbered items hyperactivity-impulsivity (trial registry descriptions). Check the layout of the version you hold.",
      "Compare subscale and total scores with the manual's percentile norms. Home and School norms differ, and so do norms for boys and girls and for age bands.",
      "Many clinicians treat an item rated 2 or 3 as present when comparing ratings with DSM-5 criteria (clinical practice). The manual itself uses norms.",
      "The impairment items show whether the symptoms cause real problems at home, with peers and at school. Symptoms without impairment do not meet criteria."
    ],
    psychometrics: "Normative sample (DuPaul et al. 2016): 2,079 parents, each rating one child, and 1,070 teachers, each rating one boy and one girl, with demographics close to 2013 US census estimates. Norms are reported separately by informant, child gender and age. Reliability and validity data are in the manual and were not reviewed in detail for this app. The validation paper for the adult-prompt version was not checked.",
    pitfalls: [
      "US child and adolescent norms only. There are no UK or adult norms; do not apply them to adults.",
      "Ratings made on medication understate symptoms; note the medication status.",
      "High ratings are not specific to ADHD: anxiety, trauma, autism, learning difficulties and oppositional behaviour all raise them.",
      "Do not confuse it with the ASRS. Both have 18 DSM-based items, but the response scales and thresholds differ."
    ],
    adhdNotes: "Its main value in adult work is reading: childhood or transition records may contain ADHD-RS results, and adult trials report changes in ADHD-RS-IV totals. For an adult's own symptoms rely on the semi-structured interview, with the ASRS or AISRS for baseline and monitoring.",
    licence: "Proprietary (Guilford Press). The checklists come with the purchased manual, which gives purchasers a limited licence to photocopy the forms and score sheets for their own clients. Licensing of the adult-prompt version was not verified. Not reproduced here.",
    source: "DuPaul GJ, Power TJ, Anastopoulos AD, Reid R. ADHD Rating Scale-5 for Children and Adolescents: Checklists, Norms, and Clinical Interpretation. New York: Guilford Press, 2016. DuPaul GJ et al. Parent and teacher ratings of ADHD symptoms: factor structure and normative data. Psychol Assess 2016;28:214-25. ADHD-RS-IV with adult prompts as described in trial registrations (for example NCT01692782).",
    url: "https://www.guilford.com/books/ADHD-Rating-Scale-5-for-Children-and-Adolescents/DuPaul-Power-Anastopoulos-Reid/9781462524877",
    file: null
  },

  /* ------------------------------------------------------------------ NICHQ Vanderbilt */
  {
    id: "vanderbilt", abbr: "NICHQ Vanderbilt", name: "NICHQ Vanderbilt Assessment Scales (parent and teacher informant)",
    group: "child", stage: ["collateral"],
    who: "Parent or teacher informant",
    time: "About 10 minutes (clinical practice estimate)",
    ages: "Validated for ages 6-12 (AAP scoring instructions)", items_n: 55,
    purpose: "Parent and teacher rating scales from the American Academy of Pediatrics (AAP) and NICHQ, adapted from the Vanderbilt Rating Scales developed by Mark Wolraich. They cover the 18 DSM-IV ADHD symptoms, screens for oppositional defiant disorder, conduct disorder and anxiety or depression (and learning problems on the teacher form), and performance (impairment) items. The parent initial form has 55 items (47 symptoms, 8 performance); the teacher initial form has 43 (35 symptoms, 8 performance). Follow-up forms track symptoms and medication side effects.",
    when: "A child tool, used mostly in North America. In an adult assessment it helps in two ways: reading childhood or transition records that contain Vanderbilt results (Collateral step), and as a structured prompt when a parent describes the patient's primary-school years. It has no validation as a retrospective rating of an adult's childhood, so use any retrospective version as an aide-memoire for the parent interview, not as a score. CADDRA lists the Vanderbilt among other usable tools.",
    how: "The informant rates the child's behaviour over the past 6 months, thinking about what is appropriate for the child's age. Symptoms are rated 0 never, 1 occasionally, 2 often, 3 very often. Performance is rated 1 excellent to 5 problematic. The form asks whether the ratings were made when the child was on medication, off medication or not sure.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "A symptom counts as positive when rated 2 or 3 (often or very often).",
      "Inattentive: 6 or more of items 1-9 positive. Hyperactive-impulsive: 6 or more of items 10-18 positive. Combined: both.",
      "Impairment is required as well: at least 2 performance items rated 4, or at least 1 rated 5. Teacher performance items are 36-43. The 2002 parent form numbers its performance items 48-55, while the AAP scoring sheet refers to 48-54; check the form you have.",
      "Parent comorbidity screens (each also needs the performance rule): oppositional defiant disorder 4 of items 19-26; conduct disorder 3 of items 27-40; anxiety or depression 3 of items 41-47. Teacher form: oppositional or conduct problems 3 of items 19-28; anxiety or depression 3 of items 29-35; learning problems when items 36 and 38 are both rated 4, or one is rated 5.",
      "The thresholds follow DSM-IV child criteria (6 symptoms). DSM-5-TR keeps 6 for children under 17 but needs only 5 from age 17, so these counts do not transfer to adults.",
      "The AAP states that the scales should not be used alone to diagnose ADHD; information from interviews with caregivers and the patient, and from several sources, is needed."
    ],
    psychometrics: "Wolraich et al. 2003 (parent scale, 243 referred children): acceptable internal consistency and a factor structure consistent with DSM-IV, compared against teacher ratings and a computerised DSM-IV diagnostic interview (C-DISC-IV, parent version). The AAP scoring instructions state that validation studies were in 6-12-year-olds.",
    pitfalls: [
      "Not validated for adults or for retrospective ratings decades later. There are no adult cut-offs.",
      "DSM-IV item wording and child thresholds.",
      "Ratings made on medication understate symptoms.",
      "The oppositional, conduct and anxiety or depression sections are screens, not diagnoses.",
      "The parent form and the AAP scoring sheet number the performance items slightly differently."
    ],
    adhdNotes: "If a parent completes a Vanderbilt about the patient's childhood, use it to open the parent interview: which symptoms, in which settings, and what school said at the time. A Vanderbilt completed at the time by a teacher, found in records, is stronger evidence than one completed from memory years later.",
    licence: "Copyright 2002 American Academy of Pediatrics and NICHQ, adapted from the Vanderbilt Rating Scales developed by Mark L. Wolraich (form footer). NICHQ offers the first edition (2002) as a free download and asks for a reference to NICHQ when it is cited; later editions (2nd 2011, 3rd 2019) come from the AAP, and the 3rd edition is sold through the AAP bookstore. Terms for reproduction in software were not verified. Not reproduced here.",
    source: "NICHQ Vanderbilt Assessment Scales, parent and teacher informant forms (AAP and NICHQ, 2002). AAP. Caring for Children With ADHD: A Resource Toolkit for Clinicians, 2nd ed. 2012: scoring instructions. Wolraich ML et al. J Pediatr Psychol 2003;28:559-67.",
    url: "https://www.nichq.org/resource/nichq-vanderbilt-assessment-scales",
    file: null
  },

  /* ------------------------------------------------------------------ SNAP-IV */
  {
    id: "snap4", abbr: "SNAP-IV", name: "Swanson, Nolan and Pelham Rating Scale, version IV (SNAP-IV-26)",
    group: "adhd-childhood", stage: ["pre", "collateral"],
    who: "Parent or teacher. In adult assessment, a parent or older relative rates the patient's childhood (CADDRA).",
    time: "About 5-10 minutes (clinical practice estimate)",
    ages: "Developed and normed in children; used by CADDRA as a retrospective childhood rating for adults", items_n: 26,
    purpose: "Short rating scale of the 18 DSM-IV ADHD symptoms (items 1-9 inattention, 10-18 hyperactivity-impulsivity) and 8 oppositional defiant disorder symptoms (items 19-26), each rated 0 not at all, 1 just a little, 2 quite a bit, 3 very much. The 26-item version is the one in common clinical use; a longer 90-item SNAP-IV also exists.",
    when: "In the CADDRA adult pathway (step 1, initial information gathering), someone who knew the patient as a child completes the SNAP-IV about the patient's childhood. The patient completes the ASRS and a partner or close other completes an observer ASRS at the same time. Send it before the appointment, then explore the endorsed items in the parent interview (Collateral step).",
    how: "Ask the informant to think about the patient at primary-school age (before 12) and rate each item. Score each subscale, then ask for concrete examples of every item rated 2 or 3.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Swanson's method: subscale score = total of the item ratings divided by the number of items (an average from 0 to 3). It is compared with tentative cut-offs at about the 95th percentile of US child samples, which are higher for teacher than for parent ratings. The values usually quoted (teacher / parent) are: inattention 2.56 / 1.78; hyperactivity-impulsivity 1.78 / 1.44; combined 2.00 / 1.67; oppositional 1.38 / 1.88. These come from secondary sources, the original scoring sheet was not checked, and at least one published review could not trace where these 'tentative 5% cut-offs' came from. Treat them as rough benchmarks for children, not diagnostic thresholds.",
      "Bussing et al. 2008: parent average scores above 1.2 raised the probability of concern (likelihood ratio above 10), and above 1.8 the probability of an ADHD diagnosis (likelihood ratio above 3).",
      "CADDRA's printed guide sums items instead: inattention (items 1-9, out of 27) under 13 not significant, 13-17 mild, 18-22 moderate, 23-27 severe. Its hyperactivity-impulsivity bands are printed out of 24 although the maximum is 27, and its 'suggested targets' give a different threshold, so do not apply them.",
      "When counting against DSM criteria, an item rated 2 or 3 is often treated as present (clinical practice).",
      "Items 19-26 cover oppositional behaviour, which is common in children with ADHD. They are not conduct disorder items. Antisocial personality disorder needs evidence of conduct disorder before age 15, so ask separately about aggression, cruelty, fire-setting, theft, truancy and running away."
    ],
    psychometrics: "Bussing et al. 2008 (parents of 1,613 and teachers of 1,205 primary school children): acceptable reliability; two ADHD factors and an oppositional factor; scores varied by gender and poverty status. No study validating it as a retrospective rating of an adult's childhood was found.",
    pitfalls: [
      "Retrospective ratings made decades later are open to recall bias in both directions. The parent may have ADHD themselves, or may minimise.",
      "US child norms do not transfer to retrospective adult use; treat any cut-off as a rough guide.",
      "DSM-IV wording.",
      "The 26-item and 90-item versions number their items differently. Check which version you have before scoring.",
      "CADDRA's summed bands for hyperactivity-impulsivity contain a printing error."
    ],
    adhdNotes: "The SNAP-IV is a simple, structured way to get a parent's view of the patient's childhood. Several items rated 2-3 across both dimensions, backed by concrete examples in the interview, support Criterion B. A low score is not proof of absence: many parents of adults in mid-life cannot recall detail, and quiet, inattentive children were often missed.",
    licence: "Attributed to James M. Swanson. The CADDRA copy carries no copyright line. It is often described as public domain, but this was not confirmed with the author. Not reproduced here.",
    source: "Swanson JM. SNAP-IV Teacher and Parent Rating Scale (26-item version). CADDRA Canadian ADHD Practice Guidelines 4.1 and CADDRA ADHD toolkit (SNAP-IV-26 form, 2022). Bussing R et al. Assessment 2008;15:317-28.",
    url: "https://www.caddra.ca/wp-content/uploads/SNAP-IV-26_July-11-2022.pdf",
    file: null
  },

  /* ------------------------------------------------------------------ SDQ */
  {
    id: "sdq", abbr: "SDQ", name: "Strengths and Difficulties Questionnaire",
    group: "child", stage: ["collateral"],
    who: "Parent and teacher versions; self-report for young people of about 11-17. An 18+ self-report version also exists.",
    time: "About 5 minutes (clinical practice estimate)",
    ages: "Children and young people (2-17); 18+ self-report version without validated bands", items_n: 25,
    purpose: "Brief behavioural screening questionnaire (Goodman, 1997). Its 25 items form five scales of five items: emotional symptoms, conduct problems, hyperactivity-inattention, peer relationship problems and prosocial behaviour. An optional impact supplement asks about distress and impairment. NICE NG87 rec 1.3.2 names it, with the Conners' scales, as a helpful added tool in diagnosis.",
    when: "A child tool, widely used in UK schools, CAMHS and social care. In England, local authorities collect a carer SDQ each year for looked-after children aged 4-16 (DfE and DHSC statutory guidance on the health of looked-after children, 2015), so care-experienced adults often have SDQs on file. In an adult assessment it turns up in childhood records, education files or transition paperwork (Collateral step). A raised hyperactivity-inattention score from a parent and a teacher, recorded in childhood, is useful evidence of early onset and pervasiveness. It is not a measure of adult ADHD.",
    how: "Each item is rated not true, somewhat true or certainly true (0-2), with five items scored in reverse. Total difficulties is the sum of the four problem scales; the prosocial scale is scored separately. Banding uses the published UK norms on sdqinfo.org.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Each scale 0-10. Total difficulties 0-40 (emotional, conduct, hyperactivity-inattention and peer scales). Prosocial 0-10, scored separately. The impact supplement gives an impact score.",
      "The hyperactivity-inattention scale covers restlessness, fidgeting, distractibility, thinking before acting and attention span. It does not map onto all 18 DSM symptoms.",
      "Score bands come from UK norms and differ by informant. Use the official scoring tables, not remembered cut-offs.",
      "Raised emotional or peer scores in childhood point you to questions about anxiety, mood, trauma or autism as well as ADHD.",
      "Cut-off bands are not validated for the 18+ self-report version; use continuous scores if you meet it (secondary guidance)."
    ],
    psychometrics: "Goodman 1997 (403 children from dental and psychiatric clinics): SDQ scores correlated highly with the Rutter questionnaires, parent-teacher agreement was comparable or better, and the SDQ discriminated psychiatric from dental clinic attenders as well as the Rutter scales. UK normative data underpin the bands.",
    pitfalls: [
      "A broad screen, not an ADHD scale: five hyperactivity-inattention items cannot establish DSM criteria.",
      "High scores also occur with anxiety, trauma, autism and family stress.",
      "Do not use child bands for an adult.",
      "The documents may not be modified, and electronic or computer-scored versions need a licence."
    ],
    adhdNotes: "Treat a childhood SDQ like a school report. A raised hyperactivity-inattention score from more than one informant supports onset and pervasiveness. A normal score does not exclude ADHD, especially the inattentive presentation.",
    licence: "Copyright Robert Goodman (youthinmind). sdqinfo.org: copyrighted documents that may not be modified; paper versions may be downloaded and photocopied without charge for non-commercial purposes; computer scoring needs a licence. Not reproduced here.",
    source: "Goodman R. The Strengths and Difficulties Questionnaire: a research note. J Child Psychol Psychiatry 1997;38:581-6. youthinmind, sdqinfo.org download terms. NICE NG87, rec 1.3.2.",
    url: "https://www.sdqinfo.org/b1.html",
    file: null
  },

  /* ------------------------------------------------------------------ Epworth Sleepiness Scale */
  {
    id: "epworth", abbr: "ESS", name: "Epworth Sleepiness Scale",
    group: "sleep", stage: ["comorbid", "physical"],
    who: "Self-report",
    time: "2-3 minutes (clinical practice estimate)",
    ages: "Adults", items_n: 8,
    purpose: "Measures general daytime sleepiness: how likely the person is to doze off in 8 everyday situations (Johns, 1991).",
    when: "Comorbidity step, when the history suggests sleepiness rather than restless distraction: loud snoring, witnessed pauses in breathing, unrefreshing sleep, dozing while reading, in meetings or at the wheel, or sudden sleep attacks. Sleepiness from obstructive sleep apnoea, narcolepsy or simply too little sleep impairs concentration and memory and can look like inattention. Use it with STOP-Bang and a sleep history or diary. Repeat it after sleep treatment (for example CPAP) to see whether daytime symptoms change.",
    how: "The patient rates each situation from 0 (would never doze) to 3 (high chance of dozing), thinking about their usual way of life recently. Add the 8 ratings.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Total 0-24. American Thoracic Society bands: 0-10 normal; 11-12 mild excessive daytime sleepiness; 13-15 moderate; 16-24 severe.",
      "A raised score with snoring, witnessed apnoeas, a large neck, high blood pressure or a high BMI calls for STOP-Bang and referral for a sleep study.",
      "A raised score without features of sleep apnoea: ask about sleep length, shift work, sedating drugs, and narcolepsy features (cataplexy with laughter or strong emotion, sleep paralysis, vivid images at sleep onset).",
      "Always ask about sleepiness at the wheel. DVLA guidance (Assessing fitness to drive: miscellaneous conditions): a person whose excessive sleepiness affects, or is likely to affect, driving must not drive until it is controlled. Whether they must also tell the DVLA depends on the cause, for example confirmed moderate or severe obstructive sleep apnoea syndrome. Check the current guidance and record the advice you gave.",
      "A normal score does not exclude a sleep disorder."
    ],
    psychometrics: "Johns 1991 (180 adults: 30 controls and 150 with sleep disorders): total scores distinguished controls from people with obstructive sleep apnoea, narcolepsy and idiopathic hypersomnia, and correlated with sleep latency on the multiple sleep latency test and overnight polysomnography. In sleep apnoea, scores correlated with the respiratory disturbance index and the lowest overnight oxygen saturation. People who only snored scored like controls.",
    pitfalls: [
      "It measures sleepiness, not fatigue. Tired-but-wired people with insomnia or ADHD can score low.",
      "Some adults with ADHD say they 'nod off' when bored. Ask whether they actually fall asleep, and whether this also happens when they are engaged.",
      "Stimulants, caffeine and sedating substances (antihistamines, antipsychotics, opioids, cannabis, alcohol) change scores. Record what the person takes.",
      "Self-report: people who drive for a living may under-report sleepiness."
    ],
    adhdNotes: "Falling asleep in passive situations is not an ADHD symptom, although some adults with ADHD describe drowsiness when under-stimulated (clinical practice). A clearly high ESS points to a sleep disorder to investigate. If inattention began with the sleep problem and has no childhood history, the sleep disorder may explain it; if ADHD symptoms go back to childhood, both can coexist and both need treatment.",
    licence: "Developed by Dr Murray W. Johns. American Thoracic Society: free of charge to individual clinicians and researchers; organisations need a licence, arranged through Mapi Research Trust. Not reproduced here.",
    source: "Johns MW. A new method for measuring daytime sleepiness: the Epworth sleepiness scale. Sleep 1991;14:540-5. American Thoracic Society, Sleep Related Questionnaires: Epworth Sleepiness Scale. DVLA. Miscellaneous conditions: assessing fitness to drive (GOV.UK).",
    url: "https://site.thoracic.org/assemblies/srn/sleep-related-questionnaires/ess",
    file: null
  },

  /* ------------------------------------------------------------------ Insomnia Severity Index */
  {
    id: "isi", abbr: "ISI", name: "Insomnia Severity Index",
    group: "sleep", stage: ["comorbid", "followup"],
    who: "Self-report (clinician and significant-other versions exist)",
    time: "About 5 minutes (clinical practice estimate)",
    ages: "Adults", items_n: 7,
    purpose: "Rates the severity and impact of current insomnia: difficulty falling asleep, staying asleep and waking too early, satisfaction with sleep, interference with daytime functioning, how noticeable the problem is to others, and worry about sleep (Morin; Bastien et al., 2001).",
    when: "Comorbidity step whenever sleep problems are reported, which is common in adults with ADHD (especially difficulty getting to sleep). It shows whether sleep needs treatment in its own right, and gives a baseline before stimulants, which can worsen sleep. Repeat it at follow-up and after dose changes.",
    how: "The person rates their insomnia over the last 2 weeks on seven items, each rated 0-4, summed to a total. Also take a short sleep history: bedtime, time to fall asleep, night waking, wake time on work days and free days, naps, screens, caffeine, alcohol and cannabis. A 1-2 week sleep diary helps.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Total 0-28. Widely reproduced bands, usually attributed to the developer's scoring guide: 0-7 no clinically significant insomnia; 8-14 subthreshold; 15-21 moderate clinical insomnia; 22-28 severe clinical insomnia. These were not checked against the scoring guide for this app.",
      "Morin et al. 2011: a cut-off of 10 was optimal for detecting insomnia in a community sample (sensitivity 86.1%, specificity 87.7%).",
      "Change: in a clinical sample, a fall of about 8 points (8.4) matched moderate improvement rated by an independent assessor (Morin et al. 2011).",
      "Look at the pattern. Mainly trouble getting to sleep, with late natural sleep and wake times on free days, suggests delayed sleep phase rather than classic insomnia."
    ],
    psychometrics: "Bastien et al. 2001: adequate internal consistency, valid and sensitive to change with treatment, and close agreement between patient, clinician and significant-other versions. Morin et al. 2011: Cronbach alpha 0.90 and 0.91 in community and clinical samples.",
    pitfalls: [
      "It does not separate insomnia from delayed sleep phase, restless legs, sleep apnoea or poor sleep habits. Take a sleep history.",
      "Stimulants taken late in the day, caffeine and alcohol worsen scores. Record medication timing.",
      "Depression, anxiety and substance use also raise scores."
    ],
    adhdNotes: "Sleep-onset insomnia is common in adults with ADHD and is linked to a delayed body clock: Van Veen et al. 2010 found delayed sleep and delayed melatonin onset in adults with ADHD and sleep-onset insomnia. A high ISI is usually a coexisting problem to treat, not an alternative explanation, unless the inattention began with the sleep problem and there is no childhood history.",
    licence: "Copyright Charles M. Morin. American Thoracic Society: use with permission from the developer; distributed by Mapi Research Trust (ePROVIDE). Not reproduced here.",
    source: "Bastien CH, Vallieres A, Morin CM. Validation of the Insomnia Severity Index as an outcome measure for insomnia research. Sleep Med 2001;2:297-307. Morin CM et al. The Insomnia Severity Index: psychometric indicators to detect insomnia cases and evaluate treatment response. Sleep 2011;34:601-8. Van Veen MM et al. Biol Psychiatry 2010;67:1091-6.",
    url: "https://site.thoracic.org/assemblies/srn/sleep-related-questionnaires/isi",
    file: null
  },

  /* ------------------------------------------------------------------ HCL-32 */
  {
    id: "hcl32", abbr: "HCL-32", name: "Hypomania Checklist-32",
    group: "bipolar", stage: ["comorbid"],
    who: "Self-report",
    time: "About 10-15 minutes (clinical practice estimate)",
    ages: "Adults", items_n: 32,
    purpose: "Self-assessment of lifetime hypomanic symptoms (Angst et al., 2005). The person thinks about periods when they felt 'high' or more active than usual and answers yes or no to 32 features of those periods, with further questions about the effects of those periods and how long they lasted.",
    when: "Comorbidity step, when the history raises bipolar disorder: distinct spells of elevated or irritable mood, a reduced need for sleep, a family history of bipolar disorder, activation on antidepressants, or mood swings lasting days rather than hours. Use it only as a prompt for a careful interview about discrete episodes. NICE CG185 rec 1.2.3 says not to use questionnaires in primary care to identify bipolar disorder in adults.",
    how: "Ask the person to think of times when they felt high or hyper compared with their usual state, then answer each item. Count the yes answers. Then interview for discrete episodes: when, how long, sleep, change from their usual self, consequences, and whether others noticed. Build a life chart and ask an informant.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Score = number of yes answers (0-32). A cut-off of 14 is most often cited; other studies have used values from 13 to 17. None of these was checked against the original papers for this app.",
      "Angst et al. 2005 found two factors: 'active/elated' and 'risk-taking/irritable' hypomania.",
      "A positive screen means interview for discrete episodes. DSM-5-TR hypomania lasts at least 4 consecutive days, most of the day, nearly every day, and is a clear change from the person's usual functioning that others can observe.",
      "A negative screen does not exclude bipolar disorder if the history is suggestive."
    ],
    psychometrics: "Angst et al. 2005 (266 people with bipolar disorder and 160 with major depressive disorder, adult psychiatric patients in Italy (186) and Sweden (240)): sensitivity 80% and specificity 51% for bipolar disorder against major depression. It does not separate bipolar I from bipolar II.",
    pitfalls: [
      "Many items describe trait ADHD features (talkative, more active, distractible, full of ideas, risk-taking, spending). Adults with ADHD often say yes because that is how they always are.",
      "Low specificity even in mood clinics (51% against major depression).",
      "Highs caused by stimulants, cocaine or other substances are counted unless you ask.",
      "NICE CG185 rec 1.2.3: do not use questionnaires in primary care to identify bipolar disorder in adults."
    ],
    adhdNotes: "The key question is episodic versus lifelong. ADHD features are present most days since childhood. Hypomania is a discrete period of days to weeks that is clearly different from the person's usual self, often with less need for sleep without feeling tired. The MDQ has the same problem: about half of adults with ADHD screen positive on it (Lundervold et al. 2020: 50.2% of 502, against 5% of controls). Record your episode-by-episode reasoning in the Differential diagnosis step.",
    licence: "Developed by Jules Angst and colleagues (University of Zurich). Licence status not verified; a distributor copy states research and educational use only. Not reproduced here.",
    source: "Angst J, Adolfsson R, Benazzi F et al. The HCL-32: towards a self-assessment tool for hypomanic symptoms in outpatients. J Affect Disord 2005;88:217-33. NICE CG185 (bipolar disorder), rec 1.2.3. Lundervold AJ et al. Front Psychol 2020;11:571101 (MDQ in adult ADHD).",
    url: "https://pubmed.ncbi.nlm.nih.gov/16125784/",
    file: null
  },

  /* ------------------------------------------------------------------ OCI-R */
  {
    id: "ocir", abbr: "OCI-R", name: "Obsessive-Compulsive Inventory-Revised",
    group: "anxiety", stage: ["comorbid"],
    who: "Self-report",
    time: "About 5 minutes (clinical practice estimate)",
    ages: "Adults", items_n: 18,
    purpose: "Short self-report measure of OCD symptoms (Foa et al., 2002). Its 18 items form 6 subscales of 3 items: washing, checking, ordering, obsessing, hoarding and neutralising. Each item is rated for distress over the past month from 0 (not at all) to 4 (extremely).",
    when: "Comorbidity step, when inattention may be driven by intrusive thoughts, checking or rituals, or when the person reports repeated checking 'because I forget'. It helps separate anxiety-driven, ritualised OCD from forgetful, distractible ADHD. Follow a positive screen with an interview and, if OCD is likely, a Y-BOCS or referral.",
    how: "The patient rates each item. Sum all items for the total and sum each set of three for the subscales.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Total 0-72; each subscale 0-12.",
      "A total of 21 or more is commonly used to suggest OCD. Foa et al. derived cut-scores with ROC analysis; the exact figure was not checked against the full paper for this app.",
      "Read the subscale pattern. A high checking score on its own can come from ADHD forgetfulness; high obsessing and neutralising scores point to OCD.",
      "Hoarding items: clutter from disorganisation is common in ADHD. Hoarding disorder involves distress at discarding and active saving."
    ],
    psychometrics: "Foa et al. 2002 (215 people with OCD, 243 with other anxiety disorders and 677 non-anxious people): excellent psychometric properties retained from the longer OCI; the total and subscales differentiated well between people with and without OCD; ROC analyses supported use as a screen with empirically derived cut-scores.",
    pitfalls: [
      "Checking and ordering items can be endorsed for ADHD reasons: checking the door because they cannot remember locking it, or organising rigidly to cope.",
      "Rumination in depression and worry in generalised anxiety can raise the obsessing subscale.",
      "Hoarding is a separate disorder in DSM-5-TR and ICD-11."
    ],
    adhdNotes: "Ask why the person checks or repeats. To put right a feeling that something is incomplete or to reduce anxiety suggests OCD; because they genuinely do not remember doing it suggests ADHD. In OCD the mind is occupied by obsessions; in ADHD attention drifts to more interesting things. Both can coexist and both are treated.",
    licence: "Published in Psychological Assessment (American Psychological Association, 2002). No reuse statement from the authors or publisher was found; licence status not verified. Not reproduced here.",
    source: "Foa EB, Huppert JD, Leiberg S et al. The Obsessive-Compulsive Inventory: development and validation of a short version. Psychol Assess 2002;14:485-96.",
    url: "https://pubmed.ncbi.nlm.nih.gov/12501574/",
    file: null
  },

  /* ------------------------------------------------------------------ Y-BOCS */
  {
    id: "ybocs", abbr: "Y-BOCS", name: "Yale-Brown Obsessive Compulsive Scale",
    group: "anxiety", stage: ["comorbid"],
    who: "Clinician-rated semi-structured interview",
    time: "About 15-30 minutes including the symptom checklist (clinical practice estimate)",
    ages: "Adults (a children's version, the CY-BOCS, exists)", items_n: 10,
    purpose: "Clinician rating of OCD severity that does not depend on the type of obsessions or compulsions (Goodman et al., 1989). A symptom checklist first identifies the obsessions and compulsions. Ten items then rate them, five for obsessions and five for compulsions, each from 0 (no symptoms) to 4 (extreme), covering time taken, interference, distress, resistance and control.",
    when: "After a positive OCD screen, or when OCD is clearly present, to rate severity for treatment planning and for the report. Usually done by, or with, an OCD or psychology service. Not needed in most ADHD assessments.",
    how: "Interview with the symptom checklist, then rate the 10 severity items for the recent period, usually the past week. Training is needed for reliable ratings.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Total 0-40, with separate obsession and compulsion subtotals (0-20 each) (Goodman et al. 1989).",
      "Commonly quoted bands: 0-7 subclinical, 8-15 mild, 16-23 moderate, 24-31 severe, 32-40 extreme (secondary sources; not verified against the original papers).",
      "Change in the total tracks treatment. Expert consensus (Mataix-Cols et al. 2016): response is a fall of 35% or more plus a clinician rating of much or very much improved, lasting at least a week; a fall of 25-35% is partial response; remission is a total of 12 or less with minimal clinician-rated severity.",
      "Read a Y-BOCS in an OCD service letter alongside the ADHD history: a high score explains time lost to obsessions and rituals, but does not tell you whether ADHD is also present."
    ],
    psychometrics: "Goodman et al. 1989 (4 raters, 40 patients with OCD): excellent interrater reliability for the total and each item, and high internal consistency.",
    pitfalls: [
      "Scores depend on a skilled interview.",
      "It rates severity once OCD is established. It does not decide whether behaviours are OCD or ADHD coping habits.",
      "A revised version (Y-BOCS-II) uses a different scoring range. Do not compare scores across versions."
    ],
    adhdNotes: "You will mostly meet the Y-BOCS in letters from OCD services. A high score shows that obsessions and compulsions take up time and attention, which can explain poor concentration in adulthood. Check whether ADHD symptoms started before the OCD and appear in settings free of obsessions.",
    licence: "Licence status not verified. Secondary sources say a licensing company manages the rights, with paid licences for digital and app use. Not reproduced here.",
    source: "Goodman WK, Price LH, Rasmussen SA et al. The Yale-Brown Obsessive Compulsive Scale. I. Development, use, and reliability. Arch Gen Psychiatry 1989;46:1006-11. Mataix-Cols D et al. Towards an international expert consensus for defining treatment response, remission, recovery and relapse in obsessive-compulsive disorder. World Psychiatry 2016;15:80-1.",
    url: "https://pubmed.ncbi.nlm.nih.gov/2684084/",
    file: null
  },

  /* ------------------------------------------------------------------ MoCA */
  {
    id: "moca", abbr: "MoCA", name: "Montreal Cognitive Assessment",
    group: "cognition", stage: ["comorbid", "physical"],
    who: "Clinician-administered by a trained, certified administrator",
    time: "About 10 minutes",
    ages: "Adults; developed for older adults and mild cognitive impairment", items_n: null,
    purpose: "Brief 30-point screen for mild cognitive impairment (Nasreddine et al., 2005). It covers attention and concentration, executive function, memory, language, visuospatial skills, abstraction, calculation and orientation.",
    when: "Comorbidity step and physical health review, when attention or memory problems are new in mid or later life, are getting worse, or follow a head injury, stroke, heavy alcohol use or a medical illness. A new decline with no childhood history points to a neurocognitive or medical cause, not ADHD. It is not an ADHD test.",
    how: "Administer and score with the official form and instructions. Add 1 point for 12 years of formal education or less (official instructions).",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Total 0-30. The validation study used a cut-off of 26: scores below 26 suggest impairment.",
      "Nasreddine et al. 2005: sensitivity 90% for mild cognitive impairment (MMSE 18%) and 100% for mild Alzheimer's disease; specificity 87%.",
      "A low score is a reason for further assessment (memory clinic, neuropsychology, blood tests, imaging as indicated), not a diagnosis.",
      "Look at where points were lost. Errors only on attention items in an anxious, distractible younger adult mean less than errors on delayed recall and orientation (clinical practice)."
    ],
    psychometrics: "Nasreddine et al. 2005: 94 people with mild cognitive impairment, 93 with mild Alzheimer's disease and 90 healthy older controls, in a community clinic and an academic centre.",
    pitfalls: [
      "Developed in older adults. Younger adults with ADHD, anxiety, low mood or poor sleep can lose points on attention and executive items, so a borderline score in a 30-year-old means little.",
      "Education, language and culture affect scores.",
      "Training and certification are mandatory to administer and score it (MoCA Cognition).",
      "Electronic versions are prohibited, so it cannot be built into this app."
    ],
    adhdNotes: "Use it to screen for an acquired cognitive problem when the story is one of change, not lifelong traits. When a person in their 50s or 60s reports recent forgetfulness, look for mild cognitive impairment, depression, menopause, sleep apnoea, alcohol and medication effects, and get collateral about childhood, before attributing it to ADHD.",
    licence: "Copyright Ziad Nasreddine (MoCA Cognition). Free to use without permission in universities, hospitals and clinics, but training and certification are mandatory. Developing an electronic version, and posting the test or its instructions on a website, are prohibited (mocacognition.com/permission). Not reproduced here.",
    source: "Nasreddine ZS, Phillips NA, Bedirian V et al. The Montreal Cognitive Assessment, MoCA: a brief screening tool for mild cognitive impairment. J Am Geriatr Soc 2005;53:695-9. MoCA Cognition permission page.",
    url: "https://mocacognition.com/permission/",
    file: null
  },

  /* ------------------------------------------------------------------ ACE questionnaire (interactive) */
  {
    id: "aceq", abbr: "ACE-Q", name: "Adverse Childhood Experiences questionnaire (10-item ACE score)",
    group: "trauma", stage: ["interview", "comorbid"],
    who: "Self-report, or read aloud by the clinician. The person may decline any item.",
    time: "About 5 minutes",
    ages: "Adults, about their first 18 years", items_n: 10,
    purpose: "Counts 10 categories of adversity before age 18: abuse (emotional, physical, sexual), neglect (emotional, physical) and household challenges (parental separation or divorce, violence towards the mother or stepmother, household substance misuse, household mental illness or suicide attempt, and imprisonment of a household member). It comes from the CDC-Kaiser Permanente ACE Study (17,337 adults, 1995-1997). The score is a count of categories, not a measure of severity or of trauma symptoms.",
    when: "Clinical history or Comorbidity step, as part of a trauma-informed history once rapport is established, rather than cold in a pre-appointment pack. Adversity shapes the differential (PTSD, complex PTSD, attachment and personality difficulties, substance use) and the formulation: early adversity can cause inattention, hypervigilance and emotional dysregulation that look like ADHD, and adversity is also more common in children with ADHD. Use the answers to time the adversity against the first ADHD symptoms.",
    how: "Explain why you are asking, that they can skip any question, and what you must do with some disclosures (for example a risk to children now). The person answers yes or no for their first 18 years. Score = number of yes answers. Then ask about ages, duration, who was involved, what support they had and how it affects them now.",
    interactive: true,
    instructions: "While you were growing up, during your first 18 years of life:",
    options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }],
    items: [
      { n: 1, section: "Abuse", t: "Did a parent or other adult in the household often ... swear at you, insult you, put you down, or humiliate you? Or act in a way that made you afraid that you might be physically hurt?" },
      { n: 2, t: "Did a parent or other adult in the household often ... push, grab, slap, or throw something at you? Or ever hit you so hard that you had marks or were injured?" },
      { n: 3, t: "Did an adult or person at least 5 years older than you ever ... touch or fondle you or have you touch their body in a sexual way? Or try to or actually have oral, anal, or vaginal sex with you?" },
      { n: 4, section: "Neglect", t: "Did you often feel that ... no one in your family loved you or thought you were important or special? Or your family didn't look out for each other, feel close to each other, or support each other?" },
      { n: 5, t: "Did you often feel that ... you didn't have enough to eat, had to wear dirty clothes, and had no one to protect you? Or your parents were too drunk or high to take care of you or take you to the doctor if you needed it?" },
      { n: 6, section: "Household challenges", t: "Were your parents ever separated or divorced?" },
      { n: 7, t: "Was your mother or stepmother: often pushed, grabbed, slapped, or had something thrown at her? Or sometimes or often kicked, bitten, hit with a fist, or hit with something hard? Or ever repeatedly hit over at least a few minutes or threatened with a gun or knife?" },
      { n: 8, t: "Did you live with anyone who was a problem drinker or alcoholic or who used street drugs?" },
      { n: 9, t: "Was a household member depressed or mentally ill or did a household member attempt suicide?" },
      { n: 10, t: "Did a household member go to prison?" }
    ],
    scoring: {
      method: "sum",
      bands: [
        { min: 0, max: 0, label: "No ACE categories reported", sev: 0 },
        { min: 1, max: 3, label: "1-3 ACE categories", sev: 1 },
        { min: 4, max: 10, label: "4 or more ACE categories", sev: 2 }
      ],
      flags: [
        { item: 3, min: 1, level: "warn", text: "Sexual abuse in childhood reported. Ask sensitively whether they have told anyone before and want support, whether the person who harmed them may still have contact with children (safeguarding), and whether there are current trauma symptoms." }
      ],
      subscales: [
        { id: "abuse", label: "Abuse (items 1-3)", items: [1, 2, 3] },
        { id: "neglect", label: "Neglect (items 4-5)", items: [4, 5] },
        { id: "household", label: "Household challenges (items 6-10)", items: [6, 7, 8, 9, 10] }
      ]
    },
    interpretation: [
      "Score = number of yes answers (0-10). Each item is one category, so repeated events of the same kind still score 1.",
      "There is no validated clinical cut-off. In the original study, people reporting 4 or more categories (of the 7 then measured) had 4- to 12-fold higher risks of alcoholism, drug misuse, depression and suicide attempt than people reporting none (Felitti et al. 1998). These are population associations, not predictions for one person. The bands shown here only group the count.",
      "A score of 0 does not exclude trauma. Bullying, community violence, racism, bereavement, medical trauma, being in care and abuse outside the household are not covered.",
      "For each yes, ask when it happened compared with the first ADHD symptoms. Symptoms that began after the adversity, with re-experiencing, avoidance or hypervigilance, point towards PTSD or complex PTSD; symptoms clearly present before it, and in safe settings, support ADHD. Both often coexist.",
      "If current trauma symptoms are described, follow up with a PTSD screen (PC-PTSD-5, PCL-5 or the ITQ for ICD-11 complex PTSD)."
    ],
    psychometrics: "The ACE Study (CDC and Kaiser Permanente; 17,337 adults in two waves, 1995-1997) showed a graded relationship between the number of categories and adult health-risk behaviours and diseases. The first report (Felitti et al. 1998; 9,508 respondents, 7 categories) found this graded relationship for every risk behaviour and disease studied. The 10-item form is a widely used short version based on retrospective self-report; it has not been validated as a diagnostic screen. Retrospective questionnaire reports agree poorly with prospective records of maltreatment (pooled kappa 0.19 across 16 studies; agreement was higher when the retrospective measure was an interview; Baldwin et al. 2019).",
    pitfalls: [
      "Do not confuse it with the ACE+ (ADHD Child Evaluation for Adults), Professor Susan Young's ADHD interview.",
      "Asking can cause distress. Use a trauma-informed approach, explain confidentiality and safeguarding limits first, and accept 'prefer not to say'.",
      "Item 7 asks only about violence towards a mother or stepmother. Ask separately about violence between any adults at home.",
      "Items join several behaviours with 'or', and 'often' is not defined. The count loses timing, severity and duration.",
      "Retrospective reports can under- or over-state adversity. A meta-analysis found poor agreement between prospective records of childhood maltreatment and adults' retrospective reports (kappa 0.19; Baldwin et al. 2019): the two identify largely different people. Social care or school records, where they exist, add to the history. Gaps in childhood memory can themselves be relevant.",
      "Do not use the score to screen people into or out of an ADHD assessment."
    ],
    adhdNotes: "Adversity and ADHD are linked in both directions: ADHD raises the risk of trauma exposure and PTSD, and early adversity can cause attention, arousal and emotional regulation problems. A high ACE count does not rule ADHD out, but it makes the timeline essential. Establish whether ADHD-type symptoms were present before the adversity began and in safe settings, and look for trauma-specific features (re-experiencing, avoidance, hypervigilance, dissociation) in the Differential diagnosis step.",
    licence: "CDC: the ACE Study questionnaires are not copyrighted and there are no fees for their use. The 10-item 'Finding your ACE score' form is a short version based on the study questionnaires and circulated from the ACE Study website; no separate rights statement was found. Items reproduced here with attribution.",
    source: "Felitti VJ, Anda RF, Nordenberg D et al. Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults: the Adverse Childhood Experiences (ACE) Study. Am J Prev Med 1998;14:245-58. CDC, About the CDC-Kaiser ACE Study. 'Finding your ACE score' form (ACE Study; copy published by US Probation and Pretrial Services, District of Minnesota). Baldwin JR, Reuben A, Newbury JB, Danese A. Agreement between prospective and retrospective measures of childhood maltreatment: a systematic review and meta-analysis. JAMA Psychiatry 2019;76:584-93.",
    url: "https://www.cdc.gov/violenceprevention/aces/about.html",
    file: null
  },

  /* ------------------------------------------------------------------ WHO ASSIST */
  {
    id: "assist", abbr: "ASSIST v3.1", name: "WHO Alcohol, Smoking and Substance Involvement Screening Test",
    group: "substance", stage: ["comorbid", "risk"],
    who: "Interview by a clinician or health worker",
    time: "About 5-10 minutes (WHO manual)",
    ages: "Adults", items_n: 8,
    purpose: "WHO screening interview covering tobacco, alcohol, cannabis, cocaine, amphetamine-type stimulants, sedatives and sleeping pills, hallucinogens, inhalants, opioids and other drugs. It gives a risk score for each substance (lower, moderate or high risk), linked to a brief intervention or referral.",
    when: "Comorbidity and Safety and risk steps, when the person uses more than alcohol or you need a structured view of several substances. Cannabis, stimulant and sedative use matter in three ways: as mimics of ADHD (intoxication and withdrawal cause inattention and restlessness), as coexisting disorders, and as risks for stimulant treatment. NICE NG87 rec 1.7.4 asks for a risk assessment for substance misuse and drug diversion before medication. For alcohol alone, NICE CG115 recommends the AUDIT.",
    how: "Q1 asks which substances have ever been used; it filters the rest and is not scored. For each substance used: Q2-Q5 cover the past 3 months (how often used, strong desire or urge, health, social, legal or financial problems, and failing to do what was normally expected), Q6 whether others have expressed concern, Q7 failed attempts to cut down, and Q8 injecting. Use the WHO response card and the feedback report card.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Specific substance involvement score = Q2 + Q3 + Q4 + Q5 + Q6 + Q7 for each substance. Q5 is not scored for tobacco. Q1 and Q8 are not included.",
      "Alcohol: 0-10 lower risk, 11-26 moderate risk, 27 or more high risk. All other substances: 0-3 lower, 4-26 moderate, 27 or more high (WHO manual, Box 6).",
      "Moderate risk: brief intervention. High risk: brief intervention plus referral for further assessment and more intensive treatment.",
      "Injecting (Q8): give feedback on the risks of injecting to anyone currently injecting; frequent injecting in the past 3 months may need specialist referral.",
      "Q3 (strong urges), Q7 (failed attempts to cut down) and Q8 (injecting) are particularly linked with dependent or high-risk use.",
      "UK alternative: Public Health England's ASSIST-Lite guidance (GOV.UK, updated 2021) describes an 18-question short version, with a version for mental health settings. Both versions include the AUDIT-C for alcohol. ASSIST-Lite is copyrighted, and permission to use it is requested through NHS Digital."
    ],
    psychometrics: "Humeniuk et al. 2008 (1,047 participants from drug treatment and primary care in several countries): ASSIST scores correlated with the ASI-Lite (r 0.76-0.88), the Severity of Dependence Scale (r 0.59), the AUDIT (r 0.82) and the Revised Fagerstrom Tolerance Questionnaire (r 0.78). ROC analysis gave cut-offs with specificities of 50-96% and sensitivities of 54-97% for most substances.",
    pitfalls: [
      "Ask about prescribed medicines separately. Taking a prescribed stimulant as directed is not misuse; taking extra, by another route, or someone else's is.",
      "Use is under-reported when people fear losing access to treatment. Explain why you ask.",
      "Branched and interview-based, so it takes longer than the AUDIT-C or DAST-10 when several substances are used.",
      "Cannabis is often used to manage sleep, restlessness or low mood. Record the reason as well as the amount.",
      "Do not rate ADHD symptoms during intoxication or withdrawal. The international consensus advises starting the ADHD assessment once there is no serious intoxication or withdrawal, and confirming the diagnosis during substance treatment (Crunelle et al. 2018)."
    ],
    adhdNotes: "Substance use is common in adults with ADHD and can both mimic and mask it. The ASSIST gives a quick map of which substances matter. Then establish whether ADHD symptoms were present in childhood, before substance use began, and during periods of abstinence. Feed the result into the substance use differentials and the medication risk plan.",
    licence: "Copyright World Health Organization 2010. The manual states all rights reserved; requests to reproduce or translate go to WHO. Terms for embedding in software were not verified. Not reproduced here.",
    source: "Humeniuk R, Henry-Edwards S, Ali R, Poznyak V, Monteiro MG. The Alcohol, Smoking and Substance Involvement Screening Test (ASSIST): manual for use in primary care. Geneva: World Health Organization, 2010 (ASSIST v3.1). Humeniuk R et al. Validation of the ASSIST. Addiction 2008;103:1039-47. Crunelle CL et al. Eur Addict Res 2018 (international consensus on ADHD and substance use disorder). Public Health England. How to use the ASSIST-Lite screening tool to identify alcohol and drug use and tobacco smoking. GOV.UK, updated 7 April 2021.",
    url: "https://www.who.int/publications/i/item/978924159938-2",
    file: null
  }
]);
