/* Titration schedules: SPC (emc) posology, checked 20 Oct 2026. Illustrative only – always individualise and check current BNF/BNFC/SPC. */
window.TITRATION = {
  mph_ir_child: {
    name:'Methylphenidate IR – child 6–17 y (e.g. Medikinet / Ritalin tablets)',
    pop:'Children 6 years and over and adolescents', max:'60 mg/day (SPC licensed maximum)',
    note:'SPC: start 5 mg once or twice daily (e.g. breakfast and lunch), increase if necessary by weekly increments of 5–10 mg in the daily dose. BNFC (accessed 21 Oct 2026): licensed maximum 60 mg/day in 2–3 doses (or 2.1 mg/kg/day); up to 90 mg/day only under specialist direction (off-label).',
    src:'Medikinet tablets SPC §4.2; Ritalin 10 mg SPC §4.2 (emc)',
    monitor:'Symptoms and adverse effects on standard scales (parent and teacher) at baseline and each dose change; HR and BP before and after each dose change (NICE 1.7.26, 1.8.9).',
    steps:[
      {when:'Week 1', dose:'5 mg OD–BD', detail:'Start low, e.g. 5 mg at breakfast ± 5 mg at lunch. Record baseline rating scales, HR, BP, height and weight on a centile chart.'},
      {when:'Week 2', dose:'5 mg BD → 10 mg + 5 mg', detail:'Increase the daily dose by 5 mg (or at most 10 mg) per week, e.g. 5 mg BD (10 mg/day) → 10 mg breakfast + 5 mg lunch (15 mg/day), if tolerated and response incomplete. Weekly telephone review with the specialist team is suggested by NICE (1.7.26).'},
      {when:'Week 3', dose:'10 mg BD (20 mg/day)', detail:'Each step adds no more than 5–10 mg to the total daily dose (SPC). Continue weekly increments while benefits rise and adverse effects remain tolerable. A third small afternoon dose may be used to cover homework time.'},
      {when:'Week 4+', dose:'15 mg BD → 20 mg BD', detail:'Keep stepping by 5–10 mg/day each week only while benefit is still rising. Reassess symptoms across settings (home and school). Watch appetite, sleep onset, mood, tics, HR/BP.'},
      {when:'Week 5+', dose:'up to 60 mg/day', detail:'Licensed daily maximum is 60 mg in divided doses. Once optimised, many children convert to a once-daily MR brand (prescribe by brand).', isMax:true},
      {when:'Week 6 review', dose:'Adequate trial?', detail:'NICE: if there is not enough benefit after a 6-week trial at an adequate dose, consider switching to lisdexamfetamine (1.7.8). SPC: stop if no improvement after appropriate adjustment over 1 month.'}
    ]
  },
  concerta: {
    name:'Concerta XL (OROS MR tablet) – child or adult',
    pop:'Children 6+ and adults', max:'54 mg/day children; 72 mg/day adults (SPC)',
    note:'SPC: start 18 mg once daily in the morning for those new to methylphenidate; adjust in 18 mg increments at approximately weekly intervals (27 mg strength available). Conversion: IR 5 mg TDS ≈ 18 mg; 10 mg TDS ≈ 36 mg; 15 mg TDS ≈ 54 mg; 20 mg TDS ≈ 72 mg. BNF (accessed 21 Oct 2026): Concerta XL max 108 mg/day in children (under specialist direction) and adults, above the 54/72 mg licence (off-label); Delmosart and Xaggitin XL max 54 mg/day in children and adults.',
    src:'Concerta XL SPC §4.2 (emc, revised 06/11/2025)',
    monitor:'HR, BP and weight before and after each dose change; symptoms; sleep and appetite.',
    steps:[
      {when:'Week 1', dose:'18 mg OM', detail:'Swallow whole with liquid; do not chew, divide or crush. May be taken with or without food. Ghost tablet shell may appear in stool — reassure.'},
      {when:'Week 2', dose:'36 mg OM (27 mg option)', detail:'SPC: dosage adjusted in 18 mg increments (18 → 36 mg) at about weekly intervals. A 27 mg strength is available for those who wish to prescribe between 18 mg and 36 mg.'},
      {when:'Week 3', dose:'54 mg OM', detail:'54 mg is the licensed maximum in children (stop here for under-18s). Evaluate effect across the whole 12-hour day.', isMax:true},
      {when:'Week 4 (adults)', dose:'72 mg OM', detail:'72 mg is the licensed adult maximum (e.g. 36 mg × 2 or 18 mg + 54 mg tablets).', isMax:true},
      {when:'Week 6 review', dose:'Adequate trial?', detail:'If effect wears off by mid-afternoon, NICE 1.7.22: consider adding IR methylphenidate later in the day. If insufficient benefit after 6 weeks at adequate dose → consider lisdexamfetamine (child 1.7.8, adult 1.7.12).'}
    ]
  },
  lisdex: {
    name:'Lisdexamfetamine (Elvanse) – child 6+ or adult',
    pop:'Children 6+ (after inadequate response to methylphenidate) and adults', max:'70 mg/day (SPC); max 50 mg/day if CrCl < 30 mL/min',
    note:'SPC: start 30 mg once daily in the morning (20 mg if clinician judges lower dose appropriate); increase by 10 or 20 mg at approximately weekly intervals. Elvanse Adult has been discontinued; the Elvanse licence now covers adults.',
    src:'Elvanse SPC §4.1–4.2 (emc, revised 02/10/2026)',
    monitor:'BP and pulse at each dose adjustment and at least 6-monthly; growth in children; psychiatric symptoms; misuse/diversion risk.',
    steps:[
      {when:'Week 1', dose:'30 mg OM', detail:'Or 20 mg if a lower start is appropriate. With or without food. Capsule may be opened and contents mixed in yoghurt, water or orange juice; take all immediately. Do not divide the contents of a capsule.'},
      {when:'Week 2', dose:'40–50 mg OM', detail:'Increase by 10–20 mg if response incomplete and tolerated. Avoid afternoon dosing (insomnia).'},
      {when:'Week 3', dose:'60 mg OM', detail:'Review appetite, sleep, anxiety, HR/BP.'},
      {when:'Week 4', dose:'70 mg OM', detail:'Licensed maximum 70 mg/day. Severe renal impairment: do not exceed 50 mg/day.', isMax:true},
      {when:'Week 6 review', dose:'Adequate trial?', detail:'Adults: if insufficient benefit after a 6-week trial, consider methylphenidate (1.7.13). If response but cannot tolerate the long effect, consider dexamfetamine (1.7.9 / 1.7.14). If intolerant of both stimulants or non-response to both → atomoxetine (adults) or atomoxetine/guanfacine (children).'}
    ]
  },
  dexamf: {
    name:'Dexamfetamine IR (e.g. Amfexa) – child 6–17 y',
    pop:'Children 6–17 y (licensed when methylphenidate response clinically inadequate; adult use is off-label)', max:'Usually 20 mg/day; 40 mg/day rarely needed (SPC)',
    note:'SPC: start 5 mg once or twice daily, increase by weekly increments of 5 mg. BNFC (accessed 21 Oct 2026): initially 2.5 mg 2–3 times a day, ↑ 5 mg weekly; usual max 1 mg/kg, up to 20 mg/day (40 mg/day has been required in some children); 2–4 divided doses. Tablets can be divided to aid swallowing (cross-scored; not for equal dose division). Taper on discontinuation.',
    src:'Amfexa SPC §4.2 (emc, revised 14/01/2026)',
    monitor:'HR/BP, growth, sleep, appetite, mood; misuse and diversion (IR, high street value).',
    steps:[
      {when:'Week 1', dose:'5 mg OD–BD', detail:'Breakfast ± lunch. Not too late after lunchtime to avoid sleep disturbance.'},
      {when:'Week 2', dose:'10 mg/day', detail:'Increase by 5 mg/day weekly as needed.'},
      {when:'Week 3', dose:'15 mg/day', detail:'Divide doses to cover the times when symptoms matter most (school, homework).'},
      {when:'Week 4', dose:'20 mg/day', detail:'Usual maximum in children/adolescents is 20 mg/day; up to 40 mg/day may rarely be needed.', isMax:true},
      {when:'Stopping', dose:'Taper', detail:'SPC: gradual reduction with monitoring; abrupt withdrawal after prolonged use can cause extreme fatigue, increased appetite and depression.'}
    ]
  },
  atx_adult: {
    name:'Atomoxetine – adult (or child > 70 kg)',
    pop:'Adults; children/adolescents over 70 kg', max:'100 mg/day (SPC)',
    note:'SPC: start 40 mg/day, maintain for a minimum of 7 days, then titrate; maintenance 80–100 mg/day in adults (80 mg in children > 70 kg). Children ≤ 70 kg: start ≈ 0.5 mg/kg/day, maintenance ≈ 1.2 mg/kg/day. Full effect can take several weeks. CYP2D6 inhibitors (fluoxetine, paroxetine) increase exposure 6–8-fold — slower titration/lower dose. BNF (accessed 21 Oct 2026): maximum 120 mg/day under specialist direction; above 100 mg/day is off-label.',
    src:'Atomoxetine 40 mg capsules SPC §4.2, 4.5 (emc)',
    monitor:'HR/BP after each dose change and at least 6-monthly; suicidal thoughts; signs of liver injury (jaundice, dark urine, RUQ pain); sexual dysfunction (NICE 1.8.15).',
    steps:[
      {when:'Days 1–7+', dose:'40 mg OD', detail:'Can be taken as a single morning dose, or split twice daily if nausea/somnolence.'},
      {when:'Week 2+', dose:'80 mg OD', detail:'Usual maintenance dose. Give enough time — atomoxetine effects build over weeks, unlike stimulants.'},
      {when:'Later', dose:'100 mg OD', detail:'Licensed maximum 100 mg/day. Hepatic impairment: Child-Pugh B 50%, Child-Pugh C 25% of usual dose.', isMax:true},
      {when:'Stopping', dose:'No mandatory taper; taper if stopping electively', detail:'SPC: no distinct withdrawal symptoms described; may be stopped abruptly in cases of significant adverse effects, otherwise tapered off over a suitable time period. Re-evaluate need beyond 1 year.'}
    ]
  },
  atx_child: {
    name:'Atomoxetine – child/adolescent 6+ up to 70 kg (weight-based)',
    pop:'Children 6+ and adolescents up to 70 kg (worked example: 30 kg)', maxLabel:'Dose limits', max:'Maintenance ≈ 1.2 mg/kg/day; no added benefit shown above 1.2 mg/kg/day; doses over 1.8 mg/kg/day not systematically evaluated (SPC)',
    note:'SPC: start at a total daily dose of approximately 0.5 mg/kg; keep the initial dose for a minimum of 7 days, then titrate up according to response and tolerability; recommended maintenance approximately 1.2 mg/kg/day. Once daily in the morning, or split (morning and late afternoon/early evening) if nausea or somnolence. Capsule strengths: 10, 18, 25, 40, 60, 80, 100 mg. Full effect builds over several weeks. BNFC (accessed 21 Oct 2026): maximum 1.8 mg/kg/day and 120 mg/day, high doses under specialist direction; doses above 100 mg/day are not licensed.',
    src:'Atomoxetine SPC §4.2 (emc 10332)',
    monitor:'Weight, height, HR and BP before and after each dose change and at least 6-monthly; suicidal thoughts and behaviour; signs of liver injury (jaundice, dark urine, right upper quadrant pain).',
    steps:[
      {when:'Days 1–7+', dose:'30 kg: 15 mg/day (≈0.5 mg/kg)', detail:'Worked example for a 30 kg child: 0.5 mg/kg × 30 kg = 15 mg. Capsules come as 10, 18, 25, 40, 60, 80 and 100 mg, so 15 mg cannot be given exactly; the specialist chooses the nearest practical dose (e.g. 10 mg or 18 mg). Keep the starting dose for at least 7 days.'},
      {when:'Week 2+', dose:'30 kg: 25 mg/day', detail:'Titrate up according to response and tolerability. Check HR, BP and weight; ask about nausea, appetite, somnolence and mood.'},
      {when:'Week 3+', dose:'30 kg: 36 mg/day (≈1.2 mg/kg)', detail:'Recommended maintenance ≈1.2 mg/kg/day = 36 mg for 30 kg (e.g. 18 mg twice daily, or 25 mg + 10 mg ≈ 35 mg once daily). Allow several weeks at maintenance before judging effect. This is the usual maintenance target, not a licensed maximum.', isTarget:true},
      {when:'Week 6+ review', dose:'Adequate trial?', detail:'Judge response after an adequate trial at maintenance. If no response to methylphenidate, lisdexamfetamine and a non-stimulant, NICE 1.7.16: obtain a second opinion or refer to a tertiary service.'},
      {when:'Stopping', dose:'No mandatory taper; taper if stopping electively', detail:'SPC: may be stopped abruptly for significant adverse effects; otherwise tapered off over a suitable time period. Re-evaluate need beyond 1 year.'}
    ]
  },
  guanf: {
    name:'Guanfacine MR (Intuniv) – child 6–17 y',
    pop:'Children and adolescents 6–17 y (adult use off-label and only with tertiary advice – NICE 1.7.17)', max:'4 mg (6–12 y); 4–7 mg by weight (13–17 y)',
    note:'SPC: start 1 mg once daily; increase by no more than 1 mg per week; maintenance 0.05–0.12 mg/kg/day. Adolescent maxima: 34–41.4 kg 4 mg; 41.5–49.4 kg 5 mg; 49.5–58.4 kg 6 mg; ≥ 58.5 kg 7 mg. Halve the dose with moderate/strong CYP3A4/5 inhibitors. With strong CYP3A4 inducers (e.g. carbamazepine, rifampicin, phenytoin) a re-titration to increase the dose up to a maximum of 7 mg/day may be considered; when the inducer is stopped, re-titrate down over the following weeks (SPC §4.2). Must TAPER on stopping (≤ 1 mg every 3–7 days) – rebound hypertension.',
    src:'Intuniv SPC §4.2, 4.4, 4.5 (emc, revised 5 March 2026)',
    monitor:'Weekly during titration for somnolence/sedation, hypotension and bradycardia; every 3 months in year 1; BMI/weight gain; QT risk with interacting drugs.',
    steps:[
      {when:'Week 1', dose:'1 mg OD', detail:'Morning or evening; do not crush, chew or break the tablet. Avoid high-fat meals at dosing and grapefruit juice. No alcohol.'},
      {when:'Week 2', dose:'2 mg OD', detail:'Increase by up to 1 mg/week as tolerated. Check HR and BP every week during titration.'},
      {when:'Week 3', dose:'3 mg OD', detail:'Sedation often appears early and may last 2–3 weeks.'},
      {when:'Week 4', dose:'4 mg OD', detail:'Maximum for 6–12 year-olds (≥ 25 kg).', isMax:true},
      {when:'Weeks 5–7 (adolescents)', dose:'5–7 mg OD', detail:'Weight-banded adolescent maxima (5 mg 41.5–49.4 kg; 6 mg 49.5–58.4 kg; 7 mg ≥ 58.5 kg after ≥ 1 week on 6 mg).'},
      {when:'Stopping', dose:'Taper ≤ 1 mg / 3–7 days', detail:'Never stop abruptly. Monitor BP and pulse during the taper to detect rebound hypertension and tachycardia.'}
    ]
  }
};
