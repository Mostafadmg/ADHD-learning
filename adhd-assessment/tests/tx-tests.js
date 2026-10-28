/* Treatment engine tests (AA.treatment). Called by tests/run.js as require('./tx-tests.js')(ctx)
   with ctx = { AA, ok(cond, msg), eq(actual, expected, msg) } after js/core/ns.js, the engines
   and js/engine/treatment.js are loaded. Builds small synthetic AA.data fixtures and restores the
   real collections afterwards, so it can run before or after the data validation. */
'use strict';
module.exports = function (ctx) {
  const AA = ctx.AA, ok = ctx.ok;
  const eq = ctx.eq || ((a, b, m) => ok(a === b, m + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'));
  const T = AA.treatment;
  ok(!!T, 'tx: AA.treatment is loaded');
  if (!T) return;

  const KEYS = ['txDrugs', 'txProducts', 'txSequence', 'txPlanItems', 'txCardiac', 'txCautions', 'txSideEffects', 'txCounsel', 'txRxChecks', 'txMonitor', 'risk'];
  const saved = {};
  KEYS.forEach((k) => { saved[k] = AA.data[k]; });
  try {
    run();
  } finally {
    KEYS.forEach((k) => { if (saved[k] === undefined) delete AA.data[k]; else AA.data[k] = saved[k]; });
  }

  function run() {
    /* ---------- synthetic data (shapes from the build contract, section 3) ---------- */
    AA.data.txDrugs = [
      { id: 'mph', name: 'Methylphenidate', cls: 'Stimulant', isCD: true, ci: ['ci_glaucoma', 'ci_maoi'], caution: ['ci_tics'], se: ['se_appetite', 'se_psychosis'], trial: { weeks: 6 } },
      { id: 'lisdex', name: 'Lisdexamfetamine', cls: 'Stimulant', isCD: true, ci: ['ci_glaucoma', 'ci_maoi'], caution: ['ci_tics'], se: ['se_appetite'], trial: { weeks: 6 } },
      { id: 'dex', name: 'Dexamfetamine', cls: 'Stimulant', isCD: true, ci: ['ci_glaucoma', 'ci_maoi', 'ci_tics'], caution: [], se: [], trial: { weeks: 6 } },
      { id: 'atx', name: 'Atomoxetine', cls: 'Non-stimulant', isCD: false, ci: ['ci_maoi'], caution: ['ci_glaucoma'], se: [], trial: { weeks: 6 } },
      { id: 'gxr', name: 'Guanfacine', cls: 'Non-stimulant', isCD: false, ci: [], caution: [], se: [], trial: { weeks: 6 } }
    ];
    AA.data.txCautions = [
      { id: 'ci_glaucoma', t: 'Glaucoma', hist: ['physical_glaucoma'], src: 'SmPC 4.3' },
      { id: 'ci_maoi', t: 'MAOI now or in the last 14 days', src: 'SmPC 4.3' },
      { id: 'ci_tics', t: 'Tics or Tourette syndrome', src: 'SmPC 4.4' }
    ];
    AA.data.txCardiac = [
      { id: 'cx_chd', t: 'Congenital heart disease or previous heart surgery', hist: ['physical_congenital'], action: 'cardiology', src: 'NICE NG87 1.7.5' },
      { id: 'cx_faint', t: 'Fainting on exertion', action: 'cardiology', src: 'NICE NG87 1.7.5' },
      { id: 'cx_med', t: 'A coexisting condition treated with a medicine that may increase cardiac risk', action: 'ecg', src: 'NICE NG87 1.7.4' }
    ];
    AA.data.txProducts = [
      { id: 'concerta', drug: 'mph', name: 'Concerta XL', form: 'Prolonged-release tablet', strengths: [18, 27, 36, 54], unit: 'mg',
        licensed: { child: true, adultStart: true, adultContinue: true }, diversionLower: true, take: 'Once each morning',
        dose: { child: { start: 18, step: 18, every: 'week', max: 54, perDay: 1 }, adult: { start: 18, step: 18, every: 'week', max: 72, perDay: 1 } },
        bnf: { child: 'up to 108 mg', adult: 'up to 108 mg' } },
      { id: 'matoride', drug: 'mph', name: 'Matoride XL', form: 'Prolonged-release tablet', strengths: [18, 36, 54], unit: 'mg',
        licensed: { child: true, adultStart: false, adultContinue: true }, diversionLower: true,
        dose: { child: { start: 18, step: 18, every: 'week', max: 54, perDay: 1 } } },
      { id: 'ritalin', drug: 'mph', name: 'Ritalin', form: 'Tablet', release: 'Immediate release', strengths: [10], unit: 'mg',
        licensed: { child: true, adultStart: true, adultContinue: true },
        dose: { child: { start: 10, step: [5, 10], every: 'week', max: 60, perDay: 2, note: 'Start 5 mg once or twice a day.' }, adult: { start: 20, step: 20, every: 'week', max: 80, perDay: 2 } } },
      { id: 'elvanse', drug: 'lisdex', name: 'Elvanse', form: 'Capsule', strengths: [20, 30, 40, 50, 60, 70], unit: 'mg',
        licensed: { child: true, adultStart: true, adultContinue: true }, diversionLower: true, take: 'Once each morning',
        dose: { child: { start: 30, step: [10, 20], every: 'week', max: 70, perDay: 1 }, adult: { start: 30, step: [10, 20], every: 'week', max: 70, perDay: 1 } } },
      { id: 'atomoxetine', drug: 'atx', name: 'Atomoxetine', form: 'Capsule', strengths: [10, 18, 25, 40, 60, 80, 100], unit: 'mg',
        licensed: { child: true, adultStart: true, adultContinue: true },
        dose: { child: { mgPerKg: { start: 0.5, target: 1.2 }, overKg: 70, overStart: 40, overTarget: 80, max: 100, perDay: 1 },
                adult: { start: 40, target: 80, max: 100, perDay: 1 } } },
      { id: 'intuniv', drug: 'gxr', name: 'Intuniv', form: 'Prolonged-release tablet', strengths: [1, 2, 3, 4], unit: 'mg',
        licensed: { child: true, adultStart: false, adultContinue: false },
        dose: { child: { start: 1, step: 1, every: 'week', targetMgPerKg: [0.05, 0.12], perDay: 1,
          maxTable: [ { ageMin: 6, ageMax: 12, kgMin: 25, max: 4 }, { ageMin: 13, ageMax: 17, kgMin: 34, kgMax: 41.4, max: 4 },
            { ageMin: 13, ageMax: 17, kgMin: 41.5, kgMax: 49.4, max: 5 }, { ageMin: 13, ageMax: 17, kgMin: 49.5, kgMax: 58.4, max: 6 },
            { ageMin: 13, ageMax: 17, kgMin: 58.5, max: 7, note: 'After at least 1 week on 6 mg and a review.' } ] } } }
    ];
    AA.data.txSideEffects = [
      { id: 'se_appetite', t: 'Reduced appetite or weight loss', action: 'Give it with or after food; consider extra meals.', src: 'NICE NG87 1.8.6' },
      { id: 'se_psychosis', t: 'Psychotic or manic symptoms', action: 'Stop', src: 'NICE NG87 1.7.19' }
    ];
    AA.data.txRxChecks = [
      { id: 'rx_dose', cd: false, t: 'Dose stated' },
      { id: 'rx_qty_words', cd: true, t: 'Total quantity in words and figures' }
    ];
    AA.data.txCounsel = [{ id: 'cs_all', drugs: 'all', t: 'How to take it' }, { id: 'cs_cd', drugs: ['mph', 'lisdex', 'dex'], t: 'Controlled drug rules' }];
    AA.data.txPlanItems = [{ id: 'tp_info', ages: 'all', t: 'Information' }, { id: 'tp_parent', ages: 'young', t: 'Parent support' }, { id: 'tp_psych', ages: 'adult', t: 'Psychological support' }];
    AA.data.txMonitor = {
      young: [
        { id: 'mn_height', what: 'Height on a growth chart', freq: 'Every 6 months', months: 6 },
        { id: 'mn_weight_u10', what: 'Weight', freq: 'Every 3 months', ageMax: 10, months: 3 },
        { id: 'mn_weight_o10', what: 'Weight', freq: 'At 3 and 6 months, then every 6 months', ageMin: 11, schedule: [3, 6], months: 6 },
        { id: 'mn_bp', what: 'Pulse and blood pressure', freq: 'Every 6 months', months: 6 }
      ],
      adult: [{ id: 'mn_weight', what: 'Weight', freq: 'Every 6 months', months: 6 }, { id: 'mn_bp', what: 'Pulse and blood pressure', freq: 'Every 6 months', months: 6 }]
    };
    delete AA.data.txSequence;   /* exercise the built-in NICE sequence */

    const rec = (age, extra) => Object.assign({ patient: { age: age }, formulation: { decision: 'met' }, history: {}, treatment: {} }, extra || {});

    /* ---------- age groups ---------- */
    [[5, 'under6', 'under6'], [6, 'young', 'child'], [11, 'young', 'child'], [12, 'young', 'teen'], [16, 'young', 'teen'], [17, 'young', 'y17'], [18, 'adult', 'adult'], ['', 'adult', 'adult']].forEach(([age, g, b]) => {
      eq(T.group(rec(age)), g, 'tx group at age ' + JSON.stringify(age));
      eq(T.band(rec(age)), b, 'tx band at age ' + JSON.stringify(age));
    });
    eq(T.group({ patient: {} }), 'adult', 'tx group: age missing -> adult');

    /* ---------- applicability ---------- */
    ok(T.applicable(rec(30)).ok === true, 'tx applicable when ADHD met');
    ok(T.applicable(rec(30, { formulation: { decision: 'other-specified' } })).ok === true, 'tx applicable for other specified ADHD');
    ok(T.applicable(rec(30, { formulation: { decision: 'not-met' } })).ok === false, 'tx not applicable when not met');
    ok(T.applicable(rec(5)).ok === false && T.applicable(rec(5)).code === 'under6', 'tx never applicable under 6');

    /* ---------- bpCheck adults ---------- */
    const A = rec(30);
    eq(T.bpCheck(A, { sbp: 139, dbp: 89 }).level, 'ok', 'bp 139/89 ok');
    eq(T.bpCheck(A, { sbp: 140, dbp: 80 }).level, 'confirm', 'bp systolic 140 confirm');
    eq(T.bpCheck(A, { sbp: 130, dbp: 90 }).level, 'confirm', 'bp diastolic 90 confirm');
    eq(T.bpCheck(A, { sbp: 180, dbp: 100 }).level, 'urgent', 'bp systolic 180 urgent');
    eq(T.bpCheck(A, { sbp: 150, dbp: 120 }).level, 'urgent', 'bp diastolic 120 urgent');
    eq(T.bpCheck(A, { sbp: 150, dbp: 95, abpm: 'hypertensive' }).level, 'refer', 'bp confirmed hypertension -> refer (1.7.5)');
    eq(T.bpCheck(A, { sbp: 150, dbp: 95, abpm: 'normal' }).level, 'ok', 'bp raised clinic but normal ABPM -> ok');
    /* NICE NG136 1.2.2: with a second reading, the LOWER of the two is the clinic blood pressure */
    let bpr = T.bpCheck(A, { sbp: 150, dbp: 95, repeat: { sbp: 132, dbp: 84 } });
    ok(bpr.level === 'ok' && /Clinic blood pressure 132\/84/.test(bpr.text) && /lower of the two readings/.test(bpr.text) && /NG136 1\.2\.2/.test(bpr.src), 'bp: repeat lower -> the repeat is the clinic reading, and the text says why');
    bpr = T.bpCheck(A, { sbp: 132, dbp: 84, repeat: { sbp: 146, dbp: 88 } });
    ok(bpr.level === 'ok' && /Clinic blood pressure 132\/84/.test(bpr.text), 'bp: repeat higher than the first -> the lower (first) reading is used');
    bpr = T.bpCheck(A, { sbp: 150, dbp: 85, repeat: { sbp: 145, dbp: 95 } });
    ok(bpr.level === 'confirm' && /Clinic blood pressure 145\/95/.test(bpr.text), 'bp: the reading with the lower systolic is used with its own diastolic (95 -> confirm)');
    bpr = T.bpCheck(A, { sbp: 138, dbp: 92, repeat: { sbp: 142, dbp: 80 } });
    ok(bpr.level === 'confirm' && /Clinic blood pressure 138\/92/.test(bpr.text), 'bp: lower systolic reading 138/92 still raised on its diastolic');
    bpr = T.bpCheck(A, { sbp: 150, dbp: 90, repeat: { sbp: 150, dbp: 84 } });
    ok(/Clinic blood pressure 150\/84/.test(bpr.text), 'bp: same systolic -> the lower diastolic reading');
    bpr = T.bpCheck(A, { sbp: 185, dbp: 100, repeat: { sbp: 150, dbp: 90 } });
    ok(bpr.level === 'confirm' && /first reading was 180\/120 or higher/.test(bpr.text) && /third reading/.test(bpr.text) && /NG136 1\.2\.2/.test(bpr.src), 'bp: first reading 180/120+ with a lower repeat -> confirm with a third reading (NG136 1.2.2)');
    bpr = T.bpCheck(A, { sbp: 182, dbp: 100 });
    ok(bpr.level === 'urgent' && /papilloedema|optic disc/.test(bpr.text) && /7 days/.test(bpr.text) && /1\.5\.1–1\.5\.3/.test(bpr.src), 'bp: urgent text gives the NG136 same-day criteria and the 7-day review');
    bpr = T.bpCheck(A, { sbp: 150, dbp: 90, repeat: { sbp: 184, dbp: 100 } });
    ok(bpr.level === 'confirm' && /third reading/.test(bpr.text), 'bp: second reading 180/120+ and the first lower -> confirm with a third reading (NG136 1.2.2)');
    bpr = T.bpCheck(A, { sbp: 150, dbp: 95 });
    ok(bpr.level === 'confirm' && /Take a second reading/.test(bpr.text), 'bp: one raised reading -> take a second reading, then ABPM');
    eq(T.bpCheck(A, {}).level, 'unknown', 'bp missing -> unknown');
    ok(T.bpCheck(A, { sbp: 120, dbp: 80, pulse: 125 }).pulse.level === 'watch', 'pulse over 120 -> watch note (clinical practice)');
    ok(T.bpCheck(A, { sbp: 120, dbp: 80, pulse: 110 }).pulse === null, 'pulse 110 -> no note');

    /* ---------- bpCheck young ---------- */
    const Y = rec(9);
    eq(T.bpCheck(Y, { bpCentile: 'gt95_sustained' }).level, 'refer', 'young bp >95th sustained -> refer (1.7.6)');
    eq(T.bpCheck(Y, { bpCentile: 'gt95_once' }).level, 'repeat', 'young bp >95th once -> repeat');
    eq(T.bpCheck(Y, { bpCentile: '90to95' }).level, 'ok', 'young bp 90-95th -> ok with watch text');
    eq(T.bpCheck(Y, { bpCentile: 'lt90' }).level, 'ok', 'young bp <90th -> ok');
    eq(T.bpCheck(Y, { sbp: 150, dbp: 95 }).level, 'unknown', 'young bp without centile -> unknown');
    ok(/1\.7\.6/.test(T.bpCheck(Y, { bpCentile: 'gt95_sustained' }).src), 'young refer cites 1.7.6');

    /* ---------- baselineVerdict ---------- */
    const fullAdult = () => ({ date: '2026-10-01', sbp: 122, dbp: 78, pulse: 72, heightCm: 170, weightKg: 70,
      cardiac: { cx_chd: 'no', cx_faint: 'no', cx_med: 'no' }, ci: { ci_glaucoma: 'no', ci_maoi: 'no', ci_tics: 'no' },
      meds: 'None', misuse: 'low', pregnancy: 'na', driving: 'no' });
    let B = rec(30, { treatment: { baseline: fullAdult() } });
    let v = T.baselineVerdict(B);
    ok(v.level === 'ok' && v.missing.length === 0, 'baseline complete and clear -> ok (missing: ' + v.missing.join(', ') + ')');
    B.treatment.baseline.cardiac.cx_chd = 'yes';
    v = T.baselineVerdict(B);
    ok(v.level === 'cardiology' && v.reasons[0].level === 'cardiology', 'baseline with a 1.7.5 item -> cardiology');
    B.treatment.baseline.cardiology = 'cleared';
    eq(T.baselineVerdict(B).level, 'ok', 'baseline 1.7.5 item with cardiology cleared -> ok');
    B = rec(30, { treatment: { baseline: Object.assign(fullAdult(), { cardiac: { cx_faint: 'no', cx_med: 'no' } }) }, history: { physical: { checks: { physical_congenital: true } } } });
    v = T.baselineVerdict(B);
    ok(v.level === 'cardiology' && /from history/.test(v.reasons[0].text), 'baseline: unanswered 1.7.5 item pre-filled yes from history');
    ok(T.cardiacAnswer(B, 'cx_chd').fromHistory === true, 'cardiacAnswer flags the history pre-fill');
    B.treatment.baseline.cardiac.cx_chd = 'no';
    eq(T.baselineVerdict(B).level, 'ok', 'baseline: an explicit "no" overrides the history pre-fill');
    B = rec(30, { treatment: { baseline: Object.assign(fullAdult(), { cardiac: { cx_chd: 'no', cx_faint: 'no', cx_med: 'yes' } }) } });
    eq(T.baselineVerdict(B).level, 'ecg', 'baseline: ECG-only item -> ecg');
    B.treatment.baseline.ecg = 'normal';
    eq(T.baselineVerdict(B).level, 'ok', 'baseline: ECG normal -> ok');
    B = rec(30, { treatment: { baseline: Object.assign(fullAdult(), { sbp: 182, dbp: 100 }) } });
    eq(T.baselineVerdict(B).level, 'stop', 'baseline: 180/120 -> stop');
    B = rec(30, { treatment: { baseline: Object.assign(fullAdult(), { sbp: 145, dbp: 85 }) } });
    v = T.baselineVerdict(B);
    ok(v.level === 'incomplete' && v.missing.some((m) => /ABPM/.test(m)), 'baseline: raised clinic BP needs an ABPM/HBPM result');
    B.treatment.baseline.abpm = 'hypertensive';
    eq(T.baselineVerdict(B).level, 'cardiology', 'baseline: confirmed adult hypertension -> cardiology');
    B = rec(30, { treatment: { baseline: Object.assign(fullAdult(), { ci: { ci_glaucoma: 'yes', ci_maoi: 'no', ci_tics: 'no' } }) } });
    v = T.baselineVerdict(B);
    ok(v.level === 'caution' && /rules out Methylphenidate/.test(String(v.reasons[0])), 'baseline: glaucoma -> caution naming the ruled-out medicines');
    v = T.baselineVerdict(rec(30, { treatment: {} }));
    ok(v.level === 'incomplete' && v.missing.length >= 8 && v.of > v.done, 'baseline empty -> incomplete with missing items');
    v = T.baselineVerdict(rec(9, { treatment: { baseline: { sbp: 100, dbp: 60 } } }));
    ok(v.missing.some((m) => /centile/.test(m)) && !v.missing.some((m) => /Driving|Pregnancy/.test(m)), 'baseline 9-year-old: centile asked; no driving or pregnancy item');
    v = T.baselineVerdict(rec(17, { treatment: {} }));
    ok(v.missing.some((m) => /Driving/.test(m)) && v.missing.some((m) => /Pregnancy/.test(m)), 'baseline 17-year-old: driving and pregnancy asked');

    /* ---------- cautionsFor ---------- */
    let C = rec(30, { treatment: { baseline: { ci: { ci_glaucoma: 'yes' }, misuse: 'high', pregnancy: 'breastfeeding' } } });
    let cf = T.cautionsFor(C, 'mph');
    ok(cf.some((c) => c.id === 'ci_glaucoma' && c.level === 'ci'), 'cautionsFor: glaucoma is a contraindication for methylphenidate');
    ok(cf.some((c) => c.id === 'misuse_risk') && cf.some((c) => c.id === 'preg_breastfeeding'), 'cautionsFor: misuse and breastfeeding added');
    cf = T.cautionsFor(C, 'atx');
    ok(cf.some((c) => c.id === 'ci_glaucoma' && c.level === 'caution') && !cf.some((c) => c.id === 'misuse_risk'), 'cautionsFor: glaucoma is a caution for atomoxetine; no stimulant misuse line');
    C = rec(30, { treatment: { baseline: { pregnancy: 'no', contraception: false } } });
    ok(T.cautionsFor(C, 'gxr').some((c) => c.id === 'preg_contraception'), 'cautionsFor: guanfacine without contraception');

    /* ---------- options (NICE sequence) ---------- */
    const st = (opts, drug) => (opts.find((o) => o.drugs.indexOf(drug) >= 0 && o.action !== 'tertiary') || {}).status;
    let O = T.options(rec(10));
    ok(O.length === 5 && O[0].status === 'next' && O[0].drugs[0] === 'mph' && O[1].status === 'blocked', 'options young: methylphenidate first, lisdexamfetamine blocked');
    O = T.options(rec(10, { treatment: { prior: { p1: { drug: 'mph', outcome: 'no_response', adequate: true, weeks: 6 } } } }));
    ok(O[0].status === 'done' && O[1].status === 'next' && O[1].drugs[0] === 'lisdex' && O[3].status === 'blocked', 'options young after MPH adequate trial failed: lisdexamfetamine next (1.7.8)');
    O = T.options(rec(10, { treatment: { prior: { p1: { drug: 'mph', outcome: 'partial', adequate: false } } } }));
    ok(O[0].status === 'next' && O[1].status === 'blocked', 'options young: an inadequate MPH trial must be finished first');
    O = T.options(rec(10, { treatment: { prior: { p1: { drug: 'mph', outcome: 'not_tolerated' } } } }));
    ok(O[3].status === 'next' && O[1].status === 'possible', 'options young after MPH intolerance: atomoxetine or guanfacine next (1.7.10)');
    O = T.options(rec(10, { treatment: { prior: { p1: { drug: 'mph', outcome: 'no_response', adequate: true }, p2: { drug: 'lisdex', outcome: 'no_response', adequate: true }, p3: { drug: 'atx', outcome: 'no_response', adequate: true } } } }));
    ok(O[4].status === 'tertiary' && O[3].status === 'possible', 'options young: stimulant and non-stimulant failed -> tertiary (1.7.16)');
    O = T.options(rec(30));
    ok(O[0].status === 'next' && O[1].status === 'blocked' && O[3].status === 'blocked', 'options adult: first choice lisdexamfetamine or methylphenidate');
    O = T.options(rec(30, { treatment: { prior: { p1: { drug: 'mph', outcome: 'no_response', adequate: true } } } }));
    ok(O[0].status === 'done' && O[1].status === 'next' && O[1].why.indexOf('Lisdexamfetamine') < 0 && /1\.7\.12/.test(O[1].why), 'options adult after MPH failed: switch to lisdexamfetamine (1.7.12)');
    O = T.options(rec(30, { treatment: { prior: { p1: { drug: 'mph', outcome: 'no_response', adequate: true }, p2: { drug: 'lisdex', outcome: 'partial', adequate: true } } } }));
    ok(O[0].status === 'done' && O[1].status === 'done' && st(O, 'atx') === 'next' && O[4].status === 'blocked', 'options adult after both stimulants failed: atomoxetine next (1.7.15)');
    ok(O.every((o) => o.drugs.indexOf('gxr') < 0), 'options adult: guanfacine is not in the adult sequence');
    O = T.options(rec(30, { treatment: { prior: { p1: { drug: 'lisdex', outcome: 'not_tolerated' } } } }));
    ok(st(O, 'atx') === 'next' && O[2].status === 'possible', 'options adult after lisdexamfetamine intolerance: atomoxetine next, dexamfetamine possible (1.7.14)');
    eq(T.options(rec(4)).length, 0, 'options: none under 6');
    AA.data.txSequence = { young: [{ n: 1, drugs: ['mph'], when: 'First', clause: '1.7.7' }], adult: [{ n: 1, drugs: ['lisdex', 'mph'], when: 'First', clause: '1.7.11' }] };
    ok(T.options(rec(30)).length === 1 && T.options(rec(30))[0].when === 'First', 'options use txSequence data when present');
    delete AA.data.txSequence;

    /* ---------- products ---------- */
    let P = T.products(rec(30), 'mph');
    const mat = P.find((x) => x.id === 'matoride');
    ok(mat && mat.licensed === false && /off-label/.test(mat.licenceNote) && mat.blocked.length === 0, 'Matoride XL in a new adult: not licensed, allowed off-label with a note');
    ok(P[P.length - 1].id === 'matoride' || P.findIndex((x) => x.id === 'matoride') > P.findIndex((x) => x.id === 'concerta'), 'products: licensed products listed first');
    P = T.products(rec(19, { treatment: { prior: { p1: { drug: 'mph', product: 'matoride', outcome: 'worked' } } } }), 'mph');
    ok(P.find((x) => x.id === 'matoride').licensed === true, 'Matoride XL continued from childhood: licensed');
    P = T.products(rec(10), 'mph');
    ok(P.every((x) => x.licensed), 'products: all methylphenidate fixtures licensed in a 10-year-old');
    P = T.products(rec(30, { treatment: { baseline: { ci: { ci_glaucoma: 'yes' } } } }), 'mph');
    ok(P.every((x) => x.blocked.length > 0), 'products: glaucoma blocks every methylphenidate product');
    P = T.products(rec(30, { treatment: { baseline: { misuse: 'high' } } }), 'mph');
    ok(P.find((x) => x.id === 'ritalin').blocked.some((r) => /1\.7\.24/.test(r.src)) && P.find((x) => x.id === 'concerta').blocked.length === 0, 'products: misuse risk blocks immediate-release (1.7.24), not osmotic');
    P = T.products(rec(30), 'gxr');
    ok(P[0].licensed === false && P[0].cautions.some((c) => /1\.7\.17/.test(c.src)), 'products: guanfacine in adults is off-label and needs tertiary advice');

    /* ---------- dose plans ---------- */
    let dp = T.dosePlan(rec(10), 'concerta');
    ok(dp.start === 18 && dp.max === 54 && dp.steps.map((s) => s.dose).join(',') === '18,36,54' && dp.licensed, 'dosePlan Concerta XL child: 18 to 54 mg in 18 mg steps');
    ok(/BNFC/.test(dp.bnfText) && /54 mg/.test(dp.maxText), 'dosePlan keeps the SmPC maximum and BNF ceiling separate');
    dp = T.dosePlan(rec(30), 'concerta');
    ok(dp.max === 72 && dp.steps.map((s) => s.dose).join(',') === '18,36,54,72', 'dosePlan Concerta XL adult: maximum 72 mg');
    dp = T.dosePlan(rec(10), 'atomoxetine', 30);
    ok(dp.weightBased && dp.start === 18 && dp.target === 36 && /15 mg → 18 mg/.test(dp.rounding) && /36 mg → 36 mg/.test(dp.rounding), 'dosePlan atomoxetine 30 kg child: 15 mg rounded to 18 mg, target 36 mg (rounding stated)');
    dp = T.dosePlan(rec(15), 'atomoxetine', 72);
    ok(dp.start === 40 && dp.target === 80 && dp.max === 100, 'dosePlan atomoxetine young person 70 kg or more: 40 then 80, max 100');
    dp = T.dosePlan(rec(30), 'atomoxetine', 60);
    ok(dp.start === 40 && dp.target === 80 && dp.max === 100 && !dp.weightBased, 'dosePlan atomoxetine adult: 40 then 80, max 100, not weight-based');
    dp = T.dosePlan(rec(13), 'intuniv', 45);
    ok(dp.max === 5 && dp.start === 1 && dp.steps[dp.steps.length - 1].dose === 5 && dp.target[0] === 2.25 && dp.target[1] === 5.4, 'dosePlan guanfacine 13-year-old 45 kg: maximum 5 mg, target 2.25-5.4 mg');
    dp = T.dosePlan(rec(8), 'intuniv', 30);
    eq(dp.max, 4, 'dosePlan guanfacine 8-year-old 30 kg: maximum 4 mg');
    dp = T.dosePlan(rec(30), 'intuniv', 80);
    ok(dp.warnings.some((w) => /tertiary advice only \(1\.7\.17\)/.test(w)) && dp.licensed === false, 'dosePlan guanfacine adult: tertiary advice warning');
    dp = T.dosePlan(rec(30), 'matoride');
    ok(dp.licensed === false && dp.warnings.length >= 2 && dp.start === 18, 'dosePlan Matoride adult: off-label warning and no adult dose in the SmPC');
    dp = T.dosePlan(rec(30, { treatment: { baseline: { ci: { ci_maoi: 'yes' } } } }), 'concerta');
    ok(dp.blocked.length === 1 && dp.warnings.some((w) => /Do not prescribe/.test(w)), 'dosePlan blocked by a contraindication answered yes');

    /* ---------- words ---------- */
    eq(T.words(28), 'twenty-eight', 'words 28');
    eq(T.words(56), 'fifty-six', 'words 56');
    eq(T.words(100), 'one hundred', 'words 100');
    eq(T.words(0), 'zero', 'words 0');
    eq(T.words(112), 'one hundred and twelve', 'words 112');
    eq(T.words(140), 'one hundred and forty', 'words 140');

    /* ---------- prescription text ---------- */
    let R = T.rxText(rec(30, { treatment: { choice: { drug: 'lisdex', product: 'elvanse', startDose: 30, supplyDays: 28 } } }));
    eq(R.lines[0], 'Elvanse 30 mg capsules. Take ONE capsule each morning. Supply 28 (twenty-eight) capsules.', 'rxText Elvanse 30 mg for 28 days');
    ok(R.qtyWords === 'twenty-eight' && R.isCD && R.checks.some((c) => c.id === 'rx_qty_words'), 'rxText: CD checks included for a Schedule 2 drug');
    R = T.rxText(rec(30, { treatment: { choice: { drug: 'lisdex', product: 'elvanse', startDose: 30, supplyDays: 35 } } }));
    ok(R.warnings.some((w) => /over 30 days/.test(w)), 'rxText: CD supply over 30 days -> reminder');
    R = T.rxText(rec(30, { treatment: { choice: { drug: 'lisdex', product: 'elvanse', startDose: 30, supplyDays: 35, supplyReason: 'Travel' } } }));
    ok(!R.warnings.some((w) => /over 30 days/.test(w)), 'rxText: no reminder when the reason is recorded');
    R = T.rxText(rec(30, { treatment: { choice: { drug: 'mph', product: 'concerta', startDose: 18, supplyDays: 28 }, reviews: { r1: { date: '2026-01-08', dose: 72 } } } }));
    ok(/Concerta XL 36 mg prolonged-release tablets\. Take TWO tablets each morning\. Supply 56 \(fifty-six\) tablets\./.test(R.lines[0]), 'rxText uses the latest review dose: 72 mg as two 36 mg tablets');
    R = T.rxText(rec(30, { treatment: { choice: { drug: 'mph', product: 'ritalin', startDose: 20, supplyDays: 28 } } }));
    ok(/Take ONE tablet twice a day\. Supply 56 \(fifty-six\) tablets\./.test(R.lines[0]), 'rxText: 20 mg a day in 2 doses of 10 mg');
    R = T.rxText(rec(30, { treatment: { choice: { drug: 'atx', product: 'atomoxetine', startDose: 40, supplyDays: 28 } } }));
    ok(!R.isCD && !R.checks.some((c) => c.id === 'rx_qty_words') && R.checks.some((c) => c.id === 'rx_dose'), 'rxText: CD-only checks hidden for atomoxetine');

    /* ---------- reviews, flags, next dose, trial ---------- */
    const base = { date: '2026-01-01', sbp: 110, dbp: 70, pulse: 80, weightKg: 40 };
    let RV = rec(30, { treatment: { baseline: base, choice: { drug: 'mph', product: 'concerta', startDose: 18, startDate: '2026-01-01' },
      reviews: { b: { date: '2026-01-15', dose: 36, pulse: 125 }, a: { date: '2026-01-08', dose: 18, pulse: 126 } } } });
    eq(T.reviewsSorted(RV).map((r) => r.id).join(','), 'a,b', 'reviewsSorted orders by date');
    eq(T.latestReview(RV).id, 'b', 'latestReview is the newest');
    let F = T.reviewFlags(RV, 'b');
    ok(F.some((f) => f.level === 'act' && /1\.8\.11/.test(f.src) && /adult physician/.test(f.do)), 'reviewFlags: HR 125 on 2 reviews -> act (reduce and refer)');
    F = T.reviewFlags(RV, 'a');
    ok(F.length === 1 && F[0].level === 'watch', 'reviewFlags: first reading over 120 -> watch only');
    ok(T.nextDose(RV).hold === true, 'nextDose holds when the last review has an act flag');
    RV = rec(30, { treatment: { baseline: base, reviews: { a: { date: '2026-02-01', sbp: 145, dbp: 85 }, b: { date: '2026-02-08', sbp: 142, dbp: 91 } } } });
    ok(T.reviewFlags(RV, 'b').some((f) => f.level === 'act'), 'reviewFlags adult: 140/90 or more on 2 reviews -> act');
    RV = rec(30, { treatment: { baseline: base, reviews: { a: { date: '2026-02-01', sbp: 185, dbp: 95 } } } });
    ok(T.reviewFlags(RV, 'a')[0].level === 'urgent', 'reviewFlags: 180/120 or more -> urgent');
    RV = rec(30, { treatment: { baseline: base, reviews: { a: { date: '2026-02-01', weightKg: 37.8, se: { se_appetite: 'troublesome', se_psychosis: 'mild' } } } } });
    F = T.reviewFlags(RV, 'a');
    ok(F[0].level === 'urgent' && /1\.7\.19/.test(F[0].src), 'reviewFlags: psychosis or mania -> urgent stop first (1.7.19)');
    ok(F.some((f) => f.level === 'act' && /with or after food/.test(f.do)), 'reviewFlags: troublesome side effect -> act with its action');
    ok(F.some((f) => f.level === 'watch' && /1\.8\.6/.test(f.src) && /Weight down 6%/.test(f.text)), 'reviewFlags: weight loss 5% or more -> watch with 1.8.6 options');
    RV = rec(10, { treatment: { baseline: base, reviews: { a: { date: '2026-02-01', sbp: 126 }, b: { date: '2026-03-01', sbp: 127 } } } });
    ok(T.reviewFlags(RV, 'a')[0].level === 'watch' && T.reviewFlags(RV, 'b')[0].level === 'act', 'reviewFlags young: systolic rise of 15+ once -> watch, twice -> act');
    ok(/not defined by NICE/.test(T.reviewFlags(RV, 'b')[0].src), 'reviewFlags young: rise rule labelled clinical practice');

    RV = rec(30, { treatment: { choice: { drug: 'mph', product: 'concerta', startDose: 18, startDate: '2026-01-01' }, reviews: { a: { date: '2026-01-08', dose: 18, decision: 'increase' } } } });
    let nd = T.nextDose(RV);
    ok(nd.dose === 36 && nd.atMax === false, 'nextDose: one 18 mg step');
    RV.treatment.reviews.b = { date: '2026-02-05', dose: 72, decision: 'stay' };
    nd = T.nextDose(RV);
    ok(nd.atMax === true && nd.dose === 72, 'nextDose: at the adult SmPC maximum');
    let tr = T.trial(RV, '2026-02-26');
    ok(tr.weeks === 8 && tr.adequate === false && tr.weeksAtDose === 3 && tr.doseDate === '2026-02-05', 'trial: 8 weeks since starting but only 3 at the maximum dose is not adequate (NG87 1.7.8)');
    tr = T.trial(RV, '2026-03-19');
    ok(tr.adequate === true && tr.weeksAtDose === 6 && /6 weeks at the maximum or target dose/.test(tr.text), 'trial: 6 weeks at the maximum dose is adequate');
    tr = T.trial(rec(30, { treatment: { choice: { drug: 'mph', product: 'concerta', startDose: 18, startDate: '2026-01-01' } } }), '2026-01-22');
    ok(tr.weeks === 3 && tr.adequate === false && tr.need === 6, 'trial: 3 of 6 weeks');
    ok(T.trial(rec(30), '2026-01-22').adequate === false, 'trial: no start date');

    /* ---------- monitoring ---------- */
    let M = T.monitorPlan(rec(8, { treatment: { choice: { drug: 'mph', startDate: '2026-01-31' } } }), '2026-02-10');
    const due = (id) => (M.find((x) => x.id === id) || {}).due;
    ok(due('mn_height') === '2026-07-31' && due('mn_weight_u10') === '2026-04-30' && !M.some((x) => x.id === 'mn_weight_o10'), 'monitorPlan 8-year-old: height at 6 months, weight every 3 months');
    ok(M.some((x) => x.id === 'annual' && x.due === '2027-01-31'), 'monitorPlan adds the annual review');
    M = T.monitorPlan(rec(12, { treatment: { choice: { drug: 'mph', startDate: '2026-01-01' }, reviews: { a: { date: '2026-04-02', weightKg: 40 } } } }), '2026-05-01');
    eq(due('mn_weight_o10'), '2026-07-01', 'monitorPlan over 10: weight at 3 months done, next at 6 months');

    /* ---------- step progress ---------- */
    eq(T.stepProgress(rec(30), 'summary'), null, 'stepProgress: not a treatment step -> null');
    let sp = T.stepProgress(rec(30, { formulation: { decision: 'not-met' } }), 'baseline');
    ok(sp.done === 0 && sp.of === 0, 'stepProgress: not applicable -> 0 of 0');
    sp = T.stepProgress(rec(5), 'prescribe');
    ok(sp.of === 0, 'stepProgress: under 6 -> not applicable');
    sp = T.stepProgress(rec(30, { formulation: { decision: 'not-met' } }), 'txplan');
    ok(sp.of === 1, 'stepProgress: the plan step still counts when not applicable');
    sp = T.stepProgress(rec(30, { treatment: { plan: { decision: 'medication', steps: { tp_info: true }, team: { specialist: true } } } }), 'txplan');
    ok(sp.done === 3 && sp.of === 5, 'stepProgress txplan adult: decision, adult items and the scope gate (conditional non-drug item not counted until it applies)');
    sp = T.stepProgress(rec(30, { treatment: { plan: { decision: 'nondrug' } } }), 'prescribe');
    ok(sp.of === 0, 'stepProgress: non-drug plan -> medication steps not applicable');
    sp = T.stepProgress(rec(30, { treatment: { choice: { drug: 'lisdex', product: 'elvanse', startDose: 30, startDate: '2026-01-01', supplyDays: 28, counsel: { cs_all: true } } } }), 'prescribe');
    ok(sp.done === 6 && sp.of === 9, 'stepProgress prescribe: choice, counselling and CD checks');
    sp = T.stepProgress(rec(30, { treatment: { reviews: { a: { date: '2026-01-08', decision: 'optimised' } } } }), 'titrate');
    ok(sp.done === 2 && sp.of === 2, 'stepProgress titrate: optimised');
    sp = T.stepProgress(rec(16, { treatment: { monitor: { shared: 'requested' } } }), 'monitor');
    ok(sp.done === 1 && sp.of === 3, 'stepProgress monitor 16-year-old includes transition');
    eq(T.stepProgress(rec(13), 'monitor').of, 3, 'stepProgress monitor: transition counts from 13, when the view shows it (NG43 1.2.1)');
    eq(T.stepProgress(rec(12), 'monitor').of, 2, 'stepProgress monitor 12-year-old: no transition item');

    /* ---------- age filters: T.forAge and the lists the counts use ---------- */
    ok(T.forAge(rec(30), { ages: 'adult' }) && !T.forAge(rec(9), { ages: 'adult' }), 'forAge: ages adult');
    ok(T.forAge(rec(9), { ages: 'young' }) && !T.forAge(rec(30), { ages: 'young' }) && T.forAge(rec(9), { ages: 'all' }), 'forAge: ages young and all');
    ok(!T.forAge(rec(11), { ageMin: 12 }) && T.forAge(rec(12), { ageMin: 12 }) && T.forAge(rec(''), { ageMin: 17 }), 'forAge: ageMin inclusive, ignored when the age is missing');
    ok(T.forAge(rec(10), { ageMax: 10 }) && !T.forAge(rec(11), { ageMax: 10 }), 'forAge: ageMax inclusive');
    ok(T.forAge(rec(17), { bands: ['y17', 'adult'] }) && !T.forAge(rec(16), { bands: ['y17', 'adult'] }), 'forAge: bands');
    ok(!T.forAge(rec(30), null) && T.forAge(rec(30), {}), 'forAge: no item -> false; no filters -> true');

    AA.data.txDrugs = AA.data.txDrugs.map((d) => d.id === 'mph' ? Object.assign({}, d, { caution: ['ci_tics', 'ci_pregnancy', 'ci_breastfeeding'], se: ['se_appetite', 'se_psychosis', 'se_chest', 'se_growth'] }) : d);
    AA.data.txCardiac = AA.data.txCardiac.concat([{ id: 'cx_htn', ages: 'adult', t: 'Hypertension (adults)', hist: ['physical_htn'], action: 'cardiology', src: 'NICE NG87 1.7.5' }]);
    AA.data.txCautions = AA.data.txCautions.concat([
      { id: 'ci_pregnancy', ageMin: 12, t: 'Pregnant or planning a pregnancy', hist: ['physical_pregnancy'], src: 'SmPC 4.6' },
      { id: 'ci_breastfeeding', t: 'Breastfeeding', hist: ['physical_pregnancy'], src: 'SmPC 4.6' }   /* no ageMin: the engine still asks it from 12 */
    ]);
    AA.data.txPlanItems = AA.data.txPlanItems.concat([{ id: 'tp_driving', ages: 'all', ageMin: 17, t: 'Driving' }, { id: 'tp_pregnancy', ages: 'all', ageMin: 12, t: 'Pregnancy' }]);
    AA.data.txCounsel = AA.data.txCounsel.concat([
      { id: 'cs_school', drugs: ['mph', 'lisdex', 'dex'], ages: 'young', t: 'School dose' },
      { id: 'cs_driving', drugs: 'all', ageMin: 17, t: 'Driving' },
      { id: 'cs_pregnancy', drugs: 'all', ageMin: 12, t: 'Pregnancy' }
    ]);
    AA.data.txRxChecks = AA.data.txRxChecks.concat([{ id: 'rx_instal', cd: true, optional: true, t: 'Instalments (only if used)' }]);
    AA.data.txSideEffects = [
      { id: 'se_appetite', t: 'Reduced appetite or weight loss', action: 'Give it with or after food; consider extra meals.', src: 'NICE NG87 1.8.6' },
      { id: 'se_psychosis', t: 'Psychotic or manic symptoms', urgent: true, action: 'Stop all ADHD medicine now (from the data).', src: 'NICE NG87 1.7.19' },
      { id: 'se_chest', t: 'Chest pain on exertion, or fainting', urgent: true, action: 'Same-day medical assessment. Do not give the next dose until assessed.', src: 'Clinical practice' },
      { id: 'se_growth', ages: 'young', t: 'Slower growth in height', action: 'Consider a planned break.', src: 'NICE NG87 1.8.7' }
    ];

    /* Heart history and safety screen: only the items asked at this age are listed and counted */
    ok(!T.cardiacItems(rec(9)).some((c) => c.id === 'cx_htn') && T.cardiacItems(rec(30)).some((c) => c.id === 'cx_htn'), 'cardiacItems: the adult blood pressure item is for adults only');
    ok(!T.cautionItems(rec(11)).some((c) => /preg|breast/.test(c.id)) && T.cautionItems(rec(12)).filter((c) => /preg|breast/.test(c.id)).length === 2, 'cautionItems: pregnancy and breastfeeding from 12, with or without ageMin in the data');
    const childBase = () => ({ date: '2026-10-01', sbp: 100, dbp: 60, bpCentile: 'lt90', pulse: 80, heightCm: 130, weightKg: 28,
      cardiac: { cx_chd: 'no', cx_faint: 'no', cx_med: 'no' }, ci: { ci_glaucoma: 'no', ci_maoi: 'no', ci_tics: 'no' }, meds: 'None', misuse: 'low' });
    let K = rec(9, { treatment: { baseline: childBase() }, history: { physical: { checks: { physical_htn: true, physical_pregnancy: true } } } });
    v = T.baselineVerdict(K);
    ok(v.level === 'ok' && v.missing.length === 0 && v.done === v.of, '9-year-old: adult heart item and pregnancy items are not asked, even with history ticks; checks complete (' + v.missing.join(', ') + ')');
    eq(T.stepProgress(K, 'baseline').of, v.of, 'stepProgress baseline matches the verdict checklist');
    const adultBase = (extra) => Object.assign({ date: '2026-10-01', sbp: 122, dbp: 78, pulse: 72, heightCm: 170, weightKg: 70,
      cardiac: { cx_chd: 'no', cx_faint: 'no', cx_med: 'no', cx_htn: 'no' }, ci: { ci_glaucoma: 'no', ci_maoi: 'no', ci_tics: 'no' },
      meds: 'None', misuse: 'low', driving: 'no' }, extra || {});
    v = T.baselineVerdict(rec(30, { treatment: { baseline: adultBase({ cardiac: { cx_chd: 'no', cx_faint: 'no', cx_med: 'no' }, pregnancy: 'na' }) } }));
    ok(v.level === 'incomplete' && v.missing.some((m) => /Heart history questions: 1 not answered/.test(m)), 'adult: the adult blood pressure heart item is asked');

    /* The pregnancy question answers the two pregnancy items of the safety screen */
    let PB = rec(30, { treatment: { baseline: adultBase({ pregnancy: 'na' }) } });
    ok(T.ciAnswer(PB, 'ci_pregnancy').v === 'no' && T.ciAnswer(PB, 'ci_breastfeeding').v === 'no' && T.ciAnswer(PB, 'ci_pregnancy').fromPregnancy, 'pregnancy "not applicable" -> both pregnancy items no');
    eq(T.baselineVerdict(PB).level, 'ok', 'pregnancy "not applicable": safety screen complete');
    PB = rec(30, { treatment: { baseline: adultBase({ pregnancy: 'no' }) }, history: { physical: { checks: { physical_pregnancy: true } } } });
    ok(T.ciAnswer(PB, 'ci_pregnancy').v === 'no' && !T.ciAnswer(PB, 'ci_pregnancy').fromHistory, 'pregnancy "no" overrides the history pre-fill');
    PB = rec(30, { treatment: { baseline: adultBase({ pregnancy: 'pregnant' }) } });
    ok(T.ciAnswer(PB, 'ci_pregnancy').v === 'yes' && T.ciAnswer(PB, 'ci_breastfeeding').v === null, 'pregnant -> ci_pregnancy yes; breastfeeding left to the clinician');
    v = T.baselineVerdict(PB);
    ok(v.level === 'incomplete' && v.missing.some((m) => /caution screen/.test(m)), 'pregnant: the breastfeeding item still needs an answer');
    PB.treatment.baseline.ci.ci_breastfeeding = 'no';
    v = T.baselineVerdict(PB);
    ok(v.level === 'caution' && v.reasons.filter((r) => /Pregnan/.test(r.text)).length === 1, 'pregnant: one pregnancy caution, not repeated by the screen item');
    cf = T.cautionsFor(PB, 'mph');
    ok(cf.some((c) => c.id === 'preg_pregnant') && !cf.some((c) => c.id === 'ci_pregnancy'), 'cautionsFor: the medicine\'s pregnancy line replaces the generic screen item');
    eq(T.ciAnswer(rec(30, { treatment: { baseline: { pregnancy: 'planning' } } }), 'ci_pregnancy').v, 'yes', 'planning a pregnancy -> ci_pregnancy yes');
    PB = rec(30, { treatment: { baseline: { pregnancy: 'breastfeeding' } } });
    ok(T.ciAnswer(PB, 'ci_breastfeeding').v === 'yes' && T.ciAnswer(PB, 'ci_pregnancy').v === null, 'breastfeeding -> ci_breastfeeding yes');
    PB = rec(30, { treatment: { baseline: { pregnancy: 'no', ci: { ci_pregnancy: 'yes' } } } });
    ok(T.ciAnswer(PB, 'ci_pregnancy').v === 'yes' && T.cautionsFor(PB, 'mph').some((c) => c.id === 'ci_pregnancy'), 'an answer recorded on the screen item itself wins');

    /* Plan items, counselling and prescription checks */
    let plan = { decision: 'medication' };
    eq(T.stepProgress(rec(9, { treatment: { plan } }), 'txplan').of, 1 + 2 + 3, 'txplan 9-year-old: no driving (17+) or pregnancy (12+) item');
    eq(T.stepProgress(rec(17, { treatment: { plan } }), 'txplan').of, 1 + 4 + 3, 'txplan 17-year-old: driving and pregnancy items counted');
    eq(T.stepProgress(rec(30, { treatment: { plan } }), 'txplan').of, 1 + 3 + 3, 'txplan adult: adult and all-age items (tp_psych counts only when non-drug treatment is indicated)');
    const full = (age) => {
      const counsel = {}, rx = {};
      T.counselItems(rec(age, { treatment: { choice: { drug: 'mph' } } })).forEach((c) => { counsel[c.id] = true; });
      ['rx_dose', 'rx_qty_words'].forEach((id) => { rx[id] = true; });
      return rec(age, { treatment: { choice: { drug: 'mph', product: 'concerta', startDose: 18, startDate: '2026-01-01', supplyDays: 28, counsel, rx } } });
    };
    sp = T.stepProgress(full(30), 'prescribe');
    ok(sp.done === sp.of && sp.of === 5 + 4 + 2, 'prescribe adult: no school item, optional instalment check not counted, so it can complete (' + sp.done + '/' + sp.of + ')');
    sp = T.stepProgress(full(9), 'prescribe');
    ok(sp.done === sp.of && sp.of === 5 + 3 + 2, 'prescribe 9-year-old: school item counted; driving and pregnancy items not');
    eq(T.stepProgress(rec(30, { treatment: { choice: {} } }), 'prescribe').of, 5, 'prescribe: counselling and checks count once a medicine is chosen');
    R = T.rxText(full(30));
    ok(R.checks.some((c) => c.id === 'rx_instal' && c.optional === true), 'rxText lists the optional check and marks it optional');

    /* Side effects: urgent items use their own action; age filters apply */
    RV = rec(30, { treatment: { reviews: { a: { date: '2026-02-01', se: { se_chest: 'mild' } } } } });
    F = T.reviewFlags(RV, 'a');
    ok(F.length === 1 && F[0].level === 'urgent' && F[0].do === 'Same-day medical assessment. Do not give the next dose until assessed.' && !/stop ADHD medicine/.test(F[0].text), 'reviewFlags: an urgent side effect uses its own action');
    RV = rec(30, { treatment: { reviews: { a: { date: '2026-02-01', se: { se_psychosis: 'troublesome' } } } } });
    ok(T.reviewFlags(RV, 'a')[0].do === 'Stop all ADHD medicine now (from the data).', 'reviewFlags: the psychosis item marked urgent uses its own action');
    RV = rec(30, { treatment: { reviews: { a: { date: '2026-02-01', se: { se_growth: 'troublesome' } } } } });
    eq(T.reviewFlags(RV, 'a').length, 0, 'reviewFlags: a young-only side effect is ignored for an adult');
    RV = rec(9, { treatment: { reviews: { a: { date: '2026-02-01', se: { se_growth: 'troublesome' } } } } });
    ok(T.reviewFlags(RV, 'a').some((f) => f.level === 'act' && /planned break/.test(f.do)), 'reviewFlags: the young-only side effect counts for a child');
    ok(T.sideEffects(rec(30), 'mph').every((x) => x.id !== 'se_growth') && T.sideEffects(rec(9), 'mph').some((x) => x.id === 'se_growth'), 'sideEffects: filtered by age');

    /* Monitoring: age filters with the age missing (adult), and txSequence steps */
    AA.data.txMonitor = { young: [], adult: [{ id: 'mn_sexual', what: 'Sexual dysfunction', freq: 'At every review', drugs: ['atx'], ageMin: 12 }, { id: 'mn_young_only', what: 'x', ages: 'young', months: 6 }] };
    M = T.monitorPlan(rec('', { treatment: { choice: { drug: 'atx', startDate: '2026-01-01' } } }), '2026-02-01');
    ok(M.some((x) => x.id === 'mn_sexual') && !M.some((x) => x.id === 'mn_young_only'), 'monitorPlan: ageMin ignored when the age is missing; ages filter applies');
    AA.data.txSequence = { young: [{ n: 1, drugs: ['mph'], when: 'First', clause: '1.7.7' }, { n: 2, drugs: ['atx'], when: 'Teen only (test)', clause: '1.7.10', ageMin: 12 }], adult: [] };
    ok(T.options(rec(9)).length === 1 && T.options(rec(13)).length === 2, 'options: txSequence steps honour ageMin');
    delete AA.data.txSequence;

    /* Immediate release: the ir flag decides; scored tablets give half doses */
    AA.data.txProducts = AA.data.txProducts.concat([
      { id: 'bimodal', drug: 'mph', name: 'Test XL', form: 'Modified-release capsule', release: '30% immediate release, 70% prolonged release', ir: false, diversionLower: true, strengths: [10, 20],
        licensed: { child: true, adultStart: true, adultContinue: true }, dose: { adult: { start: 10, step: 10, max: 60, perDay: 1 } } },
      { id: 'mph_ir_flag', drug: 'mph', name: 'Test tablets', form: 'Tablet', release: 'Tablet', ir: true, strengths: [10],
        licensed: { child: true, adultStart: true, adultContinue: true }, dose: { adult: { start: 10, step: 10, max: 60, perDay: 2 } } },
      { id: 'ritalin_s', drug: 'mph', name: 'Ritalin', form: 'Tablet', release: 'Immediate release', ir: true, scored: true, strengths: [10], take: 'Twice a day',
        licensed: { child: true, adultStart: true, adultContinue: true }, dose: { child: { start: 10, step: [5, 10], max: 60, perDay: 2 }, adult: { start: 20, step: 20, max: 80, perDay: 2 } } }
    ]);
    P = T.products(rec(30, { treatment: { baseline: { misuse: 'high' } } }), 'mph');
    ok(P.find((x) => x.id === 'bimodal').blocked.length === 0 && P.find((x) => x.id === 'mph_ir_flag').blocked.some((r) => /Immediate-release/.test(r.text)), 'isIR: ir false wins over "immediate" in the release text; ir true blocks with misuse risk');
    R = T.rxText(rec(9, { treatment: { choice: { drug: 'mph', product: 'ritalin_s', startDose: 10, supplyDays: 28 } } }));
    ok(/Ritalin 10 mg tablets\. Take HALF a tablet \(5 mg\) twice a day\. Supply 28 \(twenty-eight\) tablets\./.test(R.lines[0]), 'rxText: scored tablet, 5 mg twice a day is half a 10 mg tablet (' + R.lines[0] + ')');
    R = T.rxText(rec(9, { treatment: { choice: { drug: 'mph', product: 'ritalin_s', startDose: 15, perDay: 3, supplyDays: 7 } } }));
    ok(R.quantity === 11 && /Supply 11 \(eleven\) tablets/.test(R.lines[0]), 'rxText: half tablets round the supply up to whole tablets (10.5 -> 11)');
    R = T.rxText(rec(9, { treatment: { choice: { drug: 'mph', product: 'ritalin', startDose: 10, supplyDays: 28 } } }));
    ok(!R.lines.length && R.warnings.some((w) => /cannot be made/.test(w)), 'rxText: an unscored tablet does not give half doses');
    R = T.rxText(rec(30, { treatment: { choice: { drug: 'mph', product: 'ritalin_s', startDose: 20, supplyDays: 28 } } }));
    ok(/Take ONE tablet twice a day\. Supply 56/.test(R.lines[0]), 'rxText: scored tablet with a whole-tablet dose is unchanged');

    /* ================= review findings (engine fixes) ================= */
    AA.data.txProducts = AA.data.txProducts.concat([
      { id: 'mkxl', drug: 'mph', name: 'Medikinet XL', form: 'Modified-release capsule', ir: false, strengths: [5, 10, 20, 30, 40, 50, 60],
        licensed: { child: true, adultStart: true, adultContinue: true }, take: 'Children: once each morning. Adults: morning and midday.',
        dose: { child: { start: 5, step: [5, 10], max: 60, perDay: 1 }, adult: { start: 10, step: 10, max: 80, maxMgPerKg: 1, perDay: 2 } } },
      { id: 'amfexa_t', drug: 'dex', name: 'Amfexa', form: 'Tablet', release: 'Immediate release', ir: true, strengths: [5, 10, 20],
        licensed: { child: true, adultStart: false, adultContinue: false },
        dose: { child: { start: 10, step: 5, max: 20, perDay: 2 } }, bnf: { adult: '5 mg twice a day, maximum 60 mg a day (off-label)' } },
      { id: 'dexsol', drug: 'dex', name: 'Dexamfetamine sulfate', form: 'Oral solution', formRx: 'oral solution', ir: true, strengths: [1],
        licensed: { child: true, adultStart: false, adultContinue: false }, dose: { child: { start: 10, step: 5, max: 20, perDay: 2 } } },
      { id: 'atx_take', drug: 'atx', name: 'Atomoxetine', form: 'Capsule', strengths: [10, 18, 25, 40, 60, 80, 100], take: 'Once each morning, or split into a morning and a late-afternoon dose.',
        licensed: { child: true, adultStart: true, adultContinue: true }, dose: { child: { mgPerKg: { start: 0.5, target: 1.2 }, overKg: 70, overStart: 40, overTarget: 80, max: 100, perDay: 1 } } },
      { id: 'gxr_take', drug: 'gxr', name: 'Intuniv', form: 'Prolonged-release tablet', strengths: [1, 2, 3, 4], take: 'Once a day at the same time, morning or evening.',
        licensed: { child: true, adultStart: false, adultContinue: false },
        dose: { child: { start: 1, step: 1, targetMgPerKg: [0.05, 0.12], perDay: 1, maxTable: [{ ageMin: 6, ageMax: 12, kgMin: 25, max: 4 }, { ageMin: 13, ageMax: 17, kgMin: 34, max: 4 }] } } }
    ]);
    const ch = (age, choice, extra) => rec(age, { treatment: Object.assign({ choice: choice }, extra || {}) });

    /* TX-DOSE-01: guanfacine with no SmPC maximum never climbs; weight bands are contiguous */
    let N = T.nextDose(ch(9, { drug: 'gxr', product: 'intuniv', startDose: 6, weightKg: 20 }));
    ok(N.hold === true && N.dose === 6 && /No SmPC maximum/.test(N.text), 'TX-DOSE-01: 9 years, 20 kg on 6 mg -> hold, no SmPC maximum');
    ok(T.nextDose(ch(30, { drug: 'gxr', product: 'intuniv', startDose: 9, weightKg: 80 })).hold === true, 'TX-DOSE-01: adult guanfacine -> hold (tertiary advice only)');
    eq(T.dosePlan(rec(14), 'intuniv', 41.45).max, 4, 'TX-DOSE-01: 14 years, 41.45 kg falls in the 34-41.4 kg row (max 4)');
    eq(T.dosePlan(rec(14), 'intuniv', 58.45).max, 6, 'TX-DOSE-01: 14 years, 58.45 kg falls in the 49.5-58.4 kg row (max 6)');
    eq(T.dosePlan(rec(9), 'intuniv', 20).max, null, 'TX-DOSE-01: 9 years, 20 kg -> no maximum');
    /* TX-DOSE-14: above the per-kg range, and the 7 mg condition */
    N = T.nextDose(ch(8, { drug: 'gxr', product: 'intuniv', startDose: 3, weightKg: 25 }));
    ok(N.dose === 4 && /above the recommended maintenance range of 0\.05–0\.12 mg\/kg/.test(N.text), 'TX-DOSE-14: 25 kg, 3 -> 4 mg is flagged as above the maintenance range');
    N = T.nextDose(ch(15, { drug: 'gxr', product: 'intuniv', startDose: 6, weightKg: 60 }));
    ok(N.dose === 7 && /at least 1 week on 6 mg/.test(N.text), 'TX-DOSE-14: 6 -> 7 mg carries the SmPC condition');

    /* TX-DOSE-02 and TX-DOSE-15: atomoxetine per kg */
    dp = T.dosePlan(rec(9), 'atomoxetine', 27);
    ok(dp.ceiling === 48.6 && dp.soft === 32.4 && dp.target === 28 && dp.max === null, 'TX-DOSE-02: 27 kg: ceiling 1.8 mg/kg (48.6 mg), target rounded down to 28 mg');
    N = T.nextDose(ch(9, { drug: 'atx', product: 'atomoxetine', startDose: 60, weightKg: 27 }));
    ok(N.hold === true && N.overMax === true && /above 1\.8 mg\/kg/.test(N.text), 'TX-DOSE-02: 60 mg at 27 kg -> hold, above 1.8 mg/kg');
    R = T.rxText(ch(9, { drug: 'atx', product: 'atomoxetine', startDose: 100, weightKg: 27, supplyDays: 28, times: 'each morning' }));
    ok(R.errors.some((w) => /above 1\.8 mg\/kg/.test(w)), 'TX-DOSE-02: rxText errors above 1.8 mg/kg');
    dp = T.dosePlan(rec(15), 'atomoxetine', 70);
    ok(dp.weightBased && dp.start === 35 && dp.target === 80 && dp.max === null, 'TX-DOSE-15: exactly 70 kg is dosed per kg (SmPC: up to 70 kg)');

    /* TX-DOSE-03 / M9: safety-screen answers change the dose */
    const ciRec = (age, ci, choice, extra) => rec(age, { treatment: Object.assign({ baseline: Object.assign({ ci: ci }, extra || {}), choice: choice || {} }) });
    eq(T.dosePlan(ciRec(30, { ci_renal: 'yes' }), 'elvanse').max, 50, 'TX-DOSE-03: lisdexamfetamine with severe kidney impairment -> maximum 50 mg');
    N = T.nextDose(ciRec(30, { ci_renal: 'yes' }, { drug: 'lisdex', product: 'elvanse', startDose: 50 }));
    ok(N.atMax === true && N.dose === 50, 'TX-DOSE-03: nextDose stops at the renal maximum');
    dp = T.dosePlan(ciRec(30, { ci_hepatic: 'yes' }), 'atomoxetine');
    ok(dp.start === 20 && dp.target === 40 && dp.max === 50 && dp.warnings.some((w) => /Child-Pugh C needs 25%/.test(w)), 'TX-DOSE-03: liver impairment, class not recorded -> 50% and a warning');
    dp = T.dosePlan(ciRec(30, { ci_hepatic: 'yes' }, null, { childPugh: 'C' }), 'atomoxetine');
    ok(dp.start === 10 && dp.target === 20 && dp.max === 25, 'TX-DOSE-03: Child-Pugh C -> 25%');
    dp = T.dosePlan(ciRec(15, { ci_cyp3a4_inh: 'yes' }), 'intuniv', 60);
    ok(dp.max === 3 && dp.target[1] === 3.6 && dp.warnings.some((w) => /halve the guanfacine dose/.test(w)), 'TX-DOSE-03: CYP3A4 inhibitor halves the guanfacine maximum and range');
    dp = T.dosePlan(ciRec(15, { ci_cyp3a4: 'yes' }), 'intuniv', 60);
    ok(dp.max === 3 && dp.warnings.some((w) => /does not say which/.test(w)), 'TX-DOSE-03: older combined CYP3A4 item -> treated as an inhibitor, with a warning');
    dp = T.dosePlan(ciRec(15, { ci_cyp3a4_ind: 'yes' }), 'intuniv', 60);
    ok(dp.max === 7 && dp.warnings.some((w) => /re-titration up to a maximum of 7 mg/.test(w)), 'TX-DOSE-03: strong CYP3A4 inducer -> specialist re-titration warning');
    ok(T.dosePlan(ciRec(30, { ci_cyp2d6: 'yes' }), 'atomoxetine').warnings.some((w) => /start lower and titrate more slowly/.test(w)), 'TX-DOSE-03: CYP2D6 inhibitor -> start lower, titrate slowly');

    /* TX-DOSE-05 / m4: a borrowed schedule has no SmPC maximum */
    dp = T.dosePlan(rec(30), 'amfexa_t');
    ok(dp.fallback && dp.max === 60 && dp.maxSource === 'bnf' && /No adult licence: no SmPC adult maximum/.test(dp.maxText) && !/SmPC maximum \(adults\)/.test(dp.maxText), 'TX-DOSE-05: adult Amfexa -> BNF off-label ceiling, not an SmPC maximum');
    N = T.nextDose(ch(30, { drug: 'dex', product: 'amfexa_t', startDose: 20 }));
    ok(N.dose === 25 && !/SmPC maximum/.test(N.text) && /BNF off-label ceiling 60 mg/.test(N.text), 'TX-DOSE-05: adult Amfexa 20 mg is not called the SmPC maximum');
    R = T.rxText(ch(30, { drug: 'dex', product: 'amfexa_t', startDose: 30, supplyDays: 28 }));
    ok(!R.errors.some((w) => /maximum/.test(w)), 'TX-DOSE-05: adult dexamfetamine 30 mg is not "above the licensed maximum"');

    /* TX-DOSE-06: above the maximum is not called the maximum */
    N = T.nextDose(ch(9, { drug: 'mph', product: 'concerta', startDose: 72 }));
    ok(N.hold && N.overMax && /72 mg a day is above the SmPC maximum of 54 mg/.test(N.text), 'TX-DOSE-06: child Concerta XL 72 mg -> above the SmPC maximum of 54 mg');

    /* TX-DOSE-07: Medikinet XL adults, 1 mg/kg */
    dp = T.dosePlan(rec(30), 'mkxl');
    ok(dp.weightBased && dp.needWeight && dp.warnings.some((w) => /1 mg\/kg and never more than 80 mg/.test(w)), 'TX-DOSE-07: no weight -> weight field and warning');
    ok(T.nextDose(ch(30, { drug: 'mph', product: 'mkxl', startDose: 40 })).hold === true, 'TX-DOSE-07: no weight -> no dose increase');
    eq(T.dosePlan(rec(30), 'mkxl', 45).max, 40, 'TX-DOSE-07: 45 kg -> cap rounded down to 40 mg (2 equal doses)');

    /* TX-DOSE-08 / M2 / M6: immediate release doses that can be made */
    R = T.rxText(ch(9, { drug: 'mph', product: 'ritalin_s', startDose: 15, supplyDays: 28 }));
    ok(R.lines.length === 1 && /Take ONE tablet in the morning and HALF a tablet \(5 mg\) at lunchtime \(15 mg a day\)\. Supply 42 \(forty-two\) tablets\./.test(R.lines[0]), 'TX-DOSE-08: Ritalin 15 mg a day -> 10 mg + 5 mg (' + R.lines[0] + ')');
    dp = T.dosePlan(rec(9), 'ritalin_s');
    ok(dp.steps.every((s) => s.perDose && s.perDose.length) && dp.steps.some((s) => s.dose === 15 && s.split === '10 mg + 5 mg'), 'TX-DOSE-08: ladder steps carry a regimen that can be made');
    N = T.nextDose(ch(9, { drug: 'mph', product: 'ritalin_s', startDose: 10 }));
    ok(N.dose === 15 && /10 mg \+ 5 mg/.test(N.text), 'TX-DOSE-08: next dose 15 mg is given as 10 mg + 5 mg');
    R = T.rxText(ch(9, { drug: 'dex', product: 'amfexa_t', startDose: 5, perDay: 1, supplyDays: 28, times: 'each morning' }));
    ok(/Amfexa 5 mg tablets\. Take ONE tablet each morning\. Supply 28/.test(R.lines[0]), 'M2: Amfexa 5 mg once a day can be written');
    R = T.rxText(ch(9, { drug: 'dex', product: 'amfexa_t', startDose: 15, supplyDays: 28 }));
    ok(R.lines.length === 1 && /5 mg tablets\. Take TWO tablets in the morning and ONE tablet at lunchtime/.test(R.lines[0]), 'M6: Amfexa 15 mg a day -> one strength, 10 mg + 5 mg');
    R = T.rxText(ch(30, { drug: 'mph', product: 'ritalin_s', startDose: 30, supplyDays: 28 }));
    ok(R.lines.length === 1 && !/cannot be made/.test(R.warnings.join(' ')), 'M2: adult Ritalin 30 mg a day can be written');

    /* C1 (safety): the timing sets the number of doses, and must agree with the product */
    R = T.rxText(ch(9, { drug: 'mph', product: 'ritalin_s', startDose: 60, times: 'three times a day', supplyDays: 28 }));
    ok(/Take TWO tablets three times a day\. Supply 168/.test(R.lines[0]) && R.perDay === 3, 'C1: Ritalin 60 mg three times a day -> 20 mg a dose, 168 tablets');
    R = T.rxText(ch(9, { drug: 'mph', product: 'concerta', startDose: 36, times: 'twice a day', supplyDays: 28 }));
    ok(!R.lines.length && R.errors.some((w) => /once a day/.test(w)), 'C1: Concerta XL "twice a day" -> blocked');
    R = T.rxText(ch(30, { drug: 'mph', product: 'mkxl', startDose: 40, times: 'each morning', supplyDays: 28, weightKg: 70 }));
    ok(/Medikinet XL 40 mg modified-release capsules\. Take ONE capsule each morning\. Supply 28/.test(R.lines[0]), 'C1/M2: Medikinet XL 40 mg each morning -> one 40 mg capsule, 28');
    R = T.rxText(ch(9, { drug: 'mph', product: 'ritalin_s', startDose: 20, perDay: 2, times: 'three times a day', supplyDays: 28 }));
    ok(!R.lines.length && R.errors.some((w) => /make them agree/.test(w)), 'C1: doses a day and the timing disagree -> blocked');
    /* TX-RX-10: one regimen, never the product's "or" options */
    R = T.rxText(ch(9, { drug: 'atx', product: 'atx_take', startDose: 36, weightKg: 30, supplyDays: 28 }));
    ok(R.lines.length && R.lines.every((l) => /each morning/.test(l) && !/\bor\b/.test(l)), 'TX-RX-10: atomoxetine wording is "each morning" with no options');
    R = T.rxText(ch(9, { drug: 'gxr', product: 'gxr_take', startDose: 3, weightKg: 30, supplyDays: 28 }));
    ok(R.lines.length && R.lines.every((l) => /once a day/.test(l) && !/\bor\b/.test(l)) && R.warnings.some((w) => /Add when to take it/.test(w)), 'TX-RX-10: guanfacine "once a day" and a prompt for the time');
    R = T.rxText(ch(9, { drug: 'gxr', product: 'gxr_take', startDose: 3, weightKg: 30, supplyDays: 28, times: 'morning or evening' }));
    ok(!R.lines.length && R.errors.some((w) => /one regimen/.test(w)), 'TX-RX-10: a typed choice of times is blocked');

    /* C2 (safety): maximum, contraindications and misuse next to the wording */
    R = T.rxText(ch(30, { drug: 'lisdex', product: 'elvanse', startDose: 30, rxDose: 100, supplyDays: 28 }));
    ok(R.errors.some((w) => /100 mg a day is above the SmPC maximum of 70 mg/.test(w) && w.level === 'err'), 'C2: Elvanse 100 mg -> error above the SmPC maximum');
    R = T.rxText(rec(30, { treatment: { baseline: { ci: { ci_maoi: 'yes' } }, choice: { drug: 'mph', product: 'concerta', startDose: 18, supplyDays: 28 } } }));
    ok(R.errors.some((w) => /Do not prescribe/.test(w)), 'C2: a contraindication is repeated next to the wording');
    R = T.rxText(rec(30, { treatment: { baseline: { misuse: 'high' }, choice: { drug: 'mph', product: 'ritalin_s', startDose: 20, supplyDays: 28 } } }));
    ok(R.errors.some((w) => /1\.7\.24/.test(w.src)), 'C2: misuse risk with an immediate-release stimulant -> error (1.7.24)');

    /* M4: liquid totals in words; M5: days covered by a quantity; m10: fewest units; m11: quantity per strength */
    R = T.rxText(ch(9, { drug: 'dex', product: 'dexsol', startDose: 7.5, perDay: 3, supplyDays: 7 }));
    ok(/Take 2\.5 ml \(2\.5 mg\) three times a day\. Supply 53 \(fifty-three\) ml\./.test(R.lines[0]), 'M4: liquid total rounded up to whole ml, in words (' + R.lines[0] + ')');
    eq(T.words(52.5), 'fifty-two point five', 'M4: words for a decimal');
    R = T.rxText(ch(30, { drug: 'mph', product: 'concerta', startDose: 18, quantity: 120 }));
    ok(R.coveredDays === 120 && R.warnings.some((w) => /over 30 days/.test(w)), 'M5: 120 tablets at one a day -> over 30 days');
    R = T.rxText(ch(30, { drug: 'mph', product: 'mkxl', startDose: 30, supplyDays: 28, weightKg: 70 }));
    ok(R.lines.length === 2 && /10 mg .*Take ONE capsule twice a day with one 5 mg capsule \(15 mg in total\)\. Supply 56/.test(R.lines[0]), 'm10: 15 mg a dose is 10 mg + 5 mg, not three 5 mg capsules');
    R = T.rxText(ch(30, { drug: 'mph', product: 'concerta', startDose: 45, quantity: 28 }));
    ok(R.lines.length === 2 && R.lines.every((l) => /Supply 28 \(twenty-eight\)/.test(l)), 'm11: a quantity with two strengths gives a supply for each');

    /* TX-AGE-11: no age, no doses */
    const noAge = ch('', { drug: 'atx', product: 'atomoxetine', startDose: 40, supplyDays: 28 });
    dp = T.dosePlan(noAge, 'atomoxetine', 25);
    ok(dp.ageMissing && dp.start === null && /Record the age/.test(dp.text), 'TX-AGE-11: dosePlan gives no dose without an age');
    ok(T.nextDose(noAge).hold === true && /Record the age/.test(T.nextDose(noAge).text), 'TX-AGE-11: nextDose holds without an age');
    R = T.rxText(noAge);
    ok(!R.lines.length && R.errors.some((w) => /Record the age/.test(w)), 'TX-AGE-11: rxText writes nothing without an age');

    /* TX-LIC-09: conditional licences */
    let L = T.licence(rec(9), T.product('elvanse'));
    ok(L.licensed === false && /not confirmed/.test(L.licenceNote), 'TX-LIC-09: lisdexamfetamine at 9 with no methylphenidate trial -> condition not confirmed');
    L = T.licence(rec(9, { treatment: { prior: { a: { drug: 'mph', outcome: 'no_response', adequate: true } } } }), T.product('elvanse'));
    ok(L.licensed === true, 'TX-LIC-09: after an inadequate response to methylphenidate -> licensed');
    L = T.licence(rec(9, { treatment: { prior: { a: { drug: 'mph', outcome: 'no_response', adequate: true }, b: { drug: 'lisdex', outcome: 'not_tolerated' } } } }), T.product('amfexa_t'));
    ok(L.licensed === false && /responded to lisdexamfetamine but could not tolerate it/.test(L.licenceNote) && /1\.7\.9/.test(L.src), 'TX-LIC-09: dexamfetamine after lisdexamfetamine intolerance -> off-label (1.7.9 footnote)');
    ok(T.licence(rec(9), T.product('intuniv')).licensed === false && T.licence(rec(9, { treatment: { choice: { stimulantsUnsuitable: true } } }), T.product('intuniv')).licensed === true, 'TX-LIC-09: guanfacine needs stimulants unsuitable, not tolerated or not effective');
    ok(T.licence(rec(10), T.product('concerta')).licensed === true, 'TX-LIC-09: methylphenidate at 10 has no condition');

    /* TX-01: 6 weeks at the optimised dose, not since the first dose */
    const conc = ch(30, { drug: 'mph', product: 'concerta', startDose: 18, startDate: '2025-01-01' }, { reviews: {
      r1: { drug: 'mph', date: '2025-01-08', dose: 18, decision: 'increase', newDose: 36 }, r2: { drug: 'mph', date: '2025-01-22', dose: 36, decision: 'increase', newDose: 54 },
      r3: { drug: 'mph', date: '2025-01-29', dose: 54, decision: 'increase', newDose: 72 }, r4: { drug: 'mph', date: '2025-02-05', dose: 72, decision: 'optimised' } } });
    tr = T.trial(conc, '2025-02-12');
    ok(tr.adequate === false && tr.weeks === 6 && tr.weeksAtDose === 1, 'TX-01: 6 weeks since starting but 1 week at the optimised dose -> not adequate');
    ok(T.trial(conc, '2025-03-19').adequate === true, 'TX-01: 6 weeks at the optimised dose -> adequate');

    /* C4: the "2 occasions" rule skips a phone review with no readings */
    RV = ch(30, { drug: 'mph', product: 'concerta', startDose: 18 }, { baseline: { sbp: 120, dbp: 75 }, reviews: {
      a: { date: '2026-01-08', dose: 36, pulse: 125, sbp: 150, dbp: 95 }, b: { date: '2026-01-15', dose: 36 }, c: { date: '2026-01-22', dose: 36, pulse: 126, sbp: 152, dbp: 96 } } });
    F = T.reviewFlags(RV, 'c');
    ok(F.filter((f) => f.level === 'act').length === 2 && T.nextDose(RV).hold === true, 'C4: heart rate and blood pressure on 2 measured occasions -> act, and no increase');

    /* TX-03 / m1: adult blood pressure compared with the baseline */
    RV = rec(30, { treatment: { baseline: { sbp: 146, dbp: 92, repeat: { sbp: 147, dbp: 93 }, abpm: 'normal' }, reviews: { a: { date: '2026-02-01', sbp: 145, dbp: 92 }, b: { date: '2026-02-08', sbp: 144, dbp: 91 } } } });
    F = T.reviewFlags(RV, 'b');
    ok(!F.some((f) => f.level === 'act') && F.some((f) => f.level === 'watch' && /white-coat/.test(f.text)), 'TX-03: stable white-coat reading accepted at baseline -> watch, not act');
    RV = rec(30, { treatment: { baseline: { sbp: 110, dbp: 70 }, reviews: { a: { date: '2026-02-01', sbp: 137, dbp: 88 }, b: { date: '2026-02-08', sbp: 138, dbp: 88 } } } });
    F = T.reviewFlags(RV, 'b');
    ok(F.some((f) => f.level === 'act' && /rise from the baseline/.test(f.text) && /Clinical practice/.test(f.src)), 'TX-03: a rise of 27 mmHg on 2 reviews below 140/90 -> act, labelled clinical practice');
    RV = rec(30, { treatment: { baseline: { sbp: 100, dbp: 60 }, reviews: { a: { date: '2026-02-01', sbp: 138, dbp: 88 }, b: { date: '2026-02-08', sbp: 139, dbp: 89 } } } });
    ok(T.reviewFlags(RV, 'b').some((f) => f.level === 'act'), 'm1: 100/60 to 138/88 and 139/89 -> act');

    /* TX-02 / M8: young people, systolic above the 95th centile on 2 occasions */
    RV = ch(12, { drug: 'mph', product: 'concerta', startDose: 18 }, { baseline: { sbp: 118, dbp: 70, bpCentile: '90to95' }, reviews: {
      a: { date: '2026-02-01', dose: 18, sbp: 126, dbp: 80, bpCentile: 'gt95_once' }, b: { date: '2026-02-08', dose: 18, sbp: 127, dbp: 82, bpCentile: 'gt95_once' } } });
    ok(T.reviewFlags(RV, 'a').some((f) => f.level === 'watch' && /95th centile on one reading/.test(f.text)), 'TX-02: one review above the 95th centile -> watch');
    F = T.reviewFlags(RV, 'b');
    ok(F.some((f) => f.level === 'act' && /95th centile on 2 occasions/.test(f.text) && /paediatric hypertension specialist/.test(f.do) && /1\.8\.11/.test(f.src)), 'TX-02: two reviews above the 95th centile -> act (1.8.11)');
    ok(T.nextDose(RV).hold === true, 'TX-02: no dose increase after 2 readings above the 95th centile');
    /* m5 / M5: young readings that cannot match the centile entry */
    eq(T.bpCheck(rec(15), { sbp: 185, dbp: 125, bpCentile: 'lt90' }).level, 'urgent', 'M5: age 15, 185/125 with "below 90th" -> urgent');
    eq(T.bpCheck(rec(17), { sbp: 150, dbp: 95, bpCentile: 'lt90' }).level, 'repeat', 'M5: age 17, 150/95 with "below 90th" -> re-check');
    RV = rec(10, { treatment: { reviews: { a: { date: '2026-02-01', sbp: 182, dbp: 100 } } } });
    ok(/paediatric/.test(T.reviewFlags(RV, 'a')[0].do) && !/NG136/.test(T.reviewFlags(RV, 'a')[0].do), 'm5: young 180/120 -> same-day paediatric assessment, not NG136');
    /* m4: a third reading resolves the "confirm" */
    bpr = T.bpCheck(A, { sbp: 185, dbp: 100, repeat: { sbp: 150, dbp: 90 }, repeat3: { sbp: 135, dbp: 85 } });
    ok(bpr.level === 'ok' && bpr.clinic.sbp === 135 && /lower of the last two/.test(bpr.text), 'm4: with a third reading, the lower of the last 2 is the clinic reading');

    /* C3: urgent side effects at any level */
    AA.data.txSideEffects = AA.data.txSideEffects.concat([
      { id: 'se_liver', t: 'Signs of liver injury', action: 'Stop atomoxetine and check liver function the same day.', src: 'Atomoxetine SmPC 4.4' },
      { id: 'se_seizure', t: 'New seizures', action: 'Review the same day.', src: 'SmPC 4.4' },
      { id: 'se_mood', t: 'Low mood, or thoughts of self-harm or suicide', action: 'Any suicidal thoughts: assess risk the same day.', src: 'NICE NG87 1.8.16' }
    ]);
    RV = ch(30, { drug: 'atx', product: 'atomoxetine', startDose: 40 }, { reviews: { a: { date: '2026-02-01', dose: 40, se: { se_liver: 'mild', se_seizure: 'mild', se_mood: 'mild' } } } });
    F = T.reviewFlags(RV, 'a');
    ok(F.filter((f) => f.level === 'urgent').length === 2 && F.some((f) => f.level === 'act' && /suicid/.test(f.do)) && T.nextDose(RV).hold === true, 'C3: mild liver signs and seizures -> urgent; mild low mood (combined item) -> act; no increase');

    /* TX-05 / M7: conditional plan items */
    AA.data.txPlanItems = AA.data.txPlanItems.concat([{ id: 'tp_parenttrain', ages: 'young', t: 'Parent training (ODD or CD)' }, { id: 'tp_cbt', ages: 'young', t: 'CBT if medicine helps but problems remain' }]);
    const yPlan = (extra) => rec(14, Object.assign({ treatment: { plan: { decision: 'medication', steps: { tp_info: true, tp_parent: true, tp_pregnancy: true }, team: { specialist: true, competent: true, supervised: true } } } }, extra || {}));
    sp = T.stepProgress(yPlan(), 'txplan');
    ok(sp.done === sp.of, 'M7: 14-year-old with no ODD and no medicine yet -> treatment plan complete (' + sp.done + '/' + sp.of + ')');
    sp = T.stepProgress(yPlan({ ddx: { odd: { verdict: 'comorbid' } } }), 'txplan');
    ok(sp.of === sp.done + 1, 'M7: ODD recorded -> parent training counts');
    const naRec = yPlan({ ddx: { odd: { verdict: 'comorbid' } } }); naRec.treatment.plan.steps.tp_parenttrain = 'na';
    sp = T.stepProgress(naRec, 'txplan');
    ok(sp.done === sp.of, 'TX-05: an item marked not applicable is left out of the count');

    /* TX-09: intolerance is not 1.7.16 non-response */
    O = T.options(rec(10, { treatment: { prior: { p1: { drug: 'mph', outcome: 'not_tolerated' }, p2: { drug: 'atx', outcome: 'not_tolerated' } } } }));
    ok(O[4].status === 'possible' && !/1\.7\.16/.test(O[4].why) && /Clinical practice/.test(O[4].why) && O[3].status === 'next', 'TX-09: both classes not tolerated -> no 1.7.16 tertiary trigger; guanfacine still next');
    /* TX-13: dexamfetamine only after lisdexamfetamine helped */
    O = T.options(rec(10, { treatment: { prior: { p1: { drug: 'mph', outcome: 'no_response', adequate: true }, p2: { drug: 'lisdex', outcome: 'partial', adequate: true } } } }));
    eq(O[2].status, 'blocked', 'TX-13: lisdexamfetamine did not help enough -> dexamfetamine blocked');
    O = T.options(rec(10, { treatment: { prior: { p1: { drug: 'mph', outcome: 'no_response', adequate: true }, p2: { drug: 'lisdex', outcome: 'not_tolerated' } } } }));
    eq(O[2].status, 'possible', 'TX-13: lisdexamfetamine helped but not tolerated -> dexamfetamine possible');

    /* TX-11 / TX-12 */
    const os = T.applicable(rec(30, { formulation: { decision: 'other-specified' } }));
    ok(os.ok && os.caution === true && /outside NICE/.test(os.reason) && /1\.3\.3/.test(os.src), 'TX-11: other specified ADHD -> caution, outside NICE');
    ok(/no ADHD medicine is licensed under 6/.test(T.applicable(rec(5)).reason) && /1\.5\.10/.test(T.applicable(rec(5)).src), 'TX-12: under 6 is the tool\'s scope; the under-5 rules are not applied to a 5-year-old');

    /* m9: "ECG done" only when an ECG is recorded */
    v = T.baselineVerdict(rec(30, { treatment: { baseline: Object.assign(fullAdult(), { cardiac: { cx_chd: 'no', cx_faint: 'no', cx_med: 'yes', cx_htn: 'no' }, cardiology: 'cleared' }) } }));
    ok(v.reasons.some((x) => /record the ECG result/i.test(x.text)) && !v.reasons.some((x) => /ECG done/.test(x.text)), 'm9: cardiology cleared with no ECG -> asks for the ECG result');

    /* Workflow C1: reviews belong to a medicine (switch from Elvanse to Medikinet XL) */
    const sw = ch(30, { drug: 'mph', product: 'mkxl', startDose: 10, startDate: '2026-10-06', supplyDays: 28, weightKg: 70 }, { reviews: {
      e1: { drug: 'lisdex', date: '2026-09-01', dose: 30, decision: 'increase', newDose: 40 }, e2: { drug: 'lisdex', date: '2026-09-08', dose: 40, decision: 'increase', newDose: 50 },
      e3: { drug: 'lisdex', date: '2026-09-15', dose: 50, decision: 'optimised' }, e4: { drug: 'lisdex', date: '2026-10-06', dose: 50, decision: 'switch' },
      old: { date: '2026-10-06', dose: 50, decision: 'switch' } } });
    R = T.rxText(sw);
    ok(T.currentReviews(sw).length === 0 && /Medikinet XL 5 mg modified-release capsules\. Take ONE capsule twice a day\. Supply 56/.test(R.lines[0]), 'C1 workflow: after a switch the prescription is the new starting dose, 5 mg twice a day (' + R.lines[0] + ')');
    ok(T.trial(sw, '2026-10-20').optimised === false && T.nextDose(sw).dose !== 60, 'C1 workflow: the old medicine\'s optimised dose does not carry over');
    /* Workflow C2 / safety M1: the dose follows the latest decision */
    const dec = (r) => ch(30, { drug: 'mph', product: 'concerta', startDose: 18, startDate: '2026-01-01', supplyDays: 28 }, { reviews: { a: Object.assign({ date: '2026-01-15', dose: 54 }, r) } });
    R = T.rxText(dec({ decision: 'stop' }));
    ok(!R.lines.length && R.stopped && R.errors.some((w) => /stopped/.test(w)), 'M1/C2: after "Stop" -> no prescription');
    R = T.rxText(dec({ decision: 'reduce' }));
    ok(!R.lines.length && R.warnings.some((w) => /Enter the new daily dose/.test(w)), 'M1/C2: after "Reduce" with no new dose -> no wording at the old dose');
    R = T.rxText(dec({ decision: 'reduce', newDose: 36 }));
    ok(/Concerta XL 36 mg/.test(R.lines[0]), 'C2: the new dose agreed at the review is prescribed');
    R = T.rxText(dec({ decision: 'increase' }));
    ok(!R.lines.length && R.warnings.some((w) => /Suggested: 72 mg/.test(w)), 'C2: after "Increase" -> the new dose is asked for, with the suggestion');
    let sx = dec({ decision: 'optimised' }); sx.treatment.choice.rxDose = 36; sx.treatment.choice.rxDoseDate = '2026-01-10';
    R = T.rxText(sx);
    ok(/Concerta XL 54 mg/.test(R.lines[0]) && R.warnings.some((w) => /entered before the review/.test(w)), 'C2: a typed dose older than the latest review is not used');
    sx.treatment.choice.rxDoseDate = '2026-01-20';
    ok(/Concerta XL 36 mg/.test(T.rxText(sx).lines[0]), 'C2: a typed dose entered after the latest review is used');
    eq(T.rxDose(dec({ decision: 'stay' })).dose, 54, 'C2: rxDose after "Stay" is the review dose');
    /* Workflow M1: the latest decision sets the state */
    const ms2 = ch(30, { drug: 'mph', product: 'concerta', startDose: 18, startDate: '2026-01-01' }, { reviews: { a: { date: '2026-01-15', dose: 54, decision: 'optimised' }, b: { date: '2026-02-15', dose: 54, decision: 'stop' } } });
    tr = T.trial(ms2, '2026-03-01');
    ok(tr.stopped === true && tr.optimised === false && T.nextDose(ms2).stopped === true && T.nextDose(ms2).dose === null, 'M1 workflow: optimised then stop -> stopped, no next dose');
    ok(T.stepProgress(ms2, 'titrate').done === 2, 'M1 workflow: a stopped medicine completes the titration step');
    ms2.treatment.reviews.b.decision = 'increase';
    ok(T.trial(ms2, '2026-03-01').optimised === false && T.stepProgress(ms2, 'titrate').done === 1, 'M1 workflow: optimised then increase -> no longer optimised');
    /* Workflow M2: an optimised review with an act flag is held */
    const held = ch(30, { drug: 'mph', product: 'concerta', startDose: 18, startDate: '2026-01-01' }, { baseline: { sbp: 120, dbp: 78 }, reviews: { a: { date: '2026-01-15', dose: 54, sbp: 142, dbp: 91 }, b: { date: '2026-01-22', dose: 54, sbp: 144, dbp: 92, decision: 'optimised' } } });
    ok(T.medState(held).held === true && T.trial(held, '2026-04-01').optimised === false && T.trial(held, '2026-04-01').adequate === false && T.stepProgress(held, 'titrate').done === 1, 'M2 workflow: optimised with an act flag -> held, not adequate, titration not complete');
    held.treatment.reviews.b.flagOverride = 'Discussed with the consultant: ambulatory readings normal.';
    ok(T.medState(held).optimised === true, 'M2 workflow: a recorded override reason releases the hold');
    /* Workflow M3: the diagnosis check */
    const dc = T.diagnosisCheck(rec(30, { formulation: { decision: 'met' } }));
    ok(dc.ok === false && dc.issues.some((x) => /safety and risk step/.test(x.text)), 'M3 workflow: decision "met" without findings or a risk review -> issues listed');
    /* Workflow M4: safety-step answers reach the safety screen and the verdict */
    AA.data.risk = { items: [{ id: 'r_si_plan', short: 'Suicidal plan or intent', level: 'urgent' }, { id: 'r_child', ages: 'adult', short: 'Child safeguarding', level: 'high' }] };
    const rk = rec(30, { risk: { r_si_plan: true, r_child: true }, treatment: { baseline: fullAdult() } });
    delete rk.treatment.baseline.ci.ci_depression;
    AA.data.txCautions = AA.data.txCautions.concat([{ id: 'ci_depression', t: 'Severe depression, or current suicidal thoughts', src: 'SmPC 4.3' }]);
    const ans = T.ciAnswer(rk, 'ci_depression');
    ok(ans.v === 'yes' && ans.fromRisk === true, 'M4 workflow: a ticked suicidal plan pre-fills the depression item (fromRisk)');
    v = T.baselineVerdict(rk);
    ok(v.level === 'stop' && v.reasons.some((x) => /Safety step: Suicidal plan or intent/.test(x.text)) && v.reasons.some((x) => x.level === 'caution' && /Child safeguarding/.test(x.text)), 'M4 workflow: urgent risk item -> stop; high -> caution');
    rk.treatment.baseline.ci.ci_depression = 'no';
    eq(T.ciAnswer(rk, 'ci_depression').v, 'no', 'M4 workflow: an explicit answer wins over the safety step');

    /* Monitoring items whose field is a date kept in treatment.monitor */
    AA.data.txMonitor = { young: [{ id: 'mn_need', what: 'Still needed?', drugs: ['gxr'], schedule: [3, 6, 9, 12], months: 12, field: 'needReviewDate', specialistOnly: true }], adult: [] };
    M = T.monitorPlan(rec(10, { treatment: { choice: { drug: 'gxr', startDate: '2026-01-01' }, monitor: { needReviewDate: '2026-04-05' } } }), '2026-05-01');
    ok(M[0].last === '2026-04-05' && M[0].due === '2026-07-01' && M[0].specialistOnly === true, 'monitorPlan: a monitor date field gives the last check; specialistOnly is passed on');
    /* "When to take it" read as doses a day */
    ok(T.timesCount('each morning') === 1 && T.timesCount('morning and lunchtime') === 2 && T.timesCount('three times a day') === 3 && T.timesCount('8am and 1pm') === 2 && T.timesCount('morning or evening') === 'or' && T.timesCount('each morning with or after food') === 1 && T.timesCount('with food') === null, 'timesCount reads the number of doses and spots a choice of times');

    /* ================= shared contract, round 2 ================= */
    AA.data.txCautions = AA.data.txCautions.concat([
      { id: 'ci_acidsuppress', t: 'Takes a proton pump inhibitor, H2 blocker or antacid', src: 'Medikinet XL SmPC 4.3' },
      { id: 'ci_hepatic', t: 'Moderate or severe liver impairment', src: 'Atomoxetine SmPC 4.2' },
      { id: 'ci_cyp3a4_inh', t: 'Moderate or strong CYP3A4 inhibitor', src: 'Intuniv SmPC 4.2' },
      { id: 'ci_cyp3a4_ind', t: 'Strong CYP3A4 inducer', src: 'Intuniv SmPC 4.2' }
    ]);
    AA.data.txProducts = AA.data.txProducts.concat([
      { id: 'mkxl_ci', drug: 'mph', name: 'Medikinet XL', form: 'Modified-release capsule', ir: false, strengths: [5, 10, 20, 30, 40, 50, 60], ci: ['ci_acidsuppress'],
        licensed: { child: true, adultStart: true, adultContinue: true }, dose: { child: { start: 5, step: [5, 10], max: 60, perDay: 1 }, adult: { start: 10, step: 10, max: 80, maxMgPerKg: 1, perDay: 2 } } },
      { id: 'amfexa_u', drug: 'dex', name: 'Amfexa', form: 'Tablet', release: 'Immediate release', ir: true, strengths: [5, 10, 20],
        licensed: { child: true, adultStart: false, adultContinue: false },
        dose: { child: { start: 10, step: 5, usualMax: 20, max: 40, perDay: 2 } }, bnf: { adult: '5 mg twice a day, maximum 60 mg a day (off-label)' } }
    ]);
    /* A product's own contraindication (Medikinet XL with acid-suppressing medicines) blocks it */
    const acid = (choice) => rec(30, { treatment: { baseline: { ci: { ci_acidsuppress: 'yes' } }, choice: choice || {} } });
    P = T.products(acid(), 'mph');
    ok(P.find((x) => x.id === 'mkxl_ci').blocked.some((r) => /Contraindicated with Medikinet XL/.test(r.text)) && P.find((x) => x.id === 'concerta').blocked.length === 0, 'product ci: Medikinet XL blocked with acid suppression; Concerta XL not');
    dp = T.dosePlan(acid(), 'mkxl_ci', 70);
    ok(dp.blocked.length === 1 && dp.blocked[0].product === 'mkxl_ci', 'product ci: dosePlan blocks Medikinet XL');
    const acidCh = acid({ drug: 'mph', product: 'mkxl_ci', startDose: 20, supplyDays: 28, weightKg: 70 });
    ok(T.nextDose(acidCh).hold === true && T.rxText(acidCh).errors.some((w) => /Contraindicated with Medikinet XL/.test(w)), 'product ci: no dose increase and an error next to the wording');
    ok(T.dosePlan(rec(30), 'mkxl_ci', 70).blocked.length === 0, 'product ci: not blocked when the item is not yes');
    ok(T.baselineVerdict(acid()).reasons.some((x) => /rules out Medikinet XL/.test(x.text)), 'product ci: the verdict names the product it rules out');

    /* Child-Pugh class (asked when the liver item is yes) */
    dp = T.dosePlan(ciRec(30, { ci_hepatic: 'yes' }, null, { childPugh: 'B' }), 'atomoxetine');
    ok(dp.start === 20 && dp.target === 40 && dp.max === 50 && dp.warnings.some((w) => /Child-Pugh B/.test(w)) && !dp.warnings.some((w) => /needs 25%/.test(w)), 'Child-Pugh B: start 20, target 40, maximum 50');
    dp = T.dosePlan(ciRec(30, { ci_hepatic: 'yes' }, null, { childPugh: 'A' }), 'atomoxetine');
    ok(dp.start === 40 && dp.target === 80 && dp.max === 100 && dp.warnings.some((w) => /Child-Pugh A/.test(w)), 'Child-Pugh A: usual doses, with a note');
    dp = T.dosePlan(ciRec(30, { ci_hepatic: 'no' }, null, { childPugh: 'C' }), 'atomoxetine');
    ok(dp.start === 40 && dp.max === 100, 'Child-Pugh: a class left over when the liver item is "no" is ignored');
    ok(T.baselineVerdict(ciRec(30, { ci_hepatic: 'yes' })).reasons.some((x) => /Record the Child-Pugh class/.test(x.text)), 'Child-Pugh: the verdict asks for the class');

    /* CYP3A4: inhibitor halved to whole tablets; the older combined item */
    dp = T.dosePlan(ciRec(14, { ci_cyp3a4_inh: 'yes' }), 'intuniv', 60);
    ok(dp.maxHalved === 3.5 && dp.max === 3 && /3\.5 mg, rounded down to 3 mg/.test(dp.maxText), 'CYP3A4 inhibitor at 14 y, 60 kg: 7 mg halved to 3.5 mg, rounded down to 3 mg');
    eq(T.dosePlan(ciRec(14, { ci_cyp3a4: 'yes', ci_cyp3a4_inh: 'no', ci_cyp3a4_ind: 'no' }), 'intuniv', 60).max, 7, 'CYP3A4: the older combined item is ignored once the two new items are answered');
    ok(T.baselineVerdict(ciRec(14, { ci_cyp3a4: 'yes' })).reasons.some((x) => /older answer/.test(x.text)), 'CYP3A4: an older combined answer asks for the two new items');

    /* Dexamfetamine: the ladder stops at the usual maximum (20 mg); 40 mg only as a recorded specialist decision */
    dp = T.dosePlan(rec(10), 'amfexa_u');
    ok(dp.usualMax === 20 && dp.max === 40 && dp.steps[dp.steps.length - 1].dose === 20 && /usually a maximum of 20 mg/.test(dp.maxText), 'usualMax: child ladder stops at 20 mg, maximum 40 kept');
    eq(T.nextDose(ch(10, { drug: 'dex', product: 'amfexa_u', startDose: 15 })).dose, 20, 'usualMax: 15 -> 20 mg');
    N = T.nextDose(ch(10, { drug: 'dex', product: 'amfexa_u', startDose: 20 }));
    ok(N.hold === true && N.dose === 20 && N.atMax === true && /specialist decision; record the reason/.test(N.text), 'usualMax: holds at 20 mg with the specialist note');
    eq(T.nextDose(ch(10, { drug: 'dex', product: 'amfexa_u', startDose: 20, overMaxReason: 'Consultant decision.' })).dose, 25, 'usualMax: with a recorded reason the next step is offered');
    R = T.rxText(ch(10, { drug: 'dex', product: 'amfexa_u', startDose: 30, supplyDays: 28 }));
    ok(R.lines.length > 0 && !R.errors.length && R.warnings.some((w) => /above the usual maximum of 20 mg/.test(w)), 'usualMax: 30 mg is written with a warning, not an error');
    ok(T.rxText(ch(10, { drug: 'dex', product: 'amfexa_u', startDose: 45, supplyDays: 28 })).errors.some((w) => /above the SmPC maximum of 40 mg/.test(w)), 'usualMax: above 40 mg is an error');
    eq(T.dosePlan(rec(30), 'amfexa_u').usualMax, null, 'usualMax: not applied to the borrowed adult schedule');
    ok(T.trial(ch(10, { drug: 'dex', product: 'amfexa_u', startDose: 10, startDate: '2026-01-01' }, { reviews: { a: { drug: 'dex', date: '2026-01-15', dose: 20, decision: 'stay' } } }), '2026-03-01').adequate === true, 'usualMax: 6 weeks at the usual maximum is an adequate trial');

    /* Side effects: urgent items; low mood needs an answer about suicidal thoughts */
    AA.data.txSideEffects = AA.data.txSideEffects.filter((x) => x.id !== 'se_mood').concat([
      { id: 'se_mood', t: 'Low mood, tearfulness or irritability', action: 'Review the dose.', src: 'SmPC 4.4' },
      { id: 'se_suicidal', t: 'Suicidal thoughts or self-harm', action: 'Assess risk the same day.', urgent: true, src: 'SmPC 4.4' },
      { id: 'se_chest', t: 'Chest pain, fainting or breathlessness on exertion', action: 'Same-day medical review.', urgent: true, src: 'SmPC 4.4' },
      { id: 'se_custom', t: 'A data item marked urgent', action: 'Same day.', urgent: true, src: 'test' }
    ]);
    const seR = (se) => ch(30, { drug: 'mph', product: 'concerta', startDose: 36 }, { reviews: { a: { date: '2026-02-01', dose: 36, se: se } } });
    ok(T.reviewFlags(seR({ se_mood: 'mild', se_suicidal: 'none' }), 'a').length === 0, 'se_mood: mild low mood with suicidal thoughts answered "none" -> no flag');
    F = T.reviewFlags(seR({ se_mood: 'mild' }), 'a');
    ok(F.length === 1 && F[0].level === 'act' && /suicid/.test(F[0].do), 'se_mood: mild low mood with no answer about suicidal thoughts -> act');
    ok(['se_suicidal', 'se_chest', 'se_custom'].every((id) => { const o = {}; o[id] = 'mild'; return T.reviewFlags(seR(o), 'a').some((f) => f.level === 'urgent'); }), 'urgent items: suicidal thoughts, chest pain and any urgent: true item are urgent when mild');
    ok(T.nextDose(seR({ se_chest: 'mild' })).hold === true, 'urgent item: no dose increase');

    /* The diagnosis re-check counts only when medicine is planned */
    AA.data.txPlanItems = AA.data.txPlanItems.concat([{ id: 'tp_recheck', ages: 'all', conditional: true, when: 'medication', t: 'Diagnosis re-checked' }]);
    const rk2 = (decision) => rec(30, { treatment: { plan: { decision: decision, steps: {} } } });
    ok(T.planItemApplies(rk2('medication'), AA.byId('txPlanItems', 'tp_recheck')) && !T.planItemApplies(rk2('nondrug'), AA.byId('txPlanItems', 'tp_recheck')) && !T.planItemApplies(rk2('refer'), AA.byId('txPlanItems', 'tp_recheck')), 'tp_recheck: counts unless the plan is non-drug support only or a referral');
    eq(T.stepProgress(rk2('medication'), 'txplan').of - T.stepProgress(rk2('refer'), 'txplan').of, 1 + 3, 'tp_recheck: one more item when medicine is planned than for a referral (plus the 3 scope boxes)');

    /* Shared care: the GP's checks leave out what the specialist keeps */
    AA.data.txMonitor = { young: [{ id: 'mn_h', what: 'Height', months: 6 }, { id: 'mn_need', what: 'Still needed?', drugs: ['gxr'], schedule: [3, 6, 9, 12], months: 12, field: 'needReviewDate', specialistOnly: true }], adult: [] };
    const scr = rec(10, { treatment: { choice: { drug: 'gxr', startDate: '2026-01-01' } } });
    M = T.monitorPlan(scr, '2026-02-01');
    const SC = T.sharedCarePlan(scr, '2026-02-01');
    ok(M.some((x) => x.id === 'annual' && x.specialistOnly === true) && SC.map((x) => x.id).join() === 'mn_h', 'sharedCarePlan: only the GP checks (no specialist-only items, no annual review)');

    /* ---------- missing data never throws ---------- */
    KEYS.forEach((k) => { delete AA.data[k]; });
    let threw = false;
    try {
      const E = rec(30, { treatment: { choice: { drug: 'mph', product: 'concerta' }, reviews: { a: { date: '2026-01-01' } } } });
      T.baselineVerdict(E); T.options(E); T.products(E, 'mph'); T.dosePlan(E, 'concerta'); T.rxText(E); T.monitorPlan(E);
      T.reviewFlags(E, 'a'); T.nextDose(E); T.trial(E); T.cautionsFor(E, 'mph');
      ['txplan', 'baseline', 'prescribe', 'titrate', 'monitor'].forEach((s) => T.stepProgress(E, s));
      T.stepProgress(null, 'baseline'); T.bpCheck(E, null); T.baselineVerdict({});
    } catch (e) { threw = e; }
    ok(!threw, 'tx engine copes with missing treatment data' + (threw ? ': ' + threw.message : ''));
  }
};
