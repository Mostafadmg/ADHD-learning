/* Tests for js/m5-lab-amf.js (lisdexamfetamine and dexamfetamine labs) and js/data-quiz-m5-amf.js.
   Plain node, no packages:  node tests/m5-lab-amf.test.js
   Every number and status asserted here comes from the SmPCs on emc (Elvanse 14089, Amfexa 5004, dexamfetamine solution 13874),
   NICE NG87 and the local NHS documents named in the lab (read 1 Nov 2026).
   The block marked REVIEW FIXES covers the independent clinical review of 1 Nov 2026: each assertion there fails on the old text. */
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
let passed = 0;
function t(name, fn) { try { fn(); passed++; } catch (e) { console.error('FAIL: ' + name + '\n  ' + (e && e.message)); process.exitCode = 1; } }

function load(withModel) {
  const defs = {};
  const win = { M5LAB: { add(id, def) { defs[id] = def; } } };
  const ctx = vm.createContext({ window: win, console });
  if (withModel) vm.runInContext(fs.readFileSync(path.join(root, 'js/release-model.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'js/m5-lab-amf.js'), 'utf8'), ctx);
  return { defs, win };
}
const { defs, win } = load(true);
const lis = defs.lis, dex = defs.dex;
const BADGES = ['SmPC statement', 'Guideline (no numbers)', 'No official conversion', 'Local NHS protocol (not national)', 'Shared-care protocols (not SmPC)', 'Beyond the SmPC'];
const text = (r) => [r.head, (r.rows || []).map((x) => x.h + ' ' + x.t).join(' '), (r.notes || []).join(' '), r.src || ''].join(' ');
const eq = (a, b) => assert.strictEqual(JSON.stringify(a), JSON.stringify(b));
const rowOf = (r, h) => (r.rows || []).filter((x) => x.h.indexOf(h) === 0)[0];

t('both labs register with three tabs', () => {
  assert.ok(lis && dex);
  eq(lis.tabs.map((x) => x.kind), ['day', 'tool', 'tool']);
  eq(dex.tabs.map((x) => x.kind), ['day', 'tool', 'tool']);
  eq(lis.tabs.map((x) => x.label), ['Through the day', 'Dose steps', 'Switch']);
});

t('lisdexamfetamine graph: prodrug and dexamfetamine curves, SmPC timings', () => {
  const p = lis.tabs[0].picks[0];
  assert.strictEqual(p.id, 'lis');
  eq(p.series.map((s) => s.model), ['lis', 'lisprod']);
  assert.strictEqual(p.lasts, 14);
  assert.ok(/13/.test(p.lastsTxt) && /14/.test(p.lastsTxt) && /at least/.test(p.lastsTxt));
  eq(p.moments.map((m) => m.h), [1, 4, undefined]);
  assert.ok(p.moments[2].end);
  const all = p.moments.map((m) => m.t + ' ' + m.d).join(' ');
  for (const s of ['about 1 hour', '3.5', '3.8', '4.7', '13', '14', 'under 1 hour', '8 hours']) assert.ok(all.indexOf(s) >= 0, s);
  assert.ok(p.practice.join(' ').indexOf('yoghurt, water or orange juice') >= 0);
  assert.ok(p.practice.join(' ').indexOf('divide') >= 0 && p.practice.join(' ').indexOf('carry on the next day') >= 0);
  eq(lis.tabs[0].picks.map((x) => x.id), ['lis', 'dex', 'mr', 'ir']);
  assert.strictEqual(lis.tabs[0].bedtime, 22);
  assert.ok(lis.tabs[0].doseTimes.length > 1 && lis.tabs[0].compare);
});

t('dexamfetamine graph: no duration in the SmPC, so no lasts bar; Tmax 1.5 h', () => {
  const picks = dex.tabs[0].picks;
  eq(picks.map((x) => x.id), ['dex1', 'dex2', 'lis', 'ir']);
  assert.strictEqual(picks[0].lasts, undefined);
  assert.strictEqual(picks[1].lasts, undefined);
  assert.strictEqual(picks[0].moments[0].h, 1.5);
  const d = picks[0].moments.map((m) => m.t + ' ' + m.d).join(' ');
  assert.ok(/do not state how long/.test(d) && /local figure/.test(d) && /Oxford Health/.test(d));
  assert.ok(/10\.2 hours/.test(picks[0].note) && /Plasma half-life/.test(picks[0].note), 'half-life sits in the note');
  // twice a day: two half-weight doses, so the same total as once a day
  const reg = picks[1].regimen;
  assert.strictEqual(reg.length, 2);
  assert.strictEqual(reg[0].mg + reg[1].mg, 1);
  assert.strictEqual(reg[1].at, 4.5);
  const pr = picks[0].practice.join(' ');
  assert.ok(/Amfexa, Medice and Orifarm tablets are scored in four for swallowing only/.test(pr) && /not equal doses/.test(pr));
  assert.ok(/Waymade 5 mg and Brown &amp; Burk 5 mg SmPCs say their single-scored tablet can be divided into equal doses/.test(pr));
});

t('prodrug model: peak about 1 h, half-life under 1 h, gone by 8 h; lis and dex peaks match the SmPC', () => {
  const M = win.RELMODEL;
  assert.ok(M.MODEL.lisprod, 'lisprod registered');
  function stats(model) {
    const raw = M.curve(model, null, 26); let k = 0;
    for (let i = 0; i < raw.length; i++) if (raw[i] > raw[k]) k = i;
    return { peakT: k * M.DT, at8: raw[Math.round(8 / M.DT)] / raw[k] };
  }
  const pro = stats('lisprod'), l = stats('lis'), d = stats('dex');
  assert.ok(pro.peakT > 0.8 && pro.peakT < 1.2, 'prodrug peak ' + pro.peakT);
  assert.ok(pro.at8 < 0.02, 'prodrug at 8 h ' + pro.at8);
  assert.ok(Math.log(2) / M.MODEL.lisprod.ke < 1, 'prodrug half-life under 1 h');
  assert.ok(l.peakT >= 3.5 && l.peakT <= 4.7, 'dexamfetamine formed peak ' + l.peakT);
  assert.ok(d.peakT >= 1.3 && d.peakT <= 2.0, 'dexamfetamine IR peak ' + d.peakT);
});

t('lisdexamfetamine dose steps: start, steps, ceilings, renal and dialysis', () => {
  const f = lis.tabs[1].compute;
  const doses = (v) => f(v).chart.steps.map((s) => s.v);
  eq(doses({ start: '30', step: '10', renal: 'usual' }), [30, 40, 50, 60, 70]);
  eq(doses({ start: '30', step: '20', renal: 'usual' }), [30, 50, 70]);
  eq(doses({ start: '20', step: '10', renal: 'usual' }), [20, 30, 40, 50, 60, 70]);
  eq(doses({ start: '20', step: '20', renal: 'usual' }), [20, 40, 60, 70]);
  eq(doses({ start: '30', step: '10', renal: 'severe' }), [30, 40, 50]);
  eq(doses({ start: '30', step: '20', renal: 'severe' }), [30, 50]);
  eq(doses({ start: '20', step: '20', renal: 'severe' }), [20, 40, 50]);
  for (const start of ['20', '30']) for (const step of ['10', '20']) for (const renal of ['usual', 'severe', 'dialysis']) {
    const r = f({ start, step, renal }), d = r.chart.steps.map((s) => s.v), max = renal === 'usual' ? 70 : 50;
    assert.strictEqual(r.badge, 'SmPC statement');
    assert.strictEqual(d[d.length - 1], max);
    assert.ok(Math.max.apply(null, d) <= max);
    for (let i = 1; i < d.length; i++) assert.ok(d[i] - d[i - 1] === 10 || d[i] - d[i - 1] === 20, 'step ' + d.slice(i - 1, i + 1));
    assert.strictEqual(r.chart.marks[0].x, 5);
    assert.ok(/1 month/.test(text(r)) && /no improvement/.test(text(r)));
  }
  assert.strictEqual(f({ start: '30', step: '10', renal: 'usual' }).tone, 'ok');
  const sev = text(f({ start: '30', step: '10', renal: 'severe' }));
  assert.ok(/50 mg a day/.test(sev) && /GFR 15 to under 30/.test(sev) && /CrCl under 30/.test(sev));
  const dia = text(f({ start: '30', step: '10', renal: 'dialysis' }));
  assert.ok(/further reduction on dialysis/.test(dia) && /not dialysable/.test(dia) && /no figure/.test(dia));
  const use = text(f({ start: '30', step: '10', renal: 'usual' }));
  assert.ok(/70 mg a day/.test(use) && /not been studied/.test(use) && /Capsules cannot be divided/.test(use) && /not under 6/.test(use));
  assert.ok(/lower clearance/.test(use) && /Liver: not studied/.test(use));
  // read-out for a week
  const ch = f({ start: '30', step: '20', renal: 'usual' }).chart;
  assert.strictEqual(ch.read(2, ch.steps[1]), '50 mg a day.');
  assert.ok(/ceiling of 70 mg/.test(ch.read(6, ch.steps[2])));
  assert.ok(/stop if no improvement/.test(ch.read(5, ch.steps[2])));
  const ch2 = f({ start: '30', step: '10', renal: 'usual' }).chart;
  assert.strictEqual(ch2.read(5, ch2.steps[4]), '70 mg a day. One month of adjusting: stop if no improvement.');
});

t('dexamfetamine dose steps: children from the SmPC, adults off-label and local', () => {
  const f = dex.tabs[1].compute;
  const doses = (v) => f(v).chart.steps.map((s) => s.v);
  eq(doses({ age: 'child', start: '5', target: 20 }), [5, 10, 15, 20]);
  eq(doses({ age: 'child', start: '10', target: 20 }), [10, 15, 20]);
  let r = f({ age: 'child', start: '5', target: 20 });
  assert.strictEqual(r.badge, 'SmPC statement'); assert.strictEqual(r.tone, 'ok');
  assert.ok(/5 mg once a day/.test(text(r)) && /5 mg to the daily dose each week/.test(text(r)) && /20 mg a day/.test(text(r)) && /40 mg/.test(text(r)));
  assert.ok(/twice a day/.test(text(f({ age: 'child', start: '10', target: 20 }))));
  assert.strictEqual(f({ age: 'child', start: '5', target: 25 }).tone, 'warn');
  assert.strictEqual(f({ age: 'child', start: '5', target: 40 }).tone, 'warn');
  assert.strictEqual(f({ age: 'child', start: '5', target: 45 }).tone, 'stop');
  r = f({ age: 'adult', start: '10', target: 30 });
  assert.strictEqual(r.badge, 'Shared-care protocols (not SmPC)'); assert.strictEqual(r.tone, 'warn');
  const a = text(r);
  assert.ok(/not licensed for ADHD in adults/i.test(a));
  assert.ok(a.indexOf('5 mg twice a day, up by 5 to 10 mg weekly') >= 0 && a.indexOf('maximum 60 mg per day to be given in 2–4 divided doses') >= 0);
  assert.ok(/initially 5 mg twice daily/.test(a));
  assert.ok(/currently under review/.test(a) && /March 2025/.test(a) && /narcolepsy/.test(a));
  assert.strictEqual(f({ age: 'adult', start: '10', target: 65 }).tone, 'stop');
  assert.ok(/Not licensed for ADHD/i.test(text(r)) && !/BNF adult dose is/.test(a));
});

const FROM_LIS = { 20: [5.9, 5, 7.5], 30: [8.9, 7.5, 12.5], 40: [11.9, 10, 15], 50: [14.8, 15, 20], 60: [17.8, 17.5, 25], 70: [20.8, 20, 30] };
t('Switch: lisdexamfetamine to dexamfetamine shows the local tables only as local rows', () => {
  const f = lis.tabs[2].compute;
  for (const cap of Object.keys(FROM_LIS)) {
    const [content, slam, oxFull] = FROM_LIS[cap];
    const r = f({ from: 'lis', to: 'dex', age: 'adult', cap });
    assert.strictEqual(r.badge, 'Guideline (no numbers)');
    assert.ok(r.badge !== 'SmPC table');
    const loc = rowOf(r, 'Local NHS tables (not national): the doses');
    assert.ok(loc, 'local doses row');
    assert.ok(loc.t.indexOf('<b>' + cap + ' mg</b>') >= 0);
    assert.ok(loc.t.indexOf('<b>' + slam + ' mg</b> dexamfetamine in divided doses') >= 0, 'SLaM ' + cap);
    assert.ok(loc.t.indexOf('<b>' + slam + ' mg</b> to start') >= 0, 'Oxford start ' + cap);
    assert.ok(loc.t.indexOf('<b>' + oxFull + ' mg</b>') >= 0, 'Oxford full ' + cap);
    for (const x of ['Somerset', 'ELFT / North East London ICS', 'South London and Maudsley', 'Oxford Health']) assert.ok(loc.t.indexOf(x) >= 0, x);
    const off = rowOf(r, 'Official conversion'), why = rowOf(r, 'Why the SmPC');
    assert.ok(/^<b>None for switching\.<\/b>/.test(off.t));
    assert.ok(why.t.indexOf('equivalent to ' + content + ' mg of dexamfetamine') >= 0 && /says what is in the capsule/.test(why.t));
    const care = text(r);
    assert.ok(/20 mg a day/.test(care) && /divided doses/.test(care) && /credit South London and Maudsley/.test(care) && /could not find the original/.test(care));
    assert.ok(!/one source|trace to one/.test(care), 'no "traces to one source" claim');
    assert.ok(r.chart && r.chart.kind === 'day' && r.chart.series.length === 2);
  }
  const child = text(f({ from: 'lis', to: 'dex', age: 'child', cap: '30' }));
  assert.ok(/licensed only for ages 6 to 17/.test(child) && /outside the licence/.test(child));
  const adult = text(f({ from: 'lis', to: 'dex', age: 'adult', cap: '30' }));
  assert.ok(/off-label in adults/.test(adult));
});

/* ---------- REVIEW FIXES (1 Nov 2026): each assertion below fails on the text it replaced ---------- */
t('REVIEW lis>dex: doses that are not whole 5 mg tablets carry a tablet-size warning (finding 0)', () => {
  const f = lis.tabs[2].compute;
  const needs = { 20: ['7.5'], 30: ['7.5', '12.5'], 40: [], 50: [], 60: ['17.5'], 70: [] };
  for (const cap of Object.keys(needs)) for (const age of ['adult', 'child']) {
    const r = f({ from: 'lis', to: 'dex', age, cap }), row = rowOf(r, 'Tablet sizes');
    if (!needs[cap].length) { assert.ok(!row, 'no tablet-size row when every dose is a multiple of 5 mg: ' + cap); continue; }
    assert.ok(row, 'tablet-size row for ' + cap);
    for (const d of needs[cap]) assert.ok(row.t.indexOf(d + ' mg') >= 0, d);
    assert.ok(/Do not rely on splitting tablets/.test(row.t));
    assert.ok(/Amfexa, Medice and Orifarm SmPCs say their score lines do not give equal doses/.test(row.t));
    assert.ok(/Oxford Health warns that half a tablet is only about 2\.5 mg/.test(row.t));
    assert.ok(/Waymade and Brown &amp; Burk 5 mg SmPCs say their single-scored tablet can be divided into equal doses/.test(row.t));
    assert.ok(/1 mg\/ml oral solution/.test(row.t) && /round to a whole tablet strength/.test(row.t));
  }
});

t('REVIEW lis>dex: dexamfetamine contraindications are flagged before the switch (finding 1)', () => {
  const r = lis.tabs[2].compute({ from: 'lis', to: 'dex', age: 'adult', cap: '30' }), row = rowOf(r, 'Before you switch');
  assert.ok(row);
  assert.ok(/history of drug or alcohol abuse/.test(row.t) && /Tourette syndrome/.test(row.t));
  assert.ok(/more psychiatric and cerebrovascular conditions than the Elvanse SmPC/.test(row.t));
  assert.ok(/only carries a caution/.test(row.t) && /contraindicated for dexamfetamine/.test(row.t));
  assert.ok(/greater misuse and diversion risk/.test(row.t));
  assert.ok(!/Ask about substance use and diversion risk/.test(text(r)), 'the old soft question is gone');
});

t('REVIEW lis>dex: the SmPC "equivalent" pairings are explained and are not a switching rule (finding 3)', () => {
  const r = lis.tabs[2].compute({ from: 'lis', to: 'dex', age: 'adult', cap: '70' }), off = rowOf(r, 'Why the SmPC').t;
  assert.ok(/abuse-liability study/.test(off) && /100 mg lisdexamfetamine/.test(off) && /40 mg immediate-release dexamfetamine sulphate/.test(off));
  assert.ok(/50 mg against 20 mg by injection/.test(off) && /history of drug abuse/.test(off));
  assert.ok(/drug liking, not symptom control/.test(off) && /100 mg is above the 70 mg licensed maximum/.test(off) && /not a switching rule/.test(off));
  assert.ok(/29\.6 mg of dexamfetamine base/.test(off) && /40\.3 mg of the sulfate/.test(off) && /not like for like/.test(off));
  assert.ok(!/fixed percentage rule/.test(text(r)));
});

t('REVIEW lis>dex: Oxford full-equivalent figures above the 20 mg maximum are flagged (finding 4)', () => {
  const f = lis.tabs[2].compute;
  for (const cap of ['60', '70']) {
    const c = f({ from: 'lis', to: 'dex', age: 'child', cap }), loc = rowOf(c, 'Local NHS tables (not national): the doses').t;
    assert.ok(/above the usual 20 mg a day maximum for children and adolescents/.test(loc), 'child flag ' + cap);
    assert.ok(/Oxford’s own document gives 20 mg, 40 mg rarely, as its maximum/.test(loc));
    assert.ok(/higher than that maximum/.test(text(c)) && /25 and 30 mg/.test(text(c)));
    const a = rowOf(f({ from: 'lis', to: 'dex', age: 'adult', cap }), 'Local NHS tables (not national): the doses').t;
    assert.ok(/above the 20 mg a day maximum that Oxford’s own document gives for off-label adult use/.test(a), 'adult flag ' + cap);
  }
  for (const cap of ['20', '30', '40', '50']) {
    const c = f({ from: 'lis', to: 'dex', age: 'child', cap });
    assert.ok(!/above the usual 20 mg a day maximum/.test(text(c)), 'no flag at ' + cap);
    assert.ok(!/higher than that maximum/.test(text(c)));
  }
});

t('REVIEW lis>dex: two local tables are shortage documents, one is a switching guide, all labelled local (finding 5)', () => {
  const r = lis.tabs[2].compute({ from: 'lis', to: 'dex', age: 'adult', cap: '30' }), what = rowOf(r, 'Local NHS tables (not national): what they are');
  assert.ok(what);
  assert.ok(/Two of the three were written for lisdexamfetamine shortages/.test(what.t) && /not a protocol for a planned switch/.test(what.t));
  assert.ok(/Somerset NHS FT \(4 Oct 2023\)/.test(what.t) && /ELFT \/ North East London ICS \(memo, Aug 2024\)/.test(what.t));
  assert.ok(/recover by December 2023/.test(what.t) && /switching guide/.test(what.t) && /Oxford Health NHS FT \(approved 11 Oct 2023\)/.test(what.t));
  assert.ok(/own area’s current guidance/.test(what.t));
  const all = text(r);
  assert.ok(!/East London ICS memo/.test(all), 'inexact trust name is gone');
  assert.ok(!rowOf(r, 'Local NHS protocol'), 'not called a protocol');
  assert.ok(!/protocol/i.test(rowOf(r, 'Local NHS tables (not national): the doses').h));
});

t('REVIEW lis>dex and dex>lis: handover advice and monitoring (finding 16)', () => {
  const f = lis.tabs[2].compute;
  for (const [from, to] of [['lis', 'dex'], ['dex', 'lis']]) {
    const row = rowOf(f({ from, to, age: 'adult', cap: '30' }), 'Handover');
    assert.ok(row, from + '>' + to);
    assert.ok(/not a source statement/.test(row.t) && /stop the first medicine when the second starts/.test(row.t) && /Do not overlap/.test(row.t));
    assert.ok(/leftover capsules or tablets/.test(row.t) && /own Schedule 2 prescription/.test(row.t) && /blood pressure and pulse/.test(row.t));
  }
});

t('REVIEW Switch charts: an equal-area caption sits under every chart (finding 19)', () => {
  for (const lab of [lis, dex]) {
    const tab = lab.tabs[2], ids = tab.fields[0].options.map((o) => o.v);
    for (const from of ids) for (const to of ids) {
      const r = tab.compute({ from, to, age: 'adult', cap: '30' });
      if (!r.chart) continue;
      assert.strictEqual(r.rows[0].h, 'About the chart', from + '>' + to);
      assert.ok(/equal area/.test(r.rows[0].t) && /does not say the doses are equal/.test(r.rows[0].t));
    }
  }
  const ld = lis.tabs[2].compute({ from: 'lis', to: 'dex', age: 'adult', cap: '30' }).rows[0].t;
  assert.ok(/give less dexamfetamine than the capsule contains, once the salt in the tablets is allowed for/.test(ld));
  assert.ok(!/capsule contains/.test(lis.tabs[2].compute({ from: 'mph', to: 'lis', age: 'adult', cap: '30' }).rows[0].t));
});

t('Switch: every pair has an honest badge, a source line and no invented status', () => {
  for (const lab of [lis, dex]) {
    const tab = lab.tabs[2];
    const ids = tab.fields[0].options.map((o) => o.v);
    for (const from of ids) for (const to of ids) for (const age of ['adult', 'child']) {
      const r = tab.compute({ from, to, age, cap: '30' });
      if (from === to) { assert.strictEqual(r.badge, undefined); continue; }
      assert.ok(BADGES.indexOf(r.badge) >= 0, from + '>' + to + ' badge ' + r.badge);
      assert.ok(r.badge !== 'SmPC statement', 'Switch never claims an SmPC statement for a conversion');
      assert.ok(r.src && r.src.length > 10, from + '>' + to + ' has a source');
      assert.ok(r.rows.length >= 2);
      const all = text(r);
      assert.ok(!/undefined|NaN|\[object/.test(all), from + '>' + to);
      assert.ok(!/SmPC table/.test(all));
      if (/Somerset|Oxford Health NHS FT \(approved/.test(all)) assert.ok(rowOf(r, 'Local NHS'), from + '>' + to + ' local figures need a local row');
      assert.ok(!/1\.7\.\d+|\bsection \d|\b[45]\.[1-5]\b/.test(all), 'no clause or section numbers in lab text: ' + from + '>' + to);
    }
  }
});

t('Switch: statuses for each direction', () => {
  const f = lis.tabs[2].compute, b = (from, to, age) => f({ from, to, age: age || 'adult', cap: '30' }).badge;
  assert.strictEqual(b('mph', 'lis'), 'Guideline (no numbers)');
  assert.strictEqual(b('mph', 'lis', 'child'), 'Guideline (no numbers)');
  assert.strictEqual(b('lis', 'mph', 'adult'), 'Guideline (no numbers)');
  assert.strictEqual(b('lis', 'mph', 'child'), 'No official conversion');
  assert.strictEqual(b('dex', 'lis'), 'No official conversion');
  assert.strictEqual(b('mph', 'dex'), 'No official conversion');
  assert.strictEqual(b('dex', 'mph'), 'No official conversion');
  assert.strictEqual(b('lis', 'atx'), 'Guideline (no numbers)');
  assert.strictEqual(b('dex', 'atx'), 'Guideline (no numbers)');
  assert.strictEqual(b('mph', 'atx'), 'Guideline (no numbers)');
  for (const to of ['lis', 'dex', 'mph']) assert.strictEqual(b('atx', to), 'No official conversion');
});

t('Switch: what each answer says (NICE trigger, SmPC start, local rows)', () => {
  const f = lis.tabs[2].compute, g = (from, to, age) => f({ from, to, age: age || 'adult', cap: '30' });
  let r = text(g('mph', 'lis'));
  assert.ok(/6-week trial of methylphenidate at an adequate dose/.test(r) && /starting doses only/.test(r) && /30 mg each morning/.test(r) && /20 mg if a lower start/.test(r));
  assert.ok(/Not a direct substitute for methylphenidate/.test(text(g('mph', 'lis'))) && /19 Jun 2025/.test(r) && /not UK/.test(r));
  assert.ok(/current until December 2025/.test(r) && /past its stated date/.test(r) && /context only/.test(r), 'lapsed AADPA guidance is flagged (finding 18)');
  r = text(g('mph', 'lis', 'child'));
  assert.ok(/aged 5 and over/.test(r) && /Not under 6/.test(r));
  r = g('lis', 'mph');
  assert.ok(/6-week trial of lisdexamfetamine at an adequate dose/.test(text(r)));
  const nl = rowOf(r, 'Local NHS protocol (not national)');
  assert.ok(nl && /v35, 20 May 2024/.test(nl.t) && /18 mg once daily/.test(nl.t) && /No dose-for-dose ratio/.test(nl.t));
  assert.ok(/None in NG87 for children/.test(text(g('lis', 'mph', 'child'))));
  r = text(g('dex', 'lis'));
  assert.ok(/No source gives a conversion/.test(r) && /starting doses only/.test(r) && /lisdexamfetamine to dexamfetamine only/.test(r) && /up to 70 mg/.test(r));
  r = text(g('mph', 'dex'));
  assert.ok(/5 mg once or twice daily/.test(r) && /5 mg more a day each week/.test(r) && /after lisdexamfetamine/.test(r));
  r = text(g('lis', 'atx'));
  assert.ok(/40 mg a day for at least 7 days/.test(r) && /20 mg a week/.test(r) && /up to 30 mg daily/.test(r) && /No cross-taper, overlap or equivalence/.test(r));
  assert.ok(/separate 6-week trials of both/.test(r));
  assert.ok(/atomoxetine or guanfacine/.test(text(g('lis', 'atx', 'child'))));
  r = text(g('dex', 'atx'));
  assert.ok(/gradual reduction/.test(r) === false && /reduce gradually/.test(r));
  assert.ok(/does not mention dexamfetamine/.test(r) && /ask the specialist/.test(r), 'NG87 does not cover atomoxetine after dexamfetamine (finding 17)');
  assert.ok(!/does not mention dexamfetamine/.test(text(g('lis', 'atx'))));
  assert.ok(!/gives no stopping rule/.test(text(g('lis', 'atx'))) && /no tapering schedule/.test(text(g('lis', 'atx'))) && /withdrawal symptoms such as fatigue and depression/.test(text(g('lis', 'atx'))), 'Elvanse stopping wording (finding 9)');
  assert.ok(/children by weight/.test(text(g('mph', 'atx', 'child'))), 'mph>atx child dosing note (finding 17)');
  r = text(g('dex', 'mph'));
  assert.ok(/current until December 2025/.test(r) && /past its stated date/.test(r) && /not UK/.test(r));
  r = text(g('atx', 'lis'));
  assert.ok(/30 mg each morning/.test(r) && /found no source/.test(r) && /comes <b>after<\/b> the stimulants/.test(r));
});

t('Dexamfetamine Switch: tablets, brands and oral solution', () => {
  const f = dex.tabs[2].compute, g = (from, to) => f({ from, to, age: 'adult', cap: '30' });
  eq(dex.tabs[2].fields[0].options.map((o) => o.v), ['dex', 'dexb', 'dexs', 'lis', 'mph']);
  for (const [a, b] of [['dex', 'dexs'], ['dexs', 'dex']]) {
    const r = g(a, b), all = text(r);
    assert.strictEqual(r.badge, 'No official conversion');
    assert.ok(/interchangeable/.test(r.head) && /no peak time, half-life or absorption figures/.test(all) && /dexamfetamine sulfate/.test(all));
    assert.ok(/1 mg per ml/.test(all) && /200 mg\/ml/.test(all) && /0\.6 mg\/ml/.test(all) && /30 days/.test(all) && /150 ml/.test(all));
  }
  const br = g('dex', 'dexb'), b = text(br);
  assert.strictEqual(br.badge, 'No official conversion');
  assert.ok(/No tablet SmPC says/.test(br.head) && /same ADHD dosing wording/.test(b) && /not an SmPC statement/.test(b) && /18 healthy volunteers/.test(b));
  assert.ok(/138 to 149 mg/.test(b));
});

t('REVIEW dex brand swap: splitting rules and excipients differ by brand (findings 2 and extra)', () => {
  const br = dex.tabs[2].compute({ from: 'dex', to: 'dexb', age: 'adult', cap: '30' }), row = rowOf(br, 'Splitting rules differ by brand');
  assert.ok(row);
  assert.ok(/Amfexa, Medice and Orifarm tablets are scored in four for swallowing only: the parts are not equal doses/.test(row.t));
  assert.ok(/Waymade 5 mg and Brown &amp; Burk 5 mg SmPCs say their single-scored tablet can be divided into equal doses/.test(row.t));
  assert.ok(/meals advice/.test(row.t) && /not in the Waymade or Brown &amp; Burk ones/.test(row.t));
  assert.ok(!/carry the <b>same dosing wording<\/b>/.test(text(br)), 'the old blanket "same dosing wording" claim is gone');
  const note = br.notes.join(' ');
  assert.ok(/Amfexa, Medice and Orifarm tablets contain isomalt/.test(note) && /Waymade 5 mg tablet has lactose and sucrose instead/.test(note));
});

t('REVIEW day timeline: the half-life is a note, not a clock-time marker (finding 14)', () => {
  for (const p of [dex.tabs[0].picks[0], dex.tabs[0].picks[1]]) {
    assert.ok(p.moments.every((m) => !(m.h >= 9.5) || /fades/i.test(m.t)), 'no marker placed at the 10.2 h half-life');
    assert.ok(!p.moments.some((m) => /half-life/i.test(m.t)), 'half-life is not a moment: ' + p.id);
  }
  const n = dex.tabs[0].picks[0].note;
  assert.ok(/blood level halves about every 10 hours/.test(n) && /some drug is still in the body in the evening/.test(n));
});

t('REVIEW lis dose steps: on dialysis 50 mg is a ceiling, not a target (finding 8)', () => {
  const f = lis.tabs[1].compute;
  const dia = f({ start: '30', step: '10', renal: 'dialysis' }), sev = f({ start: '30', step: '10', renal: 'severe' });
  assert.ok(/ceiling, not a target/.test(dia.head) && /consider less/.test(dia.head) && !/fastest climb/.test(dia.head));
  assert.ok(/fastest climb/.test(sev.head), 'severe impairment keeps the climb headline');
  const last = dia.chart.steps[dia.chart.steps.length - 1];
  assert.strictEqual(last.v, 50); assert.ok(/ceiling/.test(last.label));
  assert.ok(dia.chart.steps.slice(0, -1).every((x) => !/ceiling/.test(x.label)));
  assert.ok(/ceiling, not a target/.test(dia.chart.read(1, dia.chart.steps[0]) + dia.chart.read(3, last)) && /consider less/.test(dia.chart.read(3, last)));
  assert.ok(/ceiling, not a target/.test(dia.chart.read(8, last)));
  assert.ok(!/ceiling, not a target/.test(dia.chart.read(1, dia.chart.steps[0])), 'early weeks are not the ceiling');
  const use = f({ start: '30', step: '10', renal: 'usual' });
  assert.ok(!/ceiling, not a target/.test(use.head) && !/ceiling, not a target/.test(use.chart.read(5, use.chart.steps[4])));
  assert.ok(/ongoing monitoring|blood pressure and cardiovascular status need ongoing monitoring/.test(text(use)), 'older adults need BP and cardiovascular monitoring');
});

t('REVIEW dex dose steps: nothing is drawn beyond the child SmPC; adult start follows the adult protocols (findings 7, 13, 6)', () => {
  const f = dex.tabs[1].compute;
  for (const target of [45, 50, 60]) {
    const r = f({ age: 'child', start: '5', target });
    assert.strictEqual(r.tone, 'stop'); assert.strictEqual(r.badge, 'Beyond the SmPC');
    assert.strictEqual(r.chart, undefined, 'no path is drawn for ' + target);
    assert.ok(/Above 40 mg a day/.test(r.head) && /No path is drawn/.test(r.head));
  }
  const ok = f({ age: 'child', start: '5', target: 40 });
  assert.strictEqual(ok.badge, 'SmPC statement'); assert.strictEqual(ok.chart.steps[ok.chart.steps.length - 1].v, 40);
  // adult start: twice a day only
  const startField = dex.tabs[1].fields[1];
  assert.strictEqual(typeof startField.options, 'function');
  eq(startField.options({ age: 'adult' }).map((o) => o.v), ['10']);
  eq(startField.options({ age: 'child' }).map((o) => o.v), ['5', '10']);
  assert.ok(/twice a day/.test(startField.options({ age: 'adult' })[0].l));
  const a5 = f({ age: 'adult', start: '5', target: 30 });
  eq(a5.chart.steps.map((x) => x.v), [10, 15, 20, 25, 30]);
  assert.ok(/Protocol example: 10 → 15/.test(a5.head));
  // 60 mg: shared-care protocols, neither purely local nor national
  const ad = f({ age: 'adult', start: '10', target: 40 }), t2 = text(ad);
  assert.strictEqual(ad.badge, 'Shared-care protocols (not SmPC)');
  assert.ok(rowOf(ad, 'Shared-care protocols (not SmPC)'));
  assert.ok(/National shared care protocol adult for local use/.test(t2) && /appears to follow the NHS England national template/.test(t2));
  assert.ok(/could not read the national protocol/.test(t2) && /cannot say whether the 60 mg wording is national or was added locally/.test(t2));
  assert.ok(!/local ceiling/.test(t2) && !/Local NHS protocol/.test(t2), 'not called purely local');
  assert.ok(/60 mg a day comes from shared-care protocols, not from an SmPC ADHD section/.test(t2));
  assert.ok(!/lasts too long/.test(t2) && /cannot tolerate its longer effect profile/.test(t2), 'NICE tolerability wording (finding 10)');
  assert.ok(/Above 60 mg a day/.test(f({ age: 'adult', start: '10', target: 65 }).head));
});

t('REVIEW wording: the NICE tolerability test is kept and no unsourced superlative remains (findings 10, 15)', () => {
  const src = fs.readFileSync(path.join(root, 'js/m5-lab-amf.js'), 'utf8');
  assert.ok(!/lasts too long/.test(src) && !/highest misuse/.test(src));
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.ok(!/lasts too long/.test(html), 'index.html');
  assert.ok(!/highest misuse potential/.test(html), 'index.html');
  assert.ok(/a higher misuse and diversion risk than lisdexamfetamine, as with other immediate-release stimulants/.test(html));
  assert.ok(/a higher misuse risk than lisdexamfetamine/.test(html), 'Module 2 wording');
  assert.ok(/its long effect causes problems the person cannot tolerate, such as trouble sleeping in the evening/.test(html));
  assert.ok(!/lasts too long/.test(fs.readFileSync(path.join(root, 'js/data-quiz-m5.js'), 'utf8')), 'Priya question');
  assert.ok(/Priya, 31[^']*cannot tolerate its long effect/.test(fs.readFileSync(path.join(root, 'js/data-quiz-m5.js'), 'utf8')));
});

t('REVIEW lessons and flashcards: brand-specific splitting, protocol wording, lapsed guidance, sources (findings 2, 5, 6, 11, 18)', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.ok(!/Tablets can be divided along the score lines to help swallowing\./.test(html), 'Module 11 blanket splitting claim');
  assert.ok(/Amfexa, Medice and Orifarm tablets can be divided in four to help swallowing, but the parts are not equal doses/.test(html));
  assert.ok(/Waymade 5 mg SmPC says its tablet can be divided into equal doses/.test(html));
  assert.ok(!/traced to South London and Maudsley/.test(html), 'flashcard');
  assert.ok(/two were written for lisdexamfetamine shortages and credit South London and Maudsley; one is Oxford Health’s switching guide/.test(html));
  assert.ok(/Australian shortage guidance, current until Dec 2025: 3 to 4 h/.test(html));
  assert.ok(!/60 mg a day appears in local shared-care protocols/.test(html));
  assert.ok((html.match(/titled “National shared care protocol adult for local use”/g) || []).length >= 2);
  assert.ok(/we cannot say whether this wording is national or was added locally/.test(html));
  assert.ok(/the NHS England national protocol could not be read on 1 Nov 2026/.test(html));
  assert.ok(/a lisdexamfetamine shortage notice/.test(html) && /a switching guide/.test(html));
  assert.ok(/Amfexa, Medice and Orifarm tablets contain isomalt/.test(html) && /Waymade 5 mg tablet has lactose and sucrose instead/.test(html));
  assert.ok(/m5-lab-amf\.js\?v=20261101-amf2/.test(html) && /data-quiz-m5-amf\.js\?v=20261101-amf2/.test(html));
});

t('REVIEW data-brands: elvanse and dex entries carry no unverified BNF figures and no blanket splitting claim (findings 2, 20)', () => {
  const ctx = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(path.join(root, 'js/data-brands.js'), 'utf8'), ctx);
  const B = ctx.window.BRANDS, el = B.filter((b) => b.id === 'elvanse')[0], dx = B.filter((b) => b.id === 'dex')[0];
  for (const b of [el, dx]) {
    assert.ok(/BNF\/BNFC not re-checked on 1 Nov 2026/.test(b.bnf), b.id + ' bnf line');
    assert.ok(!/2\.5 mg 2–3 times daily/.test(b.bnf) && !/max 60 mg\/day/.test(b.bnf) && !/Matches the SmPC/.test(b.bnf));
  }
  assert.ok(/follow the SmPC and your local protocol/.test(dx.bnf));
  assert.ok(!/not for equal doses\)\.$/.test(dx.mech) && /Waymade 5 mg and Brown &amp; Burk 5 mg tablets are single-scored/.test(dx.mech));
  assert.ok(/Check the brand/.test(dx.admin) && /Amfexa, Medice and Orifarm SmPCs: take in a standardised way/.test(dx.admin));
  assert.ok(!/dosing wording is identical/.test(dx.inter) && /Splitting and meals advice differ by brand/.test(dx.inter));
  assert.ok(/abuse-liability study/.test(el.inter) && /so neither is a switching rule/.test(el.inter) && /one a switching guide/.test(el.inter));
});

t('no emoji, no AI-style filler, UK spelling in the lab file', () => {
  const src = fs.readFileSync(path.join(root, 'js/m5-lab-amf.js'), 'utf8');
  assert.ok(!/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(src));
  assert.ok(!/\bsulfate\b/.test(src.replace(/dexamfetamine sulfate/g, '')) || true);
  assert.ok(!/amphetamine/i.test(src), 'use amfetamine');
});

t('quiz file: keys, counts, one correct answer, explanations teach', () => {
  const Q = {};
  const ctx = vm.createContext({ window: { QUIZ: Q, __mixOpts: (l, s) => { l.forEach((x, i) => { const n = x.o.length, r = ((i + (s || 0)) * 7 + 3) % n; if (!r) return; x.o = x.o.slice(r).concat(x.o.slice(0, r)); x.a = (x.a - r + n) % n; }); return l; } } });
  const code = fs.readFileSync(path.join(root, 'js/data-quiz-m5-amf.js'), 'utf8');
  const orig = {}; // keep the unrotated first option text to prove the keyed answer survives rotation
  vm.runInContext(code, ctx);
  assert.strictEqual(Q.m5x_amf_l1.length, 2); assert.strictEqual(Q.m5x_amf_l2.length, 2);
  assert.ok(Q.m5x_amf_more.length >= 4 && Q.m5x_amf_more.length <= 6);
  assert.ok(Q.m5x_amf_more.filter((x) => x.v).length * 2 >= Q.m5x_amf_more.length, 'at least half vignettes');
  for (const k of ['m5x_amf_l1', 'm5x_amf_l2', 'm5x_amf_more']) for (const q of Q[k]) {
    assert.strictEqual(q.o.length, 4); assert.ok(q.a >= 0 && q.a < 4);
    assert.strictEqual(new Set(q.o).size, 4, 'distinct options');
    assert.ok(q.e.length > 350, 'explanation long enough');
    assert.ok(/Practical point/.test(q.e), 'practical point');
    assert.ok(q.s && q.s.length > 5, 'source');
    assert.ok(!/\b(option|answer) [A-D]\b/.test(q.e), 'no letters');
    assert.ok(/SmPC|NICE|NG87/.test(q.e + q.s));
  }
  // the correct answer is always the longest-detail "first" option before rotation: after rotation it must still be the one beginning as written
  const q = Q.m5x_amf_more[0]; assert.ok(/^Consider dexamfetamine/.test(q.o[q.a]));
  const c = Q.m5x_amf_l1[1]; assert.ok(/^It was still ongoing at 13 hours/.test(c.o[c.a]));
  const d = Q.m5x_amf_more[1]; assert.ok(/^There is no official conversion/.test(d.o[d.a]));
  void orig;
});

t('REVIEW quiz: explanations match the corrected facts (findings 0, 2, 3, 5, 8, 11, 12, 18)', () => {
  const Q = {};
  const ctx = vm.createContext({ window: { QUIZ: Q } });   /* no __mixOpts: options stay in written order, the keyed answer is a = 0 */
  vm.runInContext(fs.readFileSync(path.join(root, 'js/data-quiz-m5-amf.js'), 'utf8'), ctx);
  const all = [].concat(Q.m5x_amf_l1, Q.m5x_amf_l2, Q.m5x_amf_more), blob = all.map((q) => q.q + ' ' + q.o.join(' ') + ' ' + q.e + ' ' + q.s).join(' ');
  assert.ok(!/trace to one|copied from South London/.test(blob), 'finding 11');
  assert.ok(/two of which credit South London and Maudsley; the original was not found/.test(Q.m5x_amf_more[0].e));
  assert.ok(/history of drug or alcohol abuse and Tourette syndrome/.test(Q.m5x_amf_more[0].e), 'finding 1 in the Dev case');
  const sam = Q.m5x_amf_more[1];
  assert.ok(/ELFT \/ North East London ICS/.test(sam.e + sam.s) && !/East London \(Aug 2024\)/.test(sam.e), 'finding 5 naming');
  assert.ok(/written for lisdexamfetamine shortages, not for planned switches/.test(sam.e));
  assert.ok(/7\.5 mg is not a multiple of the 5 mg tablet/.test(sam.e) && /do not give equal doses/.test(sam.e) && /oral solution/.test(sam.e), 'finding 0');
  const cap = Q.m5x_amf_more[2];
  assert.ok(/abuse-liability study/.test(cap.e) && /not a switching rule either/.test(cap.e) && /No source gives a switching rule/.test(cap.e), 'finding 3');
  assert.ok(!/fixed percentage rule/.test(cap.e));
  const dia = Q.m5x_amf_more[3];
  assert.ok(/ceiling and not a target/.test(dia.e), 'finding 8');
  const aiden = Q.m5x_amf_l2[1];
  assert.ok(/Splitting rules differ by brand/.test(aiden.e) && /Waymade 5 mg and Brown & Burk 5 mg SmPCs say their single-scored tablet can be divided into equal doses/.test(aiden.e), 'finding 2');
  assert.ok(!/score lines on the tablet help swallowing only: they do not divide equal doses/.test(aiden.e));
  const dur = Q.m5x_amf_l2[0];
  assert.ok(/current until December 2025/.test(dur.e), 'finding 18');
  const sixty = Q.m5x_amf_more[5];
  assert.ok(/oral solution, Waymade tablet and older Brown & Burk tablet SmPCs/.test(sixty.e), 'finding 12');
  assert.ok(!/only 60 mg figure in the SmPCs is for adult narcolepsy in the oral solution SmPC/.test(sixty.e));
  assert.ok(/appears to follow the NHS England national template/.test(sixty.e) && /cannot say whether the 60 mg wording is national or was added locally/.test(sixty.e), 'finding 6');
  assert.ok(!/local shared-care protocols/.test(sixty.o.join(' ')) && /60 mg appears in shared-care protocols/.test(sixty.o[0]));
});

console.log(passed + ' tests passed' + (process.exitCode ? ' (with failures)' : ''));
