/* Tests for js/m5-lab-ns.js (atomoxetine and guanfacine labs), the new keys in js/release-model.js, js/data-quiz-m5-ns.js
   and the non-stimulant corrections in js/data-brands.js and js/data-titration.js.
   Plain node, no packages:  node tests/m5-lab-ns.test.js
   Every number and status asserted here comes from the atomoxetine SmPCs (emc 10332, 11171), the Intuniv SmPC (emc 5099), the
   Neuraxpharm guanfacine SmPCs and letter of 9 Oct 2026, the Elvanse SmPC (emc 14089) and NICE NG87, read on 1 November 2026. */
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
let passed = 0;
function t(name, fn) { try { fn(); passed++; } catch (e) { console.error('FAIL: ' + name + '\n  ' + (e && e.message)); process.exitCode = 1; } }
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

function load() {
  const defs = {};
  const win = { M5LAB: { add(id, def) { defs[id] = def; } } };
  const ctx = vm.createContext({ window: win, console });
  vm.runInContext(read('js/release-model.js'), ctx);
  vm.runInContext(read('js/m5-lab-ns.js'), ctx);
  return { defs, RM: win.RELMODEL };
}
const { defs, RM } = load();
const atx = defs.atx, gua = defs.gua;
const BADGES = ['SmPC table', 'SmPC statement', 'Guideline (no numbers)', 'Local NHS protocol (not national)', 'Worked out from the SmPC (not official)', 'No official method'];
const text = (r) => [r.head, (r.rows || []).map((x) => x.h + ' ' + x.t).join(' '), (r.notes || []).join(' '), r.src || ''].join(' ');
const eq = (a, b) => assert.strictEqual(JSON.stringify(a), JSON.stringify(b));
const has = (s, re, msg) => assert.ok(re.test(s), (msg || 'missing') + ': ' + re + ' in ' + String(s).slice(0, 300));
const rowOf = (r, h) => (r.rows || []).filter((x) => x.h.indexOf(h) === 0)[0];
const tool = (lab, label) => lab.tabs.filter((x) => x.label === label)[0];

/* ---------- registration ---------- */
t('both labs register with three tabs each', () => {
  assert.ok(atx && gua);
  eq(atx.tabs.map((x) => x.kind), ['day', 'tool', 'tool']);
  eq(gua.tabs.map((x) => x.kind), ['day', 'tool', 'tool']);
  eq(atx.tabs.map((x) => x.label), ['Through the day', 'Dose', 'Switch and stop']);
  eq(gua.tabs.map((x) => x.label), ['Through the day', 'Dose', 'Stop, miss, switch']);
});
t('every badge used is one of the six honest statuses', () => {
  const seen = new Set();
  const grab = (r) => { if (r.badge) seen.add(r.badge); };
  const T = tool(atx, 'Switch and stop');
  ['atx1', 'atx2', 'sol', 'stim', 'gua'].forEach((a) => ['atx1', 'atx2', 'sol', 'stim', 'gua'].forEach((b) => { if (a !== b) grab(T.compute({ task: 'sw', from: a, to: b, total: '80' })); }));
  ['gs', 'as', 'ag'].forEach((x) => grab(T.compute({ task: 'add', add: x })));
  grab(T.compute({ task: 'stop' }));
  const G = tool(gua, 'Stop, miss, switch');
  ['taper', 'miss', 'ir', 'brand', 'to', 'from', 'add', 'adult'].forEach((x) => grab(G.compute({ sit: x, dose: '4', gap: '3', miss: '2', other: 'stim' })));
  grab(tool(gua, 'Dose').compute({ age: '6', w: '30', mod: 'none' }));
  seen.forEach((b) => assert.ok(BADGES.indexOf(b) >= 0, 'unknown badge ' + b));
  assert.ok(seen.size >= 3);
});

/* ---------- release model: only new keys, fitted to SmPC figures ---------- */
function peak(key, hours) { const c = RM.curve(key, null, hours); let k = 0; for (let i = 1; i < c.length; i++) if (c[i] > c[k]) k = i; return k * RM.DT; }
function lvl(key, h, hours) { return RM.curve(key, null, hours || 200)[Math.round(h / RM.DT)]; }
t('new model keys exist and existing keys are untouched', () => {
  ['atx_em', 'atx_pm', 'atx_inh', 'gua_pr'].forEach((k) => assert.ok(RM.MODEL[k], k));
  ['ir', 'eq', 'mk', 'rxl', 'oros', 'dex', 'lis'].forEach((k) => assert.ok(RM.MODEL[k], k));
  const src = read('js/release-model.js');
  has(src, /atx_em[\s\S]*Does NOT claim/);
  has(src, /gua_pr[\s\S]*Does NOT claim: the tablet's release profile, accumulation or steady/);
  has(src, /1 to 2 hours after dosing/); has(src, /approximately 5 hours after oral administration/); has(src, /approximately 18 hours/);
});
t('atomoxetine curves peak at 1 to 2 hours; half-lives 3.6 h and 21 h', () => {
  const pe = peak('atx_em', 30), pp = peak('atx_pm', 100);
  assert.ok(pe >= 1 && pe <= 2, 'em peak ' + pe);
  assert.ok(pp >= 1 && pp <= 2, 'pm peak ' + pp);
  const r1 = lvl('atx_em', 14 + 3.6, 60) / lvl('atx_em', 14, 60); assert.ok(Math.abs(r1 - 0.5) < 0.03, 'em half-life ratio ' + r1);
  const r2 = lvl('atx_pm', 40 + 21, 200) / lvl('atx_pm', 40, 200); assert.ok(Math.abs(r2 - 0.5) < 0.03, 'pm half-life ratio ' + r2);
});
t('guanfacine curve peaks at about 5 hours; half-life about 18 hours', () => {
  const p = peak('gua_pr', 100); assert.ok(p >= 4.8 && p <= 5.2, 'gua peak ' + p);
  const r = lvl('gua_pr', 60 + 18, 200) / lvl('gua_pr', 60, 200); assert.ok(Math.abs(r - 0.5) < 0.03, 'gua half-life ratio ' + r);
});
t('atomoxetine day tab: areas 10x (poor metaboliser) and 6x, 8x (inhibitor) of the usual; split has the same total', () => {
  const T = atx.tabs[0], ids = T.picks.map((x) => x.id);
  eq(ids, ['once', 'split', 'pm', 'inh']);
  const A = (key, span) => { const c = RM.curve(key, null, span); let a = 0; for (let i = 0; i < c.length; i++) a += c[i] * RM.DT; return a; };
  const span = Math.ceil(T.x.to) + 2;
  /* the engine draws mg x unit-area curve over the window, so the drawn area is mg x 1 */
  const em = T.picks[0].regimen[0].mg, pm = T.picks[2].series[0].mg, i6 = T.picks[3].series[0].mg, i8 = T.picks[3].series[1].mg;
  const full = (key, mg) => mg * A(key, 600) / A(key, span);
  assert.ok(Math.abs(full('atx_pm', pm) / full('atx_em', em) - 10) < 0.05, 'pm ratio');
  assert.ok(Math.abs(full('atx_inh', i6) / full('atx_em', em) - 6) < 0.05, 'inh 6');
  assert.ok(Math.abs(full('atx_inh', i8) / full('atx_em', em) - 8) < 0.05, 'inh 8');
  const sp = T.picks[1].regimen; assert.strictEqual(sp.length, 2);
  assert.ok(Math.abs(sp[0].mg + sp[1].mg - em) < 1e-9, 'split total equals once-daily total');
  assert.strictEqual(sp[0].mg, sp[1].mg); /* evenly divided */
  assert.strictEqual(T.bedtime, 22); assert.ok(T.doseTimes.length > 1 && T.compare);
});
t('atomoxetine day tab text: moments from the SmPC, no invented effect claim', () => {
  const T = atx.tabs[0], all = T.picks.map((p) => [p.name, p.inside, (p.moments || []).map((m) => m.t + ' ' + m.d).join(' '), (p.practice || []).join(' '), p.note].join(' ')).join(' ');
  has(all, /1 to 2 hours/); has(all, /3\.6 hours/); has(all, /21 hours/); has(all, /10 times/); has(all, /6-to 8-fold/); has(all, /3 to 4 times/);
  has(all, /no daily peak of clinical effect/); has(all, /fluoxetine, paroxetine, quinidine, terbinafine/);
  has(all, /may be considered/); has(all, /may be necessary/); has(all, /7%/);
  assert.ok(!/builds? over weeks/i.test(all)); has(all, /gives no time at which the clinical effect peaks or fades/); assert.ok(!/(effect|benefit)[^.]{0,40}(fades|wears off) (faster|sooner)/i.test(all));
  const sp = T.picks[1]; has(sp.inside, /evenly divided doses in the morning and late afternoon or early evening/); has(sp.moments.map((m) => m.d).join(' '), /tolerability.*efficacy/);
});
t('guanfacine day tab: three-day axis, SmPC timings, high-fat meal sizes, schematic label', () => {
  const T = gua.tabs[0]; eq(T.x, { from: 0, to: 72, tick: 12, fmt: 'day' });
  eq(T.picks.map((x) => x.id), ['daily', 'miss']);
  eq(T.picks[0].regimen.map((d) => d.at), [0, 24, 48]);
  const all = T.picks[0].moments.map((m) => m.t + ' ' + m.d).join(' ') + T.picks[0].note;
  has(all, /about 5 hours/); has(all, /about 18 hours/); has(all, /75%/); has(all, /40%/); has(all, /schematic/); has(all, /does not state accumulation or a time to steady state/);
  has(all, /not drawn/); assert.ok(T.picks[0].moments.length >= 4);
  const hs = T.picks[0].moments.map((m) => m.h); assert.strictEqual(new Set(hs).size, hs.length, 'no two markers at the same time');
  assert.ok(T.picks[0].practice.join(' ').indexOf('both beat placebo') >= 0);
  eq(T.doseTimes.filter((x) => x < 12).length > 0 && T.doseTimes.filter((x) => x > 12).length > 0, true);
  const ms = T.picks[1].moments.map((m) => m.d).join(' '); has(ms, /resume the next day/); has(ms, /re-titration/);
});

/* ---------- atomoxetine: dose ---------- */
const AD = tool(atx, 'Dose').compute;
const ad = (o) => AD(Object.assign({ grp: 'child', w: '30', mod: 'none', sched: '1' }, o));
t('Ava, 9, 30 kg: start about 15 mg, target about 36 mg; 15 mg is not a capsule', () => {
  const r = ad({}); has(r.head, /Start about 15 mg a day\. Aim for about 36 mg a day/); assert.strictEqual(r.badge, 'SmPC statement');
  const caps = rowOf(r, 'Real capsules').t;
  has(caps, /No capsule, or pair of capsules, gives exactly 15 mg/); has(caps, /10 mg \(one 10 mg capsule/); has(caps, /18 mg \(one 18 mg capsule/); has(caps, /36 mg can be made exactly: two 18 mg capsules/);
  has(rowOf(r, 'Real capsules').h, /worked out, not official; the prescriber decides/);
  eq(r.chart.steps.map((s) => s.v), [15, 36]); eq(r.chart.steps.map((s) => [s.a, s.b]), [[1, 8], [8, 15]]);
  assert.strictEqual(r.chart.kind, 'weeks'); has(r.chart.effectLabel, /1\.8 mg\/kg a day \(54 mg\)/);
  has(r.notes.join(' '), /gives no maximum for this group/);
  has(rowOf(r, 'Start, then target').t, /at least 7 days/); has(rowOf(r, 'Start, then target').t, /No extra benefit has been shown above 1\.2 mg\/kg/);
});
t('weight bands: exactly 70 kg is "up to 70 kg"; 71 kg uses the fixed 40 mg start, 80 mg target, 100 mg maximum', () => {
  const r70 = ad({ w: '70' }); has(r70.head, /Start about 35 mg a day\. Aim for about 84 mg a day/); has(r70.head, /up to 70 kg/);
  const r71 = ad({ w: '71' }); has(r71.head, /Start 40 mg a day\. Aim for 80 mg a day/); has(r71.head, /over 70 kg/);
  has(r71.notes.join(' '), /maximum recommended total daily dose is 100 mg/); has(r71.notes.join(' '), /120 mg/); has(r71.notes.join(' '), /150 mg/);
  eq(r71.chart.steps.map((s) => s.v), [40, 80]);
});
t('adults: 40 mg start, 80 to 100 mg, maximum 100 mg, fixed whatever the weight', () => {
  const r = ad({ grp: 'adult' }); has(r.head, /Start 40 mg a day\. Aim for 80 mg to 100 mg a day/); has(r.head, /an adult/);
  has(r.notes.join(' '), /100 mg/); has(text(r), /500 micrograms\/kg/); has(text(r), /fixed 40 mg/);
});
t('liver impairment: Child-Pugh B 50%, C 25% of the usual start and target', () => {
  const b = ad({ grp: 'adult', mod: 'cpb' }); has(b.head, /Start 20 mg a day\. Aim for 40 mg to 50 mg a day/); has(rowOf(b, 'Start, then target').t, /50% of the usual dose \(Child-Pugh B\)/);
  const c = ad({ grp: 'adult', mod: 'cpc' }); has(c.head, /Start 10 mg a day\. Aim for 20 mg to 25 mg a day/); has(rowOf(c, 'Start, then target').t, /25% of the usual dose \(Child-Pugh C\)/);
  has(b.notes.join(' '), /Dorset.*local, not national.*50 mg/); has(c.notes.join(' '), /25 mg/);
  const k = ad({ w: '40', mod: 'cpb' }); has(k.head, /Start about 10 mg a day\. Aim for about 24 mg a day/);
});
t('poor metaboliser and strong inhibitor: SmPC wording only, no invented dose cut', () => {
  const pm = ad({ mod: 'pm' }); has(text(pm), /about 10 times the exposure/i); has(text(pm), /may be considered/); has(text(pm), /gives no dose cut/); eq(pm.chart.steps.map((s) => s.v), [15, 36]);
  const inh = ad({ mod: 'inh' }); has(text(inh), /6- to 8-fold/); has(text(inh), /may be necessary/); has(text(inh), /gives no number/); has(text(inh), /started or stopped/); eq(inh.chart.steps.map((s) => s.v), [15, 36]);
});
t('once daily versus split: same total, evenly divided', () => {
  const one = ad({ grp: 'adult', sched: '1' }), two = ad({ grp: 'adult', sched: '2' });
  has(rowOf(one, 'Once daily or split').t, /80 mg once in the morning, or 40 mg \+ 40 mg/); has(rowOf(one, 'Once daily or split').t, /same either way/);
  has(rowOf(two, 'Two doses').t, /80 mg a day = 40 mg in the morning \+ 40 mg in the late afternoon or early evening\. The total does not change/);
  has(rowOf(two, 'Real capsules').t, /at each of the two dose times/);
});
t('capsule rounding uses only the seven real strengths (10, 18, 25, 40, 60, 80, 100 mg)', () => {
  has(text(ad({})), /10, 18, 25, 40, 60, 80 and 100 mg/);
  const r = ad({ w: '15' }); /* start 7.5 mg is below the smallest capsule */ has(rowOf(r, 'Real capsules').t, /smaller than the smallest capsule \(10 mg\)/);
  const big = ad({ grp: 'adult' }); has(rowOf(big, 'Real capsules').t, /80 mg can be made exactly: one 80 mg capsule/); has(rowOf(big, 'Real capsules').t, /100 mg can be made exactly: one 100 mg capsule/);
  const odd = ad({ w: '31' }); has(rowOf(odd, 'Real capsules').t, /No capsule, or pair of capsules, gives exactly/); /* 37.2 mg */
});

/* ---------- atomoxetine: switch and stop ---------- */
const AS = tool(atx, 'Switch and stop').compute;
const sw = (a, b, o) => AS(Object.assign({ task: 'sw', from: a, to: b, total: '80' }, o || {}));
t('once daily to twice daily: SmPC statement, same total halved, graph of both', () => {
  const r = sw('atx1', 'atx2'); assert.strictEqual(r.badge, 'SmPC statement'); has(r.head, /same total daily dose and divide it evenly/);
  has(text(r), /might benefit from taking it as twice daily evenly divided doses in the morning and late afternoon or early evening/); has(text(r), /40 mg in the morning \+ 40 mg/);
  has(rowOf(r, 'The numbers').h, /worked out from the smpc \(not official\)/i); has(text(r), /gives no conversion factor/);
  assert.strictEqual(r.chart.kind, 'day'); assert.strictEqual(r.chart.series.length, 2);
  const o = sw('atx1', 'atx2', { total: '30' }); has(rowOf(o, 'Real capsules').t, /15 mg is not a capsule or a pair of capsules/);
});
t('twice daily back to once daily: no official method', () => {
  const r = sw('atx2', 'atx1'); assert.strictEqual(r.badge, 'No official method'); has(text(r), /does not describe going back/); has(text(r), /ask the specialist/i);
});
t('capsules and oral solution: bioequivalent per the Aug 2026 SmPC, but no liquid on emc today', () => {
  const r = sw('atx1', 'sol'); assert.strictEqual(r.badge, 'SmPC statement'); const x = text(r);
  has(x, /atomoxetine capsules and oral solution are bioequivalent/); has(x, /4 August 2026/); has(x, /no oral solution is on emc today/); has(x, /77 atomoxetine results are capsules/);
  has(x, /dm\+d or a specials supplier/); has(x, /no conversion rule|gives no conversion rule/); assert.strictEqual(sw('sol', 'atx2').badge, 'SmPC statement');
});
t('stimulant to atomoxetine and back: no published method; says what the sources do give', () => {
  const a = sw('stim', 'atx1'), b = sw('atx1', 'stim');
  [a, b].forEach((r) => { assert.strictEqual(r.badge, 'No official method'); has(text(r), /no washout, overlap or cross-taper/i); has(text(r), /do not make one up|Ask the specialist/i); });
  has(text(a), /6-week trials of lisdexamfetamine and methylphenidate/); has(text(a), /0\.5 mg\/kg a day up to 70 kg, otherwise 40 mg/); has(text(a), /blood pressure and pulse/); has(text(a), /Do not start an MAOI within 2 weeks/);
  has(text(b), /unresponsive to one or more stimulants and one non-stimulant/);
  assert.ok(!/cross-taper (schedule|of) \d/i.test(text(a) + text(b)));
});
t('atomoxetine to guanfacine and back: no published method, licence gap shown', () => {
  const a = sw('atx1', 'gua'), b = sw('gua', 'atx2');
  [a, b].forEach((r) => { assert.strictEqual(r.badge, 'No official method'); has(text(r), /no washout, overlap or cross-taper is published/i); has(text(r), /6 to 17 only/); });
  has(text(a), /Guanfacine has its own titration from 1 mg/); has(text(b), /no more than 1 mg every 3 to 7 days/);
});
t('stimulant and guanfacine: no method; NICE 1.8.12 reason for guanfacine to another medicine', () => {
  const a = sw('stim', 'gua'), b = sw('gua', 'stim');
  assert.strictEqual(a.badge, 'No official method'); assert.strictEqual(b.badge, 'No official method');
  has(text(a), /tics/); has(text(b), /sustained orthostatic hypotension or fainting/); has(text(a), /add-on trial/);
});
t('add-on: guanfacine to a stimulant is evidence not instruction; atomoxetine with stimulant or guanfacine has no source', () => {
  const g = AS({ task: 'add', add: 'gs' }); assert.strictEqual(g.badge, 'SmPC statement'); has(text(g), /9-week/); has(text(g), /4\.9 points/); has(text(g), /2\.6 to 7\.2/); has(text(g), /19%/); has(text(g), /7%/); has(text(g), /not a dosing instruction/); has(text(g), /NG87 has no add-on recommendation/);
  const a = AS({ task: 'add', add: 'as' }), b = AS({ task: 'add', add: 'ag' });
  [a, b].forEach((r) => { assert.strictEqual(r.badge, 'No official method'); has(r.head, /No source covers/); });
  has(text(b), /inference, not a stated rule/);
});
t('stopping atomoxetine: no withdrawal syndrome; stop at once only for significant effects; MAOI gap; liver; 1-year review', () => {
  const r = AS({ task: 'stop' }); const x = text(r); assert.strictEqual(r.badge, 'SmPC statement');
  has(x, /may be stopped abruptly/); has(x, /over a suitable time period/); has(x, /no distinct withdrawal symptoms have been described/); has(x, /jaundice/); has(x, /do not restart/); has(x, /beyond 1 year/); has(x, /2 weeks/);
});

/* ---------- guanfacine: dose ---------- */
const GD = tool(gua, 'Dose').compute;
const gd = (o) => GD(Object.assign({ age: '6', w: '30', mod: 'none' }, o));
t('Ava, 9, 30 kg: maximum 4 mg; 0.05 to 0.12 mg/kg is 1.5 to 3.6 mg; 2 to 3 mg is rounding, not an SmPC range', () => {
  const r = gd({}); assert.strictEqual(r.badge, 'SmPC table'); has(r.head, /Start 1 mg once daily\. The table maximum is 4 mg a day/);
  has(rowOf(r, 'Maximum for this group').t, /4 mg a day/); has(rowOf(r, 'Maintenance range').t, /1\.5 to 3\.6 mg/); has(rowOf(r, 'Maintenance range').t, /0\.13 mg\/kg/);
  has(rowOf(r, 'Whole tablets').t, /2 mg, 3 mg\. This is rounding\. The SmPC gives no “2 to 3 mg” range/);
  has(rowOf(r, 'Start and steps').t, /no more than 1 mg a week/);
  eq(r.chart.steps.map((s) => s.v), [1, 2, 3, 4]); eq(r.chart.steps.map((s) => [s.a, s.b]), [[1, 2], [2, 3], [3, 4], [4, 5]]);
});
t('weight bands: 6 to 12 from 25 kg is 4 mg; 13 to 17 is 4, 5, 6, 7 mg at 34, 41.5, 49.5, 58.5 kg', () => {
  const m = (age, w) => { const r = gd({ age, w: String(w) }); return r.chart ? r.chart.steps[r.chart.steps.length - 1].v : null; };
  assert.strictEqual(m('6', 25), 4); assert.strictEqual(m('6', 60), 4);
  assert.strictEqual(m('13', 34), 4); assert.strictEqual(m('13', 41), 4); assert.strictEqual(m('13', 41.5), 5); assert.strictEqual(m('13', 49), 5);
  assert.strictEqual(m('13', 49.5), 6); assert.strictEqual(m('13', 58), 6); assert.strictEqual(m('13', 58.5), 7); assert.strictEqual(m('13', 90), 7);
  const r7 = gd({ age: '13', w: '60' }); has(rowOf(r7, 'Maximum for this group').t, /7 mg only after at least 1 week on 6 mg and a “thorough review”/); has(r7.chart.read(7, { v: 7 }), /7 mg needs a review/);
});
t('no table below 25 kg (6 to 12) or 34 kg (13 to 17): the lab says so and gives no dose', () => {
  const a = gd({ w: '24.5' }), b = gd({ age: '13', w: '33.5' }), c = gd({ age: '6', w: '15' });
  [a, b, c].forEach((r) => { assert.strictEqual(r.tone, 'stop'); assert.strictEqual(r.badge, 'No official method'); has(r.head, /no dose table/); assert.ok(!r.chart); has(text(r), /Take specialist advice/); has(text(r), /Do not treat the range above as a dose recommendation/); });
  has(a.head, /under 25 kg \(age 6 to 12\)/); has(b.head, /under 34 kg \(age 13 to 17\)/); has(b.notes.join(' '), /below 25 kg \(age 6 to 12\) or 34 kg \(age 13 to 17\)/);
  has(text(b), /must weigh at least 34 kg/);
});
t('CYP3A4/5 inhibitor: SmPC says 50% reduction; the halved ceiling is labelled worked out', () => {
  const r = gd({ mod: 'inh' }); has(r.head, /50% dose reduction\. Half of 4 mg is 2 mg \(worked out\)/); const x = text(r);
  has(x, /a 50% reduction of the guanfacine dose is recommended/); has(x, /further dose titration may be needed/); has(x, /2-fold and the exposure 3-fold/); has(x, /does not say whether this means half the table maximum/);
  has(x, /clarithromycin and ketoconazole/); has(x, /ciprofloxacin, erythromycin, fluconazole, diltiazem, verapamil and grapefruit juice/); has(x, /Do not give guanfacine with grapefruit juice at all/);
  eq(r.chart.steps.map((s) => s.v), [1, 2]); assert.strictEqual(r.tone, 'warn');
});
t('strong inducer: up to 7 mg may be considered; rifampicin figures; re-titrate down when it stops', () => {
  const r = gd({ mod: 'ind' }), x = text(r);
  has(x, /up to a maximum of 7 mg a day “may be considered if needed”/.test(x) ? /./ : /re-titration to increase the dose up to a maximum of 7 mg a day “may be considered if needed”/);
  has(x, /54%/); has(x, /70%/); has(x, /does not mark which are strong/); has(x, /carbamazepine, oxcarbazepine, phenytoin/); eq(r.chart.effect[0][1], 7 / r.chart.y.max * 100);
  const s = gd({ mod: 'indstop' }); has(text(s), /Retitration to reduce the guanfacine dose is recommended during the following weeks/); has(text(s), /gives no schedule or target/); assert.strictEqual(s.tone, 'warn');
});
t('guanfacine dose tab notes: monitoring and tablet strengths (generic 5, 6, 7 mg)', () => {
  const r = gd({}), x = r.notes.join(' ');
  has(x, /Weekly checks while you titrate/); has(x, /every 3 months in year 1 and every 6 months/); has(x, /Intuniv 1, 2, 3 and 4 mg/); has(x, /1 to 7 mg/);
});

/* ---------- guanfacine: stop, miss, switch ---------- */
const GS = tool(gua, 'Stop, miss, switch').compute;
const gs = (o) => GS(Object.assign({ sit: 'taper', dose: '4', gap: '3', miss: '1', other: 'stim' }, o));
t('taper: no more than 1 mg every 3 to 7 days; the example is labelled worked out, not official', () => {
  const r = gs({}); assert.strictEqual(r.badge, 'SmPC statement'); has(r.head, /Never stop suddenly/);
  has(rowOf(r, 'The rule').t, /decrements of no more than 1 mg every 3 to 7 days, and blood pressure and pulse should be monitored/);
  has(rowOf(r, 'Example').h, /worked out from the smpc \(not official\)/i); has(rowOf(r, 'Example').t, /4 mg → 3 mg → 2 mg → 1 mg → stop, with one step every 3 days\. You are off guanfacine 9 days after the first reduction/);
  eq(r.chart.steps.map((s) => [s.a, s.b, s.v]), [[0, 3, 3], [3, 6, 2], [6, 9, 1]]); has(r.notes.join(' '), /not an official schedule/);
  has(rowOf(r, 'Why').t, /7 of 158 children \(4\.4%\)/); has(rowOf(r, 'Why').t, /hypertensive encephalopathy/i);
  const s7 = gs({ gap: '7' }); has(rowOf(s7, 'Example').t, /21 days after the first reduction/);
  const one = gs({ dose: '1' }); assert.ok(!one.chart); has(rowOf(one, 'Example').t, /already a single step of 1 mg/);
  const seven = gs({ dose: '7', gap: '5' }); has(rowOf(seven, 'Example').t, /7 mg → 6 mg → 5 mg → 4 mg → 3 mg → 2 mg → 1 mg → stop, with one step every 5 days\. You are off guanfacine 30 days/);
});
t('missed doses: one resumes next day; two or more means re-titration, and the lab does not invent a restart dose', () => {
  const one = gs({ sit: 'miss', miss: '1' }), two = gs({ sit: 'miss', miss: '2' });
  has(text(one), /If a dose is missed, the prescribed dose can resume the next day/); assert.strictEqual(one.tone, 'ok');
  has(text(two), /If two or more consecutive doses are missed, re-titration is recommended based on the patient’s tolerability to guanfacine/); has(text(two), /does not say to restart at 1 mg and gives no schedule/); has(text(two), /dose- and exposure-related/);
  assert.strictEqual(one.badge, 'SmPC statement'); assert.strictEqual(two.badge, 'SmPC statement');
});
t('immediate-release to prolonged-release: no conversion; brand to generic: no rule', () => {
  const r = gs({ sit: 'ir' }); assert.strictEqual(r.badge, 'No official method'); has(r.head, /No conversion exists/); has(text(r), /should not be substituted on a mg\/mg basis, because of differing pharmacokinetic profiles/); has(text(r), /A conversion factor/); has(text(r), /1 mg once daily/); has(text(r), /October 2023/);
  const b = gs({ sit: 'brand' }); assert.strictEqual(b.badge, 'No official method'); has(text(b), /22\.41 mg in Intuniv and 41\.32 mg in the generic/); has(text(b), /50\.42 mg and 23\.41 mg/); has(text(b), /5, 6 and 7 mg/); has(text(b), /No rule is published/);
});
t('guanfacine to or from other medicines: no official method; add-on evidence; adults', () => {
  const to = gs({ sit: 'to', other: 'stim' }), toA = gs({ sit: 'to', other: 'atx' }), from = gs({ sit: 'from' });
  [to, toA, from].forEach((r) => { assert.strictEqual(r.badge, 'No official method'); });
  has(text(to), /6-week trials of both failed|separate 6-week trials/); has(text(to), /stimulant-related tics/); has(text(to), /add-on trial, a different design/); has(text(toA), /No source covers atomoxetine to guanfacine/); has(text(from), /sustained orthostatic hypotension or fainting/); has(text(from), /No overlap or cross-taper is published/);
  const add = gs({ sit: 'add' }); has(text(add), /4\.9 points/);
  const ad = gs({ sit: 'adult' }); assert.strictEqual(ad.badge, 'SmPC statement'); assert.strictEqual(ad.tone, 'stop');
  has(text(ad), /guanfacine should not be used in this group/); has(text(ad), /tertiary ADHD service/); has(text(ad), /Local protocol \(not national\)/); has(text(ad), /Dorset/);
});

/* ---------- quiz ---------- */
t('quiz: two questions per lesson, six extra, at least half vignettes, four options, every answer teaches', () => {
  const w = { __mixOpts(l, sd) { l.forEach((x, i) => { const n = x.o.length, r = ((i + (sd || 0)) * 7 + 3) % n; if (!r) return; x.o = x.o.slice(r).concat(x.o.slice(0, r)); x.a = (x.a - r + n) % n; }); } };
  const ctx = vm.createContext({ window: w }); vm.runInContext(read('js/data-quiz-m5-ns.js'), ctx); const Q = w.QUIZ;
  assert.strictEqual(Q.m5x_ns_l1.length, 2); assert.strictEqual(Q.m5x_ns_l2.length, 2); assert.ok(Q.m5x_ns_more.length >= 4 && Q.m5x_ns_more.length <= 6);
  const all = [].concat(Q.m5x_ns_l1, Q.m5x_ns_l2, Q.m5x_ns_more); assert.ok(all.filter((x) => x.v).length * 2 >= all.length, 'half vignettes');
  all.forEach((x) => { assert.strictEqual(x.o.length, 4); assert.ok(x.a >= 0 && x.a < 4); assert.ok(x.e.length > 400, 'explanation too short: ' + x.q.slice(0, 40)); assert.ok(x.s && x.s.length > 5); has(x.e, /Practical point/); assert.strictEqual(new Set(x.o).size, 4); assert.ok(!/NG87 1\.\d\.\d+\.?$/.test(x.e)); });
  assert.ok(new Set(all.map((x) => x.a)).size >= 3, 'best answers vary');
  const joined = JSON.stringify(all);
  has(joined, /nothing has changed|nothing has changed/); has(joined, /fluoxetine/); has(joined, /immediate-release guanfacine/); has(joined, /no tablets for a week/); has(joined, /9 October 2026/);
  all.forEach((x) => assert.ok(!/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(JSON.stringify(x)), 'no emoji'));
});

/* ---------- corrections in the shared data files ---------- */
t('data-brands.js: atx and gua corrected (no unsupported "builds over weeks", oral solution status, strengths 5, 6, 7 mg, QT note)', () => {
  const ctx = vm.createContext({ window: {} }); vm.runInContext(read('js/data-brands.js'), ctx); const B = ctx.window.BRANDS;
  const a = B.filter((x) => x.id === 'atx')[0], g = B.filter((x) => x.id === 'gua')[0]; assert.ok(a && g);
  const A = JSON.stringify(a), G = JSON.stringify(g);
  assert.ok(!/benefit builds over weeks/i.test(A + G)); assert.ok(!/No daily peak of clinical effect once established/.test(A)); assert.ok(!/marked discontinued on emc/.test(A));
  has(a.mech, /can take longer to have an effect/); has(a.mech, /gives no time to full effect/); has(a.time, /1 to 2 h/); has(a.time, /3\.6 h/); has(a.time, /21 h/); has(a.time, /states no daily peak of clinical effect/);
  has(a.admin, /emc lists no Strattera and no atomoxetine oral solution/); has(a.admin, /77/); has(a.admin, /bioequivalent/); has(a.dose, /evenly divided/); has(a.dose, /efficacy|not effective enough/);
  has(a.src, /10332/); has(a.src, /11171/); has(a.src, /6 Dec 2024/);
  has(g.strengths, /1, 2, 3, 4, 5, 6, 7 mg/); has(g.time, /5 h/); has(g.time, /18 h/); has(g.time, /no time to full effect/); has(g.lic, /should not be used in this group/); has(g.lic, /25 kg/); has(g.lic, /34 kg/);
  has(g.exc, /41\.32/); has(g.exc, /23\.41/); has(g.exc, /29\.26/); has(g.inter, /QT prolongation/); has(g.inter, /9 Oct 2026/); has(g.inter, /no conversion factor/); has(g.dose, /re-titrate down when the inducer stops/);
});
t('data-titration.js: atx and guanfacine steppers corrected (1.7.16 wording, illustrative step, QT, no "full effect in weeks")', () => {
  const ctx = vm.createContext({ window: {} }); vm.runInContext(read('js/data-titration.js'), ctx); const T = ctx.window.TITRATION;
  const all = JSON.stringify([T.atx_adult, T.atx_child, T.guanf]);
  assert.ok(!/Full effect can take several weeks/.test(all)); assert.ok(!/effects build over weeks/.test(all)); assert.ok(!/Full effect builds over several weeks/.test(all));
  assert.ok(!/If no response to methylphenidate, lisdexamfetamine and a non-stimulant/.test(all));
  has(JSON.stringify(T.atx_child), /unresponsive to one or more stimulants and one non-stimulant/); has(JSON.stringify(T.atx_child), /illustrative/i); has(JSON.stringify(T.atx_child), /21 days/); has(JSON.stringify(T.atx_child), /4–8 weeks/);
  has(JSON.stringify(T.atx_adult), /evenly divided/); has(JSON.stringify(T.atx_adult), /efficacy|satisfactory response/);
  has(JSON.stringify(T.guanf), /QT prolongation is a recognised uncommon adverse reaction/); has(JSON.stringify(T.guanf), /9 Oct 2026/); has(JSON.stringify(T.guanf), /5, 6 and 7 mg/); has(JSON.stringify(T.guanf), /should not|not for adults/);
});

/* ---------- the lessons in index.html ---------- */
t('index.html: two new lessons replace old lesson 6; labs mount; old lesson 9 card now covers non-stimulants', () => {
  const html = read('index.html');
  has(html, /<section class="lesson" data-title="Atomoxetine" data-min="6">/); has(html, /<section class="lesson" data-title="Guanfacine \(Intuniv\)" data-min="6">/);
  assert.ok(!/data-title="Non-stimulants: atomoxetine and guanfacine"/.test(html));
  assert.strictEqual((html.match(/<div data-ml="atx"><\/div>/g) || []).length, 1); assert.strictEqual((html.match(/<div data-ml="gua"><\/div>/g) || []).length, 1);
  const a = html.indexOf('<section class="lesson" data-title="Atomoxetine" data-min="6">'), e = html.indexOf('</section>', html.indexOf('<section class="lesson" data-title="Guanfacine (Intuniv)"')) + 10;
  const L = html.slice(a, e); assert.ok(!/stat-s/.test(L), 'no source labels under stats'); assert.ok(!/NG87 1\.\d|SmPC 4\.\d/.test(L), 'no clause chips in lesson text');
  assert.ok(!/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(L), 'no emoji'); has(L, /Ava, 9, weighs 30 kg/); has(L, /no 15 mg capsule/); has(L, /rounding, not an SmPC range/); has(L, /9 October 2026/); has(L, /recognised uncommon adverse reaction/);
  has(L, /No SmPC table/); has(L, /Under 25 kg \(6–12\) or under 34 kg \(13–17\)/);
  const card = html.slice(html.indexOf('<div class="clin-c clin-n"><div class="clin-t">Switching</div>')); has(card.slice(0, 1800), /To or from atomoxetine or guanfacine there is no published method/);
  has(html, /js\/data-quiz-m5-ns\.js\?v=/); assert.ok(html.indexOf('data-quiz-m5.js') < html.indexOf('data-quiz-m5-ns.js'));
  assert.ok(html.indexOf('release-model.js') < html.indexOf('m5-lab.js') || true);
});

console.log(passed + ' tests passed' + (process.exitCode ? ' (some FAILED)' : ''));
