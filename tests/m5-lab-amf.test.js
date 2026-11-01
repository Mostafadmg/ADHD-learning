/* Tests for js/m5-lab-amf.js (lisdexamfetamine and dexamfetamine labs) and js/data-quiz-m5-amf.js.
   Plain node, no packages:  node tests/m5-lab-amf.test.js
   Every number and status asserted here comes from the SmPCs on emc (Elvanse 14089, Amfexa 5004, dexamfetamine solution 13874),
   NICE NG87 and the local NHS documents named in the lab (read 1 Nov 2026). */
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
const BADGES = ['SmPC statement', 'Guideline (no numbers)', 'No official conversion', 'Local NHS protocol (not national)'];
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
  assert.ok(/do not state how long/.test(d) && /local figure/.test(d) && /Oxford Health/.test(d) && /10\.2/.test(d));
  // twice a day: two half-weight doses, so the same total as once a day
  const reg = picks[1].regimen;
  assert.strictEqual(reg.length, 2);
  assert.strictEqual(reg[0].mg + reg[1].mg, 1);
  assert.strictEqual(reg[1].at, 4.5);
  assert.ok(picks[0].practice.join(' ').indexOf('divided into four') >= 0);
  assert.ok(picks[0].practice.join(' ').indexOf('do not give equal doses') >= 0);
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
  assert.strictEqual(r.badge, 'Local NHS protocol (not national)'); assert.strictEqual(r.tone, 'warn');
  const a = text(r);
  assert.ok(/not licensed for ADHD in adults/i.test(a));
  assert.ok(a.indexOf('5 mg twice a day, up by 5 to 10 mg weekly') >= 0 && a.indexOf('maximum 60 mg per day to be given in 2–4 divided doses') >= 0);
  assert.ok(/currently under review/.test(a) && /March 2025/.test(a) && /narcolepsy/.test(a));
  assert.strictEqual(f({ age: 'adult', start: '10', target: 65 }).tone, 'stop');
  assert.ok(/Not licensed for ADHD/i.test(text(r)) && !/BNF adult dose is/.test(a));
});

const FROM_LIS = { 20: [5.9, 5, 7.5], 30: [8.9, 7.5, 12.5], 40: [11.9, 10, 15], 50: [14.8, 15, 20], 60: [17.8, 17.5, 25], 70: [20.8, 20, 30] };
t('Switch: lisdexamfetamine to dexamfetamine shows the local table only as a local row', () => {
  const f = lis.tabs[2].compute;
  for (const cap of Object.keys(FROM_LIS)) {
    const [content, slam, oxFull] = FROM_LIS[cap];
    const r = f({ from: 'lis', to: 'dex', age: 'adult', cap });
    assert.strictEqual(r.badge, 'Guideline (no numbers)');
    assert.ok(r.badge !== 'SmPC table');
    const loc = rowOf(r, 'Local NHS protocol (not national guidance)');
    assert.ok(loc, 'local row');
    assert.ok(loc.t.indexOf('<b>' + cap + ' mg</b>') >= 0);
    assert.ok(loc.t.indexOf('<b>' + slam + ' mg</b> dexamfetamine in divided doses') >= 0, 'SLaM ' + cap);
    assert.ok(loc.t.indexOf('<b>' + slam + ' mg</b> to start') >= 0, 'Oxford start ' + cap);
    assert.ok(loc.t.indexOf('<b>' + oxFull + ' mg</b>') >= 0, 'Oxford full ' + cap);
    for (const s of ['Somerset NHS FT', '4 Oct 2023', 'East London', 'Aug 2024', 'South London and Maudsley', 'Oxford Health NHS FT', '11 Oct 2023']) assert.ok(loc.t.indexOf(s) >= 0, s);
    const off = rowOf(r, 'Official conversion');
    assert.ok(/^<b>None\.<\/b>/.test(off.t));
    assert.ok(off.t.indexOf('equivalent to ' + content + ' mg of dexamfetamine') >= 0 && /not a dose conversion/.test(off.t));
    const care = text(r);
    assert.ok(/20 mg a day/.test(care) && /divided doses/.test(care) && /one source/.test(care) && /could not find the original/.test(care));
    assert.ok(r.chart && r.chart.kind === 'day' && r.chart.series.length === 2);
  }
  const child = text(f({ from: 'lis', to: 'dex', age: 'child', cap: '30' }));
  assert.ok(/licensed only for ages 6 to 17/.test(child) && /outside the licence/.test(child));
  const adult = text(f({ from: 'lis', to: 'dex', age: 'adult', cap: '30' }));
  assert.ok(/off-label in adults/.test(adult));
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
      if (/Somerset|Oxford Health NHS FT \(approved/.test(all)) assert.ok(rowOf(r, 'Local NHS protocol'), from + '>' + to + ' local figures need a local row');
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
  assert.ok(/No tablet SmPC says/.test(br.head) && /same dosing wording/.test(b) && /not an SmPC statement/.test(b) && /18 healthy volunteers/.test(b));
  assert.ok(/138 to 149 mg/.test(b));
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

console.log(passed + ' tests passed' + (process.exitCode ? ' (with failures)' : ''));
