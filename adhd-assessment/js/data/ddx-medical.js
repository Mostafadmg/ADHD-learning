/* ddx-medical: medical and cognitive differentials for adult ADHD (ARCHITECTURE.md section 5.5).
   Conditions, in order: thyroid, anaemia, epilepsy, tbi, sensory, meds, menopause, postviral, mci. None is core.
   The common logic: these conditions are acquired, so the attention problems start with them, track them and
   ease when they are treated. ADHD is diagnosed alongside them only when childhood-onset symptoms predate the
   condition and persist once it is treated or stable (DSM-5-TR criterion E; ICD-11 CDDR 6A05 boundaries).
   Sources: ICD-11 CDDR (WHO 2024); DSM-5-TR (APA 2022, paraphrased); NICE NG87 1.2.1 and 1.4.5; NICE NG145,
   NG217, NG232, NG98, NG23, NG188, NG206, NG97, NG88, NG20, NG12, CG109; RCPsych CR235 (2023); UKAAN AQAS (2024);
   CADDRA 4.1; AADPA 2022; Young et al. 2020; and the primary studies named in each entry's refs.
   Interview questions and feature lists are clinical practice built from the cited discriminating features;
   they are prompts, not a validated instrument. Prevalence figures are given only where a source was checked. */
AA.add('ddx', [
  {
    id: "thyroid",
    name: "Thyroid disease (hyperthyroidism or hypothyroidism)",
    group: "medical",
    core: false,
    icd11: "5A02 (thyrotoxicosis); 5A00 (hypothyroidism)",
    summary: "An overactive thyroid causes restlessness, irritability, anxiety, poor sleep and poor concentration; an underactive thyroid causes slowed thinking, poor memory, fatigue and low mood. Both are acquired, usually in adulthood, so the symptoms are a change from the person's usual self and come with physical features. ICD-11 names hyper- and hypothyroidism, and thyroid replacement medicine, as causes of ADHD-like attention symptoms.",
    prevalence: "No reliable figure for thyroid disease in adults with ADHD was found (research brief: unverified). Thyroid disease is common in adults, especially women and after pregnancy, so it will appear by chance in ADHD clinics. ADHD is strongly over-represented in the rare genetic condition generalised resistance to thyroid hormone (Hauser et al., NEJM 1993).",
    coexist: "sometimes",
    coexistNote: "Both can be present. ADHD is diagnosed only if childhood-onset symptoms were there before the thyroid disease and persist once the person is euthyroid. DSM-5-TR lists thyroid replacement among medicines whose effects should not be counted as ADHD symptoms, and ICD-11 asks the clinician to decide whether attention symptoms are secondary to a medical condition or point to comorbid ADHD. Untreated hyperthyroidism also matters for treatment: hyperthyroidism or thyrotoxicosis is a listed contraindication (SmPC section 4.3) for methylphenidate, lisdexamfetamine and dexamfetamine.",
    overlap: [
      "Restlessness, fidgeting and feeling driven (hyperthyroidism)",
      "Irritability and a short temper",
      "Poor concentration and distractibility",
      "Difficulty getting to sleep and broken sleep (hyperthyroidism)",
      "Forgetfulness and slowed thinking (hypothyroidism)",
      "Low energy, procrastination and difficulty starting tasks (hypothyroidism)",
      "Anxiety and emotional lability",
      "Low mood and loss of motivation"
    ],
    favoursADHD: [
      "Several symptoms were clearly present before age 12, in school reports or a parent's account",
      "The pattern is lifelong and trait-like, varying with interest and demands rather than with weight, heat tolerance or energy",
      "No physical change: stable weight, normal heat and cold tolerance, no tremor or palpitations",
      "Thyroid function tests are normal, or the symptoms were the same during periods of normal thyroid function",
      "Symptoms persisted, unchanged, after the thyroid problem was treated and tests returned to normal",
      "Lifelong disorganisation and impulsivity, not only tiredness, slowing or jitteriness",
      "First-degree relatives with ADHD or another neurodevelopmental condition"
    ],
    favoursAlt: [
      "Symptoms began in adulthood, often over weeks to months, as a change from the usual self",
      "Weight loss despite a good appetite, heat intolerance, sweating, tremor or palpitations (hyperthyroidism)",
      "Weight gain, cold intolerance, dry skin, hair thinning, constipation or a hoarse voice (hypothyroidism)",
      "Goitre or eye changes (staring, grittiness, bulging, double vision) suggesting Graves disease",
      "Onset in the year after pregnancy (postpartum thyroiditis)",
      "Change in periods: lighter or absent with hyperthyroidism, heavier with hypothyroidism",
      "Personal or family history of autoimmune disease (type 1 diabetes, coeliac disease, vitiligo, pernicious anaemia)",
      "Recent change in levothyroxine dose, or medicines that affect the thyroid (lithium, amiodarone)",
      "Resting tachycardia or atrial fibrillation on examination",
      "Abnormal TSH, with free T4 (and free T3) results that fit the symptoms",
      "Inattention or restlessness improved clearly once thyroid function was corrected"
    ],
    ask: [
      "Have these concentration problems always been part of you, or did they start at a particular point? What was happening then?",
      "What were you like at primary school? Would a teacher or parent recognise what you describe now?",
      "Have you lost or gained weight without trying in the last year?",
      "Do you feel the heat or the cold more than other people? Is that new?",
      "Do you get a racing or pounding heart, sweats or shaky hands?",
      "Have you felt unusually tired, slowed down or foggy, as if your thinking is running slow?",
      "Any change in your bowels, skin, hair or voice?",
      "Have you noticed a swelling in your neck, or changes in your eyes such as grittiness, staring or double vision?",
      "(If relevant) Did this start in the year after having a baby?",
      "Have your periods changed: heavier, lighter or less regular?",
      "Do you take levothyroxine or another thyroid medicine? When did the dose last change, and how did you feel afterwards?",
      "Do you take lithium, amiodarone, or any 'thyroid support', iodine, kelp or biotin supplements?",
      "Does anyone in your family have thyroid disease, type 1 diabetes, coeliac disease or another autoimmune condition?",
      "When was your thyroid last checked, and what did the result show?",
      "When your thyroid was treated and the tests were normal, were the concentration problems and restlessness still there?",
      "(To a partner or relative) Is this the person you have always known, or have they changed over the last months?"
    ],
    features: [
      { id: "thyroid_together", t: "Attention or restlessness began or worsened at the same time as physical thyroid symptoms", w: 3 },
      { id: "thyroid_hyper", t: "Two or more hyperthyroid features: weight loss, heat intolerance, sweating, tremor, palpitations", w: 2 },
      { id: "thyroid_hypo", t: "Two or more hypothyroid features: weight gain, cold intolerance, dry skin, constipation, hoarse voice, slowing", w: 2 },
      { id: "thyroid_goitre", t: "Goitre, thyroid nodule or thyroid eye signs on examination", w: 2 },
      { id: "thyroid_pulse", t: "Resting tachycardia, atrial fibrillation or fine tremor on examination", w: 1 },
      { id: "thyroid_tft", t: "Abnormal thyroid function tests (TSH outside the reference range with matching free T4 or T3)", w: 3 },
      { id: "thyroid_postpartum", t: "Onset within a year of pregnancy", w: 1 },
      { id: "thyroid_dose", t: "Symptoms track changes in levothyroxine dose or other thyroid-active medicines", w: 2 },
      { id: "thyroid_autoimmune", t: "Personal or family history of autoimmune disease", w: 1 },
      { id: "thyroid_resolved", t: "Inattention or restlessness improved clearly when thyroid function was corrected", w: 3 },
      { id: "thyroid_change", t: "Informants describe a change from the person's usual self, not a lifelong pattern", w: 2 },
      { id: "thyroid_menses", t: "Recent change in menstrual pattern alongside the other symptoms", w: 1 }
    ],
    screen: ["gad7", "phq9"],
    investigations: [
      "TSH first when thyroid disease is suspected; free T4 if TSH is abnormal, and free T3 if TSH is low (NICE NG145).",
      "Test when the history or examination points to it. No ADHD guideline recommends routine thyroid tests for every assessment (AADPA 2022: tests only if indicated).",
      "NICE NG145 advises considering thyroid tests in adults with depression or unexplained anxiety, and warns that thyroid symptoms may be mistaken for menopause.",
      "Examine pulse rate and rhythm, weight, tremor, neck and eyes.",
      "Ask about biotin supplements before the blood test: high-dose biotin can interfere with some thyroid immunoassays (clinical practice).",
      "Thyroid peroxidase antibodies if TSH is raised, to support autoimmune thyroiditis, as per NICE NG145 and the local pathway.",
      "Confirmed hyperthyroidism: refer to endocrinology (NICE NG145). Most hypothyroidism is managed by the GP.",
      "Re-rate the 18 symptoms once the person is stable and euthyroid before finalising the ADHD conclusion."
    ],
    redFlags: [
      "Fast or irregular pulse, chest pain, breathlessness or ankle swelling: same-day medical review.",
      "Fever, agitation, confusion and a very fast heart rate in someone with hyperthyroidism (possible thyroid storm): emergency.",
      "Marked slowing, drowsiness, low body temperature or confusion in someone with hypothyroidism (possible myxoedema coma): emergency.",
      "A rapidly growing neck lump, persistent hoarseness or difficulty swallowing: urgent referral on a suspected cancer pathway.",
      "Eye pain, reduced vision or double vision with suspected Graves disease: urgent specialist review.",
      "Do not start a stimulant (methylphenidate, lisdexamfetamine or dexamfetamine) while hyperthyroidism is untreated (SmPC section 4.3 contraindication)."
    ],
    decide: {
      better: "Thyroid disease better explains the picture when the attention problems, restlessness or slowing began in adulthood together with physical thyroid features and abnormal tests, informants describe a change from the usual self, and there is no convincing childhood history. Treat the thyroid disease and do not diagnose ADHD now.",
      both: "Diagnose both when ADHD symptoms are documented before age 12 and before the thyroid disease, and they remain at a clinically significant level after the person has been stable and euthyroid for some weeks to months (clinical practice).",
      next: "Check TSH if indicated. If it is abnormal, pause the diagnostic conclusion, arrange treatment through the GP or endocrinology, and re-rate the symptoms once thyroid function has been stable for some weeks (clinical practice). Record the result and its timing in the report."
    },
    pearls: [
      "The question is timing, not the test. A normal TSH does not prove ADHD, and an abnormal TSH does not rule it out.",
      "Hyperthyroidism mimics the hyperactive side (restless, irritable, poor sleep); hypothyroidism mimics the inattentive side (slow, foggy, unmotivated). Ask about both.",
      "In people already on levothyroxine, over-replacement can cause jitteriness and poor sleep, and under-replacement can cause fog. Ask how symptoms changed with each dose change.",
      "Lithium can cause hypothyroidism and amiodarone can cause either. Check the medicine list of anyone with a mood disorder or heart rhythm problem.",
      "Postpartum thyroiditis in a tired new parent is easily mistaken for new-onset ADHD or postnatal depression.",
      "Generalised resistance to thyroid hormone is rare but strongly linked to ADHD (Hauser 1993). Suspect it when free T4 is high but TSH is normal or high, and discuss with endocrinology, who will also exclude assay interference and a TSH-secreting pituitary tumour.",
      "Treat first, then reassess. Stimulant medicine should wait until hyperthyroidism is controlled."
    ],
    refs: [
      "ICD-11 CDDR 6A05: boundaries with attentional symptoms due to other medical conditions (hyper- and hypothyroidism) and with prescribed medicines (thyroid replacement)",
      "DSM-5-TR ADHD differential diagnosis: medication-induced symptoms of ADHD (paraphrased)",
      "NICE NG145 Thyroid disease: assessment and management (2019)",
      "CADDRA Canadian ADHD Practice Guidelines 4.1: medical mimics (thyroid dysfunction)",
      "AADPA Australian evidence-based clinical practice guideline for ADHD (2022), 2.2.2",
      "RCPsych CR235 (2023) 9.7.7: medical conditions (hyperthyroidism)",
      "Hauser P et al. Attention deficit-hyperactivity disorder in people with generalized resistance to thyroid hormone. N Engl J Med 1993;328:997-1001",
      "Methylphenidate (for example Concerta XL), lisdexamfetamine (Elvanse) and dexamfetamine SmPCs, section 4.3"
    ]
  },
  {
    id: "anaemia",
    name: "Iron deficiency, anaemia, and vitamin B12 or folate deficiency",
    group: "medical",
    core: false,
    icd11: "3A00 (iron deficiency anaemia); 3A01 (vitamin B12 deficiency anaemia); 3A02 (folate deficiency anaemia)",
    summary: "Iron deficiency, with or without anaemia, and vitamin B12 or folate deficiency cause fatigue, slowed thinking, poor concentration and low mood; iron deficiency is also linked to restless legs. The deficiency is acquired and usually has a cause (heavy periods, diet, malabsorption, blood loss, medicines, nitrous oxide), so the symptoms start or worsen with it and improve when it is corrected. CADDRA and AADPA list anaemia as an ADHD mimic.",
    prevalence: "No reliable figure in adults with ADHD was found (research brief: unverified). Iron deficiency is common in people who menstruate. In a placebo-controlled trial in women aged 18-35 (149 at baseline), iron deficiency anaemia was linked to poorer cognitive performance, and a significant rise in ferritin over 16 weeks of treatment was associated with a 5-7-fold improvement in cognitive performance (Murray-Kolb and Beard 2007). The trial did not study ADHD.",
    coexist: "sometimes",
    coexistNote: "Both can be present, and a deficiency can worsen existing ADHD. Diagnose ADHD only if childhood-onset symptoms predate the deficiency and persist once iron, B12 and folate are replete. ICD-11 asks whether attention symptoms are secondary to a medical condition, and names nutritional deficiency among the possible causes of mild neurocognitive disorder (6D71).",
    overlap: [
      "Fatigue and low energy that make it hard to start or finish tasks",
      "Poor concentration and slowed processing",
      "Forgetfulness",
      "Low mood and irritability",
      "Restless legs and difficulty settling in the evening (iron deficiency)",
      "Poor sleep quality and daytime tiredness",
      "Reduced exercise tolerance and loss of motivation",
      "Headaches"
    ],
    favoursADHD: [
      "Symptoms present since primary school, before any likely cause of deficiency (periods, diet change, surgery)",
      "Distractibility, disorganisation and impulsivity, not only tiredness and slowing",
      "Attention varies with interest and structure rather than with physical energy",
      "Normal full blood count, ferritin, B12 and folate",
      "Symptoms persisted after the deficiency was corrected and levels normalised",
      "Restlessness is general and present through the day, not an evening urge to move the legs relieved by moving",
      "Family history of ADHD"
    ],
    favoursAlt: [
      "Recent onset or clear worsening with tiredness, breathlessness on exertion, palpitations or dizziness",
      "Heavy or prolonged periods, recent pregnancy, or frequent blood donation",
      "Vegan or vegetarian diet without supplements, a restricted diet or an eating disorder",
      "Gastrointestinal symptoms, coeliac disease, inflammatory bowel disease or weight-loss surgery",
      "Pallor, brittle nails, sore tongue, mouth ulcers or hair loss",
      "Pins and needles, numbness, unsteadiness or memory decline (B12 deficiency)",
      "Long-term metformin or proton pump inhibitor use (B12), or anti-seizure medicines that lower folate",
      "Recreational nitrous oxide use, which inactivates vitamin B12",
      "An evening urge to move the legs that is relieved by movement (iron-related restless legs)",
      "Low haemoglobin or ferritin, raised MCV, or low B12 or folate",
      "Clear improvement in concentration and energy after replacement"
    ],
    ask: [
      "Do you feel tired all the time, even after enough sleep?",
      "Do you get breathless, dizzy or a racing heart when you climb stairs or exercise?",
      "When did the tiredness and the poor concentration start? Did they start together?",
      "Were you this distractible at school, before any of these physical symptoms?",
      "(If they menstruate) Are your periods heavy or long? Do you flood, pass clots or need to change protection during the night?",
      "What do you usually eat in a day? Do you follow a vegan, vegetarian or restricted diet?",
      "Have you had stomach or bowel problems, coeliac disease, weight-loss surgery or blood in your stools?",
      "Do you give blood regularly, or have you been pregnant or breastfeeding recently?",
      "Do your legs feel restless or uncomfortable in the evening, with an urge to move them that eases when you walk about?",
      "Any pins and needles, numbness, unsteady walking or a sore, smooth tongue?",
      "Do you take metformin, an acid-reducing medicine such as omeprazole, or anti-seizure medicine?",
      "Have you ever used nitrous oxide (laughing gas, balloons)? How often, and how much?",
      "Have you had cravings for ice or for things that are not food?",
      "Have you had a blood count or iron test? If you took iron, how did you feel afterwards?",
      "When your iron or B12 levels were back to normal, were the concentration problems still there?",
      "(To an informant) Has their energy or concentration changed recently, or have they always been like this?"
    ],
    features: [
      { id: "anaemia_together", t: "Concentration problems began or worsened in adulthood together with fatigue and other physical symptoms", w: 3 },
      { id: "anaemia_exertion", t: "Breathlessness on exertion, palpitations, dizziness or pallor", w: 2 },
      { id: "anaemia_loss", t: "Heavy menstrual bleeding, recent pregnancy or frequent blood donation", w: 1 },
      { id: "anaemia_diet", t: "Restricted diet or malabsorption (coeliac disease, inflammatory bowel disease, weight-loss surgery)", w: 1 },
      { id: "anaemia_rls", t: "Evening urge to move the legs, relieved by movement", w: 1 },
      { id: "anaemia_neuro", t: "Neuropathy, unsteadiness or memory decline suggesting B12 deficiency", w: 2 },
      { id: "anaemia_n2o", t: "Regular recreational nitrous oxide use", w: 2 },
      { id: "anaemia_meds", t: "Long-term metformin, proton pump inhibitor or anti-seizure medicine use", w: 1 },
      { id: "anaemia_bloods", t: "Low haemoglobin or ferritin, or low B12 or folate, on recent bloods", w: 3 },
      { id: "anaemia_better", t: "Clear improvement in concentration after replacement therapy", w: 3 },
      { id: "anaemia_nochild", t: "No convincing childhood history of inattention or hyperactivity", w: 2 },
      { id: "anaemia_pica", t: "Craving ice or non-food items (pica)", w: 1 }
    ],
    screen: [],
    investigations: [
      "Full blood count and ferritin when fatigue, heavy periods, diet, restless legs or bleeding point to it. This is not a routine ADHD test (clinical practice).",
      "Ferritin rises with inflammation, so a normal value can hide iron deficiency; check CRP or transferrin saturation if in doubt (clinical practice).",
      "Vitamin B12 and folate if MCV is raised, or with neurological symptoms, a restricted diet, malabsorption, metformin or proton pump inhibitor use, or nitrous oxide use.",
      "Coeliac serology if iron, B12 or folate deficiency is unexplained (NICE NG20).",
      "Heavy menstrual bleeding: assess and manage as per NICE NG88.",
      "Unexplained iron deficiency anaemia, especially in men and after the menopause: the GP investigates the gut using the NICE NG12 suspected cancer pathways.",
      "Repeat bloods after treatment and re-rate the ADHD symptoms once levels are replete."
    ],
    redFlags: [
      "Very low haemoglobin, breathlessness at rest, chest pain or fainting: urgent medical review.",
      "Unexplained iron deficiency in men or after the menopause, or with weight loss, change in bowel habit or rectal bleeding: urgent GP assessment for possible gastrointestinal cancer.",
      "Numbness, weakness, unsteady walking or falls with low B12 or nitrous oxide use: same-day treatment and urgent specialist advice (risk of spinal cord damage).",
      "Heavy menstrual bleeding with symptoms of anaemia: prompt GP or gynaecology review.",
      "Restrictive eating with low weight: assess physical risk and refer through the local eating disorder pathway."
    ],
    decide: {
      better: "The deficiency better explains the picture when tiredness, slowing and poor concentration began in adulthood with a clear cause (heavy periods, diet, malabsorption, nitrous oxide), childhood evidence of ADHD is absent, and the symptoms resolve once levels are corrected.",
      both: "Diagnose ADHD as well when there is clear childhood-onset ADHD before the deficiency and clinically significant symptoms remain once iron, B12 and folate are replete.",
      next: "Order FBC and ferritin, plus B12, folate and CRP as indicated. Ask the GP to treat and investigate the cause, and re-rate the symptoms after a full course of replacement (clinical practice)."
    },
    pearls: [
      "Ask about periods directly. Heavy menstrual bleeding is common and many people see it as normal.",
      "Fatigue-driven inattention worsens with tiredness and lifts with rest and replacement; ADHD inattention tracks interest and structure (clinical practice).",
      "Recreational nitrous oxide use is common in young adults and causes functional B12 deficiency with nerve and spinal cord damage. Ask about it by name.",
      "Iron deficiency without anaemia can still affect cognition: iron-deficient women without anaemia performed between iron-sufficient and anaemic women (Murray-Kolb and Beard 2007). A normal haemoglobin does not exclude it.",
      "Evening restless legs plus ADHD-like restlessness: check ferritin before attributing all the restlessness to ADHD (see restless legs syndrome).",
      "Irregular eating in ADHD and appetite loss on stimulants can lead to deficiency, so deficiency can be a consequence of ADHD as well as a mimic (clinical practice)."
    ],
    refs: [
      "CADDRA Canadian ADHD Practice Guidelines 4.1: medical mimics (severe anaemia)",
      "AADPA Australian ADHD guideline (2022), 2.2.2 (anaemia as a mimic or exacerbator)",
      "ICD-11 6D71 Mild neurocognitive disorder: nutritional deficiency named among possible causes",
      "Murray-Kolb LE, Beard JL. Iron treatment normalizes cognitive functioning in young women. Am J Clin Nutr 2007;85:778-787",
      "NICE NG88 Heavy menstrual bleeding: assessment and management (2018)",
      "NICE NG20 Coeliac disease: recognition, assessment and management (2015)",
      "NICE NG12 Suspected cancer: recognition and referral",
      "NICE CKS: Anaemia - iron deficiency; Anaemia - B12 and folate deficiency"
    ]
  },
  {
    id: "epilepsy",
    name: "Epilepsy (absence and focal impaired-awareness seizures) and anti-seizure medicine effects",
    group: "medical",
    core: false,
    icd11: "8A60-8A6Z (epilepsy or seizures)",
    summary: "Absence seizures and focal impaired-awareness seizures cause brief lapses that look like daydreaming, 'zoning out' or not listening. Between seizures, the epilepsy itself and anti-seizure medicines can impair attention, memory and processing speed. Epilepsy and ADHD also genuinely co-occur, so the task is often to recognise both rather than choose one.",
    prevalence: "ADHD is more common in epilepsy. In a US national survey, 18.4% of 1,361 adults with active epilepsy screened positive on the ASRS-6 (score above 14); this is a screening rate, not a diagnosis rate (Ettinger 2015). In Swedish registers, people with epilepsy had about 3.5 times the odds of ADHD (OR 3.47; Brikell 2018). NICE NG87 1.2.1 lists people with epilepsy as a group with increased ADHD prevalence.",
    coexist: "yes",
    coexistNote: "Both can be diagnosed. The inattention must be present between seizures and not explained by seizure lapses, post-ictal states or medicine effects. ICD-11 lists epilepsy among the associated risks of ADHD, and CADDRA lists epilepsy and anti-seizure medicine side effects among the conditions to consider. In practice, optimise seizure control and liaise with neurology (clinical practice). A Swedish register study of 38,247 people with epilepsy found no rise in acute seizures during periods on ADHD medicine (Brikell 2019), but the methylphenidate SmPC still advises caution in epilepsy.",
    overlap: [
      "Brief blank spells, staring or 'zoning out'",
      "Missing parts of conversations or instructions",
      "Losing the thread mid-task or mid-sentence",
      "Forgetfulness and poor memory for recent events",
      "Slowed processing and mental fatigue (often from anti-seizure medicines)",
      "Irritability and mood changes (for example with levetiracetam)",
      "Poor sleep and daytime tiredness",
      "Accidents and injuries"
    ],
    favoursADHD: [
      "Mind-wandering that stops at once when the person is called by name or touched",
      "The person knows they drifted off and can usually say what they were thinking about",
      "Inattention is constant and linked to boredom or low interest, not sudden discrete episodes",
      "Hyperactivity, impulsivity and disorganisation as well as lapses",
      "Symptoms predate the first seizure and the first anti-seizure medicine",
      "Symptoms persist in seizure-free periods and on a stable, well-tolerated medicine",
      "Informants describe daydreaming that varies with interest, not abrupt stops"
    ],
    favoursAlt: [
      "Lapses of seconds with an abrupt start and end, and no response even to touch or a loud voice",
      "No memory of the lapse; the person carries on as if nothing happened",
      "Eyelid flutter, lip smacking, chewing, fumbling or other automatisms during spells",
      "Warning sensations: a rising feeling in the stomach, déjà vu, fear, or an odd smell or taste",
      "Confusion, sleepiness or headache after spells",
      "Jerks or dropping things in the morning (myoclonus), or witnessed convulsions",
      "Spells brought on by lack of sleep, alcohol, over-breathing or flashing lights",
      "Unexplained injuries, a bitten tongue, incontinence, or waking confused",
      "Attention worsened after starting or increasing an anti-seizure medicine (for example topiramate, phenobarbital, valproate, carbamazepine, levetiracetam)",
      "Febrile seizures, brain injury, meningitis or encephalitis in the past, or epilepsy in the family",
      "EEG shows epileptiform activity that matches the spells"
    ],
    ask: [
      "When you 'switch off', can someone bring you back straight away by saying your name or touching your arm?",
      "Do you know afterwards that you drifted off? Can you say what you were thinking about?",
      "Has anyone seen you stare, stop talking mid-sentence or stop moving for a few seconds, then carry on as if nothing happened?",
      "During these spells, has anyone noticed your eyelids flickering, lip smacking, chewing or fiddling with your hands?",
      "Do you ever get a strange feeling before a spell, such as a rising feeling in your stomach, déjà vu, fear, or an odd smell or taste?",
      "After a spell, are you confused, sleepy or headachy?",
      "In the mornings, do you get sudden jerks or drop things, especially after a late night or alcohol?",
      "Have you ever woken with a bitten tongue, a wet bed, aching muscles or injuries you cannot explain?",
      "Have you ever lost time while driving, or found yourself somewhere without remembering getting there?",
      "Do the spells come more with lack of sleep, alcohol, stress or flashing lights?",
      "As a child, did you have fits with fevers, a serious head injury, meningitis or encephalitis?",
      "Does anyone in your family have epilepsy?",
      "(If on anti-seizure medicine) Did your concentration, mood or memory change when a medicine was started or the dose went up?",
      "Were you distractible and restless at school before any seizures started?",
      "On a day with no seizures and a good night's sleep, are the concentration problems still there?",
      "(To an informant) What exactly does a 'switch-off' look like? How long does it last, and can you interrupt it?"
    ],
    features: [
      { id: "epilepsy_abrupt", t: "Lapses lasting seconds with abrupt onset and offset, not interruptible by voice or touch", w: 3 },
      { id: "epilepsy_amnesia", t: "No awareness or memory of the lapse", w: 2 },
      { id: "epilepsy_automatisms", t: "Automatisms (lip smacking, chewing, fumbling) or eyelid flutter during spells", w: 3 },
      { id: "epilepsy_aura", t: "Stereotyped warning sensations (rising stomach feeling, déjà vu, odd smell or taste)", w: 2 },
      { id: "epilepsy_postictal", t: "Confusion, drowsiness or headache after spells", w: 2 },
      { id: "epilepsy_myoclonus", t: "Morning myoclonic jerks or witnessed convulsions", w: 3 },
      { id: "epilepsy_signs", t: "Tongue biting, incontinence or unexplained injuries", w: 2 },
      { id: "epilepsy_triggers", t: "Spells provoked by sleep deprivation, alcohol, over-breathing or flashing lights", w: 1 },
      { id: "epilepsy_asm", t: "Attention or mood worsened after starting or increasing an anti-seizure medicine", w: 2 },
      { id: "epilepsy_risk", t: "Febrile seizures, brain injury or CNS infection, or a first-degree relative with epilepsy", w: 1 },
      { id: "epilepsy_eeg", t: "EEG shows epileptiform activity consistent with the spells", w: 3 },
      { id: "epilepsy_after", t: "Attention lapses began after the seizures started, with no childhood history", w: 2 }
    ],
    screen: ["phq9", "gad7"],
    investigations: [
      "Suspected seizure: refer urgently for an appointment within 2 weeks with a clinician with expertise in first seizures and epilepsy (NICE NG217 1.1.1).",
      "Get an eyewitness account and, if possible, a smartphone video of a typical spell.",
      "EEG and MRI are arranged by the epilepsy service to investigate seizures. A routine EEG can be normal between seizures, and sleep-deprived or ambulatory recording may be needed (clinical practice).",
      "EEG has no role in diagnosing ADHD (CADDRA does not endorse it).",
      "12-lead ECG if the episodes could be cardiac syncope rather than seizures (NICE CG109).",
      "Review anti-seizure medicine doses, timing and recent changes with the neurologist; drug levels where useful.",
      "Neuropsychological assessment in complex cases, to separate medicine effects, seizure-related deficits and lifelong attention problems."
    ],
    redFlags: [
      "A first suspected seizure, or a seizure after a long seizure-free period: urgent referral (NICE NG217).",
      "Lapses while driving or operating machinery: advise them to stop driving until assessed, and explain the legal duty to tell the DVLA.",
      "A seizure lasting more than 5 minutes, or repeated seizures without recovery in between: emergency (status epilepticus).",
      "New seizures with headache, fever, confusion, focal weakness or personality change: same-day assessment.",
      "Valproate in someone who could become pregnant: check the MHRA pregnancy prevention requirements are in place.",
      "Low mood or suicidal thoughts: anti-seizure medicines carry a warning about suicidal thoughts; assess risk."
    ],
    decide: {
      better: "Seizures better explain the inattention when the lapses are brief, abrupt, uninterruptible and not remembered, or when the attention problems began with the seizures or with an anti-seizure medicine and there is no childhood ADHD history. Refer to neurology and do not diagnose ADHD on that basis.",
      both: "Diagnose both when childhood-onset ADHD symptoms predate the seizures and the medicine, are present between seizures and across settings, and include more than lapses (disorganisation, restlessness, impulsivity). Coexisting epilepsy is common and is not a reason to withhold an ADHD diagnosis.",
      next: "Get an eyewitness description and video, refer suspected seizures (NICE NG217), give driving and safety advice, and review anti-seizure medicines with neurology. Complete the ADHD assessment using between-seizure functioning, and agree any ADHD medicine plan with the neurologist."
    },
    pearls: [
      "The bedside test: can the spell be interrupted? Daydreaming stops when you call the person's name; an absence seizure does not (clinical practice).",
      "New absence epilepsy is uncommon in adults; most adult 'blank spells' that are seizures are focal impaired-awareness seizures, which usually last longer than absences (often 30 seconds to a few minutes) and are followed by confusion. Absences last seconds with instant recovery.",
      "'Daydreaming' spells since the teens plus morning jerks and a convulsion after a late night or alcohol suggest juvenile myoclonic epilepsy, which usually starts in adolescence; ask about all three.",
      "Take a medicine timeline. ICD-11 names carbamazepine and valproate, AADPA names levetiracetam, and topiramate commonly causes slowing and word-finding problems.",
      "Screen both ways: ask about seizures in ADHD clinics and about ADHD in epilepsy clinics (NICE NG87 1.2.1).",
      "Epilepsy does not rule out ADHD treatment. Optimise seizure control first, liaise with neurology and monitor seizures (clinical practice; Brikell 2019).",
      "Non-epileptic (functional or dissociative) attacks also cause lapses; specialist assessment with video is the way to tell them apart."
    ],
    refs: [
      "NICE NG87 1.2.1 (people with epilepsy: increased ADHD prevalence)",
      "NICE NG217 Epilepsies in children, young people and adults (2022), 1.1.1",
      "ICD-11 CDDR 6A05: associated features (epilepsy) and medicines (carbamazepine, valproate)",
      "RCPsych CR235 (2023) Table 3: ADHD and differentiating comorbid conditions (neurological, tic and epilepsy)",
      "CADDRA Canadian ADHD Practice Guidelines 4.1 (epilepsy and anti-epileptic side effects; EEG not endorsed)",
      "AADPA Australian ADHD guideline (2022), narrative 2.2 (levetiracetam)",
      "Ettinger AB et al. ADHD symptoms in adults with self-reported epilepsy. Epilepsia 2015;56:218-224",
      "Brikell I et al. Familial liability to epilepsy and ADHD. Biol Psychiatry 2018;83:173-180",
      "Brikell I et al. Medication treatment for ADHD and the risk of acute seizures in individuals with epilepsy. Epilepsia 2019;60:284-293",
      "NICE CG109 Transient loss of consciousness ('blackouts') in over 16s"
    ]
  },
  {
    id: "tbi",
    name: "Traumatic brain injury and other acquired brain injury",
    group: "medical",
    core: false,
    icd11: "NA07 (intracranial injury; NA07.0 concussion); 6E67 (secondary neurocognitive syndrome); 6E68 (secondary personality change)",
    summary: "A brain injury, whether traumatic or from stroke, infection, lack of oxygen or a tumour, can cause new problems with attention, processing speed, memory, planning, irritability and disinhibition, especially after frontal injury. The key is a clear before-and-after change. ADHD itself raises the risk of head injury, so an injury may be a consequence of pre-existing ADHD rather than its cause.",
    prevalence: "In an Ontario survey of 3,993 adults, those with a lifetime TBI (at least 5 minutes unconscious or an overnight hospital stay) had about 2.5 times the odds of screening positive on the ASRS-6 (adjusted OR 2.49) and of reporting an ADHD diagnosis (OR 2.64); the survey was cross-sectional, so direction is unknown (Ilie 2015). A meta-analysis of five studies found a significant association between mild TBI and ADHD (Adeyemo 2014). NICE NG87 1.2.1 lists people with acquired brain injury as a group with increased ADHD prevalence.",
    coexist: "sometimes",
    coexistNote: "ADHD can be diagnosed alongside a brain injury when ADHD symptoms were present before the injury, from childhood. Symptoms that began after an injury in adolescence or adulthood are a secondary syndrome (ICD-11 6E67 or 6E68; DSM-5-TR mild or major neurocognitive disorder due to TBI), not ADHD, even when they look the same. An injury in early childhood blurs this line: an ADHD-like picture after a childhood brain injury ('secondary ADHD') is described in research, so record the injury and its timing whichever label is used. Pre-existing ADHD can be made worse by an injury.",
    overlap: [
      "Poor sustained attention and distractibility",
      "Slow processing and mental fatigue",
      "Forgetfulness and poor working memory",
      "Disorganisation, poor planning and difficulty starting tasks",
      "Impulsivity, disinhibition and talking over others",
      "Irritability and low frustration tolerance",
      "Poor sleep and headaches",
      "Problems at work and in relationships"
    ],
    favoursADHD: [
      "Symptoms documented before the injury in school reports, a parent's account or earlier records",
      "Several injuries since childhood that look like a result of impulsivity and risk-taking",
      "A lifelong pattern with no clear before-and-after change",
      "A mild injury without loss of consciousness or memory loss, after which nothing changed",
      "Hyperactivity in childhood, not only adult cognitive slowing",
      "Family history of ADHD"
    ],
    favoursAlt: [
      "Clear onset or step change after a specific injury or neurological illness",
      "Informants say 'they have not been the same since'",
      "Moderate or severe injury: prolonged loss of consciousness or post-traumatic amnesia, skull fracture, bleeding in the brain or neurosurgery",
      "Prominent slowed processing, word-finding difficulty and fatigue rather than restlessness",
      "New personality change: apathy, disinhibition, tactlessness or loss of empathy",
      "Headaches, dizziness, sensitivity to light or noise, and tinnitus after the injury (post-concussion symptoms)",
      "Focal neurological signs, new seizures, loss of smell or visual field loss",
      "Brain imaging shows injury that fits the symptoms (for example frontal contusions)",
      "A good school record and stable work before the injury",
      "Gradual improvement over the months after the injury"
    ],
    ask: [
      "Have you ever had a head injury, been knocked out, or been dazed or confused after a blow to the head? How many times?",
      "For the worst injury: were you unconscious, and for how long? How much of the time before and after can you not remember?",
      "Did you go to hospital, have a scan or need an operation?",
      "What were you like at school and at work before the injury? Would your school reports show the same problems?",
      "What changed afterwards? What can you no longer do that you used to?",
      "Do you tire mentally much faster than before? Do you need to rest after concentrating?",
      "Since the injury, have you had headaches, dizziness, sensitivity to light or noise, or changes in sight, smell or hearing?",
      "Since the injury, have you become more irritable or quick to anger, or said things you would not have said before?",
      "Have you had any other brain illness: a stroke, meningitis, encephalitis, a brain tumour, or a time without oxygen such as a cardiac arrest, overdose or near-drowning?",
      "Have you had fits or blackouts since the injury?",
      "Have you had repeated knocks to the head from sport, falls, fights or road accidents?",
      "Has anyone ever hurt you by hitting your head, strangling or choking you? (ask in private)",
      "Did your drinking or drug use change after the injury?",
      "Do you have low mood, flashbacks or nightmares about what happened?",
      "Have the problems improved, stayed the same or got worse since the injury?",
      "(To an informant who knew them before) Is this a change, or were they always like this?",
      "Have you been seen by a brain injury service or a neuropsychologist?"
    ],
    features: [
      { id: "tbi_change", t: "Clear before-and-after change in attention or behaviour after an injury or neurological illness", w: 3 },
      { id: "tbi_severity", t: "Moderate or severe injury: prolonged loss of consciousness or post-traumatic amnesia, intracranial bleed, skull fracture or neurosurgery", w: 3 },
      { id: "tbi_premorbid", t: "Good pre-injury school and work record, with no childhood history of ADHD symptoms", w: 2 },
      { id: "tbi_informant", t: "Informants who knew the person before say they have not been the same since", w: 3 },
      { id: "tbi_personality", t: "New apathy, disinhibition, tactlessness or loss of empathy", w: 2 },
      { id: "tbi_fatigue", t: "Mental fatigue and slowed processing are more prominent than distractibility", w: 2 },
      { id: "tbi_pcs", t: "Post-concussion symptoms: headache, dizziness, light or noise sensitivity", w: 1 },
      { id: "tbi_neuro", t: "Focal neurological signs, new seizures, loss of smell or visual field loss", w: 2 },
      { id: "tbi_imaging", t: "Brain imaging shows injury in keeping with the symptoms", w: 2 },
      { id: "tbi_course", t: "Symptoms improving over months after the injury", w: 1 },
      { id: "tbi_other", t: "Other acquired brain injury: stroke, encephalitis, hypoxia, tumour or neurosurgery", w: 2 }
    ],
    screen: ["phq9", "pcl5", "auditc", "moca"],
    investigations: [
      "Get the injury records: emergency department notes, scan reports, discharge letters and rehabilitation reports.",
      "Get school reports and a pre-injury informant account to establish the pre-injury baseline.",
      "Neuropsychological assessment by a clinical neuropsychologist, to profile deficits, separate acquired from lifelong difficulties and plan rehabilitation.",
      "Refer to a brain injury or neurorehabilitation service, or neurology, if there is a significant new deficit.",
      "Neurological examination; brain imaging (MRI) through neurology if not already done and the result would change management.",
      "After moderate or severe TBI with fatigue, low mood or low libido, consider pituitary dysfunction and discuss endocrine tests with the GP or endocrinology (clinical practice).",
      "Screen for depression, PTSD, sleep problems and alcohol use, which are common after injury and worsen attention."
    ],
    redFlags: [
      "Recent head injury with worsening headache, repeated vomiting, drowsiness, confusion, a seizure or focal weakness: emergency department now (NICE NG232).",
      "Any recent head injury in someone taking anticoagulants: urgent assessment (NICE NG232).",
      "Cognitive or personality decline weeks to months after an injury, especially in older adults, heavy drinkers or people on anticoagulants: consider chronic subdural haematoma and arrange urgent assessment.",
      "Head injury or strangulation by a partner or family member: follow safeguarding and domestic abuse procedures.",
      "New seizures after an injury: urgent referral (NICE NG217).",
      "Suicidal thoughts: suicide risk is raised after brain injury; assess risk today."
    ],
    decide: {
      better: "The brain injury better explains the picture when the attention or behaviour problems began after the injury, informants describe a change from a previously good level of function, and there is no childhood history. Diagnose the secondary syndrome (ICD-11 6E67 or 6E68) or a neurocognitive disorder, not ADHD.",
      both: "Diagnose ADHD as well when childhood-onset ADHD symptoms are documented before the injury. Record that the injury may have added new deficits, such as slowed processing, on top of pre-existing ADHD.",
      next: "Establish the pre-injury baseline from records and informants, get the injury records, refer for neuropsychological assessment or to a brain injury service when deficits are new, and screen for depression, PTSD, sleep problems and alcohol use. If ADHD medicine is considered after a brain injury, involve the brain injury team."
    },
    pearls: [
      "Always ask about head injury, and ask in more than one way: 'Have you ever been knocked out or dazed?' finds injuries that 'head injury' misses. UKAAN AQAS asks assessors to ask specifically about head injuries and seizures.",
      "Direction matters. Impulsive, inattentive children and adults have more head injuries, so many minor injuries since childhood often point to pre-existing ADHD.",
      "In the Adeyemo 2014 meta-analysis the association was significant in studies of ADHD after mild TBI but not in studies of mild TBI after ADHD. Only five studies were pooled, so interpret with caution.",
      "Pre-injury school reports are the most useful single document in this differential.",
      "Mental fatigue and slowed processing dominate after brain injury; childhood-type hyperactivity is not typical (clinical practice).",
      "Think beyond trauma: lack of oxygen after an overdose, cardiac arrest or strangulation, encephalitis and stroke all cause acquired attention problems.",
      "Persistent post-concussion symptoms often involve depression, anxiety, poor sleep or PTSD, which are treatable in their own right."
    ],
    refs: [
      "NICE NG87 1.2.1 (people with acquired brain injury: increased ADHD prevalence)",
      "UKAAN Adult ADHD Assessment Quality Assurance Standard (AQAS, 2024): ask specifically about seizures and head injuries",
      "RCPsych CR235 (2023) 9.7.7: medical conditions (frontal lobe syndromes)",
      "ICD-11 CDDR 6E67 Secondary neurocognitive syndrome; 6E68 Secondary personality change; 6D71 Mild neurocognitive disorder",
      "DSM-5-TR: neurocognitive disorder due to traumatic brain injury (paraphrased)",
      "Ilie G et al. The association between traumatic brain injury and ADHD in a Canadian adult sample. J Psychiatr Res 2015;69:174-179",
      "Adeyemo BO et al. Mild traumatic brain injury and ADHD: a systematic review and meta-analysis. J Atten Disord 2014;18:576-584",
      "NICE NG232 Head injury: assessment and early management (2023)"
    ]
  },
  {
    id: "sensory",
    name: "Hearing loss or visual impairment",
    group: "medical",
    core: false,
    icd11: "AB50-AB5Z (hearing impairment); 9D90 (vision impairment including blindness)",
    summary: "Unrecognised hearing loss or visual problems make a person seem not to listen, miss or mishear instructions, lose their place when reading and tire quickly. The problems are confined to tasks that depend on the impaired sense and improve with good listening conditions, visual aids or correction. CADDRA and AADPA list hearing and vision impairment as mimics to exclude.",
    prevalence: "No figure for adults with ADHD was found. Hearing loss becomes more common with age and noise exposure. The NICE NG98 committee identified people with dementia, mild cognitive impairment and learning disabilities as the main groups whose hearing loss goes unidentified in primary care.",
    coexist: "yes",
    coexistNote: "Sensory impairment and ADHD can both be present. ADHD is diagnosed only when inattention also occurs in situations that do not depend on the impaired sense (for example one-to-one in a quiet room, with glasses on) and dates from childhood. DSM-5-TR requires that symptoms are not solely due to failure to understand tasks or instructions, and ICD-11 asks whether attention symptoms are secondary to another condition.",
    overlap: [
      "Seems not to listen when spoken to",
      "Misses or mishears instructions and asks for repetition",
      "Loses track in meetings, groups and phone calls",
      "Avoids reading or long documents",
      "Loses their place when reading; reads slowly",
      "Tires quickly with sustained listening or screen work",
      "Withdraws or seems distracted in social settings",
      "Makes errors by missing written details"
    ],
    favoursADHD: [
      "Inattention also in quiet one-to-one settings, with good lighting and glasses or hearing aids in place",
      "The mind wanders during interesting, easy-to-hear material and in tasks that need neither hearing nor reading",
      "Restlessness, impulsivity and disorganisation that do not depend on hearing or sight",
      "Normal hearing test and eye test",
      "Symptoms present from early childhood and unchanged after hearing aids or new glasses",
      "Problems with time, losing things and forgetting appointments that sensory loss does not explain"
    ],
    favoursAlt: [
      "Problems mainly in background noise, in groups, on the phone, or with people who speak softly or turn away",
      "Asks people to repeat, turns the TV up, mishears words, relies on lip-reading or subtitles",
      "Tinnitus, ear infections, ear surgery, or long-term noise exposure (work, music, military service)",
      "Family history of early hearing loss",
      "Headaches, eye strain, squinting, blurring or double vision with reading or screens",
      "Holds text very close or far away, or reading problems appear mainly when tired",
      "Clear improvement with hearing aids, captions, front seating, glasses or better lighting",
      "Onset or worsening in adulthood, or a gradual decline with age",
      "Past exposure to ototoxic medicines (for example aminoglycoside antibiotics or cisplatin)",
      "Abnormal audiogram or eye examination"
    ],
    ask: [
      "Is it harder to follow people in a noisy place, in a group or on the phone than face to face in a quiet room?",
      "Do you often ask people to repeat themselves, or do others say you have the TV too loud?",
      "Do you find yourself watching people's lips, or using subtitles to follow?",
      "Do you get ringing or buzzing in your ears? Have you had ear infections, ear surgery or a burst eardrum?",
      "Have you worked with loud noise, played in bands, or been around gunfire or heavy machinery?",
      "In a quiet room, one-to-one, with nothing else going on, does your mind still drift off?",
      "When you read, do you get headaches, sore eyes, blurring, double vision, or the words seeming to move?",
      "Do you lose your place on the page or reread lines? Is it the same when someone reads to you or with audiobooks?",
      "When did you last have an eye test and a hearing test? Do you need glasses or hearing aids, and do you wear them?",
      "Does your attention improve with glasses, captions, sitting at the front or better lighting?",
      "As a child, were there concerns about your hearing or speech, glue ear or grommets?",
      "Do the restlessness, impulsivity and disorganisation also happen where hearing and sight do not matter?",
      "Does anyone in your family have hearing loss that started early?",
      "(To an informant) Does it look as if they did not hear you, or as if they heard and then drifted away?"
    ],
    features: [
      { id: "sensory_noise", t: "Difficulty mainly in noisy settings, groups or on the phone", w: 2 },
      { id: "sensory_repeat", t: "Frequently asks for repetition, mishears words or turns up the volume", w: 2 },
      { id: "sensory_ear", t: "Tinnitus, ear disease or long-term noise exposure", w: 1 },
      { id: "sensory_reading", t: "Headaches, eye strain, blurred or double vision with reading or screens", w: 2 },
      { id: "sensory_aids", t: "Clear improvement with hearing aids, captions, glasses or better lighting", w: 3 },
      { id: "sensory_quiet", t: "Attention is normal in quiet one-to-one settings with aids in place", w: 3 },
      { id: "sensory_onset", t: "Problems began or worsened in adulthood or with age", w: 2 },
      { id: "sensory_test", t: "Abnormal audiogram or eye examination", w: 3 },
      { id: "sensory_nonuse", t: "Prescribed glasses or hearing aids are not being worn", w: 1 },
      { id: "sensory_child", t: "Childhood glue ear, grommets or speech delay linked to hearing", w: 1 },
      { id: "sensory_isolated", t: "No restlessness, impulsivity or organisational problems beyond tasks that depend on hearing or sight", w: 2 }
    ],
    screen: [],
    investigations: [
      "Hearing assessment: the GP checks for wax or infection, then refers to audiology if hearing difficulty is suspected (NICE NG98).",
      "Sight test with an optometrist, including binocular vision if reading causes strain, losing place or double vision.",
      "Observe in the interview: does the person watch your lips, lean in, or answer a different question? Repeat key questions facing them in a quiet room.",
      "Difficulty hearing in noise with a normal audiogram: discuss with audiology, and remember that ADHD, language disorder and anxiety also affect listening in noise (clinical practice).",
      "In adults with suspected or diagnosed dementia or mild cognitive impairment, NICE NG98 1.1.9 advises considering referral to audiology for a hearing assessment.",
      "If sensory loss was significant, re-rate the interview items after correction."
    ],
    redFlags: [
      "Sudden hearing loss developing over 3 days or less in the past 30 days: immediate referral, to be seen within 24 hours by ENT or the emergency department (NICE NG98).",
      "Hearing loss with facial weakness or other new neurological signs: immediate referral (NICE NG98).",
      "Hearing loss or tinnitus in one ear only, or with vertigo: refer to ENT or audiovestibular medicine (NICE NG98).",
      "Sudden loss of vision, loss of part of the visual field, a painful red eye or new double vision: same-day eye or medical assessment.",
      "Visual or hearing change with headache, vomiting or other neurological signs: urgent medical assessment."
    ],
    decide: {
      better: "Sensory impairment better explains the picture when the 'inattention' happens mainly in tasks that depend on hearing or sight, resolves with good conditions or correction, and there is no wider or childhood pattern of ADHD.",
      both: "Diagnose both when ADHD symptoms are present in quiet, well-lit, one-to-one settings with aids in place, date from childhood, and include organisational, restless or impulsive problems that the sensory loss cannot explain.",
      next: "Arrange hearing and eye tests early, correct what can be corrected, and re-rate the symptoms with aids in place. Record the results in the report."
    },
    pearls: [
      "Ask: 'Did they not hear, or hear and drift away?' The answer often separates the two.",
      "Rule sensory problems out early. They are quick to test and often easy to correct (clinical practice).",
      "Adapt the interview: face the person, cut background noise and check understanding. NICE NG87 1.4.5 asks clinicians to tailor information to sight and hearing needs.",
      "Long-term noise exposure in musicians, factory workers and military veterans causes gradual hearing loss that can be mistaken for late-recognised inattention.",
      "In older adults, hearing loss and cognitive decline often occur together; check hearing before attributing poor attention to ADHD or dementia.",
      "Binocular vision problems such as convergence insufficiency cause reading discomfort and losing place, and a basic acuity check can miss them. Ask the optometrist to look for them."
    ],
    refs: [
      "CADDRA Canadian ADHD Practice Guidelines 4.1: medical mimics (hearing or vision loss)",
      "AADPA Australian ADHD guideline (2022), 2.2.2 (hearing or vision impairment)",
      "DSM-5-TR ADHD criterion A note: not solely failure to understand tasks or instructions (paraphrased)",
      "NICE NG98 Hearing loss in adults: assessment and management (2018)",
      "NICE NG87 1.4.5 (tailor information to sight or hearing needs)"
    ]
  },
  {
    id: "meds",
    name: "Effects of prescribed and over-the-counter medicines and caffeine (sedation, activation, akathisia)",
    group: "medical",
    core: false,
    icd11: "No single code. Psychoactive medicines and caffeine: the substance-induced disorder codes in 6C40-6C4H (for example 6C44 sedatives, hypnotics or anxiolytics; 6C48 caffeine; 6C4E other specified psychoactive substances, including medications). Other medicines: NE60 (harmful effects of drugs, medicaments or biological substances, not elsewhere classified)",
    summary: "Many prescribed and over-the-counter medicines cause ADHD-like symptoms. Sedating medicines cause slowing, poor concentration and forgetfulness; activating medicines and caffeine cause restlessness, irritability and poor sleep; antipsychotics, some anti-sickness medicines and some antidepressants cause akathisia, an unpleasant inner urge to move. The symptoms start with the medicine or a dose change and ease when it is reduced or stopped.",
    prevalence: "No reliable figure in adults with ADHD was found. ICD-11 names carbamazepine, valproate, risperidone, bronchodilators and thyroid replacement; DSM-5-TR names bronchodilators, isoniazid, antipsychotics (through akathisia) and thyroid replacement; AADPA adds levetiracetam, decongestants, asthma medicines and caffeine. The risk rises with the number of medicines, so it is highest in older adults and people with several conditions (clinical practice).",
    coexist: "sometimes",
    coexistNote: "ADHD can be diagnosed in someone taking these medicines if ADHD symptoms predate the medicine, from childhood, and persist during periods off it or on a stable dose. DSM-5-TR says ADHD-like symptoms caused by a medicine are recorded as a substance- or medication-induced condition, not ADHD. ICD-11 says the order of onset and persistence without the medicine are the key tests, so a full medicine timeline is essential (clinical practice).",
    overlap: [
      "Poor concentration and slowed thinking (sedating medicines)",
      "Forgetfulness and word-finding problems",
      "Restlessness, fidgeting and feeling driven (activating medicines, caffeine)",
      "Inner restlessness and inability to sit still (akathisia)",
      "Irritability and emotional lability",
      "Difficulty getting to sleep",
      "Low motivation and apathy (for example with some antidepressants)",
      "Daytime sleepiness"
    ],
    favoursADHD: [
      "Symptoms present since childhood, before any regular medicine",
      "Symptoms were the same during periods off the medicine",
      "No change in symptoms when the medicine was started, increased, reduced or stopped",
      "A pervasive pattern of disorganisation and impulsivity, not only sedation or restlessness",
      "Restlessness is general fidgeting and a need for stimulation, not a distressing urge to move",
      "Informants who knew the person before the medicine describe the same pattern"
    ],
    favoursAlt: [
      "Symptoms began within days to weeks of starting a medicine or increasing the dose",
      "Symptoms ease when the dose is reduced or the medicine is stopped, and return if it is restarted",
      "Inner tension with an urge to move, pacing or shifting from foot to foot after an antipsychotic, metoclopramide, prochlorperazine or an SSRI (akathisia)",
      "Sedation, slowing and memory problems with benzodiazepines, Z-drugs, opioids, gabapentin or pregabalin, sedating antihistamines or anticholinergic medicines",
      "Cognitive slowing or word-finding difficulty after topiramate or other anti-seizure medicines",
      "Restlessness, tremor and poor sleep with salbutamol or theophylline, oral steroids, decongestants such as pseudoephedrine, or too much levothyroxine",
      "High caffeine intake (energy drinks, many coffees), or headaches and fog when caffeine is missed",
      "Apathy and emotional blunting since starting an SSRI",
      "Several medicines with anticholinergic effects, especially in older adults",
      "Online 'focus' products, weight-loss products or pre-workout supplements containing stimulants",
      "Sleep disturbance, agitation, or new attention or memory problems since starting montelukast (MHRA neuropsychiatric warning)",
      "Symptoms rise and fall with the timing of doses"
    ],
    ask: [
      "Please list every medicine you take: prescribed, bought over the counter or online, herbal remedies and supplements, inhalers and contraception.",
      "When did the concentration problems or restlessness start? Had you just started, stopped or changed a medicine?",
      "Have you ever been off this medicine? Were the problems still there then?",
      "Do the symptoms get better or worse at certain times after a dose?",
      "Do you feel an inner restlessness, as if you must keep moving, that is unpleasant and different from your usual fidgetiness?",
      "Do any of your medicines make you drowsy, slowed down or foggy?",
      "Do you take sleeping tablets, painkillers such as codeine, tramadol, gabapentin or pregabalin, or allergy tablets that make you sleepy?",
      "Do you use a reliever inhaler often, take montelukast, or have you had courses of steroid tablets recently?",
      "How many cups of coffee or tea, cans of cola or energy drinks do you have a day? What happens if you miss them?",
      "Do you take decongestants, weight-loss products, pre-workout supplements or anything sold to improve focus?",
      "Have you ever taken someone else's ADHD medicine or bought stimulants online?",
      "Are you on lithium, an anti-seizure medicine or an antipsychotic? Did your thinking change when it was started?",
      "Has a doctor recently changed your thyroid tablets or steroid dose?",
      "(Older adults) How many different medicines do you take? When were they last reviewed?",
      "Did you have the same problems at school, before you took any regular medicine?",
      "(To an informant) Did they change when the medicine was started?"
    ],
    features: [
      { id: "meds_timing", t: "Symptoms started or worsened within weeks of starting or increasing a medicine", w: 3 },
      { id: "meds_dechallenge", t: "Symptoms eased when the medicine was reduced or stopped, and returned on restarting", w: 3 },
      { id: "meds_akathisia", t: "Akathisia: a distressing inner urge to move after an antipsychotic, anti-sickness medicine or antidepressant", w: 3 },
      { id: "meds_sedative", t: "Regular sedating medicines: benzodiazepines, Z-drugs, opioids, gabapentinoids or sedating antihistamines", w: 2 },
      { id: "meds_anticholinergic", t: "High anticholinergic burden (several anticholinergic medicines), especially over 65", w: 2 },
      { id: "meds_asm", t: "Anti-seizure medicine with cognitive effects (for example topiramate, phenobarbital, valproate, carbamazepine, levetiracetam)", w: 2 },
      { id: "meds_activating", t: "Activating medicines: beta-agonist inhalers, theophylline, oral steroids, decongestants or excess levothyroxine", w: 2 },
      { id: "meds_caffeine", t: "High caffeine intake or stimulant-containing supplements", w: 1 },
      { id: "meds_ssri", t: "Apathy or emotional blunting since starting an SSRI", w: 1 },
      { id: "meds_dose", t: "Symptoms rise and fall with dose timing", w: 2 },
      { id: "meds_nochild", t: "No childhood ADHD history before the medicine", w: 2 },
      { id: "meds_nonprescribed", t: "Non-prescribed stimulant or sedative use, including other people's ADHD medicine", w: 1 }
    ],
    screen: ["auditc", "dast10"],
    investigations: [
      "Medicine reconciliation: GP record, repeat prescriptions, pharmacy records and the person's own list, including over-the-counter and online products (NICE NG5).",
      "Draw a medicine timeline (starts, dose changes, stops) against the symptom timeline.",
      "In older adults or people on several medicines, estimate the anticholinergic burden with a published scale (clinical practice).",
      "If akathisia is suspected, rate it (for example with the Barnes Akathisia Rating Scale) and discuss with the prescriber.",
      "Where safe, agree a planned dose reduction, switch or timing change with the prescriber, then re-rate the symptoms. Never stop anti-seizure medicines, lithium, antipsychotics, benzodiazepines or opioids abruptly.",
      "Drug levels where useful (for example lithium, anti-seizure medicines, theophylline).",
      "Urine drug screen, with consent, if non-prescribed substances are suspected."
    ],
    redFlags: [
      "Severe akathisia with agitation or suicidal thoughts: urgent review, as akathisia is linked to suicidal and aggressive behaviour.",
      "Confusion, fever, rigidity, sweating or a fast heart rate on antipsychotic or serotonergic medicines: emergency (possible neuroleptic malignant syndrome or serotonin syndrome).",
      "Signs of toxicity, such as tremor, vomiting, unsteadiness or confusion on lithium, or double vision and unsteadiness on anti-seizure medicines: same-day levels and review.",
      "Do not advise stopping prescribed medicines abruptly; withdrawal can cause seizures, relapse or withdrawal syndromes.",
      "Possible misuse or diversion of stimulants or sedatives: risk and safeguarding assessment."
    ],
    decide: {
      better: "A medicine better explains the picture when the symptoms began with the medicine or a dose change, ease when it is reduced or stopped, and there is no childhood ADHD history. Record a medication-induced condition and discuss alternatives with the prescriber; do not diagnose ADHD.",
      both: "Diagnose ADHD as well when childhood-onset ADHD symptoms predate the medicine and persist at a clinically significant level during periods off it or on a stable, well-tolerated dose. Name any medicine that is making the picture worse.",
      next: "Do a full medicine and supplement review, draw the timeline, and agree with the prescriber whether a safe dose change, switch or timing change is possible before concluding. Re-rate the symptoms afterwards, and include caffeine and supplements in the advice."
    },
    pearls: [
      "Ask about everything the person takes. Inhalers, creams, contraception, supplements, energy drinks and online products are often left out.",
      "Akathisia is easily mistaken for hyperactivity. Ask about an unpleasant inner urge to move that began with an antipsychotic, anti-sickness medicine or antidepressant.",
      "Sedating medicines prescribed for anxiety, sleep or pain (benzodiazepines, pregabalin, gabapentin, opioids, promethazine) produce a slowed, foggy inattention that can look like the inattentive presentation.",
      "In someone already on ADHD medicine, irritability and restlessness as a dose wears off (rebound) can be mistaken for symptoms; ask about timing.",
      "Caffeine is the commonest activating substance. A high intake causes restlessness, anxiety and poor sleep, and missing it causes headache, tiredness and poor concentration.",
      "In older adults, a high anticholinergic burden is a common and reversible cause of poor attention and memory.",
      "Improvement after stopping a medicine supports 'better explained by'. A good response to a stimulant does not confirm ADHD."
    ],
    refs: [
      "ICD-11 CDDR 6A05: boundary with substance use and prescribed medicines (carbamazepine, valproate, risperidone, bronchodilators, thyroid replacement)",
      "DSM-5-TR ADHD differential diagnosis: medication-induced symptoms of ADHD (paraphrased)",
      "AADPA Australian ADHD guideline (2022), 2.2.2 and narrative (levetiracetam, decongestants, asthma medicines, caffeine)",
      "CADDRA Canadian ADHD Practice Guidelines 4.1 (cognitive dulling with mood stabilisers; activation with decongestants and beta-agonists)",
      "NICE NG5 Medicines optimisation (2015)",
      "MHRA Drug Safety Update: montelukast and neuropsychiatric reactions",
      "Rapoport JL et al. Dextroamphetamine: cognitive and behavioral effects in normal prepubertal boys. Science 1978;199:560-563 (stimulant response is not diagnostic)"
    ]
  },
  {
    id: "menopause",
    name: "Perimenopause and menopause",
    group: "medical",
    core: false,
    icd11: "GA30 (menopausal or certain specified perimenopausal disorders); GA30.0 (menopause); GA30.6 (premature ovarian failure)",
    summary: "Perimenopause often brings brain fog, forgetfulness, word-finding problems, poor concentration, irritability, anxiety, low mood and sleep broken by night sweats. These are new or clearly worse from the late 30s to the 50s, alongside changes in periods and hot flushes. Perimenopause can also unmask or worsen existing ADHD, so it is a common point for a first ADHD assessment; the same applies to trans men and non-binary people who go through the menopause.",
    prevalence: "In an Icelandic population cohort of 5,392 women aged 35-55, 54.2% of women with self-reported ADHD had severe perimenopausal symptoms on the Menopause Rating Scale, against 30.1% of women without ADHD (prevalence ratio 1.80, 95% CI 1.64-1.98); the gap was largest at ages 35-39 (Jakobsdóttir Smári et al. 2025). In a Dutch clinic sample of 209 women with ADHD (no control group), 45% reported symptoms suggestive of premenstrual dysphoric disorder and 57% of those who had given birth recalled postnatal depression symptoms (Dorani et al. 2021).",
    coexist: "yes",
    coexistNote: "Menopause is a life stage, not an exclusion. ADHD can be diagnosed if ADHD symptoms were present from childhood and impairing before perimenopause, even if they became much worse with it. If the symptoms are entirely new in midlife with no earlier history, the menopause transition (and any sleep, mood or medical problem) explains them better than ADHD. The expert consensus on girls and women notes that ADHD symptoms may be worsened by hormonal changes in the menstrual cycle, pregnancy and menopause (Young 2020).",
    overlap: [
      "Brain fog, forgetfulness and losing words",
      "Poor concentration and difficulty finishing tasks",
      "Irritability, low frustration tolerance and mood swings",
      "Anxiety and feeling overwhelmed",
      "Poor sleep and daytime fatigue (night sweats, early waking)",
      "Low mood and loss of motivation",
      "Disorganisation at work and at home",
      "Loss of confidence at work"
    ],
    favoursADHD: [
      "Clear inattention or hyperactivity-impulsivity from primary school, before puberty",
      "Long-standing impairment in education, work, money or relationships well before the late 30s",
      "Coping strategies that worked until midlife and then failed as hormones and demands changed",
      "A lifelong baseline of symptoms that also worsened premenstrually or after childbirth",
      "First-degree relatives with ADHD, often a child diagnosed recently",
      "Symptoms persist on effective HRT once sleep and hot flushes are controlled",
      "Childhood school reports describe daydreaming, chatting, disorganisation or not working to potential"
    ],
    favoursAlt: [
      "Onset in the late 30s to 50s with no meaningful earlier history",
      "Changes in cycle length or flow, or missed periods",
      "Hot flushes, night sweats and palpitations",
      "Sleep broken by night sweats or early waking, with daytime fog",
      "Joint aches, vaginal dryness, urinary symptoms or reduced libido",
      "Concentration returns fully to a previously good level once HRT or other treatment controls hot flushes and sleep",
      "Forgetfulness is mainly for words and names, not a lifelong pattern of losing things and running late",
      "Menopause brought on by surgery, chemotherapy or hormone-suppressing treatment at the time the symptoms began",
      "Periods stopped before 40 (possible premature ovarian insufficiency)",
      "Informants describe a recent change in a previously well-organised, capable person"
    ],
    ask: [
      "Were concentration and organisation always a struggle, or is this new in the last few years?",
      "What were your school reports like? Did teachers say you daydreamed, chatted or did not work to your potential?",
      "Have your periods changed: shorter or longer cycles, heavier, lighter or missed?",
      "Do you get hot flushes or night sweats? How many times a night do you wake?",
      "After a good night's sleep, is the brain fog better?",
      "Is the forgetfulness mostly losing words and names, or have you always lost keys, missed appointments and run late?",
      "Did your mood or concentration get worse before periods, after having a baby, or on hormonal contraception?",
      "Have you had an operation that removed your ovaries, or treatment that stopped your periods, such as chemotherapy or hormone blockers?",
      "Are you taking HRT? Did your concentration change when you started it or when the dose changed?",
      "What else has changed in your life at the same time, such as caring for children or parents, or a more demanding job?",
      "Have you had low mood, loss of interest or anxiety that is new for you?",
      "Does anyone in your family have ADHD? Has one of your children been diagnosed recently?",
      "What helped you cope in your 20s and 30s, and has that stopped working?",
      "(To a parent or sibling) What were they like as a child?",
      "(To a partner) Is this a recent change, or have you always seen these difficulties?"
    ],
    features: [
      { id: "menopause_newonset", t: "Symptoms began in midlife with no convincing childhood or early-adult history", w: 3 },
      { id: "menopause_cycle", t: "Changes in menstrual cycle in the same period as the cognitive symptoms", w: 2 },
      { id: "menopause_vasomotor", t: "Hot flushes or night sweats", w: 2 },
      { id: "menopause_sleep", t: "Sleep broken by night sweats or early waking, with daytime fog that tracks sleep", w: 2 },
      { id: "menopause_hrt", t: "Concentration returns fully to a previously good level once menopausal symptoms are treated (improvement alone does not exclude ADHD, which can also improve)", w: 2 },
      { id: "menopause_words", t: "Mainly word-finding and name recall problems rather than lifelong disorganisation", w: 1 },
      { id: "menopause_induced", t: "Surgical or treatment-induced menopause, or premature ovarian insufficiency, at the time of onset", w: 2 },
      { id: "menopause_informant", t: "Informants describe a recent change in a previously well-organised person", w: 3 },
      { id: "menopause_mood", t: "New-onset anxiety or depressive symptoms in perimenopause", w: 1 },
      { id: "menopause_other", t: "Other menopausal symptoms: joint aches, genitourinary symptoms, reduced libido", w: 1 }
    ],
    screen: ["phq9", "gad7", "isi"],
    investigations: [
      "Diagnose perimenopause or menopause clinically in people over 45 with typical symptoms; an FSH test is not needed (NICE NG23).",
      "Consider an FSH test at age 40-45 with menopausal symptoms, and investigate suspected premature ovarian insufficiency under 40 (NICE NG23).",
      "Thyroid function if the picture is atypical: NICE NG145 warns that thyroid symptoms may be mistaken for menopause.",
      "FBC and ferritin if periods are heavy.",
      "Screen mood, anxiety and sleep (see the depression, anxiety and insomnia entries).",
      "Refer to the GP or a menopause service to discuss HRT and other treatments (NICE NG23), then re-rate the ADHD symptoms once hot flushes and sleep are controlled.",
      "A symptom and cycle diary over 2-3 months helps link symptoms to hormonal change (clinical practice)."
    ],
    redFlags: [
      "Bleeding after the menopause, or persistent bleeding between periods or after sex: urgent gynaecology referral on a suspected cancer pathway.",
      "Periods stopping before 40: investigate for premature ovarian insufficiency (NICE NG23).",
      "Severe depression or suicidal thoughts in perimenopause: assess risk today.",
      "Progressive memory decline with loss of everyday function: assess for a neurocognitive disorder (see the mild cognitive impairment entry)."
    ],
    decide: {
      better: "The menopause transition better explains the picture when the cognitive and emotional symptoms began in midlife with menstrual change and hot flushes, there is no childhood or early-adult history, informants describe a recent change, and the symptoms resolve once hot flushes and sleep are treated.",
      both: "Diagnose ADHD when there is a credible lifelong pattern, with childhood symptoms and earlier impairment, that perimenopause has worsened or unmasked. Record the menopause transition as an aggravating factor.",
      next: "Take a careful lifelong history with childhood informants and school reports, and refer for menopause assessment and treatment where appropriate. If the childhood history is weak, re-rate once menopausal symptoms are treated; if it is strong, proceed with the ADHD diagnosis and plan."
    },
    pearls: [
      "Do not dismiss a midlife referral as 'just the menopause', and do not diagnose ADHD on midlife symptoms alone. The childhood history decides.",
      "Many women present when a child is diagnosed or when coping strategies fail in perimenopause. High effort and structure may have hidden lifelong symptoms; ask what it cost them to cope.",
      "Women with ADHD report high rates of premenstrual dysphoric disorder and recalled postnatal depression symptoms (Dorani 2021, uncontrolled clinic sample). Ask about earlier hormone-linked mood changes: a lifelong baseline with premenstrual and postnatal worsening points to ADHD aggravated by hormones.",
      "Sleep is often the hidden link: night sweats fragment sleep, and sleep loss alone impairs attention.",
      "Perimenopausal symptoms can start in the late 30s. The Icelandic cohort found the largest excess in women with ADHD at 35-39, which the authors read as earlier onset (Jakobsdóttir Smári 2025; ADHD was self-reported).",
      "Thyroid disease and iron deficiency are common at the same age; test if the picture is atypical.",
      "For women already diagnosed, review ADHD treatment during and after hormonal transitions (Young 2020)."
    ],
    refs: [
      "Young S et al. Females with ADHD: an expert consensus statement taking a lifespan approach. BMC Psychiatry 2020;20:404",
      "Jakobsdóttir Smári U et al. Perimenopausal symptoms in women with and without ADHD: a population-based cohort study. Eur Psychiatry 2025;68:e133",
      "Dorani F et al. Prevalence of hormone-related mood disorder symptoms in women with ADHD. J Psychiatr Res 2021;133:10-15",
      "NICE NG23 Menopause: identification and management (updated 2024)",
      "NICE NG145 Thyroid disease (thyroid symptoms may be mistaken for menopause)"
    ]
  },
  {
    id: "postviral",
    name: "Post-COVID-19 condition (long COVID), ME/CFS and other post-viral fatigue",
    group: "medical",
    core: false,
    icd11: "RA02 (post COVID-19 condition); 8E49 (postviral fatigue syndrome, including ME/CFS)",
    summary: "After COVID-19 or another infection such as glandular fever, some people develop persistent fatigue, brain fog, poor concentration, memory and word-finding problems, unrefreshing sleep and symptoms that worsen after exertion. The onset is dated to the infection and is a change from the usual self. ME/CFS is marked by post-exertional symptom exacerbation, which is not a feature of ADHD.",
    prevalence: "No reliable figure for adults with ADHD was found. NICE NG188 lists cognitive impairment ('brain fog', loss of concentration or memory problems) among the common neurological symptoms of post-COVID-19 syndrome, which it defines as symptoms continuing for more than 12 weeks after the infection and not explained by another diagnosis (ongoing symptomatic COVID-19 covers 4-12 weeks).",
    coexist: "sometimes",
    coexistNote: "Both can be present. ADHD requires childhood onset and persistence beyond the post-viral illness; new attention problems that began with an infection belong to the post-viral condition. Pre-existing ADHD can be worsened by post-viral fatigue, and the extra load can bring it to clinical attention for the first time.",
    overlap: [
      "Poor concentration and brain fog",
      "Forgetfulness and word-finding problems",
      "Difficulty starting and finishing tasks",
      "Mental fatigue with sustained effort",
      "Poor sleep and daytime tiredness",
      "Irritability, low mood and anxiety",
      "Falling work performance and sickness absence"
    ],
    favoursADHD: [
      "Symptoms present since childhood, long before the infection",
      "Attention is much better for interesting tasks, which can hold focus for hours",
      "Restlessness and a need for stimulation rather than exhaustion",
      "Activity improves concentration rather than causing a crash",
      "No post-exertional worsening",
      "Childhood informants describe the same pattern"
    ],
    favoursAlt: [
      "Onset dated to a confirmed or probable infection (COVID-19, glandular fever, influenza)",
      "A delayed crash after physical or mental effort, out of proportion to the effort, with slow recovery (post-exertional symptom exacerbation)",
      "Unrefreshing sleep despite enough hours",
      "Dizziness, palpitations or a racing heart on standing (orthostatic intolerance, including POTS)",
      "Breathlessness, chest symptoms, or loss of smell or taste after COVID-19",
      "Muscle or joint pain, sore throat, tender glands or flu-like malaise",
      "A previously high-functioning person with a clear before-and-after change",
      "Fatigue dominates and is not relieved by rest",
      "All four NICE NG206 core features (debilitating fatigue, post-exertional symptom exacerbation, unrefreshing sleep, cognitive difficulties) persisting for 6 weeks or more",
      "Symptoms fluctuate with energy use rather than with interest"
    ],
    ask: [
      "Can you date when the concentration problems started? Was there an illness around that time?",
      "Before that illness, how was your concentration at school and at work?",
      "After a busy day or a hard mental task, do you crash later, even the next day or two? How long does it take to recover?",
      "Does activity make you feel better and more focused, or worse?",
      "Do you wake refreshed after a full night's sleep?",
      "Do you feel dizzy or faint, or get a racing heart, when you stand up or stand for long?",
      "Since the infection, have you had breathlessness, chest pain, loss of smell or taste, or muscle pains?",
      "Is your concentration better for interesting tasks, or poor for everything because your energy has gone?",
      "Can you do less physical activity than before the illness?",
      "Has your mood changed since the illness? Do you worry about your health?",
      "Have you been able to keep working? What changes have you needed?",
      "Have you had blood tests, or been seen by a long COVID or ME/CFS service?",
      "As a child, were you restless, distractible or disorganised?",
      "(To an informant) Was this a change after the illness, or have they always been like this?"
    ],
    features: [
      { id: "postviral_onset", t: "Onset dated to a confirmed or probable viral infection", w: 3 },
      { id: "postviral_pem", t: "Post-exertional symptom exacerbation (delayed crash after effort with prolonged recovery)", w: 3 },
      { id: "postviral_sleep", t: "Unrefreshing sleep despite adequate sleep time", w: 1 },
      { id: "postviral_orthostatic", t: "Orthostatic intolerance (dizziness or tachycardia on standing)", w: 2 },
      { id: "postviral_physical", t: "Other post-infective symptoms: breathlessness, chest pain, loss of smell, muscle pain, sore throat", w: 2 },
      { id: "postviral_premorbid", t: "Good pre-illness functioning with no childhood ADHD history", w: 3 },
      { id: "postviral_fatigue", t: "Fatigue dominates, with reduced physical capacity", w: 2 },
      { id: "postviral_global", t: "Concentration is poor for all tasks regardless of interest", w: 1 },
      { id: "postviral_informant", t: "Informants describe a clear change after the illness", w: 2 },
      { id: "postviral_course", t: "Symptoms improve gradually or fluctuate with energy use rather than with demands", w: 1 },
      { id: "postviral_ng206", t: "Meets the NICE NG206 picture for suspected ME/CFS: all four core features for 6 weeks or more", w: 3 }
    ],
    screen: ["phq9", "gad7"],
    investigations: [
      "Assessment through the GP or a post-COVID or ME/CFS service: history, examination and tests to exclude other causes (NICE NG188; NICE NG206).",
      "NICE NG206: suspect ME/CFS when debilitating fatigue, post-exertional symptom exacerbation, unrefreshing sleep and cognitive difficulties have all persisted for at least 6 weeks in an adult; confirm the diagnosis in specialist care if they persist for 3 months.",
      "Blood and urine tests to exclude other causes of fatigue, as listed in NICE NG206 (for example FBC, ferritin, renal, liver and thyroid function, inflammatory markers, HbA1c, coeliac screening, creatine kinase).",
      "Lying and standing blood pressure and heart rate if there are postural symptoms (NICE NG188).",
      "Screen for depression, anxiety and sleep disorders.",
      "Neuropsychological testing only if cognitive deficits are severe or persistent and the result would change management.",
      "Re-rate the ADHD symptoms when the post-viral symptoms have stabilised or improved."
    ],
    redFlags: [
      "Chest pain, breathlessness at rest, fainting or palpitations after COVID-19: urgent medical assessment.",
      "Weight loss, night sweats, fever or enlarged lymph nodes: investigate for other causes.",
      "Severe or very severe ME/CFS (housebound or bedbound): specialist ME/CFS service (NICE NG206).",
      "Do not advise graded exercise therapy, or pushing through activity, for anyone with suspected or confirmed ME/CFS (NICE NG206).",
      "Severe depression or suicidal thoughts: assess risk today.",
      "New neurological signs: neurology referral."
    ],
    decide: {
      better: "The post-viral condition better explains the picture when attention and memory problems began with the infection in a previously well-functioning person, come with fatigue, post-exertional worsening or other post-infective symptoms, and there is no childhood history.",
      both: "Diagnose ADHD as well when childhood-onset ADHD is documented and was impairing before the infection. Record the post-viral condition as an added cause of current impairment.",
      next: "Refer to the GP or a post-COVID or ME/CFS service for assessment and management. Do not use an ADHD diagnosis to justify stimulants for post-viral fatigue (clinical practice). Reassess ADHD now only if there is a credible childhood history; otherwise wait for the post-viral course to settle."
    },
    pearls: [
      "Date the onset. A clear 'before the infection' and 'after the infection' is the strongest discriminator.",
      "Ask about the crash. Post-exertional symptom exacerbation is the hallmark of ME/CFS (NICE NG206) and is not part of ADHD.",
      "People with ADHD often feel better and more focused with activity; people with ME/CFS feel worse afterwards (clinical practice).",
      "Brain fog after infection is real and common (NICE NG188). It is not evidence of lifelong ADHD.",
      "Long COVID can unmask ADHD in someone who coped by over-working; the childhood history decides.",
      "Check for orthostatic intolerance (POTS), which worsens concentration when upright. UKAAN AQAS asks assessors to screen for chronic fatigue syndrome, fibromyalgia and dysautonomia."
    ],
    refs: [
      "NICE NG188 COVID-19 rapid guideline: managing the long-term effects of COVID-19 (NICE, SIGN and RCGP)",
      "NICE NG206 Myalgic encephalomyelitis (or encephalopathy)/chronic fatigue syndrome: diagnosis and management (2021)",
      "ICD-11 RA02 Post COVID-19 condition; 8E49 Postviral fatigue syndrome",
      "UKAAN Adult ADHD Assessment Quality Assurance Standard (AQAS, 2024): screen for common physical comorbidities, including chronic fatigue syndrome, fibromyalgia and dysautonomia"
    ]
  },
  {
    id: "mci",
    name: "Mild neurocognitive disorder (mild cognitive impairment) and early dementia, including frontotemporal dementia",
    group: "cognitive",
    core: false,
    icd11: "6D71 (mild neurocognitive disorder); 6D80-6D8Z (dementia)",
    summary: "Mild neurocognitive disorder is a decline from a previous level of cognition, shown on testing, that does not yet stop independent living; it may progress to dementia. It can look like ADHD because memory, attention and executive problems overlap, especially after 50. The key difference is decline from a previously higher level in mid or later life, whereas ADHD is lifelong; frontotemporal dementia can begin in the 50s with disinhibition, impulsivity and apathy that can be mistaken for late-presenting ADHD.",
    prevalence: "In a meta-analysis of older adults, ADHD prevalence was about 2.2% using validated rating scales (about 1.5% when limited to age 50 and over) but only about 0.2% by recorded clinical diagnosis (Dobrosavljevic 2020, cited in the WFADHD 2021 consensus); CADDRA gives about 3% in older adults. In an Israeli cohort of 109,218 people born 1933-1952, adult ADHD was associated with a higher risk of dementia (adjusted HR 2.77), with no clear excess in those treated with stimulants (Levine 2023); the reason for the association is not established.",
    coexist: "sometimes",
    coexistNote: "ICD-11 6D71 defines mild neurocognitive disorder as a decline from the person's previous level, confirmed by testing, so a stable lifelong profile does not meet it. DSM-5-TR says neurocognitive disorders are not known to be associated with ADHD but can look similar, and are distinguished by their late onset. Both can be diagnosed when a person with documented lifelong ADHD develops a new, measurable decline beyond their own baseline. A first presentation of ADHD in later life needs strong childhood evidence.",
    overlap: [
      "Forgetfulness, misplacing things and missed appointments",
      "Poor concentration and distractibility",
      "Difficulty planning, organising and multitasking",
      "Slower thinking and losing the thread of conversations",
      "Word-finding difficulty",
      "Irritability, impulsivity or disinhibition (especially frontotemporal dementia)",
      "Sleep problems, low mood and anxiety",
      "Worry about memory and fear of dementia"
    ],
    favoursADHD: [
      "A lifelong pattern, with childhood evidence from school reports or siblings",
      "A stable course over years, without progression",
      "Long-standing problems with time, money, jobs and relationships rather than a recent drop",
      "Memory difficulties are mainly not taking information in; it comes back with cues and is not lost",
      "Inattention varies with interest and structure",
      "Family history of ADHD rather than early-onset dementia",
      "Good insight into long-standing difficulties"
    ],
    favoursAlt: [
      "Clear decline from a previously higher level, usually after 50",
      "Progression over months to years, reported by informants",
      "Rapid forgetting of recent events, and repeating questions or stories",
      "Getting lost in familiar places, or new trouble with finances, cooking or technology that were managed well before",
      "New personality change, disinhibition, loss of empathy, apathy, compulsive behaviour or a change in food preferences (frontotemporal dementia)",
      "Visual hallucinations, fluctuating alertness, acting out dreams or parkinsonism (Lewy body disease)",
      "Vascular risk factors with stepwise decline or focal neurological signs",
      "Reduced insight, with the informant more worried than the patient",
      "Objective impairment on cognitive testing against age norms and premorbid level",
      "Family history of early-onset dementia",
      "Brain imaging shows atrophy or vascular change"
    ],
    ask: [
      "When did you first notice these problems? Were they there in your 20s and 30s?",
      "What were you like at school? Would a brother or sister recognise this from childhood?",
      "Is it getting worse? How does this year compare with two or three years ago?",
      "Do you forget conversations or events completely, even with reminders, or do they come back with a prompt?",
      "Do you repeat questions or stories without realising?",
      "Have you got lost in a familiar place, or had trouble with tasks you used to manage, like bills, cooking or a new phone?",
      "Have people said your personality has changed: more tactless, less caring, more impulsive, or less interested in things?",
      "Have your eating habits changed, such as a new sweet tooth or overeating?",
      "Do you act out your dreams in your sleep, see things that are not there, or have days when you are much more muddled than others?",
      "Have you had strokes or mini-strokes, high blood pressure, diabetes or heart disease?",
      "How much alcohol do you drink, and what medicines do you take, including sleeping tablets and painkillers?",
      "Has your hearing or eyesight changed?",
      "Have you been low, anxious or sleeping badly? Do you snore or stop breathing in your sleep?",
      "Has anyone in your family had dementia, especially before 65?",
      "Why are you seeking an assessment now? What has changed?",
      "(To an informant who has known them for many years) Is this the person you have always known, or a change? When did you first notice it?"
    ],
    features: [
      { id: "mci_decline", t: "Clear decline from a previously higher level of functioning", w: 3 },
      { id: "mci_lateonset", t: "Onset after age 50 with no childhood or early-adult history", w: 3 },
      { id: "mci_progressive", t: "Progression over months to years, confirmed by an informant", w: 3 },
      { id: "mci_amnesia", t: "Rapid forgetting of recent events, not helped by cues; repeating questions", w: 2 },
      { id: "mci_iadl", t: "New difficulty with complex daily tasks that were managed well before (finances, travel, technology)", w: 2 },
      { id: "mci_ftd", t: "New disinhibition, apathy, loss of empathy, compulsive behaviour or change in diet", w: 3 },
      { id: "mci_dlb", t: "Visual hallucinations, fluctuating cognition, REM sleep behaviour disorder or parkinsonism", w: 2 },
      { id: "mci_vascular", t: "Vascular risk factors with stepwise decline or focal neurological signs", w: 1 },
      { id: "mci_testing", t: "Objective impairment on cognitive testing against age norms and premorbid level", w: 2 },
      { id: "mci_insight", t: "Reduced insight, with the informant more concerned than the patient", w: 1 },
      { id: "mci_family", t: "Family history of early-onset dementia", w: 1 },
      { id: "mci_imaging", t: "Neuroimaging shows atrophy or vascular change consistent with the symptoms", w: 2 }
    ],
    screen: ["moca", "phq9", "auditc"],
    investigations: [
      "Brief cognitive testing with a validated instrument by a trained clinician, interpreted against age and education norms (MoCA requires training and certification).",
      "Exclude reversible causes through the GP or memory service as per NICE NG97 (blood tests including FBC, renal, liver and thyroid function, calcium, HbA1c, B12 and folate).",
      "Refer to a memory assessment service if mild cognitive impairment or dementia is suspected (NICE NG97).",
      "Neuropsychological assessment comparing current performance with estimated premorbid ability; repeat testing shows whether there is decline (clinical practice).",
      "Structural brain imaging through the memory service or neurology.",
      "Hearing assessment: NICE NG98 advises considering audiology referral in suspected or diagnosed dementia or mild cognitive impairment.",
      "Review medicines for anticholinergic and sedative load, and screen for depression, alcohol use and sleep apnoea.",
      "If uncertain, repeat cognitive assessment after 6-12 months (clinical practice)."
    ],
    redFlags: [
      "Decline over weeks to a few months: urgent neurology referral (consider autoimmune encephalitis, prion disease or a tumour).",
      "Acute confusion or attention that fluctuates over hours to days: treat as delirium until proven otherwise and arrange medical assessment today.",
      "Onset before 65 with personality change or disinhibition: specialist referral for possible frontotemporal dementia.",
      "Focal neurological signs, new headache, falls or seizures: urgent assessment (consider subdural haematoma, tumour or stroke).",
      "Safety concerns such as unsafe driving, cooking or finances, financial exploitation or self-neglect: act on risk and safeguarding."
    ],
    decide: {
      better: "A neurocognitive disorder better explains the picture when there is a measurable decline from a previously higher level, onset in mid or later life, progression, and no credible childhood history. Refer to a memory service and do not diagnose ADHD.",
      both: "Diagnose both only when lifelong ADHD is well documented and there is also a new decline beyond that baseline on history and repeated testing. Record the new decline separately.",
      next: "Get the earliest possible history from siblings, school reports and old records, screen cognition, exclude reversible causes, and refer to a memory assessment service if decline is likely. If uncertain, repeat cognitive testing after 6-12 months."
    },
    pearls: [
      "Lifelong or decline? An informant who knew the person at 20 is worth more than any test.",
      "People with ADHD often fear dementia when demands rise in midlife. Reassure only after a careful lifelong history and, if needed, testing.",
      "Older adults with ADHD often present after a life change such as retirement, bereavement or losing a partner who organised them. Ask what has changed.",
      "Frontotemporal dementia can start in the 50s with impulsivity, disinhibition and poor planning. A new 'ADHD-like' picture in midlife with personality change needs specialist assessment.",
      "Adult ADHD has been linked to a higher later risk of dementia (Levine 2023). Whether this reflects causation, shared risk factors or misclassification of ADHD as early cognitive decline is unclear (Callahan 2017).",
      "ICD-11 mild neurocognitive disorder needs a decline from the person's own previous level. A stable, lifelong executive profile should not be labelled MCI, so test results must be read against premorbid ability, not only age norms.",
      "Depression, alcohol, sleep apnoea, hearing loss and anticholinergic medicines are common reversible contributors at this age."
    ],
    refs: [
      "ICD-11 6D71 Mild neurocognitive disorder (decline from previous level, with objective evidence on testing)",
      "DSM-5-TR ADHD differential diagnosis: neurocognitive disorders are distinguished by late onset (paraphrased)",
      "Dobrosavljevic M et al. Prevalence of ADHD in older adults: a systematic review and meta-analysis. Neurosci Biobehav Rev 2020;118:282-289",
      "Faraone SV et al. The World Federation of ADHD International Consensus Statement. Neurosci Biobehav Rev 2021;128:789-818",
      "CADDRA Canadian ADHD Practice Guidelines 4.1, chapter 3: in older adults, distinguish ADHD from MCI or dementia with a longitudinal history",
      "AADPA Australian ADHD guideline (2022): testing for suspected cognitive decline or dementia",
      "Callahan BL et al. Adult ADHD: risk factor for dementia or phenotypic mimic? Front Aging Neurosci 2017;9:260",
      "Levine SZ et al. Adult ADHD and the risk of dementia. JAMA Netw Open 2023;6(10):e2338088",
      "NICE NG97 Dementia: assessment, management and support for people living with dementia and their carers (2018)",
      "NICE NG98 Hearing loss in adults: assessment and management (2018)"
    ]
  }
]);
