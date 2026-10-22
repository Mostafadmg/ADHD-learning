/* Assessor training modules 9-12 (ARCHITECTURE.md 5.7).
   m9 Differential diagnosis II: neurodevelopmental, substance-related, sleep and medical mimics;
   m10 Special populations; m11 Symptom validity, feigning and diagnostic certainty;
   m12 Formulation, report writing, feedback and next steps.
   UK practice (NICE NG87) is the default frame; international guidance is included.
   DSM-5-TR and ICD-11 are paraphrased for teaching, not reproduced. DIVA wording is not used.
   NICE recommendation numbers were checked against the live NG87 recommendations page
   (downloaded 21 October 2026). Other facts come from the research briefs of 21 October 2026
   (guidelines-uk, guidelines-intl, tools-adhd, tools-comorbid, ddx-evidence) and the source
   texts behind them; anything else is labelled "clinical practice". */
(function (AA) {
  'use strict';

  AA.add('learn', [

    /* ================================================================== */
    /* Module 9                                                             */
    /* ================================================================== */
    {
      id: "m9", n: 9, minutes: 50,
      title: "Differential diagnosis II: neurodevelopmental, substance, sleep and medical mimics",
      summary: "How to tell ADHD apart from, or alongside, autism, learning disorders, intellectual disability, coordination and tic disorders, substance effects, sleep disorders, thyroid disease, iron deficiency, epilepsy, head injury, medicines, perimenopause, post-viral fatigue and cognitive decline. What to ask, what to investigate, and when to treat first and reassess.",
      objectives: [
        "Apply one consistent set of tests (onset, course, persistence without the other condition, pervasiveness, qualitative features, proportion) to every neurodevelopmental, substance, sleep and medical differential.",
        "Distinguish ADHD from autism, specific learning disorder, intellectual disability, DCD and tics, and diagnose both conditions when each is independently present without double counting symptoms.",
        "Assess a person who is currently using alcohol, cannabis or stimulants: when to start, which periods to focus on, and when to defer or verify the diagnosis later.",
        "Recognise sleep apnoea, insomnia, delayed sleep phase, narcolepsy and restless legs as mimics or aggravators, and use the holiday and treatment-response questions correctly.",
        "Identify medical and medicine-related causes of new attention problems, including thyroid disease, iron deficiency, epilepsy, head injury, perimenopause, post-viral syndromes and mild cognitive impairment, and order investigations only when they are indicated."
      ],
      sections: [
        {
          h: "One method for every mimic",
          html:
            "<p>Every condition in this module can <strong>mimic</strong> ADHD, <strong>aggravate</strong> it, or <strong>co-occur</strong> with it, and often does more than one.</p>" +
            "<p>DSM-5-TR criterion E asks whether the symptoms are better explained by another condition. ICD-11 adds that ADHD symptoms must not be due to a substance or medication, including withdrawal, or to a disease of the nervous system. In practice both rules turn into the same six questions. Ask them for every candidate condition:</p>" +
            "<ol>" +
            "<li><strong>Onset.</strong> Were several ADHD symptoms present before 12, and before the other condition began?</li>" +
            "<li><strong>Course.</strong> Are the symptoms trait-like and continuous since childhood, or a change from a previous level?</li>" +
            "<li><strong>Persistence without it.</strong> Do the symptoms continue when the other condition is absent or treated: in abstinence, after CPAP, once thyroid function is normal, on holiday with full sleep?</li>" +
            "<li><strong>Pervasiveness.</strong> Are they present across settings and states, or only in the situations tied to the other condition?</li>" +
            "<li><strong>Qualitative features.</strong> Is there something ADHD does not explain, such as witnessed apnoeas, cataplexy, premonitory urges before movements, or a progressive decline?</li>" +
            "<li><strong>Proportion.</strong> Are the difficulties out of proportion to the other condition, for example to intellectual level, to the amount of sleep lost or to the dose of a medicine?</li>" +
            "</ol>" +
            "<table><thead><tr><th>Pattern in the timeline</th><th>What it suggests</th></tr></thead><tbody>" +
            "<tr><td>Present since primary school, steady, worse when demands rise</td><td>ADHD, with or without a co-occurring condition</td></tr>" +
            "<tr><td>Began with regular cannabis or alcohol use; better when abstinent</td><td>A substance-related picture</td></tr>" +
            "<tr><td>Stepwise change after an event: head injury, new medicine, infection</td><td>An acquired cause</td></tr>" +
            "<tr><td>Gradual decline from a good level in mid or later life</td><td>Neurocognitive, mood, sleep or medical cause</td></tr>" +
            "<tr><td>Tracks sleep loss; resolves after good sleep</td><td>A sleep disorder</td></tr>" +
            "<tr><td>Confined to one kind of task, such as reading or numbers</td><td>A specific learning disorder</td></tr>" +
            "</tbody></table>" +
            "<p>Record one of four verdicts for each condition: <strong>absent</strong>, <strong>co-occurring</strong>, <strong>better explains the symptoms</strong>, or <strong>uncertain</strong> (investigate or treat it, then reassess). The Differential diagnosis step records exactly these verdicts, and the Differential diagnosis protocol takes you through them in order.</p>" +
            "<h4>Treatment response: what it does and does not tell you</h4>" +
            "<p>A good response to a stimulant does not confirm ADHD: stimulants improve attention in people without ADHD, and RCPsych CR235 (2023) states that a therapeutic trial has no diagnostic value. Full resolution after the other condition is treated (CPAP, sustained abstinence, iron replacement) does support 'better explained by'.</p>"
        },
        {
          h: "Autism: co-occurrence, not competition",
          html:
            "<p>Before DSM-5, autism was an exclusion for ADHD. It is not any more, and NICE NG87 1.3.3 says not to exclude ADHD because of a pervasive developmental disorder. The two conditions often occur together. A meta-analysis found ADHD in 28% of autistic people, and a UK adult neurodevelopmental clinic audit (Newman 2026, conference abstract, not peer reviewed) recorded autism in 38% of adults newly diagnosed with ADHD. The question is rarely 'which one?' and usually 'is each one independently present?'.</p>" +
            "<table><thead><tr><th>Area</th><th>Points towards ADHD</th><th>Points towards autism</th></tr></thead><tbody>" +
            "<tr><td>Friendships</td><td>Makes friends easily but struggles to keep them (forgets to reply, late, says things impulsively)</td><td>Difficulty making friends from early childhood; unsure how to join in</td></tr>" +
            "<tr><td>Routines</td><td>Used to compensate for forgetting (same place for keys, alarms)</td><td>Valued for their own sake; distress when they change</td></tr>" +
            "<tr><td>Interests</td><td>Many, intense for a while, then dropped; novelty-seeking</td><td>Restricted and long-lasting, pursued for their own sake</td></tr>" +
            "<tr><td>Eye contact</td><td>Drifts because attention shifts</td><td>Avoided because it feels uncomfortable</td></tr>" +
            "<tr><td>Movement</td><td>General restlessness, fidgeting</td><td>Rhythmic or repetitive movements, especially when stressed or excited</td></tr>" +
            "<tr><td>Communication</td><td>Talks over people, interrupts, goes off on tangents</td><td>Literal interpretation, missed hints and sarcasm, atypical non-verbal communication</td></tr>" +
            "</tbody></table>" +
            "<p>Sources: CADDRA 4.1 Table 2.10 and RCPsych CR235 9.7.4, paraphrased.</p>" +
            "<h4>Do not double count</h4>" +
            "<p>The UK ADHD Partnership consensus on ADHD and autism (Young 2020) asks assessors to be parsimonious. A behaviour counted for one condition should only be counted again for the other if it is distinctly different. Their example: if talkativeness has been rated as an ADHD symptom, count it for autism only if it is distinctly different, for example odd and monotonous. In ADHD terms, 'seems not to listen when spoken to' should not be scored present if the person hears perfectly well but misses the implied meaning.</p>" +
            "<h4>Questions that separate the two</h4>" +
            "<ul>" +
            "<li>'As a young child, did you want to play with other children? Did you know how to join in?'</li>" +
            "<li>'Is it harder for you to make friends in the first place, or to keep them going?'</li>" +
            "<li>'Your routines: are they there to stop you forgetting things, or do changes feel upsetting in themselves?'</li>" +
            "</ul>" +
            "<h4>Screening and its limits</h4>" +
            "<p>NICE CG142 suggests a comprehensive autism assessment if the AQ-10 is 6 or more or autism is suspected clinically. In a case-control study the AQ-10 had specificity 0.91; in adults referred to a specialist service, it fell to 0.29. On RAADS-14, the median score of the ADHD validation group was already above the cut-off. A positive screen in an ADHD clinic means 'consider an autism assessment', not 'autistic', and camouflaging means a negative screen does not settle the question.</p>" +
            "<p>When both are present, NICE NG87 1.7.18 offers the same medication choices and 1.7.28 asks for slower titration. CADDRA reports a lower response rate in autistic people (about 50%, against 70 to 80% in ADHD alone).</p>"
        },
        {
          h: "Learning disorders, intellectual disability, coordination and tics",
          html:
            "<h4>Specific learning disorder (dyslexia, dyscalculia, written expression)</h4>" +
            "<p>ICD-11 gives a clear rule. If inattention or restlessness occurs <em>only</em> during tasks in the area of the learning difficulty, diagnose the learning disorder, not ADHD. CADDRA makes the same point. Comorbidity is still high (about 31 to 45% in child studies), so the task is to find out whether the attention problems reach beyond reading, writing or number work.</p>" +
            "<ul>" +
            "<li>'When you watch a film or have a conversation you enjoy, do you still drift off?'</li>" +
            "<li>'Outside reading and writing, with keys, appointments, chores and driving, are you forgetful and distractible?'</li>" +
            "<li>'Is your spelling poor even when you take your time?'</li>" +
            "<li>'Do your mistakes look careless, where you knew the answer and slipped, or consistent, because you never quite learned it?'</li>" +
            "</ul>" +
            "<p>Formal diagnosis of a learning disorder needs standardised testing by an educational psychologist or specialist assessor.</p>" +
            "<h4>Intellectual disability and borderline intellectual functioning</h4>" +
            "<p>Both ADHD and intellectual disability can be diagnosed. ICD-11 requires that ADHD symptoms are <strong>disproportionate to intellectual level</strong>. The test is comparison with people of similar ability: 'Compared with others at the day centre or college, are they much more distractible or overactive?' Attention that improves when a task is simplified to the person's level points away from ADHD. CR235 reports an ADHD prevalence of about 16% in adults with intellectual disability, notes that adult ADHD scales are hard to interpret beyond mild intellectual disability, and points to DIVA-5-ID (a licensed adaptation). Carers' accounts across settings are essential. Module 10 covers adapting the assessment.</p>" +
            "<h4>Developmental coordination disorder</h4>" +
            "<p>ICD-11 states that clumsiness caused by distractibility or impulsivity is not DCD. Ask whether the motor problems persist when the person slows down and concentrates: 'Is your handwriting messy because you rush, or hard even when you go slowly?' Late milestones, difficulty with bikes, shoelaces and cutlery, and many driving lessons point to DCD. Refer to occupational therapy or physiotherapy if it matters for function.</p>" +
            "<h4>Tic disorders</h4>" +
            "<p>Tics are sudden, rapid, recurrent movements or sounds, often preceded by an urge and followed by relief, and they wax and wane. ADHD restlessness is general and has no premonitory urge. ADHD is very common in Tourette syndrome (54% lifetime in one study). Ask: 'Do you get an uncomfortable feeling before the movement, and relief afterwards?' Tics do not rule out stimulants (NICE NG87 1.7.18; 1.8.13 to 1.8.14 cover tics that appear on treatment).</p>"
        },
        {
          h: "Substances: assessing someone who is using",
          html:
            "<p>Alcohol, cannabis, stimulants, nicotine and caffeine can all produce inattention, restlessness, irritability and poor sleep, through intoxication, withdrawal or longer-term effects. ADHD also raises the risk of substance use, and many people use cannabis or alcohol to settle restlessness or to sleep. In the WHO World Mental Health surveys, ADHD began before the substance use disorder in 95 to 99% of people who had both. A clear ADHD history before first use is therefore the expected pattern, and its absence needs explaining.</p>" +
            "<h4>When to assess</h4>" +
            "<p>The international consensus on ADHD and substance use disorders (Crunelle 2018) gives practical rules:</p>" +
            "<ul>" +
            "<li>Screen people in addiction services for ADHD routinely: about 23% of people in treatment for substance use disorders have ADHD (meta-analysis of 29 studies).</li>" +
            "<li>Start the diagnostic process as soon as there is no serious intoxication or withdrawal; months of abstinence are not needed.</li>" +
            "<li>Focus the history on drug- and alcohol-free periods, before first use and during any spell of abstinence.</li>" +
            "<li>Collateral and school reports are essential.</li>" +
            "<li>Verify the preliminary diagnosis during treatment, because the picture can change as substance use comes under control.</li>" +
            "</ul>" +
            "<h4>Patterns to recognise (clinical practice)</h4>" +
            "<table><thead><tr><th>Substance</th><th>ADHD-like effects</th></tr></thead><tbody>" +
            "<tr><td>Cannabis</td><td>Acute memory and attention impairment; withdrawal irritability, poor sleep and restlessness</td></tr>" +
            "<tr><td>Alcohol</td><td>Morning withdrawal tremor and anxiety; longer-term executive difficulties</td></tr>" +
            "<tr><td>Cocaine, amphetamine, non-prescribed ADHD medicine</td><td>A 'crash' with fatigue, disturbed sleep and poor concentration</td></tr>" +
            "<tr><td>Nicotine and caffeine</td><td>Poor concentration and irritability on withdrawal; caffeine can cause restlessness and insomnia</td></tr>" +
            "</tbody></table>" +
            "<h4>Questions that do the work</h4>" +
            "<ul>" +
            "<li>'How old were you when you first drank or used cannabis? What were you like at school before then?'</li>" +
            "<li>'Have you had a month or more without using? How were your concentration, restlessness and organisation then?'</li>" +
            "<li>'What does it do for you: calm you, help you sleep, help you focus, or give you a high?'</li>" +
            "<li>(Informant) 'Before they started drinking or using, were they restless, impulsive or disorganised?'</li>" +
            "</ul>" +
            "<p>Tools: AUDIT (8 or more is positive; zones 0 to 7, 8 to 15, 16 to 19, 20 or more), AUDIT-C (UK: 5 or more, go on to the full AUDIT), DAST-10 (3 to 5 moderate, 6 to 8 substantial, 9 to 10 severe), CAGE-AID (one or more positive answers is a positive screen) and the WHO ASSIST. A drug screen, with consent, can help when the history is unclear (clinical practice).</p>" +
            "<h4>Worked example</h4>" +
            "<p>Jordan, 24, smokes cannabis daily. Primary school reports describe a quiet, settled pupil with good concentration. Problems with focus, lateness and motivation started at 16, the year regular use began. During a three-month abstinence last year Jordan felt 'much sharper'. There is no clear evidence of several symptoms before 12; symptoms began with use and improved with abstinence. Verdict for cannabis: <strong>better explains the symptoms</strong> for now. Plan: support with cannabis use, then reassess if difficulties persist after sustained abstinence. In the longitudinal MTA comparison group (Sibley 2018), the most common reason for excluding apparent late-onset ADHD in people with impairing symptoms was that the symptoms occurred only in the context of heavy substance use.</p>" +
            "<p>Treatment is still possible when both are present. CR235 says controlled misuse should not completely preclude treatment, while chaotic use makes stimulants hard to manage safely. NICE NG87 1.7.23 and 1.7.24 ask for caution with stimulants when there is a risk of diversion, and rule out immediate-release or easily injected or snorted preparations when misuse or diversion is a risk.</p>"
        },
        {
          h: "Sleep: apnoea, insomnia, delayed sleep phase, narcolepsy and restless legs",
          html:
            "<p>Sleep problems affect at least half of people with ADHD (CADDRA), and poor sleep causes inattention in anyone. Adults with ADHD differ from controls on subjective sleep measures and actigraphy, not on polysomnography. Ask: did the daytime symptoms come before the sleep problem, and do they persist once sleep is corrected?</p>" +
            "<table><thead><tr><th>Condition</th><th>Clues</th><th>Discriminating question</th><th>Next step</th></tr></thead><tbody>" +
            "<tr><td>Obstructive sleep apnoea</td><td>Loud snoring, witnessed pauses or gasping, unrefreshing sleep, morning headache, dozing in the day, weight gain, hypertension; onset in adulthood</td><td>'Do you ever fall asleep without meaning to, reading, watching TV or driving?'</td><td>Sleep service referral for a sleep study; treat, then reassess</td></tr>" +
            "<tr><td>Insomnia</td><td>Difficulty getting or staying asleep; daytime symptoms track bad nights; clear precipitant such as stress or shift work</td><td>'What keeps you awake: a busy mind full of different thoughts, worry about one thing, or discomfort?'</td><td>Sleep diary for 1 to 2 weeks; CBT for insomnia</td></tr>" +
            "<tr><td>Delayed sleep phase</td><td>Lifelong night owl; sleeps well if allowed to sleep late; struggles with early starts</td><td>'When you have no commitments, what time do you naturally fall asleep and wake?'</td><td>Diary or actigraphy; timing, light and melatonin</td></tr>" +
            "<tr><td>Narcolepsy</td><td>Irresistible sleep attacks, cataplexy, sleep paralysis, vivid dreams at sleep onset, refreshing short naps</td><td>'When you laugh or get emotional, do your knees, jaw or neck ever go weak?'</td><td>Sleep centre: polysomnography and MSLT</td></tr>" +
            "<tr><td>Restless legs</td><td>Urge to move the legs with unpleasant sensations, worse at rest and in the evening, relieved by movement</td><td>'Is your restlessness mainly in your legs in the evening, or a whole-body and mental restlessness all day?'</td><td>FBC and ferritin; treat and reassess</td></tr>" +
            "</tbody></table>" +
            "<h4>Key facts</h4>" +
            "<ul>" +
            "<li><strong>Apnoea.</strong> Attention problems are reported in up to 95% of people with OSA, and in all six interventional studies in one review, inattention improved after treatment. STOP-Bang (5 to 8 is high risk) needs a licence, so the app links to it. On the Epworth Sleepiness Scale, 0 to 10 is normal.</li>" +
            "<li><strong>Insomnia.</strong> CR235 cites insomnia in about two thirds of adults with ADHD. On the Insomnia Severity Index, a cut-off of 10 had 86% sensitivity and 88% specificity in a community sample.</li>" +
            "<li><strong>Delayed sleep phase.</strong> The European Consensus (Kooij 2019) states that in most cases ADHD is associated with a circadian rhythm disorder with delayed sleep onset. In one clinic, 31 of 40 adults with ADHD reported sleep-onset insomnia, and that group had delayed melatonin onset and later sleep timing. Delayed phase is often part of the ADHD picture rather than an alternative to it.</li>" +
            "<li><strong>Hypersomnolence and restless legs.</strong> ADHD traits were found in 24% of people with central hypersomnias (7% of controls), and restless legs symptoms in 20 to 33% of adults with ADHD.</li>" +
            "</ul>" +
            "<h4>The holiday question</h4>" +
            "<p>'On holiday, when you can sleep as long as you like, are you still distractible, disorganised and restless?' If the answer is yes, and the pattern dates from childhood, sleep is not the whole story. If the person is clear-headed and organised whenever they sleep well, and there is no childhood daytime history, a sleep disorder may better explain the picture.</p>" +
            "<p>Stimulants can lengthen sleep latency, so record a sleep baseline before any medication. NICE NG87 1.8.17 asks for sleep to be monitored during treatment.</p>"
        },
        {
          h: "Medical mimics: thyroid, iron, epilepsy, head injury, hearing and vision",
          html:
            "<p>CADDRA lists hearing or vision loss, thyroid dysfunction, hypoglycaemia, severe anaemia, lead poisoning, sleep disorders, fetal alcohol spectrum disorder and neurofibromatosis as medical mimics; CR235 adds frontal lobe syndromes. The common thread is a <strong>change</strong>: a new problem with physical clues, not a lifelong pattern.</p>" +
            "<h4>Thyroid disease</h4>" +
            "<p>Hyperthyroidism causes restlessness, anxiety, poor sleep and poor concentration; hypothyroidism causes slowed thinking, fatigue and low mood. Ask about weight change, heat or cold intolerance, tremor, palpitations, neck swelling and autoimmune disease. NICE NG145 advises thyroid tests when there is clinical suspicion, remembering that one symptom alone may not indicate thyroid disease (1.2.1), suggests considering them in adults with depression or unexplained anxiety (1.2.3), and recommends testing TSH first (1.2.8). It also warns that thyroid symptoms may be mistaken for menopause (1.2.5). No guideline found supports routine thyroid testing in every ADHD assessment. If thyroid disease is found, treat it and reassess once the person is euthyroid. Hyperthyroidism also matters for treatment: it is listed as a contraindication for methylphenidate and dexamfetamine (CR235 Table 4).</p>" +
            "<h4>Iron deficiency and anaemia</h4>" +
            "<p>Think of it with fatigue, breathlessness, heavy or prolonged periods, a restrictive diet, blood loss or restless legs. In a randomised trial in women aged 18 to 35, iron deficiency affected cognitive accuracy and anaemia mainly affected speed, and improvement in ferritin after treatment was linked to better cognitive performance. Check FBC and ferritin when indicated, correct any deficiency, and diagnose ADHD only if the childhood-onset pattern persists once iron levels are restored.</p>" +
            "<h4>Epilepsy</h4>" +
            "<p>NICE NG87 1.2.1 lists people with epilepsy as a group with a higher prevalence of ADHD, and 18% of adults with epilepsy screened positive on the ASRS in one study. Absence and focal seizures can look like daydreaming (clinical practice). ADHD mind-wandering can usually be interrupted by calling the person's name or touching them; a seizure has an abrupt start and end, unresponsiveness and no memory of the gap. Some antiseizure medicines can themselves cause ADHD-like symptoms: ICD-11 names carbamazepine and valproate, and the Australian guideline names levetiracetam. Refer suspected seizures for specialist assessment (NICE NG217 covers the epilepsies). EEG is the right test for suspected seizures but is not a test for ADHD. If both conditions are present, NG87 1.7.28 asks for slower titration and 1.8.16 says what to do if seizures appear or worsen on treatment.</p>" +
            "<h4>Head injury and other brain injury</h4>" +
            "<p>NG87 1.2.1 also lists acquired brain injury, a group the committee felt often receives a late diagnosis or a misdiagnosis. The relationship runs both ways: ADHD raises the risk of accidents, and brain injury can cause inattention, disinhibition, irritability and fatigue. Ask specifically about head injuries and seizures (UKAAN AQAS 2024). Date each injury, ask about loss of consciousness, and compare accounts from before and after. A stepwise change after the injury points to an acquired cause; clear ADHD features in primary school, before it, support ADHD. CR235 also lists neurocutaneous disorders, metabolic storage disorders and infections such as encephalitis as organic causes when onset is late or the course atypical.</p>" +
            "<h4>Hearing and vision</h4>" +
            "<p>Someone who seems not to listen may not hear well; someone who avoids reading may not see well. Ask about hearing and eye tests early (clinical practice).</p>"
        },
        {
          h: "Medicines, perimenopause and post-viral fatigue",
          html:
            "<h4>Medicines</h4>" +
            "<p>Take a full medicines history, with start and stop dates, and lay it against the symptom timeline. Sources name these groups:</p>" +
            "<ul>" +
            "<li><strong>ICD-11:</strong> carbamazepine, valproate, risperidone, bronchodilators and thyroid replacement can cause ADHD-like symptoms.</li>" +
            "<li><strong>CADDRA and the Australian guideline:</strong> cognitive dulling (mood stabilisers) and activation (decongestants, asthma drugs, caffeine and other non-prescribed stimulants); the Australian guideline also names levetiracetam.</li>" +
            "<li><strong>Clinical practice:</strong> sedating antihistamines, benzodiazepines and other sedatives, opioids, drugs with anticholinergic effects (especially in older adults), and akathisia from antipsychotics, which can look like hyperactivity.</li>" +
            "</ul>" +
            "<p>The test is temporal: did the difficulties start with the medicine, and ease when it changed? Never stop a needed medicine to test this; discuss it with the prescriber.</p>" +
            "<h4>Perimenopause</h4>" +
            "<p>The UK ADHD Partnership consensus on women (Young 2020) notes that ADHD symptoms may be made worse by hormonal changes during the menstrual cycle, pregnancy and menopause, and advises review during and after these periods. Many women first seek assessment in their forties for this reason. Perimenopause can also cause poor sleep, low mood and problems with memory and concentration in women without ADHD (clinical practice), and NICE NG145 warns that thyroid symptoms can be mistaken for menopause.</p>" +
            "<table><thead><tr><th>Lifelong ADHD made worse by perimenopause</th><th>Perimenopausal symptoms alone</th></tr></thead><tbody>" +
            "<tr><td>School reports and a parent describe inattention or restlessness before 12</td><td>No childhood history; well organised until the mid-forties</td></tr>" +
            "<tr><td>Long history of compensating: lists, overwork, help from others</td><td>No previous need for strategies</td></tr>" +
            "<tr><td>Impairment across several earlier life stages</td><td>Difficulties began with cycle change, night sweats or broken sleep</td></tr>" +
            "</tbody></table>" +
            "<p>A woman can have both. The point is that a new picture in midlife needs a childhood-onset history before it is called ADHD. Ask: 'Were you like this at 25 and at 10, or is this new over the last few years?'</p>" +
            "<h4>Post-viral fatigue, long COVID and ME/CFS</h4>" +
            "<p>'Brain fog' is a common complaint after viral illness. NICE NG188 defines post-COVID-19 syndrome as signs and symptoms that develop during or after an infection consistent with COVID-19, continue for more than 12 weeks and are not explained by an alternative diagnosis. NICE NG206 lists cognitive difficulties among the core symptoms of ME/CFS, alongside debilitating fatigue, worsening after exertion and unrefreshing sleep. UKAAN AQAS includes chronic fatigue syndrome and fibromyalgia among the physical conditions to screen for. These conditions can co-occur with ADHD (45% of people with fibromyalgia screened positive on the ASRS in one study), but screening positive is not the same as having ADHD.</p>" +
            "<p>Clues that favour a post-viral cause: onset after an infection, worsening after effort, fatigue as the main complaint, and a previously well-organised life. Ask: 'What happens the day after a busy day?'</p>"
        },
        {
          h: "Older adults: mild cognitive impairment and dementia",
          html:
            "<p>ADHD does persist into later life. The Australian guideline asks clinicians to consider ADHD at all ages, including over 65. But diagnosed ADHD is rare in older adults. Meta-analyses cited by WFADHD (2021) found 2.2% in older adults using rating scales (1.5% when limited to people aged 50 and over), but only 0.2% at 50 and over when a clinical diagnosis was required. The WFADHD 2026 update (preprint) gives an epidemiological prevalence, meeting full criteria, of 0.8% at 65 and over. Meanwhile, new memory and attention problems in later life are common and have many causes. CADDRA advises separating ADHD from mild cognitive impairment or dementia through the longitudinal history.</p>" +
            "<table><thead><tr><th>Feature</th><th>Lifelong ADHD</th><th>Mild cognitive impairment or early dementia</th><th>Depression</th></tr></thead><tbody>" +
            "<tr><td>Onset</td><td>Childhood; lifelong pattern</td><td>Mid or later life; a change from previous ability</td><td>Episodic; often linked to events</td></tr>" +
            "<tr><td>Course</td><td>Stable or improving with age and structure</td><td>Gradual decline</td><td>Fluctuates with mood</td></tr>" +
            "<tr><td>Typical memory problem</td><td>Forgets to do things; loses things; poor recall because attention was elsewhere</td><td>Forgets recent events and conversations even when attending; repeats questions</td><td>Poor concentration and effort; often complains more than tests show</td></tr>" +
            "<tr><td>Informant</td><td>'They have always been like this'</td><td>'This is new; they used to manage the finances'</td><td>'They have been low and withdrawn'</td></tr>" +
            "</tbody></table>" +
            "<p>Questions: 'When did you first notice this?', 'Were you like this in your thirties?', and to an informant, 'Compared with ten years ago, is this the same or different?'. Getting lost in familiar places, problems with new learning and a decline in daily living skills point away from ADHD.</p>" +
            "<p>The MoCA is a cognitive screen, not an ADHD test. At a cut-off of 26 it detected mild cognitive impairment with 90% sensitivity and 87% specificity in its validation study. Its use now requires training and certification, and electronic versions are prohibited, so the app describes it but does not reproduce it. The Australian guideline notes that psychometric or neuropsychological testing can help when cognitive decline or dementia is suspected. If the history suggests decline, refer to the memory service rather than continuing an ADHD assessment. A person can have lifelong ADHD and later develop a neurocognitive disorder; the childhood history and the informant's 'before and after' account are what separate the two layers.</p>" +
            "<p>Module 10 covers how to adapt the assessment for older adults.</p>"
        },
        {
          h: "What to investigate, and when",
          html:
            "<p>There is no blood test, scan or EEG for ADHD; the Australian guideline asks for investigations only if clinically indicated. CADDRA says EEG is not a validated diagnostic tool for ADHD and neuroimaging has no direct clinical application. NICE HTG729 makes QbTest research-only for adults. Investigations are for the <strong>alternative</strong> condition and for <strong>treatment safety</strong>.</p>" +
            "<table><thead><tr><th>Clinical clue</th><th>Investigation</th><th>Source</th></tr></thead><tbody>" +
            "<tr><td>New onset with weight change, tremor, palpitations, heat or cold intolerance</td><td>TSH first, then free T4 if abnormal</td><td>NICE NG145 1.2.1, 1.2.8</td></tr>" +
            "<tr><td>Fatigue, heavy periods, restrictive diet, restless legs</td><td>FBC and ferritin</td><td>Clinical practice</td></tr>" +
            "<tr><td>Snoring, witnessed apnoeas, daytime sleepiness</td><td>Sleep service referral for a sleep study</td><td>Clinical practice</td></tr>" +
            "<tr><td>Staring spells with unresponsiveness, jerks, nocturnal events</td><td>Specialist referral; EEG as directed</td><td>NICE NG217; clinical practice</td></tr>" +
            "<tr><td>Heavy alcohol use</td><td>LFTs, GGT, MCV</td><td>Clinical practice</td></tr>" +
            "<tr><td>Decline in memory or daily function in mid or later life</td><td>Memory service referral; cognitive testing</td><td>CADDRA; Australian guideline</td></tr>" +
            "<tr><td>Before ADHD medication</td><td>Pulse, BP, height, weight, cardiovascular history and examination; ECG only if a 1.7.5 feature is present or a cardiac-risk medicine is taken</td><td>NICE NG87 1.7.4, 1.7.5</td></tr>" +
            "</tbody></table>" +
            "<h4>When to pause the ADHD assessment</h4>" +
            "<ul>" +
            "<li>Current intoxication or significant withdrawal: rebook.</li>" +
            "<li>Untreated severe sleep apnoea with no clear childhood history: treat, then reassess.</li>" +
            "<li>A new decline in later life: refer to the memory service first.</li>" +
            "<li>Seizures that are not yet assessed: refer first; the ADHD assessment can continue in parallel when the history is clear.</li>" +
            "</ul>" +
            "<h4>Writing it up</h4>" +
            "<p>UKAAN AQAS asks reports to state that the symptoms are not better explained by another disorder, and recommends noting absent conditions explicitly. Example sentences:</p>" +
            "<ul>" +
            "<li>'Daily cannabis use since 16 was considered. School reports from age 8 describe inattention and restlessness, and the symptoms persisted during a six-month abstinence in 2024. Cannabis use is co-occurring and does not explain the ADHD symptoms.'</li>" +
            "<li>'There is no history of head injury, seizures, snoring or witnessed apnoeas. Thyroid function was not tested because there were no clinical indications.'</li>" +
            "</ul>"
        }
      ],
      keyPoints: [
        "Ask the same six questions of every mimic: onset, course, persistence without it, pervasiveness, qualitative features and proportion.",
        "Record a verdict for each condition: absent, co-occurring, better explains the symptoms, or uncertain (treat or investigate, then reassess).",
        "Autism and ADHD often co-occur and both can be diagnosed; do not double count a behaviour unless it is qualitatively different. A positive AQ-10 in an ADHD clinic means 'consider autism assessment', not 'autistic'.",
        "If inattention appears only in the area of a learning difficulty, ICD-11 says diagnose the learning disorder, not ADHD. In intellectual disability, ADHD symptoms must be disproportionate to intellectual level.",
        "In substance use, start the assessment when the person is not seriously intoxicated or in withdrawal, focus on substance-free periods, use collateral, and verify the diagnosis during treatment.",
        "Sleep problems affect at least half of adults with ADHD. Delayed sleep phase is often part of ADHD; apnoea and insomnia can mimic or aggravate it. Use the holiday question.",
        "Medical causes usually produce a change from a previous level with physical clues. Investigate when clinically indicated; no routine blood test, EEG or scan diagnoses ADHD.",
        "New difficulties in midlife or later life need a childhood-onset history before they are called ADHD; perimenopause, post-viral syndromes, medicines and cognitive decline must be considered.",
        "A good response to stimulants does not confirm ADHD; full resolution after treating the other condition supports 'better explained by'."
      ],
      pitfalls: [
        "Excluding ADHD because the person is autistic, or diagnosing ADHD from behaviours that are fully explained by autism.",
        "Waiting for long abstinence before assessing someone who uses substances, or the opposite: diagnosing ADHD in someone whose symptoms began with heavy use and improved when they stopped.",
        "Missing sleep apnoea in a middle-aged person with new inattention, weight gain and daytime sleepiness.",
        "Treating delayed sleep phase as an alternative explanation when it is often part of the ADHD picture.",
        "Ordering thyroid tests, EEGs or scans routinely 'to rule things out', and then over-interpreting incidental findings.",
        "Calling a new decline in later life ADHD because the person or family has read about late diagnosis.",
        "Failing to lay the medicines history alongside the symptom timeline.",
        "Using a trial of stimulant medication as a diagnostic test."
      ],
      quiz: [
        { q: "Rhys, 23, has dyslexia. He loses focus and fidgets when reading or writing reports, but stays focused in meetings, films and conversations, and is organised at home. What does ICD-11 advise?",
          options: ["Diagnose both, because the inattention is real and impairing", "Diagnose ADHD, inattentive presentation, because school was always hard for him", "Diagnose the learning disorder only, as the inattention is confined to it", "Defer any diagnosis until a full IQ assessment is done"], a: 2,
          why: "ICD-11 states that if inattention or restlessness occurs only during tasks in the area of the learning difficulty, the developmental learning disorder is diagnosed, not ADHD. Both are diagnosed only when attention problems reach well beyond reading and writing. IQ testing is not required for an ADHD diagnosis." },
        { q: "Sam, 34, has struggled to make friends since early childhood, finds changes in routine distressing and says colleagues think they 'don't listen' because they miss hints in meetings. Distractibility is otherwise minimal. How should 'seems not to listen when spoken to directly' be scored for ADHD?",
          options: ["Absent: missing implied meaning is a social-communication difference", "Present, since ADHD can now be diagnosed alongside autism", "Present, because colleagues have noticed it at work", "Unsure for now, until a full autism assessment has been completed elsewhere"], a: 0,
          why: "The UK ADHD Partnership consensus asks assessors to be parsimonious and not to double count. Missing implied meaning is a social-communication difference, not attention drifting away. Co-diagnosis is allowed, but each condition needs its own evidence, and the item can be scored now from the examples given." },
        { q: "In adults referred to a specialist autism service, the AQ-10 had a specificity of 0.29. What does a score of 7 mean for a patient in an adult ADHD clinic?",
          options: ["Autism is likely, so ADHD should not be diagnosed", "Autism is confirmed if an informant agrees", "Nothing, as the AQ-10 is not valid in adults", "Possible autism: consider a full autism assessment"], a: 3,
          why: "Low specificity in a clinical sample means many false positives, so a positive AQ-10 is a reason to consider a comprehensive assessment (NICE CG142 uses 6 or more, or clinical suspicion), not a diagnosis. Autism does not exclude ADHD, and the AQ-10 is an adult tool. Camouflaging means a low score does not rule autism out either." },
        { q: "Lee, 31, is on an opioid substitution programme, still drinks most days and asks about ADHD. According to the international consensus on ADHD and substance use disorders (Crunelle 2018), when should the diagnostic assessment start?",
          options: ["After at least three months of complete abstinence", "As soon as Lee is not seriously intoxicated or in withdrawal", "Only once a urine drug screen taken on the day of assessment is negative", "Only after addiction treatment has been completed"], a: 1,
          why: "Crunelle 2018 recommends starting as soon as there is no serious intoxication or withdrawal, focusing the history on substance-free periods, using collateral and school reports, and verifying the preliminary diagnosis during treatment because the picture can change. Long abstinence is not required." },
        { q: "Jordan, 24, has smoked cannabis daily since 16. Primary school reports describe good concentration. Focus and lateness problems began at 16, and Jordan felt 'much sharper' during three months of abstinence. What is the best conclusion now?",
          options: ["Combined ADHD; the cannabis use is self-medication", "Not supported now; reassess after sustained abstinence", "Inattentive ADHD; start atomoxetine because of the drug use", "Late-onset ADHD, as onset after 12 is now accepted"], a: 1,
          why: "There is no evidence of several symptoms before 12, onset coincided with heavy use, and symptoms eased in abstinence, so cannabis better explains the picture for now. Sibley 2018 found that, among people with impairing late-onset symptoms, symptoms confined to heavy substance use were the commonest reason for exclusion. DSM-5-TR and ICD-11 both still require symptoms before 12." },
        { q: "A 52-year-old has had poorer concentration for three years, with weight gain, loud snoring, witnessed pauses in breathing and dozing in front of the TV. Childhood history is unremarkable. What is the best next step?",
          options: ["Diagnose ADHD, inattentive presentation, given the impairment", "Start a methylphenidate trial and judge the response", "Request a QbTest to confirm the attention deficit", "Refer for a sleep study, treat, then reassess"], a: 3,
          why: "Adult onset with classic apnoea features points to obstructive sleep apnoea, and inattention improved after OSA treatment in all six interventional studies in one review. A stimulant trial is not diagnostic, and QbTest is research-only in adults (NICE HTG729)." },
        { q: "What is the main purpose of asking, 'On holiday, when you can sleep as long as you like, are you still distractible and disorganised?'",
          options: ["To test whether symptoms persist when sleep is adequate", "To diagnose delayed sleep phase from the reply", "To check that symptoms occur in two settings", "To judge whether the impairment from symptoms is at least moderate"], a: 0,
          why: "It tests persistence without the alternative condition. Symptoms that vanish with full sleep suggest a sleep disorder may explain them; symptoms that persist, with a childhood history, support ADHD with or without a sleep problem. A sleep diary or actigraphy, not one question, is needed for delayed sleep phase." },
        { q: "Which approach to thyroid testing in an adult ADHD assessment is best supported?",
          options: ["TSH and free T4 in everyone, as NICE NG87 requires", "Free T3 first in anyone with restlessness", "TSH when clinically indicated, then free T4 if abnormal", "No testing, as thyroid disease does not mimic ADHD"], a: 2,
          why: "No guideline found supports routine thyroid testing in every ADHD assessment, and NG87 does not require it. NICE NG145 advises testing when there is clinical suspicion (1.2.1), considering it in depression or unexplained anxiety (1.2.3), and measuring TSH first (1.2.8). Hyperthyroidism does cause restlessness, anxiety and poor concentration." },
        { q: "Alex, 27, describes restlessness and poor concentration. The medicines list includes the four below. Which one does ICD-11 name as a possible cause of ADHD-like symptoms?",
          options: ["Combined oral contraceptive pill", "Omeprazole for reflux", "Emollient and hydrocortisone cream, used daily for eczema", "Salbutamol inhaler, used several times a day"], a: 3,
          why: "ICD-11 names bronchodilators, carbamazepine, valproate, risperidone and thyroid replacement. The test is temporal: did the symptoms start with the medicine and ease when it changed? Frequent salbutamol use also suggests poorly controlled asthma, which is worth raising with the prescriber. CADDRA and the Australian guideline add decongestants and mood stabilisers, and the Australian guideline names levetiracetam." },
        { q: "A 68-year-old retired teacher has had 18 months of forgetfulness and recently got lost driving to a familiar shop. Their partner says this is new. What is the best approach?",
          options: ["Diagnose ADHD, since older adults are under-diagnosed", "Assess it as a new decline before considering ADHD", "Start a stimulant trial to see if memory improves", "Use the ASRS and WURS scores to decide"], a: 1,
          why: "ADHD needs a lifelong pattern. A recent change from a good level, getting lost in a familiar place and an informant describing something new point to neurocognitive disorder, depression, medicines or medical causes. CADDRA advises separating ADHD from MCI or dementia through the longitudinal history; refer to the memory service." },
        { q: "Which feature best separates restless legs syndrome from ADHD restlessness?",
          options: ["Leg discomfort, worse at rest in the evening, eased by moving", "Fidgeting, tapping and leaving the seat during long meetings at work", "Feeling driven by a motor throughout the day", "Restlessness that improves with stimulant medication"], a: 0,
          why: "Restless legs syndrome is an urge to move the legs, usually with unpleasant sensations, worse at rest and in the evening and relieved by movement. ADHD restlessness is generalised, mental as well as physical, and present through the day. Treatment response does not separate them. Restless legs symptoms occur in 20 to 33% of adults with ADHD, so both may be present; check ferritin." },
        { q: "Priya, 26, has focal epilepsy treated with levetiracetam and is referred with possible ADHD. Which statement is best supported?",
          options: ["Epilepsy excludes ADHD until the seizures are controlled", "An EEG will show whether the inattention is ADHD", "Both can co-occur; also check the medicine's start date", "Stimulants are contraindicated, so assessment is pointless"], a: 2,
          why: "NICE NG87 1.2.1 lists epilepsy as a group with higher ADHD prevalence, so the two can co-occur. The Australian guideline names levetiracetam as a possible cause of ADHD-like symptoms, so lay its start date against the symptom timeline. EEG is for suspected seizures, not ADHD. Epilepsy does not rule out treatment: NG87 1.7.28 asks for slower titration and 1.8.16 covers seizures during treatment." }
      ],
      refs: [
        "NICE NG87. Attention deficit hyperactivity disorder: diagnosis and management (2018, updated 2019; last reviewed July 2026). Recommendations 1.2.1, 1.3.3, 1.7.4, 1.7.5, 1.7.18, 1.7.23, 1.7.24, 1.7.28, 1.8.13, 1.8.14, 1.8.16, 1.8.17.",
        "World Health Organization. ICD-11 Clinical descriptions and diagnostic requirements (CDDR), 2024: 6A05 boundaries with other disorders.",
        "American Psychiatric Association. DSM-5-TR (2022), ADHD criterion E (paraphrased).",
        "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023), sections 9.7, 11.1-11.3, 12.2, 15 and Table 4.",
        "CADDRA. Canadian ADHD Practice Guidelines, 4.1 edition (2020), chapter 2 differentiation tables and medical mimics.",
        "May T et al. The Australian evidence-based clinical practice guideline for ADHD. Aust N Z J Psychiatry 2023;57:1101-1116 (recommendations 2.1.6, 2.2.2 and narrative).",
        "Kooij JJS et al. Updated European Consensus Statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019;56:14-34 (sections 7.2, 7.5.5).",
        "Young S et al. Guidance for identification and treatment of individuals with ADHD and autism spectrum disorder (UKAP). BMC Med 2020;18:146.",
        "Young S et al. Females with ADHD: an expert consensus statement (UKAP). BMC Psychiatry 2020;20:404.",
        "Crunelle CL et al. International consensus statement on screening, diagnosis and treatment of substance use disorder patients with comorbid ADHD. Eur Addict Res 2018.",
        "Sibley MH et al. Late-onset ADHD reconsidered with comprehensive repeated assessments between ages 10 and 25. Am J Psychiatry 2018;175:140-149.",
        "Fayyad J et al. The descriptive epidemiology of DSM-IV adult ADHD in the WHO World Mental Health Surveys. Atten Defic Hyperact Disord 2017 (temporal priority).",
        "NICE CG142 Autism spectrum disorder in adults (rec 1.2.3, AQ-10); Allison C et al. 2012 and Ashwood KL et al. Psychol Med 2016;46:2595-2604 (AQ-10 accuracy).",
        "NICE NG145 Thyroid disease: assessment and management (recommendations 1.2.1, 1.2.3, 1.2.5, 1.2.8).",
        "NICE NG188 COVID-19 rapid guideline: managing the long-term effects of COVID-19; NICE NG206 Myalgic encephalomyelitis (or encephalopathy)/chronic fatigue syndrome.",
        "NICE NG217 Epilepsies in children, young people and adults; NICE HTG729 Digital technologies for assessing ADHD (2024).",
        "Faraone SV et al. WFADHD International Consensus Statement. Neurosci Biobehav Rev 2021;128:789-818 (older adult prevalence); WFADHD 2026 update, PsyArXiv preprint (not peer reviewed).",
        "Adamou M et al. The adult ADHD assessment quality assurance standard (UKAAN AQAS). Front Psychiatry 2024;15:1380410.",
        "Research brief ddx-evidence (21 October 2026): sleep (actigraphy meta-analysis; OSA interventional studies; van Veen 2010; central hypersomnias; restless legs meta-analysis), iron (Murray-Kolb and Beard RCT), epilepsy and fibromyalgia ASRS studies, Newman 2026 UK clinic audit (abstract).",
        "Morin CM et al. The Insomnia Severity Index. Sleep 2011;34:601-608; American Thoracic Society Epworth Sleepiness Scale page; Nasreddine ZS et al. J Am Geriatr Soc 2005;53:695-699 (MoCA)."
      ]
    },

    /* ================================================================== */
    /* Module 10                                                            */
    /* ================================================================== */
    {
      id: "m10", n: 10, minutes: 45,
      title: "Special populations",
      summary: "How ADHD presents, and how the assessment must adapt, in women and girls, high-achieving adults, older adults, university students, people who use substances, autistic people and people with intellectual disability, people in the criminal justice system, and people from different cultures or speaking other languages. How to communicate in a way that respects neurodivergent people without lowering the diagnostic bar.",
      objectives: [
        "Explain why the same diagnostic criteria need different questions, informants and cautions in different groups, and name the groups NICE NG87 1.2.1 and 1.2.2 flag.",
        "Recognise masked, internalised and hormone-sensitive presentations in women, and the misdiagnoses they attract.",
        "Assess impairment in high-achieving adults by asking about cost, effort and support, and avoid both dismissing and over-reading achievement.",
        "Adapt the assessment for older adults, students, people who use substances, autistic people, people with intellectual disability and people in custody, including the validity and safety issues specific to each.",
        "Work well with interpreters and cultural difference, and give feedback in neurodiversity-affirming language that remains honest about the diagnostic conclusion."
      ],
      sections: [
        {
          h: "Same criteria, different routes",
          html:
            "<p>The criteria do not change between groups. What changes is how symptoms show, who can describe them, what else could explain them and what gets in the way of an accurate history. NICE NG87 1.3.5 asks clinicians to consider ADHD in all age groups, with symptom criteria adjusted for age-appropriate changes in behaviour. ICD-11 asks whether symptoms are outside normal variation for age and level of intellectual development.</p>" +
            "<p>NICE NG87 1.2.1 lists groups with a higher prevalence of ADHD, including adults with a mental health condition, people with a history of substance misuse, people with epilepsy, people with other neurodevelopmental conditions, people known to the criminal justice system, people with acquired brain injury and people with a close family member with ADHD. NG87 1.2.2 adds that ADHD is thought to be under-recognised in girls and women. For the justice system and brain injury, the committee found no prevalence evidence; it included them because, in its experience, these groups often receive a late diagnosis or a misdiagnosis.</p>" +
            "<h4>The principle for every group</h4>" +
            "<ul>" +
            "<li><strong>Adapt the questions, not the threshold.</strong> Use examples that fit the person's life, language and setting.</li>" +
            "<li><strong>Adapt the evidence.</strong> If the usual informant is missing, find another source and say what that does to your confidence.</li>" +
            "<li><strong>Adapt the differential.</strong> Each group has its own common mimics.</li>" +
            "<li><strong>Adapt the practicalities.</strong> Time, format, environment and communication.</li>" +
            "</ul>" +
            "<p>Each symptom page in the Question bank has a 'Special populations' section with short notes for women, older adults, high-IQ adults, substance use, autism and culture. This module explains the reasoning behind them.</p>"
        },
        {
          h: "Women and girls: masking, internalising and hormones",
          html:
            "<p>NICE NG87 1.2.2 states that girls and women are less likely to be referred, more likely to have undiagnosed ADHD, and more likely to receive an incorrect diagnosis of another mental health or neurodevelopmental condition. Clinic samples of children contain five to nine boys for every girl, and community samples about three, but in adult clinical and community studies the ratio is closer to 1:1 (Kooij 2019). Many women first come to assessment in their thirties or forties, often after a child is diagnosed or when demands outgrow their coping strategies.</p>" +
            "<h4>How the presentation differs</h4>" +
            "<p>The UK ADHD Partnership consensus on females (Young 2020) summarises the differences:</p>" +
            "<ul>" +
            "<li>Inattention may look like being easily distracted, disorganised, overwhelmed and apparently lacking effort or motivation.</li>" +
            "<li>Hyperactivity is often less visible, and can show as talkativeness, inner restlessness or busy-ness.</li>" +
            "<li>Co-occurring problems are more often internalising: low mood, anxiety and emotional lability. These may be taken for primary conditions.</li>" +
            "<li>Symptoms may worsen with hormonal change in the menstrual cycle, pregnancy and menopause.</li>" +
            "<li>Compensatory behaviours, functional or not, may mask difficulties and delay referral. Alcohol or cannabis may be used to cope.</li>" +
            "</ul>" +
            "<p>In Norwegian registers (Solberg 2018), women with ADHD had more recorded anxiety (26.3% against 18.2% in men with ADHD), depression (28.8% against 20.3%), bipolar disorder and personality disorder, while men had more substance use disorder (27.5% against 16.2%). CADDRA reports that females with ADHD were 3.6 times more likely to have an eating disorder. CR235 (9.2) asks clinicians to separate ADHD from borderline personality disorder, postnatal depression, PTSD and eating disorders in women.</p>" +
            "<h4>What to ask</h4>" +
            "<ul>" +
            "<li>'How much effort does it take to look organised? What happens when you stop?'</li>" +
            "<li>'What systems do you rely on, and who helps you keep on top of things?'</li>" +
            "<li>'At school, were you the quiet one who drifted off, or the chatty one who was told off for talking?'</li>" +
            "<li>'Do your concentration and mood change across your cycle? Did things change after pregnancy or in your forties?'</li>" +
            "</ul>" +
            "<p>School reports for girls often say 'daydreams', 'chatty', 'disorganised', 'could try harder' or comment on friendship problems rather than behaviour. Read them for these phrases. The same consensus warns that rating-scale norms from male or mixed samples may disadvantage women, that rigid cut-offs give false positives and negatives, and that a family informant may have ADHD themselves, which shifts their sense of 'normal'.</p>" +
            "<h4>Worked example</h4>" +
            "<p>Aisha, 38, has diagnoses of recurrent depression and 'emotionally unstable traits'. She has felt overwhelmed since her second child was born. Her school reports say 'bright but daydreams' and 'must organise herself better'. Her mood changes last hours, follow frustrations and settle quickly. She has never self-harmed and has no fear of abandonment. She compensates with lists, over-preparation and late nights. The right move is a full ADHD assessment alongside a careful review of the personality and mood features, not acceptance of the existing labels and not a diagnosis from the school reports alone.</p>" +
            "<p>Pregnancy and breastfeeding need specific care if medication is later considered. CR235 (12.5 to 12.6) asks for an individual risk-benefit discussion and up-to-date advice from the UK Teratology Information Service.</p>"
        },
        {
          h: "High-IQ and high-achieving adults",
          html:
            "<p>WFADHD (2021) states that ADHD impairs highly intelligent people and can be diagnosed in them. UKAAN AQAS (2024) says diagnosis should not be ruled out simply because of high achievement, and warns that the label 'high-functioning' may hide a considerable burden. The European Consensus (Kooij 2019) treats high intelligence as a moderator that causes under-diagnosis through compensation. ICD-11 notes that some people first come to attention when demands exceed their capacity to compensate.</p>" +
            "<h4>Assessing impairment: ask about cost, not just output</h4>" +
            "<p>DSM-5-TR criterion D asks whether symptoms interfere with, or <em>reduce the quality of</em>, functioning. CR235 explains that students and professionals may appear to function well but at significant cost in time and effort, and that hidden impairments can be unmasked when they move to a setting with less support or tolerance. Useful questions:</p>" +
            "<ul>" +
            "<li>'How many hours does a task take you compared with colleagues?'</li>" +
            "<li>'What do you sacrifice to keep up: sleep, weekends, relationships, health?'</li>" +
            "<li>'Who or what holds things together for you: a partner, an assistant, strict routines?'</li>" +
            "<li>'What happened when that support fell away: a new job, university, a break-up?'</li>" +
            "<li>'Where does it show outside work: money, home, driving, health appointments?'</li>" +
            "</ul>" +
            "<table><thead><tr><th>Compensation</th><th>Hidden cost to ask about</th></tr></thead><tbody>" +
            "<tr><td>Working late and at weekends</td><td>Exhaustion, burnout, relationship strain</td></tr>" +
            "<tr><td>Last-minute adrenaline</td><td>Chronic stress, missed deadlines when the crisis does not come</td></tr>" +
            "<tr><td>A partner or assistant manages admin</td><td>Dependence; collapse when they are absent</td></tr>" +
            "<tr><td>Choosing fast-moving, novel roles</td><td>Frequent job changes; underuse of ability</td></tr>" +
            "<tr><td>Perfectionist checking</td><td>Slowness, anxiety, avoidance</td></tr>" +
            "</tbody></table>" +
            "<p>Compare the person with peers of similar ability and opportunity, not with the general population. A lawyer who works 80 hours a week to produce what colleagues manage in 50, and who has repeated fines and a chaotic home, may well be impaired despite a strong career.</p>" +
            "<h4>Balance the risk the other way</h4>" +
            "<p>High achievers can also over-identify with ADHD after reading about it. Every criterion still applies: symptoms must occur often, start in childhood and cause real impairment. A collateral informant, usually a parent or partner, is especially valuable when the person compensated through high intelligence, grew up in a highly structured or supported environment, or was mainly inattentive (Kooij 2019). IQ testing is not required for diagnosis (BAP 2014). Neuropsychological testing can help when impairment seems disproportionate to the symptoms described, but it does not diagnose ADHD.</p>"
        },
        {
          h: "Older adults",
          html:
            "<p>The Australian guideline asks clinicians to consider ADHD at all ages, including over 65. Meta-analyses cited by WFADHD (2021) found 2.2% of older adults scoring above thresholds on rating scales but only 0.2% of people aged 50 and over with a clinical diagnosis. Many older adults with lifelong ADHD were never assessed as children, so the gap partly reflects missed diagnosis. It also reflects how many other things cause attention and memory problems later in life.</p>" +
            "<h4>The particular difficulties</h4>" +
            "<ul>" +
            "<li><strong>The childhood history is distant.</strong> Parents may have died. School reports may be lost. Recall is shaped by decades of later experience.</li>" +
            "<li><strong>The differential widens.</strong> Mild cognitive impairment, dementia, depression, sleep apnoea, hearing loss, medicines, thyroid disease and menopause (see Module 9).</li>" +
            "<li><strong>Retirement changes the picture.</strong> Loss of work structure can unmask difficulties, or remove the demands that made them impairing (clinical practice).</li>" +
            "<li><strong>Treatment safety.</strong> More cardiovascular disease and more medicines. NICE NG87 1.7.4 to 1.7.5 apply, and 1.7.28 asks for slower titration with cardiac disease.</li>" +
            "</ul>" +
            "<h4>How to adapt</h4>" +
            "<ul>" +
            "<li>Seek older siblings, cousins or childhood friends. Ask about school reports, certificates, letters, or even old photographs that prompt memories.</li>" +
            "<li>Anchor the childhood questions to concrete memories: the school building, a particular teacher, what happened at home time.</li>" +
            "<li>Build a life-course timeline: if the pattern was present at 10, 25, 40 and 60, it is trait-like. If it began at 65, it is not ADHD.</li>" +
            "<li>Ask the informant 'Compared with ten years ago, is this the same or different?'</li>" +
            "<li>Use age-appropriate norms where scales are used (BAARS-IV, for example, has a 60 to 89 score sheet).</li>" +
            "</ul>" +
            "<p>NICE NG87 1.3.3 says an uncertain time of onset should not on its own exclude the diagnosis. ICD-11 advises caution when the childhood history cannot be corroborated. In older adults, record what evidence you have and why you find the account credible, or why you do not.</p>"
        },
        {
          h: "University students and young adults",
          html:
            "<p>Students are a large and mixed group. Some have genuine ADHD unmasked by the loss of structure at home. Some have difficulties from stress, sleep loss, low mood or substance use. A minority over-report to obtain accommodations or stimulants.</p>" +
            "<h4>What the evidence says</h4>" +
            "<ul>" +
            "<li>CADDRA notes that some post-secondary students and young adults first presenting exaggerate symptoms to obtain accommodations or stimulants, and that lifetime non-prescribed stimulant use among students ranges from 5 to 43%. It advises reviewing parental reports, report cards and current collateral, and screening for substance use and conduct problems.</li>" +
            "<li>In 144 consecutive Canadian post-secondary students assessed for ADHD, 14.6% failed a symptom validity test (Harrison and Edwards 2010). Module 11 covers validity in depth.</li>" +
            "<li>In a follow-up of young adults diagnosed with ADHD as children (Sibley 2012), those with ADHD tended to under-report current symptoms, while controls tended to over-report. Parent report was more sensitive than self-report.</li>" +
            "<li>CR235 notes that stimulants are used as cognitive enhancers in student populations and that there is no evidence that ADHD medication improves academic performance in students without ADHD. NICE NG87 1.7.23 asks for caution with stimulants when there is a risk of diversion for cognitive enhancement.</li>" +
            "</ul>" +
            "<h4>Practical approach</h4>" +
            "<ul>" +
            "<li>Ask a parent about childhood and, if possible, a flatmate or partner about now. Request school reports from before 12.</li>" +
            "<li>Map the timeline: 'Were these problems there before university, or did they start this year?'</li>" +
            "<li>Ask about sleep, alcohol, cannabis, non-prescribed stimulants, exam stress and mood.</li>" +
            "<li>Ask what the person hopes the assessment will change, and record it neutrally.</li>" +
            "</ul>" +
            "<h4>Diagnosis is not the only route to support</h4>" +
            "<p>For students aged 18 and over, suitably qualified psychologists and specialist teacher assessors can identify the characteristic features of ADHD for Disabled Students' Allowance or Access to Work (SASC 2021). This is not a medical diagnosis, and such reports must explain how to seek one. Universities can usually put study support in place while a medical assessment is pending. With consent, NICE NG87 1.4.12 asks clinicians to contact the college or university when ADHD is diagnosed or at transitions, to explain the diagnosis and the adjustments needed.</p>" +
            "<p>For young people already treated in children's services, NG87 1.1.4 asks for reassessment at school-leaving age to establish the need for treatment into adulthood.</p>"
        },
        {
          h: "People who use substances",
          html:
            "<p>Module 9 covers the differential diagnosis in detail. The points that matter for the assessment process are these:</p>" +
            "<ul>" +
            "<li><strong>Do not exclude.</strong> About a quarter of people in substance use treatment have ADHD. Crunelle (2018) recommends routine screening in addiction services, followed by a diagnostic assessment started as soon as there is no serious intoxication or withdrawal. A single screener can miss up to 20% of cases.</li>" +
            "<li><strong>Time the appointment.</strong> Ask the person not to use before the appointment. Rebook if they arrive intoxicated or in withdrawal.</li>" +
            "<li><strong>Anchor the history.</strong> Focus on childhood before first use and on any substance-free periods.</li>" +
            "<li><strong>Verify later.</strong> Review the diagnosis once use is controlled, because the picture can change.</li>" +
            "<li><strong>Work jointly.</strong> CR235 recommends that significant comorbid substance misuse is managed jointly between adult mental health and addiction services.</li>" +
            "</ul>" +
            "<p>Some people report that stimulants such as cocaine calm them. CR235 lists a paradoxical response to illicit stimulants among the additional features seen in adults with ADHD, but it is not diagnostic: stimulants affect attention in people without ADHD too.</p>" +
            "<p>If ADHD is diagnosed, treatment planning has its own rules. CR235 says controlled misuse should not completely preclude treatment, while chaotic use makes stimulants difficult to manage safely. It notes that long-acting preparations have little street value and that supervised administration lowers diversion risk. NICE NG87 1.7.24 rules out immediate-release stimulants, or modified-release ones that can easily be injected or snorted, when there is a risk of misuse or diversion.</p>"
        },
        {
          h: "Autistic people and people with intellectual disability",
          html:
            "<h4>Autistic adults</h4>" +
            "<p>The UK ADHD Partnership consensus on ADHD and autism (Young 2020) recommends semi-structured interviews that map onto the criteria, a review of developmental records, photographs and school reports, a parsimonious approach that does not double count shared behaviours, attention to camouflaging, and awareness that cultural norms (for example around eye contact and play) affect how behaviour is judged. Risk assessment should cover harm to self, to others and from others.</p>" +
            "<p>Adapt the interview (clinical practice, consistent with NICE NG87 1.4.5 on tailoring information to social communication needs):</p>" +
            "<ul>" +
            "<li>Send a written agenda and the questions' topics in advance.</li>" +
            "<li>Ask one concrete question at a time. Avoid idioms and rhetorical questions.</li>" +
            "<li>Ask about specific situations ('last Tuesday at work') rather than 'in general'.</li>" +
            "<li>Allow written answers, breaks and extra time.</li>" +
            "<li>Reduce sensory load: lighting, noise, waiting room.</li>" +
            "<li>Check literal answers: 'Never' may mean 'not in the exact way you described'.</li>" +
            "</ul>" +
            "<h4>Intellectual disability</h4>" +
            "<p>CR235 (11.2) reports an ADHD prevalence of about 16% in adults with intellectual disability. Its guidance:</p>" +
            "<ul>" +
            "<li>Get detailed information from family and carers across settings.</li>" +
            "<li>Judge symptoms against the person's developmental level, not their age. ICD-11 requires symptoms to be disproportionate to intellectual level.</li>" +
            "<li>Adult ADHD scales are hard to interpret beyond mild intellectual disability, and the more severe the disability, the less applicable the standard criteria become.</li>" +
            "<li>DIVA-5-ID is a licensed adaptation for this group.</li>" +
            "<li>Look for all contributing factors first: whether the people and environment around the person are making appropriate adaptations, pain, sensory needs, communication difficulties and distressed behaviour.</li>" +
            "</ul>" +
            "<p>If medication is later considered, CR235 notes that people with intellectual disability are more sensitive to side effects, that individualised baseline measures may be needed because the person may struggle to describe symptoms, and that formulation matters if swallowing is difficult. NICE NG87 1.7.28 asks for slower titration and closer monitoring in people with learning disability or autism.</p>" +
            "<p>For borderline intellectual functioning, CR235 (11.3) suggests a joint approach between intellectual disability and adult mental health services, with input such as speech and language therapy to support communication.</p>"
        },
        {
          h: "Forensic settings",
          html:
            "<p>A meta-analysis of 102 studies with almost 70,000 participants found an adult ADHD prevalence of 26.2% in detention settings (Baggio 2018). Estimates based on retrospective childhood assessment were higher (41.1%). The UK ADHD Partnership consensus on offenders (Young 2018) puts the figure at around 25% and finds ADHD both under-diagnosed and misdiagnosed in the criminal justice system. CR235 stresses that most people with ADHD do not commit crimes.</p>" +
            "<h4>Why it matters</h4>" +
            "<p>CR235 links ADHD in prison with more comorbidity, worse quality of life and higher risk of suicidal behaviour, and cites evidence that treatment may reduce reoffending. The principle is equivalence: prisoners should receive care of the same quality as in the community.</p>" +
            "<h4>What is different</h4>" +
            "<ul>" +
            "<li><strong>Informants and records</strong> may be hard to reach. Youth justice, social care and education records can help.</li>" +
            "<li><strong>The differential is crowded</strong>: conduct disorder and antisocial personality disorder, substance use, trauma, head injury, intellectual disability and psychosis. ICD-11 notes that people with conduct-dissocial disorder typically lack inattention and hyperactivity, but co-occurrence is common. CR235 recommends a trauma-informed approach.</li>" +
            "<li><strong>Screens perform differently.</strong> The Australian guideline reports that ASRS specificity was poor in incarcerated women, while a modified BAARS-IV performed well in prisoners.</li>" +
            "<li><strong>Incentives exist</strong>: mitigation, transfer, medication, attention. Assess validity carefully (Module 11), but do not let suspicion replace assessment. The base rate of genuine ADHD here is high.</li>" +
            "<li><strong>Medicolegal requests.</strong> CR235 advises that custodial ADHD services direct requests for court reports to the usual locally agreed channels rather than the treating team. Keep clinical and medicolegal roles separate.</li>" +
            "<li><strong>Medication</strong> raises diversion concerns. CR235 says these can be managed by choosing agents carefully and supervising administration.</li>" +
            "<li><strong>Continuity</strong> on release: communicate results to community services and plan before release.</li>" +
            "</ul>"
        },
        {
          h: "Culture, language and interpreters",
          html:
            "<p>ICD-11 asks clinicians to judge symptoms against cultural norms, and notes that trauma and grief can produce ADHD-like symptoms, especially in disadvantaged and post-conflict settings. DSM-5-TR calls for culturally competent diagnostic practice. WFADHD (2021) cautions that most ADHD research comes from white and East Asian samples, so findings may not generalise. ASRS-type screeners have low specificity across cultures. CR235 notes that cut-offs for trait-based disorders are to an extent cultural.</p>" +
            "<h4>What varies between cultures</h4>" +
            "<ul>" +
            "<li>What counts as acceptable activity, talkativeness and interrupting.</li>" +
            "<li>Expectations of children at home and school, and whether teachers would have commented.</li>" +
            "<li>Eye contact, turn-taking and how people describe emotion.</li>" +
            "<li>Stigma about mental health, which can lead to under-reporting, or to describing distress as physical symptoms.</li>" +
            "<li>School systems: some people had no reports, interrupted schooling, schooling in another language, or schooling during conflict.</li>" +
            "</ul>" +
            "<h4>Questions that help</h4>" +
            "<ul>" +
            "<li>'Compared with other children in your family and village or town, were you more active or more distracted?'</li>" +
            "<li>'Did teachers or relatives ever comment on this? What words did they use?'</li>" +
            "<li>'Were there years when school was interrupted, or when life was unsafe?'</li>" +
            "<li>'Which language did you learn in at school?'</li>" +
            "</ul>" +
            "<h4>Working with interpreters (clinical practice)</h4>" +
            "<ul>" +
            "<li>Use a professional interpreter. Do not use family members, and never children.</li>" +
            "<li>Brief the interpreter beforehand: the purpose, the need for exact rather than summarised answers, and that some questions sound odd.</li>" +
            "<li>Avoid idioms such as 'driven by a motor' or 'on the go'. Describe the behaviour instead.</li>" +
            "<li>Ask for concrete examples and check meaning: 'Can you tell me what that looked like?'</li>" +
            "<li>Allow more time; two sessions may be needed.</li>" +
            "<li>Do not score rating scales normed in English as if they were valid in translation unless a validated translation exists.</li>" +
            "</ul>" +
            "<p>Tick 'Interpreter needed' in the Before you start step, and record the language in your notes.</p>"
        },
        {
          h: "Neurodiversity-affirming communication",
          html:
            "<p>Many people come to an ADHD assessment after years of being called lazy, careless or difficult. How you talk about ADHD affects whether they engage with support. NICE NG87 1.4.3 asks for a structured discussion after diagnosis that includes the positive impacts (understanding symptoms, building on strengths, access to services) and the negative ones (stigma and labelling). NG87 1.5.2 asks treatment plans to take account of resilience and protective factors. CR235 asks clinicians to highlight strengths as well as weaknesses and to frame ADHD as a condition the person can manage, promoting personal agency.</p>" +
            "<h4>Principles (clinical practice)</h4>" +
            "<ul>" +
            "<li><strong>Ask about language.</strong> Some people prefer 'I have ADHD', some 'I am ADHD' or 'ADHDer', some 'neurodivergent'. Use their preference in conversation; use standard clinical terms in the report.</li>" +
            "<li><strong>Describe difference and disability together.</strong> ADHD brings real impairment, and many people also describe energy, creativity and intense focus on what interests them (CR235 16).</li>" +
            "<li><strong>Separate the person from the symptoms.</strong> 'Your attention system struggles with tasks that are not interesting', not 'You do not try'.</li>" +
            "<li><strong>Acknowledge the history.</strong> 'It sounds as if you were told you were careless when you were struggling.'</li>" +
            "<li><strong>Focus on needs.</strong> The DHSC independent review (2026) recommends a 'needs-led plus diagnosis' system, in which support does not wait for a label.</li>" +
            "</ul>" +
            "<h4>Sample phrasings</h4>" +
            "<ul>" +
            "<li>'Your brain handles attention and activity differently. That has caused real difficulties, and it also comes with strengths we can build on.'</li>" +
            "<li>'This is not about willpower. The strategies you have used show how hard you have worked to cope.'</li>" +
            "<li>'Let's look at what would make the biggest difference to your day.'</li>" +
            "</ul>" +
            "<h4>Affirming is not the same as agreeing</h4>" +
            "<p>A respectful assessment can still conclude that the criteria are not met. Being neurodiversity-affirming means taking the person's experience seriously, explaining your reasoning, and pointing to help for what they are struggling with. It does not mean diagnosing everyone who identifies with ADHD. Module 12 covers how to explain a negative result well.</p>"
        }
      ],
      keyPoints: [
        "The criteria stay the same in every group; adapt the questions, informants, differential and practicalities.",
        "NICE NG87 1.2.2: ADHD is thought to be under-recognised in girls and women, who are more likely to be undiagnosed or misdiagnosed with another condition.",
        "Women more often present with inattention, internalising problems and masking, and symptoms may worsen with hormonal change in the cycle, pregnancy and menopause.",
        "High achievement does not exclude ADHD. Assess the cost of keeping up and functioning outside the area of success, and compare with peers of similar ability.",
        "In older adults, build a life-course timeline and rule out a new decline; clinically diagnosed ADHD is rare at 50 and over, and the differential widens.",
        "In students, collect childhood collateral, ask about sleep, substances and exam stress, and remember that over-reporting and under-reporting both occur.",
        "About a quarter of people in substance use treatment and in detention have ADHD; assess rather than exclude, but take extra care with the timeline and validity.",
        "In autism and intellectual disability, do not double count, judge symptoms against developmental level, rely on carers and adapt communication.",
        "Use professional interpreters, avoid idioms, judge behaviour against cultural norms, and consider trauma and disrupted schooling.",
        "Neurodiversity-affirming communication names strengths and difficulties honestly; it does not lower the diagnostic bar."
      ],
      pitfalls: [
        "Accepting a long-standing anxiety, depression or personality disorder label in a woman without asking about childhood ADHD symptoms.",
        "Dismissing ADHD in a high achiever because of their CV, or diagnosing it because they feel they are underperforming relative to an exceptional peer group.",
        "Calling new memory problems in a 70-year-old 'late-diagnosed ADHD' without assessing for cognitive decline and other causes.",
        "Diagnosing a student in exam season from self-report alone, without childhood evidence or a substance and sleep history.",
        "Using a family member, or a child, as interpreter.",
        "Counting autistic social-communication differences as ADHD inattention, or failing to adapt questions for literal responders.",
        "Treating every person in custody as a likely malingerer, or ignoring incentives altogether.",
        "Confusing affirming language with agreement, and avoiding an honest conclusion."
      ],
      quiz: [
        { q: "What does NICE NG87 1.2.2 say about ADHD in girls and women?",
          options: ["They should be assessed against a lower symptom threshold", "They are less often referred and more often misdiagnosed", "ADHD in women usually begins after childhood", "They need female-normed rating scales for a diagnosis"], a: 1,
          why: "NG87 1.2.2 says ADHD is thought to be under-recognised in girls and women: they are less likely to be referred, may be more likely to have undiagnosed ADHD, and may be more likely to receive an incorrect diagnosis of another mental health or neurodevelopmental condition. The threshold does not change, onset is still in childhood, and rating scales are never the basis of a diagnosis." },
        { q: "Aisha, 38, has diagnoses of recurrent depression and 'emotionally unstable traits'. School reports say 'bright but daydreams'. Her mood shifts last hours and follow frustrations; she has never self-harmed and has no fear of abandonment. What is the best next step?",
          options: ["Accept the existing diagnoses; ADHD would add nothing", "Diagnose ADHD on the strength of the school reports", "Treat the depression first and close the ADHD referral", "Assess ADHD fully while reviewing mood and personality"], a: 3,
          why: "Women are more likely to be misdiagnosed with internalising or personality conditions (NG87 1.2.2; UKAP 2020). Brief reactive mood shifts without core borderline features fit ADHD-related emotional dysregulation, but a diagnosis needs the full criteria, not school reports alone. A current depressive episode may need treating, but that is not a reason to close the referral." },
        { q: "A senior surgeon says, 'I can't have ADHD, look at my career.' What is the best way to assess impairment?",
          options: ["Ask about the cost of keeping up and life outside work", "Compare their output with the general population", "Request IQ testing first to set the level of performance expected", "Rely on the WFIRS-S total to measure impairment"], a: 0,
          why: "AQAS warns against ruling out ADHD on achievement, CR235 notes that high performance may come at significant cost in time and effort, and DSM-5-TR criterion D includes reduced quality of functioning. Compare with peers of similar ability, not the general population. IQ testing is not required (BAP 2014), and impairment scales support the interview rather than replace it." },
        { q: "A 71-year-old seeks assessment. Their parents have died and school records are lost. What is the best approach?",
          options: ["Decline the assessment, as no parent can be interviewed", "Accept the self-report, as recall is the only source left", "Seek other informants and records, and look for decline", "Use a QbTest to provide objective evidence instead"], a: 2,
          why: "NG87 1.3.3 says an uncertain time of onset should not by itself exclude the diagnosis, while ICD-11 advises caution without corroboration. Siblings, childhood friends and old documents can help, and new difficulties in later life must be separated from cognitive decline and other causes. QbTest is research-only in adults (NICE HTG729)." },
        { q: "Ben, 20, first seeks an ADHD assessment in his second year at university. What does CADDRA advise for students presenting for the first time?",
          options: ["Diagnose from self-report, as adult students know their own difficulties best", "Give every student a performance validity test first", "Review parent and school reports, seek collateral, screen substances", "Refer to student support services instead of assessing"], a: 2,
          why: "CADDRA notes that some students exaggerate symptoms to obtain accommodations or stimulants, and that lifetime non-prescribed stimulant use among students ranges from 5 to 43%. It advises reviewing parental reports and report cards, gathering current collateral, and screening for substance use and conduct problems. Validity tests are guided by indicators, not given to everyone." },
        { q: "A university disability assessor's report says a student shows 'characteristics of ADHD'. What is this?",
          options: ["Evidence for study support, not a medical diagnosis", "A diagnosis that meets NICE NG87, if signed by a psychologist", "Enough for the GP to start medication under shared care", "A diagnosis, provided school reports were reviewed"], a: 0,
          why: "SASC (2021) guidance allows suitably qualified psychologists and specialist teacher assessors to identify characteristics of ADHD for Disabled Students' Allowance or Access to Work. It is not a medical diagnosis, and such reports must explain how to seek one. Medication needs a specialist diagnosis and initiation (NG87 1.3.1, 1.7.2)." },
        { q: "In Sibley 2012, how did young adults with childhood-diagnosed ADHD report their current symptoms?",
          options: ["They over-reported, so self-report was inflated", "Self-report was more sensitive than parent report", "Adding self-report to parent report improved accuracy", "They under-reported, and parent report was more sensitive"], a: 3,
          why: "Young adults with ADHD tended to under-report and controls tended to over-report. Parent report was more diagnostically sensitive, and combining self-report with parent report gave no significant extra benefit. This supports seeking a parent's account where possible." },
        { q: "When assessing ADHD in an adult with intellectual disability, what does ICD-11 require?",
          options: ["An IQ of 70 or more before ADHD can be diagnosed", "Symptoms out of proportion to intellectual level", "That the intellectual disability is diagnosed first", "Symptoms judged against chronological age norms"], a: 1,
          why: "Both diagnoses can be made, but ICD-11 requires ADHD symptoms to be disproportionate to intellectual level, so compare with people of similar ability rather than peers of the same age. CR235 adds that adult scales are hard to interpret beyond mild intellectual disability and that carers' accounts across settings are essential." },
        { q: "What adult ADHD prevalence did the Baggio 2018 meta-analysis find in detention settings?",
          options: ["About 26%", "About 3%", "About 60%", "About 10%"], a: 0,
          why: "Baggio 2018 pooled 102 studies with 69,997 participants and found 26.2%. Estimates based on retrospective childhood assessment were higher (41.1%). The UKAP offenders consensus gives around 25%. A high base rate is a reason to assess carefully, not to assume feigning." },
        { q: "You are assessing a man who speaks limited English. His 15-year-old son offers to interpret. What should you do?",
          options: ["Accept, as the son knows his history well", "Continue in simple English, speaking slowly and checking understanding", "Rebook with a professional interpreter, briefed in advance", "Use a translated ASRS and shorten the interview"], a: 2,
          why: "Family members, and especially children, should not interpret: accuracy, confidentiality and safeguarding all suffer. Brief a professional interpreter, avoid idioms such as 'driven by a motor', and check meaning with concrete examples. A scale, translated or not, cannot replace the interview." },
        { q: "Amira, 34, grew up in a conflict zone, had interrupted schooling and now struggles to concentrate. Which ICD-11 point is most relevant?",
          options: ["ADHD symptoms are judged against UK school norms", "Interrupted schooling counts as evidence of onset before 12", "Culture affects symptom judgements only in childhood", "Trauma and grief can produce ADHD-like symptoms"], a: 3,
          why: "ICD-11 asks clinicians to judge symptoms against cultural norms and notes that trauma and grief can produce ADHD-like symptoms, especially in disadvantaged and post-conflict settings. Interrupted schooling is context to explore, not evidence of ADHD. Ask about PTSD, and look for the pattern before the trauma." },
        { q: "Which feedback statement is the best example of neurodiversity-affirming but honest communication?",
          options: ["'You have a lifelong disorder that will limit what you can achieve.'", "'This has caused real difficulties, and it also brings strengths.'", "'Everyone is a bit ADHD these days, so try not to worry.'", "'You think differently, so you do not need any treatment.'"], a: 1,
          why: "NICE NG87 1.4.3 asks for a discussion of both positive and negative impacts, and CR235 asks clinicians to highlight strengths as well as difficulties. The best statement acknowledges impairment and strengths without minimising either. Affirming language does not mean denying the need for support." }
      ],
      refs: [
        "NICE NG87. Attention deficit hyperactivity disorder: diagnosis and management (2018, updated 2019; last reviewed July 2026). Recommendations 1.1.4, 1.2.1, 1.2.2, 1.3.3, 1.3.5, 1.4.3, 1.4.5, 1.4.12, 1.5.2, 1.7.4, 1.7.5, 1.7.23, 1.7.24, 1.7.28, and rationale for 1.2.1.",
        "Young S et al. Females with ADHD: an expert consensus statement taking a lifespan approach (UKAP). BMC Psychiatry 2020;20:404.",
        "Young S et al. Guidance for identification and treatment of individuals with ADHD and autism spectrum disorder (UKAP). BMC Med 2020;18:146.",
        "Young S et al. Identification and treatment of offenders with ADHD in the prison population: a practical approach based upon expert consensus (UKAP). BMC Psychiatry 2018 (doi:10.1186/s12888-018-1858-9).",
        "Baggio S et al. Prevalence of ADHD in detention settings: a systematic review and meta-analysis. Front Psychiatry 2018;9:331.",
        "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023), sections 6, 9.2, 11.1-11.5, 12.1, 12.5-12.6, 13 and 16.",
        "Adamou M et al. The adult ADHD assessment quality assurance standard (UKAAN AQAS). Front Psychiatry 2024;15:1380410.",
        "Kooij JJS et al. Updated European Consensus Statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019;56:14-34 (sections 4, 5.1, 6.3).",
        "Faraone SV et al. WFADHD International Consensus Statement: 208 evidence-based conclusions. Neurosci Biobehav Rev 2021;128:789-818.",
        "CADDRA. Canadian ADHD Practice Guidelines, 4.1 edition (2020), chapters 2-3.",
        "May T et al. The Australian evidence-based clinical practice guideline for ADHD. Aust N Z J Psychiatry 2023;57:1101-1116 (recommendations 1.1.2, 2.1.6 and screening narrative).",
        "World Health Organization. ICD-11 CDDR (2024), 6A05 culture and boundary notes. Koutsoklenis A, Honkasilta J. Front Psychiatry 2023;13:1064141 (DSM-5-TR text changes).",
        "Solberg BS et al. Norwegian register study of psychiatric comorbidity in 40,103 adults with ADHD. Acta Psychiatr Scand 2018.",
        "Sibley MH et al. When diagnosing ADHD in young adults emphasize informant reports, DSM items, and impairment. J Consult Clin Psychol 2012;80:1052-1061.",
        "Harrison AG, Edwards MJ. Symptom exaggeration in post-secondary students. Appl Neuropsychol 2010;17:135.",
        "Crunelle CL et al. International consensus statement on ADHD and substance use disorders. Eur Addict Res 2018.",
        "SASC. Guidance on the assessment and identification of the characteristics of ADHD (June 2021).",
        "Bolea-Alamañac B et al. BAP guidelines for the pharmacological management of ADHD. J Psychopharmacol 2014;28:179-203.",
        "Department of Health and Social Care. Independent review into mental health conditions, ADHD and autism: final report (October 2026), recommendation 2."
      ]
    },

    /* ================================================================== */
    /* Module 11                                                            */
    /* ================================================================== */
    {
      id: "m11", n: 11, minutes: 45,
      title: "Symptom validity, feigning and diagnostic certainty",
      summary: "How often adults referred for ADHD give a non-credible account, why it happens, how to spot it with clinical indicators and with embedded and stand-alone validity measures, and what those measures cannot do. How to word conclusions fairly, build and grade diagnostic confidence, avoid both over- and under-diagnosis, and handle second opinions.",
      objectives: [
        "Define over-reporting, non-credible report, malingering, symptom validity tests and performance validity tests, and explain why validity applies to the data rather than the person.",
        "State the published base rates of non-credible responding in adult ADHD evaluations and explain why interviews and rating scales alone do not catch it.",
        "Recognise incentives and clinical indicators of non-credible report, and weigh them together rather than singly.",
        "Describe the main embedded and stand-alone validity measures, their sensitivity and specificity, and their limits, and know when to refer for formal testing.",
        "Write proportionate validity statements, grade diagnostic confidence from the convergence of evidence, and respond well to disagreement and second-opinion requests."
      ],
      sections: [
        {
          h: "Why validity is part of every assessment",
          html:
            "<p>An adult ADHD diagnosis rests mostly on what people tell you about themselves now and in childhood. There is no biomarker. Self-report can be inaccurate in both directions. Some people under-report because they lack insight, have adapted, or feel ashamed. Some over-report because they are distressed, have read widely about ADHD, or want something that a diagnosis brings. A small number deliberately feign.</p>" +
            "<p>UK and international guidance recognises this. RCPsych CR235 (9.6) warns that people seeking a diagnosis who have learned about ADHD may easily endorse most items on questionnaires. Its differential diagnosis section (9.7.8) names abnormal sick-role behaviour, including people seeking benefits, diversion or validation and people rehearsing answers to standard questionnaires, and balances this against evidence that ADHD remains under-diagnosed. The European Consensus (Kooij 2019) notes that some patients may feign symptoms to obtain stimulants or accommodations and that there is some evidence for performance validity tests.</p>" +
            "<h4>Terms</h4>" +
            "<table><thead><tr><th>Term</th><th>Meaning</th></tr></thead><tbody>" +
            "<tr><td>Over-reporting</td><td>Reporting more or worse symptoms than are present, for any reason, including distress or poor insight</td></tr>" +
            "<tr><td>Non-credible report</td><td>A report that cannot be relied on as an accurate account. It describes the data, not the motive</td></tr>" +
            "<tr><td>Feigning</td><td>Deliberately fabricating or exaggerating symptoms</td></tr>" +
            "<tr><td>Malingering</td><td>Feigning motivated by an external incentive. A strong conclusion that needs strong evidence</td></tr>" +
            "<tr><td>Symptom validity test (SVT)</td><td>A check on whether reported symptoms are credible, usually built into a questionnaire</td></tr>" +
            "<tr><td>Performance validity test (PVT)</td><td>A check on whether test performance reflects true ability, usually a task that is easy even for people with real impairment</td></tr>" +
            "</tbody></table>" +
            "<p>Validity concerns the <strong>weight the evidence can bear</strong>. A clinician who notes that a self-report scale is invalid is not calling the patient a liar. They are saying the scale cannot be used as evidence. That framing keeps the assessment fair and the report defensible. The Symptom validity and consistency step in each assessment is built around this idea.</p>"
        },
        {
          h: "Base rates: how common is non-credible report?",
          html:
            "<p>Published studies of adults referred for ADHD evaluation, mostly from North American neuropsychology and student services, report non-credible responding in roughly 15 to 31%:</p>" +
            "<table><thead><tr><th>Study</th><th>Sample</th><th>Finding</th></tr></thead><tbody>" +
            "<tr><td>Suhr 2008</td><td>Young adults referred for ADHD</td><td>31% failed the Word Memory Test</td></tr>" +
            "<tr><td>Marshall 2010</td><td>268 adults referred for ADHD</td><td>22% showed symptom exaggeration on two or more indicators</td></tr>" +
            "<tr><td>Harrison and Edwards 2010</td><td>144 consecutive Canadian post-secondary students</td><td>14.6% failed a symptom validity test</td></tr>" +
            "<tr><td>Marshall 2016</td><td>554 patients</td><td>20.8% met criteria for suspect effort; 71% of them would have been diagnosed with ADHD from the interview alone</td></tr>" +
            "<tr><td>Ovsiew 2023</td><td>392 adults in outpatient neuropsychology</td><td>22% invalid symptom report, 16% invalid performance; only 6% invalid on both</td></tr>" +
            "</tbody></table>" +
            "<p>Two further findings matter. In a simulation study (Sollman 2010), people coached to fake ADHD readily produced ADHD-consistent profiles, and the ADHD Rating Scale and CAARS self-report were particularly easy to fake. In Marshall 2016, people with suspect effort were nearly indistinguishable from people with ADHD on rating scales, executive function and impairment scales, cognitive tests and interview.</p>" +
            "<h4>Read these numbers with care</h4>" +
            "<ul>" +
            "<li>Most samples come from settings where accommodations or stimulants were at stake, often student services. NHS adult clinic rates are not known.</li>" +
            "<li>A failed validity test means the data cannot be relied on. It does not tell you why, and it does not rule ADHD out.</li>" +
            "<li>The rates do not mean that a fifth of your patients are lying. They mean that a careful assessor should expect some accounts not to stand up, and should check.</li>" +
            "</ul>" +
            "<h4>Worked example: why interviews alone are not enough</h4>" +
            "<p>Imagine, for illustration only, 200 referrals in which 20% (40 people) give a non-credible account. If 71% of them would be diagnosed by interview alone, as in Marshall 2016, that is 28 diagnoses. Suppose 90 of the 160 credible referrals truly have ADHD and are diagnosed. Then 28 of 118 diagnoses (24%) would rest on non-credible accounts. The numbers are hypothetical, but the lesson is real: an interview that accepts self-report at face value lets through a meaningful share of false positives. Informants, records, concrete examples and, where indicated, validity testing are what lower that share.</p>"
        },
        {
          h: "Incentives and context",
          html:
            "<p>An incentive is anything a diagnosis could bring. Common ones:</p>" +
            "<ul>" +
            "<li>Stimulant medication: to study, work longer, lose weight, sell, or for recreational use. NICE NG87 1.7.23 asks for caution when there is a risk of diversion for cognitive enhancement or appetite suppression.</li>" +
            "<li>Exam or workplace adjustments, extra time, Disabled Students' Allowance.</li>" +
            "<li>Benefits, compensation or insurance claims.</li>" +
            "<li>Legal mitigation or a defence argument.</li>" +
            "<li>Validation: an explanation for failures, or a sense of identity and belonging.</li>" +
            "</ul>" +
            "<p>CADDRA reports lifetime non-prescribed stimulant use among students of 5 to 43%, and notes that some students and young adults exaggerate symptoms to obtain accommodations or stimulants.</p>" +
            "<h4>An incentive is not evidence of feigning</h4>" +
            "<p>Most people with ADHD want something from their assessment: help, treatment, adjustments. Wanting medication is not suspicious in itself. An incentive raises the prior probability of over-reporting, so it should increase the care you take over corroboration. It should never replace the assessment or be used as a reason to dismiss the person.</p>" +
            "<h4>Ask neutrally and record neutrally</h4>" +
            "<ul>" +
            "<li>'What are you hoping will be different after this assessment?'</li>" +
            "<li>'Is there anything particular a diagnosis would help with, such as work, study or something else?'</li>" +
            "<li>'Have you ever taken anyone else's ADHD medication? What was it like?'</li>" +
            "<li>'Is anything else happening, such as a court case, an exam or a claim, that this assessment might be part of?'</li>" +
            "</ul>" +
            "<p>A report sentence such as 'X is hoping for exam adjustments and is interested in medication' is factual and fair. A sentence such as 'X is drug-seeking' is a conclusion that needs evidence.</p>"
        },
        {
          h: "Clinical indicators of non-credible report",
          html:
            "<p>No single sign proves anything. Look for a <strong>pattern</strong> of indicators across sources, and always consider an innocent explanation for each one.</p>" +
            "<table><thead><tr><th>Indicator</th><th>Why it matters</th><th>Innocent explanations to consider</th></tr></thead><tbody>" +
            "<tr><td>Almost every symptom endorsed at the highest frequency</td><td>Genuine ADHD rarely produces a uniform maximum profile</td><td>Severe distress, depression, poor discrimination between items</td></tr>" +
            "<tr><td>Textbook language with few concrete examples</td><td>Real symptoms come with real stories</td><td>Low verbal fluency, autism, anxiety in the interview, language barrier</td></tr>" +
            "<tr><td>Examples that are vague, generic or borrowed from social media</td><td>Suggests knowledge of the criteria rather than lived experience</td><td>Some people describe themselves in the words they have learned</td></tr>" +
            "<tr><td>Childhood history contradicted by school reports and a parent</td><td>Criterion B depends on corroboration</td><td>Masking, a quiet inattentive presentation, a parent with ADHD or poor recall</td></tr>" +
            "<tr><td>Symptoms or impairment appear only in the context of the incentive (exams, a case)</td><td>Not pervasive</td><td>Genuine unmasking by new demands; stress</td></tr>" +
            "<tr><td>Claimed impairment out of line with records and observed functioning</td><td>Self-report is not the only evidence</td><td>High effort hiding impairment (see Module 10)</td></tr>" +
            "<tr><td>Atypical or implausible symptoms (for example losing personal memories or getting lost at home)</td><td>Not features of ADHD; may suggest feigning or another condition</td><td>Dissociation, neurocognitive disorder, psychosis</td></tr>" +
            "<tr><td>Requests a particular stimulant by brand, dose or release form</td><td>Can reflect prior non-prescribed use</td><td>Previous treatment elsewhere; family experience</td></tr>" +
            "<tr><td>Reluctance to allow any collateral or records</td><td>Removes the main check on self-report</td><td>Estrangement, abuse, privacy concerns</td></tr>" +
            "<tr><td>Answers that change between sessions or between forms</td><td>Inconsistency lowers reliability</td><td>Fluctuating mood, poor memory, misunderstood questions</td></tr>" +
            "</tbody></table>" +
            "<p>The validity checklist in the Symptom validity and consistency step lists indicators like these with weights, so that you can see whether concern comes from one isolated finding or from several that point the same way.</p>" +
            "<h4>The examples test</h4>" +
            "<p>The most powerful clinical check is simple. For every symptom the person endorses, ask for a recent, specific example, then a childhood example, then how often it happens and what it cost. 'Tell me about the last time that happened.' 'What did you do next?' 'Who noticed?' People with genuine ADHD can usually give vivid, varied, sometimes embarrassing examples. People reciting criteria often cannot. UKAAN AQAS makes eliciting and documenting clear examples of each symptom present an essential standard.</p>"
        },
        {
          h: "Embedded and stand-alone validity measures",
          html:
            "<p>Validity measures come in two kinds. <strong>Embedded</strong> measures are built into rating scales or test batteries. <strong>Stand-alone</strong> measures are separate tests designed for the purpose.</p>" +
            "<h4>Embedded symptom validity indicators</h4>" +
            "<table><thead><tr><th>Measure</th><th>What is known</th></tr></thead><tbody>" +
            "<tr><td>CAARS Infrequency Index (CII), original CAARS</td><td>12 rarely endorsed items; a sum over 20 is suspect. Initial sensitivity 24% at 95% specificity against performance validity failure; cross-validated sensitivity 17 to 50%, specificity 86 to 95%. Detected 46% of instructed simulators at 95% specificity (Becke 2021)</td></tr>" +
            "<tr><td>Exaggeration Index (Harrison and Armstrong 2016)</td><td>Specificity 0.97, sensitivity 0.24</td></tr>" +
            "<tr><td>CAARS 2 Negative Impression Index</td><td>A score of 6 or more warrants follow-up (CAARS 2-Short)</td></tr>" +
            "<tr><td>CAT-A Infrequency scale</td><td>58% sensitivity at 90% or higher specificity in one study; weaker in a later one</td></tr>" +
            "<tr><td>BRIEF-A validity scales</td><td>Negativity, Inconsistency and Infrequency scales</td></tr>" +
            "</tbody></table>" +
            "<p>Becke 2021 developed a new ADHD-specific infrequency index. It identified 30% of instructed simulators at 98% specificity. Neither it nor the CII detected non-credible adults who already had an ADHD diagnosis with adequate accuracy. The ASRS, WURS and WFIRS have no validity scales at all.</p>" +
            "<h4>Stand-alone performance validity tests</h4>" +
            "<ul>" +
            "<li><strong>Word Memory Test:</strong> 64% sensitivity at 90% or higher specificity in adult ADHD referrals; 31% failure rate in one referral sample.</li>" +
            "<li><strong>Test of Memory Malingering (TOMM):</strong> a score below 45 of 50 on trial 1 or 2 was treated as suspect in Becke 2021; sensitivity 56%, specificity 93% in one review.</li>" +
            "<li><strong>b Test:</strong> 47% sensitivity at 90% or higher specificity in adult ADHD referrals.</li>" +
            "<li><strong>Groningen Effort Test:</strong> sensitivity and specificity of about 89% in one study.</li>" +
            "</ul>" +
            "<h4>What these numbers mean in practice</h4>" +
            "<p>High specificity and low sensitivity is the usual pattern. That is deliberate: it keeps false accusations rare. The cost is that most non-credible accounts pass. Worked example: in 100 referrals with 20 non-credible accounts, an index with 24% sensitivity and 95% specificity flags about 5 of the 20, and wrongly flags about 4 of the 80 credible people. So a <strong>pass</strong> misses about 15 of the 20, and a <strong>fail</strong> is correct only about 5 times in 9. Neither result settles the question alone.</p>" +
            "<h4>Rules for using validity measures</h4>" +
            "<ul>" +
            "<li>Symptom validity and performance validity are dissociable (Ovsiew 2023). When testing is indicated, assess both.</li>" +
            "<li>Requiring two or more independent failures keeps specificity high (Sollman 2010).</li>" +
            "<li>Performance validity tests need trained administration and interpretation. Refer to a clinical psychologist or neuropsychologist rather than improvising.</li>" +
            "<li>Language, culture, intellectual disability, severe depression and genuine severe ADHD can all lower scores. Use the norms and cut-offs the test publisher provides, and interpret in context.</li>" +
            "<li>Use them when indicators or incentives raise concern, not as a routine gate that every patient must pass.</li>" +
            "</ul>"
        },
        {
          h: "Consistency checks you can do in any clinic",
          html:
            "<p>Most validity work needs no special test. It is careful comparison of sources:</p>" +
            "<ol>" +
            "<li><strong>Self versus informant.</strong> Compare symptom by symptom, with examples, not just totals. Partial disagreement is normal; ask why it exists.</li>" +
            "<li><strong>History versus records.</strong> School reports, GP records, previous mental health notes, occupational health reports and appraisals. Do they describe the same person?</li>" +
            "<li><strong>Childhood versus adulthood.</strong> Is the adult picture a continuation of the childhood one, or does it appear from nowhere?</li>" +
            "<li><strong>Scale versus interview.</strong> High scale scores with thin interview examples weaken the scales, not the interview.</li>" +
            "<li><strong>Reported versus observed.</strong> Note behaviour in clinic, but remember CR235 and CADDRA: absence of visible symptoms in a novel, salient setting does not exclude ADHD.</li>" +
            "<li><strong>Impairment versus achievement.</strong> Claims of severe impairment should fit the person's record, allowing for the cost of compensation.</li>" +
            "<li><strong>Timeline versus life events.</strong> Do symptoms rise exactly when an exam, a claim or a court date approaches?</li>" +
            "<li><strong>Within the interview.</strong> Does the account stay the same when you return to a topic from another angle?</li>" +
            "</ol>" +
            "<p>Record the results in the Symptom validity and consistency step and choose an overall level: <strong>no concern</strong>, <strong>some concern</strong> or <strong>major concern</strong>. The level feeds into the confidence rating in Scoring and diagnosis.</p>" +
            "<h4>When informants disagree</h4>" +
            "<p>Disagreement is not always a validity problem. A parent may minimise because of their own ADHD, guilt or a different idea of 'normal'. A partner may exaggerate during conflict. Ask each informant for examples, ask about the context of their knowledge, and weigh contemporaneous records above memory. The Collateral information step gives a 0 to 2 support rating for each source.</p>"
        },
        {
          h: "Wording conclusions about validity",
          html:
            "<p>Write about the evidence, not about the person's character. Avoid 'malingering' unless you have strong, convergent evidence of deliberate feigning for an external incentive, usually from formal testing interpreted against recognised criteria such as the Slick criteria used by Marshall 2016. In most clinical reports a description of the evidence is both fairer and more useful.</p>" +
            "<table><thead><tr><th>Level</th><th>Example wording</th></tr></thead><tbody>" +
            "<tr><td>No concern</td><td>'The account was detailed and consistent across sessions, and was supported by the mother's account and by school reports from ages 7 and 10. I have no concerns about the validity of the information.'</td></tr>" +
            "<tr><td>Some concern</td><td>'The self-report scales were elevated on almost every item, beyond what the interview examples supported. I have given them little weight and based my conclusion on the interview, the partner's account and the records.'</td></tr>" +
            "<tr><td>Major concern</td><td>'The childhood symptoms described were not supported by school reports or by the parent interviewed, examples were generic, and the symptoms reported were largely limited to the current exam period. I am unable to conclude that the criteria are met on the current evidence. I have recommended formal psychological assessment, including validity testing, if a further opinion is wanted.'</td></tr>" +
            "</tbody></table>" +
            "<h4>Good habits</h4>" +
            "<ul>" +
            "<li>State what you checked: sources, scales, validity indices if used.</li>" +
            "<li>Say what weight you gave each source and why.</li>" +
            "<li>Offer innocent explanations where they are plausible: 'This may reflect current distress.'</li>" +
            "<li>Separate the validity statement from the diagnostic conclusion: a credible account can still fall short of the criteria, and a partly exaggerated account can still sit on genuine ADHD.</li>" +
            "<li>Explain the reasoning to the patient in the feedback session in the same neutral terms (Module 12).</li>" +
            "</ul>" +
            "<p>UKAAN AQAS recommends that where information is missing or contradictory, the report discusses its effect on validity. The Symptom validity and consistency step includes further sample sentences.</p>"
        },
        {
          h: "Building diagnostic confidence",
          html:
            "<p>Confidence comes from <strong>convergence</strong>: independent sources that point the same way at the level of each criterion. It does not come from one very high score.</p>" +
            "<table><thead><tr><th>Raises confidence</th><th>Lowers confidence</th></tr></thead><tbody>" +
            "<tr><td>School reports before 12 describing the symptoms</td><td>No childhood corroboration at all</td></tr>" +
            "<tr><td>A parent and a partner who independently describe the same pattern</td><td>Informants disagree without explanation</td></tr>" +
            "<tr><td>Specific, varied examples for each symptom present</td><td>Generic examples, textbook language</td></tr>" +
            "<tr><td>Impairment documented in records (warnings, fines, failed courses)</td><td>Impairment claimed but not evident anywhere else</td></tr>" +
            "<tr><td>Symptoms persist through euthymia, abstinence and good sleep</td><td>Active substance use, a current mood episode or untreated sleep disorder</td></tr>" +
            "<tr><td>Alternatives considered and reasoned out</td><td>Differentials not reviewed</td></tr>" +
            "<tr><td>Consistent account across sessions</td><td>Validity concerns</td></tr>" +
            "</tbody></table>" +
            "<p>The Scoring and diagnosis step shows a confidence rating of high, moderate or low with the reasons that raised or lowered it. Use it as a prompt to check your reasoning, not as a verdict.</p>" +
            "<h4>Missing childhood evidence</h4>" +
            "<p>NICE NG87 1.3.3 says not to exclude ADHD because of an uncertain time of onset. CR235 (9.5) says an inability to obtain corroborative history for reasons outside the person's control should not necessarily exclude a diagnosis. ICD-11 says that without corroborating information an adult diagnosis should be made with caution. These fit together: you may diagnose, but you must show your reasoning and state the limitation.</p>" +
            "<h4>Worked example</h4>" +
            "<p>Kai, 29, has 7 inattentive and 6 hyperactive-impulsive symptoms now, each with good examples. The mother confirms restlessness and disorganisation from age 6, and two school reports mention 'distracted' and 'disorganised'. Impairment is moderate at work and at home. Kai drinks 30 units a week, and the difficulties were the same during a dry year in 2023. There is no mood episode, no sleep disorder, and the account was consistent. Confidence: <strong>high</strong>. Change one fact: no informant is available and the school reports are lost. The interview is unchanged. Confidence falls to <strong>moderate</strong>; a diagnosis may still be reasonable, with the limitation stated.</p>" +
            "<h4>Options when you are not sure</h4>" +
            "<ul>" +
            "<li><strong>Gather more:</strong> another informant, records, a second interview.</li>" +
            "<li><strong>Treat and reassess:</strong> stabilise mood, sleep or substance use first.</li>" +
            "<li><strong>Defer:</strong> record the decision as deferred, with a plan and a date.</li>" +
            "<li><strong>Refer:</strong> neuropsychology for validity or cognitive testing, or a colleague for a second opinion.</li>" +
            "</ul>" +
            "<p>Do not use a stimulant trial to settle doubt. CR235 states that stimulants improve attention in people without ADHD, so a therapeutic trial has no diagnostic value.</p>"
        },
        {
          h: "Avoiding both over- and under-diagnosis",
          html:
            "<p>The DHSC independent review (2026) could not conclude that over-diagnosis is occurring at scale, but found the balance of risk shifting towards misdiagnosis and over-diagnosis, while under-recognition continues for some groups. It linked misdiagnosis to assessments that are brief, not face to face, fragmented, made without informants or records, or focused on a single condition.</p>" +
            "<p>Two longitudinal studies show why the childhood criterion and the differential matter. In the MTA comparison group (Sibley 2018), about 95% of people who screened positive for apparent late-onset ADHD were excluded after comprehensive assessment; among those with impairing symptoms, the commonest reason was that symptoms occurred only with heavy substance use. In the Dunedin cohort (Moffitt 2015), 90% of adults meeting adult symptom criteria had no history of childhood ADHD, and they did not show the childhood neuropsychological deficits or polygenic risk of the childhood group. Whatever the explanation, adult symptoms alone do not establish a childhood-onset neurodevelopmental disorder.</p>" +
            "<table><thead><tr><th>Habits that cause over-diagnosis</th><th>Habits that cause under-diagnosis</th></tr></thead><tbody>" +
            "<tr><td>Diagnosing from rating scales or a tick-box interview</td><td>Excluding ADHD because the person sat calmly and spoke well in clinic</td></tr>" +
            "<tr><td>Accepting 'yes' without examples, frequency and impairment</td><td>Dismissing ADHD because of a degree, a good job or high IQ</td></tr>" +
            "<tr><td>Skipping childhood evidence</td><td>Insisting on school reports that do not exist</td></tr>" +
            "<tr><td>Ignoring mood, sleep, substances and trauma</td><td>Treating any comorbidity as an exclusion</td></tr>" +
            "<tr><td>Counting autistic, anxious or depressive features as ADHD symptoms</td><td>Attributing everything to the comorbidity and never asking about childhood</td></tr>" +
            "<tr><td>Relying on one session with no informant</td><td>Expecting a 'typical' boyhood picture in women</td></tr>" +
            "<tr><td>Treating stimulant response as proof</td><td>Assuming that wanting medication means feigning</td></tr>" +
            "</tbody></table>" +
            "<p>UKAAN AQAS warns that tick-box assessments built on the 18 symptoms risk confirmation bias, and that relying heavily on rating scales and pre-assessment questionnaires adds to that risk. RCPsych CR235 cautions against a first appointment made up solely of a semi-structured interview, because it can be leading and can miss more appropriate diagnoses. Start with an open history, then use the structured interview.</p>"
        },
        {
          h: "Second opinions and disagreements",
          html:
            "<h4>When a patient disagrees with your conclusion</h4>" +
            "<ul>" +
            "<li>Explain your reasoning criterion by criterion, in plain language, and name the evidence you relied on.</li>" +
            "<li>Ask what they think you have missed. New information, such as a newly found school report, can change the conclusion.</li>" +
            "<li>Offer to review further evidence, and say what would make a difference.</li>" +
            "<li>Respect their right to seek a second opinion, as GMC guidance expects, and make the referral route clear.</li>" +
            "<li>Document the discussion and any agreed next steps.</li>" +
            "</ul>" +
            "<h4>When you are asked to review someone else's diagnosis</h4>" +
            "<p>RCPsych CR235 (8) says that people diagnosed abroad or outside the NHS should bring their reports, and that without sufficient evidence of a comprehensive diagnostic assessment a standard ADHD assessment will be needed. Review the report against the UKAAN AQAS standard:</p>" +
            "<ul>" +
            "<li>Were all 18 symptoms assessed for adulthood and childhood, with examples?</li>" +
            "<li>Was impairment shown to be at least moderate in two or more domains?</li>" +
            "<li>Was collateral sought, and were school reports reviewed?</li>" +
            "<li>Were mental and physical comorbidities and differentials considered, and is there a statement that the symptoms are not better explained by another disorder?</li>" +
            "<li>Was a risk assessment done, and was the assessment long enough (AQAS: at least 2 hours in most cases)?</li>" +
            "</ul>" +
            "<p>If the report meets the standard, accept it and say so. If it does not, explain to the patient and the referrer which parts are missing, and offer to complete them rather than starting from scratch where possible. Avoid judging a report by the provider's name; judge it by its content.</p>" +
            "<h4>Seeking a second opinion yourself</h4>" +
            "<p>Discuss uncertain cases with a colleague or in a team meeting. UKAAN AQAS recommends 10 to 20 supervised cases for assessors in training and ongoing supervision for some professional groups. NICE NG87 1.7.16 asks for a second opinion or tertiary referral when symptoms do not respond to one or more stimulants and one non-stimulant, which can also prompt a fresh look at the diagnosis.</p>"
        }
      ],
      keyPoints: [
        "Validity is about the weight the evidence can bear, not about the person's character.",
        "In published adult ADHD referral samples, 15 to 31% of accounts failed symptom or performance validity measures; 71% of suspect-effort patients in one study would have been diagnosed by interview alone.",
        "An incentive is common and is not evidence of feigning; it calls for more careful corroboration.",
        "Look for patterns of indicators across sources, and consider an innocent explanation for each one.",
        "The examples test is the most powerful routine check: specific, recent and childhood examples, with frequency and cost, for every symptom present.",
        "Embedded and stand-alone validity measures are specific but insensitive: a pass does not prove credibility and a single fail does not prove feigning. Symptom and performance validity should both be assessed when testing is indicated.",
        "Word validity statements around the evidence and its weight; reserve 'malingering' for strong, convergent evidence.",
        "Confidence comes from convergence of independent sources at the level of each criterion; missing childhood evidence lowers confidence but need not prevent a diagnosis.",
        "Stimulant response is not diagnostic; when unsure, gather more, treat and reassess, defer or refer."
      ],
      pitfalls: [
        "Accepting self-report scales at face value as evidence for the diagnosis.",
        "Treating a request for medication or adjustments as proof of feigning.",
        "Labelling a patient a malingerer in the report on the basis of one indicator.",
        "Assuming a passed validity index means the account is credible.",
        "Ignoring informant and record discrepancies because the interview went smoothly.",
        "Using a stimulant trial to resolve diagnostic doubt.",
        "Rejecting another provider's diagnosis because of who made it rather than what the report contains.",
        "Becoming so focused on feigning that genuine ADHD in a high-incentive group, such as students or prisoners, is missed."
      ],
      quiz: [
        { q: "What is the difference between a symptom validity test (SVT) and a performance validity test (PVT)?",
          options: ["An SVT checks effort on tasks; a PVT checks reported symptoms", "Both measure ADHD severity, one by report and one by test", "An SVT on its own can establish malingering", "An SVT checks reported symptoms; a PVT checks test effort"], a: 3,
          why: "SVTs, usually embedded in questionnaires, check the credibility of reported symptoms. PVTs are tasks that are easy even with real impairment and check whether test scores reflect true ability. Neither measures ADHD severity, and neither establishes malingering on its own." },
        { q: "What range of non-credible responding is reported in published samples of adults referred for ADHD evaluation?",
          options: ["Under 2%", "About 15 to 31%", "About 50 to 60%", "Over 80%"], a: 1,
          why: "Studies report 31% (Suhr 2008), 22% (Marshall 2010), 20.8% (Marshall 2016), 14.6% (Harrison and Edwards 2010) and 22% invalid symptom report with 16% invalid performance (Ovsiew 2023). Most came from North American settings with accommodations or stimulants at stake; NHS rates are not known." },
        { q: "What did Marshall 2016 find about adults referred for ADHD who showed suspect effort?",
          options: ["The clinical interview reliably identified them", "Rating scales clearly separated them from ADHD", "Most would have been diagnosed by interview alone", "They made up less than 2% of referrals"], a: 2,
          why: "Of 554 patients, 20.8% showed suspect effort by Slick criteria. They were nearly indistinguishable from people with ADHD on rating scales, tests and interview, and 71% would have been diagnosed with ADHD from the interview alone." },
        { q: "Ovsiew 2023 found 22% invalid symptom report and 16% invalid performance, but only 6% invalid on both. What follows?",
          options: ["Assess both kinds when validity testing is indicated", "A performance validity test alone is sufficient", "A symptom validity scale alone is sufficient", "Validity testing adds nothing beyond a careful clinical interview"], a: 0,
          why: "The two kinds of invalidity were largely dissociable, so one kind of test cannot stand in for the other. When indicators raise concern, refer for both symptom and performance validity assessment." },
        { q: "In 100 referrals with 20 non-credible accounts, an index with 24% sensitivity and 95% specificity is used. About how many non-credible accounts pass undetected?",
          options: ["About 15 of the 20", "About 5 of the 20", "About 1 of the 20", "None of them"], a: 0,
          why: "24% of 20 is about 5 flagged, so about 15 pass. The index also wrongly flags about 4 of the 80 credible people, so a fail is right only about 5 times in 9. Neither a pass nor a fail settles the question alone." },
        { q: "Ellis, 19, scores 'very often' on all 18 ASRS items, cannot give examples, has a mother and school reports describing a settled child, and asks for a named stimulant. What is the best approach?",
          options: ["Diagnose ADHD, as the ASRS is strongly positive", "Record 'malingering' and discharge", "Do not diagnose now; describe the gaps in evidence", "Prescribe the named stimulant as a diagnostic trial"], a: 2,
          why: "Several indicators converge, but the report should describe the evidence and its weight rather than assign motive. A diagnosis needs corroborated criteria; formal validity testing can be offered if a further opinion is wanted. 'Malingering' needs strong, convergent evidence, and a stimulant trial has no diagnostic value (CR235)." },
        { q: "A patient says a diagnosis would help them get extra time in exams. How should you treat this?",
          options: ["As evidence of likely feigning", "As an incentive to record, with more corroboration", "As irrelevant, so do not ask about or record it", "As a reason to refer for validity testing"], a: 1,
          why: "Most people want something from an assessment. An incentive raises the prior chance of over-reporting, so record it neutrally and look harder for corroboration, but it is not evidence of feigning on its own. Validity testing is prompted by a pattern of indicators, not by an incentive alone." },
        { q: "What role should a response to stimulant medication play in deciding whether someone has ADHD?",
          options: ["A clear response confirms ADHD", "No response makes ADHD unlikely", "A short trial is the best way to settle doubt in uncertain cases", "None: stimulants also help people without ADHD"], a: 3,
          why: "CR235 states that stimulants have an appreciable effect on attention in people without ADHD, so a therapeutic trial has no diagnostic value. When unsure, gather more information, treat and reassess, defer or refer." },
        { q: "Which validity sentence is best for a clinical report?",
          options: ["'The patient is malingering to obtain stimulants.'", "'The patient lied about their childhood symptoms to get a diagnosis.'", "'Examples, informants and records did not support the account.'", "'Validity was poor, so the account was disregarded.'"], a: 2,
          why: "It describes the evidence and its effect without assigning motive, and it tells the reader what was checked. 'Malingering' and 'lied' need strong, convergent evidence, usually from formal testing; 'disregarded' gives no reasons and discards information that may still carry some weight." },
        { q: "No childhood informant or school report is available for a 45-year-old with a detailed, consistent history. What do NICE and ICD-11 say?",
          options: ["Diagnosis is possible; record the evidence and limitation", "Both NICE and ICD-11 require school reports", "NICE requires at least one parent informant", "ICD-11 rules out an adult diagnosis without contemporaneous records"], a: 0,
          why: "NG87 1.3.3 says an uncertain time of onset should not by itself exclude the diagnosis, and CR235 9.5 agrees, while ICD-11 asks for caution without corroboration. Confidence is lower, and the report should say why a diagnosis was still reached, or not." },
        { q: "A patient diagnosed after a 45-minute online assessment with no collateral asks you to take over prescribing. What is the best response, in line with CR235?",
          options: ["Accept the diagnosis, as private providers are regulated", "Reject it, because it was made outside the NHS", "Start medication now and review the diagnosis later", "Offer a standard assessment, building on what exists"], a: 3,
          why: "CR235 asks patients diagnosed abroad or outside the NHS to bring their reports and says that, without sufficient evidence of a comprehensive diagnostic assessment, a standard ADHD assessment will be needed. Judge the report by its content against AQAS (at least 2 hours in most cases, with collateral sought), not by who made it." },
        { q: "Which habit is most likely to cause missed ADHD?",
          options: ["Seeking collateral from a parent", "Ruling out ADHD because they sat calmly", "Asking open questions before structured ones", "Asking for recent real-life examples"], a: 1,
          why: "CR235 and CADDRA note that symptoms may not show in a novel, salient setting such as a clinic, so their absence does not exclude ADHD. The other options are good practice." }
      ],
      refs: [
        "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023), sections 8, 9.5, 9.6, 9.7.8 and 12.2.1.",
        "Kooij JJS et al. Updated European Consensus Statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019;56:14-34 (section 3.3).",
        "Adamou M et al. The adult ADHD assessment quality assurance standard (UKAAN AQAS). Front Psychiatry 2024;15:1380410.",
        "NICE NG87. Attention deficit hyperactivity disorder: diagnosis and management. Recommendations 1.3.2, 1.3.3, 1.7.16, 1.7.23.",
        "World Health Organization. ICD-11 CDDR (2024), 6A05 additional features (corroboration of childhood history).",
        "CADDRA. Canadian ADHD Practice Guidelines, 4.1 edition (2020), chapters 1 and 3.",
        "Suhr J et al. Arch Clin Neuropsychol 2008;23:521 (Word Memory Test failure in young adults referred for ADHD).",
        "Marshall P et al. Clin Neuropsychol 2010;24:1204; Marshall PS et al. Psychol Assess 2016;28:1290-1302 (corrected).",
        "Harrison AG, Edwards MJ. Appl Neuropsychol 2010;17:135; Harrison AG, Armstrong IT. Clin Neuropsychol 2016;30:265-283 (Exaggeration Index).",
        "Ovsiew GP et al. Clin Neuropsychol 2023;37:1498-1515.",
        "Sollman MJ et al. Detection of feigned ADHD in college students. Psychol Assess 2010;22:325-335.",
        "Suhr JA, Buelow M, Riddle T. CAARS Infrequency Index. J Psychoeduc Assess 2011;29:160-170; Becke M et al. A new validity index embedded in the CAARS. J Neural Transm 2021.",
        "MHS. CAARS 2 manual materials and CAARS 2-Short sample report (Negative Impression Index); PAR. BRIEF-A and CAT-A materials; Finley JA et al. 2024 (CAT-A validity scales).",
        "Sibley MH et al. Late-onset ADHD reconsidered with comprehensive repeated assessments between ages 10 and 25. Am J Psychiatry 2018;175:140-149.",
        "Moffitt TE et al. Is adult ADHD a childhood-onset neurodevelopmental disorder? Evidence from a 4-decade longitudinal cohort study. Am J Psychiatry 2015;172:967-977.",
        "Department of Health and Social Care. Independent review into mental health conditions, ADHD and autism: final report (October 2026).",
        "General Medical Council. Good medical practice (2024)."
      ]
    },

    /* ================================================================== */
    /* Module 12                                                            */
    /* ================================================================== */
    {
      id: "m12", n: 12, minutes: 50,
      title: "Formulation, report writing, feedback and next steps",
      summary: "How to turn the assessment into a formulation, write a report that others can trust, state the conclusion with DSM-5-TR (ICD-10-CM) and ICD-11 codes, run a feedback session, and plan next steps: psychoeducation, the NICE NG87 adult treatment pathway, baseline checks before medication, reasonable adjustments, driving, GP letters and shared care, what to do when ADHD is not diagnosed, and record keeping.",
      objectives: [
        "Write a formulation that explains the person's difficulties, needs and strengths as well as naming a diagnosis.",
        "Structure a report that meets the UKAAN AQAS standard, including the explicit 'not better explained by another disorder' statement and absent conditions.",
        "State the conclusion with presentation, severity and the correct DSM-5-TR (ICD-10-CM) and ICD-11 codes, and avoid confusing ICD-10-CM with WHO ICD-10.",
        "Run a structured feedback session and give post-diagnostic information in line with NICE NG87 1.4.3 to 1.4.4, including driving and reasonable adjustments.",
        "Summarise the NICE NG87 adult treatment pathway and the baseline checks before medication, and know when to refer for a cardiology opinion.",
        "Explain a negative or uncertain result kindly and usefully, write clear GP letters, and keep records that support the conclusion."
      ],
      sections: [
        {
          h: "From findings to formulation",
          html:
            "<p>A diagnosis answers 'what?'. A formulation also answers 'why this person, why now, and what will help?'. NICE NG87 1.3.4 asks the diagnostic process to include an assessment of the person's needs, coexisting conditions, social, family, educational or occupational circumstances and physical health. NG87 1.5.2 asks the treatment plan to take account of the severity of symptoms and impairment (including sleep), the person's goals, their resilience and protective factors, and the impact of other conditions.</p>" +
            "<h4>A practical structure</h4>" +
            "<ul>" +
            "<li><strong>Lifelong pattern:</strong> the ADHD symptoms (or their absence), with onset and course.</li>" +
            "<li><strong>Why now:</strong> what changed to bring the person to assessment (new job, a child, university, loss of a partner's support, perimenopause).</li>" +
            "<li><strong>What keeps difficulties going:</strong> sleep, substances, shame and avoidance, untreated mood or anxiety, an environment that does not fit.</li>" +
            "<li><strong>Co-occurring conditions:</strong> and how they interact with the ADHD.</li>" +
            "<li><strong>Strengths and protective factors:</strong> supportive relationships, interests, energy, creativity, insight, coping strategies that work.</li>" +
            "<li><strong>Needs:</strong> what would make the biggest difference, in the person's own priorities.</li>" +
            "</ul>" +
            "<h4>Example formulation</h4>" +
            "<blockquote><p>Kai is a 29-year-old project manager with lifelong inattention and restlessness, described by their mother from age 6 and by two primary school reports. Difficulties became impairing after promotion to a role with heavy administration and the birth of their first child, which removed the time Kai had used to catch up in the evenings. Short sleep and weekend drinking, which Kai uses to unwind, make the daytime difficulties worse. There is no mood episode or sleep disorder; the alcohol use is co-occurring and does not explain the symptoms, which were unchanged during a dry year. Kai's strengths are energy, creativity under pressure and a supportive partner. Kai's priorities are to manage email and deadlines and to be more present at home.</p></blockquote>" +
            "<p>A formulation like this makes the plan obvious: environmental changes at work, sleep and alcohol advice, psychoeducation for Kai and their partner, and a medication discussion if impairment persists.</p>"
        },
        {
          h: "What a high-quality report contains",
          html:
            "<p>UKAAN AQAS (2024) sets out what an adult ADHD report should contain. <strong>Essential</strong> items: the report supports its conclusions; it states explicitly that the symptoms are not better explained by another disorder, which is a distinct criterion; it gives a detailed account of the specific symptoms; it summarises mental and physical comorbidities; and it gives a formulation with the outcome and evidence that the criteria were reviewed (for DSM-5-TR in adults, five or more symptoms in a domain plus criteria B to E), naming the presentation if criteria are met.</p>" +
            "<p><strong>Highly recommended</strong> items: real-life examples; interview and questionnaire scores with a narrative; evidence that informants were sought and whether school reports were reviewed and supported the diagnosis; how comorbidity affects the picture; explicit mention of absent conditions; if criteria are not met, whether the picture is subthreshold ADHD or secondary to another condition; driving advice; and the effect of missing or contradictory information on validity.</p>" +
            "<h4>Example outline</h4>" +
            "<ol>" +
            "<li><strong>Details and referral question.</strong> Reference, date, referrer, the question asked.</li>" +
            "<li><strong>Sources of information.</strong> Who attended, informants interviewed, records reviewed, questionnaires used, interpreter, face to face or video, total time.</li>" +
            "<li><strong>Presenting difficulties and goals.</strong> In the person's words.</li>" +
            "<li><strong>Background.</strong> Development, education, work, relationships, family history, forensic history.</li>" +
            "<li><strong>Mental health history and mental state.</strong></li>" +
            "<li><strong>Physical health, medicines, substances and sleep.</strong> Including absent conditions such as head injury, seizures and cardiac symptoms.</li>" +
            "<li><strong>Questionnaires.</strong> Scores with interpretation, described as supporting information.</li>" +
            "<li><strong>Diagnostic interview.</strong> Each symptom, adult and childhood, present or absent, with examples.</li>" +
            "<li><strong>Onset, settings and impairment.</strong> Domains with at least moderate impairment, with examples.</li>" +
            "<li><strong>Collateral and records.</strong> What each source said and how strongly it supports the history.</li>" +
            "<li><strong>Differential diagnosis and co-occurring conditions.</strong> Each condition considered and the verdict.</li>" +
            "<li><strong>Validity.</strong> Consistency of the account and any concerns.</li>" +
            "<li><strong>Risk.</strong> Self-harm, substances, driving, harm from others, parenting where relevant.</li>" +
            "<li><strong>Formulation.</strong></li>" +
            "<li><strong>Conclusion.</strong> Criteria, presentation, severity, codes, confidence.</li>" +
            "<li><strong>Recommendations and plan.</strong> Including information given and driving advice.</li>" +
            "</ol>" +
            "<p>The Report and next steps step builds a draft in this order from what you recorded. Read and edit it; it is a draft, not a finished report.</p>" +
            "<h4>Style</h4>" +
            "<ul>" +
            "<li>Write for two readers: the patient and the next clinician. Plain words, short sentences, defined abbreviations.</li>" +
            "<li>Use examples rather than adjectives: 'missed three rent payments this year' rather than 'poor with money'.</li>" +
            "<li>Attribute every claim: 'Their mother described…', 'School reports from 2005 state…'.</li>" +
            "<li>Keep scores in proportion. NICE NG87 1.3.2: a diagnosis should not be made solely on rating scale or observational data.</li>" +
            "</ul>"
        },
        {
          h: "Writing the conclusion: criteria, presentation and codes",
          html:
            "<p>State the conclusion in one clear paragraph, then show the criteria. NICE NG87 1.3.3 requires symptoms to meet DSM-5 or ICD-11 criteria, cause at least moderate impairment, and occur often in two or more important settings.</p>" +
            "<table><thead><tr><th>Presentation</th><th>DSM-5-TR (ICD-10-CM code)</th><th>ICD-11</th></tr></thead><tbody>" +
            "<tr><td>Combined</td><td>F90.2</td><td>6A05.2</td></tr>" +
            "<tr><td>Predominantly inattentive</td><td>F90.0</td><td>6A05.0</td></tr>" +
            "<tr><td>Predominantly hyperactive-impulsive</td><td>F90.1</td><td>6A05.1</td></tr>" +
            "<tr><td>Other specified</td><td>F90.8: impairing ADHD-type symptoms that do not meet full criteria, with the reason recorded</td><td>6A05.Y: other specified <em>presentation</em> of ADHD whose requirements are met; not a subthreshold category</td></tr>" +
            "<tr><td>Unspecified</td><td>F90.9: criteria not fully met, reason not given</td><td>6A05.Z: presentation unspecified</td></tr>" +
            "</tbody></table>" +
            "<h4>Three coding traps</h4>" +
            "<ul>" +
            "<li><strong>ICD-10-CM is not WHO ICD-10.</strong> The F90 codes above are the US ICD-10-CM codes that go with DSM-5-TR. In WHO ICD-10, the version used for NHS hospital coding, F90.0 means 'disturbance of activity and attention', and the official ICD-11 to ICD-10 crosswalk maps 6A05.2 (combined) to F90.0. Always name the system: 'DSM-5-TR, ICD-10-CM F90.2' or 'ICD-11 6A05.2'.</li>" +
            "<li><strong>'Other specified' means different things.</strong> DSM-5-TR other specified ADHD (F90.8) is a subthreshold category. ICD-11 6A05.Y is a presentation of a diagnosis that is met. ICD-11 has no fixed symptom count, so whether a person with four strong symptoms meets the 6A05 requirements is a clinical judgement; if they do not, no 6A05 code applies. The app suggests 6A05.Y alongside F90.8, so check it.</li>" +
            "<li><strong>Specifiers differ.</strong> DSM-5-TR has severity (mild, moderate, severe) and 'in partial remission'. ICD-11 has neither for 6A05. The DSM-5-TR presentation is based on the past six months.</li>" +
            "</ul>" +
            "<h4>Example conclusions</h4>" +
            "<ul>" +
            "<li><strong>Met:</strong> 'Kai meets DSM-5-TR criteria for ADHD, combined presentation (ICD-10-CM F90.2; ICD-11 6A05.2), of moderate severity. Seven inattentive and six hyperactive-impulsive symptoms are present now, and several were present before 12, corroborated by their mother and school reports. Impairment is at least moderate at work and at home. Depression, anxiety, bipolar disorder, autism and sleep disorders were considered; alcohol use co-occurs. The symptoms are not better explained by another disorder. Confidence: high.'</li>" +
            "<li><strong>Not met:</strong> 'The criteria for ADHD are not met. Current concentration problems began in 2023 with a depressive episode and have improved as mood has improved; there is no evidence of several symptoms before 12.'</li>" +
            "<li><strong>Subthreshold:</strong> 'Four inattentive symptoms are present with moderate impairment, below the DSM-5-TR adult threshold of five. This is best described as DSM-5-TR other specified ADHD, with insufficient inattention symptoms (ICD-10-CM F90.8). It does not meet the NICE NG87 1.3.3 threshold for an ADHD diagnosis.'</li>" +
            "<li><strong>Better explained:</strong> 'The difficulties are better explained by obstructive sleep apnoea, which began with weight gain in 2021. I have referred for a sleep study and will review after treatment.'</li>" +
            "<li><strong>Deferred:</strong> 'I have deferred a diagnostic conclusion until the current depressive episode has been treated, because concentration problems cannot be separated from it now. Review in three months.'</li>" +
            "</ul>" +
            "<p>The Scoring and diagnosis step suggests the presentation, severity and codes from what you recorded. Check them against your own judgement before they go into the report.</p>"
        },
        {
          h: "The feedback session",
          html:
            "<p>Feedback is a clinical intervention in its own right. UKAAN AQAS lists its essential components: detailed feedback and psychoeducation in clear language; discussion of psychosocial issues including education, occupation and driving; time to reflect and ask questions; shared decision-making about treatment options, contraindications and preferences; measurable treatment goals before treatment starts; physical monitoring for medication; and seeking the GP's agreement for future prescribing. AQAS suggests that about an hour may be needed for feedback and treatment discussion. It can be a separate appointment.</p>" +
            "<h4>A structure that works</h4>" +
            "<ol>" +
            "<li><strong>Set the agenda.</strong> 'I'll tell you what I found, explain why, and then we'll talk about what happens next. Stop me at any point.'</li>" +
            "<li><strong>Ask first.</strong> 'Before I say what I think, what are you expecting or hoping to hear?'</li>" +
            "<li><strong>Give the headline early.</strong> Do not make the person wait through the detail.</li>" +
            "<li><strong>Explain the evidence</strong> in the person's own examples: 'You described… and your mother remembered…'</li>" +
            "<li><strong>Explain what it means</strong> for their life, including strengths.</li>" +
            "<li><strong>Respond to emotion.</strong> CR235 notes that a new adult diagnosis can bring relief and also resentment that it was not made earlier. Name both.</li>" +
            "<li><strong>Agree next steps</strong> and goals.</li>" +
            "<li><strong>Check understanding</strong>: 'What will you tell your partner about today?'</li>" +
            "<li><strong>Give it in writing</strong>: a summary and sources of information.</li>" +
            "</ol>" +
            "<h4>Sample phrases</h4>" +
            "<ul>" +
            "<li>'The assessment shows that you have ADHD. The difficulties you have described with focus, organisation and restlessness have been there since childhood, and they are causing real problems at work and at home.'</li>" +
            "<li>'This explains a lot, but it does not explain everything. The low mood you have had this year needs its own help too.'</li>" +
            "<li>'ADHD is something you can learn to manage. You have already built strategies; now we can add to them.'</li>" +
            "</ul>" +
            "<p>NICE NG87 1.5.5 asks whether adults would like a partner, close friend or carer to join treatment discussions, and 1.5.6 asks clinicians to reassure people that they can revisit treatment decisions. CR235 encourages framing ADHD as a condition the person has responsibility for managing, to promote personal agency.</p>"
        },
        {
          h: "When ADHD is diagnosed: psychoeducation and the NICE treatment pathway",
          html:
            "<p>NICE NG87 1.4.3 asks for a structured discussion after diagnosis about how ADHD could affect the person's life. It may include the positive impacts of diagnosis (understanding symptoms, building on strengths, access to services), the negative ones (stigma and labelling), a greater tendency to impulsive behaviour, the importance of environmental modifications, education and employment issues including reasonable adjustments, relationships, coexisting conditions, the increased risk of substance misuse and self-medication, and driving. The discussion should inform a shared treatment plan. NG87 1.4.4 asks clinicians to point people to support groups, voluntary organisations, websites and education and employment support. NG87 1.4.10 asks for advice to families of adults about relationships, functioning and the importance of structure.</p>" +
            "<h4>The adult pathway in NICE NG87</h4>" +
            "<table><thead><tr><th>Stage</th><th>What NICE says</th><th>Rec</th></tr></thead><tbody>" +
            "<tr><td>Plan</td><td>A holistic shared treatment plan; discuss benefits and harms of drug and non-drug options, lifestyle and exercise, preferences and concerns, adherence</td><td>1.5.2, 1.5.4</td></tr>" +
            "<tr><td>First</td><td>Environmental modifications, implemented and reviewed</td><td>1.5.15</td></tr>" +
            "<tr><td>Medication</td><td>Offer if symptoms still cause significant impairment in at least one domain after environmental modifications</td><td>1.5.15</td></tr>" +
            "<tr><td>First-line drugs</td><td>Lisdexamfetamine or methylphenidate</td><td>1.7.11</td></tr>" +
            "<tr><td>Switch</td><td>Consider the other first-line drug after a 6-week trial at an adequate dose without enough benefit</td><td>1.7.12, 1.7.13</td></tr>" +
            "<tr><td>Dexamfetamine</td><td>Consider if responding to lisdexamfetamine but unable to tolerate its longer effect (off-label)</td><td>1.7.14</td></tr>" +
            "<tr><td>Atomoxetine</td><td>Offer if lisdexamfetamine or methylphenidate is not tolerated, or both have failed after separate 6-week trials</td><td>1.7.15</td></tr>" +
            "<tr><td>Further</td><td>Second opinion or tertiary referral if no response to one or more stimulants and one non-stimulant; guanfacine for adults only with tertiary advice</td><td>1.7.16, 1.7.17</td></tr>" +
            "<tr><td>Non-drug treatment</td><td>Consider if the person chooses not to take medication, has difficulty adhering, or finds it ineffective or intolerable; or alongside medication if impairment persists. As a minimum: a structured supportive psychological intervention focused on ADHD and regular follow-up; may include CBT</td><td>1.5.16 to 1.5.18</td></tr>" +
            "<tr><td>Shared care</td><td>After titration and dose stabilisation, prescribing and monitoring under shared care with primary care</td><td>1.7.29</td></tr>" +
            "<tr><td>Review</td><td>At least yearly review of medication by a professional with ADHD expertise</td><td>1.10.1</td></tr>" +
            "</tbody></table>" +
            "<p>Only a professional with training and expertise in diagnosing and managing ADHD should start medication (NG87 1.7.2). NG87 1.6.1 stresses a balanced diet, good nutrition and regular exercise. NG87 1.9.3 asks clinicians to correct misconceptions that undermine adherence, for example by explaining that medication does not change personality. CR235 reminds clinicians to manage expectations: not all symptoms respond to treatment.</p>"
        },
        {
          h: "Before any medication: the baseline checks",
          html:
            "<p>NICE NG87 1.7.4 lists the baseline assessment before ADHD medication:</p>" +
            "<ul>" +
            "<li>A review to confirm the person still meets the criteria and needs treatment.</li>" +
            "<li>Mental health and social circumstances: coexisting conditions, current education or employment, a risk assessment for substance misuse and drug diversion, and care needs.</li>" +
            "<li>Physical health: medical history including possible contraindications, current medicines, height and weight, baseline pulse and blood pressure (with an appropriately sized cuff), and a cardiovascular assessment.</li>" +
            "</ul>" +
            "<p>An ECG is not needed before stimulants, atomoxetine or guanfacine unless a 1.7.5 feature is present or the person has a coexisting condition treated with a medicine that may increase cardiac risk.</p>" +
            "<h4>Refer for a cardiology opinion before medication if (NG87 1.7.5, summarised)</h4>" +
            "<ul>" +
            "<li>Congenital heart disease or previous cardiac surgery.</li>" +
            "<li>Sudden death in a first-degree relative under 40 suggesting cardiac disease.</li>" +
            "<li>Breathlessness on exertion compared with peers.</li>" +
            "<li>Fainting on exertion or in response to fright or noise.</li>" +
            "<li>Rapid, regular palpitations that start and stop suddenly.</li>" +
            "<li>Chest pain suggesting cardiac origin, signs of heart failure, or a murmur.</li>" +
            "<li>Blood pressure in the hypertensive range for adults.</li>" +
            "</ul>" +
            "<h4>Other things to check and record</h4>" +
            "<ul>" +
            "<li><strong>Seizures and tics:</strong> CR235 asks for a direct discussion, as ADHD treatments can exacerbate them. NG87 1.7.28 asks for slower titration and closer monitoring with epilepsy, brain injury, cardiac disease, other neurodevelopmental conditions and many mental health conditions.</li>" +
            "<li><strong>Psychosis or mania:</strong> NG87 1.7.19 says to stop ADHD medication during an acute psychotic or manic episode.</li>" +
            "<li><strong>Other conditions:</strong> CR235's checklist includes liver disease and glaucoma, and its medicines table lists contraindications such as hyperthyroidism and phaeochromocytoma (check the SmPC and BNF).</li>" +
            "<li><strong>Diversion and misuse:</strong> NG87 1.7.23 to 1.7.24 (caution; avoid immediate-release or easily misused preparations where there is risk).</li>" +
            "<li><strong>Pregnancy and contraception:</strong> an individual risk-benefit discussion, with UKTIS advice (CR235 12.5).</li>" +
            "<li><strong>Sleep and appetite baseline:</strong> NG87 1.8.17 asks for sleep to be monitored during treatment.</li>" +
            "<li><strong>Measurable goals and baseline scales:</strong> AQAS asks for treatment goals before starting. CR235 suggests ASRS and WFIRS-S for monitoring response, and NG87 1.7.26 asks for symptoms, impairment and adverse effects to be recorded at baseline and at each dose change.</li>" +
            "</ul>" +
            "<h4>Worked example</h4>" +
            "<p>Morgan, 33, is diagnosed with ADHD and wants to try medication. At baseline: BP 128/82, pulse 76, BMI 24. On direct questioning, Morgan fainted while running last year, and an older brother died suddenly at 28 of a heart condition. Two 1.7.5 features are present. Do not start medication; refer for a cardiology opinion first, and explain why. Meanwhile, start psychoeducation and environmental changes.</p>"
        },
        {
          h: "Reasonable adjustments, work, study, driving and travel",
          html:
            "<p>NICE defines <strong>environmental modifications</strong> as changes to the physical environment that reduce the impact of ADHD, for example seating, lighting and noise, headphones, shorter periods of focus with movement breaks, and written instructions to back up verbal requests. <strong>Reasonable adjustments</strong> are the legal duties of employers and higher education providers to ensure that disabled people are not substantially disadvantaged. Under the Equality Act 2010, a person is disabled if they have a physical or mental impairment with a substantial and long-term adverse effect on their ability to carry out normal day-to-day activities; CR235 notes that whether ADHD meets this depends on the individual case.</p>" +
            "<h4>Adjustments that often help at work (CR235 16.1)</h4>" +
            "<ul>" +
            "<li><strong>Structure:</strong> regular short review meetings, structured feedback, written instructions broken into steps, checklists, checks by others, diaries and planners.</li>" +
            "<li><strong>External distractions:</strong> a quieter workspace, flexible hours or home working, noise-reducing headphones.</li>" +
            "<li><strong>Internal distractions:</strong> permission to move and take regular breaks.</li>" +
            "</ul>" +
            "<p>With consent, NICE NG87 1.4.12 asks clinicians to contact the school, college or university when ADHD is diagnosed or at transitions, to explain the diagnosis, any separate learning difficulties, the treatment plan and the adjustments needed. Students may be eligible for Disabled Students' Allowance and workers for Access to Work support (SASC 2021). CR235 advises that risk assessments for safety-critical jobs are best directed to the employer's medical advisers, informed by the clinician's account of symptoms, treatment and side effects.</p>" +
            "<h4>Driving</h4>" +
            "<p>GOV.UK states that a person must tell the DVLA if their ADHD or ADHD medication affects their ability to drive safely, and need not tell the DVLA if it does not. They can be fined up to £1,000 if they do not tell the DVLA about a condition that affects their driving. Car and motorcycle licence holders use form A1; bus and lorry licence holders use form A1V. CR235 notes that a diagnosis is not in itself a bar to a car or motorcycle licence, that bus and lorry licences are considered individually, and that treatment has been shown to improve driving. NICE NG87 1.4.3 includes driving in the post-diagnostic discussion. Ask about accidents, near misses, speeding and phone use while driving, give the GOV.UK wording, and record the advice given.</p>" +
            "<h4>Travel with medication</h4>" +
            "<p>Stimulants are controlled drugs. CR235 (16.3) advises people to check the rules of the country they are visiting, and says a prescriber's letter should give the person's name, the destination and dates, the medicines with dose, strength and quantity, and the prescriber's signature. A trip of three months or more, or a supply lasting three months or more, may need a personal licence.</p>"
        },
        {
          h: "When ADHD is not diagnosed",
          html:
            "<p>A negative result is often harder to give than a positive one. The person may have waited years and may feel disbelieved. NICE NG87 1.4.4 notes that people whose symptoms and impairment fall short of a diagnosis may benefit from the same kind of information as those diagnosed. UKAAN AQAS asks the report to say whether the picture is subthreshold ADHD or secondary to another condition.</p>" +
            "<h4>How to explain it</h4>" +
            "<ul>" +
            "<li>Start from what you agree on: 'You are clearly struggling with focus and organisation, and that is real.'</li>" +
            "<li>Explain the criteria simply: 'ADHD is a lifelong pattern that starts in childhood and shows across different parts of life.'</li>" +
            "<li>Explain the evidence: 'The school reports and your father's account describe a settled child, and the difficulties began when your mood dropped two years ago.'</li>" +
            "<li>Give the alternative explanation if there is one, and what helps it.</li>" +
            "<li>Say what would change your view: 'If you find school reports or other evidence from childhood, I would be happy to look at them.'</li>" +
            "<li>Offer a second opinion route and record the conversation.</li>" +
            "</ul>" +
            "<h4>Signposting by explanation</h4>" +
            "<table><thead><tr><th>Main explanation</th><th>Next step</th></tr></thead><tbody>" +
            "<tr><td>Depression or anxiety</td><td>Treatment through the GP or NHS Talking Therapies (or the local equivalent outside England); review in mental health services if severe</td></tr>" +
            "<tr><td>Sleep disorder</td><td>Sleep hygiene, CBT for insomnia, sleep service referral</td></tr>" +
            "<tr><td>Substance use</td><td>Local drug and alcohol service; reassess after sustained abstinence if difficulties persist</td></tr>" +
            "<tr><td>Possible autism</td><td>Autism assessment pathway</td></tr>" +
            "<tr><td>Possible learning disorder</td><td>Educational psychologist or specialist assessor; study support</td></tr>" +
            "<tr><td>Medical cause</td><td>GP investigation or specialist referral</td></tr>" +
            "<tr><td>Subthreshold ADHD traits</td><td>Psychoeducation, practical strategies, workplace or study adjustments, peer support</td></tr>" +
            "</tbody></table>" +
            "<p>The DHSC independent review (2026) recommends a 'needs-led plus diagnosis' approach, in which everyday, reversible support does not wait for diagnostic certainty. Organisational strategies, structure and adjustments can help many people whether or not the criteria are met.</p>"
        },
        {
          h: "Letters to GPs and others",
          html:
            "<p>The GP letter is often the document that matters most for the person's care. Keep it short, put the conclusion and the actions first, and attach the full report.</p>" +
            "<h4>What a GP letter should contain</h4>" +
            "<ol>" +
            "<li>The conclusion, presentation, severity and codes in the first lines.</li>" +
            "<li>Co-occurring conditions found, and any that need GP action.</li>" +
            "<li>Risk issues and what was done.</li>" +
            "<li>The plan and who does what: psychoeducation given, environmental changes, referrals made.</li>" +
            "<li>If medication is planned: baseline findings, the titration plan, who prescribes during titration, and when shared care will be requested.</li>" +
            "<li>Driving advice given.</li>" +
            "<li>Any request to the GP, stated as a clear question.</li>" +
            "</ol>" +
            "<h4>Shared care</h4>" +
            "<p>NICE NG87 1.7.29 says that after titration and dose stabilisation, prescribing and monitoring should be carried out under shared care arrangements with primary care. AQAS lists seeking the GP's agreement for future prescribing as an essential post-diagnostic step, recognising that approaches to shared care differ. CR235 adds that if any medicine is used off-label, the risk assessment and consent should be communicated to the GP. Tell the GP what monitoring is expected: NG87 asks for heart rate and blood pressure before and after each dose change and every 6 months (1.8.9), weight every 6 months in adults (1.8.5), and at least a yearly specialist review of medication (1.10.1).</p>" +
            "<h4>Other letters</h4>" +
            "<ul>" +
            "<li><strong>To the patient:</strong> a plain-language summary, or a copy of the clinic letter written so they can understand it.</li>" +
            "<li><strong>To an employer, college or university:</strong> only with explicit consent, focused on needs and adjustments rather than clinical detail (NG87 1.4.12; CR235 Appendix 6 has template letters).</li>" +
            "<li><strong>To other clinicians:</strong> with consent, NG87 1.4.13 asks you to contact professionals treating coexisting conditions to explain the diagnosis and its implications for their treatment.</li>" +
            "</ul>"
        },
        {
          h: "Record keeping",
          html:
            "<p>The record must show how you reached the conclusion. Another clinician reading it in five years should be able to see what you asked, what you found, who you spoke to and why you decided as you did. AQAS asks for information to be captured in sufficient detail and for the report to support its conclusions.</p>" +
            "<h4>What to record</h4>" +
            "<ul>" +
            "<li>Consent, who was present, the mode (face to face or video), interpreter use and total time.</li>" +
            "<li>Every source: questionnaires with raw scores, informants (name, relationship, how long they have known the person), records reviewed with dates.</li>" +
            "<li>Each symptom, adult and childhood, present or absent, with the examples that decided it.</li>" +
            "<li>Impairment by domain with examples.</li>" +
            "<li>Each differential considered, the verdict and the reasoning, including conditions found absent.</li>" +
            "<li>Validity checks and conclusions.</li>" +
            "<li>Risk assessment and actions.</li>" +
            "<li>Information given, driving advice, the person's preferences and concerns (NG87 1.5.4 asks for these to be recorded in the treatment plan), and the plan.</li>" +
            "<li>If medication is started later: baseline measurements and, at review, the reasons for continuing (NG87 1.10.3).</li>" +
            "</ul>" +
            "<h4>Using this app safely</h4>" +
            "<ul>" +
            "<li>The app stores everything only in this browser. Use a patient reference, not a name.</li>" +
            "<li>Copy the final report and key findings into the official clinical record. The app is a working tool, not the record.</li>" +
            "<li>Mark the report reviewed in the Report and next steps step only after you have read and edited the draft.</li>" +
            "<li>Delete practice and completed assessments from the browser in line with your organisation's data policy.</li>" +
            "</ul>" +
            "<h4>Common report errors</h4>" +
            "<ul>" +
            "<li>Listing scale scores without saying what weight they carried.</li>" +
            "<li>Writing 'criteria met' without showing symptom counts, onset, settings and impairment.</li>" +
            "<li>Omitting the 'not better explained by another disorder' statement.</li>" +
            "<li>Giving no codes, or codes without naming the classification.</li>" +
            "<li>Leaving out driving advice and the plan.</li>" +
            "<li>Copying the patient's self-report into the conclusion without corroboration.</li>" +
            "</ul>"
        }
      ],
      keyPoints: [
        "A formulation explains the lifelong pattern, why the person presents now, what keeps difficulties going, strengths and needs; it makes the plan obvious.",
        "UKAAN AQAS essentials: a report that supports its conclusions, a detailed symptom account, comorbidities, the explicit 'not better explained by another disorder' statement, and the outcome with criteria reviewed and presentation named.",
        "DSM-5-TR with ICD-10-CM codes: combined F90.2, inattentive F90.0, hyperactive-impulsive F90.1, other specified F90.8 (subthreshold, reason recorded), unspecified F90.9. ICD-11 presentations: 6A05.2, 6A05.0, 6A05.1, 6A05.Y (other specified presentation, not subthreshold), 6A05.Z. Always name the system.",
        "Feedback: set the agenda, ask first, give the headline early, explain with the person's own examples, respond to emotion, agree goals and give it in writing.",
        "NICE NG87 adult pathway: environmental modifications first; medication if significant impairment persists (1.5.15); lisdexamfetamine or methylphenidate first line (1.7.11); atomoxetine if both are not tolerated or ineffective (1.7.15); guanfacine only with tertiary advice (1.7.17).",
        "Before medication: confirm the diagnosis, review mental health, risk of misuse and diversion, history, medicines, height, weight, pulse and BP; ECG only with a 1.7.5 feature or a cardiac-risk medicine; refer to cardiology if any 1.7.5 feature is present.",
        "Driving: tell the DVLA if ADHD or its medication affects safe driving (GOV.UK); record the advice given.",
        "When ADHD is not diagnosed, explain the reasoning kindly, name what may explain the difficulties, signpost, and say what evidence would change your view.",
        "GP letters put the conclusion and actions first; shared care follows titration and dose stabilisation (NG87 1.7.29).",
        "Records must show how the conclusion was reached; copy the final report into the clinical record."
      ],
      pitfalls: [
        "Writing a report that lists scale scores and 'criteria met' without examples, onset evidence or impairment by domain.",
        "Omitting the statement that the symptoms are not better explained by another disorder, or the absent conditions.",
        "Mixing ICD-10-CM and WHO ICD-10 codes, giving a code without naming the system, or coding a subthreshold picture as ICD-11 6A05.Y.",
        "Delivering a diagnosis without time for questions, or burying the conclusion at the end of a long explanation.",
        "Starting medication before environmental modifications have been discussed, or before the 1.7.4 baseline is complete.",
        "Missing a 1.7.5 cardiac feature because the family history question was not asked directly.",
        "Telling every patient they must inform the DVLA, or forgetting driving advice altogether.",
        "Ending an assessment that does not diagnose ADHD without explanation, signposting or a route to further evidence."
      ],
      quiz: [
        { q: "Which ICD-10-CM code is used with DSM-5-TR for ADHD, combined presentation?",
          options: ["F90.2", "F90.0", "F90.1", "F98.8"], a: 0,
          why: "In ICD-10-CM, F90.2 is combined, F90.0 predominantly inattentive and F90.1 predominantly hyperactive-impulsive. Do not confuse this with WHO ICD-10, where F90.0 is 'disturbance of activity and attention' and the ICD-11 crosswalk maps combined (6A05.2) to F90.0." },
        { q: "What is the ICD-11 code for ADHD, predominantly inattentive presentation?",
          options: ["6A05.2", "6A05.Z", "6A05.0", "6A02"], a: 2,
          why: "ICD-11 uses 6A05.0 (predominantly inattentive), 6A05.1 (predominantly hyperactive-impulsive), 6A05.2 (combined), 6A05.Y (other specified presentation) and 6A05.Z (presentation unspecified). 6A02 is autism spectrum disorder." },
        { q: "Which statement does UKAAN AQAS make essential in every adult ADHD report?",
          options: ["That the patient was satisfied with the assessment", "That symptoms are not better explained by another disorder", "That a rating-scale cut-off was exceeded", "That a QbTest or another objective attention test was carried out"], a: 1,
          why: "AQAS calls this a distinct criterion that the report must confirm. Rating scales are supporting information only, and QbTest is research-only in adults (NICE HTG729)." },
        { q: "What does NICE NG87 recommend as first-line medication for adults with ADHD?",
          options: ["Atomoxetine or methylphenidate", "Guanfacine or lisdexamfetamine", "Dexamfetamine or methylphenidate", "Lisdexamfetamine or methylphenidate"], a: 3,
          why: "NG87 1.7.11 offers lisdexamfetamine or methylphenidate first line. Atomoxetine follows intolerance or non-response to both (1.7.15), dexamfetamine is for people responding to lisdexamfetamine who cannot tolerate its longer effect (1.7.14), and guanfacine needs tertiary advice in adults (1.7.17)." },
        { q: "When does NICE NG87 1.5.15 recommend offering medication to adults with ADHD?",
          options: ["At diagnosis, as the first step for everyone", "Only after a course of CBT for ADHD has been tried and has not helped", "When the ASRS score stays above the cut-off", "If impairment persists after environmental changes"], a: 3,
          why: "NG87 1.5.15: offer medication if symptoms still cause significant impairment in at least one domain after environmental modifications have been implemented and reviewed. Non-drug treatment is considered in the situations in 1.5.16 to 1.5.17; it is not a precondition for medication." },
        { q: "Is an ECG needed before starting a stimulant in an adult?",
          options: ["Yes, an ECG is needed before any ADHD medication", "Only with a 1.7.5 feature or a cardiac-risk medicine", "Only for people aged over 40", "Only before atomoxetine, not before stimulants"], a: 1,
          why: "NG87 1.7.4 (amended 2019) states that an ECG is not needed before stimulants, atomoxetine or guanfacine unless a 1.7.5 feature is present or a coexisting condition is treated with a medicine that may increase cardiac risk. A cardiovascular history and examination, pulse and blood pressure are always needed." },
        { q: "Morgan, 33, wants to start medication. They fainted while running last year, and their brother died suddenly at 28 of a heart condition. What should you do?",
          options: ["Refer for a cardiology opinion before any medication", "Start methylphenidate at a low dose and monitor", "Do an ECG in clinic and start if it is normal", "Start atomoxetine, as it is not a stimulant"], a: 0,
          why: "Fainting on exertion and sudden death in a first-degree relative under 40 suggesting cardiac disease are both NG87 1.7.5 features. A cardiology opinion comes before any ADHD medication, including atomoxetine; a normal resting ECG does not remove the need." },
        { q: "What should people with ADHD be told about the DVLA?",
          options: ["Everyone with ADHD must tell the DVLA", "Only bus and lorry licence holders must tell the DVLA", "Tell the DVLA if ADHD or its medicine affects driving", "Tell the DVLA only once medication has started"], a: 2,
          why: "This is the GOV.UK wording, also reflected in NICE NG87 1.4.3. Form A1 is for car and motorcycle licences and A1V for bus and lorry licences. A diagnosis is not in itself a bar to a car licence (CR235). Record the advice given." },
        { q: "What does NICE NG87 say about guanfacine for adults?",
          options: ["It is an option after one stimulant has failed", "Only with advice from a tertiary ADHD service", "It is the first choice when stimulants are misused", "It is licensed and first line for adults"], a: 1,
          why: "NG87 1.7.17 says not to offer guanfacine for adults (off-label) without advice from a tertiary ADHD service. Atomoxetine is the adult non-stimulant in the NG87 sequence (1.7.15)." },
        { q: "The assessment concludes that ADHD criteria are not met. What does NICE NG87 1.4.4 suggest?",
          options: ["Discharge, as NICE information is for diagnosed people", "Offer a stimulant trial to check the conclusion", "Re-refer automatically for a second opinion", "Offer similar information to that given at diagnosis"], a: 3,
          why: "NG87 1.4.4 says people whose symptoms and impairment fall short of a diagnosis may benefit from similar information. AQAS asks the report to say whether the picture is subthreshold or secondary to another condition. Explain kindly, signpost, say what evidence would change the conclusion and offer a second-opinion route if asked." },
        { q: "According to NICE NG87 1.7.29, when should prescribing move to shared care with primary care?",
          options: ["From the first prescription, with specialist advice", "Only after a year of stable treatment", "After titration and dose stabilisation", "Never; the specialist always prescribes"], a: 2,
          why: "Titration is led by the specialist (1.7.2, 1.7.26 to 1.7.27). After titration and dose stabilisation, prescribing and monitoring follow shared care arrangements. AQAS asks for the GP's agreement to be sought." },
        { q: "Which is the best way to open a feedback session?",
          options: ["Ask what they expect, then give the headline early", "Go through each symptom before giving the conclusion", "Start with medication options to reassure them", "Give the written report and invite questions later"], a: 0,
          why: "Asking first shows what the person expects, and giving the headline early avoids a long, anxious wait. AQAS stresses clear explanation, time for questions and shared decision-making; the written summary comes at the end, not instead of the conversation." }
      ],
      refs: [
        "NICE NG87. Attention deficit hyperactivity disorder: diagnosis and management (2018, updated 2019; last reviewed July 2026). Recommendations 1.3.2, 1.3.3, 1.3.4, 1.4.3, 1.4.4, 1.4.10, 1.4.12, 1.4.13, 1.5.2, 1.5.4-1.5.6, 1.5.15-1.5.18, 1.6.1, 1.7.2, 1.7.4, 1.7.5, 1.7.11-1.7.17, 1.7.19, 1.7.23, 1.7.24, 1.7.26, 1.7.28, 1.7.29, 1.8.5, 1.8.9, 1.8.17, 1.9.3, 1.10.1, 1.10.3, and terms used in the guideline.",
        "Adamou M et al. The adult ADHD assessment quality assurance standard (UKAAN AQAS). Front Psychiatry 2024;15:1380410 (Theme 2 report contents; Tables 2 and 3).",
        "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023), sections 12, 13, 16 and appendices 5-6.",
        "American Psychiatric Association. DSM-5-TR (2022); ICD-10-CM codes F90.0, F90.1, F90.2, F90.8, F90.9 (NLM Clinical Tables).",
        "World Health Organization. ICD-11 CDDR (2024), 6A05 presentation specifiers and ICD-11 to ICD-10 crosswalk; WHO ICD-10 (2019) F90.",
        "GOV.UK. ADHD and driving (forms A1 and A1V).",
        "Equality Act 2010, section 6 (definition of disability).",
        "SASC. Guidance on the assessment and identification of the characteristics of ADHD (June 2021).",
        "CADDRA. Canadian ADHD Practice Guidelines, 4.1 edition (2020): feedback, accommodation letters and follow-up forms.",
        "Department of Health and Social Care. Independent review into mental health conditions, ADHD and autism: final report (October 2026), recommendation 2 and Annex A.",
        "NICE HTG729. Digital technologies for assessing ADHD (2024)."
      ]
    }
  ]);
})(window.AA);
