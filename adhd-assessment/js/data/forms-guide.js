/* formsGuide: the pre-appointment forms guide (ARCHITECTURE.md 5.10).
   Teaches what each questionnaire, informant form and record that is sent out or requested before an adult
   ADHD assessment is, why it is used, how to score and read it step by step, what each result means, a worked
   example, pitfalls, and how it feeds the assessment steps.
   UK practice (NICE NG87) is the default frame. Also cited: UKAAN AQAS 2024 (Adamou et al.), RCPsych CR235 (2023),
   European Consensus 2019 (Kooij et al.), CADDRA 4.1 (2020), AADPA 2022, NHSE ADHD Taskforce (2025), DHSC review (2026),
   ICD-11 CDDR, NICE CG142, CG185, NG222, NG225 and the instrument papers named in each entry.
   Instrument wording is not reproduced beyond short themes. Licensed tools (CAARS 2, BAARS-IV, ASRS-5 weighted scoring,
   MDQ, MSI-BPD, STOP-Bang, Epworth) are described, not copied. DIVA wording is not used.
   Worked examples are fictional people. Prevalence figures marked 'illustrative' are teaching assumptions, not data.
   Sources: research briefs of 21 October 2026 (tools-adhd, tools-comorbid-items, guidelines-uk, guidelines-intl). */
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
    "<p>The forms below are in that reading order. Each entry says which assessment step uses it.</p>",

  principles: [
    "Screening is not diagnosis. NICE NG87 1.3.2: never diagnose solely on rating scales; they are helpful added tools. The NHSE ADHD Taskforce (2025) adds that a positive screen is not enough for referral on its own, and a negative screen should not be used to exclude people.",
    "Self-report symptom scales are a baseline, not evidence for the diagnosis. UKAAN AQAS 2024: they consist of leading questions, and relying on them and on checklist interviewing risks confirmation bias. Record them, use them to plan the interview and to measure change later.",
    "Base rates decide what a score means. The same result has a different positive predictive value in different settings: in the 2024 Adult Psychiatric Morbidity Survey 13.9% of adults in England screened positive on ASRS Part A, while adult ADHD prevalence is estimated at about 2.5-2.8% (WFADHD 2021). In a specialist clinic, where prevalence is much higher, the same result is far more likely to be a true positive.",
    "A negative screen does not exclude ADHD. No screen has 100% sensitivity (ASRS Part A 68.7% in the original community study), and adults who compensate, have high ability, a mainly inattentive presentation or little insight often score low. Assess on the referral information, not on the score.",
    "Comorbidity inflates scores in both directions. Depression, anxiety, bipolar disorder, borderline personality disorder, trauma and substance use raise ADHD scales (ASRS specificity 0.66 in substance use treatment; WURS raised in mood and personality disorders; WFIRS raised by internalising symptoms). ADHD in turn raises other screens: PHQ-9 items 3, 6, 7 and 8, GAD-7 items 4-6, AQ-10 items 3 and 4, PCL-5 items 15, 16, 19 and 20, and half of adults with ADHD screen positive on the MDQ. Read the items, not just the total.",
    "Mind the time window: trait versus state. ADHD is trait-like and present since childhood. Forms ask about different periods: WURS childhood; ASRS 6 months; WFIRS, PCL-5 and the C-SSRS ideation questions the last month; PHQ-9 and GAD-7 2 weeks; AUDIT and DAST-10 the past year. A high current score during a depressive episode, poor sleep or heavy substance use may be a state, not a trait.",
    "Contemporaneous evidence outweighs recall. Adult recall of childhood ADHD had a positive predictive value of only 0.27 at population prevalence (Mannuzza 2002). School reports and records written at the time carry more weight. ICD-11 advises caution when a pre-12 history cannot be corroborated, but NICE NG87 1.3.3 says an uncertain time of onset should not on its own exclude the diagnosis.",
    "Self-informant disagreement is information, not noise. Many adults with ADHD under-report (limited insight, European Consensus 2019); others over-report under distress. Informants may not see inner symptoms, may have known the person only briefly, or may have ADHD themselves (UKAP 2020). Explore every disagreement with concrete, dated examples.",
    "Check response style and validity. Self-report scales are easy to fake (Sollman 2010), and 15-31% of adults referred for ADHD give non-credible responses on validity testing in published series. Watch for almost every item at the maximum, rare or atypical symptoms, inconsistency between forms, and severe scores alongside good functioning in records. Do not accuse: triangulate, and record your reasoning in the validity step.",
    "Bring the results into the interview, not the other way round. Read every returned form before the appointment. Turn elevated items into open questions ('Tell me about the last time...') and ask for real-life examples, frequency, settings and childhood; never read items back as yes/no questions. Note which hypotheses the forms raised and which the interview confirmed.",
    "Act on safety items at once. A suicide or self-harm item, a safeguarding concern or a cardiac red flag (NG87 1.7.5) found in a pack needs a clinician's response before the appointment. Triage of returned forms should not rely on questionnaires alone (NHSE Taskforce 2025, recommendation 10).",
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
        "<ol><li>Check it is the official ASRS v1.1 wording, rated for the past 6 months, and that the patient's copy was <strong>unshaded</strong>.</li>" +
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
          "<li><strong>Specialist adult ADHD clinic, illustrative prevalence 50%</strong>, with clinical-sample accuracy (sensitivity 0.84, specificity 0.66): of 100 referrals, about 42 true and 17 false positives (PPV about 71%), and about 8 people with ADHD among the 41 negatives (NPV about 80%).</li></ul>" +
          "<p><strong>Reading for Sam:</strong> a positive screen with a strongly inattentive profile. In a specialist clinic that raises the probability but settles nothing. The interview must test each shaded item with real examples, establish childhood onset, and check whether low mood or poor sleep is pushing the scores up (see Sam's PHQ-9 in the PHQ-9 entry).</p>",
        takeaway: "The same 4-of-6 result is a weak signal in the general population and a moderate one in a specialist clinic. In neither setting does it diagnose or exclude ADHD: it tells you which symptoms to explore."
      },
      pitfalls: [
        "Sending the shaded clinician copy to the patient. The shading shows which answers 'count'; send the unshaded version.",
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
    /* @@FORMS_NEXT@@ */
  ]
});
