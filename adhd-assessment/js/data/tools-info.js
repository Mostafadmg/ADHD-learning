/* tools-info: information-only instruments (ARCHITECTURE.md section 5.4).
   Child and adolescent ADHD scales (conners4, adhdrs5, vanderbilt, snap4, sdq): used now when assessing a young person
   aged 6-17 (result entered by hand in the Screening step: tools.<id>.result), and met in childhood or transition
   records in an adult assessment. Sleep (epworth, isi), bipolar (hcl32), OCD (ocir, ybocs), cognition (moca), adverse
   childhood experiences (aceq) and substance use (assist).
   Young-person tools added 25 Oct 2026 (end of file): wfirsp, ydiva5, acechild, rcads, mfq, phqa, crafft, scq,
   aq10child, aq10adol. Ages, licences, URLs and cut-offs come from the research brief of 25 Oct 2026 (section 4);
   Young DIVA-5 and ACE v.2 facts come from the existing tool entries and the main course Assessment Guide.
   SCARED was left out: its licence and official source could not be confirmed.
   ageMin/ageMax (every tool, in all three tool files): inclusive whole years of the person being assessed;
   ageMax 120 means no upper limit stated. Where a range is an inference it says so in the ages text.
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
    group: "child", stage: ["referral", "pre", "collateral", "followup"],
    who: "Parent and teacher forms, and a young person's self-report. Publisher qualification required.",
    time: "Full forms 10-25 minutes (average 12-15); Short forms 5-10 minutes; ADHD Index 1-3 minutes (Conners 4 manual)",
    ages: "6-18 (self-report 8-18)", ageMin: 6, ageMax: 18, items_n: null,
    purpose: "Commercial rating scale for ADHD symptoms and related problems in children and adolescents (MHS, 2022; successor to the Conners 3). NICE NG87 rec 1.3.2 names the Conners' rating scales, with the SDQ, as helpful added tools in diagnosis. Both are child and adolescent scales.",
    when: "Children and young people (6-18): send the parent and teacher forms before the assessment, and the self-report from age 8, so the results are ready for the Screening step. Enter the result there: the main scale scores, whether they reach the elevated range, who completed each form and the date. NICE names the Conners scales, with the SDQ, as helpful added tools; they never make the diagnosis on their own. During titration NICE asks for parent and teacher ratings on standard scales at baseline and at each dose change, so a short form or the ADHD Index can be repeated. Adults: it is not used to assess an adult directly. A young person of 17-18 referred from CAMHS or paediatrics may arrive with recent results, and old Conners reports (Conners 4, Conners 3 or earlier editions) in school, CAMHS or paediatric notes are evidence for criterion B (several symptoms before 12) and criterion C (more than one setting); read them in the Collateral step. For an adult's own symptoms use adult tools such as the ASRS or CAARS 2.",
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
    adhdNotes: "For a child or young person, raised inattention or hyperactivity-impulsivity scores from both a parent and a teacher support symptoms in more than one setting (criterion C). Only the interview shows which symptoms are present, since when, and what they cost. When parent and teacher disagree, ask each for recent examples and consider a school observation. Check the response-style indexes before you rely on a profile, and note whether the child was taking medication. In an adult assessment the Conners is collateral, not a test: a childhood report with raised ratings from more than one informant supports onset before 12 and pervasiveness.",
    licence: "Proprietary (Multi-Health Systems). Qualification required; forms and reports are sold by MHS. Items and norms may not be reproduced. Not reproduced here.",
    source: "Conners CK. Conners 4th Edition (Conners 4). Toronto: Multi-Health Systems, 2022. Conners 4 online manual (MHS): overview of content, interpretation and standardisation chapters. NICE NG87 1.3.2 (rating scales such as the Conners as added tools; school observation when in doubt) and 1.7.26 (parent and teacher ratings on standard scales during titration).",
    url: "https://storefront.mhs.com/collections/conners-4",
    file: null
  },

  /* ------------------------------------------------------------------ ADHD-RS-5 */
  {
    id: "adhdrs5", abbr: "ADHD-RS-5", name: "ADHD Rating Scale-5 for Children and Adolescents (and the ADHD-RS-IV with adult prompts)",
    group: "child", stage: ["pre", "collateral", "followup"],
    who: "Parent (Home Version) or teacher (School Version). The ADHD-RS-IV with adult prompts is a clinician rating used in adult trials.",
    time: "About 5-10 minutes (clinical practice estimate)",
    ages: "5-17 (child form 5-10, adolescent form 11-17)", ageMin: 5, ageMax: 17, items_n: 18,
    purpose: "Commercial DSM-5 rating scale for ADHD symptoms in children and adolescents (DuPaul, Power, Anastopoulos and Reid; Guilford, 2016). Nine inattention and nine hyperactivity-impulsivity items are rated for frequency. Six impairment domains (relationships with family or teachers, peers, academic functioning, behaviour, homework and self-esteem) are rated after each symptom set. Its predecessor, the ADHD-RS-IV, with adult prompts added, is widely used as the clinician-rated outcome in adult ADHD medication trials.",
    when: "Children and young people (5-17): the parent (Home) and teacher (School) checklists rate the 18 DSM-5 symptoms and six areas of impairment. Send them before the assessment and enter the result in the Screening step: subscale scores, the percentile band from the manual, who rated and the date. It is short and follows the 18 symptoms, so it also suits titration reviews, where NICE asks for parent and teacher ratings at baseline and at each dose change. Adults: you meet it in childhood or transition records (Collateral step) and in the adult treatment trials you draw on when explaining medication evidence. It is not validated as a retrospective rating of an adult's childhood; for an adult's baseline and monitoring use the ASRS v1.1 or the clinician-rated AISRS.",
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
    adhdNotes: "For a child or young person, compare each informant's scores with the manual's norms for the child's age and gender; the percentile cut-offs are in the manual and were not checked for this app. Items rated 2 or 3 show which symptoms to explore with examples in the interview, and Home and School ratings together give a first view of criterion C. In adult work its value is reading: childhood or transition records may contain ADHD-RS results, and adult trials report changes in ADHD-RS-IV totals.",
    licence: "Proprietary (Guilford Press). The checklists come with the purchased manual, which gives purchasers a limited licence to photocopy the forms and score sheets for their own clients. Licensing of the adult-prompt version was not verified. Not reproduced here.",
    source: "DuPaul GJ, Power TJ, Anastopoulos AD, Reid R. ADHD Rating Scale-5 for Children and Adolescents: Checklists, Norms, and Clinical Interpretation. New York: Guilford Press, 2016. DuPaul GJ et al. Parent and teacher ratings of ADHD symptoms: factor structure and normative data. Psychol Assess 2016;28:214-25. ADHD-RS-IV with adult prompts as described in trial registrations (for example NCT01692782).",
    url: "https://www.guilford.com/books/ADHD-Rating-Scale-5-for-Children-and-Adolescents/DuPaul-Power-Anastopoulos-Reid/9781462524877",
    file: null
  },

  /* ------------------------------------------------------------------ NICHQ Vanderbilt */
  {
    id: "vanderbilt", abbr: "NICHQ Vanderbilt", name: "NICHQ Vanderbilt Assessment Scales (parent and teacher informant)",
    group: "child", stage: ["pre", "collateral", "followup"],
    who: "Parent or teacher informant",
    time: "About 10 minutes (clinical practice estimate)",
    ages: "Validated for ages 6-12 (AAP scoring instructions)", ageMin: 6, ageMax: 12, items_n: 55,
    purpose: "Parent and teacher rating scales from the American Academy of Pediatrics (AAP) and NICHQ, adapted from the Vanderbilt Rating Scales developed by Mark Wolraich. They cover the 18 DSM-IV ADHD symptoms, screens for oppositional defiant disorder, conduct disorder and anxiety or depression (and learning problems on the teacher form), and performance (impairment) items. The parent initial form has 55 items (47 symptoms, 8 performance); the teacher initial form has 43 (35 symptoms, 8 performance). Follow-up forms track symptoms and medication side effects.",
    when: "Children aged 6-12. The parent and teacher forms screen the 18 ADHD symptoms and impairment, plus oppositional, conduct and anxiety or depression problems (and learning problems on the teacher form). Send both before the assessment and enter the result in the Screening step: the symptom counts in each domain, whether the performance rule is met, who rated and the date. The follow-up forms track symptoms and side effects during treatment. It is used mostly in North America; CADDRA lists it among usable tools. From 13, use a scale normed for adolescents, such as the Conners 4, the ADHD-RS-5 or the SDQ. Adults: it helps when reading childhood or transition records that contain Vanderbilt results (Collateral step), and as a structured prompt when a parent describes the patient's primary-school years. It has no validation as a retrospective rating of an adult's childhood, so use it as an aide-memoire for the parent interview, not as a score.",
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
    adhdNotes: "For a child, 6 or more symptoms rated 2-3 in a domain on both the parent and the teacher form, with the performance rule met, is a strong prompt for the interview, not a diagnosis. Ask whether the child was on medication when rated. A positive oppositional, conduct or anxiety-depression screen goes to the differential step. In adult work, a Vanderbilt completed at the time by a teacher and found in records is stronger evidence than one a parent completes from memory years later; use the latter only to open the parent interview.",
    licence: "Copyright 2002 American Academy of Pediatrics and NICHQ, adapted from the Vanderbilt Rating Scales developed by Mark L. Wolraich (form footer). NICHQ offers the first edition (2002) as a free download and asks for a reference to NICHQ when it is cited; later editions (2nd 2011, 3rd 2019) come from the AAP, and the 3rd edition is sold through the AAP bookstore. Terms for reproduction in software were not verified. Not reproduced here.",
    source: "NICHQ Vanderbilt Assessment Scales, parent and teacher informant forms (AAP and NICHQ, 2002). AAP. Caring for Children With ADHD: A Resource Toolkit for Clinicians, 2nd ed. 2012: scoring instructions. Wolraich ML et al. J Pediatr Psychol 2003;28:559-67.",
    url: "https://www.nichq.org/resource/nichq-vanderbilt-assessment-scales",
    file: null
  },

  /* ------------------------------------------------------------------ SNAP-IV */
  {
    id: "snap4", abbr: "SNAP-IV", name: "Swanson, Nolan and Pelham Rating Scale, version IV (SNAP-IV-26)",
    group: "adhd-childhood", stage: ["pre", "collateral", "followup"],
    who: "Parent or teacher. In adult assessment, a parent or older relative rates the patient's childhood (CADDRA).",
    time: "About 5-10 minutes (clinical practice estimate)",
    ages: "No age range is printed on the form. Normed in primary-school children and commonly used from 6 to 18; CADDRA also uses it as a retrospective childhood rating for adults.", ageMin: 6, ageMax: 120, items_n: 26,
    purpose: "Short rating scale of the 18 DSM-IV ADHD symptoms (items 1-9 inattention, 10-18 hyperactivity-impulsivity) and 8 oppositional defiant disorder symptoms (items 19-26), each rated 0 not at all, 1 just a little, 2 quite a bit, 3 very much. The 26-item version is the one in common clinical use; a longer 90-item SNAP-IV also exists.",
    when: "Children and young people: the parent and the teacher each rate the child's current behaviour. Send it before the assessment and enter the result in the Screening step: the inattention, hyperactivity-impulsivity and oppositional averages, who rated and the date. It is short and follows the 18 DSM symptoms, so it can be repeated at titration reviews. Adults: in the CADDRA adult pathway (step 1, initial information gathering), someone who knew the patient as a child completes it about the patient's childhood, while the patient completes the ASRS and a partner or close other an observer ASRS. Explore the endorsed items in the parent interview (Collateral step).",
    how: "For a child or young person, the parent and the teacher rate current behaviour on separate forms. For an adult, the informant thinks about the patient at primary-school age (before 12). Work out each subscale average (the total of the item ratings divided by the number of items), then ask for concrete examples of every item rated 2 or 3.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Swanson's method: subscale score = total of the item ratings divided by the number of items (an average from 0 to 3). It is compared with tentative cut-offs at about the 95th percentile of US child samples, which are higher for teacher than for parent ratings. The values usually quoted (teacher / parent) are: inattention 2.56 / 1.78; hyperactivity-impulsivity 1.78 / 1.44; combined 2.00 / 1.67; oppositional 1.38 / 1.88. These come from secondary sources, the original scoring sheet was not checked, and at least one published review could not trace where these 'tentative 5% cut-offs' came from. Treat them as rough benchmarks for children, not diagnostic thresholds.",
      "Bussing et al. 2008: parent average scores above 1.2 raised the probability of concern (likelihood ratio above 10), and above 1.8 the probability of an ADHD diagnosis (likelihood ratio above 3). For teachers, averages above 1.2 for hyperactivity-impulsivity and above 1.8 for inattention marked concern only.",
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
    adhdNotes: "For a child or young person, use the parent and teacher averages as prompts for the interview, not as a diagnosis: raised scores from both support symptoms in more than one setting. The oppositional items (19-26) help with the oppositional defiant disorder differential; they do not screen for conduct disorder. For an adult, the SNAP-IV is a simple, structured way to get a parent's view of the patient's childhood: several items rated 2-3 across both dimensions, backed by concrete examples, support criterion B. A low score is not proof of absence: many parents of adults in mid-life cannot recall detail, and quiet, inattentive children were often missed.",
    licence: "Attributed to James M. Swanson. The CADDRA copy carries no copyright line. It is often described as public domain, but this was not confirmed with the author. Not reproduced here.",
    source: "Swanson JM. SNAP-IV Teacher and Parent Rating Scale (26-item version). CADDRA Canadian ADHD Practice Guidelines 4.1 and CADDRA ADHD toolkit (SNAP-IV-26 form, 2022). Bussing R et al. Assessment 2008;15:317-28.",
    url: "https://www.caddra.ca/wp-content/uploads/SNAP-IV-26_July-11-2022.pdf",
    file: null
  },

  /* ------------------------------------------------------------------ SDQ */
  {
    id: "sdq", abbr: "SDQ", name: "Strengths and Difficulties Questionnaire",
    group: "child", stage: ["pre", "collateral", "comorbid"],
    who: "Parent and teacher versions; self-report for young people of about 11-17. An 18+ self-report version also exists.",
    time: "About 5 minutes (clinical practice estimate)",
    ages: "Children and young people (2-17); 18+ self-report version without validated bands", ageMin: 2, ageMax: 17, items_n: 25,
    purpose: "Brief behavioural screening questionnaire (Goodman, 1997). Its 25 items form five scales of five items: emotional symptoms, conduct problems, hyperactivity-inattention, peer relationship problems and prosocial behaviour. An optional impact supplement asks about distress and impairment. NICE NG87 rec 1.3.2 names it, with the Conners' scales, as a helpful added tool in diagnosis.",
    when: "Children and young people: parent and teacher versions (2-17) and the self-report from about 11. Send them before the assessment and enter the result in the Screening step: total difficulties, the hyperactivity-inattention score, the band, who completed it and the date. NICE names it, with the Conners scales, as a helpful added tool. Its emotional, conduct and peer scales also point to co-occurring problems. It is widely used in UK schools, CAMHS and social care, and in England local authorities collect a carer SDQ each year for looked-after children aged 4-16 (DfE and DHSC statutory guidance on the health of looked-after children, 2015), so ask the social worker for recent ones. Adults: it turns up in childhood records, education files or transition paperwork (Collateral step); a raised hyperactivity-inattention score from a parent and a teacher, recorded in childhood, is useful evidence of early onset and pervasiveness. It is not a measure of adult ADHD.",
    how: "Each item is rated not true, somewhat true or certainly true (0-2), with five items scored in reverse. Total difficulties is the sum of the four problem scales; the prosocial scale is scored separately. Banding uses the published UK norms on sdqinfo.org.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Each scale 0-10. Total difficulties 0-40 (emotional, conduct, hyperactivity-inattention and peer scales). Prosocial 0-10, scored separately. The impact supplement gives an impact score.",
      "The hyperactivity-inattention scale covers restlessness, fidgeting, distractibility, thinking before acting and attention span. It does not map onto all 18 DSM symptoms.",
      "Score bands come from UK norms and differ by informant. Use the official scoring tables, not remembered cut-offs.",
      "Four-band scoring (youthinmind scoring document, 20 June 2016), total difficulties: parent 0-13 close to average, 14-16 slightly raised, 17-19 high, 20-40 very high; teacher 0-11, 12-15, 16-18, 19-40; self-report 0-14, 15-17, 18-19, 20-40. Hyperactivity-inattention scale: parent and teacher 0-5, 6-7, 8, 9-10; self-report 0-5, 6, 7, 8-10. The older three bands (parent total: normal 0-13, borderline 14-16, abnormal 17-40) are also in use.",
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
    adhdNotes: "For a child or young person, a raised hyperactivity-inattention score from both parent and teacher supports symptoms in more than one setting, but five items cannot establish DSM criteria: use the interview. Raised emotional, conduct or peer scores point to anxiety, low mood, oppositional or conduct problems, autism, or difficulties at home or school, which go to the differential step. In adult work, treat a childhood SDQ like a school report. A normal score does not exclude ADHD, especially the inattentive presentation.",
    licence: "Copyright Robert Goodman (youthinmind). sdqinfo.org: copyrighted documents that may not be modified; paper versions may be downloaded and photocopied without charge for non-commercial purposes; computer scoring needs a licence. Not reproduced here.",
    source: "Goodman R. The Strengths and Difficulties Questionnaire: a research note. J Child Psychol Psychiatry 1997;38:581-6. youthinmind, sdqinfo.org download terms and scoring document (20 June 2016). NICE NG87, rec 1.3.2.",
    url: "https://www.sdqinfo.org/b1.html",
    file: null
  },

  /* ------------------------------------------------------------------ Epworth Sleepiness Scale */
  {
    id: "epworth", abbr: "ESS", name: "Epworth Sleepiness Scale",
    group: "sleep", stage: ["comorbid", "physical"],
    who: "Self-report",
    time: "2-3 minutes (clinical practice estimate)",
    ages: "Adults", ageMin: 18, ageMax: 120, items_n: 8,
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
    ages: "Adults", ageMin: 18, ageMax: 120, items_n: 7,
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
    ages: "Adults", ageMin: 18, ageMax: 120, items_n: 32,
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
    ages: "Adults", ageMin: 18, ageMax: 120, items_n: 18,
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
    ages: "Adults (a children's version, the CY-BOCS, exists)", ageMin: 18, ageMax: 120, items_n: 10,
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
    ages: "Adults; developed for older adults and mild cognitive impairment", ageMin: 18, ageMax: 120, items_n: null,
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
    ages: "Adults, about their first 18 years", ageMin: 18, ageMax: 120, items_n: 10,
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
    ages: "Adults", ageMin: 18, ageMax: 120, items_n: 8,
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
  },

  /* ================================================================== Young people (6-17), added 25 Oct 2026
     Information-only: the result is entered by hand (tools.<id>.result = { score, cutoff, rater, date, notes }).
     Facts from the research brief of 25 Oct 2026, section 4, unless stated. */

  /* ------------------------------------------------------------------ WFIRS-P */
  {
    id: "wfirsp", abbr: "WFIRS-P", name: "Weiss Functional Impairment Rating Scale, Parent Report",
    group: "adhd-impairment", stage: ["pre", "interview", "followup"],
    who: "Parent or carer",
    time: "Not stated by the author (50 short items; allow about 10 minutes in practice)",
    ages: "Children and young people. No age range is printed on the form; this app offers it from 6 to 17 (clinical practice).", ageMin: 6, ageMax: 17, items_n: 50,
    purpose: "The parent version of the Weiss impairment scale, from the CADDRA toolkit. It measures how the child's emotional or behavioural problems have affected daily life in the last month, in six domains: family (10 items), school (10: learning 4, behaviour 6), life skills (10), the child's self-concept (3), social activities (7) and risky activities (10). Like the self-report, it has no symptom items, so it measures impairment separately from symptoms.",
    when: "Send it to the parent or carer before the assessment and enter the result in the Screening step. Use the domain profile to plan the impairment questions in the Onset and impairment step (criteria C and D), and keep it as a baseline: the Weiss scales were designed to show change in functioning with treatment. For a young person, the self-report (WFIRS-S, offered here from 12) adds their own view.",
    how: "The parent rates each item from 0 (never or not at all) to 3 (very often or very much) for the last month, or marks it not applicable. For each domain, count the items rated 2 or 3 and work out the mean of the answered items, leaving out the not-applicable ones. In the interview, ask about every impaired domain: what happened, how often and what it cost.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "The score sheet records, for each domain, the number of items rated 2 or 3, the total and the mean (not-applicable items excluded).",
      "A domain is usually counted as impaired when 2 or more items are rated 2, or any item is rated 3, or the domain mean is 1.5 or more. The rule comes from CADDRA's WFIRS instructions; applying it to the parent form is likely but was not confirmed.",
      "There are no norms. Read the profile with the interview: which domains, how often, and whether the problems come from ADHD symptoms or from something else, such as anxiety, a learning difficulty or stress at home.",
      "NICE asks for at least moderate impairment. The WFIRS-P informs that judgement but does not make it; the child's own view counts as well."
    ],
    psychometrics: "Validation data were not reviewed for this app.",
    pitfalls: [
      "Not specific to ADHD: anxiety, low mood, autism, learning difficulties and family stress also raise scores.",
      "One parent's view. Add the teacher's account of school and the young person's own view.",
      "Items that do not apply should be marked not applicable, not 0."
    ],
    adhdNotes: "A quick way to see where the child's difficulties cost the most. Impaired domains at home and at school support criteria C and D only when the interview links them to ADHD symptoms. Repeat it at reviews to see whether daily functioning, not just symptoms, improves.",
    licence: "© Margaret Danielle Weiss. The form states it can be used by clinicians and researchers free of charge; contact the author before posting it online, using it in research or translating it. Item wording was not checked for this app, so it is not reproduced here.",
    source: "Weiss MD. Weiss Functional Impairment Rating Scale, Parent Report (WFIRS-P). CADDRA form. CADDRA WFIRS scoring instructions. NICE NG87 1.3.3 (at least moderate impairment) and 1.3.6 (the child's own view of impairment).",
    url: "https://www.caddra.ca/wp-content/uploads/WFIRS-P.pdf",
    file: null
  },

  /* ------------------------------------------------------------------ Young DIVA-5 */
  {
    id: "ydiva5", abbr: "Young DIVA-5", name: "Young DIVA-5: diagnostic interview for ADHD in children and young people",
    group: "adhd-interview", stage: ["interview", "collateral", "diagnosis"],
    who: "Clinician, with the child or young person and a parent present",
    time: "About 1 hour (DIVA Foundation)",
    ages: "5-17", ageMin: 5, ageMax: 17, items_n: 18,
    purpose: "The DIVA Foundation's semi-structured interview for ADHD in children and young people, the counterpart of the adult DIVA-5. It goes through each of the 18 DSM-5 symptoms with examples, with a parent present.",
    when: "An option for the core interview with 5-17-year-olds (Inattention, Hyperactivity-impulsivity, Onset and Collateral steps), if your service has it. Like DIVA-5 it covers ADHD only, so co-occurring conditions need separate assessment.",
    how: "Use the purchased interview and its own instructions. Let the parent and the young person describe each problem in their own words before you use the examples to probe, and record real examples for every symptom you score as present.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Apply DSM-5-TR: 6 or more symptoms in a domain under 17 (5 or more at 17), several symptoms before 12, symptoms in 2 or more settings, clear impairment, and no better explanation.",
      "Add the teacher's account: an interview with the parent alone covers mainly one setting."
    ],
    psychometrics: "Validation data were not reviewed for this app.",
    pitfalls: [
      "Examples can lead: ask open questions first.",
      "Ticking examples is not the same as establishing a symptom. Confirm frequency, persistence and impairment against children of the same age.",
      "Covers ADHD only."
    ],
    adhdNotes: "This app's young-person interview follows a similar structure (each symptom with examples, then onset, impairment and informants), but all its questions are original and it is not DIVA. Clinicians who own Young DIVA-5 can use it alongside the app and record their conclusions here.",
    licence: "© DIVA Foundation. Obtained from the DIVA Foundation; its price and terms of use were not checked for this app. Not reproduced here.",
    source: "DIVA Foundation: Young DIVA-5 for ages 5-17, about 1 hour with a parent present (as summarised in the main course Assessment Guide and the DIVA-5 entry in this library).",
    url: "https://www.divacenter.eu/",
    file: null
  },

  /* ------------------------------------------------------------------ ACE v.2 (child) */
  {
    id: "acechild", abbr: "ACE v.2", name: "ADHD Child Evaluation (ACE v.2)",
    group: "adhd-interview", stage: ["pre", "interview", "collateral", "diagnosis"],
    who: "Clinician, with the parent or carer and the child or young person",
    time: "Not stated in the sources reviewed; plan for a full semi-structured interview",
    ages: "5-16 (ACE+ covers older adolescents and adults)", ageMin: 5, ageMax: 16, items_n: 18,
    purpose: "Professor Susan Young's semi-structured interview for ADHD in children and young people, the child version of ACE+. Like ACE+ v.2 it maps to DSM-5 and ICD-11.",
    when: "A free alternative to Young DIVA-5 for the core interview with a parent or carer (Inattention, Hyperactivity-impulsivity, Onset and Collateral steps). It covers ADHD only, so co-occurring conditions need separate assessment.",
    how: "Download it from the author's site after a free registration. Work through each symptom with open questions and examples, and use its summary to check each DSM-5 or ICD-11 criterion.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Apply DSM-5-TR or ICD-11 rules: 6 or more symptoms in a domain under 17, several symptoms before 12, symptoms in 2 or more settings, clear impairment and no better explanation."
    ],
    psychometrics: "Validation data were not reviewed for this app.",
    pitfalls: [
      "Avoid closed, leading questions and tick-box use.",
      "Covers ADHD criteria only. Assess co-occurring conditions separately."
    ],
    adhdNotes: "A good choice when your service cannot buy Young DIVA-5. Record clear, real examples for every symptom you score as present, and get the teacher's account as well as the parent's.",
    licence: "Described as free (Professor Susan Young, Psychology Services Ltd), downloaded after a free registration. Terms for embedding or adapting it in software were not checked, so its wording is not reproduced here.",
    source: "Young S. ACE v.2: ADHD Child Evaluation. Psychology Services Ltd. Age range and licence as given in the ACE+ entry of this library and the main course Assessment Guide.",
    url: "https://www.psychology-services.uk.com/adhd.htm",
    file: null
  },

  /* ------------------------------------------------------------------ RCADS */
  {
    id: "rcads", abbr: "RCADS", name: "Revised Child Anxiety and Depression Scale (and parent version, RCADS-P)",
    group: "anxiety", stage: ["pre", "comorbid", "followup"],
    who: "Young person (RCADS) or parent (RCADS-P)",
    time: "About 10 minutes (clinical practice estimate)",
    ages: "8-18 (US school grades 3-12)", ageMin: 8, ageMax: 18, items_n: 47,
    purpose: "Free 47-item questionnaire for anxiety and low mood in children and young people (Chorpita and Spence). Subscales: separation anxiety, social phobia, generalised anxiety, panic, obsessive-compulsive symptoms and low mood, plus total anxiety and total internalising scores. The parent version has the same 47 items.",
    when: "Co-occurring conditions step, when the history or the SDQ emotional scale suggests worry, fears, panic or low mood. Anxiety and depression often co-occur with ADHD, and they can also cause poor concentration and restlessness. It can be repeated to track change.",
    how: "The young person (and, separately, the parent) rates each item. Convert raw scores to T-scores with the developer's scoring spreadsheet, which needs the US school grade: one below the UK school year.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "T-scores: 65 or more is borderline clinical; 70 or more is above the clinical threshold (developer's guidance, as listed by CORC).",
      "Read the subscale pattern. Separation anxiety, social anxiety, panic or low mood that drives the attention problems needs its own plan.",
      "A raised score is a prompt for interview, not a diagnosis."
    ],
    psychometrics: "Psychometric papers were not reviewed for this app.",
    pitfalls: [
      "Enter the grade correctly: the US grade is one below the UK school year. A wrong grade gives the wrong T-score.",
      "Check the form is complete: young people with ADHD may rush or skip items (clinical practice).",
      "Do not alter the form or remove the copyright text."
    ],
    adhdNotes: "Ask when the worry or low mood started compared with the attention problems, and whether the inattention is there on calm, good days too. Inattention only when anxious points to anxiety; inattention since early childhood in calm settings points to ADHD. Both often co-occur.",
    licence: "Free: © Chorpita and Spence, at no cost to end users. Do not alter or remove the copyright text; adaptations need written permission. Not reproduced here.",
    source: "Chorpita BF, Spence SH. Revised Child Anxiety and Depression Scale (RCADS and RCADS-P), rcads.ucla.edu. CORC outcome measures directory.",
    url: "https://rcads.ucla.edu",
    file: null
  },

  /* ------------------------------------------------------------------ MFQ */
  {
    id: "mfq", abbr: "MFQ", name: "Mood and Feelings Questionnaire (long form; short form SMFQ)",
    group: "mood", stage: ["pre", "comorbid", "followup"],
    who: "Young person (self-report) or parent; an adult self-report version also exists",
    time: "About 5-10 minutes (clinical practice estimate)",
    ages: "Designed for 8-18; validated 6-19", ageMin: 6, ageMax: 19, items_n: 33,
    purpose: "Free questionnaire for depressive symptoms over the past 2 weeks (Angold and Costello). Each item is rated 0 not true, 1 sometimes, 2 true. The long child self-report has 33 items; the short form (SMFQ) has 13.",
    when: "Co-occurring conditions step, when low mood, irritability, tearfulness or loss of interest are reported, or the SDQ emotional score is raised. Low mood can cause poor concentration and can co-occur with ADHD. Ask the young person as well as the parent.",
    how: "The young person (and, if helpful, the parent) completes the form. Add the item scores.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "The authors set no cut-points. Commonly used guides: SMFQ 12 or more; long MFQ 27 or more (CORC). Treat them as prompts only.",
      "If the young person reports thoughts of self-harm or suicide, assess risk the same day in the Safety and risk step (clinical practice)."
    ],
    psychometrics: "Psychometric papers were not reviewed for this app.",
    pitfalls: [
      "Irritability and poor concentration overlap with ADHD. Ask whether the mood is a change from the child's usual self.",
      "Parent and young person often rate differently. Ask both and record each."
    ],
    adhdNotes: "Depression is usually a change from the young person's usual self, often in episodes; ADHD is long-standing from early childhood. Ask whether concentration was a problem before the low mood began.",
    licence: "Free to download; cite Angold and Costello (Duke University). Not reproduced here.",
    source: "Angold A, Costello EJ. Mood and Feelings Questionnaire. Duke University, developmental epidemiology instruments. CORC outcome measures directory.",
    url: "https://psychiatry.duke.edu/research/research-programs-areas/assessment-intervention/developmental-epidemiology-instruments-0",
    file: null
  },

  /* ------------------------------------------------------------------ PHQ-A */
  {
    id: "phqa", abbr: "PHQ-A", name: "Patient Health Questionnaire for Adolescents (PHQ-9 modified for ages 11-17)",
    group: "mood", stage: ["pre", "comorbid", "risk", "followup"],
    who: "Young person (self-report), ideally completed on their own",
    time: "About 2-5 minutes (clinical practice estimate)",
    ages: "11-17", ageMin: 11, ageMax: 17, items_n: 9,
    purpose: "The PHQ-9 adapted for adolescents: 9 scored items on depressive symptoms, total 0-27. The APA's adapted version asks about the past 7 days; the original asks about the past 2 weeks and adds questions on past-year depression, how difficult the problems make things, and suicidal thoughts and attempts.",
    when: "Co-occurring conditions step for young people aged 11-17, in place of the adult PHQ-9. It is quick enough to use with every teenager (clinical practice). Depression can cause poor concentration and often co-occurs with ADHD.",
    how: "The young person completes it, ideally on their own. Add the 9 item scores. Read item 9 (thoughts of being better off dead or of self-harm) before they leave.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Total 0-27: 0-4 none, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe.",
      "A cut-off of 11 or more gave sensitivity 89.5% and specificity 77.5% for major depression in 13-17-year-olds (Richardson et al. 2010).",
      "Item 9 positive: assess risk the same day in the Safety and risk step."
    ],
    psychometrics: "Richardson et al. 2010 (ages 13-17): at 11 or more, sensitivity 89.5% and specificity 77.5% for major depression.",
    pitfalls: [
      "The concentration, sleep and restlessness items overlap with ADHD. Ask whether they are new or have always been there.",
      "The two versions use different time frames (7 days or 2 weeks). Record which you used."
    ],
    adhdNotes: "A raised score with a clear change from the young person's usual self points to depression, which needs its own treatment. Long-standing inattention since early childhood, present on good days too, points to ADHD. Both can co-occur.",
    licence: "Free: the PHQ screeners can be used without permission (phqscreeners.com). Not reproduced here.",
    source: "PHQ-A (PHQ-9 modified for adolescents), phqscreeners.com. APA adapted version: Severity Measure for Depression, Child Age 11 to 17 (psychiatry.org). Richardson LP et al. 2010.",
    url: "https://www.phqscreeners.com",
    file: null
  },

  /* ------------------------------------------------------------------ CRAFFT 2.1 */
  {
    id: "crafft", abbr: "CRAFFT 2.1", name: "CRAFFT 2.1 substance use screen for adolescents (and CRAFFT 2.1+N)",
    group: "substance", stage: ["comorbid", "risk"],
    who: "Young person (self-completion is recommended), or asked by the clinician",
    time: "About 2 minutes (clinical practice estimate)",
    ages: "12-21 (validated 12-18; others have used it up to 26)", ageMin: 12, ageMax: 21, items_n: 6,
    purpose: "Free screen for alcohol and drug use in adolescents. Part A asks how often the young person used alcohol, cannabis or other substances in the past 12 months. Part B has 6 yes/no items (CAR, RELAX, ALONE, FORGET, FRIENDS, TROUBLE); if every Part A answer is 0, only the CAR item is asked. CRAFFT 2.1+N adds a 10-item nicotine and vaping screen.",
    when: "Co-occurring conditions and Safety and risk steps, for every young person from 12 (clinical practice). Substance use can mimic ADHD (intoxication, withdrawal, poor sleep), can co-occur with it, and matters for any medication plan (misuse and diversion risk). Ask the young person on their own.",
    how: "Explain confidentiality and its limits, then let the young person complete it alone, on paper or on screen. Score 1 point for each yes in Part B.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Part B score 2 or more: high risk; needs further assessment.",
      "Knight et al. 2002: 2 or more was the best cut-off (any problem: sensitivity 0.76, specificity 0.94; any disorder: sensitivity 0.80, specificity 0.86).",
      "A yes to the CAR item (riding with a driver who had been drinking or using drugs, including themselves) needs safety advice whatever the total (clinical practice)."
    ],
    psychometrics: "Knight et al. 2002: at 2 or more, sensitivity 0.76 and specificity 0.94 for any problem; 0.80 and 0.86 for any disorder.",
    pitfalls: [
      "Young people under-report in front of parents. Ask on their own.",
      "Use the current 2.1 version and keep the copyright notice."
    ],
    adhdNotes: "ADHD is linked with a higher risk of substance use in adolescence. Find out whether the attention problems were there before any substance use began. A high score feeds the substance use differentials and the misuse and diversion plan before any medication.",
    licence: "Free: the CRAFFT site states the tool is free to use. Reproduce it according to the site's instructions and keep the copyright notice. Not reproduced here.",
    source: "CRAFFT 2.1 and 2.1+N, crafft.org (Center for Adolescent Behavioral Health Research). Knight JR et al. 2002.",
    url: "https://crafft.org",
    file: null
  },

  /* ------------------------------------------------------------------ SCQ */
  {
    id: "scq", abbr: "SCQ", name: "Social Communication Questionnaire",
    group: "autism", stage: ["pre", "comorbid"],
    who: "Parent or carer",
    time: "About 10 minutes (clinical practice estimate)",
    ages: "From 4 years, with a mental age above 2", ageMin: 4, ageMax: 120, items_n: 40,
    purpose: "Commercial 40-item yes/no parent questionnaire about autism features. The Lifetime form covers the child's whole developmental history; the Current form covers the last 3 months.",
    when: "Co-occurring conditions step when there are social-communication difficulties, rigid or repetitive behaviour, intense interests or sensory differences. Autism often co-occurs with ADHD and some features overlap, so a positive screen leads to a specialist autism assessment, not a diagnosis.",
    how: "The parent completes the form. Score it with the publisher's materials.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Lifetime form total of 15 or more: consider referral for an autism assessment.",
      "Berument et al. 1999 (as the Autism Screening Questionnaire): a cut-off of 15 best separated pervasive developmental disorders from other diagnoses."
    ],
    psychometrics: "Berument et al. 1999: a cut-off of 15 was most effective at separating pervasive developmental disorders from other conditions.",
    pitfalls: [
      "Social difficulties caused by impulsivity or inattention can raise the score. Ask why the child struggles with friends (clinical practice).",
      "A negative screen does not exclude autism, especially in children who mask."
    ],
    adhdNotes: "Autism and ADHD are both diagnosed when both are met. Do not count the same behaviour twice: poor turn-taking from impulsivity is different from not understanding the social rules of a game.",
    licence: "Commercial (WPS; Hogrefe in the UK). Must be bought. Not reproduced here.",
    source: "Social Communication Questionnaire (WPS; Hogrefe UK product page). Berument SK et al. 1999.",
    url: "https://www.hogrefe.com/uk/shop/social-communication-questionnaire-85199.html",
    file: null
  },

  /* ------------------------------------------------------------------ AQ-10 Child */
  {
    id: "aq10child", abbr: "AQ-10 Child", name: "Autism Spectrum Quotient, 10 items (Child, parent report)",
    group: "autism", stage: ["pre", "comorbid"],
    who: "Parent or carer",
    time: "About 2 minutes (clinical practice estimate)",
    ages: "4-11, for children without a learning disability (form wording)", ageMin: 4, ageMax: 11, items_n: 10,
    purpose: "A 10-item parent-report quick referral guide for autistic traits in children aged 4-11 who do not have a learning disability, from the Autism Research Centre.",
    when: "Co-occurring conditions step when the history suggests social-communication difficulties, rigid routines, intense interests or sensory differences. Autism and ADHD often co-occur.",
    how: "The parent chooses definitely agree, slightly agree, slightly disagree or definitely disagree for each item. An 'agree' answer scores 1 on items 1, 5, 7 and 10; a 'disagree' answer scores 1 on items 2, 3, 4, 6, 8 and 9. Total 0-10.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "6 or more: consider referral for a specialist autism assessment.",
      "It is a referral guide, not a diagnostic test."
    ],
    psychometrics: "Psychometric data were not reviewed for this app.",
    pitfalls: [
      "For children without a learning disability (form wording). Not valid when intellectual disability is present: use a specialist autism assessment route.",
      "The scoring key differs from the adolescent and adult forms. Use the key for this form.",
      "A score below 6 does not exclude autism when the history points to it."
    ],
    adhdNotes: "A positive screen is a reason to consider an autism assessment, not to stop the ADHD assessment: both can be diagnosed.",
    licence: "Free for non-profit use. Commercial users and for-profit healthcare apply through Mapi ePROVIDE. Not reproduced here.",
    source: "Autism Research Centre, University of Cambridge: AQ-10 Child form. Allison C et al. 2012 (AQ-10).",
    url: "https://www.autismresearchcentre.com/tests/autism-spectrum-quotient-10-items-aq-10-child/",
    file: null
  },

  /* ------------------------------------------------------------------ AQ-10 Adolescent */
  {
    id: "aq10adol", abbr: "AQ-10 Adolescent", name: "Autism Spectrum Quotient, 10 items (Adolescent, parent report)",
    group: "autism", stage: ["pre", "comorbid"],
    who: "Parent or carer",
    time: "About 2 minutes (clinical practice estimate)",
    ages: "12-15, for teenagers without a learning disability (form wording). No AQ-10 version covers 16-17 by its stated range.", ageMin: 12, ageMax: 15, items_n: 10,
    purpose: "A 10-item parent-report quick referral guide for autistic traits in adolescents aged 12-15 who do not have a learning disability, from the Autism Research Centre.",
    when: "Co-occurring conditions step when the history suggests social-communication difficulties, rigid routines, intense interests or sensory differences. At 16-17 this app offers the adult AQ-10 as clinical practice.",
    how: "The parent chooses definitely agree, slightly agree, slightly disagree or definitely disagree for each item. An 'agree' answer scores 1 on items 1, 5, 8 and 10; a 'disagree' answer scores 1 on items 2, 3, 4, 6, 7 and 9. Total 0-10.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "6 or more: consider referral for a specialist autism assessment.",
      "It is a referral guide, not a diagnostic test."
    ],
    psychometrics: "Psychometric data were not reviewed for this app.",
    pitfalls: [
      "For teenagers without a learning disability (form wording). Not valid when intellectual disability is present: use a specialist autism assessment route.",
      "The scoring key differs from the child and adult forms. Use the key for this form.",
      "A score below 6 does not exclude autism, especially in young people who mask."
    ],
    adhdNotes: "A positive screen is a reason to consider an autism assessment, not to stop the ADHD assessment: both can be diagnosed.",
    licence: "Free for non-profit use. Commercial users and for-profit healthcare apply through Mapi ePROVIDE. Not reproduced here.",
    source: "Autism Research Centre, University of Cambridge: AQ-10 Adolescent form. Allison C et al. 2012 (AQ-10).",
    url: "https://www.autismresearchcentre.com/tests/autism-spectrum-quotient-10-items-aq-10-adolescent/",
    file: null
  }
]);
