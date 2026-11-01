/* Module 5 medicine labs: lisdexamfetamine ("lis") and dexamfetamine ("dex"). Registers definitions with M5LAB.add
   (engine: js/m5-lab.js). Each lab has three tabs: Through the day (graph), Dose steps (weekly titration chart) and Switch.
   Facts come from the UK SmPCs on emc (Elvanse 14089, revised 2 Oct 2026; Amfexa / dexamfetamine tablets 5004, 7403, 7404,
   revised 14 Jan 2026; dexamfetamine 1 mg/ml oral solution 13874, revised 13 Mar 2026; atomoxetine 10332), NICE NG87
   (2018, updated 2019) and the local NHS documents named inside each result, all re-read on 1 Nov 2026.
   Every Switch result carries the honest status of its source in the badge: "Guideline (no numbers)", "No official
   conversion" or "Local NHS protocol (not national)". Nothing is shown as an SmPC conversion when no SmPC gives one.
   Curves are schematic: they follow SmPC peak times and SmPC statements of duration, and the long tails picture clinical
   effect, not plasma level (see the notes on each pick). */
(function () {
  'use strict';
  var LAB = window.M5LAB;
  if (!LAB) return;
  var RM = window.RELMODEL;
  /* The unconverted prodrug is not in js/release-model.js (not edited by this build), so its shape is registered here:
     peak about 1 h and half-life under 1 h (Elvanse SmPC: Tmax about 1 h in children, half-life under 1 h, usually gone by 8 h). */
  if (RM && RM.MODEL && !RM.MODEL.lisprod) RM.MODEL.lisprod = { comps: [{ frac: 1, lag: 0, ka: 1.2 }], ke: 0.8 };

  var C = { lis: ['#6b4fa3', '#d5c9ec'], dex: ['#b4590a', '#f6dcc3'], mr: ['#0b6664', '#a3d5cf'], ir: ['#a8432e', '#e8bcb1'], prod: '#a33a7a' };
  var X = { from: 6, to: 23, tick: 3, fmt: 'clock' };
  var DOSE_TIMES = [6.5, 7, 7.5, 8, 8.5, 9];
  var LUNCH = 4.5;                     /* hours after a 07:30 breakfast dose: the SmPC example is "breakfast and lunch" */

  /* ---------- facts used by the Switch tab (traced to js research file amf.json and the live pages) ---------- */
  /* Elvanse capsule content: "Each capsule contains N mg lisdexamfetamine dimesylate, equivalent to X mg of dexamfetamine" (SmPC section 2).
     This describes what is in the capsule. It is NOT a dose conversion. */
  var CAPSULE = { 20: 5.9, 30: 8.9, 40: 11.9, 50: 14.8, 60: 17.8, 70: 20.8 };
  /* LOCAL ONLY. Somerset NHS FT shortage notice 4 Oct 2023 ("with thanks to South London and Maudsley NHS FT") and the ELFT / NEL ICS
     memo of Aug 2024 (v1.1, crediting South London and Maudsley) list the same six pairings in divided doses. Oxford Health NHS FT
     (guidance approved 11 Oct 2023) gives the same figures as a "suggested starting dose" (oxStart) and a higher "full equivalent
     dose - may be necessary for symptom control, if tolerated" (oxFull). */
  var LOCAL = {
    20: { slam: 5, oxStart: 5, oxFull: 7.5 },
    30: { slam: 7.5, oxStart: 7.5, oxFull: 12.5 },
    40: { slam: 10, oxStart: 10, oxFull: 15 },
    50: { slam: 15, oxStart: 15, oxFull: 20 },
    60: { slam: 17.5, oxStart: 17.5, oxFull: 25 },
    70: { slam: 20, oxStart: 20, oxFull: 30 }
  };
  var BADGE = { guide: 'Guideline (no numbers)', none: 'No official conversion', local: 'Local NHS protocol (not national)', smpc: 'SmPC statement' };


  /* ---------- graph tab: pick builders (fresh objects each time, so the two labs never share state) ---------- */
  var NOTE_PRO = '<b>What the curve shows.</b> Peak times follow the SmPC. The fall pictures how long the effect lasts, not blood level: it is faster than the 11-hour half-life of dexamfetamine, so read the bar. The prodrug is drawn low because the SmPC says its level is low.';

  function pickLis(full) {
    var p = {
      id: 'lis', chip: 'Lisdex&shy;amfetamine', tag: full ? 'Elvanse capsule' : 'compare', color: C.lis[0], tint: C.lis[1],
      name: 'Lisdexamfetamine (Elvanse): one morning capsule',
      regimen: [{ model: 'lis', at: 0 }],
      lasts: 14, lastsTxt: 'at least 13 to 14 h',
      inside: 'An <b>inactive prodrug</b>. Red blood cells turn it into <b>dexamfetamine</b> (not the liver CYP450 enzymes). That conversion sets the pace, so the effect builds slowly. Solid line: dexamfetamine formed. Dashed: the prodrug.',
      moments: [
        { t: 'Prodrug peaks at about 1 hour', d: 'Children, fasted. Its half-life is under 1 hour and it is usually gone by about 8 hours.', h: 1 },
        { t: 'Dexamfetamine peaks at 3.5 to 4.7 hours', d: 'Fasted: 3.5 h in children, 3.8 h in adults. After a high-fat meal: 4.7 h. Food delays the peak by about 1 hour but not its size.', h: 4 },
        { t: 'Still working at 13 to 14 hours', d: 'Ongoing at 13 h in children and 14 h in adults. The SmPC does not say when it ends, so it can still be active at bedtime.', end: true }
      ],
      practice: [
        'Morning, with or without food. Avoid afternoon doses: they can stop sleep.',
        'Swallow whole, or open it and mix <b>all</b> the contents into yoghurt, water or orange juice. Take it at once; do not store it. A film of inactive ingredients may remain.',
        'Never less than one capsule a day, never divide one. Missed dose: carry on the next day.'
      ],
      note: NOTE_PRO
    };
    if (full) {
      p.series = [
        { label: 'Dexamfetamine formed', model: 'lis' },
        { label: 'Prodrug (not to scale)', model: 'lisprod', mg: 0.08, dashed: true, color: C.prod }
      ];
    } else {
      p.inside = 'For comparison. An inactive prodrug that the blood turns into dexamfetamine, so the effect builds slowly and lasts into the evening.';
      p.moments = [
        { t: 'Dexamfetamine peaks at 3.5 to 4.7 hours', d: 'Fasted: 3.5 h in children, 3.8 h in adults. After a high-fat meal: 4.7 h.', h: 4 },
        { t: 'Still working at 13 to 14 hours', d: 'Children 13 h, adults 14 h (the effect was still ongoing).', end: true }
      ];
      p.practice = ['Shown for comparison. See the lisdexamfetamine lesson.'];
      delete p.note;
    }
    return p;
  }
  function pickMr() {
    return {
      id: 'mr', chip: 'Methyl&shy;phenidate MR', tag: 'compare · 12 h', color: C.mr[0], tint: C.mr[1],
      name: 'Methylphenidate modified-release (12-hour tablet type, such as Concerta XL)',
      regimen: [{ model: 'oros', at: 0 }],
      lasts: 12, lastsTxt: 'about 12 hours',
      inside: 'For comparison. A small part is released at once and the rest slowly, so levels keep climbing into the afternoon.',
      moments: [
        { t: 'Peak at 6 to 8 hours', d: 'The core keeps releasing, so the effect builds through the day.', h: 6.8 },
        { t: 'Gone after about 12 hours', d: '', end: true }
      ],
      practice: ['Shown for comparison. See the methylphenidate lessons.']
    };
  }
  function pickIr() {
    return {
      id: 'ir', chip: 'Methyl&shy;phenidate IR', tag: 'compare · 3–4 h', color: C.ir[0], tint: C.ir[1],
      name: 'Methylphenidate immediate-release tablet',
      regimen: [{ model: 'ir', at: 0 }],
      lasts: 4, lastsTxt: 'about 3 to 4 hours',
      inside: 'For comparison. A plain tablet: the whole dose is released at once.',
      moments: [
        { t: 'Peak at 1 to 2 hours', d: 'Levels rise quickly and peak 1 to 2 hours after the dose.', h: 1.2 },
        { t: 'Gone after about 3 to 4 hours', d: '', end: true }
      ],
      practice: ['Shown for comparison. See the methylphenidate lessons.']
    };
  }
  var NOTE_DEX = '<b>What the curve shows.</b> The peak follows the SmPC (about 1.5 h). The SmPCs give no duration, so the fall is a teaching picture of benefit, not blood level. Blood level falls much more slowly (half-life 10.2 h).';
  function pickDex(id, twice, asCompare) {
    var p = {
      id: id, chip: twice ? 'Dex&shy;amfetamine twice' : 'Dex&shy;amfetamine once', tag: asCompare ? 'compare' : (twice ? 'breakfast, lunch' : 'tablet or liquid'), color: C.dex[0], tint: C.dex[1],
      name: twice ? 'Dexamfetamine: breakfast and lunch doses' : 'Dexamfetamine: one morning dose',
      regimen: twice ? [{ model: 'dex', at: 0, mg: 0.5 }, { model: 'dex', at: LUNCH, mg: 0.5 }] : [{ model: 'dex', at: 0 }],
      inside: 'A plain immediate-release tablet (5, 10 or 20 mg) or 1 mg/ml solution: the whole dose is absorbed at once, so the level rises fast. The SmPC gives a peak at about 1.5 hours. It does <b>not</b> say when it starts or how long it lasts.',
      note: NOTE_DEX
    };
    if (twice) {
      p.moments = [
        { t: 'First peak at about 1.5 hours', d: 'One 5 mg tablet, 18 healthy volunteers.', h: 1.5 },
        { t: 'Lunchtime dose', d: 'The SmPC example is “breakfast and lunch” (here 4.5 h after the first). Once or twice daily is chosen from how symptoms run through the day.', h: LUNCH },
        { t: 'Benefit fades in the afternoon', d: 'At about 4 h per dose (a local figure, not the SmPC) the pair covers morning to early afternoon. The SmPC describes once or twice a day only.', h: 9 }
      ];
      p.practice = [
        'Keep the second dose early: not too late after lunch, to avoid disturbed sleep (SmPC).',
        'Use the regimen that controls symptoms with the lowest total daily dose.',
        'A lunchtime dose means a controlled drug at school or work: plan for it.'
      ];
    } else {
      p.moments = [
        { t: 'Peak at about 1.5 hours', d: 'One 5 mg tablet, 18 healthy volunteers. No time to start working is given.', h: 1.5 },
        { t: 'About 4 hours: benefit fades (local figure)', d: 'The SmPCs do not state how long it lasts. “About 4 hours” is from Oxford Health NHS FT guidance (11 Oct 2023); Australian guidance says 3 to 4 hours. Typical practice only.', h: 4 },
        { t: 'Blood half-life: 10.2 hours', d: 'The drug leaves the blood far more slowly than the benefit fades. Not too late after lunch, to avoid disturbed sleep.', h: 10.2 }
      ];
      p.practice = [
        'First dose in the morning. Same times relative to meals each day, preferably with or just after a meal (food effect not studied).',
        'Tablets can be divided into four along the score lines to help swallowing. They do not give equal doses.',
        'Afternoon the problem? Ask about a second, early dose.'
      ];
    }
    if (asCompare) {
      p.inside = 'For comparison. A plain immediate-release tablet taken at breakfast and lunch.';
      p.practice = ['Shown for comparison. See the dexamfetamine lesson.'];
      p.moments = p.moments.slice(0, 2);
      delete p.note;
    }
    return p;
  }

  /* ---------- Dose steps: lisdexamfetamine ---------- */
  function lisSteps(v) {
    var start = +v.start, step = +v.step, renal = v.renal, max = renal === 'usual' ? 70 : 50, doses = [start], d = start;
    while (d < max) { d = Math.min(max, d + step); doses.push(d); }
    var steps = doses.map(function (x, k) { return { a: k + 1, b: k + 2, v: x, label: 'Week ' + (k + 1) }; });
    var n = doses.length, ceiling;
    if (renal === 'usual') ceiling = '<b>70 mg a day.</b> Higher doses have not been studied.';
    else if (renal === 'severe') ceiling = '<b>50 mg a day</b> in severe renal impairment (GFR 15 to under 30, or CrCl under 30), because clearance is reduced.';
    else ceiling = '<b>50 mg a day</b> at most (severe renal impairment), and the SmPC adds: consider a <b>further reduction on dialysis</b> (no figure given). Lisdexamfetamine and dexamfetamine are not dialysable.';
    return {
      tone: renal === 'usual' ? 'ok' : 'warn', badge: BADGE.smpc,
      head: doses.join(' → ') + ' mg a day over ' + n + (n === 1 ? ' week' : ' weeks') + ' (fastest climb)',
      rows: [
        { h: 'Start and steps', t: (start === 30 ? '<b>30 mg</b> each morning (usual start)' : '<b>20 mg</b> each morning, when a lower start is judged appropriate') + ', then <b>10 or 20 mg</b> at about weekly intervals, to the <b>lowest effective dose</b>. Capsules cannot be divided.' },
        { h: 'Ceiling', t: ceiling },
        { h: 'Stop rule', t: 'Stop if <b>no improvement after appropriate dose adjustment over 1 month</b>. NICE judges benefit from a 6-week trial at an adequate dose before changing medicine.' },
        { h: 'Other groups', t: 'Same steps for children and adults; not under 6. Older adults: limited data, lower clearance, so doses may need adjusting. Liver: not studied, so no advice.' }
      ],
      notes: [],
      src: 'Source: Elvanse SmPC (emc 14089, revised 2 Oct 2026); NICE NG87.',
      chart: {
        kind: 'weeks', x: { from: 1, to: 9, unit: 'week' }, y: { max: 80, label: 'mg a day' }, color: C.lis[0], tint: C.lis[1], steps: steps,
        marks: [{ x: 5, t: 'One month' }],
        read: function (h, st) {
          var month = h === 5 ? ' One month of adjusting: stop if no improvement.' : '';
          return (h > n ? 'already at the ceiling of ' + max + ' mg a day. Do not go higher.' : st.v + ' mg a day.') + month;
        }
      }
    };
  }

  /* ---------- Dose steps: dexamfetamine ---------- */
  function dexSteps(v) {
    var adult = v.age === 'adult', start = +v.start, target = +v.target, doses = [start], d = start, below = target < start;
    while (d < target) { d = Math.min(target, d + 5); doses.push(d); }
    var n = doses.length, tone, badge, head, rows, notes = [], ymax = target <= 20 ? 25 : (target <= 40 ? 45 : 65);
    var startTxt = start === 5 ? '<b>5 mg once a day</b>' : '<b>5 mg twice a day</b> (10 mg a day), for example breakfast and lunch';
    var path = below ? 'Target is below the start: begin at ' + start + ' mg a day' : doses.join(' → ') + ' mg a day over ' + n + (n === 1 ? ' week' : ' weeks');
    if (!adult) {
      tone = target <= 20 ? 'ok' : (target <= 40 ? 'warn' : 'stop'); badge = BADGE.smpc;
      head = target > 40 ? 'Above 40 mg a day: beyond anything the SmPC describes' : (target > 20 ? path + '. Above the usual 20 mg maximum' : path);
      rows = [
        { h: 'Start and steps', t: startTxt + ' at the lowest possible dose, then add <b>5 mg to the daily dose each week</b>, guided by tolerability and effect.' },
        { h: 'Maximum', t: 'Usually <b>20 mg a day</b> in children and adolescents. <b>40 mg</b> may rarely be needed. Use the regimen that controls symptoms with the lowest total daily dose.' },
        { h: 'Other groups', t: 'Ages 6 to 17 only, under specialist supervision; not under 6. Kidney or liver impairment: no experience, peak levels could be higher and elimination slower, no dose figure, so take special care.' }
      ];
    } else {
      tone = target > 60 ? 'stop' : 'warn'; badge = BADGE.local;
      head = target > 60 ? 'Above 60 mg a day: higher than the local maximum quoted below' : 'Adults: no licensed dose. Local example: ' + (below ? start + ' mg a day' : doses.join(' → ') + ' mg a day');
      rows = [
        { h: 'Licence', t: '<b>Not licensed for ADHD in adults</b>: the SmPC says safety and efficacy in adults have not been established. NICE supports it when lisdexamfetamine works but lasts too long. Record the off-label reason and consent.' },
        { h: 'Local NHS protocol (not national)', t: 'Oxford Health adult shared-care protocol (approved 2017, adult version May 2021, marked “currently under review”): 5 mg twice a day, up by 5 to 10 mg weekly as necessary.<br>Nottinghamshire APC adult protocol V2.0 (March 2025): “maximum 60 mg per day to be given in 2–4 divided doses”.' },
        { h: 'Also check', t: 'The current BNF adult entry and your local shared-care protocol before you set a dose.' }
      ];
      notes.push('The chart uses 5 mg weekly steps. 60 mg is a local ceiling, not an SmPC ADHD dose: the SmPCs give 60 mg a day only for adult narcolepsy.');
    }
    return {
      tone: tone, badge: badge, head: head, rows: rows, notes: notes,
      src: adult ? 'Sources: Amfexa SmPC (emc 5004, revised 14 Jan 2026); the two local protocols named above; NICE NG87.' : 'Source: Amfexa and dexamfetamine tablet SmPCs (emc 5004, 7403, 7404, revised 14 Jan 2026); oral solution SmPC (emc 13874) has the same ADHD wording.',
      chart: {
        kind: 'weeks', x: { from: 1, to: Math.max(9, n + 2), unit: 'week' }, y: { max: ymax, label: 'mg a day' }, color: C.dex[0], tint: C.dex[1],
        steps: doses.map(function (x, k) { return { a: k + 1, b: k + 2, v: x, label: 'Week ' + (k + 1) }; }), marks: [],
        read: function (h, st) { return h > n ? 'target reached. Stay at the lowest effective dose.' : st.v + ' mg a day'; }
      }
    };
  }

  /* ---------- Switch ---------- */
  function lisCurve(label) { return { label: label, color: C.lis[0], tint: C.lis[1], doses: [{ model: 'lis', at: 7.5, mg: 1 }] }; }
  function mrCurve(label) { return { label: label, color: C.mr[0], tint: C.mr[1], doses: [{ model: 'oros', at: 7.5, mg: 1 }] }; }
  function dexSplit(label) { return { label: label, color: C.dex[0], tint: C.dex[1], doses: [{ model: 'dex', at: 7.5, mg: 0.5 }, { model: 'dex', at: 7.5 + LUNCH, mg: 0.5 }] }; }
  function dayChart(a, b, title) {
    a.label += ' (now)'; b.label += ' (after)'; b.dashed = true;
    return { kind: 'day', x: X, bedtime: 22, series: [a, b], title: title };
  }
  var NICE_SRC = 'NICE NG87 (2018, updated 2019)';

  function same() {
    return { tone: 'info', head: 'Choose two different medicines to see how to switch.', rows: [], notes: ['To change between methylphenidate products, see the methylphenidate lessons.'], src: '' };
  }
  function mphToLis(adult) {
    return {
      tone: 'info', badge: BADGE.guide,
      head: 'NICE says when to switch to lisdexamfetamine. No source gives a dose conversion.',
      chart: dayChart(mrCurve('Methylphenidate MR 12 h (example)'), lisCurve('Lisdexamfetamine'), 'Methylphenidate to lisdexamfetamine: the shape of the day'),
      rows: [
        { h: 'When (NICE guideline)', t: 'Consider it for ' + (adult ? 'adults' : 'children aged 5 and over and young people') + ' after a <b>6-week trial of methylphenidate at an adequate dose</b> without enough benefit (fewer symptoms, less impairment).' },
        { h: 'Dose', t: 'No conversion. The Elvanse SmPC gives <b>starting doses only</b>: 30 mg each morning (20 mg if a lower start is judged right), then 10 or 20 mg about weekly. Start as for a new medicine.' },
        { h: 'Licence', t: adult ? 'Adults with ADHD symptoms that began in childhood.' : 'From age 6, when the response to methylphenidate is clinically inadequate. Not under 6, although NICE’s advice starts at 5.' }
      ],
      notes: ['Australian shortage guidance (AADPA, 19 Jun 2025, not UK): “Not a direct substitute for methylphenidate — requires new titration.” SPS and MHRA switching advice covers modified-release methylphenidate only.'],
      src: 'Sources: ' + NICE_SRC + '; Elvanse SmPC (emc 14089, 2 Oct 2026); SPS (28 Aug 2025); MHRA (26 Sep 2022).'
    };
  }
  function lisToMph(adult) {
    return {
      tone: adult ? 'info' : 'warn', badge: adult ? BADGE.guide : BADGE.none,
      head: adult ? 'NICE lets adults go back to methylphenidate. It gives no dose conversion.' : 'NICE has no step from lisdexamfetamine back to methylphenidate for children. No source gives a conversion.',
      chart: dayChart(lisCurve('Lisdexamfetamine'), mrCurve('Methylphenidate MR 12 h (example)'), 'Lisdexamfetamine to methylphenidate: the shape of the day'),
      rows: [
        { h: 'When (NICE guideline)', t: adult ? 'Consider methylphenidate for adults after a <b>6-week trial of lisdexamfetamine at an adequate dose</b> without enough benefit.' : 'None in NG87 for children. If both medicines fail in separate 6-week trials, or are not tolerated, NICE offers atomoxetine or guanfacine.' },
        { h: 'Dose', t: 'No source gives a rule. Each methylphenidate product has its own starting dose in its SmPC. Ask the specialist.' },
        { h: 'Local NHS protocol (not national)', t: 'Nottinghamshire APC shortage advice (v35, 20 May 2024): specialist advice needed; “gradually reduce Elvanse”, then start prolonged-release methylphenidate <b>18 mg once daily</b> and increase weekly. No dose-for-dose ratio.' }
      ],
      notes: [],
      src: 'Sources: ' + NICE_SRC + '; Nottinghamshire APC ADHD medicines supply advice v35 (ratified 12 Oct 2023).'
    };
  }
  function lisToDex(adult, cap) {
    var s = CAPSULE[cap] ? cap : 30, L = LOCAL[s];
    return {
      tone: 'warn', badge: BADGE.guide,
      head: 'NICE says when to switch. No national source says how many milligrams.',
      chart: dayChart(lisCurve('Lisdexamfetamine'), dexSplit('Dexamfetamine, 2 doses'), 'Lisdexamfetamine to dexamfetamine: the shape of the day'),
      rows: [
        { h: 'When (NICE guideline)', t: 'Consider dexamfetamine only if symptoms are <b>responding to lisdexamfetamine but the person cannot tolerate the longer effect profile</b>. ' + (adult ? 'It is off-label in adults (NICE says so).' : 'Dexamfetamine is licensed only for ages 6 to 17 after an inadequate response to methylphenidate, so this is outside the licence.') },
        { h: 'Official conversion', t: '<b>None.</b> No SmPC, NICE, SPS or MHRA text gives a mg-to-mg rule. The SmPC line “' + s + ' mg capsule … equivalent to ' + CAPSULE[s] + ' mg of dexamfetamine” says what is in the capsule. It is not a dose conversion.' },
        { h: 'Local NHS protocol (not national guidance)', t: 'For Elvanse <b>' + s + ' mg</b>: <b>' + L.slam + ' mg</b> dexamfetamine in divided doses (Somerset NHS FT shortage notice, 4 Oct 2023, and East London ICS memo, Aug 2024 v1.1; both credit South London and Maudsley NHS FT). Oxford Health NHS FT (approved 11 Oct 2023): <b>' + L.oxStart + ' mg</b> to start, and a higher “full equivalent dose” of <b>' + L.oxFull + ' mg</b> “if tolerated”.' },
        { h: 'Take care', t: 'A starting point only: divided doses, monitor, then titrate. The usual child and adolescent maximum is 20 mg a day (SmPC). Ask about substance use and diversion risk.' }
      ],
      notes: [
        'The three documents appear to trace to <b>one source</b> (South London and Maudsley; Oxford does not name it but its starting figures match). We could not find the original. Oxford’s higher column shows local documents disagree.'
      ],
      src: 'Sources: ' + NICE_SRC + '; Elvanse SmPC (emc 14089, 2 Oct 2026); Amfexa SmPC (emc 5004); Oxford Health NHS FT switching guidance.'
    };
  }
  function dexToLis() {
    return {
      tone: 'warn', badge: BADGE.none,
      head: 'No source gives a conversion from dexamfetamine to lisdexamfetamine.',
      chart: dayChart(dexSplit('Dexamfetamine, 2 doses'), lisCurve('Lisdexamfetamine'), 'Dexamfetamine to lisdexamfetamine: the shape of the day'),
      rows: [
        { h: 'What the sources say', t: 'The Elvanse SmPC gives <b>starting doses only</b>: 30 mg each morning (20 mg if a lower start is judged right), then 10 or 20 mg about weekly, up to 70 mg. The Oxford Health switching document covers lisdexamfetamine to dexamfetamine only.' },
        { h: 'What to do', t: 'Treat it as starting lisdexamfetamine and titrate from the usual start. Ask the specialist.' }
      ],
      notes: [],
      src: 'Sources: Elvanse SmPC (emc 14089, 2 Oct 2026); Oxford Health NHS FT switching guidance (11 Oct 2023); ' + NICE_SRC + '.'
    };
  }
  function mphToDex(adult) {
    return {
      tone: 'warn', badge: BADGE.none,
      head: 'No source converts methylphenidate to dexamfetamine. It has its own start.',
      chart: dayChart(mrCurve('Methylphenidate MR 12 h (example)'), dexSplit('Dexamfetamine, 2 doses'), 'Methylphenidate to dexamfetamine: the shape of the day'),
      rows: [
        { h: 'Dose', t: 'The dexamfetamine SmPC gives <b>5 mg once or twice daily</b>, then <b>5 mg more a day each week</b>, for ages 6 to 17 whose response to methylphenidate was clinically inadequate. No mg-for-mg rule.' },
        { h: 'NICE', t: 'NICE’s only place for dexamfetamine is <b>after lisdexamfetamine</b>, when it works but its longer effect profile is not tolerated.' },
        { h: 'Adults', t: adult ? 'Not licensed for ADHD in adults: off-label, with the reason and consent recorded.' : 'Not licensed for ADHD in adults, so this applies to ages 6 to 17.' }
      ],
      notes: [],
      src: 'Sources: Amfexa SmPC (emc 5004, 14 Jan 2026); ' + NICE_SRC + '.'
    };
  }
  function dexToMph() {
    return {
      tone: 'warn', badge: BADGE.none,
      head: 'No source converts dexamfetamine to methylphenidate. NICE has no step this way.',
      chart: dayChart(dexSplit('Dexamfetamine, 2 doses'), mrCurve('Methylphenidate MR 12 h (example)'), 'Dexamfetamine to methylphenidate: the shape of the day'),
      rows: [
        { h: 'What the sources say', t: 'NG87 has no step from dexamfetamine back to methylphenidate. Each methylphenidate product has its own starting dose in its SmPC. No UK local protocol read gives a rule.' },
        { h: 'What to do', t: 'Treat it as starting a new medicine and titrate. Ask the specialist.' }
      ],
      notes: ['Australian shortage guidance (AADPA, 2025, not UK): “There is no established dose equivalence between dexamfetamine IR and either methylphenidate or lisdexamfetamine. Titrate independently starting at a low dose.”'],
      src: 'Sources: ' + NICE_SRC + '; Amfexa SmPC (emc 5004).'
    };
  }
  function atxWhen(adult) {
    return adult ? 'Offer atomoxetine to adults if they <b>cannot tolerate lisdexamfetamine or methylphenidate</b>, or symptoms have not responded to <b>separate 6-week trials of both</b>.' : 'Offer atomoxetine or guanfacine to children aged 5 and over and young people if they <b>cannot tolerate methylphenidate or lisdexamfetamine</b>, or symptoms have not responded to <b>separate 6-week trials of both</b>.';
  }
  function amfToAtx(from, adult) {
    var lisFrom = from === 'lis';
    var r = {
      tone: 'info', badge: BADGE.guide,
      head: 'NICE says when to offer atomoxetine. No source gives a cross-over or a conversion.',
      rows: [
        { h: 'When (NICE guideline)', t: atxWhen(adult) },
        { h: 'Cross-over', t: 'No cross-taper, overlap or equivalence is stated in the atomoxetine, Elvanse or dexamfetamine SmPCs, NG87, SPS or MHRA advice. Atomoxetine is not a stimulant. Its SmPC gives starting doses only (adults: <b>40 mg a day for at least 7 days</b>, then titrate; children by weight).' },
        { h: 'Stopping and speed', t: (lisFrom ? 'The Elvanse SmPC gives no stopping rule. ' : '') + 'The dexamfetamine SmPC says to reduce gradually, with careful monitoring. NICE’s committee noted that stimulants work more quickly than atomoxetine, which can take longer. Ask the specialist how to cover the gap.' }
      ],
      notes: [],
      src: 'Sources: ' + NICE_SRC + '; atomoxetine SmPC (emc 10332, 6 Dec 2024); Elvanse and Amfexa SmPCs.'
    };
    if (lisFrom) {
      r.rows.push({ h: 'Local NHS protocol (not national)', t: 'Nottinghamshire APC (v35, 20 May 2024): lisdexamfetamine can be stopped abruptly at low doses (up to 30 mg daily); at higher doses reduce, ideally by 20 mg a week.' });
    }
    return r;
  }
  function mphToAtx(adult) {
    return {
      tone: 'info', badge: BADGE.guide,
      head: 'NICE says when to offer atomoxetine. No source gives a cross-over or a conversion.',
      rows: [
        { h: 'When (NICE guideline)', t: atxWhen(adult) },
        { h: 'Cross-over', t: 'No cross-taper, overlap or equivalence is stated in the atomoxetine SmPC, NG87, SPS or MHRA advice. The atomoxetine SmPC gives starting doses only (adults: 40 mg a day for at least 7 days, then titrate). Ask the specialist.' }
      ],
      notes: [],
      src: 'Sources: ' + NICE_SRC + '; atomoxetine SmPC (emc 10332, 6 Dec 2024); SPS; MHRA.'
    };
  }
  function toStimFromAtx(to) {
    var d = to === 'lis' ? 'Elvanse: 30 mg each morning (20 mg if a lower start is judged right), then 10 or 20 mg about weekly.' : (to === 'dex' ? 'Dexamfetamine: 5 mg once or twice daily, then 5 mg more a day each week (ages 6 to 17; adult use is off-label).' : 'Each methylphenidate product has its own starting dose in its SmPC.');
    return {
      tone: 'warn', badge: BADGE.none,
      head: 'We found no source that describes switching from atomoxetine to a stimulant.',
      rows: [
        { h: 'NICE order', t: 'In NICE’s order atomoxetine comes <b>after</b> the stimulants: it is offered when they are not tolerated or have not worked.' },
        { h: 'Dose', t: 'No overlap, cross-taper or equivalence is stated. The new medicine’s SmPC gives only its own starting dose. ' + d + ' Ask the specialist.' }
      ],
      notes: [],
      src: 'Sources: ' + NICE_SRC + '; Elvanse, Amfexa and atomoxetine SmPCs.'
    };
  }
  function dexForms(from, to) {
    var tab = (from === 'dex' || from === 'dexb') && (to === 'dex' || to === 'dexb');
    if (tab) {
      return {
        tone: 'warn', badge: BADGE.none,
        head: 'No tablet SmPC says that one brand is interchangeable with another.',
        rows: [
          { h: 'What the SmPCs say', t: 'Amfexa, Medice, Orifarm and Waymade tablet SmPCs carry the <b>same dosing wording</b> and the same peak-time and half-life data (one 5 mg tablet, 18 healthy volunteers). None says the brands are bioequivalent or interchangeable.' },
          { h: 'Practice', t: '<em>Clinical practice, not an SmPC statement:</em> a swap at the same total daily dose in mg is reasonable. Tell the person and ask them to report any change in effect or side effects.' }
        ],
        notes: ['Isomalt differs by brand and strength (about 138 to 149 mg per tablet). It matters only in hereditary fructose intolerance.'],
        src: 'Source: Amfexa, Medice, Orifarm and Waymade dexamfetamine tablet SmPCs (emc, revised 2025 to 2026).'
      };
    }
    return {
      tone: 'warn', badge: BADGE.none,
      head: 'No SmPC says the oral solution and the tablets are mg-for-mg interchangeable.',
      rows: [
        { h: 'What the SmPCs say', t: 'Both are labelled in mg of <b>dexamfetamine sulfate</b> with the same ADHD wording (5 mg once or twice daily, 5 mg weekly steps, usual maximum 20 mg, 40 mg rarely; ages 6 to 17).' },
        { h: 'What is missing', t: 'Neither says the two give the same blood levels. The solution SmPC gives <b>no peak time, half-life or absorption figures</b> and no comparison with the tablets.' },
        { h: 'What to do', t: 'No rule in the sources: take specialist advice and review the effect soon after any change. Oxford Health only notes that a 1 mg/ml liquid is available if swallowing is difficult.' }
      ],
      notes: ['Solution: 1 mg per ml; liquid maltitol 200 mg/ml (not for hereditary fructose intolerance); benzoic acid 0.6 mg/ml; use within 30 days of opening (150 ml).'],
      src: 'Sources: oral solution SmPC (Rosemont, emc 13874, 13 Mar 2026); Amfexa SmPC (emc 5004); Oxford Health NHS FT guidance (11 Oct 2023).'
    };
  }

  function norm(id) { return (id === 'dexb' || id === 'dexs') ? 'dex' : id; }
  function switchResult(v) {
    var from = v.from, to = v.to, adult = v.age !== 'child', cap = +v.cap || 30;
    if (from === to) return same();
    var fd = from === 'dex' || from === 'dexb' || from === 'dexs', td = to === 'dex' || to === 'dexb' || to === 'dexs';
    if (fd && td) return dexForms(from, to);
    var f = norm(from), t = norm(to), key = f + '>' + t;
    switch (key) {
      case 'mph>lis': return mphToLis(adult);
      case 'lis>mph': return lisToMph(adult);
      case 'lis>dex': return lisToDex(adult, cap);
      case 'dex>lis': return dexToLis();
      case 'mph>dex': return mphToDex(adult);
      case 'dex>mph': return dexToMph();
      case 'lis>atx': return amfToAtx('lis', adult);
      case 'dex>atx': return amfToAtx('dex', adult);
      case 'mph>atx': return mphToAtx(adult);
      case 'atx>lis': case 'atx>dex': case 'atx>mph': return toStimFromAtx(t);
    }
    return same();
  }

  function switchTab(label, options, defFrom, defTo) {
    return {
      kind: 'tool', label: label,
      intro: 'Pick the two medicines. The badge shows how reliable the answer is.',
      swap: ['from', 'to'],
      fields: [
        { id: 'from', type: 'select', label: 'From', value: defFrom, options: options },
        { id: 'to', type: 'select', label: 'To', value: defTo, options: options },
        { id: 'age', type: 'seg', label: 'Age group', value: 'adult', options: [{ v: 'adult', l: 'Adult' }, { v: 'child', l: 'Child or young person' }] },
        { id: 'cap', type: 'select', label: 'Elvanse capsule now', value: '30', show: function (v) { return v.from === 'lis' && (v.to === 'dex' || v.to === 'dexb' || v.to === 'dexs'); },
          options: [20, 30, 40, 50, 60, 70].map(function (n) { return { v: String(n), l: n + ' mg' }; }) }
      ],
      compute: switchResult
    };
  }

  /* ---------- the two labs ---------- */
  LAB.add('lis', {
    note: 'Schematic teaching model. Curves share one total area to compare shapes, not to say doses are equal. Real responses vary.',
    tabs: [
      { kind: 'day', label: 'Through the day', x: X, doseAt: 7.5, doseTimes: DOSE_TIMES, bedtime: 22, compare: true,
        picks: [pickLis(true), pickDex('dex', true, true), pickMr(), pickIr()] },
      { kind: 'tool', label: 'Dose steps',
        intro: 'The chart shows the <b>fastest</b> climb the SmPC allows. You may stop at any step.',
        fields: [
          { id: 'start', type: 'seg', label: 'Starting dose', value: '30', options: [{ v: '30', l: '30 mg (usual)' }, { v: '20', l: '20 mg (lower)' }] },
          { id: 'step', type: 'seg', label: 'Step each week', value: '10', options: [{ v: '10', l: '10 mg' }, { v: '20', l: '20 mg' }] },
          { id: 'renal', type: 'select', label: 'Kidney function', value: 'usual', options: [
            { v: 'usual', l: 'No severe impairment' },
            { v: 'severe', l: 'Severe impairment (CrCl under 30)' },
            { v: 'dialysis', l: 'On dialysis' }] }
        ],
        compute: lisSteps },
      switchTab('Switch', [
        { v: 'mph', l: 'Methylphenidate (IR or MR)' }, { v: 'lis', l: 'Lisdexamfetamine' },
        { v: 'dex', l: 'Dexamfetamine tablets' }, { v: 'atx', l: 'Atomoxetine' }], 'lis', 'dex')
    ]
  });

  LAB.add('dex', {
    note: 'Schematic teaching model. Curves share one total area to compare shapes, not to say doses are equal. Real responses vary.',
    tabs: [
      { kind: 'day', label: 'Through the day', x: X, doseAt: 7.5, doseTimes: DOSE_TIMES, bedtime: 22, compare: true,
        picks: [pickDex('dex1', false, false), pickDex('dex2', true, false), pickLis(false), pickIr()] },
      { kind: 'tool', label: 'Dose steps',
        intro: 'Weekly 5 mg steps towards the daily dose you are aiming for. You may stop at any step.',
        fields: [
          { id: 'age', type: 'seg', label: 'Age group', value: 'child', options: [{ v: 'child', l: 'Child or teen 6 to 17' }, { v: 'adult', l: 'Adult (off-label)' }] },
          { id: 'start', type: 'seg', label: 'Starting dose', value: '5', options: [{ v: '5', l: '5 mg once a day' }, { v: '10', l: '5 mg twice a day' }] },
          { id: 'target', type: 'step', label: 'Aiming for', value: 20, min: 5, max: 60, step: 5, unit: 'mg a day' }
        ],
        compute: dexSteps },
      switchTab('Switch', [
        { v: 'dex', l: 'Dexamfetamine tablets' }, { v: 'dexb', l: 'Dexamfetamine tablets, another brand' },
        { v: 'dexs', l: 'Dexamfetamine oral solution 1 mg/ml' }, { v: 'lis', l: 'Lisdexamfetamine' },
        { v: 'mph', l: 'Methylphenidate (IR or MR)' }], 'dex', 'dexs')
    ]
  });
})();
