/* tools-adhd: ADHD-specific instruments for adult assessment (ARCHITECTURE.md section 5.4).
   Interactive (items reproduced, scored by AA.scoring): asrs18, wurs25, wfirs.
   Information only (licence does not allow reproducing items, or scoring is proprietary):
   asrs5, diva5, diva2, aceplus, caars2, baars4, brief_a, bdefs, brown_efa, caadid, aisrs, wsr2, qbtest.
   Item wording, thresholds and scoring were checked against the official forms (WHO ASRS v1.1 2003 layout;
   CADDRA WFIRS-S and WSR-II; NHS and UBC copies of the WURS-25) and the papers cited in each entry.
   Licence status is recorded per tool in `licence`. PDFs are redistributed only where the rights holder
   clearly allows it (WFIRS-S and WSR-II: the free-use statement by Dr M. D. Weiss printed on the forms).
   Sources: Kessler et al. 2005, 2007; Harvard NCS ASRS v1.1 screener scoring update (February 2024);
   Adler et al. 2019; Ustun et al. 2017; van de Glind et al. 2013; Iwanami et al. 2026;
   Brevik et al. 2020; Ward et al. 1993; Kouros et al. 2018; Mannuzza et al. 2002; CADDRA WFIRS guides 2011
   and 2025; Canu et al. 2020; UKAAN AQAS (Adamou et al. 2024); RCPsych CR235 (2023); NICE NG87 and HTG729;
   DIVA Foundation website (October 2026); MHS, PAR, Guilford and Pearson publisher information.
   ageMin/ageMax (added 25 Oct 2026): inclusive whole years of the person being assessed, taken from each tool's
   ages text; ageMax 120 means no upper limit stated. WFIRS-S from 12 is an inference (clinical practice, said in
   its ages text); ACE+ from 17 follows the main course (ACE v.2 covers 5-16); QbTest 6-17 follows NICE. */
AA.add('tools', [

  /* ------------------------------------------------------------------ ASRS v1.1 (18 items) */
  {
    id: "asrs18", abbr: "ASRS v1.1", name: "Adult ADHD Self-Report Scale v1.1, Symptom Checklist (WHO)",
    group: "adhd-screen", stage: ["referral", "pre", "followup"],
    who: "Self-report by the patient. A partner or close other can complete it as an observer report (CADDRA).",
    time: "About 5 minutes", ages: "Adults (18 and over)", ageMin: 18, ageMax: 120, items_n: 18,
    purpose: "Screens for current adult ADHD symptoms. The 18 items follow the 18 DSM-IV-TR symptoms and ask how often each happened in the past 6 months. Part A (items 1-6) is the validated 6-item screener. Part B (items 7-18) covers the remaining symptoms and works as a set of prompts for the interview.",
    when: "Before the first appointment (Screening step), so the answers are ready when the interview starts. Use it as a screen and a baseline only. UKAAN's quality standard (AQAS 2024) says self-rated symptom scales should give a baseline for measuring change and should not form part of the diagnostic evidence. Repeat it at follow-up and after dose changes to track response. Do not use it alone to accept or reject a referral: RCPsych CR235 (2023) calls the ASRS undiscriminating for triage, and NHS England's ADHD Taskforce says a positive screen on its own is not a reason to refer.",
    how: "Give the patient a copy without shading (the shaded boxes are a scoring guide). Ask them to rate the past 6 months. Count the Part A answers that fall in the shaded range and add up the Part A scores (0-24), then read the Part B answers. In the interview, ask for real examples of every item in the shaded range and how each problem affects work, home and relationships. The form also reminds clinicians to check childhood: some significant symptoms should have been present in childhood, but not necessarily the full set.",
    interactive: true,
    instructions: "Rate yourself on each question. Choose the answer that best describes how you have felt and conducted yourself over the past 6 months.",
    options: [{ v: 0, l: "Never" }, { v: 1, l: "Rarely" }, { v: 2, l: "Sometimes" }, { v: 3, l: "Often" }, { v: 4, l: "Very often" }],
    items: [
      { n: 1, part: "A", threshold: 2, section: "Part A", sectionNote: "The 6-item screener. Positive if 4 or more answers are in the shaded range (original rule) or the 0-24 sum is 14 or more (2024 scoring).", t: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?" },
      { n: 2, part: "A", threshold: 2, t: "How often do you have difficulty getting things in order when you have to do a task that requires organization?" },
      { n: 3, part: "A", threshold: 2, t: "How often do you have problems remembering appointments or obligations?" },
      { n: 4, part: "A", threshold: 3, t: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?" },
      { n: 5, part: "A", threshold: 3, t: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?" },
      { n: 6, part: "A", threshold: 3, t: "How often do you feel overly active and compelled to do things, like you were driven by a motor?" },
      { n: 7, part: "B", threshold: 3, section: "Part B", sectionNote: "No total score or likelihood for these items. Use answers in the shaded range as prompts in the interview.", t: "How often do you make careless mistakes when you have to work on a boring or difficult project?" },
      { n: 8, part: "B", threshold: 3, t: "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?" },
      { n: 9, part: "B", threshold: 2, t: "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?" },
      { n: 10, part: "B", threshold: 3, t: "How often do you misplace or have difficulty finding things at home or at work?" },
      { n: 11, part: "B", threshold: 3, t: "How often are you distracted by activity or noise around you?" },
      { n: 12, part: "B", threshold: 2, t: "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?" },
      { n: 13, part: "B", threshold: 3, t: "How often do you feel restless or fidgety?" },
      { n: 14, part: "B", threshold: 3, t: "How often do you have difficulty unwinding and relaxing when you have time to yourself?" },
      { n: 15, part: "B", threshold: 3, t: "How often do you find yourself talking too much when you are in social situations?" },
      { n: 16, part: "B", threshold: 2, t: "When you're in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?" },
      { n: 17, part: "B", threshold: 3, t: "How often do you have difficulty waiting your turn in situations when turn taking is required?" },
      { n: 18, part: "B", threshold: 2, t: "How often do you interrupt others when they are busy?" }
    ],
    scoring: {
      method: "asrs18", partA: 4,
      subscales: [
        { id: "parta", label: "Part A sum (items 1-6, scored 0-4; Harvard NCS 2024 scoring)", items: [1, 2, 3, 4, 5, 6], cutoff: 14,
          bands: [
            { min: 0, max: 9, label: "Low negative (0-9)", sev: 0 },
            { min: 10, max: 13, label: "High negative (10-13)", sev: 1 },
            { min: 14, max: 17, label: "Low positive (14-17)", sev: 2 },
            { min: 18, max: 24, label: "High positive (18-24)", sev: 3 }
          ] },
        { id: "ia", label: "Inattention (items 1-4, 7-11)", items: [1, 2, 3, 4, 7, 8, 9, 10, 11] },
        { id: "hi", label: "Hyperactivity-impulsivity (items 5-6, 12-18)", items: [5, 6, 12, 13, 14, 15, 16, 17, 18] }
      ]
    },
    interpretation: [
      "Part A screen, original rule (printed on the form): count items 1-6 answered in the shaded range. Items 1-3 are shaded from 'Sometimes'; items 4-6 from 'Often'. Four or more is a positive screen. The form says such symptoms are highly consistent with adult ADHD and warrant further investigation. It is not a diagnosis.",
      "Part A screen, 0-24 sum: the Harvard National Comorbidity Survey team (scoring update, February 2024) now prefers summing items 1-6 scored 0 (never) to 4 (very often). A total of 14 or more is a positive screen, and the total falls into four bands: 0-9 low negative, 10-13 high negative, 14-17 low positive, 18-24 high positive (the four-level screener of Kessler et al. 2007). The app shows both results. If they disagree, say which rule you used and let the interview decide.",
      "Part B (items 7-18): the form gives no total score or likelihood. Items 9, 12, 16 and 18 are shaded from 'Sometimes'; the others from 'Often'. Treat shaded answers as prompts for the interview.",
      "The subscale totals (0-36 each) and the overall total (0-72) shown in the app are raw frequency sums. They are useful as a baseline for measuring change. They have no official cut-off.",
      "Research scorings you may meet. (1) Adler et al. 2019 scored each item 1 if shaded and counted inattention and hyperactivity-impulsivity items separately (0-9 each); 6 or more on either was called symptomatic, a DSM-IV-era rule. (2) Brevik et al. 2020 summed all 18 items (0-72): adults with ADHD averaged 45.0 and controls 23.0; a cut-off of 35 gave sensitivity 0.80 and specificity 0.88. (3) In substance use treatment (van de Glind et al. 2013), the 0-24 sum with a cut-off of 14 did no better than the shaded rule (sensitivity 0.81, specificity 0.70), so those authors kept the shaded rule in that setting. (4) Totals and bands from commercial websites (for example Part B 27 or more, total 40 or more) are not from a primary source.",
      "A negative screen does not rule ADHD out. In the original community study the screener detected about 7 in 10 cases (sensitivity 68.7%).",
      "A positive screen is common in people without ADHD. In England the share of adults screening positive on the 6-item ASRS rose from 8.2% (2007) to 13.9% (2024) in the Adult Psychiatric Morbidity Survey. The DHSC Independent Review (2026) stresses that screening positive is not the same as a diagnosis."
    ],
    psychometrics: "Kessler et al. 2005 (154 US community respondents, blind clinical DSM-IV ratings): the 6-item screener had sensitivity 68.7%, specificity 99.5%, accuracy 97.9% and kappa 0.76; the full 18 items did less well (sensitivity 56.3%, specificity 98.3%). Kessler et al. 2007 (668 health-plan members): test-retest r 0.58-0.77; a four-level version of the screener had AUC 0.90. Brevik et al. 2020 (646 clinically diagnosed adults, 908 population controls, Norway): AUC 0.904 for all 18 items and 0.903 for Part A. van de Glind et al. 2013 (1,138 patients in substance use treatment, 10 countries, CAADID reference): sensitivity 0.84, specificity 0.66, PPV 0.26, NPV 0.97. Adler et al. 2019 US norms (22,397 adults): mean count of shaded items 2.0 (SD 3.2) out of 18, highest at ages 18-29 (3.0) and lowest at 65 and over (1.2).",
    pitfalls: [
      "Specificity falls in clinical groups. Depression, anxiety, substance use, bipolar disorder and borderline personality disorder all raise scores (van de Glind et al. 2013; AADPA 2022 evidence review).",
      "Current low mood, poor sleep and stress inflate ratings. Ask about the past 6 months, not a bad week.",
      "Easy to over-endorse. People who have read about ADHD can endorse most items (RCPsych CR235), and coached simulators produce ADHD-like profiles on self-report scales (Sollman et al. 2010).",
      "It does not check onset before 12, pervasiveness, impairment or other explanations, so it can neither make nor exclude a diagnosis.",
      "The wording is based on DSM-IV and leans on work settings. Adapt your follow-up questions for people who are not working; do not reword the items.",
      "Give the patient an unshaded copy. The shading shown in this app is for the clinician.",
      "Do not confuse it with the ASRS-5, a different 6-item DSM-5 screener with weighted scoring.",
      "Do not use the 2018 weighted 'DSM-5 scoring' of the six v1.1 screener items that still circulates online. Kessler withdrew it in a memo of December 2023: it reversed the scoring of two items, overfitted the data and overestimated prevalence. Use the original rules above."
    ],
    adhdNotes: "Use the shaded items as a map for the interview. For each one, ask for recent, specific examples and how often they happen compared with other people of the same age. A high score with few real examples suggests distress, another condition or over-reporting, so look at validity. A low score with a strong history and informant support suggests low insight, masking or a highly structured life. Where possible compare the patient's form with a partner's. Keep the result as a baseline and repeat it after treatment starts.",
    licence: "Part A (6-item screener): free for clinical and non-clinical use, including commercial use, with attribution; no changes except making an electronic version (NYU Langone licensing page; copyright New York University and the President and Fellows of Harvard College). Full 18-item checklist: the form carries '© World Health Organization 2003. All rights reserved', with requests to reproduce sent to Professor Ronald Kessler. NYU now licenses it: clinical-use permission through the 'ADHD in Adults' website, and a commercial website or app licence priced on application. PhenX lists the checklist as freely available without permission. Because these sources conflict, the Part B items are shown here for clinical use with the WHO notice, and written permission from NYU should be obtained before public release. The PDF is not redistributed (all rights reserved); CADDRA hosts a printable copy.",
    source: "Kessler RC, Adler L, Ames M, et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychol Med 2005;35:245-256. ASRS-v1.1 Symptom Checklist © World Health Organization 2003. Harvard Medical School, National Comorbidity Survey. ASRS v1.1 screener (6Q) scoring update, 28 February 2024. Kessler RC. DSM-5 scoring of DSM-IV ASRS (memo), 8 December 2023. Kessler RC et al. Int J Methods Psychiatr Res 2007;16:52-65. Shading and subtype scoring: Adler LA et al. Establishing US norms for the Adult ADHD Self-Report Scale (ASRS-v1.1). Int J Clin Pract 2019;73:e13260.",
    url: "https://license.tov.med.nyu.edu/product/asrs-v11-18-question-symptom-checklist",
    file: null
  },

  /* ------------------------------------------------------------------ ASRS-5 */
  {
    id: "asrs5", abbr: "ASRS-5", name: "WHO Adult ADHD Self-Report Screening Scale for DSM-5",
    group: "adhd-screen", stage: ["referral", "pre"],
    who: "Self-report", time: "A few minutes (6 items; time not stated by the authors)", ages: "Adults", ageMin: 18, ageMax: 120, items_n: 6,
    purpose: "A 6-item DSM-5 screener built with a machine-learning method (RiskSLIM) from the longer ASRS question set. Four items match ASRS v1.1 items 9, 12, 14 and 16 (listening when spoken to, leaving one's seat, unwinding, finishing other people's sentences). Two are not DSM symptoms: putting things off until the last minute, and depending on others to keep life in order. It covers the past 6 months.",
    when: "An alternative to ASRS v1.1 Part A in the Screen step, only if your service holds a licence for the scoring key. The validated score uses unpublished weights, so this app does not score it. Like any screen it is optional and never decides the diagnosis.",
    how: "The patient rates 6 items from never to very often for the past 6 months. Score with the licensed key from NYU, then record the total and whether it is 14 or more.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Weighted scoring. Every item scores 0 for 'never'. Maximum points are 5 for items 1 and 2, 6 for item 3, 2 for item 4, 4 for item 5 and 3 for item 6, so totals run from 0 to 25 (range as corrected in 2019).",
      "The points for 'rarely', 'sometimes' and 'often' are not published. NYU describes the scoring as proprietary.",
      "Cut-off: 14 or more, as recommended by the developers. They call 14 the most liberal threshold to consider for screening in a clinical sample.",
      "Simple 0-4 scoring (0-24) with a cut-off of 14, seen on many websites, is not the published method. Its accuracy is unknown."
    ],
    psychometrics: "Ustun et al. 2017 (JAMA Psychiatry; corrected 2017 and 2019). General-population development data (prevalence 8.2%), at 14 or more: sensitivity 91.4%, specificity 96.0%, AUC 0.94, PPV 67.3%. NYU Langone clinic sample (prevalence 57.7%): sensitivity 91.9%, specificity 74.0%, AUC 0.83, PPV 82.8%. German primary care and clinic sample (Ballmann et al. 2022; 262 patients; IDA-R reference; developers' weighted scoring): sensitivity 95.6%, specificity 72.3%, alpha 0.88; at 3% prevalence the authors estimate a PPV under 10%.",
    pitfalls: [
      "Only one inattention item, although inattention dominates adult ADHD.",
      "Specificity is poor in bipolar disorder and borderline personality disorder (AADPA 2022 evidence review).",
      "The development interviews did not use informants or exclude conditions such as bipolar disorder. The developers say the scale is best suited to people with enough insight to recognise their symptoms.",
      "Do not score it with unweighted 0-4 points and report the result as an ASRS-5 score.",
      "Do not confuse it with the withdrawn 2018 'DSM-5 scoring' of the ASRS v1.1 screener items. That was a different set of items and weights, and Kessler withdrew it in December 2023."
    ],
    adhdNotes: "If you use it, treat it like the ASRS v1.1 screener: a reason to assess, not evidence for the diagnosis. Its two non-DSM items (putting things off and relying on others) also rise with depression, anxiety and low confidence. ASRS v1.1 Part A is free to use and is scored in this app, so prefer it unless your service is licensed for the ASRS-5.",
    licence: "Items are printed in an AMA-copyright article (JAMA Psychiatry 2017), free to read on PubMed Central. NYU's licensing page offers a free 1-year research licence that needs an institutional signatory and describes the scoring as proprietary; clinical and commercial terms are not stated. Without the scoring key the validated score cannot be produced, so the items are not reproduced or scored here and no PDF is redistributed.",
    source: "Ustun B, Adler LA, Rudin C, et al. The World Health Organization Adult Attention-Deficit/Hyperactivity Disorder Self-Report Screening Scale for DSM-5. JAMA Psychiatry 2017;74:520-527 (corrections 2017;74:1279 and 2019;76:1213). Ballmann C et al. Front Psychol 2022 (German validation).",
    url: "https://license.tov.med.nyu.edu/product/asrs-dsm-5",
    file: null
  },

  /* ------------------------------------------------------------------ WURS-25 */
  {
    id: "wurs25", abbr: "WURS-25", name: "Wender Utah Rating Scale (25 scored items)",
    group: "adhd-childhood", stage: ["pre", "interview"],
    who: "Self-report: the adult rates their own childhood", time: "Not stated in the sources (25 short items; a few minutes in practice)",
    ages: "Adults (retrospective report of childhood)", ageMin: 18, ageMax: 120, items_n: 25,
    purpose: "Gives a self-rated picture of childhood behaviour and mood. The 25 items are those from the 61-item WURS that best separated adults with ADHD from comparison groups in the original study. The numbers shown beside each item are its numbers on the 61-item form.",
    when: "Before the childhood part of the interview (Screening step), alongside school reports and informant accounts. It helps you plan the childhood questions and gives a cross-check for criterion B. It cannot establish childhood onset on its own: adults recall their childhood poorly, so look for evidence from the time.",
    how: "The patient rates each description from 0 (not at all or very slightly) to 4 (very much) for how they were as a child. Add the 25 items (0-100). If the full 61-item form was used, score only these 25 items and ignore the rest.",
    interactive: true,
    instructions: "Think about yourself as a child. For each description, choose how much it applied to you. Each item completes the sentence in the heading above it.",
    options: [{ v: 0, l: "Not at all or very slightly" }, { v: 1, l: "Mildly" }, { v: 2, l: "Moderately" }, { v: 3, l: "Quite a bit" }, { v: 4, l: "Very much" }],
    items: [
      { n: 1, label: "3", section: "As a child I was (or had):", t: "concentration problems, easily distracted" },
      { n: 2, label: "4", t: "anxious, worrying" },
      { n: 3, label: "5", t: "nervous, fidgety" },
      { n: 4, label: "6", t: "inattentive, daydreaming" },
      { n: 5, label: "7", t: "hot- or short-tempered, low boiling point" },
      { n: 6, label: "9", t: "temper outbursts, tantrums" },
      { n: 7, label: "10", t: "trouble with stick-to-it-tiveness, not following through, failing to finish things started" },
      { n: 8, label: "11", t: "stubborn, strong-willed" },
      { n: 9, label: "12", t: "sad or blue, depressed, unhappy" },
      { n: 10, label: "15", t: "disobedient with parents, rebellious, sassy" },
      { n: 11, label: "16", t: "low opinion of myself" },
      { n: 12, label: "17", t: "irritable" },
      { n: 13, label: "20", t: "moody, ups and downs" },
      { n: 14, label: "21", t: "angry" },
      { n: 15, label: "24", t: "acting without thinking, impulsive" },
      { n: 16, label: "25", t: "tendency to be immature" },
      { n: 17, label: "26", t: "guilty feelings, regretful" },
      { n: 18, label: "27", t: "losing control of myself" },
      { n: 19, label: "28", t: "tendency to be or act irrational" },
      { n: 20, label: "29", t: "unpopular with other children, didn't keep friends for long, didn't get along with other children" },
      { n: 21, label: "40", t: "trouble seeing things from someone else's point of view" },
      { n: 22, label: "41", t: "trouble with authorities, trouble with school, visits to principal's office" },
      { n: 23, label: "51", section: "As a child in school I was (or had):", t: "overall a poor student, slow learner" },
      { n: 24, label: "56", t: "trouble with mathematics or numbers" },
      { n: 25, label: "59", t: "not achieving up to potential" }
    ],
    scoring: {
      method: "sum",
      bands: [
        { min: 0, max: 35, label: "Below both published cut-offs", sev: 0 },
        { min: 36, max: 45, label: "At or above the alternative cut-off (36), below the original (46)", sev: 1 },
        { min: 46, max: 100, label: "At or above the original cut-off (46)", sev: 2 }
      ],
      cutoff: { value: 46, text: "Original cut-off (Ward et al. 1993): self-reported childhood symptoms consistent with ADHD. Corroborate with records and informants." }
    },
    interpretation: [
      "46 or more (original cut-off): in Ward et al. 1993 this correctly classified 86% of adults with ADHD, 99% of controls and 81% of adults with depression.",
      "36 or more (alternative cut-off): reported as 96% sensitivity and 96% specificity against controls (Ward et al. 1993, as cited by Kouros et al. 2018 and Brevik et al. 2020). It finds more cases but gives more false positives in clinical samples.",
      "In a psychiatric clinic for young adults with ADHD, bipolar disorder and/or borderline personality disorder (Kouros et al. 2018), the best cut-off was 39 (sensitivity 0.88, specificity 0.70). At 36, specificity fell to 0.59; at 46, sensitivity and specificity were both 0.80.",
      "A high score shows that the person remembers a difficult childhood. Check which items drive it: attention, restlessness and impulsivity items support ADHD more than mood, temper and self-esteem items (clinical practice).",
      "Read it with the childhood interview, the onset questions and school reports. A low score does not exclude ADHD when records and informants show childhood symptoms."
    ],
    psychometrics: "Ward et al. 1993: 81 adults with ADHD, 100 controls and 70 adults with depression; results at 46 as above. Brevik et al. 2020 (646 clinically diagnosed adults, 908 population controls, Norway): mean 58.2 in ADHD versus 17.3 in controls; AUC 0.956; at 36, sensitivity 0.89 and specificity 0.90; at 46, sensitivity 0.75 and specificity 0.95; alpha 0.967; three factors (aggressiveness and social problems, learning and attention problems, dysthymia). Kouros et al. 2018 (121 outpatients aged 18-25, Sweden): alpha 0.94, AUC 0.87, PPV 0.59 and NPV 0.92 at 39.",
    pitfalls: [
      "Recall bias: at population prevalence, adults' self-report of childhood ADHD had a positive predictive value of only 0.27 (Mannuzza et al. 2002).",
      "Not based on DSM criteria. Many items cover mood, temper and self-esteem, so scores rise in borderline personality disorder, bipolar disorder and depression. About 1 in 5 adults with depression scored 46 or more in the original study.",
      "Current low mood colours how people remember their childhood.",
      "The German short form (WURS-k) is a different instrument, with different items scored and a cut-off above 30. Do not mix the cut-offs.",
      "Do not add the 36 unscored items of the 61-item form to the total.",
      "The school items (poor student, trouble with numbers, not achieving potential) also rise with specific learning disorders and intellectual disability."
    ],
    adhdNotes: "Use the WURS-25 to plan and cross-check the childhood interview, not to decide criterion B. Agreement between the WURS-25, the childhood interview and school reports strengthens the case. If the score is high but the interview and records show no childhood ADHD symptoms, consider trauma, mood or personality difficulties. If the score is low but school reports describe a distracted, disorganised child, give more weight to the records from the time than to recall.",
    licence: "No explicit licence statement from the authors, the University of Utah or the American Journal of Psychiatry was found. The US Veterans Affairs VistA Mental Health Assistant catalogue lists the WURS-25 as not copyrighted and not needing a licence, and RCPsych CR235 (2023) lists the WURS as free. NHS and university services host copies. The items are reproduced here with citation to Ward et al. 1993; the rights holder's position is unverified. No PDF is redistributed because no explicit redistribution permission was found; the link is to a university-hosted copy.",
    source: "Ward MF, Wender PH, Reimherr FW. The Wender Utah Rating Scale: an aid in the retrospective diagnosis of childhood attention deficit hyperactivity disorder. Am J Psychiatry 1993;150:885-890. Item wording from NHS North Yorkshire CCG and University of British Columbia copies. Brevik EJ et al. Brain Behav 2020;10:e01605. Kouros I et al. Ups J Med Sci 2018;123:230-236.",
    url: "https://med-fom-tcmp.sites.olt.ubc.ca/files/2021/10/Wender-Utah-Rating-Scale-Form.pdf",
    file: null
  },

  /* ------------------------------------------------------------------ WFIRS-S */
  {
    id: "wfirs", abbr: "WFIRS-S", name: "Weiss Functional Impairment Rating Scale, Self-Report",
    group: "adhd-impairment", stage: ["referral", "pre", "interview", "followup"],
    who: "Self-report (adolescents and adults). A parent form (WFIRS-P) exists for children.",
    time: "Not stated by the author (69 short items; allow 10-15 minutes in practice)", ages: "Adolescents and adults. No lower age was found in the sources checked; this app offers it from 12 (clinical practice). A parent form (WFIRS-P) covers children.", ageMin: 12, ageMax: 120, items_n: 69,
    purpose: "Measures how emotional or behavioural problems have affected daily functioning in the last month, across 7 domains: family, work, school, life skills, self-concept, social and risk. It leaves out ADHD symptom items, so it measures impairment separately from symptoms.",
    when: "Send it before the appointment (Screening step) and use the domain profile to structure the impairment questions for criteria C and D. Repeat it at follow-up: it was designed to show change in functioning with treatment. UKAAN's quality standard lists it as supporting evidence only; the impairment judgement should rest mainly on the interview.",
    how: "The patient rates each item from 0 to 3 for the last month, or marks it not applicable (for example the School section when not studying). For each domain, count items rated 2 or 3 and work out the mean of the answered items. In the interview, ask about every impaired domain: what happened, how often, and what it cost.",
    interactive: true,
    instructions: "Choose the rating that best describes how your emotional or behavioural problems have affected each item in the last month.",
    options: [{ v: 0, l: "Never or not at all" }, { v: 1, l: "Sometimes or somewhat" }, { v: 2, l: "Often or much" }, { v: 3, l: "Very often or very much" }, { v: "na", l: "Not applicable" }],
    items: [
      { n: 1, label: "A1", section: "A. Family", t: "Having problems with family" },
      { n: 2, label: "A2", t: "Having problems with spouse/partner" },
      { n: 3, label: "A3", t: "Relying on others to do things for you" },
      { n: 4, label: "A4", t: "Causing fighting in the family" },
      { n: 5, label: "A5", t: "Makes it hard for the family to have fun together" },
      { n: 6, label: "A6", t: "Problems taking care of your family" },
      { n: 7, label: "A7", t: "Problems balancing your needs against those of your family" },
      { n: 8, label: "A8", t: "Problems losing control with family" },
      { n: 9, label: "B1", section: "B. Work", sectionNote: "If not working, mark these items 'Not applicable'.", t: "Problems performing required duties" },
      { n: 10, label: "B2", t: "Problems with getting your work done efficiently" },
      { n: 11, label: "B3", t: "Problems with your supervisor" },
      { n: 12, label: "B4", t: "Problems keeping a job" },
      { n: 13, label: "B5", t: "Getting fired from work" },
      { n: 14, label: "B6", t: "Problems working in a team" },
      { n: 15, label: "B7", t: "Problems with your attendance" },
      { n: 16, label: "B8", t: "Problems with being late" },
      { n: 17, label: "B9", t: "Problems taking on new tasks" },
      { n: 18, label: "B10", t: "Problems working to your potential" },
      { n: 19, label: "B11", t: "Poor performance evaluations" },
      { n: 20, label: "C1", section: "C. School", sectionNote: "If not studying, mark these items 'Not applicable'.", t: "Problems taking notes" },
      { n: 21, label: "C2", t: "Problems completing assignments" },
      { n: 22, label: "C3", t: "Problems getting your work done efficiently" },
      { n: 23, label: "C4", t: "Problems with teachers" },
      { n: 24, label: "C5", t: "Problems with school administrators" },
      { n: 25, label: "C6", t: "Problems meeting minimum requirements to stay in school" },
      { n: 26, label: "C7", t: "Problems with attendance" },
      { n: 27, label: "C8", t: "Problems with being late" },
      { n: 28, label: "C9", t: "Problems with working to your potential" },
      { n: 29, label: "C10", t: "Problems with inconsistent grades" },
      { n: 30, label: "D1", section: "D. Life skills", t: "Excessive or inappropriate use of internet, video games or TV" },
      { n: 31, label: "D2", t: "Problems keeping an acceptable appearance" },
      { n: 32, label: "D3", t: "Problems getting ready to leave the house" },
      { n: 33, label: "D4", t: "Problems getting to bed" },
      { n: 34, label: "D5", t: "Problems with nutrition" },
      { n: 35, label: "D6", t: "Problems with sex" },
      { n: 36, label: "D7", t: "Problems with sleeping" },
      { n: 37, label: "D8", t: "Getting hurt or injured" },
      { n: 38, label: "D9", t: "Avoiding exercise" },
      { n: 39, label: "D10", t: "Problems keeping regular appointments with doctor/dentist" },
      { n: 40, label: "D11", t: "Problems keeping up with household chores" },
      { n: 41, label: "D12", t: "Problems managing money" },
      { n: 42, label: "E1", section: "E. Self-concept", t: "Feeling bad about yourself" },
      { n: 43, label: "E2", t: "Feeling frustrated with yourself" },
      { n: 44, label: "E3", t: "Feeling discouraged" },
      { n: 45, label: "E4", t: "Not feeling happy with your life" },
      { n: 46, label: "E5", t: "Feeling incompetent" },
      { n: 47, label: "F1", section: "F. Social", t: "Getting into arguments" },
      { n: 48, label: "F2", t: "Trouble cooperating" },
      { n: 49, label: "F3", t: "Trouble getting along with people" },
      { n: 50, label: "F4", t: "Problems having fun with other people" },
      { n: 51, label: "F5", t: "Problems participating in hobbies" },
      { n: 52, label: "F6", t: "Problems making friends" },
      { n: 53, label: "F7", t: "Problems keeping friends" },
      { n: 54, label: "F8", t: "Saying inappropriate things" },
      { n: 55, label: "F9", t: "Complaints from neighbours" },
      { n: 56, label: "G1", section: "G. Risk", t: "Aggressive driving" },
      { n: 57, label: "G2", t: "Doing other things while driving" },
      { n: 58, label: "G3", t: "Road rage" },
      { n: 59, label: "G4", t: "Breaking or damaging things" },
      { n: 60, label: "G5", t: "Doing things that are illegal" },
      { n: 61, label: "G6", t: "Being involved with the police" },
      { n: 62, label: "G7", t: "Smoking cigarettes" },
      { n: 63, label: "G8", t: "Smoking marijuana" },
      { n: 64, label: "G9", t: "Drinking alcohol" },
      { n: 65, label: "G10", t: "Taking \"street\" drugs" },
      { n: 66, label: "G11", t: "Sex without protection (birth control, condom)" },
      { n: 67, label: "G12", t: "Sexually inappropriate behaviour" },
      { n: 68, label: "G13", t: "Being physically aggressive" },
      { n: 69, label: "G14", t: "Being verbally aggressive" }
    ],
    scoring: {
      method: "wfirs",
      domains: [
        { id: "family", label: "Family", items: [1, 2, 3, 4, 5, 6, 7, 8] },
        { id: "work", label: "Work", items: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] },
        { id: "school", label: "School", items: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
        { id: "lifeskills", label: "Life skills", items: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41] },
        { id: "selfconcept", label: "Self-concept", items: [42, 43, 44, 45, 46] },
        { id: "social", label: "Social", items: [47, 48, 49, 50, 51, 52, 53, 54, 55] },
        { id: "risk", label: "Risk", items: [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69] }
      ],
      rule: { twos: 2, threes: 1, mean: 1.5 }
    },
    interpretation: [
      "A domain counts as impaired when 2 or more items are rated 2 or higher, or any item is rated 3, or the domain mean is 1.5 or more (CADDRA WFIRS-S scoring guide 2025; the 2011 instructions say a mean above 1.5). Not-applicable items are left out of every calculation.",
      "At item level, any rating of 2 or 3 marks a clinically impaired area (CADDRA 2011 instructions).",
      "The app reads 2 or more impaired domains as a positive result, as a prompt to check the DSM-5-TR and NICE requirement for impairment in at least 2 settings. It is not the same thing: Self-concept and Risk are not settings, so 2 impaired domains can come from one setting or none. The interview must confirm impairment in each setting.",
      "Use the total and domain means to track change. CADDRA's 2011 instructions describe a fall of 13 points in the total as a significant improvement (about half a standard deviation).",
      "Domains map to the interview's impairment areas: Family to Partner and family; Work and School to Work and education; Life skills to Daily life, money and admin; Self-concept to Self-confidence and self-image; Social to Friends and social contacts (item F5 to Free time and hobbies); Risk to Driving, health and safety."
    ],
    psychometrics: "CADDRA 2011 instructions: internal consistency above 0.8 for each domain and for the whole scale; convergent validity about 0.6 with the Columbia Impairment Scale and GAF; correlation about 0.4 with symptom ratings; domains supported by factor analysis; sensitive to change (data mainly from children and parents). Canu et al. 2020 (2,093 college students and 262 informants): good reliability, cross-informant agreement and concurrent validity, but scores were also linked to internalising symptoms, so they are not specific to ADHD. French adult version (Micoulaud-Franchi et al. 2019; 363 adults with ADHD): alpha 0.91, poor factor fit (CFI 0.67), correlation 0.53 with BDI-II depression scores. Japanese version (Takeda et al. 2017): subscale alpha about 0.80, floor effects in the Risk domain. No adult cut-off derived from accuracy studies has been published.",
    pitfalls: [
      "Not specific to ADHD: depression and anxiety raise scores in every domain.",
      "The stem asks about 'emotional or behavioural problems', so a depressive episode or a current crisis can drive the whole profile. Ask what caused each problem.",
      "The domain rule is a clinical convention from DSM-IV practice, not a cut-off derived from adult accuracy studies.",
      "Domain means are unstable when only a few items are answered (for example a Work domain with most items not applicable).",
      "Self-rated impairment can be over- or under-reported. People with low insight, or whose families compensate, may score low.",
      "The Risk domain often shows floor effects. A low Risk score does not mean low risk.",
      "Mark School or Work as not applicable when they do not apply; scoring them 0 lowers the means."
    ],
    adhdNotes: "Use the domain profile to steer the impairment questions and to show the patient where help is needed. NICE and DSM-5-TR need impairment in at least 2 settings, and UKAAN warns that high achievement in one area does not rule out impairment elsewhere. Repeat the scale after treatment starts: change in functioning matters as much as change in symptoms.",
    licence: "© Margaret Danielle Weiss MD PhD. The form states that the scale can be used by clinicians and researchers free of charge and can be posted on the Internet or replicated as needed; Dr Weiss asks to be contacted (address on the form) before it is posted on the Internet, used in research or translated. The 2011 instructions add that it must remain as published, without modification. RCPsych CR235 (2023) lists W-FIRS as pay per use, which conflicts with the author's own statement; the author's statement is followed here. The items are reproduced unmodified and the official CADDRA PDF is redistributed under that permission; contact Dr Weiss as a courtesy before public release. The CADDRA scoring guide is CADDRA copyright, so its rule is restated here in the app's own words.",
    source: "Weiss MD. Weiss Functional Impairment Rating Scale, Self-Report (WFIRS-S). CADDRA form. Scoring: CADDRA ADHD TrEAT WFIRS-S scoring guide (2025); CADDRA WFIRS instructions (2011). Canu WH et al. J Atten Disord 2020;24:1648.",
    url: "https://www.caddra.ca/wp-content/uploads/WFIRS-S.pdf",
    file: "tools/wfirs.pdf"
  },

  /* ------------------------------------------------------------------ DIVA-5 */
  {
    id: "diva5", abbr: "DIVA-5", name: "Diagnostic Interview for ADHD in Adults, version 5",
    group: "adhd-interview", stage: ["interview", "collateral", "diagnosis"],
    who: "Clinician, with the patient and ideally a partner and/or parent present", time: "About 1 to 1.5 hours",
    ages: "Adults. Young DIVA-5 covers ages 5-17; DIVA-5 ID is for adults with intellectual disability.", ageMin: 18, ageMax: 120, items_n: 18,
    purpose: "Semi-structured interview for the DSM-5 diagnosis of ADHD in adults, from the DIVA Foundation (Kooij and colleagues, 2019). It asks about each of the 18 DSM-5 symptoms in adulthood and in childhood, with examples to probe, then about onset and impairment in five areas of life, with input from informants.",
    when: "The core of the diagnostic interview (Inattention, Hyperactivity-impulsivity, Onset and Collateral steps), after a full psychiatric history and mental state examination. UKAAN's quality standard names DIVA, CAADID or ACE+ as recommended interview schedules; an experienced assessor may use their own style if every DSM criterion is explored. It covers ADHD only, so co-occurring conditions need separate assessment.",
    how: "For each symptom, ask first about adulthood and then about childhood. Let the patient describe the problem in their own words and give examples before you use the listed examples to probe. Score a symptom as present only when it is more frequent or severe than in peers, or clearly impairing. Ask the informant to confirm or add examples. Then record onset, impairment in each life area for both periods, and the totals on the score form.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Adult threshold: 5 or more symptoms of inattention and/or hyperactivity-impulsivity (the DSM-5 rule from age 17).",
      "Childhood: the DIVA Foundation's statements differ. An adjustment note (March 2019) takes 'several symptoms before 12' as 3 or more in either domain, while the current instructions page says at least 6. Check the score form in your purchased copy and apply DSM-5-TR: several symptoms before age 12.",
      "Impairment is recorded in five areas of life for both periods. NICE expects at least moderate impairment in 2 or more settings.",
      "Collateral support is recorded from parents or siblings, a partner or friend, and school reports.",
      "The score form summarises symptom counts. The diagnosis is a clinical judgement that also needs criterion E: no better explanation."
    ],
    psychometrics: "DIVA 2.0, the DSM-IV predecessor, agreed 100% with CAADID diagnoses in 40 adult outpatients (Ramos-Quiroga et al. 2019). DIVA-5 validation studies have been published in Korean, Farsi and Italian samples (DIVA Foundation validation page).",
    pitfalls: [
      "Examples can lead. Ask open questions first and use examples only to probe. RCPsych CR235 cautions against making the first appointment solely a semi-structured interview.",
      "Ticking examples is not the same as establishing a symptom. Confirm frequency, persistence since childhood and impairment.",
      "It does not detect feigning. In one clinic study, 71% of patients with non-credible effort would have been diagnosed from the interview alone (Marshall et al. 2016).",
      "It does not cover co-occurring conditions. The DIVA Foundation notes comorbidity in about 75% of people with ADHD.",
      "Childhood recall without informants or records is weak evidence."
    ],
    adhdNotes: "This app's interview follows a DIVA-like structure (adulthood then childhood for each symptom, examples, onset, impairment areas and collateral rated 0, 1 or 2), but all questions and examples are original and it is not DIVA. Clinicians who own DIVA-5 can use it alongside the app and record their conclusions here.",
    licence: "© DIVA Foundation. €10 one-off payment per clinician; after payment the interview may be stored for personal use only and distribution is prohibited. Organisations pay per clinician. Online platforms need a contract (set-up €650 plus €4.95 per download), must reproduce the interview word for word, and may not turn it into an AI interview, chatbot, automated diagnostic interview or any system that reformulates, adapts, interprets or generates DIVA content. Not reproduced or redistributed here.",
    source: "Kooij JJS, Francken MH, Bron TI. DIVA-5: Diagnostic Interview for ADHD in Adults. DIVA Foundation, The Hague, 2019. DIVA Foundation website (copyright, commercial-use, instructions and validation pages, October 2026).",
    url: "https://www.divacenter.eu/diva-5/what-is-diva-5/",
    file: null
  },

  /* ------------------------------------------------------------------ DIVA 2.0 */
  {
    id: "diva2", abbr: "DIVA 2.0", name: "Diagnostic Interview for ADHD in Adults, version 2.0 (DSM-IV)",
    group: "adhd-interview", stage: ["interview", "collateral", "diagnosis"],
    who: "Clinician, with the patient and, where possible, a relative or partner who can describe childhood and current behaviour", time: "About 1.5 hours",
    ages: "Adults", ageMin: 18, ageMax: 120, items_n: 18,
    purpose: "The 2010 DSM-IV version of the DIVA (Kooij and Francken, DIVA Foundation). Same structure as DIVA-5: the 18 symptoms in adulthood and childhood with examples, age of onset, impairment in five areas of life and collateral information. DIVA-5 replaced it in 2019, but it is still found in older reports and some services, and CADDRA 4.1 offers it as an interview option.",
    when: "You will meet it in earlier assessments and in services that have not moved to DIVA-5. If you use it now, apply DSM-5-TR rules instead of the DSM-IV rules printed on the form.",
    how: "Each symptom is asked about for adulthood (the last 6 months or more) and for childhood (ages 5-12). The onset section asks whether symptoms were present before age 7, the DSM-IV rule. The score form counts symptoms for each period and rates collateral support from parents or siblings, a partner or friend, and school reports as 0, 1 or 2.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "DSM-IV thresholds on the form: 6 or more symptoms in a domain, for both adulthood and childhood. A footnote cites research supporting 4 or more in adults.",
      "For a DSM-5-TR diagnosis, re-read the result: 5 or more current symptoms from age 17, several symptoms before age 12 (not 7), and impairment in at least 2 settings.",
      "If the presentation differs between childhood and adulthood, the form says the current adult presentation decides.",
      "This app can show your interview data as a DIVA 2.0-style score summary, for comparison with older reports."
    ],
    psychometrics: "Ramos-Quiroga et al. 2019: in 40 adult outpatients, DIVA 2.0 diagnoses agreed 100% with the CAADID. The European Consensus (Kooij et al. 2019) notes validation in two European populations.",
    pitfalls: [
      "The DSM-IV rules (onset before 7, 6 adult symptoms) are out of date. Do not apply them to a current diagnosis.",
      "Same risks as DIVA-5: leading examples, tick-box scoring and no check on symptom validity.",
      "Covers ADHD only. Assess co-occurring conditions separately."
    ],
    adhdNotes: "When you review an earlier DIVA 2.0 report, check whether 'not met' was due to the old onset-before-7 rule or the 6-symptom adult threshold. Someone below the DSM-IV threshold may meet DSM-5-TR criteria now. Do not copy DIVA 2.0 wording into your reports or templates.",
    licence: "© DIVA Foundation (2010). RCPsych CR235 (2023) states that the DSM-IV version is free. The 2010 PDF gives no permission to reproduce, contains DSM-IV-TR text reprinted with APA permission, and states that no rights may be derived from it, so it is treated as copyrighted. Not reproduced or redistributed here. Current availability of the download from the DIVA Foundation was not confirmed in October 2026.",
    source: "Kooij JJS, Francken MH. DIVA 2.0: Diagnostic Interview for ADHD in Adults. DIVA Foundation, The Hague, 2010. Ramos-Quiroga JA et al. J Atten Disord 2019;23:1126. CADDRA Canadian ADHD Practice Guidelines 4.1 (2020).",
    url: "https://www.divacenter.eu/",
    file: null
  },

  /* ------------------------------------------------------------------ ACE+ */
  {
    id: "aceplus", abbr: "ACE+", name: "ADHD Child Evaluation for Adults (ACE+ v.2)",
    group: "adhd-interview", stage: ["pre", "interview", "collateral", "diagnosis"],
    who: "Clinician, with the patient and ideally an informant present. Self-report (ACE+SR) and informant (ACE+IR) pre-assessment questionnaires are available.",
    time: "Not stated in the sources reviewed; plan for a full semi-structured interview",
    ages: "Adults. The author's site describes ACE+ v.2 for people over 17; a 2020 UK consensus lists ACE+ for age 16 and over. ACE v.2 covers children and young people aged 5-16.", ageMin: 17, ageMax: 120, items_n: 18,
    purpose: "Free semi-structured interview by Professor Susan Young covering the ADHD criteria of both DSM-5 and ICD-11, for adulthood and childhood. Self and informant questionnaires (ACE+SR and ACE+IR) gather childhood and recent behaviour before the appointment.",
    when: "A free alternative to DIVA-5 for the core interview (Inattention, Hyperactivity-impulsivity, Onset and Collateral steps). UKAAN's quality standard lists it with DIVA and CAADID as a recommended interview. Send the ACE+SR and ACE+IR before the appointment if you use them.",
    how: "Download the interview and questionnaires from the author's site after a free registration. Work through each symptom for adulthood and childhood with open questions and examples, involve an informant where possible, and use the summary to check each DSM-5 or ICD-11 criterion.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Apply DSM-5-TR or ICD-11 rules: count the symptoms present in each period, then confirm onset, pervasiveness, impairment and no better explanation. Use the form's own summary sheet.",
      "The ACE+SR and ACE+IR cover childhood (up to 12) and recent behaviour. Treat them as information for the interview, not as a score.",
      "The same site offers related free tools, including the ALFI, B-BAARS and RATE scales and an adult ADHD differential diagnosis checklist (ADHD-DD)."
    ],
    psychometrics: "Validation data were not reviewed for this app. ACE+ is recommended in UK consensus documents (UKAAN AQAS 2024; RCPsych CR235 2023; Young et al. 2020). Check the author's site for current evidence.",
    pitfalls: [
      "As with any semi-structured interview, avoid closed, leading questions and tick-box use (UKAAN AQAS).",
      "Make sure you have the current version (v.2), which maps to both DSM-5 and ICD-11.",
      "Covers ADHD criteria only. A full psychiatric assessment is still needed."
    ],
    adhdNotes: "A good choice when your service cannot buy DIVA-5 licences, and useful because it maps to both DSM-5 and ICD-11. Whichever interview you use, record clear real-life examples for every symptom you score as present.",
    licence: "Free. UKAAN states that ACE+ is free to download and distribute; RCPsych CR235 (2023) says it is free to download and use. The download needs a no-cost registration at psychology-services.uk.com. Terms for embedding or adapting it in software were not checked, so its wording is not reproduced here. No PDF is redistributed because the file sits behind the registration form and was not obtained.",
    source: "Young S. ACE+ v.2: ADHD Child Evaluation for Adults. Psychology Services Ltd. Recommended in Adamou M et al. The adult ADHD assessment quality assurance standard. Front Psychiatry 2024;15:1380410, and RCPsych CR235 (2023).",
    url: "https://www.psychology-services.uk.com/adhd.htm",
    file: null
  },

  /* ------------------------------------------------------------------ CAARS 2 */
  {
    id: "caars2", abbr: "CAARS 2", name: "Conners Adult ADHD Rating Scales, 2nd Edition",
    group: "adhd-rating", stage: ["pre", "collateral", "followup"],
    who: "Self-report and observer forms (for example a partner). Publisher qualification level B.",
    time: "Full form 10-20 minutes; CAARS 2-Short 5-10 minutes; CAARS 2-ADHD Index 1-3 minutes", ages: "18 and over", ageMin: 18, ageMax: 120, items_n: null,
    purpose: "Commercial rating scale of current adult ADHD symptoms and related problems (MHS, 2023; Conners, Erhardt and Sparrow). It gives content scales, DSM-5-TR symptom scales, an ADHD Index and response-style (validity) indexes, with US and Canadian norms.",
    when: "Optional, if your service holds a licence. Use it before the appointment for self and observer baseline data, to compare the patient's view with a partner's, and to look at response style when symptom validity is in question (Validity step). Repeat it for monitoring. Like other self-report scales it supports the diagnosis but does not make it.",
    how: "Administer online through MHS or on paper, by a qualified user. Choose the full, short or ADHD Index version, and use self and observer forms where possible. Read the response-style analysis first, then the scale T-scores.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Read validity first. The Response Style Analysis reports a Negative Impression Index, an Inconsistency Index, omitted items and pace. In the CAARS 2-Short sample report, a Negative Impression score of 6 or more warrants follow-up, and fewer than 1 item per minute is unusually slow.",
      "Content scales: Inattention/Executive Dysfunction, Hyperactivity, Impulsivity, Emotional Dysregulation and Negative Self-Concept, plus DSM-5-TR symptom scales and impairment and functional outcome items.",
      "T-scores: 70 or more very elevated; 65-69 elevated; 60-64 slightly elevated; below 60 not elevated.",
      "The ADHD Index (12 items) is reported as a probability: very high 90-99%, high 60-89%, borderline 40-59%, low 10-39%, very low 1-9%.",
      "Clinical-concern items (suicidality, self-harm, anxiety, sadness) must be reviewed and taken into the risk assessment."
    ],
    psychometrics: "MHS manual data (2024 brochure): normative sample of 2,640 adults from the US and Canada; median omega 0.94 and median test-retest r 0.92 for self-report; effect size d 2.24 between ADHD and the general population (self-report). For the original CAARS, an embedded Infrequency Index (21 or more) had sensitivity 17-50% and specificity 86-95% for non-credible responding across studies (reviewed in Becke et al. 2021).",
    pitfalls: [
      "Self-report scales are easy to fake: coached simulators produced ADHD-like profiles on the original CAARS (Sollman et al. 2010).",
      "Elevated scores are common in depression, anxiety, trauma and personality disorders, so elevation is not specific to ADHD.",
      "Norms are North American.",
      "Do not let a T-score decide the diagnosis. UKAAN's standard treats self-rated symptom scales as baseline data.",
      "The original CAARS (1999) and CAARS 2 have different scales and indexes. Do not mix their cut-offs."
    ],
    adhdNotes: "Most useful for comparing self and observer views, tracking change, and its built-in validity indexes. A very elevated profile with a raised Negative Impression Index calls for a closer look at validity, not an automatic diagnosis. Record CAARS 2 validity results in the Validity step.",
    licence: "Proprietary (Multi-Health Systems). Qualification level B; sold per form or report through MHS. Items and norms may not be reproduced. Not reproduced here.",
    source: "Conners CK, Erhardt D, Sparrow E. Conners Adult ADHD Rating Scales, 2nd Edition (CAARS 2). Multi-Health Systems, 2023. MHS CAARS 2 brochure (2024) and CAARS 2-Short self-report sample report. Becke M et al. J Neural Transm 2021.",
    url: "https://storefront.mhs.com/collections/caars-2",
    file: null
  },

  /* ------------------------------------------------------------------ BAARS-IV */
  {
    id: "baars4", abbr: "BAARS-IV", name: "Barkley Adult ADHD Rating Scale-IV",
    group: "adhd-rating", stage: ["pre", "collateral", "followup"],
    who: "Self-report and other-report forms (for example a partner or parent); clinician interview versions", time: "Quick Screen 3-5 minutes; long forms 5-7 minutes",
    ages: "18-89", ageMin: 18, ageMax: 89, items_n: null,
    purpose: "Commercial rating scale by Russell Barkley (Guilford, 2011) for current and childhood DSM-IV ADHD symptoms in adults. It has self and other-report forms for current and for childhood symptoms, a Quick Screen, interview versions, and items on sluggish cognitive tempo.",
    when: "Optional pre-assessment scale for current and retrospective childhood symptoms, from the patient and from someone who knows them. In the RCPsych 2017 pathway, Barkley scales are handed out at the first appointment and reviewed at the next. It supports the interview but does not replace it.",
    how: "Give the self and other-report forms for current symptoms and, where possible, the childhood forms to the patient and to a parent or older relative. Score with the age-banded score sheets.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Scores are compared with age-banded norms (18-39, 40-59, 60-89) on the score sheets.",
      "Separate current and childhood forms let you compare the patient's and an informant's view of both periods.",
      "The sluggish cognitive tempo items describe daydreaming, mental fogginess and slowness. They are not DSM ADHD symptoms and also rise with depression and sleep problems.",
      "Item counts and cut-offs are set out in the manual (not verified for this app)."
    ],
    psychometrics: "Publisher information covers ages 18-89 with age-banded norms. A modified BAARS-IV reached at least 80% sensitivity and specificity in adult prisoners (AADPA 2022 evidence review). Detailed psychometrics are in the manual and were not reviewed for this app.",
    pitfalls: [
      "DSM-IV wording.",
      "Self and other-report scales can be over-endorsed, and family informants may have ADHD themselves.",
      "Retrospective childhood ratings share the recall bias of all childhood scales."
    ],
    adhdNotes: "Useful when you want structured informant ratings for both childhood and adulthood. Treat differences between the self and other reports as questions for the interview.",
    licence: "Proprietary (Guilford Press). Purchase required; a limited photocopy licence lets purchasers reproduce the forms for their own use. RCPsych CR235 lists the Barkley childhood and current symptom scales as a one-off payment. Not reproduced here.",
    source: "Barkley RA. Barkley Adult ADHD Rating Scale-IV (BAARS-IV). New York: Guilford Press, 2011.",
    url: "https://www.guilford.com/books/Barkley-Adult-ADHD-Rating-Scale-IV-BAARS-IV/Russell-Barkley/9781609182038",
    file: null
  },

  /* ------------------------------------------------------------------ BRIEF-A */
  {
    id: "brief_a", abbr: "BRIEF-A", name: "Behavior Rating Inventory of Executive Function, Adult Version",
    group: "cognition", stage: ["pre", "diagnosis"],
    who: "Self-report and informant forms. Publisher qualification level B.", time: "10-15 minutes",
    ages: "18-90 (BRIEF2A: 18-99)", ageMin: 18, ageMax: 90, items_n: 75,
    purpose: "Rating scale of everyday executive function (PAR; Roth, Isquith and Gioia). Its 75 items give 9 clinical scales, a Behavioral Regulation Index, a Metacognition Index and a Global Executive Composite, with three validity scales. The newer BRIEF2A has 70 items.",
    when: "Not part of the core ADHD assessment. Use it when you need a profile of everyday executive problems: when the diagnosis is uncertain, when brain injury, cognitive decline or a learning disorder is in the differential, or to plan support. It cannot diagnose ADHD.",
    how: "The patient completes the self form and a partner or relative completes the informant form. Score with the publisher's software or manual, and check the validity scales first.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Validity scales: Negativity, Inconsistency and Infrequency. Read them before the clinical scales.",
      "Clinical scales: Inhibit, Self-Monitor, Shift and Emotional Control make up the Behavioral Regulation Index; Initiate, Working Memory, Plan/Organize, Task Monitor and Organization of Materials make up the Metacognition Index.",
      "Raised scores show everyday executive difficulty. This is common in ADHD but also in depression, anxiety, brain injury, autism and other conditions."
    ],
    psychometrics: "Psychometric details are in the publisher's manual and were not reviewed for this app.",
    pitfalls: [
      "Executive problems are not specific to ADHD and are not a DSM-5-TR criterion.",
      "Rating scales and performance tests of executive function often disagree because they measure different things (clinical practice).",
      "Normal scores do not rule out ADHD."
    ],
    adhdNotes: "Can add a picture of strengths and difficulties to the formulation and help with workplace or study adjustments. Do not use it as evidence for criterion A.",
    licence: "Proprietary (PAR). Qualification level B; purchase required. Not reproduced here.",
    source: "Roth RM, Isquith PK, Gioia GA. Behavior Rating Inventory of Executive Function, Adult Version (BRIEF-A). Lutz, FL: PAR, 2005. PAR product pages for BRIEF-A and BRIEF2A.",
    url: "https://www.parinc.com/products/BRIEF-A",
    file: null
  },

  /* ------------------------------------------------------------------ BDEFS */
  {
    id: "bdefs", abbr: "BDEFS", name: "Barkley Deficits in Executive Functioning Scale for Adults",
    group: "cognition", stage: ["pre", "diagnosis"],
    who: "Self-report and other-report forms", time: "Long form about 15-20 minutes; short form 4-5 minutes",
    ages: "18-81", ageMin: 18, ageMax: 81, items_n: null,
    purpose: "Barkley's rating scale of executive functioning in daily life (Guilford, 2011). Long and short forms for self and other report; the long form includes an ADHD risk index.",
    when: "Optional, when executive problems need describing for the formulation or support planning, or when another cause of executive difficulty is in the differential. It is not a diagnostic test for ADHD.",
    how: "The patient completes the self form and, if possible, a partner completes the other-report form. Score against the manual's norms.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "The long form covers several areas of daily executive function: managing time, organisation and problem-solving, self-restraint, self-motivation and regulating emotions.",
      "The ADHD risk index on the long form flags an executive profile that resembles adult ADHD. It is a screen, not a diagnosis.",
      "Item counts are often quoted as 89 (long form) and 20 (short form); check the manual, as these were not verified for this app."
    ],
    psychometrics: "Norms cover ages 18-81 (publisher information). Detailed psychometrics are in the manual and were not reviewed for this app.",
    pitfalls: [
      "Executive problems also occur in depression, sleep disorders, brain injury and cognitive decline.",
      "Self-report, so open to over- and under-reporting.",
      "Normal scores do not rule out ADHD."
    ],
    adhdNotes: "Useful for describing the everyday consequences of ADHD in a report and for planning coaching and adjustments. Do not count its scores as DSM symptoms.",
    licence: "Proprietary (Guilford Press). Purchase required; purchasers may photocopy the forms for their own use. Not reproduced here.",
    source: "Barkley RA. Barkley Deficits in Executive Functioning Scale (BDEFS for Adults). New York: Guilford Press, 2011.",
    url: "https://www.guilford.com/books/Barkley-Deficits-Executive-Functioning-Scale-BDEFS-Adults/Russell-Barkley/9781606239346",
    file: null
  },

  /* ------------------------------------------------------------------ Brown EF/A */
  {
    id: "brown_efa", abbr: "Brown EF/A", name: "Brown Executive Function/Attention Scales",
    group: "adhd-rating", stage: ["pre", "followup"],
    who: "Self-report for adults (from age 19); other forms cover children and adolescents", time: "10-15 minutes",
    ages: "3 years to adult", ageMin: 3, ageMax: 120, items_n: null,
    purpose: "Pearson's 2019 successor to the Brown ADD Scales (Thomas E. Brown). It rates executive function problems linked to ADHD in six clusters (Activation, Focus, Effort, Emotion, Memory and Action) with a total composite.",
    when: "Optional, if your service uses it, as baseline data on executive and attention problems before the interview and for monitoring. It supports the diagnosis but does not make it.",
    how: "Administer on paper or through Pearson Q-global and score against age norms.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Six cluster scores (Activation, Focus, Effort, Emotion, Memory, Action) and a total composite.",
      "Higher scores mean more reported difficulty. Interpret them with the manual's norms.",
      "The clusters follow Brown's executive function model of ADHD, which is broader than the DSM-5-TR criteria."
    ],
    psychometrics: "Psychometric details are in the publisher's manual and were not reviewed for this app. The adult self-report item count was not verified.",
    pitfalls: [
      "Not DSM-based. High scores also occur in depression, anxiety and sleep problems.",
      "Self-report, so open to over- and under-reporting."
    ],
    adhdNotes: "Can help describe the everyday impact of ADHD, especially problems with getting started and with emotions, which the DSM criteria do not cover. Do not count its clusters as DSM symptoms.",
    licence: "Proprietary (Pearson). Purchase required; RCPsych CR235 lists the earlier Brown ADD Scales as pay per use. Not reproduced here.",
    source: "Brown TE. Brown Executive Function/Attention Scales (Brown EF/A Scales). Pearson, 2019. Pearson information sheet 'The basics of Brown EF/A Scales'.",
    url: "https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/brown-efa/the-basics-of-brown-ef-a-scales-infographic.pdf",
    file: null
  },

  /* ------------------------------------------------------------------ CAADID */
  {
    id: "caadid", abbr: "CAADID", name: "Conners' Adult ADHD Diagnostic Interview for DSM-IV",
    group: "adhd-interview", stage: ["pre", "interview", "diagnosis"],
    who: "Clinician. Part I (history) can be completed by the patient beforehand or as an interview.", time: "Not stated in the sources reviewed",
    ages: "Adults (18 and over)", ageMin: 18, ageMax: 120, items_n: 18,
    purpose: "Commercial semi-structured interview (Epstein, Johnson and Conners; MHS, 2001). Part I covers background and developmental history. Part II covers the DSM-IV ADHD criteria: symptoms in adulthood and childhood, age of onset, pervasiveness, impairment and whether another disorder explains the symptoms.",
    when: "An alternative core interview (Inattention, Hyperactivity-impulsivity, Onset and Collateral steps) for services that hold a licence. UKAAN's quality standard lists it with DIVA and ACE+. It is often used as the reference standard in research.",
    how: "Send Part I before the appointment or complete it as an interview. In Part II rate each symptom for adulthood and childhood using the prompts, then work through onset, settings, impairment and exclusions. Apply DSM-5-TR thresholds rather than the DSM-IV rules.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Built on DSM-IV. Re-apply DSM-5-TR rules: 5 or more current symptoms from age 17 and several symptoms before age 12. Researchers have used CAADID data to apply the DSM-5 rules (van de Glind et al. 2013).",
      "The diagnosis comes from all the criteria together, not from the symptom count alone."
    ],
    psychometrics: "Epstein and Kollins 2006: test-retest kappa 0.67 for the adult diagnosis and 0.69 for the childhood diagnosis (n = 30). Reference standard for the ASRS in 1,138 patients in substance use treatment across 10 countries (van de Glind et al. 2013). DIVA 2.0 diagnoses agreed with CAADID diagnoses in 40 outpatients (Ramos-Quiroga et al. 2019).",
    pitfalls: [
      "DSM-IV wording and thresholds.",
      "No check on symptom validity.",
      "Covers ADHD only. Assess co-occurring conditions separately."
    ],
    adhdNotes: "If your service uses it, make sure the DSM-5-TR thresholds are applied and that every symptom scored as present has real examples.",
    licence: "Proprietary (Multi-Health Systems); RCPsych CR235 lists it as pay per use. In October 2026 the MHS online storefront returned no results for CAADID, so check current availability with the publisher. Not reproduced here.",
    source: "Epstein J, Johnson DE, Conners CK. Conners' Adult ADHD Diagnostic Interview for DSM-IV (CAADID). Multi-Health Systems, 2001. Epstein JN, Kollins SH. J Atten Disord 2006;9:504-514.",
    url: "https://mhs.com/",
    file: null
  },

  /* ------------------------------------------------------------------ AISRS */
  {
    id: "aisrs", abbr: "AISRS", name: "Adult ADHD Investigator Symptom Rating Scale",
    group: "adhd-rating", stage: ["interview", "followup"],
    who: "Clinician-rated, using semi-structured prompts", time: "Not stated in the sources reviewed",
    ages: "Adults", ageMin: 18, ageMax: 120, items_n: 18,
    purpose: "Clinician-rated scale of the 18 DSM ADHD symptoms (Spencer, Adler and colleagues, 2010). Each item has prompts and anchors so that ratings are consistent between raters. It gives inattention and hyperactive-impulsive subscales and is used mainly to measure severity and change in treatment studies.",
    when: "Not needed for diagnosis. Use it, if licensed, to rate symptom severity at baseline and to track response to treatment with a clinician rating rather than self-report.",
    how: "Interview the patient with the scale's prompts for each symptom and rate severity against the anchors. Add up the item scores for the total and subscales.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "Higher totals mean more severe current symptoms. Use change from baseline to judge treatment response.",
      "Silverstein et al. 2019 (297 adults, 171 with ADHD) reported that 18-item AISRS totals of 23-26 suggested a high likelihood of adult ADHD. An expanded version adds executive function and emotional control items.",
      "Each of the 18 items is rated 0 (none) to 3 (severe), so the total runs from 0 to 54 and each subscale (inattention, hyperactivity-impulsivity) from 0 to 27 (Iwanami et al. 2026; NIDA Data Share)."
    ],
    psychometrics: "Spencer et al. 2010: high internal consistency and sensitivity to change with medication. Silverstein et al. 2019 (297 people, 171 with ADHD, referred and primary care samples): high alpha; 95th-centile cut-offs of 23 (non-ADHD referrals) and 26 (pilot norms) for the 18-item total. Iwanami et al. 2026 (Japanese version, 61 adults with ADHD): alpha 0.83, test-retest ICC 0.77, inter-rater G coefficient 0.96, correlation 0.89 with the ASRS.",
    pitfalls: [
      "Rating quality depends on training.",
      "Not a diagnostic interview: it does not check onset, pervasiveness or other explanations."
    ],
    adhdNotes: "A clinician rating is less open to over-endorsement than self-report and gives a better baseline record of severity. Pair it with a functional measure such as the WFIRS-S.",
    licence: "Copyrighted and not open access (European Consensus 2019). Translators have had to obtain formal permission from the copyright holder (Iwanami et al. 2026), and NYU licenses the related adult ADHD scales; the AISRS terms and fees were not verified. Not reproduced here.",
    source: "Spencer TJ, Adler LA, Qiao M, et al. Validation of the Adult ADHD Investigator Symptom Rating Scale (AISRS). J Atten Disord 2010;14:57-68. Silverstein MJ et al. J Atten Disord 2019;23:1101-1110. Iwanami A et al. Reliability and convergent validity of the AISRS-Japanese. Front Psychiatry 2026 (PMC13457393).",
    url: "https://pubmed.ncbi.nlm.nih.gov/19794135/",
    file: null
  },

  /* ------------------------------------------------------------------ WSR-II */
  {
    id: "wsr2", abbr: "WSR-II", name: "Weiss Symptom Record II",
    group: "other", stage: ["pre", "comorbid", "risk"],
    who: "The adult, a partner, a parent or a teacher (CADDRA toolkit); the form has a box to name the informant", time: "Not stated by the author",
    ages: "All ages (some items, such as wetting and soiling, apply to children)", ageMin: 0, ageMax: 120, items_n: null,
    purpose: "Free broad problem checklist from the CADDRA toolkit. Each item is rated none (0), mild (1), moderate (2), severe (3) or not applicable. Sections cover attention, hyperactivity-impulsivity, oppositional and conduct problems, development and learning, autism spectrum, motor problems such as tics, psychosis, depression, mood regulation, suicide, anxiety, stress and trauma, sleep, eating, substance use, other addictions and personality traits.",
    when: "Before the first appointment (Co-occurring conditions screen step), as a broad screen for conditions that co-occur with or mimic ADHD. CADDRA uses it for general mental health screening before the ADHD-specific assessment. Follow up every flagged section with a specific tool or interview, and review any suicide item before the patient leaves.",
    how: "Give the form to the patient and, if helpful, to a partner or parent. Review every item rated moderate or severe, and any rating in the risk-related sections.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "There is no total score. CADDRA's 2018 toolkit counts the items rated moderate or severe (2 or 3) in each section. Screening cut-offs: adult ADHD 5 or more in the attention section or in the hyperactivity-impulsivity section; oppositional 4; conduct 3; depression 5; persistent depressive disorder 2; mood regulation 3.",
      "Any moderate or severe rating in the development, motor, psychosis, suicide, autism spectrum, stress, sleep, substance use or addictions sections, or in the last 5 personality items, counts as 'at risk' and needs exploring. The first 6 personality items screen for borderline personality disorder.",
      "Ask about any suicide item rated above none and assess risk the same day (clinical practice).",
      "These thresholds come from the 2018 toolkit. Check them against the current form (July 2022 version)."
    ],
    psychometrics: "A clinical screening checklist. No validation data were found for this app.",
    pitfalls: [
      "It screens only. Several sections share features with ADHD (poor concentration, sleep problems, irritability).",
      "Self-rated, so it depends on insight and candour."
    ],
    adhdNotes: "A quick broad sweep for differentials and co-occurring conditions that maps well onto this app's differential list. Use specific tools (for example PHQ-9, GAD-7, MDQ, AUDIT, AQ-10) for anything it flags.",
    licence: "© Margaret Danielle Weiss MD PhD. The form states that the scale can be used by clinicians and researchers free of charge and can be posted on the Internet or replicated as needed; Dr Weiss asks to be contacted (address on the form) before it is posted on the Internet, used in research or translated. The official CADDRA PDF is redistributed unmodified under that permission; contact Dr Weiss as a courtesy before public release. Items are not built into the app because there is no validated scoring to automate.",
    source: "Weiss MD. Weiss Symptom Record II (WSR-II). CADDRA form, July 2022. Scoring guidance: CADDRA Canadian ADHD Practice Guidelines toolkit (2018).",
    url: "https://www.caddra.ca/wp-content/uploads/WSR-II_July-11-2022.pdf",
    file: "tools/wsr2.pdf"
  },

  /* ------------------------------------------------------------------ QbTest */
  {
    id: "qbtest", abbr: "QbTest", name: "QbTest (continuous performance test with motion tracking)",
    group: "objective", stage: ["diagnosis"],
    who: "Patient performs a computer test; set up and interpreted by trained staff", time: "One computer test session (length set by the manufacturer)",
    ages: "Norms 6-60. NICE recommends it as an option only for ages 6-17.", ageMin: 6, ageMax: 17, items_n: null,
    purpose: "A computerised continuous performance test combined with infrared tracking of head movement (Qbtech). It reports measures of attention, impulsivity and activity compared with age and sex norms.",
    when: "Children and young people (6-17): NICE NG87 (updated May 2025) lists QbTest as an option to help diagnose ADHD at these ages, and HTG729 recommends it only alongside standard clinical assessment (1.1). If your service uses it, record the result and who interpreted it in the notes; it never decides the diagnosis. Adults: not recommended for diagnosis. HTG729 says more research is needed in people 18 and over (1.2). Use for that purpose should be funded by the company, by research or from non-core NHS budgets (1.5). If an adult brings a QbTest report, record it but do not let it decide the diagnosis.",
    how: "Administered by trained staff following the manufacturer's protocol. The report compares the results with norms.",
    interactive: false, items: [], scoring: null,
    interpretation: [
      "In adults, a normal result does not exclude ADHD and an abnormal result does not confirm it.",
      "Do not use it to judge response to medication either: NICE says more research is needed before QbTest is used to evaluate treatment response, at any age (HTG729 1.3).",
      "CADDRA notes that continuous performance test results overlap heavily between people with and without ADHD, and the European Consensus (2019) found neuropsychological tests insufficient for diagnosis."
    ],
    psychometrics: "Adamou et al. 2022 (69 UK adult referrals): QbTest+ failed to differentiate adults with and without ADHD. Brunkhorst-Kanaan et al. 2020 (114 adults in a specialist clinic): only the activity measure differed (AUC 65%), and the authors concluded that such tests do not help identify ADHD in that setting. Systematic review: Tomlinson et al. 2025, Health Technol Assess 29(58). NICE's committee found limited evidence in adults and said evidence from under-18s does not generalise to adults.",
    pitfalls: [
      "Results depend on effort, sleep, medication, anxiety and other conditions.",
      "No built-in check of effort.",
      "Adult norms are not evidence of diagnostic accuracy."
    ],
    adhdNotes: "In children and young people, a QbTest result is one piece of evidence, weighed with the parent and teacher accounts, school information and the interview. In adults, base the diagnosis on the clinical interview, collateral history and records, and treat a QbTest result as a research-grade observation only.",
    licence: "Commercial medical device (Qbtech); NICE lists the cost as £31.20 per test excluding VAT. Not an item-based tool, so there is nothing to reproduce.",
    source: "NICE HTG729. Digital technologies for assessing attention deficit hyperactivity disorder (ADHD). 2024 (migrated from DG60 with recommendations unchanged). NICE NG87 1.3.1 (QbTest option for ages 6-17, added May 2025). Adamou M et al. J Atten Disord 2022; Brunkhorst-Kanaan N et al. Front Psychiatry 2020.",
    url: "https://www.qbtech.com/adhd-tests/qbtest/",
    file: null
  }
]);
