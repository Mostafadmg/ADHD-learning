/* Worked training cases c9-c16 (ARCHITECTURE.md 5.8).
   c9 Student seeking exam adjustments with a non-credible report; c10 EUPD and ADHD (both);
   c11 Complex PTSD and developmental trauma (not ADHD); c12 Subthreshold: Other specified ADHD;
   c13 New memory problems at 68: mild neurocognitive disorder (not ADHD); c14 Brain injury at 19 (not ADHD);
   c15 ADHD with co-occurring autism (both); c16 ADHD in prison with conduct history and substance use.
   All patients are fictional. UK practice (NICE NG87) is the default frame; international guidance is included.
   DSM-5-TR and ICD-11 are paraphrased, not reproduced. DIVA wording is not used. Questionnaire scores are
   illustrative but use the published scoring rules and cut-offs in the research briefs of 21 October 2026
   (guidelines-uk, guidelines-intl, tools-adhd, tools-comorbid, ddx-evidence and the assessment-practice sources).
   Anything not from a named source is labelled clinical practice. */
(function (AA) {
  'use strict';

  AA.add('cases', [

    /* ================================================================== */
    /* c9  Student, exam adjustments, non-credible report                   */
    /* ================================================================== */
    {
      id: "c9",
      title: "Every box ticked: exam adjustments and a non-credible report",
      patient: "20-year-old economics student asking for extra time in exams",
      tags: ["validity", "students", "exam adjustments", "non-prescribed stimulants", "anxiety", "not ADHD"],
      difficulty: 2,
      referral: "GP letter (November): 'Oliver is a 20-year-old second-year economics student who self-referred asking for an urgent ADHD assessment. He reports lifelong poor concentration, disorganisation and restlessness and says he will fail his January exams without extra time. The university disability service has told him it needs medical evidence. He completed an online ASRS that was strongly positive. He is otherwise well, takes no regular medicines and has no psychiatric history. Please could you assess, ideally before January.' The pre-assessment pack came back within 48 hours, every item answered.",
      stages: [
        {
          title: "Pre-assessment questionnaires",
          html: "<p>The service sends a standard pack. Oliver returned it two days later, neatly completed, with a covering note: <em>'I think you will see I meet every criterion.'</em></p>" +
            "<table><thead><tr><th>Measure</th><th>Result</th><th>Usual reading</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1 (18 items)</td><td>All 18 items in the shaded range; 15 rated 'Very often'. Part A 6/6. Sum 69/72</td><td>Part A positive at 4 or more. In one Norwegian sample the mean sum was 45 in adults with ADHD and 23 in controls</td></tr>" +
            "<tr><td>WURS-25 (childhood, self-rated)</td><td>81/100</td><td>Cut-offs 36 and 46</td></tr>" +
            "<tr><td>WFIRS-S</td><td>All 7 domains meet the impairment rule, including Risk: 'being involved with the police' rated 3</td><td>Domain impaired if 2 or more items rated 2, 1 or more rated 3, or mean 1.5 or more</td></tr>" +
            "<tr><td>CAARS 2-Short (self-report)</td><td>All content scales T 79 to 88. Negative Impression Index 9</td><td>T 70 or more is very elevated. A Negative Impression Index of 6 or more warrants follow-up</td></tr>" +
            "<tr><td>GAD-7</td><td>12</td><td>Moderate (10 to 14)</td></tr>" +
            "<tr><td>PHQ-9</td><td>9, item 9 = 0</td><td>Mild (5 to 9)</td></tr>" +
            "<tr><td>AUDIT</td><td>10</td><td>Increasing risk (8 to 15)</td></tr>" +
            "<tr><td>DAST-10</td><td>2</td><td>Low level (1 to 2)</td></tr>" +
            "</tbody></table>" +
            "<p>Two details stand out on the forms. He rated 'climbs on furniture' and 'runs about' as current adult problems at 'very often'. On the WURS-25 he rated 'trouble with authorities, visits to the head's office' as 'very much'.</p>",
          q: {
            q: "What is the best interpretation of this pre-assessment pack?",
            options: [
              "It strongly supports ADHD: every scale is above its cut-off",
              "The extreme, uniform elevation is itself a reason to plan a symptom validity check before and during the interview",
              "The WFIRS-S alone shows at least moderate impairment in two settings, so criterion D is met",
              "The scales should be ignored completely, because UKAAN says they have no place in assessment"
            ],
            a: 1,
            why: "Self-report scales are easy to fake: coached simulators readily produce ADHD-like profiles, and the CAARS is particularly susceptible (Sollman 2010). Ceiling scores on every scale, impairment in every WFIRS domain (including risk items he has not yet described) and a raised CAARS 2 Negative Impression Index are a pattern to test, not proof of severe ADHD. The WFIRS cannot establish criterion D on its own: impairment is judged at interview (UKAAN AQAS). UKAAN says self-report symptom scales should not be a formative part of the diagnosis, but that does not mean ignoring them: they are a baseline, and their response style is data."
          }
        },
        {
          title: "First interview: the presenting problem and the incentive",
          html: "<p>Oliver arrives 10 minutes early with a colour-coded ring binder. It holds copies of his forms and a printout of the DSM-5 ADHD criteria with every item highlighted. He sits still and keeps steady eye contact for the whole 90 minutes.</p>" +
            "<blockquote>'I tick every box for inattentive and every box for hyperactive. I just need the letter for 25% extra time and a separate room before January. And I would like to try Elvanse. A friend gave me some in May and it was the first time I could revise for eight hours straight, so I must have ADHD.'</blockquote>" +
            "<h4>Background</h4><ul>" +
            "<li>Independent day school. A-levels A*AA. First-year average 2:1.</li>" +
            "<li>This term the modules are harder. He scored 58 in a mid-term test and 'panicked'. Several friends have exam adjustments.</li>" +
            "<li>Sleeps 4 to 5 hours in deadline weeks, with two or three all-nighters before each deadline.</li>" +
            "<li>Drinks at society socials two or three nights a week, 8 to 10 units a night. Cannabis 'a few times a term'.</li>" +
            "<li>Works 12 hours a week as a barista: <em>'never been late in 18 months, my manager says I'm her most reliable person'</em>.</li>" +
            "<li>Took lisdexamfetamine from a friend on about six days in May. No other non-prescribed medicines.</li></ul>" +
            "<h4>Mental state</h4><p>Well groomed, organised and articulate. Anxious when exams are mentioned, otherwise reactive and warm. No formal thought disorder or psychotic features. No thoughts of self-harm or suicide.</p>",
          q: {
            q: "Which point in this history matters most for the validity of the assessment?",
            options: [
              "He arrived early and sat still for 90 minutes, which rules out ADHD",
              "His high A-level grades mean ADHD cannot be diagnosed",
              "His alcohol use means the assessment must stop until he is abstinent",
              "He has clear external incentives (exam adjustments and a named stimulant) and has already used a non-prescribed stimulant"
            ],
            a: 3,
            why: "CADDRA notes that some post-secondary students exaggerate symptoms to obtain accommodations or stimulants, and that lifetime non-prescribed stimulant use among students is 5-43%. RCPsych CR235 (9.7.8) asks assessors to weigh abnormal sick-role behaviour and rehearsed answers, balanced against under-diagnosis. An incentive is not proof of feigning, but it raises the bar for corroboration. Clinic behaviour neither rules ADHD in nor out (CADDRA advises against relying on observation), high achievement does not exclude ADHD (UKAAN AQAS), and moderate drinking calls for assessment and advice, not a halt."
          }
        },
        {
          title: "Interview findings: adulthood",
          html: "<p>He endorses all 18 adult symptoms, often in criterion language (<em>'I often have difficulty sustaining attention in tasks'</em>). Asked for recent real-life examples, he says: <em>'Just in general. All the time.'</em> Probing gives a different picture.</p>" +
            "<table><thead><tr><th>Area</th><th>His first answer</th><th>On probing</th><th>Clinician rating</th></tr></thead><tbody>" +
            "<tr><td>Sustaining attention (ia2)</td><td>'Can't focus on anything'</td><td>Read a 300-page novel in a weekend last month. Attends every lecture. Shows typed notes with headings and colour coding</td><td>Not established</td></tr>" +
            "<tr><td>Losing things (ia7)</td><td>'I lose things constantly'</td><td>Cannot name anything lost in the past month. Has had the same keys, wallet and phone for two years</td><td>Not established</td></tr>" +
            "<tr><td>Organisation (ia5)</td><td>'Total chaos'</td><td>Keeps a shared revision timetable for his flat. His manager says he 'runs the rota'</td><td>Not established</td></tr>" +
            "<tr><td>Delaying effortful work (ia6)</td><td>'Always'</td><td>Puts off essays until the deadline is close, then works all night 'because I'm scared it won't be good enough'. Since first year only</td><td>Present, recent, linked to anxiety</td></tr>" +
            "<tr><td>Distractibility (ia8)</td><td>'Anything distracts me'</td><td>Checks his phone during revision. Not in lectures or at work</td><td>Not established: no more than his peers describe</td></tr>" +
            "<tr><td>Running and climbing (hi3)</td><td>'Very often, I climb on furniture'</td><td>No example. 'I mean I feel like it.' Inner restlessness only in exam weeks</td><td>Not established</td></tr>" +
            "<tr><td>Talking excessively (hi6)</td><td>'I never stop talking'</td><td>His girlfriend calls him 'the quiet one'</td><td>Not established</td></tr>" +
            "</tbody></table>" +
            "<p>Clinician tally after probing: inattention 1 (delaying work, recent and tied to exam anxiety), hyperactivity-impulsivity 0. Impairment is confined to assessment periods. Work, friendships and daily life go well.</p>",
          q: {
            q: "He rates 'climbs on furniture' as a current problem 'very often' but cannot give an example. How should you treat this?",
            options: [
              "As an atypical endorsement: adults with ADHD rarely report child-type behaviours like this. Note it as one validity indicator and keep asking for real-life examples",
              "As strong evidence of severe hyperactivity, because adults rarely admit to it",
              "As irrelevant, because only inattention matters in adults",
              "As proof of malingering, so end the interview and discharge him"
            ],
            a: 0,
            why: "In adults, DSM-5-TR notes that running and climbing may be limited to feeling restless, so frequent literal climbing is a rare endorsement. Rarely endorsed items are the basis of infrequency validity indices such as the CAARS Infrequency Index. One atypical answer is a single indicator, not proof: combine it with other indicators and with collateral. A judgement of malingering needs evidence of intent and an external incentive, and should not rest on one item."
          }
        },
        {
          title: "Childhood and collateral",
          html: "<p>With Oliver's consent, the assessor spoke to his mother by video and his girlfriend by phone, and his mother sent school reports.</p>" +
            "<blockquote>Mother: 'He was the easiest of my three. He'd do Lego for hours, read in bed with a torch, never lost anything. Teachers loved him. The only thing was nerves. From about 14 he'd be sick before exams.'</blockquote>" +
            "<h4>School reports</h4><ul>" +
            "<li>Age 7: 'Oliver settles quickly and takes great care with his presentation.'</li>" +
            "<li>Age 9: 'A focused, conscientious pupil. Homework is always on time.'</li>" +
            "<li>Age 11: 'Organised and works well on his own.'</li>" +
            "<li>Year 9: 'Excellent effort. Oliver should try not to worry so much before assessments.'</li>" +
            "<li>Behaviour log: no detentions. Prefect in the sixth form.</li></ul>" +
            "<blockquote>Girlfriend: 'He's the organised one, he plans all our trips. Around deadlines he gets really stressed and stops sleeping.'</blockquote>" +
            "<p>With consent, his café manager confirmed by email: 'Punctual, accurate on the till, keeps the rota.'</p>" +
            "<p>Childhood tally: inattention 0, hyperactivity-impulsivity 0. Collateral rating: parent 0, school 0, partner 0 (no support for ADHD).</p>",
          q: {
            q: "How should the gap between his WURS-25 of 81 and these records be weighed?",
            options: [
              "Retrospective self-rating is the gold standard, so the WURS-25 outweighs the reports",
              "School reports are unreliable for boys, so accept the WURS-25",
              "Contemporaneous school reports and a parent's account carry more weight than retrospective self-rating. Here they consistently describe an organised child, so criterion B is not supported",
              "Average the two sources: the result is borderline, so record criterion B as met"
            ],
            a: 2,
            why: "Adult recall of childhood ADHD has a low positive predictive value (Mannuzza 2002: 0.27 at population prevalence), which is why NICE NG87 1.3.1 asks for observer reports and UKAAN AQAS asks for objective or third-party information to corroborate subjective accounts. School reports can miss inattentive ADHD, especially in bright pupils, so silence would be weak evidence. These reports are not silent: they positively describe a careful, organised child, and his mother agrees. His WURS answer about 'trouble with authorities' is contradicted by a clean behaviour record."
          }
        },
        {
          title: "Validity assessment",
          html: "<p>The assessor listed the validity indicators and, with Oliver's agreement, asked the service psychologist to add formal testing.</p>" +
            "<table><thead><tr><th>Indicator</th><th>Finding</th></tr></thead><tbody>" +
            "<tr><td>Response style on rating scales</td><td>Uniform ceiling scores. CAARS 2 Negative Impression Index 9</td></tr>" +
            "<tr><td>Atypical endorsements</td><td>Climbing furniture, police involvement, trouble with authorities: none confirmed</td></tr>" +
            "<tr><td>Quality of examples</td><td>Criterion wording, no specific episodes</td></tr>" +
            "<tr><td>Consistency with records and informants</td><td>Contradicted by school reports, mother, girlfriend and employer</td></tr>" +
            "<tr><td>External incentive</td><td>Exam adjustments; named stimulant; previous non-prescribed use</td></tr>" +
            "<tr><td>Performance validity (psychologist)</td><td>TOMM Trial 1 37/50, Trial 2 39/50 (below 45 on Trial 2, the usual threshold for concern)</td></tr>" +
            "</tbody></table>" +
            "<p>The psychologist's note reads: <em>'Performance on this test is lower than is usually seen even in people with significant memory impairment. The results cannot be taken as a valid measure of his ability.'</em></p>" +
            "<p>Context: in adults referred for ADHD, 15-31% give non-credible responses on validity testing, and 14.6% of a Canadian student sample failed a symptom validity test. In one large clinic sample, 71% of people with suspect effort would have been diagnosed from the interview alone (Marshall 2016). Symptom validity and performance validity are separate, so both were checked (Ovsiew 2023).</p>",
          q: {
            q: "Which statement about these validity findings is most accurate?",
            options: [
              "Failing a performance validity test proves he does not have ADHD",
              "One raised validity index is enough to call him a malingerer in the report",
              "Validity testing is not appropriate in NHS practice and should not have been done",
              "Several independent indicators make his self-report unreliable. The report should describe the findings as non-credible without making a judgement about intent"
            ],
            a: 3,
            why: "Combining two or more independent validity failures keeps specificity high (Sollman 2010). A failed validity test means his own report cannot be relied on, not that ADHD is disproved: some people with genuine difficulties exaggerate to be heard. Here the decision rests on the independent collateral, which shows no childhood ADHD. 'Malingering' implies a judgement of deliberate intent for gain. Describe what you found ('non-credible', 'cannot be relied on') and the evidence for it. Checking validity is part of a careful assessment, not an accusation."
          }
        },
        {
          title: "Conclusion and feedback",
          html: "<h4>Formulation</h4><p>No credible evidence of childhood onset. Current symptoms were not established on interview. The self-report was non-credible on several independent indicators. His real difficulties are exam-related anxiety with severe sleep restriction around deadlines, made worse by hazardous drinking and non-prescribed stimulant use.</p>" +
            "<h4>Feedback (in the assessor's words)</h4><blockquote>'The information from school, your mum, your girlfriend and your manager doesn't show the lifelong pattern that ADHD needs. Some of the questionnaires also showed a way of answering that means I can't rely on them. That doesn't mean your difficulties aren't real. The stress and the lost sleep around exams clearly are, and we can help with those.'</blockquote>" +
            "<h4>Plan</h4><ul>" +
            "<li>Letter to the GP and, with consent, to student support: ADHD not diagnosed; exam-related anxiety described. The university can consider support for anxiety through its own processes.</li>" +
            "<li>Self-referral to NHS Talking Therapies for anxiety; sleep advice for deadline periods.</li>" +
            "<li>Brief alcohol advice (AUDIT 8 or more).</li>" +
            "<li>Stimulant harm reduction: lisdexamfetamine is a controlled drug, it carries cardiovascular risks without screening, and buying or borrowing it is not safe.</li>" +
            "<li>Written information, as NICE NG87 1.4.4 advises for people whose symptoms fall short of a diagnosis.</li></ul>",
          q: {
            q: "Oliver asks: 'But the Elvanse worked. Doesn't that prove I have ADHD?' What is the best answer?",
            options: [
              "Yes: a good response to a stimulant confirms the diagnosis",
              "No: stimulants sharpen focus in many people without ADHD, so a response is not a diagnostic test",
              "It depends on the dose he took",
              "Only if a QbTest confirms the response"
            ],
            a: 1,
            why: "Stimulants improve some cognitive measures in healthy adults, and in a classic study boys without ADHD responded to dextroamphetamine much as hyperactive boys did. Treatment response must therefore never be used as a diagnostic criterion. NICE HTG729 limits QbTest to ages 6 to 17; in adults it is a research tool."
          }
        }
      ],
      profile: {
        adultIA: 1, adultHI: 0, childIA: 0, childHI: 0,
        impairment: "Self-report claims severe impairment in every domain. Clinician-rated: mild, confined to exam and deadline periods (study). Work, relationships and daily life function well, confirmed by his employer and girlfriend."
      },
      answer: {
        conclusion: "ADHD not diagnosed. There is no credible evidence of childhood onset: contemporaneous school reports, his mother and his girlfriend all describe an organised, conscientious person. Current symptoms could not be established at interview, and the self-report was non-credible on several independent indicators (CAARS 2 Negative Impression Index 9, TOMM below threshold, atypical endorsements, inconsistency with records and informants). His difficulties are best explained by exam-related anxiety with sleep restriction, worsened by hazardous drinking and non-prescribed stimulant use.",
        codes: "No ADHD code. Exam-related anxiety documented (worry confined to assessments; criteria for generalised anxiety disorder not met at interview). Hazardous alcohol use (AUDIT 10) and non-prescribed stimulant use recorded.",
        ddx: [
          "Non-credible symptom report (feigning or exaggeration): present; drives the decision",
          "Exam-related (performance) anxiety: present; explains the recent concentration problems",
          "Sleep restriction from all-nighters: present; contributes",
          "Hazardous alcohol use (AUDIT 10): present; brief advice given",
          "Non-prescribed stimulant use: present; harm-reduction advice given",
          "Cannabis use: occasional (a few times a term; DAST-10 2); advice given",
          "Depression: absent (PHQ-9 9, no persistent low mood or loss of interest)",
          "Normal variation under academic pressure: part of the picture"
        ],
        teaching: [
          "Non-credible responding is common: 15-31% of adults referred for ADHD fail validity testing, and 14.6% of one student sample failed a symptom validity test. Checking validity is routine good practice, not an accusation.",
          "Self-report scales are easy to fake. Uniform ceiling scores, impairment in every domain and endorsement of rare or child-type behaviours are warning signs, not markers of severe ADHD.",
          "Weigh contemporaneous evidence (school reports, someone who knew the child, an employer) above retrospective self-rating. Adult recall of childhood ADHD has a low positive predictive value.",
          "High achievement does not exclude ADHD (UKAAN AQAS). What mattered here was not the grades but the consistent, positive descriptions of an organised child and adult.",
          "Use two or more independent validity indicators before calling a report non-credible, and describe the findings rather than the person's intent.",
          "A good response to a borrowed stimulant is not a diagnostic test: stimulants improve focus in people without ADHD.",
          "A negative assessment still needs a plan: blame-free feedback, help for anxiety and sleep, alcohol advice, stimulant harm reduction and written information (NICE NG87 1.4.4)."
        ]
      }
    },

    /* ================================================================== */
    /* c10  EUPD and ADHD: when both are present                            */
    /* ================================================================== */
    {
      id: "c10",
      title: "Not either-or: emotionally unstable personality disorder and ADHD",
      patient: "27-year-old nursery practitioner with a diagnosis of EUPD",
      tags: ["EUPD", "borderline personality disorder", "emotional dysregulation", "self-harm", "risk", "comorbidity", "women"],
      difficulty: 3,
      referral: "Care coordinator, community mental health team: 'Jade was diagnosed with emotionally unstable personality disorder at 20 after an overdose and a five-day admission. She completed 12 months of DBT at 23, and self-harm fell from weekly to rare. Despite this she remains very disorganised. She has lost two nursery jobs for lateness, has rent arrears and says her brain never stops. Jade has read about ADHD in women and asks whether her EUPD diagnosis was wrong. Current risk: passive thoughts of death at times; last self-harm (superficial cutting) five months ago. Medication: sertraline 100 mg. Please assess for ADHD.'",
      stages: [
        {
          title: "Pre-assessment questionnaires and risk screen",
          html: "<table><thead><tr><th>Measure</th><th>Result</th><th>Usual reading</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1</td><td>Part A 5/6. Sum 52/72</td><td>Part A positive at 4 or more</td></tr>" +
            "<tr><td>WURS-25</td><td>64/100</td><td>Above 46, but scores are also raised in BPD and bipolar disorder</td></tr>" +
            "<tr><td>MSI-BPD</td><td>8/10</td><td>7 or more suggests BPD</td></tr>" +
            "<tr><td>PHQ-9</td><td>14; item 9 = 1</td><td>Moderate (10 to 14)</td></tr>" +
            "<tr><td>GAD-7</td><td>12</td><td>Moderate</td></tr>" +
            "<tr><td>AUDIT</td><td>12 (two binges a week, 12 to 14 units each)</td><td>Increasing risk (8 to 15)</td></tr>" +
            "<tr><td>DAST-10</td><td>2</td><td>Low level</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Family, work, life skills, self-concept and social domains impaired</td><td>Domain rule met in 5 of 7</td></tr>" +
            "<tr><td>C-SSRS screen (clinician-asked)</td><td>Q1 yes (wished to be dead in the past month). Q2 no. Q6 lifetime yes (overdose at 20). Separately, superficial cutting without suicidal intent five months ago</td><td>A prompt for clinician enquiry, not a risk level</td></tr>" +
            "</tbody></table>" +
            "<p>Jade says: <em>'Some nights I think everyone would be better off without me. I'm not going to do anything. I've got my safety plan and my cat.'</em></p>",
          q: {
            q: "PHQ-9 item 9 is 1 and C-SSRS question 1 is positive. What should happen before the ADHD interview continues?",
            options: [
              "Nothing: passive thoughts are part of EUPD and need no action",
              "Use the C-SSRS colours to label her 'low risk' and record that in the plan",
              "Pause for a clinician-led conversation about current thoughts, plans, recent self-harm and what keeps her safe; review her safety plan; then continue if it is safe to do so",
              "Stop the ADHD assessment and refer to the crisis team"
            ],
            a: 2,
            why: "Any positive answer to a suicide item needs a clinician conversation the same day. NICE NG225 (1.6.1 to 1.6.3) says not to use risk tools or global low, medium or high labels to predict suicide or decide care, so the screen prompts enquiry rather than producing a level. Item 9 has a low positive predictive value for active ideation (about 29% in one study) because it includes passive thoughts. Here the thoughts are passive, there is no plan, she has a safety plan and a care coordinator, so the assessment can continue with the plan updated. Active intent or a plan would change that."
          }
        },
        {
          title: "History: building the life chart",
          html: "<p>The assessor drew a timeline with Jade, her records and (later) her mother.</p>" +
            "<table><thead><tr><th>Age</th><th>ADHD-type problems</th><th>Mood, relationships, self-harm</th></tr></thead><tbody>" +
            "<tr><td>4 to 11</td><td>Restless, chatty, unfinished work, lost belongings (school reports)</td><td>Happy at home; friends easily made</td></tr>" +
            "<tr><td>13</td><td>Same</td><td>Parents separate after years of arguments</td></tr>" +
            "<tr><td>14 to 16</td><td>GCSEs below predicted: 'talented but disorganised'</td><td>Self-harm begins after a first break-up</td></tr>" +
            "<tr><td>17 to 19</td><td>Childcare course finished a term late (missing portfolio pieces)</td><td>Intense, short relationships</td></tr>" +
            "<tr><td>20</td><td>Lost first nursery job (lateness)</td><td>Overdose after a break-up; admitted; EUPD diagnosed</td></tr>" +
            "<tr><td>21 to 23</td><td>Same</td><td>DBT for 12 months; self-harm falls to rare</td></tr>" +
            "<tr><td>24 to 25</td><td><strong>Late most weeks, lost keys or phone weekly, bills unpaid (partner did the admin)</strong></td><td><strong>Stable 18-month relationship; no self-harm; mood settled</strong></td></tr>" +
            "<tr><td>26 to 27</td><td>Second nursery job lost; rent arrears</td><td>Relationship ends; binge drinking; passive death wishes</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Which point on the life chart most strongly supports ADHD as an additional diagnosis, rather than her problems being part of EUPD?",
            options: [
              "Disorganisation, lateness and losing things continued through 18 months of stable mood, no self-harm and a secure relationship",
              "She has mood swings several times a day",
              "She binge drinks after arguments",
              "Her WURS-25 score is above 46"
            ],
            a: 0,
            why: "A core test for any differential is persistence without the other condition: are the ADHD symptoms present when mood and relationships are calm? Here they were. Mood swings and stress-triggered drinking occur in both conditions, and both are trait-like, so course alone does not separate them (Kooij 2019). WURS-25 scores are raised in BPD and bipolar disorder, so a high score cannot tell them apart."
          }
        },
        {
          title: "Interview findings: adulthood",
          html: "<p>Jade gave vivid, specific examples. Her symptoms were present when she was content as well as when upset.</p>" +
            "<table><thead><tr><th>Symptom</th><th>Example</th><th>Rating</th></tr></thead><tbody>" +
            "<tr><td>ia1 Careless mistakes</td><td>Manager recorded errors in the children's daily logs (wrong child's nappy times, missed messages to parents)</td><td>Yes</td></tr>" +
            "<tr><td>ia2 Sustaining attention</td><td>Drifts off in staff training within 10 minutes; cannot finish a magazine article</td><td>Yes</td></tr>" +
            "<tr><td>ia3 Not listening</td><td>Says her mind drifts mainly when she is upset</td><td>Unsure</td></tr>" +
            "<tr><td>ia4 Not finishing</td><td>Bedroom half-painted for a year; two online courses abandoned</td><td>Yes</td></tr>" +
            "<tr><td>ia5 Organising</td><td>No system for bills; rent arrears; misses rota changes</td><td>Yes</td></tr>" +
            "<tr><td>ia6 Avoiding effort</td><td>Starts things eagerly; no avoidance</td><td>No</td></tr>" +
            "<tr><td>ia7 Losing things</td><td>Keys or phone most weeks; bank card replaced three times this year</td><td>Yes</td></tr>" +
            "<tr><td>ia8 Distractible</td><td>Pulled away by any noise, notification or passing thought</td><td>Yes</td></tr>" +
            "<tr><td>ia9 Forgetful</td><td>Missed three CMHT appointments and a dentist this year</td><td>Yes</td></tr>" +
            "<tr><td>hi1 Fidgets</td><td>Jiggles her leg, picks her nails, seen throughout the interview</td><td>Yes</td></tr>" +
            "<tr><td>hi5 On the go</td><td>Cannot sit through a film; friends say she is 'exhausting'</td><td>Yes</td></tr>" +
            "<tr><td>hi6 Talks a lot</td><td>Colleagues tease her about it; she is aware and tries to stop</td><td>Yes</td></tr>" +
            "<tr><td>hi7 Blurts out</td><td>Finishes people's sentences; comments in staff meetings she regrets</td><td>Yes</td></tr>" +
            "<tr><td>hi9 Interrupts</td><td>Talks over her manager; joins other people's conversations</td><td>Yes</td></tr>" +
            "<tr><td>hi2, hi3, hi4, hi8</td><td>Can stay seated; queues without problem; no clear examples</td><td>No or unsure</td></tr>" +
            "</tbody></table>" +
            "<h4>Two kinds of impulsivity</h4><table><thead><tr><th>Fits ADHD</th><th>Fits EUPD</th></tr></thead><tbody>" +
            "<tr><td>Buys things online when bored, in any mood</td><td>Cutting after a perceived rejection</td></tr>" +
            "<tr><td>Says things without thinking at work</td><td>Texting an ex 40 times in a night, terrified he is with someone else</td></tr>" +
            "<tr><td>Frustration at lost keys settles within an hour</td><td>Distress after a rejection lasts one to two days</td></tr>" +
            "</tbody></table>" +
            "<p>EUPD features are also clear: fear of abandonment, swings between idealising and devaluing partners, <em>'I become whoever I'm with'</em>, chronic emptiness, and feeling unreal under severe stress.</p>",
          q: {
            q: "Her distress after a perceived rejection lasts one to two days, while frustration at lost keys settles within an hour. How does this help?",
            options: [
              "It does not help: emotional dysregulation is identical in both conditions",
              "The long episodes prove bipolar disorder",
              "Only the short episodes count, so the EUPD diagnosis should be removed",
              "Brief reactivity to everyday frustrations fits ADHD; prolonged, interpersonally triggered distress with fear of abandonment fits EUPD. One person can show both patterns"
            ],
            a: 3,
            why: "Kooij 2019 describes ADHD emotional reactivity as short-lived and triggered by daily events, with a rapid return to baseline within a few hours. EUPD distress is driven by interpersonal threat, abandonment fear and identity disturbance, and lasts longer. Bipolar disorder needs sustained episodes of days to weeks with a change from usual self, such as reduced need for sleep. Seeing both patterns supports two conditions, not one replacing the other."
          }
        },
        {
          title: "Childhood and collateral",
          html: "<p>Jade's mother kept her primary school reports. Their relationship is strained, but she agreed to a phone call.</p>" +
            "<ul><li>Age 6: 'Jade is a bright, chatty girl. She finds it very hard to stay in her seat and her work is often left unfinished.'</li>" +
            "<li>Age 8: 'Jade's mind wanders and she needs frequent reminders. She has lost her reading folder three times this term.'</li>" +
            "<li>Age 10: 'Lively and kind. Jade calls out and struggles to wait her turn.'</li></ul>" +
            "<blockquote>Mother: 'From when she could walk she never stopped. She'd lose a shoe on the way to school. That was years before all the trouble with boys and the cutting.'</blockquote>" +
            "<p>She made friends easily as a child and lost some through blurting things out. No early social-communication differences, no rigid routines, no sensory distress. Childhood tally: inattention 6, hyperactivity-impulsivity 6. Collateral rating: parent 2, school 2 (clear support).</p>",
          q: {
            q: "Why are the primary school reports especially valuable here?",
            options: [
              "Because school reports are always more accurate than parents",
              "Because they record ADHD symptoms years before adolescence, before the self-harm and relationship instability began, so the symptoms cannot simply be the later personality disorder",
              "Because they prove she never had EUPD"
            ],
            a: 1,
            why: "A practical decision rule (built from Kooij 2019 and CADDRA): attentional and impulsive symptoms are better explained by BPD when they are confined to emotional crises and there is no childhood ADHD; ADHD is co-occurring when childhood-onset inattention and hyperactivity are present outside crises. Reports from ages 6 to 10, before the parental separation and the first self-harm, meet that test. They say nothing against EUPD, whose features emerged later and are still present."
          }
        },
        {
          title: "Differentials and comorbidity",
          html: "<table><thead><tr><th>Condition</th><th>Findings</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>EUPD</td><td>Abandonment fear, identity disturbance, emptiness, interpersonally triggered self-harm, stress-related dissociation; MSI-BPD 8</td><td>Present: co-occurring</td></tr>" +
            "<tr><td>Bipolar disorder</td><td>No periods of elevated mood, reduced need for sleep or grandiosity; her sleep problem is lifelong difficulty switching off</td><td>Absent</td></tr>" +
            "<tr><td>Depression</td><td>PHQ-9 14, but 5 points come from sleep, concentration and restlessness items she describes as lifelong. Reactive low mood since the break-up; still enjoys friends and her cat</td><td>No current depressive episode; GP to keep sertraline under review</td></tr>" +
            "<tr><td>Generalised anxiety</td><td>GAD-7 12. Worry centres on rent arrears, work and the break-up. No long-standing, free-floating worry across many areas</td><td>Anxiety tied to current stresses; not generalised anxiety disorder at present; review</td></tr>" +
            "<tr><td>Alcohol and drugs</td><td>AUDIT 12; binges after arguments; no withdrawal or morning drinking. Cannabis at a few parties a year (DAST-10 2)</td><td>Hazardous drinking: brief intervention. Cannabis: advice</td></tr>" +
            "<tr><td>PTSD</td><td>No traumatic events reported; trauma screen negative</td><td>Absent</td></tr>" +
            "<tr><td>Autism</td><td>AQ-10 3; easy early friendships</td><td>Absent</td></tr>" +
            "<tr><td>Thyroid disease</td><td>TFTs normal (GP, last month)</td><td>Absent</td></tr>" +
            "<tr><td>Validity</td><td>Specific examples; collateral agrees; no request for a named medicine</td><td>No concerns</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Her PHQ-9 is 14. What is the best way to read it in this assessment?",
            options: [
              "She has a moderate depressive episode that explains all her symptoms, so ADHD should not be diagnosed",
              "PHQ-9 scores are not valid in people with EUPD",
              "Look at which items drive the score: sleep, concentration and restlessness overlap with ADHD. Ask whether each is a change from her usual self. Here the interview finds reactive low mood without a depressive episode",
              "Scores under 16 can be ignored, according to NICE NG222"
            ],
            a: 2,
            why: "PHQ-9 items 3 (sleep), 7 (concentration) and 8 (restlessness) can be driven by ADHD itself, so ask 'Is this new, or how you have always been?' A total score is a severity guide, not a diagnosis. NICE NG222 uses 16 as the line between less and more severe depression, not as a threshold below which symptoms can be ignored."
          }
        },
        {
          title: "Conclusion and plan",
          html: "<h4>Formulation</h4><p>Two separate, trait-like conditions. ADHD symptoms began in early childhood and persist in calm periods. EUPD features began in adolescence and are driven by interpersonal threat. Each makes the other harder: ADHD impulsivity adds to risk in a crisis, and chaos from ADHD feeds shame and rejection sensitivity.</p>" +
            "<h4>Plan</h4><ul>" +
            "<li>Psychoeducation about both conditions, framed as 'and', not 'instead of'.</li>" +
            "<li>Safety plan updated with the care coordinator. Brief alcohol intervention.</li>" +
            "<li>Environmental modifications at work with her consent: written handovers, phone reminders for the rota, a checklist for daily logs.</li>" +
            "<li>Before any medication: the NICE NG87 1.7.4 baseline (history, current medicines, height, weight, pulse, blood pressure, cardiovascular assessment) and a review of substance misuse and diversion risk.</li>" +
            "<li>If impairment persists after modifications, offer medication (NICE NG87 1.5.15). Agree supply quantities and monitoring with the CMHT because of the overdose history and binge drinking.</li>" +
            "<li>DBT skills and CMHT care continue. ADHD treatment does not replace EUPD care.</li>" +
            "<li>Driving: she must tell the DVLA only if ADHD or its medication affects her ability to drive safely.</li></ul>",
          q: {
            q: "Jade asks: 'So was the EUPD diagnosis wrong?' Which reply is most accurate?",
            options: [
              "'No. Some of your difficulties, like disorganisation and restlessness, are ADHD and started when you were small. Others, like the fear of being left, the emptiness and self-harm when relationships are threatened, fit EUPD. You can have both, and each needs its own help.'",
              "'Yes. ADHD explains everything, so the EUPD diagnosis should be removed.'",
              "'We can't say anything until you have stopped sertraline.'",
              "'EUPD and ADHD cannot be diagnosed together under DSM-5-TR.'"
            ],
            a: 0,
            why: "Both can be diagnosed when each meets criteria independently, and CADDRA advises treating them as separate problems: improving ADHD does not resolve BPD. Kooij 2019 adds that emotional instability may improve with ADHD treatment, so the two can be treated together. Removing a valid diagnosis would lose access to EUPD care, and stopping an antidepressant is not needed to assess ADHD."
          }
        }
      ],
      profile: {
        adultIA: 7, adultHI: 5, childIA: 6, childHI: 6,
        impairment: "Moderate at work (two nursery jobs lost for lateness; errors in daily logs), in daily life and money (rent arrears, bank card replaced three times), in relationships and in self-image. Present across settings, including during an 18-month stable period."
      },
      answer: {
        conclusion: "ADHD, combined presentation, moderate, co-occurring with emotionally unstable (borderline) personality disorder. ADHD symptoms were recorded at primary school, years before adolescence and before the self-harm began, and they persisted through 18 months of stable mood and relationships. EUPD remains a valid diagnosis: abandonment fear, identity disturbance, chronic emptiness and interpersonally triggered self-harm are not explained by ADHD.",
        codes: "ADHD combined presentation: DSM-5-TR F90.2; ICD-11 6A05.2. EUPD: ICD-11 personality disorder (severity as judged by the treating team, for example 6D10.1 moderate) with the borderline pattern specifier 6D11.5; DSM-5-TR borderline personality disorder (F60.3).",
        ddx: [
          "Emotionally unstable (borderline) personality disorder: present; co-occurring",
          "Bipolar disorder: absent (no episodes of elevated mood or reduced need for sleep)",
          "Depression: reactive low mood without a current depressive episode at interview",
          "Hazardous alcohol use (AUDIT 12): present; brief intervention",
          "Cannabis: occasional (DAST-10 2); not a disorder",
          "Generalised anxiety disorder: not met; anxiety (GAD-7 12) is tied to current stresses; review",
          "PTSD: trauma screen negative",
          "Autism: no early social-communication differences (AQ-10 3)",
          "Thyroid disease: TFTs normal",
          "Non-credible report: no concerns (specific examples, collateral agrees)"
        ],
        teaching: [
          "EUPD and ADHD often co-occur: lifetime BPD was 33.7% in adults with ADHD against 5.2% in the general population (NESARC, cited by CADDRA). Ask about ADHD in every EUPD referral and about EUPD in every ADHD referral.",
          "Both conditions are trait-like, so course alone does not separate them. Look for ADHD symptoms in primary school, before adolescence, and in periods when mood and relationships were stable.",
          "Pointers to EUPD: fear of abandonment, identity disturbance, chronic emptiness, recurrent self-harm and stress-related dissociation. Pointers to ADHD: short-lived reactivity, impulsivity in any mood, and inattention when calm.",
          "Screens overlap: the WURS-25 is raised in BPD, and the MSI-BPD contains items ADHD can drive. Use them as prompts, not decisions.",
          "Answer suicide-related screen items with a clinician-led conversation and a safety plan; do not turn a screen into a risk level (NICE NG225 1.6.1 to 1.6.3).",
          "When both are present, say so plainly. ADHD treatment does not replace EUPD care, and EUPD does not rule out ADHD treatment.",
          "Plan medication with overdose and alcohol risk in mind: complete the NICE NG87 1.7.4 baseline and agree supply and monitoring with the care team."
        ]
      }
    },

    /* ================================================================== */
    /* c11  Complex PTSD and developmental trauma                           */
    /* ================================================================== */
    {
      id: "c11",
      title: "Attention or alarm? Developmental trauma and complex PTSD",
      patient: "34-year-old healthcare assistant who grew up partly in foster care",
      tags: ["complex PTSD", "developmental trauma", "care-experienced", "trauma-informed", "dissociation", "not ADHD"],
      difficulty: 3,
      referral: "GP letter: 'Danielle, 34, is a healthcare assistant on an orthopaedic ward. She reports poor concentration, forgetfulness at work, irritability and poor sleep, for as long as she can remember. She has had two informal warnings for snapping at colleagues. A friend with ADHD suggested she might have it. ASRS Part A positive (4/6). She was in foster care from age 9 after neglect and domestic abuse at home. Depression treated with citalopram in the past (stopped two years ago). She has a 7-year-old son. She is keen to try medication.'",
      stages: [
        {
          title: "Pre-assessment questionnaires",
          html: "<table><thead><tr><th>Measure</th><th>Result</th><th>Usual reading</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1</td><td>Part A 4/6. Sum 44/72</td><td>Part A positive at 4 or more</td></tr>" +
            "<tr><td>WURS-25</td><td>59/100 (highest on anxious, sad, low opinion of self and temper items)</td><td>Above 46; mood and temper items drive many scores</td></tr>" +
            "<tr><td>PC-PTSD-5</td><td>Trauma exposure yes; 5/5</td><td>Positive at 4 or more (3 is often used for women)</td></tr>" +
            "<tr><td>PCL-5</td><td>54/80 (clusters: B 15, C 7, D 18, E 14)</td><td>31 to 33 suggests probable PTSD</td></tr>" +
            "<tr><td>ITQ</td><td>PTSD items met (re-experiencing, avoidance, sense of threat, with impairment). Disturbances in self-organisation met (affect dysregulation, negative self-concept, relationship difficulties, with impairment)</td><td>By the ITQ algorithm this pattern indicates complex PTSD. The ITQ uses no cut-off scores</td></tr>" +
            "<tr><td>Adverse Childhood Experiences questionnaire</td><td>7 of 10</td><td>A count only; no diagnostic cut-off</td></tr>" +
            "<tr><td>PHQ-9</td><td>12; item 9 = 0</td><td>Moderate</td></tr>" +
            "<tr><td>GAD-7</td><td>14</td><td>Moderate</td></tr>" +
            "<tr><td>AUDIT</td><td>7 (wine to get to sleep two or three nights a week)</td><td>Low risk (0 to 7)</td></tr>" +
            "<tr><td>DAST-10</td><td>0</td><td>None</td></tr>" +
            "</tbody></table>",
          q: {
            q: "The ITQ indicates complex PTSD and the ASRS Part A is positive. What is the best next step?",
            options: [
              "Diagnose complex PTSD and stop: a positive trauma screen rules out ADHD",
              "Diagnose ADHD: the ASRS is positive and trauma is common in ADHD",
              "Ask her to repeat both screens in a month and use the average",
              "Treat both screens as hypotheses. Use a trauma-informed interview, a timeline and records to test whether attention problems predate the trauma, persist in safe settings, or are driven by intrusions, threat and dissociation"
            ],
            a: 3,
            why: "Screens cannot make the differential. The ASRS has low specificity in clinical groups, and many PCL-5 cluster E items (irritability, concentration, sleep, risk-taking) overlap with ADHD. CADDRA notes that a trauma history does not automatically preclude ADHD, and NICE NG87 1.2.1 lists looked-after children as a higher-prevalence group, so ADHD must be tested properly, not dismissed. The tests that separate them are onset, change with safety, where attention goes, and collateral."
          }
        },
        {
          title: "A trauma-informed interview and history",
          html: "<p>The assessor explained the purpose, offered breaks, and said Danielle did not need to describe what happened in detail. She chose the chair facing the door.</p>" +
            "<h4>History</h4><ul>" +
            "<li>Ages 0 to 9: neglect and domestic abuse by her mother's partner. Child protection plan from age 5.</li>" +
            "<li>Age 9 to 18: one long-term foster placement with a carer she still sees weekly.</li>" +
            "<li>Six GCSEs, then an NVQ in care. Eleven years on hospital wards. Her ward manager writes: 'Danielle never misses an observation. Her charts are the best on the ward.'</li>" +
            "<li>Two controlling relationships; she left the last, which involved violence, at 30. Now single with her son.</li></ul>" +
            "<h4>Current difficulties</h4><ul>" +
            "<li>Nightmares three or four nights a week. Flashbacks triggered by men shouting or the smell of alcohol on someone's breath.</li>" +
            "<li>Avoids the estate where she grew up. Startles easily. Sits where she can see exits.</li>" +
            "<li>'I feel dirty and worthless. I don't trust anyone except Pat (foster carer) and my sister.'</li>" +
            "<li>Snaps when she feels cornered, 'then I go cold and shut down for hours'.</li>" +
            "<li>'When it's loud on the ward or a patient's relative shouts, I lose bits of time. I come back and don't know what I was doing.'</li></ul>",
          q: {
            q: "Danielle loses focus 'when it's loud or someone shouts' and then 'comes back' unsure what she was doing. Which question best discriminates?",
            options: [
              "'Do you find films boring?'",
              "'When your focus goes, where does your mind go: to something more interesting around you, or to memories, danger, or a blank, far-away feeling?'",
              "'Would you like to try medication to see if it helps?'",
              "'Did anyone in your family have ADHD?'"
            ],
            a: 1,
            why: "In ADHD, distraction is usually outward (noise, interest, novelty) or mind-wandering to unrelated thoughts. In PTSD, attention is captured by threat cues and intrusive memories, and dissociation produces blank spells and lost time. A medication trial is not a diagnostic test. Family history changes the prior probability but does not discriminate in the individual."
          }
        },
        {
          title: "Interview findings: adulthood",
          html: "<table><thead><tr><th>Symptom</th><th>What she describes</th><th>Pattern</th></tr></thead><tbody>" +
            "<tr><td>ia2 Sustaining attention</td><td>Loses track of handovers on noisy days. At home in the quiet she reads novels for hours</td><td>Only with threat cues or after nightmares</td></tr>" +
            "<tr><td>ia3 Not listening</td><td>Colleagues say she 'glazes over' when voices are raised</td><td>Dissociation under stress</td></tr>" +
            "<tr><td>ia8 Distractible</td><td>'I clock every door and every man in the room'</td><td>Hypervigilance, not interest-driven</td></tr>" +
            "<tr><td>ia9 Forgetful</td><td>Forgets things mostly since leaving her ex-partner; manages with lists</td><td>Started in adulthood; worse after bad nights</td></tr>" +
            "<tr><td>ia1, ia4, ia5, ia6, ia7</td><td>Meticulous, finishes everything, colour-coded system at home and work, rarely loses anything</td><td>Absent</td></tr>" +
            "<tr><td>hi1 Fidgets</td><td>Picks her nails when anxious</td><td>Only when anxious</td></tr>" +
            "<tr><td>hi5 Restless</td><td>'I can't relax. I'm always on guard.'</td><td>Hyperarousal</td></tr>" +
            "<tr><td>Other HI items</td><td>No blurting, interrupting or impatience; quiet in groups</td><td>Absent</td></tr>" +
            "</tbody></table>" +
            "<p>On a week's holiday in a caravan with her son and sister: <em>'I was fine. I read two books and I didn't forget a thing.'</em></p>" +
            "<p>Endorsed (before the trait test): inattention 4, hyperactivity-impulsivity 2. All are state-dependent.</p>",
          q: {
            q: "Which finding most strongly favours complex PTSD over ADHD as the explanation for her current inattention?",
            options: [
              "Her attention and organisation are excellent in safe, predictable settings, and lapses occur with threat cues and dissociation",
              "She has nightmares",
              "She is irritable at work",
              "She has had depression"
            ],
            a: 0,
            why: "ADHD inattention is present in neutral and good states as well as bad ones. Inattention that switches on with threat and off with safety, alongside excellent organisation, points to a state-driven cause. Nightmares support PTSD but do not show what drives her inattention. Irritability and past depression occur in both conditions."
          }
        },
        {
          title: "Childhood, records and collateral",
          html: "<p>With consent, the assessor obtained her social care file and school reports from the local authority, and spoke to her foster carer.</p>" +
            "<h4>Before the placement (ages 6 to 8)</h4><ul>" +
            "<li>'Danielle often arrives tired and hungry. She is quiet and watchful and finds it hard to concentrate.'</li>" +
            "<li>'Attendance 78%. Startles at loud noises and sometimes seems far away.'</li></ul>" +
            "<h4>After the placement (ages 10 to 16)</h4><ul>" +
            "<li>Age 10: 'Danielle has settled well. Her concentration has improved enormously and she is now reading at the expected level.'</li>" +
            "<li>Age 11: 'A conscientious pupil. Her written work is neat and careful.'</li>" +
            "<li>Secondary: 'Reliable, hard-working and quiet.'</li></ul>" +
            "<blockquote>Foster carer: 'When she came to us she was jumpy, wouldn't sleep with the light off and watched the door. Within a year she'd sit at the kitchen table doing homework for an hour. She loved lists. She was never a fidget or a chatterbox. The opposite.'</blockquote>" +
            "<p>Childhood tally: inattention 3 (sustaining attention, seeming not to listen, distractibility, ages 6 to 8 only), hyperactivity-impulsivity 0.</p>",
          q: {
            q: "There is no 'pre-trauma' period to compare with, because the adversity began in early childhood. What is the most useful evidence instead?",
            options: [
              "None: without a pre-trauma period, ADHD must be diagnosed if any symptoms were present before 12",
              "Her own memory of whether she was restless as a toddler",
              "Whether symptoms changed when her environment became safe and stable. Here school and foster-carer reports show a clear improvement in concentration after the placement",
              "A QbTest to measure her attention objectively"
            ],
            a: 2,
            why: "When trauma starts in early childhood, look for change with safety. Attention that improves markedly once a child is safe, with no hyperactivity at any age, points away from ADHD. Where the picture stays unclear, record 'uncertain' and reassess after trauma treatment (clinical practice). Recall of the toddler years is unreliable, and NICE HTG729 recommends QbTest only for ages 6 to 17."
          }
        },
        {
          title: "Differentials and synthesis",
          html: "<table><thead><tr><th>Condition</th><th>Findings</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>Complex PTSD (ICD-11)</td><td>Prolonged, inescapable trauma; re-experiencing in the present, avoidance, sense of current threat; plus affect dysregulation, shame and worthlessness, and relationship difficulties</td><td>Present: better explains the attention symptoms</td></tr>" +
            "<tr><td>ADHD</td><td>No hyperactivity at any age; inattention only during danger in childhood and with threat or dissociation now; excellent organisation when safe</td><td>Not supported</td></tr>" +
            "<tr><td>EUPD</td><td>Affect dysregulation and relationship problems, but no identity disturbance, abandonment fear or self-harm</td><td>Not supported; the ITQ disturbances in self-organisation fit better</td></tr>" +
            "<tr><td>Depression</td><td>PHQ-9 12; low mood and shame are long-standing parts of the trauma picture; no distinct episode at present</td><td>Monitor; GP review</td></tr>" +
            "<tr><td>Generalised anxiety</td><td>Anxiety is threat-driven hyperarousal rather than free-floating worry</td><td>Part of complex PTSD</td></tr>" +
            "<tr><td>Bipolar disorder</td><td>No periods of elevated mood, reduced need for sleep or overactivity. Irritability is brief and triggered by feeling cornered</td><td>Absent</td></tr>" +
            "<tr><td>Alcohol</td><td>AUDIT 7; wine to get to sleep</td><td>Advice given</td></tr>" +
            "<tr><td>Sleep, thyroid</td><td>Sleep broken by nightmares; no snoring; TFTs normal</td><td>Explained by PTSD</td></tr>" +
            "<tr><td>Safeguarding</td><td>Her son is thriving at school; she is a warm, consistent parent</td><td>No concerns; parenting is a strength</td></tr>" +
            "</tbody></table>",
          q: {
            q: "How should the ADHD outcome be recorded?",
            options: [
              "ADHD excluded permanently: trauma always explains attention problems",
              "ADHD not diagnosed: current symptoms are better explained by complex PTSD. Reassess if attention and organisation problems persist after effective trauma-focused treatment",
              "Other specified ADHD, because she has four inattentive symptoms",
              "ADHD, predominantly inattentive presentation, with co-occurring complex PTSD"
            ],
            a: 1,
            why: "DSM-5-TR criterion E and the ICD-11 boundary with PTSD both require that the symptoms are not better explained by another disorder. Here they are. Other specified ADHD is for impairing ADHD-type symptoms that are not better explained by something else, so it does not fit. Leaving a review point is honest: trauma and ADHD can co-exist, and the picture should be looked at again if problems persist after effective treatment."
          }
        },
        {
          title: "Feedback and plan",
          html: "<blockquote>'Your brain learned very early that the world was dangerous, and it is still on alert. When something reminds it of danger, attention goes to the threat, or it switches off to protect you. That is why you lose focus on loud days but read for hours in a quiet room. It is not ADHD, and it is treatable.'</blockquote>" +
            "<ul><li>Referral for trauma-focused psychological therapy (NICE NG116 recommends trauma-focused psychological treatments for PTSD), with time to build trust and stabilise first.</li>" +
            "<li>GP to review mood and sleep; advice about alcohol as a sleep aid.</li>" +
            "<li>Occupational health: permission to step away briefly when triggered; quieter tasks during visiting hours where possible.</li>" +
            "<li>She asked about ADHD medication. The assessor explained why it is not indicated and that the door stays open for review after treatment.</li>" +
            "<li>Written information about the outcome and local trauma services (NICE NG87 1.4.4).</li></ul>"
        }
      ],
      profile: {
        adultIA: 4, adultHI: 2, childIA: 3, childHI: 0,
        impairment: "Counts are the items endorsed before the trait test. All are state-dependent (threat cues, dissociation, after nightmares) and none is counted towards ADHD once that is taken into account. Moderate impairment at work (two warnings for irritability) and in close relationships; daily organisation and parenting are strengths."
      },
      answer: {
        conclusion: "ADHD not diagnosed. Her current inattention, forgetfulness and irritability are better explained by complex PTSD after prolonged childhood neglect and domestic abuse and later intimate partner violence. In childhood, attention was poor only during the years of danger and improved markedly once she was safe; there was never hyperactivity. As an adult she is highly organised except when triggered or dissociating. ADHD can be reconsidered if problems persist after effective trauma treatment.",
        codes: "Complex post-traumatic stress disorder: ICD-11 6B41. DSM-5-TR has no complex PTSD category; under DSM-5-TR she meets criteria for PTSD (F43.10). No ADHD code.",
        ddx: [
          "Complex PTSD: present; better explains the attention symptoms",
          "Depression: long-standing low mood and shame within the trauma picture; no distinct episode now; GP to monitor",
          "Emotionally unstable personality disorder: considered; no identity disturbance, abandonment fear or self-harm",
          "Generalised anxiety disorder: anxiety is threat-driven hyperarousal rather than free-floating worry",
          "Bipolar disorder: no episodes of elevated mood or reduced need for sleep",
          "Alcohol: AUDIT 7, used to get to sleep; advice given",
          "Autism: not suggested by history",
          "Thyroid disease: TFTs normal"
        ],
        teaching: [
          "Trauma and ADHD are linked in both directions, and NICE NG87 1.2.1 lists looked-after children as a higher-prevalence group. Take ADHD seriously in care-experienced adults, and take trauma seriously in every ADHD referral.",
          "Ask where attention goes: outward to noise and interest (ADHD), or to memories, threat and blankness (PTSD and dissociation).",
          "When adversity began in early childhood there is no pre-trauma window. Look instead for change with safety: marked improvement after a stable placement points away from ADHD.",
          "No hyperactivity at any age and excellent organisation in safe settings are strong evidence against ADHD as the main explanation.",
          "Apply the ITQ algorithm exactly: disturbances in self-organisation count only when PTSD criteria are met, which protects against relabelling ADHD emotional dysregulation as complex PTSD.",
          "Interview in a trauma-informed way: explain, offer choice and breaks, and do not ask for trauma details you do not need.",
          "Record 'better explained by' with a review point, not 'ADHD excluded for ever'."
        ]
      }
    },

    /* ================================================================== */
    /* c12  Subthreshold presentation: Other specified ADHD                 */
    /* ================================================================== */
    {
      id: "c12",
      title: "Four symptoms and a real problem: Other specified ADHD",
      patient: "41-year-old British Pakistani IT project manager and father of three",
      tags: ["subthreshold", "other specified ADHD", "partial remission", "DSM-5-TR and ICD-11", "culture", "interpreter", "family history"],
      difficulty: 2,
      referral: "GP letter: 'Imran's 9-year-old son was diagnosed with ADHD in the spring, and Imran recognises himself in the leaflets. He says he has always been disorganised, and he is now on a performance improvement plan at work after missed project deadlines. His wife is frustrated by forgotten commitments. No mental health history. He does not drink or use drugs. BP 132/84, pulse 74. ASRS Part A 4/6. Please assess.'",
      stages: [
        {
          title: "Pre-assessment questionnaires",
          html: "<table><thead><tr><th>Measure</th><th>Result</th><th>Usual reading</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1</td><td>Part A 4/6. Sum 38/72</td><td>Part A positive at 4 or more</td></tr>" +
            "<tr><td>WURS-25</td><td>38/100</td><td>Published cut-offs 36 and 46</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Work impaired (three items rated 2: duties, efficiency, poor evaluations; mean 1.6). Family impaired (two items rated 2). Other domains not impaired</td><td>Two domains meet the rule</td></tr>" +
            "<tr><td>PHQ-9</td><td>6</td><td>Mild</td></tr>" +
            "<tr><td>GAD-7</td><td>7</td><td>Mild</td></tr>" +
            "<tr><td>AUDIT-C / DAST-10</td><td>0 / 0</td><td>No alcohol or drug use</td></tr>" +
            "<tr><td>STOP-Bang (clinician-completed)</td><td>2 (snores; male)</td><td>Low risk (0 to 2)</td></tr>" +
            "<tr><td>Epworth Sleepiness Scale</td><td>7</td><td>Normal range (0 to 10)</td></tr>" +
            "<tr><td>AQ-10</td><td>2</td><td>Below 6</td></tr>" +
            "</tbody></table>",
          q: {
            q: "His WURS-25 is 38. What does this tell you?",
            options: [
              "Childhood ADHD is confirmed, because the score is above 36",
              "Childhood ADHD is excluded, because the score is below 46",
              "It sits between the two published cut-offs (36 and 46). It is a prompt to look for contemporaneous childhood evidence, not a decision"
            ],
            a: 2,
            why: "The WURS-25 is a retrospective self-rating. Ward 1993 reported 46 or more as the original cut-off and 36 or more as an alternative with higher sensitivity. Retrospective recall has a low positive predictive value, and many WURS items tap mood and temper rather than ADHD. A middling score tells you to go and find school reports and an informant who knew him as a child."
          }
        },
        {
          title: "History and cultural context",
          html: "<ul><li>Born in Bradford; parents came from Mirpur. Eldest son, with family expectations to succeed.</li>" +
            "<li>Did well at school 'by cramming the night before'. Computing degree with two resits.</li>" +
            "<li>Fifteen years as a developer: <em>'Coding suited me. Short problems, instant feedback, headphones on.'</em></li>" +
            "<li>Promoted to project manager two years ago. The job is now timelines, documents, meetings and chasing other people. Deadlines slipped within months.</li>" +
            "<li>Compensation: works until 1 am to catch up; his wife runs all household admin and the family calendar.</li>" +
            "<li>Family history: son diagnosed with ADHD; his younger brother 'was exactly like my son'.</li>" +
            "<li>His mother speaks Pahari-Pothwari and some English. She was wary at first: <em>'We don't use these labels.'</em> She agreed to talk, through a professional interpreter, when the assessor explained it might also help her grandson.</li></ul>",
          q: {
            q: "His difficulties became impairing only after a promotion at 39. How should this shape your thinking about onset?",
            options: [
              "Rising demands can unmask long-standing traits that were compensated before. Look for several symptoms before 12, even if impairment came later",
              "Onset at 39 means ADHD is impossible",
              "Later impairment proves the problems are caused by work stress alone",
              "Onset does not matter in adults under NICE"
            ],
            a: 0,
            why: "DSM-5-TR criterion B asks for several symptoms before 12, not impairment before 12. The Australian guideline notes that inattentive symptoms may only become apparent as demands increase, and that compensation can mask symptoms. NICE NG87 1.3.3 says not to exclude someone because the time of onset is uncertain, but onset still has to be explored. Work stress is a differential to test, not an assumption."
          }
        },
        {
          title: "Interview findings: adulthood",
          html: "<table><thead><tr><th>Symptom</th><th>Example</th><th>Rating</th></tr></thead><tbody>" +
            "<tr><td>ia2 Sustaining attention</td><td>Drifts off in hour-long steering meetings; rereads project reports three times</td><td>Yes</td></tr>" +
            "<tr><td>ia4 Not finishing</td><td>Status reports left half-written; garage conversion started three years ago</td><td>Yes</td></tr>" +
            "<tr><td>ia5 Organising</td><td>No reliable system for the project plan; two missed milestones this year</td><td>Yes</td></tr>" +
            "<tr><td>ia9 Forgetful</td><td>Forgot school pick-up twice; misses calls he promised to return</td><td>Yes</td></tr>" +
            "<tr><td>ia1 Careless mistakes</td><td>Errors in documents, but a colleague proofreads everything; unsure it is more than peers</td><td>Unsure</td></tr>" +
            "<tr><td>ia8 Distractible</td><td>Only in the open-plan office; fine at home</td><td>Unsure</td></tr>" +
            "<tr><td>ia3, ia6, ia7</td><td>Listens well one to one; starts hard tasks readily; keys always on the hook since his teens and rarely loses things</td><td>No</td></tr>" +
            "<tr><td>hi1 Fidgets</td><td>Leg jiggling and pen clicking; colleagues have commented</td><td>Yes</td></tr>" +
            "<tr><td>hi5 On the go</td><td>Uncomfortable through long family dinners; always has to be doing something</td><td>Yes</td></tr>" +
            "<tr><td>hi7 Blurts out</td><td>Finishes people's sentences; raised at his last two appraisals</td><td>Yes</td></tr>" +
            "<tr><td>hi2, hi3, hi4, hi6, hi8, hi9</td><td>No clear examples</td><td>No</td></tr>" +
            "</tbody></table>" +
            "<p>His wife, by phone: <em>'He's lovely, but I feel like his PA. If it isn't in the calendar, it doesn't happen.'</em></p>" +
            "<p>Adult tally: inattention 4, hyperactivity-impulsivity 3. Impairment: moderate at work and in family life; mild in daily life.</p>",
          q: {
            q: "He has 4 inattentive and 3 hyperactive-impulsive adult symptoms, with moderate impairment at work and at home. Which statement is correct under DSM-5-TR?",
            options: [
              "Criterion A is met, because adults need only 4 symptoms",
              "He meets ADHD in partial remission",
              "He has no disorder, so he should be discharged without information",
              "Criterion A is not met: from age 17, 5 symptoms are needed in at least one domain. If the other criteria fit, consider Other specified ADHD and record the reason"
            ],
            a: 3,
            why: "DSM-5 lowered the adult threshold from 6 to 5 for age 17 and over, and DSM-5-TR kept it. Kooij 2019 notes evidence that 4 current symptoms may be the best adult cut-off, but DSM-5 chose 5. Other specified ADHD covers impairing ADHD-type symptoms that fall short of full criteria, with the reason recorded (for example 'insufficient symptoms'). NICE NG87 1.4.4 says people who fall short of a diagnosis may still benefit from information."
          }
        },
        {
          title: "Childhood and collateral",
          html: "<p>His mother, through a professional interpreter (not a family member):</p>" +
            "<blockquote>'He was a good boy, but always in a rush. He would start his homework and run out to play cricket. Teachers said he talked too much and didn't finish his work. I checked his homework every night.'</blockquote>" +
            "<p>His older sister: <em>'He lost marks for silly mistakes. He wasn't wild, just scattered. Mum kept him on track.'</em></p>" +
            "<p>His mother found two primary school reports in a trunk:</p><ul>" +
            "<li>Age 8: 'Imran is capable, but his work is often incomplete.'</li>" +
            "<li>Age 10: 'Imran is easily distracted and would achieve more if he checked his work. He enjoys chatting to friends, sometimes when he should be listening.'</li></ul>" +
            "<p>Childhood tally: inattention 4 (careless mistakes, sustaining attention, not finishing, distractibility), hyperactivity-impulsivity 2 (always on the go, talking a lot). Several symptoms before 12: yes. Full criteria in childhood: no evidence. Collateral rating: parent 2, school 1, partner 2.</p>",
          q: {
            q: "Why is 'ADHD in partial remission' not the right label?",
            options: [
              "Because partial remission is only used for children",
              "Because there is no evidence he ever met full criteria: both childhood and adult symptom counts are below the full threshold",
              "Because he has never had treatment",
              "Because partial remission requires that there is no impairment"
            ],
            a: 1,
            why: "The DSM-5-TR 'in partial remission' specifier needs full criteria to have been met in the past, fewer than full criteria for the past 6 months, and continuing impairment. Treatment history is irrelevant, and impairment is required, not excluded. Without evidence that full criteria were ever met, Other specified ADHD is the accurate label."
          }
        },
        {
          title: "Differentials",
          html: "<table><thead><tr><th>Condition</th><th>Findings</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>Obstructive sleep apnoea</td><td>Snores; BMI 29; wife has seen no pauses in breathing; STOP-Bang 2; Epworth 7</td><td>Low risk</td></tr>" +
            "<tr><td>Sleep restriction</td><td>Works until 1 am most nights to catch up; 6 hours' sleep</td><td>Contributes; advice given</td></tr>" +
            "<tr><td>Work stress and anxiety</td><td>GAD-7 7; worry about the improvement plan, which began after the deadlines slipped</td><td>A consequence, not the cause</td></tr>" +
            "<tr><td>Depression</td><td>PHQ-9 6; no episodes</td><td>Absent</td></tr>" +
            "<tr><td>Autism</td><td>AQ-10 2; easy friendships; no rigidity</td><td>Absent</td></tr>" +
            "<tr><td>Specific learning disorder</td><td>Reads, writes and calculates without difficulty</td><td>Absent</td></tr>" +
            "<tr><td>Thyroid disease</td><td>TFTs normal</td><td>Absent</td></tr>" +
            "<tr><td>Normal variation</td><td>Formal improvement plan; family conflict; problems since primary school</td><td>Impairment beyond what peers show</td></tr>" +
            "<tr><td>Validity</td><td>Gives specific examples, denies many items, informants agree</td><td>No concerns</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Which differential most needs specific checking before you settle on a neurodevelopmental explanation in a 41-year-old man who works late and snores?",
            options: [
              "Obstructive sleep apnoea and sleep restriction",
              "Dementia",
              "Psychosis"
            ],
            a: 0,
            why: "Sleep disorders are a key medical mimic named in RCPsych CR235 (9.7.7) and CADDRA. Snoring, weight, hypertension and daytime sleepiness should prompt a sleep history, a bed partner's account and a screen such as STOP-Bang, with a sleep study if risk is high. Here OSA risk is low, but chronic sleep restriction is real and worth addressing. Nothing in the history suggests cognitive decline or psychosis."
          }
        },
        {
          title: "Conclusion, coding and plan",
          html: "<h4>Coding</h4><ul>" +
            "<li>DSM-5-TR: Other specified ADHD, with insufficient symptoms (ICD-10-CM F90.8).</li>" +
            "<li>ICD-11 deliberately avoids fixed symptom cut-offs, so a clinician using ICD-11 might judge the 6A05 requirements met. ICD-11 has no subthreshold ADHD category: 6A05.Y means an 'other specified presentation' of ADHD whose requirements are met, not the DSM-5-TR subthreshold category. The report states which system the service uses and why.</li></ul>" +
            "<h4>Plan</h4><ul>" +
            "<li>Explain the finding in plain words: real, lifelong ADHD-type traits that cause real problems, just below the DSM-5-TR count.</li>" +
            "<li>Written information and support groups (NICE NG87 1.4.4).</li>" +
            "<li>Environmental modifications at work: written actions after meetings, a quieter workspace, a project-management tool with reminders, a weekly planning slot with his manager. Information about Access to Work.</li>" +
            "<li>Skills-based support (organisation and time-management coaching or a CBT-based group).</li>" +
            "<li>Sleep advice: stop late-night catch-up working.</li>" +
            "<li>Review in six months. NG87 covers information for people who fall short of a diagnosis (1.4.4) but says nothing about medication for them. If significant impairment persists after modifications, discuss medication in the multidisciplinary team and document the reasoning (clinical practice).</li></ul>",
          q: {
            q: "Which plan is most appropriate?",
            options: [
              "Start stimulant medication today, because his son responded well",
              "Discharge with no information, because he does not meet full criteria",
              "Explain the finding, give information (NICE NG87 1.4.4), put workplace and home modifications in place, offer skills-based support and review; discuss medication in the team only if significant impairment persists",
              "Re-interview him until he endorses a fifth symptom"
            ],
            a: 2,
            why: "NICE NG87 1.5.15 puts environmental modifications before medication even when ADHD is diagnosed, and 1.4.4 says people who fall short of a diagnosis may benefit from the same information. A relative's response to medication says nothing about his diagnosis. Pushing for extra symptoms is the confirmation bias UKAAN AQAS warns about: count honestly and record what you find."
          }
        }
      ],
      profile: {
        adultIA: 4, adultHI: 3, childIA: 4, childHI: 2,
        impairment: "Moderate at work (performance improvement plan, missed milestones) and in family life (his wife manages all admin and the calendar); mild in daily life. Two settings."
      },
      answer: {
        conclusion: "Other specified ADHD (DSM-5-TR), with insufficient symptoms. He has 4 inattentive and 3 hyperactive-impulsive symptoms now, several symptoms before 12 (confirmed by school reports, his mother and his sister), symptoms in two settings, and moderate impairment at work and at home, not better explained by another condition. Full criteria have never been met, so 'in partial remission' does not apply.",
        codes: "DSM-5-TR Other specified ADHD, reason recorded as insufficient symptoms (ICD-10-CM F90.8). ICD-11 has no fixed symptom count and no subthreshold ADHD category, so whether the 6A05 requirements are met is a clinical judgement; if they are, code the presentation. 6A05.Y is an 'other specified presentation' of a diagnosis that is met, not an equivalent of DSM-5-TR Other specified ADHD. State in the report which system is used.",
        ddx: [
          "Obstructive sleep apnoea: low risk (STOP-Bang 2, Epworth 7, no witnessed apnoeas)",
          "Sleep restriction from late working: contributes; advice given",
          "Work-related stress and anxiety: mild (GAD-7 7); a consequence rather than the cause",
          "Depression: absent (PHQ-9 6, no episodes)",
          "Autism: not suggested (AQ-10 2, no early social-communication differences)",
          "Specific learning disorder: absent",
          "Normal variation: impairment is beyond what peers show"
        ],
        teaching: [
          "DSM-5-TR needs 5 symptoms in at least one domain from age 17. Count honestly: do not lower the bar or push for a fifth symptom.",
          "Other specified ADHD is for impairing ADHD-type symptoms that do not meet full criteria; record the reason. 'In partial remission' is only for people who once met full criteria.",
          "ICD-11 has no fixed count, and Kooij 2019 notes evidence that 4 current symptoms may be the best adult threshold. Name the classification your report uses.",
          "Impairment often appears when demands outgrow compensation, here after a promotion. Criterion B asks about symptoms before 12, not impairment before 12.",
          "A first-degree relative with ADHD raises the prior probability (NICE NG87 1.2.1) but does not replace symptom evidence.",
          "Use a professional interpreter for collateral, never a family member, and explain the purpose in a way that respects the family's views on labels.",
          "People who fall short of a diagnosis still need information, practical modifications and a review (NICE NG87 1.4.4)."
        ]
      }
    },

    /* ================================================================== */
    /* c13  New memory problems at 68: mild neurocognitive disorder         */
    /* ================================================================== */
    {
      id: "c13",
      title: "New forgetfulness at 68: lifelong pattern or decline?",
      patient: "68-year-old retired medical secretary, born in Trinidad",
      tags: ["older adults", "mild neurocognitive disorder", "late onset", "medicines", "hearing", "not ADHD"],
      difficulty: 2,
      referral: "GP letter: 'Gloria, 68, read a newspaper article about ADHD in older women and asked to be referred. Over the past 18 months she has become forgetful: missing appointments, repeating questions and losing her purse. She gave up the church accounts last year after making errors. She wonders whether she has had ADHD all her life. ASRS Part A 4/6. Past history: hypertension (amlodipine), type 2 diabetes (metformin), overactive bladder (oxybutynin, started two years ago), neuropathic pain (amitriptyline 25 mg at night). Widowed three years ago; lives alone; her daughter lives nearby.'",
      stages: [
        {
          title: "Screening and first impressions",
          html: "<table><thead><tr><th>Measure</th><th>Result</th><th>Usual reading</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1</td><td>Part A 4/6 (items 1 to 4 shaded; she is not fidgety or 'driven'). Sum 30/72</td><td>Part A positive at 4 or more</td></tr>" +
            "<tr><td>WURS-25</td><td>12/100</td><td>Well below 36</td></tr>" +
            "<tr><td>PHQ-9</td><td>7</td><td>Mild</td></tr>" +
            "<tr><td>GAD-7</td><td>5</td><td>Mild</td></tr>" +
            "<tr><td>AUDIT-C</td><td>1</td><td>Low risk</td></tr>" +
            "</tbody></table>" +
            "<p>Gloria comes with her daughter. She is smartly dressed, warm and chatty. In the first 20 minutes she asks twice where she should have parked. Hearing aids were prescribed two years ago; they are 'in the kitchen drawer'. She asks the assessor to repeat questions several times.</p>",
          q: {
            q: "Which single question best starts to separate lifelong ADHD from an acquired problem at this age?",
            options: [
              "'Do you often lose things?'",
              "'Do you feel restless?'",
              "'Have you tried coffee to help you concentrate?'",
              "'Is this how you have always been, or is it a change from how you were a few years ago?'"
            ],
            a: 3,
            why: "ADHD is a lifelong trait. ICD-11 mild neurocognitive disorder (6D71) is defined by a decline from the person's previous level of functioning. CADDRA advises separating ADHD from MCI or dementia in older adults by taking a longitudinal history. Symptom questions alone cannot separate them, because both produce forgetfulness and losing things."
          }
        },
        {
          title: "The lifelong history check",
          html: "<ul><li>Primary school in Port of Spain, then London from age 9. Her sister kept her last primary school report, at 11: 'Gloria is a careful, hard-working girl whose work is always beautifully presented.'</li>" +
            "<li>Left school at 16, secretarial college, then 35 years as a hospital medical secretary. She ran the diaries of three consultants: <em>'I never once double-booked a clinic.'</em></li>" +
            "<li>Raised three children; managed the household finances throughout her marriage.</li>" +
            "<li>Retired at 63. Church treasurer for 20 years, including four years after retiring, with no errors until last year.</li></ul>" +
            "<blockquote>Her sister, 70: 'Gloria was always the organised one. I was the scatterbrain! She remembered everybody's birthday. This last year or two she's not herself.'</blockquote>" +
            "<p>Childhood tally: inattention 0, hyperactivity-impulsivity 0. Collateral rating: sibling 0 (no support for ADHD).</p>",
          q: {
            q: "Some adults with lifelong ADHD are first noticed after retirement removes the structure of work. Why is that explanation unlikely here?",
            options: [
              "Because ADHD cannot be diagnosed after 65",
              "Because her ASRS Part A is only 4/6",
              "Because she managed complex tasks well for years after retiring, including the church accounts, and the problems began only 18 months ago as a change from that level"
            ],
            a: 2,
            why: "Unmasking after retirement needs evidence that the problems were there before, held in check by structure. Here she functioned at a high level without work structure for four years. ADHD can be diagnosed at any age (the Australian guideline says to consider it in all age groups, including over 65), and a Part A score of 4 counts as positive, so neither of the other options is right."
          }
        },
        {
          title: "Current symptoms and the pattern of change",
          html: "<p>Her daughter's account, with Gloria's agreement:</p><ul>" +
            "<li>Repeats the same story or question within minutes, several times a day.</li>" +
            "<li>Missed three GP appointments in six months, having never missed one before.</li>" +
            "<li>Lost her purse twice; once it was in the fridge.</li>" +
            "<li>Got lost driving to her daughter's house, which she has visited weekly for two years.</li>" +
            "<li>Burnt two saucepans. A late bill payment for the first time in her life.</li>" +
            "<li>Pauses to find words. Still dresses well, cooks, goes to church and sees friends.</li></ul>" +
            "<table><thead><tr><th>Symptom endorsed</th><th>When it started</th></tr></thead><tbody>" +
            "<tr><td>ia1 Mistakes (church accounts)</td><td>Last year</td></tr>" +
            "<tr><td>ia2 Losing the thread (television dramas, sermons)</td><td>About 18 months ago</td></tr>" +
            "<tr><td>ia5 Organising (bills, appointments)</td><td>About 18 months ago</td></tr>" +
            "<tr><td>ia7 Losing things (purse, keys, in unusual places)</td><td>About 18 months ago</td></tr>" +
            "<tr><td>ia9 Forgetful (appointments, conversations)</td><td>About 18 months ago</td></tr>" +
            "<tr><td>Hyperactive-impulsive items</td><td>None, then or now</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Which feature is most typical of an acquired neurocognitive disorder rather than ADHD?",
            options: [
              "Being late for appointments",
              "Repeating the same question within minutes and getting lost on a route she knows well",
              "Feeling bored in long meetings",
              "Starting projects and not finishing them"
            ],
            a: 1,
            why: "Rapid forgetting of new information (repeating questions) and disorientation on familiar routes suggest a memory disorder, and they are a change from her usual self. Lateness, boredom and unfinished projects are common in ADHD, but there they are lifelong. For any symptom at this age, the key question is whether it is new (clinical practice)."
          }
        },
        {
          title: "Medical review, medicines and investigations",
          html: "<table><thead><tr><th>Area</th><th>Findings</th></tr></thead><tbody>" +
            "<tr><td>Medicines</td><td>Oxybutynin (strongly anticholinergic) started two years ago, shortly before the problems began. Amitriptyline 25 mg at night (anticholinergic). Amlodipine, metformin</td></tr>" +
            "<tr><td>Hearing</td><td>Moderate loss; aids not worn</td></tr>" +
            "<tr><td>Mood</td><td>Grief after her husband's death eased after the first year. Enjoys church and her grandchildren. PHQ-9 7. No depressive episode now</td></tr>" +
            "<tr><td>Sleep</td><td>7 hours; no snoring or daytime sleepiness</td></tr>" +
            "<tr><td>Diabetes</td><td>HbA1c 58 mmol/mol; no reported hypoglycaemic episodes</td></tr>" +
            "<tr><td>Bloods (GP, last month)</td><td>Full blood count, B12, folate, thyroid function, U&amp;E, calcium and liver function normal</td></tr>" +
            "<tr><td>Cognitive screen</td><td>MoCA 22/30 after the education adjustment (below the usual cut-off of 26): lost points mainly on delayed recall (1 of 5 words), orientation to date, and verbal fluency</td></tr>" +
            "</tbody></table>" +
            "<p>The MoCA was given by a clinician trained and certified to use it. Its items are not reproduced in this app.</p>",
          q: {
            q: "What is the most appropriate next step?",
            options: [
              "Start a stimulant trial: if her memory improves, ADHD is confirmed",
              "Reassure her that this is normal ageing and discharge her",
              "Repeat the ASRS in a year",
              "Refer to the memory assessment service, and ask the GP to review the anticholinergic medicines (oxybutynin, amitriptyline) and her hearing"
            ],
            a: 3,
            why: "A response to stimulants is not a diagnostic test, and stimulants raise blood pressure in a woman already treated for hypertension. Reversible contributors come first: anticholinergic burden, uncorrected hearing loss, mood, sleep and bloods. A MoCA below 26 with a history of decline is consistent with mild cognitive impairment (in the validation study the MoCA detected MCI with 90% sensitivity at that cut-off) and needs specialist memory assessment (NICE NG97 covers dementia assessment). It is not normal ageing, and waiting a year with a symptom checklist would delay the right care."
          }
        },
        {
          title: "Conclusion and feedback",
          html: "<h4>Formulation</h4><p>Not ADHD. A new decline over 18 months in memory, organisation, orientation and word-finding, from a previously very high level, with preserved independence in everyday life. This fits mild neurocognitive disorder (mild cognitive impairment). Anticholinergic medicines and uncorrected hearing loss may be contributing. The cause needs specialist assessment.</p>" +
            "<h4>Plan</h4><ul>" +
            "<li>Referral to the memory assessment service, with this report and her daughter's account.</li>" +
            "<li>GP to review oxybutynin and amitriptyline.</li>" +
            "<li>Audiology review; encourage her to wear the hearing aids.</li>" +
            "<li>Driving: she got lost on a familiar route, so discuss road safety with her and her daughter now. The memory service will advise on fitness to drive and whether she must tell the DVLA.</li>" +
            "<li>Information for Gloria and her daughter, including carer support.</li></ul>",
          q: {
            q: "Gloria asks: 'Couldn't I have had ADHD all along and just coped?' Which reply is most accurate?",
            options: [
              "'It's a fair question, and ADHD can be diagnosed at any age. But ADHD has to be lifelong. Everything you, your sister and your work history tell me shows you were very organised until about 18 months ago. This is a change, and it needs a different kind of assessment.'",
              "'Yes, that is likely: ADHD often appears for the first time in later life.'",
              "'No. ADHD is a childhood condition and cannot be diagnosed in older adults.'"
            ],
            a: 0,
            why: "ADHD can be diagnosed in older adults (Australian guideline 2.1.6), but it requires symptoms before 12 and a lifelong course. ADHD does not begin in later life: in the WFADHD statement, clinician-diagnosed ADHD at 50 and over was only about 0.2%, while new cognitive complaints at this age are common. An honest, kind explanation helps her accept the right referral."
          }
        }
      ],
      profile: {
        adultIA: 0, adultHI: 0, childIA: 0, childHI: 0,
        impairment: "Five inattentive items are endorsed (ia1, ia2, ia5, ia7, ia9), but all began about 18 months ago as a decline from a high previous level, so none is scored as an ADHD symptom. Mild impairment in money management, appointments and driving to familiar places; independent in self-care and social life."
      },
      answer: {
        conclusion: "ADHD not diagnosed. There is no evidence of ADHD symptoms in childhood or in adult life until 18 months ago; her sister and her work history describe an exceptionally organised woman. The new problems (repeating questions, losing items in odd places, getting lost on a familiar route, errors with money, word-finding pauses) are a decline from her previous level, with a MoCA of 22/30. This is consistent with mild neurocognitive disorder (mild cognitive impairment). Anticholinergic medicines and uncorrected hearing loss may be contributing. The cause is for the memory assessment service to establish.",
        codes: "Provisional: mild neurocognitive disorder, ICD-11 6D71 (cause to be specified after memory service assessment); DSM-5-TR mild neurocognitive disorder, cause to be determined. No ADHD code.",
        ddx: [
          "Mild neurocognitive disorder (mild cognitive impairment): probable; refer to the memory service",
          "Medicine effects (oxybutynin, amitriptyline; anticholinergic burden): possible contributor; GP review",
          "Sensory impairment (uncorrected hearing loss): contributor; audiology",
          "Depression: not present now (PHQ-9 7; grief has eased)",
          "Hypothyroidism, B12 or folate deficiency, anaemia: excluded on bloods",
          "Hypoglycaemia: no episodes reported; diabetes control reviewed by GP",
          "Obstructive sleep apnoea: no snoring or daytime sleepiness"
        ],
        teaching: [
          "ADHD can be diagnosed at any age, including over 65 (Australian guideline 2.1.6), but it must be lifelong. In older adults always ask: 'Is this a change?'",
          "Base rates matter: clinician-diagnosed ADHD at 50 and over is rare (about 0.2% in the meta-analysis cited by the WFADHD statement), while new cognitive complaints are common.",
          "Repeating questions, getting lost on familiar routes and misplacing items in odd places suggest an acquired memory disorder, not ADHD.",
          "Check the lifelong history properly. Retirement can unmask ADHD, but only when the problems were present before and held in check by structure.",
          "Review medicines with anticholinergic effects, hearing, mood, sleep and bloods before attributing cognitive change to a neurodegenerative cause.",
          "A positive ASRS in an older adult is a prompt, not a diagnosis. ASRS scores fall with age in population norms (lowest at 65 and over), so a positive screen at 68 needs explaining.",
          "Route the person to the right service, here memory assessment, and explain kindly why the answer is not ADHD."
        ]
      }
    },

    /* ================================================================== */
    /* c14  Traumatic brain injury at 19: new attention problems            */
    /* ================================================================== */
    {
      id: "c14",
      title: "After the crash: new attention problems following a brain injury",
      patient: "23-year-old former apprentice joiner, injured in a road traffic collision at 19",
      tags: ["acquired brain injury", "traumatic brain injury", "late onset", "neurocognitive disorder", "family history", "not ADHD"],
      difficulty: 1,
      referral: "GP letter: 'Callum, 23, was riding a motorbike when a car pulled out in front of him four years ago. He had a severe head injury (frontal contusions, five days in intensive care) and inpatient rehabilitation. Since then he struggles with concentration, forgetfulness, irritability and impulsive spending, and he could not return to his joinery apprenticeship. His 17-year-old brother has just been diagnosed with ADHD, and his mother wonders whether Callum has it too. ASRS Part A 5/6. Please assess.'",
      stages: [
        {
          title: "Screening results",
          html: "<table><thead><tr><th>Measure</th><th>Result</th><th>Usual reading</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1</td><td>Part A 5/6. Sum 48/72</td><td>Part A positive at 4 or more</td></tr>" +
            "<tr><td>WURS-25</td><td>16/100</td><td>Well below 36</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Work, life skills, self-concept and social domains impaired</td><td>Four domains meet the rule</td></tr>" +
            "<tr><td>PHQ-9</td><td>12; item 9 = 0</td><td>Moderate</td></tr>" +
            "<tr><td>GAD-7</td><td>8</td><td>Mild</td></tr>" +
            "<tr><td>AUDIT</td><td>6</td><td>Low risk</td></tr>" +
            "<tr><td>DAST-10</td><td>2 (cannabis most evenings 'for the headaches and to sleep')</td><td>Low level</td></tr>" +
            "<tr><td>Epworth Sleepiness Scale</td><td>9</td><td>Normal range, but he describes heavy fatigue by mid-afternoon</td></tr>" +
            "</tbody></table>",
          q: {
            q: "What is the most striking pattern in these results?",
            options: [
              "High current symptom scores with a very low retrospective childhood score",
              "Low impairment",
              "A probable alcohol use disorder"
            ],
            a: 0,
            why: "His WURS-25 is far below both published cut-offs while current ratings are high. That split suggests problems that began later in life. It is a hypothesis to test with a timeline and records, not a conclusion on its own. Impairment is high, and AUDIT 6 is in the low-risk zone."
          }
        },
        {
          title: "The injury and its aftermath",
          html: "<p>From the hospital and rehabilitation records (with consent):</p><ul>" +
            "<li>Glasgow Coma Scale 7 at the scene. CT: bifrontal contusions and a small subdural haematoma, managed without surgery.</li>" +
            "<li>Five days in intensive care. Post-traumatic amnesia about three weeks. Eight weeks of inpatient neurorehabilitation.</li>" +
            "<li>Neuropsychology at six months: slowed processing speed, impaired working memory and executive function, against an estimated average pre-injury ability.</li>" +
            "<li>By standard severity criteria (for example the Mayo classification: GCS below 13, contusions on imaging, amnesia longer than 24 hours) this was a moderate to severe injury. On traditional criteria (GCS 8 or less, post-traumatic amnesia over 7 days) it was severe.</li></ul>" +
            "<p>Since the injury: tiredness by mid-afternoon, headaches, irritability, crude comments 'that just come out', impulsive online spending (£2,000 of debt), poor planning and forgetting. He could not safely return to work with power tools and now works 16 hours a week at a garden centre.</p>" +
            "<blockquote>Mother: 'He's a different lad since the accident. Snappy. He says things he never would have said before.'</blockquote>",
          q: {
            q: "Which detail in the history matters most for the ADHD question?",
            options: [
              "He was the rider, not the driver",
              "His brother has ADHD",
              "He uses cannabis",
              "The problems began after the injury, as a clear change from how he was before"
            ],
            a: 3,
            why: "ADHD needs several symptoms before 12 and a trait-like course. UKAAN AQAS says ADHD symptoms should not be episodic or reflect change from a pre-morbid baseline. A clear before-and-after around a documented brain injury points to an acquired disorder. The cause of the crash matters a little (ADHD raises the risk of injury, so you should ask), but here a car pulled out in front of him while he was sober and licensed."
          }
        },
        {
          title: "Interview: adulthood (now)",
          html: "<table><thead><tr><th>Symptom</th><th>Example</th><th>Since</th></tr></thead><tbody>" +
            "<tr><td>ia1 Mistakes</td><td>Till errors; warning from his manager</td><td>Injury</td></tr>" +
            "<tr><td>ia2 Sustaining attention</td><td>Loses the thread of a television drama after 15 minutes, worse when tired</td><td>Injury</td></tr>" +
            "<tr><td>ia3 Following conversation</td><td>Gets lost in group conversations; fine one to one when rested</td><td>Injury</td></tr>" +
            "<tr><td>ia4 Not finishing</td><td>Abandons tasks halfway when tired</td><td>Injury</td></tr>" +
            "<tr><td>ia5 Planning</td><td>Cannot plan his week without his mother's help</td><td>Injury</td></tr>" +
            "<tr><td>ia8 Distractible</td><td>Any noise breaks his focus</td><td>Injury</td></tr>" +
            "<tr><td>ia9 Forgetful</td><td>Forgets shifts and appointments unless they are on his phone</td><td>Injury</td></tr>" +
            "<tr><td>hi1 Fidgets</td><td>Jiggles his leg when frustrated</td><td>Injury</td></tr>" +
            "<tr><td>hi7 Blurts out</td><td>Comments that 'just come out', including a crude remark to a customer</td><td>Injury</td></tr>" +
            "<tr><td>hi8 Impatience</td><td>Snaps in queues</td><td>Injury</td></tr>" +
            "<tr><td>hi9 Interrupts</td><td>Talks over his mother and brother</td><td>Injury</td></tr>" +
            "</tbody></table>" +
            "<p>Qualitative pattern: attention worsens through the day and improves after rest; slowed thinking; word-finding pauses; headaches; disinhibition. Endorsed now: inattention 7, hyperactivity-impulsivity 4. None was present before the injury.</p>",
          q: {
            q: "He reports 7 inattentive and 4 hyperactive-impulsive symptoms now. Why should these not be scored as ADHD symptoms?",
            options: [
              "Because adults need 6 symptoms in a domain",
              "They should be: criterion A is met and only criterion B is in doubt",
              "Because they began after a documented brain injury and are a change from his previous level; symptoms with a known acquired cause and a clear onset are not scored as ADHD",
              "Because he is too young for an adult assessment"
            ],
            a: 2,
            why: "The adult threshold is 5, not 6, and at 23 he is well within the adult range. ADHD symptoms are trait-like, so the app's scoring rules say not to count a behaviour that started with a clear before-and-after such as a head injury. Scoring them and then failing criterion B gives the right final answer by a misleading route: it suggests ADHD that only lacks a history. ICD-11 also requires that the symptoms are not better explained by a disease of the nervous system."
          }
        },
        {
          title: "Childhood and collateral",
          html: "<ul><li>Primary reports: 'Callum is a steady, reliable boy who always finishes his work.' 'Calm and sensible; a good role model in class.'</li>" +
            "<li>Year 11: attendance 98%; merit award for effort. Seven GCSE passes.</li>" +
            "<li>College joinery course: 'meticulous with measurements'. His apprenticeship supervisor's letter in the rehabilitation file: 'conscientious and safe'.</li></ul>" +
            "<blockquote>Mother: 'Callum was the calm one. His brother was the whirlwind, climbing the curtains at three. Callum would sit for hours building Lego.'</blockquote>" +
            "<p>Childhood tally: inattention 0, hyperactivity-impulsivity 0. Collateral rating: parent 0, school 0.</p>",
          q: {
            q: "His brother's new diagnosis makes the family wonder about genetics. How should it be weighed?",
            options: [
              "It confirms ADHD in Callum, because ADHD is highly heritable",
              "It raises the prior probability, so look carefully for childhood symptoms, but it cannot outweigh consistent evidence of a calm, focused childhood and a clear onset after the injury",
              "It is irrelevant and should not be recorded"
            ],
            a: 1,
            why: "NICE NG87 1.2.1 lists a close family member with ADHD as a reason for higher prevalence, and heritability is high (about 74% in twin studies). That justifies a careful search for childhood symptoms, which here found none. Family history is always worth recording, but it shifts probability; it does not make a diagnosis."
          }
        },
        {
          title: "Differentials and synthesis",
          html: "<table><thead><tr><th>Condition</th><th>Findings</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>Neurocognitive disorder due to traumatic brain injury</td><td>Onset after a moderate to severe injury; slowed processing, working memory and executive problems on neuropsychology; disinhibition, irritability, fatigue</td><td>Present: explains the picture</td></tr>" +
            "<tr><td>Depression</td><td>PHQ-9 12; low mood since losing the apprenticeship; still enjoys football with friends</td><td>Post-injury depressive symptoms: treat and monitor</td></tr>" +
            "<tr><td>Cannabis use</td><td>Most evenings, for headaches and sleep</td><td>Contributes to memory problems and fatigue; advice given</td></tr>" +
            "<tr><td>Headache and sleep</td><td>Daily headaches; broken sleep</td><td>Contribute; GP review</td></tr>" +
            "<tr><td>Post-traumatic epilepsy</td><td>No blackouts, absences or unexplained episodes</td><td>No features; ask again at review</td></tr>" +
            "<tr><td>PTSD after the crash</td><td>No memory of the collision (amnesia). No nightmares, intrusive images or avoidance of roads; travels by car and bus without distress</td><td>Not present; amnesia does not rule PTSD out, so ask again at review</td></tr>" +
            "<tr><td>Personality change</td><td>Disinhibition, crude remarks and irritability that are new since the injury</td><td>Part of the brain injury picture; for the brain injury team</td></tr>" +
            "<tr><td>Validity</td><td>A personal injury claim is in progress</td><td>See question</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Callum has a personal injury compensation claim in progress. What should you do with this information?",
            options: [
              "Ignore it: it is a legal matter",
              "Conclude that he is exaggerating",
              "Note it as a possible external incentive and check consistency with records, collateral and the earlier neuropsychology. Here everything is consistent, so it does not change the conclusion",
              "Refuse to assess until the claim is settled"
            ],
            a: 2,
            why: "Compensation claims are a recognised external incentive, so they belong in the validity section. An incentive is not evidence of exaggeration on its own. What matters is consistency: his account matches the hospital and rehabilitation records, the neuropsychology at six months and his mother's description. Refusing assessment would deny him care."
          }
        },
        {
          title: "Conclusion and plan",
          html: "<blockquote>'The problems you have now are real, and they are caused by the injury to the front of your brain, not by ADHD. That matters, because the help that works best comes from the brain injury team, not from an ADHD clinic.'</blockquote>" +
            "<ul><li>Referral back to the community brain injury service for repeat neuropsychology, cognitive rehabilitation and fatigue management.</li>" +
            "<li>Vocational rehabilitation to look at work that suits his strengths.</li>" +
            "<li>GP: treatment for low mood, review of headaches and sleep; advice about evening cannabis.</li>" +
            "<li>Check that driving and DVLA advice after the head injury has been followed (he no longer rides).</li>" +
            "<li>Information about brain injury charities such as Headway, and support for his mother.</li>" +
            "<li>Questions about medication for post-injury attention problems belong with the brain injury team.</li></ul>"
        }
      ],
      profile: {
        adultIA: 0, adultHI: 0, childIA: 0, childHI: 0,
        impairment: "He endorses 7 inattentive and 4 hyperactive-impulsive items, but all began after the injury at 19 as a change from his previous level, so none is scored as an ADHD symptom. Moderate to severe impairment: apprenticeship lost, £2,000 of debt from impulsive spending, a warning at work and strain at home."
      },
      answer: {
        conclusion: "ADHD not diagnosed. Callum had no ADHD symptoms before the injury (school, college and apprenticeship records and his mother agree). His attention, memory, planning and impulse-control problems began after a moderate to severe traumatic brain injury at 19 and match the neuropsychology findings at six months. This is a neurocognitive disorder due to traumatic brain injury, with post-injury low mood and evening cannabis use contributing.",
        codes: "Mild neurocognitive disorder: ICD-11 6D71, with the traumatic brain injury recorded as the cause; DSM-5-TR mild neurocognitive disorder due to traumatic brain injury. Mild rather than major because he remains independent in everyday activities (to be confirmed by neuropsychology). No ADHD code.",
        ddx: [
          "Neurocognitive disorder due to traumatic brain injury: present; explains the picture",
          "Depressive symptoms after the injury (PHQ-9 12): present; treat",
          "Cannabis use (most evenings, for headaches and sleep): contributes; advice given",
          "Post-traumatic headache and poor sleep: contribute to fatigue-related inattention",
          "Post-traumatic epilepsy: no features; ask again at review",
          "PTSD after the collision: no intrusions or avoidance; he has no memory of the crash, which lowers but does not remove the risk",
          "Secondary personality change (disinhibition, irritability since the injury): part of the brain injury picture; brain injury team to assess",
          "Non-credible report: compensation claim noted; account consistent with records and collateral",
          "ADHD: no childhood symptoms; not diagnosed"
        ],
        teaching: [
          "ADHD needs several symptoms before 12. A clear change after a known injury is an acquired disorder, however many symptoms are present now.",
          "NICE NG87 1.2.1 lists acquired brain injury as a higher-prevalence group, and ADHD itself raises the risk of injury. Always establish the pre-injury baseline from records and informants.",
          "Grade injury severity from records (GCS, imaging, post-traumatic amnesia) and look for the post-injury pattern: slowed processing, fatigue, headaches, disinhibition and irritability.",
          "A big gap between high current ratings and a low WURS-25 is a clue to late onset; test it with a timeline.",
          "A family history of ADHD raises the prior probability but cannot outweigh direct childhood evidence.",
          "Note external incentives such as compensation claims and check consistency; an incentive is not proof of exaggeration.",
          "Send the person to the right team: brain injury rehabilitation, neuropsychology and vocational support, with mood and substance use treated alongside."
        ]
      }
    },

    /* ================================================================== */
    /* c15  ADHD with co-occurring autism                                   */
    /* ================================================================== */
    {
      id: "c15",
      title: "Two conditions, one person: ADHD with co-occurring autism",
      patient: "29-year-old non-binary laboratory technician (they/them) on sick leave with burnout",
      tags: ["autism", "co-occurrence", "double counting", "masking", "burnout", "gender diversity"],
      difficulty: 3,
      referral: "GP letter: 'Alex (they/them), 29, laboratory technician, has been signed off work for six weeks with exhaustion and low mood after a reorganisation moved them to an open-plan office and a rotating rota. They describe lifelong difficulty concentrating, losing things and restlessness. They also find social situations draining and changes to routine very distressing. AQ-10 8. ASRS Part A 5/6. No mental health contact apart from anxiety in their teens. Please assess for ADHD; they also ask about autism.' The referral went to the adult neurodevelopmental service, which runs ADHD and autism pathways side by side.",
      stages: [
        {
          title: "Screening results",
          html: "<table><thead><tr><th>Measure</th><th>Result</th><th>Usual reading</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1</td><td>Part A 5/6. Sum 50/72</td><td>Part A positive at 4 or more</td></tr>" +
            "<tr><td>WURS-25</td><td>49/100</td><td>Above 46</td></tr>" +
            "<tr><td>AQ-10</td><td>8</td><td>6 or more: offer a comprehensive autism assessment (NICE CG142 1.2.3)</td></tr>" +
            "<tr><td>RAADS-14</td><td>31/42 (mentalising and sensory domains highest; most items rated 'true now and when I was young')</td><td>14 or more is positive. Median scores in the validation study: autism 32, ADHD 15</td></tr>" +
            "<tr><td>PHQ-9</td><td>13; item 9 = 0</td><td>Moderate</td></tr>" +
            "<tr><td>GAD-7</td><td>13</td><td>Moderate</td></tr>" +
            "<tr><td>AUDIT-C / DAST-10</td><td>2 / 0</td><td>Low risk</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Work, life skills, social and self-concept domains impaired</td><td>Four domains meet the rule</td></tr>" +
            "</tbody></table>",
          q: {
            q: "How should you read the AQ-10 of 8 and the RAADS-14 of 31?",
            options: [
              "They confirm autism, so the ADHD assessment is no longer needed",
              "They support offering a full autism assessment, but neither separates autism from ADHD well: in referred adults the AQ-10 has low specificity, and the median RAADS-14 in ADHD is above its cut-off",
              "They should be ignored, because Alex is on sick leave",
              "They show that the ASRS result is a false positive"
            ],
            a: 1,
            why: "NICE CG142 1.2.3 says to offer a comprehensive autism assessment at an AQ-10 of 6 or more, or on clinical suspicion. In adults referred to a specialist service the AQ-10 had sensitivity 0.77 but specificity 0.29 (Ashwood 2016), and in the RAADS-14 validation the median ADHD score (15) was above the cut-off (14). Alex's RAADS-14 is near the autism median and their answers point to lifelong traits, which strengthens the case for assessment. Screens do not exclude each other: NICE NG87 1.3.3 advises against excluding ADHD because of a pervasive developmental disorder."
          }
        },
        {
          title: "Developmental history (parent interview)",
          html: "<p>Both parents joined by video, with Alex's consent.</p><ul>" +
            "<li>Talked on time, with an unusually formal, 'grown-up' vocabulary.</li>" +
            "<li>Preferred playing alone; lined up toy animals by type and became upset if they were moved.</li>" +
            "<li>Distressed by clothing labels, the hand dryer at school and crowded shops.</li>" +
            "<li>A meltdown when roadworks changed the route to school; needed the same breakfast every day.</li>" +
            "<li>One close friend, through a shared passion for fossils: <em>'They didn't know how to join in with the other children, so they didn't try.'</em></li>" +
            "<li>Also: <em>'Into everything. Lost a coat or a water bottle most weeks. Couldn't sit through a meal. Shouted out answers in class. Teachers called them a dreamer.'</em></li></ul>",
          q: {
            q: "Which childhood features point specifically to autism rather than ADHD?",
            options: [
              "Losing belongings and fidgeting at meals",
              "Calling out answers in class",
              "Not knowing how to join in with other children, lining up toys by type, and severe distress at a changed route and at certain sounds and textures"
            ],
            a: 2,
            why: "ICD-11 notes that ADHD lacks the persistent social-communication deficits and restricted, repetitive behaviour of autism. RCPsych CR235 (9.7.4) contrasts an inability to make friends (autism) with problems keeping friends (ADHD), and rigid adherence to non-functional routines with routines used to manage forgetfulness. Losing things, fidgeting and calling out are ADHD features, which Alex also had."
          }
        },
        {
          title: "Interview: adulthood, without double counting",
          html: "<p>The assessor scored each ADHD symptom only where it was not better explained by autism (a parsimonious approach, UKAP consensus 2020).</p>" +
            "<table><thead><tr><th>Symptom</th><th>Example</th><th>Counted for ADHD?</th></tr></thead><tbody>" +
            "<tr><td>ia1 Careless mistakes</td><td>Labelling errors on samples, caught at quality control, in quiet and noisy rooms</td><td>Yes</td></tr>" +
            "<tr><td>ia2 Sustaining attention</td><td>Can study fossils for hours, but cannot keep attention on routine reports even in a silent room</td><td>Yes</td></tr>" +
            "<tr><td>ia3 Seeming not to listen</td><td>Loses track in group talk and noisy rooms; follows well one to one in quiet</td><td>No: better explained by social-communication differences and sensory overload</td></tr>" +
            "<tr><td>ia4 Not finishing</td><td>Three unfinished online courses; half-built shelves for a year</td><td>Yes</td></tr>" +
            "<tr><td>ia5 Organising</td><td>Wants order, but bills are late and the flat is chaotic; this distresses them</td><td>Yes</td></tr>" +
            "<tr><td>ia6 Avoiding effort</td><td>Some avoidance of long forms</td><td>Unsure</td></tr>" +
            "<tr><td>ia7 Losing things</td><td>Keys, lab pass; phone lost three times this year</td><td>Yes</td></tr>" +
            "<tr><td>ia8 Distractible</td><td>Pulled away by unrelated thoughts and by things in view, not only by noise</td><td>Yes</td></tr>" +
            "<tr><td>ia9 Forgetful</td><td>Forgets appointments and to reply to messages, including about fossils</td><td>Yes</td></tr>" +
            "<tr><td>hi1 Fidgets</td><td>Constant, non-rhythmic fidgeting in every setting, including when calm. Separate from hand-flapping when excited, which was not counted</td><td>Yes</td></tr>" +
            "<tr><td>hi2 Leaves seat</td><td>Gets up repeatedly in meetings to move</td><td>Yes</td></tr>" +
            "<tr><td>hi5 On the go</td><td>'Like a motor inside, even when I'm exhausted'</td><td>Yes</td></tr>" +
            "<tr><td>hi6 Talks a lot</td><td>Long monologues, only about special interests</td><td>No: better explained by autism</td></tr>" +
            "<tr><td>hi7 Blurts out</td><td>Answers before questions are finished, in any conversation</td><td>Yes</td></tr>" +
            "<tr><td>hi8 Waiting</td><td>Leaves queues; cannot wait for the lift</td><td>Yes</td></tr>" +
            "<tr><td>hi9 Interrupts</td><td>'I can't tell when it's my turn'; does not happen one to one</td><td>No: better explained by difficulty reading turn-taking cues</td></tr>" +
            "</tbody></table>" +
            "<p>Two kinds of routine: the same breakfast and route every day, with distress if changed (autism); phone alarms, lists and a 'launch pad' by the door to stop forgetting (ADHD compensation).</p>" +
            "<p>Adult tally (counted): inattention 7, hyperactivity-impulsivity 5.</p>",
          q: {
            q: "Alex interrupts in group conversations because they 'can't tell when it's my turn'. How should you score ADHD symptom hi9 (interrupts or intrudes)?",
            options: [
              "Do not count it for ADHD if it is better explained by difficulty reading turn-taking cues. Count it only if impulsive interrupting also happens when the cues are clear, for example one to one",
              "Score it as present: interrupting is interrupting, whatever the cause",
              "Score it present for both ADHD and autism, to be thorough",
              "Leave it out of the assessment altogether"
            ],
            a: 0,
            why: "The UKAP consensus on ADHD and autism (Young 2020) asks assessors to take a parsimonious approach and not double count symptoms across the two conditions. Record the behaviour and its explanation: it still matters for the autism assessment and for support at work, but here it does not count towards the ADHD threshold."
          }
        },
        {
          title: "Collateral, records and the autism assessment",
          html: "<ul><li>Primary reports. Age 7: 'Alex has a remarkable knowledge of fossils and finds group work difficult.' Age 9: 'Alex is often distracted and loses equipment; work is frequently unfinished.' Age 11: 'Alex calls out answers and struggles to stay seated.'</li>" +
            "<li>Partner, Ife: 'They lose something every day and forget plans we made that morning. They're always moving. After any social event they need two hours alone. If plans change at the last minute, they shut down.'</li>" +
            "<li>Ife on work: 'They rehearse conversations in the car and copy phrases from colleagues. They come home wiped out.'</li></ul>" +
            "<p>The service's autism pathway completed ADOS-2 (Module 4) with Alex and the ADI-R with their parents. Both reached criteria, with reduced reciprocal conversation, limited use of gesture, and intense, circumscribed interests.</p>" +
            "<p>Childhood tally (counted): inattention 7, hyperactivity-impulsivity 6. Collateral rating: parent 2, school 2, partner 2.</p>",
          q: {
            q: "Alex rehearses conversations and copies colleagues' phrases, then feels exhausted. What is the main implication for the assessment?",
            options: [
              "It shows good social skills, so autism is unlikely",
              "It suggests masking (camouflaging), which can hide autistic traits in an interview and contribute to burnout. Rely on developmental history and informants as well as observation",
              "It is a sign of social anxiety disorder only"
            ],
            a: 1,
            why: "The UKAP consensus asks assessors to consider masking and camouflaging in adults. CADDRA warns against relying on observation in the interview for ADHD, and the same logic applies to autism. Social anxiety can co-occur, but Alex's social differences began in early childhood and are about not knowing how to join in, not fear of judgement."
          }
        },
        {
          title: "Differentials and comorbidity",
          html: "<table><thead><tr><th>Condition</th><th>Findings</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>Autism</td><td>Early social-communication differences, restricted interests, insistence on sameness, sensory sensitivity; ADOS-2 and ADI-R at threshold</td><td>Present: co-occurring</td></tr>" +
            "<tr><td>Burnout</td><td>Exhaustion and shutdown since the move to an open-plan office and a rotating rota; years of masking at work</td><td>Present: drives the sick leave; adjustments are the treatment</td></tr>" +
            "<tr><td>Depression</td><td>PHQ-9 13; three months of low mood and exhaustion after the reorganisation; still enjoys fossils and walking</td><td>No depressive episode at interview; GP to monitor</td></tr>" +
            "<tr><td>Anxiety</td><td>GAD-7 13; anxiety about unpredictability and social and sensory load</td><td>Review after workplace adjustments</td></tr>" +
            "<tr><td>Social anxiety disorder</td><td>Social difficulty is a developmental difference, not fear of scrutiny</td><td>Not supported</td></tr>" +
            "<tr><td>Sleep, thyroid</td><td>Lifelong difficulty falling asleep; no snoring; TFTs normal</td><td>No mimic</td></tr>" +
            "<tr><td>Validity</td><td>Detailed examples; denies items that do not fit; three informants agree</td><td>No concerns</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Which statement about diagnosing both conditions is correct?",
            options: [
              "ADHD cannot be diagnosed when autism is present under DSM-5-TR",
              "Autism must always be diagnosed first and ADHD reviewed a year later",
              "Only ICD-11 allows both diagnoses",
              "Since DSM-5, autism is no longer an exclusion for ADHD, and NICE NG87 1.3.3 advises against excluding ADHD because of a pervasive developmental disorder"
            ],
            a: 3,
            why: "DSM-5 (2013) removed autism as an exclusion criterion for ADHD, and DSM-5-TR kept that. ICD-11 also allows both. NICE NG87 1.3.3 says exclusion on the basis of a pervasive developmental disorder is not recommended. Both can be assessed in the same episode of care; there is no rule about order."
          }
        },
        {
          title: "Conclusion and plan",
          html: "<ul><li>Feedback on both diagnoses together, with written information and time to ask questions. Post-diagnostic autism support from the service.</li>" +
            "<li>Phased return through occupational health, with reasonable adjustments: a quiet workspace, a fixed rota, written instructions, advance notice of changes. Information about Access to Work.</li>" +
            "<li>Environmental modifications for ADHD at home and work (reminders, visual planning, body-doubling for admin).</li>" +
            "<li>If significant impairment persists after modifications, offer ADHD medication (NICE NG87 1.5.15), after the 1.7.4 baseline.</li>" +
            "<li>GP to monitor mood and anxiety during the return to work.</li></ul>",
          q: {
            q: "If ADHD medication is started later, which approach fits the evidence?",
            options: [
              "Start low, titrate slowly and review closely: response rates are lower when autism and ADHD co-occur",
              "Avoid medication completely, because it does not work in autistic people",
              "Start at the maximum dose, because response rates are lower",
              "Use medication instead of workplace adjustments"
            ],
            a: 0,
            why: "CADDRA reports a response rate of about 50% in people with autism and ADHD, against 70-80% in ADHD alone, and advises starting low and titrating slowly. Medication is not ruled out. NICE NG87 1.5.15 puts environmental modifications first, and they matter even more for an autistic person returning to an open-plan office."
          }
        }
      ],
      profile: {
        adultIA: 7, adultHI: 5, childIA: 7, childHI: 6,
        impairment: "Moderate at work (sample errors, missed deadlines, now on sick leave), in daily life (late bills, lost items) and in self-image. Counts exclude items better explained by autism (ia3, hi6, hi9)."
      },
      answer: {
        conclusion: "ADHD, combined presentation, moderate, co-occurring with autism spectrum disorder (without intellectual or language impairment). Autism is supported by early social-communication differences, restricted interests, insistence on sameness and sensory sensitivity, confirmed with ADOS-2 and ADI-R. ADHD is supported by broad, cross-situational inattention, losing things, forgetfulness and constant restlessness from early childhood, counted only where not better explained by autism. The current burnout and low mood followed the loss of predictability and sensory comfort at work.",
        codes: "ADHD combined presentation: DSM-5-TR F90.2; ICD-11 6A05.2. Autism spectrum disorder: ICD-11 6A02.0 (without disorder of intellectual development, with mild or no impairment of functional language); DSM-5-TR autism spectrum disorder without accompanying intellectual or language impairment (F84.0), with the support level specified by the autism team.",
        ddx: [
          "Autism spectrum disorder: present; co-occurring",
          "Burnout: present; exhaustion after the loss of a predictable routine and a quiet workspace, made worse by masking; phased return with adjustments",
          "Depression: low mood with burnout (PHQ-9 13), no depressive episode at interview; monitor",
          "Anxiety: driven by unpredictability and sensory and social load (GAD-7 13); review after adjustments",
          "Social anxiety disorder: social difficulty is a developmental difference, not fear of judgement",
          "Sleep disorder and thyroid disease: no features; TFTs normal",
          "Non-credible report: no concerns"
        ],
        teaching: [
          "Co-occurrence is common: pooled ADHD prevalence in autism is about 28%, and one UK adult ADHD clinic audit found autism in 38% (not peer-reviewed). When one condition is suspected, assess for the other.",
          "Do not double count. Score an ADHD symptom only when it is not better explained by autism, for example interrupting because turn-taking cues are missed.",
          "Separate two kinds of routine: routines that soothe, whose disruption causes distress (autism), and reminders and systems that compensate for forgetfulness (ADHD).",
          "Autism screens discriminate poorly in ADHD clinics: AQ-10 specificity was 0.29 in referred adults, and the median RAADS-14 in ADHD sits above its cut-off. Use them to decide on assessment, not as a diagnosis.",
          "Masking can hide autistic traits in a clinic room. Developmental history from parents, school reports and a partner's account carry more weight than one observation.",
          "Since DSM-5 both can be diagnosed, and NICE NG87 1.3.3 advises against excluding ADHD because of a pervasive developmental disorder.",
          "If medication is used, start low, go slow and review closely: response rates are lower when both conditions are present (CADDRA)."
        ]
      }
    },

    /* ================================================================== */
    /* c16  ADHD in prison: conduct history and substance use               */
    /* ================================================================== */
    {
      id: "c16",
      title: "Behind the door: ADHD in prison, with conduct history and substance use",
      patient: "26-year-old man serving a prison sentence, referred by the in-reach mental health team",
      tags: ["criminal justice", "prison", "conduct disorder", "substance use", "learning needs", "diversion risk", "head injury"],
      difficulty: 3,
      referral: "Prison mental health in-reach team: 'Kieran, 26, is five months into a 30-month sentence for burglary and assault. Wing staff report he cannot settle in education classes, and he has had four adjudications for verbal outbursts and leaving his work area. He is often in trouble for being in the wrong place at the wrong time. The reception screen and a brief Barkley-based ADHD self-report (B-BAARS) were positive. He was excluded from school at 13 and known to the youth offending team. Long history of cannabis and cocaine use; random drug tests in prison have been negative for four months. He asks for the ADHD tablets a cellmate takes. His release date is in 10 months and probation will be involved. Please assess.'",
      stages: [
        {
          title: "Setting up a fair assessment in custody",
          html: "<ul><li>Two 90-minute sessions in the healthcare unit, in a room with an alarm; an officer nearby but outside.</li>" +
            "<li>Limits of confidentiality in custody explained at the start (risk to self or others, security).</li>" +
            "<li>Consent obtained for: his mother; local authority school and educational psychology records; youth offending team records; GP records; the wing officer and education tutor.</li>" +
            "<li>Prison education assessment on file: reading age about 10 years.</li></ul>" +
            "<table><thead><tr><th>Measure (read aloud)</th><th>Result</th><th>Usual reading</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1</td><td>Part A 5/6. Sum 55/72</td><td>Part A positive at 4 or more</td></tr>" +
            "<tr><td>WURS-25</td><td>71/100</td><td>Above 46</td></tr>" +
            "<tr><td>DAST-10 (year before custody)</td><td>7</td><td>Substantial (6 to 8)</td></tr>" +
            "<tr><td>AUDIT (year before custody)</td><td>14</td><td>Increasing risk (8 to 15)</td></tr>" +
            "<tr><td>PHQ-9 / GAD-7</td><td>8 / 6</td><td>Mild</td></tr>" +
            "<tr><td>C-SSRS screen</td><td>No current thoughts of suicide. Lifetime: cutting at 17 in a young offender institution; none since</td><td>Prompt for enquiry; safety discussed</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Kieran reads at about a 10-year-old level. What is the best way to handle the questionnaires?",
            options: [
              "Give him the forms to complete in his cell and collect them next week",
              "Skip all questionnaires, because they are invalid in prison",
              "Read the items aloud in plain language, check understanding, record that this was done, and include learning needs in the differential",
              "Ask his cellmate to help him fill them in"
            ],
            a: 2,
            why: "The UK consensus on offenders with ADHD (Young 2018) highlights the high rates of neurodevelopmental needs in prisons, including dyslexia, learning disabilities, communication disorders and brain injury. Reading aloud keeps the scales usable and protects validity and confidentiality. Literacy problems are also a clinical finding: specific learning disorder and intellectual disability belong in the differential."
          }
        },
        {
          title: "History: childhood, school and offending",
          html: "<ul><li>Born at 34 weeks. Raised by his mother; father absent and in prison for much of Kieran's childhood. Domestic abuse at home until he was 6.</li>" +
            "<li>Primary school: 'never sat still'; two fixed-term exclusions at 9 for throwing chairs. At 10 an educational psychologist recommended CAMHS referral for possible ADHD; the family moved and the appointment never happened.</li>" +
            "<li>Secondary: repeated exclusions, permanently excluded at 13, then a pupil referral unit.</li>" +
            "<li>Before 15: shoplifting from 11, frequent fights, truanting, a car theft at 14. No fire-setting or cruelty to animals. Youth offending team from 14.</li>" +
            "<li>Adult offending: thefts, burglaries (planned, to fund drugs), assaults in bars when drunk, driving without a licence or insurance.</li>" +
            "<li>Substances: cannabis daily from 13; cocaine at weekends from 18, three or four days a week in the year before custody; binge drinking.</li>" +
            "<li>Head injuries: knocked out briefly in a fight at 17 and in a scooter fall at 22; no admission longer than a day.</li>" +
            "<li>Work: labouring jobs, the longest four months; sacked for lateness and arguments.</li></ul>" +
            "<blockquote>'Most of it just happens. I do it, then I think after. The bloke I hit, I feel bad about that. He hadn't done anything.'</blockquote>",
          q: {
            q: "Which part of the history best helps to separate ADHD from conduct-related or antisocial patterns alone?",
            options: [
              "The number of convictions",
              "Whether there is inattention and hyperactivity independent of rule-breaking, from early childhood: losing things, not finishing tasks, restlessness in neutral settings",
              "Whether he shows remorse",
              "Whether he wants medication"
            ],
            a: 1,
            why: "ICD-11 notes that conduct-dissocial problems alone typically lack inattention and hyperactivity, and the offenders consensus warns assessors not to focus only on externalising behaviour. Remorse helps separate antisocial personality from impulsive ADHD-driven acts (CADDRA), but it does not tell you whether ADHD is present. Conviction counts and requests for medication do not discriminate."
          }
        },
        {
          title: "Interview: adulthood, using the abstinent period",
          html: "<p>He has had four months of negative random drug tests. With consent, the wing officer and the education tutor gave written accounts.</p>" +
            "<blockquote>Wing officer: 'Can't stay at his workshop bench for more than ten minutes. Wanders, loses his ID card and canteen sheet, forgets appointments, talks over staff, can't wait at the servery. Not nasty, just can't stop himself.'</blockquote>" +
            "<blockquote>Education tutor: 'Bright enough, but he can't get through a 45-minute class. Starts worksheets and abandons them.'</blockquote>" +
            "<table><thead><tr><th>Domain</th><th>Present now</th><th>Not present or unsure</th></tr></thead><tbody>" +
            "<tr><td>Inattention</td><td>ia2 sustaining attention, ia4 not finishing, ia5 organising, ia6 avoiding effort, ia7 losing things, ia8 distractible, ia9 forgetful</td><td>ia1 unsure; ia3 no</td></tr>" +
            "<tr><td>Hyperactivity-impulsivity</td><td>hi1 fidgets, hi2 leaves his place, hi3 restless (paces his cell), hi5 on the go, hi7 blurts out, hi8 cannot wait, hi9 interrupts</td><td>hi4 no; hi6 unsure</td></tr>" +
            "</tbody></table>" +
            "<p>At first he played problems down: <em>'I'm fine, it's just this place.'</em> Specific questions about the workshop, the servery and education drew out clear examples. Adult tally: inattention 7, hyperactivity-impulsivity 7.</p>",
          q: {
            q: "Why is the four-month period of negative drug tests valuable?",
            options: [
              "Because ADHD can only be diagnosed in people who have never used drugs",
              "Because prison is the same as everyday life, so observations there generalise directly",
              "It is not valuable: prison stress explains everything",
              "Because symptoms that persist during sustained abstinence cannot be explained by intoxication or withdrawal, one of the key tests for a substance-related mimic"
            ],
            a: 3,
            why: "The international consensus on ADHD and substance use (Crunelle 2018) advises focusing on drug- and alcohol-free periods and starting the diagnostic process once there is no serious intoxication or withdrawal. Prison is an unusual setting (structure, boredom, stress), so collateral from outside and from childhood is still needed. Past drug use does not prevent a diagnosis."
          }
        },
        {
          title: "Collateral and records",
          html: "<blockquote>Mother (phone): 'From when he could walk he was climbing everything. The teachers never knew what to do with him. We got a letter saying it might be ADHD, but we moved and it never happened.'</blockquote>" +
            "<h4>Local authority records</h4><ul>" +
            "<li>Age 7 report: 'Kieran finds it extremely difficult to stay in his seat and needs constant redirection.'</li>" +
            "<li>Age 8 report: 'Kieran's work is rarely finished. He loses his reading book and pencil case most days.'</li>" +
            "<li>Age 10 educational psychology letter: 'Difficulties with attention and impulse control are significant across settings. Literacy is two years behind. I recommend referral to CAMHS for assessment of possible ADHD.'</li>" +
            "<li>Youth offending team assessment at 14: 'impulsive, poor concentration, daily cannabis use'.</li></ul>" +
            "<p>Childhood tally: inattention 7, hyperactivity-impulsivity 8. Collateral rating: parent 2, school 2.</p>",
          q: {
            q: "Records show attention and restlessness problems at ages 7 to 10, before his first cannabis use at 13. How does this affect the substance-use differential?",
            options: [
              "It makes a substance-induced explanation unlikely, because the symptoms began before any substance use. ADHD and substance use disorders can then both be diagnosed",
              "It has no bearing, because cannabis causes ADHD",
              "It means his substance use is not a problem"
            ],
            a: 0,
            why: "Temporal order is a core test. In the WHO World Mental Health surveys, ADHD began first in 95-99% of people with both ADHD and a substance use disorder. Contemporaneous records from before first use settle the question of onset. Both conditions are present and both need treatment."
          }
        },
        {
          title: "Differentials, risk and validity",
          html: "<table><thead><tr><th>Area</th><th>Findings</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>Antisocial personality disorder</td><td>Conduct disorder before 15. Adult unlawful acts, irritability and irresponsibility. Some planned offending for gain; remorse for the assault</td><td>Antisocial traits; criteria may be met. Structured personality assessment by forensic psychology before the label is used</td></tr>" +
            "<tr><td>Cannabis and cocaine use</td><td>Dependence on both before custody; abstinent four months in a controlled environment</td><td>Co-occurring; early remission</td></tr>" +
            "<tr><td>Alcohol</td><td>AUDIT 14 before custody; violence when drunk</td><td>Increasing risk; release planning</td></tr>" +
            "<tr><td>Learning needs</td><td>Reading age about 10; manages work tasks and daily life independently</td><td>Possible specific reading difficulty; intellectual disability not suspected. Specialist literacy assessment via education</td></tr>" +
            "<tr><td>Brain injury</td><td>Two brief losses of consciousness at 17 and 22, long after ADHD symptoms began</td><td>Not the explanation; documented</td></tr>" +
            "<tr><td>Mood and psychosis</td><td>No episodes of depression or elevated mood. Brief paranoia only during heavy cocaine use; none now</td><td>No current disorder</td></tr>" +
            "<tr><td>Risk</td><td>Self-harm at 17; none since. Violence linked to alcohol. No current suicidal thoughts</td><td>Safety plan; shared with the in-reach team</td></tr>" +
            "<tr><td>Validity</td><td>Asked for a named medicine (stimulants can be traded in prison). Account consistent across sessions; denies several items; initially minimised problems; matches records written long before any incentive</td><td>Credible</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Kieran asks for 'the same tablets my cellmate has'. How should this request influence the assessment?",
            options: [
              "It proves he is drug-seeking, so ADHD should not be diagnosed",
              "It should be ignored, because people in prison are entitled to treatment",
              "Prescribe the same medicine as his cellmate, for consistency",
              "Note it as an incentive and a diversion risk. Check his account against independent records (here the educational psychology letter at 10 predates any incentive). If ADHD is diagnosed, plan treatment with diversion in mind"
            ],
            a: 3,
            why: "CADDRA links antisocial patterns with stimulant-seeking and diversion, and NICE NG87 1.7.4 requires a risk assessment for substance misuse and diversion before medication. A request is not proof of feigning: weigh it against evidence that could not have been shaped by the incentive. The offenders consensus (Young 2018) describes clear drug-seeking for stimulants as rare in the authors' experience, and recommends non-stimulants such as atomoxetine where it is a concern."
          }
        },
        {
          title: "Conclusion, treatment planning and release",
          html: "<h4>Feedback</h4><blockquote>'There's a lot of evidence, going back to when you were 7, that you've had ADHD all along. It doesn't excuse what happened, but it helps explain why school and work kept going wrong, and it's treatable.'</blockquote>" +
            "<h4>Plan</h4><ul>" +
            "<li>Psychoeducation about ADHD for Kieran and, with consent, for the wing and education staff.</li>" +
            "<li>Environmental modifications now: shorter education tasks with breaks, written appointment slips, a workshop role that allows movement, and instructions given one at a time.</li>" +
            "<li>Before medication: the NICE NG87 1.7.4 baseline (cardiovascular history, pulse, blood pressure, weight, height) and a documented diversion risk assessment.</li>" +
            "<li>Medication options agreed with the prison pharmacy: supervised daily administration of a modified-release stimulant, or atomoxetine (not a controlled drug) if diversion concerns remain.</li>" +
            "<li>Substance misuse service in custody, with relapse prevention for release.</li>" +
            "<li>Literacy support and specialist assessment through prison education.</li>" +
            "<li>Release planning started now: GP registration, a community ADHD or shared-care arrangement, substance misuse services, and a summary for probation (with consent) suggesting written appointment details and reminders.</li>" +
            "<li>Structured personality assessment by forensic psychology.</li></ul>",
          q: {
            q: "Which treatment plan best fits the custody setting?",
            options: [
              "Immediate-release stimulants handed out in weekly in-cell packs",
              "No treatment until release, because prison is not a suitable setting",
              "After the NICE NG87 1.7.4 baseline, supervised administration of a modified-release stimulant, or a non-stimulant such as atomoxetine where diversion is a concern, with psychoeducation and continuity planned with the GP, probation and community services before release",
              "Medication only, because psychological approaches do not work in prison"
            ],
            a: 2,
            why: "The offenders consensus (Young 2018) describes modified-release stimulants and non-stimulants as practical choices in prison, notes that controlled-drug dispensing logistics can disrupt treatment, and recommends atomoxetine where there is clear stimulant-seeking. It stresses multimodal care, multi-agency liaison and preparation for release. Weekly in-cell packs of an immediate-release stimulant carry a high diversion risk, and withholding treatment until release wastes a chance to help."
          }
        }
      ],
      profile: {
        adultIA: 7, adultHI: 7, childIA: 7, childHI: 8,
        impairment: "Severe: permanent school exclusion at 13, no job lasting more than four months, repeated offending linked to impulsivity, and four adjudications in custody. Present in the workshop, education and on the wing, and across childhood settings."
      },
      answer: {
        conclusion: "ADHD, combined presentation, severe. Symptoms are documented from age 7 (school reports, an educational psychology letter at 10 recommending ADHD assessment, the youth offending record and his mother's account), years before cannabis use began at 13. They persist after four months of confirmed abstinence in custody, across the workshop, education and the wing. Cannabis and cocaine dependence co-occur and are in early remission in a controlled environment. Antisocial traits with a conduct disorder history are present; a structured personality assessment is recommended before any personality disorder diagnosis is made.",
        codes: "ADHD combined presentation: DSM-5-TR F90.2; ICD-11 6A05.2. Cannabis dependence, early full remission: ICD-11 6C41.21. Cocaine dependence, early full remission: ICD-11 6C45.21. DSM-5-TR equivalents: cannabis use disorder and stimulant (cocaine) use disorder, in early remission, in a controlled environment.",
        ddx: [
          "Conduct disorder history and antisocial personality traits: present; structured personality assessment recommended",
          "Cannabis dependence: co-occurring; early remission in custody",
          "Cocaine dependence: co-occurring; early remission in custody",
          "Alcohol (AUDIT 14 before custody): increasing risk; plan for release",
          "Specific learning disorder (reading): possible; specialist assessment through prison education",
          "Intellectual disability: not suspected (independent in daily life and work tasks)",
          "Traumatic brain injury: two mild injuries at 17 and 22, after ADHD began; not the explanation",
          "Psychosis: brief paranoia only during heavy cocaine use; none now",
          "Non-credible report: incentive noted (stimulant request); account matches records written long before any incentive"
        ],
        teaching: [
          "ADHD is common in custody: about 26% of adults in detention in a meta-analysis of 102 studies (Baggio 2018). NICE NG87 1.2.1 lists people known to the criminal justice system as a higher-prevalence group.",
          "Adapt the assessment: read questionnaires aloud, check literacy and communication needs, explain the limits of confidentiality, and lean on records, because offenders often recall childhood poorly and minimise impairment (Young 2018).",
          "Look past externalising behaviour. ADHD needs inattention or hyperactivity independent of rule-breaking; conduct-dissocial problems alone typically lack these (ICD-11).",
          "Use abstinent periods: symptoms that persist after months of negative drug tests cannot be explained by intoxication or withdrawal (Crunelle 2018).",
          "Temporal order matters: ADHD began first in 95-99% of people with both ADHD and a substance use disorder (WHO World Mental Health surveys). Records from before first use are decisive.",
          "Treat a stimulant request as an incentive and a diversion risk, not a verdict. Check it against independent records, and plan supervised modified-release or non-stimulant treatment (Young 2018; NICE NG87 1.7.4).",
          "Do not rush a personality disorder label, and plan continuity before release with the GP, probation and community services."
        ]
      }
    }
  ]);
})(window.AA);
