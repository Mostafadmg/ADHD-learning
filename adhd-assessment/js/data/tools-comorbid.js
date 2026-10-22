/* tools-comorbid: screens for co-occurring and differential conditions in adult ADHD assessment
   (ARCHITECTURE.md section 5.4).
   Interactive, items reproduced (licence allows): phq9, gad7, audit, auditc, dast10, aq10, pcl5, pcptsd5,
   itq, raads14, cssrs.
   Interactive score sheets with short content labels only (licence unverified, wording NOT reproduced):
   mdq, msibpd.
   Information only (licence restricted or unverified): stopbang, cageaid, pq16.
   Item wording, options, keys and cut-offs were checked against the official forms (phqscreeners.com UK
   English PHQ-9 and GAD-7; OHID AUDIT and AUDIT-C on GOV.UK; CHA copy of the DAST-10; ARC AQ-10; VA PCL-5
   (29 August 2023) and PC-PTSD-5 (2022); ITQ official DOCX; Columbia C-SSRS Screener with triage points
   (2026); Eriksson et al. 2013 for RAADS-14) and the papers cited in each entry.
   Licence status is recorded per tool in `licence`. PDFs are redistributed only where the rights holder
   clearly allows it: PHQ-9, GAD-7 (no permission required), AUDIT and AUDIT-C (UK OHID forms, Open
   Government Licence v3.0), PCL-5, PC-PTSD-5 (public domain, US VA) and ITQ (public domain; PDF made from
   the official DOCX without changes).
   UK frame: NICE NG87 1.3.4 and 1.7.4, CG142 1.2.2-1.2.3, CG185 1.2.3, CG115 1.2.1.4, NG222, NG225
   1.6.1-1.6.3, NG202 1.1.1-1.1.4 and 1.3.1; RCPsych CR235 (2023); UKAAN AQAS (2024). ADHD-overlap notes marked as reasoning are clinical
   inferences from item content, not validation data. */
AA.add('tools', [

  /* ------------------------------------------------------------------ PHQ-9 */
  {
    id: "phq9", abbr: "PHQ-9", name: "Patient Health Questionnaire-9",
    group: "mood", stage: ["pre", "comorbid", "risk", "followup"],
    who: "Self-report by the patient. It can be read aloud.", time: "2-3 minutes", ages: "Adults", items_n: 9,
    purpose: "Measures how severe depressive symptoms have been over the last 2 weeks. Each of the 9 items matches one DSM criterion for a major depressive episode, and item 9 asks about thoughts of being better off dead or of self-harm. A tenth question, which is not scored, asks how much the problems get in the way of daily life.",
    when: "Send it with the pre-assessment pack and score it before the interview (Co-occurring conditions step). NICE NG87 1.3.4 asks for an assessment of coexisting conditions as part of diagnosis, and UKAAN's quality standard (AQAS 2024) lists depression scales among the optional pre-assessment questionnaires. Depression mimics inattention and changes the order of care: RCPsych CR235 advises treating a major mood disorder before assessing ADHD. Repeat it at follow-up: NICE NG222 suggests sessional measures such as the PHQ-9 for routine outcome monitoring.",
    how: "Ask the person to rate the last 2 weeks. Add items 1-9 (0-27). Read item 9 on its own, whatever the total, and act on it the same day. Then, for each item scored 2 or 3, ask: is this new or worse in recent weeks, or how you have always been? The difficulty question is recorded but not added to the score.",
    interactive: true,
    instructions: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    options: [{ v: 0, l: "Not at all" }, { v: 1, l: "Several days" }, { v: 2, l: "More than half the days" }, { v: 3, l: "Nearly every day" }],
    items: [
      { n: 1, t: "Little interest or pleasure in doing things" },
      { n: 2, t: "Feeling down, depressed, or hopeless" },
      { n: 3, t: "Trouble falling or staying asleep, or sleeping too much" },
      { n: 4, t: "Feeling tired or having little energy" },
      { n: 5, t: "Poor appetite or overeating" },
      { n: 6, t: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down" },
      { n: 7, t: "Trouble concentrating on things, such as reading the newspaper or watching television" },
      { n: 8, t: "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual" },
      { n: 9, t: "Thoughts that you would be better off dead or of hurting yourself in some way" },
      { n: 10, unscored: true, section: "Difficulty (not scored)", sectionNote: "The person's own view of impairment. It is not added to the total (PHQ instruction manual).",
        t: "If you ticked any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
        opts: [{ v: 0, l: "Not difficult at all" }, { v: 1, l: "Somewhat difficult" }, { v: 2, l: "Very difficult" }, { v: 3, l: "Extremely difficult" }] }
    ],
    scoring: {
      method: "sum",
      bands: [
        { min: 0, max: 4, label: "None or minimal", sev: 0 },
        { min: 5, max: 9, label: "Mild", sev: 1 },
        { min: 10, max: 14, label: "Moderate", sev: 2 },
        { min: 15, max: 19, label: "Moderately severe", sev: 3 },
        { min: 20, max: 27, label: "Severe", sev: 3 }
      ],
      cutoff: { value: 10, text: "Clinically significant depressive symptoms: assess for a depressive episode at interview (PHQ manual: 10 or more is a 'yellow flag', 15 or more a 'red flag')" },
      flags: [
        { item: 9, min: 1, level: "urgent", text: "Item 9 positive (thoughts of being better off dead or of self-harm). Ask about it today: complete the C-SSRS screen in the Safety and risk step and a clinician-led assessment. Do not let a low total reassure you." }
      ]
    },
    interpretation: [
      "Bands (PHQ instruction manual): 0-4 none or minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe. The manual suggests watchful waiting and a repeat score at 5-9, a treatment plan at 10-14, and active treatment from 15.",
      "NICE NG222 used a PHQ-9 score of 16 or more to mean 'more severe' depression and below 16 'less severe'. Use this split when you apply the NG222 treatment choices.",
      "Provisional algorithm (PHQ manual): major depressive syndrome if item 1 or 2, and five or more of items 1-9, are rated 'More than half the days' or more (item 9 counts if present at all); 2-4 such items suggests another depressive syndrome. Rule out bereavement, past mania and physical, medication or drug causes first.",
      "The score shows severity in the last 2 weeks, not duration or course. Whether symptoms are episodic or lifelong comes from the interview and the timeline.",
      "Item 9: any score of 1 or more needs a conversation with a clinician the same day. In a large health-system study, the risk of a suicide attempt over the next year rose with the item 9 rating (Simon 2013). But most people who score on item 9 do not have active suicidal ideation (Na 2018: positive predictive value 28.6% against the C-SSRS), so use it to start a careful conversation, not to rate risk.",
      "Use the difficulty question as the person's own view of how much the symptoms affect work, home and relationships."
    ],
    psychometrics: "Kroenke et al. 2001: a score of 10 or more had 88% sensitivity and 88% specificity for major depression. Levis et al. 2019 (BMJ individual-participant meta-analysis against semi-structured interviews): sensitivity 0.88 and specificity 0.85 at 10 or more. Item 9 against the C-SSRS (Na 2018): sensitivity 87.6%, specificity 66.1%, positive predictive value 28.6%, negative predictive value 97.2%. No validation study in adults with ADHD was found; the overlap notes are based on item content.",
    pitfalls: [
      "Letting a low total reassure you when item 9 is positive.",
      "Counting lifelong ADHD features (poor concentration, restlessness, late sleep) as new depressive symptoms.",
      "Treating a score of 10 or more as a diagnosis of depression. Confirm an episode at interview.",
      "In people already taking ADHD medication, side effects such as poor appetite and poor sleep raise items 3 and 5.",
      "It covers only the last 2 weeks, so it misses past episodes. Ask about them: they matter for recurrent depression and bipolar disorder."
    ],
    adhdNotes: "Four items can be raised by ADHD itself: item 3 (sleep, including the late sleep onset common in ADHD), item 4 (tiredness), item 7 (concentration) and item 8 (restlessness). Item 6 (feeling a failure) often reflects years of underachievement and criticism. For each of these, ask whether it is new or worse in recent weeks, or has always been there. Give most weight to items 1 and 2 (loss of interest and low mood), which ADHD itself does not usually explain, although long-standing demoralisation can raise item 2. A high total made up mainly of items 3, 4, 7 and 8, with low scores on items 1 and 2, points to ADHD-related or sleep problems rather than a depressive episode (reasoning from item content). A high total with clear low mood or loss of interest and a recent change from the usual self suggests a depressive episode: assess and treat it, and judge ADHD symptoms from childhood and from periods of normal mood. RCPsych CR235 advises treating a major mood disorder before assessing ADHD. Repeat the PHQ-9 after treatment of either condition.",
    licence: "Free to use. The form states: 'No permission required to reproduce, translate, display or distribute.' The phqscreeners.com site says the same for all PHQ and GAD-7 screeners and translations. Developed by Drs Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke and colleagues with an educational grant from Pfizer Inc. The items and PDF are the official English for the UK version.",
    source: "Kroenke K, Spitzer RL, Williams JBW. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med 2001;16:606-613. PHQ Instruction Manual (phqscreeners.com). Levis B et al. BMJ 2019 (PMID 30967483). Simon GE et al. Psychiatr Serv 2013;64:1195-1202. Na PJ et al. J Affect Disord 2018;232:34-40. NICE NG222 (2022).",
    url: "https://www.phqscreeners.com/select-screener",
    file: "tools/phq9.pdf"
  },

  /* ------------------------------------------------------------------ GAD-7 */
  {
    id: "gad7", abbr: "GAD-7", name: "Generalized Anxiety Disorder-7",
    group: "anxiety", stage: ["pre", "comorbid", "followup"],
    who: "Self-report by the patient. It can be read aloud.", time: "1-2 minutes", ages: "Adults", items_n: 7,
    purpose: "Measures how severe anxiety symptoms have been over the last 2 weeks. It was built to screen for generalised anxiety disorder and also picks up panic disorder, social anxiety disorder and PTSD reasonably well (Kroenke 2007).",
    when: "Send it with the pre-assessment pack and score it before the interview (Co-occurring conditions step). UKAAN's quality standard lists anxiety scales among the optional pre-assessment questionnaires. Anxiety causes poor concentration, restlessness and irritability that can look like ADHD, and the two often coexist. RCPsych CR235 advises treating a clear anxiety disorder first. Repeat it at follow-up to track change.",
    how: "Ask about the last 2 weeks. Add the 7 items (0-21). Then look at items 1-3 and 7 (worry and fear) separately from items 4-6 (tension, restlessness, irritability), which ADHD can raise. The app shows both groups in the subscale table.",
    interactive: true,
    instructions: "Over the last 2 weeks, how often have you been bothered by the following problems?",
    options: [{ v: 0, l: "Not at all" }, { v: 1, l: "Several days" }, { v: 2, l: "More than half the days" }, { v: 3, l: "Nearly every day" }],
    items: [
      { n: 1, t: "Feeling nervous, anxious or on edge" },
      { n: 2, t: "Not being able to stop or control worrying" },
      { n: 3, t: "Worrying too much about different things" },
      { n: 4, t: "Having trouble relaxing" },
      { n: 5, t: "Being so restless that it is hard to sit still" },
      { n: 6, t: "Becoming easily annoyed or irritable" },
      { n: 7, t: "Feeling afraid, as if something awful might happen" }
    ],
    scoring: {
      method: "sum",
      bands: [
        { min: 0, max: 4, label: "Minimal", sev: 0 },
        { min: 5, max: 9, label: "Mild", sev: 1 },
        { min: 10, max: 14, label: "Moderate", sev: 2 },
        { min: 15, max: 21, label: "Severe", sev: 3 }
      ],
      cutoff: { value: 10, text: "Recommended point for further evaluation of an anxiety disorder (PHQ manual)" },
      subscales: [
        { id: "gad2", label: "GAD-2 (items 1-2)", items: [1, 2], cutoff: 3 },
        { id: "worry", label: "Worry and fear (items 1-3, 7; app grouping, no cut-off)", items: [1, 2, 3, 7] },
        { id: "tension", label: "Tension, restlessness, irritability (items 4-6; app grouping, no cut-off)", items: [4, 5, 6] }
      ]
    },
    interpretation: [
      "Bands (PHQ manual): 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe.",
      "10 or more: assess for an anxiety disorder at interview, including generalised anxiety, panic disorder, social anxiety and PTSD.",
      "GAD-2 (items 1 and 2 added) of 3 or more is also a reason to complete the full GAD-7 and assess at interview.",
      "At interview, ask what the worry is about, whether it is hard to control, how long it has lasted, and whether it started before or after the attention problems.",
      "The two app groupings are not validated subscales. They help you see whether a raised total rests on worry and fear or on restlessness and irritability."
    ],
    psychometrics: "Spitzer et al. 2006: at 10 or more, sensitivity 89% and specificity 82% for generalised anxiety disorder. Kroenke et al. 2007: area under the curve 0.80-0.91 for generalised anxiety, panic, social anxiety and PTSD (GAD-7 and GAD-2). Plummer et al. 2016 meta-analysis: at a cut-off of 8, pooled sensitivity 0.83 and specificity 0.84, with similar results for cut-offs from 7 to 10. No validation study in adults with ADHD was found.",
    pitfalls: [
      "Reading a raised total as anxiety when it rests on items 4-6, which ADHD restlessness and irritability can raise.",
      "Missing the difference between worry about the results of disorganisation (missed deadlines, bills) and broad, uncontrollable worry.",
      "Assuming a normal score rules out conditions it does not cover well, such as OCD or specific phobia (clinical practice).",
      "It covers only the last 2 weeks."
    ],
    adhdNotes: "Items 4 (trouble relaxing), 5 (so restless it is hard to sit still) and 6 (easily annoyed or irritable) overlap with ADHD hyperactivity and emotional dysregulation. A raised total built mainly on these three, with low items 1-3 and 7, suggests ADHD restlessness rather than an anxiety disorder (reasoning from item content). In ADHD, worry is often about the consequences of disorganisation and eases once the task is done. In generalised anxiety disorder it is broad, hard to control and present even when things are going well. Check timing: anxiety that began in adulthood, with triggers, physical symptoms or avoidance, points to an anxiety disorder; attention problems present since childhood, before the anxiety, point to ADHD. Both often coexist. RCPsych CR235 advises treating a clear anxiety disorder first, then reassessing attention.",
    licence: "Free to use. The form states: 'No permission required to reproduce, translate, display or distribute.' Developed by Drs Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke and colleagues with an educational grant from Pfizer Inc. The items and PDF are the official English for the UK version (item 4 'Having trouble relaxing'; the US version says 'Trouble relaxing').",
    source: "Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med 2006;166:1092-1097. Kroenke K et al. Ann Intern Med 2007 (PMID 17339617). Plummer F et al. Gen Hosp Psychiatry 2016 (PMID 26719105). PHQ Instruction Manual.",
    url: "https://www.phqscreeners.com/select-screener",
    file: "tools/gad7.pdf"
  },

  /* ------------------------------------------------------------------ MDQ (score sheet only) */
  {
    id: "mdq", abbr: "MDQ", name: "Mood Disorder Questionnaire",
    group: "bipolar", stage: ["comorbid"],
    who: "Self-report on the official form, then reviewed with the patient.", time: "About 5 minutes", ages: "Adults", items_n: 17,
    purpose: "Screens for a lifetime history of hypomania or mania (bipolar spectrum). Part 1 has 13 yes/no symptom questions about a period when the person was not their usual self. Part 2 asks whether several of these happened at the same time, and Part 3 how much trouble they caused. Two more questions (family history, previous diagnosis) are not scored.",
    when: "Use it in the Co-occurring conditions step when the history suggests mood episodes or there is a family history of bipolar disorder, and in any adult with depression, because bipolar disorder changes the order of treatment (RCPsych CR235 advises treating a clear bipolar disorder first). Use it only as a prompt for a structured interview about episodes: NICE CG185 1.2.3 says not to use questionnaires in primary care to identify bipolar disorder in adults.",
    how: "This is a score sheet. The questionnaire wording is not reproduced here. Give the patient the official form, then enter their answers. The labels are short content summaries for scoring, not the questionnaire items. A positive screen needs all three: 7 or more 'yes' answers in Part 1, 'yes' to Part 2, and 'moderate' or 'serious' problems in Part 3. Then go through every 'yes' with the patient and ask when it happened, how long it lasted and whether others noticed a change.",
    interactive: true,
    instructions: "Score sheet. Enter the answers from the patient's completed official MDQ. Labels summarise item content only; they are not the questionnaire wording.",
    options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }],
    items: [
      { n: 1, label: "1a", part: "1", section: "Part 1: lifetime symptoms during a period unlike the usual self", t: "Unusually high or excited mood, noticed by others or causing trouble" },
      { n: 2, label: "1b", part: "1", t: "Marked irritability with rows or fights" },
      { n: 3, label: "1c", part: "1", t: "Inflated self-confidence" },
      { n: 4, label: "1d", part: "1", t: "Reduced need for sleep" },
      { n: 5, label: "1e", part: "1", t: "More talkative or pressured speech" },
      { n: 6, label: "1f", part: "1", t: "Racing thoughts" },
      { n: 7, label: "1g", part: "1", t: "Easily distracted, hard to stay on task" },
      { n: 8, label: "1h", part: "1", t: "Increased energy" },
      { n: 9, label: "1i", part: "1", t: "Increased activity, doing many more things" },
      { n: 10, label: "1j", part: "1", t: "Unusually sociable or outgoing" },
      { n: 11, label: "1k", part: "1", t: "Increased interest in sex" },
      { n: 12, label: "1l", part: "1", t: "Out-of-character, excessive or risky behaviour" },
      { n: 13, label: "1m", part: "1", t: "Spending that caused trouble" },
      { n: 14, label: "2", part: "2", section: "Part 2", t: "Several of the Part 1 experiences happened during the same period" },
      { n: 15, label: "3", part: "3", section: "Part 3", t: "How much of a problem they caused (for example with work, family, money, the law, or arguments and fights)",
        opts: [{ v: 0, l: "No problem" }, { v: 1, l: "Minor problem" }, { v: 2, l: "Moderate problem" }, { v: 3, l: "Serious problem" }] },
      { n: 16, label: "4", unscored: true, section: "Not scored", sectionNote: "Recorded for the history. Not part of the scoring rule.", t: "A blood relative has had bipolar disorder (manic depression)" },
      { n: 17, label: "5", unscored: true, t: "A health professional has previously said the person has bipolar disorder" }
    ],
    scoring: { method: "mdq", part1: 7 },
    interpretation: [
      "Positive screen (official scoring sheet): 7 or more 'yes' answers in Part 1, and 'yes' to Part 2, and 'moderate' or 'serious' problems in Part 3. All three must be met.",
      "A positive screen is a reason for a structured interview about episodes, not a diagnosis. The form itself says it is for screening only.",
      "A negative screen does not rule out bipolar disorder: in a US general population sample the sensitivity was only 0.28 (Hirschfeld 2003).",
      "At interview, ask for the dates, length and triggers of each period, whether the need for sleep truly fell, whether others noticed a change from the usual self, and whether it happened on antidepressants, stimulants or other substances (clinical practice).",
      "A family history of bipolar disorder (question 4) raises your index of suspicion but does not change the score."
    ],
    psychometrics: "Hirschfeld et al. 2000 (psychiatric outpatients): 7 or more Part 1 items gave sensitivity 0.73 and specificity 0.90. Hirschfeld et al. 2003 (US general population): sensitivity 0.28 and specificity 0.97. In adults with ADHD, Lundervold et al. 2020 found that 50.2% of 502 screened positive, against 5% of 818 controls.",
    pitfalls: [
      "Counting lifelong ADHD traits as an episode.",
      "Forgetting that Part 2 and Part 3 must also be met.",
      "Mistaking late nights followed by tiredness (ADHD or delayed sleep phase) for reduced need for sleep.",
      "Counting highs caused by stimulants, cocaine or other substances as hypomania without checking (clinical practice).",
      "Using it in primary care to identify bipolar disorder (NICE CG185 1.2.3 advises against this)."
    ],
    adhdNotes: "The MDQ over-calls bipolar disorder in ADHD: half of adults with ADHD screened positive in one large study (Lundervold 2020). Items 1b (irritability), 1e (talkative), 1f (racing thoughts), 1g (distractible), 1i (more active), 1l (risky behaviour) and 1m (spending) describe everyday ADHD traits, and people with ADHD often say 'yes' because they are like this all the time. The question that separates them is episodicity: was there a distinct period of days to weeks, clearly different from the person's usual self, with a clear start and end, that others noticed? Reduced need for sleep without tiredness the next day points to hypomania; going to bed late but feeling exhausted points to ADHD or a delayed sleep phase. Steady traits present since childhood favour ADHD. The two can coexist: if they do, RCPsych CR235 advises stabilising mood first.",
    licence: "Unverified. The form carries '© 2000 by The University of Texas Medical Branch. Reprinted with permission' and says it is for screening only, not for diagnosis. No statement from the rights holder allowing free reproduction was found, and a secondary source reports that publication rights passed to a commercial publisher (not confirmed). The items are therefore not reproduced: this app offers a score sheet with short content labels and applies the published scoring rule. Use an official copy of the form. No PDF is redistributed.",
    source: "Hirschfeld RMA, Williams JBW, Spitzer RL, Calabrese JR, et al. Development and validation of a screening instrument for bipolar spectrum disorder: the Mood Disorder Questionnaire. Am J Psychiatry 2000;157:1873-1875. Hirschfeld RMA et al. Am J Psychiatry 2003;160:178-180. Lundervold AJ et al. Front Psychol 2020;11:571101. NICE CG185 1.2.3.",
    url: "https://pubmed.ncbi.nlm.nih.gov/11058490/",
    file: null
  },

  /* ------------------------------------------------------------------ AUDIT (UK version) */
  {
    id: "audit", abbr: "AUDIT", name: "Alcohol Use Disorders Identification Test (UK version)",
    group: "substance", stage: ["pre", "comorbid", "risk", "followup"],
    who: "Self-report, or asked by the clinician.", time: "2-3 minutes", ages: "Adults", items_n: 10,
    purpose: "Identifies hazardous and harmful drinking and possible alcohol dependence over the last year. Items 1-3 cover consumption (the AUDIT-C), items 4-6 dependence and items 7-10 alcohol-related harm. It was developed by the WHO; this is the UK version from the Office for Health Improvement and Disparities (OHID), which asks about UK units.",
    when: "In every adult ADHD assessment, or after a positive AUDIT-C (5 or more). Alcohol can cause or worsen inattention, poor sleep and low mood. NICE CG115 1.2.1.4 names the AUDIT for identification and as a routine outcome measure, and NICE NG87 1.7.4 asks for a risk assessment for substance misuse before ADHD medication is started.",
    how: "Explain UK units first, using the unit guide on the form. Ask about the last year. Items 1-8 score 0-4; items 9 and 10 score 0, 2 or 4. Add them up (0-40). In interview format, the WHO manual skips to items 9 and 10 if the answer to item 1 is 'Never', or if items 2 and 3 both score 0.",
    interactive: true,
    instructions: "These questions are about your drinking in the last year. One unit is half a pint of regular beer, lager or cider, half a small glass of wine, or a single measure of spirits (see the unit guide on the official form).",
    options: [{ v: 0, l: "Never" }, { v: 1, l: "Less than monthly" }, { v: 2, l: "Monthly" }, { v: 3, l: "Weekly" }, { v: 4, l: "Daily or almost daily" }],
    items: [
      { n: 1, section: "Consumption (AUDIT-C)", t: "How often do you have a drink containing alcohol?",
        opts: [{ v: 0, l: "Never" }, { v: 1, l: "Monthly or less" }, { v: 2, l: "2 to 4 times per month" }, { v: 3, l: "2 to 3 times per week" }, { v: 4, l: "4 or more times per week" }] },
      { n: 2, t: "How many units of alcohol do you drink on a typical day when you are drinking?",
        opts: [{ v: 0, l: "0 to 2" }, { v: 1, l: "3 to 4" }, { v: 2, l: "5 to 6" }, { v: 3, l: "7 to 9" }, { v: 4, l: "10 or more" }] },
      { n: 3, t: "How often have you had 6 or more units if female, or 8 or more if male, on a single occasion in the last year?" },
      { n: 4, section: "Dependence", t: "How often during the last year have you found that you were not able to stop drinking once you had started?" },
      { n: 5, t: "How often during the last year have you failed to do what was normally expected from you because of your drinking?" },
      { n: 6, t: "How often during the last year have you needed an alcoholic drink in the morning to get yourself going after a heavy drinking session?" },
      { n: 7, section: "Alcohol-related harm", t: "How often during the last year have you had a feeling of guilt or remorse after drinking?" },
      { n: 8, t: "How often during the last year have you been unable to remember what happened the night before because you had been drinking?" },
      { n: 9, t: "Have you or somebody else been injured as a result of your drinking?",
        opts: [{ v: 0, l: "No" }, { v: 2, l: "Yes, but not in the last year" }, { v: 4, l: "Yes, during the last year" }] },
      { n: 10, t: "Has a relative or friend, doctor or other health worker been concerned about your drinking or suggested that you cut down?",
        opts: [{ v: 0, l: "No" }, { v: 2, l: "Yes, but not in the last year" }, { v: 4, l: "Yes, during the last year" }] }
    ],
    scoring: {
      method: "sum",
      bands: [
        { min: 0, max: 7, label: "Low risk", sev: 0 },
        { min: 8, max: 15, label: "Increasing risk", sev: 1 },
        { min: 16, max: 19, label: "Higher risk", sev: 2 },
        { min: 20, max: 40, label: "Possible dependence", sev: 3 }
      ],
      cutoff: { value: 8, text: "Hazardous or harmful drinking, or possible dependence (WHO). OHID: give brief advice; at 20 or more consider referral for specialist alcohol assessment" },
      subscales: [
        { id: "cons", label: "Consumption (AUDIT-C, items 1-3)", items: [1, 2, 3], cutoff: 5 },
        { id: "dep", label: "Dependence (items 4-6)", items: [4, 5, 6] },
        { id: "harm", label: "Harm (items 7-10)", items: [7, 8, 9, 10] }
      ],
      flags: [
        { item: 4, min: 2, level: "warn", text: "Item 4 scored 2 or more (cannot stop once started): the WHO manual advises the next level of intervention up. Ask about dependence." },
        { item: 5, min: 2, level: "warn", text: "Item 5 scored 2 or more: the WHO manual advises the next level of intervention up. Check the failures happen because of drinking, not ADHD disorganisation alone." },
        { item: 6, min: 2, level: "warn", text: "Item 6 scored 2 or more (morning drinking): the WHO manual advises the next level of intervention up. Ask about dependence and withdrawal symptoms." },
        { item: 9, min: 4, level: "warn", text: "Injury from drinking in the last year: the WHO manual advises the next level of intervention up." },
        { item: 10, min: 4, level: "warn", text: "Others concerned about the drinking in the last year: the WHO manual advises the next level of intervention up." }
      ]
    },
    interpretation: [
      "UK bands (OHID form): 0-7 low risk, 8-15 increasing risk, 16-19 higher risk, 20 or more possible dependence.",
      "WHO zones: I (0-7) alcohol education; II (8-15) simple advice; III (16-19) simple advice plus brief counselling and continued monitoring; IV (20-40) referral to a specialist for diagnostic evaluation and treatment.",
      "OHID: at 8 or more, give brief advice to reduce risk; at 20 or more, consider referral to a specialist alcohol harm assessment.",
      "WHO cut-offs: 8 or more is the usual cut-off. A cut-off of 10 gives more specificity at the cost of sensitivity. For women, and for men over 65, a cut-off of 7 increases sensitivity.",
      "WHO: move up one level of intervention if item 4, 5 or 6 scores 2 or more, or item 9 or 10 scores 4. The app flags these items.",
      "For severity of dependence, NICE CG115 1.2.1.4 recommends the SADQ or LDQ, and the CIWA-Ar for withdrawal."
    ],
    psychometrics: "In the WHO development study, a cut-off of 8 gave sensitivities generally in the mid-0.90s and specificities averaging in the 0.80s (WHO manual 2001). No validation study in adults with ADHD was found.",
    pitfalls: [
      "Not explaining units. People often underestimate home measures of wine and spirits.",
      "Scoring items 9 and 10 as 0, 1, 2 instead of 0, 2, 4.",
      "Counting item 5 (not doing what was expected) or item 8 (memory loss) when the problem is ADHD forgetfulness rather than drinking. Ask whether it happens only after drinking.",
      "Item 3 uses different thresholds by sex. For trans and non-binary people use clinical judgement and record which threshold you used (clinical practice).",
      "Overlooking binge drinking in someone who drinks rarely. Item 3 matters more than the total in that case."
    ],
    adhdNotes: "Adults with ADHD often use alcohol to switch off, calm restlessness or get to sleep, so ask what drinking does for them. Binge drinking (item 3) is often more telling than how often they drink. Items 5 (not doing what was expected) and 8 (not remembering the night before) can be inflated by ADHD forgetfulness and disorganisation: count them only when the problem follows drinking (reasoning from item content). Heavy drinking can itself cause inattention, poor sleep and low mood, so trace attention problems back to childhood and to sober periods before putting them down to ADHD. A high score does not stop the ADHD assessment: RCPsych CR235 says coexisting disorders should not be a barrier to assessment, but advises treating a substance use disorder first and judging ADHD symptoms when use is stable or stopped. NICE NG87 1.7.4 requires a risk assessment for substance misuse and drug diversion before medication.",
    licence: "UK version: published by OHID on GOV.UK, where all content is available under the Open Government Licence v3.0 except where otherwise stated. WHO original: the 2001 manual 'may be freely reviewed, abstracted, reproduced, and translated, in part or in whole but not for sale or for use in conjunction with commercial purposes'. The items and PDF are the UK (OHID) print form.",
    source: "Babor TF, Higgins-Biddle JC, Saunders JB, Monteiro MG. AUDIT: The Alcohol Use Disorders Identification Test. Guidelines for use in primary care. 2nd ed. WHO 2001 (WHO/MSD/MSB/01.6a). Saunders JB et al. Addiction 1993;88:791-804. OHID. Alcohol use disorders identification test (AUDIT), GOV.UK. NICE CG115 1.2.1.4.",
    url: "https://www.gov.uk/government/publications/alcohol-use-screening-tests",
    file: "tools/audit.pdf"
  },

  /* ------------------------------------------------------------------ AUDIT-C (UK version) */
  {
    id: "auditc", abbr: "AUDIT-C", name: "AUDIT-Consumption (UK version)",
    group: "substance", stage: ["pre", "comorbid", "physical"],
    who: "Self-report, or asked by the clinician.", time: "About 1 minute", ages: "Adults", items_n: 3,
    purpose: "A 3-question alcohol screen: the consumption items of the AUDIT (how often, how many units on a typical day, and how often 6 or 8 or more units on one occasion).",
    when: "A quick first screen in the pre-assessment pack or at the start of the substance history. If the score is 5 or more, complete the remaining 7 AUDIT questions, as the OHID form advises (use the AUDIT tool in this app).",
    how: "Explain UK units first. Add the three items (0-12). In the UK version, 5 or more is a positive screen: go on to the full AUDIT.",
    interactive: true,
    instructions: "These questions are about your drinking. One unit is half a pint of regular beer, lager or cider, half a small glass of wine, or a single measure of spirits (see the unit guide on the official form).",
    options: [{ v: 0, l: "Never" }, { v: 1, l: "Less than monthly" }, { v: 2, l: "Monthly" }, { v: 3, l: "Weekly" }, { v: 4, l: "Daily or almost daily" }],
    items: [
      { n: 1, t: "How often do you have a drink containing alcohol?",
        opts: [{ v: 0, l: "Never" }, { v: 1, l: "Monthly or less" }, { v: 2, l: "2 to 4 times per month" }, { v: 3, l: "2 to 3 times per week" }, { v: 4, l: "4 or more times per week" }] },
      { n: 2, t: "How many units of alcohol do you drink on a typical day when you are drinking?",
        opts: [{ v: 0, l: "0 to 2" }, { v: 1, l: "3 to 4" }, { v: 2, l: "5 to 6" }, { v: 3, l: "7 to 9" }, { v: 4, l: "10 or more" }] },
      { n: 3, t: "How often have you had 6 or more units if female, or 8 or more if male, on a single occasion in the last year?" }
    ],
    scoring: {
      method: "sum",
      bands: [
        { min: 0, max: 4, label: "Low risk", sev: 0 },
        { min: 5, max: 7, label: "Increasing risk", sev: 1 },
        { min: 8, max: 10, label: "Higher risk", sev: 2 },
        { min: 11, max: 12, label: "Possible dependence", sev: 3 }
      ],
      cutoff: { value: 5, text: "Positive screen (UK OHID form): complete the full AUDIT" }
    },
    interpretation: [
      "UK bands (OHID form): 0-4 low risk, 5-7 increasing risk, 8-10 higher risk, 11-12 possible dependence. 5 or more is a positive screen.",
      "US thresholds differ. Bradley et al. 2007, using US standard drinks rather than UK units, found 4 or more best in men (sensitivity 0.86, specificity 0.89) and 3 or more in women (sensitivity 0.73, specificity 0.91). With this UK unit-based form, use the UK threshold of 5.",
      "A positive AUDIT-C is a screen. Complete the full AUDIT and take a drinking history."
    ],
    psychometrics: "Bush et al. 1998 developed the AUDIT-C from AUDIT items 1-3. Bradley et al. 2007 reported the US sex-specific thresholds above. Accuracy figures for the UK threshold of 5 were not found in the sources checked; the threshold is the one printed on the OHID form.",
    pitfalls: [
      "Using the US cut-offs (3 or 4) with the UK unit-based questions, or the UK cut-off with US drink-based questions.",
      "Stopping at the AUDIT-C when it is positive: the dependence and harm items are needed.",
      "Not checking drink sizes and strengths."
    ],
    adhdNotes: "The AUDIT-C asks only about amounts, so ADHD forgetfulness does not inflate it. In ADHD it is more likely to underestimate: people who do not keep track of what they drink may under-report (reasoning). Ask about a typical week and the heaviest recent session. A positive score is a reason to complete the full AUDIT and to judge attention symptoms during periods of low or no drinking.",
    licence: "UK version: published by OHID on GOV.UK under the Open Government Licence v3.0. The items are AUDIT items 1-3 (WHO 2001 manual: free to reproduce, not for sale or commercial use). The items and PDF are the UK (OHID) print form, which also contains the remaining AUDIT questions.",
    source: "Bush K, Kivlahan DR, McDonell MB, Fihn SD, Bradley KA. The AUDIT alcohol consumption questions (AUDIT-C). Arch Intern Med 1998;158:1789-1795. Bradley KA et al. Alcohol Clin Exp Res 2007;31:1208-1217. OHID. Alcohol use disorders identification test for consumption (AUDIT C), GOV.UK.",
    url: "https://www.gov.uk/government/publications/alcohol-use-screening-tests",
    file: "tools/auditc.pdf"
  },

  /* ------------------------------------------------------------------ DAST-10 */
  {
    id: "dast10", abbr: "DAST-10", name: "Drug Abuse Screening Test, 10 items",
    group: "substance", stage: ["pre", "comorbid", "risk"],
    who: "Self-report, or asked by the clinician.", time: "2-3 minutes", ages: "Adults", items_n: 10,
    purpose: "Screens for problems from drug use (not alcohol) in the past 12 months. Drug use means taking prescribed or over-the-counter medicines beyond the directions, or any non-medical use of drugs.",
    when: "In every adult ADHD assessment, before the interview. Cannabis, stimulants and other drugs can mimic or worsen ADHD symptoms, and NICE NG87 1.7.4 asks for a risk assessment for substance misuse and drug diversion before ADHD medication is started.",
    how: "Read out what 'drug use' means first, and say that prescribed medicine taken as directed does not count. Score 1 for each 'yes', except item 3, where 'no' scores 1. Total 0-10. Then take a drug history: which drugs, how much, how often and what they do for the person.",
    interactive: true,
    instructions: "These questions are about drug use, not alcohol, in the past 12 months. 'Drug use' means using prescribed or over-the-counter medicines in excess of the directions, or any non-medical use of drugs (for example cannabis, solvents, tranquillisers, barbiturates, cocaine, stimulants such as speed, hallucinogens or opioids). In the past 12 months:",
    options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }],
    items: [
      { n: 1, t: "Have you used drugs other than those required for medical reasons?" },
      { n: 2, t: "Do you use more than one drug at a time?" },
      { n: 3, t: "Are you always able to stop using drugs when you want to?", score: { "1": 0, "0": 1 } },
      { n: 4, t: "Have you had “blackouts” or “flashbacks” as a result of your drug use?" },
      { n: 5, t: "Do you ever feel bad or guilty about your drug use?" },
      { n: 6, t: "Does your spouse (or parents) ever complain about your involvement with drugs?" },
      { n: 7, t: "Have you neglected your family because of your use of drugs?" },
      { n: 8, t: "Have you engaged in illegal activities in order to obtain drugs?" },
      { n: 9, t: "Have you ever experienced withdrawal symptoms (felt sick) when you stopped taking drugs?" },
      { n: 10, t: "Have you had medical problems as a result of your drug use (e.g., memory loss, hepatitis, convulsions, bleeding, etc.)?" }
    ],
    scoring: {
      method: "sum",
      bands: [
        { min: 0, max: 0, label: "No problems reported: no action at this time", sev: 0 },
        { min: 1, max: 2, label: "Low level: monitor and reassess later", sev: 1 },
        { min: 3, max: 5, label: "Moderate level: further investigation", sev: 2 },
        { min: 6, max: 8, label: "Substantial level: intensive assessment", sev: 3 },
        { min: 9, max: 10, label: "Severe level: intensive assessment", sev: 3 }
      ],
      cutoff: { value: 3, text: "Moderate level or above: the scoring sheet advises further investigation (3-5) or intensive assessment (6 or more)" }
    },
    interpretation: [
      "Bands and suggested actions (official scoring sheet): 0 no problems reported, no action; 1-2 low level, monitor and reassess later; 3-5 moderate level, further investigation; 6-8 substantial level, intensive assessment; 9-10 severe level, intensive assessment.",
      "The form gives bands, not a single cut-off. The app marks 3 or more as positive because that is the first band where the form advises further investigation. Any score above 0 is worth a conversation about which drugs, how often and why.",
      "It does not cover alcohol. Use the AUDIT for that."
    ],
    psychometrics: "Yudko et al. 2007 review: DAST versions show moderate to high reliability, validity, sensitivity and specificity. Specific accuracy figures for the DAST-10 were not verified for this app.",
    pitfalls: [
      "Item 3 is reverse keyed: 'yes' (always able to stop) scores 0 and 'no' scores 1.",
      "Patients may count prescribed ADHD medication taken as directed. It does not count.",
      "It does not ask which drugs, how much or how often: take a drug history as well.",
      "Item 6 asks about a spouse or parents; ask about a partner or anyone close to the person (clinical practice)."
    ],
    adhdNotes: "Ask specifically about cannabis (often used for sleep or restlessness), cocaine and other stimulants (sometimes used to focus), and taking more of a prescribed stimulant than directed or using someone else's. Prescribed ADHD medication taken as directed does not count on item 1; extra doses and diverted tablets do. Intoxication, withdrawal and heavy cannabis use cause inattention and low motivation, so judge ADHD symptoms from childhood and from drug-free periods. A positive score does not stop the ADHD assessment, but it shapes the order of care and the treatment plan: NICE NG87 1.7.4 requires a risk assessment for substance misuse and drug diversion before medication, and RCPsych CR235 advises treating a substance use disorder first, while noting that controlled use need not rule out ADHD treatment.",
    licence: "Free for non-commercial use with credit. AHRQ Academy listing: '© 1982 by Harvey A. Skinner, Ph.D., and the Centre for Addiction and Mental Health, Toronto, Canada. You may reproduce this instrument for noncommercial use (clinical, research, training purposes) as long as you credit the author, Dr. Harvey A. Skinner, York University, Toronto, Canada.' The items are shown here for non-commercial clinical and training use with that credit. No PDF is redistributed: no copy hosted by the rights holder was found.",
    source: "Skinner HA. The Drug Abuse Screening Test. Addict Behav 1982;7:363-371. DAST-10, author Harvey A. Skinner PhD (© 1982 Addiction Research Foundation). Yudko E et al. J Subst Abuse Treat 2007;32:189-198.",
    url: "https://integrationacademy.ahrq.gov/resources/10771",
    file: null
  },

  /* ------------------------------------------------------------------ AQ-10 Adult */
  {
    id: "aq10", abbr: "AQ-10", name: "Autism Spectrum Quotient, 10 items (Adult)",
    group: "autism", stage: ["referral", "pre", "comorbid"],
    who: "Self-report. Read it aloud if the person has reading difficulties (NICE CG142 1.2.3).", time: "About 2 minutes",
    ages: "Adults without a moderate or severe learning disability (NICE CG142)", items_n: 10,
    purpose: "A 10-item quick referral guide for autism in adults who do not have a learning disability. NICE CG142 recommends it for adults with possible autism.",
    when: "When there are persistent social-communication difficulties, rigid or repetitive behaviour, restricted interests or sensory differences. NICE CG142 1.2.2 advises considering an autism assessment when a person has such difficulties plus one of several other features, one of which is a history of a neurodevelopmental condition such as ADHD, so many adults referred for ADHD meet the conditions for using it. UKAAN's quality standard lists the AQ-10 as an optional pre-assessment questionnaire.",
    how: "Ask the person to tick one answer per item. Each item scores 0 or 1: either 'agree' answer scores on items 1, 7, 8 and 10; either 'disagree' answer scores on items 2, 3, 4, 5, 6 and 9. Total 0-10.",
    interactive: true,
    instructions: "Please tick one option per question only.",
    options: [{ v: 1, l: "Definitely agree" }, { v: 2, l: "Slightly agree" }, { v: 3, l: "Slightly disagree" }, { v: 4, l: "Definitely disagree" }],
    items: [
      { n: 1, t: "I often notice small sounds when others do not", score: { "1": 1, "2": 1, "3": 0, "4": 0 } },
      { n: 2, t: "I usually concentrate more on the whole picture, rather than the small details", score: { "1": 0, "2": 0, "3": 1, "4": 1 } },
      { n: 3, t: "I find it easy to do more than one thing at once", score: { "1": 0, "2": 0, "3": 1, "4": 1 } },
      { n: 4, t: "If there is an interruption, I can switch back to what I was doing very quickly", score: { "1": 0, "2": 0, "3": 1, "4": 1 } },
      { n: 5, t: "I find it easy to ‘read between the lines’ when someone is talking to me", score: { "1": 0, "2": 0, "3": 1, "4": 1 } },
      { n: 6, t: "I know how to tell if someone listening to me is getting bored", score: { "1": 0, "2": 0, "3": 1, "4": 1 } },
      { n: 7, t: "When I’m reading a story I find it difficult to work out the characters’ intentions", score: { "1": 1, "2": 1, "3": 0, "4": 0 } },
      { n: 8, t: "I like to collect information about categories of things (e.g. types of car, types of bird, types of train, types of plant etc)", score: { "1": 1, "2": 1, "3": 0, "4": 0 } },
      { n: 9, t: "I find it easy to work out what someone is thinking or feeling just by looking at their face", score: { "1": 0, "2": 0, "3": 1, "4": 1 } },
      { n: 10, t: "I find it difficult to work out people’s intentions", score: { "1": 1, "2": 1, "3": 0, "4": 0 } }
    ],
    scoring: {
      method: "sum",
      cutoff: { value: 6, text: "Consider referral for a specialist autism assessment (ARC scoring key; NICE CG142 1.2.3)" },
      subscales: [
        { id: "switch", label: "Attention-switching items 3-4 (often scored in ADHD)", items: [3, 4] },
        { id: "other", label: "All other items (1-2, 5-10)", items: [1, 2, 5, 6, 7, 8, 9, 10] }
      ]
    },
    interpretation: [
      "6 or more: offer or refer for a comprehensive autism assessment (NICE CG142 1.2.3).",
      "Below 6 does not rule out autism. NICE also says to offer an assessment if autism is suspected on clinical judgement, taking into account any past history from an informant.",
      "In a clinical referral sample (Ashwood 2016), the AQ-10 was no better than chance at predicting diagnosis, and nearly two-thirds of people who scored below 6 were false negatives. Treat it as a prompt, not a test.",
      "Take a developmental history of social communication, play, friendships, routines and sensory reactions from early childhood, ideally with a parent.",
      "The subscale rows are an app aid for ADHD clinics, not validated subscales."
    ],
    psychometrics: "Allison et al. 2012 (case-control, 449 autistic adults and 838 controls): at a cut-point of 6, sensitivity 0.88, specificity 0.91 and positive predictive value 0.85; the case-control design inflates accuracy. Ashwood et al. 2016 (476 adults referred to a national autism service): sensitivity 0.77, specificity 0.29. Sizoo et al. 2009: the 50-item AQ classified only 73% correctly when separating autism from ADHD, and the authors judged its use for that purpose limited.",
    pitfalls: [
      "Using a score below 6 to decide that autism is absent.",
      "Misreading the key: six of the ten items score on 'disagree'.",
      "Anxiety can raise scores and mimic autism (Ashwood 2016).",
      "Not reading it aloud for someone with reading difficulties (NICE CG142 1.2.3)."
    ],
    adhdNotes: "Items 3 ('I find it easy to do more than one thing at once') and 4 ('If there is an interruption, I can switch back to what I was doing very quickly') score on disagree. Many adults with ADHD disagree because of distractibility and poor task switching, so ADHD alone can add up to 2 points. Item 1 ('I often notice small sounds when others do not') scores on agree and may also be endorsed by people who are easily distracted by background noise (reasoning from item content). Check the 'all other items' row: a total of 6 that rests on items 3 and 4 is weak evidence of autism. In an Italian ADHD outpatient sample, about 1 in 5 adults (23 of 105, 21.9%) screened positive for autism traits on the Autism-Spectrum Quotient (Brancati et al. 2025, PMID 40960503). Autism and ADHD often coexist, and NICE CG142 lists ADHD as one reason to consider an autism assessment. Separate them by history: autistic social difficulty is about understanding other people and is present from early childhood; ADHD social difficulty comes mostly from interrupting, missing details or losing track because of inattention or impulsivity (reasoning). Ask a parent about early play, friendships, routines and sensory reactions.",
    licence: "Free for non-profit use only. Autism Research Centre: 'The AQ-10 is available free of charge for non-profit use, including research and education.' For-profit healthcare organisations, commercial users and IT companies may have to pay a fee, through Mapi Research Trust (ePROVIDE). Form © SBC/CA/BA/ARC/Cambridge University 1/5/12. The items are shown here only for non-profit clinical and educational use; any for-profit or commercial use of this app would need a licence through Mapi Research Trust. The PDF is not redistributed: download it from the ARC page.",
    source: "Allison C, Auyeung B, Baron-Cohen S. Toward brief 'red flags' for autism screening. JAACAP 2012;51:202-212. Ashwood KL et al. Psychol Med 2016;46:2595-2604. Sizoo BB et al. J Autism Dev Disord 2009;39:1291-1297. NICE CG142 1.2.2-1.2.3 (amended 2021). Brancati GE et al. Eur Arch Psychiatry Clin Neurosci 2025 (PMID 40960503).",
    url: "https://www.autismresearchcentre.com/tests/autism-spectrum-quotient-10-items-aq-10-adult/",
    file: null
  },

  /* ------------------------------------------------------------------ PCL-5 */
  {
    id: "pcl5", abbr: "PCL-5", name: "PTSD Checklist for DSM-5",
    group: "trauma", stage: ["comorbid", "followup"],
    who: "Self-report by the patient.", time: "5-10 minutes", ages: "Adults", items_n: 20,
    purpose: "Measures DSM-5 PTSD symptoms over the past month, tied to the person's worst stressful event. It gives a severity total (0-80) and a provisional check against the DSM-5 symptom pattern.",
    when: "In the Co-occurring conditions step when the history includes trauma, or after a positive PC-PTSD-5. PTSD causes poor concentration, irritability, risk-taking and sleep problems that can look like ADHD. It can also be repeated to track change.",
    how: "First establish that there was a qualifying traumatic event. The PCL-5 does not check this: use the version with the LEC-5 and a Criterion A question if needed. Ask the person to keep their worst event in mind and rate the past month. Add the 20 items (0-80). The app also checks the DSM-5 pattern, counting an item rated 2 ('Moderately') or more as endorsed.",
    interactive: true,
    instructions: "Below is a list of problems that people sometimes have in response to a very stressful experience. Keeping your worst event in mind, please read each problem carefully and choose how much you have been bothered by that problem in the past month. In the past month, how much were you bothered by:",
    options: [{ v: 0, l: "Not at all" }, { v: 1, l: "A little bit" }, { v: 2, l: "Moderately" }, { v: 3, l: "Quite a bit" }, { v: 4, l: "Extremely" }],
    items: [
      { n: 1, section: "Cluster B: intrusion", t: "Repeated, disturbing, and unwanted memories of the stressful experience?" },
      { n: 2, t: "Repeated, disturbing dreams of the stressful experience?" },
      { n: 3, t: "Suddenly feeling or acting as if the stressful experience were actually happening again (as if you were actually back there reliving it)?" },
      { n: 4, t: "Feeling very upset when something reminded you of the stressful experience?" },
      { n: 5, t: "Having strong physical reactions when something reminded you of the stressful experience (for example, heart pounding, trouble breathing, sweating)?" },
      { n: 6, section: "Cluster C: avoidance", t: "Avoiding memories, thoughts, or feelings related to the stressful experience?" },
      { n: 7, t: "Avoiding external reminders of the stressful experience (for example, people, places, conversations, activities, objects, or situations)?" },
      { n: 8, section: "Cluster D: negative changes in thinking and mood", t: "Trouble remembering important parts of the stressful experience?" },
      { n: 9, t: "Having strong negative beliefs about yourself, other people, or the world (for example, having thoughts such as: I am bad, there is something seriously wrong with me, no one can be trusted, the world is completely dangerous)?" },
      { n: 10, t: "Blaming yourself or someone else for the stressful experience or what happened after it?" },
      { n: 11, t: "Having strong negative feelings such as fear, horror, anger, guilt, or shame?" },
      { n: 12, t: "Loss of interest in activities that you used to enjoy?" },
      { n: 13, t: "Feeling distant or cut off from other people?" },
      { n: 14, t: "Trouble experiencing positive feelings (for example, being unable to feel happiness or have loving feelings for people close to you)?" },
      { n: 15, section: "Cluster E: arousal and reactivity", t: "Irritable behavior, angry outbursts, or acting aggressively?" },
      { n: 16, t: "Taking too many risks or doing things that could cause you harm?" },
      { n: 17, t: "Being “superalert” or watchful or on guard?" },
      { n: 18, t: "Feeling jumpy or easily startled?" },
      { n: 19, t: "Having difficulty concentrating?" },
      { n: 20, t: "Trouble falling or staying asleep?" }
    ],
    scoring: {
      method: "pcl5",
      cutoff: { value: 33, text: "Probable PTSD: confirm by interview. The VA gives a range of 31-33; the app uses 33 (the upper end, fewer false positives), so treat 31-32 as borderline" },
      clusters: { B: [1, 2, 3, 4, 5], C: [6, 7], D: [8, 9, 10, 11, 12, 13, 14], E: [15, 16, 17, 18, 19, 20] },
      subscales: [
        { id: "b", label: "B Intrusion (items 1-5)", items: [1, 2, 3, 4, 5] },
        { id: "c", label: "C Avoidance (items 6-7)", items: [6, 7] },
        { id: "d", label: "D Thinking and mood (items 8-14)", items: [8, 9, 10, 11, 12, 13, 14] },
        { id: "e", label: "E Arousal and reactivity (items 15-20)", items: [15, 16, 17, 18, 19, 20] }
      ]
    },
    interpretation: [
      "Total 0-80. VA National Center for PTSD: a cut-off between 31 and 33 indicates probable PTSD across samples. The app marks 33 or more as positive; a score of 31-32 is borderline and needs the same careful interview. There are no empirically derived severity bands.",
      "Provisional DSM-5 pattern: at least 1 cluster B item, 1 cluster C item, 2 cluster D items and 2 cluster E items rated 2 or more. The VA notes that a cut-off score tends to be more reliable than this rule.",
      "Change over time: a 10-point change suggests a response to treatment; one study suggested a score below 28 as clinically significant change (Marx et al. 2022, cited by the VA).",
      "A provisional result needs a clinical interview (for example the CAPS-5) and a confirmed traumatic event."
    ],
    psychometrics: "Blevins et al. 2015: internal consistency alpha .94, test-retest r = .82. Bovin et al. 2016: alpha .96, test-retest .84; scores of 31-33 were optimally efficient for diagnosing PTSD against the CAPS-5. No validation study in adults with ADHD was found.",
    pitfalls: [
      "Scoring it without a confirmed traumatic event.",
      "Reading the cluster pattern as a diagnosis.",
      "Letting lifelong ADHD features (concentration, sleep, irritability, risk-taking) drive a high cluster E score.",
      "Completing it about an upsetting but non-traumatic stressor, which raises scores without meaning PTSD (clinical practice)."
    ],
    adhdNotes: "Four cluster E items overlap with ADHD: 15 (irritability or angry outbursts), 16 (risk-taking), 19 (difficulty concentrating) and 20 (sleep problems). Item 8 (trouble remembering parts of the event) can reflect poor attention at the time. Look at the cluster rows: a raised total driven by cluster E, with low intrusion (B) and avoidance (C) scores, does not suggest PTSD (reasoning from item content). Ask whether each symptom started after the trauma or was there in childhood before it. Symptoms that predate the trauma and do not change with reminders favour ADHD; new symptoms after the event, with intrusions and avoidance, favour PTSD. Both can coexist, and a trauma-informed approach is advised throughout.",
    licence: "Public domain. VA National Center for PTSD: 'This measure was developed by staff at VA's National Center for PTSD and is in the public domain and not copyrighted.' It is intended for use by qualified health professionals and researchers. The PDF is the VA standard form (version date 29 August 2023).",
    source: "Weathers FW, Litz BT, Keane TM, Palmieri PA, Marx BP, Schnurr PP. The PTSD Checklist for DSM-5 (PCL-5). National Center for PTSD, 2013. Blevins CA et al. J Trauma Stress 2015;28:489-498. Bovin MJ et al. Psychol Assess 2016;28:1379-1391. VA National Center for PTSD, Using the PCL-5.",
    url: "https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp",
    file: "tools/pcl5.pdf"
  },

  /* ------------------------------------------------------------------ MSI-BPD (score sheet only) */
  {
    id: "msibpd", abbr: "MSI-BPD", name: "McLean Screening Instrument for Borderline Personality Disorder",
    group: "personality", stage: ["comorbid"],
    who: "Self-report on the published questionnaire, then reviewed with the patient.", time: "2-3 minutes", ages: "Adults (validated aged 18-59)", items_n: 10,
    purpose: "A 10-item yes/no screen for borderline personality disorder. The items follow the DSM-IV criteria for the disorder.",
    when: "In the Co-occurring conditions step when the history includes marked emotional instability, self-harm, chaotic relationships or fears of abandonment. These overlap with ADHD emotional dysregulation, and the two conditions often coexist.",
    how: "This is a score sheet. The questionnaire wording is not reproduced here. Give the patient the published questionnaire (Zanarini 2003), then record each answer. The labels are short content summaries for scoring. Count the 'yes' answers (0-10). Go through the endorsed items at interview.",
    interactive: true,
    instructions: "Score sheet. Record the patient's answers from the published MSI-BPD. Labels summarise item content only; they are not the questionnaire wording.",
    options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }],
    items: [
      { n: 1, t: "Stormy, unstable close relationships" },
      { n: 2, t: "Deliberate self-harm or a suicide attempt" },
      { n: 3, t: "Impulsivity in two or more other areas" },
      { n: 4, t: "Marked mood swings" },
      { n: 5, t: "Intense or frequent anger" },
      { n: 6, t: "Often distrustful of other people" },
      { n: 7, t: "Feelings of unreality about self or surroundings" },
      { n: 8, t: "Long-standing feelings of emptiness" },
      { n: 9, t: "Unstable or absent sense of identity" },
      { n: 10, t: "Frantic efforts to avoid being abandoned" }
    ],
    scoring: {
      method: "sum",
      cutoff: { value: 7, text: "Possible borderline personality disorder: assess at interview (Zanarini 2003)" },
      flags: [
        { item: 2, min: 1, level: "urgent", text: "Self-harm or a suicide attempt endorsed. Ask today about recent self-harm and current suicidal thoughts (Safety and risk step), whatever the total." }
      ]
    },
    interpretation: [
      "7 or more: possible borderline personality disorder. Assess at interview, ideally with a structured personality disorder interview.",
      "Below 7 does not rule it out.",
      "Look at which items are endorsed. Identity disturbance, chronic emptiness, abandonment fears and recurrent self-harm are more specific to BPD than impulsivity, anger and mood swings, which ADHD shares (RCPsych CR235 differentiating features)."
    ],
    psychometrics: "Zanarini et al. 2003 (200 treatment-seeking adults aged 18-59, against the DIPD-IV interview): at 7 or more, sensitivity .81 and specificity .85; in those aged 25 or under, sensitivity .90 and specificity .93. No validation study in adults with ADHD was found.",
    pitfalls: [
      "Counting ADHD impulsivity, anger or mood swings as evidence of BPD without checking the pattern.",
      "Diagnosing a personality disorder from a questionnaire.",
      "Missing current risk when item 2 is positive.",
      "Not considering that a mood episode, substance use or trauma can raise the score (clinical practice)."
    ],
    adhdNotes: "Items 1 (unstable relationships), 3 (impulsivity), 4 (mood swings) and 5 (anger) are common in adults with ADHD, so ADHD alone can reach 3 or 4 points (reasoning from item content). The items that separate BPD are identity disturbance (9), chronic emptiness (8), frantic efforts to avoid abandonment (10), recurrent self-harm (2) and stress-related unreality or suspiciousness (6-7). In ADHD, mood shifts are usually brief, triggered by frustration or boredom, and settle quickly; in BPD they are more often triggered by perceived rejection in close relationships (clinical practice). ADHD symptoms should be present from childhood and seen across settings. Both can coexist: if they do, record both and plan for each.",
    licence: "Unverified. No statement from the authors or McLean Hospital allowing free reproduction was found. The items are therefore not reproduced: this app offers a score sheet with content labels and applies the published cut-off. Obtain the questionnaire from the original article or the authors. No PDF is redistributed.",
    source: "Zanarini MC, Vujanovic AA, Parachini EA, Boulanger JL, Frankenburg FR, Hennen J. A screening measure for BPD: the McLean Screening Instrument for Borderline Personality Disorder (MSI-BPD). J Pers Disord 2003;17:568-573. RCPsych CR235 (2023).",
    url: "https://pubmed.ncbi.nlm.nih.gov/14744082/",
    file: null
  },

  /* ------------------------------------------------------------------ STOP-Bang (information only) */
  {
    id: "stopbang", abbr: "STOP-Bang", name: "STOP-Bang questionnaire for obstructive sleep apnoea",
    group: "sleep", stage: ["comorbid", "physical"],
    who: "Clinician with the patient (needs blood pressure history, BMI and neck size), ideally with a bed partner's report.", time: "About 2 minutes", ages: "Adults", items_n: 8,
    purpose: "Screens for obstructive sleep apnoea (OSA). Eight yes/no questions cover loud snoring, daytime tiredness, observed pauses in breathing, treated high blood pressure, BMI over 35, age over 50, a large neck and male sex.",
    when: "When an adult reports loud snoring, witnessed pauses in breathing, unrefreshing sleep, morning headaches or dozing in the day, especially with obesity or high blood pressure, or when attention problems began in adulthood. OSA causes inattention, poor memory and irritability that can look like ADHD. NICE NG202 1.1.1 advises assessing for OSA when 2 or more features are present (its list includes snoring, witnessed apnoeas, unrefreshing sleep, waking headaches, unexplained sleepiness or fatigue, and cognitive dysfunction or memory impairment). NICE NG202 1.1.3 says to use the Epworth Sleepiness Scale and to consider the STOP-Bang as well.",
    how: "Use the official questionnaire from stopbang.ca (check your organisation's licence with University Health Network). Count the 'yes' answers and apply the risk rules below. Use it with the Epworth Sleepiness Scale, not instead of a sleep history: NICE NG202 1.1.4 warns that not everyone with OSA is sleepy. Refer to the local sleep service if OSA is likely.",
    interactive: false,
    items: [],
    scoring: {
      method: "count",
      bands: [
        { min: 0, max: 2, label: "Low risk of OSA", sev: 0 },
        { min: 3, max: 4, label: "Intermediate risk of OSA", sev: 2 },
        { min: 5, max: 8, label: "High risk of OSA", sev: 3 }
      ]
    },
    interpretation: [
      "stopbang.ca (general population): 'yes' to 0-2 questions is low risk, 3-4 intermediate risk and 5-8 high risk.",
      "Also high risk: 'yes' to 2 or more of the 4 STOP questions plus male sex, or plus BMI over 35, or plus a neck circumference of 16 inches (40 cm) or more.",
      "Intermediate or high risk, or a convincing history whatever the score: refer to the local sleep service. NICE NG202 1.3.1 recommends home respiratory polygraphy as the first diagnostic test (home oximetry if polygraphy access is limited, 1.3.2).",
      "If OSA is likely and the ADHD history is unclear, treat OSA first and reassess attention (clinical practice)."
    ],
    psychometrics: "Chung et al. 2008 (surgical patients before operations): adding BMI, age, neck circumference and sex to the STOP questions raised sensitivity to 83.6%, 92.9% and 100% for apnoea-hypopnoea index cut-offs above 5, 15 and 30. It was developed in surgical patients; its accuracy in ADHD clinics is unknown.",
    pitfalls: [
      "Relying on the patient's own report of snoring. Ask a bed partner.",
      "Missing OSA in women and in slimmer people, who score lower because of the sex and BMI items (reasoning from item content).",
      "Putting daytime tiredness down to ADHD or stimulants without asking about sleep."
    ],
    adhdNotes: "OSA is an important ADHD mimic in adults: it causes inattention, forgetfulness, irritability and fatigue, and attention problems are common in people with OSA. Clues that point to OSA rather than ADHD: onset in adulthood or with weight gain, loud snoring, witnessed pauses in breathing, morning headaches and falling asleep unintentionally in the day. Lifelong symptoms from childhood, before any snoring or weight gain, favour ADHD. The two can coexist. In small interventional studies, treating OSA improved inattention, so a clear improvement after CPAP supports OSA as the explanation.",
    licence: "Restricted. stopbang.ca: 'Property of University Health Network' and 'Copyright © 2012 | www.stopbang.ca | All Rights Reserved'; permission to use the survey is requested by email to UHN. UHN's express-licence page says non-academic use, including routine patient intake or screening, needs a licence. The questionnaire is therefore not reproduced or scored here. The risk bands above are shown for interpretation.",
    source: "Chung F et al. STOP questionnaire: a tool to screen patients for obstructive sleep apnea. Anesthesiology 2008;108:812-821. stopbang.ca screening page (accessed October 2026). NICE NG202 Obstructive sleep apnoea/hypopnoea syndrome and obesity hypoventilation syndrome in over 16s (2021), recs 1.1.1-1.1.4 and 1.3.1-1.3.2.",
    url: "http://www.stopbang.ca/osa/screening.php",
    file: null
  },

  /* ------------------------------------------------------------------ C-SSRS Screen (triage) */
  {
    id: "cssrs", abbr: "C-SSRS", name: "Columbia-Suicide Severity Rating Scale, Screen Version (Recent, with triage points)",
    group: "risk", stage: ["risk", "comorbid", "followup"],
    who: "Asked by the clinician. Columbia says no mental health training is needed to use it.", time: "1-3 minutes", ages: "Adults", items_n: 6,
    purpose: "A short, structured set of questions about suicidal thoughts in the past month and suicidal behaviour over the lifetime and in the past 3 months. On the Columbia form some answers carry triage points (yellow, orange, red) that show how urgently a clinician needs to respond.",
    when: "In the Safety and risk step, whenever PHQ-9 item 9 is positive, the person mentions self-harm or suicidal thoughts, or you have any concern. UK guidance expects a risk assessment in every adult ADHD assessment (UKAAN AQAS; RCPsych CR235). Use it as a structured way to ask, not as a risk score: NICE NG225 1.6.1-1.6.3 says not to use risk tools or scales to predict suicide or repeat self-harm, or to decide who is offered treatment or discharged, and not to sort people into low, medium or high risk to predict suicide.",
    how: "Ask the questions in order, directly and calmly. Always ask questions 1 and 2. If question 2 is 'yes', ask 3, 4, 5 and 6. If question 2 is 'no', go straight to 6 and mark 3-5 as not asked. If question 6 is 'yes', ask whether it was within the past 3 months. Then explore what the person has told you, agree a safety plan and record it.",
    interactive: true,
    instructions: "Ask questions 1 and 2. If YES to 2, ask questions 3, 4, 5 and 6. If NO to 2, go directly to question 6. Questions 1-5 are about the past month.",
    options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }],
    items: [
      { n: 1, section: "Past month", t: "Have you wished you were dead or wished you could go to sleep and not wake up?" },
      { n: 2, t: "Have you actually had any thoughts of killing yourself?" },
      { n: 3, t: "Have you been thinking about how you might do this?",
        sub: "E.g. “I thought about taking an overdose but I never made a specific plan as to when where or how I would actually do it….and I would never go through with it.”",
        opts: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }, { v: "na", l: "Not asked (No to 2)" }] },
      { n: 4, t: "Have you had these thoughts and had some intention of acting on them?",
        sub: "As opposed to “I have the thoughts but I definitely will not do anything about them.”",
        opts: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }, { v: "na", l: "Not asked (No to 2)" }] },
      { n: 5, t: "Have you started to work out or worked out the details of how to kill yourself? Did you intend to carry out this plan?",
        opts: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }, { v: "na", l: "Not asked (No to 2)" }] },
      { n: 6, section: "Lifetime", t: "Have you ever done anything, started to do anything, or prepared to do anything to end your life?",
        sub: "Examples: Took pills, tried to shoot yourself, cut yourself, or hang yourself, took out pills but didn’t swallow any, held a gun but changed your mind or it was grabbed from your hand, went to the roof but didn’t jump, collected pills, obtained a gun, gave away valuables, wrote a will or suicide note, etc." },
      { n: 7, t: "Follow-up to question 6. If YES: Was this within the past three months?",
        opts: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }, { v: "na", l: "Not asked (No to 6)" }] }
    ],
    scoring: {
      method: "triage",
      levels: [
        { label: "Red triage point: respond now", sev: 3, any: [4, 5, 7],
          text: "Red triage point (intent, a worked-out plan, or suicidal behaviour in the past 3 months). Pause the ADHD assessment and do not end the appointment yet. With the person, assess intent, plans, preparation, access to means and what keeps them safe. If you judge the risk to be immediate, do not leave them alone and get urgent help through your local crisis pathway (crisis or home treatment team, duty psychiatrist, liaison psychiatry via the emergency department, or 999). Agree a safety plan, involve people they trust if they agree, tell the GP the same day and record what you did. This is the level of response needed now, not a prediction (NICE NG225)." },
        { label: "Orange triage point: assess today", sev: 2, any: [3, 6],
          text: "Orange triage point (thinking about how to do it, or suicidal behaviour more than 3 months ago). Explore today: what the thoughts involve, any past attempts (what happened, intent, what stopped them), current access to means, and protective factors. Agree a written safety plan with crisis contacts (local crisis line, NHS 111, Samaritans 116 123, 999 in an emergency) and arrange follow-up with the mental health team or GP according to local policy. Record the conversation. This is the level of response needed now, not a prediction (NICE NG225)." },
        { label: "Yellow triage point: explore today", sev: 1, any: [1, 2],
          text: "Yellow triage point (a wish to be dead or thoughts of suicide, without method, intent, plan or behaviour). Talk it through today: how often, how strong, what triggers the thoughts and what helps. Share crisis contacts, consider a safety plan, and inform the GP or mental health team according to local policy. Ask again at each appointment. This is the level of response needed now, not a prediction (NICE NG225)." }
      ],
      flags: [
        { item: 1, min: 1, equals: 1, level: "urgent", text: "Wish to be dead in the past month: explore it today and agree what the person will do if it gets worse." },
        { item: 2, min: 1, equals: 1, level: "urgent", text: "Thoughts of killing themselves in the past month: ask questions 3-6 and assess today." },
        { item: 3, min: 1, equals: 1, level: "urgent", text: "Thinking about how they might do it: assess today, including access to means." },
        { item: 4, min: 1, equals: 1, level: "urgent", text: "Some intention to act on suicidal thoughts: respond now (red triage point)." },
        { item: 5, min: 1, equals: 1, level: "urgent", text: "Has worked out, or started to work out, a plan: respond now (red triage point)." },
        { item: 6, min: 1, equals: 1, level: "urgent", text: "Lifetime suicidal behaviour: ask what happened and whether it was within the past 3 months." },
        { item: 7, min: 1, equals: 1, level: "urgent", text: "Suicidal behaviour in the past 3 months: respond now (red triage point)." }
      ]
    },
    interpretation: [
      "The app reports the highest triage point reached, using the colour key on the Columbia screener: red for 'yes' to 4 or 5, or behaviour within the past 3 months (item 7, the follow-up to question 6); orange for 'yes' to 3, or behaviour longer ago; yellow for 'yes' to 1 or 2 only.",
      "Columbia's outpatient response protocol: 'yes' to items 1, 2 or 3, or to item 6 more than 3 months ago, calls for a behavioural health referral; 'yes' to items 4 or 5, or to item 6 within 3 months, calls for a behavioural health consultation and patient safety precautions. The actions in this app adapt that protocol to UK services. Follow your local policy.",
      "NICE NG225 1.6.1-1.6.3: do not use risk assessment tools and scales to predict future suicide or repeat self-harm, or to decide who should be offered treatment or discharged, and do not use global low, medium or high risk stratification to predict them. Use the answers to guide a psychosocial assessment and a safety plan.",
      "A 'no' to every question does not mean there is no risk. Clinical judgement, informant concerns and what the person says later override the screen."
    ],
    psychometrics: "Posner et al. 2011 (full C-SSRS, three multisite studies with adolescents and adults): good convergent and divergent validity, high sensitivity and specificity for classifying suicidal behaviour, and suicidal ideation predicted later attempts. Accuracy figures for the screen version alone were not checked for this app.",
    pitfalls: [
      "Treating the colour as a prediction, or as a reason to discharge or withhold care (NICE NG225).",
      "Skipping question 6 when question 2 is 'no'.",
      "Asking vaguely or in a leading way instead of using the direct questions.",
      "Forgetting to ask whether lifetime behaviour was within the past 3 months.",
      "Not asking again when circumstances change, for example after diagnostic feedback (clinical practice)."
    ],
    adhdNotes: "Impulsivity in ADHD can shorten the time between a suicidal thought and acting on it (reasoning), so take recent behaviour (question 6 and the 3-month follow-up) and impulsive past acts seriously, even when current thoughts sound mild. Ask about alcohol and drug use, recent losses, rejection or shame, and access to means. Emotional dysregulation can make thoughts come and go quickly: ask about the worst point in the past month, not only today. Ask again after diagnostic feedback, because both a diagnosis and a 'not ADHD' outcome can be distressing (clinical practice).",
    licence: "Free for clinical use. The Columbia Lighthouse Project states: 'You do not need special permission from us to take the Columbia Protocol tools and use them in your setting', and that anyone can use the Columbia Protocol without mental health training. Licences are needed for pharmaceutical or industry-funded trials, and the computer-automated eC-SSRS is supplied separately. The questions are reproduced here for clinical use. The PDF is not redistributed because redistribution is not explicitly permitted: download it from the Columbia site.",
    source: "Posner K, Brown GK, Stanley B, et al. The Columbia-Suicide Severity Rating Scale: initial validity and internal consistency findings from three multisite studies with adolescents and adults. Am J Psychiatry 2011;168:1266-1277. C-SSRS Screener with triage points (2026) and Screener with triage points for outpatient/ambulatory settings (2026), Columbia Lighthouse Project. NICE NG225 1.6.1-1.6.3.",
    url: "https://cssrs.columbia.edu/the-columbia-scale-c-ssrs/cssrs-for-communities-and-healthcare/",
    file: null
  },

  /* ------------------------------------------------------------------ CAGE-AID (information only) */
  {
    id: "cageaid", abbr: "CAGE-AID", name: "CAGE Adapted to Include Drugs",
    group: "substance", stage: ["comorbid"],
    who: "Self-report, or asked by the clinician.", time: "About 1 minute", ages: "Adults", items_n: 4,
    purpose: "Four yes/no questions about drinking or drug use over the lifetime: wanting to Cut down, being Annoyed by criticism, feeling Guilty, and using first thing in the morning as an Eye-opener. It adapts the CAGE alcohol questions to include drugs.",
    when: "An optional quick screen for alcohol and drug problems together. For current problems prefer the AUDIT (or AUDIT-C) and the DAST-10, because the CAGE-AID asks whether something has ever happened.",
    how: "Use the official form. Include illegal drugs and prescription drugs used other than as prescribed. Count the 'yes' answers (0-4).",
    interactive: false,
    items: [],
    scoring: {
      method: "count",
      cutoff: { value: 1, text: "Positive screen (one or more 'yes'). Two or more is more specific" }
    },
    interpretation: [
      "One or more 'yes': positive screen (sensitivity 0.79, specificity 0.77). Two or more: sensitivity 0.70, specificity 0.85 (Brown and Rounds 1995, as reported on the Washington State AMDG form).",
      "The questions cover the whole lifetime, so a 'yes' may reflect past problems. Ask when.",
      "Follow a positive screen with a substance use history and the AUDIT or DAST-10."
    ],
    psychometrics: "Brown and Rounds 1995 (primary care): the CAGE-AID was more sensitive but less specific than the original CAGE; figures as above.",
    pitfalls: [
      "Reading a lifetime 'yes' as current use.",
      "Relying on it to detect binge patterns, which it does not ask about (reasoning)."
    ],
    adhdNotes: "Guilt and irritation at criticism are common in adults with ADHD for reasons that have nothing to do with substances, so check that each 'yes' is about drinking or drugs. Morning use (the eye-opener question) suggests dependence. Because the questions cover the whole lifetime, they cannot show whether substance use came before or after the attention problems: build a timeline instead.",
    licence: "Unverified. Public-sector toolkits reproduce it, some stating that permission was granted by Richard Brown, MD, but no statement from the rights holder allowing free reproduction was found. Not reproduced here.",
    source: "Brown RL, Rounds LA. Conjoint screening questionnaires for alcohol and other drug abuse: criterion validity in a primary care practice. Wis Med J 1995;94:135-140. Washington State Agency Medical Directors' Group CAGE-AID form.",
    url: "https://pubmed.ncbi.nlm.nih.gov/7778330/",
    file: null
  },

  /* ------------------------------------------------------------------ PC-PTSD-5 */
  {
    id: "pcptsd5", abbr: "PC-PTSD-5", name: "Primary Care PTSD Screen for DSM-5",
    group: "trauma", stage: ["pre", "comorbid"],
    who: "Self-report, or asked by the clinician.", time: "1-2 minutes", ages: "Adults", items_n: 5,
    purpose: "A 5-item yes/no screen for probable PTSD over the past month. It starts with a question about lifetime exposure to a traumatic event.",
    when: "As a quick screen in the pre-assessment pack or the Co-occurring conditions step when trauma is reported or suspected. NICE NG116 suggests a validated brief PTSD screen in some groups (for example after major disasters and for refugees and asylum seekers) without naming one. If positive, go on to the PCL-5 and a clinical interview.",
    how: "Ask the trauma question first. If the answer is 'no', the screen ends with a score of 0. If 'yes', ask the 5 questions about the past month and count the 'yes' answers (0-5).",
    interactive: true,
    instructions: "Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. For example: a serious accident or fire; a physical or sexual assault or abuse; an earthquake or flood; a war; seeing someone be killed or seriously injured; having a loved one die through homicide or suicide.",
    options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }],
    items: [
      { n: 0, label: "Event", unscored: true, section: "Trauma exposure", sectionNote: "If no, the screen total is 0. Stop here.", t: "Have you ever experienced this kind of event?" },
      { n: 1, section: "In the past month, have you…", t: "had nightmares about the event(s) or thought about the event(s) when you did not want to?" },
      { n: 2, t: "tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?" },
      { n: 3, t: "been constantly on guard, watchful, or easily startled?" },
      { n: 4, t: "felt numb or detached from people, activities, or your surroundings?" },
      { n: 5, t: "felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?" }
    ],
    scoring: {
      method: "sum",
      cutoff: { value: 4, text: "Probable PTSD: go on to the PCL-5 or a structured interview. The VA notes a cut-point of 3 may suit women when resources allow" },
      flags: [
        { item: 0, equals: 0, level: "warn", text: "No traumatic event reported: the PC-PTSD-5 score is 0. Ignore any answers entered for items 1-5." }
      ]
    },
    interpretation: [
      "Score 0-5, a count of 'yes' answers. A 'no' to the trauma question gives a score of 0.",
      "VA: a cut-point of 4 balanced false negatives and false positives for the whole sample and for men. For women, 4 gave many false negatives, so a lower cut-point can be considered if evaluation resources are available. A higher cut-point may suit services where false positives would use up clinician time.",
      "A positive screen needs further assessment, preferably with a structured interview. Use the PCL-5 for severity."
    ],
    psychometrics: "Prins et al. 2016 (VA primary care): area under the curve 0.941; a cut score of 3 maximised sensitivity, 4 efficiency and 5 specificity. Bovin et al. 2021: area under the curve 0.927 overall (men 0.932, women 0.899); a cut-point of 3 fitted better for women. No validation study in adults with ADHD was found.",
    pitfalls: [
      "The trauma question records exposure as the person reports it. It does not check DSM-5 Criterion A in detail.",
      "Make sure the answers are about the traumatic event, not general stress.",
      "Using the cut-point of 4 for women without thinking about missed cases."
    ],
    adhdNotes: "Items 1, 2 and 5 refer directly to the traumatic event, so ADHD is less likely to inflate the PC-PTSD-5 than broad symptom scales (reasoning). Items 3 (constantly on guard, watchful or easily startled) and 4 (numb or detached) do not mention the event and can be endorsed because of anxiety, depression or long-standing restlessness: ask whether they started after the event. A positive screen in someone referred for ADHD should lead to the PCL-5 and a timeline: did the attention problems start before or after the trauma?",
    licence: "Public domain. VA National Center for PTSD: 'This measure was developed by staff at VA's National Center for PTSD and is in the public domain and not copyrighted.' The PDF is the VA form (version date 2022).",
    source: "Prins A, Bovin MJ, Kimerling R, Kaloupek DG, Marx BP, Pless Kaiser A, Schnurr PP. Primary Care PTSD Screen for DSM-5 (PC-PTSD-5). National Center for PTSD, 2015. Prins A et al. J Gen Intern Med 2016;31:1206-1211. Bovin MJ et al. JAMA Netw Open 2021;4:e2036733. NICE NG116 1.1.7-1.1.8.",
    url: "https://www.ptsd.va.gov/professional/assessment/screens/pc-ptsd.asp",
    file: "tools/pcptsd5.pdf"
  },

  /* ------------------------------------------------------------------ ITQ */
  {
    id: "itq", abbr: "ITQ", name: "International Trauma Questionnaire (ICD-11 PTSD and complex PTSD)",
    group: "trauma", stage: ["comorbid"],
    who: "Self-report by the patient.", time: "About 5 minutes", ages: "Adults", items_n: 18,
    purpose: "Measures ICD-11 PTSD and complex PTSD. Six PTSD items (re-experiencing in the here and now, avoidance, sense of current threat) and six 'disturbances in self-organisation' (DSO) items (affective dysregulation, negative self-concept, disturbed relationships), each set followed by three impairment questions. Diagnosis uses a fixed algorithm, not a cut-off.",
    when: "In the Co-occurring conditions step when there is a trauma history and the picture includes long-standing emotional dysregulation, low self-worth and relationship difficulties, which overlap with both ADHD and complex PTSD. It is the ICD-11-based alternative to the PCL-5.",
    how: "Ask the person to name the experience that troubles them most and when it happened. They rate each item 0-4: the PTSD items for the past month, the DSO items for how true they typically are. Then apply the algorithm by hand (see Interpretation): an item counts as endorsed when it is rated 2 ('Moderately') or more. The app shows the item ratings and the cluster scores.",
    interactive: true,
    instructions: "Please identify the experience that troubles you most and answer the questions in relation to this experience. Note what it was and when it happened (less than 6 months ago, 6 to 12 months, 1 to 5 years, 5 to 10 years, 10 to 20 years, or more than 20 years ago).",
    options: [{ v: 0, l: "Not at all" }, { v: 1, l: "A little bit" }, { v: 2, l: "Moderately" }, { v: 3, l: "Quite a bit" }, { v: 4, l: "Extremely" }],
    items: [
      { n: 1, label: "P1", section: "PTSD symptoms (past month)", sectionNote: "Below are a number of problems that people sometimes report in response to traumatic or stressful life events. How much have you been bothered by each problem in the past month?",
        t: "Having upsetting dreams that replay part of the experience or are clearly related to the experience?" },
      { n: 2, label: "P2", t: "Having powerful images or memories that sometimes come into your mind in which you feel the experience is happening again in the here and now?" },
      { n: 3, label: "P3", t: "Avoiding internal reminders of the experience (for example, thoughts, feelings, or physical sensations)?" },
      { n: 4, label: "P4", t: "Avoiding external reminders of the experience (for example, people, places, conversations, objects, activities, or situations)?" },
      { n: 5, label: "P5", t: "Being “super-alert”, watchful, or on guard?" },
      { n: 6, label: "P6", t: "Feeling jumpy or easily startled?" },
      { n: 7, label: "P7", unscored: true, section: "Impact of the PTSD symptoms", sectionNote: "In the past month have the above problems:", t: "Affected your relationships or social life?" },
      { n: 8, label: "P8", unscored: true, t: "Affected your work or ability to work?" },
      { n: 9, label: "P9", unscored: true, t: "Affected any other important part of your life such as parenting, or school or college work, or other important activities?" },
      { n: 10, label: "C1", section: "Disturbances in self-organisation (how true is this of you?)", sectionNote: "Below are problems that people who have had stressful or traumatic events sometimes experience. The questions refer to ways you typically feel, ways you typically think about yourself and ways you typically relate to others. Answer the following thinking about how true each statement is of you.",
        t: "When I am upset, it takes me a long time to calm down." },
      { n: 11, label: "C2", t: "I feel numb or emotionally shut down." },
      { n: 12, label: "C3", t: "I feel like a failure." },
      { n: 13, label: "C4", t: "I feel worthless." },
      { n: 14, label: "C5", t: "I feel distant or cut off from people." },
      { n: 15, label: "C6", t: "I find it hard to stay emotionally close to people." },
      { n: 16, label: "C7", unscored: true, section: "Impact of the self-organisation problems", sectionNote: "In the past month, have the above problems in emotions, in beliefs about yourself and in relationships:", t: "Created concern or distress about your relationships or social life?" },
      { n: 17, label: "C8", unscored: true, t: "Affected your work or ability to work?" },
      { n: 18, label: "C9", unscored: true, t: "Affected any other important parts of your life such as parenting, or school or college work, or other important activities?" }
    ],
    scoring: {
      method: "sum",
      subscales: [
        { id: "ptsd", label: "PTSD score (P1-P6)", items: [1, 2, 3, 4, 5, 6] },
        { id: "re", label: "Re-experiencing (P1-P2)", items: [1, 2] },
        { id: "av", label: "Avoidance (P3-P4)", items: [3, 4] },
        { id: "th", label: "Sense of current threat (P5-P6)", items: [5, 6] },
        { id: "ptsdfi", label: "PTSD functional impairment (P7-P9)", items: [7, 8, 9] },
        { id: "dso", label: "DSO score (C1-C6)", items: [10, 11, 12, 13, 14, 15] },
        { id: "ad", label: "Affective dysregulation (C1-C2)", items: [10, 11] },
        { id: "nsc", label: "Negative self-concept (C3-C4)", items: [12, 13] },
        { id: "dr", label: "Disturbances in relationships (C5-C6)", items: [14, 15] },
        { id: "dsofi", label: "DSO functional impairment (C7-C9)", items: [16, 17, 18] }
      ]
    },
    interpretation: [
      "The developers say cut-off scores should not be used: caseness is judged only with the diagnostic algorithm.",
      "An item is endorsed when it is rated 2 ('Moderately') or more.",
      "PTSD criteria: P1 or P2 endorsed, and P3 or P4, and P5 or P6, and at least one of P7-P9.",
      "DSO criteria: C1 or C2 endorsed, and C3 or C4, and C5 or C6, and at least one of C7-C9.",
      "Complex PTSD: PTSD criteria and DSO criteria both met. PTSD: PTSD criteria met but not DSO. DSO criteria alone, or neither: no diagnosis. A person receives PTSD or complex PTSD, not both.",
      "Dimensional scores: PTSD score P1-P6 (0-24) and DSO score C1-C6 (0-24), shown in the subscale table. The overall total the app shows (0-48) is not an ITQ score."
    ],
    psychometrics: "Cloitre et al. 2018 developed and validated the final 12-symptom-item version, which is the only version the developers support. Accuracy figures were not checked for this app. A positive algorithm result is provisional until confirmed by clinical interview.",
    pitfalls: [
      "Using a cut-off instead of the algorithm.",
      "Calling self-organisation problems complex PTSD when the PTSD criteria are not met.",
      "Using older, longer versions of the ITQ.",
      "Reading lifelong ADHD-related emotional dysregulation and low self-worth as effects of trauma."
    ],
    adhdNotes: "C1 ('When I am upset, it takes me a long time to calm down') overlaps with ADHD emotional dysregulation, and C3-C4 (feeling a failure, feeling worthless) with the demoralisation many adults with ADHD describe after years of underachievement. The algorithm protects against over-calling complex PTSD: self-organisation problems count only when the PTSD criteria (re-experiencing, avoidance and sense of threat, with impairment) are also met. So a person with ADHD who rates C1-C4 highly but has no re-experiencing or avoidance does not meet complex PTSD. Where both are present, take a timeline: ADHD symptoms should be present since childhood and before the trauma. RCPsych CR235 lists flashbacks, nightmares and dissociation as features that point to complex PTSD. The two can coexist.",
    licence: "Public domain. The ITQ document and the International Trauma Consortium state: 'The ITQ is freely available in the public domain to all interested parties.' The developers support only the final 12-symptom-item version. The PDF was made from the official English DOCX without changes.",
    source: "Cloitre M, Shevlin M, Brewin CR, Bisson JI, Roberts NP, Maercker A, Karatzias T, Hyland P. The International Trauma Questionnaire: development of a self-report measure of ICD-11 PTSD and complex PTSD. Acta Psychiatr Scand 2018;138:536-546. International Trauma Consortium, ITQ English version and scoring instructions.",
    url: "https://www.traumameasuresglobal.com/ptsd",
    file: "tools/itq.pdf"
  },

  /* ------------------------------------------------------------------ PQ-16 (information only) */
  {
    id: "pq16", abbr: "PQ-16", name: "Prodromal Questionnaire, 16 items",
    group: "psychosis", stage: ["comorbid"],
    who: "Self-report by the patient.", time: "About 5 minutes", ages: "People seeking help from mental health services (validated in a general help-seeking population)", items_n: 16,
    purpose: "Screens help-seeking people for an ultra-high-risk (prodromal) state for psychosis. Sixteen true/false items: 9 on unusual perceptions, 5 on unusual thoughts or suspiciousness, and 2 on negative symptoms. Each 'true' answer is followed by a distress rating.",
    when: "In the Co-occurring conditions step when the history includes unusual perceptual experiences, suspiciousness or a decline in functioning. Psychotic symptoms are not features of ADHD and represent another diagnosis (RCPsych CR235).",
    how: "Use the published questionnaire. Count the 'true' answers (0-16). A positive screen needs a specialist interview, such as the CAARMS, not a label.",
    interactive: false,
    items: [],
    scoring: {
      method: "count",
      cutoff: { value: 6, text: "Possible at-risk mental state: refer for specialist assessment (for example a CAARMS interview)" }
    },
    interpretation: [
      "6 or more 'true' answers: positive screen (Ising 2012).",
      "No validated cut-off for the distress ratings was reported.",
      "The positive predictive value was 44%, so most people who screen positive do not have an at-risk mental state; the negative predictive value was 98%."
    ],
    psychometrics: "Ising et al. 2012 (help-seeking patients, against the CAARMS): at 6 or more, sensitivity 87%, specificity 87%, positive predictive value 44%, negative predictive value 98%, area under the curve 0.93.",
    pitfalls: [
      "Labelling psychosis risk from a questionnaire.",
      "Counting common experiences such as déjà vu as psychotic-like without asking more.",
      "Not asking about cannabis and stimulant use, which can cause unusual experiences (clinical practice)."
    ],
    adhdNotes: "Some items can be endorsed by people with ADHD or anxiety for non-psychotic reasons, such as being distracted by faint background sounds or feeling anxious in social situations (reasoning from item content). Ask what the person meant: conviction, the quality of the perception and distress separate psychotic-like experiences from distractibility. Ask about cannabis and stimulant use. Psychotic symptoms are not part of ADHD; if they are present they need specialist assessment, and they change the treatment plan.",
    licence: "Unverified. The article is '© The Author 2012. Published by Oxford University Press ... All rights reserved', and no permission statement for reproducing the PQ-16 was found. Not reproduced here.",
    source: "Ising HK, Veling W, Loewy RL, et al. The validity of the 16-item version of the Prodromal Questionnaire (PQ-16) to screen for ultra high risk of developing psychosis in the general help-seeking population. Schizophr Bull 2012;38:1288-1296.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3713086/",
    file: null
  },

  /* ------------------------------------------------------------------ RAADS-14 Screen */
  {
    id: "raads14", abbr: "RAADS-14", name: "Ritvo Autism Asperger Diagnostic Scale, 14-item Screen",
    group: "autism", stage: ["comorbid"],
    who: "Self-report by the patient.", time: "3-5 minutes", ages: "Adults (validated in adult psychiatric outpatients)", items_n: 14,
    purpose: "A 14-item autism screen for adult psychiatric outpatients, drawn from the RAADS-R. It was validated against an ADHD comparison group. Each answer records whether a statement is true now and in childhood, only now, only before 16, or never.",
    when: "In the Co-occurring conditions step when autism is possible in an adult referred for ADHD (NICE CG142 1.2.2). It is more useful than the AQ-10 in ADHD clinics because it was tested against adults with ADHD, but about half of them still score above the cut-off.",
    how: "Ask the person to choose one answer per statement. Score 3 for 'true now and when I was young', 2 for 'true only now', 1 for 'true only when I was younger than 16' and 0 for 'never true'. Item 6 is reverse scored. Total 0-42.",
    interactive: true,
    instructions: "Please answer the questions according to what is true for you. Choose only one answer per statement.",
    options: [{ v: 3, l: "True now and when I was young" }, { v: 2, l: "True only now" }, { v: 1, l: "True only when I was younger than 16" }, { v: 0, l: "Never true" }],
    items: [
      { n: 1, t: "It is difficult for me to understand how other people are feeling when we are talking" },
      { n: 2, t: "Some ordinary textures that do not bother others feel very offensive when they touch my skin" },
      { n: 3, t: "It is very difficult for me to work and function in groups" },
      { n: 4, t: "It is difficult to figure out what other people expect of me" },
      { n: 5, t: "I often don’t know how to act in social situations" },
      { n: 6, t: "I can chat and make small talk with people", score: { "3": 0, "2": 1, "1": 2, "0": 3 } },
      { n: 7, t: "When I feel overwhelmed by my senses, I have to isolate myself to shut them down" },
      { n: 8, t: "How to make friends and socialize is a mystery to me" },
      { n: 9, t: "When talking to someone, I have a hard time telling when it is my turn to talk or to listen" },
      { n: 10, t: "Sometimes I have to cover my ears to block out painful noises (like vacuum cleaners or people talking too much or too loudly)" },
      { n: 11, t: "It can be very hard to read someone’s face, hand, and body movements when we are talking" },
      { n: 12, t: "I focus on details rather than the overall idea" },
      { n: 13, t: "I take things too literally, so I often miss what people are trying to say" },
      { n: 14, t: "I get extremely upset when the way I like to do things is suddenly changed" }
    ],
    scoring: {
      method: "sum",
      cutoff: { value: 14, text: "Screen positive: consider a full autism assessment, guided by the developmental history" },
      subscales: [
        { id: "ment", label: "Mentalising difficulties (items 1, 4, 9, 11-14)", items: [1, 4, 9, 11, 12, 13, 14] },
        { id: "socanx", label: "Social anxiety (items 3, 5, 6, 8)", items: [3, 5, 6, 8] },
        { id: "sens", label: "Sensory reactivity (items 2, 7, 10)", items: [2, 7, 10] },
        { id: "first5", label: "Items 1-5 only", items: [1, 2, 3, 4, 5], cutoff: 4 }
      ]
    },
    interpretation: [
      "14 or more: positive screen (sensitivity 97%, specificity 46-64% against ADHD and other psychiatric conditions).",
      "Median scores in the validation study: autism 32, ADHD 15, other psychiatric conditions 11. A score in the mid-teens is typical of ADHD; the further above that, the closer it is to the autism group.",
      "Read the domain profile. Sensory reactivity and mentalising items, answered 'true now and when I was young', support a lifelong developmental pattern. 'True only now' answers point to a later cause, such as anxiety or depression (reasoning).",
      "Items 1-5 alone: 4 or more of 15 gave sensitivity 0.93 and specificity 0.45 in the ADHD sample (Eriksson 2013)."
    ],
    psychometrics: "Eriksson et al. 2013 (adult psychiatric outpatients, with an ADHD comparison group): at 14 or more, sensitivity 97% and specificity 46-64%. Area under the curve 0.91 for autism against other psychiatric disorders and 0.88 for autism against ADHD.",
    pitfalls: [
      "Treating a positive screen as autism: about half of adults with ADHD score 14 or more.",
      "Forgetting that item 6 is reverse scored.",
      "Social-anxiety items are raised by social anxiety disorder as well as autism.",
      "Using it without a developmental history or informant."
    ],
    adhdNotes: "The median score of adults with ADHD in the validation study (15) was above the cut-off of 14, so roughly half of people with ADHD screen positive. The authors suggest some items may pick up neurodevelopmental conditions in general, or the autistic traits that many people with ADHD have. Item 9 (hard to tell when it is your turn to talk) overlaps with ADHD interrupting. Read the subscales: sensory reactivity (2, 7, 10) and mentalising (understanding others' feelings, expectations and intentions) say more about autism than the social anxiety items (reasoning). Answers 'true now and when I was young' support a lifelong pattern. Confirm with a developmental history and an informant, and remember the two conditions often coexist.",
    licence: "Open access with attribution. The items are published in Eriksson et al. 2013 under a Creative Commons Attribution licence (CC BY 2.0), which permits reproduction with citation. They come from the RAADS-R (the authors thank Professor Edward Ritvo for allowing them to use the items); whether the RAADS-R copyright adds conditions is unverified, so check before any commercial use. No PDF is redistributed.",
    source: "Eriksson JM, Andersen LM, Bejerot S. RAADS-14 Screen: validity of a screening tool for autism spectrum disorder in an adult psychiatric population. Mol Autism 2013;4:49.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3907126/",
    file: null
  }
]);
