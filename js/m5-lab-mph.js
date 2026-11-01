/* Module 5 methylphenidate lab: "Convert" (any product to any other, both directions) and "Which switch is safe?".
   Registers one definition with M5LAB.add('mph', ...) (engine: js/m5-lab.js). Shown by <div data-ml="mph"></div> in lesson 4.
   Every number here comes from the research file for this lab (UK SmPCs on emc, NHS SPS page updated 28 Aug 2025, MHRA Drug
   Safety Update 26 Sep 2022, NICE NG87), re-read 1 Nov 2026. Every result carries one honest status badge:
     SmPC table . SmPC statement . SPS equivalence . Guideline (no numbers) . Worked out from the SmPC table (not official) .
     No official conversion . SmPC table (Focusim XL only; MR source not named)
     (a "Local NHS protocol (not national)" badge is not used: no local protocol was found.)
   The one modified-release to modified-release rule printed anywhere is the unnamed "MR" column of Focusim XL Table 1 (emc 100558,
   re-read 1 Nov 2026): it is shown on every result whose new product is the Ritalin XL-type capsule group, and nowhere else.
   Charts are schematic: both curves are drawn for the SAME total daily amount of drug (the IR-equivalent total), so you compare
   the shape of the day, not the strength. Heights are relative, never blood levels.
   Text is kept short on purpose: the result must fit about two phone screens. */
(function () {
  'use strict';
  if (!window.M5LAB) return;

  /* ---------- the products (one entry per select option) ---------- */
  /* fam: colour family (matches the release explorer). model: curve in js/release-model.js. maxC / maxA: licensed maximum a day
     (null = not licensed). lasts: hours the effect lasts (product information). mom: key moments, hours after the first dose. */
  var PR = {
    ir: {
      pick: 'IR tablets (Ritalin, Medikinet, generic)', name: 'IR tablets', fam: 'ir', model: 'ir', maxC: 60, maxA: 80, child: false,
      lasts: 4, lastsTxt: 'up to about 4 hours',
      mom: [{ h: 1.1, t: 'Peak', d: 'Peak 1–2 h after each dose.' }, { h: 4, end: true, t: 'Wears off', d: 'Each dose works up to about 4 h.' }],
      take: 'Divided doses; in general none within 4 hours of bedtime. More risk of misuse and diversion (SPS).',
      smpc: 'Ritalin tablets SmPC (emc 15987)'
    },
    tab: {
      pick: 'Concerta XL-type tablets (7 brands, one SPS group)', name: 'Concerta XL-type tablet', fam: 'h12', model: 'oros', maxC: 54, maxA: 72, child: false,
      lasts: 12, lastsTxt: 'about 12 hours',
      mom: [{ h: 1.5, t: 'First rise', d: 'Small first rise at 1–2 h (about a fifth released at once, SPS).' }, { h: 6.8, t: 'Peak', d: 'Peak at about 6–8 h.' }, { h: 12, end: true, t: 'Wears off', d: 'Works up to about 12 h (children’s studies).' }],
      take: 'Swallow whole, never chew or crush. With or without food.',
      brands: 'Concerta XL, Affenid XL, Atenza XL, Delmosart, Matoride XL, Xaggitin XL, Xenidate XL',
      smpc: 'Concerta XL SmPC (emc 314)'
    },
    cap: {
      pick: 'Ritalin XL-type capsules (4 brands, one SPS group)', name: 'Ritalin XL-type capsule', fam: 'b8', model: 'rxl', maxC: 60, maxA: 80, child: false,
      lasts: 8, lastsTxt: 'about 8 hours',
      mom: [{ h: 1.5, t: 'First peak', d: 'First peak at 1–2 h.' }, { h: 5.5, t: 'Second peak', d: 'Second peak 5–7 h after the dose.' }, { h: 8, end: true, t: 'Wears off', d: 'Works about 8 h (SPS).' }],
      take: 'Morning dose, with or without food. May be opened onto cool soft food.',
      brands: 'Ritalin XL, Meflynate XL, Metyrol XL, Focusim XL',
      smpc: 'Ritalin XL SmPC (emc 15966)'
    },
    mkxl: {
      pick: 'Medikinet XL capsules (50:50, with food)', name: 'Medikinet XL', fam: 'b8', model: 'mk', maxC: 60, maxA: 80, child: false,
      lasts: 8, lastsTxt: 'about 8 hours',
      mom: [{ h: 1.4, t: 'Strong start', d: 'Strong start (half released at once).' }, { h: 3.3, t: 'Second rise', d: 'Second rise about 3 h later, then a 3–4 h plateau.' }, { h: 8, end: true, t: 'Wears off', d: 'Designed to work about 8 h.' }],
      momAdult: [{ h: 1.4, t: 'Strong start', d: 'Morning dose: strong start, second rise about 3 h later.' }, { h: 6.4, t: 'Lunchtime dose', d: 'Lunchtime dose: a second round.' }, { h: 12.5, end: true, t: 'Wears off', d: 'Works to about 8 h after the lunchtime dose.' }],
      take: 'With or after food, never on an empty stomach. Not with a PPI, H2 blocker or antacid (contraindications).',
      smpc: 'Medikinet XL SmPC (emc 313)'
    },
    ambi: {
      pick: 'Ambinet XL capsules (50:50, with food)', name: 'Ambinet XL', fam: 'b8', model: 'mk', maxC: 60, maxA: 80, child: false, nolist: true,
      lasts: 8, lastsTxt: 'about 8 hours',
      mom: [{ h: 1.4, t: 'Strong start', d: 'Strong start (half released at once).' }, { h: 3.3, t: 'Second rise', d: 'Second rise about 3 h later, then a 3–4 h plateau.' }, { h: 8, end: true, t: 'Wears off', d: 'Designed to work about 8 h.' }],
      momAdult: [{ h: 1.4, t: 'Strong start', d: 'Morning dose: strong start, second rise about 3 h later.' }, { h: 6.4, t: 'Lunchtime dose', d: 'Lunchtime dose: a second round.' }, { h: 12.5, end: true, t: 'Wears off', d: 'Works to about 8 h after the lunchtime dose.' }],
      take: 'With or after food, never on an empty stomach. Not with a PPI, H2 blocker or antacid (contraindications).',
      smpc: 'Ambinet XL SmPC (emc 102268)'
    },
    eqxl: {
      pick: 'Equasym XL capsules (30:70)', name: 'Equasym XL', fam: 'b8', model: 'eq', maxC: 60, maxA: null, child: true,
      lasts: 8, lastsTxt: 'about 8 hours',
      mom: [{ h: 1.5, t: 'First peak', d: 'First peak at 1–2 h (30% released at once).' }, { h: 4.5, t: 'Second peak', d: 'Second peak at about 4.5 h.' }, { h: 8, end: true, t: 'Wears off', d: 'Designed to work about 8 h.' }],
      take: 'Morning, before breakfast. Levels may be lower after the school day.',
      smpc: 'Equasym XL SmPC (emc 3887)'
    },
    addepta: {
      pick: 'Addepta XL capsules (30:70)', name: 'Addepta XL', fam: 'b8', model: 'eq', maxC: 60, maxA: null, child: true, nolist: true,
      lasts: 8, lastsTxt: 'about 8 hours',
      mom: [{ h: 1.5, t: 'First peak', d: 'First peak at 1–2 h (30% released at once).' }, { h: 4.5, t: 'Second peak', d: 'Second peak at about 4.5 h.' }, { h: 8, end: true, t: 'Wears off', d: 'Designed to work about 8 h.' }],
      take: 'Morning, before breakfast. SPS (28 Aug 2025) said Addepta XL was licensed but not yet launched; check current supply with the wholesaler or dm+d before choosing it.',
      smpc: 'Addepta XL SmPC (emc 102481)'
    },
    tuz: {
      pick: 'Tuzulby chewable tablets (30:70)', name: 'Tuzulby', fam: 'b8', model: 'eq', maxC: 60, maxA: null, child: true, nolist: true, assumed: true,
      lasts: 8, lastsTxt: 'about 8 hours',
      mom: [{ h: 5, t: 'Highest level', d: 'Highest level at a median of about 5 h (one 40 mg dose, fasting).' }, { h: 8, end: true, t: 'Wears off', d: 'Designed to work about 8 h.' }],
      take: 'Chew it: never swallow whole or crush. Contains aspartame (phenylalanine).',
      smpc: 'Tuzulby SmPC (emc 101828)'
    },
    kixel: {
      pick: 'Kixel XL tablets (not on any SPS list)', name: 'Kixel XL', fam: 'h12', model: 'oros', maxC: 54, maxA: 72, child: false, nolist: true,
      lasts: 12, lastsTxt: 'about 12 hours',
      mom: [{ h: 1.5, t: 'First rise', d: 'First rise at 1–2 h (split not published).' }, { h: 6.8, t: 'Peak', d: 'Peak at about 6–8 h.' }, { h: 12, end: true, t: 'Wears off', d: 'Works up to about 12 h (children’s studies).' }],
      take: 'Swallow whole, never chew or crush. With or without food.',
      smpc: 'Kixel XL SmPC (emc 101341)'
    }
  };
  var ORDER = ['ir', 'tab', 'cap', 'mkxl', 'ambi', 'eqxl', 'addepta', 'tuz', 'kixel'];
  var FAM = { ir: ['#a8432e', '#e8bcb1'], b8: ['#2f6fb3', '#b9d1ec'], h12: ['#0b6664', '#a3d5cf'] };
  var SPS = 'SPS, modified-release methylphenidate (updated 28 Aug 2025)';
  var MHRA = 'MHRA Drug Safety Update, 26 Sep 2022';

  /* daily doses offered for each MR product (the strengths that exist, and what they make up, to the licensed maximum) */
  var DOSES = {
    tab: { child: [18, 27, 36, 45, 54], adult: [18, 27, 36, 45, 54, 72] },
    kixel: { child: [18, 27, 36, 54], adult: [18, 27, 36, 54, 72] },
    cap: { child: [10, 20, 30, 40, 60], adult: [10, 20, 30, 40, 60] },
    mkxl: { child: [5, 10, 20, 30, 40, 50, 60], adult: [5, 10, 20, 30, 40, 50, 60] },
    ambi: { child: [5, 10, 20, 30, 40, 50, 60], adult: [5, 10, 20, 30, 40, 50, 60] },
    eqxl: { child: [10, 20, 30, 40, 50, 60], adult: [10, 20, 30, 40, 50, 60] },
    addepta: { child: [10, 20, 30, 40, 50, 60], adult: [10, 20, 30, 40, 50, 60] },
    tuz: { child: [20, 30, 40, 60], adult: [20, 30, 40, 60] }
  };

  /* the SmPC tables */
  var TAB_T = { 5: 18, 10: 36, 15: 54, 20: 72 };            /* IR three times a day (mg each time) -> once daily */
  var CAP_T = { 5: 10, 10: 20, 15: 30, 20: 40, 30: 60 };    /* IR twice a day (mg each time) -> once daily */
  var TUZ_T = { 10: 20, 15: 30, 20: 40, 30: 60 };           /* IR twice a day (mg each time) -> once daily */
  var TAB_BACK = { 18: 5, 36: 10, 54: 15, 72: 20 };         /* reversed: once daily -> IR three times a day (mg each time) */
  var BADGE = {
    table: 'SmPC table', stmt: 'SmPC statement', sps: 'SPS equivalence', guide: 'Guideline (no numbers)',
    worked: 'Worked out from the SmPC table (not official)', none: 'No official conversion',
    focusim: 'SmPC table (Focusim XL only; MR source not named)'
  };
  var NEWRX = 'New Schedule 2 prescription, written by brand.';
  var START = 'A starting dose only. Titrate against symptoms and side effects and review at about one month (the SmPCs say to stop if there is no improvement after one month of proper dose adjustment).';
  var ILL = 10;      /* MR to MR charts compare shapes only: both lines are drawn at this one size, never at a real dose */
  var CLIN = '<b>Clinical practice, not a source:</b> treat it as a new start with specialist input. MHRA: frequent switching between products should be avoided.';

  /* ---------- small helpers ---------- */
  function fmt(n) { return String(Math.round(n * 10) / 10); }
  function times(n) { return n === 3 ? 'three times a day' : 'twice a day'; }
  function irWord(d, n) { return 'IR ' + d + ' mg ' + times(n); }
  function who(v) { return v.who === 'child' ? 'child' : 'adult'; }
  function maxOf(p, v) { return who(v) === 'child' ? p.maxC : p.maxA; }
  function dailyOptions(prod, v) { var d = DOSES[prod]; return d ? d[who(v)] : []; }
  function plain(h) { return h.replace(/<[^>]+>/g, ''); }

  /* the IR doses used in the chart. The product information gives no fixed timetable (its examples say breakfast and lunch), so these are example times. */
  function irDoses(d, n) { return n === 3 ? [{ model: 'ir', at: 7.5, mg: d }, { model: 'ir', at: 11.5, mg: d }, { model: 'ir', at: 15.5, mg: d }] : [{ model: 'ir', at: 7.5, mg: d }, { model: 'ir', at: 12, mg: d }]; }
  function twoDose(prod, v) { return (prod === 'mkxl' || prod === 'ambi') && who(v) === 'adult'; }
  function mrDoses(prod, total, v) {
    var P = PR[prod];
    return twoDose(prod, v) ? [{ model: P.model, at: 7.5, mg: total / 2 }, { model: P.model, at: 12, mg: total / 2 }] : [{ model: P.model, at: 7.5, mg: total }];
  }
  function dayChart(v, after, afterLabel, afterDoses, beforeLabel, beforeDoses, title) {
    var P = PR[after], c = FAM[P.fam], adult = who(v) === 'adult';
    var ms = (twoDose(after, v) ? P.momAdult : P.mom).map(function (m) { return { h: 7.5 + m.h, t: m.t, end: !!m.end, d: m.d }; });
    var sp = {
      kind: 'day', title: title, x: { from: 6, to: 23, tick: 3, fmt: 'clock' }, bedtime: 22,
      bands: adult ? [{ from: 9, to: 17, label: 'Work', tone: 'blue' }] : [{ from: 8.75, to: 15.25, label: 'School', tone: 'blue' }],
      series: [{ label: 'After: ' + afterLabel, color: c[0], tint: c[1], doses: afterDoses }, { label: 'Before: ' + beforeLabel, color: '#16324f', dashed: true, doses: beforeDoses }],
      moments: ms.map(function (m) { return { h: m.h, t: m.t, end: m.end }; })
    };
    if (afterDoses.length === 1 && P.lasts > 4) sp.lasts = { from: 7.5, to: 7.5 + P.lasts, label: 'Lasts ' + P.lastsTxt.replace('about ', '~').replace(' hours', ' h') };
    return { chart: sp, steps: ms };
  }
  /* "What changes in the day": a one-line caption, then the numbered key moments that match the numbers on the chart. */
  function dayRow(built, extra) {
    var nums = built.steps.map(function (m, i) { return '<b>' + (i + 1) + '</b> ' + m.d; }).join('<br>');
    return { h: 'What changes in the day', t: (extra ? extra + '<br>' : '') + nums };
  }
  /* licence notes for the new product. off = true when the person is outside the licence (the answer then turns amber). */
  function licNotes(v, to) {
    var out = [], T = PR[to], off = false;
    if (who(v) === 'adult' && T.child) {
      off = true;
      out.push('<b>Off-label in adults:</b> ' + T.name + ' is licensed for children' + (to === 'tuz' ? ' and young people (6 to 17)' : '') + ' only. It needs a clear reason and recorded consent.');
    }
    if (to === 'tab' && who(v) === 'adult') out.push('Matoride XL is licensed in children 6+ only: do not start an adult on it.');
    return { notes: out, off: off };
  }
  function checkMax(total, to, v) {
    var P = PR[to], m = maxOf(P, v), ws = who(v) === 'child' ? 'children' : 'adults';
    if (m == null) {      /* a children-only product used for an adult: there is no adult maximum, so the product maximum still applies */
      return (who(v) === 'adult' && P.maxC != null && total > P.maxC) ? total + ' mg a day is above the licensed maximum of ' + P.maxC + ' mg a day for this product (it is licensed in children only).' : '';
    }
    return total > m ? total + ' mg a day is above the licensed maximum of ' + m + ' mg a day for ' + ws + ' with this product.' : '';
  }
  /* the IR total typed in can itself be above the licensed IR maximum (Ritalin tablets: 60 mg a day in children, 80 mg in adults) */
  function irOverMax(tot, v) {
    var m = maxOf(PR.ir, v);
    return tot > m ? 'Your IR total of ' + tot + ' mg a day is above the licensed IR maximum of ' + m + ' mg a day for ' + (who(v) === 'child' ? 'a child' : 'an adult') + '. A higher dose would be off-label and for the specialist to direct.' : '';
  }
  /* every important note (licence, maximum) is kept; rule-specific notes fill the list up to two; then an optional tail; then the prescription note */
  function finish(tone, badge, head, rows, important, specific, src, chart, tail) {
    var imp = important.filter(Boolean), spec = specific.filter(Boolean);
    var notes = imp.concat(spec.slice(0, Math.max(0, 2 - imp.length))).concat(tail || []).concat(NEWRX);
    return { tone: tone, badge: badge, head: head, rows: rows, notes: notes, src: src, chart: chart };
  }
  /* the MR column of the Focusim XL table: the only printed MR to MR rule (it names no product) */
  function focusimRow(fromEqxl) {
    return { h: 'One SmPC prints a rule', t: 'Only the Focusim XL SmPC (Table 1, “MR” column) prints a modified-release rule: 10 mg modified-release methylphenidate → Focusim XL 10 mg a day (the same for 20, 30, 40 and 60 mg). It names no product. The Ritalin XL, Metyrol XL and Meflynate XL tables have no MR row, and SPS gives no dose rule. Treat it as a start with specialist input, and follow the new product’s dosing (MHRA).' + (fromEqxl ? ' It does not override the SPS advice not to switch Equasym XL.' : '') };
  }
  /* "bracket" for an MR dose that has no row in the Concerta XL-type table */
  function bracket(D) {
    var rows = [[5, 18], [10, 36], [15, 54], [20, 72]], i;
    for (i = 0; i < rows.length - 1; i++) {
      if (D > rows[i][1] && D < rows[i + 1][1]) return ' On the table it sits between ' + rows[i][1] + ' mg (' + rows[i][0] + ' mg three times a day, ' + rows[i][0] * 3 + ' mg a day of IR) and ' + rows[i + 1][1] + ' mg (' + rows[i + 1][0] + ' mg three times a day, ' + rows[i + 1][0] * 3 + ' mg a day).';
    }
    return '';
  }
  /* same SPS group: can every brand in the group supply this dose in the same quantity? (strengths on emc, read 1 Nov 2026) */
  function supplyNote(f, D) {
    if (f === 'tab' && D === 45) return 'Only Atenza XL makes a 45 mg tablet. Another brand would need two tablets (27 + 18 mg), so the quantity changes and the SPS rule “same dose and quantity” does not cover it. Stay on Atenza XL or ask the specialist.';
    if (f === 'tab' && D === 27) return 'Matoride XL has no 27 mg tablet. Check that the brand you plan to use makes it.';
    if (f === 'cap' && D === 60) return 'Only Metyrol XL and Meflynate XL make a 60 mg capsule. Ritalin XL and Focusim XL would need 40 + 20 mg, so the quantity changes. Stay on Metyrol XL or Meflynate XL, or ask the specialist.';
    return '';
  }
  function tableContext(total) {
    var rows = [[15, 18], [30, 36], [45, 54], [60, 72]], i;
    for (i = 0; i < rows.length; i++) if (total === rows[i][0]) return 'Your total of ' + total + ' mg a day matches the ' + rows[i][0] + ' mg a day row (' + rows[i][1] + ' mg), but that row is for three doses a day.';
    if (total < 15) return 'Your total of ' + total + ' mg a day is below the table, which starts at 15 mg a day.';
    if (total > 60) return 'Your total of ' + total + ' mg a day is above the table, which stops at 60 mg a day.';
    for (i = 0; i < rows.length - 1; i++) if (total > rows[i][0] && total < rows[i + 1][0]) return 'Your total of ' + total + ' mg a day sits between the ' + rows[i][0] + ' mg a day row (' + rows[i][1] + ' mg) and the ' + rows[i + 1][0] + ' mg a day row (' + rows[i + 1][1] + ' mg).';
    return '';
  }

  /* ---------- IR to MR ---------- */
  function irToMr(v) {
    var d = +v.ird, n = +v.irn === 3 ? 3 : 2, tot = d * n, t = v.to, T = PR[t], before = irWord(d, n), built, dose = null, status, tone = 'ok', head, src, rows = [], imp = [], spec = [];
    var adult = who(v) === 'adult';
    src = T.smpc + '; ' + SPS + '.';
    var w0 = irOverMax(tot, v); if (w0) imp.push(w0);

    if (t === 'tab' || t === 'kixel') {
      var tn = t === 'tab' ? 'Concerta XL' : 'Kixel XL';
      if (n === 3 && TAB_T[d]) {
        dose = TAB_T[d]; status = BADGE.table;
        head = before + ' → <b>' + T.name + ' ' + dose + ' mg once a day</b>';
        rows.push({ h: 'What the sources say', t: 'The ' + tn + ' SmPC table is for IR three times a day (15 to 60 mg a day): 5 → 18, 10 → 36, 15 → 54, 20 → 72 mg once daily, based on the current regimen and clinical judgement.' + (t === 'tab' ? ' Matoride XL prints only the first three rows.' : ' Kixel XL is not on any SPS list.') });
        if (t === 'tab' && dose === 72) spec.push('72 mg is not a Matoride XL row (children only, maximum 54 mg).');
      } else if (n === 3) {
        status = BADGE.stmt; tone = 'warn';
        head = before + ': <b>above the table</b> (it stops at 20 mg three times a day)';
        rows.push({ h: 'What the sources say', t: 'The ' + tn + ' table stops at 60 mg a day. Your total of ' + tot + ' mg a day is above it and above the licensed maximum of ' + maxOf(T, { who: 'adult' }) + ' mg. The dose is a clinical judgement.' });
      } else {
        status = BADGE.stmt; tone = 'warn';
        head = before + ': <b>no row in the table</b>, so the dose is a clinical judgement';
        rows.push({ h: 'What the sources say', t: 'The ' + tn + ' table is for IR three times a day. For other regimens the dose rests on the current regimen and clinical judgement. <em>Context only, not a row:</em> ' + tableContext(tot) });
      }
    } else if (t === 'cap') {
      if (n === 2 && CAP_T[d]) {
        dose = CAP_T[d]; status = BADGE.table;
        head = before + ' → <b>capsule ' + dose + ' mg once a day</b>';
        rows.push({ h: 'What the sources say', t: 'The Ritalin XL SmPC table keeps the same total once a day: 5 → 10, 10 → 20, 15 → 30, 20 → 40, 30 → 60 mg (IR twice a day). The capsule gives comparable overall exposure (AUC) to IR twice a day. Metyrol XL, Meflynate XL and Focusim XL print the same rows.' });
      } else if (n === 2) {
        dose = tot; status = BADGE.stmt;
        head = before + ' → <b>capsule ' + dose + ' mg once a day</b> (the SmPC rule, not a table row)';
        rows.push({ h: 'What the sources say', t: 'This total is not a table row. The Ritalin XL SmPC rule: the capsule dose equals the total daily dose of IR, up to 60 mg in children and 80 mg in adults.' });
      } else {
        status = BADGE.stmt; tone = 'warn';
        head = before + ': <b>no row for three times a day</b>, so the starting dose is a clinical judgement';
        rows.push({ h: 'What the sources say', t: 'The capsule table is for IR twice a day. For other regimens the SmPC says: “clinical judgment should be used when selecting the starting dose.” Your total is ' + tot + ' mg a day.' });
      }
      if (dose) { var w2 = checkMax(dose, t, v); if (w2) { tone = 'warn'; imp.push(w2); } }
      spec.push('If 8 hours do not cover the day, NICE says think about a modified-release dose in the morning plus IR later.');
      if (dose === 60) spec.unshift('60 mg is made with Metyrol XL or Meflynate XL: emc lists no 60 mg capsule for Ritalin XL or Focusim XL (10 to 40 mg).');
    } else if (t === 'mkxl' || t === 'ambi') {
      dose = tot; status = BADGE.stmt;
      head = before + ' → <b>' + T.name + ' ' + dose + ' mg a day</b>' + (adult ? ' in two doses, morning and lunchtime' : ', one dose in the morning');
      rows.push({ h: 'What the sources say', t: 'No table. The SmPC says to switch to “the milligram equivalent daily dose”. Worked example: 20 mg of ' + T.name + ' takes the place of 10 mg at breakfast plus 10 mg at lunchtime of IR.' + (t === 'ambi' ? ' Ambinet XL repeats the Medikinet XL wording but is not on any SPS list.' : '') });
      var w3 = checkMax(dose, t, v); if (w3) { tone = 'warn'; imp.push(w3); }
      if (adult) spec.push('Adults: maximum 80 mg a day and no more than 1 mg/kg.');
    } else if (t === 'eqxl' || t === 'addepta') {
      dose = tot; status = BADGE.stmt;
      head = before + ' → <b>' + T.name + ' ' + dose + ' mg once a day</b>, before breakfast';
      rows.push({ h: 'What the sources say', t: 'No table. The SmPC says to switch to “the milligram equivalent daily dose”. Worked example: 20 mg of ' + T.name + ' takes the place of 10 mg at breakfast plus 10 mg at lunchtime of IR. 10 mg once a day may replace IR 5 mg twice a day.' });
      var w4 = checkMax(dose, t, v); if (w4) { tone = 'warn'; imp.push(w4); }
      if ((t === 'eqxl' || t === 'addepta') && tot % 10 !== 0) spec.push(T.name + ' capsules are 10, 20 and 30 mg, so ' + tot + ' mg a day cannot be made up exactly.');
    } else if (t === 'tuz') {
      if (n === 2 && TUZ_T[d]) { dose = TUZ_T[d]; status = BADGE.table; }
      else { dose = Math.min(tot, 60); status = BADGE.stmt; }
      head = before + ' → <b>Tuzulby ' + dose + ' mg once a day</b>, chewed' + (status === BADGE.stmt ? ' (the SmPC rule, not a table row)' : '');
      rows.push({ h: 'What the sources say', t: 'The Tuzulby SmPC says one daily dose gives comparable overall exposure to the same total of IR given twice a day, and the dose equals the total daily IR dose, up to 60 mg. Its examples: 10 mg twice a day → 20 mg, 15 → 30, 20 → 40, 30 → 60 mg.' + (n === 3 ? ' It gives no row for three times a day.' : '') });
      if (n === 3) tone = 'warn';
      if (tot > 60) { tone = 'warn'; imp.push('Your total of ' + tot + ' mg a day is above the Tuzulby maximum of 60 mg a day.'); }
    }
    if (t === 'tab' || t === 'kixel') { var w1 = dose ? checkMax(dose, t, v) : ''; if (w1) { tone = 'warn'; imp.push(w1); } }

    built = dayChart(v, t, T.name + (dose ? ' ' + dose + ' mg' : ''), mrDoses(t, tot, v), before, irDoses(d, n), plain(head));
    var extra = (dose && dose !== tot ? 'Drawn at ' + tot + ' mg each (the dose is ' + dose + ' mg). ' : '') + 'IR at 07:30, ' + (n === 3 ? '11:30, 15:30' : '12:00') + ' (example times).' + (T.assumed ? ' The Tuzulby curve borrows the shape of other 30:70 products: its SmPC gives only a median highest level at about 5 h.' : '');
    rows.push(dayRow(built, extra));
    rows.push({ h: 'Watch for', t: T.take });
    var ln = licNotes(v, t); if ((ln.off || w0) && tone === 'ok') tone = 'warn';
    return finish(tone, status, head, rows, ln.notes.concat(imp), spec, src, built.chart, [START]);
  }

  /* ---------- IR to IR ---------- */
  function irToIr(v) {
    var d = +v.ird, n = +v.irn === 3 ? 3 : 2, before = irWord(d, n), w0 = irOverMax(d * n, v);
    return {
      tone: 'warn', badge: BADGE.none, head: 'IR brand to IR brand: <b>no source says they are interchangeable by dose</b>',
      rows: [
        { h: 'What the sources say', t: 'None of the IR SmPCs, SPS or NICE says IR brands can be swapped by dose. Licences differ: Ritalin tablets are for children and adults; Medikinet tablets and the Viatris generic are for children only.' },
        { h: 'In practice', t: '<b>Clinical practice, not a source statement:</b> keep the same dose and times (' + before + ') and check the response. Write adult IR as Ritalin tablets by brand.' }
      ],
      notes: [w0, 'Medikinet tablets: take doses at standard times in relation to meals. The last dose should in general not be within 4 hours of bedtime.', NEWRX].filter(Boolean),
      src: 'Ritalin tablets SmPC (emc 15987); Medikinet tablets SmPC (emc 328); Viatris generic tablets SmPC (emc 8724).', chart: null
    };
  }

  /* ---------- MR to IR ---------- */
  function irLicence(v, f) {
    if (who(v) === 'child') return 'For a child, IR tablets are licensed from age 6.';
    if (f === 'cap') return 'Adults: write Ritalin tablets by brand. Meflynate XL and Focusim XL SmPCs say only the modified-release form should be used in adults.';
    if (f === 'mkxl' || f === 'ambi') return 'Adults: write Ritalin tablets by brand. The ' + PR[f].name + ' SmPC says “In adults, only ' + PR[f].name + ' should be used.”';
    return 'Adults: Ritalin tablets are the IR tablet licensed in adults; write it by brand. NICE allows IR for flexible dosing or titration.';
  }
  function mrToIr(v) {
    var f = v.from, F = PR[f], D = +v.mr, tot = null, d = null, n = 2, status = BADGE.worked, tone = 'warn', head, rows = [], derive = '', spsline = '';
    if (f === 'tab' || f === 'kixel') {
      if (TAB_BACK[D]) { d = TAB_BACK[D]; n = 3; tot = d * 3; derive = 'Reversing the IR-to-MR table (5 mg three times a day → 18 mg, 10 → 36, 15 → 54, 20 → 72) gives ' + d + ' mg three times a day (' + tot + ' mg a day).'; }
      if (D === 18 && f === 'tab') { status = BADGE.sps; spsline = 'SPS: “Concerta XL 18mg once daily is equivalent to a total daily dose of 15mg IR methylphenidate.” The table row for this is 5 mg three times a day.'; }
    } else if (f === 'cap') {
      d = D / 2; n = 2; tot = D; derive = 'Reversing the capsule table (same total, split in two) gives ' + fmt(d) + ' mg twice a day (' + tot + ' mg a day). The SmPC says the capsule gives comparable overall exposure (AUC) to the same total of IR twice a day.';
      spsline = 'SPS has one line for this group: Metyrol XL 10 mg once a day is equivalent to a total daily dose of 10 mg IR. It gives none for Ritalin XL, Meflynate XL or Focusim XL.';
    } else if (f === 'tuz') {
      d = D / 2; n = 2; tot = D; derive = 'Reversing the Tuzulby examples (10 mg twice a day → 20 mg, 15 → 30, 20 → 40, 30 → 60) gives ' + fmt(d) + ' mg twice a day (' + tot + ' mg a day).';
    } else {
      /* Medikinet XL, Ambinet XL, Equasym XL, Addepta XL: the SmPC worked example, 20 mg = 10 mg + 10 mg of IR */
      tot = D; if (D === 5) { d = 5; n = 1; } else { d = D / 2; n = 2; }
      derive = 'The SmPC example (20 mg of ' + F.name + ' takes the place of 10 mg at breakfast plus 10 mg at lunchtime of IR) means 1 mg a day of MR is 1 mg a day of IR. Splitting it into two doses is an inference.';
      if (D === 10 && (f === 'mkxl' || f === 'eqxl')) { status = BADGE.sps; spsline = 'SPS: “' + F.name + ' 10mg once daily is equivalent to a total daily dose of 10mg IR methylphenidate.”'; }
    }
    if (tot == null) {
      head = F.name + ' ' + D + ' mg → IR: <b>no source gives a figure for this dose</b>';
      rows.push({ h: 'What the sources say', t: 'No table or SPS line covers ' + D + ' mg.' + bracket(D) + ' SPS: an individualised approach would be required.' });
      rows.push({ h: 'What to do', t: 'Seek advice, or refer back to the specialist who started treatment (SPS), then re-titrate IR against symptoms and side effects.' });
      return finish('stop', BADGE.none, head, rows, [], [irLicence(v, f)], F.smpc + '; ' + SPS + '.', null);
    }
    var sched = n === 1 ? tot + ' mg once a day' : fmt(d) + ' mg ' + times(n) + ' (' + tot + ' mg a day)';
    /* adults take Medikinet XL and Ambinet XL as two doses (morning and lunchtime), so the headline must not say "once a day" */
    var twoDoses = who(v) === 'adult' && (f === 'mkxl' || f === 'ambi');
    var from = twoDoses ? D + ' mg a day (taken as two doses, morning and lunchtime)' : D + ' mg once a day';
    head = F.name + ' ' + from + ' → <b>IR ' + sched + '</b>';
    if (status === BADGE.sps) rows.push({ h: 'What the sources say', t: spsline + ' SPS also says an individualised approach is required.' });
    else rows.push({ h: 'What the sources say', t: '<b>No official MR-to-IR table exists.</b> ' + derive + ' This is arithmetic, not guidance. ' + (spsline ? spsline + ' ' : '') + 'SPS: an individualised approach is required.' });
    var irD = n === 1 ? [{ model: 'ir', at: 7.5, mg: d }] : irDoses(d, n);
    var built = dayChart(v, 'ir', 'IR ' + (n === 1 ? tot + ' mg once a day' : fmt(d) + ' mg ' + times(n)), irD, F.name + ' ' + D + (twoDoses ? ' mg a day in two doses' : ' mg once a day'), mrDoses(f, tot, v), plain(head));
    rows.push(dayRow(built, 'IR is drawn at example times.' + (tot !== D ? ' The modified-release product is drawn at the IR-equivalent total (' + tot + ' mg) so the shapes compare; the dose is ' + D + ' mg.' : '') + (F.assumed ? ' The Tuzulby curve borrows the shape of other 30:70 products.' : '')));
    rows.push({ h: 'Watch for', t: 'SPS: consider advice from, or referral back to, the specialist who started treatment; check tolerability and efficacy. ' + PR.ir.take });
    return finish(tone, status, head, rows, [], [irLicence(v, f)], F.smpc + '; ' + SPS + '.', built.chart);
  }

  /* ---------- MR to MR ---------- */
  function mrToMr(v) {
    var f = v.from, t = v.to, F = PR[f], T = PR[t], D = +v.mr, r = route(f, t), head, rows = [], built;
    if (f === t && f !== 'tab' && f !== 'cap') {
      return { tone: 'info', badge: 'Same product', head: 'You chose the same product on both sides: <b>there is nothing to convert</b>', rows: [{ h: 'What to do', t: 'Pick a different product in “To”, or use the swap button.' }], notes: [], src: '', chart: null };
    }
    if (r.same) {            /* same SPS group: the same dose and quantity */
      head = (f === 'tab' ? 'Tablet group' : 'Capsule group') + ': <b>' + D + ' mg stays ' + D + ' mg</b> (same dose, same quantity)';
      rows.push({ h: 'What the sources say', t: 'SPS lists these brands as bioequivalent: “Generic prescribing could be undertaken and products switched between using the same dose and quantity were that to be necessary.” Brands: ' + T.brands + '.' });
      var sup = supplyNote(f, D);
      if (sup) rows.push({ h: 'Can every brand supply it?', t: sup });
      built = dayChart(v, t, 'new brand', mrDoses(t, D, v), 'usual brand', mrDoses(f, D, v), 'Same group: the day is expected to be similar');
      rows.push({ h: 'What changes in the day', t: '<em>SPS treats these brands as bioequivalent, so the day is expected to look the same.</em> That is an average finding from studies, not a promise for one person, and SPS Table 1 shows small differences between brands (' + (f === 'tab' ? 'IR:MR splits of 22:78 and 25:75' : 'second peak at 4 h or 4 to 5 h') + '). The two lines overlap only because the chart uses one shape for the group. Ask the person to report any change and go back to the usual brand when you can.' });
      var spec = ['Use it only if necessary (for example a supply problem), go back to the usual brand as soon as you can, and avoid mixing brands to reach a daily dose.'];
      var imp = f === 'tab' ? ['Matoride XL is children 6+ only (maximum 54 mg). Delmosart is not on emc: check the Accord SmPC on the MHRA site before relying on its licence or maximum.'] : ['Sprinkling advice and sucrose content differ between brands: check each SmPC.'];
      return finish(sup ? 'warn' : 'ok', BADGE.sps, head, rows, imp, spec, F.smpc + '; ' + SPS + '.', built.chart);
    }
    /* different products: no dose is converted; both shapes are drawn at the same illustrative size, never at a real dose */
    head = F.name + ' ' + D + ' mg → ' + T.name + ': <b>' + r.head + '</b>';
    rows.push({ h: 'What the sources say', t: r.why });
    if (r.dose && r.tone !== 'stop') rows.push({ h: 'Dose', t: r.dose });
    if (r.fo) rows.push(focusimRow(r.fo === 'eqxl'));
    built = dayChart(v, t, T.name + ' (illustrative shape, not a dose)', mrDoses(t, ILL, v), F.name + ' (illustrative shape)', mrDoses(f, ILL, v), plain(head));
    rows.push(dayRow(built, 'Both lines are drawn at the same size (' + ILL + ' mg) only to compare the shape of the day: this is not a conversion and not a dose.' + (F.assumed || T.assumed ? ' The Tuzulby curve borrows the shape of other 30:70 products.' : '')));
    rows.push({ h: 'Watch for', t: T.take });
    var ln = licNotes(v, t); var tone = r.tone; if (ln.off && tone === 'ok') tone = 'warn';
    return finish(tone, r.status, head, rows, ln.notes, [r.clin], r.src, built.chart);
  }

  /* ---------- the rule table (also drives the "Which switch is safe?" tab) ---------- */
  function names(list) { return list.map(function (k) { return PR[k].name; }).join(' and '); }
  function route(f, t) {
    var r = route0(f, t);
    /* the new product is the Ritalin XL-type capsule group: the Focusim XL SmPC (MR column) is the only printed MR rule */
    if (t === 'cap' && f !== 'cap' && f !== 'ir') {
      r.fo = f === 'eqxl' ? 'eqxl' : true;
      if (r.status === BADGE.none && f !== 'eqxl') { r.status = BADGE.focusim; r.head = r.head.replace('no official conversion', 'no SPS, NICE or MHRA conversion'); }
    }
    return r;
  }
  function route0(f, t) {
    var nl;
    if (f === 'ir' && t === 'ir') return { tone: 'warn', badge: 'No source', status: BADGE.none, head: 'no source says IR brands are interchangeable by dose', why: 'None of the IR SmPCs, SPS or NICE says so, and licences differ (Ritalin tablets: children and adults; Medikinet tablets and the Viatris generic: children only).', todo: 'Keep the same total daily dose and times as clinical practice, check the response, and write adult IR as Ritalin tablets by brand.', src: 'Ritalin, Medikinet and Viatris IR tablet SmPCs.' };
    if (f === t && (f === 'tab' || f === 'cap')) {
      return { tone: 'ok', badge: 'Same SPS group', status: BADGE.sps, same: true, head: 'same SPS group: swap at the same dose and quantity if necessary', why: 'SPS lists these brands as bioequivalent to one another.', todo: 'Use it only if you must (for example a supply problem), go back to the usual brand as soon as you can, and tell the person.', src: SPS + '.' };
    }
    if (f === t) return { tone: 'info', badge: 'Same product', status: 'Same product', head: 'same product on both sides', why: 'Nothing to convert.', todo: 'Pick a different product.', src: '' };
    if (f === 'ir') {
      var m = {
        tab: ['SmPC table', 'the SmPC has a table for IR taken three times a day (15 to 60 mg a day)', 'Other IR regimens: clinical judgement.'],
        kixel: ['SmPC table', 'the SmPC has a table for IR taken three times a day (15 to 60 mg a day)', 'Kixel XL is not on any SPS list.'],
        cap: ['SmPC table', 'the SmPC has a table for IR taken twice a day (5 to 30 mg each time)', 'IR three times a day: clinical judgement.'],
        mkxl: ['SmPC statement', 'the SmPC says to use the milligram-equivalent daily dose', 'Adults take it as two doses with food.'],
        ambi: ['SmPC statement', 'the SmPC says to use the milligram-equivalent daily dose', 'Ambinet XL is not on any SPS list.'],
        eqxl: ['SmPC statement', 'the SmPC says to use the milligram-equivalent daily dose', 'Children only; before breakfast.'],
        addepta: ['SmPC statement', 'the SmPC says to use the milligram-equivalent daily dose', 'Children only. SPS (28 Aug 2025) said Addepta XL was licensed but not yet launched; check current supply before choosing it.'],
        tuz: ['SmPC table', 'the SmPC has examples for IR taken twice a day (10 to 30 mg each time)', 'Children and young people 6 to 17 only; chewed.']
      }[t];
      return { tone: 'ok', badge: m[0], status: m[0], head: 'an official rule exists: ' + m[1], why: 'IR to modified-release is the one direction where the SmPCs give a rule.', todo: m[2] + ' Use the Convert tab for the dose.', src: PR[t].smpc + '.' };
    }
    if (t === 'ir') {
      return { tone: 'warn', badge: 'Particular care', status: BADGE.guide, head: 'possible, but SPS says an individualised approach is needed', why: 'SPS gives equivalence for only four doses (Concerta XL 18 mg, Equasym XL 10 mg, Medikinet XL 10 mg, Metyrol XL 10 mg). Every other dose is worked out, not official.', todo: 'Seek advice or refer back to the specialist who started treatment, assess tolerability and efficacy, and remember IR carries more risk of misuse and diversion.', src: SPS + '.' };
    }
    /* MR to MR */
    if (f === 'eqxl' || t === 'eqxl') {
      var other = f === 'eqxl' ? t : f;
      var unassessed = ['addepta', 'tuz', 'ambi', 'kixel'].indexOf(other) >= 0;
      return { tone: 'stop', badge: 'Do not switch', status: BADGE.none, head: 'do not switch', why: 'SPS: “No other MR products are bioequivalent to Equasym XL capsules and these should not be switched to or prescribed generically.”' + (unassessed ? ' SPS has not assessed ' + PR[other].name + ' against Equasym XL. No source says they are interchangeable, so the answer stays: do not switch without the specialist.' : ''), todo: 'If supply fails, ask the specialist. In a supply shortage, SPS says to individualise treatment using IR products where no bioequivalent MR product is available.', src: SPS + '; ' + MHRA + '.',
        dose: 'None. No source gives a conversion between Equasym XL and ' + (other === 'eqxl' ? 'another product' : PR[other].name) + '. MHRA: follow the dosage recommendations for the product you switch to.',
        clin: 'SPS (supply disruption): individualise treatment using IR products where bioequivalent MR products are not available. MHRA: frequent switching between products should be avoided.' };
    }
    if ((f === 'mkxl' && t === 'cap') || (f === 'cap' && t === 'mkxl')) {
      return { tone: 'warn', badge: 'Particular care', status: BADGE.guide, head: 'possible with particular care: SPS gives no dose rule', why: 'SPS: “whilst switches from or to Medikinet XL capsules are also possible, these should be undertaken with particular care since this product is not completely bioequivalent with the other four.”', todo: 'No dose rule exists: ask the specialist, follow the dosing advice for the product you move to, and review.', src: SPS + '; ' + MHRA + '.',
        dose: 'No SPS dose rule. Food rules and adult dosing differ (Medikinet XL: with food, adults in two doses; capsule group: once daily, any food). MHRA: follow the dosage recommendations of the product you move to.',
        clin: CLIN };
    }
    nl = [f, t].filter(function (k) { return PR[k].nolist; });
    if (nl.length) {
      return { tone: 'stop', badge: 'No conversion', status: BADGE.none, head: 'no official conversion: ' + names(nl) + ' ' + (nl.length > 1 ? 'are' : 'is') + ' not on any SPS list', why: 'SPS lists only two bioequivalent groups (the Concerta XL-type tablets and the Ritalin XL-type capsules), and ' + names(nl) + (nl.length > 1 ? ' are' : ' is') + ' in neither. SPS: “Best practice guidance is to prescribe methylphenidate MR products by brand.”' + (((f === 'ambi' && t === 'mkxl') || (f === 'mkxl' && t === 'ambi')) ? ' Ambinet XL repeats the Medikinet XL SmPC wording, but no source says the two are bioequivalent.' : '') + (((f === 'kixel' && t === 'tab') || (f === 'tab' && t === 'kixel')) ? ' Kixel XL repeats the Concerta XL SmPC text and table, but SPS does not list it with the tablet group.' : ''),
        todo: 'Keep the person on the brand they started. If a switch is unavoidable, ask the specialist.', src: SPS + '; ' + MHRA + '.',
        dose: 'None. MHRA: follow the dosage recommendations for the product you switch to.',
        clin: CLIN };
    }
    return { tone: 'stop', badge: 'No conversion', status: BADGE.none, head: 'no official conversion between these two designs', why: 'The tablet group is about 22:78 (Concerta XL is 22:78; SPS gives Delmosart and Xaggitin XL as 25:75) and works for about 12 hours; the capsule group and Medikinet XL are 50:50 and work for about 8 hours. No SPS, NICE or MHRA table converts between them' + (t === 'cap' ? ', and only one SmPC column prints a modified-release rule (below).' : '. The SmPC conversion tables start from immediate-release methylphenidate.') + ' MHRA: follow the specific dosage recommendations for each formulation if considering a switch to another long-acting preparation.', todo: 'Treat it as a new start with specialist input and avoid frequent switching.', src: SPS + '; ' + MHRA + '.',
      dose: 'None. Use the usual start and weekly steps of the product you move to.',
      clin: CLIN };
  }

  /* ---------- the two tabs ---------- */
  function opts() { return ORDER.map(function (k) { return { v: k, l: PR[k].pick }; }); }
  var convertTab = {
    kind: 'tool', label: 'Convert',
    intro: 'Pick what the person takes now and where to go. The chart compares shape, not strength: both lines use the same total daily amount.',
    swap: ['from', 'to'],
    fields: [
      { id: 'who', type: 'seg', label: 'Patient', value: 'adult', options: [{ v: 'adult', l: 'Adult' }, { v: 'child', l: 'Child or teen' }] },
      { id: 'from', type: 'select', label: 'From (now)', value: 'ir', options: opts() },
      { id: 'to', type: 'select', label: 'To (new)', value: 'tab', options: opts() },
      { id: 'ird', type: 'step', label: 'IR dose each time', value: 10, min: 5, max: 30, step: 5, unit: 'mg', show: function (V) { return V.from === 'ir'; } },
      { id: 'irn', type: 'seg', label: 'Times a day', value: '3', options: [{ v: '2', l: 'Twice' }, { v: '3', l: 'Three times' }], show: function (V) { return V.from === 'ir'; } },
      { id: 'mr', type: 'select', label: 'Daily dose now', value: '36', show: function (V) { return V.from !== 'ir'; }, options: function (V) { return dailyOptions(V.from, V).map(function (n) { return { v: String(n), l: n + ' mg a day' + (V.from === 'tab' && n === 45 ? ' (Atenza XL only)' : V.from === 'tab' && n === 27 ? ' (not Matoride XL)' : V.from === 'cap' && n === 60 ? ' (Metyrol XL or Meflynate XL only)' : '') }; }); } }
    ],
    compute: function (v) {
      if (v.from === 'ir') return v.to === 'ir' ? irToIr(v) : irToMr(v);
      if (v.to === 'ir') return mrToIr(v);
      return mrToMr(v);
    }
  };
  var safeTab = {
    kind: 'tool', label: 'Which switches have an official rule?',
    intro: '<b>Green</b>: an official rule exists. <b>Amber</b>: possible, with particular care. <b>Red</b>: no conversion, or do not switch. The colour shows what the sources say, not whether a switch suits this person.',
    swap: ['from', 'to'],
    fields: [
      { id: 'from', type: 'select', label: 'I want to move from', value: 'mkxl', options: opts() },
      { id: 'to', type: 'select', label: 'to', value: 'cap', options: opts() }
    ],
    compute: function (v) {
      var r = route(v.from, v.to), word = { ok: 'Green', warn: 'Amber', stop: 'Red', info: 'Note' }[r.tone];
      return {
        tone: r.tone, badge: r.badge,
        head: word + ': ' + r.head,
        rows: [{ h: 'Why', t: r.why }, { h: 'What to do', t: r.todo }].concat(r.fo ? [focusimRow(r.fo === 'eqxl')] : [], [{ h: 'Status of the rule', t: r.status }]),
        notes: ['Check the licence for the person’s age: Equasym XL, Addepta XL, Tuzulby, Matoride XL, Medikinet tablets and the Viatris generic tablets are for children only.'],
        src: r.src
      };
    }
  };

  window.M5LAB.add('mph', {
    note: 'Schematic: relative heights, not blood levels. Check the live SmPC before you prescribe.',
    tabs: [convertTab, safeTab]
  });
})();
