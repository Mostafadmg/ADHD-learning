/* Young-person engine tests (AA.diagnosis: age bands, periods, criterion B for ages 6-11,
   collateral keys, band tool lists, band-aware step progress, treatment delegation).
   Usage from tests/run.js:  require('./young-tests.js')({ AA, ok, eq });
   ctx.ok(cond, msg) records a check; ctx.eq(actual, expected, msg) compares two values.
   The tests set their own synthetic AA.data collections and restore the originals afterwards,
   so they can run in any context that has ns.js, scoring.js and diagnosis.js loaded. */
'use strict';

module.exports = function (ctx) {
  const AA = ctx.AA, ok = ctx.ok;
  const eq = ctx.eq || ((x, y, m) => ok(x === y, m + ' (got ' + JSON.stringify(x) + ', expected ' + JSON.stringify(y) + ')'));
  const D = AA.diagnosis;
  const same = (x, y, m) => ok(JSON.stringify(x) === JSON.stringify(y), m + ' (got ' + JSON.stringify(x) + ', expected ' + JSON.stringify(y) + ')');
  if (!D) { ok(false, 'young: AA.diagnosis not loaded'); return; }

  /* ---------- synthetic data (restored at the end) ---------- */
  const KEYS = ['symptoms', 'impairment', 'ddx', 'tools', 'ageBands', 'history'];
  const saved = {};
  KEYS.forEach((k) => { saved[k] = { has: Object.prototype.hasOwnProperty.call(AA.data, k), v: AA.data[k] }; });
  const savedTreatment = { has: Object.prototype.hasOwnProperty.call(AA, 'treatment'), v: AA.treatment };

  const symptoms = [];
  for (let i = 1; i <= 9; i++) symptoms.push({ id: 'ia' + i, dim: 'IA' }, { id: 'hi' + i, dim: 'HI' });
  const DOMS = ['work', 'relationships', 'social', 'leisure', 'selfimage', 'daily', 'safety'];
  const ageBand = (extra) => Object.assign({
    screen: ['conners4', 'snap4', 'sdq', 'not_a_tool'], screenCore: ['conners4', 'sdq'],
    comorbid: ['sdq', 'rcads'], comorbidCore: ['sdq'],
    ddxCore: ['odd', 'asd', 'dep', 'missing_ddx'],
    impairmentLabels: { work: 'School and learning', relationships: 'Family and home' }
  }, extra || {});

  try {
    AA.data.symptoms = symptoms;
    AA.data.impairment = { domains: DOMS.map((id) => ({ id, label: 'Adult ' + id })) };
    AA.data.ddx = [
      { id: 'dep', name: 'Depression', core: true, features: [] },
      { id: 'bpd', name: 'Borderline personality disorder', core: true, features: [] },
      { id: 'asd', name: 'Autism', core: true, features: [] },
      { id: 'odd', name: 'Oppositional defiant disorder', core: false, features: [] },
      { id: 'osa', name: 'Sleep apnoea', core: false, features: [] }
    ];
    AA.data.tools = [
      { id: 'conners4', abbr: 'Conners 4', group: 'child', interactive: false, items: [] },
      { id: 'snap4', abbr: 'SNAP-IV', group: 'adhd-childhood', interactive: false, items: [] },
      { id: 'sdq', abbr: 'SDQ', group: 'child', interactive: false, items: [] },
      { id: 'rcads', abbr: 'RCADS', group: 'anxiety', interactive: false, items: [] },
      { id: 'asrs18', abbr: 'ASRS', group: 'adhd-screen', interactive: false, items: [] }
    ];
    AA.data.ageBands = {
      under6: { label: 'Under 6', stop: true },
      child: ageBand({ label: 'Child (6-11)' }),
      teen: ageBand({ label: 'Teen (12-16)' }),
      y17: ageBand({ label: 'Age 17' }),
      adult: { label: 'Adult', screen: ['asrs18'], screenCore: ['asrs18'], ddxCore: ['osa'] }
    };
    delete AA.treatment;

    const P = (age) => ({ patient: age === undefined ? {} : { age: age } });

    /* ---------- bands ---------- */
    const edges = [[5, 'under6'], [6, 'child'], [11, 'child'], [12, 'teen'], [16, 'teen'], [17, 'y17'], [18, 'adult'], [undefined, 'adult'], ['', 'adult'], ['9', 'child']];
    edges.forEach(([age, band]) => eq(D.band(P(age)), band, 'young: band for age ' + JSON.stringify(age)));
    eq(D.band(null), 'adult', 'young: band with no record is adult');
    eq(D.band({}), 'adult', 'young: band with no patient is adult');
    eq(D.age(P('14')), 14, 'young: age parsed from a string');
    eq(D.age(P()), null, 'young: age missing gives null');
    ok([6, 11, 12, 16, 17].every((n) => D.young(P(n))), 'young: true for 6, 11, 12, 16 and 17');
    ok(![5, 18, undefined].some((n) => D.young(P(n))), 'young: false under 6, at 18 and with age missing');

    /* ---------- threshold (unchanged): 6 under 17, 5 from 17 ---------- */
    same([5, 6, 11, 12, 16, 17, 18, undefined].map((n) => D.need(P(n))), [6, 6, 6, 6, 6, 5, 5, 5], 'young: need 6 under 17, 5 from 17 and when age is missing');

    /* ---------- band info, periods and labels ---------- */
    eq(D.bandInfo(P(8)).label, 'Child (6-11)', 'young: bandInfo reads AA.data.ageBands');
    eq(D.bandInfo(P(4)).stop, true, 'young: bandInfo for under 6 has stop');
    same(D.periods(P(8)), ['adult'], 'young: band child uses only the current period');
    same(D.periods(P(14)), ['adult', 'child'], 'young: band teen uses current and before 12');
    same(D.periods(P(17)), ['adult', 'child'], 'young: band y17 uses current and before 12');
    same(D.periods(P(30)), ['adult', 'child'], 'young: adult uses both periods');
    eq(D.periodLabel(P(8), 'adult'), 'Now (last 6 months)', 'young: current period label');
    eq(D.periodLabel(P(14), 'child'), 'Before age 12', 'young: before-12 period label');
    eq(D.periodLabel(P(30), 'adult'), 'Adulthood (last 6 months)', 'young: adult current label unchanged');
    eq(D.periodLabel(P(), 'child'), 'Childhood (age 5 to 12)', 'young: adult childhood label unchanged');

    /* ---------- tool lists ---------- */
    same(D.stepTools(P(8), 'screen'), ['conners4', 'snap4', 'sdq'], 'young: band screen list, unknown tool ids dropped');
    same(D.stepTools(P(14), 'comorbidCore'), ['sdq'], 'young: band comorbidity core list');
    same(D.stepTools(P(30), 'screenCore'), D.STEP_TOOLS.screenCore, 'young: adults keep D.STEP_TOOLS');
    same(D.stepTools(P(8), 'nonsense'), [], 'young: unknown key gives an empty list');

    /* ---------- criterion B, 8-year-old, 7 current inattention symptoms ---------- */
    const kid = { patient: { age: 8 }, symptoms: {}, onset: {}, impairment: { adult: {}, child: {} }, collateral: {}, ddx: {}, validity: {} };
    for (let i = 1; i <= 9; i++) { kid.symptoms['ia' + i] = { adult: i <= 7 ? 'yes' : 'no' }; kid.symptoms['hi' + i] = { adult: 'no' }; }
    let B = D.criterionB(kid);
    eq(B.status, 'pending', 'young: 8-year-old B pending until onset is answered');
    ok(B.fromCurrent === true && B.IA === 7, 'young: 8-year-old B judged from current counts');
    kid.onset.ageOnset = '5';
    B = D.criterionB(kid);
    eq(B.status, 'met', 'young: 8-year-old with 7 current IA symptoms and age of onset recorded meets B');
    kid.onset = { before12: 'yes' };
    eq(D.criterionB(kid).status, 'met', 'young: B met with before12 yes and current symptoms');
    kid.onset = { always: 'no', ageOnset: '7' };
    B = D.criterionB(kid);
    ok(B.status === 'met' && /sudden/.test(B.detail), 'young: "not always there" keeps B met but adds a sudden-start caution');
    kid.onset = { before12: 'unsure', ageOnset: '5' };
    eq(D.criterionB(kid).status, 'pending', 'young: onset "unsure" keeps B pending for a child');
    kid.onset = { before12: 'no' };
    B = D.criterionB(kid);
    ok(B.status === 'met' && B.abrupt === true && /another cause/.test(B.detail) && /criterion E/.test(B.detail), 'young: onset "no" (abrupt or recent start) keeps B met from current symptoms, with a red flag (DSM-5-TR B; ICD-11 abrupt onset)');
    kid.onset = { ageOnset: '6', duration6m: 'yes' };
    const A = D.criterionA(kid);
    ok(A.status === 'met' && /^Current/.test(A.detail) && !/Adulthood/.test(A.detail), 'young: A met and worded as current, not adulthood');
    eq(D.presentation(kid), 'ia', 'young: presentation from current counts');
    const few = { patient: { age: 9 }, symptoms: {}, onset: { ageOnset: '4' } };
    for (let i = 1; i <= 9; i++) { few.symptoms['ia' + i] = { adult: i <= 2 ? 'yes' : 'no' }; few.symptoms['hi' + i] = { adult: 'no' }; }
    eq(D.criterionB(few).status, 'not-met', 'young: B not met with fewer than 3 current symptoms when all are answered');

    /* Teenager: B still uses the before-12 period */
    const teen = { patient: { age: 14 }, symptoms: {}, onset: {} };
    for (let i = 1; i <= 9; i++) { teen.symptoms['ia' + i] = { adult: 'yes', child: i <= 4 ? 'yes' : 'no' }; teen.symptoms['hi' + i] = { adult: 'no', child: 'no' }; }
    eq(D.criterionB(teen).status, 'pending', 'young: teen B pending without before12');
    teen.onset.before12 = 'yes';
    B = D.criterionB(teen);
    ok(B.status === 'met' && /^Before age 12/.test(B.detail), 'young: teen B met from before-12 symptoms, worded "Before age 12"');

    /* ---------- impairment labels and criteria C/D wording ---------- */
    kid.impairment.adult = { work: { sev: 2 }, relationships: { sev: 1 } };
    const imp = D.impairment(kid, 'adult');
    ok(imp[0].label === 'School and learning' && imp[2].label === 'Adult social', 'young: band impairment labels, adult label as fallback');
    eq(D.impairment(P(30), 'adult')[0].label, 'Adult work', 'young: adults keep their labels');
    const C = D.criterionC(kid);
    ok(C.status === 'met' && /current area/.test(C.detail) && /School and learning/.test(C.detail) && C.settings.join(',') === 'school,home', 'young: C met from school and home, worded for current areas');
    /* Criterion C needs 2 settings: self-esteem and accidents are areas of impairment, not settings */
    const schoolOnly = { patient: { age: 8 }, impairment: { adult: {} }, collateral: {}, symptoms: {} };
    DOMS.forEach((d) => { schoolOnly.impairment.adult[d] = { sev: 0 }; });
    schoolOnly.impairment.adult.work = { sev: 2 }; schoolOnly.impairment.adult.selfimage = { sev: 1 }; schoolOnly.impairment.adult.safety = { sev: 1 };
    let C2 = D.criterionC(schoolOnly);
    ok(C2.status === 'not-met' && C2.settings.join(',') === 'school', 'young: school plus self-esteem and accidents -> C not met (one setting)');
    schoolOnly.collateral = { parent: 1 };
    C2 = D.criterionC(schoolOnly);
    ok(C2.status === 'met' && C2.fromSources.indexOf('home') >= 0, 'young: a parent report of symptoms at home adds the home setting');
    const adultC = { patient: { age: 30 }, impairment: { adult: { work: { sev: 2 }, selfimage: { sev: 1 } } } };
    eq(D.criterionC(adultC).status, 'met', 'young: adults keep the count of affected areas (DIVA)');
    ok(/current impairment/.test(D.criterionD(kid).detail), 'young: D worded as current impairment');

    /* ---------- setup progress: consent basis for young people ---------- */
    const su = (age, basis) => ({ patient: { ref: 'X', age: age, consent: true, young: { consentBasis: basis } } });
    ok(D.stepProgress(su(14, null), 'setup').of === 4 && D.stepProgress(su(14, null), 'setup').done === 3, 'young: setup needs a consent basis at 14');
    eq(D.stepProgress(su(14, 'gillick'), 'setup').done, 4, 'young: Gillick competence completes setup at 14');
    eq(D.stepProgress(su(14, 'capacity_16'), 'setup').done, 3, 'young: "capacity at 16" does not fit age 14');
    eq(D.stepProgress(su(17, 'capacity_16'), 'setup').done, 4, 'young: capacity at 16 completes setup at 17');
    eq(D.stepProgress(su(17, 'gillick'), 'setup').done, 3, 'young: Gillick does not fit age 17');
    ok(D.stepProgress(su(30, null), 'setup').of === 3 && D.stepProgress(su(30, null), 'setup').done === 3, 'young: adult setup unchanged');

    /* ---------- collateral ---------- */
    same(D.collateralKeys(kid), ['parent', 'school'], 'young: collateral keys parent and school');
    same(D.collateralKeys(P(30)), ['parent', 'partner', 'school'], 'young: adult collateral keys unchanged');
    eq(D.collateral({ patient: { age: 10 }, collateral: { partner: 2 } }).level, 'unavailable', 'young: partner rating ignored for a child');
    eq(D.collateral({ patient: { age: 30 }, collateral: { partner: 2 } }).level, 'clear', 'young: partner rating still counts for adults');
    eq(D.collateral({ patient: { age: 10 }, collateral: { school: 1 } }).level, 'some', 'young: school rating counts for a child');
    let pr = D.stepProgress({ patient: { age: 10 }, collateral: { parent: 2, partner: 1 } }, 'collateral');
    ok(pr.done === 1 && pr.of === 2, 'young: collateral progress counts parent and school only');
    pr = D.stepProgress({ patient: { age: 30 }, collateral: { parent: 2, partner: 1 } }, 'collateral');
    ok(pr.done === 2 && pr.of === 3, 'young: adult collateral progress unchanged');

    /* ---------- step progress for the interview steps ---------- */
    const kp = { patient: { age: 8 }, symptoms: {}, supplement: { iaAdult: 'yes', iaChild: 'yes' } };
    for (let i = 1; i <= 9; i++) kp.symptoms['ia' + i] = { adult: 'yes', child: 'yes' };
    pr = D.stepProgress(kp, 'ia');
    ok(pr.of === 10 && pr.done === 10, 'young: band child ia progress counts 9 current scores + 1 supplement (complete)');
    pr = D.stepProgress(kp, 'hi');
    ok(pr.of === 10 && pr.done === 0, 'young: band child hi progress out of 10');
    kp.patient.age = 13;
    pr = D.stepProgress(kp, 'ia');
    ok(pr.of === 20 && pr.done === 20, 'young: teen ia progress counts both periods');
    kp.patient.age = 40;
    eq(D.stepProgress(kp, 'ia').of, 20, 'young: adult ia progress unchanged');

    /* onset step: band child needs one onset answer, duration and current impairment only */
    const ko = { patient: { age: 7 }, onset: { ageOnset: '4', duration6m: 'yes' }, impairment: { adult: {}, child: {} } };
    DOMS.forEach((d) => { ko.impairment.adult[d] = { sev: 1 }; });
    pr = D.stepProgress(ko, 'onset');
    ok(pr.of === 2 + DOMS.length && pr.done === pr.of, 'young: band child onset progress complete without before-12 impairment');
    ko.patient.age = 15;
    pr = D.stepProgress(ko, 'onset');
    ok(pr.of === 3 + 2 * DOMS.length && pr.done < pr.of, 'young: teen onset progress needs both periods');

    /* screening and comorbidity: band core lists; entered results count */
    const ks = { patient: { age: 8 }, tools: { conners4: { result: { score: '72', cutoff: 'yes', rater: 'parent' } } } };
    pr = D.stepProgress(ks, 'screen');
    ok(pr.of === 2 && pr.done === 1, 'young: screen progress uses the band core list and counts an entered result');
    ks.tools.sdq = { result: { score: '', cutoff: 'unsure' } };
    eq(D.stepProgress(ks, 'screen').done, 2, 'young: a cut-off answer alone counts as recorded');
    eq(D.stepProgress(ks, 'comorbid').done, 1, 'young: comorbidity progress uses the band core list');
    ks.tools.rcads = { result: { score: '' } };
    ok(!D.toolDone(ks, 'rcads'), 'young: an empty result does not count');

    /* ---------- criterion E and the ddx step ---------- */
    const ke = { patient: { age: 8 }, ddx: { dep: { verdict: 'absent' } } };
    same(D.coreConditions(ke).map((c) => c.id), ['dep', 'asd', 'odd'], 'young: core differentials from ddxCore (unknown ids dropped, library order)');
    same(D.coreConditions(P(30)).map((c) => c.id), ['dep', 'bpd', 'asd'], 'young: adult core differentials unchanged');
    let E = D.criterionE(ke);
    ok(E.status === 'pending' && E.unreviewedCore.length === 2 && E.unreviewedCore.indexOf('Borderline personality disorder') < 0, 'young: E waits for the band core only, not personality disorders');
    ke.ddx.asd = { verdict: 'absent' }; ke.ddx.odd = { verdict: 'comorbid' };
    E = D.criterionE(ke);
    eq(E.status, 'met', 'young: E met when the band core is reviewed');
    ke.onset = { before12: 'no' };
    E = D.criterionE(ke);
    ok(E.status === 'pending' && E.abrupt === true && /Sudden or recent start/.test(E.detail), 'young: a sudden or recent start holds E at pending until a differential explains or excludes it');
    ke.onset.abruptNote = 'Bloods, sleep history and school events reviewed: no other cause found.';
    eq(D.criterionE(ke).status, 'met', 'young: E met once the sudden start has been reviewed');
    const ab = JSON.parse(JSON.stringify(kid));
    ab.onset = { before12: 'no', duration6m: 'yes' };
    eq(D.criterionB(ab).status, 'met', 'young: age 8, 7 inattentive symptoms, sudden start -> B met (not "criteria not met")');
    delete ke.onset;
    pr = D.stepProgress(ke, 'ddx');
    ok(pr.done === 3 && pr.of === 3, 'young: ddx progress uses the band core');

    /* ---------- confidence ---------- */
    const kc = JSON.parse(JSON.stringify(kid));
    kc.onset = { ageOnset: '5', duration6m: 'yes' };
    kc.collateral = { parent: 2, school: 2 };
    for (let i = 1; i <= 4; i++) kc.symptoms['ia' + i].by = { parent: 'yes', teacher: 'yes' };
    kc.symptoms.ia5.by = { parent: 'yes', teacher: 'unsure' };
    kc.tools = { conners4: { result: { score: '75', cutoff: 'yes', rater: 'teacher' } }, sdq: { result: { cutoff: 'no' } } };
    const ag = D.agreement(kc);
    ok(ag.pairs === 4 && ag.agree === 4 && ag.bothYes === 4, 'young: parent-teacher agreement counts only symptoms both rated yes or no');
    let cf = D.confidence(kc);
    const txt = cf.reasons.map((r) => r[0] + ' ' + r[1]).join(' | ');
    ok(/Parent and teacher agree on 4 of 4/.test(txt), 'young: confidence has a parent-teacher agreement line');
    ok(/Conners 4 \(teacher\)/.test(txt) && !/SDQ/.test(txt), 'young: an ADHD rating scale result agrees with the interview; SDQ is not used for this');
    ok(!/ASRS|WURS/.test(txt), 'young: no adult scale lines for young people');
    ok(!cf.reasons.some((r) => r[0] === '-'), 'young: nothing counts against a young person for missing adult scales');
    kc.symptoms.ia1.by.teacher = 'no'; kc.symptoms.ia2.by.teacher = 'no';
    cf = D.confidence(kc);
    ok(cf.reasons.some((r) => r[0] === '!' && /disagree on 2 of 4/.test(r[1])), 'young: parent-teacher disagreement is flagged');
    eq(D.agreement({ patient: { age: 30 }, symptoms: {} }).pairs, 0, 'young: no per-source ratings gives no agreement line');

    /* ---------- DIVA 2.0 view ---------- */
    eq(D.diva2(kid).applies, false, 'young: DIVA 2.0 view does not apply under 18');
    eq(D.diva2(P(30)).applies, true, 'young: DIVA 2.0 view applies to adults');

    /* ---------- history step: only the sections shown at this age ---------- */
    AA.data.history = [
      { id: 'presenting', items: [] },
      { id: 'work', ages: 'adult', items: [] },
      { id: 'schoolnow', ages: 'young', items: [] },
      { id: 'substance', bands: ['teen', 'y17', 'adult'], items: [] },
      { id: 'family', ages: 'all', items: [] }
    ];
    const hx = (age, ids) => { const h = {}; ids.forEach((id) => { h[id] = { none: true }; }); return { patient: { age: age }, history: h }; };
    pr = D.stepProgress(hx(8, ['presenting', 'schoolnow', 'family']), 'history');
    ok(pr.of === 3 && pr.done === 3, 'young: history progress for an 8-year-old counts presenting, school and family only (no adult or teen+ section)');
    pr = D.stepProgress(hx(14, ['presenting', 'schoolnow', 'family', 'work']), 'history');
    ok(pr.of === 4 && pr.done === 3, 'young: history progress for a 14-year-old adds the teen+ section and ignores the adult one');
    pr = D.stepProgress(hx(30, ['presenting', 'work', 'substance', 'family']), 'history');
    ok(pr.of === 4 && pr.done === 4, 'young: adult history progress counts adult, all-age and banded sections');
    ok(D.forAge(P(17), { bands: ['y17', 'adult'] }) && !D.forAge(P(16), { bands: ['y17', 'adult'] }) && !D.forAge(P(9), { ages: 'adult' }) && D.forAge(P(), { ages: 'adult' }), 'young: D.forAge reads ages and bands');

    /* ---------- without band data ---------- */
    AA.data.ageBands = undefined;
    same(D.bandInfo(P(8)), {}, 'young: bandInfo falls back to {} without ageBands');
    AA.data.tools = [
      { id: 'asrs18', group: 'adhd-screen', stage: ['referral', 'pre'], ageMin: 18, ageMax: 120 },
      { id: 'conners4', group: 'child', stage: ['referral', 'pre', 'collateral'], ageMin: 6, ageMax: 18 },
      { id: 'vanderbilt', group: 'child', stage: ['pre', 'collateral'], ageMin: 6, ageMax: 12 },
      { id: 'wfirs', group: 'adhd-impairment', stage: ['referral', 'pre'], ageMin: 12, ageMax: 120 },
      { id: 'ydiva5', group: 'adhd-interview', stage: ['interview'], ageMin: 5, ageMax: 17 },
      { id: 'noage', group: 'child', stage: ['pre'] },
      { id: 'phq9', group: 'mood', stage: ['pre', 'comorbid'], ageMin: 18, ageMax: 120 },
      { id: 'mfq', group: 'mood', stage: ['pre', 'comorbid'], ageMin: 6, ageMax: 19 },
      { id: 'phqa', group: 'mood', stage: ['comorbid'], ageMin: 11, ageMax: 17 },
      { id: 'sdq', group: 'child', stage: ['pre', 'collateral', 'comorbid'], ageMin: 2, ageMax: 17 },
      { id: 'cssrs', group: 'risk', stage: ['risk', 'comorbid'], ageMin: 6, ageMax: 120 }
    ];
    same(D.stepTools(P(8), 'screen'), ['conners4', 'vanderbilt', 'sdq'], 'young: no band list -> ADHD scales whose age range covers 8 (no adult list, no tool without an age range)');
    same(D.stepTools(P(14), 'screen'), ['conners4', 'wfirs', 'sdq'], 'young: no band list -> age-fitting ADHD scales for 14');
    same(D.stepTools(P(8), 'comorbid'), ['mfq'], 'young: no band list -> age-fitting comorbidity scales for 8 (not SDQ, already a screen; not C-SSRS)');
    same(D.stepTools(P(14), 'comorbid'), ['mfq', 'phqa'], 'young: no band list -> age-fitting comorbidity scales for 14');
    same(D.stepTools(P(8), 'screenCore'), [], 'young: no band list -> no core tools (every tool optional)');
    same(D.stepTools(P(30), 'screenCore'), D.STEP_TOOLS.screenCore, 'young: adults keep D.STEP_TOOLS without band data');
    pr = D.stepProgress({ patient: { age: 8 }, tools: { vanderbilt: { result: { cutoff: 'yes' } } } }, 'screen');
    ok(pr.done === 1 && pr.of === 1, 'young: screen progress without band data: any age-fitting tool with a result completes it');
    same(D.coreConditions(P(8)).map((c) => c.id), ['dep', 'bpd', 'asd'], 'young: core differentials fall back to the core flag without band data');
    eq(D.criterionB(kid).fromCurrent, true, 'young: criterion B for 6-11 works without band data');

    /* ---------- delegation to the treatment engine ---------- */
    eq(D.stepProgress(kid, 'txplan').of, 1, 'young: unknown step without AA.treatment gives {done:0, of:1}');
    const seen = [];
    AA.treatment = { stepProgress: function (a, id) { seen.push(id); return id === 'txplan' ? { done: 1, of: 2 } : id === 'monitor' ? { done: 0, of: 0 } : null; } };
    pr = D.stepProgress(kid, 'txplan');
    ok(pr.done === 1 && pr.of === 2, 'young: treatment step progress delegated to AA.treatment.stepProgress');
    pr = D.stepProgress(kid, 'monitor');
    ok(pr.done === 0 && pr.of === 0, 'young: a not-applicable treatment step ({done:0, of:0}) is passed through');
    pr = D.stepProgress(kid, 'nothing_here');
    ok(pr.done === 0 && pr.of === 1, 'young: null from the treatment engine falls back to {done:0, of:1}');
    pr = D.stepProgress(kid, 'validity');
    ok(seen.indexOf('validity') < 0 && pr.of === 1, 'young: diagnosis steps are not delegated');
  } finally {
    KEYS.forEach((k) => { if (saved[k].has) AA.data[k] = saved[k].v; else delete AA.data[k]; });
    if (savedTreatment.has) AA.treatment = savedTreatment.v; else delete AA.treatment;
  }

  /* 16-17 who lack capacity: decided in their best interests by a person with parental responsibility */
  (function () {
    const rec = { patient: { ref: 'x', age: 16, consent: true, young: { consentBasis: 'lacks_capacity_16' } }, symptoms: {}, onset: {}, impairment: { adult: {}, child: {} }, collateral: {}, ddx: {}, validity: {} };
    const pr = D.stepProgress(rec, 'setup');
    const ref = D.stepProgress(Object.assign({}, rec, { patient: Object.assign({}, rec.patient, { young: { consentBasis: 'capacity_16' } }) }), 'setup');
    ok(pr.done === ref.done, 'young: lacks_capacity_16 counts as a valid consent basis at 16 (' + pr.done + ' vs ' + ref.done + ')');
  })();
};
