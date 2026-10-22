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
            "<p>In clinical samples of children, boys are diagnosed 5 to 9 times as often as girls. In community samples of children the ratio is about 3 to 1, and in adults it is close to 1 to 1 (Kooij 2019). The gap between clinic and community suggests that girls are missed. NICE NG87 1.2.2 asks clinicians to be aware that ADHD is thought to be under-recognised in girls and women: they are less likely to be referred, and may be more likely to be undiagnosed or to receive an incorrect diagnosis of another condition.</p>" +
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
            "<p>True <em>late onset</em>, with no symptoms before 12, is a different claim. Most apparent late-onset cases still meet the 'several symptoms by 12' rule. In the long-term MTA follow-up, most late-onset cases had another explanation: non-impairing fluctuations, a co-occurring disorder, or the effects of substance use (Kooij 2019, section 5.3). BAP (2014) states that the literature does not support a disorder of later onset without childhood symptoms. ICD-11 adds that an acute or abrupt onset of hyperactivity in adolescence or adulthood should raise the possibility of another cause, such as an emerging psychosis or bipolar disorder.</p>" +
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
            "<p>Twin studies of adults that rely only on <em>self-rated</em> symptoms give much lower heritability, around 30 to 40%. Studies that combine informants or use clinical diagnoses give 70 to 80%, the same range as in children (Kooij 2019). One suggested reason is that adults vary in how aware they are of their own symptoms. The clinical lesson is direct: <strong>self-report alone may under-capture or distort adult symptoms</strong>, so seek other sources. This is not a rule that informants are always right: Kooij (2019) notes that some research finds the adult patient the best informant, and that some adults report many symptoms with little impairment, or the reverse.</p>" +
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
            "<p>DSM-5 lists emotional dysregulation as an associated feature that supports the diagnosis. It is not one of the 18 criteria (Kooij 2019). ICD-11 also lists it among associated features. RCPsych CR235 (9.3) reports affective instability in up to 90% of adults with ADHD. It shows as irritability, frustration, anger, low frustration tolerance, temper outbursts and mood lability. The changes are short-lived and reactive, often to daily events, with a quick return to baseline within a few hours (Kooij 2019). That differs from the sustained change of a depressive or manic episode. In ADHD, anger and impulsivity tend to be short-lived and thoughtless rather than driven, and relationship conflict, self-harm, identity disturbance and fear of abandonment are usually less intense than in borderline personality disorder, where they are central (Kooij 2019; CADDRA 4.1).</p>" +
            "<h4>Women, masking and high ability</h4>" +
            "<ul>" +
            "<li>Women more often have inattentive symptoms (ICD-11) and internalising, affective and sleep problems (CR235 9.2). School reports may say 'daydreaming, distracted, disorganised' rather than 'disruptive' (UKAP females consensus 2020).</li>" +
            "<li>Compensation can mask symptoms. Many people show no visible hyperactivity, and inattentive problems may emerge only when demands rise at secondary school, university or work (Australian guideline 2.1.7).</li>" +
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
            "<tr><td>Continuing risk of accidents, offending, substance misuse and suicide. In large studies, ADHD medication is linked with fewer accidental injuries, less substance misuse, less criminal activity and less suicidal behaviour (WFADHD 2021).</td><td>A label that may shape identity, careers and insurance, and that others may later doubt.</td></tr>" +
            "<tr><td>Loss of self-understanding: many adults describe a lifetime of being called lazy or careless.</td><td>Public and professional trust in ADHD diagnoses is eroded, and services are diverted from people who need them.</td></tr>" +
            "</tbody></table>" +
            "<h4>What raises the risk of error</h4>" +
            "<p>The DHSC independent review (2026) found that misdiagnosis is more likely when assessment is brief, not face to face, fragmented, made without informants or records, or focused on a single condition. Non-credible responding is also real. In samples of adults referred for ADHD, mostly in North American clinics, 15 to 31% failed symptom or performance validity measures. In one study, 71% of people with suspect effort would have been diagnosed from the interview alone (Marshall 2016). Module 4 and the Symptom validity and consistency step cover this in detail.</p>" +
            "<h4>What protects against both errors</h4>" +
            "<ul>" +
            "<li>Open, example-based interviewing for each of the 18 symptoms, adult and childhood, rather than a tick-box checklist (AQAS 2024).</li>" +
            "<li>Evidence from childhood that does not depend only on the patient's memory: informants and school reports.</li>" +
            "<li>Impairment rated domain by domain, with examples.</li>" +
            "<li>A systematic search for other explanations, using the Differential diagnosis protocol.</li>" +
            "<li>Attention to validity: incentives, consistency and over-reporting, without assuming bad faith.</li>" +
            "<li>Honest outcomes, including 'not ADHD' and 'below the threshold'. NICE NG87 1.4.4 says people whose symptoms and impairment fall short of a diagnosis may still benefit from similar information about support.</li>" +
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
        "Heritability is about 74%. Adult self-report alone may miss or distort symptoms, so seek informants and records.",
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
        "Relying only on the patient's account when adult self-report can be incomplete or distorted."
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
            "<p>Rating scales show that frequency words carry different weight for different behaviours. On the ASRS v1.1, some items count from 'Sometimes' (items 1 to 3, 9, 12, 16 and 18) and the rest from 'Often'. In the interview, likewise, weigh frequency against how unusual the behaviour is. Leaving your seat in a meeting a few times a month is more unusual than losing focus in a dull report.</p>" +
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
            "<p>DSM-IV used six at every age. The APA lowered the adult threshold in DSM-5 because a lower threshold was enough for reliable diagnosis in adults (APA DSM-5 ADHD fact sheet, 2013). Kooij (2019) notes compelling evidence that four current symptoms may be the most appropriate adult cut-off, and that DSM-5 chose five because of concern about artificially raising prevalence. These are research positions. The rule you apply is five.</p>" +
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
            "<p>UKAAN makes it essential that the report states that the symptoms are not better explained by another disorder, as a distinct criterion (AQAS 2024). Use the Differential diagnosis protocol to show which conditions you considered and why you reached each verdict.</p>"
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
            "<p>DSM-5 replaced 'subtype' with 'presentation' because the picture can change over a lifetime (Kooij 2019). Someone combined as a child is often predominantly inattentive as an adult. The presentation describes the current picture. Note that 'predominantly inattentive' does not mean 'no hyperactivity': a person with seven inattentive and four hyperactive-impulsive symptoms is predominantly inattentive.</p>" +
            "<p>WHO ICD-10 codes differ from the US ICD-10-CM codes above: in WHO ICD-10, F90.0 is 'disturbance of activity and attention', and attention deficit without hyperactivity is coded F98.8 (ICD-11 CDDR crosswalk). State which code set you use.</p>" +
            "<h4>Severity (DSM-5-TR, paraphrased)</h4>" +
            "<ul>" +
            "<li><strong>Mild:</strong> few, if any, symptoms beyond those required, and no more than minor impairment.</li>" +
            "<li><strong>Moderate:</strong> between mild and severe.</li>" +
            "<li><strong>Severe:</strong> many symptoms beyond those required, or several particularly severe symptoms, or marked impairment.</li>" +
            "</ul>" +
            "<p>A UK subtlety: NICE NG87 1.3.3 requires at least moderate impairment for diagnosis. A DSM-5-TR 'mild' case with only minor impairment may therefore not meet the NICE threshold. If you record 'mild', explain how the impairment still reaches the NICE bar.</p>" +
            "<h4>Partial remission</h4>" +
            "<p>Use this when full criteria were met in the past, fewer than full criteria have been met for the past 6 months, and the symptoms still impair social, academic or occupational functioning. It needs good evidence that full criteria were met in the past: usually a childhood diagnosis or a previous assessment, or a well-corroborated childhood history (for example, school reports and a parent describing six or more symptoms in one list). Do not use it for an adult with no evidence of ever having met full criteria.</p>" +
            "<h4>Other specified and unspecified ADHD</h4>" +
            "<ul>" +
            "<li><strong>Other specified ADHD (ICD-10-CM F90.8):</strong> ADHD-type symptoms cause clinically significant distress or impairment but do not meet full criteria, and you record the reason, for example insufficient symptoms in either list.</li>" +
            "<li><strong>Unspecified ADHD (F90.9):</strong> the same situation when you do not give a reason, for example because information is incomplete.</li>" +
            "<li>Both replaced DSM-IV 'ADHD not otherwise specified' (Kooij 2019).</li>" +
            "</ul>" +
            "<p>In UK practice, NICE NG87 1.3.3 asks for symptoms that meet the diagnostic criteria. An 'other specified' label records real difficulties that fall short. NICE NG87 1.4.4 says that people whose symptoms and impairment fall short of a diagnosis may still benefit from similar information. Treatment decisions in such cases are a specialist judgement and should be explained in the report (clinical practice).</p>"
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
            "<li>'Predominantly' means several symptoms of one type with few or none of the other. So a person with seven inattentive and four clinically significant hyperactive-impulsive symptoms, predominantly inattentive under DSM-5-TR, may fit the ICD-11 combined presentation (a matter of judgement). ICD-11 also mentions a purely inattentive pattern, sometimes called restrictive inattentive.</li>" +
            "<li>ICD-11 notes that a severe, pervasive combined pattern, also observed by the clinician, is often referred to as hyperkinetic disorder and is regarded as the more severe form.</li>" +
            "<li>ICD-11 values reports from a partner, family member or co-worker in adults, and advises caution when childhood history is not corroborated.</li>" +
            "<li>The older ICD-10 hyperkinetic disorder (F90) was narrower: onset before 7, symptoms needed in all three groups (inattention, overactivity and impulsivity), and exclusion if mood, anxiety or pervasive developmental disorders were present.</li>" +
            "</ul>" +
            "<p>Because ICD-11 has no fixed count, an ICD-11 diagnosis rests more on judgement. Whichever system you use, name it and show your reasoning. UKAAN asks the report to show that five or more symptoms were identified when DSM-5-TR is used (AQAS 2024).</p>"
        },
        {
          h: "DIVA 2.0, DSM-IV rules and why DIVA-5 exists",
          html:
            "<p>RCPsych in Scotland (2017) called DIVA the most widely used diagnostic tool in the UK. Its structure shaped this app's interview, so it helps to know how it works and where its rules differ from DSM-5-TR.</p>" +
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
            "<p>DIVA-5 costs 10 euros per clinician, may be stored for personal use only, and may not be distributed. Digital versions need a contract, must be word for word, and may not be turned into an AI interview or chatbot (DIVA Foundation). DIVA 2.0 is free to use (CR235) but is still copyrighted. RCPsych (CR235) lists the free ACE+ interview as an alternative, and UKAAN names DIVA, CAADID and ACE+ as recommended schedules (AQAS 2024).</p>" +
            "<h4>How this app relates</h4>" +
            "<p>This app follows the same broad structure (adult then childhood for each symptom, examples, onset, impairment by area, collateral rated 0 to 2), but all questions and examples are original, and it applies DSM-5-TR rules. The Scoring and diagnosis step also shows a DIVA 2.0-style view (6 or more, DSM-IV) for comparison only. If you own DIVA-5, use it as published.</p>"
        },
        {
          h: "Worked examples: applying the rules",
          html:
            "<p>Cover the verdict column and decide for yourself first. All cases are fictional.</p>" +
            "<table><thead><tr><th>Case</th><th>Findings</th><th>Verdict and reason</th></tr></thead><tbody>" +
            "<tr><td>1. Sam, 23, student</td><td>6 inattentive and 2 hyperactive-impulsive symptoms now. Childhood: 5 inattentive, supported by a parent and school reports saying 'dreamy, unfinished work'. Moderate impairment in study and home life. No better explanation.</td><td><strong>DSM-5-TR ADHD, predominantly inattentive presentation.</strong> A1 met (5 or more from 17); several before 12; two settings; moderate impairment; E met. On the DIVA 2.0 score form (DSM-IV: 6 or more in childhood) the childhood count of 5 would fall short. DSM-5-TR asks only for several.</td></tr>" +
            "<tr><td>2. Two people with five inattentive symptoms</td><td>Identical histories. One is 16, the other 17.</td><td><strong>A met only for the 17-year-old.</strong> The threshold depends on current age: 6 up to 16, 5 from 17.</td></tr>" +
            "<tr><td>3. Alex, 35</td><td>4 inattentive and 4 hyperactive-impulsive symptoms, lifelong, moderate impairment, good collateral.</td><td><strong>DSM-5-TR criterion A not met.</strong> Lists are not added together. Consider other specified ADHD (insufficient symptoms) if clinically significant, give information (NICE NG87 1.4.4), and record your reasoning.</td></tr>" +
            "<tr><td>4. Morgan, 28</td><td>7 inattentive and 6 hyperactive-impulsive symptoms, all starting at 19 after daily cannabis use began. Parents and school describe a settled, organised child.</td><td><strong>Criterion B not met; consider a substance-related cause.</strong> Check the order of onset and whether symptoms persist when not intoxicated, ideally after a period of abstinence (ICD-11 CDDR).</td></tr>" +
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
        "Labelling an adult with subthreshold symptoms as 'in partial remission' without evidence that full criteria were ever met.",
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
    },

    /* ================================================================== */
    /* Module 3                                                             */
    /* ================================================================== */
    {
      id: "m3", n: 3, minutes: 40,
      title: "The assessment pathway and guidelines",
      summary: "What NICE NG87 and QS39 require, what UKAAN, RCPsych and BAP add, how international guidance compares, where NHS policy stood in 2025-26, how to structure and time a full adult assessment, which tool belongs at which stage, and how to document it.",
      objectives: [
        "Summarise what NICE NG87 and QS39 say about who diagnoses adult ADHD, what the diagnosis must rest on, the role of rating scales and the impairment threshold.",
        "Describe what the UKAAN quality standard, RCPsych CR235 and BAP add, and where international guidelines agree and differ.",
        "Explain the NHS policy context in 2025-26 and separate current clinical guidance from recommendations to government.",
        "Plan a full adult assessment with realistic timings, placing each tool at the right stage.",
        "Write documentation and a report that meet the UKAAN essential standards."
      ],
      sections: [
        {
          h: "The guideline map",
          html:
            "<p>Many documents shape adult ADHD assessment. They differ in status, age and purpose. Know which one to reach for.</p>" +
            "<table><thead><tr><th>Document</th><th>Status</th><th>Use it for</th></tr></thead><tbody>" +
            "<tr><td>NICE NG87, ADHD: diagnosis and management (2018; ECG change 2019; ICD-11 wording 2023; QbTest link 2025)</td><td>The national clinical guideline and the default UK reference. Last reviewed 23 July 2026 with no update planned unless new evidence emerges. The diagnosis recommendations date from 2008, some amended in 2018 or 2023.</td><td>Who diagnoses, what the diagnosis rests on, thresholds, post-diagnostic discussion, baseline checks before medication</td></tr>" +
            "<tr><td>NICE QS39 quality standard (2013, updated 2018)</td><td>Quality statements endorsed by NHS England</td><td>Referral of adults to an ADHD specialist (statement 2) and continuity from child to adult services (statement 3)</td></tr>" +
            "<tr><td>NICE HTG729 (2024; formerly DG60)</td><td>HealthTech guidance on digital tests</td><td>QbTest as an option only for ages 6 to 17; research only in adults</td></tr>" +
            "<tr><td>UKAAN Adult ADHD Assessment Quality Assurance Standard, AQAS (2024)</td><td>UK expert consensus, graded essential, highly recommended or optional; cited by the NHSE ADHD Taskforce as a quality standard; open access (CC BY)</td><td>The most detailed operational standard for adult assessment and reports</td></tr>" +
            "<tr><td>RCPsych CR235, ADHD in adults: good practice guidelines (2023)</td><td>College policy, written by RCPsych in Scotland</td><td>Practical advice on referral, interview order, differential diagnosis and comorbidity</td></tr>" +
            "<tr><td>BAP guideline (2014)</td><td>Pharmacological guideline with assessment sections; older, and some points superseded by NG87</td><td>Role of neuropsychological testing; comorbidity as a standard of care</td></tr>" +
            "<tr><td>European Consensus Statement (Kooij 2019)</td><td>Consensus of 63 experts; not a graded guideline</td><td>The adult clinical picture, instruments, late onset, high ability</td></tr>" +
            "<tr><td>CADDRA Canadian guidelines 4.1 (2020)</td><td>National guideline (Canada)</td><td>A step-by-step adult process and free clinical forms</td></tr>" +
            "<tr><td>Australian guideline, AADPA (2022)</td><td>NHMRC-approved, GRADE method, adapted from NG87; 113 recommendations</td><td>Screening of high-risk groups, strengths, assessment content</td></tr>" +
            "<tr><td>WFADHD International Consensus Statement (2021; 2026 update is a preprint)</td><td>Evidence statements based on large meta-analyses and cohorts</td><td>Prevalence, validity, outcomes and what tests cannot do</td></tr>" +
            "</tbody></table>" +
            "<p>How to use them together: NICE sets the UK minimum. AQAS turns it into an operational standard. CR235 adds practical judgement. International guidance fills gaps and offers tools. WFADHD gives the evidence base. When you cite a preprint or a policy report, say so.</p>" +
            "<p>The Assessment pathway page in this app lays out the same material stage by stage.</p>"
        },
        {
          h: "NICE NG87: who diagnoses, and on what basis",
          html:
            "<h4>Who may diagnose (1.3.1)</h4>" +
            "<p>ADHD should only be diagnosed by 'a specialist psychiatrist, paediatrician or other appropriately qualified healthcare professional with training and expertise in diagnosing ADHD' (NICE NG87 1.3.1). QS39 uses the same words to define an 'ADHD specialist'. NICE has never defined 'appropriately qualified'. Until it does, the most detailed UK statement is AQAS (highly recommended level): several years of clinical work in mental health, specific formal training rather than a brief teaching session, and 10 to 20 supervised assessments. AQAS lists professions that may work without frequent supervision once trained (for example consultant psychiatrists, consultant clinical psychologists and nurse consultants) and those that need at least monthly supervision (for example psychiatry trainees and GPs developing a special interest). GPs and other doctors can screen and refer. This app supports structure and learning. It does not confer competence.</p>" +
            "<h4>What the diagnosis rests on (1.3.1)</h4>" +
            "<ol>" +
            "<li>A full clinical and psychosocial assessment, including discussion of behaviour and symptoms in the different domains and settings of everyday life.</li>" +
            "<li>A full developmental and psychiatric history.</li>" +
            "<li>Observer reports and an assessment of mental state.</li>" +
            "</ol>" +
            "<h4>Rating scales (1.3.2)</h4>" +
            "<p>A diagnosis should not be made solely on rating scales or observation. Scales are 'helpful added tools', and observation helps when symptoms are in doubt. The scales NICE names (Conners, SDQ) are child tools. NG87 names no adult instrument at all: not DIVA, ACE+, CAADID, ASRS, CAARS or WURS.</p>" +
            "<h4>Thresholds (1.3.3)</h4>" +
            "<ul>" +
            "<li>Symptoms meet DSM-5 or ICD-11 criteria. Do not exclude because of autism or an uncertain time of onset.</li>" +
            "<li>They cause <strong>at least moderate</strong> psychological, social, educational or occupational impairment, based on interview or direct observation in multiple settings.</li>" +
            "<li>They happen often, in two or more important settings, such as social, family, educational or work settings.</li>" +
            "</ul>" +
            "<h4>Also part of the diagnostic process</h4>" +
            "<ul>" +
            "<li><strong>1.3.4:</strong> assess needs, coexisting conditions, social, family and educational or occupational circumstances, and physical health.</li>" +
            "<li><strong>1.3.5:</strong> consider ADHD at all ages, with symptom criteria adjusted for age.</li>" +
            "<li><strong>Referral:</strong> adults without a childhood diagnosis go to a mental health specialist trained in ADHD when typical symptoms began in childhood and persisted, are not explained by other diagnoses, and cause at least moderate impairment (1.2.10; QS39 statement 2). Adults treated as children whose symptoms continue go to general adult psychiatry (1.2.11; QS39 statement 3). Be aware of higher-prevalence groups (1.2.1) and under-recognition in women (1.2.2).</li>" +
            "<li>NICE makes no recommendations on expedited or urgent ADHD assessment (NICE response to a coroner, 2026). Do not claim NICE triage rules.</li>" +
            "</ul>" +
            "<h4>After the diagnosis</h4>" +
            "<ul>" +
            "<li><strong>1.4.3:</strong> hold a structured discussion about how ADHD could affect the person's life: positives, stigma, impulsivity, environmental modifications, education and work, relationships, coexisting conditions, the risk of substance misuse and self-medication, and driving.</li>" +
            "<li><strong>Driving:</strong> people must tell the DVLA only if their ADHD or its medication affects their ability to drive safely (GOV.UK).</li>" +
            "<li><strong>1.4.4:</strong> people who fall short of a diagnosis may still benefit from information.</li>" +
            "<li><strong>1.5.15:</strong> offer medication to adults if symptoms still cause significant impairment in at least one domain after environmental modifications have been implemented and reviewed.</li>" +
            "<li><strong>1.7.4 and 1.7.5:</strong> before medication, confirm the person still meets criteria, review mental health, social circumstances and the risk of substance misuse and diversion, and check physical health: history, current medicines, height, weight, pulse, blood pressure and a cardiovascular assessment. An ECG is not needed unless a 1.7.5 feature is present (for example fainting or undue breathlessness on exertion, rapid regular palpitations that start and stop suddenly, a murmur, hypertension, or sudden death in a first-degree relative under 40 suggesting heart disease) or a co-prescribed medicine raises cardiac risk.</li>" +
            "</ul>"
        },
        {
          h: "What UKAAN, RCPsych and BAP add",
          html:
            "<h4>UKAAN AQAS (2024): the operational standard</h4>" +
            "<p>AQAS grades each item as essential (non-negotiable, including NICE requirements and the DSM criteria), highly recommended (a minimum for most assessments) or optional. The essentials for the assessment itself include:</p>" +
            "<ul>" +
            "<li>Evaluate each of the 18 DSM-5 symptoms, now and in childhood, and document clear examples of each symptom found present.</li>" +
            "<li>Use a semi-structured interview: DIVA, CAADID or ACE+, or an experienced assessor's adapted style that still covers every symptom, impairment and criterion.</li>" +
            "<li>Use open questions to avoid leading. Assess by direct consultation, face to face or by video.</li>" +
            "<li>Treat impairment as a core component, with examples from work or education and from social and home life.</li>" +
            "<li>Base onset on more than a snapshot impression; screen for other neurodevelopmental conditions; take a childhood history covering school, behaviour, peers and trauma.</li>" +
            "<li>Screen for mental health conditions that mimic or co-occur with ADHD, or change management (for example bipolar disorder or eating disorders).</li>" +
            "<li>Always complete a risk assessment, including misuse and diversion of prescribed medicines. Record blood pressure, pulse and weight before medication.</li>" +
            "<li>Spend at least 2 hours in total in most cases.</li>" +
            "</ul>" +
            "<p>Highly recommended items include orienting the patient to the process, informants who knew the person in childhood and now, reviewing records and school reports, and recording impairment under education, employment, leisure, family and close relationships, friendships, daily tasks and self-image.</p>" +
            "<p>On questionnaires AQAS is blunt. Self-completed symptom scales should provide a baseline for measuring change after treatment. They should not be a formative part of the diagnostic assessment, because they are lists of leading questions. Screening without clinical assessment is not supported. AQAS also warns that tick-box interviews built on the 18 symptoms risk confirmation bias.</p>" +
            "<h4>RCPsych CR235 (2023)</h4>" +
            "<ul>" +
            "<li>Do not make the first appointment solely a semi-structured interview. It can lead the patient, produce false positives and miss more fitting diagnoses (9.1).</li>" +
            "<li>Instruments are not a substitute for careful history taking. Patients who have read about ADHD may endorse most items (9.6).</li>" +
            "<li>Scaffolding by parents and school can mask childhood symptoms. Lack of visible symptoms in clinic does not exclude ADHD (9.2).</li>" +
            "<li>The ASRS has been undiscriminating for triage in the authors' experience (section 7).</li>" +
            "<li>Separate trait-based conditions (ADHD, autism, emotionally unstable personality disorder) from state-based ones with a clearer onset (depression, bipolar disorder, anxiety) (9.7).</li>" +
            "<li>Comorbidity should not be a barrier to assessment, but major mood disorders should be treated before assessing for ADHD (section 10).</li>" +
            "<li>Consider abnormal sick-role behaviour and rehearsed answers, balanced against the evidence of under-diagnosis (9.7.8). Video assessment is acceptable; quality matters more than mode (9.8).</li>" +
            "</ul>" +
            "<h4>BAP (2014)</h4>" +
            "<ul>" +
            "<li>The diagnosis is clinical. Every diagnosis should include an assessment of comorbidity (graded as a standard of care).</li>" +
            "<li>Neuropsychological tests should not be used in isolation. Executive tests have good positive but poor negative predictive value, so normal results do not exclude ADHD. IQ testing is not mandatory. EEG is not recommended for diagnosis.</li>" +
            "<li>Some BAP points are outdated: it describes medication as always first line in adults (superseded by NG87 1.5.15), and its ECG advice is older than NICE 1.7.4 and 1.7.5. Use NICE.</li>" +
            "</ul>"
        },
        {
          h: "International guidance: agreement and difference",
          html:
            "<h4>European Consensus (Kooij 2019)</h4>" +
            "<p>The clinical interview is essential and covers symptoms and impairment in childhood and adulthood. A semi-structured interview is advised (DIVA, CAADID or ACE+). Screen people with a chronic, trait-like picture and high-risk groups: relatives of people with ADHD, people with chronic mental disorders or substance misuse, people with several physical illnesses, and people in the justice system. Neuropsychological tests and EEG cannot make the diagnosis, though there is some evidence for performance validity tests where feigning is a concern.</p>" +
            "<h4>CADDRA 4.1 (Canada)</h4>" +
            "<p>After general mental health screening (Weiss Symptom Record II, PHQ-9, GAD-7), CADDRA's adult process has four steps:</p>" +
            "<ol>" +
            "<li><strong>Initial information gathering:</strong> reason for referral, documents such as school reports, ASRS from the patient and from someone who knows them well, WFIRS-S, and a retrospective childhood scale from someone who knew them as a child.</li>" +
            "<li><strong>Medical review:</strong> examination, medical mimics, lifestyle, and contraindications to medication.</li>" +
            "<li><strong>ADHD-specific interview:</strong> developmental history, symptoms before 12, collateral, and the CADDRA assessment form or DIVA.</li>" +
            "<li><strong>Feedback and treatment recommendations.</strong></li>" +
            "</ol>" +
            "<p>CADDRA warns against relying on observation in the interview, and notes that some students and young adults exaggerate symptoms to obtain accommodations or stimulants.</p>" +
            "<h4>Australian guideline (AADPA 2022)</h4>" +
            "<p>No universal screening, but services for high-risk groups could screen, and a positive screen must be followed by a full assessment (1.2.1 to 1.2.5). The assessment includes a full clinical and psychosocial assessment including strengths, a developmental, mental health and medical history, observer reports and mental state, and a medical assessment to exclude other causes (2.1.2). Do not diagnose on rating scales or observation alone (2.1.4). Use more than one setting and reporter (2.1.5). The narrative suggests an interview of 2 to 3 hours. It also states that no specific conditions must be excluded before diagnosing ADHD. That means there are no automatic exclusions, not that the differential can be skipped: 2.1.3 still requires differential and co-occurring conditions to be assessed.</p>" +
            "<h4>WFADHD (2021)</h4>" +
            "<p>A licensed clinician makes the diagnosis by interview. It cannot be made by rating scales alone, neuropsychological tests or brain imaging.</p>" +
            "<h4>Where they agree and where they differ</h4>" +
            "<table><thead><tr><th>Agree</th><th>Differ</th></tr></thead><tbody>" +
            "<tr><td>Diagnosis by clinical interview</td><td>Role of self-report scales: baseline only (AQAS) versus part of information gathering (CADDRA, AADPA)</td></tr>" +
            "<tr><td>Symptoms in childhood and adulthood</td><td>ASRS for triage: offered to referrers in 2017, then judged undiscriminating (CR235); one step of the CADDRA process</td></tr>" +
            "<tr><td>Collateral and school records strongly advised</td><td>Impairment wording: at least moderate (NICE), clinically significant (AADPA), interferes with or reduces quality (DSM-5-TR)</td></tr>" +
            "<tr><td>Medical review and comorbidity assessment</td><td>Strengths as a required part of the assessment: explicit in AADPA (NICE mentions them only in the post-diagnostic discussion)</td></tr>" +
            "<tr><td>No test, scan or scale diagnoses ADHD</td><td>Time: AQAS sets at least 2 hours; the AADPA narrative says an interview typically takes 2 to 3 hours; NICE states no time</td></tr>" +
            "</tbody></table>"
        },
        {
          h: "The NHS context in 2025-26",
          html:
            "<p>Demand for adult ADHD assessment has outstripped NHS capacity. The DHSC independent review (2026) reports that independent providers now carry out more than half of all NHS-funded ADHD assessments, and that spending on independent-sector ADHD provision rose by about 252% in 3 years. Two national reports set out what should change.</p>" +
            "<h4>NHS England independent ADHD Taskforce (Part 1 June 2025; Part 2 November 2025)</h4>" +
            "<ul>" +
            "<li>Defines a <strong>clinical diagnosis</strong> as requiring a full clinical assessment that cannot rest on questionnaires alone, <strong>suspected ADHD</strong> as a suspicion by the person or others, and <strong>possible ADHD</strong> as scoring above a cut-point on a validated screen.</li>" +
            "<li>Rating scales can help monitor change after treatment but should not be used on their own for triage to exclude people. A positive screen alone is not an indication for referral. Triage should not rely on questionnaires alone and should be supervised by an experienced clinician.</li>" +
            "<li>Asks NHS England, DHSC and NICE to define an 'appropriately qualified' professional, and asks the Royal Colleges to make ADHD assessment a core competency.</li>" +
            "<li>Calls for regulation and quality standards (it cites AQAS for adults), with Care Quality Commission oversight of all ADHD providers.</li>" +
            "</ul>" +
            "<h4>DHSC independent review of mental health conditions, ADHD and autism (final report 9 October 2026; chair Professor Peter Fonagy)</h4>" +
            "<ul>" +
            "<li>It could not conclude that over-diagnosis is happening at scale, but found the balance of risks moving towards misdiagnosis and over-diagnosis, while under-recognition continues for some groups.</li>" +
            "<li>Misdiagnosis is more likely when assessment is brief, not face to face, fragmented, without informants or records, or focused on a single condition.</li>" +
            "<li>Recommendations include a move to 'needs-led plus diagnosis' support, integrated assessment to minimise misdiagnosis, making all ADHD and autism diagnostic assessments CQC-regulated activity, a national competency framework, digital tools as support and never as decision-maker, and updated NICE guidance.</li>" +
            "</ul>" +
            "<h4>What has and has not changed</h4>" +
            "<p>These are recommendations to government, not clinical guidance. As of October 2026, NICE NG87 is unchanged, and implementation of CQC regulation and the competency framework had not been confirmed. Cite them as policy direction, not as rules.</p>" +
            "<h4>What it means for your practice now</h4>" +
            "<ul>" +
            "<li>Work to AQAS. It is the standard that national reports point to.</li>" +
            "<li>Do not triage, prioritise or exclude on questionnaire scores alone.</li>" +
            "<li>Avoid the features linked to misdiagnosis. When the picture is complex or uncertain, consider seeing the person face to face, and always seek informants and records.</li>" +
            "<li>Assess co-occurring conditions and functioning, not ADHD alone.</li>" +
            "<li>Expect your reports to be read by other services. RCPsych CR235 advises that people diagnosed outside the NHS or abroad bring their full report, and that a standard assessment is needed if there is no evidence of a comprehensive assessment.</li>" +
            "<li>Whatever the outcome, connect the person to help for their needs.</li>" +
            "</ul>"
        },
        {
          h: "Structure and timing of a full adult assessment",
          html:
            "<p>Guidance on time: at least 2 hours of direct contact in most cases, as one 2 to 3 hour session with a break or several shorter ones (AQAS); 2 to 3 one-hour sessions (RCPsych in Scotland 2017); about 2.5 hours of clinic time to reach a diagnosis (Hollis 2018, cited by the NHSE Taskforce); and 2 to 3 hours (AADPA). DIVA alone takes about 90 minutes. A model that meets these standards (clinical practice):</p>" +
            "<table><thead><tr><th>Stage</th><th>What happens</th><th>Time</th><th>App step</th></tr></thead><tbody>" +
            "<tr><td>Referral and triage</td><td>Check the referral has developmental history, examples from two settings, impact, medical history, blood pressure and pulse (CR235). Look for urgent needs first.</td><td>Clinician review</td><td>Before you start</td></tr>" +
            "<tr><td>Pre-assessment pack, 2 to 4 weeks before</td><td>Questionnaires (as baseline and context), consent to contact informants, request for school reports and records, optional life timeline, a letter explaining the process</td><td>Patient: 45 to 60 minutes</td><td>Screening questionnaires; Pre-appointment forms</td></tr>" +
            "<tr><td>Session 1: history</td><td>Orientation; presenting problems and hopes; risk; psychiatric, developmental, educational, work, relationship, forensic and substance history; physical health; mental state; review of questionnaires; list of differentials to test</td><td>60 to 90 minutes</td><td>Safety and risk; Clinical history; Co-occurring conditions screen</td></tr>" +
            "<tr><td>Session 2: symptom interview</td><td>Semi-structured interview: each of the 18 symptoms, adulthood then childhood, with examples; onset; impairment by domain</td><td>75 to 120 minutes</td><td>Interview parts 1 and 2; Onset and impairment</td></tr>" +
            "<tr><td>Collateral</td><td>Childhood informant (parent or older sibling) and a current informant (partner or friend), by phone, video or in person; school reports</td><td>30 to 60 minutes</td><td>Collateral information</td></tr>" +
            "<tr><td>Formulation</td><td>Criteria A to E, differentials, validity, presentation, severity, plan</td><td>30 to 60 minutes, clinician only</td><td>Differential diagnosis; Symptom validity; Scoring and diagnosis</td></tr>" +
            "<tr><td>Feedback</td><td>Outcome and reasoning; structured post-diagnostic discussion (NG87 1.4.3); questions; next steps; physical baseline if medication is likely (NG87 1.7.4)</td><td>30 to 60 minutes</td><td>Report and next steps</td></tr>" +
            "</tbody></table>" +
            "<h4>Order matters</h4>" +
            "<p>Take the open history before the structured symptom interview (CR235 9.1). It lets you hear the person's own story, spot other diagnoses early and avoid priming. Ask about adulthood first and childhood second for each symptom: current examples are easier to recall and anchor the childhood questions.</p>" +
            "<h4>When to pause</h4>" +
            "<p>Stop the ADHD assessment and deal with the problem first if you find active suicidal intent, possible mania or psychosis, intoxication or withdrawal, a severe current depressive episode (CR235 advises treating major mood disorders first), or a safeguarding concern. Use the Safety and risk step at the start of every assessment.</p>" +
            "<h4>Remote assessment</h4>" +
            "<p>Video is acceptable (AQAS; CR235 9.8), but the DHSC review lists 'not face to face' among misdiagnosis risks. Consider an in-person meeting when the picture is complex, the history is inconsistent or validity is in doubt (clinical practice).</p>"
        },
        {
          h: "Which tool at which stage",
          html:
            "<p>Every tool has a job and a limit. The names below are the tools in this app's Tools and scoring library. Licensed tools are described there but not reproduced.</p>" +
            "<table><thead><tr><th>Stage</th><th>Purpose</th><th>Tools</th><th>Limit</th></tr></thead><tbody>" +
            "<tr><td>Referral and triage</td><td>Gather information, under clinical supervision</td><td>ASRS v1.1 Part A; WFIRS-S; AQ-10</td><td>Never accept, reject or prioritise on a score alone (NHSE Taskforce Part 2)</td></tr>" +
            "<tr><td>Pre-assessment: ADHD</td><td>Symptom baseline, recalled childhood traits, impairment</td><td>ASRS v1.1 (18 items); WURS-25; WFIRS-S; CAARS 2 or BAARS-IV where licensed</td><td>Baseline and interview prompts, not formative evidence (AQAS)</td></tr>" +
            "<tr><td>Pre-assessment: broad screen</td><td>Find mimics and co-occurring conditions</td><td>Weiss Symptom Record II; PHQ-9; GAD-7; MDQ; AUDIT; DAST-10; AQ-10; PC-PTSD-5 or PCL-5; MSI-BPD; STOP-Bang</td><td>A positive screen opens a question for the interview; it does not diagnose</td></tr>" +
            "<tr><td>Risk</td><td>Safety</td><td>C-SSRS screener, plus clinical risk assessment</td><td>A screen supports, never replaces, clinical judgement</td></tr>" +
            "<tr><td>Diagnostic interview</td><td>Criteria A to E with examples</td><td>DIVA-5 (licensed), ACE+ (free), CAADID (licensed), or this app's interview</td><td>Must use open questions and real examples</td></tr>" +
            "<tr><td>Collateral</td><td>Independent evidence, childhood and now</td><td>Informant interview; school reports; CAARS 2 Observer or BAARS-IV other-report where licensed</td><td>Informants may share traits or have their own reasons</td></tr>" +
            "<tr><td>Differential diagnosis</td><td>Test specific alternatives</td><td>For example Epworth and STOP-Bang (sleep), RAADS-14 (autism), ITQ (complex PTSD), PQ-16 (psychosis), HCL-32 (bipolar), MoCA (cognition)</td><td>Screens prompt referral or further assessment</td></tr>" +
            "<tr><td>Validity</td><td>How much weight the account can bear</td><td>CAARS 2 response style indexes; consistency checks; referral for formal validity testing</td><td>Indexes have low sensitivity; a flag is not a verdict</td></tr>" +
            "<tr><td>Objective tests</td><td>None recommended for adult diagnosis</td><td>QbTest (information only)</td><td>Research only in adults (NICE HTG729)</td></tr>" +
            "<tr><td>Follow-up</td><td>Measure change</td><td>ASRS v1.1 (18 items); WFIRS-S</td><td>Use the same tool, same informant, same timeframe</td></tr>" +
            "</tbody></table>" +
            "<p>Module 4 explains how to read each ADHD scale. The Pre-appointment forms guide explains what to send and how to weigh what comes back.</p>"
        },
        {
          h: "Documentation and the report",
          html:
            "<p>Your report will be read by GPs, prescribers, employers, universities and possibly courts. AQAS says it must support its conclusions so that others can have confidence in the diagnosis.</p>" +
            "<h4>AQAS essentials for the report</h4>" +
            "<ul>" +
            "<li>Conclusions supported by the content.</li>" +
            "<li>A detailed account of the specific symptoms.</li>" +
            "<li>A summary of mental and physical comorbidities.</li>" +
            "<li>A formulation with the outcome (diagnosis confirmed or not) and evidence that the criteria were reviewed. For DSM-5-TR in adults, that 5 or more symptoms were found in either list, plus criteria B to E.</li>" +
            "<li>An explicit statement that the symptoms are not better explained by another disorder.</li>" +
            "<li>If criteria are met, the presentation: combined, predominantly inattentive or predominantly hyperactive-impulsive.</li>" +
            "<li>The domains with at least moderate impairment.</li>" +
            "</ul>" +
            "<p>Highly recommended: real-life examples; interview and questionnaire scores with a narrative; evidence that informants were sought and whether school reports support the diagnosis; how comorbidity affects the picture; conditions explicitly found absent (for example no head injury or seizures); whether a negative outcome is subthreshold ADHD or symptoms of another condition; driving advice; and how missing or conflicting information affects validity.</p>" +
            "<h4>What to record as you go</h4>" +
            "<ul>" +
            "<li>For each symptom: present, unsure or absent, with an example in the person's own words, for adulthood and childhood.</li>" +
            "<li>For onset: the sources (self, parent, reports) and their agreement.</li>" +
            "<li>For impairment: a 0 to 3 rating per domain, with a concrete example.</li>" +
            "<li>For collateral: who, how, when, and the level of support (0, 1 or 2).</li>" +
            "<li>For each differential: the verdict (absent, co-occurring, better explains, uncertain) and the reason.</li>" +
            "<li>Validity observations, incentives, and consistency across sources.</li>" +
            "<li>Risk, physical baseline and the agreed plan.</li>" +
            "</ul>" +
            "<h4>A formulation paragraph that works (fictional example)</h4>" +
            "<blockquote>Ms A, 32, was assessed over two sessions (3 hours 15 minutes), with a 40-minute interview with her mother. Using a semi-structured interview based on DSM-5-TR, I found 7 of 9 inattentive and 4 of 9 hyperactive-impulsive symptoms over the past 6 months, each with examples (table 1). Her mother and primary school reports describe 6 inattentive symptoms before age 12 ('dreamy', 'needs constant reminders'). Symptoms are present at work, at home and socially. Impairment is moderate at work (two formal warnings for missed deadlines) and in daily tasks (council tax arrears), and mild in friendships. I considered depression, generalised anxiety disorder, bipolar disorder, obstructive sleep apnoea and cannabis use. Her low mood meets criteria for a mild depressive episode, but it began after the work warnings, eight months ago, and does not account for the lifelong pattern. Her worries are about work and money and began with the warnings; there is no pattern of persistent, generalised worry. There is no history of mood elevation, no snoring, witnessed apnoeas or daytime sleepiness, and no cannabis or other substance use since university. The symptoms are not better explained by another disorder. The account was consistent across sources. Conclusion: ADHD, predominantly inattentive presentation, moderate (DSM-5-TR; ICD-11 6A05.0), with a co-occurring mild depressive episode.</blockquote>" +
            "<h4>Common documentation failures</h4>" +
            "<ul>" +
            "<li>Scores listed without examples, sources or interpretation.</li>" +
            "<li>'Meets criteria for ADHD' with no symptom count, no presentation and no statement on criterion E.</li>" +
            "<li>No mention of collateral, or of why it was unavailable.</li>" +
            "<li>Differentials named but not reasoned through.</li>" +
            "<li>No risk assessment or physical baseline before a medication recommendation.</li>" +
            "</ul>" +
            "<p>The Report and next steps step drafts a report from your entries, ready to edit.</p>"
        }
      ],
      keyPoints: [
        "NICE NG87 1.3.1: only a specialist psychiatrist, paediatrician or other appropriately qualified professional with training and expertise diagnoses ADHD, based on a full clinical and psychosocial assessment, a developmental and psychiatric history, and observer reports with a mental state assessment.",
        "NG87 1.3.2: never diagnose on rating scales or observation alone. NG87 names no adult instrument.",
        "NG87 1.3.3: DSM-5 or ICD-11 criteria, at least moderate impairment, and symptoms often in two or more important settings. Autism and an uncertain onset do not exclude.",
        "UKAAN AQAS is the most detailed UK standard: all 18 symptoms, adult and childhood, with examples; open questions; semi-structured interview; at least 2 hours; risk; and an explicit 'not better explained' statement.",
        "International guidance agrees on the essentials: clinical interview, childhood and adult evidence, collateral, medical review and comorbidity. No test diagnoses ADHD.",
        "The Taskforce (2025) and DHSC review (2026) call for defined competencies, quality standards, CQC regulation and needs-led support. These are recommendations; NG87 was unchanged in October 2026.",
        "A full assessment usually needs a pre-assessment pack, a history session, a structured symptom interview, collateral, formulation and feedback: at least 2 hours of direct contact in most cases (AQAS), and often 3 to 4 hours once feedback is included.",
        "Take the open history before the structured interview, and pause the assessment for urgent risk, mood episodes, psychosis or intoxication.",
        "A good report lets a reader follow your reasoning from examples to criteria to conclusion."
      ],
      pitfalls: [
        "Reading NICE's named child scales as permission to use adult questionnaires as diagnostic evidence.",
        "Opening with a semi-structured interview before the open history, which primes answers and misses other diagnoses.",
        "Accepting, rejecting or prioritising referrals on a questionnaire score.",
        "Squeezing an assessment into 45 to 60 minutes, which cannot meet AQAS.",
        "Leaving out risk assessment, the physical health baseline or the post-diagnostic discussion.",
        "Writing 'meets criteria' without symptom counts, presentation or a criterion E statement.",
        "Quoting Taskforce or DHSC recommendations as if they were current clinical rules.",
        "Offering QbTest as part of an adult diagnostic assessment."
      ],
      quiz: [
        { q: "According to NICE NG87 1.3.1, what three things should an ADHD diagnosis be based on?",
          options: ["A rating scale, a QbTest and a GP letter", "A semi-structured interview, the WURS and the ASRS", "A childhood diagnosis, school reports and a brain scan", "A full clinical and psychosocial assessment, a full developmental and psychiatric history, and observer reports with an assessment of mental state"], a: 3,
          why: "These are the three bases in NG87 1.3.1, also used by QS39 to define a diagnosis. NICE does not name any adult instrument, and scans and computer tests are not diagnostic." },
        { q: "A GP refers a 30-year-old with a positive ASRS Part A and asks you to 'confirm the diagnosis'. What is the best response under current UK guidance?",
          options: ["Diagnose ADHD if the WURS is also positive", "Treat the screen as a prompt to gather more information; a positive screen alone is neither a diagnosis nor enough for referral", "Reject the referral because screening tools are unreliable", "Offer a QbTest to confirm the result"], a: 1,
          why: "The NHSE Taskforce (Part 2) says a positive screen alone is not an indication for referral, and NICE NG87 1.3.2 rules out diagnosis on rating scales. Ask the referrer for developmental history, examples, impairment and physical health details. QbTest is research only in adults." },
        { q: "What does the UKAAN quality standard (AQAS 2024) say about self-completed ADHD symptom scales?",
          options: ["They provide a baseline for measuring change, not formative diagnostic evidence", "They are essential diagnostic evidence", "They may replace the interview when time is short", "They should never be used at all"], a: 0,
          why: "AQAS says self-completed symptom scales should only be used as a baseline for later change, because they are lists of leading questions, and that screening without clinical assessment is not supported." },
        { q: "What minimum total assessment time does AQAS set for most adult assessments?",
          options: ["30 minutes", "1 hour", "At least 2 hours", "At least 6 hours"], a: 2,
          why: "AQAS (essential) sets at least 2 hours in most cases, as one session with a break or several shorter ones. RCPsych suggests 2 to 3 one-hour sessions and AADPA 2 to 3 hours." },
        { q: "What is the status of QbTest for adults under NICE HTG729?",
          options: ["Research only; NICE recommends it as an option only for ages 6 to 17, alongside clinical assessment", "Recommended as a first-line adult diagnostic test", "Recommended when no informant is available", "Required before starting medication"], a: 0,
          why: "HTG729 1.1 covers ages 6 to 17 only. 1.2 calls for more research in people aged 18 and over, and the committee found the child evidence not generalisable to adults." },
        { q: "What does RCPsych CR235 caution against?",
          options: ["Using video for assessments", "Taking a developmental history", "Making the first appointment solely a semi-structured interview", "Assessing people who have anxiety"], a: 2,
          why: "CR235 9.1 warns that a first appointment made up only of a semi-structured interview can lead the patient, produce false positives and miss more fitting diagnoses. Video is acceptable, and comorbidity is not a barrier." },
        { q: "Which statement about the NHS policy context in October 2026 is correct?",
          options: ["NICE has replaced NG87 with a new adult ADHD guideline", "The Taskforce and DHSC review recommend major change, but NG87 itself has not been updated", "CQC regulation of all ADHD assessments is in force", "Questionnaire screening is now recommended for triage"], a: 1,
          why: "NG87 was last reviewed in July 2026 with no update. The Taskforce and DHSC recommendations (including CQC regulation) are recommendations to government, and both advise against triage on questionnaires alone." },
        { q: "Which of these groups is NOT listed by NICE NG87 1.2.1 as having increased prevalence of ADHD?",
          options: ["People with epilepsy", "Adults with a mental health condition", "People with acquired brain injury", "People with high IQ"], a: 3,
          why: "NG87 1.2.1 lists, among others, people with epilepsy, adults with a mental health condition, acquired brain injury, substance misuse and justice system involvement. High IQ is not a risk group, though it can delay diagnosis through compensation." },
        { q: "A report concludes 'ADHD confirmed' after listing the symptoms, but says nothing about other conditions. Which AQAS essential is missing?",
          options: ["A QbTest result", "A letter to the DVLA", "An explicit statement that the symptoms are not better explained by another disorder", "A family history of ADHD"], a: 2,
          why: "AQAS makes it essential to confirm that the symptoms are not better explained by another disorder, as a distinct criterion, and to summarise comorbidities." },
        { q: "What is the order of the four adult steps in the CADDRA 4.1 process (after general mental health screening)?",
          options: ["Initial information gathering, medical review, ADHD-specific interview, feedback and treatment recommendations", "Medication trial, interview, feedback, screening", "Interview, QbTest, EEG, feedback", "Screening, diagnosis by rating scale, referral, follow-up"], a: 0,
          why: "CADDRA's adult figure sets out information gathering (including ASRS and WFIRS-S), medical review, the ADHD interview with developmental history and collateral, then feedback. CADDRA does not endorse EEG for diagnosis." },
        { q: "Early in session 1, a patient discloses a plan to end their life this week. What should you do?",
          options: ["Continue the ADHD interview and address risk at the end", "Finish the symptom interview first, because it is time-limited", "Give the WFIRS-S to measure impairment", "Pause the ADHD assessment and manage the risk now"], a: 3,
          why: "Safety comes first. AQAS makes risk assessment essential, and the assessment should pause for urgent risk. The ADHD assessment can resume when the person is safe." },
        { q: "What does the Australian guideline (AADPA 2.1.2) add explicitly to the NICE list of what a diagnostic assessment includes?",
          options: ["A QbTest", "Strengths, and a medical assessment to exclude other causes", "A genetic test", "An EEG"], a: 1,
          why: "AADPA 2.1.2 is adapted from NICE but adds strengths to the clinical and psychosocial assessment, and a medical assessment to exclude other causes, with investigations only if indicated." }
      ],
      refs: [
        "NICE NG87. Attention deficit hyperactivity disorder: diagnosis and management. Recommendations 1.2.1, 1.2.2, 1.2.10, 1.2.11, 1.3.1-1.3.5, 1.4.3, 1.4.4, 1.5.15, 1.7.4, 1.7.5 (checked October 2026; last reviewed 23 July 2026).",
        "NICE QS39. Attention deficit hyperactivity disorder quality standard (2013, updated 2018): statements 2 and 3.",
        "NICE HTG729. Digital technologies for assessing ADHD (2024; formerly DG60): recommendations 1.1-1.5.",
        "NICE response to a coroner's Prevention of Future Deaths report (August 2026): no recommendations on expedited ADHD assessment.",
        "Adamou M et al. The adult ADHD assessment quality assurance standard (UKAAN AQAS). Front Psychiatry 2024;15:1380410.",
        "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023); RCPsych in Scotland, ADHD in adults: good practice guidelines (2017).",
        "Bolea-Alamañac B et al. BAP evidence-based guidelines for the pharmacological management of ADHD. J Psychopharmacol 2014;28:179-203.",
        "Kooij JJS et al. Updated European Consensus Statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019;56:14-34.",
        "CADDRA. Canadian ADHD Practice Guidelines, 4.1 edition (2020), chapter 1 and figure 1.5.",
        "May T et al. The Australian evidence-based clinical practice guideline for ADHD. Aust N Z J Psychiatry 2023;57:1101-1116; AADPA Summary of Recommendations (2022).",
        "Faraone SV et al. WFADHD International Consensus Statement. Neurosci Biobehav Rev 2021;128:789-818.",
        "NHS England. Report of the independent ADHD Taskforce, Part 1 (June 2025) and Part 2 (November 2025).",
        "Department of Health and Social Care. Independent review into mental health conditions, ADHD and autism: final report (9 October 2026).",
        "GOV.UK. ADHD and driving (DVLA guidance).",
        "DIVA Foundation. DIVA-5 licensing and copyright pages (divacenter.eu), accessed October 2026."
      ]
    },

    /* ================================================================== */
    /* Module 4                                                             */
    /* ================================================================== */
    {
      id: "m4", n: 4, minutes: 45,
      title: "Screening and rating scales",
      summary: "What screening can and cannot do, how base rates change the meaning of a result, how to score and read the ASRS v1.1, ASRS-5, WURS-25, WFIRS-S, CAARS 2 and BAARS-IV, how validity indexes and informant forms help, why objective tests do not diagnose adult ADHD, and how to report results.",
      objectives: [
        "Explain the four legitimate uses of rating scales (screening, describing, baseline, monitoring) and what no scale can establish.",
        "Calculate positive and negative predictive values from sensitivity, specificity and base rate, and explain why the same result means different things in primary care and a specialist clinic.",
        "Score the ASRS v1.1 correctly (Part A rule, item thresholds, Part B, 0 to 72 total) and describe the ASRS-5, WURS-25 and WFIRS-S with their cut-offs and limits.",
        "Describe CAARS 2 and BAARS-IV, including validity indexes and informant forms, and interpret a validity flag proportionately.",
        "Explain the limits of QbTest and neuropsychological tests in adults, recognise the main scoring pitfalls, and report scale results accurately."
      ],
      sections: [
        {
          h: "What screening can and cannot do",
          html:
            "<p>A screening tool is a short test given to people without a diagnosis to decide who needs a full assessment. The NHS England ADHD Taskforce uses three terms that keep this clear (Part 1, 2025):</p>" +
            "<ul>" +
            "<li><strong>Possible ADHD:</strong> scoring above a cut-point on a validated screen. False positives and false negatives are expected.</li>" +
            "<li><strong>Suspected ADHD:</strong> the person or others suspect ADHD, without a diagnosis.</li>" +
            "<li><strong>Clinical diagnosis:</strong> requires a full clinical assessment and cannot be defined by questionnaires alone.</li>" +
            "</ul>" +
            "<h4>Four legitimate jobs for a rating scale</h4>" +
            "<ol>" +
            "<li><strong>Screening:</strong> flagging people who may need assessment, usually in high-risk groups.</li>" +
            "<li><strong>Describing:</strong> a symptom profile that shows where to probe in the interview.</li>" +
            "<li><strong>Baseline:</strong> a starting point for measuring change after diagnosis and treatment (AQAS 2024).</li>" +
            "<li><strong>Monitoring:</strong> tracking response. NICE NG87 1.7.26, written with children in mind, asks for symptoms, impairment and adverse effects to be recorded on standard scales at baseline and at each dose change during titration.</li>" +
            "</ol>" +
            "<h4>What no scale can establish</h4>" +
            "<ul>" +
            "<li>That symptoms began before 12 (retrospective scales measure memory, not history).</li>" +
            "<li>That symptoms occur across settings and cause at least moderate impairment.</li>" +
            "<li>That another condition does not explain them better.</li>" +
            "<li>That the account is credible. Most self-report scales have no validity checks, and those that do miss many invalid responders.</li>" +
            "</ul>" +
            "<p>The ASRS form itself tells clinicians to go on to review impairment and childhood history. NICE NG87 1.3.2 rules out diagnosis on rating scales alone. RCPsych CR235 reports that, in its authors' clinical experience, the ASRS is undiscriminating for triage. The NHSE Taskforce (Part 2) says a positive screen alone is not an indication for referral, and scales should not be used alone to exclude people. The Australian guideline advises against universal screening, allows targeted screening in high-risk groups, and requires a full assessment after a positive screen (1.2.1 to 1.2.5).</p>" +
            "<h4>How a skilled assessor uses scales</h4>" +
            "<ul>" +
            "<li>Read them before the appointment, as a map, not a verdict.</li>" +
            "<li>Use high-scoring items as interview prompts: 'You marked this as very often. Tell me about a recent example.'</li>" +
            "<li>Compare self-report with informant reports item by item.</li>" +
            "<li>Note the person's current mood, sleep and substance use when they completed the forms.</li>" +
            "<li>Keep the scores as a baseline for follow-up.</li>" +
            "</ul>"
        },
        {
          h: "Sensitivity, specificity, predictive values and base rates",
          html:
            "<table><thead><tr><th>Term</th><th>Question it answers</th></tr></thead><tbody>" +
            "<tr><td>Sensitivity</td><td>Of people <em>with</em> ADHD, what share screen positive?</td></tr>" +
            "<tr><td>Specificity</td><td>Of people <em>without</em> ADHD, what share screen negative?</td></tr>" +
            "<tr><td>Positive predictive value (PPV)</td><td>Of people who screen positive, what share have ADHD?</td></tr>" +
            "<tr><td>Negative predictive value (NPV)</td><td>Of people who screen negative, what share do not have ADHD?</td></tr>" +
            "<tr><td>Positive likelihood ratio (LR+)</td><td>Sensitivity divided by (1 minus specificity): how much a positive result raises the odds</td></tr>" +
            "<tr><td>Negative likelihood ratio (LR-)</td><td>(1 minus sensitivity) divided by specificity: how much a negative result lowers the odds</td></tr>" +
            "</tbody></table>" +
            "<p>Sensitivity and specificity describe the test in a given population. PPV and NPV also depend on how common ADHD is in the people tested: the base rate.</p>" +
            "<h4>Worked example: one screen, three settings</h4>" +
            "<p>Take an illustrative screen with sensitivity 90% and specificity 80%, used on 1,000 people in each of three settings. The base rates are about 3% for adults in general (WFADHD 2021), 13% in treatment-seeking substance use patients (van de Glind 2013) and 58% in the specialist clinic sample of the ASRS-5 study (Ustun 2017).</p>" +
            "<table><thead><tr><th></th><th>Community or primary care (3%)</th><th>Addiction service (13%)</th><th>Specialist ADHD clinic (58%)</th></tr></thead><tbody>" +
            "<tr><td>People with ADHD</td><td>30</td><td>130</td><td>580</td></tr>" +
            "<tr><td>True positives (90%)</td><td>27</td><td>117</td><td>522</td></tr>" +
            "<tr><td>False negatives</td><td>3</td><td>13</td><td>58</td></tr>" +
            "<tr><td>People without ADHD</td><td>970</td><td>870</td><td>420</td></tr>" +
            "<tr><td>False positives (20%)</td><td>194</td><td>174</td><td>84</td></tr>" +
            "<tr><td>True negatives</td><td>776</td><td>696</td><td>336</td></tr>" +
            "<tr><td><strong>PPV</strong></td><td>27 of 221 = <strong>12%</strong></td><td>117 of 291 = <strong>40%</strong></td><td>522 of 606 = <strong>86%</strong></td></tr>" +
            "<tr><td><strong>NPV</strong></td><td>776 of 779 = <strong>99.6%</strong></td><td>696 of 709 = <strong>98%</strong></td><td>336 of 394 = <strong>85%</strong></td></tr>" +
            "</tbody></table>" +
            "<p>What this shows:</p>" +
            "<ul>" +
            "<li>In primary care, about 7 of every 8 positive screens are false positives. A negative screen is reassuring.</li>" +
            "<li>In a specialist clinic, a positive screen adds little to a pre-test probability that is already high, and a negative screen does not rule ADHD out: 58 of 394 people who screened negative (15%) have ADHD.</li>" +
            "<li>So in the clinic the screen neither rules in nor rules out. The interview is the test.</li>" +
            "</ul>" +
            "<h4>The same sums with likelihood ratios</h4>" +
            "<p>Here LR+ is 0.9 / 0.2 = 4.5 and LR- is 0.1 / 0.8 = 0.125. Multiply the pre-test odds by the ratio. Primary care: odds 3/97 = 0.031; times 4.5 = 0.14; probability about 12%. Specialist clinic: odds 58/42 = 1.38; times 4.5 = 6.2; probability about 86%. A negative result in the clinic: 1.38 times 0.125 = 0.17; probability still about 15%.</p>" +
            "<h4>Real published figures</h4>" +
            "<ul>" +
            "<li><strong>ASRS v1.1 Part A, 154 US survey respondents (a clinical reappraisal subsample that over-represented people with childhood ADHD):</strong> sensitivity 68.7%, specificity 99.5% (Kessler 2005). High specificity in a survey sample does not carry over to clinics.</li>" +
            "<li><strong>ASRS v1.1 Part A, treatment-seeking substance use patients (13% with ADHD):</strong> sensitivity 0.84, specificity 0.66, PPV 0.26, NPV 0.97 (van de Glind 2013). Specificity falls sharply in a clinical group.</li>" +
            "<li><strong>ASRS-5 at 14 or more:</strong> in general-population data (8.2% with ADHD), sensitivity 91.4%, specificity 96.0%, PPV 67.3%; in the specialist clinic (57.7%), sensitivity 91.9%, specificity 74.0%, PPV 82.8% (Ustun 2017). In 262 German primary care and clinic patients, sensitivity 95.6% and specificity 72.3%; the authors estimate a PPV below 10% at 3% prevalence (Ballmann 2022).</li>" +
            "</ul>" +
            "<p>A quick ceiling check: 13.9% of adults in England screened positive on the 6-item ASRS in 2024 (APMS, reported in the DHSC review 2026). If true prevalence is around 3%, then even with perfect sensitivity no more than 3 in 13.9, about 22%, of screen positives could have ADHD.</p>" +
            "<p>Specificity also changes with the population. The Australian guideline's evidence review found ASRS v1.1 below 80% sensitivity and specificity in major depression, poor specificity in substance use and in incarcerated women, and poor ASRS-5 specificity in bipolar disorder and borderline personality disorder (May 2023). These are the people you will assess.</p>"
        },
        {
          h: "ASRS v1.1: Part A, Part B and the 0 to 72 score",
          html:
            "<p>The Adult ADHD Self-Report Scale v1.1 (WHO, with Kessler, Adler and Spencer; 2003) has 18 items covering the DSM-IV criterion A symptoms over the <strong>past 6 months</strong>. Each is rated Never (0), Rarely (1), Sometimes (2), Often (3) or Very often (4). Part A is items 1 to 6, the screener (four inattention and two hyperactivity items). Part B is items 7 to 18.</p>" +
            "<h4>The shaded-box thresholds</h4>" +
            "<p>On the clinician's form, each item has a shaded range. An answer in that range counts as positive.</p>" +
            "<ul>" +
            "<li>From <strong>Sometimes</strong> upwards: items 1, 2, 3, 9, 12, 16 and 18.</li>" +
            "<li>From <strong>Often</strong> upwards: items 4, 5, 6, 7, 8, 10, 11, 13, 14, 15 and 17.</li>" +
            "</ul>" +
            "<p>Remove the shading from the copy the patient fills in (PhenX).</p>" +
            "<h4>Scoring rules</h4>" +
            "<ol>" +
            "<li><strong>Part A (official rule):</strong> count the shaded answers among items 1 to 6. <strong>Four or more</strong> means symptoms highly consistent with adult ADHD, and further investigation is warranted.</li>" +
            "<li><strong>Part B:</strong> no total score or diagnostic likelihood. The items are probes for the interview.</li>" +
            "<li><strong>Dichotomous profile (Adler 2019):</strong> score each item 1 if shaded. Inattention = items 1, 2, 3, 4, 7, 8, 9, 10, 11; hyperactivity-impulsivity = items 5, 6 and 12 to 18. Six or more in a list was labelled 'symptomatic', a DSM-IV-era rule. The US population mean total was 2.0 (SD 3.2).</li>" +
            "<li><strong>Full 0 to 72 sum (Brevik 2020):</strong> add all 18 ratings. Mean 45.0 (SD 12.6) in diagnosed adults versus 23.0 (SD 9.8) in population controls.</li>" +
            "</ol>" +
            "<table><thead><tr><th>0-72 cut-off (Brevik 2020)</th><th>Sensitivity</th><th>Specificity</th></tr></thead><tbody>" +
            "<tr><td>27</td><td>0.90</td><td>0.71</td></tr>" +
            "<tr><td>35</td><td>0.80</td><td>0.88</td></tr>" +
            "<tr><td>36</td><td>0.79</td><td>0.90</td></tr>" +
            "<tr><td>42</td><td>0.64</td><td>0.95</td></tr>" +
            "</tbody></table>" +
            "<p>These compare diagnosed adults with population controls. In a clinic full of people with depression or anxiety, specificity will be lower. The 6-item screener discriminated as well as the full scale (AUC 0.903 versus 0.904; Brevik 2020). A Part A 0 to 24 sum with a cut-off of 14 was tested in substance use patients (sensitivity 0.81, specificity 0.70) and was not better than the original rule, which the authors recommend (van de Glind 2013).</p>" +
            "<h4>Worked example</h4>" +
            "<p>Part A answers: item 1 Sometimes, 2 Often, 3 Rarely, 4 Very often, 5 Sometimes, 6 Often. Shaded: item 1 (Sometimes counts), 2, 4 and 6. Item 3 is below Sometimes and item 5 is below Often. <strong>Four shaded: screen positive.</strong> Part A sum = 2 + 3 + 1 + 4 + 2 + 3 = 15.</p>" +
            "<p>Part B answers (items 7 to 18): 3, 4, 2, 3, 3, 1, 2, 3, 1, 2, 1, 1. Sum = 26. <strong>Total 0 to 72 = 41.</strong> Profile: inattention 8 of 9 shaded (items 1, 2, 4, 7, 8, 9, 10, 11); hyperactivity-impulsivity 3 of 9 (items 6, 14, 16).</p>" +
            "<p>Reading: a positive screen with a mainly inattentive profile. That tells you where to probe, nothing more. If this person also reports low mood and poor sleep, the inattention items may be inflated. The interview, childhood evidence and collateral decide.</p>" +
            "<h4>Limits and licence</h4>" +
            "<p>The wording is based on DSM-IV and covers only the past 6 months. Scores move with mood, sleep and time of day (Brevik 2020) and are easy to fake (Sollman 2010). The 6-item screener is free to use with attribution and without modification, other than making an electronic version. The 18-item checklist carries a WHO 2003 copyright notice, and reproducing it needs permission. Check the licence note on the tool's page in the Tools and scoring library.</p>"
        },
        {
          h: "ASRS-5: the DSM-5 screener",
          html:
            "<p>The ASRS-5 (Ustun 2017) is a separate 6-item screener built for DSM-5 using machine learning. Its items are: difficulty concentrating on what people say (A1c), leaving one's seat in meetings (A2b), difficulty unwinding and relaxing (A2d), finishing other people's sentences (A2g), putting things off until the last minute, and depending on others to keep life in order. The last two are executive items, not DSM symptoms.</p>" +
            "<h4>Scoring: weighted, not 0 to 4</h4>" +
            "<ul>" +
            "<li>Each response carries integer points. 'Never' scores 0 on every item. The maximum points are 5 for items 1 and 2, 6 for item 3, 2 for item 4, 4 for item 5 and 3 for item 6.</li>" +
            "<li>The total ranges from <strong>0 to 25</strong>, after a 2019 correction. Any source quoting 0 to 24 is pre-correction or unweighted.</li>" +
            "<li>The points for Rarely, Sometimes and Often are <strong>not published</strong>. The licence holder describes the scoring as proprietary.</li>" +
            "<li>The authors' cut-off is <strong>14 or more</strong>, which they describe as the most liberal threshold to consider for screening in a clinical sample.</li>" +
            "</ul>" +
            "<p>Many websites score the ASRS-5 as 0 to 4 per item (0 to 24) with a cut-off of 14. That is not the published algorithm, and its accuracy is unknown. Do not use it.</p>" +
            "<h4>Performance and limits</h4>" +
            "<ul>" +
            "<li>See the previous section for its figures in the general population, the clinic and German primary care.</li>" +
            "<li>It has only one inattention item, although inattention is the most common adult problem (Ballmann 2022).</li>" +
            "<li>The validation interviews did not include informants or rule out conditions such as bipolar disorder, and the authors say it works best for people with good insight (Ustun 2017). Specificity is poor in bipolar disorder and borderline personality disorder (May 2023).</li>" +
            "</ul>" +
            "<p>In this app the ASRS-5 is shown only as the licence allows. For screening, prefer the ASRS v1.1 Part A, which has a public scoring rule.</p>"
        },
        {
          h: "WURS-25: childhood in retrospect",
          html:
            "<p>The Wender Utah Rating Scale (Ward, Wender and Reimherr 1993) asks adults to rate themselves as children: 'As a child I was (or had)...'. The full scale has 61 items. The 25 items that best separated adults with ADHD from controls form the WURS-25. Each is rated 0 (not at all or very slightly) to 4 (very much), giving a total of <strong>0 to 100</strong>.</p>" +
            "<h4>Cut-offs</h4>" +
            "<table><thead><tr><th>Cut-off</th><th>Performance</th><th>Source</th></tr></thead><tbody>" +
            "<tr><td>46 or more</td><td>Correctly classified 86% of adults with ADHD, 99% of controls and 81% of people with depression</td><td>Ward 1993</td></tr>" +
            "<tr><td>36 or more</td><td>Sensitivity 96%, specificity 96% against controls</td><td>Ward 1993, as reported by later studies</td></tr>" +
            "<tr><td>36 / 46</td><td>Sensitivity 0.89 / 0.75; specificity 0.90 / 0.95 against population controls</td><td>Brevik 2020</td></tr>" +
            "<tr><td>39</td><td>Best balance in a mixed psychiatric clinic: sensitivity 0.88, specificity 0.70</td><td>Kouros 2018</td></tr>" +
            "<tr><td>36 / 46 in the same clinic</td><td>36: sensitivity 0.90, specificity 0.59. 46: sensitivity 0.80, specificity 0.80</td><td>Kouros 2018</td></tr>" +
            "</tbody></table>" +
            "<h4>Read it with care</h4>" +
            "<ul>" +
            "<li><strong>It measures memory, not history.</strong> At population prevalence, adult self-report of childhood ADHD had a PPV of only 0.27 (Mannuzza 2002). Look for school reports and a childhood informant.</li>" +
            "<li><strong>It is not DSM-based.</strong> Many items concern mood, temper, guilt and self-esteem. Scores rise in borderline personality disorder, bipolar disorder and depression. At 46, 19% of a depressed group were misclassified (Ward 1993). In a mixed clinic, a cut-off around 39 performs better (Kouros 2018).</li>" +
            "<li><strong>Use the right version.</strong> The German WURS-k is a different instrument with 21 scored items and a cut-off above 30. Do not mix its cut-off with the WURS-25.</li>" +
            "</ul>" +
            "<p>Example: a WURS-25 of 52 in someone with borderline personality disorder is above the original cut-off. It does not show childhood ADHD. Look at which items drive the score (concentration and impulsivity, or mood and anger?) and seek contemporaneous evidence.</p>"
        },
        {
          h: "WFIRS-S: measuring impairment",
          html:
            "<p>The Weiss Functional Impairment Rating Scale, self-report (WFIRS-S), has 69 items in 7 domains: family (8), work (11), school (10), life skills (12), self-concept (5), social (9) and risk (14). Each item asks how emotional or behavioural problems affected that area over the <strong>last month</strong>: 0 never or not at all, 1 sometimes or somewhat, 2 often or much, 3 very often or very much, or not applicable. It deliberately avoids ADHD symptom items, so it measures functioning separately from symptoms.</p>" +
            "<h4>Scoring</h4>" +
            "<ul>" +
            "<li>For each domain, count items scored 2 or 3, add the total, and work out the mean over the items answered (not applicable items are left out).</li>" +
            "<li>A domain is <strong>impaired</strong> if 2 or more items are rated 2, or 1 or more item is rated 3, or the mean is 1.5 or more (CADDRA scoring guidance; an older version says a mean above 1.5).</li>" +
            "<li>A change in total score of about 13 points is considered a meaningful improvement, roughly half a standard deviation (CADDRA 2011).</li>" +
            "</ul>" +
            "<h4>Worked example</h4>" +
            "<p>Work domain, 11 items: 2, 2, 0, 1, 0, 1, 0, 3, 1, 2, 1. Three items are rated 2 and one is rated 3, so the domain is <strong>impaired</strong>, even though the mean is 13 / 11 = 1.18, below 1.5. Any one of the three rules is enough.</p>" +
            "<p>Self-concept domain: 2, 3, 2, 2, 1. Impaired. But self-concept scores also rise with depression, so read this domain alongside the PHQ-9.</p>" +
            "<h4>Limits</h4>" +
            "<ul>" +
            "<li>Not specific to ADHD: depression and anxiety raise total and domain scores (Canu 2020).</li>" +
            "<li>The thresholds are clinical conventions, not cut-offs derived from adult accuracy studies.</li>" +
            "<li>Self-reported functioning can be over-reported, and the risk domain often shows floor effects.</li>" +
            "</ul>" +
            "<p>UKAAN says impairment scales such as the WFIRS can support the judgement, but the judgement should rest mainly on the interview (AQAS 2024). Use the WFIRS-S to find domains to explore in the Onset and impairment step, and as a baseline for follow-up. The author's licence allows free clinical use of the unmodified scale (copyright Dr Margaret Weiss), and she asks to be contacted before it is posted online. RCPsych CR235 lists it as pay per use; the author's own statement takes precedence.</p>"
        },
        {
          h: "CAARS 2 and BAARS-IV: normed scales, informant forms and validity indexes",
          html:
            "<h4>CAARS 2 (Conners Adult ADHD Rating Scales, 2nd edition; MHS 2023)</h4>" +
            "<ul>" +
            "<li>For ages 18 and over, with Self-Report and Observer forms. Full (10 to 20 minutes), Short (5 to 10 minutes) and ADHD Index (1 to 3 minutes) versions. Proprietary, with qualification requirements and pay-per-report scoring.</li>" +
            "<li>Content scales cover inattention and executive dysfunction, hyperactivity, impulsivity, emotional dysregulation and negative self-concept, with DSM-5-TR symptom scales. Clinical-concern items cover suicidality, self-harm, anxiety and sadness. Impairment items are included.</li>" +
            "<li>Results are T-scores (mean 50, standard deviation 10 in the normative sample): 70 or more very elevated, 65 to 69 elevated, 60 to 64 slightly elevated, below 60 not elevated. The 12-item ADHD Index is reported as a probability band, from very low (1 to 9%) to very high (90 to 99%).</li>" +
            "<li>Norms come from 2,640 people in the US and Canada.</li>" +
            "</ul>" +
            "<p><strong>Response style analysis</strong> includes a Negative Impression Index (a score of 6 or more on the Short form warrants follow-up), an Inconsistency Index, omitted items, and pace (under 1 item per minute is unusually slow). On the original CAARS, the published Infrequency Index (more than 20 suggests non-credible reporting) had sensitivity of 17 to 50% and specificity of 86 to 95% on cross-validation (Suhr 2011, as reviewed by Becke 2021), and an Exaggeration Index had specificity 0.97 but sensitivity 0.24 (Harrison and Armstrong 2016). These figures come from the original CAARS; equivalent accuracy data for the CAARS 2 indexes were not found in the sources reviewed.</p>" +
            "<h4>BAARS-IV (Barkley Adult ADHD Rating Scale-IV; Guilford 2011)</h4>" +
            "<ul>" +
            "<li>Self-report and other-report forms for current symptoms and for childhood symptoms, a 3 to 5 minute Quick Screen, and interview versions.</li>" +
            "<li>Includes items on sluggish cognitive tempo. Ages 18 to 89, with score sheets by age band (18 to 39, 40 to 59, 60 to 89).</li>" +
            "<li>Sold with a limited licence for purchasers to photocopy forms.</li>" +
            "<li>The sources reviewed for this app do not describe embedded validity indexes for BAARS-IV. Use other checks on over-reporting.</li>" +
            "</ul>" +
            "<h4>Why validity indexes matter, and their limits</h4>" +
            "<p>In adults referred for ADHD, mostly in North American clinics, 15 to 31% gave non-credible responses on validity measures. Coached simulators easily produced ADHD-like profiles, and the CAARS self-report was particularly susceptible (Sollman 2010). In one study, 71% of people with suspect effort would have been diagnosed from the interview alone (Marshall 2016). Symptom over-reporting and poor test effort are largely separate: 22% had invalid symptom reports and 16% invalid performance tests, but only 6% had both (Ovsiew 2023).</p>" +
            "<ul>" +
            "<li>A raised index is a reason to look harder, not a verdict of feigning. Severe distress, comorbidity and misunderstanding can raise it.</li>" +
            "<li>A clean index does not prove credibility. Sensitivity is low.</li>" +
            "<li>Two or more independent failures carry more weight than one (Sollman 2010). Where concern remains, refer for formal symptom and performance validity testing.</li>" +
            "</ul>" +
            "<h4>Informant forms</h4>" +
            "<p>Options include the CAARS 2 Observer form, BAARS-IV other-report forms (current and childhood), the ASRS completed by someone who knows the person well (as CADDRA uses it), and the ACE+ informant questionnaire. Compare self and informant answers item by item. Disagreement is information: limited insight (Kooij 2019 notes that adults may report many symptoms with little impairment, or the reverse), an informant who shares the traits, relationship conflict, or a parent who minimises. Ask about specific examples rather than averaging the scores.</p>"
        },
        {
          h: "Objective tests: QbTest and neuropsychology",
          html:
            "<h4>QbTest</h4>" +
            "<p>QbTest combines a continuous performance test with infrared motion tracking, and is designed for ages 6 to 60. NICE HTG729 (2024) recommends it as an option to help diagnose ADHD in people aged 6 to 17, and only alongside a standard clinical assessment. For people aged 18 and over, NICE says more research is needed and that the evidence from under-18s does not generalise to adults. Adult clinic studies are discouraging: in 69 UK adult referrals QbTest+ failed to differentiate those with ADHD (Adamou 2022), and in 114 outpatients only the activity measure differed, with an AUC of 65% (Brunkhorst-Kanaan 2020). The NHSE Taskforce states that QbTest is not a freestanding diagnostic test. In this app it is information only.</p>" +
            "<h4>Neuropsychological tests and EEG</h4>" +
            "<ul>" +
            "<li>No neuropsychological or neurobiological test has enough predictive power to diagnose an individual. Neuropsychological instruments classified only 53 to 66% of cases correctly (Kooij 2019).</li>" +
            "<li>Executive tests have good positive but poor negative predictive value, so using them to rule ADHD out produces many false negatives (BAP 2014).</li>" +
            "<li>IQ testing is not mandatory. Consider neuropsychological assessment when impairment seems out of proportion to symptoms, when a learning disorder or intellectual disability is suspected, or for educational or legal purposes (BAP 2014; AADPA).</li>" +
            "<li>Continuous performance tests overlap heavily between people with and without ADHD (CADDRA 4.1). EEG is not recommended for diagnosis (BAP 2014; Kooij 2019), and CADDRA does not endorse it.</li>" +
            "</ul>" +
            "<h4>When a patient asks for 'a test'</h4>" +
            "<blockquote>'There isn't a blood test, scan or computer test that can diagnose ADHD in adults. The most accurate method we have is a careful interview about your life now and as a child, with information from people who knew you. That's what we'll do.'</blockquote>"
        },
        {
          h: "Pitfalls: why scores mislead",
          html:
            "<table><thead><tr><th>Pitfall</th><th>Why it happens</th><th>What to do</th></tr></thead><tbody>" +
            "<tr><td>Comorbidity inflates scores</td><td>Poor concentration, restlessness, irritability and impulsivity also occur in depression, anxiety, substance use, bipolar disorder, borderline personality disorder and trauma. Specificity falls in these groups (May 2023; van de Glind 2013); WURS and WFIRS rise with mood problems.</td><td>Give mood, anxiety and substance screens alongside. Interpret ADHD scores against current state, and re-rate after a mood episode settles.</td></tr>" +
            "<tr><td>State effects</td><td>Self-reports shift with mood, sleep and time of day (Brevik 2020).</td><td>Record when and in what state the forms were completed.</td></tr>" +
            "<tr><td>Insight</td><td>Adults may over- or under-report (Kooij 2019).</td><td>Seek informants and records.</td></tr>" +
            "<tr><td>Norms and sex</td><td>Norms from male or mixed samples may disadvantage women, and rigid cut-offs give false positives and negatives (UKAP females consensus 2020).</td><td>Treat cut-offs as guides, not gates.</td></tr>" +
            "<tr><td>Culture, language and literacy</td><td>Items assume a cultural norm and reading level. ICD-11 asks for symptoms to be judged against cultural norms.</td><td>Read items aloud if needed; use validated translations; explore meaning in the interview.</td></tr>" +
            "<tr><td>Wrong version or scoring</td><td>Unweighted ASRS-5; WURS-k cut-offs applied to the WURS-25; DSM-IV thresholds treated as criteria.</td><td>Use the published scoring for the exact version. The Tools and scoring library does this.</td></tr>" +
            "<tr><td>Priming and coaching</td><td>People who have read about ADHD may endorse most items (CR235 9.6). Checklists invite confirmation bias (AQAS 2024).</td><td>Ask for examples of every high-scoring item. Look for consistency across sources.</td></tr>" +
            "<tr><td>Negative screen used to rule out</td><td>In high-prevalence settings, many people with ADHD screen negative.</td><td>Never exclude on a screen, especially in specialist or high-risk services.</td></tr>" +
            "<tr><td>Informant bias</td><td>Informants may share traits, be in conflict with the patient, or forget.</td><td>Ask informants for specific examples; weigh agreement, not just scores.</td></tr>" +
            "</tbody></table>"
        },
        {
          h: "Presenting results in a report",
          html:
            "<p>UKAAN recommends reporting interview and questionnaire scores with an accompanying narrative (AQAS 2024). A good scale entry answers six questions:</p>" +
            "<ol>" +
            "<li>Which tool and version, and who completed it?</li>" +
            "<li>When, and over what timeframe (past 6 months, last month, childhood)?</li>" +
            "<li>What score, and by which rule or cut-off?</li>" +
            "<li>What it means in plain words.</li>" +
            "<li>What may have affected it: mood, sleep, substances, comorbidity, insight.</li>" +
            "<li>How it fits with the interview and collateral, including any disagreement.</li>" +
            "</ol>" +
            "<h4>Example entry</h4>" +
            "<blockquote>Questionnaires (supporting information, not diagnostic). ASRS v1.1, self-report, completed 2 weeks before assessment, past 6 months: Part A, 5 of 6 items in the shaded range (screen positive); total 49 of 72; 8 of 9 inattention items shaded. WURS-25: 41 of 100, between the alternative (36) and original (46) cut-offs; the score was driven mainly by concentration, restlessness and school items rather than mood items. WFIRS-S: impaired domains were work and life skills. PHQ-9: 12 (moderate), so current low mood may have raised some ratings. Her partner's ASRS observer ratings agreed on most inattention items. These scores were used as a baseline and as interview prompts. The diagnosis rests on the interview, childhood evidence and collateral described above.</blockquote>" +
            "<h4>Wording to avoid and to use</h4>" +
            "<table><thead><tr><th>Avoid</th><th>Use instead</th></tr></thead><tbody>" +
            "<tr><td>'The ASRS confirms ADHD.'</td><td>'ASRS Part A screen positive (5 of 6 shaded). Screening result only.'</td></tr>" +
            "<tr><td>'WURS 48: childhood ADHD proven.'</td><td>'WURS-25 48, above the original cut-off of 46. This reflects recalled childhood traits and is consistent with the school reports.'</td></tr>" +
            "<tr><td>'CAARS invalid: malingering.'</td><td>'The CAARS 2 Negative Impression Index was raised. This prompts caution about over-reporting and was explored further; it is not by itself evidence of feigning.'</td></tr>" +
            "<tr><td>'QbTest normal, so ADHD excluded.'</td><td>Do not use QbTest for adult diagnosis (NICE HTG729).</td></tr>" +
            "</tbody></table>" +
            "<p>Store the scores. They become the baseline when you review progress after diagnosis and treatment.</p>"
        }
      ],
      keyPoints: [
        "Rating scales screen, describe, set a baseline and monitor. They cannot establish onset, pervasiveness, impairment threshold, exclusions or credibility (NICE NG87 1.3.2).",
        "PPV depends on the base rate. In primary care most positive screens are false; in a specialist clinic a negative screen does not exclude ADHD.",
        "ASRS v1.1 Part A is positive when 4 or more of items 1 to 6 are in the shaded range (items 1 to 3 from Sometimes, 4 to 6 from Often). Part B has no total.",
        "The ASRS-5 uses weighted scoring from 0 to 25 with a cut-off of 14. The weights are proprietary, so unweighted 0 to 24 versions are not validated.",
        "The WURS-25 (0 to 100; cut-offs 36 and 46) measures recalled childhood traits, including mood and temper, and rises in borderline personality disorder, bipolar disorder and depression.",
        "On the WFIRS-S a domain is impaired when 2 or more items score 2, or 1 or more scores 3, or the mean is 1.5 or more. It supports, but does not replace, the interview's impairment judgement.",
        "CAARS 2 has response style indexes. A raised index prompts follow-up; a clean one does not prove credibility.",
        "QbTest, neuropsychological tests and EEG do not diagnose adult ADHD. NICE regards QbTest in adults as research only.",
        "Report each score with the tool, rule, timeframe, context and limits. Never write that a scale 'confirms' ADHD."
      ],
      pitfalls: [
        "Using a screening cut-off to accept, reject or prioritise referrals.",
        "Reading a positive screen as a diagnosis, or a negative screen as a rule-out in a specialist clinic.",
        "Scoring the ASRS-5 as 0 to 4 per item, or applying WURS-k cut-offs to the WURS-25.",
        "Ignoring current depression, anxiety, substance use or poor sleep when interpreting high scores.",
        "Treating a clean validity index as proof of credibility, or a raised one as proof of feigning.",
        "Offering QbTest or EEG as part of an adult diagnostic assessment.",
        "Writing 'the ASRS confirms ADHD' in a report."
      ],
      quiz: [
        { q: "A screen with sensitivity 90% and specificity 80% is used where 3% of adults have ADHD. Of every 100 positive screens, about how many people have ADHD?",
          options: ["About 12", "About 50", "About 80", "About 90"], a: 0,
          why: "Per 1,000 people: 27 true positives and 194 false positives, so PPV = 27 / 221, about 12%. At low base rates most positives are false, even with a good test." },
        { q: "The same screen is used in a specialist clinic where 58% of referrals have ADHD. What is the PPV?",
          options: ["About 12%", "About 40%", "About 86%", "About 99%"], a: 2,
          why: "Per 1,000: 522 true positives and 84 false positives, so PPV = 522 / 606, about 86%. But the NPV is only about 85%: 58 of 394 negatives have ADHD, so a negative screen does not rule ADHD out here." },
        { q: "When is the ASRS v1.1 Part A screen positive?",
          options: ["When the 0 to 24 Part A sum is 14 or more", "When 4 or more of items 1 to 6 fall in the shaded range", "When any item is rated Very often", "When the Part A plus Part B total is 36 or more"], a: 1,
          why: "The official rule counts shaded answers in items 1 to 6, and 4 or more is positive. Continuous sums are research alternatives and were not better than the original rule in substance use patients." },
        { q: "Which ASRS v1.1 Part A items count as shaded from 'Sometimes' upwards?",
          options: ["Items 4, 5 and 6", "All six items", "None: every item needs 'Often'", "Items 1, 2 and 3"], a: 3,
          why: "Items 1, 2 and 3 count from Sometimes; items 4, 5 and 6 need Often or Very often. In Part B, items 9, 12, 16 and 18 also count from Sometimes." },
        { q: "A website scores the ASRS-5 as 0 to 4 per item, totals 0 to 24, and uses a cut-off of 14. What is wrong?",
          options: ["Nothing; that is the published method", "The cut-off should be 4", "The ASRS-5 has 18 items", "The validated ASRS-5 uses weighted scoring from 0 to 25 with unpublished weights, so the unweighted version is not validated"], a: 3,
          why: "Ustun 2017 (corrected 2019) uses integer weights per response, with item maxima of 5, 5, 6, 2, 4 and 3 (total 25). The intermediate weights are proprietary. The 14 cut-off was validated only for the weighted score." },
        { q: "A patient with borderline personality disorder scores 52 on the WURS-25. What is the best interpretation?",
          options: ["It confirms childhood ADHD", "It is above the original cut-off, but WURS scores rise in borderline personality disorder, bipolar disorder and depression; look at which items drive it and seek contemporaneous evidence", "It excludes borderline personality disorder", "It is invalid because the maximum WURS-25 score is 50"], a: 1,
          why: "Many WURS-25 items concern mood, anger and self-esteem. Recall of childhood is unreliable (PPV 0.27 at population prevalence, Mannuzza 2002). The maximum score is 100." },
        { q: "On the WFIRS-S, when is a domain considered impaired?",
          options: ["When the domain total is above 30", "When any item is rated 1", "When 2 or more items are rated 2, or 1 or more is rated 3, or the mean is 1.5 or more", "When the mean is below 0.65"], a: 2,
          why: "Any one of these rules is enough (CADDRA scoring guidance). The 0.65 figure comes from the parent form in children and does not apply here." },
        { q: "The CAARS 2 Negative Impression Index is raised. What does this mean?",
          options: ["Possible over-reporting that needs follow-up; it is not proof of feigning", "ADHD is confirmed", "The patient under-reported symptoms", "The diagnosis must be excluded"], a: 0,
          why: "Validity indexes flag a response style to explore. Distress, comorbidity or misunderstanding can raise them, and their sensitivity is low. Combine several sources and refer for formal testing if concern remains." },
        { q: "A 27-year-old asks for a QbTest to 'prove' they have ADHD. What is the best reply?",
          options: ["Agree, because NICE recommends it for adults", "Explain that NICE regards QbTest in adults as research only, and that the diagnosis rests on a careful clinical assessment", "Offer an EEG instead", "Agree if no informant is available"], a: 1,
          why: "NICE HTG729 recommends QbTest only for ages 6 to 17, alongside clinical assessment. Adult clinic studies found poor discrimination. EEG is not recommended either." },
        { q: "Why do co-occurring conditions inflate ADHD rating scale scores?",
          options: ["Comorbidity improves concentration", "The scales measure only childhood", "Computer scoring is biased", "The items capture concentration, restlessness and impulsivity that also occur in depression, anxiety, substance use, bipolar disorder and borderline personality disorder, so specificity falls in clinical groups"], a: 3,
          why: "The Australian guideline's review found ASRS accuracy below 80% in major depression and poor specificity in substance use, bipolar disorder and borderline personality disorder. Screen for these alongside the ADHD scales." },
        { q: "In treatment-seeking substance use patients, the ASRS v1.1 screener had sensitivity 0.84, specificity 0.66, PPV 0.26 and NPV 0.97. What is the most useful conclusion?",
          options: ["A negative screen makes ADHD unlikely; a positive screen needs a full assessment, and most positives will not have ADHD", "A positive screen confirms ADHD", "The ASRS should never be used in addiction services", "A negative screen proves the patient is honest"], a: 0,
          why: "With 13% prevalence and modest specificity, about three in four positives were false (PPV 0.26), while negatives were highly reliable (NPV 0.97). Use the screen to decide who needs assessment, not to diagnose." },
        { q: "Which sentence is the best way to report a screening result?",
          options: ["'The ASRS confirms ADHD.'", "'WURS 48: childhood ADHD proven.'", "'ASRS Part A 5 of 6 in the shaded range (screen positive); used as a baseline and interview prompt; current low mood may have raised scores.'", "'Questionnaires are not relevant and were not reported.'"], a: 2,
          why: "A good entry names the tool, rule and result, says what it means, notes what may have affected it, and makes clear it is supporting information. AQAS recommends reporting scores with a narrative." }
      ],
      refs: [
        "Kessler RC et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS). Psychol Med 2005;35:245-256. ASRS-v1.1 Symptom Checklist and instructions (WHO 2003).",
        "Adler LA et al. Establishing US norms for the ASRS-v1.1. Int J Clin Pract 2019;73:e13260.",
        "van de Glind G et al. Validity of the ASRS as a screener for adult ADHD in treatment-seeking substance use disorder patients. Drug Alcohol Depend 2013.",
        "Brevik EJ et al. Validity and accuracy of the ASRS and the WURS symptom checklists for adult ADHD. Brain Behav 2020;10:e01605.",
        "Ustun B et al. The WHO Adult ADHD Self-Report Screening Scale for DSM-5. JAMA Psychiatry 2017;74:520-527 (corrections 2017 and 2019).",
        "Ballmann C et al. German ASRS-5 in primary care. Front Psychol 2022.",
        "Ward MF, Wender PH, Reimherr FW. The Wender Utah Rating Scale. Am J Psychiatry 1993;150:885-890.",
        "Kouros I et al. WURS-25 Swedish validation. Ups J Med Sci 2018;123:230-236.",
        "Mannuzza S et al. Accuracy of adult recall of childhood ADHD. Am J Psychiatry 2002;159:1882.",
        "Weiss MD. WFIRS-S form and scoring guidance (CADDRA 2011 and 2025).",
        "Canu WH et al. WFIRS-S in college students. J Atten Disord 2020;24:1648.",
        "MHS. CAARS 2 brochure (2024) and CAARS 2-Short sample report.",
        "Becke M et al. Non-credible symptom report in adult ADHD: a new validity index embedded in the CAARS. J Neural Transm 2021.",
        "Harrison AG, Armstrong IT. Clin Neuropsychol 2016;30:265-283; Sollman MJ et al. Psychol Assess 2010;22:325-335; Marshall PS et al. Psychol Assess 2016;28:1290-1302; Ovsiew GP et al. Clin Neuropsychol 2023;37:1498-1515.",
        "Guilford Press. Barkley Adult ADHD Rating Scale-IV (BAARS-IV), 2011.",
        "NICE HTG729. Digital technologies for assessing ADHD (2024). Adamou M et al. J Atten Disord 2022; Brunkhorst-Kanaan N et al. Front Psychiatry 2020.",
        "NICE NG87 recommendations 1.3.2 and 1.7.26.",
        "Adamou M et al. UKAAN AQAS. Front Psychiatry 2024;15:1380410.",
        "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023).",
        "May T et al. Australian evidence-based clinical practice guideline for ADHD. Aust N Z J Psychiatry 2023;57:1101-1116.",
        "Kooij JJS et al. Updated European Consensus Statement. Eur Psychiatry 2019;56:14-34.",
        "Bolea-Alamañac B et al. BAP guidelines. J Psychopharmacol 2014;28:179-203.",
        "CADDRA. Canadian ADHD Practice Guidelines 4.1 (2020).",
        "Young S et al. Females with ADHD: UKAP consensus. BMC Psychiatry 2020;20:404.",
        "NHS England ADHD Taskforce Parts 1 and 2 (2025); DHSC independent review final report (2026).",
        "PhenX Toolkit protocol 121501 (ASRS-v1.1 administration notes)."
      ]
    }
  ]);
})(window.AA);
