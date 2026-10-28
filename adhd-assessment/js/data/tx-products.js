/* tx-products: ADHD medicines (txDrugs) and the UK products a specialist prescribes (txProducts).
   Used by js/engine/treatment.js (AA.treatment) and the treatment steps: Choose and prescribe, Titration.
   Facts are the same as the main course (js/data-brands.js, js/data-titration.js, js/daybuilder.js), which
   were checked against emc SmPCs on 28 Oct 2026; SmPC rows re-read on emc on 25 Oct 2026 for this build.
   Doses are mg PER DAY (start, step, max, target); perDay = number of doses a day.
   SmPC maximum and BNF/BNFC off-label ceilings are kept apart: `bnf` holds only an off-label ceiling above
   the SmPC maximum (BNF/BNFC accessed 21 Oct 2026, not re-checked live).
   A missing start dose means the course has not checked it: the view must send the prescriber to the SmPC.
   dose.*.usualMax: the usual maximum when the SmPC allows a higher dose only in rare cases (dexamfetamine:
   usually 20 mg, 40 mg in rare cases). The engine's ladder stops at usualMax and the next-dose suggestion
   holds there; max stays the SmPC maximum for the rare specialist decision. Product-level `ci: [<txCautionId>]`: a contraindication of that product
   only (Medikinet XL and Ambinet XL with acid-suppressing medicines), on top of the drug's own `ci` list.
   Ids are stored in assessment records: never rename or reuse an id; add new items at the end.
   Sources: emc SmPCs (numbers and revision dates in each src); SPS "Prescribing and switching between
   modified-release methylphenidate" (updated 28 Aug 2025); MHRA Drug Safety Update (Sept 2022);
   NICE NG87 (2018, updated 2019; live text checked Oct 2026); BNF/BNFC (accessed 21 Oct 2026). */

AA.add('txDrugs', [
  {
    id: "mph",
    name: "Methylphenidate",
    cls: "Stimulant",
    cd: "Schedule 2 controlled drug (CD2 POM)",
    isCD: true,
    licence: {
      child: "Licensed from age 6. Each product has its own licence, maximum dose and food rules: check the product.",
      adult: "Licensed in adults only for some products: Concerta XL and the bioequivalent tablets (not Matoride XL), Kixel XL, the Ritalin XL-type capsules, Medikinet XL, Ambinet XL and Ritalin tablets. Equasym XL, Addepta XL, Tuzulby and Medikinet tablets are for children only. Matoride XL may continue into adulthood but must not be started in an adult."
    },
    ci: ["ci_glaucoma", "ci_phaeo", "ci_hyperthyroid", "ci_maoi", "ci_cvd", "ci_cerebro", "ci_depression", "ci_psychosis", "ci_personality", "ci_anorexia"],
    caution: ["ci_htn", "ci_tics", "ci_tourette", "ci_epilepsy", "ci_substance", "ci_decongestant", "ci_pregnancy", "ci_breastfeeding"],
    interactions: [
      { t: "MAOI now or in the last 14 days (non-selective, irreversible MAOIs)", level: "ci", src: "Methylphenidate SmPC section 4.3" },
      { t: "Clonidine: serious adverse events have been reported with the combination. Use together only as a specialist decision.", level: "caution", src: "Methylphenidate SmPC section 4.5" },
      { t: "May slow the breakdown of warfarin, phenytoin, phenobarbital, primidone, tricyclic antidepressants and SSRIs: check levels or effect when starting or changing the dose.", level: "caution", src: "Methylphenidate SmPC section 4.5" },
      { t: "Serotonergic medicines: stop at once if serotonin syndrome is suspected.", level: "caution", src: "Methylphenidate SmPC section 4.5" },
      { t: "Halogenated anaesthetics: do not take methylphenidate on the day of planned surgery.", level: "caution", src: "Methylphenidate SmPC section 4.4" },
      { t: "Decongestants and other medicines that raise blood pressure (pseudoephedrine, phenylephrine): avoid.", level: "caution", src: "Methylphenidate SmPC section 4.5" },
      { t: "Antihypertensives: methylphenidate may weaken their effect.", level: "caution", src: "Methylphenidate SmPC section 4.5" },
      { t: "Alcohol: abstinence is advised. In laboratory tests, alcohol above 10% made Concerta XL release faster.", level: "caution", src: "Concerta XL SmPC section 4.5" }
    ],
    se: ["se_appetite", "se_sleep", "se_headache", "se_gi", "se_cv", "se_chest", "se_anxiety", "se_mood", "se_suicidal", "se_psychosis", "se_tics", "se_seizure", "se_rebound", "se_growth"],
    trial: { weeks: 6, note: "A fair trial is 6 weeks at an adequate dose, titrated to the best tolerated dose, not a few weeks at the starting dose (NICE NG87 1.7.8, 1.7.12). The SmPCs add: stop if there is no improvement after suitable dose adjustment over about 1 month." },
    pregnancy: "Not recommended in pregnancy unless delaying treatment is a greater risk.",
    breastfeeding: "Decide whether to stop breastfeeding or not use methylphenidate.",
    notes: [
      "Prescribe modified-release methylphenidate by brand: products differ in release and are not all interchangeable.",
      "Switch within an SPS bioequivalent group at the same dose and quantity. Equasym XL is bioequivalent to no other product; Medikinet XL needs particular care.",
      "Restarting after a gap of up to 2 weeks: the same dose (SPS). Longer gaps: ask the specialist.",
      "Between methylphenidate and lisdexamfetamine there is no washout and no conversion factor: start the new medicine at its own starting dose (clinical practice).",
      "Priapism has been reported (SmPC section 4.4).",
      "Treatment should not and need not be indefinite: stop at least once a year to reassess (SmPC section 4.2).",
      "Should not be used in older people: safety and efficacy are not established (SmPC section 4.2)."
    ],
    src: [
      "Methylphenidate SmPCs on emc (Concerta XL emc 314, rev. 06/11/2025; Ritalin emc 15987 and Ritalin XL emc 15966, rev. 24.11.2025), sections 4.2–4.6",
      "NICE NG87 1.7.7, 1.7.11–1.7.13, 1.7.22",
      "SPS: prescribing and switching between modified-release methylphenidate (updated 28 Aug 2025)",
      "MHRA Drug Safety Update (Sept 2022): prescribe modified-release methylphenidate by brand"
    ]
  },
  {
    id: "lisdex",
    name: "Lisdexamfetamine",
    cls: "Stimulant (a prodrug of dexamfetamine)",
    cd: "Schedule 2 controlled drug (CD2 POM)",
    isCD: true,
    licence: {
      child: "Licensed from age 6 when the response to methylphenidate has been clinically inadequate.",
      adult: "Licensed in adults whose ADHD symptoms were present in childhood. Elvanse Adult has been discontinued: adults use Elvanse."
    },
    ci: ["ci_glaucoma", "ci_phaeo", "ci_hyperthyroid", "ci_maoi", "ci_cvd", "ci_htn"],
    caution: ["ci_depression", "ci_psychosis", "ci_anorexia", "ci_tics", "ci_tourette", "ci_epilepsy", "ci_substance", "ci_qt", "ci_renal", "ci_decongestant", "ci_pregnancy", "ci_breastfeeding"],
    interactions: [
      { t: "MAOI now or in the last 14 days", level: "ci", src: "Elvanse SmPC section 4.3" },
      { t: "Urinary acidifiers lower amfetamine levels; urinary alkalinisers raise them.", level: "caution", src: "Elvanse SmPC section 4.5" },
      { t: "Medicines that prolong the QT interval: use with caution.", level: "caution", src: "Elvanse SmPC sections 4.4–4.5" },
      { t: "Serotonergic medicines (SSRIs, SNRIs, tricyclics, tramadol): rare serotonin syndrome.", level: "caution", src: "Elvanse SmPC section 4.5" },
      { t: "Decongestants and other medicines that raise blood pressure: avoid.", level: "caution", src: "Elvanse SmPC section 4.5" },
      { t: "Antihypertensives: lisdexamfetamine may weaken their effect.", level: "caution", src: "Elvanse SmPC section 4.5" },
      { t: "Alcohol: the SmPC has only limited data. Advise keeping alcohol low: it can add to side effects.", level: "caution", src: "Elvanse SmPC section 4.5 (limited data); clinical practice (keep it low)" }
    ],
    se: ["se_appetite", "se_sleep", "se_headache", "se_gi", "se_cv", "se_chest", "se_anxiety", "se_mood", "se_suicidal", "se_psychosis", "se_tics", "se_seizure", "se_rebound", "se_growth"],
    trial: { weeks: 6, note: "A fair trial is 6 weeks at an adequate dose, titrated to the best tolerated dose (NICE NG87 1.7.13). The SmPC adds: stop if there is no improvement after 1 month of dose adjustment." },
    pregnancy: "Use in pregnancy only if the benefit justifies the risk.",
    breastfeeding: "Should not be used while breastfeeding.",
    notes: [
      "Also contraindicated: hypersensitivity to sympathomimetic amines, agitated states and advanced arteriosclerosis (SmPC section 4.3).",
      "Its slow conversion lowers, but does not remove, misuse potential: the SmPC warns of misuse and dependence.",
      "QTc prolongation is listed under warnings (SmPC section 4.4).",
      "Not interchangeable with methylphenidate or dexamfetamine tablets mg for mg."
    ],
    src: [
      "Elvanse SmPC (emc 14089, rev. 02/10/2026), sections 4.1–4.6",
      "NICE NG87 1.7.8, 1.7.9, 1.7.11–1.7.14"
    ]
  },
  {
    id: "dex",
    name: "Dexamfetamine",
    cls: "Stimulant",
    cd: "Schedule 2 controlled drug (CD2 POM)",
    isCD: true,
    licence: {
      child: "Licensed for ages 6 to 17 when the response to methylphenidate has been clinically inadequate. NICE places it after lisdexamfetamine, for a child who responds to lisdexamfetamine but cannot tolerate its longer effect (1.7.9): its licence does not cover that use.",
      adult: "Not licensed in adults: adult use is off-label. NICE: for an adult who responds to lisdexamfetamine but cannot tolerate its longer effect (1.7.14)."
    },
    ci: ["ci_glaucoma", "ci_phaeo", "ci_hyperthyroid", "ci_porphyria", "ci_maoi", "ci_cvd", "ci_htn", "ci_cerebro", "ci_depression", "ci_psychosis", "ci_personality", "ci_anorexia", "ci_tourette", "ci_substance"],
    caution: ["ci_tics", "ci_epilepsy", "ci_hepatic", "ci_renal", "ci_decongestant", "ci_pregnancy", "ci_breastfeeding"],
    interactions: [
      { t: "MAOI now or in the last 14 days", level: "ci", src: "Amfexa SmPC section 4.3" },
      { t: "Urinary acidifiers lower amfetamine levels; urinary alkalinisers raise them.", level: "caution", src: "Amfexa SmPC section 4.5" },
      { t: "Serotonergic medicines (SSRIs, SNRIs, tricyclics, tramadol): rare serotonin syndrome.", level: "caution", src: "Clinical practice (amfetamine class; Elvanse SmPC section 4.5)" },
      { t: "Decongestants and other medicines that raise blood pressure: avoid.", level: "caution", src: "Amfexa SmPC section 4.5" },
      { t: "Antihypertensives: dexamfetamine may weaken their effect.", level: "caution", src: "Amfexa SmPC section 4.5" },
      { t: "May slow the breakdown of coumarin anticoagulants (for example warfarin), phenobarbital, phenytoin, primidone, tricyclic antidepressants and SSRIs: their doses may need adjusting when dexamfetamine is started or stopped.", level: "caution", src: "Amfexa SmPC section 4.5" },
      { t: "Halogenated anaesthetics: risk of a sudden rise in blood pressure. Do not take dexamfetamine on the day of planned surgery.", level: "caution", src: "Amfexa SmPC section 4.5" },
      { t: "Alcohol: advise abstaining during treatment. It can make side effects worse.", level: "caution", src: "Amfexa SmPC section 4.5" }
    ],
    se: ["se_appetite", "se_sleep", "se_headache", "se_gi", "se_cv", "se_chest", "se_anxiety", "se_mood", "se_suicidal", "se_psychosis", "se_tics", "se_seizure", "se_rebound", "se_growth"],
    trial: { weeks: 6, note: "NICE uses 6-week trials at an adequate dose for the stimulants. The SmPC adds: stop if there is no improvement after a month of appropriate dose adjustment." },
    pregnancy: "Not recommended in pregnancy; stop when a pregnancy is planned.",
    breastfeeding: "Decide whether to stop breastfeeding or not use dexamfetamine.",
    notes: [
      "Also contraindicated: hyperexcitability (SmPC section 4.3).",
      "Immediate-release amfetamine: the highest misuse potential of the ADHD medicines.",
      "Reduce gradually when stopping. A drug-free trial at least once a year, ideally in the school holidays (SmPC section 4.2).",
      "Should not be used in older people (SmPC section 4.2)."
    ],
    src: [
      "Amfexa / Dexamfetamine Sulfate Medice SmPC (emc 102097, rev. 14/01/2026), sections 4.1–4.6",
      "NICE NG87 1.7.9, 1.7.14"
    ]
  },
  {
    id: "atx",
    name: "Atomoxetine",
    cls: "Non-stimulant (selective noradrenaline reuptake inhibitor)",
    cd: "Prescription-only medicine, not a controlled drug: usual prescription rules (valid 6 months; repeats and emergency supply allowed)",
    isCD: false,
    licence: {
      child: "Licensed from age 6.",
      adult: "Licensed in adults. ADHD symptoms present in childhood should be confirmed."
    },
    ci: ["ci_maoi", "ci_glaucoma_narrow", "ci_cvd", "ci_cerebro", "ci_phaeo"],
    caution: ["ci_glaucoma", "ci_htn", "ci_depression", "ci_psychosis", "ci_anorexia", "ci_epilepsy", "ci_hepatic", "ci_cyp2d6", "ci_qt", "ci_decongestant", "ci_pregnancy", "ci_breastfeeding"],
    interactions: [
      { t: "MAOI now or in the last 2 weeks. Do not start an MAOI within 2 weeks of stopping atomoxetine.", level: "ci", src: "Atomoxetine SmPC section 4.3" },
      { t: "Strong CYP2D6 inhibitors (fluoxetine, paroxetine, quinidine, terbinafine) raise exposure 6 to 8 times: titrate more slowly; a lower final dose may be needed. Re-check the response if the inhibitor is started or stopped. Known CYP2D6 poor metabolisers: consider a lower starting dose and slower titration. Bupropion is also a strong CYP2D6 inhibitor: check the BNF.", level: "caution", src: "Atomoxetine SmPC sections 4.2, 4.5" },
      { t: "Serotonergic medicines (SSRIs, SNRIs, triptans, opioids such as tramadol, tricyclic and tetracyclic antidepressants): higher risk of serotonin syndrome. Use with caution; know the symptoms (mental-state change, autonomic instability, neuromuscular signs, gastrointestinal symptoms) and reduce the dose or stop if it is suspected.", level: "caution", src: "Atomoxetine SmPC sections 4.4, 4.5" },
      { t: "Nebulised or intravenous salbutamol: stronger effects on heart rate and blood pressure.", level: "caution", src: "Atomoxetine SmPC section 4.5" },
      { t: "Medicines that lower the seizure threshold: use with caution.", level: "caution", src: "Atomoxetine SmPC section 4.5" },
      { t: "Medicines that prolong the QT interval: use with caution.", level: "caution", src: "Atomoxetine SmPC sections 4.4–4.5" },
      { t: "Decongestants and other medicines that raise blood pressure: avoid.", level: "caution", src: "Atomoxetine SmPC section 4.5" },
      { t: "Antihypertensives: atomoxetine may weaken their effect.", level: "caution", src: "Atomoxetine SmPC section 4.5" }
    ],
    se: ["se_appetite", "se_sleep", "se_headache", "se_gi", "se_cv", "se_chest", "se_anxiety", "se_mood", "se_suicidal", "se_psychosis", "se_seizure", "se_sexual", "se_liver", "se_sedation", "se_growth"],
    trial: { weeks: 6, note: "Benefit builds over several weeks. Judge it after an adequate trial at the maintenance dose (clinical practice: NICE sets 6-week trials for the stimulants)." },
    pregnancy: "Use in pregnancy only if the benefit justifies the risk.",
    breastfeeding: "Avoid while breastfeeding.",
    notes: [
      "Liver injury: stop if there is jaundice or laboratory evidence of liver injury, and never restart (SmPC section 4.4).",
      "Watch for suicidal thoughts, agitation and mood change, especially early in treatment (SmPC section 4.4).",
      "Heart rate and blood pressure rise meaningfully in about 6 to 12% of people (MHRA).",
      "Sexual dysfunction and priapism are listed in the SmPC; NICE asks for monitoring of sexual dysfunction (1.8.15).",
      "No withdrawal syndrome: stop at once for a serious side effect, otherwise taper. Reassess the need after 1 year (SmPC section 4.2).",
      "Poor CYP2D6 metabolisers (about 7% of white people) have much higher exposure."
    ],
    src: [
      "Atomoxetine SmPC (emc 10332, Zentiva, rev. 06/12/2024), sections 4.1–4.6",
      "MHRA Drug Safety Update (2012, 2014): atomoxetine and blood pressure and heart rate",
      "NICE NG87 1.7.10, 1.7.15, 1.8.15"
    ]
  },
  {
    id: "gxr",
    name: "Guanfacine",
    cls: "Non-stimulant (alpha-2A adrenergic agonist)",
    cd: "Prescription-only medicine, not a controlled drug: usual prescription rules (valid 6 months; repeats and emergency supply allowed)",
    isCD: false,
    licence: {
      child: "Licensed for ages 6 to 17 when stimulants are not suitable, not tolerated or have not worked.",
      adult: "Not licensed in adults: the SmPC says it should not be used. NICE: adults only with advice from a tertiary ADHD service (1.7.17)."
    },
    ci: [],
    caution: ["ci_hypotension", "ci_qt", "ci_cyp3a4_inh", "ci_cyp3a4_ind", "ci_cvd", "ci_depression", "ci_hepatic", "ci_renal", "ci_epilepsy", "ci_pregnancy", "ci_breastfeeding"],
    interactions: [
      { t: "Moderate or strong CYP3A4 inhibitors (clarithromycin, ketoconazole, grapefruit juice; the BNF also lists ciprofloxacin): halve the dose.", level: "caution", src: "Intuniv SmPC sections 4.2, 4.5; BNFC" },
      { t: "Strong CYP3A4 inducers (carbamazepine, rifampicin, phenytoin, St John's wort): the dose may need re-titrating up to 7 mg a day; titrate down again when the inducer stops.", level: "caution", src: "Intuniv SmPC sections 4.2, 4.5 and Table 3" },
      { t: "Antihypertensives and other medicines that lower blood pressure or slow the pulse: added effect (low blood pressure, slow pulse, fainting).", level: "caution", src: "Intuniv SmPC section 4.5" },
      { t: "Medicines that prolong the QT interval: generally not recommended together.", level: "caution", src: "Intuniv SmPC sections 4.4–4.5" },
      { t: "Valproate: guanfacine raises valproate levels.", level: "caution", src: "Intuniv SmPC section 4.5" },
      { t: "Alcohol and sedating medicines: more sleepiness. No alcohol.", level: "caution", src: "Intuniv SmPC section 4.5" }
    ],
    se: ["se_sedation", "se_chest", "se_headache", "se_gi", "se_mood", "se_suicidal", "se_weightgain"],
    trial: { weeks: 6, note: "Benefit builds over weeks. Judge it at an adequate dose (clinical practice). The SmPC asks for the need to be re-evaluated every 3 months in the first year." },
    pregnancy: "Not recommended in pregnancy, or in anyone who could become pregnant and is not using contraception.",
    breastfeeding: "Decide whether to stop breastfeeding or not use guanfacine.",
    notes: [
      "The only SmPC contraindication is hypersensitivity (section 4.3).",
      "Warnings: low blood pressure, slow pulse, fainting, heart block, QT prolongation, sleepiness, weight and BMI gain, rebound hypertension on stopping; suicide-related events reported after marketing (SmPC section 4.4).",
      "Never stop suddenly: reduce by no more than 1 mg every 3 to 7 days, checking blood pressure and pulse (SmPC section 4.2).",
      "If 2 or more doses in a row are missed, re-titrate (SmPC section 4.2).",
      "Should not be used in older people (SmPC section 4.2)."
    ],
    src: [
      "Intuniv SmPC (emc 5099, rev. 5 Mar 2026), sections 4.1–4.6",
      "NICE NG87 1.7.10, 1.7.17, 1.8.12, 1.8.14"
    ]
  }
]);

AA.add('txProducts', [
  /* ---------------- Methylphenidate, immediate release ---------------- */
  {
    id: "ritalin",
    drug: "mph",
    name: "Ritalin",
    form: "Tablet",
    release: "Immediate release",
    ir: true,
    lasts: "about 3 to 4 hours",
    strengths: [10],
    scored: true,
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 60 mg a day) and adults (maximum 80 mg a day).",
    dose: {
      child: { start: 10, step: [5, 10], every: "week", max: 60, perDay: 2, note: "SmPC: start 5 mg once or twice a day (breakfast and lunch); increase by 5 to 10 mg a day each week, in 2 to 3 doses. The 10 mg tablet is scored: 5 mg is half a tablet." },
      adult: { start: 20, step: [10, 20], every: "week", max: 80, perDay: 2, note: "SmPC: start 10 mg twice a day (5 mg twice a day if judged right, for example under about 70 kg); increase by no more than 20 mg a day each week, in 2 to 3 doses." }
    },
    bnf: {
      child: "up to 2.1 mg/kg a day, maximum 90 mg a day, only under specialist direction (off-label above the 60 mg licence)",
      adult: "up to 100 mg a day in 2 to 3 doses (off-label above the 80 mg licence)"
    },
    take: "Two or three times a day, for example breakfast and lunch. Last dose not within 4 hours of bedtime.",
    food: "With or without food. With food if it upsets the stomach or appetite is poor.",
    open: false,
    swallowWhole: false,
    shell: false,
    group: null,
    groupNote: "Immediate-release methylphenidate tablets are interchangeable by dose. Adult licensing differs between generic tablets: check the SmPC.",
    misuse: "Immediate-release stimulant: do not offer when there is a risk of misuse or diversion.",
    diversionLower: false,
    excipients: "Lactose 40 mg and wheat starch 48 mg per tablet (very low gluten: very unlikely to matter in coeliac disease).",
    missed: "Never take a double dose: wait for the next dose (SmPC).",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 60 (SmPC section 4.2).",
    notes: ["Used for the first titration or a flexible regimen, or as a later-day top-up to a modified-release methylphenidate (NICE NG87 1.7.20, 1.7.22)."],
    src: ["Ritalin SmPC (emc 15987, rev. 24.11.2025), sections 2, 4.2, 4.4", "BNF/BNFC (accessed 21 Oct 2026)", "Main course Module 5 (last dose and bedtime)"]
  },
  {
    id: "medikinet_ir",
    drug: "mph",
    name: "Medikinet",
    form: "Tablet",
    release: "Immediate release",
    ir: true,
    lasts: "about 1 to 4 hours",
    strengths: [5, 10, 20],
    scored: true,
    unit: "mg",
    licensed: { child: true, adultStart: false, adultContinue: false },
    licenceText: "Children 6 and over only (maximum 60 mg a day). The SmPC says Medikinet is not licensed for adults with ADHD.",
    dose: {
      child: { start: 10, step: [5, 10], every: "week", max: 60, perDay: 2, note: "SmPC: start 5 mg once or twice a day; increase by 5 to 10 mg a day each week; give in divided doses." }
    },
    bnf: {
      child: "up to 2.1 mg/kg a day, maximum 90 mg a day, only under specialist direction (off-label above the 60 mg licence)",
      adult: "up to 100 mg a day in 2 to 3 doses (off-label: Medikinet tablets have no adult licence)"
    },
    take: "Two or three times a day, at the same times in relation to meals each day. Last dose not within 4 hours of bedtime.",
    food: "With or after meals.",
    open: false,
    swallowWhole: false,
    shell: false,
    group: null,
    groupNote: "Interchangeable with other immediate-release methylphenidate tablets by dose.",
    misuse: "Immediate-release stimulant: do not offer when there is a risk of misuse or diversion.",
    diversionLower: false,
    excipients: "Lactose.",
    missed: "Never take a double dose (clinical practice; check the leaflet).",
    older: "Should not be used in older people: safety and efficacy not established (SmPC section 4.2).",
    notes: ["The tablet is scored and may be halved."],
    src: ["Medikinet tablets SmPC (emc 328), sections 2, 4.1, 4.2", "BNF/BNFC (accessed 21 Oct 2026)"]
  },

  /* ---------------- Methylphenidate, Concerta-type prolonged-release tablets (SPS tablet group) ---------------- */
  {
    id: "concerta",
    drug: "mph",
    name: "Concerta XL",
    form: "Prolonged-release tablet",
    release: "22:78, osmotic (OROS): about a fifth straight away, the rest pushed out of an osmotic core",
    ir: false,
    ratio: "22:78",
    lasts: "about 12 hours",
    strengths: [18, 27, 36, 54],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 54 mg a day) and adults (maximum 72 mg a day).",
    dose: {
      child: { start: 18, step: 18, every: "week", max: 54, perDay: 1, note: "SmPC: adjust in 18 mg steps at about weekly intervals; the 27 mg tablet gives a step between 18 and 36 mg." },
      adult: { start: 18, step: 18, every: "week", max: 72, perDay: 1, note: "SmPC: 18 mg to start, including adults new to methylphenidate; 18 mg steps at about weekly intervals." }
    },
    bnf: {
      child: "up to 2.1 mg/kg a day, maximum 108 mg a day, only under specialist direction (off-label above the 54 mg licence)",
      adult: "up to 108 mg a day (off-label above the 72 mg licence)"
    },
    fromIR: "From immediate-release methylphenidate 3 times a day (SmPC Table 1): 5 mg → 18 mg; 10 mg → 36 mg; 15 mg → 54 mg; 20 mg → 72 mg (adults only). SPS: Concerta XL 18 mg is about 15 mg a day of immediate release.",
    take: "Once each morning.",
    food: "With or without food.",
    open: false,
    swallowWhole: true,
    shell: true,
    group: "concerta22",
    groupNote: "SPS tablet group, bioequivalent to Concerta XL: Affenid XL, Atenza XL, Concerta XL, Delmosart, Matoride XL, Xaggitin XL, Xenidate XL. Switch at the same dose and quantity if necessary.",
    misuse: "Osmotic tablet that is hard to crush (clinical practice: often preferred, with lisdexamfetamine, when there is a misuse risk; no product is misuse-proof).",
    diversionLower: true,
    excipients: "Lactose (film coat) and butylhydroxytoluene: not for rare galactose intolerance, total lactase deficiency or glucose–galactose malabsorption.",
    missed: "The SmPC does not say. Clinical practice: never take a double dose; if it is already afternoon, skip it and take the next morning dose.",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 65 (SmPC section 4.2).",
    notes: ["Swallow whole with liquid: never chew, divide or crush.", "The empty tablet shell may be seen in stools: this is expected."],
    src: ["Concerta XL SmPC (emc 314, rev. 06/11/2025), sections 4.2, 4.4, 4.5, 5.2, 6.1", "SPS (updated 28 Aug 2025)", "BNF/BNFC (accessed 21 Oct 2026)"]
  },
  {
    id: "xaggitin",
    drug: "mph",
    name: "Xaggitin XL",
    form: "Prolonged-release tablet",
    release: "25:75 (SPS): coating releases part straight away, a polymer core the rest",
    ir: false,
    ratio: "25:75",
    lasts: "about 12 hours",
    strengths: [18, 27, 36, 54],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 54 mg a day) and adults (maximum 72 mg a day).",
    dose: {
      child: { start: 18, step: 18, every: "week", max: 54, perDay: 1, note: "SmPC: 18 mg steps at about weekly intervals." },
      adult: { start: 18, step: 18, every: "week", max: 72, perDay: 1, note: "SmPC: 18 mg steps at about weekly intervals." }
    },
    fromIR: "IR 3 times a day conversion table as for Concerta XL (SmPC section 4.2).",
    take: "Once each morning.",
    food: "With or without food.",
    open: false,
    swallowWhole: true,
    shell: false,
    group: "concerta22",
    groupNote: "SPS tablet group, bioequivalent to Concerta XL. Switch at the same dose and quantity if necessary.",
    misuse: "Prolonged-release tablet, not osmotic: check misuse and diversion risk.",
    excipients: "Lactose (183.8 mg per 18 mg tablet).",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 65 (SmPC section 4.2).",
    notes: ["Swallow whole with liquid: never chew, divide or crush. Not an osmotic tablet: no shell in the stool.", "The BNF lists 54 mg a day as the maximum in adults; the SmPC allows 72 mg. Doses above 54 mg in adults follow the SmPC."],
    src: ["Xaggitin XL SmPC (emc 2704, rev. 12/2025), sections 2, 4.2, 5.2, 6.1", "SPS (updated 28 Aug 2025)", "BNF (accessed 21 Oct 2026)"]
  },
  {
    id: "delmosart",
    drug: "mph",
    name: "Delmosart",
    form: "Prolonged-release tablet",
    release: "25:75 (SPS)",
    ir: false,
    ratio: "25:75",
    lasts: "about 12 hours",
    strengths: [18, 27, 36, 54],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over and adults, as for Xaggitin XL (Accord SmPC; Delmosart is not on emc, so this is not verified on emc).",
    dose: {
      child: { start: 18, step: 18, every: "week", max: 54, perDay: 1, note: "Not verified on emc: check the Accord SmPC." },
      adult: { start: 18, step: 18, every: "week", max: 72, perDay: 1, note: "Not verified on emc: check the Accord SmPC." }
    },
    take: "Once each morning.",
    food: "With or without food (SPS).",
    open: false,
    swallowWhole: true,
    shell: null,
    group: "concerta22",
    groupNote: "SPS tablet group, bioequivalent to Concerta XL. Switch at the same dose and quantity if necessary.",
    misuse: "Prolonged-release tablet: check misuse and diversion risk.",
    excipients: "Contains lactose (LMEN 2018; not verified on emc).",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established (methylphenidate SmPCs, section 4.2; the Accord Delmosart SmPC is not on emc: check its age wording).",
    notes: ["The BNF lists 54 mg a day as the maximum in adults; the SmPC allows 72 mg."],
    src: ["Accord Delmosart SmPC v13.0 (Oct 2025), read in an earlier course review; not on emc", "SPS (updated 28 Aug 2025)", "London Medicines Evaluation Network methylphenidate review (Mar 2018)", "BNF (accessed 21 Oct 2026)"]
  },
  {
    id: "affenid",
    drug: "mph",
    name: "Affenid XL",
    form: "Prolonged-release tablet",
    release: "Osmotic, Concerta-type (bioequivalent to Concerta XL; exact ratio not given, SPS)",
    ir: false,
    lasts: "about 12 hours",
    strengths: [18, 27, 36, 54],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 54 mg a day) and adults (maximum 72 mg a day).",
    dose: {
      child: { start: 18, step: 18, every: "week", max: 54, perDay: 1 },
      adult: { start: 18, step: 18, every: "week", max: 72, perDay: 1 }
    },
    fromIR: "IR 3 times a day conversion table as for Concerta XL (SmPC section 4.2).",
    take: "Once each morning.",
    food: "With or without food.",
    open: false,
    swallowWhole: true,
    shell: true,
    group: "concerta22",
    groupNote: "SPS tablet group, bioequivalent to Concerta XL. Switch at the same dose and quantity if necessary.",
    misuse: "Osmotic tablet that is hard to crush (clinical practice; no product is misuse-proof).",
    diversionLower: true,
    excipients: "Lactose 4 mg per 18 mg tablet.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 65 (SmPC section 4.2).",
    notes: ["Swallow whole with liquid: never chew, divide or crush.", "The empty tablet shell may be seen in stools."],
    src: ["Affenid XL SmPC (emc 14600), sections 2, 4.2, 4.4, 6.1", "SPS (updated 28 Aug 2025)"]
  },
  {
    id: "atenza",
    drug: "mph",
    name: "Atenza XL",
    form: "Prolonged-release tablet",
    release: "Osmotic, Concerta-type (bioequivalent to Concerta XL, SPS)",
    ir: false,
    lasts: "about 12 hours",
    strengths: [18, 27, 36, 45, 54],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 54 mg a day) and adults (maximum 72 mg a day). The only brand with a 45 mg tablet.",
    dose: {
      child: { start: 18, step: 18, every: "week", max: 54, perDay: 1 },
      adult: { start: 18, step: 18, every: "week", max: 72, perDay: 1 }
    },
    fromIR: "IR 3 times a day conversion table as for Concerta XL (SmPC section 4.2).",
    take: "Once each morning.",
    food: "With or without food.",
    open: false,
    swallowWhole: true,
    shell: true,
    group: "concerta22",
    groupNote: "SPS tablet group, bioequivalent to Concerta XL. Switch at the same dose and quantity if necessary.",
    misuse: "Osmotic tablet that is hard to crush (clinical practice; no product is misuse-proof).",
    diversionLower: true,
    excipients: "Lactose 4 mg per 18 mg tablet.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 65 (SmPC section 4.2).",
    notes: ["Swallow whole with liquid: never chew, divide or crush.", "The empty tablet shell may be seen in stools."],
    src: ["Atenza XL SmPCs (emc 101204–101207, 102467), sections 2, 4.2, 4.4, 6.1", "SPS (updated 28 Aug 2025)"]
  },
  {
    id: "xenidate",
    drug: "mph",
    name: "Xenidate XL",
    form: "Prolonged-release tablet",
    release: "Concerta-type multiple-unit tablet: fast- and slow-release pellets pressed into one tablet (bioequivalent to Concerta XL, SPS)",
    ir: false,
    lasts: "about 12 hours",
    strengths: [18, 27, 36, 54],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 54 mg a day) and adults (maximum 72 mg a day).",
    dose: {
      child: { start: 18, step: 18, every: "week", max: 54, perDay: 1 },
      adult: { start: 18, step: 18, every: "week", max: 72, perDay: 1 }
    },
    take: "Once each morning.",
    food: "With or without food.",
    open: false,
    swallowWhole: true,
    shell: false,
    group: "concerta22",
    groupNote: "SPS tablet group, bioequivalent to Concerta XL. Switch at the same dose and quantity if necessary.",
    misuse: "Pellet tablet, not osmotic: check misuse and diversion risk.",
    excipients: "Sucrose (12.3 mg per 18 mg tablet), not lactose: not for fructose intolerance, glucose–galactose malabsorption or sucrase–isomaltase insufficiency.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 65 (SmPC section 4.2).",
    notes: ["Swallow whole with liquid: never chew, divide or crush. No shell in the stool."],
    src: ["Xenidate XL SmPC (emc 4397), sections 2, 4.2, 4.4, 5.2, 6.1", "SPS (updated 28 Aug 2025)"]
  },
  {
    id: "matoride",
    drug: "mph",
    name: "Matoride XL",
    form: "Prolonged-release tablet",
    release: "Osmotic, Concerta-type (bioequivalent to Concerta XL, SPS)",
    ir: false,
    lasts: "about 12 hours",
    strengths: [18, 36, 54],
    unit: "mg",
    licensed: { child: true, adultStart: false, adultContinue: true },
    licenceText: "Children 6 and over only (maximum 54 mg a day). Starting methylphenidate in an adult with Matoride XL is not appropriate, but treatment may continue into adulthood in a young person who has clearly benefited.",
    dose: {
      child: { start: 18, step: 18, every: "week", max: 54, perDay: 1, note: "No 27 mg Matoride XL tablet: a 27 mg tablet from the same SPS group can be used." },
      adult: { start: 18, step: 18, every: "week", max: 54, perDay: 1, note: "Only to continue treatment that began in childhood. Do not start Matoride XL in an adult." }
    },
    take: "Once each morning.",
    food: "With or without food.",
    open: false,
    swallowWhole: true,
    shell: true,
    group: "concerta22",
    groupNote: "SPS tablet group, bioequivalent to Concerta XL. At 18 the adult team may prefer an adult-licensed tablet from the same group, at the same dose.",
    misuse: "Osmotic tablet that is hard to crush (clinical practice; no product is misuse-proof).",
    diversionLower: true,
    excipients: "Lactose 6.42 mg per 54 mg tablet.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 65 (SmPC section 4.2).",
    notes: ["Swallow whole with liquid: never chew, divide or crush.", "The empty tablet shell may be seen in stools."],
    src: ["Matoride XL SmPC (emc 3304, 3305, 3682; rev. 06/05/2026), sections 2, 4.1, 4.2, 4.4, 6.1", "SPS (updated 28 Aug 2025)"]
  },

  /* ---------------- Methylphenidate, Ritalin XL-type 50:50 capsules (SPS capsule group) ---------------- */
  {
    id: "ritalinxl",
    drug: "mph",
    name: "Ritalin XL",
    form: "Modified-release capsule",
    release: "50:50 beads: two peaks about 4 hours apart, like a short-acting dose taken twice",
    ir: false,
    ratio: "50:50",
    lasts: "about 8 hours",
    strengths: [10, 20, 30, 40],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 60 mg a day) and adults (maximum 80 mg a day).",
    dose: {
      child: { start: 10, step: 10, every: "week", max: 60, perDay: 1, note: "Or 20 mg if a higher start is judged right. SmPC: increase by 5 to 10 mg a day each week; with 10 mg capsules the step is 10 mg in practice." },
      adult: { start: 20, step: [10, 20], every: "week", max: 80, perDay: 1, note: "Adults new to methylphenidate. Start 10 mg if judged right (for example under 70 kg). Increase by no more than 20 mg a day each week." }
    },
    fromIR: "From immediate release twice a day: the same total daily dose once a day (5 mg twice a day → 10 mg; 10 → 20 mg; 15 → 30 mg; 20 → 40 mg; 30 → 60 mg) (SmPC Table 1).",
    take: "Once each morning, not too late in the day (sleep).",
    food: "With or without food.",
    open: true,
    openHow: "Swallow whole, or open the capsule and sprinkle the beads on a spoon of cool soft food (for example apple sauce or yoghurt) and take it at once. Do not crush or chew the beads.",
    swallowWhole: false,
    shell: false,
    group: "ritxl5050",
    groupNote: "SPS capsule group, bioequivalent to each other: Focusim XL, Meflynate XL, Metyrol XL, Ritalin XL. Switch at the same dose and quantity if necessary; switching to or from Medikinet XL needs particular care.",
    misuse: "Bead capsule that can be opened: check misuse and diversion risk.",
    excipients: "Sucrose (sugar spheres; 113 mg per 20 mg capsule); gelatin capsule.",
    missed: "Never take a double dose: wait for the next dose (SmPC).",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 60 (SmPC section 4.2).",
    notes: [],
    src: ["Ritalin XL SmPC (emc 15966, rev. 24.11.2025), sections 2, 4.2, 5.2, 6.1", "SPS (updated 28 Aug 2025)"]
  },
  {
    id: "meflynate",
    drug: "mph",
    name: "Meflynate XL",
    form: "Modified-release capsule",
    release: "50:50 beads: two peaks about 4 hours apart",
    ir: false,
    ratio: "50:50",
    lasts: "about 8 hours",
    strengths: [10, 20, 30, 40, 60],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 60 mg a day) and adults (maximum 80 mg a day).",
    dose: {
      child: { start: 20, step: 10, every: "week", max: 60, perDay: 1, note: "Or 10 mg to start (SmPC)." },
      adult: { start: 20, step: 20, every: "week", max: 80, perDay: 1 }
    },
    fromIR: "From immediate release twice a day: the same total daily dose once a day (SmPC section 4.2).",
    take: "Once each morning, not too late in the morning (sleep).",
    food: "With or without food.",
    open: true,
    openHow: "Swallow whole, or open the capsule and sprinkle the beads on a little soft food that is not warm (for example apple sauce) and take it at once. Do not crush or chew the beads, and do not store the mixture.",
    swallowWhole: false,
    shell: false,
    group: "ritxl5050",
    groupNote: "SPS capsule group with Focusim XL, Metyrol XL and Ritalin XL. Switch at the same dose and quantity if necessary; switching to or from Medikinet XL needs particular care.",
    misuse: "Bead capsule that can be opened: check misuse and diversion risk.",
    excipients: "Sucrose (358.4 mg per 60 mg capsule); gelatin capsule.",
    missed: "The SmPC does not say. Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 60 (SmPC section 4.2).",
    notes: [],
    src: ["Meflynate XL SmPC (emc 15094), sections 2, 4.2, 5.2, 6.1", "SPS (updated 28 Aug 2025)"]
  },
  {
    id: "metyrol",
    drug: "mph",
    name: "Metyrol XL",
    form: "Modified-release capsule",
    release: "50:50 beads: two peaks about 4 hours apart",
    ir: false,
    ratio: "50:50",
    lasts: "about 8 hours",
    strengths: [10, 20, 30, 40, 60],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 60 mg a day) and adults (maximum 80 mg a day).",
    dose: {
      child: { start: 10, step: 10, every: "week", max: 60, perDay: 1, note: "Or 20 mg if a higher start is judged right. SmPC: increase by 5 to 10 mg a day each week; with 10 mg capsules the step is 10 mg in practice. Switching from another capsule in the same SPS group: the same dose." },
      adult: { start: 20, step: [10, 20], every: "week", max: 80, perDay: 1, note: "Adults new to methylphenidate. Start 10 mg if judged right (for example under 70 kg). Increase by no more than 20 mg a day each week. Switching from another capsule in the same SPS group: the same dose." }
    },
    fromIR: "From immediate release twice a day: the same total daily dose once a day (5 mg twice a day → 10 mg; 10 → 20 mg; 15 → 30 mg; 20 → 40 mg; 30 → 60 mg) (SmPC Table 1).",
    take: "Once each morning.",
    food: "With or without food.",
    open: true,
    openHow: "Swallow whole, or open the capsule and sprinkle the beads on a little soft food that is not warm (for example apple sauce) and take it at once. Do not crush or chew the beads, and do not store the mixture.",
    swallowWhole: false,
    shell: false,
    group: "ritxl5050",
    groupNote: "SPS capsule group with Focusim XL, Meflynate XL and Ritalin XL. Switch at the same dose and quantity if necessary. SPS: Metyrol XL 10 mg is about 10 mg a day of immediate release.",
    misuse: "Bead capsule that can be opened: check misuse and diversion risk.",
    excipients: "Sucrose (59.7 mg per 10 mg capsule); gelatin capsule.",
    missed: "Never take a double dose: wait for the next dose (SmPC).",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 60 (SmPC section 4.2).",
    notes: [],
    src: ["Metyrol XL SmPC (emc 13797, rev. 20/08/2026), sections 2, 4.1, 4.2 (starting doses, steps, Table 1)", "SPS (updated 28 Aug 2025)"]
  },
  {
    id: "focusim",
    drug: "mph",
    name: "Focusim XL",
    form: "Modified-release capsule",
    release: "50:50 beads: two peaks about 4 to 5 hours apart",
    ir: false,
    ratio: "50:50",
    lasts: "about 8 hours",
    strengths: [10, 20, 30, 40],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 60 mg a day) and adults (maximum 80 mg a day).",
    dose: {
      child: { start: 10, step: 10, every: "week", max: 60, perDay: 1, note: "Or 20 mg if a higher start is judged right. SmPC: adjust at weekly intervals in 10 mg steps. Switching from another capsule in the same SPS group: the same dose." },
      adult: { start: 20, step: [10, 20], every: "week", max: 80, perDay: 1, note: "Adults new to methylphenidate. Start 10 mg if judged right (for example under 70 kg). Increase by no more than 20 mg a day each week. Switching from another capsule in the same SPS group: the same dose." }
    },
    fromIR: "From immediate release twice a day, or another modified-release methylphenidate: the same total daily dose once a day (for example 10 mg twice a day → 20 mg) (SmPC Table 1).",
    take: "Once each morning.",
    food: "With or without food.",
    open: true,
    openHow: "Swallow whole, or open the capsule and sprinkle the beads on a little soft food that is not warm (for example apple sauce) and take it at once. Do not crush or chew the beads, and do not store the mixture.",
    swallowWhole: false,
    shell: false,
    group: "ritxl5050",
    groupNote: "SPS capsule group with Meflynate XL, Metyrol XL and Ritalin XL. Switch at the same dose and quantity if necessary.",
    misuse: "Bead capsule that can be opened: check misuse and diversion risk.",
    excipients: "No sucrose listed (microcrystalline cellulose pellets); gelatin capsule. Useful when sucrose must be avoided.",
    missed: "Never take a double dose: wait for the next dose (SmPC).",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 60 (SmPC section 4.2).",
    notes: [],
    src: ["Focusim XL SmPC (emc 100558, rev. 11/09/2026), sections 4.1, 4.2 (starting doses, steps, Table 1), 6.1", "SPS (updated 28 Aug 2025)"]
  },

  /* ---------------- Methylphenidate, other modified-release capsules ---------------- */
  {
    id: "medikinetxl",
    drug: "mph",
    name: "Medikinet XL",
    form: "Modified-release capsule",
    release: "50:50: fast-release pellets plus gastro-resistant pellets; a strong morning and early afternoon",
    ir: false,
    ratio: "50:50",
    lasts: "about 8 hours",
    strengths: [5, 10, 20, 30, 40, 50, 60],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 60 mg a day) and adults (maximum 80 mg a day and no more than 1 mg/kg).",
    dose: {
      child: { start: 5, step: [5, 10], every: "week", max: 60, perDay: 1, note: "SmPC: 5 mg once or twice a day to start; increase by 5 to 10 mg a day each week. Medikinet XL 10 mg can replace immediate release 5 mg twice a day." },
      adult: { start: 10, step: 10, every: "week", max: 80, maxMgPerKg: 1, perDay: 2, note: "Adults new to Medikinet XL: 10 mg a day, up by 10 mg each week, given in 2 doses (morning and midday) with or after food. A young person may continue at the same dose into adulthood." }
    },
    bnf: {
      child: "up to 2.1 mg/kg a day, maximum 90 mg a day, only under specialist direction (off-label above the 60 mg licence)",
      adult: "maximum 100 mg a day (off-label above the 80 mg licence)"
    },
    fromIR: "From immediate release: the same total daily dose (SmPC). SPS: Medikinet XL 10 mg is about 10 mg a day of immediate release.",
    take: "Children: once each morning with or after breakfast. Adults: morning and midday with or after food.",
    food: "Must be taken with or after food. On an empty stomach it is absorbed much faster and the release may not last (dose dumping). Not with proton pump inhibitors, H2 blockers or antacids.",
    open: true,
    openHow: "Swallow whole, or open the capsule, sprinkle the contents on a tablespoon of apple sauce or yoghurt and take it at once.",
    swallowWhole: false,
    shell: false,
    group: null,
    groupNote: "Not completely bioequivalent to the Ritalin XL-type capsules: switch only with particular care (SPS).",
    ci: ["ci_acidsuppress"],
    misuse: "Pellet capsule that can be opened: check misuse and diversion risk.",
    excipients: "Sucrose (127–145 mg per 10 mg capsule); erythrosine and patent blue V in the capsule shell; gelatin.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established over 60 (SmPC section 4.2).",
    notes: ["Contraindicated with proton pump inhibitors (for example omeprazole), H2 blockers or antacids, and with marked lack of stomach acid (pH above 5.5): the whole dose may be released faster (SmPC sections 4.3, 4.5). Tell the person not to take them together."],
    src: ["Medikinet XL SmPC (emc 313, rev. 09/06/2025), sections 2, 4.2, 4.3, 4.5, 5.2, 6.1", "SPS (updated 28 Aug 2025)", "BNF/BNFC (accessed 21 Oct 2026)"]
  },
  {
    id: "equasym",
    drug: "mph",
    name: "Equasym XL",
    form: "Modified-release capsule",
    release: "30:70 beads: less in the morning, more later",
    ir: false,
    ratio: "30:70",
    lasts: "about 8 hours",
    strengths: [10, 20, 30],
    unit: "mg",
    licensed: { child: true, adultStart: false, adultContinue: false },
    licenceText: "Children 6 and over only (maximum 60 mg a day). The SmPC says it is not licensed for use in adults.",
    dose: {
      child: { start: 10, step: 10, every: "week", max: 60, perDay: 1, note: "SmPC: titrate in 5 to 10 mg a day steps each week; the smallest capsule is 10 mg, so steps are 10 mg in practice. Equasym XL 10 mg can replace immediate release 5 mg twice a day." }
    },
    bnf: {
      child: "up to 2.1 mg/kg a day, maximum 90 mg a day, only under specialist direction (off-label above the 60 mg licence)",
      adult: "maximum 100 mg a day (off-label: Equasym XL has no adult licence)"
    },
    fromIR: "Immediate release 10 mg at breakfast plus 10 mg at lunch → Equasym XL 20 mg (SmPC). SPS: Equasym XL 10 mg is about 10 mg a day of immediate release.",
    take: "Once each morning before breakfast.",
    food: "Before breakfast. A high-fat breakfast delays the peak by about an hour.",
    open: true,
    openHow: "Swallow whole, or open the capsule, sprinkle the beads on a tablespoon of apple sauce, take it at once, then drink some water. Do not crush or chew.",
    swallowWhole: false,
    shell: false,
    group: null,
    groupNote: "No other modified-release product is bioequivalent: do not switch it or prescribe it generically (SPS).",
    misuse: "Bead capsule that can be opened: check misuse and diversion risk.",
    excipients: "Sucrose (sugar spheres); gelatin; indigo carmine and iron oxides.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established (SmPC section 4.2).",
    notes: ["At 18 a switch to an adult-licensed product is needed, or off-label continuation with a recorded reason."],
    src: ["Equasym XL SmPC (emc 3887, rev. 22 Sep 2025), sections 4.1, 4.2, 4.4, 5.2, 6.1", "SPS (updated 28 Aug 2025)", "BNF/BNFC (accessed 21 Oct 2026)"]
  },

  /* ---------------- Lisdexamfetamine ---------------- */
  {
    id: "elvanse",
    drug: "lisdex",
    name: "Elvanse",
    form: "Capsule",
    release: "Prodrug: red blood cells slowly turn it into dexamfetamine, giving a smooth, long effect",
    ir: false,
    lasts: "about 13 hours (children), 14 hours (adults)",
    strengths: [20, 30, 40, 50, 60, 70],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over when the response to methylphenidate has been clinically inadequate, and adults with ADHD symptoms present in childhood. Maximum 70 mg a day.",
    dose: {
      child: { start: 30, step: [10, 20], every: "week", max: 70, perDay: 1, note: "Or 20 mg to start if judged right (SmPC). Severe kidney impairment (GFR 15 to under 30 mL/min/1.73 m², or creatinine clearance under 30 mL/min): maximum 50 mg a day." },
      adult: { start: 30, step: [10, 20], every: "week", max: 70, perDay: 1, note: "Or 20 mg to start if judged right (SmPC). Severe kidney impairment: maximum 50 mg a day; consider less on dialysis." }
    },
    take: "Once each morning. Avoid afternoon doses (sleep).",
    food: "With or without food.",
    open: true,
    openHow: "Swallow whole, or open the capsule, stir all of the contents into yoghurt, water or orange juice and take it at once. A film of inactive ingredients may be left. Never divide a capsule.",
    swallowWhole: false,
    shell: false,
    group: null,
    groupNote: "Not interchangeable with methylphenidate or dexamfetamine tablets mg for mg.",
    misuse: "Prodrug: its slow conversion lowers, but does not remove, misuse potential.",
    diversionLower: true,
    excipients: "Gelatin capsule; erythrosine in the 30 mg capsule.",
    missed: "Resume the next morning; do not take it in the afternoon (SmPC).",
    older: "Limited data: a thorough evaluation before starting, and monitor blood pressure and the heart (SmPC section 4.2).",
    notes: ["Stop if there is no improvement after 1 month of dose adjustment (SmPC section 4.2)."],
    src: ["Elvanse SmPC (emc 14089, rev. 02/10/2026), sections 4.1, 4.2, 5.1, 5.2, 6.1", "Main course Module 5 (misuse potential)"]
  },

  /* ---------------- Dexamfetamine ---------------- */
  {
    id: "amfexa",
    drug: "dex",
    name: "Amfexa (dexamfetamine)",
    form: "Tablet",
    release: "Immediate release",
    ir: true,
    lasts: "the SmPC gives no duration of effect; usually given twice a day",
    strengths: [5, 10, 20],
    unit: "mg",
    licensed: { child: true, adultStart: false, adultContinue: false },
    licenceText: "Ages 6 to 17 when the response to methylphenidate has been clinically inadequate. Not licensed in adults.",
    dose: {
      child: { start: 10, step: 5, every: "week", usualMax: 20, max: 40, perDay: 2, note: "SmPC: start 5 mg once or twice a day (breakfast and lunch); increase by 5 mg a day each week. Usual maximum 20 mg a day; up to 40 mg a day only in rare cases (specialist decision; record the reason). BNFC: 2.5 mg 2 to 3 times a day to start; usually a maximum of 1 mg/kg up to 20 mg." }
    },
    bnf: {
      adult: "5 mg twice a day, maximum 60 mg a day (off-label: dexamfetamine has no adult licence)"
    },
    take: "First dose in the morning, last dose not too late after lunchtime (sleep).",
    food: "With or just after meals, the same way each day.",
    open: false,
    swallowWhole: false,
    shell: false,
    group: null,
    groupNote: "Generic dexamfetamine tablets are interchangeable by dose.",
    misuse: "Immediate-release amfetamine: the highest misuse potential of the ADHD medicines. Do not offer when there is a risk of misuse or diversion.",
    diversionLower: false,
    excipients: "Isomalt 147.5 mg per tablet: not for hereditary fructose intolerance.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people (SmPC section 4.2).",
    notes: ["The tablets are cross-scored to help swallowing, not to give equal doses.", "Reduce gradually when stopping. A drug-free trial at least once a year, ideally in the school holidays (SmPC section 4.2)."],
    src: ["Amfexa / Dexamfetamine Sulfate Medice SmPC (emc 102097, rev. 14/01/2026), sections 2, 4.1, 4.2, 4.4", "BNF/BNFC (accessed 21 Oct 2026)"]
  },
  {
    id: "dex_solution",
    drug: "dex",
    name: "Dexamfetamine sulfate",
    form: "Oral solution",
    formRx: "oral solution",
    release: "Immediate release",
    ir: true,
    lasts: "as for dexamfetamine tablets",
    strengths: [1],
    strengthText: "1 mg/ml",
    unit: "mg",
    licensed: { child: true, adultStart: false, adultContinue: false },
    licenceText: "The same ADHD licence as the tablets: ages 6 to 17 when the response to methylphenidate has been clinically inadequate. Not licensed in adults.",
    dose: {
      child: { start: 10, step: 5, every: "week", usualMax: 20, max: 40, perDay: 2, note: "As for dexamfetamine tablets: 5 mg once or twice a day to start (5 ml of the 1 mg/ml solution), then up by 5 mg a day each week. Usual maximum 20 mg a day; up to 40 mg a day only in rare cases (specialist decision; record the reason)." }
    },
    take: "First dose in the morning, last dose not too late after lunchtime (sleep). Measure with an oral syringe.",
    food: "With or just after meals, the same way each day.",
    open: false,
    swallowWhole: false,
    shell: false,
    group: null,
    groupNote: "For people who cannot swallow tablets.",
    misuse: "Immediate-release amfetamine liquid: do not offer when there is a risk of misuse or diversion.",
    diversionLower: false,
    excipients: "Maltitol 200 mg/ml: avoid in hereditary fructose intolerance.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people (dexamfetamine SmPC section 4.2).",
    notes: ["Oral liquids of amfetamines are exempt from safe custody, but they are still Schedule 2 controlled drugs."],
    src: ["Dexamfetamine 1 mg/ml oral solution SmPC (Rosemont, emc 13874), section 4.2 (usual maximum 20 mg, 40 mg in rare cases)", "Misuse of Drugs (Safe Custody) Regulations 1973"]
  },

  /* ---------------- Atomoxetine ---------------- */
  {
    id: "atomoxetine",
    drug: "atx",
    name: "Atomoxetine",
    brandNote: "Strattera and generic capsules",
    form: "Capsule",
    release: "Not a stimulant: a steady effect that builds over weeks",
    ir: false,
    lasts: "all day once established (no daily peak of effect)",
    strengths: [10, 18, 25, 40, 60, 80, 100],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over, young people and adults (in adults, confirm that symptoms were present in childhood). Maximum 100 mg a day over 70 kg and in adults.",
    dose: {
      child: { mgPerKg: { start: 0.5, target: 1.2 }, overKg: 70, overStart: 40, overTarget: 80, max: 100, perDay: 1, every: "week", note: "Keep the starting dose for at least 7 days. Under 70 kg the SmPC sets no mg maximum: no extra benefit is shown above about 1.2 mg/kg a day, and more than 1.8 mg/kg a day has not been systematically evaluated. If it causes nausea or sleepiness, the daily dose can be given as two equal doses (morning and late afternoon or early evening), each made from whole capsules: never open or split a capsule. Liver impairment: Child-Pugh B half the usual dose, Child-Pugh C a quarter. Strong CYP2D6 inhibitors: titrate more slowly; a lower final dose may be needed. Known CYP2D6 poor metabolisers: consider a lower starting dose and slower titration." },
      adult: { start: 40, target: 80, max: 100, perDay: 1, every: "week", note: "Keep 40 mg for at least 7 days; maintenance 80 to 100 mg a day. The daily dose can be given as two equal doses (morning and late afternoon or early evening), each made from whole capsules: never open or split a capsule. Liver impairment: Child-Pugh B half the usual dose, Child-Pugh C a quarter. Strong CYP2D6 inhibitors: titrate more slowly; a lower final dose may be needed. Known CYP2D6 poor metabolisers: consider a lower starting dose and slower titration." }
    },
    bnf: {
      child: "up to 1.8 mg/kg and 120 mg a day under specialist direction; above 100 mg a day is off-label",
      adult: "up to 120 mg a day under specialist direction; above 100 mg a day is off-label"
    },
    take: "Once each morning.",
    food: "With or without food.",
    open: false,
    openHow: "Do not open the capsules: the contents irritate the eyes.",
    swallowWhole: true,
    shell: false,
    group: null,
    groupNote: "Generic capsules are interchangeable by dose. The Strattera 4 mg/ml oral solution is marked discontinued on emc: check dm+d for a current liquid.",
    misuse: "Not a controlled drug; low misuse potential.",
    diversionLower: true,
    excipients: "Gelatin capsule.",
    missed: "Take it as soon as possible, but never take a double dose (patient leaflet).",
    older: "Not systematically evaluated over 65 (SmPC section 4.2).",
    notes: ["Worked example: a child of 30 kg starts at about 15 mg a day and aims for about 36 mg a day."],
    src: ["Atomoxetine SmPC (emc 10332, Zentiva, rev. 06/12/2024), sections 4.2, 4.4, 4.5, 6.6", "BNF/BNFC (accessed 21 Oct 2026)", "Main course Module 5 (worked example)"]
  },

  /* ---------------- Guanfacine ---------------- */
  {
    id: "intuniv",
    drug: "gxr",
    name: "Intuniv",
    form: "Prolonged-release tablet",
    release: "Not a stimulant: prolonged-release tablet, effect builds over weeks",
    ir: false,
    lasts: "all day once established",
    strengths: [1, 2, 3, 4],
    unit: "mg",
    licensed: { child: true, adultStart: false, adultContinue: false },
    licenceText: "Ages 6 to 17 when stimulants are not suitable, not tolerated or have not worked. Not for adults (the SmPC says it should not be used); NICE: adults only with tertiary advice.",
    dose: {
      child: {
        start: 1, step: 1, every: "week", targetMgPerKg: [0.05, 0.12], perDay: 1,
        maxTable: [
          { ageMin: 6, ageMax: 12, kgMin: 25, max: 4 },
          { ageMin: 13, ageMax: 17, kgMin: 34, kgMax: 41.4, max: 4 },
          { ageMin: 13, ageMax: 17, kgMin: 41.5, kgMax: 49.4, max: 5 },
          { ageMin: 13, ageMax: 17, kgMin: 49.5, kgMax: 58.4, max: 6 },
          { ageMin: 13, ageMax: 17, kgMin: 58.5, max: 7, note: "7 mg only after at least 1 week on 6 mg and a full review." }
        ],
        note: "Increase by no more than 1 mg a week. The SmPC gives no schedule under 25 kg (age 6 to 12) or under 34 kg (age 13 to 17): a specialist decision. Moderate or strong CYP3A4 inhibitors: halve the dose."
      }
    },
    bnf: {
      adult: "the BNF lists no adult dose (off-label; tertiary advice only)"
    },
    take: "Once a day at the same time, morning or evening.",
    food: "With or without food, but not with a high-fat meal. No grapefruit juice. No alcohol.",
    open: false,
    openHow: "Swallow whole: do not crush, chew or break the tablet (it would release faster).",
    swallowWhole: true,
    shell: false,
    group: null,
    groupNote: "Immediate-release guanfacine cannot be swapped for it mg for mg.",
    misuse: "Not a controlled drug; low misuse potential.",
    diversionLower: true,
    excipients: "Lactose (22.41 mg per 1 mg tablet).",
    missed: "Carry on with the next dose the next day. If 2 or more doses in a row are missed, contact the team: the dose may need re-titrating (SmPC).",
    older: "Should not be used in older people (SmPC section 4.2).",
    notes: [
      "Never stop suddenly: reduce by no more than 1 mg every 3 to 7 days, checking blood pressure and pulse (rebound hypertension).",
      "Weekly checks during titration for sleepiness, low blood pressure and slow pulse; then at least every 3 months in the first year, then every 6 months.",
      "Worked example: 30 kg → target 1.5 to 3.6 mg a day, so 2 to 3 mg.",
      "Moderate or strong CYP3A4 inhibitors (for example clarithromycin, ketoconazole, grapefruit juice): halve the dose. The tablets must not be broken, so a halved dose is rounded down to whole tablets (clinical practice).",
      "Strong CYP3A4 inducers (carbamazepine, rifampicin, phenytoin, St John's wort): re-titration up to 7 mg a day may be considered."
    ],
    src: ["Intuniv SmPC (emc 5099, rev. 5 Mar 2026), sections 2, 4.1, 4.2, 4.4, 4.5", "BNF/BNFC (accessed 21 Oct 2026)", "Main course Module 5 (worked example)"]
  },

  /* ---------------- Methylphenidate products added after the course list (emc, checked 25 Oct 2026) ----------------
     SPS bioequivalence for these four is not confirmed (the SPS page could not be checked), so group is null:
     prescribe by brand and do not swap them with another product at the same dose without checking SPS. */
  {
    id: "kixel",
    drug: "mph",
    name: "Kixel XL",
    form: "Prolonged-release tablet",
    release: "Osmotic, Concerta-type: a non-absorbable shell releases the medicine at a controlled rate",
    ir: false,
    lasts: "about 12 hours",
    strengths: [18, 27, 36, 54],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 54 mg a day) and adults (maximum 72 mg a day).",
    dose: {
      child: { start: 18, step: 18, every: "week", max: 54, perDay: 1, note: "SmPC: 18 mg to start in children new to methylphenidate; adjust in 18 mg steps at about weekly intervals. The 27 mg tablet gives a step between 18 and 36 mg." },
      adult: { start: 18, step: 18, every: "week", max: 72, perDay: 1, note: "SmPC: 18 mg to start in adults new to methylphenidate; adjust in 18 mg steps at about weekly intervals." }
    },
    fromIR: "From immediate-release methylphenidate 3 times a day (SmPC Table 1): 5 mg → 18 mg; 10 mg → 36 mg; 15 mg → 54 mg; 20 mg → 72 mg (adults only).",
    take: "Once each morning.",
    food: "With or without food.",
    open: false,
    swallowWhole: true,
    shell: true,
    group: null,
    groupNote: "Concerta-type osmotic tablet, but SPS has not been confirmed to list it in the Concerta XL bioequivalence group: prescribe by brand and do not switch it with that group without checking SPS.",
    misuse: "Osmotic tablet that is hard to crush (clinical practice; no product is misuse-proof).",
    diversionLower: true,
    excipients: "Lactose (4 mg per 18 mg tablet): not for rare galactose intolerance, total lactase deficiency or glucose–galactose malabsorption.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established; not studied over 65 (SmPC section 4.2).",
    notes: ["Swallow whole with liquid: never chew, divide or crush.", "The empty tablet shell may be seen in stools: this is expected.", "Not in the main course product tables."],
    src: ["Kixel XL 18 mg SmPC (emc 101341), sections 2, 4.1, 4.2, 4.4, 6.1; 27, 36 and 54 mg tablets are also on emc (54 mg: emc 101349)", "SPS (updated 28 Aug 2025): bioequivalence group not confirmed for this build"]
  },
  {
    id: "ambinet",
    drug: "mph",
    name: "Ambinet XL",
    form: "Modified-release capsule",
    release: "50:50: a fast-release part and a delayed-release part, like Medikinet XL; a strong morning and early afternoon",
    ir: false,
    ratio: "50:50",
    lasts: "about 8 hours",
    strengths: [5, 10, 20, 30, 40, 50, 60],
    unit: "mg",
    licensed: { child: true, adultStart: true, adultContinue: true },
    licenceText: "Children 6 and over (maximum 60 mg a day) and adults (maximum 80 mg a day and no more than 1 mg/kg).",
    dose: {
      child: { start: 5, step: [5, 10], every: "week", max: 60, perDay: 1, note: "SmPC: 5 mg once or twice a day to start; increase by 5 to 10 mg a day each week. Ambinet XL 10 mg once a day can replace immediate release 5 mg twice a day." },
      adult: { start: 10, step: 10, every: "week", max: 80, maxMgPerKg: 1, perDay: 2, note: "Adults new to Ambinet XL: 10 mg a day, up by 10 mg each week, given in 2 doses (morning and midday) with or after food. A young person may continue at the same daily dose into adulthood." }
    },
    fromIR: "From immediate release: the same total daily dose (SmPC).",
    take: "Children: once each morning with or after breakfast. Adults: morning and midday with or after food.",
    food: "Must be taken with or after food: on an empty stomach it is absorbed much faster and the release may not last. Not with proton pump inhibitors, H2 blockers or antacids.",
    open: true,
    openHow: "Swallow whole, or open the capsule, sprinkle the contents on a tablespoon of apple sauce or yoghurt, take it at once and then drink some water. Do not crush or chew, and do not store the mixture.",
    swallowWhole: false,
    shell: false,
    group: null,
    groupNote: "Medikinet XL-type capsule, but SPS bioequivalence is not confirmed for this build: prescribe by brand and do not switch it with another product without checking SPS.",
    ci: ["ci_acidsuppress"],
    misuse: "Pellet capsule that can be opened: check misuse and diversion risk.",
    excipients: "No sucrose listed (microcrystalline cellulose pellets); gelatin capsule.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established over 60 (SmPC section 4.2).",
    notes: ["Contraindicated with proton pump inhibitors (for example omeprazole), H2 blockers or antacids, and with marked lack of stomach acid (pH above 5.5): the whole dose may be released faster (SmPC sections 4.3, 4.5). Tell the person not to take them together.", "Not in the main course product tables."],
    src: ["Ambinet XL SmPCs (emc 102267–102273; 10 mg emc 102268, rev. 06/05/2026), sections 2, 4.1, 4.2, 4.3, 4.5, 6.1", "SPS (updated 28 Aug 2025): bioequivalence group not confirmed for this build"]
  },
  {
    id: "addepta",
    drug: "mph",
    name: "Addepta XL",
    form: "Modified-release capsule",
    release: "30:70 pellets: less in the morning, more later (like Equasym XL)",
    ir: false,
    ratio: "30:70",
    lasts: "about 8 hours",
    strengths: [10, 20, 30],
    unit: "mg",
    licensed: { child: true, adultStart: false, adultContinue: false },
    licenceText: "Children 6 and over only (maximum 60 mg a day). The SmPC says it is not approved for adults.",
    dose: {
      child: { start: 10, step: 10, every: "week", max: 60, perDay: 1, note: "SmPC: increase by 5 to 10 mg a day each week; the smallest capsule is 10 mg, so steps are 10 mg in practice. Addepta XL 10 mg can replace immediate release 5 mg twice a day." }
    },
    fromIR: "From immediate release: the same total daily dose once a day (for example 10 mg at breakfast plus 10 mg at lunch → 20 mg) (SmPC).",
    take: "Once each morning before breakfast.",
    food: "Before breakfast (SmPC).",
    open: true,
    openHow: "Swallow whole, or open the capsule, sprinkle the contents on a tablespoon of soft food such as apple sauce, take it at once and then drink some water. Do not crush or chew, and do not store the mixture.",
    swallowWhole: false,
    shell: false,
    group: null,
    groupNote: "30:70 like Equasym XL, but bioequivalence with Equasym XL is not confirmed (SPS not checked for this build): do not switch between them at the same dose. Prescribe by brand.",
    misuse: "Pellet capsule that can be opened: check misuse and diversion risk.",
    excipients: "No sucrose or gelatin listed: microcrystalline cellulose pellets in a hypromellose capsule.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established (SmPC section 4.2).",
    notes: ["At 18 a switch to an adult-licensed product is needed, or off-label continuation with a recorded reason.", "Not in the main course product tables."],
    src: ["Addepta XL SmPCs (emc 102481–102483; 10 mg emc 102481, rev. 30/06/2026), sections 2, 4.1, 4.2, 6.1", "SPS (updated 28 Aug 2025): bioequivalence group not confirmed for this build"]
  },
  {
    id: "tuzulby",
    drug: "mph",
    name: "Tuzulby",
    form: "Prolonged-release chewable tablet",
    formRx: "prolonged-release chewable tablets",
    release: "30:70: a fast-release part and a prolonged-release part in a chewable tablet",
    ir: false,
    ratio: "30:70",
    lasts: "about 8 hours",
    strengths: [20, 30, 40],
    scored: true,
    unit: "mg",
    licensed: { child: true, adultStart: false, adultContinue: false },
    licenceText: "Ages 6 to 17 only (maximum 60 mg a day). The SmPC says it is not indicated in adults.",
    dose: {
      child: { start: 20, step: [10, 20], every: "week", max: 60, perDay: 1, note: "SmPC: 20 mg each morning to start; adjust up or down each week by 10, 15 or 20 mg. A 10 mg or 15 mg dose is half of the scored 20 mg or 30 mg tablet." }
    },
    fromIR: "From immediate release twice a day: the same total daily dose once a day (10 mg twice a day → 20 mg; 15 → 30 mg; 20 → 40 mg; 30 → 60 mg) (SmPC).",
    take: "Once each morning.",
    food: "With or without food.",
    open: false,
    openHow: "Must be chewed: do not swallow it whole or crush it. The 20 mg and 30 mg tablets can be broken in half for a 10 mg or 15 mg dose.",
    swallowWhole: false,
    shell: false,
    group: null,
    groupNote: "A chewable prolonged-release tablet with its own release profile: no SPS bioequivalence group is confirmed. Prescribe by brand and do not switch it with another product at the same dose without checking.",
    misuse: "Chewable prolonged-release tablet: check misuse and diversion risk.",
    excipients: "Aspartame (6.1 mg per 20 mg, 9.15 mg per 30 mg and 12.2 mg per 40 mg tablet): a source of phenylalanine, which may be harmful in phenylketonuria.",
    missed: "Never take a double dose (clinical practice).",
    older: "Should not be used in older people: safety and efficacy not established (SmPC section 4.2).",
    notes: ["Useful when a young person cannot swallow tablets or capsules.", "At 18 a switch to an adult-licensed product is needed, or off-label continuation with a recorded reason.", "Not in the main course product tables."],
    src: ["Tuzulby SmPCs (emc 101827–101829; 20 mg emc 101827, rev. 26/06/2026), sections 2, 3, 4.1, 4.2, 4.4, 6.1", "SPS (updated 28 Aug 2025): bioequivalence group not confirmed for this build"]
  }
]);
