/* formsGuide: the pre-appointment forms guide (ARCHITECTURE.md 5.10).
   Teaches what each questionnaire, informant form and record that is sent out or requested before an adult
   ADHD assessment is, why it is used, how to score and read it step by step, what each result means, a worked
   example, pitfalls, and how it feeds the assessment steps.
   UK practice (NICE NG87) is the default frame. Also cited: UKAAN AQAS 2024 (Adamou et al.), RCPsych CR235 (2023),
   European Consensus 2019 (Kooij et al.), CADDRA 4.1 (2020), AADPA 2022, NHSE ADHD Taskforce (2025), DHSC review (2026),
   ICD-11 CDDR, NICE CG142, CG185, NG222, NG225 and the instrument papers named in each entry.
   Instrument wording is not reproduced beyond short themes. Licensed tools (CAARS 2, BAARS-IV, ASRS-5 weighted scoring,
   STOP-Bang, Epworth) and tools whose reproduction licence is unconfirmed (MDQ, MSI-BPD) are described, not copied.
   DIVA wording is not used.
   Worked examples are fictional people. Prevalence figures marked 'illustrative' are teaching assumptions, not data.
   Sources: research briefs of 21 October 2026 (tools-adhd, tools-comorbid, guidelines-uk, guidelines-intl, ddx-evidence);
   Schiweck et al. 2021 meta-analysis (Neurosci Biobehav Rev 124:100-123) for bipolar disorder in adult ADHD. */
AA.add('formsGuide', {
  intro:
    "<p>Before the first appointment most services send questionnaires to the patient and, with consent, to people who know them, and ask for old school reports and records. " +
    "This guide explains each one: what it is, why it is sent, who completes it, how to score and read it step by step, what each result means and what to do next, with a worked example.</p>" +
    "<p><strong>One rule governs all of them.</strong> NICE NG87 1.3.2: a diagnosis of ADHD should not be made solely on rating scales or observational data; scales are helpful added tools. " +
    "The diagnosis rests on a full clinical and psychosocial assessment, a full developmental and psychiatric history, observer reports and a mental state assessment (NG87 1.3.1). " +
    "UKAAN's quality standard (AQAS 2024) goes further: self-report symptom scales are a <strong>baseline for measuring change</strong>, not a formative part of the diagnosis.</p>" +
    "<h4>What forms can and cannot do</h4>" +
    "<table><thead><tr><th>Forms can</th><th>Forms cannot</th></tr></thead><tbody>" +
    "<tr><td>Give a baseline for measuring change after treatment</td><td>Make or rule out the diagnosis</td></tr>" +
    "<tr><td>Point to symptoms, settings and impairments to probe at interview</td><td>Show that symptoms began before 12, unless written at the time</td></tr>" +
    "<tr><td>Flag co-occurring conditions, mimics and risk early</td><td>Tell you whether ADHD or another condition explains the picture</td></tr>" +
    "<tr><td>Bring in independent, contemporaneous evidence (school reports, records)</td><td>Rate impairment severity for you: that is the clinician's judgement</td></tr>" +
    "</tbody></table>" +
    "<h4>How to review a returned pack</h4>" +
    "<ol><li><strong>Safety first, the day it arrives:</strong> PHQ-9 item 9, suicide and self-harm items on any form, and free-text comments. See the C-SSRS entry.</li>" +
    "<li>ADHD self-report (ASRS, CAARS 2, BAARS-IV), then childhood recall (WURS-25), then impairment (WFIRS-S).</li>" +
    "<li>Informant forms, side by side with the patient's answers.</li>" +
    "<li>History questionnaire, school reports and previous records: build a dated timeline.</li>" +
    "<li>Co-occurring condition screens (WSR-II, PHQ-9, GAD-7, MDQ, AUDIT, DAST-10, AQ-10, PCL-5, MSI-BPD, STOP-Bang).</li>" +
    "<li>Write a short pre-assessment summary: what the forms suggest, what they cannot tell you, three to five hypotheses (including the main alternatives), and the questions that will test them at interview.</li></ol>" +
    "<p>The forms below follow the course of the assessment: ADHD self-report, childhood recall, impairment, informants, history and records, co-occurring conditions, then safety. Read the safety items first whenever a pack arrives. Each entry says which assessment step uses it.</p>",

  principles: [
    "Screening is not diagnosis. NICE NG87 1.3.2: never diagnose solely on rating scales; they are helpful added tools. The NHSE ADHD Taskforce (2025) adds that a positive screen is not enough for referral on its own, and a negative screen should not be used to exclude people.",
    "Self-report symptom scales are a baseline, not evidence for the diagnosis. UKAAN AQAS 2024: they consist of leading questions, and relying on them and on checklist interviewing risks confirmation bias. Record them, use them to plan the interview and to measure change later.",
    "Base rates decide what a score means. The same result has a different positive predictive value in different settings: in the 2024 Adult Psychiatric Morbidity Survey 13.9% of adults in England screened positive on ASRS Part A, while adult ADHD prevalence is estimated at about 2.5-2.8% (WFADHD 2021). In a specialist clinic, where prevalence is much higher, the same result is far more likely to be a true positive.",
    "A negative screen does not exclude ADHD. No screen has 100% sensitivity (ASRS Part A 68.7% in the original community study), and adults who compensate, have high ability, a mainly inattentive presentation or little insight often score low. Assess on the referral information, not on the score.",
    "Comorbidity inflates scores in both directions. Depression, anxiety, bipolar disorder, borderline personality disorder, trauma and substance use raise ADHD scales (ASRS specificity 0.66 in substance use treatment; WURS raised in mood and personality disorders; WFIRS raised by internalising symptoms). ADHD in turn raises other screens: PHQ-9 items 3, 4, 6, 7 and 8, GAD-7 items 4-6, AQ-10 items 3 and 4, PCL-5 items 15, 16, 19 and 20, and half of adults with ADHD screen positive on the MDQ. Read the items, not just the total.",
    "Mind the time window: trait versus state. ADHD is trait-like and present since childhood. Forms ask about different periods: WURS childhood; ASRS 6 months; WFIRS, PCL-5 and the C-SSRS ideation questions the last month; PHQ-9 and GAD-7 2 weeks; AUDIT and DAST-10 the past year. A high current score during a depressive episode, poor sleep or heavy substance use may be a state, not a trait.",
    "Contemporaneous evidence outweighs recall. Adult recall of childhood ADHD had a positive predictive value of only 0.27 at population prevalence (Mannuzza 2002). School reports and records written at the time carry more weight. ICD-11 advises caution when a pre-12 history cannot be corroborated, but NICE NG87 1.3.3 says an uncertain time of onset should not on its own exclude the diagnosis.",
    "Self-informant disagreement is information, not noise. Insight varies: the European Consensus 2019 notes that many adults report high symptoms with low impairment, or the reverse, and distress can inflate self-report. Informants may not see inner symptoms, may have known the person only briefly, or may have ADHD themselves (UKAP 2020). Explore every disagreement with concrete, dated examples.",
    "Check response style and validity. Self-report scales are easy to fake (Sollman 2010), and 15-31% of adults referred for ADHD give non-credible responses on validity testing in published series. Watch for almost every item at the maximum, rare or atypical symptoms, inconsistency between forms, and severe scores alongside good functioning in records. Do not accuse: triangulate, and record your reasoning in the validity step.",
    "Bring the results into the interview, not the other way round. Read every returned form before the appointment. Turn elevated items into open questions ('Tell me about the last time...') and ask for real-life examples, frequency, settings and childhood; never read items back as yes/no questions. Note which hypotheses the forms raised and which the interview confirmed.",
    "Act on safety items at once. A suicide or self-harm item or a safeguarding concern found in a pack needs a clinician's response before the appointment. Current cardiac symptoms (fainting or chest pain on exertion, sudden-onset palpitations) go to the GP promptly; any NG87 1.7.5 feature must be resolved, with a cardiology opinion, before medication is considered. Triage of returned forms should not rely on questionnaires alone (NHSE ADHD Taskforce Part 2, 2025, recommendation 10).",
    "Use the official version, scoring and licence. ASRS-5 is only validated with its licensed weighted scoring; the German WURS-k is not the WURS-25; CAARS 2 is not the original CAARS. Licensed tools are used within their licence, and norms from other countries, or mainly male samples, may not fit your patient (UKAP 2020 consensus on females)."
  ],

  forms: [
    /* ------------------------------------------------------------------ */
    /* ADHD self-report                                                    */
    /* ------------------------------------------------------------------ */
    {
      id: "asrs18", tool: "asrs18", title: "ASRS v1.1 Symptom Checklist (18 items)", kind: "self",
      what:
        "<p>The World Health Organization Adult ADHD Self-Report Scale, version 1.1 (Kessler et al. 2005). The patient rates how often 18 ADHD symptoms happened over the <strong>past 6 months</strong>, from Never (0) to Very often (4). The items follow the 18 DSM-IV criterion A symptoms, which DSM-5-TR kept.</p>" +
        "<p><strong>Part A</strong> (items 1-6) is the screener and the only part with a validated rule. <strong>Part B</strong> (items 7-18) has no total score or cut-off: it gives extra cues and probes for the interview. Each item has a 'shaded' range: the answers that count as clinically significant.</p>" +
        "<p><strong>Why it is sent:</strong> a quick, free screen; a list of symptoms to explore; and a <strong>baseline</strong> to measure change after treatment. It says nothing about childhood onset, pervasiveness, impairment or other causes.</p>",
      recommendedBy: [
        "NICE NG87 1.3.2: rating scales are helpful added tools, never the sole basis (NG87 names no adult scale)",
        "UKAAN AQAS 2024: self-report symptom scale as a baseline only (optional)",
        "RCPsych CR235 (2023) Box 3: ASRS listed as free; section 7 notes it was undiscriminating for triage in the working group's experience",
        "CADDRA 4.1 Step 1: ASRS for the patient and as an observer form",
        "European Consensus 2019 (Kooij) Table 2: open-access screener",
        "AADPA 2022 Box 2: ASRS Parts A and B"
      ],
      whenSent: "In the pre-appointment pack, so it is back before the first appointment. If the referrer sent only Part A, ask for all 18 items as the baseline.",
      who: "The patient. CADDRA also uses it as an observer form for a partner or close friend (see Informant forms).",
      time: "About 5 minutes (form instructions).",
      howToRead:
        "<ol><li>Check it is the official ASRS v1.1 wording, rated for the past 6 months. The printed form is shaded; PhenX advises removing the shading before the patient completes it, so note whether the patient could see which answers 'count'.</li>" +
        "<li><strong>Part A (items 1-6):</strong> mark each answer in the shaded range. Items 1, 2 and 3 count from 'Sometimes' upwards; items 4, 5 and 6 count from 'Often' upwards.</li>" +
        "<li>Count the shaded answers in Part A. <strong>4 or more = screen positive</strong>.</li>" +
        "<li><strong>Part B (items 7-18):</strong> no total and no cut-off. Mark the shaded answers: items 9, 12, 16 and 18 count from 'Sometimes'; items 7, 8, 10, 11, 13, 14, 15 and 17 count from 'Often'.</li>" +
        "<li>Optional profile (Adler 2019): count shaded inattention items (1-4 and 7-11) and shaded hyperactivity-impulsivity items (5, 6 and 12-18), each out of 9.</li>" +
        "<li>Optional baseline: add all 18 answers (0-72) and record it to measure change after treatment.</li>" +
        "<li>Look at the pattern: items at 'Very often', items left blank, and whether almost everything is at the maximum.</li>" +
        "<li>List the shaded items as interview probes. The mapping of ASRS items to DSM symptoms is approximate (only items 9, 12, 14 and 16 are confirmed by Ustun 2017).</li></ol>",
      meaning: [
        { result: "Part A: 4, 5 or 6 answers in the shaded range", means: "Screen positive. The form's wording is that symptoms are highly consistent with ADHD in adults and further investigation is warranted. In clinical groups many positives are false: specificity was 0.66 in substance use treatment (van de Glind 2013).", action: "Proceed to the full assessment. Do not tell the patient they 'have ADHD'. Use every shaded item as a probe." },
        { result: "Part A: 0-3 answers in the shaded range", means: "Screen negative. It does not exclude ADHD: in the original community study about 3 in 10 people with ADHD screened negative (sensitivity 68.7%).", action: "If the referral otherwise fits NICE NG87 1.2.10, assess anyway. Explore compensation, insight and a mainly inattentive presentation." },
        { result: "Part B: shaded items", means: "Cues for the interview. The form says no total score or diagnostic likelihood is used for Part B.", action: "Ask about each shaded item with open questions: examples, frequency, settings, and whether it was present in childhood." },
        { result: "Profile: 6 or more shaded in either 9-item set", means: "'Symptomatic' on that dimension under the DSM-IV-era rule used by Adler 2019. DSM-5-TR needs 5 or more symptoms from age 17, and that is decided at interview, not by the form.", action: "Expect that presentation and test it. Do not convert shaded items into a symptom count." },
        { result: "0-72 total (baseline)", means: "Overall symptom burden. Brevik 2020: mean 45.0 in diagnosed adults versus 23.0 in controls; a total of 36 gave sensitivity 0.79 and specificity 0.90. Research figures, not a clinical rule.", action: "Record as the baseline; re-rate at follow-up (NICE NG87 1.7.26 asks for standard scales at baseline and at dose changes). Never use the total to diagnose." },
        { result: "Almost every item at 'Very often'", means: "Very severe symptoms, severe distress or comorbidity, or over-reporting. The scale cannot tell these apart.", action: "Check mood, sleep and substances; look for validity indicators and for functioning in records; ask for an example of each item." }
      ],
      example: {
        html:
          "<p><strong>Sam, 34, project administrator</strong>, referred by the GP with 'lifelong disorganisation'. Part A answers:</p>" +
          "<table><thead><tr><th>Item</th><th>Answer (0-4)</th><th>Shaded from</th><th>Counts?</th></tr></thead><tbody>" +
          "<tr><td>1</td><td>Often (3)</td><td>Sometimes</td><td>Yes</td></tr>" +
          "<tr><td>2</td><td>Very often (4)</td><td>Sometimes</td><td>Yes</td></tr>" +
          "<tr><td>3</td><td>Sometimes (2)</td><td>Sometimes</td><td>Yes</td></tr>" +
          "<tr><td>4</td><td>Very often (4)</td><td>Often</td><td>Yes</td></tr>" +
          "<tr><td>5</td><td>Sometimes (2)</td><td>Often</td><td>No</td></tr>" +
          "<tr><td>6</td><td>Rarely (1)</td><td>Often</td><td>No</td></tr>" +
          "</tbody></table>" +
          "<p><strong>Part A:</strong> 4 shaded, so the screen is positive. Note item 5: 'Sometimes' does not count for fidgeting; it needs 'Often'.</p>" +
          "<p><strong>Part B:</strong> shaded at items 7, 8, 9, 10, 11, 14 and 16. Profile: inattention 9 of 9 shaded, hyperactivity-impulsivity 2 of 9. Total 41 of 72 (Part A 16, Part B 25).</p>" +
          "<p><strong>What does a positive screen mean? It depends on who is screened.</strong></p>" +
          "<ul><li><strong>Adults in England:</strong> 13.9% screened positive on Part A (APMS 2024), against an estimated adult prevalence of about 2.8%. Even if every adult with ADHD screened positive, at most about 1 in 5 screen-positive adults could have ADHD (2.8 / 13.9).</li>" +
          "<li><strong>Primary care, illustrative prevalence 5%</strong>, with the accuracy found in a German primary care and clinic sample (sensitivity 87.6%, specificity 85.1%; Ballmann 2022): of 1,000 adults, about 44 true positives and 142 false positives. PPV about 24%.</li>" +
          "<li><strong>Substance use treatment</strong> (prevalence 13%; van de Glind 2013): PPV 0.26, NPV 0.97.</li>" +
          "<li><strong>Specialist adult ADHD clinic, illustrative prevalence 50%</strong>, borrowing the substance use treatment accuracy (sensitivity 0.84, specificity 0.66), the closest published clinical-sample figures: of 100 referrals, about 42 true and 17 false positives (PPV about 71%), and about 8 people with ADHD among the 41 negatives (NPV about 80%).</li></ul>" +
          "<p><strong>Reading for Sam:</strong> a positive screen with a strongly inattentive profile. In a specialist clinic that raises the probability but settles nothing. The interview must test each shaded item with real examples, establish childhood onset, and check whether low mood or poor sleep is pushing the scores up (see Sam's PHQ-9 in the PHQ-9 entry).</p>",
        takeaway: "The same 4-of-6 result is a weak signal in the general population and a moderate one in a specialist clinic. In neither setting does it diagnose or exclude ADHD: it tells you which symptoms to explore."
      },
      pitfalls: [
        "Sending the shaded form to the patient. The shading shows which answers 'count'; PhenX advises removing it before the form is given to the respondent.",
        "Treating a positive Part A as a diagnosis, or telling the patient they screened positive for ADHD as if it were a result.",
        "Using a negative Part A to decline assessment.",
        "Inventing a Part B cut-off, or treating the 18-item total as more accurate than Part A: in Kessler 2005 the full 18 items were less accurate (sensitivity 56.3%, specificity 98.3%) than the 6-item screener.",
        "Adding Part A answers (0-24) and using 14 or more instead of the shaded rule. In substance use patients this was no better than the original rule (van de Glind 2013).",
        "Forgetting the time window: 6 months of current symptoms. A depressive episode, poor sleep or substance use raise scores.",
        "Reading items aloud at interview as yes/no questions. Ask open questions and ask for examples instead (AQAS 2024)."
      ],
      feedsInto: "Screening questionnaires step: enter the answers and the app applies the shaded-box rule and profile. Shaded items become probes in Interview parts 1 and 2. The 0-72 total is the baseline quoted in Report and next steps. An all-maximum pattern is weighed in Symptom validity and consistency.",
      strength: "Moderate as a screen: Part A sensitivity 68.7% and specificity 99.5% in a US community sample (Kessler 2005), but specificity falls in clinical groups (0.66 in substance use treatment). Screen and baseline only (NICE NG87 1.3.2; AQAS 2024)."
    },

    {
      id: "asrs5", tool: "asrs5", title: "ASRS-5: DSM-5 screener (6 items)", kind: "self",
      what:
        "<p>The WHO Adult ADHD Self-Report Screening Scale for DSM-5 (Ustun et al. 2017). Six questions about the past 6 months with the same five frequency options as the ASRS v1.1. Four are DSM-5 symptoms (concentrating when spoken to, leaving one's seat, difficulty unwinding, finishing other people's sentences); two are executive items that are not DSM criteria (leaving things to the last minute, relying on others to keep life in order).</p>" +
        "<p>It was built with a machine-learning method, and each answer carries a <strong>weighted</strong> number of points. The total runs from 0 to 25 (corrected in 2019 from 0-24). 'Never' scores 0, and the maximum points for items 1-6 are 5, 5, 6, 2, 4 and 3. <strong>The weights for the middle answers are not published</strong>: NYU describes the scoring as proprietary and licenses it.</p>" +
        "<p><strong>Why it is sent:</strong> a very short screen with high accuracy in its development samples. Many UK services use the ASRS v1.1 instead because its Part A rule is free.</p>",
      recommendedBy: [
        "European Consensus 2019 (Kooij) Table 2: the 6-item DSM-5 ASRS",
        "AADPA 2022: accuracy evidence reviewed; poor specificity in bipolar disorder and borderline personality disorder noted",
        "NICE NG87 1.3.2: rating scales as adjuncts only"
      ],
      whenSent: "Only if your service holds the scoring licence; otherwise send the ASRS v1.1.",
      who: "The patient.",
      time: "Six items; no completion time is published.",
      howToRead:
        "<ol><li>Find out which scoring was used. Only the licensed weighted algorithm (0-25) is validated.</li>" +
        "<li>If you hold the licence, score each answer with the official weights and add them (0-25).</li>" +
        "<li>Apply the authors' cut-off: <strong>14 or more is screen positive</strong>. The authors call 14 the most liberal threshold to consider in a clinical sample.</li>" +
        "<li>If the form was scored by adding 0-4 per item (0-24), as on many websites, record it as <strong>unscored</strong>: that variant is not the published algorithm and its accuracy is unknown.</li>" +
        "<li>Whatever the score, read the answers: item 1 is the only inattention item, and items 5 and 6 are not DSM symptoms.</li>" +
        "<li>Carry the endorsed items into the interview as probes.</li></ol>",
      meaning: [
        { result: "Weighted score 14 or more", means: "Screen positive. General-population development data (prevalence 8.2%): sensitivity 91.4%, specificity 96.0%, PPV 67.3%. NYU clinic sample (prevalence 57.7%): sensitivity 91.9%, specificity 74.0%, PPV 82.8%.", action: "Full assessment; probe each endorsed item for examples, settings and childhood." },
        { result: "Weighted score below 14", means: "Screen negative. In the clinic sample about 8 in 100 people with ADHD scored below 14. With one inattention item, mainly inattentive presentations may be under-detected.", action: "Do not exclude on this alone; decide on the referral information." },
        { result: "Weighted score 16 or 17 or more", means: "More specific (clinic sample: 16 or more specificity 86.6%, PPV 89.4%; 17 or more specificity 92.9%, PPV 93.6%) but less sensitive (82.7% and 76.3%).", action: "A stronger signal, still not a diagnosis." },
        { result: "Unweighted website score (0-24)", means: "Not the validated algorithm; accuracy unknown.", action: "Rescore with the licence or send the ASRS v1.1. Record the website figure as unscored." }
      ],
      example: {
        html:
          "<p><strong>Alex, 27</strong>, brings a website printout: 'ASRS-5 score 17/24, positive'. That is the unweighted variant. Your service holds the licence and rescores the same answers with the official weights: <strong>15 of 25</strong>.</p>" +
          "<table><thead><tr><th>Cut-off</th><th>Population: specificity</th><th>Population: PPV</th><th>Clinic: specificity</th><th>Clinic: PPV</th></tr></thead><tbody>" +
          "<tr><td>14 or more</td><td>96.0%</td><td>67.3%</td><td>74.0%</td><td>82.8%</td></tr>" +
          "<tr><td>15 or more</td><td>97.6%</td><td>76.5%</td><td>81.1%</td><td>86.5%</td></tr>" +
          "<tr><td>16 or more</td><td>99.0%</td><td>88.2%</td><td>86.6%</td><td>89.4%</td></tr>" +
          "<tr><td>17 or more</td><td>99.5%</td><td>93.2%</td><td>92.9%</td><td>93.6%</td></tr>" +
          "</tbody></table>" +
          "<p>Population prevalence 8.2%; clinic prevalence 57.7% (Ustun 2017).</p>" +
          "<p><strong>Reading:</strong> at 15 or more, about 1 in 5 people <em>without</em> ADHD in the clinic sample also scored this high (specificity 81.1%). In a German primary care sample the authors estimated that, at 3% prevalence, the PPV of the 14 cut-off would be under 10%. Alex's score justifies a full assessment; the interview must show the symptoms, their childhood onset and the impairment.</p>",
        takeaway: "Use only the licensed weighted score, and read it against your setting: specificity falls from 96% in the population sample to 74% in a clinic, where people without ADHD often have other conditions that raise the same items."
      },
      pitfalls: [
        "Scoring 0-4 per item and using 14 of 24: not the published algorithm.",
        "Assuming it covers inattention well: it has one inattention item, although inattention predominates in adults.",
        "Forgetting how it was validated: the developers' interviews did not use informants or rule out conditions such as bipolar disorder, and they describe it as best for people with sufficient insight (Ustun 2017).",
        "Ignoring poor specificity in bipolar disorder and borderline personality disorder (AADPA 2022).",
        "Reproducing the weighted score without a licence from NYU."
      ],
      feedsInto: "Screening questionnaires step: record the weighted score if licensed, otherwise record as unscored. Endorsed items become probes in Interview parts 1 and 2.",
      strength: "Strong in development samples (14 or more: sensitivity 91.4%, specificity 96.0%, AUC 0.94) and sensitive in German primary care (95.6%, specificity 72.3%); specificity falls in clinics (74.0%). Validated only with the licensed weighted scoring."
    },

    {
      id: "caars2", tool: "caars2", title: "CAARS 2: self-report and observer forms (licensed)", kind: "self",
      what:
        "<p>The Conners Adult ADHD Rating Scales, 2nd edition (MHS, 2023), for adults aged 18 and over. There is a <strong>Self-Report</strong> and an <strong>Observer</strong> form, each in three lengths: full (10-20 minutes), Short (5-10 minutes) and ADHD Index (1-3 minutes).</p>" +
        "<p>Results are T-scores against a US and Canadian normative sample (n = 2,640). Content scales: Inattention/Executive Dysfunction, Hyperactivity, Impulsivity, Emotional Dysregulation and Negative Self-Concept, plus DSM-5-TR symptom scales, clinical-concern items (suicidality, self-harm, anxiety, sadness), impairment items, and a 12-item ADHD Index reported as a probability. A <strong>Response Style Analysis</strong> gives a Negative Impression Index, an Inconsistency Index, omitted items and pace.</p>" +
        "<p><strong>Licensed:</strong> bought from MHS, scored by the publisher's online system, and restricted to users with the publisher's B-level qualification. The items cannot be reproduced in this app.</p>",
      recommendedBy: [
        "AADPA 2022 Box 2: Conners Adult ADHD Rating Scale",
        "RCPsych CR235 Box 3: CAARS (pay per use)",
        "European Consensus 2019 Table 2: listed as not open access",
        "NICE NG87 1.3.2: rating scales as adjuncts only"
      ],
      whenSent: "Through the publisher's online platform before the appointment: the patient completes the Self-Report and, with consent, a partner, relative or close friend completes the Observer form.",
      who: "The patient (Self-Report) and someone who knows them well now (Observer).",
      time: "Full form 10-20 minutes; Short 5-10 minutes; ADHD Index 1-3 minutes (MHS).",
      howToRead:
        "<ol><li><strong>Response style first.</strong> Check omitted items, pace (under 1 item per minute is unusually slow), the Inconsistency Index and the Negative Impression Index. On the CAARS 2-Short sample report, a Negative Impression Index of 6 or more warrants follow-up; use the flag printed on your own report. If response style is questionable, read every other score with caution.</li>" +
        "<li><strong>Clinical-concern items</strong> (suicidality, self-harm) before anything else; act the same day if endorsed.</li>" +
        "<li><strong>ADHD Index probability:</strong> Very high 90-99%; High 60-89%; Borderline 40-59%; Low 10-39%; Very low 1-9%.</li>" +
        "<li><strong>Scales (T-scores):</strong> 70 or more Very elevated; 65-69 Elevated; 60-64 Slightly elevated; below 60 Not elevated.</li>" +
        "<li><strong>Profile:</strong> is inattention the highest scale, or are Emotional Dysregulation and Negative Self-Concept carrying the profile (think mood, trauma, personality)?</li>" +
        "<li><strong>Compare Self and Observer</strong> scale by scale. A gap of 10 T-points or more (one standard deviation) is worth asking about (clinical practice).</li>" +
        "<li>Note the individual items the report highlights and take them into the interview.</li></ol>",
      meaning: [
        { result: "Negative Impression Index at or above the report's flag (6 or more on the Short-form sample report)", means: "The person endorsed unusual or extreme problems more than most people with ADHD do: possible over-reporting, severe distress or severe comorbidity.", action: "Do not take elevations at face value. Seek collateral and records, assess mood, and consider formal validity testing (Symptom validity and consistency step)." },
        { result: "Inattention or hyperactivity-impulsivity scales 65 or more, with acceptable response style", means: "Symptom levels well above same-age norms. Consistent with ADHD, but also with depression, anxiety and other conditions.", action: "Probe each elevated area at interview with examples and childhood history." },
        { result: "ADHD Index High or Very high (60-99%)", means: "The profile resembles the ADHD reference group.", action: "Supports proceeding with a full assessment; it is not a diagnosis." },
        { result: "Emotional Dysregulation and Negative Self-Concept highest, inattention lower", means: "A distress-led profile.", action: "Explore mood, anxiety, trauma and personality before attributing the picture to ADHD." },
        { result: "Observer much lower than Self", means: "The patient reports more than others see: inner symptoms, masking, a new relationship, or over-reporting.", action: "Interview the observer for concrete examples; look for childhood evidence and a second informant." },
        { result: "Observer higher than Self", means: "Limited insight or minimisation, which is common in adult ADHD (European Consensus 2019), or conflict colouring the observer's view.", action: "Give weight to the observer's specific examples; ask the patient about them." }
      ],
      example: {
        html:
          "<p><strong>Jordan, 41.</strong> CAARS 2 Self-Report: all five content scales between T 76 and T 85 (Very elevated), highest on Negative Self-Concept (85) and Emotional Dysregulation (84). ADHD Index Very high. <strong>Negative Impression Index 8.</strong> Inconsistency acceptable; no clinical-concern items endorsed.</p>" +
          "<p>Observer form (partner of 12 years): no scale above T 64 (at most Slightly elevated); ADHD Index Borderline.</p>" +
          "<p>Same pack: PHQ-9 17 (moderately severe).</p>" +
          "<p><strong>Reasoning:</strong> the Negative Impression Index is above the sample report's flag of 6, so the self-report needs follow-up before it is interpreted. The profile is led by distress scales, the observer sees much less, and depression is likely. Possible explanations: severe depression amplifying self-report; ADHD plus depression with an observer who sees little of Jordan's inner experience; or over-reporting. The forms cannot choose between them.</p>" +
          "<p><strong>Plan:</strong> assess depression and risk first; request school reports and a childhood informant; interview the partner for specific examples; review consistency in the validity step, with formal validity testing if the evidence stays inconsistent.</p>",
        takeaway: "Read CAARS 2 from the back: response style, clinical concerns, then scales. A very elevated self-report with a flagged Negative Impression Index and a calm observer report is a question to investigate, not an answer."
      },
      pitfalls: [
        "Forgetting the norms are from the US and Canada (n = 2,640), not the UK.",
        "Confusing CAARS 2 with the original CAARS (1999): scales, indices and cut-offs differ. The CAARS Infrequency Index (above 20 suspect) belongs to the original CAARS.",
        "Assuming validity indices catch everything: the original CAARS self-report was particularly easy to fake in a simulation study (Sollman 2010), and embedded indices have modest sensitivity.",
        "Letting a high ADHD Index decide. It is a rating-scale probability, not a diagnosis.",
        "Missing the clinical-concern items in a long report.",
        "Using it without the licence or the required qualification."
      ],
      feedsInto: "Screening questionnaires step (record the report's scores in the notes; the app does not score CAARS 2). Response style feeds Symptom validity and consistency; the Observer form feeds Collateral information; clinical-concern items feed Safety and risk.",
      strength: "Good publisher psychometrics (self-report median omega .94, median test-retest r .92, Cohen's d 2.24 against the general population) and built-in response-style indices; still a rating scale that can be over-reported and cannot diagnose."
    },

    {
      id: "baars4", tool: "baars4", title: "BAARS-IV: self and other-report forms (licensed)", kind: "self",
      what:
        "<p>The Barkley Adult ADHD Rating Scale-IV (Guilford, 2011), for ages 18-89. There are forms for <strong>current symptoms</strong> and for <strong>childhood symptoms</strong>, each in a <strong>self</strong> and an <strong>other-report</strong> version, plus a Quick Screen and interview versions of the current and childhood scales. The long form includes items on sluggish cognitive tempo (for example daydreaming, mental fogginess and slowness), which is not a DSM criterion.</p>" +
        "<p>Score sheets convert raw scores to percentiles for three age bands: 18-39, 40-59 and 60-89.</p>" +
        "<p><strong>Licensed:</strong> buyers of the book get a limited photocopy licence for their own use. The items cannot be reproduced in this app.</p>",
      recommendedBy: [
        "AADPA 2022 Box 2: Barkley Adult ADHD Rating Scale-IV",
        "RCPsych CR235 Box 3: Barkley current and childhood symptom scales (one-off payment)",
        "RCPsych in Scotland 2017 pathway: Barkley scales handed out at the first appointment"
      ],
      whenSent: "Self forms in the pre-appointment pack; other-report forms to informants with consent. Some services hand them out at the first appointment instead.",
      who: "Patient (self forms); partner or close friend (current other-report); parent or older sibling (childhood other-report).",
      time: "Quick Screen 3-5 minutes; long form 5-7 minutes (publisher).",
      howToRead:
        "<ol><li>Check which forms came back: current self, current other, childhood self, childhood other.</li>" +
        "<li>Use the score sheet for the person's <strong>age band</strong> (18-39, 40-59, 60-89) to convert each raw score to a percentile.</li>" +
        "<li>Apply the manual's interpretive thresholds; this guide does not reproduce them.</li>" +
        "<li>For each DSM item, note whether it was endorsed at the top two frequencies, so you can see which symptoms the patient and the informant agree on.</li>" +
        "<li>Read the sluggish cognitive tempo items separately. High scores there with low hyperactivity point to other explanations (low mood, poor sleep, medication, cognitive decline) as well as to inattentive ADHD.</li>" +
        "<li>Lay the four forms side by side: current against childhood, self against other.</li></ol>",
      meaning: [
        { result: "Current and childhood forms above the manual's threshold, from both self and other", means: "Convergent evidence of a lifelong pattern from two viewpoints.", action: "A strong lead for the interview; still test each symptom, its onset and the impairment." },
        { result: "Current elevated, childhood not elevated (self and other)", means: "Symptoms may be recent, or childhood memory is weak.", action: "Look for state causes (mood, sleep, substances, medical) and for contemporaneous school evidence. Consider whether rising demands unmasked lifelong difficulties." },
        { result: "Self elevated, other-report not", means: "Inner symptoms the informant does not see, a short or narrow acquaintance, or over-reporting.", action: "Interview the informant for examples; seek a second source." },
        { result: "Sluggish cognitive tempo high, hyperactivity-impulsivity low", means: "A slow, foggy, daydreamy profile. Not an ADHD criterion.", action: "Screen mood, sleep (sleep apnoea, narcolepsy), medicines, thyroid and, in older adults, cognitive decline." },
        { result: "All forms below threshold", means: "No elevation on this scale.", action: "Does not exclude ADHD; weigh the interview, informants and records." }
      ],
      example: {
        html:
          "<p><strong>Priya, 46</strong> (age band 40-59). Inattention percentiles:</p>" +
          "<table><thead><tr><th>Form</th><th>Inattention</th><th>Hyperactivity-impulsivity</th></tr></thead><tbody>" +
          "<tr><td>Current, self</td><td>95th</td><td>60th</td></tr>" +
          "<tr><td>Current, other (partner)</td><td>90th</td><td>50th</td></tr>" +
          "<tr><td>Childhood, self</td><td>85th</td><td>55th</td></tr>" +
          "<tr><td>Childhood, other (mother)</td><td>97th</td><td>65th</td></tr>" +
          "</tbody></table>" +
          "<p>Sluggish cognitive tempo: 92nd percentile.</p>" +
          "<p><strong>Reading:</strong> inattention is high from all four viewpoints, and highest in the mother's account of childhood; hyperactivity-impulsivity is unremarkable. That points towards a lifelong inattentive pattern. The high sluggish cognitive tempo score at 46 also raises perimenopausal sleep disturbance, low mood and thyroid disease as contributors to the <em>current</em> picture.</p>" +
          "<p><strong>Plan:</strong> test the inattentive symptoms at interview with examples from childhood and now; ask about sleep, mood and menstrual changes; check whether the current difficulties are a change from her lifelong baseline.</p>",
        takeaway: "Convergence across four viewpoints matters more than any single percentile. Where the forms disagree, the disagreement tells you what to ask."
      },
      pitfalls: [
        "Using the wrong age-band score sheet.",
        "Treating the childhood self-report as proof of onset: it is adult recall, like the WURS-25.",
        "Counting sluggish cognitive tempo items as ADHD symptoms.",
        "Photocopying beyond the purchaser's licence.",
        "Quoting item counts or thresholds from memory: check the manual."
      ],
      feedsInto: "Screening questionnaires step (notes). Other-report forms feed Collateral information; childhood forms feed Onset and impairment and the childhood columns of Interview parts 1 and 2.",
      strength: "Age-banded norms and parallel self/other and current/childhood forms; AADPA 2022 notes a modified BAARS-IV reached 80% or more sensitivity and specificity in adult prisoners. Licensed and not diagnostic."
    },
    /* ------------------------------------------------------------------ */
    /* Childhood recall and impairment                                     */
    /* ------------------------------------------------------------------ */
    {
      id: "wurs25", tool: "wurs25", title: "WURS-25: Wender Utah Rating Scale (childhood recall)", kind: "self",
      what:
        "<p>The Wender Utah Rating Scale (Ward, Wender and Reimherr 1993). The adult rates how they were <strong>as a child</strong>, from 0 (not at all or very slightly) to 4 (very much). Of the 61 items on the full form, 25 are scored: the ones that best separated adults with ADHD from comparison groups in the original study. The total runs from 0 to 100.</p>" +
        "<p>It was built on the Utah criteria, not on DSM. Only some items describe attention, restlessness and impulsivity; many describe temper, mood, self-esteem, friendships and school progress.</p>" +
        "<p><strong>Why it is sent:</strong> to get a structured picture of remembered childhood before the interview, to plan the childhood questions, and as one cross-check for criterion B (several symptoms before 12). It is adult recall, so it supports onset but cannot establish it.</p>",
      recommendedBy: [
        "European Consensus 2019 (Kooij) Table 2: open-access rating scale",
        "AADPA 2022 Box 2: assesses childhood symptoms; better specificity than the ASRS at high sensitivity (Brevik 2020)",
        "RCPsych CR235 (2023) Box 3: retrospective scale, listed as free",
        "CADDRA 4.1: listed among other usable tools",
        "NICE NG87 1.3.2: rating scales as adjuncts only"
      ],
      whenSent: "In the pre-appointment pack with the ASRS. Ask the patient to rate themselves as a child, as the form asks, without help from family (family accounts go on the informant forms).",
      who: "The patient, about their own childhood.",
      time: "Not stated in the sources; 25 short items take a few minutes in practice.",
      howToRead:
        "<ol><li><strong>Check the version.</strong> WURS-25 (25 items, 0-100) and the 61-item WURS share items. The German WURS-k is a different instrument with its own items and cut-off: do not apply WURS-25 cut-offs to it.</li>" +
        "<li><strong>Score:</strong> 0-4 per item; add the 25 items. If the 61-item form was used, score only items 3, 4, 5, 6, 7, 9, 10, 11, 12, 15, 16, 17, 20, 21, 24, 25, 26, 27, 28, 29, 40, 41, 51, 56 and 59, and ignore the other 36.</li>" +
        "<li><strong>Apply the cut-offs:</strong> 46 or more (original, more specific); 36 or more (more sensitive). In mixed psychiatric outpatients a cut-off of about 39 performed best (Kouros 2018).</li>" +
        "<li><strong>Look at what drives the total</strong> (grouping by item content, clinical practice): attention and impulsivity (items 1, 3, 4, 7, 15); mood and self-esteem (2, 9, 11, 13, 17); temper and opposition (5, 6, 8, 10, 12, 14, 18); social, conduct and other (16, 19, 20, 21, 22); school (23, 24, 25).</li>" +
        "<li><strong>Check the current state.</strong> Low mood colours how people remember childhood. Look at the PHQ-9 in the same pack.</li>" +
        "<li><strong>Compare</strong> with school reports and any childhood informant form. Agreement strengthens the case; disagreement is a question for the interview.</li>" +
        "<li>Take the highest-rated items into the childhood part of the interview as probes: ask for ages, settings and examples.</li></ol>",
      meaning: [
        { result: "46 or more", means: "Strongly recalled childhood difficulties. Ward 1993 correctly classified 86% of adults with ADHD, 99% of controls and 81% of adults with depression at this cut-off: about 1 in 5 depressed adults also scored this high.", action: "Plan a detailed childhood interview. Seek contemporaneous evidence (school reports, childhood informant) before relying on it for criterion B." },
        { result: "36 to 45", means: "Above the sensitive cut-off. Against population controls, 36 gave sensitivity 0.89 and specificity 0.90 (Brevik 2020), but in psychiatric outpatients specificity at 36 was only 0.59 (Kouros 2018).", action: "Weigh the item pattern. Treat as a lead, not as evidence of onset." },
        { result: "Below 36", means: "Few childhood difficulties recalled. This does not exclude ADHD: recall may be poor, the upbringing may have been structured, or the presentation mainly inattentive.", action: "Give more weight to school reports and a childhood informant than to this score." },
        { result: "High total driven by mood, temper and self-esteem items", means: "The pattern seen when scores rise in borderline personality disorder, bipolar disorder and depression (Kouros 2018; Brevik 2020).", action: "Explore childhood adversity, trauma, mood and self-harm. Ask what the child was like apart from being unhappy or angry." },
        { result: "School items high, attention items low", means: "Difficulty with learning rather than attention; school items also rise with specific learning disorders and intellectual disability (clinical practice).", action: "Ask about literacy, numeracy and any educational assessment; see the Previous records entry." }
      ],
      example: {
        html:
          "<p>Two people in the same clinic both score <strong>48</strong>, above the original cut-off of 46.</p>" +
          "<table><thead><tr><th>Item group</th><th>Taylor, 29</th><th>Morgan, 33</th></tr></thead><tbody>" +
          "<tr><td>Attention and impulsivity (5 items, max 20)</td><td>18</td><td>7</td></tr>" +
          "<tr><td>Mood and self-esteem (5 items, max 20)</td><td>6</td><td>18</td></tr>" +
          "<tr><td>Temper and opposition (7 items, max 28)</td><td>10</td><td>15</td></tr>" +
          "<tr><td>Social, conduct and other (5 items, max 20)</td><td>6</td><td>5</td></tr>" +
          "<tr><td>School (3 items, max 12)</td><td>8</td><td>3</td></tr>" +
          "<tr><td><strong>Total (max 100)</strong></td><td><strong>48</strong></td><td><strong>48</strong></td></tr>" +
          "</tbody></table>" +
          "<p><strong>Taylor:</strong> the score comes from distractibility, daydreaming, fidgeting, not finishing things and acting without thinking, plus 'not achieving up to potential'. That is the pattern of recalled childhood ADHD. <strong>Morgan:</strong> the score comes from sadness, low self-opinion, moodiness and anger. That pattern is common in adults with mood disorders, trauma or borderline personality disorder, with or without ADHD.</p>" +
          "<p><strong>How much does a score of 46 or more tell you?</strong></p>" +
          "<ul><li><strong>General adult mental health clinic, illustrative prevalence 30%,</strong> with outpatient accuracy at 46 (sensitivity 0.80, specificity 0.80; Kouros 2018): of 100 patients, about 24 true positives and 14 false positives. PPV about 63%.</li>" +
          "<li><strong>General population, prevalence about 2.8%,</strong> with the best published accuracy at 46 (sensitivity 0.75, specificity 0.95; Brevik 2020): of 1,000 adults, about 21 true and 49 false positives. PPV about 30%, close to the 0.27 that Mannuzza 2002 found for adult recall of childhood ADHD.</li></ul>" +
          "<p><strong>Plan:</strong> for both, request primary school reports and a parent or older sibling account. For Morgan, also explore mood episodes, trauma and self-harm before attributing the score to ADHD.</p>",
        takeaway: "The total tells you how difficult the person remembers childhood to have been; the item pattern and the records from the time tell you whether it looked like ADHD."
      },
      pitfalls: [
        "Treating a score of 46 or more as proof of childhood onset. It is adult recall: Mannuzza 2002 found a PPV of only 0.27 for adult self-report of childhood ADHD at population prevalence.",
        "Ignoring the item pattern: many items measure mood, temper and self-esteem, so distressed adults score high for reasons other than ADHD.",
        "Mixing versions: the WURS-k (German short form) has a different scored item set and cut-off; the unscored 36 items of the 61-item form must not be added.",
        "Scoring during a depressive episode without noting it: current mood colours recall.",
        "Letting family complete it with the patient. Keep the self-rating independent; ask family to complete their own informant form.",
        "Using a low score to decide that childhood onset is absent when school reports say otherwise."
      ],
      feedsInto: "Screening questionnaires step: enter the 25 answers and the app adds them (0-100). High items become probes for the childhood columns of Interview parts 1 and 2. The score is a cross-check, not evidence, for criterion B in Onset and impairment, and is compared with school reports in Collateral information.",
      strength: "Separates diagnosed adults from population controls well (AUC 0.956; Brevik 2020) but less well in psychiatric outpatients (at 46: sensitivity 0.80, specificity 0.80; Kouros 2018). Retrospective self-report: supports, never establishes, childhood onset."
    },

    {
      id: "wfirs", tool: "wfirs", title: "WFIRS-S: Weiss Functional Impairment Rating Scale, Self-Report", kind: "self",
      what:
        "<p>A 69-item scale by Dr Margaret Weiss, free for clinicians, distributed by CADDRA. The patient rates how emotional or behavioural problems have affected each area of life in the <strong>last month</strong>: 0 never or not at all, 1 sometimes or somewhat, 2 often or much, 3 very often or very much, or not applicable.</p>" +
        "<p>Seven domains: Family (8 items), Work (11), School (10), Life skills (12), Self-concept (5), Social (9) and Risk (14). It deliberately leaves out ADHD symptom items, so it measures impairment separately from symptoms.</p>" +
        "<p><strong>Why it is sent:</strong> NICE NG87 1.3.3 needs at least moderate impairment, with symptoms occurring in 2 or more important settings; DSM-5-TR needs several symptoms in 2 or more settings (criterion C) that clearly interfere with functioning (criterion D). The WFIRS-S maps where the problems are, so the interview can test each domain, and it gives a baseline for measuring change after treatment.</p>",
      recommendedBy: [
        "CADDRA 4.1 Step 1 (consider WFIRS-S) and follow-up monitoring",
        "UKAAN AQAS 2024: impairment scales such as the WFIRS are useful for measuring change (optional); the judgement rests mainly on the interview",
        "RCPsych CR235 (2023) Box 1: WHODAS 2.0 or W-FIRS desired with a referral",
        "RCPsych in Scotland 2017: ASRS, W-FIRS and AQ-10 for referrers"
      ],
      whenSent: "In the pre-appointment pack. Repeat it at follow-up to measure change in functioning.",
      who: "The patient (a parent form, WFIRS-P, exists for children).",
      time: "Not stated by the author; 69 short items take about 10-15 minutes in practice.",
      howToRead:
        "<ol><li>Check that School (and Work, if not working) were marked <strong>not applicable</strong> rather than 0. Not-applicable items are left out of every calculation.</li>" +
        "<li>For each domain, count the items rated 2 and the items rated 3, add the domain total and work out the <strong>mean of the answered items</strong>.</li>" +
        "<li>A domain is <strong>impaired</strong> if 2 or more items are rated 2 or higher, or any item is rated 3, or the domain mean is 1.5 or more (CADDRA scoring guide 2025; the 2011 instructions say a mean above 1.5).</li>" +
        "<li>Count the impaired domains.</li>" +
        "<li>Read single items too: any rating of 2 or 3 marks a clinically impaired area (CADDRA 2011). Look closely at Risk items about driving, substances, aggression and sex without protection.</li>" +
        "<li>Record the total and the domain means as the <strong>baseline</strong>. CADDRA's 2011 instructions describe a fall of 13 points in the total as a significant improvement.</li>" +
        "<li>For every impaired domain, note what to ask: what happened, how often, what it cost, and <strong>what caused it</strong> (ADHD symptoms, low mood, anxiety, substances or circumstances).</li></ol>",
      meaning: [
        { result: "2 or more domains impaired", means: "Self-rated impairment in several areas, consistent with impairment across settings (NICE NG87 1.3.3; DSM-5-TR criteria C and D), although life domains are not the same as settings. The scale is not specific to ADHD: depression and anxiety raise every domain (Canu 2020).", action: "Interview each impaired domain for real examples and their cause. The interview, not the score, decides whether impairment is at least moderate." },
        { result: "1 domain impaired", means: "Impairment reported in one area only, or other areas are masked by support, compensation or avoidance.", action: "Ask what others do for the person and how much effort things cost. Ask an informant. Check whether the one domain reflects a specific mismatch, such as a job." },
        { result: "No domain impaired", means: "Little self-rated impairment. Possible low insight, family or partner compensation, or high achievement with hidden cost.", action: "Do not stop the assessment on this alone: UKAAN AQAS 2024 warns against ruling out ADHD on high achievement. Ask the informant and explore effort and cost." },
        { result: "Risk items rated 2 or 3 (driving, substances, aggression, sex without protection)", means: "Specific safety concerns, even if the Risk mean is low. The Risk domain often shows floor effects (Takeda 2017), so a low Risk score does not mean low risk.", action: "Cover each in Safety and risk. Give driving safety advice where relevant and screen substances with AUDIT and DAST-10." },
        { result: "Self-concept and Family highest, during a period of low mood", means: "Internalising symptoms may be driving the profile.", action: "Check the PHQ-9 and ask when the problems started: lifelong, or since the mood changed?" }
      ],
      example: {
        html:
          "<p><strong>Jamie, 38, warehouse supervisor.</strong> School marked not applicable.</p>" +
          "<table><thead><tr><th>Domain</th><th>Answered</th><th>Items at 2</th><th>Items at 3</th><th>Total</th><th>Mean</th><th>Impaired?</th></tr></thead><tbody>" +
          "<tr><td>Family</td><td>8</td><td>2</td><td>1</td><td>9</td><td>1.13</td><td>Yes (an item at 3)</td></tr>" +
          "<tr><td>Work</td><td>11</td><td>4</td><td>1</td><td>15</td><td>1.36</td><td>Yes</td></tr>" +
          "<tr><td>School</td><td>0</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Not applicable</td></tr>" +
          "<tr><td>Life skills</td><td>12</td><td>3</td><td>2</td><td>18</td><td>1.50</td><td>Yes (also by the mean)</td></tr>" +
          "<tr><td>Self-concept</td><td>5</td><td>1</td><td>0</td><td>4</td><td>0.80</td><td>No</td></tr>" +
          "<tr><td>Social</td><td>9</td><td>0</td><td>0</td><td>4</td><td>0.44</td><td>No</td></tr>" +
          "<tr><td>Risk</td><td>14</td><td>2</td><td>0</td><td>6</td><td>0.43</td><td>Yes (2 items at 2)</td></tr>" +
          "</tbody></table>" +
          "<p>Total 56 from 59 answered items. <strong>Four impaired domains.</strong> Note the Risk domain: its mean is low, but two items rated 2 (doing other things while driving; cannabis) make it impaired under the two-item rule.</p>" +
          "<p><strong>Reasoning:</strong> the profile suggests impairment at home, at work and in daily organisation, with Self-concept only mildly affected, which makes a depression-led profile less likely (check the PHQ-9). The interview must show the cause: missed deadlines and arguments about forgotten chores fit ADHD; arguments that began with a new stressor would not. The two Risk items go to Safety and risk (driving) and to the DAST-10 and cannabis differential.</p>" +
          "<p><strong>Baseline:</strong> total 56. If ADHD is diagnosed and treated, a fall of 13 or more would be a significant improvement by CADDRA's 2011 guide.</p>",
        takeaway: "Count impaired domains with the three rules, but read the single items too: a low domain mean can hide a serious risk item."
      },
      pitfalls: [
        "Treating impaired domains as proof of ADHD: depression and anxiety raise WFIRS-S scores (Canu 2020), and the stem asks about any 'emotional or behavioural problems'.",
        "Scoring not-applicable sections as 0, which lowers the means.",
        "Trusting a mean based on two or three answered items.",
        "Reading the domain rule as an evidence-based cut-off: it is a clinical convention from DSM-IV practice; no adult cut-off from accuracy studies has been published.",
        "Ignoring under-reporting by people with low insight or strong family support, and over-reporting under distress.",
        "Reproducing the CADDRA scoring guide: restate the rule in your own words (the guide is CADDRA copyright; the scale itself is free)."
      ],
      feedsInto: "Screening questionnaires step: enter the answers and the app applies the domain rule. In Onset and impairment the domains map to the impairment areas (Family to relationships; Work and School to work and education; Life skills to daily life; Self-concept to self-image; Social to social life; Risk to safety). Risk items feed Safety and risk; the total is the baseline in Report and next steps.",
      strength: "Free, with good internal consistency (above 0.8 per domain) and sensitivity to change (CADDRA 2011, figures mainly from child and parent-form work), but not specific to ADHD and without an adult accuracy-derived cut-off. It supports, never replaces, the impairment interview (UKAAN AQAS 2024)."
    },

    /* ------------------------------------------------------------------ */
    /* Informants                                                          */
    /* ------------------------------------------------------------------ */
    {
      id: "informant_forms", tool: null, title: "Informant forms: partner, parent and childhood ratings", kind: "informant",
      what:
        "<p>Forms completed by people who know the patient. There are two kinds.</p>" +
        "<ul><li><strong>Current behaviour</strong>, from a partner, close friend, housemate or relative who sees the person now: for example the ASRS used as an observer form (CADDRA), the CAARS 2 Observer form, the BAARS-IV current other-report, the UKAAN Current Behaviour Scale partner report (reproduced in RCPsych CR235 Appendix 4; rated 0-3; no cut-off, 'not diagnostic') and the ACE+ informant pre-assessment questionnaire (ACE+ IR v.2).</li>" +
        "<li><strong>Childhood behaviour, rated now</strong> by a parent, older sibling or other adult who knew the person before 12: for example the SNAP-IV-26 (CADDRA), the BAARS-IV childhood other-report and the UKAAN Childhood Behaviour Scale parent report. The NICHQ Vanderbilt and SNAP-IV were built for parents and teachers rating a child now; no validation for rating an adult's childhood in retrospect was found.</li></ul>" +
        "<p>Some services instead ask for a short written account with examples (UKAAN AQAS 2024, optional).</p>" +
        "<p><strong>Why they are sent:</strong> NICE NG87 1.3.1 lists observer reports as part of the basis for diagnosis. ICD-11 says a report from a significant other, family member or co-worker can add important information, and that the pre-12 history is best established from records or childhood informants. Informants also show whether symptoms occur in more than one setting (criterion C).</p>",
      recommendedBy: [
        "NICE NG87 1.3.1: observer reports are part of the diagnostic basis",
        "UKAAN AQAS 2024: one or more informants highly recommended, including someone who knew the patient in childhood and someone who knows their adult life; written summaries and rating scales optional",
        "CADDRA 4.1 Step 1: ASRS as an observer form; SNAP-IV for someone who knew the patient as a child",
        "AADPA 2022 2.1.5 and Box 2: more than one setting and reporter; informants can complete childhood scales retrospectively",
        "European Consensus 2019 section 4; ICD-11 CDDR"
      ],
      whenSent: "With the patient's consent, at the same time as the patient's pack. Send each informant their own copy with a short letter: why it matters, which period to rate (now, or before age 12), that examples are more useful than ticks, and who will read it.",
      who: "Current: partner, close friend, housemate or adult relative. Childhood: parent, older sibling or another adult who knew the person well before 12.",
      time: "Depends on the form: the ASRS takes about 5 minutes; the CAARS 2 Observer 10-20 minutes for the full form (MHS); BAARS-IV forms 3-7 minutes (publisher).",
      howToRead:
        "<ol><li><strong>Who is the informant?</strong> Note the relationship, how long and in which settings they have known the person, and the state of the relationship now. Family members may have ADHD themselves (UKAP 2020).</li>" +
        "<li><strong>Which period did they rate?</strong> For childhood forms, which ages did they actually see?</li>" +
        "<li><strong>Score each form by its own rules.</strong> The ASRS Part A rule was validated for self-report, so read observer answers item by item rather than as a screen result. For SNAP-IV or Vanderbilt forms used retrospectively, count the items at the top two ratings as a description; CADDRA's printed SNAP-IV bands are internally inconsistent, so do not apply them.</li>" +
        "<li><strong>Lay the forms side by side with the patient's</strong>, item by item: agreement, informant higher, informant lower.</li>" +
        "<li><strong>Read the free text first.</strong> One concrete, dated example is worth more than a page of ticks.</li>" +
        "<li>Note what the informant could not see: inner restlessness, mind-wandering, the effort spent compensating.</li>" +
        "<li>Write two or three questions for an informant interview by phone or video. UKAAN prefers interview; rating scales are for when an interview is not practical.</li></ol>",
      meaning: [
        { result: "Informant and patient agree, with examples from 2 or more settings", means: "Convergent evidence for current symptoms and pervasiveness (criterion C).", action: "Record as supporting evidence; confirm the examples at interview." },
        { result: "Informant reports clearly fewer symptoms", means: "Inner symptoms are invisible, contact is limited, the person masks, or the patient over-reports.", action: "Ask the informant for examples in the areas they do see; seek a second informant and records; note it for the validity step." },
        { result: "Informant reports more symptoms than the patient", means: "Limited insight is common in adult ADHD (European Consensus 2019); or conflict colours the account.", action: "Give weight to specific, dated examples; discuss them with the patient." },
        { result: "Childhood informant describes several symptoms before 12", means: "Supports criterion B, especially with ages, settings and examples.", action: "Record the ages and settings; corroborate with school reports." },
        { result: "Childhood informant recalls no problems", means: "May be accurate; or the parent was unaware, had difficulties themselves, or provided structure that hid the symptoms (CR235: scaffolding by parents and schools can mask ADHD).", action: "Ask how much structure and help the child needed; seek school reports. Do not treat it as exclusion." },
        { result: "No informant available", means: "Common. NICE NG87 1.3.3: uncertain onset should not by itself exclude the diagnosis; CR235 9.5 agrees when the reason is outside the patient's control. ICD-11 advises caution without corroboration.", action: "Record why; rely more on records; state the effect on certainty in the report." }
      ],
      example: {
        html:
          "<p><strong>Riley, 31.</strong> Riley's ASRS: Part A 5 shaded; Part B 9 shaded. Partner of 4 years, ASRS as an observer form: 3 of Part A and 5 of Part B in the shaded range. Mother, SNAP-IV-26 about Riley at primary school: 7 of 9 inattention items at the top two ratings, 2 of 9 hyperactivity-impulsivity items.</p>" +
          "<table><thead><tr><th>Area</th><th>Riley</th><th>Partner</th><th>Reading</th></tr></thead><tbody>" +
          "<tr><td>Losing things, lateness, unfinished tasks</td><td>Often or very often</td><td>Often or very often</td><td>Agreement on visible symptoms</td></tr>" +
          "<tr><td>Difficulty unwinding, inner restlessness</td><td>Very often</td><td>Rarely</td><td>Inner symptoms the partner cannot see</td></tr>" +
          "<tr><td>Interrupting others</td><td>Rarely</td><td>Often</td><td>Partner sees more than Riley notices</td></tr>" +
          "</tbody></table>" +
          "<p><strong>Reasoning:</strong> the forms agree on the observable inattentive symptoms, and they disagree where you would expect: inner states and social behaviour the person may not notice. The mother's ratings point to an inattentive childhood. She also wrote 'I was just the same at school', which raises a family history and the chance that her memory treats these traits as normal.</p>" +
          "<p><strong>Plan:</strong> a 15-minute call with the partner for two examples each of lateness and interrupting; ask the mother for ages, teachers' comments and how much help Riley needed with homework; request primary school reports.</p>",
        takeaway: "Agreement on what an informant can see, and disagreement on what they cannot, is the expected pattern. Explore every disagreement with examples instead of averaging the scores."
      },
      pitfalls: [
        "Sending forms without the patient's consent, or letting the patient and informant fill them in together.",
        "Treating the informant as neutral: conflict, separation, dependence or the informant's own ADHD can colour the account.",
        "Applying child cut-offs (SNAP-IV, Vanderbilt) to retrospective ratings of an adult's childhood.",
        "Forgetting that a parent rating childhood decades later is also giving retrospective recall.",
        "Ignoring an informant who has known the person only briefly or in one setting.",
        "Using the ASRS Part A rule on an observer form as if it were a validated screen.",
        "Missing language, literacy or cultural differences in how informants describe behaviour."
      ],
      feedsInto: "Collateral information step: record who each informant is and rate how well their account supports the history (0, 1 or 2). Item-level agreement goes into the informant columns of Interview parts 1 and 2; childhood accounts feed Onset and impairment; large unexplained discrepancies are weighed in Symptom validity and consistency.",
      strength: "Recommended by every guideline (NICE NG87 1.3.1 makes observer reports part of the basis for diagnosis), but adult informant rating scales have limited validation. Their value is independent, concrete examples, not scores."
    },
    /* ------------------------------------------------------------------ */
    /* History and records                                                 */
    /* ------------------------------------------------------------------ */
    {
      id: "history_questionnaire", tool: null, title: "Pre-assessment history questionnaire (development, education, health, family)", kind: "history",
      what:
        "<p>A background questionnaire the patient completes before the first appointment, often with a parent's help for the early years. Typical sections:</p>" +
        "<ul><li><strong>Development:</strong> pregnancy, birth, prematurity, early milestones, early temperament, and early contact with speech and language therapy, occupational therapy, the health visitor or a paediatrician.</li>" +
        "<li><strong>Education:</strong> schools attended, progress, behaviour, exclusions, extra help, assessments, qualifications.</li>" +
        "<li><strong>Adult life:</strong> jobs and why they ended, relationships, living situation, children and caring roles.</li>" +
        "<li><strong>Health:</strong> seizures, head injury, heart symptoms, sleep, current medicines, past mental health problems, treatments and self-harm.</li>" +
        "<li><strong>Substances, driving and forensic history.</strong></li>" +
        "<li><strong>Family history:</strong> ADHD, autism, learning difficulties, mental illness, and sudden cardiac death.</li></ul>" +
        "<p>Examples include the developmental history questionnaire in RCPsych CR235 Appendix 2 (milestones, childhood illnesses, head injury, schooling, support, exclusions). CADDRA's ADHD Assessment Form (11 pages) covers the same ground as a clinician-completed record and is a useful model for what to ask. UKAAN AQAS 2024 adds an optional patient-written life story or timeline.</p>" +
        "<p><strong>Why it is sent:</strong> NICE NG87 1.3.1 requires a full developmental and psychiatric history, and 1.3.4 an assessment of coexisting conditions, circumstances and physical health. A questionnaire saves interview time, builds the timeline in advance, and flags differentials, contraindications and records to request.</p>",
      recommendedBy: [
        "NICE NG87 1.3.1 and 1.3.4: full developmental and psychiatric history; coexisting conditions and physical health",
        "UKAAN AQAS 2024: developmental history essential; pregnancy, birth and milestones highly recommended; life story or timeline optional",
        "RCPsych CR235 (2023) Box 1 (developmental questionnaire desired with a referral) and Appendix 2",
        "CADDRA 4.1: ADHD Assessment Form (history, medical review and summary grid)",
        "AADPA 2022 2.1.2: full developmental, mental health and medical history"
      ],
      whenSent: "In the pre-appointment pack, with a note that the patient can ask family about early development and can leave sensitive questions (such as trauma) for the appointment.",
      who: "The patient, with a parent or older relative for pregnancy, birth and early childhood where possible.",
      time: "Varies with the form. Allow the patient time to ask family about the early years (clinical practice).",
      howToRead:
        "<ol><li><strong>Build a dated timeline:</strong> birth, nursery, primary, secondary, further education, each job, relationships, mental health episodes, substance use, injuries and illnesses.</li>" +
        "<li><strong>Mark when each difficulty first appeared.</strong> Before 12? Continuous (trait) or in episodes (state)? CR235 9.7 makes the trait-state distinction central to the differential.</li>" +
        "<li><strong>Flag neurodevelopmental pointers:</strong> early therapy or paediatric contact (CR235 9.4), social difficulties, tics, literacy or coordination problems. UKAAN AQAS makes screening for autism, tics, dyslexia, dyspraxia and intellectual disability essential.</li>" +
        "<li><strong>Flag medical mimics and medicine effects:</strong> seizures, head injury, thyroid disease, snoring and daytime sleepiness, and medicines that can cause ADHD-like symptoms (ICD-11 names carbamazepine, valproate, risperidone, bronchodilators and thyroid replacement).</li>" +
        "<li><strong>Flag cardiac history before any medication:</strong> NICE NG87 1.7.5 lists, among others, congenital heart disease or cardiac surgery, sudden death in a <em>first-degree</em> relative under 40 suggesting heart disease, breathlessness or fainting on exertion, and palpitations that start and stop suddenly.</li>" +
        "<li><strong>Flag risk:</strong> self-harm, suicide attempts, violence, safeguarding (children and caring roles), driving incidents.</li>" +
        "<li><strong>List the records to request</strong> (school reports, CAMHS, educational psychology, GP, occupational health) and note gaps and contradictions to ask about.</li></ol>",
      meaning: [
        { result: "Difficulties from early childhood, continuous through each stage", means: "A trait-like, neurodevelopmental pattern: consistent with ADHD, but also with autism, learning disorders or other lifelong conditions.", action: "Test with the interview, a childhood informant and school reports." },
        { result: "Clear onset in adolescence or adulthood after an unremarkable childhood", means: "ICD-11: acute or late onset should raise other causes, such as emerging psychosis or bipolar disorder. The European Consensus 2019 asks for careful assessment of substance use in apparent late onset.", action: "Explore the change point: life events, mood, substances, injury, medicines, sleep. Still ask whether several symptoms were present before 12." },
        { result: "Early developmental delay or therapy contact", means: "Neurodevelopmental vulnerability (CR235 9.4).", action: "Screen for autism (AQ-10), language disorder, coordination disorder, learning disorders and intellectual disability." },
        { result: "Medical or cardiac red flags", means: "Possible mimics (epilepsy, head injury, sleep disorders) and medication safety issues.", action: "Take them into the history; if an NG87 1.7.5 feature is present, a cardiology opinion is needed before ADHD medication." },
        { result: "Episodes of low mood, high energy or reduced need for sleep", means: "State disorders that can mimic or co-occur with ADHD.", action: "Chart the episodes on the timeline; plan a structured mood history (see MDQ)." },
        { result: "Largely blank, or 'don't know' throughout", means: "Poor recall, literacy or language difficulty, no family to ask, or difficulty completing forms. Not a sign of anything on its own.", action: "Complete it together at the appointment; offer help or an interpreter." }
      ],
      example: {
        html:
          "<p><strong>Alexis, 26.</strong> The returned questionnaire, turned into a timeline:</p>" +
          "<table><thead><tr><th>Age</th><th>Event</th><th>Why it matters</th></tr></thead><tbody>" +
          "<tr><td>Birth</td><td>Born at 36 weeks</td><td>Preterm birth: higher ADHD prevalence (NG87 1.2.1)</td></tr>" +
          "<tr><td>3</td><td>Speech and language therapy for 'late talking'</td><td>Screen language disorder and autism</td></tr>" +
          "<tr><td>5-11</td><td>'Chatty, lost things, in trouble for not finishing work'</td><td>Possible childhood symptoms: request reports</td></tr>" +
          "<tr><td>14-15</td><td>Two fixed-term exclusions for 'answering back'</td><td>Impulsivity, or oppositional behaviour: ask</td></tr>" +
          "<tr><td>17-23</td><td>Daily cannabis; now weekends</td><td>Started after the school difficulties; DAST-10</td></tr>" +
          "<tr><td>19</td><td>Cycling accident, brief loss of consciousness</td><td>Head injury after onset: may add, cannot explain earlier symptoms</td></tr>" +
          "<tr><td>22</td><td>Depressive episode, sertraline for 9 months</td><td>Episodic: check current mood (PHQ-9)</td></tr>" +
          "<tr><td>19-26</td><td>Six jobs in seven years</td><td>Impairment at work: explore why each ended</td></tr>" +
          "</tbody></table>" +
          "<p>Family history: father 'probably has ADHD'; father's brother died suddenly at 35 ('heart').</p>" +
          "<p><strong>Reasoning:</strong> the difficulties appear in primary school, before the cannabis, the head injury and the depressive episode, which favours a lifelong condition with later additions. The uncle is a second-degree relative, so this does not itself meet NG87 1.7.5 as written; record it, ask whether a cause was found and whether any first-degree relative is affected, and flag it for whoever considers medication.</p>" +
          "<p><strong>Records to request:</strong> primary and secondary school reports, the speech therapy letter, the GP summary and the hospital letter about the head injury.</p>",
        takeaway: "A history questionnaire is most useful once it becomes a dated timeline: the order of events shows which explanations came first."
      },
      pitfalls: [
        "Reading it as a symptom checklist instead of building a timeline.",
        "Assuming a parent's memory of milestones decades later is exact.",
        "Asking about trauma on paper without support: say it can wait for the appointment.",
        "Missing the family cardiac history, or misreading NG87 1.7.5 (first-degree relative under 40).",
        "Not noticing who completed it, or that literacy or language made it hard to complete.",
        "Skipping the free-text answers, which often hold the most useful detail."
      ],
      feedsInto: "Clinical history step: the timeline pre-fills development, education, work, health, substances, family and forensic sections. Onset and impairment uses the timeline for criterion B and the course; Differential diagnosis uses the trait-state pattern and medical mimics; Safety and risk uses self-harm, safeguarding and driving; the Report lists physical health and family history, including conditions explicitly absent.",
      strength: "Consensus-based good practice (UKAAN AQAS 2024; RCPsych CR235; CADDRA 4.1) with no psychometric data. Its value is a dated timeline and early warning of differentials and contraindications."
    },

    {
      id: "school_reports", tool: null, title: "Old school reports: reading teacher comments", kind: "records",
      what:
        "<p>End-of-term and end-of-year school reports, plus anything else written at the time: exercise books, letters home, records of extra help or special educational needs, exclusion letters and educational psychology reports.</p>" +
        "<p><strong>Why they are requested:</strong> they are the best routinely available evidence of childhood behaviour because they were written at the time, by independent observers, in a second setting. ICD-11 says that in adults the history before 12 is best established from school or local records or from informants, and that without corroboration a diagnosis should be made with caution. NICE NG87 1.3.3 adds that an uncertain time of onset should not by itself exclude the diagnosis.</p>",
      recommendedBy: [
        "UKAAN AQAS 2024: review of school reports is a listed procedure; the report should say whether they were reviewed and whether they support the diagnosis (highly recommended)",
        "ICD-11 CDDR: pre-12 history best established from school or local records",
        "CADDRA 4.1 Step 1: school report cards and previous assessments",
        "AADPA 2022: request school reports (primary, secondary, tertiary)",
        "UKAP consensus 2020 (females; ADHD and autism): review school reports beforehand; may describe daydreaming, distraction and disorganisation",
        "European Consensus 2019: school or social-care reports when no informant is available"
      ],
      whenSent: "Ask for them as soon as the referral is accepted, so there is time to search: family homes, lofts, old files. Ask for the whole set, not just the bad years.",
      who: "The patient or family provide them; the clinician reads them before the appointment.",
      time: "About 10-30 minutes to read a set carefully (clinical practice).",
      howToRead:
        "<ol><li><strong>Sort by date</strong> and note the child's age for each report. Focus on ages 5-12, but read all of them.</li>" +
        "<li><strong>Read the comments, not the grades.</strong> Attainment can be good while behaviour comments show the difficulty.</li>" +
        "<li><strong>Highlight behaviour that maps to ADHD symptoms:</strong> off task, needs reminders, daydreams, careless mistakes, unfinished or lost work, forgets kit or homework, does not listen to instructions, fidgety, out of seat, calls out, chatty, rushes.</li>" +
        "<li><strong>Look for consistency:</strong> the same theme from different teachers across several years is far stronger than one comment.</li>" +
        "<li><strong>Translate polite wording.</strong> Reports are written for parents: 'could achieve even more if...', 'needs to listen more carefully', 'a lively member of the class' and 'lovely but chatty' often describe the same behaviour more bluntly put elsewhere.</li>" +
        "<li><strong>Note the context:</strong> changes of school, family events, bullying, illness, and whether problems appear only in one subject.</li>" +
        "<li><strong>Note support:</strong> extra help, special educational needs records, exclusions, referrals.</li>" +
        "<li><strong>Rate the support</strong> for childhood symptoms (none, some, clear) and copy two or three short quotes with dates for the report.</li></ol>",
      meaning: [
        { result: "The same attention or activity themes from several teachers across years, before 12", means: "Strong contemporaneous support for several symptoms before 12 (criterion B) and for a second setting (criterion C).", action: "Rate as clear support (2); quote dated examples in the report." },
        { result: "Occasional or mild comments", means: "Some support. Single comments such as 'could concentrate more' are common in children without ADHD.", action: "Rate as some support (1); weigh with the informant and interview." },
        { result: "Comments only about one subject, or about reading, spelling or maths", means: "Possible specific learning disorder. ICD-11: if inattention occurs only during tasks in the area of learning difficulty, that points to the learning disorder rather than ADHD.", action: "Ask about dyslexia or dyscalculia assessments; see Previous records." },
        { result: "Positive reports with no concerns", means: "Does not exclude ADHD: inattentive children (often girls), able children and well-structured schools generate few comments, and CR235 notes that scaffolding by parents and schools can mask symptoms.", action: "Look for effort and homework comments; read the secondary reports, as difficulties may appear only as demands rise (AADPA 2022 2.1.7); ask the informant." },
        { result: "Problems begin abruptly at a particular time", means: "A change after a bereavement, move, illness or abuse suggests a reaction to events, or another cause, rather than a lifelong trait.", action: "Explore the event and the trauma and mood differentials." },
        { result: "Comments on social difficulty, rigidity, unusual interests or 'in a world of their own'", means: "Possible autism, alone or alongside ADHD.", action: "Autism screen and developmental history (see AQ-10)." }
      ],
      example: {
        html:
          "<p><strong>Dana, 35.</strong> Four reports, four different teachers:</p>" +
          "<table><thead><tr><th>Year (age)</th><th>Teacher comment (summarised)</th><th>Maps to</th></tr></thead><tbody>" +
          "<tr><td>Year 2 (6-7)</td><td>Cheerful and loves stories; needs frequent reminders to stay on task and often leaves written work unfinished.</td><td>Sustaining attention; follow-through</td></tr>" +
          "<tr><td>Year 4 (8-9)</td><td>Lots of ideas but finds it hard to organise them; her tray is often in a muddle and reading books are left at home.</td><td>Organisation; losing things</td></tr>" +
          "<tr><td>Year 6 (10-11)</td><td>Could achieve much more if she listened carefully to instructions; homework is often late.</td><td>Listening; forgetfulness</td></tr>" +
          "<tr><td>Year 9 (13-14)</td><td>Capable but easily distracted by others; must take more care.</td><td>Distractibility; careless errors</td></tr>" +
          "</tbody></table>" +
          "<p>Maths progress was described as excellent in Year 5. There are no comments about hyperactivity.</p>" +
          "<p><strong>Reasoning:</strong> four teachers, across seven years, describe the same pattern: off task, unfinished, disorganised, forgetful, not listening. Three of the four reports are before 12. Good maths progress and a love of stories argue against a global learning problem. None of the reports uses clinical words, and none needs to: the pattern is the evidence.</p>" +
          "<p><strong>Rating:</strong> clear support (2) for inattentive symptoms before 12 in the school setting. In the report: quote two comments with their dates.</p>",
        takeaway: "One comment is anecdote; the same theme from several teachers across several years, before age 12, is strong evidence."
      },
      pitfalls: [
        "Reading the grades and skipping the comments.",
        "Treating one critical comment as a pattern, or normal childhood chatter as a symptom.",
        "Missing the polite euphemisms teachers use in reports for parents.",
        "Attributing difficulties confined to one subject to ADHD.",
        "Reading only the reports the patient chose: ask for the full set.",
        "Treating missing reports, or bland reports, as evidence that there were no problems.",
        "Relying on reports from after 12 alone for onset: they help, but criterion B is about symptoms before 12."
      ],
      feedsInto: "Collateral information step: rate the school evidence (0, 1 or 2) and paste dated quotes. Link quotes to the childhood columns of Interview parts 1 and 2; they support criteria B and C in Onset and impairment, and the Report states whether school reports were reviewed and whether they support the conclusion.",
      strength: "Among the strongest routinely available evidence of childhood onset, alongside a childhood informant, because it was written at the time by independent observers (ICD-11 CDDR; UKAAN AQAS 2024). Limited by brief, polite wording and missing years; no psychometric data."
    },

    {
      id: "previous_records", tool: null, title: "Previous records: GP, CAMHS, educational psychology, occupational health", kind: "records",
      what:
        "<p>Records written by other services, requested with the patient's consent:</p>" +
        "<ul><li><strong>GP record and summary:</strong> childhood consultations, referrals, diagnoses, prescriptions, injuries, overdoses.</li>" +
        "<li><strong>CAMHS and paediatric notes:</strong> earlier assessments, letters, and rating scales completed by parents and teachers at the time.</li>" +
        "<li><strong>Educational psychology and specialist teacher reports:</strong> cognitive and attainment testing, specific learning difficulties. A specialist assessor's report for Disabled Students' Allowance can describe 'characteristics of ADHD', but it is not a medical diagnosis (SASC 2021).</li>" +
        "<li><strong>Occupational health reports:</strong> problems at work, sickness absence, adjustments.</li>" +
        "<li><strong>Adult mental health letters:</strong> diagnoses, episodes, treatments and responses, risk history.</li>" +
        "<li><strong>Previous ADHD reports</strong>, including private or overseas assessments.</li></ul>" +
        "<p><strong>Why they are requested:</strong> RCPsych CR235 says a good assessment draws on third parties, previous school records and previous health assessments. The DHSC independent review (2026) found misdiagnosis more likely when assessments are made without access to informants or records.</p>",
      recommendedBy: [
        "UKAAN AQAS 2024: review previous records (highly recommended; essential in more complex cases)",
        "RCPsych CR235 (2023) sections 6 and 8: previous health assessments; reports from diagnoses made outside the NHS",
        "DHSC independent review (2026): assessments without informants or records carry a higher risk of misdiagnosis",
        "CADDRA 4.1 Step 1: prior documents and previous assessments",
        "NICE NG87 1.3.1: full developmental and psychiatric history"
      ],
      whenSent: "Request at the start, with written consent, naming the services and the period needed. The GP summary often arrives with the referral.",
      who: "The GP, CAMHS or paediatrics, the school or local authority, the employer's occupational health service, and previous providers. The patient may hold copies.",
      time: "Variable; a full GP record can take an hour to read well (clinical practice).",
      howToRead:
        "<ol><li>Check the author, date and purpose of each document.</li>" +
        "<li>Extract a <strong>dated list</strong> of diagnoses, episodes, treatments and responses, and add it to the timeline.</li>" +
        "<li>Look for <strong>childhood observations</strong>: consultations about behaviour or concentration, referrals to child guidance or CAMHS, hearing tests, frequent injuries, school-related letters.</li>" +
        "<li>Look for <strong>differentials</strong>: episodes of depression or elation, psychosis, self-harm, substance use, head injury, seizures, thyroid tests, sleep studies.</li>" +
        "<li>For earlier <strong>rating scales</strong>, note who completed them, when, and in which setting: child ratings written at the time are valuable.</li>" +
        "<li>For a <strong>previous ADHD diagnosis</strong>, check whether the report shows a comprehensive assessment: symptoms with examples in childhood and adulthood, impairment, informants and the differential. CR235: without sufficient evidence of a comprehensive assessment, a standard assessment is needed.</li>" +
        "<li>For <strong>educational psychology</strong> reports, note the cognitive profile and any specific learning difficulty or low general ability.</li>" +
        "<li>Review <strong>medicines</strong>: past ADHD medication and its effect, sedating or activating drugs, and cardiac-risk medicines.</li>" +
        "<li>Record what was reviewed and what was asked for but not received.</li></ol>",
      meaning: [
        { result: "Childhood records describe attention or behaviour concerns", means: "Contemporaneous support for criteria B and C, from a source other than the patient.", action: "Quote it in Collateral information and the Report." },
        { result: "Records show mood, psychotic or substance episodes", means: "A possible better explanation, or a co-occurring condition.", action: "Map symptom timing against the episodes: were the ADHD-like symptoms present between episodes and before the first?" },
        { result: "Previous ADHD diagnosis with a comprehensive report", means: "Diagnosis well documented.", action: "Confirm the criteria are still met and treatment is needed (NG87 1.7.4). Adults treated as children are referred to general adult psychiatry for assessment (NG87 1.2.11)." },
        { result: "Previous diagnosis without adequate evidence", means: "The basis for the diagnosis cannot be checked.", action: "Carry out a standard assessment (CR235)." },
        { result: "Educational psychology shows a specific learning difficulty or low general ability", means: "Learning disorder or intellectual disability may explain or co-occur. ICD-11: ADHD symptoms must be out of proportion to intellectual level.", action: "Interpret symptoms against ability and the learning profile." },
        { result: "Records contradict the account", means: "Memory and records both make errors; contradictions can also reflect over- or under-reporting.", action: "Discuss openly and without accusation; weigh it in Symptom validity and consistency." }
      ],
      example: {
        html:
          "<p><strong>Kai, 45</strong>, writes 'no previous mental health problems'. The GP record shows:</p>" +
          "<table><thead><tr><th>Age</th><th>Entry</th><th>Reading</th></tr></thead><tbody>" +
          "<tr><td>9</td><td>'Behaviour problems at school; referred to child guidance'</td><td>A childhood clue: request those notes</td></tr>" +
          "<tr><td>19</td><td>Low mood; citalopram for 6 months</td><td>A past depressive episode Kai did not mention</td></tr>" +
          "<tr><td>28</td><td>Anxiety; CBT</td><td>Co-occurring or alternative explanation</td></tr>" +
          "<tr><td>33-45</td><td>Back pain; repeat codeine</td><td>Sedating medicine: ask about current use</td></tr>" +
          "<tr><td>41</td><td>Insomnia; zopiclone</td><td>Sleep differential; sedation</td></tr>" +
          "</tbody></table>" +
          "<p>An occupational health report (2023) describes repeated lateness and missed deadlines and recommends written instructions and a quiet workspace.</p>" +
          "<p><strong>Reasoning:</strong> the child guidance referral is contemporaneous evidence worth chasing. The two treated episodes may be co-occurring conditions; the interview must date the attention problems against them. Codeine and zopiclone can both affect attention and alertness (clinical practice), so review use and dependence (DAST-10 counts prescribed drugs used beyond the directions). The occupational health report is independent evidence of impairment at work.</p>",
        takeaway: "Records rarely answer the question directly, but they add the forgotten episodes, the medicines and the childhood clues that an interview alone would miss."
      },
      pitfalls: [
        "Reading only the coded problem list and missing the letters.",
        "Accepting a coded diagnosis as accurate without checking its basis.",
        "Letting an old label steer the assessment (diagnostic overshadowing) in either direction.",
        "Accepting a previous ADHD diagnosis without the report, or rejecting one without reading it.",
        "Treating a specialist assessor's report for student support as a medical diagnosis.",
        "Requesting more than needed: ask only for what the assessment requires, with consent.",
        "Not recording which records were unavailable."
      ],
      feedsInto: "Clinical history (past psychiatric and medical history, medicines), Collateral information (contemporaneous evidence), Differential diagnosis (episodes, injuries, learning profile), Safety and risk (past self-harm and overdoses), Symptom validity and consistency (agreement between sources) and the Report (sources reviewed).",
      strength: "High value when records contain observations made at the time. UKAAN AQAS 2024 rates record review as highly recommended (essential in complex cases), and the DHSC review (2026) links assessment without records to misdiagnosis. Quality depends on what was written."
    },

    /* ------------------------------------------------------------------ */
    /* Co-occurring conditions                                             */
    /* ------------------------------------------------------------------ */
    {
      id: "wsr2", tool: "wsr2", title: "WSR-II: Weiss Symptom Record II (broad problem checklist)", kind: "self",
      what:
        "<p>A free broad checklist by Dr Margaret Weiss, in the CADDRA toolkit. Each item is rated none (0), mild (1), moderate (2), severe (3) or not applicable. Sections cover attention, hyperactivity-impulsivity, oppositional and conduct problems, anxiety, depression, mood regulation, suicide, psychosis, stress-related problems, autism spectrum, development and learning, motor problems, sleep, eating, substance use, other addictions and personality traits.</p>" +
        "<p>It can be completed by the adult, a partner, a parent or a teacher.</p>" +
        "<p><strong>Why it is sent:</strong> one form that sweeps for conditions which co-occur with or mimic ADHD before the ADHD-specific assessment. CADDRA uses it for general mental health screening.</p>",
      recommendedBy: [
        "CADDRA 4.1: general screeners WSR, PHQ-9 and GAD-7; WSR-II before the ADHD-specific steps",
        "UKAAN AQAS 2024: screening for common mental health problems is essential (no tool named)"
      ],
      whenSent: "In the pre-appointment pack, or at first contact.",
      who: "The patient; optionally a partner or parent as well.",
      time: "Not stated by the author.",
      howToRead:
        "<ol><li><strong>Suicide items first.</strong> CADDRA counts a moderate or severe rating as 'at risk'; in practice ask about any rating above none, before the appointment (see C-SSRS).</li>" +
        "<li>For each section, <strong>count the items rated 2 or 3</strong>. There is no total score.</li>" +
        "<li>Apply CADDRA's 2018 toolkit guide (number of items at 2-3): adult ADHD 5 in attention or in hyperactivity-impulsivity; depression 5; persistent depressive disorder 2; mood regulation 3; oppositional 4; conduct 3.</li>" +
        "<li>Any item at 2-3 in development, motor, psychosis, suicide, autism spectrum, stress, sleep, substance use, addictions or the last five personality items counts as 'at risk'.</li>" +
        "<li>The first six personality items screen for borderline personality disorder.</li>" +
        "<li>Follow each flagged section with a specific tool or interview: PHQ-9, GAD-7, AQ-10, PCL-5, AUDIT, DAST-10, MSI-BPD, STOP-Bang.</li>" +
        "<li>These thresholds come from the 2018 toolkit; check them against the current form (July 2022 version).</li></ol>",
      meaning: [
        { result: "5 or more items at 2-3 in attention or hyperactivity-impulsivity", means: "CADDRA's guide suggests adult ADHD. Same limits as any self-report symptom list.", action: "Test at interview; do not count it as evidence." },
        { result: "Depression 5 or more, persistent depressive 2 or more, or mood regulation 3 or more", means: "Possible depression, dysthymia or emotional dysregulation, which may be part of ADHD or a separate condition.", action: "Complete the PHQ-9; chart mood on the timeline; ask how long mood changes last and what triggers them." },
        { result: "Any 2-3 in psychosis, stress, sleep, substances, addictions, autism, development or motor", means: "'At risk' sections that need a closer look.", action: "Use the matching screen or interview questions; see the Differential diagnosis step." },
        { result: "Several of the first six personality items at 2-3", means: "Possible borderline personality traits.", action: "MSI-BPD and a careful interview about identity, emptiness, abandonment fears and self-harm." },
        { result: "Few flags anywhere", means: "Little reported, which may reflect low insight or minimisation.", action: "Still take a full psychiatric history: a checklist can miss things." }
      ],
      example: {
        html:
          "<p><strong>Robin, 24, student.</strong> Items rated 2-3 by section:</p>" +
          "<table><thead><tr><th>Section</th><th>Items at 2-3</th><th>CADDRA guide</th><th>Flag?</th></tr></thead><tbody>" +
          "<tr><td>Attention</td><td>7</td><td>5</td><td>Yes</td></tr>" +
          "<tr><td>Hyperactivity-impulsivity</td><td>3</td><td>5</td><td>No</td></tr>" +
          "<tr><td>Depression</td><td>2</td><td>5</td><td>No</td></tr>" +
          "<tr><td>Mood regulation</td><td>4</td><td>3</td><td>Yes</td></tr>" +
          "<tr><td>Sleep</td><td>2 (getting to sleep)</td><td>any</td><td>At risk</td></tr>" +
          "<tr><td>Substance use</td><td>1 (cannabis, severe)</td><td>any</td><td>At risk</td></tr>" +
          "<tr><td>Suicide</td><td>0 (one item rated mild)</td><td>any at 2-3</td><td>Ask anyway</td></tr>" +
          "<tr><td>Personality, first six items</td><td>2</td><td>-</td><td>Explore</td></tr>" +
          "</tbody></table>" +
          "<p><strong>Plan before the appointment:</strong> a clinician calls about the mild suicide rating (C-SSRS screen). Add a PHQ-9, AUDIT and DAST-10. At interview, explore sleep onset (insomnia or delayed sleep phase), whether mood regulation problems are brief reactions that settle within hours (as in ADHD) or longer and tied to relationships (borderline traits), and whether cannabis use began before or after the attention problems.</p>",
        takeaway: "The WSR-II tells you which doors to open, not what is behind them."
      },
      pitfalls: [
        "Reading section counts as diagnoses.",
        "Using the 2018 thresholds without checking the current form.",
        "Missing a mild rating on a suicide item because it is below the 'at risk' rule.",
        "Not following up flagged sections with a specific tool or interview.",
        "Forgetting that self-report overlaps across sections: restlessness, poor concentration and poor sleep appear in several."
      ],
      feedsInto: "Co-occurring conditions screen (choose which tools to add), Safety and risk (suicide section) and Differential diagnosis (sections that point to mimics).",
      strength: "Free and broad (CADDRA). The section thresholds are CADDRA clinical guides; no published accuracy data for adults were found. Use it to choose follow-up tools, not to diagnose."
    },

    {
      id: "phq9", tool: "phq9", title: "PHQ-9: Patient Health Questionnaire (depression)", kind: "self",
      what:
        "<p>Nine questions about the <strong>last 2 weeks</strong> (Kroenke, Spitzer and Williams 2001), each rated 0 (not at all) to 3 (nearly every day); total 0-27. The items follow the DSM criteria for a major depressive episode. <strong>Item 9</strong> asks about thoughts of being better off dead or of self-harm. A tenth question about how difficult the problems have made life is not scored. Free: no permission is needed to reproduce it.</p>" +
        "<p><strong>Why it is sent:</strong> depression is common in adults referred for ADHD, can mimic it and often co-occurs. Item 9 is a safety question that must be read the day the form arrives.</p>",
      recommendedBy: [
        "CADDRA 4.1: general screener alongside WSR-II and GAD-7",
        "NICE NG222 (2022): PHQ-9 16 or more as 'more severe' depression; routine outcome monitoring",
        "UKAAN AQAS 2024: screening for common mental health problems essential; depression scales optional",
        "RCPsych CR235 section 10: major mood disorders should be treated before assessing for ADHD"
      ],
      whenSent: "In every pack. If the wait is long, repeat it near the appointment: it covers only 2 weeks.",
      who: "The patient.",
      time: "A few minutes.",
      howToRead:
        "<ol><li><strong>Item 9 first.</strong> Any score of 1 or more needs a clinician's enquiry before the appointment (C-SSRS screen). A low total never 'clears' a positive item 9.</li>" +
        "<li><strong>Add the 9 items</strong> (0-27).</li>" +
        "<li><strong>Bands</strong> (PHQ manual): 0-4 minimal; 5-9 mild; 10-14 moderate; 15-19 moderately severe; 20-27 severe. 10 or more is the usual screening cut-off. NICE NG222 uses below 16 as less severe and 16 or more as more severe.</li>" +
        "<li><strong>Provisional algorithm</strong> (manual): a major depressive syndrome needs item 1 or item 2 plus five or more items at 'more than half the days' or above (item 9 counts if present at all). It also needs bereavement, a history of mania and physical or drug causes ruled out.</li>" +
        "<li><strong>Read the core items</strong> (1 interest, 2 low mood) separately from the items ADHD can drive: 3 sleep, 4 energy, 7 concentration, 8 restlessness, and 6 feeling a failure (clinical reasoning from item content).</li>" +
        "<li>For each overlap item, ask: <em>is this new in the last 2 weeks, or how you have always been?</em></li></ol>",
      meaning: [
        { result: "Item 9 scored 1, 2 or 3", means: "Thoughts of death or self-harm endorsed. Item 9 mixes passive wishes and active thoughts: in depression clinic patients, against an electronic C-SSRS, a score of 1 or more had a sensitivity of 87.6% but a PPV of only 28.6% for suicidal ideation with intent or recent suicidal behaviour (Na 2018). Risk still rises with frequency: one-year suicide attempt risk rose from 0.4% at 'not at all' to 4% at 'nearly every day' (Simon 2013).", action: "Clinician enquiry before the appointment (C-SSRS screen) and a safety plan. Do not label risk as low, medium or high (NICE NG225 1.6.1-1.6.3)." },
        { result: "0-4", means: "Minimal depressive symptoms.", action: "Record as a baseline." },
        { result: "5-9 (mild)", means: "Often driven by overlap items in ADHD.", action: "Check items 1 and 2; repeat later." },
        { result: "10-14 (moderate)", means: "Probable depression: at 10 or more, sensitivity 0.88 and specificity 0.85 against semi-structured interviews (Levis 2019).", action: "Assess for a depressive episode at interview, with timing against the ADHD symptoms." },
        { result: "15-27 (moderately severe or severe; NICE 'more severe' from 16)", means: "Significant depression is likely.", action: "Assess risk and treat or refer for depression. CR235: treat major mood disorders before assessing ADHD; consider deferring the ADHD decision until mood improves." }
      ],
      example: {
        html:
          "<p><strong>Sam, 34</strong> (the ASRS example). PHQ-9 answers:</p>" +
          "<table><thead><tr><th>Item</th><th>Score</th><th>Sam's comment at interview</th></tr></thead><tbody>" +
          "<tr><td>1 Interest</td><td>1</td><td>A few days after a reprimand at work</td></tr>" +
          "<tr><td>2 Low mood</td><td>1</td><td>Same few days</td></tr>" +
          "<tr><td>3 Sleep</td><td>3</td><td>'Can't switch off at night; always been like that'</td></tr>" +
          "<tr><td>4 Energy</td><td>2</td><td>Tired from late nights</td></tr>" +
          "<tr><td>5 Appetite</td><td>0</td><td></td></tr>" +
          "<tr><td>6 Failure</td><td>2</td><td>'I've always felt I underachieve'</td></tr>" +
          "<tr><td>7 Concentration</td><td>3</td><td>'Lifelong'</td></tr>" +
          "<tr><td>8 Restlessness</td><td>2</td><td>Fidgety in meetings, as always</td></tr>" +
          "<tr><td>9 Self-harm thoughts</td><td>0</td><td></td></tr>" +
          "<tr><td><strong>Total</strong></td><td><strong>14</strong></td><td>Moderate band</td></tr>" +
          "</tbody></table>" +
          "<p><strong>Reasoning:</strong> 10 of the 14 points come from items 3, 4, 7 and 8. The core items score 1 each. Five items are at 'more than half the days', but neither item 1 nor item 2 is, so the provisional algorithm for major depressive syndrome is not met.</p>" +
          "<p><strong>Base rates:</strong> at an illustrative 20% prevalence of current depression among adults referred for ADHD assessment, with sensitivity 0.88 and specificity 0.85, of 100 people about 18 true and 12 false positives score 10 or more: PPV about 60%. Sam's item pattern makes depression less likely than that figure.</p>" +
          "<p><strong>Plan:</strong> still explore mood properly at interview; explore sleep (insomnia, delayed sleep phase); repeat the PHQ-9 after any ADHD treatment.</p>",
        takeaway: "A PHQ-9 above 10 in an ADHD referral may be built mostly from items ADHD itself drives. Read items 1, 2 and 9 first, then ask 'new or always?' for the rest."
      },
      pitfalls: [
        "Adding the total without reading item 9.",
        "Counting lifelong concentration, sleep and restlessness problems as new depressive symptoms.",
        "Forgetting that stimulant side effects raise items 3 and 5 in treated patients.",
        "Treating a score of 10 or more as a diagnosis of depression.",
        "Missing bipolar disorder: the PHQ algorithm assumes a history of mania has been ruled out.",
        "Trusting a low score from someone who minimises distress."
      ],
      feedsInto: "Co-occurring conditions screen: the app scores it and flags item 9. Item 9 feeds Safety and risk; the result feeds the depression review in Differential diagnosis; the total is a baseline in Report and next steps.",
      strength: "Well validated: at 10 or more, sensitivity 0.88 and specificity 0.85 for major depression (Levis 2019 meta-analysis). Item overlap with ADHD lowers its specificity in ADHD clinics (clinical reasoning; no ADHD-specific validation found)."
    },

    {
      id: "gad7", tool: "gad7", title: "GAD-7: Generalized Anxiety Disorder scale", kind: "self",
      what:
        "<p>Seven questions about the <strong>last 2 weeks</strong> (Spitzer et al. 2006), each 0-3; total 0-21. Designed for generalised anxiety disorder, it also screens reasonably well for panic disorder, social anxiety disorder and PTSD (Kroenke 2007), but cannot tell them apart. Free: no permission needed.</p>" +
        "<p><strong>Why it is sent:</strong> anxiety is very common in adults with ADHD and can mimic it: inattention and restlessness that occur only when anxious point to anxiety (CADDRA 4.1; ICD-11).</p>",
      recommendedBy: [
        "CADDRA 4.1: general screener",
        "UKAAN AQAS 2024: anxiety scales optional; mental health screening essential",
        "RCPsych CR235 9.7.3: anxiety differential (timeline, triggers, physical symptoms, content of racing thoughts)"
      ],
      whenSent: "In every pack, with the PHQ-9.",
      who: "The patient.",
      time: "A few minutes.",
      howToRead:
        "<ol><li><strong>Add the 7 items</strong> (0-21).</li>" +
        "<li><strong>Bands</strong> (manual): 5, 10 and 15 mark mild, moderate and severe anxiety. 10 or more is the recommended point for further evaluation.</li>" +
        "<li><strong>Split the items</strong> (clinical reasoning from item content): worry and fear items 1, 2, 3 and 7, and items 4 (trouble relaxing), 5 (restlessness) and 6 (irritability), which overlap with ADHD hyperactivity and emotional dysregulation.</li>" +
        "<li><strong>Ask about the worry:</strong> what it is about, whether it is realistic and tied to real failures (more typical in ADHD, CADDRA), and whether inattention happens only when anxious.</li>" +
        "<li>Ask about physical symptoms (palpitations, nausea, breathlessness, tremor), panic attacks, social fears and trauma.</li></ol>",
      meaning: [
        { result: "0-4", means: "Minimal anxiety.", action: "Record as a baseline." },
        { result: "5-9 (mild)", means: "Mild anxiety, or ADHD restlessness and irritability.", action: "Read the item pattern." },
        { result: "10-14 (moderate)", means: "Probable anxiety disorder: at 10, sensitivity 89% and specificity 82% for generalised anxiety disorder (Spitzer 2006).", action: "Assess anxiety disorders at interview: worry content, onset, situations, physical symptoms." },
        { result: "15-21 (severe)", means: "Severe anxiety.", action: "Treat or refer. The European Consensus 2019 advises treating the most severe disorder first; severe anxiety is usually treated before ADHD." },
        { result: "High on items 4-6, low on items 1-3 and 7", means: "The restless, irritable pattern ADHD can produce without much worry.", action: "Ask whether these have always been present, independent of stress." }
      ],
      example: {
        html:
          "<p><strong>Lee, 30.</strong> Items 1-7: 1, 1, 1, 3, 3, 2, 0. <strong>Total 11</strong> (moderate).</p>" +
          "<table><thead><tr><th>Item group</th><th>Score</th><th>Maximum</th></tr></thead><tbody>" +
          "<tr><td>Worry and fear (1, 2, 3, 7)</td><td>3</td><td>12</td></tr>" +
          "<tr><td>Relaxing, restlessness, irritability (4, 5, 6)</td><td>8</td><td>9</td></tr>" +
          "</tbody></table>" +
          "<p><strong>Reasoning:</strong> the total passes 10, but 8 of the 11 points come from the three items ADHD can drive. Lee's worries are about deadlines already missed: realistic and linked to real failures. Restlessness is present on holiday too. Compare a person with generalised anxiety disorder, who typically scores high on items 1-3.</p>" +
          "<p><strong>Plan:</strong> a brief anxiety interview (physical symptoms, panic, social fears, onset); do not record an anxiety disorder on the score alone. Both can co-occur: CADDRA notes that up to about half of adults with ADHD have anxiety.</p>",
        takeaway: "Look at which items carry the GAD-7 total. Worry items point to anxiety; restlessness and irritability items alone may be ADHD."
      },
      pitfalls: [
        "Counting chronic restlessness and irritability as anxiety.",
        "Missing worry that is secondary to the consequences of ADHD (missed deadlines, debts).",
        "Missing a genuine anxiety disorder because ADHD seems to explain everything.",
        "Treating a high score as a specific diagnosis: the GAD-7 does not tell GAD, panic, social anxiety and PTSD apart.",
        "Forgetting the 2-week window."
      ],
      feedsInto: "Co-occurring conditions screen (app scores and bands it); Differential diagnosis (generalised anxiety, social anxiety, panic, PTSD); baseline in Report and next steps.",
      strength: "Good: at 10, sensitivity 89% and specificity 82% for generalised anxiety disorder (Spitzer 2006); AUC 0.80-0.91 for GAD, panic, social anxiety and PTSD (Kroenke 2007). Items 4-6 overlap with ADHD."
    },

    {
      id: "mdq", tool: "mdq", title: "MDQ: Mood Disorder Questionnaire (bipolar screen)", kind: "self",
      what:
        "<p>A lifetime screen for bipolar spectrum disorders (Hirschfeld et al. 2000). Question 1 has 13 yes/no items about a period when the person was 'not their usual self' (for example more talkative, racing thoughts, less need for sleep, more energy, risky behaviour, overspending). Question 2 asks whether several happened <strong>during the same period</strong>; question 3 how much of a problem they caused; questions 4 and 5 (family history, previous diagnosis) are not scored.</p>" +
        "<p>Copyright of the University of Texas Medical Branch; permission to reproduce the items was not confirmed, so this guide describes it.</p>" +
        "<p><strong>Why it is sent:</strong> bipolar disorder is a key differential and co-occurring condition, and it changes management. NICE CG185 1.2.3 says questionnaires should not be used in primary care to identify bipolar disorder, so in an ADHD assessment the MDQ is only a prompt for a structured history of mood episodes.</p>",
      recommendedBy: [
        "UKAAN AQAS 2024: screening for bipolar disorder is essential (no tool named)",
        "European Consensus 2019 section 6.3: distinguish bipolar disorder and cyclothymia",
        "RCPsych CR235 9.7.1: affective instability versus bipolar disorder; explore the time course with a third party",
        "NICE CG185 1.2.3: do not use questionnaires in primary care to identify bipolar disorder"
      ],
      whenSent: "When the referral, history or WSR-II mentions mood swings, periods of high energy, antidepressant-related highs or a family history of bipolar disorder. Some services send it to everyone.",
      who: "The patient; a partner or relative can add an account of any episodes.",
      time: "A few minutes.",
      howToRead:
        "<ol><li>Count the 'yes' answers in question 1 (0-13).</li>" +
        "<li><strong>Positive screen only if all three:</strong> 7 or more yes in question 1, AND yes to question 2 (same period), AND 'moderate' or 'serious' problem in question 3.</li>" +
        "<li><strong>Read which items were endorsed.</strong> Distractibility, talkativeness, racing thoughts, more activity, risk-taking and overspending also describe chronic ADHD traits. Elevated mood, increased self-confidence and less need for sleep without tiredness point more towards hypomania (CADDRA 4.1 differentiation).</li>" +
        "<li><strong>Test question 2:</strong> was there a distinct period, lasting days to weeks, clearly different from the usual self, with a start and an end? Or is this 'always me'?</li>" +
        "<li>Note family history and any previous diagnosis (questions 4 and 5): they change the prior probability.</li></ol>",
      meaning: [
        { result: "Positive screen (all three criteria met)", means: "In psychiatric outpatients, sensitivity 0.73 and specificity 0.90 (Hirschfeld 2000). But 50.2% of adults with ADHD screened positive, against 5% of controls (Lundervold 2020).", action: "Take a structured episode history with an informant. Do not record bipolar disorder on the score." },
        { result: "7 or more items, but no to question 2 or only a minor problem", means: "Negative by the rule; often chronic traits rather than an episode.", action: "Ask about episodes anyway if other pointers exist." },
        { result: "Fewer than 7 items", means: "Negative, but sensitivity in the general population was only 0.28 (Hirschfeld 2003): it misses many people with bipolar disorder, especially milder hypomania.", action: "If there is a family history, antidepressant-related highs or an episodic course, take the episode history anyway." },
        { result: "Elevated mood and less need for sleep within a distinct episode", means: "More specific pointers to hypomania or mania.", action: "Prioritise the mood assessment; bipolar disorder is usually stabilised before ADHD treatment (CADDRA 4.1; European Consensus 2019)." },
        { result: "Family history of bipolar disorder (question 4)", means: "Raises the prior probability.", action: "Take a careful episode history and ask an informant." }
      ],
      example: {
        html:
          "<p><strong>Sasha, 28.</strong> Question 1: yes to 9 of 13 (talkative, racing thoughts, easily distracted, more energy, more active, more sociable, risky behaviour, overspending, irritable). No to elevated mood, more self-confidence, less need for sleep and more interest in sex. Question 2: yes. Question 3: serious. <strong>Screen positive.</strong></p>" +
          "<p><strong>Reasoning:</strong> every endorsed item also describes chronic ADHD traits, and the four items more typical of hypomania were not endorsed. Asked about question 2, Sasha says 'they all happen together, all the time'. There is no distinct period of change, and late nights are followed by tiredness, not by energy without sleep. The partner confirms no episodes.</p>" +
          "<p><strong>Base rates:</strong> about half of adults with ADHD screen positive (Lundervold 2020). A meta-analysis estimated bipolar disorder in about 8% of adults with ADHD (7.95%; Schiweck 2021). So of 100 adults with ADHD, about 50 screen positive, and even if all 8 with bipolar disorder were among them, at most about 8 in 50 (16%) of the positives would have it.</p>" +
          "<p><strong>Conclusion:</strong> the positive screen most likely reflects lifelong traits. Record the episode history and the informant's account; keep bipolar disorder in mind at follow-up, especially if medication is started.</p>",
        takeaway: "In an ADHD clinic, a positive MDQ is common and usually reflects traits. The episode history, not the score, separates bipolar disorder from ADHD."
      },
      pitfalls: [
        "Answering question 2 'yes' for lifelong traits that are always present together.",
        "Confusing delayed sleep (tired the next day) with less need for sleep (not tired).",
        "Using it to identify bipolar disorder in primary care (NICE CG185 1.2.3).",
        "Missing bipolar II: a negative screen does not exclude it.",
        "Ignoring highs triggered by antidepressants or stimulants.",
        "Reproducing the items without permission."
      ],
      feedsInto: "Co-occurring conditions screen (the app applies the three-part rule); Differential diagnosis (bipolar disorder, cyclothymia); mood episodes on the Clinical history timeline.",
      strength: "Moderate in psychiatric outpatients (sensitivity 0.73, specificity 0.90; Hirschfeld 2000), poor sensitivity in the general population (0.28; Hirschfeld 2003) and poor specificity in adult ADHD (50.2% positive; Lundervold 2020). A prompt for an episode history only."
    },
    {
      id: "audit", tool: "audit", title: "AUDIT and AUDIT-C: alcohol use", kind: "self",
      what:
        "<p>The WHO Alcohol Use Disorders Identification Test (Saunders et al. 1993; WHO manual 2001). Ten items about the <strong>past year</strong>: items 1-3 consumption, 4-6 dependence, 7-10 harm; total 0-40. <strong>AUDIT-C</strong> is items 1-3 alone (0-12). The UK version (Office for Health Improvement and Disparities) asks in units; item 3 asks about 6 or more units on one occasion for women, 8 or more for men.</p>" +
        "<p>Free for non-commercial use (WHO); the UK forms are under the Open Government Licence.</p>" +
        "<p><strong>Why it is sent:</strong> alcohol use is common in adults with ADHD, can mimic or worsen inattention, sleep and mood, and matters for medication safety (NICE NG87 1.7.4 asks for a substance misuse risk assessment before medication).</p>",
      recommendedBy: [
        "NICE CG115 1.2.1.4: AUDIT for identification and as a routine outcome measure",
        "UKAAN AQAS 2024: substance misuse must be explored (essential)",
        "NICE NG87 1.7.4: risk assessment for substance misuse and diversion before medication",
        "RCPsych CR235 9.7.6 and section 11: intoxication and withdrawal mimic ADHD; controlled misuse should not completely preclude treatment"
      ],
      whenSent: "AUDIT-C in every pack, expanding to the full AUDIT when AUDIT-C is 5 or more (as the UK form directs); or the full AUDIT for everyone.",
      who: "The patient.",
      time: "A few minutes.",
      howToRead:
        "<ol><li><strong>AUDIT-C:</strong> add items 1-3 (0-12). UK form: 0-4 low risk; 5-7 increasing risk; 8-10 higher risk; 11-12 possible dependence. <strong>5 or more is positive:</strong> complete the full AUDIT.</li>" +
        "<li><strong>Full AUDIT:</strong> items 1-8 score 0-4; items 9 and 10 score 0 (no), 2 (yes, but not in the last year) or 4 (yes, in the last year).</li>" +
        "<li><strong>Zones</strong> (UK form): 0-7 low risk; 8-15 increasing risk; 16-19 higher risk; 20 or more possible dependence. WHO: 8 or more indicates hazardous or harmful use; consider 7 for women and people over 65.</li>" +
        "<li><strong>WHO step-up rule:</strong> offer the next level of intervention if items 4, 5 or 6 score 2 or more, or item 9 or 10 scores 4.</li>" +
        "<li><strong>Read the pattern:</strong> binge drinking (item 3), dependence (4-6), harm (7-10).</li>" +
        "<li><strong>Link it to the ADHD question:</strong> when did drinking start compared with the attention problems? Is it used to sleep or 'switch off'? Are the attention problems present when sober? ICD-11: the key tests are the order of onset and persistence without intoxication.</li>" +
        "<li>Check items 5 (failing to do what was expected) and 8 (memory gaps): ask whether these happen only after drinking, or also through everyday forgetfulness.</li></ol>",
      meaning: [
        { result: "AUDIT-C 0-4, or AUDIT 0-7", means: "Low-risk drinking.", action: "Record; ask briefly about other substances." },
        { result: "AUDIT 8-15 (increasing risk)", means: "Hazardous drinking.", action: "Brief advice (UK form). Ask how drinking affects sleep, mood and attention." },
        { result: "AUDIT 16-19 (higher risk)", means: "Harmful drinking likely.", action: "Brief advice, counselling and monitoring (WHO). Assess ADHD symptoms in sober periods and before drinking began." },
        { result: "AUDIT 20 or more (possible dependence)", means: "Possible alcohol dependence.", action: "Consider referral for specialist alcohol assessment (UK form); check withdrawal risk. Substance use disorders are usually treated first (European Consensus 2019); the ADHD decision may need to wait until use is stable." },
        { result: "Items 4-6 at 2 or more, or item 9 or 10 at 4", means: "Dependence features or recent harm, whatever the total.", action: "Step up one level of intervention (WHO)." }
      ],
      example: {
        html:
          "<p><strong>Ash, 33, man.</strong> AUDIT-C: item 1 two to three times a week (3), item 2 five to six units (2), item 3 eight or more units weekly (3). <strong>AUDIT-C 8</strong> (higher risk), so the full AUDIT follows.</p>" +
          "<table><thead><tr><th>Item</th><th>Theme</th><th>Score</th></tr></thead><tbody>" +
          "<tr><td>4</td><td>Unable to stop once started</td><td>1</td></tr>" +
          "<tr><td>5</td><td>Failed to do what was expected</td><td>2</td></tr>" +
          "<tr><td>6</td><td>Morning drink</td><td>0</td></tr>" +
          "<tr><td>7</td><td>Guilt after drinking</td><td>1</td></tr>" +
          "<tr><td>8</td><td>Could not remember the night before</td><td>2</td></tr>" +
          "<tr><td>9</td><td>Injury</td><td>0</td></tr>" +
          "<tr><td>10</td><td>Others concerned, in the last year</td><td>4</td></tr>" +
          "</tbody></table>" +
          "<p><strong>Total 18</strong>: higher-risk zone. Item 5 at 2 and item 10 at 4 trigger the WHO step-up, so the next level (specialist assessment) should be considered.</p>" +
          "<p><strong>Reasoning:</strong> Ash drinks most evenings to 'switch off'. Drinking began at 16; Year 3 and Year 5 reports already describe a distracted, fidgety child. So alcohol did not start the difficulties, but it may be worsening attention and sleep now. Ask whether missed obligations and memory gaps happen only after drinking.</p>" +
          "<p><strong>Plan:</strong> brief intervention now and discussion of specialist support; assess ADHD symptoms against sober periods; complete the DAST-10; record the substance misuse risk assessment needed before any medication (NG87 1.7.4).</p>",
        takeaway: "AUDIT tells you how much risk alcohol carries; the timeline tells you whether it explains the attention problems, adds to them or came after them."
      },
      pitfalls: [
        "Confusing units and drinks, or US and UK versions of item 2 and item 3.",
        "Skipping the full AUDIT after a positive AUDIT-C.",
        "Using the same cut-off for everyone: WHO suggests 7 for women and people over 65.",
        "Under-reporting, especially early in an assessment.",
        "Reading items 5 and 8 as alcohol harm when they also reflect ADHD forgetfulness.",
        "Forgetting the past-year time frame: ask about lifetime heavy use too."
      ],
      feedsInto: "Co-occurring conditions screen (the app scores AUDIT-C and AUDIT); Differential diagnosis (alcohol use disorder); Safety and risk; Report and next steps (substance misuse risk before medication).",
      strength: "Strong: at 8, sensitivities generally in the mid-0.90s and specificities around 0.80s in the WHO development study (WHO manual 2001); NICE CG115's tool for identification and outcome. Not ADHD-specific: the timing decides its meaning."
    },

    {
      id: "dast10", tool: "dast10", title: "DAST-10: Drug Abuse Screening Test", kind: "self",
      what:
        "<p>Ten yes/no questions about drug use in the <strong>past 12 months</strong>, excluding alcohol (Skinner 1982; short form). 'Drug use' includes prescribed or over-the-counter medicines taken in excess of the directions and any non-medical use. Score 0-10; question 3 is reverse-keyed. Free for non-commercial clinical, research and training use with credit to the author.</p>" +
        "<p><strong>Why it is sent:</strong> cannabis and stimulant use are common in adults with ADHD and can mimic or worsen symptoms (ICD-11), and non-prescribed stimulant use matters for diversion risk (NICE NG87 1.7.4).</p>",
      recommendedBy: [
        "UKAAN AQAS 2024: substance misuse must be explored (essential)",
        "NICE NG87 1.7.4: risk assessment for substance misuse and drug diversion before medication",
        "CADDRA 4.1 chapter 3: screen students and young adults for substance use; lifetime non-prescribed stimulant use in students 5-43%",
        "ICD-11 CDDR: substances can mimic ADHD; order of onset and persistence when not intoxicated are the key tests"
      ],
      whenSent: "In every pack, with the AUDIT.",
      who: "The patient.",
      time: "A few minutes.",
      howToRead:
        "<ol><li>Check the patient understood the preamble: prescribed medicines taken as directed do not count; extra doses, someone else's medicine or use for studying or partying do.</li>" +
        "<li><strong>Score 1 for each yes, except question 3</strong> (always able to stop when wanted), where <strong>no</strong> scores 1.</li>" +
        "<li><strong>Bands</strong> (form): 0 no problems reported; 1-2 low level, monitor; 3-5 moderate, further investigation; 6-8 substantial, intensive assessment; 9-10 severe, intensive assessment.</li>" +
        "<li><strong>Ask which drugs</strong>, how often, and why: cannabis for sleep or restlessness; cocaine or amphetamine; non-prescribed ADHD medicines; sedatives; opioids.</li>" +
        "<li><strong>Timeline:</strong> did the attention problems start before the drug use? Are they present during abstinence?</li>" +
        "<li><strong>Diversion:</strong> is anyone else's stimulant being used, shared or sold?</li></ol>",
      meaning: [
        { result: "0", means: "No drug problems reported.", action: "Record; recheck if the interview suggests otherwise." },
        { result: "1-2 (low)", means: "Low-level problems.", action: "Monitor; ask about the drugs used and their timing." },
        { result: "3-5 (moderate)", means: "Problems that need further investigation.", action: "Take a full substance history and consider how it affects the ADHD picture." },
        { result: "6-10 (substantial or severe)", means: "Significant drug-related problems.", action: "Intensive assessment and referral to substance misuse services; the ADHD decision may need to wait until use is stable." },
        { result: "Any use of non-prescribed stimulants", means: "Possible self-medication, misuse or diversion. CR235 lists a paradoxical response to illicit stimulant drugs among additional adult features, but a good response does not diagnose ADHD.", action: "Explore the pattern, source and motive; record the diversion risk; weigh it in Symptom validity and consistency if the person seeks medication." }
      ],
      example: {
        html:
          "<p><strong>Ellis, 21, university student.</strong> Yes to question 1 (non-medical use), question 2 (more than one drug at a time), question 5 (feels guilty) and question 6 (parents complain). Yes to question 3 (always able to stop), which scores 0. <strong>Score 4</strong>: moderate, further investigation.</p>" +
          "<p>At interview: cannabis most nights since 17 'to get to sleep'; a friend's prescribed ADHD stimulant twice before exams, 'and I felt calm and focused'. Year 4 and Year 6 reports describe a distracted, chatty child who rarely finished work.</p>" +
          "<p><strong>Reasoning:</strong> the attention problems appear in primary school, years before cannabis use, which favours ADHD with later substance use. Nightly cannabis may still be adding to current problems with memory, motivation and sleep. The borrowed stimulant matters twice: as diversion, and because students sometimes overstate symptoms to obtain stimulants (CADDRA 4.1). A calm response does not establish the diagnosis.</p>" +
          "<p><strong>Plan:</strong> substance history with dates; advice on cannabis and sleep; review ADHD symptoms during any period of abstinence; school reports and a parent account already support childhood onset; document diversion risk before any medication (NG87 1.7.4).</p>",
        takeaway: "With drug use, date everything: symptoms that began before the drug use and persist without it point to ADHD; symptoms that came with it may be caused by it."
      },
      pitfalls: [
        "Mis-scoring question 3, which is reverse-keyed.",
        "Patients counting prescribed medicines taken as directed, or not counting misused prescriptions.",
        "Ignoring cannabis used 'only for sleep'.",
        "Taking a good response to someone else's stimulant as proof of ADHD.",
        "Forgetting that the score covers only the last 12 months.",
        "Using it commercially without permission: the free licence is for non-commercial use with credit to Dr Skinner."
      ],
      feedsInto: "Co-occurring conditions screen (the app scores it, with question 3 reverse-keyed); Differential diagnosis (cannabis and stimulant use disorders); Safety and risk; Symptom validity and consistency (stimulant-seeking); Report (diversion risk before medication).",
      strength: "Reviews describe moderate to high validity, sensitivity and specificity across DAST versions (Yudko 2007); specific DAST-10 figures could not be verified. Its value in an ADHD assessment is the substance timeline it prompts."
    },

    {
      id: "aq10", tool: "aq10", title: "AQ-10: Autism Spectrum Quotient, 10 items", kind: "self",
      what:
        "<p>A 10-item screen for autistic traits in adults without moderate or severe learning disability (Allison, Auyeung and Baron-Cohen 2012). Each statement is rated definitely agree, slightly agree, slightly disagree or definitely disagree; each item scores 0 or 1; total 0-10. Free for non-profit use, including research and education (Autism Research Centre).</p>" +
        "<p><strong>Why it is sent:</strong> autism and ADHD often co-occur and share features. NICE CG142 1.2.2 counts a history of a neurodevelopmental condition, including ADHD, as one of the factors that, together with persistent social, communication or repetitive features, should prompt consideration of an autism assessment; 1.2.3 names the AQ-10.</p>",
      recommendedBy: [
        "NICE CG142 1.2.3 (amended 2021): consider the AQ-10; offer a comprehensive autism assessment at 6 or above, or when autism is suspected clinically",
        "UKAAN AQAS 2024: comorbidity questionnaires such as the AQ-10 (optional); screening for other neurodevelopmental conditions essential",
        "RCPsych CR235 (2023) Box 1: AQ-10 desired with a referral",
        "UKAP ADHD and autism consensus (2020): when one condition is present, consider the other"
      ],
      whenSent: "In every pack, or when the referral, history or WSR-II mentions social difficulties, rigidity or sensory issues. If reading is difficult, it can be read out (NICE CG142).",
      who: "The patient.",
      time: "A few minutes.",
      howToRead:
        "<ol><li><strong>Score with the key:</strong> 1 point for definitely or slightly <strong>agree</strong> on items 1, 7, 8 and 10; 1 point for definitely or slightly <strong>disagree</strong> on items 2, 3, 4, 5, 6 and 9.</li>" +
        "<li><strong>Add the points</strong> (0-10). <strong>6 or more:</strong> consider a specialist autism assessment.</li>" +
        "<li><strong>Look at items 3 and 4</strong> (doing more than one thing at once; switching back quickly after an interruption). Both score on disagree, and adults with ADHD often disagree, so ADHD alone can add up to 2 points.</li>" +
        "<li>Look separately at the social understanding items (5, 6, 7, 9, 10) and the detail, sensory and interest items (1, 2, 8) (grouping by content, clinical practice).</li>" +
        "<li>Remember that anxiety can inflate AQ scores (Ashwood 2016) and that many autistic adults, especially women, mask.</li>" +
        "<li>The deciding evidence is the early social-communication history from an informant, not the score.</li></ol>",
      meaning: [
        { result: "6 or more", means: "Screen positive. In a case-control study, sensitivity 0.88, specificity 0.91, PPV 0.85 (Allison 2012). In adults referred to an autism service, specificity was only 0.29 (Ashwood 2016): many positives do not have autism.", action: "Take an autism-focused developmental history with an informant; offer or refer for a comprehensive autism assessment if the history supports it (NICE CG142 1.2.3)." },
        { result: "6 or more, with items 3 and 4 providing 2 of the points", means: "ADHD-related attention switching may be carrying the score over the line.", action: "Check the score without items 3 and 4, then rely on the social history." },
        { result: "Below 6", means: "Screen negative, but in the referral sample nearly two-thirds of people scoring below 6 were false negatives (Ashwood 2016).", action: "Assess for autism anyway if there is clinical suspicion or informant concern." },
        { result: "Clinical suspicion, whatever the score", means: "Persistent social-communication difficulties, rigid routines, restricted interests or sensory differences.", action: "NICE CG142 1.2.3: clinical judgement, including informant history, can trigger a comprehensive assessment." }
      ],
      example: {
        html:
          "<p><strong>Noor, 27.</strong> Points by item: 1 = 1, 2 = 1, 3 = 1, 4 = 1, 5 = 0, 6 = 0, 7 = 0, 8 = 1, 9 = 0, 10 = 1. <strong>Total 6</strong>: screen positive.</p>" +
          "<table><thead><tr><th>Item group</th><th>Points</th></tr></thead><tbody>" +
          "<tr><td>Attention switching (3, 4)</td><td>2 of 2</td></tr>" +
          "<tr><td>Detail, sensory, interests (1, 2, 8)</td><td>3 of 3</td></tr>" +
          "<tr><td>Social understanding (5, 6, 7, 9, 10)</td><td>1 of 5</td></tr>" +
          "</tbody></table>" +
          "<p><strong>Reasoning:</strong> without items 3 and 4 the score would be 4. Social understanding items are largely not endorsed. In a referral clinic, where specificity was 0.29, a positive AQ-10 is a weak signal. But detail focus, sensory sensitivity and collecting information are worth exploring, and autism and ADHD often co-occur.</p>" +
          "<p><strong>Plan:</strong> ask Noor's mother about early friendships (difficulty making friends suggests autism; difficulty keeping them is more typical of ADHD, CR235 9.7.4), play, routines and sensory reactions; refer for autism assessment if the history supports it; do not count the same symptom towards both conditions (UKAP 2020).</p>",
        takeaway: "In an ADHD clinic, read the AQ-10 items, not just the total: two of its points can come from attention switching, which is ADHD territory."
      },
      pitfalls: [
        "Quoting the case-control accuracy (Allison 2012) for a clinic population.",
        "Forgetting that ADHD can contribute up to 2 points through items 3 and 4.",
        "Using a low score to rule out autism, especially in women who mask.",
        "Using it with people with moderate or severe learning disability, for whom it is not intended.",
        "Missing anxiety as a cause of a raised score.",
        "Double-counting symptoms for autism and ADHD."
      ],
      feedsInto: "Co-occurring conditions screen (the app applies the scoring key); Differential diagnosis (autism); Clinical history (early social development).",
      strength: "Good accuracy in a case-control study (cut-off 6: sensitivity 0.88, specificity 0.91; Allison 2012) but no better than chance in adults referred to an autism service (sensitivity 0.77, specificity 0.29; Ashwood 2016). NICE's named screen; clinical judgement overrides it."
    },

    {
      id: "pcl5", tool: "pcl5", title: "PCL-5: PTSD Checklist for DSM-5", kind: "self",
      what:
        "<p>Twenty items about the <strong>past month</strong>, anchored to the person's worst stressful event, each rated 0 (not at all) to 4 (extremely); total 0-80 (US National Center for PTSD, 2013; public domain). Items follow the four DSM-5 clusters: B intrusions (1-5), C avoidance (6-7), D negative changes in thinking and mood (8-14), E arousal and reactivity (15-20).</p>" +
        "<p>It does not establish that a qualifying traumatic event happened; the version with the Life Events Checklist and a criterion A section does.</p>" +
        "<p><strong>Why it is sent:</strong> trauma and PTSD can mimic, mask or co-occur with ADHD, and several arousal items describe ADHD-like behaviour.</p>",
      recommendedBy: [
        "UKAAN AQAS 2024: traumatic experiences in childhood and adolescence must be explored (essential)",
        "RCPsych CR235 9.7.2 and 11.5: complex PTSD differential; trauma-informed approach; trauma can mask ADHD",
        "CADDRA 4.1 chapter 2: screen for trauma; a trauma history does not automatically exclude ADHD",
        "ICD-11 CDDR: trauma and grief can produce ADHD-like symptoms"
      ],
      whenSent: "When the referral or history mentions trauma, or as part of a standard pack. Tell the patient they can leave it for the appointment if it is distressing.",
      who: "The patient.",
      time: "A few minutes.",
      howToRead:
        "<ol><li><strong>Check the event:</strong> what happened, when, and whether it meets criterion A (use the version with the Life Events Checklist).</li>" +
        "<li><strong>Add the 20 items</strong> (0-80). A total of <strong>31-33 or more</strong> suggests probable PTSD (National Center for PTSD). There are no published severity bands.</li>" +
        "<li><strong>Optional DSM-5 rule:</strong> count items at 2 or more as endorsed; probable PTSD needs at least 1 cluster B, 1 cluster C, 2 cluster D and 2 cluster E items. The National Center for PTSD says the cut-off tends to be more reliable than this rule.</li>" +
        "<li><strong>Read the cluster pattern.</strong> Items 15 (irritability, outbursts), 16 (risk-taking), 19 (concentration) and 20 (sleep) can reflect ADHD (clinical reasoning). Item 8 (memory gaps for the event) is a PTSD symptom, but it can also reflect poor attention at the time, intoxication or a head injury during the event: ask. High cluster E with low B and C should prompt: were these present before the trauma, or since childhood?</li>" +
        "<li>Consider complex PTSD (the ITQ covers ICD-11 PTSD and complex PTSD).</li>" +
        "<li>For monitoring, a change of 10 points suggests a response to treatment.</li></ol>",
      meaning: [
        { result: "31-33 or more, with intrusion and avoidance items endorsed", means: "Probable PTSD (31-33 was optimally efficient against the CAPS-5; Bovin 2016).", action: "Clinical PTSD assessment, trauma-informed. Date the ADHD-like symptoms against the trauma. Consider complex PTSD." },
        { result: "31-33 or more, carried mainly by cluster E", means: "Arousal items that ADHD can drive are lifting the total.", action: "Ask whether the irritability, risk-taking, poor concentration and poor sleep predate the event; seek school reports from before it." },
        { result: "Below 31", means: "Probable PTSD less likely, but symptoms below the cut-off can still matter.", action: "Ask about trauma and its impact at interview." },
        { result: "No qualifying event, or event not identified", means: "The score cannot be read as PTSD.", action: "Explore stressors; consider other causes of the symptoms." },
        { result: "Major trauma before 12, ADHD-like symptoms afterwards", means: "Trauma may explain the symptoms, or ADHD may have been present before (CADDRA's summary grid lists major trauma before 12 as an alternative explanation).", action: "Look for evidence from before the trauma; both conditions can be present." }
      ],
      example: {
        html:
          "<p><strong>Mo, 37</strong>, assaulted 3 years ago.</p>" +
          "<table><thead><tr><th>Cluster</th><th>Item scores</th><th>Total</th><th>Items at 2 or more</th></tr></thead><tbody>" +
          "<tr><td>B intrusions (1-5)</td><td>1, 0, 0, 2, 1</td><td>4</td><td>1</td></tr>" +
          "<tr><td>C avoidance (6-7)</td><td>1, 1</td><td>2</td><td>0</td></tr>" +
          "<tr><td>D thinking and mood (8-14)</td><td>3, 1, 1, 2, 1, 1, 1</td><td>10</td><td>2</td></tr>" +
          "<tr><td>E arousal and reactivity (15-20)</td><td>3, 3, 2, 1, 4, 3</td><td>16</td><td>5</td></tr>" +
          "<tr><td><strong>Total</strong></td><td></td><td><strong>32</strong></td><td></td></tr>" +
          "</tbody></table>" +
          "<p><strong>Reasoning:</strong> 32 falls in the 31-33 range, but half the points come from cluster E, with concentration (item 19) the highest. Intrusions and avoidance are low, and no cluster C item reaches 2, so the DSM-5 rule is not met. Item 8 (gaps in memory for the event) scored 3: ask whether Mo was knocked out or intoxicated during the assault, which would explain the gap differently from trauma-related amnesia. Mo's sister and a Year 5 report describe restlessness and temper long before the assault.</p>" +
          "<p><strong>Conclusion:</strong> PTSD is unlikely to be the main explanation for the attention problems, which predate the trauma. The assault still matters: assess its impact, offer help, and record it.</p>",
        takeaway: "In the PCL-5, see which clusters carry the score. ADHD-like problems live in cluster E; PTSD needs intrusions and avoidance, and a timeline that starts with the trauma."
      },
      pitfalls: [
        "Not checking that a qualifying event occurred.",
        "Reading a cluster E-heavy total as PTSD.",
        "Using the DSM-5 rule alone, which is less reliable than the cut-off.",
        "Sending trauma questions without support or a choice to defer.",
        "Missing complex PTSD, which the PCL-5 does not cover.",
        "Assuming trauma excludes ADHD, or that ADHD excludes PTSD: both can be present."
      ],
      feedsInto: "Co-occurring conditions screen (the app sums it and checks the cluster rule); Differential diagnosis (PTSD, complex PTSD); Clinical history (trauma timeline).",
      strength: "Good reliability (alpha .94-.96; test-retest .82-.84) and a cut-off of 31-33 optimally efficient against the CAPS-5 (Blevins 2015; Bovin 2016). Overlap with ADHD in cluster E means the pattern and timing matter more than the total."
    },
    {
      id: "msibpd", tool: "msibpd", title: "MSI-BPD: McLean Screening Instrument for Borderline Personality Disorder", kind: "self",
      what:
        "<p>A 10-item yes/no screen (Zanarini et al. 2003) whose items follow the DSM criteria for borderline personality disorder: unstable relationships, self-harm or suicide attempts, impulsivity, marked mood changes, intense anger, distrust, feelings of unreality, chronic emptiness, an unstable sense of self, and frantic efforts to avoid abandonment. Score 0-10. Permission to reproduce the items was not confirmed, so this guide describes it.</p>" +
        "<p><strong>Why it is sent:</strong> borderline personality disorder is one of the most important differentials and co-occurring conditions in adult ADHD. Impulsivity, anger, mood changes and unstable relationships occur in both.</p>",
      recommendedBy: [
        "European Consensus 2019 section 6.3: distinguish borderline personality disorder; in ADHD, impulsivity and anger are short-lived and thoughtless rather than driven",
        "RCPsych CR235 9.7.1: affective instability versus bipolar disorder and EUPD",
        "CADDRA 4.1 chapter 2: borderline personality disorder differentiation",
        "AADPA 2022 1.1.1: borderline personality disorder heads the adult groups with increased ADHD prevalence in its evidence review"
      ],
      whenSent: "When the referral, history or WSR-II mentions emotional instability, self-harm or chaotic relationships; some services include it for everyone.",
      who: "The patient.",
      time: "A few minutes.",
      howToRead:
        "<ol><li>Count the yes answers (0-10). <strong>7 or more is positive.</strong></li>" +
        "<li><strong>Split the items</strong> (from CADDRA 4.1 and the European Consensus 2019): those shared with ADHD (impulsivity, mood changes, anger, unstable relationships) and those more specific to borderline personality disorder (identity disturbance, chronic emptiness, abandonment fears, self-harm and suicide attempts, stress-related paranoia or dissociation).</li>" +
        "<li><strong>Self-harm or suicide attempts endorsed:</strong> follow up for risk, whatever the total.</li>" +
        "<li><strong>Ask about mood changes:</strong> what triggers them (rejection and relationships, or frustration and boredom), how long they last (ADHD-related mood changes usually settle within hours, European Consensus 2019), and whether they date from childhood.</li>" +
        "<li>Ask about trauma, which is common in both and relevant to complex PTSD.</li></ol>",
      meaning: [
        { result: "7 or more, including the more specific items", means: "Probable borderline personality disorder (cut-off 7: sensitivity .81, specificity .85; Zanarini 2003). It may co-occur with ADHD: lifetime BPD in 33.69% of people with ADHD against 5.17% in the general population (NESARC, cited by CADDRA).", action: "Personality assessment by interview; risk enquiry; date the ADHD symptoms back to childhood. Both can be diagnosed." },
        { result: "7 or more, carried by the shared items", means: "ADHD-related emotional dysregulation and impulsivity may explain much of the score.", action: "Explore identity, emptiness, abandonment fears and self-harm in detail before considering BPD." },
        { result: "Below 7", means: "Screen negative.", action: "Still ask about self-harm, relationships and identity if the history suggests it." },
        { result: "Self-harm or suicide attempts endorsed", means: "A safety issue, independent of the total.", action: "C-SSRS screen and a clinician conversation before the appointment." }
      ],
      example: {
        html:
          "<p><strong>Billie, 23.</strong> Yes to 7 of 10: unstable relationships, impulsivity, mood changes, anger, self-harm, chronic emptiness and fear of abandonment. <strong>Screen positive.</strong></p>" +
          "<p><strong>Reasoning:</strong> the four shared items alone would give 4, below the cut-off. The score passes 7 because of three items more specific to borderline personality disorder: self-harm, emptiness and abandonment fears. In the original study the screen was more accurate in people aged 25 or under (sensitivity .90, specificity .93), which fits Billie's age.</p>" +
          "<p><strong>Plan:</strong> risk enquiry about the self-harm before the appointment; at interview, explore identity, emptiness and the pattern of relationships, and whether mood changes are triggered by rejection and last days. Separately, establish whether inattention and restlessness were present in primary school (school reports, parent). Both conditions may be present.</p>",
        takeaway: "On the MSI-BPD, the items that ADHD shares cannot tell the two apart; the specific items and the childhood history can."
      },
      pitfalls: [
        "Treating a positive screen as a diagnosis, or attaching a personality disorder label from a questionnaire.",
        "Reading ADHD emotional dysregulation as borderline personality disorder, or missing BPD because ADHD seems to explain everything.",
        "Overlooking the self-harm item.",
        "Forgetting trauma, which is common in both.",
        "Applying it outside the validation sample (treatment-seeking adults aged 18-59) without caution.",
        "Reproducing the items without permission."
      ],
      feedsInto: "Co-occurring conditions screen; Differential diagnosis (borderline and antisocial personality disorder, complex PTSD); Safety and risk (self-harm item).",
      strength: "Cut-off 7: sensitivity .81 and specificity .85 against a structured interview in 200 treatment-seeking adults (Zanarini 2003). Not validated in ADHD samples, and several items overlap with ADHD."
    },

    {
      id: "stopbang", tool: "stopbang", title: "STOP-Bang and Epworth Sleepiness Scale: sleep apnoea and sleepiness", kind: "self",
      what:
        "<p><strong>STOP-Bang</strong> (Chung et al. 2008) is an 8-item yes/no screen for obstructive sleep apnoea: loud <strong>S</strong>noring, daytime <strong>T</strong>iredness, <strong>O</strong>bserved stopped breathing or choking, treated high blood <strong>P</strong>ressure, <strong>B</strong>MI above 35, <strong>A</strong>ge over 50, large <strong>N</strong>eck (40 cm or more), male <strong>G</strong>ender. It is the property of the University Health Network, Toronto, and needs permission for routine screening use: link to the official site rather than copying it.</p>" +
        "<p>The <strong>Epworth Sleepiness Scale</strong> (Johns 1991) asks how likely the person is to doze in 8 everyday situations, each 0-3; total 0-24. It is free for individual clinicians; organisations need a licence (Mapi Research Trust).</p>" +
        "<p><strong>Why they are sent:</strong> sleep apnoea and other sleep problems cause inattention, poor memory, fatigue and irritability, and attentional problems are reported in up to 95% of people with obstructive sleep apnoea. Sleep problems also co-occur with ADHD itself.</p>",
      recommendedBy: [
        "AADPA 2022: obstructive sleep apnoea and sleep deprivation are medical mimics",
        "CADDRA 4.1 chapter 2: sleep disorders among medical mimics; obesity is a risk factor for sleep apnoea",
        "RCPsych CR235 9.7.7: sleep disorders as medical causes of ADHD-like symptoms",
        "UKAAN AQAS 2024: ask about sleep (highly recommended)"
      ],
      whenSent: "When the referral or history mentions snoring, daytime sleepiness, obesity or high blood pressure, or when attention problems began in adulthood; some services include them for everyone.",
      who: "The patient; a bed partner can confirm snoring and pauses in breathing.",
      time: "A few minutes each.",
      howToRead:
        "<ol><li><strong>STOP-Bang:</strong> count the yes answers (0-8). 0-2 low risk; 3-4 intermediate; 5-8 high risk. Also high risk: 2 or more of the 4 STOP items plus male sex, or plus BMI above 35, or plus neck 40 cm or more.</li>" +
        "<li><strong>Epworth:</strong> add the 8 situations (0-24). American Thoracic Society bands: 0-10 normal; 11-12 mild; 13-15 moderate; 16-24 severe excessive daytime sleepiness.</li>" +
        "<li><strong>Take a sleep history:</strong> snoring, witnessed pauses, gasping, morning headaches, unrefreshing sleep, dozing (reading, TV, meetings, driving), alcohol or sedatives in the evening.</li>" +
        "<li><strong>Contrast with ADHD-related sleep problems:</strong> difficulty getting to sleep because thoughts will not switch off, a late body clock, restlessness rather than drowsiness.</li>" +
        "<li><strong>Timing:</strong> were the attention problems present in childhood, before snoring or weight gain?</li>" +
        "<li><strong>Driving:</strong> if the person is sleepy, give safety advice and check current DVLA guidance.</li></ol>",
      meaning: [
        { result: "STOP-Bang high risk (5-8, or a high-risk combination)", means: "Obstructive sleep apnoea is likely enough to investigate.", action: "Refer for a sleep study through the local sleep service. If the ADHD history is unclear, treat sleep apnoea first and reassess attention." },
        { result: "STOP-Bang intermediate (3-4)", means: "Possible sleep apnoea.", action: "Take a sleep history with the bed partner; refer if symptoms support it." },
        { result: "STOP-Bang low (0-2)", means: "Sleep apnoea less likely.", action: "Consider other sleep problems: insomnia, delayed sleep phase, restless legs, insufficient sleep." },
        { result: "Epworth 11 or more", means: "Excessive daytime sleepiness: think sleep apnoea, narcolepsy, insufficient sleep or sedating medicines. ADHD alone more often causes restlessness than dozing (clinical practice).", action: "Investigate the cause; advise on driving safety." },
        { result: "Epworth normal, with difficulty getting to sleep", means: "Points towards insomnia or a delayed sleep phase, both common in ADHD; adults with ADHD and sleep-onset insomnia had delayed melatonin onset (Van Veen 2010).", action: "Sleep diary; see the insomnia and delayed sleep phase differentials." }
      ],
      example: {
        html:
          "<p><strong>Pat, 52, man.</strong> Loud snoring, partner has seen pauses in breathing, tired all day, treated high blood pressure, BMI 33, neck 43 cm. STOP-Bang: S, T, O, P yes; B no; A, N, G yes. <strong>Score 7: high risk.</strong> Epworth <strong>15: moderate</strong> excessive daytime sleepiness.</p>" +
          "<p>Pat says concentration has 'gone downhill over the last five years', as weight increased. School reports describe a quiet, conscientious child.</p>" +
          "<p><strong>Reasoning:</strong> adult onset, a link with weight gain, sleepiness rather than restlessness, and no childhood evidence all point to sleep apnoea as the better explanation. In a review of interventional studies, inattention improved after sleep apnoea was treated in all six studies.</p>" +
          "<p><strong>Plan:</strong> refer for a sleep study; advise about driving while sleepy; review attention after treatment. The ADHD assessment can be completed afterwards if difficulties persist and the history supports a lifelong pattern.</p>",
        takeaway: "When attention problems start in adulthood with snoring and sleepiness, investigate and treat sleep first."
      },
      pitfalls: [
        "Copying STOP-Bang into a service form without permission from the University Health Network.",
        "Assuming every sleep problem in ADHD is a late body clock.",
        "Missing sleep apnoea in women, younger adults or people who are not obese.",
        "Scoring the Epworth when the person never does some of the situations without noting it.",
        "Forgetting that stimulants and caffeine can mask sleepiness.",
        "Forgetting that STOP-Bang was developed in surgical patients."
      ],
      feedsInto: "Co-occurring conditions screen; Differential diagnosis (obstructive sleep apnoea, narcolepsy, insomnia, delayed sleep phase); Safety and risk (driving); Clinical history (sleep).",
      strength: "STOP-Bang is sensitive for sleep apnoea (83.6%, 92.9% and 100% for apnoea-hypopnoea index above 5, 15 and 30 in surgical patients; Chung 2008) but not specific. The Epworth measures sleepiness, not its cause. Both prompt a sleep history and, where indicated, a sleep study."
    },

    /* ------------------------------------------------------------------ */
    /* Safety                                                              */
    /* ------------------------------------------------------------------ */
    {
      id: "cssrs", tool: "cssrs", title: "C-SSRS screen: Columbia suicide severity questions", kind: "self",
      what:
        "<p>The Columbia-Suicide Severity Rating Scale screen version (Posner et al. 2011; Columbia Lighthouse Project). Up to six questions: 1 and 2 about the <strong>past month</strong> (wishing to be dead; thoughts of killing oneself); 3, 4 and 5 (method, intent, plan) only if question 2 is yes; and 6 about suicidal behaviour <strong>ever</strong>, with a follow-up about the past 3 months.</p>" +
        "<p>Free to use in clinical settings without special permission; the Columbia Lighthouse Project says anyone can use it and no mental health training is required.</p>" +
        "<p><strong>Why it is used:</strong> some pre-appointment forms ask about suicide and self-harm (PHQ-9 item 9, WSR-II, CAARS 2 clinical-concern items, free text), and the answers must be followed up promptly. The C-SSRS gives that follow-up a clear structure. It is usually asked by phone or in person, not posted out.</p>",
      recommendedBy: [
        "UKAAN AQAS 2024: a risk or safety assessment should always be completed (essential)",
        "NICE NG225 1.6.1-1.6.3: do not use risk tools or scales to predict suicide or to stratify risk; use questions to guide a clinician-led psychosocial assessment",
        "NHSE ADHD Taskforce 2025 (Part 1 recommendation 6): identify risks such as suicidality on waiting lists, but not with tools alone",
        "DHSC independent review (2026): decisions about suicide risk and self-harm stay with qualified professionals"
      ],
      whenSent: "Not posted out. Used by a clinician the day a returned form flags suicidal thoughts or self-harm, and again at the appointment.",
      who: "Asked by a clinician or trained member of staff, by phone, video or in person.",
      time: "A few minutes, longer if the answers are positive.",
      howToRead:
        "<ol><li>Ask questions 1 and 2.</li>" +
        "<li>If question 2 is <strong>yes</strong>, ask questions 3, 4 and 5. If question 2 is <strong>no</strong>, go straight to question 6.</li>" +
        "<li>Ask question 6 (any suicidal behaviour ever); if yes, ask whether it was in the past 3 months.</li>" +
        "<li><strong>Note the highest yes.</strong> Columbia's outpatient protocol links questions 1, 2, 3 and 6 to a mental health referral, and questions 4, 5 and behaviour in the past 3 months to consultation and safety precautions.</li>" +
        "<li><strong>UK framing:</strong> NICE NG225 says not to use tools to predict suicide or to label people low, medium or high risk. Use the answers to decide how much enquiry is needed <em>now</em>, then carry out a clinician-led psychosocial assessment and a safety plan.</li>" +
        "<li>Explore what matters in ADHD: impulsivity (a short gap between thought and action), alcohol and drugs, recent losses (job, relationship), access to means, and protective factors.</li>" +
        "<li>Document, share with the GP or crisis team as needed, and give safety information: local crisis services, NHS 111, 999 in an emergency, Samaritans (116 123).</li></ol>",
      meaning: [
        { result: "No to all questions", means: "No recent suicidal thoughts and no lifetime suicidal behaviour reported.", action: "Clinical judgement can still override a negative screen. Record it and ask again at the appointment." },
        { result: "Yes to question 1 and/or 2 only", means: "A wish to be dead, or thoughts of suicide, without method, intent or plan.", action: "Clinician conversation before the appointment; safety information; review at the appointment (Columbia: mental health referral)." },
        { result: "Yes to question 3 (thinking about how), without intent", means: "Suicidal thoughts with some thought about method.", action: "Prompt clinician assessment, safety plan, ask about access to means, inform the GP." },
        { result: "Yes to question 4 or 5 (intent or plan)", means: "Active suicidal thinking with intent or a plan.", action: "Same-day clinician assessment and safety precautions (Columbia: consultation and safety precautions); involve the crisis team. Do not end the contact without a plan." },
        { result: "Yes to question 6, within the past 3 months", means: "Recent suicidal behaviour.", action: "As for intent or plan: same-day assessment and safety precautions." },
        { result: "Yes to question 6, more than 3 months ago", means: "Past suicidal behaviour.", action: "Mental health referral if not already in care; include it in the risk formulation and the history." }
      ],
      example: {
        html:
          "<p><strong>Avery, 29.</strong> The returned PHQ-9 totals 12 with <strong>item 9 scored 1</strong> (several days). A clinician phones Avery the same day the form is reviewed.</p>" +
          "<table><thead><tr><th>Question</th><th>Answer</th></tr></thead><tbody>" +
          "<tr><td>1 Wished to be dead (past month)</td><td>Yes: 'after bad days at work I wish I could just not wake up'</td></tr>" +
          "<tr><td>2 Thoughts of killing yourself (past month)</td><td>No</td></tr>" +
          "<tr><td>3-5</td><td>Not asked (question 2 was no)</td></tr>" +
          "<tr><td>6 Suicidal behaviour ever</td><td>No</td></tr>" +
          "</tbody></table>" +
          "<p><strong>Reasoning:</strong> the positive item 9 reflects a passive wish, without active thoughts or past behaviour. That pattern is common: in depression clinic patients only 28.6% of positive item 9 answers were matched by suicidal ideation with intent or recent suicidal behaviour on an electronic C-SSRS (Na 2018). It is still not a 'low risk' label (NICE NG225). Avery drinks more after bad days, which matters in someone who may act on impulse.</p>" +
          "<p><strong>Plan:</strong> talk through triggers, alcohol and protective factors; agree a simple safety plan and give crisis contacts; record the call; inform the GP with consent; review at the appointment.</p>",
        takeaway: "Every positive safety answer on a returned form gets a prompt human conversation. The C-SSRS structures that conversation; it does not predict risk."
      },
      pitfalls: [
        "Turning the triage colours into a low, medium or high risk label, or using them to decide who gets care (NICE NG225 1.6.1-1.6.3).",
        "Waiting for the appointment to follow up a positive item on a returned form.",
        "Asking only about the past month and forgetting lifetime behaviour (question 6).",
        "Underestimating impulsivity and alcohol in adults with ADHD.",
        "Not documenting the conversation and the plan.",
        "Assuming a negative screen settles the matter: clinical judgement can override it."
      ],
      feedsInto: "Safety and risk step: enter the answers; the app shows the level of enquiry needed now, never a risk score. The plan and contacts go into Report and next steps.",
      strength: "Good validity for classifying suicidal ideation and behaviour (Posner 2011, full scale). In the UK it is a structured enquiry that leads to a clinician's psychosocial assessment, never a risk prediction (NICE NG225 1.6.1-1.6.3)."
    }
  ]
});
