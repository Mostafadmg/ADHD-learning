/* Assessor training modules 1-4 (ARCHITECTURE.md 5.7).
   m1 Adult ADHD: what you are assessing; m2 The diagnostic criteria in depth;
   m3 The assessment pathway and guidelines; m4 Screening and rating scales.
   UK practice (NICE NG87) is the default frame; international guidance is included.
   DSM-5-TR and ICD-11 are paraphrased for teaching, not reproduced. DIVA wording is not used.
   NICE text is quoted sparingly with attribution. Facts come from the research briefs of
   21 October 2026 (guidelines-uk, guidelines-intl, tools-adhd); anything else is labelled
   "clinical practice". The WFADHD 2026 update is a preprint and is flagged as such. */
(function (AA) {
  'use strict';

  AA.add('learn', [

    /* ================================================================== */
    /* Module 1                                                             */
    /* ================================================================== */
    {
      id: "m1", n: 1, minutes: 35,
      title: "Adult ADHD: what you are assessing",
      summary: "What adult ADHD is and how common it is. How it changes from childhood to adult life, what it costs people, which myths mislead assessors, and why getting the diagnosis right matters in both directions.",
      objectives: [
        "State the best current estimates of adult ADHD prevalence, persistence and heritability, and explain why published figures differ.",
        "Describe how ADHD presents in adults: inner restlessness, persistent inattention, executive difficulties, mind-wandering, and emotional dysregulation as an associated feature.",
        "Explain the impairments and outcomes linked to adult ADHD and ask about them in a structured way, including strengths.",
        "Recognise the common myths that lead to missed or mistaken diagnoses and answer each with evidence.",
        "Weigh the harms of missed ADHD against the harms of over-diagnosis and misdiagnosis, and name the assessment habits that reduce both."
      ],
      sections: [
        {
          h: "What you are actually assessing",
          html:
            "<p>Attention deficit hyperactivity disorder (ADHD) is a neurodevelopmental condition. It is a persistent pattern of inattention and/or hyperactivity-impulsivity. The pattern starts in childhood, is out of keeping with the person's developmental level, shows up across settings and interferes with daily life. NICE updated NG87 in January 2023 to reflect that ADHD is now recognised as a neurodevelopmental disorder.</p>" +
            "<p>In an adult assessment you are not asking 'does this person struggle with attention?'. Almost everyone does at times. You are testing a specific claim with five parts:</p>" +
            "<ol>" +
            "<li><strong>A trait, not a state.</strong> The difficulties are long-standing and typical of the person. UKAAN describes ADHD symptoms as trait-like: they may fluctuate through the day, but they should not be episodic or a change from an earlier baseline (AQAS 2024).</li>" +
            "<li><strong>Childhood roots.</strong> Several symptoms were present before age 12, even if nobody named them at the time.</li>" +
            "<li><strong>Enough symptoms, often enough.</strong> In adults, 5 or more of the 9 symptoms in at least one list (inattention, or hyperactivity-impulsivity) for at least 6 months.</li>" +
            "<li><strong>Across settings, with real cost.</strong> Symptoms show up in two or more settings and cause at least moderate impairment (NICE NG87 1.3.3).</li>" +
            "<li><strong>No better explanation.</strong> Another condition, a substance, a medicine or a medical problem does not account for the picture better.</li>" +
            "</ol>" +
            "<p>The NHS England ADHD Taskforce describes ADHD symptoms as a spectrum in the population, 'like blood pressure' (Part 1, 2025). The analogy is useful. As with hypertension, the diagnosis draws a line on a continuum, and the line is justified by consequences, not by the presence of a few traits. 'Everyone is a bit ADHD' is true of traits. It is false of the disorder.</p>" +
            "<h4>Why adult assessment is different</h4>" +
            "<ul>" +
            "<li>Childhood has to be reconstructed from memory, informants and records, decades later.</li>" +
            "<li>Adults have had years to build compensations, so symptoms can be hidden by effort, routines or other people.</li>" +
            "<li>Co-occurring conditions are the rule. Many adults first present with what looks like a primary mood or anxiety disorder, and may receive years of ineffective treatment if ADHD is missed (CADDRA 4.1, chapter 3).</li>" +
            "<li>Some people arrive with a firm self-diagnosis from social media or a questionnaire. Others have strong reasons to want, or to avoid, the label.</li>" +
            "</ul>" +
            "<p>So adult assessment is investigative. It needs open questions, concrete examples, more than one source of information and a systematic search for other explanations.</p>" +
            "<h4>What you are not doing</h4>" +
            "<p>You are not judging character, effort or intelligence. You are not confirming a questionnaire result. And you are not running a test: no rating scale, neuropsychological test or brain scan can make the diagnosis on its own (WFADHD 2021; UKAAN AQAS 2024).</p>"
        },
        {
          h: "How common is adult ADHD?",
          html:
            "<p>The figure you quote depends on how ADHD is defined and measured. Know the main estimates and what each one measures.</p>" +
            "<table><thead><tr><th>Estimate</th><th>What it measures</th><th>Source</th></tr></thead><tbody>" +
            "<tr><td>2.5%</td><td>Adults meeting diagnostic criteria; meta-analysis of 6 studies, over 5,300 people</td><td>Simon 2009, cited in WFADHD 2021</td></tr>" +
            "<tr><td>2.8%</td><td>Adults meeting criteria in the WHO World Mental Health surveys; over 26,000 people</td><td>Fayyad 2017, cited in WFADHD 2021 and Kooij 2019</td></tr>" +
            "<tr><td>2.6%</td><td>Persistent, childhood-onset adult ADHD; 20 studies, about 107,000 people</td><td>WFADHD 2026 update (preprint, not peer reviewed)</td></tr>" +
            "<tr><td>6.7%</td><td>'Symptomatic' adult ADHD when childhood onset is not required</td><td>WFADHD 2026 update (preprint)</td></tr>" +
            "<tr><td>2.2%, falling to 1.5% at 50+</td><td>Older adults, rating-scale studies</td><td>Dobrosavljevic 2020, cited in WFADHD 2021</td></tr>" +
            "<tr><td>0.2%</td><td>People aged 50+ with a recorded clinical diagnosis</td><td>Dobrosavljevic 2020</td></tr>" +
            "<tr><td>5.9%</td><td>Children and young people</td><td>Willcutt 2012, cited in WFADHD 2021</td></tr>" +
            "</tbody></table>" +
            "<p>Three lessons follow.</p>" +
            "<ol>" +
            "<li><strong>A sensible working figure is about 2.5 to 3% of adults.</strong> The WFADHD 2026 update (preprint) also describes about 3% worldwide.</li>" +
            "<li><strong>The childhood-onset rule does real work.</strong> Dropping it more than doubles the estimate (2.6% to 6.7%). Many adults have ADHD-like symptoms for other reasons. Criterion B is not a formality.</li>" +
            "<li><strong>Method matters.</strong> Rating-scale studies give higher figures than clinical diagnoses. In people over 50, the gap between 1.5% and 0.2% suggests that many older adults with ADHD have never been diagnosed, although rating scales also over-count.</li>" +
            "</ol>" +
            "<p>WFADHD (2021) found no increase in true prevalence over three decades, although diagnosis rates have risen. England has never run an adult population survey of ADHD prevalence (UKAAN, 2026). The Adult Psychiatric Morbidity Survey reports the share of adults screening positive on the 6-item ASRS: 8.2% in 2007 and 13.9% in 2024. That is a screening rate, not a prevalence (DHSC independent review 2026). Module 4 shows why most screen positives will not have ADHD.</p>" +
            "<h4>Sex and gender</h4>" +
            "<p>In clinical samples of children, boys are diagnosed 5 to 9 times as often as girls. In community samples of children the ratio is about 3 to 1, and in adults it is close to 1 to 1 (Kooij 2019). The gap between clinic and community suggests that girls are missed. NICE NG87 1.2.2 asks clinicians to be aware that girls and women are less likely to be referred, more likely to be undiagnosed, and more likely to receive an incorrect diagnosis of another condition.</p>" +
            "<h4>Where you will meet it</h4>" +
            "<p>NICE NG87 1.2.1 lists groups with higher prevalence. For adults these include people with a mental health condition, a history of substance misuse, epilepsy, acquired brain injury, another neurodevelopmental condition, a close family member with ADHD, people born preterm and people in the criminal justice system. UKAAN estimates that 17 to 22% of patients in secondary-care mental health services may have undiagnosed ADHD (Asherson 2022). In prisons, prevalence by interview diagnosis is about 20.5% (WFADHD 2021).</p>"
        },
        {
          h: "Persistence from childhood into adult life",
          html:
            "<p>ADHD is not something everyone grows out of, but it does not persist unchanged either. Published persistence figures vary widely. Learn why.</p>" +
            "<table><thead><tr><th>Finding</th><th>What was counted</th><th>Source</th></tr></thead><tbody>" +
            "<tr><td>About 1 in 6 still meet full criteria at age 25; about half show residual impairment</td><td>Full DSM criteria, or partial remission</td><td>Faraone 2006 meta-analysis, cited in WFADHD 2021</td></tr>" +
            "<tr><td>About one third of those diagnosed in childhood remain impaired in adulthood</td><td>Impairment</td><td>WHO ICD-11 CDDR 2024</td></tr>" +
            "<tr><td>Two thirds or more continue to have impairment into adulthood</td><td>Impairment</td><td>Kooij 2019</td></tr>" +
            "<tr><td>60 to 86% persist into adulthood</td><td>Varies by study definition</td><td>Cherkasova 2021, cited in the Australian guideline summary (May 2023)</td></tr>" +
            "</tbody></table>" +
            "<p>The spread comes from three choices: whether 'persistence' means full criteria, any impairing symptoms, or partial remission; whether adult thresholds were applied (early studies used the child threshold of 6); and whose report was used. Kooij (2019) notes that prevalence and persistence rates rise when parent reports are used.</p>" +
            "<h4>What tends to change</h4>" +
            "<ul>" +
            "<li>Hyperactivity usually declines with age and may show only as physical restlessness (ICD-11 CDDR).</li>" +
            "<li>Inattention tends to persist while hyperactivity and impulsivity fall (WFADHD 2021). Inattention often becomes more obvious as demands at work and home rise.</li>" +
            "<li>ICD-11 lists factors linked to persistence: co-occurring disorders, lower intellectual functioning, poorer social functioning and behavioural problems.</li>" +
            "</ul>" +
            "<h4>Late presentation is common; late onset is doubtful</h4>" +
            "<p>Many adults were never assessed as children. Their symptoms were there, but parents, teachers or high ability held things together. RCPsych notes that scaffolding from parents and schools can mask symptoms in childhood (CR235 9.2). ICD-11 says that some people first come to attention when demands exceed their capacity to compensate. That is <em>late presentation</em>.</p>" +
            "<p>True <em>late onset</em>, with no symptoms before 12, is a different claim. Most apparent late-onset cases still meet the 'several symptoms by 12' rule. In the long-term MTA follow-up, most late-onset cases had another explanation: non-impairing fluctuations, a co-occurring disorder, or the effects of substance use (Kooij 2019, section 5.3). BAP (2014) states that the literature does not support a disorder of later onset without childhood symptoms. ICD-11 adds that an acute or abrupt onset in adolescence or adulthood should raise the possibility of another cause, such as an emerging psychosis or bipolar disorder.</p>" +
            "<p>Questions that separate the two:</p>" +
            "<blockquote>'Before secondary school, how were you different from the other children in class? What did your reports say?'</blockquote>" +
            "<blockquote>'When did these difficulties start to cause problems? Before that, were the signs there but someone or something was carrying you?'</blockquote>" +
            "<blockquote>'Was there a time in your life when you were organised and on top of things? What was different then?'</blockquote>" +
            "<p>A clear 'yes' to the last question, with a sharp change afterwards, should send you looking for a state cause first.</p>"
        },
        {
          h: "Genes, environment and family",
          html:
            "<p>ADHD is one of the most heritable conditions in psychiatry. A review of 37 twin studies estimated heritability at about 74% (Faraone and Larsson 2018, cited in WFADHD 2021). The DSM-5-TR text cites the same figure (Koutsoklenis 2023). Kooij (2019) gives about 76% for children. First-degree relatives have a 4 to 5 times higher risk than the general population, with prevalence around 20% (Kooij 2019).</p>" +
            "<h4>An important adult nuance</h4>" +
            "<p>Twin studies of adults that rely only on <em>self-rated</em> symptoms give much lower heritability, around 30 to 40%. Studies that combine informants or use clinical diagnoses give 70 to 80%, the same range as in children (Kooij 2019). The likely reason is that adults vary in how well they can rate themselves. The clinical lesson is direct: <strong>self-report alone may under-capture or distort adult symptoms</strong>, so seek other sources.</p>" +
            "<h4>Many small effects</h4>" +
            "<p>ADHD is polygenic. Genome-wide studies of more than 20,000 people with ADHD show that most cases arise from many small genetic and environmental effects acting together (WFADHD 2021). There is no single gene and no genetic test. Environmental factors such as preterm birth (NICE NG87 1.2.1) and severe early deprivation (Kooij 2019) are best described as correlates that raise risk, not single causes (WFADHD 2021).</p>" +
            "<h4>What this means in the clinic</h4>" +
            "<ul>" +
            "<li><strong>Always take a family history</strong> of ADHD and other neurodevelopmental conditions. Adults are often referred after their child is diagnosed and they recognise themselves (clinical practice).</li>" +
            "<li><strong>Informants may share the traits.</strong> A parent with ADHD may see the child's behaviour as normal, or may remember little of it (UKAP females consensus, 2020). Ask for concrete examples, not general judgements.</li>" +
            "<li><strong>Heritability describes populations, not individuals.</strong> A family history raises the prior probability. It does not make the diagnosis.</li>" +
            "<li><strong>Heritable does not mean untreatable.</strong> Say this plainly to patients who fear that 'genetic' means 'permanent and hopeless'.</li>" +
            "</ul>"
        },
        {
          h: "How ADHD looks in adults",
          html:
            "<p>The 18 DSM-5-TR symptoms were written mainly with children in mind. DSM-5 added adult examples, and both DSM-5-TR and ICD-11 describe how symptoms change with age. Your job is to translate each symptom into the adult's world.</p>" +
            "<table><thead><tr><th>Area</th><th>Typical in childhood</th><th>Typical in adulthood</th></tr></thead><tbody>" +
            "<tr><td>Hyperactivity</td><td>Running, climbing, leaving the seat in class</td><td>Inner restlessness, discomfort with being still, fidgeting, pacing, choosing active work; sitting still only with effort; using sport or alcohol to calm down (Kooij 2019; ICD-11)</td></tr>" +
            "<tr><td>Inattention</td><td>Daydreaming, unfinished schoolwork, lost kit</td><td>Missed deadlines, lost documents and keys, unpaid bills, lateness, half-finished projects, slow and effortful paperwork</td></tr>" +
            "<tr><td>Impulsivity</td><td>Blurting out, pushing in, not waiting</td><td>Interrupting in meetings, impulsive spending, walking out of jobs, starting relationships quickly, risky driving (Kooij 2019; ICD-11)</td></tr>" +
            "<tr><td>Inner experience</td><td>Rarely described</td><td>Mind-wandering, many thoughts at once, a mind that will not switch off (Kooij 2019; RCPsych CR235 9.3)</td></tr>" +
            "<tr><td>Emotion</td><td>Tantrums, low frustration tolerance</td><td>Irritability, short temper, quick mood shifts that settle within hours (Kooij 2019)</td></tr>" +
            "<tr><td>Sleep</td><td>Bedtime battles</td><td>Trouble getting to sleep because the mind keeps going (RCPsych CR235 9.3)</td></tr>" +
            "</tbody></table>" +
            "<h4>Executive difficulties</h4>" +
            "<p>Clinicians often describe adult ADHD as a disorder of executive function: planning, organising, managing time, starting tasks, holding information in mind and checking your own work. Several DSM symptoms are executive in nature, such as organising (A1e), avoiding sustained mental effort (A1f) and daily forgetfulness (A1i). But executive problems are not specific to ADHD: depression, brain injury, sleep loss and many other conditions cause them. And executive tests are not a diagnostic gate. BAP (2014) notes that executive tests have good positive but poor negative predictive value: normal results do not exclude ADHD.</p>" +
            "<h4>Hyperfocus</h4>" +
            "<p>Many adults describe hours of intense focus on things they find interesting or instantly rewarding, such as games or online chat (Kooij 2019). ICD-11 notes that inattention may not be evident during intensely stimulating or rewarding activities. The problem in ADHD is regulating attention, not a total absence of it.</p>" +
            "<h4>Emotional dysregulation: an associated feature</h4>" +
            "<p>DSM-5 lists emotional dysregulation as an associated feature that supports the diagnosis. It is not one of the 18 criteria (Kooij 2019). ICD-11 also lists it among associated features. RCPsych CR235 (9.3) reports affective instability in up to 90% of adults with ADHD. It shows as irritability, frustration, anger, low frustration tolerance, temper outbursts and mood lability. The changes are short-lived and reactive, often to daily events, with a quick return to baseline within a few hours (Kooij 2019). That differs from the sustained change of a depressive or manic episode, and usually lacks the intense fear of abandonment, identity disturbance and chronic emptiness of borderline personality disorder (Kooij 2019; CADDRA 4.1).</p>" +
            "<h4>Women, masking and high ability</h4>" +
            "<ul>" +
            "<li>Women more often have inattentive symptoms (ICD-11) and internalising, affective and sleep problems (CR235 9.2). School reports may say 'daydreaming, distracted, disorganised' rather than 'disruptive' (UKAP females consensus 2020).</li>" +
            "<li>Compensation can mask symptoms. Many people show no visible hyperactivity, and inattentive problems may emerge only at university or work (Australian guideline 2.1.7).</li>" +
            "<li>High intelligence moderates the picture and can delay diagnosis through compensation (Kooij 2019).</li>" +
            "<li>Sitting calmly in clinic does not exclude ADHD (Kooij 2019; CR235 9.2). Do not rely on what you see in the room (CADDRA 4.1).</li>" +
            "</ul>" +
            "<h4>Questions that open up the adult picture</h4>" +
            "<blockquote>'When you have to sit through a long meeting or a film, what is it like inside?'</blockquote>" +
            "<blockquote>'What goes on in your head when you are trying to get to sleep?'</blockquote>" +
            "<blockquote>'When something annoys you, how fast does it blow up, and how long until you feel settled again?'</blockquote>" +
            "<blockquote>'What systems do you use to keep on top of things? What happens when they fail?'</blockquote>"
        },
        {
          h: "Impairment, outcomes and strengths",
          html:
            "<p>ADHD matters because of what it does to lives. WFADHD (2021) concluded that people with ADHD are at increased risk of low quality of life, substance use disorders, accidental injuries, educational under-achievement, unemployment, gambling, teenage pregnancy, social difficulties, delinquency, suicide and premature death.</p>" +
            "<h4>Mortality and suicide</h4>" +
            "<ul>" +
            "<li>A Danish study of almost 2 million people found a small increase in premature death, mostly from accidents, and higher when other psychiatric or substance use disorders were present (Dalsgaard 2015).</li>" +
            "<li>In 2.6 million Swedes, adults with ADHD had a small increase in premature death, mostly from accidents and suicide (Sun 2019).</li>" +
            "<li>In a Danish cohort of 2.9 million people, rates of suicide attempts and deaths were about four times higher in ADHD, and more than ten times higher when another psychiatric diagnosis was present (Fitzgerald 2019).</li>" +
            "</ul>" +
            "<p>So risk assessment is part of every ADHD assessment, not an optional extra. Use the Safety and risk step every time.</p>" +
            "<h4>Co-occurring conditions</h4>" +
            "<p>Lifetime comorbidity in adult ADHD is 60 to 80% (Kooij 2019). In the WHO World Mental Health data, adults with ADHD had any anxiety disorder in 34%, any mood disorder in 22%, a behavioural disorder in 15% and a substance use disorder in 11% (Kooij 2019). Physical conditions are also more common, including obesity, asthma, allergy, diabetes, hypertension, sleep problems and epilepsy (WFADHD 2021).</p>" +
            "<h4>Burden in daily life</h4>" +
            "<p>Kooij (2019) lists the burden to ask about: accidents, frequent job changes, financial problems, gambling, relationship problems including intimate partner violence, early addiction, smoking, self-harm and suicide attempts, offending, and physical ill health. UKAAN asks for impairment to be recorded under education, employment, leisure, family and close relationships, friendships, daily tasks and self-image (AQAS 2024). The app's impairment domains follow this list and add safety.</p>" +
            "<h4>Symptom versus impairment</h4>" +
            "<p>A symptom is a behaviour. Impairment is its cost. 'I lose my keys' is a symptom. 'I have been locked out four times this year and paid for a locksmith twice' is impairment. Ask for both. A good follow-up question after every symptom:</p>" +
            "<blockquote>'What has that cost you, at work, at home or with people?'</blockquote>" +
            "<h4>Strengths</h4>" +
            "<p>The Australian guideline asks assessors to record strengths and protective factors (recommendations 2.1.2 and 2.1.3). NICE NG87 1.4.3 lists building on strengths among the positives of a diagnosis. Ask about strengths directly:</p>" +
            "<blockquote>'What are you good at? What do people value in you? When do you work at your best?'</blockquote>" +
            "<p>Two cautions. First, strengths are not evidence against ADHD. High achievement does not rule it out, and the label 'high-functioning' can hide a large burden (AQAS 2024; WFADHD 2021). Judge impairment against what the person could do without the symptoms, and at what cost. Second, avoid promising that ADHD brings particular gifts. The evidence for specific ADHD-linked strengths is limited. Record this person's strengths, not a stereotype (clinical practice).</p>"
        },
        {
          h: "Common myths and what the evidence says",
          html:
            "<p>Myths cause both errors: missed ADHD and mistaken ADHD. You will hear them from patients, families, referrers and colleagues. Have an evidence-based answer ready.</p>" +
            "<table><thead><tr><th>Myth</th><th>What the evidence says</th></tr></thead><tbody>" +
            "<tr><td>ADHD is a childhood condition that people grow out of.</td><td>About 1 in 6 still meet full criteria at 25 and about half have residual impairment. Adult prevalence is 2.5 to 2.8% (WFADHD 2021).</td></tr>" +
            "<tr><td>You cannot have ADHD if you did well at school or have a degree.</td><td>ADHD impairs highly intelligent people and can be diagnosed in them (WFADHD 2021). Good school performance does not rule it out (CADDRA 4.1). Do not exclude on achievement (AQAS 2024; CR235).</td></tr>" +
            "<tr><td>If they can focus on a game for hours, it is not ADHD.</td><td>Attention can be normal or intense for highly stimulating or rewarding tasks (ICD-11 CDDR; Kooij 2019). Ask about routine, low-interest tasks.</td></tr>" +
            "<tr><td>They sat still for two hours, so it is not ADHD.</td><td>Calm in clinic does not exclude ADHD (Kooij 2019; CR235 9.2; CADDRA 4.1).</td></tr>" +
            "<tr><td>Everyone is a bit ADHD.</td><td>Traits are dimensional. The disorder needs enough symptoms, since childhood, across settings, with at least moderate impairment (NICE NG87 1.3.3).</td></tr>" +
            "<tr><td>A positive ASRS means ADHD.</td><td>A screen identifies 'possible ADHD'. Many positives are false positives, and a screen is not a diagnosis (NHSE Taskforce Part 2, 2025; DHSC 2026; NICE NG87 1.3.2).</td></tr>" +
            "<tr><td>A computer test or brain scan can prove it.</td><td>No biomarker, cognitive or imaging test is accurate enough to diagnose ADHD (AQAS 2024; WFADHD 2021). NICE treats QbTest in adults as research only (HTG729).</td></tr>" +
            "<tr><td>If stimulants help, it must be ADHD.</td><td>Medication response is not a diagnostic test. The diagnosis must stand on the assessment, and NICE asks for criteria to be confirmed before medication starts (NG87 1.7.4; clinical practice).</td></tr>" +
            "<tr><td>ADHD can start in adulthood.</td><td>The literature does not support a later-onset disorder without childhood symptoms (BAP 2014). Most apparent late onsets meet the 'several by 12' rule or have another explanation (Kooij 2019). Late presentation is common.</td></tr>" +
            "<tr><td>You cannot have ADHD and autism.</td><td>Since DSM-5, both can be diagnosed. NICE says not to exclude ADHD because of autism (NG87 1.3.3).</td></tr>" +
            "<tr><td>With depression, anxiety or drug use, you cannot assess ADHD.</td><td>Co-occurring conditions are common and do not rule ADHD out (WFADHD 2021). Comorbidity should not be a barrier to assessment, but a major mood disorder should be treated first (CR235 section 10).</td></tr>" +
            "<tr><td>ADHD is massively over-diagnosed (or under-diagnosed) everywhere.</td><td>Both errors happen. The DHSC independent review (2026) could not conclude that over-diagnosis is happening at scale, but found the balance of risk shifting towards misdiagnosis and over-diagnosis, while under-recognition continues for some groups.</td></tr>" +
            "</tbody></table>" +
            "<p>When a patient raises a myth, do not argue. Explain what the assessment will look at instead:</p>" +
            "<blockquote>'Doing well at school doesn't rule ADHD in or out. What I need to understand is how hard it was, what it cost you, and what happened when the support fell away.'</blockquote>"
        },
        {
          h: "Why an accurate diagnosis matters both ways",
          html:
            "<p>Every assessment can go wrong in two directions. A careful assessor keeps both in mind at once.</p>" +
            "<table><thead><tr><th>Missed ADHD (false negative)</th><th>Mistaken ADHD (false positive)</th></tr></thead><tbody>" +
            "<tr><td>Years of treatment for anxiety or depression alone, without much benefit (CADDRA 4.1). The DHSC review (2026) warns that undiagnosed ADHD may be mistaken for anxiety or depression alone.</td><td>The real cause is missed: depression, bipolar disorder, trauma, a sleep disorder, substance use, a thyroid problem or a medicine.</td></tr>" +
            "<tr><td>Women and girls given another diagnosis instead (NICE NG87 1.2.2).</td><td>Unnecessary exposure to medication and its monitoring, and possible misuse or diversion of stimulants.</td></tr>" +
            "<tr><td>Continuing risk of accidents, offending, substance misuse and suicide. In observational studies, ADHD treatment is associated with fewer injuries, less substance misuse, less criminal activity and fewer suicide attempts (WFADHD 2021).</td><td>A label that may shape identity, careers and insurance, and that others may later doubt.</td></tr>" +
            "<tr><td>Loss of self-understanding: many adults describe a lifetime of being called lazy or careless.</td><td>Public and professional trust in ADHD diagnoses is eroded, and services are diverted from people who need them.</td></tr>" +
            "</tbody></table>" +
            "<h4>What raises the risk of error</h4>" +
            "<p>The DHSC independent review (2026) found that misdiagnosis is more likely when assessment is brief, not face to face, fragmented, made without informants or records, or focused on a single condition. Non-credible responding is also real. In samples of adults referred for ADHD, mostly in North American clinics, 15 to 31% failed symptom or performance validity measures. In one study, 71% of people with suspect effort would have been diagnosed from the interview alone (Marshall 2016). Module 4 and the Symptom validity and consistency step cover this in detail.</p>" +
            "<h4>What protects against both errors</h4>" +
            "<ul>" +
            "<li>Open, example-based interviewing for each of the 18 symptoms, adult and childhood, rather than a tick-box checklist (AQAS 2024).</li>" +
            "<li>Evidence from childhood that does not depend only on the patient's memory: informants and school reports.</li>" +
            "<li>Impairment rated domain by domain, with examples.</li>" +
            "<li>A systematic search for other explanations, using the Differential protocol.</li>" +
            "<li>Attention to validity: incentives, consistency and over-reporting, without assuming bad faith.</li>" +
            "<li>Honest outcomes, including 'not ADHD' and 'below the threshold'. NICE NG87 1.4.4 says people whose symptoms fall short of a diagnosis may still benefit from information and support.</li>" +
            "</ul>" +
            "<h4>The assessor's stance</h4>" +
            "<p>Be curious, neutral and evidence-seeking. Start without a conclusion. Let the person tell their story in their own words, then test it against the criteria, other sources and the alternatives. A good assessment feels thorough to the patient whatever the outcome, and a reader of your report can see how you reached your decision.</p>"
        }
      ],
      keyPoints: [
        "Adult ADHD affects about 2.5 to 3% of adults worldwide. Published figures depend on how ADHD is defined and measured.",
        "You are testing a specific claim: a trait-like pattern, several symptoms before 12, enough symptoms often enough, two or more settings, at least moderate impairment, and no better explanation.",
        "About 1 in 6 young people with ADHD still meet full criteria at 25 and about half have residual impairment. Late presentation is common; true late onset is doubtful.",
        "Hyperactivity often becomes inner restlessness. Inattention, executive difficulties and mind-wandering tend to persist.",
        "Emotional dysregulation is an associated feature, not a criterion. It is brief and reactive and returns to baseline within hours.",
        "Heritability is about 74%. Adult self-report alone under-captures symptoms, so seek informants and records.",
        "ADHD is linked to accidents, substance misuse, unemployment, suicide and premature death. Assess risk every time.",
        "High achievement, calm in clinic and hyperfocus do not exclude ADHD. A positive screen does not confirm it.",
        "Missed and mistaken diagnoses both cause harm. Multi-source, example-based assessment with a systematic differential reduces both."
      ],
      pitfalls: [
        "Dismissing an adult referral because ADHD is 'a childhood disorder' or because the person has a degree or a good job.",
        "Treating traits that 'everyone has' as the disorder and skipping the impairment threshold.",
        "Ruling ADHD out because the person sat still in clinic or can focus on games for hours.",
        "Counting emotional dysregulation as one of the 18 symptoms. It supports the picture but is not a criterion.",
        "Accepting 'adult-onset ADHD' without first searching for mood, trauma, sleep, substance or medical causes of recent difficulties.",
        "Quoting a screen-positive rate as if it were a prevalence.",
        "Relying only on the patient's account when adult self-report is known to be incomplete."
      ],
      quiz: [
        { q: "Which figure best reflects the prevalence of ADHD in adults in international meta-analyses?",
          options: ["About 0.5%", "About 2.5 to 3%", "About 7%", "About 14%"], a: 1,
          why: "Meta-analyses give 2.5% (Simon 2009) and 2.8% (Fayyad 2017), as summarised by WFADHD 2021. About 14% is the share of adults in England screening positive on the ASRS in 2024, which is a screening rate, not a prevalence. 6.7% is the preprint estimate when childhood onset is not required." },
        { q: "The WFADHD 2026 update (preprint) found an adult prevalence of 2.6% when childhood onset was required and 6.7% when it was not. What is the main lesson for assessors?",
          options: ["Childhood onset can safely be skipped in adults", "Adult ADHD is far more common than current guidelines assume", "The preprint replaces the DSM-5-TR prevalence figures", "The childhood-onset requirement does real work in separating ADHD from other causes of adult symptoms"], a: 3,
          why: "Dropping the onset requirement more than doubles the estimate, because many adults have ADHD-like symptoms for other reasons. Criterion B is not a formality. The update is a preprint and does not replace any criteria." },
        { q: "According to the Faraone 2006 meta-analysis cited by WFADHD 2021, what happens to young people with ADHD by age 25?",
          options: ["About 1 in 6 still meet full criteria, and about half show residual impairment", "Almost all have fully recovered", "About 9 in 10 still meet full criteria", "All still meet full criteria, because ADHD is lifelong"], a: 0,
          why: "About one in six meet full criteria at 25 and about half show residual impairment (partial remission). Other estimates differ because they count impairment or use different thresholds and informants." },
        { q: "A 41-year-old engineer sits calmly through a two-hour assessment. Which statement about adult hyperactivity is best supported?",
          options: ["Hyperactivity is usually more visible in adults than in children", "Calm behaviour in clinic rules out the hyperactive-impulsive symptoms", "In adults it often shows as inner restlessness and discomfort with being still", "Adults cannot have the predominantly hyperactive-impulsive presentation"], a: 2,
          why: "Hyperactivity usually declines and may show only as restlessness (ICD-11). Sitting calmly does not exclude ADHD (Kooij 2019; CR235). Ask about the inner experience and about other settings." },
        { q: "How does DSM-5 treat emotional dysregulation in ADHD?",
          options: ["As a tenth inattention symptom", "As an exclusion that points to borderline personality disorder", "As an associated feature that supports the diagnosis, but not a criterion", "As the basis of the severity specifier"], a: 2,
          why: "DSM-5 lists emotional dysregulation as an associated feature supporting the diagnosis (Kooij 2019). It is not among the 18 symptoms, so it cannot count towards criterion A." },
        { q: "Priya, 29, says she cannot have ADHD because she can spend six hours absorbed in coding puzzles. What is the best response?",
          options: ["Explain that attention can be intense for highly stimulating or rewarding tasks, so this does not exclude ADHD, then ask about routine low-interest tasks", "Agree that this rules ADHD out", "Record this as evidence of autism", "Offer a QbTest to settle the question"], a: 0,
          why: "ICD-11 notes that inattention may not be evident in intensely stimulating or rewarding activities, and Kooij 2019 describes hyperfocus. The question is how attention works on tasks that are not rewarding. Hyperfocus alone says nothing about autism, and QbTest is research only in adults." },
        { q: "Adult twin studies using only self-rated symptoms give heritability of about 30 to 40%, while studies using informants or clinical diagnoses give 70 to 80%. What is the most useful clinical inference?",
          options: ["Adult ADHD is mainly environmental", "Informants are always more accurate than patients", "Genetic testing should be added for adults", "Adult self-report alone may under-capture symptoms, so seek other sources of evidence"], a: 3,
          why: "Kooij 2019 attributes the gap to variable self-awareness when adults rate themselves. Heritability is similar in children and adults when better measures are used. There is no genetic test for ADHD, and informants are not always more accurate." },
        { q: "A referral letter says: 'ADHD unlikely: first-class degree and a senior job.' What is the best reply?",
          options: ["Agree: high achievement excludes ADHD", "High achievement does not exclude ADHD; the assessment will look at impairment, effort and cost, and what happens when support falls away", "Ask for an IQ test before accepting the referral", "Accept the referral only if the ASRS is positive"], a: 1,
          why: "WFADHD 2021 states that ADHD can be diagnosed in highly intelligent people, and AQAS warns against ruling ADHD out on achievement. IQ testing is not required (BAP 2014), and a screen should not be used to exclude people (NHSE Taskforce)." },
        { q: "Which statement about apparent adult-onset ADHD is best supported?",
          options: ["Most apparent late-onset cases either met the 'several symptoms before 12' rule or had another explanation", "Late-onset ADHD is a well-established separate disorder", "ICD-11 allows onset at any age without caution", "Late onset should be coded as combined presentation"], a: 0,
          why: "Kooij 2019 (section 5.3) reports that most apparent late-onset cases met the age-12 rule or were explained by fluctuations, comorbidity or substance use. BAP 2014 does not support a later-onset disorder. ICD-11 warns that an abrupt late onset suggests another cause." },
        { q: "A Danish cohort of 2.9 million people found suicide attempts and deaths about four times more common in ADHD, and more than ten times more common with another psychiatric diagnosis. What should you do with this in practice?",
          options: ["Assess suicide risk only in children with ADHD", "Skip risk assessment if there is no depression", "Assess risk in every ADHD assessment, and look harder when another condition is present", "Avoid asking about suicide because it may raise risk"], a: 2,
          why: "Fitzgerald 2019 (cited in WFADHD 2021) shows raised risk in ADHD and much higher risk with comorbidity. UKAAN AQAS makes risk assessment essential in every assessment." },
        { q: "Which features did the DHSC independent review (2026) link to a higher risk of misdiagnosis?",
          options: ["Long assessments that include informants", "Brief, remote, fragmented assessments made without informants or records and focused on a single condition", "Using DSM-5-TR rather than ICD-11", "Assessments by consultant psychiatrists"], a: 1,
          why: "The review lists brief, not face to face, fragmented, without access to informants or records, and focused on a single condition as risk factors for misdiagnosis." },
        { q: "The Adult Psychiatric Morbidity Survey found that 13.9% of adults in England screened positive on the ASRS in 2024. What is the best interpretation?",
          options: ["About 14% of adults in England have ADHD", "ADHD prevalence has risen fivefold since 2007", "The ASRS is too insensitive for population use", "A screen-positive rate is not a prevalence, and most screen positives will not have ADHD"], a: 3,
          why: "If true prevalence is around 3%, then even a perfectly sensitive screen would mean that at most about 3 in 14 screen positives have ADHD. WFADHD 2021 found no rise in true prevalence over three decades. The DHSC review stresses that screening positive is not a diagnosis." }
      ],
      refs: [
        "NICE NG87. Attention deficit hyperactivity disorder: diagnosis and management (2018, updated 2019; minor updates 2023 and 2025; last reviewed July 2026). Recommendations 1.2.1, 1.2.2, 1.3.2, 1.3.3, 1.4.3, 1.4.4, 1.7.4.",
        "Faraone SV et al. The World Federation of ADHD International Consensus Statement: 208 evidence-based conclusions about the disorder. Neurosci Biobehav Rev 2021;128:789-818 (cites Simon 2009, Fayyad 2017, Faraone 2006, Willcutt 2012, Dobrosavljevic 2020, Faraone and Larsson 2018, Dalsgaard 2015, Sun 2019, Fitzgerald 2019).",
        "Faraone SV et al. WFADHD International Consensus Statement: 2026 update. PsyArXiv preprint, October 2026 (not peer reviewed).",
        "Kooij JJS et al. Updated European Consensus Statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019;56:14-34.",
        "World Health Organization. ICD-11 Clinical descriptions and diagnostic requirements for mental, behavioural and neurodevelopmental disorders (CDDR), 2024: 6A05.",
        "Koutsoklenis A, Honkasilta J. ADHD in the DSM-5-TR: what has changed and what has not. Front Psychiatry 2023;13:1064141.",
        "Adamou M et al. The adult ADHD assessment quality assurance standard (UKAAN AQAS). Front Psychiatry 2024;15:1380410.",
        "Asherson P et al. Mainstreaming adult ADHD into primary care in the UK. BMC Psychiatry 2022;22:640.",
        "Young S et al. Females with ADHD: an expert consensus statement (UKAP). BMC Psychiatry 2020;20:404.",
        "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023), sections 9-10.",
        "Bolea-Alamañac B et al. BAP evidence-based guidelines for the pharmacological management of ADHD. J Psychopharmacol 2014;28:179-203.",
        "CADDRA. Canadian ADHD Practice Guidelines, 4.1 edition (2020), chapters 1-3.",
        "May T et al. The Australian evidence-based clinical practice guideline for ADHD. Aust N Z J Psychiatry 2023;57:1101-1116.",
        "NHS England. Report of the independent ADHD Taskforce, Part 1 (June 2025) and Part 2 (November 2025).",
        "Department of Health and Social Care. Independent review into mental health conditions, ADHD and autism: final report (October 2026).",
        "Marshall PS et al. Psychol Assess 2016;28:1290-1302 (non-credible presentations in adult ADHD referrals)."
      ]
    },

    /* ================================================================== */
    /* Module 2                                                             */
    /* ================================================================== */
    {
      id: "m2", n: 2, minutes: 45,
      title: "The diagnostic criteria in depth",
      summary: "DSM-5-TR criteria A to E taken clause by clause with adult examples, the meaning of 'often', thresholds, presentations, severity, remission and the 'other specified' categories, ICD-11 6A05, and how DIVA 2.0 and DIVA-5 apply the rules. Ends with worked examples.",
      objectives: [
        "Apply each DSM-5-TR criterion (A to E) to an adult, including the 6-month window, the per-list threshold of 5 from age 17, and the onset, settings, impairment and exclusion rules.",
        "Judge whether a symptom happens 'often' using frequency, comparison with peers, settings and consequences, and avoid the common scoring errors.",
        "Assign presentation, severity, partial remission or other specified and unspecified ADHD correctly, with the matching codes.",
        "Explain how ICD-11 6A05 differs from DSM-5-TR and how NICE NG87 1.3.3 adds the UK impairment threshold.",
        "Explain the DIVA 2.0 (DSM-IV) rules, why DIVA-5 exists, and how this app's interview relates to both."
      ],
      sections: [
        {
          h: "The structure: five criteria, all required",
          html:
            "<p>DSM-5-TR (American Psychiatric Association, 2022) uses the same ADHD criteria as DSM-5 (2013). Only the surrounding text changed (Koutsoklenis 2023; APA DSM-5-TR updates 2022 to 2025). All five criteria must be met. This module paraphrases them for teaching. Use the DSM-5-TR itself for formal diagnosis, and the Diagnostic criteria page in this app as a quick reference.</p>" +
            "<table><thead><tr><th>Criterion</th><th>In short</th><th>The adult assessor's question</th></tr></thead><tbody>" +
            "<tr><td>A</td><td>A persistent pattern of inattention and/or hyperactivity-impulsivity: enough symptoms, often, for 6 months or more</td><td>Which of the 18 symptoms are present now, with real examples?</td></tr>" +
            "<tr><td>B</td><td>Several symptoms before age 12</td><td>What is the evidence from childhood, and from whom?</td></tr>" +
            "<tr><td>C</td><td>Several symptoms in two or more settings</td><td>Where do they show: work, home, social life, study?</td></tr>" +
            "<tr><td>D</td><td>Clear evidence of interference with, or reduced quality of, functioning</td><td>What has it cost the person? (NICE: at least moderate)</td></tr>" +
            "<tr><td>E</td><td>Not only during psychosis, and not better explained by another mental disorder</td><td>What else could explain this, and does it explain it better?</td></tr>" +
            "</tbody></table>" +
            "<p>Then you specify the <strong>presentation</strong> (combined, predominantly inattentive or predominantly hyperactive-impulsive), and may add <strong>severity</strong> and <strong>partial remission</strong>. If impairing symptoms fall short of the criteria, DSM-5-TR offers <strong>other specified</strong> and <strong>unspecified</strong> ADHD.</p>" +
            "<p>A useful habit: write the five letters in your notes and do not reach a conclusion until each one has a verdict and a reason. The Scoring and diagnosis step does this for you, but the reasoning must be yours.</p>"
        },
        {
          h: "Criterion A: the symptoms, clause by clause",
          html:
            "<p>Criterion A has an opening sentence and two lists of nine symptoms: A1 inattention and A2 hyperactivity-impulsivity. Four qualifiers in the opening apply to every symptom:</p>" +
            "<ol>" +
            "<li><strong>Persistence:</strong> lasting 6 months or longer.</li>" +
            "<li><strong>Developmental mismatch:</strong> at a degree out of keeping with the person's developmental level. For an adult, compare with others of similar age, education and culture.</li>" +
            "<li><strong>Direct impact:</strong> the symptoms have a direct negative effect on social, academic or occupational activities.</li>" +
            "<li><strong>Not merely something else:</strong> the symptoms are not solely oppositional behaviour, defiance, hostility, or failure to understand tasks or instructions. In adults, think also of low literacy, language barriers and intellectual disability.</li>" +
            "</ol>" +
            "<p>The table gives each symptom in plain words, an adult example of the kind you may hear, and a common reason <em>not</em> to count it. The exclusions are clinical practice, informed by the ICD-11 CDDR boundaries.</p>" +
            "<table><thead><tr><th>Code</th><th>Symptom (paraphrased)</th><th>Adult example</th><th>Do not count when</th></tr></thead><tbody>" +
            "<tr><td>A1a</td><td>Misses details, careless mistakes</td><td>Payments sent to the wrong account; reports returned with errors a reread would catch</td><td>Errors only when exhausted, or only in one weak skill such as spelling</td></tr>" +
            "<tr><td>A1b</td><td>Hard to keep attention on tasks or activities</td><td>Rereads the same page; drifts off during long calls</td><td>Present only while depressed or anxious</td></tr>" +
            "<tr><td>A1c</td><td>Seems not to listen when addressed directly</td><td>Partner says, 'you nod, but you're not there'</td><td>Hearing loss, or not following the language</td></tr>" +
            "<tr><td>A1d</td><td>Does not follow through; leaves duties unfinished</td><td>Half-decorated rooms; several courses started, none finished</td><td>Stops because of fatigue or loss of interest in a depressive episode</td></tr>" +
            "<tr><td>A1e</td><td>Trouble organising tasks, time and belongings</td><td>No system for paperwork; deadlines missed; chronically late</td><td>Disorganisation only since a new baby, a bereavement or a crisis</td></tr>" +
            "<tr><td>A1f</td><td>Avoids or dislikes sustained mental effort</td><td>Tax return left until the penalty letter arrives</td><td>Avoidance driven only by fear of failure, or by a reading difficulty</td></tr>" +
            "<tr><td>A1g</td><td>Loses things needed for tasks</td><td>Keeps replacing bank cards, chargers and keys</td><td>Ordinary occasional losses</td></tr>" +
            "<tr><td>A1h</td><td>Easily distracted, in adults including by unrelated thoughts</td><td>Pulled off task by notifications, noises or their own ideas</td><td>Intrusive trauma memories, or worry content in anxiety</td></tr>" +
            "<tr><td>A1i</td><td>Forgetful in daily activities</td><td>Misses appointments; forgets to return calls or pay bills</td><td>New forgetfulness in mid-life (think of cognitive, medical or mood causes)</td></tr>" +
            "<tr><td>A2a</td><td>Fidgets, taps, squirms</td><td>Leg bouncing in meetings; always fiddling with something</td><td>Akathisia from medication, or tics</td></tr>" +
            "<tr><td>A2b</td><td>Leaves seat when expected to stay seated</td><td>Up and down during meetings, meals or films</td><td>Leaving to escape anxiety, or for a physical reason</td></tr>" +
            "<tr><td>A2c</td><td>Restlessness (in children, running or climbing)</td><td>Feels wired and unable to settle</td><td>Leg discomfort only at rest in the evening (restless legs), or anxiety</td></tr>" +
            "<tr><td>A2d</td><td>Cannot do leisure activities quietly</td><td>Loud in quiet places; cannot enjoy a calm hobby</td><td>Exuberance in one situation only</td></tr>" +
            "<tr><td>A2e</td><td>Always on the go, as though driven by a motor</td><td>Others find them exhausting; cannot sit through a long meal</td><td>A recent rise in energy with less need for sleep (think of hypomania)</td></tr>" +
            "<tr><td>A2f</td><td>Talks excessively</td><td>Told they dominate every conversation</td><td>Pressured speech during a mood episode</td></tr>" +
            "<tr><td>A2g</td><td>Blurts out answers; finishes others' sentences</td><td>Answers before the question is finished</td><td>A cultural or family conversational style without impact</td></tr>" +
            "<tr><td>A2h</td><td>Trouble waiting their turn</td><td>Abandons queues; furious in slow traffic</td><td>Irritability only in a depressive or withdrawal state</td></tr>" +
            "<tr><td>A2i</td><td>Interrupts or intrudes on others</td><td>Takes over tasks; uses others' things without asking</td><td>Deliberate dominance without impulsivity</td></tr>" +
            "</tbody></table>" +
            "<p>The Question bank holds alternative wordings, many adult and childhood examples, probes and calibration anchors for every symptom.</p>"
        },
        {
          h: "What 'often' means, and how to score a symptom",
          html:
            "<p>Every DSM symptom begins with 'often'. DSM-5-TR does not define it with a number. NICE NG87 1.3.3 also requires symptoms to be 'happening often'. So 'often' is a clinical judgement, and you need a consistent way to make it.</p>" +
            "<h4>Four tests for 'often' (clinical practice)</h4>" +
            "<ol>" +
            "<li><strong>How often?</strong> Most days or most weeks, not a handful of times a year.</li>" +
            "<li><strong>Compared with whom?</strong> Clearly more than most people of the same age, education and culture.</li>" +
            "<li><strong>Where?</strong> In more than one situation, not tied to one task, person or stressor.</li>" +
            "<li><strong>So what?</strong> It has consequences that the person or others notice.</li>" +
            "</ol>" +
            "<p>Rating scales show that frequency words carry different weight for different behaviours. On the ASRS v1.1, some items count from 'Sometimes' (items 1 to 3, 9, 12, 16 and 18) and the rest from 'Often'. The form explains that the frequency-based response is more sensitive with certain questions. In the interview, likewise, weigh frequency against how unusual the behaviour is. Leaving your seat in a meeting a few times a month is more unusual than losing focus in a dull report.</p>" +
            "<h4>Questions that get to frequency without leading</h4>" +
            "<blockquote>'Tell me about the last time that happened.'</blockquote>" +
            "<blockquote>'In a typical week, how many times would that happen?'</blockquote>" +
            "<blockquote>'Is that more than your friends or colleagues, or about the same?'</blockquote>" +
            "<blockquote>'If I asked your partner, what would they say?'</blockquote>" +
            "<h4>Scoring present, unsure or absent</h4>" +
            "<ul>" +
            "<li><strong>Present:</strong> at least one clear, recent, specific example, a frequency that passes the four tests, and ideally support from another source or the record.</li>" +
            "<li><strong>Unsure:</strong> plausible but vague, or examples only from one situation. Do not force a decision. Seek more examples or collateral, and revisit.</li>" +
            "<li><strong>Absent:</strong> no convincing examples, or examples that fit something else better.</li>" +
            "</ul>" +
            "<h4>Common scoring errors</h4>" +
            "<ul>" +
            "<li>Counting a symptom from one vivid story or one bad month.</li>" +
            "<li>Accepting 'all the time' without a single concrete example.</li>" +
            "<li>Counting symptoms that appear only during a depressive, manic or anxious period, or only when intoxicated or in withdrawal.</li>" +
            "<li>Counting one behaviour twice. A missed appointment is usually forgetfulness (A1i) or poor time management (A1e), not both. Pick the best fit (clinical practice).</li>" +
            "<li>Dismissing a well-compensated symptom. If the person copes only by heavy reliance on alarms, lists and a partner, ask what happens when the support fails and what the effort costs. The symptom may still be present (clinical practice).</li>" +
            "<li>Leading the patient. UKAAN makes open questions an essential standard because closed checklists risk confirmation bias (AQAS 2024).</li>" +
            "</ul>"
        },
        {
          h: "Thresholds: 5 versus 6, and why it matters",
          html:
            "<p>DSM-5-TR sets the threshold <strong>per list</strong>:</p>" +
            "<ul>" +
            "<li>Up to age 16: <strong>6 or more</strong> of the 9 inattention symptoms, and/or 6 or more of the 9 hyperactivity-impulsivity symptoms.</li>" +
            "<li>From age 17: <strong>5 or more</strong> in either list.</li>" +
            "</ul>" +
            "<p>The threshold applies to each list separately. Four inattentive plus four hyperactive-impulsive symptoms make eight in total, but criterion A is <strong>not</strong> met, because neither list reaches five.</p>" +
            "<p>The age refers to the person's age now, at assessment. A 16-year-old in a transition clinic still needs six. The app applies five from age 17 and six below.</p>" +
            "<h4>Why five in adults</h4>" +
            "<p>DSM-IV used six at every age. The APA lowered the adult threshold in DSM-5 because a lower threshold was enough for reliable diagnosis in adults (APA DSM-5 ADHD fact sheet, 2013). Kooij (2019) notes compelling evidence that four current symptoms may be the most appropriate adult cut-off, and that DSM-5 chose five because of concern about artificially raising prevalence. DIVA 2.0 has a footnote citing research that supports four or more in adults. These are research positions. The rule you apply is five.</p>" +
            "<h4>The childhood count</h4>" +
            "<p>Criterion B needs 'several' symptoms before 12, not six. DSM-5-TR gives no number. The DIVA Foundation's own pages conflict: a 2019 note interprets 'several' as three or more in either list, while the current DIVA-5 instructions page says at least six. This app uses three or more as a working guide and asks you to confirm it. That is an app convention, not a DSM-5-TR rule.</p>" +
            "<h4>Rating-scale thresholds are not criteria</h4>" +
            "<p>Some scale-scoring rules still use the DSM-IV threshold of six. For example, the ASRS v1.1 subtype profile treats six or more shaded items in a list as 'symptomatic' (Adler 2019). An ASRS count is a frequency proxy. The criterion count comes from your interview.</p>"
        },
        {
          h: "Criteria B, C and D: onset, settings and impairment",
          html:
            "<h4>Criterion B: several symptoms before age 12</h4>" +
            "<ul>" +
            "<li>DSM-IV required some <em>impairing</em> symptoms before age <em>7</em>. DSM-5 requires <em>several symptoms</em> before <em>12</em>. Impairment before 12 is not required, and neither is a childhood diagnosis.</li>" +
            "<li>The APA moved the age because children identified after 7 did not differ in course, severity, outcome or treatment response (APA fact sheet 2013).</li>" +
            "<li>Evidence comes from the person's recall, a parent or older sibling, school reports and childhood records. Adult recall of childhood is unreliable on its own (Mannuzza 2002), so look for independent sources.</li>" +
            "<li>NICE NG87 1.3.3 says an uncertain time of onset should not by itself exclude the diagnosis. ICD-11 says that without corroboration an adult diagnosis should be made with caution. Both are compatible: record what you have, weigh it, and explain your reasoning.</li>" +
            "</ul>" +
            "<blockquote>'Think about primary school. What would a teacher have said about you at parents' evening?'</blockquote>" +
            "<h4>Criterion C: several symptoms in two or more settings</h4>" +
            "<ul>" +
            "<li>DSM-IV required some <em>impairment</em> in two settings. DSM-5 requires <em>several symptoms</em> in two or more settings, such as home, work or study, with friends or relatives, or in other activities.</li>" +
            "<li>NICE NG87 1.3.3 asks for symptoms happening often in two or more important settings, including social, family, educational or occupational settings.</li>" +
            "<li>NICE uses 'settings' for places (home, work) and 'domains' for areas of functioning (relationships, attainment, risk awareness). Keep the two ideas separate in your notes.</li>" +
            "<li>Symptoms seen only at work with one manager, or only at home during a crisis, point to a situational cause.</li>" +
            "</ul>" +
            "<h4>Criterion D: interference with functioning</h4>" +
            "<ul>" +
            "<li>DSM-5-TR asks for clear evidence that symptoms interfere with, or reduce the quality of, social, academic or occupational functioning.</li>" +
            "<li>NICE NG87 1.3.3 sets the UK bar at <strong>at least moderate</strong> psychological, social, educational or occupational impairment, based on interview or direct observation in multiple settings.</li>" +
            "<li>UKAAN asks for at least moderate impairment in two or more domains and for the report to list them (AQAS 2024).</li>" +
            "<li>Judge impairment against what the person could manage without the symptoms. Do not exclude high achievers: ask what achievement cost them and what help it needed (AQAS 2024; CR235).</li>" +
            "</ul>" +
            "<blockquote>'If these difficulties disappeared tomorrow, what would be different in your life?'</blockquote>" +
            "<p>The Onset and impairment step records B, C and D with a 0 to 3 severity rating and examples for each domain.</p>"
        },
        {
          h: "Criterion E and the exclusions",
          html:
            "<p>Criterion E has two parts. The symptoms do not occur only during schizophrenia or another psychotic disorder. And they are not better explained by another mental disorder, such as a mood, anxiety, dissociative or personality disorder, or substance intoxication or withdrawal.</p>" +
            "<h4>'Better explained' is not the same as 'also present'</h4>" +
            "<p>Co-occurring conditions are common and allowed. Criterion E fails only when the other condition accounts for the symptoms and their timing better than ADHD does. The key tool is the life-course timeline: ADHD is trait-like and lifelong, while depression, mania, anxiety disorders and trauma reactions usually have an onset you can date (RCPsych CR235 9.7).</p>" +
            "<h4>Rules from ICD-11 that help with criterion E</h4>" +
            "<ul>" +
            "<li><strong>Depression:</strong> poor concentration and restlessness during a depressive episode count towards ADHD only if they were present since childhood and persist after the episode resolves.</li>" +
            "<li><strong>Bipolar disorder:</strong> inattention, impulsivity and overactivity are typical of mania and hypomania. Late onset, episodes and the intensity of mood elevation point to bipolar disorder.</li>" +
            "<li><strong>Anxiety:</strong> inattention must not be solely due to anxious preoccupation, or occur only in situations that provoke anxiety.</li>" +
            "<li><strong>Learning disorder:</strong> if inattention appears only during tasks in the area of a learning difficulty, diagnose the learning disorder, not ADHD.</li>" +
            "<li><strong>Substances and medicines:</strong> ICD-11 explicitly excludes symptoms due to a substance or medication, including withdrawal. It names carbamazepine, valproate, risperidone, bronchodilators and thyroid replacement as medicines that can cause ADHD-like symptoms. Check the order of onset and whether symptoms persist when the person is not intoxicated.</li>" +
            "<li><strong>Nervous system disease</strong> is also an ICD-11 exclusion.</li>" +
            "</ul>" +
            "<h4>Autism is not an exclusion</h4>" +
            "<p>DSM-IV excluded ADHD in pervasive developmental disorders. DSM-5 removed this, and NICE NG87 1.3.3 says that exclusion on the basis of a pervasive developmental disorder is not recommended. Both diagnoses can be made. Do not count the same behaviour twice for both conditions (UKAP ADHD and autism consensus 2020).</p>" +
            "<h4>Write it down</h4>" +
            "<p>UKAAN makes it essential that the report states that the symptoms are not better explained by another disorder, as a distinct criterion (AQAS 2024). Use the Differential protocol to show which conditions you considered and why you reached each verdict.</p>"
        },
        {
          h: "Presentation, severity, partial remission and other specified ADHD",
          html:
            "<h4>Presentation: the past 6 months</h4>" +
            "<table><thead><tr><th>Presentation</th><th>Rule (past 6 months)</th><th>ICD-10-CM</th></tr></thead><tbody>" +
            "<tr><td>Combined</td><td>A1 and A2 both met</td><td>F90.2</td></tr>" +
            "<tr><td>Predominantly inattentive</td><td>A1 met, A2 not met</td><td>F90.0</td></tr>" +
            "<tr><td>Predominantly hyperactive-impulsive</td><td>A2 met, A1 not met</td><td>F90.1</td></tr>" +
            "</tbody></table>" +
            "<p>DSM-5 replaced 'subtype' with 'presentation' because the picture can change over a lifetime (Kooij 2019). Someone combined as a child is often predominantly inattentive as an adult. The presentation describes the current picture. The DIVA 2.0 score form uses the same logic: if childhood and adult subtypes differ, the adult one is used. Note that 'predominantly inattentive' does not mean 'no hyperactivity': a person with seven inattentive and four hyperactive-impulsive symptoms is predominantly inattentive.</p>" +
            "<p>WHO ICD-10 codes differ from the US ICD-10-CM codes above (in WHO ICD-10, F90.0 is 'disturbance of activity and attention'). State which code set you use.</p>" +
            "<h4>Severity (DSM-5-TR, paraphrased)</h4>" +
            "<ul>" +
            "<li><strong>Mild:</strong> few, if any, symptoms beyond those required, and no more than minor impairment.</li>" +
            "<li><strong>Moderate:</strong> between mild and severe.</li>" +
            "<li><strong>Severe:</strong> many symptoms beyond those required, or several particularly severe symptoms, or marked impairment.</li>" +
            "</ul>" +
            "<p>A UK subtlety: NICE NG87 1.3.3 requires at least moderate impairment for diagnosis. A DSM-5-TR 'mild' case with only minor impairment may therefore not meet the NICE threshold. If you record 'mild', explain how the impairment still reaches the NICE bar.</p>" +
            "<h4>Partial remission</h4>" +
            "<p>Use this when full criteria were met in the past, fewer than full criteria have been met for the past 6 months, and the symptoms still impair social, academic or occupational functioning. It needs a documented past episode of full criteria, usually a childhood diagnosis or a previous adult assessment. Do not use it for an adult who has never met full criteria.</p>" +
            "<h4>Other specified and unspecified ADHD</h4>" +
            "<ul>" +
            "<li><strong>Other specified ADHD (ICD-10-CM F90.8):</strong> ADHD-type symptoms cause clinically significant distress or impairment but do not meet full criteria, and you record the reason, for example insufficient symptoms in either list.</li>" +
            "<li><strong>Unspecified ADHD (F90.9):</strong> the same situation when you do not give a reason, for example because information is incomplete.</li>" +
            "<li>Both replaced DSM-IV 'ADHD not otherwise specified' (Kooij 2019).</li>" +
            "</ul>" +
            "<p>In UK practice, NICE NG87 1.3.3 asks for symptoms that meet the diagnostic criteria. An 'other specified' label records real difficulties that fall short. NICE NG87 1.4.4 says that people whose symptoms and impairment fall short of a diagnosis may still benefit from information and support. Treatment decisions in such cases are a specialist judgement and should be explained in the report (clinical practice).</p>"
        },
        {
          h: "ICD-11 6A05 and how it differs",
          html:
            "<p>ICD-11 codes ADHD as 6A05 in the chapter on neurodevelopmental disorders. The WHO Clinical Descriptions and Diagnostic Requirements (CDDR, 2024) describe essential features and deliberately avoid artificially precise cut-offs. NICE NG87 1.3.3 accepts DSM-5 or ICD-11. Its wording still says 'hyperkinetic disorder in DSM-5 or ICD-11', although ICD-11 uses the term ADHD.</p>" +
            "<table><thead><tr><th>Element</th><th>DSM-5-TR</th><th>ICD-11 (CDDR)</th></tr></thead><tbody>" +
            "<tr><td>Symptoms</td><td>18 fixed items</td><td>Symptom clusters, 'typically' drawn from these</td></tr>" +
            "<tr><td>Count</td><td>6 or more per list up to 16; 5 or more from 17</td><td>'Several', with no fixed number</td></tr>" +
            "<tr><td>Duration</td><td>At least 6 months</td><td>For example, at least 6 months (guidance, not a rigid cut-off)</td></tr>" +
            "<tr><td>Onset</td><td>Several symptoms before 12</td><td>Significant symptoms before 12; some first present later, when demands exceed compensation</td></tr>" +
            "<tr><td>Settings</td><td>Several symptoms in 2 or more settings</td><td>Evident across multiple situations or settings</td></tr>" +
            "<tr><td>Impairment</td><td>Interferes with, or reduces the quality of, functioning</td><td>Direct negative impact on academic, occupational or social functioning</td></tr>" +
            "<tr><td>Exclusions</td><td>Not only during psychosis; not better explained by another mental disorder</td><td>Not better accounted for by another mental disorder; not due to a substance or medicine, including withdrawal; not due to a disease of the nervous system</td></tr>" +
            "<tr><td>Presentations</td><td>Combined, inattentive, hyperactive-impulsive</td><td>6A05.0 inattentive, 6A05.1 hyperactive-impulsive, 6A05.2 combined, 6A05.Y other specified, 6A05.Z unspecified</td></tr>" +
            "<tr><td>Severity and remission</td><td>Mild, moderate, severe; partial remission</td><td>Neither specifier</td></tr>" +
            "<tr><td>Autism</td><td>Co-diagnosis allowed</td><td>Co-diagnosis allowed</td></tr>" +
            "</tbody></table>" +
            "<h4>Details worth knowing</h4>" +
            "<ul>" +
            "<li>ICD-11's hyperactivity-impulsivity clusters include acting on immediate stimuli without considering risk, such as impulsive decisions, injury-prone behaviour and reckless driving. These are not among the DSM's 18 items but are very relevant in adults.</li>" +
            "<li>In adolescents and adults, ICD-11 describes hyperactivity as feelings of physical restlessness and discomfort with being quiet or still.</li>" +
            "<li>'Predominantly' means several symptoms of one type with few or none of the other. ICD-11 also mentions a purely inattentive pattern, sometimes called restrictive inattentive.</li>" +
            "<li>ICD-11 calls a severe, pervasive combined pattern that the clinician can also observe the form once called hyperkinetic disorder.</li>" +
            "<li>ICD-11 values reports from a partner, family member or co-worker in adults, and advises caution when childhood history is not corroborated.</li>" +
            "<li>The older ICD-10 hyperkinetic disorder (F90) was narrower: onset before 7, symptoms needed in all three groups (inattention, overactivity and impulsivity), and exclusion if mood, anxiety or pervasive developmental disorders were present.</li>" +
            "</ul>" +
            "<p>Because ICD-11 has no fixed count, an ICD-11 diagnosis rests more on judgement. Whichever system you use, name it and show your reasoning. UKAAN asks the report to show that five or more symptoms were identified when DSM-5-TR is used (AQAS 2024).</p>"
        },
        {
          h: "DIVA 2.0, DSM-IV rules and why DIVA-5 exists",
          html:
            "<p>DIVA is the most widely used diagnostic interview in UK adult services (RCPsych in Scotland 2017). Its structure shaped this app's interview, so it helps to know how it works and where its rules differ from DSM-5-TR.</p>" +
            "<h4>How DIVA 2.0 works (Kooij and Francken, 2010)</h4>" +
            "<ul>" +
            "<li>Built on DSM-IV. Each of the 18 symptoms is explored for adulthood first, then childhood (ages 5 to 12), with examples the clinician can tick and room for the person's own examples.</li>" +
            "<li>Impairment is covered in five areas: work or education; relationships and family; social contacts; free time and hobbies; and self-confidence and self-image.</li>" +
            "<li>Collateral support is rated 0 (none or little), 1 (some) or 2 (clear), separately for parents or siblings, a partner or friend, and school reports.</li>" +
            "<li>The score form asks for 6 or more symptoms in a list, in childhood and in adulthood. A footnote notes research supporting 4 or more in adults.</li>" +
            "<li>It asks whether symptoms were present before age 7 (the DSM-IV rule) and records the age of onset if later.</li>" +
            "<li>If childhood and adult subtypes differ, the adult subtype is used. It takes about 90 minutes and does not assess other conditions, so a full psychiatric assessment is still needed.</li>" +
            "</ul>" +
            "<h4>Why DIVA-5 exists</h4>" +
            "<p>DSM-5 changed the rules DIVA 2.0 was built on: onset moved from 7 to 12, the adult threshold fell from 6 to 5, adult examples were added, 'subtype' became 'presentation', and autism stopped being an exclusion. DIVA-5 (2019) updates the interview to DSM-5, with an adult threshold of 5. Young DIVA-5 covers ages 5 to 17 and DIVA-5 ID adapts it for people with intellectual disability. The DIVA Foundation has announced a revised DIVA-5-R.</p>" +
            "<h4>Licensing</h4>" +
            "<p>DIVA-5 costs 10 euros per clinician, may be stored for personal use only, and may not be distributed. Digital versions need a contract, must be word for word, and may not be turned into an AI interview or chatbot (DIVA Foundation). DIVA 2.0 is also copyrighted. RCPsych (CR235) lists the free ACE+ interview as an alternative, and UKAAN names DIVA, CAADID and ACE+ as recommended schedules (AQAS 2024).</p>" +
            "<h4>How this app relates</h4>" +
            "<p>This app follows the same broad structure (adult then childhood for each symptom, examples, onset, impairment by area, collateral rated 0 to 2), but all questions and examples are original, and it applies DSM-5-TR rules. The Scoring and diagnosis step also shows a DIVA 2.0-style view (6 or more, DSM-IV) for comparison only. If you own DIVA-5, use it as published.</p>"
        },
        {
          h: "Worked examples: applying the rules",
          html:
            "<p>Cover the verdict column and decide for yourself first. All cases are fictional.</p>" +
            "<table><thead><tr><th>Case</th><th>Findings</th><th>Verdict and reason</th></tr></thead><tbody>" +
            "<tr><td>1. Sam, 23, student</td><td>6 inattentive and 2 hyperactive-impulsive symptoms now. Childhood: 5 inattentive, supported by a parent and school reports saying 'dreamy, unfinished work'. Moderate impairment in study and home life. No better explanation.</td><td><strong>DSM-5-TR ADHD, predominantly inattentive presentation.</strong> A1 met (5 or more from 17); several before 12; two settings; moderate impairment; E met. On DIVA 2.0 rules (6 or more in childhood) the childhood count of 5 would fall short, which shows why DIVA-5 was needed.</td></tr>" +
            "<tr><td>2. Two people with five inattentive symptoms</td><td>Identical histories. One is 16, the other 17.</td><td><strong>A met only for the 17-year-old.</strong> The threshold depends on current age: 6 up to 16, 5 from 17.</td></tr>" +
            "<tr><td>3. Alex, 35</td><td>4 inattentive and 4 hyperactive-impulsive symptoms, lifelong, moderate impairment, good collateral.</td><td><strong>DSM-5-TR criterion A not met.</strong> Lists are not added together. Consider other specified ADHD (insufficient symptoms) if clinically significant, give information (NICE NG87 1.4.4), and record your reasoning.</td></tr>" +
            "<tr><td>4. Morgan, 28</td><td>7 inattentive and 6 hyperactive-impulsive symptoms, all starting at 19 after daily cannabis use began. Parents and school describe a settled, organised child.</td><td><strong>Criterion B not met; consider a substance-related cause.</strong> Check the order of onset and reassess after a period of abstinence (ICD-11 CDDR).</td></tr>" +
            "<tr><td>5. Chris, 44</td><td>Poor concentration, restlessness and forgetfulness for 5 months, since a depressive episode began. Previously well organised; school reports positive.</td><td><strong>Not ADHD.</strong> The symptoms occur only within a mood episode and have no childhood history. Treat the depression.</td></tr>" +
            "<tr><td>6. Dana, 31</td><td>Combined picture in childhood (parent and reports). Now 6 inattentive and 3 hyperactive-impulsive symptoms, impairing at work and home.</td><td><strong>ADHD, predominantly inattentive presentation.</strong> The presentation reflects the past 6 months, not childhood.</td></tr>" +
            "<tr><td>7. Lee, 38</td><td>Diagnosed with combined ADHD by CAMHS at 9. Now 4 inattentive and 2 hyperactive-impulsive symptoms, with continuing moderate impairment at work.</td><td><strong>ADHD in partial remission.</strong> Full criteria were met before; fewer now for 6 months; impairment continues.</td></tr>" +
            "<tr><td>8. Kai, 26</td><td>5 inattentive and 5 hyperactive-impulsive symptoms, but only at work since a new manager arrived. Home, friends and partner describe no problems. Childhood unremarkable.</td><td><strong>Criteria B and C not met.</strong> The picture is situational. Explore workplace stress, anxiety or conflict.</td></tr>" +
            "<tr><td>9. Rowan, 30</td><td>9 inattentive and 8 hyperactive-impulsive symptoms since early childhood, two dismissals, large debts and a driving ban. No better explanation.</td><td><strong>ADHD, combined presentation, severe.</strong> Many symptoms beyond those required and marked impairment.</td></tr>" +
            "</tbody></table>" +
            "<p>Practise the same reasoning on full histories in Practice cases.</p>"
        }
      ],
      keyPoints: [
        "All five DSM-5-TR criteria (A to E) are needed. The criteria did not change from DSM-5 to DSM-5-TR.",
        "From age 17, 5 or more symptoms in either list for 6 months or more; up to 16, 6 or more. The threshold applies to each list separately.",
        "'Often' has no number. Judge frequency, comparison with peers, settings and consequences, with specific examples.",
        "Criterion B needs several symptoms before 12, not childhood impairment and not a childhood diagnosis. An uncertain onset alone should not exclude (NICE NG87 1.3.3).",
        "Criterion C needs several symptoms in two or more settings. Criterion D needs clear interference, and NICE adds at least moderate impairment.",
        "Criterion E: not better explained. Symptoms confined to a mood episode, anxiety, intoxication or withdrawal do not count. Autism is not an exclusion.",
        "Presentation reflects the past 6 months. Severity and partial remission are DSM-5-TR specifiers that ICD-11 does not have.",
        "ICD-11 6A05 uses 'several' symptoms with no fixed count and explicitly excludes substance, medication and nervous system causes.",
        "DIVA 2.0 applies DSM-IV rules (6 or more, onset question before 7). DIVA-5 applies DSM-5. This app follows the structure with original wording and DSM-5-TR rules."
      ],
      pitfalls: [
        "Adding inattentive and hyperactive-impulsive symptoms together to reach five.",
        "Applying the adult threshold of 5 to a 16-year-old, or the DIVA 2.0 threshold of 6 to an adult.",
        "Scoring symptoms straight from a questionnaire without interview examples.",
        "Requiring a childhood diagnosis or childhood impairment for criterion B.",
        "Counting symptoms that occur only during depression, mania, anxiety, intoxication or withdrawal.",
        "Labelling a never-diagnosed adult with subthreshold symptoms as 'in partial remission'.",
        "Leaving out the presentation, or the explicit statement that the symptoms are not better explained by another disorder."
      ],
      quiz: [
        { q: "A 19-year-old has 5 inattentive and 3 hyperactive-impulsive symptoms over the past 6 months. Which statement about criterion A is correct?",
          options: ["Not met: adults need 6 in a list", "Not met: the total across both lists must be 9 or more", "Met for inattention: from age 17, 5 in one list is enough", "Met for both lists, because the totals are combined"], a: 2,
          why: "From 17 the threshold is 5 per list. A1 is met with 5 inattentive symptoms. The lists are never combined, so A2 (3 symptoms) is not met, which points to a predominantly inattentive presentation if B to E are also met." },
        { q: "What does DSM-5-TR criterion B require?",
          options: ["Several symptoms present before age 12", "Impairing symptoms before age 7", "Six symptoms before age 12", "A diagnosis made in childhood"], a: 0,
          why: "DSM-5 moved onset from 7 to 12 and requires several symptoms, not impairment and not a diagnosis. Impairing symptoms before 7 was the DSM-IV rule." },
        { q: "Which change from DSM-IV to DSM-5 is stated correctly?",
          options: ["The onset age was lowered from 12 to 7", "Autism became an exclusion criterion", "'Subtype' replaced 'presentation'", "The adult threshold was lowered from 6 to 5 symptoms per list"], a: 3,
          why: "DSM-5 lowered the adult threshold to 5, raised the onset age from 7 to 12, removed autism as an exclusion, and replaced 'subtype' with 'presentation' (not the reverse)." },
        { q: "Mo, 34, has had poor concentration, restlessness and forgetfulness for 4 months, since a depressive episode began. School reports describe a focused pupil. How should these symptoms be handled?",
          options: ["Count them, because depression often co-exists with ADHD", "Do not count them towards ADHD: they occur only within a mood episode and have no childhood history", "Count them only if the PHQ-9 score is below 10", "Count them and record other specified ADHD"], a: 1,
          why: "ICD-11 advises that concentration problems and restlessness in a depressive episode count towards ADHD only if present since childhood and persisting after the episode resolves. Here the picture is state-like, with a clear onset." },
        { q: "Over the past 6 months a person has 7 inattentive and 4 hyperactive-impulsive symptoms, and meets B to E. What is the presentation?",
          options: ["Combined", "Predominantly inattentive", "Unspecified", "Partial remission"], a: 1,
          why: "Combined needs both A1 and A2 met. Here A2 (4 symptoms) is not met, so the presentation is predominantly inattentive, even though some hyperactive-impulsive symptoms are present." },
        { q: "What does the DSM-5-TR specifier 'in partial remission' require?",
          options: ["Fewer than 3 symptoms in each list now", "No current impairment", "A previous diagnosis of other specified ADHD", "Full criteria met in the past, fewer than full criteria for the past 6 months, and continuing impairment"], a: 3,
          why: "Partial remission needs a past period of full criteria, a current subthreshold picture for 6 months, and ongoing impairment. It should not be used for adults who have never met full criteria." },
        { q: "Which is a genuine difference between ICD-11 6A05 and DSM-5-TR?",
          options: ["ICD-11 has no fixed symptom count", "ICD-11 requires onset before age 7", "ICD-11 excludes ADHD when autism is present", "ICD-11 requires 6 symptoms in adults"], a: 0,
          why: "ICD-11 asks for 'several' symptoms and deliberately avoids fixed cut-offs. Both systems use onset before 12 and both allow co-diagnosis with autism." },
        { q: "What does NICE NG87 1.3.3 add to the DSM-5-TR impairment criterion for a UK diagnosis?",
          options: ["Impairment in three or more domains", "Impairment confirmed by a rating scale", "At least moderate impairment", "Impairment documented before age 12"], a: 2,
          why: "NICE requires at least moderate psychological, social, educational or occupational impairment, based on interview or direct observation in multiple settings, with symptoms happening often in two or more important settings." },
        { q: "Why was DIVA-5 developed?",
          options: ["DIVA 2.0 had no childhood section", "To add a self-report scoring algorithm", "To remove the need for collateral information", "DIVA 2.0 was built on DSM-IV rules, which DSM-5 changed (onset before 12, 5 adult symptoms)"], a: 3,
          why: "DIVA 2.0 follows DSM-IV: 6 or more symptoms and an onset question before 7. DSM-5 changed these, so DIVA-5 (2019) updated the interview. Both versions include childhood and collateral." },
        { q: "A patient says they lose focus 'all the time'. What should you do before scoring A1b?",
          options: ["Score it present, because the patient is the best judge", "Ask for recent specific examples, how often it happens, and how it compares with peers, in more than one setting", "Score it absent, because 'all the time' suggests exaggeration", "Score it unsure and move on without further questions"], a: 1,
          why: "'Often' is a judgement based on frequency, comparison with peers, settings and consequences. Concrete examples are needed before scoring. Unsure is appropriate only after you have tried to clarify." },
        { q: "A man with dyscalculia describes poor attention only during tasks involving numbers. Reading, conversation and other work are fine. What does ICD-11 advise?",
          options: ["Diagnose ADHD, predominantly inattentive presentation", "Diagnose both conditions automatically", "Consider a developmental learning disorder rather than ADHD", "Ignore the learning difficulty when scoring ADHD"], a: 2,
          why: "ICD-11 states that if inattention appears only during tasks in the area of a learning difficulty, the learning disorder is diagnosed rather than ADHD." },
        { q: "Which statement about the word 'often' in the DSM-5-TR criteria is correct?",
          options: ["DSM-5-TR does not define it numerically; judge frequency against peers, settings and consequences", "It means at least once a day", "It means more than three times a week by definition", "It is defined by the ASRS response 'Often'"], a: 0,
          why: "No number is given. A consistent clinical approach uses frequency, comparison with similar people, more than one situation and real consequences. ASRS response words are not definitions of the criterion." }
      ],
      refs: [
        "American Psychiatric Association. DSM-5-TR (2022): ADHD criteria A to E, specifiers and other specified or unspecified ADHD (paraphrased).",
        "American Psychiatric Association. DSM-5 ADHD fact sheet (2013): changes from DSM-IV.",
        "SAMHSA. DSM-5 changes: implications for child serious emotional disturbance (2016), Table 7 (DSM-IV to DSM-5 ADHD comparison).",
        "Koutsoklenis A, Honkasilta J. ADHD in the DSM-5-TR: what has changed and what has not. Front Psychiatry 2023;13:1064141.",
        "World Health Organization. ICD-11 CDDR (2024), 6A05 essential features, boundaries and ICD-10 crosswalk.",
        "NICE NG87 (2018, updated 2019; ICD-11 wording January 2023): recommendations 1.3.3, 1.4.4.",
        "Kooij JJS et al. Updated European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34.",
        "Kooij JJS, Francken MH. DIVA 2.0, adult ADHD diagnostic interview. DIVA Foundation, 2010 (structure described; wording not reproduced).",
        "DIVA Foundation. DIVA-5, Young DIVA-5, DIVA-5 ID, instructions and copyright pages (divacenter.eu), accessed October 2026.",
        "Adamou M et al. UKAAN Adult ADHD Assessment Quality Assurance Standard. Front Psychiatry 2024;15:1380410.",
        "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023); RCPsych in Scotland, ADHD in adults: good practice guidelines (2017).",
        "Young S et al. UKAP consensus on co-occurring ADHD and autism. BMC Med 2020;18:146.",
        "Adler LA et al. Establishing US norms for the ASRS-v1.1. Int J Clin Pract 2019;73:e13260; ASRS-v1.1 Symptom Checklist (WHO 2003).",
        "Mannuzza S et al. Accuracy of adult recall of childhood ADHD. Am J Psychiatry 2002;159:1882.",
        "US National Library of Medicine. ICD-10-CM F90 code titles."
      ]
    }

    /* MODULES_3_4 */
  ]);
})(window.AA);
