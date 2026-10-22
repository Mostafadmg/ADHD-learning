/* Teaching cases c1-c8 (ARCHITECTURE.md 5.8). Fictional adults; any resemblance to real people is chance.
   c1 classic combined ADHD with childhood evidence and collateral; c2 masked inattentive ADHD at perimenopause;
   c3 bipolar II disorder mimicking ADHD; c4 autism, not ADHD; c5 ADHD with co-occurring depression and treatment order;
   c6 daily cannabis use and a late-onset picture; c7 obstructive sleep apnoea presenting as poor attention;
   c8 high-ability lawyer with compensated ADHD (impairment judged against effort).
   UK practice (NICE NG87) is the default frame. DSM-5-TR and ICD-11 are paraphrased. DIVA wording is not used.
   Cut-offs, NICE recommendation numbers and study figures come from the research briefs of 21 October 2026
   (guidelines-uk, guidelines-intl, tools-adhd, tools-comorbid, ddx-evidence). Points not taken from a named
   source are labelled "clinical practice". Questionnaire scores are invented for teaching but kept internally
   consistent with each instrument's scoring rules. */
(function (AA) {
  'use strict';

  AA.add('cases', [

    /* ================================================================== */
    /* c1 Classic combined ADHD                                             */
    /* ================================================================== */
    {
      id: "c1",
      title: "Classic combined ADHD with clear childhood evidence",
      patient: "29-year-old warehouse shift supervisor (he/him), referred by his GP",
      tags: ["combined", "classic", "school reports", "collateral", "alcohol", "driving"],
      difficulty: 1,
      referral: "GP letter: Jordan is 29 and supervises the night shift at a distribution centre. He has lost three jobs in five years, mostly for lateness, unfinished tasks and arguments with managers. His partner of six years is worried about unpaid bills and his driving (three speeding fines and a minor crash last year). He describes being 'on the go all my life' and says his mother still calls him 'the whirlwind'. His younger brother was diagnosed with ADHD at 9. ASRS Part A in surgery: 6 of 6 in the shaded boxes. Drinks at weekends. No history of psychosis, bipolar disorder or self-harm, and no childhood diagnosis. Referred for specialist assessment under NICE NG87 1.2.10.",
      stages: [
        {
          title: "Pre-assessment questionnaires",
          html:
            "<p>The service sent its standard pack before the appointment. Jordan returned it within a week. His mother, Denise, posted copies of his primary school reports, and his partner, Kelly, completed an informant form.</p>" +
            "<table><thead><tr><th>Tool</th><th>Result</th><th>How to read it</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1 Part A</td><td>6 of 6 in the shaded boxes</td><td>Positive screen (4 or more): further assessment is warranted. It is not a diagnosis.</td></tr>" +
            "<tr><td>ASRS v1.1 Part B</td><td>9 of 12 shaded. Dichotomous profile: inattention 8/9, hyperactivity-impulsivity 7/9</td><td>Part B has no total cut-off. The endorsed items become probes for the interview.</td></tr>" +
            "<tr><td>WURS-25</td><td>61 out of 100</td><td>Above the original cut-off of 46. It is retrospective self-report, so it needs records or an informant behind it.</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Impaired: work, family, life skills, self-concept, risk. Not impaired: social. School: not applicable</td><td>The domain rule (two items at 2, one item at 3, or mean 1.5 or more) is met in 5 of 6 rated domains. Not specific to ADHD.</td></tr>" +
            "<tr><td>PHQ-9</td><td>6; item 9 = 0</td><td>Mild range. Points come from sleep, concentration and restlessness, which overlap with ADHD.</td></tr>" +
            "<tr><td>GAD-7</td><td>5</td><td>Mild range.</td></tr>" +
            "<tr><td>AUDIT</td><td>12 (AUDIT-C 9)</td><td>Increasing risk (8 to 15). Weekend binge pattern.</td></tr>" +
            "<tr><td>DAST-10</td><td>1</td><td>Low level.</td></tr>" +
            "<tr><td>AQ-10</td><td>2</td><td>Below the referral threshold of 6.</td></tr>" +
            "<tr><td>MDQ</td><td>5 of 13 items; question 2 (same period) answered no</td><td>Negative.</td></tr>" +
            "</tbody></table>" +
            "<p>Treat the pack as a set of hypotheses to test, not as evidence of the diagnosis. Two things stand out already: the ADHD screens point the same way as the school reports, and the AUDIT shows a drinking pattern you must explore before you can say what is causing what.</p>",
          q: {
            q: "How should you use Jordan's ASRS result?",
            options: [
              "As confirmation of ADHD, because all six Part A items are shaded",
              "Not at all, because self-report scales are unreliable in adults",
              "As a reason to go on to a full assessment, using the endorsed items as probes for real-life examples",
              "As a substitute for a childhood history, because a score this high makes onset obvious"
            ],
            a: 2,
            why: "A positive Part A (4 or more shaded) means symptoms are highly consistent with adult ADHD and further assessment is warranted. NICE NG87 1.3.2 says a diagnosis should not be made solely on rating scales, and UKAAN AQAS warns that checklist-led assessment risks confirmation bias. The scale is still useful: each endorsed item tells you where to ask for concrete examples. It says nothing about onset, pervasiveness, impairment or other explanations."
          }
        },
        {
          title: "History",
          html:
            "<h4>Development and school</h4>" +
            "<p>Born at term after an uneventful pregnancy. Walked at 11 months. Denise: “He never walked anywhere, he ran.” Broke his arm at 7 jumping off a garage roof. At primary school he was moved to sit next to the teacher every year. At secondary school he had weekly detentions, mostly for talking and missing homework, and a one-day exclusion in Year 9 for repeated disruption. He left at 16 with four GCSEs and started, then dropped, a plumbing course.</p>" +
            "<h4>Work, money and driving</h4>" +
            "<ul><li>Kitchen porter, then commis chef: walked out after an argument at 21.</li>" +
            "<li>Courier: dismissed at 24 for late deliveries and two lost parcels.</li>" +
            "<li>Retail: dismissed at 27 for lateness after three written warnings.</li>" +
            "<li>Current job (18 months): one written warning for an unfinished stock count. His team like him: “I'm good when it all kicks off.”</li>" +
            "<li>About £6,000 of credit card debt, regular late-payment fees, impulsive purchases (a £900 drone used twice).</li>" +
            "<li>Three speeding fines. Last year he ran into the back of a car while changing the music on his phone.</li></ul>" +
            "<h4>Mental and physical health</h4>" +
            "<p>No mood episodes. He felt “fed up for a week or two” after each dismissal. No self-harm or suicidal thoughts. Alcohol since 15 or 16: now 10 to 12 pints on a Saturday, little in the week. Occasional cannabis from 16 to 19, none in the last year apart from once at a festival. Concussion at 15 playing rugby, with brief loss of consciousness and no admission. No seizures. Sleep: lies awake until 1 or 2 am on days off with his “mind going ten ways”. Kelly says he does not snore.</p>" +
            "<h4>Family and strengths</h4>" +
            "<p>Younger brother diagnosed with ADHD at 9 and treated until 18. Father “never stuck at a job either”. Jordan is warm, funny, practical and calm in a crisis.</p>",
          q: {
            q: "How much weight should the concussion at 15 carry in the differential?",
            options: [
              "A lot: post-concussion syndrome is the most likely explanation for his attention problems",
              "Little, because school reports from age 5 to 10 already describe the same difficulties, years before the injury",
              "None, because head injury is never relevant in an ADHD assessment",
              "It means a brain scan is needed before any diagnosis can be made"
            ],
            a: 1,
            why: "Always ask about head injury (UKAAN AQAS lists seizures and head injury as specific enquiries, and NICE NG87 1.2.1 lists people with acquired brain injury among the groups who may have a higher prevalence of ADHD). What matters is the timeline. Symptoms that are documented years before the injury cannot have been caused by it. A stepwise change in attention after an injury would point the other way. Imaging is not part of a routine ADHD assessment."
          }
        },
        {
          title: "Adult symptoms at interview",
          html:
            "<p>The interview took 2 hours 40 minutes with a break. Each of the 18 symptoms was explored with open questions about the last six months, and Jordan was asked for his own examples before any were suggested. Kelly joined for the last hour.</p>" +
            "<h4>Inattention: 7 of 9 present</h4>" +
            "<ul><li><strong>Sustaining attention:</strong> “I can't get through the 20-minute safety briefing. I'm thinking about my car by minute three.”</li>" +
            "<li><strong>Seems not to listen:</strong> Kelly: “I'll tell him something while he's looking right at me and ten minutes later he asks the same thing.”</li>" +
            "<li><strong>Follow-through:</strong> the bathroom has been half-tiled for two years; the stock count that led to his warning was abandoned halfway.</li>" +
            "<li><strong>Organising:</strong> rotas are drafted the night before and often wrong; his car is “a skip”.</li>" +
            "<li><strong>Loses things:</strong> work pass replaced four times this year; keys and wallet lost weekly.</li>" +
            "<li><strong>Distractible:</strong> starts one job on the warehouse floor and is pulled into three others.</li>" +
            "<li><strong>Forgetful:</strong> missed two dental appointments and his niece's birthday; bills go unpaid unless Kelly reminds him.</li></ul>" +
            "<p>Scored unsure and not counted: <em>careless mistakes</em> (he triple-checks safety paperwork because a mistake once cost him a job) and <em>avoiding effortful tasks</em> (he leaves forms to Kelly, but says he will do them if pushed, and she agrees).</p>" +
            "<h4>Hyperactivity-impulsivity: 7 of 9 present</h4>" +
            "<ul><li>Jiggles his leg and clicks pens through meetings; managers have commented.</li>" +
            "<li>Cannot stay in his seat in team briefings; paces during phone calls.</li>" +
            "<li>Constant inner restlessness: “Like I've had ten coffees, all the time.”</li>" +
            "<li>Always on the go; friends find him exhausting on holiday.</li>" +
            "<li>Finishes other people's sentences and answers before questions are finished.</li>" +
            "<li>Walks out of queues; road rage at traffic lights.</li>" +
            "<li>Interrupts and takes over colleagues' tasks.</li></ul>" +
            "<p>Not counted: <em>leisure quietly</em> (he can play video games for hours without disturbing anyone) and <em>talks excessively</em> (he talks a lot, but nobody has ever complained and it causes no problems).</p>" +
            "<p>Settings: work, home, social life and driving. Duration: lifelong, and clearly longer than six months. In the room he fidgeted constantly, got up twice and drifted off topic, but always came back to the question.</p>",
          q: {
            q: "Jordan sat through most of the interview and can game for hours without moving. How should this affect your scoring?",
            options: [
              "Very little: behaviour in a novel, one-to-one setting and focus on highly rewarding activities do not rule symptoms out, so score each symptom on everyday examples",
              "It shows that his hyperactivity is not real, so all hyperactive-impulsive items should be scored absent",
              "It means the combined presentation cannot be diagnosed, only the inattentive presentation",
              "You should repeat the interview on another day and score whatever you observe then"
            ],
            a: 0,
            why: "The European Consensus (Kooij 2019) says that sitting calmly during the assessment does not exclude ADHD, and CADDRA advises against relying on interview observation. Strong focus on rewarding, fast-feedback activities is common in ADHD (ICD-11 notes inattention may not be evident during intensely stimulating activities). Score each symptom on how often it happens in daily life, with examples. Here 7 of 9 hyperactive-impulsive symptoms are clearly present."
          }
        },
        {
          title: "Childhood and collateral",
          html:
            "<h4>School reports (copies supplied by his mother)</h4>" +
            "<ul><li>Reception: “Jordan is full of energy and finds sitting on the carpet very hard.”</li>" +
            "<li>Year 3: “Jordan rushes his work and rarely finishes a piece of writing. He is often out of his seat.”</li>" +
            "<li>Year 5: “Jordan has a kind heart but calls out, interrupts others and loses his belongings constantly.”</li>" +
            "<li>Year 8: “Homework is rarely handed in. Frequent detentions for talking.”</li></ul>" +
            "<h4>Mother (telephone, 45 minutes)</h4>" +
            "<p>Denise gave detailed, specific memories from before 12: climbing everything, running off in shops, unable to wait for his turn in games, losing coats and lunch boxes most weeks, needing instructions repeated three times, nightly homework battles, and calls from school “every other week”. Childhood count from Jordan and Denise together: <strong>8 of 9 inattentive and 8 of 9 hyperactive-impulsive</strong>. Collateral rating: 2 (clear support).</p>" +
            "<h4>Partner</h4>" +
            "<p>Kelly confirmed the adult examples and added the debt figures. Collateral rating: 2 (clear support). One discrepancy: Jordan said he is “not that bad with money”. Kelly described the debt, the missed payments and the drone.</p>",
          q: {
            q: "Jordan rates his money problems as minor; Kelly describes debt and missed payments. What is the best way to handle this?",
            options: [
              "Average the two views and record the impairment as mild",
              "Accept Jordan's view, because adults are the best judges of their own lives",
              "Disregard Kelly's view, because partners in a strained relationship are biased",
              "Go back to specific, checkable examples (statements, letters, late fees) and record how the discrepancy was resolved"
            ],
            a: 3,
            why: "Self-report and informant reports often differ. Adults with ADHD frequently under-report impairment, and informants can over- or under-report. The fix is to anchor both accounts in concrete examples and, where possible, documents, then write down how you resolved the difference. UKAAN AQAS asks reports to discuss missing or contradictory information and its effect on validity."
          }
        },
        {
          title: "Differentials and physical health",
          html:
            "<table><thead><tr><th>Condition</th><th>Evidence</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>Depression</td><td>Short reactive low spells after dismissals; no two-week episode; PHQ-9 items are the ADHD-overlap ones</td><td>Absent</td></tr>" +
            "<tr><td>Bipolar disorder</td><td>No spells of reduced need for sleep, elation or grandiosity; MDQ negative; course is continuous</td><td>Absent</td></tr>" +
            "<tr><td>Anxiety and PTSD</td><td>GAD-7 5; no trauma history of note</td><td>Absent</td></tr>" +
            "<tr><td>Borderline personality disorder</td><td>Anger is quick to flare and quick to settle; no self-harm, identity disturbance or abandonment fears</td><td>Absent</td></tr>" +
            "<tr><td>Autism</td><td>AQ-10 2; easy social reciprocity; many long friendships</td><td>Absent</td></tr>" +
            "<tr><td>Alcohol</td><td>AUDIT 12. Drinking began at 15 or 16, a decade after the first school reports. During a dry January this year Kelly saw no change in his forgetfulness or restlessness</td><td>Co-occurring hazardous drinking</td></tr>" +
            "<tr><td>Cannabis</td><td>Occasional in his late teens; once this year</td><td>Absent</td></tr>" +
            "<tr><td>Insomnia</td><td>Sleep-onset delay from a busy mind, lifelong, worse on days off</td><td>Co-occurring, part of the ADHD picture</td></tr>" +
            "<tr><td>Obstructive sleep apnoea</td><td>No snoring or witnessed pauses; BMI 24; not sleepy in the day</td><td>Absent</td></tr>" +
            "</tbody></table>" +
            "<h4>Physical health</h4>" +
            "<p>BP 126/78, pulse 72 and regular, weight 79 kg, height 180 cm. No chest pain, palpitations, breathlessness or fainting on exertion. No congenital heart disease. An uncle died of a heart attack at 63; no first-degree relative has died suddenly under 40. Takes no regular medicines.</p>",
          q: {
            q: "If Jordan chooses medication later, does he need an ECG first?",
            options: [
              "Yes, every adult needs an ECG before a stimulant",
              "No, not unless he has a cardiac red flag from NICE NG87 1.7.5 or takes a medicine that raises cardiac risk",
              "Yes, because his uncle died of a heart attack",
              "No, and blood pressure and pulse are not needed either"
            ],
            a: 1,
            why: "NICE NG87 1.7.4 (amended 2019) says an ECG is not needed before stimulants, atomoxetine or guanfacine unless the person has a 1.7.5 feature (for example sudden death in a first-degree relative under 40, exertional breathlessness or fainting, a murmur, hypertension) or a co-existing condition treated with a medicine that may pose increased cardiac risk. A second-degree relative dying at 63 is not a 1.7.5 feature. Baseline pulse, blood pressure, height and weight are always recorded."
          }
        },
        {
          title: "Conclusion and feedback",
          html:
            "<h4>Criteria review</h4>" +
            "<ul><li><strong>A:</strong> 7 inattentive and 7 hyperactive-impulsive symptoms in the last six months (5 needed in each domain from age 17).</li>" +
            "<li><strong>B:</strong> several symptoms before 12, documented in school reports from age 5 and in his mother's account.</li>" +
            "<li><strong>C:</strong> present at work, at home, socially and when driving.</li>" +
            "<li><strong>D:</strong> at least moderate impairment: three dismissals, debt, a crash and relationship strain (NICE NG87 1.3.3).</li>" +
            "<li><strong>E:</strong> no other condition better explains the picture. Hazardous drinking and sleep-onset insomnia co-occur.</li></ul>" +
            "<p>Presentation: combined (both thresholds met for six months). Severity: moderate.</p>" +
            "<h4>Feedback (structured discussion, NICE NG87 1.4.3)</h4>" +
            "<ul><li>What ADHD is, and his strengths: energy, calm in a crisis, loyalty to his team.</li>" +
            "<li>Driving: he must tell the DVLA if his ADHD symptoms or medication affect his ability to drive safely. Phones out of reach while driving.</li>" +
            "<li>Alcohol: brief advice on the weekend binges and the higher risk of substance misuse in ADHD.</li>" +
            "<li>Work: reasonable adjustments (written task lists, a short daily handover, a quieter space for rota planning).</li>" +
            "<li>Treatment: environmental modifications first; NICE NG87 1.5.15 offers medication if significant impairment remains once they have been put in place and reviewed. Jordan chose to try both.</li></ul>",
          q: {
            q: "Which statement must the diagnostic report contain?",
            options: [
              "The ASRS Part A score, presented as proof of the diagnosis",
              "A recommended stimulant and starting dose",
              "Evidence for each of criteria A to E with real examples, the presentation, and an explicit statement that the symptoms are not better explained by another disorder",
              "A statement that his drinking means ADHD cannot be confirmed until he has been abstinent for a year"
            ],
            a: 2,
            why: "UKAAN AQAS lists as essential a detailed account of the symptoms, a summary of comorbidity, the outcome with evidence that each criterion was reviewed, the presentation, and explicit confirmation that the symptoms are not better explained by another disorder. Rating-scale scores can be reported with a narrative, but not as proof. Prescribing decisions belong to the treatment plan, not the diagnostic formulation."
          }
        }
      ],
      profile: { adultIA: 7, adultHI: 7, childIA: 8, childHI: 8, impairment: "At least moderate in work (three dismissals, a written warning), relationships and money (debt, conflict with his partner) and safety (three speeding fines, a crash). Social life largely intact." },
      answer: {
        conclusion: "ADHD, combined presentation, moderate. Several symptoms were present from early childhood (school reports from age 5, his mother's detailed account), they persist across work, home, social life and driving, and they cause at least moderate impairment. Hazardous weekend drinking and sleep-onset insomnia co-occur; neither explains the picture.",
        codes: "DSM-5-TR: ADHD, combined presentation, moderate (ICD-10-CM F90.2). ICD-11: 6A05.2.",
        ddx: [
          "Hazardous alcohol use: co-occurring. Symptoms are documented a decade before his first drink and did not change during a month without alcohol.",
          "Insomnia (sleep-onset): co-occurring and lifelong; part of the ADHD picture.",
          "Head injury at 15: not causal, because school reports describe the same difficulties from age 5.",
          "Depression, bipolar disorder, anxiety, borderline personality disorder and autism: absent on history, screens and collateral.",
          "Obstructive sleep apnoea: absent (no snoring, not sleepy, BMI 24)."
        ],
        teaching: [
          "A positive ASRS Part A means 'assess further', not 'ADHD'. Use endorsed items as probes for real-life examples (NICE NG87 1.3.2).",
          "Contemporaneous school reports and a parent who knew the person before 12 are the strongest onset evidence; retrospective scales such as the WURS-25 need this support.",
          "Score each symptom on everyday examples over the last six months. Calm behaviour in the clinic and hyperfocus on games do not rule symptoms out.",
          "When patient and informant disagree, return to specific, checkable examples and document how you resolved it.",
          "A co-occurring condition does not exclude ADHD. Check the timeline and look for periods without the other condition, such as a month without alcohol.",
          "An ECG is not routine before ADHD medication; check the NICE NG87 1.7.5 red flags and always record pulse, blood pressure, height and weight.",
          "Use the structured post-diagnostic discussion (NICE NG87 1.4.3), including driving, substance misuse risk and work adjustments."
        ]
      }
    },

    /* ================================================================== */
    /* c2 Masked inattentive ADHD at perimenopause                          */
    /* ================================================================== */
    {
      id: "c2",
      title: "Masked inattentive ADHD, unmasked at perimenopause",
      patient: "46-year-old secondary school head of year (she/her), British Chinese, referred by her GP",
      tags: ["inattentive", "women", "masking", "perimenopause", "iron deficiency", "interpreter"],
      difficulty: 2,
      referral: "GP letter: Mei is 46, an English teacher and head of Year 9. Over 18 months she has had worsening forgetfulness, 'brain fog', missed deadlines and overwhelm, and she almost missed the deadline for a safeguarding report. Her periods have been irregular and heavy for two years, with night sweats. Transdermal oestradiol and micronised progesterone, started 6 months ago, have helped the sweats and her sleep but not her focus. She was treated for anxiety with sertraline at 29 and at 41, with partial benefit. Her 15-year-old daughter was diagnosed with ADHD (inattentive presentation) last year, and Mei says 'reading about it, I saw my whole life'. ASRS Part A positive in surgery. Blood tests enclosed. Please assess for ADHD.",
      stages: [
        {
          title: "Pre-assessment questionnaires and bloods",
          html:
            "<table><thead><tr><th>Tool or test</th><th>Result</th><th>How to read it</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1 Part A</td><td>4 of 6 shaded (items 1 to 4). Fidgeting: sometimes; driven by a motor: rarely</td><td>Positive screen, carried entirely by the inattention and organisation items.</td></tr>" +
            "<tr><td>ASRS v1.1 Part B</td><td>6 of 12 shaded. Dichotomous profile: inattention 9/9, hyperactivity-impulsivity 1/9</td><td>A strongly inattentive pattern. Probes, not proof.</td></tr>" +
            "<tr><td>WURS-25</td><td>41 out of 100</td><td>Above the alternative cut-off of 36 but below the original 46.</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Impaired: work, family, life skills, self-concept. Not impaired: social, risk</td><td>Four domains meet the impairment rule. Anxiety and low mood also raise WFIRS scores.</td></tr>" +
            "<tr><td>PHQ-9</td><td>9; item 9 = 0</td><td>Mild range.</td></tr>" +
            "<tr><td>GAD-7</td><td>11</td><td>Moderate range; 10 or more merits further evaluation.</td></tr>" +
            "<tr><td>AUDIT-C</td><td>2</td><td>Low risk.</td></tr>" +
            "<tr><td>AQ-10</td><td>3</td><td>Below 6.</td></tr>" +
            "<tr><td>GP bloods</td><td>Hb 118 g/L (low), ferritin 9 micrograms/L (low), TSH and free T4 normal, B12 and folate normal</td><td>Iron deficiency anaemia, probably from heavy periods.</td></tr>" +
            "</tbody></table>" +
            "<p>Two results need thought before the interview: an intermediate WURS-25 and a low ferritin.</p>",
          q: {
            q: "How should you read Mei's WURS-25 score of 41?",
            options: [
              "It rules out ADHD, because it is below the original cut-off of 46",
              "It confirms childhood ADHD, because it is above 36",
              "It is irrelevant, because women cannot be assessed with the WURS",
              "It is an intermediate, retrospective self-report score; many items cover temper and conduct, so the childhood evidence must come from records, informants and interview"
            ],
            a: 3,
            why: "Ward 1993 gives 46 or more as the original cut-off and 36 or more as an alternative. Recall of childhood is unreliable (Mannuzza 2002 found a positive predictive value of only 0.27 at population prevalence), and the WURS-25 is not DSM-based: many items are about temper, mood and behaviour, which quiet, inattentive children may not have shown (clinical reasoning). The UKAP consensus on females also warns that rigid adherence to cut-offs can produce many false positives and false negatives. Use the score as one piece of evidence and look for school reports and a childhood informant."
          }
        },
        {
          title: "History and timeline",
          html:
            "<h4>Childhood and education</h4>" +
            "<p>Mei grew up in Manchester above her parents' takeaway, speaking Cantonese at home. She was quiet and well behaved. Her mother sat with her for two to three hours of homework every evening: “The kitchen table rule. Nothing else happened until it was done.” At secondary school she did well in English, poorly in maths, and had detentions for missing homework. At university she lived on all-nighters and extensions and graduated with a 2:1.</p>" +
            "<h4>Work and compensation</h4>" +
            "<p>Twenty-two years in teaching, five as head of year. She arrives at 6.30 am “to catch up before the noise starts”, keeps three colour-coded notebooks and about 30 phone alarms, and works every Sunday. A deputy quietly does her data entry. “I'm a swan: calm on top, paddling like mad underneath.” She works 60 to 65 hours a week; colleagues in the same role work about 50.</p>" +
            "<h4>What changed</h4>" +
            "<p>From 44: irregular, heavy periods, night sweats and waking three or four times a night. “About two years ago my systems stopped working. I'd write the list and then lose the list.” She has double-booked parents' evening appointments, left the hob on twice and nearly missed the safeguarding deadline. HRT has improved the sweats and her sleep. Her focus has improved “a little, not much”.</p>" +
            "<h4>Mental health and family</h4>" +
            "<p>Anxiety at 29 (after her first child) and at 41 (an inspection year), treated with sertraline: “It took the edge off the worry. The scattiness never changed.” No mood episodes, self-harm, psychosis or eating disorder. Rarely drinks, no drugs. Daughter diagnosed with ADHD last year; her younger brother “never finished anything”.</p>",
          q: {
            q: "Which finding argues most strongly that perimenopause is not the whole explanation?",
            options: [
              "Inattentive difficulties are described from primary school onwards and were held together by heavy compensation long before her periods changed",
              "HRT improved her night sweats",
              "Her ASRS Part A is positive",
              "She feels overwhelmed at work"
            ],
            a: 0,
            why: "Perimenopause can disturb sleep, mood and concentration, and many women report that long-standing ADHD symptoms become harder to manage at this time (clinical practice; the research base is still small). It cannot create a childhood history. A lifelong trait-like pattern, contained by scaffolding and effort and decompensating when sleep and demands change, fits ADHD unmasked by perimenopause. A new problem at 44 with no earlier history would point to perimenopause, mood, thyroid or iron instead."
          }
        },
        {
          title: "Adult symptoms at interview",
          html:
            "<p>Mei was asked about the last six months and, for comparison, about the ten years before perimenopause. For every symptom the clinician asked what strategies she uses, what they cost and what happens when they fail.</p>" +
            "<h4>Inattention: 7 of 9 present</h4>" +
            "<ul><li><strong>Sustaining attention:</strong> drifts in meetings and while reading reports; often has 15 browser tabs open.</li>" +
            "<li><strong>Follow-through:</strong> starts the marking pile, switches to email, finishes it at midnight.</li>" +
            "<li><strong>Organising:</strong> needs an elaborate system to function; when the system slips, everything slips.</li>" +
            "<li><strong>Avoids effortful tasks:</strong> data reports and appraisal paperwork are left until the night before.</li>" +
            "<li><strong>Loses things:</strong> keys, glasses, lanyard and the lists themselves, several times a week.</li>" +
            "<li><strong>Distractible:</strong> “If someone walks past my door, the thought I was having is gone.”</li>" +
            "<li><strong>Forgetful:</strong> double bookings, the hob, her own dental check-ups.</li></ul>" +
            "<p>Not counted: <em>careless mistakes</em> (few errors reach anyone because she checks everything three times; scored unsure and recorded as heavily compensated) and <em>seems not to listen</em> (absent).</p>" +
            "<h4>Hyperactivity-impulsivity: 2 of 9 present</h4>" +
            "<ul><li><strong>Fidgeting:</strong> picks at her cuticles until they bleed and jiggles her foot under the desk.</li><li><strong>Inner restlessness:</strong> cannot watch a film or sit through a long meeting without doing something else with her hands or phone.</li></ul><p>No outward overactivity, excessive talking, blurting, interrupting or difficulty waiting.</p>" +
            "<h4>Partner</h4>" +
            "<p>Chris: “The whole house runs on her lists. When a list fails, everything fails. She's been exhausted for twenty years, not two.”</p>",
          q: {
            q: "Which interviewing approach is most likely to bring out masked inattentive symptoms?",
            options: [
              "Closed yes or no questions about each DSM symptom, to keep the interview short",
              "Relying on what you observe in the clinic, where she is calm and organised",
              "Asking which strategies she uses, what they cost in time and effort, and what happens when they fail",
              "Using the ASRS Part B answers instead of interview questions"
            ],
            a: 2,
            why: "The UKAP consensus on females with ADHD recommends examining masking and compensatory strategies. Compensation hides symptoms from a checklist and from observation. Asking about the cost of the strategies (60-hour weeks, a colleague doing her data entry, 30 alarms) and what happens when they fail shows both the symptom and the impairment. UKAAN AQAS requires open questions and real-life examples, not tick boxes."
          }
        },
        {
          title: "Childhood and collateral",
          html:
            "<h4>School reports (kept by her mother)</h4>" +
            "<ul><li>Year 3: “Mei is a polite, quiet girl who often seems to be in a world of her own. Her written work becomes careless when she rushes.”</li>" +
            "<li>Year 5: “Mei is capable of much more. She must learn to take in instructions the first time.”</li>" +
            "<li>Year 8: “Homework is often late or missing. Mei is bright but disorganised.”</li></ul>" +
            "<h4>Mother (74), with a professional Cantonese interpreter</h4>" +
            "<p>Her mother described a dreamy child who lost something most weeks, forgot what she had been asked to do, and took far longer than her classmates to finish homework. “We thought she was lazy, so we made her study longer.” She checked Mei's school bag every night until Mei was 14. She fiddled with her hair and sleeves, but was never overactive: “Her brother was the naughty one. Mei was just slow to finish.”</p>" +
            "<p>Childhood count from Mei, her mother and the reports: <strong>6 of 9 inattentive</strong> (sustaining attention, seems not to listen, follow-through, organising, losing things, forgetfulness) and <strong>1 of 9 hyperactive-impulsive</strong> (fidgeting). Collateral ratings: mother 2 (clear support), partner 2 (clear support for adult symptoms).</p>" +
            "<p>Cultural context matters here. In her family, inattention was framed as a moral failing (“lazy”) and answered with more structure. That structure was itself a compensation, and the effort it took is evidence of impairment being contained.</p>",
          q: {
            q: "Mei offers to interpret for her mother to save time. What is best?",
            options: [
              "Accept: Mei knows her own childhood best",
              "Use a professional interpreter and ask her mother for concrete everyday examples rather than labels",
              "Skip the mother's account and rely on the WURS-25",
              "Send her mother an English rating scale to complete at home"
            ],
            a: 1,
            why: "A family member interpreting filters the informant's account through the patient, which defeats the point of collateral and risks omissions about sensitive topics. Use a professional interpreter. Ask for specific behaviours (what happened at homework time, what got lost) rather than labels such as 'lazy' or 'hyperactive', which carry different meanings across cultures. ICD-11 asks clinicians to judge symptoms against cultural norms."
          }
        },
        {
          title: "Differentials and investigations",
          html:
            "<table><thead><tr><th>Condition</th><th>Evidence</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>Perimenopause</td><td>Vasomotor symptoms and broken sleep from 44; partly helped by HRT. Does not account for the childhood and adult history</td><td>Aggravating factor</td></tr>" +
            "<tr><td>Iron deficiency anaemia</td><td>Hb 118 g/L, ferritin 9 micrograms/L, heavy periods. After 3 months of oral iron: Hb 131 g/L, ferritin 48 micrograms/L, tiredness better, attention and organisation unchanged</td><td>Co-occurring, treated; not the explanation</td></tr>" +
            "<tr><td>Thyroid disease</td><td>TSH and free T4 normal. NICE NG145 1.2.5 warns that thyroid symptoms can be mistaken for menopause, so testing was right</td><td>Absent</td></tr>" +
            "<tr><td>Depression</td><td>PHQ-9 9; low mood is about failing at work; no two-week episode; enjoyment intact</td><td>Absent; monitor</td></tr>" +
            "<tr><td>Generalised anxiety</td><td>GAD-7 11. Worry centres on forgetting things and being found out, and eases when her systems work. Sertraline helped worry but not inattention</td><td>Uncertain: anxiety symptoms partly secondary; review after ADHD treatment</td></tr>" +
            "<tr><td>Mild cognitive impairment</td><td>No progressive decline, word-finding or navigation problems; problems fluctuate with load. MoCA 29/30</td><td>Absent</td></tr>" +
            "<tr><td>Insomnia</td><td>Lifelong sleep-onset delay with a busy mind, plus night sweats (improved)</td><td>Co-occurring</td></tr>" +
            "<tr><td>Autism, bipolar disorder, substances, medicines</td><td>AQ-10 3; no episodes; minimal alcohol; no current medicines that affect attention</td><td>Absent</td></tr>" +
            "</tbody></table>",
          q: {
            q: "When the low ferritin came back, what should have happened to the ADHD assessment?",
            options: [
              "Discharge her: anaemia explains everything",
              "Ignore it: iron has nothing to do with attention",
              "Diagnose ADHD immediately and leave the anaemia to the GP",
              "Treat the iron deficiency, keep gathering the developmental evidence, and confirm ADHD only if the lifelong symptoms persist once she is iron replete"
            ],
            a: 3,
            why: "CADDRA and AADPA list anaemia as a medical mimic or aggravator, and in a trial in women aged 18 to 35, iron deficiency was linked to poorer cognitive performance that improved as ferritin rose (Murray-Kolb and Beard 2007). Correct it and reassess. The childhood evidence can be gathered in parallel. Here tiredness improved but the core inattentive pattern did not, which supports ADHD with co-occurring, now corrected, iron deficiency."
          }
        },
        {
          title: "Conclusion and feedback",
          html:
            "<h4>Criteria review</h4>" +
            "<ul><li><strong>A:</strong> 7 inattentive symptoms in the last six months; 2 hyperactive-impulsive.</li>" +
            "<li><strong>B:</strong> several inattentive symptoms before 12 (school reports from Year 3, her mother's account).</li>" +
            "<li><strong>C:</strong> work, home and social life (late for friends, forgets birthdays).</li>" +
            "<li><strong>D:</strong> at least moderate impairment at work and at home, kept from showing only by 60-hour weeks, a colleague's help and her partner's support; self-image badly affected.</li>" +
            "<li><strong>E:</strong> not better explained by perimenopause, iron deficiency, anxiety or mood disorder.</li></ul>" +
            "<p>Presentation: predominantly inattentive. Severity: moderate.</p>" +
            "<h4>Feedback</h4>" +
            "<ul><li>Name the decades of masking and the cost of it. Mei cried with relief and then asked, “Why did nobody see it?” (NICE NG87 1.2.2: girls and women are less often referred and more often given another diagnosis.)</li>" +
            "<li>Continue HRT and menopause care with her GP (NICE NG23).</li>" +
            "<li>Workplace adjustments: protected admin time, written meeting actions, help with data tasks.</li>" +
            "<li>Treatment options discussed; review anxiety once ADHD treatment is under way.</li></ul>",
          q: {
            q: "Which formulation fits the evidence best?",
            options: [
              "Lifelong ADHD, predominantly inattentive, compensated until perimenopause; perimenopause aggravating; iron deficiency co-occurring and corrected",
              "Perimenopausal 'brain fog' alone; no further action",
              "Generalised anxiety disorder causing secondary inattention",
              "Late-onset ADHD that began at 44"
            ],
            a: 0,
            why: "The childhood reports, her mother's account and the partner's 'twenty years, not two' establish a trait-like pattern from childhood. Perimenopause explains the timing of the breakdown, not the pattern. Correcting iron deficiency did not change the core symptoms, and the anxiety centres on the consequences of inattention. 'Late-onset ADHD' would be wrong: what was late was the loss of compensation, not the onset."
          }
        }
      ],
      profile: { adultIA: 7, adultHI: 2, childIA: 6, childHI: 1, impairment: "Moderate at work and in daily life and household management, hidden by 60 to 65-hour weeks and other people's help; moderate effect on self-image; mild in relationships and social life." },
      answer: {
        conclusion: "ADHD, predominantly inattentive presentation, moderate. Inattentive symptoms are documented from primary school and were compensated by family structure, effort and elaborate systems until perimenopause disrupted sleep and coping. Iron deficiency anaemia co-occurred and was corrected without change in the core symptoms. Anxiety symptoms are partly secondary and will be reviewed.",
        codes: "DSM-5-TR: ADHD, predominantly inattentive presentation, moderate (ICD-10-CM F90.0). ICD-11: 6A05.0.",
        ddx: [
          "Perimenopause: aggravating factor that explains the timing of decompensation, not the lifelong pattern.",
          "Iron deficiency anaemia: co-occurring; corrected, with no change in core inattention.",
          "Thyroid disease: excluded by normal TSH and free T4 (NICE NG145 1.2.5).",
          "Generalised anxiety: uncertain; worry centres on the consequences of inattention; review after ADHD treatment.",
          "Depression: absent (mild reactive low mood).",
          "Mild cognitive impairment: absent (no progressive decline, MoCA 29/30)."
        ],
        teaching: [
          "ADHD is under-recognised in girls and women, who are more likely to be referred late or given another diagnosis first (NICE NG87 1.2.2).",
          "Ask about compensation: what the strategies are, what they cost and what happens when they fail. Effort and achievement can hide impairment.",
          "Perimenopause can unmask long-standing ADHD; it does not create a childhood history. A truly new midlife problem points elsewhere.",
          "Check and correct treatable mimics such as iron deficiency and thyroid disease, then reassess the core symptoms.",
          "Intermediate WURS-25 scores are common in quiet, inattentive presentations; contemporaneous school reports and a childhood informant carry more weight than cut-offs.",
          "Use a professional interpreter for informants, and ask for concrete examples rather than culturally loaded labels.",
          "Do not diagnose an anxiety disorder from overlapping items alone; explore what the worry is about and whether it follows the inattention."
        ]
      }
    },

    /* ================================================================== */
    /* c3 Bipolar II disorder mimicking ADHD                                */
    /* ================================================================== */
    {
      id: "c3",
      title: "Bipolar II disorder mimicking ADHD",
      patient: "31-year-old freelance illustrator (they/them), referred by their GP at their request",
      tags: ["bipolar", "episodic course", "MDQ", "life chart", "self-referral", "not ADHD"],
      difficulty: 2,
      referral: "GP letter: Alex is 31 and works freelance as an illustrator. They request an ADHD assessment after recognising themselves in social media videos. They describe lifelong distractibility, racing thoughts, impulsive spending and 'mood swings that I think are ADHD emotional dysregulation'. Depression was treated at 22 (sertraline, stopped because of 'agitation') and at 29 (talking therapy). ASRS Part A 5 of 6 shaded. No known psychosis. Not on any medicines. Alex would like a trial of ADHD medication.",
      stages: [
        {
          title: "Pre-assessment questionnaires",
          html:
            "<table><thead><tr><th>Tool</th><th>Result</th><th>How to read it</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1 Part A</td><td>5 of 6 shaded</td><td>Positive screen.</td></tr>" +
            "<tr><td>ASRS v1.1 Part B</td><td>8 of 12 shaded. Dichotomous profile: inattention 7/9, hyperactivity-impulsivity 6/9</td><td>High current symptom burden.</td></tr>" +
            "<tr><td>MDQ</td><td>10 of 13 items yes; several in the same period: yes; problem: serious</td><td>Positive (7 or more, plus co-occurrence, plus moderate or serious problems).</td></tr>" +
            "<tr><td>WURS-25</td><td>22 out of 100</td><td>Below both cut-offs (36 and 46).</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Impaired: life skills (money rated 3), work. Not impaired: family, social, self-concept, risk</td><td>Impairment concentrated in money and work.</td></tr>" +
            "<tr><td>PHQ-9</td><td>3; item 9 = 0</td><td>Minimal at the appointment.</td></tr>" +
            "<tr><td>GAD-7</td><td>6</td><td>Mild range.</td></tr>" +
            "<tr><td>AUDIT / DAST-10</td><td>6 / 1</td><td>Low risk.</td></tr>" +
            "</tbody></table>" +
            "<p>At the start of the appointment the clinician asked about the week Alex filled in the forms. “That was a brilliant week. I was sleeping about four hours and getting loads done.”</p>",
          q: {
            q: "Both the ASRS and the MDQ are positive. What does this tell you?",
            options: [
              "That Alex has both ADHD and bipolar disorder",
              "Very little on its own: both screens share items such as distractibility, talkativeness and restlessness, so you need a structured history of episodes and of childhood",
              "That the MDQ result can be ignored, because about half of adults with ADHD screen positive on it",
              "That ADHD is confirmed and the MDQ shows its emotional side"
            ],
            a: 1,
            why: "In Lundervold 2020, 50.2% of adults with ADHD screened MDQ-positive, so a positive MDQ does not separate the two. The ASRS is equally non-specific in bipolar disorder, and its answers were given during a period of short sleep and high activity. NICE CG185 1.2.3 says not to use questionnaires in primary care to identify bipolar disorder. Neither result can be ignored either: both are prompts for a careful episode-by-episode history."
          }
        },
        {
          title: "History: building the life chart",
          html:
            "<table><thead><tr><th>Age</th><th>What happened</th></tr></thead><tbody>" +
            "<tr><td>0 to 11</td><td>Quiet, careful and artistic. No concerns from school or home.</td></tr>" +
            "<tr><td>12 to 18</td><td>Did well at secondary school; three good A levels.</td></tr>" +
            "<tr><td>19</td><td>First depressive episode in the first year of art college: four months of low mood, sleeping 12 hours, unable to work. Withdrew and restarted the next year.</td></tr>" +
            "<tr><td>22</td><td>Second depressive episode; sertraline started. In week 3: ten days of sleeping three to four hours without feeling tired, euphoric, started three online shops, spent £4,000 on equipment, talked so fast friends could not follow. Their partner: “It wasn't Alex.” The GP stopped sertraline for “agitation”.</td></tr>" +
            "<tr><td>23 to 31</td><td>Two or three “buzzy spells” a year, each lasting four to eight days, often in spring. Very productive, sociable, sometimes irritable, overspending. Never admitted to hospital; no psychotic symptoms.</td></tr>" +
            "<tr><td>25 and 29</td><td>Further depressive episodes of two to four months. In the second, passive thoughts that they would rather not wake up.</td></tr>" +
            "<tr><td>Between episodes</td><td>Working steadily, meeting commission deadlines, sleeping seven to eight hours.</td></tr>" +
            "</tbody></table>" +
            "<p>Family: their mother has bipolar I disorder and has been admitted twice; she is now well on lithium. Alcohol 6 to 10 units a week. Cannabis a few times a year, not linked to the spells. No head injury or seizures.</p>",
          q: {
            q: "Which single feature most strongly favours bipolar disorder over ADHD?",
            options: [
              "Impulsive spending",
              "Feeling distractible",
              "Irritability",
              "Spells of several days with much less sleep and no tiredness, with a clear change from their usual self that others notice"
            ],
            a: 3,
            why: "Spending, distractibility and irritability are common to both. Decreased need for sleep without tiredness, elation, grandiosity and an episodic course are the features that favour bipolar disorder; in ADHD the usual sleep problem is sleep-onset delay from a busy mind, followed by tiredness (CADDRA). ICD-11 adds that late onset, episodicity and intensity of mood elevation point to bipolar disorder rather than ADHD."
          }
        },
        {
          title: "ADHD symptoms in and out of episodes",
          html:
            "<p>The clinician reviewed all 18 symptoms twice: for Alex's usual self between episodes, and for the buzzy spells. Sam, their partner of five years, joined for this part.</p>" +
            "<table><thead><tr><th>Domain</th><th>Between episodes</th><th>During buzzy spells</th></tr></thead><tbody>" +
            "<tr><td>Inattention</td><td>2 of 9: misplaces phone and keys most days; distracted by notifications while drawing</td><td>7 of 9: cannot stay with one task, starts projects and abandons them, misses emails, loses things</td></tr>" +
            "<tr><td>Hyperactivity-impulsivity</td><td>1 of 9: spins a pen while thinking</td><td>6 of 9: cannot sit still, talks fast and over others, cannot wait, acts on impulse</td></tr>" +
            "<tr><td>Sleep</td><td>7 to 8 hours, settles easily</td><td>3 to 4 hours, not tired</td></tr>" +
            "<tr><td>Mood</td><td>Steady, reactive</td><td>“On top of the world”, sometimes irritable</td></tr>" +
            "</tbody></table>" +
            "<p>Sam: “Between the spells Alex is the organised one. I'm the one who loses things. When the spells come you can tell from the spending and the 3 am emails, and a couple of months later they can't get out of bed.”</p>",
          q: {
            q: "How should the symptoms seen only during the buzzy spells be counted towards ADHD?",
            options: [
              "Not at all: count only symptoms present outside mood episodes, because symptoms confined to episodes are better explained by the mood disorder",
              "Fully: DSM-5-TR asks about the last six months and the spells fall within it",
              "Half: average the two columns",
              "Fully, but only if the MDQ is negative"
            ],
            a: 0,
            why: "ADHD symptoms are trait-like: UKAAN AQAS says they should not be episodic or a change from a previous baseline. DSM-5-TR criterion E excludes symptoms better explained by another mental disorder, and ICD-11 says episodicity points to bipolar disorder. Between episodes Alex has 2 inattentive and 1 hyperactive-impulsive symptoms, far below the adult threshold of 5."
          }
        },
        {
          title: "Childhood, collateral and records",
          html:
            "<ul><li><strong>School reports:</strong> Year 4: “Alex works carefully and neatly and is a pleasure to teach.” Year 6: “Alex is quiet and focused; art is a real strength.”</li>" +
            "<li><strong>Mother</strong> (well, on lithium): “Alex was the calm one. I was the chaotic one.” She recalled one area of difficulty, daydreaming in maths lessons. Childhood count: 1 inattentive, 0 hyperactive-impulsive. Collateral rating for ADHD: 0 (none or little support).</li>" +
            "<li><strong>Partner:</strong> clear descriptions of discrete episodes; no ADHD pattern between them. Collateral rating for ADHD: 0.</li>" +
            "<li><strong>GP record, age 22:</strong> “Agitated, not sleeping, overspending. Sertraline stopped.”</li></ul>",
          q: {
            q: "What is the significance of the GP note at age 22?",
            options: [
              "None: agitation is a common side effect and needs no further thought",
              "It shows that Alex cannot tolerate any psychiatric medicine",
              "It may record an antidepressant-associated hypomanic episode, which is a strong pointer to bipolarity and should be explored in detail",
              "It shows the ADHD got worse on sertraline"
            ],
            a: 2,
            why: "Reduced need for sleep, overspending and euphoria within weeks of starting an antidepressant are a classic warning sign of bipolar spectrum disorder (clinical practice). DSM-5-TR counts a full hypomanic episode that emerges on an antidepressant and persists beyond its physiological effect as a true episode; agitation or edginess alone is not enough. Records like this are often coded vaguely as 'agitation'. Ask what actually happened, how long it lasted and how others saw it, and record it on the life chart."
          }
        },
        {
          title: "Differentials and risk",
          html:
            "<table><thead><tr><th>Condition</th><th>Evidence</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>Bipolar II disorder</td><td>Repeated hypomanic episodes of four or more days (reduced need for sleep, elevated mood, pressured speech, racing thoughts, spending, change noticed by others) and major depressive episodes since 19; antidepressant-associated switch; mother with bipolar I</td><td>Better explains the picture</td></tr>" +
            "<tr><td>Cyclothymia</td><td>Full hypomanic and major depressive episodes are present, so the bipolar II diagnosis takes precedence</td><td>Not the best fit</td></tr>" +
            "<tr><td>Borderline personality disorder</td><td>Mood shifts last days to weeks, not hours; no abandonment fears, identity disturbance or self-harm</td><td>Absent</td></tr>" +
            "<tr><td>ADHD</td><td>2 inattentive and 1 hyperactive-impulsive symptoms between episodes; no childhood onset; informants give no support</td><td>Not met</td></tr>" +
            "<tr><td>Thyroid disease</td><td>TSH normal (checked because hyperthyroidism can mimic hypomania)</td><td>Absent</td></tr>" +
            "<tr><td>Substances</td><td>Modest alcohol; occasional cannabis not linked to episodes</td><td>Absent</td></tr>" +
            "</tbody></table>" +
            "<h4>Risk</h4>" +
            "<p>Passive thoughts of death during the last depressive episode; none now, and no history of self-harm. Financial risk during hypomania. A safety plan was agreed covering early warning signs of both poles.</p>",
          q: {
            q: "Alex asks for a stimulant 'just to see if it helps'. What is the best response?",
            options: [
              "Agree: a good response would confirm ADHD",
              "Explain that response to a stimulant is not a diagnostic test, that stimulants without a mood stabiliser can raise the risk of switching into mania or hypomania, and that the priority is treating the bipolar disorder",
              "Agree, but only at a low dose",
              "Decline, and tell Alex that people with bipolar disorder can never take ADHD medication"
            ],
            a: 1,
            why: "Stimulants improve some cognitive measures in people without ADHD, so a response proves nothing. The European Consensus (Kooij 2019) reports Swedish register data in which methylphenidate monotherapy in bipolar disorder increased the risk of manic switch (hazard ratio 6.7), while in people also taking a mood stabiliser the hazard ratio was 0.6. Bipolar disorder is stabilised first. 'Never' is also wrong: when ADHD genuinely co-occurs, it can be treated once mood is stable."
          }
        },
        {
          title: "Conclusion and feedback",
          html:
            "<p>The clinician drew the life chart with Alex during feedback. Seeing the spells and the depressions laid out by year, Alex said: “So the ‘ADHD days’ are the buzzy weeks.”</p>" +
            "<ul><li><strong>ADHD:</strong> not diagnosed. Criterion B is not met (no symptoms of note before 12), the between-episode count is far below threshold, and the episodic symptoms are better explained by bipolar disorder (criterion E).</li>" +
            "<li><strong>Bipolar II disorder</strong>, current or most recent episode hypomanic (the week the forms were filled in); euthymic at assessment. Because fewer than two months have passed since that episode, DSM-5-TR would record it as in partial remission.</li>" +
            "<li><strong>Plan:</strong> referral to the community mental health team for confirmation and treatment in line with NICE CG185, including psychoeducation and mood monitoring; a daily mood and sleep diary; letter to the GP explaining the possible antidepressant-associated hypomania.</li>" +
            "<li><strong>Information:</strong> NICE NG87 1.4.4 says people who fall short of an ADHD diagnosis may still benefit from information. Alex was given self-help strategies for organisation and a route back if attention problems persist through a long period of stable mood.</li></ul>",
          q: {
            q: "What should the report record for ADHD?",
            options: [
              "ADHD, combined presentation, co-occurring with bipolar II disorder",
              "Other specified ADHD",
              "Diagnosis deferred until a stimulant trial has been completed",
              "ADHD not diagnosed: no childhood onset, few symptoms between episodes, and the episodic symptoms are better explained by bipolar II disorder"
            ],
            a: 3,
            why: "UKAAN AQAS asks the report to state whether criteria are met and, if not, whether the picture is subthreshold ADHD or secondary to another condition. Here it is clearly the second. 'Other specified ADHD' would imply impairing ADHD symptoms that fall short of full criteria, which is not the case. Deferring for a stimulant trial would be unsafe and uninformative."
          }
        }
      ],
      profile: { adultIA: 2, adultHI: 1, childIA: 1, childHI: 0, impairment: "Severe during mood episodes (dropped out of college, debt from hypomanic spending, months unable to work when depressed). Minimal impairment from attention between episodes." },
      answer: {
        conclusion: "ADHD not diagnosed. The attention, restlessness and impulsivity Alex describes occur in discrete hypomanic episodes with reduced need for sleep, against a background of recurrent depressive episodes since 19, an antidepressant-associated switch and a family history of bipolar I disorder. Between episodes there are few ADHD symptoms and there was no childhood onset. Bipolar II disorder better explains the picture; the most recent episode was the hypomanic week in which the forms were completed.",
        codes: "DSM-5-TR: bipolar II disorder, current or most recent episode hypomanic, in partial remission (ICD-10-CM F31.81). ICD-11: 6A61.A bipolar type II disorder, currently in full remission (no significant mood symptoms at assessment). ADHD not diagnosed.",
        ddx: [
          "Bipolar II disorder: better explains the symptoms (episodic course, reduced need for sleep, onset at 19, family history, antidepressant-associated switch).",
          "ADHD: not met (2 inattentive and 1 hyperactive-impulsive symptoms between episodes; no childhood onset).",
          "Cyclothymia: not the best fit, because full hypomanic and major depressive episodes have occurred.",
          "Borderline personality disorder: absent (mood shifts last days, not hours; no abandonment fears or self-harm).",
          "Hyperthyroidism and substance-induced mood symptoms: excluded."
        ],
        teaching: [
          "Positive ASRS and MDQ screens are common in both ADHD and bipolar disorder; about half of adults with ADHD screen MDQ-positive (Lundervold 2020).",
          "Ask what state the person was in when they completed the forms; short sleep and high activity inflate current-symptom scales.",
          "Build a life chart. Trait-like symptoms present since childhood point to ADHD; symptoms that come and go with mood episodes point to the mood disorder.",
          "Rate ADHD symptoms in periods of stable mood. Symptoms confined to episodes do not count (DSM-5-TR criterion E; ICD-11 boundary guidance).",
          "Decreased need for sleep without tiredness is the key discriminating question; ADHD sleep problems are usually sleep-onset delay with next-day tiredness.",
          "Look for antidepressant-associated hypomania in old records, often coded as 'agitation'.",
          "Response to a stimulant is not a diagnostic test, and stimulant monotherapy in bipolar disorder raises the risk of manic switch (Kooij 2019)."
        ]
      }
    },

    /* ================================================================== */
    /* c4 Autism, not ADHD                                                  */
    /* ================================================================== */
    {
      id: "c4",
      title: "Autism, not ADHD: attention problems from social and sensory load",
      patient: "20-year-old maths undergraduate (he/him), Ghanaian-British, referred through university support and his GP",
      tags: ["autism", "double counting", "AQ-10", "RAADS-14", "student", "not ADHD"],
      difficulty: 3,
      referral: "GP letter, with a note from the university mental health adviser: Kwame is 20 and in the second year of a maths degree. He is failing to submit group projects, 'zones out' in seminars, cannot work in the library and has become very anxious. His personal tutor suggested ADHD. The disability service has asked for a diagnosis to support exam adjustments. He has first-class marks in pure maths modules. No previous mental health history. ASRS Part A positive. Please assess for ADHD.",
      stages: [
        {
          title: "Pre-assessment questionnaires",
          html:
            "<table><thead><tr><th>Tool</th><th>Result</th><th>How to read it</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1 Part A</td><td>4 of 6 shaded: items 1 and 2 (sometimes), items 4 and 5 (often). Appointments: rarely. Driven by a motor: rarely</td><td>Positive screen. Item 5 (fidgeting) was endorsed because he rocks when he concentrates.</td></tr>" +
            "<tr><td>ASRS v1.1 Part B</td><td>7 of 12 shaded. Dichotomous profile: inattention 6/9, hyperactivity-impulsivity 5/9</td><td>Probes only.</td></tr>" +
            "<tr><td>AQ-10</td><td>7</td><td>6 or more: NICE CG142 1.2.3 says offer a comprehensive autism assessment.</td></tr>" +
            "<tr><td>RAADS-14</td><td>29 (mentalizing 14/21, social anxiety 7/12, sensory reactivity 8/9)</td><td>Above the cut-off of 14 and close to the autism median of 32; the ADHD median is 15.</td></tr>" +
            "<tr><td>WURS-25</td><td>24 out of 100</td><td>Below both cut-offs.</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Impaired: school, social. Not impaired: family, life skills, self-concept, risk. Work: not applicable</td><td>Daily living skills are strong.</td></tr>" +
            "<tr><td>GAD-7 / PHQ-9</td><td>12 / 8; PHQ-9 item 9 = 0</td><td>Moderate anxiety, mild depressive symptoms.</td></tr>" +
            "<tr><td>AUDIT</td><td>0</td><td>Does not drink.</td></tr>" +
            "</tbody></table>",
          q: {
            q: "What is the most useful reading of these screens?",
            options: [
              "Both ADHD and autism screens are positive, but neither diagnoses anything; the RAADS-14 profile (high mentalizing and sensory scores) and strong daily organisation make autism the lead hypothesis to test alongside ADHD",
              "ADHD is likely, because the ASRS was positive first and the AQ-10 is unreliable in clinics",
              "Autism is confirmed, because the AQ-10 is 6 or more",
              "Both conditions should be diagnosed, because both screens are positive"
            ],
            a: 0,
            why: "Every screen here is non-specific. In a specialist referral sample the AQ-10 had sensitivity 0.77 but specificity only 0.29 (Ashwood 2016), and two of its items (multitasking and switching back after interruption) can be endorsed because of ADHD. Half of adults with ADHD score above the RAADS-14 cut-off (median 15), so the useful information is the high total near the autism median and the domain pattern. Rocking inflated ASRS item 5. Test both conditions at interview, using developmental history."
          }
        },
        {
          title: "History",
          html:
            "<h4>Early development (mother, Akosua)</h4>" +
            "<p>Spoke early and “like a little professor”. Lined up toy cars by colour and was upset if anyone moved them. Knew the London Underground map by heart at six. Covered his ears at birthday parties and screamed at hand dryers. Wore only soft cotton. Played alongside other children rather than with them; one close friend at primary school, who also loved numbers. The wider family saw him as “clever and shy”; his grandmother said he would grow out of it.</p>" +
            "<h4>School and university</h4>" +
            "<p>Excellent in maths; struggled with group work and open-ended essays; distressed by timetable changes. Top grades in maths and further maths. At university the shared kitchen and seminar discussions overwhelm him. He has stopped eating in the kitchen. In the library he cannot filter out conversations and the hum of the lights. In his room, with headphones on, he can work on number theory for ten hours.</p>" +
            "<h4>Daily life</h4>" +
            "<p>Same breakfast every day, timetable on the wall, budget spreadsheet, calendar alerts. He has never lost a key or missed an appointment. “If my routine is broken I can't do anything for the rest of the day.”</p>" +
            "<h4>Other history</h4>" +
            "<p>Anxiety since starting university, mainly before seminars. No low mood episodes, self-harm or substance use. Regular sleep. A hearing test at the GP's request was normal.</p>",
          q: {
            q: "Kwame can work for ten hours on number theory. What does this tell you?",
            options: [
              "It rules out ADHD, because people with ADHD cannot concentrate for long",
              "It proves autism, because only autistic people focus intensely",
              "It does not discriminate: intense focus on a preferred topic occurs in both, so look instead at what breaks his attention and how well he organises daily life",
              "It shows he is gifted, so no condition needs to be considered"
            ],
            a: 2,
            why: "Hyperfocus on rewarding tasks is common in ADHD, and intense, absorbing interests are common in autism. The discriminating features lie elsewhere: what disrupts attention (sensory load and social demands, rather than internal distractibility), whether daily life is chaotic or rigidly ordered, and early social-communication and sensory history. High ability does not explain the social and sensory pattern."
          }
        },
        {
          title: "Adult symptoms at interview: scoring without double counting",
          html:
            "<p>Each symptom was explored with examples, then the clinician asked: <em>is this better accounted for by social communication, sensory sensitivity or need for sameness?</em> The UKAP consensus on ADHD and autism asks assessors to take a parsimonious approach and not double count.</p>" +
            "<table><thead><tr><th>Symptom</th><th>What Kwame describes</th><th>Scored</th></tr></thead><tbody>" +
            "<tr><td>Sustaining attention</td><td>Loses track after about 30 minutes in lectures outside maths, even in quiet rooms</td><td>Present</td></tr>" +
            "<tr><td>Organising</td><td>Cannot plan open-ended group projects or essays without explicit structure</td><td>Present</td></tr>" +
            "<tr><td>Avoids effortful tasks</td><td>Puts off essays and group reports; never puts off proofs</td><td>Present</td></tr>" +
            "<tr><td>Seems not to listen</td><td>In seminars he does not realise a question is meant for him: “They said ‘any thoughts?’ They didn't say my name.”</td><td>Not counted: social communication</td></tr>" +
            "<tr><td>Distractible</td><td>Pulled away by background talk, the hum of lights, clothing labels; not by his own thoughts, and not in quiet places</td><td>Not counted: sensory over-responsivity</td></tr>" +
            "<tr><td>Follow-through</td><td>Finishes all solo work; group tasks stall because nobody has said who does what</td><td>Not counted</td></tr>" +
            "<tr><td>Careless mistakes, losing things, forgetfulness</td><td>Meticulous; never loses things; never forgets appointments</td><td>Absent</td></tr>" +
            "<tr><td>Fidgeting</td><td>Rocks when thinking; flaps his hands when excited, mostly in private</td><td>Not counted: repetitive movements, not restlessness</td></tr>" +
            "<tr><td>Leaving seat</td><td>Leaves the lecture hall when the noise becomes painful</td><td>Not counted: sensory escape</td></tr>" +
            "<tr><td>Talks excessively; interrupts</td><td>Talks at length about maths without noticing others have lost interest; talks over others because he cannot tell when a turn has ended</td><td>Not counted: social reciprocity</td></tr>" +
            "<tr><td>Restlessness, quiet leisure, being on the go, waiting, blurting</td><td>“I like being still.” Spends evenings quietly on maths puzzles. Likes queues because there are rules</td><td>Absent</td></tr>" +
            "</tbody></table>" +
            "<p>Adult count: <strong>3 of 9 inattentive, 0 of 9 hyperactive-impulsive</strong>.</p>",
          q: {
            q: "How should you score 'seems not to listen when spoken to directly'?",
            options: [
              "Present, because he agrees that he often misses what is said in seminars",
              "Present, because his tutor raised it",
              "Unsure, and count it anyway to be safe",
              "Not counted: he misses questions because he does not recognise they are meant for him, which is better accounted for by social-communication difference"
            ],
            a: 3,
            why: "A symptom counts towards ADHD only if ADHD is the best explanation for it. Kwame hears and follows speech addressed to him by name; what he misses is the implied social cue. The UKAP consensus on co-occurring ADHD and autism warns against double counting the same behaviour for both conditions. Counting 'to be safe' inflates the ADHD count and leads to misdiagnosis."
          }
        },
        {
          title: "Childhood and collateral",
          html:
            "<h4>School reports</h4>" +
            "<ul><li>Year 2: “Kwame is a very able mathematician. He prefers to work alone and becomes upset if plans change.”</li>" +
            "<li>Year 5: “Kwame sometimes needs reminding that instructions given to the whole class apply to him. Group work is difficult for him.”</li>" +
            "<li>Year 9: “Excellent progress in maths. Kwame would benefit from contributing more in discussions.”</li></ul>" +
            "<h4>Mother</h4>" +
            "<p>“He went into his own world when the classroom was noisy. At home he could do sums for hours. He never lost anything. He was upset if anything was moved.” She described no overactivity, impulsivity or chaotic disorganisation at any age.</p>" +
            "<p>Childhood count: <strong>2 of 9 inattentive</strong> (sustaining attention in non-preferred lessons, avoiding written stories), <strong>0 of 9 hyperactive-impulsive</strong>. Collateral rating for ADHD: 0. Her account strongly supports early social-communication differences, restricted interests, insistence on sameness and sensory sensitivity.</p>",
          q: {
            q: "How should you weigh the Year 5 comment that he needed reminding that whole-class instructions applied to him?",
            options: [
              "As clear evidence of childhood inattention",
              "As more consistent with not picking up that group instructions included him, which fits the wider pattern of social-communication difference in the reports",
              "As irrelevant, because school reports are unreliable",
              "As evidence of a hearing problem"
            ],
            a: 1,
            why: "Read each school comment in the context of the whole pattern. Alongside 'prefers to work alone', 'upset if plans change' and 'contributing more in discussions', this comment fits autism better than ADHD. Hearing was tested and normal. School reports are valuable contemporaneous evidence; they need interpreting, not discarding."
          }
        },
        {
          title: "Differentials and validity",
          html:
            "<table><thead><tr><th>Condition</th><th>Evidence</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>Autism</td><td>Early social-communication differences, restricted interests, insistence on sameness and sensory over-responsivity from early childhood; current impairment in study and social life; AQ-10 7; RAADS-14 29</td><td>Strongly suspected: refer for comprehensive autism assessment</td></tr>" +
            "<tr><td>ADHD</td><td>3 inattentive and 0 hyperactive-impulsive symptoms now, 2 and 0 in childhood after careful scoring; inattention confined to sensory, social or unstructured situations</td><td>Not met</td></tr>" +
            "<tr><td>Social anxiety</td><td>Dreads seminars, but: “I don't mind what they think. I don't know when to speak, and the noise hurts.”</td><td>Anxiety mainly secondary to autism-related demands; review</td></tr>" +
            "<tr><td>Depression</td><td>PHQ-9 8; no episode</td><td>Absent</td></tr>" +
            "<tr><td>Hearing problems; specific learning disorder</td><td>Normal hearing test; written work clear when the task is well defined</td><td>Absent</td></tr>" +
            "<tr><td>High ability</td><td>Explains his maths results, not the social and sensory pattern</td><td>Strength, not an explanation</td></tr>" +
            "</tbody></table>" +
            "<h4>Validity</h4>" +
            "<p>A diagnosis would unlock exam adjustments, so an incentive exists. But his answers were precise and consistent with school reports and his mother's account. He readily described strengths and areas without difficulty, and asked the clinician to define 'often'.</p>",
          q: {
            q: "The disability service wants a diagnosis to support exam adjustments. How should this affect your assessment?",
            options: [
              "Diagnose ADHD so that adjustments can start quickly",
              "Treat everything he says as exaggerated",
              "Refuse to write to the university until the autism assessment is complete",
              "Note it as an incentive, check consistency across sources, and recommend needs-led adjustments now, whatever the final diagnosis"
            ],
            a: 3,
            why: "Incentives are common and should be recorded and weighed (UKAAN AQAS asks for consistency checks against independent sources), but an incentive alone does not make a report invalid. Here the sources agree. Adjustments can be based on his needs rather than on a label, so there is no reason to give a diagnosis the evidence does not support. Making a wrong diagnosis to help him would harm him later."
          }
        },
        {
          title: "Conclusion and next steps",
          html:
            "<ul><li><strong>ADHD:</strong> not diagnosed. After scoring without double counting, 3 inattentive and no hyperactive-impulsive symptoms remain. The difficulties are confined to sensory, social and unstructured situations.</li>" +
            "<li><strong>Autism:</strong> strongly suspected. Referred for comprehensive autism assessment in line with NICE CG142 1.2.3, with consent to share his mother's developmental account.</li>" +
            "<li><strong>University letter (with consent):</strong> quiet exam room, written instructions and advance notice of changes, defined roles in group work, permission to use noise-cancelling headphones, and the option to contribute to seminars in writing.</li>" +
            "<li><strong>Information:</strong> given under NICE NG87 1.4.4. Both conditions can co-occur, and NICE NG87 1.3.3 says not to exclude ADHD because of autism. Kwame was told he could be reassessed if difficulties emerge that autism does not explain.</li></ul>" +
            "<p><strong>Five months later:</strong> the adult autism service diagnosed autism after a developmental interview with his mother and a structured observation. With adjustments in place, he submitted every group project that term.</p>",
          q: {
            q: "What is the best next step at the end of this assessment?",
            options: [
              "Explain that ADHD criteria are not met, refer for a comprehensive autism assessment, and set out needs-led adjustments now",
              "Diagnose ADHD, predominantly inattentive, because the ASRS was positive",
              "Diagnose autism on the strength of the AQ-10 and RAADS-14",
              "Discharge with no further action, because ADHD is not present"
            ],
            a: 0,
            why: "Screens cannot diagnose autism. NICE CG142 1.2.3 says that a score of 6 or more on the AQ-10, or clinical suspicion, should lead to an offer of comprehensive assessment. Discharging without acting on clear autistic features would leave his needs unmet. Diagnosing ADHD would ignore the evidence from careful scoring."
          }
        }
      ],
      profile: { adultIA: 3, adultHI: 0, childIA: 2, childHI: 0, impairment: "Moderate impairment in study (group projects not submitted) and social life, driven by social-communication and sensory demands rather than by inattention. Daily living skills are strong." },
      answer: {
        conclusion: "ADHD not diagnosed. Attention problems are confined to noisy, social and unstructured situations and are better accounted for by autistic social-communication differences, sensory over-responsivity and need for sameness, present since early childhood. Autism was diagnosed by the adult autism service after comprehensive assessment.",
        codes: "ADHD not diagnosed. Autism (diagnosed by the autism service): DSM-5-TR autism spectrum disorder without accompanying intellectual or language impairment; requiring support (level 1) for social communication and for restricted, repetitive behaviours (ICD-10-CM F84.0). ICD-11: 6A02.0.",
        ddx: [
          "Autism: better explains the attention difficulties; confirmed after comprehensive assessment.",
          "ADHD: not met (3 inattentive and 0 hyperactive-impulsive symptoms after scoring without double counting).",
          "Social anxiety disorder: anxiety mainly secondary to autism-related demands; to be reviewed.",
          "Depression: absent.",
          "Hearing impairment and specific learning disorder: excluded.",
          "High ability: a strength that explains his maths results, not the social and sensory pattern."
        ],
        teaching: [
          "Autism and ADHD screens overlap: the AQ-10 has low specificity in clinic samples and half of adults with ADHD score above the RAADS-14 cut-off. Use domain profiles and history, not totals.",
          "Score each ADHD symptom only if ADHD is its best explanation. Do not double count behaviour explained by social communication, sensory sensitivity or need for sameness (UKAP consensus).",
          "Intense focus on interests does not discriminate. Ask what disrupts attention and whether daily life is chaotic or rigidly ordered.",
          "Rocking and hand-flapping are repetitive movements, not ADHD fidgeting; leaving a room to escape noise is not ADHD restlessness.",
          "Read school reports as a pattern: 'needs reminding that whole-class instructions apply to him' can reflect social communication rather than inattention.",
          "Record incentives such as exam adjustments, check consistency, and remember that adjustments can be needs-led.",
          "If autism is suspected, offer a comprehensive autism assessment (NICE CG142 1.2.3). Never exclude ADHD because of autism (NICE NG87 1.3.3); here it was absent on the evidence."
        ]
      }
    },

    /* ================================================================== */
    /* c5 ADHD with co-occurring depression                                 */
    /* ================================================================== */
    {
      id: "c5",
      title: "ADHD with co-occurring depression: diagnose both, then decide the order",
      patient: "38-year-old chartered accountant and parent of two (she/her), British Pakistani, referred by her GP",
      tags: ["combined", "depression", "comorbidity", "treatment order", "risk", "family history"],
      difficulty: 2,
      referral: "GP letter: Sana is 38, a chartered accountant, married with two children aged 10 and 7. This is her third depressive episode: about three months of low mood, early waking and loss of interest, after a promotion and her father's stroke. Episodes at 24 and 31 responded partly to sertraline and CBT. She says that even when her mood is fine she 'can't get organised' and has 'always been the scatty one'. Her 10-year-old son was diagnosed with ADHD last year. PHQ-9 17 in surgery. Sertraline 50 mg restarted four weeks ago. Please assess for ADHD.",
      stages: [
        {
          title: "Pre-assessment questionnaires",
          html:
            "<table><thead><tr><th>Tool</th><th>Result</th><th>How to read it</th></tr></thead><tbody>" +
            "<tr><td>PHQ-9</td><td>17; item 9 = 1 (several days)</td><td>Moderately severe range; 16 or more is 'more severe' in NICE NG222. Item 9 needs a clinician's enquiry today.</td></tr>" +
            "<tr><td>GAD-7</td><td>9</td><td>Mild range.</td></tr>" +
            "<tr><td>ASRS v1.1 Part A</td><td>5 of 6 shaded</td><td>Positive screen, but completed during a depressive episode.</td></tr>" +
            "<tr><td>ASRS v1.1 Part B</td><td>9 of 12 shaded. Dichotomous profile: inattention 8/9, hyperactivity-impulsivity 6/9</td><td>Probes only.</td></tr>" +
            "<tr><td>WURS-25</td><td>49 out of 100</td><td>Above the original cut-off of 46.</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Impaired: family, work, life skills, self-concept. Not impaired: social, risk</td><td>Self-concept and family scores are likely to be inflated by the depression.</td></tr>" +
            "<tr><td>MDQ</td><td>4 of 13 items</td><td>Negative. Important to know before any treatment decision.</td></tr>" +
            "<tr><td>AUDIT-C / DAST-10 / AQ-10</td><td>0 / 0 / 2</td><td>No concerns.</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Sana scores 1 on PHQ-9 item 9. What should happen first?",
            options: [
              "Carry on with the ADHD interview, because her total is below 20",
              "A clinician-led conversation about suicidal thoughts at the start of the appointment, using the C-SSRS screener questions as prompts, leading to a safety plan rather than a risk score",
              "Send her to the emergency department",
              "Use item 9 to classify her as low, medium or high risk and decide the follow-up from that"
            ],
            a: 1,
            why: "The PHQ manual says a positive item 9 needs a clinical interview to judge risk; item 9 also picks up passive death wishes, so many positives are not active ideation. NICE NG225 1.6.1 to 1.6.3 (the self-harm guideline) advise against using risk tools and scales, or global low, medium and high stratification, to predict suicide or to decide who gets treatment. Ask directly, explore, and agree a safety plan."
          }
        },
        {
          title: "Risk and the current episode",
          html:
            "<h4>Suicide enquiry (C-SSRS screener questions, past month)</h4>" +
            "<ul><li>Wished to be dead or not wake up: yes. “Some nights I think it would be easier not to wake up.”</li>" +
            "<li>Active thoughts of killing herself: no. Lifetime suicidal behaviour: none.</li>" +
            "<li>Protective factors: her children, her faith, a supportive husband, and wanting help.</li></ul>" +
            "<p>A written safety plan was agreed: warning signs, people to call, NHS 111 (mental health option) and Samaritans (116 123). The GP was informed the same day, with Sana's agreement.</p>" +
            "<h4>Features of the current episode</h4>" +
            "<p>For three months: low mood most of the day, loss of pleasure (she has stopped cooking, which she loves, and no longer enjoys her children's games), waking at 4 am, poor appetite with 3 kg weight loss, guilt (“I'm a bad mother”), slowed thinking, and concentration worse than her usual. No period in her life of reduced need for sleep, elation or grandiosity. Four weeks into sertraline 50 mg she feels “maybe slightly better”.</p>" +
            "<p>Clinical impression: a moderate depressive episode, recurrent.</p>"
        },
        {
          title: "Usual self versus the episode: adult ADHD symptoms",
          html:
            "<p>The clinician rated ADHD symptoms for Sana's usual self (the six well years between her last episode at 31 and this summer), with her husband, Imran. What is new in the episode was recorded separately and not counted twice.</p>" +
            "<h4>Inattention (usual self): 7 of 9 present</h4>" +
            "<ul><li>Careless mistakes: transposed figures in client accounts; one VAT return had to be resubmitted; a reviewer now checks her work.</li>" +
            "<li>Sustaining attention: drifts through long audit files; rereads pages.</li>" +
            "<li>Follow-through: home projects abandoned halfway; the children's photo albums stopped in 2019.</li>" +
            "<li>Organising: late for almost everything; school forms lost.</li>" +
            "<li>Losing things: keys, glasses, where she parked.</li>" +
            "<li>Distractible: one email turns into an hour of unrelated tasks.</li>" +
            "<li>Forgetful: school events, card payments, returning calls.</li></ul>" +
            "<h4>Hyperactivity-impulsivity (usual self): 5 of 9 present</h4>" +
            "<p>Fidgets constantly, feels restless inside, talks a great deal (clients and family both comment), finishes other people's sentences and interrupts.</p>" +
            "<h4>New in the episode (not counted towards ADHD)</h4>" +
            "<p>Slowed thinking, indecision, fatigue, loss of interest, and concentration worse than her usual level.</p>" +
            "<p>Imran: “The scattiness is the same as when I met her at 23. The sadness is new.”</p>",
          q: {
            q: "Sana's concentration is much worse than usual over the last three months. How should you handle this?",
            options: [
              "Count the worsening towards ADHD, because it falls within the last six months",
              "Exclude every symptom reported since the episode began and stop the assessment",
              "Rate ADHD symptoms on her usual self outside the episode, with an informant, and record the extra worsening as part of the depression",
              "Postpone all ADHD questions until she has been well for a year"
            ],
            a: 2,
            why: "ICD-11 says that restlessness and poor concentration during a depressive episode count towards ADHD only if they have been present since childhood and persist when the episode resolves. The practical way to apply this is to anchor ratings to the person's usual self, ideally with an informant who knows them in both states, and to keep episode-specific change separate. A blanket delay is not needed when the usual-self evidence is this clear."
          }
        },
        {
          title: "Childhood and collateral",
          html:
            "<h4>School reports (primary school in Bradford)</h4>" +
            "<ul><li>Year 2: “Sana is bright and keen but is often off task and chatting.”</li>" +
            "<li>Year 4: “Sana must slow down and check her work. She rushes and makes silly mistakes.”</li>" +
            "<li>Year 6: “A lively member of the class. Sana often forgets her homework and loses her reading book.”</li></ul>" +
            "<h4>Mother (telephone, professional Punjabi interpreter)</h4>" +
            "<p>“Always running, always talking, always losing things. The teachers said she could not sit.” She remembered homework left at school most weeks and Sana climbing the furniture at family gatherings. Childhood count: <strong>7 of 9 inattentive, 6 of 9 hyperactive-impulsive</strong>. Collateral rating: 2.</p>" +
            "<h4>Husband</h4>" +
            "<p>Fifteen years of examples, most from years when her mood was good: missed parents' evenings, late fees, two lost passports, talking over guests, never sitting through a film. Collateral rating: 2.</p>" +
            "<p>Family context: her son has ADHD and her younger brother is “the same”. The family had seen her difficulties as personality and her low mood as “stress”. Sana said it helped to be asked how her faith and family supported her.</p>",
          q: {
            q: "Why do Imran's examples from the six well years before this episode carry so much weight?",
            options: [
              "They come from years when she was not depressed, so they show the ADHD symptoms persist without the mood disorder",
              "Partners are always more accurate than parents",
              "They prove the depression was caused by ADHD",
              "They replace the need for childhood evidence"
            ],
            a: 0,
            why: "A well period is the cleanest test of whether ADHD-type symptoms are trait-like or episode-bound. Symptoms that persist when mood is normal, and that began in childhood, are not better explained by depression. They do not prove that ADHD caused the depression (although repeated failure and demoralisation can contribute), and they do not replace the childhood evidence, which here comes from school reports and her mother."
          }
        },
        {
          title: "Differentials and diagnosis",
          html:
            "<table><thead><tr><th>Condition</th><th>Evidence</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>Recurrent depression</td><td>Three discrete episodes (24, 31, now), each a clear change from her usual self, with anhedonia, early waking and weight loss</td><td>Co-occurring; current episode moderate</td></tr>" +
            "<tr><td>ADHD</td><td>Several symptoms before 12 (reports, mother); 7 inattentive and 5 hyperactive-impulsive in her usual self; present in well years; impairing at work, at home and in money management</td><td>Met</td></tr>" +
            "<tr><td>Bipolar disorder</td><td>No hypomania ever; MDQ negative; no family history</td><td>Absent (checked carefully before treatment)</td></tr>" +
            "<tr><td>Persistent depressive disorder</td><td>Years of good mood between episodes</td><td>Absent</td></tr>" +
            "<tr><td>Generalised anxiety</td><td>GAD-7 9; worry about her father and work, within the episode</td><td>Absent as a separate disorder</td></tr>" +
            "<tr><td>Thyroid disease, anaemia</td><td>TSH and full blood count normal (NICE NG145 1.2.3 advises considering thyroid tests in depression)</td><td>Absent</td></tr>" +
            "<tr><td>Sleep</td><td>New early waking (depression) on top of lifelong sleep-onset delay (busy mind)</td><td>Part of each condition</td></tr>" +
            "<tr><td>Substances, autism, borderline personality disorder</td><td>None, AQ-10 2, no relevant features</td><td>Absent</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Is it valid to diagnose ADHD while Sana is depressed?",
            options: [
              "No: depression always explains inattention, so wait for a year of remission",
              "Yes, because the ASRS is positive",
              "No: NICE does not allow ADHD to be diagnosed with another mental disorder",
              "Yes: childhood onset is documented, symptoms are present when she is well, and the depression-specific changes have been counted separately"
            ],
            a: 3,
            why: "A co-occurring disorder does not rule out ADHD (WFADHD 2021; NICE NG87 1.2.10 refers to 'other coexisting psychiatric conditions'). The test is criterion E: are the symptoms better explained by depression? Here they began in childhood and persist between episodes. Record how the episode was taken into account and plan to review the ADHD symptoms once mood has improved."
          }
        },
        {
          title: "Treatment order and plan",
          html:
            "<p>Consensus guidance: treat the most severe or impairing condition first. Severe depression and suicide risk take priority, while milder mood problems can be treated alongside ADHD (Kooij 2019; CADDRA).</p>" +
            "<ul><li><strong>Depression first, actively:</strong> sertraline review with the GP at six weeks; referral to NHS Talking Therapies with adaptations for ADHD (shorter sessions, written summaries, text reminders); safety plan reviewed at each contact.</li>" +
            "<li><strong>ADHD now, without medication:</strong> psychoeducation for Sana and Imran, a shared family calendar, automated bill payments, and workplace adjustments (a second reviewer kept, protected focus time, written briefs).</li>" +
            "<li><strong>ADHD medication:</strong> to be discussed at review once her mood is improving, after environmental modifications have been tried (NICE NG87 1.5.15). Earlier if the depression lifts quickly.</li>" +
            "<li><strong>Review in six weeks:</strong> PHQ-9, risk, and a recheck of ADHD symptoms against her usual self.</li></ul>",
          q: {
            q: "What is the best order of treatment?",
            options: [
              "Start a stimulant today: treating ADHD will lift her mood",
              "Prioritise the depressive episode with active treatment and a safety plan, start ADHD psychoeducation and adjustments now, and discuss ADHD medication when her mood is improving",
              "Stop the sertraline so that her ADHD can be assessed without medication",
              "Treat neither until her father's health is settled"
            ],
            a: 1,
            why: "With a PHQ-9 of 17 (more severe on NICE NG222's threshold of 16) and passive death wishes, the depression takes priority (Kooij 2019; CADDRA). ADHD support does not have to wait: psychoeducation and environmental changes help now and fit NICE NG87 1.5.15, which places medication after environmental modifications have been tried. Stopping an antidepressant to 'clean up' the picture would be unsafe and unnecessary."
          }
        }
      ],
      profile: { adultIA: 7, adultHI: 5, childIA: 7, childHI: 6, impairment: "ADHD: moderate at work (errors, resubmitted returns), at home and in managing money, present in years when her mood was good. Depression adds marked current impairment in family life and self-image." },
      answer: {
        conclusion: "ADHD, combined presentation, moderate, co-occurring with recurrent depressive disorder (current episode moderate). ADHD symptoms are documented from early primary school and persist in well periods; depression is episodic with clear changes from her usual self. The depressive episode is treated first, with ADHD psychoeducation and adjustments started at once and medication discussed as mood improves.",
        codes: "DSM-5-TR: ADHD, combined presentation, moderate (ICD-10-CM F90.2); major depressive disorder, recurrent episode, moderate (F33.1). ICD-11: 6A05.2; recurrent depressive disorder, current episode moderate, without psychotic symptoms (6A71.1).",
        ddx: [
          "Recurrent depressive disorder: co-occurring; does not explain the trait-like ADHD symptoms present in well years.",
          "Bipolar disorder: absent (no hypomania, MDQ negative); essential to establish before treatment.",
          "Persistent depressive disorder: absent (years of good mood between episodes).",
          "Generalised anxiety disorder: not diagnosed; worry is within the episode.",
          "Thyroid disease and anaemia: excluded by blood tests."
        ],
        teaching: [
          "A positive PHQ-9 item 9 means a clinician's conversation and a safety plan now, not a risk category (PHQ manual; NICE NG225 1.6.1 to 1.6.3).",
          "Anchor ADHD ratings to the person's usual self outside mood episodes, with an informant, and record episode-specific change separately (ICD-11 boundary guidance).",
          "Well periods are the key test: trait-like symptoms that persist when mood is normal are not better explained by depression.",
          "A co-occurring disorder does not rule out ADHD. Diagnose both when both are present, and say how each was distinguished.",
          "Treat the more severe or risky condition first; severe depression and suicide risk take priority (Kooij 2019; CADDRA). ADHD psychoeducation and adjustments can start at once.",
          "Rating scales completed during an episode (ASRS, WFIRS self-concept) are coloured by mood; recheck them when mood improves.",
          "Check for bipolarity before planning treatment, and consider thyroid tests in depression (NICE NG145 1.2.3)."
        ]
      }
    },

    /* ================================================================== */
    /* c6 Daily cannabis use and a late-onset picture                       */
    /* ================================================================== */
    {
      id: "c6",
      title: "Daily cannabis use and a late-onset picture",
      patient: "24-year-old call-centre adviser (she/her), referred by her GP",
      tags: ["cannabis", "substance use", "late onset", "intoxication", "abstinence", "not ADHD"],
      difficulty: 2,
      referral: "GP letter: Ellie is 24 and works in a call centre. She asks for an ADHD assessment after a close friend was diagnosed. She describes poor memory and concentration, low motivation and disorganisation 'for as long as I can remember', and she lost her college place at 18. She smokes cannabis every day 'to relax and sleep'. ASRS Part A 5 of 6 shaded. No psychiatric history. Please assess and consider medication.",
      stages: [
        {
          title: "Pre-assessment questionnaires",
          html:
            "<table><thead><tr><th>Tool</th><th>Result</th><th>How to read it</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1 Part A</td><td>5 of 6 shaded</td><td>Positive screen.</td></tr>" +
            "<tr><td>ASRS v1.1 Part B</td><td>6 of 12 shaded. Dichotomous profile: inattention 7/9, hyperactivity-impulsivity 4/9</td><td>Current symptoms only.</td></tr>" +
            "<tr><td>WURS-25</td><td>19 out of 100</td><td>Well below both cut-offs.</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Impaired: work, life skills (sleeping rated 3), self-concept, risk ('smoking marijuana' rated 3). Not impaired: family, social</td><td>One item at 3 is enough to mark a domain impaired.</td></tr>" +
            "<tr><td>PHQ-9 / GAD-7</td><td>11 / 10; PHQ-9 item 9 = 0</td><td>Moderate ranges.</td></tr>" +
            "<tr><td>DAST-10</td><td>5</td><td>Moderate level: further investigation.</td></tr>" +
            "<tr><td>WHO ASSIST (cannabis)</td><td>29</td><td>High-risk band (27 or more).</td></tr>" +
            "<tr><td>AUDIT-C</td><td>3</td><td>Below the UK threshold of 5.</td></tr>" +
            "</tbody></table>",
          q: {
            q: "What is the main limitation of Ellie's positive ASRS?",
            options: [
              "The ASRS is not validated in women",
              "The ASRS cannot be used in anyone who drinks alcohol",
              "There is none: a positive Part A with a high DAST-10 confirms ADHD with substance use",
              "It measures current symptoms during daily cannabis use, so it cannot separate ADHD from intoxication, withdrawal or the longer-term effects of cannabis"
            ],
            a: 3,
            why: "Intoxication and withdrawal can cause inattention, restlessness, irritability and poor sleep, and DSM-5-TR criterion E names substance intoxication and withdrawal as alternative explanations. The ASRS screener has been studied in substance use treatment, but specificity there was only 0.66 (van de Glind 2013). A low WURS-25 is a further early hint that the childhood history may not be there."
          }
        },
        {
          title: "First appointment: assessing someone who has just used",
          html:
            "<p>Ellie arrived 20 minutes late with red eyes and slowed speech. She giggled at odd moments and lost the thread of questions. She said she had smoked “a couple of joints at lunch to calm my nerves”. She was alert and oriented, had no psychotic symptoms, and was going home by bus.</p>" +
            "<p>The clinician explained, without judgement, that ADHD symptoms could not be rated fairly that day, because cannabis affects exactly the things being measured. The session was used for:</p>" +
            "<ul><li>building rapport and hearing what Ellie hoped for;</li>" +
            "<li>a detailed substance history and timeline;</li>" +
            "<li>risk, mood and a psychosis screen;</li>" +
            "<li>consent to contact her mother and request school reports;</li>" +
            "<li>an offer of referral to the local drug and alcohol service, and a second appointment.</li></ul>",
          q: {
            q: "What is the best way to use this appointment?",
            options: [
              "Do not rate ADHD symptoms today; take the substance history, check risk, gather consent for collateral and agree a plan, then rebook",
              "Complete the full ADHD interview: she has come a long way and waiting lists are long",
              "End the appointment immediately and discharge her for attending intoxicated",
              "Rate the symptoms today and make a note that she was intoxicated"
            ],
            a: 0,
            why: "The international consensus on ADHD and substance use (Crunelle 2018) advises starting the diagnostic process once there is no serious intoxication or withdrawal, focusing on drug-free periods, and including a period of abstinence where feasible. Ratings made while intoxicated are not valid, and a note does not fix that. Discharge would lose an engaged young person; the appointment can still do useful work."
          }
        },
        {
          title: "Substance history and timeline",
          html:
            "<ul><li>First cannabis at 15 at parties; weekly from 16, when she started college; daily from 17, when her parents separated. She lost her college place at 18.</li>" +
            "<li>Now 1 to 2 g a day of high-strength herbal cannabis, first joint within an hour of waking, about £100 a week, mixed with tobacco.</li>" +
            "<li>Tried to stop at 21 and 23: irritable, anxious, vivid dreams, unable to sleep, off her food; restarted within a week each time.</li>" +
            "<li>Uses more than she intends, has strong cravings, and carries on despite the memory problems and losing her college place.</li>" +
            "<li>Longest break since 17: five days.</li>" +
            "<li>Alcohol once or twice a month; no other drugs. No psychotic symptoms apart from feeling “a bit para when I'm stoned”.</li></ul>" +
            "<p>When asked about specific ages rather than “always”, Ellie said: “At school I was fine. I was a bit of a swot. It all went wrong around college.”</p>" +
            "<p>Five DSM-5-TR criteria for cannabis use disorder are met (larger amounts than intended, unsuccessful attempts to cut down, craving, continued use despite psychological problems, withdrawal), which is the moderate range (4 to 5).</p>"
        },
        {
          title: "Childhood evidence",
          html:
            "<h4>School reports (kept by her mother)</h4>" +
            "<ul><li>Year 2: “Ellie is a hard-working, well-organised girl.”</li>" +
            "<li>Year 6: “Ellie is conscientious and reliable and always hands in her homework on time.”</li>" +
            "<li>Year 10: “A quiet, capable student who works steadily.” Eight GCSE passes.</li></ul>" +
            "<h4>Mother</h4>" +
            "<p>“She was the organised one. She packed her own school bag from seven. Quiet, a bit of a worrier. All of this started in her second year at college, when she was smoking every day and her dad and I split up.” Childhood count: <strong>1 of 9 inattentive</strong> (occasional daydreaming), <strong>0 of 9 hyperactive-impulsive</strong>. Collateral rating: 0.</p>",
          q: {
            q: "What does the childhood evidence show?",
            options: [
              "Childhood ADHD that was masked by her conscientiousness",
              "Nothing useful, because school reports are always positive",
              "No sign of several symptoms before 12; the difficulties began at 17 or 18 alongside daily cannabis use and family stress, so the late onset calls for a search for another cause",
              "Onset is uncertain, so NICE says it should be ignored"
            ],
            a: 2,
            why: "NICE NG87 1.3.3 says an uncertain time of onset should not by itself exclude ADHD, but here onset is not uncertain: consistent reports and her mother describe an organised child, and Ellie herself places the change at college. The European Consensus (Kooij 2019) advises careful assessment of substance use in apparent late-onset cases. Masking is possible in some people, but there must still be signs of it, such as effort, scaffolding or strain, and none are described."
          }
        },
        {
          title: "Reassessment after ten weeks without cannabis",
          html:
            "<p>Ellie engaged with the drug and alcohol service, cut down over four weeks and then stopped. For about two weeks she was irritable and slept badly; vivid dreams lasted longer. Urine tests were negative for cannabinoids at week 6 and week 10, which supports her account. (In heavy daily users, urine tests can stay positive for several weeks after the last use, so an early positive result does not by itself mean relapse; clinical practice.)</p>" +
            "<p>At the second interview: “My head's clear for the first time in years.” She has been made a trainee team leader. Repeat ASRS Part A: 2 of 6 shaded. PHQ-9 5, GAD-7 6.</p>" +
            "<p>Adult symptoms now: <strong>3 of 9 inattentive</strong> (a messy flat, leaving tasks to the last minute, sometimes distracted at work) and <strong>1 of 9 hyperactive-impulsive</strong> (difficulty unwinding: “I don't know how to relax without it yet”). None is causing more than mild difficulty.</p>",
          q: {
            q: "What should you conclude about ADHD?",
            options: [
              "ADHD, predominantly inattentive presentation, because three symptoms remain",
              "ADHD not diagnosed: no childhood onset, and the difficulties began with daily cannabis use and largely resolved with abstinence",
              "Other specified ADHD, because she still procrastinates",
              "Defer the decision for another year of abstinence"
            ],
            a: 1,
            why: "Criterion B (several symptoms before 12) is not met, the current count is well below the adult threshold of 5, and the earlier picture is better explained by cannabis effects (criterion E). Three mild symptoms are within the range seen in people without ADHD and do not justify 'other specified ADHD'. There is no need to defer: the evidence already answers the question."
          }
        },
        {
          title: "Conclusion and plan",
          html:
            "<ul><li><strong>ADHD:</strong> not diagnosed. The report explains the timeline, the childhood evidence and the change with abstinence.</li>" +
            "<li><strong>Cannabis use disorder, moderate:</strong> now ten weeks abstinent. Relapse prevention continues with the drug and alcohol service.</li>" +
            "<li><strong>Health advice:</strong> the link between regular high-potency cannabis and psychosis; sleep strategies without cannabis; help to seek if low mood or anxiety return.</li>" +
            "<li><strong>Information:</strong> organisation strategies and resources (NICE NG87 1.4.4).</li>" +
            "<li><strong>GP letter:</strong> ADHD medication is not indicated.</li></ul>" +
            "<p>Ellie said she was disappointed at first, “but I'd rather know it was the weed than take pills for something I haven't got”.</p>",
          q: {
            q: "Suppose Ellie's school reports and mother had described clear ADHD symptoms from age 6. What would have been the right approach?",
            options: [
              "Start the diagnostic process once she was not intoxicated or in significant withdrawal, focus on drug-free periods, treat both conditions in a coordinated way, and confirm the diagnosis as substance treatment progresses",
              "Refuse to assess ADHD until she had been abstinent for a year",
              "Diagnose ADHD at the first appointment, despite the intoxication",
              "Treat the cannabis use only and never assess ADHD"
            ],
            a: 0,
            why: "Substance use does not exclude ADHD. In comorbid ADHD and substance use disorder, ADHD usually starts first (it came first in 95 to 99% of cases in the WHO World Mental Health surveys). Crunelle 2018 advises starting assessment once serious intoxication or withdrawal has passed, using collateral and school reports, and verifying the preliminary diagnosis during treatment; CADDRA and Kooij 2019 favour treating both, stabilising severe substance use first."
          }
        }
      ],
      profile: { adultIA: 3, adultHI: 1, childIA: 1, childHI: 0, impairment: "During daily use: moderate impairment at work, in daily life (sleep, money) and self-image. After ten weeks without cannabis: mild only, with a promotion at work." },
      answer: {
        conclusion: "ADHD not diagnosed. There were no ADHD symptoms of note before 12 (school reports and her mother describe an organised, conscientious child). Inattention, poor memory and low motivation began at 17 or 18 with daily high-strength cannabis use and largely resolved after ten weeks of abstinence. The picture is explained by cannabis use disorder, moderate, now in early abstinence.",
        codes: "ADHD not diagnosed. DSM-5-TR: cannabis use disorder, moderate (ICD-10-CM F12.20); the early remission specifier needs at least three months without criteria, so it does not yet apply at ten weeks. ICD-11: cannabis dependence, early full remission (6C41.21; abstinent for 1 to 12 months).",
        ddx: [
          "Cannabis use disorder with intoxication, withdrawal and chronic effects: better explains the symptoms (onset with daily use, resolution with abstinence).",
          "ADHD: not met (no childhood onset; 3 inattentive and 1 hyperactive-impulsive symptoms when abstinent).",
          "Depression and anxiety: moderate scores during use that fell to the mild range with abstinence; monitor.",
          "Cannabis-associated psychotic symptoms: absent; advice given.",
          "Insomnia: present while using and during withdrawal; improving."
        ],
        teaching: [
          "Do not rate ADHD symptoms while someone is intoxicated or in significant withdrawal; use the visit for history, risk, consent for collateral and a plan (Crunelle 2018).",
          "'Always' is not an onset history. Ask about specific ages, school years and what others noticed, and get contemporaneous records.",
          "An apparent late onset should prompt a search for another cause, especially substance use (Kooij 2019).",
          "Ask about the longest drug-free period. If there is none, a planned period of abstinence is the most informative test.",
          "Self-report screens completed during daily use measure the substance effects as much as any trait; WURS-25 and school reports help separate them.",
          "Substance use does not exclude ADHD. When childhood ADHD is clear, assess and treat both and verify the diagnosis as substance treatment progresses.",
          "People who fall short of an ADHD diagnosis should still get information and a plan (NICE NG87 1.4.4)."
        ]
      }
    },

    /* ================================================================== */
    /* c7 Obstructive sleep apnoea presenting as attention problems         */
    /* ================================================================== */
    {
      id: "c7",
      title: "Obstructive sleep apnoea presenting as attention problems",
      patient: "52-year-old regional sales manager (he/him), Welsh, referred by his GP",
      tags: ["sleep apnoea", "late onset", "daytime sleepiness", "driving", "medical mimic", "not ADHD"],
      difficulty: 1,
      referral: "GP letter: Gareth is 52 and manages sales across south Wales, driving about 30,000 miles a year. Over four years he has become forgetful and 'foggy' and cannot concentrate in meetings. He scored highly on an online ADHD test, and his wife thinks he 'has adult ADHD like our nephew'. He takes amlodipine for hypertension and has gained 15 kg since 47. Drinks most evenings. Please assess for ADHD.",
      stages: [
        {
          title: "Pre-assessment questionnaires",
          html:
            "<table><thead><tr><th>Tool</th><th>Result</th><th>How to read it</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1 Part A</td><td>4 of 6 shaded (items 1 to 4). Fidgeting: sometimes; driven by a motor: never</td><td>Positive screen, carried by inattention items.</td></tr>" +
            "<tr><td>ASRS v1.1 Part B</td><td>4 of 12 shaded (items 7 to 10). Dichotomous profile: inattention 8/9, hyperactivity-impulsivity 0/9</td><td>No hyperactivity at all.</td></tr>" +
            "<tr><td>WURS-25</td><td>21 out of 100</td><td>Well below both cut-offs.</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Impaired: work, life skills (sleeping rated 3). Not impaired: family, social, self-concept, risk</td><td>Impairment is recent.</td></tr>" +
            "<tr><td>Epworth Sleepiness Scale</td><td>16 out of 24</td><td>Severe excessive daytime sleepiness on the American Thoracic Society bands (16 to 24).</td></tr>" +
            "<tr><td>STOP-Bang</td><td>7 of 8 (all except BMI over 35)</td><td>High risk of obstructive sleep apnoea (5 to 8). Licensed tool: use the official version.</td></tr>" +
            "<tr><td>PHQ-9 / GAD-7</td><td>9 / 4; PHQ-9 item 9 = 0</td><td>PHQ-9 points come from sleep, tiredness and concentration.</td></tr>" +
            "<tr><td>AUDIT</td><td>13 (AUDIT-C 10)</td><td>Increasing risk (8 to 15). Drinks most evenings.</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Which result should change your priorities most?",
            options: [
              "The positive ASRS Part A",
              "The WFIRS-S work domain",
              "An Epworth score of 16 and a STOP-Bang of 7 in a man who drives 30,000 miles a year",
              "The PHQ-9 of 9"
            ],
            a: 2,
            why: "Severe daytime sleepiness plus a high STOP-Bang score makes obstructive sleep apnoea the lead hypothesis and raises an immediate road-safety question. Attention deficits are reported in up to 95% of people with OSA (Youssef 2011 review), and CADDRA and AADPA list sleep apnoea as a mimic. The ASRS is non-specific and cannot tell drowsiness from distractibility; the PHQ-9 points here are sleep items."
          }
        },
        {
          title: "History",
          html:
            "<h4>Before</h4>" +
            "<p>A “sensible, reliable” pupil at a Swansea comprehensive and a prefect. A levels, then an HND, then sales from 21. Promoted steadily. His wife and his manager both describe him as, until recently, “the organised one” who remembered every client's birthday.</p>" +
            "<h4>What changed (from about 48)</h4>" +
            "<ul><li>Falls asleep in front of the television every evening and dozes in afternoon meetings.</li>" +
            "<li>Forgets clients' names, loses the thread of presentations, missed two quarterly targets. Appraisal: “not his usual self”.</li>" +
            "<li>Gained 15 kg after a knee injury stopped his football (BMI now 33). Collar size has gone from 16 to 17½ inches (neck 44 cm).</li>" +
            "<li>His wife moved to the spare room because of his snoring; she has seen him stop breathing and gasp. He wakes with headaches and a dry mouth and gets up twice a night to pass urine.</li>" +
            "<li>Driving: has “nodded off for a second” twice on the M4 in the last year; often pulls into services to nap.</li></ul>" +
            "<h4>Other</h4>" +
            "<p>Three to four pints most evenings (“it helps me sleep”). No sedatives. Mood “fed up with being tired”, but he still enjoys rugby on TV and time with his grandson. His father snored heavily and died of a stroke at 70.</p>",
          q: {
            q: "Which feature best separates Gareth's picture from ADHD?",
            options: [
              "A new problem starting in his late 40s from a well-organised baseline, with drowsiness rather than distractibility",
              "Forgetting clients' names",
              "Losing the thread of presentations",
              "His positive online ADHD test"
            ],
            a: 0,
            why: "ADHD is a trait present since childhood; onset in adult life, especially alongside weight gain, snoring and sleepiness, points to OSA (clinical practice; CADDRA stresses the longitudinal course). Forgetting names and losing track are shared by both. The quality matters: Gareth describes his eyes closing and fighting sleep, not a mind pulled from one thing to the next. ICD-11 lists sleep-wake disorders among the medical conditions that must be considered."
          }
        },
        {
          title: "Safety first: driving",
          html:
            "<p>Before going further, the clinician discussed driving. Gareth agreed that he had felt sleepy at the wheel several times a month.</p>" +
            "<ul><li>Clear advice not to drive while excessively sleepy, recorded in the notes and in the letter.</li>" +
            "<li>The DVLA rules for car drivers (Assessing fitness to drive, checked on the day): with excessive sleepiness from suspected OSA he must not drive until his symptoms are controlled, and must tell the DVLA if control is not achieved within three months. If moderate or severe OSA with excessive sleepiness is confirmed, he must stop driving and tell the DVLA. Telling the DVLA is his legal duty, not the clinician's.</li>" +
            "<li>Referral to the sleep service, with his sleepiness and driving clearly stated so that he could be prioritised.</li>" +
            "<li>A practical plan agreed with his manager: train travel and video meetings for the next few weeks.</li></ul>" +
            "<p>GMC guidance: if a patient keeps driving when unfit despite every reasonable effort to persuade them, and others are exposed to a risk of death or serious harm, the doctor should contact the DVLA promptly, telling the patient beforehand and in writing afterwards. Gareth agreed to stop driving until reviewed.</p>",
          q: {
            q: "Gareth has dozed at the wheel twice. What should you do now?",
            options: [
              "Nothing yet: driving is outside the scope of an ADHD clinic",
              "Inform the DVLA yourself straight away, without discussing it with him",
              "Wait until the ADHD assessment is complete and then decide",
              "Advise him not to drive while sleepy, explain his duty to follow DVLA rules, document it, and refer to the sleep service highlighting the driving risk"
            ],
            a: 3,
            why: "Road safety comes before diagnostic tidiness. The first step is clear advice, documented, with an explanation of the patient's own responsibility to the DVLA. Under GMC guidance, if the patient keeps driving when unsafe despite every reasonable effort to persuade them, the doctor should contact the DVLA promptly, telling the patient first. Waiting for the end of the ADHD assessment leaves a sleepy driver on the motorway."
          }
        },
        {
          title: "Symptom review and collateral",
          html:
            "<p>Gareth endorsed 6 inattentive symptoms for the last six months, but every example was tied to sleepiness and began after 48: “I'm not distracted, I'm drowsy. My eyes close in meetings.” No hyperactive-impulsive symptoms: he feels slowed down, not restless.</p>" +
            "<p><strong>Wife (Carys):</strong> “Until about four years ago he ran our whole life. The snoring, the weight and the tiredness all came together.”</p>" +
            "<p><strong>Sister (Rhian), on childhood:</strong> quiet, sensible, did his homework without being asked; a bit of a daydreamer in French lessons and chatty at the back of the class. School report, Year 6: “Gareth is a sensible, reliable pupil who always tries his best.” Childhood count: 1 inattentive, 1 hyperactive-impulsive. Collateral rating for ADHD: 0.</p>"
        },
        {
          title: "Investigations and plan",
          html:
            "<ul><li><strong>Home respiratory polygraphy:</strong> apnoea-hypopnoea index 38 events per hour (30 or more is usually classed as severe), oxygen desaturation index 35, lowest oxygen saturation 78%.</li>" +
            "<li><strong>Bloods:</strong> TSH and full blood count normal; HbA1c 44 mmol/mol (raised, below the diabetes range); GGT raised.</li>" +
            "<li><strong>Blood pressure:</strong> 148/92 on amlodipine.</li>" +
            "<li><strong>MoCA:</strong> 27/30 (cut-off 26).</li></ul>" +
            "<p>Diagnosis from the sleep service: severe obstructive sleep apnoea. CPAP was started, with advice to cut evening alcohol (which relaxes the upper airway and worsens apnoea; clinical practice) and support with weight. The GP was asked to review blood pressure and HbA1c.</p>",
          q: {
            q: "What is the right sequence now?",
            options: [
              "Diagnose ADHD as well, because his ASRS is positive and the OSA may only be part of the story",
              "Treat the OSA, reduce alcohol, and reassess attention after about three months of effective treatment before drawing any conclusion about ADHD",
              "Start a stimulant to help him stay awake while waiting for CPAP",
              "Refer straight to a memory clinic for dementia"
            ],
            a: 1,
            why: "When OSA is present and the ADHD history is unclear or absent, treat the OSA and reassess (clinical practice). In the Youssef 2011 review, all six interventional studies, mostly in children, found that inattention improved after OSA treatment. His MoCA is normal and there is no progressive decline outside the sleepiness, so a memory clinic is not the next step. A stimulant would mask sleepiness without treating its cause."
          }
        },
        {
          title: "Three months on CPAP",
          html:
            "<p>CPAP use averaged 6.5 hours a night on 90% of nights. Epworth score 6. His wife is back in the bedroom. Alcohol down to weekends, about 10 units a week. Weight down 4 kg. Gareth had told the DVLA when severe OSA with excessive sleepiness was confirmed. The sleep service confirmed control of his sleepiness and good CPAP adherence, and he returned to driving once the DVLA's requirements were met, with review at least every three years.</p>" +
            "<p>“It's like someone switched the lights back on.” Repeat ASRS Part A: 1 of 6 shaded. Adult symptoms now: <strong>2 of 9 inattentive</strong> (occasionally loses his keys; finds long reports tedious), <strong>0 of 9 hyperactive-impulsive</strong>. He hit his targets this quarter.</p>",
          q: {
            q: "What should the report say about ADHD?",
            options: [
              "ADHD not diagnosed: onset at about 48 from a well-organised baseline, symptoms tied to sleepiness, no childhood evidence, and near-complete resolution with CPAP",
              "ADHD, predominantly inattentive presentation, now in remission because of CPAP",
              "ADHD unmasked by sleep apnoea",
              "Subthreshold ADHD that needs annual review"
            ],
            a: 0,
            why: "Criterion B (several symptoms before 12) is not met, and the symptoms are better explained by a medical condition that has now been treated. 'In remission' and 'unmasked' both imply ADHD existed, which the evidence does not support. NICE NG87 1.4.4 still applies: give information, and make the reasoning clear for his GP."
          }
        }
      ],
      profile: { adultIA: 2, adultHI: 0, childIA: 1, childHI: 1, impairment: "Before treatment: moderate impairment at work (missed targets) and a serious driving risk, all beginning around 48 with sleepiness. After three months of CPAP: no significant impairment." },
      answer: {
        conclusion: "ADHD not diagnosed. A previously well-organised man developed forgetfulness and poor concentration from about 48, together with weight gain, loud snoring, witnessed apnoeas and severe daytime sleepiness. A sleep study showed severe obstructive sleep apnoea, and his attention returned to his usual level after three months of CPAP. There was no childhood history of ADHD.",
        codes: "ADHD not diagnosed. Obstructive sleep apnoea, severe (AHI 38 per hour): ICD-10-CM G47.33; ICD-11 7A41. Increasing-risk drinking (AUDIT 13; now about 10 units a week) and treated hypertension noted.",
        ddx: [
          "Obstructive sleep apnoea: better explains the symptoms (adult onset with weight gain, sleepiness, witnessed apnoeas, AHI 38, resolution with CPAP).",
          "ADHD: not met (no childhood onset; 2 inattentive symptoms after treatment).",
          "Alcohol: aggravating factor (evening drinking worsens apnoea); reduced.",
          "Depression: absent (PHQ-9 points were sleep items; enjoyment intact).",
          "Mild cognitive impairment: not supported (MoCA 27/30; improvement with CPAP).",
          "Thyroid disease and anaemia: excluded."
        ],
        teaching: [
          "New attention problems in midlife from a well-organised baseline are not ADHD until proven otherwise; look for medical, sleep, mood and cognitive causes.",
          "Ask whether the person is drowsy or distracted. Sleepiness, loud snoring, witnessed apnoeas, morning headaches and a larger neck point to OSA.",
          "The Epworth and STOP-Bang are quick ways to quantify sleepiness and OSA risk; both are licensed, so use official versions.",
          "Road safety comes first: advise, document, explain DVLA responsibilities and refer, highlighting the driving risk.",
          "Treat the sleep disorder and reassess before any ADHD conclusion; inattention often improves with OSA treatment.",
          "ADHD screens cannot tell sleepiness from inattention; a positive ASRS in a sleepy patient means little.",
          "Never use a stimulant to 'test' attention or to cover untreated sleepiness."
        ]
      }
    },

    /* ================================================================== */
    /* c8 High-ability lawyer with compensated ADHD                         */
    /* ================================================================== */
    {
      id: "c8",
      title: "Compensated ADHD in a high-achieving lawyer: impairment judged against effort",
      patient: "39-year-old senior associate solicitor (he/him), Nigerian-British, referred by his GP",
      tags: ["high ability", "compensation", "impairment", "inattentive", "validity", "stimulant use"],
      difficulty: 3,
      referral: "GP letter: Femi is 39, a senior associate in corporate law at a City firm, married with two children. Despite working very long hours he struggles with organisation and deadlines. He recently received a formal warning for late time recording and had to report an email sent to the wrong client. His wife is worried about his exhaustion and their relationship. He describes himself as 'brilliant but chaotic, always have been'. ASRS Part A positive. He asks whether medication could help him 'perform at the level I should'. No mental health history.",
      stages: [
        {
          title: "Pre-assessment questionnaires",
          html:
            "<table><thead><tr><th>Tool</th><th>Result</th><th>How to read it</th></tr></thead><tbody>" +
            "<tr><td>ASRS v1.1 Part A</td><td>4 of 6 shaded (items 1 to 4)</td><td>Positive screen.</td></tr>" +
            "<tr><td>ASRS v1.1 Part B</td><td>6 of 12 shaded. Dichotomous profile: inattention 7/9, hyperactivity-impulsivity 3/9</td><td>Probes only.</td></tr>" +
            "<tr><td>WURS-25</td><td>52 out of 100</td><td>Above the original cut-off of 46.</td></tr>" +
            "<tr><td>CAARS 2 self-report (clinic licence)</td><td>DSM inattentive symptoms T 72; DSM hyperactive-impulsive symptoms T 63; Negative Impression Index 2; Inconsistency Index not elevated</td><td>Inattention very elevated (70 or more); hyperactivity slightly elevated (60 to 64); no response-style concern (follow-up suggested at 6 or more).</td></tr>" +
            "<tr><td>WFIRS-S</td><td>Impaired: work, family, life skills, self-concept. Not impaired: social, risk</td><td>Four domains meet the impairment rule.</td></tr>" +
            "<tr><td>PHQ-9 / GAD-7</td><td>7 / 8; PHQ-9 item 9 = 0</td><td>Mild ranges.</td></tr>" +
            "<tr><td>AUDIT / DAST-10</td><td>9 / 2</td><td>Increasing-risk drinking; low-level drug use to explore.</td></tr>" +
            "<tr><td>Epworth Sleepiness Scale</td><td>9</td><td>Within the normal range (0 to 10).</td></tr>" +
            "</tbody></table>" +
            "<p>A colleague in your clinical team remarks: “He has a first-class degree and earns more than any of us. Can he really be impaired?”</p>",
          q: {
            q: "How should Femi's academic and career success influence your view of impairment?",
            options: [
              "It rules out ADHD: impairment cannot be present in someone this successful",
              "It does not rule ADHD out; judge impairment by what the success costs, how far functioning is reduced in quality, and how he compares with peers of similar ability",
              "It is irrelevant: impairment should be judged only from the WFIRS-S",
              "It means the diagnosis should be made more readily, to protect his career"
            ],
            a: 1,
            why: "UKAAN AQAS states that a diagnosis 'should not be ruled out simply on the basis of the presence of high levels of achievement in certain domains of life', and warns that 'high-functioning' can obscure considerable burden. DSM-5-TR asks whether symptoms interfere with, or reduce the quality of, functioning. The European Consensus names high intelligence as a moderator that causes under-diagnosis through compensation. Equally, success is not evidence for ADHD: the criteria still have to be met."
          }
        },
        {
          title: "History",
          html:
            "<h4>Childhood and education</h4>" +
            "<p>His parents came to London from Lagos; his father is an engineer and his mother a nurse. At grammar school his mother sat with him at the kitchen table every evening, and his father's rule was “no football until homework is checked”. Top marks in tests, but homework missing and weekly detentions for talking. Teachers called him “brilliant but lazy”. At university he wrote essays overnight and nearly failed his second year after forgetting a coursework deadline; he graduated with a first.</p>" +
            "<h4>Work</h4>" +
            "<ul><li>Known for quick thinking in negotiations. Two partnership rounds passed over, with the feedback “brilliant on his feet, unreliable on process”.</li>" +
            "<li>Formal warning this year for late time recording, which has been a problem every year since qualifying.</li>" +
            "<li>A trainee checks every document he drafts; his PA runs his diary and chases his deadlines.</li>" +
            "<li>Works 70 to 80 hours a week, including most weekends; drafts are often sent at 3 am.</li>" +
            "<li>Last month he sent a confidential draft to a different client with the same first name, which the firm reported as a data breach.</li></ul>" +
            "<h4>Home and health</h4>" +
            "<p>His wife, Ngozi, a teacher, manages all bills and family admin. He forgot their daughter's school play. Impulsive purchases (a £3,000 road bike). Three speeding fines in five years. Sleeps 4 to 5 hours on weeknights and drinks 6 to 8 espressos a day. Alcohol at client events. Cocaine at three parties this year; a colleague's modafinil twice “before big deals”. No episodes of depression or elation. Anxious before deadlines and often feels “a fraud”. BP 136/86, pulse 88. No cardiac symptoms or relevant family history.</p>"
        },
        {
          title: "Adult symptoms at interview: scoring compensated symptoms",
          html:
            "<p>The clinician used one rule throughout (clinical practice): <em>count a symptom if it still shows despite his strategies, or if keeping it hidden takes unusual effort or other people's help; record the strategy and what it costs.</em></p>" +
            "<h4>Inattention: 7 of 9 present</h4>" +
            "<ul><li><strong>Careless mistakes:</strong> the wrong-recipient email; his trainee catches wrong clause references and typos every week.</li>" +
            "<li><strong>Sustaining attention:</strong> cannot read a long due-diligence report unless the deadline is hours away.</li>" +
            "<li><strong>Follow-through:</strong> time recording, training logs and appraisal forms left unfinished for months.</li>" +
            "<li><strong>Organising:</strong> relies on his PA and colour-coded flags across dozens of matters, and still loses track.</li>" +
            "<li><strong>Avoids effortful tasks:</strong> drafting is left until the night before.</li>" +
            "<li><strong>Loses things:</strong> phone twice a week, his security pass, the family passports.</li>" +
            "<li><strong>Forgetful:</strong> school events, bills, returning calls; his wife and PA remind him.</li></ul>" +
            "<p>Scored unsure and not counted: <em>seems not to listen</em> (drifts in long internal meetings, but tracks client meetings closely) and <em>distractible</em> (manages with a closed door and headphones, which are ordinary strategies).</p>" +
            "<h4>Hyperactivity-impulsivity: 4 of 9 present</h4>" +
            "<ul><li><strong>Fidgeting:</strong> clicks pens and jiggles his leg; colleagues comment.</li><li><strong>Leaving his seat:</strong> paces during every call and cannot stay seated through a film.</li><li><strong>Blurting:</strong> answers before questions are finished.</li><li><strong>Interrupting:</strong> talks over clients, raised at appraisal.</li></ul><p>The other five are absent.</p>" +
            "<p>Comparison with peers: colleagues at the same level bill similar hours in about 50 hours a week. Femi needs 75, plus a trainee and a PA covering for him.</p>",
          q: {
            q: "His trainee catches errors in his drafts every week, so clients never see them. How should you score careless mistakes?",
            options: [
              "Absent, because no error reaches a client",
              "Present only if a client complains",
              "Present: the errors happen often and are hidden only by someone else's checking; record that compensation and its cost",
              "Unsure, because people of high ability make fewer errors"
            ],
            a: 2,
            why: "The symptom is the behaviour, not whether others see its consequences. Weekly errors caught by a colleague are frequent errors. Recording the compensation matters twice over: it shows how the symptom has been hidden, and the support it needs is evidence of impairment. Ordinary strategies everyone uses (a calendar, a closed door) do not by themselves make a symptom present."
          }
        },
        {
          title: "Childhood and collateral",
          html:
            "<h4>School reports (kept by his mother)</h4>" +
            "<ul><li>Year 4: “Femi is an exceptionally able boy whose written work does not reflect his ability. He rushes, makes careless errors and is easily distracted. He must learn to stay in his seat.”</li>" +
            "<li>Year 7: “Homework is often incomplete or forgotten, although his test results are excellent.”</li>" +
            "<li>Year 9: “Femi talks constantly in lessons and has had several detentions for this.”</li></ul>" +
            "<h4>Mother (video call)</h4>" +
            "<p>“Without us at the kitchen table, nothing was done. He lost his blazer three times in one term. He could not sit through a meal.” Childhood count: <strong>7 of 9 inattentive, 6 of 9 hyperactive-impulsive</strong>. Collateral rating: 2.</p>" +
            "<h4>Wife</h4>" +
            "<p>“I'm his PA at home. He's exhausted, he's never present, and we've been to couples counselling about it.” She confirmed the adult examples. Collateral rating: 2.</p>" +
            "<p>His father initially said ADHD was “an excuse”. The structure his parents built was, in effect, the first layer of compensation; it was removed at university, where the first serious failure happened.</p>"
        },
        {
          title: "Differentials",
          html:
            "<table><thead><tr><th>Condition or factor</th><th>Evidence</th><th>Verdict</th></tr></thead><tbody>" +
            "<tr><td>Insufficient sleep</td><td>4 to 5 hours on weeknights. But on a two-week holiday last summer, sleeping 8 hours a night, he left the family passports in a taxi and missed a ferry booking; and the school reports predate any sleep loss</td><td>Aggravating, not the explanation</td></tr>" +
            "<tr><td>Caffeine</td><td>6 to 8 espressos a day; restlessness and late sleep</td><td>Aggravating; reduce and recheck pulse and BP</td></tr>" +
            "<tr><td>Anxiety</td><td>GAD-7 8; worry centres on deadlines and being exposed</td><td>Secondary; monitor</td></tr>" +
            "<tr><td>Depression and bipolar disorder</td><td>No episodes; chronic energy with tiredness, not reduced need for sleep</td><td>Absent</td></tr>" +
            "<tr><td>Stimulant use</td><td>Cocaine three times this year; modafinil twice; no loss of control</td><td>No use disorder, but relevant to prescribing risk</td></tr>" +
            "<tr><td>Alcohol</td><td>AUDIT 9 (increasing risk)</td><td>Brief advice</td></tr>" +
            "<tr><td>High ability</td><td>Explains his results and his speed in negotiation, not the lifelong disorganisation</td><td>Strength and masking factor</td></tr>" +
            "<tr><td>Normal variation (“everyone in law is stressed”)</td><td>Peers manage the same work in far fewer hours without a checker; pattern present since primary school</td><td>Not supported</td></tr>" +
            "</tbody></table>",
          q: {
            q: "Which finding best shows that sleep loss does not explain his symptoms?",
            options: [
              "School reports describe the same pattern from age 8, and on holiday with 8 hours' sleep he still lost the passports and missed a booking",
              "His Epworth score is 9",
              "He drinks a lot of coffee",
              "His wife says he is exhausted"
            ],
            a: 0,
            why: "Two tests answer the question: did the symptoms exist before the sleep loss (yes, from childhood), and do they persist when sleep is adequate (yes, on holiday)? A useful question (clinical practice) is how the person functions on holiday or at weekends when sleeping enough. A normal Epworth score shows he is not excessively sleepy, but it does not show that short sleep is not worsening his attention; caffeine and exhaustion are aggravating factors, not discriminators."
          }
        },
        {
          title: "Validity and the medication request",
          html:
            "<p>Femi openly wants medication to “perform at the level I should”, and he has used a colleague's modafinil. That is an incentive, and it must be weighed honestly.</p>" +
            "<ul><li><strong>Independent sources agree:</strong> school reports from age 8, his mother, his wife, the warning letter and two sets of appraisal comments.</li>" +
            "<li><strong>Examples are specific</strong> and dated, and he readily named areas that are fine (never late for court or client meetings).</li>" +
            "<li><strong>Response style:</strong> CAARS 2 Negative Impression Index 2 and Inconsistency Index not elevated.</li>" +
            "<li><strong>Prescribing risk:</strong> the non-prescribed stimulant use and the cocaine are relevant to any future prescription. NICE NG87 1.7.4 requires a risk assessment for substance misuse and drug diversion before medication starts.</li></ul>",
          q: {
            q: "How should his request for medication to 'perform better', and his modafinil use, affect your assessment?",
            options: [
              "Stop the assessment: anyone seeking performance enhancement is feigning",
              "Ignore them: they are irrelevant if the questionnaires are positive",
              "Diagnose ADHD quickly so that he stops using non-prescribed stimulants",
              "Record them, test his account against independent sources, explore his expectations of medication, and assess substance misuse and diversion risk before any prescribing"
            ],
            a: 3,
            why: "Incentives are common and do not by themselves invalidate a report. In adults referred for ADHD, non-credible responding is reported in roughly 15 to 31%, so incentives should prompt consistency checks, not conclusions. Here independent sources agree and the embedded validity index is clean. Separately, his stimulant use is a prescribing risk that NICE NG87 1.7.4 requires you to assess, and his expectations of what medication can do should be explored."
          }
        },
        {
          title: "Conclusion and feedback",
          html:
            "<h4>Criteria review</h4>" +
            "<ul><li><strong>A:</strong> 7 inattentive and 4 hyperactive-impulsive symptoms in the last six months.</li>" +
            "<li><strong>B:</strong> several symptoms before 12 (reports from age 8, his mother); combined pattern in childhood.</li>" +
            "<li><strong>C:</strong> work, home, social life (missed plans with friends) and driving.</li>" +
            "<li><strong>D:</strong> at least moderate impairment at work (formal warning, data breach, passed over twice) and in family life, with marked effect on self-image; outcomes kept high only by 75-hour weeks, chronic sleep loss and other people's checking.</li>" +
            "<li><strong>E:</strong> not better explained by sleep loss, caffeine, anxiety or substance use, which aggravate it.</li></ul>" +
            "<p>Presentation: predominantly inattentive (the hyperactive-impulsive count is below 5 now, though it met threshold in childhood). Severity: moderate.</p>" +
            "<h4>Feedback</h4>" +
            "<ul><li>Structured discussion (NICE NG87 1.4.3), including driving, the increased risk of substance misuse, and work.</li>" +
            "<li>Workplace adjustments: written instructions, formal PA support, automated time-recording prompts, fewer simultaneous matters, protected drafting time. Access to Work and ADHD coaching discussed.</li>" +
            "<li>Sleep, caffeine reduction, alcohol advice and the risks of cocaine and non-prescribed stimulants.</li>" +
            "<li>Medication discussed as an option once environmental modifications have been tried (NICE NG87 1.5.15), with pulse and BP rechecked after cutting caffeine.</li></ul>",
          q: {
            q: "Which statement about impairment belongs in his report?",
            options: [
              "No impairment, because he is highly paid and well qualified",
              "Severe impairment, because legal work is demanding",
              "At least moderate impairment at work and in family life, shown by the warning, the data breach, partnership feedback and relationship strain, and by the extraordinary cost of compensation, despite high outcomes",
              "Impairment cannot be judged in people of high ability, so the diagnosis is provisional"
            ],
            a: 2,
            why: "UKAAN AQAS asks the report to list the domains with at least moderate impairment, with real examples. For a high-achieving adult, the evidence lies in concrete consequences and in what the success costs, compared with peers of similar ability. Job demands alone do not make impairment severe, and high ability does not make impairment impossible to judge."
          }
        }
      ],
      profile: { adultIA: 7, adultHI: 4, childIA: 7, childHI: 6, impairment: "At least moderate at work (formal warning, data breach, passed over for partnership) and in family life (couples counselling, wife runs all admin), with marked effect on self-image; high outcomes sustained only by 70 to 80-hour weeks, sleep loss and others' checking." },
      answer: {
        conclusion: "ADHD, predominantly inattentive presentation, moderate. Combined-pattern symptoms are documented from age 8 and were contained by intensive parental structure, high ability and later by extraordinary effort and support at work. Impairment is at least moderate once the cost of compensation and the concrete consequences are counted. Sleep loss, caffeine, anxiety and occasional stimulant use aggravate but do not explain the picture; validity checks were reassuring.",
        codes: "DSM-5-TR: ADHD, predominantly inattentive presentation, moderate (ICD-10-CM F90.0). ICD-11: 6A05.0. Increasing-risk drinking (AUDIT 9) and occasional non-prescribed stimulant use noted; no substance use disorder.",
        ddx: [
          "Insufficient sleep: aggravating; symptoms predate it and persist with adequate sleep on holiday.",
          "Caffeine excess: aggravating; reduction advised before medication decisions.",
          "Anxiety: secondary to deadlines and fear of exposure; monitor.",
          "Depression and bipolar disorder: absent.",
          "Stimulant use (cocaine, modafinil): no use disorder; relevant to prescribing and diversion risk.",
          "High ability and normal occupational stress: explain his achievements, not the lifelong pattern or the support he needs."
        ],
        teaching: [
          "High achievement does not rule out ADHD (UKAAN AQAS; WFADHD 2021). Judge impairment by consequences, the cost of compensation and comparison with peers of similar ability.",
          "Count a symptom when it shows despite strategies or is hidden only by unusual effort or other people's help, and record the compensation (clinical practice).",
          "Look for the scaffolding: parents at the kitchen table, a trainee who checks everything, a PA who chases deadlines. Problems often surface when a layer of support is removed.",
          "Test sleep loss as an explanation with the timeline and the holiday question.",
          "Presentation can change: a combined childhood pattern often becomes predominantly inattentive in adulthood; code the current presentation.",
          "A request for medication to 'perform better' is an incentive to record and test, not proof of feigning. Use independent sources and embedded validity indices.",
          "Assess substance misuse and diversion risk before prescribing (NICE NG87 1.7.4), especially with non-prescribed stimulant use."
        ]
      }
    }
  ]);
})(window.AA);
