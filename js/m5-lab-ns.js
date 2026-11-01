/* Module 5 medicine labs: atomoxetine ("atx") and guanfacine ("gua"). Registers definitions with M5LAB.add (engine: js/m5-lab.js).
   Every number here comes from a primary source read on 1 November 2026: the atomoxetine SmPC (Zentiva, emc 10332, text revised
   6 Dec 2024; Aurobindo/Milpharm, emc 11171, revised 4 Aug 2026), the Intuniv SmPC (emc 5099, revised 5 Mar 2026), the Neuraxpharm
   guanfacine letter dated 9 Oct 2026 (MHRA-hosted), NICE NG87 and the Elvanse SmPC (head-to-head trial). Every conversion result
   carries one honest status badge: SmPC table, SmPC statement, Guideline (no numbers), Local NHS protocol (not national),
   Worked out from the SmPC (not official), or No official method. Nothing here invents a cross-taper, overlap or conversion.
   Curves are PLASMA-LEVEL shapes from js/release-model.js (keys atx_em, atx_pm, atx_inh, gua_pr; the comment there says what each is
   fitted to and what it does not claim). They are not clinical-effect curves. */
(function () {
  'use strict';
  if (!window.M5LAB) return;
  var RM = window.RELMODEL;

  /* ---------- small helpers ---------- */
  function r1(n) { return Math.round(n * 10) / 10; }
  function r2(n) { return Math.round(n * 100) / 100; }
  function mg(n) { return r1(n) + ' mg'; }
  function ucfirst(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* The engine scales every model curve to unit area over (x.to + 2) hours (see sample() in js/m5-lab.js), so a "relative exposure"
     weight has to be multiplied by the share of one dose's total area that falls inside that window. Without this a slow-clearing
     curve (poor metaboliser, half-life 21 h) would be drawn too tall. */
  var AREA = {};
  function area(model, hours) {
    var id = model + '|' + hours;
    if (AREA[id] == null) { var c = RM.curve(model, null, hours), s = 0, i; for (i = 0; i < c.length; i++) s += c[i] * RM.DT; AREA[id] = s; }
    return AREA[id];
  }
  function wt(model, x, rel) { return rel * area(model, Math.ceil(x.to) + 2) / area(model, 600); }

  var ST = { table: 'SmPC table', stmt: 'SmPC statement', guide: 'Guideline (no numbers)', local: 'Local NHS protocol (not national)',
    calc: 'Worked out from the SmPC (not official)', none: 'No official method' };
  var SRC = {
    atx: 'Source: atomoxetine hard capsules SmPC (Zentiva, revised 6 December 2024; the Aurobindo/Milpharm SmPC revised 4 August 2026 has the same dosing wording).',
    gua: 'Source: Intuniv SmPC (Takeda UK, revised 5 March 2026).',
    ng: 'NICE NG87 (2018, updated 2019).'
  };
  var NOTE_LEVEL = 'Curves are schematic and show the level of the medicine in the blood, not how well symptoms are controlled: shapes follow the SmPC peak times and half-lives, heights are relative, and real responses vary. Dose charts show what the SmPC allows, not a prescription: the prescriber decides.';

  /* ---------- capsule arithmetic for atomoxetine (strengths on emc, 1 Nov 2026) ---------- */
  var CAPS = [10, 18, 25, 40, 60, 80, 100];
  var COMBO = (function () {
    var out = {}, i, j;
    function put(sum, list) {
      var cur = out[sum];
      if (!cur || list.length < cur.length || (list.length === cur.length && list.length === 2 && list[0] === list[1] && cur[0] !== cur[1])) out[sum] = list;
    }
    for (i = 0; i < CAPS.length; i++) { put(CAPS[i], [CAPS[i]]); for (j = i; j < CAPS.length; j++) put(CAPS[i] + CAPS[j], [CAPS[i], CAPS[j]]); }
    return out;
  })();
  var SUMS = Object.keys(COMBO).map(Number).sort(function (a, b) { return a - b; });
  function capText(sum) {
    var c = COMBO[sum];
    return c.length === 1 ? 'one ' + c[0] + ' mg capsule' : (c[0] === c[1] ? 'two ' + c[0] + ' mg capsules' : 'one ' + c[0] + ' mg and one ' + c[1] + ' mg capsule');
  }
  /* The nearest amounts that up to two capsules can make at one dose time: at or below, and at or above, the wanted amount. */
  function nearest(d) {
    var below = null, above = null, i;
    for (i = 0; i < SUMS.length; i++) { if (SUMS[i] <= d + 1e-9) below = SUMS[i]; if (SUMS[i] >= d - 1e-9 && above === null) above = SUMS[i]; }
    return { below: below, above: above, exact: below !== null && above !== null && Math.abs(below - above) < 1e-9 };
  }
  /* Words for "what real capsules give this daily total at n dose times". w = weight in kg for mg/kg (or 0). */
  function capsLine(total, n, w) {
    var d = total / n, nr = nearest(d), per = n === 2 ? ' at each of the two dose times' : '';
    function one(s) { var tt = s * n; return mg(tt) + ' (' + capText(s) + per + (w ? ', ' + r2(tt / w) + ' mg/kg' : '') + ')'; }
    if (nr.exact) return mg(total) + ' can be made exactly: ' + capText(nr.below) + per + '.';
    if (nr.below === null) return 'Each dose would be ' + mg(d) + ', which is smaller than the smallest capsule (10 mg). The nearest real dose is ' + one(nr.above) + '.';
    if (nr.above === null) return mg(total) + ' needs more than two of the biggest capsule at a dose time. The nearest is ' + one(nr.below) + '.';
    return 'No capsule, or pair of capsules, gives exactly ' + mg(total) + '. The nearest are ' + one(nr.below) + ' and ' + one(nr.above) + '.';
  }

  /* ================================================================================================
     ATOMOXETINE
     ================================================================================================ */
  var AX = { from: 6, to: 30, tick: 3, fmt: 'clock' };       /* 06:00 to 06:00 the next morning */
  var PM_REL = wt('atx_pm', AX, 10), EM_REL = wt('atx_em', AX, 1);
  var INH6 = wt('atx_inh', AX, 6), INH8 = wt('atx_inh', AX, 8);

  var ATX_DAY = {
    kind: 'day', label: 'Through the day',
    x: AX, doseAt: 7.5, doseTimes: [6.5, 7, 7.5, 8, 8.5, 9], bedtime: 22, compare: true,
    picks: [
      { id: 'once', chip: 'Once daily', tag: 'Morning dose', color: '#0b6664', tint: '#e3f4f3', name: 'Atomoxetine once daily in the morning',
        regimen: [{ model: 'atx_em', at: 0, mg: EM_REL }],
        inside: 'A hard capsule taken by mouth. The curve is the level in the blood after one dose, in someone with normal CYP2D6 (an “extensive metaboliser”).',
        moments: [
          { t: 'Peak 1 to 2 hours after the capsule', h: 1.5, d: 'The SmPC puts the highest blood level about 1 to 2 hours after dosing. The curve peaks at 1.5 hours, the middle of that range.' },
          { t: 'Half-life 3.6 hours', h: 5.1, d: 'In people with normal CYP2D6 the mean half-life is 3.6 hours: once the level is falling it halves about every 3.6 hours.' },
          { t: 'Evening: low level, effect not stated', h: 11, d: 'By evening the blood level is low. The SmPC gives no time at which the clinical effect peaks or fades, so do not read this curve as symptom control.' }
        ],
        practice: ['The SmPC says a single morning dose is possible, with or without food.'],
        note: 'Plasma level only. The SmPC says atomoxetine was effective as a single daily dose and as a divided dose. It states no daily peak of clinical effect either way.' },
      { id: 'split', chip: 'Split', tag: 'Two equal doses', color: '#2f6fb3', tint: '#e8f0fa', name: 'Atomoxetine split into two evenly divided doses',
        regimen: [{ model: 'atx_em', at: 0, mg: EM_REL / 2 }, { model: 'atx_em', at: 9, mg: EM_REL / 2 }],
        inside: 'The same total daily dose, cut in half. The SmPC says “evenly divided doses in the morning and late afternoon or early evening”.',
        moments: [
          { t: 'Morning half-dose: peak at 1 to 2 hours', h: 1.5, d: 'Half the daily dose, so a lower peak than one big morning capsule.' },
          { t: 'Why split at all?', h: 5, d: 'The SmPC offers it if a single daily dose does not give a satisfactory response: because of tolerability (for example nausea or somnolence) or because of efficacy.' },
          { t: 'Second half: late afternoon or early evening', h: 10.5, d: 'The SmPC gives no clock time. The graph puts the second dose 9 hours after the first.' }
        ],
        practice: ['Same total in 24 hours. Only the timing changes.'],
        note: 'Plasma level only. Tap “Compare with” to lay the once-daily curve over this one.' },
      { id: 'pm', chip: 'Poor metaboliser', tag: 'Slow CYP2D6', color: '#a8432e', tint: '#fbe9e5', name: 'Atomoxetine in a CYP2D6 poor metaboliser',
        series: [
          { label: 'Poor metaboliser', model: 'atx_pm', mg: PM_REL, color: '#a8432e', tint: '#fbe9e5' },
          { label: 'Usual (normal CYP2D6)', model: 'atx_em', mg: EM_REL, color: '#16324f', dashed: true }
        ],
        moments: [
          { t: 'Same capsule, about 10 times the exposure', h: 1.5, d: 'In poor metabolisers the area under the curve (AUC) is about 10 times that of extensive metabolisers (SmPC). The graph is drawn so its area is 10 times larger.' },
          { t: 'Half-life 21 hours', h: 20, d: 'The mean half-life is 21 hours, against 3.6 hours. Worked out from the half-life: a day after the capsule about half of the peak level is still there, so the next capsule lands on top of it.' },
          { t: 'Steady-state peak about 5-fold (not drawn)', h: 5, d: 'With repeated dosing the SmPC gives a peak (Css,max) about 5-fold higher. One dose cannot show a steady-state figure, so it is not drawn.' },
          { t: 'What the SmPC suggests', h: 12, d: 'About 7% of white people (“Caucasians” in the SmPC) are poor metabolisers. For a known poor metaboliser, a lower starting dose and slower titration “may be considered”. No dose cut is given.' }
        ],
        note: 'Plasma level only. The height of the single-dose peak is not an SmPC figure; the area (10-fold) is.' },
      { id: 'inh', chip: 'With fluoxetine', tag: 'or paroxetine', color: '#6b4fa3', tint: '#efe9f7', name: 'Atomoxetine with a strong CYP2D6 inhibitor',
        series: [
          { label: 'With an inhibitor: 6 times', model: 'atx_inh', mg: INH6, color: '#6b4fa3', tint: '#efe9f7' },
          { label: 'With an inhibitor: 8 times', model: 'atx_inh', mg: INH8, color: '#3d2a6e' },
          { label: 'Usual (no inhibitor)', model: 'atx_em', mg: EM_REL, color: '#16324f', dashed: true }
        ],
        moments: [
          { t: 'Exposure 6 to 8 times higher', h: 1.5, d: 'With a strong CYP2D6 inhibitor (fluoxetine, paroxetine, quinidine, terbinafine) the SmPC says exposure “may be 6-to 8-fold increased”. The two purple lines are 6 times and 8 times the usual area.' },
          { t: 'Steady-state peak 3 to 4 times (not drawn)', h: 5, d: 'The SmPC also gives a steady-state peak (Css,max) “3 to 4 times higher”. It is not drawn. It gives no half-life with an inhibitor, so both purple curves keep the usual shape and are only taller.' },
          { t: 'What to do', h: 10, d: 'Slower titration and a lower final dose “may be necessary”. The SmPC gives no number. If an inhibitor is started or stopped after titration, re-evaluate response and tolerability.' }
        ],
        note: 'Plasma level only. Only the size of the rise is from the SmPC; the shape is the usual one.' }
    ]
  };

  /* --- atomoxetine: dose ---------------------------------------------------------------- */
  function kgOptions(a, b, step) { var o = [], k; for (k = a; k <= b + 1e-9; k += step) o.push({ v: String(r1(k)), l: r1(k) + ' kg' }); return o; }
  function niceMax(m) { return Math.max(10, Math.ceil(m * 1.2 / 5) * 5); }

  function atxDose(v) {
    var adult = v.grp === 'adult', w = adult ? 0 : (+v.w || 30), n = v.sched === '2' ? 2 : 1;
    var light = !adult && w <= 70;                          /* exactly 70 kg counts as "up to 70 kg" */
    var f = v.mod === 'cpb' ? 0.5 : (v.mod === 'cpc' ? 0.25 : 1);
    var start = light ? 0.5 * w * f : 40 * f;
    var lo = light ? 1.2 * w * f : 80 * f, hi = adult ? 100 * f : lo;
    var who = adult ? 'an adult' : (light ? 'a child or teenager up to 70 kg' : 'a child or teenager over 70 kg');
    var rows = [], notes = [];
    var liverTxt = f === 1 ? '' : ' This is ' + (f === 0.5 ? '50%' : '25%') + ' of the usual dose (Child-Pugh ' + (f === 0.5 ? 'B' : 'C') + ').';
    var tone = 'info', head;

    head = light
      ? 'Start about ' + mg(start) + ' a day. Aim for about ' + mg(lo) + ' a day.'
      : 'Start ' + mg(start) + ' a day. Aim for ' + (adult ? mg(lo) + ' to ' + mg(hi) : mg(lo)) + ' a day.';

    rows.push({ h: 'Start, then target',
      t: '<b>Start (at least 7 days):</b> ' + (light ? 'about ' + mg(start) + ' a day (0.5 mg/kg × ' + w + ' kg)' : mg(start) + ' a day, a fixed dose' + (adult ? ' for every adult' : ' above 70 kg')) + '.<br><b>Target:</b> ' +
        (light ? 'about ' + mg(lo) + ' a day (1.2 mg/kg × ' + w + ' kg). No extra benefit has been shown above 1.2 mg/kg a day.' : (adult ? mg(lo) + ' to ' + mg(hi) + ' a day.' : mg(lo) + ' a day. No extra benefit has been shown above 80 mg.')) + liverTxt });
    /* real capsules: the prescriber decides */
    var cw = light ? w : 0;
    rows.push({ h: 'Real capsules (worked out, not official; the prescriber decides)',
      t: '<b>Start:</b> ' + capsLine(start, n, cw) + '<br><b>' + (hi !== lo ? 'Target, low end:' : 'Target:') + '</b> ' + capsLine(lo, n, cw) + (hi !== lo ? '<br><b>Target, high end:</b> ' + capsLine(hi, n, cw) : '') });

    var half = lo / 2;
    rows.push({ h: n === 2 ? 'Two doses a day (evenly divided)' : 'Once daily or split: the same total',
      t: n === 2 ? 'Target ' + mg(lo) + ' a day = ' + mg(half) + ' in the morning + ' + mg(half) + ' in the late afternoon or early evening. The total does not change.'
        : mg(lo) + ' once in the morning, or ' + mg(half) + ' + ' + mg(half) + ' (morning, and late afternoon or early evening). The total is the same either way.' });

    if (v.mod === 'pm') {
      tone = 'warn';
      rows.push({ h: 'CYP2D6 poor metaboliser (SmPC statement)', t: 'About 10 times the exposure. “A lower starting dose and slower up titration of the dose may be considered.” The SmPC gives no dose cut, so the figures above are the usual ones, not adjusted.' });
    } else if (v.mod === 'inh') {
      tone = 'warn';
      rows.push({ h: 'Strong CYP2D6 inhibitor (SmPC statement)', t: 'Exposure may be 6- to 8-fold higher. “Slower titration and final lower dosage … may be necessary.” The SmPC gives no number, so the figures above are the usual ones, not adjusted. Re-evaluate if an inhibitor is started or stopped after titration.' });
    } else if (f !== 1) {
      tone = 'warn';
      notes.push('The mg figures are arithmetic on the SmPC percentages. A local shared-care protocol (Dorset, February 2025: local, not national) also caps the total daily dose at ' + (f === 0.5 ? '50 mg in Child-Pugh B' : '25 mg in Child-Pugh C') + '.');
    }
    notes.push(light
      ? '<b>Limit:</b> the SmPC gives no maximum for this group. It says the safety of total daily doses above 1.8 mg/kg (' + mg(1.8 * w) + ' here) has not been systematically evaluated.'
      : (f === 1 ? '<b>Limit:</b> the maximum recommended total daily dose is 100 mg. Single doses over 120 mg and total daily doses above 150 mg have not been systematically evaluated.'
        : '<b>Limit:</b> the SmPC reduces the start and target doses in liver impairment but does not restate a maximum.'));
    notes.push('The SmPC gives no middle step or speed between the start dose and the target. Adding a step is a clinical choice.');
    notes.push('Capsules: 10, 18, 25, 40, 60, 80 and 100 mg (UK generics on emc, 1 November 2026). Check blood pressure and pulse after every dose change and at least every 6 months.');
    if (adult) notes.push('Some BNF-style shared-care protocols dose adults up to 70 kg by weight (500 micrograms/kg a day to start). The SmPC gives every adult a fixed 40 mg, and this tool follows the SmPC.');

    /* chart: the earliest schedule the SmPC allows (total mg a day) */
    var peak = Math.max(start, lo, hi), ceil = null, ceilTxt = '';
    if (light) { ceil = 1.8 * w; ceilTxt = '1.8 mg/kg a day (' + mg(ceil) + '): above this, safety is not systematically evaluated'; }
    else if (f === 1) { ceil = 100; ceilTxt = 'Maximum recommended total daily dose, 100 mg'; }
    var ymax = niceMax(Math.max(peak, ceil || 0));
    var chart = {
      kind: 'weeks', x: { from: 1, to: 15, unit: 'day', title: 'Days from the first dose (earliest schedule)' }, y: { max: ymax, label: 'Total mg a day (same if split)' },
      color: '#0b6664', tint: '#a3d5cf',
      steps: [{ a: 1, b: 8, v: r1(start) }, { a: 8, b: 15, v: r1(lo) }],
      marks: [{ x: 8, t: 'Earliest increase' }],
      read: function (h) {
        return h < 8 ? 'start dose, ' + mg(start) + ' a day. Stay here for at least 7 days (days 1 to 7).'
          : 'target, ' + (hi !== lo ? mg(lo) + ' to ' + mg(hi) : 'about ' + mg(lo)) + ' a day. The earliest you may go up is after 7 days; the SmPC gives no middle step or speed.';
      }
    };
    if (ceil) { chart.effect = [[1, ceil / ymax * 100], [15, ceil / ymax * 100]]; chart.effectLabel = ceilTxt; }

    return { tone: tone, badge: ST.stmt, head: head + ' <small>(' + who + ')</small>', rows: rows, notes: notes, src: SRC.atx + ' Capsule rows are worked out from those doses and the strengths on emc.', chart: chart };
  }

  /* --- atomoxetine: switch, add on, stop --------------------------------------------------- */
  var SW = [
    { v: 'atx1', l: 'Atomoxetine capsules, once daily' },
    { v: 'atx2', l: 'Atomoxetine capsules, twice daily' },
    { v: 'sol', l: 'Atomoxetine oral solution' },
    { v: 'stim', l: 'A stimulant (methylphenidate or an amfetamine)' },
    { v: 'gua', l: 'Guanfacine prolonged-release' }
  ];
  function isAtx(k) { return k === 'atx1' || k === 'atx2' || k === 'sol'; }

  function dayChart(total) {
    var half = total / 2;
    return { kind: 'day', x: AX, bedtime: 22,
      series: [
        { label: 'Once daily: ' + mg(total), color: '#0b6664', tint: '#e3f4f3', doses: [{ model: 'atx_em', at: 7.5, mg: EM_REL * total }] },
        { label: 'Two doses: ' + mg(half) + ' + ' + mg(half), color: '#2f6fb3', dashed: true, doses: [{ model: 'atx_em', at: 7.5, mg: EM_REL * half }, { model: 'atx_em', at: 16.5, mg: EM_REL * half }] }
      ] };
  }

  function atxSwitch(v) {
    var a = v.from, b = v.to, total = +v.total || 80, mdt = 'Do not start an MAOI within 2 weeks of stopping atomoxetine, and do not start atomoxetine within 2 weeks of stopping an MAOI (SmPC contraindication).';
    if (a === b) return { tone: 'info', head: 'Choose two different options.', rows: [], notes: [] };

    /* atomoxetine once daily -> twice daily */
    if (a === 'atx1' && b === 'atx2') {
      var half = total / 2, cap = nearest(half);
      return { tone: 'ok', badge: ST.stmt, head: 'Allowed. Keep the same total daily dose and divide it evenly.',
        rows: [
          { h: 'What the SmPC says', t: 'If a single daily dose does not give a satisfactory response (for tolerability, for example nausea or somnolence, or for efficacy), the person “might benefit from taking it as twice daily evenly divided doses in the morning and late afternoon or early evening”.' },
          { h: 'The numbers (' + ST.calc.toLowerCase() + ')', t: 'The SmPC gives no conversion factor. The total stays ' + mg(total) + ' and is halved: <b>' + mg(half) + ' in the morning + ' + mg(half) + ' in the late afternoon or early evening</b>. The total daily maximum is still 100 mg.' },
          { h: 'Real capsules at each time', t: cap.exact ? mg(half) + ' is ' + capText(cap.below) + '.' : mg(half) + ' is not a capsule or a pair of capsules. The nearest are ' + mg(cap.below) + ' (' + capText(cap.below) + ') and ' + mg(cap.above) + ' (' + capText(cap.above) + '). The prescriber decides.' }
        ],
        notes: ['The SmPC gives no clock time for the second dose.', 'The graph shows the level in the blood after each plan, in someone with normal CYP2D6. The total is the same; the peaks are lower when split.'],
        src: SRC.atx, chart: dayChart(total) };
    }
    /* twice daily -> once daily */
    if (a === 'atx2' && b === 'atx1') {
      return { tone: 'warn', badge: ST.none, head: 'The SmPC does not describe going back to one daily dose.',
        rows: [
          { h: 'What it does say', t: 'Atomoxetine “can be administered as a single daily dose in the morning”, and twice-daily dosing is an option for people who do not get a satisfactory response on one dose.' },
          { h: 'What it leaves out', t: 'How to go back, and whether to keep the total the same. Going back at the same total daily dose is the obvious reading, but it is not written down.' },
          { h: 'What to do', t: 'Check the reason you split in the first place (nausea, sleepiness or response) and ask the specialist who started it.' }
        ], notes: [], src: SRC.atx };
    }
    /* capsules <-> oral solution */
    if ((isAtx(a) && b === 'sol') || (a === 'sol' && isAtx(b))) {
      return { tone: 'warn', badge: ST.stmt, head: 'The SmPC says capsules and oral solution are bioequivalent. It gives no conversion rule, and no oral solution is on emc today.',
        rows: [
          { h: 'What is stated', t: 'The Aurobindo/Milpharm SmPC (revised 4 August 2026): “Pharmacokinetic studies have shown that atomoxetine capsules and oral solution are bioequivalent.”' },
          { h: 'What is not stated', t: 'Any instruction to convert, a mg-per-ml table, or a product to convert to.' },
          { h: 'What you can verify now', t: 'On 1 November 2026 an emc search for “atomoxetine oral solution” or “Strattera” finds nothing. All 77 atomoxetine results are capsules. Check dm+d or a specials supplier for a liquid before you plan a switch.' }
        ], notes: ['Capsules are not meant to be opened: the contents irritate the eye.'], src: SRC.atx };
    }
    /* stimulant -> atomoxetine */
    if (a === 'stim' && isAtx(b)) {
      return { tone: 'warn', badge: ST.none, head: 'No published method for the switch itself. The sources say when to offer atomoxetine, not how to move across.',
        rows: [
          { h: 'When (' + ST.guide.toLowerCase() + ')', t: 'NICE: offer atomoxetine if the stimulants are not tolerated, or if separate 6-week trials of lisdexamfetamine and methylphenidate have not worked (children from age 5 and young people; adults).' },
          { h: 'How (no source)', t: 'The atomoxetine SmPC, NG87, SPS and the shared-care protocols we read give no washout, overlap or cross-taper. Do not make one up.' },
          { h: 'What the sources do give', t: 'Start atomoxetine on its own titration: about 0.5 mg/kg a day up to 70 kg, otherwise 40 mg, for at least 7 days. Check blood pressure and pulse after each dose change. The SmPC says to use it cautiously with medicines that may raise blood pressure (stimulants can). Ask the specialist how to handle the stimulant.' }
        ], notes: [mdt], src: SRC.atx + ' ' + SRC.ng };
    }
    /* atomoxetine -> stimulant */
    if (isAtx(a) && b === 'stim') {
      return { tone: 'warn', badge: ST.none, head: 'No published method, and no NICE step that sends you back to a stimulant.',
        rows: [
          { h: 'Guideline (no numbers)', t: 'NICE puts stimulants first and atomoxetine after them. If symptoms are unresponsive to one or more stimulants and one non-stimulant, get a second opinion or refer to a tertiary service.' },
          { h: 'How (no source)', t: 'The SmPCs, NG87, SPS and the shared-care protocols we read give no washout, overlap or cross-taper for this move.' },
          { h: 'What to do', t: 'Ask the specialist. Stopping atomoxetine has its own rule (see the Stop option).' }
        ], notes: [], src: SRC.ng };
    }
    /* atomoxetine <-> guanfacine */
    if ((isAtx(a) && b === 'gua') || (a === 'gua' && isAtx(b))) {
      var toG = b === 'gua';
      return { tone: 'warn', badge: ST.none, head: 'No published method for moving between the two non-stimulants.',
        rows: [
          { h: 'Guideline (no numbers)', t: 'NICE treats atomoxetine and guanfacine as parallel options after stimulants for children from age 5 and young people. For adults it offers atomoxetine; guanfacine needs tertiary advice. Symptoms unresponsive to one or more stimulants and one non-stimulant: second opinion or tertiary referral.' },
          { h: 'Licence', t: 'Guanfacine is licensed for ages 6 to 17 only. Atomoxetine is licensed for children from 6, teenagers and adults.' },
          { h: 'How (no source)', t: 'No washout, overlap or cross-taper is published. ' + (toG ? 'Guanfacine has its own titration from 1 mg.' : 'Stopping guanfacine has its own taper: no more than 1 mg every 3 to 7 days, with blood pressure and pulse checks.') + ' Ask the specialist how to combine them.' }
        ], notes: [], src: SRC.ng + ' ' + SRC.gua };
    }
    /* stimulant <-> guanfacine (answered in full in the guanfacine lab) */
    if ((a === 'stim' && b === 'gua') || (a === 'gua' && b === 'stim')) {
      return { tone: 'warn', badge: ST.none, head: 'No published method for this move. The guanfacine lab (next lesson) has the detail.',
        rows: [
          { h: 'Guideline (no numbers)', t: a === 'stim' ? 'NICE offers guanfacine to children from age 5 and young people on the same terms as atomoxetine, and suggests considering it for stimulant-related tics. It is not for adults without tertiary advice.'
            : 'NICE: if a person on guanfacine has sustained orthostatic hypotension or fainting, reduce the dose or switch to another ADHD medicine.' },
          { h: 'How (no source)', t: 'No washout, overlap or cross-taper. The guanfacine SmPC only has an add-on trial, which is a different design.' }
        ], notes: [], src: SRC.ng };
    }
    return { tone: 'info', head: 'Choose two different options.', rows: [], notes: [] };
  }

  function atxAddOn(v) {
    var k = v.add;
    if (k === 'gs') return { tone: 'ok', badge: ST.stmt, head: 'Guanfacine has been studied as an add-on to long-acting stimulants. The SmPC reports the evidence; it is not a dosing instruction.',
      rows: [
        { h: 'The trial', t: 'A 9-week study of guanfacine 1 to 4 mg a day in children and teenagers 6 to 17 with a suboptimal partial response to a long-acting stimulant (amfetamine, lisdexamfetamine, methylphenidate or dexmethylphenidate). The add-on group improved 4.9 points more on the ADHD-RS-IV than add-on placebo (95% CI 2.6 to 7.2).' },
        { h: 'Interactions', t: 'No pharmacokinetic interaction with OROS methylphenidate. With lisdexamfetamine, guanfacine peak rose 19% and AUC 7%: “not expected to be clinically meaningful”.' },
        { h: 'Guideline', t: 'NG87 has no add-on recommendation.' }
      ], notes: ['Children and teenagers only; guanfacine is not licensed for adults.'], src: SRC.gua };
    if (k === 'as') return { tone: 'warn', badge: ST.none, head: 'No source covers atomoxetine added to a stimulant.',
      rows: [
        { h: 'What exists', t: 'No SmPC, NG87 or SPS statement on this combination. The only text is the general caution in the atomoxetine SmPC: use it cautiously with pressor agents or medicines that may increase blood pressure, and with drugs that affect noradrenaline.' },
        { h: 'What to do', t: 'Ask the specialist. If it is done, check blood pressure and pulse before and after each dose change.' }
      ], notes: [], src: SRC.atx };
    return { tone: 'warn', badge: ST.none, head: 'No source covers atomoxetine and guanfacine together.',
      rows: [
        { h: 'What exists', t: 'NG87 treats them as parallel options. No SmPC, NG87 or SPS statement describes using both. Atomoxetine can raise blood pressure and pulse (MHRA, 2012) and guanfacine lowers them (SmPC), so monitoring both is the sensible safeguard (inference, not a stated rule). Any plan needs the specialist.' }
      ], notes: [], src: SRC.ng };
  }

  function atxStop() {
    return { tone: 'ok', badge: ST.stmt, head: 'No withdrawal syndrome is described. Tapering is optional unless side effects are serious.',
      rows: [
        { h: 'Serious side effects', t: 'Atomoxetine “may be stopped abruptly” in cases of significant adverse effects.' },
        { h: 'Otherwise', t: 'It may be tapered off “over a suitable time period”. The SmPC gives no schedule. “In the study programme no distinct withdrawal symptoms have been described.”' },
        { h: 'Liver injury', t: 'If there is jaundice or laboratory evidence of liver injury, stop atomoxetine and do not restart it.' },
        { h: 'How long to carry on', t: 'Treatment need not be indefinite. Re-evaluate the need for continued therapy beyond 1 year, especially when the response is stable and satisfactory.' },
        { h: 'MAOIs', t: 'Do not start an MAOI within 2 weeks of stopping atomoxetine, and do not start atomoxetine within 2 weeks of stopping an MAOI.' }
      ], notes: [], src: SRC.atx };
  }

  var ATX_DOSE = {
    kind: 'tool', label: 'Dose',
    intro: 'It opens on a worked example: <b>Ava, 9, 30 kg</b>. Change the group, the weight or anything that changes the dose.',
    fields: [
      { id: 'grp', type: 'seg', label: 'Who', value: 'child', options: [{ v: 'child', l: 'Child or teenager (6 to 17)' }, { v: 'adult', l: 'Adult' }] },
      { id: 'w', type: 'select', label: 'Weight', value: '30', options: kgOptions(15, 120, 1), show: function (v) { return v.grp !== 'adult'; } },
      { id: 'mod', type: 'select', label: 'Anything that changes the dose?', value: 'none', options: [
        { v: 'none', l: 'None of these' }, { v: 'cpb', l: 'Liver: Child-Pugh B (moderate)' }, { v: 'cpc', l: 'Liver: Child-Pugh C (severe)' },
        { v: 'pm', l: 'Known CYP2D6 poor metaboliser' }, { v: 'inh', l: 'On fluoxetine, paroxetine or similar' }] },
      { id: 'sched', type: 'seg', label: 'Given as', value: '1', options: [{ v: '1', l: 'Once daily' }, { v: '2', l: 'Two doses' }] }
    ],
    compute: atxDose
  };

  var ATX_SWITCH = {
    kind: 'tool', label: 'Switch and stop',
    intro: 'Pick what you are doing. Each answer shows how solid the source is.',
    swap: ['from', 'to'],
    fields: [
      { id: 'task', type: 'seg', label: 'What are you doing?', value: 'sw', options: [{ v: 'sw', l: 'Switch' }, { v: 'add', l: 'Add on' }, { v: 'stop', l: 'Stop' }] },
      { id: 'from', type: 'select', label: 'From', value: 'atx1', options: SW, show: function (v) { return v.task === 'sw'; } },
      { id: 'to', type: 'select', label: 'To', value: 'atx2', options: SW, show: function (v) { return v.task === 'sw'; } },
      { id: 'total', type: 'select', label: 'Total daily dose now', value: '80', options: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(function (n) { return { v: String(n), l: n + ' mg a day' }; }),
        show: function (v) { return v.task === 'sw' && v.from === 'atx1' && v.to === 'atx2'; } },
      { id: 'add', type: 'select', label: 'Add which?', value: 'gs', options: [
        { v: 'gs', l: 'Guanfacine to a stimulant' }, { v: 'as', l: 'Atomoxetine to a stimulant' }, { v: 'ag', l: 'Atomoxetine and guanfacine together' }],
        show: function (v) { return v.task === 'add'; } }
    ],
    compute: function (v) {
      if (v.task === 'stop') return atxStop();
      if (v.task === 'add') return atxAddOn(v);
      return atxSwitch(v);
    }
  };

  window.M5LAB.add('atx', {
    title: 'Atomoxetine lab',
    note: NOTE_LEVEL,
    tabs: [ATX_DAY, ATX_DOSE, ATX_SWITCH]
  });

  /* ================================================================================================
     GUANFACINE (INTUNIV AND GENERICS)
     ================================================================================================ */
  var GX = { from: 0, to: 72, tick: 12, fmt: 'day' };

  var GUA_DAY = {
    kind: 'day', label: 'Through the day',
    x: GX, doseAt: 8, doseTimes: [7, 8, 9, 19, 20, 21],
    picks: [
      { id: 'daily', chip: 'Daily tablet', tag: 'Three days', color: '#0b6664', tint: '#e3f4f3', name: 'Guanfacine prolonged-release, once daily',
        regimen: [{ model: 'gua_pr', at: 0 }, { model: 'gua_pr', at: 24 }, { model: 'gua_pr', at: 48 }],
        inside: 'A prolonged-release tablet, swallowed whole. Pick a morning or an evening time under “First dose at”: the SmPC says either.',
        moments: [
          { t: 'The tablet: with or without food, not a high-fat meal', h: 0, d: 'In adults a high-fat meal raised the peak (Cmax) by about 75% and total exposure (AUC) by about 40%. The SmPC gives the size of the rise, not its timing, so no curve is drawn. Do not give the tablet with a high-fat meal or with grapefruit juice.' },
          { t: 'Peak about 5 hours after the tablet', h: 5, d: 'The SmPC gives the peak plasma level at about 5 hours after a dose in children and adolescents (6 to 17).' },
          { t: 'Half-life about 18 hours', h: 23, d: 'The mean half-life is about 18 hours: once the level is falling it halves about every 18 hours. A day later, when the next tablet is due, a large share of the first dose is still there.' },
          { t: 'Days 2 and 3: tablets add up', h: 30, d: 'This curve simply adds each day’s tablet to what is left. It is arithmetic from the half-life, not a finding: the SmPC does not state accumulation or a time to steady state.' }
        ],
        practice: ['Morning or evening: in a trial in 6- to 12-year-olds both beat placebo.'],
        note: 'Plasma level only, counted from the first tablet. The curve for days 2 and 3 is a schematic of repeated once-daily dosing implied by the half-life; blood pressure and pulse effects are not drawn.' },
      { id: 'miss', chip: 'Missed doses', tag: 'One tablet only', color: '#a8432e', tint: '#fbe9e5', name: 'One tablet, then no more',
        regimen: [{ model: 'gua_pr', at: 0 }],
        inside: 'One tablet on day 1, then nothing. It shows what the level does when doses stop or are missed.',
        moments: [
          { t: 'Peak about 5 hours', h: 5, d: 'Same peak as before: about 5 hours after the tablet.' },
          { t: 'Day 2: one dose missed', h: 24, d: 'If one dose is missed, the SmPC says the prescribed dose can resume the next day.' },
          { t: 'Day 3: two doses missed in a row', h: 48, d: 'If two or more consecutive doses are missed, the SmPC recommends re-titration, based on how the patient tolerates guanfacine. It explains that the risks of low blood pressure, slow pulse, fainting and sedation are dose- and exposure-related.' }
        ],
        note: 'Plasma level after the last tablet. The SmPC does not tie the re-titration rule to a particular blood level. Stopping on purpose is different: that needs a taper.' }
    ]
  };

  var GUA_BANDS = [
    { age: '6', min: 25, max: 4, label: 'age 6 to 12, 25 kg and over' },
    { age: '13', min: 58.5, max: 7, label: 'age 13 to 17, 58.5 kg and over' },
    { age: '13', min: 49.5, max: 6, label: 'age 13 to 17, 49.5 to 58.4 kg' },
    { age: '13', min: 41.5, max: 5, label: 'age 13 to 17, 41.5 to 49.4 kg' },
    { age: '13', min: 34, max: 4, label: 'age 13 to 17, 34 to 41.4 kg' }
  ];
  function guaBand(age, w) {
    for (var i = 0; i < GUA_BANDS.length; i++) if (GUA_BANDS[i].age === age && w >= GUA_BANDS[i].min - 1e-9) return GUA_BANDS[i];
    return null;
  }
  function guaDose(v) {
    var age = v.age, w = +v.w || 30, band = guaBand(age, w), lo = 0.05 * w, hi = 0.12 * w;
    var below = age === '6' ? 'under 25 kg (age 6 to 12)' : 'under 34 kg (age 13 to 17)';
    if (!band) {
      return { tone: 'stop', badge: ST.none, head: 'The SmPC has no dose table for ' + w + ' kg (' + below + ').',
        rows: [
          { h: 'What the SmPC does say', t: 'Start 1 mg once daily, steps of no more than 1 mg a week, and a maintenance range of 0.05 to 0.12 mg/kg a day. For ' + w + ' kg that range works out at ' + r1(lo) + ' to ' + r1(hi) + ' mg.' },
          { h: 'What it leaves out', t: 'A weight table and a maximum for this weight. The adolescent table says subjects “must weigh at least 34 kg”, and the 6 to 12 table starts at 25 kg. Do not treat the range above as a dose recommendation.' },
          { h: 'What to do', t: 'Take specialist advice.' }
        ], notes: ['There is no table below 25 kg (age 6 to 12) or 34 kg (age 13 to 17).'], src: SRC.gua };
    }
    var m = band.max, useMax = v.mod === 'inh' ? m / 2 : m, rows = [], notes = [], tone = v.mod === 'inh' ? 'warn' : 'info', steps = [], k, head, effect = null, effLabel = '';
    var whole = [], q;
    for (q = Math.ceil(lo - 1e-9); q <= Math.floor(hi + 1e-9); q++) whole.push(q);
    /* weekly steps of 1 mg up to the ceiling; one bar per distinct dose */
    for (k = 1; k <= m; k++) { var val = Math.min(k, useMax); if (k > 1 && val === Math.min(k - 1, useMax)) break; steps.push({ a: k, b: k + 1, v: val }); }
    var xTo = Math.max(steps.length, 4) + 1;
    steps[steps.length - 1].b = xTo;

    head = v.mod === 'inh'
      ? 'With a CYP3A4/5 inhibitor the SmPC recommends a 50% dose reduction. Half of ' + m + ' mg is ' + r1(useMax) + ' mg (worked out).'
      : 'Start 1 mg once daily. The table maximum is ' + m + ' mg a day.';
    rows.push({ h: 'Start and steps', t: '1 mg once daily, for everyone. Go up by no more than 1 mg a week. Dose changes, up or down, can be made at any weekly interval, by response and tolerability.' });
    rows.push({ h: 'Maximum for this group (' + ST.table.toLowerCase() + ')', t: '<b>' + m + ' mg a day</b> (' + band.label + '). You reach it in week ' + m + ' if you go up every week.' +
      (m === 7 ? ' 7 mg only after at least 1 week on 6 mg and a “thorough review” of tolerability and efficacy.' : '') });
    rows.push({ h: 'Maintenance range by weight (SmPC)', t: '0.05 to 0.12 mg/kg a day = <b>' + r1(lo) + ' to ' + r1(hi) + ' mg</b> for ' + w + ' kg.' +
      (m > hi + 1e-9 ? ' The table maximum (' + m + ' mg = ' + r2(m / w) + ' mg/kg) sits a little above the top of that range.' : '') });
    rows.push({ h: 'Whole tablets in that range (' + ST.calc.toLowerCase() + ')', t: (whole.length ? whole.join(' mg, ') + ' mg. ' : 'No whole-mg tablet fits. ') + 'This is rounding. The SmPC gives no “2 to 3 mg” range or any other whole-tablet range.' });

    if (v.mod === 'inh') {
      rows.push({ h: 'CYP3A4/5 inhibitor (SmPC statement)', t: 'With a moderate or strong inhibitor “a 50% reduction of the guanfacine dose is recommended”, and “further dose titration may be needed” because the effect varies. Ketoconazole raised the guanfacine peak 2-fold and the exposure 3-fold. The SmPC does not say whether this means half the table maximum. Read that way, the ceiling would be ' + r1(useMax) + ' mg (worked out; tablets come in whole mg, so the prescriber rounds and titrates by response).' });
      notes.push('Examples in the SmPC: strong, clarithromycin and ketoconazole; moderate, ciprofloxacin, erythromycin, fluconazole, diltiazem, verapamil and grapefruit juice. Do not give guanfacine with grapefruit juice at all.');
    } else if (v.mod === 'ind') {
      rows.push({ h: 'Strong CYP3A4 inducer (SmPC statement)', t: 'A re-titration to increase the dose up to a maximum of 7 mg a day “may be considered if needed”. Rifampicin lowered the guanfacine peak by 54% and the exposure by 70%. The SmPC gives 7 mg as the maximum here and does not repeat the weight limits, so for a small child take specialist advice (clinical practice).' });
      effect = 7; effLabel = 'Up to 7 mg a day may be considered with a strong inducer';
      notes.push('Inducers in the SmPC list: carbamazepine, oxcarbazepine, phenytoin, phenobarbital, primidone, rifampicin, rifabutin, efavirenz, nevirapine, etravirine, modafinil, bosentan and St John’s wort. The SmPC does not mark which are strong.');
    } else if (v.mod === 'indstop') {
      tone = 'warn';
      rows.push({ h: 'A strong inducer has stopped (SmPC statement)', t: '“Retitration to reduce the guanfacine dose is recommended during the following weeks.” The SmPC gives no schedule or target.' });
    }
    notes.push('Weekly checks while you titrate: sleepiness and sedation, blood pressure and pulse. Then at least every 3 months in year 1 and every 6 months after that.');
    notes.push('Tablets: Intuniv 1, 2, 3 and 4 mg. Generic guanfacine prolonged-release (Neuraxpharm) comes as 1 to 7 mg (emc, 1 November 2026).');

    var ymax = Math.max(8, Math.ceil(Math.max(useMax, hi, effect || 0) + 1));
    var chart = { kind: 'weeks', x: { from: 1, to: xTo, unit: 'week', title: 'Weeks from the first dose (going up every week)' }, y: { max: ymax, label: 'mg a day' },
      color: '#0b6664', tint: '#a3d5cf', steps: steps,
      read: function (h, st) { return mg(st.v) + ' a day.' + (m === 7 && st.v === 7 ? ' 7 mg needs a review after a week on 6 mg.' : ''); } };
    var line = effect != null ? effect : hi;
    chart.effect = [[1, line / ymax * 100], [xTo, line / ymax * 100]];
    chart.effectLabel = effect != null ? effLabel : 'Top of 0.05 to 0.12 mg/kg (' + r1(hi) + ' mg for ' + w + ' kg)';
    return { tone: tone, badge: ST.table, head: head, rows: rows, notes: notes, src: SRC.gua + ' Whole-tablet and halved figures are worked out.', chart: chart };
  }

  /* --- guanfacine: stop, miss, switch -------------------------------------------------------- */
  function guaTaper(v) {
    var dose = +v.dose || 4, gap = +v.gap || 3, bars = [], k, cur = dose;
    /* first reduction on day 0, then one more 1 mg step every `gap` days; the last 1 mg step is the stop */
    for (k = 0; cur > 1; k++) { cur -= 1; bars.push({ a: k * gap, b: (k + 1) * gap, v: cur }); }
    var off = bars.length * gap;                       /* days from the first reduction to the first day with no tablet */
    var seq = [dose].concat(bars.map(function (s) { return s.v; }));
    var rows = [
      { h: 'The rule (SmPC)', t: '“The dose must be tapered with decrements of no more than 1 mg every 3 to 7 days, and blood pressure and pulse should be monitored.” Patients and carers should not stop without talking to the prescriber.' },
      { h: 'Why', t: 'Blood pressure and pulse may rise after stopping. Hypertensive encephalopathy has been very rarely reported after abrupt stopping. In the withdrawal study, 7 of 158 children (4.4%) switched to placebo had a blood pressure rise of more than 5 mmHg to above the 95th percentile.' },
      { h: 'Example from ' + mg(dose) + ' (' + ST.calc.toLowerCase() + ')', t: dose === 1 ? '1 mg is already a single step of 1 mg: stop, with blood pressure and pulse checks.'
        : seq.join(' mg → ') + ' mg → stop, with one step every ' + gap + ' days. You are off guanfacine ' + off + ' days after the first reduction.' }
    ];
    var res = { tone: 'warn', badge: ST.stmt, head: 'Never stop suddenly. Taper by no more than 1 mg every 3 to 7 days.', rows: rows,
      notes: ['The example is worked out from the rule; it is not an official schedule. The SmPC does not say how long to wait before the first reduction.'], src: SRC.gua };
    if (bars.length) {
      res.chart = { kind: 'weeks', x: { from: 0, to: off + gap, unit: 'day', title: 'Days after the first step down from ' + dose + ' mg (example only)' }, y: { max: Math.max(4, dose), label: 'mg a day' },
        color: '#a8432e', tint: '#f3cfc6', steps: bars,
        read: function (h) {
          var st = bars.filter(function (s) { return h >= s.a && h < s.b; })[0];
          return (st ? st.v + ' mg a day' + (h < gap ? ' (the first step down from ' + dose + ' mg)' : '') + '.' : 'Stopped.') + ' Check blood pressure and pulse during the taper.';
        } };
    }
    return res;
  }

  function guaMiss(v) {
    if (v.miss === '1') return { tone: 'ok', badge: ST.stmt, head: 'One missed dose: carry on the next day at the usual dose.',
      rows: [{ h: 'What the SmPC says', t: '“If a dose is missed, the prescribed dose can resume the next day.”' }],
      notes: ['Do not double up the next day (clinical practice; the SmPC just says resume).'], src: SRC.gua };
    return { tone: 'warn', badge: ST.stmt, head: 'Two or more missed doses in a row: re-titration is recommended.',
      rows: [
        { h: 'What the SmPC says', t: '“If two or more consecutive doses are missed, re-titration is recommended based on the patient’s tolerability to guanfacine.”' },
        { h: 'Why it matters', t: 'Clinical improvement and the risks of syncope, hypotension, bradycardia, somnolence and sedation are dose- and exposure-related, so the dose is built up carefully at the start.' },
        { h: 'What it does not say', t: 'It does not say to restart at 1 mg and gives no schedule. The usual titration rules apply to any re-titration: steps of no more than 1 mg a week, with weekly checks of sedation, blood pressure and pulse.' }
      ], notes: [], src: SRC.gua };
  }

  var GUA_SIT = [
    { v: 'taper', l: 'Stopping guanfacine (taper)' },
    { v: 'miss', l: 'A dose was missed' },
    { v: 'ir', l: 'Immediate-release guanfacine to prolonged-release' },
    { v: 'brand', l: 'Intuniv to a generic, or back' },
    { v: 'to', l: 'Another ADHD medicine to guanfacine' },
    { v: 'from', l: 'Guanfacine to another ADHD medicine' },
    { v: 'add', l: 'Adding guanfacine to a stimulant' },
    { v: 'adult', l: 'An adult on guanfacine' }
  ];

  function guaSit(v) {
    switch (v.sit) {
      case 'taper': return guaTaper(v);
      case 'miss': return guaMiss(v);
      case 'ir':
        return { tone: 'warn', badge: ST.none, head: 'No conversion exists. Do not swap immediate-release to prolonged-release mg for mg.',
          rows: [
            { h: 'What the SmPC says', t: '“Immediate-release guanfacine tablets should not be substituted on a mg/mg basis, because of differing pharmacokinetic profiles.”' },
            { h: 'What it does not give', t: 'A conversion factor. It names no immediate-release product or dose either, and we found no immediate-release guanfacine product for ADHD on emc.' },
            { h: 'What the SmPC does give', t: 'One starting dose for all patients: 1 mg once daily, up by no more than 1 mg a week, with weekly checks of sedation, blood pressure and pulse. How to stop the immediate-release tablets is not covered. Ask the specialist.' }
          ], notes: ['The MHRA-hosted Takeda letter of October 2023 repeats the no mg-for-mg rule.'], src: SRC.gua };
      case 'brand':
        return { tone: 'warn', badge: ST.none, head: 'No source says Intuniv and generic guanfacine are interchangeable.',
          rows: [
            { h: 'What matches', t: 'The generic (Neuraxpharm) SmPC dosing wording we compared (4 mg) reads the same as Intuniv’s.' },
            { h: 'What differs', t: 'Lactose per tablet: 1 mg, 22.41 mg in Intuniv and 41.32 mg in the generic; 4 mg, 50.42 mg and 23.41 mg. Generics also come as 5, 6 and 7 mg; Intuniv stops at 4 mg.' },
            { h: 'What to do', t: 'No rule is published. Check with the prescriber before you change the product.' }
          ], notes: [], src: SRC.gua + ' Neuraxpharm guanfacine SmPCs (revised 20 October 2026).' };
      case 'to':
        return { tone: 'warn', badge: ST.none, head: 'No published method for starting guanfacine in place of another ADHD medicine.',
          rows: [
            { h: 'When (' + ST.guide.toLowerCase() + ')', t: 'NICE offers guanfacine to children from age 5 and young people if they cannot tolerate methylphenidate or lisdexamfetamine, or separate 6-week trials of both failed. For stimulant-related tics it suggests considering guanfacine (children and young people only). The licence is ages 6 to 17, when stimulants are unsuitable, not tolerated or ineffective.' },
            { h: 'How (no source)', t: v.other === 'atx' ? 'No source covers atomoxetine to guanfacine. NICE lists them as parallel options.' : 'No source gives a washout, overlap or cross-taper. The only overlap study is the add-on trial, a different design.' },
            { h: 'What the SmPC does give', t: 'Start 1 mg once daily for everyone, with steps of no more than 1 mg a week and weekly checks. Ask the specialist.' }
          ], notes: [], src: SRC.ng + ' ' + SRC.gua };
      case 'from':
        return { tone: 'warn', badge: ST.none, head: 'The sources give a reason to switch and a rule for stopping, but no way to combine them.',
          rows: [
            { h: 'When (' + ST.guide.toLowerCase() + ')', t: 'NICE: if a person on guanfacine has sustained orthostatic hypotension or fainting, reduce the dose or switch to another ADHD medicine.' },
            { h: 'Stopping guanfacine (' + ST.stmt.toLowerCase() + ')', t: 'Taper by no more than 1 mg every 3 to 7 days with blood pressure and pulse checks.' },
            { h: 'How to combine them (no source)', t: 'No overlap or cross-taper is published. Blood pressure and pulse can rise after stopping guanfacine, and stimulants and atomoxetine can raise them too, so monitoring is the sensible safeguard (inference, not a stated rule). Ask the specialist.' }
          ], notes: [], src: SRC.ng + ' ' + SRC.gua };
      case 'add':
        return atxAddOn({ add: 'gs' });
      case 'adult':
        return { tone: 'stop', badge: ST.stmt, head: 'Guanfacine is not for adults under its licence. NICE allows it only on tertiary advice.',
          rows: [
            { h: 'Licence (' + ST.stmt.toLowerCase() + ')', t: '“The safety and efficacy of guanfacine in adult and the elderly with ADHD has not been established. Therefore, guanfacine should not be used in this group.”' },
            { h: 'NICE (' + ST.guide.toLowerCase() + ')', t: 'Do not offer guanfacine to adults (off-label use) without advice from a tertiary ADHD service. The adult non-stimulant is atomoxetine.' },
            { h: 'Local protocol (not national)', t: 'A Dorset shared-care protocol (February 2025) lets adults who showed clear benefit in childhood or adolescence continue at the same daily dose, off-label. Other areas may differ.' }
          ], notes: [], src: SRC.gua + ' ' + SRC.ng };
    }
    return { tone: 'info', head: '', rows: [], notes: [] };
  }

  var GUA_DOSE = {
    kind: 'tool', label: 'Dose',
    intro: 'It opens on a worked example: <b>Ava, 9, 30 kg</b>. Pick an age band, a weight, or a medicine that changes the dose.',
    fields: [
      { id: 'age', type: 'seg', label: 'Age', value: '6', options: [{ v: '6', l: '6 to 12 years' }, { v: '13', l: '13 to 17 years' }] },
      { id: 'w', type: 'select', label: 'Weight', value: '30', options: kgOptions(15, 90, 0.5) },
      { id: 'mod', type: 'select', label: 'Anything that changes the dose?', value: 'none', options: [
        { v: 'none', l: 'None of these' }, { v: 'inh', l: 'CYP3A4/5 inhibitor' }, { v: 'ind', l: 'Strong enzyme inducer' }, { v: 'indstop', l: 'An inducer has just stopped' }] }
    ],
    compute: guaDose
  };

  var GUA_STOP = {
    kind: 'tool', label: 'Stop, miss, switch',
    intro: 'Pick the situation. Each answer shows how solid the source is.',
    fields: [
      { id: 'sit', type: 'select', label: 'What is happening?', value: 'taper', options: GUA_SIT },
      { id: 'dose', type: 'select', label: 'Dose now', value: '4', options: [1, 2, 3, 4, 5, 6, 7].map(function (n) { return { v: String(n), l: n + ' mg a day' }; }), show: function (v) { return v.sit === 'taper'; } },
      { id: 'gap', type: 'seg', label: 'Days between steps', value: '3', options: [{ v: '3', l: '3 days' }, { v: '5', l: '5 days' }, { v: '7', l: '7 days' }], show: function (v) { return v.sit === 'taper'; } },
      { id: 'miss', type: 'seg', label: 'How many in a row?', value: '1', options: [{ v: '1', l: 'One' }, { v: '2', l: 'Two or more' }], show: function (v) { return v.sit === 'miss'; } },
      { id: 'other', type: 'seg', label: 'Which medicine?', value: 'stim', options: [{ v: 'stim', l: 'A stimulant' }, { v: 'atx', l: 'Atomoxetine' }], show: function (v) { return v.sit === 'to'; } }
    ],
    compute: guaSit
  };

  window.M5LAB.add('gua', {
    title: 'Guanfacine lab',
    note: NOTE_LEVEL,
    tabs: [GUA_DAY, GUA_DOSE, GUA_STOP]
  });
})();
